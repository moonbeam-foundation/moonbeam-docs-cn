## 连接Moonriver {: #connect-to-moonriver } 

### 网络端点 {: #network-endpoints } 

Moonriver有两类端点供用户使用：HTTPS和WSS。如果您需要适用于生产环境使用的端点，请参考官方资料库的[端点提供者](/builders/get-started/endpoints/#endpoint-providers)部分，从受支持的提供商之一获取您自己的端点和API密钥。

### 快速开始 {: #quick-start }  

在开始之前，请确保从受支持的[网络端点](/builders/get-started/endpoints/){target=_blank}提供商之一获取您自己的端点和API密钥。如果使用的是web3.js库，您可以创建一个本地的Web3实例并设定provider（提供者）来连接Moonriver（同时支持HTTP和WS）：

```js
const Web3 = require('web3'); //Load Web3 library
.
.
.
//Create local Web3 instance - set Moonriver as provider
const web3 = new Web3("RPC-API-ENDPOINT-HERE"); // Insert your RPC URL here
```
如果使用的是ethers.js库，您可以使用`ethers.providers.StaticJsonRpcProvider(providerURL, {object})` 来定义开发者，并且将provider（提供者）URL设定至Moonriver：

```js
const ethers = require('ethers');


const providerURL = "https://rpc.api.moonriver.moonbeam.network";
// Define Provider
const provider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
    chainId: 1285,
    name: 'moonriver'
});
```

任何以太坊钱包都应当能够生成可以使用Moonbeam的地址（例如：[MetaMask](https://metamask.io/)）。

### Chain ID {: #chain-id } 

Moonriver的Chain ID为： `1285`，hex：`0x505`。
