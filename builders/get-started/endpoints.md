---
title: 网络端点
description: 使用支持的API提供者连接至公共端点或创建自定义JSON RPC和WSS端点至基于Moonbeam的网络。
---

# 网络端点

![API Providers banner](/images/builders/get-started/endpoints/endpoints-banner.png)

## 公共端点

基于Moonbeam的网络有两种端点可供用户连接：一种是HTTPS，另一种是WSS。

在本文档中的端点仅供开发环境应用使用，而不为生产环境应用使用。

如果想要寻找适用于开发环境的API提供者，您可查看本教程的[端点提供者](#endpoint-providers)部分。

### Moonbase Alpha端点

--8<-- 'code/endpoints/moonbase.md'

### Moonriver端点

--8<-- 'code/endpoints/moonriver.md'

## 端点提供者

您可以使用以下任意API提供者，创建适用于开发环境或生产环境的端点：

- [Bware Labs](#bware-labs)
- [Elara](#elara)
- [OnFinality](#onfinality)

### Bware Labs

[Bware Labs](https://bwarelabs.com/)平台的用户只需在用户友好型界面中通过简单的几个点击步骤，将能够获得免费的端点，以允许您与Moonbeam进行交互。

首先，导向至[Bware Labs](https://app.bwarelabs.com/)，点击“Launch App"连接至您的钱包。连接成功后，您将能够生成您的自定义端点。为此，您需要执行以下操作：

1. 为您的端点选择网络。目前有两个选项：Moonbeam和Moonriver。如果您希望选择Moonbase Alpha TestNet，请选择Moonbeam。

2. 为端点设置名称

3. 在下拉菜单中选择网络

4. 点击**Create Endpoint**

![Bware Labs](/images/builders/get-started/endpoints/endpoints-1.png)

### Elara

[Elara](https://elara.patract.io/)为Moonriver开发者提供免费、即时和可扩展的区块链API访问服务。

首先，导向至[Elara](https://elara.patract.io/)，使用您的GitHub证书创建一个账户。登录后，在**Dashboard**展开**Kusama Eco-chains**菜单，选择**Moonriver**。随后，您将通过创建新的项目生成一个API端点。为此，您需要执行以下操作：

1. 点击**Create New Project**

2. 输入您的项目名称

3. 选择网络

4. 点击**Create**创建项目

![Elara](/images/builders/get-started/endpoints/endpoints-2.png)

### OnFinality

[OnFinality](https://onfinality.io/)为客户提供基于API密钥的免费端点，提供比免费公共端点更高的速率限制和性能。您还会收到有关您的应用程序使用情况的深入分析。

首先，导向至[OnFinality](https://onfinality.io/)并注册。如果您已注册可直接登录。在OnFinality的**Dashboard**，您可以执行以下操作：

1. 点击**API Service**

2. 在下拉菜单中选择网络

3. 您的自定义API端点将会自动生成

![OnFinality](/images/builders/get-started/endpoints/endpoints-3.png)
