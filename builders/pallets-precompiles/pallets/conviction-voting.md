---
title: Conviction Voting Pallet
description: This guide covers the available functions in the Conviction Voting Pallet on Moonbeam, of which are used to vote, delegate votes, remove votes, and more.
本教程涵盖Moonbeam上Conviction Voting Pallet中的可用函数，用于投票、委托投票、移除投票等。
keywords: democracy, substrate, pallet, moonbeam, polkadot, voting, vote, referenda
---

# Conviction Voting Pallet

![Conviction Voting Moonbeam Banner](/images/builders/pallets-precompiles/pallets/conviction-voting-banner.png)

## Introduction 概览 {: #introduction }

The Conviction Voting Pallet allows token holders to make, delegate, and manage Conviction-weighted votes on referenda. 

Conviction Voting Pallet允许Token持有者投票、委托投票，以及管理公投的信念值权重投票。

--8<-- 'text/pallets/gov1-gov2.md'
Some of the functionality of the Conviction Voting Pallet is available through the [Conviction Voting Precompile](/builders/pallets-precompiles/precompiles/conviction-voting){target=_blank}. 

Conviction Voting Pallet的一些功能可以通过[Conviction Voting Precompile](/builders/pallets-precompiles/precompiles/conviction-voting){target=_blank}使用。

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the Conviction Voting Pallet on Moonbeam. This guide assumes you are familiar with governance-related terminology, if not, please check out the [governance overview page](/learn/features/governance/#opengov){target=_blank} for more information.

本教程将概述Moonbeam上Conviction Voting Pallet中的可用extrinsics、存储函数和pallet常量的获取方式。本教程假设您已熟悉治理相关的专业术语，反之您可以在[治理概览页面](/learn/features/governance/#opengov){target=_blank}获取更多信息。

## Conviction Voting Pallet Interface - Conviction Voting Pallet接口 {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

The Conviction Voting Pallet provides the following extrinsics (functions):

Conviction Voting Pallet提供以下extrinsics（函数）：

- **delegate**(class, to, conviction, balance) - delegate the voting power (with some given Conviction) to another account for a particular class (Origin) of polls (referenda). The balance delegated is locked for as long as it's delegated, and thereafter for the time appropriate for the Conviction's lock period. Emits a `Delegated` event
- **delegate**(class, to, conviction, balance) - 将投票权（包含给定的信念值）委托给另一个账户，用于特定级别（Origins）的民意投票（公投）。委托的余额将在委托期间被锁定，之后的时间为信念值的锁定期。发出`Delegated`事件
- **removeOtherVote**(target, class, index) - removes a vote for a poll (referendum). If the `target` is equal to the signer, then this function is exactly equivalent to `removeVote`. If not equal to the signer, then the vote must have expired, either because the poll was cancelled, the voter lost the poll or because the conviction period is over
- **removeOtherVote**(target, class, index) - 移除民意投票（公投）的投票。如果`target`是签署者，则此函数会是`removeVote`。如果不是签署者，则说明投票已经过期，或是投票被取消，又或是信念期已结束
- **removeVote**(class, index) - Removes a vote for a poll. This can occur if one of the following is true:
- **removeVote**(class, index) - 移除民意调查的投票。如果出现以下情况之一，就会发生这种情况：
    - If the poll was cancelled, tokens are immediatly available for unlocking if there is no other pending lock
    - 如果投票被取消，在没有其他待处理锁定的情况下，Token将立即解锁
    - If the poll is ongoing, the token holder's votes do not longer count for the tallying, tokens are immediatly available for unlocking if there is no other pending lock
    - 如果民意投票正在进行中，则Token持有者的投票将不计入投票，在没有其他待处理锁定的情况下，Token将立即解锁
    - If the poll has ended, there are two different scenarios:
    - 如果民意投票结束，会有两个不同的场景：
        - If the token holder voted against the tallied result or voted with no conviction, the tokens are immediatly available for unlocking if there is no other pending lock
        - 如果Token持有者反对统计结果进行投票或未设置信念值进行投票，则Token将立即解锁
        - If, however, the poll has ended and the results coincides with the vote of the token holder (with a given conviction), and the lock period of the Conviction is not over, then the lock will be aggregated into the overall account's lock. This may involve _overlocking_ (where the two locks are combined into a single lock that is the maximum of both the amount locked and the time is it locked for)
        - 如果民意投票结束，结果与Token持有者的投票（包含给定的信念值）一致，并且信念值的锁定期尚未结束，则用于投票的Token将被整合到一个账户中进行锁定。这可能会涉及_overlocking_（将两个锁定合并成一个锁定，即为锁定量和锁定期的最大值）
- **undelegate**(class) - undelegates the voting power for a particular class (Origin) of polls (referenda). Tokens may be unlocked following once an amount of time consistent with the lock period of the conviction with which the delegation was issued. Emits an `Undelegated` event
- **undelegate**(class) - 取消特定级别（Origin）民意投票（公投）的投票权。Token将在委托的信念值锁定期到期后解锁。发出`Undelegated`事件
- **unlock**(class, target) - removes a lock for a prior vote/delegation vote within a particluar class (Origin), which has expired
- **unlock**(class, target) - 移除已过期的特定级别（Origin）内优先处理的投票/委托投票的锁定
- **vote**(pollIndex, vote) - submits a vote in a poll (referendum). If the vote is "aye", the vote is to enact the proposal; otherwise it is a "nay" vote to keep the status quo
- **vote**(pollIndex, vote) - 在民意投票（公投）中提交投票。如果投票为“赞成”，则为生效提案；如果投票为“反对”则维持现状

### Storage Methods 存储函数 {: #storage-methods }

The Conviction Voting Pallet includes the following read-only storage methods to obtain chain state data:

Conviction Voting Pallet包括以下只读存储函数来获取链上状态数据：

- **classLocksFor**(AccountId20) - returns the voting classes (Origins) which have a non-zero lock requirement and the lock amounts which they require
- **classLocksFor**(AccountId20) - 返回无锁定要求的投票级别（Origins）及其所需的锁定量
- **palletVersion**() - returns the current pallet version
- **palletVersion**() - 返回当前pallet版本
- **votingFor**(AccountId20, u16) - returns all of the votes for a particular voter in a particular voting class (Origin)
- **votingFor**(AccountId20, u16) - 返回特定投票级别（Origin）中特定投票者的所有投票

### Pallet Constants - Pallet常量 {: #constants }

The Conviction Voting Pallet includes the following read-only functions to obtain pallet constants:

Conviction Voting Pallet包括以下只读存储函数来获取pallet常量：

- **maxVotes**() - returns the maximum number of concurrent votes an account may have
- **maxVotes**() - 返回一个帐户可能拥有的最大投票数
- **voteLockingPeriod**() - returns the minimum period of vote locking. It should not be shorter than the Enactment Period to ensure that in the case of an approval, those successful voters are locked into the consequences that their votes entail
- **voteLockingPeriod**() - 返回投票锁定的最短时间。但该期限不应短于生效等待期，以确保在获得批准的情况下，那些成功的投票者被锁定在他们的投票所带来的后果中