---
title: 只在工作日执行的脚本
image: https://image-static.segmentfault.com/234/579/2345790797-62b1672f9951d_cover
category: 运维
tags:
  - python
  - cron
description: 有时候我们会需要定时执行一个脚本。
color: black
---

有时候我们会需要定时执行一个脚本，那么可以用 `cronjob` 来完成，比如这样：

```
10 04 * * * /usr/local/bin/somework.sh
```

有时候，只希望这个脚本在工作日执行，比如这样：

```
10 04 * * 1-5 /usr/local/bin/somework.sh
```

但是工作日有时候又不是简单的周一到周五，比如赶上个小长假什么的，有时候周六要上班，有时候周一又不上班，这时候这样的设置就容易乱，那我们怎么设置这个 `cronjob` 才能让他预知我们的放假排班计划，并做到丝毫不乱呢？

只用 `cron` 是不行的，我们需要在脚本里调取一个开放接口获知放假安排，然后就可以按计划执行了。

这个开放接口在这里： <https://github.com/NateScarlet/holiday-cn>

我们简单写一个脚本：

```python
#!/usr/local/bin/python
"""每天定时执行脚本"""
import datetime
import requests


def will_work(date):
    """检查该天是否需要工作"""
    holiday_data = requests.get(
        url='https://natescarlet.coding.net/p/github/d/holiday-cn/git/raw/master/2022.json'
    ).json()
    # 放入公司规定的特殊考勤日
    holiday_data['days'].append({
        'date': '2022-06-21',
        'isOffDay': False
    })
    # 检查该日期是否在列表中
    days_in_list = [day for day in holiday_data['days'] if day['date']
                    == datetime.datetime.strftime(date, '%Y-%m-%d')]
    if days_in_list:
        # 是否在节假日倒休表里，如果在倒休表里，按倒休表作息
        return not (days_in_list[0]["isOffDay"])
    else:
        # 按照周一至周五作息
        return True if date.weekday() < 5 else False


def main():
    """主函数"""
    if will_work(datetime.datetime(2022, 6, 21, 0, 0, 0, 0)):
        print("今天要上班")
    else:
        print("今天不上班")


if __name__ == '__main__':
    main()
```

赋予它执行权限：

```
chmod +x somework.py
```

然后定一下 cronjob：

```
10 04 * * * /usr/local/bin/somework.py
```

就可以每个工作日执行了。
