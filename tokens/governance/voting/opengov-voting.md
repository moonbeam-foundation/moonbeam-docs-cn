---
title: How to Vote on a Proposal in OpenGov 如何在OpenGov对提案进行投票
description: Follow this guide to learn how to vote and lock your tokens to support or reject a proposal put forth for a referendum in Governance v2 (OpenGov) on Moonbeam. 
通过本教程学习如何使用投票以及锁定Token以支持或拒绝在Moonbeam上Governance v2 (OpenGov)进行公投的提案。
---

# How to Vote on a Proposal in Governance v2: OpenGov 如何在OpenGov（Governance v2）中对提案进行投票

![Governance Moonbeam Banner](/images/tokens/governance/voting/voting-banner.png)

## Introduction 概览 {: #introduction } 

Referenda are simple, inclusive, and stake-based voting schemes. Each referendum has a proposal associated with it that suggests an action to take place. In OpenGov, each referendum will have a specified Origin class that the proposal will be executed with and each Origin has its own Track that proposals will process through. Although referenda are completed by a common process, the requirements for approval are Track-specific.

公投是简单的、包容的和基于质押的投票方案。每一次公投都有一个与之相关的具体的提议。在OpenGov中，每个公投都有一个指定的Origin级别，与提案共同执行，并且每个Origin都有一个自己的Track，用于处理提案。尽管公投是通过共同过程完成的，但批准的要求是特定于Track的。

Token holders can vote on referenda using their own tokens. Two factors defined the weight a vote has: the number of tokens locked and lock duration (called Conviction). This is to ensure that there is an economic buy-in to the result to prevent vote-selling. Consequently, the longer you are willing to lock your tokens, the stronger your vote will be weighted. You also have the option of not locking tokens at all, but vote weight is drastically reduced.

Token持有者可以使用持有的Token进行投票。影响投票权重的因素有两个：Token锁定量和锁定期（称为“信念值”）。这可以从经济利益上确保不会出现兜售投票权的现象。因此，锁定期越长，投票权重越高。用户也可以选择不锁定Token，但投票权重会大大下降。

In Moonbeam, users will be able to create and vote on proposals using their H160 address and private key, that is, their regular Ethereum account! 

在Moonbeam，用户可以使用其H160地址和私钥（也就是以太坊账户）来创建提案、附议提案和投票提案。

Moonbeam's governance system is in the process of getting revamped! This next phase of governance is known as OpenGov (Governance v2). During the roll-out process, OpenGov will be rigorously tested on Moonriver before a proposal will be made to deploy it on Moonbeam. Until it launches on Moonbeam, Moonbeam will continue to use Governance v1. As such, **this guide is for proposals on Moonriver or Moonbase Alpha only**. If you're looking to submit a proposal on Moonbeam, you can refer to the [How to Vote on a Proposal in Governance v1](/tokens/governance/voting/voting){target=_blank} guide.

Moonbeam的治理系统正在更新中。下一个阶段的治理称为OpenGov（Governance v2）。在推出过程中，OpenGov将在Moonriver上经过严格测试，然后再通过提案部署至Moonbeam。在正式上线Moonbeam之前，Moonbeam将继续使用Governance v1。因此，**本教程仅适用于Moonriver或Moonbase Alpha上的提案**。如果想要对Moonbeam上的提案进行投票，请参考[如何在Governance v1对提案进行投票](/tokens/governance/voting/voting){target=_blank}的教程。

This guide will outline the process, with step-by-step instructions, of how to vote on referenda in Governance v2: OpenGov. This guide will show you how to vote on Moonbase Alpha, but it can be easily adapted for Moonriver. For more information on Moonbeam's governance system, including Governance v1 and OpenGov (Governance v2), please refer to the [governance overview page](/learn/features/governance/){target=_blank}.

本教程将概述如何在Moonbeam的OpenGov（Governance v2）对公投进行投票，并提供分步教程。关于Moonbeam治理系统的更多信息，包括Governance v1和OpenGov（Governance v2），请参考[治理概览页面](/learn/features/governance/){target=_blank}。

!!! note 注意事项
    This page goes through the mechanics on how to vote at a more techincal level. Token holders can leverage platforms such as [Polkassembly](https://moonbeam.network/tutorial/participate-in-moonbeam-governance-with-polkassembly/){target=_blank} to vote using a more friendly user interface. 

本教程将介绍如何在技术层面上投票的机制。Token持有者可以使用[Polkassembly](https://moonbeam.network/tutorial/participate-in-moonbeam-governance-with-polkassembly/){target=_blank}等用户友好性界面的平台进行投票。

## Definitions 定义 {: #definitions } 

Some of the key parameters for this guide are the following:

本教程中重要参数定义如下：

--8<-- 'text/governance/vote-conviction-definitions.md'

 - **Maximum number of votes** — the maximum number of concurrent votes per account

 - **最高票数** — 每个账户的最高票数

    === "Moonriver"
        ```
        {{ networks.moonriver.governance.max_votes }} votes
        ```

    === "Moonbase Alpha"
        ```
        {{ networks.moonbase.governance.max_votes }} votes
        ```

--8<-- 'text/governance/approval-support-definitions.md'

--8<-- 'text/governance/lead-in-definitions.md'

 - **Decide Period** - token holders continue to vote on the referendum. If a referendum does not pass by the end of the period, it will be rejected and the Decision Deposit will be refunded
 - **决定期** — Token持有者继续在公投上进行投票。如果公投在期限结束时未通过，则提案会被拒绝，决定保证金将被退还
 - **Confirm Period** - a period of time within the Decide Period where the referendum needs to have maintained enough Approval and Support to be approved and move to the Enactment Period
 - **确认期** — 公投需要在确定期内获得足够的批准和支持数量才能进入生效等待期
 - **Enactment Period** - a specified time, which is defined at the time the proposal was created, that meets at least the minimum amount of time that an approved referendum waits before it can be dispatched
 - **生效等待期** — 批准的提案等待指定时间以正式执行。每个Track有一个最短等待期限

--8<-- 'text/governance/delegation-definitions.md'

For an overview of the Track-specific parameters such as the length of the Decide, Confirm, and Enactment Period, the Approval and Support requirements, and more, please refer to the [Governance Parameters for OpenGov (Governance v2) section of the governance overview page](/learn/features/governance/#governance-parameters-v2){target=_blank}.

关于Track的特定参数更多信息，例如决定期、确定期、生效等待期、批准和支持要求等，请参考[治理概览的OpenGov（Governance V2）的治理参数部分](/learn/features/governance/#governance-parameters-v2){target=_blank}。

## Roadmap of a Proposal 提案步骤 {: #roadmap-of-a-proposal }

This guide will cover how to vote on public referenda, as seen in the steps highlighted in the proposal roadmap diagram below. In addition to learning how to vote on referenda, you'll learn how the proposal progresses through the Lead-in Period, the Decide and Confirm Period, and the Enactment Period. 

本教程将涵盖下方显示提案步骤图的重要步骤。您将了解如何对公投进行投票以及提案如何在带入期、决定期、确认期和生效等待期展开进展。

You can find a full explanation of the [happy path for a OpenGov proposal on the Governance overview page](/learn/features/governance/#roadmap-of-a-proposal-v2){target=_blank}.

您可以在[治理概览页面的OpenGov提案步骤](/learn/features/governance/#roadmap-of-a-proposal-v2){target=_blank}部分找到详细的解释。

![Proposal Roadmap](/images/tokens/governance/voting/v2/proposal-roadmap.png)

--8<-- 'text/governance/forum-discussion.md'

## Voting on a Referendum 参与公投 {: #voting-on-a-referendum } 

This section goes over the process of voting on public referendum in OpenGov (Governance v2) on Moonbase Alpha. These steps can be adapted for Moonriver. The guide assumes that there is one already taking place. If there is an open referendum that you want to vote on, you can adapt these instructions to learn how to vote on it.

此部分将介绍Moonbase Alpha上OpenGov（Governance v2）公投的投票流程。操作步骤也同样适用于Moonriver。本教程使用已经创建的公投进行讲解，如果您想要参与目前已开放的公投， 您也可以同样使用这些步骤进行投票。

To vote on a proposal in the network, you need to use the Polkadot.js Apps interface. To do so, you need to import an Ethereum-style account first (H160 address), which you can do by following the [Creating or Importing an H160 Account](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank} guide. For this example, three accounts were imported and named with super original names: Alice, Bob, and Charlie.

要在网络中对提案进行投票，您需要使用Polkadot.js Apps接口。为此，您需要先导入以太坊格式的地址（H160地址），您可以通过[创建或导入H160账户](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank}教程完成此步骤。在本示例中，我们导入了三个账户，并分别命名为Alice、Bob和Charlie。

![Accounts in Polkadot.js](/images/tokens/governance/proposals/proposals-3.png)

To get started, you'll need to navigate to [Moonbase Alpha's Polkadot.js Apps interface](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network){target=_blank}. Everything related to governance lives under the **Governance** tab. To view all of the referenda, you can choose **Referenda** from the **Governance** dropdown. On the **Referenda** page, you'll see a list of referenda organized by Track. To view the details of a specific referendum, you can click on the arrow next to the description. The number next to the action and description is called the referendum index.

在Moonbeam上对提案进行投票非常简单。前往[Moonbase Alpha的Polkadot.js Apps界面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network){target=_blank}，所有治理相关功能都在**Governance**标签下。在**Governance**下拉菜单中选择**Referenda**，您可以看到所有的公投。在**Referenda**页面，您可以看到每个Track的公投列表。要查看特定公投的详情，请点击描述旁边的箭头。提案和描述旁边的数字称为公投指数。

### How to Support a Proposal by Contributing to the Decision Deposit 如何通过贡献决定保证金支持提案 {: #submit-decision-deposit }

In order for a referendum to move out of the Lead-in Period into the Decide Period, the Decision Deposit must be submitted. This deposit can be submitted by the author of the proposal or any other token-holder. The deposit varies depending upon the Track of the proposal.

要将公投从带入期进入到决定期，必须提交决定保证金。保证金可以由提案的作者或者任何Token持有者支付。保证金的金额取决于提案的Track类别。

For example, a referendum that is in the General Admin Track has a Decision Deposit of {{ networks.moonbase.governance.tracks.general_admin.decision_deposit }} on Moonbase Alpha.

举例来说，在General Admin Track中的公投需要在Moonbase Alpha上有{{ networks.moonbase.governance.tracks.general_admin.decision_deposit }}的决定保证金。

From the [list of referenda on Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/referenda){target=_blank}, you may notice that some proposals are in the **Preparing** state. If a referendum requires the Decision Deposit to be submitted, you'll see a **Decision deposit** button. To submit the deposit, you can go ahead and click on this button.

从[Polkadot.js Apps的公投列表](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/referenda){target=_blank}中可以发现，有些提案已经处于**Preparing**状态。如果提交公投需要一笔决定保证金，您会看到**Decision deposit**的按钮。要提交保证金，您可以点击按钮进行操作。

![To start to submit a Decision Deposit for a referendum, click on the "Decision deposit" button on Polkadot.js Apps.](/images/tokens/governance/voting/v2/vote-1.png)

Then take the following steps to submit the deposit from a specific account:

然后，请执行以下操作从指定账户提交保证金：

1. Select the **deposit from account**. This account does not need to be the author of the proposal, it can be from any token holder. However, if the proposal is deemed malicious, the Decision Deposit will be burned. So, before placing the deposit it is advised to do your due dilligence to ensure the proposal is not malicious

   在**deposit from account**选择想要用户充值保证金的账户，此账户无需是提案的作者，可以是任何Token持有者的账户。但是如果提案被检测为恶意提案，则决定保证金将被销毁。因此，在提交保证金之前请尽职调查，确保提案不是恶意操作

2. The **referendum id** and **decision deposit** fields will automatically be populated for you based on the referendum and Track it belongs to

   **referendum id**和**decision deposit**字段将会根据公及其所属的Track自动填充

3. Click **Place deposit** and sign the transaction

   点击**Place deposit**按钮并签署交易

![To submit the Decision Deposit, choose the account to place the deposit and click on the "Place deposit" button on Polkadot.js Apps.](/images/tokens/governance/voting/v2/vote-2.png)

Once the deposit has been placed, Polkadot.js Apps will update and display the account that paid the Decision Deposit along with the amount of the deposit. Now this referendum is one step closer to meeting the criteria of the Lead-in Period.

成功提交保证金后，Polkadot.js Apps将会更新并显示支付保证金的账户信息及其金额。现在公投离满足带入期的标准又近了一步。

If the Prepare Period has passed and there is enough space for a referndum in the General Admin Track, this proposal will move on to the Decide Period.

如果准备期已过，并且在General Admin Track中有足够的空间进行公投，则该提案将进入决定期。

### How to Vote 如何投票 {: #how-to-vote }

As you may have noticed, voting is not required in the Lead-in Period. However, it is essential in the Decide Period. The steps in this section will apply to referenda in both the Lead-in Period and the Decide Period.

您可能已经注意到，带入期无需投票。但是在决定期是必要步骤。此部分中的操作步骤适用于带入期和决定期的公投。

To vote and lock tokens either in favor of or opposition of a referendum, you can get started by clicking on the **Vote** button next to the referendum you want to vote on.

要投票和锁定Token以支持或反对公投，您可以通过点击要投票的公投旁边的**Vote**按钮开始。

![To vote on a referendum, click on the "Vote" button on Polkadot.js Apps.](/images/tokens/governance/voting/v2/vote-3.png)

Then you can take the following steps to fill in the details of the vote:

然后，请执行以下步骤填写投票的详细信息：

1. Select the **vote with account**

   在**vote with account**选择想要投票的账户

2. Choose how you would like to vote on the referendum. You can choose **Aye** in favor of the referendum, **Nay** in opposition of it, or **Split** if you want to specify an "Aye" vote value and "Nay" vote value

   选择公投投票的形式。您可以选择**Aye**支持公投，或者选择**Nay**反对公投，如果您想要分别设置赞成票和反对票，则可以选择**Split**

3. Enter in the vote value

   输入投票的数值

4. Set the vote conviction, which determines the weight of your vote (`vote_weight = tokens * conviction_multiplier`). Please refer to the [Conviction multiplier](/learn/features/governance/#conviction-multiplier){target=_blank} docs for more information

   设置投票的信念值，即决定投票权重（`vote_weight = tokens * conviction_multiplier`）。请参考[信念乘数](/learn/features/governance/#conviction-multiplier){target=_blank}文档获取更多信息

5. Click **Vote** and sign the transaction

   点击**Vote**并签署交易

![To submit a vote on a referendum, fill out the details of the vote and click on the "Vote" button on Polkadot.js Apps.](/images/tokens/governance/voting/v2/vote-4.png)

!!! note 注意事项
    The lockup periods shown in the previous image are not to be taken as reference as they are subject to change.

上图显示的锁定期仅供参考，因其可能会发生变化。

To see how your vote and all of the other votes for a referendum impacted the Approval and Support curves, you can click on the arrow next to the **Vote** button. You'll notice there are two charts, one for each curve. If you hover over the charts, you can see the minimum Approval or Support required at a specific block along with the current Approval or Support. 

要查看您的投票以及所有其他投票如何影响公投的批准和支持曲线，您可以点击**Vote**按钮旁边的箭头。此处，您会看到两个图标，分别为批准曲线和支持曲线。如果您将鼠标放在图标上，您可以看到特定区块所需的最低批准数/支持数以及当前的批准数/支持数。

![View the Approval and Support curves for a referendum on Polkadot.js Apps.](/images/tokens/governance/voting/v2/vote-5.png)

A proposal in the General Admin Track on Moonbase Alpha would have the following characteristics:

在Moonbase Alpha上的General Admin Track提交的提案将具有以下特征：

 - The Approval curve starts at {{ networks.moonbase.governance.tracks.general_admin.min_approval.percent0 }}% on {{ networks.moonbase.governance.tracks.general_admin.min_approval.time0 }}, goes to {{ networks.moonbase.governance.tracks.general_admin.min_approval.percent1 }}% on {{ networks.moonbase.governance.tracks.general_admin.min_approval.time1 }}
 - 批准曲线从第{{ networks.moonbase.governance.tracks.general_admin.min_approval.time0 }}天的{{ networks.moonbase.governance.tracks.general_admin.min_approval.percent0 }}%开始，在第{{ networks.moonbase.governance.tracks.general_admin.min_approval.time1 }}天达到{{ networks.moonbase.governance.tracks.general_admin.min_approval.percent1 }}%
 - The Support curve starts at {{ networks.moonbase.governance.tracks.general_admin.min_support.percent0 }}% on {{ networks.moonbase.governance.tracks.general_admin.min_support.time0 }}, goes to {{ networks.moonbase.governance.tracks.general_admin.min_support.percent1 }}% on {{ networks.moonbase.governance.tracks.general_admin.min_support.time1 }}
 - 支持曲线从第{{ networks.moonbase.governance.tracks.general_admin.min_support.time0 }}天的{{ networks.moonbase.governance.tracks.general_admin.min_support.percent0 }}%开始，在第{{ networks.moonbase.governance.tracks.general_admin.min_support.time1 }}天达到{{ networks.moonbase.governance.tracks.general_admin.min_support.percent1 }}%
 - A referendum starts the Decide Period with 0% "Aye" votes (nobody voted in the Lead-in Period)
 - 公投以0%的“赞成”票开始决定期（带入期不开放投票）
 - Token holders begin to vote and the Approval increases to a value above {{ networks.moonbase.governance.tracks.general_admin.min_approval.percent1 }}% by {{ networks.moonbase.governance.tracks.general_admin.min_approval.time1 }}
 - Token持有者开始投票并在第{{ networks.moonbase.governance.tracks.general_admin.min_approval.time1 }}天将批准率增加到{{ networks.moonbase.governance.tracks.general_admin.min_approval.percent1 }}%
 - If the Approval and Support thresholds are met for the duration of the Confirm Period ({{ networks.moonbase.governance.tracks.general_admin.min_enactment_period.blocks }} blocks, approximately {{ networks.moonbase.governance.tracks.general_admin.min_enactment_period.time }}), the referendum is approved
 - 如果批准和支持在确认期达到数量要求（{{ networks.moonbase.governance.tracks.general_admin.min_enactment_period.blocks }}区块，约为{{ networks.moonbase.governance.tracks.general_admin.min_enactment_period.time }}天），则公投会被批准
 - If the Approval and Support thresholds are not met during the Decision Period, the proposal is rejected. Note that the thresholds need to be met for the duration of the Confirm Period. Consequently, if they are met but the Decision Period expires before the completion of the Confirm Period, the proposal is rejected
 - 如果在决定期未达到批准和支持数量要求，则该提案将被拒绝。请注意，必须在确认期达到此数值。 因此，如果该提案满足要求但在确认期完成之前决定期已经到期，则该提案将被拒绝

In the following image, you'll notice enough Approval and Support have been received and so the Confirm Period is underway. if the referendum maintains the Approval and Support levels, at block 124,962 the Confirm Period will end and then the Enactment Period will begin. You can hover over the charts to find out more information on each of these periods. Assuming this referendum maintains the levels of Approval and Support it has received, the Enactment Period will end at block 132,262 and the proposal action will be dispatched.

如下图所示，批准和支持数量已达到要求，则将进入确认期。如果公投维持批准和支持的水平，则在区块124,962确认期将结束，随之开始生效等待期。您可以将鼠标停留在图表上获取每个时期的更多信息。假设本次公投将维持在获得批准和支持的水平，生效等待期将在区块132,262结束，提案将被执行。

![View the Approval and Support curves for a referendum on Polkadot.js Apps.](/images/tokens/governance/voting/v2/vote-6.png)

If the referendum doesn't continuously receive enough Approval and Support during the Confirm Period, and there is time left in the Decide Period, it still has a chance to pass as long as the Approval and Support requirements are met again and continously for the duration of the Confirm Period. If the Decide Period ends and the referendum still hasn't received enough Approval and Support, the referenda will be rejected and the Decision Deposit is able to be refunded.

如果公投未在确认期持续获得足够的批准和支持，在决定期还剩下时间的情况下，只要公投在确认期再次持续获得足够的批准和支持则有机会通过。如果决定期结束，公投未获得足够的批准和支持，则将被拒绝，决定保证金将被退还。

The Enactment Period is defined by the author of the proposal at the time it was initially submitted, but it needs to be at least the minimum Enacment Period. 

生效等待期由提案的作者在最初提交时设置，但至少需要是最短生效等待期。

### Delegate Voting 委托投票 {: #delegate-voting } 

Token holders have the option to delegate their vote to another account whose opinion they trust. The account being delegated does not need to make any particular action. When they vote, the vote weight (that is, tokens times the Conviction multiplier chose by the delegator) is added to its vote. 

Token持有者可以选择将投票权委托给其它信任的账户。受委托的账户不需要进行额外的操作。在受委托账户进行投票时，委托账户的投票权重（委托者锁定的Token数量乘以委托者选择的信念乘数）会直接加到受委托账户的权重中。

With the introduction of OpenGov (Governance v2), token holders can even delegate their vote on a Track-by-Track basis and specify different delegates for each Track, which is referred to as Multirole Delegation.

随着OpenGov（Governance v2）的推出，Token持有者甚至可以根据Track进行投票，并为每个Track指定不同的委托，其称为多角色委托（Multirole Delegation）。

From the [referenda page on Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/referenda){target=_blank}, you can click **Delegate** to get started.

前往[Polkadot.js Apps的公投页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/referenda){target=_blank}，点击**Delegate**开始操作。

![To submit a delegate vote on a referendum, click on the "Delegate" button on Polkadot.js Apps.](/images/tokens/governance/voting/v2/vote-7.png)

Then you can take the following steps to fill in the details of the delegation:

然后，请执行以下步骤填写委托的详细信息：

1. Enter the **delegate from account**, which should be the account that you wish to delegate your vote from

   在**delegate from account**输入希望委托的账户

2. Select the **submission track** or switch the **apply delegation to all tracks** slider to on if you want the other account to vote on your behalf on any of the Tracks

   在**submission track**选择提交的Track类型，或者打开**apply delegation to all tracks**按钮允许其他账户代表您在任何Track上投票

3. Enter the **delegated vote value**

   在**delegated vote value**输入委托的数值

4. Set the vote conviction, which determines the weight of your vote (`vote_weight = tokens * conviction_multiplier`). Please refer to the [Conviction Multiplier](/learn/features/governance/#conviction-multiplier){target=_blank} docs for more information

   设置投票的信念值，即决定投票权重（`vote_weight = tokens * conviction_multiplier`）。请参考[信念乘数](/learn/features/governance/#conviction-multiplier){target=_blank}文档获取更多信息

5. Click **Next**

   点击**Next**

6. On the next screen, select the **delegate to address**, which should be the account that you wish to delegate your vote to

   在下一个页面，在**delegate to address**选择希望用于接收委托为地址，即您想要将投票委托给的账户

7. Click **Delegate** and sign the transaction

   点击**Delegate**并签署交易

![Submit a delegate vote on a referendum by filling in all of the delegation details and clicking on the "Delegate" button on Polkadot.js Apps.](/images/tokens/governance/voting/v2/vote-8.png)

Now the account you selected to delegate your vote to will be able to vote on your behalf. Once this account votes, the total vote weight delegated will be allocated to the option that the account selected. For this example, Baltahar can vote in favor of a referendum with a total weight of 20000 (10000 tokens with an x2 Conviction factor) using the vote weight that Charleth delegated to him.

现在您选择委托投票的帐户将能够代表您进行投票。 一旦该账户投票，委托的总投票权重将分配给该账户选择的选项。 在本示例中，Baltahar可以使用Charleth委托的20000的投票权重（10000枚Token乘以信念值2）对公投进行投票。

You can continue the above process for each Track and delegate a different account with varying vote weights.

您可以为每个Track持续上述流程，并委托给有不同投票权重的不同账户。

To undelegate a delegation, you'll need to head to the **Developer** tab and click on **Extrinsics**. From there, you can take the following steps:

要取消委托，您需要前往**Developer**标签，并点击**Extrinsics**。然后，请执行以下步骤：

1. Select the account you have delegate from

   选择您委托的账户

2. Choose the **convictionVoting** pallet and the **undelegate** extrinsic

   选择**convictionVoting** pallet和**undelegate** extrinsic

3. Enter the **class** of the Origin. For the General Admin Track, it is `2`. For the complete list of Track IDs, you can refer to the [OpenGov section of the governance overview page](/learn/features/governance/#general-parameters-by-track){target=_blank}

   输入Origin的**class**。在本示例中，General Admin Track的级别为`2`。要获取完整的Track ID列表，请参考[治理概览页面的OpenGov部分](/learn/features/governance/#general-parameters-by-track){target=_blank}

4. Click **Submit transaction** and sign the transaction

   点击**Submit transaction**并签署交易

![Undelegate a vote on Polkadot.js Apps.](/images/tokens/governance/voting/v2/vote-9.png)

### Refunding the Decision Deposit 退还决定保证金 {: #refund-the-decision-deposit }

If a referendum has been approved or rejected, the Decision Deposit will be eligible to be refunded, as long as it was not rejected due to it being a malicious proposal. Malicious proposals will result in the Decision Deposit being slashed. Any token holder can trigger the refund of the deposit back to the original account that placed the deposit. To refund the deposit, you can take the following steps on the [referenda page on Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/referenda){target=_blank}. If the referendum is eligible and the deposit hasn't already been refunded, you'll see a **Refund deposit** button. So, you can go ahead and click that button to get started.

如果公投被批准或拒绝，只要不是因为恶意提案被拒绝，则决定保证金将有资格被退还。恶意提案将导致保证金被没收。任何Token持有者可以触发保证金退还提交保证金的原始账户。要退还保证金，您可以在[Polkadot.js Apps的公投页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/referenda){target=_blank}执行操作。如果公投符合条件且保证金尚未退还，您将看到**Refund deposit**的按钮。点击此按钮开始操作。

![Get started refunding a Decision Deposit from a passed referendum on Polkadot.js Apps.](/images/tokens/governance/voting/v2/vote-10.png)

Then to submit the refund transaction, you can:

然后，请执行以下步骤：

1. Choose the account you want to trigger the refund. This does not need to be the account that initially placed the deposit

   选择您想要接收退还保证金的账户。此账户需为初始提交保证金的账户

2. Click **Refund deposit** and sign the transaction

   点击**Refund deposit**并签署交易

![Refund the Decision Deposit on Polkadot.js Apps.](/images/tokens/governance/voting/v2/vote-11.png)

### Unlocking Locked Tokens 解锁Token {: #unlocking-locked-tokens } 

When token holders vote, the tokens used are locked and cannot be transferred. You can verify if you have any locked tokens in the **Accounts** tab by expanding the address's account details. There, you will see different types of balances. If you have any tokens locked in referenda, you'll see **referenda** listed in your balance details and can hover over it to find out details about which referendum your tokens are locked for. Different lock statuses include:

Token持有者在投票时，使用的Token将被锁定且不能进行转移。您可以在**Accounts**标签下展开账户详情查看Token锁定情况。在详情中可以看到不同的余额类型。如果您的Token锁定在公投中，您将在余额详情中看到**referenda**。其中不同的锁定状态有：

 - Locked because of an ongoing referendum, meaning that you've used your tokens and have to wait until the referendum finishes, even if you've voted with a no-lock Conviction factor
 - 因公投进行中而锁定，意味着您已经使用了Token，即使您并没有选择信念乘数锁定，也必须等到公投结束才能解锁
 - Locked because of the Conviction multiplier selected, displaying the number of blocks and time left
 - 根据信念乘数进行锁定，会显示剩余区块数量和时间
 - Lock expired, meaning that you can now get your tokens back
 - 锁定期结束，意味着您可以解锁并取回Token

![View locked balances on the account page of Polkadot.js Apps.](/images/tokens/governance/voting/v2/vote-12.png)

Once the lock is expired, you can request your tokens back. To do so, navigate to the **Extrinsics** menu under the **Developers** tab. Here, two different extrinsics need to be sent. First, you need to provide the following information:

锁定期结束即可取回Token。请在**Developers**标签下的**Extrinsics**菜单中进行操作。在此，我们需要发送两个不同的extrinsics。首先需要提供以下信息：

 1. Select the account from which you want to recover your tokens

    选择取回Token的存放账户

 2. Choose the pallet you want to interact with. In this case, it is the `convictionVoting` pallet and the extrinsic to use for the transaction. This will determine the fields that you need to fill in the following steps. In this case, it is `removeVote` extrinsic. This step is necessary to unlock the tokens. This extrinsic can be used as well to remove your vote from a referendum

    选择您想要交互的pallet（在本示例中为`convictionVoting` pallet），以及交易使用的extrinsic。这将决定接下来的步骤中要填写的内容。在本示例中为`removeVote` extrinsic。这是解锁Token的必要步骤。通过这一操作也可以移除您在公投中已投下的票数

 3. Optionally, you can specify the Track ID to remove votes for. To do so, simply toggle the **include option** slider and enter in the Track ID in the **class u16** field

    或者，您可以指定要移除投票的Track ID。 为此，只需将**include option**滑块关闭并在**class u16**字段中输入Track ID

 4. Enter the referendum index. This is the number that appeared on the left-hand side in the **Referenda** tab

    输入公投指数。这是**Democracy**标签左侧显示的数字。

 5. Click the **Submit Transaction** button and sign the transaction

    点击**Submit Transaction**按钮并签署交易

![Submit an extrinsic to remove your vote on a referendum in Polkadot.js Apps.](/images/tokens/governance/voting/v2/vote-13.png)

For the next extrinsic, you need to provide the following information:

下一个extrinsic，您需要提供以下信息：

 1. Select the account from which you want to recover your tokens

    选择取回Token的存放账户

 2. Choose the pallet you want to interact with. In this case, it is the `convictionVoting` pallet

    选择您想要交互的pallet。在本示例中为`convictionVoting` pallet

 3. Choose the extrinsic method to use for the transaction. This will determine the fields that need to fill in the following steps. In this case, it is `unlock` extrinsic

    选择交易使用的extrinsic函数。这将决定接下来的步骤中要填写的内容。在本示例中为`unlock` extrinsic

 4. Enter the Track ID to remove the voting lock for

    输入Track ID以解锁投票

 5. Enter the target account that will receive the unlocked tokens. In this case, the tokens will be returned to Alice

    输入接收解锁Token的目标账户。在本示例中为Alice

 6. Click the **Submit Transaction** button and sign the transaction

    点击**Submit Transaction**按钮并签署交易

![Submit an extrinsic to unlock your tokens that were locked in referenda in Polkadot.js Apps.](/images/tokens/governance/voting/v2/vote-14.png)

Once the transaction goes through, the locked tokens should be unlocked. To double-check, you can go back to the **Accounts** tab and see that your full balance is now **transferable**.

交易完成后，锁定的Token将被解锁。您可以返回到**Accounts**标签进行检查，并可以看到余额状态显示为**transferable**。