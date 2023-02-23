---
title: MoonbeamAPI提供商和网络端点
description: 使用支持的API提供商连接至公共端点或创建私有JSON RPC和WSS端点至基于Moonbeam的网络。
---

# 网络端点

![API Providers banner](/images/builders/get-started/endpoints/endpoints-banner.png)

## 公共端点 {: #public-endpoints }

基于Moonbeam的网络有两种端点可供用户连接：一种是HTTPS，另一种是WSS。

在本文档中的端点仅供开发环境应用使用，而不为生产环境应用使用。

如果想要寻找适用于开发环境的API提供者，您可查看本教程的[端点提供者](#endpoint-providers)部分。

### Moonbeam {: #moonbeam }

--8<-- 'text/endpoints/moonbeam.md'

### Moonriver {: #moonriver }

--8<-- 'text/endpoints/moonriver.md'

### Moonbase Alpha {: #moonbase-alpha }

--8<-- 'text/endpoints/moonbase.md'

## 端点提供商 {: #endpoint-providers } 

您可以使用以下任意API提供商，创建适用于开发环境或生产环境的端点：

- [1RPC](#1rpc)
- [Blast](#blast)
- [OnFinality](#onfinality)
- [Pocket Network](#pokt)
- [UnitedBloc](#unitedbloc)
<!-- - [Ankr](#ankr) -->

### 1RPC {: #1rpc}

[1RPC](https://1rpc.io/){target=_blank}是一个免费私有RPC中继。它通过防止数据收集、用户跟踪和来自其他方的网络钓鱼尝试来保护用户隐私。它通过分布式中继将用户请求传送到其他 RPC 提供商，同时使用安全飞地技术防止跟踪用户元数据，例如 IP 地址、设备信息和钱包可链接性。

1RPC 是区块链基础设施社区的一项开放倡议。 他们的动机是共同的良好使命，即帮助构建更好的 Web3，并鼓励任何重视用户隐私的人加入这一开放协作。

请前往[1RPC](https://1rpc.io/){target=_blank}官方网站进行设置！

![1RPC](/images/builders/get-started/endpoints/endpoints-1.png)

### Blast {: #blast }

[Blast](https://blastapi.io/){target=_blank}平台的用户只需在用户友好型界面中通过简单的几个点击步骤，便能够获得免费的端点，以允许您与Moonbeam进行交互。

首先，导向至[Blast](https://blastapi.io/){target=_blank},，点击“Launch App"连接至您的钱包。连接成功后，您将能够创建一个项目并生成您的自定义端点。为此，您需要执行以下操作：

1. 创立项目
2. 点击**Available Endpoints**
3. 为您的端点选择一个网络。有三个选项可供选择：Moonbeam、Moonriver 和 Moonbase Alpha
4. 确认选择的网络并按**Activate**
5. 您将可以在**Active Endpoints**下看到您选择的网络。单击此网络，您将在下一页看到您的自定义RPC和WSS端点

![Bware Labs](/images/builders/get-started/endpoints/endpoints-2.png)

### GetBlock {: #getblock }

[GetBlock](https://getblock.io/){target=_blank}是一项提供对Moonbeam和Moonriver即时API访问的服务，可通过共享节点和专用节点使用。[专用节点](https://getblock.io/dedicated-nodes/){target=_blank}提供对私有服务器的访问，速度快且没有速率限制。[共享节点](https://getblock.io/nodes/){target=_blank}提供一个免费的基于API密钥的端点，让您快速上手。

要开始使用GetBlock并获取API密钥，您可以前往[GetBlock注册页面](https://account.getblock.io/sign-up){target=_blank}注册。从**GetBlock Dashboard**，您可以查看和管理您现有的API密钥并创建新的API密钥。

创建新的API密钥很简单，您只需：

1. 点击 **Create a new API key**
2. 为您的API密钥输入一个名称
3. 点击 **Create** 生成您的API密钥

![GetBlock](/images/builders/get-started/endpoints/endpoints-4.png)

### OnFinality {: #onfinality }

[OnFinality](https://onfinality.io/){target=_blank}为客户提供比免费公共端点更高速率限制和性能的基于API密钥的免费端点。您还会收到有关您的应用程序使用情况的深入分析。

要创建一个自定义OnFinality端点，首先导向至[OnFinality](https://onfinality.io/){target=_blank}并注册。如果您已注册可直接登录。在OnFinality的**Dashboard**，您可以执行以下操作：

1. 点击**API Service**
2. 在下拉菜单中选择网络
3. 您的自定义API端点将会自动生成

![OnFinality](/images/builders/get-started/endpoints/endpoints-5.png)

### Pocket Network {: #pokt }

[Pocket Network](https://pokt.network/){target=_blank}是一个去中心化的节点服务上，它为Moonbeam和Moonriver上的DApps提供免费的个人端点。

要获取您自己的端点，请前往[Pocket Network](https://mainnet.portal.pokt.network/#/){target=_blank} 并注册或登录。从 **Portal**，您可以：

1. 点击**Apps**
2. 选择**Create**
3. 输入你的DApp名称，选择你对应的网络
4. 您的新端点将生成并显示在以下应用程序屏幕中

![Pocket Network](/images/builders/get-started/endpoints/endpoints-6.png)

您不必为每个端点生成一个新的DApp！您可以将新链添加到您现有的DApp中：

1. 在 **Apps** 菜单中单击您预先存在的应用程序
2. 在 **Endpoint** 部分，选择 **Add new** 按钮并在下拉列表中搜索您想要的网络
3. 将为您生成并显示您的新端点

### UnitedBloc {: #unitedbloc }

[UnitedBloc](https://medium.com/@daniel_96988/unitedbloc-rpc-c84972f69457){target=_blank}是Moonbeam和Moonriver社区收集人的一个集合。它以为Moonbeam、Moonriver和Moonbase Alpha网络提供公用RPC服务的方式，为社区提供了价值。

这项公用端点服务由8个地理位置上分散分布的服务器来支持。这些服务器运用GeoDNS实现全球平衡，NGINX实现区域负载平衡。由于此项服务是公用的，用户不需要注册或管理API密钥。

这项提案的收集人包括：

 - Blockshard (CH)
 - BloClick (ES)
 - BrightlyStake (IN)
 - CertHum (US)
 - GPValidator (PT)
 - Hetavalidation (AU)
 - Legend (AE)
 - PathrockNetwork (DE)
 - Polkadotters (CZ)
 - SIK | crifferent.de (DE)
 - StakeBaby (GR)
 - StakeSquid (GE)
 - TrueStaking (US)

他们同时提供[Grafana dashboard](https://tinyurl.com/UnitedBloc-Dashboard){target=_blank}用以显示主要的数据度量。

请参照上面的[公共端点](#public-endpoints) 部分查询相关的URL。您还可以通过他们的[Telegram频道](https://t.me/+tRvy3z5-Kp1mMGMx){target=_blank}联系他们，或者在他们的[博客页面](https://medium.com/@daniel_96988/unitedbloc-rpc-c84972f69457){target=_blank}阅读他们详细的提案。

<!-- ### Ankr {: #ankr}

[Ankr](https://www.ankr.com/){target=_blank}支持15个不同区块链生态系统的免费公共RPC端点，并将继续扩展其他网络。 Ankr公共RPC层通过API端点为世界上的任何人提供快速可靠的RPC节点服务，以连接到包括Moonbeam在内的公共网络。

开始使用，请前往[Ankr协议](https://www.ankr.com/protocol/){target=_blank}的页面启动服务：

1. 点击**Public RPCs**
2. 选择[Moonbeam网络](https://www.ankr.com/protocol/public/moonbeam/){target=_blank}
3. 复制提供的节点URL即可以开始发出请求；无需注册或KYC

![Ankr](/images/builders/get-started/endpoints/endpoints-5.png) -->
