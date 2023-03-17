---
title: Governance 治理
description: As a Polkadot parachain, Moonbeam uses an on-chain governance system, allowing for a stake-weighted vote on public referenda.
作为波卡平行链，Moonbeam使用链上治理系统来允许公众进行质押权重投票。
---

# Governance on Moonbeam - Moonbeam上的治理

![Governance Moonbeam Banner](/images/learn/features/governance/governance-overview-banner.png)

## Introduction 概览 {: #introduction } 

The goal of Moonbeam’s governance mechanism is to advance the protocol according to the desires of the community. In that shared mission, the governance process seeks to include all token holders. Any and all changes to the protocol must go through a referendum so that all token holders, weighted by stake, can have input on the decision.

Moonbeam治理机制的目标是根据社区意愿推进协议。在这个共同使命中，治理过程寻求包括所有Token持有者。关于协议的任何以及所有更改都必须通过公投，以便所有的Token持有者可以根据质押权中对决策提出建议。

Governance forums like the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank} and [Polkassembly](https://moonbeam.polkassembly.network/){target=_blank} enable open discussion and allow proposals to be refined based on community input. Autonomous enactments and [forkless upgrades](https://wiki.polkadot.network/docs/learn-runtime-upgrades#forkless-upgrades/){target=_blank} unite the community towards a shared mission to advance the protocol.

如[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}和[Polkassembly](https://moonbeam.polkassembly.network/){target=_blank}的社区论坛将开放讨论，并将根据社区建议重新定义。自主生效和[无分叉升级](https://wiki.polkadot.network/docs/learn-runtime-upgrades#forkless-upgrades/){target=_blank}将社区团结起来，共同完成推进协议的使命。

With the rollout of OpenGov (originally referred to as Gov2), the second phase of governance in Polkadot, several modifications have been introduced to the governance process. You can read the [OpenGov: What is Polkadot Gov2](https://moonbeam.network/blog/opengov/){target=_blank} blog post, which provides an overview of all of the changes made in OpenGov. **OpenGov has launched on Moonriver, and once it has been rigorously tested, a proposal will be made for it to be launched on Moonbeam**. Until then, Moonbeam still uses Governance v1.

随着波卡治理的第二个阶段OpenGov（初始定义为Gov2）的推出，对治理流程进行了几个修改。关于OpenGov所有修改的详细内容，请参考[OpenGov：什么是Polkadot Gov2](https://moonbeam.network/blog/opengov/){target=_blank}。**OpenGov现已上线Moonriver，经过严密测试后，将提出上线Moonbeam的提案。截至目前为止，Moonbeam仍在使用Governance v1版本。**

## Principles 原则 {: #principles } 

Guiding "soft" principles for engagement with Moonbeam's governance process include:

参与Moonbeam治理流程的“基本”原则包括：

 - Being inclusive to token holders that want to engage with Moonbeam and that are affected by governance decisions
 - 对希望参与Moonbeam网络的和受到治理决策影响的Token持有者持开放包容的态度
 - Favoring token holder engagement, even with views contrary to our own, versus a lack of engagement
 - 即使与Moonbeam意见相左，仍需支持Token持有者的参与
 - A commitment to openness and transparency in the decision-making process
 - 承诺决策过程中的公开透明
 - Working to keep the greater good of the network ahead of any personal gain  
 - 以生态利益为先，个人利益为后
 - Acting at all times as a moral agent that considers the consequences of action (or inaction) from a moral standpoint
 - 始终以道德作为行事的出发点
 - Being patient and generous in our interactions with other token holders, but not tolerating abusive or destructive language, actions, and behavior, and abiding by [Moonbeam’s Code of Conduct](https://github.com/moonbeam-foundation/code-of-conduct){target=_blank}
- 与其他Token持有者合作始终保持耐心和慷慨的心态，但不代表容忍辱骂性或破坏性的语言、行动和行为并遵守[Moonbeam执行准则](https://github.com/moonbeam-foundation/code-of-conduct){target=_blank}

These points were heavily inspired by Vlad Zamfir’s writings on governance. Refer to his articles, especially the [How to Participate in Blockchain Governance in Good Faith (and with Good Manners)](https://medium.com/@Vlad_Zamfir/how-to-participate-in-blockchain-governance-in-good-faith-and-with-good-manners-bd4e16846434){target=_blank} Medium article.

以上原则很大程度上受到Vlad Zamfir先生关于区块链治理的著作的启发。如需了解更多详情，请参阅他撰写的文章，尤其是[如何以诚信（和礼貌）的方式参与区块链治理](https://medium.com/@Vlad_Zamfir/how-to-participate-in-blockchain-governance-in-good-faith-and-with-good-manners-bd4e16846434){target=blank}这篇Medium文章。

## On-Chain Governance Mechanics 链上治理机制 {: #on-chain-governance-mechanics } 

The "hard" governance process for Moonbeam will be driven by an on-chain process that allows the majority of tokens on the network to determine the outcomes of key decisions around the network. These decision points come in the form of stake-weighted voting on proposed referenda. 

Moonbeam的“硬性”治理流程将由链上流程驱动，该方式能够确保与Moonbeam网络相关的关键决策由多数Token作出。这些决策将以提案公投的形式出现，并根据投票权重得出投票结果。

Some of the main components of this governance model include:

这一治理机制的主要组成部分包括：

 - **Referenda** — a stake-based voting scheme where each referendum is tied to a specific proposal for a change to the Moonbeam system including values for key parameters, code upgrades, or changes to the governance system itself
 - **公投** — 基于质押量的投票计划，每次公投均与更改Moonbeam系统的特定提案相关，包括关键参数值、代码升级或治理系统本身的修改
 - **Voting** — referendum will be voted on by token holders on a stake-weighted basis. Referenda which pass are subject to delayed enactment such that people that disagree with the direction of the decision have time to exit the network
 - **投票** — 公投将由Token持有者以质押量权重为基础进行投票。通过的公投将会延迟生效，以便有不同意决策的Token持有者有时间退出网络
 - **Council & Technical Committee Governance V1** — a group of community members who have special voting rights within the system
 - **理事会 & 技术委员会Governance V1** — 一个由社区成员组成的团体，成员在系统中拥有特殊投票权
 - **OpenGov Technical Committee** — a group of community members who can add certain proposals to the Whitelisted Track
 - **OpenGov技术委员会** — 一个由社区成员组成的团体，成员可以将特定提案列入Whitelisted Track中

For more details on how these Substrate frame pallets implement on-chain governance, you can checkout the [Walkthrough of Polkadot’s Governance](https://polkadot.network/a-walkthrough-of-polkadots-governance/){target=_blank} blog post and the [Polkadot Governance Wiki](https://wiki.polkadot.network/docs/learn-governance){target=_blank}.

更多关于Substrate框架pallet如何实施链上治理的细节，请查阅[波卡治理概览](https://polkadot.network/a-walkthrough-of-polkadots-governance/){target=blank}博客文章以及[波卡治理Wiki](https://wiki.polkadot.network/docs/learn-governance){target=blank}。

## Governance v2: OpenGov {: #opengov }

This section will cover everything you need to know about OpenGov on Moonriver and Moonbase Alpha. If you're looking for governance-related information on Moonbeam, please refer to the [Goveranance v1](#governance-v1) section.

此部分将涵盖您需要了解的关于Moonriver和Moonbase Alpha上OpenGov的所有信息。关于Moonbeam的治理相关信息，请参考[Goveranance v1](#governance-v1)部分。

### General Definitions 一般定义 {: #general-definitions-gov2 }

--8<-- 'text/governance/proposal-definitions.md'

--8<-- 'text/governance/preimage-definitions.md'

 - **Origin** - an authorization-based dispatch source for an operation, which is used to determine the Track that a referendum is posted under

 - **Origin** - 基于授权的交易来源，用于决定公投发布的Track

 - **Track** - an Origin-specific pipeline that outlines the lifecycle of proposals. Currently, there are five Tracks:

 - **Track** - 概述提案生命周期的特定于Origin的传递途径。目前，有五个Track：

    |  Origin Track类型   |                       Description描述                        |                 Referendum Examples公投示例                  |
    | :-----------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
    |        Root         |             Highest privilege - 最高优先级的提案             | Runtime upgrades, Technical Committee management - Runtime更新、技术委员会管理 |
    |     Whitelisted     | Proposals to be whitelisted by the Technical Committee before getting dispatched - 在发送前由技术委员会列入白名单的提案 |            Fast-tracked operations - 快速处理操作            |
    |    General Admin    |      For general on-chain decisions - 用于基本链上决策       | Changes to XCM fees, Orbiter program, Staking parameters, Registrars - XCM费用、Orbiter计划、平行链质押、registrar更新 |
    | Emergency Canceller | For cancellation of a referendum. Decision Deposit is refunded - 用于取消公投。保证金退还 |         Wrongly constructed referendum - 错误的公投          |
    |  Emergency Killer   | For killing of bad/malicious referendum. Decision Deposit is slashed - 用于处理不良公投。保证金没收 |               Malicious referendum - 不良公投                |

--8<-- 'text/governance/vote-conviction-definitions.md'

--8<-- 'text/governance/approval-support-definitions.md'

--8<-- 'text/governance/lead-in-definitions.md'
    Please refer to the [Governance Parameters](#governance-parameters-v2) section for more information 请参考[治理参数](#governance-parameters-v2)部分获取更多信息

 - **Decide Period** - token holders continue to vote on the referendum. If a referendum does not pass by the end of the period, it will be rejected, and the Decision Deposit will be refunded
 - **决定期** - Token持有者继续在公投上进行投票。如果公投在期限结束时未通过，则提案会被拒绝，决定保证金将被退还
 - **Confirm Period** - a period of time within the Decide Period where the referendum needs to have maintained enough Approval and Support to be approved and move to the Enactment Period
 - **确认期** - 公投需要在确定期内获得足够的批准和支持数量才能进入生效等待期
 - **Enactment Period** - a specified time, which is defined at the time the proposal was created, that an approved referendum waits before it can be dispatched. There is a minimum amount of time for each Track
 - **生效等待期** - 批准的提案等待指定时间以正式执行。每个Track有一个最短等待期限

--8<-- 'text/governance/delegation-definitions.md'

### Governance Parameters 治理参数 {: #governance-parameters-v2 }

=== "Moonriver"
    |          Variable - 变量           |                            Value - 值                            |
    |:---------------------------:|:-----------------------------------------------------------:|
    |    Preimage base deposit - 原像基础保证金    |     {{ networks.moonriver.preimage.base_deposit }} MOVR     |
    |  Preimage deposit per byte - 每个字节的原像保证金  |     {{ networks.moonriver.preimage.byte_deposit }} MOVR     |
    | Proposal Submission Deposit - 提案提交保证金 | {{ networks.moonriver.governance.submission_deposit }} MOVR |

=== "Moonbase Alpha"
    |          Variable - 变量           |                           Value - 值                           |
    |:---------------------------:|:---------------------------------------------------------:|
    |    Preimage base deposit - 原像基础保证金    |     {{ networks.moonbase.preimage.base_deposit }} DEV     |
    |  Preimage deposit per byte - 每个字节的原像保证金  |     {{ networks.moonbase.preimage.byte_deposit }} DEV     |
    | Proposal Submission Deposit - 提案提交保证金 | {{ networks.moonbase.governance.submission_deposit }} DEV |

#### General Parameters by Track - Track的基本参数 {: #general-parameters-by-track }

=== "Moonriver"
    |         Track类型          | Track ID |                                    Capacity容量                                     |                              Decision决定<br>Deposit保证金                               |
    |:----------------------:|:--------:|:-------------------------------------------------------------------------------:|:------------------------------------------------------------------------------:|
    |          Root          |    0     |     {{ networks.moonriver.governance.tracks.root.max_deciding }} proposals      |     {{ networks.moonriver.governance.tracks.root.decision_deposit }} MOVR      |
    |      Whitelisted       |    1     |  {{ networks.moonriver.governance.tracks.whitelisted.max_deciding }} proposals  |  {{ networks.moonriver.governance.tracks.whitelisted.decision_deposit }} MOVR  |
    |     General Admin      |    2     | {{ networks.moonriver.governance.tracks.general_admin.max_deciding }} proposals | {{ networks.moonriver.governance.tracks.general_admin.decision_deposit }} MOVR |
    | Emergency<br>Canceller |    3     |   {{ networks.moonriver.governance.tracks.canceller.max_deciding }} proposals   |   {{ networks.moonriver.governance.tracks.canceller.decision_deposit }} MOVR   |
    |  Emergency<br>Killer   |    4     |    {{ networks.moonriver.governance.tracks.killer.max_deciding }} proposals     |    {{ networks.moonriver.governance.tracks.killer.decision_deposit }} MOVR     |

=== "Moonbase Alpha"
    |         Track          | Track ID |                                    Capacity容量                                    |                             Decision决定<br>Deposit保证金                              |
    |:----------------------:|:--------:|:------------------------------------------------------------------------------:|:----------------------------------------------------------------------------:|
    |          Root          |    0     |     {{ networks.moonbase.governance.tracks.root.max_deciding }} proposals      |     {{ networks.moonbase.governance.tracks.root.decision_deposit }} DEV      |
    |      Whitelisted       |    1     |  {{ networks.moonbase.governance.tracks.whitelisted.max_deciding }} proposals |  {{ networks.moonbase.governance.tracks.whitelisted.decision_deposit }} DEV  |
    |     General Admin      |    2     | {{ networks.moonbase.governance.tracks.general_admin.max_deciding }} proposals | {{ networks.moonbase.governance.tracks.general_admin.decision_deposit }} DEV |
    | Emergency<br>Canceller |    3     |   {{ networks.moonbase.governance.tracks.canceller.max_deciding }} proposals   |   {{ networks.moonbase.governance.tracks.canceller.decision_deposit }} DEV   |
    |  Emergency<br>Killer   |    4     |    {{ networks.moonbase.governance.tracks.killer.max_deciding }} proposals     |    {{ networks.moonbase.governance.tracks.killer.decision_deposit }} DEV     |

#### Period Parameters by Track - Track的时间期限参数 {: #period-parameters-by-track }

=== "Moonriver"
    |         Track类型          |                                                                            Prepare准备期<br>Period                                                                             |                                                                              Decide决定期<br>Period                                                                              |                                                                            Confirm确认期<br>Period                                                                             |                                                                             Minimum最短生效等待期<br>Enactment Period                                                                              |
    |:----------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Root          |          {{ networks.moonriver.governance.tracks.root.prepare_period.blocks }} blocks <br>({{ networks.moonriver.governance.tracks.root.prepare_period.time }})          |          {{ networks.moonriver.governance.tracks.root.decision_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.root.decision_period.time }})          |          {{ networks.moonriver.governance.tracks.root.confirm_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.root.confirm_period.time }})          |          {{ networks.moonriver.governance.tracks.root.min_enactment_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.root.min_enactment_period.time }})          |
    |      Whitelisted       |   {{ networks.moonriver.governance.tracks.whitelisted.prepare_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.whitelisted.prepare_period.time }})   |   {{ networks.moonriver.governance.tracks.whitelisted.decision_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.whitelisted.decision_period.time }})   |   {{ networks.moonriver.governance.tracks.whitelisted.confirm_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.whitelisted.confirm_period.time }})   |   {{ networks.moonriver.governance.tracks.whitelisted.min_enactment_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.whitelisted.min_enactment_period.time }})   |
    |     General Admin      | {{ networks.moonriver.governance.tracks.general_admin.prepare_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.general_admin.prepare_period.time }}) | {{ networks.moonriver.governance.tracks.general_admin.decision_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.general_admin.decision_period.time }}) | {{ networks.moonriver.governance.tracks.general_admin.confirm_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.general_admin.confirm_period.time }}) | {{ networks.moonriver.governance.tracks.general_admin.min_enactment_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.general_admin.min_enactment_period.time }}) |
    | Emergency<br>Canceller |     {{ networks.moonriver.governance.tracks.canceller.prepare_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.canceller.prepare_period.time }})     |     {{ networks.moonriver.governance.tracks.canceller.decision_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.canceller.decision_period.time }})     |     {{ networks.moonriver.governance.tracks.canceller.confirm_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.canceller.confirm_period.time }})     |     {{ networks.moonriver.governance.tracks.canceller.min_enactment_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.canceller.min_enactment_period.time }})     |
    |  Emergency<br>Killer   |        {{ networks.moonriver.governance.tracks.killer.prepare_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.killer.prepare_period.time }})        |        {{ networks.moonriver.governance.tracks.killer.decision_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.killer.decision_period.time }})        |        {{ networks.moonriver.governance.tracks.killer.confirm_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.killer.confirm_period.time }})        |        {{ networks.moonriver.governance.tracks.killer.min_enactment_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.killer.min_enactment_period.time }})        |

=== "Moonbase Alpha"
    |         Track类型          |                                                                           Prepare准备期<br>Period                                                                            |                                                                             Decide决定期<br>Period                                                                             |                                                                           Confirm确认期<br>Period                                                                            |                                                                            Minimum最短生效等待期<br>Enactment Period                                                                             |
    |:----------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Root          |          {{ networks.moonbase.governance.tracks.root.prepare_period.blocks }} blocks <br>({{ networks.moonbase.governance.tracks.root.prepare_period.time }})          |          {{ networks.moonbase.governance.tracks.root.decision_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.root.decision_period.time }})          |          {{ networks.moonbase.governance.tracks.root.confirm_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.root.confirm_period.time }})          |          {{ networks.moonbase.governance.tracks.root.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.root.min_enactment_period.time }})          |
    |      Whitelisted       |   {{ networks.moonbase.governance.tracks.whitelisted.prepare_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.whitelisted.prepare_period.time }})   |   {{ networks.moonbase.governance.tracks.whitelisted.decision_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.whitelisted.decision_period.time }})   |   {{ networks.moonbase.governance.tracks.whitelisted.confirm_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.whitelisted.confirm_period.time }})   |   {{ networks.moonbase.governance.tracks.whitelisted.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.whitelisted.min_enactment_period.time }})   |
    |     General Admin      | {{ networks.moonbase.governance.tracks.general_admin.prepare_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.general_admin.prepare_period.time }}) | {{ networks.moonbase.governance.tracks.general_admin.decision_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.general_admin.decision_period.time }}) | {{ networks.moonbase.governance.tracks.general_admin.confirm_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.general_admin.confirm_period.time }}) | {{ networks.moonbase.governance.tracks.general_admin.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.general_admin.min_enactment_period.time }}) |
    | Emergency<br>Canceller |     {{ networks.moonbase.governance.tracks.canceller.prepare_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.canceller.prepare_period.time }})     |     {{ networks.moonbase.governance.tracks.canceller.decision_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.canceller.decision_period.time }})     |     {{ networks.moonbase.governance.tracks.canceller.confirm_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.canceller.confirm_period.time }})     |     {{ networks.moonbase.governance.tracks.canceller.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.canceller.min_enactment_period.time }})     |
    |  Emergency<br>Killer   |        {{ networks.moonbase.governance.tracks.killer.prepare_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.killer.prepare_period.time }})        |        {{ networks.moonbase.governance.tracks.killer.decision_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.killer.decision_period.time }})        |        {{ networks.moonbase.governance.tracks.killer.confirm_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.killer.confirm_period.time }})        |        {{ networks.moonbase.governance.tracks.killer.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.killer.min_enactment_period.time }})        |

#### Support and Approval Parameters by Track - Track的支持和批准参数 {: #support-and-approval-parameters-by-track }

=== "Moonriver"
    |         Track类型          | Approval Curve批准曲线 |                                                                                                                                                                                                                                     Approval Parameters批准参数                                                                                                                                                                                                                                      | Support Curve支持曲线 |                                                                                                                                                                                                                                   Support Parameters支持参数                                                                                                                                                                                                                                   |
    |:----------------------:|:--------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Root          |   Reciprocal   |                            {{ networks.moonriver.governance.tracks.root.min_approval.time0 }}: {{ networks.moonriver.governance.tracks.root.min_approval.percent0 }}%<br>{{ networks.moonriver.governance.tracks.root.min_approval.time1 }}: {{ networks.moonriver.governance.tracks.root.min_approval.percent1 }}%<br>{{ networks.moonriver.governance.tracks.root.min_approval.time2 }}: {{ networks.moonriver.governance.tracks.root.min_approval.percent2 }}%                            |    Linear     |                                                                                                  {{ networks.moonriver.governance.tracks.root.min_support.time0 }}: {{ networks.moonriver.governance.tracks.root.min_support.percent0 }}%<br>{{ networks.moonriver.governance.tracks.root.min_support.time1 }}: {{ networks.moonriver.governance.tracks.root.min_support.percent1 }}%                                                                                                  |
    |      Whitelisted       |   Reciprocal   |       {{ networks.moonriver.governance.tracks.whitelisted.min_approval.time0 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_approval.percent0 }}%<br>{{ networks.moonriver.governance.tracks.whitelisted.min_approval.time1 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_approval.percent1 }}%<br>{{ networks.moonriver.governance.tracks.whitelisted.min_approval.time2 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_approval.percent2 }}%       |  Reciprocal   |       {{ networks.moonriver.governance.tracks.whitelisted.min_support.time0 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_support.percent0 }}%<br>{{ networks.moonriver.governance.tracks.whitelisted.min_support.time1 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_support.percent1 }}%<br>{{ networks.moonriver.governance.tracks.whitelisted.min_support.time2 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_support.percent2 }}%       |
    |     General Admin      |   Reciprocal   | {{ networks.moonriver.governance.tracks.general_admin.min_approval.time0 }}: {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent0 }}%<br>{{ networks.moonriver.governance.tracks.general_admin.min_approval.time1 }}: {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent1 }}%<br>{{ networks.moonriver.governance.tracks.general_admin.min_approval.time2 }}: {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent2 }}% |  Reciprocal   | {{ networks.moonriver.governance.tracks.general_admin.min_support.time0 }}: {{ networks.moonriver.governance.tracks.general_admin.min_support.percent0 }}%<br>{{ networks.moonriver.governance.tracks.general_admin.min_support.time1 }}: {{ networks.moonriver.governance.tracks.general_admin.min_support.percent1 }}%<br>{{ networks.moonriver.governance.tracks.general_admin.min_support.time2 }}: {{ networks.moonriver.governance.tracks.general_admin.min_support.percent2 }}% |
    | Emergency<br>Canceller |   Reciprocal   |             {{ networks.moonriver.governance.tracks.canceller.min_approval.time0 }}: {{ networks.moonriver.governance.tracks.canceller.min_approval.percent0 }}%<br>{{ networks.moonriver.governance.tracks.canceller.min_approval.time1 }}: {{ networks.moonriver.governance.tracks.canceller.min_approval.percent1 }}%<br>{{ networks.moonriver.governance.tracks.canceller.min_approval.time2 }}: {{ networks.moonriver.governance.tracks.canceller.min_approval.percent2 }}%             |  Reciprocal   |             {{ networks.moonriver.governance.tracks.canceller.min_support.time0 }}: {{ networks.moonriver.governance.tracks.canceller.min_support.percent0 }}%<br>{{ networks.moonriver.governance.tracks.canceller.min_support.time1 }}: {{ networks.moonriver.governance.tracks.canceller.min_support.percent1 }}%<br>{{ networks.moonriver.governance.tracks.canceller.min_support.time2 }}: {{ networks.moonriver.governance.tracks.canceller.min_support.percent2 }}%             |
    |  Emergency<br>Killer   |   Reciprocal   |                      {{ networks.moonriver.governance.tracks.killer.min_approval.time0 }}: {{ networks.moonriver.governance.tracks.killer.min_approval.percent0 }}%<br>{{ networks.moonriver.governance.tracks.killer.min_approval.time1 }}: {{ networks.moonriver.governance.tracks.killer.min_approval.percent1 }}%<br>{{ networks.moonriver.governance.tracks.killer.min_approval.time2 }}: {{ networks.moonriver.governance.tracks.killer.min_approval.percent2 }}%                      |  Reciprocal   |                      {{ networks.moonriver.governance.tracks.killer.min_support.time0 }}: {{ networks.moonriver.governance.tracks.killer.min_support.percent0 }}%<br>{{ networks.moonriver.governance.tracks.killer.min_support.time1 }}: {{ networks.moonriver.governance.tracks.killer.min_support.percent1 }}%<br>{{ networks.moonriver.governance.tracks.killer.min_support.time2 }}: {{ networks.moonriver.governance.tracks.killer.min_support.percent2 }}%                      |

=== "Moonbase Alpha"
    |         Track类型          | Approval Curve批准曲线 |                                                                                                                                                                                                                                  Approval Parameters批准参数                                                                                                                                                                                                                                   | Support Curve支持曲线 |                                                                                                                                                                                                                                Support Parameters支持参数                                                                                                                                                                                                                                |
    |:----------------------:|:--------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Root          |   Reciprocal   |                            {{ networks.moonbase.governance.tracks.root.min_approval.time0 }}: {{ networks.moonbase.governance.tracks.root.min_approval.percent0 }}%<br>{{ networks.moonbase.governance.tracks.root.min_approval.time1 }}: {{ networks.moonbase.governance.tracks.root.min_approval.percent1 }}%<br>{{ networks.moonbase.governance.tracks.root.min_approval.time2 }}: {{ networks.moonbase.governance.tracks.root.min_approval.percent2 }}%                            |    Linear     |                                                                                                 {{ networks.moonbase.governance.tracks.root.min_support.time0 }}: {{ networks.moonbase.governance.tracks.root.min_support.percent0 }}%<br>{{ networks.moonbase.governance.tracks.root.min_support.time1 }}: {{ networks.moonbase.governance.tracks.root.min_support.percent1 }}%                                                                                                 |
    |      Whitelisted       |   Reciprocal   |       {{ networks.moonbase.governance.tracks.whitelisted.min_approval.time0 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_approval.percent0 }}%<br>{{ networks.moonbase.governance.tracks.whitelisted.min_approval.time1 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_approval.percent1 }}%<br>{{ networks.moonbase.governance.tracks.whitelisted.min_approval.time2 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_approval.percent2 }}%       |  Reciprocal   |       {{ networks.moonbase.governance.tracks.whitelisted.min_support.time0 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_support.percent0 }}%<br>{{ networks.moonbase.governance.tracks.whitelisted.min_support.time1 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_support.percent1 }}%<br>{{ networks.moonbase.governance.tracks.whitelisted.min_support.time2 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_support.percent2 }}%       |
    |     General Admin      |   Reciprocal   | {{ networks.moonbase.governance.tracks.general_admin.min_approval.time0 }}: {{ networks.moonbase.governance.tracks.general_admin.min_approval.percent0 }}%<br>{{ networks.moonbase.governance.tracks.general_admin.min_approval.time1 }}: {{ networks.moonbase.governance.tracks.general_admin.min_approval.percent1 }}%<br>{{ networks.moonbase.governance.tracks.general_admin.min_approval.time2 }}: {{ networks.moonbase.governance.tracks.general_admin.min_approval.percent2 }}% |  Reciprocal   | {{ networks.moonbase.governance.tracks.general_admin.min_support.time0 }}: {{ networks.moonbase.governance.tracks.general_admin.min_support.percent0 }}%<br>{{ networks.moonbase.governance.tracks.general_admin.min_support.time1 }}: {{ networks.moonbase.governance.tracks.general_admin.min_support.percent1 }}%<br>{{ networks.moonbase.governance.tracks.general_admin.min_support.time2 }}: {{ networks.moonbase.governance.tracks.general_admin.min_support.percent2 }}% |
    | Emergency<br>Canceller |   Reciprocal   |             {{ networks.moonbase.governance.tracks.canceller.min_approval.time0 }}: {{ networks.moonbase.governance.tracks.canceller.min_approval.percent0 }}%<br>{{ networks.moonbase.governance.tracks.canceller.min_approval.time1 }}: {{ networks.moonbase.governance.tracks.canceller.min_approval.percent1 }}%<br>{{ networks.moonbase.governance.tracks.canceller.min_approval.time2 }}: {{ networks.moonbase.governance.tracks.canceller.min_approval.percent2 }}%             |  Reciprocal   |             {{ networks.moonbase.governance.tracks.canceller.min_support.time0 }}: {{ networks.moonbase.governance.tracks.canceller.min_support.percent0 }}%<br>{{ networks.moonbase.governance.tracks.canceller.min_support.time1 }}: {{ networks.moonbase.governance.tracks.canceller.min_support.percent1 }}%<br>{{ networks.moonbase.governance.tracks.canceller.min_support.time2 }}: {{ networks.moonbase.governance.tracks.canceller.min_support.percent2 }}%             |
    |  Emergency<br>Killer   |   Reciprocal   |                      {{ networks.moonbase.governance.tracks.killer.min_approval.time0 }}: {{ networks.moonbase.governance.tracks.killer.min_approval.percent0 }}%<br>{{ networks.moonbase.governance.tracks.killer.min_approval.time1 }}: {{ networks.moonbase.governance.tracks.killer.min_approval.percent1 }}%<br>{{ networks.moonbase.governance.tracks.killer.min_approval.time2 }}: {{ networks.moonbase.governance.tracks.killer.min_approval.percent2 }}%                      |  Reciprocal   |                      {{ networks.moonbase.governance.tracks.killer.min_support.time0 }}: {{ networks.moonbase.governance.tracks.killer.min_support.percent0 }}%<br>{{ networks.moonbase.governance.tracks.killer.min_support.time1 }}: {{ networks.moonbase.governance.tracks.killer.min_support.percent1 }}%<br>{{ networks.moonbase.governance.tracks.killer.min_support.time2 }}: {{ networks.moonbase.governance.tracks.killer.min_support.percent2 }}%                      |

#### Conviction Multiplier信念乘数 {: #conviction-multiplier-v2 }

The Conviction multiplier is related to the number of Enactment Periods the tokens will be locked for after the referenda is enacted (if approved). Consequently, the longer you are willing to lock your tokens, the stronger your vote will be weighted. You also have the option of not locking tokens at all, but vote weight is drastically reduced (tokens are still locked during the duration of the referendum).

信念乘数与公投通过批准后进入生效等待期的Token锁定期限数量有关。如果您愿意锁定Token的时间越长，则您的投票权重就越大。 您也可以选择不锁定Token，但投票权重会大大降低（在公投期间Token仍处于锁定状态）。

If you were to vote 1000 tokens with a 6x Conviction, your weighted vote would be 6000 units. That is, 1000 locked tokens multiplied by the Conviction, which in this scenario would be 6. On the other hand, if you decided you didn't want to have your tokens locked after enactment, you could vote your 1000 tokens with a 0.1x Conviction. In this case, your weighted vote would only be 100 units.

举例来说，如果您以6倍的信念投票1000个Token，您的投票权重将为6000。也就是说，1000个锁定的Token乘以信念（在本示例中为6倍）。但是如果您决定不在生效后锁定您的Token，您可以以0.1倍的信念进行投票。在这种情况下，您的投票权重为100。

The Conviction multiplier values for each network are:

每个网络的信念乘数如下所示：

=== "Moonriver"
    | Lock Periods After Enactment 生效后的锁定期 | Conviction Multiplier 信念乘数 |                        Approx. Lock Time 预计锁定时间                        |
    |:----------------------------:|:---------------------:|:---------------------------------------------------------------:|
    |              0               |          0.1          |                              None                               |
    |              1               |           1           | {{networks.moonriver.conviction.lock_period.conviction_1}} day  |
    |              2               |           2           | {{networks.moonriver.conviction.lock_period.conviction_2}} days |
    |              4               |           3           | {{networks.moonriver.conviction.lock_period.conviction_3}} days |
    |              8               |           4           | {{networks.moonriver.conviction.lock_period.conviction_4}} days |
    |              16              |           5           | {{networks.moonriver.conviction.lock_period.conviction_5}} days |
    |              32              |           6           | {{networks.moonriver.conviction.lock_period.conviction_6}} days |

=== "Moonbase Alpha"
    | Lock Periods After Enactment 生效后的锁定期 | Conviction Multiplier 信念乘数 |                       Approx. Lock Time 预计锁定时间                        |
    |:----------------------------:|:---------------------:|:--------------------------------------------------------------:|
    |              0               |          0.1          |                              None                              |
    |              1               |           1           | {{networks.moonbase.conviction.lock_period.conviction_1}} day  |
    |              2               |           2           | {{networks.moonbase.conviction.lock_period.conviction_2}} days |
    |              4               |           3           | {{networks.moonbase.conviction.lock_period.conviction_3}} days |
    |              8               |           4           | {{networks.moonbase.conviction.lock_period.conviction_4}} days |
    |              16              |           5           | {{networks.moonbase.conviction.lock_period.conviction_5}} days |
    |              32              |           6           | {{networks.moonbase.conviction.lock_period.conviction_6}} days |

!!! note 注意事项
    The lock time approximations are based upon regular {{ networks.moonriver.block }}-second block times. Block production may vary and thus the displayed lock times should not be deemed exact.

预计锁定时间基于常规的{{ networks.moonriver.block }}-秒区块时间。区块生产可能会有所不同，因此显示的锁定时间仅供参考。

### Roadmap of a Proposal提案步骤 {: #roadmap-of-a-proposal-v2 } 

Before a proposal is submitted, the author of the proposal can submit their idea for their proposal to the designated Democracy Proposals section of the [Moonbeam Governance discussion forum](https://forum.moonbeam.foundation/c/governance/2){target=_blank} for feedback from the community for at least five days. From there, the author can make adjustments to the proposal based on the feedback they've collected.

在提交提案之前，提案的作者可以将其提案的想法提交到[Moonbeam治理论坛](https://forum.moonbeam.foundation/c/governance/2){target=_blank}的Democracy Proposals部分，以获得来自社区的至少五天的反馈。作者可以根据收集的反馈对提案进行调整。

Once the author is ready, they can submit their proposal on-chain. To do so, first, they need to submit the preimage of the proposal. The submitter needs to bond a fee to store the preimage on-chain. The bond is returned once the submitter unnotes the preimage. Next, they can submit the actual proposal and pay the Submission Deposit, which is enough to cover the on-chain storage cost of the proposal. Then the Lead-in Period begins and the community can begin voting "Aye" or "Nay" on the proposal by locking tokens. In order for the referendum to advance and move out of the Lead-in Period to the Decide period, the following criteria must be met:

作者准备完毕后，便可以在链上提交提案。首先，需要提交提案原像。提交者必须绑定一笔费用以在链上存储原像。提交者取消注释原像后该保证金将被退还。接下来，提交者可以提交真实的提案并支付提交保证金，确保能够支付提案的链上存储费用。然后，将进入带入期，社区可以通过锁定Token为提案进行“赞成”或“反对”的投票。为了让公投从带入期进入决定期必须满足以下条件：

- The referendum must wait the duration of the Prepare Period, which allows for adequate time to discuss the proposal before it progresses to the next phase
- 公投必须等待准备期的持续时间，以便在进入下一阶段之前有足够的时间讨论提案
- There is enough Capacity in the chosen Track
- 所选的Track类型中有足够的容量
- A Decision Deposit has been made that meets the minimum requirements for the Track
- 完成符合Track类型最低要求的决定保证金

If a referendum meets the above criteria, it moves to the Decide Period and takes up one of the spots in its designated Track. In the Decide Period, voting continues and the referendum has a set amount of days to reach the Approval and Support requirements needed for it to progress to the Confirm Period.

如果公投满足以上条件，将会进入决定期并占据指定Track类别的其中一个位置。在决定期，投票将持续进行，公投设置了一定的天数来达到所需的批准和支持要求才能进入确认期。

Once in the Confirm Period, a referendum must continuously meet the Approval and Support requirements for the duration of the period. If a referendum fails to meet the requirements at any point, it is returned to the Decide Period. If the referendum meets the Approval and Support requirements again, it can progress to the Confirm Period again and the Decide Period will be delayed until the end of the Confirm Period. If the Decide Period ends and not enough Approval and Support was received, the referendum will be rejected and the Decision Deposit will be returned. The proposal can be proposed again at any time.

当进入确认期后，公投必须在此期间持续满足批准和支持要求。如果公投未达到要求，则返回到决定期。如果在决定期还剩下足够的时间，并且公投再次满足批准和支持要求，则可以再次进入到确认期。 如果决定期结束，但未获得足够的批准和支持，则公投将被拒绝，决定保证金将被退还。 该提议可以在任何时候再次提出。

If a referendum continously receives enough Approval and Support during the Confirm Period, it will be approved and move to the Enactment Period. It will wait the duration of the Enactment Period before it gets dispatched.

如果公投在确认期继续获得足够的批准和支持，则会被批准并进入生效等待期。在正式被发送之前，将在生效等待期等待。

The happy path for a proposal is shown in the following diagram:

下方图片显示了提案步骤：

![A happy path diagram of the proposal roadmap in OpenGov.](/images/learn/features/governance/v2/proposal-roadmap.png)

### Proposal Example Walkthrough 提案示例流程 {: #proposal-example-walkthrough }

A proposal (with its preimage) is submitted for the General Admin Track on Moonriver would have the following characteristics:

在Moonriver上的General Admin Track提交的提案（及其原像）将具有以下特征：

 - The Approval curve starts at {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent0 }}% on {{ networks.moonriver.governance.tracks.general_admin.min_approval.time0 }}, goes to {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent1 }}% on {{ networks.moonriver.governance.tracks.general_admin.min_approval.time1 }}
 - 批准曲线从第{{ networks.moonriver.governance.tracks.general_admin.min_approval.time0 }}天的{{ networks.moonriver.governance.tracks.general_admin.min_approval.percent0 }}%开始，在第{{ networks.moonriver.governance.tracks.general_admin.min_approval.time1 }}天达到{{ networks.moonriver.governance.tracks.general_admin.min_approval.percent1 }}%
 - The Support curve starts at {{ networks.moonriver.governance.tracks.general_admin.min_support.percent0 }}% on {{ networks.moonriver.governance.tracks.general_admin.min_support.time0 }}, goes to {{ networks.moonriver.governance.tracks.general_admin.min_support.percent1 }}% on {{ networks.moonriver.governance.tracks.general_admin.min_support.time1 }}
 - 支持曲线从第{{ networks.moonriver.governance.tracks.general_admin.min_support.time0 }}天的{{ networks.moonriver.governance.tracks.general_admin.min_support.percent0 }}%开始，在第{{ networks.moonriver.governance.tracks.general_admin.min_support.time1 }}天达到{{ networks.moonriver.governance.tracks.general_admin.min_support.percent1 }}%
 - A referendum starts the Decide Period with 0% "Aye" votes (nobody voted in the Lead-in Period)
 - 公投以0%的“赞成”票开始决定期（带入期不开放投票）
 - Token holders begin to vote and the Approval increases to a value above {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent1 }}% by {{ networks.moonriver.governance.tracks.general_admin.min_approval.time1 }}
 - Token持有者开始投票并在第{{ networks.moonriver.governance.tracks.general_admin.min_approval.time1 }}天将批准率增加到{{ networks.moonriver.governance.tracks.general_admin.min_approval.percent1 }}%以上
 - If the Approval and Support thresholds are met for the duration of the Confirm Period ({{ networks.moonriver.governance.tracks.general_admin.min_enactment_period.blocks }} blocks, approximately {{ networks.moonriver.governance.tracks.general_admin.min_enactment_period.time }}), the referendum is approved
 - 如果批准和支持在确认期达到数量要求（{{ networks.moonriver.governance.tracks.general_admin.min_enactment_period.blocks }}区块，约为{{ networks.moonriver.governance.tracks.general_admin.min_enactment_period.time }}天），则公投会被批准
 - If the Approval and Support thresholds are not met during the Decision Period, the proposal is rejected. Note that the thresholds need to be met for the duration of the Confirm Period. Consequently, if they are met but the Decision Period expires before the completion of the Confirm Period, the proposal is rejected
 - 如果在决定期未达到批准和支持数量要求，则该提案将被拒绝。请注意，必须在确认期达到此数值。 因此，如果该提案满足要求但在确认期完成之前决定期已经到期，则该提案将被拒绝

The Approval and Support percentages can be calculated using the following:

批准和支持的比例可以使用以下方式计算：

=== "Approval"
    ```
    Approval = 100 * ( Total Conviction-weighted "Aye" votes / Total Conviction-weighted votes ) 
    ```

=== "Support"
    ```
    Support = 100 * ( Total non-Conviction-weighted votes / Total supply )
    ```

### Proposal Cancellations 提案取消 {: #proposal-cancellations }

In the event that a proposal already in the voting stage is found to have an issue, it may be necessary to prevent its approval. These instances may involve malicious activity or technical issues that make the changes impossible to implement due to recent upgrades to the network.

如果发现已经进入投票阶段的提案有问题，则需要阻止该提案通过。这些实例可能涉及恶意活动或技术问题，导致由于近期的网络升级而无法实施更改。

Cancellation must be voted on by the network to be executed. Cancellation proposals are faster than a typical proposal because they must be decided before the enactment of the proposal they seek to cancel, but they follow the same process as other referenda. There are two Cancellation Origins, one for use against referenda that contain an unforeseen problem called Emergency Canceller, and one for bad referenda intending to harm the network called Emergency Killer. Both of these Tracks have a short lead time and Approval and Support requirements, with reductions in the threshold for passing.

取消公投需要通过网络投票才可执行。取消提案的流程会比普通提案更快，因为该提案必须在生效之前快速决定，但遵循与其他公投相同的过程。目前有两种Cancellation Origins，Emergency Canceler用于处理包含不可预见问题的公投，Emergency Killer用于处理损害网络的不良公投。这两个Track降低了通过门槛，因此带入期较短，批准和支持要求也偏低。

The Emergency Canceller track results in a rejected proposal and Decision Deposit refund, and the Emergency Killer track results in cancellation and a deposit slash, meaning the deposit amount is burned. 

Emergency Canceller的track会导致提案被拒绝，决定保证金被退回。而Emergency Killer的track会导致提案被取消，保证金被没收，即决定保证金被销毁。

### Rights of the OpenGov Technical Committee - OpenGov技术委员会的权力 {: #rights-of-the-opengov-technical-committee }

On Polkadot, the Technical Committee from Governance v1 was replaced with the Fellowship, which is a "mostly self-governing expert body with a primary goal of representing humans who embody and contain the technical knowledge base of the Kusama and/or Polkadot networks and protocol," according to [Polkadot's wiki](https://wiki.polkadot.network/docs/learn-opengov#fellowship){target=_blank}.

根据[Polkadot的Wiki](https://wiki.polkadot.network/docs/learn-opengov#fellowship){target = _blank}表示，在波卡上，Governance v1的技术委员会将被Fellowship所取代。Fellowship是一个基本自治的专家机构，其主要目标是代表具有波卡和/或Kusama网络和协议的技术知识的成员。

For Moonbeam's implementation of OpenGov, instead of the Fellowship, there is a community OpenGov Technical Committee that has very similar power to that of the Fellowship. Their power in governance resides in their ability to whitelist a proposal. OpenGov Technical Committee members may only vote to whitelist a proposal if whitelisting that proposal would protect against a security vulnerability to the network. The passing threshold of the OpenGov Technical Committee members on whether to whitelist a proposal is determined by governance. As such, the OpenGov Technical Committee has very limited power over the network. Its purpose is to provide technical review of urgent security issues that are proposed by token holders.

对于Moonbeam的OpenGov实现，社区OpenGov技术委员会取代了Fellowship，其具有与Fellowship非常相似的权力。他们在治理方面有权力将提案加入白名单。如果提案在加入白名单后能够防止网络出现安全漏洞，OpenGov技术委员会成员可能只能为提案加入白名单进行投票。OpenGov技术委员会成员对于是否将提案列入白名单的通过门槛是由治理决定的。因此，OpenGov技术委员会对网络的权力非常有限。其目的是对Token持有人提出的紧急安全问题进行技术审查。

While still subject to governance, the idea behind the Whitelist track is that it will have different parameters to make it faster for proposals to pass. The Whitelist Track parameters, including approval, support, and voting, are determined by the Moonriver or Moonbeam token holders through governance and cannot be changed by the OpenGov Technical Committee.

虽然仍然受制于治理，但Whitelist track背后的想法是它将有不同的参数，以加快提案的通过速度。 Whitelist Track参数，包括批准、支持和投票，由Moonriver或Moonbeam的Token持有者通过治理决定，OpenGov技术委员会无权更改。

The OpenGov Technical Committee is made up of members of the community who have technical knowledge and expertise in Moonbeam-based networks. 

OpenGov技术委员会由拥有基于Moonbeam网络方面技术知识和专业知识的社区成员组成。

### Related Guides on Governance v2 - Governance v2相关指南 {: #try-it-out } 

For related guides on submitting and voting on referenda on Moonbeam with Governance v1, please check the following guides:

关于如何使用Governance v1在Moonbeam上提交公投和投票，请查看以下指南：

 - [How to Submit a Proposal](/tokens/governance/proposals/opengov-proposals){target=_blank}
 - [如何提交提案](/tokens/governance/proposals/opengov-proposals){target=_blank}
 - [How to Vote on a Proposal](/tokens/governance/voting/opengov-voting){target=_blank}
 - [如何对提案投票](/tokens/governance/voting/opengov-voting){target=_blank}
 - [Interact with the Preimages Precompiled Contract (Solidity Interface)](/builders/pallets-precompiles/precompiles/preimage/){target=_blank}
 - [如何与原像预编译合约（Solidity接口）交互](/builders/pallets-precompiles/precompiles/preimage/){target=_blank}
 - [Interact with the Referenda Precompiled Contract (Solidity Interface)](/builders/pallets-precompiles/precompiles/referenda/){target=_blank}
 - [如何与公投预编译合约（Solidity接口）交互](/builders/pallets-precompiles/precompiles/referenda/){target=_blank}
 - [Interact with the Conviction Voting Precompiled Contract (Solidity Interface)](/builders/pallets-precompiles/precompiles/conviction-voting/){target=_blank}
 - [如何与信念投票预编译合约（Solidity接口）交互](/builders/pallets-precompiles/precompiles/conviction-voting/){target=_blank}

## Governance v1 {: #governance-v1 }

While OpenGov is being tested on Moonriver, Moonbeam will continue to use governance v1. This section will cover everything you need to know about governance v1 on Moonbeam.

目前OpenGov在Moonriver上进行测试，Moonbeam将继续使用governance v1版本。此部分将涵盖Moonbeam上governance v1的所有信息。

### General Definitions 一般定义 {: #general-definitions } 

With great power comes great responsibility. Some important parameters to understand before engaging with Moonbeam's governance include:

权力越大，责任越大。在参与Moonbeam治理之前，请先了解一些重要参数：

 - **Proposals** — actions or items being proposed by token holders. There are two main ways that a proposal is created:
 - **提案 **— Token持有者提出的行动方案或事项。创建提案有两种主要方式：
    - **Democracy Proposal** - a proposal that is submitted by anyone in the community and will be open for endorsements from the token holders. The Democracy Proposal that has the highest amount of bonded support will be selected to be a referendum at the end of the Launch Period
    - **民主提案** - 由社区成员提交提案，并向所有Token持有者开放寻求其认可。获得最多Token数量支持的民主提案将在启动期结束时被选为公投
    - **External Proposal** - a proposal that is created by the Council and then, if accepted by the Council, is submitted for token holder voting. When the Council submits an External Proposal, the Council sets the Vote Tallying Metric
    - **外部提案** - 由理事会创建的提案，若由理事会接受，则提交给Token持有者进行投票。当理事会提交外部提案时，会设置投票计数指标
        - **Fast-tracked Proposal** - the Technical Committee may choose to fast-track an External Proposal which means changing the default parameters such as the Voting Period and Enactment Period. A fast-tracked referendum can be created alongside existing active referenda. That is to say, an emergency referendum does not replace the currently active referendum
        - **快速通道提案** —— 技术委员会可以选择快速处理外部提案，这意味着更改默认参数，例如投票期和生效等待期。快速处理的公投可以与现有的活跃共同一起创建。也就是说，紧急通透不会取代目前进行中的公投
- **Referendum** — a proposal that is up for token-holder voting. Each referendum is tied to a specific proposal for a change to the Moonbeam system including values for key parameters, code upgrades, or changes to the governance system itself
- **公投** — 由Token持有者投票的提案。每个公投与更改Moonbeam系统的指定提案相关联，包括关键参数的值、代码升级火治理系统本身的更改
- **Launch Period** — the time period before a Voting Period that publicly submitted proposals will gather endorsements
- **启动期** — 公开提交的提案将获得认可的投票期之前的时间段
- **Voting Period** — time token holders have to vote for a referendum (duration of a referendum)
- **投票期** —  Token持有者对提案进行公投的时期（一次公投的时间段）

--8<-- 'text/governance/vote-conviction-definitions.md'

- **Vote tallying metric** — there are three types of vote tallying metrics: (i) Positive Turnout Bias (Super-Majority Approve), (ii) Negative Turnout Bias (Super-Majority Against), or (iii) Simple Majority. See [Polkadot’s Wiki on Tallying](https://wiki.polkadot.network/docs/learn-governance#tallying){target=_blank} for more information about how these different vote tallying metrics work
- **投票计数指标** — 投票计数指标有三种：(i) 正投票率偏向（绝对多数投票通过），(ii) 负投票率偏向（绝对多数投票反对），(iii) 简单多数。获取关于这些投票计数指标运作模式的更多信息，请参考[波卡Wiki网页](https://wiki.polkadot.network/docs/learn-governance#tallying){target=_blank}
    - The vote tallying metric applied depends on the type of referendum: 
    - 投票计数指标的应用取决于公投的类型：
        - Democracy Proposals - [Positive Turnout Bias (Super-Majority Approve)](#positive-turnout-bias) tallying metric is applied
        - 民主提案 - 适用于[正投票率偏向（绝对多数投票通过）](#positive-turnout-bias)
        - External Proposals - the vote tallying metric is set by the Council
        - 外部提案 - 由理事会设置投票计数指标
- **Enactment Period** — time between a proposal being approved and enacted (make law). It is also the minimum period necessary to lock funds to propose an action
- **生效等待期** — 提案通过和正式生效（制定法律）之间的时间段。这也是锁定资金以正式执行所需的最短期限
- **Lock Period** — time (after the proposal enactment) that the tokens of the winning voters are locked. Users can still use these tokens for staking or voting. 
- **锁定期** — 提案生效之后，获胜投票者Token被锁定的时间。 用户仍然可以使用这些Token进行质押或投票
- **Cool-off Period** — duration a veto from the technical committee lasts before the proposal may be submitted again
- **冷静期** — 提案遭到技术委员会否决直至可以再次提交的持续时长
- **Delegation** — act of transferring your voting power to another account for up to a certain conviction
- **委托** — 将自己的投票权委托给其他账户，以积累一定信念值的行为

### Governance Parameters 治理参数 {: #governance-parameters }

The governance parameters on Moonbeam are as follows:

Moonbeam上的治理参数如下所示：

|                  Variable 变量                   |                           Value 值                           |
| :----------------------------------------------: | :----------------------------------------------------------: |
|               Launch Period 启动期               | {{ networks.moonbeam.democracy.launch_period.blocks}} blocks ({{ networks.moonbeam.democracy.launch_period.days}} days) |
|               Voting Period 投票期               | {{ networks.moonbeam.democracy.vote_period.blocks}} blocks ({{ networks.moonbeam.democracy.vote_period.days}} days) |
|           Enactment Period 生效等待期            | {{ networks.moonbeam.democracy.enact_period.blocks}} blocks ({{ networks.moonbeam.democracy.enact_period.days}} days) |
|              Cool-off Period 冷静期              | {{ networks.moonbeam.democracy.cool_period.blocks}} blocks ({{ networks.moonbeam.democracy.cool_period.days}} days) |
|       Preimage base deposit 原像基础保证金       |      {{ networks.moonbeam.preimage.base_deposit }} GLMR      |
|  Preimage deposit per byte 每个字节的原像保证金  |      {{ networks.moonbeam.preimage.byte_deposit }} GLMR      |
|           Proposal deposit 提案保证金            |      {{ networks.moonbeam.democracy.min_deposit }} GLMR      |
|            Maximum proposals 提案上限            |       {{ networks.moonbeam.democracy.max_proposals }}        |
| Maximum referenda (at a time)* 公投上限（单次）* |       {{ networks.moonbeam.democracy.max_referenda }}        |

**The maximum number of referenda at a time does not take fast-tracked referenda into consideration.* 

**单次最大公投数量不包括快速通道公投。* 

!!! note 注意事项
    The Voting Period and Enactment Period are subject to change for External Proposals.

外部提案的投票期和生效等待期可能会发生变化。

#### Conviction Multiplier 信念乘数 {: #conviction-multiplier }

The Conviction multiplier is related to the number of Enactment Periods the tokens will be locked for after the referenda is enacted (if approved). Consequently, the longer you are willing to lock your tokens, the stronger your vote will be weighted. You also have the option of not locking tokens at all, but vote weight is drastically reduced (tokens are still locked during the duration of the referendum).

信念乘数与公投通过批准后进入生效等待期的Token锁定期限数量有关。如果您愿意锁定Token的时间越长，则您的投票权重就越大。 您也可以选择不锁定Token，但投票权重会大大降低（在公投期间Token仍处于锁定状态）。

If you were to vote 1000 tokens with a 6x Conviction, your weighted vote would be 6000 units. That is, 1000 locked tokens multiplied by the Conviction, which in this scenario would be 6. On the other hand, if you decided you didn't want to have your tokens locked after enactment, you could vote your 1000 tokens with a 0.1x Conviction. In this case, your weighted vote would only be 100 units.

举例来说，如果您以6倍的信念投票1000个Token，您的投票权重将为6000。也就是说，1000个锁定的Token乘以信念（在本示例中为6倍）。但是如果您决定不在生效后锁定您的Token，您可以以0.1倍的信念进行投票。在这种情况下，您的投票权重为100。

The Conviction multiplier values for Moonbeam are:

每个网络的信念乘数如下所示：

=== "Moonbeam"
    | Lock Periods After Enactment 生效后的锁定期 | Conviction Multiplier 信念乘数 |                       Approx. Lock Time 预计锁定时间                        |
    |:----------------------------:|:---------------------:|:-------------------------------------------------------------:|
    |              0               |          0.1          |                             None                              |
    |              1               |           1           | {{networks.moonbeam.democracy.lock_period.conviction_1}}天 |
    |              2               |           2           | {{networks.moonbeam.democracy.lock_period.conviction_2}}天 |
    |              4               |           3           | {{networks.moonbeam.democracy.lock_period.conviction_3}}天 |
    |              8               |           4           | {{networks.moonbeam.democracy.lock_period.conviction_4}}天 |
    |              16              |           5           | {{networks.moonbeam.democracy.lock_period.conviction_5}}天 |
    |              32              |           6           | {{networks.moonbeam.democracy.lock_period.conviction_6}}天 |

!!! note 注意事项
    The lock time approximations are based upon regular {{ networks.moonbeam.block }}-second block times. Block production may vary and thus the displayed lock times should not be deemed exact.

预计锁定时间基于常规的{{ networks.moonbeam.block }}-秒区块时间。区块生产可能会有所不同，因此显示的锁定时间仅供参考。

### Roadmap of a Proposal 提案步骤 {: #roadmap-of-a-proposal } 

Before a proposal is submitted, the author of the proposal can submit their idea for their proposal to the designated Democracy Proposals section of the [Moonbeam Governance discussion forum](https://forum.moonbeam.foundation/c/governance/2){target=_blank} for feedback from the community for at least five days. From there, the author can make adjustments to the proposal based on the feedback they've collected.

在提交提案之前，提案的作者可以将其提案的想法提交到[Moonbeam治理论坛](https://forum.moonbeam.foundation/c/governance/2){target=_blank}的Democracy Proposals部分，以获得来自社区的至少五天的反馈。作者可以根据收集的反馈对提案进行调整。

When the proposal is ready to be submitted on-chain, a preimage for the proposal needs to be submitted on-chain. The preimage defines the action to be carried out. The submitter pays a fee-per-byte stored: the larger the preimage, the higher the fee. Once submitted, it returns a preimage hash.

当提案准备在链上提交时，需要先将提案原像提交至链上。原像定义要执行的操作。提交者按存储的每个字节支付费用：原像越大，费用越高。提交后，则会返回原像哈希。

The proposer can submit the proposal using the preimage hash, locking tokens in the process. Once the submission transaction is accepted, the proposal is listed publicly. So, you'll be able to view the proposal on [Polkassembly](https://moonbeam.polkassembly.network/){target=_blank}.

提议者可以使用原像哈希提交提案，并在此过程中锁定Token。 提交交易被接受后，提案就会被公开列出。从而，您能够在[Polkassembly](https://moonbeam.polkassembly.network/){target=_blank}上查看提案。

Once the proposal is listed, token holders can second the proposal (vouch for it) by locking the same amount of tokens the proposer locked. The most seconded proposal moves to public referendum. When this happens, the referendum will be listed on the [On-chain proposals page in Polkassembly](https://moonbeam.polkassembly.network/proposals){target=_blank}.

提案对外列出后，Token持有者可以通过锁定提议者锁定的相同数量的Token来支持提案（作为担保）。附议最多的提案将转向公投。 这种情况下，公投将列在[Polkassembly的链上提案页面](https://moonbeam.polkassembly.network/proposals){target=_blank}。

Once in referendum, token holders vote **Aye** or **Nay** on the proposal by locking tokens. Two factors account the vote weight: amount locked and locking period. If the proposal passes, it is enacted after a certain amount of time.

在公投中，Token持有者可以通过锁定Token为提案进行**赞成**或者**反对**的投票。有两个因素会影响投票权重：锁定的Token数量和锁定期限。如果提案生效，则会在一定时间后执行。

The happy path for a Democracy Proposal is shown in the following diagram:

下方图片显示了提案步骤：

![Proposal Roadmap](/images/learn/features/governance/proposal-roadmap.png)

### Rights of the Council and the Technical Committee 理事会和技术委员会的投票权利 {: #voting-rights-of-the-council-and-the-technical-committee }

The Council and Technical Committee are two collectives that have the following special voting rights:

理事会和技术委员会是两个团体，具有以下特殊投票权：

|        Collective 团体         | Can submit 可以提交<br>External Proposals 外部提案 | Can submit 可以提交<br>Fast-tracked Proposals 快速通道提案 | Can cancel malicious 可以取消<br>Democracy Proposals 恶意的民主提案 | Can veto 可以否决<br>External Proposals 外部提案 |
| :----------------------------: | :------------------------------------------------: | :--------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------: |
|         Council 理事会         |                         ✓                          |                             X                              |                              ✓                               |                        X                         |
| Technical Committee 技术委员会 |                         X                          |                             ✓                              |                              ✓                               |                        ✓                         |

Fast-tracked Proposals with a Voting Period of one day or more require one-half of the Technical Committee's approval. Fast-tracked Proposals with a Voting Period of less than a day are called "Instant Fast-tracked Proposals" and require three-fifths of the Technical Committee's approval.

投票期限为一天或更长时间的快速通道提案需要技术委员会二分之一的批准。 投票期少于一天的快速通道提案称为“即时快速通道提案”，需要技术委员会五分之三的批准。

As seen in the above table, the Technical Committee can veto an External Proposal. Any single member of the Technical Committee can veto the proposal only once, and only for the duration of the Cool-off Period.

如上述表格所示，技术委员会可以否决外部提案。技术委员会的任何成员只有一次否决提案的机会，并且只能在冷静期期间有效。

### Positive Turnout Bias 正投票率偏向 {: #positive-turnout-bias } 

Public referenda use a positive turnout bias metric, that is, a Super-Majority approval formula. The equation is the following:

公投使用正投票率偏向指标，即绝对多数投票通过的公式。 计算方式如下所示：

![Positive Turnout Bias](/images/tokens/governance/voting/vote-bias.png)

Where:

其中：

 - **Approve** — number of "Aye" votes (includes the Conviction multiplier)
 - **赞成** — “赞成”票的数量（包括信念乘数）
 - **Against** — number of "Nay" votes (includes the Conviction multiplier)
 - **反对** — “反对”票的数量（包括信念乘数）
 - **Turnout** — the total number of voting tokens (without including the Conviction multiplier)
 - **投票数** — 参与投票的Token总量（不包括信念乘数）
 - **Electorate** — the total number of tokens issued in the network
 - **总选票** — 网络发行的Token总量

In the previous example, these numbers were:

|   Variable 变量   |       Value 值        |
| :---------------: | :-------------------: |
|   Approve 赞成    |   10800 (1800 x 6)    |
|   Against 反对    |    80 (800 x 0.1)     |
|  Turnout 投票数   |   2600 (1800 + 800)   |
| Electorate 总选票 |         1.22M         |
|  **Result 结果**  | 1.5 < 9.8 (Aye wins!) |

In short, a heavy Super-Majority of "Aye" votes is required to approve a proposal at low turnouts, but as turnout increases, it becomes a simple majority.

简而言之，在投票数偏低的情况下，需要绝对多数“赞成”票才能批准提案，但随着投票数的增加，则会变成简单多数的形式。

### Related Guides on Governance v1 - Governance v1上的相关指南 {: #try-it-out } 

For related guides on submitting and voting on referenda on Moonbeam with Governance v1, please check the following guides:

关于如何使用Governance v1在Moonbeam上提交公投和投票，请查看以下指南：

 - [How to Submit a Proposal](/tokens/governance/proposals/proposals){target=_blank}
 - [如何提交提案](/tokens/governance/proposals/proposals){target=_blank}
 - [How to Vote on a Proposal](/tokens/governance/voting/voting){target=_blank}
 - [如何对提案投票](/tokens/governance/voting/voting){target=_blank}
 - [Interact with the Democracy Precompiled Contract (Solidity Interface)](/builders/pallets-precompiles/precompiles/democracy/){target=_blank}
 - [如何与民主预编译合约（Solidity接口）交互)](/builders/pallets-precompiles/precompiles/democracy/){target=_blank}

