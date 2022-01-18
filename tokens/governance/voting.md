---
title: 提案投票
description: 如何通过Moonbeam治理机制来投票决定执行或否决提案
---

# 投票

![Governance Moonbeam Banner](/images/tokens/governance/voting/voting-banner.png)

## 概览 {: #introduction } 

提案进入公投阶段后，代币持有者可以使用持有的代币进行投票。影响投票权重的因素有两个：代币锁定量和锁定期（称为“信念值”）。这可以从经济利益上确保不会出现兜售投票权的现象。因此，锁定期越长，投票权重越高。用户也可以选择不锁定代币，但投票权重会大大下降。

公投是简单的、包容的、基于 stake 的投票方案。每一次公投都有一个与之相关的具体的提议。公投有固定的时长。投票期过后，将会进行票数统计，如果提案获得通过，就会被执行。

在Moonbeam，用户可以使用其H160地址和私钥（也就是以太坊账户）来创建提案、附议提案和投票提案。

随着[Moonbase Alpha v6](https://github.com/PureStake/moonbeam/releases/tag/v0.6.0)的发布，网络用户现可提交提案进行公投。本教程为已经到公投阶段的提案提供如何进行投票的指引。关于如何提交提案，可以点击[这里](/governance/proposals/)查看相关教程。

更多详情，请参阅Polkadot Wiki下的[治理](https://wiki.polkadot.network/docs/learn-governance)和[参与民主权利](https://wiki.polkadot.network/docs/maintain-guides-democracy)页面。

!!! 注意事项
    本教程在定制版本的Moonbeam上进行，发布/执行期较短，仅作演示用途。

## 定义 {: #definitions } 

本教程中重要参数定义如下：

 - **投票期** —— 持币者对提案进行公投的时期（一次公投的时间段）
 - **投票** —— 持币者对某一提案表示赞成或反对的工具。投票权重由两个因素决定：代币锁定量和锁定期（称为“信念值”）
 - **投票数** —— 参与投票的代币总量
 - **总选票 ** —— 网络发行的代币总量
 - **最高票数** —— 每个账户的最高票数
 - **执行期** —— 提案获得同意到正式执行（写入法律）之间的时期，也是进行提案所需的最低代币锁定时长
 - **锁定期** —— 赢得投票用户的代币锁定期（提案执行后）。在此期间，用户仍可使用锁定代币进行质押或投票
 - **委托** —— 将自己的投票权委托给其他账户，以积累一定信念值的行为

=== "Moonbeam"
    |       变量         |  |                                                         Value                                                         |
    |:-----------------------:|::|:---------------------------------------------------------------------------------------------------------------------:|
    |      执行期       |  | {{ networks.moonbeam.democracy.enact_period.blocks}} blocks ({{ networks.moonbeam.democracy.enact_period.days}}天) |
    | 最高票数 |  |                                      {{ networks.moonbeam.democracy.max_votes}}                                       |
    |       投票期       |  |  {{ networks.moonbeam.democracy.vote_period.blocks}} blocks ({{ networks.moonbeam.democracy.vote_period.days}}天)  |

=== "Moonriver"
    |        变量         |  |                                                          Value                                                          |
    |:-----------------------:|::|:-----------------------------------------------------------------------------------------------------------------------:|
    |      执行期       |  | {{ networks.moonriver.democracy.enact_period.blocks}} blocks ({{ networks.moonriver.democracy.enact_period.days}}天) |
    | 最高票数 |  |                                       {{ networks.moonriver.democracy.max_votes}}                                       |
    |       投票期       |  |  {{ networks.moonriver.democracy.vote_period.blocks}} blocks ({{ networks.moonriver.democracy.vote_period.days}}天)  |

=== "Moonbase Alpha"
    |        变量         |  |                                                         Value                                                         |
    |:-----------------------:|::|:---------------------------------------------------------------------------------------------------------------------:|
    |      执行期       |  | {{ networks.moonbase.democracy.enact_period.blocks}} blocks ({{ networks.moonbase.democracy.enact_period.days}}天) |
    | 最高票数 |  |                                      {{ networks.moonbase.democracy.max_votes}}                                       |
    |       投票期       |  |  {{ networks.moonbase.democracy.vote_period.blocks}} blocks ({{ networks.moonbase.democracy.vote_period.days}}天)  |


## 提案步骤 {: #roadmap-of-a-proposal } 

--8<-- 'text/governance/roadmap.md'

## 参与公投 {: #voting-on-a-referendum } 

这一小节将介绍公投流程。本教程使用已经创建的公投进行讲解（公投创建指南请参阅[这里](/governance/proposals/)）。

您需要用到Polkadot.js App接口进行提案。为此，需要先导入以太坊式账户（H160地址），您可按照[这一教程](/integrations/wallets/polkadotjs/#creating-or-importing-an-h160-account)完成操作。在这个示例中，我们导入了三个账户，并分别命名为Alice、Bob和Charley。

![Accounts in Polkadot.js](/images/tokens/governance/proposals/proposals-1.png)

本次进行投票的提案内容为：通过治理机制将Bob的余额设定为`1500`！

### 如何投票 {: #how-to-vote } 

在Moonbeam上进行投票非常简单。所有治理相关功能都在“Democracy”标签下。如下图所示，可以看到有一个数字`1`，说明有一项民主事项正在进行中（可能是提案或公投）。点击描述旁的箭头，就可以看到您要投票的公投情况。行动和描述旁的数字称为“公投指数”（在本示例中为0）。就绪后，点击“Vote”按钮。

![Vote Button](/images/tokens/governance/voting/vote-2.png)

此处，您需要提供以下信息：

 1. 选择您想要投票使用的账户
 2. 输入投票所用代币数量。这些代币将被锁定，下一步可设定锁定期。
 3. 设置投票信念值，这会决定投票权重（`vote_weight = tokens * conviction_multiplier`）。信念值乘数与代币锁定所服务的执行期相关。因此，锁定期越长，投票权重越高。您也可以选择不锁定代币，但投票权重会大大下降（在公投期间，代币仍会被锁定）

| 锁定期 |      | 信念值乘数 |
| :----: | :--: | :--------: |
|   0    |      |    0.1     |
|   1    |      |     1      |
|   2    |      |     2      |
|   4    |      |     3      |
|   8    |      |     4      |
|   16   |      |     5      |
|   32   |      |     6      |

 4. 点击““Vote Aye”或“Vote Nay”，然后签名确认交易

![Vote Submission](/images/tokens/governance/voting/vote-3.png)

!!! 注意事项
    上图显示的锁定期仅为参考。本教程在定制版本的Moonbeam上进行，发布/执行期较短，仅作演示用途。

在本示例中，Alice决定投赞成票，信念值为`6x`。而Charley决定投反对票，但选择不锁定任何代币（他的代币仅在公投期间锁定），因此他的信念值为`0.1x`。在“Democracy”标签下可以看到目前票数分布下的投票结果。

![Vote Information](/images/tokens/governance/voting/vote-4.png)

从上述投票演示中可以得出：

 - Alice的权重是10800份，由她的1800枚锁定代币乘以6倍信念值得出
 - Charley的权重是80份，他用800枚代币投票，但没有锁定（仅在公投期间锁定），因此信念值乘数只有0.1
 - 投票剩余时间和距离提案执行（假定提案获得批准）时间都会显示在屏幕上
 - 参与投票数仅为0.21%。计算方式为参与投票代币总量（2600枚）除以网络流通代币总量（本示例中为122万枚）
 - 虽然投票人数很低，但提案还是因为获得了绝对多数赞成票而初步通过。更多详情可以在[这一小节](/governance/voting/#positive-turnout-bias)找到
 - 请记下公投指数，才能在锁定期结束后解锁代币。目前，一旦提案被执行，就无法查看公投指数了

投票期结束后，已通过的提案可以在“Dispatch”标签下查看。您也可以在这里看到距离提案执行的时间。

![Proposal Enactment](/images/tokens/governance/voting/vote-5.png)

### 委托投票 {: #delegate-voting } 

代币持有者可以选择将投票权委托给其它信任的账户。受委托的账户不需要进行额外的操作。在受委托账户进行投票时，委托账户的投票权重（委托者锁定的代币数量乘以委托者选择的信念值乘数）会直接加到受委托账户的权重中。

要进行委托投票，首先要进入“Developer”标签下的“Extrinsics”菜单。

![Extrinsics Menu](/images/tokens/governance/voting/vote-6.png)

此处，您需要提供以下信息：

 1. 选择需要委托的账户
 2. 选择希望交互的模块。在本示例中为`democracy`模块
 3. 选择交易使用的外部操作模式。这会决定接下来的步骤中要填写的内容领域。在这一示例中选择的是`delegate`进行操作
 4. 选择委托投票的账户
 5. 设置投票信念值，这将决定投票权重（`vote_weight = tokens * conviction_multiplier`）。信念值乘数与代币锁定所服务的执行期相关。因此，锁定期越长，投票权重越高。您也可以选择不锁定代币，但投票权重会大大下降
 6. 设定委托到此账户的代币数量
 7. 点击“Submit Transaction”按钮并签名确认交易

![Extrinsics Transaction for Delegation](/images/tokens/governance/voting/vote-7.png)

在本示例中，Alice委托了1000份投票权重（1000枚代币乘以信念值1）给Charley。

![View Delegation](/images/tokens/governance/voting/vote-8.png)

!!! 注意事项
    委托投票的另一个方法是在“Accounts”标签下点击委托账户名称后的“…”，并填写上述相关信息。

被委托账户开始投票时，总投票权重将自动叠加。在本示例中，Charley决定投票赞成公投中的某一提案。他以800份的投票权重（800枚代币乘以信念值1）进行了投票。但由于Alice向他委托了1000份投票权重，因此他的赞成总投票权重将为1800份。

![Total Votes with Delegation](/images/tokens/governance/voting/vote-9.png)

重复上述步骤也可撤销委托，只需要在第3步选择`undelegate`进行操作即可。

从上述委托投票的演示中可以得出：

 - 如果持币者想要撤销委托，但委托权重已经在公投中使用了，那么这些权重将在最终票数中移除
 - 进行委托的代币持有者也要遵守锁定期规则。也就是说，如果被委托者赢得了投票，委托者的委托代币也会进入相应的锁定期
 - 已委托的代币不再属于代币持有者的自由余额。如需了解更多余额类型，可以访问[这一页面](https://wiki.polkadot.network/docs/build-protocol-info#free-vs-reserved-vs-locked-vs-vesting-balance)
 - 已经委托他人的代币持有者自己不能再参与公投。如要参与，需先撤销委托
 - 请记下公投指数，锁定期结束后，已委托他人的持币者需要手动解锁代币

### 解锁代币 {: #unlocking-locked-tokens } 

代币持有者在进行投票时，使用的代币将被锁定且不能进行转移。您可以在“Accounts”标签下展开账户详情查看代币锁定情况。在详情中可以看到不同的余额类型（更多余额类型详情请看[这里](https://wiki.polkadot.network/docs/build-protocol-info#free-vs-reserved-vs-locked-vs-vesting-balance)）。如果光标在“democracy”右侧图标上移动，就会出现目前锁定状态的信息面板。其中不同的锁定状态有：

 - 因公投进行中而锁定，意味着您已经使用了代币，即使您并没有选择锁定，也必须等到公投结束才能解锁
 - 根据信念值乘数进行锁定，会显示剩余区块数量和时间
 - 锁定期结束，意味着您可以解锁并取回代币

![Account Lock Status](/images/tokens/governance/voting/vote-10.png)

锁定期结束即可取回代币。请在“Developers”标签下的“Extrinsics”菜单中进行操作。

![Extrinsics Menu](/images/tokens/governance/voting/vote-11.png)

在此，我们需要进行两个不同的外部操作。首先需要提供以下信息：

 1. 选择取回代币的存放账户
 2. 选择希望交互的模块。在本示例中为`democracy`模块
 3. 选择交易使用的外部操作模式。这会决定接下来的步骤中要填写的内容领域。在这一示例中选择的是`removeVote`进行操作。这是解锁代币的必要一步。通过这一操作也可以移除您在公投中已投下的票数
 4. 输入公投指数。这是“Democracy”标签左手边显示的数字。在本示例中为0
 5. 点击“Submit Transaction”按钮并签名确认交易

![Remove Vote Extrinsics](/images/tokens/governance/voting/vote-12.png)

进入下一步，您需要提供以下信息：

 1. 选择取回代币的存放账户
 2. 选择希望交互的模块。在本示例中为`democracy`模块
 3. 选择交易使用的外部操作模式。这会决定接下来的步骤中要填写的内容领域。在这一示例中选择的是`unlock`模式
 4. 输入接收解锁代币的目标账户。在本示例中为Alice
 5. 点击“Submit Transaction”按钮并签名确认交易

![Unlock Extrinsics](/images/tokens/governance/voting/vote-13.png)

交易完成后，锁定代币将被解锁。您可以返回到“账户”标签进行检查。在本示例中，可以看到Alice已恢复了原有余额，余额状态显示为“transferable”。

![Check Balance](/images/tokens/governance/voting/vote-14.png)

## 正向偏向投票机制 {: #positive-turnout-bias } 

公投采用正向偏向投票机制，即绝对多数赞成制。该模式的方程式如下：

![Positive Turnout Bias](/images/tokens/governance/voting/vote-bias.png)

方程式中：

 - **同意** —— 赞成票数（信念值乘数已计入）
 - **反对** —— 反对票数（信念值乘数已计入）
 - **投票数** —— 参与投票代币总量（信念值乘数未计入）
 - **总选票** —— 网络发行的代币总量

在此前示例中，这些参数值分别为：

|   变量   |      |               值               |
| :------: | :--: | :----------------------------: |
|   赞成   |      |        10800 (1800 x 6)        |
|   反对   |      |         80 (800 x 0.1)         |
|  投票数  |      |       2600 (1800 + 800)        |
|  总选票  |      |             1.22M              |
| **结果** |      | 1.5 < 9.8 (赞成一方赢得投票！) |

简而言之，参与率低的提案需要获得大量绝对多数赞成票来获得通过，但随着投票人数增加，就会变成简单多数制。
