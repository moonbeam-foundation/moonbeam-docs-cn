---
title: How to Vote on a Proposal 如何对提案进行投票
description: Learn how to vote on a proposal and lock your tokens to either support or reject a proposal put forth for a referendum on Moonbeam via Governance v1 features.
学习如何通过Governance v1功能对Moonbeam上进行公投的提案进行投票并锁定Token以支持或否决提案
---

# How to Vote on a Proposal in Governance v1 如何在Governance v1对提案进行投票

![Governance Moonbeam Banner](/images/tokens/governance/voting/voting-banner.png)

## Introduction 概览 {: #introduction } 

Once a proposal reaches public referenda, token holders can vote on it using their own tokens. Two factors defined the weight a vote has: the number of tokens locked and lock duration (called Conviction). This is to ensure that there is an economic buy-in to the result to prevent vote-selling. Consequently, the longer you are willing to lock your tokens, the stronger your vote will be weighted. You also have the option of not locking tokens at all, but vote weight is drastically reduced.

提案进入公投阶段后，Token持有者可以使用持有的Token进行投票。影响投票权重的因素有两个：Token锁定量和锁定期（称为“信念值”）。这可以从经济利益上确保不会出现兜售投票权的现象。因此，锁定期越长，投票权重越高。用户也可以选择不锁定Token，但投票权重会大大下降。

Referenda are simple, inclusive, and stake-based voting schemes. Each referendum has a proposal associated with it that suggests an action to take place. They have a fixed duration, after which votes are tallied, and the action is enacted if the vote is approved.

公投是简单的、包容的和基于质押的投票方案。每一次公投都有一个与之相关的具体的提议。公投有固定的时长。投票期过后，将会进行票数统计，如果提案获得通过，就会被生效。

In Moonbeam, users will be able to create, second, and vote on proposals using their H160 address and private key, that is, their regular Ethereum account!

在Moonbeam，用户可以使用其H160地址和私钥（也就是以太坊账户）来创建提案、附议提案和投票提案。

Moonbeam's governance system is in the process of getting revamped! This next phase of governance is known as OpenGov (Governance). During the roll-out process, OpenGov will be rigorously tested on Moonriver before a proposal will be made to deploy it on Moonbeam. Until it launches on Moonbeam, Moonbeam will continue to use Governance v1. As such, **this guide is for proposals on Moonbeam only**. If you're looking to vote on a proposal on Moonriver or Moonbase Alpha, you can refer to the [How to Vote on a Proposal in OpenGov](/tokens/governance/voting/opengov-voting){target=_blank} guide.

Moonbeam的治理系统正在更新中。下一个阶段的治理称为OpenGov。在推出过程中，OpenGov将在Moonriver上经过严格测试，然后再通过提案部署至Moonbeam。在正式上线Moonbeam之前，Moonbeam将继续使用Governance v1。因此，**本教程仅适用于Moonbeam上的提案**。如果想要对Moonriver或Moonbase Alpha上的提案进行投票，请参考[如何在OpenGov对提案进行投票](/tokens/governance/voting/opengov-voting){target=_blank}的教程。

This guide will outline the process, with step-by-step instructions, of how to vote on referenda in Governance v1 on Moonbeam. For more information on Moonbeam's governance system, including Governance v1 and OpenGov (Governance v2), please refer to the [governance overview page](/learn/features/governance/){target=_blank}.

本教程将概述如何在Moonbeam的Governance v1对公投进行投票，并提供分步教程。关于Moonbeam治理系统的更多信息，包括Governance v1和OpenGov（Governance v2），请参考[治理概览页面](/learn/features/governance/){target=_blank}。

!!! note 注意事项
    This page goes through the mechanics on how to vote at a more techincal level. Token holders can leverage platforms such as [Polkassembly](https://moonbeam.network/tutorial/participate-in-moonbeam-governance-with-polkassembly/){target=_blank} to vote using a more friendly user interface. 

本教程将介绍如何在技术层面上投票的机制。Token持有者可以使用[Polkassembly](https://moonbeam.network/tutorial/participate-in-moonbeam-governance-with-polkassembly/){target=_blank}等用户友好性界面的平台进行投票。

## Definitions 定义 {: #definitions } 

Some of the key parameters for this guide are the following:

本教程中重要参数定义如下：

 - **Voting Period** — the time token holders have to vote for a referendum (duration of a referendum)
 - **投票期** — Token持有者对提案进行公投的时期（一次公投的时间段）

--8<-- 'text/governance/vote-conviction-definitions.md'

    For more information on the vote multiplier parameters, please refer to the [Conviction Multiplier section of the Governance v1 docs](/learn/features/governance/#conviction-multiplier){target=_blank}

 - **Turnout** — the total number of voting tokens
 - **投票数** — 参与投票的Token总量
 - **Electorate** — the total number of tokens issued in the network
 - **总选票 ** — 网络发行的Token总量
 - **Maximum number of votes** — the maximum number of votes per account
 - **最高票数** — 每个账户的最高票数
 - **Enactment Period** — the time between a proposal being approved and enacted (make law). It is also the minimum locking period when voting
 - **生效等待期** — 提案获得通过和正式生效（制定法律）之间的时间段。这是投票所需的最短锁定期限
 - **Lock Period** — the time (after the proposal's enactment) that tokens of the winning voters are locked. Users can still use these tokens for staking or voting
 - **锁定期** — 提案生效之后，获胜投票者Token被锁定的时间。 用户仍然可以使用这些Token进行质押或投票
 - **Delegation** — the act of transferring your voting power to another account for up to a certain conviction
 - **委托** — 将自己的投票权委托给其他账户，以积累一定信念值的行为

=== "Moonbeam"
    |        Variable变量         |                                                         Value值                                                         |
    |:-----------------------:|:---------------------------------------------------------------------------------------------------------------------:|
    | Maximum number of votes 最高票数 |                                      {{ networks.moonbeam.democracy.max_votes}}                                       |
    |      Voting Period 投票期      |  {{ networks.moonbeam.democracy.vote_period.blocks}}区块（{{ networks.moonbeam.democracy.vote_period.days}天）  |
    |    Enactment Period 生效等待期     | {{ networks.moonbeam.democracy.enact_period.blocks}}区块（{{ networks.moonbeam.democracy.enact_period.days}}天） |

## Roadmap of a Proposal 提案步骤 {: #roadmap-of-a-proposal } 

This guide will cover the steps highlighted in the proposal roadmap diagram below. Primarily, you'll be learning how to vote on public referenda.

本教程将涵盖下方显示提案步骤图的重要步骤。首先，您将学习如何对公投进行投票。

You can find a full explanation of the [happy path for a Governance v1 proposal on the Governance overview page](/learn/features/governance/#roadmap-of-a-proposal){target=_blank}.

您可以在[治理概览页面的Governance v1提案步骤](/learn/features/governance/#roadmap-of-a-proposal){target=_blank}部分找到详细的解释。

![Proposal Roadmap](/images/tokens/governance/voting/proposal-roadmap.png)

--8<-- 'text/governance/forum-discussion.md'

## Voting on a Referendum 参与公投 {: #voting-on-a-referendum } 

This section goes over the process of voting on a referendum. The guide assumes that there is one already taking place, in this case, the one created in the [How to Propose an Action](/tokens/governance/proposals/){target=_blank} guide.

此部分将介绍公投的投票流程。本教程使用已经创建的公投进行讲解（请参阅[如何发起提案](/tokens/governance/proposals/){target=blank}的公投）。

!!! note 注意事项
    This guide was done with a customized version of Moonbeam with short Launch/Enactment Periods for demonstration purposes only. You can adapt these instructions for Moonbeam.

本教程在定制版本的Moonbeam上进行操作，发布/生效等待期较短，仅作演示用途。您可以调整这些设定。

To vote on a proposal in the network, you need to use the Polkadot.js Apps interface. To do so, you need to import an Ethereum-style account first (H160 address), which you can do by following the [Creating or Importing an H160 Account](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank} guide. For this example, three accounts were imported and named with super original names: Alice, Bob, and Charley.

要在网络中对提案进行投票，您需要使用Polkadot.js Apps接口。为此，您需要先导入以太坊格式的地址（H160地址），您可以通过[创建或导入H160账户](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank}教程完成此步骤。在本示例中，我们导入了三个账户，并分别命名为Alice、Bob和Charley。

![Accounts in Polkadot.js](/images/tokens/governance/voting/vote-1.png)

The proposal being voted will embed the remark "This is a unique string." on chain permanently.

正在投票的提案将在链上永久嵌入备注"This is a unique string."。

### How to Vote 如何投票 {: #how-to-vote } 

To get started, you'll need to navigate to [Moonbeam's Polkadot.js Apps interface](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network){target=_blank}. Everything related to governance lives under the **Democracy** tab, where (in the image) you can note that there is a number next to it, indicating there are democracy items pending (either proposals or referenda). Once there, you can view the details of the referendum you want to vote by clicking on the arrow next to the description. The number next to the action and description it is called the referendum index (in this case, it is `20`). When ready, click on the **Vote** button.

在Moonbeam上对提案进行投票非常简单。前往[Moonbeam的Polkadot.js Apps界面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network){target=_blank}，所有治理相关功能都在**Democracy**标签下。如下图所示，可以看到Democracy旁边有个数字，说明有待处理民主事项（可能是提案或公投）。点击描述旁的箭头，就可以看到您要投票的公投情况。提案和描述旁的数字称为“公投指数”（在本示例中为0）。准备就绪后，点击**Vote**按钮。

![Vote Button](/images/tokens/governance/voting/vote-2.png)

Here, you need to provide the following information:

此处，您需要提供以下信息：

 1. Select the account with which you want to vote

    选择您想要投票使用的账户

 2. Enter the number of tokens that you want to vote with. These will be locked for the amount of time specified in the next step. Remember, you need to save a small amount of tokens for gas. If you try to vote with your entire balance the transaction will fail.

    输入投票的Token数量。这些Token将被锁定，在下一步可设定锁定期。请记住，您需要预留少量的Token作为Gas费。如果您试图用全部余额来投票，交易将失败

 3. Set the vote conviction, which determines its weight (`vote_weight = tokens * conviction_multiplier`). Please refer to the [Conviction Multiplier](/learn/features/governance/#conviction-multiplier){target=_blank} docs for more information

    设置投票信念值，这会决定投票权重（`vote_weight = tokens * conviction_multiplier`）。请参考[信念乘数](/learn/features/governance/#conviction-multiplier){target=_blank}文档获取更多信息

 4. Click on **Vote Aye** to approve the proposal or **Vote Nay** to disapprove the proposal, and then sign the transaction

    点击**Vote Aye**表示赞成提案，点击**Vote Nay**表示反对提案，然后签名确认交易

![Vote Submission](/images/tokens/governance/voting/vote-3.png)

!!! note 注意事项
    The lockup periods shown in the previous image are not to be taken as reference. This guide was done with a customized version of Moonbeam with short Launch/Enactment Periods for demonstration purposes only.

上图显示的锁定期仅供参考。本教程在定制版本的Moonbeam上进行操作，发布/生效等待期较短，仅作演示用途。

In this case, Alice and Bob have decided to **Vote Aye** on the proposal with a Conviction of `6x`. On the other hand, Charley has decided to **Vote Nay** on the proposal but chose not to lock any tokens (his tokens are only locked during the duration of the referendum), so his Conviction was `0.1x`. With such vote distributions, the partial results can be seen in the main **Democracy** tab.

在本示例中，Alice和Boc决定投赞成票**Vote Aye**，信念值为`6x`。而Charley决定投反对票**Vote Nay**，但选择不锁定任何Token（他的Token仅在公投期间锁定），因此他的信念值为`0.1x`。在**Democracy**标签下可以看到目前票数分布下的投票结果。

![Vote Information](/images/tokens/governance/voting/vote-4.png)

From voting, there are some key takeaways:

从上述投票演示中可以得出：

 - Alice's weighted vote is 60000 units. That is, her 10000 locked tokens multiplied her Conviction by x6
 - Alice的投票权重为60000，由她的10000枚锁定Token乘以6倍信念值得出
 - Bob's weighted vote is 60 units. That is, his 10 locked tokens multiplied his Conviction by x6
 - Bob的投票权重为60，由他的10枚锁定Token乘以6倍信念值得出
 - Charley's weighted vote is 0.8 units. That is, his 8 tokens with no locking period (only during referendum) made his Conviction factor x0.1
 - Charley的投票权重为0.8，他用8枚Token投票，但没有锁定期（仅在公投期间锁定），因此信念乘数只有0.1
 - Both the remaining voting period and time before the proposal is enacted (if passed) are shown on the screen
 - 投票剩余时间和距离提案生效（假定提案获得批准）时间都会显示在屏幕上
 - The overall turnout (in percentage) is just 0.09%. This is calculated as the total number of voting tokens (10018) divided by the total amount of tokens in the network (11.13M in this case)
 - 参与投票数仅为0.09%。计算方式为参与投票Token总量（10018枚）除以网络流通Token总量（本示例中为1113万枚）
 - Even though the turnout is quite low, the proposal is tentatively approved because of the super-majority approval. More information can be found in the [Positive Turnout Bias](/learn/features/governance/#positive-turnout-bias) section
 - 虽然投票人数很低，但提案还是因为获得了绝对多数赞成票而初步通过。更多详情可以在[正投票率偏向机制](#positive-turnout-bias)找到
 - It is important to write down the referendum index, as this is needed to unlock the tokens later when the locking period expires. Currently there is no way to retrieve the referendum index once it has been enacted
 - 请记下公投指数，这将用于锁定期结束后解锁Token。目前，一旦提案被生效后，无法查看公投指数

After the voting period has expired, the proposal will be visible under the **Dispatch** tab if approved. In here, you can also see the time remaining until the proposal is enacted.

投票期结束后，已通过的提案可以在**Dispatch**标签下查看。您也可以在这里看到距离提案生效的时间。

![Proposal Enactment](/images/tokens/governance/voting/vote-5.png)

### Delegate Voting 委托投票 {: #delegate-voting } 

Token holders have the option to delegate their vote to another account whose opinion they trust. The account being delegated does not need to make any particular action. When they vote, the vote weight (that is, tokens times the Conviction multiplier chose by the delegator) is added to its vote.

Token持有者可以选择将投票权委托给其它信任的账户。受委托的账户不需要进行额外的操作。在受委托账户进行投票时，委托账户的投票权重（委托者锁定的Token数量乘以委托者选择的信念乘数）会直接加到受委托账户的权重中。

To delegate your vote, first, navigate to the **Extrinsics** menu under the **Developers** tab.

要进行委托投票，首先要进入**Developer**标签下的**Extrinsics**菜单。

![Extrinsics Menu](/images/tokens/governance/voting/vote-6.png)

!!! note 注意事项
    If you try to delegate tokens to a person who has already voted, the transaction will fail. Consider using a new account for the below steps.

如果您试图将Token委托给一个已经投过票的人，该交易会失败。请考虑使用一个新的账户来执行以下步骤。

Here, you need to provide the following information:

此处，您需要提供以下信息：

 1. Select the account from which you want to delegate your vote

    选择需要委托的账户

 2. Choose the pallet you want to interact with. In this case, it is the `democracy` pallet

    选择希望交互的pallet。在本示例中为`democracy` pallet

 3. Choose the extrinsic method to use for the transaction. This will determine the fields that need to fill in the following steps. In this case, it is `delegate` extrinsic

    选择交易使用的extrinsic函数。这将决定接下来的步骤中要填写的内容。在本示例中为`delegate` extrinsic

 4. Select the account to which you want to delegate your vote

    选择委托投票的账户

 5. Set the vote conviction, which determines its weight (`vote_weight = tokens * conviction_multiplier`). The Conviction multiplier is related to the number of enactment periods the tokens will be locked for. Consequently, the longer you are willing to lock your tokens, the stronger your vote will be weighted. You also have the option of not locking tokens at all, but vote weight is drastically reduced

    设置投票信念值，这将决定投票权重（`vote_weight = tokens * conviction_multiplier`）。信念乘数与Token锁定的生效等待期相关。因此，锁定期越长，投票权重越高。您也可以选择不锁定Token，但投票权重会大大下降

 6. Set the number of tokens you want to delegate to the account provided before

    设定委托到此账户的Token数量

 7. Click the **Submit Transaction** button and sign the transaction

    点击**Submit Transaction**按钮并签名确认交易

![Extrinsics Transaction for Delegation](/images/tokens/governance/voting/vote-7.png)

In this example, Alice delegated a total weight of 1000 (1000 tokens with an x1 Conviction factor) to Charley. To verify the delegation, click the blue circle on the left that indicates a delegation exists.

在本示例中，Alice委托了1000的投票权重（1000枚Token乘以信念值1）给Charley。为验证此委托，请点击左侧蓝色圈，会显示此处存在一个委托。

![View Delegation](/images/tokens/governance/voting/vote-8.png)

!!! note 注意事项
    Another way to delegate votes is under the **Accounts** tab. Click on the three dots of the account from which you want to delegate your vote and fill in the information as before.

委托投票的另一个方法是在**Accounts**标签下点击委托账户名称后的“…”，并填写上述相关信息。

Once the account you have delegated your vote to votes, the total vote weight delegated will be allocated to the option that the account selected. For this example, Charley has decided to vote in favor of a proposal that is in public referendum. He voted with a total weight of 800 (800 tokens with an x1 Conviction factor). But because Alice delegated 1000 vote weight to him, **Aye** votes total 1800 units.

被委托账户开始投票时，总投票权重将自动叠加。在本示例中，Charley决定投票支持公投中的某一提案。他以800的投票权重（800枚Token乘以信念值1）进行了投票。但由于Alice向他委托了1000的投票权重，因此他的赞成总投票权重将为1800。

![Total Votes with Delegation](/images/tokens/governance/voting/vote-9.png)

To remove delegation, repeat the process described before, but select the `undelegate` extrinsic in step 3.

重复上述步骤也可撤销委托，只需要在第3步选择`undelegate`进行操作即可。

From vote delegation, there are some key takeaways:

从上述委托投票的演示中可以得出：

 - If a token holder were to remove the vote delegation during a public referendum where the delegated votes were used, these would be removed from the tally
 - 如果Token持有者想要撤销委托，但委托权重已经在公投中使用了，那么这些权重将在最终票数中移除
 - A token holder that delegated votes still has an economic buy-in. This means that if the option the delegator selected were to win, the tokens delegated are locked for the number of Lock Periods
 - 进行委托的Token持有者也要遵守锁定期规则。也就是说，如果被委托者赢得了投票，委托者的委托Token也会进入相应的锁定期
 - The tokens delegated for voting are no longer part of the token holder's free balance. To read more about the types of balances, you can visit the Polkadot Wiki page on [Free vs. Reserved vs. Locked vs. Vesting Balance](https://wiki.polkadot.network/docs/build-protocol-info#free-vs-reserved-vs-locked-vs-vesting-balance)
 - 已委托的Token不再属于Token持有者的自由余额。如需了解更多余额类型，可以访问[Free vs. Reserved vs. Locked vs. Vesting Balance](https://wiki.polkadot.network/docs/build-protocol-info#free-vs-reserved-vs-locked-vs-vesting-balance)
 - A token holder that delegated tokens can't participate in public referendum. First, the token holder must undelegate his vote
 - 已经委托他人的Token持有者自己不能再参与公投。如要参与，需先撤销委托
 - A token holder that delegated tokens needs to manually unlock his locked tokens after the locking period has expired. For this, it is necessary to know the referendum index
 - 请记下公投指数，锁定期结束后，已委托他人的Token持有者需要手动解锁Token

### Unlocking Locked Tokens 解锁Token {: #unlocking-locked-tokens } 

When token holders vote, the tokens used are locked and cannot be transferred. You can verify if you have any locked tokens in the **Accounts** tab, expanding the address's account details to query. There, you will see different types of balances. If you hover over the icon next to **democracy**, an information panel will show telling you the current status of your lock. Different lock status includes:

Token持有者在投票时，使用的Token将被锁定且不能进行转移。您可以在**Accounts**标签下展开账户详情查看Token锁定情况。在详情中可以看到不同的余额类型。如果光标在**democracy**右侧图标上移动，就会出现目前锁定状态的信息面板。其中不同的锁定状态有：

 - Locked because of an ongoing referendum, meaning that you've used your tokens and have to wait until the referendum finishes, even if you've voted with a no-lock Conviction factor
 - 因公投进行中而锁定，意味着您已经使用了Token，即使您并没有选择信念乘数锁定，也必须等到公投结束才能解锁
 - Locked because of the Conviction multiplier selected, displaying the number of blocks and time left
 - 根据信念乘数进行锁定，会显示剩余区块数量和时间
 - Lock expired, meaning that you can now get your tokens back
 - 锁定期结束，意味着您可以解锁并取回Token

![Account Lock Status](/images/tokens/governance/voting/vote-10.png)

Once the lock is expired, you can request your tokens back. To do so, navigate to the **Extrinsics** menu under the **Developers** tab.

锁定期结束即可取回Token。请在**Developers**标签下的**Extrinsics**菜单中进行操作。

![Extrinsics Menu](/images/tokens/governance/voting/vote-11.png)

Here, two different extrinsics need to be sent. First, you need to provide the following information:

在此，我们需要发送两个不同的extrinsics。首先需要提供以下信息：

 1. Select the account from which you want to recover your tokens

    选择取回Token的存放账户

 2. Choose the pallet you want to interact with. In this case, it is the `democracy` pallet

    选择希望交互的pallet。在本示例中为`democracy` pallet

 3. Choose the extrinsic method to use for the transaction. This will determine the fields that need to fill in the following steps. In this case, it is `removeVote` extrinsic. This step is necessary to unlock the tokens. This extrinsic can be used as well to remove your vote from a referendum

    选择交易使用的extrinsic函数。这将决定接下来的步骤中要填写的内容。在本示例中为`removeVote` extrinsic。这是解锁Token的必要步骤。通过这一操作也可以移除您在公投中已投下的票数

 4. Enter the referendum index. This is the number that appeared on the left-hand side in the **Democracy** tab. In this case, it is 0

    输入公投指数。这是**Democracy**标签左侧显示的数字。在本示例中为0

 5. Click the **Submit Transaction** button and sign the transaction

    点击**Submit Transaction**按钮并签署交易

![Remove Vote Extrinsics](/images/tokens/governance/voting/vote-12.png)

For the next extrinsic, you need to provide the following information:

下一个extrinsic，您需要提供以下信息：

 1. Select the account from which you want to recover your tokens

    选择取回Token的存放账户

 2. Choose the pallet you want to interact with. In this case, it is the `democracy` pallet

    选择您想要交互的pallet。在本示例中为`democracy` pallet

 3. Choose the extrinsic method to use for the transaction. This will determine the fields that need to fill in the following steps. In this case, it is `unlock` extrinsic

    选择交易使用的extrinsic函数。这将决定接下来的步骤中要填写的内容。在本示例中为`unlock` extrinsic

 4. Enter the target account that will receive the unlocked tokens. In this case, the tokens will be returned to Alice

    输入接收解锁Token的目标账户。在本示例中为Alice

 5. Click the **Submit Transaction** button and sign the transaction

    点击**Submit Transaction**按钮并签署交易

![Unlock Extrinsics](/images/tokens/governance/voting/vote-13.png)

Once the transaction goes through, the locked tokens should be unlocked. To double-check, you can go back to the **Accounts** tab and see that, for this example, Alice has her full balance as **transferable**.

交易完成后，锁定的Token将被解锁。您可以返回到**Accounts**标签进行检查。在本示例中，可以看到Alice已恢复了原有余额，余额状态显示为**transferable**。

![Check Balance](/images/tokens/governance/voting/vote-14.png)