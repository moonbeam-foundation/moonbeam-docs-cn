---
title: 治理
description: 作为波卡平行链，Moonbeam使用链上治理系统来允许公众进行质押权重投票。
---

# Moonbeam上的治理

## 概览 {: #introduction } 

Moonbeam治理机制的目标是根据社区意愿推进协议。在这个共同使命中，治理过程寻求包括所有Token持有者。关于协议的任何以及所有更改都必须通过公投，以便所有的Token持有者可以根据质押权重对决策提出建议。

如[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}和[Polkassembly](https://moonbeam.polkassembly.network/){target=_blank}的社区治理论坛将开放讨论，并允许根据社区建议完善提案。自主生效和[无分叉升级](https://wiki.polkadot.network/docs/learn-runtime-upgrades#forkless-upgrades/){target=_blank}将社区团结起来，共同完成推进协议的使命。

随着波卡治理的第二个阶段OpenGov（初始定义为Gov2）的推出，对治理流程进行了几个修改。关于OpenGov所有修改的详细内容，请参考[OpenGov：什么是Polkadot Gov2](https://moonbeam.network/blog/opengov/){target=_blank}。**OpenGov现已上线Moonriver，经过严密测试后，将提出上线Moonbeam的提案。**截至目前为止，Moonbeam仍在使用Governance v1版本。

## 原则 {: #principles } 

参与Moonbeam治理流程的“基本”原则包括：

 - 对希望参与Moonbeam网络的和受到治理决策影响的Token持有者持开放包容的态度
 - 即使与Moonbeam意见相左，仍需支持Token持有者的参与
 - 承诺决策过程中的公开透明
 - 以生态利益为先，个人利益为后
 - 始终以道德作为行事的出发点
 - 与其他Token持有者的互动中始终保持耐心和慷慨的心态，但不代表容忍辱骂性或破坏性的语言、行动和行为，并遵守[Moonbeam的行为准则](https://github.com/moonbeam-foundation/code-of-conduct){target=_blank}

以上原则很大程度上受到Vlad Zamfir先生关于区块链治理的著作的启发。如需了解更多详情，请参阅他撰写的文章，尤其是[如何以诚信（和礼貌）的方式参与区块链治理](https://medium.com/@Vlad_Zamfir/how-to-participate-in-blockchain-governance-in-good-faith-and-with-good-manners-bd4e16846434){target=blank}这篇Medium文章。

## 链上治理机制 {: #on-chain-governance-mechanics } 

Moonbeam的“硬性”治理流程将由链上流程驱动，该方式能够确保与Moonbeam网络相关的关键决策由多数Token作出。这些决策将以提案公投的形式出现，并根据投票权重得出投票结果。

这一治理机制的主要组成部分包括：

 - **公投** — 基于质押量的投票计划，每次公投均与更改Moonbeam系统的特定提案相关，包括关键参数值、代码升级或治理系统本身的修改
 - **投票** — 公投将由Token持有者以质押量权重为基础进行投票。通过的公投将会延迟生效，以便有不同意决策的Token持有者有时间退出网络
 - **Governance V1理事会 & 技术委员会** — 一个由社区成员组成的团体，成员在系统中拥有特殊投票权
 - **OpenGov技术委员会** — 一个由社区成员组成的团体，成员可以将特定提案列入Whitelisted Track中

更多关于Substrate框架pallet如何实施链上治理的细节，请查阅[波卡治理概览](https://polkadot.network/a-walkthrough-of-polkadots-governance/){target=blank}博客文章以及[波卡治理Wiki](https://wiki.polkadot.network/docs/learn-governance){target=blank}。

## Governance v2: OpenGov {: #opengov }

此部分将涵盖您需要了解的关于Moonriver和Moonbase Alpha上OpenGov的所有信息。关于Moonbeam的治理相关信息，请参考[Goveranance v1](#governance-v1)部分。

### 一般定义 {: #general-definitions-gov2 }

--8<-- 'text/governance/proposal-definitions.md'

--8<-- 'text/governance/preimage-definitions.md'

 - **Origin** - 基于授权的调度来源，用于决定公投发布的Track

 - **Track** - 概述提案生命周期的特定于Origin的管道。目前，有五个Track：

    |    Origin Track     |                 描述                 |                       公投示例                        |
    |:-------------------:|:------------------------------------:|:-----------------------------------------------------:|
    |        Root         |           最高优先级的提案           |              Runtime更新、技术委员会管理              |
    |     Whitelisted     | 在发送前由技术委员会列入白名单的提案 |                     快速处理操作                      |
    |    General Admin    |           用于基本链上决策           | XCM费用、Orbiter计划、平行链质押参数、registrar的更新 |
    | Emergency Canceller |       用于取消公投。保证金退还       |                      错误的公投                       |
    |  Emergency Killer   |     用于处理不良公投。保证金没收     |                       不良公投                        |

--8<-- 'text/governance/vote-conviction-definitions.md'

--8<-- 'text/governance/approval-support-definitions.md'

--8<-- 'text/governance/lead-in-definitions.md'
    请参考[治理参数](#governance-parameters-v2)部分获取更多信息

 - **决定期** - Token持有者继续在公投上进行投票。如果公投在期限结束时未通过，则提案会被拒绝，决定保证金将被退还
 - **确认期** - 决定期内的一段时间，在此期间公投需要获得足够的批准和支持数量才能进入生效等待期
 - **生效等待期** - 一段指定的时间，它是在提案创建时定义的，是已批准的公投在发送之前的等待时间。每个Track有一个最短等待期限

--8<-- 'text/governance/delegation-definitions.md'

### 治理参数 {: #governance-parameters-v2 }

=== "Moonriver"
    |         变量         |                             值                              |
    |:--------------------:|:-----------------------------------------------------------:|
    |    原像基础保证金    |     {{ networks.moonriver.preimage.base_deposit }} MOVR     |
    | 每个字节的原像保证金 |     {{ networks.moonriver.preimage.byte_deposit }} MOVR     |
    |    提案提交保证金    | {{ networks.moonriver.governance.submission_deposit }} MOVR |

=== "Moonbase Alpha"
    |         变量         |                            值                             |
    |:--------------------:|:---------------------------------------------------------:|
    |    原像基础保证金    |     {{ networks.moonbase.preimage.base_deposit }} DEV     |
    | 每个字节的原像保证金 |     {{ networks.moonbase.preimage.byte_deposit }} DEV     |
    |    提案提交保证金    | {{ networks.moonbase.governance.submission_deposit }} DEV |

#### Track的基本参数 {: #general-parameters-by-track }

=== "Moonriver"
    |         Track          | Track ID |                                      容量                                       |                                 决定<br>保证金                                 |
    |:----------------------:|:--------:|:-------------------------------------------------------------------------------:|:------------------------------------------------------------------------------:|
    |          Root          |    0     |     {{ networks.moonriver.governance.tracks.root.max_deciding }} proposals      |     {{ networks.moonriver.governance.tracks.root.decision_deposit }} MOVR      |
    |      Whitelisted       |    1     |  {{ networks.moonriver.governance.tracks.whitelisted.max_deciding }} proposals  |  {{ networks.moonriver.governance.tracks.whitelisted.decision_deposit }} MOVR  |
    |     General Admin      |    2     | {{ networks.moonriver.governance.tracks.general_admin.max_deciding }} proposals | {{ networks.moonriver.governance.tracks.general_admin.decision_deposit }} MOVR |
    | Emergency<br>Canceller |    3     |   {{ networks.moonriver.governance.tracks.canceller.max_deciding }} proposals   |   {{ networks.moonriver.governance.tracks.canceller.decision_deposit }} MOVR   |
    |  Emergency<br>Killer   |    4     |    {{ networks.moonriver.governance.tracks.killer.max_deciding }} proposals     |    {{ networks.moonriver.governance.tracks.killer.decision_deposit }} MOVR     |

=== "Moonbase Alpha"
    |         Track          | Track ID |                                      容量                                      |                                决定<br>保证金                                |
    |:----------------------:|:--------:|:------------------------------------------------------------------------------:|:----------------------------------------------------------------------------:|
    |          Root          |    0     |     {{ networks.moonbase.governance.tracks.root.max_deciding }} proposals      |     {{ networks.moonbase.governance.tracks.root.decision_deposit }} DEV      |
    |      Whitelisted       |    1     |  {{ networks.moonbase.governance.tracks.whitelisted.max_deciding }} proposals  |  {{ networks.moonbase.governance.tracks.whitelisted.decision_deposit }} DEV  |
    |     General Admin      |    2     | {{ networks.moonbase.governance.tracks.general_admin.max_deciding }} proposals | {{ networks.moonbase.governance.tracks.general_admin.decision_deposit }} DEV |
    | Emergency<br>Canceller |    3     |   {{ networks.moonbase.governance.tracks.canceller.max_deciding }} proposals   |   {{ networks.moonbase.governance.tracks.canceller.decision_deposit }} DEV   |
    |  Emergency<br>Killer   |    4     |    {{ networks.moonbase.governance.tracks.killer.max_deciding }} proposals     |    {{ networks.moonbase.governance.tracks.killer.decision_deposit }} DEV     |

#### Track的时间期限参数 {: #period-parameters-by-track }

=== "Moonriver"
    |         Track          |                                                                                  准备期                                                                                  |                                                                                   决定期                                                                                   |                                                                                  确认期                                                                                  |                                                                                    最短生效等待期                                                                                    |
    |:----------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Root          |          {{ networks.moonriver.governance.tracks.root.prepare_period.blocks }} blocks <br>({{ networks.moonriver.governance.tracks.root.prepare_period.time }})          |          {{ networks.moonriver.governance.tracks.root.decision_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.root.decision_period.time }})          |          {{ networks.moonriver.governance.tracks.root.confirm_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.root.confirm_period.time }})          |          {{ networks.moonriver.governance.tracks.root.min_enactment_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.root.min_enactment_period.time }})          |
    |      Whitelisted       |   {{ networks.moonriver.governance.tracks.whitelisted.prepare_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.whitelisted.prepare_period.time }})   |   {{ networks.moonriver.governance.tracks.whitelisted.decision_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.whitelisted.decision_period.time }})   |   {{ networks.moonriver.governance.tracks.whitelisted.confirm_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.whitelisted.confirm_period.time }})   |   {{ networks.moonriver.governance.tracks.whitelisted.min_enactment_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.whitelisted.min_enactment_period.time }})   |
    |     General Admin      | {{ networks.moonriver.governance.tracks.general_admin.prepare_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.general_admin.prepare_period.time }}) | {{ networks.moonriver.governance.tracks.general_admin.decision_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.general_admin.decision_period.time }}) | {{ networks.moonriver.governance.tracks.general_admin.confirm_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.general_admin.confirm_period.time }}) | {{ networks.moonriver.governance.tracks.general_admin.min_enactment_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.general_admin.min_enactment_period.time }}) |
    | Emergency<br>Canceller |     {{ networks.moonriver.governance.tracks.canceller.prepare_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.canceller.prepare_period.time }})     |     {{ networks.moonriver.governance.tracks.canceller.decision_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.canceller.decision_period.time }})     |     {{ networks.moonriver.governance.tracks.canceller.confirm_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.canceller.confirm_period.time }})     |     {{ networks.moonriver.governance.tracks.canceller.min_enactment_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.canceller.min_enactment_period.time }})     |
    |  Emergency<br>Killer   |        {{ networks.moonriver.governance.tracks.killer.prepare_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.killer.prepare_period.time }})        |        {{ networks.moonriver.governance.tracks.killer.decision_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.killer.decision_period.time }})        |        {{ networks.moonriver.governance.tracks.killer.confirm_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.killer.confirm_period.time }})        |        {{ networks.moonriver.governance.tracks.killer.min_enactment_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.killer.min_enactment_period.time }})        |

=== "Moonbase Alpha"
    |         Track          |                                                                                 准备期                                                                                 |                                                                                  决定期                                                                                  |                                                                                 确认期                                                                                 |                                                                                   最短生效等待期                                                                                   |
    |:----------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Root          |          {{ networks.moonbase.governance.tracks.root.prepare_period.blocks }} blocks <br>({{ networks.moonbase.governance.tracks.root.prepare_period.time }})          |          {{ networks.moonbase.governance.tracks.root.decision_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.root.decision_period.time }})          |          {{ networks.moonbase.governance.tracks.root.confirm_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.root.confirm_period.time }})          |          {{ networks.moonbase.governance.tracks.root.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.root.min_enactment_period.time }})          |
    |      Whitelisted       |   {{ networks.moonbase.governance.tracks.whitelisted.prepare_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.whitelisted.prepare_period.time }})   |   {{ networks.moonbase.governance.tracks.whitelisted.decision_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.whitelisted.decision_period.time }})   |   {{ networks.moonbase.governance.tracks.whitelisted.confirm_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.whitelisted.confirm_period.time }})   |   {{ networks.moonbase.governance.tracks.whitelisted.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.whitelisted.min_enactment_period.time }})   |
    |     General Admin      | {{ networks.moonbase.governance.tracks.general_admin.prepare_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.general_admin.prepare_period.time }}) | {{ networks.moonbase.governance.tracks.general_admin.decision_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.general_admin.decision_period.time }}) | {{ networks.moonbase.governance.tracks.general_admin.confirm_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.general_admin.confirm_period.time }}) | {{ networks.moonbase.governance.tracks.general_admin.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.general_admin.min_enactment_period.time }}) |
    | Emergency<br>Canceller |     {{ networks.moonbase.governance.tracks.canceller.prepare_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.canceller.prepare_period.time }})     |     {{ networks.moonbase.governance.tracks.canceller.decision_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.canceller.decision_period.time }})     |     {{ networks.moonbase.governance.tracks.canceller.confirm_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.canceller.confirm_period.time }})     |     {{ networks.moonbase.governance.tracks.canceller.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.canceller.min_enactment_period.time }})     |
    |  Emergency<br>Killer   |        {{ networks.moonbase.governance.tracks.killer.prepare_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.killer.prepare_period.time }})        |        {{ networks.moonbase.governance.tracks.killer.decision_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.killer.decision_period.time }})        |        {{ networks.moonbase.governance.tracks.killer.confirm_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.killer.confirm_period.time }})        |        {{ networks.moonbase.governance.tracks.killer.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.killer.min_enactment_period.time }})        |

#### Track的支持和批准参数 {: #support-and-approval-parameters-by-track }

=== "Moonriver"
    |         Track          |  批准曲线  |                                                                                                                                                                                                                                           批准参数                                                                                                                                                                                                                                           |  支持曲线  |                                                                                                                                                                                                                                        支持参数                                                                                                                                                                                                                                        |
    |:----------------------:|:----------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Root          | Reciprocal |                            {{ networks.moonriver.governance.tracks.root.min_approval.time0 }}: {{ networks.moonriver.governance.tracks.root.min_approval.percent0 }}%<br>{{ networks.moonriver.governance.tracks.root.min_approval.time1 }}: {{ networks.moonriver.governance.tracks.root.min_approval.percent1 }}%<br>{{ networks.moonriver.governance.tracks.root.min_approval.time2 }}: {{ networks.moonriver.governance.tracks.root.min_approval.percent2 }}%                            |   Linear   |                                                                                                  {{ networks.moonriver.governance.tracks.root.min_support.time0 }}: {{ networks.moonriver.governance.tracks.root.min_support.percent0 }}%<br>{{ networks.moonriver.governance.tracks.root.min_support.time1 }}: {{ networks.moonriver.governance.tracks.root.min_support.percent1 }}%                                                                                                  |
    |      Whitelisted       | Reciprocal |       {{ networks.moonriver.governance.tracks.whitelisted.min_approval.time0 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_approval.percent0 }}%<br>{{ networks.moonriver.governance.tracks.whitelisted.min_approval.time1 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_approval.percent1 }}%<br>{{ networks.moonriver.governance.tracks.whitelisted.min_approval.time2 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_approval.percent2 }}%       | Reciprocal |       {{ networks.moonriver.governance.tracks.whitelisted.min_support.time0 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_support.percent0 }}%<br>{{ networks.moonriver.governance.tracks.whitelisted.min_support.time1 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_support.percent1 }}%<br>{{ networks.moonriver.governance.tracks.whitelisted.min_support.time2 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_support.percent2 }}%       |
    |     General Admin      | Reciprocal | {{ networks.moonriver.governance.tracks.general_admin.min_approval.time0 }}: {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent0 }}%<br>{{ networks.moonriver.governance.tracks.general_admin.min_approval.time1 }}: {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent1 }}%<br>{{ networks.moonriver.governance.tracks.general_admin.min_approval.time2 }}: {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent2 }}% | Reciprocal | {{ networks.moonriver.governance.tracks.general_admin.min_support.time0 }}: {{ networks.moonriver.governance.tracks.general_admin.min_support.percent0 }}%<br>{{ networks.moonriver.governance.tracks.general_admin.min_support.time1 }}: {{ networks.moonriver.governance.tracks.general_admin.min_support.percent1 }}%<br>{{ networks.moonriver.governance.tracks.general_admin.min_support.time2 }}: {{ networks.moonriver.governance.tracks.general_admin.min_support.percent2 }}% |
    | Emergency<br>Canceller | Reciprocal |             {{ networks.moonriver.governance.tracks.canceller.min_approval.time0 }}: {{ networks.moonriver.governance.tracks.canceller.min_approval.percent0 }}%<br>{{ networks.moonriver.governance.tracks.canceller.min_approval.time1 }}: {{ networks.moonriver.governance.tracks.canceller.min_approval.percent1 }}%<br>{{ networks.moonriver.governance.tracks.canceller.min_approval.time2 }}: {{ networks.moonriver.governance.tracks.canceller.min_approval.percent2 }}%             | Reciprocal |             {{ networks.moonriver.governance.tracks.canceller.min_support.time0 }}: {{ networks.moonriver.governance.tracks.canceller.min_support.percent0 }}%<br>{{ networks.moonriver.governance.tracks.canceller.min_support.time1 }}: {{ networks.moonriver.governance.tracks.canceller.min_support.percent1 }}%<br>{{ networks.moonriver.governance.tracks.canceller.min_support.time2 }}: {{ networks.moonriver.governance.tracks.canceller.min_support.percent2 }}%             |
    |  Emergency<br>Killer   | Reciprocal |                      {{ networks.moonriver.governance.tracks.killer.min_approval.time0 }}: {{ networks.moonriver.governance.tracks.killer.min_approval.percent0 }}%<br>{{ networks.moonriver.governance.tracks.killer.min_approval.time1 }}: {{ networks.moonriver.governance.tracks.killer.min_approval.percent1 }}%<br>{{ networks.moonriver.governance.tracks.killer.min_approval.time2 }}: {{ networks.moonriver.governance.tracks.killer.min_approval.percent2 }}%                      | Reciprocal |                      {{ networks.moonriver.governance.tracks.killer.min_support.time0 }}: {{ networks.moonriver.governance.tracks.killer.min_support.percent0 }}%<br>{{ networks.moonriver.governance.tracks.killer.min_support.time1 }}: {{ networks.moonriver.governance.tracks.killer.min_support.percent1 }}%<br>{{ networks.moonriver.governance.tracks.killer.min_support.time2 }}: {{ networks.moonriver.governance.tracks.killer.min_support.percent2 }}%                      |

=== "Moonbase Alpha"
    |         Track          |  批准曲线  |                                                                                                                                                                                                                                        批准参数                                                                                                                                                                                                                                        |  支持曲线  |                                                                                                                                                                                                                                     支持参数                                                                                                                                                                                                                                     |
    |:----------------------:|:----------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Root          | Reciprocal |                            {{ networks.moonbase.governance.tracks.root.min_approval.time0 }}: {{ networks.moonbase.governance.tracks.root.min_approval.percent0 }}%<br>{{ networks.moonbase.governance.tracks.root.min_approval.time1 }}: {{ networks.moonbase.governance.tracks.root.min_approval.percent1 }}%<br>{{ networks.moonbase.governance.tracks.root.min_approval.time2 }}: {{ networks.moonbase.governance.tracks.root.min_approval.percent2 }}%                            |   Linear   |                                                                                                 {{ networks.moonbase.governance.tracks.root.min_support.time0 }}: {{ networks.moonbase.governance.tracks.root.min_support.percent0 }}%<br>{{ networks.moonbase.governance.tracks.root.min_support.time1 }}: {{ networks.moonbase.governance.tracks.root.min_support.percent1 }}%                                                                                                 |
    |      Whitelisted       | Reciprocal |       {{ networks.moonbase.governance.tracks.whitelisted.min_approval.time0 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_approval.percent0 }}%<br>{{ networks.moonbase.governance.tracks.whitelisted.min_approval.time1 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_approval.percent1 }}%<br>{{ networks.moonbase.governance.tracks.whitelisted.min_approval.time2 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_approval.percent2 }}%       | Reciprocal |       {{ networks.moonbase.governance.tracks.whitelisted.min_support.time0 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_support.percent0 }}%<br>{{ networks.moonbase.governance.tracks.whitelisted.min_support.time1 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_support.percent1 }}%<br>{{ networks.moonbase.governance.tracks.whitelisted.min_support.time2 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_support.percent2 }}%       |
    |     General Admin      | Reciprocal | {{ networks.moonbase.governance.tracks.general_admin.min_approval.time0 }}: {{ networks.moonbase.governance.tracks.general_admin.min_approval.percent0 }}%<br>{{ networks.moonbase.governance.tracks.general_admin.min_approval.time1 }}: {{ networks.moonbase.governance.tracks.general_admin.min_approval.percent1 }}%<br>{{ networks.moonbase.governance.tracks.general_admin.min_approval.time2 }}: {{ networks.moonbase.governance.tracks.general_admin.min_approval.percent2 }}% | Reciprocal | {{ networks.moonbase.governance.tracks.general_admin.min_support.time0 }}: {{ networks.moonbase.governance.tracks.general_admin.min_support.percent0 }}%<br>{{ networks.moonbase.governance.tracks.general_admin.min_support.time1 }}: {{ networks.moonbase.governance.tracks.general_admin.min_support.percent1 }}%<br>{{ networks.moonbase.governance.tracks.general_admin.min_support.time2 }}: {{ networks.moonbase.governance.tracks.general_admin.min_support.percent2 }}% |
    | Emergency<br>Canceller | Reciprocal |             {{ networks.moonbase.governance.tracks.canceller.min_approval.time0 }}: {{ networks.moonbase.governance.tracks.canceller.min_approval.percent0 }}%<br>{{ networks.moonbase.governance.tracks.canceller.min_approval.time1 }}: {{ networks.moonbase.governance.tracks.canceller.min_approval.percent1 }}%<br>{{ networks.moonbase.governance.tracks.canceller.min_approval.time2 }}: {{ networks.moonbase.governance.tracks.canceller.min_approval.percent2 }}%             | Reciprocal |             {{ networks.moonbase.governance.tracks.canceller.min_support.time0 }}: {{ networks.moonbase.governance.tracks.canceller.min_support.percent0 }}%<br>{{ networks.moonbase.governance.tracks.canceller.min_support.time1 }}: {{ networks.moonbase.governance.tracks.canceller.min_support.percent1 }}%<br>{{ networks.moonbase.governance.tracks.canceller.min_support.time2 }}: {{ networks.moonbase.governance.tracks.canceller.min_support.percent2 }}%             |
    |  Emergency<br>Killer   | Reciprocal |                      {{ networks.moonbase.governance.tracks.killer.min_approval.time0 }}: {{ networks.moonbase.governance.tracks.killer.min_approval.percent0 }}%<br>{{ networks.moonbase.governance.tracks.killer.min_approval.time1 }}: {{ networks.moonbase.governance.tracks.killer.min_approval.percent1 }}%<br>{{ networks.moonbase.governance.tracks.killer.min_approval.time2 }}: {{ networks.moonbase.governance.tracks.killer.min_approval.percent2 }}%                      | Reciprocal |                      {{ networks.moonbase.governance.tracks.killer.min_support.time0 }}: {{ networks.moonbase.governance.tracks.killer.min_support.percent0 }}%<br>{{ networks.moonbase.governance.tracks.killer.min_support.time1 }}: {{ networks.moonbase.governance.tracks.killer.min_support.percent1 }}%<br>{{ networks.moonbase.governance.tracks.killer.min_support.time2 }}: {{ networks.moonbase.governance.tracks.killer.min_support.percent2 }}%                      |

#### 信念乘数 {: #conviction-multiplier-v2 }

信念乘数与公投通过批准后进入生效等待期的Token锁定期限数量有关。如果您愿意锁定Token的时间越长，则您的投票权重就越大。 您也可以选择不锁定Token，但投票权重会大大降低（在公投期间Token仍处于锁定状态）。

举例来说，如果您以6倍的信念投票1000个Token，您的投票权重将为6000。也就是说，1000个锁定的Token乘以信念（在本示例中为6倍）。但是如果您决定不在生效后锁定您的Token，您可以以0.1倍的信念进行投票。在这种情况下，您的投票权重为100。

每个网络的信念乘数如下所示：

=== "Moonriver"
    | 生效后的锁定期 | 信念乘数 |                          预计锁定时间                           |
    |:--------------:|:--------:|:---------------------------------------------------------------:|
    |       0        |   0.1    |                              None                               |
    |       1        |    1     | {{networks.moonriver.conviction.lock_period.conviction_1}} day  |
    |       2        |    2     | {{networks.moonriver.conviction.lock_period.conviction_2}} days |
    |       4        |    3     | {{networks.moonriver.conviction.lock_period.conviction_3}} days |
    |       8        |    4     | {{networks.moonriver.conviction.lock_period.conviction_4}} days |
    |       16       |    5     | {{networks.moonriver.conviction.lock_period.conviction_5}} days |
    |       32       |    6     | {{networks.moonriver.conviction.lock_period.conviction_6}} days |

=== "Moonbase Alpha"
    | 生效后的锁定期 | 信念乘数 |                          预计锁定时间                          |
    |:--------------:|:--------:|:--------------------------------------------------------------:|
    |       0        |   0.1    |                              None                              |
    |       1        |    1     | {{networks.moonbase.conviction.lock_period.conviction_1}} day  |
    |       2        |    2     | {{networks.moonbase.conviction.lock_period.conviction_2}} days |
    |       4        |    3     | {{networks.moonbase.conviction.lock_period.conviction_3}} days |
    |       8        |    4     | {{networks.moonbase.conviction.lock_period.conviction_4}} days |
    |       16       |    5     | {{networks.moonbase.conviction.lock_period.conviction_5}} days |
    |       32       |    6     | {{networks.moonbase.conviction.lock_period.conviction_6}} days |

!!! 注意事项
    预计锁定时间基于常规的{{ networks.moonriver.block_time }}秒区块时间。区块生产可能会有所不同，因此显示的锁定时间仅供参考。

### 提案步骤 {: #roadmap-of-a-proposal-v2 } 

在提交提案之前，提案的作者可以将其提案的想法提交到[Moonbeam治理论坛](https://forum.moonbeam.foundation/c/governance/2){target=_blank}的Democracy Proposals部分，以获得来自社区的至少五天的反馈。作者可以根据收集的反馈对提案进行调整。

作者准备完毕后，便可以在链上提交提案。首先，需要提交提案原像。提交者必须绑定一笔费用以在链上存储原像。提交者取消注释原像后该保证金将被退还。接下来，提交者可以提交真实的提案并支付提交保证金，确保能够支付提案的链上存储费用。然后，将进入带入期，社区可以通过锁定Token为提案进行“赞成”或“反对”的投票。为了让公投从带入期进入决定期必须满足以下条件：

- 公投必须等待准备期的持续时间，以便在进入下一阶段之前有足够的时间讨论提案
- 所选的Track类型中有足够的容量
- 完成符合Track类型最低要求的决定保证金

如果公投满足以上条件，将会进入决定期并占据指定Track类别的其中一个位置。在决定期，投票将持续进行，公投设置了一定的天数来达到所需的批准和支持要求才能进入确认期。

当进入确认期后，公投必须在此期间持续满足批准和支持要求。如果公投未达到要求，则返回到决定期。如果在决定期还剩下足够的时间，并且公投再次满足批准和支持要求，则可以再次进入到确认期，决定期将会延迟到确认期结束。如果决定期结束，但未获得足够的批准和支持，则公投将被拒绝，决定保证金将被退还。该提议可以在任何时候再次提出。

如果公投在确认期继续获得足够的批准和支持，则会被批准并进入生效等待期。在正式被发送之前，将在生效等待期等待。

下方图片显示了提案步骤：

![A happy path diagram of the proposal roadmap in OpenGov.](/images/learn/features/governance/v2/proposal-roadmap.png)

### 提案示例流程 {: #proposal-example-walkthrough }

在Moonriver上的General Admin Track提交的提案（及其原像）将具有以下特征：

 - 批准曲线从第{{ networks.moonriver.governance.tracks.general_admin.min_approval.time0 }}天的{{ networks.moonriver.governance.tracks.general_admin.min_approval.percent0 }}%开始，在第{{ networks.moonriver.governance.tracks.general_admin.min_approval.time1 }}天达到{{ networks.moonriver.governance.tracks.general_admin.min_approval.percent1 }}%
 - 支持曲线从第{{ networks.moonriver.governance.tracks.general_admin.min_support.time0 }}天的{{ networks.moonriver.governance.tracks.general_admin.min_support.percent0 }}%开始，在第{{ networks.moonriver.governance.tracks.general_admin.min_support.time1 }}天达到{{ networks.moonriver.governance.tracks.general_admin.min_support.percent1 }}%
 - 公投以0%的“赞成”票开始决定期（带入期不开放投票）
 - Token持有者开始投票并在第{{ networks.moonriver.governance.tracks.general_admin.min_approval.time1 }}天将批准率增加到{{ networks.moonriver.governance.tracks.general_admin.min_approval.percent1 }}%以上
 - 如果批准和支持在确认期（{{ networks.moonriver.governance.tracks.general_admin.confirm_period.blocks }}区块，约为{{ networks.moonriver.governance.tracks.general_admin.confirm_period.time }}天）达到数量要求，则公投会被批准
 - 如果在决定期未达到批准和支持数量要求，则该提案将被拒绝。请注意，必须在确认期达到此数值。 因此，如果该提案满足要求但在确认期完成之前决定期已经到期，则该提案将被拒绝

批准和支持的比例可以使用以下方式计算：

=== "Approval"
    ```
    Approval = 100 * ( Total Conviction-weighted "Aye" votes / Total Conviction-weighted votes ) 
    ```

=== "Support"
    ```
    Support = 100 * ( Total non-Conviction-weighted votes / Total supply )
    ```

### 提案取消 {: #proposal-cancellations }

如果发现已经进入投票阶段的提案有问题，则需要阻止该提案通过。这些实例可能涉及恶意活动或由于近期的网络升级而无法实施更改的技术问题。

取消公投需要通过网络投票才可执行。取消提案的流程会比普通提案更快，因为该提案必须在生效之前快速决定，但遵循与其他公投相同的过程。目前有两种Cancellation Origins，Emergency Canceller用于处理包含不可预见问题的公投，Emergency Killer用于处理蓄意损害网络的不良公投。这两个Track降低了通过门槛，因此带入期较短，批准和支持要求也偏低。

Emergency Canceller的track会导致提案被拒绝，决定保证金被退回。而Emergency Killer的track会导致提案被取消，保证金被没收，即决定保证金被销毁。

### OpenGov技术委员会的权力 {: #rights-of-the-opengov-technical-committee }

根据[Polkadot的Wiki](https://wiki.polkadot.network/docs/learn-opengov#fellowship){target = _blank}表示，在波卡上，Governance v1的技术委员会将被Fellowship所取代。Fellowship是一个基本自治的专家机构，其主要目标是代表具有波卡和/或Kusama网络和协议的技术知识的成员。

对于Moonbeam的OpenGov实现，社区OpenGov技术委员会取代了Fellowship，其具有与Fellowship非常相似的权力。他们在治理方面有权力将提案加入白名单。如果提案在加入白名单后能够防止网络出现安全漏洞，OpenGov技术委员会成员可能只能为提案加入白名单进行投票。OpenGov技术委员会成员对于是否将提案列入白名单的通过门槛是由治理决定的。因此，OpenGov技术委员会对网络的权力非常有限。其目的是对Token持有人提出的紧急安全问题进行技术审查。

虽然仍然受制于治理，但Whitelist track背后的想法是它将有不同的参数，以加快提案的通过速度。 Whitelist Track参数，包括批准、支持和投票，由Moonriver或Moonbeam的Token持有者通过治理决定，OpenGov技术委员会无权更改。

OpenGov技术委员会由拥有基于Moonbeam网络方面技术知识和专业知识的社区成员组成。

### Governance v2相关指南 {: #try-it-out } 

关于如何使用Governance v2在Moonbeam上提交公投和投票，请查看以下指南：

 - [如何提交提案](/tokens/governance/proposals/opengov-proposals){target=_blank}
 - [如何对提案投票](/tokens/governance/voting/opengov-voting){target=_blank}
 - [如何与原像预编译合约（Solidity接口）交互](/builders/pallets-precompiles/precompiles/preimage/){target=_blank}
 - [如何与公投预编译合约（Solidity接口）交互](/builders/pallets-precompiles/precompiles/referenda/){target=_blank}
 - [如何与信念投票预编译合约（Solidity接口）交互](/builders/pallets-precompiles/precompiles/conviction-voting/){target=_blank}

## Governance v1 {: #governance-v1 }

目前OpenGov在Moonriver上进行测试，Moonbeam将继续使用governance v1版本。此部分将涵盖Moonbeam上governance v1的所有信息。

### 一般定义 {: #general-definitions } 

权力越大，责任越大。在参与Moonbeam治理之前，请先了解一些重要参数：

 - **提案 **— Token持有者提出的行动方案或事项。创建提案有两种主要方式：
    - **民主提案** - 由社区成员提交提案，并向所有Token持有者开放寻求其认可。获得最多Token数量支持的民主提案将在启动期结束时被选为公投
    - **外部提案** - 由理事会创建的提案，若由理事会接受，则提交给Token持有者进行投票。当理事会提交外部提案时，会设置投票计数指标
        - **快速通道提案** —— 技术委员会可以选择快速处理外部提案，这意味着更改默认参数，例如投票期和生效等待期。快速处理的公投可以与现有的活跃公投一起创建。也就是说，紧急公投不会取代目前进行中的公投
- **公投** — 由Token持有者投票的提案。每个公投与更改Moonbeam系统的特定提案相关联，包括关键参数的值、代码升级或治理系统本身的更改
- **启动期** — 公开提交的提案将收集背书的投票期之前的时间段
- **投票期** —  Token持有者对提案进行公投的时期（一次公投的时间段）

--8<-- 'text/governance/vote-conviction-definitions.md'

- **投票计数指标** — 投票计数指标有三种：(i) 正投票率偏向（绝对多数投票通过），(ii) 负投票率偏向（绝对多数投票反对），(iii) 简单多数。获取关于这些不同的投票计数指标运作模式的更多信息，请参考[波卡关于计票的Wiki网页](https://wiki.polkadot.network/docs/learn-governance#tallying){target=_blank}
    - 投票计数指标的应用取决于公投的类型：
        - 民主提案 - 应用[正投票率偏向（绝对多数投票通过）](#positive-turnout-bias)投票计数指标
        - 外部提案 - 由理事会设置投票计数指标
- **生效等待期** — 提案通过和正式生效（制定法律）之间的时间段。这也是锁定资金以正式执行所需的最短期限
- **锁定期** — 提案生效之后，获胜投票者Token被锁定的时间。 用户仍然可以使用这些Token进行质押或投票
- **冷静期** — 提案遭到技术委员会否决直至可以再次提交的持续时长
- **委托** — 将自己的投票权委托给其他账户，以积累一定信念值的行为

### 治理参数 {: #governance-parameters }

Moonbeam上的治理参数如下所示：

|         变量         |                                                           值                                                            |
|:--------------------:|:-----------------------------------------------------------------------------------------------------------------------:|
|        启动期        | {{ networks.moonbeam.democracy.launch_period.blocks}} blocks ({{ networks.moonbeam.democracy.launch_period.days}} days) |
|        投票期        |   {{ networks.moonbeam.democracy.vote_period.blocks}} blocks ({{ networks.moonbeam.democracy.vote_period.days}} days)   |
|      生效等待期      |  {{ networks.moonbeam.democracy.enact_period.blocks}} blocks ({{ networks.moonbeam.democracy.enact_period.days}} days)  |
|        冷静期        |   {{ networks.moonbeam.democracy.cool_period.blocks}} blocks ({{ networks.moonbeam.democracy.cool_period.days}} days)   |
|    原像基础保证金    |                                   {{ networks.moonbeam.preimage.base_deposit }} GLMR                                    |
| 每个字节的原像保证金 |                                   {{ networks.moonbeam.preimage.byte_deposit }} GLMR                                    |
|      提案保证金      |                                   {{ networks.moonbeam.democracy.min_deposit }} GLMR                                    |
|       提案上限       |                                     {{ networks.moonbeam.democracy.max_proposals }}                                     |
|  公投上限（单次）*   |                                     {{ networks.moonbeam.democracy.max_referenda }}                                     |

**单次最大公投数量不包括快速通道公投。* 

!!! 注意事项
    外部提案的投票期和生效等待期可能会发生变化。

#### 信念乘数 {: #conviction-multiplier }

信念乘数与公投通过批准后进入生效等待期的Token锁定期限数量有关。如果您愿意锁定Token的时间越长，则您的投票权重就越大。 您也可以选择不锁定Token，但投票权重会大大降低（在公投期间Token仍处于锁定状态）。

举例来说，如果您以6倍的信念投票1000个Token，您的投票权重将为6000。也就是说，1000个锁定的Token乘以信念（在本示例中为6倍）。但是如果您决定不在生效后锁定您的Token，您可以以0.1倍的信念进行投票。在这种情况下，您的投票权重为100。

Moonbeam的信念乘数如下所示：

=== "Moonbeam"
    | 生效后的锁定期 | 信念乘数 |                        预计锁定时间                        |
    |:--------------:|:--------:|:----------------------------------------------------------:|
    |       0        |   0.1    |                            None                            |
    |       1        |    1     | {{networks.moonbeam.democracy.lock_period.conviction_1}}天 |
    |       2        |    2     | {{networks.moonbeam.democracy.lock_period.conviction_2}}天 |
    |       4        |    3     | {{networks.moonbeam.democracy.lock_period.conviction_3}}天 |
    |       8        |    4     | {{networks.moonbeam.democracy.lock_period.conviction_4}}天 |
    |       16       |    5     | {{networks.moonbeam.democracy.lock_period.conviction_5}}天 |
    |       32       |    6     | {{networks.moonbeam.democracy.lock_period.conviction_6}}天 |

!!! 注意事项
    预计锁定时间基于常规的{{ networks.moonbeam.block_time }}-秒区块时间。区块生产可能会有所不同，因此显示的锁定时间仅供参考。

### 提案步骤 {: #roadmap-of-a-proposal } 

在提交提案之前，提案的作者可以将其提案的想法提交到[Moonbeam治理论坛](https://forum.moonbeam.foundation/c/governance/2){target=_blank}的Democracy Proposals部分，以获得来自社区的至少五天的反馈。作者可以根据收集的反馈对提案进行调整。

当提案准备在链上提交时，需要先将提案原像提交至链上。原像定义要执行的操作。提交者按存储的每个字节支付费用：原像越大，费用越高。提交后，则会返回原像哈希。

提议者可以使用原像哈希提交提案，并在此过程中锁定Token。 提交交易被接受后，提案就会被公开列出。从而，您能够在[Polkassembly](https://moonbeam.polkassembly.network/){target=_blank}上查看提案。

提案对外列出后，Token持有者可以通过锁定提议者锁定的相同数量的Token来支持提案（作为担保）。附议最多的提案将转向公投。 这种情况下，公投将列在[Polkassembly的链上提案页面](https://moonbeam.polkassembly.network/proposals){target=_blank}。

在公投中，Token持有者可以通过锁定Token为提案进行**赞成**或者**反对**的投票。有两个因素会影响投票权重：锁定的Token数量和锁定期限。如果提案生效，则会在一定时间后执行。

下方图片显示了民主提案步骤：

![Proposal Roadmap](/images/learn/features/governance/proposal-roadmap.png)

### 理事会和技术委员会的投票权利 {: #voting-rights-of-the-council-and-the-technical-committee }

理事会和技术委员会是两个团体，具有以下特殊投票权：

|    团体    | 可以提交<br>外部提案 | 可以提交<br>快速通道提案 | 可以取消<br>恶意的民主提案 | 可以否决<br>外部提案 |
|:----------:|:--------------------:|:------------------------:|:--------------------------:|:--------------------:|
|   理事会   |          ✓           |            X             |             ✓              |          X           |
| 技术委员会 |          X           |            ✓             |             ✓              |          ✓           |

投票期限为一天或更长时间的快速通道提案需要技术委员会二分之一的批准。 投票期少于一天的快速通道提案称为“即时快速通道提案”，需要技术委员会五分之三的批准。

如上述表格所示，技术委员会可以否决外部提案。技术委员会的任何成员只有一次否决提案的机会，并且只能在冷静期期间有效。

### 正投票率偏向 {: #positive-turnout-bias } 

公投使用正投票率偏向指标，即绝对多数投票通过的公式。 计算方式如下所示：

![Positive Turnout Bias](/images/learn/features/governance/vote-bias.png)

其中：

 - **赞成** — “赞成”票的数量（包括信念乘数）
 - **反对** — “反对”票的数量（包括信念乘数）
 - **投票数** — 参与投票的Token总量（不包括信念乘数）
 - **总选票** — 网络发行的Token总量

在前面的示例中，这些数字是：

|   变量   |          值           |
|:--------:|:---------------------:|
|   赞成   |   10800 (1800 x 6)    |
|   反对   |    80 (800 x 0.1)     |
|  投票数  |   2600 (1800 + 800)   |
|  总选票  |         1.22M         |
| **结果** | 1.5 < 9.8 (Aye wins!) |

简而言之，在投票数偏低的情况下，需要绝对多数“赞成”票才能批准提案，但随着投票数的增加，则会变成简单多数的形式。

### Governance v1上的相关指南 {: #try-it-out } 

关于如何使用Governance v1在Moonbeam上提交公投和投票，请查看以下指南：

 - [如何提交提案](/tokens/governance/proposals/proposals){target=_blank}
 - [如何对提案投票](/tokens/governance/voting/voting){target=_blank}
 - [如何与民主预编译合约（Solidity接口）交互)](/builders/pallets-precompiles/precompiles/democracy/){target=_blank}

