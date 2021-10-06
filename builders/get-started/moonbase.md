---
title: Moonbase Alpha
description: Moonbeam测试网（Moonbase Alpha）是进入波卡（Polkadot）生态的首选入口。通过此教程学习如何连接至Moonbase Alpha测试网。
---

# 连接到Moonbeam测试网（Moonbase Alpha）

## 概览 {: #introduction }

Moonbase Alpha有两个端点可供用户连接：一个为HTTPS，另一个为WSS。

--8<-- 'text/testnet/connect.md'

## 区块链浏览器 {: #block-explorers }

您可以使用以下区块链浏览器来浏览Moonbase Alpha:

 - **基于Substrate API** — [Subscan](https://moonbase.subscan.io/)或[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/explorer)
 - **基于以太坊API JSON-RPC** — [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=MoonbaseAlpha)
 - **基于以太坊API和索引** — [Blockscout](https://moonbase-blockscout.testnet.moonbeam.network/)

## 连接MetaMask

如果您已经安装了MetaMask，您可以轻松地将MetaMask连接至Moonbase Alpha测试网：

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbase">连接MetaMask</a>
</div>



!!! 注意事项
    MetaMask将会跳出弹框，要求授权将Moonbase Alpha添加为自定义网络。经授权后，MetaMask会将您当前的网络切换到Moonbase Alpha。

如果您还没有安装MetaMask，请查看[使用MetaMask与Moonbeam交互](/tokens/connect/metamask/)指南。

您也可以使用以下网络信息连接MetaMask：

 - 网络名称： `Moonbase Alpha`
 - RPC URL: `{{ networks.moonbase.rpc_url }}`
 - ChainID: `{{ networks.moonbase.chain_id }}` (hex: `{{ networks.moonbase.hex_chain_id }}`)
 - 代币缩写（可选）： `DEV`
 - 区块链浏览器（可选）： `{{ networks.moonbase.block_explorer }}`

## 获得Token {: #get-tokens }

要开始在Moonbase Alpha上开发部署，您可以在我们的Discord频道的[水龙头](https://discord.gg/PfpUATX)处获得DEV Token。若想了解具体DEV数量，您可通过我们的社区渠道直接联系我们。

### Discord - Mission Control {: #discord-mission-control } 

为了让用户们可以自动获得Token，我们创建了一个Discord机器人（名为Mission Control:sunglasses:）。当您输入您的钱包地址，它会每24小时自动发送最多5个DEV Token至每个Discord用户的账户中。您可以在我们的[Discord频道](https://discord.gg/PfpUATX)中查看。

您可以在“Miscellaneous"一栏下面找到我们的Alphanet机器人频道。

![Discord1](/images/testnet/testnet-discord1.png)

如果您想要查询您的余额，请输入以下信息，并将`<enter-address-here->`替换为您的H160地址:

```
!balance <enter-address-here->
```

如果您想要获得DEV Token，请输入以下的信息，并将`<enter-address-here->`替换成您的H160地址：

```
!faucet send <enter-address-here->
```

Mission Control将会发送5个DEV Token到您的账户，并显示您当前的帐户余额。请注意，每个Discord用户每24小时仅能获得一次Mission Control发送的代币。

![Discord2](/images/testnet/testnet-discord2.png)

