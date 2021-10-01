### HTTPS DNS {: #https-dns } 

如果您想使用HTTPS连接至Moonbase Alpha， 您只需将您的provider（提供者）导至以下的RPC DNS：

```
https://rpc.testnet.moonbeam.network
```

如果使用的是web3.js库，您可以创建一个本地的Web3实例并设定provider（提供者）来连接Moonbase Alpha（同时支持HTTP和WS）：

```js
const Web3 = require('web3'); //Load Web3 library
.
.
.
//Create local Web3 instance - set Moonbase Alpha as provider
const web3 = new Web3('{{ networks.moonbase.rpc_url }}'); 
```
如果使用的是ethers.js库，您可以使用`ethers.providers.StaticJsonRpcProvider(providerURL, {object})` 来定义开发者，并且将provider（提供者）URL设定至Moonbase Alpha：

```js
const ethers = require('ethers');


const providerURL = 'https://rpc.testnet.moonbeam.network';
// Define Provider
const provider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
    chainId: 1287,
    name: 'moonbase-alphanet'
});
```

任何以太坊钱包都应当能够生成可以使用Moonbeam的地址（例如：[MetaMask](https://metamask.io/)）。

### WSS DNS {: #wss-dns } 

如果想使用WebSocket连接，您可以使用以下的DNS：

```
wss://wss.testnet.moonbeam.network
```

### Chain ID {: #chain-id } 

Moonbase Alpha测试网的Chain ID为：`1287`，hex：`0x507`。

### 中继链 {: #relay-chain } 

想要链接至由PureStake管理的Moonbase Alpha中继链，可使用以下WS终端：

```
wss://wss-relay.testnet.moonbeam.network
```