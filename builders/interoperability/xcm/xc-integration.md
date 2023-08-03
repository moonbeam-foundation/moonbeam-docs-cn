---
title: 开通跨链通道
description: 学习如何与基于Moonbeam的网络建立跨链集成，包括开通和接受HRMP通道以及注册资产。
---

# 与Moonbeam建立XC集成

![XCM Overview Banner](/images/builders/interoperability/xcm/xc-integration/xc-integration-banner.png)

## 概览 {: #introduction }

跨链消息传递（Cross-Chain Message Passing，XCMP）仍在开发当中，暂替方案是水平中继路由消息传递（Horizontal Relay-routed Message Passing，HRMP）。HRMP具有与XCMP相同的接口和功能，但其消息通过中继链存储和读取，而对于XCMP，只有消息相关的元数据存储在中继链。由于所有的消息通过HRMP的中继链传递，因此对资源的要求更高。HRMP将会在XCMP实施后被弃用。

所有与Moonbeam的XCMP通道集成均是单向的，这意味着消息仅在一个方向上流动。如果A链向B链发起一个通道，则A链将只被允许发送消息给B链，B链无法向A链发送消息。如此而来，B链需要再向A链开通通道，才能实现链间的消息互通。

XCMP（或HRMP）通道开通后，两条链的相应资产需要先注册才能转移。

本教程将涵盖如何在平行链和基于Moonbeam的网络之间开通和接受HRMP通道。另外，本教程提供在平行链上注册基于Moonbeam网络资产的所需数据以及在任何基于Moonbeam网络上注册资产时所需的数据。

本教程的所有操作将使用CLI工具进行整个流程的开发，您可以在[xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools){target=_blank}中找到此工具。

```
git clone https://github.com/PureStake/xcm-tools && \
cd xcm-tools && \
yarn
```

## Moonbase Alpha XCM集成概览 {: #moonbase-alpha-xcm }

Moonriver/Moonbeam XCM集成的第一步是通过Alphanet中继链与Moonbase Alpha TestNet集成。若要与Moonbeam集成需要先完成与Moonriver的集成。

与Moonbase Alpha集成的整个流程大改可以概括为如下步骤：

1. 与Alphanet中继链[同步节点](#sync-a-node)

2. 提供WASM/Genesis head hash和平行链ID以备使用

3. [计算在Alphanet中继链上的平行链主权账户](#calculate-and-fund-the-parachain-sovereign-account)（通过Moonbeam团队提供帮助）

4. （通过sudo或治理）从平行链向Moonbase Alpha开通HRMP通道

5. 提供编码的调用数据为您的平行链开通HRMP通道、接受HRMP通道并注册资产。这将由sudo执行

6. （通过sudo或治理）从Moonbase Alpha接受HRMP通道

7. 在平行链上注册Moonbase Alpha的DEV Token（可选）

8. 要测试XCM集成。请发送一些Token至：

    ```
    AccoundId: 5GWpSdqkkKGZmdKQ9nkSF7TmHp6JWt28BMGQNuG4MXtSvq3e
    Hex:       0xc4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a063
    ```
    
9. 测试XCM集成

完成这些步骤后，双方团队均已成功测试资产转移，您的平行链Token可添加至[Moonbeam DApp](https://apps.moonbeam.network/moonbase-alpha){target=_blank}的Cross Chain Assets部分。若充值和提现按预期运行，则可以开始与Moonriver集成。

### 同步节点 {: #sync-a-node }

您可以使用[Alphanet中继链规格](https://drive.google.com/drive/folders/1JVyj518T8a77xKXOBgcBe77EEsjnSFFO){target=_blank}同步节点（请注意：中继链基于Westend，因此同步节点需要约1天的时间）。

您可参考[Moonbase Alpha的规格文件](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam/runtime-1103/specs/alphanet/parachain-embedded-specs-v8.json){target=_blank}，并将其调整为适应于您的链。

您需要提供以下内容设置平行链：

- Genesis head/wasm hash
- Parachain ID。您可以在[中继链Polkadot.js Apps页面](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/parachains){target=_blank}找到已有的平行链ID

还有一些由社区提供的[Alphanet生态中继链snapshots](https://www.certhum.com/moonbase-databases){target=_blank}可助您快速操作。

在Moonbase Alpha中继链上操作时，当您的节点同步后，请在[电报群](https://t.me/Moonbeam_Official){target=_blank}或[Discord](https://discord.gg/PfpUATX){target=_blank}上联系Moonbeam团队，以便将您的平行链设置在中继链。

### 计算平行链主权账户并注入资金  {: #calculate-and-fund-the-parachain-sovereign-account }

您可以使用[xcm-tools repository的脚本](https://github.com/PureStake/xcm-tools){target=_blank}计算您的平行链主权账户。要运行脚本，您需要提供平行链ID和相关联的中继链名称。中继链可接受的值为`polkadot`（默认）、`kusama`和`moonbase`。

例如，Moonbase Alpha的中继链和其他平行链的主权账户可以通过运行以下命令获得：

```
yarn calculate-sovereign-account --p 1000 --r moonbase
```

这将输出以下响应：

```
Sovereign Account Address on Relay: 0x70617261e8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on other Parachains (Generic): 0x7369626ce8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on Moonbase Alpha: 0x7369626ce8030000000000000000000000000000
```

开始操作Moonbase Alpha中继链时，当您获得您的主权账户地址时，请通过[电报群](https://t.me/Moonbeam_Official){target=_blank}或[Discord](https://discord.gg/PfpUATX){target=_blank}联系团队，以便团队在中继链层面为您提供资金。若非如此，您将无法创建HRMP通道。

## Moonriver & Moonbeam XCM集成概览 {: #moonriver-moonbeam }

从技术层面来看，Moonbeam和Moonriver创建HRMP通道的流程差不多相同。然而，在提案通过之前获得Moonbeam社区的参与度也是必不可少的。

在开始之前，请先查看[Moonriver](https://moonriver.polkassembly.network/referenda/0){target=_blank}和[Moonbeam](https://moonbeam.polkassembly.network/proposal/21){target=_blank}上社区投票的HRMP通道准则。

流程可概括为以下步骤：

1. 从您的链打开Moonriver/Moonbeam的HRMP通道（或确保通道已存在）。另外，注册MOVR/GLMR

2. 为XCM集成创建包含关键信息的[两个Moonbeam社区论坛帖子](#forum-templates)

    - [XCM公开帖子](#xcm-disclosures)，您需要提供关于项目、基础代码和社交媒体渠道的信息
    - [XCM提案帖子](#xcm-proposals)，您需要提供关于提案本身的技术相关信息
    
3. 在Moonbeam/Moonriver上创建一些提案以：

    1. 接受从Moonriver/Moonbeam传入的HRMP通道

    2. 发起从Moonriver/Moonbeam传出的HRMP通道提案

    3. 将资产注册为[XC-20 token](/builders/interoperability/xcm/xc20/overview){target=_blank}格式

      通常生效时间如下所示：

      - **Moonriver** - 提案需在[OpenGov](/learn/features/governance/#opengov){target=_blank}的General Admin Track完成，其中决定期约为{{ networks.moonriver.governance.tracks.general_admin.decision_period.time }}，执行期至少为{{ networks.moonriver.governance.tracks.general_admin.min_enactment_period.time }}
      - **Moonbeam** - 约为{{ networks.moonbeam.democracy.vote_period.days }}天的投票期 + {{ networks.moonbeam.democracy.enact_period.days }天的执行期
    
4. 在连接的平行链上接受从Moonriver/Moonbeam传出的HRMP通道

5. 兑换$50等值的Token用于测试XCM集成。请将Token发送至：

    ```
    AccoundId: 5DnP2NuCTxfW4E9rJvzbt895sEsYRD7HC9QEgcqmNt7VWkD4
    Hex:       0x4c0524ef80ae843b694b225880e50a7a62a6b86f7fb2af3cecd893deea80b926)
    ```
    
6. 提供以太坊格式的地址用于接收MOVR/GLMR

7. 用提供的Token测试XCM集成

完成这些步骤后，便可以正常运作，Moonriver/Moonbeam上的新XC-20资产可添加至[Moonbeam DApp](https://apps.moonbeam.network/){target=_blank}的Cross Chain Assets部分。

## 论坛示例 {: #forum-templates }

在Moonriver或Moonbeam主网上开始创建XCM集成时，必须在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}上发布两个主要的帖子，以便投票的社区提供反馈。This step is **not necessary** when connecting to Moonbase Alpha.

建议在提案正式上链之前至少有5天时间，以便为社区反馈提供时间。

### XCM Disclosures {: #xcm-disclosure }

第一个帖子应该是[XCM Disclosures类别](https://forum.moonbeam.foundation/c/xcm-hrmp/xcm-disclosures/15){target=_blank}中的关键公开信息：凸显对投票者的决定很重要的关键信息。

在点击**New Topic**按钮之后，论坛提供了一个包含需要填写的相关信息的模板。具体取决于您要集成的网络，请使用Moonbeam/Moonriver标签。

需要的信息如下：

- 区块链网络的代码是否开源？如果是，请提供GitHub链接。如果不是，请解释为什么不开源
- 网络上是否禁用了SUDO？如果SUDO已被禁用，网络是否由一组选定的地址控制？
- 网络的集成是否已经在Moonbase Alpha TestNet上进行了完整的测试？
- （仅针对Moonbeam HRMP提案）网络是否有Kusama部署？如果是，请提供其网络名称以及Kusama部署是否与Moonriver集成
- 区块链网络的代码是否经过审计？如果是，请提供：
    - 审计公司名称
    - 审计报告日期
    - 审计报告链接

### XCM Proposals {: #xcm-proposals }

第二个帖子是[XCM Proposals类别](https://forum.moonbeam.foundation/c/xcm-hrmp/xcm-proposals/14){target=_blank}中提案的初稿。当提案在链上提交并开放投票，您需要在[Moonbeam Polkassembly](https://moonbeam.polkassembly.network/){target=_blank}或[Moonriver Polkassembly](https://moonriver.polkassembly.network/){target=_blank}增加一段描述。

在点击**New Topic**按钮之后，论坛提供了一个包含需要填写的相关信息的模板。具体取决于您要集成的网络，请使用Moonbeam/Moonriver标签。

请注意，所有必要的信息都可以通过使用以下部分中介绍的工具来获取。另外，您也可以随时联系团队寻求支持。

在Moonbeam XCM Proposals论坛帖和Polkassembly中，请添加以下部分和信息：

- **Title** — *YOUR_NETWORK_NAME*提案以打开通道并注册*ASSET_NAME*
- **Introduction** — 一句话概括提案
- **Network Information** — 一句话概括您的网络，以及官网、Twitter和其他社交媒体的相关链接
- **Summary** — 提案简介
- **On-Chain Proposal Reference (Forums Only)** — 包括是否是Moonbeam/Moonriver提案、提案编号、提案哈希
- **Technical Details** — 提供社区所需的技术信息，以了解提案的用例和目的
- **Additional Information** — 任何您希望社区/读者了解的其他信息

## 在您的平行链上注册Moonbeam的资产 {: #register-moonbeams-asset-on-your-parachain }

要在您的平行链上注册任何基于Moonbeam网络的Token，您可以使用以下内容。

每个基于Moonbeam网络的WSS网络端点：

=== "Moonbeam"
    ```
    wss://wss.api.moonbeam.network
    ```

=== "Moonriver"
    ```
    wss://wss.api.moonriver.moonbeam.network
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.wss_url }}
    ```

### Register Moonbeam Native Tokens {: #moonbeam-native-tokens }

For Moonbeam native tokens, the metadata for each network is as follows:

=== "Moonbeam"

    ```
    Name: Glimmer
    Symbol: GLMR
    Decimals: 18
    Existential Deposit: 1 (1 * 10^-18 GLMR)
    ```

=== "Moonriver"

    ```
    Name: Moonriver Token
    Symbol: MOVR
    Decimals: 18
    Existential Deposit: 1 (1 * 10^-18 MOVR)
    ```

=== "Moonbase Alpha"

    ```
    Name: DEV
    Symbol: DEV
    Decimals: 18
    Existential Deposit: 1 (1 * 10^-18 DEV)
    ```

The multilocation of Moonbeam native assets include the parachain ID of the network and the pallet instance, which corresponds to the index of the `Balances` pallet. The multilocation for each network is as follows:

=== "Moonbeam"

    ```js
    {
      V3: {
        parents: 1,
        interior: {
          X2: [
            { 
              Parachain: 2004
            },
            {
              PalletInstance: 10
            }
          ]
        }
      }
    }
    ```

=== "Moonriver"

    ```js
    {
      V3: {
        'parents': 1,
        'interior': {
          'X2': [
            { 
              'Parachain': 2023
            },
            {
              'PalletInstance': 10
            }
          ]
        }
      }
    }
    ```

=== "Moonbase Alpha"

    ```js
    {
      V3: {
        'parents': 1,
        'interior': {
          'X2': [
            { 
              'Parachain': 1000
            },
            {
              'PalletInstance': 3
            }
          ]
        }
      }
    }
    ```

### Register Local XC-20s (ERC-20s) {: register-erc20s }

In order to register a local XC-20 on another chain, you'll need the multilocation of the asset on Moonbeam. The multilocation will include the parachain ID of Moonbeam, the pallet instance, and the address of the ERC-20. The pallet instance will be `48`, which corresponds to the index of the ERC-20 XCM Bridge Pallet, as this is the pallet that enables any ERC-20 to be transferred via XCM.

Currently, the support for local XC-20s is only on Moonbase Alpha. You can use the following multilocation to register a local XC-20:

=== "Moonbase Alpha"

    ```js
    {
      V3: {
        parents: 1,
        interior: {
          X3: [
            { 
              Parachain: 1000
            },
            {
              PalletInstance: 48
            },
            {
              AccountKey20: {
                key: 'ERC20_ADDRESS_GOES_HERE'
              }
            }
          ]
        }
      }
    }
    ```  

## 创建HRMP通道 {: #create-an-hrmp-channel }

在任何消息可以从您的平行链发送到Moonbeam之前，必须打开一个HRMP通道。要创建HRMP通道，您需要向中继链发送XCM消息，请求通过中继链打开通道。该消息将需要**至少**包含以下XCM指令：

1. [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 将资金从原始平行链的（在中继链中的）主权账户转移到持有状态

2. [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - 从中继链购买执行时间来执行XCM消息

3. [Transact](https://github.com/paritytech/xcm-format#transact){target=_blank} - 提供要执行的中继链调用数据。在本示例中，将调用HRMP extrinsic

!!! 注意事项
    您可以添加[DepositAsset](https://github.com/paritytech/xcm-format#depositasset){target=_blank}以在执行后返还剩余资金。如果没有提供此函数，将无法退款。另外，你也可以在[Transact](https://github.com/paritytech/xcm- format#transact){target=_blank}后添加[RefundSurplus](https://github.com/paritytech/xcm-format#refundsurplus){target=_blank}，以获取未用于Transact的任何剩余资金。但是您必须计算是否值得支付额外XCM指令的执行成本。

为了将这些XCM消息发送到中继链，通常会调用[Polkadot XCM Pallet](https://github.com/paritytech/polkadot/tree/master/xcm/pallet-xcm){target=_blank}。Moonbeam 还有一个[XCM-Transactor Pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/xcm-transactor){target=_blank}，这将流程简化为抽象XCM消息传递构造函数的调用。

您可以使用Polkadot.js Apps为HRMP操作生成调用数据，但是[xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools){target=_blank}可以为您构建，这是该过程的推荐工具。其应该适用于任何包含 [Polkadot XCM Pallet](https://github.com/paritytech/polkadot/tree/master/xcm/pallet-xcm){target=_blank}的链，它们会先通过[XCM-Transactor Pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/xcm-transactor){target=_blank}操作。

```
git clone https://github.com/PureStake/xcm-tools && \
cd xcm-tools && \
yarn
```

[xcm-tools repository](https://github.com/PureStake/xcm-tools){target=_blank}有一个用于HRMP交互的特定脚本，称为[`hrmp-channel-manipulator.ts`](https:/ /github.com/PureStake/xcm-tools/blob/main/scripts/hrmp-channel-manipulator.ts){target=_blank}。此命令为特定HRMP操作生成编码的调用数据，只需提供正确的详细信息即可。该脚本使用DepositAsset XCM指令构建XCM消息，但不是RefundSurplus。

`hrmp-channel-manipulator.ts`脚本是通用的。它将先尝试使用[XCM-Transactor Pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/xcm-transactor){target=_blank}的`hrmpManage` extrinsic，但是如果该pallet在其使用的平行链上不存在，将切换到更容易被平行链使用的[Polkadot XCM Pallet](https://github.com/paritytech/polkadot/tree/master/xcm/pallet-xcm){ target=_blank}，直接构建与中继链上的HRMP pallet交互的XCM消息。**请注意，pallet可以命名为`polkadotXcm`，因为extrinsic将构建为`api.tx.polkadotXcm.send()`。**

以下部分将介绍在基于Moonbeam的网络中创建/接受开放通道请求的步骤，这也同样适应于您的平行链。

### 在Moonbeam上接受HRMP通道 {: #accept-an-hrmp-channel-on-moonbeam }

当一条平行链收到来自另一条平行链的HRMP通道打开请求时，必须先向中继链发出接受该通道的信号，然后才可以使用该通道。这需要使用Transact指令调用`hrmp` pallet和`hrmpAcceptOpenChannel` extrinsic向中继链发送XCM消息。

[xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank} GitHub repository的`hrmp-channel-manipulator.ts`脚本可以为您构建XCM！

运行以下命令将提供编码的调用数据以接受Moonbeam网络上的开放HRMP通道请求。将`YOUR_PARACHAIN_ID`替换为您的平行链的 ID：

=== "Moonbeam"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbeam.network  \
    --relay-ws-provider wss://rpc.polkadot.io \
    --hrmp-action accept
    ```

=== "Moonriver"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonriver.moonbeam.network  \
    --relay-ws-provider wss://kusama-rpc.polkadot.io \
    --hrmp-action accept 
    ```

=== "Moonbase Alpha"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbase.moonbeam.network  \
    --relay-ws-provider wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network \
    --hrmp-action accept
    ```

!!! 注意事项
    您可以通过更改`parachain-ws-provider`为您的平行链重新调整脚本。

你可以随时查看可用于此脚本的[附加标志](#additional-flags-xcm-tools)。

如果您计划将交易与其他调用进行批处理，请复制生成的调用数据以便后续用于[批处理交易](#batch-actions-into-one)脚本。

### 从Moonbeam打开HRMP通道 {: #open-an-hrmp-channel-from-moonbeam }

平行链在彼此之间发送XCM之前需要双向HRMP通道。建立HRMP通道的第一步是创建开放通道请求。这需要向中继链发送一条XCM消息，其中包含调用`hrmp` pallet和`hrmpInitOpenChannel` extrinsic的Transact指令。

[xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank} GitHub repository的`hrmp-channel-manipulator.ts`脚本能够帮您构建XCM！

运行以下命令将提供编码的调用数据，以从Moonbeam网络创建HRMP通道请求。最大消息大小和容量值可以从中继链`configuration` pallet和`activeConfig` extrinsic获得。将`YOUR_PARACHAIN_ID`替换成平行链ID：

=== "Moonbeam"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbeam.network  \
    --relay-ws-provider wss://rpc.polkadot.io \
    --max-capacity 1000 --max-message-size 102400 \
    --hrmp-action open
    ```

=== "Moonriver"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonriver.moonbeam.network  \
    --relay-ws-provider wss://kusama-rpc.polkadot.io \
    --max-capacity 1000 --max-message-size 102400 \
    --hrmp-action open 
    ```

=== "Moonbase Alpha"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbase.moonbeam.network  \
    --relay-ws-provider wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network \
    --max-capacity 1000 --max-message-size 102400 \
    --hrmp-action open
    ```

!!! 注意事项
    您可以通过更改`parachain-ws-provider`为您的平行链重新调整脚本。

您可以随时查看可用于此脚本的[附加标志](#additional-flags-xcm-tools)。

如果您计划将交易与其他调用进行批处理，请复制生成的调用数据以便后续用于[批处理交易](#batch-actions-into-one)脚本。

## 注册外部资产 {: #register-a-foreign-asset }

创建XCM集成的主要原因之一是在Moonbeam之间发送跨链资产。在Moonbeam上注册资产是通过[Asset Manager Pallet](https://github.com/PureStake/moonbeam/blob/master/pallets/asset-manager/src/lib.rs){target=_blank}完成的。在Moonbeam上创建的资产称为[XC-20s](/builders/interoperability/xcm/xc20/){target=_blank}，其具有与智能合约交互的ERC-20接口。

本教程将使用`xcm-asset-registrator.ts`脚本。请注意，如果您没有[Asset Manager Pallet](https://github.com/PureStake/moonbeam/blob/master/pallets/asset-manager/src/lib.rs){target=_blank}将无法在您的平行链上使用此脚本。

运行以下命令将提供编码的调用数据，以在Moonbeam网络上注册您的跨链资产。在运行命令之前替换以下值：

- `YOUR_PARACHAIN_ID`，平行链ID
- `YOUR_ASSET_MULTILOCATION`，从Moonbeam网络查看资产的[JSON格式的multilocation](https://github.com/PureStake/xcm-tools#example){target=_blank}
- `YOUR_TOKEN_SYMBOL`，要注册的Token符号。**请在符号前面加上“xc”前缀，表示该资产是启用XCM的资产**
- `YOUR_TOKEN_DECIMALS`，资产的小数位数，例如`18`
- `YOUR_TOKEN_NAME`，用于注册的Token名称
- `YOUR_UNITS_PER_SECOND` ，XCM传输期间以每秒执行时间计费的Token单位。 下面有一个[计算每秒单位的指南](#calculating-units-per-second)

=== "Moonbeam"
    ```
    yarn register-asset -w wss://wss.api.moonbeam.network  \
    --asset 'YOUR_ASSET_MULTILOCATION' \
    --symbol "YOUR_TOKEN_SYMBOL" \
    --decimals YOUR_TOKEN_DECIMALS \
    --name "YOUR_TOKEN_NAME" \
    --units-per-second YOUR_UNITS_PER_SECOND \
    --ed 1 --sufficient true --revert-code true 
    ```

=== "Moonriver"
    ```
    yarn register-asset -w wss://wss.api.moonriver.moonbeam.network  \
    --asset 'YOUR_ASSET_MULTILOCATION' \
    --symbol "YOUR_TOKEN_SYMBOL" \
    --decimals YOUR_TOKEN_DECIMALS \
    --name "YOUR_TOKEN_NAME" \
    --units-per-second YOUR_UNITS_PER_SECOND \
    --ed 1 --sufficient true --revert-code true 
    ```

=== "Moonbase Alpha"
    ```
    yarn register-asset -w wss://wss.api.moonbase.moonbeam.network \
    --asset 'YOUR_ASSET_MULTILOCATION' \
    --symbol "YOUR_TOKEN_SYMBOL" \
    --decimals YOUR_TOKEN_DECIMALS \
    --name "YOUR_TOKEN_NAME" \
    --units-per-second YOUR_UNITS_PER_SECOND \
    --ed 1 --sufficient true --revert-code true 
    ```

Existential deposit, `--ed`, is always set to 1. Sufficiency, `--sufficient`, is always set to `true`. This is so that the XC-20 assets on Moonbeam can act similar to an ERC-20 on Ethereum。`--revert-code`标志是指在[XC-20](/builders/interoperability/xcm/xc20/){target=_blank}存储元素中设置的简单EVM字节码，以便其他智能合约可以轻松与XC-20交互。You can ensure that these values are properly included by checking for them in Polkadot.js apps with the resultant encoded calldata.

例如，以下命令将用于注册来自平行链888的资产，该资产的通用密钥为`1`：

```
yarn register-asset -w wss://wss.api.moonbase.moonbeam.network \
--asset '{ "parents": 1, "interior": { "X2": [{ "Parachain": 888 }, {"GeneralKey": "0x000000000000000001"}]}}' \
--symbol "xcEXTN" --decimals 18 \
--name "Example Token" \
--units-per-second 20070165297881393351 \ 
--ed 1 --sufficient true --revert-code true 
```

输出应为如下所示：

```
Encoded proposal for registerAsset is 0x1f0000010200e10d0624000000000000000001344578616d706c6520546f6b656e1878634558544e12000000000000000000000000000000000000
Encoded proposal for setAssetUnitsPerSecond is 0x1f0100010200e10d0624000000000000000001c7a8978b008d8716010000000000000026000000
Encoded calldata for tx is 0x0102081f0000010200e10d0624000000000000000001344578616d706c6520546f6b656e1878634558544e120000000000000000000000000000000000001f0100010200e10d0624000000000000000001c7a8978b008d8716010000000000000026000000
```

如果您计划将交易与其他调用进行批处理，请复制生成的调用数据以用于后续的[批处理交易](#batch-actions-into-one)脚本。

如果您计划将多个跨链资产注册到Moonbeam，则可以对多个资产重复此过程。

### 计算每秒的单位 {: #calculating-units-per-second }

`UnitsPerSecond`是执行XCM消息时每秒收取的Token数。XCM转账的目标成本在注册时为`$0.02`。随着Token价格的波动，`UnitsPerSecond`可能会通过治理进行更新。

计算资产的`UnitsPerSecond`最简单方法是通过[xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank}的[`calculate-units-per-second.ts`脚本](https://github.com/PureStake/xcm-tools/blob/main/scripts/calculate- units-per-second.ts){target=_blank}。要运行脚本，您必须提供以下内容：

- `--d` - 您正在计算每秒单位的Token的小数位数
- `--xwc` - 整个XCM消息执行的总权重成本
- `--t` -（可选）XCM执行的目标价格，默认为`$0.02`
- `--a` -（可选）Token的[Coingecko API id](https://www.coingecko.com/){target=_blank}
- `--p ` -（可选）如果 Coingecko API不支持Token，则通过手动指定价格

Moonbeam链上每个XCM操作的预估权重为：

=== "Moonbeam"
    ```
    800000000
    ```

=== "Moonriver"
    ```
    800000000
    ```

=== "Moonbase Alpha"
    ```
    638978000
    ```

例如，要计算Moonbeam上DOT（Polkadot Token）的每秒单位，其有10个小数位数：

```
yarn calculate-units-per-second --d 10 --a polkadot --xwc 800000000 
```

截止本文撰写时，输出应为如下所示：

```
Token Price is $7.33
The UnitsPerSecond needs to be set 34106412005
```

## 整合批处理操作 {: #batch-actions-into-one }

在平行链上完成XCM流程的最有效方法是将所有交易批处理整合到一起。[xcm-tools repository](https://github.com/PureStake/xcm-tools){target=_blank}提供了一个脚本，用于将extrinsic调用批处理为单个调用，因此只需要一个交易。如果您的平行链想要打开HRMP通道并同时注册资产，这将有助于您快速完成。在 Moonbeam网络上提议通道注册时，**建议使用**此方式。 

您现在将使用前三个命令调用的编码调用数据输出，并将其插入到以下命令中以将批处理提案发送给民主。为要批处理的每个调用添加一个`--call "YOUR_CALL"`。在运行命令之前替换以下值：

- `OPEN_CHANNEL_CALL`是用于从Moonbeam到平行链[打开HRMP通道](#open-an-hrmp-channel-from-moonbeam)的SCALE编码调用数据
- `ACCEPT_INCOMING_CALL`是用于[接受来自平行链通道请求](#accept-an-hrmp-channel-on-moonbeam)的SCALE编码调用数据
- `REGISTER_ASSET_CALL`是用于[注册跨链资产](#register-a-foreign-asset)的SCALE编码调用数据。如果您有多个资产要在Moonbeam上注册，您可以包含附加的注册SCALE编码调用数据和附加的`--call`标志

如果您在Moonbase Alpha上注册，则无需提供私钥或进行治理。使用`--sudo`运行以下命令并将输出提供给Moonbeam团队，以便可以通过sudo快速添加资产和通道。

=== "Moonbeam"
    ```
    yarn generic-call-propose -w wss://wss.api.moonbeam.network \
    --call "OPEN_CHANNEL_CALL" \
    --call "ACCEPT_INCOMING_CALL" \
    --call "REGISTER_ASSET_CALL" \
    ```

=== "Moonriver"
    ```
    yarn generic-call-propose -w wss://wss.api.moonriver.moonbeam.network \
    --call "OPEN_CHANNEL_CALL" \
    --call "ACCEPT_INCOMING_CALL" \
    --call "REGISTER_ASSET_CALL" \
    ```

=== "Moonbase Alpha"
    ```
    yarn generic-call-propose -w wss://wss.api.moonbase.moonbeam.network  \
    --call "OPEN_CHANNEL_CALL" \
    --call "ACCEPT_INCOMING_CALL" \
    --call "REGISTER_ASSET_CALL"
    ```

!!! 注意事项
    您可以通过更改`parachain-ws-provider`为您的平行链重新调整脚本。

对于Moonbeam和Moonriver，如果您想直接从CLI工具发送治理提案，则应包含`--account-priv-key YOUR_PRIVATE_KEY`和`-send-preimage-hash true --send-proposal-as democracy`。建议提前熟悉[基于Moonbeam网络的治理流程](/learn/features/governance/){target=_blank}。

对于Moonbase Alpha，您可以添加`--sudo`标志并向团队提供SCALE编码的调用数据，以便通过sudo提交。

您可以随时查看可用于此脚本的[附加标志](#additional-flags-xcm-tools)。

## XCM-Tools的附加标志 {: #additional-flags-xcm-tools }

[xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools){target=_blank}及其大部分函数都可以使用一些附加标志来调用，这些标志会在所采取的操作周围创建一些包装器。例如，您可能希望将XCM消息的发送包装在sudo中，或通过民主提案。

您可以与以下脚本一起使用的完整选项：

|         标志         |            类型            |                             描述                             |
| :------------------: | :------------------------: | :----------------------------------------------------------: |
|   account-priv-key   |           string           | 发送交易的账户私钥（用于send-proposal-as和send-preimage-hash） |
|         sudo         |          boolean           | 是否将extrinsic调用数据包装在`sudo.sudo` extrinsic中。如果存在`account-priv-key`，则尝试发送交易 |
|  send-preimage-hash  |          boolean           |        是否将编码后的调用数据作为原像提交并检索其哈希        |
|   send-proposal-as   | democracy/council-external | 是否通过民主或理事会发送编码的调用数据（Governance v1版本）  |
| collective-threshold |           number           |           理事会决定提案的门槛（用于外部的理事会）           |
|       at-block       |           number           | 是否将外部调用数据包装在`scheduler.schedule` extrinsic中。未来应该安排采取行动的区块 |
|     fee-currency     |   string (multilocation)   | 中继链资产的multilocation（用于使用XCM-Transactor的非Moonbeam链） |

## 在Moonbeam上测试资产注册 {: #testing-asset-registration-on-moonbeam }

建立两个通道并注册资产后，团队将提供资产ID和[XC-20预编译](/builders/interoperability/xcm/xc20/overview/#the-erc20-interface){target=_blank}地址。

您的XC-20预编译地址是通过将资产ID十进制数转换为十六进制数并在其前面加上F来计算的，直到您获得40个十六进制字符（加上“0x”）地址。 有关如何计算的更多信息，请参阅外部XC-20教程中的[计算外部XC-20预编译地址](/builders/interoperability/xcm/xc20/overview/#calculate-xc20-address){target=_blank}部分。

资产成功注册后，您可以尝试将Token从您的平行链转移到您正在集成的基于Moonbeam的网络。

!!! 注意事项
    请记住，基于Moonbeam的网络使用AccountKey20（以太坊格式的地址）。

为了进行测试，请提供您的平行链WSS端点，以便Moonbeam dApp能够连接。然后，为相应账户转入资金：

=== "Moonbeam"
    ```
    AccountId: {{ networks.moonbeam.xcm.channel.account_id }}
    Hex:       {{ networks.moonbeam.xcm.channel.account_id_hex }}
    ```

=== "Moonriver"
    ```
    AccountId: {{ networks.moonriver.xcm.channel.account_id }}
    Hex:       {{ networks.moonriver.xcm.channel.account_id_hex }}
    ```

=== "Moonbase Alpha"
    ```
    AccountId: {{ networks.moonbase.xcm.channel.account_id }}
    Hex:       {{ networks.moonbase.xcm.channel.account_id_hex }}
    ```

!!! 注意事项
    如果您用Moonbeam和Moonriver进行测试，请向上述账户发送$50等值的Token。此外，提供一个以太坊格式的账户，以发送$50等值的GLMR/MOVR用于测试目的。

[XC-20s](/builders/interoperability/xcm/xc20/){target=_blank}是基于Substrate的资产，具有[ERC-20接口](/builders/interoperability/xcm/xc20/overview/#the-erc20-interface){target=_blank}。这意味着它们可以添加至MetaMask，并与生态系统中存在的任何EVM DApp组合。如果您感兴趣与XC-20集成相关的任何DApp连接，Moonbeam团队可以为您提供联系。

如果您需要DEV Token（Moonbase Alpha的原生Token）来使用您的XC-20资产，您可以通过[Moonbase Alpha Faucet](/builders/get-started/networks/moonbase/#moonbase-alpha-faucet ){target=_blank}获取（每24小时分配{{ networks.moonbase.website_faucet_amount }}）。如果您需要更多的DEV用于测试，请随时通过[电报群](https://t.me/Moonbeam_Official){target=_blank}或[Discord](https://discord.gg/PfpUATX){target=_blank}联系Moonbeam团队。
