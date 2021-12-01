### API供应者 {: #api-provider } 

Moonriver支持以下API供应者: 

- [PureStake](/builders/get-started/api-providers#purestake-development-endpoints) - 仅供开发使用
- [Bware Labs](https://bwarelabs.com/)
- [OnFinality](https://onfinality.io/)

更多相关信息请查看[API供应者](/builders/get-started/api-providers)文档。

### 快速开始 {: #quick-start }  

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

### Chain ID {: #chain-id } 

Moonriver的Chain ID为： `1285`，hex：`0x505`。
