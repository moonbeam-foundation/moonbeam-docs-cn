---
title: Moonbeam治理
description: 作为波卡（Polkadot）平行链，Moonbeam将通过链上治理机制，来允许公众进行质押权重投票
---

# Moonbeam治理

![Governance Moonbeam Banner](/images/learn/features/governance/governance-overview-banner.png)

## 概览 {: #introduction }

Moonbeam作为去中心化网络，由Token持有者社区进行治理。Moonbeam的治理机制的目标是根据社区意愿推进协议。在这个共同使命中，治理过程寻求包括核心开发者、应用程序开发者、收集人、用户及其他贡献者。诸如[Polkassembly](https://moonbeam.polkassembly.network/){target=_blank}的治理论坛支持开放讨论以及支持根据社区建议从而完善提案。自主执行和[无分叉升级](https://wiki.polkadot.network/docs/learn-runtime-upgrades#forkless-upgrades/){target=_blank}将社区团结起来，共同完成推进协议的使命。

## 一般定义 {: #general-definitions }

权力越大，责任越大。在参与Moonbeam治理之前，请先了解一些重要参数：

 - **提案**—— Token持有者提出的行动方案或事项。在发起期，获得赞成最多的提案可进入公投环节
 - **公投** —— 获得赞成数最多的提案将由社区进行公投。除非有紧急公投正在进行，否则最多只能同时进行5个公投
 - **发起期** —— 两次公投之间的时间间隔
 - **投票期** —— Token持有者对提案进行公投的时期（一次公投的时长）
 - **快速通道投票期** —— 对特别重要问题的紧急提案的投票时长
- **投票** —— Token持有者根据权益和信念值进行公投。信念值指的是Token持有者参与投票的Token被锁定的时长：锁定期越长，相同数量的Token投票权重越高。公投通过后，提案将进入延迟执行期，因此不同意该提案的用户可以在这期间退出网络
 - **执行期** —— 提案获得同意到正式执行（写入法律）之间的时期，也是进行提案所需的最低Token锁定时长
 - **锁定期** —— 赢得投票用户的Token锁定期（提案执行后）。在此期间，用户仍可使用锁定Token进行质押或投票
 - **冷静期** —— 提案遭到技术委员会否决直至可以再次提交的持续时长
 - **委托** —— 将自己的投票权委托给其他账户，以积累一定信念值的行为

## 快速参考 {: #quick-reference }

=== "Moonbeam"
    |         变量         |                                                            值                                                             |
    |:------------------------:|:----------------------------------------------------------------------------------------------------------------------------:|
    |      投票期       |     {{ networks.moonbeam.democracy.vote_period.blocks}}区块（{{ networks.moonbeam.democracy.vote_period.days}}天）      |
    | 快速通道投票期 | {{ networks.moonbeam.democracy.fast_vote_period.blocks}}区块（{{ networks.moonbeam.democracy.fast_vote_period.days}}天） |
    |     执行期     |    {{ networks.moonbeam.democracy.enact_period.blocks}}区块（{{ networks.moonbeam.democracy.enact_period.days}}天）     |
    |     冷静期      |     {{ networks.moonbeam.democracy.cool_period.blocks}}区块（{{ networks.moonbeam.democracy.cool_period.days}}天）      |
    |     最低存入量      |                                      {{ networks.moonbeam.democracy.min_deposit }}枚GLMR                                      |
    |    最多提案量     |                                       {{ networks.moonbeam.democracy.max_proposals }}                                        |

=== "Moonriver"
    |         变量         |                                                               值                                                               |
    |:------------------------:|:---------------------------------------------------------------------------------------------------------------------------------:|
    |      投票期       |       {{ networks.moonriver.democracy.vote_period.blocks}}区块（{{ networks.moonriver.democracy.vote_period.days}}天）       |
    | 快速通道投票期 | {{ networks.moonriver.democracy.fast_vote_period.blocks}}区块（{{ networks.moonriver.democracy.fast_vote_period.hours}}小时） |
    |     执行期     |      {{ networks.moonriver.democracy.enact_period.blocks}}区块（{{ networks.moonriver.democracy.enact_period.days}}天）       |
    |     冷静期      |       {{ networks.moonriver.democracy.cool_period.blocks}}区块（{{ networks.moonriver.democracy.cool_period.days}}天）       |
    |     最低存入量      |                                        {{ networks.moonriver.democracy.min_deposit }}枚MOVR                                        |
    |    最多提案量     |                                         {{ networks.moonriver.democracy.max_proposals }}                                          |

=== "Moonbase Alpha"
    |         变量         |                                                              值                                                              |
    |:------------------------:|:-------------------------------------------------------------------------------------------------------------------------------:|
    |      投票期       |       {{ networks.moonbase.democracy.vote_period.blocks}}区块（{{ networks.moonbase.democracy.vote_period.days}}天）       |
    | 快速通道投票期 | {{ networks.moonbase.democracy.fast_vote_period.blocks}}区块（{{ networks.moonbase.democracy.fast_vote_period.hours}}小时） |
    |     执行期     |      {{ networks.moonbase.democracy.enact_period.blocks}}区块（{{ networks.moonbase.democracy.enact_period.days}}天）       |
    |     冷静期      |       {{ networks.moonbase.democracy.cool_period.blocks}}区块（({{ networks.moonbase.democracy.cool_period.days}}天）       |
    |     最低存入量      |                                        {{ networks.moonbase.democracy.min_deposit }}枚DEV                                        |
    |    最多提案量     |                                         {{ networks.moonbase.democracy.max_proposals }}                                         |

## 原则 {: #principles }

在参与Moonbeam治理流程中，我们还希望用户做到以下几点：

 - 对希望参与Moonbeam网络的和受到治理决策影响的Token持有者持开放包容的态度
 - 欢迎其他Token持有者一同参与，而不是冷漠相待，即使他们的观点可能与您本身的相反
 - 在决策过程中保持开放透明
 - 将网络的良好发展置于个人利益之上
 - 任何时候都做一位道德行动者，时刻考虑自身作为（或不作为）的道德影响
 - 在与其他Token持有者互动的过程中保持耐心与大度，但绝不容忍语言、行动或行为上的暴力和伤害

以上原则很大程度上受到Vlad Zamfir先生关于区块链治理的著作的启发。如需了解更多详情，请参阅他撰写的文章，尤其是[How to Participate in Blockchain Governance in Good Faith (and with Good Manners)](https://medium.com/@Vlad_Zamfir/how-to-participate-in-blockchain-governance-in-good-faith-and-with-good-manners-bd4e16846434){target=_blank}这篇Medium文章。

## 链上治理机制 {: #on-chain-governance-mechanics }

Moonbeam的“硬性”治理流程将由链上流程驱动，并采用由民主权利、理事会、财政库组成的[Substrate框架模块](/learn/platform/glossary/#substrate-frame-pallets){target=_blank}，和Kusama、Polkadot中继链的治理方式相似。该方式能确保与Moonbeam网络相关的关键决策由多数Token作出。提案进入公投后，根据投票权重得出投票结果，从而执行决策。

这一治理机制的主要组成部分包括：

 - **公投** —— 关于修改关键参数值、代码升级或治理机制本身等事宜需要提案并进行公投
 - **投票** —— 各Token持有者在权重规则下进行公投。公投通过后，提案将进入延迟执行期，不同意该提案的用户可以在此期间退出网络
 - **理事会** —— 由用户投票产生，在系统中有特殊投票权。理事会成员的职责是提出公投，并对公众提案的公投有一票否决权。理事会成员通过滚动选举的方式选出，GLMR持有者可以对新任和现任委员会成员投票。理事会也负责选举技术委员会
 - **技术委员会** —— 由理事会选举出的一批独立个体，享有特殊投票权。如同在波卡（Polkadot）和Kusama中，在紧急情况下，技术委员会可以（和理事会一起）进入快速公投投票和实施。在已有上线的公投同时，也可以创建快速通道公投。也就是说，紧急公投不会取代现有公投
 - **财政库**—— 一系列的资金，提交提案并存入后即可进行支出。消费提案必须经过委员会同意。若提案遭到拒绝，提案者将失去存入的资金

更多关于Substrate框架模块如何实施链上治理的细节，请查阅[波卡（Polkadot）治理概览](https://polkadot.network/a-walkthrough-of-polkadots-governance/){target=_blank}博文以及[波卡（Polkadot）治理Wiki](https://wiki.polkadot.network/docs/learn-governance){target=_blank}。

## 投票权重 {: #vote-weight }

Token持有者在公投中的影响力由投票时指定的两个参数决定：锁定余额和信念值。锁定余额是用户提交投票的Token数量（请注意，这与用户的总账户余额不同）。类似波卡（Polkadot）的治理，Moonbeam使用自愿锁定的概念，允许Token持有者通过锁定Token更长时间来增加他们的投票权。特别说明无锁定期意味着用户的投票值为其锁定余额的10%。更大的信念值可以拥有更多的投票权。每增加一次信念值（投票乘数），锁定期就会翻倍。 您可以在[如何投票](/tokens/governance/voting/#how-to-vote)的教程中阅读更多关于信念值的信息。

## 理事会和技术委员会的投票权利 {: #voting-rights-of-the-council-and-the-technical-committee }

此部分介绍一些关于投票权利的背景信息。技术委员会和理事会对议案进行投票的时间（按区块计算）是有限制的。如果已经有足够的投票数来确定结果，则议案可能会在更少的区块内结束。在技术委员会和理事会中分别都有开放[提案的上限量](#quick-reference)。

**投票取消权**：

 - 技术委员会只能在全票通过前取消提案
 - 单一的技术委员会成员可以否决入境理事会提案。然而，他们只可以否决一次，并且只会在[冷静期](#quick-reference)内

## 开始操作 {: #try-it-out }

Token持有者可以在Moonbeam、Moonriver和Moonbase Alpha上提交提案并进行投票。具体步骤请查阅以下教程：

 - [提案](/tokens/governance/proposals/)
 - [投票](/tokens/governance/voting/)
 - [与DemocracyInterface.sol交互](/builders/build/canonical-contracts/precompiles/democracy/)
