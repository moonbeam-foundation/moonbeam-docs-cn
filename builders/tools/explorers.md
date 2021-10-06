---
title: 区块浏览器
description: 目前在Moonbeam测试网上支持导航Substrate和以太坊层的区块浏览器。
---
# 区块浏览器

![Explorer Banner](/images/builders/tools/explorers/explorers-banner.png)

## 概览 {: #introduction } 

区块浏览器就如同区块链的搜寻引擎，可以让用户搜索像是余额、合约和交易等等的资讯。进阶版的区块浏览器还提供索引编辑的功能，让用户能够在网络中直接提供像是ERC20代币一样完整的一套信息，甚至还有可能提供API服务，可直接通过外部设备连接。

Moonbeam现在提供两种不同的浏览器：一个专为查询以太坊API，另一个为查询Substrate API。

!!! 注意事项
    如果您使用的是Brave Browser，但您并没有连接至您导向的Moonbeam Instance，请尝试将Brave Shield关闭。

## 以太坊API {: #ethereum-api } 

### Expedition（Dev节点 - 测试网）{: #expedition-dev-node-testnet } 

您可以通过[此链接](https://moonbeam-explorer.netlify.app/)找到一个Moonbeam主题的[Expedition](https://github.com/etclabscore/expedition)浏览器。

在默认设置中，浏览器已经连接至Moonbase Alpha测试网，然而，您可以通过以下步骤来进行设定：

 1. 点击右上角的齿轮图示
 2. 如果您有正在`{{ networks.development.rpc_url }} `上运行的节点（运行`--dev`标示的Moonbeam节点的默认RPC位置），请选取“Development”。或者您可切换回“Moonbase Alpha”
 3. 如果您先要连接至特定的RPC URL，请选取“Custom RPC“并输入URL。举例来说：`http://localhost:9937`  

![Expedition Explorer](/images/builders/tools/explorers/explorers-1.png)

### Blockscout（测试网 {: #blockscout-testnet } 

Blockscout提供对用户友好的界面，让用户能够检查并确认包含如Moonbeam的，在EVM区块链上的交易。让您能够搜寻交易、查看账户和余额，并确认智能合约。您可以在他们的[文件网站](https://docs.blockscout.com/)查看更多资讯。

如同主要的特色，Blockscout提供：

 - 开源开发，意味着所有的代码都对社群开源或是改进。您可以在[这里](https://github.com/blockscout/blockscout)找到代码。
 - 实时交易追踪
 - 智能合约互动
 - 支持ERC和ERC721代币，在友好型界面中列出所有能使用的代币合约
 - 带有GraphQL的功能齐全的API，用户可以通过网络界面直接测试API调用。

您可以在[这里](https://moonbase-blockscout.testnet.moonbeam.network/)找到针对Moonbase Alpha测试网运行的Blockscout instance。

![Blockscout Explorer](/images/builders/tools/explorers/explorers-2.png)

## Substrate API {: #substrate-api } 

### PolkadotJS（开发者节点 - 测试网 {: #polkadotjs-dev-node-testnet } 

Polkadot JS Apps使用WebSocket端点与网络交互。如果您想要连接至独立的Moonbeam节点，您可以跟随[此教程](/getting-started/local-node/setting-up-a-node/#connecting-polkadot-js-apps-to-a-local-moonbeam-node)中的步骤（默认的端口为`9944`）。

![Polkadot JS Local Node](/images/builders/tools/explorers/explorers-3.png)

如果您想要查看并交互Moonbase Alpha的substrate层，请点击[此连接](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/explorer)。这是导向测试网的Polkadot JS Apps。您可以在[此网页](/integrations/wallets/polkadotjs/)找到更多资讯。

![Polkadot JS Moonbase Alpha](/images/builders/tools/explorers/explorers-4.png)

### Subscan {: #subscan } 

Subscan为基于Sebstrate的链提供区块链浏览器的功能，它能够解析标准或定制的模块。举例而言，这个功能对展示关于Staking、Governance和EVM pallet（或是模块）非常有帮助。

同时，所有代码都是开源的，并且可以在[此链接](https://github.com/itering/subscan-essentials)找到。

![Subscan Moonbase Alpha](/images/builders/tools/explorers/explorers-5.png)