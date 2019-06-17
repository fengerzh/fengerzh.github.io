---
title: 从一道前端面试题谈起
image: https://res.cloudinary.com/fengerzh/image/upload/frontend-interview_ls8isw.jpg
category: 前端
tags:
  - algorithm
  - javascript
description: 反转一个单链表。
color: black
---

今天在知乎上看到一个回答《[为什么前端工程师那么难招？](https://www.zhihu.com/question/321955801/answer/678374429)》，作者提到说有很多前端工程师甚至连单链表翻转都写不出来。说实话，来面试的孩子们本来就紧张，你要冷不丁问一句单链表翻转怎么写，估计很多人都会蒙掉。

![clipboard.png](https://segmentfault.com/img/bVbtn7H)

于是我在[leetcode](https://leetcode-cn.com/) 上找了一下[这道题](https://leetcode-cn.com/problems/reverse-linked-list/)，看看我能不能写得出来。

题目的要求很简单：

> 反转一个单链表。
>
> **示例:** > **输入:** 1->2->3->4->5->NULL
> **输出:** 5->4->3->2->1->NULL

最后的解决就是这样的一行代码：

```js
const reverseList = (head, q = null) =>
  head !== null ? reverseList(head.next, { val: head.val, next: q }) : q;
```

答案并不重要，有意思的是整个的解题思路。

## 前端工程师需要了解算法吗

在解题之前，我们先来聊聊算法。严格来说，单链表翻转这种问题只是对于链表这种数据结构的一种操控而已，根本谈不上是什么算法。当然，宽泛地来说，只要涉及到循环和递归的都把它归入到算法也可以。在这里，我们采用一种宽容的定义。

算法需要背吗？我觉得算法是不需要背的，你也不可能背的下来，光`leetcode`就有上千道题目，并且还在增加，怎么可能背的下来？所以对于现阶段的程序员来说，算法分为两类，一类是你自己能推算出来的，这种不用背，一类是你推算不出来的，比如[KMP 算法](https://zh.wikipedia.org/wiki/%E5%85%8B%E5%8A%AA%E6%96%AF-%E8%8E%AB%E9%87%8C%E6%96%AF-%E6%99%AE%E6%8B%89%E7%89%B9%E7%AE%97%E6%B3%95)，这种也不用背，需要的时候直接`Google`就可以了。特别是对于前端以及 80%的后端程序员来说，你需要什么算法，就直接使用现在的库就行了，数组排序直接`array.sort`就可以，谁没事还非要去写一个快速排序？

那为什么面试前端的时候还必须要考算法？这个道理基本上类似于通过考脑筋急转弯来测试智商一样，实际工作中是完全用不上的，就像高考的时候考一大堆物理、化学、生物，恨不得你上知天文，下知地理，上下五千年，精通多国语言，但其实你参加工作以后发现根本用不上一样，这其实就是一个智商筛子，过滤一下而已。

所以，别管工作中用不用得到，如果你想通过这道筛子的话，算法的东西多少还是应该学习一些的。

## 单链表的数据结构

说实话，我刚做这道题的时候，我也有点蒙。虽然上学的时候学过数据结构，链表、堆栈、二叉树这些东西，但这么多年实际工作中用的很少，几乎都快忘光了，不过没关系，我们就把它当成是脑筋急转弯来做一下好了。

我们先来看一下它的数据结构是什么样的：

```js
var reverseList = function(head) {
  console.log(head);
};
```

```json
ListNode {
  val: 1, next: ListNode {
    val: 2, next: ListNode {
      val: 3, next: [ListNode] } } }
```

一个对象里包含了两个属性，一个属性是`val`，一个属性是`next`，这样一层一层循环嵌套下去。

通常来讲，在前端开发当中，我们最常用的是数组。如果是用数组的话，就太简单了，`js`数组自带`reverse`方法，直接`array.reverse`反转就行了。但是题目非要弄成链表的形式，说实在的，我真没有见过前端什么地方还需要用链表这种结构的（除了面试的时候），所以说这种题目对于实际工作是没什么用处的，但是脑筋急转弯的智商题既然这样出了，我们就来看看怎么解决它吧。

## 循环迭代

首先想到的，这肯定是一个`while`循环，循环到最后，发现`next`是`null`就结束，这个很容易想。但关键是怎么倒序呢？这个地方需要稍微动一下脑子。我们观察一下，倒序之后的结果，`1`变成了最后一个，也就是说`1`的`next`是`null`，而`2`的`next`是`1`。所以我们一上来先构建一个`next`是`null`的`1`结点，然后读到`2`的时候，把`2`的`next`指向`1`，这样不就倒过了吗？所以一开始的程序写出来是这样的：

```js
var reverseList = function(head) {
  let p = head;
  let q = { val: p.val, next: null };
  while (p.next !== null) {
    p = p.next;
    q = { val: p.val, next: q };
  }
  return q;
};
```

先初始化了一个`q`，它的`next`是`null`，所以它就是我们的尾结点，然后再一个一个指向它，这样整个链表就倒序翻转过来了。

第一个测试用例没有问题，于是就提交了，但是提交完了发现不对，如果`head`本身是`null`的话，会报错，所以修改了一下：

```js
var reverseList = function(head) {
  let p = head;
  if (p === null) {
    return null;
  }
  let q = { val: p.val, next: null };
  while (p.next !== null) {
    p = p.next;
    q = { val: p.val, next: q };
  }
  return q;
};
```

这回就过了。

## 递归

解决是解决了，但是这么长的代码，明显不够优雅，我们尝试用递归的方法对它进一步优化。

如果有全局变量的话，递归本身并不复杂。但因为`leetcode`里不允许用全局变量，所以我们只好构造一个双参数的函数，把倒序之后的结果也作为一个参数传进去，这样刚一开始的时候`q`是一个`null`，随着递归的层层深入，`q`逐渐包裹起来，直到最后一层：

```js
const reverseList = function(head) {
  let q = null;
  return r(head, q);
};
const r = function(p, q) {
  if (p === null) {
    return q;
  } else {
    return r(p.next, { val: p.val, next: q });
  }
};
```

这里我们终于理清了出题者的思路，用递归的方式我们可以把这个`if`判断作为整个递归结束的必要条件。如果`p`不是`null`，那么我们就再做一次，把`p`的下一个结点放进来，比如说`1`的下一个是`2`，那么我们这时候就从`2`开始执行，直到最后走到`5`，`5`的下一个结点是`null`，然后我们退回上一层，这样一层层钻下去，最后再一层层返回来，就完成了整个翻转的过程。

## 优化代码

递归成功之后，后面的事情就相对简单了。

怎么能把代码弄简短一些呢？我们注意到这里这个`if`语句里面都是直接`return`，那我们干脆直接做个三元操作符就好了：

```js
const reverseList = function(head) {
  let q = null;
  return r(head, q);
};
const r = function(p, q) {
  return p === null ? q : r(p.next, { val: p.val, next: q });
};
```

更进一步，我们用箭头函数来表示：

```js
const reverseList = head => {
  let q = null;
  return r(head, q);
};
const r = (p, q) => {
  return p === null ? q : r(p.next, { val: p.val, next: q });
};
```

箭头函数还有一个特色是如果你只有一条`return`语句的话，连外面的花括号和`return`关键字都可以省掉，于是就变成了这样：

```js
const reverseList = head => {
  let q = null;
  return r(head, q);
};
const r = (p, q) => (p === null ? q : r(p.next, { val: p.val, next: q }));
```

这样是不是看着就短多了呢？但是还可以更进一步简化，我们把上面的函数再精简，这时候你仔细观察的话，会发现第一个函数和第二个函数很类似，都是在调用第二个函数，那么我们能不能精简一下把它们合并呢？我们先把第一个函数变换为和第二函数的参数数目一致的形式：

```js
const reverseList = (head, q) => r(head, q);
const r = (p, q) => (p === null ? q : r(p.next, { val: p.val, next: q }));
```

但这时候出现了一个问题，如果`q`没有初始值的话，它是`undefined`，不是`null`，所以我们还需要给`q`一个初始值：

```js
const reverseList = (head, q = null) => r(head, q);
const r = (p, q) => (p === null ? q : r(p.next, { val: p.val, next: q }));
```

这时候我们的两个函数长的基本一致了，我们来把它们合并一下：

```js
const reverseList = (head, q = null) =>
  head === null ? q : reverseList(head.next, { val: head.val, next: q });
```

看，这样你就得到了一个一行代码的递归函数可以解决单链表翻转的问题。

## 结语

实话说，即使是像我这样有多年经验的程序员，要解决这样的一个问题，都需要这么长的时间这么多步骤才能优化完美，更何况说一个大学刚毕业的孩子，很难当场就一次性回答正确，能把思路说出来就很不容易了，但你可以从这个过程中看到程序代码是如何逐渐演进的。背诵算法没有意义，我觉得我们更多需要的是这一个思考的过程，毕竟编程是一个脑筋急转弯的过程，不是唐诗三百首。
