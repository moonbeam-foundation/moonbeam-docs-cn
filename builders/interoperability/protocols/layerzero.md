---
title: 通过LayerZero进行跨链操作
description: 了解用于跨链资产转移的GMP协议LayerZero，以及如何在Moonbeam上使用LayerZero开始构建跨链应用程序。
---

# LayerZero协议

## 概览 {: #introduction }

[LayerZero](https://layerzero.network/){target=\_blank}为Web3提供安全的全链（Omnichain）互操作性。LayerZero依赖于Oracle（预言机）和Relayer（中继器）两方在链与链之间提供安全消息传输。LayerZero的基础设施使dApp用户能够通过一键操作与任何连接链上的任何资产或应用程序进行交互。

LayerZero是一个传输层，能够通过低级通信原语实现资产传输。使用LayerZero的DApp被称为用户应用程序，其消息由中继器跨链中继，并由预言机的区块头在目标链上进行验证。请查看下方技术栈图及其[概念文档](https://layerzero.gitbook.io/docs/faq/messaging-properties){target=\_blank}以获取更多信息。

![LayerZero Technology Stack diagram](/images/builders/interoperability/protocols/layerzero/layerzero-1.png)

LayerZero API为开发Web3应用提供了丰富的套件，确保开发者拥有构建所需的工具。借助这些工具和API，开发者可以使用LayerZero协议及其API，来编写可以轻松部署在与所有LayerZero连接的生态系统的dApp。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 开始操作 {: #getting-started }

开始使用LayerZero构建跨链应用程序可能所需的资源：

- **[开发者文档](https://layerzero.gitbook.io/docs/){target=\_blank}** - 技术性指南
- **[Stargate](https://stargate.finance/){target=\_blank}** - 使用LayerZero的桥接UI，由Stargate团队构建

## 合约 {: #contracts }

查看部署至Moonbeam的LayerZero合约列表，以及通过LayerZero连接至Moonbeam的网络。

- **主网合约** - [Moonbeam](https://layerzero.gitbook.io/docs/technical-reference/mainnet/supported-chain-ids#moonbeam){target=\_blank}
- **测试网合约** - [Moonbase Alpha](https://layerzero.gitbook.io/docs/technical-reference/testnet/testnet-addresses#moonbeam-testnet){target=\_blank}

--8<-- 'text/_disclaimers/third-party-content.md'
