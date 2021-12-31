---
title: Moonbeam
description: Moonbeam在波卡上部署的当前配置以及如何使用Solidity开始在Moonbeam上部署。
---

# Moonbeam

_更新至2021年12月13日_

## 目标 {: #goal }

Moonbeam将于2021年12月17日作为平行链部署至波卡（Polkadot）。Moonbeam是波卡（Polkadot）生态系统中最兼容以太坊的智能合约平行链，允许开发者以最小程度的代码更改（甚至无需更改）将其项目部署至Moonbeam，使他们可以访问波卡（Polkadot）生态系统及其所有资产。

## 初始配置 {: #initial-configurations }  

Moonbeam完全启动后将拥有以下配置：

- 以平行链的形式运行并连接至波卡（Polkadot）中继链
- 拥有{{ networks.moonbeam.staking.max_candidates }}位收集人的活跃收集人集
- 拥有提供连接至网络的[API端点](/builders/get-started/endpoints/)的基础设施提供商。项目也可以[运行自己的节点](/node-operators/networks/run-a-node/)以访问其私有端点。

![Moonbeam Diagram](/images/learn/platform/networks/moonbeam-diagram.png)

需要注意的重要变量/配置如下所示（仍会发生变化）：

=== "一般配置"
    |       变量        |                                  值                                  |
    |:---------------------:|:-----------------------------------------------------------------------:|
    |   最小Gas费   |               {{ networks.moonbeam.min_gas_price }} Gwei*               |
    |   目标区块生产时间   |  {{ networks.moonbeam.block_time }}秒（预计6秒）  |
    |    区块Gas上限    | {{ networks.moonbeam.gas_block }}（预计提升至少4倍） |
    | 交易Gas上限 |  {{ networks.moonbeam.gas_tx }}（预计提升至少4倍）   |

=== "治理配置"
    |         变量         |                                                            值                                                             |
    |:------------------------:|:----------------------------------------------------------------------------------------------------------------------------:|
    |      投票期       |      {{ networks.moonbeam.democracy.vote_period.blocks}}区块（{{networks.moonbeam.democracy.vote_period.days}}天）      |
    | 快速投票期 | {{ networks.moonbeam.democracy.fast_vote_period.blocks}}区块（{{networks.moonbeam.democracy.fast_vote_period.days}}天） |
    |     颁布期     |     {{ networks.moonbeam.democracy.enact_period.blocks}}区块（{{networks.moonbeam.democracy.enact_period.days}}天）     |
    |     冷却期      |      {{ networks.moonbeam.democracy.cool_period.blocks}}区块（{{networks.moonbeam.democracy.cool_period.days}}天）      |
    |     最低充值金额      |                                      {{ networks.moonbeam.democracy.min_deposit }}枚GLMR                                      |
    |      最高投票数       |                                         {{ networks.moonbeam.democracy.max_votes }}                                          |
    |    最高提案数     |                                       {{ networks.moonbeam.democracy.max_proposals }}                                        |

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

--8<-- 'text/moonbeam/connect.md'

## Tokens {: #tokens } 

Moonbeam的Token被称为Glimmer（GLMR）。想要获取更多资讯，请访问Moonbeam基金会网站[Glimmer Token页面](https://moonbeam.foundation/glimmer-token/)。

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

通过3个阶段的上线过程，Moonbeam网络将会逐步更新成为一个完全去中心化的权益证明网络。想要了解每个阶段的上线详情内容，请访问[Moonbeam网络上线状态](https://moonbeam.network/networks/moonbeam/launch/)页面。

## 限制 {: #limitations }

部分[预编译](https://docs.klaytn.com/smart-contract/precompiled-contracts)功能目前仍无法使用，其余内建的功能皆可使用。您可在[此页面](/builders/tools/precompiles/)查看当前可使用的预编译方案。
