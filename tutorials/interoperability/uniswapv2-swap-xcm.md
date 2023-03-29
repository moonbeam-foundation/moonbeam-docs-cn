---
title: Uniswap V2 Swap on Moonbeam from Polkadot via XCM - 通过XCM在波卡中执行Uniswap V2兑换
description: In this guide, we'll use remote EVM execution via XCM to perform an Uniswap V2 swap, to showcase how Moonbeam can be leveraged in a connected contracts approach.在本教程中，我们将通过XCM执行远程EVM执行进行一个Uniswap V2兑换，以展示互连合约中如何使用Moonbeam。
template: main.html 
---

# Uniswap V2 Swap from Polkadot via XCM 通过XCM在波卡中执行Uniswap V2兑换

![Banner Image](/images/tutorials/interoperability/uniswapv2-swap-xcm/uniswapv2-swap-xcm-banner.png)
_February 2, 2023 | by Alberto Viera_

## Introduction 概览 {: #introduction }

In this tutorial, we’ll perform a Uniswap V2-styled swap from a relay chain (what Polkadot is to Moonbeam) using Polkadot's intra-operability general message passing protocol called [XCM](/builders/interoperability/xcm/overview/){target=_blank}. To do so, we'll be using a particular combination of XCM instructions that allow you to [call Moonbeam's EVM through an XCM message](/builders/xcm/remote-evm-calls/){target=_blank}. Consequently, any blockchain that is able to send an XCM message to Moonbeam can tap into its EVM and all the dApps built on top of it.

在本教程中，我们将在中继链（即波卡相对于Moonbeam的关系）使用名为[XCM](/builders/interoperability/xcm/overview/){target=_blank}的波卡原生互操作性一般消息传递协议来演示一个Uniswap V2风格的兑换。为此，我们将使用特定的XCM指令组合，允许您[通过XCM消息调用Moonbeam的EVM](/builders/xcm/remote-evm-calls/){target=_blank}。因此，任何能够向Moonbeam发送XCM消息的区块链都可以利用其EVM以及构建在其之上的所有dApp。

**The content of this tutorial is for educational purposes only!**

**本教程中的内容仅用于教育用途！**

For this example, you'll be working on top of the Moonbase Alpha (Moonbeam TestNet), which has its own relay chain (similar to Polkadot). The relay chain token is called `UNIT`, while Moonbase Alpha's is called `DEV`. Doing this in TestNet is less fun than doing it in production, but **developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

在此范例中，您将在Moonbase Alpha（Moonbeam TestNet）上操作，它拥有自己的中继链（类似于波卡）。中继链Token称为`UNIT`，而Moonbase Alpha的Token则称为`DEV`。在测试网中执行此操作不如在真正的生产环境中执行此操作有趣，但是**开发人员必须了解发送不正确的XCM消息或导致资金损失。**因此，在真正的生产环境中执行前，于测试网中测试XCM功能是必要的。

Throughout this tutorial, we will refer to the account performing the Uniswap V2 swap via XCM as Alice. The tutorial has a lot of moving parts, so let's summarize them in a list and a flow diagram:

在此教程中，我们将执行Uniswap V2兑换的账户命名为Alice。此教程包含许多转移的内容部分，因此让我们先将其整理总结成列表以及流程图：

1. Alice has an account on the relay chain, and she wants to swap `DEV` tokens for `MARS` tokens (ERC-20 on Moonbase Alpha) on [Moonbeam-Swap](https://moonbeam-swap.netlify.app){target=_blank}, a demo Uniswap V2 clone on Moonbase Alpha. Alice needs to send an XCM message to Moonbase Alpha from her relay chain account

   Alice在中继链上拥有一个账户，她希望在[Moonbeam-Swap](https://moonbeam-swap.netlify.app){target=_blank}（Moonbase Alpha上的Uniswap V2克隆演示版本）将`DEV ` Token兑换成`MARS ` Token（Moonbase Alpha上的ERC-20 Token）。Alice此时需要自其中继链账户传送一个XCM消息至Moonbase Alpha

2. The XCM message will be received by Moonbase Alpha and its instructions executed. The instructions state Alice's intention to buy some block execution time in Moonbase Alpha and execute a call to Moonbase's EVM, specifically, the Uniswap V2 (Moonbeam-Swap) router contract. The EVM call is dispatched through a special account Alice controls on Moonbase Alpha via XCM messages. This account is known as the [multilocation-derivative account](/builders/xcm/xcm-transactor/#general-xcm-definitions){target=_blank}. Even though this is a keyless account (private key is unknown), the public address can be [calculated in a deterministic way](/builders/xcm/remote-evm-calls/#calculate-multilocation-derivative){target=_blank}

   XCM消息将由Moonbase Alpha接收并执行其指令。这些指令表明Alice打算在Moonbase Alpha中购买一些区块执行时间并执行对Moonbase的EVM的调用，具体来说是Uniswap V2（Moonbeam-Swap）路由合约。 EVM调用是经由Alice通过XCM消息在Moonbase Alpha上控制的一个特殊账户发送的。此帐户称为[多地点衍生账户](/builders/xcm/xcm-transactor/#general-xcm-definitions){target=_blank}。即使这是一个无密钥帐户（私钥未知），公共地址可以[以确定性的方式计算](/builders/xcm/remote-evm-calls/#calculate-multilocation-derivative){target=_blank}

3. The XCM execution will result in the swap being executed by the EVM, and Alice will receive her `MARS` tokens in her special account

   XCM执行将会导致兑换经由EVM执行，而Alice将会在其特别账户获得其`MARS` Token

4. The execution of the remote EVM call through XCM will result in some EVM logs that are picked up by explorers. There is an EVM transaction and receipt that anyone can query to verify

   经由XCM的远程EVM执行将会获得浏览器筛选的一些EVM记录，为一个任何人皆能够查看和验证的EVM交易和收据。

![Remote EVM Call Through XCM for Uniswap V2 Swap Diagram](/images/tutorials/interoperability/uniswapv2-swap-xcm/uniswapv2-swap-xcm-1.png)

With the steps outlined, some prerequisites need to be taken into account, let's jump right into it!

如要执行上述列出的步骤，将需要满足一些先决条件，马上查看有哪些先决条件吧！

## Checking Prerequisites 查看先决条件 {: #checking-prerequisites }

Considering all the steps summarized in the [introduction](#introduction), the following prerequisites need to be accounted for:

所有在[概览](#introduction)部分中列出的步骤皆需满足以下的先决条件：

- You needs to have UNITs on the relay chain to pay for transaction fees when sending the XCM. If you have a Moonbase Alpha account funded with DEV tokens, you can swap some DEV for xcUNIT here on [Moonbeam Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}. Then withdraw the xcUNIT from Moonbase Alpha to [your account on the Moonbase relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank} using [apps.moonbeam.network](https://apps.moonbeam.network/moonbase-alpha/){target=_blank}
- 您需要在中继链上拥有UNIT来支付发送XCM时所需的交易费用。如果您有一个具有DEV Token的Moonbase Alpha帐户，您可以在[Moonbeam Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}上用一些DEV交换xcUNIT。然后从Moonbase Alpha通过[apps.moonbeam.network](https://apps.moonbeam.network/moonbase-alpha/){target=_blank}提现xcUNIT到[您在Moonbase中继链上的账户](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g .moonbase.moonbeam.network#/accounts){target=_blank}。
- Your [multilocation-derivative account](/builders/xcm/xcm-transactor/#general-xcm-definitions){target=_blank} must hold `DEV` tokens to fund the Uniswap V2 swap, and also pay for the XCM execution (although this could be paid in UNIT tokens as `xcUNIT`). We will calculate the multilocation-derivative account address in the next section
- 您的[多地点衍生账户](/builders/xcm/xcm-transactor/#general-xcm-definitions){target=_blank}必须持有`DEV` Token来为Uniswap V2兑换提供资金，以及支付XCM的执行费用（尽管这可以用UNIT Token以`xcUNIT`方式支付）。我们将在下一节中计算多地点衍生账户的地址

--8<-- 'text/faucet/faucet-list-item.md'

## Calculating your Multilocation-Derivative Account 计算您的多地点衍生账户 {: #calculating-your-multilocation-derivative-account }

Copy the account of your existing or newly created account on the [Moonbase relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}. You're going to need it to calculate the corresponding multilocation-derivative account, which is a special type of account that’s keyless (the private key is unknown). Transactions from a multilocation-derivative account can be initiated only via valid XCM instructions from the corresponding account on the relay chain. In other words, you are the only one who can initiate transactions on your multilocation-derivative account - and if you lose access to your Moonbase relay account, you’ll also lose access to your multilocation-derivative account.

复制您在[Moonbase中继链](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g .moonbase.moonbeam.network#/accounts){target=_blank}的现有或新创建的账户。您将需要它来计算相应的多地点衍生账户，这是一种特殊类型的无密钥账户（其私钥未知）。来自多地点衍生账户的交易只能通过来自中继链上相应账户的有效XCM指令启动。换句话说，您是唯一可以在您的多地点衍生账户上发起交易的人——如果您无法访问您的Moonbase中继链账户，您也将无法访问您的多地点衍生账户。

To generate the multilocation-derivative account, first clone the [xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank} repo. Run `yarn` to install the necessary packages, and then run:

如要产生多地点衍生账户，首先请复制[xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank}代码库，运行`yarn`指令以安装所有必要代码包并运行以下指令：


```sh
yarn calculate-multilocation-derivative-account \
--w wss://wss.api.moonbase.moonbeam.network \
--a YOUR_MOONBASE_RELAY_ACCOUNT_HERE \
--p PARACHAIN_ID_IF_APPLIES \
--n 0x57657374656e64
```

Let's review the parameters passed along with this command:

接着，让我们检查以上指令中输入的相关参数：

- The `-w` flag corresponds to the endpoint we’re using to fetch this information
- `-w`标记与我们用于获得此消息的端点有关
- The `-a` flag corresponds to your Moonbase relay chain address
- `-a`标记与您的Moonbase中继链账户地址有关
- The `-p` flag corresponds to the parachain ID of the origin chain (if applies), if you are sending the XCM from the relay chain, you don't need to provide this parameter
- `-p`与原链（如有）的平行链ID有关。如果您从中继链传送XCM则无需提供此参数
- The `-n` flag corresponds to the encoded form of “westend”, the name of the relay chain that Moonbase relay is based on
- `-n`与“westend”（Moonbase中继基于的中继链名称）的编码形式有关

For our case, we will send the remote EVM call via XCM from Alice's account, which is `5EnnmEp2R92wZ7T8J2fKMxpc1nPW5uP8r5K3YUQGiFrw8uG6`, so the command and response would look like the following image.

以我们的例子来说，我们将会通过Alice账户经由XCM传送EVM原生调用，也就是`5EnnmEp2R92wZ7T8J2fKMxpc1nPW5uP8r5K3YUQGiFrw8uG6`，因此指令和获得的结果将会如同下方图示。

![Calculating the multilocation-derivative account](/images/tutorials/interoperability/uniswapv2-swap-xcm/uniswapv2-swap-xcm-2.png)

The values are all summarized in the following table:

所有数值被整理成以下表格：

|                          Name 名称                           |                          Value 数值                          |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
|          Origin Chain Encoded Address 原链编码地址           |      `5EnnmEp2R92wZ7T8J2fKMxpc1nPW5uP8r5K3YUQGiFrw8uG6`      |
|          Origin Chain Decoded Address 原链解码地址           | `0x78914a4d7a946a0e4ed641f336b498736336e05096e342c799cc33c0f868d62f` |
| Origin Chain Account Name (Westend in hex) 原链账户名称（Westend为十六进制） |                      `0x57657374656e64`                      |
| Multilocation Received in Destination Chain 目标链获得的多地点 | `{"parents":1,"interior":{"x1":{"accountId32":{"network":{"named":"0x57657374656e64"},"id":"0x78914a4d7a946a0e4ed641f336b498736336e05096e342c799cc33c0f868d62f"}}}}` |
| Multilocation-Derivative Account (32 bytes) 多地点衍生账户（32字节） | `0x4e21340c3465ec0aa91542de3d4c5f4fc1def526222c7363e0f6f860ea4e503c` |
| Multilocation-Derivative Account (20 bytes) 多地点衍生账户（20字节） |         `0x4e21340c3465ec0aa91542de3d4c5f4fc1def526`         |

The script will return 32-byte and 20-byte addresses. We’re interested in the Ethereum-style account - the 20-byte one, which is `0x4e21340c3465ec0aa91542de3d4c5f4fc1def526`. Feel free to look up your multilocation-derivative account on [Moonscan](https://moonbase.moonscan.io/){target=_blank}. Next, you can fund this account with DEV tokens. 

该脚本将返回32字节和20字节的地址。我们对以太坊形式的账户较感兴趣——20字节的账户，即`0x4e21340c3465ec0aa91542de3d4c5f4fc1def526`。请随时在[Moonscan](https://moonbase.moonscan.io/){target=_blank}上查找您的多地点衍生帐户。接下来，您可以使用DEV Token为该帐户提供资金。

--8<-- 'text/faucet/faucet-sentence.md'

## Getting the Uniswap V2 Swap Calldata 获得Uniswap V2兑换调用数据 {: #getting-uniswapv2-swap-calldata }

The following section will walk through the steps of getting the calldata for the Uniswap V2 swap, as we need to feed this calldata to the [remote EVM call](/builders/interoperability/xcm/remote-evm-calls/){target=_blank} that we will build via XCM.

以下部分将会包含获得Uniswap V2兑换调用数据的步骤，因为我们将会需要填入此调用数据至我们通过XCM构建的[远程EVM调用](/builders/interoperability/xcm/remote-evm-calls/){target=_blank}。

The function being targeted here is one from the Uniswap V2 router, more specifically [swapExactETHForTokens](https://github.com/Uniswap/v2-periphery/blob/master/contracts/UniswapV2Router02.sol#L252){target=_blank}. This function will swap an exact amount of protocol native tokens (in this case `DEV`) for another ERC-20 token. It has the following inputs:

此处的目标函数为来自Uniswap V2路由的函数其中之一，也就是[swapExactETHForTokens](https://github.com/Uniswap/v2-periphery/blob/master/contracts/UniswapV2Router02.sol#L252){target=_blank}。此函数将会把指定数量的协议原生Token（此范例中为`DEV`）兑换为其他ERC-20 Token。它需要以下参数输入：

 - Minimum amount of tokens that you expect out of the swap (accounting for slippage)
 - 您希望从兑换获得的最小数量（包含滑点）
 - Path that the take will trade (if there is no direct pool, the swap might be routed through multiple pair pools)
 - 交易路径（如果没有直接相关的池子，该兑换将会通过多个交易对池子执行）
 - Address of the recipient of the tokens swapped
 - Token兑换的接收人地址
 - The deadline (in Unix time) from which the trade is no longer valid
 - 此交易失效的期限（以Unix Time为单位）

The easiest way to get the calldata is through the [Moonbeam Uniswap V2 Demo](https://moonbeam-swap.netlify.app/){target=_blank} page. Once you go in the website, take the following steps:

获得调用数据的最简单方法为通过[Moonbeam Uniswap V2 Demo](https://moonbeam-swap.netlify.app/){target=_blank}页面。当您进入该页面，请跟随以下步骤：

 1. Set the swap **from** value and token and also set the swap **to** token. For this example, we want to swap 1 `DEV` token for `MARS`

    设置兑换的**from**数值及Token以及兑换的**to** Token。以此例子来说，我们希望能够以一个`DEV`兑换`MARS`

 2. Click on the **Swap** button. Metamask should pop up, **do not sign the transaction**

    点击**Swap**按钮。Metamask将会弹出，**请先不要签署交易**

 3. In Metamask, click on the **hex** tab, and the encoded calldata should show up

    在MetaMask中，点击**hex**标签，您将能看到编码的调用数据

 4. Click on the **Copy raw transaction data** button. This will copy the encoded calldata to the clipboard

    点击**Copy raw transaction data**按钮，这将会复制编码的调用数据至剪贴板

![Calldata for Uniswap V2 swap](/images/tutorials/interoperability/uniswapv2-swap-xcm/uniswapv2-swap-xcm-3.png)

!!! note 注意事项
    Other wallets also offer the same capabilities of checking the encoded calldata before signing the transaction.

其他钱包也提供在签署交易前查看编码调用数据的类似功能。

Once you have the encoded calldata, feel free to reject the transaction in your wallet. The swap calldata that we obtained is encoded as follows (all but the function selector are expressed in 32 bytes or 64 hexadecimal characters blobs):

当您获得编码调用数据，请在您的钱包中取消交易。我们获得的兑换调用数据编码将如以下所示（除函数选择器外的所有内容均以32字节或64 个十六进制字节二进制大型物件表示）：

 1. The function selector, which is 4 bytes long (8 hexadecimal characters) that represents the function you are calling

    函数选择器，4个字节长（8个十六进制字节）代表您调用的函数

 2. The minimum amount out of the swap that we want accounting for slippage, in this case, `10b3e6f66568aaee` is `1.2035` `MARS` tokens

    我们希望从兑换中获得的最小数量（考虑滑点），以此范例来说，`10b3e6f66568aaee`为`1.2035`个`MARS` Token

 3. The location (pointer) of the data part of the path parameter (which is of type dynamic). `80` in hex is `128` decimal, meaning that information about the path is presented after 128 bytes from the beginning (without counting on the function selector). Consequently, the next bit of information about the path is presented in element 6

    路径参数（动态类型）的数据部分的地点（指针）。`80`的十六进制表示方法具有`128`位数，代表有关路径的信息显示在从头开始的128个字节之后（不计算函数选择器）。因此，关于路径的下一位信息出现在元素6中

 4. The address receiving the tokens after the swap, in this case, is the `msg.sender` of the call

    兑换后获取Token的地址在此范例中为调用中的`msg.sender`

 5. The deadline limit for the swap

    兑换的期限限制

 6. The length of the address array representing the path

    代表路径的地址阵列长度

 7. First token involved in the swap, which is wrapped `DEV`

    首个参与兑换的Token，也就是包装的`DEV`（Wrapped DEV）

 8. Second token involved in the swap, `MARS`, so it is the last 

    第二个参与兑换的Token，`MARS`，所以其为最后一个参与Token

```
1. 0x7ff36ab5
2. 00000000000000000000000000000000000000000000000010b3e6f66568aaee -> Min Amount Out
3. 0000000000000000000000000000000000000000000000000000000000000080
4. 000000000000000000000000d720165d294224a7d16f22ffc6320eb31f3006e1 -> Receiving Address
5. 0000000000000000000000000000000000000000000000000000000063dbcda5 -> Deadline
6. 0000000000000000000000000000000000000000000000000000000000000002
7. 000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e1
8. 0000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f
```

In the calldata, we need to change three fields to ensure our swap will go through:

在调用数据中，我们需要更改三处以确保我们兑换包含以下部分：

 - The minimum amount out, to account for slippage as the pool may have a different `DEV/MARS` balance when you try this out
 - 最小出金额度（考虑滑点）。因为当你尝试这个时，池子中可能有不同的`DEV/MARS`余额
 - The receiving address to our multilocation-derivative account
 - 我们多地点衍生账户的收取地址
 - The deadline to provide a bit more flexibility for our swap, so you don't have to submit this immediately
 - 为我们的兑换提供更灵活的截止日期，因此您不必立即提交

**This is OK because we are just testing things :), do not use this code in production!** Our encoded calldata should look like this (the line breaks were left for visibility):

**目前我们仅在测试，请勿在真实的生产环境中使用此代码！**我们编码的调用数据应如下所示（为了可见性而保留换行符）：

```
0x7ff36ab5
0000000000000000000000000000000000000000000000000de0b6b3a7640000 -> New Min Amount
0000000000000000000000000000000000000000000000000000000000000080
0000000000000000000000004e21340c3465ec0aa91542de3d4c5f4fc1def526 -> New Address
0000000000000000000000000000000000000000000000000000000064746425 -> New Deadline
0000000000000000000000000000000000000000000000000000000000000002
000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e1
0000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f
```

Which, as one line, is:

以一行的方式表现如下：

```
0x7ff36ab50000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000004e21340c3465ec0aa91542de3d4c5f4fc1def52600000000000000000000000000000000000000000000000000000000647464250000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f
```

You can also get the calldata programmatically using the [Uniswap V2 SDK](https://docs.uniswap.org/sdk/v2/overview){target=_blank}.

您同样可以使用[Uniswap V2 SDK](https://docs.uniswap.org/sdk/v2/overview){target=_blank}指令获得调用数据。

## Generating the Moonbeam Encoded Callcata - 产生Moonbeam编码调用数据 {: #generating-the-moonbeam-encoded-call-data }

Now that we have the Uniswap V2 swap encoded calldata, we need to generate the bytes that the `Transact` XCM instruction from the XCM message will execute. Note that these bytes represent the action that will be executed in the remote chain. In this example, we want the XCM message execution to enter the EVM and perform the swap, from which we got the encoded calldata.

现在我们有了Uniswap V2兑换编码调用数据，我们需要生成来自XCM消息的`Transact`XCM指令将执行的字节。请注意，这些字节表示将在远程链中执行的操作。在此例子中，我们希望XCM消息执行自我们获得编码的调用数据进入EVM并进行兑换。

 To get the SCALE (encoding type) encoded calldata for the transaction parameters, we can leverage the following [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} script (note that it requires `@polkadot/api` and `ethers`).

要为交易参数获得SCALE（编码类型）编码数据，我们可以利用以下[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}脚本（请注意此处需要`@polkadot/api`和`ethers`）。


```js
import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 9.13.6
import { ethers } from 'ethers'; // Version 6.0.2

// 1. Input Data
const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';
const uniswapV2Router = '0x8a1932D6E26433F3037bd6c3A40C816222a6Ccd4';
const contractCall =
  '0x7ff36ab50000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000004e21340c3465ec0aa91542de3d4c5f4fc1def52600000000000000000000000000000000000000000000000000000000647464250000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f';

const generateCallData = async () => {
  // 2. Create Substrate API Provider
  const substrateProvider = new WsProvider(providerWsURL);
  const ethProvider = new ethers.WebSocketProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 3. Estimate Gas for EVM Call
  const gasLimit = await ethProvider.estimateGas({
    to: uniswapV2Router,
    data: contractCall,
    value: ethers.parseEther('0.01'),
  });
  console.log(`Gas required for call is ${gasLimit.toString()}`);

  // 4. Call Parameters
  const callParams = {
    V2: {
      gasLimit: gasLimit + 10000n, //Estimated plus some extra gas
      action: { Call: uniswapV2Router }, // Uniswap V2 router address
      value: ethers.parseEther('0.01'), // 0.01 DEV
      input: contractCall, // Swap encoded calldata
    },
  };

  // 5. Create the Extrinsic
  let tx = api.tx.ethereumXcm.transact(callParams);

  // 6. Get SCALE Encoded Calldata
  let encodedCall = tx.method.toHex();
  console.log(`Encoded Calldata: ${encodedCall}`);
};

generateCallData();
```

!!! note 注意事项
    You can also get the SCALE encoded calldata by manually building the extrinsic in [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}.

您也可以手动在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}构建函数以获得SCALE编码数据。

Let's go through each of the main components of the snippet shown above:

让我们检视上方代码段中的主要组成部分：

 1. Provide the input data for the call. This includes: 

     为调用提供输入数据，包含：

     - Moonbase Alpha endpoint URL to create the providers
     - Moonbase Alpha终端URL以创建提供者
     - [Uniswap V2 router address](https://moonbase.moonscan.io/address/0x8a1932d6e26433f3037bd6c3a40c816222a6ccd4#code){target=_blank} which is the one the call interacts with
     - [Uniswap V2路由地址](https://moonbase.moonscan.io/address/0x8a1932d6e26433f3037bd6c3a40c816222a6ccd4#code){target=_blank}，即调用交互的对象
     - Encoded calldata for the Uniswap V2 swap that we calculated before
     - 我们先前计算的Uniswap V2兑换编码数据

 2. Create the necessary providers. One is a [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} provider, through which we can call [Moonbeam pallets](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/){target=_blank} directly. The other one is an Ethereum API provider through Ethers.js

     创建必要的提供者。一个为[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}提供者，可以通过直接调用[Moonbeam pallets](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/){target=_blank}创建。另外一个为以太坊API提供者，可以通过Ethers.jsc创建

 3. This step is mainly a best practice. Here, we are estimating the gas of the EVM call that will be executed via XCM, as this is needed later on. You can also hardcode the gas limit value, but it is not recommended

     这一步主要是一个最佳练习。在这里，我们估算将通过XCM执行的EVM调用的gas，因为稍后需要这样做。您也可以硬编码gas limit值，但并不推荐

 4. [Build the remote EVM call](/builders/interoperability/xcm/remote-evm-calls/#build-remove-evm-call-xcm){target=_blank}. We bumped the gas by `10000` units to provide a bit of room in case conditions change. The inputs are identical to those used for the gas estimation

     [构建远程EVM调用](/builders/interoperability/xcm/remote-evm-calls/#build-remove-evm-call-xcm){target=_blank}。我们将Gas增加了`10000`个单位，以便在情况发生变化时提供处理空间。输入与用于gas估算的输入相同

 5. Create the Ethereum XCM pallet call to the `transact` method, providing the call parameters we previously built

     为`transact`函数创建以太坊XCM pallet调用，提供我们先前构建的调用参数

 6. Get the SCALE calldata of the specific transaction parameter, which we need to provide to the `Transact` XCM instruction later on. Note that in this particular scenario, because we need only the calldata of the transaction parameters, we have to use `tx.method.toHex()`

     获取特定交易参数的SCALE调用数据，我们稍后需要将其提供给`Transact`XCM 指令。请注意，在这种特定情况下，因为我们只需要交易参数的调用数据，所以我们必须使用 `tx.method.toHex()`

Once you have the code set up, you can execute it with `node`, and you'll get the Moonbase Alpha remote EVM calldata:

当您设定好代码，您可以通过`node`执行，您将会获得Moonbase Alpha远程EVM调用数据：

![Getting the Moonbase Alpha remote EVM XCM calldata for Uniswap V2 swap](/images/tutorials/interoperability/uniswapv2-swap-xcm/uniswapv2-swap-xcm-4.png)

The encoded calldata for this example is:

此处范例的编码调用数据如下：

```
0x260001f31a020000000000000000000000000000000000000000000000000000000000008a1932d6e26433f3037bd6c3a40c816222a6ccd40000c16ff286230000000000000000000000000000000000000000000000000091037ff36ab50000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000004e21340c3465ec0aa91542de3d4c5f4fc1def52600000000000000000000000000000000000000000000000000000000647464250000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f00
```

And that is it! You have everything you need to start crafting the XCM message itself! It has been a long journey, but we are almost there.

就这样！您已经了解需要创建XCM消息本身的所有细节！这是一段漫长的旅程，但我们快结束了。

## Building the XCM Message from the Relay Chain 从中继链构建XCM消息

We are almost in the last part of this tutorial! In this section, we'll craft the XCM message using the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}. We'll also dissect the message instruction per instruction to understand what is happening every step of the way.

我们即将进入本教程的最后一部分！在本部分，我们将使用[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}制作XCM消息。我们还将剖析每条指令中的消息指令，以了解每一步发生的情况。

The XCM message we are about to build is composed of the following instructions:

我们将构建的XCM消息包含以下指令：

 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} — takes funds from the account dispatching the XCM in the destination chain and puts them in holding, a special take where funds can be used for later actions
 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} — 将资金从在目标链调用XCM的账户中转移至holding，此处资金将能够在之后的操作中使用
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} — buy a certain amount of block execution time
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} — 购买指定数量的区块执行时间
 - [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} — use part of the block execution time bought with the previous instruction to execute some arbitrary bytes
 - [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} — 通过先前的指令使用部分购买的区块执行时间执行一些必要字节
 - [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} — takes assets from holding and deposits them to a given account
 - [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} — 将资产从holding中取出并转移至指定账户

To build the XCM message, which will initiate the remote EVM call through XCM, and get its SCALE encoded calldata, you can use the following snippet:

要构建一个通过XCM启用远程EVM调用的XCM消息，以及获得其SCALE编码调用数据，您可以使用以下代码段：

```js
import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 9.13.6

// 1. Input Data
const providerWsURL = 'wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network';
const amountToWithdraw = BigInt(1 * 10 ** 15); // 0.01 DEV
const devMultiLocation = { parents: 0, interior: { X1: { PalletInstance: 3 } } };
const weightTransact = BigInt(4350000000); // 25000 * Gas limit of EVM call
const multiLocAccount = '0x4e21340c3465ec0aa91542de3d4c5f4fc1def526';
const transactBytes =
  '0x260001f31a020000000000000000000000000000000000000000000000000000000000008a1932d6e26433f3037bd6c3a40c816222a6ccd40000c16ff286230000000000000000000000000000000000000000000000000091037ff36ab50000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000004e21340c3465ec0aa91542de3d4c5f4fc1def52600000000000000000000000000000000000000000000000000000000647464250000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f00';

// 2. XCM Destination (Moonbase Alpha Parachain ID 1000)
const xcmDest = { V2: { parents: 0, interior: { X1: { Parachain: 1000 } } } };

// 3. XCM Instruction 1
const instr1 = {
  WithdrawAsset: [
    {
      id: { Concrete: devMultiLocation },
      fun: { Fungible: amountToWithdraw },
    },
  ],
};

// 4. XCM Instruction 2
const instr2 = {
  BuyExecution: {
    fees: {
      id: { Concrete: devMultiLocation },
      fun: { Fungible: amountToWithdraw },
    },
    weightLimit: 'Unlimited',
  },
};

// 5. XCM Instruction 3
const instr3 = {
  Transact: {
    originType: 'SovereignAccount',
    requireWeightAtMost: weightTransact,
    call: {
      encoded: transactBytes,
    },
  },
};

// 6. XCM Instruction 4
const instr4 = {
  DepositAsset: {
    assets: { Wild: 'All' },
    max_assets: 1,
    beneficiary: {
      parents: 0,
      interior: { X1: { AccountKey20: { network: 'Any', key: multiLocAccount } } },
    },
  },
};

// 7. Build XCM Message
const xcmMessage = { V2: [instr1, instr2, instr3, instr4] };

const generateCallData = async () => {
  // 8. Create Substrate API Provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 9. Create the Extrinsic
  let tx = api.tx.xcmPallet.send(xcmDest, xcmMessage);

  // 6. Get SCALE Encoded Calldata
  let encodedCall = tx.toHex();
  console.log(`Encoded Calldata: ${encodedCall}`);
};

generateCallData();
```

!!! note 注意事项
    You can also get the SCALE encoded calldata by manually building the extrinsic in [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=_blank}.

您也可以在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=_blank}中手动构建函数以获得SCALE编码调用数据。

Let's go through each of the main components of the snippet shown above:

让我们检视上方代码段的主要组成部分：

 1. Provide the input data for the call. This includes:

     为调用提供输入数据，包含：

     - Moonbase Alpha relay chain endpoint URL to create the provider
     - Moonbase Alpha中继链终端URL以创建提供者
     - Amount of tokens (in Wei) to withdraw from the multilocation-derivative account. For this example, `0.01` tokens are more than enough. To understand how to get this value, please refer to the [XCM fee page](/builders/interoperability/xcm/fees/#moonbeam-reserve-assets){target=_blank}
     - 从多地点衍生账户中提取的Token数量（以Wei为单位）。以此例子来说，`0.01`个Token绰绰有余。要了解如何获取此值，请参考[XCM费用页面](/builders/interoperability/xcm/fees/#moonbeam-reserve-assets){target=_blank}
     - The [multilocation of the `DEV` token](/builders/interoperability/xcm/xc-integration/#register-moonbeams-asset-on-your-parachain){target=_blank} as seen by Moonbase Alpha
     - Moonbase Alpha上看到的[`DEV` Token的多地点](/builders/interoperability/xcm/xc-integration/#register-moonbeams-asset-on-your-parachain){target=_blank}
     - The weight for the `transact` XCM instruction. This can be obtained by multiplying `25000` and the gas limit obtained before. It is recommended to add approximately 10% more of the estimated value. You can read more about this value in the [Remote EVM Calls through XCM](/builders/interoperability/xcm/remote-evm-calls/#build-xcm-remote-evm){target=_blank} page
     - `transact`XCM指令的权重。这可以通过将`25000`和之前获得的gas limit相乘得到。建议增加大约10%的估计值。您可以在[通过XCM进行远程EVM调用](/builders/interoperability/xcm/remote-evm-calls/#build-xcm-remote-evm){target=_blank}页面中阅读有关此数值的更多信息
     - The multilocation-derivative account as it will be needed later for an XCM instruction
     - 多地点衍生账户，因其将会在其后的XCM指令中用到
     - The bytes for the `transact` XCM instruction that we calculated in the previous section
     - 我们在先前教程中计算的`transact` XCM指令字节

 2. Define the destination multilocation for the XCM message. In this case, it is the Moonbase Alpha parachain

     为XCM消息定义目标多地点。在此例中为Moonbase Alpha平行链

 3. First XCM instruction, `WithdrawAsset`. You need to provide the asset multilocation and the amount you want to withdraw. Both variables were already described before

     首个XCM指令，`WithdrawAsset`。您需要提供资产多地点以及您希望提取的数量，两个变量皆已在先前提及

 4. Second XCM instruction, `BuyExecution`. Here, we are paying for Moonbase Alpha block execution time in `DEV` tokens by providing its multilocation and the amount we took out with the previous instruction. Next, we are buying all the execution we can (`Unlimited` weight) with `0.001 DEV` tokens which should be around 20 billion weight units, plenty for our example

     第二个XCM指令，`BuyExecution`。在此，我们通过提供`DEV` Token的多地点和我们用之前的指令取出的数量来支付Moonbase Alpha块执行时间。接下来，我们用`0.001 DEV` Token购买所有可能的执行（`Unlimited`权重），这应该是大约200亿个权重单位，对于我们的范例来说足够了

 5. Third XCM instruction, `Transact`. The instruction will use a portion of the weight bought (defined as `requireWeightAtMost`) and execute the arbitrary bytes that are provided (`transactBytes`)

     第三个XCM指令，`Transact`。此指令将会使用购买的部分权重（被定义为`requireWeightAtMost`）并执行必提供的任意字节（`transactBytes`）

 6. Fourth XCM instruction, `DepositAsset`. Whatever is left in holding after the actions executed before (in this case, it should be only `DEV` tokens) is deposited to the multilocation-derivative account, set as the `beneficiary`.

     第四个XCM指令，`DepositAsset`。在之前执行的操作之后剩下的任何东西（在这种情况下，它应该为`DEV` Token）被存入多地点衍生账户，设置为 `beneficiary`。

 7. Build the XCM message by concatenating the instructions inside a `V2` array

     通过连接`V2`阵列中的指令构建XCM消息

 8. Create the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} provider

     创建[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}提供者

 9. Craft the `xcmPallet.send` extrinsic with the destination and XCM message. This method will append the [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} XCM instruction to our XCM message, and it is the instruction that will provide the necessary information to calculate the multilocation-derivative account

     使用目标链和XCM消息制作外部的`xcmPallet.send`函数。此函数会将[`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} XCM指令附加到我们的XCM消息中，该指令将提供必要的信息计算多地点衍生账户

 10. Get the SCALE encoded calldata. Note that in this particular scenario, because we need the full SCALE encoded calldata, we have to use `tx.toHex()`. This is because we will submit this transaction using the calldata
     获取SCALE编码调用数据。请注意，在这种特定情况下，因为我们需要完整的SCALE编码调用数据，所以我们必须使用`tx.toHex()`。这是因为我们将使用调用数据提交此交易

!!! challenge 挑战
    Try a more straightforward example and perform a balance transfer from the multilocation-derivative account to any other account you like. You'll have to build the SCALE encoded calldata for a `balance.Transfer` extrinsic or create the Ethereum call as a balance transfer transaction.

您可以尝试一个更直接的范例，并执行从多地点衍生账户到您喜欢的任何其他账户的余额转移。您必须为`balance.Transfer` extrinsic构建SCALE编码调用数据，或者创建以太坊调用作为余额转账交易。

Once you have the code set up, you can execute it with `node`, and you'll get the relay chain XCM calldata:

当您设定好代码，您可以通过`node`执行，您将会获得中继链XCM调用数据：

![Getting the Relay Chain XCM calldata for Uniswap V2 swap](/images/tutorials/interoperability/uniswapv2-swap-xcm/uniswapv2-swap-xcm-5.png)

The encoded calldata for this example is:

此范例的编码调用数据如下：

```
0x410604630000000100a10f021000040000010403000f0080c6a47e8d03130000010403000f0080c6a47e8d030006010780bb470301fd04260001f31a020000000000000000000000000000000000000000000000000000000000008a1932d6e26433f3037bd6c3a40c816222a6ccd40000c16ff286230000000000000000000000000000000000000000000000000091037ff36ab50000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000004e21340c3465ec0aa91542de3d4c5f4fc1def52600000000000000000000000000000000000000000000000000000000647464250000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f000d010004000103004e21340c3465ec0aa91542de3d4c5f4fc1def526
```

Now that we have the SCALE encoded calldata, the last step is to submit the transaction, which will send our XCM message to Moonbase Alpha, and do the remote EVM call!

现在我们已经拥有了SCALE编码调用数据，最后一个步骤是提交交易，交易将会传送我们XCM消息至Moonbase Alpha并执行远程EVM调用。

## Sending the XCM Message from the Relay Chain 从中继链传送XCM消息

This section is where everything comes together and where the magic happens! Let's recap what we've done so far:

此部分教程将会综合所有上述内容，让我们复习我们先前做了什么：

 - We've created a relay chain account that is funded with `UNIT` tokens (relay chain native tokens)
 - 我们创建了一个拥有`UNIT` Token（中继链原生Token）的中继链账户
 - We determined its multilocation-derivative account on Moonbase Alpha and funded this new address with `DEV` tokens (Moonbase Alpha native token)
 - 我们决定了其在Moonbase Alpha上的多地点衍生账户并使此新地址拥有足够的`DEV` Token（Moonbase Alpha原生Token）
 - We obtained the Uniswap V2 swap calldata, in which we'll be swapping `0.01 DEV` token for `MARS`, an ERC-20 that exists in Moonbase Alpha. We had to modify a couple of fields to adapt it to this particular example
 - 我们获得了Uniswap V2兑换编码调用数据，其中我们将使用`0.01 DEV` Token兑换成`MARS`（Moonbase Alpha中的ERC-20格式Token）。我们同样还更改了部分内容以使其符合此特例
 - We built the SCALE encoded calldata in Moonbase Alpha to access its EVM via XCM
 - 我们在Moonbase Alpha中构建了SCALE编码调用数据以通过XCM访问EVM
 - We crafted our transaction to send an XCM message to Moonbase Alpha, in which we will ask it to execute the SCALE encoded calldata that was previously built. This, in turn, will execute an EVM call which will perform the Uniswap V2 swap for the precious `MARS` tokens!
 - 我们设计了我们的交易以向Moonbase Alpha发送一条XCM消息，我们将在其中要求它执行之前构建的SCALE编码调用数据。反过来，这将执行一个EVM调用，该调用将为`MARS` Token执行Uniswap V2兑换！

To send the XCM message that we built in the previous section, you can use the following code snippet:

如要传送我们先前教程中构建的XCM消息，您可以使用以下代码段：

```js
import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 9.13.6
import Keyring from '@polkadot/keyring'; // Version 10.3.1

// 1. Input Data
const providerWsURL = 'wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network';
const mnemonic = 'INSERT_MNEMONIC_HERE'; // Not safe, only for testing
const txCall =
  '0x410604630001000100a10f021000040000010403000f0080c6a47e8d03130000010403000f0080c6a47e8d030006010780bb470301fd04260001f31a020000000000000000000000000000000000000000000000000000000000008a1932d6e26433f3037bd6c3a40c816222a6ccd40000c16ff286230000000000000000000000000000000000000000000000000091037ff36ab50000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000004e21340c3465ec0aa91542de3d4c5f4fc1def52600000000000000000000000000000000000000000000000000000000647464250000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f000d010004000103004e21340c3465ec0aa91542de3d4c5f4fc1def526';

// 2. Create Keyring Instance
const keyring = new Keyring({ type: 'sr25519' });

const sendXCM = async () => {
  // 3. Create Substrate API Provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 4. Create Account from Mnemonic
  const alice = keyring.addFromUri(mnemonic);

  // 5. Create the Extrinsic
  let tx = await api.tx(txCall).signAndSend(alice, (result) => {
    // 6. Check Transaction Status
    if (result.status.isInBlock) {
      console.log(`Transaction included in blockHash ${result.status.asInBlock}`);
    }
  });
};

sendXCM();
```

Once you have the code set up, you can execute it with `node`, and the XCM message will be sent to initiate your Uniswap V2 swap in Moonbase Alpha:

当您设定好代码，您可以通过`node`执行，该XCM消息将会被传送以执行您在Moonbase Alpha上的Uniswap V2兑换：

![Sending the XCM message from the Relay Chain to Moonbase Alpha for the Uniswap V2 swap](/images/tutorials/interoperability/uniswapv2-swap-xcm/uniswapv2-swap-xcm-6.png)

And that is it! You've sent an XCM message which performed a remote EVM call via  XCM and resulted in an Uniswap V2-styled swap in Moonbase Alpha. But let's go into more detail about what happened.

就是这样！您发送了一条XCM消息，该消息通过XCM执行了远程EVM调用，并在Moonbase Alpha中产生了Uniswap V2格式的交换。但是，让我们来更详细地了解究竟发生什么事情。

This action will emit different events. The first one is the only relevant [in the relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0x85cad5f3cef5d578f6acc60c721ece14842be332fa333c9b9eafdfe078bc0290){target=_blank}, and it is named `xcmPallet.Sent`, which is from the `xcmPallet.send` extrinsic. In [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer/query/0x1f60aeb1f2acbc2cf6e19b7ad969661f21f4847f7b40457c459e7d39f6bc0779){target=_blank}, the following events emitted by the `parachainSystem.setValidationData` extrinsic (where all the inbound XCM messages are processed) are of interest:

此操作将触发不同的事件。第一个是[与中继链中](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam .network#/explorer/query/0x85cad5f3cef5d578f6acc60c721ece14842be332fa333c9b9eafdfe078bc0290){target=_blank}唯一相关，它被命名为`xcmPallet.Sent`，其来自`xcmPallet.send` extrinsic。在[Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer/query/0x1f60aeb1f2acbc2cf6e19b7ad969661f21f4847f7b40457c459e7d=37blankbtargetc){target=_blank}中，来自`parachainSystem.setValidationData` extrinsic（处理所有输入XCM消息）的以下事件值得关注：

 - `parachainSystem.DownwardMessagesReceived` — states that there was an XCM message received
 - `parachainSystem.DownwardMessagesReceived` — 收到XCM消息时的状态
 - `evm.Log` — internal events emitted by the different contract calls. The structure is the same: contract address, the topics, and relevant data
 - `evm.Log` — 不同合约调用发出的内部事件。结构皆相同：合约地址、主题和相关数据
 - `ethereum.Executed` — contains information on the `from` address, the `to` address, and the transaction hash of an EVM call done
 - `ethereum.Executed` — 包含有关`from`地址、`to`地址和已完成EVM调用的交易哈希的信息
 - `polkadotXcm.AssetsTrapped` — flags that some assets were in holding and were not deposited to a given address. If the `Transact` XCM instruction does not exhaust the tokens allocated to it, it will execute a [`RefundSurplus`](https://github.com/paritytech/xcm-format#refundsurplus){target=_blank} after the XCM is processed. This instruction will take any leftover tokens from the execution bought and put them in holding. We could prevent this by adjusting the fee provided to the `Transact` instruction, or by adding the instruction right after the `Transact`
 - `polkadotXcm.AssetsTrapped` — holding中未存入给定地址的部分资产的标志。如果`Transact` XCM指令没有用尽分配给它的Token，它将在XCM被执行之后执行[`RefundSurplus`](https://github.com/paritytech/xcm-format#refundsurplus){target=_blank}。该指令将从购买的执行中取出任何剩余的Token并将其转移至holding。我们可以通过调整提供给`Transact`指令的费用，或者在`Transact`之后立即添加指令来防止这种情况
 - `dmpQueue.ExecutedDownward` — states the result of executing a message received from the relay chain (a DMP message). In this case, the `outcome` is marked as `Complete`
 - `dmpQueue.ExecutedDownward` — 说明执行从中继链接收到已执行的消息（DMP消息）的结果。在这种情况下，`outcome`被标记为`Complete`

Our XCM was successfully executed! If you visit [Moonbase Alpha Moonscan](https://moonbase.moonscan.io/){target=_blank} and search for [the transaction hash](https://moonbase.moonscan.io/tx/0xdb0705ae31aa046ba2797f0d85fab29c0f94299263ae4e184dce69a93d341d26){target=_blank}, you'll find the Uniswap V2 swap that was executed via the XCM message.

我们的XCM已成功执行！如果您访问[Moonbase Alpha Moonscan](https://moonbase.moonscan.io/){target=_blank}并搜索[交易哈希](https://moonbase.moonscan.io/tx/0xdb0705ae31aa046ba2797f0d85fab29c0f94299263ae4e184dce69a93d341d26){target =_blank}，你将能发现通过XCM消息执行的Uniswap V2兑换。

!!! challenge 挑战
    Do a Uniswap V2 swap of `MARS` for any other token you want. Note that in this case, you'll have to remote execute an ERC-20 `approve` via XCM first to allow the Uniswap V2 Router to spend the tokens on your behalf. Once the aproval is done, you can send the XCM message for the swap itself.

为您想要的任何其他Token执行`MARS`的Uniswap V2兑换。请注意，在这种情况下，您必须首先通过XCM远程执行ERC-20 `approve`，以允许Uniswap V2路由代表您使用Token。在成功批准后，您将可以发送兑换本身的XCM消息。

--8<-- 'text/disclaimers/educational-tutorial.md'
