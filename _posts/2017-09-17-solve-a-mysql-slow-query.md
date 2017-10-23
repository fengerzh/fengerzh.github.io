---
title: 解决一个mysql慢查询
introduction: 慢sql是影响系统性能的重要因素，必须解决好这个问题。
category: 运维
tags:
- mysql
image: http://oy8a1lurl.bkt.clouddn.com/mysql.jpg
---

之前一直依赖惯了通过`mysql`慢查询文本日志来解决问题，这次遇到的情况是无法访问文本日志，只能在`mysql`客户端里鼓捣，经过一番周折之后，终于顺利解决问题，原先一个页面的首字节返回时间长达24秒，经过优化后缩短为1秒。以下记录操作步骤。

### 设置
首先，看一下慢查询日志有没有开：

    show variables like '%slow%';

|---------------------------+-------------------------------------------|
| Variable_name             | Value                                     |
|---------------------------+-------------------------------------------|
| log_slow_admin_statements | ON                                        |
| log_slow_slave_statements | OFF                                       |
| slow_launch_time          | 2                                         |
| slow_query_log            | ON                                        |
| slow_query_log_file       | /home/mysql/data3001/mysql/slow_query.log |
|---------------------------+-------------------------------------------|

第4行为ON，说明已经开了，如果没有开的话，就先开一下吧。

    show variables like '%long%';

|----------------------------------------------------------+----------|
| Variable_name                                            | Value    |
|----------------------------------------------------------+----------|
| long_query_time                                          | 1.000000 |
| performance_schema_events_stages_history_long_size       | 0        |
| performance_schema_events_statements_history_long_size   | 0        |
| performance_schema_events_transactions_history_long_size | 0        |
| performance_schema_events_waits_history_long_size        | 0        |
|----------------------------------------------------------+----------|

第1行说明慢查询门槛值是1秒，也就是说只要任意一个查询时间超过了1秒的就会被记录，如果你觉得这个值有点太低，也可以改为5秒或者10秒，看你觉得多长时间的一个查询是不可接受的。

    show variables like '%log_output%';

|---------------+-------|
| Variable_name | Value |
|---------------+-------|
| log_output    | TABLE |
|---------------+-------|

这里比较关键，log的输出方式是`TABLE`，才能把结果记录在数据库表中。

    use mysql;
    show tables;

|---------------------------|
| Tables_in_mysql           |
|---------------------------|
| columns_priv              |
| db                        |
| engine_cost               |
| event                     |
| func                      |
| general_log               |
| gtid_executed             |
| help_category             |
| help_keyword              |
| help_relation             |
| help_topic                |
| innodb_index_stats        |
| innodb_table_stats        |
| ndb_binlog_index          |
| plugin                    |
| proc                      |
| procs_priv                |
| proxies_priv              |
| server_cost               |
| servers                   |
| slave_master_info         |
| slave_relay_log_info      |
| slave_worker_info         |
| slow_log                  |
| tables_priv               |
| time_zone                 |
| time_zone_leap_second     |
| time_zone_name            |
| time_zone_transition      |
| time_zone_transition_type |
| user                      |
|---------------------------|

这里有一个表`slow_log`，它就是存储我们的慢查询日志的地方了。

    desc slow_log;

|----------------+---------------------+------+-----+----------------------+--------------------------------|
| Field          | Type                | Null | Key | Default              | Extra                          |
|----------------+---------------------+------+-----+----------------------+--------------------------------|
| start_time     | timestamp(6)        | NO   |     | CURRENT_TIMESTAMP(6) | on update CURRENT_TIMESTAMP(6) |
| user_host      | mediumtext          | NO   |     | NULL                 |                                |
| query_time     | time(6)             | NO   |     | NULL                 |                                |
| lock_time      | time(6)             | NO   |     | NULL                 |                                |
| rows_sent      | int(11)             | NO   |     | NULL                 |                                |
| rows_examined  | int(11)             | NO   |     | NULL                 |                                |
| db             | varchar(512)        | NO   |     | NULL                 |                                |
| last_insert_id | int(11)             | NO   |     | NULL                 |                                |
| insert_id      | int(11)             | NO   |     | NULL                 |                                |
| server_id      | int(10) unsigned    | NO   |     | NULL                 |                                |
| sql_text       | mediumblob          | NO   |     | NULL                 |                                |
| thread_id      | bigint(21) unsigned | NO   |     | NULL                 |                                |
|----------------+---------------------+------+-----+----------------------+--------------------------------|

### 分析

在`slow_log`表中，`query_time`是我们最关心的：

    select query_time, rows_sent, rows_examined, db from mysql.slow_log where query_time > 10 and rows_sent < 100 limit 10;

|-----------------+-----------+---------------+-------|
| query_time      | rows_sent | rows_examined | db    |
|-----------------+-----------+---------------+-------|
| 00:00:17.187272 |        15 |         15733 | mydb |
| 00:00:18.948918 |        15 |         15733 | mydb |
| 00:00:18.901217 |        15 |         15733 | mydb |
| 00:00:18.590528 |        15 |         15733 | mydb |
| 00:00:17.173634 |        15 |         15733 | mydb |
| 00:00:13.013449 |        15 |         15733 | mydb |
| 00:00:15.114500 |        15 |         15733 | mydb |
| 00:00:19.771646 |        15 |         15733 | mydb |
| 00:00:21.683656 |        15 |         15733 | mydb |
| 00:00:22.271268 |        15 |         15733 | mydb |
|-----------------+-----------+---------------+-------|

可以看到有很多次查询虽然只返回15条数据，而耗时竟然长达17秒！是可忍，孰不可忍！我们先只取第1条数据看一下：

    select sql_text from mysql.slow_log order by start_time desc limit 1;

结果就是这条语句：

    select * from a left join b on b.parentid=a.id LEFT join d on d.memberid=b.memberid  limit 0, 15;

就是这么一条简单的sql语句，怎么就会需要17秒呢？我们首先怀疑的就是有没有加索引，索引不需要在每个字段上加，但是这里的查询关系上必须有，比如`a.id`, `b.parentid`, `d.memberid`, `b.memberid`。

    show index from b;

|---------------+------------+------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------|
| Table         | Non_unique | Key_name   | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
|---------------+------------+------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------|
| b |          0 | PRIMARY    |            1 | id          | A         |        6714 |     NULL | NULL   |      | BTREE      |         |               |
|---------------+------------+------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------|

不出所料，果然只在主键上加了索引，而关键的`parentid`没有索引。

### 添加索引

    alter table b add index b_parent (parentid);

再次查看索引：

    show index from b;

|---------------+------------+------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------|
| Table         | Non_unique | Key_name   | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
|---------------+------------+------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------|
| b |          0 | PRIMARY    |            1 | id          | A         |        6714 |     NULL | NULL   |      | BTREE      |         |               |
| b |          1 | b_parent |            1 | parentid    | A         |        6593 |     NULL | NULL   | YES  | BTREE      |         |               |
|---------------+------------+------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------|

依此类推，把我们所有缺索引的地方统统都加上索引，再次查询，时间缩短到1秒以内，收工！