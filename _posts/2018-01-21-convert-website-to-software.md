---
title: 5分钟把任意网站变成桌面软件
image: https://res.cloudinary.com/fengerzh/image/upload/website-software_dopm6x.jpg
category: 前端
tags:
- electron
- nativefier
description: 介绍一个工具，让你`5`分钟之内就把一个网站变成一个可安装的桌面软件。
color: black
---
<div class="imageCaption" style="text-align: center; margin-bottom: 20px;">
  <em class="markup--em markup--figure-em">Display. 摄影师：Bram Naus 来源：</em>
  <a href="https://unsplash.com/" data-href="https://unsplash.com/" class="markup--anchor markup--figure-anchor" rel="nofollow noopener noopener" target="blank">
    <em class="markup--em markup--figure-em">Unsplash</em>
  </a>
</div>

以前，开发一个桌面软件要花费大量的人力和时间。现在，随着`web`技术的快速发展，很多业务逻辑已经在网站上实现。既然如此，能不能把网站快速转变成软件呢？这方面的实践已经有很多，早期的`Qt`，后来的`Electron`，都可以实现跨平台桌面软件的开发。不就是内嵌一个浏览器么？能不能快一些？再快一些？今天，给大家介绍一个工具，让你`5`分钟之内就把一个网站变成一个可安装的桌面软件。

# 制作软件

让我们以[https://segmentfaut.com][1]这个网站为例来制作我们的软件。

## 安装工具

一句话搞定：

    npm i -g nativefier

## 开始制作

一句话搞定：

    nativefier "https://segmentfault.com"

## 运行软件

好了，软件制作好了，看看效果吧：

![图片描述][2]

就是这么简单，有没有？

## 可选步骤

以上是必经步骤，以下是可选步骤。

作人不可过于懒惰，进门之后，多多少少还是需要调整一下的。`Nativefier`提供了很多选项可供设置，包括应用软件名称、图标、初始窗口尺寸、是否全屏等等等等，具体可以到[官网][3]查询。

同时，在设置好这些选项之后，为了便于以后调整和使用，最好是做一个批处理脚本：

```
#!/bin/bash

nativefier --name "SegmentFault" "https://segmentfault.com/"
```

调整完参数之后，重新运行这个脚本就可以了。

# 制作安装包

制作完软件之后，我们得到是一个名为`SegmentFault.app`的应用程序，虽然已经可以执行了，但看上去不够专业，专业的安装包都是`.dmg`为后缀的文件，接下来我们就来制作一个`.dmg`。

打开Mac自带的**磁盘工具**，新建一个**空白映像**。

![图片描述][4]

初始时的大小设置为`200MB`，因为缺省的`100MB`放不下安装文件，但是这个尺寸后面可以压缩，所以即使设置为`300MB`也没关系的。

![clipboard.png](https://segmentfault.com/img/bV2orp)

建好之后，双击图标打开这个文件，把刚才上面做好的`SegmentFault.app`拷贝进去，然后再在里面建立一个指向`Applications`文件夹的快捷方式，右键菜单点击显示选项，勾选『**始终以图标显示方式打开**』，调整图标大小，在最下面挑选一张带箭头的图片作为背景。

![clipboard.png](https://segmentfault.com/img/bV2osj)

最后，再次打开磁盘工具，先推出刚才的这个文件，然后点击菜单『**映像**』-『**转换**』，把它压缩一下，一个完美的`dmg`安装包就制作好了。

![clipboard.png](https://segmentfault.com/img/bV2os1)

新的安装包大小大约是`51MB`，我把它上传到百度网盘了，有需要的同学可以[下载安装][5]试用一下。`Windows`的安装包我就不制作了，制作软件方法类似，只是在制作安装包的时候，`Windows`要稍微麻烦一些。

怎么样，制作一个桌面软件是不是很容易呢？你也来学着把贵司的网站变成软件吧！

  [1]: https://segmentfault.com/
  [2]: https://segmentfault.com/img/bV2nuw
  [3]: https://github.com/jiahaog/nativefier/blob/master/docs/api.md
  [4]: https://segmentfault.com/img/bV2nvn
  [5]: https://pan.baidu.com/s/1ghaT1mj
