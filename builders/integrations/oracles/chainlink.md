---
title: Chainlink
description: 如何通过智能合约或者Javascript在Moonbeam以太坊DApp使用Chainlink预言机喂价
---

# Chainlink预言机

![Chainlink Moonbeam Banner](/images/chainlink/chainlink-banner.png)

## 概览 {: #introduction } 

开发者现在可以使用[Chainlink去中心化的预言机网络](https://chain.link/)在Moonbase Alpha测试网中获取数据。本教程将介绍Chainlink预言机两种不同的使用方法：

 - [基本请求模型](https://docs.chain.link/docs/architecture-request-model)，终端用户向预言机数据提供方发送请求，数据提供方通过API获取数据，然后将该数据存储在链上，从而完成请求。
 - [喂价](https://docs.chain.link/docs/architecture-decentralized-model)，预言机节点运营商通过智能合约持续更新数据，以便另外一个智能合约获取其数据。

## 基本请求模型 {: #basic-request-model } 

在介绍获取数据本身之前，我们需要先了解“基本请求模型”的基本情况。

--8<-- 'text/chainlink/chainlink-brm.md'

### 客户合约 {: #the-client-contract } 

客户合约通过发送请求与预言机建立通信。如上图所示，客户合约从LINK代币合约调用*transferAndCall*，但将请求发送到预言机还需要进行更多处理。在这个示例中，您可以使用[此文档](/snippets/code/chainlink/Client.sol)中的代码，将其部署到[Remix](/integrations/remix/)进行测试。下面来看一下合约中的关键函数：

 - _constructor_：合约部署后运行，负责设置LINK代币和合约所有者的地址
 - _requestPrice_：需要预言机合约地址、Job ID，以及向请求执行者支付的LINK代币。使用从*ChainlinkClient.sol* 导入的*sendChainlinkRequestTo*函数创建并发送新请求
 - _fulfill_：预言机节点通过回调完成请求，将请求数据储存在合约中

```solidity
pragma solidity ^0.6.6;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/ChainlinkClient.sol";

contract Client is ChainlinkClient {
  //... there is mode code here

  constructor(address _link) public {
    // Set the address for the LINK token for the network
    setChainlinkToken(_link);
    owner = msg.sender;
  }

  function requestPrice(address _oracle, string memory _jobId, uint256 _payment)
    public
    onlyOwner
  {
    // newRequest takes a JobID, a callback address, and callback function as input
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfill.selector);
    // Sends the request with the amount of payment specified to the oracle
    sendChainlinkRequestTo(_oracle, req, _payment);
  }

  function fulfill(bytes32 _requestId, uint256 _price)
    public
    recordChainlinkFulfillment(_requestId)
  {
    currentPrice = _price;
  }

  //... there is more code here
}
```

请注意，客户合约需要持有一定数量的LINK代币才能创建请求。在部署设置时，可以将`ChainlinkClient.sol`合约中的LINK金额设置为0，但仍需要部署LINK代币合约。

### 在Moonbase Alpha上进行测试 {: #try-it-on-moonbase-alpha } 

如果您想跳过合约部署、预言机节点设置、Job ID创建等步骤，我们也为您提供了以下捷径。

我们在Moonbase Alpha上部署了定制化的客户合约，可直接向预言机合约发送所有请求，并设置了0 LINK支付。我们运营的预言机节点将完成所有这些请求。您可以通过以下接口合约和部署在`{{ networks.moonbase.chainlink.client_contract }}`的定制客户合约进行测试：

```solidity
pragma solidity ^0.6.6;

/**
 * @title Simple Interface to interact with Universal Client Contract
 * @notice Client Address {{ networks.moonbase.chainlink.client_contract }}
 */
interface ChainlinkInterface {

  /**
   * @notice Creates a Chainlink request with the job specification ID,
   * @notice and sends it to the Oracle.
   * @notice _oracle The address of the Oracle contract fixed top
   * @notice _payment For this example the PAYMENT is set to zero
   * @param _jobId The job spec ID that we want to call in string format
   */
    function requestPrice(string calldata _jobId) external;

    function currentPrice() external view returns (uint);

}
```

这个合约有两个函数。`requestPrice()`函数只需要所请求数据的Job ID即可，该函数启动我们此前所提到的事件链。`currentPrice()`是视图函数，负责返回存储在合约上的最新价格。

目前，该预言机节点设置了一系列的Job ID，用于获取以下报价对的价格数据：

| 基础货币/报价货币 |      |                    Job ID参考                     |
| :---------------: | ---- | :-----------------------------------------------: |
|    BTC to USD     |      |  {{ networks.moonbase.chainlink.basic.btc_usd }}  |
|    ETH to USD     |      |  {{ networks.moonbase.chainlink.basic.eth_usd }}  |
|    DOT to USD     |      |  {{ networks.moonbase.chainlink.basic.dot_usd }}  |
|    KSM to USD     |      |  {{ networks.moonbase.chainlink.basic.ksm_usd }}  |
|    AAVE to USD    |      | {{ networks.moonbase.chainlink.basic.aave_usd }}  |
|    ALGO to USD    |      | {{ networks.moonbase.chainlink.basic.algo_usd }}  |
|    BAND to USD    |      | {{ networks.moonbase.chainlink.basic.band_usd }}  |
|    LINK to USD    |      | {{ networks.moonbase.chainlink.basic.link_usd }}  |
|   SUSHI to USD    |      | {{ networks.moonbase.chainlink.basic.sushi_usd }} |
|    UNI to USD     |      |  {{ networks.moonbase.chainlink.basic.uni_usd }}  |

接下来，我们尝试在[Remix](/integrations/remix/)上使用`BTC to USD` Job ID和接口合约。

在创建文件和编译合约后，进入“Deploy and Run Transactions”标签，输入客户合约地址，点击“At Address”。将“Environment”设置为“Injected Web3”，来确保您已经与Moonbase Alpha连接。通过这一方法，您将创建一个可以进行交互的客户合约实例。使用 `requestPrice()` 函数即可请求相应Job ID的数据。交易确认后，需要等待此前所述的流程全部完成。最后可以通过 `currentPrice()`视图函数来查看价格。

![Chainlink Basic Request on Moonbase Alpha](/images/chainlink/chainlink-image1.png)

如果您希望更多报价对出现在上述表格，请随时通过[Discord server](https://discord.com/invite/PfpUATX)联系我们。

### 运行客户合约 {: #run-your-client-contract } 

您可以使用以下信息来通过我们的预言机节点运行自己的客户合约：

|  合约类型  |      |                       地址                        |
| :--------: | ---- | :-----------------------------------------------: |
| 预言机合约 |      | {{ networks.moonbase.chainlink.oracle_contract }} |
|  LINK代币  |      |  {{ networks.moonbase.chainlink.link_contract }}  |

请注意LINK代币支付金额已设置为0。

### 其它请求 {: #other-requests } 

Chainlink预言机可以通过外部适配器获取多种类型的数据，但为了简化，我们的预言机节点仅提供喂价。

如果您有兴趣在Moonbeam上运营自己的预言机节点，请查看[此教程](/node-operators/oracles/node-chainlink/)。同时，我们也推荐您阅读[Chainlink文档](https://docs.chain.link/docs)。

## 喂价 {: #price-feeds } 

在介绍获取数据本身之前，您需要先了解“喂价”的基本情况。

在标准配置下，每次喂价是由去中心化预言机网络进行数据更新。每个预言机节点向聚合合约发布价格数据，而后获得奖励。但在每一轮聚合中，只有预言机节点收到超过一定数量的响应才会更新数据。

终端用户可以通过消费者合约的只读操作索引到相应的聚合接口（代理合约）进行喂价检索。代理作为中间件为消费者提供最新聚合出的喂价信息。

![Price Feed Diagram](/images/chainlink/chainlink-pricefeed.png)

### 在Moonbase Alpha上进行测试 {: #try-it-on-moonbase-alpha } 

如果您想跳过合约部署、预言机节点设置、Job ID创建等步骤，我们也为您提供了以下捷径。

我们在Moonbase Alpha上部署了所有必要的合约，以简化请求喂价的流程。在现有设置下，我们只运营一个预言机节点，通过单一API来源获取数据。价格数据每分钟查看一次，每小时通过智能合约更新一次，另外在价格变动超过1%时也会进行更新。

数据储存在一系列智能合约中（每个喂价储存在一个智能合约中），可以通过以下接口获取：

```solidity
pragma solidity ^0.6.6;

interface ConsumerV3Interface {
    /**
     * Returns the latest price
     */
    function getLatestPrice() external view returns (int);

    /**
     * Returns the decimals to offset on the getLatestPrice call
     */
    function decimals() external view returns (uint8);

    /**
     * Returns the description of the underlying price feed aggregator
     */
    function description() external view returns (string memory);
}
```

这一合约有三个函数。`getLatestPrice()`函数通过代理读取聚合合约中的最新价格数据。我们加入了`decimals()`函数，可以返回数据的保留小数的数字，以及`description()`函数，可以返回所请求聚合合约中喂价的简要描述。

目前，我们部署了以下报价对的消费者合约：

| 基础货币/报价货币 |      |                        消费者合约                         |
| :---------------: | ---- | :-------------------------------------------------------: |
|    BTC to USD     |      |  {{ networks.moonbase.chainlink.feed.consumer.btc_usd }}  |
|    ETH to USD     |      |  {{ networks.moonbase.chainlink.feed.consumer.eth_usd }}  |
|    DOT to USD     |      |  {{ networks.moonbase.chainlink.feed.consumer.dot_usd }}  |
|    KSM to USD     |      |  {{ networks.moonbase.chainlink.feed.consumer.ksm_usd }}  |
|    AAVE to USD    |      | {{ networks.moonbase.chainlink.feed.consumer.aave_usd }}  |
|    ALGO to USD    |      | {{ networks.moonbase.chainlink.feed.consumer.algo_usd }}  |
|    BAND to USD    |      | {{ networks.moonbase.chainlink.feed.consumer.band_usd }}  |
|    LINK to USD    |      | {{ networks.moonbase.chainlink.feed.consumer.link_usd }}  |
|   SUSHI to USD    |      | {{ networks.moonbase.chainlink.feed.consumer.sushi_usd }} |
|    UNI to USD     |      |  {{ networks.moonbase.chainlink.feed.consumer.uni_usd }}  |

接下来，我们尝试在[Remix](/integrations/remix/)上使用接口合约获取`BTC to USD`喂价。

创建文件和编译合约后，进入“Deploy and Run Transactions”标签，输入`BTC to USD`相应的消费者合约地址，点击“At Address”。请确保已将“Environment”设置为“Injected Web3”，只有在该设置下才能与Moonbase Alpha连接。

通过这一方法，你将创建一个可以进行交互的消费者合约实例。使用`getLatestPrice()`函数即可请求相应喂价数据。

![Chainlink Price Feeds on Moonbase Alpha](/images/chainlink/chainlink-image2.png)

请注意，必须用`decimals()`了解喂价的小数位的数字才能获取真实价格。

如果您希望更多报价对出现在上述表格，请随时通过[Discord server](https://discord.com/invite/PfpUATX)联系我们。
