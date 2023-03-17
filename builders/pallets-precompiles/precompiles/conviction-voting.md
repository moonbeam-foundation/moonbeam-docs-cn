---
title: Conviction Voting Precompile Contract
description: Learn how to vote on referenda, set up voting delegations, and more, directly through a Solidity interface with the Conviction Voting Precompile on Moonbeam.
学习如何直接通过Solidity接口与Moonbeam上的Conviction Voting Precompile进行公投投票、设置投票委托等。
---

# Interacting with the Conviction Voting Precompile 与Conviction Voting Precompile交互

![Precomiled Contracts Banner](/images/builders/pallets-precompiles/precompiles/conviction-voting/conviction-voting-banner.png)

## Introduction 概览 {: #introduction } 

As a Polkadot parachain and decentralized network, Moonbeam features native on-chain governance that enables stakeholders to participate in the direction of the network. With the introduction of OpenGov, also referred to as Governance v2, the Conviction Voting Pallet allows token holders to make, delegate, and manage Conviction-weighted votes on referenda. To learn more about Moonbeam's governance system, such as an overview of related terminology, principles, mechanics, and more, please refer to the [Governance on Moonbeam](/learn/features/governance){target=_blank} page. 

作为波卡平行链和去中心化网络，Moonbeam具有原生链上治理，能够使Token持有者直接参与网络。随着OpenGov（也称为Governance v2）的推出，Conviction Voting Pallet允许Token持有者投票、委托投票，以及管理公投的信念值权重投票。了解关于Moonbeam治理系统的更多信息，例如相关专业术语、原则、机制等，请参考[Moonbeam上的治理](/learn/features/governance){target=_blank}页面。

The Conviction Voting Precompile interacts directly with Substrate's Conviction Voting Pallet. This pallet is coded in Rust and is normally not accessible from the Ethereum API side of Moonbeam. However, the Conviction Voting Precompile allows you to access governance-related functions of the Substrate Conviction Voting Pallet directly from a Solidity interface. Additionally, this enables a vastly improved end-user experience. For example, token holders can vote on referenda or delegate a vote directly from MetaMask, rather than importing an account in Polkadot.js Apps and navigating a complex UI.

Conviction Voting Precompile直接与Substrate的Conviction Voting Pallet交互。此pallet以Rust编码，通常不能从Moonbeam的以太坊API端访问。然而，Conviction Voting Precompile允许您直接从Solidity接口直接获取Substrate Conviction Voting Pallet的治理相关函数。另外，这也将提升终端用户使用体验。举例而言，Token持有者无需在Polkadot.js Apps导入账户并使用复杂的用户界面，而是直接从MetaMask参与公投或委托投票。

The Conviction Voting Precompile is mainly related to OpenGov, which is available on Moonriver and Moonbase Alpha only. If you're looking for similar functionality for Moonbeam, which is still on Governance v1, you can refer to the [Democracy Precompile](/builders/pallets-precompiles/precompiles/democracy){target=_blank} documentation.

Conviction Voting Precompile主要与OpenGov相关，仅可在Moonriver和Moonbase Alpha上使用。如果您想在Moonbeam上使用类似功能，即Governance v1，请参考[Democracy Precompile](/builders/pallets-precompiles/precompiles/democracy){target=_blank}文档。

The Conviction Voting Precompile is located at the following address:

Conviction Voting Precompile位于以下地址：

=== "Moonriver"
     ```
     {{ networks.moonriver.precompiles.conviction_voting }}
     ```

=== "Moonbase Alpha"
     ```
     {{ networks.moonbase.precompiles.conviction_voting }}
     ```

--8<-- 'text/precompiles/security.md'

## The Conviction Voting Solidity Interface - Conviction Voting Solidity接口 {: #the-conviction-voting-solidity-interface } 

[`ConvictionVoting.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=_blank} is a Solidity interface that allows developers to interact with the precompile's methods.

[`ConvictionVoting.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=_blank}是一个Solidity接口，允许开发者使用预编译的函数交互。

The interfaces includes a `Conviction` enum that defines the Conviction multiplier types. The enum has the following variables:

接口包含定义Conviction乘数类型的`Conviction` enum。Enum具有以下变量：

 - **None** -  0.1x votes, unlocked
 - **None** -  0.1倍的投票，无锁定期
 - **Locked1x** - 1x votes, locked for an Enactment Period following a successful vote
 - **Locked1x** - 1倍的投票，投票成功后锁定1个生效等待期
 - **Locked2x** - 2x votes, locked for 2x Enactment Period following a successful vote
 - **Locked2x** - 2倍的投票，投票成功后锁定2个生效等待期
 - **Locked3x** - 4x votes, locked for 4x Enactments Period following a successful vote
 - **Locked3x** - 4倍的投票，投票成功后锁定4个生效等待期
 - **Locked4x** - 8x votes, locked for 8x Enactments Period following a successful vote
 - **Locked4x** - 8倍的投票，投票成功后锁定8个生效等待期
 - **Locked5x** - 16x votes, locked for 16x Enactments Period following a successful vote
 - **Locked5x** - 16倍的投票，投票成功后锁定16个生效等待期
 - **Locked6x** - 32x votes, locked for 32x Enactments Period following a successful vote
 - **Locked6x** - 32倍的投票，投票成功后锁定32个生效等待期

The interface includes the following functions:

接口包含以下函数：

- **voteYes**(*uint32* pollIndex, *uint256* voteAmount, *Conviction* conviction) - votes a Conviction-weighted "Aye" on a poll (referendum)
- **voteYes**(*uint32* pollIndex, *uint256* voteAmount, *Conviction* conviction) - 在全民投票（公投）中投“赞成”票（包含信念值权重）
- **voteNo**(*uint32* pollIndex, *uint256* voteAmount, *Conviction* conviction) - votes a Conviction-weighted "Nay" on a poll (referendum)
- **voteNo**(*uint32* pollIndex, *uint256* voteAmount, *Conviction* conviction) - 在全民投票（公投）中投“反对”票（包含信念值权重）
- **removeVote**(*uint32* pollIndex) - [removes a vote](/builders/pallets-precompiles/pallets/conviction-voting/#extrinsics){target=_blank} in a poll (referendum)
- **removeVote**(*uint32* pollIndex) - 在全民投票（公投）中[移除投票](/builders/pallets-precompiles/pallets/conviction-voting/#extrinsics){target=_blank}
- **removeOtherVote**(*address* target, *uint16* trackId, *uint32* pollIndex) - [removes a vote](/builders/pallets-precompiles/pallets/conviction-voting/#extrinsics){target=_blank} in a poll (referendum) for another voter
- **removeOtherVote**(*address* target, *uint16* trackId, *uint32* pollIndex) - 为另一个投票者在全民投票（公投）中[移除投票](/builders/pallets-precompiles/pallets/conviction-voting/#extrinsics){target=_blank}
- **delegate**(*uint16* trackId, *address* representative, *Conviction* conviction, *uint256* amount) - delegates another account as a representative to place a Conviction-weighted vote on the behalf of the sending account for a specific Track
- **delegate**(*uint16* trackId, *address* representative, *Conviction* conviction, *uint256* amount) - 委托另一个账户作为代表为特定Track的发送账户进行信念值权重投票
- **undelegate**(*uint16* trackId) - removes the caller's vote delegations for a specific Track
- **undelegate**(*uint16* trackId) - 移除调用者对特定Track的投票委托
- **unlock**(*uint16* trackId, *address* target) - unlocks the locked tokens of a specific account for a specific Track
- **unlock**(*uint16* trackId, *address* target) - 为特定Track解除特定账户锁定的Token

Each of these functions have the following parameters:

每个函数拥有以下参数：

- **uint32 pollIndex** - index of the poll (referendum)
- **uint32 pollIndex** - 全民投票（公投）的索引
- **uint256 voteAmount** - the balance to be locked for the vote
- **uint256 voteAmount** - 用于投票锁定的余额
- **Conviction** - represents a value from the aforementioned `Conviction` enum
- **Conviction** - 代表上述`Conviction` enum的数值
- **address target** - the address that has a vote or tokens to be removed or unlocked
- **address target** - 要移除投票/解锁Token的地址
- **uint16 trackId** - the Track ID where the requested changes need to occur
- **uint16 trackId** - 需要发生请求变更的Track ID

The interface also includes the following events:

接口也包含以下事件：

- **Voted**(*uint32 indexed* pollIndex, *address* voter, *bool* aye, *uint256* voteAmount, *uint8* conviction) - emitted when an account makes a vote
- **Voted**(*uint32 indexed* pollIndex, *address* voter, *bool* aye, *uint256* voteAmount, *uint8* conviction) - 当账户投票时发出
- **VoteRemoved**(*uint32 indexed* pollIndex, *address* voter) - emitted when an account's (`voter`) vote has been removed
- **VoteRemoved**(*uint32 indexed* pollIndex, *address* voter) - 当账户（`voter`）的投票被移除时发出
- **VoteRemovedOther**(*uint32 indexed* pollIndex, *address* caller, *address* target, *uint16* trackId) - emitted when an account (`caller`) removed a vote for another account (`target`)
- **VoteRemovedOther**(*uint32 indexed* pollIndex, *address* caller, *address* target, *uint16* trackId) - 当一个账户（`caller`）为另一个账户（`target`）移除投票时发出
- **Delegated**(*uint16 indexed* trackId, *address* from, *address* to, *uint256* delegatedAmount, *uint8* conviction) - emitted when an account (`from`) delegates a Conviction-weighted vote of a given amount to another account (`to`)
- **Delegated**(*uint16 indexed* trackId, *address* from, *address* to, *uint256* delegatedAmount, *uint8* conviction) - 当一个账户（`from`）委托给定数量的信念值权重投票给另一个账户（`to`）时发出
- **Undelegated**(*uint16 indexed* trackId, *address* caller) - emitted when an account's (`caller`) delegations are removed for a specific Track
- **Undelegated**(*uint16 indexed* trackId, *address* caller) - 当为特定Track移除帐户（`caller`）委托时发出
- **Unlocked**(*uint16 indexed* trackId, *address* caller) - emitted when an account's (`caller`) locked tokens are unlocked for a specific Track
- **Unlocked**(*uint16 indexed* trackId, *address* caller) - 当为特定Track解锁帐户（`caller`）的锁定Token时发出

## Interact with the Solidity Interface - 与Solidity接口交互 {: #interact-with-the-solidity-interface }

### Checking Prerequisites 查看先决条件 {: #checking-prerequisites } 

The below example is demonstrated on Moonbase Alpha, however, similar steps can be taken for Moonriver. To follow the steps in this guide, you'll need to have the following: 

以下示例为在Moonbase Alpha上演示，但是步骤也同样适用于Moonriver。开始操作之前，您需要准备以下内容：

 - MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - 安装MetaMask并[连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - An account with some DEV tokens. 拥有DEV Token的账户
 --8<-- 'text/faucet/faucet-list-item.md'

### Remix Set Up - Remix设置 {: #remix-set-up } 

1. Click on the **File explorer** tab

   点击**File explorer**标签

2. Paste a copy of [`ConvictionVoting.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=_blank} into a [Remix file](https://remix.ethereum.org/){target=_blank} named `ConvictionVoting.sol`

   将[`ConvictionVoting.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=_blank}复制粘贴至[Remix文档](https://remix.ethereum.org/){target=_blank}，命名为`ConvictionVoting.sol`

![Copy and paste the referenda Solidity interface into Remix.](/images/builders/pallets-precompiles/precompiles/conviction-voting/conviction-voting-1.png)

### Compile the Contract 编译合约 {: #compile-the-contract } 

1. Click on the **Compile** tab, second from top

   点击**Compile**标签（从上至下第二个）

2. Then to compile the interface, click on **Compile ConvictionVoting.sol**

   然后编译接口，点击**Compile ConvictionVoting.sol**

![Compile the ConvictionVoting.sol interface using Remix.](/images/builders/pallets-precompiles/precompiles/conviction-voting/conviction-voting-2.png)

### Access the Contract 获取合约 {: #access-the-contract } 

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed

   在Remix的**Compile**标签下面，点击**Deploy and Run**。请注意：不是在此处部署合约，而是获取已部署的预编译合约

2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down

   确保在**ENVIRONMENT**下拉菜单中已选择**Injected Provider - Metamask**

3. Ensure **ConvictionVoting.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** field

   确保在**CONTRACT**下拉菜单中已选择**ConvictionVoting.sol**。由于这是一个预编译的合约，因此无需部署，但是您需要在**At Address**字段中提供预编译的地址

4. Provide the address of the Conviction Voting Precompile for Moonbase Alpha: `{{ networks.moonbase.precompiles.referenda }}` and click **At Address**

   为Moonbase Alpha提供Conviction Voting Precompile的地址：`{{ networks.moonbase.precompiles.referenda }}`并点击**At Address**

5. The Conviction Voting Precompile will appear in the list of **Deployed Contracts**

   Conviction Voting Precompile将会出现在**Deployed Contracts**列表当中

![Access the ConvictionVoting.sol interface by provide the precompile's address.](/images/builders/pallets-precompiles/precompiles/conviction-voting/conviction-voting-3.png)

### Vote on a Referendum 参与公投 {: #vote-on-a-referendum } 

You can lock tokens and vote on a referendum at anytime during the Lead-in Period or the Decide Period. In order for a referendum to pass, it needs to garner minimum Approval and Support, which vary by track. For more information on each of the relative periods and the Approval and Support requirments by Track, please refer to the [OpenGov section of the governance overview page](/learn/features/governance/#opengov){target=_blank}.

您可以在带入期或决定期随时锁定Token并参与公投。为了促进公投通过，则需要最低批准数和支持数，但不同的track也会有不同的标准。关于不同时期和Track类别所需的批准和支持要求的更多信息，请参考[治理概览页面的OpenGov部分](/learn/features/governance/#opengov){target=_blank}。

First, you'll need to get the index of the referendum you wish to vote on. To get the index of a referendum, head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/referenda){target=_blank} and take the following steps:

首先，您需要获取您想要参与投票的公投索引。前往[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/referenda){target=_blank}并执行以下步骤以获取公投索引：

1. From the **Governance** tab dropdown, select **Referenda**

   从**Governance**下拉菜单中选择**Referenda**

2. Look for the referenda you want to vote on. You can view more details about a specific referendum by clicking on the triangle icon. If there is no triangle icon, this means that only a proposal hash, and no preimage has been submitted for the proposal

   寻找您想要参与投票的公投。您可以通过点击三角形图标查看特定公投的更多详情。如果没有三角形图标，则说明未提交提案的原像，只有提案哈希

3. Take note of the referendum index

   记录公投索引

![View the list of referenda on Polkadot.js Apps.](/images/builders/pallets-precompiles/precompiles/conviction-voting/conviction-voting-4.png)

Now, you're ready to return to Remix to vote on the referendum via the Conviction Voting Precompile. There are two methods you can use to vote on a referendum: `voteYes` or `voteNo`. As you probably have already figured out, if you're in agreement with the proposal, you'll use `voteYes` and if in disagreement, you'll use `voteNo`. You'll specify the amount of tokens you want to lock with your vote and the Conviction, using index of the Conviction you want to vote with in the [aforementioned `Conviction` enum](#the-conviction-voting-solidity-interface). For example, if you wanted to lock your tokens for the duration of two Enactment Periods following a successful vote, you would enter `2` for the `Locked2x` Conviction. For more information on Convictions, you can check out the [Conviction Multiplier section of the Governance v2 documentation](/learn/features/governance/#conviction-multiplier-v2){target=_blank}.

现在，您可以通过Conviction Voting Precompile返回Remix对公投进行投票。您将使用两种方式参与投票：`voteYes`或`voteNo`。显而易见，如果您赞成公投则选择`voteYes`，如果您反对公投则选择`voteNo`。您将使用您想要在[上述`Conviction` enum](#the-conviction-voting-solidity-interface)中投票的信念值索引来指定您想要通过投票和信念值锁定的Token数量。举例来说，如果您想要在投票成功后的两个生效等待期锁定Token，您可以在`Locked2x` Conviction处输入`2`。更多关于信念值的信息，请参考[Governance v2文档的信念乘数部分](/learn/features/governance/#conviction-multiplier-v2){target=_blank}。

To submit your vote, you can take the following steps:

要提交投票，请执行以下步骤：

1. Expand the Conviction Voting Precompile contract to see the available functions if it is not already open

   展开Conviction Voting Precompile合约查看可用函数

2. Find the **voteYes** or **voteNo** function, however you want to vote, and press the button to expand the section

   找到**voteYes**或**voteNo**函数，选择您想用于投票的函数，并点击按钮展开此部分

3. Enter the index of the referendum to vote on

   输入您想要投票的公投索引

4. Enter the number of tokens to lock in Wei. Avoid entering your full balance here because you need to pay for transaction fees

   输入Token数量（以Wei为单位）锁定。此处请勿输入所有余额数量，需要预留部分以支付交易手续费

5. Enter the Conviction you want to vote with

   输入您想要投票的信念值

6. Press **transact** and confirm the transaction in MetaMask

   点击**transact**并在MetaMask确认交易

![Vote on the proposal using the voteYes function of the Conviction Voting Precompile.](/images/builders/pallets-precompiles/precompiles/conviction-voting/conviction-voting-5.png)

Once the referendum has closed, you can use the Conviction Voting precompile to remove your vote and unlock your tokens.

公投关闭后，您可以使用Conviction Voting Precompile移除投票并解锁Token。

### Delegate a Vote 委托投票 {: #delegate-a-vote }

In addition to voting on a referendum yourself, you can delegate a Conviction-weighted vote to someone who is more knowledgeable on a particular topic to vote on your behalf, a process known as Vote Delegation. You can even delegate a different account for each of the Tracks.

除了对公投进行投票以外，您还可以将信念值权重投票委托给专业人士代表您投票，这一过程称为投票委托。 您甚至可以为每个Track委托不同的帐户。

To get started, you can take the following steps:

为此，请执行以下步骤：

1. Find the **delegate** function and press the button to expand the section

   找到**delegate**函数并点击按钮展开此部分

2. Enter the Track ID of the Track that you want the delegation to be used on. Track IDs can be found in the [Referenda page of Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/referenda){target=_blank}

   输入您想要用于委托的Track的Track ID。您可以在[Polkadot.js Apps的公投页面](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/referenda){target=_blank}找到所有Track ID

3. Enter the delegate account that will have the power to vote on your behalf

   输入代表您参与投票的委托账户

4. Enter the number of tokens they can vote with in Wei. Avoid entering your full balance here because you need to pay for transaction fees

   输入您想要用于投票的Token数量（以Wei为单位）。此处请勿输入所有余额数量，需要预留部分以支付交易手续费

5. Enter the Conviction they can vote with

   输入您想要投票的信念值

6. Press **transact** and confirm the transaction in MetaMask

   点击**transact**并在MetaMask确认交易

![Delegate a vote using the delegate function of the Conviction Voting Precompile.](/images/builders/pallets-precompiles/precompiles/conviction-voting/conviction-voting-6.png)

Now the delegate account can vote on your behalf! If you no longer want a delegate vote to exist, you can remove it using the `undelegate` function of the Conviction Voting Precompile.

现在委托账户可以代表您参与投票！如果您想要取消委托，您可以使用Conviction Voting Precompile的`undelegate`函数移除委托账户。

And that's it! You've completed your introduction to the Conviction Voting Precompile. There are a few more functions that are documented in [`ConvictionVoting.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=_blank} — feel free to reach out on [Discord](https://discord.gg/moonbeam){target=_blank} if you have any questions about those functions or any other aspect of the Conviction Voting Precompile.

这样就可以了！您已经基本了解了Conviction Voting Precompile。在[`ConvictionVoting.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=_blank}文档中记录了更多的函数，如果您对这些函数或在Conviction Voting Precompile方面有任何问题，请随时在[Discord](https://discord.gg/moonbeam){target=_blank}上联系我们。