---
title: 在Polkadot.js Apps上创建账户
description: 遵循此教程快速学习如何使用Moonbeam的标准以太坊H160地址并使用Polkadot.js发送交易。
---

# 使用Polkadot.js Apps与Moonbeam交互

![Intro diagram](/images/tokens/connect/polkadotjs/polkadotjs-banner.png)

## 概览 {: #introduction }

作为波卡（Polkadot）平行链，Moonbeam使用[统一账户结构](/learn/features/unified-accounts/){target=_blank}允许您使用单个以太坊格式的地址就能与Substrate(Polkadot)功能和Moonbeam的EVM交互。这种统一的账户结构意味着您无需同时维护Substrate和以太坊账户，只需通过单个以太坊账户私钥即可完成与Moonbeam交互。

同时，Polkadot.js Apps交互界面也进行了升级，现已原生支持H160地址和ECDSA密钥。本教程将带领大家了解在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank}上这个基于以太坊账户的整合。

--8<-- 'text/disclaimers/third-party-content-intro.md'

!!! 注意事项
    Polkadot.js Apps正在逐步取消对存储在本地浏览器缓存中的帐户的支持。相反，建议您使用浏览器插件，例如[Talisman将您的帐户导入 Polkadot.js Apps](/tokens/connect/talisman){target=_blank}。

## 连接至Moonbase Alpha {: #connecting-to-moonbase-alpha }

当第一次启动[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank}时，您可能会或可能不会连接到所需的网络。您可以通过单击左上角的图标将所选网络更改为Moonbase Alpha TestNet，然后向下滚动到**Test Networks**部分，选择Moonbase Alpha，然后滚动回到顶部并点击**Switch**。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-1.png)

成功切换后，Polkadot.js网站会连接到Moonbase Alpha，并相应地切换样式以便成功连接。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-2.png)

## 创建或导入H160账户 {: #creating-or-importing-an-h160-account }

!!! 注意事项
    出于安全目的，建议您不要在浏览器中本地存储帐户。一种更安全的方法是使用浏览器插件，例如[Talisman将您的帐户导入Polkadot.js Apps](/tokens/connect/talisman){target=_blank}。

在本节中，您将了解如何创建新帐户或将现有的MetaMask帐户导入 Polkadot.js Apps。首先，有一个先决条件步骤。作为逐步停止支持本地存储在浏览器缓存中的帐户的过程的一部分，您需要在**Settings**选项卡中启用对帐户本地存储的支持。为此，请执行以下步骤：

1. 导航至**Settings**标签页
2. 在**in-browser account creation**标题下选择**Allow local in-browser account storage**
3. 点击**Save**

![Allow local in-browser account storage](/images/tokens/connect/polkadotjs/polkadotjs-3.png)

您现在可以返回[Polkadot.js Apps的帐户页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank}并继续执行后续步骤。

1. 导航至**Accounts**部分
2. 点击**Add account**按钮

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-4.png)

这将跳出弹窗，引导您根据指示完成在Polkadot.js Apps界面新增账户的整个流程。

1. 点击下拉菜单
2. 将**Mnemonic**改为**Private Key**，这将允许您通过私钥新增账户

!!! 注意事项
    目前，您只能通过私钥在Polkadot.js创建或导入账户。如果通过助记词操作，稍后导入账户到MetaMask等以太坊钱包时就会出现不同的公共地址。这是因为Polkadot.js使用的是BIP39，而以太坊使用的是BIP32或BIP44。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-5.png)

接下来，如果要创建新账户，您要确保已储存好弹窗所显示的私钥。如果要导入现有账户，请输入MetaMask导出的私钥。

!!! 注意事项
    由于私钥可直接获取资金，请勿向任何人透露您的私钥。本教程各步骤仅作演示用途。
    
请确保输入私钥前缀，如`0x`等。如果输入正确的信息，窗口左上角就会出现相应公共地址，然后点击**Next**。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-6.png)

要完成向导弹窗步骤，您可以设置一个账户名称和密码。收到确认消息后，您会在**Accounts**标签中看到相应地址和余额（在本示例中为Bob的地址）。除此之外，我们还可以覆盖MetaMask扩展，可以看到两个余额是相同的。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-7.png)

## 通过Substrate API发送交易 {: #sending-a-transaction-through-substrates-api }

现在，我们将演示Moonbeam的[统一账户](/learn/features/unified-accounts){target=_blank}的作用，通过Substrate API使用Polkadot.js Apps来创建交易。请注意，我们使用的是以太坊格式H160地址与Substrate交互。为此，您可以导入另一个账户。

接着，点击Bob的**send**按钮，这将跳出另一个向导弹窗，引导您完成发送交易的流程。

1. 设置**send to address**（接收方地址）
2. 输入发送的**amount**（数量），在本示例中为1个DEV Token
3. 一切就绪后，点击**Make Transfer**按钮

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-8.png)

随后，系统将提示您输入密码并签署和提交交易。交易确认后，您将看到每个账户的余额更新。

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-9.png)

这样就可以了！我们非常高兴Polkadot.js Apps能够支持H160账户。同时，我们相信这一升级将会大幅度改善Moonbeam Network的用户体验和以太坊兼容功能。

--8<-- 'text/disclaimers/third-party-content.md'