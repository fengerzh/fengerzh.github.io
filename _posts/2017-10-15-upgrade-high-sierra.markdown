---
title: 升级High Sierra惊魂记
layout: post
date: '2017-10-15 13:27:44'
categories: osx upgrade
---

之前也升级过很多次操作系统，但从来没有这一次这样不顺利，记下来，也许能帮到遇到类似问题的朋友。

### 催化剂
> 催化剂，又称触媒，是能透过提供另一活化能较低的反应途径而加快化学反应速率，而本身的质量、组成和化学性质在参加化学反应前后保持不变的物质。

* USB键盘
* USB鼠标
* 16G U盘
* 另外一台Mac电脑

### 过程
出于对Apple品质的信任，虽然不是每次只要一发新版本就立刻去追，但也基本上会在新版本发布后的一个月内升级到最新系统，因为对我来说，新的永远比旧的好，否则我们干吗要发明新的？但是这次是真遇上了坑。

#### 第一天
我跟平常一样，在Mac的`AppStore`里点选了`High Sierra`，然后下载并安装。我的网络速度非常快，所以这一步不是问题，很快就下完了，然后开始安装。

随后，出大问题了，经过了几十分钟的等待之后，电脑重启的时候，竟然说`com.apple.DiskManagement error 0`。这是个什么鬼？我的iMac已经用了有六年了，这是说我的硬盘坏了吗？

赶紧上网查[资料][1]，才得知Apple已经在这一版里强制把`HFS`换成了`APFS`，需要在开机的时候**按住键盘上的Command+Option+R键**，进入Internet恢复模式。

但事情远没有那么简单。首先，我的键鼠都是无线的，在这一步总是容易出问题，于是把键盘和鼠标都换成有线的先，然后开始按住键盘重启，这时候屏幕上开始出现一个地球缓缓转动：
![internet.png][2]

问题是转动完了之后，屏幕停留在Apple Logo不走了：

![clipboard.png](https://segmentfault.com/img/bVWErJ)

再次查[资料][3]，有人说这是在从互联网上下载资料，可能要等8个小时，于是我把它扔在那里去上班了，12个小时之后我回来，它依然是这个样子！

#### 第二天

我决定不能再等了，这样等下去，不知要等到什么时候，于是我开始准备手工启动它。既然Internet慢，那么就进行吧。**按住Command+R**重启电脑进入恢复模式。

这次终于进来了：

![clipboard.png](https://segmentfault.com/img/bVWEso)

进入`Disk Utility`模式，手工把硬盘转换为`APFS`格式，转换过程倒比较顺利。然后重新安装macOS，然后，竟然说没有操作系统安装文件！泪奔。

#### 第三天

好吧，我开始按照[说明文档][4]，一步一步制作我自己的系统启动盘。首先，先下载一个`High Sierra`安装包，不进行安装，进行安装就毁了，然后制作好我自己的系统启动盘，把U盘插好，然后**按住Option键重新启动电脑**，选择U盘进行安装，一切似乎进展顺利。然后，走到100%，又不动了！而最关键的是在整个安装过程中，硬盘居然停转了好几次，到最后一次永久等待的时候硬盘彻底不转了！

![clipboard.png](https://segmentfault.com/img/bVWEtr)

再次查[资料][5]，有的说需要进安全模式重启电脑，好吧我**按住Shift键重启电脑**，在整个过程中几乎尝遍了Mac的各种启动方式，这一次似乎略有起色，硬盘倒是一直在转，没有停，但是走到100%又卡住了！硬盘的过电声音还在，但是明显硬盘已经不寻道了。

#### 最终

就在我几乎要放弃的时候，最后一次**什么键也不按**，重启一下电脑，然后我躺到床上准备睡觉了。突然，屏幕一黑，然后出现了在这个秋天最美丽的秋色：

![clipboard.png](https://segmentfault.com/img/bVWEuk?w=1200&h=803)

### 总结

这一次的更新，主要是升级了文件系统，也就是`APFS`，出于对技术更新的支持，新的文件系统还是值得期待的。但主要是Apple对于旧系统的考虑不周，并不能100%保证一定能顺利升级旧系统的文件系统，所以为了保险起见，在升级之先，先手工把自己的文件系统升级为`APFS`，会对操作系统升级有所帮助。

另外就是遇到问题不要慌，多准备一些电脑，万一这台要是实在不行，就扔了吧！

  [1]: http://www.jlgaines.net/2017/09/disk-management-error-0-during-update.html
  [2]: https://segmentfault.com/img/bVWErt
  [3]: http://www.mac-forums.com/macos-operating-system/331674-trying-reboot-internet-recovery-imac-taking-forever.html
  [4]: https://support.apple.com/en-us/HT201372
  [5]: https://discussions.apple.com/thread/8085357?start=0&tstart=0