---
title: 用vscode开发vue应用
image: https://res.cloudinary.com/fengerzh/image/upload/vscode-vue.jpg
category: 前端
tags:
  - vscode
  - vue
description: 完整地讲述一下一个重度代码洁癖患者该如何用vscode开发vue。
color: black
---

现在用[VSCode][1]开发[Vue.js][2]应用几乎已经是前端的标配了，但很多时候我们看到的代码混乱不堪，作为一个前端工程师，单引号双引号乱用，一段有分号一段没有分号，有的地方有逗号有的地方没有逗号，空格回车都对不齐，还说自己做事认真，这不是开玩笑的事情。

![clipboard.png](https://segmentfault.com/img/bVbr7oo)

我们今天从头开始，完整地讲述一下一个重度代码洁癖患者该如何用`vscode`开发`vue`，以及如何把一个已经可以宣判死刑的全身各种格式错误几万条的项目整容成标准美女。

## 从安装开始

为了准确起见，我们把`vscode`里所有插件全部禁用，把用户设置清空，以让它尽可能恢复成原始的样子：

![clipboard.png](https://segmentfault.com/img/bVbr7os)

作为代码洁癖患者，对于系统的版本要求一定也是最苛刻的，不管什么时候，都让我们把所有的系统能升级的都升级到最高版本：

```bash
npm install -g @vue/cli
```

然后，我们开始创建项目：

```bash
vue create hello-world
```

在这里，一定要选择第一项：`babel + eslint`，这两个是必不可少的。我见到有些人嫌`eslint`麻烦，居然在项目建立好之后手工把`eslint`关掉的，简直无语。

![clipboard.png](https://segmentfault.com/img/bVbr7oF)

安装完毕：

![clipboard.png](https://segmentfault.com/img/bVbr7oG)

我们先不急着执行，执行代码是最容易的事情，我们先打开代码看一下：

![clipboard.png](https://segmentfault.com/img/bVbr7oH)

好吧，至少我们需要先安装[vetur 插件][3]。这几乎已经确定是开发`vue`项目的标配了，即使我不说，`vscode`也会强烈建议你安装它。

![clipboard.png](https://segmentfault.com/img/bVbr7oI)

装上`vetur`以后多少有点人样了。接下来我们来试一试能不能自动格式化，这部分才是洁癖患者的最爱。胡乱加几个空格，然后保存试试看：

![clipboard.png](https://segmentfault.com/img/bVbr7oM)

不能格式化，连个提示都没有！

## 用 lint 格式化

就算`vscode`里的`vetur`不能帮我们自动格式化，好在`package.json`命令里还有一个`lint`命令，我们看看`lint`命令能不能帮我们自动格式化：

![clipboard.png](https://segmentfault.com/img/bVbr7oN)

`lint`居然说没有错误！明明就是多了很多空格的错误好吧，为什么？

这是因为缺省的`vue-cli`没有为我们安装`@vue/prettier`插件，我们先来手工安装一下：

```bash
yarn add -D @vue/eslint-config-prettier
```

然后在`package.json`或者`.eslintrc.js`或者其它什么你设置`eslint`的地方，给它加上：

```js
    "extends": [
      "plugin:vue/essential",
      "eslint:recommended",
      "@vue/prettier"
    ],
```

特别是最后这一个`@vue/prettier`，非常重要。然后再执行`yarn lint`。多余的空格被自动干掉了，但是我们发现有一些地方同时也被篡改了：

![clipboard.png](https://segmentfault.com/img/bVbr7o2)

所有的单引号被变成双引号了，原本行尾没有的分号被加上了分号。这是为什么呢？因为我们虽然引入了`prettier`，但是还没有对`prettier`做设置，我们在项目的根目录下创建一个`.prettierrc.js`文件，然后在其中加入：

```js
module.exports = {
  semi: false,
  singleQuote: true
};
```

再次执行`yarn lint`，现在我们看到`lint`已经能够起作用了。它不但能把我们多余插入的空格删掉，并且能按照规则把双引号变成单引号，把行尾多余的分号删掉。当然，关于行尾加不加分号这是一个哲学命题，你可以根据你个人的喜好自行决定。在这里，我们权且按照 vue-cli 的标配执行。

![图片描述][4]

到这一步很关键，假设你拿到一个烂的不再烂的`vue`项目，里面有几千个`.vue`文件，几万个各种格式错误，也都能通过`yarn lint`这一行命令把它们全部修正过来！

## 在 vscode 里格式化

事情还没有完，我们注意到虽然`yarn lint`命令能在编写完代码之后帮我们格式化，但是既然我们是用`vscode`进行开发，我们当然希望能在`vscode`里直接看到对于错误的标注。

这时候我们需要在`vscode`里再安装一个插件[eslint][5]。

你以为安装上`eslint`插件就行了吗？不行的。因为`eslint`并不知道我们的`.vue`文件里面包含了`js`语法，所以还需要打开我们的`vscode`设置文件。

> 注意：这里一定要设置到**项目的设置**里，而不要只是设置到你自己个人的设置里，否则你团队的小伙伴随便一改又乱掉了。正确的方法是在你项目的文件夹下有一个`.vscode`文件夹，而`vue`最讨厌的地方是它居然会把这个文件夹放到`.gitignore`里，这个错误你必须要纠正过来，也就是说从`.gitignore`文件里把`.vscode`删掉。切切。

在你项目的`settings.json`里文件里添加以下代码：

```js
{
  "eslint.autoFixOnSave": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    {
      "language": "vue",
      "autoFix": true
    }
  ],
}
```

这时候所有错误都被标注出来了，注意看左侧，一定要让这个`settings.json`文件是绿色的，而不能是灰色的，如果是灰色的，请检查你的`.gitignore`文件：

![clipboard.png](https://segmentfault.com/img/bVbr7qf)

因为我们在`settings.json`文件里设置了`autoFixOnSave`，所以不管多么乱的格式，只要一按`Ctrl+S`保存，自动就帮我们把代码格式整理好了，是不是很方便呢？

## 和 Prettier 的冲突

有些时候我们的`vscode`里插件装的比较多，譬如还安装了[prettier 插件][6]，因为我们不只开发`vue`项目，可能还有其它类型的`js`项目特别是传统`js`项目，需要用到`prettier`进行美化，而`prettier`的一些功能是会和`eslint`相冲突的，比如说我们在全局设置了`prettier`的`formatOnSave`，这个功能就会和`eslint`的`autoFixOnSave`打架，为了避免这个矛盾，我们通常还会在本项目的`settings.json`文件里再多加几个选项，类似于这样：

```js
  "editor.tabSize": 2,
  "editor.formatOnSave": false,
  "prettier.semi": false,
  "prettier.singleQuote": true
```

有了这些设置，基本上`prettier`就不会和`eslint`打架了。

## 小结

以上就是用`vscode`开发`vue`程序的标配，并不像网上有些文章说的那么简单，不是只需要配一个`eslint`就能解决的事情，这里还用到了`vetur`，`eslint`和`prettier`，把几个工具综合用好，才能真正达到我们的错误随时可见，保存自动修改，更正既往错误的目的。希望每个前端工程师写出的代码都如出一人之手，漂亮简洁干净。

我们的目标始终如一：`0错误0警告`。

---

关于如何在 vscode 中进行规范化的 Vue 应用开发，我做了一个教程，感兴趣的同学可以到这里学习： [视频](https://segmentfault.com/ls/1650000019112557)

[1]: https://code.visualstudio.com/
[2]: https://cn.vuejs.org/index.html
[3]: https://marketplace.visualstudio.com/items?itemName=octref.vetur
[4]: https://segmentfault.com/img/bVbr7pz
[5]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
[6]: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
