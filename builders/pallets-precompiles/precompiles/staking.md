---
title: 质押预编译
description: 了解如何使用质押预编译，允许开发人员使用Ethereum API访问质押功能。
keywords: 标准合约, 以太坊, moonbeam, 预编译, 智能合约, solidity
---

# 与质押预编译交互

![Staking Moonbeam Banner](/images/builders/pallets-precompiles/precompiles/staking/staking-banner.png)

## 概览 {: #introduction }

Moonbeam使用一种名为[平行链质押](/builders/pallets-precompiles/pallets/staking){target=_blank}的委托权益证明Pallet，使Token持有者（委托人）能够准确表达他们愿意支持的候选收集人以及希望质押的数量。除此之外，平行链质押Pallet的设计也将使链上的委托人和候选收集人共享风险与回报。

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

[StakingInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)是一个接口，通过Solidity合约与平行链质押交互。因此，Solidity开发者无需学习Substrate API，即可使用熟悉的以太坊界面操作质押功能。

接口包含以下的函数：

 - **is_delegator**(*address* delegator) —— 检查指定地址当前是否为质押委托人的只读函数。使用质押Pallet的[`delegatorState`](/builders/pallets-precompiles/pallets/staking/#:~:text=delegatorState(AccountId20)){target=_blank}函数
 - **is_candidate**(*address* candidate) —— 检查指定地址当前是否为候选收集人的只读函数。使用质押Pallet的[`candidateState`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidateState(AccountId20)){target=_blank}函数
 - **is_selected_candidate**(*address* candidate) —— 检查指定地址当前是否为活跃收集人集其中一部分的只读函数。使用质押Pallet的[`selectedCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=selectedCandidates()){target=_blank}函数
 - **points**(*uint256* round) —— 获取在给定轮次中授予所有收集人总分的只读函数。使用质押Pallet的[`points`](/builders/pallets-precompiles/pallets/staking/#:~:text=points(u32)){target=_blank}函数
 - **min_delegation**() —— 获取最小委托数量的只读函数。使用质押Pallet的`minDelegation`](/builders/pallets-precompiles/pallets/staking/#:~:text=minDelegation()){target=_blank}函数
 - **candidate_count**() —— 获取当前候选收集人数量的只读函数。使用质押Pallet的[`candidatePool`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidatePool()){target=_blank}函数
 - **round**() - 返回当前轮数的只读函数。使用质押Pallet的[`round`](/builders/pallets-precompiles/pallets/staking/#:~:text=round()){target=_blank}函数
 - **candidate_delegation_count**(*address* candidate) —— 返回指定候选收集人地址的委托数量的只读函数。使用质押Pallet的[`candidateInfo`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidateInfo(AccountId20)){target=_blank}函数
 - **delegator_delegation_count**(*address* delegator) —— 返回指定委托人地址的委托数量的只读函数。使用质押Pallet的[`delegatorState`](/builders/pallets-precompiles/pallets/staking/#:~:text=delegatorState(AccountId20)){target=_blank}函数
 - **selected_candidates**() - 获取当前轮次选定候选人的只读函数。使用质押Pallet的[`selectedCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=selectedCandidates()){target=_blank}函数
 - **delegation_request_is_pending**(*address* delegator, *address* candidate) - 返回一个布尔值以指示给定的委托人是否为给定的候选人提出了尚未执行的委托请求。
 - **delegator_exit_is_pending**(*address* delegator) - 返回一个布尔值以指示委托人是否存在尚未执行的退出请求。
 - **candidate_exit_is_pending**(*address* candidate) - 返回一个布尔值以指示候选人是否存在尚未执行的退出请求。使用质押Pallet的[`candidateInfo`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidateInfo(AccountId20)){target=_blank}函数
 - **candidate_request_is_pending**(*address* candidate) - 返回一个布尔值以指示给定候选人是否存在尚未执行的减少绑定请求。使用质押Pallet的[`candidateInfo`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidateInfo(AccountId20)){target=_blank}函数
 - **join_candidates**(*uint256* amount, *uint256* candidateCount) —— 允许帐户加入拥有指定绑定数量和当前候选人数量的候选收集人集。使用质押Pallet的[`joinCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=joinCandidates(bond, candidateCount)){target=_blank}函数
 - **schedule_leave_candidates**(*uint256* candidateCount) —— 为候选收集人发起将自身移除候选池的请求。发起请求并不会自动执行，需要等待[退出延迟](#exit-delays)才可以使用`execute_leave_candidates`执行请求。 使用质押Pallet的[`scheduleLeaveCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleLeaveCandidates(candidateCount)){target=_blank}函数
 - **execute_leave_candidates**(*address* candidate, *uint256* candidateDelegationCount) —— 执行离开候选收集人集的可用请求。使用质押Pallet的[`executeLeaveCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=executeLeaveCandidates(candidate, candidateDelegationCount)){target=_blank}函数
 - **cancel_leave_candidates**(*uint256* candidateCount) —— 使候选人取消待处理的离开候选人池的请求。提供当前候选人池中的候选人数量。使用质押Pallet的[`cancelLeaveCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=cancelLeaveCandidates(candidateCount)){target=_blank}函数
 - **go_offline**() —— 在不解除绑定的情况下暂时离开候选收集人集。使用质押Pallet的[`goOffline`](/builders/pallets-precompiles/pallets/staking/#:~:text=goOffline()){target=_blank}函数
 - **go_online**() —— 在先前调用go_offline()后，重新加入候选收集人集。使用质押Pallet的[`goOnline`](/builders/pallets-precompiles/pallets/staking/#:~:text=goOnline()){target=_blank}函数
 - **candidate_bond_more**(*uint256* more) —— 候选收集人根据指定数量增加绑定数量。使用质押Pallet的[`candidateBondMore`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidateBondMore(more)){target=_blank} 函数
 - **schedule_candidate_bond_less**(*uint256* more) —— 发起减少候选人绑定一定Token数量的请求。发起请求并不会自动执行，需要等待[退出延迟](#exit-delays)才可以通过`execute_candidate_bond_request`函数执行请求。使用质押Pallet的[`scheduleCandidateBondLess`](/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleCandidateBondLess(less)){target=_blank}函数
 - **execute_candidate_bond_request**(*address* candidate) —— 执行任何减少指定候选人绑定数量的可用请求。使用质押Pallet的[`executeCandidateBondLess`](/builders/pallets-precompiles/pallets/staking/#:~:text=executeCandidateBondLess(candidate)){target=_blank}函数
 - **cancel_candidate_bond_request**() —— 使候选人取消待处理的减少候选人绑定数量的请求。使用质押Pallet的[`cancelCandidateBondLess`](/builders/pallets-precompiles/pallets/staking/#:~:text=cancelCandidateBondLess()){target=_blank}函数
 - **delegate**(*address* candidate, *uint256* amount, *uint256* candidateDelegationCount, *uint256* delegatorDelegationCount) —— 如果执行者并不是委托人，此函数会将其加入委托人集。如果执行者已经是委托人，此函数将会调整其委托数量。使用质押Pallet的[`delegate`](/builders/pallets-precompiles/pallets/staking/#:~:text=delegate(candidate, amount, candidateDelegationCount, delegationCount)){target=_blank}函数
 - **schedule_leave_delegators**() —— 发起离开委托人集并撤回所有进行中的委托的请求。发起请求并不会自动执行，需要等待[退出延迟](#exit-delays)，您可以通过`execute_leave_delegators`函数执行请求。使用质押Pallet的[`scheduleLeaveDelegators`](/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleLeaveDelegators()){target=_blank}函数
 - **execute_leave_delegators**(*address* delegator, *uint256* delegatorDelegationCount) —— 执行离开委托人集和撤回所有委托的可用请求。使用质押Pallet的[`executeLeaveDelegators`](/builders/pallets-precompiles/pallets/staking/#:~:text=executeLeaveDelegators(delegator, delegationCount)){target=_blank}函数
 - **cancel_leave_delegators**() —— 取消待处理的离开委托人集的请求。使用质押Pallet的[`cancelLeaveDelegators`](/builders/pallets-precompiles/pallets/staking/#:~:text=cancelLeaveDelegators()){target=_blank}函数
 - **schedule_revoke_delegation**(*address* candidate) —— 发起撤回特定地址候选收集人委托的请求。发起请求并不会自动执行，需要等待[退出延迟](#exit-delays)，您将能够通过`execute_delegation_request`函数执行请求。使用质押Pallet的[`scheduleRevokeDelegation`](/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleRevokeDelegation(collator)){target=_blank}函数
 - **delegator_bond_more**(*address* candidate, *uint256* more) —— 委托人增加绑定在特定收集人的数量。使用质押Pallet的[`delegatorBondMore`](/builders/pallets-precompiles/pallets/staking/#:~:text=delegatorBondMore(candidate, more)){target=_blank}函数
 - **schedule_delegator_bond_less**(*address* candidate, *uint256* less) —— 发起委托人减少绑定在特定候选收集人的数量的请求。发起请求并不会自动执行，需要等待[退出延迟](#exit-delays)，您可以通过`execute_delegation_request`函数执行请求。使用质押Pallet的[`scheduleDelegatorBondLess`](/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleDelegatorBondLess(candidate, less)){target=_blank}函数
 - **execute_delegation_request**(*address* delegator, *address* candidate) —— 执行任何在提供委托人和候选人地址的情况下的可用委托请求。使用质押Pallet的[`executeDelegationRequest`](/builders/pallets-precompiles/pallets/staking/#:~:text=executeDelegationRequest(delegator, candidate)){target=_blank}函数
 - **cancel_delegation_request**(*address* candidate) —— 取消提供的候选人地址中任何待处理的委托请求。使用质押Pallet的[`cancelDelegationRequest`](/builders/pallets-precompiles/pallets/staking/#:~:text=cancelDelegationRequest(candidate)){target=_blank}函数

以下的函数已被**弃用**，将会在近期移除：

 - **is_nominator**(*address* nominator) —— 检查指定地址当前是否为质押委托人的只读函数
 - **min_nomination**() —— 获取最低委托数量的只读函数
 - **collator_nomination_count**(*address* collator) —— 返回指定收集人地址委托数量的只读函数
 - **nominator_nomination_count**(*address* nominator) —— 返回指定委托人地址委托数的只读函数
 - **leave_candidates**(*uint256* amount, *uint256* candidateCount) —— 立即从候选收集人池中删除帐户以防止其他人将其选为收集人，并触发解绑
 - **candidate_bond_less**(*uint256* less) —— 候选收集人根据指定数量减少绑定数量
 - **nominate**(*address* collator, *uint256* amount, *uint256* collatorNominationCount, *uint256* nominatorNominationCount) —— 如果执行者并不是委托人，此函数将会将其加入委托人集。如果执行者已经是委托人，此函数将会修改其委托数量
 - **leave_nominators**(*uint256* nominatorNominationCount) —— 离开委托人集并撤销所有正在进行中的委托
 - **revoke_nominations**(*address* collator) —— 撤销指定委托
 - **nominator_bond_more**(*address* collator, *uint256* more) —— 委托人对指定收集人增加绑定的具体数量
 - **nominator_bond_less**(*address* collator, *uint256* less) —— 委托人对指定收集人减少绑定的具体数量

## 与Solidity接口进行交互 {: #interact-with-solidity-interface }

### 查看先决条件 {: #checking-prerequisites } 

以下的示例将会在Moonbase Alpha上演示。同样适用于其他网络，包括Moonbeam和Moonriver。

 - 安装MetaMask并将其[连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - 账户余额至少`{{networks.moonbase.staking.min_del_stake}}`枚Dev
 --8<-- 'text/faucet/faucet-list-item.md'

!!! 注意事项
    由于需要最低的委托数量以及gas费用，以下示例中需要持有超过`{{networks.moonbase.staking.min_del_stake}}`枚Token才可进行操作。若想获取更多超过水龙头分配的Token，请随时通过Discord联系我们，我们很高兴为您提供帮助。

### Remix设置 {: #remix-set-up }

1. 获得[`StakingInterface.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)的复制文档
2. 将文档内容复制并粘贴至名为`StakingInterface.sol`的Remix文档

![Copying and Pasting the Staking Interface into Remix](/images/builders/pallets-precompiles/precompiles/staking/staking-1.png)

### 编译合约 {: #compile-the-contract }  

1. 点击（从上至下的）第二个**Compile**标签
2. 点击**Compile StakingInterface.sol**编译[Staking Interface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)

![Compiling StakingInteface.sol](/images/builders/pallets-precompiles/precompiles/staking/staking-2.png)

### 读取合约 {: #access-the-contract } 

1. 点击Remix界面中**Compile**标签正下方的**Deploy and Run**标签。注意：我们现在并不是在这里部署合约，而是使用先前部署的预编译合约
2. 确认已选取**ENVIRONMENT**下拉菜单中的**Injected Web3**
3. 确认已在**CONTRACT**下拉菜单中勾选**ParachainStaking - Stakinginterface.sol**。另外，因为这是一个预编译合约，无需进行部署。相反地，我们将会在**At Address**字段提供预编译的地址
4. 为Moonbase Alpha提供质押预编译的地址：`{{networks.moonbase.staking.precompile_address}}`并点击**At Address**
5. 平行链质押预编译将出现在**Deployed Contracts**列表

![Provide the address](/images/builders/pallets-precompiles/precompiles/staking/staking-3.png)

### 委托一个收集人 {: #delegate-a-collator }

在本示例中，您需要在Moonbase Alpha上委托一个收集人。委托人持有Token，并为担保的收集人质押。所有用户只要持有超过{{networks.moonbase.staking.min_del_stake}}枚可用Token皆可成为委托人。

您可自行研究并选择想要委托的候选人。在本教程中，我们将使用以下候选人地址：`{{ networks.moonbase.staking.candidates.address1 }}`。

想要委托一个候选人，您将需要确定当前候选人的委托人数和委托人的委托数量。候选人的委托人数是支持指定候选人的委托人数。委托人的委托数量是委托人参与委托的次数。

获取候选人的委托人数量，您需要调用质押预编译提供的函数。在**Deployed Contracts**列表下找到**PARACHAINSTAKING**合约，然后执行以下操作：

1. 找到**candidate_delegation_count**函数并展开面板
2. 输入候选人地址（`{{ networks.moonbase.staking.candidates.address1 }}`）
3. 点击**call**
4. 调用完成后，将会显示结果

![Call collator delegation count](/images/builders/pallets-precompiles/precompiles/staking/staking-4.png)

如果您不知道现有的委托数量，您可以执行以下步骤获得：

1. 找到**delegator_delegation_count**函数并展开面板
2. 输入地址
3. 点击**call**
4. 调用完成后，将会显示结果

![Call delegator delegation count](/images/builders/pallets-precompiles/precompiles/staking/staking-5.png)

现在，您已获取[候选人的委托人数](#get-the-candidate-delegator-count)和[现有委托数量](#:~:text=如果您不知道现有的委托数量)，接下来您可以开始委托一个收集人。为此，您需要执行以下操作：

1. 找到**delegate**函数并展开面板
2. 输入您希望委托的收集人地址（`{{ networks.moonbase.staking.candidates.address1 }}`）
3. 提供以Wei为单位的委托数量。最低委托的Token数量为`{{networks.moonbase.staking.min_del_stake}}`，所以以Wei为单位的最低委托数量是`5000000000000000000`
4. 输入候选人的委托数量
5. 输入您的委托数量
6. 点击**transact**
7. MetaMask将跳出弹窗，请查看详情并确认交易

![Delegate a Collator](/images/builders/pallets-precompiles/precompiles/staking/staking-6.png)

### 验证委托 {: #verify-delegation }

您可以在Polkadot.js Apps查看链状态以验证您的委托是否成功。首先，[将MetaMask地址加入Polkadot.js Apps地址簿](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/addresses)。

1. 导向至**Accounts**，选择**Address Book**
2. 点击**Add contact**
3. 添加您的MetaMask地址
4. 为账户提供一个昵称
5. 点击**Save**

![Add to Address Book](/images/builders/pallets-precompiles/precompiles/staking/staking-7.png)

要验证您的委托是否成功，请前往[Polkadot.js 应用程序](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/chainstate){target=_blank}并导航到**Developer**然后点击**Chain State**

1. 选择**parachainStaking** Pallet
2. 选择**delegatorState**查询
3. 输入您的地址
4. 通常，您可以启用**include option**滑块如果您希望提供特定区块哈希以便查询
5. 点击**+**按钮返回结果并验证您的委托

!!! 注意事项
    如果您想要查看委托概述，无需在**blockhash to query at**字段中输入任何内容。

![Verify delegation](/images/builders/pallets-precompiles/precompiles/staking/staking-8.png)

### 撤销一个委托 {: #revoking-a-delegation }

在runtime升级（[runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/)）中，用户与质押功能的交互方式进行了重大升级，其中包含取消质押的方式。

目前取消质押需要您发起离开或是撤回委托的请求，等待延迟时段，然后执行请求。

您可以使用`scheduleRevokeDelegation`函数撤销对特定候选人的委托并收回您的Token。发起请求并不会自动撤销您的委托，您需要等待延迟时段，并通过`executeDelegationRequest` 函数执行请求。发起请求并不会自动执行，需要等待[退出延迟](#exit-delays)，您将能够通过`executeDelegationRequest`函数执行请求。

回到Remix以撤销对特定候选人的委托并收回您的Token，并执行以下步骤操作：

1. 在**Deployed Contract**列表中，找到并展开**schedule_revoke_delegation**
2. 输入您希望撤销委托的候选收集人地址
3. 点击**transact**
4. MetaMask将跳出弹窗，请查看详情并点击**confirm**

![Revoke delegation](/images/builders/pallets-precompiles/precompiles/staking/staking-9.png)

当交易成功确认，您将会需要等待延迟时段后才能为您执行撤回委托的请求。如果您尝试在延迟时段前操作，该操作将会失败

当已经过延迟时段，您能够回到Remix并遵循以下步骤以执行可用请求：

1. 在**Deployed Contract**列表中，找到并展开**execute_delegation_request**
2. 输入您希望撤销委托的候选委托人地址
3. 输入您希望撤销委托的候选收集人地址
4. 点击**transact**
5. MetaMask将跳出弹窗，请查看详情并点击**Confirm**

当已完成操作，特定委托人对特定候选收集人的委托将会被撤回并显示。同时您也可以在Polkadot.js Apps上检查您的委托人状态。

如果因任何因素您希望取消待处理的撤销委托请求，您可以在Remix上执行以下步骤：

1. 在**Deployed Contract**列表中，找到并展开**cancel_delegation_request**
2. 输入您希望撤销委托的候选收集人地址
3. 点击**transact**
4. MetaMask将跳出弹窗，请查看详情并点击**Confirm**

您可以在Polkadot.js Apps上再次检查您的委托人状态，确认其仍在进行中。