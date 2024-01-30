---
title: 随机数预编译
description: 学习如何使用Moonbeam上的VRF随机数资源以及如何使用随机数预编译和消费者接口生成链上随机数
keywords: solidity, ethereum, randomness, VRF, moonbeam, precompiled, contracts
---

# 与随机数预编译交互

## 概览 {: #introduction }

Moonbeam使用可验证随机函数（Verifiable Random Functions，VRF）生成可以在链上验证的随机数。VRF是一种利用一些输入值并产生随机数的加密函数，并证明这些数值是由提交者生成。此证明可以由任何人验证，以确保准确计算生成的随机数计算。

目前有两种提供随机输入的可用随机数来源，分别基于区块生产者的VRF私钥以及过去的随机数结果：[本地VRF](#local-vrf)和[BABE Epoch随机数](#babe-epoch-randomness)。本地VRF在Moonbeam中使用区块的VRF私钥以及最新区块的VRF输出值决定。而[BABE](https://wiki.polkadot.network/docs/learn-consensus#block-production-babe){target=\_blank} Epoch随机数基于所有由中继链验证人在完整[Epoch](https://wiki.polkadot.network/docs/glossary#epoch){target=\_blank}期间生产的VRF。

关于更多两种随机数来源的信息，如何请求和完成工作流程以及安全考虑，请查看[Moonbeam上的随机数](/learn/features/randomness){target=\_blank}页面。

Moonbeam提供一个随机数预编译，其为一个允许智能合约开发者使用以太坊API通过本地VRF或BABE Epoch随机数来生成随机数。Moonbeam同样提供一个随机数消费者Solidity合约，您的合约必须继承此Solidity合约才能实现已完成的随机数请求。

此教程将会包含如何使用随机数预编译以及随机数消费者合约创建一个随机选取赢家的彩票。同时，您将学习如何直接与随机数预编译交互以执行操作，例如清除过期的随机数请求。

此预编译合约位于以下地址：

=== "Moonbeam"

     ```text
     {{ networks.moonbeam.precompiles.randomness }}
     ```

=== "Moonriver"

     ```text
     {{ networks.moonriver.precompiles.randomness }}
     ```

=== "Moonbase Alpha"

     ```text
     {{ networks.moonbase.precompiles.randomness }}
     ```

--8<-- 'text/builders/pallets-precompiles/precompiles/security.md'

## 随机数Solidity接口 {: #the-randomness-interface }

[Randomness.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=\_blank}为一个允许开发者与预编译方法交互的Solidity接口。

??? code "Randomness.sol"

    ```solidity
    --8<-- 'code/builders/pallets-precompiles/precompiles/randomness/Randomness.sol'
    ```

此接口包含函数、常量、事件以及枚举，如下列部分所包含。

### 函数 {: #functions }

此接口包含以下函数：

- **relayEpochIndex**() — 返回当前的中继Epoch索引，Epoch代表当前实际时间而非区块编号
- **requiredDeposit**() — 返回使用随机数请求要求的保证金
- **getRequestStatus**(*uint256* requestId) — 根据给定的随机数请求返回请求状态
- **getRequest**(*uint256* requestId) — 根据给定的随机数请求返回请求细节
- **requestLocalVRFRandomWords**(*address* refundAddress, *uint256* fee, *uint64* gasLimit, *bytes32* salt, *uint8* numWords, *uint64* delay) — 请求由平行链VRF生成的随机词
- **requestRelayBabeEpochRandomWords**(*address* refundAddress, *uint256* fee, *uint64* gasLimit, *bytes32* salt, *uint8* numWords) — 请求由中继链BABE共识生成的随机词
- **fulfillRequest**(*uint256* requestId) — 完成调用消费者合约方法[`fulfillRandomWords`](#:~:text=rawFulfillRandomWords(uint256 requestId, uint256[] memory randomWords))的请求。调用者的费用将会在请求可完成后退还
- **increaseRequestFee**(*uint256* requestId, *uint256* feeIncrease) — 根据给定的随机数请求提高相关费用。此适用于在请求被完成前Gas价格突然升高的情况
- **purgeExpiredRequest**(*uint256* requestId) — 从存储库中移除给定的过期请求，并将请求费用和保证金转移给调用者

以下为需要被定义的输入值：

- **requestId** - 随机数请求的ID
- **refundAddress** - 过程完成后收取剩余费用的地址
- **fee** - 设定为支付完成费用的数值
- **gasLimit** - 用于完成请求设置的Gas限制
- **salt** - 包含随机数种子以获得不同随机词的字符串
- **numWords** - 请求的随机词数量，最大至随机词的生成最大数值
- **delay** - 在请求被完成前所需要经过的区块数量。此数值将需要在本地VRF请求能被完成的最大和最小区块数值之间
- **feeIncrease** - 需要提高费用的数值

### 常量 {: #constants }

此接口包含以下常量：

- **MAX_RANDOM_WORDS** - 被请求的随机词的最大值
- **MIN_VRF_BLOCKS_DELAY** - 在请求能被本地VRF请求完成前的最小区块数量
- **MAX_VRF_BLOCKS_DELAY** - 在请求能被本地VRF请求完成前的最大区块数量
- **REQUEST_DEPOSIT_AMOUNT** - 请求随机词所需的保证金。每个请求需要一笔保证金

=== "Moonbeam"
    |          变量          |                               值                                |
    |:----------------------:|:---------------------------------------------------------------:|
    |    MAX_RANDOM_WORDS    |    {{ networks.moonbeam.randomness.max_random_words }} words    |
    |  MIN_VRF_BLOCKS_DELAY  | {{ networks.moonbeam.randomness.min_vrf_blocks_delay }} blocks  |
    |  MAX_VRF_BLOCKS_DELAY  | {{ networks.moonbeam.randomness.max_vrf_blocks_delay }} blocks  |
    | REQUEST_DEPOSIT_AMOUNT | {{ networks.moonbeam.randomness.req_deposit_amount.glmr }} GLMR |

=== "Moonriver"
    |          变量          |                                值                                |
    |:----------------------:|:----------------------------------------------------------------:|
    |    MAX_RANDOM_WORDS    |    {{ networks.moonriver.randomness.max_random_words }} words    |
    |  MIN_VRF_BLOCKS_DELAY  | {{ networks.moonriver.randomness.min_vrf_blocks_delay }} blocks  |
    |  MAX_VRF_BLOCKS_DELAY  | {{ networks.moonriver.randomness.max_vrf_blocks_delay }} blocks  |
    | REQUEST_DEPOSIT_AMOUNT | {{ networks.moonriver.randomness.req_deposit_amount.movr }} MOVR |

=== "Moonbase Alpha"
    |          变量          |                               值                               |
    |:----------------------:|:--------------------------------------------------------------:|
    |    MAX_RANDOM_WORDS    |   {{ networks.moonbase.randomness.max_random_words }} words    |
    |  MIN_VRF_BLOCKS_DELAY  | {{ networks.moonbase.randomness.min_vrf_blocks_delay }} blocks |
    |  MAX_VRF_BLOCKS_DELAY  | {{ networks.moonbase.randomness.max_vrf_blocks_delay }} blocks |
    | REQUEST_DEPOSIT_AMOUNT | {{ networks.moonbase.randomness.req_deposit_amount.dev }} DEV  |

### 事件 {: #events }

此接口包含以下事件：

- **FulfillmentSucceeded**() - 在请求被成功执行后发起
- **FulfillmentFailed**() - 在请求执行失败后发起

### 枚举 {: #enums }

以下接口包含下列枚举：

- **RequestStatus** - 请求的状态，分别能为`DoesNotExist` (0)、`Pending` (1)、`Ready` (2)或`Expired` (3)
- **RandomnessSource** - 随机数资源的类型，分别能为`LocalVRF` (0)或`RelayBabeEpoch` (1)

## 随机数消费者Solidity接口 {: #randomness-consumer-solidity-interface }

[`RandomnessConsumer.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/4e2a5785424be6faa01cd14e90155d9d2ec734ee/precompiles/randomness/RandomnessConsumer.sol){target=\_blank} Solidity接口使智能合约能够更简单地与随机数预编译交互。使用随机数消费者能确保完成来自随机数预编译。

??? code "RandomnessConsumer.sol"

    ```solidity
    --8<-- 'code/builders/pallets-precompiles/precompiles/randomness/Randomness.sol'
    ```

消费者接口包含以下函数：

- **fulfillRandomWords**(*uint256* requestId, *uint256[] memory* randomWords) - 根据给定的请求处理VRF回应，此函数将会通过`rawFulfillRandomWords`的调用而启动
- **rawFulfillRandomWords**(*uint256* requestId, *uint256[] memory* randomWords) - 在随机数预编译的[`fulfillRequest`函数](#:~:text=fulfillRequest(uint256 requestId))被调用时启动。调用的源头将被验证，确保随机数预编译为调用的源头以及`fulfillRandomWords`方法确实被调用

## 请求和完成过程 {: #request-and-fulfill-process }

要启用随机性，您必须有一个执行以下操作的合约：

  - 导入`Randomness.sol`预编译和`RandomnessConsumer.sol`接口
  - 从`RandomnessConsumer.sol`接口继承
  - 根据您希望使用的随机数资源，通过预编译的[`requestLocalVRFRandomWords`方法](#:~:text=requestLocalVRFRandomWords)或[`requestRelayBabeEpochRandomWords`方法](#:~:text=requestRelayBabeEpochRandomWords)请求随机数
  - 通过预编译的[`fulfillRequest`方法](#:~:text=fulfillRequest)完成请求
  - 使用与`RandomnessConsumer.sol`合约中[`fulfillRandomWords`方法相同的签名](#:~:text=fulfillRandomWords(uint256 requestId, uint256[] memory randomWords))通过`fulfillRandomWords`方法使用随机数

通过预编译的`requestLocalVRFRandomWords`或`requestRelayBabeEpochRandomWords`方法请求随机数时，将会设置一个用于支付请求完成过程的费用。当使用本地VRF时，为提高不可预测性，制定的延迟时间段（以区块计算）将需要在请求被完成时经过。在最后，延迟的时间段必须大于一个区块。至于BABE Epoch随机数，您不需要制定一个延迟时间段，而可以在当前Epoch的第二个Epoch完成要求。

延迟时间段过后，请求的完成可以由任何人使用`fulfillRequest`方法以及先前在提交要求时设置的费用完成请求。

在通过预编译的`fulfillRequest`方法完成随机数请求时，`RandomnessConsumer.sol`合约中的 [`rawFulfillRandomWords`](#:~:text=rawFulfillRandomWords(uint256 requestId, uint256[] memory randomWords))函数将会被调用，其将会验证传送者为随机预编译。自其， [`fulfillRandomWords`](#:~:text=fulfillRandomWords(uint256 requestId, uint256[] memory randomWords))将被调用而请求的随机词数量将由当前区块的随机数结果以及给定的salt计算并得出。如果整个过程是成功的，[`FulfillmentSucceeded`事件](#:~:text=FulfillmentSucceeded)将被触发，否则[`FulfillmentFailed`事件](#:~:text=FulfillmentFailed)将被触发。

至于已完成的请求，执行的费用将会从请求费用退还给`fulfillRequest`调用者。任何剩余的费用以及要求的保证金将被转移回指定的退还地址。

您合约的`fulfillRandomWords`回调将负责处理整个完成过程。举例来说，在彩票合约中，回调将会使用随机词选取赢家并支付奖品。

如果一个请求已经过期，它可以通过预编译的[`purgeExpiredRequest`函数](/builders/pallets-precompiles/precompiles/randomness/#:~:text=purgeExpiredRequest){target=\_blank}删除。当此函数被调用且请求费用已经被支付给调用者，保证金将被退还给原先的请求者。

随机数请求的过程如下所示：

![Randomness request happy path diagram](/images/learn/features/randomness/randomness-1.webp)

## 使用随机预编译生成随机数 {: #interact-with-the-solidity-interfaces }

在接下来的教程中，您将学习如何使用随机数预编译和随机数消费者创建生成随机数的智能合约。如果您只想探索随机数预编译的一些功能，可以跳到[使用Remix直接与随机数预编译交互](#interact-directly)部分。

### 查看先决条件 {: #checking-prerequisites }

跟随本指南，您需要准备以下内容：

- [安装MetaMask并连接至Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
- 一个拥有`DEV` Token的账户。
 --8<-- 'text/_common/faucet/faucet-list-item.md'

### 创建随机数生成器合约 {: #create-random-generator-contract }

这一部分创建的合约将包含请求随机数和消费履行随机数请求的结果所需的基本函数。

**此合约仅用于演示目的，不可用于生产环境。**

此合约将包含以下函数：

- 构造函数，接受请求随机数所需的保证金
- 提交随机数请求的函数。在本示例中，随机数来源为本地VRF，但是可以轻松修改合约以使用BABE epoch随机数
- 通过调用随机数预编译的`fulfillRequest`函数履行请求的函数。此函数将是`payable`，因为需要在随机数请求时提交履行费用
- 消费履行请求结果的函数。此函数的签名必须与随机数消费者合约的[`fulfillRandomWords`函数的签名](#:~:text=fulfillRandomWords(uint256 requestId, uint256[] memory randomWords))相匹配

合约如下所示：

```solidity
--8<-- 'code/builders/pallets-precompiles/precompiles/randomness/RandomNumber.sol'
```

如您所见，合约中还有一些常量可以根据需要进行调整，尤其是可用于生成独特结果的`SALT_PREFIX`。

在以下部分中，您将使用Remix部署合约并与其交互。

### Remix设置 {: #remix-set-up}

要添加合约至Remix并遵循本教程操作，您需要在Remix中创建一个名为`RandomnessNumber.sol`的新文件并将`RandomNumber`合约粘贴至该文件。

![Add the random number generator contract to Remix.](/images/builders/pallets-precompiles/precompiles/randomness/randomness-2.webp)

### 编译部署随机数生成器合约 {: #compile-deploy-random-number }

要在Remix中编译`RandomNumber.sol`合约，请执行以下步骤：

1. 点击**Compile**标签（从上到下第二个）
2. 点击**Compile RandomNumber.sol**按钮

成功编译合约后，您将在**Compile**标签旁边看到一个绿色的勾号。

![Compile the random number generator contract in Remix.](/images/builders/pallets-precompiles/precompiles/randomness/randomness-3.webp)

现在您可以开始执行以下步骤部署合约：

1. 点击位于**Compile**标签正下方的**Deploy and Run**标签
2. 确保在**ENVIRONMENT**下拉菜单中已选择**Injected Provider - Metamask**。选择**Injected Provider - Metamask**后，MetaMask将提示您链接账户至Remix
3. 确保**ACCOUNT**下方显示是正确的账户
4. 在**VALUE**字段中输入保证金金额，即`{{ networks.moonbase.randomness.req_deposit_amount.wei }}` Wei（`{{ networks.moonbase.randomness.req_deposit_amount.dev }}` Ether）
5. 确保在**CONTRACT**下拉菜单中已选择**RandomNumber - RandomNumber.sol**
6. 点击**Deploy**
7. 在MetaMask跳出的弹窗中，点击**Confirm**确认交易

![Deploy the random number generator contract in Remix.](/images/builders/pallets-precompiles/precompiles/randomness/randomness-4.webp)

**RANDOMNUMBER**合约将出现在**Deployed Contracts**列表中。

### 提交生成随机数的请求 {: #request-randomness }

要请求随机数，您需要使用合约的`requestRandomness`函数，这将要求您按照随机数预编译中的定义提交保证金。您可以通过以下步骤提交随机数请求并支付保证金：

1. 在**VALUE**字段中输入数量用于支付履行费用，该数值需等于或高于`RandomNumber`合约中指定的最低费用，即`15000000` Gwei
2. 展开**RANDOMNUMBER**合约
3. 点击**requestRandomness**按钮
4. 在MetaMask中确认交易

![Request a random number using the random number generator contract in Remix.](/images/builders/pallets-precompiles/precompiles/randomness/randomness-5.webp)

提交交易后，`requestId`将更新为请求的ID。您可以使用随机数合约的`requestId`调用来获取请求ID，并使用随机数预编译的`getRequestStatus`函数来检查此请求ID的状态。

### 履行请求并保存随机数 {: #fulfill-request-save-number }

提交随机数请求后，您需要等待延迟时间段才能完成请求。对于`RandomNumber.sol`合约，延迟时间段设置为随机数预编译中定义的最小区块延迟，即{{ networks.moonbase.randomness.min_vrf_blocks_delay }}个区块。您必须在延迟时间段结束之前完成请求。对于本地VRF，请求在{{ networks.moonbase.randomness.block_expiration }}个区块后过期，对于BABE epoch随机数，请求在{{ networks.moonbase.randomness.epoch_expiration }}个epoch后过期。

假设您已等待最小区块数（如果您使用的是BABE epoch随机数，则为epoch）通过并且请求尚未过期，您可以通过以下步骤来完成请求：

1. 点击**fulfillRequest**按钮
2. 在MetaMask中确认交易

![Fulfill the randomness request using the random number generator contract in Remix.](/images/builders/pallets-precompiles/precompiles/randomness/randomness-6.webp)

履行请求后，您可以查看生成的随机数：

1. 展开**random**函数
2. 由于合约只请求一个随机词，您可以通过访问`random`数组的`0`索引来获取随机数
3. 点击**call**
4. 随机数将出现在**call**按钮下方

![Retrieve the random number that was generated by the random number contract in Remix.](/images/builders/pallets-precompiles/precompiles/randomness/randomness-7.webp)

成功完成后，多余的费用和保证金将发送到指定的退款地址。

如果请求刚好在完成之前过期，您可以直接与随机数预编译交互以清除请求并解锁保证金和费用。有关如何执行此操作的说明，请参考以下部分。

## 使用Remix直接与随机数预编译交互 {: #interact-directly }

除了通过智能合约与随机预编译进行交互外，您还可以在Remix中直接与其交互以执行创建随机请求、检查请求状态和清除过期请求等操作。请记住，您需要有一个从消费者合约继承的合约才能满足请求，因此如果您直接使用预编译来完成请求，则无法使用结果。

### Remix设置 {: #remix-set-up }

要将接口添加至Remix并跟随以下教程步骤，您将需要：

1. 复制[`Randomness.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=\_blank}
2. 在Remix文件中粘贴文件内容并命名为**Randomness.sol**

![Add precompile to Remix](/images/builders/pallets-precompiles/precompiles/randomness/randomness-8.webp)

### 编译和访问随机数预编译 {: #compile-randomness }

接着，您将需要在Remix中编译`Randomness.sol`文件。要开始操作，请确认您已打开**Randomness.sol**文件并跟随以下步骤：

1. 点击从上至下的第二个**Compile**标签
2. 点击**Compile Randomness.sol**编译合约

如果合约被成功编译，您将在**Compile**标签旁看见绿色打勾标志。

您将会根据给定的预编译合约地址访问接口，而非部署随机数预编译：

1. 在Remix中**Compile**标签下方点击**Deploy and Run**标签，请注意预编译合约已部署
2. 确保在**ENVIRONMENT**下拉菜单中**Injected Provider - MetaMask**已选取。当选取时，MetaMask将跳出弹窗要求您将账户连接至Remix
3. 确保正确的账户在**ACCOUNT**下方显示
4. 确保**CONTRACT**下拉菜单中**Randomness - Randomness.sol**已被选取。由于此为预编译合约，因此并不需要部署任何代码，我们反而将会在**At Address**一栏中提供预编译地址
5. 提供批量预编译的地址`{{ networks.moonbase.precompiles.randomness }}`并点击**At Address**

![Access the address](/images/builders/pallets-precompiles/precompiles/randomness/randomness-9.webp)

**RANDOMNESS**预编译将会出现在**Deployed Contracts**列表中，您将会用其完成后续教程中彩票合约的随机数请求。

### 获得请求状态和删除过期请求 {: #get-request-status-and-purge }

任何人都可以清除过期的请求。您不需要成为请求随机数者才能够清除它。当您清除过期的请求时，要求费用将转给您，要求的保证金将退还给请求发起者。

要清除请求，首先您必须确保请求已过期。为此，您可以使用预编译的`getRequestStatus`函数验证请求的状态。此调用返回的数字对应于[`RequestStatus`](#enums)枚举中值的索引。因此，您需要验证返回的数字是否为`3`表示`Expired`。

当您验证请求已过期，您可以调用`purgeExpiredRequest`函数清除此请求。

要验证和清除请求，您可以跟随以下步骤：

1. 展开**RANDOMNESS**合约
2. 输入您希望验证其是否过期的请求ID并点击**getRequestStatus**
3. 回应将会出现在函数下方，验证您是否获得`3`
4. 展开**purgeExpiredRequest**函数并输入要求ID
5. 点击**transact**
6. MetaMask将会跳出弹窗，请确认交易

![Purge an exired request](/images/builders/pallets-precompiles/precompiles/randomness/randomness-10.webp)

交易完成后，您可以通过使用相同的请求ID再次调用**getRequestStatus**函数来验证请求已被清除。您应该收到`0`或`DoesNotExist`的状态。您还可以预期请求费用的金额将转入您的帐户。