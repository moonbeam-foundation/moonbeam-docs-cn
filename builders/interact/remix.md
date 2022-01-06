---
title: 使用Remix
description: 学习如何将最受欢迎的以太坊开发工具之一Remix IDE与Moonbeam本地节点交互。
---

# 使用Remix部署至Moonbeam

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/NBOLCGT5-ww' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## 概览 {: #introduction } 

Remix是目前以太坊上最常被使用的智能合约开发环境之一。基于Moonbeam兼容以太坊的特性，Remix可直接与Moonbeam开发节点或Moonbase Alpha测试网一起使用。

本教程介绍了如何使用[Remix IDE](https://remix.ethereum.org/)将基于Solidity的智能合约搭建和部署到Moonbeam开发节点。

!!! 注意事项
    本教程用[Moonbase Alpha](https://github.com/PureStake/moonbeam/releases/tag/{{ networks.moonbase.parachain_release_tag }}) {{ networks.moonbase.parachain_release_tag }}版本的{{ networks.development.build_tag}}标签建立。为实现与以太坊的全面兼容，基于Substrate的Moonbeam平台和[Frontier](https://github.com/paritytech/frontier)组件正处于积极开发阶段。

## 查看先决条件 {: #checking-prerequisites }

本教程假设您有一个在`--dev`模式下运行的本地Moonbeam节点，并且安装和配置了[MetaMask](https://metamask.io/)。如果未完成以上配置，您可以在[这里](/builders/get-started/moonbeam-dev/)查看如何运行一个Moonbeam节点，在[这里](/tokens/connect/metamask/)查看如何连接MetaMask。

如果您已遵循上述教程，您将会拥有一个正在生产区块的本地Moonbeam节点，如下图所示：

![Local Moonbeam node producing blocks](/images/builders/interact/remix/using-remix-1.png)

另外，您也需要成功安装MetaMask，并且通过至少一个拥有余额的账户以开发者模式连接至您的本地Moonbeam开发节点。如下图所示：

![MetaMask installation with a balance](/images/builders/interact/remix/using-remix-2.png)

!!! 注意事项
    请确保您所连接到的是Moonbeam节点而非其他网络！

## 开始使用Remix {: #getting-started-with-remix }

现在，我们可以开始启动Remix来使用更多Moonbeam的高级功能。

首先开启一个新标签页，输入[https://remix.ethereum.org/](https://remix.ethereum.org/) 打开Remix。在主画面中，点击Environments，选取Solidity配置Remix来进行Solidity的开发，最后打开File Explorers的画面，如下图所示：

![File explorer](/images/builders/interact/remix/using-remix-3.png)

我们需要创建一个新的文件夹来储存Solidity智能合约。点击File Explorers下面的 “+” 按钮，接着在弹窗内输入 “MyToken.sol“：

![Create a new file for your Solidity contract](/images/builders/interact/remix/using-remix-4.png)

然后，将以下智能合约粘贴至弹窗的编辑框内：

```solidity
--8<-- 'code/remix-local/contract.md'
```

这是一个基于当前OpenZepplin ERC-20模版编写的简易版ERC-20合约。该合约使用"MYTOK" 作为MyToken的符号，并为合约创建者分配初始Token。

当您将合约粘贴至编辑器后，将如下图所示：

![Paste the contract into the editor](/images/builders/interact/remix/using-remix-5.png)

接下来，在编辑器侧边选项，选择并点击“Compile MyToken.sol” 按钮：

![Compile MyToken.sol](/images/builders/interact/remix/using-remix-6.png)

点击之后，您会看到Remix已经下载所有OpenZeppelin的依赖项并完成了合约编写。

## 使用Remix在Moonbeam上部署合约 {: #deploying-a-contract-to-moonbeam-using-remix }

现在我们可以通过侧边的Deployment选项来部署合约。您需要将顶端的 “Environment” 从“JavaScript VM”向下拉至“Injected Web3”。如此一来，Remix会使用MetaMask导入的账户并指向一个已导入的Moonbeam开发节点。如果您想要使用Moonbase Alpha测试网尝试此操作，请确保将MetaMask连接到测试网而非本地开发节点。

当您选择“Injected Web3”选项时，您需授权Remix连接您的MetaMask账户。

![Replace](/images/builders/interact/remix/using-remix-7.png)

请在MetaMask点击“下一步”授权Remix使用您所选取的账户。

接着返回Remix界面，您会看到您想要用来部署的账户已经通过MetaMask授权登入。在Deploy按键的旁边输入Token数额，假设我们现在要部署800万的Token。但由于此合约默认位数为小数点后18位，因此您需要在输入框内输入`8000000000000000000000000`。

确认数值输入无误之后，请点击“Deploy”。

![Enter an account balance and deploy](/images/builders/interact/remix/using-remix-8.png)

随后，MetaMask将跳出弹窗要求您确认此次部署合约的交易。

![Confirm the transaction message](/images/builders/interact/remix/using-remix-9.png)

!!! 注意事项
    若您在部署任意合约时遇到问题，可通过以下操作手动提高Gas限制。设置 -> 高级 -> 高级Gas控制 = 启用。

完成确认后，部署也随之完成，您将会在MetaMask上看到您的交易记录。与此同时，合约也会出现在Remix的Deployed Contracts一栏内。

![Confirmed label on a transaction](/images/builders/interact/remix/using-remix-10.png)

成功部署合约之后，您便可通过Remix与智能合约进行交互。

将左侧页面往下滑，找到“Deployed Contracts”，点击name，symbol，以及totalSupply，将会分别出现“MyToken”，“MYTOK”，以及“8000000000000000000000000“。如果您复制合约地址并将它粘贴在balanceOf的空格中，您可以看到用户ERC-20地址上的账户全部余额。点击合约名称和地址旁边的按钮可复制合约地址。

![Interact with the contract from Remix](/images/builders/interact/remix/using-remix-11.png)

## 通过MetaMask与基于Moonbeam的ERC-20进行交互 {: #interacting-with-a-moonbeam-based-erc-20-from-metamask }

打开MetaMask添加刚部署的ERC-20 Token。首先，请确认您已在Remix上复制了合约地址。然后，在MetaMask上点击“Import Tokens”（请确保您现在所操作的账户为已部署合约的账户）

![Add a token](/images/builders/interact/remix/using-remix-12.png)

将已复制的地址粘贴至“Custom Token”的Token合约地址空格内，与此同时”Token符号“和”小数精度“会自动填充。

![Paste the copied contract address](/images/builders/interact/remix/using-remix-13.png)

点击“下一步”，您需再次确认是否要将这些Token加入至您的MetaMask账户。点击“Add Token”后，您会看到800万的MyTokens已成功加入您的账户：

![Add the tokens to your MetaMask account](/images/builders/interact/remix/using-remix-14.png)

现在我们可以通过MetaMask将这些ERC-20 Token转至其他设定好的账户。您只需点击“发送”就可以将500个MyToken转移至您所选取的目标账户。

点击“下一步”，您需再次确认交易（如下图所示）

![Confirmation of the token transfer](/images/builders/interact/remix/using-remix-15.png)

点击“确认”，交易完成之后，您将会在MetaMask账户上看到交易记录以及账户余额：

![Verify the reduction in account balance](/images/builders/interact/remix/using-remix-16.png)

如果您拥有收款的账户，您也可以通过查看账户余额来确认转账是否成功。

## 使用Moonbeam Remix Plugin {: #using-the-moonbeam-remix-plugin }

Moonbeam团队开发了Remix Plugin以简化部署以太坊智能合约至Moonbeam网络的流程。Moonbeam Remix Plugin综合了所有在编译、部署和交互时所需的功能，能够在无需切换页面的情况下（即在同一个页面内）完成智能合约的部署和开发。

### 安装Moonbeam Remix Plugin {: #installing-the-moonbeam-remix-plugin }

请遵循以下步骤安装Moonbeam Remix Plugin：

 1. 点击进入Plugin管理页面

 2. 搜寻“Moonbeam”

  3. 点击“Activate”，Moonbeam Rexmi Plugin将会直接安装至您的Plugin管理页面当中

![Activating the Moonbeam Remix Plugin](/images/builders/interact/remix/using-remix-17.png)

当您已成功安装插件，代表Moonbeam Remix Plugin的Moonbeam标志将会出现在左手边。

### 开始使用Moonbeam Remix Plugin {: #getting-started-with-the-moonbeam-remix-plugin }

在Remix IDE中点击Moonbeam Logo开启Moonbeam Plugin。请注意，此教程预设您在Remix内已有待编译的合约。您可以在[此网页](https://wizard.openzeppelin.com/)创建ERC-20合约，遵循以下步骤使用Moonbeam Remix Plugin在Moonbase Alpha部署一个ERC-20 Token。

 1. 点击“Connect”，将您的Metamask钱包连接至Remix IDE

 2. 确认您选取正确的网络。在此教程中，我们使用的是Moonbase Alpha网络。

 3. 点击Compile或是根据需求点击Auto-Compile

  4. 点击Deploy并在Metamask上确认交易

![Compiling and Deploying a Contract with the Moonbeam Remix Plug](/images/builders/interact/remix/using-remix-18.png)

就是这么简单！当合约成功部署后，您将能看到地址以及所有能够与之交互的访问和修改方法。

Moonbeam Remix Plugin能够在Remix中无缝使用，所以您可以随时切换使用传统的Remix编译功能进行部署，或是选择使用Moonbeam Remix Plugin。
