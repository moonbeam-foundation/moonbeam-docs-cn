---
title: 将XC-20发送至其他链
description: 学习如何使用X-Tokens Pallet将XC-20发送至其他链。另外，X-Tokens预编译允许您通过以太坊API访问核心功能。
---

# 使用X-Tokens Pallet发送XC-20s

![X-Tokens Precompile Contracts Banner](/images/builders/interoperability/xcm/xc20/xtokens/xtokens-banner.png)

## 概览 {: #introduction }

为同质化资产转移构建XCM信息通道并非一件易事。因此，开发者可以通过利用wrapper函数/pallet在Polkadot/Kusama上使用XCM功能。

此类包装器的一个示例是[X-Tokens](https://github.com/open-web3-stack/open-runtime-module-library/tree/master/xtokens){target=_blank} pallet，用于提供通过XCM转移同质化资产的不同方法。

本教程将向您展示如何利用X-Tokens Pallet在生态系统（中继链/平行链）中从基于Moonbeam的网络发送XC-20至其他链。此外，您还将学习到如何使用X-Tokens预编译通过以太坊API执行同样的操作。

**开发者须知若发送不正确的XCM信息可能会导致资金丢失。**因此，XCM功能需先在测试网上进行测试后才可移至生产环境。

## 相关XCM定义 {: #relevant-xcm-definitions }

--8<-- 'text/xcm/general-xcm-definitions.md'
--8<-- 'text/xcm/general-xcm-definitions2.md'

## X-Tokens Pallet接口 {: #x-tokens-pallet-interface }

### Extrinsics {: #extrinsics }

X-Tokens Pallet提供以下extrinsics（函数）：

 - **transfer**(currencyId, amount, dest, destWeight) — 转移一个币种，根据原生Token（自身储备）或是资产ID定义
 - **transferMultiasset**(asset, dest, destWeight) — 转移一种可替代资产，根据其multilocation定义
 - **transferMultiassetWithFee**(asset, fee, dest, destWeight) — 转移一种可替代资产，但其能够让资产的发送者使用另外一种资产支付转移费用。两者皆根据其multilocation定义
 - **transferMultiassets**(assets, feeItem, dest, destWeight) — 转移多种可替代资产，并定义其中哪种资产将会被用于支付转移费用。所有资产皆由其multilocation定义
 - **transferMulticurrencies**(currencies, feeItem, dest, destWeight) — 转移多个币种，并定义其中哪种币种将会被用于支付转移费用。所有币种都将通过原生Token（自身储备）或是资产ID定义
 - **transferWithFee**(currencyId, amount, fee, dest, destWeight) — 转移一个币种，但允许资产发送者使用不同的资产支付转移费用。两者皆由其multilocation定义

其中需要提供信息输入的函数定义如下：

 - **currencyId/currencies** — 将通过XCM转移的币种ID。不同runtime有不同的方法定义ID。以基于Moonbeam的网络为例子，`SelfReserve`代表原生Token，`ForeignAsset`代表其XC-20资产ID（而不是其XC-20地址）
 - **amount** — 将通过XCM转移的Token数量
 - **dest** — 一个multilocation，用于定义将通过XCM转移Token的目标地址。其支持不同地址格式，如20或32字节的地址（以太坊或是Substrate格式）
 - **destWeight** — 一个枚举类型（enum），表示您提供给目标链希望其执行XCM信息的最大执行时间。`Unlimited`选项允许将所有用于gas的资产用于支付权重（weight）。`Limited`选项将gas的使用量限制为特定值。如果您提供的信息不足，XCM将会执行失败，且资金将会被锁定在主权账户或是特定的pallet中。**设置目标权重非常重要，这将避免XCM失败**
 - **asset/assets** — 一个用于定义将通过XCM转移资产的multilocation。每条平行链将会有不同定义资产的方式。举例而言，基于Moonbeam的网络将会经由其原生Token的pallet余额索引定义
 - **fee** — 一个用于定义支付XCM在目标链上执行的multilocation
 - **feeItem** — 一个用于定义多样资产发送地点的索引，将用于支付XCM在目标链上的执行。举例而言，如果仅有一种资产被发送，`feeItem`将会是`0`

### 存储方法 {: #storage-methods }

X-Tokens Pallet包括以下只读存储方式：

- **palletVersion**() - 提供正在使用的X-Tokens Pallet的版本

### Pallet常量 {: #constants }

X-Tokens Pallet包括以下用于获取pallet常量的只读函数：

- **baseXcmWeight**() - 返回执行所需的基本XCM重量
- **selfLocation**() - 返回本地的multilocation

## 使用X-Tokens Pallet构建XCM信息 {: #build-xcm-xtokens-pallet}

此教程将会包含使用X-Tokens Pallet构建XCM信息的过程，更详细来说为使用`transfer`和`transferMultiasset`函数。然而，这两种情况仍然可以外推至其他函数，特别是当您熟悉了多重地点的使用之后。

!!! 注意事项
    每条平行链皆能够通过pallet允许/禁止特定函数。因此，开发者需要确认使用的函数是被平行链允许的。相反来说，如果使用了被禁止的函数，交易将会如同`system.CallFiltered`显示一般失败。

本教程将以转移`xcUNIT` token为例。`xcUNIT`是Alphanet中继链Token `UNIT`的[XC-20](/builders/interoperability/xcm/xc20/overview){target=_blank}形式，也是[外部XC-20](/builders/interoperability/xcm/xc20/xc20){target=_blank}。本教程也同样适用于其他外部XC-20或[可铸造XC-20](/builders/interoperability/xcm/xc20/mintable-xc20){target=_blank}。

### 查看先决条件 {: #xtokens-check-prerequisites}

要在Polikadot.js Apps上发送extrinsics，您需要准备以下内容：

- 一个[已添加至Polkadot.js的账户](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/accounts){target=_blank}，且该账户拥有一些[DEV tokens](/builders/get-started/networks/moonbase/#get-tokens){target=_blank}
- 您要转移资产的资产ID：
    - 对于外部XC-20，您可以从[Polkadot.js Apps的资产ID列表](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=_blank}中获取
    - 对于可铸造XC-20，请查阅[获取可铸造XC-20资产的列表](/builders/interoperability/xcm/xc20/mintable-xc20/#retrieve-list-of-mintable-xc-20s){target=_blank}部分
- 您要转移资产的位数：
    - 对于外部XC-20，请查阅[获取外部XC-20资产的元数据](/builders/interoperability/xcm/xc20/xc20/#x-chain-assets-metadata){target=_blank}部分
    - 对于可铸造XC-20，请查阅[获取可铸造XC-20资产的元数据](/builders/interoperability/xcm/xc20/mintable-xc20/#retrieve-metadata-for-mintable-xc-20s){target=_blank}部分
- 一些`xcUNIT` tokens。您可以在[Moonbeam-Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}上将`DEV` tokens兑换成`xcUNIT`，Moonbeam-Swap是Moonbase Alpha上的Uniswap-V2版本的示范协议。

![Moonbeam Swap xcUNIT](/images/builders/interoperability/xcm/xc20/xtokens/xtokens-1.png)

要查看您的`xcUNIT`余额，您可以使用以下地址将XC-20添加至MetaMask：

```
0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
```

您可以通过以下教程查看如何计算预编译地址：

- [计算外部XC-20预编译地址](/builders/interoperability/xcm/xc20/xc20/#calculate-xc20-address){target=_blank}
- [计算可铸造XC-20预编译地址](/builders/interoperability/xcm/xc20/mintable-xc20/#calculate-xc20-address){target=_blank}

###  X-Tokens转移函数 {: #xtokens-transfer-function}

在本示例中，您将会构建一个XCM信息，通过X-Tokens Pallet的`transfer`函数将`xcUNIT`从Moonbase Alpha转移回其[中继链](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}上。

导航至[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}的extrinsic页面，并设定以下选项（也可以适用于[可铸造XC-20s](/builders/interoperability/xcm/xc20/mintable-xc20/){target=_blank}）：

1. 选取您希望转移XCM的账户
2. 选择**xTokens** pallet
3. 选择**transfer** extrinsic
4. 将外部XC-20的币种ID设置为**ForeignAsset**或将可铸造XC-20的币种ID设置为**LocalAssetReserve**。因为`xcUNIT`是外部XC-20，所以您需要选择**ForeignAsset**
5. 输入资产ID。在本示例中，`xcUNIT`的资产ID为`42259045809535163221576417993425387648`
6. 设置需要转移的Token数量。在本示例中，您将转移1个`xcUNIT`，但您需要注意`xcUNIT`后有12位小数位
7. 定义XCM目标multilocation，您需要将Moonbase Alpha的中继链中的一个账户作为初始点。因此，您需要设置以下参数：

    | 参数 |     数值      |
    |:---------:|:--------------:|
    |  Version  |       V1       |
    |  Parents  |       1        |
    | Interior  |       X1       |
    |    X1     |  AccountId32   |
    |  Network  |      Any       |
    |    Id     | Target Account |

8. 将目标权重设置为`Limited`，并将其值设置为`1000000000`。请注意，在Moonbase Alpha上，每个XCM操作需要大概`100000000`权重单位。一个`transfer`包含4个XCM操作，因此目标权重应当设置为`400000000`左右
9. 点击**Submit Transaction**按钮并签署交易

!!! 注意事项
    以上extrinsic配置的编码调用数据为`0x1e00018080778c30c20fa2ebc0ed18d2cbca1f0010a5d4e800000000000000000000000101010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a0630102286bee`，这同样包含一个您需要改变的接收者函数。

![XCM X-Tokens Transfer Extrinsic](/images/builders/interoperability/xcm/xc20/xtokens/xtokens-2.png)

当交易正在处理中，**TargetAccount**将会获取设定的转移数量并扣除用于在目标链上执行XCM的小额费用。在Polkadot.js Apps，您可以查看[Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/explorer/query/0xf163f304b939bc10b6d6abcd9fd12ea00b6f6cd3f12bb2a32b759b56d2f1a40d){target=_blank}以及[中继链](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0x5b997e806303302007c6829ab8e5b166a8aafc6a68f10950cc5aa8c6981ea605){target=_blank}的相关extrinsics和事件。

### X-Tokens转移多种资产函数 {: #xtokens-transfer-multiasset-function}

在本示例中，您将会构建一个XCM信息，通过X-Tokens Pallet的`transferMultiasset`函数将`xcUNIT`从Moonbase Alpha转移回其[中继链](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}上。

导航至[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}的extrinsic页面，并设定以下选项：

1. 选取您希望转移XCM的账户

2. 选择**xTokens** pallet

3. 选择**transferMultiasset** extrinsic

4. 定义XCM资产multilocation，您需要将Moonbase Alpha的中继链中的`UNIT`作为初始点。每条链皆有不同的定义方法。因此，您需要为各个目标设置不同的资产multilocation。在此例而言，中继链Token将会通过以下函数定义：

    | 参数 | 数值 |
    |:---------:|:-----:|
    |  Version  |  V1   |
    |  Parents  |   1   |
    | Interior  | Here  |

    如果您要将本教程修改成适应可铸造XC-20资产，您需要指定创建资产和资产ID的pallet。因此，您需要设置以下参数：

    |   参数    |     数值      |
    |:--------------:|:--------------:|
    |    Version     |       V1       |
    |    Parents     |       1        |
    |    Interior    |       X2       |
    | PalletInstance |       36       |
    |  GeneralIndex  |    Asset ID    |

5. 将资产类别设置为**Fungible**

6. 设置需要转移的Token数量。在本示例中，您将转移1个`xcUNIT`，但您需要注意`xcUNIT`后有12位小数位

7. 定义XCM目标multilocation，您需要将Moonbase Alpha的中继链中的一个账户作为初始点。因此，您需要设置以下参数：

    | 参数 |     数值      |
    |:---------:|:--------------:|
    |  Version  |       V1       |
    |  Parents  |       1        |
    | Interior  |       X1       |
    |    X1     |  AccountId32   |
    |  Network  |      Any       |
    |    Id     | Target Account |
    
8. 将目标权重设置为`1000000000`。请注意，在Moonbase Alpha上，每个XCM操作需要大概`100000000`权重单位。一个`transferMultiasset`包含4个XCM操作，因此目标权重应当设置为`400000000`左右

9. 点击**Submit Transaction**按钮并签署交易

!!! 注意事项
    以上extrinsic配置的编码调用数据为`0x1e010100010000070010a5d4e80101010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a0630102286bee`，这同样包含一个您需要改变的接收者函数。

![XCM X-Tokens Transfer Extrinsic](/images/builders/interoperability/xcm/xc20/xtokens/xtokens-3.png)

当交易正在处理中，**TargetAccount**将会获取设定的转移数量并扣取用于在目标链上执行XCM的小额费用。在Polkadot.js Apps，您可以查看[Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/explorer/query/0xf163f304b939bc10b6d6abcd9fd12ea00b6f6cd3f12bb2a32b759b56d2f1a40d){target=_blank}以及[中继链](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0x5b997e806303302007c6829ab8e5b166a8aafc6a68f10950cc5aa8c6981ea605){target=_blank}的相关extrinsics和事件。

## X-Tokens预编译 {: #xtokens-precompile}

X-Tokens预编译合约将会允许开发者通过基于Moonbeam网络的以太坊API访问XCM Token转移功能。如同其他[预编译合约](/builders/build/canonical-contracts/precompiles/){target=_blank}，X-Tokens预编译位于以下地址：

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

[Xtokens.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank}是一个开发者能够使用以太坊API与X-Tokens Pallet交互的接口。

此接口包含以下函数：

 - **transfer**(*address* currencyAddress, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) —— 用于表示[先前示例](#xtokens-transfer-function)中提及的`transfer`函数。然而，在使用币种ID之外，您需要为`currencyAddress`提供资产预编译地址：
    - 对于[外部XC-20](/builders/interoperability/xcm/xc20/xc20){target=_blank}，您可以提供[XC-20预编译地址](/builders/interoperability/xcm/xc20/xc20/#current-xc20-assets){target=_blank}
    - 对于[可铸造XC-20](/builders/interoperability/xcm/xc20/mintable-xc20){target=_blank}，您可以遵循[计算预编译地址](/builders/interoperability/xcm/xc20/mintable-xc20/#calculate-xc20-address){target=_blank}的操作说明
    - 对于原生Token（如GLMR、MOVR和DEV），您可以提供[ERC-20预编译](/builders/build/canonical-contracts/precompiles/erc20/#the-erc20-interface){target=_blank}地址，即`{{networks.moonbeam.precompiles.erc20 }}`

    `destination` multilocation将会以一种特殊形式构建（我们将在下一部分提及）

 - **transferMultiasset**(*Multilocation* *memory* asset, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) —— 用于表示[先前示例](#xtokens-transfer-multiasset-function)中提及的`transferMultiasset`函数。两种multilocation将会以一种特殊形式构建（我们将在下一部分提及）

### 构建预编译Multilocation {: #building-the-precompile-multilocation }

在X-Tokens预编译接口中，`Multilocation`架构根据下列函数定义：

--8<-- 'text/xcm/xcm-precompile-multilocation.md'

以下代码片段包含`Multilocation`架构的部分示例，因为其将会在X-Tokens预编译函数中使用：

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

### 使用库与X-Token交互 {: #using-libraries-to-interact-with-xtokens}

当使用库与Ethereum API交互时，Multilocation结构可以像任何其他结构一样格式化。以下代码片段包括前面的[X-Tokens 传输函数](#xtokens-transfer-function)、[X-Tokens 多资产传输函数](#xtokens-transfer-multiasset-function)和示例Multilocation结构示例。您可以在Github上找到[X-Tokens的合约ABI](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-docs/master/.snippets/code/xtokens/abi.js){target=_blank}。

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