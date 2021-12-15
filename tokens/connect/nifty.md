---
title: 使用Nifty
description: 此教程将会带您了解如何连接Nifty钱包，一个基于浏览器并与以太坊和Moonbeam兼容的钱包。
---

# 使用Nifty钱包与Moonbeam交互

![Intro banner](/images/tokens/connect/nifty/nifty-banner.png)

## 概览 {: #introduction }

[Nifty钱包](https://www.poa.network/for-users/nifty-wallet)先前从MetaMask分叉出来，并随后被扩展至以与POA网络、POA核心和POA Sokol互操作。由于Nifty与以太坊相互兼容，因此同样也可以在Moonbeam上使用。

请注意，由于Nifty钱包仍然是测试软件，因此建议在网站使用完毕后登出您的钱包。

本教程包含如何设置Nifty钱包并将其连接至我们的测试网Moonbase Alpha。

## 创建钱包 {: #creating-a-wallet } 

首先，您需要在谷歌Chrome网页商店内安装[Nifty钱包浏览器插件](https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid?hl=en)。

当浏览器插件安装完毕，请将其打开并且设置个人密码。

<img src="/images/tokens/connect/nifty/nifty-1.png" alt="Set wallet password" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

成功创建个人密码之后，账户将会创立一个资产库并生成能够恢复您账户的助记词。您将会被提醒储存页面上的助记词。您可以选择以文档的形式储存您的助记词，或是以其他的方式进行存储，接着您可以点击“I‘ve copied it somewhere safe.“来继续创建过程。您只需要确定您已经安全地储存了助记词并且不会与任何人分享。

## 将Nifty钱包连接至Moonbeam {: #connect-nifty-wallet-to-moonbeam }

当您成功创建一个账户，即可通过创建一个自定义网络连接至Moonbase Alpha测试网。

您也可以通过导入已有的账户连接至Moonbase Alpha。目前为止，硬件钱包暂不支持自定义RPC。

导向至设置，在左上角点击POA下拉菜单。接着，下滑页面至底部选取Custom RPC。

<img src="/images/tokens/connect/nifty/nifty-2.png" alt="Create Custom RPC" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

在新的RPC URL处输入Moonbeam的RPC URL：

=== "Moonriver"
    ```
      {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"
    ```
      {{ networks.moonbase.rpc_url }}
    ```

=== "Moonbeam Dev Node"
    ```
      {{ networks.development.rpc_url }}
    ```

最后点击“Save”。

<img src="/images/tokens/connect/nifty/nifty-3.png" alt="Connect to Moonbase Alpha" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

完成后，RPC链接会被更改成Moonbase Alpha的RPC URL，并且您可以在左上角看到网络已经被更换成“Private Network”。

<img src="/images/tokens/connect/nifty/nifty-4.png" alt="Wallet Connected to Moonbase Alpha" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

恭喜您已经成功将Nifty钱包连接至Moonbase Alpha测试网！

## 使用Nifty钱包 {: #using-nifty-wallet }

Nifty钱包为Web3工具的提供者，如[Remix](/builders/tools/remix/)。通过将Nifty钱包连接至Moonbase Alpha，您可以如同在MetaMask上部署合约般部署合约，并且通过Nifty签署交易。

举例而言，在Remix中，当您在部署智能合约时，请确保您在“Environment”菜单中选择“Injected Web3”的选项。当您成功连接Nifty钱包，您将会在方框（_{{ networks.moonbase.chain_id }}_）下面见到测试网Chain ID，并且您的Nifty钱包账户将会同时嵌入至Remix。当您在传送交易时，您将会看一个类似下图所示的弹窗：

<img src="/images/tokens/connect/nifty/nifty-5.png" alt="Nifty sign transaction" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

确保您账户拥有DEV Token，必要时，可以至[水龙头](/builders/get-started/moonbase/#get-tokens/)获取一些Token。点击“Submit”，签署交易后，合约将会被部署至Moonbase Alpha测试网。

!!! 注意事项
    请注意，即使您的账户余额显示有ETH，但那只是DEV Token并非真正的ETH。另外，本次交易将会显示在“Sent”标签下面，如下图所示：

<img src="/images/tokens/connect/nifty/nifty-6.png" alt="Nifty confirmed transaction" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

## 创建新账户 {: #create-a-new-account }

如果您想要创建新账户，请点击右上角的用户图标并选取“Create Account”。

<img src="/images/tokens/connect/nifty/nifty-7.png" alt="Nifty create an account" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

新的账户将会被创建并且自动切换至新账户。

<img src="/images/tokens/connect/nifty/nifty-8.png" alt="Nifty create an account" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

## 导入账户 {: #import-an-account }

如果您想要创建新钱包，请点击右上角的用户图标并选取“Import Account”。

<img src="/images/tokens/connect/nifty/nifty-9.png" alt="Nifty import an account" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

接着，在下方选取导入的方式并且输入必要内容以导入您的账户。举例而言，如果您希望使用私钥导入账户，请在输入区域内贴上您的私钥并点击“Import”。

<img src="/images/tokens/connect/nifty/nifty-10.png" alt="MathWallet private key or mnemonic import" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

您的账户将会被导入并且自动切换至已导入的账户。

<img src="/images/tokens/connect/nifty/nifty-11.png" alt="Nifty create an account" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

