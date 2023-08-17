---
title: 通过XCM远程调用EVM
description: 如何通过XCM从任何已建立XCM通道的波卡平行链远程调用Moonbeam EVM上的智能合约
---

# 通过XCM远程调用EVM

![Remote EVM Calls Banner](/images/builders/interoperability/xcm/remote-evm-calls/xcmevm-banner.png)

## 概览 {: #introduction}

[XCM Transactor pallet](/builders/interoperability/xcm/xcm-transactor/){target=_blank}提供了一个能够通过XCM进行远程跨链调用的简易接口。然而，这并没有考虑对Moonbeam的EVM进行远程调用的可能性，而只是对Substrate特定的pallets（功能）进行调用。

Moonbeam的EVM仅能通过[Ethereum Pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum){target=_blank}访问。除此之外，这个pallet在将交易放入交易池前处理交易的某些验证步骤。接着，它会将池子中的交易插入区块之前执行其他的验证步骤。最后，它会通过`transact`函数提供接口以执行经过验证的交易。以上所有步骤在结构和签名机制方面都遵循与以太坊交易相同的步骤。

但是，您无法直接通过一个XCM [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank}调用[Ethereum Pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum){target=_blank}。主要因为远程EVM调用的调度者账户（在以太坊中为`msg.sender`）并不会在Moonbeam端签署XCM交易。XCM extrinsic会在其原始链中签名，接着XCM执行器会通过[`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank}指令，让与原链中的发送者链接的已知调用者调度调用的动作。在这种情况下，Ethereum Pallet将会无法验证签名，及最终的验证交易步骤。

为解决此问题，引入了[Ethereum XCM Pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}。它充当XCM [Transact](https://github.com/paritytech/xcm-format#transact){target=_blank}指令和[Ethereum Pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum){target=_blank}之间的中间件，因为在通过XCM远程执行EVM调用时需要特别注意。Pallet将执行必要的检查并验证交易。接着，Pallet会调用Ethereum Pallet将交易派遣给EVM。根据访问EVM的方式，常规和远程EVM的调用之间存在一些差异。

下列流程图描绘了通过XCM进行常规和远程EVM调用的路径：

![Happy path for regular and remote EVM calls through XCM](/images/builders/interoperability/xcm/remote-evm-calls/xcmevm-1.png)

本教程将介绍常规和远程EVM调用之间的差异。此外将展示如何通过[Ethereum XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}中函数执行远程EVM调用。

!!! 注意事项
    远程EVM调用通过[XCM Transactor Pallet](/builders/interoperability/xcm/xcm-transactor/){target=_blank}完成。因此，建议您在尝试通过XCM执行远程EVM调用之前熟悉XCM Transactor概念。

**请注意，通过XCM对Moonbeam执行EVM的远程调用仍在积极开发中**。此外，**开发人员必须了解，发送不正确的XCM消息将导致资金损失。**因此，在迁移到生产环境之前须在测试网上测试XCM功能。

## 相关XCM定义 {: #general-xcm-definitions }

--8<-- 'text/xcm/general-xcm-definitions2.md'

- **Multilocation衍生账户** — 这会生成一个无密钥帐户，该帐户从由 [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} XCM指令和提供的Multilocation设置的新来源所衍生。对于基于Moonbeam的网络，[衍生函数](https://github.com/moonbeam-foundation/moonbeam/blob/v0.31.1/primitives/xcm/src/location_conversion.rs#L31-L37){target=_blank}计算Multilocation的`blake2`哈希，包括原始平行链ID，并截取正确长度的哈希（以太坊格式的帐户为20个字节）。XCM调用[原转换](https://github.com/paritytech/polkadot/blob/master/xcm/xcm-executor/src/lib.rs#L343){target=_blank}在`Transact`指令执行时发生。因此，每条平行链都可以使用自己想要的程序转换来源，因此发起交易的用户可能在每条平行链上拥有不同的衍生账户。该衍生账户用于支付交易费用，并被设置为调用的调度者
- **交换信息** — 与XCM Transactor extrinsic的XCM远程执行部分的额外权重和费用信息有关。这部分为必要的，因主权账户将支付XCM交易费用。因此，XCM Transactor就计算费用数值，并向XCM Transactor extrinsic的发送方收取相应[XC-20 Token](/builders/interoperability/xcm/xc20/overview/){target=_blank}的估计数量以偿还主权账户

## 通过XCM执行常规和远程EVM调用的差异 {: #differences-regular-remote-evm}

正如[概览](#introduction)中所解释的，常规和远程EVM调用到达EVM的路径是完全不同的，其主要原因是交易的调度程序。

一个常规的EVM调用有一个明显的发送者使用其私钥签署以太坊交易。该签名，也就是ECDSA类型的签名，可以通过签名消息和签名算法生成的`r-s`值进行验证。而以太坊签名使用一个额外的变量，称为`v`，为恢复标识符。

通过远程EVM调用，签名者在另一条链中签署XCM交易。Moonbeam接收到后，必须使用以下指令构建的XCM消息如下：

- [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank}
- [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank}
- [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank}
- [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank}

第一条指令`DescendOrigin`将通过[XCM相关定义部分](#general-xcm-definitions)中描述的**Multilocation衍生账户**机制在Moonbeam端转移XCM调用的源头。远程EVM调用是从该无密钥帐户（或相关的[代理](/tokens/manage/proxy-accounts/){target=_blank}）派遣的。因此，由于交易并没有签署，它没有真正签名的`v-r-s`值，反而会是`0x1`。

由于远程EVM调用没有签名的实际`v-r-s`值，因此EVM交易哈希可能存在冲突问题，因为它被计算为已签名交易blob的keccak256哈希。如果两个具有相同随机数的账户提交相同的交易对象，它们最终会得到相同的EVM交易哈希。因此，所有远程EVM交易都使用附加到[Ethereum XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}中的全网随机数。

另一个显着差异是在Gas价格方面。远程EVM调用的费用依照XCM的执行层收取。因此，EVM级别的Gas价格为零，EVM不会因执行本身收费。这也可以从远程EVM调用交易的接收收据中看出。因此，XCM消息必须被配置，以便让`BuyExecution`函数能够购买足够的权重来支付Gas的成本。

最后一个区别是Gas限制。以太坊使用Gas计量系统来调节可以在一个区块中完成的执行量。相反，Moonbeam使用的是[基于权重系统](https://docs.substrate.io/build/tx-weights-fees/){target=_blank}，其中每个调用的特点是在一个区块中执行所花费的时间。每个重量单位对应于一皮秒的执行时间。

XCM队列的配置表明XCM消息应该设置为`20,000,000,000`权重单位（即`0.02`秒的区块执行时间）内可被执行。假设XCM消息因给定区块中的执行时间不足而无法执行，并且权重要求超过`20,000,000,000`。在这种情况下，XCM消息将被标记为`overweight`，并且只能通过民主的方式执行。

每条XCM消息的`20,000,000,000`权重限制设置了可用于通过XCM进行远程EVM调用的Gas限制。对于所有基于Moonbeam的网络，比率为[`25,000` Gas单位每单位权重](https://github.com/moonbeam-foundation/moonbeam/blob/v0.32.1/runtime/moonbase/src/lib.rs#L386){target=_blank} ([`WEIGHT_REF_TIME_PER_SECOND`](https://paritytech.github.io/substrate/master/frame_support/weights/constants/constant.WEIGHT_REF_TIME_PER_SECOND.html){target=_blank} / [`GAS_PER_SECOND`](https://github.com/moonbeam-foundation/moonbeam/blob/v0.32.1/runtime/moonbase/src/lib.rs#L382){target=_blank})。考虑到您需要一些XCM消息权重来自行执行XCM指令。因此，远程EVM调用可能还剩下大约`18,000,000,000`的重量，即`720,000` Gas单位。因此，您可以为远程EVM调用提供的最大Gas限制约为`720,000`个Gas单位。请注意，此数值可能会在未来发生变化。

简单来说，以下为常规和远程EVM调用之间的主要区别：

- 远程EVM调用使用全网随机数（由[Ethereum XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}拥有）而不是每个账户的随机数
- 远程EVM调用的签名的`v-r-s`值为`0x1`。无法通过一般函数从签名中检索发送者（例如，通过[ECRECOVER](/builders/pallets-precompiles/precompiles/eth-mainnet/#verify-signatures-with-ecrecover){target=_blank}）。然而，`from`被包含在交易收据和通过哈希获取交易数据时（使用以太坊 JSON RPC）
- 所有远程EVM调用的Gas为零。EVM执行在XCM执行层而非在EVM层收费
- 您可以为远程EVM调用设置的当前最大Gas限制为`720,000` Gas单位

## Ethereum XCM Pallet接口 {: #ethereum-xcm-pallet-interface}

### Extrinsics {: #extrinsics }

Ethereum XCM Pallet提供以下extrinsics（函数），可以通过`Transact`指令调用以通过XCM访问Moonbeam的EVM：

- **transact**(xcmTransaction) — 通过XCM远程调用EVM的函数。只能通过执行XCM消息调用
- **transactThroughProxy**(transactAs, xcmTransaction) — 类似于`transact` extrinsic，但此函数使用`transactAs`作为附加字段。此函数允许从具有已知密钥（`msg.sender`）的给定帐户派遣远程EVM调用。此帐户需要将**multilocation衍生账户**设置为Moonbeam上类型为`any`的代理账户。相反而言，远程EVM调用的调度将失败。交易费用仍由**multilocation衍生账户**支付

其中需要提供的输入可以被定义为如下：

- **xcmTransaction** — 包含将被调度的调用的以太坊交易细节。这包括调用数据、`msg.value`和Gas限制
- **transactAs** — 远程EVM调用将被派遣的帐户（`msg.sender`）。此部分设置的帐户需要将**multilocation衍生账户**设置为Moonbeam上类型为`any`的代理账户。交易费用仍将由**multilocation衍生账户**支付

## 通过XCM构建一个远程EVM调用 {: #build-remove-evm-call-xcm}

本教程涵盖使用从中继链到Moonbase Alpha的[XCM Pallet](https://github.com/paritytech/polkadot/blob/master/xcm/pallet-xcm/src/lib.rs){target=_blank}为远程EVM调用构建XCM消息。详细而言，它将使用`transact`函数。使用`transactThroughProxy`函数的步骤则是相同的。但是，您需要提供`transactAs`帐户并确保该帐户已将**multilocation衍生账户**设置为Moonbase Alpha上的`any`类型的代理账户。

!!! 注意事项
    当在使用`transactThroughProxy`时，只要此帐户已将**multilocation衍生账户**设置为您正在使用的基于Moonbeam的网络中类型为`any`的代理，EVM调用将根据您提供的**transactAs**帐户调度，并作为`msg.sender`。但是，交易费用仍由**multilocation衍生账户**支付，因此您需要确保它有足够的资金来支付这些费用。

### 查看先决条件 {: #ethereumxcm-check-prerequisites}

为了能够从中继链在程序中发送调用请求，您需要具备以下条件：

- 一个在中继链上拥有资金（UNIT）的[账户](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}以支付交易费用。您可以通过在[Moonbeam-Swap](https://moonbeam-swap.netlify.app){target=_blank}上交换DEV Token（Moonbase Alpha的原生Token）来获得一些xcUNIT，此为先前在Moonbase Alpha演示的克隆Uniswap-V2。接着[将它们发送到中继链](/builders/interoperability/xcm/xc20/xtokens/){target=_blank}。此外，您也可以[联系我们](https://discord.gg/PfpUATX){target=_blank}直接获取一些UNIT Token
- 为**multilocation衍生账户**提供资金，您可以按照[下一部分](#calculate-multilocation-derivative){target=_blank}中的步骤获得该账户。该账户必须有足够的DEV Token（或Moonbeam/Moonriver网络中的GLMR/MOVR）来支付远程EVM调用的XCM执行成本。请注意，此衍生账户是将发送远程EVM调用的帐户（`msg.sender`）。因此，帐户必须满足正确执行EVM调用所需的任何条件。例如，如果您正在执行ERC-20转账，请确保拥有任何相关的ERC-20 Token

!!! 注意事项
    假设您正在使用`transactThroughProxy`函数，在这种情况下，`transactAs`帐户必须满足正确执行EVM调用所需的任何条件，因为它将作为`msg.sender`。但是，**multilocation衍生账户**需要持有DEV Token（或Moonbeam/Moonriver网络中的GLMR/MOVR）以支付远程EVM调用的XCM执行成本的账户。

### 计算Multilocation衍生账户 {: #calculate-multilocation-derivative}

如先前所述，远程EVM调用是从被称为**multilocation衍生账户**的帐户派遣的。这是使用[`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank}指令提供的信息计算的。因此，计算账户直接取决于指令的构造方式。

举例来说，从中继链中，[`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank}指令是由[XCM Pallet](https://github.com/paritytech/polkadot/blob/master/xcm/pallet-xcm/src/lib.rs){target=_blank}本地输入的。在Moonbase Alpha的中继链（基于Westend）的情况下，具有以下格式（multilocation连接）：

```js
{
  DescendOrigin: {
    X1: {
      AccountId32: {
        network: { westend: null },
        id: decodedAddress,
      },
    },
  },
}
```

此处`decodedAddress`与在中继链上签署交易的账户地址（解码的32位字节格式）有关。您可以确保您的地址可通过以下的代码段正确解码，下方代码将会在需要时解码地址，并在不需要时忽略它：

```js
import { decodeAddress } from '@polkadot/util-crypto';
const decodedAddress = decodeAddress('INSERT_ADDRESS');
```

当XCM指令在Moonbeam（此例中为Moonbase Alpha）执行后，Origin将会被转化为以下multilocation：

```js
{
  DescendOrigin: {
    parents: 1,
    interior: {
      X1: {
        AccountId32: {
          network: { westend: null },
          id: decodedAddress,
        },
      },
    },
  },
}
```

--8<-- 'text/xcm/calculate-multilocation-derivative-account.md'

以Alice的中继链账户`5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT`为例，您可以通过运行以下命令来计算他的Moonbase Alpha **multilocation衍生账户**：

```sh
yarn calculate-multilocation-derivative-account \
--ws-provider wss://wss.api.moonbase.moonbeam.network \
--address 5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT \
--parents 1
```

所有数值被整理成以下表格：

|            名称             |                                                                           数值                                                                            |
|:---------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------:|
|        原链编码地址         |                                                    `5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT`                                                     |
|        原链解码地址         |                                           `0x3ec5f48ad0567c752275d87787954fef72f557b8bfa5eefc88665fa0beb89a56`                                            |
| 目标链中接收的Multilocation | `{"parents":1,"interior":{"x1":{"accountId32":{"network": {"westend":null},"id":"0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0afb2e78fdbbbf4ce26c2556c"}}}}` |
|  多地点衍生账户（32字节）   |                                           `0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0afb2e78fdbbbf4ce26c2556c`                                            |
|  多地点衍生账户（20字节）   |                                                       `0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0`                                                        |

在本示例中，Moonbase Alpha的**multilocation衍生账户**是`0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0`。请注意，只有Alice是唯一可以通过中继链的远程交易访问此帐户的人，因为她是其私钥的所有者，并且**multilocation衍生帐户**是无密钥的。

### Ethereum XCM处理调用数据 {: #ethereumxcm-transact-data}

在将XCM消息从中继链发送到Moonbase Alpha之前，您需要获取将通过执行 [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} XCM指令调度的编码调用数据。

在本示例中，您将会与[以太坊XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm)中的函数交互，其中将会接受`xcmTransaction`作为参数。

`xcmTransaction`参数需要您定义：

- Gas限制
- 要被执行的动作，包含两个选项：`Call`和`Create`。当前[Ethereum XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm)的实现并不支持`CREATE`的应用。因此，您无法通过远程EVM调用执行一个智能合约。在使用`Call`时，您需要执行您与之交互的合约地址
- 要发送的原生Token的值
- 合约交互的编码调用数据输入

关于要被执行的动作，您需要使用位于`0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8`的简单[增量合约](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#code)来表现一个合约交互。您将会调用`increment`函数，其中不包含输入参数且会将`number`提升1。同时，该合约将会在函数被执行时存储区块的时间戳至`timestamp`变数中。

与`increment`函数交互的编码调用数据为`0xd09de08a`，即`increment()`的keccak256哈希的前8个十六进制字符（或4个字节）。如果函数有输入参数，它们也需要编码。获取编码调用数据最简单的方法是在[Remix](/builders/build/eth-api/dev-env/remix/#interacting-with-a-moonbeam-based-erc-20-from-metamask){target=_blank}或[Moonscan](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#code){target=_blank}进行模拟交易。接下来，在MetaMask 中，在签名之前检查**HEX**标签下的**HEX DATA: 4 BYTES**选择器。您无需签署交易。

现在，您已经有了编码的合约交互数据，您可以使用[`eth_estimateGas` JSON RPC函数](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas){target=_blank}决定此调用的Gas限制。在此范例中，您可以将Gas限制设置为`155000`。

关于值部分，由于特定交互并不需要DEV（对于Moonbeam/Moonriver来说为GLMR/MOVR），您可以将其设置为`0`。至于那些需要DEV的交互，您可以根据需求修改此数值。

现在您已经具有所有`xcmTransaction`参数所需要的组成部分，您可以开始构建：

```js
const xcmTransaction = {
  V2: {
    gasLimit: 155000,
    action: { Call: '0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8' }, // Call the incrementer contract
    value: 0,
    input: '0xd09de08a', // Call the increment function
  },
};
```

接着，您可以编写脚本获得交易所需要的编码调用数据。为此，您可以执行以下步骤：

1. 提供调用的输入数据，这包含：

     - 用于创建提供商的Moonbase Alpha终端URL
     - `transact`函数的`xcmTransaction`参数的值

2. 创建[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}提供者
3. 使用`xcmTransaction`值创建`ethereumXcm.transact` extrinsic
4. 获得函数的编码调用数据。您不需要签署和传送交易

```js
--8<-- 'code/remote-execution/generate-encoded-call-data.js'
```

!!! 注意事项
    您可以使用以下编码的调用数据在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x260001785d02000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00){target=_blank}上查看上述脚本的输出示例：`0x260001785d02000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00`。

您将会在以下部分中使用`Transact`指令的编码调用数据。

### 必要的预估权重 {: #estimate-weight-required-at-most }

在使用`Transact`指令时，您需要定义`requireWeightAtMost`字段，也就是该交易的所需权重。此字段接受两个参数：`refTime`和`proofSize`。`refTime`为用于执行的计算时间量，而`proofSize`为能够使用的存储数值（以字节为单位）。

要预估`refTime`和`proofSize`，您可以使用Polkadot.js API的函数`paymentInfo`。由于`Transact`调用数据需要这些权重，您可以扩展先前教程部分的脚本来添加`paymentInfo`的调用。

此`paymentInfo`函数接受您输入至`.signAndSend`函数的相同参数，也就是传送账户以及如随机数和签署者等根据需求添加的额外数值。

要更动编码调用数据的脚本，您需要添加逻辑为传送者（此例中为Alice）创建一个Keyring。接着您可以简单的使用`tx`并调用`paymentInfo`函数和输入Alice的Keyring。

### 为远程XCM执行构建XCM {: #build-xcm-remote-evm}

在本示例中，您将构建一条XCM消息，通过[`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} XCM指令和[Ethereum XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}的`transact`函数从其中继链在Moonbase Alpha种执行远程EVM调用。

现在，您已经生成了[Ethereum XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}[编码调用数据](#ethereumxcm-transact-data)，您将会使用在中继链上XCM Pallet来实施一个远程执行。为此，您将使用`send`函数，此函数接受两个参数：`dest`和`message`。您可以执行以下步骤组装这些参数：

1. 构建目标链的multilocation，其为Moonbase Alpha：

    ```js
    const dest = { V3: { parents: 0, interior: { X1: { Parachain: 1000 } } } };
    ```

2. 构建`WithdrawAsset`指令，其将需要您定义：

    - 在Moonbase Alpha上DEV Token的multilocation
    - 需要提现的DEV Token数量

    ```js
    const instr1 = {
      WithdrawAsset: [
        {
          id: { Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } } },
          fun: { Fungible: 10000000000000000n }, // 0.01 DEV
        },
      ],
    };
    ```

3. 构建`BuyExecution`指令，其将需要您定义：

    - Moonbase Alpha上DEV Token的multilocation
    - 用于执行的DEV Token数量
    - 权重限制

    ```js
    const instr2 = {
      BuyExecution: [
        {
          id: { Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } } },
          fun: { Fungible: 10000000000000000n }, // 0.01 DEV
        },
        { Unlimited: null },
      ],
    };
    ```

4. 构建`Transact`指令，其将需要您定义：

    - Origin类别
    - 交易所需的权重。您将需要为`refTime`定义一个值，可用于执行的计算时间量，并同样为`proofSize`定义一个数值，可使用于存储量（以字节为单位）。这两个数字都可以使用Polkadot.js API的`paymentInfo`函数计算。要计算这些值，您可以修改编码的调用数据脚本以调用`ethereumXcm.transact(xcmTransaction)`交易的`paymentInfo`函数。要调用`paymentInfo`函数，您需要传入传送者账户。您可以在中继链上传入Alice的账户：`5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT`：

        ```js
        ...

        const tx = api.tx.ethereumXcm.transact(xcmTransaction);
        const alice = '5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT';
        const info = await tx.paymentInfo(alice);
        console.log(`Required Weight: ${info.weight.toString()}`);
        ```

        ??? code "完整脚本"

            ```js
            --8<-- 'code/remote-execution/estimate-required-weight.js'
            ```

        截至撰写本脚本时，`refTime`和`proofSize`会分别返回`3900000000`和`38750`的预估数值

    - 您在[Ethereum XCM Transact调用数据](#ethereumxcm-transact-data)部分中生成的编码调用数据

    ```js
    const instr3 = {
      Transact: {
        originKind: 'SovereignAccount',
        requireWeightAtMost: { refTime: 3900000000n, proofSize: 38750n },
        call: {
          encoded:
            '0x260001785d02000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00',
        },
      },
    };
    ```

5. 将XCM指令合并至版本化的XCM消息中：

    ```js
    const message = { V3: [instr1, instr2, instr3] };
    ```

现在，您已经有了每个参数的值，您可以执行以下步骤为执行编写脚本：

1. 提供调用所需的输入数据，包含：

     - 用于创建提供商的中继链端点URL
     - `send`函数的每个参数的值

2. 创建一个用于发送交易的Keyring实例
3. 创建[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}提供商
4. 使用`dest`和`message`数值创建`xcmPallet.send`函数
5. 使用`signAndSend` extrinsic和在第二个步骤创建的Keyring实例发送交易

!!! 请记住
    本教程的操作仅用于演示目的，请勿将您的私钥存储至JavaScript文档中。

```js
--8<-- 'code/remote-execution/send.js'
```

!!! 注意事项
    您可以使用以下编码的调用数据在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics/decode/0x630003000100a10f030c00040000010403000f0000c16ff28623130000010403000f0000c16ff2862300060103004775e87a5d02007901260001785d02000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00){target=_blank}上查看上述脚本的输出示例：`0x630003000100a10f030c00040000010403000f0000c16ff28623130000010403000f0000c16ff2862300060103004775e87a5d02007901260001785d02000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00`。

一旦交易处理完毕，您可以在[中继链](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0x2a0e40a2e5261e792190826ce338ed513fe44dec16dd416a12f547d358773f98){target=_blank}和[Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/explorer/query/0x7570d6fa34b9dccd8b8839c2986260034eafef732bbc09f8ae5f857c28765145){target=_blank}查看相关extrinsics和事件。

在中继链中，extrinsic为`xcmPallet.send`，关联事件为`xcmPallet.Sent`（其中与费用有关）。在Moonbase Alpha中，XCM执行在`parachainSystem.setValidationData`函数发生，并且可以注意多个关联事件：

- **parachainSystem.DownwardMessagesReceived** — 表示接收到来自中继链的消息的事件。使用当前的XCM实现，来自其他平行链的消息将显示相同的事件
- **balances.Withdraw** — 与提取Token以支付调用执行费用相关的事件。注意`who`地址是之前计算的**multilocation衍生账户**
- **ethereum.Executed** — 与执行远程EVM调用相关的事件。它提供了`from`、 `to`、`transactionHash`（使用非标准签名和全网pallet随机数计算）和`exitReason`。目前，一些常见的EVM错误，例如Gas费用不足，会在退出原因中显示`Reverted`
- **polkadotXcm.AssetsTrapped** — 当未使用从帐户中提取的部分用于费用的Token时发出的事件。通常，当您提供的权重超过要求或没有相关的XCM退款指令时，会发生这种情况。这些Token将被暂时销毁，并可以通过民主提案取回

要验证通过XCM的远程EVM调用是否成功，您可以前往[Moonscan中的合约页面](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#readContract){target=_blank}并验证新数值的数字及其时间戳。

## 通过哈希执行远程EVM调用交易 {: #remove-evm-call-txhash}

如先前所述，[常规和远程XCM EVM调用之间存在一些差异](#differences-regular-remote-evm)。使用Ethereum JSON RPC通过其哈希检索交易时可以看到一些主要差异。

为此，您首先需要检索要查询的交易哈希。 在本示例中，您可以使用[先前部分教程](#build-remove-evm-call-xcm)的交易哈希，为[0x753588d6e59030eeffd31aabccdd0fb7c92db836fcaa8ad71512cf3a7d0cb97f](https://moonbase.moonscan.io/tx/0x753588d6e59030eeffd31aabccdd0fb7c92db836fcaa8ad71512cf3a7d0cb97f){target=_blank}。接着打开终端，执行以下命令：

```sh
curl --location --request POST 'https://rpc.api.moonbase.moonbeam.network' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"eth_getTransactionByHash",
    "params": ["0x753588d6e59030eeffd31aabccdd0fb7c92db836fcaa8ad71512cf3a7d0cb97f"]
  }
'
```

如果JSON RPC请求发送正确，应获得以下结果：

```JSON
{
    "jsonrpc": "2.0",
    "result": {
        "hash": "0x753588d6e59030eeffd31aabccdd0fb7c92db836fcaa8ad71512cf3a7d0cb97f",
        "nonce": "0x129",
        "blockHash": "0xeb8222567e434215f472f0c53f68a606c77ea8f475e5fbc3a5b715db6cce8887",
        "blockNumber": "0x46c268",
        "transactionIndex": "0x0",
        "from": "0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0",
        "to": "0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8",
        "value": "0x0",
        "gasPrice": "0x0",
        "maxFeePerGas": "0x0",
        "maxPriorityFeePerGas": "0x0",
        "gas": "0x25d78",
        "input": "0xd09de08a",
        "creates": null,
        "raw": "0x02eb820507820129808083025d7894a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d88084d09de08ac0010101",
        "publicKey": "0x14745b9075ac0f0426c61c9a2895f130ea6f3b964e8f49cefdb4e2d248306f19396361d877f8b9ad60a94a5ec28325a1b9baa2ae59e7a9f6fe1731caec130ab4",
        "chainId": "0x507",
        "standardV": "0x1",
        "v": "0x1",
        "r": "0x1",
        "s": "0x1",
        "accessList": [],
        "type": "0x2"
    },
    "id": 1
}
```

请注意，`v-r-s`值设置为`0x1`，Gas价格相关部分设置为`0x0`。另外，`nonce`字段对应[Ethereum XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}的全网随机数，而不是调度者帐户的交易数量。

!!! 注意事项
    您可能会在Moonbase Alpha测试网中找到一些交易哈希冲突，因为通过XCM进行远程EVM调用的早期版本没有使用[Ethereum XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}的全网随机数。
