---
title: Web3.js
description: 通过本教程学习如何使用以太坊Web3 JavaScript库在Moonbeam上部署Solidity智能合约。
---
# Web3.js JavaScript库

![Intro diagram](/images/builders/build/eth-api/libraries/web3js/web3js-banner.png)

## 概览 {: #introduction } 

[Web3.js](https://web3js.readthedocs.io/)可供开发人员使用JavaScript，并通过HTTP、IPC或WebSocker协议与以太坊节点交互的一组代码库。Moonbeam拥有与以太坊相似的API供用户使用，其和以太坊风格的JSON RPC调用完全兼容。因此，开发者可以利用这个兼容性来使用web3.js库与Moonbeam节点交互，就如同在使用以太坊时一样。

## 在Moonbeam上设置Web3.js {: #setup-web3js-with-moonbeam } 

在开始使用之前，请使用以下指令来安装web3.js库：

```
npm install web3
```

安装完成后，请遵循以下指令来最快地开始使用该库以及其方法：

```js
const Web3 = require('web3');

//Create web3 instance
const web3 = new Web3('RPC_URL');
```

您可以根据您希望连接的网络，将`RPC_URL`设置为以下的数值：

=== "Moonbeam"
    ```
    {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.rpc_url }}
    ```

=== "Moonbeam开发节点"
    ```
    {{ networks.development.rpc_url }}
    ```

## 分步教程 {: #step-by-step-tutorials } 

如果您想获得更加详细的分步教程，您可以查看我们关于如何通过web3.js在Moonbeam上[传送交易](/getting-started/local-node/send-transaction/)和[部署合约](/getting-started/local-node/deploy-contract/)所撰写的特定教程。

--8<-- 'text/disclaimers/third-party-content.md'