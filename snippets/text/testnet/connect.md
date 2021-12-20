## 连接Moonbase Alpha {: #connect-to-moonbase-alpha } 

### 网络端点 {: #network-endpoints } 

Moonbase Alpha有两类端点供用户使用：HTTPS和WSS。

如果您需要生产环境可以使用的端点，请参考[网络端点](/builders/get-started/endpoints/#endpoint-providers) 指南。如果仅为开发环境使用，您可以使用以下的公用端点：

--8<-- 'code/endpoints/moonbase.md'

### 快速开始 {: #quick-start }  

如果使用的是web3.js库，您可以创建一个本地的Web3实例并设定provider（提供者）来连接Moonbase Alpha（同时支持HTTP和WS）：

```js
const Web3 = require('web3'); //Load Web3 library
.
.   
.
//Create local Web3 instance - set Moonbase Alpha as provider
const web3 = new Web3('https://rpc.api.moonbase.moonbeam.network'); 
```
如果使用的是ethers.js库，您可以使用`ethers.providers.StaticJsonRpcProvider(providerURL, {object})` 来定义开发者，并且将provider（提供者）URL设定至Moonbase Alpha：

```js
const ethers = require('ethers');


const providerURL = 'https://rpc.api.moonbase.moonbeam.network';
// Define Provider
const provider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
    chainId: 1287,
    name: 'moonbase-alphanet'
});
```

任何以太坊钱包都应当能够生成可以使用Moonbeam的地址（例如：[MetaMask](https://metamask.io/)）。

### Chain ID {: #chain-id } 

Moonbase Alpha测试网的Chain ID为：`1287`，hex：`0x507`。

### 中继链 {: #relay-chain } 

想要链接至由PureStake管理的Moonbase Alpha中继链，可使用以下WS终端：

```
wss://wss-relay.testnet.moonbeam.network
```
