---
title: vertical-align和baseline的关系
image: https://res.cloudinary.com/fengerzh/image/upload/vertical-align_bl1bo5.jpg
category: 前端
tags:
  - css
  - vertical-align
description: 水平居中相对简单，而垂直居中的问题如果没有透彻理解的话，即使这一次做出来了，下一次情况稍加不同，又变得无所适从。
color: black
---

如何让一段文字居中，在人类看来如此简单的问题，在 css 界却变成了多年令人头疼的问题，关于居中的文字如汗牛充栋，但每到用时还是会有问题。单单一个『中』是什么，在`css`里就有两种不同的称呼：`center`和`middle`，水平居中要用`center`，垂直居中要用`middle`（到了`css3`时代引入了更多混乱，flex 布局里垂直居中也可以用`center`了）。

水平居中相对简单，而垂直居中的问题如果没有透彻理解的话，即使这一次做出来了，下一次情况稍加不同，又变得无所适从。

关于垂直居中，`css`中最基本的一个属性就是`vertical-align`，要了解`vertical-align`，首先要了解`基线`(`baseline`)，因为`vertical-align`的缺省值就是`baseline`。[MDN 的文档][1]中只说了一句：`baseline: 默认。元素放置在父元素的基线上`。

那么这个`父元素的基线`到底是个什么鬼？怎么才能决定父元素的基线在哪里呢？

先来看一个简单的例子：

    <ul>
      <li class="container">
        <div class="aaa">
          aaa<br>bbb<br>ccc<br>ddd<br>eee<br>fff
        </div>
        <img src="https://www.google.com.hk/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png">
      </li>
    </ul>

相关`css`:

    .container {
      border: 1px solid green;
    }
    .container img {
      width: 300px;
      border: 1px solid red;
      vertical-align: baseline;
    }
    .aaa {
      display: inline-block;
      border: 1px solid red;
      vertical-align: baseline;
    }

为了清楚起见，我们给每一个元素都加上边框，并且写明`vertical-align: baseline`，然后我们来看一看效果：

![clipboard.png](https://segmentfault.com/img/bV1SBj)

注意最左侧那个黑点，我们特意要留着它。在这里，可以很清楚地看到，当我们指定`vertical-align`为`baseline`的时候，文字是贴着底边的，但图片并没有贴底，而是位于最下面一行文字的中间。也就是说，对于图片来说，所谓的『父元素的基线』其实指的是**最下面一行文字的中间**。

这是文字多的情况，那么文字少的情况呢？也是一样，图片的底边始终等于我们最下面一行文字的中间：

![clipboard.png](https://segmentfault.com/img/bV1SCQ)

现在我们只改动一行代码，让`img`的`vertical-align`等于`middle`，这时候，诡异的情况发生了：

![clipboard.png](https://segmentfault.com/img/bV1SFk)

因为我们最左侧的文字部分的`vertical-align`还是`baseline`，而只有右边的`img`的`vertical-align`改成了`middle`，所以整个父元素的基线向上漂移了，现在文字部分依然对齐向上漂的父元素的基线，而图片是以自己的中线对齐父元素的基线，这就是`middle`的作用。

那如果我们倒过来看一下，图片依然`vertical-align: baseline`，而文字`vertical-align: middle`呢？

![clipboard.png](https://segmentfault.com/img/bV1SGW)

不出所料，父元素的基线向上漂移，文字元素以自己的中间对齐父元素的基线，而图片以自己的下边缘对齐父元素的基线。

最后，我们把文字和图片的`vertical-align`都设置为`middle`：

![clipboard.png](https://segmentfault.com/img/bV1SI6)

一般来讲，这个才是我们真正想要的结果。

所以结论是说，如果我们想要在父级元素里对两个或更多行内元素做垂直居中的话，是需要分别给所有元素设置`vertical-align: middle`的，因为这个属性不能继承，所以在`container`上设置没有用，需要给每个子元素设置。

感兴趣的同学可以来我的[Codepen][2]里玩一玩，看看是不是这么回事。

[1]: http://www.w3school.com.cn/cssref/pr_pos_vertical-align.asp
[2]: https://codepen.io/fengerzh/pen/LedqgB
