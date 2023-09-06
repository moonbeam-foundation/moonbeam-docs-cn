---
title: 财政库
description: 作为波卡（Polkadot）平行链，Moonbeam将使用由财政库理事会成员控制的链上财政库，允许利益相关者提交提案以进一步发展网络。
---

# Moonbeam财政库

## 概览 {: #introduction } 

财政库（Treasury）是用于链上资金的管理。每个基于Moonbeam的网络都设立了一个社区财政库，用于支持网络计划以促进未来网络的发展。网络交易费用的一部分将被存储于对应网络的财政库，并由理事会（Council）管理。

截至2022年10月19日，社区提交的临时财政计划公投已获得社区通过。这个为期6个月的计划建立了一个单独的社区财政理事会来管理财政库资金、财政库支出预算，以及收集社区对未来可能的财政提案的反馈所需的讨论时间。

## 一般定义 {: #general-definitions } 

关于财政库的一些专业术语如下：

- **财政库理事会** —— 一群社区任命的个人，他们控制如何使用社区批准的预算来使用财政库资金
- **提案** —— 由利益相关者提出，并由财政库理事会批准的促进网络的计划或建议
- **提案保证金** —— 一笔与提案总支出金额的一定比例等值的存款，如果不到最低提案保证金，存款将等于最低提案保证金
- **最低提案保证金** —— 提案保证金的最低金额。这是提案保证金的下限
- **最高提案保证金** —— 提案保证金的最高金额（上限）。 **提案保证金目前在所有基于Moonbeam的网络中均无最高上限**
- **议案投票时间** - 财政部委员会成员对议案进行投票的最长时间（以区块为单位）。如果有足够的票数来确定结果，议案可能会在区块高度到达之前结束
- **支出期** —— 以区块为单位的天数，在此期间，财政库为各类提案提供资金，但不超过最大值
- **最多批准提案数** —— 最多可以在待支出列队中的提案数量

目前，财政库的价值如下：

=== "Moonbeam"
    |            变量             |  |                                                        值                                                         |
    |:-------------------------------:|::|:--------------------------------------------------------------------------------------------------------------------:|
    | 当前财政库理事会成员 || {{ networks.moonbeam.treasury.current_council_members }} 人|
    |          提案保证金          |  |        提案支出的{{ networks.moonbeam.treasury.proposal_bond }}%或最低提案保证金                 |
    |      最低提案保证金      |  |                               {{ networks.moonbeam.treasury.proposal_bond_min }} GLMR                                |
    |      最高提案保证金      |  |                               {{ networks.moonbeam.treasury.proposal_bond_max }}                                 |    
    |         议案投票时间        || {{ networks.moonbeam.treasury.motion_duration_blocks }} 区块 ({{ networks.moonbeam.treasury.motion_duration_days }} 天) |
    |          支出期           |  | {{ networks.moonbeam.treasury.spend_period_blocks }} 区块 ({{ networks.moonbeam.treasury.spend_period_days}} 天) |
    |   最高批准提案    |  |                               {{ networks.moonbeam.treasury.max_approved_proposals }}                                |
    | 分配给财政库的交易费的目标% |  |                                  {{ networks.moonbeam.treasury.tx_fees_allocated }}                                  |

=== "Moonriver"
    |      变量      |  |                                                         值                                                         |
    |:--------------:|::|:------------------------------------------------------------------------------------------------------------------:|
    | 当前财政库理事会成员 || {{ networks.moonriver.treasury.current_council_members }} 人|
    |   提案保证金   |  |     提案支出的{{ networks.moonriver.treasury.proposal_bond }}%或最低提案保证     |
    | 最低提案保证金 |  |                              {{ networks.moonriver.treasury.proposal_bond_min }} MOVR                              |
    |      最高提案保证金      |  |                               {{ networks.moonriver.treasury.proposal_bond_max }}                                 |        
    |         议案投票时间        |  | {{ networks.moonriver.treasury.motion_duration_blocks }} 区块 ({{ networks.moonriver.treasury.motion_duration_days }} 天) |
    |     支出期     |  | {{ networks.moonriver.treasury.spend_period_blocks }} 区块 ({{ networks.moonriver.treasury.spend_period_days}} 天) |
    |  最高批准提案  |  |                              {{ networks.moonriver.treasury.max_approved_proposals }}                              |
    | 分配给财政库的交易费的目标%  |  |                                {{ networks.moonriver.treasury.tx_fees_allocated }}                                 |

=== "Moonbase Alpha"
    |      变量      |  |                                                        值                                                        |
    |:--------------:|::|:----------------------------------------------------------------------------------------------------------------:|
    | 当前财政库理事会成员 | |{{ networks.moonbase.treasury.current_council_members }} 人|
    |   提案保证金   |  |    提案支出的{{ networks.moonbase.treasury.proposal_bond }}%或最低提案保证     |
    | 最低提案保证金 |  |                              {{ networks.moonbase.treasury.proposal_bond_min }} DEV                              |
    |      最高提案保证金      |  |                               {{ networks.moonbase.treasury.proposal_bond_max }}                                 |        
    |         议案投票时间        |  | {{ networks.moonbase.treasury.motion_duration_blocks }} 区块 ({{ networks.moonbase.treasury.motion_duration_days }} 天) |
    |     支出期     |  | {{ networks.moonbase.treasury.spend_period_blocks }} 区块 ({{ networks.moonbase.treasury.spend_period_days}} 天) |
    |  最高批准提案  |  |                             {{ networks.moonbase.treasury.max_approved_proposals }}                              |
    | 分配给财政库的交易费的目标%  |  |                                {{ networks.moonbase.treasury.tx_fees_allocated }}                                |

## 社区财政库  {: #community-treasury } 

每个区块交易费用的一部分将作为资金存入财政库。剩余部分将被销毁（详情见上表）。财政库允许利益相关者提交资金支出提案，以供财政库理事会审查和投票。这些支出提案建议包括促进网络或提高网络参与度的举措。一些网络计划应包括集成、合作、社区活动、网络扩展等。在提交提案之前，提案的作者可以将他们的提案想法提交到指定的财政库[讨论论坛](https://forum.moonbeam.foundation/){target=_blank}，以获得社区的反馈，时间为至少五天。

为了阻止垃圾提案，提案必须与保证金一起提交，也称为提案保证金。提案保证金是提案人要求金额的一定百分比（查看上表），有最低金额，但没有上限（相比有上限的Polkadot和Kusama）。治理提案可以改变这些值。因此，任何拥有足够代币来支付保证金的用户都可以提交提案。如果提议者没有足够的资金来支付保证金，则交易会因资金不足而失败，但仍会扣除交易费用。

提案提交后，财政库理事会成员可以动议对该提案进行表决。然后，财政库理事会在动议期间对其进行投票。接受财政部提案的门槛至少是安理会五分之三的成员。另一方面，拒绝提案的门槛至少是财政库理事会的二分之一。如果任何财政库理事会成员在动议期间未能投票，则持有“默认投票”位置的财政库理事会成员的投票将被视为默认。 “默认投票”位置反映了[Polkadot的“主要成员”](https://wiki.polkadot.network/docs/learn-governance#prime-members){target=_blank}的位置。请注意，提交国库提案后，用户将无法撤销该提案。

如果提案得到财政库理事会的批准，该提案将进入队列以进入支出期。如果支出提案队列已满，则提案提交将失败，类似于提案者的余额太低时的情况。如果提案被拒绝，存款将被转移到平行链资金账户。

一旦提案进入支出期，资金将分配给受益人，原始保证金将退还给提案人。 如果财政部的资金用完，剩余的批准提案将一直保存到下一个支出期，届时财政部再次拥有足够的资金。

财政库提案流程如下图所示：

![Treasury Proposal Happy Path Diagram](/images/learn/features/treasury/treasury-proposal-roadmap.png)