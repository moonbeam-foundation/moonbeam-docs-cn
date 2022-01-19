---
title: 质押
description: Moonbeam提供质押功能，使Token持有者能够使用手中的Token委托候选收集人以获得奖励
---

# 如何在Moonbeam上质押

![Staking Moonbeam Banner](/images/learn/features/staking/staking-overview-banner.png)

## 概览 {: #introduction }

Moonbeam采用基于[波卡的权益证明（PoS）模型](https://wiki.polkadot.network/docs/learn-consensus)的区块生产机制，也就是以收集人和验证人的形式。[收集人](https://wiki.polkadot.network/docs/learn-collator)负责通过收集来自用户的交易并为中继链的[验证人](https://wiki.polkadot.network/docs/learn-validator)生产状态转移证明。

候选人根据他们在网络中质押量的筛选后进入活跃收集人（生产区块的节点）集，而这就是需要质押功能的地方。

候选收集人（以及Token持有者，如其参与委托）将会质押Token在网络当中。总质押量前N位的候选人将会获选为可用的交易集生产区块，N为可变参数。部分区块奖励将会分发给生产区块的收集人，而收集人将会进一步根据委托的Token比例分配给参与委托的Token持有者。这样的机制促使网络成员愿意质押Token以提高整体的安全性。

如果希望更多了解管理质押的相关操作，您可以访问[Moonbeam Network DApp](https://apps.moonbeam.network/)并使用页面顶部的网络选项在Moonbeam网络之间轻松切换。要了解如何使用DApp，您可以查看[如何质押MOVR代币](https://moonbeam.network/tutorial/stake-movr/)指南或[视频教程](https://www.youtube.com/watch?v=D2wPnqfoeIg，两者都可以适用于Moonbeam和 Moonbase Alpha测试网。

## 一般定义 {: #general-definitions }

--8<-- 'text/staking/staking-definitions.md'

## 常用资讯 {: #quick-reference }

=== "Moonbeam"
    |             变量             |                                                                         值                                                                         |
    |:--------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          轮次时长          |                        {{ networks.moonbeam.staking.round_blocks }} blocks ({{ networks.moonbeam.staking.round_hours }}小时)                        |
    | 最低委托数量 |                                                  {{ networks.moonbeam.staking.min_del_stake }} GLMR                                                   |
    | 单个候选人最大有效委托人数 |                                                    {{ networks.moonbeam.staking.max_del_per_can }}                                                    |
    |       单个委托人可委托的最大委托人数        |                                                    {{ networks.moonbeam.staking.max_del_per_del }}                                                    |
    |       奖励发放延迟        |    {{ networks.moonbeam.delegator_timings.rewards_payouts.rounds }}轮次 ({{ networks.moonbeam.delegator_timings.rewards_payouts.hours }}小时)    |
    |    增加委托时长    |                                           takes effect in the next round (funds are withdrawn immediately)                                            |
    |    减少委托时长     |      {{ networks.moonbeam.delegator_timings.del_bond_less.rounds }}轮次 ({{ networks.moonbeam.delegator_timings.del_bond_less.hours }}小时)      |
    |     取消委托延迟     | {{ networks.moonbeam.delegator_timings.revoke_delegations.rounds }}轮次 ({{ networks.moonbeam.delegator_timings.revoke_delegations.hours }}小时) |
    |      退出委托人集延迟      |   {{ networks.moonbeam.delegator_timings.leave_delegators.rounds }}轮次 ({{ networks.moonbeam.delegator_timings.leave_delegators.hours }}小时)   |

=== "Moonriver"
    |             变量             |                                                                          值                                                                          |
    |:--------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          轮次时长          |                        {{ networks.moonriver.staking.round_blocks }} blocks ({{ networks.moonriver.staking.round_hours }}小时)                        |
    | 最低委托数量 |                                                   {{ networks.moonriver.staking.min_del_stake }} MOVR                                                   |
    | 单个候选人最大有效委托人数 |                                                    {{ networks.moonriver.staking.max_del_per_can }}                                                     |
    |       单个委托人可委托的最大委托人数        |                                                    {{ networks.moonriver.staking.max_del_per_del }}                                                     |
    |       奖励发放延迟        |    {{ networks.moonriver.delegator_timings.rewards_payouts.rounds }}轮次 ({{ networks.moonriver.delegator_timings.rewards_payouts.hours }}小时)    |
    |     增加委托时长    |                                            takes effect in the next round (funds are withdrawn immediately)                                             |
    |    减少委托时长     |      {{ networks.moonriver.delegator_timings.del_bond_less.rounds }}轮次 ({{ networks.moonriver.delegator_timings.del_bond_less.hours }}小时)      |
    |     取消委托延迟     | {{ networks.moonriver.delegator_timings.revoke_delegations.rounds }}轮次 ({{ networks.moonriver.delegator_timings.revoke_delegations.hours }}小时) |
    |      退出委托人集延迟      |   {{ networks.moonriver.delegator_timings.leave_delegators.rounds }}轮次 ({{ networks.moonriver.delegator_timings.leave_delegators.hours }}小时)   |

=== "Moonbase Alpha"
    |             变量             |                                                                         值                                                                         |
    |:--------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          轮次时长          |                        {{ networks.moonbase.staking.round_blocks }} blocks ({{ networks.moonbase.staking.round_hours }}小时)                        |
    | 最低委托数量 |                                                   {{ networks.moonbase.staking.min_del_stake }} DEV                                                   |
    | 单个候选人最大有效委托人数 |                                                    {{ networks.moonbase.staking.max_del_per_can }}                                                    |
    |       单个委托人可委托的最大委托人数        |                                                    {{ networks.moonbase.staking.max_del_per_del }}                                                    |
    |       奖励发放延迟        |    {{ networks.moonbase.delegator_timings.rewards_payouts.rounds }}轮次 ({{ networks.moonbase.delegator_timings.rewards_payouts.hours }}小时)    |
    |     增加委托时长    |                                           takes effect in the next round (funds are withdrawn immediately)                                            |
    |    减少委托时长     |      {{ networks.moonbase.delegator_timings.del_bond_less.rounds }}轮次 ({{ networks.moonbase.delegator_timings.del_bond_less.hours }}小时)      |
    |     取消委托延迟     | {{ networks.moonbase.delegator_timings.revoke_delegations.rounds }}轮次 ({{ networks.moonbase.delegator_timings.revoke_delegations.hours }}小时) |
    |      退出委托人集延迟      |   {{ networks.moonbase.delegator_timings.leave_delegators.rounds }}轮次 ({{ networks.moonbase.delegator_timings.leave_delegators.hours }}小时)   |


想要获取任何质押参数的当前值，请参考[如何质押您的Token](/tokens/staking/stake/)教程的[检索质押参数](/tokens/staking/stake/#retrieving-staking-parameters)部分。

If you're looking for candidate or collator-specific requirements and information, you can take a look at the [Collators](/node-operators/networks/collator) guide.

## 选择收集人节点参考资料 {: #resources-for-selecting-a-collator}

以下是一些可以帮助您选择收集人节点的参考资料：

=== "Moonbeam"
    |      变量       |                                                  值                                                  |
    |:-------------------:|:-------------------------------------------------------------------------------------------------------:|
    | 候选收集人列单  |                [Moonbeam Subscan](https://moonbeam.subscan.io/validator){target=_blank}                 |
    | 收集人统计数据 | [Moonbeam Explorer](https://moonbeam-explorer.netlify.app/stats/miners?network=Moonbeam){target=_blank} |

=== "Moonriver"
    |      变量       |                                                                 值                                                                 |
    |:-------------------:|:-------------------------------------------------------------------------------------------------------------------------------------:|
    | 候选收集人列单  |                              [Moonriver Subscan](https://moonriver.subscan.io/validator){target=_blank}                               |
    | 收集人统计数据 |               [Moonbeam Explorer](https://moonbeam-explorer.netlify.app/stats/miners?network=Moonriver){target=_blank}                |
    |  收集人APY数据  | [DappLooker收集人仪表板](http://analytics.dapplooker.com/public/dashboard/7dfc5a6e-da33-4d54-94bf-0dfa5e6843cb){target=_blank} |

=== "Moonbase Alpha"
    |      变量       |                                                    值                                                     |
    |:-------------------:|:------------------------------------------------------------------------------------------------------------:|
    | 候选收集人列单  |                [Moonbase Alpha Subscan](https://moonbase.subscan.io/validator){target=_blank}                |
    | 收集人统计数据 | [Moonbeam Explorer](https://moonbeam-explorer.netlify.app/stats/miners?network=MoonbaseAlpha){target=_blank} |


!!! 注意事项
    Moonriver的DappLooker收集人仪表板是实验性测试版软件，可能无法准确反映收集人节点的性能。在委托给收集人之前，请务必自己进行研究。


## 奖励分配 {: #reward-distribution } 

收集人和委托人奖励会在每个轮次的开始计算，奖励资格由[奖励发放延迟](#quick-reference)前的状态来计算。例如在Moonriver网络上，本轮次的奖励是按照{{ networks.moonriver.delegator_timings.rewards_payouts.rounds }}轮次前的状态来计算。

计算出的奖励会以线性方式释放，每个区块释放一次，直到所有奖励都释放完毕。每一个区块会随机选择一个收集人以及其委托人来发送奖励。假设有{{ networks.moonriver.staking.max_candidates }}个收集人, 那么全部收集人以及委托人会在新一轮开始后的第{{ networks.moonriver.staking.max_candidates }}块区块前收到奖励。

### 年度通货膨胀 {: #annual-inflation}

年通胀的分配安排如下：

=== "Moonbeam"
    |                 变量                  |                                         值                                        |
    |:-----------------------------------------:|:-------------------------------------------------------------------------------------:|
    |             年通胀率              |               {{ networks.moonbeam.inflation.total_annual_inflation }}%               |
    | 收集人和委托人激励池 | 年通胀之{{ networks.moonbeam.inflation.delegator_reward_inflation }}% |
    |            收集人激励            | 年通胀之{{ networks.moonbeam.inflation.collator_reward_inflation }}% |
    |          平行链绑定储蓄           |  年通胀之{{ networks.moonbeam.inflation.parachain_bond_inflation }}%  |

=== "Moonriver"
    |                 变量                  |                                         值                                         |
    |:-----------------------------------------:|:--------------------------------------------------------------------------------------:|
    |             年通胀率              |               {{ networks.moonriver.inflation.total_annual_inflation }}%               |
    | 收集人和委托人激励池 | 年通胀之{{ networks.moonriver.inflation.delegator_reward_inflation }}% |
    |            收集人激励           | 年通胀之{{ networks.moonriver.inflation.collator_reward_inflation }}%  |
    |          平行链绑定储蓄           |  年通胀之{{ networks.moonriver.inflation.parachain_bond_inflation }}%  |

=== "Moonbase Alpha"
    |                 变量                  |                                         值                                         |
    |:-----------------------------------------:|:-------------------------------------------------------------------------------------:|
    |             年通胀率              |               {{ networks.moonbase.inflation.total_annual_inflation }}%               |
    | 收集人和委托人激励池 | 年通胀之{{ networks.moonbase.inflation.delegator_reward_inflation }}% |
    |            收集人激励            | 年通胀之{{ networks.moonbase.inflation.collator_reward_inflation }}%  |
    |          平行链绑定储蓄           |  年通胀之{{ networks.moonbase.inflation.parachain_bond_inflation }}%  |

从激励池中，收集人获得与他们绑定相对应的奖励，其余的按质押比例分配给委托人。

### Calculating Rewards {: #calculating-rewards }

从数学上来讲，对于收集人而言，每个区块预计获得以及最终获得的奖励分配应如下所示：

![Staking Collator Reward](/images/learn/features/staking/staking-overview-1.png)

其中，`amount_due`为被分配至特定区块的相应通胀，`stake`对应由收集人绑定的Token数量，相对于该收集人的总质押量（包含委托数）。

单个委托人的奖励分配（通过委托收集人在每个区块预计以及最终获得的奖励）应以下所示：

![Staking Delegator Reward](/images/learn/features/staking/staking-overview-2.png)

其中，`amount_due`为被分配至特定区块的相应通胀，`stake`对应由每个委托人在收集人中绑定的Token数量，相对于该收集人的总质押量。