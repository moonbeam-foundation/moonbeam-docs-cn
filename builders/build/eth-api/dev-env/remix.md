---
title: Deploy Smart Contracts with Remix - 使用Remix部署智能合约
description: Discover how to deploy and interact with Solidity smart contracts on Moonbeam using the Remix IDE, one of the most widely used Ethereum development tools.
学习如何将最受欢迎的以太坊开发工具之一Remix IDE在Moonbeam上部署Solidity智能合约，并与其交互。
---

# Using Remix to Deploy to Moonbeam - 使用Remix部署合约至Moonbeam

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/NBOLCGT5-ww' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## Introduction - 概览 {: #introduction }

[Remix](https://remix.ethereum.org/){target=_blank} is an integrated development environment (IDE) for developing smart contracts on Ethereum and Ethereum-compatible chains. It provides an easy-to-use interface for writing, compiling, and deploying smart contracts. Given Moonbeam’s Ethereum compatibility features, you can use Remix directly with any Moonbeam network.

[Remix](https://remix.ethereum.org/){target=_blank}是一个集成开发环境（IDE），用于在以太坊和以太坊兼容链上开发智能合约。它提供了一个易于使用的界面，供开发者编写、编译和部署智能合约。得益于Moonbeam的以太坊兼容性功能，您可以直接在任何Moonbeam网络中使用 Remix。

This guide walks through the process of creating and deploying a Solidity smart contract to a [Moonbeam development node](/builders/get-started/networks/moonbeam-dev/){target=_blank} using the Remix IDE. This guide can be adapted for [Moonbeam](/builders/get-started/networks/moonbeam/){target=_blank}, [Moonriver](/builders/get-started/networks/moonriver/){target=_blank}, or [Moonbase Alpha](/builders/get-started/networks/moonbase/){target=_blank}.

本教程将介绍使用Remix IDE在[Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev/){target=_blank}上创建和部署基于Solidity智能合约的过程。此教程同时适用于[Moonbeam](/builders/get-started/networks/moonbeam/){target=_blank}、[Moonriver](/builders/get-started/networks/moonriver/){target=_blank}和[Moonbase Alpha](/builders/get-started/networks/moonbase/){target=_blank}网络。

If you're familiar with Remix, you can skip ahead to the [Connect Remix to Moonbeam](#connect){target=_blank} section to learn how to use Remix with Moonbeam.

如果您已熟悉Remix，你可以直接跳到[连接Remix至Moonbeam](#connect){target=_blank}部分，学习如何将Remix与Moonbeam结合使用。

## Checking Prerequisites - 查看先决条件 {: #checking-prerequisites }

For the purposes of this guide, you'll need to have the following:

在开始之前，您将需要准备以下内容：

- A locally running [Moonbeam development node](/builders/get-started/networks/moonbeam-dev/){target=_blank}
- 本地运行的[Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev/){target=_blank}
- [MetaMask installed and connected](/tokens/connect/metamask/){target=_blank} to your development node
- [安装且配置完毕的MetaMask](/tokens/connect/metamask/){target=_blank}以使用您的开发节点

If you followed the guides above, you should have a local Moonbeam node, which will begin to author blocks as transactions arrive.

如果您已遵循上述教程，您将会拥有一个正在收集交易以生产区块的本地Moonbeam节点。

![The terminal logs of for a local Moonbeam development node that is producing blocks.](/images/builders/build/eth-api/dev-env/remix/new/remix-1.png)

Your development node comes with 10 pre-funded accounts. You should have MetaMask connected to your Moonbeam development node and have imported at least one of the pre-funded accounts. You can refer to the [Import Accounts](/tokens/connect/metamask#import-accounts){target=_blank} section of the MetaMask docs for step-by-step instructions on how to import a development account.

您的开发节点具有10个拥有资金的账户，确保将MetaMask连接至您的Moonbeam开发节点并导入至少一个预注资的账户。您可以参考MetaMask文档的[导入账户](/tokens/connect/metamask#import-accounts){target=_blank}部分的分步教程，了解如何导入开发账户。

![The main screen of MetaMask, which shows an account connected to a Moonbeam development node and its balance.](/images/builders/build/eth-api/dev-env/remix/new/remix-2.png)

If you're adapting this guide for Moonbeam, Moonriver, or Moonbase Alpha, make sure you are connected to the correct network and have an account with funds. 如果您正在Moonbeam、Moonriver或是Moonbase Alpha网络上跟随此教程进行操作，请确保您连接的是正确的网络并拥有具有一定资金的账户。
--8<-- 'text/_common/faucet/faucet-sentence.md'

## Get Familiar with Remix - 初步了解Remix {: #get-familiar-with-remix }

If you navigate to [https://remix.ethereum.org/](https://remix.ethereum.org/){target=_blank}, you'll see that the layout of Remix is split into four sections:

前往[https://remix.ethereum.org/](https://remix.ethereum.org/){target=_blank}，可以看到页面分为四个部分：

1. The plugin panel

   插件面板

2. The side panel

   侧面板

3. The main panel

   主面板

4. The terminal

   终端面板

![The layout of Remix IDE and its four sections.](/images/builders/build/eth-api/dev-env/remix/new/remix-3.png)

The plugin panel displays icons for each of the preloaded plugins, the plugin manager, and the settings menu. You'll see a few icons there for each of the preloaded plugins, which are the **File explorer**, **Search in files**, **Solidity compiler**, and **Deploy and run transactions** plugins. As additional plugins are activated, their icons will appear in this panel.

插件面板显示每个预加载插件的图标、插件管理器和设置菜单。您将看到每个预加载插件的一些图标，分别是**文件管理器**、**搜索**、**Solidity编译器**以及**部署和运行交易**插件。其他插件被激活时，其图标将出现在该操作面板中。

The side panel displays the content of the plugin that is currently being viewed. By default, you'll see the File explorer plugin, which displays the default workspace and some preloaded files and folders. However, if you select one of the other icons from the plugin panel, you'll see the content for the selected plugin.

侧面板显示当前查看的插件详情。默认情况下，进入首页您会在此处看到文件管理器的详情，即默认工作区和一些预加载的文件和文件夹。如果您选择左侧插件栏的其他图标，此处将替换为所选插件的详情。

The main panel is automatically loaded with the **Home** tab, which contains links to a variety of resources. You can close this tab at any time and reopen it by clicking on the blue Remix icon in the top left corner of the plugin panel. The main panel is where you'll be able to see each of the files you're working with. For example, you can double-click on any file in the **File explorer** side panel and it will appear as a tab in the main panel.

主面板会随着**主页**标签自动加载，其中包含各种渠道的链接。您可以随时关闭此选项卡，然后通过单击插件面板左上角的蓝色Remix图标重新打开它。您可以在主面板中查看正在使用的每个文件。举例来说，您可以双击**文件管理器**侧面板中的任何文件，它将在主面板中打开标签页。

The terminal panel is similar to a standard terminal that you have on your OS; you can execute scripts from it, and logs are printed to it. All transactions and contract interactions are automatically logged to the terminal. You can also interact with the [Ethers](https://docs.ethers.org/v6/){target=_blank} and [Web3](https://web3js.org/#/){target=_blank} JavaScript libraries directly from the terminal.

终端面板类似于操作系统上的标准终端；您可以从中执行脚本，并将日志打印到其中。所有交易和合约交互都会自动记录到终端。您还可以直接从终端与[Ethers](https://docs.ethers.org/v6/){target=_blank}和[Web3](https://web3js.org/#/){target=_blank}的JavaScript库交互。

## Add a Smart Contract to the File Explorer - 添加智能合约至文件管理器 {: #add-a-smart-contract-to-the-file-explorer }

For this example, you will create a new file that contains an ERC-20 token contract. This will be a simple ERC-20 contract based on the current [OpenZeppelin ERC-20 template](https://docs.openzeppelin.com/contracts/4.x/erc20){target=_blank}. The contract will create a `MyToken` token with the `MYTOK` symbol that mints the entirety of the initial supply to the creator of the contract.

在本示例中，您将创建一个包含ERC-20 Token合约的新文件。这是一个简单的ERC-20合约，基于现有的[OpenZeppelin ERC-20模板](https://docs.openzeppelin.com/contracts/4.x/erc20){target=_blank}创建。该合约将创建一个`MyToken` Token（带有`MYTOK`符号），该Token将向合约创建者铸造全部初始供应量。

From the **File explorer** tab on the plugin panel, you can create a new file by taking the following steps:

在插件面板的**File explorer**标签处，您可以通过执行以下步骤创建新文件：

1. Click on the file icon

   点击文件图标

2. Enter the name of the contract: `MyToken.sol`

   输入合约名称：`MyToken.sol`

![Create a new file using the File explorer plugin in Remix.](/images/builders/build/eth-api/dev-env/remix/new/remix-4.png)

The main panel will switch to an empty file where you can add the Solidity code for the contract. Paste the `MyToken.sol` smart contract into the new file:

主面板将切换至一个空白文件，您可以在此处为合约添加Solidity代码。将`MyToken.sol`智能合约粘贴至新的文件中：

```solidity
--8<-- 'code/builders/build/eth-api/dev-env/remix/MyToken.sol'
```

![Add the contract code to the newly created file in the main panel of Remix.](/images/builders/build/eth-api/dev-env/remix/new/remix-5.png)

## Compile a Solidity Smart Contract - 编译Solidity智能合约 {: #compile-a-solidity-smart-contract }

Before you compile a contract, make sure you've selected the file of the contract from the **File explorer** tab. Then, select the **Solidity Compiler** option from the plugin panel.

在编译合约前，确保您已从**File explorer**标签处选中合约的文件。然后从插件面板处选择**Solidity Compiler**。

Make sure that the compiler version in the top-left corner meets the version defined in your contract and the version defined in [OpenZeppelin's `ERC20.sol` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol){target=_blank}. For example, the `MyToken.sol` contract requires Solidity ^0.8.0, but at the time of writing, OpenZeppelin's `ERC20.sol` contract requires ^0.8.20, so the compiler needs to be set to version 0.8.20 or newer.

确保左上角的编译器版本符合您的合约中定义的版本以及[OpenZeppelin的`ERC20.sol`合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol){target=_blank}中定义的版本。例如，`MyToken.sol`合约所需版本为Solidity ^0.8.0，但截至本文撰写时，OpenZeppelin的`ERC20.sol`合约所需版本为^0.8.20，因此编译器需要设置为0.8.20及以上的版本。

The Solidity compiler plugin also lets you change some settings and apply advanced configurations for the compiler. If you're planning on iterating over the smart contract, you can check the **Auto compile** box, and whenever you make a change, the contract will automatically be recompiled.

Solidity编译器插件也允许您更改一些设置并应用编译器的高级配置。如果您计划迭代智能合约，可以通过勾选**Auto compile**来实现，每当您进行更改时，合约都会自动重新编译。

Additionally, from the **Advanced Configurations** menu, you can change the EVM version, enable optimizations, and set the number of times the bytecode is expected to be run throughout the contract's lifetime; the default is set to 200 times. For more information on contract optimization, please refer to the [Solidity docs on The Optimizer](https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options){target=_blank}.

此外，在**Advanced Configurations**菜单中，您可以更改EVM版本、启用优化功能，并设置预计在合约生命周期内运行字节码的次数（默认设置为200次）。有关合约优化的更多信息，请参考[Optimizer上的Solidity文档](https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options){target=_blank}。

For this example, no additional configurations are needed. To compile the `MyToken.sol` contract, simply click on the **Compile MyToken.sol** contract. If the compilation was successful, you'll see a green check mark appear on the plugin panel next to the **Solidity compiler** plugin.

在本示例中，无需额外的配置。要编译`MyToken.sol`合约，只需点击**Compile MyToken.sol**合约。如果编译成功，您可以在**Solidity compiler**插件旁的插件面板中出现绿色的完成标记。

![The Solidity compiler plugin shown in the side panel in Remix.](/images/builders/build/eth-api/dev-env/remix/new/remix-6.png)

### Debug Compilation Errors - 调试编译错误 {: #debug-compilation-errors }

If you tried to compile your smart contract but there was an error or warning, you can easily debug the issue with the help of ChatGPT directly from the Solidity compiler plugin in Remix.

如果您尝试编译智能合约，但是出现错误或警告时，您可以直接从Remix中的Solidity编译器插件通过ChatGPT轻松调试问题。

For example, if you only provided the token name to the ERC-20 constructor but forgot the token symbol and tried to compile the contract, an error would appear in the side panel. You can scroll down to read the error, and you'll see that there is also an **ASK GPT** button. To get help debugging the issue, you can click on **ASK GPT**, and a response will be returned in the Remix terminal that will guide you in the right direction to try and fix the issue. If you need additional help, you can go straight to the source and ask [ChatGPT](https://chat.openai.com/){target=_blank} directly.

举例来说，如果您仅提供了Token名称给ERC-20构造函数，但忘记提供Token符号，编译合约时侧面板将会出现错误提示。您可以往下滑动页面阅读错误提示，您会看到一个**ASK GPT**按钮。要调试编译错误，您可以点击**ASK GPT**按钮，Remix终端将返回响应，引导您操作并尝试解决问题。如果您需要其他帮助，可以直接前往来源并询问[ChatGPT](https://chat.openai.com/){target=_blank}。

![An error message shown in the side panel for the Solidity compiler plugin with an ASK GPT button for debugging.](/images/builders/build/eth-api/dev-env/remix/new/remix-7.png)

Once you successfully fix the issue and recompile the contract, you'll see a green check mark appear on the plugin panel next to the **Solidity compiler** plugin.

当您成功解决错误并重新编译合约，您将在**Solidity compiler**插件旁的插件面板中出现绿色的完成标记。

![The green check mark next to the Solidity compiler plugin in the plugin panel.](/images/builders/build/eth-api/dev-env/remix/new/remix-8.png)

## Deploy a Solidity Smart Contract - 部署Solidity智能合约 {: #deploy-a-solidity-smart-contract }

The **Deploy and run transactions** plugin enables you to configure contract deployment options, deploy contracts, and interact with deployed contracts.

您可以通过**Deploy and run transactions**插件配置合约部署选项、部署合约，并与已部署的合约交互。

The side panel consists of the following deployment options:

侧面板由以下部署选项组成：

- Environment - allows you to choose the execution environment for deployment
- Environment - 为部署选择执行环境
- Account - the account from which the deployment transaction will be sent
- Account - 发送部署交易的账户
- Gas Limit - the maximum amount of gas that the deployment transaction can consume
- Gas Limit - 部署交易消耗的最大gas费用
- Value - the amount of the native asset to send along with the deployment transaction
- Value - 与部署交易共同发送的原生资产数量
- Contract - the contract to deploy
- Contract - 要部署的合约
- Deploy - sends the deployment transaction to the specified environment using the selected account, gas limit, value, and the values for any constructor arguments
- Deploy - 使用选定的账户、gas限制、值以及任何构造函数参数的值将部署交易发送到指定环境
- At Address - allows you to interact with an existing contract by specifying its address
- At Address - 通过指定地址与现有合约交互

The following section will cover how to configure the environment for deployment to be Moonbeam.

以下部分将介绍如何将部署环境配置为Moonbeam。

### Connect Remix to Moonbeam - 连接Remix至Moonbeam {: #connect-remix-to-moonbeam }

To deploy the smart contract to Moonbeam, you'll need to make sure that you've connected your wallet to your Moonbeam development node or the Moonbeam network of your choice. Then, from the **Deploy and run transactions** tab, you can connect Remix to your wallet by selecting your wallet from the **ENVIRONMENT** dropdown. For example, if you have Trust Wallet installed, you'll see **Injected Provider - TrustWallet** from the dropdown. Aside from injected providers, you can also connect to Moonbeam via WalletConnect.

要部署智能合约至Moonbeam，您需要确保您已将钱包连接至Moonbeam开发节点或Moonbeam网络。然后，点击**Deploy and run transactions**标签，通过**ENVIRONMENT**下拉菜单的选择将Remix连接至您的钱包。例如，如果您已安装Trust Wallet，您可以在下拉菜单中看到**Injected Provider - TrustWallet**。除了injected providers，您也可以通过WalletConnect连接至Moonbeam。

For this example, MetaMask will be used. You should already have MetaMask installed and connected to your local Moonbeam development node. If not, please refer to the [Interacting with Moonbeam Using MetaMask](/tokens/connect/metamask/){target=_blank} guide for step-by-step instructions.

我们将以MetaMask为例。提前将MetaMask安装完毕并连接至本地Moonbeam开发节点。详细步骤请参考 [使用Moonbeam与MetaMask交互](/tokens/connect/metamask/){target=_blank}分步教程。

From the **ENVIRONMENT** dropdown, select **Injected Provider - MetaMask**.

在**ENVIRONMENT**下拉菜单处选择**Injected Provider - MetaMask**。

![The environment dropdown on the Deploy and run transactions side panel expanded to reveal all of the available options.](/images/builders/build/eth-api/dev-env/remix/new/remix-9.png)

MetaMask will pop up automatically and prompt you to connect to Remix. You'll need to:

随后，MetaMask将跳出弹窗并提示您将其连接至Remix。

1. Select the account you want to connect to Remix

   选择要连接至Remix的账户

2. Click **Next**

   点击**Next**

3. Click **Connect** to connect your account to Remix

   点击**Connect**将账户连接至Remix

![Two MetaMask screens that you must go through to connect to Remix: one that prompts you to choose an account to connect to and another that grants Remix permissions.](/images/builders/build/eth-api/dev-env/remix/new/remix-10.png)

Once you've connected MetaMask to Remix, the side panel will update to reveal the network and account you're connected to. For a Moonbeam development node, you should see **Custom (1281) network**.

当您将MetaMask连接至Remix后，侧面板将更新显示您所连接的网络和账户。以Moonbeam开发节点为例，您将看到**Custom (1281) network**。

![The Deploy and run transactions side panel in Remix showing the environment connected to MetaMask, the connected network as 1281, and the connected account address.](/images/builders/build/eth-api/dev-env/remix/new/remix-11.png)

### Deploy the Contract to Moonbeam - 部署合约至Moonbeam {: #deploy-the-contract-to-moonbeam }

Now that you've connected your wallet, you're ready to deploy the contract. Since you're deploying a simple ERC-20 token smart contract, the default gas limit set by Remix of 3 million is more than enough, and you don't need to specify a value to send along with the deployment. As such, you can take the following steps to deploy the contract:

现在，您已完成钱包连接，可以开始部署合约。由于您正在部署一个简单的ERC-20 Token智能合约，因此Remix设置的默认Gas限制为300万就足够了，您无需指定随部署一同发送的值。为此，您可以执行以下步骤部署合约：

1. Make sure the **ENVIRONMENT** is set to **Injected Provider - MetaMask**

   确保**ENVIRONMENT**已设置为**Injected Provider - MetaMask**

2. Make sure the connected account is the one you want to deploy the transaction from

   确保连接的账户是您想要部署的账户

3. Use the default **GAS LIMIT** of `3000000`

   使用默认的**GAS LIMIT**：`3000000`

4. Leave the **VALUE** as `0`

   无需调整设定的**VALUE**：`0`

5. Make sure `MyToken.sol` is the selected contract

   确保所选账户为`MyToken.sol`

6. Expand the **DEPLOY** dropdown

   展开**DEPLOY**下拉菜单

7. Specify the initial supply. For this example, you can set it to 8 million tokens. Since this contract uses the default of 18 decimals, the value to put in the box is `8000000000000000000000000`

   指定初始供应量。在本示例中，您可以设置为800万。由于此合约使用默认的18位小数位数，因此需要在文本框中输入`8000000000000000000000000`

8. Click **transact** to send the deployment transaction

   点击**transact**发送部署交易

9. MetaMask will pop up, and you can click **Confirm** to deploy the contract

   MetaMask将跳出弹窗，要求您点击**Confirm**确认部署合约

![The Deploy and run transactions side panel completely filled out to perform a contract deployment.](/images/builders/build/eth-api/dev-env/remix/new/remix-12.png)

Once the transaction has been deployed, you'll see details about the deployment transaction in the Remix terminal. Additionally, the contract will appear under the **Deployed Contracts** section of the side panel.

交易部署后，您将在Remix终端看到部署交易的详情。此外，合约将出现在侧面板的**Deployed Contracts**部分下方。

## Interact with Deployed Smart Contracts - 与已部署的智能合约交互 {: #interact-with-deployed-smart-contracts }

Once you've deployed a smart contract or accessed an existing contract via the **At Address** button, the contract will appear under the **Deployed Contracts** section of the side panel. You can expand the contract to view all of the contract's functions you can interact with.

当您部署了智能合约或通过**At Address**按钮访问了现有合约，该合约将显示在侧面板的**Deployed Contracts**部分下方。 您可以展开合约查看已交互合约的所有功能。

To interact with a given function, you can click on the function name, which will be contained in an orange, red, or blue button. Orange buttons are for functions that write to the blockchain and are non-payable; red buttons are for functions that write to the blockchain and are payable; and blue buttons are for functions that read data from the blockchain.

要与特定函数交互，您可以点击函数名称，其中包含橙色、红色或蓝色按钮。橙色按钮用于写入区块链且无需付费的函数；红色按钮用于写入区块链且需支付费用的函数；蓝色按钮用于从区块链读取数据的函数。

Depending on the function you're interacting with, you may need to input parameter values. If the function requires inputs, you'll be able to enter them by expanding the function and entering a value for each of the parameters.

根据您正在交互的函数，您可能需要输入参数值。如果函数需要输入值，您可以通过展开函数并输入每个参数的值来完成。

If the function you're interacting with is payable, you'll be able to enter an amount in the **VALUE** field towards the top of the side panel, in the same value field used for contracts that have payable constructors.

如果您正在交互的函数是需支付费用的函数，您要在侧面板顶部的**VALUE**字段中输入金额，该值字段与用于具有支付构造函数的合约的值字段相同。

### Call the Smart Contract Functions - 调用智能合约函数 {: #call-the-smart-contract-functions }

If you expand the **MYTOKEN** contract dropdown, you'll be able to see all of the available functions you can interact with. To interact with a given function, you can provide any inputs, if needed, and then click on the button containing the function name you want to interact with.

如果您展开**MYTOKEN**合约下拉菜单，您将看到可交互的函数列表。要与给定函数交互，您可以根据需要提供任何输入，然后点击包含要交互的函数名称的按钮。

For example, if you wanted to call the `tokenSupply` function, you wouldn't need to sign a transaction, as you'd get a response right away.

例如，如果您想要调用`tokenSupply`函数，您无需签署交易，即可获得及时响应。

![A view of the functions available in the deployed ERC-20 contract and the response from calling the tokenSupply function.](/images/builders/build/eth-api/dev-env/remix/new/remix-13.png)

On the other hand, if you call the `approve` function, which will approve an account as a spender of a given amount of MYTOK tokens, you'll need to submit the approval in MetaMask. To test this out, you can take the following steps:

另一方面，如果您调用`approve`函数，该函数将批准一个账户作为给定数量的MYTOK Token的支出者，您需要在MetaMask中提交批准。您可以执行以下步骤进行测试：

1. Set the **spender** to an account that you want to be able to spend tokens on your behalf. For this example, you can use Bob's account (one of the pre-funded development accounts): `0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0`

   将**spender**设置为要代表您支付Token的账户。在本示例中，您可以将其设置为Bob账户（已预注资的开发账户之一）

2. Enter the amount the spender can spend. For this example, you can approve Bob to spend 10 MYTOK by entering in `10000000000000000000`

   输入spender需要花费的金额。在本示例中，您将批准Bob花费10 MYTOK，因此需输入`10000000000000000000`

3. Press **transact**

   点击**transact**

4. MetaMask will pop up and you'll need to review the details of the approval and submit the approval

   MetaMask将跳出弹窗，您需要查看交易详情并提交批准

![The inputs for the approve function of the ERC-20 contract and the MetaMask pop-up for the approval.](/images/builders/build/eth-api/dev-env/remix/new/remix-14.png)

To view your balance or approvals, or transfer MYTOKs, you can add the MYTOK to your wallet. For information on how to add a token to MetaMask, you can refer to the [Add an ERC-20 Token](/tokens/connect/metamask#add-erc20){target=_blank} section of [our MetaMask documentation](/tokens/connect/metamask){target=_blank}.

要查看您的账户余额/批准交易/转账MYTOKs，您可以将MYTOK添加到您的账户。关于如何将Token添加至MetaMask的更多信息，请参考[MetaMask文档网站](/tokens/connect/metamask){target=_blank}的[添加ERC-20 Token](/tokens/connect/metamask#add-erc20){target=_blank}部分。

## Moonbeam Remix Plugin - Moonbeam Remix插件 {: #moonbeam-remix-plugin }

The Moonbeam team has built a Remix plugin that makes it even easier to develop and deploy your Ethereum smart contracts on Moonbeam. The Moonbeam Remix plugin combines all of the important functions needed to compile, deploy, and interact with your smart contracts from one place - no switching tabs needed. The Moonbeam Remix plugin supports Moonbeam, Moonriver, and the Moonbase Alpha TestNet.

Moonbeam团队开发了Remix插件以简化部署以太坊智能合约至Moonbeam网络的流程。Moonbeam Remix插件综合了所有在编译、部署和交互时所需的功能，能够在无需切换页面的情况下（即在同一个页面内）完成智能合约的部署和开发。Moonbeam Remix插件支持Moonbeam、Moonriver以及Moonbase Alpha测试网。

### Installing the Moonbeam Remix Plugin - 安装Moonbeam Remix插件 {: #installing-the-moonbeam-remix-plugin }

To install the Moonbeam Remix plugin, take the following steps:

请遵循以下步骤安装Moonbeam Remix插件：

 1. Head to the **Plugin manager** tab

    前往**Plugin manager**

 2. Search for **Moonbeam**

    搜索**Moonbeam**

 3. Press **Activate** and the Moonbeam Remix plugin will be added directly above the plugin manager tab

    点击**Activate**，Moonbeam Remix插件将会直接安装至您的插件管理标签当中

![Activating the Moonbeam Remix Plugin](/images/builders/build/eth-api/dev-env/remix/using-remix-17.png)

Once you've added the plugin, a Moonbeam logo will appear on the left hand side, representing the Moonbeam Remix plugin tab.

当您已成功安装插件，代表Moonbeam Remix插件的Moonbeam标志将会出现在左手边。

### Getting Started with the Moonbeam Remix Plugin - 开始使用Moonbeam Remix Plugin {: #getting-started-with-the-moonbeam-remix-plugin }

Click on the Moonbeam logo in your Remix IDE to open the Moonbeam plugin. This part assumes you already have a contract in Remix ready to be compiled. You can generate an [ERC-20 contract here](https://wizard.openzeppelin.com/){target=_blank}. To deploy an ERC-20 Token to Moonbase Alpha using the Moonbeam Remix plugin, you can take the following steps:

在Remix IDE中点击Moonbeam Logo开启Moonbeam插件。请注意，此教程预设您在Remix内已有待编译的合约。您可以在[此网页](https://wizard.openzeppelin.com/){target=_blank}创建ERC-20合约，遵循以下步骤使用Moonbeam Remix插件在Moonbase Alpha部署一个ERC-20 Token。

 1. Press **Connect** to connect MetaMask to Remix

    点击**Connect**，将您的Metamask钱包连接至Remix

 2. Ensure you're on the correct network. For this example, you should be on Moonbase Alpha

    确认您选取正确的网络。在本示例中，我们使用的是Moonbase Alpha网络

 3. Press **Compile** or choose **Auto-Compile** if you prefer

    点击**Compile**或根据需求点击**Auto-Compile**

 4. Press **Deploy** and **Confirm** the transaction in MetaMask

    点击**Deploy**和**Confirm**在Metamask上确认交易

![Compiling and Deploying a Contract with the Moonbeam Remix Plug](/images/builders/build/eth-api/dev-env/remix/using-remix-18.png)

It's that easy! Once the contract is deployed, you'll see the address and all available read/write methods to interact with it.

就是这么简单！当合约成功部署后，您将能看到地址以及所有能够与之交互的访问和修改方法。

The Moonbeam Remix plugin works seamlessly with Remix so you can freely switch between using the traditional Remix compile and deploy tabs and the Moonbeam Remix plugin.

Moonbeam Remix插件能够在Remix中无缝使用，所以您可以随时切换使用传统的Remix编译功能进行部署，或是选择使用Moonbeam Remix插件。

--8<-- 'text/_disclaimers/third-party-content.md'
