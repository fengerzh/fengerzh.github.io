---
title: 用Python画中国地图（二）
description: 按照中国人口普查数据为地图上色。
category: 编程
tags:
- python
- matplotlib
image: https://res.cloudinary.com/fengerzh/image/upload/map-2_tvls47.jpg
color: black
---

在上一篇文章《[用Python画一个中国地图][1]》中，我们简单描述了一下如何用`Python`快速画出一个中国地图的轮廓，似乎没有什么实用价值，这一次我们用实际数据填充它，使它看上去更有意义。

## 上色

延续上一次的代码，我们这次还是只增加`5`行代码：
```python
    from matplotlib.patches import Polygon

    ax = plt.gca()
    for nshape, seg in enumerate(m.states):
        poly = Polygon(seg, facecolor='r')
        ax.add_patch(poly)
```
在展示结果之前，稍微解释一下。第`2`行`plt.gca`，函数名看上去很诡异，是因为`Python`里大量使用了缩写，这个`gca`就是`Get Current Axes`的缩写，实际上就是要获得当前图形的座标轴。然后我们开始一个循环，把图形文件中各个省的多边形取出来，给它一个颜色，在这里我们统一放上红色，也就是`Red`的缩写`r`，然后把这个多边形放在我们图形的座标轴上，然后就得到了下图：

![clipboard.png](https://segmentfault.com/img/bVTSXY)

糟糕，怎么能少了台湾呢？在此郑重声明：**台湾是中华人民共和国不可分割的领土！**
加入台湾的`Shape`文件，然后循环一下：
```python
    m.readshapefile('TWN_adm_shp/TWN_adm0', 'taiwan', drawbounds=True)
    for nshape, seg in enumerate(m.taiwan):
        poly = Polygon(seg, facecolor='r')
        ax.add_patch(poly)
```

![clipboard.png](https://segmentfault.com/img/bVTS34)

好了，这下祖国山河一片红，看上去正确多了。

接下来，你还可以把各个省的名字打出来看一下，具体代码就不解释了：
```python
    for shapedict in m.states_info:
        statename = shapedict['NL_NAME_1']
        p = statename.split('|')
        if len(p) > 1:
            s = p[1]
        else:
            s = p[0]
        print(s)
    for shapedict in m.taiwan_info:
        s = shapedict['NAME_CHINE']
        print(s)
```
结果如下：

    安徽
    北京
    重庆
    福建
    福建
    福建
    ...

## 数据

接下来我们去国家统计局搞点[数据][2]，第六次全国人口普查数据可以直接下载`Excel`文件，略作修改，导出成`csv`文件，用我们上一课讲的方法，一句话读取进来：
```python
    df = pd.read_csv('chnpop.csv')
```
直接输出，大概是下面这个样子：

![clipboard.png](https://segmentfault.com/img/bVTTkz)

## 渲染

好了，数据也有了，我们终于要开始做一些激动人心的事情了。我们希望根据各省人口的多少用深浅不同的颜色为各个省份染色，那么首先第一步，我们需要选择一个调色板，也就是色彩映射表`colormap`，为此，`matplotlib`为你准备了[数不胜数的选择][3]，我们随便选择一款国旗色红黄色调的吧：
```python
    cmap = plt.cm.YlOrRd
```
然后我们把每个省的数据映射到`colormap`上：
```python
    colors[s] = cmap(np.sqrt((pop - vmin) / (vmax - vmin)))[:3]
```
最后，我们把各个省的颜色描在地图上：
```python
    color = rgb2hex(colors[statenames[nshape]])
    poly = Polygon(seg, facecolor=color, edgecolor=color)
```

![clipboard.png](https://segmentfault.com/img/bVTTJJ)

哒哒，我们的全国人口数量热力图就完成了！可以看到河南、四川、广东、山东几个省的颜色比较深，说明这几个省的人口总数最多，而西藏颜色最浅，代表这里的人口总数最少。

这里只是简单地举了一个例子，你还可以把各省的人口总数除以面积，得到人口密度数据，你还可以把各省的经济总量画在图上，总之，有了这个入门的方法，一切就都简单了呢。

最后，附上完整的代码供大家参考。

```python
import matplotlib.pyplot as plt
from mpl_toolkits.basemap import Basemap
from matplotlib.patches import Polygon
from matplotlib.colors import rgb2hex

plt.figure(figsize=(16,8))
m = Basemap(
    llcrnrlon=77,
    llcrnrlat=14,
    urcrnrlon=140,
    urcrnrlat=51,
    projection='lcc',
    lat_1=33,
    lat_2=45,
    lon_0=100
)
m.drawcountries(linewidth=1.5)
m.drawcoastlines()

m.readshapefile('CHN_adm_shp/CHN_adm1', 'states', drawbounds=True)

df = pd.read_csv('chnpop.csv')
df['省名'] = df.地区.str[:2]
df.set_index('省名', inplace=True)

statenames=[]
colors={}
cmap = plt.cm.YlOrRd
vmax = 100000000
vmin = 3000000
for shapedict in m.states_info:
    statename = shapedict['NL_NAME_1']
    p = statename.split('|')
    if len(p) > 1:
        s = p[1]
    else:
        s = p[0]
    s = s[:2]
    if s == '黑龍':
        s = '黑龙'
    statenames.append(s)
    pop = df['人口数'][s]
    colors[s] = cmap(np.sqrt((pop - vmin) / (vmax - vmin)))[:3]

ax = plt.gca()
for nshape, seg in enumerate(m.states):
    color = rgb2hex(colors[statenames[nshape]])
    poly = Polygon(seg, facecolor=color, edgecolor=color)
    ax.add_patch(poly)

plt.show()
```

  [1]: https://segmentfault.com/a/1190000010871928
  [2]: http://www.stats.gov.cn/tjsj/pcsj/rkpc/6rp/indexce.htm
  [3]: https://matplotlib.org/examples/color/colormaps_reference.html
