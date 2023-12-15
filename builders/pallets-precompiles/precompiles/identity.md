---
title: Identity Precompile
description: Learn all you need to know about the Identity Precompile, such as its address, Solidity interface, and how to interact with it using popular Ethereum libraries.
深入了解Identity Precompile相关内容，包括其地址、Solidity接口，以及如何使用常用的以太坊库与其交互。
---

# Identity Precompile on Moonbeam - Moonbeam上的Identity Precompile

## Introduction - 概览 {: #introduction }

The Identity Precompile is a Solidity interface that allows you to create, manage, and retrieve information on on-chain identities. Identities are attached to accounts and include personal information, such as your legal name, display name, website, Twitter handle, Riot (now known as Element) name, and more. You can also take advantage of custom fields to include any other relevant information.

Identity Precompile是一个Solidity接口，用于创建、管理和检索链上身份信息。身份与账户相关联，并包括个人信息，例如法定姓名、对外显示的名称、网站、Twitter名称、Riot（现为Element）名称等。您也可以通过填写自定义字段包含任何其他相关信息。

The Identity Precompile interacts directly with Substrate's [Identity Pallet](/builders/pallets-precompiles/pallets/identity){target=_blank} to provide the functionality needed to create and manage identities. This pallet is coded in Rust and is normally not accessible from the Ethereum side of Moonbeam. However, the Identity Precompile allows you to access this functionality directly from the Solidity interface.

Identity Precompile直接与Substrate的[Identity Pallet](/builders/pallets-precompiles/pallets/identity){target=_blank}交互，以提供创建和管理身份所需的功能。此Pallet以Rust编写，通常无法从Moonbeam的以太坊侧直接访问。然而，Identity Precompile允许您直接从Solidity接口访问此功能。

The Identity Precompile is only available on Moonbase Alpha and is located at the following address:

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

## The Identity Precompile Solidity Interface - Identity Precompile Solidity接口 {: #the-solidity-interface }

[`Identity.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/identity/Identity.sol){target=_blank} is a Solidity interface that allows developers to interact with the precompile's methods.

[`Identity.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/identity/Identity.sol){target=_blank}是一个Solidity接口，允许开发者与预编译函数进行交互：

??? code "Identity.sol"

    ```solidity
    --8<-- 'code/builders/pallets-precompiles/precompiles/identity/Identity.sol'
    ```

The Identity Precompile contains some functions that can be called by anyone and some judgment-related functions that can only be called by a registrar. The functions that can be called by anyone are as follows:

Identity Precompile包含一些任何人都可以调用的函数，以及只能由注册人调用的一些与判断相关的函数。任何人都可以调用的函数包含：

- **identity**(*address* who) - returns registration information for a given account

- **identity**(*address* who) - 返回给定账户的注册信息

- **superOf**(*address* who) - retrieves the super account for a sub-account. If the given account is not a sub-account, the address returned is `0x0000000000000000000000000000000000000000`

- **superOf**(*address* who) - 检索子账户的超级账户。如果给定账户不是子账户，则返回的地址为`0x0000000000000000000000000000000000000000`

- **subsOf**(*address* who) - returns the sub-accounts for a given account. If the given account doesn't have any sub-accounts, an empty array is returned (`[]`)

- **subsOf**(*address* who) - 返回给定账户的子账户。如果给定账户没有任何子账户，则返回(`[]`)

- **registrars**() - returns the list of registrars

  **registrars**() - 返回注册人列表

- **setIdentity**(*IdentityInfo memory* info) - sets the identity for the caller

- **setIdentity**(*IdentityInfo memory* info) - 为调用者设置身份

- **setSubs**(*SubAccount[] memory* subs) - sets the sub-accounts for the caller

- **setSubs**(*SubAccount[] memory* subs) - 为调用者设置子账户

- **clearIdentity**() - clears the identity for the caller

- **clearIdentity**() - 为调用者清除身份

- **requestJudgement**(*uint32* regIndex, *uint256* maxFee) - requests judgment from a given registrar along with the maximum fee the caller is willing to pay

- **requestJudgement**(*uint32* regIndex, *uint256* maxFee) - 请求指定注册人的判断以及调用者愿意支付的最高费用

- **cancelRequest**(*uint32* regIndex) - cancels the caller's request for judgment from a given registrar

- **cancelRequest**(*uint32* regIndex) - 取消调用者对给定注册人的判断请求

- **addSub**(*address* sub, *Data memory* data) - adds a sub-identity account for the caller

- **addSub**(*address* sub, *Data memory* data) - 为调用者添加子身份账户

- **renameSub**(*address* sub, *Data memory* data) - renames a sub-identity account for the caller

- **renameSub**(*address* sub, *Data memory* data) - 为调用者重命名子身份账户

- **removeSub**(*address* sub) - removes a sub identity account for the caller

- **removeSub**(*address* sub) - 为调用者移除子身份账户

- **quitSub**(*address* sub) - removes the caller as a sub-identity account

- **quitSub**(*address* sub) - 将调用者从子身份账户移除

The judgment-related functions that must be called by a registrar and the caller must be the registrar account that corresponds to the `regIndex` are:

判断相关的函数必须由注册人调用，并且调用者必须是对应`regIndex`的注册人账户：

- **setFee**(*uint32* regIndex, *uint256* fee) - sets the fee for a registar
- **setFee**(*uint32* regIndex, *uint256* fee) - 为注册人设置费用
- **setAccountId**(*uint32* regIndex, *address* newAccount) - sets a new account for a registrar
- **setAccountId**(*uint32* regIndex, *address* newAccount) - 为注册人设置新账户
- **setFields**(*uint32* regIndex, *IdentityFields memory* fields) - sets the registrar's identity
- **setFields**(*uint32* regIndex, *IdentityFields memory* fields) - 设置注册人的身份
- **provideJudgement**(*uint32* regIndex, *address* target, *Judgement memory* judgement, *bytes32* identity) - provides judgment on an account's identity
- **provideJudgement**(*uint32* regIndex, *address* target, *Judgement memory* judgement, *bytes32* identity) - 提供对账户身份的判断

## Interact with the Solidity Interface - 与Solidity接口交互 {: #interact-with-interface }

The following sections will cover how to interact with the Identity Precompile using [Ethereum libraries](/builders/build/eth-api/libraries/){target=_blank}, such as [Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}, [Web3.js](/builders/build/eth-api/libraries/web3js){target=_blank}, and [Web3.py](/builders/build/eth-api/libraries/web3py){target=_blank}.

以下部分将介绍如何使用[以太坊库](/builders/build/eth-api/libraries/){target=_blank}（例如 [Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}、[Web3.js](/builders/build/eth-api/libraries/web3js){target=_blank}和[Web3.py](/builders/build/eth-api/libraries/web3py){target=_blank}）与Identity Precompile交互。

The examples in this guide will be on Moonbase Alpha. 本教程中的示例将在Moonbase Alpha上操作。
--8<-- 'text/common/endpoint-examples.md'

### Using Ethereum Libraries - 使用以太坊库 {: #use-ethereum-libraries }

To interact with the Identity Precompile's Solidity interface with an Ethereum library, you'll need the Identity Precompile's ABI.

要使用以太坊库与Identity Precompile的Solidity接口交互，将您将需要用到Identity Precompile的ABI。

??? code "Identity Precompile ABI"

    ```js
    --8<-- 'code/builders/pallets-precompiles/precompiles/identity/abi.js'
    ```

Once you have the ABI, you can interact with the precompile using the Ethereum library of your choice. Generally speaking, you'll take the following steps:

有了ABI后，您可以根据您的选择使用以太坊库与预编译交互。一般情况下，您需要执行以下步骤：

1. Create a provider

   创建 provider

2. Create a contract instance of the Identity Precompile

   创建Identity Precompile的合约实例

3. Interact with the Identity Precompile's functions

   与Identity Precompile的函数交互

In the examples below, you'll learn how to assemble the data required to set an identity, how to set an identity, and how to retrieve the identity information once it's been set.

在下方示例中，您将了解如何组合设置身份所需的数据、如何设置身份以及如何在设置身份信息后检索身份信息。

!!! remember 请注意
    The following snippets are for demo purposes only. Never store your private keys in a JavaScript or Python file.

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
