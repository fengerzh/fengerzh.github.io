---
title: 从Tomcat到Spring Boot
image: http://res.cloudinary.com/fengerzh/image/upload/spring-boot_ynthte.jpg
category: 后端
tags:
- java
- springboot
- tomcat
description: 暮夏八月是一年中最好的时节，我们尝试在这个夏天把这只已经独自在外游荡了19年的野猫Tomcat装入春天的长靴。
color: black
---


暮夏八月是一年中最好的时节，近近地看到了凉爽的希望，却还能享用暖热的余温。距离[Phil Webb][1]发布[Spring Boot][2]已经`4`年有余，我们尝试在这个夏天把这只已经独自在外游荡了`19`年的野猫[Tomcat][3]装入春天的长靴。

从零开始安装`Spring Boot`项目，使用内嵌的`Tomcat`引擎是比较容易的事情，各种中文教程已经数不胜数，那不是我们要谈论的话题。在这里我们要做的是以最小的代价把一个已有的`Tomcat`项目改造为`Spring Boot`项目，以实现我们微服务改造的第一步。

# 对pom.xml的修改

## 添加spring-boot-maven-plugin

一般来说，在每一个`pom.xml`的结尾，都会有一个`build`段落，在这里添加`spring-boot-maven-plugin`是必经的第一个步骤，添加完之后的完整段落如下：

```xml
    <build>
        <finalName>my-app</finalName>
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
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <jvmArguments>-Xmx64m</jvmArguments>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

在这里，我们特别添加了一个`configuration`段落，设置`-Xmx`为`64m`，这是因为`Tomcat`缺省会分配物理内存的`1/4`为堆内存，这样我们一台电脑最多只能运行`4`个`Tomcat`服务，内存就不够用了。在这里我们把`heap size`的最大尺寸设置为只用`64m`，可以有效节省内存，最多会引起垃圾回收频繁一些而已，这之间的平衡可以自己掌握。

## 添加spring-boot-starter-parent

`Spring Boot`是一个非常独立的父母，它认为所有与`spring`有关的依赖都是它的孩子，所以我们必须引入`spring-boot-starter-parent`，让它来管理所有姓`spring`的孩子。

```xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.0.4.RELEASE</version>
        <relativePath/>
    </parent>
```

由于`Spring Boot`自己管理所有`spring`依赖，你还需要把原先加在`pom.xml`里的所有与`spring`有关的依赖（以及所有`spring`想要管理的依赖，例如`com.fasterxml.jackson.core`）全部删掉，否则会造成版本冲突。比如这样：

~~<dependency>~~
~~<groupId>org.springframework</groupId>~~
~~<artifactId>spring-core</artifactId>~~
~~<version>4.1.1.RELEASE</version>~~
~~</dependency>~~

## 添加spring-boot-starter-web

`Spring Boot`唯一需要我们手工添加的依赖只有一个：

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
```

有了这个依赖以后，`Spring Boot`项目启动的时候就会内嵌一个`Tomcat`服务器。同时`Spring Boot`带来的另外一个好处是：我们从此不必再依赖`Tomcat`，如果我们想换成其它引擎，只需要加上新引擎，排除掉`Tomcat`就可以了，假设我们想换成[Undertow][4]，只需要这样设置：

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-undertow</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <exclusions>
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-tomcat</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
```

# 主程序入口

## Application.java

传统的`Tomcat`应用是让`Tomcat`先启动，然后加载我们的`war`文件，改造之后是`Spring Boot`先启动，由`Spring Boot`来加载`Tomcat`，所以我们需要给我们的应用里增加一个`Application.java`文件：

```java
package com.domain.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

## application.properties

传统的`Tomcat`是把所有配置项放在`webapp/WEB-INF/web.xml`里来管理的，`Spring Boot`不使用`web.xml`文件，它把所有配置项都放在`resources/application.properties`文件中，例如：

```
server.port=8090
server.servlet.context-path=/app
```

# 运行

至此为止，就已经完成了从`Tomcat`到`Spring Boot`的迁移。我们可以通过`maven`运行`Spring Boot`来看一下效果：

```
mvn spring-boot:run
```

# 添加dubbo

如果以前的项目是由`dubbo`完成的，暂时还不想破坏原有架构，可以把`dubbo`集成到`Spring Boot`中来。

## pom.xml

在`pom.xml`中添加[dubbo-spring-boot-starter][5]依赖：

```xml
        <dependency>
            <groupId>com.alibaba.spring.boot</groupId>
            <artifactId>dubbo-spring-boot-starter</artifactId>
            <version>1.0.2</version>
        </dependency>
```

这个`dubbo-spring-boot-starter`的最高版本是`2.0.0`，并且即便这个`2.0.0`也[已经被废弃][6]，更高的版本迁移到了[incubator-dubbo-spring-boot-project][7]上，但是由于我用的是`dubbo`较低的版本`2.5.3`，使用了比较方便的`<dubbo:annotation>`方式，所以不可能采用它的`2.0.0`版本，更加不可能使用`incubator-dubbo-spring-boot-project`（这个`incubator-dubbo-spring-boot-project`项目甚至不支持在`application.properties`文件中对`dubbo`做配置）。

`Dubbo`从`2.5.7`以后[废弃了<dubbo:annotation>方式][8]，改采`@DubboComponentScan`方式，我个人认为这种新方式远远不如旧的`<dubbo:annotation>`方式简便，所以目前或者以后也不准备迁移到更高版本的`dubbo`了。

## Application.java

在`pom.xml`中添加对`dubbo`的依赖后，还需要在`Application.java`中添加`dubbo`的自动配置功能：

```java
import com.alibaba.dubbo.spring.boot.annotation.EnableDubboConfiguration;

@SpringBootApplication
@EnableDubboConfiguration
```

## application.properties

然后在`application.properties`文件中添加`dubbo`的配置项：

```
spring.dubbo.appname=my-app
spring.dubbo.registry=zookeeper://myip.mydomain.com:2181
```

这个配置项功能很弱，但勉强够用。虽然它会造成一些[很难看的日志][9]：

```
[2018-08-26 12:21:25] WARN  -  [DUBBO] ReferenceConfig(null) is not DESTROYED when FINALIZE, dubbo version: 2.5.3, current host: 192.168.1.2
```

但是鉴于这个插件已经被废弃了，不会有人来解决这个问题，只能勉强这么用了。

# 总结

以上就是从`Tomcat`迁移到`Spring Boot`所需要的所有改动。总计只是修改了`pom.xml`一个文件，新增了`Application.java`和`application.properties`两个文件，新增代码行数不超过`20`行，整个迁移过程还是比较简便的。

当然，仅仅在代码层面迁移到`Spring Boot`不是最终目的，我们还需要在`pom.xml`文件中把`<packaging>war</packaging>`改为`<packaging>jar</packaging>`，这样我们在执行`mvn package`之后，就可以`java -jar myapp.jar`来在服务器端进行部署。

更进一步，当以`Spring Boot`方式启动的微服务越来越多的时候，服务治理将成为一个难题，这时候就需要考虑引入`Eureka`或者甚至`Kubernetes`进行服务治理，那将是另外一个大话题了。


  [1]: https://spring.io/team/pwebb
  [2]: https://spring.io/projects/spring-boot
  [3]: http://tomcat.apache.org/
  [4]: http://undertow.io/
  [5]: https://github.com/alibaba/dubbo-spring-boot-starter
  [6]: https://github.com/alibaba/dubbo-spring-boot-starter/issues/80
  [7]: https://github.com/apache/incubator-dubbo-spring-boot-project
  [8]: https://github.com/mercyblitz/blogs/blob/da5b134b916e84c52176e5495e2742a56c67168b/java/dubbo/Dubbo-Annotation-Driven.md
  [9]: https://github.com/alibaba/dubbo-spring-boot-starter/issues/83