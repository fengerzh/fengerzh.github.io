---
title: 最漂亮的编程主题
image: https://res.cloudinary.com/fengerzh/image/upload/coding_pp3xeq.jpg
category: 编程
tags:
  - vscode
  - font
description: 我近期最喜欢的主题和字体（没有之一）。
color: black
---

题目写的有点大，但确实是我近期最喜欢的主题和字体（没有之一），来自[一位前端妹子][1]的推荐。因为它太好看了，所以一定要大用特用，不但要用在`VSCode`上，并且还要用在`vi`上，所有一切能用的地方。

# 颜色主题——One Dark

颜色主题的名称基干是`One Dark`，应该最早是从`Atom`发展出来的，所以叫`Atom One Dark`，后来产生了变种如`One Dark Pro`，`One Dark Pro Vivid`等等，我在`VSCode`里选择的是[One Dark Pro][2]。

![screenshot2.png][3]

## 在 VSCode 里安装

安装方法很简单，直接在插件标签里输入`one dark`搜索就可以安装了。安装好之后怎么启用呢？

![clipboard.png](https://segmentfault.com/img/bVbhnKn)

在左上角菜单的首选项里找到颜色主题，就可以启用了。

## 在 vi 里安装

这么漂亮的主题，不用来装在`vi`里就可惜了。我们得做三件事：

第一，在`~`目录下建一个子目录`.vim`，然后在`.vim`目录下再建一个子目录`colors`，然后在`colors`目录下建一个文件`onedark.vim`，把[这个文件][4]的内容拷进去。
第二，在`.vim`目录下再建一个子目录`autoload`，然后在`autoload`下建一个文件`onedark.vim`，然后把[这个文件][5]的内容拷进去。
第三，在`~`目录下建一个文件`.vimrc`，把下面的内容拷进去：

```
if (empty($TMUX))
  if (has("nvim"))
    let $NVIM_TUI_ENABLE_TRUE_COLOR=1
  endif
  if (has("termguicolors"))
    set termguicolors
  endif
endif

syntax on
colorscheme onedark
filetype indent on
set smartindent
set expandtab
set shiftwidth=4
set paste
```

`PS.` 如果你的`vi`不等于`vim`，你还需要在`~/.config/fish/config.fish`里写上`alias vi=vim`，这样你的`vi`就等于`vim`了。

![readme_header.png][6]

# Fira Code 字体

是不是已经足够漂亮了呢？也不尽然，当当当当，我们的大杀器出场！[Fira Code][7]，这可是在`github`上高达`27,000`多颗星的字体啊，字体星数仅次于著名的`Font Awesome`，我简直爱死他的这个`&`符号了。

不同于颜色主题需要在两端安装，这个`Fira Code`字体只需要在`Mac`上安装就好了，因为`Terminal`只能使用客户端字体，所以不需要在服务器安装，只要把字体安装好之后，在`iTerm`里设置一下字体就好了。

## 安装

还是用我们最爱的`brew`来安装：

```
brew tap caskroom/fonts
brew cask install font-fira-code
```

## 在 VSCode 中设置字体

在`settings.json`中添加以下两行：

```
"editor.fontFamily": "'Fira Code'",
"editor.fontLigatures": true,
```

结合上面安装的颜色主题，现在的`VSCode`是不是看起来好漂亮了呢？

![图片描述][8]

还带连字符的，还有那个箭头函数，是不是好吓人？

## 在 iTerm 中设置字体

由于`vi`是在`iTerm`中运行的，所以我们只能通过为`iTerm`设置字体来间接影响到`vi`：

![图片描述][9]

现在，再通过`ssh`打开我们的`vi`编辑器，是不是也看到了漂亮的字体？

![图片描述][10]

虽然看上去远没有`VSCode`那么炫酷，但也足以在服务端爽心悦目了。

**祝你每天编程好心情！**

[1]: https://juejin.im/user/5a90166851882518c0797f50/pins
[2]: https://binaryify.github.io/OneDark-Pro/#/
[3]: https://segmentfault.com/img/bVNFIb
[4]: https://github.com/joshdick/onedark.vim/blob/master/colors/onedark.vim
[5]: https://github.com/joshdick/onedark.vim/blob/master/autoload/onedark.vim
[6]: https://segmentfault.com/img/bVbhnLv
[7]: https://github.com/tonsky/FiraCode
[8]: https://segmentfault.com/img/bVbhnMs
[9]: https://segmentfault.com/img/bVbhnMJ
[10]: https://segmentfault.com/img/bVbhnMS
