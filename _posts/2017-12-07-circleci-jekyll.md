---
title: CircleCI 2.0持续集成Jekyll
image: https://res.cloudinary.com/fengerzh/image/upload/circleci_rk7zge.png
category: 运维
tags:
  - jekyll
  - circleci
description: Jekyll官网上只介绍了如何将Jekyll与CircleCI 1.0相集成，但CircleCI官网已升级至2.0，那么如何将此二者相结合呢？
color: black
---

谈到**持续集成**，最常用的工具无非就是三个：一个是[TravisCI][1]，一个是[CircleCI][2]，一个是[Jenkins][3]。前两个是网站，可以非常便利地与`Github`相集成，但都有数量限制，最后一个是开源软件，可以下载安装成供自己使用的工具，想做几个做几个。

所谓**持续集成**，听起来似乎很时尚，但其本质无非就是三件事：从代码库`git`中拉取代码、编译、部署。如果你想尝试`Jenkins`，可以通过`Docker`安装，然后[集成到你自己的 git 仓库上][4]。

今天我们不谈`Jenkins`，今天要谈的是`CircleCI`。在这几个工具当中，`CircleCI`的界面应该说是最漂亮的：

![clipboard.png](https://segmentfault.com/img/bVZUIJ)

`CircleCI`与`Github`集成比较容易，直接选择自己的代码库拉取即可。而`Github Pages`由于使用了`Jekyll`，所以有必要看一下`Jekyll`如何与`CircleCI`集成，但[Jekyll 官网上关于与 CircleCI 集成的文章][5]还是基于旧版本的`CircleCI 1.0`的，而`CircleCI 2.0`已经与`1.0`有了很大差异。所以下面我们来讲一下如何把`Jekyll`与`CircleCI 2.0`集成在一起。

与`1.0`不同的是，你不需要在项目的根目录下建立`circle.yml`了，而是要在项目根目录下创建一个名为`.circle`的文件夹，然后在里面放一个名为`config.yml`的文件，文件内容如下：

```yaml
version: 2
jobs:
  build-job:
    docker:
      - image: circleci/ruby:latest
    steps:
      - checkout
      - run: bundle install
      - run: bundle exec jekyll build
      - run: bundle exec htmlproofer ./_site --allow-hash-href --check-html --disable-external
      - run: echo "Build finished!"
workflows:
  version: 2
  build-deploy:
    jobs:
      - build-job
```

在这里，我们采用了工作流的方式来做，但是只做了编译部分，而没有做需要`rsync`的部署部分，因为项目本身已经在`Github Pages`服务器上了，不需要额外部署。如果你需要部署到其他服务器的话，还需要在其他服务器上开辟`rsync`服务，然后在`CircleCI`里执行`rsync`命令，那是另外一个话题了。

关于`CircleCI`与`Jekyll`集成的真实案例，可以参考[我的博客模版][6]。

[1]: https://travis-ci.org/
[2]: https://circleci.com/
[3]: https://jenkins.io/
[4]: https://segmentfault.com/a/1190000012281836
[5]: https://jekyllrb.com/docs/continuous-integration/circleci/
[6]: https://github.com/fengerzh/fengerzh.github.io
