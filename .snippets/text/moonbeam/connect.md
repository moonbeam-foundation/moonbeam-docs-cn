## 连接至Moonbeam

### 网络端点

Moonbeam有两种端点可供用户连接：一种是HTTPS，另一种是WSS。如果您需要适用于生产环境使用的端点，请参考官方资料库的[端点提供者](/builders/get-started/endpoints/#endpoint-providers)部分，从受支持的提供商之一获取您自己的端点和API 密钥。

### 快速开始 {: #quick-start }

在开始之前，请确保从受支持的[网络端点](/builders/get-started/endpoints/){target=_blank}提供商之一获取您自己的端点和API密钥。如果使用的是web3.js库，您可以创建一个本地的Web3实例并设定提供者来连接Moonbeam（同时支持HTTP和WS）：

```js
const Web3 = require('web3'); //Load Web3 library
.
.
.
//Create local Web3 instance - set Moonbeam as provider
const web3 = new Web3("RPC-API-ENDPOINT-HERE"); // Insert your RPC URL here
```

如果使用的是ethers.js库，您可以使用`ethers.providers.StaticJsonRpcProvider(providerURL, {object})`来定义提供者，并且将提供者URL设定至Moonbeam：

```js
const ethers = require('ethers');

const providerURL = "https://rpc.api.moonbeam.network";
// Define Provider
const provider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
    chainId: 1284,
    name: 'moonbeam'
});
```

任何以太坊钱包都应当能够为Moonbeam生成有效地址（例如：[MetaMask](https://metamask.io/)）。

### Chain ID {: #chain-id } 

Moonbeam的Chain ID为`1284`，hex为`0x504`。
