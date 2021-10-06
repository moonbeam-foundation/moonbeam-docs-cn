---
title: 提案教程
description: 如何通过治理机制在Moonbeam上发送提案
---

# 提案

![Governance Moonbeam Banner](/images/tokens/governance/proposals/governance-proposal-banner.png)

## 概览 {: #introduction } 

在Moonbeam[治理概述页面](/governance/overview/#definitions)中提到，提案指的是代币持有者向区块链提出建议，让系统自动执行。

提案是治理系统的核心组成部分，是代币持有者提出行动或者变化建议的主要工具。提案后，其他代币持有者将对提案进行投票。

在Moonbeam，用户可以使用其H160地址和私钥（也就是以太坊账户）创建提案、附议提案和投票提案。

[Moonbase Alpha v6](https://github.com/PureStake/moonbeam/releases/tag/v0.6.0)发布后，用户现可在测试网上提交提案进行公投。本教程为如何创建提案提供了指引，对从创建提案到进入公投阶段的流程进行了介绍。关于如何进行提案投票，可以点击[这里](/governance/voting/)查看相关教程。

更多详情，请参阅Polkadot Wiki下的[治理](https://wiki.polkadot.network/docs/learn-governance)和[参与民主权利](https://wiki.polkadot.network/docs/maintain-guides-democracy)页面。

!!! 注意事项
    本教程在定制版本的Moonbeam上进行，发布/执行期较短，仅作演示用途。

## 定义 {: #definitions } 

本教程中重要参数定义如下：

 - **提案** —— 网络用户提出的行动方案或事项
 - **附议** —— 其他持币者可以附议提案，帮助推进到公投阶段。附议人需要质押与提案者相同数量的代币
 - **原像哈希（Preimage Hash）** —— 要颁布的提案的哈希值。提案的第一步就是提交一个哈希值。哈希值仅作为提案标识符。原像提案者可以与正式提案者不同
 - **最低原像充值金额** —— 提交原像所需支付的最低代币金额
 - **最低提案充值金额** —— 提交提案所需支付的最低代币金额。由于提案进入公投阶段所需时间不可预测（也有可能无法进入公投阶段），因此代币可能无限期锁定。这一规则对提案者和附议人的质押代币同样适用
 - **发起期** —— 两次公投之间的时间间隔
 - **冷却期** —— 提案被否决后不能重新提交的时期（以区块数量计算）

目前Moonbase Alpha有关参数设置如下：

|      变量      |      |                              值                              |
| :------------: | :--: | :----------------------------------------------------------: |
|     发起期     |      | {{ networks.moonbase.democracy.launch_period.blocks}} blocks ({{ networks.moonbase.democracy.launch_period.days}} days) |
|     冷却期     |      | {{ networks.moonbase.democracy.cool_period.blocks}} blocks ({{ networks.moonbase.democracy.cool_period.days}} days) |
| 最低原像存款额 |      |    {{ networks.moonbase.democracy.min_preim_deposit}} DEV    |
| 最低提案存款额 |      |       {{ networks.moonbase.democracy.min_deposit}} DEV       |

## 提案步骤 {: #roadmap-of-a-proposal } 

--8<-- 'text/governance/roadmap.md'

## 提案示例 {: #proposing-an-action } 

这一小节将介绍从原像到公投的提案过程。本教程中，我们创建了一个真实提案，而不是提供通用示例，以作为本教程和其它教程的基础。

您需要用到PolkadotJS App接口进行提案。为此，需要先导入以太坊式账户（H160地址），您可按照[这一教程](/integrations/wallets/polkadotjs/#creating-or-importing-an-h160-account)完成操作。在这个示例中，我们导入了三个账户，并分别命名为Alice、Bob和Charley。

![Accounts in PolkadotJS](/images/governance/governance-proposal-1.png)

本次提案内容为：通过治理机制将Bob的余额设定为`1500`！

### 提交提案原像 {: #submitting-a-preimage-of-the-proposal } 

第一步是提交提案原像。这是因为大型原像包含关于提案本身的所有信息，储存成本很高。在这一设置下，资金较多的账户可以负责提交原像，另一个账户提交提案。

所有治理相关操作均在“Democracy”标签下。进入后，点击“Submit preimage”按钮。

![Submit Preimage](/images/tokens/governance/proposals/proposals-2.png)

此处，您需要提供以下信息：

 1. 选择提交原像的账户
 2. 选择希望交互的模块以及可调用的函数（或行动）进行提案。所选行动将决定接下来的步骤中要填写的内容领域。在这一示例中，选择的是`democracy`模块和`setBalance`函数
 3. 设置希望修改余额的账户地址
 4. 设置新余额。了解更多余额类型，您可访问[这一网页](https://wiki.polkadot.network/docs/build-protocol-info#free-vs-reserved-vs-locked-vs-vesting-balance)
 5. 复制原像哈希值。这个数值代表着提案，在提交正式提案时会用到
 6. 点击“Submit preimage”按钮并签名确认交易

![Fill in the Preimage Information](/images/governance/governance-proposal-3.png)

!!! 注意事项
    请记得复制原像哈希值，在提交提案时必须用到这一数据。

请注意，原像储存成本显示在窗口左下角。交易提交后，就会看到右上角PolkadotJS App接口出现一些确认信息，但在“Democracy”页面没有任何变化。请不要担心，如果交易已确认，说明原像已经提交成功。

### 提交提案 {: #submitting-a-proposal } 

提交原像后（上一小节内容），下一步就是提交与这一原像相关的提案。为此，需要在“Democracy”页面点击“Submit proposal”。

![Submit proposal](/images/tokens/governance/proposals/proposals-4.png)

此处，您需要提供以下信息：

 1. 选择提交提案的账户（在本示例中为Alice）
 2. 输入提案的原像哈希值。在这个示例中为上一小节操作得到的`setBalance`原像哈希值
 3. 设置锁定金额。数值应等于提案者锁定的金额。只有锁定量最高的提案才会进入公投阶段。最低充值额显示在“Input”标签正下方
 4. 点击“Submit proposal”按钮并签名确认交易

![Fill in the Proposal Information](/images/governance/governance-proposal-5.png)

!!! 注意事项
    由于提案进入公投阶段所需时间不可预测（也有可能无法进入公投阶段），因此代币可能无限期锁定。

交易提交后，就会看到右上角PolkadotJS App接口出现一些确认信息。该提案也会进入“Proposals”列表，并显示提案者和代币锁定量。现在，提案已开放接受附议！

![Proposal listed](/images/governance/governance-proposal-6.png)

### 附议 {: #seconding-a-proposal }

附议意味着您同意提案内容，并想用代币支持该提案进入公投阶段。附议人锁定的代币量需与提案者锁定的完全相同。

!!! 注意事项
    一个账户可多次附议同一提案。这是原理上就存在的功能，因为一个账户可以发送代币到不同地址，并使用这些地址来附议提案。提案是否能进入公投阶段看的是代币锁定量，而不是地址数量。

上一小节介绍了如何创建提案，本小节则介绍了如何附议提案。在提案列表中选择需要赞成的提案并点击"Second"按钮即可。

![Proposal listed to Second](/images/governance/governance-proposal-7.png)

此处，您需要提供以下信息：

 1. 选择您希望用于附议提案的账户（在本示例中为Charley）
 2. 验证附议提案所需代币数量
 3. 点击“Second”按钮并签名确认交易

![Fill in Second Information](/images/governance/governance-proposal-8.png)

!!! 注意事项
    由于提案进入公投阶段所需时间不可预测（也有可能无法进入公投阶段），因此代币可能无限期锁定。

交易提交后，就会看到右上角PolkadotJS App接口出现一些确认信息。您也可以在“Proposals”列表看到该提案的相关提案者、代币锁定量以及已附议该提案的用户名单！

![Proposal Seconded](/images/governance/governance-proposal-9.png)
