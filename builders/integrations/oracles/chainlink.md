---
title: Chainlink预言机
description: 如何通过智能合约或者Javascript在Moonbeam以太坊DApp使用Chainlink预言机喂价
---

# Chainlink预言机

![Chainlink Moonbeam Banner](/images/builders/integrations/oracles/chainlink/chainlink-banner.png)

## 概览 {: #introduction }

开发者现可以使用[Chainlink去中心化的预言机网络](https://chain.link/)在Moonbase Alpha测试网和Moonriver中获取数据。[Price Feeds（喂价）](https://docs.chain.link/docs/architecture-decentralized-model)包含由预言机运营商在智能合约持续更新的实时价格数据，便于其他智能合约的获取及使用。本教程将介绍可用的喂价以及如何在Moonriver上获取最新价格数据。

## Price Feeds（喂价） {: #price-feeds }

在介绍获取数据本身之前，您需要先了解喂价的基本情况。

在标准配置下，每次喂价是由去中心化预言机网络进行数据更新。每个预言机节点向Aggregator合约发布价格数据，而后获得奖励。Aggregator合约从预言机网络定期接收最新数据更新，并将数据聚合并存储在链上，便于使用者轻松获取。但在每一轮聚合中，只有预言机节点收到超过最低数量门槛的响应才会更新数据。

终端用户可以通过Aggregator接口或通过代理合约的Consumer接口使用只读操作检索喂价。

![Price Feed Diagram](/images/builders/integrations/oracles/chainlink/chainlink-price-feed.png)

## 获取价格数据 {: #fetch-price-data }

Moonbase Alpha和Moonriver均有Data Feed合约，以简化请求喂价的流程。在Moonbase Alpha的现有配置下，我们只运营一个预言机节点，通过单一API来源获取数据。价格数据每分钟查看一次，每小时通过智能合约更新一次，另外在价格变动超过1%时也会进行更新。Moonriver的Data Feed合约由多个Chainlink节点定期更新。

数据储存在一系列智能合约中（每个喂价储存在一个智能合约中），可以通过Aggregator接口获取：

```
pragma solidity ^0.8.0;

interface AggregatorV3Interface {
    /**
     * Returns the decimals to offset on the getLatestPrice call
     */
    function decimals() external view returns (uint8);

    /**
     * Returns the description of the underlying price feed aggregator
     */
    function description() external view returns (string memory);

    /**
     * Returns the version number representing the type of aggregator the proxy points to
     */
    function version() external view returns (uint256);

    /**
     * Returns price data about a specific round
     */
    function getRoundData(uint80 _roundId) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);

    /**
     * Returns price data from the latest round
     */
    function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}
```

如上述接口所示，有5个函数可获取价格：`decimal`、`description`、`version`、`getRoundData`和`latestRoundData`。

目前，我们部署了以下报价对的Data Feed合约：

=== "Moonriver"
    |  基础报价对  |                        Data Feed合约                         |
    |:------------:|:------------------------------------------------------------:|
    | 1INCH to USD | {{ networks.moonriver.chainlink.feed.aggregator.inch_usd }}  |
    | AAVE to USD  | {{ networks.moonriver.chainlink.feed.aggregator.aave_usd }}  |
    | ANKR to USD  | {{ networks.moonriver.chainlink.feed.aggregator.ankr_usd }}  |
    | AVAX to USD  | {{ networks.moonriver.chainlink.feed.aggregator.avax_usd }}  |
    |  AXS to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.axs_usd }}  |
    |  BNB to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.bnb_usd }}  |
    |  BTC to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.btc_usd }}  |
    | CAKE to USD  | {{ networks.moonriver.chainlink.feed.aggregator.cake_usd }}  |
    | COMP to USD  | {{ networks.moonriver.chainlink.feed.aggregator.comp_usd }}  |
    |  CRV to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.crv_usd }}  |
    |  DAI to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.dai_usd }}  |
    |  DOT to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.dot_usd }}  |
    |  ETH to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.eth_usd }}  |
    |  EUR to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.eur_usd }}  |
    | FRAX to USD  | {{ networks.moonriver.chainlink.feed.aggregator.frax_usd }}  |
    |  FTM to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.ftm_usd }}  |
    |  FXS to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.fxs_usd }}  |
    |  KSM to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.ksm_usd }}  |
    | LINK to USD  | {{ networks.moonriver.chainlink.feed.aggregator.link_usd }}  |
    | LUNA to USD  | {{ networks.moonriver.chainlink.feed.aggregator.luna_usd }}  |
    | MANA to USD  | {{ networks.moonriver.chainlink.feed.aggregator.mana_usd }}  |
    |  MIM to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.mim_usd }}  |
    |  MKR to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.mkr_usd }}  |
    | MOVR to USD  | {{ networks.moonriver.chainlink.feed.aggregator.movr_usd }}  |
    | SAND to USD  | {{ networks.moonriver.chainlink.feed.aggregator.sand_usd }}  |
    |  SNX to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.snx_usd }}  |
    | SUSHI to USD | {{ networks.moonriver.chainlink.feed.aggregator.sushi_usd }} |
    | THETA to USD | {{ networks.moonriver.chainlink.feed.aggregator.theta_usd }} |
    |  UNI to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.uni_usd }}  |
    | USDC to USD  | {{ networks.moonriver.chainlink.feed.aggregator.usdc_usd }}  |
    | USDT to USD  | {{ networks.moonriver.chainlink.feed.aggregator.usdt_usd }}  |
    |  XRP to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.xrp_usd }}  |
    |  YFI to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.yfi_usd }}  |
    
=== "Moonbase Alpha"
    |  基础报价对  |                        Data Feed合约                        |
    |:------------:|:-----------------------------------------------------------:|
    |  BTC to USD  |  {{ networks.moonbase.chainlink.feed.aggregator.btc_usd }}  |
    |  ETH to USD  |  {{ networks.moonbase.chainlink.feed.aggregator.eth_usd }}  |
    |  DOT to USD  |  {{ networks.moonbase.chainlink.feed.aggregator.dot_usd }}  |
    |  KSM to USD  |  {{ networks.moonbase.chainlink.feed.aggregator.ksm_usd }}  |
    | AAVE to USD  | {{ networks.moonbase.chainlink.feed.aggregator.aave_usd }}  |
    | ALGO to USD  | {{ networks.moonbase.chainlink.feed.aggregator.algo_usd }}  |
    | BAND to USD  | {{ networks.moonbase.chainlink.feed.aggregator.band_usd }}  |
    | LINK to USD  | {{ networks.moonbase.chainlink.feed.aggregator.link_usd }}  |
    | SUSHI to USD | {{ networks.moonbase.chainlink.feed.aggregator.sushi_usd }} |
    |  UNI to USD  |  {{ networks.moonbase.chainlink.feed.aggregator.uni_usd }}  |

举例而言，您可以通过[Remix](https://remix.ethereum.org/)使用Aggregator接口获取`BTC to USD`喂价。如果您需要加载合约至Remix，请参考[使用Remix](/builders/interact/remix/)文档。

您需要将您的MetaMask账户连接至Remix，请确保您已安装MetaMask并已连接至Moonbase Alpha测试网或Moonriver。若您还未设置MetaMask，请参考[使用MetaMask与Moonbeam交互](/tokens/connect/metamask/#install-the-metamask-extension)教程。

创建文件和编译合约后，您将需要执行以下步骤：

1. 进入**Deploy and Run Transactions**标签

2. 将**Environment**设置为**Injected Web3**

3. 如果您的MetaMask已连接，它将出现在**Account**选择列表中。否则，MetaMask将提示您连接至您的账户。

4. 在**Contract**下拉列表中选择`AggregatorV3Interface`合约

5. 在**At Address**字段输入`BTC to USD`对应的Data Feed地址，点击**At Address**按钮

    === "Moonriver"
        `{{ networks.moonriver.chainlink.feed.aggregator.btc_usd }}`

    === "Moonbase Alpha"
        `{{ networks.moonbase.chainlink.feed.aggregator.btc_usd }}`
    
![Load the Chainlink Price Feed Aggregator Interface on Moonriver](/images/builders/integrations/oracles/chainlink/chainlink-1.png)

这将创建一个可以进行交互的Aggregator接口实例，并出现在Remix的**Deployed Contracts**部分。执行以下操作步骤获取最新价格数据：

1. 展开`AggregatorV3Interface`合约获取可用函数

2. 点击`latestRoundData()`请求相应喂价数据，在本示例中为BTC to USD

![Interact with the Chainlink Price Feed Aggregator Interface on Moonriver](/images/builders/integrations/oracles/chainlink/chainlink-2.png)

请注意，您必须用`decimals()`方式了解喂价的小数位数，才能获得实际价格。

如果您希望更多报价对出现在上述表格，请随时通过[Discord server](https://discord.com/invite/PfpUATX)联系我们。

--8<-- 'text/disclaimers/third-party-content.md'