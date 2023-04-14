---
title: Send & Execute XCM Messages - 发送&执行XCM消息
description: Learn how to build a custom XCM message, by combining and experimenting with different XCM instructions, and execute it locally on Moonbeam to see the results.
学习如何通过组合和试验不同的XCM指令来构建自定义XCM消息并在Moonbeam上本地执行以查看结果。
---

# Send and Execute XCM Messages - 发送和执行XCM消息

![Custom XCM Messages Banner](/images/builders/interoperability/xcm/send-execute-xcm/send-execute-xcm-banner.png)

## Introduction - 概览 {: #introduction } 

XCM messages are comprised of a [series of instructions](/builders/interoperability/xcm/overview/#xcm-instructions){target=_blank} that are executed by the Cross-Consensus Virtual Machine (XCVM). Combinations of these instructions result in predetermined actions such as cross-chain token transfers. You can create your own custom XCM messages by combining various XCM instructions.

XCM消息由[一系列的指令](/builders/interoperability/xcm/overview/#xcm-instructions){target=_blank}组成，由跨共识虚拟机（XCVM）执行。这些指令的组合会执行预定的操作，例如跨链Token转移。您可以通过组合各种XCM指令创建自定义XCM消息。

Pallets such as [**X-Tokens**](/builders/interoperability/xcm/xc20/xtokens){target=_blank} and [**XCM-Transactor**](/builders/interoperability/xcm/xcm-transactor/){target=_blank} provide functions with a predefined set of XCM instructions to either send [XC-20s](/builders/interoperability/xcm/xc20/overview/){target=_blank} or remotely execute on other chains via XCM. However, to get a better understanding of the results from combining different XCM instructions, you can build and execute custom XCM messages locally on Moonbeam. You can also send custom XCM messages to another chain (which will start with the [`DecendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} instruction). Nevertheless, for the XCM message to be successfully executed, the target chain needs to be able to understand the instructions.

[**X-Tokens**](/builders/interoperability/xcm/xc20/xtokens){target=_blank}和[**XCM-Transactor**](/builders/interoperability/xcm/xcm-transactor/){target=_blank}等Pallet提供带有一组预定义的XCM指令的函数，用于发送[XC-20s](/builders/interoperability/xcm/xc20/overview/){target=_blank}或通过XCM在其他链上远程执行。然而，要更好地了解组合不同XCM指令的结果，您可以在Moonbeam上本地构建和执行自定义XCM消息。你也可以发送自定义XCM消息至其他链（这将以[`DecendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank}指令开始）。但是，要成功执行XCM消息，目标链需要理解这些指令。

To execute or send a custom XCM message, you can either use the [Polkadot XCM Pallet](#polkadot-xcm-pallet-interface) directly, or you can try it out through the Ethereum API with the [XCM Utilities Precompile](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}. In this guide, you'll learn how to use both methods to execute and send customly built XCM messages locally on Moonbase Alpha.

要执行或发送自定义XCM消息，你可以直接使用[Polkadot XCM Pallet](#polkadot-xcm-pallet-interface)或者尝试通过带有[XCM Utilities预编译](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}的以太坊API。在本教程中，您将学习如何使用这两种方式在Moonbase Alpha上本地执行和发送自定义的XCM消息。

This guide assumes that you are familiar with general XCM concepts, such as [general XCM terminology](/builders/interoperability/xcm/overview/#general-xcm-definitions){target=_blank} and [XCM instructions](/builders/interoperability/xcm/overview/#xcm-instructions){target=_blank}. For more information, you can check out the [XCM Overview](/builders/interoperability/xcm/overview){target=_blank} documentation.

本教程假设您已熟悉XCM基本概念，例如[基本的XCM专业术语](/builders/interoperability/xcm/overview/#general-xcm-definitions){target=_blank}和[XCM指令](/builders/interoperability/xcm/overview/#xcm-instructions){target=_blank}。您可以访问[XCM概览](/builders/interoperability/xcm/overview){target=_blank}文档获取更多信息。

## Polkadot XCM Pallet Interface - Polkadot XCM Pallet接口 {: #polkadot-xcm-pallet-interface }

### Extrinsics {: #extrinsics }

The Polkadot XCM Pallet includes the following relevant extrinsics (functions):

Polkadot XCM Pallet包含以下相关extrinsics（函数）：

 - **execute**(message, maxWeight) — **supported on Moonbase Alpha only** - executes a custom XCM message given the SCALE encoded XCM versioned XCM message to be executed and the maximum weight to be consumed
 - **execute**(message, maxWeight) - **仅支持Moonbase Alpha** - 给定SCALE编码的XCM版本化的XCM消息和要消耗的最大权重，执行自定义XCM消息
 - **send**(dest, message) - **supported on Moonbase Alpha only** - sends a custom XCM message given the multilocation of the destination chain to send the message to and the SCALE encoded XCM versioned XCM message to be sent. For the XCM message to be successfully executed, the target chain needs to be able to understand the instructions in the message
 - **send**(dest, message) - **仅支持Moonbase Alpha** - 给定要发送消息的目标链的multilocation和要发送的SCALE编码的XCM版本化的XCM消息，发送自定义消息。要成功执行XCM消息，目标链需要理解消息中的指令

### Storage Methods - 存储函数 {: #storage-methods }

The Polkadot XCM Pallet includes the following relevant read-only storage methods:

Polkadot XCM Pallet包含以下相关只读存储函数：

- **assetTraps**(Option<H256>) - returns the existing number of times an asset has been trapped given the Blake2-256 hash of the `MultiAssets` pair. If the hash is omitted, all asset traps are returned
- **assetTraps**(Option<H256>) - 给定`MultiAssets`对的Blake2-256哈希，返回中断资产的现有次数。如果哈希出现omitted的错误，则返回所有中断资产
- **palletVersion**() - provides the version of the Polkadot XCM Pallet being used
- **palletVersion**() - 提供正在使用的Polkadot XCM Pallet的版本

## Checking Prerequisites - 查看先决条件 {: #checking-prerequisites }

To follow along with this guide, you will need the following:

开始操作本教程之前，请先准备以下内容：

- Your account must be funded with DEV tokens. 您的账户必须拥有一些DEV Token
  --8<-- 'text/faucet/faucet-list-item.md'
- If following the instructions on using Polkadot.js Apps, you'll need an [account loaded into the Polkadot.js Apps interface](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/accounts){target=_blank}
- 如果按照Polkadot.js Apps的说明进行操作，您需要一个[接入Polkadot.js Apps接口的账户](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/accounts){target=_blank}

## Execute an XCM Message Locally - 本地执行XCM消息 {: #execute-an-xcm-message-locally }

This section of the guide covers the process of building a custom XCM message to be executed locally (i.e., in Moonbeam) via two different methods: the `execute` function of the Polkadot XCM Pallet and the `xcmExecute` function of the [XCM Utilities Precompile](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}. This functionality provides a playground for you to experiment with different XCM instructions and see firsthand the results of these experiments. This also comes in handy to determine the [fees](/builders/interoperability/xcm/fees){target=_blank} associated with a given XCM message on Moonbeam.

这一部分涵盖了通过两种不同的方法来构建要在本地（即在Moonbeam中）执行的自定义XCM消息：Polkadot XCM Pallet的`execute`函数和[XCM Utilities预编译](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}的`xcmExecute`函数。此功能为您提供了试验不同的XCM指令并直接查看这些试验结果的平台。这也有助于确定与Moonbeam上给定XCM消息相关联的[费用](/builders/interoperability/xcm/fees){target=_blank}。

In the following example, you'll transfer DEV tokens from one account to another on Moonbase Alpha. To do so, you'll be building an XCM message that contains the following XCM instructions, which are executed locally (in this case, on Moonbase Alpha):

在以下示例中，您将在Moonbase Alpha上从一个账户转移DEV Token至另一个账户。为此，您需要构建一个XCM消息以包含以下XCM指令，这些指令将在本地执行（在本示例中为Moonbase Alpha）：

 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - removes assets and places them into the holding register
 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 移除资产并将其放入暂存处
 - [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - removes the assets from the holding register and deposits the equivalent assets to a beneficiary account
 - [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - 将资产从暂存处取出并存入等值资产至接收方账户中

!!! note 注意事项
    Typically, when you send an XCM message cross-chain to a target chain, the [`BuyExecution` instruction](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} is needed to pay for remote execution. However, for local execution, this instruction is not necessary as you are already getting charged via the extrinsic call . 

通常情况下，当您发送XCM消息跨链至目标链时，需要用到[`BuyExecution`指令](https://github.com/paritytech/xcm-format#buyexecution){target=_blank}用于支付远程执行。但是，对于本地执行，此指令非必要，因为您已通过extrinsic调用支付费用。

### Execute an XCM Message with Polkadot.js Apps - 使用Polkadot.js Apps执行XCM消息 {: #execute-an-xcm-message-with-polkadotjs-apps }

In this example, you'll execute a custom XCM message locally on Moonbase Alpha using Polkadot.js Apps to interact directly with the Polkadot XCM Pallet. 

在本示例中，您将使用Polkadot.js Apps在Moonbase Alpha上本地执行自定义XCM消息，以直接与Polkadot XCM Pallet交互。

To get started, you can head to the [**Extrinsics** page of Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank} and take the following steps:

开始操作之前，请先前往[Polkadot.js Apps的**Extrinsics**页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}并执行以下步骤：

1. Select the account from which you want to send the XCM. In this example, Alice will be the sender

    选择要发送XCM的账户。在本示例中，Alice为发送方

2. Choose the **polkadotXcm** pallet and select the **execute** extrinsic

    选择**polkadotXcm** pallet并选择**execute** extrinsic

3. Set the version of the message to **V2**

    将消息版本设置为**V2**

4. Click the **Add item** button two times for each of the instructions to be added: **WithdrawAsset** and **DepositAsset**

    点击**Add item**按钮两次以添加**WithdrawAsset**和**DepositAsset**指令

5. Set the first instruction as **WithdrawAsset**. Click the **Add item** button below the instruction name and enter the multilocation of the asset, asset type, and amount to withdraw. Since this example covers how to send DEV tokens from one account to another on Moonbase Alpha, the **WithdrawAsset** instruction will define the amount of DEV tokens on Moonbase Alpha to withdraw. You can use the following values, which will withdraw 0.1 DEV tokens:

    将第一个指令设置为**WithdrawAsset**。点击指令名称下方的**Add item**按钮并输入资产的multilocation、资产类型和提现金额。因为本示例涵盖了如何在Moonbase Alpha上将DEV Token从一个账户发送到另一个账户，**WithdrawAsset**指令将定义Moonbase Alpha提现的DEV Token数量。你可以使用以下值，提取0.1 DEV Token：

    | Parameter 参数 |      Value 值      |
    | :------------: | :----------------: |
    |       ID       |      Concrete      |
    |    Parents     |         0          |
    |    Interior    |         X1         |
    |       X1       |   PalletInstance   |
    | PalletInstance |         3          |
    |      Fun       |      Fungible      |
    |    Fungible    | 100000000000000000 |

6. Set the second instruction to be the **DepositAsset** instruction and enter the following values to deposit DEV tokens to a beneficiary account on Moonbase Alpha, which in this example will be Bob:

    将第二个指令设置为**DepositAsset**指令，并输入以下值以在Moonbase Alpha上存入DEV Token至接收方账户，在本示例中为Bob：

    | Parameter 参数 |      Value 值      |
    | :------------: | :----------------: |
    |     Assets     |        Wild        |
    |      Wild      |        All         |
    |   MaxAssets    |         1          |
    |    Parents     |         0          |
    |    Interior    |         X1         |
    |       X1       |    AccountKey20    |
    |    Network     |        Any         |
    |      Key       | Bob's H160 Address |

    The configuration fo **Assets = Wild**, **Wild = All** and **MaxAssets = 1** will take only one asset from the holding registry and deposit it to the defined account.

    **Assets = Wild**、**Wild = All**和**MaxAssets = 1**的配置将仅从暂存处取出一项资产并存入指定账户

7. Set the **maxWeight**, which defines the maximum weight units allowed for the XCM execution. For this example, you can enter `1000000000`. Any excess fees will be returned to you

    设置**maxWeight**，用于定义XCM执行允许的最大权重单位。在本示例中，您可以输入`1000000000`。任何多余的费用将退还您的账户

9. Click **Submit Transaction** and sign the transaction

    点击**Submit Transaction**并签署交易

!!! note 注意事项
    The encoded calldata for the extrinsic configured above is `0x1c03020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e000ca9a3b00000000`.

上述配置的extrinsic编码的调用数据为`0x1c03020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e000ca9a3b00000000`。

![Call the execute function of the Polkadot XCM Pallet via Polkadot.js Apps.](/images/builders/interoperability/xcm/send-execute-xcm/send-execute-xcm-1.png)

Once the transaction is processed, the 0.1 DEV tokens should be withdrawn from Alice's account along with the associated XCM fees, and Bob should have received 0.1 DEV tokens in his account. A `polkadotXcm.Attempted` event will be emitted with the outcome.

交易处理后，0.1 DEV Token和相关联的XCM费用从Alice的账户提取，Bob将在其账户收到0.1 DEV Token。`polkadotXcm.Attempted`事件将与结果一同发出。

![Review the transaction details using Polkadot.js Apps.](/images/builders/interoperability/xcm/send-execute-xcm/send-execute-xcm-2.png)

### Execute an XCM Message with the XCM Utilities Precompile - 使用XCM Utilities预编译执行XCM交易 {: #execute-xcm-utils-precompile }

In this section, you'll use the `xcmExecute` function of the [XCM Utilities Precompile](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}, which is only supported on Moonbase Alpha, to execute an XCM message locally. The XCM Utilities Precompile is located at the following address:

在这一部分，您将使用[XCM Utilities预编译](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}的`xcmExecute`函数（该函数仅支持Moonbase Alpha）以本地执行XCM消息。XCM Utilities预编译位于以下地址：

```
{{ networks.moonbase.precompiles.xcm_utils }}
```

Under the hood, the `xcmExecute` function of the XCM Utilities Precompile calls the `execute` function of the Polkadot XCM Pallet, which is a Substrate pallet that is coded in Rust. The benefit of using the XCM Utilities Precompile to call `xcmExecute` is that you can do so via the Ethereum API and use Ethereum libraries like [Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}.

在Hood下，XCM Utilities预编译的`xcmExecute`函数调用Polkadot XCM Pallet的`execute`函数，即用Rust编码的Substrate pallet。使用XCM-Utilities预编译调用`xcmExecute`的好处是您可以通过以太坊API完成此操作并使用[Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}等以太坊库。

The `xcmExecute` function accepts two parameters: the SCALE encoded versioned XCM message to be executed and the maximum weight to be consumed. 

`xcmExecute`函数接受两个参数：要执行SCALE编码的版本化XCM消息和要消耗的最大权重。

To execute the XCM message locally, you'll take the following steps:

要本地执行XCM消息，请执行以下步骤：

1. Build the SCALE encoded calldata. You can grab the encoded calldata from the [previous section](#execute-an-xcm-message-with-polkadotjs-apps), or you can calculate the same calldata programmatically with the [Polkadot.js API](/build/substrate-api/polkadot-js-api/){target=_blank} 

   构建SCALE编码的调用数据。您可以通过[上一部分](#execute-an-xcm-message-with-polkadotjs-apps)的操作获取编码的调用数据，或者你可以通过[Polkadot.js API](/build/substrate-api/polkadot-js-api/){target=_blank}以编程方式计算相同的调用数据

2. Send the XCM message with the encoded calldata using the Ethereum library and the XCM Utilities Precompile

   使用以太坊库和XCM Utilities预编译发送带有编码调用数据的XCM消息

To get the SCALE encoded calldata programmatically, you can use the following script:

要以编程方式获取SCALE编码的调用数据，您可以使用以下脚本：

```js
--8<-- 'code/polkadotXcm/xcmExecute/encodedCalldata.js'
```

To summarize, the steps you're taking are as follows: 

然后，执行以下步骤：

1. Provide the input data for the call. This includes:

    为调用提供输入数据，包括：

    - The Moonbase Alpha endpoint URL to create the provider
    - Moonbase Alpha端点URL，用于创建提供者
    - The multilocation of the DEV token as seen by Moonbase Alpha
    - 在Moonbase Alpha上的DEV Token的multilocation
    - Amount of tokens (in Wei) to withdraw from your account. For this example, 0.1 tokens are more than enough. To understand how to get this value, please refer to the XCM fee page
    - 要从账户中提取的Token数量（以Wei为单位）。在本示例中，0.1 Token已足够。您可以通过XCM费用页面获取此值
    - The maximum weight parameter for the `xcmExecute` function
    - `xcmExecute`函数的最大权重参数
    - The address where the DEV tokens will be transferred to, which in this case is Bob's address
    - DEV Token的接收方地址，在本示例中为Bob的地址

2. Build the first XCM instruction, `WithdrawAsset`. You need to provide the asset multilocation and the amount you want to withdraw. Both variables were already described before

    构建第一个XCM指令`WithdrawAsset`。您需要提供资产的multilocation和您要提现的数量。这两个变量可在上方找到

3. Build the second XCM instruction, `DepositAsset`. Whatever is left in holding after the actions executed before (in this case, it should be only DEV tokens) is deposited to Bob's address, which is set as the beneficiary. The asset to be deposited is set with the values of **Assets = Wild**, **Wild = All** and **MaxAssets = 1**

    构建第二个XCM指令`DepositAsset`。在之前执行的操作之后剩余部分（在这种情况下，为DEV Token）都会存入Bob的地址，该地址为接收方。要存入的资产设置为**Assets = Wild**、**Wild = All**和**MaxAssets = 1**

4. Put the XCM message together by concatenating the instructions inside a V2 array

    通过连接V2数组中的指令将XCM消息放在一起

5. Create the Polkadot.js API provider

    创建Polkadot.js API提供者

6. Craft the `polkadotXcm.execute` extrinsic with the XCM message and the maximum weight

    使用XCM消息和最大权重创建`polkadotXcm.execute` extrinsic

7. Get the SCALE encoded calldata

    获取SCALE编码的调用数据

You can use `node` to run the script and the result will be logged to the console. The result should match the encoded calldata from the [previous section](#execute-an-xcm-message-with-polkadotjs-apps): 

你可以使用`node`运行脚本，结果将记录到控制台。结果应与[上一部分](#execute-an-xcm-message-with-polkadotjs-apps)的编码调用数据一致：

```
0x1c03020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e000ca9a3b00000000
```

Before you can use the encoded calldata, you'll need to remove some of the hexadecimal characters that do not correspond to the XCM message, such as the call index for the `polkadotXcm.execute` function, which will be the first 4 characters, and the maximum weight, which will be the last 16 characters:

在使用编码的调用数据之前，您需要删除一些与XCM消息不对应的十六进制字符，例如`polkadotXcm.execute`函数的调用索引（即前4个字符）和最大权重（即最后16个字符）：

```
call index:  1c03
XCM message: 020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e0
max weight:  00ca9a3b00000000
```

So, for this example, the encoded calldata for the XCM message alone is: 

因此，在本示例中，单独的XCM消息的编码调用数据为：

```
0x020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e0
```

Now that you have the SCALE encoded XCM message, you can use the following code snippets to programmatically call the `xcmExecute` function of the XCM Utilities Precompile using your Ethereum library of choice:

现在，您已拥有SCALE编码的XCM消息，您可以使用以下代码片段通过您选择的以太坊库以编程方式调用XCM Utilities预编译的`xcmExecute`函数：

!!! remember 请注意
    The following snippets are for demo purposes only. Never store your private keys in a JavaScript or Python file.

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

And that's it! You've successfully used the Polkadot XCM Pallet and the XCM Utilities Precompile to execute a custom XCM message locally on Moonbase Alpha!

这样就可以了！您已成功使用Polkadot XCM Pallet和XCM Utilities预编译在Moonbase Alpha上本地执行自定义XCM消息。

## Send an XCM Message Cross-Chain - 跨链发送XCM消息 {: #send-xcm-message }

This section of the guide covers the process of sending a custom XCM message cross-chain (i.e., from Moonbeam to a target chain, such as the relay chain) via two different methods: the `send` function of the Polkadot XCM Pallet and the `xcmSend` function of the [XCM Utilities Precompile](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}. 

这一部分涵盖了通过两种不同的方法来跨链发送自定义XCM消息（即从Moonbeam到目标链，如中继链）：Polkadot XCM Pallet的`send`函数和[XCM Utilities预编译](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}的`xcmSend`函数。

For the XCM message to be successfully executed, the target chain needs to be able to understand the instructions in the message. On the contrary, you'll see a `Barrier` filter on the destination chain. For security reasons, the XCM message is prepended with the [`DecendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} instruction to prevent XCM execution on behalf of the origin chain sovereign account. 

要成功执行XCM消息，目标链需要理解消息中的指令。相反，您将在目标链上看到`Barrier`过滤器。为保证安全，XCM消息前会加上[`DecendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank}指令以防止XCM代表源链的主权账户执行操作。

In the following example, you'll be building an XCM message that contains the following XCM instructions, which will be executed in the Alphanet relay chain:

在以下示例中，您将构建一个包含以下XCM指令的XCM消息，这些指令将在Alphanet中继链中执行：

 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - removes assets and places them into the holding register
 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 移除资产并将其放入暂存处
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - takes the assets from holding to pay for execution fees. The fees to pay are determined by the target chain
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - 从暂存处获取资产以支付执行费用。支付的费用由目标链决定
 - [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - removes the assets from the holding register and deposits the equivalent assets to a beneficiary account
 - [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - 将资产从暂存处取出并存入等值资产至接收方账户中

Together, the intention of these instructions is to transfer the native asset of the relay chain, which is UNIT for the Alphanet relay chain, from Moonbase Alpha to an account on the relay chain. This example is for demonstration purposes only to show you how a custom XCM message could be sent cross-chain. Please keep in mind that the target chain needs to be able to understand the instructions in the message to execute them.

这些指令的目的是将中继链的原生资产（即Alphanet中继链的UNIT）从Moonbase Alpha转移到中继链上的一个账户。此示例仅用于演示目的，以演示如何跨链发送自定义XCM消息。 请记住，目标链需要理解消息中的指令才可执行。

### Send an XCM Message with Polkadot.js Apps - 使用Polkadot.js Apps发送XCM消息 {: #send-xcm-message-with-polkadotjs-apps }

In this example, you'll send a custom XCM message from your account on Moonbase Alpha to the relay chain using Polkadot.js Apps to interact directly with the Polkadot XCM Pallet. 

在本示例中，您将使用Polkadot.js Apps在Moonbase Alpha上本地执行自定义XCM消息，以直接与Polkadot XCM Pallet交互。

To get started, you can head to the [**Extrinsics** page of Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank} and take the following steps:

开始操作之前，请先前往[Polkadot.js Apps的**Extrinsics**页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}并执行以下步骤：

1. Select the account from which you want to send the XCM. In this example, Alice will be the sender

    选择要发送XCM的账户。在本示例中，Alice为发送方

2. Choose the **polkadotXcm** pallet and select the **send** extrinsic

    选择**polkadotXcm** pallet并选择**send** extrinsic

3. Set the version of the destination's multilocation to **V1**

    将目标链的multilocation版本设置为**V1**

4. Enter the multilocation. For this example, the relay chain token can be defined as:

    输入multilocation。在本示例中，中继链Token可定义为：

    | Parameter 参数 | Value 值 |
    | :------------: | :------: |
    |    Parents     |    1     |
    |    Interior    |   Here   |

5. Set the version of the message to **V2**

    将消息版本设置为**V2**

6. Click the **Add item** button three times for each of the instructions to be added: **WithdrawAsset**, **BuyExecution**, and **DepositAsset**

    点击**Add item**按钮三次以添加**WithdrawAsset**、**BuyExecution**和**DepositAsset**指令

7. Set the first instruction as **WithdrawAsset**. Click the **Add item** button below the instruction name and enter the multilocation, asset type, and amount to withdraw. For this example, you can use the following values, which will withdraw 1 UNIT token:

    将第一个指令设置为**WithdrawAsset**。点击指令名称下方的**Add item**按钮并输入资产的multilocation、资产类型和提现金额。在本示例中，你可以使用以下值，提取1 UNIT Token：

    | Parameter 参数 |   Value 值    |
    | :------------: | :-----------: |
    |       ID       |   Concrete    |
    |    Parents     |       1       |
    |    Interior    |     Here      |
    |      Fun       |   Fungible    |
    |    Fungible    | 1000000000000 |

8. Set the second instruction to be the **BuyExecution** instruction, and again click the **Add item** button below the instruction name and enter the following values to buy execution:

    将第二个指令设置为**BuyExecution**指令，然后再次点击指令名称下方的**Add item**按钮，并输入以下值以交易执行：

    | Parameter 参数 |   Value 值    |
    | :------------: | :-----------: |
    |       ID       |   Concrete    |
    |    Parents     |       1       |
    |    Interior    |     Here      |
    |      Fun       |   Fungible    |
    |    Fungible    | 1000000000000 |
    |  WeightLimit   |   Unlimited   |

9. Set the third instruction to be the **DepositAsset** instruction and enter the following values to deposit the UNIT tokens to a beneficiary account on the relay chain, which in this example will be Bob's relay chain address:

    将第三个指令设置为**DepositAsset**指令，并输入以下值以在中继链上存入UNIT Token至接收方账户，在本示例中为Bob的中继链地址：

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

    The configuration fo **Assets = Wild**, **Wild = All** and **MaxAssets = 1** will take only one asset from the holding registry and deposit it to the defined account.

    **Assets = Wild**、**Wild = All**和**MaxAssets = 1**的配置将仅从暂存处取出一项资产并存入指定账户

10. Click **Submit Transaction** and sign the transaction

    点击**Submit Transaction**并签署交易

!!! note 注意事项
    The encoded calldata for the extrinsic configured above is `0x1c00010100020c000400010000070010a5d4e81300010000070010a5d4e8000d010004010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67`.

上述配置的extrinsic编码的调用数据为`0x1c00010100020c000400010000070010a5d4e81300010000070010a5d4e8000d010004010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67`。

![Call the send function of the Polkadot XCM Pallet via Polkadot.js Apps.](/images/builders/interoperability/xcm/send-execute-xcm/send-execute-xcm-3.png)

Once the transaction is processed, a `polkadotXcm.sent` event is emitted with the details of the sent XCM message.

交易处理后，`polkadotXcm.sent`事件将与发送的XCM消息详情一同发出。

![Review the transaction details using Polkadot.js Apps.](/images/builders/interoperability/xcm/send-execute-xcm/send-execute-xcm-4.png)

### Send an XCM Message with the XCM Utilities Precompile - 使用XCM Utilities预编译发送XCM交易 {: #send-xcm-utils-precompile }

In this section, you'll use the `xcmSend` function of the [XCM Utilities Precompile](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}, which is only supported on Moonbase Alpha, to send an XCM message cross-chain. The XCM Utilities Precompile is located at the following address:

在这一部分，您将使用[XCM Utilities预编译](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}的`xcmSend`函数（该函数仅支持Moonbase Alpha）以跨链发送XCM消息。XCM Utilities预编译位于以下地址：

```
{{ networks.moonbase.precompiles.xcm_utils }}
```

Under the hood, the `xcmSend` function of the XCM Utilities Precompile calls the `send` function of the Polkadot XCM Pallet, which is a Substrate pallet that is coded in Rust. The benefit of using the XCM Utilities Precompile to call `xcmSend` is that you can do so via the Ethereum API and use Ethereum libraries like [Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}. For the XCM message to be successfully executed, the target chain needs to be able to understand the instructions in the message.

在Hood下，XCM Utilities预编译的`xcmSend`函数调用Polkadot XCM Pallet的`send`函数，即用Rust编码的Substrate pallet。使用XCM Utilities预编译调用`send`的好处是您可以通过以太坊API完成此操作并使用[Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}等以太坊库。要成功执行XCM消息，目标链需要了解消息中的指令。

The `xcmSend` function accepts two parameters: the multilocation of the destination and the SCALE encoded versioned XCM message to be sent.

`xcmSend`函数接受两个参数：目标链的multilocation和要发送的SCALE编码的版本化XCM消息。

To send the XCM message locally, you'll take the following steps:

要本地发送XCM消息，请执行以下步骤：

1. Build the multilocation of the destination 

   构建目标链的multilocation

2. Build the SCALE encoded calldata. You can grab the encoded calldata from the [previous section](#send-xcm-message-with-polkadotjs-apps), or you can calculate the same calldata programmatically with the [Polkadot.js API](/build/substrate-api/polkadot-js-api/){target=_blank} 

   构建SCALE编码的调用数据。您可以通过[上一部分](#send-xcm-message-with-polkadotjs-apps)的操作获取编码的调用数据，或者你可以通过[Polkadot.js API](/build/substrate-api/polkadot-js-api/){target=_blank}以编程方式计算相同的调用数据

3. Send the XCM message, with the destination multilocation and encoded calldata, using the Ethereum library and the XCM Utilities Precompile

   使用以太坊库和XCM Utilities预编译发送待用目标链multilocation和编码调用数据的XCM消息

The multilocation of the destination, which is the relay chain in this example, is as follows:

在本示例中，目标链的multilocation为中继链，如下所示：

```js
const dest = [
  1, // Parents: 1 
  [] // Interior: Here
];
```

This will be used after the encoded calldata is calculated.

这将在计算编码的调用数据后使用。

Next, you can grab the encoded calldata from the [previous section](#send-xcm-message-with-polkadotjs-apps). However, if you do this, you'll need to look at the encoding details and manually remove the hexadecimal characters that correspond to the destination multilocation, which will vary depending on the destination.

接下来，您可以从[上一部分](#send-xcm-message-with-polkadotjs-apps)中获取编码的调用数据。如果您通过此方式获取，您需要查看编码详细信息并手动删除与目标链multilocation对应的十六进制字符，具体情况的处理方式不同。

For a more foolproof way to get the encoded calldata, you can programmatically obtain it via the [Polkadot.js API](/build/substrate-api/polkadot-js-api/){target=_blank} and the `polkadotXcm.execute` function. You'll still need to manipulate the calldata, but this will be easier as you can do the same manipulation every time regardless of the destination.

获得编码调用数据的还有更为简单的方法，您可以通过[Polkadot.js API](/build/substrate-api/polkadot-js-api/){target=_blank}和 `polkadotXcm.execute`函数以编程方式获取。但是，您仍需要操作调用数据，该步骤相对来说比较简单，无论目的地如何，操作步骤相同。

To build the SCALE encoded calldata programmatically, you can use the following snippet:

要以编程方式获取SCALE编码的调用数据，您可以使用以下脚本：

```js
--8<-- 'code/polkadotXcm/xcmSend/encodedCalldata.js'
```

To summarize, the steps you're taking are as follows: 

然后，执行以下步骤：

1. Provide the input data for the call. This includes:

    为调用提供输入数据，包括：

    - The Moonbase Alpha endpoint URL to create the provider
    - Moonbase Alpha端点URL，用于创建提供者
    - The multilocation of the relay chain and destination
    - 中继链和目标链的multilocation
    - Amount of tokens (in Wei) to withdraw from your account. For this example, 1 token is more than enough. To understand how to get this value, please refer to the XCM fee page
    - 要从账户中提取的Token数量（以Wei为单位）。在本示例中，1 Token已足够。您可以通过XCM费用页面获取此值
    - The address where the UNIT tokens will be transferred to, which in this case is Bob's address on the relay chain
    - UNIT Token的接收方地址，在本示例中为Bob的中继链地址

2. Build the first XCM instruction, `WithdrawAsset`. You need to provide the asset multilocation and the amount you want to withdraw. Both variables were already described before

    构建第一个XCM指令`WithdrawAsset`。您需要提供资产的multilocation和您要提现的数量。这两个变量可在上方找到

3. Build the second XCM instruction, `BuyExecution`. You need to provide the asset multilocation, the amount we took out with the previous instruction, and the weight limit

    构建第二个XCM指令`BuyExecution`。您需要提供资产的multilocation，上述指令取出的数量和权重限制

4. Build the third XCM instruction, `DepositAsset`. Whatever is left in holding after the actions executed before is deposited to the beneficiary, which is Bob's address on the relay chain. The asset to be deposited is set with the values of **Assets = Wild**, **Wild = All** and **MaxAssets = 1**

    构建第二个XCM指令`DepositAsset`。在之前执行的操作之后剩余部分（在这种情况下，为DEV Token）都会存入Bob的中继链地址，该地址为接收方。要存入的资产设置为**Assets = Wild**、**Wild = All**和**MaxAssets = 1**

5. Put the XCM message together by concatenating the instructions inside a V2 array

    通过连接V2数组中的指令将XCM消息放在一起

6. Create the Polkadot.js API provider

    创建Polkadot.js API提供者

7. Craft the `polkadotXcm.execute` extrinsic with the XCM message and the max weight; since the max weight is not needed, you can set it to `'0'`

    使用XCM消息和最大权重创建`polkadotXcm.execute` extrinsic，此处无需用到最大权重，因此您可以设置为`0`

8. Get the SCALE encoded calldata

    获取SCALE编码的调用数据

You can use `node` to run the script and the result will be logged to the console. The result should be slightly different than the encoded calldata from the previous step: 

你可以使用`node`运行脚本，结果将记录到控制台。结果应与上一部分的编码调用数据略有不同：

```
0x1c03020c000400010000070010a5d4e81300010000070010a5d4e8000d010004010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d670000000000000000
```

Before you can use the encoded calldata, you'll need to remove some of the hexadecimal characters that do not correspond to the XCM message, such as the call index for the `polkadotXcm.execute` function, which will be the first 4 characters, and the maximum weight, which will be the last 16 characters:

在使用编码的调用数据之前，您需要删除一些与XCM消息不对应的十六进制字符，例如`polkadotXcm.execute`函数的调用索引（即前4个字符）和最大权重（即最后16个字符）：

```
call index:  1c03
XCM message: 020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e0
max weight:  0000000000000000
```

So, for this example, the encoded calldata for the XCM message alone is: 

因此，在本示例中，单独的XCM消息的编码调用数据为：

```
0x020c000400010000070010a5d4e81300010000070010a5d4e8000d010004010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67
```

Now that you have the multilocation of the destination and the SCALE encoded XCM message, you can use the following code snippets to programmatically call the `xcmSend` function of the XCM Utilities Precompile using your Ethereum library of choice:

现在，您已拥有目标链的multilocation和SCALE编码的XCM消息，您可以使用以下代码片段通过您选择的以太坊库以编程方式调用XCM Utilities预编译的`xcmSend`函数：

!!! remember 请注意
    The following snippets are for demo purposes only. Never store your private keys in a JavaScript or Python file.

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

And that's it! You've successfully used the Polkadot XCM Pallet and the XCM Utilities Precompile to send a message from Moonbase Alpha to another chain! 

这样就可以了！您已成功使用Polkadot XCM Pallet和XCM Utilities预编译从Moonbase Alpha上发送消息至另一条链。