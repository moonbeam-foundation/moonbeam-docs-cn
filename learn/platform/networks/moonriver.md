---
title: Moonriver
description: Moonriver（Moonbeam在Kusama上部署的平行链）的当前配置情况，以及如何使用Solidity进行开发。
---

# Moonriver

_更新至2021年12月13日_

## 目标 {: #goal } 

2021年6月，Moonriver首度作为平行链在Kusama网络启动。Moonriver是Moonbeam的姐妹网络，提供一个据有真实经济条件的代码测试环境。开发者现在可以直接访问连接至Kusama的试验性网络进行探索与开发。

为了尽可能多地收集用户反馈并快速提供问题解决方案，我们建立一个[专为Moonriver服务的Discord社群](https://discord.gg/5TaUvbRvgM)。

## 初始配置 {: #initial-configurations } 

目前，Moonriver具有以下配置：

- 以平行链的形式运行并连接至Kusama中继链
- 拥有一个由PureStake代表Moonbeam基金会运营并含有{{ networks.moonriver.staking.max_candidates }}位收集人的有效集。
- 具有服务商提供的[API端点](/builders/get-started/endpoints/)来连接网络。项目也可以自己[运行全节点](/node-operators/networks/run-a-node/)来获得私有端点。

![Moonriver Diagram](/images/learn/platform/networks/moonriver-diagram.png)

需要注意的重要变量：

### 一般配置

|       变量       |                         数值                          |
| :--------------: | :---------------------------------------------------: |
|    最小Gas费     |     {{ networks.moonriver.min_gas_price }} Gwei*      |
| 目标区块生产时间 |   {{ networks.moonriver.block_time }}秒（预计6秒）    |
|   区块Gas上限    | {{ networks.moonriver.gas_block }}（预计提升至少4倍） |
|  交易Gas费上限   |  {{ networks.moonriver.gas_tx }}（预计提升至少4倍）   |
|     RPC端点      |           {{ networks.moonriver.rpc_url }}            |
|     WSS 端点     |           {{ networks.moonriver.wss_url }}            |

### 治理配置

|    变量    |                             数值                             |
| :--------: | :----------------------------------------------------------: |
|   投票期   | {{ networks.moonriver.democracy.vote_period.blocks}}区块（{{ networks.moonriver.democracy.vote_period.days}}天） |
| 快速投票期 | {{ networks.moonriver.democracy.fast_vote_period.blocks}}区块（{{ networks.moonriver.democracy.fast_vote_period.days}}天） |
|   颁布期   | {{ networks.moonriver.democracy.enact_period.blocks}}区块（{{ networks.moonriver.democracy.enact_period.days}}天） |
|   冷却期   | {{ networks.moonriver.democracy.cool_period.blocks}}区块（{{ networks.moonriver.democracy.cool_period.days}}天） |
| 最低保证金 |     {{ networks.moonriver.democracy.min_deposit }} MOVR      |
| 最高投票数 |         {{ networks.moonriver.democracy.max_votes }}         |
| 最高提案数 |       {{ networks.moonriver.democracy.max_proposals }}       |

### 质押配置

|            变量            |                             数值                             |
| :------------------------: | :----------------------------------------------------------: |
|      最低提名质押数量      |    {{ networks.moonriver.staking.min_del_stake }}枚Token     |
|        最低提名数量        |    {{ networks.moonriver.staking.min_nom_amount}}枚token     |
| 收集人可获得最高的提名人数 |       {{ networks.moonriver.staking.max_del_per_can }}       |
| 提名人可提名的最高收集人数 |       {{ networks.moonriver.staking.max_del_per_del }}       |
|            轮次            | {{ networks.moonriver.staking.round_blocks }}区块（{{ networks.moonriver.staking.round_hours }}小时） |
|           解绑期           |   {{ networks.moonbeam.delegator_timings.del_bond_less.rounds }}轮次        |

_*更多关于[代币面额](#token-denominations)_

--8<-- 'text/moonriver/connect.md'

## Telemetry {: #telemetry } 

你可以访问[此页面](https://telemetry.polkadot.io/#list/Moonriver)查看当前Moonriver telemetry资讯。

## Tokens {: #tokens } 

Moonriver的Token被称为Moonriver（MOVR）。如果您想获得更多资讯，请查看Moonbeam基金会官网[Moonriver Token页面](https://moonbeam.foundation/moonriver-token/)。

### Token面额  {: #token-denominations } 

Moonriver的最小单位是Sediment（Sed），需要10^18个Sediment以组成一个Moonriver，面额如下所示：

|      单位      |   Moonriver (MOVR)   |        Sediment (Sed)         |
| :------------: | :------------------: | :---------------------------: |
|      Wei       | 0.000000000000000001 |               1               |
|    Kilowei     |  0.000000000000001   |             1,000             |
|    Megawei     |    0.000000000001    |           1,000,000           |
|    Gigawei     |     0.000000001      |         1,000,000,000         |
| Micromoonriver |       0.000001       |       1,000,000,000,000       |
| Millimoonriver |        0.001         |     1,000,000,000,000,000     |
|   Moonriver    |          1           |   1,000,000,000,000,000,000   |
| Kilomoonriver  |        1,000         | 1,000,000,000,000,000,000,000 |

## 权益证明(POS) {: #proof-of-stake } 

Moonriver是一个完全去中心化的权益证明网络，用户可以委托收集人节点来生产区块和获得质押奖励。它采用[Nimbus共识](/learn/features/consensus/)框架为平行链共识算法。候选人有效集的上限将会由治理决定。有效集的集元组成将由质押（包括委托）排名决定。

## 限制 {: #limitations } 

部分[预编译](https://docs.klaytn.com/smart-contract/precompiled-contracts)功能目前仍无法使用，其余内建的功能皆可使用。您可在[此页面](/integrations/precompiles/)查看当前可使用的预编译方案。

