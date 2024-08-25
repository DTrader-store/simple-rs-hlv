
* * *

  


《RS 策略》（Resistance Support）阻力支撑策略。是一种在金融交易中广泛应用的技术分析策略，其核心在于对价格波动中的阻力位和支撑位的准确判断和运用。

* * *

 注：策略的 数据与实盘接口基于 DTrader 实现

  


大家好，我是Regan奇。 从今天起我将给大家带来《凭技术能亏钱？》系列文章。旨在用最简单的语言、不借助任何量化交易框架的前提下为大家写出可能曾存在于大家脑海模糊认为这个策略一定能赚的策略，尽量一步一步完善，接入实盘 看看它们是否能盈利～

**策略的不可能三角**  


不可能三角：胜率高、收益高、频次高。我们写策略往往舍弃其一，将另外两项做到最优。

量化交易策略是将胜率和频次做到最优但是舍弃高收益，它每次收益都不高，它通过高频次的低收益积累优势。

**如何写一个策略**  ****

写一个策略前想清楚下面5个要素

1.  哪类股票：当前策略适合哪种市场是主板还是创业板还是科创板。适合那种类型走势 是震荡型的还是暴力拉升型的。
1.  何时入场：当前策略要有明确的入场信号，要无歧义可执行。
1.  何时止盈：当前策略要有明确的出场信号，要无歧义可执行
1.  何时止损：当前策略要有明确的止损信号，要无歧义可执行。
1.  仓位管理：当前策略如何管理仓位

          

# **先从最简单策略开始**

#

以下是myTT实现（也就是股票软件里面的公式编辑语言）

```

TOP:REF(HHV(H,38),1),Colorred;

BUTTOM:REF(LLV(L,38),1),colorgreen;

```

         ![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/31dbeac1b30d43fb8bc666d05933c75c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgRFRyYWRlcg==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjE1NDY5ODUyMDY2NzY2MSJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1724699864&x-orig-sign=MDpdnCZRuOiJoV%2BXJyTJQAbX%2BnQ%3D)

          

看下在沪深300ETF里的效果

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/0a9499c5a75c4260863a9783b9005892~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgRFRyYWRlcg==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjE1NDY5ODUyMDY2NzY2MSJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1724699864&x-orig-sign=vB56Hkc4T9g6ptsqsuTk2uB3tgI%3D)

### 绿色线是BUTTOM 也就是 支撑位，红色线TOP 也就是阻力位

  


### **股价击穿支撑位后涨回概率是很高的，同样上穿阻力位后，快速跌回去。支撑位是近期的价格的最低点，如果这个点买入还要下挫，那在其他地方买入一定亏惨了。策略本质是将 胜率 因素做到最优，而且支撑位如果有效将开启一波趋势上涨。收益率也相对较高，但是频次非常低，可能一个月也不会有一次交易机会。**

****

**所有的RS策略都是将胜率和收益率做到最优舍弃交易频次，但是如果通过程序监控整个市场，其实它的交易频次可以通过股票数量来解决，五要素里面选股非常重要。**

  


### 代码示意  

`REF(VALUE,N)`:取 VALUE 前 N周期的值

`HHV(VALUE,N)`: 取前N天里VALUE的最大值

`LLV(VALUE,N)`: 取前N天里VALUE的最小值

 了解上面函数意思，下面就好理解了    

`TOP`: 也就是 `阻力位` ， 意义是 前38天的最高价

`BUTTOM`：也就是 `支撑位`  意义是 前38天的最低价

看下它的回测  


![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/52aa2ff3e8a8452ba930247e402dee77~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgRFRyYWRlcg==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjE1NDY5ODUyMDY2NzY2MSJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1724699864&x-orig-sign=jlsI9z%2FAjLowwEgrh4agJMWcXwU%3D)

定下这个策略的5要素：

股票种类：挑选处于震荡 or上升趋势的股票。为了方便我们跳过股票种类选择步骤本文只选择 510300（沪深300）

何时入场：当最新价底部上穿 `BUTTOM`时，买入

何时止盈：当最新价下穿`TOP`时，卖出

何时止损：留给后面策略完善，本策略不考虑它

仓位管理：仓位5等分，每次触及买入一份    

这个策略非常简单，但是往往越简单越有效！而且它还有很多可以优化和调整的地方。我们放在后面聊。

  


![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/05ea25f13e5c402cafed46bc77355489~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgRFRyYWRlcg==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjE1NDY5ODUyMDY2NzY2MSJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1724699864&x-orig-sign=dObBB7pC1b9OfxwbpEg28cX6HC8%3D)

  


这个策略及其简单，但是非常有效。交易者往往缺乏耐心，在不该交易的点位频繁交易，在有支撑地方却又畏首畏尾，人类情绪往往会让你反复受挫。机器遵循策略交易，成败只在乎于策略本身，每个交易者应该把时间从感受交易情绪中抽出，集中于完善策略，把时间放慢，你会发现一切都将不一样！

对于RS策略震荡行情是最好的，本文只选择沪深300ETF，DTrader特色数据里有适合RS策略的震荡式股票的接口。

# 支持券商

| 符号  | 意义   |
| --- | ---- |
| `✅` | 完全测试 |
| ❗️  | 部分测试 |
| ❌   | 不可用  |

  


❗️ *部分测试* 是指功能未在对应券商上 充分测试

现在邀请测试官，协助测试。 可以获取额外3个月使用卡

| 券商        | 下单/撤单 | 查看订单 | 行情  |
| --------- | ----- | ---- | --- |
| 财信证券(原财富) | `✅`   | `✅`  | `✅` |
| 长江证券      | `✅`   | `✅`  | `✅` |
| 爱建证券      | `✅`   | `❗️` | `✅` |
| 渤海证券      | `✅`   | `❗️` | `✅` |
| 财达证券      | `✅`   | `❗️` | `✅` |
| 长城国瑞证券    | `✅`   | `❗️` | `✅` |
| 川财证券      | `✅`   | `❗️` | `✅` |
| 长城证券      | `✅`   | `❗️` | `✅` |
| 财通证券      | `✅`   | `❗️` | `✅` |
| 东吴证券      | `✅`   | `❗️` | `✅` |
| 东方证券      | `✅`   | `❗️` | `✅` |
| 东兴证券      | `✅`   | `❗️` | `✅` |
| 东北证券      | `✅`   | `❗️` | `✅` |
| 大同证券      | `✅`   | `❗️` | `✅` |
| 德邦证券      | `✅`   | `❗️` | `✅` |
| 东海证券      | `✅`   | `❗️` | `✅` |
| 东莞证券      | `✅`   | `❗️` | `✅` |
| 第一创业      | `✅`   | `❗️` | `✅` |
| 东亚前海      | `✅`   | `❗️` | `✅` |
| 国信证券      | `✅`   | `❗️` | `✅` |
| 国都证券      | `✅`   | `❗️` | `✅` |
| 国新证券      | `✅`   | `❗️` | `✅` |
| 国联证券      | `✅`   | `❗️` | `✅` |
| 国元证券      | `✅`   | `❗️` | `✅` |
| 国融证券      | `✅`   | `❗️` | `✅` |
| 国投证券(原安信) | `✅`   | `❗️` | `✅` |
| 国泰君安      | `✅`   | `❗️` | `✅` |
| 国金证券      | `✅`   | `❗️` | `✅` |
| 国盛证券      | `✅`   | `❗️` | `✅` |
| 光大证券      | `✅`   | `❗️` | `✅` |
| 华福证券      | `✅`   | `❗️` | `✅` |
| 红塔证券      | `✅`   | `❗️` | `✅` |
| 华源证券      | `✅`   | `❗️` | `✅` |
| 华金证券      | `✅`   | `❗️` | `✅` |
| 华创证券      | `✅`   | `❗️` | `✅` |
| 华鑫证券      | `✅`   | `❗️` | `✅` |
| 华鑫证券(奇点)  | `✅`   |      | `✅` |
| 华安证券      | `✅`   | `❗️` | `✅` |
| 华龙证券      | `✅`   | `❗️` | `✅` |
| 宏信证券      | `✅`   | `❗️` | `✅` |
| 华林证券      | `✅`   | `❗️` | `✅` |
| 恒泰证券      | `✅`   | `❗️` | `✅` |
| 金圆统一证券    | `✅`   | `❗️` | `✅` |
| 江海证券      | `✅`   | `❗️` | `✅` |
| 金元证券      | `✅`   | `❗️` | `✅` |
| 开源证券      | `✅`   | `❗️` | `✅` |
| 联储证券      | `✅`   | `❗️` | `✅` |
| 民生证券      | `✅`   | `❗️` | `✅` |
| 麦高证券(原网信) | `✅`   | `❗️` | `✅` |
| 南京证券      | `✅`   | `❗️` | `✅` |
| 平安证券      | `✅`   | `❗️` | `✅` |
| 申港证券      | `✅`   | `❗️` | `✅` |
| 申万宏源(原申万) | `✅`   | `❗️` | `✅` |
| 申万宏源(原宏源) | `✅`   | `❗️` | `✅` |
| 首创证券      | `✅`   | `❗️` | `✅` |
| 世纪证券      | `✅`   | `❗️` | `✅` |
| 上海证券      | `✅`   | `❗️` | `✅` |
| 山西证券      | `✅`   | `❗️` | `✅` |
| 太平洋证券     | `✅`   | `❗️` | `✅` |
| 天风证券      | `✅`   | `❗️` | `✅` |
| 万和证券      | `✅`   | `❗️` | `✅` |
| 万联证券      | `✅`   | `❗️` | `✅` |
| 五矿证券      | `✅`   | `❗️` | `✅` |
| 信达证券      | `✅`   | `❗️` | `✅` |
| 兴业证券      | `✅`   | `❗️` | `✅` |
| 西南证券      | `✅`   | `❗️` | `✅` |
| 湘财证券      | `✅`   | `❗️` | `✅` |
| 甬兴证券      | `✅`   | `❗️` | `✅` |
| 银泰证券      | `✅`   | `❗️` | `✅` |
| 粤开证券      | `✅`   | `❗️` | `✅` |
| 野村东方国际    | `✅`   | `❗️` | `✅` |
| 银河证券      | `✅`   | `❗️` | `✅` |
| 中天国富证券    | `✅`   | `❗️` | `✅` |
| 中信建投证券    | `✅`   | `❗️` | `✅` |
| 中泰证券      | `✅`   | `❗️` | `✅` |
| 中天证券      | `✅`   | `❗️` | `✅` |
| 中山证券      | `✅`   | `❗️` | `✅` |
| 中信浙江      | `✅`   | `❗️` | `✅` |
| 中信证券      | `✅`   | `❗️` | `✅` |
| 中邮证券      | `✅`   | `❗️` | `✅` |
| 中金财富      | `✅`   | `❗️` | `✅` |
| 中航证券      | `✅`   | `❗️` | `✅` |
| 中原证券      | `✅`   | `❗️` | `✅` |
| 浙商证券      | `✅`   | `❗️` | `✅` |
| 中银证券      | `✅`   | `❗️` | `✅` |
| 中信华南(原广州) | `✅`   | `❗️` | `✅`