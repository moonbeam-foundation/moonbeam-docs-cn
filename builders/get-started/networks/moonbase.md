---
title: Moonbase Alpha测试网快速上手
description: Moonbeam的测试网，Moonbase Alpha，是进入波卡生态的首选入口。通过此教程了解如何连接至Moonbase Alpha。
---

# Moonbeam测试网快速上手（Moonbase Alpha）

--8<-- 'text/testnet/connect.md'

## 区块链浏览器 {: #block-explorers }

您可以使用以下区块链浏览器来浏览Moonbase Alpha:

 - **以太坊API(类似Etherscan)** — [Moonscan](https://moonbase.moonscan.io/){target=_blank}
 - **基于以太坊API JSON-RPC** — [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=MoonbaseAlpha)
 - **基于以太坊API和索引** — [Blockscout](https://moonbase-blockscout.testnet.moonbeam.network/)
 - **基于Substrate API** — [Subscan](https://moonbase.subscan.io/)或[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer)

 更多相关信息请参考[区块浏览器](/builders/tools/explorers)文档。

## 连接MetaMask

如果您已经安装了MetaMask，您可以轻松地将MetaMask连接至Moonbase Alpha测试网：

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbase">连接MetaMask</a>
</div>

!!! 注意事项
    MetaMask将会跳出弹框，要求授权将Moonbase Alpha添加为自定义网络。经授权后，MetaMask会将您当前的网络切换到Moonbase Alpha。

如果您还没有安装MetaMask，并想查看相关指南，请查看[使用MetaMask与Moonbeam交互](/tokens/connect/metamask/)指南。

## 获得Token {: #get-tokens }

要开始在Moonbase Alpha上开发部署，您可以在我们的Discord频道的[任务中心](https://discord.gg/PfpUATX)处获得DEV Token。若想了解具体DEV数量，您可通过我们的社区渠道直接联系我们。

### Discord - Mission Control {: #discord-mission-control } 

为了让用户们可以自动获得Token，我们创建了一个Discord机器人（名为Mission Control:sunglasses:）。当您输入您的钱包地址，它会每24小时自动发送最多5个DEV Token至每个Discord用户的账户中。您可以在我们的[Discord频道](https://discord.gg/PfpUATX)中查看。

您可以在“Miscellaneous"一栏下面找到我们的**Moonbase-Faucet**频道。

![Discord1](/images/builders/get-started/networks/moonbase/discord-1.png)

如果您想要查询您的余额，请输入以下信息，并将`<enter-address-here->`替换为您的H160地址:

```
!balance <enter-address-here->
```

如果您想要获得DEV Token，请输入以下的信息，并将`<enter-address-here->`替换成您的H160地址：

```
!faucet send <enter-address-here->
```

Mission Control将会发送5个DEV Token到您的账户，并显示您当前的帐户余额。请注意，每个Discord用户每24小时仅能获得一次Mission Control发送的代币。

![Discord2](/images/builders/get-started/networks/moonbase/discord-2.png)

!!! 注意事项
    Moonbase Alpha DEV代币没有经济价值，请不要滥用水龙头。

