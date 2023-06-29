---
title: 发送&执行XCM消息
description: 学习如何通过组合和试验不同的XCM指令来构建自定义XCM消息并在Moonbeam上本地执行以查看结果。
---

# 发送和执行XCM消息

![Custom XCM Messages Banner](/images/builders/interoperability/xcm/send-execute-xcm/send-execute-xcm-banner.png)

## 概览 {: #introduction }

XCM消息由[一系列的指令](/builders/interoperability/xcm/overview/#xcm-instructions){target=_blank}组成，由跨共识虚拟机（XCVM）执行。这些指令的组合会执行预定的操作，例如跨链Token转移。您可以通过组合各种XCM指令创建自定义XCM消息。

[**X-Tokens**](/builders/interoperability/xcm/xc20/xtokens){target=_blank}和[**XCM-Transactor**](/builders/interoperability/xcm/xcm-transactor/){target=_blank}等Pallet提供带有一组预定义的XCM指令的函数，用于发送[XC-20s](/builders/interoperability/xcm/xc20/overview/){target=_blank}或通过XCM在其他链上远程执行。然而，要更好地了解组合不同XCM指令的结果，您可以在Moonbeam上本地构建和执行自定义XCM消息。你也可以发送自定义XCM消息至其他链（这将以[`DecendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank}指令开始）。但是，要成功执行XCM消息，目标链需要理解这些指令。

要执行或发送自定义XCM消息，你可以直接使用[Polkadot XCM Pallet](#polkadot-xcm-pallet-interface)或者尝试通过带有[XCM-Utilities预编译](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}的以太坊API。在本教程中，您将学习如何使用这两种方式在Moonbase Alpha上本地执行和发送自定义的XCM消息。

本教程假设您已熟悉XCM基本概念，例如[基本的XCM专业术语](/builders/interoperability/xcm/overview/#general-xcm-definitions){target=_blank}和[XCM指令](/builders/interoperability/xcm/overview/#xcm-instructions){target=_blank}。您可以访问[XCM概览](/builders/interoperability/xcm/overview){target=_blank}文档获取更多信息。

## Polkadot XCM Pallet接口 {: #polkadot-xcm-pallet-interface }

### Extrinsics {: #extrinsics }

Polkadot XCM Pallet包含以下相关extrinsics（函数）：

 - **execute**(message, maxWeight) - **仅支持Moonbase Alpha** - 给定SCALE编码的XCM版本化的XCM消息和要消耗的最大权重，执行自定义XCM消息
 - **send**(dest, message) - **仅支持Moonbase Alpha** - 给定要发送消息的目标链的multilocation和要发送的SCALE编码的XCM版本化的XCM消息，发送自定义消息。要成功执行XCM消息，目标链需要理解消息中的指令

### 存储函数 {: #storage-methods }

Polkadot XCM Pallet包含以下相关只读存储函数：

- **assetTraps**(Option<H256>) - 给定`MultiAssets`对的Blake2-256哈希，返回中断资产的现有次数。如果哈希出现omitted的错误，则返回所有中断资产
- **palletVersion**() - 提供正在使用的Polkadot XCM Pallet的版本

## 查看先决条件 {: #checking-prerequisites }

开始操作本教程之前，请先准备以下内容：

- 您的账户必须拥有一些DEV Token
  --8<-- 'text/faucet/faucet-list-item.md'
- 如果按照Polkadot.js Apps的说明进行操作，您需要一个[接入Polkadot.js Apps接口的账户](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/accounts){target=_blank}

## 本地执行XCM消息 {: #execute-an-xcm-message-locally }

这一部分涵盖了通过两种不同的方法来构建要在本地（即在Moonbeam中）执行的自定义XCM消息：Polkadot XCM Pallet的`execute`函数和[XCM-Utilities预编译](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}的`xcmExecute`函数。此功能为您提供了试验不同的XCM指令并直接查看这些试验结果的平台。这也有助于确定与Moonbeam上给定XCM消息相关联的[费用](/builders/interoperability/xcm/fees){target=_blank}。

在以下示例中，您将在Moonbase Alpha上从一个账户转移DEV Token至另一个账户。为此，您需要构建一个XCM消息以包含以下XCM指令，这些指令将在本地执行（在本示例中为Moonbase Alpha）：

 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 移除资产并将其放入暂存处
 - [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - 将资产从暂存处取出并存入等值资产至接收方账户中

!!! 注意事项
    通常情况下，当您发送XCM消息跨链至目标链时，需要用到[`BuyExecution`指令](https://github.com/paritytech/xcm-format#buyexecution){target=_blank}用于支付远程执行。但是，对于本地执行，此指令非必要，因为您已通过extrinsic调用支付费用。

### 使用Polkadot.js Apps执行XCM消息 {: #execute-an-xcm-message-with-polkadotjs-apps }

在本示例中，您将使用Polkadot.js Apps在Moonbase Alpha上本地执行自定义XCM消息，以直接与Polkadot XCM Pallet交互。

开始操作之前，请先前往[Polkadot.js Apps的**Extrinsics**页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}并执行以下步骤：

1. 选择要发送XCM的账户。在本示例中，Alice为发送方

2. 选择**polkadotXcm** pallet并选择**execute** extrinsic

3. 将消息版本设置为**V2**

4. 点击**Add item**按钮两次以添加**WithdrawAsset**和**DepositAsset**指令

5. 将第一个指令设置为**WithdrawAsset**。点击指令名称下方的**Add item**按钮并输入资产的multilocation、资产类型和提现金额。因为本示例涵盖了如何在Moonbase Alpha上将DEV Token从一个账户发送到另一个账户，**WithdrawAsset**指令将定义Moonbase Alpha提现的DEV Token数量。你可以使用以下值，提取0.1 DEV Token：

    |      参数      |         值         |
    | :------------: | :----------------: |
    |       ID       |      Concrete      |
    |    Parents     |         0          |
    |    Interior    |         X1         |
    |       X1       |   PalletInstance   |
    | PalletInstance |         3          |
    |      Fun       |      Fungible      |
    |    Fungible    | 100000000000000000 |
    
6. 将第二个指令设置为**DepositAsset**指令，并输入以下值以在Moonbase Alpha上存入DEV Token至接收方账户，在本示例中为Bob：

    |   参数    |         值         |
| :-------: | :----------------: |
    |  Assets   |        Wild        |
    |   Wild    |        All         |
    | MaxAssets |         1          |
    |  Parents  |         0          |
    | Interior  |         X1         |
    |    X1     |    AccountKey20    |
    |  Network  |        Any         |
    |    Key    | Bob's H160 Address |
    
    **Assets = Wild**、**Wild = All**和**MaxAssets = 1**的配置将仅从暂存处取出一项资产并存入指定账户

7. 设置**maxWeight**，用于定义XCM执行允许的最大权重单位。在本示例中，您可以输入`1000000000`。任何多余的费用将退还您的账户

8. 点击**Submit Transaction**并签署交易

!!! 注意事项
    上述配置的extrinsic编码的调用数据为`0x1c03020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e000ca9a3b00000000`。

![Call the execute function of the Polkadot XCM Pallet via Polkadot.js Apps.](/images/builders/interoperability/xcm/send-execute-xcm/send-execute-xcm-1.png)

交易处理后，0.1 DEV Token和相关联的XCM费用从Alice的账户提取，Bob将在其账户收到0.1 DEV Token。`polkadotXcm.Attempted`事件将与结果一同发出。

![Review the transaction details using Polkadot.js Apps.](/images/builders/interoperability/xcm/send-execute-xcm/send-execute-xcm-2.png)

### 使用XCM-Utils预编译执行XCM交易 {: #execute-xcm-utils-precompile }

在这一部分，您将使用[XCM Utilities预编译](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}的`xcmExecute`函数（该函数仅支持Moonbase Alpha）以本地执行XCM消息。XCM Utilities预编译位于以下地址：

```
{{ networks.moonbase.precompiles.xcm_utils }}
```

在Hood下，XCM Utilities预编译的`xcmExecute`函数调用Polkadot XCM Pallet的`execute`函数，即用Rust编码的Substrate pallet。使用XCM Utilities预编译调用`xcmExecute`的好处是您可以通过以太坊API完成此操作并使用[Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}等以太坊库。

`xcmExecute`函数接受两个参数：要执行SCALE编码的版本化XCM消息和要消耗的最大权重。

要本地执行XCM消息，请执行以下步骤：

1. 构建SCALE编码的调用数据。您可以通过[上一部分](#execute-an-xcm-message-with-polkadotjs-apps)的操作获取编码的调用数据，或者你可以通过[Polkadot.js API](/build/substrate-api/polkadot-js-api/){target=_blank}以编程方式计算相同的调用数据

2. 使用以太坊库和XCM Utilities预编译发送带有编码调用数据的XCM消息

要以编程方式获取SCALE编码的调用数据，您可以使用以下脚本：

```js
--8<-- 'code/polkadotXcm/xcmExecute/encodedCalldata.js'
```

然后，执行以下步骤：

1. 为调用提供输入数据，包括：

    - Moonbase Alpha端点URL，用于创建提供者
    - 在Moonbase Alpha上的DEV Token的multilocation
    - 要从账户中提取的Token数量（以Wei为单位）。在本示例中，0.1 Token已足够。您可以通过XCM费用页面获取此值
    - `xcmExecute`函数的最大权重参数
    - DEV Token的接收方地址，在本示例中为Bob的地址
    
2. 构建第一个XCM指令`WithdrawAsset`。您需要提供资产的multilocation和您要提现的数量。这两个变量可在上方找到

3. 构建第二个XCM指令`DepositAsset`。在之前执行的操作之后剩余部分（在这种情况下，为DEV Token）都会存入Bob的地址，该地址为接收方。要存入的资产设置为**Assets = Wild**、**Wild = All**和**MaxAssets = 1**

4. 通过连接V2数组中的指令将XCM消息放在一起

5. 创建Polkadot.js API提供者

6. 使用XCM消息和最大权重创建`polkadotXcm.execute` extrinsic

7. 获取SCALE编码的调用数据

你可以使用`node`运行脚本，结果将记录到控制台。结果应与[上一部分](#execute-an-xcm-message-with-polkadotjs-apps)的编码调用数据一致：

```
0x1c03020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e000ca9a3b00000000
```

在使用编码的调用数据之前，您需要删除一些与XCM消息不对应的十六进制字符，例如`polkadotXcm.execute`函数的调用索引（即前4个字符）和最大权重（即最后16个字符）：

```
call index:  1c03
XCM message: 020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e0
max weight:  00ca9a3b00000000
```

因此，在本示例中，单独的XCM消息的编码调用数据为：

```
0x020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e0
```

现在，您已拥有SCALE编码的XCM消息，您可以使用以下代码片段通过您选择的以太坊库以编程方式调用XCM-Utilities预编译的`xcmExecute`函数：

!!! 请注意
    以下代码片段仅用于演示目的，请勿将您的私钥存储至JavaScript或Python文件中。

=== "Ethers.js"
    ```js
    --8<-- 'code/polkadotXcm/xcmExecute/ethers.js'
    ```

=== "Web3.js"
    ```js
    --8<-- 'code/polkadotXcm/xcmExecute/web3.js'
    ```

=== "Web3.py"
    ```py
    --8<-- 'code/polkadotXcm/xcmExecute/web3.py'
    ```

这样就可以了！您已成功使用Polkadot XCM Pallet和XCM-Utilities预编译在Moonbase Alpha上本地执行自定义XCM消息。

## 跨链发送XCM消息 {: #send-xcm-message }

这一部分涵盖了通过两种不同的方法来跨链发送自定义XCM消息（即从Moonbeam到目标链，如中继链）：Polkadot XCM Pallet的`send`函数和[XCM-Utilities预编译](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}的`xcmSend`函数。

要成功执行XCM消息，目标链需要理解消息中的指令。相反，您将在目标链上看到`Barrier`过滤器。为保证安全，XCM消息前会加上[`DecendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank}指令以防止XCM代表源链的主权账户执行操作。

在以下示例中，您将构建一个包含以下XCM指令的XCM消息，这些指令将在Alphanet中继链中执行：

 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 移除资产并将其放入暂存处
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - 从暂存处获取资产以支付执行费用。支付的费用由目标链决定
 - [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - 将资产从暂存处取出并存入等值资产至接收方账户中

这些指令的目的是将中继链的原生资产（即Alphanet中继链的UNIT）从Moonbase Alpha转移到中继链上的一个账户。此示例仅用于演示目的，以演示如何跨链发送自定义XCM消息。 请记住，目标链需要理解消息中的指令才可执行。

### 使用Polkadot.js Apps发送XCM消息 {: #send-xcm-message-with-polkadotjs-apps }

在本示例中，您将使用Polkadot.js Apps在Moonbase Alpha上本地执行自定义XCM消息，以直接与Polkadot XCM Pallet交互。

开始操作之前，请先前往[Polkadot.js Apps的**Extrinsics**页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}并执行以下步骤：

1. 选择要发送XCM的账户。在本示例中，Alice为发送方

2. 选择**polkadotXcm** pallet并选择**send** extrinsic

3. 将目标链的multilocation版本设置为**V1**

4. 输入multilocation。在本示例中，中继链Token可定义为：

    |   参数   |  值  |
    | :------: | :--: |
    | Parents  |  1   |
    | Interior | Here |
    
5. 将消息版本设置为**V2**

6. 点击**Add item**按钮三次以添加**WithdrawAsset**、**BuyExecution**和**DepositAsset**指令

7. 将第一个指令设置为**WithdrawAsset**。点击指令名称下方的**Add item**按钮并输入资产的multilocation、资产类型和提现金额。在本示例中，你可以使用以下值，提取1 UNIT Token：

    |   参数   |      值       |
    | :------: | :-----------: |
    |    ID    |   Concrete    |
    | Parents  |       1       |
    | Interior |     Here      |
    |   Fun    |   Fungible    |
    | Fungible | 1000000000000 |
    
8. 将第二个指令设置为**BuyExecution**指令，然后再次点击指令名称下方的**Add item**按钮，并输入以下值以交易执行：

    |    参数     |      值       |
    | :---------: | :-----------: |
    |     ID      |   Concrete    |
    |   Parents   |       1       |
    |  Interior   |     Here      |
    |     Fun     |   Fungible    |
    |  Fungible   | 1000000000000 |
    | WeightLimit |   Unlimited   |
    
9. 将第三个指令设置为**DepositAsset**指令，并输入以下值以在中继链上存入UNIT Token至接收方账户，在本示例中为Bob的中继链地址：

    | Parameter 参数 |       Value 值        |
| :------------: | :-------------------: |
    |     Assets     |         Wild          |
    |      Wild      |          All          |
    |   MaxAssets    |           1           |
    |    Parents     |           1           |
    |    Interior    |          X1           |
    |       X1       |     AccountKey32      |
    |    Network     |          Any          |
    |       ID       | Bob's 32-byte Address |
    
    **Assets = Wild**、**Wild = All**和**MaxAssets = 1**的配置将仅从暂存处取出一项资产并存入指定账户

10. 点击**Submit Transaction**并签署交易

!!! 注意事项
    上述配置的extrinsic编码的调用数据为`0x1c00010100020c000400010000070010a5d4e81300010000070010a5d4e8000d010004010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67`。

![Call the send function of the Polkadot XCM Pallet via Polkadot.js Apps.](/images/builders/interoperability/xcm/send-execute-xcm/send-execute-xcm-3.png)

交易处理后，`polkadotXcm.sent`事件将与发送的XCM消息详情一同发出。

![Review the transaction details using Polkadot.js Apps.](/images/builders/interoperability/xcm/send-execute-xcm/send-execute-xcm-4.png)

### 使用XCM-Utilities预编译发送XCM交易 {: #send-xcm-utils-precompile }

在这一部分，您将使用[XCM-Utilities预编译](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}的`xcmSend`函数（该函数仅支持Moonbase Alpha）以跨链发送XCM消息。XCM-Utilities预编译位于以下地址：

```
{{ networks.moonbase.precompiles.xcm_utils }}
```

在Hood下，XCM-Utilities预编译的`xcmSend`函数调用Polkadot XCM Pallet的`send`函数，即用Rust编码的Substrate pallet。使用XCM-Utilities预编译调用`send`的好处是您可以通过以太坊API完成此操作并使用[Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}等以太坊库。要成功执行XCM消息，目标链需要了解消息中的指令。

`xcmSend`函数接受两个参数：目标链的multilocation和要发送的SCALE编码的版本化XCM消息。

要本地发送XCM消息，请执行以下步骤：

1. 构建目标链的multilocation

2. 构建SCALE编码的调用数据。您可以通过[上一部分](#send-xcm-message-with-polkadotjs-apps)的操作获取编码的调用数据，或者你可以通过[Polkadot.js API](/build/substrate-api/polkadot-js-api/){target=_blank}以编程方式计算相同的调用数据

3. 使用以太坊库和XCM-Utilities预编译发送待用目标链multilocation和编码调用数据的XCM消息

在本示例中，目标链的multilocation为中继链，如下所示：

```js
const dest = [
  1, // Parents: 1 
  [] // Interior: Here
];
```

这将在计算编码的调用数据后使用。

接下来，您可以从[上一部分](#send-xcm-message-with-polkadotjs-apps)中获取编码的调用数据。如果您通过此方式获取，您需要查看编码详细信息并手动删除与目标链multilocation对应的十六进制字符，具体情况的处理方式不同。

获得编码调用数据的还有更为简单的方法，您可以通过[Polkadot.js API](/build/substrate-api/polkadot-js-api/){target=_blank}和 `polkadotXcm.execute`函数以编程方式获取。但是，您仍需要操作调用数据，该步骤相对来说比较简单，无论目的地如何，操作步骤相同。

要以编程方式获取SCALE编码的调用数据，您可以使用以下脚本：

```js
--8<-- 'code/polkadotXcm/xcmSend/encodedCalldata.js'
```

然后，执行以下步骤：

1. 为调用提供输入数据，包括：

    - Moonbase Alpha端点URL，用于创建提供者
    - 中继链和目标链的multilocation
    - 要从账户中提取的Token数量（以Wei为单位）。在本示例中，1 Token已足够。您可以通过XCM费用页面获取此值
    - UNIT Token的接收方地址，在本示例中为Bob的中继链地址
    
2. 构建第一个XCM指令`WithdrawAsset`。您需要提供资产的multilocation和您要提现的数量。这两个变量可在上方找到

3. 构建第二个XCM指令`BuyExecution`。您需要提供资产的multilocation，上述指令取出的数量和权重限制

4. 构建第二个XCM指令`DepositAsset`。在之前执行的操作之后剩余部分（在这种情况下，为DEV Token）都会存入Bob的中继链地址，该地址为接收方。要存入的资产设置为**Assets = Wild**、**Wild = All**和**MaxAssets = 1**

5. 通过连接V2数组中的指令将XCM消息放在一起

6. 创建Polkadot.js API提供者

7. 使用XCM消息和最大权重创建`polkadotXcm.execute` extrinsic，此处无需用到最大权重，因此您可以设置为`0`

8. 获取SCALE编码的调用数据

你可以使用`node`运行脚本，结果将记录到控制台。结果应与上一部分的编码调用数据略有不同：

```
0x1c03020c0004000100000f0000c16ff2862313000100000f0000c16ff28623000d010004010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d670000000000000000
```

在使用编码的调用数据之前，您需要删除一些与XCM消息不对应的十六进制字符，例如`polkadotXcm.execute`函数的调用索引（即前4个字符）和最大权重（即最后16个字符）：

```
call index:  1c03
XCM message: 020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e0
max weight:  0000000000000000
```

因此，在本示例中，单独的XCM消息的编码调用数据为：

```
0x020c0004000100000f0000c16ff2862313000100000f0000c16ff28623000d010004010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67
```

现在，您已拥有目标链的multilocation和SCALE编码的XCM消息，您可以使用以下代码片段通过您选择的以太坊库以编程方式调用XCM-Utilities预编译的`xcmSend`函数：

!!! 请注意
    以下代码片段仅用于演示目的，请勿将您的私钥存储至JavaScript或Python文件中。

=== "Ethers.js"
    ```js
    --8<-- 'code/polkadotXcm/xcmSend/ethers.js'
    ```

=== "Web3.js"
    ```js
    --8<-- 'code/polkadotXcm/xcmSend/web3.js'
    ```

=== "Web3.py"
    ```py
    --8<-- 'code/polkadotXcm/xcmSend/web3.py'
    ```

这样就可以了！您已成功使用Polkadot XCM Pallet和XCM-Utilities预编译从Moonbase Alpha上发送消息至另一条链。