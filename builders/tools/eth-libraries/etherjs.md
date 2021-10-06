---
title: Ethers.js
description: 通过此教程学习如何使用以太坊的EtherJS库在Moonbeam上部署Solidity智能合约。
---
# Ethers.js JavaScript 库

![Intro diagram](/images/builders/tools/eth-libraries/ethersjs-banner.png)

## 概览 {: #introduction } 

与web3.js库相似，[ethers.js](https://docs.ethers.io/)库提供一系列的工具，能够通过JavaScript与以太坊节点进行交互。Moonbeam拥有与以太坊相似的API供用户使用，其与以太坊风格的JSON RPC调用完全兼容。因此，开发者可以利用此兼容性来使用ethers.js库与Moonbeam节点交互，就如同在以太坊网络上一样。你可以通过此[文章](https://medium.com/l4-media/announcing-ethers-js-a-web3-alternative-6f134fdd06f3)了解更多关于ethers.js的资讯。

## 在Moonbeam上设置Ethers.js {: #setup-ethersjs-with-moonbeam } 

在开始使用之前，请使用以下指令安装ethers.js库：

```
npm install ethers
```

安装成功之后，请遵循以下指令来最快地开始使用该库以及其方法：

```js
const ethers = require('ethers');

// Variables definition
const privKey = '0xPRIVKEY';

// Define Provider
const provider = new ethers.providers.StaticJsonRpcProvider('RPC_URL', {
    chainId: ChainId,
    name: 'NETWORK_NAME'
});

// Create Wallet
let wallet = new ethers.Wallet(privKey, provider);
```

除此之外， `provider`和`wallet`内有不同的方法供用户使用。您可以根据您所希望连接的网络，将`RPC_URL`设置为以下的数值：

Moonbeam开发节点：

  - RPC_URL: `{{ networks.development.rpc_url }}`
  - ChainId: `{{ networks.development.chain_id }}` (hex: `{{ networks.development.hex_chain_id }}`)
  - NETWORK_NAME: `moonbeam-development`
 
Moonbase Alpha测试网：

  - RPC_URL: `{{ networks.moonbase.rpc_url }}`
  - ChainId: `{{ networks.moonbase.chain_id }}` (hex: `{{ networks.moonbase.hex_chain_id }}`)
  - NETWORK_NAME: `moonbase-alpha`

Moonriver:

  - RPC_URL: `{{ networks.moonriver.rpc_url }}`
  - ChainID: `{{ networks.moonriver.chain_id }}` (hex: `{{ networks.moonriver.hex_chain_id }}`)
  - NETWORK_NAME: `{{ networks.moonriver.chain_spec }}`

## 分步教程  {: #step-by-step-tutorials } 

如果您想获得更加详细的分步教程，您可以查看我们关于如何通过ethers.js在Moonbeam上[传送交易](/getting-started/local-node/send-transaction/)和[部署合约](/getting-started/local-node/deploy-contract/)所撰写的特定教程。
