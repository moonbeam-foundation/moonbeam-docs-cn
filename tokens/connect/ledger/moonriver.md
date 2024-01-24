---
title: 使用Moonriver Ledger App
description: 本教程将引导您如何使用您的Ledger硬件钱包通过原生Moonriver Ledger Live app在Moonriver上签署交易。
---

# 使用Ledger和Moonriver App与Moonriver交互

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/ct4h9MN41j4' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## 概览 {: #introduction }

硬件钱包可提供一个相对安全的加密资产存储方式，因其私钥（用于签署交易）是以离线的方式储存。截至本教程撰写时，Ledger可提供两种硬件钱包的解决方案：Ledger Nano S和Ledger Nano X。

您可以使用您的Ledger硬件钱包通过Moonriver Ledger Live app与Moonriver交互。在专用的Moonriver app内，您无需设置chain ID即可连接至正确的网络。请注意您只能使用Moonriver app连接至Moonriver网络，此app无法连接至其他基于Moonbeam的网络。

您也可以选择使用Ethereum app连接至Moonriver。使用Moonriver app和Ethereum app的主要区别在于当您使用Etheruem app时必须指定chain ID，Moonriver的chain ID为1285。如果您想要在Moonriver使用Ethereum app，您可以查看[使用Ledger和Ethereum App与Moonbeam交互](/tokens/connect/ledger/ethereum){target=_blank}的教程。

在本教程中，您将学会如何使用Moonriver app在Moonriver开始使用您的Ledger硬件钱包。本教程以Ledger Nano X设备为例进行演示操作，但操作步骤也同样适用于Ledger Nano S。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

--8<-- 'text/tokens/connect/ledger/checking-prereqs.md'

如果您更偏向使用MetaMask作为媒介来完成Ledger设备与Moonbeam之间的操作，请确保您的MetaMask[已连接至Moonbeam](/tokens/connect/metamask/){target=_blank}。

自[MetaMask的10.5.0版本](https://consensys.net/blog/metamask/metamask-and-ledger-integration-fixed/){target=_blank}发布后，将Ledger设备连接至Chrome上的MetaMask操作变得相对简单，您只需要安装最新版本的MetaMask即可。

## 安装Moonriver Ledger Live App {: install-the-ledger-live-app }

Moonriver app依赖于Ethereum app，因此在安装Moonriver app之前您需要先安装Ethereum app。请注意Moonriver app仅适用于Moonriver网络，并不适用于Moonbeam或Moonbase Alpha。

--8<-- 'text/tokens/connect/ledger/install-eth-app.md'
4. 在**App catalog**搜索Moonriver (MOVR)并点击**Install**。随后，您的Ledger设备将会显示**Processing**。安装完成后，Moonriver app将会出现在您的Ledger设备上

在Ledger Live app，您将在**Manager**页面的**Apps installed**标签下看到您所安装的Ethereum app和Moonriver app。app成功安装后，您可以关闭Ledger Live。

<img src="/images/tokens/connect/ledger/moonriver/ledger-1.webp" alt="Moonriver Ledger App Installed" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

## 将您的Ledger账户导入MetaMask {: #import-your-ledger-account-to-metamask }

现在您已成功安装了Ledger Live app，接下来您可以将您的Ledger连接至电脑并将其解锁，然后打开Moonriver app。

--8<-- 'text/tokens/connect/ledger/import-ledger/step-1.md'

![MetaMask Connect Hardware Wallet](/images/tokens/connect/ledger/moonriver/ledger-2.webp)

--8<-- 'text/tokens/connect/ledger/import-ledger/step-2.md'

![MetaMask Select Ledger Hardware Wallet](/images/tokens/connect/ledger/moonriver/ledger-3.webp)

--8<-- 'text/tokens/connect/ledger/import-ledger/step-3.md'

![Ledger on Chrome](/images/tokens/connect/ledger/moonriver/ledger-4.webp)

--8<-- 'text/tokens/connect/ledger/import-ledger/step-4.md'

如果MetaMask能成功连接至您的Ledger设备，您将能看到一个包含5个Moonriver/以太坊式账户的列表。如果您并未见到上述画面，请再次检查Ledger Live是否已关闭、Ledger设备是否已连接至您的电脑并成功解锁，并确保Moonriver app已开启。

--8<-- 'text/tokens/connect/ledger/import-accounts.md'

![MetaMask Select Ethereum Accounts to Import](/images/tokens/connect/ledger/moonriver/ledger-5.webp)

如果您已成功导入您的Ledger账户，您将能够在MetaMask页面上看到您的账户以及余额，如下图所示：

![MetaMask Successfully Imported Ledger Account](/images/tokens/connect/ledger/moonriver/ledger-6.webp)

您可以在MetaMask随时切换账户以查看您导入的Ledger账户余额。

您已经成功从您的Ledger设备导入一个兼容Moonriver的账户，现在您可以开始使用您的Ledger设备进行交互。

--8<-- 'text/tokens/connect/ledger/receive-tokens.md'

![MetaMask Copy Account](/images/tokens/connect/ledger/moonriver/ledger-7.webp)

接下来，您将需要获取一些MOVR Token并转入您所复制的账户地址。交易完成后，您将能看到余额更新。

## 发送Token {: #send-tokens }

接着，您可以使用您的Ledger设备在Moonriver上发送和签署交易。如果您希望开始发送交易，点击**Send**按钮：

![MetaMask Ledger Account Funded](/images/tokens/connect/ledger/moonriver/ledger-8.webp)

--8<-- 'text/tokens/connect/ledger/send-tokens/set-of-steps-1.md'
--8<-- 'text/tokens/connect/ledger/send-tokens/set-of-steps-2.md'

![MetaMask Ledger Transaction Wizard](/images/tokens/connect/ledger/moonriver/ledger-9.webp)

在您通过交易之后，MetaMask会将此发送至网络上。当交易被成功确认后，将会被显示在MetaMask的**Activity**标签中的**Send**一栏。

![MetaMask Ledger Transaction Wizard](/images/tokens/connect/ledger/moonriver/ledger-10.webp)

这样就可以了！您已成功签署交易并使用您的Ledger硬件钱包发送了一些MOVR Token。

--8<-- 'text/tokens/connect/ledger/blind-signing.md'

![MetaMask Ledger Allow Contracts Tx](/images/tokens/connect/ledger/moonriver/ledger-11.webp)

--8<-- 'text/_disclaimers/third-party-content.md'
