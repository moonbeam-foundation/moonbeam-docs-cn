---
title: 通过Hyperlane进行跨链操作
description: 学习如何使用Hyperlane协议和API桥接资产以及将Moonbeam dApp连接到多个区块链上的资产和功能的其他方法。
---

# Hyperlane协议

![Hyperlane Moonbeam banner](/images/builders/interoperability/protocols/hyperlane/hyperlane-banner.png)

## 概览 {: #introduction }

[Hyperlane](https://hyperlane.xyz){target=_blank}是Web3的一个安全模块化的跨链通信协议，能够使dApp用户与任何资产或应用在任何互连的链上一键式交互。该协议支持通用资产传输以及自定义跨链通信。

Hyperlane使用一个称为[主权共识](https://docs.hyperlane.xyz/hyperlane-docs-1/protocol/security/sovereign-consensus){target=_blank}的方式，允许开发者通过配置该方式来跨链发送消息和验证消息。Hyperlane由验证人、中继器和瞭望塔（watchtowers）组成。验证人将监视并确认跨链消息。中继器支出gas，跨链发送消息。瞭望塔检查确保验证人是善意的参与者，从而保证协议的安全性。如需了解更多，请查看技术栈图及其他们的[协议文档](https://docs.hyperlane.xyz/hyperlane-docs-1/protocol/overview){target=_blank}。

![Hyperlane Technology Stack diagram](/images/builders/interoperability/protocols/hyperlane/hyperlane-1.png)

Hyperlane API为开发Web3应用提供了丰富的套件，确保开发者拥有构建所需的工具。借助这些工具和API，开发者可以使用Hyperlane协议及其API，来编写可以轻松部署在与所有Hyperlane连接的生态系统的dApp。

--8<-- 'text/disclaimers/third-party-content-intro.md'

## 开始操作 {: #getting-started }

开始使用Hyperlane构建跨链应用程序可能所需的资源：

- **[开发者文档](https://docs.hyperlane.xyz/hyperlane-docs-1/introduction/readme){target=_blank}** —— 技术性指南
- **[Hyperlane浏览器](https://explorer.hyperlane.xyz/){target=_blank}** —— 追踪跨链传递

## 合约 {: #contracts }

查看部署至Moonbeam的Hyperlane合约列表，以及通过Hyperlane连接至Moonbeam的网络。

- **主网合约** - [Moonbeam](https://docs.hyperlane.xyz/hyperlane-docs-1/developers-faq-and-troubleshooting/addresses#mainnet){target=_blank}

- **测试网合约** - [Moonbase Alpha](https://docs.hyperlane.xyz/hyperlane-docs-1/developers-faq-and-troubleshooting/addresses#testnet2){target=_blank}

--8<-- 'text/disclaimers/third-party-content.md'