---
title: Conviction Voting（信念投票） Pallet
description: 本教程涵盖Moonbeam上Conviction Voting Pallet中的可用函数，用于投票、委托投票、移除投票等。
keywords: 民主, substrate, pallet, moonbeam, polkadot, 波卡, 表决, 投票, 公投
---

# Conviction Voting Pallet

## 概览 {: #introduction }

Conviction Voting Pallet允许Token持有者在公投中进行、委托以及管理信念值权重投票。

治理相关功能是基于3个新的pallet和预编译：[Preimage Pallet](/builders/pallets-precompiles/pallets/preimage){target=_blank}和[Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage){target=_blank}、[Referenda Pallet](/builders/pallets-precompiles/pallets/referenda){target=_blank}和[Referenda Precompile](/builders/pallets-precompiles/precompiles/referenda){target=_blank}，以及[Conviction Voting Pallet](/builders/pallets-precompiles/pallets/conviction-voting){target=_blank}和[Conviction Voting Precompile](/builders/pallets-precompiles/precompiles/conviction-voting){target=_blank}。上述预编译是Solidity接口，使您能够使用以太坊API执行治理功能。

本教程将概述Moonbeam上Conviction Voting Pallet中的extrinsics、存储函数和pallet常量的获取方式。本教程假设您已熟悉治理相关的专业术语，反之您可以在[治理概览页面](/learn/features/governance/#opengov){target=_blank}获取更多信息。

## Conviction Voting Pallet接口 {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

Conviction Voting Pallet提供以下extrinsics（函数）：

- **delegate**(class, to, conviction, balance) - 将投票权（包含给定的信念值）委托给另一个账户，用于特定级别（Origins）的民意投票（公投）。委托的数额将在委托期间被锁定，之后的时间为信念值的锁定期。发出`Delegated`事件
- **removeOtherVote**(target, class, index) - 移除民意投票（公投）的投票。如果`target`是签署者，则此函数等同于`removeVote`。如果不是签署者，则此投票必须已经过期，要么是因为投票被取消，投票者在投票中落败，要么是因为信念期已结束
- **removeVote**(class, index) - 移除民意调查的投票。如果出现以下情况之一，就会发生这种情况：
    - 如果民意投票被取消，在没有其他待处理锁定的情况下，Token将立即解锁
    - 如果民意投票正在进行中，Token持有者的投票不再计入计票，在没有其他待处理锁定的情况下，Token将立即解锁
    - 如果民意投票结束，会有两个不同的场景：
        - 如果Token持有者投票反对统计结果或未设置信念值进行投票，则在没有其他待处理锁定的情况下Token将立即解锁
        - 如果民意投票结束，结果与Token持有者的投票（包含给定的信念值）一致，并且信念值的锁定期尚未结束，则用于投票的Token将被整合到整个账户的锁定中。这可能会涉及_overlocking_（将两个锁定合并成一个锁定，即为锁定量和锁定期的最大值）
- **undelegate**(class) - 取消特定级别（Origin）民意投票（公投）的投票权。Token将在委托的信念值锁定期到期后解锁。发出`Undelegated`事件
- **unlock**(class, target) - 移除已过期的特定级别（Origin）内先前的投票/委托投票的锁定
- **vote**(pollIndex, vote) - 在民意投票（公投）中提交投票。如果投票为“赞成”("Aye")，则为生效提案；如果投票为“反对”("Nay")则维持现状

### 存储函数 {: #storage-methods }

Conviction Voting Pallet包括以下只读存储函数来获取链上状态数据：

- **classLocksFor**(AccountId20) - 返回非零的锁定要求的投票级别（Origins）及其所需的锁定量
- **palletVersion**() - 返回当前pallet版本
- **votingFor**(AccountId20, u16) - 返回特定投票级别（Origin）中特定投票者的所有投票

### Pallet常量 {: #constants }

Conviction Voting Pallet包括以下只读函数来获取pallet常量：

- **maxVotes**() - 返回一个帐户可能拥有的最大投票数
- **voteLockingPeriod**() - 返回投票锁定的最短时间。但该期限不应短于生效等待期，以确保在获得批准的情况下，那些成功的投票者被锁定在他们的投票所带来的后果中