---
title: 如何发起提案
description: 了解提案的流程，以及如何发起提案、开放投票，并通过Governance v1功能在moonbeam上附议提案。
---

# 如何在Governance v1发起提案

![Governance Moonbeam Banner](/images/tokens/governance/proposals/governance-proposal-banner.png)

## 概览 {: #introduction } 

提案是指Token持有者在链上提出建议并由系统生效。提案是治理系统的核心要素之一，因为这是参与者能够提出建议/更改的主要工具，随后参与者可以对其进行投票。

在Moonbeam，用户可以使用其H160地址和私钥（也就是以太坊账户）来创建提案、附议提案和投票提案。

Moonbeam的治理系统正在更新中。下一个阶段的治理称为OpenGov(Goverance v2)。在推出过程中，OpenGov将在Moonriver上经过严格测试，然后再通过提案部署至Moonbeam。在正式上线Moonbeam之前，Moonbeam将继续使用Governance v1。因此，**本教程仅适用于Moonbeam上的提案**。如果想要在Moonriver或Moonbase Alpha上提交提案，请参考[如何在OpenGov发起提案](/tokens/governance/proposals/opengov-proposals){target=_blank}的教程。

本教程将概述如何在Moonbeam的Governance v1创建提案，操作步骤将从创建到公投。关于如何在Governance v1[对提案进行投票](/tokens/governance/voting/voting){target=_blank}有单独的教程。

关于Moonbeam治理系统的更多信息，包括Governance v1和OpenGov（Governance v2），请参考[治理概览页面](/learn/features/governance/){target=_blank}。

## 定义 {: #definitions } 

本教程中重要参数定义如下：

--8<-- 'text/governance/proposal-definitions.md'

 - **附议** — 其他参与者可以附议（赞成）提案，帮助推进到公投阶段。附议人需要质押与提案者相同数量的Token

--8<-- 'text/governance/preimage-definitions.md'

 - **提案保证金** — 提交提案时提议者需要绑定的最少数量的Token。由于提案进入公投阶段所需时间不可预测（也有可能无法进入公投阶段），因此Token可能无限期锁定。这对于提议者和附议提案的用户所绑定的Token都是如此
 - **启动期** — 两次公投之间的时间间隔
 - **冷静期** —— 提案被否决后直至可以再次提交的持续时长（以区块数量计算）

=== "Moonbeam"
    |         变量         |                                                         值                                                         |
    |:--------------------:|:------------------------------------------------------------------------------------------------------------------:|
    |    原像基础保证金    |                                 {{ networks.moonbeam.preimage.base_deposit }} GLMR                                 |
    | 每个字节的原像保证金 |                                 {{ networks.moonbeam.preimage.byte_deposit }} GLMR                                 |
    |      提案保证金      |                                 {{ networks.moonbeam.democracy.min_deposit }} GLMR                                 |
    |        启动期        | {{ networks.moonbeam.democracy.launch_period.blocks}}区块（{{ networks.moonbeam.democracy.launch_period.days}}天） |
    |        冷静期        |   {{ networks.moonbeam.democracy.cool_period.blocks}}区块（{{ networks.moonbeam.democracy.cool_period.days}}天）   |

## 提案步骤 {: #roadmap-of-a-proposal } 

本教程将涵盖提案步骤图的前几个步骤，如下图突出显示的步骤所示。您将学习如何提交提案想法至[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}、提交原像、使用原像哈希在链上提交提案，以及附议提案。

您可以在[治理概览页面的Governance v1提案步骤](/learn/features/governance/#roadmap-of-a-proposal){target=_blank}部分找到详细的解释。

![Proposal Roadmap](/images/tokens/governance/proposals/proposal-roadmap.png)

--8<-- 'text/governance/submit-idea.md'

## 发起提案 {: #proposing-an-action }

此部分将介绍使用Governance v1在Moonbeam上创建提案的流程，操作步骤将从提交原像到公投。

!!! 注意事项
    本教程中出现的截图均显示在Polkadot.js Apps的Moonbase Alpha界面上，但是这些步骤需要在[Moonbeam的Polkadot.js Apps界面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network){target=_blank}上执行。

您需要用到Polkadot.js Apps界面发起提案。为此，您需要先导入以太坊格式账户（即H160地址），您也可以遵循[创建或导入H160账户](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank}教程完成此步骤。在这个示例中，我们导入了三个账户，并分别命名为Alice、Bob和Charlie。

![Accounts in Polkadot.js](/images/tokens/governance/proposals/proposals-3.png)

本次提案内容为：将备注文本"This is a unique string."永久上链。

### 提交提案原像 {: #submitting-a-preimage-of-the-proposal } 

第一步是提交提案原像。这是因为大型原像包含关于提案本身的所有信息，储存成本很高。在这一设置下，资金较多的账户可以负责提交原像，另一个账户提交提案。

前往[Moonbeam的Polkadot.js Apps界面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network){target=_blank}，所有治理相关操作均在**Governance**标签下，包括原像。在**Governance**下拉菜单中选择**Preimages**，然后点击**Add preimage**按钮。

![Add preimage in Polkadot.js](/images/tokens/governance/proposals/proposals-4.png)

此处，您需要提供以下信息：

 1. 选择提交原像的账户

 2. 选择希望交互的pallet以及可调用的函数（或请求）进行提案。所选请求将决定接下来的步骤中要填写的内容。在本示例中，选择的是`system` pallet和`remark`函数

 3. 以ascii或前缀为“0x”的十六进制格式输入备注文本。确保备注是唯一的。"Hello World!"已经提出，不接受重复的相同提案。这些备注将永久存在于链上，所以请不要输入敏感信息或亵渎性信息

 4. 复制原像哈希。这个数值代表着提案，在提交正式提案时会用到

 5. 点击**Submit preimage**按钮并签署交易

![Fill in the Preimage Information](/images/tokens/governance/proposals/proposals-5.png)

!!! 注意事项
    请确保复制原像哈希，在提交提案时必须用到这一数据。

请注意，原像储存成本可以计算为（每个网络的）基本费用加上所提议的原像的每字节费用。

交易提交后，您将在Polkadot.js Apps界面的右上角看到一些确认信息，原像将被添加到**preimages**列表当中。

### 提交提案 {: #submitting-a-proposal } 

提交原像（查看上一部分）后，下一步就是提交与这一原像相关的提案。为此，需要在**Governance**下拉菜单中选择**Democracy**，并点击**Submit proposal**。

![Submit proposal](/images/tokens/governance/proposals/proposals-6.png)

此处，您需要提供以下信息：

 1. 选择提交提案的账户（在本示例中为Alice）

 2. 输入提案的原像哈希。在本示例中为上一部分操作得到的`remark`原像哈希

 3. 设置锁定金额。这是提议者与其提案绑定的token数量。只有锁定量最高的提案才会进入公投阶段。最低保证金显示在输入框的正下方

 4. 点击**Submit proposal**按钮并签署交易

![Fill in the Proposal Information](/images/tokens/governance/proposals/proposals-7.png)

!!! 注意事项
    由于提案进入公投阶段所需时间不可预测（也有可能无法进入公投阶段），因此Token可能无限期锁定。

交易提交后，您将在Polkadot.js Apps界面的右上角看到一些确认信息。该提案也会进入**Proposals**列表，并显示提案者和Token锁定量。现在，提案已开放接受附议！

如果您用创建提案的同一个账户登陆[Polkassembly](https://moonbeam.polkassembly.network/){target=_blank}，您将能够编辑提案描述，添加在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}提案讨论的链接。该步骤必不可少，虽然Polkassembly会为每个提案自动生成一个帖子，但它不会提供有关提案的详细信息。

您需要在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}编辑提案，标题需要包含提案ID，状态更新为`Submitted`。

## 附议提案 {: #seconding-a-proposal } 

附议提案意味着您赞成提案内容，并想用Token支持该提案进入公投阶段。附议者锁定的Token量需与提案者锁定的完全相同，不要多也不能少。

!!! 注意事项
    一个账户可多次附议同一提案。这是原理上就存在的功能，因为一个账户可以发送Token到不同地址，并使用这些地址来附议提案。提案是否能进入公投阶段看的是Token锁定量，而不是地址数量。

本节将概述附议上一节中提交的提案的步骤。 为此，请单击位于相应提案右侧的**Endorse**按钮。

![Proposal listed to Second](/images/tokens/governance/proposals/proposals-8.png)

此处，您需要提供以下信息：

 1. 选择您希望用于附议提案的账户（在本示例中为Charlie）

 2. 验证附议提案所需Token数量

 3. 点击**Endorse**按钮并签署交易

![Fill in Endorse Information](/images/tokens/governance/proposals/proposals-9.png)

!!! 注意事项
    由于提案进入公投阶段所需时间不可预测（也有可能无法进入公投阶段），因此Token可能无限期锁定。

交易提交后，您将在Polkadot.js Apps界面的右上角看到一些确认信息。该提案也会进入**Proposals**部分，并显示提案者和Token锁定量，以及附议提案的用户的列表。

![Proposal Endorsed](/images/tokens/governance/proposals/proposals-10.png)

在每个启动期，附议最多的提案将进入公投。要了解如何对提案进行投票，请参考[如何在OpenGov对提案进行投票](/tokens/governance/voting/voting){target=_blank}教程。