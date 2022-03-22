---
title: Moonriver
description: 学习如何通过RPC和WSS端点连接到Moonriver（Moonbeam在Kusama上的部署）
---

# Moonriver快速上手

--8<-- 'text/moonriver/connect.md'

## 区块链浏览器 {: #block-explorers }

您可以使用以下区块链浏览器来浏览Moonriver:

 - **以太坊API(类似Etherscan)** — [Moonscan](https://moonriver.moonscan.io/){target=_blank}
 - **基于以太坊API和索引** — [Blockscout](https://blockscout.moonriver.moonbeam.network/){target=_blank}
 - **基于以太坊API JSON-RPC** — [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=Moonriver){target=_blank}
 - **基于Substrate API** — [Subscan](https://moonriver.subscan.io/)或[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonriver.moonbeam.network#/explorer){target=_blank}

 更多相关信息请参考[区块浏览器](/builders/tools/explorers){target=_blank}文档。

## 连接到MetaMask {: #connect-metamask }

如果您已经安装了MetaMask，您可以轻松地将MetaMask连接到Moonriver：

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonriver">连接MetaMask</a>
</div>
!!! 注意事项
    MetaMask会弹出窗口，请求允许将Moonriver添加为自定义网络。一旦您批准授权，MetaMask将会把您当前的网络切换到Moonriver。

如果您还没有安装MetaMask，并想查看相关指南，请查阅[如何使用MetaMask与Moonbeam交互](/tokens/connect/metamask/)教程。

您也可以使用以下网络信息连接MetaMask：

 - 网络名称： `Moonriver`
 - RPC URL: `{{ networks.moonriver.rpc_url }}`
 - ChainID: `{{ networks.moonriver.chain_id }}` (hex: `{{ networks.moonriver.hex_chain_id }}`)
 - 代币缩写（可选）： `MOVR`
 - 区块链浏览器（可选）： `{{ networks.moonriver.block_explorer }}`
