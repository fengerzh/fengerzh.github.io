---
title: 快速尝试时装界的MNIST数据库
introduction: 时尚MNIST数据库是用来检测图像识别能力的工具。
category: 编程
tags:
- python
- pandas
image: http://oy8a1lurl.bkt.clouddn.com/fashion.jpg
---

> 这篇文章的目的远远不是最优解，只是希望能帮助初学者快速上手，了解如何快速建立一个模型并评估它的成绩。

## 时尚MNIST数据库

[时尚MNIST数据库][1]包含了`60,000`个训练样本和`10,000`个测试样本。每个样本都是一张`28x28`的黑白时尚图，包括衣服、裤子、鞋子等等，一共分为`10`个类别，都已经标注了正确标签。为什么要有这个数据库呢？是因为旧的基于手写阿拉伯数字的[MNIST数据库][2]已经快被人们玩烂了，有很多模型专门针对它做了优化，那么这些模型是不是普适的呢？可以拿来在这个新的时尚库上试一下。

![ce240d841191448b9199d0cbd3dbc2ca.jpeg][3]

## 读取数据

首先，我们把数据读入：

    df = pd.read_csv('fashionmnist/fashion-mnist_train.csv', dtype=int) # read train data
    dft = pd.read_csv('fashionmnist/fashion-mnist_test.csv', dtype=int) # read test data

数据集分为两部分：一部分是训练数据集，一部分是测试数据集。

然后，我们把数据分为`X`特征值部分和`y`结果值部分：

    X_train = df.drop('label', axis=1)
    y_train = df['label']
    X_test = dft.drop('label', axis=1)
    y_test = dft['label']

## 训练模型

sklearn的三板斧：**建立模型、训练、预测**。就是这么简单。

    model = RandomForestClassifier(n_estimators=80, random_state=0, n_jobs=-1)
    model.fit(X_train, y_train.values.ravel())
    print(model.score(X_test, y_test))

在这里我们选择了**随机森林分类法**，并不是因为它最好，而是由于它是所有算法里最快又相对最准的一个算法，几秒钟的时间就可以轻轻松松建立一个准确率达到`88%`的模型，所以建立模型的速度非常快，但它的缺点也很明显，无法进一步提高成绩。如果想把准确率提升到`90%`以上，就需要用到`CNN`等神经网络算法，但那些算法的建模时间非常耗时，为了快速上手并验证，我们先拿随机森林入手。

## 显示模型

模型建完了，如果是全数据集的话，你可以看到它的准确率已经能达到`88%`左右，这一成绩已经远好于`sklearn`库里的其他大部分算法。也许你想看一看这个森林长什么样的，实际上这个森林是由很多棵树决定的，上面我们定义了`n_estimators=80`，就是说这个森林里有`80`棵树，实际上，如果把森林里的树增加到`1000`棵甚至`10000`棵也可以，但那样比较耗时间，所以我这里折衷取了一个`80`，你如果电脑足够快，可以尝试更多棵树，应该会取得更好的成绩。但是一个`80`棵树的森林看起来也比较费时间，这里我们就只拎出一棵树来看看样子就够了：

    tree_pic = export_graphviz(model.estimators_[0], out_file="mytree.dot")
    with open("mytree.dot") as f:
        dot_graph = f.read()
    graphviz.Source(dot_graph)

![clipboard.png](https://segmentfault.com/img/bVUIoA)

这棵树实在是太大了，因为它是由很多个点组成的，所以无法直接在屏幕上看到它的全貌，一棵树都看不全，我们就不要试图去看80甚至更多棵树了。总之，你通过这个图有一个感性认识知道电脑是如何学习分类的就够了。

## 评估模型

最后，我们用一张图看显示一下这个模型的学习成绩：

    cv = ShuffleSplit(n_splits=20, test_size=0.2, random_state=0)
    plot_learning_curve(model, "学习曲线", X_train, y_train, (0.6, 1.01), cv=cv, n_jobs=4)
    plt.show()

在这里，我们只选了训练数据集的前`2000`行，因为如果是缺省的`60000`行的话，运行时间会非常之长，得到结果如下图：

![clipboard.png](https://segmentfault.com/img/bVUIqc)

可以看到交叉验证成绩随着样本数的上升在稳步上升，但最终目标值有点远，而训练成绩一直很不错，说明这个模型是一个**低偏差(Low Bias)高方差(High Variance)**的模型。关于偏差和方差的关系，可以看知乎上[这篇文章][4]，讲得很清楚。我们这个模型大概位于右上角这个位置。
![v2-286539c808d9a429e69fd59fe33a16dd_b.png][5]

最后，附上全部源码，供大家参考：

    import numpy as np
    import pandas as pd
    import graphviz
    import matplotlib.pyplot as plt
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.tree import export_graphviz
    from sklearn.model_selection import learning_curve
    from sklearn.model_selection import ShuffleSplit

    df = pd.read_csv('fashionmnist/fashion-mnist_train.csv', dtype=int)
    dft = pd.read_csv('fashionmnist/fashion-mnist_test.csv', dtype=int)
    df = df.head(2000) # 只取前2000行，以节省运算时间，如果想取得最佳成绩，可以把这一行去掉，但时间会很长

    X_train = df.drop('label', axis=1)
    y_train = df['label']
    X_test = dft.drop('label', axis=1)
    y_test = dft['label']

    # 建模
    model = RandomForestClassifier(n_estimators=80, random_state=0, n_jobs=-1) # 森林里树越多越准确，相应运算时间也运长
    model.fit(X_train, y_train.values.ravel())
    print(model.score(X_test, y_test))

    # 画树
    export_graphviz(model.estimators_[0], out_file="mytree.dot")
    with open("mytree.dot") as f:
        dot_graph = f.read()
    graphviz.Source(dot_graph)

    # 画图
    def plot_learning_curve(estimator, title, X, y, ylim=None, cv=None, n_jobs=1, train_sizes=np.linspace(.1, 1.0, 5)):
        plt.figure()
        plt.title(title)
        if ylim is not None:
            plt.ylim(*ylim)
        plt.xlabel("训练样本数")
        plt.ylabel("成绩")
        train_sizes, train_scores, test_scores = learning_curve(estimator, X, y, cv=cv, n_jobs=n_jobs, train_sizes=train_sizes)
        train_scores_mean = np.mean(train_scores, axis=1)
        train_scores_std = np.std(train_scores, axis=1)
        test_scores_mean = np.mean(test_scores, axis=1)
        test_scores_std = np.std(test_scores, axis=1)
        plt.grid()

        plt.fill_between(train_sizes, train_scores_mean - train_scores_std, train_scores_mean + train_scores_std, alpha=0.1, color="r")
        plt.fill_between(train_sizes, test_scores_mean - test_scores_std, test_scores_mean + test_scores_std, alpha=0.1, color="g")
        plt.plot(train_sizes, train_scores_mean, 'o-', color="r", label="训练成绩")
        plt.plot(train_sizes, test_scores_mean, 'o-', color="g", label="交叉验证成绩")

        plt.legend(loc="best")
        return plt

    cv = ShuffleSplit(n_splits=20, test_size=0.2, random_state=0)
    plot_learning_curve(model, "学习曲线", X_train, y_train, (0.6, 1.01), cv=cv, n_jobs=4)
    plt.show()


  [1]: https://github.com/zalandoresearch/fashion-mnist
  [2]: http://yann.lecun.com/exdb/mnist/
  [3]: https://segmentfault.com/img/bVUIkw
  [4]: https://www.zhihu.com/question/27068705
  [5]: https://segmentfault.com/img/bVUIqW