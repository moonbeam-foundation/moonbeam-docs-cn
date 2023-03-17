---
title: Referenda Precompile Contract
description: Learn how to view and submit proposals on-chain to be put forth for referenda, directly through a Solidity interface with the Referenda Precompile on Moonbeam.
学习如何直接通过Solidity接口与Moonbeam上的Referenda Precompile查看和提交上链提案以进入公投阶段。
---

# Interacting with the Referenda Precompile 与Referenda Precompile交互

![Precomiled Contracts Banner](/images/builders/pallets-precompiles/precompiles/referenda/referenda-banner.png)

## Introduction 概览 {: #introduction }

As a Polkadot parachain and decentralized network, Moonbeam features native on-chain governance that enables stakeholders to participate in the direction of the network. With the introduction of OpenGov, also referred to as Governance v2, the Referenda Pallet allows token holders to get information on existing referenda, submit a proposal to be put forth for referenda, and manage actions related to the Decision Deposit, which is required for a referenda to be decided on. To learn more about Moonbeam's governance system, such as an overview of related terminology, principles, mechanics, and more, please refer to the [Governance on Moonbeam](/learn/features/governance){target=_blank} page. 

作为波卡平行链和去中心化网络，Moonbeam具有原生链上治理，能够使Token持有者直接参与网络。随着OpenGov（也称为Governance v2）的推出，Referenda Pallet允许Token持有者获取现有公投的信息，提交提案促使其进入公投阶段，管理与（提案进入公投所需的）决定保证金相关的操作。了解关于Moonbeam治理系统的更多信息，例如相关专业术语、原则、机制等，请参考[Moonbeam上的治理](/learn/features/governance){target=_blank}页面。

The Referenda Precompile interacts directly with Substrate's [Referenda Pallet](/builders/pallets-precompiles/pallets/referenda/){target=_blank}. This pallet is coded in Rust and is normally not accessible from the Ethereum side of Moonbeam. However, the Referenda Precompile allows you to access functions needed to view referenda, submit referenda, and manage the required Decision Deposit, all of which are part of the Substrate Referenda Pallet, directly from a Solidity interface.

Referenda Precompile直接与Substrate的[Referenda Pallet](/builders/pallets-precompiles/pallets/referenda/){target=_blank}交互。此pallet以Rust编码，通常不能从Moonbeam的以太坊端访问。然而，Referenda Precompile允许您获取查看公投、提交公投和管理所需决定保证金的函数，所有这些函数均是Substrate Referenda Pallet的一部分，直接来自Solidity接口。

The Referenda Precompile is currently available in OpenGov, which is available on Moonriver and Moonbase Alpha only. If you're looking for similar functionality for Moonbeam, which is still on Governance v1, you can refer to the [Democracy Precompile](/builders/pallets-precompiles/precompiles/democracy){target=_blank} documentation.

Referenda Precompile目前可用于OpenGov（即仅可在Moonriver和Moonbase Alpha上使用）。如果您想在Moonbeam上使用类似功能，即Governance v1，请参考[Democracy Precompile](/builders/pallets-precompiles/precompiles/democracy){target=_blank}文档。

The Referenda Precompile is located at the following address:

Referenda Precompile位于以下地址：

=== "Moonriver"
     ```
     {{ networks.moonriver.precompiles.referenda }}
     ```

=== "Moonbase Alpha"
     ```
     {{ networks.moonbase.precompiles.referenda }}
     ```

--8<-- 'text/precompiles/security.md'

## The Referenda Solidity Interface - Referenda Solidity接口 {: #the-referenda-solidity-interface } 

[`Referenda.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank} is a Solidity interface that allows developers to interact with the precompile's methods. The methods are as follows:

[`Referenda.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank}是一个Solidity接口，允许开发者使用预编译的函数交互。具体函数如下所示：

- **referendumCount**() - a read-only function that returns the total referendum count

- **referendumCount**() - 只读函数，返回公投总数

- **submissionDeposit**() - a read-only function that returns the Submission Deposit required for each referendum

- **submissionDeposit**() - 只读函数，返回每个公投所需的提交保证金

- **decidingCount**(*uint16* trackId) - a read-only function that returns the total count of deciding referenda for a given Track

- **decidingCount**(*uint16* trackId) - 只读函数，返回给定Track的决定公投总数

- **trackIds**() - a read-only function that returns a list of the Track IDs for all Tracks (and Origins)

- **trackIds**() - 只读函数，返回所有Tracks（和Origins）的Track ID列表

- **trackInfo**(*uint16* trackId) - a read-only function that returns the following governance parameters configured for a given Track ID:

- **trackInfo**(*uint16* trackId) - 只读函数，返回为给定Track ID配置的以下治理参数：

     - *string* name - the name of the Track
     - *string* name - Track名称
     - *uint256* maxDeciding - the maximum number of referenda that can be decided on at once
     - *uint256* maxDeciding - 单次可以决定的公投数量上限
     - *uint256* decisionDeposit - the amount of the Decision Deposit 
     - *uint256* decisionDeposit - 决定保证金的金额
     - *uint256* preparePeriod - the duration of the Prepare Period
     - *uint256* preparePeriod - 准备期时长
     - *uint256* decisionPeriod - the duration of the Decide Period
     - *uint256* decisionPeriod - 决定期时长
     - *uint256* confirmPeriod - the duration of the Confirm Period
     - *uint256* confirmPeriod - 确认期时长
     - *uint256* minEnactmentPeriod - the minimum amount of time the Enactment Period must be
     - *uint256* minEnactmentPeriod - 生效等待期最短时长
     - *bytes* minApproval - the minimum "Aye" votes as a percentage of overall Conviction-weighted votes needed for an approval
     - *bytes* minApproval - 公投批准所需的最低“赞成”票数占整体信念值权重投票的比例
     - *bytes* minSupport - minimum number of "Aye" votes, not taking into consideration Conviction-weighted votes, needed as a percent of the total supply needed for an approval
     - *bytes* minSupport - 公投批准所需的最低“赞成”票数（不考虑信念值权重投票）占总供应量的比例

- **referendumStatus**(*uint32* referendumIndex) - a read-only function that returns the status for a given referendum. The `ReferendumStatus` enum defines the possible statuses:

- **referendumStatus**(*uint32* referendumIndex) - 只读函数，返回给定公投的状态的。`ReferendumStatus` enum定义以下可能出现的状态：

     ```
     enum ReferendumStatus {
          Ongoing,
          Approved,
          Rejected,
          Cancelled,
          TimedOut,
          Killed
     }
     ```

- **ongoingReferendumInfo**(*uint32* referendumIndex) - a read-only function that returns the following information pertaining to an ongoing referendum:

- **ongoingReferendumInfo**(*uint32* referendumIndex) - 只读函数，返回与正在进行中的公投相关的以下信息：

     - *uint16* trackId - the Track of this referendum
     - *uint16* trackId - 此公投的Track
     - *bytes* origin - the Origin for this referendum
     - *bytes* origin - 此公投的Origin
     - *bytes* proposal - the hash of the proposal up for referendum
     - *bytes* proposal - 公投的提案哈希
     - *bool* enactmentType - `true` if the proposal is scheduled to be dispatched *at* enactment time and `false` if *after* enactment time
     - *bool* enactmentType - 如果提案计划*在*生效等待期被分配则为`true`，如果在生效等待期*之后*被分配则为`false`
     - *uint256* enactmentTime - the time the proposal should be scheduled for enactment
     - *uint256* enactmentTime - 提案计划生效的时间
     - *uint256* submissionTime -  the time of submission
     - *uint256* submissionTime - 提交时间
     - *address* submissionDepositor - the address of the depositor for the Submission Deposit
     - *address* submissionDepositor - 提交保证金存款人的地址
     - *uint256* submissionDeposit - the amount of the Submission Deposit
     - *uint256* submissionDeposit - 提交保证金的金额
     - *address* decisionDepositor - the address of the depositor for the Decision Deposit
     - *address* decisionDepositor - 决定保证金存款人的地址
     - *uint256* decisionDeposit - the amount of the Decision Deposit
     - *uint256* decisionDeposit - 决定保证金的金额
     - *uint256* decidingSince - when this referendum entered the Decide Period. If confirming, then the end will actually be delayed until the end of the Confirm Period
     - *uint256* decidingSince - 当公投进入决定期。如果确认，结束时间将被延期至确认期结束
     - *uint256* decidingConfirmingEnd - when this referendum is scheduled to leave the Confirm Period as long as it doesn't lose its approval in the meantime
     - *uint256* decidingConfirmingEnd - 当此公投为达到支持数量将计划离开确认期
     - *uint256* ayes - the number of "Aye" votes, expressed in terms of post-conviction lock-vote
     - *uint256* ayes - “赞成”票数量（包含信念值锁定的投票数）
     - *uint32* support - percent of "Aye" votes, expressed pre-conviction, over total votes in the class
     - *uint32* support - “赞成”票（不包含信念值）占总投票数的比例
     - *uint32* approval - percent of "Aye" votes over "Aye" and "Nay" votes
     - *uint32* approval - “赞成”票占总票数（包含“赞成”票和“反对”票）的比例
     - *bool* inQueue - `true` if this referendum has been placed in the queue for being decided or `false` if not
     - *bool* inQueue - 公投进入决定期的等待列队则为`true`，反之则为`false`
     - *uint256* alarmTime - the next scheduled wake-up
     - *uint256* alarmTime - 提醒下一次的开始
     - *bytes* taskAddress - scheduler task address if scheduled
     - *bytes* taskAddress - 调度者的任务地址（如果成功调度）

- **closedReferendumInfo**(*uint32* referendumIndex) - a read-only function that returns the following information pertaining to a closed referendum:

- **closedReferendumInfo**(*uint32* referendumIndex) - 只读函数，返回与已结束的公投相关的以下信息：

     - *uint256* end - when the referendum ended
     - *uint256* end - 当公投结束
     - *address* submissionDepositor - the address of the depositor for the Submission Deposit
     - *address* submissionDepositor - 提交保证金存款人的地址
     - *uint256* submissionDeposit - the amount of the Submission Deposit
     - *uint256* submissionDeposit - 提交保证金的金额
     - *address* decisionDepositor - the address of the depositor for the Decision Deposit
     - *address* decisionDepositor - 决定保证金存款人的地址
     - *uint256* decisionDeposit - the amount of the Decision Deposit
     - *uint256* decisionDeposit - 决定保证金的金额

- **killedReferendumBlock**(*uint32* referendumIndex) - a read-only function that returns the block a given referendum was killed

- **killedReferendumBlock**(*uint32* referendumIndex) - 只读函数，返回给定公投被终止的区块

- **submitAt**(*uint16* trackId, *bytes32* proposalHash, *uint32* proposalLen, *uint32* block) - submits a referendum given a Track ID corresponding to the origin from which the proposal is to be dispatched, the preimage hash of the proposed runtime call, the length of the proposal, and the block number *at* which this will be executed. Returns the referendum index of the submitted referendum

- **submitAt**(*uint16* trackId, *bytes32* proposalHash, *uint32* proposalLen, *uint32* block) - 根据给定Track ID对应于分配提案的origin、提议的Runtime调用的原像哈希、提案长度和执行此提案的区块号，提交公投。返回提交公投的公投索引

- **submitAfter**(*uint16* trackId, *bytes32* proposalHash, *uint32* proposalLen, *uint32* block) - submits a referendum given a Track ID corresponding to the origin from which the proposal is to be dispatched, the preimage hash of the proposed runtime call, the length of the proposal, and the block number *after* which this will be executed. Returns the referendum index of the submitted referendum

- **submitAfter**(*uint16* trackId, *bytes32* proposalHash, *uint32* proposalLen, *uint32* block) - 根据给定Track ID对应于分配提案的origin，提议的Runtime调用的原像哈希、提案长度和执行此提案*后*的区块号，提交公投。返回提交公投的公投索引

- **placeDecisionDeposit**(*uint32* index) - posts the Decision Deposit for a referendum given the index of the going referendum

- **placeDecisionDeposit**(*uint32* index) - 根据正在进行中公投的索引发布公投决定保证金

- **refundDecisionDeposit**(*uint32* index) - refunds the Decision Deposit for a closed referendum back to the depositor given the index of the closed referendum in which the Decision Deposit is still locked

- **refundDecisionDeposit**(*uint32* index) - 根据已结束公投的索引（其中决定保证金仍被锁定），将已结束公投的决定保证金退还给存款人

- **refundSubmissionDeposit**(*uint32* index) - refunds the Submission Deposit for a closed referendum back to the depositor given the index of a closed referendum

- **refundSubmissionDeposit**(*uint32* index) - 根据已结束公投的索引，将已结束公投的提交保证金退还给存款人

The interface also includes the following events:

接口也包含以下事件：

- **SubmittedAt**(*uint16 indexed* trackId, *uint32* referendumIndex, *bytes32* hash) - emitted when a referenda has been submitted *at* a given block
- **SubmittedAt**(*uint16 indexed* trackId, *uint32* referendumIndex, *bytes32* hash) - 当提案*在*给定区块提交时发出
- **SubmittedAfter**(*uint16 indexed* trackId, *uint32* referendumIndex, *bytes32* hash) - emitted when a referenda has been submitted *after* a given block
- **SubmittedAfter**(*uint16 indexed* trackId, *uint32* referendumIndex, *bytes32* hash) - 当提案在给定区块*之后*提交时发出
- **DecisionDepositPlaced**(*uint32* index, *address* caller, *uint256* depositedAmount) - emitted when a Decision Deposit for a referendum has been placed
- **DecisionDepositPlaced**(*uint32* index, *address* caller, *uint256* depositedAmount) - 当公投的决定保证金存入时发出
- **DecisionDepositRefunded**(*uint32* index, *address* caller, *uint256* refundedAmount) - emitted when a Decision Deposit for a closed referendum has been refunded
- **DecisionDepositRefunded**(*uint32* index, *address* caller, *uint256* refundedAmount) - 当已结束提案的决定保证金被退还时发出
- **SubmissionDepositRefunded**(*uint32* index, *address* caller, *uint256* refundedAmount) - emitted when a Submission Deposit for a valid referendum has been refunded
- **SubmissionDepositRefunded**(*uint32* index, *address* caller, *uint256* refundedAmount) - 当有效提案的提交保证金被退还时发出

## Interact with the Solidity Interface - 与Solidity接口交互 {: #interact-with-the-solidity-interface }

### Checking Prerequisites 查看先决条件 {: #checking-prerequisites } 

The below example is demonstrated on Moonbase Alpha, however, similar steps can be taken for Moonriver. To follow the steps in this guide, you'll need to have the following: 

以下示例为在Moonbase Alpha上演示，但是步骤也同样适用于Moonriver。开始操作之前，您需要准备以下内容：

 - MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - 安装MetaMask并[连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - An account with some DEV tokens. 拥有DEV Token的账户
 --8<-- 'text/faucet/faucet-list-item.md'

### Remix Set Up Remix设置 {: #remix-set-up } 

1. Click on the **File explorer** tab

   点击**File explorer**标签

2. Paste a copy of [`Referenda.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank} into a [Remix file](https://remix.ethereum.org/){target=_blank} named `Referenda.sol`

   将[`Referenda.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank}复制粘贴至[Remix文档](https://remix.ethereum.org/){target=_blank}，命名为`Referenda.sol`

![Copy and paste the Referenda Solidity interface into Remix.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-1.png)

### Compile the Contract 编译合约 {: #compile-the-contract } 

1. Click on the **Compile** tab, second from top

   点击**Compile**标签（从上至下第二个）

2. Then to compile the interface, click on **Compile Referenda.sol**

   然后编译接口，点击**Compile Referenda.sol**

![Compile the Referenda.sol interface using Remix.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-2.png)

### Access the Contract 获取合约 {: #access-the-contract } 

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed

   在Remix的**Compile**标签下面，点击**Deploy and Run**。请注意：不是在此处部署合约，而是获取已部署的预编译合约

2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down

   确保在**ENVIRONMENT**下拉菜单中已选择**Injected Provider - Metamask**

3. Ensure **Referenda.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** field

   确保在**CONTRACT**下拉菜单中已选择**Referenda.sol**。由于这是一个预编译的合约，因此无需部署，但是您需要在**At Address**字段中提供预编译的地址

4. Provide the address of the Referenda Precompile for Moonbase Alpha: `{{ networks.moonbase.precompiles.referenda }}` and click **At Address**

   为Moonbase Alpha提供Referenda Precompile的地址：`{{ networks.moonbase.precompiles.referenda }}`并点击**At Address**

5. The Referenda Precompile will appear in the list of **Deployed Contracts**

   Referenda Precompile将会出现在**Deployed Contracts**列表当中

![Access the Referenda.sol interface by provide the precompile's address.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-3.png)

### Submit a Proposal 提交提案 {: #submit-a-proposal }

In order to submit a proposal, you should have already submitted the preimage hash for the proposal. If you have not done so, please follow the steps outlined in the [Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage){target=_blank} documentation. There are two methods that can be used to submit a proposal: `submitAt` and `submitAfter`. The `submitAt` function submits a proposal to be executed *at* a given block and the `submitAfter` function submits a proposal to be executed *after* a specific block. For this example, `submitAt` will be used, but the same steps can be applied if you want to use `submitAfter` instead.

要提交提案，您需要先提交该提案的原像。您可以通过[Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage){target=_blank}文档中的步骤完成此操作。提交提案将用到两个函数：`submitAt`和`submitAfter`。`submitAt`函数用于提交*在*给定区块执行的提案，而`submitAfter`函数用于提交在给定区块*之后*执行的提案。在本示例中将使用`submitAt`函数，但是步骤也同样适用于`submitAfter`函数。

To submit the proposal, you'll need to determine which Track your proposal belongs to and the Track ID of that Track. For help with these requirements, you can refer to the [OpenGov section of the governance overview page](/learn/features/governance/#opengov){target=_blank}.

要提交提案，您需要先确定您的提案属于哪个Track以及Track的Track ID。具体请参考[治理概览页面的OpenGov部分](/learn/features/governance/#opengov){target=_blank}。

You'll also need to make sure you have the preimage hash and the length of the preimage handy, both of which you should have received from following the steps in the [Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage){target=_blank} documentation. If you're unsure, you can find your preimage from the [Preimage page of Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/preimages){target=_blank} and copy the preimage hash. To get the length of the proposal, you can then query the `preimage` pallet using the `preimageFor` method from the [Polkadot.js Apps Chain State page](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/chainstate){target=_blank}.

请确保您已获取原像哈希和原像长度，这两者可通过[Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage){target=_blank}文档中的操作步骤获取。另外，您也可以通过[Polkadot.js Apps的Preimage页面](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/preimages){target=_blank}复制原像哈希。要获取提案的长度，您可在[Polkadot.js Apps Chain State页面](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/chainstate){target=_blank}使用`preimageFor`函数查询`preimage` pallet。

Once you have the Track ID, preimage hash, and preimage length, you can go ahead and submit the proposal using the Referenda Precompile. From Remix, you can take the following steps:

当您获取Track ID、原像哈希和原像长度后，您可以使用Referenda Precompile提交提案。在Remix，请执行以下步骤：

1. Expand the Referenda Precompile contract to see the available functions

   展开Referenda Precompile合约查看可用函数

2. Find the **submitAt** function and press the button to expand the section

   找到**submitAt**函数，点击按钮展开此部分

3. Enter the track ID that your proposal will be processed through

   输入提案的Track ID

4. Enter the preimage hash. You should have received this from following the steps in the [Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage){target=_blank} documentation

   输入原像哈希。您可通过[Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage){target=_blank}文档的操作步骤获取

5. Enter the length of the preimage

   输入原像长度

6. Enter the block you want the proposal to be executed at

   输入执行原像的区块号

7. Press **transact** and confirm the transaction in MetaMask

   点击**transact**并在MetaMask确认交易

![Submit the proposal using the submitAt function of the Referenda Precompile.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-4.png)

After your transaction has been confirmed you'll be able to see the proposal listed on the **Referenda** page of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/referenda){target=_blank}. You can also check out your proposal on [Polkassembly](https://moonbase.polkassembly.network/){target=_blank}, which sorts proposals by the Track they belong to.

交易确认后，您将看到提案出现在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/referenda){target=_blank}的**Referenda**页面中。您也可以前往[Polkassembly](https://moonbase.polkassembly.network/){target=_blank}查看提案（根据Track分类）。

### Submit Decision Deposit 提交决定保证金 {: #submit-decision-deposit }

Now that you've submitted your proposal, the next step is to submit the Decision Deposit. The Decision Deposit is the minimum deposit amount required for a referendum to progress to the decision phase at the end of the Lead-in Period. For more information on the Decision Deposit, please refer to the [OpenGov section of the governance overview page](/learn/features/governance/#opengov){target=_blank}.

现在您已提交提案，接下来是提交决定保证金。决定保证金（Decision Deposit）是公投在带入期结束时进入决定期所需的最低保证金金额。关于决定保证金的更多信息，请参考[治理页面的OpenGov部分](/learn/features/governance/#opengov){target=_blank}。

You can submit the Decision Deposit using the `placeDecisionDeposit` function of the Referenda Precompile. You'll just need to have the index of the referendum and enough funds to do so. The Decision Deposit varies by Track, to find the minimum amount required you can take a look at the [General Parameters by Track table on the governance overview page](/learn/features/governance/#general-parameters-by-track){target=_blank}.

您可以使用Referenda Precompile的`placeDecisionDeposit`函数提交决定保证金。您将需要用到公投的索引和足够的资金来完成此步骤。根据Track的不同决定保证金的金额也将不同，关于每个Track所需的最低保证金要求，请参考[治理页面的Track基本参数](/learn/features/governance/#general-parameters-by-track){target=_blank}。

To submit the deposit, you can take the following steps:

要提交保证金，请执行以下步骤：

1. Find the **placeDecisionDeposit** function and press the button to expand the section

   找到**placeDecisionDeposit**函数，点击按钮展开此部分

2. Enter the index of the referendum

   输入公投的索引

3. Press **transact** and confirm the transaction in MetaMask

   点击**transact**并在MetaMask确认交易

![Place the Decision Deposit for a Referenda using the placeDecisionDeposit function of the Referenda Precompile.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-5.png)

Now that the Decision Deposit has been placed, the referendum is one step closer to moving to the Decide Period. There will also need to be enough Capacity in the designated Track and the duration of the Prepare Period must pass for it to move to the Decide Period. 

现在已存入决定保证金，距离公投进入决定期又更近了一步。接下来要确保在指定的Track中有足够的容量并且必须保证通过准备期才能进入决定期。

To vote on referenda, you can follow the steps outlined in the [Conviction Voting Precompile](/builders/pallets-precompiles/precompiles/conviction-voting){target=_blank} documentation.

要参与公投，请参考[Conviction Voting Precompile](/builders/pallets-precompiles/precompiles/conviction-voting){target=_blank}文档中的操作步骤。

### Refund Decision Deposit 退还决定保证金 {: #refund-decision-deposit }

Once a referendum has either been approved or rejected, the Decision Deposit can be refunded. This holds true as long as the referendum wasn't cancelled due to the proposal being malicious. If the proposal is deemed malicious and killed via the Emergency Killer Track, the Decision Deposit will be slashed.

一旦公投通过或者拒绝，决定保证金将被退还。但是此步骤的前提是公投没有被取消或者被评判为不良公投。如果提案被评判为不良公投并通过Emergency Killer Track被终止，则决定保证金将被没收。

To refund the Decision Deposit, you can use the `refundDecisionDeposit` function of the Referenda Precompile. To do so, you can take the following steps:

要退还决定保证金，您可以使用Referenda Precompile的`refundDecisionDeposit`函数。然后，请执行以下步骤：

1. Find the **placeDecisionDeposit** function and press the button to expand the section

   找到**placeDecisionDeposit**函数，点击按钮展开此部分

2. Enter the index of the referendum

   输入公投的索引

3. Press **transact** and confirm the transaction in MetaMask

   点击**transact**并在MetaMask确认交易

![Refund the Decision Deposit for a Referenda using the placeDecisionDeposit function of the Referenda Precompile.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-6.png)

And that's it! You've completed your introduction to the Referenda Precompile. There are a few more functions that are documented in [`Referenda.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank} — feel free to reach out on [Discord](https://discord.gg/moonbeam){target=_blank} if you have any questions about those functions or any other aspect of the Referenda Precompile.

这样就可以了！您已经基本了解Referenda Precompile。在[`Referenda.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank}文档中记录了更多的函数，如果您对这些函数或在Referenda Precompile方面有任何问题，请随时在[Discord](https://discord.gg/moonbeam){target=_blank}上联系我们。