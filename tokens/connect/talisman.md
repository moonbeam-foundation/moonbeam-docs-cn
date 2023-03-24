---
title: 通过Polkadot JS Apps使用Talisman
description: 遵循此教程学习如何使用Moonbeam的以太坊格式的H160地址并通过Polkadot.js Apps和Talisman发送交易。
---

# 使用Talisman与Moonbeam交互

![Banner image](/images/tokens/connect/talisman/talisman-banner.png)

## 概览 {: #introduction } 

作为波卡（Polkadot）平行链，Moonbeam使用[统一账户结构](/learn/features/unified-accounts/){target=_blank}允许您使用单个以太坊格式的地址就能与Substrate(Polkadot)功能和Moonbeam的EVM交互。这种统一的账户结构意味着您无需同时维护Substrate和以太坊账户，只需通过单个以太坊账户私钥即可完成与Moonbeam交互。

[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank}支持通过像[Talisman](https://www.talisman.xyz/){target=_blank}的插件导入进浏览器的H160账户。请注意，Polkadot.js Apps正在逐步取消对[本地存储在浏览器缓存中的账户](/tokens/connect/polkadotjs/)的支持。您仍可以通过Polkadot.js Apps继续使用导入到和存储在浏览器本地的任何账户，但是您不能再添加新的账户。这意味着您将需要使用Talisman这类插件。此外，从Talisman等插件导入账户通常比直接存储账户至浏览器要更为安全。

本教程涵盖如何在Talisman设置账户以及如何通过Polkadot.js Apps使用Talisman与Moonbeam交互的所有操作步骤。

--8<-- 'text/disclaimers/third-party-content-intro.md'

## 设置Talisman {: #setting-up-talisman }

Talisman是一个原生支持Substrate（Polkadot）和以太坊账户的加密钱包。Talisman钱包浏览器插件可在[Google Chrome](https://chrome.google.com/webstore/detail/talisman-polkadot-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld){target=_blank}、[Brave](https://chrome.google.com/webstore/detail/talisman-polkadot-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld){target=_blank}和[Firefox](https://addons.mozilla.org/en-US/firefox/addon/talisman-wallet-extension/){target=_blank}上使用，以及相应的资产数据面板可在[app.talisman.xyz](https://app.talisman.xyz/){target=_blank}上访问。

首先，下载并安装[Talisman插件](https://www.talisman.xyz/){target=_blank}。插件打开后，系统将提示您创建一个新钱包或导入现有钱包。出于本教程目的，我们将创建一个新的钱包。接下来，系统将提示您创建密码以保护新钱包。

![Create a new wallet or import an existing one into Talisman.](/images/tokens/connect/talisman/talisman-1.png)

!!! 请记住
    Talisman不会要求您备份助记词，但是会在屏幕底部提醒您。如果您不备份助记词，您可能会丢失所有的资产。

要备份新创建的钱包，请执行以下步骤：

1. 点击**Backup Now**
2. 为您的Talisman钱包输入密码
3. 点击**View Recovery Phrase**并将其存储在安全的地方

![Back up your Talisman recovery phrase.](/images/tokens/connect/talisman/talisman-2.png)

## 配置Talisman连接至测试网 {: #setting-up-talisman-to-connect-to-testnets } 

[在启用以太坊账户后](#connecting-talisman-to-moonbase-alpha-polkadot.js-apps)，Talisman适用于所有的Moonbeam网络。通过点击插件里的左上角Talisman图标（logo），在**Portfolio**标签下可以看到所有网络的余额。默认设置下，Talisman会隐藏测试网络的余额。但是，您可以通过执行以下步骤更改此设置：

1. 打开Talisman插件，点击Talisman logo
2. 点击**Settings**
3. 选择**Ethereum Networks**
4. 点击**Enable Testnets**

![See your Moonbase Alpha testnet account balances in Talisman.](/images/tokens/connect/talisman/talisman-3.png)

## 将Talisman连接至Moonbeam和Polkadot.js Apps {: #connecting-talisman-to-moonbase-alpha-polkadot.js-apps }

在Polkadot.js Apps连接Talisman至基于Moonbeam的网络非常简单。请记住，如果您想要连接至Moonbase Alpha需要[启用测试网](#setting-up-talisman-to-connect-to-testnets)。

要将Talisman连接至基于Moonbeam的网络（本教程以Moonbase Alpha测试网为例），首先前往[Moonbase Alpha Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank}。Talisman插件将提示您选择要用于Polkadot.js Apps的账户。如果系统未自动跳出提示，您可以打开Talisman插件并在顶部点击**Connected / Not Connected**按钮。要在Polkadot.js Apps配置Talisman将其正确连接至Moonbeam网络，请执行以下步骤：

1. 勾选**Show Ethereum Accounts**
2. 设置您想要连接至Polkadot.js Apps的账户。在本示例中为**My Ethereum Account**。此为Talisman分配的默认名称，您可根据需求重命名
3. 点击**Connect 1**。该数值将根据您连接的帐户数量而变化

![Enable Ethereum/Moonbeam accounts in Talisman.](/images/tokens/connect/talisman/talisman-4.png)

您的Talisman钱包现已连接至Polkadot.js Apps。刷新Polkadot.js Apps后，您将在[Polkadot.js Apps的账户页面](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank}看到Talisman账户。首次启动[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank}的时候，可能会出现连接至其他网络的情况。您可通过点击左上角的logo将网络切换至Moonbase Alpha TestNet，将页面往下滑找到**Test Networks**部分，选择Moonbase Alpha后，再回到顶部点击**Switch**即可。

![Connect to Polkadot.js Apps.](/images/tokens/connect/talisman/talisman-5.png)

切换后，Polkadot.js网站将不仅会连接到Moonbase Alpha，还会更改其样式以完美匹配。

![Switch to Moonbase Alpha in Polkadot.js Apps.](/images/tokens/connect/talisman/talisman-6.png)

## 添加新账户至Talisman {: #adding-a-new-account-to-talisman } 

在此部分，您将了解如何创建新账户或导入现有的MetaMask账户至Polkadot.js Apps。

1. 打开Talisman插件并点击左上角的Talisman logo
2. 点击**Add Account** 
3. 选择**New Account**
4. 选择**Ethereum**作为账户类型
5. 设置账户名称
6. 点击**Create**

![Create a new Moonbeam account in Talisman.](/images/tokens/connect/talisman/talisman-7.png)

即使新账户已成功创建，但是Polkadot.js App并未察觉到此账户。为此，请在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank}执行以下步骤将新账户连接到Polkadot.js Apps：

1. 打开Talisman插件，点击**Connected / Not-connected**按钮
2. 确保勾选**Show Eth accounts**
3. 选择想要连接的账户。选择后，账户右侧的小点会变亮

![Connect Talisman account to Polkadot.js Apps.](/images/tokens/connect/talisman/talisman-8.png)

## 通过Substrate API发送交易 {: #sending-a-transaction-through-substrates-api } 

要演示Moonbeam的[统一账户](/learn/features/unified-accounts){target=_blank}的功能，您需要使用Polkadot.js Apps通过Substrate API进行转账。请注意您正在使用以太坊格式的H160地址与Substrate交互。为此，您需要[添加另一个账户](#adding-a-new-account-to-talisman)。Talisman中的账户已经重新命名为Alice和Bob账户。请执行以下步骤从Alice账户向Bob账户发送一些DEV Token：

点击Alice的**send**按钮，这将跳出弹窗引导您发送交易。

1. 在**send to address**设置接收地址
2. 在**amount**输入要发送的数量，在本示例中为4枚DEV token
3. 准备就绪后，点击**Make Transfer**按钮
4. 在Talisman的弹窗中批准交易

![Send a Moonbeam transaction through the Substrate API with Talisman.](/images/tokens/connect/talisman/talisman-9.png)

交易确认后，您将在每个账户看到余额更新。

![You can see your balances updated in Polkadot.js Apps after a successful transaction.](/images/tokens/connect/talisman/talisman-10.png)

这样就可以了！这些步骤展示了使用Talisman在Polkadot.js Apps中与导入的H160账户进行交互的简便性和强大的安全性。这均归功于Moonbeam的统一账户结构，这是Moonbeam致力于最佳用户体验的很好展示。

--8<-- 'text/disclaimers/third-party-content.md'
