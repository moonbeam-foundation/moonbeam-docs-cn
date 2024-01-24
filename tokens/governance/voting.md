---
title: 如何在OpenGov对提案进行投票
description: 通过本教程学习如何使用投票以及锁定Token以支持或拒绝在Moonbeam上Governance v2 (OpenGov)中进行公投的提案。
---

# 如何在OpenGov（Governance v2）中对提案进行投票

## 概览 {: #introduction }

公投是简单的、包容的和基于质押的投票方案。每一次公投都有一个与之相关的具体的提议。在OpenGov中，每个公投都有一个指定的Origin级别来执行提案，并且每个Origin都有一个自己的Track，用于处理提案。尽管公投是通过共同过程完成的，但批准的要求是特定于Track的。

Token持有者可以使用持有的Token进行投票。影响投票权重的因素有两个：Token锁定量和锁定期（称为“信念值”）。这可以从经济利益上确保不会出现兜售投票权的现象。因此，锁定期越长，投票权重越高。用户也可以选择不锁定Token，但投票权重会大大下降。

在Moonbeam，用户可以使用其H160地址和私钥（也就是以太坊账户）来创建提案、附议提案和投票提案。

本教程将分步概述如何在Moonbeam的OpenGov（Governance v2）对公投进行投票。此教程将展示如何在Moonbase Alpha上进行投票，这也同样适用于Moonbeam或Moonriver。

!!! 注意事项
    本教程将介绍如何在技术层面上投票的机制。Token持有者可以使用[Polkassembly](https://moonbeam.network/tutorial/participate-in-moonbeam-governance-with-polkassembly/){target=_blank}等用户友好性界面的平台进行投票。

## 定义 {: #definitions }

本教程中重要参数定义如下：

--8<-- 'text/learn/features/governance/vote-conviction-definitions.md'

 - **最大投票数** — 每个账户的最大并发投票数

    === "Moonbeam"

        ```text
        {{ networks.moonbeam.governance.max_votes }} votes
        ```

    === "Moonriver"

        ```text
        {{ networks.moonriver.governance.max_votes }} votes
        ```

    === "Moonbase Alpha"

        ```text
        {{ networks.moonbase.governance.max_votes }} votes
        ```

--8<-- 'text/learn/features/governance/approval-support-definitions.md'

--8<-- 'text/learn/features/governance/lead-in-definitions.md'

 - **决定期** — Token持有者继续在公投上进行投票。如果公投在期限结束时未通过，则提案会被拒绝，决定保证金将被退还
 - **确认期** — 决定期内的一段时间，在此期间公投需要获得足够的批准和支持数量才能进入生效等待期
 - **生效等待期** — 一段指定的时间，它是在提案创建时定义的，是已批准的公投在发送之前的等待时间。每个Track有一个最短等待期限

--8<-- 'text/learn/features/governance/delegation-definitions.md'

关于Track的特定参数更多信息，例如决定期、确认期、生效等待期、批准和支持要求等，请参考[治理概览的OpenGov（Governance V2）的治理参数部分](/learn/features/governance/#governance-parameters-v2){target=_blank}。

## 提案步骤 {: #roadmap-of-a-proposal }

本教程将涵盖如何对公投进行投票，如下面提案路线图中突出显示的步骤所示。您将了解如何对公投进行投票以及提案如何在带入期、决定期、确认期和生效等待期展开进展。

您可以在[治理概览页面的OpenGov提案步骤](/learn/features/governance/#roadmap-of-a-proposal-v2){target=_blank}部分找到详细的解释。

![Proposal Roadmap](/images/tokens/governance/voting/proposal-roadmap.webp)

## 论坛讨论 {: #forum-discussion}

民主公投的投票是一个二元结果。然而，Token持有者的意见往往不只是赞成/反对。因此建议您先在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}上发布有关提案详情的帖子。

Moonbeam社区论坛的关键作用是为社区提供讨论并允许提议者在链上行动之前接收来自社区反馈的平台。正如[使用Moonbeam社区论坛](https://moonbeam.network/blog/using-moonbeam-community-forum/){target=_blank}的教程中所述，在论坛上创建帖子非常简单且快速。每个提案类型都有对应的类别，包括治理、财政库和grant提案。此步骤可选择操作，但是解释提案的详情并且跟进提出的任何问题可能会增加社区赞成和提案通过的可能性。

![Moonbeam's Community Forum home](/images/tokens/governance/voting/vote-1.webp)

## 参与公投 {: #voting-on-a-referendum }

此部分将介绍Moonbase Alpha上OpenGov（Governance v2）公投的投票流程。操作步骤也同样适用于Moonbeam或Moonriver。本教程使用已经创建的公投进行讲解，如果您想要参与目前已开放的公投， 您也可以同样使用这些步骤进行投票。

要在网络中对提案进行投票，您需要使用Polkadot.js Apps界面。为此，您需要先导入以太坊格式的地址（H160地址），您可以通过[创建或导入H160账户](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank}教程完成此步骤。在本示例中，我们导入了三个账户，并分别命名为Alice、Bob和Charlie。

![Accounts in Polkadot.js](/images/tokens/governance/proposals/proposals-3.webp)

在Moonbeam上对提案进行投票非常简单。前往[Moonbase Alpha的Polkadot.js Apps界面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network){target=_blank}，所有治理相关功能都在**Governance**标签下。在**Governance**下拉菜单中选择**Referenda**，您可以看到所有的公投。在**Referenda**页面，您可以看到每个Track的公投列表。要查看特定公投的详情，请点击描述旁边的箭头。提案和描述旁边的数字称为公投编号。

### 如何通过贡献决定保证金支持提案 {: #submit-decision-deposit }

要将公投从带入期进入到决定期，必须提交决定保证金。保证金可以由提案的作者或者任何Token持有者支付。保证金的金额取决于提案的Track类别。

举例来说，在General Admin Track中的公投需要在Moonbase Alpha上有{{ networks.moonbase.governance.tracks.general_admin.decision_deposit }}的决定保证金。

从[Polkadot.js Apps的公投列表](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/referenda){target=_blank}中可以发现，有些提案已经处于**Preparing**状态。如果提交公投需要一笔决定保证金，您会看到**Decision deposit**的按钮。要提交保证金，您可以点击按钮进行操作。

![To start to submit a Decision Deposit for a referendum, click on the "Decision deposit" button on Polkadot.js Apps.](/images/tokens/governance/voting/vote-2.webp)

然后，请执行以下操作从指定账户提交保证金：

1. 在**deposit from account**选择想要用户充值保证金的账户，此账户无需是提案的作者，可以是任何Token持有者的账户。但是如果提案被检测为恶意提案，则决定保证金将被销毁。因此，在提交保证金之前请尽职调查，确保提案不是恶意操作
2. **referendum id**和**decision deposit**字段将会根据公投及其所属的Track自动填充
3. 点击**Place deposit**按钮并签署交易

![To submit the Decision Deposit, choose the account to place the deposit and click on the "Place deposit" button on Polkadot.js Apps.](/images/tokens/governance/voting/vote-3.webp)

成功提交保证金后，Polkadot.js Apps将会更新并显示支付保证金的账户信息及其金额。现在公投离满足带入期的标准又近了一步。

如果准备期已过，并且在General Admin Track中有足够的空间进行公投，则该提案将进入决定期。

### 如何投票 {: #how-to-vote }

您可能已经注意到，带入期无需投票。但是在决定期是必要步骤。此部分中的操作步骤适用于带入期和决定期的公投。

要投票和锁定Token以支持或反对公投，您可以通过点击要投票的公投旁边的**Vote**按钮开始。

![To vote on a referendum, click on the "Vote" button on Polkadot.js Apps.](/images/tokens/governance/voting/vote-4.webp)

然后，请执行以下步骤填写投票的详细信息：

1. 在**vote with account**选择想要投票的账户
2. 选择公投投票的形式。您可以选择**Aye**支持公投，或者选择**Nay**反对公投，如果您想要分别设置赞成票和反对票，则可以选择**Split**
3. 输入投票的数值
4. 设置投票的信念值，即决定投票权重（`vote_weight = tokens * conviction_multiplier`）。请参考[信念乘数](/learn/features/governance/#conviction-multiplier){target=_blank}文档获取更多信息
5. 点击**Vote**并签署交易

![To submit a vote on a referendum, fill out the details of the vote and click on the "Vote" button on Polkadot.js Apps.](/images/tokens/governance/voting/vote-5.webp)

!!! 注意事项
    上图显示的锁定期仅供参考，因其可能会发生变化。

要查看您的投票以及所有其他投票如何影响公投的批准和支持曲线，您可以点击**Vote**按钮旁边的箭头。此处，您会看到两个图表，分别为批准曲线和支持曲线。如果您将鼠标放在图表上，您可以看到特定区块所需的最低批准数/支持数以及当前的批准数/支持数。

![View the Approval and Support curves for a referendum on Polkadot.js Apps.](/images/tokens/governance/voting/vote-6.webp)

在Moonbase Alpha上的General Admin Track提交的提案将具有以下特征：

 - 批准曲线从第{{ networks.moonbase.governance.tracks.general_admin.min_approval.time0 }}天的{{ networks.moonbase.governance.tracks.general_admin.min_approval.percent0 }}%开始，在第{{ networks.moonbase.governance.tracks.general_admin.min_approval.time1 }}天达到{{ networks.moonbase.governance.tracks.general_admin.min_approval.percent1 }}%
 - 支持曲线从第{{ networks.moonbase.governance.tracks.general_admin.min_support.time0 }}天的{{ networks.moonbase.governance.tracks.general_admin.min_support.percent0 }}%开始，在第{{ networks.moonbase.governance.tracks.general_admin.min_support.time1 }}天达到{{ networks.moonbase.governance.tracks.general_admin.min_support.percent1 }}%
 - 公投以0%的“赞成”票开始决定期（带入期不开放投票）
 - Token持有者开始投票并在第{{ networks.moonbase.governance.tracks.general_admin.min_approval.time1 }}天将批准率增加到{{ networks.moonbase.governance.tracks.general_admin.min_approval.percent1 }}%
 - 如果批准和支持在确认期达到数量要求（{{ networks.moonbase.governance.tracks.general_admin.confirm_period.blocks }}区块，约为{{ networks.moonbase.governance.tracks.general_admin.confirm_period.time }}天），则公投会被批准
 - 如果在决定期未达到批准和支持数量要求，则该提案将被拒绝。请注意，必须在确认期达到此数值。 因此，如果该提案满足要求但在确认期完成之前决定期已经到期，则该提案将被拒绝

如下图所示，批准和支持数量已达到要求，则将进入确认期。如果公投维持批准和支持的水平，则在区块124,962确认期将结束，随之开始生效等待期。您可以将鼠标停留在图表上获取每个时期的更多信息。假设本次公投将维持在获得批准和支持的水平，生效等待期将在区块132,262结束，提案将被执行。

![View the Approval and Support curves for a referendum on Polkadot.js Apps.](/images/tokens/governance/voting/vote-7.webp)

如果公投未在确认期持续获得足够的批准和支持，在决定期还剩下时间的情况下，只要公投在确认期再次持续获得足够的批准和支持则有机会通过。如果公投进入确认期，但决定期设置为在确认期结束前结束，则决定期实际上将延长至确认期结束。如果决定期结束，公投未获得足够的批准和支持，则将被拒绝，决定保证金将被退还。

生效等待期由提案的作者在最初提交时设置，但至少需要是最短生效等待期。

### 委托投票 {: #delegate-voting }

Token持有者可以选择将投票权委托给其它信任的账户。受委托的账户不需要进行额外的操作。在受委托账户进行投票时，委托账户的投票权重（委托者锁定的Token数量乘以委托者选择的信念乘数）会直接加到受委托账户的投票中。

随着OpenGov（Governance v2）的推出，Token持有者甚至可以根据Track委托他们的投票，并为每个Track指定不同的委托，其称为多角色委托（Multirole Delegation）。

前往[Polkadot.js Apps的公投页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/referenda){target=_blank}，点击**Delegate**开始操作。

![To submit a delegate vote on a referendum, click on the "Delegate" button on Polkadot.js Apps.](/images/tokens/governance/voting/vote-8.webp)

然后，请执行以下步骤填写委托的详细信息：

1. 在**delegate from account**输入希望委托的账户
2. 在**submission track**选择提交的Track类型，或者打开**apply delegation to all tracks**按钮允许其他账户代表您在任何Track上投票
3. 在**delegated vote value**输入委托的数值
4. 设置投票的信念值，即决定投票权重（`vote_weight = tokens * conviction_multiplier`）。请参考[信念乘数](/learn/features/governance/#conviction-multiplier){target=_blank}文档获取更多信息
5. 点击**Next**
6. 在下一个页面，在**delegate to address**选择您想要将投票委托给的账户
7. 点击**Delegate**并签署交易

![Submit a delegate vote on a referendum by filling in all of the delegation details and clicking on the "Delegate" button on Polkadot.js Apps.](/images/tokens/governance/voting/vote-9.webp)

现在您选择接收委托投票的帐户将能够代表您进行投票。 一旦该账户投票，委托的总投票权重将分配给该账户选择的选项。 在本示例中，Baltahar可以使用Charleth委托的20000的投票权重（10000枚Token乘以信念值2）对公投进行投票。

您可以为每个Track继续上述流程，并委托给不同账户不同的投票权重。

要取消委托，您需要前往**Developer**标签，并点击**Extrinsics**。然后，请执行以下步骤：

1. 选择您委托的账户
2. 选择**convictionVoting** pallet和**undelegate** extrinsic
3. 在**class**输入Origin的值。在本示例中是General Admin Track级别，值为`2`。要获取完整的Track ID列表，请参考[治理概览页面的OpenGov部分](/learn/features/governance/#general-parameters-by-track){target=_blank}
4. 点击**Submit transaction**并签署交易

![Undelegate a vote on Polkadot.js Apps.](/images/tokens/governance/voting/vote-10.webp)

### 退还决定保证金 {: #refund-the-decision-deposit }

如果公投被批准或拒绝，只要不是因为恶意提案被拒绝，则决定保证金将有资格被退还。恶意提案将导致保证金被没收。任何Token持有者可以触发保证金退还提交保证金的原始账户。要退还保证金，您可以在[Polkadot.js Apps的公投页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/referenda){target=_blank}执行以下操作。如果公投符合条件且保证金尚未退还，您将看到**Refund deposit**的按钮。点击此按钮开始操作。

![Get started refunding a Decision Deposit from a passed referendum on Polkadot.js Apps.](/images/tokens/governance/voting/vote-11.webp)

提交退款交易，请执行以下步骤：

1. 选择您要触发退款的帐户。此账户不需要为初始提交保证金的账户
2. 点击**Refund deposit**并签署交易

![Refund the Decision Deposit on Polkadot.js Apps.](/images/tokens/governance/voting/vote-12.webp)

### 解锁Token {: #unlocking-locked-tokens }

Token持有者在投票时，使用的Token将被锁定且不能进行转移。您可以在**Accounts**标签下展开账户详情查看Token锁定情况。在详情中可以看到不同的余额类型。如果您的Token锁定在公投中，您将在余额详情中看到**referenda**，可以将鼠标放在它上面以了解有关您的token被锁定的公投的详细信息。其中不同的锁定状态有：

 - 因公投进行中而锁定，意味着您已经使用了Token，即使您并没有选择信念乘数锁定，也必须等到公投结束才能解锁
 - 根据信念乘数进行锁定，会显示剩余区块数量和时间
 - 锁定期结束，意味着您可以解锁并取回Token

![View locked balances on the account page of Polkadot.js Apps.](/images/tokens/governance/voting/vote-13.webp)

锁定期结束即可取回Token。请在**Developers**标签下的**Extrinsics**菜单中进行操作。在此，我们需要发送两个不同的extrinsics。首先需要提供以下信息：

 1. 选择取回Token的存放账户
 2. 选择您想要交互的pallet（在本示例中为`convictionVoting` pallet），以及交易使用的extrinsic。这将决定接下来的步骤中要填写的内容。在本示例中为`removeVote` extrinsic。这是解锁Token的必要步骤。通过这一操作也可以移除您在公投中已投下的票数
 3. 或者，您可以指定要移除投票的Track ID。 为此，只需切换**include option**滑块并在**class u16**字段中输入Track ID
 4. 输入公投编号。这是**Referenda**标签里左侧显示的数字。
 5. 点击**Submit Transaction**按钮并签署交易

![Submit an extrinsic to remove your vote on a referendum in Polkadot.js Apps.](/images/tokens/governance/voting/vote-14.webp)

下一个extrinsic，您需要提供以下信息：

 1. 选择取回Token的存放账户
 2. 选择您想要交互的pallet。在本示例中为`convictionVoting` pallet
 3. 选择交易使用的extrinsic函数。这将决定接下来的步骤中要填写的内容。在本示例中为`unlock` extrinsic
 4. 输入Track ID以解锁投票
 5. 输入接收解锁Token的目标账户。在本示例中为Alice
 6. 点击**Submit Transaction**按钮并签署交易

![Submit an extrinsic to unlock your tokens that were locked in referenda in Polkadot.js Apps.](/images/tokens/governance/voting/vote-15.webp)

交易完成后，锁定的Token将被解锁。您可以返回到**Accounts**标签进行检查，并可以看到余额状态显示为**transferable**。
