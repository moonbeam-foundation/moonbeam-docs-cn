---
title: 如何连接和使用Trezor
description: 通过本教程学习如何利用Moonbeam兼容以太坊的特性，连接和使用Trezor硬件钱包在Moonbeam内签署交易
---

# Trezor硬件钱包

## 概览 {: #introduction } 

硬件钱包可提供一个相对安全的加密资产存储方式，因其密钥（用于签署交易）是以离线的方式储存。截至本教程撰写时，Trezor可提供两种硬件钱包的解决方案：Trezor One和Trezor Model T。

因为Moonbeam完全兼容以太坊的特性，您能够使用Trezor设备在Moonbeam签署交易！

本教程将会带您了解如何在Moonbase Alpha上开始使用您的Trezor硬件钱包，本教程仅包括使用Trezor Model T设备的执行步骤，但这也适用于Trezor One。

请注意，您的Trezor设备会在您MetaMask连接至的网络内签署交易。

--8<-- 'text/disclaimers/third-party-content-intro.md'

## 查看先决条件 {: #checking-prerequisites } 

在您开始之前，请将您的[Trezor Suite](https://suite.trezor.io/){target=_blank}更新至最新的可用版本。 与此同时，请确认您的Trezor硬件钱包运行的是最新的固件。Trezor wiki有提供如何更新[Trezor One](https://wiki.trezor.io/User_manual:Updating_the_Trezor_device_firmware__T1){target=_blank}和[Trezor Model T](https://wiki.trezor.io/User_manual:Updating_the_Trezor_device_firmware){target=_blank}设备固件的教程。

截至本教程撰写时，使用的版本如下：

 - Trezor Suite 21.5.1
 - Trezor One firmware v1.10.0
 - Trezor Model T firmware v2.4.0

除此之外，您还需要MetaMask作为您Trezor设备与Moonbase Alpha之间的媒介，请确保您的[MetaMask已成功连接至Moonbase Alpha](/integrations/wallets/metamask/){target=_blank}。请注意，您的Trezor设备会在您连接至MetaMask的网络内签署交易。

## 将您的Trezor账户导入MetaMask {: #importing-your-trezor-account-to-metamask } 

首先，您需要设置一个钱包（标准或是隐藏钱包）。当您成功连接至您的Trezor设备，请将其解锁，并在Trezor Suite获得一个钱包设置。接着，将您的Trezor以太坊账户导入MetaMask，您可以跟随以下步骤进行操作：

 1. 点击右上角的logo展开使用菜单
 2. 选取**Connect Hardware Wallet**

![MetaMask Connect Hardware Wallet](/images/tokens/connect/ledger/ethereum/ledger-2.png)

进入下个页面之后，选择您要在MetaMask使用的硬件钱包。截至本教程撰写时，仅支持Ledger和Trezor硬件钱包。您可以根据以下步骤进行操作：

 1. 点选Trezor logo
 2. 点击**Continue**

![MetaMask Select Trezor Hardware Wallet](/images/tokens/connect/trezor/trezor-2.png)

点击按钮之后，将会出现一个名为**TrezorConnect**的页面，您需要在这里配对您的设备。如果您已经打开Trezor Suite且设备已经连接成功，则不需要此步骤。在这里，请点击**Pair Device**。

![Trezor Hardware Wallet Connect Pair Device](/images/tokens/connect/trezor/trezor-3.png)

跳转到下个页面，您可以跟随以下步骤操作：

 1. 点击**Check for devices.**，这将会打开一个新菜单显示您想要连接的Trezor设备（若可用）
 2. 选取您想要使用的Trezor设备
 3. 点击**Connect**

![Trezor Hardware Wallet Connect Wizard Select and Connect Device](/images/tokens/connect/trezor/trezor-4.png)

当您的设备已成功连接，您需要允许MetaMask读取其公钥。因此，请点击**Allow once for this session**。您也可以勾选**Don't ask me again**选项。

![Trezor Hardware Wallet Connect Wizard Allow Read Public Keys](/images/tokens/connect/trezor/trezor-5.png)

接着，您会被询问是否要导出您以太坊账户的公钥（如下图1）。点击之后，会跳出一个画面请您输入密码的选项（如下图2）。如果您想要使用默认钱包，可以直接点击**Enter**。相反地，请跟随[关于密码钱包的Trezor wiki文章](https://wiki.trezor.io/Passphrase){target=_blank}。

![Trezor Hardware Wallet Connect Wizard Allow Export and Passphrase](/images/tokens/connect/trezor/trezor-6.png)

如果MetaMask已经成功连接至您的Trezor设备，您可以看到具有5个以太坊式账户的列表。如果您没有看到，请再次检查您是否已经成功将您的Trezor设备连接至电脑且已成功解锁。您同样也可以打开Trezor Suite应用并重新尝试这个过程。

关于这5个以太坊账户，您可以跟随以下步骤进行操作：

 1. 选取您想要从Trezor设备导入的账户
 2. 点击**Unlock**

![Trezor Select Ethereum Accounts to Import](/images/tokens/connect/trezor/trezor-7.png)

如果您成功导入您Trezor的以太坊式账户，您会在MetaMask的主画面看到以下的画面：

![MetaMask Successfully Imported Trezor Account](/images/tokens/connect/trezor/trezor-8.png)

您现在已成功从Trezor设备导入一个兼容Moonbeam的账户且准备好[使用您的硬件钱包签署交易](#使用您的Trezor签署交易)。

## 使用您的Trezor签署交易 {: #signing-a-transaction-using-your-trezor } 

如果您已成功[将您的Trezor账户导入MetaMask](#将您的Trezor账户导入MetaMask)，并准备好使用您的Trezor设备在Moonbeam上签署交易。本教程将会带您了解如何在Moonbase Alpha测试网传送一个基础的交易，这些步骤同样适用于Moonbeam生态系统的其他网络。

首先，确保您的Trezor账户[有足够的DEV Token](/builders/get-started/networks/moonbase/#get-tokens/){target=_blank}。接着，点击**Send**按钮。

![MetaMask Trezor Account Funded](/images/tokens/connect/trezor/trezor-9.png)

接着，将会出现一个名为`TrezorConnect`的页面，它将会要求您允许从您的设备读取公钥的权限并为您的Trezor准备能够交易和数据签署。当您准备好，请点击**Allow once for this session***，同样您也可以勾选**Don't ask me again**的选项。

![Trezor Hardware Wallet Allow Read Public Keys and Signing](/images/tokens/connect/trezor/trezor-10.png)

如同操作一个标准的交易，您需要设定接收方地址，输入您想要发送的Token数量，确认交易细节后点击确认。这将会在您Trezor设备开启一个交易签署指示，您可以跟随以下的步骤进行操作：

 1. 检查所有的交易细节。请注意，Token对应于MetaMask所连接的网络。**In this case, it is DEV tokens and not UNKN!**
 2. 当确认完毕所有细节后，点击按钮以确认

!!! 注意事项
    截至本教程撰写时，代表Moonbeam相关网络的Token名字是`UNKN`。请注意，使用的Token对应于MetaMask所连接的网络。

![Trezor Hardware Wallet Sign Transaction](/images/tokens/connect/trezor/trezor-11.png)

在您通过交易之后，MetaMask会将交易传送至网络。当交易确认完成，MetaMask的主画面将会显示**Send**。

![MetaMask Trezor Transaction Wizard](/images/tokens/connect/trezor/trezor-12.png)

就这样！您已经成功在Moonbase Alpha使用您的Trezor硬件钱包签署交易！

使用您的Trezor设备与智能合约互操作的过程与本教程基本相同。请在同意交易之前，再次检查签署于您的Trezor设备的数据。

--8<-- 'text/disclaimers/third-party-content.md'