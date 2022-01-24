---
title: Hardhat
description: 通过此教程学习如何配置Hardhat将本地Moonbeam开发节点和Moonbase Alpha测试网作为网络用于测试和部署Solidity智能合约。
---

# Hardhat

![Hardhat Create Project](/images/builders/interact/hardhat/hardhat-banner.png)

## 概览 {: #introduction }

[Hardhat](https://hardhat.org/)是一个广泛使用的开发框架，用于编译、测试和部署Solidity智能合约。由于Moonbeam兼容以太坊，只需一些额外配置，您就可以如同在以太坊上开发一般，使用Hardhat在Moonbeam上进行开发。

## 配置Hardhat连接至Moonbeam {: #configure-hardhat-to-connect-to-moonbeam }

开始配置Hardhat，首先需确保您有一个npm项目。若还未准备，请运行以下代码创建：

```
npm init
```

当您完成npm项目创建后，安装Hardhat：

```
npm install hardhat
```

然后，在您的项目中创建Hardhat配置文档，运行以下代码：

```
npx hardhat
```

在您的`hardhat.config.js`文档中，为Moonbeam开发节点和Moonbase Alpha测试网新增网络配置：

```javascript
// Moonbeam Private Key - Note: This is for example purposes only. Never store your private keys in a JavaScript file.
const privateKeyMoonbeam = "YOUR-PRIVATE-KEY-HERE";
// Moonriver Private Key - Note: This is for example purposes only. Never store your private keys in a JavaScript file.
const privateKeyMoonriver = "YOUR-PRIVATE-KEY-HERE";
// Moonbase Alpha Private Key
const privateKeyMoonbase = "YOUR-PRIVATE-KEY-HERE";
// Moonbeam Development Node Private Key
const privateKeyDev = '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';

module.exports = {
   networks: {
      // Moonbeam
      moonbeam: {
        url: '{{ networks.moonbeam.rpc_url }}',
        chainId: {{ networks.moonbeam.chain_id }},  // {{ networks.moonbeam.hex_chain_id }} in hex,
        accounts: [privateKeyMoonbeam]
      },
      // Moonriver
      moonriver: {
        url: '{{ networks.moonriver.rpc_url }}',
        chainId: {{ networks.moonriver.chain_id }},  // {{ networks.moonriver.hex_chain_id }} in hex,
        accounts: [privateKeyMoonriver]
      },
      // Moonbase Alpha TestNet
      moonbase: {
        url: '{{ networks.moonbase.rpc_url }}',
        chainId: {{ networks.moonbase.chain_id }},  // {{ networks.moonbase.hex_chain_id }} in hex,
        accounts: [privateKeyMoonbase]
      },
      // Moonbeam Development Node
      dev: {
        url: '{{ networks.development.rpc_url }}',
        chainId: {{ networks.development.chain_id }},  // {{ networks.development.hex_chain_id }} in hex,
        accounts: [privateKeyDev]
      },
   },
};
```

## 分步教程 {: #tutorial }

如果您想获得更加详细的分步教程，您可以查看在Moonbeam上使用[Hardhat](/builders/interact/hardhat/)进行开发的详细教程。  