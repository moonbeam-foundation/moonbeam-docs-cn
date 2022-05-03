---
title: MoonbeamAPI提供商和网络端点
description: 使用支持的API提供商连接至公共端点或创建私有JSON RPC和WSS端点至基于Moonbeam的网络。
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

- [Bware Labs](#bware-labs)
- [OnFinality](#onfinality)

### Bware Labs {: #bware-labs }

[Bware Labs](https://bwarelabs.com/)平台的用户只需在用户友好型界面中通过简单的几个点击步骤，便能够获得免费的端点，以允许您与Moonbeam进行交互。

首先，导向至[Bware Labs](https://app.bwarelabs.com/)，点击“Launch App"连接至您的钱包。连接成功后，您将能够生成您的自定义端点。为此，您需要执行以下操作：

1. 为您的端点选择网络。目前有三个选项：Moonbeam、Moonriver和Moonbase Alpha
2. 为您的端点设置名称
3. 在下拉菜单中选择网络
4. 点击**Create Endpoint**

![Bware Labs](/images/builders/get-started/endpoints/endpoints-1.png)

### OnFinality {: #onfinality }

[OnFinality](https://onfinality.io/)为客户提供比免费公共端点更高速率限制和性能的基于API密钥的免费端点。您还会收到有关您的应用程序使用情况的深入分析。

要创建一个自定义OnFinality端点，首先导向至[OnFinality](https://onfinality.io/)并注册。如果您已注册可直接登录。在OnFinality的**Dashboard**，您可以执行以下操作：

1. 点击**API Service**
2. 在下拉菜单中选择网络
3. 您的自定义API端点将会自动生成

![OnFinality](/images/builders/get-started/endpoints/endpoints-2.png)
