---
title: 如何对提案进行投票
description: 学习如何通过Governance v1功能对Moonbeam上进行公投的提案进行投票并锁定Token以支持或否决提案
---

# 如何在Governance v1对提案进行投票

![Governance Moonbeam Banner](/images/tokens/governance/voting/voting-banner.png)

## 概览 {: #introduction } 

提案进入公投阶段后，Token持有者可以使用持有的Token进行投票。影响投票权重的因素有两个：Token锁定量和锁定期（称为“信念值”）。这可以从经济利益上确保不会出现兜售投票权的现象。因此，锁定期越长，投票权重越高。用户也可以选择不锁定Token，但投票权重会大大下降。

公投是简单的、包容的和基于质押的投票方案。每一次公投都有一个与之相关的具体的提议。公投有固定的时长。投票期过后，将会进行票数统计，如果提案获得通过，就会被生效。

在Moonbeam，用户可以使用其H160地址和私钥（也就是以太坊账户）来创建提案、附议提案和投票提案。

Moonbeam的治理系统正在更新中。下一个阶段的治理称为OpenGov（Governance v2）。在推出过程中，OpenGov将在Moonriver上经过严格测试，然后再通过提案部署至Moonbeam。在正式上线Moonbeam之前，Moonbeam将继续使用Governance v1。因此，**本教程仅适用于Moonbeam上的提案**。如果想要对Moonriver或Moonbase Alpha上的提案进行投票，请参考[如何在OpenGov对提案进行投票](/tokens/governance/voting/opengov-voting){target=_blank}的教程。

本教程将分步概述如何在Moonbeam的Governance v1对公投进行投票。关于Moonbeam治理系统的更多信息，包括Governance v1和OpenGov（Governance v2），请参考[治理概览页面](/learn/features/governance/){target=_blank}。

!!! 注意事项
    本教程将介绍如何在技术层面上投票的机制。Token持有者可以使用[Polkassembly](https://moonbeam.network/tutorial/participate-in-moonbeam-governance-with-polkassembly/){target=_blank}等用户友好性界面的平台进行投票。

## 定义 {: #definitions } 

本教程中重要参数定义如下：

 - **投票期** — Token持有者对提案进行公投的时期（一次公投的时间段）

--8<-- 'text/governance/vote-conviction-definitions.md'

    有关投票乘数参数的更多信息，请参阅[Governance v1文档的信念乘数部分](/learn/features/governance/#conviction-multiplier){target=_blank}

 - **投票数** — 参与投票的Token总量
 - **总选票** — 网络发行的Token总量
 - **最大投票数** — 每个账户的最大投票数
 - **生效等待期** — 提案获得通过和正式生效（制定法律）之间的时间段。这是投票所需的最短锁定期限
 - **锁定期** — 提案生效之后，获胜投票者Token被锁定的时间。 用户仍然可以使用这些Token进行质押或投票
 - **委托** — 将自己的投票权委托给其他账户，以积累一定信念值的行为

=== "Moonbeam"
    |    变量    |                                                        值                                                        |
    |:----------:|:----------------------------------------------------------------------------------------------------------------:|
    | 最大投票数 |                                    {{ networks.moonbeam.democracy.max_votes}}                                    |
    |   投票期   |  {{ networks.moonbeam.democracy.vote_period.blocks}}区块（{{ networks.moonbeam.democracy.vote_period.days}}天）   |
    | 生效等待期 | {{ networks.moonbeam.democracy.enact_period.blocks}}区块（{{ networks.moonbeam.democracy.enact_period.days}}天） |

## 提案步骤 {: #roadmap-of-a-proposal } 

本教程将涵盖下方提案步骤图的突出显示的步骤。首先，您将学习如何对公投进行投票。

您可以在[治理概览页面的Governance v1提案步骤](/learn/features/governance/#roadmap-of-a-proposal){target=_blank}部分找到详细的解释。

![Proposal Roadmap](/images/tokens/governance/voting/v1/proposal-roadmap.png)

--8<-- 'text/governance/forum-discussion.md'

## 参与公投 {: #voting-on-a-referendum } 

此部分将介绍公投的投票流程。本教程使用已经创建的公投进行讲解（请参阅[如何发起提案](/tokens/governance/proposals/){target=blank}的教程）。

!!! 注意事项
    本教程在定制版本的Moonbeam上进行操作，发布/生效等待期较短，仅作演示用途。您可以调整这些设定。

要在网络中对提案进行投票，您需要使用Polkadot.js Apps界面。为此，您需要先导入以太坊格式的地址（H160地址），您可以通过[创建或导入H160账户](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank}教程完成此步骤。在本示例中，我们导入了三个账户，并分别命名为Alice、Bob和Charley。

![Accounts in Polkadot.js](/images/tokens/governance/voting/v1/vote-1.png)

将要投票的提案将在链上永久嵌入备注"This is a unique string."。

### 如何投票 {: #how-to-vote } 

在Moonbeam上对提案进行投票非常简单。前往[Moonbeam的Polkadot.js Apps界面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network){target=_blank}，所有治理相关功能都在**Democracy**标签下。如下图所示，可以看到Democracy旁边有个数字，说明有待处理民主事项（可能是提案或公投）。点击描述旁的箭头，就可以看到您要投票的公投情况。提案和描述旁的数字称为“公投编号”（在本示例中为`20`）。准备就绪后，点击**Vote**按钮。

![Vote Button](/images/tokens/governance/voting/v1/vote-2.png)

此处，您需要提供以下信息：

 1. 选择您想要投票使用的账户

 2. 输入投票的Token数量。这些Token将被锁定，在下一步可设定锁定期。请记住，您需要预留少量的Token作为Gas费。如果您试图用全部余额来投票，交易将失败

 3. 设置投票信念值，这会决定投票权重（`vote_weight = tokens * conviction_multiplier`）。请参考[信念乘数](/learn/features/governance/#conviction-multiplier){target=_blank}文档获取更多信息

 4. 点击**Vote Aye**表示赞成提案，点击**Vote Nay**表示反对提案，然后签署交易

![Vote Submission](/images/tokens/governance/voting/v1/vote-3.png)

!!! 注意事项
    上图显示的锁定期仅供参考。本教程在定制版本的Moonbeam上进行操作，发布/生效等待期较短，仅作演示用途。

在本示例中，Alice和Bob决定投赞成票**Vote Aye**，信念值为`6x`。而Charley决定投反对票**Vote Nay**，但选择不锁定任何Token（他的Token仅在公投期间锁定），因此他的信念值为`0.1x`。在**Democracy**标签下可以看到目前票数分布下的投票结果。

![Vote Information](/images/tokens/governance/voting/v1/vote-4.png)

从上述投票演示中可以得出：

 - Alice的投票权重为60000，由她的10000枚锁定Token乘以6倍信念值得出
 - Bob的投票权重为60，由他的10枚锁定Token乘以6倍信念值得出
 - Charley的投票权重为0.8，他用8枚Token投票，但没有锁定期（仅在公投期间锁定），因此信念乘数只有0.1
 - 投票剩余时间和距离提案生效（假定提案获得批准）时间都会显示在屏幕上
 - 参与投票数仅为0.09%。计算方式为参与投票Token总量（10018枚）除以网络流通Token总量（本示例中为1113万枚）
 - 虽然投票人数很低，但提案还是因为获得了绝对多数赞成票而初步通过。更多详情可以在[正投票率偏向机制](/learn/features/governance/#positive-turnout-bias)找到
 - 请记下公投编号，这将用于锁定期结束后解锁Token。目前，一旦提案被生效后，无法查看公投编号

投票期结束后，已通过的提案可以在**Dispatch**标签下查看。您也可以在这里看到距离提案生效的时间。

![Proposal Enactment](/images/tokens/governance/voting/v1/vote-5.png)

### 委托投票 {: #delegate-voting } 

Token持有者可以选择将投票权委托给其它信任的账户。受委托的账户不需要进行额外的操作。在受委托账户进行投票时，委托账户的投票权重（委托者锁定的Token数量乘以委托者选择的信念乘数）会直接加到受委托账户的权重中。

要进行委托投票，首先要进入**Developer**标签下的**Extrinsics**菜单。

![Extrinsics Menu](/images/tokens/governance/voting/v1/vote-6.png)

!!! 注意事项
    如果您试图将Token委托给一个已经投过票的人，该交易会失败。请考虑使用一个新的账户来执行以下步骤。

此处，您需要提供以下信息：

 1. 选择需要委托的账户

 2. 选择希望交互的pallet。在本示例中为`democracy` pallet

 3. 选择交易使用的extrinsic函数。这将决定接下来的步骤中要填写的内容。在本示例中为`delegate` extrinsic

 4. 选择委托投票给的账户

 5. 设置投票信念值，这将决定投票权重（`vote_weight = tokens * conviction_multiplier`）。信念乘数与Token锁定的生效等待期相关。因此，锁定期越长，投票权重越高。您也可以选择不锁定Token，但投票权重会大大下降

 6. 设定委托到此账户的Token数量

 7. 点击**Submit Transaction**按钮并签署交易

![Extrinsics Transaction for Delegation](/images/tokens/governance/voting/v1/vote-7.png)

在本示例中，Alice委托了1000的投票权重（1000枚Token乘以信念值1）给Charley。为验证此委托，请点击左侧蓝色圈，会显示此处存在一个委托。

![View Delegation](/images/tokens/governance/voting/v1/vote-8.png)

!!! 注意事项
    委托投票的另一个方法是在**Accounts**标签下点击委托账户名称后的三个竖着的点，并填写上述相关信息。

被委托账户开始投票时，委托的总投票权重将分配给该账户所选择的选项。在本示例中，Charley决定投票支持公投中的某一提案。他以800的投票权重（800枚Token乘以信念值1）进行了投票。但由于Alice向他委托了1000的投票权重，因此他的赞成总投票权重将为1800。

![Total Votes with Delegation](/images/tokens/governance/voting/v1/vote-9.png)

重复上述步骤也可撤销委托，只需要在第3步选择`undelegate` extrinsic进行操作即可。

从上述委托投票的演示中可以得出：

 - 如果Token持有者想要撤销投票委托，但委托投票已经在公投中使用了，那么他们将在最终票数中移除
 - 进行委托的Token持有者也要遵守锁定期规则。也就是说，如果被委托者赢得了投票，委托者的委托Token也会进入相应的锁定期
 - 已委托的Token不再属于Token持有者的自由余额。如需了解更多余额类型，可以访问[Free vs. Reserved vs. Locked vs. Vesting Balance](https://wiki.polkadot.network/docs/build-protocol-info#free-vs-reserved-vs-locked-vs-vesting-balance)波卡Wiki页面
 - 已经委托他人的Token持有者自己不能再参与公投。如要参与，需先撤销委托
 - 请记下公投编号。锁定期结束后，已委托他人的Token持有者需要手动解锁Token。这个操作需要知道公投编号

### 解锁Token {: #unlocking-locked-tokens } 

Token持有者在投票时，使用的Token将被锁定且不能进行转移。您可以在**Accounts**标签下展开账户详情查看Token锁定情况。在详情中可以看到不同的余额类型。如果光标移动至**democracy**右侧图标上，就会出现目前锁定状态的信息面板。其中不同的锁定状态有：

 - 因公投进行中而锁定，意味着您已经使用了Token，即使您并没有选择信念乘数锁定，也必须等到公投结束才能解锁
 - 根据信念乘数进行锁定，会显示剩余区块数量和时间
 - 锁定期结束，意味着您可以解锁并取回Token

![Account Lock Status](/images/tokens/governance/voting/v1/vote-10.png)

锁定期结束即可取回Token。请在**Developers**标签下的**Extrinsics**菜单中进行操作。

![Extrinsics Menu](/images/tokens/governance/voting/v1/vote-11.png)

在此，我们需要发送两个不同的extrinsics。首先需要提供以下信息：

 1. 选择取回Token的存放账户

 2. 选择希望交互的pallet。在本示例中为`democracy` pallet

 3. 选择交易使用的extrinsic函数。这将决定接下来的步骤中要填写的内容。在本示例中为`removeVote` extrinsic。这是解锁Token的必要步骤。通过这一操作也可以移除您在公投中已投下的票数

 4. 输入公投编号。这是**Democracy**标签左侧显示的数字。在本示例中为0

 5. 点击**Submit Transaction**按钮并签署交易

![Remove Vote Extrinsics](/images/tokens/governance/voting/v1/vote-12.png)

下一个extrinsic，您需要提供以下信息：

 1. 选择取回Token的存放账户

 2. 选择您想要交互的pallet。在本示例中为`democracy` pallet

 3. 选择交易使用的extrinsic函数。这将决定接下来的步骤中要填写的内容。在本示例中为`unlock` extrinsic

 4. 输入接收解锁Token的目标账户。在本示例中，token将退还给Alice

 5. 点击**Submit Transaction**按钮并签署交易

![Unlock Extrinsics](/images/tokens/governance/voting/v1/vote-13.png)

交易完成后，锁定的Token将被解锁。您可以返回到**Accounts**标签进行检查。在本示例中，可以看到Alice已恢复了原有余额，余额状态显示为**transferable**。

![Check Balance](/images/tokens/governance/voting/v1/vote-14.png)