<p align="center">
  <a href="https://www.fengerzh.com/">
    <img alt="zhangjing" src="https://sfault-avatar.b0.upaiyun.com/439/654/439654051-58781bd01ba83_huge256" style="border-radius: 500px;" />
  </a>
</p>

# 日新亭模板

想了解与此模板相关的任何问题，请点此链接：[![Join the chat at https://gitter.im/fengerzh-github-io/Lobby](https://badges.gitter.im/fengerzh-github-io/Lobby.svg)](https://gitter.im/fengerzh-github-io/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

欢迎加入：[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

编译结果：
[![Build Status](https://semaphoreci.com/api/v1/fengerzh/fengerzh-github-io/branches/master/shields_badge.svg)](https://semaphoreci.com/fengerzh/fengerzh-github-io)
[![CircleCI](https://circleci.com/gh/fengerzh/fengerzh.github.io.svg?style=svg)](https://circleci.com/gh/fengerzh/fengerzh.github.io)

日新亭模板是一套基于`Jekyll`框架的模板，目前运行在[日新亭](https://www.fengerzh.com)网站上。日新亭网站基于[Github Pages](https://pages.github.com/)自动发布，`https`技术采用[CloudFlare](http://cloudflare.com/)方案，图床采用[Cloudinary](https://cloudinary.com/)自动压缩方案，采用[CircleCI](https://circleci.com/)进行持续集成。

此模板的基础是[Jekflix](https://github.com/thiagorossener/jekflix-template)，在此基础上做了大量定制改造，包括添加`Google`渐进式 Web 应用(`Progressive Web Apps`)功能等，以使其更加适合中文环境和对移动端友好。

所有文章的`Markdown`源代码在`_posts`文件夹之下，供参考。如果利用此模板建设自己的网站，可以直接删除`_posts`下的所有文件。

此模板还在持续更新中，随时添加新的功能和新的内容。

## 下载

可直接通过`Github`下载本模板：

```
git clone git@github.com:fengerzh/fengerzh.github.io.git
```

## 安装

### 安装 Jekyll

```
brew install ruby
gem install bundler
gem install jekyll
```

## 运行

```
bundle exec jekyll serve
```
