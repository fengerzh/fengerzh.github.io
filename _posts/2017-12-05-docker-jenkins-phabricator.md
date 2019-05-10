---
title: 如何在Docker里正确集成Jenkins和Phabricator
image: https://res.cloudinary.com/fengerzh/image/upload/jenkins-docker_ykt9g3.png
category: 运维
tags:
  - jenkins
  - docker
  - phabricator
description: 用Docker安装Jenkins非常简单，但要把一个运行在Docker里的Jenkins和Phabricator相集成，事情就变得不那么容易。
color: black
---

单独安装`Jenkins`并不复杂，用`Docker`安装`Jenkins`更加简单，甚至将`Jenkins`与`Phabricator`集成也不难，但要把一个运行在`Docker`里的`Jenkins`和`Phabricator`相集成，事情就变得不那么容易。

我把所有走过的坑全部隐藏，直接告诉你最正确的步骤。

## 通过 Docker 安装 Jenkins

这一步似乎很简单，但不要按照官方教程上所说的来，而按照以下命令执行：

```bash
docker run --name jenkins -p 8088:8080 -p 50000:50000 -v /var/jenkins_home:/var/jenkins_home -e PATH='/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/src/arcanist/bin' jenkins/jenkins
```

`-p 8088:8080`是为了避免`8080`端口冲突（毕竟只要是个`Java`程序就想占用`8080`端口），`-e`设置里特意增加了`/src/arcanist/bin`是为下一步集成`Phabricator`里的`Arcanist`做准备，因为如果不在这里设置好这个环境变量的话，后面会带来很大麻烦。

## 进 Docker 安装 Arc

因为官方提供的`Docker`里根本就没有`Arcanist`，所以我们必须进入`Docker`的容器，手工安装`arc`。

```bash
docker exec -it -u root jenkins bash
```

好在这个`Docker`并不复杂，只是一个`Debian`，所以我们以`root`用户进入，然后：

```bash
apt-get update
apt-get install php
apt-get install php-curl
apt-get install rsync
apt-get install vim
mkdir /src
cd /src
git clone git://github.com/facebook/libphutil.git
git clone git://github.com/facebook/arcanist.git
```

把你的`ssh`公钥私钥文件拷到`/var/jenkins_home/.ssh`里，因为后面不论是`git`还是`rsync`你都需要它们。然后再以`jenkins`用户身份进入`Docker`：

```bash
docker exec -it -u jenkins jenkins bash
```

然后：

```bash
arc set-config default http://your.phabricator.com/
cd /var/jenkins_home/.ssh
chmod 600 id_rsa
chmod 600 id_rsa.pub
```

至此，你已经把官方提供的`Docker`改得面目全非，才算正确地在`Docker`里安装好了`arc`和`Jenkins`。

## 配置 Phabricator 和 Jenkins

接下来的步骤，你就可以参照[官方教程][1]一步一步执行，我就不再重复了。

如果你也遇到了类似的头疼问题，希望这篇文章能够对你有所启发。

[1]: https://github.com/uber/phabricator-jenkins-plugin
