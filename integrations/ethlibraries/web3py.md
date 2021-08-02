---
title: Web3.py
description: 通过此教程学习如何使用以太坊Web3 JavaScript库在Moonbeam上部署Solidity智能合约。
---
# Web3.py Python库

![Intro diagram](/images/integrations/integrations-web3py-banner.png)

## 概览 {: #introduction } 

[Web3.py](https://web3py.readthedocs.io/)可供开发人员使用Python，并通过HTTP、IPC或WebSocker协议与以太坊节点交互的一组代码库。Moonbeam拥有与以太坊相似的API供用户使用，其和以太坊风格的JSON RPC调用完全兼容。因此，开发者可以利用这个兼容性特色来使用web3.py库与Moonbeam节点交互，就如同在使用以太坊时一样。

## 在Moonbeam上设置Web3.py {: #setup-web3py-with-moonbeam } 

在开始使用之前，请使用以下的指令安装web3.py库：

```
npm install web3
```

安装成功之后，请遵循以下指令来最快地开始使用该库以及其方法：

```py
from web3 import Web3

web3 = Web3(Web3.HTTPProvider('RPC_URL'))
```

您可以根据您希望连接的网络，将`RPC_URL`设置为以下的数值：

 - Moonbeam开发节点: `http://127.0.0.1:9933`
 - Moonbase Alpha测试网: `https://rpc.testnet.moonbeam.network`

## 分步教程 {: #step-by-step-tutorials } 

如果您想获得更加详细的分步教程，您可以查看我们关于如何通过web3.py在Moonbeam上[传送交易](/getting-started/local-node/send-transaction/)和[部署合约](/getting-started/local-node/deploy-contract/)所撰写的特定教程。

