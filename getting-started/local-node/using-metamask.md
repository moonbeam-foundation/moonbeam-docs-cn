---
title: MetaMask使用教程
description: 本教程将指导您如何通过谷歌浏览器上的MetaMask插件交互本地Moonbeam节点。
---

# 如何通过MetaMask交互Moonbeam节点

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/hrpBd2-a7as' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>You can find all of the relevant code for this tutorial on the <a href="{{ config.site_url }}resources/code-snippets/">code snippets page</a></div>

## 概览

通过Moonbase Alpha测试网或本地运行的Moonbeam开发节点，开发者可使用MetaMask连接到Moonbeam网络。

本教程展示了将MetaMask连接到自主运行的Moonbeam独立节点，以及在各个帐户之间转移代币的详细步骤。如果您尚未设置本地开发节点，请参考[本教程](/getting-started/local-node/setting-up-a-node/), 或按照[GitHub资料库](https://github.com/PureStake/moonbeam/)的说明操作。

!!! 注意事项
    本教程用[Moonbase Alpha](https://github.com/PureStake/moonbeam/releases/tag/v0.3.0)的tutorial-v7标签建立。为实现与以太坊的全面兼容，基于Substrate的Moonbeam和[Frontier](https://github.com/paritytech/frontier)组件正处于积极开发阶段。本教程示例基于Ubuntu 18.04的环境，用户需根据其所使用的MacOS和Windows版本进行微调。 
    --8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

您有两种方式交互Moonbeam：使用Substrate的RPC终端口或使用与Web3兼容的RPC终端口。后者目前正在为与Substrate RPCs相同的RPC服务器提供服务。本教程中，我们将使用Web3 RPC终端口与Moonbeam进行交互

## MetaMask插件安装教程

首先，从谷歌Chrome浏览器的网上应用商店安装[MetaMask](https://metamask.io/)。在下载、安装、初始化该扩展程序之后，遵循“Get Started”指南进行设置。您需要创建一个MetaMask钱包，设置登录密码并生成助记词（可用于账户资金的管理。请保存好助记词并确保其存放在安全的地方）。完成后，我们将导入帐户：

![Import dev account into MetaMask](/images/metamask/using-metamask-1.png)

导入开发账户的详细信息如下：

--8<-- 'text/setting-up-node/dev-accounts.md'

在导入页面，选择“Private Key”并粘贴以上私钥（在本教程示例中，我们使用Gerald的密钥）：![Paste your account key into MetaMask](/images/metamask/using-metamask-2.png)

导入后将出现如下图所示的“Account 2”：

![MetaMask displaying your new Account 2](/images/metamask/using-metamask-3.png)

## 连接MetaMask至Moonbeam

将MetaMask连接到本地开发节点或Moonbase Alpha测试网。

在MetaMask中，找到设置 -> 网络 -> 添加网络。您可在此处使用以下网络配置进行设置：

Moonbeam开发节点：

--8<-- 'text/metamask-local/development-node-details.md'

Moonbase Alpha测试网：

--8<-- 'text/testnet/testnet-details.md'

按照本教程步骤，我们接着将MetaMask连接到本地运行的Moonbeam开发节点。

![Enter your new network information into MetaMask](/images/metamask/using-metamask-4.png)

当您单击“保存”并退出网络设置界面时，MetaMask应通过其Web3 RPC连接到本地Moonbeam独立节点，届时您将看到Moonbeam开发帐户的余额为1208925.8196 DEV。

![Your new Moonbeam account with a balance of 1207925.8196](/images/metamask/using-metamask-5.png)

## 进行首笔交易

尝试通过MetaMask发送一些DEV代币。

为简单起见，我们将代币从开发帐户转至设置MetaMask时创建的帐户。因此，我们可以使用“在我的账户间转账”的选项。我们尝试交易100个代币并保持其他设置不变：

![Initiating a token transfer](/images/metamask/using-metamask-6.png)

提交交易后，您将看到“待处理”字样的的状态，直到确认为止，如下图所示：

![Transaction confirmation](/images/metamask/using-metamask-7.png)

请注意，帐户2的余额减去了已转移的金额以及交易费。切换到帐户1，我们看到已转移的100代币已经到账：

![New balance in Account 1](/images/metamask/using-metamask-8.png)

如果您回到运行Moonbeam节点的终端，可以在交易到达时看到正在编写的区块：

![Moonbeam Development Node](/images/metamask/using-metamask-9.png)

!!! 注意事项
    如果您最终使用Substrate purge-chain命令重置独立节点，您需要通过设置 -> 高级 -> 重设账户这些步骤来重置您的MetaMask的初始账户。重置账户将清除您的交易历史记录并重置交易nonce（交易号）。请确保不要重置任何的其他设置。

