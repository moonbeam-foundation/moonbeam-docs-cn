---
title: 民主Pallet
description: 学习如何在Moonbeam上使用可用的民主pallet extrinsics以及如何通过Polkadot.js Apps和Polkadot.js API与其交互。
keywords: 民主、substrate、pallet、moonbeam、波卡
---

# 民主Pallet

![Democracy Moonbeam Banner](/images/builders/pallets-precompiles/pallets/democracy-banner.png)

## 概览 {: #introduction }

作为波卡上的平行链，Moonbeam通过[Substrate民主pallet](https://docs.rs/pallet-democracy/latest/pallet_democracy/){target=_blank}提供原生的链上治理功能。要了解有关治理的更多信息，例如相关术语、原则、机制等的概述，请参阅[Moonbeam治理](/learn/features/governance){target=_blank} 页面。

部分民主pallet的功能通过民主预编译实现。预编译是一个Solidity接口，允许您通过以太坊API执行治理功能。请查看[民主预编译](/builders/pallets-precompiles/precompiles/democracy){target=_blank}相关教程了解更多。

此教程将会提供Moonbeam民主pallet的可用extrinsics、储存方式和pallet常量getters的概览。

## 民主Pallet接口 {: #democracy-pallet-interface }

### 参数 {: #extrinsics }

民主pallet提供以下extrinsics（函数）：

- **delegate**(to, conviction, balance) - 依照给定的信念值，将传送账户的投票权力委托至给定账户。委托所使用的资金将会在委托期间锁定，并在其后适当的信念值锁定期锁定。传送账户需要已经进行委托或是并没有执行任何投票动作。此函数将会提交`Delegated`事件
- **enactProposal**(proposalHash, index) - *自runtime 2000起已弃用* - 根据给定的提案哈希和公投索引在公投中制定提案
- **noteImminentPreimage**(encodedProposal) - *自runtime 2000起已弃用* - 根据提案的编码原像在调度队列中为即将上线的提案注册原像。此函数将会发出`PreimageNoted`事件
- **notePreimage**(encodedProposal) - *自runtime 2000起已弃用* - 根据提案的编码原像为即将上线的提案注册原像。此函数不需要提案位于调度队列当中，但需要定金，其将会在提案上线后归还。此函数将会发出`PreimageNoted`事件。**此extrinsic现在可以通过[原像pallet](/builders/pallets-precompiles/pallets/preimage/#extrinsics){target=_blank}访问**
- **propose**(proposal, value) - 给定提案和保证金数量以提交提案，需要满足最低保证金要求。此函数将会发出`Proposed`事件。提案可以是下列三种类型之一：
    - `Legacy` - 需要不带原像长度的Blake2-256原像哈希。此类型提案无法再创建，暂时存在以支持从遗留状态过渡
    - `Inline` - 需要一个有界的`Call`。 它的编码必须最多为128字节
    - `Lookup` - 需要带原像长度的Blake2-256原像哈希
- **reapPreimage**(proposalHash, proposalLenUpperBound) - *自runtime 2000起已弃用* - 移除一个过期提案的原像并收回定金。此函数仅用于投票期过后的区块且满足需为同一个账号执行函数的条件。如果使用不同的账号执行此函数，则须在提案生效期后的区块方能执行。此函数将会发出`PreimageReaped`事件
- **removeOtherVote**(target, index) - 根据给定的待移除投票账户以及公投索引移除一个参与公投的投票。如果使用此账户的是签署人，则此函数功能将会与`removeVote`函数相同，如非同个人，则该投票需因投票人公投失败或是信念值期间结束而过期方能使用
- **removeVote**(index) - 根据给定的公投索引移除一个参与公投的投票。此投票仅能在公投取消、进行中、结束和结果与投票相反时移除，账户投票并没有信念值或是账户提交了分次投票
- **second**(proposal, secondsUpperBound) - 根据给定的提案索引和当前提案的支持上限支持一个提案
- **undelegate**() - 取消委托一个传送账户的投票权利。Token将会在信念值期间结束后解锁。此函数将提交一个`Undelegated`事件
- **unlock**(target) - 根据给定的账户移除具有过期锁定Token的账户Token
- **vote**(refIndex, vote) - 根据给定的公投索引、投票、信念值以及锁定的Token数量在公投中投票。如果投票为"Aye"，该投票被视为同意生效提案，相反情况则该投票被视为不通过其提案

部分民主pallet的extrinsics用于为*技术委员会*或是*议会*投票：

- **cancelProposal**(propIndex) - 根据给定的提案索引移除提案。提案的取消由*源账户*或是*技术委员会超过5分之3的成员*提议取消提案
- **emergencyCancel**(refIndex) - 根据给定的公投索引紧急取消公投。紧急取消由源账户或是*技术委员会超过5分之3的成员*提议取消提案
- **externalPropose**(proposal) - 根据给定的提案哈希在适当计划一个外部公投时制定一个公投。在*议会超过2分之1的成员*同意后，该公投将会进入下个阶段。请参考上面的**propose** extrinsic描述中的三种类型的提案
- **externalProposeDefault**(proposal) - 根据给定的提案原像哈希，且可以安排外部公投，即安排一次负面投票率的公投进行投票。在*议会超过5分之3成员*同意后，该公投将会进入下个阶段。请参考上面的**propose** extrinsic描述中的三种类型的提案
- **exernalProposeMajority**(proposal) - 根据给定的提案原像哈希，且可以安排外部公投，即安排一次多数票的公投进行进阶投票。在*议会超过5分之3成员*同意后，该公投将会进入下个阶段。请参考上面的**propose** extrinsic描述中的三种类型的提案
- **fastTrack**(proposalHash, votingPeriod, delay) - 根据给定的提案哈希安排一个当前由外部提交的多数公投立即进行投票，该期间允许对提案投票以及在通过后制定期间的区块数量。如果目前并没有由外部提议的公投，或是有但并不是多数决的公投则此函数将失败。在*技术委员会超过2分之1成员*投票同意后公投将会马上被递交
- **noteImminentPreimageOperational**(encodedProposal) - 根据给定的编码提案原像，为一个在调用序列中的未来提案注册原像。此函数将会提交`PreimageNoted`事件，并必须由*议会*成员使用
- **notePreimageOperational**(encodedProposal) - 根据给定的编码提案原像为一个未来提案注册原像。此函数并不需要提案处在调用序列中但需要定金，定金会在提案制定后归还。此函数将会提交`PreimageNoted`事件，并必须由*议会*成员使用
- **vetoExternal**(proposalHash) - 根据给定的提案原像哈希否决和拉黑一个提案。此函数将会提交`Vetoed`事件，且必须由技术委员会使用和仅能调用一次，其后将进入冷却期

同时下列民主pallet的extrinsics仅能由*root*账号调用：

- **blacklist**(proposalHash, maybeRefIndex) - 根据给定的提案哈希永久地将一个提案放入黑名单中，避免其重新被提议。如果其使用在序列中的公开或是外部提案，函数将会移除提案。如果提供的`maybeRefIndex`为一个可用公投且与提案哈希相关，该提案将会被取消
- **cancelQueued**(which) - *自runtime 2000起已弃用* - 根据给定的公投索引移除正在制定期间的提案
- **cancelReferendum**(refIndex) - 根据给定公投索引移除制定公投
- **clearPublicProposals**() - 清除所有公众提案

### 存储函数 {: #storage-methods }

民主pallet包含以下获得链状态数据的只读存储函数：

- **blacklist**(H256) - 返回否决记录，或是如有提供提案哈希，则返回特定提案被列入和名单的信息或是返回`none`代表提案并未被黑名单
- **cancellations**(H256) - 返回被紧急取消的所有提案记录，或是如有提供提案哈希则返回该提案是否有被取消的布林值
- **depositOf**(u32) - 返回用户为提案存储定金的记录，或是如有提供提案索引则会返回特定提案的信息
- **lastTabledWasExternal**() - 如上个记录的公投为通过外部提交返回True，如其为公众提案则返回False
- **lowestUnbaked**() - 返回与未正式通过公投相关的最低公投索引
- **nextExternal**() - 如对外部提案进行投票是有效的，则返回要进行投票的下一次公投
- **palletVersion**() - 返回当前的pallet版本
- **preimages**(H256) - *自runtime 2000起已弃用* - **这个存储函数现在可以通过[原像pallet](/builders/pallets-precompiles/pallets/preimage/#storage-methods){target=_blank}访问**
- **publicPropCount**() - 返回当前已提交的公众提案数量
- **publicProps**() - 返回公众提案记录
- **referendumCount**() - 返回当前已开始公投的数量
- **referendumInfoOf**() - 根据给定的公投索引返回公投的相关信息
- **votingOf**(AccountId20) - 根据给定的投票者地址返回其所有投票纪录

### Pallet常量 {: #constants }

民主pallet包含以下获得pallet常量的只读函数：

- **cooloffPeriod**() - 返回当外部提案在投票后无法重新提交时的区块期间
- **enactmentPeriod**() - 返回一个提案在通过后与正式制定之间的期间
- **fastTrackVotingPeriod**() - 返回一个快速公投允许的最低投票期间
- **instantAllowed**() - 返回一个指示是否发生紧急情况的布林值
- **launchPeriod**() - 返回公投发布的区块频率
- **maxProposals**() - 返回公众提案能够在任何时间存在的最大数量
- **maxBlacklisted**() - 返回可以列入黑名单的最大项目数
- **maxDeposits**() - 返回一个公共提案在任何时候可能拥有的最大保证金数
- **maxVotes**() - 返回一个账户能够执行的投票数量
- **minimumDeposit**() - 返回用于公投提案所需定金的最小数量
- **preimageByteDeposit**() - *自runtime 2000起已弃用* - 返回每个原像字节储存时所需要的资金数量
- **voteLockingPeriod**() - 返回投票锁定的最小时间
- **votingPeriod**() - 返回查看新投票的区块频率