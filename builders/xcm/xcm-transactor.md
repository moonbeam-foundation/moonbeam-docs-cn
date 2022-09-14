---
title: 通过XCM进行远程执行
description: 通过使用XCM-Transactor pallet，如何在其他链进行远程XCM调用。XCM-Transactor预编译允许通过以太坊API访问核心功能。
---

# 使用XCM-Transactor Pallet进行远程执行

![XCM-Transactor Precompile Contracts Banner](/images/builders/xcm/xcm-transactor/xcmtransactor-banner.png)

## 概览 {: #introduction}

XCM消息是由跨共识虚拟机（XCVM）执行的[一系列指令](/builders/xcm/overview/#xcm-instructions){target=_blank}组成。这些指令的组合会产生预先确定的操作，例如跨链Token转移，更有趣的是，远程跨链执行。

然而，从头开始构建XCM消息还是比较困难。此外，XCM消息从根账户（即SUDO或通过民主投票）发送给生态系统中的其他参与者，这对于希望通过简单交易实现远程跨链调用的项目来说并不合适。

要克服这些困难，开发者可以利用wrapper函数或pallet来使用波卡或Kusama上的XCM功能，例如[XCM-transactor pallet](https://github.com/PureStake/moonbeam/blob/master/pallets/xcm-transactor/src/lib.rs){target=_blank}。另外，XCM-transactor pallet允许用户从主权账户衍生出来的账户（称为衍生账户）执行远程跨链调用，从而可通过简单的交易轻松执行。

pallet的两个主要extrinsic是通过主权衍生账户或从给定multilocation计算的衍生账户进行交易。每个extrinsic都相应命名。

通过XCM进行远程执行的[相关指令](/builders/xcm/overview/#xcm-instructions)，有但不限于：

 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 在目标链中执行。移除资产并将其放于待使用
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - 在目标链中执行。从持有资产中提取用于支付执行费用。支付的费用取决于目标链
 - [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} - 在目标链中执行。从给定原始链派遣编码的调用数据

当由XCM-transactor pallet创建的XCM消息执行后，必须支付费用。所有的相关信息可以在[XCM费用](/builders/xcm/fees/){target=_blank}页面的[XCM-transactor费用部分](/builders/xcm/fees/#xcm-transactor-fees){target=_blank}找到。

本教程将向您展示如何使用XCM-transactor pallet在生态系统（中继链或平行链）中从基于Moonbeam的网络发送XCM消息至其他链。此外，您还将学习到如何使用XCM-transactor预编译通过以太坊API执行同样的操作。

**请注意，通过XCM消息进行远程执行仍然有一些限制。**

**开发者须知悉，若发送不正确的XCM消息可能会导致资金丢失。**因此，XCM功能需先在测试网上进行测试后才可移至生产环境。

## 相关XCM定义 {: #general-xcm-definitions }

--8<-- 'text/xcm/general-xcm-definitions2.md'

 - **Derivative accounts** — 从另一个账户衍生的账户。衍生账户是无需私钥的（即私钥是未知的），因此，与XCM特定用例相关的衍生账户只能通过XCM extrinsics访问。对于此类应用，账户类型有两种：
     - _**Sovereign-derivative account** — 这会产生一个从目标链中的平行链主权账户衍生的无私钥账户。衍生方法使用`utility.asDerivative` extrinsic用于远程调用。通过此衍生账户交易时，交易费由原账户（在本示例中为主权账户）支付，但是交易从衍生账户派遣。更多信息，请参考Utility Pallet页面的[衍生账户](/builders/pallets-precompiles/pallets/utility/){target=_blank}部分
     - _**Multilocation-derivative account** — 这会生产一个从[Descend Origin](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} XCM指令和提供的mulitlocation设置的新来源衍生的无私钥账户。对于基于Moonbeam的网络，[衍生方法](https://github.com/PureStake/moonbeam/blob/master/primitives/xcm/src/location_conversion.rs#L31-L37){target=_blank}是计算multilocation的`blake2`哈希，包括原始平行链ID并将哈希截断为正确的长度（以太坊格式的账户为20个字节）。`Transact`指令执行时会发生XCM调用[原始转换](https://github.com/paritytech/polkadot/blob/master/xcm/xcm-executor/src/lib.rs#L343){target=_blank}。因此，每个平行链可以使用自己想要的程序转换起点，从而发起交易的用户可能在每条平行链上拥有不同的衍生账户。该衍生账户支付交易费用，并设置为调用的派遣员
 - **Transact information** — 与XCM-transactor extrinsic的XCM远程执行部分的额外权重和费用信息相关。这是必要的，因为XCM交易费用由主权账户进行支付。因此，XCM-transactor计算此费用，并向XCM-transactor extrinsic的发送者收取对应[XC-20 token](/builders/xcm/xc20/overview/){target=_blank}的预估费用来偿还主权账户

## XCM-Transactor Pallet接口 {: #xcm-transactor-pallet-interface}

### Extrinsics {: #extrinsics }

XCM-transactor pallet提供以下extrinsics（函数）：

 - **deregister**(index) — 注销给定索引的衍生账户，以防止先前注册的帐户使用衍生地址进行远程执行。该extrinsic只能通过*root*调用，例如，通过民主提案
 - **register**(address, index) — 以给定索引将给定地址注册为衍生账户。该extrinsic只能通过*root*调用，例如，通过民主提案
 - **removeFeePerSecond**(assetLocation) — 移除其储备链中给定资产的每秒费用信息。资产定义为multilocation
 - **removeTransactInfo**(location) — 移除给定链的交易信息，定义为multilocation
 - **setFeePerSecond**(assetLocation, feePerSecond) — 设置其储备链中给定资产的每秒交易费信息。资产定义为multilocation。`feePerSecond`是每秒XCM执行的Token单位，将会向XCM-transactor extrinsic的发送者收取费用
 - **setTransactInfo**(location, transactExtraWeight, maxWeight) — 设置给定链的交易信息，定义为multilocation。交易信息包含：
     - **transactExtraWeight** — 支付XCM指令执行费用（`WithdrawAsset`、`BuyExecution`和 `Transact`）的权重，预计至少比移除XCM指令执行使用的费用高出10%以上
     - **maxWeight** — 允许远程XCM执行的最大权重单位
     - **transactExtraWeightSigned** — （可选）支付XCM指令执行费用（`DescendOrigin`、`WithdrawAsset`、`BuyExecution`和`Transact`）的权重，预计至少比移除XCM指令执行使用的费用高出10%以上
 - **transactThroughDerivative**(destination, index, fee, innerCall, weightInfo) — 发送XCM消息，包含在给定目标链上远程执行特定调用的指令（使用`asDerivative`选项包装）。远程调的支付费用将通过原始平行链主权账户签署，而交易是从给定索引的主权账户的衍生账户发送。XCM-transactor pallet计算远程执行的费用，并向extrinsic的发送者收取资产ID给出的对应[XC-20 token](/builders/xcm/xc20/overview/){target=_blank}的预估费用
 - **transactThroughSigned**(destination, fee, call, weightInfo) — 发送XCM消息，包含在给定目标链上远程执行特定调用的指令。远程调用将通过目标平行链衍生的新账户签署和执行。对于基于Moonbeam的网络，此账户是继承的multilocation的`blake2`哈希，截断成正确的长度。XCM-transactor pallet计算远程执行的费用，并向extrinsic的发送者收取资产ID给出的对应[XC-20 token](/builders/xcm/xc20/overview/){target=_blank}预估费用
 - **transactThroughSovereign**(destination, feePayer, fee, call, originKind, weightInfo) — 发送XCM消息，包含在给定目标链上远程执行特定调用的指令。程调用将通过支付费用的原始平行链主权账户签署，而交易是从给定起始账户发送。XCM-transactor pallet计算远程执行的费用，并通过资产multilocation向给定账户收取对应[XC-20 token](/builders/xcm/xc20/overview/){target=_blank}的预估费用

其中需要输入的内容如下：

 - **index** — 用于计算衍生账户的值。就XCM-transactor pallet而言，这是另一条链中平行链主权账户的衍生账户
 - **assetLocation** — 代表储备链上资产的multilocation，用于设置或获取每秒交易信息的费用
 - **location** — 代表生态系统中一条链的multilocation，用于设置或获取交易信息
 - **destination** — 代表生态系统中一条链的multilocation，XCM消息将发送到该位置
 - **fee** — 一个枚举（enum），为开发者提供两个关于如何定义XCM执行费用项目的选项。两种选项均依赖于`feeAmount`，即您为执行发送的XCM消息而提供的每秒XCM执行的资产单位。设置费用项目的两种不同方式如下：
     - **AsCurrencyID** — 用于支付远程调用执行的币种ID。不同的runtime有不同的定义ID的方式。以基于Moonbeam网络为例，`SelfReserve`指原生Token，`ForeignAsset`指XC-20资产ID（区别于XC-20地址）
     - **AsMultiLocation** — 代表用于执行XCM时支付费用的资产multilocation
 - **innerCall** — 在目标链中执行的调用的编码调用数据。如果通过主权衍生账户进行交易，这将包装在`asDerivative`选项中
 - **weightInfo** — 包含所有权重相关信息的结构。若没有提供足够的权重，则XCM执行将失败，资金可能会被锁定在主权账户或特定pallet中。因此，**正确设置目标权重以避免XCM执行失败至关重要**。结构包含以下两种字段：
     - **transactRequiredWeightAtMost** — 与`Transact`调用本身执行相关的权重。对于通过主权衍生的交易，您也需要考虑`asDerivative` extrinsic的权重。但是，这不会包含在所有XCM指令的成本（权重）当中
     - **overallWeight** — XCM-transactor extrinsic可以使用的所有权重。这包含所有XCM指令以及调用本身(**transactRequiredWeightAtMost**)的权重
 - **call** — 类似于`innerCall`，但是并没有用`asDerivative` extrinsic包装
 - **feePayer** — 将通过主权账户支付远程XCM执行交易费用的地址。费用将根据对应的[XC-20 token](/builders/xcm/xc20/overview/){target=_blank}收取
 - **originKind** — 在目标链中远程调用的派遣者。目前有[四种派遣者类型](https://github.com/paritytech/polkadot/blob/0a34022e31c85001f871bb4067b7d5f5cab91207/xcm/src/v0/mod.rs#L60){target=_blank}可使用

### 存储方法 {: #storage-methods }

XCM-transactor pallet包含以下只读存储方法：

 - **destinationAssetFeePerSecond**() — 返回给定multilocation资产的每秒费用。这能够将权重转换成费用。如果`feeAmount`设置为`None`，pallet extrinsicts将读取存储元素
 - **indexToAccount**(index) — 返回与给定衍生索引关联的原始链账户
 - **palletVersion**() — 从存储库返回当前pallet的版本
 - **transactInfoWithWeightLimit**(location) — 返回给定multilocation的交易信息。如果`feeAmount`设置为`None`，pallet extrinsicts将读取存储元素

### Pallet常量 {: #constants }

XCM-transactor pallet包含以下只读函数以获取pallet常量：

- **baseXcmWeight**() — 返回每个XCM指令执行所需的基本XCM权重
- **selfLocation**() — 返回链的multilocation

## 通过衍生函数进行XCM-Transactor交易 {: #xcmtransactor-transact-through-derivative}

此部分包含使用`transactThroughDerivative`函数通过XCM-transactor pallet为远程执行构建XCM消息。

!!! 注意事项
    请确保您已在目标链中允许将要远程执行的调用！

### 查看先决条件 {: #xcmtransactor-derivative-check-prerequisites}

要在Polkadot.js Apps发送extrinsics，您需要准备以下内容：

 - 拥有[资金](/builders/get-started/networks/moonbase/#get-tokens){target=_blank}的[账户](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts){target=_blank}
 - 您将要通过XCM-transactor pallet发送XCM的账户必须注册在给定索引中，以便能够通过主权账户的衍生账户进行操作。注册是通过根账户（Moonbase Alpha中的SUDO）完成的，所以您可以通过[联系我们](https://discord.gg/PfpUATX){target=_blank}进行注册。在本示例中，Alice的账号注册在索引`42`中
 - 通过XCM-transactor的远程调用需要目标链的Token作为手续费才能执行。因为此操作是在Moonbeam发起，所以您将需要保留Token的[XC-20](/builders/xcm/xc20/){target=_blank}表现形式。在本示例中，您正在发送XCM消息至中继链，因此您将需要`xcUNIT` Token（即Alphanet中继链Token `UNIT`的Moonbase Alpha表现形式）支付执行费用。您可以通过在[Moonbeam-Swap](https://moonbeam-swap.netlify.app){target=_blank}（Moonbase Alpha 上的Uniswap V2演示版本）上兑换DEV Token以获取该Token

![Moonbeam Swap xcUNITs](/images/builders/xcm/xc20/xtokens/xtokens-1.png)

要查看您的`xcUNIT`余额，您需要通过以下地址将XC-20添加至MetaMask。

```
0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
```

如果您对如何计算预编译地址感兴趣，您可以查看以下教程：

- [计算外部XC-20预编译地址](/builders/xcm/xc20/xc20/#calculate-xc20-address){target=_blank}
- [计算可铸造XC-20预编译地址](/builders/xcm/xc20/mintable-xc20/#calculate-xc20-address){target=_blank}


### 构建XCM {: #xcm-transact-through-derivative}

如果您已[完成准备工作](#xcmtransactor-derivative-check-prerequisites)，导向至[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}的extrinsic页面，执行以下操作：

1. 选择您要发送XCM的账户，确保账户已[完成所有设置](#xcmtransactor-derivative-check-prerequisites)

2. 选择**xcmTransactor** pallet

3. 选择**transactThroughDerivative** extrinsic

4. 将目标链设置为**Relay**，即中继链

5. 输入您注册的衍生账户的索引。在本示例中，索引为`42`。请注意衍生账户取决于索引

6. 设置**fee**类型。在本示例中，设置为**AsCurrencyId**

7. 将currency ID设置为**ForeignAsset**。因为您转移的不是DEV token（*自身储备*），而是与XC-20资产交互

8. 输入asset ID。在本示例中，`xcUNIT`的资产ID为`42259045809535163221576417993425387648`。您可以在[XC-20地址部分](/builders/xcm/xc20/overview/#current-xc20-assets){target=_blank}获取所有可用的资产ID

9. （可选）设置**feeAmount**。这是所选费用Token（XC-20）的每秒单位，将被销毁以释放目标链上主权账户中的相应余额。在本示例中，将每秒单位设置为`13764626000000` 。若您未提供此数值，pallet将使用存储库中的元素（若有）

10. 输入将在目标链中执行的内部调用。这是pallet、方法和将被调用输入数值的编码调用数据。这可以在Polakdot.js Apps（必须连接至目标链）或使用[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}构建。在本示例中，内部调用为`0x04000030fcfb53304c429689c8f94ead291272333e16d77a2560717f3a7a410be9b208070010a5d4e8`（即在中继链中将1 `UNIT`转移给Alice账户）。您可以在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics/decode){target=_blank}中编码调用

11. 设置**weightInfo**结构的**transactRequiredWeightAtMost**权重值。该数值必须包含`asDerivative` extrinsic。但是这不会包含XCM指令的权重。在本示例中，可以将权重设置为`1000000000`

12. （可选）设置**weightInfo**结构的**overallWeight**权重值。该数值必须包括全部的**transactRequiredWeightAtMost**和需要在目标链中支付XCM指令执行费用的权重。若您未提供此数值，pallet将使用存储库中的元素（若有），并将其添加至**transactRequiredWeightAtMost**。在本示例中，可以将权重设置为`2000000000`

13. 点击**Submit Transaction**按钮并签署交易

!!! 注意事项
    上述配置的extrinsic的编码调用数据为
 `0x2102002a0000018080778c30c20fa2ebc0ed18d2cbca1f0180a8a4d3840c00000000000000000000a404000030fcfb53304c429689c8f94ead291272333e16d77a2560717f3a7a410be9b208070010a5d4e800ca9a3b00000000010094357700000000`。

![XCM-Transactor Transact Through Derivative Extrinsic](/images/builders/xcm/xcm-transactor/xcmtransactor-1.png)

当交易完成后，您可以在[Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer/query/0xa90b23a54f2bb691ba2f04ae3228b1de2d2e7231b98490bf6f94e491baf09185){target=_blank}和[中继链](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0xb5a0ecc0c2f7f1363ede2e3aebab2702dd2e7b9036a6ba23a694db2b4002cd7f){target=_blank}中查看相关extrinsic和事件。请注意，在Moonbase Alpha中，有一个`transactThroughDerivative`方法相关联的事件，但是有一些`xcUNIT` Token已被销毁以偿还主权账户的交易费用。在中继链中，`paraInherent.enter` extrinsic会显示`balance.Transfer`事件，其中1 `UNIT` Token转移给Alice地址。尽管如此，交易费仍会通过Moonbase Alpha主权账户进行支付。

!!! 注意事项

`AssetsTrapped`事件在中继链上时因为XCM-transactor pallet尚不支持处理还款功能。因此，高出预估权重将会在目标链执行XCM时导致资产无法退回。

### 获取已注册的衍生索引

要获取所有基于Moonbeam网络主权账户和其对应索引操作的注册地址列表，导向至[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/chainstate){target=_blank}**Developer**标签下的**Chain State**部分，并执行以下步骤：

1. 在**selected state query**下拉菜单中，选择**xcmTransactor**

2. 选择**indexToAccount**方法

3. （可选）禁用/启用包含选项。这将允许您查询为给定索引授权的地址或请求所有已注册索引的地址

4. 若您已启用滑块，输入索引值以查询

5. 点击**+**按钮发送查询

![Check Registered Derivative Indexes](/images/builders/xcm/xcm-transactor/xcmtransactor-2.png)


## 通过签署函数进行XCM-Transactor交易 {: #xcmtransactor-transact-through-signed}

此部分包含使用`transactThroughSigned`函数通过XCM-transactor pallet为远程执行构建XCM消息。但是，由于目标平行链暂未公开，您将无法跟进。

!!! 注意事项

​    请确保您已在目标链中允许将要远程执行的调用！

### 查看先决条件 {: #xcmtransactor-signed-check-prerequisites} 

要在Polkadot.js Apps发送extrinsics，您需要准备以下内容：

 - 在原始链上的[账户](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts){target=_blank}拥有一定[资金](/builders/get-started/networks/moonbase/#get-tokens){target=_blank}
 - 资金所在的目标链上的multilocation衍生账户。您可以通过使用 [`calculateMultilocationDerivative.ts`脚本](https://github.com/albertov19/xcmTools/blob/main/calculateMultilocationDerivative.ts){target=_blank}计算该地址

在本示例中，使用的账户如下：

 - Alice在原始平行链中的地址为`0x44236223aB4291b93EEd10E4B511B37a398DEE55`
 - 在目标平行链中的multilocation衍生账户地址为`0x5c27c4bb7047083420eddff9cddac4a0a120b45c`2

### 构建XCM {: #xcm-transact-through-derivative}

如果您已[完成准备工作](#xcmtransactor-signed-check-prerequisites)，导向至[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}的extrinsic页面，执行以下操作：

1. 选择您要发送XCM的账户，确保账户已[完成所有设置](#xcmtransactor-signed-check-prerequisites)

2. 选择**xcmTransactor** pallet

3. 选择**transactThroughSigned** extrinsic

4. 定义目标multilocation。在本示例中，设置如下：

    | Parameter |    Value    |
    |:---------:|:-----------:|
    |  Version  |     V1      |
    |  Parents  |      1      |
    | Interior  |     X1      |
    |    X1     |  Parachain  |
    | Parachain | ParachainID |
    
5. 设置**fee**类型。在本示例中，设置为**AsCurrencyId** 

6. 将currency ID设置为**ForeignAsset**。请注意，该Token将从multilocation衍生账户提现来支付XCM执行费用。在这种情况下，将使用目标链的原生储备Token，但也可以是其他任何能够作为XCM执行支付费用的Token

7. 输入asset ID。在本示例中，XC-20 Token的资产ID为`35487752324713722007834302681851459189`。您可以在Polkadot.js Apps的[资产部分](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/assets){target=_blank}查看所有可用的资产ID

8. （可选）设置**feeAmount**。这是所选费用Token（XC-20）的每秒单位，将从multilocation衍生账户提取以支付XCM执行费用。在本示例中将每秒单位设置为`50000000000000000`。若您未提供此数值，pallet将使用存储库中的元素（若有）。请注意，存储中的元素可能不是最新的

9. 输入将在目标链中执行的内部调用。这是pallet、方法和将被调用输入数值的编码调用数据。这可以在Polakdot.js Apps（必须连接至目标链）或使用[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}构建。在本示例中，内部调用为`0x030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d`（即将1 Token从目标链转移给Alice账户）

10. 设置**weightInfo**结构的**transactRequiredWeightAtMost**权重值。该数值不包含XCM指令的权重。在本示例中，可以将权重设置为`1000000000`

11.  （可选）设置**weightInfo**结构的**overallWeight**权重值。该数值必须包括所有**transactRequiredWeightAtMost**和需要在目标链中支付XCM指令执行费用的权重。若您未提供此数值，pallet将使用存储库中的元素（若有），并将其添加至**transactRequiredWeightAtMost**。在本示例中，可以将权重设置`2000000000`

12.  点击**Submit Transaction**按钮并签署交易

!!! 注意事项
    上述配置的extrinsic的编码调用数据为`0x210601010100e10d00017576e5e612ff054915d426c546b1b21a010000c52ebca2b10000000000000000007c030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d00ca9a3b00000000010094357700000000`.

![XCM-Transactor Transact Through Signed Extrinsic](/images/builders/xcm/xcm-transactor/xcmtransactor-3.png)

当交易完成后，Alice应当在目标链上的地址收到1 Token。

## XCM-Transactor预编译 {: #xcmtransactor-precompile}

XCM-transactor预编译合约允许开发者通过基于Moonbeam网络的以太坊API访问XCM-transactor pallet功能。与其他[预编译合约](builders/pallets-precompiles/precompiles/){target=_blank}相似，XCM-transactor预编译位于以下地址：

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.xcm_transactor}}
     ```

XCM-transactor旧版预编译仍可在所有基于Moonbeam网络中使用。但是，**旧版本将在不久的将来被弃用**，因此所有实现都必须迁移到较新的接口。 XCM-transactor旧版预编译位于以下地址：

=== "Moonbeam"
     ```
     {{networks.moonbeam.precompiles.xcm_transactor_legacy}}
     ```

=== "Moonriver"
     ```
     {{networks.moonriver.precompiles.xcm_transactor_legacy}}
     ```

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.xcm_transactor_legacy}}
     ```

### XCM-Transactor Solidity接口 {: #xcmtrasactor-solidity-interface } 

[XcmTransactor.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/xcm-transactor/src/v2/XcmTransactorV2.sol){target=_blank}是一个接口，开发者可以用其通过以太坊API与XCM-transactor pallet进行交互。

!!! 注意事项

​    XCM-transactor预编译的[旧版本](https://github.com/PureStake/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=_blank}将在不久的将来被弃用，因此所有实现都必须迁移到较新的接口。

此接口包含以下函数：

 - **indexToAccount**(*uint16* index) — 只读函数，返回授权使用给定索引的基于Moonbeam网络主权账户操作的注册地址
  - **transactInfoWithSigned**(*Multilocation* *memory* multilocation) — 只读函数，对于定义为multilocation的给定链，返回考虑与外部调用执行（`transactExtraWeight`）关联的3个XCM指令的交易消息。这也将返回通过签署extrinsic（`transactExtraWeightSigned`）交易的`descendOrigin` XCM指令关联的额外权重信息
 - **feePerSecond**(*Multilocation* *memory* multilocation) — 只读函数，对于作为multilocation的给定资产，返回每秒XCM执行的Token单位，其作为XCM执行费用收取。这对于给定链有多种资产可以作为手续费进行支付使非常有用
 - **transactThroughDerivativeMultilocation**(*uint8* transactor, *uint16* index, *Multilocation* *memory* feeAsset, *uint64* transactRequiredWeightAtMost, *bytes* *memory* inner_call, *uint256* feeAmount, *uint64* overallWeight) — 表示[上述示例](#xcmtransactor-transact-through-derivative)中描述的`transactThroughDerivative`方法的函数，将**fee**类型设置为**AsMultiLocation**。您需要提供Token的资产multilocation来支付费用，而不是XC-20 Token `address`
 - **transactThroughDerivative**(*uint8* transactor, *uint16* index, *address* currencyId, *uint64* transactRequiredWeightAtMost, *bytes* *memory* inner_call, *uint256* feeAmount, *uint64* overallWeight) — 表示[上述示例](#xcmtransactor-transact-through-derivative)中描述的`transactThroughDerivative`方法的函数，将**fee**类型设置为**AsCurrencyId**。您将需要提供用于支付费用的Token的[资产XC-20地址](/builders/xcm/xc20/overview/#current-xc20-assets){target=_blank}，而不是资产ID
 - **transactThroughSignedMultilocation**(*Multilocation* *memory* dest, *Multilocation* *memory* fee_location, *uint64* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *uint64* overallWeight) — 表示[上述示例](#xcmtransactor-transact-through-signed)中描述的`transactThroughSigned`方法的函数，将**fee**类型设置为**AsMultiLocation**。您需要提供Token的资产multilocation来支付费用，而不是XC-20 Token `address`
 - **transactThroughSigned**(*Multilocation* *memory* dest, *address* fee_location_address, *uint64* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *uint64* overallWeight) — 表示[上述示例](#xcmtransactor-transact-through-signed)中描述的`transactThroughSigned`方法的函数，将**fee**类型设置为**AsCurrencyId**。您将需要提供用于支付费用的Token的[资产XC-20地址](/builders/xcm/xc20/overview/#current-xc20-assets){target=_blank}，而不是资产ID

### 构建预编译Multilocation {: #building-the-precompile-multilocation }

在XCM-transactor预编译接口中，`Multilocation`结构定义为如下：

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