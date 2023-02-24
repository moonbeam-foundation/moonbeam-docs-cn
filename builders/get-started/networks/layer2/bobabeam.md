---
title: Bobabeam
description: Bobabeam是一个部署在Moonbeam上以计算机为中心的Optimistic Layer 2 (L2)。遵循此教程连接Bobabeam。
---

# 开始操作Bobabeam

![Bobabeam Banner](/images/builders/get-started/networks/bobabeam/bobabeam-banner.png)

## 概览 {: #introduction }

[Boba](https://boba.network/){target=_blank}是一个以计算为中心的Layer 2 (L2)，构建在基于[Optimism](https://www.optimism.io/){target=_blank}开发的Optimistic Rollup（链下计算层）之上。Boba通过[Turing Hybrid Compute](https://docs.boba.network/hybrid_compute){target=_blank}等多种功能增强了兼容EVM区块链的计算能力。上线以太坊之后，Boba将其Layer 2扩展解决方案带入Moonbeam。[Bobabase](/builders/get-started/networks/layer2/bobabase){target=_blank}是Boba部署在Moonbeam的测试网名称。Bobabeam是Boba部署在Moonbeam的主网名称。

--8<-- 'text/disclaimers/third-party-content-intro.md'

## 网络端点 {: #network-endpoints }

--8<-- 'text/endpoints/bobabeam.md'

## 快速开始 {: #quick-start }

在Bobabeam上构建非常简单。如果您使用的是Web3.js库，您可以创建一个本地Web3实例并设置将提供商连接至Bobabeam（支持HTTP和WS）：

```js
const Web3 = require('web3'); // Load Web3 library

// Create local Web3 instance - set Bobabeam as provider
const web3 = new Web3('{{ networks.bobabeam.rpc_url }}');
```

如果您使用的是Ethers.js库，使用`ethers.JsonRpcProvider(providerURL, {object})`定义提供商，并将提供商的URL设置为Bobabeam：

```js
const ethers = require('ethers'); // Load Ethers library

const providerURL = '{{ networks.bobabeam.rpc_url }}';

// Define provider
const provider = new ethers.JsonRpcProvider(providerURL, {
    chainId: {{ networks.bobabeam.chain_id }},
    name: 'bobabeam'
});
```

更过关于Ethers.js和Web3.js详细的教程，请前往[Ethereum API Libraries](/builders/build/eth-api/libraries/){target=_blank}。任何以太坊钱包都可以为Bobabeam生成一个有效地址（例如：[MetaMask](https://metamask.io/){target=_blank}）。

## Chain ID {: #chain-id } 

Bobabeam的chain ID为`{{ networks.bobabeam.chain_id }}`，即hex为`{{ networks.bobabeam.hex_chain_id }}`。

## 区块浏览器 {: #block-explorer}

Bobabeam区块浏览器是一个[Blockscout的实例]({{ networks.bobabeam.block_explorer }}){target=_blank}。

## 连接MetaMask {: #connect-metamask }

如果您已安装MetaMask，您可轻松将MetaMask连接至Bobabeam：

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="bobabeam">连接MetaMask</a>
</div>

!!! 注意事项
    MetaMask会弹出窗口，请求允许将Bobabeam添加为自定义网络。批准授权后，MetaMask将会把您当前的网络切换至Bobabeam。

如果您尚未安装MetaMask，请遵循[使用MetaMask与Moonbeam交互](/tokens/connect/metamask/){target=_blank}的教程开始操作。

## 从Moonbeam桥接至Bobabeam {: #bridge-from-moonbeam-to-bobabeam }

[Bobabeam Gateway]({{ networks.bobabeam.gateway }}){target=_blank}能够让你从Bobabeam桥接各种资产或桥接各种资产到Bobabeam。要从Moonbeam桥接资产至Bobabeam，请执行以下步骤：

1. 前往[Bobabeam Gateway]({{ networks.bobabeam.gateway }}){target=_blank}并点击**Connect**
2. 点击左上角的**Moonbase Wallet**
3. 在您想要桥接的资产旁边，点击**Bridge to L2**
4. 输入您想要桥接的数量，点击**Bridge**
5. 在MetaMask确认交易
6. 您的资产将快速到达Bobabeam供您使用。确认资产是否到账，点击左上角的**Boba Wallet**或在[Bobabeam浏览器]({{ networks.bobabeam.block_explorer }}){target=_blank}查找您的账号

![Bridge to Bobabeam](/images/builders/get-started/networks/bobabeam/bobabeam-1.png)

开始在Bobabeam交易之前，您需要至少拥有1个BOBA。您可通过点击**Emergency Swap**并在MetaMask签署生成的签名请求来快速执行低gas费的GLMR和BOBA之间的swap。更多关于Bobabeam上支付的gas费用，请参考[更换Gas费Token](#changing-your-gas-fee-token).

## 从Bobabeam桥接至Moonbeam {: #bridge-from-bobabeam-to-moonbeam }

[Bobabeam Gateway]({{ networks.bobabeam.gateway }}){target=_blank}能够让你从Bobabeam桥接各种资产或桥接各种资产到Bobabeam。请注意，将资产从Bobabeam桥接回Moonbeam时，会有{{ networks.bobabeam.exit_delay_period_days }}天的延迟期，随后您的资产可在Moonbeam上使用。此延迟期是Optimistic Rollup（链下计算层）架构的固有安全特性，仅会从Bobabeam桥接回Moonbeam时发生。从Bobabeam桥接资产至Moonbeam时需要10 BOBA的费用，因此确保在发起转账之前有足够的BOBA余额。要从Bobabeam桥接资产至Moonbeam，请执行以下步骤：

1. 前往[Bobabeam Gateway]({{ networks.bobabeam.gateway }}){target=_blank}并点击**Connect**
2. 点击左上角的**Boba Wallet**
3. 在您想要桥接的资产旁边，点击**Bridge to L1**
4. 输入您想要桥接的数量，点击**Bridge**
5. 在MetaMask确认交易
6. 您的资产将在{{ networks.bobabeam.exit_delay_period_days }}天后可在Moonbeam上使用。请注意，您无需手动领取，Boba会自动为您处理此步骤

![Bridge to Moonbeam](/images/builders/get-started/networks/bobabeam/bobabeam-2.png)

## 更换Gas费Token {: #changing-your-gas-fee-token }

在Bobabeam上可以使用GLMR或BOBA来支付交易gas费。请注意，无论您使用GLMR或BOBA，您用于支付gas费的Token必须在Bobabeam网络上。参考[从Moonbeam桥接资产至Bobabeam](#bridge-from-moonbeam-to-bobabeam)学习如何将GLMR或BOBA桥接至Bobabeam。默认情况下，选定支付gas费的Token设置为BOBA。要更换成GLMR，请执行以下步骤：

1. 点击右上角的**Fee**下拉菜单
2. 点击**GLMR**或**BOBA**作为支付gas费的Token
3. 在MetaMask确认交易

![Change gas fee token](/images/builders/get-started/networks/bobabeam/bobabeam-3.png)

--8<-- 'text/disclaimers/third-party-content.md'