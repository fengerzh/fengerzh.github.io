---
title: 2019年最快的Javascript框架
image: https://res.cloudinary.com/fengerzh/image/upload/fastest-framework_joqgvx.jpg
category: 编程
tags:
  - javascript
description: 来体验一下2019年最快的Javascript框架。
color: black
---

来体验一下`2019`年最快的`Javascript`框架：

![图片描述][1]

速度是纯`nodejs`的`2`倍，更不用说其他依赖`nodejs`的框架例如`express/koa/hapi`了，根本不值一提，不但如此，性能还能吊打`spring`以及一众`php7`框架。

百闻不如一见，下面我们就来安装尝鲜：

```
npm install -g es4x-pm
```

这就装好了。下面我们来用它创建一个项目，新建一个空文件夹，然后：

```
es4x init
```

项目就建好了。

我们需要写一个最简单的 index.js 文件：

```js
console.log("hello");
```

直接启动吧：

```
yarn start
```

嗯，报了个错误：

```
error package.json: Name can't start with a dot
```

我们`package.json`里的名字不能只是一个点，得改一下：

```
"name": "hello",
```

再次启动，还是启不起，哦，我们还没有安装依赖：

```
yarn add @vertx/core
```

这样就能运行了，但是会报一个警告：

```
ES4X is using graaljs in interpreted mode! Add the JVMCI compiler module in order to run in optimal mode!
```

对于我们这样有洁癖的人不能忍受啊。

这是因为我们现在系统环境里的`Java`还是个旧的`Java`，而`Oracle`最新推出的`Graal`才是最新最好的`Java`，所以我们先安装一下`Graal`:

```
brew cask install graalvm/tap/graalvm-ce
```

再次执行`yarn start`

现在警告也没有了，一切顺利！

试着写点`ES6`的语法：

```
const a = () => {
 console.log('hello')
}

a()
```

一样可以顺利执行！

再往后就是生成`http`服务器，连接`mysql`等等，这些就跟其他框架大同小异了，不再细讲。

## 原理

我始终认为，用什么语言根本就是无所谓的，只有外行才讲什么语言是最快的。`JS`慢只是因为底层的`Node`慢，而`Node`的`V8`引擎又不是拿`JS`写的，而是拿`C++`写的。

现在的这个[es4x][2] ([中文文档][3])它一样能解释`JS`语言，只不过它的底层换成了`Java`，用的是`Eclipse`的[Vert.x][4]技术，而原生的`Vert.x`技术用的是`Java`旧版引擎，对`ES6`支持不好，换成`Oracle`最新的[GraalVM][5]就一切都解决了。当然也不能就此说`C++`比`Java`慢，那样你就又浅薄了。

有人抬杠说`JS`不能写操作系统底层，有什么不能写的？无非就是个语言而已，你把它编译成二进制就什么都能干了，没听说过[nexe][6]吗？

学了编译原理，你就知道语言是什么根本不重要。会说中文的没有必要看不起会说英文的，会说英文的没有必要看不起会说中文的，什么语言好，放在工程项目当中，重要的只是生态，其他都没有可比性。

[1]: https://segmentfault.com/img/bVbxYFf
[2]: https://github.com/reactiverse/es4x
[3]: https://reactiverse.io/es4x/zh/get-started/
[4]: https://github.com/eclipse-vertx/vert.x/
[5]: https://github.com/oracle/graal
[6]: https://github.com/nexe/nexe
