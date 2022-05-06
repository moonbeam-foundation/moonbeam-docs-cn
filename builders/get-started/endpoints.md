---
title: 网络端点
description: 使用支持的API提供商连接至公共端点或创建自定义JSON RPC和WSS端点至基于Moonbeam的网络。
---

# 网络端点

![API Providers banner](/images/builders/get-started/endpoints/endpoints-banner.png)

## 公共端点 {: #public-endpoints }

Moonbase Alpha TestNet有可供开发使用的公共端点。对于Moonbeam或Moonriver，您需要从支持Moonbeam的[端点提供商](#endpoint-providers) 获取您自己的私有端点。

基于Moonbeam的网络有两种端点可供用户连接：一种是HTTPS，另一种是WSS。

### HTTPS {: #https }

--8<-- 'code/endpoints/moonbase-https.md'

### WSS {: #wss }

--8<-- 'code/endpoints/moonbase-wss.md'

### 中继链 {: #relay-chain }

--8<-- 'text/testnet/relay-chain.md'

## 端点提供商 {: #endpoint-providers } 

您可以使用以下任意API提供商，创建适用于开发环境或生产环境的端点：

- [Blast](#blast)
- [OnFinality](#onfinality)

### Blast {: #blast }

[Blast](https://blastapi.io/){target=_blank}平台的用户只需在用户友好型界面中通过简单的几个点击步骤，便能够获得免费的端点，以允许您与Moonbeam进行交互。

首先，导向至[Blast](https://blastapi.io/){target=_blank},，点击“Launch App"连接至您的钱包。连接成功后，您将能够创建一个项目并生成您的自定义端点。为此，您需要执行以下操作：

1. 创立项目
2. 点击**可用端点**
3. 为您的端点选择一个网络。有三个选项可供选择：Moonbeam、Moonriver 和 Moonbase Alpha
4. 确认选择的网络并按**Activate**
5. 您将可以在**Active Endpoints**下看到您选择的网络。单击此网络，您将在下一页看到您的自定义RPC和WSS端点

![Bware Labs](/images/builders/get-started/endpoints/endpoints-1.png)

### OnFinality {: #onfinality }

[OnFinality](https://onfinality.io/){target=_blank}为客户提供比免费公共端点更高速率限制和性能的基于API密钥的免费端点。您还会收到有关您的应用程序使用情况的深入分析。

要创建一个自定义OnFinality端点，首先导向至[OnFinality](https://onfinality.io/){target=_blank}并注册。如果您已注册可直接登录。在OnFinality的**Dashboard**，您可以执行以下操作：

1. 点击**API Service**
2. 在下拉菜单中选择网络
3. 您的自定义API端点将会自动生成

![OnFinality](/images/builders/get-started/endpoints/endpoints-2.png)
