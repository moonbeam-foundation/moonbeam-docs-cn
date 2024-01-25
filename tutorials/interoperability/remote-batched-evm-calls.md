---
title: 通过XCM执行远程批量EVM调用
description: 在本教程中，我们将通过XCM使用远程EVM执行，并结合批量预编译，通过XCM在Moonbeam的EVM中远程执行多个合约调用。
template: main.html
---

# 通过XCM执行远程批量EVM调用

_作者：Kevin Neilson_

## 概览 {: #introduction }

在本教程中，我们将使用波卡的通用消息传递协议[XCM](/builders/interoperability/xcm/overview/){target=_blank}从中继链（对于Moonbeam来说为Polkadot）发起一系列远程批量EVM调用。为此，我们将使用独特的XCM指令组合，允许您[通过XCM消息调用Moonbeam EVM](/builders/interoperability/xcm/remote-evm-calls/){target=_blank}。本教程的独特之处在于，我们将使用Moonbeam的[Batch Precompile](/builders/pallets-precompiles/precompiles/batch/){target=_blank}来将多个EVM调用组合成单个交易进行处理，而不是依次执行单个远程EVM合约调用。

要遵循本教程操纵之前，您需要先熟悉[通过XCM执行远程EVM调用](/builders/interoperability/xcm/remote-evm-calls/){target=_blank}和Moonbeam的[Batch Precompile](/builders/pallets-precompiles/precompiles/batch/){target=_blank}。

**本教程的内容仅用于教育目的！**

在本示例中，我们将在Moonbase Alpha（Moonbeam TestNet）上进行操作，其拥有自己的中继链，称为[Moonbase relay](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=\_blank}（类似于波卡中继链）。中继链Token为UNIT，而Moonbase Alpha的Token为DEV。请注意，**发送错误的XCM消息可能导致资金丢失。**因此，XCM功能需要先在测试网上进行测试后再将其移到生产环境。

本教程的目的展示[批量预编译](/builders/pallets-precompiles/precompiles/batch/){target=\_blank}如何与[波卡的XCM](/builders/interoperability/xcm/overview/){target=\_blank}允许您在Moonbeam上触发远程批量EVM调用。为了简化本教程的复杂性，我们实际操作的批量EVM调用将非常简单。我们将在[Moonbase Alpha上发行多个planet ERC-20测试token](https://moonbase-minterc20.netlify.app/){target=\_blank}。尽管我们选择了简单的合约调用来进行演示，但您可能希望模拟更多现实生活中的DeFi示例，例如Token批准和兑换、从多个池中领取奖励，或者兑换并存入LP池。

在本教程中，我们将通过XCM执行批量EVM调用的账户称为Alice。接下来，让我们来解析一下本教程的流程：

1. Alice在中继链上有一个账户，她想要使用[Moonbase Minter](https://moonbase-minterc20.netlify.app/){target=_blank} mint Mars (MARS)和Neptune (NEPT) Token（即Moonbase Alpha上的ERC-20）。Alice需要从她的中继链账户发送XCM消息至Moonbase Alpha
2. Moonbase Alpha将接收XCM消息并执行其指令。这些指令说明Alice想要在Moonbase Alph中购买一些块执行时间，并执行对Moonbase批量预编译的调用，该调用由两个不同的mint调用组成。批量EVM调用通过Alice在Moonbase Alpha上通过XCM消息控制的特殊账户进行调度。 此账户称为[multilocation衍生账户](/builders/interoperability/xcm/xcm-transactor/#general-xcm-definitions){target=_blank}。即使这是一个无密钥账户（私钥未知），公共地址也可以[以确定性方式计算](/builders/interoperability/xcm/remote-evm-calls/#calculate-multilocation-derivative){target=_blank}
3. 成功的XCM执行将导致EVM执行mint命令，Alice将在她的特殊账户中收到她的MARS和NEPT Token
4. 通过XCM的远程EVM执行将产生一些EVM日志，这些日志由浏览器收集。任何人都可以验证EVM交易和收据

通过XCM调度的远程批量EVM调用的“满意路径”如下所示：

![Remote batch EVM call via XCM diagram](/images/tutorials/interoperability/remote-batched-evm-calls/remote-batched-evm-calls-1.png)

## 查看先决条件 {: #checking-prerequisites }

根据[概览](#introduction)中总结的所有步骤，需要考虑以下先决条件：

- 您需要在中继链上拥有UNIT，在发送XCM时用于支付交易费用。如果您有一个拥有DEV Token的Moonbase Alpha账户，您可以在[Moonbeam Swap](https://moonbeam-swap.netlify.app/#/swap){target=\_blank}将一些DEV Token兑换成xcUNIT。然后使用[apps.moonbeam.network](https://apps.moonbeam.network/moonbase-alpha/){target=\_blank}从Moonbase Alpha提取一些xcUNIT至[Moonbase中继链上的账户](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=\_blank}
  --8<-- 'text/_common/faucet/faucet-list-item.md'
- 您的[multilocation衍生账户](/builders/interoperability/xcm/xcm-transactor/#general-xcm-definitions){target=_blank}必须持有DEV Token以调用Batch Precompile，并支付XCM执行费用（虽然此费用将以xcUNIT形式的UNIT Token进行支付）。我们将在下一个部分计算multilocation衍生账户地址

## 计算您的Multilocation衍生账户 {: #calculating-your-multilocation-derivative-account }

--8<-- 'text/builders/interoperability/xcm/calculate-multilocation-derivative-account.md'

在本示例中，我们将通过XCM从Alice的账户（即`5Fe4nNwxJ9ai9hVkUubiy4e6BVs1tzJGDLXAdhUKuePq9CLp`）发送远程EVM调用。由于我们将从中继链发送XCM指令，因此命令中省略了平行链ID。父值`1`表示中继链为目标平行链父链。命令和响应如下图所示：

![Calculating the multilocation-derivative account](/images/tutorials/interoperability/remote-batched-evm-calls/remote-batched-evm-calls-2.png)

下方表格涵盖了所有值：

|              名称               |                                  值                                  |
|:-------------------------------:|:--------------------------------------------------------------------:|
|          源链编码地址           |          `5Fe4nNwxJ9ai9hVkUubiy4e6BVs1tzJGDLXAdhUKuePq9CLp`          |
|          源链解码地址           | `0x9e263df66ff98212347e9a6b51d56f7a982bc25bb1300cd20e5a68d726789043` |
| Multilocation衍生账户（32字节） | `0xf0615483cbe76f5b2aa80a8ce2b2e9a8206deb65b8a1323270e25802f600f95c` |
| Multilocation衍生账户（20字节） |             `0xf0615483cbe76f5b2aa80a8ce2b2e9a8206deb65`             |

此脚本将返回32字节和20字节的地址。我们将使用以太坊格式的地址，也就是20字节的地址：`0xf0615483cbe76f5b2aa80a8ce2b2e9a8206deb65`。您可以根据需求在[Moonscan](https://moonbase.moonscan.io/){target=_blank}上查看您的multilocation衍生账户。接下来，您可以为此账户充值DEV Token。

--8<-- 'text/_common/faucet/faucet-sentence.md'

## 准备Mint EVM Calldata {: #preparing-the-mint-evm-calldata }

首先，我们将生成mint MARS和NEPT Token所需的calldata。然后，我们将引用批量预编译来将调用批处理为单个调用。

此处将要使用的函数为[Moonbase Minter](https://moonbase-minterc20.netlify.app/){target=\_blank}的`mint`函数。此函数没有参数，其calldata与其他planet一致。但是，每个planet有不同的合约地址。

获取calldata最简便的方式是通过[Moonbase Minter](https://moonbase-minterc20.netlify.app/){target=\_blank}页面获取。进入页面后，执行以下步骤：

 1. 点击**Connect MetaMask**并解锁钱包
 2. 点击任一**Mint**按钮，因其均拥有同样的calldata
 3. 然后，MetaMask将跳出弹窗，但**请勿签署交易**。在MetaMask中，点击**hex**标签，随后将会出现编码的calldata
 4. 点击**Copy raw transaction data**按钮。这将复制编码的calldata至剪贴板：`0x2004ffd9`

![Calldata for Minting action](/images/tutorials/interoperability/remote-batched-evm-calls/remote-batched-evm-calls-3.png)

!!! 注意事项
    其他钱包也提供相同的功能，可以在签署交易之前检查编码的calldata。

## 准备批量Calldata {: #preparing-the-batched-calldata }

现在我们有了用于mint操作的calldata，我们可以使用批量预编译将多个调用合并为一个调用。批量预编译提供了几种不同的方法，根据您对子调用失败的承受程度对交易进行批处理。在本示例中，我们将使用`batchAll`函数，如果单个子调用失败，该函数将恢复所有子调用。关于批量预编译每个函数的运作方式，请查看完整的[批量预编译教程](/builders/pallets-precompiles/precompiles/batch/){target=\_blank}。

用于本教程目的，我们将使用[Remix](http://remix.ethereum.org/){target=\_blank}可视化和构造我们的calldata。如需要，[批量预编译页面](/builders/pallets-precompiles/precompiles/batch/#remix-set-up){target=\_blank}提供了分步教程，引导您如何在Remix中使用批量预编译开始操作。

首先，复制[`Batch.sol`](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam/master/precompiles/batch/Batch.sol){target=\_blank}并编译它。从Remix的**Deploy**标签下，将Remix的环境指定为**Injected Web3**，并确保您的钱包已切换至Moonbase Alpha网络。由于这是一个预编译，因此我们无需部署任何东西，而是在其各自的地址访问批量预编译：

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.batch }}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.batch }}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.batch }}
     ```

输入地址并点击**At Address**，然后执行以下步骤准备批处理调用：

1. 展开**batchAll**或批量预编译的其他所需方法
2. 在**To**字段中，将MARS和NEPT合约的地址放在引号中并用逗号分隔。整行应该用括号括起来，具体如下所示：`["0x1FC56B105c4F0A1a8038c2b429932B122f6B631f","0xed13B028697febd70f34cf9a9E280a8f1E98FD29"]`
3. 在值字段中提供一个空白数组 (`[]`)。我们不想向合约发送任何Token，因为它们不是支付合约
4. 在`callData`字段中，提供`["0x2004ffd9","0x2004ffd9"]`。请注意您需要为每个调用提供calldata，即使在calldata是一致的情况下，例如两者均为`mint`调用
5. （可选）您可以指定gas限制，但这非必要，因此只需提供一个空白数组（`[]`）
6. 要验证您是否已正确配置调用，您可以按**Transact**，但请勿在钱包中确认交易。如果出现错误，请仔细检查每个参数的格式是否正确
7. MetaMask将跳出弹窗，但**请勿签署交易**。在MetaMask中，点击**hex**标签，随后将出现编码后的calldata
8. 点击**Copy raw transaction data**按钮。这将批量调用的编码calldata复制到剪贴板

![Generate batch calls using Batch Precompile](/images/tutorials/interoperability/remote-batched-evm-calls/remote-batched-evm-calls-4.png)

现在，我们已经完成了批量调用EVM calldata的准备工作。接下来，我们需要准备XCM指令，用于执行远程批量调用。

## 生成Moonbeam编码的Callcata {: #generating-the-moonbeam-encoded-call-data }

现在我们有了包含两个mint命令的批量EVM calldata，我们需要生成XCM消息中的`Transact` XCM指令将执行的字节。请注意，这些字节表示将在远程链中执行的操作。在此示例中，我们希望XCM消息执行进入EVM并发出两个mint命令，从中我们获得编码后的calldata。

要获取交易参数的SCALE（编码类型）编码的calldata，我们可以利用以下[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank}脚本 ( 请注意，这需要用到`@polkadot/api`）。

```js
--8<-- 'code/tutorials/interoperability/remote-batched-evm-calls/generate-moonbeam-encoded-calldata.js'
```

!!! 注意事项
    您也可以通过在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=\_blank}中手动构建extrinsic来获取SCALE编码的calldata。

接下来，让我们看一下上面显示的代码片段的每个主要组件：

 1. 提供请求的输入数据。这包括：

     - 创建提供商的Moonbase Alpha端点URL
     - 批量预编译的地址
     - 包含两个mint命令的批量调用的编码calldata

 2. 创建所需的提供商。其中一个为[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank}提供商，通过此提供商我们可以直接调用[Moonbeam pallets](/builders/pallets-precompiles/pallets/){target=\_blank}
 3. 为了简单起见，我们对gas限制进行了硬编码，并避免批量预编译导致的gas预估问题
 4. [构建包含批量调用的远程EVM调用](/builders/interoperability/xcm/remote-evm-calls/#build-remove-evm-call-xcm){target=_blank}
 5. 创建对`transact`函数的Ethereum XCM pallet调用，提供上方指定的调用参数
 6. 获取特定交易参数的SCALE calldata，稍后我们需要将其提供给`Transact` XCM指令。请注意，在这个特定场景中，因为我们只需要交易参数的calldata，所以我们必须使用`tx.method.toHex()`

代码设置完毕后，您可以使用`node`执行它。并且您将获取Moonbase Alpha远程EVM calldata：

![Getting the Moonbeam calldata for the remote evm call](/images/tutorials/interoperability/remote-batched-evm-calls/remote-batched-evm-calls-5.png)

本示例的编码calldata如下所示：

```text
0x260001f0490200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008080000000000000000000000000000000000000000000000000000000000000000110896e292b8000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000000020000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f000000000000000000000000ed13b028697febd70f34cf9a9e280a8f1e98fd29000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000042004ffd90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000042004ffd900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
```

这样就可以了！您已拥有开始制作XCM消息所需要的一切！

## 从中继链构建XCM消息 {: #building-the-xcm-message-relay-chain }

我们即将进入本教程的最后一个部分！在此部分中，我们将使用[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank}制作XCM消息。我们将根据指令分解消息指令，深入了解每个部分的具体情况。

我们即将构建的XCM消息由以下指令组成：

 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} — 从目标链中调度XCM的账户中提取资金，并将其存放在可用于后续操作的地方
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} — 购买一定数量的区块执行时间
 - [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} — 使用前一条指令购买的部分区块执行时间来执行一些任意字节
 - [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} — 从持有的资产中提取资产并将其存入指定账户

要构建XCM消息（该消息将通过XCM发起远程EVM调用）并获取其SCALE编码的calldata，您可以使用以下代码片段：

```js
--8<-- 'code/tutorials/interoperability/remote-batched-evm-calls/build-xcm-message.js'
```

!!! 注意事项
    您也可以通过在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=\_blank}中手动构建extrinsic来获取SCALE编码的calldata。

接下来，让我们看一下上面显示的代码片段的每个主要组件：

 1. 提供请求的输入数据。这包括：

     - 创建提供商的[Moonbase中继链](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}端点URL
     - 从multilocation衍生账户提取的Token数量（以Wei为单位）。在本示例中，`0.01` Token已经足够了。想要了解如何获取此值，请参考[XCM费用页面](/builders/interoperability/xcm/fees/#moonbeam-reserve-assets){target=_blank}
     - [DEV token的multilocation](/builders/interoperability/xcm/xc-registration/assets/#register-moonbeam-native-assets){target=_blank}，如Moonbase Alpha所见
     - `transact` XCM指令的权重。这可以通过将`25000`乘以之前获得的gas限制来获得。建议在预估值的基础上增加10%左右。您可以在[通过XCM远程EVM调用](/builders/interoperability/xcm/remote-evm-calls/#build-xcm-remote-evm){target=_blank}的页面获取关于此值的更多信息
     - multilocation衍生账户，这将用于后续XCM指令
     - 我们上一部分计算的`transact` XCM指令的字节

 2. 定义XCM消息的目标multilocation。在本示例中为Moonbase Alpha平行链
 3. 第一个XCM指令`WithdrawAsset`。您需要提供资产multilocation以及您想要提取的金额。这两个变量已在之前描述过
 4. 第二个XCM指令`BuyExecution`。在这里，我们通过提供其multilocation和我们用上一个指令提取的金额，以DEV Token支付Moonbase Alpha区块的执行时间。接下来，我们将使用`0.01 DEV` token购买我们可以购买的所有执行（`Unlimited`权重），这应该约为200亿个权重单位，对于本示例来说足够了
 5. 第三个XCM指令`Transact`。该指令将使用购买的一部分权重（定义为`requireWeightAtMost`）并执行提供的任意字节（`transactBytes`）
 6. 第四个XCM指令`DepositAsset`。执行之前的操作后剩下的部分（在本例中，应该只是DEV Token）都会存入multilocation衍生账户，设置为`beneficiary`
 7. 通过连接`V3`数组内的指令来构建XCM消息
 8. 创建[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}提供商
 9. 使用目的地和XCM消息制作`xcmPallet.send` extrinsic。此方法会将[`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} XCM指令附加到我们的XCM消息中，该指令将提供计算multilocation衍生账户所需的信息
 10. 获取SCALE编码的calldata。请注意在此特殊场景中，由于我们需要完整的SCALE编码calldata，我们必须使用`tx.toHex()`。因此意味着我们将使用calldata提交此交易。

代码设置完毕后，您可以使用`node`执行它。并且您将获取中继链XCM calldata：

![Getting the Relay Chain XCM calldata for the Remote Batch call](/images/tutorials/interoperability/remote-batched-evm-calls/remote-batched-evm-calls-6.png)

本示例的编码calldata如下所示：

```text
0xcd0a04630003000100a10f031000040000010403000f0000c16ff28623130000010403000f0000c16ff28623000601070053cd200a02350c007d09260001f0490200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008080000000000000000000000000000000000000000000000000000000000000000110896e292b8000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000000020000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f000000000000000000000000ed13b028697febd70f34cf9a9e280a8f1e98fd29000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000042004ffd90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000042004ffd9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d010000010300f0615483cbe76f5b2aa80a8ce2b2e9a8206deb65
```

!!! 注意事项
    您的编码calldata应该略有不同，因为您需要将脚本中的multilocation衍生账户替换为您在[计算Multilocation衍生帐户](#calculate-your-multilocation-derivative-account)部分中创建的帐户。

现在我们已经有了SCALE编码的calldata，最后一步是提交交易，这会将我们的XCM消息发送到Moonbase Alpha，并执行远程批量EVM调用！

## 从中继链发送XCM消息 {: #send-xcm-message-relay-chain }

恭喜您已经进入最后一个部分。让我们先回顾一下目前所完成的内容：

 - 我们已经创建了一个中继链账户，并为此账户充值了UNIT Token（中继链原生Token）
 - 我们在Moonbase Alpha上确定了其multilocation衍生账户，并为此账户充值了DEV Token
 - 我们获取了批量预编译calldata，其中结合了MARS和NEPT ERC-20 Token的两个mint调用
 - 我们在Moonbase Alpha中构建了SCALE编码的calldata，以通过XCM访问其EVM
 - 我们创建了交易，向Moonbase Alpha发送一条XCM消息，在该消息中我们将要求它执行之前构建的SCALE编码的calldata。 反过来，这将执行对批量预编译的调用，其中包括对MARS和 NEPT ERC-20 Token的mint调用！

要发送我们在上一节中构建的XCM消息，您可以使用以下代码片段：

```js
--8<-- 'code/tutorials/interoperability/remote-batched-evm-calls/send-xcm-message.js'
```

代码设置完毕后，您可以使用`node`执行它，这将发送XCM消息以发起对Moonbase Alpha中的MARS和NEPT ERC-20 Token的批量预编译的调用。如果您看到`Abnormal Closure`错误提示，请不要担心。您可以通过在[Moonbase Moonscan](https://moonbase.moonscan.io/){target=_blank}上查找您的multilocation衍生账户来验证远程批量调用是否成功。

![Sending the XCM message from the Relay Chain to Moonbase Alpha for the batch EVM call](/images/tutorials/interoperability/remote-batched-evm-calls/remote-batched-evm-calls-7.png)

这样就可以了！您已成功发送一条XCM消息，这将通过XCM对批量预编译执行远程EVM调用并铸造 MARS和NEPT ERC-20 Token。接下来，让我们详细了解发生了什么。

此操作将发出不同的事件。第一个仅与[中继链](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/10936471){target=\_blank}相关，其名称为 `xcmPallet.Sent`，来自于`xcmPallet.send` extrinsic。在[Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/explorer/query/4626493){target=\_blank}中，以下事件将由`parachainSystem.setValidationData` extrinsic发出，此外部函数将处理所有的入站XCM消息：

 - `parachainSystem.DownwardMessagesReceived` — 表明收到了XCM消息
 - `evm.Log` — 不同合约调用发出的内部事件。结构相同，为：合约地址、主题、相关数据
 - `ethereum.Executed` — 包含有关`from`地址、`to`地址以及EVM调用完成的交易哈希的信息
 - `polkadotXcm.AssetsTrapped` — 标记某些资产已被持有且未存入给定地址。如果`Transact` XCM指令没有用完分配给它的Token，它将在处理XCM之后执行[`RefundSurplus`](https://github.com/paritytech/xcm-format#refundsurplus){target=_blank}。该指令将从购买的执行中取出所有剩余的Token并将其持有。我们可以通过调整提供给`Transact`指令的费用或在`Transact`之后添加指令来防止这种情况发生
 - `dmpQueue.ExecutedDownward` — 表示执行从中继链接收到的消息（DMP消息）的结果。在此情况下，`outcome`被标记为`Complete`

XCM已成功被执行！如果您访问[Moonbase Alpha Moonscan](https://moonbase.moonscan.io/){target=\_blank}并搜索[交易哈希](https://moonbase.moonscan.io/tx/0xd5e855bc3ade42d040f3c29abe129bd8f488dee0014e731eba4617883aac3891){target=\_blank}，您将找到通过XCM消息执行的批量预编译调用。请注意，每个planet每小时只能调用一次`mint`命令。如果您想进一步操作并执行其他mint调用，只需在配置批量调用时将目标合约地址更改为不同的planet即可。

!!! 挑战
    通过XCM使用批量预编译和远程EVM调用，将MARS批准和Uniswap V2兑换结合到您想要的任何其他Token。作为一个想法实验，请仔细考虑哪种批量预编译方法最适合结合批准和交换交易。[通过XCM从波卡进行Uniswap V2兑换教程](/tutorials/interoperability/uniswapv2-swap-xcm/){target=\_blank}和[批量预编译教程](/tutorials/eth-api/batch-approve-swap/){target=\_blank}将能帮助您快速操作。

--8<-- 'text/_disclaimers/educational-tutorial.md'
