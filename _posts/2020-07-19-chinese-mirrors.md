---
title: 一站配齐所有国内镜像
image: https://image-static.segmentfault.com/347/504/3475044146-620ef27b108b1_cover
category: 编程
tags:
  - javascript
  - python
  - rust
  - php
description: 以下列出我常用的所有国内镜像，方便有类似需求的同学参考。
color: black
---

开发过程中，我们经常会用到各种各样的包管理工具，几乎每种包管理工具缺省设置都是从国外服务器下载相应的软件安装包，或者下载很慢，或者干脆无法下载。以下列出我常用的所有国内镜像，方便有类似需求的同学参考**（不定期更新，感觉有用的同学请注意收藏）**。

我平常用的`shell`是`fish`，所以下面的语法全都是`fish`相关的`set -x`，如果是用缺省的`bash`，可以替换成`export`命令。

# 操作系统相关

## brew 国内镜像

```
cd /usr/local/Homebrew
git remote set-url origin https://mirrors.ustc.edu.cn/brew.git
cd /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git
cd /usr/local/Homebrew/Library/Taps/homebrew/homebrew-cask
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-cask.git
```

```
# brew国内镜像
set -x HOMEBREW_BOTTLE_DOMAIN https://mirrors.ustc.edu.cn/homebrew-bottles
```

# Javascript 相关

## npm 国内镜像

```
npm config set registry https://registry.npm.taobao.org/
```

## yarn 国内镜像

```
yarn config set registry https://registry.npm.taobao.org/
```

## pnpm 国内镜像

```
pnpm config set registry https://registry.npm.taobao.org/
```

## electron 国内镜像

```
yarn config set electron_mirror https://npm.taobao.org/mirrors/electron/
set -x ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
```

## node-sass 国内镜像

```
yarn config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
set -x SASS_BINARY_SITE https://npm.taobao.org/mirrors/node-sass/
```

## fsevents 国内镜像

```
yarn config set fse_binary_host_mirror https://npm.taobao.org/mirrors/fsevents/
set -x FSE_BINARY_HOST_MIRROR https://npm.taobao.org/mirrors/fsevents/
```

## 更多

更多设置，或者懒得一个一个设置的同学也可以参考这里：

<https://gist.github.com/hetykai/484209019b1b0d39ea649540e554a0a4>

把这些代码下载到一个 shell 脚本里，一键添加完成。

# Python 相关

## pip 国内镜像

```
$ cat ~/.pip/pip.conf
[global]
index-url=https://pypi.tuna.tsinghua.edu.cn/simple
```

## conda 国内镜像

```
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/msys2/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/bioconda/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/menpo/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/
conda config --set show_channel_urls yes
```

# PHP 相关

## composer 国内镜像

```
composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/
```

# Rust 相关

## rustup 国内镜像

```
set -x RUSTUP_DIST_SERVER https://mirrors.ustc.edu.cn/rust-static
set -x RUSTUP_UPDATE_ROOT https://mirrors.ustc.edu.cn/rust-static/rustup
```

## cargo 国内镜像

修改当前用户目录下`.cargo/config`文件，改为：

```
[source.crates-io]
registry = "https://github.com/rust-lang/crates.io-index"
replace-with = 'ustc'
[source.ustc]
registry = "git://mirrors.ustc.edu.cn/crates.io-index"
```

# 其它语言

## flutter 国内镜像

```
set -x PUB_HOSTED_URL https://pub.flutter-io.cn
set -x FLUTTER_STORAGE_BASE_URL https://storage.flutter-io.cn
```

# 补充

## github 国内镜像

如果是在`git clone`时遇到了问题，可以先在码云建立一个库，来源取自 github，然后同步码云这个库即可。
