---
title: Referenda Pallet（公投Pallet）
description: 本教程涵盖Moonbeam上Referenda Pallet中的可用函数，用于查看和提交与链上公投相关的数据
keywords: 民主, substrate, pallet, moonbeam, polkadot, 波卡, 表决, 投票, 公投
---

# Referenda Pallet

![Referenda Moonbeam Banner](/images/builders/pallets-precompiles/pallets/referenda-banner.png)

## 概览 {: #introduction }

Referenda Pallet允许Token持有者在公投中进行、委托以及管理信念值权重投票。

治理相关功能是基于3个新的pallet和预编译：[Preimage Pallet](/builders/pallets-precompiles/pallets/preimage){target=_blank}和[Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage){target=_blank}、[Referenda Pallet](/builders/pallets-precompiles/pallets/referenda){target=_blank}和[Referenda Precompile](/builders/pallets-precompiles/precompiles/referenda){target=_blank}，以及[Conviction Voting Pallet](/builders/pallets-precompiles/pallets/conviction-voting){target=_blank}和[Conviction Voting Precompile](/builders/pallets-precompiles/precompiles/conviction-voting){target=_blank}。上述预编译是Solidity接口，使您能够使用以太坊API执行治理功能。

本教程将概述Moonbeam上Referenda Pallet中的可用extrinsics、存储函数和pallet常量的获取方式。本教程假设您已熟悉治理相关的专业术语，反之您可以在[治理概览页面](/learn/features/governance/#opengov){target=_blank}获取更多信息。

## Referenda Pallet接口 {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

Referenda Pallet提供以下extrinsics（函数）：

- **cancel**(index) - 根据要取消的公投索引，取消正在进行中的公投。此类操作需要创建提案并将其分配给Root Track或Emergency Canceller Track
- **kill**(index) - 根据要取消的公投索引，取消正在进行中的公投并没收保证金。此类操作需要创建提案并将其分配给Root Track或Emergency Canceller Track
- **placeDecisionDeposit**(index) - 根据公投索引为公投发布决定保证金（Decision Deposit）
- **refundDecisionDeposit**(index) - 根据公投索引将已结束公投的决定保证金（Decision Deposit）退还给充值者
- **refundSubmissionDeposit**(index) - 根据公投索引，将结束公投的提交押金退还给存款人
- **submit**(proposalOrigin, proposal, enactmentMoment) - 根据提案应该被执行的Origin、提案，以及提案应该被生效的时间，对优先处理的提案发起公投

### 存储函数 {: #storage-methods }

Referenda Pallet包括以下只读存储函数来获取链上状态数据：

- **decidingCount**() - 返回当前正在决定的公投数量
- **palletVersion**() - 返回当前pallet版本
- **referendumCount**() - 返回截至目前为止已开始的公投数量
- **referendumInfoFor**(u32) - 返回有关任何给定公投的信息
- **trackQueue**(u16) - 返回准备决定但尚未决定的公投列表，根据信念值权重进行排序。如果正在决定的公投数量少于可以决定的最大公投数量，则此列表为空白

### Pallet常量 {: #constants }

Referenda Pallet包括以下只读函数来获取pallet常量：

- **maxQueued**() - 返回单个Track的公投队列最大值
- **submissionDeposit**() - 返回作为公投提案保证金的最低金额
- **tracks**() - 返回有关不同公投Track的信息
- **undecidingTimeout**() - 提交后必须开始决定公投的区块数量。 通过后，任何人都可以取消公投