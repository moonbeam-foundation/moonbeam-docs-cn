---
title: 发送XC-20资产至其他链
description: 学习如何使用X-Tokens Precompile发送XC-20资产至其他链，允许您能够使用如Ethers和Web3的以太坊库发送XC-20资产跨链。
---

# 使用X-Tokens Precompile发送XC-20资产

## 概览 {: #introduction }

构建用于同质化资产转移的XCM消息并非一件易事。因此，Polkadot和Kusama上有些wrapper函数和Pallet能帮助开发者使用XCM功能。此类wrapper函数的一个例子是 [X-Tokens](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet){target=_blank} Pallet，它提供了几个通过XCM转移同质化资产的方法。

X-Tokens Pallet采用Rust编码，通常无法从Moonbeam的以太坊API端访问。但是，X-Tokens Precompile允许您直接与Substrate pallet交互，从Solidity接口发送XC-20资产。

本教程将向您展示如何利用X-Tokens Precompile使用Ethers和Web3等以太坊库将[XC-20资产](/builders/interoperability/xcm/xc20/overview/){target=_blank}从基于Moonbeam的网络发送至生态系统中的其他链（中继链/平行链）。

**开发者须知若发送不正确的XCM消息可能会导致资金丢失。**因此，XCM功能需先在测试网上进行测试后才可移至生产环境。

## X-Tokens Precompile合约地址 {: #contract-address }

X-Tokens Precompile位于以下地址：

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.xtokens}}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.xtokens}}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.xtokens}}
     ```

--8<-- 'text/builders/pallets-precompiles/precompiles/security.md'

## X-Tokens Solidity接口 {: #xtokens-solidity-interface }

[Xtokens.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank}是一个接口，开发者可以通过该接口使用以太坊API与X-Token Pallet进行交互。

??? code "Xtokens.sol"

    ```solidity
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/Xtokens.sol'
    ```

该接口包含以下函数：

???+ function "**transfer**(*address* currencyAddress, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) — 在给定币种合约地址的情况下，转移币种"

    === "参数"
    
        - `currencyAddress` - 要转移的资产地址
            - 对于[外部XC-20](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=_blank}，需要提供[XC-20预编译地址](/builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=_blank}
            - 对于原生Token（如GLMR、MOVE和DEV），需要提供[ERC-20预编译](/builders/pallets-precompiles/precompiles/erc20/#the-erc20-interface){target=_blank}，即`{{networks.moonbeam.precompiles.erc20 }}`
            - 对于[本地XC-20](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}，需要提供Token地址
        - `amount` - 要通过XCM发送的Token数量
        - `destination` - 通过XCM发送的Token目标地址的multilocation。它支持不同的地址格式，例如20或32字节地址（以太坊或Substrate格式）。Multilocation必须以特定方式格式化，这在[构建预编译Multilocation](#building-the-precompile-multilocation)部分教程中进行了描述
        - `weight` - 为支付目标链上XCM执行而购买的权重，将从转移的资产中扣除

??? function "**transferWithFee**(currencyAddress, amount, fee, destination, weight) — 转移一个币种，根据原生Token（自身储备）或是资产ID定义，并分别指定费用和金额"

    === "参数"
    
        - `currencyAddress` - 要转移的资产地址
            - 对于[外部XC-20](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=_blank}，需要提供[XC-20预编译地址](/builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=_blank}
            - 对于原生Token（如GLMR、MOVE和DEV），需要提供[ERC-20预编译](/builders/pallets-precompiles/precompiles/erc20/#the-erc20-interface){target=_blank}，即`{{networks.moonbeam.precompiles.erc20 }}`
            - 对于[本地XC-20](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}，需要提供Token地址
        - `amount` - 要通过XCM发送的Token数量
        - `fee` — 支付目标链中XCM执行所需的金额。如果这个值低于执行成本，资产将被锁在目标链中
        - `destination` - 通过XCM发送的Token目标地址的multilocation。它支持不同的地址格式，例如20或32字节地址（以太坊或Substrate格式）。Multilocation必须以特定方式组成，这在[构建预编译Multilocation](#building-the-precompile-multilocation)部分教程中进行了描述
        - `weight` - 为支付目标链上XCM执行而购买的权重，将从转移的资产中扣除

??? function "**transferMultiasset**(*Multilocation* *memory* asset, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) — 转移一个同质化资产，根据其multilocation定义"

    === "参数"
    
        - `asset` - 要转移的资产的multilocation。Multilocation必须以特定方式组成，这在[构建预编译Multilocation](#building-the-precompile-multilocation)部分教程中进行了描述
        - `amount` - 要通过XCM发送的Token数量
        - `fee` — 支付目标链中XCM执行所需的金额。如果这个值低于执行成本，资产将被锁在目标链中
        - `destination` - 通过XCM发送的Token目标地址的multilocation。它支持不同的地址格式，例如20或32字节地址（以太坊或Substrate格式）。Multilocation必须以特定方式格式化，这在[构建预编译Multilocation](#building-the-precompile-multilocation)部分教程中进行了描述
        - `weight` - 为支付目标链上XCM执行而购买的权重，将从转移的资产中扣除

??? function "**transferMultiassetWithFee**(asset, fee, destination, weight) — 转移一个同质化资产，根据其multilocation定义，并用不同的资产支付费用，这也可根据其multilocation定义”

    === "参数"
    
        - `asset` - 要转移的资产的multilocation。Multilocation必须以特定方式组成，这在[构建预编译Multilocation](#building-the-precompile-multilocation)部分教程中进行了描述
        - `amount` - 要通过XCM发送的Token数量
        - `fee` — 支付目标链中XCM执行所需的金额。如果这个值低于执行成本，资产将被锁在目标链中
        - `destination` - 通过XCM发送的Token目标地址的multilocation。它支持不同的地址格式，例如20或32字节地址（以太坊或Substrate格式）。Multilocation必须以特定方式格式化，这在[构建预编译Multilocation](#building-the-precompile-multilocation)部分教程中进行了描述
        - `weight` - 为支付目标链上XCM执行而购买的权重，将从转移的资产中扣除

??? function "**transferMulticurrencies**(currencies, feeItem, destination, weight) — 转移不同的币种，指定哪种币种将用于支付费用。所有币种都将通过原生Token（自身储备）或是资产ID定义"

    === "参数"
    
        - `currencies` - 要发送的货币数组，由货币地址和要发送的金额数量定义
        - `feeItem` — 一个索引，定义正在发送资产数组的资产位置，用于支付目标链中XCM的执行费用。例如，如果仅发送一项资产，则`feeItem`将为`0`
        - `destination` - 通过XCM发送的Token目标地址的multilocation。它支持不同的地址格式，例如20或32字节地址（以太坊或Substrate格式）。Multilocation必须以特定方式格式化，这在[构建预编译Multilocation](#building-the-precompile-multilocation)部分教程中进行了描述
        - `weight` - 为支付目标链上XCM执行而购买的权重，将从转移的资产中扣除

??? function "**transferMultiassets**(assets, feeItem, destination, weight) — 转移多种同质化资产，根据其multilocation定义，并使用其中一个资产支付费用，这也可根据其multilocation定义"

    === "参数"
    
        - `assets` - 要转移的每个资产multilocation的数组。Multilocation必须以特定方式组成，这在[构建预编译Multilocation](#building-the-precompile-multilocation)部分教程中进行了描述
        - `feeItem` — 一个定义资产位置于发送资产数组的索引，用于支付目标链中XCM的执行费用。例如，如果仅发送一项资产，则`feeItem`将为`0`
        - `destination` - 通过XCM发送的Token目标地址的multilocation。它支持不同的地址格式，例如20或32字节地址（以太坊或Substrate格式）。Multilocation必须以特定方式组成，这在[构建预编译Multilocation](#building-the-precompile-multilocation)
        - `weight` - 为支付目标链上XCM执行而购买的权重，将从转移的资产中扣除

## 构建 Precompile Multilocation {: #building-the-precompile-multilocation }

[Multilocations](/builders/interoperability/xcm/core-concepts/multilocations){target=_blank}定义了一个特定点在整个中继链/平行链生态系统中相对于给定源的位置。X-Tokens预编译经常使用它们来定义资产以及目标链和账户的位置。

Multilocation需要以预编译可以理解的特定方式进行格式化，这不同于与Pallet交互时看到的格式。在X-Tokens Precompile接口中，`Multilocation`结构定义如下：

--8<-- 'text/builders/interoperability/xcm/xcm-precompile-multilocation.md'

以下代码片段介绍了Multilocation结构的一些示例，它们需要被输入资X-Tokens Precompile函数中：

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/multilocations.js'
```

## 构建一个XCM消息 {: #build-xcm-xtokens-precompile }

本教程介绍了使用X-Tokens Precompile构建XCM消息的过程，更详细来说为使用`transfer`和`transferMultiasset`函数。然而，这两种情况仍然可以外推至其他函数，特别是当您熟悉了multilocation的使用之后。

本教程将以转移xcUNIT Token为例。xcUNIT是Alphanet中继链Token的[XC-20](/builders/interoperability/xcm/xc20/overview){target=_blank}形式。本教程也同样适用于其他XC-20 Token。

### 查看先决条件 {: #xtokens-check-prerequisites}

要跟随本教程操作，您需要准备以下内容：

- X-Tokens Precompile的ABI

    ??? code "X-Tokens Precompile ABI"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/abi.js'
        ```

- 一个拥有资金的账户。
 --8<-- 'text/_common/faucet/faucet-list-item.md'
- 一些xcUNIT Token。您可以在[Moonbeam-Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}上将DEV Token（Moonbase Alpha的原生Token）兑换成xcUNIT。Moonbeam-Swap是Moonbase Alpha上的Uniswap-V2版本的示范协议

    !!! 注意事项
        本教程也同样适用于传输其他的[外部XC-20或本地XC-20](/builders/interoperability/xcm/xc20/overview){target=_blank}。对于外部XC-20，您将需要资产ID和资产的小数位数。对于本地XC-20，您将需要合约地址。

    ![Moonbeam Swap xcUNIT](/images/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/xtokens-1.png)

    要查看您的xcUNIT余额，您可以使用以下地址将XC-20的[预编译地址](/builders/interoperability/xcm/xc20/interact/#calculate-xc20-address){target=_blank}添加至MetaMask：

    ```text
    0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
    ```

!!! 注意事项
    要在Moonbeam或Moonriver上测试示例，您可以将RPC URL替换为您自己的端点和API密钥，您可以从支持的[端点提供商](/builders/get-started/endpoints/){target=_blank}获取。

### 确定XCM执行所需的权重 {: #determining-weight }

要确定目标链上XCM执行所需的权重，您需要知道目标链上执行了哪些XCM指令。您可以在[通过X-Token进行转账的XCM指令](/builders/interoperability/xcm/xc20/send-xc20s/overview/#xcm-instructions-for-asset-transfers){target=_blank}教程中找到关于XCM指令的介绍。

在本示例中，您要将xcUNIT从Moonbase Alpha转移到Alphanet中继链，在Alphanet上执行的指令为：

|                             指令                             |                             权重                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [`WithdrawAsset`](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L54-L62){target=_blank} | {{ networks.alphanet.xcm_instructions.withdraw.total_weight }} |
| [`ClearOrigin`](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L134-L140){target=_blank} | {{ networks.alphanet.xcm_instructions.clear_origin.total_weight }} |
| [`BuyExecution`](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L75-L81){target=_blank} | {{ networks.alphanet.xcm_instructions.buy_exec.total_weight }} |
| [`DepositAsset`](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L132-L140){target=_blank} | {{ networks.alphanet.xcm_instructions.deposit_asset.total_weight }} |
|                          **TOTAL**                           | **{{ networks.alphanet.xcm_message.transfer.weight.display }}** |

!!! 注意事项
    一些权重包括数据库读写。举例来说，`WithdrawAsset`和`DepositAsset`指令同时包含一次数据库读取和一次写入。要获得总权重，您需要将任何所需的数据库读写的权重添加到给定指令的基础权重中。

    对于基于Westend的中继链，例如Alphanet，您可以在GitHub的[polkadot-sdk](https://github.com/paritytech/polkadot-sdk){target=_blank}库中获取[Rocks DB](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/constants/src/weights/rocksdb_weights.rs#L27-L31){target=_blank}（默认数据库）数据库读写操作的权重成本。

由于Alphanet是基于Westend的中继链，因此您可以参考[Westend runtime代码](https://github.com/paritytech/polkadot-sdk/tree/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend){target=_blank}中定义的指令权重，这些指令权重分为两种类型的指令：[同质化指令](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs){target=_blank}和[通用指令](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_generic.rs){target=_blank}。

请注意每条链条都定义了自身的权重要求。要确定给定链上每条XCM指令所需的权重，请参考每条链的文档网站或联系团队成员。要了解如何查找Moonbeam、Polkadot或Kusama所需的权重，您可以参考我们的文档网站关于[权重和费用](/builders/interoperability/xcm/core-concepts/weights-fees){target=_blank}部分。

### X-TokensPrecompile转移函数 {: #precompile-transfer }

要使用X-Tokens Precompile的`transfer`功能，您将执行以下步骤：

1. 使用Moonbase Alpha RPC端点创建一个提供者
2. 创建一个签署人来发送交易。此示例中使用私钥创建签署人，仅用于演示目的。**切勿将私钥存储在 JavaScript文件中**
3. 使用预编译的地址和ABI创建X-Tokens Precompile的合约实例
4. 组装`transfer`函数的参数：

    - `currencyAddress` - xcUNIT地址： `0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080`
    - `amount` - 1个xcUNIT。由于xcUNIT有12位数，您可以使用：`1000000000000`
    - `destination` - 目标Multilocation，其目标是中继链上Alice的账户：`'0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300'`
    - `weight` - 为目标链上的XCM执行购买的[权重](#determining-weight)：`{{ networks.alphanet.xcm_message.transfer.weight.display }}`

5. 创建`transfer`函数，传入参数
6. 签署并发送交易

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer/web3.py'
    ```

### X-Tokens Precompile转移Multiasset函数 {: #precompile-transfer-multiasset}

要使用X-Tokens Precompile的`transfer`功能，您将执行以下步骤：

1. 使用Moonbase Alpha RPC端点创建一个provider
2. 创建一个签署人来发送交易。此示例中使用私钥创建签署人，仅用于演示目的。**切勿将私钥存储在JavaScript文件中**
3. 使用预编译的地址和ABI创建X-Tokens Precompile的合约实例
4. 组装`transferMultiasset`函数的参数：

    - `asset` - xcUNIT的Multilocation：`[1, []]`
    - `amount` - 1个xcUNIT。由于xcUNIT有12位数，您可以使用：`1000000000000`
    - `destination` - 目标Multilocation，其目标是中继链上Alice的账户：`'0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300'`
    - `weight` - 为目标链上的XCM执行购买的[权重](#determining-weight)：`{{ networks.alphanet.xcm_message.transfer.weight.numbers_only }}`

5. 创建`transferMultiasset`函数，传入参数
6. 签署并发送交易

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer-multiasset/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer-multiasset/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer-multiasset/web3.py'
    ```
