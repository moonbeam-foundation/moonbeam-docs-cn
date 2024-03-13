---
title: 发送XC-20资产至其他链
description: 本教程介绍了X-Tokens Pallet，并解释了如何使用Pallet的一些extrinsic将XC-20资产发送到另一个链。
---

# 使用X-Tokens Pallet发送XC-20资产

## 概览 {: #introduction }

构建用于同质化资产转移的XCM消息并非一件易事。因此，开发者可以通过利用wrapper函数和Pallet在Polkadot和Kusama上使用XCM功能。此类包装器的一个示例是[X-Tokens](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/master/xtokens){target=\_blank} Pallet，用于提供通过XCM转移同质化资产的不同方法。

本教程将向您展示如何利用X-Tokens Pallet将[XC-20资产](/builders/interoperability/xcm/xc20/overview/){target=\_blank}从基于Moonbeam的网络发送至生态系统中的其他链（中继链/平行链）。

**开发者须知若发送不正确的XCM消息可能会导致资金丢失。**因此，XCM功能需先在测试网上进行测试后才可移至生产环境。

## X-Tokens Pallet接口 {: #x-tokens-pallet-interface }

### Extrinsics {: #extrinsics }

X-Tokens Pallet提供以下extrinsics（函数）：

???+ function "**transfer**(currencyId, amount, dest, destWeightLimit) — 转移一个货币，定义为原生Token（自身储备）或是资产ID"

    === "参数"
    
        - `currencyId` - 将通过XCM转移的货币ID。不同runtime有不同的方法定义ID。以基于Moonbeam的网络为例，货币可以被定义为：
            - `SelfReserve` - 使用原生资产
            - `ForeignAsset` - 使用[外部XC-20](/builders/interoperability/xcm/xc20/overview#external-xc20s){target=\_blank}。这需要您指定XC-20的资产ID
             - `LocalAssetReserve` - *已弃用* - 通过`Erc20`货币类型使用[本地XC-20](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank}
            - `Erc20`以及[本地XC-20](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=\_blank}的合约地址
        - `amount` - 要通过XCM发送的Token数量
        - `dest` - 通过XCM发送Token目标地址的multilocation。它支持不同的地址格式，例如20或32字节地址（以太坊或Substrate格式）
        - `destWeightLimit` - 为支付目标链上XCM执行而购买的权重，将从转移的资产中扣除。权重限制可以定义为：
            - `Unlimited` - 允许无限量购买权重
            - `Limited` - 通过定义以下内容限制可以购买的权重数量：
                - `refTime` - 可用于执行的计算时间量
                - `proofSize` - 可以使用的存储量（以字节为单位）
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/transfer.js'
        ```

??? function "**transferMultiasset**(asset, dest, destWeightLimit) — 转移一个同质化资产，根据其multilocation定义"

    === "参数"
    
        - `asset` - 通过XCM发送的资产multilocation。每个平行链都有不同的对应资产的方式。例如，基于Moonbeam的网络通过Balances Pallet索引引用其原生Token
        - `dest` - 通过XCM发送Token目标地址的multilocation。它支持不同的地址格式，例如20或32字节地址（以太坊或Substrate格式）
        - `destWeightLimit` - 为支付目标链上XCM执行而购买的权重，将从转移的资产中扣除。权重限制可以定义为：
            - `Unlimited` - 允许无限量购买权重
            - `Limited` - 通过定义以下内容限制可以购买的权重数量：
                - `refTime` - 可用于执行的计算时间量
                - `proofSize` - 可以使用的存储量（以字节为单位）
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/transfer-multiasset.js'
        ```

??? function "**transferMultiassetWithFee**(asset, fee, dest, destWeightLimit) — 转移一个同质化资产，根据其multilocation定义，并用不同的资产支付费用，这也可根据其multilocation定义"

    === "参数"
    
        - `asset` - 通过XCM发送的资产multilocation。每个平行链都有不同的引用资产的方式。例如，基于Moonbeam的网络通过Balances Pallet索引引用其原生Token
        - `fee` — 用于支付目标链中XCM执行费用的资产multilocation
        - `dest` - 通过XCM发送Token目标地址的multilocation。它支持不同的地址格式，例如20或32字节地址（以太坊或Substrate格式）
        - `destWeightLimit` - 为支付目标链上XCM执行而购买的权重，将从转移的资产中扣除。权重限制可以定义为：
            - `Unlimited` - 允许无限量购买权重
            - `Limited` - 通过定义以下内容限制可以购买的权重数量：
                - `refTime` - 可用于执行的计算时间量
                - `proofSize` - 可以使用的存储量（以字节为单位）
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/transfer-multiasset-with-fee.js'
        ```

??? function "**transferMultiassets**(assets, feeItem, dest, destWeightLimit) — 转移多种同质化资产，根据其multilocation定义，并使用其中一个资产支付费用，也以multilocation定义"

    === "参数"
    
        - `asset` - 通过XCM发送的资产multilocation。每个平行链都有不同的引用资产的方式。例如，基于Moonbeam的网络通过Balances Pallet索引引用其原生Token
        - `feeItem` — 一个索引，定义正在发送资产数组的资产位置，用于支付目标链中XCM的执行费用。例如，如果仅发送一项资产，则`feeItem`将为`0`
        - `dest` - 通过XCM发送的Token目标地址的multilocation。它支持不同的地址格式，例如20或32字节地址（以太坊或Substrate格式）
        - `destWeightLimit` - 为支付目标链上XCM执行而购买的权重，将从转移的资产中扣除。权重限制可以定义为：
            - `Unlimited` - 允许无限量购买权重
            - `Limited` - 通过定义以下内容限制可以购买的权重数量：
                - `refTime` - 可用于执行的计算时间量
                - `proofSize` - 可以使用的存储量（以字节为单位）
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/transfer-multiassets.js'
        ```

??? function "**transferMulticurrencies**(currencies, feeItem, dest, destWeightLimit) — 转移不同的货币，指定哪种货币将用于支付费用。所有货币都以原生Token（自身储备）或是资产ID定义"

    === "参数"
    
        - `currencies` - 将通过XCM转移的货币ID。不同runtime有不同的方法定义ID。以基于Moonbeam的网络为例，货币可以被定义为：
            - `SelfReserve` - 使用原生资产
            - `ForeignAsset` - 使用[外部XC-20](/builders/interoperability/xcm/xc20/overview#external-xc20s){target=\_blank}。这需要您指定XC-20的资产ID
             - `LocalAssetReserve` - *已弃用* - 通过`Erc20`货币类型使用[本地XC-20](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank}
            - `Erc20`以及[本地XC-20](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=\_blank}的合约地址
        - `feeItem` — 一个索引，定义正在发送资产数组的资产位置，用于支付目标链中XCM的执行费用。例如，如果仅发送一项资产，则`feeItem`将为`0`
        - `dest` - 通过XCM发送的Token目标地址的multilocation。它支持不同的地址格式，例如20或32字节地址（以太坊或Substrate格式）
        - `destWeightLimit` - 为支付目标链上XCM执行而购买的权重，将从转移的资产中扣除。权重限制可以定义为：
            - `Unlimited` - 允许无限量购买权重
            - `Limited` - 通过定义以下内容限制可以购买的权重数量：
                - `refTime` - 可用于执行的计算时间量
                - `proofSize` - 可以使用的存储量（以字节为单位）
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/transfer-multicurrencies.js'
        ```

??? function "**transferWithFee**(currencyId, amount, fee, dest, destWeightLimit) — 转移一个货币，以原生Token（自身储备）或是资产ID定义，并分别指定费用和金额"

    === "参数"
    
        - `currencyId` - 将通过XCM转移的货币ID。不同runtime有不同的方法定义ID。以基于Moonbeam的网络为例，货币可以被定义为：
            - `SelfReserve` - 使用原生资产
            - `ForeignAsset` - 使用[外部XC-20](/builders/interoperability/xcm/xc20/overview#external-xc20s){target=\_blank}。这需要您指定XC-20的资产ID
             - `LocalAssetReserve` - *已弃用* - 通过`Erc20`货币类型使用[本地XC-20](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank}
            - `Erc20`以及[本地XC-20](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=\_blank}的合约地址
        - `amount` - 需要通过XCM发送的Token数量
        - `fee` — 支付目标链中XCM执行所需的金额。如果这个值低于执行成本，资产将被锁在目标链中
        - `dest` - 通过XCM发送的Token目标地址的multilocation。它支持不同的地址格式，例如20或32字节地址（以太坊或Substrate格式）
        - `destWeightLimit` - 为支付目标链上XCM执行而购买的权重，将从转移的资产中扣除。权重限制可以定义为：
            - `Unlimited` - 允许无限量购买权重
            - `Limited` - 通过定义以下内容限制可以购买的权重数量：
                - `refTime` - 可用于执行的计算时间量
                - `proofSize` - 可以使用的存储量（以字节为单位）
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/transfer-with-fee.js'
        ```

### 存储函数 {: #storage-methods }

XCM Transactor Pallet包含以下只读存储函数：

???+ function "**palletVersion**() — 从存储中返回当前的pallet版本"

    === "参数"
    
        无
    
    === "返回"
    
        代表pallet当前版本的数字。
    
        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        0
        ```
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/pallet-version.js'
        ```

### Pallet常量 {: #constants }

XCM Transactor Pallet包含以下只读函数以获取pallet常量：

???+ function "**baseXcmWeight**() - 返回每个XCM指令执行所需的基础XCM权重"

    === "返回"
    
        基础XCM权重对象
    
        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        { refTime: 200000000, proofSize: 0 }
        ```
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/base-xcm-weight.js'
        ```

??? function "**selfLocation**() - 返回链的multilocation"

    === "返回"
    
        自定位multilocation对象
    
        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        { parents: 0, interior: { here: null } }
        ```
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/self-location.js'
        ```

## 使用X-Tokens Pallet构建XCM消息 {: #build-xcm-xtokens-pallet}

此教程将会包含使用X-Tokens Pallet构建XCM消息的过程，更详细来说为使用`transfer`和`transferMultiasset`函数。然而，这两种情况仍然可以外推至其他函数，特别是当您熟悉了multilocation的使用之后。

!!! 注意事项
    每条平行链皆能够通过pallet允许/禁止特定函数。因此，开发者需要确认使用的函数是被平行链允许的。相反来说，如果使用了被禁止的函数，交易将会如同`system.CallFiltered`显示一般失败。

本教程将以转移xcUNIT Token为例。xcUNIT是Alphanet中继链Token的[XC-20](/builders/interoperability/xcm/xc20/overview){target=\_blank}形式。本教程也同样适用于其他XC-20 Token。

### 查看先决条件 {: #xtokens-check-prerequisites}

要跟随本教程操作，您需要准备以下内容：

- 一个拥有资金的账户
 --8<-- 'text/_common/faucet/faucet-list-item.md'
- 一些xcUNIT Token。您可以在[Moonbeam-Swap](https://moonbeam-swap.netlify.app/#/swap){target=\_blank}上将DEV Token（Moonbase Alpha的原生Token）兑换成xcUNIT。Moonbeam-Swap是Moonbase Alpha上的Uniswap-V2版本的示范协议

    !!! 注意事项
        本教程也同样适用于其他的[外部XC-20或本地XC-20](/builders/interoperability/xcm/xc20/overview){target=\_blank}。对于外部XC-20，您将需要资产ID和拥有资产的小数位数。对于本地XC-20，您将需要合约地址

    ![Moonbeam Swap xcUNIT](/images/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/xtokens-1.webp)

要查看您的xcUNIT余额，您可以使用以下地址将其XC-20的[预编译地址](/builders/interoperability/xcm/xc20/overview/#calculate-xc20-address){target=\_blank}添加至MetaMask：

```text
0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
```

### 确定XCM执行所需的权重 {: #determining-weight }

要确定目标链上XCM执行所需的权重，您需要知道目标链上执行了哪些XCM指令。您可以在[通过X-Token进行转账的XCM指令](/builders/interoperability/xcm/xc20/send-xc20s/overview/#xcm-instructions-for-asset-transfers){target=\_blank}教程中找到关于XCM指令的介绍。

在本示例中，您要将xcUNIT从Moonbase Alpha转移到Alphanet中继链，在Alphanet上执行的指令为：

|                                                                                                         指令                                                                                                         |                                权重                                 |
|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------:|
| [`WithdrawAsset`](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L54-L62){target=\_blank}  |   {{ networks.alphanet.xcm_instructions.withdraw.total_weight }}    |
|  [`ClearOrigin`](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L134-L140){target=\_blank}  | {{ networks.alphanet.xcm_instructions.clear_origin.total_weight }}  |
|  [`BuyExecution`](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L75-L81){target=\_blank}   |   {{ networks.alphanet.xcm_instructions.buy_exec.total_weight }}    |
| [`DepositAsset`](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L132-L140){target=\_blank} | {{ networks.alphanet.xcm_instructions.deposit_asset.total_weight }} |
|                                                                                                       **总计**                                                                                                       |   **{{ networks.alphanet.xcm_message.transfer.weight.display }}**   |

!!! 注意事项
    一些权重包括数据库读写。举例来说，`WithdrawAsset`和`DepositAsset`指令同时包含一次数据库读取和一次写入。要获得总权重，您需要将任何所需的数据库读写的权重添加到给定指令的基础权重中。

    对于基于Westend的中继链，例如Alphanet，您可以在GitHub的[polkadot-sdk](https://github.com/paritytech/polkadot-sdk){target=\_blank}库中获取[Rocks DB](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/constants/src/weights/rocksdb_weights.rs#L27-L31){target=\_blank}（默认数据库）数据库读写操作的权重成本。

由于Alphanet是基于Westend的中继链，因此您可以参考[Westend runtime代码](https://github.com/paritytech/polkadot-sdk/tree/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend){target=\_blank}中定义的指令权重，这些指令权重分为两种类型的指令：[同质化指令](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs){target=\_blank}和[通用指令](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_generic.rs){target=\_blank}。

请注意每条链条都定义了权重要求。要确定给定链上每条XCM指令所需的权重，请参考每条链的文档网站或联系团队成员。要了解如何查找Moonbeam、Polkadot或Kusama所需的权重，您可以参考我们的文档网站关于[权重和费用](/builders/interoperability/xcm/core-concepts/weights-fees){target=\_blank}部分。

### X-Tokens转移函数 {: #xtokens-transfer-function}

在本示例中，您将会构建一个XCM消息，通过X-Tokens Pallet的`transfer`函数将xcUNIT从Moonbase Alpha转移回Alphanet中继链上。为此，您需要使用[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api){target=\_blank}。

由于您将使用`transfer`函数进行交互，您可以执行以下步骤来获取`currencyId`、`amount`、`dest`和`destWeightLimit`的参数：

1. 定义`currencyId`。对于外部XC-20，您将使用`ForeignAsset`货币类型和资产ID，在本示例中为`42259045809535163221576417993425387648`。对于本地XC-20，您将需要Token地址。在JavaScript中，将翻译为：

    === "外部XC-20"

        ```js
        const currencyId = {
          ForeignAsset: {
            ForeignAsset: 42259045809535163221576417993425387648n
          }
        };
        ```

    === "本地XC-20"

        ```js
    const currencyId = { Erc20: { contractAddress: 'INSERT_ERC_20_ADDRESS' } };
        ```

2. 指定要转移的`amount`。在本示例中，您将发送1个xcUNIT，即有12位小数位：

    ```js
    const amount = 1000000000000n;
    ```

3. 定义目标multilocation，这将定位来自Moonbase Alpha的中继链上的账户。请注意，中继链可以接收的唯一资产是它自己的：

    ```js
    const dest = { 
      V3: { 
        parents: 1, 
        interior: { X1: { AccountId32: { id: relayAccount } } } 
      } 
    };
    ```

    !!! 注意事项
        对于`AccountId32`、`AccountIndex64`或`AccountKey20`，您可以选择指定`network`参数。如果不指定，则默认为`None`。

4. 设置`destWeightLimit`。由于执行XCM消息所需的权重取决于链的不同而有所不同，因此您可以将权重限制设置为`Unlimited`，或者如果您对所需的权重有个预估值，则可以使用`Limited`，但请注意，如果设置低于要求，执行可能会失败

    === "Unlimited"

        ```js
        const destWeightLimit = { Unlimited: null };
        ```

    === "Limited"

        ```js
        const destWeightLimit = {
          Limited: {
            refTime: 'INSERT_ALLOWED_AMOUNT',
            proofSize: 'INSERT_ALLOWED_AMOUNT',
          },
        };
        ```
        
        正如[确定XCM执行所需的权重](#determining-weight)部分中所述，在Alphanet上执行XCM需要{{ networks.alphanet.xcm_message.transfer.weight.display }}权重。您可以将`refTime`设置为`{{ networks.alphanet.xcm_instructions.deposit_asset.total_weight.numbers_only }}`。`proofSize`可以设置为`0`，因为Alphanet中继链当前不考虑`proofSize`。

现在您已经有了每个参数的值，您可以编写转移脚本了。为此，您将执行以下步骤：

 1. 提供调用的输入数据，这包含：
     - 用于创建提供商的Moonbase Alpha端点URL
     - `transfer`函数的每个参数值
 2. 创建Keyring实例，这将用于发送交易
 3. 创建[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank}提供商
 4. 使用`asset`、`dest`和`destWeightLimit`创建`xTokens.transfer` extrinsic
 5. 使用`signAndSend` extrinsic和第二步创建的Keyring实例发送交易

!!! 请注意
    本教程仅用于演示目的，请勿将您的私钥存储在JavaScript文件中。

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/transfer.js'
```

!!! 注意事项
    您可以使用以下编码的调用数据在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1e00018080778c30c20fa2ebc0ed18d2cbca1f0010a5d4e800000000000000000000000301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300){target=\_blank}上查看上述脚本的示例，该脚本将1个xcUNIT发送到中继链上Alice的账户：`0x1e00018080778c30c20fa2ebc0ed18d2cbca1f0010a5d4e800000000000000000000000301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300`。

交易被处理后，中继链上的目标账户应该收到转账金额减去在目标链上执行XCM时扣除的一小笔费用。

### X-Tokens转移Multiasset函数 {: #xtokens-transfer-multiasset-function}

在本示例中，您将会构建一个XCM消息，通过X-Tokens Pallet的`transferMultiasset`函数将xcUNIT从Moonbase Alpha转移回Alphanet中继链上。

由于您将使用X-Tokens Pallet的`transferMultiasset`函数进行交互，您可以执行以下步骤来获取`asset`、`dest`和`destWeightLimit`的参数：

1. 定义`asset`的XCM资产multilocation，这将以Moonbase Alpha为起点的中继链中的UNIT Token为目标。每个链对自己的资产都有不同的看法。因此，您必须为每个目的地设置不同的资产multilocation

    === "外部XC-20"

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

    === "本地XC-20"

        ```js
        // Multilocation for a local XC-20 on Moonbeam
        const asset = {
          V3: {
            id: {
              Concrete: {
                parents: 0,
                interior: {
                  X2: [
                    { PalletInstance: 48 },
                    { AccountKey20: { key: 'INSERT_ERC_20_ADDRESS' } },
                  ],
                },
              },
            },
            fun: {
              Fungible: { Fungible: 1000000000000000000n }, // 1 token
            },
          },
        };
        ```
        
        有关本地XC-20传输的默认Gas限制以及如何重写默认值的信息，请参阅以下部分：[重写本地XC-20 Gas限制](#override-local-xc20-gas-limits)。

2. 定义`dest`的XCM目标multilocation，这将以Moonbase Alpha中继链中的一个账户为起点：

    ```js
    const dest = {
      V3: {
        parents: 1,
        interior: { X1: { AccountId32: { id: relayAccount } } },
      },
    };
    ```

    !!! 注意事项
        对于`AccountId32`、`AccountIndex64`或`AccountKey20`，您可以选择指定`network`参数。如果不指定，则默认为`None`。

3. 设置`destWeightLimit`。由于执行XCM消息所需的权重取决于链的不同而有所不同，因此您可以将权重限制设置为`Unlimited`，或者如果您对所需的权重有个预估值，则可以使用`Limited`，但请注意，如果设置低于要求，执行可能会失败

    === "Unlimited"

        ```js
        const destWeightLimit = { Unlimited: null };
        ```

    === "Limited"

        ```js
        const destWeightLimit = {
          Limited: {
            refTime: 'INSERT_ALLOWED_AMOUNT',
            proofSize: 'INSERT_ALLOWED_AMOUNT',
          },
        };
        ```
        
        正如[确定XCM执行所需的权重](#determining-weight)部分中所述，在Alphanet上执行XCM需要{{ networks.alphanet.xcm_message.transfer.weight.display }}权重。您可以将`refTime`设置为`{{ networks.alphanet.xcm_instructions.deposit_asset.total_weight.numbers_only }}`。`proofSize`可以设置为`0`，因为Alphanet中继链当前不考虑`proofSize`。

现在您已经有了每个参数的值，您可以编写转移脚本了。为此，您将执行以下步骤：

 1. 提供调用的输入数据，这包含：
     - 用于创建提供商的Moonbase Alpha端点URL
     - `transferMultiasset`函数的每个参数值
 2. 创建Keyring实例，这将用于发送交易
 3. 创建[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank}提供商
 4. 使用`asset`、`dest`和`destWeightLimit`创建`xTokens.transferMultiasset` extrinsic
 5. 使用`signAndSend` extrinsic和第二步创建的Keyring实例发送交易

!!! 请注意
    本教程仅用于演示目的，请勿将您的私钥存储在JavaScript文件中。

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/transfer-multiasset.js'
```

!!! 注意事项
    您可以使用以下编码的调用数据在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1e010300010000070010a5d4e80301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300){target=\_blank}上查看上述脚本的示例，该脚本将1个xcUNIT发送到中继链上Alice的账户：`0x1e010300010000070010a5d4e80301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300`。

交易被处理后，中继链上的目标账户应该收到转账金额减去在目标链上执行XCM时扣除的一小笔费用。

#### 重写本地XC-20 Gas限制 {: #override-local-xc20-gas-limits }

如果您要转移本地XC-20，则每个网络的默认Gas单位如下所示：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.erc20_xcm.transfer_gas_limit }}
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.erc20_xcm.transfer_gas_limit }}
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.erc20_xcm.transfer_gas_limit }}
    ```

当您为本地XC-20创建multilocation时，您可以使用附加junction重写默认的gas限制。为此，您需要使用`GeneralKey` junction，其接受两个参数：`data`和`length`。

举例来说，要将gas限制设置为`300000`，您需要将`length`设置为`32`，对于`data`，您需要传入`gas_limit: 300000`。但是，您不能简单地以文本形式传入`data`的值； 您需要将其正确格式化为32字节的十六进制字符串，其中Gas限制的值采用小端格式。要正确格式化`data`，您可以执行以下步骤：

1. 将`gas_limit:``gas_limit:`转换为字节表示形式
2. 将Gas限制的值转换为小端格式的表示形式
3. 将两个字节表示形式连接成一个填充为32字节的值
4. 将字节转换为十六进制字符串

使用`@polkadot/util`库，步骤具体如下所示：

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/override-gas-limit.js'
```

以下是Gas限制设置为`300000`的multilocation示例：

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/override-gas-limit-multilocation.js'
```
