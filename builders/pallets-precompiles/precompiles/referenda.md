---
title: Referenda Precompile（公投预编译）合约
description: 学习如何直接通过Moonbeam上的Referenda Precompile的Solidity接口查看和提交链上提案以进入公投阶段。
---

# 与Referenda Precompile交互

## 概览 {: #introduction }

作为波卡（Polkadot）平行链和去中心化网络，Moonbeam具有原生链上治理功能，使利益相关者能够参与网络的发展方向。随着OpenGov（也称为Governance v2）的推出，Referenda Pallet允许Token持有者获取现有公投的信息，提交提案促使其进入公投阶段，管理与（提案进入公投所需的）决定保证金相关的操作。了解关于Moonbeam治理系统的更多信息，例如相关专业术语、原则、机制等，请参考[Moonbeam上的治理](/learn/features/governance){target=_blank}页面。

Referenda Precompile直接与Substrate的[Referenda Pallet](/builders/pallets-precompiles/pallets/referenda/){target=_blank}交互。此pallet以Rust编码，通常不能从Moonbeam的以太坊端访问。然而，Referenda Precompile允许您直接从Solidity接口访问查看公投、提交公投和管理所需决定保证金的函数，所有这些函数均是Substrate Referenda Pallet的一部分。

Referenda Precompile位于以下地址：

=== "Moonbeam"

     ```text
     {{ networks.moonbeam.precompiles.referenda }}
     ```

=== "Moonriver"

     ```text
     {{ networks.moonriver.precompiles.referenda }}
     ```

=== "Moonbase Alpha"

     ```text
     {{ networks.moonbase.precompiles.referenda }}
     ```

--8<-- 'text/builders/pallets-precompiles/precompiles/security.md'

## Referenda Solidity接口 {: #the-referenda-solidity-interface }

[`Referenda.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank}是一个Solidity接口，允许开发者使用预编译的函数交互。具体函数如下所示：

- **referendumCount**() - 只读函数，返回公投总数
- **submissionDeposit**() - 只读函数，返回每个公投所需的提交保证金
- **decidingCount**(*uint16* trackId) - 只读函数，返回给定Track的决定公投总数
- **trackIds**() - 只读函数，返回所有Tracks（和Origins）的Track ID列表
- **trackInfo**(*uint16* trackId) - 只读函数，返回为给定Track ID配置的以下治理参数：

     - *string* name - Track名称
     - *uint256* maxDeciding - 单次可以决定的公投数量上限
     - *uint256* decisionDeposit - 决定保证金的金额
     - *uint256* preparePeriod - 准备期时长
     - *uint256* decisionPeriod - 决定期时长
     - *uint256* confirmPeriod - 确认期时长
     - *uint256* minEnactmentPeriod - 生效等待期最短时长
     - *bytes* minApproval - 公投批准所需的最低“赞成”票数占整体信念值权重投票的比例
     - *bytes* minSupport - 公投批准所需的最低“赞成”票数（不考虑信念值权重投票）占总供应量的比例

- **referendumStatus**(*uint32* referendumIndex) - 只读函数，返回给定公投的状态的。`ReferendumStatus` enum定义以下可能出现的状态：

     ```solidity
     enum ReferendumStatus {
          Ongoing,
          Approved,
          Rejected,
          Cancelled,
          TimedOut,
          Killed
     }
     ```

- **ongoingReferendumInfo**(*uint32* referendumIndex) - 只读函数，返回与正在进行中的公投相关的以下信息：

     - *uint16* trackId - 此公投的Track
     - *bytes* origin - 此公投的Origin
     - *bytes* proposal - 公投的提案哈希
     - *bool* enactmentType - 如果提案计划*在*生效等待期被分配则为`true`，如果在生效等待期*之后*被分配则为`false`
     - *uint256* enactmentTime - 提案计划生效的时间
     - *uint256* submissionTime - 提交时间
     - *address* submissionDepositor - 提交保证金存款人的地址
     - *uint256* submissionDeposit - 提交保证金的金额
     - *address* decisionDepositor - 决定保证金存款人的地址
     - *uint256* decisionDeposit - 决定保证金的金额
     - *uint256* decidingSince - 公投进入决定期的时间。如果还在确认中，结束时间将被延期至确认期结束
     - *uint256* decidingConfirmingEnd - 此公投持续达到支持数量将计划离开确认期的时间
     - *uint256* ayes - “赞成”票数量（包含信念值锁定的投票数）
     - *uint32* support - “赞成”票（不包含信念值）占总投票数的比例
     - *uint32* approval - “赞成”票占总票数（包含“赞成”票和“反对”票）的比例
     - *bool* inQueue - 公投进入决定期的等待列队则为`true`，反之则为`false`
     - *uint256* alarmTime - 提醒下一次的开始时间
     - *bytes* taskAddress - 调度者的任务地址（如果成功调度）

- **closedReferendumInfo**(*uint32* referendumIndex) - 只读函数，返回与已结束的公投相关的以下信息：

     - *uint256* end - 公投结束时间
     - *address* submissionDepositor - 提交保证金存款人的地址
     - *uint256* submissionDeposit - 提交保证金的金额
     - *address* decisionDepositor - 决定保证金存款人的地址
     - *uint256* decisionDeposit - 决定保证金的金额

- **killedReferendumBlock**(*uint32* referendumIndex) - 只读函数，返回给定公投被终止的区块
- **submitAt**(*uint16* trackId, *bytes32* proposalHash, *uint32* proposalLen, *uint32* block) - 根据给定的对应于分配提案的origin的Track ID、提议的Runtime调用的原像哈希、提案长度和*在上面*执行此提案的区块号，提交公投。返回提交公投的公投索引
- **submitAfter**(*uint16* trackId, *bytes32* proposalHash, *uint32* proposalLen, *uint32* block) - 根据给定的对应于分配提案的origin的Track ID、提议的Runtime调用的原像哈希、提案长度和*在此之后*执行此提案的区块号，提交公投。返回提交公投的公投索引
- **placeDecisionDeposit**(*uint32* index) - 根据正在进行中公投的索引发布公投决定保证金
- **refundDecisionDeposit**(*uint32* index) - 根据已结束公投的索引（其中决定保证金仍被锁定），将已结束公投的决定保证金退还给存款人
- **refundSubmissionDeposit**(*uint32* index) - 根据已结束公投的索引，将已结束公投的提交保证金退还给存款人

接口也包含以下事件：

- **SubmittedAt**(*uint16 indexed* trackId, *uint32* referendumIndex, *bytes32* hash) - 当提案*在*给定区块提交时发出
- **SubmittedAfter**(*uint16 indexed* trackId, *uint32* referendumIndex, *bytes32* hash) - 当提案在给定区块*之后*提交时发出
- **DecisionDepositPlaced**(*uint32* index, *address* caller, *uint256* depositedAmount) - 当公投的决定保证金存入时发出
- **DecisionDepositRefunded**(*uint32* index, *address* caller, *uint256* refundedAmount) - 当已结束提案的决定保证金被退还时发出
- **SubmissionDepositRefunded**(*uint32* index, *address* caller, *uint256* refundedAmount) - 当有效提案的提交保证金被退还时发出

## 与Solidity接口交互 {: #interact-with-the-solidity-interface }

### 查看先决条件 {: #checking-prerequisites }

以下示例为在Moonbase Alpha上演示，但是步骤也同样适用于Moonriver。开始操作之前，您需要准备以下内容：

 - 安装MetaMask并[连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - 拥有DEV Token的账户。
 --8<-- 'text/_common/faucet/faucet-list-item.md'

### Remix设置 {: #remix-set-up }

1. 点击**File explorer**标签
2. 将[`Referenda.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank}复制粘贴至[Remix文档](https://remix.ethereum.org/){target=_blank}，命名为`Referenda.sol`

![Copy and paste the Referenda Solidity interface into Remix.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-1.png)

### 编译合约 {: #compile-the-contract }

1. 点击**Compile**标签（从上至下第二个）
2. 然后在编译界面，点击**Compile Referenda.sol**

![Compile the Referenda.sol interface using Remix.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-2.png)

### 获取合约 {: #access-the-contract }

1. 点击位于Remix的**Compile**标签正下方的**Deploy and Run**标签。请注意：您并不是在此部署合约，您是在获取一个已经部署的预编译合约
2. 确保在**ENVIRONMENT**下拉菜单中已选择**Injected Provider - Metamask**
3. 确保在**CONTRACT**下拉菜单中已选择**Referenda.sol**。由于这是一个预编译的合约，因此无需部署，但是您需要在**At Address**字段中提供预编译的地址
4. 为Moonbase Alpha提供Referenda Precompile的地址：`{{ networks.moonbase.precompiles.referenda }}`并点击**At Address**
5. Referenda Precompile将会出现在**Deployed Contracts**列表当中

![Access the Referenda.sol interface by provide the precompile's address.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-3.png)

### 提交提案 {: #submit-a-proposal }

要提交提案，您需要先提交该提案的原像。您可以通过[Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage){target=_blank}文档中的步骤完成此操作。提交提案将用到两个函数：`submitAt`和`submitAfter`。`submitAt`函数用于提交*在*给定区块执行的提案，而`submitAfter`函数用于提交在给定区块*之后*执行的提案。在本示例中将使用`submitAt`函数，但是步骤也同样适用于`submitAfter`函数。

要提交提案，您需要先确定您的提案属于哪个Track以及Track的Track ID。具体请参考[治理概览页面的OpenGov部分](/learn/features/governance/#opengov){target=_blank}。

请确保您已获取原像哈希和原像长度，这两者可通过[Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage){target=_blank}文档中的操作步骤获取。另外，您也可以通过[Polkadot.js Apps的Preimage页面](https://polkadot.js.org/apps?rpc=wss://wss.api.moonbase.moonbeam.network#/preimages){target=_blank}复制原像哈希。要获取原像长度，您可在[Polkadot.js Apps Chain State页面](https://polkadot.js.org/apps?rpc=wss://wss.api.moonbase.moonbeam.network#/chainstate){target=_blank}使用`preimage` pallet的`preimageFor`函数查询。

当您获取Track ID、原像哈希和原像长度后，您可以使用Referenda Precompile提交提案。在Remix，请执行以下步骤：

1. 展开Referenda Precompile合约查看可用函数
2. 找到**submitAt**函数，点击按钮展开此部分
3. 输入提案的Track ID
4. 输入原像哈希。您可通过[Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage){target=_blank}文档的操作步骤获取
5. 输入原像长度
6. 输入执行原像的区块号
7. 点击**transact**并在MetaMask确认交易

![Submit the proposal using the submitAt function of the Referenda Precompile.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-4.png)

交易确认后，您将看到提案出现在[Polkadot.js Apps](https://polkadot.js.org/apps?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/referenda){target=_blank}的**Referenda**页面中。您也可以前往[Polkassembly](https://moonbase.polkassembly.io/opengov){target=_blank}查看提案（Polkassembly根据Track来分类提案）。

### 提交决定保证金 {: #submit-decision-deposit }

现在您已提交提案，接下来是提交决定保证金。决定保证金（Decision Deposit）是公投在带入期结束时进入决定期所需的最低保证金金额。关于决定保证金的更多信息，请参考[治理页面的OpenGov部分](/learn/features/governance/#opengov){target=_blank}。

您可以使用Referenda Precompile的`placeDecisionDeposit`函数提交决定保证金。您将需要用到公投的索引和足够的资金来完成此步骤。根据Track的不同决定保证金的金额也将不同，关于每个Track所需的最低保证金要求，请参考[治理页面的Track基本参数表格](/learn/features/governance/#general-parameters-by-track){target=_blank}。

要提交保证金，请执行以下步骤：

1. 找到**placeDecisionDeposit**函数，点击按钮展开此部分
2. 输入公投的索引
3. 点击**transact**并在MetaMask确认交易

![Place the Decision Deposit for a Referenda using the placeDecisionDeposit function of the Referenda Precompile.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-5.png)

现在已存入决定保证金，距离公投进入决定期又更近了一步。接下来要确保在指定的Track中有足够的容量并且必须通过准备期才能进入决定期。

要参与公投，请参考[Conviction Voting Precompile](/builders/pallets-precompiles/precompiles/conviction-voting){target=_blank}文档中的操作步骤。

### 退还决定保证金 {: #refund-decision-deposit }

一旦公投通过或者拒绝，决定保证金将被退还。但是此步骤的前提是公投没有因为评判为不良公投被取消。如果提案被评判为不良公投并通过Root Track或Emergency Killer Track被终止，则决定保证金将被没收。

要退还决定保证金，您可以使用Referenda Precompile的`refundDecisionDeposit`函数。然后，请执行以下步骤：

1. 找到**placeDecisionDeposit**函数，点击按钮展开此部分
2. 输入公投的索引
3. 点击**transact**并在MetaMask确认交易

![Refund the Decision Deposit for a Referenda using the placeDecisionDeposit function of the Referenda Precompile.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-6.png)

这样就可以了！您已经基本了解Referenda Precompile。在[`Referenda.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank}文档中记录了更多的函数，如果您对这些函数或在Referenda Precompile方面有任何问题，请随时在[Discord](https://discord.gg/moonbeam){target=_blank}上联系我们。
