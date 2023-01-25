---
title: Gelato Ops and Relay SDK
description: 使用Gelato自动化您的智能合约交互并将您的Moonbeam和Moonriver dev ops需求外包至最信赖的多链机器网络
---

# 开始使用Gelato

![Gelato Banner](/images/builders/integrations/relayers/gelato/gelato-banner.png)

## 概览 {: #introduction }

[Gelato Network](https://www.gelato.network/){target=_blank}是一个为Web3设计的去中心化自动网络，允许开发者横跨多个基于EVM兼容区块链上自动化和连接任意的智能合约执行。此网络依赖于称为[执行者（Executors）](https://docs.gelato.network/introduction/executor-operators){target=_blank}的广泛交易中继层运作，通过提供的基础设施和自动化服务获得奖励。Gelato被设计为更加稳固、去中心化和实惠的机器人基础设置运行的替代解决方案。

Gelato已上线Moonbeam和Moonriver，允许开发者和终端用户通过Gelato Ops以及Gelato Relay SDK自动化智能合约交互。首先，此教程将会包含使用Gelato Ops自动化智能合约交互的详细步骤。现在，您可以通过实际演示与Gelato Relay SDK交互。

--8<-- 'text/disclaimers/third-party-content-intro.md'

## Gelato Ops {: #gelato-ops }

[Gelato Ops](https://app.gelato.network/){target=_blank}为一个与Gelato网络交互和管理自动化交易的前端。无需注册，账户即可与您的钱包进行绑定。在本教程中，您需要部署一个可以通过lick函数启动的标准Gelato ice cream NFT。接着，您将依据特定的参数自动化lick函数。

![Gelato Ops 1](/images/builders/integrations/relayers/gelato/gelato-1.png)

### 创建一个自动化任务 {: #creating-an-automated-task }

要开始操作本教程，您需要在账户中拥有一定数量的GLMR/MOVR。接着导向至[Gelato Ops](https://app.gelato.network/){target=_blank}页面并确保您已在钱包中选取Moonbeam或Moonriver网络，并连接至Gelato。要启动本教程，请点击**Start Turtorial**，接着点击**Mint NFT**并在MetaMask确认交易。

接着请跟随以下步骤操作：

1. 输入您希望转入Gelato Ops账户的GLMR/MOVR数量，这些资金将会用于支付Gas费用。接着点击**Deposit**并在MetaMask确认交易
2. 点击**Create Task**
3. 复制您的ice cream NFT合约地址
4. 粘贴合约地址以允许Gelato自动获取ABI
5. 接着选取您希望自动化的函数，在本示例中选取lick函数
6. Lick函数需要一个参数，也就是要lick的NFT TokenID。输入与您的ice cream NFT相关的TokenID
7. 选择您希望如何设置您的自动化函数。您可以从时间表格选取或Gelato将会在适当的时机自动执行
8. 选取**Gelato Balance**来使用您存入的资金以支付自动化交易的Gas费用
9. 输入任务名称
10. 点击**Create Task**并在MetaMask确认交易。接着，签署下个MetaMask弹窗以确认任务名称

![Gelato Ops 2](/images/builders/integrations/relayers/gelato/gelato-2.png)

恭喜！您已经通过Gelato设置您第一个智能合约交互。您的自动化智能合约交互将会根据设置的时间执行直到用完剩余资金或Gelato Ops停止了该任务。此示例为一个简单的演示，您可以自动化更复杂的交互并在您的任务中逐步构建更加复杂的执行逻辑。您也可以查看[docs.gelato.network](https://docs.gelato.network/developer-products/gelato-ops-smart-contract-automation-hub){target=_blank}获得更多信息。

### 管理您的自动化任务 {: #managing-your-automated-tasks }

在[app.gelato.network](https://app.gelato.network/){target=_blank}上您将会见到您所有的自动化任务及其相关状态。您可以点击一个自动化任务以查看细节和执行历史。您也可以根据需求对自动化任务进行修改，包含暂停和持续此任务。要暂停一个任务，您可以在右上角点击**Pause**并在您的钱包确认交易。接着您可以在任何时间通过点击**Restart**并在钱包确认交易后重启此任务。

在页面最下方，您可以看见您的任务执行历史，包含交易状态和Gas花费。您可以点击**Task Logs**标签以查看自动化任务的历史细节，这将能够帮助您了解失败或未执行的交易。

![Gelato Ops 3](/images/builders/integrations/relayers/gelato/gelato-3.png)

### 管理您的Gas资金 {: #managing-your-gas-funds }

要在[app.gelato.network](https://app.gelato.network/){target=_blank}管理您的Gas资金，您可以在左上角点击**Funds**一栏，您可以在此存入或提取Gas资金。同时您也可以注册以在余额不足时收到通知。

您可以跟随以下步骤存入Gas资金：

1. 在左上角点击**Funds**一栏
2. 输入您希望存入的资金数量
3. 点击**Deposit**并在钱包中确认交易

您可以跟随以上步骤在Gelato存入或提取资金。

![Gelato Ops 4](/images/builders/integrations/relayers/gelato/gelato-4.png)

## Gelato Relay SDK {: #gelato-relay-sdk }

[Gelato Relay SDK](https://docs.gelato.network/developer-products/gelato-relay-sdk){target=_blank}为允许您与Gelato Relay API交互的函数集合。*Gelato Relay API是一个允许用户和开发者在无需处理区块链低复杂性的情况下，快速、稳定且安全地执行交易*。此功能的特色为提供用户无需Gas的交易。

### 使用Gelato Relay SDK传送无需Gas的交易 {: #send-a-gasless-transaction-with-gelato-relay-sdk }

无需Gas的交易，又称元交易，允许终端用户不需要支付Gas即可与智能合约交互。用户将会签署允许交易在中继层传送并支付相关费用的消息，而非在钱包中确认交易。[EIP-2771](https://eips.ethereum.org/EIPS/eip-2771){target=_blank}是一个允许元交易的普遍标准，通过[`HelloWorld.sol`合约](https://moonscan.io/address/0x3456E168d2D7271847808463D6D383D079Bd5Eaa#code){target=_blank}执行，此合约将会在其后的教程中提及。

在此演示中，您将会要求Gelato Relay SDK代表您调用`HelloWorld.sol`合约。使用的脚本来自Gelato Docs中的[快速开始教程](https://docs.gelato.network/developer-services/relay/quick-start){target=_blank}。请注意，此处并没有RPC提供者的依赖项，当交易和签署构建后，您仅需要简单将其传送至Gelato Relay API中。

### 开始操作 {: #getting-started }

Gelato Relay SDK是一个能够通过以下命令在当前目录本地安装的[NPM包](https://www.npmjs.com/package/@gelatonetwork/gelato-relay-sdk){target=_blank}：

```
npm install @gelatonetwork/gelato-relay-sdk
```

您也可以通过以下命令安装Ethers.js库：

```
npm install ethers
```

接着，您需要通过运行以下命令创建`hello-world.js`的Javascript文件：

```
touch hello-world.js
```

现在您已经完成事前准备。接着，您需要导入Gelato Relay SDK和Ethers.js：

```
  import { Wallet, utils } from "ethers";
  import { GelatoRelaySDK } from "@gelatonetwork/gelato-relay-sdk";
```

接着，创建一个包含脚本逻辑的函数：

```
const forwardRequestExample = async () => {

}
```

在`forwardRequestExample`函数中，定义链ID以及您希望交互的[`HelloWorld.sol` 合约](https://moonscan.io/address/0x3456E168d2D7271847808463D6D383D079Bd5Eaa#code){target=_blank}。

```
  const chainId = {{ networks.moonbeam.chain_id }};
  // `HelloWorld.sol` contract on Moonbeam
  const target = "0x3456E168d2D7271847808463D6D383D079Bd5Eaa";
```

[`HelloWorld.sol`合约](https://moonscan.io/address/0x3456E168d2D7271847808463D6D383D079Bd5Eaa#code){target=_blank}将会在生产以下内容，以支持无需Gas费用的交易。

```
// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {ERC2771Context} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";

/// @title HelloWorld with meta transaction support (EIP-2771)
contract HelloWorld is ERC2771Context {
    event Success(
        address indexed user,
        address indexed feeToken,
        string message
    );

    constructor(address _gelatoMetaBox) ERC2771Context(_gelatoMetaBox) {}

    function sayHiVanilla(address _feeToken) external {
        string memory message = "Hello World";

        emit Success(msg.sender, _feeToken, message);
    }

    function sayHi(address _feeToken) external {
        string memory message = "Hello World";

        emit Success(_msgSender(), _feeToken, message);
    }
}
```

接着，您可以创建一个新的测试账户以提交无需Gas费用的交易。此账户不安全且不应当被用于生产环境。本示例使用预设数值定义`test_token`作为展示，但您可以依据需求制定任何Token。

```
  const test_token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  // Create mock wallet
  const wallet = Wallet.createRandom();
  const sponsor = await wallet.getAddress();
  console.log(`Mock PK: ${await wallet._signingKey().privateKey}`);
  console.log(`Mock wallet address: ${sponsor}`);
```

### 添加请求数据 {: #add-request-data }

在此步骤中，您需要为将交互的函数提供ABI编码的调用数据，您可以跟随以下步骤执行：

1. 导向至[Moonscan上`HelloWorld.sol`合约](https://moonscan.io/address/0x3456E168d2D7271847808463D6D383D079Bd5Eaa#writeContract){target=_blank}的**Write Contract**标题 
2. 点击**Connect to Web3**，在接受条款后您可以连接您的钱包
3. 导向至`sayHiVanilla`函数并为`_feeToken`参数提供以下的预设数值：`0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`
4. 点击**Write**
5. 无需在MetaMask中确认交易，点击**Hex**标签
6. 点击**Copy Raw Transaction Data**

获得的ABI编码调用数据应当为`0x4b327067000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeaeeeeeeeeeeeeeeeee`

![Gelato Relay SDK](/images/builders/integrations/relayers/gelato/gelato-5.png)

此ABI编码调用数据制定了调用的合约函数以及任何相关参数，并可以通过MetaMask或Remix获取。另外，您或许可以通过Ether.js或是Web3.js获取ABI编码调用数据。有一些额外的参数在以下示例中定义，如`paymentType`、`maxFee`以及`gas`。您可以选取不同可用的支付类型。为简单起见，重复播放保护未包含在此示例中。

```
  // ABI encode for HelloWorld.sayHiVanilla(address _feeToken)
  const data = `0x4b327067000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeaeeeeeeeeeeeeeeeee`;
  const paymentType = 1;
  // Maximum fee that sponsor is willing to pay worth of test_token
  const maxFee = "1000000000000000000";
  // Gas limit
  const gas = "200000";
  
  // Smart contract nonces are not enforced to simplify the example.
  // In reality, this decision depends whether or not target
  // address already implements replay protection. (More info in the docs)
  const sponsorNonce = 0;
  const enforceSponsorNonce = false;
  // Only relevant when enforceSponsorNonce = true
  const enforceSponsorNonceOrdering = false;

  // Build ForwardRequest object
  const forwardRequest = GelatoRelaySDK.forwardRequest(
    chainId,
    target,
    data,
    test_token,
    paymentType,
    maxFee,
    gas,
    sponsorNonce,
    enforceSponsorNonce,
    sponsor
  );

```

最后，`forwardRequest`对象将被创建，且具有先前步骤中定义的所有相关函数。在最终步骤，`forwardRequest`对象将会与所需的签名被传送至Gelato Relay API。

### 传送请求数据 {: #send-request-data }

最后的几个步骤包含散列请求对象以及签署结果的哈希。最后一步为提交请求和签名至Gelato Relay API。您可以在`forwardRequest`对象后复制并粘贴以下代码：

```
  // Get EIP-712 hash (aka digest) of forwardRequest
  const digest = GelatoRelaySDK.getForwardRequestDigestToSign(forwardRequest);

  // Sign digest using mock private key
  const sponsorSignature = utils.BytesLike = utils.joinSignature(
    await wallet._signingKey().signDigest(digest)
  );

  // Send forwardRequest and its sponsorSignature to Gelato Relay API
  await GelatoRelaySDK.sendForwardRequest(forwardRequest, sponsorSignature);

  console.log("ForwardRequest submitted!");
```

[EIP-712标准](https://eips.ethereum.org/EIPS/eip-712){target=_blank}为用户提供他们授权动作的重要内容。[EIP-712](https://eips.ethereum.org/EIPS/eip-712){target=_blank}并非签署一个长的、无法识别的字节串（该字符串危险且可能被恶意用户利用），而是提供了一个以可读方式编码和显示消息内容的框架，使终端用户更加安全。

要执行脚本并调用无需Gas交易至Gelato Relay API，您可以使用以下命令：

```
node hello-world.js
```

您应当在终端中看见`ForwardRequest submitted!`消息，您同样也可以通过在[Moonscan上的Gelato合约](https://moonscan.io/address/0x91f2a140ca47ddf438b9c583b7e71987525019bb){target=_blank}查看最新的交易。

### 完整脚本 {: #complete-script }

完整的`hello-world.js`文件应包含以下内容：

```
import { Wallet, utils } from "ethers";
import { GelatoRelaySDK } from "@gelatonetwork/gelato-relay-sdk";

const forwardRequestExample = async () => {

  const chainId = {{ networks.moonbeam.chain_id }};
  // `HelloWorld.sol` contract on Moonbeam
  const target = "0x3456E168d2D7271847808463D6D383D079Bd5Eaa";
  const test_token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  
  // Create mock wallet
  const wallet = Wallet.createRandom();
  const sponsor = await wallet.getAddress();
  console.log(`Mock PK: ${await wallet._signingKey().privateKey}`);
  console.log(`Mock wallet address: ${sponsor}`);
  
  // ABI encode for HelloWorld.sayHiVanilla(address _feeToken)
  const data = `0x4b327067000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeaeeeeeeeeeeeeeeeee`;
  const paymentType = 1;
  // Maximum fee that sponsor is willing to pay worth of test_token
  const maxFee = "1000000000000000000";
  // Gas limit
  const gas = "200000";
 
  // Smart contract nonces are not enforced to simplify the example.
  // In reality, this decision depends whether or not target 
  // address already implements replay protection. (More info in the docs)
  const sponsorNonce = 0;
  const enforceSponsorNonce = false;
  // Only relevant when enforceSponsorNonce = true
  const enforceSponsorNonceOrdering = false;

  // Build ForwardRequest object
  const forwardRequest = GelatoRelaySDK.forwardRequest(
    chainId,
    target,
    data,
    test_token,
    paymentType,
    maxFee,
    gas,
    sponsorNonce,
    enforceSponsorNonce,
    sponsor
  );

  // Get EIP-712 hash (aka digest) of forwardRequest
  const digest = GelatoRelaySDK.getForwardRequestDigestToSign(forwardRequest);

  // Sign digest using mock private key
  const sponsorSignature = utils.BytesLike = utils.joinSignature(
    await wallet._signingKey().signDigest(digest)
  );

  // Send forwardRequest and its sponsorSignature to Gelato Relay API
  await GelatoRelaySDK.sendForwardRequest(forwardRequest, sponsorSignature);

  console.log("ForwardRequest submitted!");

};

forwardRequestExample();
```

--8<-- 'text/disclaimers/third-party-content.md'