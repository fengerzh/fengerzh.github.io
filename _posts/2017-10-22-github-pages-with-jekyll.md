---
title: 在Github Pages上建立Jekyll博客
image: https://res.cloudinary.com/fengerzh/image/upload/github-jekyll_pnw16x.webp
category: 运维
tags:
- github-pages
- jekyll
- ruby
introduction: Github Pages与Jekyll的完美配合使你可以直接用Markdown语言撰写博客。
color: black
---

# 意义

我认为：一个没有博客的程序员不是一个优秀的程序员。因为写代码本身的创作过程和写文章是类似的，能写代码就能写文章，我不相信一个优秀的程序员会写不出文章来。写文章的好处有三大点：

1. 可以记录自己的成长轨迹；
2. 可以起到抛砖引玉的作用帮助他人；
3. 可以建立个人品牌。

算了，说这些也没有用，清者自清，浊者自浊，大家各自还是好自为之吧，这种事情也不能强求的。总之，我认为，这是很有意义的一件事情。

# 实现

谈完了意义，下面我们来谈实现。我是用的倒推法：因为要写博客，所以就要有一个自己的域名，注册域名这件事情本身不是一件大事，一年几十元钱的事情，但麻烦在于天朝的管理制度那是相当的严格，岂止是一个域名的事情，简直还要备案，没有给企业干过网站的同学，你们不会了解这个备案的烦琐程度。好在Github给我们提供了一个平台，我的博客又不放在国内的服务器上，天朝的制度自然管不到我喽。省去了备案的麻烦，让我们可以集中精力好好搞好自己的网站。

## 建站

关于[怎么在Github的Pages上申请建站][1]的文章已经如汗牛充栋，在这里我就不细讲了，总之非常简单。这里需要注意的是，不要死板地照着别人的教程走，直接到[github官网][2]去申请注册就可以，不需要域名，如果你只是想试一试的话，以下的步骤都属于多余。但是既然玩了，就要玩大的。假设你的github账号是abc，那么你申请下来的网址就是abc.github.io。

## 申请域名

这个也很简单，到处都是关于[如何申请域名][3]的文章，能花钱解决的事情，从来就不是大事。假设你申请了一个abc.com的域名，你可以建立一个www的CNAME指向abc.github.io，这样以后你再访问www.abc.com就能看到你自己的网站了。

## Jekyll

为什么要用[Jekyll][4]？原因有两点：第一，它是github官方推荐的；第二，它支持markdown。所以我们再也不需要管那些烦琐的css，只要按markdown语法写文章就行了。

## 模板

这部分大约是最麻烦的，这是因为网上已经有各种各样的模板，[免费的][5]也有，[收费的][6]也有，英文的也有，[中文的][7]也有，很容易让人挑花眼。我最后选择了一套免费的英文的模板[Jekflix][8]，以此为基础，开始我的漫漫程途。

## 定制

我没有采用直接把所有代码全部复制的作法，而是一点一滴地复制模板里的文件过来，复制一点看一看效果，复制一点看一看效果，用这样的方法逐渐摸清了整个模板每一块的功能，整个过程也是一个学习的过程，收获很大。没有必要囫囵吞枣式地把别人所有的代码原封不动照搬过来，就为了能尽快跑起来，那样没有什么意义，就算跑起来了，你也还是什么也没学到，要搞就彻底搞懂它。`Jekflix`模板里用到了`npm`的`package.json`来引入`gulp`进行`stylus`的编译，这些都是在逐渐摸索的过程中逐步搞清的。

## 搬家

因为我原先曾经在这里就是`SegmentFault`上用markdown写过[一些文章][9]，所以最想看到的就是直接复制粘贴的效果，还不错，费了一点时间，把每一篇文章直接粘过去，略作改动就可以了。不过我不会放弃`SegmentFault`的，毕竟这里还有很多朋友帮我点赞加积分，这种成就感是任何个人网站也比拟不了的。不过个人网站有个人网站的好处是比较自由，不拘泥于一定要写技术分享类的文章。

# 成果

最终的结果就是：我终于有了自己的域名自己的博客了：[http://www.fengerzh.com/](http://www.fengerzh.com/)，欢迎大家来访！当然最不可缺少的还有[所有的源代码][10]，供大家学习参考。所以这也是在`github`建站的又一个好处：你不但拥有了一个博客，并且同时拥有了一套开源的代码库，放眼世界，还有哪家能为程序员提供这样贴心的服务呢？


![clipboard.png](https://segmentfault.com/img/bVW5Q9)



  [1]: http://www.cnfeat.com/blog/2014/05/10/how-to-build-a-blog/
  [2]: https://pages.github.com/
  [3]: https://www.ename.net/
  [4]: https://jekyllrb.com/
  [5]: http://jekyllthemes.org/
  [6]: https://themeforest.net/category/static-site-generators/jekyll
  [7]: https://www.zhihu.com/question/20223939
  [8]: http://jekyllthemes.org/themes/jekflix/
  [9]: https://segmentfault.com/blog/fengerzh
  [10]: https://github.com/fengerzh/fengerzh.github.io
