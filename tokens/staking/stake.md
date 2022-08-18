---
title: 如何质押您的MOVR和GLMR代币
description: 了解如何通过委托收集人在Moonbeam上质押代币并获得奖励。
---

# 如何质押Token

![Staking Moonbeam Banner](/images/tokens/staking/stake/stake-banner.png)

## 概览 {: #introduction }

获得最高质押量的候选收集人（区块生产者）可加入有效收集人池，入选后将负责为中继链提供区块。

Token持有者可以向候选人质押自己的Token，这一过程称为委托（也称为质押）。通过这种方式，Token持有者为特定候选人进行担保，而他们的委托行为则被视为对收集人的信任。进行委托时，Token会被立即扣除，并添加到用户质押的总金额中。退出流程现被分为两个动作：计划（scheduling）和执行（execution）。首先，Token持有者需要发送请求（即计划）以进行退出流程，等待退出生效期或解绑期（视网络情况而定）。在解绑期之后，用户可以执行他们的计划（scheduling）行动。

候选人加入到收集人有效集后，他们就有资格生产区块并获得部分区块奖励（Token通胀模型的一部分）。考虑到委托人对收集人在网络中质押的贡献比例，收集人与委托人共享质押奖励。

本教程将向您展示如何通过Polkadot.js Apps在Moonbase Alpha上质押。此教程同样适用于Moonbeam和Moonriver。如果希望简单质押Token，持有者可以使用[Moonbeam dApp](https://apps.moonbeam.network/){target=_blank}来进行操作。

有关质押的更多基本信息，请查看[Moonbeam质押](/learn/features/staking/){target=_blank}概述。

## Extrinsic定义 {: #extrinsics-definitions } 

质押pallet有很多Extrinsic，本教程无法逐一进行介绍。但以下列表已经囊括与委托流程相关的Extrinsic。在[runtime升级到1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/){target=_blank}之后，一些Extrinsic已经弃用。

!!! 注意事项

​    随着质押pallet不断升级，Extrinsic将来可能发生变化。

### 加入或离开委托人集 {: #join-or-leave-the-delegator-set }

 - **delegate**(*address* candidate, *uint256* amount, *uint256* candidateDelegationCount, *uint256* delegatorDelegationCount) —— 委托收集人。数额需要大于最低委托质押量。取代已弃用的`nominate`函数
 - **scheduleLeaveDelegators**() —— 计划离开委托人集。在您通`executeLeaveDelegators`函数执行请求前，需经过一个[退出延迟](/learn/features/staking/#quick-reference/#:~:text=退出委托人集延迟){target=_blank}，随后才能执行请求。取代已弃用的`leaveNominators`函数
 - **executeLeaveDelegators**(*uint256* delegatorDelegationCount) —— 执行离开委托人集。该函数仅用于已在计划之内的离开行为，且退出已生效之后。最终，所有正在进行的委托将被撤销
 - **cancelLeaveDelegators**() —— 取消已在离开计划的委托人集的请求

以下外部函数已弃用：

 - **nominate**(*address* collator, *uint256* amount, *uint256* collatorNominationCount, *uint256* nominatorNominationCount) —— 委托收集人的函数。数额需要大于最低委托质押量
 - **leaveNominators**(*uint256* nominatorNominationCount) —— 离开委托人集的函数。最终，所有正在进行的委托将被撤销

### 绑定更多Token或减少绑定Token {: #bond-more-or-less }

 - **delegatorBondMore**(*address* candidate, *uint256* more) —— 向已经委托的收集人增加质押Token数量的请求。取代已弃用的`nominatorBondMore`函数
 - **scheduleDelegatorBondLess**(*address* candidate, *uint256* less) —— 对已经委托的收集人减少质押Token数量的请求。该数额不得使您的总质押量低于最低委托质押量。在您通过`executeDelegationRequest`执行请求前，需经过一个[退出延迟](/learn/features/staking/#quick-reference/#:~:text=减少委托时长){target=_blank}，随后才能执行请求。取代已弃用的`nominatorBondLess`函数
 - **executeDelegationRequest**(*address* candidate) —— 对一个特定候选人减少绑定的执行行为。该函数仅用于已计划的绑定请求，且退出已生效之后
 - **scheduleCandidateBondLess**(*uint256* less) - 允许收集人候选人请求将其自绑定减少给定数量的extrinsic。在您通过`executeCandidateBondLess`执行请求前，需经过一个[退出延迟](/learn/features/staking/#quick-reference/#:~:text=减少委托时长){target=_blank}，随后才能执行请求。
 - **executeCandidateBondLess**(*address* 候选人) - 执行减少候选人的自绑定请求。该函数仅用于已计划的绑定减少请求，且退出已生效之后
 - **cancelCandidateBondLess**() —— 取消已计划的对特定候选人增加或者减少绑定的请求

以下外部函数已弃用：

 - **nominatorBondLess**(*address* collator, *uint256* less) —— 对已委托的收集人减少质押Token数量。该数额不得使您的总质押量低于最低委托质押量
 - **nominatorBondMore**(*address* collator, *uint256* more) —— 对已委托的收集人增加质押Token数量

### 撤销委托 {: #revoke-delegations }

 - **scheduleRevokeDelegation**(*address* collator) —— 计划完全撤销现有的委托。在您通过`executeDelegationRequest`执行请求前，需经过一个[退出延迟](/learn/features/staking/#quick-reference/#:~:text=取消委托延迟){target=_blank}，随后才能执行请求。取代已弃用的`revokeNomination`函数
 - **executeDelegationRequest**(*address* delegator, *address* candidate) —— 执行和已处于待办委托的请求。该函数仅用于已计划的撤销请求，且退出已生效之后
 - **cancelDelegationRequest**(*address* candidate) —— 取消已计划的请求以撤销委托的请求

以下外部函数已弃用：

 - **revokeNomination**(*address* collator) —— 移除现有的委托

## 获取质押参数 {: #retrieving-staking-parameters } 

您现在可以阅读关于质押的所有参数，如列在[一般定义](#general-definitions)的参数和来自Polkadot.js Apps的参数。

导向至Polkadot.js Apps的**Chain State**界面，本教程会连接至[Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/chainstate){target=_blank}，但也可以链接至[Moonbeam](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network/#chainstate){target=_blank}或是[Moonriver](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonriver.moonbeam.network/#chainstate){target=_blank}。

接着，执行以下步骤检索各种质押参数：

1. 在**Chain State**界面选取**Constants**标签

2. 在**selected constant query**的下拉选单中选取**parachainStaking**

3. 选取任何您希望获取数据的函数。举例而言，您可以使用**maxCollatorsPerNominator**，这将会返回您可委托的最大收集人数

4. 点击**+**以获取当前数据

![Retrieving staking parameters](/images/tokens/staking/stake/stake-12.png)

您应当可以看到单个委托人可委托的最大收集人数，也可以在[Moonbeam质押](/learn/features/staking/#quick-reference){target=_blank}概述中查询。

## 如何通过Polkadot.js Apps进行质押 {: #how-to-delegate-a-candidate }

该部分将展示委托候选收集人的整个步骤。

本教程将使用 Moonbase Alpha 上的以下候选者作为参考：

|  变量   |                        地址                         |
|:-------:|:---------------------------------------------------:|
| 候选人1 | {{ networks.moonbase.staking.candidates.address1 }} |
| 候选人2 | {{ networks.moonbase.staking.candidates.address2 }} |

在通过Polkadot.js Apps进行质押前，请确保您已获取一些重要参数。

### 获取收集人名单 {: #retrieving-the-list-of-candidates } 

在开始质押Token前，从网络中获取候选收集人名单至关重要。您可以执行以下步骤进行查看:

 1. 进入**Developer**标签

 2. 点击**Chain State**

 3. 选择进行交互的pallet。在本示例中为**parachainStaking** pallet

 4. 选择查询状态。在本示例中为**selectedCandidates**或**candidatePool**状态

 5. 点击**+**按钮发送状态查询

以下每个外部函数都会返回不同结果：

 - **selectedCandidates** —— 返回目前的收集人有效集，也就是总Token质押量前{{ networks.moonbase.staking.max_candidates }}名的收集人（委托人的质押量也包括在内）。例如，在Moonbase Alpha上是当前的前{{ networks.moonbase.staking.max_candidates }}名收集人
 - **candidatePool** —— 返回目前所有收集人的名单，包括不在有效集的收集人

![Staking Account](/images/tokens/staking/stake/stake-2.png)

### 获取收集人的委托数量 {: #get-the-candidate-delegation-count } 

首先，您需要获取 `candidateInfo`，其中将包含委托人数量，因为您需要在以后的交易中提交此参数。要检索参数，请确保您仍在 **Developer** 页面的 **Chain State** 选项卡上，然后执行以下步骤：

 1. 选择 **parachainStaking** 托盘进行交互
 2. 选择**candidateInfo**状态查询
 3. 确保 **include option** 滑块已启用
 4. 输入收集人候选人的地址
 5. 点击 **+** 按钮发送状态查询
 6. 复制发起委托时需要的结果

![Get candidate delegation count](/images/tokens/staking/stake/stake-14.png)

### 获取目前委托数据 {: #get-your-number-of-existing-delegations }

如果您从来没有从这个账户进行委托，您可以跳过这步。但是如果您不确定您目前有多少个委托，您可以从[Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/js){target=_blank}运行以下的Javascript代码段来获取`delegationCount`：

```js
// Simple script to get your number of existing delegations.
// Remember to replace YOUR_ADDRESS_HERE with your delegator address.
const yourDelegatorAccount = 'YOUR_ADDRESS_HERE'; 
const delegatorInfo = await api.query.parachainStaking.delegatorState(yourDelegatorAccount);
console.log(delegatorInfo.toHuman()["delegations"].length);
```

 1. 打开**Developer**标签
 2. 点击**JavaScript**
 3. 复制上面的代码段粘贴至代码编辑框内
 4. （可选）点击存储图标并为代码段设置一个文件名，比如**Get existing delegations**。这样即可本地存储代码
 5. 点击执行按钮。这会使代码在编辑器里运行
 6. 复制运行结果，在您发起委托时需要用到

![Get existing delegation count](/images/tokens/staking/stake/stake-13.png)

### 质押Token {: #staking-your-tokens }

使用Polkadot.js Apps交互界面进入质押功能。在此之前需要导入/创建以太坊式账户（H160地址），具体操作方式请见[创建或引入H160账户教程](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank}。

在本示例中，您可以导入一个账户，并命名为：Alice。Alice的地址为 `0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`。

目前，所有与质押相关的功能都需要通过**Developer**标签下的**Extrinsics**菜单进入：

![Staking Account](/images/tokens/staking/stake/stake-5.png)

委托收集人，需要提供以下信息：

 1. 选择希望质押Token的账户
 2. 选择**parachainStaking** pallet
 3. 选择**delegate**外部函数
 4. 设置您要委托的收集人地址。在本示例中为`{{ networks.moonbase.staking.candidates.address1 }}`
 5. 设置您要质押的Token数量
 6. 输入您 [之前从查询 `candidateInfo` 中检索到的 `candidateDelegationCount`](#get-the-candidate-delegation-count)
 7. 输入 `delegationCount` [您从 JavaScript 控制台检索到的](#get-your-number-of-existing-delegations)。如果您尚未委派候选人，则为`0`
 8. 点击**Submit Transaction**按钮，并签名确认交易

![Staking Join Delegators Extrinsics](/images/tokens/staking/stake/stake-15.png)

!!! 注意事项
​    第6步和第7步中用到的参数是为了估算Gas，所以不必和实际数据一致。但是，他们不应低于实际数值。 

### 确认委托 {: #verifying-delegations }

交易确认后，您可以在**Developer**标签下的**Chain state**中查看委托是否成功。

![Staking Account and Chain State](/images/tokens/staking/stake/stake-7.png)

随后，需要提供以下信息：

 1. 选择需要进行交互的pallet。在本示例中为**parachainStaking** pallet
 2. 选择状态以查询。在本示例中为**delegatorState**
 3. 验证所选地址是否正确。在本示例中为Alice的账户
 4. 确保**include option**滑块处于打开状态
 5. 点击 **+**按钮发送状态查询

![Staking Chain State Query](/images/tokens/staking/stake/stake-16.png)

在返回结果中可以看到，账户中（在本示例中为Alice的账户）有一个委托列表，每个委托都包含了候选收集人的目标地址及质押数量。

您也可以通过以上同样的步骤委托其他的候选收集人。例如，Alice也委托了`{{ networks.moonbase.staking.candidates.address2 }}`。

## 如何停止委托 {: #how-to-stop-delegations } 

在runtime升级（[runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/){target=_blank}）中，用户与质押功能的交互方式进行了重大升级，其中包含取消质押的方式。

如果您希望退出或者停止一个委托，首先您需要计划（schedule），等待退出生效期，再执行（execute）该退出。如果您已经是委托人，您有两个方式来请求停止委托：通过`scheduleRevokeDelegation`参数，请求从一个特定的收集人处解除质押Token；或是通过`scheduleLeaveDelegators`参数，请求撤销所有正在进行的委托。计划请求不会自动撤销您的委托，需等待退出生效期之后，再通过`executeDelegationRequest`方式或`executeLeaveDelegators` 方式执行该请求。发起退出请求后并不会自动执行，需要等待[退出延迟](/learn/features/staking/#quick-reference){target=_blank}，然后通过`executeDelegationRequest`或`executeLeaveDelegators` 函数执行请求。

### 计划停止委托的请求 {: #schedule-request-to-stop-delegations }

本小节继续沿用上面的示例，并假设您现在有至少两个有效委托。

在**Developer**标签下的**Extrinsics**菜单中，您可以移除对某一收集人的委托。随后，请执行以下步骤：

 1. 选择您希望移除委托的账户
 2. 选择`parachainStaking` pallet
 3. 选择`scheduleRevokeDelegation`函数
 4. 设置您希望移除委托的收集人地址。在本示例中为`{{ networks.moonbase.staking.candidates.address2 }}`
 5. 点击**Submit Transaction**按钮，并签名确认交易

![Staking Schedule Request to Revoke Delegation Extrinsic](/images/tokens/staking/stake/stake-17.png)

!!! 注意事项

​    每个候选人只能计划一个请求。

如上所述，您也可以通过`scheduleLeaveDelegators`外部函数**Extrinsics** ，继续移除所有正在进行中的委托（下图所示第3步）。这一参数无输入值。

![Staking Leave Delegators Extrinsic](/images/tokens/staking/stake/stake-18.png)

计划该请求后，需要等待[退出延迟](/learn/features/staking/#quick-reference){target=_blank}之后，再执行该请求。如果您试图在退出生效期之前执行，将会导致该参数失败，并且您将会在Polkadot.js Apps的`parachainStaking.PendingDelegationRequest`看到错误。

### 执行停止委托的请求 {: #execute-request-to-stop-delegations }

在发起计划请求，并已经通过退出生效期后，您可以返回**Developer**标签下**Extrinsics**菜单并执行以下步骤：

 1. 选择执行停止委托的账户
 2. 选择**parachainStaking** pallet
 3. 选择**executeDelegationRequest**函数
 4. 设置您希望移除委托的委托人地址。在本示例中为Alice的地址`0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`
 5. 设置您希望移除委托的收集人地址。在本示例中为`{{ networks.moonbase.staking.candidates.address2 }}`
 6. 点击**Submit Transaction**按钮，并签名确认交易

![Staking Execute Revoke Delegation Extrinsic](/images/tokens/staking/stake/stake-19.png)

如果您希望移除所有正在进行的委托，您可以调用`executeLeaveDelegators`函数**Extrinsics** （如下图所示）：

1. 选择移除所有委托的账户
2. 选择**parachainStaking** pallet
3. 选择**executeLeaveDelegators**函数
4. 输入您[从JavaScript命令窗口](#get-your-number-of-existing-delegations){target=_blank}获取的`delegationCount`函数撤销全部委托；如果您从没用这个账户委托过，这里应设置为`0`
5. 点击**Submit Transaction**按钮，并签名确认交易

![Staking Execute Leave Delegators Extrinsic](/images/tokens/staking/stake/stake-20.png)

交易确认后，您可以在**Developer**标签下的**Chain state**中验证委托是否被成功移除。随后，执行以下步骤：

 1. 选择**parachainStaking** pallet
 2. 选择**delegatorState**查询
 3. 选择您的账户
 4. 确保**include option**滑块处于打开状态
 5. 点击**+**按钮发送状态查询

![Staking Verify Delegation is Revoked](/images/tokens/staking/stake/stake-21.png)

在返回结果中可以看到，账户中（在本示例中为Alice的账户）有一个保留委托列表，每个委托都包含了候选收集人的目标地址及质押数量。 `{{ networks.moonbase.staking.candidates.address2 }}`不再出现。或者如果您已经离开了委托人集，您应该看到返回结果显示为`<none>`。

为确保撤销按预期执行，您可以按照上面[验证委托](#verifying-delegations)部分中的步骤进行操作。

### 取消停止委托的请求 {: #cancel-request-to-stop-delegations }

如果您计划了停止委托的请求，只要请求还未被执行，您仍然可以在任何时候取消，并且您所有的委托仍然保持原样。如果您通过`scheduleRevokeDelegation`计划请求，您需要调用`cancelDelegationRequest`。另一方面，如果您通过`scheduleRevokeDelegation` 计划请求，您需要调用`cancelLeaveDelegators`。请执行以下步骤取消请求：

1. 选择取消已计划请求的账户
2. 选择**parachainStaking** pallet
3. 选择**cancelDelegationRequest**或**cancelLeaveDelegators**函数
4. 输入您希望取消请求相对应的收集人地址
5. 点击**Submit Transaction**按钮，并签名确认交易

![Staking Cancel Scheduled Request to Revoke Delegation via Chain State](/images/tokens/staking/stake/stake-22.png)

## 质押奖励 {: #staking-rewards } 

收集人有效集的候选人通过生产区块获得奖励，委托人也会获得奖励。您可以在Moonbeam质押概述的[奖励分配页面](/learn/features/staking/#reward-distribution){target=_blank}大致了解奖励的计算方式。

总而言之，收集人获得奖励后（奖励包括收集人本身的权益），将根据占该收集人所有委托人总权益的比例对各个委托人进行奖励分成。

从上述示例可以看到，在经过两轮后，Alice获得了`0.0044` Token作为奖励：

![Staking Reward Example](/images/tokens/staking/stake/stake-11.png)

--8<-- 'text/disclaimers/staking-risks.md'
*质押的MOVR/GLMR代币将被锁定，取回它们需要{{ networks.moonriver.delegator_timings.del_bond_less.days }}天/{{ networks.moonbeam.delegator_timings.del_bond_less.days }}天等待期。*
--8<-- 'text/disclaimers/staking-risks-part-2.md'
