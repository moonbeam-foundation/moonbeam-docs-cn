---
title: 将XC-20发送至其他链
description: 学习如何使用X-Tokens pallet将XC-20发送至其他链。另外，X-Tokens预编译允许您通过以太坊API访问核心功能。
---

# 使用X-Tokens Pallet发送XC-20s

![x-tokens Precompile Contracts Banner](/images/builders/interoperability/xcm/xc20/xtokens/xtokens-banner.png)

## 概览 {: #introduction }

Building an XCM message for fungible asset transfers is not an easy task. Consequently, there are wrapper functions and pallets that developers can leverage to use XCM features on Polkadot and Kusama.

为同质化资产转移构建XCM信息通道并非一件易事。因此，开发者可以通过利用wrapper函数/pallet在Polkadot/Kusama上使用XCM功能。

One example of such wrappers is the [X-Tokens](https://github.com/open-web3-stack/open-runtime-module-library/tree/master/xtokens){target=_blank} Pallet, which provides different methods to transfer fungible assets via XCM.

此类包装器的一个示例是[x-tokens](https://github.com/open-web3-stack/open-runtime-module-library/tree/master/xtokens){target=_blank} pallet，用于提供通过XCM转移同质化资产的不同方法。

This guide will show you how to leverage the X-Tokens Pallet to send [XC-20s](/builders/interoperability/xcm/xc20/overview/){target=_blank} from a Moonbeam-based network to other chains in the ecosystem (relay chain/parachains). Moreover, you'll also learn how to use the X-Tokens Precompile to perform the same actions via the Ethereum API.

本教程将向您展示如何利用x-tokens pallet在生态系统（中继链/平行链）中从基于Moonbeam的网络发送XC-20至其他链。此外，您还将学习到如何使用x-tokens预编译通过以太坊API执行同样的操作。

**Developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

**开发者须知若发送不正确的XCM信息可能会导致资金丢失。**因此，XCM功能需先在测试网上进行测试后才可移至生产环境。

## 相关XCM定义 {: #relevant-xcm-definitions }

This guide assumes you have a basic understanding of XCM. If not, please take time to review the [XCM Overview](/builders/interoperability/xcm/overview){target=_blank} page.

For this guide specifically, you'll need to have an understanding of the following definitions:

--8<-- 'text/xcm/general-xcm-definitions2.md'

## X-tokens Pallet接口 {: #x-tokens-pallet-interface }

### Extrinsics {: #extrinsics }

X-tokens pallet提供以下extrinsics（函数）：

 - **transfer**(currencyId, amount, dest, destWeightLimit) — 转移一个币种，根据原生Token（自身储备）或是资产ID定义
 - **transferMultiasset**(asset, dest, destWeightLimit) — 转移一种可替代资产，根据其multilocation定义
 - **transferMultiassetWithFee**(asset, fee, dest, destWeightLimit) — 转移一种可替代资产，但其能够让资产的发送者使用另外一种资产支付转移费用。两者皆根据其multilocation定义
 - **transferMultiassets**(assets, feeItem, dest, destWeightLimit) — 转移多种可替代资产，并定义其中哪种资产将会被用于支付转移费用。所有资产皆由其multilocation定义
 - **transferMulticurrencies**(currencies, feeItem, dest, destWeightLimit) — 转移多个币种，并定义其中哪种币种将会被用于支付转移费用。所有币种都将通过原生Token（自身储备）或是资产ID定义
 - **transferWithFee**(currencyId, amount, fee, dest, destWeightLimit) — 转移一个币种，但允许资产发送者使用不同的资产支付转移费用。两者皆由其multilocation定义

其中需要提供信息输入的函数定义如下：

 - **currencyId/currencies** — the ID/IDs of the currency/currencies being sent via XCM. Different runtimes have different ways to define the IDs. In the case of Moonbeam-based networks, a currency can be defined as one of the following:

    - `SelfReserve` - refers to the native token
    - `ForeignAsset` - refers to the asset ID of an [External XC-20](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=_blank} (not to be confused with the XC-20 address)
    - `LocalAssetReserve` - refers to the asset ID of a [Mintable XC-20](/builders/interoperability/xcm/xc20/mintable-xc20){target=_blank} (not to be confused with the XC-20 address). It is recommended to use [Local XC-20s](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank} instead via the `Erc20` currency type
    - `Erc20` - refers to the contract address of a [Local XC-20 (ERC-20)](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}

 - **currencyId/currencies** — 将通过XCM转移的币种ID。不同runtime有不同的方法定义ID。以基于Moonbeam的网络为例子，`SelfReserve`代表原生Token，`ForeignAsset`代表其XC-20资产ID（而不是其XC-20地址）

 - **amount** — 将通过XCM转移的Token数量

  - **dest** — a multilocation to define the destination address for the tokens being sent via XCM. It supports different address formats, such as 20 or 32-byte addresses (Ethereum or Substrate)
 - **dest** — 一个multilocation，用于定义将通过XCM转移Token的目标地址。其支持不同地址格式，如20或32字节的地址（以太坊或是Substrate格式）


 - **destWeightLimit** — an enum that represents the maximum amount of execution time you want to provide in the destination chain to execute the XCM message being sent. The enum contains the following options:

    - `Unlimited` - allows for the entire amount used for gas to be used to pay for weight
    - `Limited` - limits the amount used for gas to a particular value

    If not enough weight is provided, the execution of the XCM will fail, and funds might get locked in either the Sovereign account or a special pallet. **It is important to correctly set the destination weight to avoid failed XCM executions**
 - **destWeightLimit** — 一个枚举类型（enum），表示您提供给目标链希望其执行XCM信息的最大执行时间。`Unlimited`选项允许将所有用于gas的资产用于支付权重（weight）。`Limited`选项将gas的使用量限制为特定值。如果您提供的信息不足，XCM将会执行失败，且资金将会被锁定在主权账户或是特定的pallet中。**设置目标权重非常重要，这将避免XCM失败**

 - **asset/assets** — a multilocation to define the asset/assets being sent via XCM. Each parachain has a different way to reference assets. For example, Moonbeam-based networks reference their native tokens with the Balances Pallet index
 - **asset/assets** — 一个用于定义将通过XCM转移资产的multilocation。每条平行链将会有不同定义资产的方式。举例而言，基于Moonbeam的网络将会经由其原生Token的pallet余额索引定义

 - **fee** — 一个用于定义支付XCM在目标链上执行的multilocation
 - **feeItem** — 一个用于定义多样资产发送地点的索引，将用于支付XCM在目标链上的执行。举例而言，如果仅有一种资产被发送，`feeItem`将会是`0`

### 存储方法 {: #storage-methods }

X-tokens pallet包括以下只读存储方式：

- **palletVersion**() - 提供正在使用的x-tokens pallet的版本

### Pallet常量 {: #constants }

X-tokens pallet包括以下用于获取pallet常量的只读函数：

- **baseXcmWeight**() - 返回执行所需的基本XCM重量
- **selfLocation**() - 返回本地的multilocation

## 使用x-tokens Pallet构建XCM信息 {: #build-xcm-xtokens-pallet}

此教程将会包含使用x-tokens pallet构建XCM信息的过程，更详细来说为使用`transfer`和`transferMultiasset`函数。然而，这两种情况仍然可以外推至其他函数，特别是当您熟悉了多重地点的使用之后。

!!! 注意事项
    每条平行链皆能够通过pallet允许/禁止特定函数。因此，开发者需要确认使用的函数是被平行链允许的。相反来说，如果使用了被禁止的函数，交易将会如同`system.CallFiltered`显示一般失败。

本教程将以转移xcUNIT token为例。xcUNIT是Alphanet中继链Token UNIT的[XC-20](/builders/interoperability/xcm/xc20/overview){target=_blank}形式，也是[外部XC-20](/builders/interoperability/xcm/xc20/xc20){target=_blank}。本教程也同样适用于其他外部XC-20或[可铸造XC-20](/builders/interoperability/xcm/xc20/mintable-xc20){target=_blank}。

### 查看先决条件 {: #xtokens-check-prerequisites}

To follow along with the examples in this guide, you need to have the following:

要在Polikadot.js Apps上发送extrinsics，您需要准备以下内容：

- An account with funds.
 --8<-- 'text/faucet/faucet-list-item.md'
- 一些xcUNIT tokens。您可以在[Moonbeam-Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}上将DEV tokens兑换成xcUNIT，Moonbeam-Swap是Moonbase Alpha上的Uniswap-V2版本的示范协议。

    ![Moonbeam Swap xcUNIT](/images/builders/interoperability/xcm/xc20/xtokens/xtokens-1.png)

要查看您的xcUNIT余额，您可以使用以下地址将XC-20添加至MetaMask：

```
0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
```

!!! note
    If you're interested in how the precompile address is calculated, you can check out the [Calculate External XC-20 Precompile Addresses](/builders/interoperability/xcm/xc20/overview/#calculate-xc20-address){target=_blank} guide.

You can adapt this guide for another [external XC-20 or a local XC-20](/builders/interoperability/xcm/xc20/overview){target=_blank}. If you're adapting this guide for another external XC-20, you'll need to have the asset ID of the asset you're transferring and the number of decimals the asset has, which you can get by following the [Retrieve List of External XC-20s](/builders/interoperability/xcm/xc20/overview/#list-xchain-assets){target=_blank} guide. If you're adapting this guide for a local XC-20, you'll need to have the contract address of the XC-20.

### X-Tokens转移函数 {: #xtokens-transfer-function}

In this example, you'll build an XCM message to transfer xcUNIT from Moonbase Alpha back to its relay chain through the `transfer` function of the X-Tokens Pallet. To do this, you can use the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api){target=_blank}.

Since you'll be interacting with the `transfer` function of the X-Tokens Pallet, you can take the following steps to gather the arguments for the `currencyId`, `amount`, `dest`, and `destWeightLimit`:

1. Define the `currencyId`. For external XC-20s, you'll use the `ForeignAsset` currency type and the asset ID of the asset, which in this case is `42259045809535163221576417993425387648`. For a local XC-20, you'll need the address of the token. In JavaScript, this translates to:


In this example, you'll build an XCM message to transfer xcUNIT from Moonbase Alpha back to its relay chain through the `transfer` function of the X-Tokens Pallet. To do this, you can use the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api){target=_blank}.

Since you'll be interacting with the `transfer` function of the X-Tokens Pallet, you can take the following steps to gather the arguments for the `currencyId`, `amount`, `dest`, and `destWeightLimit`:

1. Define the `currencyId`. For external XC-20s, you'll use the `ForeignAsset` currency type and the asset ID of the asset, which in this case is `42259045809535163221576417993425387648`. For a local XC-20, you'll need the address of the token. In JavaScript, this translates to:

    === "External XC-20"

        ```js
        const currencyId = { 
          ForeignAsset: { 
            ForeignAsset: 42259045809535163221576417993425387648n 
          } 
        };
        ```

    === "Local XC-20"

        ```js
        const currencyId = { Erc20: { contractAddress: ERC_20_ADDRESS } };
        ```

2. Specify the `amount` to transfer. For this example, you are sending 1 xcUNIT, which has 12 decimals:

    ```js
    const amount = 1000000000000n;
    ```

3. Define the multilocation of the destination, which will target an account on the relay chain from Moonbase Alpha. Note that the only asset that the relay chain can receive is its own:

    ```js
    const dest = { 
      V3: { 
        parents: 1, 
        interior: { X1: { AccountId32: { id: RELAY_ACC_ADDRESS } } } 
      } 
    };
    ```

    !!! note
        For an `AccountId32`, `AccountIndex64`, or `AccountKey20`, you have the option of specify a `network` parameter. If you don't specify one, it will default to `None`.

4. Set the `destWeightLimit` to `Unlimited`. In JavaScript, you'll need to set `Unlimited` to `null` (as outlined in the [TypeScript interface for `XcmV3WeightLimit`](https://github.com/PureStake/moonbeam/blob/v0.31.1/typescript-api/src/moonbase/interfaces/augment-api-tx.ts#L5796){target=_blank}):

    ```js
    const destWeightLimit = { Unlimited: null };
    ```

    !!! note
        If you wanted to limit the destination weight, you could do so by using `Limited`, which requires you to enter values for `refTime` and `proofSize`. Where `refTime` is the amount of computational time that can be used for execution and `proofSize` is the amount of storage in bytes that can be used. 

        In JavaScript, this translates to:

        ```js
        { Limited: { refTime: ALLOWED_AMOUNT, proofSize: ALLOWED_AMOUNT } };
        ```

Now that you have the values for each of the parameters, you can write the script for the transfer. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - The Moonbase Alpha endpoint URL to create the provider
     - The values for each of the parameters of the `transfer` function
 2. Create a Keyring instance that will be used to send the transaction
 3. Create the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} provider
 4. Craft the `xTokens.transfer` extrinsic with the `currencyId`, `amount`, `dest`, and `destWeightLimit`
 5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

!!! remember
    This is for demo purposes only. Never store your private key in a JavaScript file.

```js
--8<-- 'code/xtokens/transfer.js'
```

!!! note
    You can view an example of the above script, which sends 1 xcUNIT to Alice's account on the relay chain, on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1e00018080778c30c20fa2ebc0ed18d2cbca1f0010a5d4e800000000000000000000000301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300){target=_blank} using the following encoded calldata: `0x1e00018080778c30c20fa2ebc0ed18d2cbca1f0010a5d4e800000000000000000000000301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300`.

Once the transaction is processed, the target account on the relay chain should have received the transferred amount minus a small fee that is deducted to execute the XCM on the destination chain.

### X-Tokens Transfer MultiAsset Function {: #xtokens-transfer-multiasset-function}

In this example, you'll build an XCM message to transfer xcUNIT from Moonbase Alpha back to its relay chain using the `transferMultiasset` function of the X-Tokens Pallet.

Since you'll be interacting with the `transferMultiasset` function of the X-Tokens Pallet, you can take the following steps to gather the arguments for the `asset`, `dest`, and `destWeightLimit`:

1. Define the XCM asset multilocation of the `asset`, which will target UNIT tokens in the relay chain from Moonbase Alpha as the origin. Each chain sees its own asset differently. Therefore, you will have to set a different asset multilocation for each destination

    === "External XC-20"

        ```js
        // Multilocation for UNIT in the relay chain
        const asset = {
          V3: {
            id: {
              Concrete: {
                parents: 1,
                interior: null,
              },
            },
            fun: {
              Fungible: { Fungible: 1000000000000n }, // 1 token
            },
          },
        };
        ```

    === "Local XC-20"

        ```js
        // Multilocation for a local XC-20 on Moonbeam
        const asset = {
          V3: {
            id: {
              Concrete: {
                parents: 0,
                interior: {
                  X2: [{ PalletInstance: 48 }, { AccountKey20: { key: ERC_20_ADDRESS } }],
                },
              },
            },
            fun: {
              Fungible: { Fungible: 1000000000000000000n }, // 1 token
            },
          },
        };
        ```

2. Define the XCM destination multilocation of the `dest`, which will target an account in the relay chain from Moonbase Alpha as the origin:

    ```js
    const dest = {
      V3: {
        parents: 1,
        interior: { X1: { AccountId32: { id: RELAY_ACC_ADDRESS } } },
      },
    };
    ```

    !!! note
        For an `AccountId32`, `AccountIndex64`, or `AccountKey20`, you have the option of specify a `network` parameter. If you don't specify one, it will default to `None`.

3. Set the destination weight limit to `Unlimited`. In JavaScript, you'll need to set `Unlimited` to `null` (as outlined in the [TypeScript interface for `XcmV3WeightLimit`](https://github.com/PureStake/moonbeam/blob/v0.31.1/typescript-api/src/moonbase/interfaces/augment-api-tx.ts#L5796){target=_blank}):

    ```js
    const destWeightLimit = { Unlimited: null };
    ```

    !!! note
        If you wanted to limit the destination weight, you could do so by using `Limited`, which requires you to enter values for `refTime` and `proofSize`. Where `refTime` is the amount of computational time that can be used for execution and `proofSize` is the amount of storage in bytes that can be used. 

        In JavaScript, this translates to:

        ```js
        { Limited: { refTime: ALLOWED_AMOUNT, proofSize: ALLOWED_AMOUNT } };
        ```

Now that you have the values for each of the parameters, you can write the script for the transfer. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - The Moonbase Alpha endpoint URL to create the provider
     - The values for each of the parameters of the `transferMultiasset` function
 2. Create a Keyring instance that will be used to send the transaction
 3. Create the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} provider
 4. Craft the `xTokens.transferMultiasset` extrinsic with the `asset`, `dest`, and `destWeightLimit`
 5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

!!! remember
    This is for demo purposes only. Never store your private key in a JavaScript file.

```js
--8<-- 'code/xtokens/transferMultiAsset.js'
```

!!! note
    You can view an example of the above script, which sends 1 xcUNIT to Alice's account on the relay chain, on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1e010300010000070010a5d4e80301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300){target=_blank} using the following encoded calldata: `0x1e010300010000070010a5d4e80301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300`

Once the transaction is processed, the account on the relay chain should have received the transferred amount minus a small fee that is deducted to execute the XCM on the destination chain.
## X-Tokens预编译 {: #xtokens-precompile}

X-tokens预编译合约将会允许开发者通过基于Moonbeam网络的以太坊API访问XCM Token转移功能。如同其他[预编译合约](/builders/build/canonical-contracts/precompiles/){target=_blank}，x-tokens预编译位于以下地址：

=== "Moonbeam"
     ```
     {{networks.moonbeam.precompiles.xtokens}}
     ```

=== "Moonriver"
     ```
     {{networks.moonriver.precompiles.xtokens}}
     ```

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.xtokens}}
     ```

--8<-- 'text/precompiles/security.md'

### X-Tokens Solidity接口  {: #xtokens-solidity-interface } 

[Xtokens.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank}是一个开发者能够使用以太坊API与x-tokens pallet交互的接口。

此接口包含以下函数：

 - **transfer**(*address* currencyAddress, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) —— 用于表示[先前示例](#xtokens-transfer-function)中提及的`transfer`函数。然而，在使用币种ID之外，您需要为`currencyAddress`提供资产预编译地址：

    - For [External XC-20s](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=_blank}, provide the [XC-20 precompile address](/builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=_blank}
    - 对于[外部XC-20](/builders/interoperability/xcm/xc20/xc20){target=_blank}，您可以提供[XC-20预编译地址](/builders/interoperability/xcm/xc20/xc20/#current-xc20-assets){target=_blank}

    - For native tokens (i.e., GLMR, MOVR, and DEV), provide the [ERC-20 precompile](/builders/pallets-precompiles/precompiles/erc20/#the-erc20-interface){target=_blank} address, which is `{{networks.moonbeam.precompiles.erc20 }}`
    - 对于原生Token（如GLMR、MOVR和DEV），您可以提供[ERC-20预编译](/builders/build/canonical-contracts/precompiles/erc20/#the-erc20-interface){target=_blank}地址，即`{{networks.moonbeam.precompiles.erc20 }}`

    - For [Local XC-20s](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}, provide the token's address
 
     The `destination` multilocation is built in a particular way that is described in the following section

    `destination` multilocation将会以一种特殊形式构建（我们将在下一部分提及）

 - **transferMultiasset**(*Multilocation* *memory* asset, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) —— 用于表示[先前示例](#xtokens-transfer-multiasset-function)中提及的`transferMultiasset`函数。两种multilocation将会以一种特殊形式构建（我们将在下一部分提及）

### 构建预编译Multilocation {: #building-the-precompile-multilocation }

在x-tokens预编译接口中，`Multilocation`架构根据下列函数定义：

--8<-- 'text/xcm/xcm-precompile-multilocation.md'

以下代码片段包含`Multilocation`架构的部分示例，因为其将会在x-tokens预编译函数中使用：

```js
// Multilocation targeting the relay chain or its asset from a parachain
{
    1, // parents = 1
    [] // interior = here
}

// Multilocation targeting Moonbase Alpha DEV token from another parachain
{
    1, // parents = 1
    // Size of array is 2, meaning is an X2 interior
    [
        '0x00000003E8', // Selector Parachain, ID = 1000 (Moonbase Alpha)
        '0x0403' // Pallet Instance = 3
    ]
}

// Multilocation targeting Alice's account on the relay chain from Moonbase Alpha
{
    1, // parents = 0
    // Size of array is 1, meaning is an X1 interior
    [
        '0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300' 
        // AccountKey32 Selector + Address in hex + Network(Option) Null
    ]
}
```

### 使用库与X-Token交互 {: #using-libraries-to-interact-with-xtokens}

当使用库与Ethereum API交互时，Multilocation结构可以像任何其他结构一样格式化。以下代码片段包括前面的[x-tokens 传输函数](#xtokens-transfer-function)、[x-tokens 多资产传输函数](#xtokens-transfer-multiasset-function)和示例Multilocation结构示例。您可以在Github上找到[x-tokens的合约ABI](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/xtokens/abi.js){target=_blank}。

=== "Ethers.js"

    ```js
    --8<-- 'code/xtokens/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/xtokens/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/xtokens/web3.py'
    ```

!!! 注意事项
    在Moonbeam 或 Moonriver上测试上述示例时，您可以将RPC URL替换为您自己的[私有端点](/builders/get-started/endpoints/){target=_blank}和API密钥。