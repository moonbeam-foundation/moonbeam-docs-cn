---
title: MoonbeamAPI提供商和网络端点
description: 使用支持的API提供商连接至公共端点或创建私有JSON-RPC和WSS端点至基于Moonbeam的网络。
---

# 网络端点

## 公共端点 {: #public-endpoints }

基于Moonbeam的网络有两种端点可供用户连接：一种是HTTPS，另一种是WSS。

在本文档中的端点仅供开发环境应用使用，而不为生产环境应用使用。

如果想要寻找适用于开发环境的API提供者，您可查看本教程的[端点提供者](#endpoint-providers)部分。

### Moonbeam {: #moonbeam }

--8<-- 'text/builders/get-started/endpoints/moonbeam.md'

### Moonriver {: #moonriver }

--8<-- 'text/builders/get-started/endpoints/moonriver.md'

### Moonbase Alpha {: #moonbase-alpha }

--8<-- 'text/builders/get-started/endpoints/moonbase.md'

## RPC端点提供商 {: #endpoint-providers }

您可以使用以下任意API提供商，创建适用于开发环境或生产环境的端点：

- [1RPC](#1rpc)
- [Blast](#blast)
- [Dwellir](#dwellir)
- [GetBlock](#getblock)
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

### Dwellir {: #dwellir }

[Dwellir](https://www.dwellir.com/){target=_blank}是一个区块链运行服务，确保全球可扩展性、低延迟特性以及99.99%正常运行的保证，为所有类型的业务提供快速且可值得信赖的节点运营。公共端点服务商全球化地分布于裸机服务器。由于服务为公开的，并不需要注册或是API私钥以进行管理。

要开始操作开发者端点或是专属端点，您可以通过以下方式联系我们：

1. 进入[Dwellir](https://www.dwellir.com/contact){target=_blank}页面
2. 提交您的**邮箱地址**和节点要求

![Dwellir](/images/builders/get-started/endpoints/endpoints-3.png)

### GetBlock {: #getblock }

[GetBlock](https://getblock.io/){target=_blank}是一项提供对Moonbeam和Moonriver即时API访问的服务，可通过共享节点和专用节点使用。[专用节点](https://getblock.io/dedicated-nodes/){target=_blank}提供对私有服务器的访问，速度快且没有速率限制。[共享节点](https://getblock.io/nodes/){target=_blank}提供一个免费的基于API密钥的端点，让您快速上手。

要开始使用GetBlock并获取API密钥，您可以前往[GetBlock注册页面](https://account.getblock.io/sign-up){target=_blank}注册。从**GetBlock Dashboard**，您可以查看和管理您现有的API密钥并创建新的API密钥。

创建新的API密钥很简单，您只需：

1. 点击 **Create a new API key**
2. 为您的API密钥输入一个名称
3. 点击 **Create** 生成您的API密钥

![GetBlock](/images/builders/get-started/endpoints/endpoints-4.png)

### OnFinality {: #onfinality }

[OnFinality](https://onfinality.io/){target=_blank} 为需要公用端点的客户提供了基于API密钥的免费端口。它也提供付费服务，与免费服务相比，付费节点拥有更高传输速率上限与更好的性能。您也会收到关于应用更详细的使用分析报告。

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

## 追踪RPC端点提供者 {: #tracing-providers }

追踪RPC端点允许您访问非标准RPC函数，如那些属于Geth的`debug`和`txpool` API以及属于OpenEthereum `trace`模块。要查看在Moonbeam上支持用于调试和追踪的非标准RPC函数，请查看[调试API和追踪模块](/builders/build/eth-api/debug-trace){target=_blank}教程。

以下提供者提供追踪RPC端点：

- [OnFinality](#onfinality-tracing)

### OnFinality {: #onfinality-tracing }

[OnFinality](https://onfinality.io/){target=_blank}的追踪API能够用于在Moonbeam和Moonriver上快速追踪和调试交易。但仅适用于那些在[成长和最终计划](https://onfinality.io/pricing){target=_blank}中的用户。

要使用追踪API，您可以从您的[私人RPC终端](#onfinality)选择中调用追踪函数。关于支持的网络和追踪函数，请查看[OnFinality追踪API的文档网站](https://documentation.onfinality.io/support/trace-api#TraceAPI-SupportedNetworks){target=_blank}。

请注意，如果您正在追踪历史区块，建议使用您自己的专用跟踪节点来回填任何数据，一旦追上区块，您可以切换到使用追踪API。您可以查看[如何在OnFinality上为Moonbeam部署追踪节点](https://onfinality.medium.com/how-to-deploy-a-trace-node-for-moonbeam-on-onfinality-85683181d290) {target=-_blank}教程，了解有关如何启动您自己的专用追踪节点的更多信息。
