---
title: 通过XCM从波卡在Moonbeam上执行远程质押
description: 在本教程中，我们将会使用一系列XCM指令利用远程执行的方式在Moonbeam上远程质押GLMR
template: main.html
---

# 通过XCM远程质押

_作者：Kevin Neilson_

## 概览 {: #introduction }

在本教程中，我们将通过从Moonbase中继链（相当于波卡中继链）上的账户发送XCM指令来远程质押DEV Token。本教程将假定您基本上熟悉[XCM](/builders/interoperability/xcm/overview/){target=_blank}和[通过XCM远程执行](/builders/interoperability/xcm/xcm-transactor/){target=_blank}等相关内容。您不需要是这方面的专家，但您可能会发现拥有一些XCM背景知识会有所帮助。

实际上，有两种可能的方法可以通过XCM在Moonbeam上进行远程质押。我们可以发送一个[远程 EVM调用](/builders/interoperability/xcm/remote-evm-calls/){target=_blank}调用[质押预编译](/builders/pallets-precompiles/precompiles/staking/){target=_blank}，或者我们可以使用XCM直接调用[平行链质押pallet](/builders/pallets-precompiles/pallets/staking/){target=_blank}而无需与EVM交互。在本教程中，我们将采用后者的方法，直接与平行链质押pallet进行交互。

**请注意，通过XCM消息远程执行的操作仍然存在一定限制。**此外，**开发者必须了解发送不正确的XCM消息可能会导致资金损失。**因此，在转移到生产环境之前，在测试网上测试XCM的功能是必要的。

## 查看先决条件 {: #checking-prerequisites }

出于开发目的，本教程是为使用测试网资金的Moonbase Alpha和Moonbase中继链网络编写的。先决条件如下：

- 拥有一个具有一些UNIT的Moonbase Alpha中继链账户，UNIT是Moonbase中继链的原生Token。如果您拥有一个具有DEV的Moonbase Alpha帐户，您可以在[Moonbeam Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}上用一些DEV兑换xcUNIT。然后从Moonbase Alpha通过使用[apps.moonbeam.network](https://apps.moonbeam.network/moonbase-alpha/){target=_blank}提现xcUNIT到[您在Moonbase中继链上的账户](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}
- 您将会需要计算您Moonbase Alpha中继链的[多地点衍生账户（multilocation derivative account）](#calculating-your-multilocation-derivative-account)和使其拥有足够的DEV Token。
  --8<-- 'text/_common/faucet/faucet-list-item.md'

## 计算您的Multilocation衍生账户 {: #calculating-your-multilocation-derivative-account }

--8<-- 'text/builders/interoperability/xcm/calculate-multilocation-derivative-account.md'

此处，我们指定了父值为`1`，因为中继链是请求的来源（并且中继链被视为Moonbase Alpha平行链的父级）。 中继链没有平行链ID，因此该字段被省略。

![Calculate Multi-Location Derivative Account](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-1.png)

此脚本将返回32字节和20字节的地址。我们将使用以太坊格式的地址，也就是20字节的地址。您可以在[Moonscan](https://moonbase.moonscan.io/){target=_blank}上查看您的multilocation衍生账户。请注意，此账户为空白账户，您需要为此账户充值至少1.1个DEV Token。您可以通过[水龙头](https://faucet.moonbeam.network/){target=_blank}获取DEV。如果您需要更多的DEV Token，您可以通过[Discord](https://discord.com/invite/amTRXQ9ZpW){target=_blank}联系我们获取更多的DEV Token。

## 准备在Moonbase Alpha上质押 {: #preparing-to-stake-on-moonbase-alpha }

首先也是最重要的，您需要有想要委托的收集人地址。如要找到该地址，请前往[Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank}。请确保您在正确的网络上，然后点击**Select a Collator**。在您想要的委托人旁边，点击**Copy**图标复制其地址。您还需要记下该委托人拥有的委托数量。下面显示的[PS-31收集人](https://moonbase.subscan.io/account/0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D){target=_blank}在撰写本文时共有`64`个委托。

![Moonbeam Network Apps Dashboard](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-2.png)

## 通过XCM在Polkadot.js API进行远程质押 {: #remote-staking-via-xcm-with-the-polkadot-api }

本教程将涵盖执行远程质押的两个步骤。第一步：我们将生成用于委托收集人的编码调用数据。第二步：我们将通过XCM从中继链发送编码的调用数据给Moonbase Alpha，这将执行委托。

### 生成编码的调用数据 {: #generate-encoded-call-data }

我们将使用[Parachain Staking Pallet](/builders/pallets-precompiles/pallets/staking){target=_blank}的`delegate`函数，此函数接收四个参数，分别为：`candidate`、`amount`、`candidateDelegationCount`和`delegationCount`。

为了生成编码的调用数据，我们需要为每个`delegate`参数组装参数，并使用它们来构建一个调用`delegate`函数的交易。我们并非在提交一笔交易，而是简单地准备一笔交易来获取编码后的调用数据。 我们将执行以下步骤来构建脚本：

1. 创建[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api){target=_blank}提供商
2. 为`delegate`函数的每个参数组装参数：

    - `candidate` - 在本示例中，我们将使用[PS-31收集人](https://moonbase.subscan.io/account/0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D){target=_blank}：`0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D`，要获取完整的候选人列表，请参考[准备质押](#preparing-to-stake-on-moonbase-alpha)部分
    - `amount` - 最低质押量，即1 DEV或者`1000000000000000000` Wei。您可以通过[Moonscan上的单位转换部分](https://moonscan.io/unitconverter){target=_blank}进行单位转换
    - `candidateDelegationCount` - 我们将使用Parachain Staking Pallet的`candidateInfo`函数进行检索，以获得准确的计数。 或者，您可以输入`300`的上限，因为此预估仅用于确定调用的权重
    - `delegationCount` - 我们将使用Parachain Staking Pallet的`delegatorState`函数进行检索，以获取准确的计数。 或者，您可以在此处指定`100`的上限

3. 使用每个所需的参数制作`parachainStaking.delegate` extrinsic
4. 使用交易获取委托的编码调用数据

```js
--8<-- 'code/tutorials/interoperability/remote-staking/generate-encoded-call-data.js'
```

!!! 注意事项
    如果您以TypeScript项目的方式运行，请确认您在`tsconfig.json`将`compilerOptions`下的`strict`标记设置为`false`。

如果您不希望搭建一个本地环境，您可以选择在[Polkadot.js Apps的JavaScript控制台](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/js){target=_blank}运行以下代码段。

??? code "在Polkadot.js Apps JavaScript控制台运行代码"

    ```javascript
    --8<-- 'code/tutorials/interoperability/remote-staking/polkadotjs-apps-encoded-call-data.js'
    ```

### 通过Polkadot.js API组装和发送XCM指令 {: #sending-the-xcm-instructions-via-the-polkadot-api }

在这一部分，我们将使用[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api){target=_blank}通过Alphanet中继链上的XCM Pallet的`send` extrinsic构建和发送XCM指令。XCM消息会将我们的远程执行指令传递到Moonbase Alpha平行链，最终将我们希望质押的DEV Token数量质押给选定的收集人。

XCM Pallet的`send`函数接收两个参数：`dest`和`message`。您可以通过以下步骤开始组装这些参数：

1. 在Moonbase Alpha上为`dest`构建DEV Token的multilocation：

    ```js
    const dest = { V3: { parents: 0, interior: { X1: { Parachain: 1000 } } } };
    ```

2. 构建`WithdrawAsset`指令，这将要求您定义：

    - 在Moonbase Alpha上DEV Token的multilocation
    - 要提现的DEV Token数量

    ```js
    const instr1 = {
      WithdrawAsset: [
        {
          id: {
            Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } },
          },
          fun: { Fungible: 100000000000000000n },
        },
      ],
    },    
    ```

3. 构建`BuyExecution`指令，这将要求您定义：

    - 在Moonbase Alpha上DEV Token的multilocation
    - 购买执行的DEV Token数量
    - 权重上限

    ```js
    const instr2 = {
      BuyExecution: [
        {
          id: {
            Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } },
          },
          fun: { Fungible: 100000000000000000n },
        },
        { Unlimited: null },
      ],
    },    
    ```

4. 构建`Transact`指令，这将要求您定义：

    - origin类型，其为`SovereignAccount`
    - 交易所需的权重，您需要定义可用于执行的计算时间量`refTime`和可使用的存储量`proofSize`（以字节为单位）。建议为此指令赋予的权重需要比您通过XCM执行的调用的Gas限制乘以`25000`还要多10%左右
    - 用于委托收集人的编码调用数据，已在[上一部分](#generate-encoded-call-data)生成

    ```js
    const instr3 = {
      Transact: {
        originType: 'SovereignAccount',
        requireWeightAtMost: { refTime: 40000000000n, proofSize: 900000n },
        call: {
          encoded:
            '0x0c113a7d3048f3cb0391bb44b518e5729f07bcc7a45d000064a7b3b6e00d00000000000000002c01000025000000',
        },
      },
    },    
    ```

5. 将XCM指令结合到版本化的XCM消息中：

    ```js
    const message = { V3: [instr1, instr2, instr3] };
    ```

现在您已经有了每个参数的值，您可以编写脚本来发送XCM消息。 为此，您需要执行以下步骤：

 1. 提供`send`函数的每个参数的值
 2. 使用Alphanet中继链的WSS端点创建[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}提供商
 3. 使用中继链账户的助记词创建Keyring实例，以用于发送交易
 4. 使用`dest`和`message`创建`xcmPallet.send` extrinsic
 5. 使用`signAndSend` extrinsic和第三步创建的Keyring实例发送交易

!!! 请记住
    此操作仅用于演示目的。请勿将您的私钥存储在JavaScript文件中。

```javascript
--8<-- 'code/tutorials/interoperability/remote-staking/remote-staking.js'
```

!!! 注意事项
    请记住，您的multilocation衍生账户必须至少拥有1.1个DEV或更多资金，以确保您有足够的资金进行质押并支付交易费用。

上述代码片段中，除了通过XCM交易提交远程质押之外，我们还输出交易哈希以协助任何调试。

这样就可以了！要验证您的委托是否成功，您可以前往[Subscan](https://moonbase.subscan.io/){target=_blank}查看您的质押余额。请注意，可能需要几分钟时间才能在 Subscan上看到您的质押余额。此外，因为我们直接通过[Parachain Staking Pallet](/builders/pallets-precompiles/pallets/staking){target=_blank}（在Substrate端），而不是通过[Staking Precompile](/builders/pallets-precompiles/precompiles/staking){target=_blank}（在EVM上）进行操作，您将无法在Moonscan上看到此质押操作。

--8<-- 'text/_disclaimers/educational-tutorial.md'
