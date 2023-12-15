---
title: Identity Precompile
description: 深入了解Identity Precompile相关内容，包括其地址、Solidity接口，以及如何使用常用的以太坊库与其交互。
---

# Moonbeam上的Identity Precompile

## 概览 {: #introduction }

Identity Precompile是一个Solidity接口，用于创建、管理和检索链上身份信息。身份与账户相关联，并包括个人信息，例如法定姓名、对外显示的名称、网站、Twitter名称、Riot（现为Element）名称等。您也可以通过填写自定义字段包含任何其他相关信息。

Identity Precompile直接与Substrate的[Identity Pallet](/builders/pallets-precompiles/pallets/identity){target=_blank}交互，以提供创建和管理身份所需的功能。此Pallet以Rust编写，通常无法从Moonbeam的以太坊侧直接访问。然而，Identity Precompile允许您直接从Solidity接口访问此功能。

Identity Precompile只在Moonbase Alpha可用，它位于以下地址：

<!-- === "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.identity }}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.identity }}
     ``` -->

=== "Moonbase Alpha"

     ```text
     {{networks.moonriver.precompiles.identity }}
     ```

--8<-- 'text/builders/build/pallets-precompiles/precompiles/security.md'

## Identity Precompile Solidity接口 {: #the-solidity-interface }

[`Identity.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/identity/Identity.sol){target=_blank}是一个Solidity接口，允许开发者与预编译函数进行交互：

??? code "Identity.sol"

    ```solidity
    --8<-- 'code/builders/pallets-precompiles/precompiles/identity/Identity.sol'
    ```

Identity Precompile包含一些任何人都可以调用的函数，以及只能由注册人调用的一些与判断相关的函数。任何人都可以调用的函数包含：

- **identity**(*address* who) - 返回给定账户的注册信息
- **superOf**(*address* who) - 检索子账户的超级账户。如果给定账户不是子账户，则返回的地址为`0x0000000000000000000000000000000000000000`
- **subsOf**(*address* who) - 返回给定账户的子账户。如果给定账户没有任何子账户，则返回(`[]`)
- **registrars**() - 返回注册人列表
- **setIdentity**(*IdentityInfo memory* info) - 为调用者设置身份
- **setSubs**(*SubAccount[] memory* subs) - 为调用者设置子账户
- **clearIdentity**() - 为调用者清除身份
- **requestJudgement**(*uint32* regIndex, *uint256* maxFee) - 请求指定注册人的判断以及调用者愿意支付的最高费用
- **cancelRequest**(*uint32* regIndex) - 取消调用者对给定注册人的判断请求
- **addSub**(*address* sub, *Data memory* data) - 为调用者添加子身份账户
- **renameSub**(*address* sub, *Data memory* data) - 为调用者重命名子身份账户
- **removeSub**(*address* sub) - 为调用者移除子身份账户
- **quitSub**(*address* sub) - 将调用者从子身份账户移除

判断相关的函数必须由注册人调用，并且调用者必须是对应`regIndex`的注册人账户：

- **setFee**(*uint32* regIndex, *uint256* fee) - 为注册人设置费用
- **setAccountId**(*uint32* regIndex, *address* newAccount) - 为注册人设置新账户
- **setFields**(*uint32* regIndex, *IdentityFields memory* fields) - 设置注册人的身份
- **provideJudgement**(*uint32* regIndex, *address* target, *Judgement memory* judgement, *bytes32* identity) - 提供对账户身份的判断

## 与Solidity接口交互 {: #interact-with-interface }

以下部分将介绍如何使用[以太坊库](/builders/build/eth-api/libraries/){target=_blank}（例如 [Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}、[Web3.js](/builders/build/eth-api/libraries/web3js){target=_blank}和[Web3.py](/builders/build/eth-api/libraries/web3py){target=_blank}）与Identity Precompile交互。

The examples in this guide will be on Moonbase Alpha. 本教程中的示例将在Moonbase Alpha上操作。
--8<-- 'text/common/endpoint-examples.md'

### 使用以太坊库 {: #use-ethereum-libraries }

要使用以太坊库与Identity Precompile的Solidity接口交互，将您将需要用到Identity Precompile的ABI。

??? code "Identity Precompile ABI"

    ```js
    --8<-- 'code/builders/pallets-precompiles/precompiles/identity/abi.js'
    ```

有了ABI后，您可以根据您的选择使用以太坊库与预编译交互。一般情况下，您需要执行以下步骤：

1. 创建 provider
2. 创建Identity Precompile的合约实例
3. 与Identity Precompile的函数交互

在下方示例中，您将了解如何组合设置身份所需的数据、如何设置身份以及如何在设置身份信息后检索身份信息。

!!! 请注意
    以下代码片段仅用于操作演示。请勿将您的私钥存储与JavaScript或Python文件中。

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/pallets-precompiles/precompiles/identity/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/pallets-precompiles/precompiles/identity/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/pallets-precompiles/precompiles/identity/web3.py'
    ```
