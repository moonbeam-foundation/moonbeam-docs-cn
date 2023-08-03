---
title: 通过XCM从波卡在Moonbeam上执行远程质押
description: 在本教程中，我们将会使用一系列XCM指令利用远程执行的方式在Moonbeam上远程质押GLMR
template: main.html
---

# 通过XCM远程质押

![Banner Image](/images/tutorials/interoperability/remote-staking-via-xcm/remote-staking-via-xcm-banner.png)

_作者：Kevin Neilson_

## 概览 {: #introduction }

在本教程中，我们将通过从Moonbase中继链（相当于波卡中继链）上的帐户发送XCM指令来远程质押DEV Token。本教程将假定您基本上熟悉[XCM](/builders/xcm/overview/){target=_blank}和[通过XCM远程执行](/builders/xcm/xcm-transactor/){target=_blank}等相关内容。您不需要是这些主题内容的专家，但您可能会发现具有一些XCM背景知识会有所帮助。

实际上，有两种可能的方法可以通过XCM在Moonbeam上进行远程质押。我们可以发送一个[远程EVM调用](/builders/xcm/remote-evm-calls/){target=_blank}调用[质押预编译](/builders/pallets-precompiles/precompiles/staking/){target=_blank}，或者我们可以使用XCM直接调用[平行链质押pallet](/builders/pallets-precompiles/pallets/staking/){target=_blank}而无需与EVM交互。在本教程中，我们将采用后者的方法，直接与平行链质押pallet进行交互。

**请注意，您可以通过XCM消息远程执行的操作仍然存在一定限制。**此外，**开发者必须了解发送不正确的XCM消息可能会导致资金损失。**因此，在转移到生产环境之前，在测试网上测试XCM的功能是必要的。

## 查看先决条件 {: #checking-prerequisites }

出于开发目的，本教程是为使用测试网资金的Moonbase Alpha和Moonbase中继链网络编写的。先决条件如下：

- 拥有一个具有一些UNIT的Moonbase Alpha中继链账户，UNIT是Moonbase中继链的原生Token。如果您拥有一个具有DEV的Moonbase Alpha帐户，您可以在[Moonbeam Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}上用一些DEV兑换xcUNIT。然后从Moonbase Alpha通过使用[apps.moonbeam.network](https://apps.moonbeam.network/moonbase-alpha/){target=_blank}提现xcUNIT到[您在Moonbase中继链上的账户](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}
- 您将会需要计算您Moonbase Alpha中继链的[多地点衍生账户（multilocation derivative account）](#calculating-your-multilocation-derivative-account)和使其拥有足够的DEV Token。
  --8<-- 'text/faucet/faucet-list-item.md'

## 计算您的多地点衍生账户 {: #calculating-your-multilocation-derivative-account }

--8<-- 'text/xcm/calculate-multilocation-derivative-account.md'

该脚本将返回32字节和20字节的地址。此处，我们感兴趣的是以太坊格式的帐户，即20字节的帐户。请随时在[Moonscan](https://moonbase.moonscan.io/){target=blank}上查找您的多地点衍生账户。您会注意到此帐户是空的。您需要至少用1.1个DEV为该帐户注入资金。由于这是水龙头分配的量，您需要至少发起两次水龙头请求，或者您可以随时通过[Discord](https://discord.com/invite/amTRXQ9ZpW){target=blank}联系我们请求更多的DEV Token。

## 准备在Moonbase Alpha上质押 {: #preparing-to-stake-on-moonbase-alpha }

首先也是最重要的，您需要您希望委托的收集人的地址。如要找到该地址，请在第二个视窗中前往[Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank}。接着，确保您在正确的网络上，然后点击**Select Collator**。在您想要的委托人旁边，点击**Copy**图标。您还需要记下该委托人拥有的委托数量。下面显示的[PS-31 collator](https://moonbase.subscan.io/account/0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D){target=_blank}在撰写本文时共有`64`个委托。

![Moonbeam Network Apps Dashboard](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-2.png)

## 通过XCM在Polkadot.js进行远程质押 {: #remote-staking-via-xcm-with-polkadot-js-apps }

如果您希望通过Polkadot API编程执行这些步骤，您可以跳至[下方部分教程](#remote-staking-via-xcm-with-the-polkadot-api)。

首先，通过前往[Moonbase Alpha Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts){target=_blank}生成质押操作的编码调用数据。如要在此处查看**Extrinsics**菜单，您需要至少拥有一个可在Polkadot.js Apps中使用的帐户。如果你尚未拥有此类账户，您需要创建一个。接着，导向至**Developer**标签并点击**Extrinsics**。

在以下步骤中，您将准备一个交易，但您需要避免在此处直接提交交易，以便能够完整地完成本教程。我们将准备此质押操作，并从中获取生成的编码调用数据，并在其后的步骤中通过XCM从中继链发送它。在**Extrinsics**页面中，请执行以下步骤：

1. 选择**parachainStaking** Pallet
2. 选择**delegate**函数
3. 粘贴您选择的收集人地址。您可以[通过Polkadot.js API使用这些指令](/tokens/staking/stake/#retrieving-the-list-of-candidates){target=_blank}检索收集人候选人列表
4. 粘贴您希望质押的数量（以Wei为单位）。在此范例中，将会输入1个DEV或是`1000000000000000000` Wei。您可以在[Moonscan](https://moonscan.io/unitconverter){target=_blank}上找到单位转换器
5. 输入收集人现有委托的数量（可以在[Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank}上收集人姓名/地址旁边找到，或者[从Polkadot.js API获取](/tokens/staking/stake/#get-the-candidate-delegation-count){target=_blank}）。或者，您可以输入`{{networks.moonbase.staking.max_del_per_can}}`的上限，因为此估计仅用于确定调用的权重
6. 从您的多地点衍生账户输入您现有的委托数量。这很可能是`0`，但由于此估计仅用于确定调用的权重，因此您可以在此处指定`{{networks.moonbase.staking.max_del_per_del}}`的上限。或者，如果您希望，可以使用Polkadot.js API根据[这些指令](/tokens/staking/stake/#get-your-number-of-existing-delegations){target=_blank}检索您现有委托的准确数量
7. 最后，将编码调用数据复制到文本文件或其他易于访问的地方，因为您稍后会用到它。不要复制编码调用哈希，也不要提交交易

!!! 注意事项
    您可能会注意到下面选择的帐户名为“Academy”。但实际上，您在Moonbase Alpha Polkadot.js Apps中选择了哪个帐户并不重要。这是因为您不需要提交准备好的交易，只需复制编码调用数据，其中不包含对发送帐户的引用。

![Moonbase Alpha Polkadot JS Apps Extrinsics Page](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-3.png)

### 从Polkadot.js Apps传送XCM指令 {: #sending-the-xcm-instructions-from-polkadot-js-apps }

如果您希望通过Polkadot API以代码形式执行此XCM指令，您可以跳至[以下部分教程](#sending-the-xcm-instructions-via-the-polkadot-api)。否则，在另外一个页面标签，请导向至[Moonbase relay Polkadot.Js Apps](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=_blank}。点击**Developer**标签后点击**Extrinsics**。

![Moonbase Relay Polkadot JS Apps Home](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-4.png)

### 构建目标多地点 {: #building-the-destination-multilocation }

让我们来开始构建XCM消息，将我们的远程指令传送至Moonbase Alpha平行链，并最终质押我们所选数量的DEV Token至选定收集人。请跟随以下步骤进行操作：

1. 不像先前步骤中选择账户可为不相关的账户，此处选择的账户必须与您的多地点衍生账户有关
2. 选择**xcmPallet** pallet
3. 选择**send**函数
4. 选择目标版本为**V1**
5. 要将Moonbase Alpha设定为目标地址，需将目的地设为如下：

    ```
    {
      "parents":0,
      "interior":
        {
        "x1":
          {
          "Parachain": 1000
        }
      }
    }
    ```

6. 将消息版本设置为**V2**

![Moonbase Relay Polkadot JS Apps Extrinsics Page](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-5.png)

在下个部分教程，我们将会开始组装XCM指令。

### 准备XCM消息的结构 {: #preparing-the-structure-of-the-xcm-message }

1. 为**XcmVersionedXcm**选择**V2**
2. 我们的XCM消息将会拥有3个不同XCM指令，因此，点击**Add item**三次
3. 在首个XCM指令**WithdrawAsset**的下方，我们需要添加我们将取出的资产，因此请点击**WithdrawAsset**下方的**Add Item**一次

![Preparing the structure of the XCM message](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-6.png)

### 组装XCM消息的内容 {: #assembling-the-contents-of-the-xcm-message }

现在我们已经为重点部分做好了准备！您需要分别在**BuyExecution**和**Transact** XCM指令的下方点击**Add Item**。构建在Moonbase Alpha平行链上远程质押资金的XCM消息将会如下：

```
{
  "WithdrawAsset":
    [
      {
        "id":
          {
            "Concrete":
              {
                "parents": 0,
                "interior": {
                  "X1": {
                    "PalletInstance": 3
                  }
                }
              }
            "Fungible": 100000000000000000
          }
      }
    ],
  "BuyExecution":
    {
      "fees": {
        "id":
          {
            "Concrete":
              {
                "parents": 0,
                "interior": {
                  "X1": {
                    "PalletInstance": 3
                  }
                }
              }
            "Fungible": 100000000000000000
          }
      },
      "weightLimit": "Unlimited"
    },
  "Transact":
    {
      "originType": "SovereignAccount",
      "requiredWeightAtMost": "40000000000",
      "call": {
        "encoded": "0x0c113a7d3048f3cb0391bb44b518e5729f07bcc7a45d000064a7b3b6e00d00000000000000002c01000025000000"
      }
    }
}
```

!!! 注意事项
    提供上述的编码调用数据将自动质押到Moonbase Alpha上的PS-31收集人。如果您已从[Moonbase Alpha Polkadot.js Apps](#preparing-to-stake-on-moonbase-alpha)复制了适当的编码调用数据，欢迎您委托给Moonbase Alpha上的任何收集人。

验证您的XCM消息的结构是否类似于下图，然后点击**Submit Transaction**。请注意，您的编码调用数据将根据您选择的收集人而有所不同。

![Assembling the complete XCM message](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-7.png)

!!! 注意事项
    上述配置的调用的编码调用数据为`0x630001010100a10f020c00040000010403001300008a5d78456301130000010403001300008a5d784563010006010700902f5009b80c113a7d3048f3cb0391bb44b518e5729f07bcc7a45d000064a7b3b6e00d00000000000000002c01000025000000`。

就这样！要验证您的委托是否成功，您可以访问[Subscan](https://moonbase.subscan.io/){target=_blank}查看您的质押余额。请注意，您的质押余额可能需要几分钟才能在Subscan上显示。此外，请注意，您将无法在Moonscan上看到此质押操作，因为我们直接通过平行链质押pallet（在Substrate端）而不是通过质押预编译（在EVM上）启动此委托操作。

## 经由Polkadot API通过XCM远程质押 {: #remote-staking-via-xcm-with-the-polkadot-api }

在此，我们将会采取与上述相同的一系列步骤，只是这次我们将会使用Polkadot API而非[Polkadot.js Apps](#remote-staking-via-xcm-with-polkadot-js-apps)。

首先通过Polkadot API生成编码调用数据，如下所示。在这里，我们不需要提交交易，而是简单地准备一个交易来获取编码调用数据。请记住使用您的帐户更新`delegatorAccount`变量。请您任意在本地运行以下代码段。

```typescript
import { ApiPromise, WsProvider } from "@polkadot/api";
const provider = new WsProvider("wss://wss.api.moonbase.moonbeam.network");

const candidate = "0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D";
const delegatorAccount = "YOUR-ACCOUNT-HERE";
const amount = "1000000000000000000";

const main = async () => {
  const api = await ApiPromise.create({ provider: provider });

  // Fetch the your existing number of delegations and the collators existing delegations
  let delegatorInfo = await api.query.parachainStaking.delegatorState(
    delegatorAccount
  );

  if (delegatorInfo.toHuman()) {
    delegatorDelegationCount = delegatorInfo.toHuman()["delegations"].length;
  } else {
    delegatorDelegationCount = 0;
  }

  const collatorInfo = await api.query.parachainStaking.candidateInfo(
    candidate
  );
  const candidateDelegationCount = collatorInfo.toHuman()["delegationCount"];
  let tx = api.tx.parachainStaking.delegate(
    candidate,
    amount,
    candidateDelegationCount,
    delegatorDelegationCount
  );

  // Get SCALE Encoded Call Data
  let encodedCall = tx.method.toHex();
  console.log(`Encoded Call Data: ${encodedCall}`);
};
main();
```

!!! 注意事项
    如果您以TypeScript项目的方式运行，请确认您在`tsconfig.json`将`compilerOptions`下的`strict`标志设置为`false`。

如果您不希望搭建一个本地环境，您可以选择在[Polkadot.js Apps的JavaScript控制台](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/js){target=_blank}运行以下代码段。

```javascript
const candidate = '0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D';
const delegatorAccount = 'YOUR-ACCOUNT-HERE';
const amount = '1000000000000000000';
  
// Fetch the your existing number of delegations and the collators existing delegations
let delegatorInfo = await api.query.parachainStaking.delegatorState(delegatorAccount);

if (delegatorInfo.toHuman()) {
  delegatorDelegationCount = delegatorInfo.toHuman()['delegations'].length;
} else {
   delegatorDelegationCount = 0;
}

const collatorInfo = await api.query.parachainStaking.candidateInfo(candidate);
const candidateDelegationCount = collatorInfo.toHuman()["delegationCount"];
let tx = api.tx.parachainStaking.delegate(candidate, amount, candidateDelegationCount, delegatorDelegationCount);
  
// Get SCALE Encoded Call Data
let encodedCall = tx.method.toHex();
console.log(`Encoded Call Data: ${encodedCall}`);
```

### 通过Polkadot API发送XCM指令 {: #sending-the-xcm-instructions-via-the-polkadot-api }

在本部分教程中，我们将通过Polkadot API构建和发送XCM指令。我们将制作一条XCM消息，将我们的远程执行指令传输到Moonbase Alpha平行链，最终将我们所选数量的DEV Token质押给选定的收集人。在Moonbase中链继上添加您的开发帐户的助记词后，您可以通过Polkadot API构建和发送交易，如下所示：

```javascript
// Import
import { ApiPromise, WsProvider } from "@polkadot/api";

// Construct API provider
const wsProvider = new WsProvider(
  "wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network"
);
const api = await ApiPromise.create({ provider: wsProvider });

// Import the keyring as required
import { Keyring } from "@polkadot/api";

// Initialize wallet key pairs
const keyring = new Keyring({ type: "sr25519" });
// For demo purposes only. Never store your private key or mnemonic in a JavaScript file
const otherPair = await keyring.addFromUri("YOUR-DEV-SEED-PHRASE-HERE");
console.log(`Derived Address from Private Key: ${otherPair.address}`);

// Create the destination multilocation (define where the message will be sent)
const dest = { V2: { parents: 0, interior: { X1: { Parachain: 1000 } } } };

// Create the full XCM message which defines the action to take on the destination chain
const message = {
  V2: [
    {
      WithdrawAsset: [
        {
          id: {
            concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } },
          },
          fun: { Fungible: 100000000000000000n },
        },
      ],
    },
    {
      BuyExecution: [
        {
          id: {
            Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } },
          },
          fun: { Fungible: 100000000000000000n },
        },
        { unlimited: null },
      ],
    },
    {
      Transact: {
        originType: "SovereignAccount",
        requireWeightAtMost: 40000000000n,
        call: {
          encoded:
            "0x0c113a7d3048f3cb0391bb44b518e5729f07bcc7a45d000064a7b3b6e00d00000000000000002c01000025000000",
        },
      },
    },
  ],
};

// Define the transaction using the send method of the xcm pallet
let tx = api.tx.xcmPallet.send(dest, message);

// Retrieve the encoded calldata of the transaction
const encodedCallData = tx.toHex();
console.log("Encoded call data is" + encodedCallData);

// Sign and send the transaction
const txHash = await tx.signAndSend(otherPair);

// Show the transaction hash
console.log(`Submitted with hash ${txHash}`);
```

!!! 注意事项
    请记得您的多地址衍生账户最少需要拥有1.1个DEV或是超过以确保您有足够的Token执行质押和支付交易费用。

在上述代码段中，除了通过XCM交易提交远程质押，我们还打印出其编码调用数据和交易哈希以便我们进行任何调试。

就这样！为验证您的委托是否成功，您可以访问[Subscan](https://moonbase.subscan.io/){target=_blank}查看您的质押余额。请注意，您的质押余额可能需要几分钟才能在Subscan上显示。此外，请注意，您将无法在Moonscan上看到此质押操作，因为我们直接通过平行链质押pallet（在Substrate端）而不是通过质押预编译（在EVM上）启动委托操作。

--8<-- 'text/disclaimers/educational-tutorial.md'
