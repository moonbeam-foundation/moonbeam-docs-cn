---
title: 团体预编译合约

description: 学习如何使用Moonbeam团体预编译通过理事会、技术委员会或财政库委员会团体执行民主功能

keywords: solidity, ethereum, 团体, 提案, 理事会, 技术委员会, moonbeam, 预编译, 合约
---

# 与团体预编译交互

![Precomiled Contracts Banner](/images/builders/pallets-precompiles/precompiles/collective/collective-banner.png)

## 概览 {: #introduction }

团体预编译能够使用户直接从Solidity接口与[Substrate的团体pallet](https://paritytech.github.io/substrate/master/pallet_collective/index.html){target=_blank}交互。

团体是一个群组，其成员负责具体的民主相关行动，例如提议、投票、执行、结束提案。每位成员都能够执行不同来源的不同动作。因此，可以创建具有特定范围的团体。

举例来说，Moonriver有四个团体：理事会团体、技术委员会团体，财政库委员会团体和OpenGov技术委员会团体（用于把OpenGov提案列入白名单）。因此，每个团体都有一个预编译。关于理事会，技术委员会和OpenGov技术委员会的更多信息，请参阅[Moonbeam治理](/learn/features/governance/){target=_blank}页面，关于财政库委员会的更多信息，请参阅[Moonbeam财政库](/learn/features/treasury/){target=_blank}页面。

本教程将向您展示如何使用团体预编译进行提议、投票、结束提案。

团体预编译位于以下地址：

=== "Moonbeam"
     |     团体     |                             地址                             |
     |:------------:|:------------------------------------------------------------:|
     |    理事会    |    {{networks.moonbeam.precompiles.collective_council }}     |
     |  技术委员会  | {{networks.moonbeam.precompiles.collective_tech_committee }} |
     | 财政库委员会 |    {{networks.moonbeam.precompiles.collective_treasury }}    |

=== "Moonriver"
     |            团体             |                                 地址                                  |
     |:---------------------------:|:---------------------------------------------------------------------:|
     |           理事会            |        {{networks.moonriver.precompiles.collective_council }}         |
     |         技术委员会          |     {{networks.moonriver.precompiles.collective_tech_committee }}     |
     |        财政库委员会         |        {{networks.moonriver.precompiles.collective_treasury }}        |
     |      OpenGov技术委员会      | {{networks.moonriver.precompiles.collective_opengov_tech_committee }} |

=== "Moonbase Alpha"
     |            团体             |                                 地址                                 |
     |:---------------------------:|:--------------------------------------------------------------------:|
     |           理事会            |        {{networks.moonbase.precompiles.collective_council }}         |
     |         技术委员会          |     {{networks.moonbase.precompiles.collective_tech_committee }}     |
     |        财政库委员会         |        {{networks.moonbase.precompiles.collective_treasury }}        |
     |      OpenGov技术委员会      | {{networks.moonbase.precompiles.collective_opengov_tech_committee }} |

--8<-- 'text/precompiles/security.md'

## 团体Solidity接口 {: #the-call-permit-interface }

[`Collective.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}是一个Solidity接口，允许开发者与预编译的5个方式进行交互。

接口包含以下函数：

- **execute**(*bytes memory* proposal) - 作为团体内的单个成员执行提案。发送者必须为团体中的成员。如果Substrate提案已派送但失败，将*不会*恢复
- **propose**(*uint32* threshold, *bytes memory* proposal) - 增加一个要投票的新提案。发送者必须为团体中的成员。若数值小于2，则提案者将作为派送者直接派送并执行提案。若达到设定的数值，则返回新提案的索引
- **vote**(*bytes32* proposalHash, *uint32* proposalIndex, *bool* approve) - 为提案进行投票。发送者必须为团体中的成员
- **close**(*bytes32* proposalHash, *uint32* proposalIndex, *uint64* proposalWeightBound, *uint32* lengthBound) - 结束提案。投票达到足够的数量后可由任何人调用。返回一个布尔值，表示提案被执行或移除
- **proposalHash**(*bytes memory* proposal) - 计算提案的哈希

其中需要提供的输入值可以定义为如下：

- **proposal** - [SCALE编码的](https://docs.substrate.io/reference/scale-codec/){target=_blank}Substrate调用，此调用用于提议动作
- **threshold** - 派送提案所需的成员数量
- **proposalHash** - 提案的哈希
- **proposalIndex** - 提案的索引
- **approve** - 投票赞成/否决提案
- **proposalWeightBound** - 提案可以使用的最大Substrate权重值。如果提案调用使用更多，调用将恢复
- **lengthBound** - 大于或等于SCALE编码提案长度的值（以字节为单位）

接口包含以下事件：

- **Executed**(*bytes32* proposalHash) - 提案执行时触发
- **Proposed**(*address indexed* who, *uint32* indexed proposalIndex, *bytes32 indexed* proposalHash, *uint32* threshold) - 提案成功提交并可执行或投票时触发
- **Voted**(*address indexed* who, *bytes32 indexed* proposalHash, *bool* voted) - 提案投票时触发
- **Closed**(*bytes32 indexed* proposalHash) 提案结束时触发

## 与Solidity接口交互 {: #interacting-with-the-solidity-interface }

此部分示例将向您展示如何使用财政库委员会团体预编译提交财政库提案。因此，该提案将需要满足财政库委员会的投票要求。财政库提案至少需要3/5的财政库委员会投票才能通过。另一方面，需要至少1/2的财政库委员会投票才能拒绝提案。另外请注意，您必须是财政库委员会的一员才能提议和投票提案。

如果您不是Moonbeam、Moonriver或Moonbase Alpha财政库委员会的一员，您可以使用[Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev/){target=_blank}测试团体预编译的功能。Moonbeam开发节点将会自带[10个预注资的账户](/builders/get-started/networks/moonbeam-dev/#pre-funded-development-accounts){target=_blank}，其中Baltathar、Charleth和Dorothy被自动设置为财政库委员会团体的成员。您可以使用这三个账号的任何一个来完成以下教程。

### 查看先决条件 {: #checking-prerequisites }

此教程的示例将在Moonbeam开发节点上进行操作，但这也同样适用于其他任何基于Moonbeam的网络。

开始操作之前，您将需要准备以下内容：

 - 安装MetaMask并[连接至基于Moonbeam的网络](/tokens/connect/metamask/){target=_blank}
 - 准备一个拥有资金的账户。如果使用的是Moonbeam开发节点，则开发账户已经注入资金。如果使用的是Moonbeam、Moonriver或Moonbase Alpha，您将需要充值一定资金到您的账户。
    --8<-- 'text/faucet/faucet-list-item.md'

如果您使用的是Moonbeam开发节点和开发账户，您将需要完成以下操作：

- 使用`--sealing 6000`标志将您的开发节点设置为按时间间隔封装区块，例如每6秒（6000毫秒）
- [将Polkadot.js Apps连接至您的本地Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev/#connecting-polkadot-js-apps-to-a-local-moonbeam-node){target=_blank}
- 将Baltathar、Charleth和/或Dorothy的账户导入到[Polkadot.js Apps](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank}和[MetaMask](/tokens/connect/metamask/#import-accounts){target=_blank}

### Remix设置 {: #remix-set-up }

1. 获取[`Collective.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}的副本
2. 将文件内容复制并粘贴至名为`Collective.sol`的[Remix文件](https://remix.ethereum.org/){target=_blank}

![Copying and Pasting the Collective Interface into Remix](/images/builders/pallets-precompiles/precompiles/collective/collective-1.png)

### 编译合约 {: #compile-the-contract }

1. 点击**Compile**标签（从上至下第二个）
2. 编译接口，点击**Compile Collective.sol**

![Compiling Collective.sol](/images/builders/pallets-precompiles/precompiles/collective/collective-2.png)

### 获取合约 {: #access-the-contract }

1. 点击Remix中**Compile**正下方的**Deploy and Run**标签。请注意，您不是在此处部署合约，而是获取已经部署的预编译合约
2. 确保在**ENVIRONMENT**下拉菜单中选择**Injected Provider - Metamask**
3. 确保在**CONTRACT**下拉菜单中选择**Collective - Collective.sol**。因为这是一个预编译合约，因此无需部署，相反您需要在**At Address**字段中提供预编译的地址
4. 提供团体预编译的地址`{{networks.moonbase.precompiles.collective_treasury}}`并点击**At Address**
5. 团体预编译将出现在**Deployed Contracts**列表中

![Access the precompile contract](/images/builders/pallets-precompiles/precompiles/collective/collective-3.png)

### 创建提案 {: #create-a-proposal }

要提交需要通过财政库委员会团体投票的提案，您首先必须创建一个财政库提案。如果您想要投票的财政库提案已经存在且已经拥有提案的索引，您可以跳过此步骤直接进入下一部分。

要提交财政库提案，您可以用过[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/treasury){target=_blank}的财政库页面来完成。在本示例中，您可以创建一个简单的提案，即向Alith发送10个DEV Token用于主办社群活动。为此，点击**Submit proposal**，并填写以下内容：

1. 在**submit with account**下拉菜单中，选择您想要用于提交提案的账户。提案所需的保证金将从此账户提取
2. 选择**beneficiary**，在本示例中为**Alith**
3. 在**value**一栏输入`10`
4. 点击**Submit proposal**后签署并提交提案

![Submit a treasury proposal](/images/builders/pallets-precompiles/precompiles/collective/collective-4.png)

您将在**proposals**部分看到您创建的提案出现。如果这是您创建的首个提案，则提案的索引为`0`（这将用于下一部分）。要查看所有的提案，您可以导向至**Developer**标签，选择**Chain State**并执行以下步骤：

1. 在**selected state query**下拉菜单中选择**treasury**
2. 选择**proposals** extrinsic
3. 将**include option**滑块关闭
4. 点击**+**提交查询
5. 结果将在下方显示，包括提案索引和提案详情

![View all treasury proposals](/images/builders/pallets-precompiles/precompiles/collective/collective-5.png)

现在您已经拥有提案及其索引，您可以使用团体预编译在下一部分批准提案。

### 提出提案 {: #propose-the-proposal }

要使用团体预编译提出提案以便对应团体可以投票，您将需要获取调用的编码调用数据，以通过提案执行。您可以从Polkadot.js Apps得到编码的调用数据。在此示例中，您需要提议treasury pallet的**approveProposal** extrinsic。为此，导向至**Developer**标签，选择**Extrinsics**，然后执行以下步骤：

1. 选择一个账号（任何一个账号即可，您不会在此处用该账号提交任何交易）
2. 选择**treasury** pallet
3. 选择**approveProposal** extrinsic
4. 输入提案索引，以便团体投票批准
5. 为提案复制**encoded call data（编码的调用数据）**

![Get encoded proposal](/images/builders/pallets-precompiles/precompiles/collective/collective-6.png)

在本示例中，提案的extrinsic编码调用数据为`0x110200`。

使用编码后的提案，您可以返回Remix并在**Deployed Contracts**部分展开**COLLECTIVE**预编译合约。确保您已连接至您的账户，且此账户为财政库委员会成员，并执行以下步骤提出批准：

1. 展开**propose**函数
2. 输入**threshold**。请注意财政库提案通过至少需要3/5的财政库委员会投票通过。因此，在本示例中您可以将其设为`2`
3. 在**proposal**字段，您可以复制从Polkadot.js Apps检索获得的编码提案
4. 点击**transact**
5. MetaMask将会跳出弹窗要求您确认交易

![Propose the approval](/images/builders/pallets-precompiles/precompiles/collective/collective-7.png)

### 为提案进行投票 {: #vote-on-a-proposal }

要为提案进行投票，您需要将编码后的提案传入到**proposalHash**函数来获取提案哈希。

![Get the proposal hash](/images/builders/pallets-precompiles/precompiles/collective/collective-8.png)

获取提案哈希之后，请确保您已经连接至财政库委员会成员的账号，然后执行以下步骤：

1. 在Remix中展开**vote**函数
2. 输入**proposalHash**
3. 输入**proposalIndex**
4. 在**approve**字段输入`true` 
5. 点击**transact**
6. MetaMask将会跳出弹窗要求您确认交易

![Vote on the proposal](/images/builders/pallets-precompiles/precompiles/collective/collective-9.png)

将阈值设置为`2`后，您需要在MetaMask将账号切换成另一个财政库委员会团体成员并重复上述步骤投票以达到阈值。当达到阈值后，您可以结束提案，这意味着提案将自动执行。如果获得批准，提案会进入费用支出的等待列队，提案申请的金额将分配给受益人。在本示例中，当提案进入费用支出期，10个DEV Token将返还给Alith。

## 结束提案 {: #close-a-proposal }

如果提案拥有足够的投票，任何人可以结束提案。您无需成为财政库委员会成员以结束提案。要结束提案，您需要执行以下步骤：

1. 展开**close**函数
2. 输入**proposalHash**
3. 输入**proposalIndex**
4. 输入**proposalWeightBound**，在本示例中可以设为`1000000000`
5. 输入**lengthBound**，此数值可以大于或等于提案编码调用数据的长度。在本示例中，编码调用数据为`0x110200`，因此您可以将此数值设置为`8`
6. 点击**transact**
7. MetaMask将会跳出弹窗要求您确认交易

![Close the proposal](/images/builders/pallets-precompiles/precompiles/collective/collective-10.png)

您可以使用Polkadot.js Apps验证提案是否通过。在**Developer**标签处选择**Chain State**，并执行以下步骤：

1. 选择**treasury** pallet
2. 选择**approvals** extrinsic
3. 点击**+**以提交查询
4. 提案将会出现在批准列表中

![Review the treasury approvals](/images/builders/pallets-precompiles/precompiles/collective/collective-11.png)

当提案进入费用支出期，提案申请的金额将分配给受益人，初始的保证金将返还给提案者。若财政库用完所有的资金，已批准的提案将一直保存到下一个支出期，即当财政库再次拥有足够的资金。