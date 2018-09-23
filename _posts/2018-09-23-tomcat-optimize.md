---
title: Tomcat优化笔记
image: https://res.cloudinary.com/fengerzh/image/upload/tomcat_fuu35d.jpg
category: 运维
tags:
  - tomcat
  - java
  - maven
description: 好记性不如烂笔头，记录下来作为以后每次优化时的依据，也许对遇到类似问题的你也略有启发吧。
color: black
---

> 一千个人眼中就有一千个哈姆雷特。——[伪西方谚语][1]

关于`Tomcat`的优化点之多，我估计没有上万，也有成千。不同的应用场景，不同的架构，不同的需求，都会对优化设置有不同要求。在这里我所记述的只是我自己在一些`Tomcat`应用中所设置的优化项，以备不时之需，并不是放之四海而皆准的准则。

# pom.xml

对于`maven`项目来说，`pom.xml`设置是整个设置的核心，如果`pom.xml`设置不当，虽然有时候也可以编译运行，但总是会出现一些令人讨厌的警告。为了消除这些警告，还需要根治`pom.xml`。

## 重复依赖

首先要解决的是重复依赖问题，有时候我们会在编译项目时遇到下面的这样的警告：

```
[WARNING]
[WARNING] Some problems were encountered while building the effective model for com.qiban.supplier:saas-supplier:war:1.0-SNAPSHOT
[WARNING] 'dependencies.dependency.(groupId:artifactId:type:classifier)' must be unique: commons-codec:commons-codec:jar -> duplicate declaration of version 1.9 @ line 264, column 21
[WARNING]
[WARNING] It is highly recommended to fix these problems because they threaten the stability of your build.
[WARNING]
[WARNING] For this reason, future Maven versions might no longer support building such malformed projects.
[WARNING]
```

解决的方法很简单：在`pom.xml`中搜索出现重复依赖的`jar`包名称，你肯定会发现对于同一个`jar`包，重复引用了多次，也许版本相同，也许版本不同，只要删除掉那些重复的就可以了。

# maven 编译器版本

有时候会遇到下面这样的错误：

```
[WARNING]
[WARNING] Some problems were encountered while building the effective model for com.qiban.supplier:saas-supplier:war:1.0-SNAPSHOT
[WARNING] 'build.plugins.plugin.version' for org.apache.maven.plugins:maven-compiler-plugin is missing. @ line 297, column 21
[WARNING]
[WARNING] It is highly recommended to fix these problems because they threaten the stability of your build.
[WARNING]
[WARNING] For this reason, future Maven versions might no longer support building such malformed projects.
[WARNING]
```

这意思是说你没有在`pom.xml`里指定`maven`的版本，在`pom.xml`里添加`maven`的版本就可以了：

```
    <build>
        <finalName>saas-supplier</finalName>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.5.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

重点是上面那个`<version>3.5.1</version>`。

# jdom

有的时候会遇到一行简单的警告：

```
[WARNING] The artifact jdom:jdom:jar:1.1 has been relocated to org.jdom:jdom:jar:1.1
```

这个的意思是说在你的`pom.xml`里，你需要把`jdom`的`groupId`改为`org.jdom`：

```
       <dependency>
            <groupId>org.jdom</groupId>
            <artifactId>jdom</artifactId>
            <version>1.1</version>
        </dependency>
```

# activemq-spring

下面这个警告不会在编译时出现，但是会在运行时出现，也非常恶心：

```
SLF4J: Class path contains multiple SLF4J bindings
```

我们需要把`pom.xml`里的`activemq-all`改成`activemq-spring`：

```
        <dependency>
            <groupId>org.apache.activemq</groupId>
            <artifactId>activemq-spring</artifactId>
            <version>5.11.1</version>
        </dependency>
```

详细解释可以看我的[这篇文章][2]。

# log4j.properties

终于改完了`pom.xml`，我们开始处理 log4j。

## xmemcached

如果你使用了`xmemcached`，那么日志里会不断地出现`xmemcached`的警告，而这些警告对我们来说根本就不是警告，毫无意义，并且会掩盖真正的错误，所以我们通过修改`log4j.properties`文件屏蔽它：

```
# xmemcached
log4j.logger.com.google.code=OFF
log4j.logger.net.rubyeye.xmemcached=OFF
```

我这里比较野蛮粗暴地直接使用了`OFF`选项，如果你不放心，可以改成`ERROR`选项，效果是一样的。

## webapp 名称+%c

如果你有多个`webapp`，为了准确显示到底是哪个`webapp`的哪个`class`报的错，我们需要在`log4j.properties`文件里注明我们的`webapp`名称，再加上一个%c 符号：

```
log4j.appender.STDOUT.layout.ConversionPattern=[%d{yyyy-MM-dd HH:mm:ss}] %-5p - activity - %c - %m%n
```

这样下回再有任何错误，我们可以第一时间迅速定位到到底是哪个`webapp`的哪个`class`出的错误。

# logrotate

如果我们不管不顾的话，`Tomcat`的日志文件几乎会无限制增长，最终会耗尽我们的硬盘空间，所以我们需要用`logrotate`来限制它一下，在`/etc/logrotate.d`文件夹下创建一个文件`tomcat`：

```
/opt/tomcat1/logs/catalina.out
/opt/tomcat2/logs/catalina.out
{
   copytruncate
   daily
   rotate 7
   compress
   missingok
   size 10M
}
```

# setenv.sh

`Tomcat`不问青红皂白，上来就要占领我们主机整个物理内存的四分之一，我们需要限制它的大小，宁可浪费一些`CPU`和硬盘的时间去让它不断地垃圾回收，也不想让它占用这么多的内存，所以我们需要在`/opt/tomcat/bin`下建立一个`setenv.sh`文件，强制让它最多占用`1G`内存：

```
export CATALINA_OPTS="$CATALINA_OPTS -Xms512m"
export CATALINA_OPTS="$CATALINA_OPTS -Xmx1024m"
```

这样我们一台`16G`内存的主机，可以同时运行`16`个`Tomcat`，而不像以前，最多只能同时运行`4`个`Tomcat`。

# jarsToSkip

`Tomcat`启动时会不断地扫描所有`.jar`文件，并且报一些不知所谓的警告：

```
09-Dec-2017 20:03:14.289 FINE [localhost-startStop-1] org.apache.jasper.servlet.TldScanner$TldScannerCallback.scan No TLD files were found in [file:/home/apache-tomcat-8.5.4/lib/tomcat-redis-session-manager-master-2.0.0.jar]. Consider adding the JAR to the tomcat.util.scan.StandardJarScanFilter.jarsToSkip property in CATALINA_BASE/conf/catalina.properties file.
```

直接在`/opt/tomcat/conf/catalina.properties`文件里把这一句话改成：

```
tomcat.util.scan.StandardJarScanFilter.jarsToSkip=*.jar
```

这个世界终于清静了，扫什么扫，有什么可扫的！

# startStopThreads

当你有多个`webapp`的时候，`Tomcat`缺省会启完一个`webapp`再启下一个，这样太慢了，不可忍受，我们在`/opt/tomcat/conf/server.xml`文件里把它的启动线程数直接干到`20`个：

```
<Host name="localhost" appBase="webapps" unpackWARs="true" autoDeploy="true" startStopThreads="20" />
```

# Dubbo

有时候`Dubbo`也会跳出来捣乱，在每一个不同的`webapp`下的`consumer.xml`文件里指定`file`：

```
<dubbo:registry address="zookeeper://${zookeeper.address}" file="${dubbo.cache}" />
```

每个`webapp`的`file`名称各不相同，它们再也不会互相打架了。

# 结语

以上所述也不过只是冰山之一角，好记性不如烂笔头，记录下来作为以后每次优化时的依据，也许对遇到类似问题的你也略有启发吧。

[1]: http://blog.sciencenet.cn/blog-350729-847280.html
[2]: https://segmentfault.com/a/1190000015432848
