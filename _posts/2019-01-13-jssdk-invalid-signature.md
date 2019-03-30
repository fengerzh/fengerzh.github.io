---
title: 微信 jssdk 签名错误 invalid signature
image: https://res.cloudinary.com/fengerzh/image/upload/invalid-signature_zhjvta.jpg
category: 前端
tags:
  - wechat
  - javascript
  - jssdk
description: 几乎每一个开发用于微信公众号页面的工程师都遇到过微信jssdk报的各种错误，通常是permission denied。
color: black
---

几乎每一个开发用于微信公众号页面的工程师都遇到过微信`jssdk`报的各种错误，通常是`permission denied`，类似这样：

![clipboard.png](https://segmentfault.com/img/bVbm8YB)

通常他们会建议你把`debug`选项开开，比如这样：

```js
wechat.config({
  debug: true,
  appId: appId,
  timestamp: timestamp,
  nonceStr: nonceStr,
  signature: signature,
  jsApiList: ['scanQRCode']
});
```

结果你又遇到了`invalid signature`。类似这样：

![clipboard.png](https://segmentfault.com/img/bVbm8YG)

签名不对，这是什么意思？可是这签名是后端给过来的，我怎么知道它为什么不对？后端用的是标准算法，不可能不对啊。

查网上各种教程，或者微信官网，他们总是不厌其烦地告诉你，让你去检查签名算法，然而根本没有用！

`90%`的这种情况下，其实只是一个原因：你用于计算签名的`URL`地址不对，跟算法没有任何关系，完全不必浪费时间去看什么签名算法。

> 我又遇到了一种新情况，所以还是有必要进入微信公众号管理后台按照以下顺序检查：**第一，在接口配置页面检查是否把你的服务器的域名加入了信任域名？第二，在基本配置页面检查是否把你的服务器的 IP 地址加入了白名单？**

微信要求：如果我们需要在页面中调用微信的某个方法，则必须用这个页面的`URL`地址获取签名。听上去似乎很好理解，但是实际上`URL`地址包含的部分很多，有问号，有`#`号，你所要做的是取出`#`前面的部分。比如说你的`URL`地址是这样：`https://www.abc.com/abc.html?abc=def#xyz`，那么你用于计算签名的`URL`地址不可以是`https://www.abc.com/abc.html`，也不能是`https://www.abc.com/abc.html?abc=def#xyz`，而必须只能是`https://www.abc.com/abc.html?abc=def`。

如何获取当前页面的`URL`地址呢？这个很简单：

```js
let wechaturl = window.location.href.split('#')[0];
```

然而你以为事情就这样结束了？太天真。你的页面还是无法正常使用微信函数的。

因为：微信内嵌浏览器在`iOS`和安卓下的表现不一样。

在安卓下，你确实用上面的方法是可以调用了。但是在`iOS`下，签名依然失败！因为在`iOS`下，微信需要你传递的是入口`URL`，而不是当前页面的`URL`！

比如说，你在微信公众号的某个菜单链接进入了`A`页面，然后从`A`页面的某个链接跳转到`B`页面，然后你在`B`页面获取签名，如果是在安卓下，你应该用`B`页面的`URL`地址来获取，但是在`iOS`下，你还必须用`A`页面的`URL`地址来获取，否则就还是签名失败！

知道了原因，就有很多种解决办法。

首先，我们可以在入口的`A`页面里增加这样的判断：

```js
if (navigator.userAgent.indexOf('iPhone') !== -1) {
  window.wechaturl = window.location + '';
}
```

然后，在`B`页面需要调用签名的地方，再增加这样的判断：

```js
let wechaturl = window.location.href.split('#')[0];
if (window.wechaturl !== undefined) {
  wechaturl = window.wechaturl;
}
```

这样我们就有效地区分开了`iOS`和安卓。但问题是在`iOS`下，如果我的另外一个菜单入口是`B`页面，我从`B`页面跳转到`A`页面，这时候我的入口链接被强制变成了`A`页面，依然会产生签名失败的错误。

所以我们还需要在微信公众号的每一个入口菜单链接里加一个特殊的参数，例如`wechat=1`，变成这样：`https://www.abc.com/abc.html?abc=def&wechat=1`，

然后我们再增加一层判断，变成这样：

```js
if (navigator.userAgent.indexOf('iPhone') !== -1) {
  if (
    this.$route.query.wechat !== undefined &&
    this.$route.query.wechat === '1'
  ) {
    window.wechaturl = window.location + '';
  }
}
```

这里我用了`vue`的写法，但原理是一样的。只有我检测到了`wechat`这个参数，我才认为当前页面是入口页面，如果没有检测到，则不必强行设置为入口页面。

这样似乎就解决了微信签名失败的问题。

但是，我们又遇到了另外一种情况：在微信小程序里用`web-view`内嵌的网页，在安卓下也报`permission denied`和`invalid signature`错误。不过有了上面的经验，我们诊断错误根源还是`URL`入口地址的问题。果然，在安卓下用入口地址获取签名成功，而用当前地址获取签名失败，为此，我们在入口页面里再加一个判断：

```js
if (navigator.userAgent.indexOf('miniProgram') !== -1) {
  window.wechaturl = window.location + '';
}
```

至此，各种签名错误的问题才算是全部解决。
