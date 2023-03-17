---
title: Referenda Pallet
description: This guide covers the available functions for the Referenda Pallet on Moonbeam, of which are used to view and submit data related to on-chain referenda
本教程涵盖Moonbeam上Referenda Pallet中的可用函数，用于查看和提交与链上公投相关的数据
keywords: democracy, substrate, pallet, moonbeam, polkadot, voting, vote, referenda
---

# Referenda Pallet

![Referenda Moonbeam Banner](/images/builders/pallets-precompiles/pallets/referenda-banner.png)

## Introduction 概览 {: #introduction }

The Referenda Pallet allows token holders to make, delegate, and manage Conviction-weighted votes on referenda. 

Referenda Pallet允许Token持有者投票、委托投票，以及管理公投的信念值权重投票。

--8<-- 'text/pallets/gov1-gov2.md'
Some of the functionality of the Referenda Pallet is available through the [Referenda Precompile](/builders/pallets-precompiles/precompiles/referenda){target=_blank}. 

Referenda Pallet的一些功能可以通过[Referenda Precompile](/builders/pallets-precompiles/precompiles/referenda){target=_blank}使用。

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the Referenda Pallet on Moonbeam. This guide assumes you are familiar with governance-related terminology, if not, please check out the [governance overview page](/learn/features/governance/#opengov){target=_blank} for more information.

本教程将概述Moonbeam上Referenda Pallet中的可用extrinsics、存储函数和pallet常量的获取方式。本教程假设您已熟悉治理相关的专业术语，反之您可以在[治理概览页面](/learn/features/governance/#opengov){target=_blank}获取更多信息。

## Referenda Pallet Interface - Referenda Pallet接口 {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

The Referenda Pallet provides the following extrinsics (functions):

Referenda Pallet提供以下extrinsics（函数）：

- **cancel**(index) - cancels an ongoing referendum given the index of the referendum to cancel. This type of action requires a proposal to be created and assigned to the Emergency Canceller Track
- **cancel**(index) - 根据要取消的公投索引，取消正在进行中的公投。此类操作需要创建提案并将其分配给Emergency Canceller Track
- **kill**(index) - cancels an ongoing referendum and slashes the deposits given the index of the referendum to cancel. This type of action requires a proposal to be created and assigned to the Emergency Killer Track
- **kill**(index) - 根据要取消的公投索引，取消正在进行中的公投并没收保证金。此类操作需要创建提案并将其分配给Emergency Killer Track
- **placeDecisionDeposit**(index) - posts the Decision Deposit for a referendum given the index of the referendum
- **placeDecisionDeposit**(index) - 根据公投索引为公投发布决定保证金（Decision Deposit）
- **refundDecisionDeposit**(index) - refunds the Decision Deposit for a closed referendum back to the depositor given the index of the referendum
- **refundDecisionDeposit**(index) - 根据公投索引将已结束公投的决定保证金（Decision Deposit）退还给充值者
- **submit**(proposalOrigin, proposal, enactmentMoment) - proposes a referendum on a privileged action given the Origin from which the proposal should be executed, the proposal, and the moment tht the proposal should be enacted
- **submit**(proposalOrigin, proposal, enactmentMoment) - 根据提案应该被执行的Origin、提案，以及提案应该被生效的时间，对优先处理的提案发起公投

### Storage Methods 存储函数 {: #storage-methods }

The Referenda Pallet includes the following read-only storage methods to obtain chain state data:

Referenda Pallet包括以下只读存储函数来获取链上状态数据：

- **decidingCount**() - returns the number of referenda being decided currently
- **decidingCount**() - 返回当前正在决定的公投数量
- **palletVersion**() - returns the current pallet version
- **palletVersion**() - 返回当前pallet版本
- **referendumCount**() - returns the number of referenda started so far
- **referendumCount**() - 返回截至目前为止已开始的公投数量
- **referendumInfoFor**(u32) - returns information concerning any given referendum
- **referendumInfoFor**(u32) - 返回有关任何给定公投的信息
- **trackQueue**(u16) - returns the sorted list of referenda ready to be decided but not yet being decided on, ordered by conviction-weighted approvals. This should be empty if the deciding count is less than the maximum referenda that can be decided on
- **trackQueue**(u16) - 返回准备决定但尚未决定的公投列表，根据信念值权重进行排序。如果正在决定的公投数量少于可以决定的最大公投数量，则此列表为空白

### Pallet Constants - Pallet常量 {: #constants }

The Referenda Pallet includes the following read-only functions to obtain pallet constants:

Referenda Pallet包括以下只读存储函数来获取pallet常量：

- **maxQueued**() - returns the maximum size of the referendum queue for a single Track
- **maxQueued**() - 返回单个Track的公投序列最大值
- **submissionDeposit**() - returns the minimum amount to be used as a deposit for a public referendum proposal 
- **submissionDeposit**() - 返回作为公投提案保证金的最低金额
- **tracks**() - returns information concerning the different referendum Tracks
- **tracks**() - 返回有关不同公投Track的信息
- **undecidingTimeout**() - the number of blocks after submission that a referendum must begin being decided by. Once this passes, then anyone may cancel the referendum
- **undecidingTimeout**() - 提交后必须开始决定公投的区块数量。 通过后，任何人都可以取消公投