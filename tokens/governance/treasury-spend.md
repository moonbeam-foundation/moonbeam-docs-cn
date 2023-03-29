---
title: How to Propose a Treasury Spend 如何发起财政库支出提案
description: Learn about the full lifecycle of a Treasury proposal from initial proposal on Moonbeam's Community forum to initiating the on-chain Treasury spend with a bond.
了解财政库提案的整个周期，从Moonbeam社区论坛上的初始提案到使用保证金启动链上财政库支出。
---

# How to Propose a Treasury Spend 如何发起财政库支出提案

![Governance Moonbeam Banner](/images/tokens/governance/treasury-proposals/treasury-proposal-banner.png)

## Introduction 概览 {: #introduction } 

As mentioned in the [Treasury overview page](/learn/features/governance/#definitions){target=_blank}, the Moonbeam Treasury is an on-chain collection of funds that was launched at the genesis of the network. The Treasury was pre-funded with 0.5% of the total token supply at network launch and has been steadily accumulating GLMR from a portion of transaction fees (approx. {{ networks.moonbeam.treasury.tx_fees_allocated }}% of transaction fees go to the Treasury). The Moonbeam Treasury is intended to help fund key projects that help maintain and further the growth of the Moonbeam network.

正如[财政库概览页面](/learn/features/governance/#definitions){target=_blank}所述，Moonbeam财政库是在网络启动之时的一笔链上资金。网络上线之际，Token总供应量的0.5%分配至财政库，另外持续累计的交易费用的一定比例（约为{{ networks.moonbeam.treasury.tx_fees_allocated }}%）将存入财政库。Moonbeam财政库将协助维护重要项目的发展和Moonbeam网络的增长，并为其提供资金支持。

Moonbeam has adopted an interim [community Treasury program](https://moonbeam.foundation/news/proposal-treasury-program-approved/){target=_blank}, which established a Treasury Council comprised of two Moonbeam foundation members and three non-foundation members. The Treasury Council facilitates community discussions on spending ideas and votes on spending proposals. The community Treasury program kicked off in October of 2022 with an initial duration of six months. At the end of the six-month period the program will be evaluated and considered alongside relevant [Gov2](https://moonbeam.network/blog/opengov/){target=_blank} changes. If initial budgeting parameters are maintained, the on-chain Treasury has sufficient funds to operate for a period of not less than four years. 

Moonbeam采纳了由社区提出的[Interim Treasury Program提案](https://moonbeam.foundation/news/proposal-treasury-program-approved/){target=_blank}，并设立了由2位Moonbeam基金会成员和3位非基金会成员组成的财政库委员会。该提案旨在为社区参与Moonbeam财政库支出部分提供更多透明度和机会。社区财政库提案已于2022年10月启动，持续运行6个月。在6个月的期限结束时，该计划将与相关的[Gov2](https://moonbeam.network/blog/opengov/){target=_blank}更改一起进行评估和考虑。如果维持初始预算参数，能够确保提案的预算维持4年的支出。

It is extremely important that you understand the [process of the community Treasury program](https://github.com/moonbeam-foundation/treasury/blob/main/interim/interim_treasury_proposal.md){target=_blank} prior to initiating an on-chain Treasury proposal. The outlined process allows for revisions based on feedback provided by the Treasury Council. Thoughtful iteration based on feedback from the Treasury Council can improve the chances of your Treasury spend proposal successfully passing. 

在发起一个链上财政库提案之前，您必须先了解[社区财政库提案的流程](https://github.com/moonbeam-foundation/treasury/blob/main/interim/interim_treasury_proposal.md){target=_blank}。提案的流程允许根据财政库委员会提供的反馈进行修订。根据财政库委员会所提出的反馈进行迭代后将提高财政库支出提案通过的成功率。

Creating a Treasury proposal differs from proposing other types of governance actions. This guide outlines the process of how to create a Treasury proposal. There is a separate guide on [How to Propose an Action](/tokens/governance/proposals/){target=_blank} which discusses proposing governance actions unrelated to the Treasury.

创建财政库提案与提出其他类型的治理行动不同。本教程概述了如何创建财政部提案的流程。关于[如何发起提案](/tokens/governance/proposals/){target=_blank}请参考下方分步教程，该部分讲述了如何提出与财政库无关的治理行动。

!!! note 注意事项
    Proposing a Treasury spend is not a riskless action. Bonds may be locked for an indefinite period of time and the entirety of your bond is forfeited if your proposal is rejected. You should carefully consider these ramifications and proceed with raising a Treasury spend proposal only at the advice of the Treasury Council.

发起财政部支出提案并非毫无风险。保证金可能会被锁定一段时间，如果提案被拒绝，保证金将被没收。请确保在提交提案前已经过深思熟虑，并在财政库委员会的建议下进行提案提交申请。

## Definitions 定义 {: #definitions } 

Some of the key parameters for this guide are the following:

本教程的一些关键参数如下所示：

 - **Proposal Bond** — the percentage of proposed Treasury spend amount required to be submitted at the origination of the proposal. These tokens might be locked for an indeterminate amount of time because there is no guarantee the proposal will be acted upon. This bond is transferred to the Treasury if the proposal is rejected but refunded if the proposal is passed
 - **提案保证金** — 在提交提案时需要提交申请财政库支出提案金额的一定比例。因为不能确保提案会被执行，因此这些Token可能会被锁定一段时间。如果提案被拒绝，则保证金将转入财政库；如果提案被通过，则保证金将被退回。
 - **Minimum Bond** — the minimum bond accepted with a proposed Treasury spend regardless of the amount of the Treasury spend. This minimum bond amount may render small Treasury proposal amounts infeasible
 - **最低提案保证金** — 接受财政库提案的最低保证金金额，与财政库支出金额无关。此最低保证金金额可能会导致小额财政库提案金额不可实现
 - **Treasury address** — the address where Treasury funds accrue and are disbursed from
 - **财政库地址** —财政库资金累积和支付的地址
 - **Beneficiary** — the address, such as a [Moonbeam Safe multisig](/tokens/manage/multisig-safe/){target=_blank}, that will receive the funds of the Treasury proposal if enacted
 - **受益方** — 如果财政库提案生效，用于接收财政库资金的地址（如[Moonbeam Safe多签](/tokens/manage/multisig-safe/){target=_blank}）
 - **Value** — the amount that is being asked for and will be allocated to the beneficiary address if the Treasury proposal is enacted
 - **金额** — 申请的财政库支出金额，如果财政库提案生效，该笔资金将分配给受益方地址
 - **Spend period** — the waiting period after a Treasury proposal has been approved, but before the funds have been disbursed to the beneficiary
 - **支出期** — 财政库提案通过后需要等待的期限，但是在这之前资金已分配给受益方

=== "Moonbeam"
    |     Variable变量     |                                                                    Value值                                                                    |
    |:----------------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
    |  Proposal Bond提案保证金   |                                      提案支出的{{ networks.moonbeam.treasury.proposal_bond}}%                                       |
    |   Minimum Bond最低提案保证金   |                                           {{ networks.moonbeam.treasury.proposal_bond_min}} GLMR                                            |
    |   Spend Period支出期   |                                           {{ networks.moonbeam.treasury.spend_period_days}}提案                                            |
    | Treasury Address财政库地址 | [0x6d6f646C70792f74727372790000000000000000](https://moonbeam.subscan.io/account/0x6d6f646C70792f74727372790000000000000000){target=_blank} |

=== "Moonriver"
    |     Variable变量     |                                                                    Value值                                                                     |
    |:----------------:|:--------------------------------------------------------------------------------------------------------------------------------------------:|
    |  Proposal Bond提案保证金   |                                      提案支出的{{ networks.moonriver.treasury.proposal_bond}}                                       |
    |   Minimum Bond最低提案保证金   |                                           {{ networks.moonriver.treasury.proposal_bond_min}} MOVR                                            |
    |   Spend Period支出期   |                                           {{ networks.moonriver.treasury.spend_period_days}}天                                            |
    | Treasury Address财政库地址 | [0x6d6f646C70792f74727372790000000000000000](https://moonriver.subscan.io/account/0x6d6f646C70792f74727372790000000000000000){target=_blank} |
    
=== "Moonbase Alpha"
    |     Variable变量     |                                                                    Value值                                                                    |
    |:----------------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
    |  Proposal Bond提案保证金   |                                      提案支出的{{ networks.moonbase.treasury.proposal_bond}}%                                       |
    |   Minimum Bond最低提案保证金   |                                            {{ networks.moonbase.treasury.proposal_bond_min}} DEV                                            |
    |   Spend Period支出期   |                                           {{ networks.moonbase.treasury.spend_period_days}} 天                                            |
    | Treasury Address财政库地址 | [0x6d6f646C70792f74727372790000000000000000](https://moonbase.subscan.io/account/0x6d6F646c70632f74727372790000000000000000){target=_blank} |

This guide will show you how to submit a proposal on Moonbase Alpha. It can be adapted for Moonbeam or Moonriver. In any case, it's recommended that you familiarize yourself with the steps of submitting a Treasury proposal on Moonbase Alpha or a local dev node before taking the steps on Moonbeam or Moonriver. 

本教程将向您展示如何在Moonbase Alpha上提交提案。此步骤也同样适用于Moonbeam和Moonriver。准备在Moonbeam或Moonriver上操作之前，建议您先熟悉在Moonbase Alpha或本地开发节点上提交财政库提案的所有步骤。

## Roadmap of a Treasury Proposal 财政库提案步骤 {: #roadmap-of-a-treasury-proposal } 

You can find a full explanation of the [happy path for a Treasury proposal on the Treasury overview page](/learn/features/treasury/){target=_blank}. For more information on the process, see this [guide to the interim community Treasury program](https://moonbeam.foundation/news/proposal-treasury-program-approved/){target=_blank}.

您可以在[财政库概览页面的财政库提案步骤](/learn/features/treasury/){target=_blank}部分找到详细的解释。关于流程的更多信息，请查看[Interim Treasury Program社区财政库提案文章](https://moonbeam.foundation/news/proposal-treasury-program-approved/){target=_blank}。

![Proposal Roadmap](/images/tokens/governance/treasury-proposals/treasury-proposal-roadmap.png)

## Submitting your Idea to the Forum 提交您的想法至论坛 {: #submitting-your-idea-to-the-forum }

It's highly recommended that you preface any proposal with a post on [Moonbeam's Community Forum](https://forum.moonbeam.foundation/){target=_blank}. You should allow a period of five days for the community to provide feedback on the Moonbeam Forum post. This is especially important for Treasury proposals because of the irrevocable bond required to submit a Treasury spend proposal. You can submit your idea for a Treasury spend proposal by following [the instructions in the Using the Moonbeam Community Forum to Submit a Treasury Proposal guide](https://moonbeam.network/blog/using-moonbeam-community-forum/){target=_blank}. 

建议您先在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}发布一条关于提案想法的帖子。该帖子将会对外开放至少5天，以收集来自社区的反馈。这对于财政库提案特别重要，因为提交财政库支出提案需要提交不可撤销的保证金。您可以遵循[使用Moonbeam社区论坛提交财政库提案的教程](https://moonbeam.network/blog/using-moonbeam-community-forum/){target=_blank}提交财政库支出提案的想法。

![Moonbeam Forum Home](/images/tokens/governance/treasury-proposals/treasury-proposal-1.png)

## Proposing an Action 发起提案 {: #proposing-an-action } 

This guide focuses on the mechanics of submitting an on-chain Treasury proposal after you have worked with the Treasury Council to refine your idea. If you haven't yet completed the prior steps of the Treasury proposal process, please take a moment to review the [guidelines of the community Treasury program](https://github.com/moonbeam-foundation/treasury/blob/main/interim/interim_treasury_proposal.md){target=_blank} and evaluate your standing. Engaging the community and revising your proposal based on feedback received is the most critical piece of your proposal. Submitting the on-chain Treasury proposal is the easy part, demonstrated in the following guide. 

此部分将主要介绍在您与财政库委员会合作完善想法后提交链上财政库提案的机制。如果您尚未完成前面的财政部库提案流程的步骤，请先查看[Interim Treasury Program社区财政库提案的申请指南](https://github.com/moonbeam-foundation/treasury/blob/main/ interim/interim_treasury_proposal.md){target=_blank}并评估您当前的进展。参与社区讨论并根据收到的反馈修改提案是最关键的一个部分。提交链上财政库提案相对比较容易，操作演示如下所示：

To get started, head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/treasury){target=_blank} and take the following steps: 

首先，前往[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/treasury){target=_blank}并执行以下步骤：

1. Select the **Governance** heading

   选择**Governance**导航栏

2. Click on **Treasury** 

   点击**Treasury** 

3. Click **Submit Proposal**

   点击**Submit Proposal**

![Treasury home](/images/tokens/governance/treasury-proposals/treasury-proposal-2.png)

Then, take the following steps:

然后执行以下步骤：

1. Select the account that will be the creator of the Treasury proposal. Make sure that the account selected here is sufficiently funded with your proposal bond

   选择将作为财政库提案创建者的账户。确保被选账户有足够的资金用于提案保证金

2. Select the beneficiary of the proposal. This should correspond to the account indicated in your forum post

   选择提案的受益方。该账户应该对应发布论坛帖子的账户

3. Indicate the value of the spend proposal. The required bond is {{ networks.moonbeam.treasury.proposal_bond}}% of the proposal's value. The bond committed to a Treasury spend proposal is irrevocable

   表明财政库支出提案的金额。所需保证金为提案金额的{{ networks.moonbeam.treasury.proposal_bond}}%。承诺用于财政库支出提案的保证金是不可撤销的

4. Review each field for accuracy then press **Submit proposal** and sign the transaction

   检查所有填写信息的准确性，然后点击**Submit proposal**并签署交易

![Submitting a Treasury spend proposal](/images/tokens/governance/treasury-proposals/treasury-proposal-3.png)

After submitting your Treasury proposal, you can refresh Polkadot.js Apps and you should see your proposal listed. If you don't see your proposal appear here, your account may not have contained sufficient funds for the required bond. 

提交财政库提案后，刷新Polkadot.js Apps，您将看到您的提案已出现在列表中。如果您未看到您的提案出现，您的账号可能没有足够的资金支付所需保证金。

If you login to [Polkassembly](https://moonbeam.polkassembly.network/){target=_blank} with the same account that you used to create the Treasury spend proposal, you'll be able to edit the description of the proposal to include a link to the proposal discussion on the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank}. This is a helpful step because while Polkassembly auto-generates a post for each proposal, it doesn't provide context information on the contents of the proposal. 

如果您用创建财政库支出提案的同一个账户登陆[Polkassembly](https://moonbeam.polkassembly.network/){target=_blank}，您将能够编辑提案描述，添加在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}提案讨论的链接。该步骤必不可少，虽然Polkassembly会为每个提案自动生成一个帖子，但它不会提供有关提案的详细信息。

After submitting the on-chain proposal, you’ll need to edit your proposal on the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank}. You will need to update the title to include the proposal ID, and the status will need to be changed to `Submitted` state. The full instructions to edit your Moonbeam Community Forum post are available on [this guide to using the Moonbeam Community Forum](https://moonbeam.network/blog/using-moonbeam-community-forum/){target=_blank}.

提交链上提案后，您需要在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}编辑提案，标题需要包含提案ID，状态更新为`Submitted`。关于编辑Moonbeam社区论坛提案的详细说明可以在[使用Moonbeam社区论坛的教程](https://moonbeam.network/blog/using-moonbeam-community-forum/){target=_blank}中找到。

![Polkassembly](/images/tokens/governance/treasury-proposals/treasury-proposal-4.png)
