---
title: Moonbeam测试网概览
description: Moonbeam测试网（Moonbase Alpha当前配置的概述，以及如何使用Solidity开始在其上进行开发。
---

# Moonbeam测试网（Moonbase Alpha）

更新于2021年5月26日

!!! 注意事项 
    随着[Moonbase Alpha v8](https://github.com/PureStake/moonbeam/releases/tag/v0.8.0){target=_blank}版本的发布，最低Gas价格被设定为1 GDEV（类似于以太坊上的GWei）。如果您之前的部署时所设置的Gas价格为`0`的话，这对您来说可能是突破性的变化。

## 目标 {: #goal } 

首个Moonbeam测试网（又称Moonbase Alpha）旨在向开发者们提供一个在共享环境下，能够在Moonbeam上进行开发或部署的平台。由于Moonbeam将作为平行链部署在Kusama和Polkadot上，因此也希望测试网能够直接反映各测试环节的配置。为此，Moonbase Alpha测试网则开发为一个基于平行链的配置，而非独立的Substrate设置。

如果您有任何意见或建议，或需要任何技术支持，欢迎加入[Moonbase AlphaNet的专用Discord频道](https://discord.gg/PfpUATX){target=_blank}。

## 初始配置 {: #initial-configuration } 

Moonbase Alpha具有以下配置：

 - 以平行链方式接入中继链运行
 - 收集人有效集为{{ networks.moonbase.staking.max_candidates }}节点，包括一些由PureStake运行的收集人节点
 - 中继链上会有由PureStake运营的验证者节点来决定中继链上的区块。其中一个会被选来最终确定每一个由Moonbeam收集者提交的区块。此设定为将来扩展为两个平行链配置提供了空间。
 - 拥有提供商提供的[API端点](/builders/get-started/endpoints/){target=_blank}以连接到网络。项目也可以运行和访问[自己的私有节点](/node-operators/networks/run-a-node/){target=_blank}。

![TestNet Diagram](/images/learn/platform/networks/moonbase-diagram.png)

需要注意的一些重要变量和配置包括：

=== "通用"
    |       变量        |                                  值                                  |
    |:---------------------:|:-----------------------------------------------------------------------:|
    |   最低Gas价格   |               {{ networks.moonbase.min_gas_price }} Gwei                |
    |   目标区块时间   |  {{ networks.moonbase.block_time }} 秒 (预计为6秒)  |
    |    区块Gas上限    | {{ networks.moonbase.gas_block }} (预计提升至少4倍) |
    | 交易Gas上限 |  {{ networks.moonbase.gas_tx }} (预计提升至少4倍)   |

=== "治理"
    |         变量         |                                                            值                                                             |
    |:------------------------:|:----------------------------------------------------------------------------------------------------------------------------:|
    |      投票期       |      {{ networks.moonbase.democracy.vote_period.blocks}} blocks ({{networks.moonbase.democracy.vote_period.days}}天)      |
    | 快速通道投票期 | {{ networks.moonbase.democracy.fast_vote_period.blocks}} blocks ({{networks.moonbase.democracy.fast_vote_period.hours}}小时) |
    |     执行期     |     {{ networks.moonbase.democracy.enact_period.blocks}} blocks ({{networks.moonbase.democracy.enact_period.days}}天      |
    |     冷静期      |      {{ networks.moonbase.democracy.cool_period.blocks}} blocks ({{networks.moonbase.democracy.cool_period.days}}天)      |
    |     最低存入量      |                                      {{ networks.moonbase.democracy.min_deposit }} DEV                                       |
    |      最高投票数       |                                         {{ networks.moonbase.democracy.max_votes }}                                          |
    |    最多提案量     |                                       {{ networks.moonbase.democracy.max_proposals }}                                        |

=== "质押"
    |             变量              |                                                  值                                                  |
    |:---------------------------------:|:-------------------------------------------------------------------------------------------------------:|
    |     最低委托数量      |                            {{ networks.moonbase.staking.min_del_stake }} DEV                            |
    | 单个候选人最大有效委托人数 |                             {{ networks.moonbase.staking.max_del_per_can }}                             |
    |  单个委托人可委托的最大委托人数  |                             {{ networks.moonbase.staking.max_del_per_del }}                             |
    |               轮次               | {{ networks.moonbase.staking.round_blocks }}区块 ({{ networks.moonbase.staking.round_hours }}小时) |
    |           增加委托时长           |               委托将会在下一个轮次生效（资金可随时提取）               |
    |          减少委托时长          |                  {{ networks.moonbase.delegator_timings.del_bond_less.rounds }}轮次                 |

--8<-- 'text/testnet/connect.md'

## Alphanet中继链 {: #relay-chain }

Alphanet中继链连接到Moonbase Alpha并且是基于[Westend](https://polkadot.network/blog/westend-introducing-a-new-testnet-for-polkadot-and-kusama/){target=_blank}但专属于Moonbeam生态系统的。它类似于您与Kusama或Polkadot的交互方式。 Alphanet中继链的原生代币是UNIT代币，仅用于测试目的，没有实际价值。

## 遥测功能 {: #telemetry } 

您可以点击[波卡遥测仪表盘](https://telemetry.polkadot.io/#list/0x91bc6e169807aaa54802737e1c504b2577d4fafedd5a02c10293b1cd60e39527){target=_blank}来查看及时的Moonbase Alpha遥测资讯。

## 代币 {: #tokens } 

Moonbase Alpha上名为DEV的代币将按需求发行。 **DEV 代币没有价值，可以自由获取**。

您可以输入您的地址以自动从[Moonbase Alpha Faucet](https://faucet.moonbeam.network/){target=_blank}网站请求DEV测试代币。水龙头每24小时最多分配{{ networks.moonbase.website_faucet_amount }}枚DEV。

对于超过我们的Discord机器人允许的Token请求，请通过Moonbeam的[Discord频道](https://discord.gg/PfpUATX){target=_blank}直接联系版主。我们很高兴提供测试您的应用程序所需的Token。

## 权益证明 {: #proof-of-stake } 

Moonbase Alpha是一个完全去中心化的权益证明网络。用户可以选择委托收集人节点来生产区块和获得质押奖励。请注意，Moonbase Alpha的DEV代币是没有任何经济价值的。候选人有效集的上限将会由治理决定。有效集的集元组成将由质押（包括委托）排名决定。

## 限制 {: #limitations } 

因为这是Moonbeam的第一个测试网，所以仍然有一些限制。

部分[预编码](https://docs.klaytn.com/smart-contract/precompiled-contracts){target=_blank}尚未加入至此版本内，您可以在[标准合约页](/builders/build/canonical-contracts/precompiles/){target=_blank}查询目前所支持的预编码。除此之外，您还是能够使用所有的内建功能。

随着Moonbase Alpha v6的版本发布，每一个区块的gas使用上限被设置为{{ networks.moonbase.gas_block }}，每次交易的gas使用上限被设置为{{ networks.moonbase.gas_tx }}。
