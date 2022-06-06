---
title: 财政库
description: 作为波卡（Polkadot）平行链，Moonbeam将使用由理事会成员控制的链上财政库，允许利益相关者提交提案以进一步发展网络。
---

# Moonbeam财政库

![Treasury Moonbeam Banner](/images/learn/features/treasury/treasury-overview-banner.png)

## 概览 {: #introduction } 

财政库是用于链上资金的管理。Moonbeam将设立一个社区财政库，用于支持网络计划以促进未来网络的发展。网络交易费用的一部分将被存储于财政库，并由理事会管理。

每个基于Moonbeam的网络都将拥有自己的财政库。换句话说，Moonbase Alpha测试网、Westend的Moonshadow网络、Kusama上的的Moonriver网络和波卡（Polkadot）上的Moonbeam都将拥有各自的财政库。

## 般定义 {: #general-definitions } 

关于财政库的一些专业术语如下：

- **理事会** —— 一个掌控财政库资金的被选举人群体
- **提案** —— 由利益相关者提出，并由理事会批准的促进网络的计划或建议
- **提案保证金** —— 一笔与提案总支出金额的一定比例等值的存款
- **最低提案保证金** —— 提案保证金的最低金额。这是提案保证金的下限
- **最高提案保证金** —— 提案保证金的最高金额（上限）。 **提案保证金目前在所有基于Moonbeam的网络中均无最高上限**
- **支出期** —— 以区块为单位的天数，在此期间，财政库为各类提案提供资金，但不超过最大值
- **最多批准提案数** —— 最多可以在待支出列队中的提案数量

目前，财政库的价值如下：

=== "Moonbeam"
    |            变量             |  |                                                        值                                                         |
    |:-------------------------------:|::|:--------------------------------------------------------------------------------------------------------------------:|
    |          提案保证金          |  |                        {{ networks.moonbeam.treasury.proposal_bond }}% of the proposed spend                         |
    |      最低提案保证金      |  |                               {{ networks.moonbeam.treasury.proposal_bond_min }} GLMR                                |
    |      最高提案保证金      |  |                               {{ networks.moonbeam.treasury.proposal_bond_max }}                                 |    
    |          支出期           |  | {{ networks.moonbeam.treasury.spend_period_blocks }} blocks ({{ networks.moonbeam.treasury.spend_period_days}} days) |
    |   最高批准提案    |  |                               {{ networks.moonbeam.treasury.max_approved_proposals }}                                |
    | %的交易费分配 |  |                                  {{ networks.moonbeam.treasury.tx_fees_allocated }}                                  |

=== "Moonriver"
    |      变量      |  |                                                         值                                                         |
    |:--------------:|::|:------------------------------------------------------------------------------------------------------------------:|
    |   提案保证金   |  |     {{ networks.moonriver.treasury.proposal_bond }}%提案支出的{{ networks.moonriver.treasury.proposal_bond }}%     |
    | 最低提案保证金 |  |                              {{ networks.moonriver.treasury.proposal_bond_min }} MOVR                              |
    |      最高提案保证金      |  |                               {{ networks.moonriver.treasury.proposal_bond_max }}                                 |        
    |     支出期     |  | {{ networks.moonriver.treasury.spend_period_blocks }} 区块 ({{ networks.moonriver.treasury.spend_period_days}} 天) |
    |  最高批准提案  |  |                              {{ networks.moonriver.treasury.max_approved_proposals }}                              |
    | %的交易费分配  |  |                                {{ networks.moonriver.treasury.tx_fees_allocated }}                                 |

=== "Moonbase Alpha"
    |      变量      |  |                                                        值                                                        |
    |:--------------:|::|:----------------------------------------------------------------------------------------------------------------:|
    |   提案保证金   |  |    {{ networks.moonbase.treasury.proposal_bond }}%提案支出的{{ networks.moonriver.treasury.proposal_bond }}%     |
    | 最低提案保证金 |  |                              {{ networks.moonbase.treasury.proposal_bond_min }} DEV                              |
    |      最高提案保证金      |  |                               {{ networks.moonbase.treasury.proposal_bond_max }}                                 |        
    |     支出期     |  | {{ networks.moonbase.treasury.spend_period_blocks }} 区块 ({{ networks.moonbase.treasury.spend_period_days}} 天) |
    |  最高批准提案  |  |                             {{ networks.moonbase.treasury.max_approved_proposals }}                              |
    | %的交易费分配  |  |                                {{ networks.moonbase.treasury.tx_fees_allocated }}                                |

## 社区财政库  {: #community-treasury } 

每个区块交易费用的一部分将作为资金存入财政库。剩余部分将被销毁（详情见上表）。财政库允许利益相关者提交资金支出提案，以供理事会审查和投票。这些支出提案建议包括促进网络或提高网络参与度的举措。一些网络计划应包括集成、合作、社区活动、网络扩展等。

为了阻止垃圾提案，提案必须与保证金一起提交，也称为提案保证金。提案保证金是提案人要求金额的一定百分比（查看上表），有最低金额，但没有上限（相比有上限的Polkadot和Kusama）。治理提案可以改变这些值。因此，任何拥有足够代币来支付保证金的用户都可以提交提案。如果提议者没有足够的资金来支付保证金，则交易会因资金不足而失败，但仍会扣除交易费用。

提案提交后，理事会将对其进行投票。接受财政部提案的门槛至少是安理会五分之三的成员。另一方面，拒绝提案的门槛至少是理事会的二分之一。请注意，提交国库提案后，用户将无法撤销该提案。

如果提案得到理事会的批准，该提案将进入队列以进入支出期。如果支出提案队列已满，则提案提交将失败，类似于提案者的余额太低时的情况。如果提案被拒绝，存款将被转移到平行链资金账户。

一旦提案进入支出期，资金将分配给受益人，原始保证金将退还给提案人。 如果财政部的资金用完，剩余的批准提案将一直保存到下一个支出期，届时财政部再次拥有足够的资金。

财政库提案流程如下图所示：

![Treasury Proposal Happy Path Diagram](/images/learn/features/treasury/treasury-proposal-roadmap.png)