---
title: 2020再谈跨域
image: https://res.cloudinary.com/fengerzh/image/upload/cors-again_q2evfj.jpg
category: 编程
tags:
  - javascript
  - nginx
description: 跨域这个话题已经谈了很多年了，2020年还要再谈一下。
color: black
---

跨域这个话题已经谈了很多年了，怎么现在又要谈这个问题？本来是可以不必再提了的，但是由于`Chrome 86`版本以后又增加了很多限制，导致我们不得不再次提起。

## CORS

对于前端开发来说，跨域通常有两种方式，一种是在服务端修改`nginx`配置，在`response headers`里添加`CORS`设置，另一种是在本地架设代理。我们先谈第一种。

原本在`nginx`里添加`CORS`已经是一种常规操作，简单到无以复加：

```
    location /somewhere/ {
        if ($request_method = OPTIONS) {
            add_header Access-Control-Allow-Origin "$http_origin";
            add_header Access-Control-Allow-Credentials "true";
            add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
            add_header Access-Control-Allow-Headers "sitessubid,Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since";
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 200;
        }
        if ($request_method = POST) {
            add_header Access-Control-Allow-Origin "$http_origin";
            add_header Access-Control-Allow-Credentials "true";
        }
    }
```

然后我们只要在每个`axios`或者`fetch`请求里添加`withCredentials`就能自动把对应该服务器的`cookies`随请求一并发送了。

但问题在`Chrome 86`版本以后，`Chrome`强制给从服务端下发的每个`cookie`都增加了一个缺省的`SameSite`属性，并且强制把这个属性设置为`Lax`，从而导致我们的`withCredentials`不起作用，只要是跨域的情况，`cookies`连取都取不到，更不要提发送了。在这里我不想再详述`SameSite`的原理，感兴趣的可以去[这里](https://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)了解。

这就需要我们必须从服务端入手，修改`nginx`下发`cookies`时的`SameSite`属性。

## SameSite 和 secure

修改`SameSite`又分为两种情况：如果你用的是低版本的`nginx`，可能还不一定能完全解决问题，目前唯一能修改的变通之道是修改`cookie`的`path`，使它后面带上`SameSite`属性，例如这样：

```
proxy_cookie_path ~(.*) "$1; SameSite=none";
```

这里实际修改的是`cookie`里的`path`值，但由于附加了`;`，所以浏览器会认为自`;`以后的是新属性，所以也会接受这个`SameSite`设定。

但是仅此还不够，`Chrome`又要求如果`SameSite`值为`none`的话，则还必须设置`secure`属性，也就是要求所有下发`cookie`的域名必须使用`https`协议，所以最终修改的结果是：

```
proxy_cookie_path ~(.*) "$1; SameSite=none; secure";
```

但这种情况只能解决类似于`cookie`是以`path`结尾的情况，如果上游服务器下发`cookie`时不止有`path`，并且在`path`结尾指定了其它的`SameSite`，那就无能为力了，因为这么修改`path`之后`cookie`会变成：

```nginx
path=/; SameSite=none; secure; SameSite=Lax
```

浏览器仍然以最后一个`SameSite=Lax`为准。**目前低版本`nginx`对这个问题无解。**

但如果你是`nginx 1.19.3`及以上，新增了一个属性，可以更好地解决这个问题：

```nginx
proxy_cookie_flags one samesite=none;
```

添加`secure`标志的方法类似，参考[官方文档](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cookie_flags)，不赘述。

## localhost 的 https

由上可知，我们可以通过修改`nginx`的方法来改造跨域`cookies`的发送。但这时如果你又不想跨域了，还想用本地代理的方式来解决，又会遇到一个问题：因为我们上面在下发`cookies`的时候，缺省地给每个`cookie`都带上了`secure`属性，这就导致我们在使用本地代理的时候反而无法设置`cookies`，因为我们本地的开发服务器往往使用的是类似于`http://localhost:8080`这样的地址，它不是`https`协议，所以无法设置`secure`的`cookies`，那么怎么办呢？

我们只能动手改造我们的本地服务器，使它也支持`https`协议：

第一步，我们先生成根证书：

```bash
openssl genrsa -des3 -out rootCA.key 2048
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem
```

这时候我们会得到两个文件，一个是`rootCA.key`，一个是`rootCA.pem`。

我们把`pem`文件导入系统的钥匙链，并给予它完全的信任，这样以后再由它签发的证书才能被系统认可，否则即使我们用它签发了证书，浏览器一样会拒绝。

第二步，生成`localhost`证书：

我们先建立一个名为`server.csr.cnf`的文件：

```bash
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn

[dn]
C=US
ST=RandomState
L=RandomCity
O=RandomOrganization
OU=RandomOrganizationUnit
emailAddress=hello@example.com
CN = localhost
```

然后执行以下命令生成`server.key`文件

```bash
openssl req -new -sha256 -nodes -out server.csr -newkey rsa:2048 -keyout server.key -config <( cat server.csr.cnf )
```

再创建一个`v3.ext`文件：

```bash
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
```

然后执行以下命令生成`server.crt`文件：

```bash
openssl x509 -req -in server.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out server.crt -days 500 -sha256 -extfile v3.ext
```

好了，到此为止，这个`server.key`和`server.crt`文件就是我们真正需要的两个文件，我们把它们引入系统，不同的系统有不同的引入方法，以下例子是`react`的方法，建立一个`.env`文件：

```
SSL_CRT_FILE=server.crt
SSL_KEY_FILE=server.key
HTTPS=true
```

这时候再启动你的工程，`localhost`就带有`https`协议了。

---

跨域就是这么麻烦，但不论如何麻烦，我们不辞麻烦，也一定要解决它！
