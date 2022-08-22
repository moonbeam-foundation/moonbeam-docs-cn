---
title: 使用Remix部署智能合约
description: 学习如何将最受欢迎的以太坊开发工具之一Remix IDE与Moonbeam网络交互。
---

# 使用Remix部署至Moonbeam

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/NBOLCGT5-ww' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## 概览 {: #introduction }

[Remix](https://remix.ethereum.org/){target=_blank}是目前以太坊上最常被使用的智能合约开发环境之一。基于Moonbeam兼容以太坊的特性，Remix可直接与Moonbeam网络一起使用。

本教程将介绍使用Remix IDE在Moonbeam开发节点上部署和创建基于Solidity的智能合约的过程。此教程同时适用于Moonbeam、Moonriver和Moonbase Alpha网络。

## 查看先决条件 {: #checking-prerequisites }

在开始之前，您将需要准备以下内容：

- 本地运行的[Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev/){target=_blank}
- [安装且配置完毕的MetaMask](/tokens/connect/metamask/){target=_blank}以使用您的开发节点

如果您已遵循上述教程，您将会拥有一个正在收集交易以生产区块的本地Moonbeam节点。

![Local Moonbeam node producing blocks](/images/builders/build/eth-api/dev-env/remix/using-remix-1.png)

您的开发节点具有10个拥有资金的账户，您应当将您的MetaMask连接至您的Moonbeam开发节点并导入至少一个预注资的账户。

![MetaMask installation with a balance](/images/builders/build/eth-api/dev-env/remix/using-remix-2.png)

如果您正在Moonbeam、Moonriver或是Moonbase Alpha网络上跟随此教程进行操作，请确认您连接的是正确的网络并拥有具有一定资金的账户。
--8<-- 'text/faucet/faucet-sentence.md'

## 开始使用Remix {: #getting-started-with-remix }

现在，您可以启动[Remix](https://remix.ethereum.org/){target=_blank}进行操作。在主页面的**Featured Plugins**下选择 **SOLIDITY**为Solidity开发配置Remix，接着导航至**File Explorers**查看。

![File explorer](/images/builders/build/eth-api/dev-env/remix/using-remix-3.png)

您将会需要创建一个新文件以保存Solidity智能合约。点击**File Explorers**下方的**+**按钮并在弹窗中输入文件名称`MyToken.sol`。

![Create a new file for your Solidity contract](/images/builders/build/eth-api/dev-env/remix/using-remix-4.png)

接着，将以下智能合约粘贴至弹窗的编辑框内：

```solidity
--8<-- 'code/remix-local/contract.md'
```

![Paste the contract into the editor](/images/builders/build/eth-api/dev-env/remix/using-remix-5.png)

这是一个基于最新OpenZeppelin ERC-20模板编写的简易版ERC-20合约。该合约使用`MYTOK`作为`MyToken`的符号，并为合约创建者铸造初始Token。

接着，导向至侧边选项的**Compile**并点击**Compile MyToken.sol**按钮。

![Compile MyToken.sol](/images/builders/build/eth-api/dev-env/remix/using-remix-6.png)

您将会看到Remix下载了所有OpenZeppelin的依赖项并完成合约编译。

## 使用Remix在Moonbeam上部署合约 {: #deploying-a-contract-to-moonbeam-using-remix }

现在我们可以通过侧边的**Deployment**选项来部署合约。您需要将顶端的**ENVIRONMENT** 从**JavaScript VM**向下拉至**Injected Web3**。如此一来，Remix会使用MetaMask导入的账户并指向一个已导入的Moonbeam开发节点。如果您想要使用Moonbeam网络尝试此操作，请确保将MetaMask连接到正确的网络而非本地开发节点。

当您选择**Injected Web3**选项时，您需授权Remix连接您的MetaMask账户。

![Replace](/images/builders/build/eth-api/dev-env/remix/using-remix-7.png)

请在MetaMask点击**Next**授权Remix使用您所选取的账户。

接着返回Remix界面，您会看到您想要用来部署的账户已经通过MetaMask授权登入。在**Deploy**按键的旁边输入Token数额，假设我们现在要部署800万的Token。但由于此合约默认位数为小数点后18位，因此您需要在输入框内输入`8000000000000000000000000`。

确认数值输入无误之后，请点击**Deploy**。

![Enter an account balance and deploy](/images/builders/build/eth-api/dev-env/remix/using-remix-8.png)

随后，MetaMask将跳出弹窗要求您确认此次部署合约的交易。

![Confirm the transaction message](/images/builders/build/eth-api/dev-env/remix/using-remix-9.png)

!!! 注意事项
    如果您在部署任意合约时遇到问题，可通过以下操作手动提高Gas限制。选取右上角的有颜色的圆圈并在菜单中选择**Settings**。接着，点击**Advanced**并将**Advanced Gas Controls**设定为**ON**。

在您点击**Confirm**后部署也随之完成，您将会在MetaMask上看到您的交易记录。与此同时，合约也将会在Remix中的**Deployed Contracts**下出现。

![Confirmed label on a transaction](/images/builders/build/eth-api/dev-env/remix/using-remix-10.png)

成功部署合约之后，您便可通过Remix与智能合约进行交互。

将页面下滑，找到**Deployed Contracts**，点击**name**、**symbol**，以及**totalSupply**，将会分别出现`MyToken`、`MYTOK`以及`8000000000000000000000000`。如果您复制合约地址并将它粘贴在**balanceOf**字段中，您可以看到用户ERC-20地址上的账户全部余额。点击合约名称和地址旁边的按钮可复制合约地址。

![Interact with the contract from Remix](/images/builders/build/eth-api/dev-env/remix/using-remix-11.png)

## 通过MetaMask与基于Moonbeam的ERC-20进行交互  {: #interacting-with-a-moonbeam-based-erc-20-from-metamask }

现在，打开MetaMask添加刚部署的ERC-20 Token。在操作之前先确认您已在Remix上复制了合约地址。回到MetaMask，如下图所示，点击**Add Token**。请确保您现在所操作的账户为已部署合约的账户。

![Add a token](/images/builders/build/eth-api/dev-env/remix/using-remix-12.png)

将已复制的合约地址粘贴至**Custom Token**字段内，与此同时**Token Symbol**和**Decimals of Precision**字段会自动填充。

![Paste the copied contract address](/images/builders/build/eth-api/dev-env/remix/using-remix-13.png)

点击**Next**，您需再次确认是否要将这些Token加入至您的MetaMask账户。点击**Add Token**后，您会看到800万的MyToken已成功加入您的账户：

![Add the tokens to your MetaMask account](/images/builders/build/eth-api/dev-env/remix/using-remix-14.png)

现在您可以通过MetaMask将这些ERC-20 Token转至其他设定好的账户。您只需点击**Send**就可以将500个MyToken转移至您所选取的目标账户。

点击**Next**，您需再次确认交易（如下图所示）。

![Confirmation of the token transfer](/images/builders/build/eth-api/dev-env/remix/using-remix-15.png)

点击**Confirm**，交易完成之后，您将会在MetaMask账户上看到交易记录以及发送账户中减少的MyToken余额：

![Verify the reduction in account balance](/images/builders/build/eth-api/dev-env/remix/using-remix-16.png)

如果您拥有收款的账户，您也可以通过查看账户余额来确认转账是否成功。

## 使用Moonbeam Remix Plugin {: #using-the-moonbeam-remix-plugin }

Moonbeam团队开发了Remix Plugin以简化部署以太坊智能合约至Moonbeam网络的流程。Moonbeam Remix Plugin综合了所有在编译、部署和交互时所需的功能，能够在无需切换页面的情况下（即在同一个页面内）完成智能合约的部署和开发。Moonbeam Remix plugin支持Moonbeam、Moonriver以及Moonbase Alpha测试网。

### 安装Moonbeam Remix Plugin {: #installing-the-moonbeam-remix-plugin }

请遵循以下步骤安装Moonbeam Remix Plugin：

 1. 点击进入**Plugin manager**页面
 2. 搜寻**Moonbeam**
 3. 点击**Activate**，Moonbeam Remix plugin将会直接安装至您的Plugin管理标签当中

![Activating the Moonbeam Remix Plugin](/images/builders/build/eth-api/dev-env/remix/using-remix-17.png)

当您已成功安装插件，代表Moonbeam Remix Plugin的Moonbeam标志将会出现在左手边。

### 开始使用Moonbeam Remix Plugin {: #getting-started-with-the-moonbeam-remix-plugin }

在Remix IDE中点击Moonbeam Logo开启Moonbeam Plugin。请注意，此教程预设您在Remix内已有待编译的合约。您可以在[此网页](https://wizard.openzeppelin.com/){target=_blank}创建ERC-20合约，遵循以下步骤使用Moonbeam Remix Plugin在Moonbase Alpha部署一个ERC-20 Token。

 1. 点击**Connect**，将您的MetaMask钱包连接至Remix
 2. 确认您选取正确的网络。在此教程中，我们使用的是Moonbase Alpha网络。
 3. 点击**Compile**或根据需求点击**Auto-Compile**
 4. 点击**Deploy**和**Confirm**在MetaMask上确认交易

![Compiling and Deploying a Contract with the Moonbeam Remix Plug](/images/builders/build/eth-api/dev-env/remix/using-remix-18.png)

就是这么简单！当合约成功部署后，您将能看到地址以及所有能够与之交互的访问和修改方法。

Moonbeam Remix Plugin能够在Remix中无缝使用，所以您可以随时切换使用传统的Remix编译功能进行部署，或是选择使用Moonbeam Remix Plugin。

--8<-- 'text/disclaimers/third-party-content.md'
