---
title: 如何使用Polkadot.js API
description: 跟随此教程学习如何使用polkadot.js API库在Moonbeam上查询链数据、发送交易以及更多。
---

# Polkadot.js API库

![Intro diagram](/images/builders/build/substrate-api/polkadot-js-api/polkadot-js-api-banner.png)

## 概览 {: #introduction }

[Polkadot.js API](https://polkadot.js.org/docs/api/){target=_blank}库允许应用程序开发者查询Moonbeam节点并使用JavaScript与节点的Polkadot或Substrate接口交互。在本教程中您将找到可用功能的概述和一些常用的代码示例，助您快速使用polkadot.js API库与Moonbeam网络交互。

## 查看先决条件 {: #checking-prerequisites }

在开始安装和使用polkadot.js API库之前，您需要先安装node.js。

--8<-- 'text/common/install-nodejs.md'

--8<-- 'text/common/endpoint-examples.md'

### 安装Polkadot.js API库 {: #installing-polkadot.js-api-library }

首先，您需要通过应用程序包管理器（如`yarn`）为您的项目安装polkadot.js API库。您可以通过运行以下命令将其安装至您的项目目录：

```
yarn add @polkadot/api
```

### 安装Moonbeam Types Bundle {: #moonbeam-types-bundle }

要解码Moonbeam自定义事件和类型，你将需要通过添加以下内容至您的`package.json`以将[Moonbeam Types Bundle](https://www.npmjs.com/package/moonbeam-types-bundle){target=_blank}包含在您的项目中：

```json
"@polkadot/api": "^{{ networks.moonbase.moonbeam_types_bundle.stable_version }}",
"moonbeam-types-bundle": "^{{ networks.moonbase.moonbeam_types_bundle.polkadot_js_dependency_version }}",
"typescript": "{{ networks.moonbase.moonbeam_types_bundle.typescript_dependency_version }}"
```

并将以下文本添加到项目文件的开头：

```javascript
import { typesBundlePre900 } from "moonbeam-types-bundle"
```

## 创建API提供商实例 {: #creating-an-API-provider-instance }

与ETH API库相似，您必须先实例化一个polkadot.js API的API实例。使用您想要交互的Moonbeam网络的websocket端点创建`WsProvider`。

--8<-- 'text/common/endpoint-examples.md'

=== "Moonbeam"
    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    // Construct API provider
    const wsProvider = new WsProvider('{{ networks.moonbeam.wss_url }}');
    const api = await ApiPromise.create({ provider: wsProvider });
    ```

=== "Moonriver"
    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    // Construct API provider
    const wsProvider = new WsProvider('{{ networks.moonriver.wss_url }}');
    const api = await ApiPromise.create({ provider: wsProvider });
    ```

=== "Moonbase Alpha"
    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    // Construct API provider
    const wsProvider = new WsProvider('{{ networks.moonbase.wss_url }}');
    const api = await ApiPromise.create({ provider: wsProvider });
    ```

=== "Moonbeam Dev Node"
    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    // Construct API provider
    const wsProvider = new WsProvider('{{ networks.development.wss_url }}');
    const api = await ApiPromise.create({ provider: wsProvider });
    ```

### 元数据和动态API修饰 {: #metadata-and-dynamic-api-decoration }

在深入了解通过polkadot.js API库执行不同任务的细节之前，您需要先了库的一些基本运作原理。

当polkadot.js API连接至节点时，首要做的一件事是检索元数据并根据元数据信息修饰API。元数据有效地以`api.<type>.<module>.<section>`形式提供数据，这些数据适合以下`<type>`类别之一：`consts`、`query`和`tx`。

因此，`api.{consts, query, tx}.<module>.<method>`端点中包含的所有信息都不是硬编码在API中的。这将允许如Moonbeam这样的平行链通过其Pallet自定义端点，这些端点可以通过polkadot.js API库直接访问。

## 查询信息 {: #querying-for-information }

在这一部分，您将学习如何使用polkadot.js API库查询链上信息。

### 状态查询 {: #state-queries }

这个类别的查询将检索与链当前状态的相关信息。这些端点通常采用`api.query.<module>.<method>`形式，其中模块和函数修饰是通过元数据生成。您可以通过检查`api.query`对象、通过`console.log(api.query)`或其他方式查看所有可用端点的列表。

以下是一个代码示例，用于检索给定地址的基本账户信息：

```javascript
// Initialize the API provider as in the previous section
...

// Define wallet address
const addr = 'MOONBEAM-WALLET-ADDRESS-HERE';

// Retrieve the last timestamp
const now = await api.query.timestamp.now();

// Retrieve the account balance & current nonce via the system module
const { nonce, data: balance } = await api.query.system.account(addr);

// Retrieve the given account's next index/nonce, taking txs in the pool into account
const nextNonce = await api.rpc.system.accountNextIndex(addr);

console.log(`${now}: balance of ${balance.free} and a current nonce of ${nonce} and next nonce of ${nextNonce}`);
```

You can view the [complete script on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/substrate-api/state-queries.js){target=_blank}.

您可以[在GitHub上查看完整的脚本](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/substrate-api/state-queries.js){target=_blank}。

### RPC查询 {: #rpc-queries }

RPC调用为与节点之间的数据传输提供了骨干网。这意味着所有API端点，如`api.query`、`api.tx`和`api.derive`只是包装RPC调用，以节点预期的编码格式提供信息。

`api.rpc`接口遵循`api.query`类似的格式，例如：

```javascript
// Initialize the API provider as in the previous section
...

// Retrieve the chain name
const chain = await api.rpc.system.chain();

// Retrieve the latest header
const lastHeader = await api.rpc.chain.getHeader();

// Log the information
console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
```

You can view the [complete script on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/substrate-api/rpc-queries.js){target=_blank}.

您可以[在GitHub上查看完整的脚本](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/substrate-api/rpc-queries.js){target=_blank}。

### 查询订阅 {: #query-subscriptions }

RPC支持使用订阅函数。我们可以修改先前的示例，使其开始使用订阅函数来监听新的区块。

```javascript
// Initialize the API provider as in the previous section
...

// Retrieve the chain name
const chain = await api.rpc.system.chain();

// Subscribe to the new headers
await api.rpc.chain.subscribeNewHeads((lastHeader) => {
  console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
});
```

`api.rpc.subscribe*`函数的基本模式是将回调传递给订阅函数，这将在每个新条目被导入时触发。

其他在`api.query.*`下的调用可以通过类似的方式修改以使用订阅函数，包括具有参数的调用。以下是一个订阅账户余额变化的示例：

```javascript
// Initialize the API provider as in the previous section
...

// Define wallet address
const addr = 'MOONBEAM-WALLET-ADDRESS-HERE';

// Subscribe to balance changes for a specified account
await api.query.system.account(addr, ({ nonce, data: balance }) => {
  console.log(`free balance is ${balance.free} with ${balance.reserved} reserved and a nonce of ${nonce}`);
});
```

您可以[在GitHub上查看完整的脚本](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/substrate-api/query-subscriptions.js){target=_blank}。

## Keyrings {: #keyrings }

Keyring用于维持密钥对以及任何数据的签署，无论是传送、消息或者合约交互。

### 创建Keyring实例 {: #creating-a-keyring-instance }

您可以通过创建Keyring级别的实例并指定使用的默认钱包地址类型来创建一个实例。对于Moonbeam网络，其默认钱包类型为`ethereum`。

```javascript
// Import the keyring as required
import { Keyring } from '@polkadot/api';

// Create a keyring instance
const keyring = new Keyring({ type: 'ethereum' });
```

### 添加账户 {: #adding-accounts }

将账户添加至keyring实例有多种方式，包括通过助记词和短格式密钥。以下范例代码将为您提供一些示例：

```javascript
// Import the required packages
import Keyring from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import { mnemonicToLegacySeed, hdEthereum} from '@polkadot/util-crypto';

// Import Ethereum account from mnemonic
const keyringECDSA = new Keyring({ type: 'ethereum' });
const mnemonic = 'MNEMONIC-HERE';

// Define index of the derivation path and the derivation path
const index = 0;
const ethDerPath = "m/44'/60'/0'/0/" + index;
const subsDerPath = '//hard/soft';
console.log(`Mnemonic: ${mnemonic}`);
console.log(`--------------------------\n`);

// Extract Ethereum address from mnemonic
const newPairEth = keyringECDSA.addFromUri(`${mnemonic}/${ethDerPath}`);
console.log(`Ethereum Derivation Path: ${ethDerPath}`);
console.log(`Derived Ethereum Address from Mnemonic: ${newPairEth.address}`);

// Extract private key from mnemonic
const privateKey = u8aToHex(
  hdEthereum(mnemonicToLegacySeed(mnemonic, '', false, 64), ethDerPath).secretKey
);
console.log(`Derived Private Key from Mnemonic: ${privateKey}`);
console.log(`--------------------------\n`);

// Extract address from private key
const otherPair = await keyringESDSA.addFromUri(privateKey);
console.log(`Derived Address from Private Key: ${otherPair.address}`);
```

## 事务 {: #transactions }

由元数据确定的事务端点在`api.tx`端点上公开显示。这允许您提交事务使其包含在区块中，如传送、部署合约、与Pallet交互或者Moonbeam支持的其他内容等。

### 发送基本事务 {: #sending-basic-transactions }

以下是一个从Alice发送基本事务给Bob的示例：

```javascript
// Initialize the API provider as in the previous section
...

// Initialize the keyring instance as in the previous section
...

// Initialize wallet key pairs
const alice = keyring.addFromUri('ALICE-ACCOUNT-PRIVATE-KEY');
const bob = 'BOB-ACCOUNT-PUBLIC-KEY';

// Sign and send a transfer from Alice to Bob
const txHash = await api.tx.balances
  .transfer(bob, 12345)
  .signAndSend(alice);

// Show the hash
console.log(`Submitted with hash ${txHash}`);
```

您可以[在GitHub上查看完整的脚本](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/substrate-api/basic-transactions.js){target=_blank}。

请注意`signAndSend`函数也可以接受如`nonce`等可选参数。例如，`signAndSend(alice, { nonce: aliceNonce })`。您可以使用[状态查询的示例代码](/builders/build/substrate-api/polkadot-js-api/#state-queries){target=_blank} 来获取正确数据，包括内存池（mempool）中的事务。

### 事务事件 {: #transaction-events }

任何事务将会发出事件，无论如何这将始终为特定事务发送`system.ExtrinsicSuccess`或`system.ExtrinsicFailed`事件。这些为事务提供整体执行结果，即执行成功或失败。

根据发送的事务，可能还会发出一些其他事件，例如余额转账事件，这其中可能包括一个或多个`balance.Transfer`事件。

转账API页面包含一个[示例代码片段](/builders/get-started/eth-compare/transfers-api/#monitor-all-balance-transfers-with-the-substrate-api){target=_blank}，用于订阅新的最终区块头并检索所有`balance.Transfer`事件。

### 批处理事务 {: #batching-transactions }

Polkadot.js API允许通过`api.tx.utility.batch`函数批处理事务。这些批处理事务从同一个发送者按顺序依次处理。事务处理费可以使用`paymentInfo`函数来计算。以下示例进行了多笔转账，同时也使用`api.tx.parachainStaking`模块来发起请求以减少特定候选收集人的绑定量：

```javascript
// Initialize the API provider as in the previous section
...

// Initialize the keyring instance as in the previous section
...

// Initialize wallet key pairs as in the previous section
...

// Construct a list of transactions we want to batch
const collator = 'COLLATOR-ACCOUNT-PUBLIC-KEY';
const txs = [
  api.tx.balances.transfer(bob, 12345),
  api.tx.balances.transfer(charlie, 12345),
  api.tx.parachainStaking.scheduleDelegatorBondLess(collator, 12345)
];

// Estimate the fees as RuntimeDispatchInfo, using the signer (either
// address or locked/unlocked keypair) 
const info = await api.tx.utility
  .batch(txs)
  .paymentInfo(alice);

console.log(`estimated fees: ${info}`);

// Construct the batch and send the transactions
api.tx.utility
  .batch(txs)
  .signAndSend(alice, ({ status }) => {
    if (status.isInBlock) {
      console.log(`included in ${status.asInBlock}`);
    }
  });
```

您可以[在GitHub上查看完整的脚本](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/substrate-api/batch-transactions.js){target=_blank}。

!!! 注意事项

​	您可以通过添加`console.log(api.tx.parachainStaking);`到代码，查看`parachainStaking`模块的全部可用功能。

## 自定义RPC请求 {: #custom-rpc-requests }

RPC作为函数在特定模块公开显示。这意味着一旦可使用后，您可以通过`api.rpc.<module>.<method>(...params[])`调用任意RPC。这也同样适用于以`polkadotApi.rpc.eth.*`形式使用polkadot.js API访问以太坊RPC。

您可以通过调用`api.rpc.rpc.methods()`来检查公开的RPC端点的列表，该列表为节点公开的已知RPC列表。

[共识和确定性页面](/builders/get-started/eth-compare/consensus-finality/#)提供了使用自定义RPC调用来检查给定事务确定性的示例。

--8<-- 'text/disclaimers/third-party-content.md'
