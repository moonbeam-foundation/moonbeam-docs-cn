---
title: 使用随机数预编译创建彩票
description: 想要创建一个彩票智能合约？遵循本分步教程使用Moonbeam的随机数预编译（一个Solidity接口）开始操作
---

# 使用随机数预编译创建一个彩票合约

_本文档更新至2022年3月15日｜作者：Erin Shaben_

## 概览 {: #introduction } 

Moonbeam使用可验证随机函数（Verifiable Random Functions，VRF）生成可以在链上验证的随机数。VRF是一种加密函数，它接受一些输入并产生随机值以及这些随机值是由提交者生成的真实性证明。此证明可以由任何人验证，以确保生成的随机数值计算正确。

目前有两种可用随机数来源，他们基于区块生产者的VRF密钥以及过去的随机数结果提供随机输入：[本地VRF](/learn/features/randomness/#local-vrf){target=_blank}和[BABE Epoch随机数](/learn/features/randomness/#babe-epoch-randomness){target=_blank}。本地VRF直接在Moonbeam中使用区块收集人的VRF密钥以及最新区块的VRF输出值决定。而[BABE](https://wiki.polkadot.network/docs/learn-consensus#block-production-babe){target=_blank} Epoch随机数是基于由中继链验证人在一个完整[Epoch](https://wiki.polkadot.network/docs/glossary#epoch){target=_blank}期间生产的所有VRF。

获取关于这两种随机数的更多信息，包括请求和履行流程如何工作，以及安全考量，请参考[Moonbeam上的随机数](/learn/features/randomness){target=_blank}页面。

Moonbeam提供[随机数预编译](/builders/pallets-precompiles/precompiles/randomness){target=_blank}，这是一个Solidity接口，使智能合约开发者能够使用以太坊API通过本地VRF或BABE epoch随机数生成随机数。Moonbeam也提供一个[随机数消费者Solidity合约](/builders/pallets-precompiles/precompiles/randomness/#randomness-consumer-solidity-interface){target=_blank}，您的合约必须继承自该合约才能使用已履行的随机数请求。

本教程将向您展示如何使用随机数预编译和随机数消费者合约创建一个随机挑选获胜者的彩票合约。

## 查看先决条件 {: #checking-prerequisites }

在开始操作之前，您需要准备以下内容：

- 在Moonbase Alpha上创建/拥有三个账户，用于测试彩票合约
- 所有账户必须拥有一些`DEV` Token
 --8<-- 'text/faucet/faucet-list-item.md'
- 一个已配置Moonbase Alpha测试网的空白Hardhat项目。要获取分步操作教程，请参考[创建一个Hardhat项目](/builders/build/eth-api/dev-env/hardhat/#creating-a-hardhat-project){target=_blank}和我们Hardhat文档页面的[Hardhat配置文件](/builders/build/eth-api/dev-env/hardhat/#hardhat-configuration-file){target=_blank}部分
- 安装[Hardhat Ethers插件](https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html){target=_blank}。这将为您提供更简便的方式以使用[Ethers.js](/builders/build/eth-api/libraries/ethersjs/){target=_blank}库与Hardhat项目中的网络交互：

    ```
    npm install @nomiclabs/hardhat-ethers
    ```

!!! 注意事项
    --8<-- 'text/common/endpoint-examples.md'

## 合约设置 {: #contracts }

以下为我们本次操作指南中创建彩票合约会用到的合约：

- `Randomness.sol` - [随机数预编译](/builders/pallets-precompiles/precompiles/randomness){target=_blank}，这是一个Solidity接口，允许您请求随机数、获取关于随机数请求的信息、并履行请求等
- `RandomnessConsumer.sol` - [随机数消费者](/builders/pallets-precompiles/precompiles/randomness#randomness-consumer-solidity-interface){target=_blank}，是一个抽象的Solidity合约，用于与随机数预编译交互。此合约负责验证随机数请求的origin（来源），确保随机数预编译始终是origin，并履行请求
- `Lottery.sol` - 一个示例彩票合约，我们将在本教程中构建此合约。它将依靠随机数预编译和随机数消费者来请求用于挑选彩票获胜者的随机词

如果您尚未在Hardhat项目中创建`contracts`目录，您需要创建一个新目录：

```
mkdir contracts && cd contracts
```

然后您可以创建以下三个文件，每个文件对应上述合约：

```
touch Randomness.sol RandomnessConsumer.sol Lottery.sol
```

在`Randomness.sol`文件中，您可以粘贴[随机数预编译合约](https://github.com/PureStake/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=_blank}。同样的，在`RandomnessConsumer.sol`文件中，您可以粘贴[随机数消费者合约](https://github.com/PureStake/moonbeam/blob/master/precompiles/randomness/RandomnessConsumer.sol){target=_blank}。

我们将在以下部分开始添加功能至`Lottery.sol`合约。

## 创建彩票智能合约 {: #write-the-lottery-contract }

从更高层面来说，我们正在创建的彩票合约将定义彩票规则，允许参与并使用随机生成的词来公平挑选获胜者。我们将通过随机数预编译请求随机词。然后，我们将使用随机数消费者接口消费已完成请求的结果，以便我们的合约可以使用随机生成的词挑选获胜者并支付奖励。我们将会在构建彩票合约时演示分步流程。但是现在，您可以查看下图了解整个流程。

![Diagram of the Lottery process.](/images/tutorials/eth-api/randomness-lottery/lottery-1.png)

**此合约仅用于演示目的，不可用于生产环境。**

开始之前，请先设置彩票合约。为此，您需要：

- 导入`Randomness.sol`预编译和`RandomnessConsumer.sol`接口
- 继承RandomnessConsumer接口
- 创建一个随机数预编译变量randomness，以便我们后续轻松访问其函数

```sol
// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.0;

import "./Randomness.sol";
import {RandomnessConsumer} from "./RandomnessConsumer.sol";

contract Lottery is RandomnessConsumer {
    // Randomness Precompile interface
    Randomness public randomness =
        Randomness(0x0000000000000000000000000000000000000809);
}
```

### 为Lottery和随机数请求定义参数 {: #define-parameters }

接下来，我们需要为彩票定义规则，例如：

- 参与费
- 最低/最高参与人数
- 彩票的最短长度
- 获胜者人数

在`Lottery`合约中，您可以添加以下参数：

```sol
// 中奖人数。此数字对应多少个随机词将被请求。不能超过MAX_RANDOM_WORDS（来自随机数预编译）
uint8 public NUM_WINNERS = 2;

// 可以履行请求之前的区块数（针对本地VRF随机数）。MIN_VRF_BLOCKS_DELAY（来自随机数预编译）
// 为经济价值低的游戏提供足够安全的最小数量。稍微增加延迟会降低收集人能够预测伪随机数的本已很低的概率
uint32 public VRF_BLOCKS_DELAY = MIN_VRF_BLOCKS_DELAY;

// 开始抽奖的最低参与人数
uint256 public MIN_PARTICIPANTS = 3;

// 允许的最高参与人数。 重要的是限制总累积奖池（通过限制参与者数量）以保证收集人的经济激励
// 以避免试图影响伪随机数。（有关详细信息，请参阅 Randomness.sol）
uint256 public MAX_PARTICIPANTS = 20;

// 参与抽奖所需的费用。将进入累积奖池
uint256 public PARTICIPATION_FEE = 100000 gwei;
```

我们也需要定义一些与请求随机数特别相关的参数：

- 履行随机数请求的交易的gas限制
- 开始抽奖并请求随机词所需的最低费用。每个随机数请求都需要支付执行费用。此费用的目的是支付随机数请求的执行费用，这样就可以允许任何人履行请求，因为该请求的费用已支付。当提交随机数请求时，需要指定退款账户，用于接收多余的退款。设置合约时需要设置彩票合约的所有者将收到退款
- salt前缀和全局请求计数都将用于生成唯一的随机数请求

接下来，您可以添加以下参数：

```
// 用于执行的gas限制，其取决于执行的代码和请求的字词个数。
// 根据请求的大小和fulfillRandomWords()函数中回调请求的处理来测试和调整这个限制
uint64 public FULFILLMENT_GAS_LIMIT = 100000;

// 开始抽奖所需的最低费用。这并不能保证有足够的费用来支付履行所使用的gas。
// 理想情况下，考虑到可能的gas价格波动，应该设一个较大的值。额外费用将退还给调用者
uint256 public MIN_FEE = FULFILLMENT_GAS_LIMIT * 1 gwei;

// 一个字符串，用于允许使用与其他合约不同的salt
bytes32 public SALT_PREFIX = "my_demo_salt_change_me";

// 存储提交的请求的全局数量。这个数字被用作使每个请求唯一的salt
uint256 public globalRequestCount;

```

除了这些参数，我们需要创建一些变量，用于追踪当前的彩票：

- 当前的请求ID
- 当前的参与者列表
- 奖池设置
- 彩票合约的所有者。这是必不可少的，因为只有合约所有者才有权限开启抽奖
- 所使用的随机数来源（本地VRF或BABE epoch）

```
// The current request id
uint256 public requestId;

// The list of current participants
address[] public participants;

// The current amount of token at stake in the lottery
uint256 public jackpot;

// the owner of the contract
address owner;

// Which randomness source to use. This correlates to the values in the
// RandomnessSource enum in the Randomness Precompile
Randomness.RandomnessSource randomnessSource;
```

### 创建构造函数 {: #create-constructor }

现在，我们已经完成了彩票所需的所有变量的初始设置，接下来我们可以开始编写函数以设置彩票。首先，我们将从创建构造函数开始。

构造函数接受一个*uint8*参数作为随机数来源，这对应位于随机数预编译中的[`RandomnessSource` enum](https://github.com/PureStake/moonbeam/blob/master/precompiles/randomness/Randomness.sol#L44-L47){target=_blank}中定义的随机数类型的索引。因此，我们需要为本地VRF传入`0`或者为BABE epoch随机数传入`1`。此函数将是`payable`，因为我们需要在部署时提交保证金并在后续用于执行随机数请求

[保证金](https://github.com/PureStake/moonbeam/blob/master/precompiles/randomness/Randomness.sol#L17){target=_blank}在随机数预编译中定义，这是和执行费用一样必不可少的。在完成请求后，保证金将退还给初始请求者，在本示例中为合约的所有者。如果未完成请求，则该请求会过期且需要被清除。请求清除后，保证金将被退还。

```
constructor(
    Randomness.RandomnessSource source
) payable RandomnessConsumer() {
    // Because this contract can only perform one randomness request at a time,
    // we only need to have one required deposit
    uint256 requiredDeposit = randomness.requiredDeposit();
    if (msg.value < requiredDeposit) {
        revert("Deposit too Low");
    }
    // Update parameters
    randomnessSource = source;
    owner = msg.sender;
    globalRequestCount = 0;
    jackpot = 0;
    // Set the requestId to the maximum allowed value by the precompile (64 bits)
    requestId = 2 ** 64 - 1;
}
```

### 为彩票中的参与者添加逻辑 {: #participate-logic }

接下来，我们可以创建函数，以允许用户参与到彩票抽奖中。`participate`函数将是`payable`，因为每个参与者将需要提交一个参与费。

`participate`函数将包含以下逻辑：

- 使用随机数预编译的[`getRequestStatus`函数](https://github.com/PureStake/moonbeam/blob/master/precompiles/randomness/Randomness.sol#L96-L99){target=_blank}检查彩票是否尚未开始。此函数将返回通过[`RequestStatus` enum](https://github.com/PureStake/moonbeam/blob/master/precompiles/randomness/Randomness.sol#L34-L39){target=_blank}定义的状态。如果状态不是`DoesNotExist`，则表示彩票已开始
- 检查参与费是否满足要求
- 如果上述两项都符合要求，则参与者将被添加至参与者列表当中，他们的参与费将被加入到奖池中

```sol
function participate() external payable {
    // We check that the lottery hasn't started yet
    if (
        randomness.getRequestStatus(requestId) !=
        Randomness.RequestStatus.DoesNotExist
    ) {
        revert("Request already initiated");
    }

    // Each player must submit a fee to participate, which is added to
    // the jackpot
    if (msg.value != PARTICIPATION_FEE) {
        revert("Invalid participation fee");
    }
    participants.push(msg.sender);
    jackpot += msg.value;
}
```

!!! 挑战
    在上述函数中，我们检查了彩票尚未开始，但是如果我们想要了解彩票的明确状态呢？请创建一个函数来解决此问题并返回彩票状态。

### 添加逻辑以启动彩票和请求随机数 {: #start-lottery-logic }

启动彩票的逻辑包含一个重要的组件：请求随机数。如上所述，只有彩票合约的所有者才有权限开启彩票抽奖。这样一来，所有者需要为请求提交执行费用。

`startLottery`函数将包含以下逻辑：

- 检查彩票是否尚未开始，操作方式如`participate`函数所示
- 检查是否达到要求的参与者数量
- 检查执行费用是否满足最低要求
- 检查合约余额是否足够支付保证金。还记得构造函数是如何接受请求保证金的吗？保证金将存储于合约中直到此函数被调用
- 如果上述条件均返回true，我们将通过随机数预编译连同履行费用一起提交随机数请求。根据随机数来源，随机数预编译的[`requestLocalVRFRandomWords`或`requestRelayBabeEpochRandomWords`函数](https://github.com/PureStake/moonbeam/blob/master/precompiles/randomness/Randomness.sol#L110-L167){target=_blank}将和以下参数一起被调用：
    - 接收多余费用退款的地址
    - 履行费用
    - 履行请求的gas上限
    - salt，这是一个字符串，与随机数种子（randomness seed）共同使用以获取不同的随机词。`globalRequestCount`用于确保独特性
    - 请求随机词的数量，基于挑选的获胜者数量设定
    - （仅支持本地VRF）延迟时间，在履行请求之前必须通过的区块数量

由于彩票功能仅限所有者调用，因此我们也需要添加`onlyOwner`修饰符来要求`msg.sender`为`owner`。

```
function startLottery() external payable onlyOwner {
    // Check we haven't started the randomness request yet
    if (
        randomness.getRequestStatus(requestId) !=
        Randomness.RequestStatus.DoesNotExist
    ) {
        revert("Request already initiated");
    }
    // Check that the number of participants is acceptable
    if (participants.length < MIN_PARTICIPANTS) {
        revert("Not enough participants");
    }
    if (participants.length >= MAX_PARTICIPANTS) {
        revert("Too many participants");
    }
    // Check the fulfillment fee is enough
    uint256 fee = msg.value;
    if (fee < MIN_FEE) {
        revert("Not enough fee");
    }
    // Check there is enough balance on the contract to pay for the deposit.
    // This would fail only if the deposit amount required is changed in the
    // Randomness Precompile.
    uint256 requiredDeposit = randomness.requiredDeposit();
    if (address(this).balance < jackpot + requiredDeposit) {
        revert("Deposit too low");
    }

    if (randomnessSource == Randomness.RandomnessSource.LocalVRF) {
        // Request random words using local VRF randomness
        requestId = randomness.requestLocalVRFRandomWords(
            msg.sender,
            fee,
            FULFILLMENT_GAS_LIMIT,
            SALT_PREFIX ^ bytes32(globalRequestCount++),
            NUM_WINNERS,
            VRF_BLOCKS_DELAY
        );
    } else {
        // Requesting random words using BABE Epoch randomness
        requestId = randomness.requestRelayBabeEpochRandomWords(
            msg.sender,
            fee,
            FULFILLMENT_GAS_LIMIT,
            SALT_PREFIX ^ bytes32(globalRequestCount++),
            NUM_WINNERS
        );
    }
}

modifier onlyOwner() {
    require(msg.sender == owner);
    _;
}
```

### 添加逻辑以履行随机数请求 {: #fulfill-randomness-logic }

在这一部分，我们将添加履行请求和处理请求结果的两个函数：`fulfillRequest`和`fulfillRandomWords`。

`fulfillRequest`函数将调用随机数预编译的[`fulfillRequest`函数](https://github.com/PureStake/moonbeam/blob/master/precompiles/randomness/Randomness.sol#L173){target=_blank}。在调用此函数时，会在下面调用随机数消费者的[`rawFulfillRandomWords`函数](https://github.com/PureStake/moonbeam/blob/master/precompiles/randomness/RandomnessConsumer.sol#L114-L125){target=_blank}，这将验证调用来自随机数预编译。从那里，调用随机数消费者合约的[`fulfillRandomWords`函数](https://github.com/PureStake/moonbeam/blob/master/precompiles/randomness/RandomnessConsumer.sol#L107-L109){target=_blank}，并使用区块的随机数结果和给定的salt计算请求的随机词，然后将其返回。如果请求成功完成，将发出`FulfillmentSucceeded`事件；反之，将发出`FulfillmentFailed`事件。

对于已完成的请求，执行费用将从请求费用中退还给`fulfillRequest`的调用者。然后，任何多余的费用和请求保证金将转移给指定退款地址。

`fulfillRandomWords`函数定义回调函数`pickWinners`，其负责处理完成请求。在本示例中，回调函数将使用随机词挑选获胜者并支付奖励。`fulfillRandomWords`函数的签名必须与随机数消费者的`fulfillRandomWords`函数的签名一致。


```
function fulfillRequest() public {
    randomness.fulfillRequest(requestId);
}

function fulfillRandomWords(
    uint256 /* requestId */,
    uint256[] memory randomWords
) internal override {
    pickWinners(randomWords);
}
```

我们将在下一部分为`pickWinners`函数创建逻辑。

!!! 挑战
    如果在请求履行之前，因为gas价格变化很大而导致此函数失败？目前我们无法增加履行费用，请创建一个函数来解决此问题并允许我们增加履行费用。

### 添加逻辑以挑选彩票获胜者 {: #pick-winners-logic }

彩票合约的最后一步是创建`pickWinners`函数，如上所述，该函数负责使用随机词为彩票抽奖挑选获胜者。

`pickWinners`函数包含以下逻辑：

- 确定获胜者数量。如果您修改了`NUM_WINNERS`或`MIN_PARTICIPANTS`的数量时必须设置此值，因为`NUM_WINNERS`需大于`MIN_PARTICIPANTS`
- 根据奖池中的数量和获胜者总人数计算获胜者的奖金数量
- 使用随机词确定获胜者
- 为每位获胜者分发奖励，确保在分发之前将奖励从奖池中移除

```
// This function is called only by the fulfillment callback
function pickWinners(uint256[] memory randomWords) internal {
    // Get the total number of winners to select
    uint256 totalWinners = NUM_WINNERS < participants.length
        ? NUM_WINNERS
        : participants.length;

    // The amount distributed to each winner
    uint256 amountAwarded = jackpot / totalWinners;
    for (uint32 i = 0; i < totalWinners; i++) {
        // This is safe to index randomWords with i because we requested
        // NUM_WINNERS random words
        uint256 randomWord = randomWords[i];

        // Using modulo is not totally fair, but fair enough for this demo
        uint256 index = randomWord % participants.length;
        address payable winner = payable(participants[index]);
        delete participants[index];
        jackpot -= amountAwarded;
        winner.transfer(amountAwarded);
    }
}
```

恭喜您！您已经完成了创建`Lottery.sol`合约的整个过程了！您可以在gitHub上查看[`Lottery.sol`合约](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/randomness/Lottery.sol){target=_blank}的完整版本。请注意，**此合约仅用于演示目的，不可用于生产环境。**

!!! 挑战
    您可以在开始创建彩票、选择获胜者或分配奖励给获胜者时添加一些事件，以便让合约更易于使用。

## 与彩票合约交互 {: #interact-with-lottery-contract }

现在，我们已经了解并创建了彩票合约，接下来可以开始部署并启动彩票抽奖。

### 编译和部署彩票合约 {: #compile-deploy-lottery-contract }

要编译合约，您可以简单运行：

```
npx hardhat compile
```

![Compile the contracts using Hardhat's compile command.](/images/tutorials/eth-api/randomness-lottery/lottery-2.png)

编译后，将会创建`artifacts`目录：这将存放合约的字节码和元数据，即`.json`文件。建议您将此目录添加至`.gitignore`。

在开始部署`Lottery.sol`合约之前，我们需要创建一个部署脚本。

您可以为脚本创建一个新目录并命名为`scripts`，然后向其添加名为`deploy.js`的新文件：

```
mkdir scripts && 
touch scripts/deploy.js
```

我们可以使用`ethers`编写部署脚本。我们将使用Hardhat运行此脚本，因此无需导入任何其他库，只需简单执行以下步骤：

1. 使用`getContractFactory`函数创建一个彩票合约的本地示例
2. 使用随机数预编译的`requiredDeposit`函数获取随机数请求所需的保证金
3. 使用存在于本实例中的`deploy`函数以实例化智能合约。您可以传入`0`以使用本地VRF随机数或者传入`1`以使用BABE epoch随机数。在本示例中，我们使用的是本地VRF随机数。我们也需要在部署时提交保证金
4. 使用`deployed`等待部署
5. 部署好后，我们可以使用合约实例获取合约地址

```js
async function main() {
  // 1. Get the contract to deploy
  const Lottery = await ethers.getContractFactory('Lottery');

  // 2. Get the required deposit amount from the Randomness Precompile
  const Randomness = await ethers.getContractAt(
    'Randomness',
    '0x0000000000000000000000000000000000000809'
  );
  const deposit = await Randomness.requiredDeposit();

  // 3. Instantiate a new Lottery smart contract that uses local VRF
  // randomness and pass in the required deposit
  const lottery = await Lottery.deploy(0, { value: deposit });
  console.log('Deploying Lottery...');

  // 4. Waiting for the deployment to resolve
  await lottery.deployed();

  // 5. Use the contract instance to get the contract address
  console.log('Lottery deployed to:', lottery.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

```

要部署彩票合约，我们将使用`run`命令并将`moonbase`指定为网络：

```
npx hardhat run --network moonbase scripts/deploy.js
```

您也可以使用其他Moonbeam网络，请确保指向正确的网络。网络名称需要与`hardhat.config.js`中定义的保持一致。

几秒钟后，合约成功部署，您将在终端看到合约地址。保存合约地址，我们将在下一部分中用于合约实例交互。

![Deploy the Lottery contract using Hardhat's run command.](/images/tutorials/eth-api/randomness-lottery/lottery-3.png)

### 创建脚本以与彩票合约交互 {: #participate-in-lottery }

我们可以继续使用我们的Hardhat项目，另外创建脚本来与彩票合约交互并调用它的一些功能。例如，我们可以在`scripts`目录中创建另一个脚本来参与彩票抽奖：

```
touch participate.js
```

然后，我们可以添加以下代码，这将使用合约名称和合约地址创建彩票合约的实例。接下来，我们可以直接从合约获取参与费用和调用合约的`participate`函数：

```js
async function participate() {
    const lottery = await ethers.getContractAt('Lottery', 'INSERT-CONTRACT-ADDRESS');

    const participationFee = await lottery.PARTICIPATION_FEE();
    const tx = await lottery.participate({ value: participationFee });
    console.log('Participation transaction hash:', tx.hash);
}

participate()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```

要运行此脚本，您可以使用以下命令：

```
npx hardhat run --network moonbase scripts/participate.js
```

交易哈希将在后台显示。您可以使用哈希在[Moonscan](https://moonbase.moonscan.io){target=_blank}查看交易。

![Run the partipation script using Hardhat's run command.](/images/tutorials/eth-api/randomness-lottery/lottery-4.png)

这样就可以了！您可以继续创建另外的脚本来执行彩票的后续步骤，例如启动彩票抽奖和挑选获胜者。

--8<-- 'text/disclaimers/educational-tutorial.md'

--8<-- 'text/disclaimers/third-party-content.md'