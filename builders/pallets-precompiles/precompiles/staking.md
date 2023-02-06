---
title: 质押预编译
description: 了解如何使用质押预编译，允许开发人员使用Ethereum API访问质押功能。
keywords: 标准合约, 以太坊, moonbeam, 预编译, 智能合约, solidity
---

# 与质押预编译交互

![Staking Moonbeam Banner](/images/builders/pallets-precompiles/precompiles/staking/staking-banner.png)

## 概览 {: #introduction }

Moonbeam使用一种名为[平行链质押](/builders/pallets-precompiles/pallets/staking){target=_blank}的委托权益证明Pallet，使Token持有者（委托人）能够准确表达他们愿意支持的候选收集人以及希望质押的数量。除此之外，平行链质押Pallet的设计也将使链上的委托人和候选收集人共享风险与回报。有关质押的一般信息，例如一般术语、质押变量等，请参阅[Moonbeam质押](/learn/features/staking){target=_blank}页面。

质押模块采用Rust进行编码，其为Pallet的一部分，正常来说无法从Moonbeam的以太坊一侧访问和使用。然而，一个质押预编译能让开发者通过在位于以下指定地址的预编译合约中的以太坊API使用质押功能：

=== "Moonbeam"
     ```
     {{networks.moonbeam.precompiles.staking}}
     ```

=== "Moonriver"
     ```
     {{networks.moonriver.precompiles.staking}}
     ```

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.staking}}
     ```

本指南将介绍质押预编译接口中的可用方法。此外，它将向您展示如何通过质押预编译和以太坊API与质押pallet进行交互。本指南中的示例是在Moonbase Alpha上完成的，但它们可以适用于Moonbeam 或Moonriver。

--8<-- 'text/precompiles/security.md'

## 退出延迟 {: #exit-delays }

前面提到的一些质押接口功能包含退出延迟，您必须等待延迟后才能执行请求。需要注意的退出延迟如下：

=== "Moonbeam"
    |        变量         |                                                                         值                                                                         |
    |:-----------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    | 减少候选人绑定 |       {{ networks.moonbeam.collator_timings.can_bond_less.rounds }}轮次 ({{ networks.moonbeam.collator_timings.can_bond_less.hours }}小时)       |
    | 减少稳妥人绑定 |      {{ networks.moonbeam.delegator_timings.del_bond_less.rounds }}轮次 ({{ networks.moonbeam.delegator_timings.del_bond_less.hours }}小时)      |
    |    解除委托    | {{ networks.moonbeam.delegator_timings.revoke_delegations.rounds }}轮次 ({{ networks.moonbeam.delegator_timings.revoke_delegations.hours }}小时) |
    |    退出候选人集     |    {{ networks.moonbeam.collator_timings.leave_candidates.rounds }}轮次 ({{ networks.moonbeam.collator_timings.leave_candidates.hours }}小时)    |
    |    退出委托人集     |   {{ networks.moonbeam.delegator_timings.leave_delegators.rounds }}轮次 ({{ networks.moonbeam.delegator_timings.leave_delegators.hours }}小时)   |

=== "Moonriver"
    |        变量         |                                                                          值                                                                          |
    |:-----------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
    | 减少候选人绑定 |       {{ networks.moonriver.collator_timings.can_bond_less.rounds }}轮次 ({{ networks.moonriver.collator_timings.can_bond_less.hours }}小时)       |
    | 减少稳妥人绑定 |      {{ networks.moonriver.delegator_timings.del_bond_less.rounds }}轮次 ({{ networks.moonriver.delegator_timings.del_bond_less.hours }}小时)      |
    |    解除委托     | {{ networks.moonriver.delegator_timings.revoke_delegations.rounds }}轮次 ({{ networks.moonriver.delegator_timings.revoke_delegations.hours }}小时) |
    |    退出候选人集      |    {{ networks.moonriver.collator_timings.leave_candidates.rounds }}轮次 ({{ networks.moonriver.collator_timings.leave_candidates.hours }}小时)    |
    |    退出委托人集     |   {{ networks.moonriver.delegator_timings.leave_delegators.rounds }}轮次 ({{ networks.moonriver.delegator_timings.leave_delegators.hours }}小时)   |

=== "Moonbase Alpha"
    |        变量         |                                                                         值                                                                         |
    |:-----------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    | 减少候选人绑定 |       {{ networks.moonbase.collator_timings.can_bond_less.rounds }}轮次 ({{ networks.moonbase.collator_timings.can_bond_less.hours }}小时)       |
    | 减少稳妥人绑定 |      {{ networks.moonbase.delegator_timings.del_bond_less.rounds }}轮次 ({{ networks.moonbase.delegator_timings.del_bond_less.hours }}小时)      |
    |    解除委托     | {{ networks.moonbase.delegator_timings.revoke_delegations.rounds }}轮次 ({{ networks.moonbase.delegator_timings.revoke_delegations.hours }}小时) |
    |    退出候选人集      |    {{ networks.moonbase.collator_timings.leave_candidates.rounds }}轮次 ({{ networks.moonbase.collator_timings.leave_candidates.hours }}小时)    |
    |    退出委托人集     |   {{ networks.moonbase.delegator_timings.leave_delegators.rounds }}轮次 ({{ networks.moonbase.delegator_timings.leave_delegators.hours }}小时)   |

## 平行链质押Solidity接口 {: #the-parachain-staking-solidity-interface }

[`StakingInterface.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank}是一个接口，通过Solidity合约与平行链质押交互。因此，Solidity开发者无需学习Substrate API，即可使用熟悉的以太坊界面操作质押功能。

Solidity接口包含以下的函数：

 - **isDelegator**(*address* delegator) —— 检查指定地址当前是否为质押委托人的只读函数。使用质押Pallet的[`delegatorState`](/builders/pallets-precompiles/pallets/staking/#:~:text=delegatorState(AccountId20)){target=_blank}函数
 - **isCandidate**(*address* candidate) —— 检查指定地址当前是否为候选收集人的只读函数。使用质押Pallet的[`candidateState`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidateState(AccountId20)){target=_blank}函数
 - **isSelectedCandidate**(*address* candidate) —— 检查指定地址当前是否为活跃收集人集其中一部分的只读函数。使用质押Pallet的[`selectedCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=selectedCandidates()){target=_blank}函数
 - **points**(*uint256* round) —— 获取在给定轮次中授予所有收集人总分的只读函数。使用质押Pallet的[`points`](/builders/pallets-precompiles/pallets/staking/#:~:text=points(u32)){target=_blank}函数
 - **awardedPoints**(*uint32* round, *address* candidate) —— 只读函数，返回在给定轮次中授予给给定收集人的总分。如果返回`0`，可能是因为没有生成区块或者该轮的存储已被删除。使用质押Pallet的[`points`](/builders/pallets-precompiles/pallets/staking/#:~:text=awardedPts(u32, AccountId20)){target=_blank}函数
 - **delegationAmount**(*address* delegator, *address* candidate) —— 只读函数，返回给定委托人为支持给定候选人而委托的金额。使用质押pallet的[`delegatorState`](/builders/pallets-precompiles/pallets/staking/#:~:text=delegatorState(AccountId20)){target=_blank}函数
 - **isInTopDelegations**(*address* delegator, *address* candidate) —— 只读函数，它返回一个布尔值，标示给定的委托人是否在给定候选人的最高委托中。使用质押pallet的[`topDelegations`](/builders/pallets-precompiles/pallets/staking/#:~:text=topDelegations(AccountId20)){target=_blank}函数
 - **minDelegation**() —— 获取最小委托数量的只读函数。使用质押Pallet的`minDelegation`](/builders/pallets-precompiles/pallets/staking/#:~:text=minDelegation()){target=_blank}函数
 - **candidateCount**() —— 获取当前候选收集人数量的只读函数。使用质押Pallet的[`candidatePool`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidatePool()){target=_blank}函数
 - **round**() —— 返回当前轮数的只读函数。使用质押Pallet的[`round`](/builders/pallets-precompiles/pallets/staking/#:~:text=round()){target=_blank}函数
 - **candidateDelegationCount**(*address* candidate) —— 返回指定候选收集人地址的委托数量的只读函数。使用质押Pallet的[`candidateInfo`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidateInfo(AccountId20)){target=_blank}函数
  - **candidateAutoCompoundingDelegationCount**(*address* candidate) —— 只读函数，返回指定候选人的自动复合委托数。 使用质押pallet的[`autoCompoundingDelegations`](/builders/pallets-precompiles/pallets/staking/#:~:text=autoCompoundingDelegations(AccountId20)){target=_blank}函数
 - **delegatorDelegationCount**(*address* delegator) —— 返回指定委托人地址的委托数量的只读函数。使用质押Pallet的[`delegatorState`](/builders/pallets-precompiles/pallets/staking/#:~:text=delegatorState(AccountId20)){target=_blank}函数
 - **selectedCandidates**() —— 获取当前轮次选定候选人的只读函数。使用质押Pallet的[`selectedCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=selectedCandidates()){target=_blank}函数
 - **delegationRequestIsPending**(*address* delegator, *address* candidate) —— 返回一个布尔值以指示给定的委托人是否为给定的候选人提出了尚未执行的委托请求。
 - **candidateExitIsPending**(*address* candidate) —— 返回一个布尔值以指示候选人是否存在尚未执行的退出请求。使用质押Pallet的[`candidateInfo`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidateInfo(AccountId20)){target=_blank}函数
 - **candidateRequestIsPending**(*address* candidate) —— 返回一个布尔值以指示给定候选人是否存在尚未执行的减少绑定请求。使用质押Pallet的[`candidateInfo`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidateInfo(AccountId20)){target=_blank}函数
 - **delegationAutoCompound**(*address* delegator, *address* candidate) —— 返回给定委托人和候选人的委托的自动复合百分比
 - **joinCandidates**(*uint256* amount, *uint256* candidateCount) —— 允许帐户加入拥有指定绑定数量和当前候选人数量的候选收集人集。使用质押Pallet的[`joinCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=joinCandidates(bond, candidateCount)){target=_blank}函数
 - **scheduleLeaveCandidates**(*uint256* candidateCount) —— 为候选收集人发起将自身移除候选池的请求。发起请求并不会自动执行，需要等待[退出延迟](#exit-delays)才可以使用`executeLeaveCandidates`执行请求。 使用质押Pallet的[`scheduleLeaveCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleLeaveCandidates(candidateCount)){target=_blank}函数
 - **executeLeaveCandidates**(*address* candidate, *uint256* candidateDelegationCount) —— 执行离开候选收集人集的可用请求。使用质押Pallet的[`executeLeaveCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=executeLeaveCandidates(candidate, candidateDelegationCount)){target=_blank}函数
 - **cancelLeaveCandidates**(*uint256* candidateCount) —— 使候选人取消待处理的离开候选人池的请求。提供当前候选人池中的候选人数量。使用质押Pallet的[`cancelLeaveCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=cancelLeaveCandidates(candidateCount)){target=_blank}函数
 - **goOffline**() —— 在不解除绑定的情况下暂时离开候选收集人集。使用质押Pallet的[`goOffline`](/builders/pallets-precompiles/pallets/staking/#:~:text=goOffline()){target=_blank}函数
 - **goOnline**() —— 在先前调用goOffline()后，重新加入候选收集人集。使用质押Pallet的[`goOnline`](/builders/pallets-precompiles/pallets/staking/#:~:text=goOnline()){target=_blank}函数
 - **candidateBondMore**(*uint256* more) —— 候选收集人根据指定数量增加绑定数量。使用质押Pallet的[`candidateBondMore`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidateBondMore(more)){target=_blank} 函数
 - **scheduleCandidateBondLess**(*uint256* more) —— 发起减少候选人绑定一定Token数量的请求。发起请求并不会自动执行，需要等待[退出延迟](#exit-delays)才可以通过`executeCandidateBondRequest`函数执行请求。使用质押Pallet的[`scheduleCandidateBondLess`](/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleCandidateBondLess(less)){target=_blank}函数
 - **executeCandidateBondLess**(*address* candidate) —— 执行任何减少指定候选人绑定数量的可用请求。使用质押Pallet的[`executeCandidateBondLess`](/builders/pallets-precompiles/pallets/staking/#:~:text=executeCandidateBondLess(candidate)){target=_blank}函数
 - **cancelCandidateBondLess**() —— 使候选人取消待处理的请求以减少候选人的绑定数量。使用质押Pallet的[`cancelCandidateBondLess`](/builders/pallets-precompiles/pallets/staking/#:~:text=cancelCandidateBondLess()){target=_blank}函数
 - **delegate**(*address* candidate, *uint256* amount, *uint256* candidateDelegationCount, *uint256* delegatorDelegationCount) —— 进行委托以支持收集人候选人，并自动将自动复合的奖励百分比设置为`0`。如果要将百分比设置为自动复合，可以改用`delegateWithAutoCompound`或将此函数与`setAutoCompoud`结合使用。如果执行者并不是委托人，此函数会将其加入委托人集。如果执行者已经是委托人，此函数将会调整其委托数量。使用质押Pallet的[`delegate`](/builders/pallets-precompiles/pallets/staking/#:~:text=delegate){target=_blank}函数
 - **delegateWithAutoCompound**(*address* candidate, *uint256* amount, *uint8* autoCompound, *uint256* candidateDelegationCount, *uint256* candidateAutoCompoundingDelegationCount, *uint256* delegatorDelegationCount) —— 与`delegate`类似，它会授权支持收集人候选人。然而，给定`amount`，一个0-100之间的整数（无小数），这也设置了自动复合的奖励百分比。使用质押pallet的[`delegateWithAutoCompound`](/builders/pallets-precompiles/pallets/staking/#:~:text=delegateWithAutoCompound){target=_blank}函数
 - **scheduleRevokeDelegation**(*address* candidate) —— 发起撤回特定地址候选收集人委托的请求。发起请求并不会自动执行，需要等待[退出延迟](#exit-delays)，您将能够通过`executeDelegationRequest`函数执行请求。使用质押Pallet的[`scheduleRevokeDelegation`](/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleRevokeDelegation(collator)){target=_blank}函数
 - **delegatorBondMore**(*address* candidate, *uint256* more) —— 委托人增加绑定在特定收集人的数量。使用质押Pallet的[`delegatorBondMore`](/builders/pallets-precompiles/pallets/staking/#:~:text=delegatorBondMore(candidate, more)){target=_blank}函数
 - **scheduleDelegatorBondLess**(*address* candidate, *uint256* less) —— 发起委托人减少绑定在特定候选收集人的数量的请求。发起请求并不会自动执行，需要等待[退出延迟](#exit-delays)，您可以通过`executeDelegationRequest`函数执行请求。使用质押Pallet的[`scheduleDelegatorBondLess`](/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleDelegatorBondLess(candidate, less)){target=_blank}函数
 - **executeDelegationRequest**(*address* delegator, *address* candidate) —— 执行任何在提供委托人和候选人地址的情况下的可用委托请求。使用质押Pallet的[`executeDelegationRequest`](/builders/pallets-precompiles/pallets/staking/#:~:text=executeDelegationRequest(delegator, candidate)){target=_blank}函数
 - **cancelDelegationRequest**(*address* candidate) —— 取消提供的候选人地址中任何待处理的委托请求。使用质押Pallet的[`cancelDelegationRequest`](/builders/pallets-precompiles/pallets/staking/#:~:text=cancelDelegationRequest(candidate)){target=_blank}函数
 - **setAutoCompound**(*address* candidate, *uint8* value, *uint256* candidateAutoCompoundingDelegationCount, *uint256* delegatorDelegationCount) —— 给定`value`一个0-100之间的的整数（无小数），为现有委托设置自动复合值。 使用质押pallet的[`setAutoCompound`](/builders/pallets-precompiles/pallets/staking/#:~:text=setAutoCompound){target=_blank}函数
 - **getDelegatorTotalStaked**(*address* delegator) —— 只读函数，返回给定委托人的总质押金额，与候选人无关。使用质押pallet 的[`delegatorState`](/builders/pallets-precompiles/pallets/staking/#:~:text=delegatorState(AccountId20)){target=_blank}函数
 - **getCandidateTotalCounted**(*address* candidate) —— 只读函数，返回给定候选人的质押总额。使用质押pallet的[`candidateInfo`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidateInfo(AccountId20)){target=_blank}函数

从运行时1800开始，以下方法已被**弃用**：

 - **scheduleLeaveDelegators**() —— 发起离开委托人集并撤回所有进行中的委托的请求。发起请求并不会自动执行，需要等待[退出延迟](#exit-delays)，您可以通过`executeLeaveDelegators`函数执行请求。可以使用[批量处理方法](/builders/pallets-precompiles/pallets/utility/#using-the-batch-extrinsics){target=_blank}来打包多个`scheduleLeaveDelegators`请求
 - **executeLeaveDelegators**(*address* delegator, *uint256* delegatorDelegationCount) —— 执行离开委托人集和撤回所有委托的可用请求。可以使用[批量处理方法](/builders/pallets-precompiles/pallets/utility/#using-the-batch-extrinsics){target=_blank}来打包多个`executeLeaveDelegators`请求
 - **cancelLeaveDelegators**() —— 取消待处理的离开委托人集的请求。可以使用[批量处理方法](/builders/pallets-precompiles/pallets/utility/#using-the-batch-extrinsics){target=_blank}来打包多个`cancelLeaveDelegators`请求

 从运行时1001开始，以下方法已被**弃用**，并且从运行时1800开始，已被删除：

 - **is_nominator**(*address* nominator) —— 检查指定地址当前是否为质押委托人的只读函数。请改用`isDelegator`
 - **min_nomination**() —— 获取最低委托数量的只读函数。请改用`minDelegation`
 - **collator_nomination_count**(*address* collator) —— 返回指定收集人地址委托数量的只读函数。请改用`candidateDelegationCount`
 - **nominator_nomination_count**(*address* nominator) —— 返回指定委托人地址委托数的只读函数。请改用`delegatorDelegationCount`
 - **leave_candidates**(*uint256* amount, *uint256* candidateCount) —— 立即从候选收集人池中删除帐户以防止其他人将其选为收集人，并触发解绑。请改用`scheduleLeaveCandidates`和`executeLeaveCandidates`
 - **candidate_bond_less**(*uint256* less) —— 候选收集人根据指定数量减少绑定数量。请改用`scheduleCandidateBondLess`和`execute_candidate_bond_less`
 - **nominate**(*address* collator, *uint256* amount, *uint256* collatorNominationCount, *uint256* nominatorNominationCount) —— 如果执行者并不是委托人，此函数将会将其加入委托人集。如果执行者已经是委托人，此函数将会修改其委托数量。请改用`delegate`
 - **leave_nominators**(*uint256* nominatorNominationCount) —— 离开委托人集并撤销所有正在进行中的委托。请改用`scheduleLeaveDelegators`和`executeLeaveDelegators`
 - **revoke_nominations**(*address* collator) —— 撤销指定委托。请改用`scheduleRevokeDelegation`和`executeDelegationRequest`
 - **nominatorBondMore**(*address* collator, *uint256* more) —— 委托人对指定收集人增加绑定的具体数量。请改用`delegatorBondMore`
 - **nominator_bond_less**(*address* collator, *uint256* less) —— 委托人对指定收集人减少绑定的具体数量。请改用`scheduleDelegatorBondLess`和`executeDelegationRequest`

## 与Solidity接口进行交互 {: #interact-with-solidity-interface }

### 查看先决条件 {: #checking-prerequisites } 

以下的示例将会在Moonbase Alpha上演示。同样适用于其他网络，包括Moonbeam和Moonriver。

 - 安装MetaMask并将其[连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - 账户余额至少`{{networks.moonbase.staking.min_del_stake}}`枚
 --8<-- 'text/faucet/faucet-list-item.md'

!!! 注意事项
    由于需要最低的委托数量以及gas费用，以下示例中需要持有超过`{{networks.moonbase.staking.min_del_stake}}`枚Token才可进行操作。若想获取更多超过水龙头分配的Token，请随时通过Discord联系我们，我们很高兴为您提供帮助。

### Remix设置 {: #remix-set-up }

1. 点击**File explorer**标签
2. 获得[`StakingInterface.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)的复制文档，并将文档内容复制并粘贴至名为`StakingInterface.sol`的Remix文档

![Copying and Pasting the Staking Interface into Remix](/images/builders/pallets-precompiles/precompiles/staking/new/staking-1.png)

### 编译合约 {: #compile-the-contract }  

1. 点击（从上至下的）第二个**Compile**标签
2. 点击**Compile StakingInterface.sol**编译该接口

![Compiling StakingInteface.sol](/images/builders/pallets-precompiles/precompiles/staking/new/staking-2.png)

### 读取合约 {: #access-the-contract } 

1. 点击Remix界面中**Compile**标签正下方的**Deploy and Run**标签。注意：我们现在并不是在这里部署合约，而是使用先前部署的预编译合约
2. 确认已选取**ENVIRONMENT**下拉菜单中的**Injected Provider - Metamask**
3. 确认已在**CONTRACT**下拉菜单中勾选**ParachainStaking - Stakinginterface.sol**。另外，因为这是一个预编译合约，无需进行部署。相反地，我们将会在**At Address**字段提供预编译的地址
4. 为Moonbase Alpha提供质押预编译的地址：`{{networks.moonbase.precompiles.staking}}`并点击**At Address**
5. 平行链质押预编译将出现在**Deployed Contracts**列表

![Provide the address](/images/builders/pallets-precompiles/precompiles/staking/new/staking-3.png)

### 使用自动复合委托一个收集人 {: #delegate-a-collator }

在本示例中，您需要在Moonbase Alpha上委托一个收集人并设置自动复合奖励百分比。委托人持有Token，并为特定的候选人提供担保。所有用户只要在他们的自由余额中持有超过{{networks.moonbase.staking.min_del_stake}}枚可用Token皆可成为委托人。委托候选人时，您可以同时设置自动复合。 您将能够指定奖励的百分比，该百分比将自动应用于您的总委托。 您不必立即设置自动复合，您可以稍后再设置。

您可自行研究并选择想要委托的候选人。在本教程中，我们将使用以下候选人地址：`{{ networks.moonbase.staking.candidates.address1 }}`。

想要委托一个候选人，您将需要确定候选人的当前委托计数，他们自动复合的委托计数和您自己的委托数量。

候选人的委托计数是支持指定候选人的委托计数。获取候选人的委托数量，您需要调用质押预编译提供的函数。在**Deployed Contracts**列表下找到**PARACHAINSTAKING**合约，然后执行以下操作：

1. 找到**candidateDelegationCount**函数并展开面板
2. 输入候选人地址（`{{ networks.moonbase.staking.candidates.address1 }}`）
3. 点击**call**
4. 调用完成后，将会显示结果

![Call collator delegation count](/images/builders/pallets-precompiles/precompiles/staking/new/staking-4.png)

自动复合委托计数是配置了自动复合的委托数量。要确定已设置自动复合的委托数量，您可以

1. 找到**candidateAutoCompoundingDelegationCount**函数并展开面板
2. 输入候选人地址 (`{{ networks.moonbase.staking.candidates.address1 }}`)
3. 点击**call**
4. 调用完成后，将会显示结果

![Get candidate auto-compounding delegation count](/images/builders/pallets-precompiles/precompiles/staking/new/staking-5.png)

您需要检索的最后一项是您的委托计数。如果您不知道现有的委托数量，您可以执行以下步骤获得：

1. 找到**delegatorDelegationCount**函数并展开面板
2. 输入地址
3. 点击**call**
4. 调用完成后，将会显示结果

![Call delegator delegation count](/images/builders/pallets-precompiles/precompiles/staking/new/staking-6.png)

现在，您已获取[候选人的委托数量](#:~:text=获取候选人的委托数量)、[自动复合委托计数](#:~:text=要确定已设置自动复合的委托数量)和您的[现有委托数量](#:~:text=如果您不知道现有的委托数量)，您已拥有委托候选人和设置自动复合所需的所有信息。您可以开始：

1. 找到**delegateWithAutoCompound**函数并展开面板
2. 输入您希望委托的候选人地址。例如，您可以使用`{{ networks.moonbase.staking.candidates.address1 }}`
3. 提供以Wei为单位的委托数量。最低委托的Token数量为`{{networks.moonbase.staking.min_del_stake}}`，所以以Wei为单位的最低委托数量是`{{networks.moonbase.staking.min_del_stake_wei}}`
4. 输入一个0-100之间的整数（无小数），代表奖励自动复合的百分比
5. 输入候选人的委托数量
6. 输入候选人的自动复合委托数量
7. 输入您的委托数量
8. 点击**transact**
9. MetaMask将跳出弹窗，请查看详情并确认交易

![Delegate a Collator](/images/builders/pallets-precompiles/precompiles/staking/new/staking-7.png)

如果您想在不设置自动复合的情况下进行委托，您可以按照前面的步骤操作，但您可以使用**delegate**函数而不是使用**delegateWithAutoCompound**。

### 验证委托 {: #verify-delegation }

您可以在Polkadot.js Apps查看链状态以验证您的委托是否成功。首先，将MetaMask地址加入[Polkadot.js Apps地址簿](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/addresses){target=_blank}。

导航至**Accounts**，选择**Address Book**，点击**Add contact**，输入以下信息：

1. 添加您的MetaMask地址
2. 为账户提供一个昵称
3. 点击**Save**

![Add to Address Book](/images/builders/pallets-precompiles/precompiles/staking/new/staking-8.png)

要验证您的委托是否成功，请前往[Polkadot.js 应用程序](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/chainstate){target=_blank}并导航到**Developer**然后点击**Chain State**

1. 选择**parachainStaking** Pallet
2. 选择**delegatorState**查询
3. 输入您的地址
4. 通常，您可以启用**include option**滑块如果您希望提供特定区块哈希以便查询
5. 点击**+**按钮返回结果并验证您的委托

!!! 注意事项
    如果您想要查看委托概述，无需在**blockhash to query at**字段中输入任何内容。

![Verify delegation](/images/builders/pallets-precompiles/precompiles/staking/new/staking-9.png)

### 确认自动复合百分比 {: #confirm-auto-compounding }

您可以使用Solidity接口的`delegationAutoCompound`函数确认您在Remix中设置为自动复合的奖励百分比：

1. 找到并展开**delegationAutoCompound**
2. 输入您用于委托的帐户
3. 输入您委托的候选人
4. 点击**call**
5. 回复会出现在**call**按钮下方

![Verify auto-compound percentage](/images/builders/pallets-precompiles/precompiles/staking/new/staking-10.png)

### 设置或改变自动复合百分比 {: #set-or-change-auto-compounding }

如果您最初设置您的委托时没有设置自动复合，或者如果您想更新具有自动复合设置的现有委托的百分比，则可以使用Solidity接口的`setAutoCompound`函数。

您需要为您要为其设置或更新自动复合的候选人获取设置了自动复合的委托数量。 您还需要检索您自己的委托数量。您可以按照[使用自动复合委托一个收集人](#delegate-a-collator)部分中的说明获取这两项。

获得必要信息后，您可以在Remix中执行以下步骤：

1. 找到并展开**setAutoCompound**
2. 输入您要为其设置或更新自动复合的候选人的帐户
3. 输入一个0-100间的数字代表你想要自动复合的奖励百分比
4. 输入候选人的自动复合委托数量
5. 输入您的委托数量
6. 点击**transact**
7. MetaMask将跳出弹窗，请查看详情并确认交易

![Set or update auto-compound percentage](/images/builders/pallets-precompiles/precompiles/staking/new/staking-11.png)

### 撤销一个委托 {: #revoking-a-delegation }

在runtime升级（[runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/){target=_blank}）中，用户与质押功能的交互方式进行了重大升级，其中包含取消质押的方式。

目前取消质押需要您发起离开或是撤回委托的请求，等待延迟时段，然后执行请求。

您可以使用`scheduleRevokeDelegation`函数撤销对特定候选人的委托并收回您的Token。发起请求并不会自动撤销您的委托，您需要等待延迟时段，并通过`executeDelegationRequest` 函数执行请求。发起请求并不会自动执行，需要等待[退出延迟](#exit-delays)，您将能够通过`executeDelegationRequest`函数执行请求。

回到Remix以撤销对特定候选人的委托并收回您的Token，并执行以下步骤操作：

1. 找到并展开**scheduleRevokeDelegation**
2. 输入您希望撤销委托的候选收集人地址
3. 点击**transact**
4. MetaMask将跳出弹窗，请查看详情并点击**Confirm**

![Revoke delegation](/images/builders/pallets-precompiles/precompiles/staking/new/staking-12.png)

当交易成功确认，您将会需要等待延迟时段后才能为您执行撤回委托的请求。如果您尝试在延迟时段前操作，该操作将会失败

当已经过延迟时段，您能够回到Remix并遵循以下步骤以执行可用请求：

1. 找到并展开**executeDelegationRequest**
2. 输入您希望撤销委托的候选委托人地址
3. 输入您希望撤销委托的候选收集人地址
4. 点击**transact**
5. MetaMask将跳出弹窗，请查看详情并点击**Confirm**

当已完成操作，特定委托人对特定候选收集人的委托将会被撤回并显示。同时您也可以在Polkadot.js Apps上检查您的委托人状态。

如果因任何因素您希望取消待处理的撤销委托请求，您可以在Remix上执行以下步骤：

1. 找到并展开**cancelDelegationRequest**
2. 输入您希望撤销委托的候选收集人地址
3. 点击**transact**
4. MetaMask将跳出弹窗，请查看详情并点击**Confirm**

您可以在Polkadot.js Apps上再次检查您的委托人状态，确认其仍在进行中。