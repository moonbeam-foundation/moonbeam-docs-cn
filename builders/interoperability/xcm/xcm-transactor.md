---
title: 通过XCM进行远程执行
description: 通过使用XCM Transactor Pallet，如何在其他链进行远程XCM调用。XCM Transactor预编译允许通过以太坊API访问核心功能。
---

# 使用XCM Transactor Pallet进行远程执行

![XCM Transactor Precompile Contracts Banner](/images/builders/interoperability/xcm/xcm-transactor/xcmtransactor-banner.png)

## 概览 {: #introduction }

XCM消息是由跨共识虚拟机（XCVM）执行的[一系列指令](/builders/interoperability/xcm/overview/#xcm-instructions){target=_blank}组成。这些指令的组合会产生预先确定的操作，例如跨链Token转移，更有趣的是，远程跨链执行。

然而，从头开始构建XCM消息还是比较困难。此外，XCM消息从根账户（即SUDO或通过民主投票）发送给生态系统中的其他参与者，这对于希望通过简单交易实现远程跨链调用的项目来说并不合适。

要克服这些困难，开发者可以利用wrapper函数或pallet来使用波卡或Kusama上的XCM功能，例如[XCM Transactor Pallet](https://github.com/moonbeam-foundation/moonbeam/blob/master/pallets/xcm-transactor/src/lib.rs){target=_blank}。另外，XCM Transactor Pallet允许用户从主权账户衍生出来的账户（称为衍生账户）执行远程跨链调用，从而可通过简单的交易轻松执行。

pallet的两个主要extrinsic是通过主权衍生账户或从给定multilocation计算的衍生账户进行交易。每个extrinsic都相应命名。

本教程将向您展示如何使用XCM Transactor Pallet在生态系统（中继链或平行链）中从基于Moonbeam的网络发送XCM消息至其他链。此外，您还将学习到如何使用XCM Transactor预编译通过以太坊API执行同样的操作。

**请注意，通过XCM消息进行远程执行仍然有一些限制。**

**开发者须知悉，若发送不正确的XCM消息可能会导致资金丢失。**因此，XCM功能需先在测试网上进行测试后才可移至生产环境。

## 用于远程执行的XCM指令 {: xcm-instructions-for-remote-execution }

通过XCM进行远程执行的[相关指令](/builders/interoperability/xcm/overview/#xcm-instructions)，有但不限于：

 - [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} - 在目标链中执行。改变将用于执行后续XCM指令的起始地址
 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 在目标链中执行。移除资产并将其放于待使用
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - 在目标链中执行。从持有资产中提取用于支付执行费用。支付的费用取决于目标链
 - [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} - 在目标链中执行。从给定原始链派遣编码的调用数据

当由XCM Transactor Pallet创建的XCM消息执行后，必须支付费用。所有的相关信息可以在[XCM费用](/builders/interoperability/xcm/fees/){target=_blank}页面的[XCM Transactor费用部分](/builders/interoperability/xcm/fees/#xcm-transactor-fees){target=_blank}找到。

## 相关XCM定义 {: #general-xcm-definitions }

--8<-- 'text/xcm/general-xcm-definitions2.md'

- **Multilocation-derivative account** — 这会生产一个从[Descend Origin](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} XCM指令和提供的mulitlocation设置的新来源衍生的无私钥账户。对于基于Moonbeam的网络，[衍生方法](https://github.com/moonbeam-foundation/moonbeam/blob/v0.31.1/primitives/xcm/src/location_conversion.rs#L31-L37){target=_blank}是计算multilocation的`blake2`哈希，包括原始平行链ID并将哈希截断为正确的长度（以太坊格式的账户为20个字节）。`Transact`指令执行时会发生XCM调用[原始转换](https://github.com/paritytech/polkadot/blob/master/xcm/xcm-executor/src/lib.rs#L343){target=_blank}。因此，每个平行链可以使用自己想要的程序转换起点，从而发起交易的用户可能在每条平行链上拥有不同的衍生账户。该衍生账户支付交易费用，并设置为调用的派遣员
- **Transact information** — 与XCM Transactor extrinsic的XCM远程执行部分的额外权重和费用信息相关。这是必要的，因为XCM交易费用由主权账户进行支付。因此，XCM Transactor计算此费用，并向XCM Transactor extrinsic的发送者收取对应[XC-20 token](/builders/interoperability/xcm/xc20/overview/){target=_blank}的预估费用来偿还主权账户

## XCM Transactor Pallet接口 {: #xcm-transactor-pallet-interface}

### Extrinsics {: #extrinsics }

XCM Transactor Pallet提供以下extrinsics（函数）：

 - **hrmpManage**(action, fee, weightInfo) - 管理与打开、接受和关闭HRMP通道相关的HRMP操作。给定的操作可以是以下三个操作中的任何一个：`InitOpen`、`Accept`、`Close`、和`Cancel`
 - **removeFeePerSecond**(assetLocation) — 移除其储备链中给定资产的每秒费用信息。资产定义为multilocation
 - **removeTransactInfo**(location) — 移除给定链的交易信息，定义为multilocation
 - **setFeePerSecond**(assetLocation, feePerSecond) — 设置其储备链中给定资产的每秒交易费信息。资产定义为multilocation。`feePerSecond`是每秒XCM执行的Token单位，将会向XCM Transactor extrinsic的发送者收取费用
 - **setTransactInfo**(location, transactExtraWeight, maxWeight) — 设置给定链的交易信息，定义为multilocation。交易信息包含：
     - **transactExtraWeight** — 支付XCM指令执行费用（`WithdrawAsset`、`BuyExecution`和 `Transact`）的权重，预计至少比移除XCM指令执行使用的费用高出10%以上
     - **maxWeight** — 允许远程XCM执行的最大权重单位
     - **transactExtraWeightSigned** — （可选）支付XCM指令执行费用（`DescendOrigin`、`WithdrawAsset`、`BuyExecution`和`Transact`）的权重，预计至少比移除XCM指令执行使用的费用高出10%以上
 - **transactThroughSigned**(destination, fee, call, weightInfo) — 发送XCM消息，包含在给定目标链上远程执行特定调用的指令。远程调用将通过目标平行链衍生的新账户签署和执行。对于基于Moonbeam的网络，此账户是继承的multilocation的`blake2`哈希，截断成正确的长度。XCM Transactor Pallet计算远程执行的费用，并向extrinsic的发送者收取资产ID给出的对应[XC-20 token](/builders/interoperability/xcm/xc20/overview/){target=_blank}预估费用
 - **transactThroughSovereign**(destination, feePayer, fee, call, originKind, weightInfo) — 发送XCM消息，包含在给定目标链上远程执行特定调用的指令。程调用将通过支付费用的原始平行链主权账户签署，而交易是从给定起始账户发送。XCM Transactor Pallet计算远程执行的费用，并通过资产multilocation向给定账户收取对应[XC-20 token](/builders/interoperability/xcm/xc20/overview/){target=_blank}的预估费用

其中需要输入的内容如下：

 - **assetLocation** — 代表储备链上资产的multilocation，用于设置或获取每秒交易信息的费用
 - **location** — 代表生态系统中一条链的multilocation，用于设置或获取交易信息
 - **destination** — 代表生态系统中一条链的multilocation，XCM消息将发送到该位置
 - **fee** — 一个枚举（enum），为开发者提供两个关于如何定义XCM执行费用项目的选项。两种选项均依赖于`feeAmount`，即您为执行发送的XCM消息而提供的每秒XCM执行的资产单位。设置费用项目的两种不同方式如下：
     - **AsCurrencyID** — 用于支付远程调用执行的币种ID。不同的runtime有不同的定义ID的方式。以基于Moonbeam网络为例，`SelfReserve`指原生Token，`ForeignAsset`指XC-20资产ID（区别于XC-20地址）

     对于基于Moonbeam的网络，`SelfReserve`指的是原生Token，`ForeignAsset`指的是[外部 XC-20](/builders/interoperability/xcm/xc20/overview#external-xc20s)的资产ID {target=_blank}（不要与XC-20地址混淆），而`Erc20`指的是[原生XC-20](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=_blank}

     - **AsMultiLocation** — 代表用于执行XCM时支付费用的资产multilocation
 - **innerCall** — 在目标链中执行的调用的编码调用数据。如果通过主权衍生账户进行交易，这将包装在`asDerivative`选项中
 - **weightInfo** — 包含所有权重相关信息的结构。若没有提供足够的权重，则XCM执行将失败，资金可能会被锁定在主权账户或特定pallet中。因此，**正确设置目标权重以避免XCM执行失败至关重要**。结构包含以下两种字段：
     - **transactRequiredWeightAtMost** — 与`Transact`调用本身执行相关的权重。对于通过主权衍生的交易，您也需要考虑`asDerivative` extrinsic的权重。但是，这不会包含在所有XCM指令的成本（权重）当中
     - **overallWeight** — XCM Transactor extrinsic可以使用的所有权重。这包含所有XCM指令以及调用本身(**transactRequiredWeightAtMost**)的权重
 - **call** — 类似于`innerCall`，但是并没有用`asDerivative` extrinsic包装
 - **feePayer** — 将通过主权账户支付远程XCM执行交易费用的地址。费用将根据对应的[XC-20 token](/builders/interoperability/xcm/xc20/overview/){target=_blank}收取
 - **originKind** — 在目标链中远程调用的派遣者。目前有[四种派遣者类型](https://github.com/paritytech/polkadot/blob/0a34022e31c85001f871bb4067b7d5f5cab91207/xcm/src/v0/mod.rs#L60){target=_blank}可使用

### 存储方法 {: #storage-methods }

XCM Transactor Pallet包含以下只读存储方法：

 - **destinationAssetFeePerSecond**() — 返回给定multilocation资产的每秒费用。这能够将权重转换成费用。如果`feeAmount`设置为`None`，pallet extrinsics将读取存储元素
 - **palletVersion**() — 从存储库返回当前pallet的版本
 - **transactInfoWithWeightLimit**(location) — 返回给定multilocation的交易信息。如果`feeAmount`设置为`None`，pallet extrinsics将读取存储元素

### Pallet常量 {: #constants }

XCM Transactor Pallet包含以下只读函数以获取pallet常量：

- **baseXcmWeight**() — 返回每个XCM指令执行所需的基本XCM权重
- **selfLocation**() — 返回链的multilocation

## 通过签署函数进行XCM Transactor交易 {: #xcmtransactor-transact-through-signed }

此部分包含使用`transactThroughSigned`函数通过XCM Transactor Pallet为远程执行构建XCM消息。但是，由于目标平行链暂未公开，您将无法跟进。

!!! 注意事项
    请确保您已在目标链中允许将要远程执行的调用！

### 查看先决条件 {: #xcmtransactor-signed-check-prerequisites }

要在发送extrinsics，您需要准备以下内容：

 - 在原始链上的账户拥有一定[资金](/builders/get-started/networks/moonbase/#get-tokens){target=_blank}
 - 资金所在的目标链上的multilocation衍生账户。您可以通过使用 [`calculate-multilocation-derivative-account.ts`脚本](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/calculate-multilocation-derivative-account.ts){target=_blank}计算该地址

在本示例中，使用的账户如下：

 - Alice在原始平行链中的地址为`0x44236223aB4291b93EEd10E4B511B37a398DEE55`
 - 在目标平行链中的multilocation衍生账户地址为`0x5c27c4bb7047083420eddff9cddac4a0a120b45c`2

### 构建XCM {: #xcm-transact-through-signed }

由于您将与XCM Transactor Pallet的`transactThroughSigned`函数交互，您需要组装`dest`、`fee`、`call`和`weightInfo`参数。为此，您可以执行以下步骤：

1. 定义目标multilocation，其目标是平行链888：

    ```js
    const dest = {
      V3: {
        parents: 1,
        interior: { X1: { Parachain: 888 } },
      },
    };
    ```

2. 定义`fee`信息，其将要求您：

    - 定义币种ID并提供资产详情
    - 设置费用金额

    === "External XC-20s"

        ```js
        const fee = {
          currency: {
            AsCurrencyId: { 
              ForeignAsset: 3547752324713722007834302681851459189n 
            },
          },
          feeAmount: 50000000000000000n,
         };
        ```

    === "Local XC-20s"

        ```js
        const fee = {
          currency: {
            AsCurrencyId: { Erc20: { contractAddress: ERC_20_ADDRESS} },
          },
          feeAmount: 50000000000000000n,
        };
        ```

3. 定义将在目标链中执行的`call`。这里需要pallet、函数和输入值的编码调用数据

    它可以在[Polkadot.js Apps](https://polkadot.js.org/apps/){target=_blank}中构建（必须连接至目标链）或使用[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}。对于本示例而言，内部调用是将目标链的1个Token余额简单转移到Alice的账户：

    ```js
    const call =
      '0x030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d';
    ```

4. 设置`weightInfo`，其包含所需的`transactRequiredWeightAtMost`权重和可选的`overallWeight`参数。两个权重参数都要求您指定`refTime`和`proofSize`，其中`refTime`是可用于执行的计算时间量，`proofSize`是可使用的存储量（以字节为单位）。对于每个参数，您可以遵循以下准则：

    - 对于`transactRequiredAtMost`，该值必须包含`asDerivative` extrinsic。然而，这并不包含XCM指令的权重。在本示例中，将`refTime`设置为 `1000000000`的权重单位，将`proofSize`设置为`40000`
    - 对于`overallWeight`，该值必须是**transactRequiredWeightAtMost**加上在目标链中XCM指令执行成本所需的权重之和。如果您不提供此值，pallet将使用存储中的元素（若有）。在本示例中，将`refTime`设置为`2000000000`权重单位，将将`proofSize`设置为`50000`

    ```js
    const weightInfo = {
      transactRequiredWeightAtMost: { refTime: 1000000000n, proofSize: 40000n },
      overallWeight: { refTime: 2000000000n, proofSize: 50000n },
    };
    ```

    !!! note
        For accurate estimates of the `refTime` and `proofSize` figures, you can use the [`paymentInfo` method of the Polkadot.js API](/builders/interoperability/xcm/remote-evm-calls/#build-xcm-remote-evm){target=_blank} as described in the Remote EVM Calls guide.

现在，您已经有了每个参数的值，您可以为交易编写脚本了。为此，您可以执行以下步骤：

 1. 提供调用的输入数据，这包含：

     - 用于创建提供商的Moonbase Alpha端点URL
     - `transactThroughSigned`函数的每个参数的值

 2. 创建一个用于发送交易的Keyring实例
 3. 创建[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}提供商
 4. 使用`dest`、`fee`、`call`和`weightInfo`值制作`xcmTransactor.transactThroughSigned` extrinsic
 5. 使用`signAndSend` extrinsic和在第二个步骤创建的Keyring实例发送交易

!!! 请记住
    本教程的操作仅用于演示目的，请勿将您的私钥存储至JavaScript文档中。

```js
--8<-- 'code/xcm-transactor/transact-signed.js'
```

!!! 注意事项
    您可以使用以下编码的调用数据在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x210603010100e10d00017576e5e612ff054915d426c546b1b21a010000c52ebca2b10000000000000000007c030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d02286bee02710200010300943577420d0300){target=_blank}上查看上述脚本的示例，该脚本将1个xcUNIT发送给中继链上Alice的账户：`0x210603010100e10d00017576e5e612ff054915d426c546b1b21a010000c52ebca2b10000000000000000007c030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d02286bee02710200010300943577420d0300`。

交易处理后，Alice应该在目标链的地址上收到1个Token。

## XCM Transactor预编译 {: #xcmtransactor-precompile }

XCM Transactor预编译合约允许开发者通过基于Moonbeam网络的以太坊API访问XCM Transactor Pallet功能。与其他[预编译合约](/builders/pallets-precompiles/precompiles/){target=_blank}相似，XCM Transactor预编译位于以下地址：

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.xcm_transactor}}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.xcm_transactor}}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.xcm_transactor}}
     ```

XCM Transactor旧版预编译仍可在所有基于Moonbeam网络中使用。但是，**旧版本将在不久的将来被弃用**，因此所有实现都必须迁移到较新的接口。XCM Transactor旧版预编译位于以下地址：

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.xcm_transactor_legacy}}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.xcm_transactor_legacy}}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.xcm_transactor_legacy}}
     ```

--8<-- 'text/precompiles/security.md'

### XCM Transactor Solidity接口 {: #xcmtrasactor-solidity-interface }

[XcmTransactor.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v2/XcmTransactorV2.sol){target=_blank}是一个接口，开发者可以用其通过以太坊API与XCM Transactor Pallet进行交互。

!!! 注意事项
    XCM Transactor预编译的[旧版本](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=_blank}将在不久的将来被弃用，因此所有实现都必须迁移到较新的接口。

此接口包含以下函数：

 - **indexToAccount**(*uint16* index) — 只读函数，返回授权使用给定索引的基于Moonbeam网络主权账户操作的注册地址
  - **transactInfoWithSigned**(*Multilocation* *memory* multilocation) — 只读函数，对于定义为multilocation的给定链，返回考虑与外部调用执行（`transactExtraWeight`）关联的3个XCM指令的交易消息。这也将返回通过签署extrinsic（`transactExtraWeightSigned`）交易的`DescendOrigin` XCM指令关联的额外权重信息
 - **feePerSecond**(*Multilocation* *memory* multilocation) — 只读函数，对于作为multilocation的给定资产，返回每秒XCM执行的Token单位，其作为XCM执行费用收取。这对于给定链有多种资产可以作为手续费进行支付使非常有用
 - **transactThroughSignedMultilocation**(*Multilocation* *memory* dest, *Multilocation* *memory* fee_location, *uint64* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *uint64* overallWeight) — 表示[上述示例](#xcmtransactor-transact-through-signed)中描述的`transactThroughSigned`方法的函数，将**fee**类型设置为**AsMultiLocation**。您需要提供Token的资产multilocation来支付费用，而不是XC-20 Token `address`
 - **transactThroughSigned**(*Multilocation* *memory* dest, *address* fee_location_address, *uint64* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *uint64* overallWeight) — 表示[上述示例](#xcmtransactor-transact-through-signed)中描述的`transactThroughSigned`方法的函数，将**fee**类型设置为**AsCurrencyId**。您将需要提供用于支付费用的Token的[资产XC-20地址](/builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=_blank}，而不是资产ID
 - **encodeUtilityAsDerivative**(*uint8* transactor, *uint16* index, *bytes memory* innerCall) - 给定要使用的交易者（transactor）、衍生账户的索引（index）以及要从衍生地址执行的内部调用（innerCall），对`asDerivative`包装调用进行编码

### 构建预编译Multilocation {: #building-the-precompile-multilocation }

在XCM Transactor预编译接口中，`Multilocation`结构定义为如下：

--8<-- 'text/xcm/xcm-precompile-multilocation.md'

下面的代码片段介绍了`Multilocation`结构的一些示例，他们需要被输入到XCM Transactor预编译函数中：

```js
// Multilocation targeting the relay chain asset from a parachain
{
    1, // parents = 1
    [] // interior = here
}

// Multilocation targeting Moonbase Alpha DEV token from another parachain
{
    1, // parents = 1
    // Size of array is 2, meaning is an X2 interior
    [
        "0x00000003E8", // Selector Parachain, ID = 1000 (Moonbase Alpha)
        "0x0403" // Pallet Instance = 3
    ]
}

// Multilocation targeting aUSD asset on Acala
{
    1, // parents = 1
    // Size of array is 1, meaning is an X1 interior
    [
        "0x00000007D0", // Selector Parachain, ID = 2000 (Acala)
        "0x060001" // General Key Selector + Asset Key
    ]
}
```
