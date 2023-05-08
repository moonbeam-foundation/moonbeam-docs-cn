---
title: Open a Cross-Chain Channel 开通跨链通道
description: Learn how to establish a cross-chain integration with a Moonbeam-based network. Including opening and accepting an HRMP channel and registering assets.
学习如何与基于Moonbeam的网络建立跨链集成，包括开通和接受HRMP通道以及注册资产。
---

# Establishing an XC Integration with Moonbeam - 与Moonbeam建立XC集成

![XCM Overview Banner](/images/builders/interoperability/xcm/xc-integration/xc-integration-banner.png)

## Introduction - 概览 {: #introduction }

While Cross-Chain Message Passing (XCMP) is being developed, a stop-gap protocol has been implemented called Horizontal Relay-routed Message Passing (HRMP). It has the same interface and functionality as XCMP, but the messages are stored in and read from the relay chain. Whereas with XCMP, only the message's associated metadata is stored in the relay chain. Since all messages are passed via the relay chain with HRMP, it is much more demanding on resources. As such, HRMP will be phased out once XCMP is implemented.

跨链消息传递（Cross-Chain Message Passing，XCMP）仍在开发当中，暂替方案是水平中继路由消息传递（Horizontal Relay-routed Message Passing，HRMP）。HRMP具有与XCMP相同的接口和功能，但其消息通过中继链存储和读取，而对于XCMP，只有消息相关的元数据存储在中继链。由于所有的消息通过HRMP的中继链传递，因此对资源的要求更高。HRMP将会在XCMP实施后被弃用。

All XCMP channel integrations with Moonbeam are unidirectional, meaning messages flow only in one direction. If chain A initiates a channel to chain B, chain A will only be allowed to send messages to B, and B will not be able to send messages back to A. As such, chain B will also need to initiate a channel to chain A to send messages back and forth between the two chains.

所有与Moonbeam的XCMP通道集成均是单向的，这意味着消息仅在一个方向上流动。如果A链向B链发起一个通道，则A链将只被允许发送消息给B链，B链无法向A链发送消息。如此而来，B链需要再向A链开通通道，才能实现链间的消息互通。

Once the XCMP (or HRMP) channels have been opened, the corresponding assets from both chains will need to be registered on the opposing chain before being able to transfer them.

XCMP（或HRMP）通道开通后，两条链的相应资产需要先注册才能转移。

This guide will cover the process of opening and accepting an HRMP channel between a parachain and a Moonbeam-based network. In addition, the guide provides the necessary data to register Moonbeam-based network assets in your parachain, and the data required to register your asset in any Moonbeam-based network. 

本教程将涵盖如何在平行链和基于Moonbeam的网络之间开通和接受HRMP通道。另外，本教程提供在平行链上注册基于Moonbeam网络资产的所需数据以及在任何基于Moonbeam网络上注册资产时所需的数据。

All of the tutorials in this guide use a CLI tool developed to ease the entire process, which you can find in the [xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools){target=_blank}.

本教程的所有操作将使用CLI工具进行整个流程的开发，您可以在[xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools){target=_blank}中找到此工具。

```
git clone https://github.com/PureStake/xcm-tools && \
cd xcm-tools && \
yarn
```

## Moonbase Alpha XCM Integration Overview - Moonbase Alpha XCM集成概览 {: #moonbase-alpha-xcm }

The first step for a Moonriver/Moonbeam XCM integration is to integrate with the Moonbase Alpha TestNet, through the Alphanet relay chain. Then a Moonriver integration must be completed before proceeding with Moonbeam (if applicable).  

Moonriver/Moonbeam XCM集成的第一步是通过Alphanet中继链与Moonbase Alpha TestNet集成。若要与Moonbeam集成需要先完成与Moonriver的集成。

The entire process of getting started with Moonbase Alpha can be summarized as follows:

与Moonbase Alpha集成的整个流程大改可以概括为如下步骤：

1. [Sync a node](#sync-a-node) with the Alphanet relay chain

    与Alphanet中继链[同步节点](#sync-a-node)

2. Provide the WASM/Geneiss head hash and your parachain ID for onboarding

    提供WASM/Genesis head hash和平行链ID以备使用

3. [Calculate your parachain sovereign account](#calculate-and-fund-the-parachain-sovereign-account) on the Alphanet relay chain (to be funded by the Moonbeam team)

    [计算在Alphanet中继链上的平行链主权账户](#calculate-and-fund-the-parachain-sovereign-account)（通过Moonbeam团队提供帮助）

4. Open an HRMP channel to Moonbase Alpha from your parachain (through sudo or via governance)

    （通过sudo或治理）从平行链向Moonbase Alpha开通HRMP通道

5. Provide the encoded call data to open an HRMP channel to your parachain, accept the incoming HRMP channel, and register the assets (if applicable). This will be executed through sudo

    提供编码的调用数据为您的平行链开通HRMP通道、接受HRMP通道并注册资产。这将由sudo执行

6. Accept the HRMP channel from Moonbase Alpha (through sudo or via governance)

    （通过sudo或治理）从Moonbase Alpha接受HRMP通道

7. Register Moonbase Alpha's DEV token on your parachain (optional)

    在平行链上注册Moonbase Alpha的DEV Token（可选）

8. For testing the XCM integration, please send some tokens to:

    要测试XCM集成。请发送一些Token至：

    ```
    AccoundId: 5GWpSdqkkKGZmdKQ9nkSF7TmHp6JWt28BMGQNuG4MXtSvq3e
    Hex:       0xc4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a063
    ```

9. Test the XCM integration

    测试XCM集成

Once all of these steps are completed, and both teams have successfully tested asset transfers, your parachain token can be added to the Cross Chain Assets section of the [Moonbeam DApp](https://apps.moonbeam.network/moonbase-alpha){target=_blank}. If deposit and withdrawals work as expected, an integration with Moonriver can begin.

完成这些步骤后，双方团队均已成功测试资产转移，您的平行链Token可添加至[Moonbeam DApp](https://apps.moonbeam.network/moonbase-alpha){target=_blank}的Cross Chain Assets部分。若充值和提现按预期运行，则可以开始与Moonriver集成。

### Sync a Node - 同步节点 {: #sync-a-node }

To sync a node, you can use the [Alphanet relay chain specs](https://drive.google.com/drive/folders/1JVyj518T8a77xKXOBgcBe77EEsjnSFFO){target=_blank} (note: the relay chain is Westend based, and will probably take 1 day to sync). 

您可以使用[Alphanet中继链规格](https://drive.google.com/drive/folders/1JVyj518T8a77xKXOBgcBe77EEsjnSFFO){target=_blank}同步节点（请注意：中继链基于Westend，因此同步节点需要约1天的时间）。

For reference, you can use [Moonbase Alpha's spec file](https://raw.githubusercontent.com/PureStake/moonbeam/runtime-1103/specs/alphanet/parachain-embedded-specs-v8.json){target=_blank}. You'll need to adapt it to your chain.

您可以参考[Moonbase Alpha的规格文件](https://raw.githubusercontent.com/PureStake/moonbeam/runtime-1103/specs/alphanet/parachain-embedded-specs-v8.json){target=_blank}操作，但是需要根据您的链稍作调整。

To onboard your parachain, please provide the following:

您需要提供以下内容设置平行链：

- Genesis head/wasm hash
- Genesis head/wasm hash
- Parachain ID. You can find the parachain IDs that have already been used in the [relay chain Polkadot.js Apps page](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/parachains){target=_blank}
- Parachain ID。您可以在[中继链Polkadot.js Apps页面](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/parachains){target=_blank}找到已有的平行链ID

There are also some [snapshots for the Alphanet ecosystem relay chain](https://www.certhum.com/moonbase-databases){target=_blank} you can use to quickly get started, these are provided by the community.

还有一些由社区提供的[Alphanet生态中继链snapshots](https://www.certhum.com/moonbase-databases){target=_blank}可助您快速操作。

When getting started with the Moonbase Alpha relay chain, once you have your node synced, please get in touch with the team on [Telegram](https://t.me/Moonbeam_Official){target=_blank} or [Discord](https://discord.gg/PfpUATX){target=_blank}, so the team can onboard your parachain to the relay chain.

在Moonbase Alpha中继链上操作时，当您的节点同步后，请在[电报群](https://t.me/Moonbeam_Official){target=_blank}或[Discord](https://discord.gg/PfpUATX){target=_blank}上联系Moonbeam团队，以便将您的平行链设置中继链。

### Calculate and Fund the Parachain Sovereign Account - 计算平行链主权账户并注入资金  {: #calculate-and-fund-the-parachain-sovereign-account }

You can calculate the sovereign account information using [a script from the xcm-tools repository](https://github.com/PureStake/xcm-tools){target=_blank}. To run the script, you must provide the parachain ID and the name of the associated relay chain. The accepted values for the relay chain are `polkadot` (default), `kusama`, and `moonbase`.

您可以使用[xcm-tools repository的脚本](https://github.com/PureStake/xcm-tools){target=_blank}计算您的平行链主权账户。要运行脚本，您需要提供平行链ID和相关联的中继链名称。中继链可接受的值为`polkadot`（默认）、`kusama`和`moonbase`。

For example, Moonbase Alpha's sovereign account for both the relay chain and other parachains can be obtained with the following:

例如，Moonbase Alpha的中继链和其他平行链的主权账户可以通过运行以下命令获得：

```
yarn calculate-sovereign-account --p 1000 --r moonbase
```

Which should result in the following response:  

这将输出以下响应：

```
Sovereign Account Address on Relay: 0x70617261e8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on other Parachains (Generic): 0x7369626ce8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on Moonbase Alpha: 0x7369626ce8030000000000000000000000000000
```

When getting started with the Moonbase Alpha relay chain, once you have your sovereign account's address, please get in touch with the team on [Telegram](https://t.me/Moonbeam_Official){target=_blank} or [Discord](https://discord.gg/PfpUATX){target=_blank}, so the team can fund it at a relay chain level. If not, you won't be able to create the HRMP channel.

开始操作Moonbase Alpha中继链时，当您获得您的主权账户地址时，请通过[电报群](https://t.me/Moonbeam_Official){target=_blank}或[Discord](https://discord.gg/PfpUATX){target=_blank}联系团队，以便团队在中继链层面为您提供资金。若非如此，您将无法创建HRMP通道。

## Moonriver & Moonbeam XCM Integration Overview - Moonriver & Moonbeam XCM集成概览 {: #moonriver-moonbeam }

From a technical perspective, the process of creating an HRMP channel with Moonriver and Moonbeam is nearly identical. However, engagement with the Moonbeam community is crucial and required before a proposal will pass.

从技术层面来看，Moonbeam和Moonriver创建HRMP通道的流程差不多相同。然而，在提案通过之前Moonbeam社区的参与度至关重要也是必不可少的。

Please check the HRMP channel guidelines that the community voted on for [Moonriver](https://moonriver.polkassembly.network/referenda/0){target=_blank} and [Moonbeam](https://moonbeam.polkassembly.network/proposal/21){target=_blank} before starting.

在开始之前，请先查看[Moonriver](https://moonriver.polkassembly.network/referenda/0){target=_blank}和[Moonbeam](https://moonbeam.polkassembly.network/proposal/21){target=_blank}上社区投票的HRMP通道准则。

The process can be summarized in the following steps:

流程可概括为以下步骤：

1. Open (or ensure there is) an HRMP channel from your chain to Moonriver/Moonbeam. Optionally, register MOVR/GLMR

    从您的链打开Moonriver/Moonbeam的HRMP通道（或确保通道已存在）。另外，注册MOVR/GLMR

2. Create [two Moonbeam Community forum posts](#forum-templates) with some key information for the XCM integration: 

    为XCM集成创建包含关键信息的[两个Moonbeam社区论坛帖子](#forum-templates)

    - An [XCM Disclosure post](#xcm-disclosures), where you'll provide some disclosures about the project, the code base, and social network channels
    - [XCM公开帖子](#xcm-disclosures)，您需要提供关于项目、基础代码和社交媒体渠道的信息
    - An [XCM Proposal post](#xcm-proposals), where you'll provide some technical information about the proposal itself
    - [XCM提案帖子](#xcm-proposals)，您需要提供关于提案本身的技术相关信息

3. Create a batched proposal on Moonbeam/Moonriver to:

    在Moonbeam/Moonriver上创建一些提案以：

    1. Accept the incoming HRMP channel 

       接受从Moonriver/Moonbeam传入的HRMP通道

    2. Propose the opening of an outgoing HRMP channel from Moonriver/Moonbeam

       发起从Moonriver/Moonbeam传出的HRMP通道提案

    3. Register the asset as an [XC-20 token](/builders/interoperability/xcm/xc20/overview){target=_blank} (if applicable)

       将资产注册为[XC-20 token](/builders/interoperability/xcm/xc20/overview){target=_blank}格式

      The normal enactment times are as follows:  

    通常生效时间如下所示：

      - **Moonriver** - proposals should be done in the the General Admin Track from [OpenGov](/learn/features/governance/#opengov){target=_blank}, in which the Decision Period is approximately {{ networks.moonriver.governance.tracks.general_admin.decision_period.time }}, and the enactment time is at least {{ networks.moonriver.governance.tracks.general_admin.min_enactment_period.time }}
      - **Moonriver** - 提案需在[OpenGov](/learn/features/governance/#opengov){target=_blank}的General Admin Track完成，其中决定期约为{{ networks.moonriver.governance.tracks.general_admin.decision_period.time }}，执行期至少为{{ networks.moonriver.governance.tracks.general_admin.min_enactment_period.time }}
      - **Moonbeam** - approximately a {{ networks.moonbeam.democracy.vote_period.days }}-day Voting Period plus {{ networks.moonbeam.democracy.enact_period.days }}-day enactment time
      - **Moonbeam** - 约为{{ networks.moonbeam.democracy.vote_period.days }}天的投票期 + {{ networks.moonbeam.democracy.enact_period.days }天的执行期

4. Accept the HRMP channel from Moonriver/Moonbeam on the connecting parachain

    在连接的平行链上接受从Moonriver/Moonbeam传出的HRMP通道

5. Exchange $50 worth of tokens for testing the XCM integration. Please send the tokens to:

    兑换$50等值的Token用于测试XCM集成。请将Token发送至：

    ```
    AccoundId: 5DnP2NuCTxfW4E9rJvzbt895sEsYRD7HC9QEgcqmNt7VWkD4
    Hex:       0x4c0524ef80ae843b694b225880e50a7a62a6b86f7fb2af3cecd893deea80b926)
    ```

6. Provide an Ethereum-styled address for MOVR/GLMR

    提供以太坊格式的地址用于接收MOVR/GLMR

7. Test the XCM integration with the provided tokens

    用提供的Token测试XCM集成

Once these steps are completed succesfully, marketing efforts can be coordinated, and the new XC-20 on Moonriver/Moonbeam can be added to the Cross Chain Assets section of the [Moonbeam DApp](https://apps.moonbeam.network/){target=_blank}.

完成这些步骤后，便可以正常运作，Moonriver/Moonbeam上的新XC-20资产可添加至[Moonbeam DApp](https://apps.moonbeam.network/){target=_blank}的Cross Chain Assets部分。

## Forum Templates - 论坛示例 {: #forum-templates }

When starting an XCM integration on Moonriver or Moonbeam MainNet, there are two preliminary posts that must be made on the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank} so that the voting community has the chance to provide feedback. This step is **not necessary** when connecting to Moonbase Alpha.

在Moonriver或Moonbeam主网上开始创建XCM集成时，必须在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}上发布两个主要的帖子，以便投票的社区提供反馈。

It is recommended that this is done five days before the actual proposal is submitted on chain, to provide time for community feedback. 

建议在提案正式上链之前至少有5天时间，以便为社区反馈提供时间。

### XCM Disclosures {: #xcm-disclosure }

The first post that should be made are the key disclosures within the [XCM Disclosures category](https://forum.moonbeam.foundation/c/xcm-hrmp/xcm-disclosures/15){target=_blank}, which highlights key information that are of importance in a voter's decision.

第一个帖子应该是[XCM Disclosures类别](https://forum.moonbeam.foundation/c/xcm-hrmp/xcm-disclosures/15){target=_blank}中的关键公开信息：凸显对投票者的决定很重要的关键信息。

Once you hit the **New Topic** button, a template is provided with the relevant information to be filled in. Please use either the Moonbeam/Moonriver tag, depending on the network you are integrating with.

在点击**New Topic**按钮之后，论坛提供了一个包含需要填写的相关信息的模板。具体取决于您要集成的网络，请使用Moonbeam/Moonriver标签。

The required information is the following:

需要的信息如下：

- Is the blockchain network's code open source? If so, please provide the GitHub link. If not, provide an explanation on why not

- 区块链网络的代码是否开源？如果是，请提供GitHub链接。如果不是，请解释为什么不开源

- Is SUDO disabled on the network? If SUDO is disabled, is the network controlled by a select group of addresses?  

- 网络上是否禁用了SUDO？ 如果SUDO已被禁用，网络是否由一组选定的地址控制？

- Has the integration of the network been tested completely on the Moonbase Alpha TestNet?  

- 网络的集成是否已经在Moonbase Alpha TestNet上进行了完整的测试？

- (For Moonbeam HRMP proposals only) Does your network have a Kusama deployment? If so, provide its network name and whether the Kusama deployment is integrated with Moonriver

- （仅针对Moonbeam HRMP提案）网络是否有Kusama部署？ 如果是，请提供其网络名称以及Kusama部署是否与Moonriver集成

- Is the blockchain network's code audited? If so, please provide:
    - Auditor name(s)
    - Dates of audit reports
    - Links to audit reports

- 区块链网络的代码是否经过审计？如果是，请提供：
    - 审计公司名称
    - 审计报告日期
    - 审计报告链接

### XCM Proposals {: #xcm-proposals }

The second post is a preliminary draft of the proposal in the [XCM Proposals category](https://forum.moonbeam.foundation/c/xcm-hrmp/xcm-proposals/14){target=_blank}. Once a proposal is submitted on-chain and available for voting, you must also add a description to it in either the [Moonbeam Polkassembly](https://moonbeam.polkassembly.network/){target=_blank} or [Moonriver Polkassembly](https://moonriver.polkassembly.network/){target=_blank}.

第二个帖子是[XCM Proposals类别](https://forum.moonbeam.foundation/c/xcm-hrmp/xcm-proposals/14){target=_blank}中提案的初稿。

Once you hit the **New Topic** button, a template is provided with the relevant information to be filled in. Please use either the Moonbeam/Moonriver tag, depending on the network you are integrating with.

在点击**New Topic**按钮之后，论坛提供了一个包含需要填写的相关信息的模板。具体取决于您要集成的网络，请使用Moonbeam/Moonriver标签。

Note that all the necessary information can be obtained by using the tools presented in the following sections. In addition, you can always contact the team for support.

请注意，所有必要的信息都可以通过使用以下部分中介绍的工具来获取。另外，您也可以随时联系团队寻求支持。

In both the Moonbeam XCM Proposals forum post and in Polkassembly, add the following sections and information:  

在Moonbeam XCM Proposals论坛帖和Polkassembly中，请添加以下部分和信息：

- **Title** — *YOUR_NETWORK_NAME* Proposal to Open Channel & Register *ASSET_NAME*
- **Title** — *YOUR_NETWORK_NAME*提案以打开通道并注册*ASSET_NAME*


- **Introduction** — one sentence summarizing the proposal

- **Introduction** — 一句话概括提案

- **Network Information** — one sentence summarizing your network, and relevant links to your website, Twitter, and other social channels

- **Network Information** — 一句话概括您的网络，以及官网、Twitter和其他社交媒体的相关链接

- **Summary** — brief description of the content of the proposal

- **Summary** — 提案简介

- **On-Chain Proposal Reference (Forums Only)** — include if it is a Moonbeam or Moonriver proposal, the proposal number, and proposal hash

- **On-Chain Proposal Reference (Forums Only)** — 包括是否是Moonbeam/Moonriver提案、提案编号、提案哈希

- **Technical Details** — provide technical information required for the community to understand the use cases and purpose of the proposal

- **Technical Details** — 提供社区所需的技术信息，以了解提案的用例和目的

- **Additional Information** — any additional information you would like the community/readers to know

- **Additional Information** — 任何您希望社区/读者了解的其他信息

## Register Moonbeam's Asset on your Parachain - 在您的平行链上注册Moonbeam的资产 {: #register-moonbeams-asset-on-your-parachain }

In order to enable cross-chain transfers of Moonbeam native assets or ERC-20s between your chain and Moonbeam, you'll need to register the asset(s). To do so, you'll need the multilocation of each asset.

要在您的平行链上注册任何基于Moonbeam网络的Token，您可以使用以下内容。

The WSS network endpoints for each Moonbeam-based network are as follows:

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

每个基于Moonbeam网络的资产元数据：

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

每个基于Moonbeam网络资产的Multilocation：

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

### Register Local XC-20s (ERC-20s) {: #register-erc20s }

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

## Creating HRMP Channels - 创建HRMP通道 {: #create-an-hrmp-channel }

Before any messages can be sent from your parachain to Moonbeam, an HRMP channel must be opened. To create an HRMP channel, you'll need to send an XCM message to the relay chain that will request a channel to be opened through the relay chain. The message will need to contain **at least** the following XCM instructions:  

在任何消息可以从您的平行链发送到Moonbeam之前，必须打开一个HRMP通道。要创建HRMP通道，您需要向中继链发送XCM消息，请求通过中继链打开通道。该消息将需要**至少**包含以下XCM指令：

1. [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - takes funds out of the sovereign account (in the relay chain) of the origin parachain to a holding state

   [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 将资金从原始平行链的（在中继链中的）主权账户转移到持有状态

2. [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - buys execution time from the relay chain to execute the XCM message

   [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - 从中继链购买执行时间来执行XCM消息

3. [Transact](https://github.com/paritytech/xcm-format#transact){target=_blank} - provides the relay chain call data to be executed. In this case, the call will be an HRMP extrinsic

   [Transact](https://github.com/paritytech/xcm-format#transact){target=_blank} - 提供要执行的中继链调用数据。在本示例中，将调用HRMP extrinsic

!!! note 注意事项
    You can add [DepositAsset](https://github.com/paritytech/xcm-format#depositasset){target=_blank} to refund the leftover funds after the execution. If this is not provided, no refunds will be carried out. In addition, you could also add a [RefundSurplus](https://github.com/paritytech/xcm-format#refundsurplus){target=_blank} after [Transact](https://github.com/paritytech/xcm-format#transact){target=_blank}, to get any leftover funds not used for the Transact. But you'll have to calculate if it is worth paying the execution cost of the extra XCM instructions.

您可以添加[DepositAsset](https://github.com/paritytech/xcm-format#depositasset){target=_blank}以在执行后返还剩余资金。如果没有提供此函数，将无法退款。另外，你也可以在[Transact](https://github.com/paritytech/xcm- format#transact){target=_blank}后添加[RefundSurplus](https://github.com/paritytech/xcm-format#refundsurplus){target=_blank}，以获取未用于Transact的任何剩余资金。但是您必须计算是否值得支付额外XCM指令的执行成本。

To send these XCM messages to the relay chain, the [Polkadot XCM Pallet](https://github.com/paritytech/polkadot/tree/master/xcm/pallet-xcm){target=_blank} is typically invoked. Moonbeam also has an [XCM-Transactor Pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/xcm-transactor){target=_blank} that simplifies the process into a call that abstracts the XCM messaging constructor.  

为了将这些XCM消息发送到中继链，通常会调用[Polkadot XCM Pallet](https://github.com/paritytech/polkadot/tree/master/xcm/pallet-xcm){target=_blank}。Moonbeam 还有一个[XCM-Transactor Pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/xcm-transactor){target=_blank}，这将流程简化为抽象XCM消息传递构造函数的调用。

You could potentially generate the calldata for an HRMP action by using Polkadot.js Apps, but the [xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools){target=_blank} can build it for you, and it is the recommended tool for this process. They should work for any chain that includes the [Polkadot XCM Pallet](https://github.com/paritytech/polkadot/tree/master/xcm/pallet-xcm){target=_blank}, although it will try to do it via the [XCM-Transactor Pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/xcm-transactor){target=_blank} first.  

您可以使用Polkadot.js Apps为HRMP操作生成调用数据，但是[xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools){target=_blank}可以为您构建，这是该过程的推荐工具。其应该适用于任何包含 [Polkadot XCM Pallet](https://github.com/paritytech/polkadot/tree/master/xcm/pallet-xcm){target=_blank}的链，它们会先通过[XCM-Transactor Pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/xcm-transactor){target=_blank}操作。

```
git clone https://github.com/PureStake/xcm-tools && \
cd xcm-tools && \
yarn
```

The [xcm-tools repository](https://github.com/PureStake/xcm-tools){target=_blank} has a specific script for HRMP interactions called [`hrmp-channel-manipulator.ts`](https://github.com/PureStake/xcm-tools/blob/main/scripts/hrmp-channel-manipulator.ts){target=_blank}. This command generates encoded calldata for a specific HRMP action, as long as it is given the correct details. The script builds the XCM message with the DepositAsset XCM instruction, but not with RefundSurplus.

[xcm-tools repository](https://github.com/PureStake/xcm-tools){target=_blank}有一个用于HRMP交互的特定脚本，称为[`hrmp-channel-manipulator.ts`](https:/ /github.com/PureStake/xcm-tools/blob/main/scripts/hrmp-channel-manipulator.ts){target=_blank}。此命令为特定HRMP操作生成编码的调用数据，只需提供正确的详细信息即可。该脚本使用DepositAsset XCM指令构建XCM消息，但不是RefundSurplus。

The `hrmp-channel-manipulator.ts` script is meant to be generic. It will first attempt to use the `hrmpManage` extrinsic of the [XCM-Transactor Pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/xcm-transactor){target=_blank}, but if that pallet does not exist on the parachain that it is being used on, it will switch to using the [Polkadot XCM Pallet](https://github.com/paritytech/polkadot/tree/master/xcm/pallet-xcm){target=_blank} (which should be used more readily by parachains) to directly construct the XCM message that interacts with the HRMP pallet on the relay chain. **Note that it expects the pallet name to be `polkadotXcm`, as the extrinsic will be built as `api.tx.polkadotXcm.send()`.**

`hrmp-channel-manipulator.ts`脚本是通用的。它将先尝试使用[XCM-Transactor Pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/xcm-transactor){target=_blank}的`hrmpManage` extrinsic，但是如果该pallet在其使用的平行链上不存在，将切换到更容易被平行链使用的[Polkadot XCM Pallet](https://github.com/paritytech/polkadot/tree/master/xcm/pallet-xcm){ target=_blank}，直接构建与中继链上的HRMP pallet交互的XCM消息。**请注意，pallet可以命名为`polkadotXcm`，因为extrinsic将构建为`api.tx.polkadotXcm.send()`。**

The following sections go through the steps of creating/accepting open channel requests in a Moonbeam-based network, but it can also be adapted to your parachain.

以下部分将介绍在基于Moonbeam的网络中创建/接受开放通道请求的步骤，这也同样适应于您的平行链。

### Accept an HRMP Channel on Moonbeam - 在Moonbeam上接受HRMP通道 {: #accept-an-hrmp-channel-on-moonbeam }

When a parachain receives an HRMP channel open request from another parachain, it must signal to the relay chain that it accepts this channel before the channel can be used. This requires an XCM message to the relay chain with the Transact instruction calling the `hrmp` pallet and `hrmpAcceptOpenChannel` extrinsic.

当一条平行链收到来自另一条平行链的HRMP通道打开请求时，必须先向中继链发出接受该通道的信号，然后才可以使用该通道。这需要使用Transact指令调用`hrmp` pallet和`hrmpAcceptOpenChannel` extrinsic向中继链发送XCM消息。

Fortunately, the [xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank} GitHub repository's `hrmp-channel-manipulator.ts` script can build the XCM for you!  

[xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank} GitHub repository的`hrmp-channel-manipulator.ts`脚本可以为您构建XCM！

Running the following command will provide the encoded calldata to accept an open HRMP channel request on a Moonbeam network. Replace `YOUR_PARACHAIN_ID` with the ID of your parachain:  

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

!!! note 注意事项
    You can readapt the script for your parachain by changing the `parachain-ws-provider`.

您可以通过更改`parachain-ws-provider`为您的平行链重新调整脚本。

Feel free to check the [additional flags](#additional-flags-xcm-tools) available for this script.

你可以随时查看可用于此脚本的[附加标志](#additional-flags-xcm-tools)。

If you plan to batch the transaction with other calls, copy the resultant calldata for later when using the [batching transactions](#batch-actions-into-one) script.

如果您计划将交易与其他调用进行批处理，请复制生成的调用数据以便后续用于[批处理交易](#batch-actions-into-one)脚本。

### Opening HRMP Channels from Moonbeam - 从Moonbeam打开HRMP通道 {: #open-an-hrmp-channel-from-moonbeam }

Parachains need bidirectional HRMP channels before sending XCM between each other. The first step to establishing an HRMP channel is to create an open channel request. This requires an XCM message to the relay chain with the Transact instruction calling the `hrmp` pallet and `hrmpInitOpenChannel` extrinsic.

平行链在彼此之间发送XCM之前需要双向HRMP通道。建立HRMP通道的第一步是创建开放通道请求。这需要向中继链发送一条XCM消息，其中包含调用`hrmp` pallet和`hrmpInitOpenChannel` extrinsic的Transact指令。

Fortunately, the [xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank} GitHub repository's `hrmp-channel-manipulator.ts` script can build the XCM for you!

[xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank} GitHub repository的`hrmp-channel-manipulator.ts`脚本能够帮您构建XCM！

Running the following command will provide the encoded calldata to create the HRMP channel request from a Moonbeam network. The maximum message size and capacity values can be obtained from the relay chain `configuration` pallet and `activeConfig` extrinsic. Replace `YOUR_PARACHAIN_ID` with the ID of your parachain:  

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

!!! note 注意事项
    You can readapt the script for your parachain by changing the `parachain-ws-provider`.

您可以通过更改`parachain-ws-provider`为您的平行链重新调整脚本。

Feel free to check the [additional flags](#additional-flags-xcm-tools) available for this script.

您可以随时查看可用于此脚本的[附加标志](#additional-flags-xcm-tools)。

If you plan to batch the transaction with other calls, copy the resultant calldata for later when using the [batching transactions](#batch-actions-into-one) script.

如果您计划将交易与其他调用进行批处理，请复制生成的调用数据以便后续用于[批处理交易](#batch-actions-into-one)脚本。

## Register a Foreign Asset - 注册外部资产 {: #register-a-foreign-asset }

One of the main points of creating an XCM integration is to send cross-chain assets to and from Moonbeam. Registering an asset through Moonbeam is done via the [Asset Manager Pallet](https://github.com/PureStake/moonbeam/blob/master/pallets/asset-manager/src/lib.rs){target=_blank}. Assets created on Moonbeam are called [XC-20s](/builders/interoperability/xcm/xc20/){target=_blank}, as they have an ERC-20 interface that smart contracts can interact with. 

创建XCM集成的主要原因之一是在Moonbeam之间发送跨链资产。在Moonbeam上注册资产是通过[Asset Manager Pallet](https://github.com/PureStake/moonbeam/blob/master/pallets/asset-manager/src/lib.rs){target=_blank}完成的。在Moonbeam上创建的资产称为[XC-20s](/builders/interoperability/xcm/xc20/){target=_blank}，其具有与智能合约交互的ERC-20接口。

This guide will have you use the `xcm-asset-registrator.ts` script. Keep in mind that this script cannot be used on your parachain if you do not have the [Asset Manager Pallet](https://github.com/PureStake/moonbeam/blob/master/pallets/asset-manager/src/lib.rs){target=_blank}.  

本教程将使用`xcm-asset-registrator.ts`脚本。请注意，如果您没有[Asset Manager Pallet](https://github.com/PureStake/moonbeam/blob/master/pallets/asset-manager/src/lib.rs){target=_blank}将无法在您的平行链上使用此脚本。

Running the command below will provide the encoded calldata to register your cross-chain asset on a Moonbeam network. Replace the following values before running the command:  

运行以下命令将提供编码的调用数据，以在Moonbeam网络上注册您的跨链资产。在运行命令之前替换以下值：

- `YOUR_PARACHAIN_ID` with the ID of your parachain 
- `YOUR_PARACHAIN_ID`，平行链ID
- `YOUR_ASSET_MULTILOCATION` with the [JSON-formatted multilocation](https://github.com/PureStake/xcm-tools#example){target=_blank} of your asset from the Moonbeam network's perspective
- `YOUR_ASSET_MULTILOCATION`，从Moonbeam网络查看资产的[JSON格式的multilocation](https://github.com/PureStake/xcm-tools#example){target=_blank}
- `YOUR_TOKEN_SYMBOL` with the symbol of the token you wish to register. **Please add "xc" to the front of the symbol to indicate that the asset is an XCM enabled asset**
- `YOUR_TOKEN_SYMBOL`，要注册的Token符号。**请在符号前面加上“xc”前缀，表示该资产是启用XCM的资产**
- `YOUR_TOKEN_DECIMALS` with the number of decimals your asset has, such as `18`
- `YOUR_TOKEN_DECIMALS`，资产的小数位数，例如`18`
- `YOUR_TOKEN_NAME` with the name of the token to register 
- `YOUR_TOKEN_NAME`，用于注册的Token名称
- `YOUR_UNITS_PER_SECOND` with the units of tokens to charge per second of execution time during XCM transfers. There is a [guide to calculate units per second](#calculating-units-per-second) below  
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

Existential deposit, `--ed`, is always set to 1. Sufficiency, `--sufficient`, is always set to `true`. This is so that the XC-20 assets on Moonbeam can act similar to an ERC-20 on Ethereum. The `--revert-code` flag refers to a simple EVM bytecode that is set in the [XC-20](/builders/interoperability/xcm/xc20/){target=_blank} storage element so that other smart contracts can easily interact with the XC-20. You can ensure that these values are properly included by checking for them in Polkadot.js apps with the resultant encoded calldata.

基于Moonbeam的资产的最低账户余额和充足性分别设置为1和`true`，类似于以太坊上的ERC-20。`--revert-code`标志是指在[XC-20](/builders/interoperability/xcm/xc20/){target=_blank}存储元素中设置的简单EVM字节码，以便其他智能合约可以轻松与XC-20交互。

For example, the following command would be for registering an asset from parachain 888, with an asset that has a general key of `1`:  

例如，以下命令将用于注册来自平行链888的资产，该资产的通用密钥为`1`：

```
yarn register-asset -w wss://wss.api.moonbase.moonbeam.network \
--asset '{ "parents": 1, "interior": { "X2": [{ "Parachain": 888 }, {"GeneralKey": "0x000000000000000001"}]}}' \
--symbol "xcEXTN" --decimals 18 \
--name "Example Token" \
--units-per-second 20070165297881393351 \ 
--ed 1 --sufficient true --revert-code true 
```

Its output would look like the following:  

输出应为如下所示：

```
Encoded proposal for registerAsset is 0x1f0000010200e10d0624000000000000000001344578616d706c6520546f6b656e1878634558544e12000000000000000000000000000000000000
Encoded proposal for setAssetUnitsPerSecond is 0x1f0100010200e10d0624000000000000000001c7a8978b008d8716010000000000000026000000
Encoded calldata for tx is 0x0102081f0000010200e10d0624000000000000000001344578616d706c6520546f6b656e1878634558544e120000000000000000000000000000000000001f0100010200e10d0624000000000000000001c7a8978b008d8716010000000000000026000000
```

If you plan to batch the transaction with other calls, copy the resultant calldata for later when using the [batching transactions](#batch-actions-into-one) script.

如果您计划将交易与其他调用进行批处理，请复制生成的调用数据以用于后续的[批处理交易](#batch-actions-into-one)脚本。

You can repeat this process with multiple assets if you intend on registering multiple cross-chain assets to Moonbeam.  

如果您计划将多个跨链资产注册到Moonbeam，则可以对多个资产重复此过程。

### Calculating Units Per Second - 计算每秒的单位 {: #calculating-units-per-second }

`UnitsPerSecond` is the number of tokens charged per second of execution of an XCM message. The target cost for an XCM transfer is `$0.02` at the time of registration. The `UnitsPerSecond` might get updated through governance as the token price fluctuates.

`UnitsPerSecond`是执行XCM消息时每秒收取的Token数。XCM转账的目标成本在注册时为`$0.02`。随着Token价格的波动，`UnitsPerSecond`可能会通过治理进行更新。

The easiest way to calculate an asset's `UnitsPerSecond` is through the [`calculate-units-per-second.ts` script](https://github.com/PureStake/xcm-tools/blob/main/scripts/calculate-units-per-second.ts){target=_blank} of [xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank}. To run the script, you must provide the following:

计算资产的`UnitsPerSecond`最简单方法是通过[`calculate-units-per-second.ts`脚本](https://github.com/PureStake/xcm-tools/blob/main/scripts/calculate- units-per-second.ts){target=_blank} of [xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank}。要运行脚本，您必须提供以下内容：

- `--d` decimals of the tokens you are calculating the units per second for
- `--d` - 您正在计算每秒单位的Token的小数位数
- `--xwc` total weight cost of the execution of the entire XCM message
- `--xwc` - 整个XCM消息执行的总权重成本
- `--t` (optional) target price for XCM execution, defaults to `$0.02`
- `--t` -（可选）XCM执行的目标价格，默认为`$0.02`
- `--a` (optional) the token [Coingecko API id](https://www.coingecko.com/){target=_blank}
- `--a` -（可选）Token的[Coingecko API id](https://www.coingecko.com/){target=_blank}
- `--p` (optional) if the Coingecko API does not support the token, you can specify the price manually
- `--p ` -（可选）如果 Coingecko API不支持Token，则通过手动指定价格

The estimated weight per XCM operation on each Moonbeam chain is:  

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

For example, to calculate the units per second of DOT (Polkadot token), which has 10 decimals, on Moonbeam:

例如，要计算Moonbeam上DOT（Polkadot Token）的每秒单位，其有10个小数位数：

```
yarn calculate-units-per-second --d 10 --a polkadot --xwc 800000000 
```

Which should result in the following output (at the time of writing):  

截止本文撰写时，输出应为如下所示：

```
Token Price is $7.33
The UnitsPerSecond needs to be set 34106412005
```

## Batch Actions Into One - 整合批处理操作 {: #batch-actions-into-one }

The most efficient way to complete the XCM process on parachains is to batch all transactions together. The [xcm-tools repository](https://github.com/PureStake/xcm-tools){target=_blank} provides a script to batch extrinsic calls into a single call, thus requiring only a single transaction. This can be helpful if your parachain would like to open an HRMP channel and register an asset simultaneously. This **should be used** when proposing a channel registration on a Moonbeam network. 

在平行链上完成XCM流程的最有效方法是将所有交易批处理整合到一起。[xcm-tools repository](https://github.com/PureStake/xcm-tools){target=_blank}提供了一个脚本，用于将extrinsic调用批处理为单个调用，因此只需要一个交易。如果您的平行链想要打开HRMP通道并同时注册资产，这将有助于您快速完成。在 Moonbeam网络上提议通道注册时，**建议使用**此方式。 

You will now use the encoded calldata outputs of the three previous command calls and insert them into the following command to send the batch proposal to democracy. Add a `--call "YOUR_CALL"` for each call you want to batch. Replace the following values before running the command:  

您现在将使用前三个命令调用的编码调用数据输出，并将其插入到以下命令中以将批处理提案发送给民主。为要批处理的每个调用添加一个`--call "YOUR_CALL"`。在运行命令之前替换以下值：

- `OPEN_CHANNEL_CALL` is the SCALE encoded calldata for [opening an HRMP channel](#open-an-hrmp-channel-from-moonbeam) from Moonbeam to your parachain  
- `OPEN_CHANNEL_CALL`是用于从Moonbeam到平行链[打开HRMP通道](#open-an-hrmp-channel-from-moonbeam)的SCALE编码调用数据
- `ACCEPT_INCOMING_CALL` is the SCALE encoded calldata for [accepting the channel request](#accept-an-hrmp-channel-on-moonbeam) from your parachain  
- `ACCEPT_INCOMING_CALL`是用于[接受来自平行链通道请求](#accept-an-hrmp-channel-on-moonbeam)的SCALE编码调用数据
- `REGISTER_ASSET_CALL` is the SCALE encoded calldata for [registering a cross-chain asset](#register-a-foreign-asset). If you have more than one asset to be registered on Moonbeam, you can include additional registration SCALE encoded calldata with additional `--call` flags  
- `REGISTER_ASSET_CALL`是用于[注册跨链资产](#register-a-foreign-asset)的SCALE编码调用数据。如果您有多个资产要在Moonbeam上注册，您可以包含附加的注册SCALE编码调用数据和附加的`--call`标志

If you are registering on Moonbase Alpha, you will not to provide a private key or go through governance. Run the following command using `--sudo` and provide the output to the Moonbeam team so that the asset and channel can be added quickly through sudo.  

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

!!! note 注意事项
    You can readapt the script for your parachain by changing the `parachain-ws-provider`.

您可以通过更改`parachain-ws-provider`为您的平行链重新调整脚本。

For Moonbeam and Moonriver, you should include `--account-priv-key YOUR_PRIVATE_KEY` and `-send-preimage-hash true --send-proposal-as democracy` if you want to send the governance proposal directly from the CLI tool. It is recommended to get familiar with the [governance process on Moonbeam-based networks](/learn/features/governance/){target=_blank}.

对于Moonbeam和Moonriver，如果您想直接从CLI工具发送治理提案，则应包含`--account-priv-key YOUR_PRIVATE_KEY`和`-send-preimage-hash true --send-proposal-as democracy`。建议提前熟悉[基于Moonbeam网络的治理流程](/learn/features/governance/){target=_blank}。

For Moonbase Alpha, you could add the `--sudo` flag and provide the SCALE encoded calldata to the team so that it is submitted via sudo.

对于Moonbase Alpha，您可以添加`--sudo`标志并向团队提供SCALE编码的调用数据，以便通过sudo提交。

Feel free to check the [additional flags](#additional-flags-xcm-tools) available for this script.

您可以随时查看可用于此脚本的[附加标志](#additional-flags-xcm-tools)。

## Additional Flags for XCM-Tools - XCM-Tools的附加标志 {: #additional-flags-xcm-tools }

The [xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools){target=_blank} and most of its functions can be called with some additional flags that create some wrappers around the actions being taken. For example, you might want to wrap the send of the XCM message in sudo, or via a democracy proposal.

[xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools){target=_blank}及其大部分函数都可以使用一些附加标志来调用，这些标志会在所采取的操作周围创建一些包装器。例如，您可能希望将XCM消息的发送包装在sudo中，或通过民主提案。

The complete options that can be used with the script are as follows:  

您可以与以下脚本一起使用的完整选项：

|     Flag - 标志      |        Type - 类型         |                      Description - 描述                      |
| :------------------: | :------------------------: | :----------------------------------------------------------: |
|   account-priv-key   |           string           | (Required for send-proposal-as, send-preimage-hash) The private key of the account to send a transaction with - 发送交易的账户私钥（用于send-proposal-as和send-preimage-hash） |
|         sudo         |          boolean           | Whether to wrap the extrinsic calldata inside of a `sudo.sudo` extrinsic. If `account-priv-key` is present, it will attempt to send the transaciton - 是否将extrinsic调用数据包装在`sudo.sudo` extrinsic中。如果存在`account-priv-key`，则尝试发送交易 |
|  send-preimage-hash  |          boolean           | Whether to submit the encoded calldata as a preimage and retrieve its hash - 是否将编码后的调用数据作为原像提交并检索其哈希 |
|   send-proposal-as   | democracy/council-external | Whether to send the encoded calldata through democracy or Council (Governance v1) - 是否通过民主或理事会发送编码的调用数据（Governance v1版本） |
| collective-threshold |           number           | (Required for council-external) The threshold for the Council deciding the proposal - 理事会决定提案的门槛（用于外部的理事会） |
|       at-block       |           number           | Whether to wrap the extrinsic calldata inside of a `scheduler.schedule` extrinsic. The block in the future that the action should be scheduled to take place - 是否将外部调用数据包装在`scheduler.schedule` extrinsic中。未来应该安排采取行动的区块 |
|     fee-currency     |   string (multilocation)   | (Required for non-Moonbeam chains that use XCM-Transactor) The multilocation of the relay chain's asset - 中继链资产的multilocation（用于使用XCM-Transactor的非Moonbeam链） |

## Testing Asset Registration on Moonbeam - 在Moonbeam上测试资产注册 {: #testing-asset-registration-on-moonbeam }

After both channels are established and your asset is registered, the team will provide the asset ID and the [XC-20 precompile](/builders/interoperability/xcm/xc20/overview/#the-erc20-interface){target=_blank} address.

建立两个通道并注册资产后，团队将提供资产ID和[XC-20预编译](/builders/interoperability/xcm/xc20/overview/#the-erc20-interface){target=_blank}地址。

Your XC-20 precompile address is calculated by converting the asset ID decimal number to hex, and prepending it with F's until you get a 40 hex character (plus the “0x”) address. For more information on how it is calculated, please refer to the [Calculate External XC-20 Precompile Addresses](/builders/interoperability/xcm/xc20/xc20/#calculate-xc20-address){target=_blank} section of the External XC-20 guide.

您的XC-20预编译地址是通过将资产ID十进制数转换为十六进制数并在其前面加上F来计算的，直到您获得40个十六进制字符（加上“0x”）地址。 有关如何计算的更多信息，请参阅外部XC-20教程中的[计算外部XC-20预编译地址](/builders/interoperability/xcm/xc20/xc20/#calculate-xc20-address){target=_blank}部分。

After the asset is successfully registered, you can try transferring tokens from your parachain to the Moonbeam-based network you are integrating with.

资产成功注册后，您可以尝试将Token从您的平行链转移到您正在集成的基于Moonbeam的网络。

!!! note 注意事项
    Remember that Moonbeam-based networks use AccountKey20 (Ethereum-style addresses).

请记住，基于Moonbeam的网络使用AccountKey20（以太坊格式的地址）。

For testing, please also provide your parachain WSS endpoint so that the Moonbeam dApp can connect to it. Lastly, please fund the corresponding account:

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

!!! note 注意事项
    For Moonbeam and Moonriver testing, please send $50 worth of tokens to the aforementioned account. In addition, provide an Ethereum-style account to send $50 worth of GLMR/MOVR for testing purposes.

如果您用Moonbeam和Moonriver进行测试，请向上述账户发送$50等值的Token。此外，提供一个以太坊格式的账户，以发送$50等值的GLMR/MOVR用于测试目的。

[XC-20s](/builders/interoperability/xcm/xc20/){target=_blank} are Substrate based assets with an [ERC-20 interface](/builders/interoperability/xcm/xc20/overview/#the-erc20-interface){target=_blank}. This means they can be added to MetaMask, and can be composed with any EVM DApp that exists in the ecosystem. The team can connect you with any DApp you find relevant for an XC-20 integration.

[XC-20s](/builders/interoperability/xcm/xc20/){target=_blank}是基于Substrate的资产，具有[ERC-20接口](/builders/interoperability/xcm/xc20/overview/#the-erc20-interface){target=_blank}。这意味着它们可以添加至MetaMask，并与生态系统中存在的任何EVM DApp组合。如果您感兴趣与XC-20集成相关的任何DApp连接，Moonbeam团队可以为您提供联系。

If you need DEV tokens (the native token for Moonbase Alpha) to use your XC-20 asset, you can get some from the [Moonbase Alpha Faucet](/builders/get-started/networks/moonbase/#moonbase-alpha-faucet){target=_blank}, which dispenses {{ networks.moonbase.website_faucet_amount }} every 24 hours. If you need more, feel free to reach out to the team on [Telegram](https://t.me/Moonbeam_Official){target=_blank} or [Discord](https://discord.gg/PfpUATX){target=_blank}.

如果您需要DEV Token（Moonbase Alpha的原生Token）来使用您的XC-20资产，您可以通过[Moonbase Alpha Faucet](/builders/get-started/networks/moonbase/#moonbase-alpha-faucet ){target=_blank}获取（每24小时分配{{ networks.moonbase.website_faucet_amount }}）。如果您需要更多的DEV用于测试，请随时通过[电报群](https://t.me/Moonbeam_Official){target=_blank}或[Discord](https://discord.gg/PfpUATX){target=_blank}联系Moonbeam团队。
