---
title: 治理
description: 作为波卡（Polkadot）平行链，Moonbeam将通过链上治理机制，来允许公众进行权重投票。
---

# Moonbeam治理

![Governance Moonbeam Banner](/images/learn/features/governance/governance-overview-banner.png)

## 概览 {: #introduction } 

Moonbeam作为去中心化网络，将由核心开发者、应用程序开发者、校验者、用户及其它贡献者等代币持有者社区进行治理。

我们致力于鼓励这些领域的代币持有者参与网络上线过程。

## 般定义 {: #general-definitions } 

权力越大，责任越大。在参与Moonbeam治理之前，请先了解一些重要参数：

 - **提案 **—— 代币持有者提出的行动方案或事项，需获其它用户赞成才可进入公投环节
 - **公投** —— 获得赞成数最多的提案将由社区进行公投。除非有紧急公投正在进行，否则最多只能同时进行5个公投
 - **发起期** —— 两次公投之间的时间间隔
 - **投票期** —— 代币持有者对提案进行公投的时期（一次公投的时长）
- **投票** —— 代币持有者根据权益和信念值进行公投。信念值指的是代币持有者参与投票的代币被锁定的时长：锁定期越长，相同数量的代币投票权重越高。公投通过后，提案将进入延迟执行期，因此不同意该提案的用户可以在这期间退出网络
 - **执行期** —— 提案获得同意到正式执行（写入法律）之间的时期，也是进行提案所需的最低代币锁定时长
 - **锁定期** —— 赢得投票用户的代币锁定期（提案执行后）。在此期间，用户仍可使用锁定代币进行质押或投票
 - **委托** —— 将自己的投票权委托给其他账户，以积累一定信念值的行为

=== "Moonbeam"
    |         变量         |  |                                                            值                                                             |
    |:------------------------:|::|:----------------------------------------------------------------------------------------------------------------------------:|
    |      投票期       |  |     {{ networks.moonbeam.democracy.vote_period.blocks}} blocks ({{ networks.moonbeam.democracy.vote_period.days}}天)      |
    | 加速投票期 |  | {{ networks.moonbeam.democracy.fast_vote_period.blocks}} blocks ({{ networks.moonbeam.democracy.fast_vote_period.days}}天) |
    |     执行期     |  |     {{ networks.moonbeam.democracy.enact_period.blocks}} blocks ({{ networks.moonbeam.democracy.enact_period.days}}天)     |
    |     冷却期      |  |     {{ networks.moonbeam.democracy.cool_period.blocks}} blocks ({{ networks.moonbeam.democracy.cool_period.days}}天)      |
    |     最低保证金      |  |                                      {{ networks.moonbeam.democracy.min_deposit }} GLMR                                      |


=== "Moonriver"
    |         变量         |  |                                                             值                                                              |
    |:------------------------:|::|:------------------------------------------------------------------------------------------------------------------------------:|
    |      投票期       |  |     {{ networks.moonriver.democracy.vote_period.blocks}} blocks ({{ networks.moonriver.democracy.vote_period.days}}天)      |
    | 加速投票期 |  | {{ networks.moonriver.democracy.fast_vote_period.blocks}} blocks ({{ networks.moonriver.democracy.fast_vote_period.hours}}小时) |
    |     执行期     |  |     {{ networks.moonriver.democracy.enact_period.blocks}} blocks ({{ networks.moonriver.democracy.enact_period.days}}天)     |
    |     冷却期      |  |     {{ networks.moonriver.democracy.cool_period.blocks}} blocks ({{ networks.moonriver.democracy.cool_period.days}}天)      |
    |     最低保证金      |  |                                      {{ networks.moonriver.democracy.min_deposit }} MOVR                                       |

=== "Moonbase Alpha"
    |         变量         |  |                                                              值                                                              |
    |:------------------------:|::|:-------------------------------------------------------------------------------------------------------------------------------:|
    |      投票期       |  |       {{ networks.moonbase.democracy.vote_period.blocks}} blocks ({{ networks.moonbase.democracy.vote_period.days}}天)       |
    | 加速投票期 |  | {{ networks.moonbase.democracy.fast_vote_period.blocks}} blocks ({{ networks.moonbase.democracy.fast_vote_period.hours}}小时) |
    |     执行期     |  |      {{ networks.moonbase.democracy.enact_period.blocks}} blocks ({{ networks.moonbase.democracy.enact_period.days}}天)       |
    |     冷却期      |  |       {{ networks.moonbase.democracy.cool_period.blocks}} blocks ({{ networks.moonbase.democracy.cool_period.days}}天)       |
    |     最低保证金      |  |                                        {{ networks.moonbase.democracy.min_deposit }} DEV  

## 原则 {: #principles } 

在参与Moonbeam治理流程中，我们还希望用户做到以下几点：

 - 对希望参与Moonbeam网络的和受到治理决策影响的代币持有者持开放包容的态度。
 - 欢迎其他代币持有者一同参与，而不是冷漠相待，即使他们的观点可能与您本身的相反。
 - 在决策过程中保持开放透明。
 - 将网络的良好发展置于个人利益之上。
 - 任何时候都做一位道德行动者，时刻考虑自身作为（或不作为）的道德影响。
 - 在与其他代币持有者互动的过程中保持耐心与大度，但绝不容忍语言、行动或行为上的暴力和伤害。

以上原则很大程度上受到Vlad Zamfir先生关于区块链治理的著作的启发。如需了解更多详情，请参阅他撰写的文章，[尤其是这一篇](https://medium.com/@Vlad_Zamfir/how-to-participate-in-blockchain-governance-in-good-faith-and-with-good-manners-bd4e16846434)。

## 链上治理机制 {: #on-chain-governance-mechanics } 

Moonbeam的“硬性”治理流程将由链上流程驱动，并采用由民主权利、理事会、财政库组成的[Substrate框架模块](/resources/glossary/#substrate-frame-pallets)，和Kusama、Polkadot中继链的治理方式相似。该方式能确保与Moonbeam网络相关的关键决策由多数代币作出。提案进入公投后，根据投票权重得出投票结果，从而执行决策。

这一治理机制的主要组成部分包括：

 - **公投** —— 关于修改关键参数值、代码升级或治理机制本身等事宜需要提案并进行公投
 - **投票** —— 各代币持有者在权重规则下进行公投。公投通过后，提案将进入延迟执行期，不同意该提案的用户可以在此期间退出网络
 - **理事会** —— 由用户投票产生，在系统中有特殊投票权。理事会成员的职责是提出公投，并对公众提案的公投有一票否决权。理事会成员通过滚动选举的方式选出，GLMR持有者可以对新任和现任委员会成员投票
 - **财政库**—— 一系列的资金，提交提案并充值后即可进行支出。消费提案必须经过委员会同意。若提案遭到拒绝，提案者将失去充值的资金

更多关于Substrate框架模块的链上治理详情，请查阅[Polkadot网站概述](https://polkadot.network/a-walkthrough-of-polkadots-governance/)和[wiki博客](https://wiki.polkadot.network/docs/learn-governance)。

## 在Moonbase Alpha上进行测试 {: #try-it-on-moonbase-alpha } 

目前，Moonbase Alpha测试网上的代币持有者可以提交提案并进行投票。具体步骤请查阅以下教程：

 - [提案](/governance/proposals/)
 - [投票](/governance/voting/)

理事会和财政库相关功能尚未部署。

