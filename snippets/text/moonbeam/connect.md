## 连接至Moonbeam

### 网络端点

Moonbeam有两种端点可供用户连接：一种是HTTPS，另一种是WSS。

如果您需要适用于生产环境使用的端点，请参考Moonbeam官方资料库的[端点提供者](/builders/get-started/endpoints/#endpoint-providers)部分。如果仅为开发环境使用，您可以使用以下HTTPS或WSS端点：

--8<-- 'code/endpoints/moonbeam.md'

### 快速开始 {: #quick-start }

如果使用的是web3.js库，您可以创建一个本地的Web3实例并设定提供者来连接Moonbeam（同时支持HTTP和WS）：

```js
const Web3 = require('web3'); //Load Web3 library
.
.
.
//Create local Web3 instance - set Moonbeam as provider
const web3 = new Web3("https://rpc.api.moonbeam.network"); 
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
