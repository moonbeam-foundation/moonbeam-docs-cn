---
title: 通过XCM进行远程执行
description: 通过使用XCM-Transactor pallet，如何在其他链进行远程XCM调用。XCM-Transactor预编译允许通过以太坊API访问核心功能。
---

# 使用XCM-Transactor Pallet进行远程执行

![XCM-transactor Precompile Contracts Banner](/images/builders/xcm/xcm-transactor/xcmtransactor-banner.png)

## 概览 {: #introduction}

XCM信息是由跨共识虚拟机（XCVM）执行的[一系列指令](/builders/xcm/overview/#xcm-instructions){target=_blank}组成。这些指令的组合会产生预先确定的操作，例如跨链Token转移，更有趣的是，远程跨链执行。

然而，从头开始构建XCM信息还是比较困难。此外，XCM信息从根账户（即SUDO或通过民主投票）发送给生态系统中的其他参与者，这对于希望通过简单交易利用远程跨链调用的项目来说并不合适。

要克服这些困难，开发者可以利用wrapper函数/pallet来使用波卡/Kusama上的XCM功能，例如[XCM-transactor pallet](https://github.com/PureStake/moonbeam/blob/master/pallets/xcm-transactor/src/lib.rs){target=_blank}。另外，XCM-transactor pallet允许用户从主权账户衍生出来的账户（称为衍生账户）执行远程跨链调用，从而可通过简单的交易轻松执行。

本教程将向您展示如何使用XCM-transactor pallet在生态系统（中继链/平行链）中从基于Moonbeam的网络发送XCM信息至其他链。此外，您还将学习到如何使用XCM-transactor预编译通过以太坊API执行同样的操作。

**请注意通过XCM信息进行远程执行仍然有一些限制。**

**开发者须知悉，若发送不正确的XCM信息可能会导致资金丢失。**因此，XCM功能需先在测试网上进行测试后才可移至生产环境。

## 相关XCM定义 {: #general-xcm-definitions }

--8<-- 'text/xcm/general-xcm-definitions2.md'

 - **Derivative account** —— 使用简单索引从另一个账户衍生的账户。因为这个账户的私钥是未知的，所以必须使用`utility.asDerivative`方法发起交易。通过衍生账户进行交易时，交易费用由原始账户支付，但交易是从衍生账户发出的。有关更多信息，请参阅实用程序托盘页面的[衍生账户](/builders/pallets-precompiles/pallets/utility/){target=_blank}部分
 - **Transact information** —— 与XCM-transactor extrinsic的XCM远程执行部分相关的额外权重和费用信息。这为必要信息，因为XCM交易费用是由主权账户支付。因此，XCM-transactor计算该费用，并向XCM-transactor extrinsic发送者收取对应[XC-20 token](/builders/xcm/xc20/overview/){target=_blank}的预估费用，以偿还给主权账户

## XCM-Transactor Pallet接口 {: #xcm-transactor-pallet-interface}

### Extrinsics {: #extrinsics }

XCM-transactor pallet提供以下extrinsics（函数）：

 - **deregister**(index) —— 注销给定索引的衍生账户，以防止先前注册的帐户使用衍生地址进行远程执行。该extrinsic只能通过**root**调用，例如，通过民主提案
 - **register**(address, index) —— 以给定索引将给定地址注册为衍生账户。该extrinsic只能通过**root** 调用，例如，通过民主提案
 - **removeTransactInfo**(location) —— 为给定链移除交易信息，定义为multilocation
 - **setTransactInfo**(location, transactExtraWeight, feePerSecond, maxWeight) —— 为给定链设置交易信息，定义为multilocation。交易信息包含：
     - **transactExtraWeight** —— 预计至少比远程XCM指令执行使用的（`WithdrawAsset`、`BuyExecution`和 `Transact`）高出10%以上
     - **feePerSecond** —— 每秒XCM执行的Token单位将向XCM-transactor extrinsic的发送者收取费用
     - **maxWeight** —— 允许远程XCM执行的最大权重单位
 - **transactThroughDerivative**(destination, index, currencyID, destWeight, innerCall) —— 发送XCM信息，包含在给定目标远程执行特定调用的指令（使用`asDerivative`选项包装）。远程调用将通过支付费用的原始平行链主权账户签署，而交易是从给定索引的主权账户的衍生账户发送。XCM-transactor pallet计算远程执行的费用，并向extrinsic的发送者收取资产ID给出的相应[XC-20 token](/builders/xcm/xc20/overview/){target=_blank}的预估费用
 - **transactThroughDerivativeMultilocation**(destination, index, feeLocation, destWeight, innerCall) —— 与`transactThroughDerivative`相同，但通过给定资产的multilocation收取对应[XC-20 token](/builders/xcm/xc20/overview/){target=_blank}的远程执行费用
 - **transactThroughSovereign**(destination, feePayer, feeLocation, destWeight, call, originKind) —— 发送XCM信息，包含在给定目标远程执行特定调用的指令。远程调用将通过支付费用的原始平行链主权账户签署，而交易是从给定起始账户发送。XCM-transactor pallet计算远程执行的费用，并通过资产multilocation向给定账户收取对应[XC-20 token](/builders/xcm/xc20/overview/){target=_blank}的预估费用

其中需要输入的内容如下：

 - **index** —— 用于计算衍生账户的值。就XCM-transactor pallet而言，这是另一条链中平行链主权账户的衍生账户
 - **location** —— 代表生态系统中一条链的multilocation，用于设置或获取交易信息
 - **destination** —— 代表生态系统中一条链的multilocation，XCM信息将发送到该位置
 - **currencyID** —— 用于支付远程调用执行的币种ID。不同的runtime有不同的定义ID的方式。以基于Moonbeam的网络为例，`SelfReserve`指原生Token，`ForeignAsset`指XC-20的资产ID（区别于XC-20地址）
 - **destWeight** —— 您想要在目标链执行发送XCM信息所提供的最大执行时间。若没有提供足够的权重，则XCM执行将失败，资金可能会被锁定在主权账户或特定pallet中。通过衍生账户执行的交易，您还需要考虑`asDerivative` extrinsic，但是XCM-transactor pallet为之前设置交易信息的XCM指令增加了权重。**这对于正确设置目标权重以避免XCM执行失败至关重要**
 - **innerCall** —— 在目标链中执行的调用的编码调用数据。如果通过衍生账户进行交易，这将包装在`asDerivative`选项中
 - **feeLocation** —— 代表用于支付远程调用执行的币种的multilocation
 - **feePayer** —— 通过主权extrinsic在交易中用于支付远程XCM执行的地址。收取对应[XC-20 token](/builders/xcm/xc20/overview/){target=_blank}的费用
 - **call** —— 类似于`innerCall`，但是并没有用`asDerivative` extrinsic包装
 - **originKind** —— 目标链中远程调用的Dispatcher。这里有[四种Dispatcher](https://github.com/paritytech/polkadot/blob/0a34022e31c85001f871bb4067b7d5f5cab91207/xcm/src/v0/mod.rs#L60){target=_blank}可用


### 存储方法 {: #storage-methods }

XCM-transactor pallet包括以下只读存储方式：

 - **destinationAssetFeePerSecond**() - 返回给定资产的每秒用时计算费用。这可以实现从重量到交易费用的转换
 - **indexToAccount**(index) — 返回与给定衍生索引关联的原始链账户
 - **palletVersion**() — 从存储中返回当前pallet版本
 - **transactInfoWithWeightLimit**(location) — 返回给定multilocation的交易信息

### Pallet常量 {: #constants }

XCM-transactor pallet包括以下用于获取pallet常量的只读函数：

- **baseXcmWeigh**() - 返回执行所需的基本XCM重量
- **selfLocation**() - 返回本地的multilocation

## 使用XCM-transactor Pallet构建XCM {: #build-xcm-xcmtransactor-pallet}

本教程包含使用XCM-transactor pallet（尤其是`transactThroughDerivative`函数）为远程执行构建XCM信息的内容。该操作步骤与使用`transactThroughDerivativeMultilocation`函数的步骤相同，但是您需要指定是Token的multilocation，而非currency ID。

!!! 注意事项
    请确保您已在目标链中允许将要远程执行的调用！

### 查看先决条件 {: #xcmtransactor-check-prerequisites}

要在Polkadot.js Apps发送extrinsics，您需要准备以下内容：

 - 拥有[资金](/builders/get-started/networks/moonbase/#get-tokens){target=_blank}的[账户](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts){target=_blank}
 - 您将要通过XCM-transactor pallet发送XCM的账户必须注册在给定索引中，以便能够通过主权账户的衍生账户进行操作。注册是通过根账户（Moonbase Alpha中的SUDO）完成的，所以您可以通过[联系我们](https://discord.gg/PfpUATX){target=_blank}进行注册。在本示例中，Alice的账号注册在索引`42`中
 - 通过XCM-transactor的远程调用需要目标链的Token作为手续费才能执行。因为此操作是在Moonbeam发起，所以您将需要保留Token的[XC-20](/builders/xcm/xc20/){target=_blank}表现形式。在本示例中，您正在发送XCM信息至中继链，因此您将需要`xcUNIT` Token（即Alphanet中继链Token `UNIT`的Moonbase Alpha表现形式）支付执行费用。您可以通过在[Moonbeam-Swap](https://moonbeam-swap.netlify.app){target=_blank}（Moonbase Alpha 上的Uniswap V2演示版本）上兑换DEV Token以获取该Token

![Moonbeam Swap xcUNITs](/images/builders/xcm/xc20/xtokens/xtokens-1.png)

要查看您的`xcUNIT`余额，您需要通过以下地址将XC-20添加至MetaMask。

```
0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
```

如果您对如何计算预编译地址感兴趣，您可以查看以下教程：

- [计算外部XC-20预编译地址](/builders/xcm/xc20/xc20/#calculate-xc20-address){target=_blank}
- [计算可铸造XC-20预编译地址](/builders/xcm/xc20/mintable-xc20/#calculate-xc20-address){target=_blank}

### 通过衍生函数进行XCM-transactor交易 {: #xcmtransactor-transact-through-derivative}

在本示例中，您将构建XCM信息以通过XCM-transactor pallet的`transactThroughDerivative`函数从Moonbase Alpha执行中继链中的远程调用。

如果您已[完成准备工作](#xcmtransactor-check-prerequisites)，导向至[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}的extrinsic页面，执行以下操作：

1. 选择您要发送XCM的账户，确保账户已[完成设置](#xcmtransactor-check-prerequisites)

2. 选择**xcmTransactor** pallet

3. 选择**transactThroughDerivative** extrinsic

4. 将目标链设置为**Relay**，即中继链

5. 输入您注册的衍生账户的索引。在本示例中，索引为`42`。请注意衍生账户取决于索引

6. 将currency ID设置为**ForeignAsset**。因为您转移的是DEV token（*自身储备*）

7. 输入asset ID。在本示例中，`xcUNIT`的资产ID为`42259045809535163221576417993425387648`。您可以在[XC-20地址部分](/builders/xcm/xc20/overview/#current-xc20-assets){target=_blank} 获取所有可用的资产ID

8. 设置目标权重。该数值必须包含`asDerivative` extrinsic。然而，XCM说明的权重已通过XCM-transactor pallet增加。在本示例中，将设置为`1000000000`

9. 输入将在目标链中执行的内部调用。这是pallet、函数和将被调用输入数值的编码调用数据。这可以在Polakdot.js Apps（必须连接至目标链）或使用[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}构建。在本示例中，内部调用为`0x04000030fcfb53304c429689c8f94ead291272333e16d77a2560717f3a7a410be9b208070010a5d4e8`（即在中继链中将1 `UNIT`转移给Alice账户）。您可以在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics/decode){target=_blank}中编码调用。

10. 点击**Submit Transaction**按钮并签署交易

!!! 注意事项
    上述配置的extrinsic的编码调用数据为`0x2103002a00018080778c30c20fa2ebc0ed18d2cbca1f00ca9a3b00000000a404000030fcfb53304c429689c8f94ead291272333e16d77a2560717f3a7a410be9b208070010a5d4e8`。

![XCM-transactor Transact Through Derivative Extrinsic](/images/builders/xcm/xcm-transactor/xcmtransactor-1.png)

当交易完成后，您可以在[Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer/query/0x14cebfb2b4a4c0bf72cb2562344e6803263f45491d2ab14e7b91115ebd52e706){target=_blank}和[中继链](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0x630456e6578d5b414db2e83486a6961ff90dc06bf979988b370dcb0e57550e41){target=_blank}中查看相关extrinsic和事件。请注意，在Moonbase Alpha中，有一个`transactThroughDerivative`相关联的事件，但是有一些`xcUNIT` Token已被销毁以偿还主权账户的交易费用。在中继链中，`paraInherent.enter` extrinsic会显示`balance.Transfer`事件，其中1 `UNIT` Token转移给Alice地址。尽管如此，交易费仍会通过Moonbase Alpha主权账户进行支付。

## 获取注册的衍生索引

要获取所有允许通过基于Moonbeam网络主权账户和其对应索引操作的注册地址列表，导向至[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/chainstate){target=_blank}**Developer**标签下的**Chain State**部分，并执行以下步骤：

1. 在**selected state query**下拉菜单中，选择**xcmTransactor**

2. 选择**indexToAccount**函数

3. （可选）禁用/启用包含选项。这将允许您查询为给定索引授权的地址或请求所有已注册索引的地址

4. 若您启用滑块，输入索引值以查询

5. 点击**+**按钮发送查询

![Check Registered Derivative Indexes](/images/builders/xcm/xcm-transactor/xcmtransactor-2.png)

## XCM-transactor预编译 {: #xcmtransactor-precompile}

XCM-transactor预编译合约允许开发者通过基于Moonbeam网络的以太坊API访问XCM-transactor pallet功能。与其他[预编译合约](/builders/build/canonical-contracts/precompiles/){target=_blank}相似，XCM-transactor预编译位于以下地址：

=== "Moonbeam"
     ```
     {{networks.moonbeam.precompiles.xcm_transactor}}
     ```

=== "Moonriver"
     ```
     {{networks.moonriver.precompiles.xcm_transactor}}
     ```

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.xcm_transactor}}
     ```

### XCM-transactor Solidity接口 {: #xcmtrasactor-solidity-interface }

[XcmTransactor.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/xcm-transactor/XcmTransactor.sol){target=_blank}是一个接口，开发者可以用其通过以太坊API与XCM-transactor pallet进行交互。

此接口包含以下函数：

 - **index_to_account**(*uint16* index) —— 只读函数，返回授权使用给定索引的基于Moonbeam网络主权账户操作的注册地址
  - **transact_info**(*Multilocation* *memory* multilocation) —— 只读函数，对于定义为multilocation的给定链，返回交易信息
    <!-- - **transact_info_with_signed**(*Multilocation* *memory* multilocation) -- read-only function that, for a given chain defined as a multilocation, returns the transact information considering the 3 XCM instructions associated to the external call execution, but also returns extra weight information associated with the `decendOrigin` XCM instruction to execute the remote call  -->
 - **fee_per_second**(*Multilocation* *memory* multilocation) —— 只读函数，对于作为multilocation的给定资产，返回每秒XCM执行的Token单位，作为XCM执行费用收取。这对于给定链有多种资产可以作为手续费进行支付使非常有用
 - **transact_through_derivative**(*uint8* transactor, *uint16* index, *address*  address, *uint64* weight, *bytes* *memory* inner_call) —— 表示[上述示例](#xcmtransactor-transact-through-derivative)中描述的`transactThroughDerivative`方法的函数。您将需要为于支付费用的Token的`address`提供[资产预编译地址](#xcmtransactor-check-prerequisites)，而非currency ID (asset ID)
 - **transact_through_derivative_multilocation**(*uint8* transactor, *uint16* index, *Multilocation* *memory* fee_asset, *uint64* weight, *bytes* *memory* inner_call) —— 表示`transactThroughDerivativeMultilocation`方法的函数。这与`transact_through_derivative`非常相似，但是您需要提供用于支付费用的Token的资产multilocation，而非XC-20 Token `address`

### 构建预编译Multilocation {: #building-the-precompile-multilocation }

在XCM-transactor预编译接口，`Multilocation`结构定义为如下：

--8<-- 'text/xcm/xcm-precompile-multilocation.md'

下面的代码片段介绍了`Multilocation`结构的一些示例，他们需要被输入到XCM-transactor预编译函数中：


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