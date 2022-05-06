---
title: 传送XC-20
description: 学习如何使用X-Tokens pallet将XC-20s传送至其他链。另外，X-Tokens预编译允许您通过以太坊API访问核心功能。
---

# 使用X-Tokens Pallet传送XC-20

![X-Tokens Precompile Contracts Banner](/images/builders/xcm/xc20/xtokens/xtokens-banner.png)

## 概览 {: #introduction }

为同质化资产转移构建XCM信息通道并非一件易事。因此，开发者可以通过利用wrapper函数/pallet在Polkadot/Kusama上使用XCM功能。

此类包装器的一个示例是[X-Tokens](https://github.com/open-web3-stack/open-runtime-module-library/tree/master/xtokens){target=_blank} pallet，用于提供通过XCM转移同质化资产的不同方法。

本教程将向您展示如何利用X-Tokens pallet在生态系统（中继链/平行链）中从基于Moonbeam的网络发送XC-20s至其他链。此外，您还将学习到如何使用X-Tokens预编译通过以太坊API执行同样的操作。

**开发者须知若传送不正确的XCM消息可能会导致资金损失。**因此，XCM功能需先在测试网上进行测试后才可移至生产环境。

--8<-- 'text/xcm/general-xcm-definitions.md'

## X-Tokens Pallet接口 {: #x-tokens-pallet-interface}

X-Tokens pallet提供以下extrinsics（函数）：

 - **transfer(currencyId, amount, dest, destWeight)** —— 转移一个币种，根据原生Token（自身储备）或是资产ID定义
 - **transferMultiasset(asset, dest, destWeight)** —— 转移一种可替代资产，根据其multilocation（多重地点）定义
 - **transferMultiassetWithFee(asset, fee, dest, destWeight)** —— 转移一种可替代资产，但其能够让资产的发送者使用另外一种资产支付转移费用。两者皆根据其多重地点定义
 - **transferMultiassets(assets, feeItem, dest, destWeight)** —— 转移多种可替代资产，并定义其中哪种资产将会被用于支付转移费用。所有资产皆由其多重地点定义
 - **transferMulticurrencies(currencies, feeItem, dest, destWeight)** —— 转移多个币种，并定义其中哪种币种将会被用于支付转移费用。所有币种都将通过原生Token（自身储备）或是资产ID定义
 - **transferWithFee(currencyId, amount, fee, dest, destWeight)** —— 转移一个币种，但允许资产发送者使用不同的资产支付转移费用。两者皆由其多重地点定义

其中需要提供信息输入的函数定义如下：

 - **currencyId/currencies** —— 将通过XCM转移的币种ID。不同runtime有不同的方法定义ID。以基于Moonbeam的网络为例子，`SelfReserve`代表原生Token，`OtherReserve`代表其资产
 - **amount** —— 将通过XCM转移的Token数量
 - **dest** —— 一个多重地点，用于定义将通过XCM转移Token的目标地址。其支持不同地址格式，如20或32字节的地址（以太坊或是Substrate格式）
 - **destWeight** —— 您提供给目标链希望其执行XCM信息的最大执行时间。如果您提供的信息不足，XCM将会执行失败，且资金将会被锁定在主权账户或是特定的pallet中。**设置目标权重非常重要，这是避免XCM失败的重点之一**
 - **asset/assets** —— 一个用于定义将通过XCM转移资产的多重地点。每条平行链将会有不同定义资产的方式。举例而言，基于Moonbeam的网络将会经由其原生Token的pallet余额索引定义
 - **fee** —— 一个用于定义支付XCM在目标链上执行的多重地点
 - **feeItem** —— 一个用于定义多样资产传送地点的索引，将用于支付XCM在目标链上的执行。举例而言，如果仅有一种资产被传送，`feeItem`将会是`0`

唯一由pallet提供的只读函数为`palletVersion`，其提供使用的X-Tokens pallet的版本。

## 使用X-Tokens Pallet构建XCM {: #build-xcm-xtokens-pallet}

此教程将会包含使用X-Tokens构建XCM信息的过程，更详细来说为使用`transfer`和`transferMultiasset`函数。然而，这两种情况仍然可以外推至其他函数，特别是当您熟悉了多重位置的使用之后。

!!! 注意事项
    每条平行链皆能够通过pallet允许/禁止特定函数。因此，开发者需要确认使用的函数是被平行链允许的。相反来说，如果使用了被禁止的函数，交易将会如同`system.CallFiltered`显示一般失败。

## 查看先决条件 {: #xtokens-check-prerequisites}

要在Polikadot.js Apps上传送extrinsics，您需要拥有一个具有[资金](https://docs.moonbeam.network/builders/get-started/networks/moonbase/#get-tokens)的[账户](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts){target=_blank}。

除此之外，您还需要拥有一些`xcUNIT` Token方能跟随此教程，该Token为Alphanet中继链Token `UNIT`的[XC-20](/builders/xcm/xc20/){target=blank}形式。您可以通过在[Moonbeam-Swap](https://moonbeam-swap.netlify.app/#/swap){target=blank}上使用`DEV` Token（Moonbase Alpha上的原生Token）获取一些，其为Moonbase Alpha上的Uniswap-V2版本的示范协议。

![Moonbeam Swap xcUNITs](/images/builders/xcm/xc20/xtokens/xtokens-1.png)

要查看您的`xcUNIT`余额，您可以使用以下地址将XC-20新增至MetaMask：

```
0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
```

你可以查看[XC-20](/builders/xcm/xc20/#calculate-xc20-address){target=_blank}页面以查看如何计算此地址。

### X-Tokens转移函数 {: #xtokens-transfer-function}

在本教程中，您将会构建一个XCM信息，通过X-Tokens pallet的转移函数将Moonbase Alpha的`xcUNIT`转移回其[中继链](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}上。

如果您已经[查看了先决条件](#xtokens-check-prerequisites)，您可以导向至[Polkadot JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}的extrinsic页面并设定以下选项：

1. 选取您希望转移XCM的账户

2. 选取**xTokens** pallet

3. 选取**transfer** extrinsic

4. 设定**OtherReserve**的币种ID，因为您并不是转移DEV Token（*自身储备*）

5. 输入资产ID。在本教程中，`xcUNIT`的资产ID为`42259045809535163221576417993425387648`。您可以在[XC-20地址列表](/builders/xcm/xc20/#current-xc20-assets){target=_blank}查看所有可用的资产ID。

6. 设定要转移的Token数量。在本教程中，您将转移一个`xcUNIT`，但您需要计算`xcUNIT`至其小数点后第12位。要学习XC-20 Token具有多少位数，您可以查看其[元数据](/builders/xcm/xc20/#x-chain-assets-metadata){target=_blank} 

7. 要定义XCM目标的多重地点，您需要在Moonbase Alpha定义一个其在中继链的账户。因此，您需要设定以下参数：

    |   参数   |     数值      |
    | :------: | :-----------: |
    | Version  |      V1       |
    | Parents  |       1       |
    | Interior |      X1       |
    |    X1    |  AccountId32  |
    | Network  |      Any      |
    |    Id    | TargetAccount |
    
8. 将目标权重设置为`1000000000`，请注意在Moonbase Alpha上，每个XCM操作将会需要大概`100000000`权重单位。一个`transfer`包含4个XCM操作，因此目标权重应当设置为`400000000`左右

9. 点击**Submit Transaction**按钮并签署交易

!!! 注意事项
    以上extrinsict配置的编码调用数据为`0x1e00018080778c30c20fa2ebc0ed18d2cbca1f0010a5d4e800000000000000000000000101010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300ca9a3b00000000`，这同样包含一个您需要改变的接收者函数。

![XCM X-Tokens Transfer Extrinsic](/images/builders/xcm/xc20/xtokens/xtokens-2.png)

当交易正在处理中，**TargetAccount**将会获取设定的转移数量并扣取用于在目标链上执行XCM的小额费用。在Polkadot.js Apps，您可以查看[Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer/query/0xf163f304b939bc10b6d6abcd9fd12ea00b6f6cd3f12bb2a32b759b56d2f1a40d){target=blank}以及[中继链](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0x5b997e806303302007c6829ab8e5b166a8aafc6a68f10950cc5aa8c6981ea605){target=blank}的相关extrinsics。

### X-Token转移多种资产函数 {: #xtokens-transfer-multiasset-function}

在本示例中，您将会使用X-Tokens pallet的`transferMultiasset`函数构建XCM信息以将`xcUNIT`从Moonbase Alpha转移回[中继链](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}。

如果您已[查看先决条件](#xtokens-check-prerequisites)，您可以导向至[Polkadot JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}并设定以下选项：

1. 选取您希望传送XCM的账户

2. 选取**xTokens** pallet

3. 选取**transferMultiasset** extrinsic

4. 要定义XCM资产的多重地点，您需要在Moonbase Alpha上定义中继链上的`UNIT`为源头。每条链皆有不同的定义方法。因此，您需要为各个地点设置不同的资产多重地点。在此例而言，中继链Token将会经由下列函数定义：

    |   参数   | 数值 |
    | :------: | :--: |
    | Version  |  V1  |
    | Parents  |  1   |
    | Interior | Here |
    
5. 将资产类别设定为**Fungible**

6. 设定转移的Token数量。在本示例中，您将会传送1个`xcUNIT`，但您需要计算12位小数位

7. 要定义XCM目标点的多重地点，您需要在Moonbase Alpha上定义中继链的账户为源头。因此，您需要设置以下参数：

    |   参数   |     数值      |
    | :------: | :-----------: |
    | Version  |      V1       |
    | Parents  |       1       |
    | Interior |      X1       |
    |    X1    |  AccountId32  |
    | Network  |      Any      |
    |    Id    | TargetAccount |
    
8. 将目标权重设置为`1000000000`，请注意在Moonbase Alpha上，每个XCM操作将会需要大 `100000000`权重单位。一个`transfer`包含4个XCM操作，因此目标权重应当设置为`400000000`左右

9. 点击**Submit Transaction**按钮并签署交易

!!! 注意事项
    以上extrinsict配置的编码调用数据为`0x1e010100010000070010a5d4e80101010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300ca9a3b00000000`，这同样包含一个您需要改变的接收者函数。

![XCM X-Tokens Transfer Extrinsic](/images/builders/xcm/xc20/xtokens/xtokens-3.png)

当交易正在处理中，**TargetAccount**将会获取设定的转移数量并扣取用于在目标链上执行XCM的小额费用。在Polkadot.js Apps，您可以查看[Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer/query/0xf163f304b939bc10b6d6abcd9fd12ea00b6f6cd3f12bb2a32b759b56d2f1a40d){target=blank}以及[中继链](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0x5b997e806303302007c6829ab8e5b166a8aafc6a68f10950cc5aa8c6981ea605){target=blank}的相关extrinsics。

## X-Tokens预编译 {: #xtokens-precompile}

X-Token预编译合约将会允许开发者通过基于Moonbeam网络的以太坊API访问XCM Token转移功能。如同其他[预编译合约](/builders/canonical-contracts/precompiles/)，X-Tokens预编译位于以下地址：

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

### X-Tokens Solidity接口 {: #the-democracy-solidity-interface }

[Xtokens.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank}是一个开发者能够使用以太坊API与X-Tokens pallet交互的接口。

此接口包含以下函数：

 - **transfer**(*address* currency_address, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) —— 用于表示先前提及的`transfer`函数。然而，在使用币种ID之外，您需要提供[XC-20地址](/builders/xcm/xc20/#current-xc20-assets){target=_blank}。多重地点将会以一种特定形式构建，将会在下部分提及
 - **transfer_multiasset**(*Multilocation* *memory* asset, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) —— 用于表示先前提及的`transferMultiasset`函数。所有多重地点将会以一种特定形式构建，将会在下部分提及

### 构建预编译多重地点

在X-Tokens预编译接口中，`Multilocation`架构根据下列函数定义：

```js
 struct Multilocation {
    uint8 parents;
    bytes [] interior;
}
```

请注意每个多重地点皆有`parents`元素，请使用`uint8`和一组字节定义。Parents代表有多少“hops”在通过中继链中您需要执行的传递向上方向。作为`uint8`，您将会看到以下数值：

|   Origin    | Destination | Parents Value |
|:-----------:|:-----------:|:-------------:|
| Parachain A | Parachain A |       0       |
| Parachain A | Relay Chain |       1       |
| Parachain A | Parachain B |       1       |

字节组（`bytes[]`）定义了内部参数以及其在多重地点的内容。阵列的大小则根据以下定义`interior`数值：

|    Array     | Size | Interior Value |
|:------------:|:----:|:--------------:|
|      []      |  0   |      Here      |
|    [XYZ]     |  1   |       X1       |
|  [XYZ, ABC]  |  2   |       X2       |
| [XYZ, ... N] |  N   |       XN       |

假设所有字节阵列包含数据。所有元素的首个字节（2个十六进制数值）与`XN`部分的选择器相关，举例来说：

| Byte Value |    Selector    | Data Type |
|:----------:|:--------------:|-----------|
|    0x00    |   Parachain    | bytes4    |
|    0x01    |  AccountId32   | bytes32   |
|    0x02    | AccountIndex64 | u64       |
|    0x03    |  AccountKey20  | bytes20   |
|    0x04    | PalletInstance | byte      |
|    0x05    |  GeneralIndex  | u128      |
|    0x06    |   GeneralKey   | bytes[]   |

接着，根据选择器及其数据类型，以下字节对应于提供的实际数据。请注意在Polkadot.js Apps示例中出现的`AccountId32`，`AccountIndex64`，以及`AccountKey20`，`network`将会在最后添加。如下所示：

|    Selector    |       Data Value       |        Represents         |
|:--------------:|:----------------------:|:-------------------------:|
|   Parachain    |    "0x00+000007E7"     |     Parachain ID 2023     |
|  AccountId32   | "0x01+AccountId32+00"  | AccountId32, Network Any  |
|  AccountKey20  | "0x03+AccountKey20+00" | AccountKey20, Network Any |
| PalletInstance |       "0x04+03"        |     Pallet Instance 3     |

!!! 注意事项
    `interior`数据通常需要使用引号包含。如果您未遵循此规则，您将会获得`invalid tuple value`错误。

以下代码片段包含`Multilocation`架构的部分示例，因为其将会在X-Token预编译函数中使用：


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

// Multilocation targeting Alice's account on the Relay Chain from Moonbase Alpha
{
    1, // parents = 0
    // Size of array is 1, meaning is an X1 interior
    [
        "0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300" 
        // AccountKey32 Selector + Address in hex + Network = Any
    ]
}
```