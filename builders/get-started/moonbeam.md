---
title: Moonbeam
description: 学习如何通过RPC和WSS端点快速连接至波卡（Polkadot）上的Moonbeam。
---

# 开始使用Moonbeam

--8<-- 'text/moonbeam/connect.md'

## 区块浏览器 {: #block-explorers }

您可以使用以下浏览器来浏览Moonbeam：

 - **以太坊API（类似Etherscan）**—— [Moonscan](https://moonbeam.moonscan.io/)
 - **具有索引功能的以太坊API** —— [Blockscout](https://blockscout.moonbeam.network/)
 - **基于以太坊API JSON-RPC** —— [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=Moonbeam)
 - **Substrate API** —— [Subscan](https://moonbeam.subscan.io/)或[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network#/explorer)

更多可用区块浏览器的相关信息，请访问Moonbeam资料库的[区块浏览器](/builders/tools/explorers)部分。

## 连接MetaMask {: #connect-metamask }

由于Moonbeam尚未启用EVM功能，目前暂不能连接至MetaMask。Moonbeam网络完全启动后，您可遵循相关教程连接MetaMask至Moonbeam。

<!---
如果您已安装MetaMask，您可轻松将MetaMask连接至Moonriver：

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbeam">连接MetaMask</a>
</div>
!!! 注意事项
    MetaMask会弹出窗口，请求允许将Moonbeam添加为自定义网络。一旦您批准授权，MetaMask将会把您当前的网络切换至Moonbeam。

如果您尚未安装MetaMask，请遵循[使用MetaMask与Moonbeam交互](/tokens/connect/metamask/)的教程开始操作。

您也可以使用以下网络信息连接MetaMask：

 - Network Name: `Moonbeam`
 - RPC URL: `{{ networks.moonbeam.rpc_url }}`
 - ChainID: `{{ networks.moonbeam.chain_id }}` (hex: `{{ networks.moonbeam.hex_chain_id }}`)
 - Symbol (Optional): `GLMR`
 - Block Explorer (Optional): `{{ networks.moonbeam.block_explorer }}` 
 --->