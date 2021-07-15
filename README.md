<p align="center">
  <a href="https://www.fengerzh.com/">
    <img alt="zhangjing" src="/assets/img/icons/android-chrome-192x192.png" />
  </a>
</p>

# 日新亭模板

想了解与此模板相关的任何问题，请点此链接：[![Join the chat at https://gitter.im/fengerzh-github-io/Lobby](https://badges.gitter.im/fengerzh-github-io/Lobby.svg)](https://gitter.im/fengerzh-github-io/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Ffengerzh%2Ffengerzh.github.io.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Ffengerzh%2Ffengerzh.github.io?ref=badge_shield)

欢迎加入：[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

编译结果：
[![Build Status](https://semaphoreci.com/api/v1/fengerzh/fengerzh-github-io/branches/master/shields_badge.svg)](https://semaphoreci.com/fengerzh/fengerzh-github-io)
[![CircleCI](https://circleci.com/gh/fengerzh/fengerzh.github.io.svg?style=svg)](https://circleci.com/gh/fengerzh/fengerzh.github.io)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/37c78fba3d724be09bab853b9e84f91f)](https://www.codacy.com/app/fengerzh/fengerzh.github.io?utm_source=github.com&utm_medium=referral&utm_content=fengerzh/fengerzh.github.io&utm_campaign=Badge_Grade)
[![Netlify Status](https://api.netlify.com/api/v1/badges/4af97c85-c94b-4df1-8832-184020a7d0c5/deploy-status)](https://app.netlify.com/sites/fengerzh/deploys)
[![Build status](https://ci.appveyor.com/api/projects/status/0e8iejyct7g7a3dv?svg=true)](https://ci.appveyor.com/project/fengerzh/fengerzh-github-io)

支持 996.icu：<a href="https://996.icu"><img src="https://img.shields.io/badge/support-996.icu-red.svg"></a>

日新亭模板是一套基于`Jekyll`框架的模板，目前运行在[日新亭](https://www.fengerzh.com)网站上。日新亭网站基于[Github Pages](https://pages.github.com/)自动发布，`https`技术采用[CloudFlare](http://cloudflare.com/)方案，图床采用[Cloudinary](https://cloudinary.com/)自动压缩方案，采用[CircleCI](https://circleci.com/)进行持续集成。

此模板的基础是[Jekflix](https://github.com/thiagorossener/jekflix-template)，在此基础上做了大量定制改造，包括添加`Google`渐进式 Web 应用(`Progressive Web Apps`)功能等，以使其更加适合中文环境和对移动端友好。

所有文章的`Markdown`源代码在`_posts`文件夹之下，供参考。如果利用此模板建设自己的网站，可以直接删除`_posts`下的所有文件。

此模板还在持续更新中，随时添加新的功能和新的内容。

## 下载

可直接通过`Github`下载本模板：

```bash
git clone git@github.com:fengerzh/fengerzh.github.io.git
```

## 安装

### 安装 Jekyll

```bash
brew install ruby
gem install bundler
gem install jekyll
```

### 编译 css 和 js

```bash
yarn
gulp
```

## 运行

```bash
bundle exec jekyll serve
```


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Ffengerzh%2Ffengerzh.github.io.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Ffengerzh%2Ffengerzh.github.io?ref=badge_large)