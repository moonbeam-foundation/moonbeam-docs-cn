---
title: XCM Transactor Pallet
description: 本教程将介绍XCM-Transactor Pallet，并解释如何使用一些pallet的extrinsics发送远程调用至其他链。
---

# 使用XCM Transactor Pallet进行远程执行

## 概览 {: #introduction }

XCM消息是由跨共识虚拟机（XCVM）执行的[一系列指令](/builders/interoperability/xcm/core-concepts/instructions/){target=_blank}组成。这些指令的组合会产生预先确定的操作，例如跨链Token转移，更有趣的是，远程跨链执行。远程执行涉及从另一个区块链在一个区块链上执行操作或操作，同时保持发送者身份和权限的完整性。

通常，XCM消息从根账户（即SUDO或通过民主投票）发送给生态系统中的其他参与者，这对于希望通过简单交易实现远程跨链调用的项目来说并不合适。[XCM Transactor Pallet](https://github.com/moonbeam-foundation/moonbeam/blob/master/pallets/xcm-transactor/src/lib.rs){target=_blank}可以轻松通过[主权账户](/builders/interoperability/xcm/overview#general-xcm-definitions){target=_blank}（仅可通过治理允许操作）或通过来自源链简单交易的[Computed Origin账户](/builders/interoperability/xcm/remote-execution/computed-origins){target=_blank}在远程链上进行交易。

本教程将向您展示如何使用XCM Transactor Pallet从基于Moonbeam的网络发送XCM消息至生态系统中的其他链。此外，您还将学习到如何使用XCM Transactor Precompile通过以太坊API执行同样的操作。

**请注意，通过XCM消息进行远程执行仍然有一些限制。**

**开发者须知悉，若发送不正确的XCM消息可能会导致资金丢失。**因此，XCM功能需先在测试网上进行测试后才可移至生产环境。

## XCM Transactor Pallet接口 {: #xcm-transactor-pallet-interface}

### Extrinsics {: #extrinsics }

XCM Transactor Pallet提供以下extrinsics（函数）：

???+ function "**hrmpManage**(action, fee, weightInfo) - 管理打开、接受或关闭HRMP通道相关的HRMP操作"

    在Moonbeam或Moonriver上，此函数必须由General Admin或Root Track通过治理执行。在Moonbase Alpha或Moonbeam开发节点上，此函数也可通过sudo执行。
    
    === "参数"
    
        - `action` - 需要执行的操作。可以为 `InitOpen`、`Accept`、`Close`或`Cancel`
        - `fee` - 用于支付费用的资产。这包含`currency`和`feeAmount`：
            - `currency` -  定义您如何指定用于支付费用的Token，可以为：
                - `AsCurrencyId` - 用于支付费用的资产货币ID。货币ID可以为：
                    - `SelfReserve` - 使用原生资产
                    - `ForeignAsset` - 使用[外部XC-20](/builders/interoperability/xcm/xc20/overview#external-xc20s){target=_blank}。这需要您指定XC-20的资产ID
                     - `LocalAssetReserve` - *已弃用* - 通过`Erc20`货币类型使用[本地XC-20](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}
                    - `Erc20` - 使用[本地XC-20](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=_blank}。这要求您指定本地XC-20的合约地址
                - `AsMultiLocation` - 用于支付费用资产的XCM版本化的multilocation
            - `feeAmount` - （可选）用于支付费用的数量
        - `weightInfo` - 要使用的权重信息。`weightInfo`结构包含以下内容：
            - `transactRequiredWeightAtMost` — 执行`Transact`调用所需的权重。`transactRequiredWeightAtMost`结构包含以下内容：
                - `refTime` - 可用于执行的计算时间量
                - `proofSize` - 可以使用的存储量（以字节为单位）
            - `overallWeight` — （可选）extrinsic可用于执行所有XCM指令的总权重，加上`Transact`调用（`transactRequiredWeightAtMost`）的权重。`overallWeight`可以定义为：
                - `Unlimited` - 允许无限量购买权重
                - `Limited` - 通过定义以下内容限制可以购买的权重数量：
                    - `refTime` - 可用于执行的计算时间量
                    - `proofSize` - 可以使用的存储量（以字节为单位）
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/hrmp-manage.js'
        ```

??? function "**removeFeePerSecond**(assetLocation) — 删除储备链中给定资产的每秒费用信息"

    在Moonbeam或Moonriver上，此函数必须由General Admin或Root Track通过治理执行。在Moonbase Alpha或Moonbeam开发节点上，此函数也可通过sudo执行。
    
    === "参数"
    
        - `assetLocation` - XCM版本化的资产multilocation，以删除每秒费用信息
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/remove-fee-per-second.js'
        ```

??? function "**removeTransactInfo**(location) — 删除给定链的交易信息"

    在Moonbeam或Moonriver上，此函数必须由General Admin或Root Track通过治理执行。在Moonbase Alpha或Moonbeam开发节点上，此函数也可通过sudo执行。
    
    === "参数"
    
        - `location` - 您希望删除交易信息的给定链的XCM版本化的multilocation
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/remove-transact-info.js'
        ```

??? function "**setFeePerSecond**(assetLocation, feePerSecond) — 设置储备链上给定资产的每秒费用。每秒费用信息通常与执行XCM指令的成本相关"

    在Moonbeam或Moonriver上，此函数必须由General Admin或Root Track通过治理执行。在Moonbase Alpha或Moonbeam开发节点上，此函数也可通过sudo执行。
    
    === "参数"
    
        - `assetLocation` - XCM版本化的资产multilocation，以删除每秒费用信息
        - `feePerSecond` - 执行XCM指令时，每秒向extrinsic发送者收取的XCM执行Token单位数
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/set-fee-per-second.js'
        ```

??? function "**setTransactInfo**(location, transactExtraWeight, maxWeight) — 设置给定链的交易信息。交易信息通常包括执行XCM指令所需的权重以及目标链上远程XCM执行所允许的最大权重的详细信息"

    在Moonbeam或Moonriver上，此函数必须由General Admin或Root Track通过治理执行。在Moonbase Alpha或Moonbeam开发节点上，此函数也可通过sudo执行。
    
    === "参数"
    
        - `location` - 您希望设置交易信息的给定链的XCM版本化的multilocation
        - `transactExtraWeight` — 支付XCM指令（`WithdrawAsset`、`BuyExecution`和`Transact`）执行费用的权重，预估比远程XCM执行费用至少高10%。`transactExtraWeight`结构包含以下：
            - `refTime` - 可用于执行的计算时间量
            - `proofSize` - 可以使用的存储量（以字节为单位）
        - `maxWeight` — 远程XCM执行所允许的最大权重。`maxWeight`结构也包含`refTime`和`proofSize`
        - `transactExtraWeightSigned` — （可选）支付XCM指令（`DescendOrigin`、`WithdrawAsset`、`BuyExecution`和`Transact`）执行费用的权重，预估比远程XCM执行费用至少高10%。`transactExtraWeightSigned`结构也包含`refTime`和`proofSize`
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/set-transact-info.js'
        ```

??? function "**transactThroughSigned**(destination, fee, call, weightInfo, refund) — 发送包含在目标链中远程执行调用指令的XCM消息。远程调用可通过目标平行链必须计算的新账户签署和执行。基于Moonbeam的网络遵循[波卡制定的Computed Origins标准](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=_blank}"

    === "参数"
    
        - `dest` - XCM消息发送至生态系统中链的XCM版本化multilocation（目标链）
        - `fee` - 用于支付费用的资产。这包含`currency`和`feeAmount`：
            - `currency` -  定义您如何指定用于支付费用的Token，可以为以下任意一个：
                - `AsCurrencyId` - 用于支付费用的资产货币ID。货币ID可以为：
                    - `SelfReserve` - 使用原生资产
                    - `ForeignAsset` - 使用[外部XC-20](/builders/interoperability/xcm/xc20/overview#external-xc20s){target=_blank}。这需要您指定XC-20的资产ID
                     - `LocalAssetReserve` - *已弃用* - 通过`Erc20`货币类型使用[本地XC-20](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}
                    - `Erc20` - 使用[本地XC-20](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=_blank}。这要求您指定本地XC-20的合约地址
                - `AsMultiLocation` - 用于支付费用资产的XCM版本化的multilocation
            - `feeAmount` -（可选）用于支付费用的数量
        - `call` - 将在目标链中执行调用的编码调用数据
        - `weightInfo` - 要使用的权重信息。`weightInfo`结构包含以下内容：
            - `transactRequiredWeightAtMost` — 执行`Transact`调用所需的权重。`transactRequiredWeightAtMost`结构包含以下内容：
                - `refTime` - 可用于执行的计算时间量
                - `proofSize` - 可以使用的存储量（以字节为单位）
            - `overallWeight` —（可选）extrinsic可用于执行所有XCM指令的总权重，加上`Transact`调用（`transactRequiredWeightAtMost`）的权重。`overallWeight`可以定义为：
                - `Unlimited` - 允许无限量购买权重
                - `Limited` - 通过定义以下内容限制可以购买的权重数量：
                    - `refTime` - 可用于执行的计算时间量
                    - `proofSize` - 可以使用的存储量（以字节为单位）
        - `refund` - 一个布尔值，指示是否将`RefundSurplus`和`DepositAsset`指令添加到XCM消息中以退还任何剩余费用
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/transact-through-signed.js'
        ```
    
    !!! 注意事项
        在以下部分中，您将准确了解如何使用此extrinsic检索构建和发送XCM消息所需的所有参数。

??? function "**transactThroughSovereign**(dest, feePayer, fee, call, originKind, weightInfo, refund) — 发送XCM消息，其中包含在给定目标链远程执行给定调用的指令。远程调用将由源平行链主权账户（该账户用于支付费用）签名，但交易是从给定源发送的。XCM Transactor Pallet计算远程执行的费用，并向给定账户收取相应[XC-20 token](/builders/interoperability/xcm/xc20/overview/){target=_blank}的估计金额"

    === "参数"
    
        - `dest` - 生态系统中链的XCM版本化multilocation，其中XCM消息将发送到（目标链）
        - `feePayer` - 将在相应的[XC-20 token](/builders/interoperability/xcm/xc20/overview/){target=_blank}中支付远程XCM执行费用的地址
        - `fee` - 用于支付费用的资产。这包含`currency`和`feeAmount`：
            - `currency` -  定义您如何指定用于支付费用的Token，可以为：
                - `AsCurrencyId` - 用于支付费用的资产货币ID。货币ID可以为：
                    - `SelfReserve` - 使用原生资产
                    - `ForeignAsset` - 使用[外部XC-20](/builders/interoperability/xcm/xc20/overview#external-xc20s){target=_blank}。这需要您指定XC-20的资产ID
                     - `LocalAssetReserve` - *已弃用* - 通过`Erc20`货币类型使用[本地XC-20](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}
                    - `Erc20` - 使用[本地XC-20](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=_blank}。这要求您指定本地XC-20的合约地址
                - `AsMultiLocation` - 用于支付费用资产的XCM版本化的multilocation
            - `feeAmount` -（可选）用于支付费用的数量
        - `call` - 将在目标链中执行调用的编码调用数据
        - `originKind` — 目标链中远程调用的调度程序。目前有[四种类型的调度程序](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/src/v2/mod.rs#L85){target=_blank}可用：`Native`、`SovereignAccount`、`Superuser`或`Xcm`
        - `weightInfo` - 要使用的权重信息。`weightInfo`结构包含以下内容：
            - `transactRequiredWeightAtMost` — 执行`Transact`调用所需的权重。`transactRequiredWeightAtMost`结构包含以下内容：
                - `refTime` - 可用于执行的计算时间量
                - `proofSize` - 可以使用的存储量（以字节为单位）
            - `overallWeight` —（可选）extrinsic可用于执行所有XCM指令的总权重，加上`Transact`调用（`transactRequiredWeightAtMost`）的权重。`overallWeight`可以定义为：
                - `Unlimited` - 允许无限量购买权重
                - `Limited` - 通过定义以下内容限制可以购买的权重数量：
                    - `refTime` - 可用于执行的计算时间量
                    - `proofSize` - 可以使用的存储量（以字节为单位）
        - `refund` - 一个布尔值，指示是否将`RefundSurplus`和`DepositAsset`指令添加到XCM消息中以退还任何剩余费用
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/transact-through-sovereign.js'
        ```

### 存储函数 {: #storage-methods }

XCM Transactor Pallet包含以下只读存储函数：

???+ function "**destinationAssetFeePerSecond**(location) - 返回给定资产的每秒费用"

    === "参数"
    
        - `location` -（可选）特定目标资产的XCM版本化的multilocation
    
    === "返回"
    
        代表给定资产每秒费用的值。该值可能会以不同的格式返回，具体取决于链及其存储数据的方式。您可以使用`@polkadot/util`库进行各种转换，例如，使用`hexToBigInt`方法将十六进制值转换为整数。
    
        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        10000000000000
        ```
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/destination-asset-fee-per-second.js'
        ```

??? function "**palletVersion**() — 从存储中返回当前的pallet版本"

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
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/pallet-version.js'
        ```

??? function "**transactInfoWithWeightLimit**(location) — 返回给定multilocation的交易信息"

    === "参数"
    
        - `location` -（可选）特定目标资产的XCM版本化的multilocation
    
    === "返回"
    
        交易信息对象
    
        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        {
          transactExtraWeight: { refTime: 3000000000, proofSize: 131072 },
          maxWeight: { refTime: 20000000000, proofSize: 131072 },
          transactExtraWeightSigned: { refTime: 4000000000, proofSize: 131072 },
        }
        ```
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/transact-info-with-weight-limit.js'
        ```

### Pallet常量 {: #constants }

XCM Transactor Pallet包含以下只读函数以获取pallet常量：

???+ function "**baseXcmWeight**() - 返回每个XCM指令执行所需的基本XCM权重"

    === "返回"
    
        基本XCM权重对象
    
        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        { refTime: 200000000, proofSize: 0 }
        ```
    
    === "Polkadot.js API示例"
    
        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/base-xcm-weight.js'
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
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/self-location.js'
        ```

## 用于远程执行的XCM指令 {: #xcm-instructions-for-remote-execution }

通过XCM进行远程执行的相关[XCM指令](/builders/interoperability/xcm/core-concepts/instructions/){target=_blank}，有但不限于：

 - [`DescendOrigin`](/builders/interoperability/xcm/core-concepts/instructions#descend-origin){target=_blank} - 在目标链中执行。改变目标链上的源以匹配源链上的源，确保目标链上的执行代表源链上发起XCM消息的同一实体进行
 - [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions#withdraw-asset){target=_blank} - 在目标链中执行。删除资产并将其放于存放处
 - [`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions#buy-execution){target=_blank} - 在目标链中执行。从持有资产中提取用于支付执行费用。支付的费用取决于目标链
 - [`Transact`](/builders/interoperability/xcm/core-concepts/instructions#transact){target=_blank} - 在目标链中执行。从给定原始链分配编码的调用数据，用于执行特定操作或函数

## 通过Computed Origin账户进行交易 {: #xcmtransactor-transact-through-signed }

此部分包含使用`transactThroughSigned`函数通过XCM Transactor Pallet为远程执行构建XCM消息。此函数使用目标链中的Computed Origin账户分配远程调用。

本示例中使用的目标平行链非可公开访问，因此您无法完全遵循本教程。您可以根据自己的用例需求修改本示例。

!!! 注意事项
    请确保您已在目标链中允许将要远程执行的调用！

### 查看先决条件 {: #xcmtransactor-signed-check-prerequisites }

要在此部分发送extrinsics，您需要准备以下内容：

- 在源链上的账户拥有一定[资金](/builders/get-started/networks/moonbase/#get-tokens){target=_blank}
- 资金在目标链上的Computed Origin账户中。要了解如何计算Computed Origin账户的地址，请参考[如何计算Computed Origin](/builders/interoperability/xcm/remote-execution/computed-origins){target=_blank}文档

在本示例中，使用的账户如下：

- Alice在源平行链（Moonbase Alpha）中的地址为：`0x44236223aB4291b93EEd10E4B511B37a398DEE55`
- 在目标平行链（Parachain 888）中的Computed Origin账户地址为：`0x5c27c4bb7047083420eddff9cddac4a0a120b45c`

### 构建XCM {: #xcm-transact-through-signed }

由于您将与XCM Transactor Pallet的`transactThroughSigned`函数进行交互，您需要组装`dest`、`fee`、`call`、`weightInfo`和`refund`参数。为此，您可以执行以下步骤：

1. 定义目标multilocation，其目标是平行链888：

    ```js
    const dest = {
      V3: {
        parents: 1,
        interior: { X1: { Parachain: 888 } },
      },
    };
    ```
    
2. 定义`fee`信息，这将要求您定义货币并设置费用数量

    === "外部XC-20"

        ```js
        const fee = {
          currency: {
            AsCurrencyId: { ForeignAsset: 35487752324713722007834302681851459189n },
          },
          feeAmount: 50000000000000000n,
        };
        ```
    
    === "本地XC-20"
    
        ```js
        const fee = {
          currency: {
            AsCurrencyId: { Erc20: { contractAddress: ERC_20_ADDRESS} },
          },
          feeAmount: 50000000000000000n,
        };
        ```
    
3. 定义将在目标链中执行的`call`。这里需要pallet、函数和输入值的编码调用数据。它可以在[Polkadot.js Apps](https://polkadot.js.org/apps/){target=_blank}中构建（必须连接至目标链），或使用[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}。对于本示例而言，内部调用是将目标链的1个Token余额简单转移到Alice的账户：

    ```js
    const call =
      '0x030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d';
    ```
    
4. 设置`weightInfo`，其包含特定于内部调用的权重（`transactRequiredWeightAtMost`）和交易加上XCM执行可选总权重（`overallWeight`）。对于每个参数，您可以遵循以下准则：

    - 对于 `transactRequiredAtMost`，您可以将`refTime`设置为`1000000000`的权重单位，将`proofSize`设置为`40000`
    - 对于`overallWeight`，该值必须是`transactRequiredWeightAtMost`加上在目标链中XCM指令执行成本所需的权重之和。如果您不提供此值，pallet将使用存储中的元素（若有）并将其添加至`transactRequiredWeightAtMost`。在本示例中，您可以将`overallWeight`设置为`Unlimited`，这样就无需知道目标链执行XCM需要多少权重
    
    ```js
    const weightInfo = {
      transactRequiredWeightAtMost: { refTime: 1000000000n, proofSize: 40000n },
      overallWeight: { Unlimited: null },
    };
    ```
    
    !!! 注意事项
        要准确预估`transactRequiredAtMost`的`refTime`和`proofSize`数字，您可以使用[Polkadot.js API的`paymentInfo`函数](/builders/build/substrate-api/polkadot-js-api#fees){target=_blank}。
    
5. 要退还任何剩余的XCM费用，您可以将`refund`值设置为`true`。 否则，将其设置为`false`

    ```js
    const refund = true;
    ```

### 发送XCM {: #sending-the-xcm }

现在，您已经有了每个参数的值，您可以为交易编写脚本了。为此，您可以执行以下步骤：

 1. 提供调用的输入数据，这包含：

     - 用于创建提供商的Moonbase Alpha端点URL
- `transactThroughSigned`函数的每个参数的值
  2. 创建一个用于发送交易的Keyring实例
  3. 创建[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}提供商
  4. 使用`dest`、`fee`、`call`、`weightInfo`和`refund`值制作`xcmTransactor.transactThroughSigned` extrinsic
  5. 使用`signAndSend` extrinsic和在第二个步骤创建的Keyring实例发送交易

!!! 请注意
    本教程的操作仅用于演示目的，请勿将您的私钥存储至JavaScript文档中。

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/transact-signed.js'
```

!!! 注意事项
    您可以使用以下编码的调用数据在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x210603010100e10d00017576e5e612ff054915d426c546b1b21a010000c52ebca2b10000000000000000007c030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d02286bee02710200010001){target=_blank}上查看上述脚本的示例，该脚本将1个Token发送给平行链888上Alice的Computed Origin账户：`0x210603010100e10d00017576e5e612ff054915d426c546b1b21a010000c52ebca2b10000000000000000007c030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d02286bee02710200010001`。

### 通过Computed Origin费用进行XCM交易 {: #transact-through-computed-origin-fees }

当[通过Computed Origin账户进行交易](#xcmtransactor-transact-through-signed){target=_blank}时，交易费用由分配调用的同一账户支付，该账户为目标链的Computed Origin账户。因此，Computed Origin账户必须持有必要的资金来支付整个执行过程的费用。请注意，支付费用的目标Token不需要在源链中注册为XC-20。

要预估Alice的Computed Origin账户执行远程调用所需的Token数量，您需要检查特定于目标链的交易信息。您可以使用以下脚本获取平行链888的交易信息：

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/transact-info-with-weight-limit.js'
```

在后台响应中，您可以看到`transactExtraWeightSigned`是`{{ networks.moonbase_beta.xcm_message.transact.weight.display }}`。这是在该特定目标链中执行此远程调用的4个XCM指令所需的权重。接下来，您需要找出目标链按XCM执行权重收取多少费用。通常，您会查看该特定链的每秒单位数。但在此场景中，不会销毁任何XC-20 Token。因此，单位每秒可以作为参考，但并不能确保预估的Token数量的准确度。要获取每秒单位作为参考值，可以使用以下脚本：

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/destination-asset-fee-per-second.js'
```

请注意，每秒单位值与[中继链XCM费用计算](/builders/interoperability/xcm/core-concepts/weights-fees/#polkadot){target=_blank}部分中预估的成本相关，或者如果目标是另一条平行链，则与[重量单位](/builders/interoperability/xcm/core-concepts/weights-fees/#moonbeam-reserve-assets){target=_blank}部分中显示的成本相关。您需要找到正确的值以确保Computed Origin账户持有的Token数量正确。计算相关的XCM执行费用非常简单，只需`transactExtraWeightSigned`乘以`unitsPerSecond`，可以获取预估值：

```text
XCM-Wei-Token-Cost = transactExtraWeightSigned * unitsPerSecond
XCM-Token-Cost = XCM-Wei-Token-Cost / DecimalConversion
```

因此，通过衍生调用的XCM Transactor交易的实际计算如下所示：

```text
XCM-Wei-Token-Cost = {{ networks.moonbase_beta.xcm_message.transact.weight.numbers_only }} * {{ networks.moonbase.xcm.units_per_second.xcbetadev.transact_numbers_only }}
XCM-Token-Cost = {{ networks.moonbase_beta.xcm_message.transact.wei_betadev_cost }} / 10^18
```

通过Computed Origin交易的成本为`{{ networks.moonbase_beta.xcm_message.transact.betadev_cost }} TOKEN`。**请注意，这不包括远程执行调用的成本，仅包含XCM执行费用。**
