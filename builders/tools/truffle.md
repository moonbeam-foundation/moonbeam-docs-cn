---
title: Truffle
description: 通过此教程学习如何配置Truffle将本地Moonbeam开发节点和Moonbase Alpha测试网作为网络用于测试和部署Solidity智能合约。
---

# Truffle

![Intro diagram](/images/integrations/integrations-truffle-banner.png)

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
// Moonbeam Development Node Private Key
const privateKeyDev =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
// Moonbase Alpha Private Key
const privateKeyMoonbase = "YOUR-PRIVATE-KEY-HERE";
// Moonriver Private Key - Note: This is for example purposes only. Never store your private keys in a JavaScript file.
const privateKeyMoonriver = "YOUR-PRIVATE-KEY-HERE";

module.exports = {
   networks: {
      // Moonbeam Development Node
      dev: {
        provider: () => {
          return new HDWalletProvider(privateKeyDev, 'http://localhost:9933/')
         },
        network_id: 1281,
      },
      // Moonbase Alpha TestNet
      moonbase: {
        provider: () => {
          return new HDWalletProvider(
            privateKeyMoonbase,
            'https://rpc.testnet.moonbeam.network'
          );
        },
        network_id: 1287,
      },
      // Moonriver
      moonriver: {
        provider: () => {
          return new HDWalletProvider(
            privateKeyMoonriver,
            'https://rpc.moonriver.moonbeam.network'
          );
        },
        network_id: 1285,
      }
   },
};
```


## 分步教程 {: #tutorial }

如果您想获得更加详细的分步教程，您可以查看在Moonbeam上使用[Truffle](/builders/interact/truffle/)进行开发的详细教程。

