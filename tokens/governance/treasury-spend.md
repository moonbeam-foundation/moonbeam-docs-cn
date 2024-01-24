---
title: 如何发起财政库支出提案
description: 了解财政库提案的整个周期，从Moonbeam社区论坛上的初始提案到使用保证金启动链上财政库支出。
---

# 如何发起财政库支出提案

## 概览 {: #introduction } 

正如[财政库概览页面](/learn/features/governance/#definitions){target=_blank}所述，Moonbeam财政库是在网络创始之时的一笔链上资金。网络上线之际，Token总供应量的0.5%分配至财政库，另外持续累计的交易费用的一定比例（约为{{ networks.moonbeam.treasury.tx_fees_allocated }}%）将存入财政库。Moonbeam财政库将协助维护重要项目的发展和Moonbeam网络的增长，并为其提供资金支持。

Moonbeam采纳了由社区提出的[Interim Treasury Program提案](https://moonbeam.foundation/news/proposal-treasury-program-approved/){target=_blank}，并设立了由2位Moonbeam基金会成员和3位非基金会成员组成的财政库委员会。该提案旨在为社区参与Moonbeam财政库支出部分提供更多透明度和机会。社区财政库提案已于2022年10月启动，持续运行6个月。在6个月的期限结束时，该计划将与相关的[Gov2](https://moonbeam.network/blog/opengov/){target=_blank}更改一起进行评估和考量。如果维持初始预算参数，链上财政库会有足够的资金运行不少于四年。

在发起一个链上财政库提案之前，您必须先了解[社区财政库提案的流程](https://github.com/moonbeam-foundation/treasury/blob/main/interim/interim_treasury_proposal.md){target=_blank}。提案的流程允许根据财政库委员会提供的反馈进行修订。根据财政库委员会所提出的反馈进行迭代后将提高财政库支出提案通过的成功率。

创建财政库提案与提出其他类型的治理行动不同。本教程概述了如何创建财政部提案的流程。关于[如何发起提案](/tokens/governance/proposals/){target=_blank}有单独的教程，它讲述了如何提出与财政库无关的治理行动。

!!! 注意事项
    发起财政部支出提案并非毫无风险。保证金可能会被无限期锁定，如果提案被拒绝，保证金将被没收。请确保在提交提案前已经过深思熟虑，并仅在财政库委员会的建议下进行提案提交申请。

## 定义 {: #definitions } 

本教程的一些关键参数如下所示：

 - **提案保证金** — 在提交提案时需要提交申请财政库支出提案金额的一定比例。因为不能确保提案会被执行，因此这些Token可能会被锁定一段不确定的时间。如果提案被拒绝，则保证金将转入财政库；如果提案被通过，则保证金将被退回。
 - **最低提案保证金** — 接受财政库提案的最低保证金金额，与财政库支出金额无关。此最低保证金金额可能会导致小额财政库提案金额不可行
 - **财政库地址** —财政库资金累积和支付的地址
 - **受益方** — 如果财政库提案生效，用于接收财政库资金的地址（如[Moonbeam Safe多签](/tokens/manage/multisig-safe/){target=_blank}）
 - **金额** — 申请的财政库支出金额，如果财政库提案生效，该笔资金将分配给受益方地址
 - **支出期** — 财政库提案通过后但在资金支付给受益方之前需要等待的期限

=== "Moonbeam"
    |     变量     |                                                                    值                                                                    |
    |:----------------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
    |  提案保证金   |                                      提案支出的{{ networks.moonbeam.treasury.proposal_bond}}%                                       |
    |   最低提案保证金   |                                           {{ networks.moonbeam.treasury.proposal_bond_min}} GLMR                                            |
    |   支出期   |                                           {{ networks.moonbeam.treasury.spend_period_days}}天                                            |
    | 财政库地址 | [0x6d6f646C70792f74727372790000000000000000](https://moonbeam.subscan.io/account/0x6d6f646C70792f74727372790000000000000000){target=_blank} |

=== "Moonriver"
    |     变量     |                                                                    值                                                                     |
    |:----------------:|:--------------------------------------------------------------------------------------------------------------------------------------------:|
    |  提案保证金   |                                      提案支出的{{ networks.moonriver.treasury.proposal_bond}}                                       |
    |   最低提案保证金   |                                           {{ networks.moonriver.treasury.proposal_bond_min}} MOVR                                            |
    |   支出期   |                                           {{ networks.moonriver.treasury.spend_period_days}}天                                            |
    | 财政库地址 | [0x6d6f646C70792f74727372790000000000000000](https://moonriver.subscan.io/account/0x6d6f646C70792f74727372790000000000000000){target=_blank} |
    
=== "Moonbase Alpha"
    |     变量     |                                                                    值                                                                    |
    |:----------------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
    |  提案保证金   |                                      提案支出的{{ networks.moonbase.treasury.proposal_bond}}%                                       |
    |   最低提案保证金   |                                            {{ networks.moonbase.treasury.proposal_bond_min}} DEV                                            |
    |   支出期   |                                           {{ networks.moonbase.treasury.spend_period_days}} 天                                            |
    | 财政库地址 | [0x6d6f646C70792f74727372790000000000000000](https://moonbase.subscan.io/account/0x6d6F646c70632f74727372790000000000000000){target=_blank} |

本教程将向您展示如何在Moonbase Alpha上提交提案。此步骤也同样适用于Moonbeam和Moonriver。准备在Moonbeam或Moonriver上操作之前，建议您先熟悉在Moonbase Alpha或本地开发节点上提交财政库提案的所有步骤。

## 财政库提案步骤 {: #roadmap-of-a-treasury-proposal } 

您可以在[财政库概览页面的财政库提案步骤](/learn/features/treasury/){target=_blank}部分找到详细的解释。关于流程的更多信息，请查看[Interim Treasury Program社区财政库提案文章](https://moonbeam.foundation/news/proposal-treasury-program-approved/){target=_blank}。

![Proposal Roadmap](/images/tokens/governance/treasury-proposals/treasury-proposal-roadmap.webp)

## 提交您的想法至论坛 {: #submitting-your-idea-to-the-forum }

强烈建议您先在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}发布一条关于提案想法的帖子作为任何提案的开头。该帖子将会对外开放至少5天，以收集来自社区的反馈。这对于财政库提案特别重要，因为提交财政库支出提案需要提交不可撤销的保证金。您可以遵循[使用Moonbeam社区论坛提交财政库提案的教程](https://moonbeam.network/blog/using-moonbeam-community-forum/){target=_blank}提交财政库支出提案的想法。

![Moonbeam Forum Home](/images/tokens/governance/treasury-proposals/treasury-proposal-1.webp)

## 发起提案 {: #proposing-an-action } 

此部分将主要介绍在您与财政库委员会合作完善想法后提交链上财政库提案的机制。如果您尚未完成前面的财政部库提案流程的步骤，请先查看[Interim Treasury Program社区财政库提案的申请指南](https://github.com/moonbeam-foundation/treasury/blob/main/interim/interim_treasury_proposal.md){target=_blank}并评估您当前的进展。参与社区讨论并根据收到的反馈修改提案是最关键的一个部分。提交链上财政库提案相对比较容易，操作演示如下所示：

首先，前往[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/treasury){target=_blank}并执行以下步骤：

1. 选择**Governance**导航栏

2. 点击**Treasury** 

3. 点击**Submit Proposal**

![Treasury home](/images/tokens/governance/treasury-proposals/treasury-proposal-2.webp)

然后执行以下步骤：

1. 选择将作为财政库提案创建者的账户。确保被选账户有足够的资金用于提案保证金

2. 选择提案的受益方。该账户应该对应发布论坛帖子的账户

3. 表明财政库支出提案的金额。所需保证金为提案金额的{{ networks.moonbeam.treasury.proposal_bond}}%。承诺用于财政库支出提案的保证金是不可撤销的

4. 检查所有填写信息的准确性，然后点击**Submit proposal**并签署交易

![Submitting a Treasury spend proposal](/images/tokens/governance/treasury-proposals/treasury-proposal-3.webp)

提交财政库提案后，刷新Polkadot.js Apps，您将看到您的提案已出现在列表中。如果您未看到您的提案出现，您的账号可能没有足够的资金支付所需保证金。

如果您用创建财政库支出提案的同一个账户登陆[Polkassembly](https://moonbeam.polkassembly.io/opengov){target=_blank}，您将能够编辑提案描述，以添加[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}提案讨论的链接。该步骤必不可少，虽然Polkassembly会为每个提案自动生成一个帖子，但它不会提供有关提案的详细信息。

提交链上提案后，您需要在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}编辑提案，标题需要包含提案ID，状态更新为`Submitted`。关于编辑Moonbeam社区论坛提案的详细说明可以在[使用Moonbeam社区论坛的教程](https://moonbeam.network/blog/using-moonbeam-community-forum/){target=_blank}中找到。

![Polkassembly](/images/tokens/governance/treasury-proposals/treasury-proposal-4.webp)
