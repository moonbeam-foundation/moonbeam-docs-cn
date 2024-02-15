---
title: XCM Transactor Precompile 
description: 本教程将介绍XCM Transactor Precompile，并展示如何使用该预编译的一些功能通过以太坊库发送远程调用至其他链。
---

# 使用XCM Transactor Precompile进行远程执行

XCM消息是由跨共识虚拟机（XCVM）执行的[一系列指令](/builders/interoperability/xcm/core-concepts/instructions/){target=_blank}组成。这些指令的组合会产生预先确定的操作，例如跨链Token转移，更有趣的是，远程跨链执行。远程执行涉及从另一个区块链在一个区块链上执行操作或操作，同时保持发送者身份和权限的完整性。

通常，XCM消息从根账户（即SUDO或通过民主投票）发送给生态系统中的其他参与者，这对于希望通过简单交易实现远程跨链调用的项目来说并不合适。[XCM Transactor Pallet](https://github.com/moonbeam-foundation/moonbeam/blob/master/pallets/xcm-transactor/src/lib.rs){target=_blank}可以轻松通过[主权账户](/builders/interoperability/xcm/overview#general-xcm-definitions){target=_blank}（仅可通过治理允许操作）或通过来自源链简单交易的[Computed Origin账户](//builders/interoperability/xcm/remote-execution/computed-origins){target=_blank}在远程链上进行交易。

然而，XCM Transactor Pallet采用Rust编码，通常无法从Moonbeam的以太坊API端访问。因此，Moonbeam引入了XCM Transactor Precompile。这是一个Solidity接口，允许您使用以太坊API直接与Substrate pallet交互。

本教程将向您展示如何使用XCM Transactor Precompile从基于Moonbeam的网络发送XCM消息至生态系统中的其他链。

**请注意，通过XCM消息进行远程执行仍然有一些限制。**

**开发者须知悉，若发送不正确的XCM消息可能会导致资金丢失。**因此，XCM功能需先在测试网上进行测试后才可移至生产环境。

## XCM Transactor Precompile合约地址 {: #precompile-address }

XCM Transactor Precompile有多个版本。**V1版本将在不久被弃用**，因此所有的实现必须迁移至最新的接口。

XCM Transactor Precompiles位于以下地址：

=== "Moonbeam"

    | 版本 |                                地址                                 |
    |:-------:|:----------------------------------------------------------------------:|
    |   V1    | <pre>```{{ networks.moonbeam.precompiles.xcm_transactor_v1 }}```</pre> |
    |   V2    | <pre>```{{ networks.moonbeam.precompiles.xcm_transactor_v2 }}```</pre> |
    |   V3    | <pre>```{{ networks.moonbeam.precompiles.xcm_transactor_v3 }}```</pre> |

=== "Moonriver"
    | 版本 |                                 地址                                 |
    |:-------:|:-----------------------------------------------------------------------:|
    |   V1    | <pre>```{{ networks.moonriver.precompiles.xcm_transactor_v1 }}```</pre> |
    |   V2    | <pre>```{{ networks.moonriver.precompiles.xcm_transactor_v2 }}```</pre> |
    |   V3    | <pre>```{{ networks.moonriver.precompiles.xcm_transactor_v3 }}```</pre> |

=== "Moonbase Alpha"

    | 版本 |                                地址                                 |
    |:-------:|:----------------------------------------------------------------------:|
    |   V1    | <pre>```{{ networks.moonbase.precompiles.xcm_transactor_v1 }}```</pre> |
    |   V2    | <pre>```{{ networks.moonbase.precompiles.xcm_transactor_v2 }}```</pre> |
    |   V3    | <pre>```{{ networks.moonbase.precompiles.xcm_transactor_v3 }}```</pre> |

--8<-- 'text/builders/pallets-precompiles/precompiles/security.md'

## XCM Transactor Solidity接口 {: #xcmtrasactor-solidity-interface }

XCM Transactor Precompile是一个 Solidity 接口，开发者可以通过该接口使用以太坊API与XCM Transactor Pallet进行交互。

??? code "XcmTransactorV1.sol"

    ```solidity
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/XcmTransactorV1.sol'
    ```

??? code "XcmTransactorV2.sol"

    ```solidity
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/XcmTransactorV2.sol'
    ```

??? code "XcmTransactorV3.sol"

    ```solidity
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/XcmTransactorV3.sol'
    ```

!!! 注意事项
    [XCM Transactor Precompile V1版本](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=_blank}将在不久被弃用，因此所有的实现必须迁移至最新的接口。

接口会因版本的不同而有所不同。每个版本接口的概览如下所示：

=== "V2"

    V2版本的接口包含以下函数：
    
    ??? function "**transactInfoWithSigned**(*Multilocation* *memory* multilocation) — 只读函数，返回给定链的交易信息"
    
        === "参数"
    
            - `multilocation` - 链的multilocation以获取交易信息
        
        === "返回"
    
            交易信息为：
                - 与外部调用执行（`transactExtraWeight`）相关的三个XCM指令
                - 通过签名extrinsic (`transactExtraWeightSigned`) 与交易的`DescendOrigin` XCM指令相关的额外权重信息
                - 给定链中消息允许的最大权重
    
            ```js
            [ 173428000n, 0n, 20000000000n ]
            ```
    
    ??? function "**feePerSecond**(*Multilocation* *memory* multilocation) — 只读函数，返回每秒XCM执行的Token单位，作为给定资产的XCM执行费用收取。此函数对于给定的链有多种可用于支付费用的资产时非常有用"
    
        === "参数"
    
            - `multilocation` - 资产的multilocation以获取每秒单位值
        
        === "返回"
            
            储备链对给定资产在每秒收取的费用
    
            ```js
            13764626000000n
            ```
    
    ??? function "**transactThroughSignedMultilocation**(*Multilocation* *memory* dest, *Multilocation* *memory* feeLocation, *uint64* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *uint64* overallWeight) — 发送包含在目标链中远程执行调用指令的XCM消息。远程调用可通过目标平行链必须计算的新账户（称为[Computed Origin](/builders/interoperability/xcm/remote-execution/computed-origins){target=_blank}），进行签署和执行。基于Moonbeam的网络遵循[波卡制定的Computed Origins标准](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=_blank}。您需要提供用于支付费用的Token的资产multilocation，而不是XC-20 Token地址"
    
        === "参数"
    
            - `dest` - XCM消息发送到的生态系统中链的multilocation（目标链）。Multilocation必须以特定方式组成，这在[构建预编译Multilocation](#building-the-precompile-multilocation)部分中进行了描述
            - `feeLocation` - 用于支付费用的资产multilocation。Multilocation必须以特定方式组成，这在[构建预编译Multilocation](#building-the-precompile-multilocation)部分中进行了描述
            - `transactRequiredWeightAtMost` - 在目标链中购买的权重，用于执行`Transact`指令中定义的调用
            - `call` - 在目标链中执行的调用，如`Transact`指令中所定义
            - `feeAmount` - 用于支付费用的数量
            - `overallWeight` - extrinsic可用于执行所有XCM指令的总权重，加上`Transact`调用（`transactRequiredWeightAtMost`）的权重。`overallWeight`结构也包含`refTime`和`proofSize`。如果您为`refTime`传入uint64的最大值，则允许无限量购买权重，这样就无需知道目标链执行XCM需要多少权重
    
    ??? function "**transactThroughSigned**(*Multilocation* *memory* dest, *address* feeLocationAddress, *uint64* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *uint64* overallWeight) — 发送包含在目标链中远程执行调用指令的XCM消息。远程调用可通过目标平行链必须计算的新账户（称为[Computed Origin](/builders/interoperability/xcm/remote-execution/computed-origins){target=_blank}），进行签署和执行。基于Moonbeam的网络遵循[波卡制定的Computed Origins标准](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=_blank}。您需要提供用于支付费用的XC-20资产的地址"
    
        === "参数"
    
            - `dest` - XCM消息发送到的生态系统中链的multilocation（目标链）。Multilocation必须以特定方式组成，这在[构建预编译Multilocation](#building-the-precompile-multilocation)部分中进行了描述
            - `feeLocationAddress` - 用于支付费用的资产的[XC-20地址](/builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=_blank}
            - `transactRequiredWeightAtMost` - 在目标链中购买的权重，用于执行`Transact`指令中定义的调用
            - `call` - 在目标链中执行的调用，如`Transact`指令中所定义
            - `feeAmount` - 用于支付费用的数量
            - `overallWeight` - extrinsic可用于执行所有XCM指令的总权重，加上`Transact`调用（`transactRequiredWeightAtMost`）的权重。`overallWeight`结构也包含`refTime`和`proofSize`。如果您为`refTime`传入uint64的最大值，则允许无限量购买权重，这样就无需知道目标链执行XCM需要多少权重

=== "V3"

    V3版本接口增加了对Weights V2的支持，它更新了`Weight`类型以表示除了计算时间之外的证明大小。 因此，将需要定义`refTime`和`proofSize`，其中`refTime`是可用于执行的计算时间量，`proofSize`是可使用的存储量（以字节为单位）。
    
    以下结构已添加至XCM Transactor Precompile中，以支持Weights V2：
    
    ```solidity
    struct Weight {
        uint64 refTime;
        uint65 proofSize;
    }
    ```
    
    此外，还添加了对[`RefundSurplus`](/builders/interoperability/xcm/core-concepts/instructions#refund-surplus){target=_blank}和[`DepositAsset`](/builders/interoperability/xcm/core-concepts/instructions#deposit-asset){target=_blank}指令的支持。要将`RefundSurplus`指令附加到XCM消息，您可以使用`refund`参数。如果该参数设置为`true`，这将退还未用于`Transact`的任何剩余资金。
    
    V3版本的接口包含以下函数：
    
    ??? function "**transactInfoWithSigned**(*Multilocation* *memory* multilocation) — 只读函数，将返回给定链的交易信息"
    
        === "参数"
    
            - `multilocation` - 链的multilocation以获取交易信息
        
        === "返回"
    
            交易信息为：
                - 与外部调用执行（`transactExtraWeight`）相关的三个XCM指令
                - 通过签名extrinsic (`transactExtraWeightSigned`) 与交易的`DescendOrigin` XCM指令相关的额外权重信息
                - 给定链中消息允许的最大权重
    
            ```js
            [ 173428000n, 0n, 20000000000n ]
            ```
    
    ??? function "**feePerSecond**(*Multilocation* *memory* multilocation) — 只读函数，返回每秒XCM执行的Token单位，作为给定资产的XCM执行费用收取。此函数对于给定的链有多种可用于支付费用的资产时非常有用"
    
        === "参数"
    
            - `multilocation` - 资产的multilocation以获取每秒单位值
        
        === "返回"
            
            储备链对给定资产每秒收取的费用
    
            ```js
            13764626000000n
            ```
    
    ??? function "**transactThroughSignedMultilocation**(*Multilocation* *memory* dest, *Multilocation* *memory* feeLocation, *Weight* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *Weight* overallWeight, *bool* refund) — 发送包含在目标链中远程执行调用指令的XCM消息。远程调用可通过目标平行链必须计算的新账户（称为[Computed Origin](/builders/interoperability/xcm/remote-execution/computed-origins){target=_blank}），进行签署和执行。基于Moonbeam的网络遵循[波卡制定的Computed Origins标准](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=_blank}。您需要提供用于支付费用的Token的资产multilocation，而不是XC-20 Token地址"
    
        === "参数"
    
            - `dest` - XCM消息发送到的生态系统中链的multilocation（目标链）。Multilocation必须以特定方式组成，这在[构建预编译Multilocation](#building-the-precompile-multilocation)部分中进行了描述
            - `feeLocation` - 用于支付费用的资产multilocation。Multilocation必须以特定方式组成，这在[构建预编译Multilocation](#building-the-precompile-multilocation)部分中进行了描述 
            - `transactRequiredWeightAtMost` - 在目标链中购买的权重，用于执行`Transact`指令中定义的调用。`transactRequiredWeightAtMost`结构包含以下内容：
                - `refTime` - 可用于执行的计算时间量
                - `proofSize` - 可以使用的存储量（以字节为单位）
    
                其格式应如下所示：
    
                ```js
                [ INSERT_REF_TIME, INSERT_PROOF_SIZE ]
                ```
            - `call` - 在目标链中执行的调用，如`Transact`指令中所定义
            - `feeAmount` - 用于支付费用的数量
            - `overallWeight` - extrinsic可用于执行所有XCM指令的总权重，加上`Transact`调用（`transactRequiredWeightAtMost`）的权重。`overallWeight`结构也包含`refTime`和`proofSize`。如果您为`refTime`传入uint64的最大值，则允许无限量购买权重，这样就无需知道目标链执行XCM需要多少权重
            - `refund` - 一个布尔值，指示是否将`RefundSurplus`和`DepositAsset`指令添加到XCM消息中以退还任何剩余费用
    
    ??? function "**transactThroughSigned**(*Multilocation* *memory* dest, *address* feeLocationAddress, *Weight* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *Weight* overallWeight, *bool* refund) — 发送包含在目标链中远程执行调用指令的XCM消息。远程调用可通过目标平行链必须计算的新账户（称为[Computed Origin](/builders/interoperability/xcm/remote-execution/computed-origins){target=_blank}），进行签署和执行。基于Moonbeam的网络遵循[波卡制定的Computed Origins标准](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=_blank}。您需要提供用于支付费用的XC-20资产的地址"
    
        === "参数"
    
            - `dest` - XCM消息发送到的生态系统中链的multilocation（目标链）。Multilocation必须以特定方式组成，这在[构建预编译Multilocation](#building-the-precompile-multilocation)部分中进行了描述
            - `feeLocationAddress` - 用于支付费用的资产的[XC-20地址](/builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=_blank}
            - `transactRequiredWeightAtMost` - 在目标链中购买的权重，用于执行`Transact`指令中定义的调用。`transactRequiredWeightAtMost`结构包含以下内容：
                - `refTime` - 可用于执行的计算时间量
                - `proofSize` - 可以使用的存储量（以字节为单位）
    
                其格式应如下所示：
    
                ```js
                [ INSERT_REF_TIME, INSERT_PROOF_SIZE ]
                ```
            - `call` - 在目标链中执行的调用，如`Transact`指令中所定义
            - `feeAmount` - 用于支付费用的数量
            - `overallWeight` - extrinsic可用于执行所有XCM指令的总权重，加上`Transact`调用（`transactRequiredWeightAtMost`）的权重。`overallWeight`结构也包含`refTime`和`proofSize`。如果您为`refTime`传入uint64的最大值，则允许无限量购买权重，这样就无需知道目标链执行XCM需要多少权重
            - `refund` -  一个布尔值，指示是否将`RefundSurplus`和`DepositAsset`指令添加到XCM消息中以退还任何剩余费用

## 用于远程执行的XCM指令 {: #xcm-instructions-for-remote-execution }

通过XCM进行远程执行的相关[XCM指令](/builders/interoperability/xcm/core-concepts/instructions/){target=_blank}，有但不限于：

 - [`DescendOrigin`](/builders/interoperability/xcm/core-concepts/instructions#descend-origin){target=_blank} - 在目标链中执行。改变目标链上的源以匹配源链上的源，确保目标链上的执行操作和源链上发起XCM消息传递一致，且代表着相同的实体
 - [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions#withdraw-asset){target=_blank} - 在目标链中执行。删除资产并将其放于持有的存放处
 - [`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions#buy-execution){target=_blank} - 在目标链中执行。从持有资产中提取用于支付执行费用。支付的费用取决于目标链
 - [`Transact`](/builders/interoperability/xcm/core-concepts/instructions#transact){target=_blank} - 在目标链中执行。从给定原始链分配编码的调用数据，用于执行特定操作或函数

## 构建Precompile Multilocation {: #building-the-precompile-multilocation }

在XCM Transactor Precompile接口中，`Multilocation`结构被定义为：

--8<-- 'text/builders/interoperability/xcm/xcm-precompile-multilocation.md'

以下代码片段介绍了`Multilocation`结构的一些示例，因为它们需要输入到XCM Transactor Precompile函数中：

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/multilocations.js'
```

## 通过Computed Origin账户进行调用 {: #xcmtransactor-transact-through-signed }

此部分包含使用`transactThroughSigned`函数通过XCM Transactor Pallet为远程执行构建XCM消息。此函数使用目标链中的[Computed Origin](/builders/interoperability/xcm/remote-execution/computed-origins){target=_blank}账户分配远程调用。

本示例中使用的目标平行链未开放使用，因此您无法完全遵循本教程。您可以根据自己的用例需求修改本示例。

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

在本示例中，您将与XCM Transactor Precompile V3版本的`transactThroughSigned`函数交互。要使用此函数，您可以执行以下步骤：

1. 使用Moonbase Alpha RPC端点创建一个provider

2. 创建一个签署人来发送交易。此示例中使用私钥创建签署人，仅用于演示目的。**切勿将私钥存储在 JavaScript文件中**

3. 使用预编译的地址和ABI创建XCM Transactor V3 Precompile的合约实例

    ??? code "XCM Transactor V3 ABI"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/XcmTransactorV3ABI.js'
        ```
    
4. 组装`transactThroughSigned`函数的参数：

    - `dest` - 目标Multilocation，即平行链888：

        ```js
    const dest = [
          1, // parents = 1
      [  // interior = X1 (the array has a length of 1)
            '0x0000000378', // Parachain selector + Parachain ID 888
          ],
        ];
        ```
    
    - `feeLocationAddress` - 用于支付费用的XC-20地址，即平行链888的原生资产
    
        ```js
    const feeLocationAddress = '0xFFFFFFFF1AB2B146C526D4154905FF12E6E57675';
        ```

    - `transactRequiredWeightAtMost` - `Transact`指令中执行调用所需的权重。您可通过在调用中使用[Polkadot.js API的`paymentInfo`函数](/builders/build/substrate-api/polkadot-js-api#fees){target=_blank}获取此信息

        ```js
        const transactRequiredWeightAtMost = [1000000000n, 5000n];
        ```

    - `call` - pallet、函数和输入值的编码调用数据。它可以在[Polkadot.js Apps](https://polkadot.js.org/apps/){target=_blank}中构建（必须连接至目标链），或使用[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}。对于本示例而言，内部调用是将目标链的1个Token余额简单转移到Alice的账户：

        ```js
    const call =
          '0x030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d';
        ```
    
- `feeAmount` - 用于支付费用的数量
    
    ```js
        const feeAmount = 50000000000000000n;
    ```
    
    - `overallWeight` - 特定于内部调用的权重（`transactRequiredWeightAtMost`）加上目标链中XCM指令的执行成本所需的权重：`DescendOrigin`、`WithdrawAsset`、`BuyExecution`和`Transact`。 请注意每条链条都定义了权重要求。要确定给定链上每条XCM指令所需的权重，请参考每条链的文档网站或联系团队成员。或者，您可以为`refTime`（数组的第一个索引）传入uint64的最大值。这将允许无限量购买权重，这样就无需知道目标链执行XCM需要多少权重
    
        ```js
    const overallWeight = [18446744073709551615n, 10000n];
        ```

5. 创建`transactThroughSigned`函数，传入参数

6. 签署并发送交易

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/transact-through-signed/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/transact-through-signed/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/transact-through-signed/web3.py'
    ```

### 通过Computed Origin费用进行XCM transact {: #transact-through-computed-origin-fees }

当[通过Computed Origin账户进行transact](#xcmtransactor-transact-through-signed){target=_blank}时，交易费用由分配调用的同一账户支付，该账户为目标链的Computed Origin账户。因此，Computed Origin账户必须持有必要的资金来支付整个执行过程的费用。请注意，支付费用的目标Token不需要在源链中注册为XC-20。

要预估Alice的Computed Origin账户执行远程调用所需的Token数量，您需要检查特定于目标链的交易信息。您可以使用以下脚本获取平行链888的交易信息：

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/transact-info-with-signed.js'
```

在后台响应中，您可以看到`transactExtraWeightSigned`是`{{ networks.moonbase_beta.xcm_message.transact.weight.display }}`。这是在该特定目标链中执行此远程调用的4个XCM指令所需的权重。接下来，您需要找出目标链按XCM执行权重收取多少费用。通常，您会查看该特定链的每秒单位数。但在此场景中，不会销毁任何XC-20 Token。因此，单位每秒可以作为参考，但并不能确保预估的Token数量的准确度。要获取每秒单位作为参考值，可以使用以下脚本：

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/fee-per-second.js'
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
