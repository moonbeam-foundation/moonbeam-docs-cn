Moonriver的RPC和WSS端点目前由PureStake提供，仅为开发环境应同使用，而不为生产环境应用使用。以下为其他端点服务供应者:

- [OnFinality](https://onfinality.io/)
- [Elara](https://elara.patract.io/)

### HTTPS DNS {: #https-dns } 

如果您想使用HTTPS连接至Moonriver， 您只需将您的provider（提供者）导至以下的RPC DNS：

```
https://rpc.moonriver.moonbeam.network
```

如果使用的是web3.js库，您可以创建一个本地的Web3实例并设定provider（提供者）来连接Moonriver（同时支持HTTP和WS）：

```js
const Web3 = require('web3'); //Load Web3 library
.
.
.
//Create local Web3 instance - set Moonriver as provider
const web3 = new Web3("https://rpc.moonriver.moonbeam.network"); 
```
如果使用的是ethers.js库，您可以使用`ethers.providers.StaticJsonRpcProvider(providerURL, {object})` 来定义开发者，并且将provider（提供者）URL设定至Moonriver：

```js
const ethers = require('ethers');


const providerURL = "https://rpc.moonriver.moonbeam.network";
// Define Provider
const provider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
    chainId: 1285,
    name: 'moonriver'
});
```

任何以太坊钱包都应当能够生成可以使用Moonbeam的地址（例如：[MetaMask](https://metamask.io/)）。

### WSS DNS {: #wss-dns } 

如果想使用WebSocket连接，你可以使用以下的DNS：

```
wss://wss.moonriver.moonbeam.network
```

### Chain ID {: #chain-id } 

Moonriver的Chain ID为： `1285`，hex：`0x505`。
