---
title: Preimage Precompile Contract
description: Learn how to take the first necessary step to submit a proposal on-chain by submitting a preimage that contains the action to be carried out in the proposal.
学习如何通过提交原像自行在链上提交提案的首个必要步骤，该原像包含提案中要执行操作。
---

# Interacting with the Preimage Precompile 与 Preimage Precompile交互

![Precomiled Contracts Banner](/images/builders/pallets-precompiles/precompiles/preimage/preimage-banner.png)

## Introduction 概览 {: #introduction }

As a Polkadot parachain and decentralized network, Moonbeam features native on-chain governance that enables stakeholders to participate in the direction of the network. With the introduction of OpenGov, also referred to as Governance v2, the Preimage Pallet allows token holders to take the first step towards creating a proposal by submitting the preimage, which is the action to be carried out in the proposal, on-chain. The hash of the preimage is required to submit the proposal. To learn more about Moonbeam's governance system, such as an overview of related terminology, the roadmap of a proposal, and more, please refer to the [Governance on Moonbeam](/learn/features/governance){target=_blank} page. 

作为波卡平行链和去中心化网络，Moonbeam具有原生链上治理，能够使Token持有者直接参与网络。随着OpenGov（也称为Governance v2）的推出，Preimage Pallet允许Token持有者通过提交原像（即提案中要在链上执行的操作）执行创建提案的第一步。提交提案需要用到原像哈希。了解关于Moonbeam治理系统的更多信息，例如相关专业术语、提案流程等，请参考[Moonbeam上的治理](/learn/features/governance){target=_blank}页面。

The Preimage Precompile interacts directly with Substrate's Preimage Pallet. This pallet is coded in Rust and is normally not accessible from the Ethereum side of Moonbeam. However, the Preimage Precompile allows you to access functions needed to create and manage preimages, all of which are part of the Substrate Preimage Pallet, directly from a Solidity interface.

Preimage Precompile直接与Substrate的Preimage Pallet交互。此pallet以Rust编码，通常不能从Moonbeam的以太坊端访问。然而，Preimage Precompile允许您获取创建和管理原像所需的函数，所有这些函数均是Substrate Preimage Pallet的一部分，直接来自Solidity接口。

The Preimage Precompile is currently available in OpenGov, which is available on Moonriver and Moonbase Alpha only. If you're looking for similar functionality for Moonbeam, which is still on Governance v1, you can refer to the [Democracy Precompile](/builders/pallets-precompiles/precompiles/democracy){target=_blank} documentation.

Preimage Precompile目前可用于OpenGov（即仅可在Moonriver和Moonbase Alpha上使用）。如果您想在Moonbeam上使用类似功能，即Governance v1，请参考[Democracy Precompile](/builders/pallets-precompiles/precompiles/democracy){target=_blank}文档。

The Preimage Precompile is located at the following address:

Preimage Precompile位于以下地址：

=== "Moonriver"
     ```
     {{ networks.moonriver.precompiles.preimage }}
     ```

=== "Moonbase Alpha"
     ```
     {{ networks.moonbase.precompiles.preimage }}
     ```

--8<-- 'text/precompiles/security.md'

## The Preimage Solidity Interface - Preimage Solidity接口 {: #the-preimage-solidity-interface }

[`Preimage.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=_blank} is a Solidity interface that allows developers to interact with the precompile's two methods:

[`Preimage.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=_blank}是一个Solidity接口，允许开发者使用预编译的两个函数交互：

- **notePreimage**(*bytes memory* encodedPropsal) — registers a preimage on-chain for an upcoming proposal given the encoded proposal and returns the preimage hash. This doesn't require the proposal to be in the dispatch queue but does require a deposit which is returned once enacted. Uses the [`notePreimage`](/builders/pallets-precompiles/pallets/preimage/#:~:text=notePreimage(encodedProposal)){target=_blank} method of the preimage pallet
- **notePreimage**(*bytes memory* encodedPropsal) - 给定编码的提案，为即将到来的提案在链上注册原像并返回原像哈希。这不需要提案在分配列队中，但需要一笔保证金，该保证金将在提案生效后退还。使用preimage pallet的[`notePreimage`](/builders/pallets-precompiles/pallets/preimage/#:~:text=notePreimage(encodedProposal)){target=_blank}函数
- **unnotePreimage**(*bytes32* hash) - clears an unrequested preimage from storage given the hash of the preimage to be removed. Uses the [`unnotePreimage`](/builders/pallets-precompiles/pallets/preimage/#:~:text=notePreimage(hash)){target=_blank} method of the preimage pallet
- **unnotePreimage**(*bytes32* hash) - 给定要删除的原像哈希，从存储中清除未请求的原像。使用 preimage pallet的[`unnotePreimage`](/builders/pallets-precompiles/pallets/preimage/#:~:text=notePreimage(hash)){target=_blank}函数

The interface also includes the following events:

接口也包含以下事件：

- **PreimageNoted**(*bytes32* hash) - emitted when a preimage was registered on-chain
- **PreimageNoted**(*bytes32* hash) - 当原像在链上注册时注册时发出
- **PreimageUnnoted**(*bytes32* hash) - emitted when a preimage was un-registered on-chain
- **PreimageUnnoted**(*bytes32* hash) - 当原像在链上未注册时发出

## Interact with the Solidity Interface 与Solidity接口交互 {: #interact-with-the-solidity-interface }

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

2. Paste a copy of [`Preimage.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=_blank} into a [Remix file](https://remix.ethereum.org/){target=_blank} named `Preimage.sol`

   将[`Preimage.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=_blank}复制粘贴至[Remix文档](https://remix.ethereum.org/){target=_blank}，命名为`Preimage.sol`

![Copy and paste the referenda Solidity interface into Remix.](/images/builders/pallets-precompiles/precompiles/preimage/preimage-1.png)

### Compile the Contract 编译合约 {: #compile-the-contract } 

1. Click on the **Compile** tab, second from top

   点击**Compile**标签（从上至下第二个）

2. Then to compile the interface, click on **Compile Preimage.sol**

   然后编译接口，点击**Compile Preimage.sol**

![Compile the Preimage.sol interface using Remix.](/images/builders/pallets-precompiles/precompiles/preimage/preimage-2.png)

### Access the Contract 获取合约 {: #access-the-contract } 

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed

   在Remix的**Compile**标签下面，点击**Deploy and Run**。请注意：不是在此处部署合约，而是获取已部署的预编译合约

2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down

   确保在**ENVIRONMENT**下拉菜单中已选择**Injected Provider - Metamask**

3. Ensure **Preimage.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** field

   确保在**CONTRACT**下拉菜单中已选择**Preimage.sol**。由于这是一个预编译的合约，因此无需部署，但是您需要在**At Address**字段中提供预编译的地址

4. Provide the address of the Preimage Precompile for Moonbase Alpha: `{{ networks.moonbase.precompiles.preimage }}` and click **At Address**

   为Moonbase Alpha提供Preimage Precompile的地址：`{{ networks.moonbase.precompiles.preimage }}`并点击**At Address**

5. The Preimage Precompile will appear in the list of **Deployed Contracts**

   Preimage Precompile将会出现在**Deployed Contracts**列表当中

![Access the Preimage.sol interface by provide the precompile's address.](/images/builders/pallets-precompiles/precompiles/preimage/preimage-3.png)

### Submit a Preimage of a Proposal 提交提案原像 {: #submit-a-preimage } 

In order to submit a proposal, you'll first need to submit a preimage of that proposal, which essentially defines the proposed action on-chain. You can submit the preimage using the `notePreimage` function of the Preimage Precompile. The `notePreimage` function accepts the encoded proposal, so the first step you'll need to take is to get the encoded proposal, which can easily be done using Polkadot.js Apps.

要提交提案，您需要先提交该提案的原像，即本质上定义提议的链上操作。您可以使用Preimage Precompile的`notePreimage`函数提交原像。`notePreimage`函数接受编码的提案，因此您需要先获取编码的提案，可通过使用Polkadot.js Apps轻松获得。

--8<-- 'text/precompiles/governance/submit-preimage.md'

Now you can take the **bytes** of the encoded proposal that you got from [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/democracy){target=_blank} and submit it via the `notePreimage` function of the Preimage Precompile. To submit the preimage via the `notePreimage` function, take the following steps:

现在，您可以获取从[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/democracy){target=_blank}获得的编码提案的**bytes**，并通过Preimage Precompile的`notePreimage`函数提交。要通过`notePreimage`函数提交原像，请执行以下步骤：

1. Expand the Preimage Precompile contract to see the available functions 

   展开Preimage Precompile合约查看可用函数

2. Find the **notePreimage** function and press the button to expand the section

   找到**notePreimage**函数，点击按钮展开此部分

3. Provide the **bytes** of the encoded proposal that you noted in the prior section. Note, the encoded proposal is not the same as the preimage hash. Ensure you are are entering the correct value into this field

   输入上述部分获得的编码提案的**bytes**。请注意，编码提案并非与原像哈希相同，确保您在此字段输入正确的数值

4. Press **transact** and confirm the transaction in MetaMask

   点击**transact**并在MetaMask确认交易

![Submit the preimage using the notePreimage function of the Preimage Precompile.](/images/builders/pallets-precompiles/precompiles/preimage/preimage-4.png)

Now that you've submitted the preimage for your proposal your proposal can be submitted! Head over to the [Referenda Precompile documentation](/builders/pallets-precompiles/precompiles/referenda){target=_blank} to learn how to submit your proposal.

现在你已经为您的提案提交原像，您可以提交提案了！关于如何提交提案，请参考[Referenda Precompile](/builders/pallets-precompiles/precompiles/referenda){target=_blank}文档。

If you wish to remove a preimage, you can follow the same steps noted above except use the `unnotePreimage` function and pass in the preimage hash instead of the encoded proposal.

如果您想要移除原像，除了使用`unnotePreimage`函数，以及将编码的提案替换成原像哈希以外，您可以遵循以上步骤操作。
