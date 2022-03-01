---
title: Band Protocol
description: 如何通过智能合约或者Javascript在Moonbeam以太坊DApp使用Band Protocal预言机喂价
---
# Band Protocol预言机

![Band Protocol Moonbeam Diagram](/images/builders/integrations/oracles/band/band-banner.png)

## 概览 {: #introduction }
开发者可通过两种方法从Band预言机获取价格。第一，可以通过Moonbeam上的Band智能合约在固定时间段或价格滑点大于目标值（不同代币的目标值不同）时获取链上最新数据。第二，使用JavaScript辅助库，该库绕过区块链直接从Band Protocol API（与智能合约相似的函数）中获取数据。如果DApp前端需要直接获取数据，则可以使用这种方法。

聚合合约地址可以在以下列表找到：

|      网络      |      |                聚合合约地址                |
| :------------: | ---- | :----------------------------------------: |
| Moonbase Alpha |      | 0xDA7a001b254CD22e46d3eAB04d937489c93174C3 |

## 支持的代币 {: #supported-token } 
只要是平台支持的基础货币和报价货币（_报价对显示方式：基础货币代码_/_报价货币代码_），您都可以获取其报价。例如：

 - `BTC/USD`
 - `BTC/ETH`
 - `ETH/EUR`

您可通过此[链接](https://data.bandprotocol.com)查看平台已支持的代币种类。撰写本文时，已有超过146对货币对可查询。

## 获取报价 {: #querying-prices } 
如上所述，开发者可以通过两种方法从Band预言机获取报价：

 - Moonbeam上的Band智能合约（目前已部署在Moonbase Alpha测试网上）
 - Javascript辅助库

## 通过智能合约获取数据 {: #get-data-using-smart-contracts }
Moonbeam上的Band Protocol智能合约可通过实现`StdReference`合约接口从而查询链上数据（例如代币价格），该接口公开了`getReferenceData`和`getReferenceDataBulk`函数。

第一个函数`getReferenceData`输入两串字符（基础货币和报价货币的代码），通过向`StdReference`合约发送请求来获取这两种货币之间的最新汇率，并以`ReferenceData`结构返回。

`ReferenceData`结构由以下元素组成：

 - 汇率：基础货币/报价货币汇率，返回值是真实汇率的 10<sup>18</sup>倍
 - 基础货币价格最后更新时间（UNIX时间戳）
 - 报价货币价格最后更新时间（UNIX时间戳）

```
struct ReferenceData {
   uint256 rate; 
   uint256 lastUpdatedBase; 
   uint256 lastUpdatedQuote;
}
```

第二个函数`getReferenceDataBulk`输入数据阵列信息。例如，基础货币输入`['BTC','BTC','ETH']`，报价货币输入`['USD','ETH','EUR']` ，`ReferenceData`函数就会返回包含以下货币对的数据阵列：

 - `BTC/USD`
 - `BTC/ETH`
 - `ETH/EUR`

### 合约示例 {: #example-contract } 

以下智能合约代码以简单的示例展示了`StdReference`合约和`getReferenceData`函数。合约仅为举例，不作实际之用。`IStdReference.sol`接口明确了ReferenceData结构和可用于获取报价的函数。

```sol
pragma solidity 0.6.11;
pragma experimental ABIEncoderV2;

interface IStdReference {
    /// A structure returned whenever someone requests for standard reference data.
    struct ReferenceData {
        uint256 rate; // base/quote exchange rate, multiplied by 1e18.
        uint256 lastUpdatedBase; // UNIX epoch of the last time when base price gets updated.
        uint256 lastUpdatedQuote; // UNIX epoch of the last time when quote price gets updated.
    }

    /// Returns the price data for the given base/quote pair. Revert if not available.
    function getReferenceData(string memory _base, string memory _quote)
        external
        view
        returns (ReferenceData memory);

    /// Similar to getReferenceData, but with multiple base/quote pairs at once.
    function getReferenceDataBulk(string[] memory _bases, string[] memory _quotes)
        external
        view
        returns (ReferenceData[] memory);
}
```
接下来可以使用`DemoOracle`脚本。该脚本含有4个函数：

 - getPrice：请求单一基础货币报价的_视图_函数。在此示例中，`BTC`以`USD`为报价单位
 - getMultiPrices：请求多个基础货币报价的_视图_函数。在此示例中，`BTC`和`ETH`均以`USD`为报价单位
 - savePrice：请求_基础货币/报价货币_对数据的_公有_函数。不同元素作为字符串输入，如 `_base = "BTC", _quotes = "USD"`。函数将发送交易并修改储存在合约中的`price`变量
 - saveMultiPrices：一个请求多个_基础货币/报价货币_对数据的_公有_函数。不同元素作为字符串阵列输入，如`_bases = ["BTC","ETH"], _quotes = ["USD","USD"]`。函数将发送交易并修改储存在合约中的`prices`阵列，阵列将按照输入顺序显示每个报价对的价格。

部署时，构造函数需要聚合合约地址以连接到目标网络。

```sol
pragma solidity 0.6.11;
pragma experimental ABIEncoderV2;

import "./IStdReference.sol";

contract DemoOracle {
    IStdReference ref;
    
    uint256 public price;
    uint256[] public pricesArr;

    constructor(IStdReference _ref) public {
        ref = _ref; // Aggregator Contract Address
                    // Moonbase Alpha 0xDA7a001b254CD22e46d3eAB04d937489c93174C3

    }

    function getPrice(string memory _base, string memory _quote) external view returns (uint256){
        IStdReference.ReferenceData memory data = ref.getReferenceData(_base,_quote);
        return data.rate;
    }

    function getMultiPrices(string[] memory _bases, string[] memory _quotes) external view returns (uint256[] memory){
        IStdReference.ReferenceData[] memory data = ref.getReferenceDataBulk(_bases,_quotes);

        uint256 len = _bases.length;
        uint256[] memory prices = new uint256[](len);
        for (uint256 i = 0; i < len; i++) {
            prices[i] = data[i].rate;
        }

        return prices;
    }
    
    function savePrice(string memory _base, string memory _quote) external {
        IStdReference.ReferenceData memory data = ref.getReferenceData(_base,_quote);
        price = data.rate;
    }
    
    function saveMultiPrices(
        string[] memory _bases,
        string[] memory _quotes
    ) public {
        require(_bases.length == _quotes.length, "BAD_INPUT_LENGTH");
        uint256 len = _bases.length;
        IStdReference.ReferenceData[] memory data = ref.getReferenceDataBulk(_bases,_quotes);
        delete pricesArr;
        for (uint256 i = 0; i < len; i++) {
            pricesArr.push(data[i].rate);
        }
        
    }
}
```

### 在Moonbase Alpha上进行测试 {: #try-it-in-moonbase alpha } 

我们已经在Moonbase Alpha测试网部署了一个合约（地址为`0xf15c870344c1c02f5939a5C4926b7cDb90dEc655`），方便开发者查看Band Protocol预言机的喂价信息。为此，您需要部署以下接口合约：

```sol
pragma solidity 0.6.11;
pragma experimental ABIEncoderV2;

interface TestInterface {
    function getPrice(string memory _base, string memory _quote) external view returns (uint256);

    function getMultiPrices(string[] memory _bases, string[] memory _quotes) external view returns (uint256[] memory);
}
```

通过这一合约将创建两个视图函数，以下示例与上述示例非常相似：

 - getPrice: 根据函数中对应输入的数据，提供单一基础货币/报价货币对喂价，即BTC/USD
 - getMultiPrices: 根据函数中对应输入的数据，提供多种基础货币/报价货币对喂价，即BTC/USD、ETH/USD、ETH/EUR

例如，使用[Remix](/integrations/remix/)接口可以方便地获取BTC/USD价格对。

创建文档及编译合约后，点击“Deploy and Run Transactions”标签，输入合约地址（`0xf15c870344c1c02f5939a5C4926b7cDb90dEc655`）并点击“At Address”。请确保已将“Environment”设置为“Injected Web3”，只有在该设置下才能与Moonbase Alpha连接。

![Band Protocol Remix deploy](/images/builders/integrations/oracles/band/band-demo-1.png)

通过这一方法，你将创建一个可以进行交互的合约实例。使用`getPrice()`和`getMultiPrices()`函数即可请求相应报价对的数据。

![Band Protocol Remix check price](/images/builders/integrations/oracles/band/band-demo-2.png)

## BandChain.js Javascript辅助库 {: #bandchainjs-javascript-helper-library } 

辅助库也支持相似的`getReferenceData`函数。使用此方法，首先要根据以下指令安装辅助库：

```
npm install @bandprotocol/bandchain.js
```

该辅助库提供了需要一个可以指向终端的构造函数。这将返回一个实例，支持所有必要的方法，如 `getReferenceData`函数。在获取信息时，向函数输入数据阵列，阵列中每个元素就是需要报价的基础货币/报价货币对。例如：

```
getReferenceData(['BTC/USD', 'BTC/ETH', 'ETH/EUR'])
```

然后，函数将返回以下结构的数据阵列：

```
[
  {
    pair: 'BTC/USD',
    rate: rate,
    updated: { base: lastUpdatedBase, quote: lastUpdatedQuote}
  },
  {
    pair: 'BTC/ETH',
    rate: rate,
    updated: { base: lastUpdatedBase, quote: lastUpdatedQuote}
  },
  {
    pair: 'ETH/EUR',
    rate: rate,
    updated: { base: lastUpdatedBase, quote: lastUpdatedQuote}
  }
]
```
`lastUpdatedBase`和`lastUpdatedQuote`显示的是基础货币和报价货币各自价格的最后更新时间（UNIX时间戳）。

### 应用示例 {: #example-usage } 

下面这个Javascript脚本是`getReferenceData`函数的一个简单示例。

```js
const BandChain = require('@bandprotocol/bandchain.js');

const queryData = async () => {
  const endpoint = 'https://poa-api.bandchain.org';

  const bandchain = new BandChain(endpoint);
  const dataQuery = await bandchain.getReferenceData(['BTC/USD', 'BTC/ETH', 'ETH/EUR']);
  console.log(dataQuery);
};

queryData();
```

这段代码可以通过节点来执行，其`dataQuery`输出值应该如下所示：

![Band Protocol JavaScript Library](/images/builders/integrations/oracles/band/band-console.png)

请注意，与通过智能合约获取报价相比，通过这种方法获得的返回结果将直接在正确的单位中显示。

--8<-- 'text/disclaimers/third-party-content.md'