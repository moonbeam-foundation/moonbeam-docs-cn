---
title: 使用调用许可预编译的Gasless交易
description: 使用Moonbeam调用许可预编译在您的dApp启用Gasless交易！学习如何实现调用许可预编译改善用户体验。
---

# 使用调用许可预编译发送Gasless交易

_作者：Erin Shaben_

## 概览 {: #introduction }

要与Moonbeam上的dApp交互，用户通常需要持有Moonbeam的原生Token GLMR来支付交易费用。这个要求在用户体验方面为许多dApp制造了难题，因用户需要拥有一定余额的Token方能与dApp交互。

其中一个能解决此问题的方案为Gasless交易，又被成为元交易。Gasless交易为一种不需要用户支付Gas费用以执行交易的交易方式。根据不同的情况，交易的Gas将由第三方服务承担或是以扣取用户其他种类Token的方式支付。举例来说，用户能够简单签署提交至网络的交易，接着第三方能够提交交易并为用户支付交易费用。

一般的交易会有以下的流程：

![Flow of a transaction](/images/tutorials/eth-api/call-permit-gasless-txs/gasless-1.png)

而Gasless交易的运作流程则为：

![Flow of a gasless transaction](/images/tutorials/eth-api/call-permit-gasless-txs/gasless-2.png)

Gasless交易尤其能够造福那些高频小额交易的用户，比如说如游戏dApp [Damned Pirates Society](https://damnedpiratessociety.io/){target=_blank}（DPS）的玩家。在DPS中，用户在航程中寻找宝藏并增强他们的舰队。DPS游戏中有两种货币：Treasure Maps（TMAP）和Doubloons（DBL）。TMAP用于购买航程，而DBL用于维护设备以及购买支持航程，DBL可以在航程当中赚取。目前来说，如果用户希望启航，他们需要TMAP来购买航程和GLMR来支付交易费用。如果能够通过实现Gasless交易让用户无需担心TMAP和DBL之外的余额（GLMR）来降低门槛的话那不是更好吗？从dApp的角度来看，这将让平台保留用户，且用户不需要离开dApp来获得GLMR，他们能够持续进行游戏。

Gasless交易能够使用Moonbeam的调用许可预编译来实现，其为一个允许用户签署许可（一个[EIP-712](https://eips.ethereum.org/EIPS/eip-712){target=_blank}签署消息）的Solidity接口，可以在其后调用至您的dApp中。调用许可预编译能够用于执行任何EVM调用。**最好的部分是您不需要修改您任何现有的合约！**

在本教程中，我们将会包含在dApp中实现Gasless交易的流程。更详细的说，我们将会了解如何在DPS中通过Gasless交易购买航程。我们还会构建一个EIP-712签署消息，签署它并利用调用许可预编译调度它。

## 什么是EIP-712签署消息？ {: #eip-712-signed-messages }

[EIP-712](https://eips.ethereum.org/EIPS/eip-712){target=_blank}签署消息是一个以标准方式结构化、散列和签署的签署消息。EIP-712标准化的好处是消息数据能够在用户签署这些消息时以更加可读的方式展现，让他们能够更加了解正在签署的内容。在标准化流程存在前，用户必须签署无法阅读且难以解码的十六进制字符串，常常让用户误信并签署具有恶意数据的消息。

EIP-712通过要求开发者为消息数据定义一个JSON架构和指定一个域名分隔器来规范用户签署消息数据的组成。设立域名分隔器的主要目的是避免重放攻击。我们将会在以下部分中涵盖这些动作的所需要求。

## 查看先决条件 {: #checking-prerequisites }

在此教程中，您需要以下先决条件：

- 拥有资金的账户
  --8<-- 'text/_common/faucet/faucet-list-item.md'
  
- 已安装[Ethers](/builders/build/eth-api/libraries/ethersjs){target=_blank}的项目

    ```bash
    npm i ethers
    ```

- 
 --8<-- 'text/_common/endpoint-examples-list-item.md'

## 配置您的项目 {: #configure-your-project }

要开始操作，请确保您已经拥有在[先决条件](#checking-prerequisites)中描述的已经安装Ethers的项目。要为Moonbeam配置Ethers，您需要：

1. 导入`ethers`
2. 定义网络配置
3. 创建一个`ethers`提供商

=== "Moonbeam"

    ```js
    // 1. Import ethers
    import { ethers } from 'ethers';
    
    // 2. Define network configurations
    const providerRPC = {
      moonbeam: {
        name: 'moonbeam',
        rpc: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonbeam.chain_id }}, // {{ networks.moonbeam.hex_chain_id }} in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.JsonRpcProvider(providerRPC.moonbeam.rpc, {
      chainId: providerRPC.moonbeam.chainId,
      name: providerRPC.moonbeam.name,
    });
    ```

=== "Moonriver"

    ```js
    // 1. Import ethers
    import { ethers } from 'ethers';
    
    // 2. Define network configurations
    const providerRPC = {
      moonriver: {
        name: 'moonriver',
        rpc: '{{ networks.moonriver.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonriver.chain_id }}, // {{ networks.moonriver.hex_chain_id }} in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.JsonRpcProvider(providerRPC.moonriver.rpc, {
      chainId: providerRPC.moonriver.chainId,
      name: providerRPC.moonriver.name,
    });
    ```

=== "Moonbase Alpha"

    ```js
    // 1. Import ethers
    import { ethers } from 'ethers';
    
    // 2. Define network configurations
    const providerRPC = {
      moonbase: {
        name: 'moonbase-alpha',
        rpc: '{{ networks.moonbase.rpc_url }}',
        chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.JsonRpcProvider(providerRPC.moonbase.rpc, {
      chainId: providerRPC.moonbase.chainId,
      name: providerRPC.moonbase.name,
    });
    ```

=== "Moonbeam开发节点"

    ```js
    // 1. Import ethers
    import { ethers } from 'ethers';
    
    // 2. Define network configurations
    const providerRPC = {
      dev: {
        name: 'moonbeam-development',
        rpc: '{{ networks.development.rpc_url }}',
        chainId: {{ networks.development.chain_id }}, // {{ networks.development.hex_chain_id }} in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.JsonRpcProvider(providerRPC.dev.rpc, {
      chainId: providerRPC.dev.chainId,
      name: providerRPC.dev.name,
    });
    ```

如同先前提及的，有多种方式可以设置Gasless交易。为达成此教程的目的，我们预设有一个第三方账户来支付费用。在这样的情况下，dApp用户需要一个连接至钱包的签署者，以及支付交易费用的第三方账户的签署者。此教程预设您已经拥有这些签署者，如果需要，您可以通过以下的一般签署者来进行设置。

```js
const userSigner = new ethers.Wallet('INSERT_PRIVATE_KEY', provider);
const thirdPartyGasSigner = new ethers.Wallet('INSERT_PRIVATE_KEY', provider);
```

!!! 请记住
    请勿将您的私钥存储至JavaScript或TypeScript文件中。

现在我们需要设置初始配置，让我们来了解如何构建EIP-712签署消息。

## 构建一个EIP-712类型消息 {: #build-an-eip-712-signed-message }

在构建EIP-712类型消息时我们需要三种组成组件：域名分隔器、用户将签署的类别化数据架构以及实际的消息数据。

域名分隔器以及类别数据架构将会基于[调用许可预编译](/builders/pallets-precompiles/precompiles/call-permit){target=_blank}。构建这些组成物件的步骤不论是否签署都将相同。实际消息数据将会根据您的个人用例而变化。

### 定义域名分隔器 {: #define-domain-separator }

我们首先将会从域名分隔器开始，这将定义调用许可预编译为签署域名。许可将会通过调用许可预编译的`dispatch`函数调度，这就是为何调用许可预编译将永远是签署域名的原因。如同先前提及的，域名分隔器的目标是预防重放攻击。

--8<-- 'text/builders/pallets-precompiles/precompiles/call-permit/domain-separator.md'

我们将在本示例中使用Ethers，这要求域分隔符采用[`TypedDataDomain`接口指定的格式](https://docs.ethers.org/v6/api/hashing/#TypedDataDomain){target =_blank}，但如果需要，您可以使用调用许可预编译的[`DOMAIN_SEPARATOR()`函数将域分隔符生成为 *bytes32* 表示形式](/builders/pallets-precompiles/precompiles/call-permit/# :~:text=DOMAIN_SEPARATOR()){target=_blank}。

每个Moonbeam网络的域名分隔器如下：

=== "Moonbeam"

    ```js
    const domain = {
      name: 'Call Permit Precompile',
      version: '1',
      chainId: {{ networks.moonbeam.chain_id }},
      verifyingContract: '{{ networks.moonbeam.precompiles.call_permit}}',
    };
    ```

=== "Moonriver"

    ```js
    const domain = {
      name: 'Call Permit Precompile',
      version: '1',
      chainId: {{ networks.moonriver.chain_id }},
      verifyingContract: '{{ networks.moonriver.precompiles.call_permit}}',
    };
    ```

=== "Moonbase Alpha"

    ```js
    const domain = {
      name: 'Call Permit Precompile',
      version: '1',
      chainId: {{ networks.moonbase.chain_id }},
      verifyingContract: '{{ networks.moonbase.precompiles.call_permit}}',
    };
    ```

=== "Moonbeam开发节点"

    ```js
    const domain = {
      name: 'Call Permit Precompile',
      version: '1',
      chainId: {{ networks.development.chain_id }},
      verifyingContract: '{{ networks.moonbase.precompiles.call_permit}}',
    };
    ```

### 定义类别数据架构 {: #define-typed-data-structure }

接着，我们需要定义类别数据架构。类别数据架构定义我们用户将会签署的可接受数据类别。我们将会在以下部分针对真实数据详细说明。

如果您查看[调用许可预编译的`dispatch`函数](/builders/pallets-precompiles/precompiles/call-permit/#the-call-permit-interface){target=_blank}，您将会看到我们需要发送的数据以及关联的类型如下：

```solidity
function dispatch(
    address from,
    address to,
    uint256 value,
    bytes memory data,
    uint64 gaslimit,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
) external returns (bytes memory output);
```

我们需要将上述每个参数添加到我们的类别化数据结构中，并进行一些修改。我们不需要包含与签名相关的参数，但我们确实需要涵盖`from`帐户的`nonce`参数，该参数将是*uint256*。此时不需要与签名相关的参数，因为我们正在构建供用户签名的消息数据。完成消息构建并请求签名后，我们将回到与签名相关的参数。

因此，如果我们获取其余的参数，我们就可以开始构建我们的数据结构。EIP-712的某些实现需要指定`EIP712Domain`的类型，但使用Ethers时情况并非如此，因为它会为您计算！对于我们的实现，我们唯一需要的类型是`CallPermit`类型。`CallPermit`类型将是与每个参数相对应的对象数组，并为每个参数定义`name`和`type`：

```js
const types = {
  CallPermit: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'data', type: 'bytes' },
    { name: 'gaslimit', type: 'uint64' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
};
```

### 定义消息数据 {: #define-message-data }

由于我们将为购买航程实现Gasless交易，我们将与[Cartographer V1合约](https://moonscan.io/address/0xD1A9bA3e61Ac676f58B29EA0a09Cf5D7f4f35138#code){target=_blank}交互，该合约位于Moonbeam上的该地址：`0xD1A9bA3e61Ac676f58B29EA0a09Cf5D7f4f35138`。

构建消息数据需要用到的参数如下：

- `from` - 用户地址，可以使用`signer.address`获得用户的Ethers签名者
- `to` - 您希望与之交互的合约地址。以本示例来说，我们将使用DPS的Cartographer V1合约
- `value` - 要从`from`账户转移的值。这将会是`0`，因为是使用TMAP购买航程而不是使用GLMR
- `data` - 要被执行的调用数据，将会通过下方步骤计算
- `gaslimit`- 调用需要的Gas限制
- `nonce` - `from`账户的随机数。这不是您的标准随机数，而是专门通过调用许可预编译发送的许可的随机数。要获取这个nonce，可以调度调用许可预编译的`nonces`函数并传入`from`账户的地址
- `deadline` - 以UNIX为单位的最后期限，在此之后许可证将过期并且不再有效

消息将会组成以下内容：

```js
const message = {
  from: userSigner.address,
  to: '0xD1A9bA3e61Ac676f58B29EA0a09Cf5D7f4f35138', // Cartographer V1 contract
  value: 0,
  data: 'TODO: Calculate the data that will buy a voyage',
  gaslimit: 'TODO: Estimate the gas',
  nonce: 'TODO: Use the Call Permit Precompile to get the nonce of the from account',
  deadline: '1714762357000', // Randomly created deadline in the future
};
```

现在，让我们深入并处理`TODO`项。

#### 为购买航程获得编码调用数据 {: #encoded-call-data-buying-voyage }

我们将从计算`data`值开始。我们可以通过创建Cartographer V1合约的接口并使用`interface.encodeFunctionData`函数，以编程方式使用[Ethers](/builders/build/eth-api/libraries/ethersjs){target=_blank}计算`data`值。

如果您查看[`DPSCartographer.sol`合约的代码](https://moonscan.io/address/0xD1A9bA3e61Ac676f58B29EA0a09Cf5D7f4f35138#code){target=_blank}，您会看到[`buyVoyages`函数](https://moonscan.io/address/0xD1A9bA3e61Ac676f58B29EA0a09Cf5D7f4f35138#code#F1#L75){target=_blank}。`buyVoyages`函数接受三个参数：

- *uint16* `_voyageType` - 指定要购买的航程类型，即简单、中等、困难等。该值对应于[`VOYAGE_TYPE` enum](https://moonscan.io/address/0x72a33394f0652e2bf15d7901f3cd46863d968424#code){target=_blank}中航程的索引。在本示例中，我们将进行一次简单的航行，因此我们将传入`0`作为值
- *uint256* `_amount` - 对应于购买的航程数。我们将购买一次航程
- *DPSVoyageIV2* `_voyage` - 代表`DPSVoyageV2.sol`合约的地址，即Moonbeam上的：`0x72A33394f0652e2Bf15d7901f3Cd46863d968424`

要使用Ethers创建接口，我们需要获取Cartographer V1合约ABI。您可以从[Moonscan](https://moonscan.io/address/0xD1A9bA3e61Ac676f58B29EA0a09Cf5D7f4f35138#code){target=_blank}完整检索它，或者为了简单起见，您可以使用以下代码片段，这是我们的ABI的一部分，将用于本示例中：

```js
const cartographerAbi = [
  {
    inputs: [
      { internalType: 'uint16', name: '_voyageType', type: 'uint16' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      {
        internalType: 'contract DPSVoyageIV2',
        name: '_voyage',
        type: 'address',
      },
    ],
    name: 'buyVoyages',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
```

接着我们可以使用ABI创建接口或者使用在`buyVoyages`函数中指定的参数获得编码数据：

```js
const cartographerInterface = new ethers.Interface(cartographerAbi);
const data = cartographerInterface.encodeFunctionData('buyVoyages', [
  0n, // Voyage type: Easy
  1n, // Number of voyages to buy
  '0x72A33394f0652e2Bf15d7901f3Cd46863d968424', // Voyage V2 contract
]);
```

这将会提供以下的`data`值：

```js
'0xdb76d5b30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000072a33394f0652e2bf15d7901f3cd46863d968424'
```

#### 预估购买航程需要的Gas数量{: #estimate-gas-buy-voyage }

现在我们拥有了购买航程的编码调用数据，我们可以用其来预估此交易的Gas。我们将会使用`estimateGas`函数并输入用户地址、Cartographer V1合约以及编码调用数据：

```js
const gasEstimate = await provider.estimateGas({
  from: userSigner.address,
  to: '0xD1A9bA3e61Ac676f58B29EA0a09Cf5D7f4f35138', // Cartographer V1 contraact
  data,
})
```

!!! 注意事项
    以本示例来说，您需要至少有1 TMAP以预估Gas。否则，您将会获得`'VM Exception while processing transaction: revert'`错误。

我们将会添加一点至`gasEstimate`值并将其设置为`gaslimit`：

```js
const message = {
  ...
  gaslimit: gasEstimate + 50000n,
  ...
}
```

我们将会在下个部分获得Nonce，并且将所有参数放在一起，如此消息数据便完整了。

#### 使用调用许可预编译获得签署者Nonce {: #get-signers-nonce }

最后，我们需要获取`from`帐户的`nonce`。如前所述，我们可以使用调用许可预编译的`nonce`函数来获取该值。为此，您需要为调用许可预编译创建一个合约实例：

1. 在项目中创建一个新文件，其中包含调用许可预编译的ABI。您可以在GitHub上找到[ABI](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-docs/master/.snippets/code/builders/pallets-precompiles/precompiles/call-permit/abi.js){target=_blank}
2. 将ABI导入您的Ethers文件中
3. 使用预编译的地址和预编译的ABI创建调用许可预编译的实例。您可以使用提供商或签名者。由于我们稍后将在本教程中发送许可证，因此我们将使用与第三方帐户关联的签名者来支付交易费用，但如果您只需要访问`nonces`函数，则可以使用提供商
4. 调用`nonces`函数并输入用户的`signer.account` ，与`from`账户相同

```js
...
import abi from './callPermitABI.js'

...

const callPermit = new ethers.Contract(
  '{{ networks.moonbeam.precompiles.call_permit }}', 
  abi, 
  thirdPartyGasSigner,
);

const nonce = await callPermit.nonces(userSigner.address);
```

??? code "查看到目前為止的腳本"

    ```js
    import { ethers } from 'ethers';
    import abi from './callPermitABI.js'
    import cartographerAbi from './cartographerAbi.js'
    
    const providerRPC = {
      moonbeam: {
        name: 'moonbeam',
        rpc: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonbeam.chain_id }}, // {{ networks.moonbeam.hex_chain_id }} in hex,
      },
    };
    const provider = new ethers.JsonRpcProvider(providerRPC.moonbeam.rpc, {
      chainId: providerRPC.moonbeam.chainId,
      name: providerRPC.moonbeam.name,
    });
    
    // Insert your own signer logic or use the following for testing purposes
    const userSigner = new ethers.Wallet('INSERT_PRIVATE_KEY', provider);
    const thirdPartyGasSigner = new ethers.Wallet('INSERT_PRIVATE_KEY', provider);
    
    const domain = {
      name: 'Call Permit Precompile',
      version: '1',
      chainId: {{ networks.moonbeam.chain_id }},
      verifyingContract: '{{ networks.moonbeam.precompiles.call_permit}}',
    };
    
    const types = {
      CallPermit: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
        { name: 'gaslimit', type: 'uint64' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    };
    
    const cartographerInterface = new ethers.Interface(cartographerAbi);
    const data = cartographerInterface.encodeFunctionData('buyVoyages', [
      0n, // Voyage type: Easy
      1n, // Number of voyages to buy
      '0x72A33394f0652e2Bf15d7901f3Cd46863d968424', // Voyage V2 contract
    ]);
    
    const gasEstimate = await provider.estimateGas({
      from: userSigner.address,
      to: '0xD1A9bA3e61Ac676f58B29EA0a09Cf5D7f4f35138', // Cartographer V1 contraact
      data,
    })
    
    const callPermit = new ethers.Contract(
      '{{ networks.moonbeam.precompiles.call_permit }}', 
      abi, 
      thirdPartyGasSigner,
    );
    
    const nonce = await callPermit.nonces(userSigner.address);
    
    const message = {
      from: userSigner.address,
      to: '0xD1A9bA3e61Ac676f58B29EA0a09Cf5D7f4f35138', // Cartographer V1 contract
      value: 0,
      data,
      gaslimit: gasEstimate + 50000n,
      nonce,
      deadline: '1714762357000', // Randomly created deadline in the future
    };
    ```
    
    !!! 请记住
        请勿将您的私钥或是助记词存于JavaScript或TypeScript文件中。

到目前为止，我们已经创建了域分隔器，定义了EIP-712消息的数据结构，并组装了消息的数据。接下来，我们需要请求EIP-712类型消息的签名！

## 获取EIP-712类型签名 {: #use-ethers-to-sign-eip712-messages }

对于下一步，我们将使用Ethers签名者和`signer.signTypedData`函数来提示用户签署我们组装的EIP-712类型消息。该签名将允许交易费用的第三方账户调度调用许可预编译的的`dispatch`函数。第三方账户会代我们支付交易费用，并购买一个航程！

`signTypedData`函数将会使用以下方式为我们的数据计算一个签名：

```text
sign(keccak256("\x19\x01" ‖ domainSeparator ‖ hashStruct(message)))
```

哈希的组件可以分成如下：

- **\x19** - 使编码具有确定性
- **\x01** - 版本字节，使哈希符合[EIP-191](https://eips.ethereum.org/EIPS/eip-191){target=_blank}
- **domainSeparator** - 32字节域名分隔器，如[之前教程部分](#define-the-domain-separator)，可以使用调用许可预编译的`DOMAIN_SEPARATOR`函数轻松检索
- **hashStruct(message)** - 要签名的32字节数据，它基于类型化数据结构和实际数据。更多信息请参考[EIP-712规范](https://eips.ethereum.org/EIPS/eip-712#definition-of-hashstruct){target=_blank}

现在我们已经了解了`signTypedData`函数的作用，我们可以继续传递我们在前面几节中组装的数据：

```js
const signature = await signer.signTypedData(
  domain, // The domain separator
  types, // The typed data structure
  message, // The message data
);
console.log(`Signature hash: ${signature}`);
```

签名的哈希值将打印传输到终端。我们将在下一节中使用调用许可预编译的`dispatch`函数，使用用户的签名从第三方帐户发送许可。

## 调度一个签名EIP-712消息 {: #dispatch-eip712-message }

在发送EIP-712签名消息之前，我们需要从签名消息中获取与签名相关的参数`v`、`r`和`s`。`signTypedData`函数返回一个包含每个值的十六进制字符串，但为了轻松地单独获取这些值，我们将使用Ethers的`Signature.from`函数。这将创建Ether的[签名类](https://docs.ethers.org/v6/api/crypto/#Signature){target=_blank}的新实例，这将使我们能够轻松获取`v`，为了使用`dispatch`函数，我们需要`r`和`s`值。

```js
const formattedSignature = ethers.Signature.from(signature);
```

现在我们可以单独访问调度许可所需的`v`、`r`和`s`参数，我们可以调用调用许可预编译的`dispatch`函数。传递给`dispatch`函数的参数必须与传递给`signTypedData`函数的`value`参数完全相同。您将使用与您的dApp关联的帐户作为签名者（而不是与用户关联的签名者）来发送以下函数，并且它将发送用户签名的许可：

```js
const dispatch = await callPermit.dispatch(
  message.from,
  message.to,
  message.value,
  message.data,
  message.gaslimit,
  message.deadline,
  formattedSignature.v,
  formattedSignature.r,
  formattedSignature.s,
);

await dispatch.wait();
console.log(`Transaction hash: ${dispatch.hash}`);
```

??? code "查看完整腳本"

    ```js
    --8<-- 'code/builders/pallets-precompiles/precompiles/call-permit/dispatch-call-permit.js'
    ```

    !!! 请记住
        请勿将您的私钥存储在JavaScript或TypeScript文件中。

交易完成后，将从第三方账户的GLMR余额中扣除Gas费，并从用户的余额中扣除1 TMAP，并代用户购买一个航程。如您所见，用户无需担心GLMR余额！

您可以在[Moonscan](https://moonbeam.moonscan.io/tx/0x2c16f1257f69eaa14486f89cedf600c25c0335086b640f2225468a244f10588a){target=_blank}上查看此教程包含的交易，您将会注意到下列事项：

- `from`账户来自此第三方账户：`0xd0ccb8d33530456f1d37e91a6ef5503b5dcd2ebc`
- 与之交互的为调用许可预编译合约：`{{ networks.moonbeam.precompiles.call_permit }}`
- 一个TMAP从用户账户中扣减：`0xa165c7970886d4064b6cec9ab1db9d03202bda37`
- 一个ID为622646的航程被传送至用户账户

![Review the transaction details](/images/tutorials/eth-api/call-permit-gasless-txs/gasless-3.png)

就这样可以了！恭喜您，您已经了解如何在Moonbeam上使用调用许可预编译实现Gasless交易。您现在可以将此教程中的逻辑应用至您的dApp！

--8<-- 'text/_disclaimers/educational-tutorial.md'
--8<-- 'text/_disclaimers/third-party-content.md'
