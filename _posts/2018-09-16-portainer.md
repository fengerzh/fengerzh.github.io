---
title: 如何安全便捷地管理Docker船队
image: https://res.cloudinary.com/fengerzh/image/upload/container_gsh9zr.jpg
category: 运维
tags:
  - docker
  - portainer
description: 如何管理船队就变成了一个难题，没有工具的帮忙，你甚至都不知道你有几条船，每条船上装的都是些什么货物，这些货物现在的状态如何。
color: black
---

# Docker

[Docker 是什么？][1]如果说你的服务器是一条船，你只是一个小船主，你的船上散装着各种货物（也就是服务，比如 http 服务，数据库服务，缓存服务，消息服务等等），那么`Docker`就相当于把你的服务器改装成了一条集装箱货船，把你原先凌乱堆放的货物放置在一个一个容器里，互相隔离，有序堆放。我们来看看`Docker`的商标，是不是很形象呢？

![Docker_logo_011.0.png][2]

但是你的业务越做越大，很明显一条船是装不下了，你需要一支船队：

![图片描述][3]

这时候，如何管理船队就变成了一个难题，没有工具的帮忙，你甚至都不知道你有几条船，每条船上装的都是些什么货物，这些货物现在的状态如何。

# Portainer

[Portainer][4]这个工具就是管理你船队的一个好帮手。并且它本身也是安装在一条船上，这条船就是你的指挥艇吧（说实话这个图标有点丑，一点都没有船队老大的气质）。

![图片描述][5]

怎么安装`Portainer`呢？这个[别人早都已经介绍过了][6]，包括[官网上也有说明][7]。但是我要介绍一下我的经验，我安装`Portainer`的方式和官网的也不同，和别人讲的也不同：

```
docker run -d --network=host --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer
```

在这里我们没有暴露`9000`端口，而是使用了一个特殊的设置：`--network=host`，就是这一点点小小的不同，会对你后面的操作影响巨大。

# Docker API

光装上`Portainer`是没有用的，它充其量也只能管理它所在的这条船。

它怎么管理整个船队呢？首先你得建立`Portainer`和船队里其它船只之间的联系。这个联系就是让被管理的船只暴露出`Docker API`接口来。但是如果你查看`Docker`官方的[说明文档][8]，把整个过程弄得极其复杂无比，又要建立什么安全证书中心，又要颁发证书，没有初中以上文化是搞不定的。

`Docker`本来是有一套简便的暴露端口的方法的，为什么官网要搞这么复杂呢？因为原先的方法比较简单，会直接把整个管理界面全部暴露给公网，有极大的安全风险，所以`Docker`官网搞了一套复杂的认证流程。

我们的解决思路比较简单：你不要把端口暴露给公网不就行了吗？加一个防火墙，只让我们允许的地址来访问就可以了，何必搞什么`CA`认证！

回到我们的被管理的船上，把`API`端口先暴露出来：

```
# systemctl edit docker
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd -H unix:///var/run/docker.sock -H tcp://0.0.0.0:2375
```

好吧，这只是`CentOS 7`下的一种作法，还有一种作法是修改`/etc/sysconfig/docker`文件：

```
OPTIONS='--selinux-enabled --log-driver=journald --signature-verification=false -H unix:///var/run/docker.sock -H tcp://0.0.0.0:2375'
```

具体应该用哪种作法，要取决于你的`docker`服务是怎么设置的：

```
systemctl show docker | grep EnvironmentFile
```

你如果有`EnvironmentFile`设定，那么你就需要用上面第二种办法，如果没有，就用第一种办法。

# iptables

好了，现在端口是暴露出来了，但是全公网任何人都能访问，安全性怎么办？这时候我们发现一个严重的问题：`Docker`在乱搞我们的`iptables`表！

`iptables`是很重要的防火墙的设置，`docker`为了暴露它的服务，它会忽视你设置在`iptables`表里的一切规则，强行让它的规则生效。这还了得？我们必须禁止`Docker`这么胡搞，在上面的`options`里再加上一个选项`--iptables=false`：

```
OPTIONS='--selinux-enabled --log-driver=journald --signature-verification=false -H unix:///var/run/docker.sock -H tcp://0.0.0.0:2375' --iptables=false
```

重启`Docker`服务后，它终于不再乱动我们的`iptables`表了。实际上为了安全起见，我们应该在所有`docker`服务器上都加上`--iptables=false`的选项。但是这样又产生了另外一个问题：外部访问固然是阻止了，但我们的`Docker`容器想访问外部也访问不了了，比如我们一开始安装的`Portainer`也是运行在容器里的，不能访问互联网，它就没有办法管理其它`Docker`服务器了。为了解决这个问题，需要我们在建立`Docker`容器的时候指定`--network=host`，这也就是本文一开始安装`Portainer`时候那样设置的原因。

好，现在各个被管理端的`2375`端口是开开了，但是除了`localhost`谁也访问不了它，怎么办？我们可以在`iptables`里增加一条规则：

```
-A INPUT -s ###.###.###.### -m state --state NEW -m tcp -p tcp --dport 2375 -j ACCEPT
```

上面那个`###.###.###.###`就是你的`Portainer`指挥艇服务器的`IP`地址。这样一来，除了这台指挥艇服务器可以访问被管理船只的`Docker API`接口以外，别的任何人都不能访问。这样就既达到了我们管理的目的，又保证了安全，同时还免出去了设置证书的繁琐。

**启航吧，船队！**

![图片描述][9]

[1]: https://www.zhihu.com/question/28300645
[2]: https://segmentfault.com/img/bVbg17H
[3]: https://segmentfault.com/img/bVbg171
[4]: https://portainer.io/
[5]: https://segmentfault.com/img/bVbg18O
[6]: https://www.jianshu.com/p/b6cee67c0a8f
[7]: https://portainer.io/install.html
[8]: https://docs.docker.com/engine/security/https/
[9]: https://segmentfault.com/img/bVbg2aX
