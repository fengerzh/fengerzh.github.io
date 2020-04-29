---
title: 我的nginx锅炉片
description: 我在日常工作中经常会用到的nginx配置片段。
category: 运维
tags:
  - nginx
image: https://res.cloudinary.com/fengerzh/image/upload/boilerplate_gudueg.jpg
color: black
---

很多情况下，我们不需要了解事物的详情，只要知道这样做有效就够了，这种情况下我们就会用到`boilerplate`，中文俗称『**锅炉片**』。所谓锅炉片，其实就是一大段代码，你也不用管为什么这样，你只需要在用到的时候拷来拷去就行了。当然，如果你愿意钻研，非要琢磨清楚这一大段代码当中到底包含了什么意思，你也可以学到不少东西，不过不求甚解的话，也没有人指责你。

### gzip 压缩

```nginx
        gzip on;
        gzip_min_length 1k;
        gzip_buffers 16 64k;
        gzip_http_version 1.1;
        gzip_comp_level 5;
        gzip_proxied any;
        gzip_types text/plain application/x-javascript application/javascript application/octet-stream text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png image/svg image/svg+xml;
        gzip_vary on;
```

好吧，别问我为什么，我也不知道为什么，但总之这样有效。

`gzip`虽然好，但是如果开了`gzip`之后，`content_length`会消失，导致用户在下载文件时看不到下载百分比，所以如果需要的话，可以把相关的`content type`的`gzip`去掉以支持百分比，例如可以把上面的`application/octet-stream`去掉，以便用户在下载二进制文件例如`exe`以及`apk`时可以看到百分比。

另外这里的`gzip`是动态压缩，也就是说在内容生成的同时进行压缩，还有另外一个开关`gzip_static`，用来对静态文件进行压缩，但需要事先压缩，没有具体研究过。

### expire header

```nginx
        location ~* \.(css|js|gif|ico|jpg|png|svg|woff|ttf|eot|woff2)$ {
            expires 365d;
        }
```

这段代码相对好理解，给那些图片等文件加上一个一年的有效期。但有一点要注意：一定要把`root /opt/html;`放在`location /`外面，你要放在里面，你就等着`404`吧。

### 跨域

```nginx
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

给`OPTIONS`请求加一堆乱七八糟的头部，给`POST`或者`GET`再加两个头部，然后就可以跨域了，具体原因不解释，**安全责任自负**。

### 反向代理

```nginx
location ~ \.(csv|json|jhtml|jsp|action|ac)$ {
     expires -1;
     proxy_pass http://application;
     proxy_set_header Host $host:$server_port;
     proxy_set_header X-Real-IP $remote_addr;
     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

注意：`proxy_set_header`一定要加上`$server_port`，否则如果你的`web`服务器不用`80`端口的话，会出现`Tomcat`在重定向时自动定向到`80`端口的错误，我在这上面浪费了将近`8`个小时的时间才定位到这个错误。
