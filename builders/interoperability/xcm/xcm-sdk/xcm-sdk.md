---
title: XCM SDK
description: 使用Moonbeam XCM SDK轻松从波卡及其生态系统中的平行链向Moonbeam充提跨链资产。
---

# 使用Moonbeam XCM SDK

![XCM SDK Banner](/images/builders/interoperability/xcm/sdk/xcm-sdk-banner.png)

## 概览 {: #introduction }

Moonbeam XCM SDK使开发者能够轻松从波卡或Kusama生态系统中的中继链和其他平行链向Moonbeam或Moonriver充提资产。通过使用SDK，您无需担心定义原始或目标资产的multilocation或在哪个网络上使用extrinsics来发送XCM传输。要存入或是取出资产，您可以简单定义您希望存入或是取出的资产和原链，以及传送账户的签署者和传送数量。

XCM SDK提供简单的协助函数，如`deposit`和`withdraw`，提供非常简单的接口以在波卡和Kusama生态中进行两条链之间的XCM转移。除外，XCM的配置包允许任何平行链项目以标准方法添加信息，使他们能够被XCM SDK支持。

关于Moonbeam XCM SDK中当前可用的函数和接口概览，请查看[参考](/builders/interoperability/xcm/xcm-sdk/reference){target=_blank}页面。

此教程中的示例将在Moonbeam中执行，但步骤也同样适用于Moonriver和Moonbase Alpha。

## 开始操作 {: #getting-started }

要开始操作XCM SDK，您首先需要安装相关的NPM包。接着，您需要创建签署者以签署在Moonbeam和波卡生态中其他链间转移资产的交易。最后，您需要初始化API，其将会提供您资产和链的信息以及用于存款、提现和查看余额信息的必要函数。

### 安装 {: #installation }

要跟随此教程，您将需要安装两个包：XCM SDK包和XCM配置包。

XCM SDK包将使您能够轻松充提资产，还可以查看每个支持资产的余额信息。

XCM配置包将用于获取每个支持资产类型的原资产和原链信息。配置包同样包含基于Moonbeam网络的原生资产和链信息，以及一些SDK中的底层函数。

要安装XCM SDK以及XCM配置包，您可以运行以下指令：

```
npm install @moonbeam-network/xcm-sdk @moonbeam-network/xcm-config
```

您将需要安装依赖项，如[Ethers.js](https://docs.ethers.io/){target=_blank}和[Polkadot.js API](https://polkadot.js.org/docs/api/){target=_blank}。

您可以运行以下指令来安装它们：

```
npm i @polkadot/api-augment @polkadot/types @polkadot/util @polkadot/util-crypto ethers
```

!!! 注意事项
    目前将Moonbeam XCM包与Polkadot.js与 Node.js (JavaScript)一起使用时，存在[已知问题](https://github.com/polkadot-js/api/issues/4315){target=_blank}导致包冲突警告出现在控制台中。推荐您使用TypeScript。

### 创建签署者 {: creating-signers }

在与XCM SDK中的`deposit`和`withdraw`函数交互时，您将需要提供一个[Ethers.js](https://docs.ethers.io/){target=_blank}和[Polkadot.js](https://polkadot.js.org/docs/api/){target=_blank}签署者，用于签署和传送交易。Ethers签署者用于在Moonbeam上签署交易，波卡签署者将用于在您存入资产的原链上签署交易。

举例而言，您可以将一个[MetaMask签署者传递至Ethers](https://docs.ethers.org/v6/getting-started/#starting-connecting){target=_blank}或是其他兼容钱包。如同波卡，您可以[使用`@polkadot/extension-dapp` 库传递一个兼容钱包给签署者](https://polkadot.js.org/docs/extension/){target=_blank}。

要为Ethers.js和Polkadot.js创建一个签署者，您可以查看以下的代码段。在本示例中，您可以使用一个Polkadot.js Keyring以在原链存款时签署交易。请注意，此方法并不被推荐用于生产应用。**请勿将您的私钥或是助记词存于JavaScript或TypeScript文件中**。

=== "Moonbeam"

    ```js
    import { ethers } from "ethers";
    import { Keyring } from '@polkadot/api';
    
    // Set up Ethers provider and signer
    const providerRPC = {
      moonbeam: {
        name: 'moonbeam',
        rpc: '{{ networks.moonbeam.rpc_url }}',
        chainId: {{ networks.moonbeam.chain_id }}, // {{ networks.moonbeam.hex_chain_id }} in hex,
      },
    };
    const provider = new ethers.JsonRpcProvider(
      providerRPC.moonbeam.rpc, 
      {
        chainId: providerRPC.moonbeam.chainId,
        name: providerRPC.moonbeam.name,
      }
    );
    const ethersSigner = new ethers.Wallet('INSERT-PRIVATE-KEY', provider);
    
    // Set up Polkadot keyring
    const keyring = new Keyring({ type: 'sr25519' });
    const polkadotKeyring = keyring.addFromUri(mnemonic);
    ```

=== "Moonriver"

    ```js
    import { ethers } from "ethers";
    import { Keyring } from '@polkadot/api';
    
    // Set up Ethers provider and signer
    const providerRPC = {
      moonriver: {
        name: 'moonriver',
        rpc: '{{ networks.moonriver.rpc_url }}',
        chainId: {{ networks.moonriver.chain_id }}, // {{ networks.moonriver.hex_chain_id }} in hex,
      },
    };
    const provider = new ethers.JsonRpcProvider(
      providerRPC.moonriver.rpc, 
      {
        chainId: providerRPC.moonriver.chainId,
        name: providerRPC.moonriver.name,
      }
    );
    const ethersSigner = new ethers.Wallet('INSERT-PRIVATE-KEY', provider);
    
    // Set up Polkadot keyring
    const keyring = new Keyring({ type: 'sr25519' });
    const polkadotKeyring = keyring.addFromUri('INSERT-MNEMONIC');
    ```

=== "Moonbase Alpha"

    ```js
    import { ethers } from "ethers";
    import { Keyring } from '@polkadot/api';
    
    // Set up Ethers provider and signer
    const providerRPC = {
      moonbase: {
        name: 'moonbase-alpha',
        rpc: '{{ networks.moonbase.rpc_url }}',
        chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex,
      },
    };
    const provider = new ethers.JsonRpcProvider(
      providerRPC.moonbase.rpc, 
      {
        chainId: providerRPC.moonbase.chainId,
        name: providerRPC.moonbase.name,
      }
    );
    const ethersSigner = new ethers.Wallet('INSERT-PRIVATE-KEY', provider);
    
    // Set up Polkadot keyring
    const keyring = new Keyring({ type: 'sr25519' });
    const polkadotKeyring = keyring.addFromUri(mnemonic);
    ```

### 初始化 {: #initializing }

要能够对所有受支持的资产进行存款、提现和查看余额信息，您需要先从XCM SDK导入`init`函数并调用它：

=== "Moonbeam"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonbeam } = init()
    ```

=== "Moonriver"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonriver } = init()
    ```

=== "Moonbase Alpha"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonbase } = init()
    ```

如果您希望支持某个特定钱包，您可以直接将签署者传递至`init`函数。否则，您仅能在为存款或提现构建转移数据时直接传递签署者。要为Ethers和波卡传递签署者，您可以使用以下代码段：

=== "Moonbeam"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonbeam } = init({
      ethersSigner: 'INSERT-ETHERS-SIGNER',
      polkadotSigner: 'INSERT-POLKADOT-SIGNER'
    })
    ```

=== "Moonriver"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonriver } = init({
      ethersSigner: 'INSERT-ETHERS-SIGNER',
      polkadotSigner: 'INSERT-POLKADOT-SIGNER'
    })
    ```

=== "Moonbase Alpha"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonbase } = init({
      ethersSigner: 'INSERT-ETHERS-SIGNER',
      polkadotSigner: 'INSERT-POLKADOT-SIGNER'
    })
    ```

## 使用SDK接口 {: #using-the-api }

Moonbeam SDK提供一个包含一系列获得支持资产信息、初始化网络的链信息以及启用存款、提现和查看余额函数的[接口](/builders/interoperability/xcm/xcm-sdk/reference/#core-sdk-interfaces){target=_blank}的API。

请确保您已经事先将您希望交互的Moonbeawm网络设置[初始化](#initialization)。

### 资产符号 {: #symbols }

一个资产符号代表原链上资产的符号。举例来说，`GLMR`是Moonbeam上的原生资产。

要获得每个网络支持资产符号的列表，您可以访问`symbols`属性。

=== "Moonbeam"

    ```js
    moonbeam.symbols
    ```

=== "Moonriver"

    ```js
    moonriver.symbols
    ```

=== "Moonbase Alpha"

    ```js
    moonbase.symbols
    ```

包含在`symbols`属性的数据范例如下：

```js
[ 'ACA', 'ASTR', 'AUSD', 'DOT', 'GLMR', 'IBTC', 'INTR', 'PARA', 'PHA']
```

### 资产 {: #assets }

要获得支持资产以及相对ID、Moonbeam上的预编译合约以及它们原资产的符号列表，您可以访问`assets`属性：

=== "Moonbeam"

    ```js
    moonbeam.assets
    ```

=== "Moonriver"

    ```js
    moonriver.assets
    ```

=== "Moonbase Alpha"

    ```js
    moonbase.assets
    ```

包含在`assets`属性的数据范例如下：

```js
assets: {
  ACA: {
    id: '224821240862170613278369189818311486111',
    erc20Id: '0xffffffffa922fef94566104a6e5a35a4fcddaa9f',
    originSymbol: 'ACA'
  },
  ASTR: {
    id: '224077081838586484055667086558292981199',
    erc20Id: '0xffffffffa893ad19e540e172c10d78d4d479b5cf',
    originSymbol: 'ASTR'
  },
  ...
}
```

`id`代表资产ID，`erc20id`代表资产的预编译合约地址，而`originSymbol`代表资产在原链上的符号。

### Moonbeam原生资产数据 {: #native-assets }

要获得Moonbeam网络上原生协议资产的信息，如预编译合约以及原符号，您可以访问`moonAsset`属性。

=== "Moonbeam"

    ```js
    moonbeam.moonAsset
    ```

=== "Moonriver"

    ```js
    moonriver.moonAsset
    ```

=== "Moonbase Alpha"

    ```js
    moonbase.moonAsset
    ```

包含在`moonAsset`属性的数据范例如下：

```js
moonAsset: {
  id: '',
  erc20Id: '{{ networks.moonbeam.precompiles.erc20 }}',
  originSymbol: 'GLMR',
  isNative: true
}
```

`erc20Id`代表Moonbeam上的预编译合约地址，`originSymbol`代表原生资产的符号，而`isNative`布林值表示该资产是否为原生资产。

### Moonbeam原生链数据 {: #native-chain-data }

要获得Moonbeam网络上的链数据信息，如链钥、名称、WSS端点、平行链ID、协议资产符号、链ID以及单位每秒，您可以访问`moonChain`属性：

=== "Moonbeam"

    ```js
    moonbeam.moonChain
    ```

=== "Moonriver"

    ```js
    moonriver.moonChain
    ```

=== "Moonbase Alpha"

    ```js
    moonbase.moonChain
    ```

包含在`moonChain`属性的数据范例如下：

```js
moonChain: {
  key: 'Moonbeam',
  name: 'Moonbeam',
  ws: 'wss://wss.api.moonbeam.network',
  parachainId: 2004,
  decimals: 18,
  chainId: 1284,
  unitsPerSecond: 10000000000000000000n
}
```

此处每秒单位代表执行XCM消息每秒收费的Token单位（在本范例中为Wei）。您可以在[XCM费用页面](/builders/interoperability/xcm/fees/#moonbeam-reserve-assets){target=_blank}中找到更多信息。

## 使用SDK函数 {: #using-the-sdk-methods }

Moonbeam SDK提供一个API，其中包含能够启用存款、提现和查看余额信息和其他功能性函数的[函数](/builders/interoperability/xcm/xcm-sdk/reference/#core-sdk-methods){target=_blank}。

确保您已经[初始化](#initialization)您希望交互的Moonbeam网络。您同样需要确认您已经[创建签署者](#creating-signers)以签署和传送存入和取出的转移数据。

### 存入 {: #deposit }

要从其他网络存入资产到Moonbeam，在您传送前，您首先需要使用来自原链的信息构建转移数据。您将需要使用一系列的存入函数构建转移数据。

构建和传送存入转移数据的过程如下：

1. 调用`deposit`函数并输入要存入的[资产符号](#asset-symbols)或是[资产要件](#assets)。您将会获得包含资产原网络信息以及一个将用于构建转移数据`from`函数的[`chains`阵列](#chains-deposit)
2. 调用`from`函数并输入原网络的链钥或是链要件。您可以从`deposit`显现的`chains`阵列结果中获得链要件。您有两种方式可以获得链钥：访问链要件的密钥属性（`chain.key`）或是直接从XCM配置包导入`ChainKey`信息（如以下范例所示）
3. 调用`get`并根据您的代码配置方式，输入您要存入资金的Moonbeam上的帐户地址和签署者或使用波卡地址，您也可以在[Get函数](#get-deposit)部分得到更多信息。接着您需要输入Polkadot.js `Keyring`来签署在[创建签署者](#creating-signers)部分中创建的交易。`get`函数将会返回一个`send`函数，该函数已经包含执行存入所需的所有信息，并将在下一步中使用。此外，还会返回其他信息，例如有关原链资产的信息和Moonbeam上资产的`xc`表达形式，这些信息可能对日志的目的很重要
4. `send`用于传送构建好的存入转移数据以及传送数量。您可以根据需求提供回调函数以处理extrinsic事件

要获得一些需要用于构建存入转移数据的数据，如资产符号和原网络的链钥，您可以从`@moonbeam-network/xcm-config`包导入`AssetSymbol`和`ChainKey`。

如何将DOT从波卡中继链以xcDOT形式存入Moonbeam的步骤如下所示：

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

async function deposit() {
  const dot = AssetSymbol.DOT;
  const polkadot = ChainKey.Polkadot;

  const { chains, from } = moonbeam.deposit(dot);

  console.log(
    `\nYou can deposit ${dot} from these chains: `,
    chains.map((chain) => chain.name),
  );

  const { asset, sourceBalance, source, min, send } = await from(polkadot).get(
    'INSERT-MOONBEAM-ADDRESS',
    polkadotKeyring, // See the Get section for other accepted arguments
  );

  console.log(
    `Your ${asset.originSymbol} balance in ${source.name}: ${toDecimal(
      sourceBalance,
      asset.decimals,
    ).toFixed()}. Minimum transferable amount is: ${toDecimal(min, asset.decimals).toFixed()}`,
  );

  await send('INSERT-AMOUNT', (event) => console.log(event));
}

deposit();
```

#### Chains函数 {: #chains-deposit }

如同先前提及的，`deposit`将会返回`chains`阵列和[`from`函数](#from)。`chains`阵列与您希望存入指定资产的链相关（先前被输入在`deposit`函数）。以下为`chains`阵列的范例：

```js
chains: [
  {
    key: 'Polkadot',
    name: 'Polkadot',
    ws: 'wss://rpc.polkadot.io',
    weight: 1000000000,
    parachainId: 0
  }
]
```

#### From函数 {: #from }

`from`函数需要输入资产传送原链的链钥以获得`get`函数。

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

...

const dot = AssetSymbol.DOT;
const polkadot = ChainKey.Polkadot;

const { from } = moonbeam.deposit(dot);
from(polkadot);
```

#### Get函数 {: #get-deposit }

`get`需要输入在Moonbeam上的接受账户以及根据您如何设置您波卡签署者，需要输入波卡的签署者或波卡上的传送账户，并获得需要用于存入函数的数据。

如果您拥有波卡兼容的签署者，您可以在`init`函数中数据签署者，并在`get`函数中的第二个参数处输入波卡地址：

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

...

const dot = AssetSymbol.DOT;
const polkadot = ChainKey.Polkadot;

const { from } = moonbeam.deposit(dot);
const response = await from(polkadot).get(
  'INSERT-MOONBEAM-ADDRESS',
  'INSERT-POLKADOT-ADDRESS',
);
```

如果您拥有一个波卡兼容签署者但并未将其输入至`init`函数，您则可以在`get`函数中的第二个参数处输入波卡地址并在第三个参数处输入波卡签署者。

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

...

const dot = AssetSymbol.DOT;
const polkadot = ChainKey.Polkadot;

const { from } = moonbeam.deposit(dot);
const response = await from(polkadot).get(
  'INSERT-MOONBEAM-ADDRESS',
  'INSERT-POLKADOT-ADDRESS',
  { polkadotSigner },
);
```

如果您拥有先前在[初始化](#initializing)部分设置的波卡Keyring对，您可以输入`polkadotKeyring`作为第二个参数：


```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

...

const dot = AssetSymbol.DOT;
const polkadot = ChainKey.Polkadot;

const { from } = moonbeam.deposit(dot);
const response = await from(polkadot).get(
  'INSERT-MOONBEAM-ADDRESS',
  polkadotKeyring,
)
```

以下为调用`get`以从波卡传送DOT至Moonbeam的范例：

```js
{
  asset: {
    id: '42259045809535163221576417993425387648',
    erc20Id: '0xffffffff1fcacbd218edc0eba20fc2308c778080',
    originSymbol: 'DOT',
    decimals: 10
  },
  existentialDeposit: 10000000000n,
  min: 33068783n,
  moonChainFee: {
    amount: 33068783n,
    decimals: 10,
    symbol: 'DOT'
  },
  native: {
    id: '42259045809535163221576417993425387648',
    erc20Id: '0xffffffff1fcacbd218edc0eba20fc2308c778080',
    originSymbol: 'DOT',
    decimals: 10
  },
  origin: {
    key: 'Polkadot',
    name: 'Polkadot',
    ws: 'wss://rpc.polkadot.io',
    weight: 1000000000,
    parachainId: 0
  },
  source: {
    key: 'Polkadot',
    name: 'Polkadot',
    ws: 'wss://rpc.polkadot.io',
    weight: 1000000000,
    parachainId: 0
  },
  sourceBalance: 0n,
  sourceFeeBalance: undefined,
  sourceMinBalance: 0n,
  getFee: [AsyncFunction: getFee],
  send: [AsyncFunction: send]
}
```

获得的数值如下所示：

|         数值         |                             描述                             |
| :------------------: | :----------------------------------------------------------: |
|       `asset`        |                   被转移的[资产](#assets)                    |
| `existentialDeposit` | [当前存在的存款](https://support.polkadot.network/support/solutions/articles/65000168651-what-is-the-existential-deposit-#:~:text=On%20the%20Polkadot%20network%2C%20an,the%20Existential%20Deposit%20(ED).){target=_blank}，或是一个地址需要持有 以被定义为存在的最小数量，否则将返回`0n` |
|        `min`         |                        最小可转移数量                        |
|    `moonChainFee`    | 支付Moonbeam的XCM费用所需的[资产](#assets)和金额。如果与要转移的`asset`不同，则费用将在要转移的`asset`之外发送到该资产中(自[v0.4.0](https://github.com/PureStake/xcm-sdk/releases/tag/v0.4.0){target=_blank}起) |
|       `native`       |                 原链上的原生[资产](#assets)                  |
|       `origin`       |                     资产所属原链的链信息                     |
|       `source`       |                 被转移资产从哪里发送的链信息                 |
|   `sourceBalance`    |                   从原链上被转移资产的余额                   |
|  `sourceFeeBalance`  | 原链原生资产中的余额，用于支付资产 转移的费用（如适用)，否则将返回`undefined` |
|  `sourceMinBalance`  |                  在原链上资产转移的最小余额                  |
|       `getFee`       |      预估转移一定数量[所需费用](#get-fee-deposit)的函数      |
|        `send`        |         用于[传送](#send-deposit)存入转移数据的函数          |

#### Send函数 {: #send-deposit }

在调用`send`函数时，您实际上将传送使用`deposit`、`from`和`get`函数构建的存入转移数据。您仅需要简单输入传送的指定数量以及根据需求设定回调函数处理extrinsic事件。举例来说，输入`10000000000n`将从波卡传送`1`个DOT至Moonbeam，因DOT具有10个小数位数。

您可以查看在[存入函数](#deposit)部分的范例以了解如何使用`send`函数。

#### Get Fee函数 {: #get-fee-deposit }

`getFee`函数用于预估在`deposit`函数中转移一定数量资产所需的费用。以下为获得从波卡转移DOT至Moonbeam所需费用的范例：

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';
import { init, toDecimal } from '@moonbeam-network/xcm-sdk';

...

async function getDepositFee() {
  const dot = AssetSymbol.DOT;
  const polkadot = ChainKey.Polkadot;

  const { from } = moonbeam.deposit(dot);
  const { asset, getFee } = await from(polkadot).get(
    'INSERT-MOONBEAM-ADDRESS',
    polkadotKeyring, // See the Get section for other accepted arguments
  );

  const fee = await getFee('INSERT-AMOUNT'));
  console.log(`Fee to deposit is estimated to be: ${toDecimal(fee, asset.decimals).toFixed()} ${dot}`);
}

getDepositFee();
```

### 取出 {: #withdraw }

要从Moonbeam网络取出一项资产并传送回原本网络，在您传送前，首先您必须使用来自原链的信息构建转移数据。您可以跟随以下步骤操作：

1. 调用`withdraw`函数并输入[资产符号](#asset-symbols)或是[资产要件](#assets)，这将获得包含资产原网络的信息以及一个将用于构建传送数据的`to`函数的[`chains`阵列](#chains-withdraw)。
2. 调用`to`函数并输入原网络的链代号。您可以从使用`withdraw`函数获得的`chains`阵列获得链要件。您可以从两个方式获得链钥：访问链要件的钥属性（`chain.key`）或是直接从XCM配置包导入`ChainKey`（如以下范例所示）
3. 调用`get`函数并输入您希望取出资金的在原网络上的账户地址，如果您尚未在初始化时输入Ethers签署者，请在此输入签署者。您将会获得关于原（目标）链的资产信息以及其资产在Moonbeam上的`xc`表现形式，还会获得包含所有执行取出需要信息的`send`函数，这将会在下个步骤使用。除外，其他如资产信息等元素，同样也会返回，对于记录的目的来说很重要
4. `send`函数将会用于构建取出传送数据以及传送数量。您可以根据需求提供回调函数以处理extrinsic事件

要获得一些构建取出传送数据的部分数据，如资产符号和原网络的链钥，您可以从`@moonbeam-network/xcm-config`包导入`AssetSymbol`和`ChainKey`。

以下为从Moonbeam将以xcDOT形式的DOT传送回波卡的步骤：

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

async function withdraw() {
  const dot = AssetSymbol.DOT;
  const polkadot = ChainKey.Polkadot;

  const { chains, to } = moonbeam.withdraw(dot);

  console.log(
    `\nYou can withdraw ${dot} to these chains: `,
    chains.map((chain) => chain.name),
  );

  const { asset, destination, destinationBalance, min, send } = await to(
    polkadot,
  ).get('INSERT-POLKADOT-ADDRESS', {
    ethersSigner: signer, // Only required if you didn't pass the signer in on initialization
  });

  console.log(
    `Your ${asset.originSymbol} balance in ${destination.name}: ${toDecimal(
      destinationBalance,
      asset.decimals,
    ).toFixed()}. Minimum transferable amount is: ${toDecimal(min, asset.decimals).toFixed()}`,
  );

  await send('INSERT-AMOUNT', (event) => console.log(event));
}

withdraw();
```

#### Chains函数 {: #chains-withdraw }

如同先前提及的，`withdraw`将会返回`chains`阵列和`to`函数。`chains`阵列与您希望取出指定资产的链相关（先前被输入在`withdraw`函数）。以下为`chains`阵列的范例：

```js
chains: [
  {
    key: 'Polkadot',
    name: 'Polkadot',
    ws: 'wss://rpc.polkadot.io',
    weight: 1000000000,
    parachainId: 0
  }
]
```

#### To函数 {: #to }

`to`函数需要输入链钥，用于将资产取出的原始链并获得`get`函数。

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

...

const dot = AssetSymbol.DOT;
const polkadot = ChainKey.Polkadot;

const { to } = moonbeam.withdraw(dot);

to(polkadot);
```

#### Get函数 {: #get-withdraw }

`get`函数需要您输入在目标链上的接收数量，以及在Moonbeam上传送账户的Ethers签署者，最后您会获得存入所要求的相关数据。

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

...

const dot = AssetSymbol.DOT;
const polkadot = ChainKey.Polkadot;

const { to } = moonbeam.deposit(dot);
const response =  await to(
    polkadot,
  ).get('INSERT-POLKADOT-ADDRESS', 
  { ethersSigner: signer } // Only required if you didn't pass the signer in on initialization
)
```

以下为调用`get`函数从Moonbeam将以xcDOT形式的DOT传送回波卡的范例：

```js
{
  asset: {
    id: '42259045809535163221576417993425387648',
    erc20Id: '0xffffffff1fcacbd218edc0eba20fc2308c778080',
    originSymbol: 'DOT',
    decimals: 10
  },
  destination: {
    key: 'Polkadot',
    name: 'Polkadot',
    ws: 'wss://rpc.polkadot.io',
    weight: 1000000000,
    parachainId: 0
  },
  destinationBalance: 0n,
  destinationFee: 520000000n,
  existentialDeposit: 10000000000n,
  min: 10520000000n,
  minXcmFeeAsset: {
    amount: 0n,
    decimals: 10,
    symbol: "DOT",
  },
  native: {
    id: '42259045809535163221576417993425387648',
    erc20Id: '0xffffffff1fcacbd218edc0eba20fc2308c778080',
    originSymbol: 'DOT',
    decimals: 10
  },
  origin: {
    key: 'Polkadot',
    name: 'Polkadot',
    ws: 'wss://rpc.polkadot.io',
    weight: 1000000000,
    parachainId: 0
  },
  originXcmFeeAssetBalance: undefined,
  getFee: [AsyncFunction: getFee],
  send: [AsyncFunction: send]
}
```

获得的数值如下所示：

|         数值         |                             描述                             |
| :------------------: | :----------------------------------------------------------: |
|       `asset`        |                   被转移的[资产](#assets)                    |
|    `destination`     |                  资产被转移的目标链的链信息                  |
| `destinationBalance` |                   目标链上账户中资产的余额                   |
|   `destinationFee`   |                 资产转移至目标链上所需的费用                 |
| `existentialDeposit` | [当前存在的存款](https://support.polkadot.network/support/solutions/articles/65000168651-what-is-the-existential-deposit-#:~:text=On%20the%20Polkadot%20network%2C%20an,the%20Existential%20Deposit%20(ED).){target=_blank}，或是一个地址需要持有 以被定义为存在的最小数量，否则将返回`0n` |
|        `min`         |                  被转让资产的最小可转移数量                    |
|   `minXcmFeeAsset`   |            需要一起发送以支付费用的资产的最小可转移数量           |
|       `native`       |                  原链的原生[资产](#assets)                   |
|       `origin`       |                      资产所属原链的链信息                     |
| `originXcmFeeAssetBalance` |   与转账一起发送以支付费用（如果有）的资产的原始账户中的余额   |
|       `getFee`       |       预估存入一定数量[所需费用](#get-fee-withdraw)的函数       |
|        `send`        |           用于[传送](#send-withdraw)取出转移数据的函数         |

#### Send函数 {: #send-withdraw }

当在调用`send`函数时，您实际上将传送使用`withdraw`、`to`和`get`等函数构建的数据的取出传送数据。您仅需要简单地传送指定的数量以及根据需求加入回调函数以处理extrinsic事件。举例来说，输入`10000000000n`将从Moonbeam以xcDOT形式传送`1`个DOT至波卡。

您可以在[取出](#withdraw)部分教程查看如何使用`send`函数。

#### Get Fee函数 {: #get-fee-withdraw }

`getFee`函数用于预估在`withdraw`函数中转移一定数量资产所需的费用。以下为获得从Moonbeam将以xcDOT形式的DOT转移回波卡所需费用（以GLMR为单位）的范例：

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';
import { init } from '@moonbeam-network/xcm-sdk';
import { toDecimal } from '@moonbeam-network/xcm-utils';

...

async function getWithdrawFee() {
  const dot = AssetSymbol.DOT;
  const polkadot = ChainKey.Polkadot;

  const { to } = moonbeam.withdraw(dot);
  const { asset, getFee } = await from(polkadot).get(
    'INSERT-POLKADOT-ADDRESS',
    { ethersSigner }, // Only required if you didn't pass the signer in on initialization
  );

  const fee = await getFee('INSERT-AMOUNT');
  console.log(`Fee to deposit is estimated to be: ${toDecimal(fee, moonbeam.moonChain.decimals).toFixed()} ${moonbeam.moonAsset.originSymbol}`);
}

getWithdrawFee();
```

### 查看资产余额信息 {: #subscribe }

要查看余额信息并获得指定账户的支持资产余额，您可以使用`subscribeToAssetsBalanceInfo`函数并输入您希望获取余额的地址并设置回调函数以处理数据：

=== "Moonbeam"

    ```js
    moonbeam.subscribeToAssetsBalanceInfo('INSERT-ADDRESS', cb)
    ```

=== "Moonriver"

    ```js
    moonriver.subscribeToAssetsBalanceInfo('INSERT-ADDRESS', cb)
    ```

=== "Moonbase Alpha"

    ```js
    moonbase.subscribeToAssetsBalanceInfo('INSERT-ADDRESS', cb)
    ```

以下范例检索Moonbeam上给定帐户的余额信息，并将每个支持资产的余额输出到控制台：

```js
const unsubscribe = await moonbeam.subscribeToAssetsBalanceInfo(
  'INSERT-MOONBEAM-ADDRESS',
  (balances) => {
    balances.forEach(({ asset, balance, origin }) => {
      console.log(
        `${balance.symbol}: ${toDecimal(balance.balance, balance.decimals).toFixed()} (${
          origin.name
        } ${asset.originSymbol})`,
      );
    });
  },
);

unsubscribe();
```

### 效用函数 {: #sdk-utils }

XCM SDK和XCM Utilities包中都有效用函数。 XCM SDK提供以下与SDK相关的效用函数：

- [`isXcmSdkDeposit`](#deposit-check)
- [`isXcmSdkWithdraw`](#withdraw-check)

XCM Utilities包提供了以下通用效用函数：

- [`toDecimal`](#decimals)
- [`toBigInt`](#decimals)
- [`hasDecimalOverflow`](#decimals)

#### 查看转移数据是否用于存入  {: #deposit-check }

要确定一个转移数据是否是用于存入，您可以将转移数据输入`isXcmSdkDeposit`函数，您会获得一个布林值。如果返回`true`则该转移数据是用于存入，如果返回`false`则相反。

以下为范例：

```js
import { init, isXcmSdkDeposit } from '@moonbeam-network/xcm-sdk';

...

const deposit = moonbeam.deposit(moonbeam.symbols[0])
console.log(isXcmSdkDeposit(deposit)) // Returns true
```

```js
import { init, isXcmSdkDeposit } from '@moonbeam-network/xcm-sdk';

...

const withdraw = moonbeam.withdraw(moonbeam.symbols[0])
console.log(isXcmSdkDeposit(withdraw)) // Returns false
```

#### 查看转移数据是否用于取出 {: #withdraw-check }

要确定一个转移数据是否用于取出，您可以在`isXcmSdkWithdraw`输入转移数据，您会获得一个布林值。如果返回`true`则该转移数据是用于取出，如果返回`false`则相反。

以下为范例：

```js
import { init, isXcmSdkWithdraw } from '@moonbeam-network/xcm-sdk';

...

const withdraw = moonbeam.withdraw(moonbeam.symbols[0])
console.log(isXcmSdkWithdraw(withdraw)) // Returns true
```

```js
import { init, isXcmSdkWithdraw } from '@moonbeam-network/xcm-sdk';

...

const deposit = moonbeam.deposit(moonbeam.symbols[0])
console.log(isXcmSdkDeposit(deposit)) // Returns false
```

#### 将余额转换为十进制或BigInt {: #decimals }

要将余额转换为十进制格式，您可以使用`toDecimal`函数，根据提供的小数位数以十进制格式返回给定数字。您可以根据需求在第三个参数中输入数值以指示使用的最大小数位数，预设值为`6`；第四个参数指示了数字的[舍入方法](https://mikemcl.github.io/big.js/#rm){target=_blank}。
`toDecimal`函数返回一个Big数字类型，您可以使用其方法 `toNumber`、`toFixed`、`toPrecision`和`toExponential`将其转换为数字或字符串。 我们建议将它们用作字符串，因为在使用数字类型时，大数字或有很多小数的数字可能会失去精度。

要将十进制数转换回BigInt，您可以使用`toBigInt`函数，该函数根据提供的小数位数返回BigInt格式的给定数字。

举例而言，您可以使用以下代码将Moonbeam上以Wei为单位的余额转换成Glimmer：

```js
import { toDecimal, toBigInt } from '@moonbeam-network/xcm-utils';

const balance = toDecimal(3999947500000000000n, 18).toFixed();
console.log(balance); // Returns '3.999947'

const big = toBigInt('3.999947', 18);
console.log(big); // Returns 3999947000000000000n
```

您还可以使用`hasDecimalOverflow`来确保给定数字的小数位数不超过允许的位数。这对表单输入很有帮助。
