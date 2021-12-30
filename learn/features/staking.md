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

## 一般定义 {: #general-definitions }

--8<-- 'text/staking/staking-definitions.md'

## 常用资讯 {: #quick-reference }

=== "Moonriver" 
    - **最低委托数量** —— {{ networks.moonriver.staking.min_del_stake }}枚MOVR
    - **轮次时长** —— {{ networks.moonriver.staking.round_blocks }}区块一个轮次，每个轮次约{{ networks.moonriver.staking.round_hours }}小时
    - **单个候选人最大有效委托人数** —— 在特定轮次内，质押量排名前{{ networks.moonriver.staking.max_del_per_can }}名的委托人才有资格获得质押奖励
    - **单个委托人可委托的最大委托人数** —— 一个委托人可以委托{{ networks.moonriver.staking.max_del_per_del }}个不同的候选人
    - **绑定时长** —— 委托将会在下一个轮次生效（资金可随时提取）
    - **解绑时长** —— {{ networks.moonriver.delegator_timings.del_bond_less.rounds }}轮次
    - **奖励发放延迟** —— {{ networks.moonriver.delegator_timings.rewards_payouts.rounds }}个轮次后奖励会自动发放至余额账户
    - **收集人佣金** —— 固定为年通胀（{{ networks.moonriver.total_annual_inflation }}%）的{{ networks.moonriver.staking.collator_reward_inflation }}%，与委托人奖励池无关
    - **委托人奖励池** —— 年通胀的{{ networks.moonriver.staking.delegator_reward_inflation }}%
    - **委托人奖励** —— 随时变化。总委托人奖励分配给所有的有效委托人，与质押总量相关（[查看更多](/staking/overview/#reward-distribution)）
    - **惩罚** —— 目前暂无任何惩罚，后续可通过治理改变。产生区块的收集人未被中继链最终确定的将不会获得奖励
    - **候选收集人信息** —— 候选人列表：[Moonriver Subscan](https://moonriver.subscan.io/validator)。最新两轮的收集人数据：[Moonbeam Explorer](https://moonbeam-explorer.netlify.app/stats/miners?network=Moonriver)
    - **收集人APY信息** —— [DappLooker Collator Dashboard](http://analytics.dapplooker.com/public/dashboard/7dfc5a6e-da33-4d54-94bf-0dfa5e6843cb) *注意：此数据面板是实验性质的测试版软件，可能无法准确反映收集人的性能。在委托收集人之前，请务必做好研究* 
    - **管理质押相关操作** —— 访问[Moonbeam Network dApp](https://apps.moonbeam.network/moonriver)

=== "Moonbase Alpha" 
    - **最低委托数量** —— {{ networks.moonbase.staking.min_del_stake }}枚DEV
    - **轮次时长** —— {{ networks.moonbase.staking.round_blocks }}区块一个轮次，每个轮次约{{ networks.moonbase.staking.round_hours }}小时
    - **单个候选人最大有效委托人数** —— 在特定轮次内，质押量排名前{{ networks.moonbase.staking.max_del_per_can }}名的委托人才有资格获得质押奖励
    - **单个委托人可委托的最大委托人数** —— 一个委托人可以委托{{ networks.moonbase.staking.max_del_per_del }}个不同的候选人
    - **绑定时长** —— 委托将会在下一个轮次生效（资金可随时提取）
    - **解绑时长** —— {{ networks.moonbase.delegator_timings.del_bond_less.rounds }}轮次
    - **奖励发放延迟** —— {{ networks.moonbase.delegator_timings.rewards_payouts.rounds }}个轮次后奖励会自动发放至余额账户
    - **收集人佣金** —— 固定为年通胀（{{ networks.moonriver.total_annual_inflation }}%）的{{ networks.moonbase.staking.collator_reward_inflation }}%，与委托人奖励池无关
    - **委托人奖励池** —— 年通胀的{{ networks.moonbase.staking.delegator_reward_inflation }}%
    - **委托人奖励** —— 随时变化。总委托人奖励分配给所有的有效委托人，与质押总量相关（[查看更多](/staking/overview/#reward-distribution)）
    - **惩罚** —— 目前暂无任何惩罚，后续可通过治理改变。产生区块的收集人未被中继链最终确定的将不会获得奖励
    - **候选收集人信息** —— 候选人列表：[Moonbase Alpha Subscan](https://moonbase.subscan.io/validator)。最新两轮的收集人数据：[Moonbeam Explorer](https://moonbeam-explorer.netlify.app/stats/miners?network=MoonbaseAlpha)
    - **管理质押相关操作** —— 访问[Moonbeam Network dApp](https://apps.moonbeam.network/moonbase-alpha)

想要获取任何质押参数的当前值，请参考[如何质押您的Token](/tokens/staking/stake/)教程的[检索质押参数](/tokens/staking/stake/#retrieving-staking-parameters)部分。

## 奖励分配 {: #reward-distribution } 

收集人和委托人奖励会在每个轮次的开始计算，奖励资格由[奖励发放延迟](#quick-reference)前的状态来计算。例如在Moonriver网络上，本轮次的奖励是按照{{ networks.moonriver.delegator_timings.rewards_payouts.rounds }}轮次前的状态来计算。

计算出的奖励会以线性方式释放，每个区块释放一次，直到所有奖励都释放完毕。每一个区块会随机选择一个收集人以及其委托人来发送奖励。假设有{{ networks.moonriver.staking.max_candidates }}个收集人, 那么全部收集人以及委托人会在新一轮开始后的第{{ networks.moonriver.staking.max_candidates }}块区块前收到奖励。

5%的年通胀的分配安排如下：

 - 1%用于激励收集人
 - 1.5%用于平行链插槽竞拍债券储备金
 - 其余2.5%将会分配给质押Token的收集人以及委托人

2.5%的分配中，收集人获得与网络质押对应的奖励，剩下部分将按质押分配给委托人。

从数学上来讲，对于收集人而言，每个区块预计获得以及最终获得的奖励分配应如下所示：

![Staking Collator Reward](/images/learn/features/staking/staking-overview-1.png)

其中，`amount_due`为被分配至特定区块的相应通胀，`stake`对应由收集人绑定的Token数量，相对于该收集人的总质押量（包含委托数）。

单个委托人的奖励分配（通过委托收集人在每个区块预计以及最终获得的奖励）应以下所示：

![Staking Delegator Reward](/images/learn/features/staking/staking-overview-2.png)

其中，`amount_due`为被分配至特定区块的相应通胀，`stake`对应由每个委托人在收集人中绑定的Token数量，相对于该收集人的总质押量。

## 开始操作 {: #try-it-out }  

现在您可以开始通过[Moonbeam Network DApp](https://apps.moonbeam.network/moonriver)在Moonriver和Moonbase Alpha上使用质押功能。同时，您可参考[如何质押MOVR Token的教程](https://moonbeam.network/tutorial/stake-movr/)或[视频教程](https://youtu.be/maIfN2QkPpc)。
