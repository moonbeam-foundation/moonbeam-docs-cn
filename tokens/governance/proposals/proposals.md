---
title: How to Propose an Action 如何发起提案
description: Learn about the roadmap of a proposal and how to propose an action, send it to be voted on, and second a proposal on Moonbeam via Governance v1 features.
了解提案的流程，以及如何发起提案、开放投票，并通过Governance v1功能在moonbeam上附议提案。
---

# How to Propose an Action in Governance v1 如何在Governance v1发起提案

![Governance Moonbeam Banner](/images/tokens/governance/proposals/governance-proposal-banner.png)

## Introduction 概览 {: #introduction } 

A proposal is a submission to the chain in which a token holder suggests for an action to be enacted by the system. Proposals are one of the core elements of the governance system because they are the main tool for stakeholders to propose actions/changes, which other stakeholders then vote on.

提案是指Token持有者在链上提出建议并由系统生效。提案是治理系统的核心要素之一，因为这是参与者能够提出建议/更改的主要工具，随后参与者可以对其进行投票。

In Moonbeam, users will be able to create, second, and vote on proposals using their H160 address and private key, that is, their regular Ethereum account!

在Moonbeam，用户可以使用其H160地址和私钥（也就是以太坊账户）来创建提案、附议提案和投票提案。

Moonbeam's governance system is in the process of getting revamped! This next phase of governance is known as OpenGov or Governance v2. During the roll-out process, OpenGov will be rigorously tested on Moonriver before a proposal will be made to deploy it on Moonbeam. Until it launches on Moonbeam, Moonbeam will continue to use Governance v1. As such, **this guide is for proposals on Moonbeam only**. If you're looking to submit a proposal on Moonriver, you can refer to the [How to Propose an Action in OpenGov](/tokens/governance/proposals/opengov-proposals){target=_blank} guide.

Moonbeam的治理系统正在更新中。下一个阶段的治理称为OpenGov。在推出过程中，OpenGov将在Moonriver上经过严格测试，然后再通过提案部署至Moonbeam。在正式上线Moonbeam之前，Moonbeam将继续使用Governance v1。因此，**本教程仅适用于Moonbeam上的提案**。如果想要对Moonriver或Moonbase Alpha上的提案进行投票，请参考[如何在OpenGov对提案进行投票](/tokens/governance/proposals/opengov-proposals){target=_blank}的教程。

This guide outlines the process of how to create a proposal in Governance v1 on Moonbeam. The steps will go from its creation until it reaches public referenda. There is a separate guide on [How to Vote on a Proposal](/tokens/governance/voting/voting){target=_blank} in Governance v1. 

本教程将概述如何在Moonbeam的Governance v1创建提案，操作步骤将从创建到公投。关于如何在Governance v1[对提案进行投票](/tokens/governance/voting/voting){target=_blank}有单独的教程。

For more information on Moonbeam's governance system, including Governance v1 and OpenGov (Governance v2), please refer to the [governance overview page](/learn/features/governance/){target=_blank}.

关于Moonbeam治理系统的更多信息，包括Governance v1和OpenGov（Governance v2），请参考[治理概览页面](/learn/features/governance/){target=_blank}。

## Definitions 定义 {: #definitions } 

Some of the key parameters for this guide are the following:

本教程中重要参数定义如下：

--8<-- 'text/governance/proposal-definitions.md'

 - **Second** - other stakeholders can second (approve) a proposal if they agree with it and want to help it reach public referenda. This requires matching the deposit of the original proposer
 - **附议** — 其他参与者可以附议（赞成）提案，帮助推进到公投阶段。附议人需要质押与提案者相同数量的Token

--8<-- 'text/governance/preimage-definitions.md'

 - **Proposal deposit** — minimum amount of tokens that the proposer needs to bond when submitting a proposal. Tokens might be locked for an indeterminate amount of time because it is unknown when a proposal may become a referendum (if ever). This is true for tokens bonded by both the proposer and users that second the proposal
 - **提案保证金** — 提交提案时提议者需要绑定的最少数量的Token。由于提案进入公投阶段所需时间不可预测（也有可能无法进入公投阶段），因此Token可能无限期锁定。这对于提议者和附议提案的用户所绑定的Token都是如此
 - **Launch Period** — how often new public referenda are launched
 - **启动期** — 两次公投之间的时间间隔
 - **Cool-off Period** — duration (in blocks) in which a proposal may not be re-submitted after being vetoed
 - **冷静期** —— 提案被否决后直至可以再次提交的持续时长（以区块数量计算）

=== "Moonbeam"
    |         Variable变量          |                                                          Value值                                                          |
    |:-------------------------:|:-----------------------------------------------------------------------------------------------------------------------:|
    |   Preimage base deposit 原像基础保证金   |                                   {{ networks.moonbeam.preimage.base_deposit }} GLMR                                    |
    | Preimage deposit per byte 每个字节的原像保证金 |                                   {{ networks.moonbeam.preimage.byte_deposit }} GLMR                                    |
    |     Proposal deposit 提案保证金      |                                   {{ networks.moonbeam.democracy.min_deposit }} GLMR                                    |
    |       Launch Period 启动期       | {{ networks.moonbeam.democracy.launch_period.blocks}}区块（{{ networks.moonbeam.democracy.launch_period.days}}天） |
    |      Cool-off Period 冷静期      |   {{ networks.moonbeam.democracy.cool_period.blocks}}区块（{{ networks.moonbeam.democracy.cool_period.days}}天）   |

## Roadmap of a Proposal 提案步骤 {: #roadmap-of-a-proposal } 

This guide will cover the first few steps outlined in the proposal roadmap, as highlighted in the diagram below. You'll learn how to submit your proposal idea to the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank}, submit a preimage, submit your proposal on-chain using the preimage hash, and finally how to second a proposal.

本教程将涵盖提案步骤图的前几个步骤，主要步骤如下方所示。您将学习如何提交提案想法至[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}、提交原像、使用原像哈希在链上提交提案，以及附议提案。

You can find a full explanation of the [happy path for a Governance v1 proposal on the Governance overview page](/learn/features/governance/#roadmap-of-a-proposal){target=_blank}.

您可以在[治理概览页面的Governance v1提案步骤](/learn/features/governance/#roadmap-of-a-proposal){target=_blank}部分找到详细的解释。

![Proposal Roadmap](/images/tokens/governance/proposals/proposal-roadmap.png)

--8<-- 'text/governance/submit-idea.md'

## Proposing an Action 发起提案 {: #proposing-an-action }

This section goes over the process of creating a proposal on Moonbeam with Governance v1, from submitting a preimage until it reaches public referenda.

此部分将介绍使用Governance v1在Moonbeam上创建提案的流程，操作步骤将从提交原像到公投。

!!! note 注意事项
    The images in this guide are shown on the Moonbase Alpha interface on Polkadot.js Apps, however these steps will need to be performed on [Moonbeam's Polkadot.js Apps interface](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network){target=_blank}.

本教程中出现的截图均显示在Polkadot.js Apps的Moonbase Alpha接口上，但是这些步骤需要在[Moonbeam的Polkadot.js Apps接口](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network){target=_blank}上执行。

To make a proposal in the network, you can use the Polkadot.js Apps interface. To do so, you need to import an Ethereum-style account first (H160 address), which you can do following the [Creating or Importing an H160 Account](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank} guide. For this example, three accounts were imported and named with super original names: Alice, Bob, and Charlie.

您需要用到Polkadot.js Apps接口发起提案。为此，您需要先导入以太坊格式账户（即H160地址），您也可以遵循[创建或导入H160账户](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank}教程完成此步骤。在这个示例中，我们导入了三个账户，并分别命名为Alice、Bob和Charlie。

![Accounts in Polkadot.js](/images/tokens/governance/proposals/proposals-3.png)

This proposal is to make permanent on-chain the remark "This is a unique string."

本次提案内容为：将备注文本"This is a unique string."永久上链。

### Submitting a Preimage of the Proposal 提交提案原像 {: #submitting-a-preimage-of-the-proposal } 

The first step is to submit a preimage of the proposal. This is because the storage cost of large preimages can be pretty hefty, as the preimage contains all the information regarding the proposal itself. With this configuration, one account with more funds can submit a preimage and another account can submit the proposal.

第一步是提交提案原像。这是因为大型原像包含关于提案本身的所有信息，储存成本很高。在这一设置下，资金较多的账户可以负责提交原像，另一个账户提交提案。

First, navigate to [Moonbeam's Polkadot.js Apps interface](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network){target=_blank}. Everything related to governance lives under the **Governance** tab, including preimages. So, from the **Governance** dropdown, you can select **Preimages**. Once there, click on the **Add preimage** button.

前往[Moonbeam的Polkadot.js Apps接口](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network){target=_blank}，所有治理相关操作均在**Governance**标签下，包括原像。在**Governance**下拉菜单中选择**Preimages**，然后点击**Add preimage**按钮。

![Add preimage in Polkadot.js](/images/tokens/governance/proposals/proposals-4.png)

Here, you need to provide the following information:

此处，您需要提供以下信息：

 1. Select the account from which you want to submit the preimage

    选择提交原像的账户

 2. Choose the pallet you want to interact with and the dispatchable function (or action) to propose. The action you choose will determine the fields that need to fill in the following steps. In this case, it is the `system` pallet and the `remark` function

    选择希望交互的pallet以及可调用的函数（或请求）进行提案。所选请求将决定接下来的步骤中要填写的内容。在本示例中，选择的是`democracy` pallet和`setBalance`函数

 3. Enter the text of the remark in either ascii or hexidecimal format prefixed with "0x". Ensure the remark is unique. "Hello World!" has already been proposed, and duplicate identical proposals will not be accepted. These remarks reside permanently on-chain so please don't enter sensitive information or profanity 

    以ascii或前缀为“0x”的十六进制格式输入备注文本。确保备注是唯一的。"Hello World!"已经提出，不接受重复的相同提案。这些提案将永久存在于链上，所以请不要输入敏感信息或亵渎

 4. Copy the preimage hash. This represents the proposal. You will use this hash when submitting the actual proposal

    复制原像哈希。这个数值代表着提案，在提交正式提案时会用到

 5. Click the **Submit preimage** button and sign the transaction

    点击**Submit preimage**按钮并签署交易

![Fill in the Preimage Information](/images/tokens/governance/proposals/proposals-5.png)

!!! note 注意事项
    Make sure you copy the preimage hash, as it is necessary to submit the proposal.

请确保复制原像哈希，在提交提案时必须用到这一数据。

Note that the storage cost of the preimage can be calculated as the base fee (per network) plus the fee per byte of the preimage being proposed. 

请注意，原像储存成本可以计算为（每个网络的）基本费用加上所提议的原像的每字节费用。

After the transaction is submitted, you will see some confirmations on the top right corner of the Polkadot.js Apps interface and the preimage will be added to the list of **preimages**.

交易提交后，您将在Polkadot.js Apps接口的右上角看到一些确认信息，原像将被添加到**preimages**列表当中。

### Submitting a Proposal 提交提案 {: #submitting-a-proposal } 

Once you have committed the preimage (check the previous section), the roadmap's next major milestone is to submit the proposal related to it. To do so, select **Democracy** from the **Governance** dropdown, and click on **Submit proposal**.

提交原像（查看上一部分）后，下一步就是提交与这一原像相关的提案。为此，需要在**Democracy**页面点击**Submit proposal**。

![Submit proposal](/images/tokens/governance/proposals/proposals-6.png)

Here, you need to provide the following information:

此处，您需要提供以下信息：

 1. Select the account from which you want to submit the proposal (in this case, Alice)

    选择提交提案的账户（在本示例中为Alice）

 2. Enter the preimage hash related to the proposal. In this example, it is the hash of the `remark` preimage from the previous section

    输入提案的原像哈希。在本示例中为上一部分操作得到的`remark`原像哈希

 3. Set the locked balance. This is the number of tokens the proposer bonds with his proposal. Remember that the proposal with the most amount of tokens locked goes to referendum. The minimum deposit is displayed just below this input tab

    设置锁定金额。数值应等于提议者锁定的保证金金额。只有锁定量最高的提案才会进入公投阶段。最低保证金显示在“Input”标签正下方

 4. Click the **Submit proposal** button and sign the transaction

    点击**Submit proposal**按钮并签署交易

![Fill in the Proposal Information](/images/tokens/governance/proposals/proposals-7.png)

!!! note 注意事项
    Tokens might be locked for an indeterminate amount of time because it is unknown when a proposal may become a referendum (if ever).

由于提案进入公投阶段所需时间不可预测（也有可能无法进入公投阶段），因此Token可能无限期锁定。

After the transaction is submitted, you will see some confirmations on the top right corner of the Polkadot.js Apps interface. You should also see the proposal listed in the **Proposals** section, displaying the proposer and the amounts of tokens locked, and it is now ready to be seconded!

交易提交后，您将在Polkadot.js Apps接口的右上角看到一些确认信息。该提案也会进入**Proposals**列表，并显示提案者和Token锁定量。现在，提案已开放接受附议！

If you login to [Polkassembly](https://moonbeam.polkassembly.network/){target=_blank} with the same account that you used to create the proposal, you'll be able to edit the description of the proposal to include a link to the proposal discussion on the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank}. This is a helpful step because while Polkassembly auto-generates a post for each proposal, it doesn't provide context information on the contents of the proposal. 

如果您用创建提案的同一个账户登陆[Polkassembly](https://moonbeam.polkassembly.network/){target=_blank}，您将能够编辑提案描述，添加在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}提案讨论的链接。该步骤必不可少，虽然Polkassembly会为每个提案自动生成一个帖子，但它不会提供有关提案的详细信息。

You’ll need to edit your proposal on the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank}. You will need to update the title to include the proposal ID, and the status will need to be changed to `Submitted` state.

您需要在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}编辑提案，标题需要包含提案ID，状态更新为`Submitted`。

## Seconding a Proposal 附议提案 {: #seconding-a-proposal } 

To second a proposal means that you agree with it and want to back it up with your tokens to help it reach public referenda. The amount of tokens to be locked is equal to the proposer's original deposit - no more, no less.

附议提案意味着您赞成提案内容，并想用Token支持该提案进入公投阶段。附议者锁定的Token量需与提案者锁定的完全相同。

!!! note 注意事项
    A single account can second a proposal multiple times. This is by design, as an account could just send tokens to different addresses and use them to second the proposal. What counts is the number of tokens backing up a proposal, not the number of vouches it has received.

一个账户可多次附议同一提案。这是原理上就存在的功能，因为一个账户可以发送Token到不同地址，并使用这些地址来附议提案。提案是否能进入公投阶段看的是Token锁定量，而不是地址数量。

This section outlines the steps to second the proposal made in the previous section. To do so, click the **Endorse** button that is located to the right of the respective proposal.

上一部分介绍了如何创建提案，这一部分则介绍了如何附议提案。在提案列表中选择想要赞成的提案并点击**Second**按钮即可。

![Proposal listed to Second](/images/tokens/governance/proposals/proposals-8.png)

Here, you need to provide the following information:

此处，您需要提供以下信息：

 1. Select the account you want to second the proposal with (in this case, Charlie)

    选择您希望用于附议提案的账户（在本示例中为Charlie）

 2. Verify the number of tokens required to second the proposal

    验证附议提案所需Token数量

 3. Click the **Endorse** button and sign the transaction

    点击**Endorse**按钮并签署交易

![Fill in Endorse Information](/images/tokens/governance/proposals/proposals-9.png)

!!! note 注意事项
    Tokens might be locked for an indeterminate amount of time because it is unknown when a proposal may become a referendum (if ever).

由于提案进入公投阶段所需时间不可预测（也有可能无法进入公投阶段），因此Token可能无限期锁定。

After the transaction is submitted, you will see some confirmations on the top right corner of the Polkadot.js Apps interface. You should also see the proposal listed in the **Proposals** section, displaying the proposer and the amounts of tokens locked and listing the users that have seconded this proposal!

交易提交后，您将在Polkadot.js Apps接口的右上角看到一些确认信息。该提案也会进入**Proposals**部分，并显示提案者和Token锁定量，以及附议提案的用户的列表。

![Proposal Endorsed](/images/tokens/governance/proposals/proposals-10.png)

At each Launch Period, the most seconded proposal becomes a referendum. To learn how to vote on a proposal, please refer to the [How to Vote on a Proposal in OpenGov](/tokens/governance/voting/voting){target=_blank} guide.

在每个启动期，附议最多的提案将进入公投。要了解如何对提案进行投票，请参考[如何在OpenGov对提案进行投票](/tokens/governance/voting/voting){target=_blank}教程。