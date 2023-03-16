---
title: How to Propose an Action in OpenGov 如何在OpenGov发起提案
description: Follow these step-by-step instructions to learn how to submit a Democracy proposal for other token holders to vote on in Governance v2 (OpenGov) on Moonbeam. 

---

# How to Propose an Action in OpenGov (Governance v2) 如何在OpenGov (Governance v2)发起提案

![Governance Moonbeam Banner](/images/tokens/governance/proposals/governance-proposal-banner.png)

## Introduction 概览 {: #introduction }

A proposal is a submission to the chain in which a token holder suggests for an action to be enacted by the system. Proposals are one of the core elements of the governance system because they are the main tool for community members to propose actions/changes, which other token holders then vote on. 

提案是指Token持有者在链上提出建议并由系统生效。提案是治理系统的核心要素之一，因为这是参与者能够提出建议/更改的主要工具，随后参与者可以对其进行投票。

In Moonbeam, users are able to create and vote on proposals using their H160 address and private key, that is, their regular Ethereum account!

在Moonbeam，用户可以使用其H160地址和私钥（也就是以太坊账户）来创建提案、附议提案和投票提案。

Moonbeam's governance system is in the process of getting revamped! This next phase of governance is known as OpenGov (Goverance v2). During the roll-out process, OpenGov will be rigorously tested on Moonriver before a proposal will be made to deploy it on Moonbeam. Until it launches on Moonbeam, Moonbeam will continue to use Governance v1. As such, **this guide is for proposals on Moonriver or Moonbase Alpha only**. If you're looking to submit a proposal on Moonbeam, you can refer to the [How to Propose an Action in Governance v1](/tokens/governance/proposals/proposals){target=_blank} guide.

Moonbeam的治理系统正在更新中。下一个阶段的治理称为OpenGov (Goverance v2)。在推出过程中，OpenGov将在Moonriver上经过严格测试，然后再通过提案部署至Moonbeam。在正式上线Moonbeam之前，Moonbeam将继续使用Governance v1。因此，**本教程仅适用于Moonriver或Moonbase Alpha上的提案**。如果想要对Moonbeam上的提案进行投票，请参考[如何在Governance v1对提案进行投票](/tokens/governance/proposals/proposals){target=_blank}的教程。

This guide will outline the process, with step-by-step instructions, of how to submit a proposal for other token holders to vote on in OpenGov (Governance v2). This guide will show you how to submit the proposal on Moonbase Alpha, but it can be easily adapted for Moonriver. There is a separate guide on [How to Vote on a Proposal in OpenGov](/tokens/governance/voting/opengov-voting){target=_blank}. 

本教程将概述如何在OpenGov (Governance v2)提交提案以便Token持有者投票。此教程将展示如何在Moonbase Alpha上提交提案，这也同样适用于Moonriver。关于如何[在OpenGov对提案进行投票](/tokens/governance/voting/opengov-voting){target=_blank}有单独的教程。

For more information on Moonbeam's governance system, including Governance v1 and OpenGov (Governance v2), please refer to the [governance overview page](/learn/features/governance/){target=_blank}.

关于Moonbeam治理系统的更多信息，包括Governance v1和OpenGov（Governance v2），请参考[治理概览页面](/learn/features/governance/){target=_blank}。

## Definitions 定义 {: #definitions } 

Some of the key parameters for this guide are the following:

本教程中重要参数定义如下：

--8<-- 'text/governance/proposal-definitions.md'

--8<-- 'text/governance/preimage-definitions.md'

 - **Submission Deposit** - the minimum deposit amount for submitting a public referendum proposal
 - **提交保证金** — 提交公投提案所需的最低保证金

--8<-- 'text/governance/lead-in-definitions.md'

Make sure you check the [Governance Parameters](/learn/features/governance/#governance-parameters-v2) for each network and track.

确保您查看每个网络和track的[治理参数](/learn/features/governance/#governance-parameters-v2)。

## Roadmap of a Proposal 提案步骤 {: #roadmap-of-a-proposal }

This guide will cover the first few steps outlined in the proposal roadmap, as highlighted in the diagram below. You'll learn how to submit your proposal idea to the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank}, submit a preimage, and submit your proposal on-chain using the preimage hash.

本教程将涵盖提案步骤图的前几个步骤，主要步骤如下方所示。您将学习如何提交提案想法至[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}、提交原像以及使用原像哈希在链上提交提案。

You can find a full explanation of the [happy path for a OpenGov (Governance v2) proposal on the Governance overview page](/learn/features/governance/#roadmap-of-a-proposal-v2){target=_blank}.

您可以在[治理概览页面的OpenGov (Governance v2)提案步骤](/learn/features/governance/#roadmap-of-a-proposal-v2){target=_blank}部分找到详细的解释。

![Proposal Roadmap](/images/tokens/governance/proposals/v2/proposal-roadmap.png)

--8<-- 'text/governance/submit-idea.md'

## Proposing an Action 发起提案 {: #proposing-an-action }

This section goes over the process of creating a proposal with OpenGov (Governance v2) on Moonbase Alpha. These steps can be adapted for Moonriver.

此部分将介绍使用OpenGov (Governance v2)在Moonbase Alpha上创建提案的流程。操作步骤也同样适用于Moonriver。

To make a proposal in the network, you can use the Polkadot.js Apps interface. To do so, you need to import an Ethereum-style account first (H160 address), which you can do following the [Creating or Importing an H160 Account](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank} guide. For this example, three accounts were imported and named with super original names: Alice, Bob, and Charlie.

您需要用到Polkadot.js Apps接口发起提案。为此，您需要先导入以太坊格式账户（即H160地址），您也可以遵循[创建或导入H160账户](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank}教程完成此步骤。在这个示例中，我们导入了三个账户，并分别命名为Alice、Bob和Charlie。

![Accounts in Polkadot.js](/images/tokens/governance/proposals/proposals-3.png)

For the proposal, you can choose anything you would like to propose, just make sure that you assign it to the right Origin and Track, so that it has the right privileges to execute the action. 

您可以选择任何想要发起提案的内容，请确保将其分配给正确的Origin和Track，以便其具有执行提案的正确权限。

For the purposes of this guide, the action will be to register a new [mintable XC-20](/builders/interoperability/xcm/xc20/mintable-xc20){target=_blank} using the General Admin Origin and Track. 

出于本教程的目的，需要为使用General Admin Origin和Track注册一个新的[可铸造的XC-20](/builders/interoperability/xcm/xc20/mintable-xc20){target=_blank}。

### Submitting a Preimage of the Proposal 提交提案原像 {: #submitting-a-preimage-of-the-proposal } 

The first step is to submit a preimage of the proposal. This is because the storage cost of large preimages can be pretty hefty, as the preimage contains all the information regarding the proposal itself. With this configuration, one account with more funds can submit a preimage and another account can submit the proposal.

第一步是提交提案原像。这是因为大型原像包含关于提案本身的所有信息，储存成本很高。在这一设置下，资金较多的账户可以负责提交原像，另一个账户提交提案。

First, navigate to [Moonbase Alpha's Polkadot.js Apps interface](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network){target=_blank}. Everything related to governance lives under the **Governance** tab, including preimages. So, from the **Governance** dropdown, you can select **Preimages**. Once there, click on the **Add preimage** button.

前往[Moonbase Alpha的Polkadot.js Apps接口](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network){target=_blank}，所有治理相关操作均在**Governance**标签下，包括原像。在**Governance**下拉菜单中选择**Preimages**，然后点击**Add preimage**按钮。

![Add preimage in Polkadot.js](/images/tokens/governance/proposals/proposals-4.png)

Here, you need to provide the following information:

此处，您需要提供以下信息：

 1. Select the account from which you want to submit the preimage

    选择提交原像的账户

 2. Choose the pallet you want to interact with and the dispatchable function (or action) to propose. The action you choose will determine the fields that need to fill in the following steps. In this case, it is the **assetManager** pallet and the **registerLocalAsset** extrinsic

    选择希望交互的pallet以及可调用的函数（或请求）进行提案。所选请求将决定接下来的步骤中要填写的内容。在本示例中为**assetManager** pallet和**registerLocalAsset** extrinsic

 3. Enter any additional fields required for the extrinsic to be dispatched. For this example, Alice is the **creator**, Bob is the **owner**, **isSufficient** is set to **No**, and the **minBalance** is **0**

    输入分配extrinsic所需的其他内容。在本示例中，Alice是**creator**，Bob是**owner**，**isSufficient**设置为**No**，以及**minBalance**设置为**0**

 4. Copy the preimage hash. This represents the proposal. You will use this hash when submitting the actual proposal

    复制原像哈希。这个数值代表着提案，在提交正式提案时会用到

 5. Click the **Submit preimage** button and sign the transaction

    点击**Submit preimage**按钮并签署交易

![Fill in the Preimage Information](/images/tokens/governance/proposals/v2/proposals-5.png)

!!! note 注意事项
    Make sure you copy the preimage hash, as it is necessary to submit the proposal.

请确保复制原像哈希，在提交提案时必须用到这一数据。

Note that the storage cost of the preimage can be calculated as the base fee (per network) plus the fee per byte of the preimage being proposed. 

请注意，原像储存成本可以计算为（每个网络的）基本费用加上所提议的原像的每字节费用。

After the transaction is submitted, you will see some confirmations on the top right corner of the Polkadot.js Apps interface and the preimage will be added to the list of **preimages**.

交易提交后，您将在Polkadot.js Apps接口的右上角看到一些确认信息，原像将被添加到**preimages**列表当中。

### Submitting a Proposal 提交提案 {: #submitting-a-proposal-v2 } 

Once you have committed the preimage (check the previous section), the roadmap's next major milestone is to submit the proposal related to it. To do so, select **Referenda** from the **Governance** dropdown, and click on **Submit proposal**.

提交原像（查看上一部分）后，下一步就是提交与这一原像相关的提案。为此，需要在**Governance**下拉菜单中选择**Referenda**，并点击**Submit proposal**。

In order to submit a proposal, you'll need to choose which Origin class you want your proposal to be executed with. **Choosing the wrong Track/Origin might result in your proposal failing at execution**. For more information on each Origin class, please refer to the [Governance v2 section of the governance overview page](/learn/features/governance/#general-definitions-gov2){target=_blank}.

要提交提案，您将需要选择您希望提案执行的Origin级别。**选择错误的Track/Origin会导致提案执行失败**。关于每个Origin级别的更多信息，请参考[治理概览页面的Governance v2部分](/learn/features/governance/#general-definitions-gov2){target=_blank}。

![Submit proposal](/images/tokens/governance/proposals/v2/proposals-6.png)

Here, you need to provide the following information:

此处，您需要提供以下信息：

 1. Select the account from which you want to submit the proposal (in this case, Alice)

    选择提交提案的账户（在本示例中为Alice）

 2. Choose the Track to submit the proposal to. The Origin associated with the Track will need to have enough authority to execute the proposed action. For this example, to register a mintable XC-20, you can select **2 / General Admin** from the **submission track** dropdown

    选择Track提交提案。与Track关联的Origin需要有足够的权限来执行提案操作。在本示例中，要注册一个可铸造XC-20，您可以在**submission track**下拉菜单中选择**2 / General Admin**

 3. In the **origin** dropdown, choose **Origins**

    在**origin**下拉菜单选择**Origins**

 4. In the **Origins** dropdown, select the Origin, which in this case is **GeneralAdmin**

    在**Origins**下拉菜单选择Origin，在本示例中为**GeneralAdmin**

 5. Enter the preimage hash related to the proposal. In this example, it is the hash of the `assetManager.registerLocalAsset` preimage from the previous section

    输入与提案相关的原像。在本示例中为上一部分操作得到的`assetManager.registerLocalAsset`原像哈希

 6. Choose the moment of enactment, either after a specific number of blocks, or at a specific block. It must meet the minimum Enactment Period, which you can find in OpenGov's [Governance Parameters](/learn/features/governance/#governance-parameters-v2)

    选择生效的时间点，或特定区块号，或特定区块，但条件是必须满足最短生效等待期，具体要求请参考OpenGov的[治理参数](/learn/features/governance/#governance-parameters-v2)

 7. Enter the number of blocks or the specific block to enact the proposal at

    输入生效提案的区块号或特定区块

 8. Click **Submit proposal** and sign the transaction

    点击**Submit proposal**并签署交易

![Fill in the Proposal Information](/images/tokens/governance/proposals/v2/proposals-7.png)

!!! note 注意事项
    Tokens might be locked for an indeterminate amount of time because it is unknown when a proposal may become a referendum (if ever).

由于提案进入公投阶段所需时间不可预测（也有可能无法进入公投阶段），因此Token可能无限期锁定。

After the transaction is submitted, you will see some confirmations on the top right corner of the Polkadot.js Apps interface. You should also see the proposal listed in the associated Origin section, displaying the proposed action, proposer, and more.

交易提交后，您将在Polkadot.js Apps接口的右上角看到一些确认信息。您也将看到提案出现在关联的Origin部分的列表中，显示已发起的提案、提议者以及更多。

该提案也会进入**Proposals**列表，并显示提案者和Token锁定量。现在，提案已开放接受附议！

If you login to [Polkassembly](https://moonbeam.polkassembly.network/){target=_blank} with the same account that you used to create the proposal, you'll be able to edit the description of the proposal to include a link to the proposal discussion on the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank}. This is a helpful step because while Polkassembly auto-generates a post for each proposal, it doesn't provide context information on the contents of the proposal. 

如果您用创建提案的同一个账户登陆[Polkassembly](https://moonbeam.polkassembly.network/){target=_blank}，您将能够编辑提案描述，添加在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}提案讨论的链接。该步骤必不可少，虽然Polkassembly会为每个提案自动生成一个帖子，但它不会提供有关提案的详细信息。

The proposal is now in the Lead-in Period and is ready to be voted on! In order for your proposal to progress out of the Lead-in Period to the next phase, at a minimum the Prepare Period will need to pass so there is enough time for the proposal to be discussed, there will need to be enough Capacity in the chosen Track, and the Decision Deposit will need to be submitted. The deposit can be paid by any token holder. If there isn't enough Capacity or the Decision Deposit hasn't been submitted, but the Prepare Period has passed, the proposal will remain in the Lead-in Period until all of the criteria is met.

提案目前处于带入期并可以准备开始投票。为了使您的提案从带入期进入下一阶段，至少需要经过准备期，以便有足够的时间讨论提案。在准备期需要确保有足够的提案容量选择Track，并且需要提交决定保证金。保证金可以由任何Token持有者支付。如果没有足够的容量或没有提交决定保证金，准备期过了之后，提案将保留在带入期，直到满足所有标准。

To learn how to vote on a proposal, please refer to the [How to Vote on a Proposal in OpenGov](/tokens/governance/voting/opengov-voting){target=_blank} guide.

要了解如何对提案进行投票，请参考[如何在OpenGov对提案进行投票](/tokens/governance/voting/opengov-voting){target=_blank}教程。