---
title: 使用MathWallet
description: 通过此教程学习如何将Mathwallet（浏览器版）钱包连接至Moonbeam。
---

# 使用MathWallet与Moonbeam交互

![Intro banner](/images/mathwallet/mathwallet-banner.png)

## 概览 {: #introduction } 

MathWallet先前[宣布](https://mathwallet.org/moonbeam-wallet/en/)其可原生支持[Moonbase Alpha测试网](/networks/moonbase/)，意味着用户现在能通过除了MetaMask以外的钱包来与Moonbase Alpha进行交互。

在本教程中，我们将带您了解如何设置MathWallet，使其能够连接到我们的测试网。除此之外，我们也会提供一个简短的例子，来说明如何在其他工具中，譬如[Remix](/integrations/remix/)，将MathWallet当作一个Web3的提供者来使用。

## 将MathWallet连接至Moonbeam {: #checking-prerequisites } 

在这个部分，我们将会演示如何将MathWallet连接至Moonbase Alpha。

首先您需要安装MathWallet浏览器插件，您可以通过此[网站](https://mathwallet.org/en-us/)安装。

成功安装之后，请打开它并且设置密码。

![Set wallet password](/images/mathwallet/mathwallet-images-1.png)

接着，请启动Moonbase Alpha。点击Settings（右上角的齿轮图标）-> Networks -> Ethereum。

![Enable Moonbase Alpha](/images/mathwallet/mathwallet-images-2.png)

最后，在主界面点击Switch Network并选取Moonbase Alpha.

![Connect to Moonbase Alpha](/images/mathwallet/mathwallet-images-3.png)

就这样，您已经成功将MathWallet连接至Moonbase Alpha测试网了！您的钱包应如以下所示：

![Wallet Connected to Moonbase Alpha](/images/mathwallet/mathwallet-images-4.png)

## 如何新增钱包 {: #adding-a-wallet }

现在我们已经成功地将MathWallet连接至Moonbase Alpha了，我们可以创建一个钱包来获得一个账户并开始与测试网交互。到目前为止，有三个方法能够新增钱包：

 - 创建一个钱包
 - 使用助记词或私钥来导入一个已存在的钱包
- 连接硬钱包（_目前尚未支持_）

### 创建一个钱包 {: #create-a-wallet}

如果希望建立一个新的钱包，请点击"Moonbase Alpha"左边的:heavy_plus_sign:图示并且选取"Create Wallet"。

![MathWallet create a wallet](/images/mathwallet/mathwallet-images-5.png)

设置并确认您的钱包名字。接着，请确认您已安全地记下您的助记词，因为它可以有直接的权限进入您的钱包并使用您的资产。当您完成了整个过程之后，您应当能够在新建立的钱包看到与其相连的公开地址。

![MathWallet wallet created](/images/mathwallet/mathwallet-images-6.png)

### 导入一个钱包 {: #import-a-wallet } 

如果希望建立一个新的钱包，请点击"Moonbase Alpha"左边的:heavy_plus_sign:图示并且选取"Import Wallet"。

![MathWallet import a wallet](/images/mathwallet/mathwallet-images-7.png)

接着，选取使用助记词或是私钥来导入钱包。如果选择的是助记词，请逐字输入助记词并以空格分格。至于第二个选项，请输入私钥（可以使用或不使用为`0x`开头输入，两者皆能运作）

![MathWallet private key or mnemonic import](/images/mathwallet/mathwallet-images-8.png)

接着点击下一步，设定好钱包名字之后就完成了！您应当可以在您输入的钱包上看到其相应的公共地址。

![MathWallet imported wallet](/images/mathwallet/mathwallet-images-9.png)

## 如何使用MathWallet {: #using-mathwallet } 

在类似于[Remix](/integrations/remix/)的工具中，MathWallet扮演着一个Web3提供者的角色。当您成功将MathWallet连接至Moonbase Alpha之后，您就可以像使用MetaMask一般，部署合约，或是签名交易，只是使用的媒介是MathWallet。

举例而言，在Remix中，当您在部署一个智能合约时，请记得在"Environment"列表中选取"Injected Web3"的选项。如果您的MathWallet已经连接，您会在box（_1287_）下面看见测试网的Chain ID以及您已经汇入Remix的MathWallet账户。当您在发送交易的时候，应当会看见一个相似的弹出窗口，如下图：

![MathWallet sign transaction](/images/mathwallet/mathwallet-images-10.png)

点击"Accept"代表您正在签名这项交易，接着合约即将被部署至Moonbase Alpha测试网。
