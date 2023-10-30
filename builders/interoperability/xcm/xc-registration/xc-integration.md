---
title: 开通跨链通道
description: 学习如何与基于Moonbeam的网络建立跨链集成，包括开通和接受HRMP通道以及注册资产。
---

# 与Moonbeam建立XC集成

## 概览 {: #introduction }

跨链消息传递（Cross-Chain Message Passing，XCMP）仍在开发当中，暂替方案是水平中继路由消息传递（Horizontal Relay-routed Message Passing，HRMP）。HRMP具有与XCMP相同的接口和功能，但其消息通过中继链存储和读取，而对于XCMP，只有消息相关的元数据存储在中继链。由于所有的消息通过HRMP的中继链传递，因此对资源的要求更高。HRMP将会在XCMP实施后被弃用。

所有与Moonbeam的XCMP通道集成均是单向的，这意味着消息仅在一个方向上流动。如果A链向B链发起一个通道，则A链将只被允许发送消息给B链，B链无法向A链发送消息。如此而来，B链需要再向A链开通通道，才能实现链间的消息互通。

XCMP（或HRMP）通道开通后，两条链的相应资产需要先注册才能转移。关于如何注册资产的两个步骤，请参考[如何注册跨链资产](/builders/interoperability/xcm/xc-registration/assets){target=_blank}教程。

本教程将涵盖如何在平行链和基于Moonbeam的网络之间开通和接受HRMP通道。另外，本教程还提供了创建批量提案的必要步骤，该批量提案将开通和接受通道以及在Moonbeam上注册资产结合到单个提案。

本教程的所有操作将使用CLI工具进行整个流程的开发，您可以在[xcm-tools GitHub repository](https://github.com/Moonsong-Labs/xcm-tools){target=_blank}中找到此工具。

```bash
git clone https://github.com/Moonsong-Labs/xcm-tools && \
cd xcm-tools && \
yarn
```

## Moonbase Alpha XCM集成概览 {: #moonbase-alpha-xcm }

Moonriver/Moonbeam XCM集成的第一步是通过Alphanet中继链与Moonbase Alpha TestNet集成。若要与Moonbeam集成需要先完成与Moonriver的集成。

与Moonbase Alpha集成的整个流程大改可以概括为如下步骤：

1. 与Alphanet中继链[同步节点](#sync-a-node)
2. 在Alphanet中继链上[计算您的主权账户](#calculate-and-fund-the-parachain-sovereign-account)
3. 节点同步后，请在[Telegram](https://t.me/Moonbeam_Official){target=_blank}或[Discord](https://discord.gg/PfpUATX){target=_blank}上与Moonbeam团队取得联系，以便将您的平行链添加到中继链上。为此，您需要提供以下内容：

    - WASM/Genesis head hash
    - 平行链ID
    - 主权账户地址。Moonbeam团队将在中继链层为您的主权账户充值。此步骤将能够创建HRMP通道
    - 提供编码的调用数据为您的平行链开通HRMP通道、接受HRMP通道并[注册资产](/builders/interoperability/xcm/xc-registration/assets#register-xc-20s){target=_blank}（如果适用）。 这将通过sudo执行

4. （通过sudo或治理）从平行链向Moonbase Alpha开通HRMP通道
5. （通过sudo或治理）从Moonbase Alpha接受HRMP通道
6. （可选）在平行链上[注册Moonbase Alpha的DEV Token](/builders/interoperability/xcm/xc-registration/assets#register-moonbeam-native-assets){target=_blank}
7. 要测试XCM集成。请发送一些Token至：

    ```text
    AccoundId (Encoded): 5GWpSdqkkKGZmdKQ9nkSF7TmHp6JWt28BMGQNuG4MXtSvq3e
    Decoded (32-Bytes):  0xc4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a063
    ```

8. 测试XCM集成

![Moonbase Alpha cross-chain integration process](/images/builders/interoperability/xcm/xc-registration/xc-integration/channels-1.png)

完成这些步骤后，双方团队均已成功测试资产转移，您的平行链Token可添加至[Moonbeam DApp](https://apps.moonbeam.network/moonbase-alpha){target=_blank}的**Cross Chain Assets**部分。若充值和提现按预期运行，则可以开始与Moonriver集成。

### 同步节点 {: #sync-a-node }

您可以使用[Alphanet中继链规格](https://drive.google.com/drive/folders/1JVyj518T8a77xKXOBgcBe77EEsjnSFFO){target=_blank}同步节点（请注意：中继链基于Westend，因此同步节点需要约1天的时间）。

您可以参考[Moonbase Alpha的规格文件](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam/runtime-1103/specs/alphanet/parachain-embedded-specs-v8.json){target=_blank}操作，但是需要根据您的链稍作调整。

还有一些由社区提供的[Alphanet生态系统中继链的snapshot](https://www.certhum.com/moonbase-databases){target=_blank}可助您快速操作。

### 计算平行链主权账户并注入资金 {: #calculate-and-fund-the-parachain-sovereign-account }

您可以使用[xcm-tools库的脚本](https://github.com/Moonsong-Labs/xcm-tools){target=_blank}计算主权账户信息。要运行脚本，您可以提供平行链ID和关联中继链的名称。

您可以在[中继链的Polkadot.js Apps页面](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/parachains){target=_blank}找到已经使用的平行链ID。

中继链可接受的值为`polkadot`（默认）、`kusama`和`moonbase`。

例如，Moonbase Alpha的中继链和其他平行链的主权账户可以通过运行以下命令获得：

```bash
yarn calculate-sovereign-account --p 1000 --r moonbase
```

这将输出以下响应：

```text
Sovereign Account Address on Relay: 0x70617261e8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on other Parachains (Generic): 0x7369626ce8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on Moonbase Alpha: 0x7369626ce8030000000000000000000000000000
```

## Moonriver & Moonbeam XCM集成概览 {: #moonriver-moonbeam }

从技术层面来看，Moonbeam和Moonriver创建HRMP通道的流程差不多相同。然而，在提案通过之前获得Moonbeam社区的参与度也是必不可少的。

在开始之前，请先查看[Moonriver](https://moonriver.polkassembly.io/referenda/0){target=_blank}和[Moonbeam](https://moonbeam.polkassembly.io/proposal/21){target=_blank}上社区投票的HRMP通道准则。

流程可概括为以下步骤：

1. 从您的链打开Moonriver/Moonbeam的HRMP通道（或确保通道已存在）。另外，注册MOVR/GLMR
2. 为XCM集成创建包含关键信息的[两个Moonbeam社区论坛帖子](#forum-templates)
    - [XCM公开帖子](/builders/interoperability/xcm/xc-registration/forum-templates#xcm-disclosure)，您需要提供关于项目、基础代码和社交媒体渠道的信息
    - [XCM提案帖子](/builders/interoperability/xcm/xc-registration/forum-templates#xcm-proposals)，您需要提供关于提案本身的技术相关信息
3. 在Moonbeam/Moonriver上创建一些提案以：
    1. 接受从Moonriver/Moonbeam传入的HRMP通道
    2. 发起从Moonriver/Moonbeam传出的HRMP通道提案
    3. 将资产注册为[XC-20 token](/builders/interoperability/xcm/xc20/overview){target=_blank}格式（若适用）

      提案需在[OpenGov](/learn/features/governance/#opengov){target=_blank}的General Admin Track中完成。通常生效时间如下所示：

      - **Moonriver** - 决定期约为{{ networks.moonriver.governance.tracks.general_admin.decision_period.time }}，执行期至少为{{ networks.moonriver.governance.tracks.general_admin.min_enactment_period.time }}
      - **Moonbeam** - 决定期约约为{{ networks.moonbeam.governance.tracks.general_admin.decision_period.time }}，执行期至少为{{ networks.moonbeam.governance.tracks.general_admin.min_enactment_period.time }}

4. 在连接的平行链上接受从Moonriver/Moonbeam传出的HRMP通道
5. 兑换$50等值的Token用于测试XCM集成。请将Token发送至：

    ```text
    AccoundId (Encoded): 5E6kHM4zFdH5KEJE3YEzX5QuqoETVKUQadeY8LVmeh2HyHGt
    Decoded (32-Bytes):  0x5a071f642798f89d68b050384132eea7b65db483b00dbb05548d3ce472cfef48
    ```

6. 提供以太坊格式的地址用于接收MOVR/GLMR
7. 用提供的Token测试XCM集成

下图描述了此过程的示例以及Moonbeam上的成功提案。

![Moonbeam and Moonriver cross-chain integration process](/images/builders/interoperability/xcm/xc-registration/xc-integration/channels-2.png)

完成这些步骤后，便可以正常运作，Moonriver/Moonbeam上的新XC-20资产可添加至[Moonbeam DApp](https://apps.moonbeam.network/){target=_blank}的**Cross Chain Assets**部分。

### 创建论坛帖子 {: #create-forum-posts }

要在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}创建论坛帖子，您需要确保将帖子添加到正确的类别并添加相关内容。关于要发帖准则和模板，请参考[XCM集成的Moonbeam社区论坛模板](/builders/interoperability/xcm/xc-registration/forum-templates#){target=_blank}页面。

## 创建HRMP通道 {: #create-an-hrmp-channel }

在任何消息可以从您的平行链发送到Moonbeam之前，必须打开一个HRMP通道。要创建HRMP通道，您需要向中继链发送XCM消息，请求通过中继链打开通道。该消息将需要**至少**包含以下XCM指令：

1. [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 将资金从原始平行链的（在中继链中的）主权账户转移到持有状态
2. [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - 从中继链购买执行时间来执行XCM消息
3. [Transact](https://github.com/paritytech/xcm-format#transact){target=_blank} - 提供要执行的中继链调用数据。在本示例中，将调用HRMP extrinsic

!!! 注意事项
    您可以添加[DepositAsset](https://github.com/paritytech/xcm-format#depositasset){target=_blank}以在执行后返还剩余资金。如果没有提供此函数，将无法退款。另外，你也可以在[Transact](https://github.com/paritytech/xcm-format#transact){target=_blank}后添加[RefundSurplus](https://github.com/paritytech/xcm-format#refundsurplus){target=_blank}，以获取未用于Transact的任何剩余资金。但是您必须计算是否值得支付额外XCM指令的执行成本。

为了将这些XCM消息发送到中继链，*通常会调用*[Polkadot XCM Pallet](https://github.com/paritytech/polkadot-sdk/tree/master/polkadot/xcm/pallet-xcm){target=_blank}。Moonbeam还有一个[XCM Transactor Pallet](/builders/interoperability/xcm/xcm-transactor){target=_blank}，这将流程简化为一个抽象XCM消息传递构造函数的调用。

您可以使用Polkadot.js Apps为HRMP操作生成调用数据，但是[xcm-tools GitHub库](https://github.com/Moonsong-Labs/xcm-tools){target=_blank}可以协助您构建，这是该过程的推荐工具。

```bash
git clone https://github.com/Moonsong-Labs/xcm-tools && \
cd xcm-tools && \
yarn
```

xcm-tools repository有一个用于HRMP交互的特定脚本，称为[`hrmp-channel-manipulator.ts`](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/hrmp-channel-manipulator.ts){target=_blank}。此命令为特定HRMP操作生成编码的调用数据，只需提供正确的详细信息即可。该脚本使用DepositAsset XCM指令构建XCM消息，但不是RefundSurplus。

然后，编码的调用数据用于提交要执行HRMP操作的治理提案。所有与HRMP相关的提案均应分配给General Admin Track。

`hrmp-channel-manipulator.ts`脚本是通用的。它应该适用于任何包含Polkadot XCM Pallet的链，尽管它将先尝试使用XCM Transactor Pallet的`hrmpManage` extrinsic。但是如果XCM Transactor Pallet在其使用的平行链上不存在，则将使用Polkadot XCM Pallet的`send` extrinsic。**请注意，pallet推荐命名为`polkadotXcm`，因为extrinsic将构建为`api.tx.polkadotXcm.send()`。**对于Moonbeam，General Admin Track无法执行`polkadotXcm.send`调用，因此必须使用`xcmTransactor.hrmpManage` extrinsic。

以下部分将介绍在基于Moonbeam的网络中创建/接受开放通道请求的步骤，这也同样适用于您的平行链。

### 在Moonbeam上接受HRMP通道 {: #accept-an-hrmp-channel-on-moonbeam }

当一条平行链收到来自另一条平行链的HRMP通道开放请求时，必须先向中继链发出接受该通道的信号，然后才可以使用该通道。这需要使用调用HRMP Pallet和`hrmpAcceptOpenChannel` extrinsic的Transact指令向中继链发送XCM消息。

[xcm-tools](https://github.com/Moonsong-Labs/xcm-tools){target=_blank} GitHub库的`hrmp-channel-manipulator.ts`脚本可以为您构建XCM！

--8<-- 'text/builders/interoperability/xcm/xc-registration/xc-integration/hrmp-manipulator-args.md'

运行以下命令将提供编码的调用数据以接受Moonbeam网络上的开放HRMP通道请求。将`YOUR_PARACHAIN_ID`替换为您的平行链ID：

=== "Moonbeam"

    ```bash
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbeam.network  \
    --relay-ws-provider wss://rpc.polkadot.io \
    --hrmp-action accept
    ```

=== "Moonriver"

    ```bash
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonriver.moonbeam.network  \
    --relay-ws-provider wss://kusama-rpc.polkadot.io \
    --hrmp-action accept
    ```

=== "Moonbase Alpha"

    ```bash
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbase.moonbeam.network  \
    --relay-ws-provider wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network \
    --hrmp-action accept
    ```

!!! 注意事项
    您可以通过更改`parachain-ws-provider`为您的平行链重新调整脚本。

运行如上所示的脚本将返回编码的调用数据以接受HRMP通道。您还可以使用该脚本为给定的HRMP操作创建并提交链上原像和提案。对于Moonbeam和Moonriver，提案必须通过General Admin Track提交。

请参考[README](https://github.com/Moonsong-Labs/xcm-tools/tree/main#hrmp-manipulator-script){target=_blank}以获取完整的参数列表，包括可选参数，以及如何使用HRMP操作脚本的示例。

如果您计划使用其他调用进行批处理交易，复制生成的调用数据以便后续在使用[批处理交易](#batch-actions-into-one)脚本的时候使用。

### 从Moonbeam打开HRMP通道 {: #open-an-hrmp-channel-from-moonbeam }

平行链在彼此之间发送XCM之前需要双向HRMP通道。建立HRMP通道的第一步是创建开放通道请求。这需要向中继链发送一条XCM消息，其中包含调用HRMP Pallet和`hrmpInitOpenChannel` extrinsic的Transact指令。

[xcm-tools](https://github.com/Moonsong-Labs/xcm-tools){target=_blank} GitHub库的`hrmp-channel-manipulator.ts`脚本能够帮您构建XCM！

--8<-- 'text/builders/interoperability/xcm/xc-registration/xc-integration/hrmp-manipulator-args.md'

运行以下命令将提供编码的调用数据，以从Moonbeam网络创建HRMP通道请求。最大消息大小和容量值可以从中继链的Configuration Pallet和`activeConfig` extrinsic获得。将`YOUR_PARACHAIN_ID`替换成平行链ID：

=== "Moonbeam"

    ```bash
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbeam.network  \
    --relay-ws-provider wss://rpc.polkadot.io \
    --max-capacity 1000 --max-message-size 102400 \
    --hrmp-action open
    ```

=== "Moonriver"

    ```bash
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonriver.moonbeam.network  \
    --relay-ws-provider wss://kusama-rpc.polkadot.io \
    --max-capacity 1000 --max-message-size 102400 \
    --hrmp-action open
    ```

=== "Moonbase Alpha"

    ```bash
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbase.moonbeam.network  \
    --relay-ws-provider wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network \
    --max-capacity 1000 --max-message-size 102400 \
    --hrmp-action open
    ```

!!! 注意事项
    您可以通过更改`parachain-ws-provider`为您的平行链重新调整脚本。

运行如上所示的脚本将返回编码的调用数据以接受HRMP通道。您还可以使用该脚本为给定的HRMP操作创建并提交链上原像和提案。对于Moonbeam和Moonriver，提案必须通过General Admin Track提交。

请参考[README](https://github.com/Moonsong-Labs/xcm-tools/tree/main#hrmp-manipulator-script){target=_blank}以获取完整的参数列表，包括可选参数，以及如何使用HRMP操作脚本的示例。

如果您计划使用其他调用进行批处理交易，复制生成的调用数据以便后续在使用[批处理交易](#batch-actions-into-one)脚本的时候使用。

## 整合批处理操作 {: #batch-actions-into-one }

在平行链上完成XCM流程的最有效方法是将所有交易批处理整合到一起。[xcm-tools库](https://github.com/Moongsong-Labs/xcm-tools){target=_blank}提供了一个脚本，用于将extrinsic调用批处理为单个调用，因此只需要一个交易。如果您的平行链想要打开HRMP通道并同时注册资产，这将有助于您快速完成。在Moonbeam网络上提议通道注册时，**建议使用**此方式。

除了建立通道之外，如果您还需要注册资产，请参考[如何注册跨链资产](/builders/interoperability/xcm/xc-registration/assets){target=_blank}教程了解如何生成资产注册所需的编码调用数据。

下图描述了将所有交易批处理整合为一的过程。

![Batch XCM integration process](/images/builders/interoperability/xcm/xc-registration/xc-integration/channels-3.png)

现在，您将使用编码的调用数据输出用于打开通道、接受通道和注册资产，并将它们插入到以下命令中以将批量提案发送给民主。

您可以为想要批处理的每个调用添加`--call "INSERT_CALL"`。在运行命令之前替换以下值：

- `OPEN_CHANNEL_CALL`是用于从Moonbeam到平行链[打开HRMP通道](#open-an-hrmp-channel-from-moonbeam)的SCALE编码调用数据
- `ACCEPT_INCOMING_CALL`是用于[接受来自平行链通道请求](#accept-an-hrmp-channel-on-moonbeam)的SCALE编码调用数据
- `REGISTER_ASSET_CALL`是用于[注册跨链资产](/builders/interoperability/xcm/xc-registration/assets#register-xc-20s){target=_blank}的SCALE编码调用数据。如果您有多个资产要在Moonbeam上注册，您可以包含附加的注册SCALE编码调用数据和附加的`--call`标志

=== "Moonbeam"

    ```bash
    yarn generic-call-propose -w wss://wss.api.moonbeam.network \
    --call "OPEN_CHANNEL_CALL" \
    --call "ACCEPT_INCOMING_CALL" \
    --call "REGISTER_ASSET_CALL" \
    ```

=== "Moonriver"

    ```bash
    yarn generic-call-propose -w wss://wss.api.moonriver.moonbeam.network \
    --call "OPEN_CHANNEL_CALL" \
    --call "ACCEPT_INCOMING_CALL" \
    --call "REGISTER_ASSET_CALL" \
    ```

=== "Moonbase Alpha"

    ```bash
    yarn generic-call-propose -w wss://wss.api.moonbase.moonbeam.network  \
    --call "OPEN_CHANNEL_CALL" \
    --call "ACCEPT_INCOMING_CALL" \
    --call "REGISTER_ASSET_CALL" \
    ```

!!! 注意事项
    您可以通过更改`parachain-ws-provider`为您的平行链重新调整脚本。

然后，您可以使用编码的调用数据提交治理提案。对于Moonbeam和Moonriver，您必须将提案分配给General Admin Track。建议您提前熟悉[基于Moonbeam网络OpenGov v2的治理流程](/learn/features/governance#opengov){target=_blank}。

如果您想直接从CLI工具发送治理提案，您需要使用这些附加的标志：

```bash
--account-priv-key YOUR_PRIVATE_KEY \
--send-preimage-hash true \
--send-proposal-as v2 \
--track '{ "Origins": "GeneralAdmin" }'
```

对于Moonbase Alpha，您不需要提供私钥或通过治理。 相反，您可以使用`--sudo`标志并将输出结果提供给Moonbeam团队，以便可以通过sudo快速添加资产和通道。

您可以随时查看可用于此脚本的[附加标志](#additional-flags-xcm-tools)。

## XCM-Tools的附加标志 {: #additional-flags-xcm-tools }

[xcm-tools GitHub库](https://github.com/Moonsong-Labs/xcm-tools){target=_blank}及其大部分函数都可以使用一些附加标志来调用，这些标志会在所采取的操作周围创建一些包装器。例如，您可能希望将XCM消息的发送包装在sudo中，或通过民主提案。

您可以与以下脚本一起使用的完整选项：

|         标志         |             类型              |                                                                         描述                                                                         |
|:--------------------:|:-----------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------:|
|   account-priv-key   |            string             |                                            发送交易的账户私钥（用于send-proposal-as和send-preimage-hash）                                            |
|         sudo         |            boolean            |                           是否将extrinsic调用数据包装在`sudo.sudo` extrinsic中。如果存在`account-priv-key`，则尝试发送交易                           |
|  send-preimage-hash  |            boolean            |                                                    是否将编码后的调用数据作为原像提交并检索其哈希                                                    |
|   send-proposal-as   | democracy/council-external/v2 |                                是否通过民主或理事会（Governance v1版本）或OpenGov（Governance v2）发送编码的调用数据                                 |
| collective-threshold |            number             |                                                       理事会决定提案的门槛（用于外部的理事会）                                                       |
|        delay         |            number             |                                                    延迟 OpenGovV2提案执行的区块数量（用于v2版本）                                                    |
|        track         | string (JSON encoded origin)  | OpenGovV2提案的JSON编码来源。对于Moonbeam 网络：“Root”、“WhitelistedCaller”、“GeneralAdmin”、“ReferendumCanceller”、“ReferendumKiller”（用于v2版本） |
|       at-block       |            number             |                                 是否将外部调用数据包装在`scheduler.schedule` extrinsic中。未来应该安排采取行动的区块                                 |
|     fee-currency     |    string (multilocation)     |                                          中继链资产的multilocation（用于使用XCM-Transactor的非Moonbeam链）                                           |

!!! 注意事项
    Track选项必须指定为：`'{ "Origins": "INSERT_ORIGIN" }'`，您可以在其中插入以下任意内容作为来源："Root"、"WhitelistedCaller"、"GeneralAdmin"、"ReferendumCanceller" 、"ReferendumKiller"。
