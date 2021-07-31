---
title: Remix使用教程
description: 学习如何将最受欢迎的以太坊开发工具之一Remix IDE交互Moonbeam本地节点。
---

# 如何使用Remix交互Moonbeam

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/RT_f1-ga_n4' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>You can find all of the relevant code for this tutorial on the <a href="{{ config.site_url }}resources/code-snippets/">code snippets page</a></div>

## 概览 {: #introduction }

Remix是目前以太坊上最常被使用的智能合约开发环境之一。基于Moonbeam兼容以太坊的特性，Remix可与Moonbeam开发节点或Moonbase Alpha测试网一起直接使用。

本教程介绍了如何使用[Remix IDE](https://remix.ethereum.org/)将基于Solidity的智能合约搭建和部署到独立的Moonbeam节点。

!!! 注意事项
    本教程用[Moonbase Alpha](https://github.com/PureStake/moonbeam/releases/tag/v0.3.0)的tutorial-v7标签建立。为实现与以太坊的全面兼容，SMoonbeam平台和[Frontier](https://github.com/paritytech/frontier)组件均基于Substrate，两者正处于积极开发阶段。本教程示例为Ubuntu 18.04的环境，用户需根据其所使用的MacOS和Windows版本进行微调

本教程假设您有一个在`--dev`模式下运行的本地Moonbeam节点，并且安装且配置了[MetaMask](https://metamask.io/)。如果未完成以上配置，您可以在[这里](/getting-started/local-node/setting-up-a-node/)查看如何创建一个Moonbeam节点，在[这里](/getting-started/local-node/using-metamask/)查看如何连接MetaMask。

## 查看先决条件 {: #checking-prerequisites }

如果您已遵循上述教程，您将会拥有一个正在生产区块的本地Moonbeam节点，如下图所示：

![Local Moonbeam node producing blocks](/images/remix/using-remix-1.png)

另外，您也需要成功安装MetaMask，并且通过至少一个拥有余额的账户以开发者模式连接至您的本地Moonbeam节点。如下图所示：

![MetaMask installation with a balance](/images/remix/using-remix-2.png)

!!! 注意事项
    请确保您所连接到的是Moonbeam节点而非其他网络！

## 如何开始使用Remix {: #getting-started-with-remix }

现在，我们可以开始启动Remix来使用更多Moonbeam的进阶功能。

首先我们开启一个新标签页，输入[https://remix.ethereum.org/](https://remix.ethereum.org/) 打开Remix。在主画面中，点击Environments，选取Solidity配置Remix来进行Solidity的开发，最后打开File Explorers的画面，如下图所示：

![File explorer](/images/remix/using-remix-3.png)

我们需要创建一个新的文件夹来储存Solidity智能合约。点击File Explorers下面的 “+” 按钮，接着在弹窗内输入 “MyToken.sol“：

![Create a new file for your Solidity contract](/images/remix/using-remix-4.png)

然后，将以下智能合约黏贴至弹出的编辑视窗：

```solidity
--8<-- 'code/remix-local/contract.md'
```

这是一个基于当前OpenZepplin ERC-20模版编写的简易版ERC-20合约。该合约使用"MYTOK" 符号，并为合约创建者分配初始代币。

当您将合约粘贴至编辑器之后会形成下图：

![Paste the contract into the editor](/images/remix/using-remix-5.png)

接下来，在编辑器左侧选项，选择并点击“Compile MyToken.sol” 按钮：

![Compile MyToken.sol](/images/remix/using-remix-6.png)

点击之后，您会看到Remix已经下载所有Open Zeppelin的附属程式并完成了合约编写。

## 如何在Moonbeam上使用Remix部署合约 {: #deploying-a-contract-to-moonbeam-using-remix }

现在我们可以通过侧边的Deployment选项来部署合约。您需要将顶端的 “Environment” 从“JavaScript VM”向下拉至“Injected Web3”。如此一来，Remix会使用MetaMask导入的账户并指向一个已导入的Moonbeam独立节点。如果您想要使用Moonbase Alpha TestNet尝试此操作，请确保将MetaMask连接到TestNet而非本地开发节点。

当您选择“Injected Web3”选项时，您需授权Remix连接您的MetaMask账户。

![Replace](/images/remix/using-remix-7.png)

请在MetaMask点击“下一步”授权Remix使用您所选取的账户。

接着返回Remix界面，您会看到您想要用来部署的账户已经通过MetaMask授权登入。另外，您可以在Deploy按键的旁边输入代币数额，我们假设现在想要部署800万的代币。但由于此合约默认位数为小数点后18位，因此您需要在栏内输入`8000000000000000000000000` ，请参考下图。

确认数值输入无误之后，请点击“Deploy”。

![Enter an account balance and deploy](/images/remix/using-remix-8.png)

随后，将弹出MetaMask对话框，以确认此次部署合约的交易。

![Confirm the transaction message](/images/remix/using-remix-9.png)

!!! 注意事项
    若您在部署任意合约时遇到问题，可通过以下操作手动提高Gas限制。设置 -> 高级 -> 高级Gas控制 = 启用。

完成确认后，部署也随之完成，您将会在MetaMask上看到您的交易记录。与此同时，合约也会出现在Remix的Deployed Contracts一栏内。

![Confirmed label on a transaction](/images/remix/using-remix-10.png)

成功部署合约之后，您便可通过Remix与智能合约进行交互。

将左侧页面往下滑，找到“Deployed Contracts”，点击name，symbol，以及totalSupply，将会分别出现“MyToken”，“MYTOK”，以及“8000000000000000000000000“。如果您复制合约地址并将它粘贴在balanceOf的空格中，您可以看到用户ERC20地址上的账户全部余额，请参考下图。

![Interact with the contract from Remix](/images/remix/using-remix-11.png)

## 如何通过MetaMask与基于Moonbeam的ERC-20进行交互 {: #interacting-with-a-moonbeam-based-erc-20-from-metamask }

打开MetaMask添加刚部署的ERC-20代币。首先，请确认您已在Remix上复制了合约地址。然后，在MetaMask上点击“添加代币”，请参考下图。（请确保您现在所操作的账户为已部署合约的账户）。

![Add a token](/images/remix/using-remix-12.png)

将已复制的地址粘贴至“自定义代币”的代币合约地址空格内，与此同时”代币符号“和”小数精度“会自动填充。

![Paste the copied contract address](/images/remix/using-remix-13.png)

点击“下一步”，您需再次确认是否要将这些代币加入至您的MetaMask账户。点击“添加代币”后，您会看到800万的MyTokens已成功加入您的账户：

![Add the tokens to your MetaMask account](/images/remix/using-remix-14.png)

现在我们可以通过MetaMask将这些ERC-20代币转至其他设定好的账户。您只需点击“发送”就可以将500 个MyTokens转移至您所选取的目标账户。

点击“下一步”，您需再次确认交易（如下图所示）。

![Confirmation of the token transfer](/images/remix/using-remix-15.png)

点击“确认”，交易完成之后，您将会在MetaMask账户上看到交易记录以及账户余额：

![Verify the reduction in account balance](/images/remix/using-remix-16.png)

如果您拥有收款的账户，您也可以通过查看账户余额来确认转账是否成功。
