---
title: 随机数预编译
description: 学习如何使用Moonbeam上的VRF随机数资源以及如何使用随机数预编译和消费者接口生成链上随机数
keywords: solidity, ethereum, randomness, VRF, moonbeam, precompiled, contracts
---

# 与随机数预编译交互

![Randomness Moonbeam Banner](/images/builders/pallets-precompiles/precompiles/randomness/randomness-banner.png)

## 概览 {: #introduction }

Moonbeam使用可验证随机函数（Verifiable Random Functions，VRF）生成可以在链上验证的随机数。VRF是一种利用一些输入值并产生随机数的加密函数，并证明这些数值是由提交者生成。此证明可以由任何人验证，以确保准确计算生成的随机数计算。

目前有两种提供随机输入的可用随机数来源，分别基于区块生产者的VRF私钥以及过去的随机数结果：[本地VRF](#local-vrf)和[BABE Epoch随机数](#babe-epoch-randomness)。本地VRF在Moonbeam中使用区块的VRF私钥以及最新区块的VRF输出值决定。而[BABE](https://wiki.polkadot.network/docs/learn-consensus#block-production-babe){target=_blank} Epoch随机数基于所有由中继链验证人在完整[Epoch](https://wiki.polkadot.network/docs/glossary#epoch){target=_blank}期间生产的VRF。

关于更多两种随机数来源的信息，如何请求和完成工作流程以及安全考虑，请查看[Moonbeam上的随机数](/learn/features/randomness){target=_blank}页面。

Moonbeam提供一个随机数预编译，其为一个允许智能合约开发者使用以太坊API通过本地VRF或BABE Epoch随机数来生成随机数。Moonbeam同样提供一个随机数消费者Solidity合约，您的合约必须继承此Solidity合约才能实现已完成的随机数请求。

此教程将会包含如何使用随机数预编译以及随机数消费者合约创建一个随机选取赢家的彩票。同时，您将学习如何直接与随机数预编译交互以执行操作，例如清除过期的随机数请求。

此预编译合约位于以下地址：

=== "Moonbeam"
     ```
     {{ networks.moonbeam.precompiles.randomness }}
     ```

=== "Moonriver"
     ```
     {{ networks.moonriver.precompiles.randomness }}
     ```

=== "Moonbase Alpha"
     ```
     {{ networks.moonbase.precompiles.randomness }}
     ```

--8<-- 'text/precompiles/security.md'

## 随机数Solidity接口 {: #the-randomness-interface }

[Randomness.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=_blank}为一个允许开发者与预编译方法交互的Solidity接口。

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

[`RandomnessConsumer.sol`](https://github.com/PureStake/moonbeam/blob/4e2a5785424be6faa01cd14e90155d9d2ec734ee/precompiles/randomness/RandomnessConsumer.sol){target=_blank} Solidity接口使智能合约能够更简单地与随机数预编译交互。使用随机数消费者能确保完成来自随机数预编译。

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

如果一个请求已经过期，它可以通过预编译的[`purgeExpiredRequest`函数](/builders/pallets-precompiles/precompiles/randomness/#:~:text=purgeExpiredRequest){target=_blank}删除。当此函数被调用且请求费用已经被支付给调用者，保证金将被退还给原先的请求者。

随机数请求的过程如下所示：

![Randomness request happy path diagram](/images/learn/features/randomness/randomness-1.png)

## Generate a Random Numnber using the Randomness Precompile {: #interact-with-the-solidity-interfaces }

In the following sections of this tutorial, you'll learn how to create a smart contract that generates a random number using the Randomness Precompile and the Randomness Consumer. If you want to just explore some of the functions of the Randomness Precompile, you can skip ahead to the [Use Remix to Interact Directly with the Randomness Precompile](#interact-directly) section.

在接下来的教程中，您将会学习如何与随机数预编译交互，包含需要您拥有多个账户以参与彩票抽奖的彩票合约。预设彩票合约将最小参与者人量设置为3，然而您可以根据需求更改合约中的数值。

### 查看先决条件 {: #checking-prerequisites }

For this guide, you will need to have the following:

如您使用预设合约，您需要准备以下内容：

- [MetaMask installed and connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
- [安装成功的MetaMask并连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}

- An account funded with DEV tokens.
- 所有账户皆需拥有`DEV ` Token。
 --8<-- 'text/faucet/faucet-list-item.md'

### Create a Random Number Generator Contract - 创建随机数生成器合约 {: #create-random-generator-contract }

The contract that will be created in this section includes the functions that you'll need at a bare minimum to request randomness and consume the results from fulfilling randomness requests.

这一部分创建的合约将包含请求随机数和使用满足随机数请求结果所需的基本函数。

**This contract is for educational purposes only and is not meant for production use.**

**此合约仅用于演示目的，不可用于生产环境。**

The contract will include the following functions:

此合约将包含以下函数：

- A constructor that accepts the deposit required to request randomness
- 构造函数，用于接收请求随机性所需的保证金
- A function that submits randomness requests. For this example, the source of randomness will be local VRF, but you can easily modify the contract to use BABE epoch randomness
- 提交随机数请求的函数。在本示例中，随机数来源为本地VRF，但是可以轻松调整合约以使用BABE epoch随机数
- A function that fulfills the request by calling the `fulfillRequest` function of the Randomness Precompile. This function will be `payable` as the fulfillment fee will need to be submitted at the time of the randomness request
- 通过调用Randomness Precompile的`fulfillRequest`函数完成请求的函数。此函数将是`payable`，需要在随机数请求时提交完成费用
- A function that consumes the fulfillment results. This function's signature must match the [signature of the `fulfillRandomWords` method](#:~:text=fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)) of the Randomness Consumer contract
- 使用完成结果的函数。此函数的签名必须与Randomness Consumer合约的[`fulfillRandomWords`函数的签名](#:~:text=fulfillRandomWords(uint256 requestId, uint256[] memory randomWords))相匹配

Without further ado, the contract is as follows:

合约如下所示：

```sol
// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.0;

import "https://github.com/PureStake/moonbeam/blob/master/precompiles/randomness/Randomness.sol";
import {RandomnessConsumer} from "https://github.com/PureStake/moonbeam/blob/master/precompiles/randomness/RandomnessConsumer.sol";

contract RandomNumber is RandomnessConsumer {
    // The Randomness Precompile Interface
    Randomness public randomness =
        Randomness(0x0000000000000000000000000000000000000809);

    // Variables required for randomness requests
    uint256 public requiredDeposit = randomness.requiredDeposit();
    uint64 public FULFILLMENT_GAS_LIMIT = 100000;
    // The fee can be set to any value as long as it is enough to cover
    // the fulfillment costs. Any leftover fees will be refunded to the
    // refund address specified in the requestRandomness function below
    uint256 public MIN_FEE = FULFILLMENT_GAS_LIMIT * 5 gwei;
    uint32 public VRF_BLOCKS_DELAY = MIN_VRF_BLOCKS_DELAY;
    bytes32 public SALT_PREFIX = "change-me-to-anything";

    // Storage variables for the current request
    uint256 public requestId;
    uint256[] public random;

    constructor() payable RandomnessConsumer() {
        // Because this contract can only perform 1 random request at a time,
        // We only need to have 1 required deposit.
        require(msg.value >= requiredDeposit);
    }

    function requestRandomness() public payable {
        // Make sure that the value sent is enough
        require(msg.value >= MIN_FEE);
        // Request local VRF randomness
        requestId = randomness.requestLocalVRFRandomWords(
            msg.sender, // Refund address
            msg.value, // Fulfillment fee
            FULFILLMENT_GAS_LIMIT, // Gas limit for the fulfillment
            SALT_PREFIX ^ bytes32(requestId++), // A salt to generate unique results
            1, // Number of random words
            VRF_BLOCKS_DELAY // Delay before request can be fulfilled
        );
    }

    function fulfillRequest() public {
        randomness.fulfillRequest(requestId);
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        // Save the randomness results
        random = randomWords;
    }
}
```

As you can see, there are also some constants in the contract that can be edited as you see fit, especially the `SALT_PREFIX` which can be used to produce unique results.

如您所见，合约中还有一些常量需要调整，尤其是用于生成独特结果的`SALT_PREFIX`。

In the following sections, you'll use Remix to deploy and interact with the contract.

在以下部分中，您将使用Remix部署合约并与其交互。

### Remix Set Up - Remix设置 {: #remix-set-up}

To add the contract to Remix and follow along with this section of the tutorial, you will need to create a new file named `RandomnessNumber.sol` in Remix and paste the `RandomNumber` contract into the file.

要添加合约至Remix并遵循本教程操作，您需要在Remix中创建一个名为`RandomnessNumber.sol`的新文件并将`RandomNumber`合约粘贴至该文件。

![Add the random number generator contract to Remix.](/images/builders/pallets-precompiles/precompiles/randomness/randomness-2.png)

### Compile & Deploy the Random Number Generator Contract - 编译&部署随机数生成器合约 {: #compile-deploy-random-number }

To compile the `RandomNumber.sol` contract in Remix, you'll need to take the following steps:

要在Remix中编译`RandomNumber.sol`合约，请执行以下步骤：

1. Click on the **Compile** tab, second from top

   点击**Compile**标签（从上到下第二个）

2. Click on the **Compile RandomNumber.sol** button

   点击**Compile RandomNumber.sol**按钮

If the contract was compiled successfully, you will see a green checkmark next to the **Compile** tab.

成功编译合约后，您将在**Compile**标签旁边看到一个绿色的完成标记。

![Compile the random number generator contract in Remix.](/images/builders/pallets-precompiles/precompiles/randomness/randomness-3.png)

Now you can go ahead and deploy the contract by taking these steps:

现在您可以开始执行以下步骤部署合约：

1. Click on the **Deploy and Run** tab directly below the **Compile** tab

   在**Compile**标签下点击**Deploy and Run**

2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** dropdown. Once you select **Injected Provider - Metamask**, you might be prompted by MetaMask to connect your account to Remix

   确保在**ENVIRONMENT**下拉菜单中已选择**Injected Provider - Metamask**。选择**Injected Provider - Metamask**后，MetaMask将提示您链接账户至Remix

3. Make sure the correct account is displayed under **ACCOUNT**

   确保**ACCOUNT**下方显示是正确的账户

4. Enter the deposit amount in the **VALUE** field, which is `{{ networks.moonbase.randomness.req_deposit_amount.wei }}` in Wei (`{{ networks.moonbase.randomness.req_deposit_amount.dev }}` Ether)

   在**VALUE**字段中输入充值金额，即`{{ networks.moonbase.randomness.req_deposit_amount.wei }}` Wei（`{{ networks.moonbase.randomness.req_deposit_amount.dev }}` Ether）

5. Ensure **RandomNumber - RandomNumber.sol** is selected in the **CONTRACT** dropdown

   确保在**CONTRACT**下拉菜单中已选择**RandomNumber - RandomNumber.sol**

6. Click **Deploy**

   点击**Deploy**

7. Confirm the MetaMask transaction that appears by clicking **Confirm**

   在MetaMask跳出的弹窗中，点击**Confirm**确认交易

![Deploy the random number generator contract in Remix.](/images/builders/pallets-precompiles/precompiles/randomness/randomness-4.png)

The **RANDOMNUMBER** contract will appear in the list of **Deployed Contracts**.

**RANDOMNUMBER**合约将出现在**Deployed Contracts**列表中。

### Submit a Request to Generate a Random Number - 提交生成随机数的请求 {: #request-randomness }

To request randomness, you're going to use the `requestRandomness` function of the contract, which will require you to submit a deposit as defined in the Randomness Precompile. You can submit the randomness request and pay the deposit by taking these steps:

要请求随机数，您需要使用合约的`requestRandomness`函数，这将要求您按照Randomness Precompile中的定义提交保证金。您可以通过以下步骤提交随机数请求并支付保证金：

1. Enter an amount in the **VALUE** field for the fulfillment fee, it must be equal to or greater than the minimum fee specified in the `RandomNumber` contract, which is `500000` Gwei

   在**VALUE**字段中输入数量用于支付完成费用，该数值需等于或高于`RandomNumber`合约中指定的最低费用，即`500000` Gwei

2. Expand the **RANDOMNUMBER** contract

   展开**RANDOMNUMBER**合约

3. Click on the **requestRandomness** button

   点击**requestRandomness**按钮

4. Confrm the transaction in MetaMask

   在MetaMask中确认交易

![Request a random number using the random number generator contract in Remix.](/images/builders/pallets-precompiles/precompiles/randomness/randomness-5.png)

Once you submit the transaction, the `requestId` will be updated with the ID of the request. You can use the `requestId` call of the Random Number contract to get the request ID and the `getRequestStatus` functon of the Randomness Precompile to check the status of this request ID. 

提交交易后，`requestId`将更新为请求的ID。您可以使用随机数合约的`requestId`调用来获取请求ID，并使用Randomness Precompile的`getRequestStatus`函数来检查此请求ID的状态。

### Fulfill the Request and Save the Random Number - 完成请求和保存随机数 {: #fulfill-request-save-number }

After submitting the randomness request, you'll need to wait for the duration of the delay before you can fulfill the request. For the `RandomNumber.sol` contract, the delay was set to the minimum block delay defined in the Randomness Precompile, which is {{ networks.moonbase.randomness.min_vrf_blocks_delay }} blocks. You must also fulfill the request before it is too late. For local VRF, the request expires after {{ networks.moonbase.randomness.block_expiration }} blocks and for BABE epoch randomness, the request expires after {{ networks.moonbase.randomness.epoch_expiration }} epochs.

提交随机数请求后，您需要等待延迟时间段才能完成请求。对于`RandomNumber.sol`合约，延迟时间段设置为Randomness Precompile中定义的最小区块，即{{ networks.moonbase.randomness.min_vrf_blocks_delay }}区块。您必须在延迟时间段结束之前完成请求。对于本地VRF，请求在{{ networks.moonbase.randomness.block_expiration }}个区块后过期，对于BABE epoch随机数，请求在{{ networks.moonbase.randomness.epoch_expiration }}个epochs后过期。

Assuming you've waited for the minimum blocks (or epochs if you're using BABE epoch randomness) to pass and the request hasn't expired, you can fulfill the request by taking the following steps:

假设您已等待最小区块（如果您使用的是BABE epoch随机数，则为epochs）通过并且请求尚未过期，您可以通过以下步骤来完成请求：

1. Click on the **fulfillRequest** button

   点击**fulfillRequest**按钮

2. Confirming the transaction in MetaMask

   在MetaMask中确认交易

![Fulfill the randomness request using the random number generator contract in Remix.](/images/builders/pallets-precompiles/precompiles/randomness/randomness-6.png)

Once the request has been fulfilled, you can check the random number that was generated:

交易完成后，您可以查看生成的随机数：

1. Expand the **random** function

   展开**random**函数

2. Since the contract only requested one random word, you can get the random number by accessing the `0` index of the `random` array

   由于合约只要求一个随机词，您可以通过访问`random`数组的`0`索引来获取随机数

3. Click **call**

   点击**call**

4. The random number will appear below the **call** button 

   随机数将出现在**call**按钮下方

![Retrieve the random number that was generated by the random number contract in Remix.](/images/builders/pallets-precompiles/precompiles/randomness/randomness-7.png)

Upon successful fulfillment, the excess fees and deposit will be sent to the address specified as the refund address.

成功完成后，多余的费用和保证金将发送到指定的退款地址。

If the request happened to expire before it could be fulfilled, you can interact with the Randomness Precompile directly to purge the request and unlock the deposit and fees. Please refer to the following section for instructions on how to do this.

如果请求刚好在完成之前过期，您可以直接与Randomness Precompile交互以清除请求并解锁保证金和费用。有关如何执行此操作的说明，请参考以下部分。