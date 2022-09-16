---
title: 在Polkadot.js Apps上创建账户
description: 遵循此教程快速学习如何使用Moonbeam的标准以太坊H160地址并使用Polkadot.js发送交易。
---

# 使用Polkadot.js Apps与Moonbeam交互

![Intro diagram](/images/tokens/connect/polkadotjs/polkadotjs-banner.png)

## 概览 {: #introduction }

Moonbase Alpha测试网[v3升级发布后](https://www.purestake.com/news/moonbeam-network-upgrades-account-structure-to-match-ethereum/)，我们对Moonbeam底层账户系统进行了重大升级，使用以太坊格式账户和私钥替换了默认的Substrate格式账户和私钥。

同时，Polkadot.js Apps交互界面也进行了升级，现已原生支持H160地址和ECDSA密钥。本教程将带领大家了解Polkadot.js Apps网站与基于以太坊的账户整合。

--8<-- 'text/disclaimers/third-party-content-intro.md'

## 连接至Moonbase Alpha {: #connecting-to-moonbase-alpha }

首先，您需要连接到Moonbase Alpha测试网。请点击左上角logo，在**Test Networks**一栏中选择Moonbase Alpha，并返回顶部点击**Switch**。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-1.png)

成功切换后，Polkadot.js网站会连接到Moonbase Alpha，并相应地切换样式以便成功连接。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-2.png)

## 创建或导入H160账户 {: #creating-or-importing-an-h160-account }

在此部分，您将学会如何创建一个新账户，或在Polkadot.js Apps导入现有的MetaMask账户。

1. 导向至账户部分

2. 点击**Add account**按钮

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-3.png)

这将跳出弹窗，引导您根据指示完成在Polkadot.js Apps界面新增账户的整个流程。

1. 点击下拉菜单

2. 将**Mnemonic**改为**Private Key**，这将允许您通过私钥新增账户

!!! 注意事项
    目前，您只能通过私钥在Polkadot.js创建或导入账户。如果通过助记词操作，稍后导入账户到MetaMask等以太坊钱包时就会出现不同的公共地址。这是因为Polkadot.js使用的是BIP39，而以太坊使用的是BIP32或BIP44。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-4.png)

接下来，如果要创建新账户，您要确保已储存好弹窗所显示的私钥。如果要导入现有账户，请输入MetaMask导出的私钥。

!!! 注意事项
    由于私钥可直接获取资金，请勿向任何人透露您的私钥。本教程各步骤仅作演示用途。
    
请确保输入私钥前缀，如`0x`等。如果输入正确的信息，窗口左上角就会出现相应公共地址，然后点击**Next**。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-5.png)

要完成向导弹窗步骤，您可以设置一个账户名称和密码。收到确认消息后，您会在**Accounts**标签中看到相应地址和余额（在本示例中为Bob的地址）。除此之外，我们还可以覆盖MetaMask扩展，可以看到两个余额是相同的。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-6.png)

## 通过Substrate API发送交易 {: #sending-a-transaction-through-substrates-api }

现在，我们将演示Moonbeam的[统一账户](/learn/features/unified-accounts){target=_blank}的作用，通过Substrate API使用Polkadot.js Apps来创建交易。请注意，我们使用的是以太坊格式H160地址与Substrate交互。为此，您可以导入另一个账户。

接着，点击Bob的**send**按钮，这将跳出另一个向导弹窗，引导您完成发送交易的流程。

1. 设置**send to address**（接收方地址）

2. 输入发送的**amount**（数量），在本示例中为1个DEV Token

3. 一切就绪后，点击**Make Transfer**按钮

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-7.png)

随后，系统将提示您输入密码并签署和提交交易。交易确认后，您将看到每个账户的余额更新。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-8.png)

这样就可以了！我们非常高兴Polkadot.js Apps能够支持H160账户。同时，我们相信这一升级将会大幅度改善Moonbeam Network的用户体验和以太坊兼容功能。

--8<-- 'text/disclaimers/third-party-content.md'