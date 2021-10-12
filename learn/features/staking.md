---
title: 质押
description: Moonbeam为用户提供质押功能，用于提名收集人并获取奖励
---

# 在Moonbeam网络质押

![Staking Moonbeam Banner](/images/learn/features/staking/staking-overview-banner.png)

## 概览 {: #introduction }

Moonbeam使用基于[波卡PoS模型](https://wiki.polkadot.network/docs/learn-consensus)的区块生产机制，具有收集人以及验证人的角色。[收集人](https://wiki.polkadot.network/docs/learn-collator)通过收集用户的交易数据和为中继链的[验证人](https://wiki.polkadot.network/docs/learn-validator)生产状态转移证明来维护平行链（在本教程中为Moonbeam）。

收集人集（负责生产区块的节点）根据网络中其质押的Token数量进行筛选，这就是为什么会出现质押。

收集人（或是Token持有者，若已进行提名动作）在网络中具有质押的Token。获得Token质押数量的前N名收集人将会获选负责生产一定数量的有效交易，其中N为一个可配置的参数。部分区块奖励将会分配至生产区块的收集人，收集人则会根据获得的质押比例将生产奖励分发给提名人。根据这样的模式，网络成员将能通过质押Token获得激励并提高整体网络的安全性。

## 一般定义 {: #general-definitions }

--8<-- 'text/staking/staking-definitions.md'

## 快速参考 {: #quick-reference }

=== "Moonriver" 

    - **最低提名质押量** — {{ networks.moonriver.staking.min_nom_stake }}枚MOVR
    - **轮次时长** — {{ networks.moonriver.staking.round_blocks }}个区块一个轮次，每个轮次约{{ networks.moonriver.staking.round_hours }}小时
    - **单个收集人最大有效提名人数量** — 特定轮次，质押量排名前{{ networks.moonriver.staking.max_nom_per_col }}名的提名人才有资格获得质押奖励
    - **单个提名人可提名的最大收集人数** — 一个提名人可以提名{{ networks.moonriver.staking.max_col_per_nom }}个不同的收集人
    - **绑定时长** — 提名将在下一个轮次生效（资金可随时提取）
    - **解绑时长** — {{ networks.moonriver.staking.bond_lock }}个轮次
    - **奖励发放** — {{ networks.moonriver.collator_timings.rewards_payouts.rounds }}个轮次后奖励会自动发放至余额账户
    - **收集人佣金** — 固定为年通胀率（{{ networks.moonriver.total_annual_inflation }}%）的{{ networks.moonriver.staking.collator_reward_inflation }}%，与提名人奖励池无关
    - **提名人奖励池** — 年通胀的{{ networks.moonriver.staking.nominator_reward_inflation }}%
    - **提名奖励** — 会随时变化。提名奖励是分配给所有有效提名人的提名人奖励总和，与质押总量相关（[查看更多](/staking/overview/#reward-distribution)）
    - **惩罚** — 目前暂无任何惩罚，后续可通过治理改变。产生区块的收集人未被中继链最终确定的将不会获得奖励
    - **收集人信息** — 收集人列表：[Moonriver Subscan](https://moonriver.subscan.io/validator)。最新两轮的收集人数据：[Moonbeam Explorer](https://moonbeam-explorer.netlify.app/stats/miners?network=Moonriver)
    - **管理质押相关操作** — 访问[Moonbeam Network dApp](https://apps.moonbeam.network/moonriver)

=== "Moonbase Alpha" 

    - **最低提名质押量** — {{ networks.moonbase.staking.min_nom_stake }}枚DEV
    - **轮次时长** — {{ networks.moonbase.staking.round_blocks }}个区块一个轮次，每个轮次约{{ networks.moonbase.staking.round_hours }}小时
    - **单个收集人最大有效提名人数量** — 特定轮次，质押量排名前{{ networks.moonbase.staking.max_nom_per_col }}名的提名人才有资格获得质押奖励
    - **单个提名人可提名的最大收集人数** — 一个提名人可以提名{{ networks.moonbase.staking.max_col_per_nom }}个不同的收集人
    - **绑定时长** — 提名将在下一个轮次生效（资金可随时提取）
    - **解绑时长** — {{ networks.moonbase.staking.bond_lock }}个轮次
    - **奖励发放** — {{ networks.moonbase.collator_timings.rewards_payouts.rounds }}个轮次后奖励会自动发放至余额账户
    - **收集人佣金** — 固定为年通胀（{{ networks.moonriver.total_annual_inflation }}%）的{{ networks.moonbase.staking.collator_reward_inflation }}%，与提名人奖励池无关
    - **提名人奖励池** — 年通胀的{{ networks.moonbase.staking.nominator_reward_inflation }}%
    - **提名奖励** — 会随时变化。提名奖励是分配给所有有效提名人的提名人奖励总和，与质押总量相关（[查看更多](/staking/overview/#reward-distribution)）
    - **惩罚** — 目前暂无任何惩罚，后续可通过治理改变。产生区块的收集人未被中继链最终确定的将不会获得奖励
    - **收集人信息** — 收集人列表：[Moonbase Alpha Subscan](https://moonbase.subscan.io/validator). 最新两轮的收集人数据：[Moonbeam Explorer](https://moonbeam-explorer.netlify.app/stats/miners?network=MoonbaseAlpha)
    - **管理质押相关操作** — 访问[Moonbeam Network dApp](https://apps.moonbeam.network/moonbase-alpha)

想要获取任何质押参数的当前值，请查看[如何质押您的Token]( /tokens/staking/stake/)教程中的[检索质押参数](/tokens/staking/stake/#retrieving-staking-parameters)部分。

## 奖励分配 {: #reward-distribution } 

收集人在每轮（{{ networks.moonbase.staking.round_blocks }}个区块）结束时收到前{{ networks.moonbase.staking.bond_lock }}轮的奖励。

5%的年通胀率的分配安排如下：

 - 1%用于激励收集人
 - 1.5%用于平行链插槽竞拍债券储备金
 - 剩下的2.5%将用于奖励质押Token的用户

这2.5%中，收集人获得与网络质押对应的奖励，剩下部分将按质押分配给提名人。

从数学上来讲，对于收集人来说，提议和最终确定每个区块的奖励分配应如下所示：

![Staking Collator Reward](/images/learn/features/staking/staking-overview-1.png)

其中，`amount_due`指在每个特定区块分配的相应通胀，`stake`对应由收集人绑定的Token数量，相对于该收集人的总质押量（统计提名数）。

对于每个提名人来说，奖励分配（由提名收集人提议和最终确定每个区块）应如下所示：

![Staking Nominator Reward](/images/learn/features/staking/staking-overview-2.png)

其中，`amount_due`指在每个特定区块分配的相应通胀，`stake`对应由每个提名人在收集人中绑定的Token数量，相对于该收集人的总质押量。

## 开始操作 {: #try-it-out } 

现在您可以开始通过[Moonbeam Network dApp](https://apps.moonbeam.network/moonriver)在Moonriver和Moonbase Alpha上使用质押功能。您可参考[此教程](https://moonbeam.network/tutorial/stake-movr/)或观看[此视频教程](https://youtu.be/maIfN2QkPpc)学习如何质押。
