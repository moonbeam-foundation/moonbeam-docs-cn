---
title: 使用Remix部署智能合约
description: 学习如何使用最受欢迎的以太坊开发工具之一Remix IDE在Moonbeam上部署Solidity智能合约，并与其交互。
---

# 使用Remix部署合约至Moonbeam

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/TkbYDRzVe7g?si=eX2hFClaMaf0AQLc' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## 概览 {: #introduction }

[Remix](https://remix.ethereum.org/){target=\_blank}是一个集成开发环境（IDE），用于在以太坊和以太坊兼容链上开发智能合约。它提供了一个易于使用的界面，供开发者编写、编译和部署智能合约。得益于Moonbeam的以太坊兼容性功能，您可以直接在任何Moonbeam网络中使用 Remix。

本教程将介绍使用Remix IDE在[Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev/){target=\_blank}上创建和部署基于Solidity智能合约的过程。此教程同时适用于[Moonbeam](/builders/get-started/networks/moonbeam/){target=\_blank}、[Moonriver](/builders/get-started/networks/moonriver/){target=\_blank}和[Moonbase Alpha](/builders/get-started/networks/moonbase/){target=\_blank}网络。

如果您已熟悉Remix，你可以直接跳到[连接Remix至Moonbeam](#connect-remix-to-moonbeam){target=\_blank}部分，学习如何将Remix与Moonbeam结合使用。

## 查看先决条件 {: #checking-prerequisites }

在开始之前，您将需要准备以下内容：

- 本地运行的[Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev/){target=\_blank}
- [安装且配置完毕的MetaMask](/tokens/connect/metamask/){target=\_blank}以使用您的开发节点

如果您已遵循上述教程，您将会拥有一个正在收集交易以生产区块的本地Moonbeam节点。

--8<-- 'text/builders/build/eth-api/dev-env/remix/terminal/node.md'

您的开发节点具有10个拥有资金的账户，确保将MetaMask连接至您的Moonbeam开发节点并导入至少一个预注资的账户。您可以参考MetaMask文档的[导入账户](/tokens/connect/metamask#import-accounts){target=\_blank}部分的分步教程，了解如何导入开发账户。

![The main screen of MetaMask, which shows an account connected to a Moonbeam development node and its balance.](/images/builders/ethereum/dev-env/remix/remix-1.webp)

如果您正在Moonbeam、Moonriver或是Moonbase Alpha网络上跟随此教程进行操作，请确保您连接的是正确的网络并拥有具有一定资金的账户。
--8<-- 'text/_common/faucet/faucet-sentence.md'

## 初步了解Remix {: #get-familiar-with-remix }

前往[https://remix.ethereum.org/](https://remix.ethereum.org/){target=\_blank}，可以看到页面分为四个部分：

1. 插件面板
2. 侧面板
3. 主面板
4. 终端面板

![The layout of Remix IDE and its four sections.](/images/builders/ethereum/dev-env/remix/remix-2.webp)

插件面板显示每个预加载插件的图标、插件管理器和设置菜单。您将看到每个预加载插件的一些图标，分别是**文件管理器**、**搜索**、**Solidity编译器**以及**部署和运行交易**插件。其他插件被激活时，其图标将出现在该操作面板中。

侧面板显示当前查看的插件详情。默认情况下，进入首页您会在此处看到文件管理器的详情，即默认工作区和一些预加载的文件和文件夹。如果您选择左侧插件栏的其他图标，此处将替换为所选插件的详情。

主面板会随着**主页**标签自动加载，其中包含各种渠道的链接。您可以随时关闭此选项卡，然后通过单击插件面板左上角的蓝色Remix图标重新打开它。您可以在主面板中查看正在使用的每个文件。举例来说，您可以双击**文件管理器**侧面板中的任何文件，它将在主面板中打开标签页。

终端面板类似于操作系统上的标准终端；您可以从中执行脚本，并将日志打印到其中。所有交易和合约交互都会自动记录到终端。您还可以直接从终端与[Ethers](https://docs.ethers.org/v6/){target=\_blank}和[Web3](https://web3js.org/#/){target=\_blank}的JavaScript库交互。

## 添加智能合约至文件管理器 {: #add-a-smart-contract-to-the-file-explorer }

在本示例中，您将创建一个包含ERC-20 Token合约的新文件。这是一个简单的ERC-20合约，基于现有的[OpenZeppelin ERC-20模板](https://docs.openzeppelin.com/contracts/4.x/erc20){target=\_blank}创建。该合约将创建一个`MyToken` Token（带有`MYTOK`符号），该Token将向合约创建者铸造全部初始供应量。

在插件面板的**File explorer**标签处，您可以通过执行以下步骤创建新文件：

1. 点击文件图标
2. 输入合约名称：`MyToken.sol`

![Create a new file using the File explorer plugin in Remix.](/images/builders/ethereum/dev-env/remix/remix-3.webp)

主面板将切换至一个空白文件，您可以在此处为合约添加Solidity代码。将`MyToken.sol`智能合约粘贴至新的文件中：

```solidity
--8<-- 'code/builders/ethereum/dev-env/remix/MyToken.sol'
```

![Add the contract code to the newly created file in the main panel of Remix.](/images/builders/ethereum/dev-env/remix/remix-4.webp)

## 编译Solidity智能合约 {: #compile-a-solidity-smart-contract }

在编译合约前，确保您已从**File explorer**标签处选中合约的文件。然后从插件面板处选择**Solidity Compiler**。

确保左上角的编译器版本符合您的合约中定义的版本以及[OpenZeppelin的`ERC20.sol`合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol){target=\_blank}中定义的版本。例如，`MyToken.sol`合约所需版本为Solidity ^0.8.30，但截至本文撰写时，OpenZeppelin的`ERC20.sol`合约所需版本为^0.8.30，因此编译器需要设置为0.8.30及以上的版本。

Solidity编译器插件也允许您更改一些设置并应用编译器的高级配置。如果您计划迭代智能合约，可以通过勾选**Auto compile**来实现，每当您进行更改时，合约都会自动重新编译。

此外，在**Advanced Configurations**菜单中，您可以更改EVM版本、启用优化功能，并设置预计在合约生命周期内运行字节码的次数（默认设置为200次）。有关合约优化的更多信息，请参考[Optimizer上的Solidity文档](https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options){target=\_blank}。

在本示例中，无需额外的配置。要编译`MyToken.sol`合约，只需点击**Compile MyToken.sol**合约。如果编译成功，您可以在**Solidity compiler**插件旁的插件面板中出现绿色的完成标记。

![The Solidity compiler plugin shown in the side panel in Remix.](/images/builders/ethereum/dev-env/remix/remix-5.webp)

### 调试编译错误 {: #debug-compilation-errors }

如果您尝试编译智能合约，但是出现错误或警告时，您可以直接从Remix中的Solidity编译器插件通过ChatGPT轻松调试问题。

举例来说，如果您仅提供了Token名称给ERC-20构造函数，但忘记提供Token符号，编译合约时侧面板将会出现错误提示。您可以往下滑动页面阅读错误提示，您会看到一个**ASK GPT**按钮。要调试编译错误，您可以点击**ASK GPT**按钮，Remix终端将返回响应，引导您操作并尝试解决问题。如果您需要其他帮助，可以直接前往来源并询问[ChatGPT](https://chat.openai.com/){target=\_blank}。

![An error message shown in the side panel for the Solidity compiler plugin with an ASK GPT button for debugging.](/images/builders/ethereum/dev-env/remix/remix-6.webp)

当您成功解决错误并重新编译合约，您将在**Solidity compiler**插件旁的插件面板中出现绿色的完成标记。

![The green check mark next to the Solidity compiler plugin in the plugin panel.](/images/builders/ethereum/dev-env/remix/remix-7.webp)

## 部署Solidity智能合约 {: #deploy-a-solidity-smart-contract }

您可以通过**Deploy and run transactions**插件配置合约部署选项、部署合约，并与已部署的合约交互。

侧面板由以下部署选项组成：

- Environment - 为部署选择执行环境
- Account - 发送部署交易的账户
- Gas Limit - 部署交易消耗的最大gas费用
- Value - 与部署交易共同发送的原生资产数量
- Contract - 要部署的合约
- Deploy - 使用选定的账户、gas限制、值以及任何构造函数参数的值将部署交易发送到指定环境
- At Address - 通过指定地址与现有合约交互

以下部分将介绍如何将部署环境配置为Moonbeam。

### 连接Remix至Moonbeam {: #connect-remix-to-moonbeam }

要部署智能合约至Moonbeam，您需要确保您已将钱包连接至Moonbeam开发节点或Moonbeam网络。然后，点击**Deploy and run transactions**标签，通过**ENVIRONMENT**下拉菜单的选择将Remix连接至您的钱包。例如，如果您已安装Trust Wallet，您可以在下拉菜单中看到**Injected Provider - TrustWallet**。除了injected providers，您也可以通过WalletConnect连接至Moonbeam。

我们将以MetaMask为例。提前将MetaMask安装完毕并连接至本地Moonbeam开发节点。详细步骤请参考 [使用Moonbeam与MetaMask交互](/tokens/connect/metamask/){target=\_blank}分步教程。

在**ENVIRONMENT**下拉菜单处选择**Injected Provider - MetaMask**。

![The environment dropdown on the Deploy and run transactions side panel expanded to reveal all of the available options.](/images/builders/ethereum/dev-env/remix/remix-8.webp)

随后，MetaMask将跳出弹窗并提示您将其连接至Remix。

1. 选择要连接至Remix的账户
2. 点击**Next**
3. 点击**Connect**将账户连接至Remix

![Two MetaMask screens that you must go through to connect to Remix: one that prompts you to choose an account to connect to and another that grants Remix permissions.](/images/builders/ethereum/dev-env/remix/remix-9.webp)

当您将MetaMask连接至Remix后，侧面板将更新显示您所连接的网络和账户。以Moonbeam开发节点为例，您将看到**Custom (1281) network**。

![The Deploy and run transactions side panel in Remix showing the environment connected to MetaMask, the connected network as 1281, and the connected account address.](/images/builders/ethereum/dev-env/remix/remix-10.webp)

### 部署合约至Moonbeam {: #deploy-the-contract-to-moonbeam }

现在，您已完成钱包连接，可以开始部署合约。由于您正在部署一个简单的ERC-20 Token智能合约，因此Remix设置的默认Gas限制为300万就足够了，您无需指定随部署一同发送的值。为此，您可以执行以下步骤部署合约：

1. 确保**ENVIRONMENT**已设置为**Injected Provider - MetaMask**
2. 确保连接的账户是您想要部署的账户
3. 使用默认的**GAS LIMIT**：`3000000`
4. 无需调整设定的**VALUE**：`0`
5. 确保所选合约为`MyToken.sol`
6. 展开**DEPLOY**下拉菜单
7. 指定初始供应量。在本示例中，您可以设置为800万。由于此合约使用默认的18位小数位数，因此需要在文本框中输入`8000000000000000000000000`
8. 点击**transact**发送部署交易
9. MetaMask将跳出弹窗，要求您点击**Confirm**确认部署合约

![The Deploy and run transactions side panel completely filled out to perform a contract deployment.](/images/builders/ethereum/dev-env/remix/remix-11.webp)

交易部署后，您将在Remix终端看到部署交易的详情。此外，合约将出现在侧面板的**Deployed Contracts**部分下方。

## 与已部署的智能合约交互 {: #interact-with-deployed-smart-contracts }

当您部署了智能合约或通过**At Address**按钮访问了现有合约，该合约将显示在侧面板的**Deployed Contracts**部分下方。 您可以展开合约查看已交互合约的所有功能。

要与特定函数交互，您可以点击函数名称，其中包含橙色、红色或蓝色按钮。橙色按钮用于写入区块链且无需付费的函数；红色按钮用于写入区块链且需支付费用的函数；蓝色按钮用于从区块链读取数据的函数。

根据您正在交互的函数，您可能需要输入参数值。如果函数需要输入值，您可以通过展开函数并输入每个参数的值来完成。

如果您正在交互的函数是需支付费用的函数，您要在侧面板顶部的**VALUE**字段中输入金额，该值字段与用于具有支付构造函数的合约的值字段相同。

### 调用智能合约函数 {: #call-the-smart-contract-functions }

如果您展开**MYTOKEN**合约下拉菜单，您将看到可交互的函数列表。要与给定函数交互，您可以根据需要提供任何输入，然后点击包含要交互的函数名称的按钮。

例如，如果您想要调用`tokenSupply`函数，您无需签署交易，即可获得及时响应。

![A view of the functions available in the deployed ERC-20 contract and the response from calling the tokenSupply function.](/images/builders/ethereum/dev-env/remix/remix-12.webp)

另一方面，如果您调用`approve`函数，该函数将批准一个账户作为给定数量的MYTOK Token的支出者，您需要在MetaMask中提交批准。您可以执行以下步骤进行测试：

1. 将**spender**设置为要代表您支付Token的账户。在本示例中，您可以将其设置为Bob账户（已预注资的开发账户之一）: `0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0`
2. 输入spender需要花费的金额。在本示例中，您将批准Bob花费10 MYTOK，因此需输入`10000000000000000000`
3. 点击**transact**
4. MetaMask将跳出弹窗，您需要查看交易详情并提交批准

![The inputs for the approve function of the ERC-20 contract and the MetaMask pop-up for the approval.](/images/builders/ethereum/dev-env/remix/remix-13.webp)

要查看您的账户余额/批准交易/转账MYTOKs，您可以将MYTOK添加到您的账户。关于如何将Token添加至MetaMask的更多信息，请参考[MetaMask文档网站](/tokens/connect/metamask){target=\_blank}的[添加ERC-20 Token](/tokens/connect/metamask#add-erc20){target=\_blank}部分。

--8<-- 'text/_disclaimers/third-party-content.md'
