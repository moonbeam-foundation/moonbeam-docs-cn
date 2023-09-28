---
title: 使用API3请求链下数据
description: 学习如何使用API3在Moonbeam网络上通过API3 Airnodes和dAPIs（数据源）从您的智能合约请求和获取链下数据
---

# 使用API3请求链下数据

## 概览 {: #introduction }

API3是一个去中心化解决方案，以易访问和可扩展的方式向智能合约平台提供传统API服务。它由去中心化自治组织（DAO）——API3 DAO负责管理。API3让开发者能够在无需担心安全问题前提下，从智能合约中访问链下资源。API3通过第一方预言机——Airnodes，以及源自预言机的链上数据源使这一切成为可能。

开发者可以使用[Airnode](https://docs.api3.org/explore/airnode/what-is-airnode.html){target=_blank}在Moonbeam网络上的智能合约内请求链下数据。Airnode是一个第一方预言机，可将链下API数据推送到链上合约。Airnode让API提供商能够轻松运行自身的第一方预言机节点。如此一来，他们就可以在无需中介的情况下，向任何对其服务感兴趣的链上dApp提供数据。

一个链上智能合约能够在[RRP（请求响应协议）](https://docs.api3.org/reference/airnode/latest/concepts/){target=_blank}合约中发出请求（[`AirnodeRrpV0. sol`](https://github.com/api3dao/airnode/blob/v0.11/packages/airnode-protocol/contracts/rrp/AirnodeRrpV0.sol){target=_blank}）并将请求添加到事件日志。接着，由Airnode访问事件日志、获取API数据并使用请求的数据对请求者执行回调。

![API3 Airnode](/images/builders/integrations/oracles/api3/api3-1.png)

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 从一个Airnode请求链下数据 {: #calling-an-airnode }

请求链下数据本质上包含触发Airnode并通过智能合约获取其响应。在这种情况下，智能合约将会是请求者合约，它将向指定的链下Airnode发出请求，然后获取其响应。

调用Airnode的请求者基本上专注于以下两个事务：

- 提交请求
- 接收并解码响应

![API3 Airnode](/images/builders/integrations/oracles/api3/api3-2.png)

以下是一个从Airnode请求数据的基础请求者范例合约：

```solidity
pragma solidity 0.8.9;

import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";

// A Requester that will return the requested data by calling the specified airnode.
// Make sure you specify the right _rrpAddress for your chain.

contract Requester is RrpRequesterV0 {
    mapping(bytes32 => bool) public incomingFulfillments;
    mapping(bytes32 => int256) public fulfilledData;

    constructor(address _rrpAddress) RrpRequesterV0(_rrpAddress) {}

    /**
     * The main makeRequest function that will trigger the Airnode request
     * airnode: Airnode address
     * endpointId: The endpoint ID for the specific endpoint
     * sponsor: The requester contract itself (in this case)
     * sponsorWallet: The wallet that will make the actual request (needs to be funded)
     * parameters: encoded API parameters
     */
    function makeRequest(
        address airnode,
        bytes32 endpointId,
        address sponsor,
        address sponsorWallet,
        bytes calldata parameters
        
    ) external {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointId,
            sponsor,
            sponsorWallet,
            address(this),
            this.fulfill.selector,
            parameters
        );
        incomingFulfillments[requestId] = true;
    }

    // The callback function with the requested data
    function fulfill(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(incomingFulfillments[requestId], "No such request made");
        delete incomingFulfillments[requestId];
        int256 decodedData = abi.decode(data, (int256));
        fulfilledData[requestId] = decodedData;
    }
}
```

您也可以尝试在[Remix上部署范例合约](https://remix.ethereum.org/#url=https://github.com/vanshwassan/RemixContracts/blob/master/contracts/Requester.sol&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.9+commit.e5eed63a.js){target=_blank}。

### 合约地址 {: #contract-addresses }

`_rrpAddress`是主要的`airnodeRrpAddress`。RRP合约已经被部署在链上。以下为Moonbeam网络中的[`_rrpcAddress`地址列表](https://docs.api3.org/reference/airnode/latest/){target=_blank}：

=== "Moonbeam"

    |     合约     |                地址                |
    |:------------:|:----------------------------------:|
    | AirnodeRrpV0 | `{{ networks.moonbeam.api3.rrp }}` |

=== "Moonriver"

    |     合约     |                地址                 |
    |:------------:|:-----------------------------------:|
    | AirnodeRrpV0 | `{{ networks.moonriver.api3.rrp }}` |

=== "Moonbase Alpha"

    |     合约     |                地址                |
    |:------------:|:----------------------------------:|
    | AirnodeRrpV0 | `{{ networks.moonbase.api3.rrp }}` |

### 要求参数 {: #request-params }

`makeRequest()`函数需要以下参数以成为一个可用的请求：

- [**`airnode`**](https://docs.api3.org/reference/airnode/latest/concepts/airnode.html){target=_blank} - 指定Airnode地址
- [**`endpointId`**](https://docs.api3.org/reference/airnode/latest/concepts/endpoint.html){target=_blank} - 指定使用端点
- [**`sponsor`**](https://docs.api3.org/reference/airnode/latest/concepts/sponsor.html){target=_blank} and [**`sponsorWallet`**](https://docs.api3.org/reference/airnode/latest/concepts/sponsor.html#sponsorwallet){target=_blank} - 指定用于完成请求的钱包
- [**`parameters`**](https://docs.api3.org/reference/ois/latest/reserved-parameters.html){target=_blank} - 指定API和保留参数（详细内容请看[Airnode ABI列表](https://docs.api3.org/reference/ois/latest/){target=_blank}了解这些是如何编码的）。参数将使用`@airnode-abi`在链下编码

### 响应参数 {: #response-params }

请求者合约的调用响应包含以下两个参数：

- [**`requestId`**](https://docs.api3.org/reference/airnode/latest/concepts/request.html#requestid){target=_blank} - 首个在发起请求时获取并作为响应请求时参考的请求ID。
- **`data`** - 如果成功获得响应，这将是已编码的请求数据，还包含时间戳和其响应数据。这将使用`abi`对象中的`decode()`函数对其进行解码

!!! 注意事项
    赞助商不应为`sponsorWallet`提供超出他们可以信任Airnode的资金，因Airnode控制着`sponsorWallet`的私钥。此类Airnode的部署者并不承担托管义务，并且发送至`sponsorWallet`的任何多余资金的丢失或滥用风险仍由赞助商自行承担。

## 使用dAPIs - API3数据源 {: #dapis }

[dAPI](https://docs.api3.org/explore/dapis/what-are-dapis.html){target=_blank}为不断更新的链下数据流，如最新的加密货币、股票和商品价格。它们可以为各种去中心化应用程序提供支持，例如DeFi借贷、合成资产、稳定币、衍生品、NFT等。

[第一方预言机](https://docs.api3.org/explore/introduction/first-party.html){target=_blank}使用签名数据不断更新数据源。DApp所有者可以实时读取任何dAPI的链上价值。

由于第一方数据源的组成，dAPI在交钥匙（Turn-key）包中提供安全性、透明度、成本效益和可扩展性。

![API3 Remix deploy](/images/builders/integrations/oracles/api3/api3-3.png)

*要了解更多dAPI是如何运作的，您可以查看[API3的文档网站](https://docs.api3.org/explore/dapis/what-are-dapis.html){target=_blank}。*

### 访问自费的dAPI {: #self-funded-dapis}

自费的dAPI为开发者提供了以最少的前期付出体验数据源的机会，在使用托管dAPI之前提供了低风险的选择。

通过自费的dAPI，您可以用自己的资金为dAPI提供资金。您提供的Gas数量将决定您dAPI的可用时间。如果您的Gas耗尽，您可以再次为dAPI提供资金以使其可供使用。

以下为访问自筹数据源的流程：

1. 探索API3 Market并选取一个dAPI
2. 资助一个赞助者钱包
3. 部署一个代理合约以访问数据源
4. 从dAPI读取数据

![API3 Remix deploy](/images/builders/integrations/oracles/api3/api3-4.png)

#### 从API3 Market中选取一个dAPI {: #select-a-dapi }

[API3 Market](https://market.api3.org/dapis){target=_blank}使用户能够连接到dAPI并访问相关的数据馈送服务。它提供了跨多个链（包括测试网）可用的所有dAPI的列表。您可以按链和数据提供商过滤列表。您还可以根据名称搜索特定的dAPI。点击dAPI进入详细信息页面，获取有关dAPI的更多信息。

#### 资助一个赞助商钱包 {: #fund-sponsor-wallet }

选择中意的dAPI后，您可以使用[API3 Market](https://market.api3.org/){target=_blank}激活它，将资金（DEV、MOVR或GLMR）发送到`sponsorWallet `。确保您的：

- 钱包连接至市场以及与您资助的dAPI为相同网络
- 您钱包中的余额需要大于您发送至`sponsorWallet`的Token数量

要资助dAPI，您需要点击**Fund Gas**按钮。根据代理合约是否已部署，您将看到不同的UI。

![API3 Remix deploy](/images/builders/integrations/oracles/api3/api3-6.png)

使用Gas预测器选取dAPI需要多少Gas。点击**Send DEV**发送您先前为指定dAPI输入的数量。

![API3 Remix deploy](/images/builders/integrations/oracles/api3/api3-7.png)

当交易完成并在区块链上确认后将会出现在屏幕上。

#### 部署一个代理合约以访问dAPI {: #deploy-proxy }

智能合约能够与已部署在区块链上的合约交互并从其中读取数值。通过API3 Market部署一个代理合约，去中心化应用能够交互并从dAPI读取如ETH/USD的数据。

!!! 注意事项
    如果自费的dAPI已经部署了代理，则dApp无需部署代理合约即可读取dAPI。他们将通过使用已部署的代理合约并在API3 Market上可见的地址来做到这一点。

如果您在资助过程中部署代理合约，则可以点击**Get Proxy**按钮将向您的钱包发起一笔交易，该交易将部署代理合约。

![API3 Remix deploy](/images/builders/integrations/oracles/api3/api3-8.png)

当交易完成并在区块链上确认后，代理合约地址将会在界面中显示。

#### 读取自费的dAPI {: #read-dapis }

以下为一个读取自费dAPI的基础合约范例：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@api3/contracts/v0.8/interfaces/IProxy.sol";

contract DataFeedReaderExample is Ownable {
    // This contract reads from a single proxy. Your contract can read from multiple proxies.
    address public proxy;

    // Updating the proxy address is a security-critical action. In this example, only
    // the owner is allowed to do so.
    function setProxy(address _proxy) public onlyOwner {
        proxy = _proxy;
    }

    function readDataFeed()
        external
        view
        returns (int224 value, uint256 timestamp)
    {
        (value, timestamp) = IProxy(proxy).read();
        // If you have any assumptions about `value` and `timestamp`, make sure
        // to validate them right after reading from the proxy.
    }
}
```

范例合约包含两个函数：

- `setProxy()` - 用于设置dAPI代理合约的地址
- `readDataFeed()` - 返回设定dAPI最新价格的`view`函数

[您可以尝试在Remix上部署](https://remix.ethereum.org/#url=https://gist.githubusercontent.com/vanshwassan/1ec4230956a78c73a00768180cba3649/raw/176b4a3781d55d6fb2d2ad380be0c26f412a7e3c/DapiReader.sol){target=_blank}

另外，您可以在[API3的官方文档网站](https://docs.api3.org/guides/dapis/subscribing-self-funded-dapis/)中获取更多资讯{target=_blank}。

## API3 QRNG {: #api3-qrng }

[API3 QRNG](https://docs.api3.org/explore/qrng/){target=_blank}是由澳大利亚国立大学（ANU）提供的公共实用程序。它由ANU Quantum Random Numbers托管的Airnode提供支持，意味着它是第一方服务。它是一种公共产品，无需付费即可使用（除了Gas成本），并且当需要RNG上链时，它通过易于使用的解决方案提供“真正的”量子随机性。

为了请求链上的随机性，请求者向AirnodeRrpV0提交随机数请求。ANU Airnode从AirnodeRrpV0协议合约收集请求，检索链下随机数，并将其发送回AirnodeRrpV0。收到后，它会使用随机数对请求者执行回调。

以下为请求随机数的基础`QrngRequester`范例：

```solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.9;
import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";

contract RemixQrngExample is RrpRequesterV0 {
    event RequestedUint256(bytes32 indexed requestId);
    event ReceivedUint256(bytes32 indexed requestId, uint256 response);

    address public airnode;
    bytes32 public endpointIdUint256;
    address public sponsorWallet;
    mapping(bytes32 => bool) public waitingFulfillment;

    // These are for Remix demonstration purposes, their use is not practical.
    struct LatestRequest { 
      bytes32 requestId;
      uint256 randomNumber;
    }
    LatestRequest public latestRequest;

    constructor(address _airnodeRrp) RrpRequesterV0(_airnodeRrp) {}

    // Normally, this function should be protected, as in:
    // require(msg.sender == owner, "Sender not owner");
    function setRequestParameters(
        address _airnode,
        bytes32 _endpointIdUint256,
        address _sponsorWallet
    ) external {
        airnode = _airnode;
        endpointIdUint256 = _endpointIdUint256;
        sponsorWallet = _sponsorWallet;
    }

    function makeRequestUint256() external {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointIdUint256,
            address(this),
            sponsorWallet,
            address(this),
            this.fulfillUint256.selector,
            ""
        );
        waitingFulfillment[requestId] = true;
        latestRequest.requestId = requestId;
        latestRequest.randomNumber = 0;
        emit RequestedUint256(requestId);
    }

    function fulfillUint256(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(
            waitingFulfillment[requestId],
            "Request ID not known"
        );
        waitingFulfillment[requestId] = false;
        uint256 qrngUint256 = abi.decode(data, (uint256));
        // Do what you want with `qrngUint256` here...
        latestRequest.randomNumber = qrngUint256;
        emit ReceivedUint256(requestId, qrngUint256);
    }
}
```

范例合约包含以下三个函数：

- `setRequestParameters` - 接受并设置以下三个请求参数：
    - `airnode` - 用于检索QRNG数据的Airnode地址
    - `endpointIdUint256` - Airnode的端点ID
    - `sponsorWallet` - 资助者钱包的地址
- `makeRequestUint256` - 调用`AirnodeRrpV0.sol`协议合约的`airnodeRrp.makeFullRequest()`函数以添加存储要求并返回`requestId`
- `fulfillUint256` - 接受并解码请求随机数

!!! 注意事项
    您可以从下面的[QRNG提供商](#qrng-providers)部分获取`airnode`地址和`endpointIdUint256`。

[您可以尝试在Remix上部署](https://remix.ethereum.org/#url=https://github.com/vanshwassan/RemixContracts/blob/master/contracts/QrngRequester.sol&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.9+commit.e5eed63a.js){target=_blank}。

### QRNG Airnode和端点提供者 {: #qrng-providers }

您可以使用以下Airnode和端点尝试QRNG：

=== "Moonbeam"

    |            变量             |                         值                         |
    |:---------------------------:|:--------------------------------------------------:|
    |  ANU QRNG Airnode Address   |   `{{ networks.moonbeam.api3.anuqrngairnode }}`    |
    |    ANU QRNG Airnode xpub    |     `{{ networks.moonbeam.api3.anuqrngxpub }}`     |
    |  ANU Endpoint ID (uint256)  |   `{{ networks.moonbeam.api3.anuqrnguint256 }}`    |
    | ANU Endpoint ID (uint256[]) | `{{ networks.moonbeam.api3.anuqrnguint256array }}` |

=== "Moonriver"

    |            变量             |                         值                          |
    |:---------------------------:|:---------------------------------------------------:|
    |  ANU QRNG Airnode Address   |   `{{ networks.moonriver.api3.anuqrngairnode }}`    |
    |    ANU QRNG Airnode xpub    |     `{{ networks.moonriver.api3.anuqrngxpub }}`     |
    |  ANU Endpoint ID (uint256)  |   `{{ networks.moonriver.api3.anuqrnguint256 }}`    |
    | ANU Endpoint ID (uint256[]) | `{{ networks.moonriver.api3.anuqrnguint256array }}` |

=== "Moonbase Alpha"

    |              变量              |                          值                           |
    |:------------------------------:|:-----------------------------------------------------:|
    |  Nodary QRNG Airnode Address   |   `{{ networks.moonbase.api3.nodaryqrngairnode }}`    |
    |    Nodary QRNG Airnode xpub    |     `{{ networks.moonbase.api3.nodaryqrngxpub }}`     |
    |  Nodary Endpoint ID (uint256)  |   `{{ networks.moonbase.api3.nodaryqrnguint256 }}`    |
    | Nodary Endpoint ID (uint256[]) | `{{ networks.moonbase.api3.nodaryqrnguint256array }}` |

*关于完整的QRNG提供者列表，您可以查看[API3的官方文档网站](https://docs.api3.org/qrng/reference/providers.html){target=_blank}。*

## Additional Resources - 参考资料 {: #additional-resources }

以下为一些额外的开发者资源：

- [API3 Docs](https://docs.api3.org/){target=_blank}
    - [dAPI Docs](https://docs.api3.org/explore/dapis/what-are-dapis.html){target=_blank}
    - [QRNG Docs](https://docs.api3.org/explore/qrng/){target=_blank}
- [API3 DAO GitHub](https://github.com/api3dao/){target=_blank}
- [API3 Medium](https://medium.com/api3){target=_blank}

--8<-- 'text/_disclaimers/third-party-content.md'
