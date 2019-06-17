---
title: 循序渐进学加密
image: https://res.cloudinary.com/fengerzh/image/upload/encryption_rufn9j.jpg
category: 编程
tags:
  - rsa
  - java
  - javascript
description: 用最简单的方式实现js端加密，java端解密的过程。
color: black
---

还记得上初二的那年夏天，班里来了一个新同学，他就住在我家对面的楼里，于是我们一起上学放学，很快便成了最要好的朋友。我们决定发明一套神秘的沟通方式，任何人看到都不可能猜到它的真实含义。我们第一个想到的就是汉语拼音，但很显然光把一个句子变成汉语拼音是不够的，于是我们把 26 个英文字母用简谱的方式从低音到高音排起来，就得到了一个简单的密码本：

![clipboard.png](https://segmentfault.com/img/bVbtbTm)

把“`我们都是好朋友`”用这个密码本变换之后就得到了这样的结果：

![clipboard.png](https://segmentfault.com/img/bVbta9k)

小时候玩这个游戏乐此不疲，觉得非常有趣。上大学后，有幸听卢开澄教授讲《计算机密码学》，才知道原来我们小时候玩的这个游戏远远不能称之为加密。那么到底什么是加密呢？

## 什么是加密

把字符串`123456`经过`base64`变换之后，得到了`MTIzNDU2`，有人说这是`base64`加密。

把字符串`123456`经过`md5`变换之后，得到了`E10ADC3949BA59ABBE56E057F20F883E`，有人说这是`md5`加密。

从严格意义上来说，不管是`base64`还是`md5`甚至更复杂一些的`sha256`都不能称之为加密。

一句话，没有密钥的算法都不能叫加密。

> **编码（Encoding）**是把字符集中的字符编码为指定集合中某一对象（例如：比特模式、自然数序列、8 位字节或者电脉冲），以便文本在计算机中存储和通过通信网络的传递的方法，常见的例子包括将拉丁字母表编码成摩尔斯电码和`ASCII`。`base64`只是一种编码方式。
>
> **杂凑（Hashing）**是电脑科学中一种对资料的处理方法，通过某种特定的函数/算法（称为杂凑函数/算法）将要检索的项与用来检索的索引（称为杂凑，或者杂凑值）关联起来，生成一种便于搜索的资料结构（称为杂凑表）。杂凑算法常被用来保护存在资料库中的密码字符串，由于杂凑算法所计算出来的杂凑值具有不可逆（无法逆向演算回原本的数值）的性质，因此可有效的保护密码。常用的杂凑算法包括`md5`, `sha1`, `sha256`等。
>
> **加密（Encryption）**是将明文信息改变为难以读取的密文内容，使之不可读的过程。只有拥有解密方法的对象，经由解密过程，才能将密文还原为正常可读的内容。加密分为对称加密和非对称加密，对称加密的常用算法包括`DES`, `AES`等，非对称加密算法包括`RSA`，椭圆曲线算法等。

在古典加密算法当中，加密算法和密钥都是不能公开的，一旦泄露就有被破解的风险，我们可以用词频推算等方法获知明文。`1972`年美国`IBM`公司研制的`DES`算法(`Data Encryption Standard`)是人类历史上第一个公开加密算法但不公开密钥的加密方法，后来成为美国军方和政府机构的标准加密算法。`2002`年升级成为`AES`算法(`Advanced Encryption Standard`)，我们今天就从`AES`开始入手学习加密和解密。

## 准备工具

通常情况下，加解密都只需要在服务端完成就够了，这也是网上大多数教程和样例代码的情况，但在某种特殊情况下，你需要用一种语言加密而用另一种语言解密的时候，最好有一个中立的公正的第三方结果集来验证你的加密结果，否则一旦出错，你都不知道是加密算法出错了，还是解密算法出错了，对此我们是有惨痛教训的，特别是如果一个公司里，写加密的是前端，用的是`js`语言，而写解密的是后端，用的是`java`语言或者`php`语言或者`go`语言，则双方更需要有这样一个客观公正的平台，否则你们之间必然会陷入永无休止的互相指责的境地，前端说自己没有错，是后端解密解错了，后端说解密没有错，是前端加密写错了，而事实上是双方都是菜鸟，对密码学一知半解，在这种情况下浪费的时间就更多。

[在线 AES 加密解密](http://tool.chacuo.net/cryptaes)就是这样的一个工具网站，你可以在上面验证你的加密结果，如果你加密得到的结果和它的结果完全一致，就说明你的加密算法没有问题，否则你就去调整，直到和它的结果完全一致为止。反之亦然，如果它能从一个密文解密解出来，而你的代码解不出来，那么一定是你的算法有问题，而不可能是数据的问题。

我们先在这个网站上对一个简单的字符串`123456`进行加密。

![clipboard.png](https://segmentfault.com/img/bVbtEzK)

下面我们对网站上的所有选项逐个解释一下：

1. **`AES`加密模式**：这里我们选择的是`ECB`(`ee cc block`)模式。这是`AES`所有模式中最简单也是最不被人推荐的一种模式，因为它的固定的明文对应的是固定的密文，很容易被破解。但是既然是练习的话，就让我们先从最简单的开始。
2. **填充**：在这里我们选择`pkcs`标准的`pkcs7padding`。
3. **数据块**：我们选择`128`位，因为`java`端解密算法目前只支持`AES128`，所以我们先从`128`位开始。
4. **密钥**：因为我们前面选择了`128`位的数据块，所以这里我们用`128 / 8 = 16`个字节来处理，我们先简单地填入`16`个`0`，其实你也可以填写任意字符，比如`abcdefg1234567ab`或者其它，只要是`16`个字节即可。理论上来说，不是`16`个字节也可以用来当密钥，优秀的算法会自动补齐，但是为了简单起见，我们先填入`16`个`0`。
5. **偏移量**：置空。因为是`ECB`模式，不需要`iv`偏移量。
6. **输出**：我们选择`base64`编码方式。
7. **字符集**：这里因为我们只加密英文字母和阿拉伯数字，所以选择`utf-8`和`gb2312`都是一样的。

好了，现在我们知道按照以上选项设置好之后的代码如果加密`123456`的话，应该输出`DoxDHHOjfol/2WxpaXAXgQ==`，如果不是这个结果，那就是加密端的问题。

## AES-ECB

### AES-ECB 的 Javascript 加密

为了完成`AES`加密，我们并不需要自己手写一个`AES`算法，不需要去重复造轮子。但如何选择`js`的加密库是个很有意思的挑战。我们尝试了很多方法，一开始我们尝试了[aes-js][1]这个库，但它不支持`RSA`算法，后来我们看到[Web Crypto API][2]这种浏览器自带的加密库，原生支持`AES`和`RSA`，但它的`RSA`实现和`Java`不兼容，最终我们还是选择了[Forge][3]这个库，它天生支持`AES`的各种子集，并且它的`RSA`也能和`Java`完美配合。

使用`forge`编写的`js`代码实现`AES-ECB`加密的代码就是下面这些：

```js
const cipher = forge.cipher.createCipher('AES-ECB', '这里是16字节密钥');
cipher.start();
cipher.update(forge.util.createBuffer('这里是明文'));
cipher.finish();
const result = forge.util.encode64(cipher.output.getBytes());
```

`forge`的`AES`缺省就是`pkcs7padding`，所以不用特别设置。运行它之后你就会得到正确的加密结果。

### AES-ECB 的 Java 解密

接下来我们看看 Java 端的解密代码该如何写：

```java
try {
    Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
    cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec("这里是16字节密钥".getBytes(), "AES"));
    String plaintext = new String(cipher.doFinal(Base64.getDecoder().decode("这里是明文".getBytes())), "UTF-8");
    System.out.println(plaintext);
} catch (Exception e) {
    System.out.println("解密出错：" + e.toString());
}
```

注意这里我们用到的是`PKCS5Padding`，上面加密的时候不是用的是`pkcs7padding`吗？怎么这里变成`5`了呢？

我们先来了解一下什么是`pkcs`。`pkcs`的全称是`Public Key Cryptography Standards`（**公钥加密标准**），这是`RSA`实验室制定的一系列的公钥密码编译标准，比较著名的有`pkcs1`, `pkcs5`, `pkcs7`, `pkcs8`这四个，它们分别管理的是不同的内容。在这里我们只是用它来填充，所以我们只关注`pkcs5`和`pkcs7`就够了。那么`pkcs5`和`pkcs7`有什么区别呢？其实在填充方面它们两个的算法是一样的，`pkcs5`是`pkcs7`的一个子集，区别在于`pkcs5`是`8`字节固定的，而`pkcs7`可以是`1`到`255`之间的任意字节。但用在`AES`算法上，因为`AES`标准规定块大小必须是`16`字节或者`24`字节或者`32`字节，不可能用`pkcs5`的`8`字节，所以`AES`算法只能用`pkcs7`填充。但是由于`java`早期工程师犯的一个命名上的错误，他们把`AES`填充算法的名称设定为`pkcs5`，而实际实现中实现的是`pkcs7`，所以我们在`java`端开发解密的时候需要使用`pkcs5`。

## AES-CBC

谈完了不安全的`AES-ECB`，我们来做一下相对安全一些的`AES-CBC`模式。

### AES-CBC 的 Javascript 加密

直接上代码：

```js
const cipher = forge.cipher.createCipher('AES-CBC', '这里是16字节密钥');
cipher.start({ iv: '这里是16字节偏移量' });
cipher.update(forge.util.createBuffer('这里是明文'));
cipher.finish();
const result = forge.util.encode64(cipher.output.getBytes());
```

跟上面的`AES-ECB`差不多，唯一区别只是在`start`函数里定义了一个`iv`。

### AES-CBC 的 Java 解密

下面是`Java`代码：

```java
try {
    Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
    cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec("这里是16字节密钥".getBytes(), "AES"), new IvParameterSpec("这里是16字节偏移量".getBytes()));
    String plaintext = new String(cipher.doFinal(Base64.getDecoder().decode("这里是明文".getBytes())), "UTF-8");
    System.out.println(plaintext);
} catch (Exception e) {
    System.out.println("解密出错：" + e.toString());
}
```

也是同样，跟上面用`AES-ECB`时的模式几乎一模一样，只是增加了一个`IvParameterSpec`，用来生成`iv`，在`cipher.init`里面增加了一个`iv`参数，除此之外完全相同，就这样我们就已经实现了一个简单的`CBC`模式。

## RSA

但是以上两种做法都明显是非常不安全的，因为我们把加密用的密钥和`iv`参数都直接暴露在了前端，为此我们需要一种更加安全的加密方法——`RSA`。因为`RSA`是非对称加密，即使我们把加密用的公钥完全暴露在前端也不必担心，别人即使截获了我们的密文，但因为他们没有解密密钥，是无法解出我们的明文的。

### 生成密钥对

要用`RSA`加密，首先我们需要生成一个公钥和一个私钥，我们可以直接执行命令`ssh-keygen`。它会问我们密钥文件保存的文件夹，注意一定要单独找一个文件夹存放，不要放在缺省文件夹下，否则你日常使用的`ssh`公钥和私钥就都被覆盖了。

得到公钥文件之后，由于这个公钥文件是`rfc4716`格式的，而我们的`forge`库要求一个`pkcs1`格式的公钥，所以这里我们需要把它转换成`pem`格式（也就是`pkcs1`格式）：

```bash
ssh-keygen -f 公钥文件名 -m pem -e
```

### RSA 的 Javascript 加密

得到`pem`格式的公钥之后，我们来看一下`js`的代码：

```js
forge.util.encode64(forge.pki.publicKeyFromPem('-----BEGIN RSA PUBLIC KEY-----MIIBCfdsafasfasfafsdaafdsaAB-----END RSA PUBLIC KEY-----').encrypt('这里是明文', 'RSA-OAEP', { md: forge.md.sha256.create(), mgf1: { md: forge.md.sha1.create() } });
```

一句话就完成整个加密过程了，这就是`forge`的强大之处。

### RSA 的 Java 解密

接下来我们看解密。

对于私钥，因为`Java`只支持`PKCS8`，而我们用`ssh-keygen`生成的私钥是`pkcs1`的，所以还需要用以下命令把`pkcs1`的私钥转换为`pkcs8`的私钥：

```bash
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in 私钥文件名 -out 导出文件名
```

得到`pkcs8`格式的私钥之后，我们把这个文件的头和尾去掉，然后放入以下`Java`代码：

```java
try {
    Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
    cipher.init(Cipher.DECRYPT_MODE, KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(Base64.getDecoder().decode("这里是私钥"))));
    String plaintext = new String(cipher.doFinal(Base64.getDecoder().decode("这里是密文".getBytes())), "UTF-8");
    System.out.println(plaintext);
} catch (Exception e) {
    System.out.println("解密出错：" + e.toString());
}
```

和上面的`AES`解密类似，只是增加了`KeyFactory`读取`PKCS8`格式私钥的部分，这样我们就完成了`Java`端的`RSA`解密。

---

以上我们用最简单的方式实现了`js`端加密，`java`端解密的过程，感兴趣的朋友可以在这里下载完整的代码亲自验证一下：

[代码](https://github.com/fengerzh/encdec)

[1]: https://github.com/ricmoo/aes-js
[2]: https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Crypto_API
[3]: https://github.com/digitalbazaar/forge/
