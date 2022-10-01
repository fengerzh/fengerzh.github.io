---
title: Gitlab修复记
image: https://image-static.segmentfault.com/114/404/1144042704-6277b479732a4_cover
category: 运维
tags:
  - gitlab
  - docker
description: 大约三个月前的一天，Gitlab突然坏了。
color: black
---

## Gitlab 突然不能部署了

大约三个月前的一天，徒弟愁眉苦脸地跟我说：师傅，不好了，我最近用咱们这`gitlab`打包发布的时候总是失败。

我说：原先不是好好的吗？

他说：是啊，原先确实很好用，也不知道怎么了，最近这段时间就是不好用了，你说彻底不能用吧，也不是，偶尔也能用，但总要重试那么好几次，有时候甚至十几次才能用。

我仔细想了想，也没改啥啊，只是为了代码安全起见，把原先的`giblab`的 IP 地址从公网切换到了内网了，但是`DNS`我同时也改了，大家没有反映有什么问题啊。

我说：你这样的，你先把编译脚本改成`ping gitlab.mydomain.com`试试看能不能`ping`通。

`ping`了，不稳定，有时候通有时候不通。

这就奇了怪了，能`ping`到 IP 地址，说明`DNS`没有问题，只是到这个 IP 地址不通。（到此我依然执迷不悟，没有想到是路由的问题，后面再说）

## 被 MTU 误导的三个月

徒弟开始尝试用做减法的方式定位问题，很快有了重大发现。

只要我们不在任务中增加`docker:dind`服务，网络就没有问题，那说明问题就出在这个`dind`上。

`dind`的全称是`docker in docker`，因为本身我们编译用的`gitlab runner`就是运行在`docker`容器里面的，现在还要在这个容器里面再执行`docker`命令进行打包，就必须依赖这个`dind`服务，`dind`服务本身又是一个小的容器，它里面再启动一个`docker`守护进程，这样外面这个容器才能运行`docker`命令。

习惯性地打开 Google，开始面向 Google 解决问题。

很多网页都把问题的焦点指向了一个名叫`MTU`的神秘设置，说这个`dind`容器缺省的`MTU`是`1500`，在某种情况下会导致网络传输不稳定，跟我们遇到的这个症状很相似。

> 最大传输单元 (`Maximum Transmission Unit`)：最大传输单元是指资料链接层上面所能通过的最大数据包大小。最大传输单元这个参数通常与通信接口有关。 因特网协议允许 IP 分片，这样就可以将数据报包分成足够小的片段以通过那些最大传输单元小于该数据报原始大小的链路了。这一分片过程发生在 IP 层，它使用的是将分组发送到链路上的网络接口的最大传输单元的值。

问题变为：如何设置这个`MTU`？我们需要了解`gitlab`流水线任务中的服务里面的子容器如何设置，查了很多资料，有人信誓旦旦地说只要在`service`里增加一个`command`参数`mtu=1400`就可以了，但是实验之后发现还是不行，我们把命令行改为`ifconfig`，直接查阅网卡参数，发现还是`1500`，于是查阅[docker:dind 源码](https://github.com/docker-library/docker/blob/0efba9e3cd4537de89ba54de2ad8acc5e3b1759f/20.10/dind/dockerd-entrypoint.sh)，发现`dind`会读取一个环境变量`DOCKERD_ROOTLESS_ROOTLESSKIT_MTU`。

于是问题又变成了：如何设置这个环境变量以让`dind`读到？尝试了各种方法，`dind`依然读取不到。

静下心来，重新读[Gitlab 官网的文档](https://docs.gitlab.com/ee/ci/services/#available-settings-for-services)，里面介绍了一个参数`variables`：

> Additional environment variables that are passed exclusively to the service.
> 提供给服务使用的附加的环境变量

似乎这个东西就是我们想要的，但是它有附加条件：此设置只能用于`Gitlab 14.5`版本及以上。而我们的`Gitlab`版本还是`13.12.3`。

## 升级 Gitlab 惊魂记

我找了一个安静的周末，开始果断升级`Gitlab`，然后就差点陷入万劫不复之境。

我想，升级嘛，这还不是很简单的一件事情，而且对于我们这样严格守规矩的人来说，升级只是增加一个版本号而已。

`docker-compose.yml`里原本就已有这一句了，这还是大约一年前初始安装`gitlab`时设置好的：`image: 'gitlab/gitlab-ee:latest'`，那么这已经是最高版了，于是直接`docker-compose down`然后`docker-compose up -d`应该就可以了吧？

不是的，它还是`13.12.3`。

查资料，才知道应该先`docker-compose pull`下来才能得到最新版。

好吧，按步骤执行。

坏了，`gitlab`容器怎么不停地重启？赶紧执行`docker logs`检查容器，发现里面赫然写着一行大字：**大版本的升级，必须先升到 14.0 版本！**

郁闷，我们还是先看看[gitlab 升级说明书](https://docs.gitlab.com/ee/update/)吧，这里面倒是提到了升级路径：

> 8.11.Z -> 8.12.0 -> 8.17.7 -> 9.5.10 -> 10.8.7 -> 11.11.8 -> 12.0.12 -> 12.1.17 -> 12.10.14 -> 13.0.14 -> 13.1.11 -> 13.8.8 -> 13.12.15 -> 14.0.12 -> 14.9.0 -> latest 14.Y.Z

于是，直接将`docker-compose.yml`改成`image: 'gitlab/gitlab-ee:14.0.12'`，居然报告找不到包，再查阅`gitlab`标签，发现版本号后面居然还要有`-ee.0`，你这前面已经有 ee 了，为什么标签里还要再写一遍？（所谓 ee 就是企业版的简称`Enterprise Edition`，gitlab 现在其实不区分企业版和社区版，统一都要求大家使用企业版，只是你不付费的话，里面属于企业版的那部分功能就不能用而已）

改成`image: 'gitlab/gitlab-ee:14.0.12-ee.0'`再试一次，这次终于成功了！

好吧，再接再励，升到`14.9.0`，然而`gitlab`容器又起不来了！

再次打开`docker logs`查看，这次是满屏的字符飞滚，似乎在做什么数据库升级的事情，但是为什么会不停地重启呢？

再次 Google 搜索，说是`Gitlab`从`14.0`版本以后引进了数据库`migration`机制，每次升级都必须要等到上一个版本的迁移完成之后才能进行下一版本的升级，而且这个迁移过程可能长达几小时甚至数天！

坏了，我肯定是升级过快了，上一个版本还没倒腾完，我就开始升下一版本了 😭。

现在怎么办？我脑子飞快运转。向老板报告灾难？向同事们承认失误？说我把你们的代码全搞丢了？

冷静冷静。我想了五分钟，这么的吧，看能不能降级降回`14.0`。

于是我再次把`docker-compose.yml`里改成`14.0`。重新启动，祈祷数据没有丢失。

`14.0`总算是启起来了，但是当我访问页面的时候：

![image.png](https://segmentfault.com/img/bVcZBCx)

这下麻烦大了！

强忍悲痛，打开`docker logs`看，没有线索，报告说一切正常。

但页面就是`500`啊！

网上有资料说，遇到`500`不要慌，进到容器里面看端详。好吧，`docker exec -it`进到容器里面，运行`gitlab-ctl tail`看输出，这边一刷新页面，日志里面就报告缺少一个叫`services`的数据库表！

那不还是毁了吗？我这数据库弄不好升到一半，代码又是旧的，咋整？上又上不去，下又下不来，这下麻烦大了。

没办法，再次 Google，终于找到了[同命相怜的兄弟](https://forum.gitlab.com/t/error-relation-services-does-not-exist-after-upgrade-to-14-2-0/57593)。听听他的血泪控诉：

> 我从 13.12 升级到 14.0.7，我以为迁移已经结束了，一切都正常了，于是我就停止了容器，升到 14.2，结果启动不起来了，于是我就又退回到 14.0.7，这回产生了 500 错误，日志详情如下：
> `ActionView::Template::Error (PG::UndefinedTable: ERROR: relation "services" does not exist`
> 并且我没有备份。

简直跟我遇到的情况一模一样。底下有人说，`Gitlab`每次升级前会自动把数据库备份在`backup`文件夹下面，这哥们儿说并没有，我也去看了，也没有。

好在他提交的[bug 报告](https://gitlab.com/gitlab-org/omnibus-gitlab/-/issues/6352)里有咱们中国兄弟解决了这事，就是[这位](https://gitlab.com/chihang)：
![image.png](https://segmentfault.com/img/bVcZBCY)

方法竟然如此简单：慢慢升！

既然快升会出问题，就慢慢升，先升级到`14.1.1`，等迁移结束之后，再升级到`14.2.1`这样的。

抱着最后一丝希望，再次把`docker-compose.yml`升级到`14.1.1`，启动。

等了五分钟之后，容器终于启动起来了。

打开浏览器，访问网页，祈祷不要再`500`了。

啊，长舒一口气，终于看到了熟悉的页面。

可不敢乱动了。按照既定步骤，到管理员监控下面查看迁移进度，果然有`14`个任务正在迁移。等这`14`个任务迁移完成，我开始思考下一步行动。

## 终于找到了问题的根源

但是我还是想升级到`Gitlab 14.5`，我觉得既然已经站到`14.1.1`上了，而且迁移完成了，应该后续不会太难，保险起见，还是先升到`14.2.1`，这次也成功了。

我静静地等待迁移完成，然后再升到`14.9.0`。其实还可以再升到`14.10.0`，但是先不用了，`14.9.0`已经够用。

于是我们重新回到`Gitlab`，将`dind`的环境变量设置好，再次编译，不行，网络`MTU`还是`1500`。

再次搜索关于`dind`设置`MTU`的[问题](https://github.com/docker-library/docker/issues/103)，设置方法其实还是和以前一样，就是设置`command`就够了，然后查看`docker network inspect bridge`，但是这里的`MTU`和`ifconfig`查出来的`MTU`并不一样，`docker network`里虽然已经是`1400`了，但是`ifconfig`里显示的还是`1500`，这代表什么含义呢？

我模糊地感觉到，这个`docker`桥接网络的`MTU`可能和外面并不需要一致，但无论如何，容器里面现在已经是`1400`了，甚至可以更低，但无论如何总是和外面无法通讯，并且我还尝试了`ping www.baidu.com`也是可以`ping`通的，只有到我们的内网服务器无法`ping`通。

太累了，我先去睡个午觉。

醒来之后，躺在床上，我开始思考这个问题：如果我不添加`dind`服务，就可以`ping`通，如果我加上了，就`ping`不通，那说明这个`dind`服务修改了我的网络配置。

我看到如果我不加`dind`的话，我这个容器是两块网卡，一块是`eth0`，一块是`localhost`，这种情况下是正常的，但当我加上`dind`服务后，容器里就产生了三块网卡，多了一个`docker0`，会不会是我的这个`ping`请求只能在`eth0`上工作，不能在`docker0`上工作，而当增加了`dind`服务之后，所有的`ping`请求都自动跑到了`docker0`上去了呢？我能不能强制让`ping`请求走`eth0`呢？

再次尝试：`ping -I eth0 -c 10 gitlab.mydomain.com`，这次成功了！

那说明问题就出在`docker0`这块网卡上。

因为有了它，所有网络请求都走了这块网卡，导致网络不通。

那为什么网络请求会走这块网卡呢？仔细看它的`IP`设置，我突然意识到了问题。`docker0`是`docker`的桥接网络。

> By default, Docker uses 172.17.0.0/16 subnet range.
> 缺省情况下，Docker 使用 172.17.0.0/16 作为子网范围。

而我们的内网地址`172.17.111.27`刚好也是在这个网段内！

那么这就解释得通了，原先我们采用公网`IP`的时候没有问题，我们的容器访问`www.baidu.com`也没有问题，独独只有访问我们的内网服务器的时候有问题，因为我们的内网服务器地址刚好和`docker`的缺省内网地址重合，所以所有的网络请求都被转发到了`docker`的桥接网络内，导致无法与内网服务器通讯！

## 最后的决战

我们不可能也没有必要修改内网服务器的地址，现在要研究的是如何修改`docker`的缺省子网地址。

网上所有的贴子都是说修改`/etc/docker/daemon.json`这个文件，但是我们的容器里根本就没有这个文件，因为我们是在容器里面再起一个`dind`的服务，必须让`dind`取得这个修改之后的设置才行，而`gitlab`的`service`设置很有限，不可能轻易修改`service`容器里的内容。

又是一番激烈的搜索，最后在另外一个老哥那里找到了[答案](https://gitlab.com/gitlab-org/gitlab-runner/-/issues/28121)：

```
  variables:
    DAEMON_CONFIG: '{"bip": "192.168.123.1/24"}'
  services:
    - name: docker:dind
      entrypoint: ["/bin/sh", "-c", "mkdir -p /etc/docker && echo \"${DAEMON_CONFIG}\" > /etc/docker/daemon.json && exec dockerd-entrypoint.sh"]
```

原理也很简单：强行修改了`dind`这个服务的入口地址，在开始执行之前将我们想要修改的内容写入`daemon.json`，这下`docker`的桥接网格`docker0`的网段不和我们的内网网段重合了，应该就生效了。

按照这个方法修改之后，再次执行编译过程，现在我们再`ping gitlab.mydomain.com`直接就可以`ping`通了，不需要再指定网卡，说明整个网络已经正常。

至此，终于彻底解决了这个困扰我们三个月之久的问题：`在kubernetes网络中安装gitlab runner并运行一个docker打包的任务`。

---

回想解决问题的整个过程，还是在一开始的时候忽略了网络环境变化这个最大的变量，走了很多弯路，在这个过程中，我们了解了什么是`MTU`，了解了`Gitlab`应该如何升级，了解了`Docker`的桥接网络的设置。虽然吃了一点亏，但收获是巨大的，从此我们又可以畅通无阻地使用`Gitlab`来进行持续部署了。😄
