---
title: 平行链质押Pallet
description: 学习关于Moonbeam上平行链质押Pallet可用extrinsics，以及通过使用Polkadot.js Apps和Polkadot.js API，如何与其交互。
keywords: staking, substrate, pallet, moonbeam, polkadot 
---

# 平行链质押Pallet

![Staking Moonbeam Banner](/images/builders/pallets-precompiles/pallets/staking-banner.png)

## 概览 {: #introduction }

Moonbeam使用委托权益证明(DPoS)共识，该共识根据收集人在网络中的总质押数额决定哪些收集人有资格生产区块。有关质押的一般信息，例如术语、质押变量等，请参阅[质押](/learn/features/staking){target=_blank}页面。

DPOS共识系统利用[平行链质押pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/parachain-staking/src){target=_blank}，允许Token持有者（委托人）以准确表示他们希望支持的候选人（收集人）以及对收集人的质押量。此项平行链质押pallet的设计使得委托人和候选人（收集人）之间强制共享链上的风险/奖励。

平行链质押pallet的一些功能也可以通过质押预编译获得。预编译使您能够通过以太坊 API执行质押操作。请参阅 [质押预编译](/builders/pallets-precompiles/precompiles/staking){target=_blank}页面了解更多相关信息。

此教程将概述平行链质押pallet中可用的extrinsics、存储函数、pallet常量getter。

## 退出生效期 {: #exit-delays }

一些质押pallet extrinsics包括退出生效期，在请求执行前您必须等待。需要注意的退出生效期如下：

=== "Moonbeam"
    |        变量         |                                                                         值                                                                         |
    |:-----------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    | 减少候选人（收集人）绑定量 |       {{ networks.moonbeam.collator_timings.can_bond_less.rounds }}轮次（{{ networks.moonbeam.collator_timings.can_bond_less.hours }}小时）       |
    | 减少委托人绑定量 |      {{ networks.moonbeam.delegator_timings.del_bond_less.rounds }}轮次（{{ networks.moonbeam.delegator_timings.del_bond_less.hours }}小时）      |
    |    撤销委托    | {{ networks.moonbeam.delegator_timings.revoke_delegations.rounds }}轮次（{{ networks.moonbeam.delegator_timings.revoke_delegations.hours }}小时） |
    |    离开候选人（收集人）池     |    {{ networks.moonbeam.collator_timings.leave_candidates.rounds }}轮次（{{ networks.moonbeam.collator_timings.leave_candidates.hours }}小时）    |
    |    离开委托人池     |   {{ networks.moonbeam.delegator_timings.leave_delegators.rounds }}轮次{{ networks.moonbeam.delegator_timings.leave_delegators.hours }}小时）   |

=== "Moonriver"
    |        变量         |                                                                          值                                                                          |
    |:-----------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
    | 减少候选人（收集人）绑定量 |       {{ networks.moonriver.collator_timings.can_bond_less.rounds }}轮次（{{ networks.moonriver.collator_timings.can_bond_less.hours }}小时）       |
    | 减少委托人绑定量 |      {{ networks.moonriver.delegator_timings.del_bond_less.rounds }}轮次（{{ networks.moonriver.delegator_timings.del_bond_less.hours }}小时）      |
    |    撤销委托    | {{ networks.moonriver.delegator_timings.revoke_delegations.rounds }}轮次 ({{ networks.moonriver.delegator_timings.revoke_delegations.hours }}小时） |
    |    离开候选人（收集人）池     |    {{ networks.moonriver.collator_timings.leave_candidates.rounds }}轮次（{{ networks.moonriver.collator_timings.leave_candidates.hours }}小时）    |
    |    离开委托人池     |   {{ networks.moonriver.delegator_timings.leave_delegators.rounds }}轮次（{{ networks.moonriver.delegator_timings.leave_delegators.hours }}小时）   |

=== "Moonbase Alpha"
    |        变量          |                                                                         值                                                                         |
    |:-----------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    | 减少候选人（收集人）绑定量 |       {{ networks.moonbase.collator_timings.can_bond_less.rounds }}轮次（{{ networks.moonbase.collator_timings.can_bond_less.hours }}小时）       |
    | 减少委托人绑定量 |      {{ networks.moonbase.delegator_timings.del_bond_less.rounds }}轮次（{{ networks.moonbase.delegator_timings.del_bond_less.hours }}小时）      |
    |    撤销委托    | {{ networks.moonbase.delegator_timings.revoke_delegations.rounds }}轮次（{{ networks.moonbase.delegator_timings.revoke_delegations.hours }}小时） |
    |    离开候选人（收集人）池     |    {{ networks.moonbase.collator_timings.leave_candidates.rounds }}轮次（{{ networks.moonbase.collator_timings.leave_candidates.hours }}小时）    |
    |    离开委托人池     |   {{ networks.moonbase.delegator_timings.leave_delegators.rounds }}轮次（{{ networks.moonbase.delegator_timings.leave_delegators.hours }}小时）   |

## 平行链质押Pallet接口 {: #parachain-staking-pallet-interface }

### Extrinsics {: #extrinsics }

平行链质押pallet提供以下extrinsics（函数）：

- **cancelCandidateBondLess**() - 取消一个待定中的已计划请求，以减少候选人（收集人）自身绑定数量
- **cancelDelegationRequest**(candidate) -  取消提供候选人（收集人）的地址的任何待定中委托的请求
- **cancelLeaveCandidates**(candidateCount) - 取消一个候选人（收集人）的待定中的已计划的请求，就目前在池中候选人的数量，以离开该池
- **cancelLeaveDelegators**() - *运行时1800弃用* 取消一个待定中的已计划的请求以离开委托人池。可以使用[批量处理方法](/builders/pallets-precompiles/pallets/utility/#using-the-batch-extrinsics){target=_blank}来打包多个`cancelDelegationRequest`请求
- **candidateBondMore**(more) - 请求增加有具体数量的候选人（收集人）自身绑定量
- **delegate**(candidate, amount, candidateDelegationCount, delegationCount) - 请求添加针对特定候选人（收集人）的给定数量的委托。如果调用者不是委托人，此函数添加其至委托人池。如果调用者已经是委托人，那么此函数调整其委托数量
- **delegatorBondMore**(candidate, more) - 请求增加委托人针对特定候选人（收集人）的委托数量
- **executeCandidateBondLess**(candidate) - 执行任何已计划的到期请求，以减少候选人（收集人）自身绑定量
- **executeDelegationRequest**(delegator, candidate) - 为提供候选人（收集人）的地址的特定委托人执行任何已计划的到期委托请求
- **executeLeaveCandidates**(candidate, candidateDelegationCount) - 执行任何已计划的到期请求，以离开候选人（收集人）池
- **executeLeaveDelegators**(delegator, delegationCount) - *运行时1800弃用* 执行已计划的到期请求，以离开委托人池并撤销所有委托。可以使用[批量处理方法](/builders/pallets-precompiles/pallets/utility/#using-the-batch-extrinsics){target=_blank}来打包多个`executeDelegationRequest`请求
- **goOffline**() - 无需解绑，允许收集人暂时离开池
- **goOnline**() - 在之前调用`goOffline()`之后，允许收集人重新加入池
- **joinCandidates**(bond, candidateCount) - 请求在特定绑定量并提供现有候选人（收集人）数量的情况下加入收集人池
- **scheduleCandidateBondLess**(less) - 计划一个请求，以特定数量来减少候选人（收集人）自身绑定。这里有[退出生效期](#exit-delays)，即在您通过`executeCandidateBondLess` extrinsic执行请求之前必须等待
- **scheduleDelegatorBondLess**(candidate, less) - 为委托人针对候选人（收集人）绑定更少的量计划一个请求。这里有[退出生效期](#exit-delays)，即您通过`executeDelegationRequest` extrinsic执行请求之前必须等待
- **scheduleLeaveCandidates**(candidateCount) - 为候选人（收集人）自行从池移出计划一个请求。这里有[退出生效期](#exit-delays)，即您通过`executeLeaveCandidates` extrinsic执行请求之前必须等待
- **scheduleLeaveDelegators**() - *运行时1800弃用* 计划一个请求，以离开委托人池并撤销所有正在进行的委托。可以使用[批量处理方法](/builders/pallets-precompiles/pallets/utility/#using-the-batch-extrinsics){target=_blank}来打包多个`scheduleRevokeDelegation`请求
- **scheduleRevokeDelegation**(collator) - 计划一个请求，以撤销一个给定候选人（收集人）地址的委托。这里有[退出生效期](#exit-delays)，即您通过`executeDelegationRequest` extrinsic执行请求之前必须等待
- **setBlocksPerRound**(new) - 设定每个轮次的区块。如果`new`值少于目前轮次的长度，将立即转换下一个区块
- **setCollatorCommission**(new) - 设定给所有收集人`new`值的佣金
- **setInflation**(schedule) - 设定年通胀率以导出每轮通胀率
- **setParachainBondAccount**(new) - 设定为平行链资金预留的持有资金账户
- **setParachainBondReservePercent**(new) - 设定为平行链资金预留的通胀的百分比
- **setStakingExpectations**(expectations) - 设定所有质押的期望
- **setTotalSelected**(new) - 设定每轮选择的收集人的总数

### 存储模式 {: #storage-methods }

平行链质押pallet包括了以下只读存储模式以获取链状态数据：

- **atStake**(u32, AccountId20) - 提供给定一轮数量的收集人委托质押的快照，并且可选，收集人的地址
- **awardedPts**(u32, AccountId20) - 给定一轮数量，返回每轮每个收集人的奖励积分，并且可选，收集人的地址
- **bottomDelegations**(AccountId20) - 为所有候选人（收集人）或者一个给定候选人（收集人）的地址返回最底部的50个委托
- **candidateInfo**(AccountId20) - 为所有候选人（收集人）或者一个给定的候选人（收集人）的地址返回候选人（收集人）信息，如绑定量、委托数量及更多
- **candidatePool**() - 返回每一个在池中的候选人（收集人）列表以及他们总支持质押量
- **candidateState**(AccountId20) - *运行时1200弃用*，现使用`candidateInfo`代替
- **collatorCommission**() - 返回从所有收集人的奖励中扣除的佣金百分比
- **collatorState2**(AccountId20) - *运行时1200弃用*，现使用`candidateInfo`代替
- **delayedPayouts**(u32) - 返回所有轮次或给定轮次的延迟支付
- **delegationScheduledRequests**(AccountId20) - 返回所有收集人或给定收集人地址中未处理的已计划委托请求
- **delegatorState**(AccountId20) - 为所有委托人或一个给定委托人地址返回委托人信息，如委托情况、委托状态，以及总委托量
- **inflationConfig**() - returns the inflation configuration —— 返回通胀配置
- **nominatorState2**(AccountId20) - *运行时1200弃用*，现使用`delegatorState`代替
- **palletVersion**() - 返回目前pallet版本
- **parachainBondInfo**() - 返回平行链储备账户和年通胀的百分比
- **points**(u32) - 返回在所有轮次或给定轮次中，给与收集人参与生产区块而获得奖励的总点数
- **round**() - 返回目前轮次数，目前轮次的第一个区块，以及轮次的长度
- **selectedCandidates**() - 返回被选为目前轮次的活跃集的收集人
- **staked**(u32) - 返回所有轮次或给定轮次的在活跃集中的收集人的质押总数
- **topDelegations**(AccountId20) - 返回给所有收集人或给定收集人的地址的最高的300个委托
- **total**() - 返回在质押pallet中的总锁定资产
- **totalSelected**() - 返回可被选做活跃集的收集人的总数

### Pallet常量 {: #constants }

平行链质押pallet包括了以下只读函数以获取pallet常量：

- **candidateBondLessDelay**() - 返回必须等待的轮次数，直到已计划的候选人（收集人）减少其自身绑定的请求可以被执行
- **defaultBlocksPerRound**() - 返回每个轮次的默认区块数
- **defaultCollatorCommission**() - 返回收集人的默认佣金
- **defaultParachainBondReservePercent**() - 返回平行链账户预留的默认通胀百分比
- **delegationBondLessDelay**() - 返回必须等待的轮次数，直到已计划的减少委托的请求可以被执行
- **leaveCandidatesDelay**() - 在已计划的候选人（收集人）离开池的请求可以被执行之前，返回必须等待的轮次数
- **leaveDelegatorsDelay**() - 在已计划的委托人离开委托人集的请求可以被执行之前，返回必须等待的轮次数
- **maxBottomDelegationsPerCandidate**() - 返回每个候选人（收集人）最多的排名靠后的委托数
- **maxDelegationsPerDelegator**() - 返回每个委托人的最大委托数
- **maxTopDelegationsPerCandidate**() - 返回每个候选人（收集人）的最多的排名靠前的委托数
- **minBlocksPerRound**() - 返回每个轮次的最低区块数
- **minCandidateStk**() - 返回成为候选人（收集人）所需的最低质押
- **minCollatorStk**() - 返回成为收集人活跃集中所需的最低质押
- **minDelegation**() - 返回最低委托数
- **minDelegatorStk**() - 返回账户成为委托人的最低质押
- **minSelectedCandidates**() - 返回每个轮次在活跃集中选出的收集人（收集人）的最低数量
- **revokeDelegationDelay**() - 在已计划的撤销委托的请求可以被执行之前，返回必须等待的轮次数
- **rewardPaymentDelay**() - 在区块生产者被奖励之后，返回必须等待的轮次数