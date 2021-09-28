---
title: 使用MetaMask
description: 通过此教程学习如何将MetaMask，一个以浏览器为基础的以太坊钱包连接至Moonriver、Moonbase Alpha测试网或Moonbeam开发节点。
---

# 使用MetaMask与Moonbeam交互

![Intro banner](/images/integrations/integrations-metamask-banner.png)

## 概览 {: #introduction }

开发人员可以利用Moonbeam与以太坊兼容的特色，将一些如[MetaMask](https://metamask.io/)的工具整合至DApp中。如此一来，就可以使用MetaMask提供的库与要部署的链相交互。

目前为止，MetaMask可以配置并连接到这些网络：Moonbeam开发节点、Moonbase Alpha测试网和Moonriver。

如果您已经成功安装MetaMask，您可以使用MetaMask轻松连接至您选择的网络：

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbase">连接至Moonbase Alpha</a>
</div>

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonriver">连接至Moonriver</a>
</div>
!!! 注意事项
    MetaMask将会跳出弹框，要求授权将Moonbase Alpha添加为自定义网络。经授权后，MetaMask会将您当前的网络切换到Moonbase Alpha。

想要一键连接至Moonbase Alpha，先通过[如何将MetaMask按钮连接至您的dapp](/builders/interact/metamask-dapp/)进行设置。

## 视频教程

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed//hrpBd2-a7as' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>In this video, we'll show you how to use MetaMask to interact with Moonbeam</a></div>

<br>

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/ywpc1UwpIyg' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>In this video, we'll show you how to connect your MetaMask wallet to the Moonriver network</a></div>



## 安装MetaMask扩展程序 {: #install-the-metamask-extension }

首先，从谷歌Chrome浏览器的网上应用商店安装全新且默认的[MetaMask](https://metamask.io/)。下载、安装和初始化该扩展程序后，遵循“Get Started”指南进行设置。您需要创建一个MetaMask钱包，设置密码并储存您的助记词（请妥善保存您的助记词，该助记词将用于授权您账户中的资金）。

## 创建钱包 {: #create-a-wallet }

[MetaMask](https://metamask.io)安装完毕后，将会跳出一个欢迎页面。点击“开始”进行设置过程。

![MetaMask1](/images/metamask/metamask-1.png)

根据提示，选择使用账户助记词导入钱包或创建钱包。在本教程中，以创建新的钱包为例。

![MetaMask2](/images/metamask/metamask-2.png)

## 导入账户 {: #import-accounts }

除了创建新账户，您还可以选择导入任何您持有私钥的账户至MetaMask。例如，您可以导入开发账户。

![Import dev account into MetaMask](/images/metamask/metamask-3.png)

为该开发节点预先提供资金的开发账户的详细信息如下：

--8<-- 'code/setting-up-node/dev-accounts.md'

--8<-- 'code/setting-up-node/dev-testing-account.md'

在导入页面，选择“Private Key”并粘贴以上对应私钥（在本教程示例中，我们使用Gerald的密钥）：

![Paste your account key into MetaMask](/images/metamask/metamask-4.png)

导入后将出现如下图所示的“Account 2”：

![MetaMask displaying your new Account 2](/images/metamask/metamask-5.png)

## 连接MetaMask至Moonbeam {: #connect-metamask-to-moonbeam }

当您完成安装[MetaMask](https://metamask.io/)，并创建或导入账户后，您可以通过点击右上角的头像打开设置后将其连接至Moonbeam。

![MetaMask3](/images/metamask/metamask-6.png)

接下来，找到网络一栏，点击“添加网络”按钮。

![MetaMask4](/images/metamask/metamask-7.png)

您可在此处使用以下网络为MetaMask进行配置：

=== "Moonbeam Development Node"

    - Network Name: `Moonbeam Dev`
    - RPC URL: `{{ networks.development.rpc_url }}`
    - ChainID: `{{ networks.development.chain_id }}`
    - Symbol (Optional): `DEV`
    - Block Explorer (Optional): `{{ networks.development.block_explorer }}`

=== "Moonbase Alpha"

    - Network Name: `Moonbase Alpha`
    - RPC URL: `{{ networks.moonbase.rpc_url }}`
    - ChainID: `{{ networks.moonbase.chain_id }}`
    - Symbol (Optional): `DEV`
    - Block Explorer (Optional): `{{ networks.moonbase.block_explorer }}`

=== "Moonriver"

    - Network Name: `Moonriver`
    - RPC URL: `{{ networks.moonriver.rpc_url }}`
    - ChainID: `{{ networks.moonriver.chain_id }}`
    - Symbol (Optional): `MOVR`
    - Block Explorer (Optional): `{{ networks.moonriver.block_explorer }}`

![MetaMask5](/images/metamask/metamask-8.png)

## 进行首笔交易 {: #initiate-a-transfer }

您也可以尝试使用MetaMask发送一些Token。在本示例中，您将需要两个账户。为此，您需要再创建一个新的账户。两个账户准备完毕后，点击“发送”开启一笔转账。选择“在我的账户间转账”选项，我们尝试交易100个Token并保持其他设置不变：

![Initiating a token transfer](/images/metamask/metamask-9.png)

提交交易后，您将看到“待处理”字样的的状态，直到确认为止，如下图所示：

![Transaction confirmation](/images/metamask/metamask-10.png)

请注意，Account 2的余额减去了已转移的金额以及gas费。切换到Account 1，我们看到已转移的100个Token已经到账：

![New balance in Account 1](/images/metamask/metamask-11.png)

如果您回到运行Moonbeam节点的终端，可以在交易到达时看到正在编写的区块：

![Moonbeam Development Node](/images/metamask/metamask-12.png)

!!! 注意事项
    如果您最终使用Substrate purge-chain命令重置您的开发节点，您需要通过设置 -> 高级 -> 重设账户这些步骤来重置您的MetaMask的初始账户。重置账户将清除您的交易历史记录并重置交易nonce（交易号）。请确保不要重置任何的其他设置。
