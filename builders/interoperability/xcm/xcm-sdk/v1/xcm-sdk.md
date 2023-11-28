---
title: XCM SDK v1
description: 使用Moonbeam XCM SDK在波卡/生态系统中，在平行链之间或是平行链和中继链之间转移跨链资产。
---

# 使用Moonbeam XCM SDK：v1版本

## 概览 {: #introduction }

Moonbeam XCM SDK使开发者能够在波卡/Kusama生态系统内轻松实现链间（不论是平行链之间或平行链与中继链）资产转移。通过使用SDK，您无需担心确定源资产或目标资产的multilocation，或者该在哪些网络上使用哪些extrinsics来发送XCM转账。

XCM SDK提供帮助函数，该函数提供在波卡/Kusama生态中链之间执行XCM转移的简易接口。除外，XCM配置包允许平行链项目以标准方式添加信息，让他们能够被XCM SDK支持。

关于Moonbeam XCM SDK中可用函数和接口的概览，请查看[相关参考](/builders/interoperability/xcm/xcm-sdk/v1/reference){target=_blank}页面。

以下教程的范例中在Moonbeam中进行，但同样适用于Moonriver或Moonbase Alpha。

## 安装XCM SDK {: #install-the-xcm-sdk }

要开始使用Moonbeam XCM SDK，您首先需要安装SDK：

```bash
npm install @moonbeam-network/xcm-sdk
```

您同样需要安装一些额外的依赖项，用于在此教程中与该SDK交互。您需要Polkadot.js API来创建一个Polkadot签署人:：

```bash
npm install @polkadot/api @polkadot/util-crypto
```

如果您需要与一个兼容以太坊的区块链交互，您也需要一个Ethereum签署人. 本文章使用Ethers.js与viem做例子. 您可以自己选择需要使用的库:

=== "Ethers.js"

    ```bash
    npm install ethers@^5.7.2
    ```

=== "viem"

    ```bash
    npm install
    ```

## 创建签署人 {: #create-signers }

当在链之间转移资产时，您需要签署人来负责签署交易。如果您与之交互的是一个使用标准以太坊风格H160地址的EVM兼容链（如Moonbeam），您将需要一个以太坊签署人。更详细地说，它可以是一个[Ethers.js](https://docs.ethers.org/v5/){target=_blank}签署人，也可以是一个[viem钱包客户端](https://viem.sh/docs/clients/wallet.html){target=_blank}。要与中继链或其他平行链交互，您需要的是一个[Polkadot](https://polkadot.js.org/docs/api/)签署人。

举例来说，您可以传送一个[浏览器钱包签署人进入Ethers](https://docs.ethers.org/v5/getting-started/#getting-started--connecting){target=_blank}或[viem](https://viem.sh/docs/clients/wallet.html#json-rpc-accounts){target=_blank}, 比如MetaMask。同样地，在波卡中，您可以[使用`@polkadot/extension-dapp`库传送一个兼容的钱包给签署人](https://polkadot.js.org/docs/extension/){target=_blank}。

要创建EVM和Polkadot.js创建签署人，您可以参考以下部分教程。

!!! 请记住
    **永远不要将您的私钥或是助记词存储在JavaScript或是TypeScript文件中。**

### 创建一个Ethers签署人 {: #create-a-ethers-signer }

要创建一个EVM签署人，您可以使用以下代码段：

```js
import { ethers } from 'ethers';

const privateKey = 'INSERT_PRIVATE_KEY';
const provider = new ethers.providers.WebSocketProvider('INSERT_WS_ENDPOINT', {
  chainId: INSERT_CHAIN_ID,
  name: 'INSERT_CHAIN_NAME',
});
const evmSigner = new ethers.Wallet(privateKey, provider);
```

关于Moonbeam网络，您可以使用以下配置：

=== "Moonbeam"

    ```js
    import { ethers } from 'ethers';
    
    const privateKey = 'INSERT_PRIVATE_KEY';
    const provider = new ethers.providers.WebSocketProvider(
      '{{ networks.moonbeam.wss_url }}', 
      {
        chainId: {{ networks.moonbeam.chain_id }},
        name: 'moonbeam',
      }
    );
    const evmSigner = new ethers.Wallet(privateKey, provider);
    ```

=== "Moonriver"

    ```js
    import { ethers } from 'ethers';
    
    const privateKey = 'INSERT_PRIVATE_KEY';
    const provider = new ethers.providers.WebSocketProvider(
      '{{ networks.moonriver.wss_url }}', 
      {
        chainId: {{ networks.moonriver.chain_id }},
        name: 'moonriver',
      }
    );
    const evmSigner = new ethers.Wallet(privateKey, provider);
    ```

=== "Moonbase Alpha"

    ```js
    import { ethers } from 'ethers';
    
    const privateKey = 'INSERT_PRIVATE_KEY';
    const provider = new ethers.providers.WebSocketProvider(
      '{{ networks.moonbase.wss_url }}',
      {
        chainId: {{ networks.moonbase.chain_id }},
        name: 'moonbase',
      }
    );
    const evmSigner = new ethers.Wallet(privateKey, provider);
    ```

或者您也可以创建并使用一个viem钱包客户端作为EVM签署人

=== "Moonbeam"

    ```js
    import { createWalletClient, custom } from 'viem'
    import { moonbeam } from 'viem/chains'

    const client = createWalletClient({
      chain: moonbeam,
      transport: custom(window.ethereum)
    })
    ```

=== "Moonriver"

    ```js
    import { createWalletClient, custom } from 'viem'
    import { moonriver } from 'viem/chains'

    const client = createWalletClient({
      chain: moonriver,
      transport: custom(window.ethereum)
    })
    ```

=== "Moonbase Alpha"

    ```js
    import { createWalletClient, custom } from 'viem'
    import { moonbase } from 'viem/chains'

    const client = createWalletClient({
      chain: moonbase,
      transport: custom(window.ethereum)
    })
    ```

!!! 注意事项
    --8<-- 'text/_common/endpoint-setup.md'

### 创建一个Polkadot签署人 {: #create-a-polkadot-signer }

在本示例中，您可以使用[Polkadot.js Keyring](/builders/build/substrate-api/polkadot-js-api#keyrings){target=_blank}签署交易。请注意，此方法并不推荐用于生产应用之中。

```js
import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
const privateKey = 'INSERT_PRIVATE_KEY';
await cryptoWaitReady();
const keyring = new Keyring({
  ss58Format: 'INSERT_SS58_FORMAT',
  type: 'sr25519',
});
const pair = keyring.createFromUri(privateKey);
```

!!! note
    上面实例中的`INSERT_PRIVATE_KEY`值可为私钥或助字词.

## 构建XCM转移数据 {: #build-xcm-transfer-data }

要从一条链上转移资产至另外一条链，您需要构建转移数据，其用于定义被转移的资产、源链及地址、目标链及地址以及交易的相关签署人。第一步为构建转移数据，在下个部分教程中，您将会了解如何使用此转移数据转移资产。

要开始进行操作，您需使用`Sdk`函数，包含两个用于构建XCM转移数据的函数：`assets`和`getTransferData`

```js
import { Sdk } from '@moonbeam-network/xcm-sdk';

const sdkInstance = new Sdk();
```

您可以选择其一，因两个函数都会返回在源链和目标链之间资产转移的所需数据。使用`assets`将会提供额外的数据，包含支持资产列表，以及在当选定一个资产后，支持转移资产的源链和目标链。

使用`assets`构建转移数据的流程如下：

1. 调用`assets`函数并根据需求输入您希望获得可用资产转移列表的指定生态系统。可用生态系统包含：`polkadot`、`kusama`和`alphanet-relay`。例如：

    ```js
    const { assets, asset } = sdkInstance.assets('polkadot');
    ```

    这将会返回支持资产以及`asset`能够定义的转移资产

2. 调用`asset`函数并输入资产代号或是资产对象（包含代号和初始代称）以定义转移的资产。例如：

    ```js
    // Using the key
    const { sourceChains, source } = asset('dot');
    ```

    这将会返回支持源链以及用于定义资产转移源链的`source`函数的列表

3. 调用`source`并输入资产代号或是资产对象（包含代号和名称以及链类别）以定义转移的资产。例子如下：

    ```js
    // Using the key
    const { destinationChains, destination } = source('polkadot');
    ```

    这将会在拥有指定资产信息和`destination`函数支持的拥有开放XCM通道的目标链，用于定义转移资产的目标链

4. 调用`destination`并输入资产代号或是资产对象（包含代号和名称以及链类别）以定义转移的资产。例子如下：

    ```js
    // Using the key
    const { sourceChains, source } = asset('dot');
    ```

    这将会返回`accounts`函数，用于定义源链和目标链地址以及各地址相关的签署人

此资产和链对象在`@moonbeam-network/xcm-config`包中管理。您不需要直接与此包交互，因SDK已传达这些数据，但您仍然能够找到[资产](https://github.com/PureStake/xcm-sdk/blob/main/packages/config/src/assets.ts){target=_blank}和[链数据](https://github.com/PureStake/xcm-sdk/blob/main/packages/config/src/chains.ts){target=_blank}的列表。

以下为构建从波卡中继链转移DOT至Moonbeam的转移数据的步骤范例：

```js
import { Sdk } from '@moonbeam-network/xcm-sdk';

const sdkInstance = new Sdk();

const fromPolkadot = async () => {
  const { assets, asset } = sdkInstance.assets();
  console.log(
    `The supported assets are: ${assets.map((asset) => asset.originSymbol)}`
  );

  const { sourceChains, source } = sdkInstance.assets().asset('dot');
  console.log(
    `The supported source chains are: ${sourceChains.map(
      (chain) => chain.name
    )}`
  );

  const { destinationChains, destination } = source('polkadot');
  console.log(
    `The supported destination chains are: ${destinationChains.map(
      (chain) => chain.name
    )}`
  );

  const { accounts } = destination('moonbeam');
  const data = await accounts(
    pair.address,
    evmSigner.address, // If using viem, use evmSigner.account.address
    {
      evmSigner,
      polkadotSigner: pair,
    }
  );
};

fromPolkadot();
```

!!! 注意事项
    关于更多`Sdk().assets()`开发者函数的信息，包含参数和返回数据，请参考[XCM SDK参考页面](/builders/interoperability/xcm/xcm-sdk/v1/reference#transfer-data-builder-methods){target=_blank}。

如果您不需要任何资产和链信息，您可以使用`getTransferData`函数：

```js
import { Sdk } from '@moonbeam-network/xcm-sdk';

const fromPolkadot = async () => {
  const data = await sdkInstance.getTransferData({
    destinationAddress: evmSigner.address,
    destinationKeyOrChain: 'moonbeam',
    keyOrAsset: 'dot',
    polkadotSigner: pair,
    sourceAddress: pair.address,
    sourceKeyOrChain: 'polkadot',
    evmSigner,
  });
};

fromPolkadot();
```

!!! 注意事项
    关于更多`Sdk().getTransferData()`开发者函数的信息，包含参数和返回数据，请参考[XCM SDK参考页面](/builders/interoperability/xcm/xcm-sdk/v1/reference#core-sdk-methods){target=_blank}。

如同先前提及的，不论您使用那种函数构建您的转移数据，您都需要生产相同的输出。

??? code "响应示例"

    ```js
    // Send DOT from Polkadot to Moonbeam
    // data
    {
      destination: {
        balance: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 0n,
          decimals: 10,
          symbol: 'DOT'
        },
        chain: l {
          ecosystem: 'polkadot',
          isTestChain: false,
          key: 'moonbeam',
          name: 'Moonbeam',
          type: 'evm-parachain',
          assetsData: [Map],
          genesisHash: '0xfe58ea77779b7abda7da4ec526d14db9b1e9cd40a217c34892af80a9b332b76d',
          parachainId: 2004,
          ss58Format: 1284,
          weight: 1000000000,
          ws: 'wss://wss.api.moonbeam.network',
          id: 1284,
          rpc: 'https://rpc.api.moonbeam.network'
        },
        existentialDeposit: e {
          key: 'glmr',
          originSymbol: 'GLMR',
          amount: 0n,
          decimals: 18,
          symbol: 'GLMR'
        },
        fee: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 33068783n,
          decimals: 10,
          symbol: 'DOT'
        },
        min: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 0n,
          decimals: 10,
          symbol: 'DOT'
        }
      },
      getEstimate: [Function: getEstimate],
      isSwapPossible: true,
      max: e {
        key: 'dot',
        originSymbol: 'DOT',
        amount: 0n,
        decimals: 10,
        symbol: 'DOT'
      },
      min: e {
        key: 'dot',
        originSymbol: 'DOT',
        amount: 33068783n,
        decimals: 10,
        symbol: 'DOT'
      },
      source: {
        balance: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 0n,
          decimals: 10,
          symbol: 'DOT'
        },
        chain: m {
          ecosystem: 'polkadot',
          isTestChain: false,
          key: 'polkadot',
          name: 'Polkadot',
          type: 'parachain',
          assetsData: Map(0) {},
          genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
          parachainId: 0,
          ss58Format: 0,
          weight: 1000000000,
          ws: 'wss://rpc.polkadot.io'
        },
        existentialDeposit: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 10000000000n,
          decimals: 10,
          symbol: 'DOT'
        },
        fee: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 169328990n,
          decimals: 10,
          symbol: 'DOT'
        },
        feeBalance: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 0n,
          decimals: 10,
          symbol: 'DOT'
        },
        max: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 0n,
          decimals: 10,
          symbol: 'DOT'
        },
        min: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 0n,
          decimals: 10,
          symbol: 'DOT'
        }
      },
      swap: [AsyncFunction: swap],
      transfer: [AsyncFunction: transfer]
    }
    ```

您有可能在先前的范例返回内容注意到，转移数据包含被转移资产的信息、源链和目标链。除外，还包含了以下函数：

- `swap()` - 返回将资产从目标链交换回源链所需的转移数据
- `transfer()` - 将一定数量的资产从源链转移到目标链
- `getEstimate()` - 返回目标链上减去任何目标费用后将收到的资产预估金额

## 转移资产 {: #transfer-an-asset }

现在您已经构建了转移数据，您可以继续将资产从源链转移到目标链。为此，您可以使用`transfer`功能，但首先您需要指定希望发送的金额。您可以以整数或小数的格式指定金额。例如，如果您想发送0.1 DOT，则可以使用`1000000000n`或`'0.1'`。您可以使用[资产转换函数](/builders/interoperability/xcm/xcm-sdk/v1/reference#utility-functions){target=_blank}，例如`toDecimal`将资产转换为十进制格式。

以此例子来说，您可以转移DOT最小所需数量的两倍：

```js
...

const amount = data.min.toDecimal() * 2;
console.log(`Sending from ${data.source.chain.name} amount: ${amount}`);
const hash = await data.transfer(amount);
console.log(`${data.source.chain.name} tx hash: ${hash}`);
```

如同在以上代码片段中显示，`transfer`函数返回在源链的交易哈希。

!!! 注意事项
    关于更多参数信息以及`transfer`返回数据，请查看[XCM SDK参考页面](/builders/interoperability/xcm/xcm-sdk/v1/reference#transfer-data-consumer-methods){target=_blank}。

## 兑换资产 {: #swap-an-asset}

要兑换特定资产，您可以使用相同的转移数据并调用`data.swap()`以转换源链和目标链信息。在此处，您可以直接调用`transfer`函数以执行兑换。

```js
...

const swapData = await data.swap();
const amount = swapData.min.toDecimal() * 2;
console.log(`Sending from ${swapData.source.chain.name} amount: ${amount}`);
const hash = await swapData.transfer(amount);
console.log(`${swapData.source.chain.name} tx hash: ${hash}`);
```

`swap`函数返回源链和目标链交换的转移数据。以前面从波卡发送DOT到Moonbeam为例子，兑换转移数据将从Moonbeam发送DOT到波卡。

??? code "响应示例"

    ```js
    // swapData
    {
      destination: {
        balance: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 0n,
          decimals: 10,
          symbol: 'DOT'
        },
        chain: m {
          ecosystem: 'polkadot',
          isTestChain: false,
          key: 'polkadot',
          name: 'Polkadot',
          type: 'parachain',
          assetsData: Map(0) {},
          genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
          parachainId: 0,
          ss58Format: 0,
          weight: 1000000000,
          ws: 'wss://rpc.polkadot.io'
        },
        existentialDeposit: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 10000000000n,
          decimals: 10,
          symbol: 'DOT'
        },
        fee: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 169328990n,
          decimals: 10,
          symbol: 'DOT'
        },
        feeBalance: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 0n,
          decimals: 10,
          symbol: 'DOT'
        },
        max: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 0n,
          decimals: 10,
          symbol: 'DOT'
        },
        min: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 0n,
          decimals: 10,
          symbol: 'DOT'
        }
      },
      getEstimate: [Function: getEstimate],
      isSwapPossible: true,
      max: e {
        key: 'dot',
        originSymbol: 'DOT',
        amount: 0n,
        decimals: 10,
        symbol: 'DOT'
      },
      min: e {
        key: 'dot',
        originSymbol: 'DOT',
        amount: 33068783n,
        decimals: 10,
        symbol: 'DOT'
      },
      source: {
        balance: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 0n,
          decimals: 10,
          symbol: 'DOT'
        },
        chain: l {
          ecosystem: 'polkadot',
          isTestChain: false,
          key: 'moonbeam',
          name: 'Moonbeam',
          type: 'evm-parachain',
          assetsData: [Map],
          genesisHash: '0xfe58ea77779b7abda7da4ec526d14db9b1e9cd40a217c34892af80a9b332b76d',
          parachainId: 2004,
          ss58Format: 1284,
          weight: 1000000000,
          ws: 'wss://wss.api.moonbeam.network',
          id: 1284,
          rpc: 'https://rpc.api.moonbeam.network'
        },
        existentialDeposit: e {
          key: 'glmr',
          originSymbol: 'GLMR',
          amount: 0n,
          decimals: 18,
          symbol: 'GLMR'
        },
        fee: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 33068783n,
          decimals: 10,
          symbol: 'DOT'
        },
        min: e {
          key: 'dot',
          originSymbol: 'DOT',
          amount: 0n,
          decimals: 10,
          symbol: 'DOT'
        }
      },
      swap: [AsyncFunction: swap],
      transfer: [AsyncFunction: transfer]
    }
    ```

!!! 注意事项
    关于更多参数信息和`swap`的返回数据，请参考[XCM SDK参考页面](/builders/interoperability/xcm/xcm-sdk/v1/reference#transfer-data-consumer-methods){target=_blank}。

## 获得在目标链上收到的资产预估数量 {: #get-estimate }

当您发送XCM消息时，通常您需要在目标链上支付费用以执行XCM指令。在转移资产之前，您可以使用`getEstimate`函数来计算目标链上将收到资产减去任何费用后的预估金额。

`getEstimate`函数与特定的转移请求相关联，因为它基于正在转移的资产和目标链费用，因此您需要首先创建[转移数据](#build-xcm-transfer-data)。

您需要向`getEstimate`函数提供要转账的金额。在以下范例中，您将获得当转移0.1 DOT时Moonbeam上将收到的DOT的预估数量。您可以以整数（`1000000000n`）或小数点（`'0.1'`）格式作为指定金额。

```js
...

const amount = '0.1';
const estimatedAmount = data.getEstimate(amount);

console.log(
  `The estimated amount of ${
    data.source.balance.originSymbol
  } to be received on ${
    data.destination.chain.name
  } is: ${estimatedAmount.toDecimal()} ${data.destination.balance.symbol}`
);
```

`getEstimate`函数返回预估金额以及有关正在转移的资产的信息。

??? code "响应示例"

    ```js
    // estimatedAmount
    {
      key: 'dot',
      originSymbol: 'DOT',
      amount: 966931217n,
      decimals: 10,
      symbol: 'DOT'
    }
    ```

!!! 注意事项
    关于更多参数信息和`getEstimate`的返回数据，请参考[XCM SDK Reference](/builders/interoperability/xcm/xcm-sdk/v1/reference#transfer-data-consumer-methods){target=_blank}。

## 获得转移的最小和最大数量 {: #transfer-min-max-amounts }

您可以使用[转移数据](#build-xcm-transfer-data)检索可转移资产的最小和最大金额。为此，您将访问正在转移资产的`min`和`max`属性：

=== "Minimum"

    ```js
    ...
    
    const amount = data.min.toDecimal();
    const symbol = data.min.originSymbol;
    
    console.log(`You can send min: ${amount} ${symbol}`);
    ```

=== "Maximum"

    ```js
    ...
    
    const amount = data.max.toDecimal();
    const symbol = data.max.originSymbol;
    
    console.log(`You can send max: ${amount} ${symbol}`);
    ```

`min`和`max`属性将返回可转移资产的最小和最大金额以及资产信息。如果源账户不持有所选资产的余额，则`data.max`金额将为`0n`。

??? code "响应示例"

    ```js
    // data.min
    {
      key: 'dot',
      originSymbol: 'DOT',
      amount: 33068783n,
      decimals: 10,
      symbol: 'DOT'
    }
    // data.max
    {
      key: 'dot',
      originSymbol: 'DOT',
      amount: 0n,
      decimals: 10,
      symbol: 'DOT'
    }
    ```

!!! 注意事项
    关于更多资产和资产数量的信息，请参考[XCM SDK参考页面](/builders/interoperability/xcm/xcm-sdk/v1/reference#assets){target=_blank}。

## 获得转移费用 {: #get-transfer-fees }

[转移数据](#build-xcm-transfer-data)提供有关源链和目标链的转移费用的信息。您可以使用以下代码片段检索费用：

```js
...
const sourceChain = data.source.chain.name;
const sourceFee = data.source.fee;

const destinationChain = data.destination.chain.name;
const destinationFee = data.destination.fee;

console.log(
  `You will pay ${sourceFee.toDecimal()} ${
    sourceFee.symbol
  } fee on ${
    sourceChain
  } and ${destinationFee.toDecimal()} ${
    destinationFee.symbol
  } fee on ${destinationChain}.`
);
```

`fee`属性返回要支付的费用金额以及资产信息。

??? code "响应示例"

    ```js
    // sourceFee
    {
      key: 'dot',
      originSymbol: 'DOT',
      amount: 169328990n,
      decimals: 10,
      symbol: 'DOT'
    }
    // destinationFee
    {
      key: 'dot',
      originSymbol: 'DOT',
      amount: 33068783n,
      decimals: 10,
      symbol: 'DOT'
    }
    ```

!!! 注意事项
    关于更多资产、资产数量和费用的信息，请参考[XCM SDK参考页面](/builders/interoperability/xcm/xcm-sdk/v1/reference#assets){target=_blank}。
