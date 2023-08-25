---
title: 如何在OpenGov发起提案
description: 按照这些分步说明来了解如何提交民主提案以供其他token持有者在Moonbeam上的Governance v2 (OpenGov)中投票。 
---

# 如何在OpenGov (Governance v2)发起提案

## 概览 {: #introduction }

提案是指Token持有者在链上提出建议并由系统生效。提案是治理系统的核心要素之一，因为这是参与者能够提出建议/更改的主要工具，随后参与者可以对其进行投票。

在Moonbeam，用户可以使用其H160地址和私钥（也就是以太坊账户）来创建提案、附议提案和投票提案。

本教程将分步概述如何在OpenGov (Governance v2)提交提案以便Token持有者投票。此教程将展示如何在Moonbase Alpha上提交提案，这也同样适用于Moonbeam或Moonriver。关于如何[在OpenGov对提案进行投票](/tokens/governance/voting/){target=_blank}有单独的教程。

关于Moonbeam治理系统的更多信息，请参考[治理概览页面](/learn/features/governance/){target=_blank}。

## 定义 {: #definitions }

本教程中重要参数定义如下：

--8<-- 'text/governance/proposal-definitions.md'

--8<-- 'text/governance/preimage-definitions.md'

 - **提交保证金** — 提交公投提案所需的最低保证金

--8<-- 'text/governance/lead-in-definitions.md'

请确保您查看每个网络和track的[治理参数](/learn/features/governance/#governance-parameters-v2){target=_blank}。

## 提案步骤 {: #roadmap-of-a-proposal }

本教程将涵盖提案步骤图的前几个步骤，如下图突出显示的步骤所示。您将学习如何提交提案想法至[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}、提交原像以及使用原像哈希在链上提交提案。

您可以在[治理概览页面的OpenGov提案步骤](/learn/features/governance/#roadmap-of-a-proposal-v2){target=_blank}部分找到详细的解释。

![Proposal Roadmap](/images/tokens/governance/proposals/proposal-roadmap.png)

## 提交您的想法至论坛 {: #submitting-your-idea-to-the-forum }

在开始操作提交提案的步骤之前，您需要先熟悉[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}平台。强烈建议您先在论坛上发布任何提案相关的帖子以接收社区反馈。在继续提交原像和提案之前，您需要预留5天时间供社区讨论并在Moonbeam社区论坛帖子上提供反馈。

要访问Moonbeam社区论坛，您必须是[Moonbeam Discord](https://discord.com/invite/PfpUATX){target=_blank}的社区成员之一。然后，您可以使用您的Discord注册以访问论坛。

登陆后，您可以查看最新讨论、加入对话，并为您拥有的提案想法创建自己的讨论。在首次发布帖子或发表评论前，请确保您已熟悉[常见问答](https://forum.moonbeam.foundation/faq){target=_blank}并了解社区准则。

![Moonbeam Forum Home](/images/tokens/governance/treasury-proposals/treasury-proposal-1.png)

如果您已准备好发布提案详情的帖子，您可以前往**Governance**页面并点击**Democracy Proposals**。

![Governance page on Moonbeam Forum](/images/tokens/governance/proposals/proposals-1.png)

然后点击**Open Draft**，使用提供的模板开始准备提案草案。确保更新帖子标题并添加相关标签，比如**Moonbeam**（如果提案与Moonbeam相关）。标题应遵循[Proposal: XX][Status: Idea]提案标题的格式。例如，[Proposal: XX][Status: Idea]注册XC-20 xcMYTOK。其中XX将在提案正式在链上提交后需要被更新为提案ID。

![Add a proposal to the Moonbeam Forum](/images/tokens/governance/proposals/proposals-2.png)

填写完提案详情后，点击**Create Topic**保存至论坛并打开讨论。根据收到的反馈，您可以在提交之前更新提案。

## 发起提案 {: #proposing-an-action }

此部分将介绍使用OpenGov (Governance v2)在Moonbase Alpha上创建提案的流程。操作步骤也同样适用于Moonbeam或Moonriver。

您需要用到Polkadot.js Apps界面发起提案。为此，您需要先导入以太坊格式账户（即H160地址），您也可以遵循[创建或导入H160账户](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank}教程完成此步骤。在这个示例中，我们导入了三个账户，并分别命名为Alice、Bob和Charlie。

![Accounts in Polkadot.js](/images/tokens/governance/proposals/proposals-3.png)

您可以选择任何想要发起提案的内容，请确保将其分配给正确的Origin和Track，以便其具有执行提案的正确权限。

本教程旨在使用General Admin Origin和Track创建一个链上备注。

### 提交提案原像 {: #submitting-a-preimage-of-the-proposal }

第一步是提交提案原像。这是因为大型原像包含关于提案本身的所有信息，储存成本很高。在这一设置下，资金较多的账户可以负责提交原像，另一个账户提交提案。

前往[Moonbase Alpha的Polkadot.js Apps界面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network){target=_blank}，所有治理相关操作均在**Governance**标签下，包括原像。在**Governance**下拉菜单中选择**Preimages**，然后点击**Add preimage**按钮。

![Add preimage in Polkadot.js](/images/tokens/governance/proposals/proposals-4.png)

此处，您需要提供以下信息：

 1. 选择提交原像的账户
 2. 选择希望交互的pallet以及可调用的函数（或请求）进行提案。所选请求将决定接下来的步骤中要填写的内容。在本示例中为**system** pallet和**remark** extrinsic
 3. 输入要调度的extrinsic所需的任何其他字段。以本例来说，您可以以十六进制或ascii格式输入备注
 4. 复制原像哈希。这个数值代表着提案，在提交正式提案时会用到
 5. 点击**Submit preimage**按钮并签署交易

![Fill in the Preimage Information](/images/tokens/governance/proposals/proposals-5.png)

!!! 注意事项
    请确保复制原像哈希，在提交提案时必须用到这一数据。

请注意，原像储存成本可以计算为（每个网络的）基本费用加上所提议的原像的每字节费用。

交易提交后，您将在Polkadot.js Apps界面的右上角看到一些确认信息，原像将被添加到**preimages**列表当中。

### 提交提案 {: #submitting-a-proposal-v2 }

提交原像（查看上一部分）后，下一步就是提交与这一原像相关的提案。为此，需要在**Governance**下拉菜单中选择**Referenda**，并点击**Submit proposal**。

要提交提案，您将需要选择您希望提案执行的Origin级别。**选择错误的Track/Origin会导致提案执行失败**。有关每个Origin类的更多信息，请参阅Moonbeam治理概览页面上的[一般定义](/learn/features/governance/#general-definitions-gov2){target=_blank}部分。

![Submit proposal](/images/tokens/governance/proposals/proposals-6.png)

此处，您需要提供以下信息：

 1. 选择提交提案的账户（在本示例中为Alice）
 2. 选择要提交提案的Track。与Track关联的Origin需要有足够的权限来执行建议的操作。在此示例中，要添加链上备注，您可以从 **submission track** 下拉选单中选择 **2 / General Admin**
 3. 在**origin**下拉菜单选择**Origins**
 4. 在**Origins**下拉菜单选择Origin，在本示例中为**GeneralAdmin**
 5. 输入与提案相关的原像。在本示例中为上一部分操作得到的`system.remark`原像哈希
 6. 选择生效的时间点，或在一定数量区块后，或在某一特定区块，但条件是必须满足最短生效等待期，具体要求请参考OpenGov的[治理参数](/learn/features/governance/#governance-parameters-v2)
 7. 输入生效提案的区块数量或特定区块
 8. 点击**Submit proposal**并签署交易

![Fill in the Proposal Information](/images/tokens/governance/proposals/proposals-7.png)

!!! 注意事项
    由于提案进入公投阶段所需时间不可预测（也有可能无法进入公投阶段），因此Token可能无限期锁定。

交易提交后，您将在Polkadot.js Apps界面的右上角看到一些确认信息。您也将看到提案出现在关联的Origin部分的列表中，显示已发起的提案、提议者以及更多信息。

如果您用创建提案的同一个账户登陆[Polkassembly](https://moonbeam.polkassembly.io/opengov){target=_blank}，您将能够编辑提案描述，添加在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}提案讨论的链接。该步骤必不可少，虽然Polkassembly会为每个提案自动生成一个帖子，但它不会提供有关提案的详细信息。

提案目前处于带入期并可以准备开始投票。为了使您的提案从带入期进入下一阶段，至少需要经过准备期，以便有足够的时间讨论提案，还需要确保选择的Track有足够的提案容量，并且需要提交决定保证金。保证金可以由任何Token持有者支付。如果没有足够的容量或没有提交决定保证金，准备期过了之后，提案将保留在带入期，直到满足所有标准。

要了解如何对提案进行投票，请参考[如何在OpenGov对提案进行投票](/tokens/governance/voting/){target=_blank}教程。
