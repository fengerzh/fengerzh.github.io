---
title: 用GeoChart和Firebase开发一个去过哪儿应用
image: https://res.cloudinary.com/fengerzh/image/upload/geochart_pxh2qh.png
category: 编程
tags:
  - geochart
  - firebase
description: 一步一步教你制作一个可存可取的去过哪儿应用，可以给任何人使用哦。
color: black
---

作为一个纯前端工程师，你是否也曾想过开发一个属于你自己的应用？在这个应用里，没有后端，没有`API`，你不再需要可怜巴巴地等待后端工程师给你设置数据库，给你打通第三方登录接口，而你自己一个人把所有这些事情全部搞定。那么今天我们来一步一步建立这个工程，这个只属于你一个人开发，但能提供给无数人服务的工程。

## GeoChart

`GeoChart`是属于`Google Charts`一部分的地理图表，`Google Charts`提供了各种各样的柱状图、饼状图、折线图等等图形，我们目前只关注`GeoChart`这部分。

> GoeChart 的官方参考资料见[这里][1]。

在`Google Charts`里同时还提供了一种图表叫`Maps`，它和`GeoChart`是不同的。`Maps`提供的是实体地图，`GeoCharts`提供的是矢量地图。因为我们在这里要做点击效果，所以需要用`GeoChart`而不是`Maps`。

用`GeoChart`画出一张地图来非常简单，只需要寥寥几行代码就够了：

```js
// 设定初始化数据
var userDataObj = {
  visitedCountries: [["Country", "Popularity"]],
};
// 设定选项
var optionsWorld = {};
// 页面启动时执行以下函数
google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
  // 指定要在哪里画地图
  var chartWorld = new google.visualization.GeoChart(
    document.getElementById("world")
  );
  // 画地图
  chartWorld.draw(
    google.visualization.arrayToDataTable(userDataObj.visitedCountries),
    optionsWorld
  );
}
```

然后，你就得到了一张世界地图：

![图片描述][2]

但是如果只是简单地按照以上代码，是产生不出来图片中这些绿色方块的。那么如何加上这些绿色方块呢？下一步，我们为代码增加鼠标点击的交互：

```js
google.visualization.events.addListener(
  chartWorld,
  "regionClick",
  function (e) {
    selectHandler(e, "world");
  }
);
```

当鼠标点击某一区域时，则调用`selectHandler`方法：

```js
function selectHandler(e, mapType) {
  // 给点击区域增加一个数值
  userDataObj.visitedCountries.push([e.region, 200]);
  // 重新绘制地图
  drawRegionsMap();
}
```

在这里，给每一个你点击的区域设定一个数据，然后调用以上函数重新绘制地图，就可以有这些绿色区域了。

## Firebase

现在只是简单地响应了用户的点击事件，如何保存这些数据呢？最简单的方法，你可以把这些数据保存在`LocalStorage`里面，但这样的弊端是如果换一台电脑，那么以前保存的数据就都丢失了，所以你需要保存在云端。`Firebase`提供了免费的服务供你使用，实际就是一个免费的`MongoDB`数据库。我们来看一下如何把自己的数据保存在`Firebase`里：

> Firebase 官方参考资料见[这里][3]。

```js
firebase
  .database()
  .ref("users/" + userDataObj.uid)
  .set(userDataObj);
```

这里的`uid`是`Google`为每一个访问你网站的用户提供的唯一编号，这样你就可以不只是为你自己提供服务，并且可以给任何访问你网站的人服务了，我们开发公开网站的目的不就是为此吗？

接下来，我们来看一下如何获取这个`uid`：

```js
firebase.auth().onAuthStateChanged(function (user) {
  userDataObj.uid = user.uid;
});
```

只要登录成功，就可以拿到这个`uid`了。但是要如何登录呢？别急，`Firebase`提供了[全套服务][4]：

```js
var uiConfig = {
  signInSuccessUrl: "index.html", // 登录成功之后跳转到index.html页面
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID, // 以Google账户登录，也可以以手机号或邮箱登录
  ],
};

var ui = new firebaseui.auth.AuthUI(firebase.auth()); // 创建登录区域
ui.start("#firebaseui-auth-container", uiConfig); // 把登录区域附加到页面指定位置
```

用户登录成功之后，需要从`Firebase`获取他/她之前保存的数据：

```js
var userData = firebase.database().ref("users/" + user.uid);
userData.on("value", function (snapshot) {
  var data = snapshot.val();
  userDataObj.visitedCountries = data.visitedCountries;
});
```

然后你就得到了一个可存可取的去哪儿应用可以给任何人使用了。并且你还可以制作中国地图哦，只要在创建地图时设定以下选项就好了：

```js
var optionsChina = {
  region: "CN",
  resolution: "provinces",
};
```

画好之后就是这样：

![图片描述][5]

> 这里还有一个小插曲：由于`Google`公司（以及美国的其它很多高科技公司都是如此）的很多关键技术岗位都被印度人把持，导致很多本该理想的设计出现偏差。在`GeoChart`的官方文档中明确写着如果我们在上面的选项中添加`domain`这一个选项的话，它是可以按照`domain`中指定的所在国的政治主张把地图中的争议地区标为所在国领土的。举例来说，如果我们把`domain`设为`CN`，则藏南地区的领土在这张地图中应该是不存在任何争议属于中国的。但是很遗憾，测试之后的结果并非如此，即使加了`domain: 'CN'`的选项，在这张地图里藏南地区依旧被标为争议领土。**但是，如果我们把`domain`设为`IN`的话，则藏南地区变成了印度的领土！**我们理解`domain`这一选项的设计是为了解决不同国家之前的争议，但是印度人在这个纯技术问题上玩弄这样的花招，实在是令人气愤！希望`Google`公司的中国工程师尽快解决此问题。

## 代码

以上简单描述了绘制地图、添加交互、用户登录等过程，实际代码还有很多判定，感兴趣的同学可以来我的博客《[一维度][6]》体验效果，所有代码都在[Github][7]开源，随时供大家参考。

[1]: https://developers.google.com/chart/interactive/docs/gallery/geochart
[2]: https://segmentfault.com/img/bV0sDt
[3]: https://firebase.google.com/?hl=zh-cn
[4]: https://github.com/firebase/firebaseui-web
[5]: https://segmentfault.com/img/bV0sIO
[6]: https://www.fengerzh.com/visit/
[7]: https://github.com/fengerzh/fengerzh.github.io/tree/master/visit
