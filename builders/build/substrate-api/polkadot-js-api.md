---
title: 如何使用Polkadot.js API
description: 了解如何使用Polkadot.js API与Moonbeam节点交互以获取链数据并通过Moonbeam的Substrate端发送交易（extrinsic）。
---

# Polkadot.js API库

## 概览 {: #introduction }

[Polkadot.js](https://wiki.polkadot.network/docs/polkadotjs){target=_blank}是一组工具，可让您与Polkadot及其平行链（例如Moonbeam）进行交互。[Polkadot.js API](https://polkadot.js.org/docs/api/){target=_blank}是Polkadot.js集合的一个组件，它也是一个的=Javascript库。它能帮助开发者访问Moonbeam节点，与Substrate界面交互，让开发者能读取和写入数据到网络。

您可以使用Polkadot.js API查询链上数据并从Moonbeam的Substrate端发送extrinsic。您可以查询Moonbeam的runtime（运行时）常量、链状态、事件、交易（extrinsic）数据等。

在这篇文章中，你能找到Polkadot.js API库中可用功能的概述，以及一些使用Polkadot.js API库与Moonbeam网络交互的常用代码示例。

## 查看先决条件 {: #checking-prerequisites }

在开始安装和使用Polkadot.js API库之前，您需要先安装Node.js。

--8<-- 'text/_common/install-nodejs.md'

--8<-- 'text/_common/endpoint-examples.md'

### 安装Polkadot.js API库 {: #installing-polkadot.js-api-library }

首先，您需要通过应用程序包管理器（如`yarn`）为您的项目安装Polkadot.js API库。您可以通过运行以下命令将其安装至您的项目目录：

=== "npm"

    ```bash
    npm i @polkadot/api
    ```

=== "yarn"

    ```bash
    yarn add @polkadot/api
    ```

该库还包括其他核心组件，如用于账户管理的Keyring，或一些别的在本指南中会使用到的其它组件。

## 创建API Provider实例 {: #creating-an-API-provider-instance }

与[以太坊API库](/builders/build/eth-api/libraries/){target=_blank}相似，您必须先实例化一个Polkadot.js API的API实例。使用您想要交互的Moonbeam网络的websocket端点创建`WsProvider`。

--8<-- 'text/_common/endpoint-examples.md'

=== "Moonbeam"

    ```javascript

    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    const main = async () => {
      // Construct API provider
      const wsProvider = new WsProvider('{{ networks.moonbeam.wss_url }}');
      const api = await ApiPromise.create({ provider: wsProvider });

      // Code goes here

      await api.disconnect()
    }

    main();
    ```

=== "Moonriver"

    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    const main = async () => {
      // Construct API provider
      const wsProvider = new WsProvider('{{ networks.moonriver.wss_url }}');
      const api = await ApiPromise.create({ provider: wsProvider });

      // Code goes here

      await api.disconnect()
    }

    main();
    ```

=== "Moonbase Alpha"

    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    const main = async () => {
      // Construct API provider
      const wsProvider = new WsProvider('{{ networks.moonbase.wss_url }}');
      const api = await ApiPromise.create({ provider: wsProvider });

      // Code goes here

      await api.disconnect()
    }

    main();
    ```

=== "Moonbeam开发节点"

    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    const main = async () => {
      // Construct API provider
      const wsProvider = new WsProvider('{{ networks.development.wss_url }}');
      const api = await ApiPromise.create({ provider: wsProvider });

      // Code goes here

      await api.disconnect()
    }

    main();
    ```

### 元数据和动态API修饰 {: #metadata-and-dynamic-api-decoration }

在深入了解通过Polkadot.js API库执行不同任务的细节之前，您需要先了库的一些基本运作原理。

当Polkadot.js API连接至节点时，首要做的一件事是检索元数据并根据元数据信息修饰API。元数据有效地以

```text
api.<type>.<module>.<section>
```

形式提供数据。
这些数据适合以下`<type>`类别之一

- `query` - 获取state信息的端口
- `tx` - 或许交易的端口
- `rpc` - 用来发送RPC请求的端口
- `consts` - 用来获取runtime常数的端口

因此，`api.{consts, query, tx}.<module>.<method>`端点中包含的所有信息都不是硬编码在API中的。这将允许如Moonbeam这样的平行链通过其[Pallet](/builders/pallets-precompiles/pallets/){target=_blank}自定义端点，这些端点可以通过Polkadot.js API库直接访问。

## 查询Moonbeam的链上数据 {: #querying-for-information }

在这一部分，您将学习如何使用Polkadot.js API库查询链上信息。

### Moonbeam链状态查询 {: #state-queries }

这个类别的查询将检索与链当前状态的相关信息。这些端点通常采用`api.query.<module>.<method>`形式，其中模块和函数修饰是通过元数据生成。您可以通过检查`api.query`对象、通过`console.log(api.query)`来查看所有可用端点的列表：

```javascript
console.log(api.query);
```

假设您已成功[初始化API](#creating-an-API-provider-instance), 这里是一个获取给定地址的基本账户信息的代码示例：:

```javascript

// Define wallet address
const addr = 'INSERT_ADDRESS';

// Retrieve the last timestamp
const now = await api.query.timestamp.now();

// Retrieve the account balance & current nonce via the system module
const { nonce, data: balance } = await api.query.system.account(addr);

console.log(`${now}: balance of ${balance.free} and a current nonce of ${nonce}`);
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/build/substrate-api/polkadot-js-api/state-queries.js'
    ```

### Moonbeam RPC查询 {: #rpc-queries }

RPC调用为与节点之间的数据传输提供了骨干网。这意味着所有API端点，如`api.query`、`api.tx`和`api.derive`只是包装RPC调用，以节点预期的编码格式提供信息。您可以通过检查`api.rpc`对象来查看所有可用端点的列表：

```javascript
console.log(api.rpc);
```

`api.rpc`接口遵循`api.query`类似的格式，例如：

```javascript
// Retrieve the chain name
const chain = await api.rpc.system.chain();

// Retrieve the latest header
const lastHeader = await api.rpc.chain.getHeader();

// Log the information
console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/build/substrate-api/polkadot-js-api/rpc-queries.js'
    ```

### 查询订阅 {: #query-subscriptions }

`rpc` API也提供了订阅（subscription）端口. RPC支持使用订阅函数。您可以通过修改先前的示例，使其开始使用订阅函数来监听新的区块。请注意在复用示例代码时，您需要删除API disconnect部分, 否则WSS连接将会关闭.

```javascript
// Retrieve the chain name
const chain = await api.rpc.system.chain();

// Subscribe to the new headers
await api.rpc.chain.subscribeNewHeads((lastHeader) => {
  console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
});

// Remove await api.disconnect()!
```

`api.rpc.subscribe*`函数的基本模式是将回调传递给订阅函数，这将在每个新条目被导入时触发。

其他在`api.query.*`下的调用可以通过类似的方式修改以使用订阅函数，包括具有参数的调用。以下是一个如何订阅账户余额变化的示例：

```javascript
// Define wallet address
const addr = 'INSERT_ADDRESS';

// Subscribe to balance changes for a specified account
await api.query.system.account(addr, ({ nonce, data: balance }) => {
 console.log(`Free balance is ${balance.free} with ${balance.reserved} reserved and a nonce of ${nonce}`);
});

// Remove await api.disconnect()!
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/build/substrate-api/polkadot-js-api/query-subscriptions.js'
    ```

## 为Moonbeam账户创建Keyring {: #keyrings }

Keyring用于维持密钥对以及任何数据的签署，无论是传送、消息或者合约交互。

### 创建Keyring实例 {: #creating-a-keyring-instance }

您可以通过创建Keyring级别的实例并指定使用的默认钱包地址类型来创建一个实例。对于Moonbeam网络，其默认钱包类型为`ethereum`。

```javascript
// Import the keyring as required
import { Keyring } from '@polkadot/api';

// Create a keyring instance
const keyring = new Keyring({ type: 'ethereum' });
```

### 添加账户到Keyring {: #adding-accounts }

将账户添加至keyring实例有多种方式，包括通过助记词和短格式密钥：

=== "From Mnemonic"
    ```javascript
    --8<-- 'code/substrate-api/adding-accounts-mnemonic.js'
    ```

=== "From Private Key"
    ```javascript
    --8<-- 'code/substrate-api/adding-accounts-private-key.js'
    ```

## 在Moonbeam上发送交易  {: #transactions }

交易端口通常为 `api.tx.<module>.<method>`形式, 其中模块和方法包装都是通过元数据生成的。这允许您提交事务使其包含在区块中，如传送、部署合约、与Pallet交互或者Moonbeam支持的其他内容等。您可以通过访问`api.tx`对象来查看所有可用端点的列表，例如：

```javascript
console.log(api.tx);
```

### 发送交易 {: #sending-basic-transactions }

Polkadot.js API可用于向网络发送交易。假设您已[初始化了 API](#creating-an-API-provider-instance): 和一个 [keyring instance](#creating-a-keyring-instance)，您可以使用以下代码段发送一个基本交易（此代码示例还将返回交易calldata与成功提交后的交易哈希）：

```javascript
// Initialize wallet key pairs
const alice = keyring.addFromUri('INSERT_ALICES_PRIVATE_KEY');
const bob = 'INSERT_BOBS_ADDRESS';

// Form the transaction
const tx = await api.tx.balances
  .transfer(bob, 12345n)

// Retrieve the encoded calldata of the transaction
const encodedCalldata = tx.method.toHex()
console.log(`Encoded calldata: ${encodedCallData}`);

// Sign and send the transaction
const txHash = await tx
    .signAndSend(alice);

// Show the transaction hash
console.log(`Submitted with hash ${txHash}`);
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/build/substrate-api/polkadot-js-api/basic-transactions.js'
    ```

请注意`signAndSend`函数也可以接受如`nonce`等可选参数。例如，`signAndSend(alice, { nonce: aliceNonce })`。您可以使用[状态查询的示例代码](/builders/build/substrate-api/polkadot-js-api/#state-queries){target=_blank} 来获取正确数据，包括内存池（mempool）中的事务。

### 交易费信息 {: #fees}

transaction端点还提供了一个根据给定 `api.tx.<module>.<method>`获取权重的方法. 您需要在使用特定`module`和`method`构建完整个交易之后使用`paymentInfo`函数。.

`paymetnInfo` 函数以`refTime` and `proofSize`的形式返回权重信息, 并以此来计算交易费用. 这在[通过 XCM 进行远程执行调用](/builders/interoperability/xcm/xcm-transactor/){target=_blank}时非常有用.

假设您已成功[初始化API](#creating-an-API-provider-instance)，以下代码片段展示了如何获取一个简单转账交易的weight信息：

```javascript
// Transaction to get weight information
const tx = api.tx.balances.transfer('INSERT_BOBS_ADDRESS', BigInt(12345));

// Get weight info
const { partialFee, weight } = await tx.paymentInfo('INSERT_SENDERS_ADDRESS');

console.log(`Transaction weight: ${weight}`);
console.log(`Transaction fee: ${partialFee.toHuman()}`);
```

??? code "查看完整文件"

    ```js
    --8<-- 'code/substrate-api/payment-info.js'
    ```

### 交易事件 {: #transaction-events }

任何事务将会发出事件，无论如何这将始终为特定事务发送`system.ExtrinsicSuccess`或`system.ExtrinsicFailed`事件。这些为事务提供整体执行结果，即执行成功或失败。

根据发送的事务，可能还会发出一些其他事件，例如余额转账事件，这其中可能包括一个或多个`balance.Transfer`事件。

转账API页面包含一个[示例代码片段](/builders/get-started/eth-compare/transfers-api/#monitor-all-balance-transfers-with-the-substrate-api){target=_blank}，用于订阅新的最终区块头并检索所有`balance.Transfer`事件。

### 批处理事务 {: #batching-transactions }

Polkadot.js API允许通过`api.tx.utility.batch`函数批处理事务。这些批处理事务从同一个发送者按顺序依次处理。事务处理费可以使用`paymentInfo`函数来计算。假设您已成功[初始化API](#creating-an-API-provider-instance)，取得了[keyring](#creating-a-keyring-instance) 和 [账户](#adding-accounts),以下示例进行了多笔转账，同时也使用`api.tx.parachainStaking`模块来发起请求以减少特定候选收集人的绑定量：

```javascript
// Construct a list of transactions to batch
const collator = 'INSERT_COLLATORS_ADDRESS';
const txs = [
  api.tx.balances.transfer('INSERT_BOBS_ADDRESS', BigInt(12345)),
  api.tx.balances.transfer('INSERT_CHARLEYS_ADDRESS', BigInt(12345)),
  api.tx.parachainStaking.scheduleDelegatorBondLess(collator, BigInt(12345))
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

      // Disconnect API here!
    }
  });

```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/build/substrate-api/polkadot-js-api/batch-transactions.js'
    ```

!!! 注意事项
    您可以通过添加`console.log(api.tx.parachainStaking);`到代码，查看`parachainStaking`模块的全部可用功能。

## Substrate和自定义RPC请求 {: #substrate-and-custom-json-rpc-endpoints }

RPC作为函数在特定模块公开显示。这意味着一旦可使用后，您可以通过`api.rpc.<module>.<method>(...params[])`调用任意RPC。这也同样适用于以`polkadotApi.rpc.eth.*`形式使用Polkadot.js API访问以太坊RPC。

一些通过Polkadot.js API可用的方法也可以通过Moonbeam节点上的JSON-RPC端点调用。本节将提供一些示例；您可以通过调用 `api.rpc.rpc.methods()` 或下面列出的 `rpc_methods` 端点来查看公开的RPC端点列表。

- **[`methods()`](https://polkadot.js.org/docs/substrate/rpc/#methods-rpcmethods){target=_blank}**
    - **接口** -  `api.rpc.rpc.methods`
    - **JSON-RPC** - `rpc_methods`
    - **返回** - 节点公开的RPC方法列表

    ```bash
      curl --location --request POST 'https://rpc.api.moonbase.moonbeam.network' \
      --header 'Content-Type: application/json' \
      --data-raw '{
        "jsonrpc":"2.0",
        "id":1,
        "method":"rpc_methods",
        "params": []
      }'
    ```

- **[`getBlock(hash?: BlockHash)`](https://polkadot.js.org/docs/substrate/rpc/#getblockhash-blockhash-signedblock){target=_blank}**
    - **接口** - `api.rpc.chain.getBlock`
    - **JSON-RPC** - `chain_getBlock`
    - **返回** - 由区块哈希参数指定的区块header和body

    ```bash
      curl --location --request POST 'https://rpc.api.moonbase.moonbeam.network' \
      --header 'Content-Type: application/json' \
      --data-raw '{
        "jsonrpc":"2.0",
        "id":1,
        "method":"chain_getBlock",
        "params": ["0x870ad0935a27ed8684048860ffb341d469e091abc2518ea109b4d26b8c88dd96"]
      }'
    ```

- **[`getFinalizedHead()`](https://polkadot.js.org/docs/substrate/rpc/#getfinalizedhead-blockhash){target=_blank}**
    - **接口** `api.rpc.chain.getFinalizedHead`
    - **JSON-RPC** `chain_getFinalizedHead`
    - **返回** 最新最终确定区块的区块哈希

    ```bash
      curl --location --request POST '{{ networks.moonbase.rpc_url }}' \
      --header 'Content-Type: application/json' \
      --data-raw '{
        "jsonrpc":"2.0",
        "id":1,
        "method":"chain_getHeader",
        "params": []
      }'
    ```

[共识和确定性页面](/builders/get-started/eth-compare/consensus-finality/#){target=_blank}提供了使用自定义RPC调用来检查交易确定性的示例。

## Polkadot.js API实用工具方法 {: #utilities }

Polkadot.js API 还包括许多实用程序库，用于计算常用的加密原语和哈希函数。

以下示例通过首先计算其RLP（[递归长度前缀](https://eth.wiki/fundamentals/rlp){target=_blank}）编码，然后使用keccak256对结果进行哈希来预先计算Legacy类型以太坊交易的交易哈希。

```javascript
import { encode } from '@polkadot/util-rlp';
import { keccakAsHex } from '@polkadot/util-crypto';
import { numberToHex } from '@polkadot/util';

// Define the raw signed transaction
const txData = {
    nonce: numberToHex(1),
    gasPrice: numberToHex(21000000000),
    gasLimit: numberToHex(21000),
    to: '0xc390cC49a32736a58733Cf46bE42f734dD4f53cb',
    value: numberToHex(1000000000000000000),
    data: '',
    v: "0507",
    r: "0x5ab2f48bdc6752191440ce62088b9e42f20215ee4305403579aa2e1eba615ce8",
    s: "0x3b172e53874422756d48b449438407e5478c985680d4aaa39d762fe0d1a11683"
}

// Extract the values to an array
var txDataArray = Object.keys(txData)
    .map(function (key) {
        return txData[key];
    });

// Calculate the RLP encoded transaction
var encoded_tx = encode(txDataArray)

// Hash the encoded transaction using keccak256
console.log(keccakAsHex(encoded_tx))
```

您可以查看相应的[NPM存储库页面](https://www.npmjs.com/package/@polkadot/util-crypto/v/0.32.19){target=_blank}以获取其中的可用方法列表库及其相关文档。

--8<-- 'text/_disclaimers/third-party-content.md'
