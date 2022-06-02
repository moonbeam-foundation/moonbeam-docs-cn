---
title: Chainlink预言机
description: 如何通过智能合约或者Javascript在Moonbeam以太坊DApp使用Chainlink预言机喂价。查看Moonriver上可用的价格信息。
---

# Chainlink预言机

![Chainlink Moonbeam Banner](/images/builders/integrations/oracles/chainlink/chainlink-banner.png)

## 概览 {: #introduction } 

开发者现可以使用[Chainlink去中心化的预言机网络](https://chain.link/){target=_blank}在Moonbase Alpha测试网和Moonriver中获取数据。[Price Feeds（喂价）](https://docs.chain.link/docs/architecture-decentralized-model)包含由预言机运营商在智能合约持续更新的实时价格数据，便于其他智能合约的获取及使用。本教程将介绍可用的喂价以及如何在Moonriver上获取最新价格数据。

## 基本请求模型 {: #basic-request-model } 

--8<-- 'text/chainlink/brm.md'

## 获取数据 {: #fetching-data }

您可以通过以下几种方式开始从Moonbeam上的预言机获取数据：

- 您可以使用依赖于Moonbeam运行的预言机节点的预部署的客户端合约、LINK Token合约、以及预言机合约
- 您可以创建自己的自定义合约，取代与预部署的客户端合约一起使用的预部署的客户端合约
- 您可以创建自己的自定义客户端合约，并运行自己的预言机节点

Moonbeam运行的预部署合约和预言机节点支持一组有限的job ID，可用于获取各种资产对的价格数据。如果您需要额外数据，请参考[使用您自己的预言机节点以创建自定义合约](#create-custom-contracts-using-your-own-oracle-node)段落，了解如何开始。

请注意，客户端合约必须拥有LINK Token余额用于支付请求。对于预部署的设置，LINK值已经被设为0。如果您部署自己的设置，您也可以在您的`ChainlinkClient.sol` 合约设置LINK值为0，并且您可以选择部署您自己的LINK Token合约或者使用预部署的合约。

### 使用预部署的合约 {: #use-pre-deployed-contracts }

如果您想要跳过部署所有合约、设置您自己预言机节点、创建job ID等等障碍，您可以使用一个已经部署在Moonbase Alpha上的自定义客户端合约。该合约向一个已经部署的预言机合约发出所有请求，无需支付LINK Token。这些请求由Moonbeam团队运行的预言机节点完成。

部署在Moonbase Alpha的客户端合约如下：

```
pragma solidity ^0.6.6;

import "https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.6/ChainlinkClient.sol";

/**
 * @title Client based in ChainlinkClient
 * @notice End users can deploy this contract to request the Prices from an Oracle
 */
contract Client is ChainlinkClient {
  // Stores the answer from the Chainlink oracle
  uint256 public currentPrice;
  address public owner;

  // Deploy with the address of the LINK token
  constructor(address _link) public {
    // Set the address for the LINK token for the network
    setChainlinkToken(_link);
    owner = msg.sender;
  }

  // Creates Chainlink Request
  function requestPrice(address _oracle, string memory _jobId, uint256 _payment) 
    public
    onlyOwner
  {
    // newRequest takes a JobID, a callback address, and callback function as input
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfill.selector);
    // Sends the request with the amount of payment specified to the oracle
    sendChainlinkRequestTo(_oracle, req, _payment);
  }

  // Callback function called by the Oracle when it has resolved the request
  function fulfill(bytes32 _requestId, uint256 _price)
    public
    recordChainlinkFulfillment(_requestId)
  {
    currentPrice = _price;
  }

  // Allows the owner to cancel an unfulfilled request
  function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  )
    public
  {
    cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }

  // Allows the owner to withdraw the LINK tokens in the contract to the address calling this function
  function withdrawLink()
    public
    onlyOwner
  {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }

  // Decodes an input string in a bytes32 word
  function stringToBytes32(string memory _source)
    private
    pure
    returns (bytes32 result) 
  {
    bytes memory emptyStringTest = bytes(_source);
    if (emptyStringTest.length == 0) {
      return 0x0;
    }

    assembly { // solhint-disable-line no-inline-assembly
      result := mload(add(_source, 32))
    }

    return result;
  }

  // Reverts if the sender is not the owner of the contract
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
}
```

合约的核心函数如下：

 - **`constructor`**  —— 当合约部署时运行。设置LINK Token地址和合约的所有者
 - **`requestPrice`** —— 需要预言机合约地址、job ID，以及支付Token（LINK）给请求的完成者。构建使用来自`ChainlinkClient.sol` 导入的`sendChainlinkRequestTo` 函数来发送新的请求
 - **`fulfill`** —— 预言机节点用于通过存储在合约中的查询信息来完成请求的回调

请注意，客户端合约必须拥有LINK Token余额，以能够支付请求。然而，在本例中，LINK值被设置为0。

客户端合约被部署于`{{ networks.moonbase.chainlink.client_contract }}`。您可以通过接口合约，试着与客户端合约交互：


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

这提供了两个函数：

 - `requestPrice()` —— 仅需要你想要查询的数据的job ID。此函数启动之前解释的事件链
 - `currentPrice()`是一个查看函数，返回存储在合约中的最新价格

目前，预言机节点已经有如下报价对的不同价格数据的一组Job ID：

|  基础报价对  |                    Job ID参考                     |
| :----------: | :-----------------------------------------------: |
| AAVE to USD  | {{ networks.moonbase.chainlink.basic.aave_usd }}  |
| ALGO to USD  | {{ networks.moonbase.chainlink.basic.algo_usd }}  |
| BAND to USD  | {{ networks.moonbase.chainlink.basic.band_usd }}  |
|  BTC to USD  |  {{ networks.moonbase.chainlink.basic.btc_usd }}  |
|  DOT to USD  |  {{ networks.moonbase.chainlink.basic.dot_usd }}  |
|  ETH to USD  |  {{ networks.moonbase.chainlink.basic.eth_usd }}  |
|  KSM to USD  |  {{ networks.moonbase.chainlink.basic.ksm_usd }}  |
| LINK to USD  | {{ networks.moonbase.chainlink.basic.link_usd }}  |
| SUSHI to USD | {{ networks.moonbase.chainlink.basic.sushi_usd }} |
|  UNI to USD  |  {{ networks.moonbase.chainlink.basic.uni_usd }}  |

在此例中，您可以继续使用在[Remix](/builders/build/eth-api/dev-env/remix/){target=_blank}中使用带有`BTC to USD`的job ID的接口合约。在创建文档和编译合约之后，您可以执行以下步骤：

1. 进入**Deploy and Run Transactions**标签

2. 确保您已经设置**Environment**为**Injected Web3**，并且您的MetaMask已经连接至Moonbase Alpha

3. 输入客户端合约地址，`{{ networks.moonbase.chainlink.client_contract }}`，并点击**At Address**。这将创建一个您可以交互的客户端合约的实例

4. 在**Deployed Contracts**部分，使用`requestPrice()`函数以查询对应job ID的数据

5. 确认交易。您需要等待至之前解释的所有请求流程发生

6. 然后您可以使用查看函数`currentPrice()`查看价格

![Chainlink Basic Request on Moonbase Alpha](/images/builders/integrations/oracles/chainlink/chainlink-1.png)

如果您想要添加其他特定的报价对，请直接通过[Discord](https://discord.com/invite/PfpUATX){target=_blank}联系Moonbeam团队。

### 创建自定义客户端合约 {: #create-a-custom-client-contract } 

如果您想要使用Moonbeam运行的预言机节点来运行自己的自定义客户端合约，请看以下信息：

|  合约种类  |                       地址                        |
| :--------: | :-----------------------------------------------: |
| 预言机合约 | {{ networks.moonbase.chainlink.oracle_contract }} |
| LINK Token |  {{ networks.moonbase.chainlink.link_contract }}  |

如果您决定用这个方式，请注意预言机节点仅支持上一段落中列出的job ID。您只能够访问已支持报价对的价格数据。如果您想要更多功能，或者想要使用其他API，请参考[使用您自己的预言机节点以创建自定义合约](#create-custom-contracts-using-your-own-oracle-node)段落。

使用`ChainlinkClient`构建您自己的客户端合约前，首先您需要导入合约：

```
import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.8/ChainlinkClient.sol";
```

您可以查阅[Chainlink documentation on ChainlinkClient API Reference](https://docs.chain.link/docs/chainlink-framework/){target=_blank}以获得更多资讯。

请注意LINK Token支付设置为0。

### 使用您自己的预言机节点以创建自定义合约 {: #create-custom-contracts-using-your-own-oracle-node }  

开始您自己的设置，包括您自己的客户端合约、预言机合约和预言机节点前，需要开始运行预言机节点。您可以根据[在Moonbeam上运行Chainlink预言机节点](/node-operators/oracle-nodes/node-chainlink/){target=_blank}教程启动您自己的预言机节点。您也可以了解如何设置您预言机合约以及创建Job。

如果您[创建一个可与任何API一起使用的Job](/node-operators/oracle-nodes/node-chainlink/#using-any-api){target=_blank}，接着您可以创建一个客户端合约，设置API终端URL以执行GET请求。

请注意，客户端合约必须有用LINK Token余额，才可以支付请求。因此，您需要在`ChainlinkClient.sol`合约中设置LINK值为0。另外需要确保您预言机节点有一个`0`的 `MINIMUM_CONTRACT_PAYMENT`。您可以通过查看[您节点的**配置**部分](http://localhost:6688/config){target=_blank}验证是否设置为0。

下方客户端合约是关于如何使用在您客户端合约中的任何API的举例：

```
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract Client is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    uint256 public volume;

    /**
    This example uses the LINK token address on Moonbase Alpha.
    Make sure to update the oracle and jobId.
    */
    constructor() {
        setChainlinkToken(address(0xa36085F69e2889c224210F603D836748e7dC0088));
        oracle = {INSERT-YOUR-ORACLE-NODE-ADDRESS};
        jobId = "{INSERT-YOUR-JOB-ID}";
        fee = 0;
    }

    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function requestVolumeData() public returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        // Set the URL to perform the GET request on
        request.add("get", "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD");

        // Set the path to find the desired data in the API response, where the response format is:
        // {"RAW":
        //   {"ETH":
        //    {"USD":
        //     {
        //      "VOLUME24HOUR": xxx.xxx,
        //     }
        //    }
        //   }
        //  }
        request.add("path", "RAW.ETH.USD.VOLUME24HOUR");

        // Multiply the result by 1000000000000000000 to remove decimals
        int timesAmount = 10**18;
        request.addInt("times", timesAmount);

        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId)
    {
        volume = _volume;
    }
}
```

!!! 注意事项
    上述举例使用预部署的LINK Token合约地址。您也可以部署自己的LINK Token合约并使用。

一旦您已经在Remix上部署合约，您可以开始请求容量数据。在发出请求之后，您可以通过[您节点的**Job**](http://localhost:6688/jobs){target=_blank}查看Job的状态。

## 喂价 {: #price-feeds }

在介绍获取数据本身之前，您需要先了解喂价的基本情况。

在标准配置下，每次喂价是由去中心化预言机网络进行数据更新。每个预言机节点向[Aggregator合约](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol){target=_blank}发布价格数据，而后获得奖励。Aggregator合约从预言机网络定期接收最新数据更新，并将数据聚合并存储在链上，便于使用者轻松获取。但在每一轮聚合中，只有预言机节点收到超过最低数量门槛的响应才会更新数据。

终端用户可以通过Aggregator接口或通过代理合约的Consumer接口使用只读操作检索喂价。

![Price Feed Diagram](/images/builders/integrations/oracles/chainlink/chainlink-price-feed.png)

### 获取价格数据 {: #fetch-price-data }

Moonbase Alpha和Moonriver均有Data Feed合约，以简化请求喂价的流程。在Moonbase Alpha的现有配置下，Moonbeam团队只运营一个预言机节点，通过单一API来源获取数据。价格数据每分钟查看一次，每小时通过智能合约更新一次，另外在价格变动超过1%时也会进行更新。Moonriver的Data Feed合约由多个Chainlink节点定期更新。

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

目前提供以下报价对的[Data Feed合约](https://docs.chain.link/docs/data-feeds-moonriver/){target=_blank} ：

=== "Moonriver"
    |  基础报价对 |                      Data Feed合约                      |
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
    |  基础报价对  |                     Data Feed合约                      |
    |:------------:|:-----------------------------------------------------------:|
    | AAVE to USD  | {{ networks.moonbase.chainlink.feed.aggregator.aave_usd }}  |
    | ALGO to USD  | {{ networks.moonbase.chainlink.feed.aggregator.algo_usd }}  |
    | BAND to USD  | {{ networks.moonbase.chainlink.feed.aggregator.band_usd }}  |
    |  BTC to USD  |  {{ networks.moonbase.chainlink.feed.aggregator.btc_usd }}  |
    |  DOT to USD  |  {{ networks.moonbase.chainlink.feed.aggregator.dot_usd }}  |
    |  ETH to USD  |  {{ networks.moonbase.chainlink.feed.aggregator.eth_usd }}  |
    |  KSM to USD  |  {{ networks.moonbase.chainlink.feed.aggregator.ksm_usd }}  |
    | LINK to USD  | {{ networks.moonbase.chainlink.feed.aggregator.link_usd }}  |
    | SUSHI to USD | {{ networks.moonbase.chainlink.feed.aggregator.sushi_usd }} |
    |  UNI to USD  |  {{ networks.moonbase.chainlink.feed.aggregator.uni_usd }}  |

举例而言，您可以通过[Remix](https://remix.ethereum.org/){target=_blank}使用Aggregator接口获取`BTC to USD`喂价。如果您需要加载合约至Remix，请参考[使用Remix](/builders/build/eth-api/dev-env/remix/)文档。

您需要将您的MetaMask账户连接至Remix，请确保您已安装MetaMask并已连接至Moonbase Alpha测试网或Moonriver。若您还未设置MetaMask，请参考[使用MetaMask与Moonbeam交互](/tokens/connect/metamask/#install-the-metamask-extension){target=_blank}教程。

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

![Load the Chainlink Price Feed Aggregator Interface on Moonriver](/images/builders/integrations/oracles/chainlink/chainlink-2.png)

这将创建一个可以进行交互的Aggregator接口实例，并出现在Remix的**Deployed Contracts**部分。执行以下操作步骤获取最新价格数据：

1. 展开`AggregatorV3Interface`合约获取可用函数
2. 点击`latestRoundData()`请求相应喂价数据，在本示例中为BTC to USD

![Interact with the Chainlink Price Feed Aggregator Interface on Moonriver](/images/builders/integrations/oracles/chainlink/chainlink-3.png)

请注意，您必须用`decimals()`了解喂价的小数位数，才能获得实际价格。

如果您希望更多报价对出现在上述表格，请随时通过[Discord server](https://discord.com/invite/PfpUATX){target=_blank}联系我们。

--8<-- 'text/disclaimers/third-party-content.md'
