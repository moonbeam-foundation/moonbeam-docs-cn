---
title: Preimage Precompile（原像预编译）合约
description: 学习如何通过提交原像执行在链上提交提案的首个必要步骤，该原像包含提案中要执行操作。
---

# 与Preimage Precompile交互

![Precomiled Contracts Banner](/images/builders/pallets-precompiles/precompiles/preimage/preimage-banner.png)

## 概览 {: #introduction }

作为波卡（Polkadot）平行链和去中心化网络，Moonbeam具有原生链上治理功能，使利益相关者能够参与网络的发展方向。随着OpenGov（也称为Governance v2）的推出，Preimage Pallet允许Token持有者通过提交原像（即提案中要在链上执行的操作）执行创建提案的第一步。提交提案需要用到原像哈希。了解关于Moonbeam治理系统的更多信息，例如相关专业术语、提案流程等，请参考[Moonbeam上的治理](/learn/features/governance){target=_blank}页面。

Preimage Precompile直接与Substrate的Preimage Pallet交互。此pallet以Rust编码，通常不能从Moonbeam的以太坊端访问。然而，Preimage Precompile允许您从Solidity接口访问创建和管理原像所需的函数，所有这些函数均是Substrate Preimage Pallet的一部分。

Preimage Precompile位于以下地址：

=== "Moonbeam"

     ```text
     {{ networks.moonbeam.precompiles.preimage }}
     ```

=== "Moonriver"

     ```text
     {{ networks.moonriver.precompiles.preimage }}
     ```

=== "Moonbase Alpha"

     ```text
     {{ networks.moonbase.precompiles.preimage }}
     ```

--8<-- 'text/precompiles/security.md'

## Preimage Solidity接口 {: #the-preimage-solidity-interface }

[`Preimage.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=_blank}是一个Solidity接口，允许开发者使用预编译的两个函数交互：

- **notePreimage**(*bytes memory* encodedPropsal) - 给定编码的提案，为即将到来的提案在链上注册原像并返回原像哈希。这不需要提案在分配列队中，但需要一笔保证金，该保证金将在提案生效后退还。使用preimage pallet的[`notePreimage`](/builders/pallets-precompiles/pallets/preimage/#:~:text=notePreimage(encodedProposal)){target=_blank}函数
- **unnotePreimage**(*bytes32* hash) - 给定要删除的原像哈希，从存储中清除未请求的原像。使用preimage pallet的[`unnotePreimage`](/builders/pallets-precompiles/pallets/preimage/#:~:text=notePreimage(hash)){target=_blank}函数

接口也包含以下事件：

- **PreimageNoted**(*bytes32* hash) - 当原像在链上注册时发出
- **PreimageUnnoted**(*bytes32* hash) - 当原像在链上注销时发出

## 与Solidity接口交互 {: #interact-with-the-solidity-interface }

### 查看先决条件 {: #checking-prerequisites } 

以下示例为在Moonbase Alpha上演示，但是步骤也同样适用于Moonriver。开始操作之前，您需要准备以下内容：

 - 安装MetaMask并[连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - 拥有DEV Token的账户。
 --8<-- 'text/faucet/faucet-list-item.md'

### Remix设置 {: #remix-set-up } 

1. 点击**File explorer**标签

2. 将[`Preimage.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=_blank}复制粘贴至[Remix文档](https://remix.ethereum.org/){target=_blank}，命名为`Preimage.sol`

![Copy and paste the referenda Solidity interface into Remix.](/images/builders/pallets-precompiles/precompiles/preimage/preimage-1.png)

### 编译合约 {: #compile-the-contract } 

1. 点击**Compile**标签（从上至下第二个）

2. 然后在编译界面，点击**Compile Preimage.sol**

![Compile the Preimage.sol interface using Remix.](/images/builders/pallets-precompiles/precompiles/preimage/preimage-2.png)

### 获取合约 {: #access-the-contract } 

1. 点击位于Remix的**Compile**标签正下方的**Deploy and Run**标签。请注意：您并不是在此部署合约，您是在获取一个已经部署的预编译合约

2. 确保在**ENVIRONMENT**下拉菜单中已选择**Injected Provider - Metamask**

3. 确保在**CONTRACT**下拉菜单中已选择**Preimage.sol**。由于这是一个预编译的合约，因此无需部署，但是您需要在**At Address**字段中提供预编译的地址

4. 为Moonbase Alpha提供Preimage Precompile的地址：`{{ networks.moonbase.precompiles.preimage }}`并点击**At Address**

5. Preimage Precompile将会出现在**Deployed Contracts**列表当中

![Access the Preimage.sol interface by provide the precompile's address.](/images/builders/pallets-precompiles/precompiles/preimage/preimage-3.png)

### 提交提案原像 {: #submit-a-preimage } 

要提交提案，您需要先提交该提案的原像，即本质上定义提议的链上操作。您可以使用Preimage Precompile的`notePreimage`函数提交原像。`notePreimage`函数接受编码的提案，因此您需要先获取编码的提案，可通过使用Polkadot.js Apps轻松获得。

--8<-- 'text/precompiles/governance/submit-preimage.md'

现在，您可以获取从[Polkadot.js Apps](https://polkadot.js.org/apps?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/democracy){target=_blank}获得的编码提案的**bytes**，并通过Preimage Precompile的`notePreimage`函数提交。要通过`notePreimage`函数提交原像，请执行以下步骤：

1. 展开Preimage Precompile合约查看可用函数

2. 找到**notePreimage**函数，点击按钮展开此部分

3. 输入上述部分获得的编码提案的**bytes**。请注意，编码提案并非与原像哈希相同，确保您在此字段输入正确的数值

4. 点击**transact**并在MetaMask确认交易

![Submit the preimage using the notePreimage function of the Preimage Precompile.](/images/builders/pallets-precompiles/precompiles/preimage/preimage-4.png)

现在你已经为您的提案提交原像，您可以提交提案了！关于如何提交提案，请参考[Referenda Precompile](/builders/pallets-precompiles/precompiles/referenda){target=_blank}文档。

如果您想要移除原像，除了使用`unnotePreimage`函数，以及将编码的提案替换成原像哈希以外，您可以遵循以上步骤操作。
