---
title: Bobabase
description: Bobabase是Boba Layer 2部署在Moonbeam上的官方测试网。遵循此教程连接Bobabase。
---

# 开始操作Bobabase

![Bobabase Banner](/images/builders/get-started/networks/bobabase/bobabase-banner.png)

## 概览 {: #introduction }

[Boba](https://boba.network/){target=_blank}是一个以计算为中心的Layer 2 (L2)，构建在基于[Optimism](https://www.optimism.io/){target=_blank}开发的Optimistic Rollup（链下计算层）之上。Boba通过[Turing Hybrid Compute](https://docs.boba.network/turing/turing){target=_blank}等多种功能增强了兼容EVM区块链的计算能力。上线以太坊之后，Boba将其Layer 2扩展解决方案带入Moonbeam。Bobabase是Boba部署在Moonbase Alpha的测试网名称。Bobabeam是Boba部署在Moonbeam的主网名称，尚未上线。

## 网络端点 {: #network-endpoints }

--8<-- 'text/endpoints/bobabase.md'

## 快速开始 {: #quick-start }

在Bobabase上构建非常简单。如果您使用的是Web3.js库，您可以创建一个本地Web3实例并设置将提供商连接至Bobabase（支持HTTP和WS）：

```js
const Web3 = require('web3'); // Load Web3 library

// Create local Web3 instance - set Bobabase as provider
const web3 = new Web3('{{ networks.bobabase.rpc_url }}');
```

如果您使用的是Ethers.js库，使用`ethers.providers.StaticJsonRpcProvider(providerURL, {object})`定义提供商，并将提供商的URL设置为Bobabase：

```js
const ethers = require('ethers'); // Load Ethers library

const providerURL = '{{ networks.bobabase.rpc_url }}';

// Define provider
const provider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
    chainId: {{ networks.bobabase.chain_id }},
    name: 'bobabase'
});
```

更过关于Ethers.js和Web3.js详细的教程，请前往[Ethereum API Libraries](/builders/build/eth-api/libraries/){target=_blank}。任何以太坊钱包都可以为Bobabase生成一个有效地址（例如：[MetaMask](https://metamask.io/){target=_blank}）

## Chain ID {: #chain-id } 

Bobabase的chain ID为 `{{ networks.bobabase.chain_id }}`，即hex为`{{ networks.bobabase.hex_chain_id }}`。

## 区块浏览器 {: #block-explorer }

Bobabase区块浏览器是一个[Blockscout的实例]({{ networks.bobabase.block_explorer }}){target=_blank}。


## 连接MetaMask  {: #connect-metamask }

如果您已安装MetaMask，您可轻松将MetaMask连接至Bobabase：

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="bobabase">连接MetaMask</a>
</div>

!!! 注意事项
    MetaMask会弹出窗口，请求允许将Bobabase添加为自定义网络。一旦您批准授权，MetaMask将会把您当前的网络切换至Bobabase。

如果您尚未安装MetaMask，请遵循[使用MetaMask与Moonbeam交互](/tokens/connect/metamask/){target=_blank}的教程开始操作。

## 通过Faucet获取Token {: #get-tokens-with-the-faucet }

TestNet BOBA通过[Bobabase Gateway]({{ networks.bobabase.gateway }}){target=_blank}上推文认证的水龙头发放，Bobabase Gateway类似于[apps.moonbeam.network](https://apps.moonbeam.network/){target=_blank}，是Boba Layer 2活动的一个地方。Bobabase允许以DEV或TestNet BOBA支付费用，您可以在右上角下拉菜单处进行设置。

要获取一些TestNet BOBA，请执行以下步骤：

1. 前往[Bobabase Gateway]({{ networks.bobabase.gateway }}){target=_blank}

2. 确保您已选择[BobaBase network](#connect-metamask)，点击**Connect**以连接至您的MetaMask钱包

3. 点击**Tweet Now**，发送公开推文

4. 复制推文链接并粘贴至文本框中

5. 点击**Authenticated Faucet**并根据MetaMask跳出的弹窗签署交易

![Bobabase Faucet](/images/builders/get-started/networks/bobabase/bobabase-1.png)

如果您没有Twitter账号，您可以通过[Discord](https://discord.gg/PfpUATX){target=_blank}联系我们获取TestNet BOBA。

## 从Moonbase Alpha桥接至Bobabase {: #bridge-from-moonbase-alpha-to-bobabase }

[Bobabase Gateway]({{ networks.bobabase.gateway }}){target=_blank}能够让你从Bobabase桥接各种资产或桥接各种资产到Bobabase。要从Moonbase Alpha桥接资产至Bobabase，请执行以下步骤：

1. 前往[Bobabase Gateway]({{ networks.bobabase.gateway }}){target=_blank}并点击**Connect**

2. 点击左上角的**Moonbase Wallet**

3. 在您想要桥接的资产旁边，点击**Bridge to L2**

4. 输入您想要桥接的数量，点击**Bridge**

5. 在MetaMask确认交易

6. 您的资产将快速到达Bobabase供您使用。确认资产是否到账，点击左上角的**Boba Wallet**或在[Bobabase浏览器]({{ networks.bobabase.block_explorer }}){target=_blank}查找您的账号

![Bridge to Bobabase](/images/builders/get-started/networks/bobabase/bobabase-2.png)

## 从Bobabase桥接至Moonbase Alpha {: #bridge-from-bobabase-to-moonbase-alpha }

[Bobabase Gateway]({{ networks.bobabase.gateway }}){target=_blank}能够让你从Bobabase桥接各种资产或桥接各种资产到Bobabase。请注意，将资产从Layer2桥接回Moonbase Alpha时，会有{{ networks.bobabase.exit_delay_period_days }}天的延迟期，随后您的资产可在Moonbase Alpha上使用。此延迟期是Optimistic Rollup（链下计算层）架构的固有安全特性，仅适用于从Layer 2桥接回Layer 2时发生。要从Bobabase桥接资产至Moonbase Alpha，请执行以下步骤：

1. 前往[Bobabase Gateway]({{ networks.bobabase.gateway }}){target=_blank}并点击**Connect**

2. 点击左上角的**Moonbase Wallet**

3. 在您想要桥接的资产旁边，点击**Bridge to L1**

4. 输入您想要桥接的数量，点击**Bridge**

5. 在MetaMask确认交易

6. 您的资产将在{{ networks.bobabase.exit_delay_period_days }}天后可在Moonbase Alpha上使用。请注意，您无需手动领取，Boba或自动为您处理此步骤

![Bridge to Bobabase](/images/builders/get-started/networks/bobabase/bobabase-3.png)

## 转换您的Gas代币 {: #changing-your-gas-fee-token }

DEV或BOBA都可用于为Bobabase上的交易支付gas。如果你想使用DEV作为gas代币，您必须至少有0.5个DEV桥接到Bobabase。请参阅[从Moonbase Alpha到 Bobabase的跨链](#bridge-from-moonbase-alpha-to-bobabase)，了解如何将DEV或BOBA侨界到Bobabase。默认情况下，选定的Gas费代币设置为BOBA。要将其更改为DEV，请执行以下步骤：

1. 按右上角的**Fee**下拉菜单
2. 点击**DEV**或**BOBA**选择新的gas费代币
3. 在MetaMask中确认交易

![Change gas fee token](/images/builders/get-started/networks/bobabase/bobabase-4.png)