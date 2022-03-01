---
title: Truffle
description: 通过此教程学习如何配置Truffle将本地Moonbeam开发节点和Moonbase Alpha测试网作为网络用于测试和部署Solidity智能合约。
---

# Truffle

![Intro diagram](/images/builders/tools/eth-dev-env/truffle-banner.png)

## 概览 {: #introduction }

[Truffle](https://www.trufflesuite.com/truffle)是一个广泛使用的开发框架，用于编译、测试和部署Solidity智能合约。由于Moonbeam兼容以太坊，只需一些额外配置，您就可以如同在以太坊上开发一般，使用Truffle在Moonbeam上进行开发。

## 配置Truffle连接至Moonbeam {: #configure-truffle-to-connect-to-moonbeam }

您需要先全网安装Truffle：

```
npm install -g truffle
```

在您的`truffle-config.js`文档，为Moonbeam开发节点和Moonbase Alpha测试网新增网络配置：

```javascript
const HDWalletProvider = require('@truffle/hdwallet-provider');
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
        provider: () => {
          return new HDWalletProvider(
            privateKeyMoonbeam,
            '{{ networks.moonbeam.rpc_url }}'
          );
        },
        network_id: {{ networks.moonbeam.chain_id }}, // {{ networks.moonbeam.hex_chain_id }} in hex,
      }
      // Moonriver
      moonriver: {
        provider: () => {
          return new HDWalletProvider(
            privateKeyMoonriver,
            '{{ networks.moonriver.rpc_url }}'
          );
        },
        network_id: {{ networks.moonriver.chain_id }}, // {{ networks.moonriver.hex_chain_id }} in hex,
      }
      // Moonbase Alpha TestNet
      moonbase: {
        provider: () => {
          return new HDWalletProvider(
            privateKeyMoonbase,
            '{{ networks.moonbase.rpc_url }}'
          );
        },
        network_id: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex,
      },
      // Moonbeam Development Node
      dev: {
        provider: () => {
          return new HDWalletProvider(privateKeyDev, '{{ networks.development.rpc_url }}')
         },
        network_id: {{ networks.development.chain_id }}, // {{ networks.development.hex_chain_id }} in hex,
      },
   },
};
```

## 分步教程 {: #tutorial }

如果您想获得更加详细的分步教程，您可以查看在Moonbeam上使用[Truffle](/builders/interact/truffle/)进行开发的详细教程。

--8<-- 'text/disclaimers/third-party-content.md'
