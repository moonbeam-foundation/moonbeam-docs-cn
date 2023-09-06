---
title: 随机数
description: 学习Moonbeam上的VRF随机数来源，包含请求和完成过程，以及在使用链上随机数的安全性考虑。
---

# Moonbeam上的随机数

## 概览 {: #introduction }

对于多种区块链应用创建无争议、无法预测且独特结果来说，随机数是必要元素。然而，获得稳定的随机数来源是一个挑战。计算机具有确定性，也就是当您给它同样的输入，会获得同样的输出。因此，计算机生成的随机数被称为伪随机，因为它们看起来是统计随机的，但在相同的输入下，输出很容易重复。

Moonbeam使用可验证随机函数（Verifiable Random Functions，VRF）生成可以在链上验证的随机数。VRF是一种利用一些输入值并产生随机数的加密函数，并证明这些数值是由提交者生成。此证明可以由任何人验证，以确保生成的随机数值经过准确的运算。

目前有两种提供随机输入的可用随机数来源，分别基于区块生产者的VRF私钥以及过去的随机数结果：[本地VRF](#local-vrf)和[BABE Epoch随机数](#babe-epoch-randomness)。本地VRF在Moonbeam中使用区块的VRF私钥以及最新区块的VRF输出值决定。而[BABE](https://wiki.polkadot.network/docs/learn-consensus#block-production-babe){target=_blank} Epoch随机数基于所有由中继链验证人在完整Epoch期间生产的VRF{target=_blank}。

您可以使用随机数预编译合约，一个允许智能合约开发者通过以太坊API访问随机数功能的Solidity接口，访问和请求链上随机数。关于预编译合约的更多信息，请查看[与随机数预编译交互](/builders/pallets-precompiles/precompiles/randomness){target=_blank}教程。您同样可以查看[随机数Pallet](/builders/pallets-precompiles/pallets/randomness){target=_blank}页面，可用于获得当前的随机数请求和结果。

## 一般定义 {: #general-definitions }

- **Epoch** - 在BABE协议被分为更小时间Slot的时间周期。Slot是长度为六秒的离散时间单位。在波卡上，一个Epoch大约持续2,400个Slot或4小时。在Kusama 上，一个Epoch大约持续600个Slot或1小时。
- **Deposit** - 请求随机词所需的保证金数量。每个请求需要一笔保证金，要求完成后，保证金将会退还到请求随机数的账户之中
- **Block expiration delay** - 在本地VRF请求过期并被清除前必须经过的区块数量
- **Epoch expiration delay** - 在BABE要求过期并被清除前必须经过的Epoch数量
- **Minimum block delay** - 在本地VRF请求被完成前的最小区块数量
- **Maximum block delay** - 在本地VRF请被完成前的最大区块数量
- **Maximum random words** - 最大可被请求的随机词数量
- **Epoch fulfillment delay** - 能够在BABE请求被完成前延迟的Epoch数量

## 快速参考 {: #quick-reference }


=== "Moonbeam"
    |    Variable    |                                      Value                                      |
    |:--------------:|:-------------------------------------------------------------------------------:|
    |     保证金     |         {{ networks.moonbeam.randomness.req_deposit_amount.glmr }} GLMR         |
    |  区块过期延迟  |             {{ networks.moonbeam.randomness.block_expiration }}区块             |
    | Epoch过期延迟  |           {{ networks.moonbeam.randomness.epoch_expiration }} Epochs            |
    |  最小区块延迟  |           {{ networks.moonbeam.randomness.min_vrf_blocks_delay }}区块           |
    |  最大区块延迟  |           {{ networks.moonbeam.randomness.max_vrf_blocks_delay }}区块           |
    | 最大随机词数量 |              {{ networks.moonbeam.randomness.max_random_words }}词              |
    | Epoch完成延迟  | {{ networks.moonbeam.randomness.epoch_fulfillment_delay }} Epochs（跟随当前的） |

=== "Moonriver"
    |    Variable    |                                      Value                                       |
    |:--------------:|:--------------------------------------------------------------------------------:|
    |     保证金     |         {{ networks.moonriver.randomness.req_deposit_amount.movr }} MOVR         |
    |  区块过期延迟  |             {{ networks.moonriver.randomness.block_expiration }}区块             |
    | Epoch过期延迟  |           {{ networks.moonriver.randomness.epoch_expiration }} Epochs            |
    |  最小区块延迟  |           {{ networks.moonriver.randomness.min_vrf_blocks_delay }}区块           |
    |  最大区块延迟  |           {{ networks.moonriver.randomness.max_vrf_blocks_delay }}区块           |
    | 最大随机词数量 |              {{ networks.moonriver.randomness.max_random_words }}词              |
    | Epoch完成延迟  | {{ networks.moonriver.randomness.epoch_fulfillment_delay }} Epochs（跟随当前的） |

=== "Moonbase Alpha"
    |      变量      |                                       值                                        |
    |:--------------:|:-------------------------------------------------------------------------------:|
    |     保证金     |          {{ networks.moonbase.randomness.req_deposit_amount.dev }} DEV          |
    |  区块过期延迟  |             {{ networks.moonbase.randomness.block_expiration }}区块             |
    | Epoch过期延迟  |           {{ networks.moonbase.randomness.epoch_expiration }} Epochs            |
    |  最小区块延迟  |           {{ networks.moonbase.randomness.min_vrf_blocks_delay }}区块           |
    |  最大区块延迟  |           {{ networks.moonbase.randomness.max_vrf_blocks_delay }}区块           |
    | 最大随机词数量 |              {{ networks.moonbase.randomness.max_random_words }}词              |
    | Epoch完成延迟  | {{ networks.moonbase.randomness.epoch_fulfillment_delay }} Epochs（跟随当前的） |

## 本地VRF {: #local-vrf }

本地VRF随机数是在区块开始时使用前一个区块的VRF输出值以及当前区块作者的VRF私钥的公钥逐块生成的。生成的随机数结果被存储并用于满足当前区块的所有随机数请求。

您可以使用[随机数预编译](/builders/pallets-precompiles/precompiles/randomness/){target=_blank}的[`requestLocalVRFRandomWords`函数](/builders/pallets-precompiles/precompiles/randomness/#:~:text=requestLocalVRFRandomWords){target=_blank}请求本地VRF随机数。

如果您的合约能够打开并发请求，您可以使用从`requestLocalVRFRandomWords`方法获得的`requestId`来跟踪哪个获得的值与哪个随机请求相关。

## BABE Epoch随机数 {: #babe-epoch-randomness }

BABE Epoch随机数基于上一个中继链Epoch中产生区块的VRF值的哈希。在波卡上，[Epoch 持续大约4小时](https://wiki.polkadot.network/docs/maintain-polkadot-parameters#periods-of-common-actions-and-attributes){target=_blank}，在Kusama上，[Epoch持续大约 1时](https://guide.kusama.network/docs/kusama-parameters/#periods-of-common-actions-and-attributes){target=_blank}。哈希将在中继链上完成，因此，Moonbeam上的收集人不可能影响随机数值，除非他们也是中继链上的验证者并负责生成包含在一个Epoch的最后一个输出之中。

随机数将会在一个Epoch中保持稳定，因此如果一个收集人人跳过区块生产，下个收集人能够使用同一个随机数完成它。

您可以使用[随机数预编译](/builders/pallets-precompiles/precompiles/randomness/){target=_blank}的[`requestRelayBabeEpochRandomWords`函数](/builders/pallets-precompiles/precompiles/randomness/#:~:text=requestRelayBabeEpochRandomWords){target=_blank}请求BABE Epoch随机数。要生产独特的随机数，您需要提供不同的salt给`requestRelayBabeEpochRandomWords`函数。

在每个中继链Epoch更换的开始时，前一个Epoch的随机数将会自中继链证明中读取，并用于完成在当前区块所有的随机数请求。

## 请求和完成过程 {: #request-and-fulfill-process }

一般而言，随机数的请求和完成过程如下：

1. 支付保证金以请求随机词
2. 使用本地VRF或BABE Epoch随机数来源请求，当在请求时您可以设定以下事项：
    - 一个接收多余费用的退款地址
    - 为完成请求所预留的费用。如果指定金额不够，您可以随时增加请求费用，或者如果超过，您将在请求完成后将多余的费用退还到指定地址
    - 一个用于生产不同随机词的独特salt
    - 您希望请求的随机词数量
    - 对于本地VRF而言，区块的延迟时间用于提供不可预测性，需要在先前列出的[最大和最小区块](#quick-reference)之间。至于BABE Epoch随机数，您不需要设定延迟但您可以在[Epoch延迟](#quick-reference)通过后完成请求
3. 等待延迟期间经过
4. 满足随机数请求，也就是触发当前区块的随机数结果和给定的salt来计算随机词。这可以由任何人使用最初为请求预留的费用手动完成
5. 对于已完成的请求，将会获得生成随机词且执行的费用将会被退还至提交完成请求的地址。接着任何执行费用和要求保证金将会被转移回指定的退费地址

如果请求过期则可以由任何人都清除。在发生这种情况时，请求费用将转移到发起清除的地址，并将押金退还给原始请求者。

随机数请求的流程如下所示：

![Randomness request happy path diagram](/images/learn/features/randomness/randomness-1.png)

## 安全考虑 {: #security-considerations }

能够直接调用`fulfillRandomness`函数的函数可以用任何随机数欺骗VRF结果，因此请注意，只能由`RandomnessConsumer.sol`合约的`rawFulfillRandomness`函数直接调用它。

为了让您的用户相信您合约的随机行为不会受恶意干扰，您最好编写它以便让VRF结果指示的所有行为*在*您的 `fulfillRandomness`函数期间执行。如果你的合约必须存储结果（或任何衍生物）并在以后使用它，您必须确保任何依赖于该存储值的用户重要行为不能被后续的VRF请求操纵。

相同地，收集人对VRF结果出现在区块链上的顺序有部分影响，所以如果当您的合约可能有多个VRF请求在运行，您必须确保VRF结果到达的顺序不能被用来操纵您合约的用户重要行为。

由于`requestLocalVRFRandomWords`生成的随机词输出取决于在完成时生成区块的收集人，而收集人可以跳过它的区块，强制由不同的收集人完成执行，并生成不同的 VRF。然而，这样的攻击会产生失去区块奖励的成本，转而支付给收集人。同样地，如果请求和完成之间的延迟太短，收集人也可以预测VRF的部分可能结果。因此，您可以选择提供更高的延迟。

由于`requestRelayBabeEpochRandomWords`生成的随机词的输出仰赖于中继链验证器在一个Epoch期间生成的区块，因此一个Epoch的最后一个验证人可以通过跳过区块的生成在两个可能的VRF输出值之间进行选择。但是，这样的攻击会导致将区块奖励支付给验证人的成本。所以，只要有一个诚实的收集人，平行链收集人就不可能预测或影响中继链VRF的输出，而不是审查完成情况。
