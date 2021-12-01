---
title: API提供者
description: 使用支持的API提供者通过JSON RPC和WSS端口连接至基于Moonbeam的网络。
---

# API提供者

![API Providers banner](/images/builders/get-started/api-providers/api-providers-banner.png)

## PureStake开发端口

基于Moonbeam的网络有两种端口可供用户连接：一种是HTTPS，另一种是WSS。两种端口均由PureStake提供，仅供开发环境应用使用，而**不为**生产环境应用使用。

### Moonbase Alpha

=== "HTTPS RPC"
    ```
    https://rpc.testnet.moonbeam.network
    ```

=== "WSS"
    ```
    wss://wss.testnet.moonbeam.network
    ```

想要连接至由PureStake提供的Moonbase Alpha中继链，您可以使用以下WSS端口：

```
wss://wss-relay.testnet.moonbeam.network
```

### Moonriver

=== "HTTPS RPC"
    ```
    https://rpc.moonriver.moonbeam.network
    ```

=== "WSS"
    ```
    wss://wss.moonriver.moonbeam.network
    ```

## 生产端口

以下提供者适合在Moonbeam上生产使用：

- [Bware Labs](https://bwarelabs.com/)
- [OnFinality](https://onfinality.io/)

如果想要快速开始，您可以使用其中一个[公共端口](#public-endpoints)，或者为每个项目创建[自定义端口](#custom-endpoints)。

### 公共端口

#### Moonbase Alpha

以下HTTPS RPC端口可供使用：

=== "OnFinality"
    ```
    https://moonbeam-alpha.api.onfinality.io/public
    ```

以下WSS端口可供使用：

=== "OnFinality"
    ```
    wss://moonbeam-alpha.api.onfinality.io/public-ws
    ```

#### Moonriver

以下HTTPS RPC端口可供使用：

=== "OnFinality"
    ```
    https://moonriver.api.onfinality.io/public
    ```

以下WSS端口可供使用：

=== "OnFinality"
    ```
    wss://moonriver.api.onfinality.io/public-ws
    ```

### 自定义端口

#### Bware Labs

Bware Labs平台的用户只需在用户友好型界面中通过简单的几个点击步骤，将能够获得免费的端口，以允许您与Moonbeam进行交互。

首先，导向至[Bware Labs](https://app.bwarelabs.com/)，点击“Launch App"连接至您的钱包。连接成功后，您将能够生成您的自定义端口。为此，您需要执行以下操作：

1. 为您的端口选择网络。目前有两个选项：Moonbeam和Moonriver。如果您想要选择Moonbase Alpha TestNet，请选择Moonbeam。

2. 为端口设置名称

3. 在下拉菜单中选择网络

4. 点击**Create Endpoint**

![Bware Labs](/images/builders/get-started/endpoints/endpoints-1.png)

#### OnFinality

OnFinality为客户提供基于API密钥的免费端口，提供比免费公共端口更高的速率限制和性能。您还会收到有关您的应用程序使用情况的深入分析。

首先，导向至[OnFinality](https://onfinality.io/)并注册。如果您已注册可直接登录。在OnFinality的**Dashboard**，您可以执行以下操作：

1. 点击**API Service**

2. 在下拉菜单中选择网络

3. 您的自定义API端口将会自动生成

![OnFinality](/images/builders/get-started/endpoints/endpoints-2.png)
