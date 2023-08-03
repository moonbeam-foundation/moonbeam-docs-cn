---
title: XCM SDK参考页面：v1版本
description: Moonbeam XCM SDK中接口和函数的参考，可用于在波卡/Kusama生态系统内的链之间发送XCM转账。
---

# Moonbeam XCM SDK参考页面：v1版本

![XCM SDK Banner](/images/builders/interoperability/xcm/sdk/reference-banner.png)

## 概览 {: #introduction }

Moonbeam XCM SDK使开发者能够在波卡/Kusama生态系统内轻松实现链间（不论是平行链之间或平行链与中继链）资产转移。通过使用SDK，您无需担心确定源资产或目标资产的multilocation，或者该在哪些网络上使用哪些extrinsics来发送XCM转账。

SDK提供了一个API使您能够获取每个支持资产的资产信息、可以发送指定资产的源链，以及在已经指定源链的前提下，可以指定资产发送至的支持目标链。SDK中还包括与跨链资产转移相关的辅助函数，例如能够获取在减去任何执行费用后目标账户将收到的预估资产金额，以及基于资产的位数及其小数的资产转换函数。所有这些函数和帮助都使您能够轻松、无缝地跨链转移资产。

此页面包含XCM SDK v1版本中可用的接口和函数列表。有关如何使用XCM SDK接口和函数的相关信息，请参考[使用XCM SDK](/builders/interoperability/xcm/xcm-sdk/v1/xcm-sdk){target=_blank}指南。

## 核心样式和接口 {: #asset-chain-types }

XCM SDK的前提是定义了要转移的资产，然后定义了发送资产的源链和发送资产抵达的目标链，两者结合起来构建了转移数据。以下部分介绍了与资产、链和传输数据交互时您会交互的类型和接口。

### 资产 {: #assets }

- `Asset` - 定义一个资产在源链上使用的私钥和标志
    
    |      名称      |   类型   |         描述         |
    |:--------------:|:--------:|:--------------------:|
    |     `key`      | *string* |     识别一个资产     |
    | `originSymbol` | *string* | 该资产在源链上的标志 |
    
- `AssetAmount` - 定义与资产相关的属性，包含`Asset`属性、小数点位数、资产标志以及源链地址和目标链地址中拥有的资产数量
    
    |      名称      |   类型   |                        描述                        |
    |:--------------:|:--------:|:--------------------------------------------------:|
    |    `amount`    | *bigint* | 识别资产的特定数值（例如余额、最小值、最大值等等） |
    |   `decimals`   | *number* |                资产拥有的小数点位数                |
    |    `symbol`    | *string* |                      资产标志                      |
    |     `key`      | *string* |                      识别资产                      |
    | `originSymbol` | *string* |                该资产在源链上的标志                |
    
    !!! 注意事项
        [资产转换方法](#utility-functions)部分提供了一些实用方法，可用于将金额转换为各种格式的`AssetAmount`类别。

### 链 {: #chains }

- `Chain` - 定义一条链的相关属性，用于定义源链和目标链。如果该链为EVM平行链，则将会拥有额外属性。
    
    |     名称      |              类型              |                                       描述                                        |
    |:-------------:|:------------------------------:|:---------------------------------------------------------------------------------:|
    |  `ecosystem`  |          *Ecosystem*           |         识别该链归属的生态系统：`polkadot`、`kusama`或是`alphanet-relay`          |
    | `isTestChain` |           *boolean*            |                                 该链是否为测试网                                  |
    |     `key`     |            *string*            |                                    识别一条链                                     |
    |    `name`     |            *string*            |                                      链名称                                       |
    |    `type`     |          *ChainType*           |                     该链的类型：`parachain`或`evm-parachain`                      |
    | `assetsData`  | *Map<string, ChainAssetsData>* |                                该链支持的资产列表                                 |
    | `genesisHash` |            *string*            |                                   创世区块哈希                                    |
    | `parachainId` |            *number*            |                                     平行链ID                                      |
    | `ss58Format`  |            *number*            | 该链的[ss58格式](https://polkadot.js.org/docs/keyring/start/ss58/){target=_blank} |
    |     `ws`      |            *string*            |                                该链的WebSocket端点                                |
    |     `id`      |            *number*            |                           **仅适用于EVM平行链** - 链ID                            |
    |     `rpc`     |            *string*            |                    **仅适用于EVM平行链** - 该链的HTTP RPC端点                     |
    
- `ChainAssetsData` - 定义需要指向资产所需的信息。此参数通常用于包含不同链上存储该资产的方式。如果一定属性并不适用于给定的链，SDK将会预设为资产ID
    
    |       名称       |      类型      |                                        描述                                        |
    |:----------------:|:--------------:|:----------------------------------------------------------------------------------:|
    |     `asset`      |    *Asset*     |                                 资产私钥以及源标志                                 |
    |   `balanceId`    | *ChainAssetId* |                            ID资产的余额ID，预设为资产ID                            |
    |    `decimals`    |    *number*    |                               该资产拥有的小数点位数                               |
    |       `id`       | *ChainAssetId* |                                       资产ID                                       |
    |   `metadataId`   | *ChainAssetId* |                                    资产元数据ID                                    |
    |     `minId`      | *ChainAssetId* |                                     资产最小ID                                     |
    | `palletInstance` |    *number*    |                              资产归属的pallet实例数量                              |
    |      `min`       |    *number*    | 账户中需要保留的资产才能激活的最低金额。与账户最低保证金类似，但它适用于非本地资产 |
    
    `ChainAssetId`是一个用于描述资产在该链上的一般类型，每个链不同并由以下方式定义：
    
    ```ts
    type ChainAssetId =
      | string
      | number
      | bigint
      | { [key: string]: ChainAssetId };
    ```

### 转移数据 {: #transfer-data }

- `TransferData` - 定义转移一个资产的完整转移数据，包含资产、源链、目标链信息和部分用于转移流程的辅助函数
    
    |       名称       |              类型              |                描述                |
    |:----------------:|:------------------------------:|:----------------------------------:|
    |  `destination`   | *DestinationChainTransferData* |        组成目标链和地址信息        |
    |  `getEstimate`   |            function            | 获得将在目标地址获取的预估资产数量 |
    | `isSwapPossible` |           *boolean*            |          返回兑换是否可用          |
    |      `max`       |         *AssetAmount*          |    该资产*能够*被转移的最大数量    |
    |      `min`       |         *AssetAmount*          |    该资产*能够*被转移的最小数量    |
    |     `source`     |   *SourceChainTransferData*    |         组成源链和地址信息         |
    |      `swap`      |            function            | 兑换目标链和源链并返回兑换转移数据 |
    |    `transfer`    |            function            |   从源链转移指定数量资产至目标链   |
    
- `DestinationChainTransferData` - 定义用于转移的目标链数据
    
    |         名称         |     类型      |                                         描述                                         |
    |:--------------------:|:-------------:|:------------------------------------------------------------------------------------:|
    |      `balance`       | *AssetAmount* |                              被转移至目标地址的资产数量                              |
    |       `chain`        |  *AnyChain*   |                                      目标链信息                                      |
    | `existentialDeposit` | *AssetAmount* |                          在目标链上转移资产的账户最低保证金                          |
    |        `fee`         | *AssetAmount* |                              转移至目标链所需的费用数量                              |
    |        `min`         | *AssetAmount* | 要转移的资产的最低金额，与`TransferData.min`不同，此参数规定了目标链上应接收的最小值 |
    
- `SourceChainTransferData` - 定义用于转移的源链数据
    
    |         名称         |     类型      |                               描述                                |
    |:--------------------:|:-------------:|:-----------------------------------------------------------------:|
    |      `balance`       | *AssetAmount* |                      从源地址转移的资产余额                       |
    |       `chain`        |  *AnyChain*   |                             源链信息                              |
    | `existentialDeposit` | *AssetAmount* |                 在源链上转移资产的账户最低保证金                  |
    |        `fee`         | *AssetAmount* |                     从源链转移所需的费用数量                      |
    |     `feeBalance`     | *AssetAmount* |                     从源链转移所需的资产余额                      |
    |        `min`         | *AssetAmount* | 源链上应保留的最小资产数量，包含转移的`existentialDeposit`和`fee` |
    |        `max`         | *AssetAmount* |                    *能够*被转移的最大资产数量                     |

## 核心函数 {: #core-sdk-methods }

SDK提供以下核心函数：

- `Sdk()` - 公开XCM SDK的函数。**必须先调用才能访问其他SDK函数**

    ??? code "参数"
        |    名称    |     类型     |                    描述                    |
        |:----------:|:------------:|:------------------------------------------:|
        | `options?` | *SdkOptions* | 允许您指定`ethersSigner`或`polkadotSigner` |

    ??? code "返回"
        |       名称        |   类型   |                           描述                           |
        |:-----------------:|:--------:|:--------------------------------------------------------:|
        |     `assets`      | function | 提供一个入口点来构建在源链和目标链之间转移资产所需的数据 |
        | `getTransferData` | function |         构建在源链和目标链之间转移资产所需的数据         |

- `getTransferData()` - 构建在源链和目标链之间转移资产所需的数据
    
    ??? code "参数"
        |          名称           |               类型               |                       描述                       |
        |:-----------------------:|:--------------------------------:|:------------------------------------------------:|
        |  `destinationAddress`   |             *string*             |              目标链上的接收账户地址              |
        | `destinationKeyorChain` |       *string \| AnyChain*       |            目标链的私钥或`Chain`数据             |
        |     `ethersSigner?`     |          *EthersSigner*          | 使用H160以太坊式账户的以太坊兼容链的Ethers签署人 |
        |      `keyOrAsset`       |        *string \| Asset*         |        正在转移的资产的私钥或`Asset`数据         |
        |    `polkadotSigner?`    | *PolkadotSigner \| IKeyringPair* |              波卡签署人或Keyring对               |
        |     `sourceAddress`     |             *string*             |              在源链上的发送账户地址              |
        |   `sourceKeyOrChain`    |       *string \| AnyChain*       |             源链的私钥或`Chain`数据              |
    
    ??? code "返回"
        |       名称       |              类型              |                  描述                  |
        |:----------------:|:------------------------------:|:--------------------------------------:|
        |  `destination`   | *DestinationChainTransferData* |          组成目标链和地址信息          |
        |  `getEstimate`   |            function            |    获取目标地址将收到的资产预计金额    |
        | `isSwapPossible` |           *boolean*            |            返回是否可以兑换            |
        |      `max`       |         *AssetAmount*          |          可转移资产的最大金额          |
        |      `min`       |         *AssetAmount*          |          可转移资产的最小金额          |
        |     `source`     |   *SourceChainTransferData*    |           组成源链和地址信息           |
        |      `swap`      |            function            | 兑换目标链和源链并返回兑换后的转移数据 |
        |    `transfer`    |            function            |   将一定数量的资产从源链转移到目标链   |
    
- `assets()` - 提供一个入口点来构建在源链和目标链之间转移资产所需的数据
    
    ??? code "参数"
        |     名称     |    类型     |                             描述                             |
        |:------------:|:-----------:|:------------------------------------------------------------:|
        | `ecosystem?` | *Ecosystem* | 根据资产指出生态系统：`polkadot`、`kusama`或`alphanet-relay` |
    
    ??? code "返回"
        |   名称   |   类型    |      描述      |
        |:--------:|:---------:|:--------------:|
        | `assets` | *Asset[]* |  支持资产列表  |
        | `asset`  | function  | 被转移的资产集 |
    
        您可以参考以下部分以了解如何使用`asset`函数构建转移数据

## 使用资产构建转移数据所需函数 {: #transfer-data-builder-methods }

当使用`Sdk().assets()`函数构建转移数据时，您将使用多种函数来构建底层XCM消息并发送它。

- `asset()` - 设置要转移的资产。**必须先调用`assets()`**
    
    ??? code "参数"
        |     名称     |       类型        |              描述               |
        |:------------:|:-----------------:|:-------------------------------:|
        | `keyOrAsset` | *string \| Asset* | 正在转移的资产私钥或`Asset`数据 |
    
    ??? code "返回"
        |      名称      |     类型     |          描述          |
        |:--------------:|:------------:|:----------------------:|
        | `sourceChains` | *AnyChain[]* | 指定资产的支持源链列表 |
        |    `source`    |   function   |   设定转移资产的源链   |
    
- `source()` - 设置从中传输资产的源链。**必须先调用`asset()`**
    
    ??? code "参数"
        |     名称     |         类型         |           描述            |
        |:------------:|:--------------------:|:-------------------------:|
        | `keyOrChain` | *string \| AnyChain* | 源链的私钥或是`Chain`数据 |
    
    ??? code "返回"
        |        名称         |     类型     |              描述              |
        |:-------------------:|:------------:|:------------------------------:|
        | `destinationChains` | *AnyChain[]* | 指定资产和源链支持的目标链列表 |
        |    `destination`    |   function   |      设置转移资产的目标链      |
    
- `destination()` - 设置要将资产转移到的目标链。**必须先调用`source()`**
    
    ??? code "参数"
        |     名称     |         类型         |           描述            |
        |:------------:|:--------------------:|:-------------------------:|
        | `keyOrChain` | *string \| AnyChain* | 目标链的私钥或`Chain`数据 |
    
    ??? code "返回"
        |    名称    |   类型   |                  描述                  |
        |:----------:|:--------:|:--------------------------------------:|
        | `accounts` | function | 设置传输所需的源地址、目标地址和签署人 |
    
- `accounts()` - 设置传输所需的源地址、目标地址和签署人。**必须首先调用`destination()`**
    
    ??? code "参数"
        |         名称         |        类型        |               描述               |
        |:--------------------:|:------------------:|:--------------------------------:|
        |   `sourceAddress`    |      *string*      |       源链上的发送账户地址       |
        | `destinationAddress` |      *string*      |      目标链上的接收账户地址      |
        |      `signers?`      | *Partial(signers)* | 签署交易所需的Ethers或波卡签署人 |
    
    ??? code "返回"
        有关返回传输数据的信息，请参阅[`getTransferData()`函数](#:~:text=getTransferData())的返回部分。

## 用于使用转移数据的函数 {: #transfer-data-consumer-methods }

- `swap()` - 返回将资产从目标链交换回源链所需的转移数据
    
    ??? code "参数"
        None
    
    ??? code "返回"
        有关返回传输数据的信息，请参阅[`getTransferData()`函数](#:~:text=getTransferData())的返回部分。请记住，使用`swap`函数，原始转移数据中的`source`和`destination`已被交换。
    
- `transfer()` - 将指定数量的资产从源链转移到目标链
    
    ??? code "参数"
        |   名称   |             类型             |               描述               |
        |:--------:|:----------------------------:|:--------------------------------:|
        | `amount` | *bigint \| number \| string* | 在源链和目标链之间转移的资产数量 |
    
    ??? code "返回"
        | 名称 |       类型        |         描述         |
        |:----:|:-----------------:|:--------------------:|
        |  -   | *Promise(string)* | 源链上转账的交易哈希 |
    
- `getEstimate()` - 返回减去任何目标费用在目标链上将收到的资产预估金额
    
    ??? code "参数"
        |   名称   |        类型        |               描述               |
        |:--------:|:------------------:|:--------------------------------:|
        | `amount` | *number \| string* | 在源链和目标链之间转移的资产数量 |
    
    ??? code "返回"
        | 名称 |     类型      |             描述             |
        |:----:|:-------------:|:----------------------------:|
        |  -   | *AssetAmount* | 目标地址将收到的资产预估金额 |

## 用于资产转换的函数 {: #utility-functions }

- `toDecimal()` - 将`AssetAmount`转换为小数。要转换为小数格式的数字以及资产使用的小数会自动从`AssetAmount`中提取

    ??? code "参数"
        |     名称      |      类型      |                                                        描述                                                         |
        |:-------------:|:--------------:|:-------------------------------------------------------------------------------------------------------------------:|
        | `maxDecimal?` |    *number*    |                                         要使用的最大小数点位数。默认值为`6`                                         |
        | `roundType?`  | *RoundingMode* | 接受一个索引，该索引指示基于`RoundingMode`枚举使用的[舍入方法](https://mikemcl.github.io/big.js/#rm){target=_blank} |
    
        Where the `RoundingMode` enum is defined as:
        
        ```js
        enum RoundingMode {
          RoundDown = 0,
          RoundHalfUp = 1,
          RoundHalfEven = 2,
          RoundUp = 3
        }
        ```
    
    ??? code "返回"
        | 名称 |   类型   |        描述        |
        |:----:|:--------:|:------------------:|
        |  -   | *string* | 小数格式的给定数量 |
    
- `toBig()` - 将`AssetAmount`转换为一个大数
    
    ??? code "参数"
        None
    
    ??? code "返回"
        | 名称 | 类型  |        描述        |
        |:----:|:-----:|:------------------:|
        |  -   | *Big* | 大数格式的给定数量 |
    
- `toBigDecimal()` - 将`AssetAmount`转换为小数，然后转换为大数。要转换为小数格式的数字以及资产使用的小数会自动从`AssetAmount`中提取
    
    ??? code "参数"
        |     名称      |      类型      |                                                        描述                                                         |
        |:-------------:|:--------------:|:-------------------------------------------------------------------------------------------------------------------:|
        | `maxDecimal?` |    *number*    |                                            要使用的最大小数。默认值为`6`                                            |
        | `roundType?`  | *RoundingMode* | 接受一个索引，该索引指示基于`RoundingMode`枚举使用的[舍入方法](https://mikemcl.github.io/big.js/#rm){target=_blank} |
    
        Where the `RoundingMode` enum is defined as:
        
        ```js
        enum RoundingMode {
          RoundDown = 0,
          RoundHalfUp = 1,
          RoundHalfEven = 2,
          RoundUp = 3
        }
        ```
    
    ??? code "返回"
        | 名称 | 类型  |          描述          |
        |:----:|:-----:|:----------------------:|
        |  -   | *Big* | 大数小数格式的给定数量 |
