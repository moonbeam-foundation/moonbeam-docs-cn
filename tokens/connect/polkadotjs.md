---
title: 在Polkadot.js Apps上创建帐户
description: 根据此教程快速学习如何使用Polkadot.js Apps与Moonbeam的以太坊标准H160地址进行交互和发送交易。
---

# Polkadot.js Apps

![Intro diagram](/images/tokens/connect/polkadotjs/polkadotjs-banner.png)

## 概览 {: #introduction } 

[Moonbase Alpha测试网 v3升级发布后](https://moonbeam.network/announcements/moonbeam-network-upgrades-account-structure-to-match-ethereum/)，我们对Moonbeam底层账户系统进行了重大升级，使用以太坊式账户和私钥替换了默认的Substrate式账户和私钥。

同时，Polkadot.js App交互界面也进行了升级，现已原生支持H160地址和ECDSA密钥。本教程将带领大家了解Polkadot.js App网站与基于以太坊的账户整合。

## 连接至Moonbase Alpha {: #connecting-to-moonbase-alpha } 

首先，我们需要连接到Moonbase Alpha测试网。请点击左上角logo，在Test Network一栏中选择Moonbase Alpha。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-app-1.png)

成功切换后，Polkadot.js网站会连接到Moonbase Alpha，并相应地切换样式以便成功连接。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-app-2.png)

## 创建或导入H160账户 {: #creating-or-importing-an-h160-account } 

接下来是如何在Polkadot.js App创建新账户，或导入已有的MetaMask账户。首先，在“Account”一栏，点击“Add Account”按钮。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-app-3.png)

接着会弹出窗口，根据指示完成在Polkadot.js App界面新增账户的整个流程。请确保您在下拉菜单中将Mnemonic改为Raw seed，然后您就能通过私钥新增账户。

!!! 注意事项
    您目前只能通过私钥在Polkadot.js创建或导入账户。如果通过助记词操作，稍后导入账户到MetaMask等以太坊钱包时就会出现不同的公共地址。这是因为Polkadot.js使用的是BIP39，而以太坊使用的是BIP32或BIP44。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-app-4.png)

接下来，如果要创建新账户，您要确保已储存好弹窗所显示的私钥。如果要导入现有账户，请输入MetaMask导出的私钥。在本示例中，我们将导入以下账户：

- 私钥: `28194e8ddb4a2f2b110ee69eaba1ee1f35e88da2222b5a7d6e3afa14cf7a3347`
- 公共地址: `0x44236223aB4291b93EEd10E4B511B37a398DEE55` 

!!! 注意事项 
    由于通过私钥可直接获取资金，请不要向任何人透露您的私钥。本教程各步骤仅作演示用途。
    
请确保输入私钥前缀，如`0x`等。如果输入正确的信息，窗口左上角就会出现相应公共地址。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-app-5.png)

点击“Next”，设置账户名和密码后关闭设置向导的弹窗。收到确认消息后，您会在Accounts标签中看到相应地址和余额（在本示例中为Bob的地址）。除此之外，我们还可以覆盖MetaMask扩展，可以看到两个余额是相同的。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-app-6.png)

## 通过Substrate API发送交易 {: #sending-a-transaction-through-substrates-api } 

现在，我们将演示Moonbeam Unified Accounts方案。通过Substrate API使用Polkadot.js App来创建交易。请注意，我们使用的是以太坊式H160地址来和Substrate交互。为此，我们导入了另一个名为Charley的账户，该账户中有5枚`DEV`代币。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-app-7.png)

下一步，点击“send”按钮，随后会出现一个弹窗，指引您按照操作发送交易。设置发送地址和金额，在本示例中为5个DEV代币。一切就绪后，就可以点击“Make Transfer”按钮。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-app-8.png)

在使用密码进行交易签名后，交易将会被即刻执行。执行过程中，Polkadot.js右上角会显示一些消息。交易确认后，即可看到各个账户的最新余额。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-app-8.png)

这表明交易已完成！我们非常高兴Polkadot.js App能够支持H160账户。同时，我们相信这一升级将会大幅度改善Moonbeam Network的用户体验和以太坊兼容功能。

--8<-- 'text/disclaimers/third-party-content.md'