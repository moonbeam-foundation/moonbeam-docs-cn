---
title: Remote Staking on Moonbeam from Polkadot via XCM 通过XCM从波卡在Moonbeam上执行远程质押
description: In this guide, we'll be leveraging remote execution to remotely stake GLMR on Moonbeam using a series of XCM instructions. 在本教程中，我们将会使用一系列XCM指令利用远程执行的方式在Moonbeam上远程质押GLMR
template: main.html
---

# Remote Staking via XCM 通过XCM远程质押

![Banner Image](/images/tutorials/interoperability/remote-staking-via-xcm/remote-staking-via-xcm-banner.png)
_December 14, 2022 | by Kevin Neilson_

_本教程更新至2022年12月14日 | 作者：Kevin Neilson_


## Introduction 概览 {: #introduction }

In this tutorial, we’ll stake DEV tokens remotely by sending XCM instructions from an account on the Moonbase relay chain (equivalent to the Polkadot relay chain). This tutorial assumes a basic familiarity with [XCM](/builders/xcm/overview/){target=_blank} and [Remote Execution via XCM](/builders/xcm/xcm-transactor/){target=_blank}. You don’t have to be an expert on these topics but you may find it helpful to have some XCM knowledge as background. 

在本教程中，我们将通过从Moonbase中继链（相当于波卡中继链）上的帐户发送XCM指令来远程质押DEV Token。本教程将假定您基本上熟悉[XCM](/builders/xcm/overview/){target=_blank}和[通过XCM远程执行](/builders/xcm/xcm-transactor/){target=_blank}等相关内容。您不需要是这些主题内容的专家，但您可能会发现具有一些XCM背景知识会有所帮助。

There are actually two possible approaches for staking on Moonbeam remotely via XCM. We could send a [remote EVM call](/builders/xcm/remote-evm-calls/){target=_blank} that calls the [staking precompile](/builders/pallets-precompiles/precompiles/staking/){target=_blank}, or we could use XCM to call the [parachain staking pallet](/builders/pallets-precompiles/pallets/staking/){target=_blank} directly without interacting with the EVM. For this tutorial, we’ll be taking the latter approach and interacting with the parachain staking pallet directly. 

实际上，有两种可能的方法可以通过XCM在Moonbeam上进行远程质押。我们可以发送一个[远程 EVM调用](/builders/xcm/remote-evm-calls/){target=_blank}调用[质押预编译](/builders/pallets-precompiles/precompiles/staking/){target= _blank}，或者我们可以使用XCM直接调用[平行链质押pallet](/builders/pallets-precompiles/pallets/staking/){target=_blank}而无需与EVM交互。在本教程中，我们将采用后者的方法，直接与平行链质押pallet进行交互。

**Note that there are still limitations in what you can remotely execute through XCM messages.** In addition, **developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

**请注意，您可以通过XCM消息远程执行的操作仍然存在一定限制。**此外，**开发者必须了解发送不正确的XCM消息可能会导致资金损失。**因此，在转移到生产环境之前，在测试网上测试XCM的功能是必要的。

## Checking Prerequisites 查看先决条件 {: #checking-prerequisites }

For development purposes this tutorial is written for Moonbase Alpha and Moonbase relay using TestNet funds. For prerequisites:

出于开发目的，本教程是为使用测试网资金的Moonbase Alpha和Moonbase中继链网络编写的。先决条件如下：

- A Moonbase Alpha relay chain account funded with some UNIT, the native token of the Moonbase relay chain. If you have a Moonbase Alpha account funded with DEV tokens, you can swap some DEV for xcUNIT here on [Moonbeam Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}. Then withdraw the xcUNIT from Moonbase Alpha to [your account on the Moonbase relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank} using [apps.moonbeam.network](https://apps.moonbeam.network/moonbase-alpha/){target=_blank} 
- 拥有一个具有一些UNIT的Moonbase Alpha中继链账户，UNIT是Moonbase中继链的原生Token。如果您拥有一个具有DEV的Moonbase Alpha帐户，您可以在[Moonbeam Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}上用一些DEV兑换xcUNIT。然后从Moonbase Alpha通过使[apps.moonbeam.network](https://apps.moonbeam.network/moonbase-alpha/){target=_blank}提现xcUNIT到[您在Moonbase中继链上的账户](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g .moonbase.moonbeam.network#/accounts){target=_blank}
- You'll need to [calculate the multilocation derivative account](#calculating-your-multilocation-derivative-account) of your Moonbase Alpha relay chain account and fund it with DEV tokens.
- 您将会需要计算您Moonbase Alpha中继链的[多地点衍生账户](#calculating-your-multilocation-derivative-account)和使其用于足够的DEV Token。

  --8<-- 'text/faucet/faucet-list-item.md'

## Calculating your Multilocation Derivative Account 计算您的多地点衍生账户 {: #calculating-your-multilocation-derivative-account }

Copy the account of your existing or newly created account on the [Moonbase relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}. You're going to need it to calculate the corresponding multilocation derivative account, which is a special type of account that’s keyless (the private key is unknown). Transactions from a multilocation derivative account can be initiated only via valid XCM instructions from the corresponding account on the relay chain. In other words, you are the only one who can initiate transactions on your multilocation derivative account - and if you lose access to your Moonbase relay account, you’ll also lose access to your multilocation derivative account. 

复制您在[Moonbase中继链](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g .moonbase.moonbeam.network#/accounts){target=_blank}的现有或新创建的账户。您将需要它来计算相应的多地点衍生账户，这是一种特殊类型的无密钥账户（其私钥未知）。来自多地点衍生账户的交易只能通过来自中继链上相应账户的有效XCM指令启动。换句话说，您是唯一可以在您的多地点衍生账户上发起交易的人——如果您无法访问您的Moonbase中继链账户，您也将无法访问您的多地点衍生账户。

To generate the multilocation derivative account, first clone Alberto’s [xcmTools repo](https://github.com/albertov19/xcmTools){target=_blank}. Run `yarn` to install the necessary packages and then run:

如要生成多地点衍生账户，首先请复制Alberto的[xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank}代码库，运行`yarn`指令以安装所有必要代码包并运行以下指令：


    ts-node calculateMultilocationDerivative.ts \
     --w wss://wss.api.moonbase.moonbeam.network \
     --a YOUR-MOONBASE-RELAY-ACCOUNT-HERE \
     --n 0x57657374656e64

Let's review the parameters passed along with this command:

接着，让我们检查以上指令中输入的相关参数：

- The `-w` flag corresponds to the endpoint we’re using to fetch this information
  
- `-w`标记与我们用于检索此信息的终端有关
  
- The `-a` flag corresponds to your Moonbase relay chain address
- `-a`标记与您的Moonbase中继链地址有关
- The `-n` flag corresponds to the encoded form of “westend”, the name of the relay chain that Moonbase relay is based on
- `-n`标记与“westend”（Moonbase中继基于的中继链名称）的编码形式有关

The script will return 32-byte and 20-byte addresses. We’re interested in the ethereum-style account - the 20-byte one. Feel free to look up your multilocation derivative account on [Moonscan](https://moonbase.moonscan.io/){target=_blank}. You’ll note that this account is empty. You’ll now need to fund this account with at least 1.1 DEV. As this is the amount that the faucet dispenses, you'll need to make a minimum of two faucet requests or you can always reach out to us on [Discord](https://discord.com/invite/amTRXQ9ZpW){target=_blank} for additional DEV tokens.

该脚本将返回32字节和20字节的地址。此处，我们将对以太坊格式的帐户感兴趣，即20字节的帐户。请随时在[Moonscan](https://moonbase.moonscan.io/){target=blank}上查找您的多地点衍生账户。您会注意到此帐户是空的。您需要至少用1.1个DEV为该帐户注入资金。由于这是水龙头分配的量，您需要至少发起两次水龙头请求，或者您可以随时通过[Discord](https://discord.com/invite/amTRXQ9ZpW){target=blank}请求用于其他情况的DEV Token。

## Preparing to Stake on Moonbase Alpha 准备在Moonbase Alpha上质押 {: #preparing-to-stake-on-moonbase-alpha }

First and foremost, you’ll need the address of the collator you want to delegate to. To locate it, head to the [Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank} in a second window. Ensure you’re on the correct network, then press **Select a Collator**. Next to your desired collator, press the **Copy** icon. You’ll also need to make a note of the number of delegations your collator has. The [PS-31 collator](https://moonbase.subscan.io/account/0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D){target=_blank} shown below has `60` delegations at the time of writing. 

首先也是最重要的，您需要您希望委托的收集人的地址。如要找到该地址，请前往第二个视窗中的[Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank}。接着，确保您在正确的网络上，然后点击**Select a Collator**。在您想要的委托人旁边，点击**Copy**图标。您还需要记下该委托人拥有的委托数量。下面显示的[PS-31 collator](https://moonbase.subscan.io/account/0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D){target=_blank}在撰写本文时共有`60`个委托。

![Moonbeam Network Apps Dashboard](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-1.png)

## Remote Staking via XCM with Polkadot.js Apps 通过XCM在Polkadot.js进行远程质押 {: #remote-staking-via-xcm-with-polkadot-js-apps } 

If you prefer to perform these steps programmatically via the Polkadot API, you can instead skip to the [following section](#remote-staking-via-xcm-with-the-polkadot-api). 

如果您希望通过Polkadot API以代码执行这些步骤，您可以省略[下方部分教程](#remote-staking-via-xcm-with-the-polkadot-api)。

First, generate the encoded call data of the staking action by heading to [Moonbase Alpha Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts){target=_blank}. In order to see the **Extrinsics** menu here, you’ll need to have at least one account accessible in Polkadot.js Apps. If you don’t, create one now. Then, head to the **Developer** tab and press **Extrinsics**. 

首先，通过前往[Moonbase Alpha Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts){target=_blank}生成质押时间的编码调用数据。如要在此处查看**Extrinsics**菜单，您需要至少拥有一个可在Polkadot.js Apps中使用的帐户。如果你尚未拥有此类账户，您需要创建一个。接着，导向至**Developer**标签并点击**Extrinsics**。

![Moonbase Alpha Polkadot JS Apps Home](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-2.png)

In the following steps you will be preparing a transaction, but you’ll need to refrain from submitting the transaction here in order to complete this tutorial in its entirety. We’ll take the resulting encoded call data from preparing this staking operation, and send it via XCM from the relay chain in a later step. From the **Extrinsics** page, take the following steps:

在以下步骤中，您将准备一个交易，但您需要避免在此处直接提交交易，以便能够完整地完成本教程。我们将从准备此质押操作中获取生成的编码调用数据，并在其后的步骤中通过XCM从中继链发送它。在**Extrinsics**页面中，请执行以下步骤：

1. Select the **parachainStaking** Pallet

   选择**parachainStaking** Pallet

2. Select the **delegate** function

   选择**delegate**函数

3. Paste in your selected collator’s address. You can retrieve a list of collator candidates [via the Polkadot.js API with these instructions](/tokens/staking/stake/#retrieving-the-list-of-candidates){target=_blank}

   粘贴您选择的收集人地址。您可以[通过Polkadot.js API使用这些指令](/tokens/staking/stake/#retrieving-the-list-of-candidates){target=_blank}检索收集人候选人列表

4. Paste your desired stake amount in Wei. In the below example 1 DEV or `1000000000000000000` Wei is specified. You can find a unit converter here on [Moonscan](https://moonscan.io/unitconverter){target=_blank}

   粘贴您希望质押的数量（以Wei为单位）。在此范例中，将会输入1个DEV或是`1000000000000000000` Wei。您可以在[Monscan](https://moonscan.io/unitconverter){target=_blank}上找到单位转换器。

5. Enter the collator’s number of existing delegations (this can be found next to the collator’s name / address on the [Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank} or [fetched from the Polkadot.js API](/tokens/staking/stake/#get-the-candidate-delegation-count){target=_blank}). Alternatively, you can enter the upper bound of `{{networks.moonbase.staking.max_del_per_can}}` because this estimation is only used to determine the weight of the call

   输入收集人现有委托的数量（可以在[Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank}上收集人姓名/地址旁边找到，或者[从Polkadot.js API获取](/tokens/staking/stake/#get-the-candidate-delegation-count){target=_blank})。或者，您可以输入`{{networks.moonbase.staking.max_del_per_can}}`的上限，因为此估计仅用于确定调用的权重

6. Enter your number of existing delegations from your multilocation derivative account. This is most likely `0` but because this estimation is only used to determine the weight of the call, you can specify an upper bound here of `{{networks.moonbase.staking.max_del_per_del}}`. Or, if you'd prefer, you can use the Polkadot.js API to fetch your exact number of existing delegations according  to [these instructions](/tokens/staking/stake/#get-your-number-of-existing-delegations){target=_blank}

   从您的多地点衍生账户输入您现有的委托数量。这很可能是`0`，但由于此估计仅用于确定调用的权重，因此您可以在此处指定`{{networks.moonbase.staking.max_del_per_del}}`的上限。或者，如果您希望，可以使用Polkadot.js API根据[这些指令](/tokens/staking/stake/#get-your-number-of-existing-delegations ){target=_blank}检索您现有委托的准确数量

7. Finally, copy the encoded call data to a text file or another easily accessible place because you will need it later. Do not copy the encoded call hash, and do not submit the transaction

   最后，将编码调用数据复制到文本文件或其他易于访问的地方，因为您稍后会用到它。不要复制编码调用哈希，也不要提交交易

!!! note 注意事项
    Astute readers may notice the selected account below is named “Academy.” It does not matter which account you have selected in Moonbase Alpha Polkadot.js Apps. This is because you're not submitting the prepared transaction, only copying the encoded call data, which does not contain a reference to the sending account. 

您可能会注意到下面选择的帐户名为“Academy”。但实际上，您在Moonbase Alpha Polkadot.js Apps中选择了哪个帐户并不重要。这是因为您不需要提交准备好的交易，只需复制编码调用数据，其中不包含对发送帐户的引用。

![Moonbase Alpha Polkadot JS Apps Extrinsics Page](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-3.png)


### Sending the XCM Instructions from Polkadot.js Apps 从Polkadot.js Apps传送XCM指令 {: #sending-the-xcm-instructions-from-polkadot-js-apps } 

If you'd prefer to submit the XCM instructions programmatically via the Polkadot API, you can skip to the [following section](#sending-the-xcm-instructions-via-the-polkadot-api). Otherwise, in another tab, head to [Moonbase relay Polkadot.Js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=_blank}. Click on the **Developer** tab and press **Extrinsics**. 

如果您希望通过Polkadot API以代码执行此XCM指令，您可以省略[以下部分教程](#sending-the-xcm-instructions-via-the-polkadot-api)。否则，在另外一个页面标签，请导向至[Moonbase relay Polkadot.Js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=_blank}。点击**Developer**标签后点击**Extrinsics**。

![Moonbase Relay Polkadot JS Apps Home](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-4.png)

### Building the Destination Multilocation 构建目标多地点 {: #building-the-destination-multilocation }

Let’s get started crafting our XCM message that will transport our remote execution instructions to the Moonbase Alpha parachain to ultimately stake our desired amount of DEV tokens to a chosen collator. To get started, take the following steps: 

让我们来开始构建XCM消息，将我们的远程指令传送至Moonbase Alpha平行链，并最终质押我们所选数量的DEV Token至选定收集人。请跟随以下步骤进行操作：

1. Unlike the prior steps where the selected account wasn’t relevant, the account selected here must be the account associated with your multilocation derivative account 

   不像先前步骤中选择账户可为无相关的账户，此处选择的账户必须与您的多地点衍生账户有关

2. Choose the **xcmPallet** pallet

   选择**xcmPallet** pallet

3. Choose the **send** method

   选择**send**函数

4. Set the destination version to **V1**

   选择目标版本为**V1**

5. To target Moonbase Alpha, set the destination to:

   要将Moonbase Alpha设定为目标，将目标设置为如下：

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
6. Set the message version to **V2**

   将消息版本设置为**V2**

![Moonbase Relay Polkadot JS Apps Extrinsics Page](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-5.png)

In the next section, we’ll start assembling the XCM instructions. 

在下个部分教程，我们将会开始整合XCM指令。

### Preparing the Structure of the XCM Message 准备XCM消息架构 {: #preparing-the-structure-of-the-xcm-message }

1. Select **V2** for **XcmVersionedXcm**

   为**XcmVersionedXcm**选择**V2**

2. Our XCM Message is going to have 3 distinct XCM instructions, so press the first **Add Item** button 3 times 

   我们的XCM消息将会拥有3个不同XCM指令，因此，点击**Add item**三次

3. Below the first XCM Instruction of **WithdrawAsset**, we need to add the asset we’re going to withdraw here, so press the **Add Item** button below **WithdrawAsset** once 

   在首个XCM指令**WithdrawAsset**的下方，我们需要添加我们将取出的资产，因此请点击**WithdrawAsset**下方的**Add Item**一次

![Preparing the structure of the XCM message](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-6.png)

### Assembling the Contents of the XCM Message 整合XCM消息内容 {: #assembling-the-contents-of-the-xcm-message }

Now we’re ready for the fun part! You'll need to press **Add Item** beneath the **BuyExecution** and **Transact** XCM instructions respectively. Construct the XCM message that will remotely stake funds on the Moonbase Alpha parachain as follows:

现在我们已经为重点部分做好了准备！您需要在**BuyExecution**和**Transact** XCM指令的下方分别点击**Add Item**。构建在Moonbase Alpha平行链上远程质押资金的XCM消息将会如下：

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

!!! note 注意事项
    Providing the above encoded call data will automatically stake to the PS-31 collator on Moonbase Alpha. You are welcome to delegate to any collator on Moonbase Alpha provided you have copied the appropriate encoded call data from [Moonbase Alpha Polkadot.js Apps]( #preparing-to-stake-on-moonbase-alpha). 

提供上述的编码调用数据将自动质押到Moonbase Alpha上的PS-31收集人。如果您已从[Moonbase Alpha Polkadot.js Apps](#preparing-to-stake-on-moonbase-alpha)复制了正确的编码调用数据，欢迎您委托给Moonbase Alpha上的任何收集人。

Verify that the structure of your XCM message resembles the below image, then press **Submit Transaction**. Note that your encoded call data will vary based on your chosen collator.

验证您的XCM消息的结构是否类似于下图，然后点击**Submit Transaction**。请注意，您的编码调用数据将根据您选择的收集人而有所不同。

![Assembling the complete XCM message](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-7.png)

!!! note 注意事项
    The encoded call data for the call configured above is `0x630001010100a10f020c00040000010403001300008a5d78456301130000010403001300008a5d784563010006010700902f5009b80c113a7d3048f3cb0391bb44b518e5729f07bcc7a45d000064a7b3b6e00d00000000000000002c01000025000000`.

上述调用配置的编码调用数据为`0x630001010100a10f020c00040000010403001300008a5d78456301130000010403001300008a5d784563010006010700902f5009b80c113a7d3048f3cb0391bb44b518e5729f07bcc7a45d000064a7b3b6e00d00000000000000002c01000025000000`。

And that’s it! To verify that your delegation was successful, you can visit [Subscan](https://moonbase.subscan.io/){target=_blank} to check your staking balance. Be advised that it may take a few minutes before your staking balance is visible on Subscan. Additionally, be aware that you will not be able to see this staking operation on Moonscan, because we initiated the delegation action directly via the parachain staking pallet (on the substrate side) rather than through the staking precompile (on the EVM).

就这样！要验证您的委托是否成功，您可以访问[Subscan](https://moonbase.subscan.io/){target=_blank}查看您的质押余额。请注意，您的质押余额可能需要几分钟才能在Subscan上显示。此外，请注意，您将无法在Moonscan上看到此质押操作，因为我们直接通过平行链质押pallet（在Substrate端）而不是通过质押预编译（在EVM上）启动此委托操作。

## Remote Staking via XCM with the Polkadot API - 经由Polkadot API通过XCM远程质押 {: #remote-staking-via-xcm-with-the-polkadot-api } 

Here, we'll be taking the same series of steps as above, only this time, we'll be relying on the Polkadot API instead of [using Polkadot.js Apps](#remote-staking-via-xcm-with-polkadot-js-apps).

在此，我们将会采用部分先前所用的步骤，只是这次我们将会使用Polkadot API而非[Polkadot.js Apps](#remote-staking-via-xcm-with-polkadot-js-apps)。

Start by generating the encoded call data via the Polkadot API as shown below. Here, we are not submitting a transaction but simplying preparing one to get the encoded call data. Remember to update `delegatorAccount` with your account. Feel free to run the below code snippet locally.

首先通过Polkadot API生成编码调用数据，如下所示。在这里，我们不需要提交交易，而是简单地准备一个交易来获取编码调用数据。请记住使用您的帐户更新`delegatorAccount`。请您任意在本地运行以下代码段。

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

!!! note 注意事项
    If running this as a TypeScript project, be sure to set the `strict` flag under `compilerOptions` to `false` in your `tsconfig.json`.

如果您以TypeScript项目的方式运行，请确认您在`tsconfig.json`将`compilerOptions`下的`strict`标记设置为`false`。

If you'd prefer not to set up a local environment you can run the below snippet in the [JavaScript console of Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/js){target=_blank}.

如果您不希望搭建一个本地环境您可以选择在[Polkadot.js Apps的JavaScript控制端](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/js){target=_blank}运行以下代码段。

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

### Sending the XCM Instructions via the Polkadot API - 通过Polkadot API传送XCM指令 {: #sending-the-xcm-instructions-via-the-polkadot-api }

In this section we'll be constructing and sending the XCM instructions via the Polkadot API. We'll be crafting an XCM message that will transport our remote execution instructions to the Moonbase Alpha parachain to ultimately stake our desired amount of DEV tokens to a chosen collator. After adding the seed phrase of your development account on Moonbase relay, you can construct and send the transaction via the Polkadot API as follows:

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

!!! note 注意事项
    Remember that your multilocation derivative account must be funded with at least 1.1 DEV or more to ensure you have enough to cover the stake amount and transaction fees.

请记得您的多地址衍生账户最少需要拥有1.1个DEV或是超过以确保您有足够的Token执行质押和支付交易费用。

In the above snippet, besides submitting the remote staking via XCM transaction, we also print out the encoded call data and the transaction hash to assist with any debugging. 

在上述代码段中，除了通过XCM交易提交远程质押，我们同样列出其编码调用数据和交易哈希以便我们进行除错。

And that’s it! To verify that your delegation was successful, you can visit [Subscan](https://moonbase.subscan.io/){target=_blank} to check your staking balance. Be advised that it may take a few minutes before your staking balance is visible on Subscan. Additionally, be aware that you will not be able to see this staking operation on Moonscan, because we initiated the delegation action directly via the parachain staking pallet (on the Substrate side) rather than through the staking precompile (on the EVM).

就这样！为验证您的委托是否成功，您可以访问[Subscan](https://moonbase.subscan.io/){target=_blank}查看您的质押余额。请注意，您的质押余额可能需要几分钟才能在Subscan上显示。此外，请注意，您将无法在Moonscan上看到此质押操作，因为我们直接通过平行链质押pallet（在Substrate端）而不是通过质押预编译（在EVM上）启动委托操作。

--8<-- 'text/disclaimers/educational-tutorial.md'