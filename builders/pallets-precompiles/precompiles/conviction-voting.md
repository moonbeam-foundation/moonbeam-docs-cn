---
title: Conviction Voting Precompile（信念投票预编译）合约
description: 学习如何直接通过Moonbeam上的Conviction Voting Precompile的Solidity接口与进行公投投票、设置投票委托等。
---

# 与Conviction Voting预编译交互

## 概览 {: #introduction }

作为波卡平行链和去中心化网络，Moonbeam具有原生链上治理，能够使Token持有者直接参与网络。随着OpenGov（也称为Governance v2）的推出，Conviction Voting Pallet允许Token持有者在公投中进行、委托以及管理信念值权重投票。了解关于Moonbeam治理系统的更多信息，例如相关专业术语、原则、机制等，请参考[Moonbeam上的治理](/learn/features/governance){target=\_blank}页面。

Conviction Voting Precompile直接与Substrate的Conviction Voting Pallet交互。此pallet以Rust编码，通常不能从Moonbeam的以太坊API端访问。然而，Conviction Voting Precompile允许您直接从Solidity接口直接获取Substrate Conviction Voting Pallet的治理相关函数。此外，这也大大提升了终端用户使用体验。举例而言，Token持有者无需在Polkadot.js Apps导入账户并使用复杂的用户界面，而是直接从MetaMask参与公投或委托投票。

Conviction Voting Precompile位于以下地址：

=== "Moonbeam"

     ```text
     {{ networks.moonbeam.precompiles.conviction_voting }}
     ```

=== "Moonriver"

     ```text
     {{ networks.moonriver.precompiles.conviction_voting }}
     ```

=== "Moonbase Alpha"

     ```text
     {{ networks.moonbase.precompiles.conviction_voting }}
     ```

--8<-- 'text/builders/pallets-precompiles/precompiles/security.md'

## Conviction Voting Solidity接口 {: #the-conviction-voting-solidity-interface }

[`ConvictionVoting.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=\_blank}是一个Solidity接口，允许开发者使用预编译的函数交互。

接口包含定义[Conviction乘数](/learn/features/governance/#conviction-multiplier-v2){target=\_blank}类型的`Conviction`枚举（enum）。这个枚举具有以下变量：

 - **None** -  0.1倍的投票，无锁定期
 - **Locked1x** - 1倍的投票，投票成功后锁定1个生效等待期
 - **Locked2x** - 2倍的投票，投票成功后锁定2个生效等待期
 - **Locked3x** - 4倍的投票，投票成功后锁定4个生效等待期
 - **Locked4x** - 8倍的投票，投票成功后锁定8个生效等待期
 - **Locked5x** - 16倍的投票，投票成功后锁定16个生效等待期
 - **Locked6x** - 32倍的投票，投票成功后锁定32个生效等待期

接口包含以下函数：

- **votingFor**(*address* who, *uint16* trackId) - 返回给定账户和Track的投票
- **classLocksFor**(*address* who) - 返回给定账户的类别锁定
- **voteYes**(*uint32* pollIndex, *uint256* voteAmount, *Conviction* conviction) - 在全民投票（公投）中投“赞成”票（包含信念值权重）
- **voteNo**(*uint32* pollIndex, *uint256* voteAmount, *Conviction* conviction) - 在全民投票（公投）中投“反对”票（包含信念值权重）
- **voteSplit**(*uint32* pollIndex, *uint256* aye, *uint256* nay) - 分开投票，在给定投票（公投）中一定数量为"Aye"锁定或是一定数量为"Nay"锁定
- **voteSplitAbstain**(*uint32* pollIndex, *uint256* aye, *uint256* nay) - 在民意投票（公投）中，投出分开弃权票，其中“Aye”锁定一定数量，“Nay”锁定一定数量，弃权票（支持）锁定一定数量
- **removeVote**(*uint32* pollIndex) - 在全民投票（公投）中[移除投票](/builders/pallets-precompiles/pallets/conviction-voting/#extrinsics){target=\_blank}
- **removeOtherVote**(*address* target, *uint16* trackId, *uint32* pollIndex) - 为另一个投票者在全民投票（公投）中[移除投票](/builders/pallets-precompiles/pallets/conviction-voting/#extrinsics){target=\_blank}
- **delegate**(*uint16* trackId, *address* representative, *Conviction* conviction, *uint256* amount) - 委托另一个账户作为代表为特定Track的发送账户进行信念值权重投票
- **undelegate**(*uint16* trackId) - 移除调用者对特定Track的投票委托
- **unlock**(*uint16* trackId, *address* target) - 为特定Track解除特定账户锁定的Token

每个函数拥有以下参数：

- **uint32 pollIndex** - 全民投票（公投）的索引
- **uint256 voteAmount** - 用于投票锁定的余额
- **Conviction** - 代表上述`Conviction` enum的数值
- **address target** - 要移除投票/解锁Token的地址
- **uint16 trackId** - 需要发生请求变更的Track ID

接口也包含以下事件：

- **Voted**(*uint32 indexed* pollIndex, *address* voter, *bool* aye, *uint256* voteAmount, *uint8* conviction) - 当账户投票时发出
- **VoteSplit**(*uint32 indexed* pollIndex, *address* voter, *uin256* aye, *uint256* nay) - 在一个账户进行分开投票时发出
- **VoteSplitAbstained**(*uint32 indexed* pollIndex, *address* voter, *uin256* aye, *uint256* nay, *uint256* nay) - 在一个账户进行分开弃权投票后发出
- **VoteRemoved**(*uint32 indexed* pollIndex, *address* voter) - 在一个账户（`voter`）的投票从正在进行的投票（公投）中被移除后发出
- **VoteRemovedForTrack**(*uint32 indexed* pollIndex, *uint16* trackId, *address* voter) - 在一个账户（`voter`）的投票从指定Track的正在进行的投票（公投）中移除后发出
- **VoteRemovedOther**(*uint32 indexed* pollIndex, *address* caller, *address* target, *uint16* trackId) - 当一个账户（`caller`）为另一个账户（`target`）移除投票时发出
- **Delegated**(*uint16 indexed* trackId, *address* from, *address* to, *uint256* delegatedAmount, *uint8* conviction) - 当一个账户（`from`）委托给定数量的信念值权重投票给另一个账户（`to`）时发出
- **Undelegated**(*uint16 indexed* trackId, *address* caller) - 当为特定Track移除帐户（`caller`）委托时发出
- **Unlocked**(*uint16 indexed* trackId, *address* caller) - 当为特定Track解锁帐户（`caller`）的锁定Token时发出

## 与Solidity接口交互 {: #interact-with-the-solidity-interface }

### 查看先决条件 {: #checking-prerequisites }

以下示例为在Moonbase Alpha上演示，但是步骤也同样适用于Moonriver。开始操作之前，您需要准备以下内容：

 - 安装MetaMask并[连接至Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
 - 拥有DEV Token的账户。
 --8<-- 'text/_common/faucet/faucet-list-item.md'

### Remix设置 {: #remix-set-up }

1. 点击**File explorer**标签
2. 将[`ConvictionVoting.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=\_blank}复制粘贴至一个[Remix文件](https://remix.ethereum.org/){target=\_blank}，命名为`ConvictionVoting.sol`

![Copy and paste the referenda Solidity interface into Remix.](/images/builders/pallets-precompiles/precompiles/conviction-voting/conviction-voting-1.webp)

### 编译合约 {: #compile-the-contract }

1. 点击**Compile**标签（从上至下第二个）
2. 然后在编译界面，点击**Compile ConvictionVoting.sol**

![Compile the ConvictionVoting.sol interface using Remix.](/images/builders/pallets-precompiles/precompiles/conviction-voting/conviction-voting-2.webp)

### 获取合约 {: #access-the-contract }

1. 在Remix点击**Compile**标签正下方的**Deploy and Run**标签。请注意：不是在此处部署合约，而是获取已部署的预编译合约
2. 确保在**ENVIRONMENT**下拉菜单中已选择**Injected Provider - Metamask**
3. 确保在**CONTRACT**下拉菜单中已选择**ConvictionVoting.sol**。由于这是一个预编译的合约，因此无需部署，但是您需要在**At Address**字段中提供预编译的地址
4. 为Moonbase Alpha提供Conviction Voting Precompile的地址：`{{ networks.moonbase.precompiles.conviction_voting }}`并点击**At Address**
5. Conviction Voting Precompile将会出现在**Deployed Contracts**列表当中

![Access the ConvictionVoting.sol interface by provide the precompile's address.](/images/builders/pallets-precompiles/precompiles/conviction-voting/conviction-voting-3.webp)

### 参与公投 {: #vote-on-a-referendum }

您可以在带入期或决定期随时锁定Token并参与公投。为了促进公投通过，则需要最低批准数和支持数，但不同的track也会有不同的标准。关于不同时期和Track类别所需的批准和支持要求的更多信息，请参考[治理概览页面的OpenGov部分](/learn/features/governance/#opengov){target=\_blank}。

首先，您需要获取您想要参与投票的公投索引。前往[Polkadot.js Apps](https://polkadot.js.org/apps?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/referenda){target=\_blank}并执行以下步骤以获取公投索引：

1. 从**Governance**下拉菜单中选择**Referenda**
2. 寻找您想要参与投票的公投。您可以通过点击三角形图标查看特定公投的更多详情。如果没有三角形图标，则说明未提交提案的原像，只有提案哈希
3. 记录公投索引

![View the list of referenda on Polkadot.js Apps.](/images/builders/pallets-precompiles/precompiles/conviction-voting/conviction-voting-4.webp)

现在，您可以通过Conviction Voting Precompile返回Remix对公投进行投票。您将使用两种方式参与投票：`voteYes`或`voteNo`。显而易见，如果您赞成公投则选择`voteYes`，如果您反对公投则选择`voteNo`。您将给出你想要跟着投票一起锁定的Token数量，以及您想要投票的信念值，即在[上述`Conviction` enum](#the-conviction-voting-solidity-interface)中的信念值索引。举例来说，如果您想要在投票成功后的长达两个生效等待期的时间锁定你的Token，您可以输入`2`，代表`Locked2x` Conviction。更多关于信念值的信息，请参考[Governance v2文档的信念乘数部分](/learn/features/governance/#conviction-multiplier-v2){target=\_blank}。

要提交投票，请执行以下步骤：

1. 展开Conviction Voting Precompile合约查看可用函数
2. 找到你想用于投票的**voteYes**或**voteNo**函数，并点击按钮展开此部分
3. 输入您想要投票的公投索引
4. 输入要锁定的Token数量（以Wei为单位）。此处请勿输入所有余额数量，需要预留部分以支付交易手续费
5. 输入您想要投票的信念值
6. 点击**transact**并在MetaMask确认交易

![Vote on the proposal using the voteYes function of the Conviction Voting Precompile.](/images/builders/pallets-precompiles/precompiles/conviction-voting/conviction-voting-5.webp)

公投关闭后，您可以使用Conviction Voting Precompile移除投票并解锁Token。

### 委托投票 {: #delegate-a-vote }

除了对公投进行投票以外，您还可以将信念值权重投票委托给专业人士代表您投票，这一过程称为投票委托。 您甚至可以为每个Track委托不同的帐户。

为此，请执行以下步骤：

1. 找到**delegate**函数并点击按钮展开此部分
2. 输入您想要用于委托的Track的Track ID。您可以在[Polkadot.js Apps的公投页面](https://polkadot.js.org/apps?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/referenda){target=\_blank}找到所有Track ID
3. 输入代表您参与投票的委托账户
4. 输入您想要用于投票的Token数量（以Wei为单位）。此处请勿输入所有余额数量，需要预留部分以支付交易手续费
5. 输入您想要投票的信念值
6. 点击**transact**并在MetaMask确认交易

![Delegate a vote using the delegate function of the Conviction Voting Precompile.](/images/builders/pallets-precompiles/precompiles/conviction-voting/conviction-voting-6.webp)

现在委托账户可以代表您参与投票！如果您想要取消委托，您可以使用Conviction Voting Precompile的`undelegate`函数移除委托。

这样就可以了！您已经基本了解了Conviction Voting Precompile。在[`ConvictionVoting.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=\_blank}文档中记录了更多的函数，如果您对这些函数或在Conviction Voting Precompile方面有任何问题，请随时在[Discord](https://discord.gg/moonbeam){target=\_blank}上联系我们。
