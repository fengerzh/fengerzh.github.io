---
title: 日志洁癖
image: https://res.cloudinary.com/fengerzh/image/upload/mysophobia_nvjfz7.jpg
category: 运维
tags:
  - java
description: 我不但有代码洁癖，并且还有日志洁癖。
color: black
---

我不但有代码洁癖，并且还有日志洁癖。

看着这样的代码就会感到不舒服：

```c
if(a==0 )
```

必须把它改成：

```c
if (a == 0)
```

才能继续思考。

当我在`Tomcat`输出的日志里看到这样的警告：

```log
SLF4J: Class path contains multiple SLF4J bindings
```

不禁陷入了深深的思考。

我讨厌一切警告。

> Treat warnings as errors or delete them, but never spend human labor looking through warning lists routinely.
>
> 将警告当错误一样对待，或者彻底删除相关代码，但是绝对不要浪费时间每天对它视若无睹。

于是，像你们一样开始在网上搜索。

有人说[这样解决][1]。

有人说[那样解决][2]。

还有人说[Solve it this way][3].

但是我告诉你们，没有一个方法能解决。

我的`pom.xml`文件是这么写的：

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-log4j12</artifactId>
    <version>1.7.7</version>
</dependency>

<dependency>
    <groupId>org.apache.activemq</groupId>
    <artifactId>activemq-all</artifactId>
    <version>5.11.1</version>
</dependency>
```

这是因为`activemq-all.jar`包是一个`ueber`包，它里面已经包含了一个`slf4j-log4j12.jar`，你妄图用这样的方法去解决这个警告：

```xml
<dependency>
    <groupId>org.apache.activemq</groupId>
    <artifactId>activemq-all</artifactId>
    <version>5.11.1</version>
    <exclusions>
        <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

是注定不可能成功的。

在这里，最正确地解决这个问题的方法是：

```xml
<dependency>
    <groupId>org.apache.activemq</groupId>
    <artifactId>activemq-all</artifactId>
    <version>5.11.1</version>
</dependency>
```

把`activemq-all`改成`activemq-spring`就好了。

虽然如此，我又遇到了问题：

```log
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/C:/Users/admin/.m2/repository/org/slf4j/slf4j-log4j12/1.7.7/slf4j-log4j12-1.7.7.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/C:/Users/admin/.m2/repository/org/slf4j/slf4j-log4j12/1.6.1/slf4j-log4j12-1.6.1.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
```

这次`pom.xml`是没有任何问题的，但为什么还有这个错误呢？

最后发现居然是有人在`/src/main/webapp/WEB-INF`下放了一个`lib`文件夹，在这个文件夹里放了一个老版本的`slf4j-log4j12-1.6.1.jar`进去。

果断删除所有`lib`文件夹下的文件。

重新提交代码，编译，部署。

终于，我们彻底解决了所有`SLF4J: Class path contains multiple SLF4J bindings.`问题。

日志一片清爽。

感觉世界重新恢复了秩序。

[1]: https://blog.csdn.net/zhengqiqiqinqin/article/details/13772369
[2]: https://www.oschina.net/question/93435_174549
[3]: https://stackoverflow.com/questions/14024756/slf4j-class-path-contains-multiple-slf4j-bindings
