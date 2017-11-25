---
title: 如何打造一个全满分网站
image: https://res.cloudinary.com/fengerzh/image/upload/100_qjfwyi.jpg
category: 编程
tags:
- pwa
- lighthouse
description: 追求极致，步步完善，直到使一个网站达到完美的过程。
color: black
---

作为一个全栈互联网工程师，我们的目标决不仅仅满足于功能的实现，而且要包括性能、安全、易用性等等各方面的考量。那么是否有一些可以公开评测的标准，使我们能够准确地知道目前我们网站的质量水平在全行业中处于什么样的水平呢？随着技术水平的不断进步，网站评测方面的各种工具也在不断演进。

# 工具

> 工欲善其事，必先利其器。

想要知道自己网站的质量水平，凭想像和猜测是不行的，必须要有可以客观衡量的工具。

## YSlow

最早做这方面尝试的是2012年诞生于`Yahoo`的[YSlow][1]，但是现在已经逐渐淡出历史舞台。它的名称实际上是英文`Why Slow`(为什么这么慢？)的缩写，从它的名字你应该能知道它是帮助站长解决网页加载速度的工具。`YSlow`是一款浏览器插件，可以支持包括`Chrome`, `Firefox`, `Safari`等等主流浏览器。在浏览器上安装相应插件后，就可以对任意网站进行评测，最后给出一个总体评分。评测内容包括网页是否包含了过多的`HTTP`请求，`JS`和`CSS`是否经过压缩，是否采用`CDN`等等，主要是提供给站长一个优化的方向和参考建议。

![图片描述][2]

## PageSpeed

在`YSlow`之后，`Google`推出了自己的网页优化建议工具[PageSpeed Insights][3]，这是一个网页工具，你不需要像`YSlow`一样下载插件和安装，你只需要打开它的网页，输入任何你想测评的网址，就可以得到优化建议了。

![图片描述][4]

## GTmetrix

我最常使用的工具不是以上两款，而是一个名叫[GTmetrix][5]的网站，这个网站结合了以上两个工具，给出了更加完整的建议。

![图片描述][6]

## Lighthouse

更强大而严格的工具还是`Google`推出的[Lighthouse][7]。这也是一款浏览器插件，不过目前只能用于`Google`自家的`Chrome`浏览器。它从4个方面对任何网站进行评测，包括性能、易用性、最佳实践。我们下面将重点介绍如何能在这4个方面都完全满足`Google`的要求。

![图片描述][8]

# 优化

## GTMetrix

优化的第一步，我们还是先从`GTMetrix`开始。一般网站常见的问题和建议如下：

### CDN

通常情况下，你需要为你的网站开通`CDN`服务，以确保在地理位置上离用户最近的服务器可以优先为用户提供服务。提供`CDN`服务的厂商很多，而且价格并不昂贵，很多云服务商比如`阿里云`、`百度云`都有提供这方面的服务。

### Enable gzip compression

这一项主要是检查你的`nginx`服务器是否设置了`gzip`压缩传输的方式。打开你的`Chrome`开发者工具，检查`Network`标签里每一个请求的`Response header`，看一下是否有`content-encoding: gzip`，如果没有，说明你的网站没有设置gzip传输。

![图片描述][9]

> 解决方案：参照我的这篇文章[《我的nginx锅炉片》][10]设置。

### Add Expires headers

这一项也是很多网站缺失的配置，由于没有给`jpg`图片以及`css`和`js`设置合适的过期时间，导致每次访问网站都需要重新从网站读取内容，这是很多网站访问速度慢的原因。设置方式：同样，参照上一节所提到的文章。

> 解决方案：参照我的这篇文章[《我的nginx锅炉片》][11]设置。

### 图片大小

很多情况下，或者是出于无知，或者是出于偷懒，工程师们倾向于把一张大图用`css`方式缩小，例如这样：`width: 100px; height: 50px;`。导致的结果是这张图片在网页上看起来似乎图片缩小了，但实际上文件尺寸并没有变小。这也是很多网站变慢的主因。

> 解决方法：参照我的这篇文章[《用imgproxy自动缩放图片》][12]设置。

### 雪碧图

如果你的页面中有很多小图标的时候，最糟糕的作法莫过于把它们全部切成小碎的`jpg`或者`png`，这样会使你的页面在加载时向服务器端发送很多次`http`请求，而每一次请求都有独立的建立连接、传输数据、断开连接的过程，非常浪费资源。

> 解决方案：如果可能的话，[把这些图标做成独立的图标字体文件][13]。如果不行，则[把它们压缩成雪碧图][14]。

### 压缩js和css

通常情况下，你刚刚写完的`js`是下图中左边这种样子的，而通常大公司网站的代码是图中右边这样的。

![clipboard.png](https://segmentfault.com/img/bVXWBp)

左边的代码人类阅读没有什么问题，但是你不应该把它们就这样在网络中传输。第一，浪费流量；第二，你能读得懂，你的友商也能读得懂，不利于安全。

> 解决方案：你应该把你的js/css/html进行[丑化(uglify)和压缩(minify)][15]。

## 终极大法

以上所有这些修改建议听上去都不错，但是我要一个一个做下来太繁琐怎么办？也许你应该考虑用一个现代的框架帮你自动完成这些事情，比如`Angular/React/Vue`，或者你自己使用`Grunt/Gulp/Webpack`完成所有这些事情。你知道这就是为什么前端工程师要学习框架的原因了吧？因为我的博客网站是全用`Jekyll`直接建在`Github Pages`上的，使用了`CloudFlare`做`CDN`，而它们已经自动帮我完成了所有这些烦琐的事情，所以起点比较高，很轻松就能在`GTMetrix`上得到99分的高分。

## Lighthouse

在完成了`GTMetrix`的要求，能够获得`99`分以上的高分之后，我们还想要达到更高的标准，挑战`Google`的`Lighthouse`满分！

`Lighthouse`从以下4个方面对网页做出评价，我们逐个来谈。

### 渐进式Web应用(Progressive Web Apps)

头一项标准[『渐进式Web应用』][16]，这个标准是`Google`自家发明的。其目的是为了让网站能在网络不畅通的情况下也能显示基本内容，或者上一次缓存的内容，而不是给出一个难看的『网络不通』的提示，并且能够让用户像安装普通应用一样直接把网页安装在手机上。PWA的终极理想是可以用网页应用来取代应用，所以目前并不被`Apple`支持。`Google`官网给出了关于如何实现`PWA`的详细指南，按照指南学习一步一步就可以构建出你的第一个`PWA`网页。建设完成后可以用`Lighthouse`来测试一下你的网页到底有多符合`PWA`标准。

> 渐进式Web应用标准共有11项。

下面重点介绍一下为了使一个网页能满足基本的`PWA`要求所必须要完成的工作：

#### manifest.json

首先，你的网站必须要有一个`manifest.json`文件，这个文件里描述了最基本的一些信息。比如我的网站的`manifest.json`文件是这样的：

```json
{
  "name": "日新亭",
  "short_name": "日新亭",
  "description": "苟日新，日日新，又日新",
  "start_url": "/index.html",
  "orientation": "any",
  "icons": [{
    "src": "/assets/img/icons/android-chrome-512x512.png",
    "sizes": "512x512",
    "type": "image/png"
  }, {
    "src": "/assets/img/icons/android-chrome-192x192.png",
    "sizes": "192x192",
    "type": "image/png"
  }],
  "theme_color": "#000000",
  "background_color": "#000000",
  "display": "standalone"
}
```

#### 关于favicon图片尺寸的选择

由于各种设备各种操作系统各种浏览器的差异，连一个最简单的`favicon`图片的选择都成了难题，每家厂商有描述各不相同，即使同一家厂商，也在各个不同的版本有不同的要求，比如`Google Chrome`在`37`版本以前要求`196x196`，`37`版本以后又要求`192x192`，而`Apple`官网又要求你提供至少`4`种尺寸：`180x180`, `167x167`, `152x152`, `120x120`，`Google TV`要求`96x96`, 任务栏要求`32x32`，普通浏览器要求`16x16`，还不包括`Windows`桌面各种大中小型图标的要求。面对如此纷繁复杂的要求，到底应该怎么办呢？一种方法是找个工具网站帮你解决这个难题，我推荐的网站是[这里][17]，因为作者对各种设备的`favicon`做过专门的研究；另一种做法是为简单起见，按我的模板来，只需要做`6`种图标就可覆盖大部分设备，`Apple`只需要一种`180x180`，因为小设备会自动缩小，另外`2`种`512x512`和`192x192`是为`Google`准备的，还有`3`种适应普通浏览器。

制作好图标文件之后，在你的`html`头部指定`manifest.json`文件的路径，指定页面的`theme-color`主题色，并且注意设定的主题颜色必须和页面中的颜色相一致，然后指定图标：

```html
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/assets/img/icons/favicon-16x16.png" sizes="16x16">
    <link rel="icon" type="image/png" href="/assets/img/icons/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/assets/img/icons/favicon-96x96.png" sizes="96x96">

    <!-- Apple Touch Icons -->
    <link rel="apple-touch-icon" href="/assets/img/icons/apple-touch-icon.png" />

    <link rel="manifest" href="/manifest.json">

    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="{{ site.title }}">

    <!-- Android Lolipop Theme Color -->
    <meta name="theme-color" content="{{ page.color }}">
```

#### serviceworker.js

在你的主页面当中增加以下代码用来判断浏览器是否支持`ServiceWorker`，如果支持的话，加载`ServiceWorker`文件：

```js
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  };
```

然后在根目录下增加一个`serviceworker.js`的文件：

```js
var cacheName = 'fengerzh';
var filesToCache = [
  '/',
  '/index.html',
  '/assets/js/main.js',
  '/assets/css/main.css',
  '/assets/img/placeholder.png',
  '/assets/img/icons/preloader.svg',
  '/assets/img/icons/read.svg',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
```

把指定的文件保存在缓存中，这样下次如果网络不通的话，浏览器会从缓存中取文件，而不会出现网络不通的画面。建好了`ServiceWorker`文件的页面，会在`Chrome`工具栏里看到这样的效果：


![clipboard.png](https://segmentfault.com/img/bVXXlD)


同时，完成了`PWA`效果的网站，可以让用户在手机中直接安装，比如：

![图片描述][18]

然后，就会在用户的主屏幕上生成一个带有你设定的图标的应用：

![图片描述][19]

点击图标打开应用，会来到一个没有任何`URL`地址栏和工具栏的页面，使用户完全感觉不到是在浏览网页：

![图片描述][20]

### 性能(Performance)

`Lighthouse`对性能的要求基本和`GTMetrix`差不多，如果你能在`GTMetrix`获得高分的话，通过`Lighthouse`的这一项测试应该不难。唯一多要求的一项是所有图片都要求是`webp`格式，但是`Safari`浏览器目前并不支持这种格式，所以如果你把网站上的所有`jpg`文件改成`webp`文件的话会导致你的网站里的图片在`iPhone`上不能显示。（我目前的网站全面采用了`webp`格式，不过会在不久的将来全面切换回`jpg`，主要原因是`iPhone`目前还不兼容。）

> 性能标准共有10项。

### 可用性(Accessibility)

可用性标准主要是指在制作网页时必须考虑残疾人的需求。

> 可用性标准共有8项。

#### Elements Use Attributes Correctly

这一项标准的要求之一是：所有图片必须有`alt`属性，这样如果图片不能显示时，也能出现合适的文字。当然还有很多其它要求，你可以根据`Lighthouse`给出的建议逐项调整。

#### Elements Describe Contents Well

这一项标准的要求之一是：所有`input`输入框必须有`label`或者`aria-label`。如下面这样：

```html
<input type="text" class="search-field" placeholder="搜索" aria-label="搜索">
```

#### Color Contrast Is Satisfactory

这一项标准的要求是所有字体的前景色和背景色的对比度需要足够强，以便于视力不好的人士能够分辨页面上的字迹。如果你不知道某两种颜色的对比度是否足够，可以用[这个网页][21]检测，绿色的Pass表示合格。

![clipboard.png](https://segmentfault.com/img/bVXXeC)

有时候这一标准会有误判，为了能让它通过，你可能需要设置额外的`background-color`属性，例如(`stylus`)：

```stylus
        p
            margin 0 0 rem(30px)
            background-color #141414
            color darken(lightGray, 20%)
            font-size rem(17px)
            line-height rem(26px)
```

### 最佳实践(Best Practice)

最佳实践标准是指一个理想网站所应该达到的最高标准。包括：避免使用`Application Cache`，避免使用`WebSQL`，使用`Http 2.0`，使用`https`，避免使用`document.write`，避免使用`console.log`等等。这些标准看上去很琐碎，但是每一项标准的提出都有其合理性，应当竭尽全力遵守。

> 最佳实践标准共有15项。

#### 使用http 2.0

关于如何开通`http 2.0`，可以参考我之前写过的一篇文章《[免费给你的网站加上蓝色小闪电][22]》。

# 成果

如果你完成了以上的所有优化步骤，相信你的网站应该可以得到一个比较高的评分了。现在我们随便找个网站评测一下看看吧，别人家的网站效果大抵都是这样的：

![clipboard.png](https://segmentfault.com/img/bVXWOb)

而我们的网站，经过调校之后的效果是这样的：

![图片描述][23]

是不是很有成就感呢？

----

以上所有代码都可以在我的[开源博客模板代码库][24]中找到，供大家学习参考，不吝啬的请大家给个星星吧！


  [1]: http://yslow.org/
  [2]: https://segmentfault.com/img/bVXTu4
  [3]: https://developers.google.com/speed/pagespeed/insights/
  [4]: https://segmentfault.com/img/bVXTvo
  [5]: https://gtmetrix.com/
  [6]: https://segmentfault.com/img/bVXTvv
  [7]: https://www.google.com.hk/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjc7P2MhaDXAhUJXrwKHajND50QFggoMAA&url=https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=zh-CN&usg=AOvVaw3kaHdMvwshxyDSFNHOQtML
  [8]: https://segmentfault.com/img/bVXTwO
  [9]: https://segmentfault.com/img/bVXTyh
  [10]: https://www.fengerzh.com/my-nginx-boilerplate/
  [11]: https://www.fengerzh.com/my-nginx-boilerplate/
  [12]: https://www.fengerzh.com/imgproxy/
  [13]: https://segmentfault.com/a/1190000005614532
  [14]: https://segmentfault.com/a/1190000006992567
  [15]: https://skalman.github.io/UglifyJS-online/
  [16]: https://developers.google.com/web/progressive-web-apps/
  [17]: https://realfavicongenerator.net/
  [18]: https://segmentfault.com/img/bVXXjW
  [19]: https://segmentfault.com/img/bVXXke
  [20]: https://segmentfault.com/img/bVXXkk
  [21]: https://dequeuniversity.com/rules/axe/2.2/color-contrast?application=lighthouse
  [22]: https://segmentfault.com/a/1190000005184870
  [23]: https://segmentfault.com/img/bVXTwO
  [24]: https://github.com/fengerzh/fengerzh.github.io
