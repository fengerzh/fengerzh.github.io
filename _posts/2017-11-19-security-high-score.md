---
title: 如何打造一个安全满分网站
image: https://res.cloudinary.com/fengerzh/image/upload/high-security_objath.jpg
category: 运维
tags:
- ssl
- nginx
description: 对于一个网站来讲，仅有功能是不够的，还需要考虑性能，仅有性能也不够，还需要考虑安全。
color: black
---

继上一篇《[如何打造一个全满分网站][1]》之后，这一次我们来谈谈如何打造一个在安全方面也能打满分的网站。因为对于一个网站来讲，仅有功能是不够的，还需要考虑性能，仅有性能也不够，还需要考虑安全。

由于网站安全方面涉及因素很多，例如如何防止`跨域攻击`，如何防止`SQL注入`等等软件开发方面的安全考虑，如果真想做到全面防护的话，还需要有更专业的机构进行漏洞检测，我们这里谈的只是最基本的在传输层面的`https`安全。

# 评测工具

跟上次的思路一样，开始动手之前，我们还是先来熟悉一下评测工具，这次介绍的主要是3个网站，前2个网站类似，基本上你如果在一个网站上拿不到高分，在另一个网站也是一样；第3个网站略有不同。

## 又拍云网络安全监测

`又拍云`为了推广自己的`HTTPS`服务，提供了一个[免费检测工具][2]。就拿我们熟悉的`segmentfault`来说吧：

![clipboard.png](https://segmentfault.com/img/bVYMpE)

很不幸，在安全方面完全不合格。`又拍云`提供的方案有两个：

1. 直接购买`又拍云HTTPS`服务；
2. 自己按照优化建议进行优化。

如果自己优化的话，其实最关键的核心问题是一点：`服务器易受到CVE-2016-2107漏洞攻击，降级为F`。只要解决了这个问题，评分就能上升很多。

## Qualys SSL Test

另外一个工具是[Qualys SSL Lab提供的免费服务][3]，和`又拍云`类似，但是不推销产品。还是拿`segmentfault.com`来做一下实验：

![clipboard.png](https://segmentfault.com/img/bVYNfX)

同样是`F`，不合格。根本原因还是在这个`CVE-2016-2107`。

## Security Headers

这个网站主要是用来检测网站的response header是否安全的，我们还是拿segmentfault.com来测试一下：

![clipboard.png](https://segmentfault.com/img/bVZawY)

得分也不高，有很多问题。

# 解决方案

## CVE-2016-2107

那么，到底什么是`CVE-2016-2107`呢？`Cloudflare`给出了[详细解释][4]，不过如果你不是安全方面的专家，基本上如读天书不知所云。

粗略地来讲，`CVE-2016-2107`是`OpenSSL 1.0`的一个漏洞，是`2016`年刚刚发现的编号为`2107`号漏洞。安全系统的漏洞就像人的衣服破了一个洞一样，对付漏洞的手段无非就是两个：要不然打个补丁接着穿，要不然换件新的。`OpenSSL`官方给出的解决方案是把`OpenSSL`升级到`1.0.2h`就行了。但是怎么升级是一个问题，如果你用`yum update`升的话根本也升不上去，况且就算升上去了，也于事无补，因为你的`nginx`软件包里用的继续还是旧版本的`OpenSSL`，只有用正确的参数重新编译`nginx`才能解决这个问题。关于如何编译`nginx`，可以参考我的《[免费给你的网站加上蓝色小闪电][5]》的后半部分。

但据我的实际测试发现，即使把`OpenSSL`升级到`1.0.2h`也无法解决此问题，为此直接把`OpenSSL`升级到了最新的`1.1.0g`，但造成的问题是`nginx`又不兼容了，为此还需要把`nginx`也升级到最新版本`1.13.6`。经过这样的升级后，你的网站穿上了新衣服，这个漏洞就算堵住了。

`nginx`的相关编译参数如下：

```
--prefix=/usr/local/nginx --with-http_ssl_module --with-openssl=/root/src/openssl-1.1.0g --user=nginx --group=nginx --with-http_realip_module --with-http_addition_module --with-http_sub_module --with-http_dav_module --with-http_flv_module --with-http_mp4_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_random_index_module --with-http_secure_link_module --with-http_stub_status_module --with-http_auth_request_module --with-http_geoip_module=dynamic --with-threads --with-stream --with-stream_ssl_module --with-http_slice_module --with-mail --with-mail_ssl_module --with-file-aio --with-http_v2_module --with-cc-opt='-O2 -g -pipe -Wall -Wp,-D_FORTIFY_SOURCE=2 -fexceptions -fstack-protector --param=ssp-buffer-size=4 -m64 -mtune=generic'
```

按照这个方法，还顺带解决了`http/2`的传输问题，详见《[免费给你的网站加上蓝色小闪电][6]》一文。

## ECC

解决完了`CVE-2016-2107`漏洞，我们来看一看证书，似乎和别人的不太一样：

![clipboard.png](https://segmentfault.com/img/bVYNin)

那么什么是`RSA`，什么又是`椭圆曲线`呢？简单来说，`RSA`是利用大数因数分解的困难性来增加黑客破解的难度。比如你问小明：`15`等于几乘以几？他可以很快答出`3x5`，如果你问他：`51`等于几乘以几？他可能就要掏出计算器来算一算，才能告诉你等于`17x3`。如果再问：`10,497,479`等于几乘以几？恐怕他拿着计算器也算不出来，正确答案是`3229x3251`，而实际上我们真正用于`RSA`的两个质数还要远大于这个数字，所以因数分解的困难性是保证`RSA`安全的重要前提。

然而，`2015`年的时候，号称[有一种算法已经可以破译RSA][7]，于是安全专家们又提出了`ECC(Elliptic Curve Cryptography)`，中文叫作“`椭圆曲线加密`”算法。`椭圆`我们都知道，但`椭圆曲线`是个什么东西呢？

这是一个`椭圆`：

![1755840904721629143.jpg][8]

下面这两个都是`椭圆曲线`：

![0021.jpg][9]

长的根本就不像好吧，那为什么又要叫`椭圆曲线`呢？简单来说，[椭圆曲线这个名称的来源只是和椭圆周长的计算有关][10]，从图形上看它们没有任何关系。

那好吧，这么一条曲线怎么加密呢？

![5727792a481655052539f83dc3591eec_hd.jpg][11]

加密的公式很简单，就如上图所示：`P+Q=R`，假设`R`就是我们的公钥，如果只给你一个`R`，让你反推出`P`和`Q`来，就像给你一个大数，让你对它进行因数分解一样困难，这就构成了`ECC`加密算法的安全保障。

听上去好高大上，那么我该如何获得一张`椭圆曲线加密算法`的证书呢？

花钱能办了的事那都不是事，重要的是我们可以免费获得！你要知道，以前一张`RSA`证书一年的费用是`5000`元，每年还要续费，这构成了很多商业公司盈利的重要来源，其中包括`Symantec`赛门铁克。

当你吃饭吃的很舒服的时候，市场就会出来搅局者。感谢开源软件精神，`Letsencrypt`砸掉了很多安全公司的饭碗。我在《[letsencrypt在nginx下的配置][12]》一文中曾经讲过如何配置`Letsencrypt`，后来又写过《[CentOS 6.5下利用Docker使用Letsencrypt][13]》，但是现在有更好的方法：[acme.sh][14]，你只需要安装好`acme.sh`：

```
curl https://get.acme.sh | sh
```

然后执行：

```
acme.sh --issue -w /home/wwwroot/example.com -d example.com --keylength ec-256
```

就可以得到一张免费的`椭圆曲线安全证书`了。注意上面命令结尾这个`ec-256`，`ec`是不是让你想起了什么呢？对的，这就是我们提到的`椭圆曲线`(`elliptic curve`)。

免费的证书有了，安装到你的`nginx`里看一下吧，证书签名算法瞬间变成了`椭圆曲线`！是不是立刻变得高大上了呢？重要的是还免费哦！

![clipboard.png](https://segmentfault.com/img/bVYNpj)


## CAA

升级完了椭圆曲线还不够，接下来我们再来看看`CAA(Certification Authority Authorization)`，中文翻译为`授权机构认证`。什么是`授权`？什么是`机构`？什么又是`认证`？

简单来说，你做了一个网站，为了安全起见，为了需要向别人证明你就是你，你需要一张网站的身份证，那么谁有权颁发这个证件呢？在中国，只有公安局有权发身份证，那么这个有权发证件，并且得到所有人认可的机构，就叫`授权机构`。但是互联网的世界比较乱，授权机构很多，万一要是有一个你不知道的机构，也给别人发了一张你的名字的身份证怎么办？所以为了杜绝这个隐患，你作为网站的所有者，你可以规定：只有这个授权机构颁发的证书，才是有效的证书，其它机构颁发的证书一律无效，这个就叫“`授权机构认证`”，以下简称`CAA`。

`CAA`是需要运行在`DNS`服务器之上的，但是目前国内的几乎所有`DNS`服务提供商没有一家提供这个服务，[CarterLi][15]兄的这篇文章《[给你的站点添加 DNS CAA 保护][16]》里提到了如何给自己的网站添加`CAA`，可以考虑把你的`DNS`搬家到能提供`CAA`服务的厂家去做一下。

## HSTS

`HSTS(HTTP Strict Transport Security)`，中文翻译为`HTTP严格传输安全`，就是让浏览器强制使用`HTTPS`与网站进行通信，以减少会话劫持风险，给你的网站安全再加一道锁。

给网站添加`HSTS`相对比较容易，只要在`header`里加一句

```
add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";
```

就行了。

## TLS 1.3

比`TLS 1.2`再上一个台阶，但目前还处于测试阶段，`OpenSSL 1.1.1`会支持，但目前还没有正式发表，所以暂时可以先不添加。你要想装也可以，这里提供[详细的安装步骤][17]。

## CSP

Content Security Policy的主要作用是让你的网站只执行限定范围内的Javascript脚本，CSS以及图片，所以我们可以在nginx里作如下限制：

```
add_header Content-Security-Policy "script-src 'self'";
```

更多的关于如何设置CSP的内容可以参考阮一峰的《[Content Security Policy入门教程][18]》

## X-Frame-Options

X-Frame-Options的作用是禁止别的网站iframe你的网站，在nginx里添加以下配置：

```
add_header X-Frame-Options "SAMEORIGIN";
```

## X-XSS-Protection

X-XSS-Protection的作用是防止跨站脚本攻击，在nginx里添加以下配置：

```
add_header X-XSS-Protection "1; mode=block";
```

## X-Content-Type-Options

X-Content-Type-Options的作用是禁止浏览器对你的网页内容进行MIME类型嗅探，而必须以你规定的方式解析网页，在nginx里添加以下配置：

```
add_header X-Content-Type-Options "nosniff";
```

# 总结

以上所有方案都实施之后，我们再来看一下网站安全评分：

![clipboard.png](https://segmentfault.com/img/bVYNsU)


![clipboard.png](https://segmentfault.com/img/bVZaOB)


`Certificate`拿到了满分，下面几项没有拿到满分，在`Protocol Support`这一项里，主要是由于没有对一些老版本的浏览器例如`IE8`，`Java 6`以及`Android 2`做兼容，这个问题不大，我们就先不解决了，其它两项`Key Exchange`和`Cipher Strength`应该是和我们使用的`Letsencrypt`有关，目前还不清楚具体原因，可以再研究。

无论如何，我们把一个安全得分只有`F`的网站，通过各种方法优化到了得分为`A+`，是不是小有成就感呢？你也来试一试吧！


  [1]: https://segmentfault.com/a/1190000011867361
  [2]: https://www.upyun.com/https
  [3]: https://www.ssllabs.com/ssltest/index.html
  [4]: https://blog.cloudflare.com/yet-another-padding-oracle-in-openssl-cbc-ciphersuites/
  [5]: https://segmentfault.com/a/1190000005184870
  [6]: https://segmentfault.com/a/1190000005184870
  [7]: http://www.freebuf.com/news/75346.html
  [8]: https://segmentfault.com/img/bVYNmn
  [9]: https://segmentfault.com/img/bVYNl5
  [10]: https://www.zhihu.com/question/26956530
  [11]: https://segmentfault.com/img/bVYNmW
  [12]: https://segmentfault.com/a/1190000005142228
  [13]: https://segmentfault.com/a/1190000007238745
  [14]: https://github.com/Neilpang/acme.sh
  [15]: https://segmentfault.com/u/carterli
  [16]: https://segmentfault.com/a/1190000011097942
  [17]: https://imququ.com/post/enable-tls-1-3.html
  [18]: http://www.ruanyifeng.com/blog/2016/09/csp.html
