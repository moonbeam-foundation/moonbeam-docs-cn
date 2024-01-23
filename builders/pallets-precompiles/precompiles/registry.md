---
title: Precompile Registry
description: 学习如何在Moonbeam上访问Precompile Registry并与其交互，该Precompile Registry可用于检查给定地址是否是预编译以及是否可以在Moonbeam上支持。
---

# Moonbeam上的Precompile Registry

## 概览 {: #introduction }

Precompile Registry作为[Moonbeam上可用预编译](/builders/pallets-precompiles/precompiles/overview){target=\_blank}的单一数据源。Precompile Registry可用于确定地址是否对应于预编译，以及是否处于活跃状态或已启用。当Substrate和Polkadot生态系统中存在上游变化导致预编译发生向后不兼容的变化时，Precompile Registry的作用将非常有效。开发者可以设计退出策略，以确保其dApp在这些场景中能够正常恢复。

Precompile Registry还有另外一个作用，允许任何用户为预编译设置“虚拟代码”（`0x60006000fd`），这使预编译可以从Solidity调用。此功能必不可少，因为Moonbeam上的预编译在默认情况下是没有字节码的。“虚拟代码”可以绕过Solidity中的检查，以确保合约字节码的存在以及不是空白的。

Registry Precompile位于以下地址：

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.registry }}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.registry }}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonriver.precompiles.registry }}
     ```

--8<-- 'text/builders/pallets-precompiles/precompiles/security.md'

## Registry Precompile Solidity接口 {: #the-solidity-interface }

[`PrecompileRegistry.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=\_blank}是一个Solidity接口，允许开发者与预编译函数交互。

??? code "PrecompileRegistry.sol"

    ```solidity
    --8<-- 'code/builders/pallets-precompiles/precompiles/registry/PrecompileRegistry.sol'
    ```

- **isPrecompile**(*address* a) - 返回*bool*指示给定地址是否为预编译。对于活跃或已启用的预编译返回`true`
- **isActivePrecompile**(*address* a) - 返回*bool*指示给定地址是否为预编译。如果预编译已被弃用则返回`false`
- **updateAccountCode**(*address* a) - 使用给定预编译地址的虚拟代码（`0x60006000fd`）更新给定预编译的字节码。 默认情况下，预编译没有与之关联的字节码。此函数可用于添加虚拟字节码以绕过Solidity中的检查，以在调用合约函数之前检查合约的字节码是否不是空白

## 与Precompile Registry Solidity交互 {: #interact-with-precompile-registry-interface }

以下部分将概述如何从[Remix](/builders/build/eth-api/dev-env/remix){target=\_blank}和[以太坊库](/builders/build/eth-api/libraries/){target=\_blank}（例如[Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=\_blank}、[Web3.js](/builders/build/eth-api/libraries/web3js){target=\_blank}和[Web3.py](/builders/build/eth-api/libraries/web3py){target=\_blank}）与Registry Precompile交互。

以下操作将以Moonbase Alpha为例。
--8<-- 'text/_common/endpoint-examples.md'

### 使用Remix与Precompile Registry交互 {: #use-remix }

要快速开始使用[Remix](/builders/build/eth-api/dev-env/remix){target=\_blank}，[Precompile Registry合约已从GitHub加载](https://remix.ethereum.org/#url=https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=\_blank}。您也可以在Remix创建一个新文件并手动在[`PrecompileRegistry.sol`](#the-solidity-interface)合约中粘贴内容。

![Add the Precompile Registry Interface to Remix](/images/builders/pallets-precompiles/precompiles/registry/registry-1.png)

然后，您可以执行以下步骤进行编译、部署并与Precompile Registry交互：

1. 在**Compile**标签下，点击**Compile PrecompileRegistry.sol**开始编译合约。成功编译合约后将会在左侧出现绿色完成标记

    ![Compile the Precompile Registry contract](/images/builders/pallets-precompiles/precompiles/registry/registry-2.png)

2. 在**Deploy and run transactions**标签下，您可以使用地址加载Precompile Registry：

    1. 确保在**ENVIRONMENT**的下拉菜单中选择**Injected Provider - Metamask**，并已将MetaMask连接至Moonbase Alpha

    2. 确保在**CONTRACT**下拉菜单中选择**PrecompileRegistry**。因为这是一个已经预编译的合约，因此无需部署，但是您需要在**At Address**字段中提供预编译的地址

    3. 为Moonbase Alpha提供Precompile Registry的地址：`{{ networks.moonbase.precompiles.registry }}`并点击**At Address**

    4. Precompile Registry将在**Deployed Contracts**列表中出现

    ![Access the Precompile Registry contract](/images/builders/pallets-precompiles/precompiles/registry/registry-3.png)

3. 您可以与任何预编译的函数交互。在**Deployed Contracts**标签下方，展开Precompile Registry查看函数列表。例如，您可以使用**isPrecompile**函数查看该地址是否是预编译

    ![Interact with the Precompile Registry contract](/images/builders/pallets-precompiles/precompiles/registry/registry-4.png)

### 使用以太坊库与Precompile Registry交互 {: #use-ethereum-libraries }

要使用以太坊库与Precompile Registry的Solidity接口交互，您将需要Precompile Registry的ABI。

??? code "Precompile Registry ABI"

    ```js
    --8<-- 'code/builders/pallets-precompiles/precompiles/registry/abi.js'
    ```

有了ABI之后，您可以根据您的选择使用以太坊库与Registry交互。通常情况下，您需要执行以下步骤：

1. 创建一个提供商

2. 创建一个Precompile Registry的合约实例

3. 与Precompile Registry的函数交互

!!! 请记住
    以下代码片段仅用于演示目的。请勿将您的私钥存储在JavaScript或Python文件中。

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/pallets-precompiles/precompiles/registry/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/pallets-precompiles/precompiles/registry/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/pallets-precompiles/precompiles/registry/web3.py'
    ```
