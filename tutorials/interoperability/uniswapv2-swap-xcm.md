---
title: 通过XCM从波卡中执行在Moonbeam上的Uniswap V2兑换
description: 在本教程中，我们将通过XCM使用远程EVM执行进行一个Uniswap V2兑换，以展示互连合约中如何使用Moonbeam。
template: main.html 
---

# 通过XCM在波卡中执行Uniswap V2兑换

_作者：Alberto Viera_

## 概览 {: #introduction }

在本教程中，我们将在中继链（即波卡相对于Moonbeam的关系）使用名为[XCM](/builders/interoperability/xcm/overview/){target=_blank}的波卡原生互操作通用消息传递协议来演示一个Uniswap V2风格的兑换。为此，我们将使用特定的XCM指令组合，允许您[通过XCM消息调用Moonbeam的EVM](/builders/xcm/remote-evm-calls/){target=_blank}。因此，任何能够向Moonbeam发送XCM消息的区块链都可以利用Moonbeam的EVM以及构建在其之上的所有dApp。

**本教程中的内容仅用于教育用途！**

在此范例中，您将在Moonbase Alpha（Moonbeam TestNet）上操作，它拥有自己的中继链（类似于波卡）。中继链Token称为`UNIT`，而Moonbase Alpha的Token则称为`DEV`。在测试网中执行此操作不如在真正的生产环境中执行此操作有趣，但是**开发人员必须了解发送不正确的XCM消息会导致资金损失。**因此，在真正的生产环境中执行前，于测试网中测试XCM功能是必要的。

在此教程中，我们将执行Uniswap V2兑换的账户命名为Alice。此教程包含许多跳转的内容部分，因此让我们先将其整理总结成列表以及流程图：

1. Alice在中继链上拥有一个账户，她希望在[Moonbeam-Swap](https://moonbeam-swap.netlify.app){target=_blank}（Moonbase Alpha上的Uniswap V2克隆演示版本）将`DEV` Token兑换成`MARS` Token（Moonbase Alpha上的ERC-20 Token）。Alice此时需要自其中继链账户传送一个XCM消息至Moonbase Alpha
2. XCM消息将由Moonbase Alpha接收并执行其指令。这些指令表明Alice打算在Moonbase Alpha中购买一些区块执行时间并执行对Moonbase的EVM的调用，具体来说是Uniswap V2（Moonbeam-Swap）路由合约。EVM调用是通过XCM消息经由在Moonbase Alpha上Alice控制的一个特殊账户发送的。此帐户称为[多地点衍生账户](/builders/xcm/xcm-transactor/#general-xcm-definitions){target=_blank}。即使这是一个无密钥帐户（私钥未知），公共地址可以[以确定性的方式计算](/builders/xcm/remote-evm-calls/#calculate-multilocation-derivative){target=_blank}
3. XCM执行将会导致兑换经由EVM执行，而Alice将会在其特别账户获得其`MARS` Token
4. 经由XCM的远程EVM执行将会得到浏览器获取的一些EVM记录，有任何人皆能够查询验证的EVM交易和收据

![Remote EVM Call Through XCM for Uniswap V2 Swap Diagram](/images/tutorials/interoperability/uniswapv2-swap-xcm/uniswapv2-swap-xcm-1.png)

如要执行上述列出的步骤，将需要满足一些先决条件，马上查看有哪些先决条件吧！

## 查看先决条件 {: #checking-prerequisites }

所有在[概览](#introduction)部分中列出的步骤皆需满足以下的先决条件：

- 您需要在中继链上拥有UNIT来支付发送XCM时所需的交易费用。如果您有一个具有DEV Token的Moonbase Alpha帐户，您可以在[Moonbeam Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}上用一些DEV交换xcUNIT。然后从Moonbase Alpha通过[apps.moonbeam.network](https://apps.moonbeam.network/moonbase-alpha/){target=_blank}提现xcUNIT到[您在Moonbase中继链上的账户](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}。
- 您的[多地点衍生账户](/builders/xcm/xcm-transactor/#general-xcm-definitions){target=_blank}必须持有`DEV` Token来为Uniswap V2兑换提供资金，以及支付XCM的执行费用（尽管这可以用UNIT Token以`xcUNIT`方式支付）。我们将在下一节中计算多地点衍生账户的地址

--8<-- 'text/_common/faucet/faucet-sentence.md'

## 计算您的多地点衍生账户 {: #calculating-your-multilocation-derivative-account }

--8<-- 'text/builders/interoperability/xcm/calculate-multilocation-derivative-account.md'

以我们的例子来说，我们将会通过Alice账户经由XCM传送远程EVM调用，也就是`5GKh9gMK5dn9SJp6qfMNcJiMMnY7LReYmgug2Fr5fKE64imn`，因此指令和获得的结果将会如同下方图示。

![Calculating the multilocation-derivative account](/images/tutorials/interoperability/uniswapv2-swap-xcm/uniswapv2-swap-xcm-2.png)

所有数值被整理成以下表格：

|           名称           |                                 数值                                 |
|:------------------------:|:--------------------------------------------------------------------:|
|       原链编码地址       |          `5GKh9gMK5dn9SJp6qfMNcJiMMnY7LReYmgug2Fr5fKE64imn`          |
|       原链解码地址       | `0xbc5f3c61709f218d983fc773a600958a07fb18047418df7eeb0501d0679e397a` |
| 多地点衍生账户（32字节） | `0x61cd3e07fe7d7f6d4680e3e322986b7877f108ddb18ec02c2f17e82fe15f9016` |
| 多地点衍生账户（20字节） |             `0x61cd3e07fe7d7f6d4680e3e322986b7877f108dd`             |

该脚本将返回32字节和20字节的地址。我们关心的是以太坊形式的账户——20字节的账户，即`0x61cd3e07fe7d7f6d4680e3e322986b7877f108dd`。请随时在[Moonscan](https://moonbase.moonscan.io/){target=_blank}上查找您的多地点衍生帐户。接下来，您可以使用DEV Token为该帐户提供资金。

--8<-- 'text/_common/faucet/faucet-sentence.md'

## 获得Uniswap V2兑换调用数据 {: #getting-uniswapv2-swap-calldata }

以下部分将会包含获得Uniswap V2兑换调用数据的步骤，因为我们将会需要填入此调用数据至我们通过XCM构建的[远程EVM调用](/builders/interoperability/xcm/remote-evm-calls/){target=_blank}。

此处的目标函数为来自Uniswap V2路由的函数其中之一，也就是[swapExactETHForTokens](https://github.com/Uniswap/v2-periphery/blob/master/contracts/UniswapV2Router02.sol#L252){target=\_blank}。此函数将会把指定数量的协议原生Token（此范例中为`DEV`）兑换为其他ERC-20 Token。它需要以下参数输入：

 - 您希望从兑换获得的最小数量（考虑滑点）
 - 交易路径（如果没有直接相关的池子，该兑换将会通过多个交易对池子执行）
 - Token兑换的接收人地址
 - 此交易失效的期限（以Unix Time为单位）

获得调用数据的最简单方法为通过[Moonbeam Uniswap V2 Demo](https://moonbeam-swap.netlify.app/){target=\_blank}页面。当您进入该页面，请跟随以下步骤：

 1. 设置兑换的**from**数值及Token以及兑换的**to** Token。以此例子来说，我们希望能够以0.01 `DEV`兑换`MARS`
 2. 点击**Swap**按钮。MetaMask将会弹出，**请不要签署交易**
 3. 在MetaMask中，点击**hex**标签，您将能看到编码的调用数据
 4. 点击**Copy raw transaction data**按钮，这将会复制编码的调用数据至剪贴板

![Calldata for Uniswap V2 swap](/images/tutorials/interoperability/uniswapv2-swap-xcm/uniswapv2-swap-xcm-3.png)

!!! 注意事项
    其他钱包也提供在签署交易前查看编码调用数据的类似功能。

当您获得编码调用数据，请在您的钱包中取消交易。我们获得的兑换调用数据编码将如以下所示（除函数选择器外的所有内容均以32字节或64个十六进制字符表示）：

 1. 函数选择器，4个字节长（8个十六进制字符）代表您调用的函数
 2. 我们希望从兑换中获得的最小数量（考虑滑点），以此范例来说，`10b3e6f66568aaee`为`1.2035`个`MARS` Token
 3. 路径参数（动态类型）的数据部分的位置（指针）。十六进制的`80`是十进制的`128`，代表有关路径的信息显示在从头开始的128个字节之后（不包括函数选择器）。因此，关于路径的下一位信息出现在第6个元素中
 4. 兑换后接收Token的地址，在此范例中为调用中的`msg.sender`
 5. 兑换的期限限制
 6. 代表路径的地址数组的长度
 7. 首个参与兑换的Token，也就是进行了包装的`DEV`（Wrapped DEV）
 8. 第二个参与兑换的Token，`MARS`，所以其为最后一个参与Token

```text
1. 0x7ff36ab5
2. 00000000000000000000000000000000000000000000000010b3e6f66568aaee -> Min Amount Out
3. 0000000000000000000000000000000000000000000000000000000000000080
4. 000000000000000000000000d720165d294224a7d16f22ffc6320eb31f3006e1 -> Receiving Address
5. 0000000000000000000000000000000000000000000000000000000063dbcda5 -> Deadline
6. 0000000000000000000000000000000000000000000000000000000000000002
7. 000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e1
8. 0000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f
```

在调用数据中，我们需要更改三处以确保我们的兑换会成功：

 - 最小出金额度（考虑滑点）。因为当你尝试这个时，池子中可能有不同的`DEV/MARS`余额
 - 我们多地点衍生账户的收取地址
 - 为我们的兑换提供更灵活的截止日期，这样您就不必立即提交

**目前我们仅在测试，请勿在真实的生产环境中使用此代码！**我们编码的调用数据应如下所示（为了可见性而保留换行符）：

```text
0x7ff36ab5
0000000000000000000000000000000000000000000000000de0b6b3a7640000 -> New Min Amount
0000000000000000000000000000000000000000000000000000000000000080
00000000000000000000000061cd3e07fe7d7f6d4680e3e322986b7877f108dd -> New Address
00000000000000000000000000000000000000000000000000000000A036B1B9 -> New Deadline
0000000000000000000000000000000000000000000000000000000000000002
000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e1
0000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f
```

以一行的方式表现如下：

```text
0x7ff36ab50000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000061cd3e07fe7d7f6d4680e3e322986b7877f108dd00000000000000000000000000000000000000000000000000000000A036B1B90000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f
```

您同样可以使用[Uniswap V2 SDK](https://docs.uniswap.org/sdk/v2/overview){target=\_blank}以编程的方式获得调用数据。

## 生成Moonbeam编码调用数据 {: #generating-the-moonbeam-encoded-call-data }

现在我们有了Uniswap V2兑换编码调用数据，我们需要生成来自XCM消息的`Transact`XCM指令将执行的字节。请注意，这些字节表示将在远程链中执行的操作。在此例子中，我们希望XCM消息执行自我们获得编码的调用数据进入EVM并进行兑换。

要为交易参数获得SCALE（编码类型）编码数据，我们可以利用以下[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank}脚本（请注意此处需要`@polkadot/api`和`ethers`）。

```js
--8<-- 'code/tutorials/interoperability/uniswapv2-swap/generate-moonbeam-encoded-calldata.js'
```

!!! 注意事项
    您也可以手动在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=\_blank}构建函数以获得SCALE编码数据。

让我们检视上方代码段中的主要组成部分：

 1. 为调用提供输入数据，包含：

     - Moonbase Alpha终端URL以创建providers（提供者）
     - [Uniswap V2路由地址](https://moonbase.moonscan.io/address/0x8a1932d6e26433f3037bd6c3a40c816222a6ccd4#code){target=\_blank}，即调用交互的对象
     - 我们先前计算的Uniswap V2兑换编码数据

 2. 创建必要的providers。一个为[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank} provider，我们可以通过它直接调用[Moonbeam pallets](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/){target=\_blank}。另外一个为以太坊API provider，可以通过Ethers.js创建
 3. 这一步主要是一个最佳做法。在这里，我们估算将通过XCM执行的EVM调用的gas，因为稍后需要。您也可以硬编码gas limit值，但并不推荐
 4. [构建远程EVM调用](/builders/interoperability/xcm/remote-evm-calls/#build-remove-evm-call-xcm){target=_blank}。我们将Gas增加了`10000`个单位，以便在情况发生变化时提供处理空间。输入与用于gas估算的输入相同
 5. 为`transact`函数创建以太坊XCM pallet调用，提供我们先前构建的调用参数
 6. 获取特定交易参数的SCALE调用数据，我们稍后需要将其提供给`Transact` XCM指令。请注意，在这种特定情况下，因为我们只需要交易参数的调用数据，所以我们必须使用 `tx.method.toHex()`

当您设定好代码，您可以通过`node`执行，您将会获得Moonbase Alpha远程EVM调用数据：

![Getting the Moonbase Alpha remote EVM XCM calldata for Uniswap V2 swap](/images/tutorials/interoperability/uniswapv2-swap-xcm/uniswapv2-swap-xcm-4.png)

此处范例的编码调用数据如下：

```text
0x260001eeed020000000000000000000000000000000000000000000000000000000000008a1932d6e26433f3037bd6c3a40c816222a6ccd40000c16ff286230000000000000000000000000000000000000000000000000091037ff36ab50000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000061cd3e07fe7d7f6d4680e3e322986b7877f108dd00000000000000000000000000000000000000000000000000000000a036b1b90000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f00
```

就这样！您已经了解需要创建XCM消息本身的所有细节！这是一段漫长的旅程，但我们快结束了。

## 从中继链构建XCM消息 {: #building-the-xcm-message-relay-chain }

我们即将进入本教程的最后一部分！在本部分，我们将使用[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank}制作XCM消息。我们还将剖析消息的每条指令，以了解每一步发生的情况。

我们将构建的XCM消息包含以下指令：

 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} — 将资金从在目标链调用XCM的账户中转移至holding，此处资金将能够在之后的操作中使用
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} — 购买指定数量的区块执行时间
 - [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} — 使用部分前一条指令购买的区块执行时间执行一些任意字节
 - [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} — 将资产从holding中取出并存入至指定账户

要构建一个通过XCM启用远程EVM调用的XCM消息，以及获得其SCALE编码调用数据，您可以使用以下代码段：

```js
--8<-- 'code/tutorials/interoperability/uniswapv2-swap/build-xcm-message.js'
```

!!! 注意事项
    您也可以在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=\_blank}中手动构建函数以获得SCALE编码调用数据。

让我们检视上方代码段的主要组成部分：

 1. 为调用提供输入数据，包含：

     - Moonbase Alpha中继链终端URL以创建provider
     - 从多地点衍生账户中提取的Token数量（以Wei为单位）。以此例子来说，`0.01`个Token绰绰有余。要了解如何获取此值，请参考[XCM费用页面](/builders/interoperability/xcm/fees/#moonbeam-reserve-assets){target=_blank}
     - Moonbase Alpha上看到的[`DEV` Token的多地点](/builders/interoperability/xcm/xc-registration/assets/#register-moonbeam-native-assets){target=_blank}
     - `transact` XCM指令的权重。这可以通过将`25000`和之前获得的gas limit相乘得到。建议增加大约10%的估计值。您可以在[通过XCM进行远程EVM调用](/builders/interoperability/xcm/remote-evm-calls/#build-xcm-remote-evm){target=_blank}页面中阅读有关此数值的更多信息
     - 多地点衍生账户，因其将会在其后的XCM指令中用到
     - 我们在先前教程中计算的`transact` XCM指令字节

 2. 为XCM消息定义目标多地点。在此例中为Moonbase Alpha平行链
 3. 首个XCM指令，`WithdrawAsset`。您需要提供资产多地点以及您希望提取的数量，两个变量皆已在先前提及
 4. 第二个XCM指令，`BuyExecution`。在此，我们通过提供`DEV` Token的多地点和我们用之前的指令取出的数量来支付Moonbase Alpha区块执行时间。接下来，我们用`0.001 DEV` Token购买所有可能的执行（`Unlimited`权重），这应该是大约200亿个权重单位，对于我们的范例来说足够了
 5. 第三个XCM指令，`Transact`。此指令将会使用购买的部分权重（被定义为`requireWeightAtMost`）并执行提供的任意字节（`transactBytes`）
 6. 第四个XCM指令，`DepositAsset`。在之前执行的操作之后剩下的在holding里的任何东西（在这种情况下，它应该为`DEV` Token）被存入多地点衍生账户，设置为 `beneficiary`。
 7. 通过在`V2`数组中连接指令构建XCM消息
 8. 创建[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} provider
 9. 使用目标链和XCM消息制作`xcmPallet.send`函数。此函数会将[`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} XCM指令附加到我们的XCM消息中，该指令将提供必要的信息计算多地点衍生账户
 10. 获取SCALE编码调用数据。请注意，在这种特定情况下，因为我们需要完整的SCALE编码调用数据，所以我们必须使用`tx.toHex()`。这是因为我们将使用调用数据提交此交易

!!! 挑战
    您可以尝试一个更直接的范例，并执行从多地点衍生账户到您喜欢的任何其他账户的余额转移。您必须为`balance.Transfer` extrinsic构建SCALE编码调用数据，或者创建以太坊调用作为余额转账交易。

当您设定好代码，您可以通过`node`执行，您将会获得中继链XCM调用数据：

![Getting the Relay Chain XCM calldata for Uniswap V2 swap](/images/tutorials/interoperability/uniswapv2-swap-xcm/uniswapv2-swap-xcm-5.png)

此范例的编码调用数据如下：

```text
0x4d0604630003000100a10f031000040000010403000f0000c16ff28623130000010403000f0000c16ff286230006010700902f500982b92a00fd04260001eeed020000000000000000000000000000000000000000000000000000000000008a1932d6e26433f3037bd6c3a40c816222a6ccd40000c16ff286230000000000000000000000000000000000000000000000000091037ff36ab50000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000061cd3e07fe7d7f6d4680e3e322986b7877f108dd00000000000000000000000000000000000000000000000000000000a036b1b90000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f000d01000001030061cd3e07fe7d7f6d4680e3e322986b7877f108dd
```

现在我们已经拥有了SCALE编码调用数据，最后一个步骤是提交交易，交易将会传送我们XCM消息至Moonbase Alpha并执行远程EVM调用。

## 从中继链发送XCM消息 {: #send-xcm-message-relay-chain }

此部分教程将会综合所有上述内容，让我们复习我们先前做了什么：

 - 我们创建了一个拥有`UNIT` Token（中继链原生Token）的中继链账户
 - 我们决定了其在Moonbase Alpha上的多地点衍生账户并使此新地址拥有足够的`DEV` Token（Moonbase Alpha原生Token）
 - 我们获得了Uniswap V2兑换编码调用数据，其中我们将使用`0.01 DEV` Token兑换成`MARS`（Moonbase Alpha中的ERC-20格式Token）。我们同样还更改了部分内容以使其符合此特例
 - 我们在Moonbase Alpha中构建了SCALE编码调用数据以通过XCM访问EVM
 - 我们设计了我们的交易以向Moonbase Alpha发送一条XCM消息，我们将在其中要求它执行之前构建的SCALE编码调用数据。接着，这将执行一个EVM调用，该调用将为`MARS` Token执行Uniswap V2兑换！

如要发送我们先前教程中构建的XCM消息，您可以使用以下代码段：

```js
--8<-- 'code/tutorials/interoperability/uniswapv2-swap/send-xcm-message.js'
```

当您设定好代码，您可以通过`node`执行，该XCM消息将会被发送以执行您在Moonbase Alpha上的Uniswap V2兑换：

![Sending the XCM message from the Relay Chain to Moonbase Alpha for the Uniswap V2 swap](/images/tutorials/interoperability/uniswapv2-swap-xcm/uniswapv2-swap-xcm-6.png)

就是这样！您发送了一条XCM消息，该消息通过XCM执行了远程EVM调用，并在Moonbase Alpha中产生了Uniswap V2格式的交换。但是，让我们来更详细地了解究竟发生什么事情。

此操作将触发不同的事件。第一个是[在中继链中](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0x85cad5f3cef5d578f6acc60c721ece14842be332fa333c9b9eafdfe078bc0290){target=\_blank}唯一相关的，它被命名为`xcmPallet.Sent`，其来自`xcmPallet.send` extrinsic。在[Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer/query/0x1f60aeb1f2acbc2cf6e19b7ad969661f21f4847f7b40457c459e7d39f6bc0779){target=\_blank}中，来自`parachainSystem.setValidationData` extrinsic（处理所有输入XCM消息）的以下事件值得关注：

 - `parachainSystem.DownwardMessagesReceived` — 表示收到一个XCM消息
 - `evm.Log` — 不同合约调用发出的内部事件。结构皆相同：合约地址、主题和相关数据
 - `ethereum.Executed` — 包含有关`from`地址、`to`地址和已完成EVM调用的交易哈希的信息
 - `polkadotXcm.AssetsTrapped` — 标记了部分资产仍在holding中未存入给定地址。如果`Transact` XCM指令没有用尽分配给它的Token，它将在XCM被执行之后执行[`RefundSurplus`](https://github.com/paritytech/xcm-format#refundsurplus){target=_blank}。该指令将从购买的执行中取出任何剩余的Token并将其转移至holding。我们可以通过调整提供给`Transact`指令的费用，或者在`Transact`之后立即添加指令来防止这种情况
 - `dmpQueue.ExecutedDownward` — 说明执行从中继链接收到的消息（DMP消息）的结果。在这种情况下，`outcome`被标记为`Complete`

我们的XCM已成功执行！如果您访问[Moonbase Alpha Moonscan](https://moonbase.moonscan.io/){target=\_blank}并搜索[交易哈希](https://moonbase.moonscan.io/tx/0x3fd96c5c7a82cd0b54c654f64d41879814d94a3ad9b66820f2be2fe7fc2a18eb){target =_blank}，你将能发现通过XCM消息执行的Uniswap V2兑换。

!!! 挑战
    为您想要的任何其他Token执行`MARS`的Uniswap V2兑换。请注意，在这种情况下，您必须首先通过XCM远程执行一个ERC-20 `approve`，以允许Uniswap V2路由代表您使用Token。在成功批准后，您将可以发送兑换本身的XCM消息。

--8<-- 'text/_disclaimers/educational-tutorial.md'
