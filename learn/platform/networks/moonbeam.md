---
title: Moonbeam概览
description: Moonbeam在波卡上部署的当前配置和部署概览，以及如何使用Solidity开始在Moonbeam上部署。
---

# Moonbeam

## 目标 {: #goal }

Moonbeam将于2021年12月17日作为平行链部署至波卡（Polkadot）。Moonbeam是波卡（Polkadot）生态系统中最兼容以太坊的智能合约平行链，允许开发者以最小程度的代码更改（甚至无需更改）将其项目部署至Moonbeam，使他们可以访问波卡（Polkadot）生态系统及其所有资产。

如果您有任何意见或建议，或需要任何技术支持，欢迎加入[Moonbase AlphaNet的专用Discord频道](https://discord.gg/PfpUATX){target=_blank}。

## 初始配置 {: #initial-configurations }  

Moonbeam完全启动后将拥有以下配置：

- 以平行链的形式运行并连接至波卡（Polkadot）中继链
- 拥有{{ networks.moonbeam.staking.max_candidates }}位收集人的活跃收集人集
- 拥有提供商提供的[API端点](/builders/get-started/endpoints/){target=_blank}以连接到网络。项目也可以运行和访问[自己的私有节点](/node-operators/networks/run-a-node/){target=_blank}。

![Moonbeam Diagram](/images/learn/platform/networks/moonbeam-diagram.webp)

需要注意的重要变量/配置如下所示（仍会发生变化）：

=== "一般配置"
    |       变量        |                                  值                                  |
    |:---------------------:|:-----------------------------------------------------------------------:|
    |   最小Gas费   |               {{ networks.moonbeam.min_gas_price }} Gwei*               |
    |   目标区块生产时间   |  {{ networks.moonbeam.block_time }}秒（预计6秒）  |
    |    区块Gas上限    | {{ networks.moonbeam.gas_block }}（预计提升至少4倍） |
    | 交易Gas上限 |  {{ networks.moonbeam.gas_tx }}（预计提升至少4倍）   |

=== "质押配置"
    |             变量              |                                                  值                                                  |
    |:---------------------------------:|:-------------------------------------------------------------------------------------------------------:|
    |     最低委托质押量      |                          {{ networks.moonbeam.staking.min_del_stake }}枚GLMR                             |
    | 收集人可获得的委托人数上限 |                             {{ networks.moonbeam.staking.max_del_per_can }}                             |
    | 委托人可委托的收集人数上限   |                             {{ networks.moonbeam.staking.max_del_per_del }}                             |
    |               轮次               | {{ networks.moonbeam.staking.round_blocks }}区块（{{ networks.moonbeam.staking.round_hours }}小时） |
    |           委托生效期           |   委托在下一轮开始生效 （资金会马上绑定）  |
    |           解绑期           |   {{ networks.moonbeam.delegator_timings.del_bond_less.rounds }}轮次  |

_*阅读更多关于[Token面额](#token-denominations)_

--8<-- 'text/builders/get-started/networks/moonbeam/connect.md'

## 遥测功能 {: #telemetry }

您可以点击[波卡遥测仪表盘](https://telemetry.polkadot.io/#list/0xfe58ea77779b7abda7da4ec526d14db9b1e9cd40a217c34892af80a9b332b76d){target=_blank}来查看及时的Moonbeam遥测资讯。

## Tokens {: #tokens }

Moonbeam的Token被称为Glimmer（GLMR）。想要获取更多资讯，请访问Moonbeam基金会网站[Glimmer Token页面](https://moonbeam.foundation/glimmer-token/){target=_blank}。

### Token面额 {: #token-denominations }

与以太坊相似，Glimmer（GMLR）的最小单位是Wei，需要10^18个Wei以组成一个Glimmer，面额如下所示：

|   Unit    |    Glimmer (GLMR)    |              Wei              |
|:---------:|:--------------------:|:-----------------------------:|
|    Wei    | 0.000000000000000001 |               1               |
|  Kilowei  |  0.000000000000001   |             1,000             |
|  Megawei  |    0.000000000001    |           1,000,000           |
|  Gigawei  |     0.000000001      |         1,000,000,000         |
| Microglmr |       0.000001       |       1,000,000,000,000       |
| Milliglmr |        0.001         |     1,000,000,000,000,000     |
|   GLMR    |          1           |   1,000,000,000,000,000,000   |
| Kiloglmr  |        1,000         | 1,000,000,000,000,000,000,000 |

## 权益证明（POS） {: #proof-of-stake }

通过3个阶段的上线过程，Moonbeam网络将会逐步更新成为一个完全去中心化的权益证明网络。想要了解每个阶段的上线详情内容，请访问[Moonbeam网络上线状态](https://moonbeam.network/networks/moonbeam/launch/){target=_blank}页面。

## 限制 {: #limitations }

部分[预编译](https://docs.klaytn.com/smart-contract/precompiled-contracts){target=_blank}功能目前仍无法使用，其余内建的功能皆可使用。您可在[Solidity Precompiles页](/builders/pallets-precompiles/precompiles/overview/){target=_blank}查看当前可使用的预编译方案。
