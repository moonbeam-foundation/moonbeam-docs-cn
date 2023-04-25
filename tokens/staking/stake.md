---
title: 如何质押您的MOVR和GLMR代币
description: 了解如何通过委托收集人在Moonbeam上质押代币并获得奖励。
---

# 如何质押Token

![Staking Moonbeam Banner](/images/tokens/staking/stake/stake-banner.png)

## 概览 {: #introduction }

获得最高质押量的候选收集人（区块生产者）可加入有效收集人池，入选后将负责为中继链提供区块。

Token持有者可以向候选人质押自己的Token，这一过程称为委托（也称为质押）。通过这种方式，Token持有者为特定候选人进行担保，而他们的委托行为则被视为对收集人的信任。进行委托时，Token会被立即扣除，并添加到用户质押的总金额中。退出流程现被分为两个动作：计划（scheduling）和执行（execution）。首先，Token持有者需要发送请求（即计划）以进行退出流程，等待退出生效期或解绑期（视网络而定）。在解绑期之后，用户可以执行他们的计划（scheduling）行动。

候选人加入到收集人有效集后，他们就有资格生产区块并获得部分区块奖励（Token通胀模型的一部分）。考虑到委托人对收集人在网络中质押的贡献比例，收集人与委托人共享质押奖励。委托人可以选择自动复合他们的奖励，以便将一定比例的奖励自动应用到他们的总委托金额中。

本教程将向您展示如何通过Polkadot.js Apps在Moonbase Alpha上质押。此教程同样适用于Moonbeam和Moonriver。如果希望简单质押Token，持有者可以使用[Moonbeam dApp](https://apps.moonbeam.network/){target=_blank}来进行操作。

有关质押的更多基本信息，请查看[Moonbeam质押](/learn/features/staking/){target=_blank}概述。

## Extrinsic定义 {: #extrinsics-definitions } 

有许多与质押pallet相关的Extrinsic（外部函数），您可以在[平行链质押Pallet](/builders/pallets-precompiles/pallets/staking){target=_blank}页面上查看它们的完整列表。

以下列表涵盖了您将在本指南中使用并与委托流程相关的Extrinsic。

!!! 注意事项
    随着质押pallet不断升级，Extrinsic将来可能发生变化。

### 加入委托人集 {: #join-or-leave-the-delegator-set }

 - **delegate**(*address* candidate, *uint256* amount, *uint256* candidateDelegationCount, *uint256* delegatorDelegationCount) —— 委托收集人函数。数额需要大于最低委托质押量。
 - **delegateWithAutoCompound**(*address* candidate, *uint256* amount, *uint8* autoCompound, *uint256* candidateDelegationCount, *uint256* candidateAutoCompoundingDelegationCount, *uint256* delegatorDelegationCount) —— 与`delegate`类似，它会建立委托来支持收集人候选人。 但是，此函数也设置自动复合的奖励百分比

### 绑定更多Token或减少绑定Token {: #bond-more-or-less }

 - **delegatorBondMore**(*address* candidate, *uint256* more) —— 向已经委托的收集人增加质押Token数量的请求
 - **scheduleDelegatorBondLess**(*address* candidate, *uint256* less) —— 对已经委托的收集人减少质押Token数量的请求。该数额不得使您的总质押量低于最低委托质押量。在您通过`executeDelegationRequest`执行请求前，需经过一个[退出延迟](/learn/features/staking/#quick-reference/#:~:text=减少委托时长){target=_blank}，随后才能执行请求
 - **executeDelegationRequest**(*address* delegator, *address* candidate) —— 对一个特定候选人减少绑定的执行行为。该函数仅用于已计划的绑定请求，且退出已生效之后
 - **scheduleCandidateBondLess**(*uint256* less) - 允许收集人候选人请求将其自绑定减少给定数量的extrinsic。在您通过`executeCandidateBondLess`执行请求前，需经过一个[退出延迟](/learn/features/staking/#quick-reference/#:~:text=减少委托时长){target=_blank}，随后才能执行请求。
 - **executeCandidateBondLess**(*address* candidate) - 执行减少候选人的自绑定请求。该函数仅用于已计划的绑定减少请求，且退出已生效之后
 - **cancelCandidateBondLess**() —— 取消已计划的对特定候选人增加或者减少绑定的请求

### 撤销委托 {: #revoke-delegations }

 - **scheduleRevokeDelegation**(*address* collator) —— 计划完全撤销现有的委托。在您通过[`executeDelegationRequest`](#:~:text=executeDelegationRequest(address delegator, address candidate))执行请求前，需经过一个[退出延迟](/learn/features/staking/#quick-reference/#:~:text=取消委托延迟){target=_blank}，随后才能执行请求
 - **cancelDelegationRequest**(*address* candidate) —— 取消已计划的请求以撤销委托的请求

### 设置或更改自动复合的百分比 {: #set-change-auto-compounding }

 - **setAutoCompound**(*address* candidate, *uint8* value, *uint256* candidateAutoCompoundingDelegationCount, *uint256* delegatorDelegationCount) - 为现有委托设置一个自动复合数值

## 获取质押数值 {: #retrieving-staking-parameters } 

您可以使用Polkadot.js Apps查看任何常量质押数值，例如最大委托数量、最低质押要求、委托请求的退出延迟等。

为此，您可以导航至Polkadot.js Apps的**Chain State**界面，本教程会连接至[Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/chainstate){target=_blank}，但也可以链接至[Moonbeam](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network/#chainstate){target=_blank}或是[Moonriver](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbeam.network/#chainstate){target=_blank}。

接着，为了检索各种质押参数，请在**Chain State**界面选取**Constants**标签，并执行以下步骤：

1. 在**selected constant query**的下拉选单中选取**parachainStaking**
2. 选取任何您希望获取数据的函数。举例而言，您可以使用**maxCollatorsPerNominator**，这将会返回您可委托的最大收集人数
3. 点击**+**以获取当前数据

![Retrieving staking parameters](/images/tokens/staking/stake/stake-1.png)

您应当可以看到单个委托人可委托的最大收集人数，也可以在[Moonbeam质押](/learn/features/staking/#quick-reference){target=_blank}概述中查询。

## 如何通过Polkadot.js Apps进行质押和自动复合奖励 {: #how-to-delegate-a-candidate }

该部分将展示委托收集人候选人的整个步骤。在本指南中使用的Moonbase Alpha收集人候选人的地址是`{{ networks.moonbase.staking.candidates.address1 }}`。

在通过Polkadot.js Apps进行质押前，请确保您已获取一些重要参数，例如候选人名单、您要委托的候选人的委托数量以及您的委托数量。 要自动计算您的委托奖励，您还需要您要委托的候选人的自动复合委托数量。

### 获取收集人名单 {: #retrieving-the-list-of-candidates } 

在开始质押Token前，从网络中获取候选收集人名单至关重要。为此，您可以进入**Developer**标签，点击**Chain State**，并执行以下步骤:

 1. 选择进行交互的pallet。在本示例中为**parachainStaking** pallet
 2. 选择查询状态。在本示例中为**selectedCandidates**或**candidatePool**状态
 3. 点击**+**按钮发送状态查询

以下每个外部函数都会返回不同结果：

 - **selectedCandidates** —— 返回目前的收集人有效集，也就是总Token质押量（委托人的质押量也包括在内）排在前面的候选收集人。例如，在Moonbase Alpha上是当前的前{{ networks.moonbase.staking.max_candidates }}名候选人
 - **candidatePool** —— 返回目前所有候选人的名单，包括不在有效集的收集人

![Staking Account](/images/tokens/staking/stake/stake-2.png)

### 获取候选人的委托数量 {: #get-the-candidate-delegation-count } 

首先，您需要获取`candidateInfo`，其中将包含委托人数量，因为您需要在以后的交易中提交此参数。要检索参数，请确保您仍在 **Developer** 页面的 **Chain State** 选项卡上，然后执行以下步骤：

 1. 选择 **parachainStaking** 托盘进行交互
 2. 选择**candidateInfo**状态查询
 3. 确保 **include option** 滑块已启用
 4. 输入收集人候选人的地址
 5. 点击 **+** 按钮发送状态查询
 6. 复制发起委托时需要的结果

![Get candidate delegation count](/images/tokens/staking/stake/stake-3.png)

### 获取候选人自动复合委托数量 {: #get-candidate-auto-compounding-count }

自动复合委托计数是配置了自动复合的委托数量。要确定设置了自动复合的委托数量，您可以在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/js){target=_blank}上使用以下代码段查询候选人的自动复合委托：

```js
// Simple script to get the number of auto-compounding delegations for a given candidate.
// Remember to replace CANDIDATE-ADDRESS-HERE with the candidate's address you want to delegate.
const candidateAccount = 'CANDIDATE-ADDRESS-HERE'; 
const autoCompoundingDelegations = await api.query.parachainStaking.autoCompoundingDelegations(candidateAccount);
console.log(autoCompoundingDelegations.toHuman().length);
``` 

要运行该代码段，请确保您位于Polkadot.js Apps的 **JavaScript** 页面（可以从 **Developer** 下拉列表中选择），并执行以下步骤：

 1. 复制前面片段中的代码并将其粘贴到代码编辑器框中
 2. （可选）单击保存图标并为代码段设置名称，例如**获取自动复合委托数量**。这会将代码片段保存在本地
 3. 要执行代码，请单击运行按钮
 4. 复制结果，因为您在发起委托时需要它

![Get candidate auto-compounding delegation count](/images/tokens/staking/stake/stake-4.png)

### 获取目前委托数据 {: #get-your-number-of-existing-delegations }

如果您从来没有从这个账户进行委托，您可以跳过这步。但是如果您不确定您目前有多少个委托，您可以从[Polkadot.js](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/js){target=_blank}运行以下的Javascript代码段来获取`delegationCount`：

```js
// Simple script to get your number of existing delegations.
// Remember to replace YOUR-ADDRESS-HERE with your delegator address.
const yourDelegatorAccount = 'YOUR-ADDRESS-HERE'; 
const delegatorInfo = 
  await api.query.parachainStaking.delegatorState(yourDelegatorAccount);

if (delegatorInfo.toHuman()) {
  console.log(delegatorInfo.toHuman()["delegations"].length);
} else {
  console.log(0)
}
```

 打开**Developer**标签，并点击**JavaScript**。然后执行以下步骤：

 1. 复制上面的代码段粘贴至代码编辑框内
 2. （可选）点击存储图标并为代码段设置一个文件名，比如**获取委托数量**。这样即可本地存储代码
 3. 要执行代码，请单击运行按钮
 4. 复制运行结果，在您发起委托时需要用到

![Get existing delegation count](/images/tokens/staking/stake/stake-5.png)

### 质押Token {: #staking-your-tokens }

使用Polkadot.js Apps交互界面进入质押功能。在此之前需要导入/创建以太坊式账户（H160地址），具体操作方式请见[创建或引入H160账户教程](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank}。

在本示例中，您可以导入一个账户，并命名为：Alice。Alice的地址为 `0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`。

委托收集人，并为您的质押奖励设置自动复合，请执行以下步骤：

 1. 选择希望质押Token的账户
 2. 选择**parachainStaking** pallet
 3. 选择**delegateWithAutoCompound**外部函数
 4. 设置您要委托的收集人地址。在本示例中为`{{ networks.moonbase.staking.candidates.address1 }}`
 5. 设置您要质押的Token数量
 6. 通过输入0-100的数字来设置自动复合的奖励百分比
 7. 输入您[之前从查询 `candidateInfo` 中检索到的 `candidateDelegationCount`](#get-the-candidate-delegation-count)
 8. 输入您[之前从查询 `autoCompoundingDelegations` 中检索到的 `candidateAutoCompoundingDelegationCount`](#get-candidate-auto-compounding-count)
 9. 输入[您从 JavaScript 控制台检索到的 `delegationCount` ](#get-your-number-of-existing-delegations)。如果您尚未委派候选人，则为`0`
 10. 点击**Submit Transaction**按钮，并签名确认交易

![Staking Join Delegators Extrinsics](/images/tokens/staking/stake/stake-6.png)

!!! 注意事项
    第7-9步中用到的参数是为了估算Gas，所以不必和实际数据一致。但是，他们不应低于实际数值。 

如果您想在不设置自动复合的情况下进行委托，您可以按照前面的步骤操作，但您可以使用 **delegate** extrinsic 而不是使用 **delegateWithAutoCompound**。

### 验证委托 {: #verifying-delegations }

交易确认后，您可以在**Developer**标签下的**Chain state**中查看委托是否成功。随后，需要提供以下信息：

 1. 选择需要进行交互的pallet。在本示例中为**parachainStaking** pallet
 2. 选择状态以查询。在本示例中为**delegatorState**
 3. 验证所选地址是否正确。在本示例中为Alice的账户
 4. 确保**include option**滑块处于打开状态
 5. 点击 **+**按钮发送状态查询

![Verify delegations](/images/tokens/staking/stake/stake-7.png)

在返回结果中可以看到，账户中（在本示例中为Alice的账户）有一个委托列表，每个委托都包含了候选收集人的目标地址及质押数量。

您也可以通过以上同样的步骤委托其他的候选收集人。

### 验证自动复合百分比 {: #verifying-auto-compounding-percentage }

如果您想验证为特定委托设置为自动复合的奖励百分比，您可以使用以下脚本来查询`autoCompoundingDelegations`外部函数并根据委托人的地址过滤结果：

```js
// Simple script to verify your auto-compounding percentage for a given candidate.
// Remember to replace CANDIDATE-ADDRESS-HERE with the candidate's address you want to delegate
// And replace DELEGATOR-ADDRESS-HERE with the address used to delegate with
const candidateAccount = 'CANDIDATE-ADDRESS-HERE'; 
const delegationAccount = 'DELEGATOR-ADDRESS-HERE'
const autoCompoundingDelegations = await api.query.parachainStaking.autoCompoundingDelegations(candidateAccount);
const delegation = autoCompoundingDelegations.find(del => del.delegator == delegationAccount)

console.log(`${delegation.value}%`);
```

在Polkadot.js Apps中，您可以前往 **Developer** 选项卡并从下拉列表中选择**JavaScript**。 然后您可以采取以下步骤：

 1. 复制前面片段中的代码并将其粘贴到代码编辑器框中
 2. （可选）单击保存图标并为代码段设置名称，例如**获取自动复合百分比**。 这会将代码片段保存在本地
 3. 要执行代码，请单击运行按钮
 4. 结果在右侧终端返回

![Verify auto-compounding percentage](/images/tokens/staking/stake/stake-8.png)

## 设置或更改自动复合百分比 {: #set-or-change-auto-compounding }

如果您最初在没有自动复合的情况下设置委托，或者如果您想更新具有自动复合设置的现有委托的百分比，则可以使用Solidity接口的`setAutoCompound`函数。

您要为需要设置或更新自动复合的候选人[获取设置了自动复合的委托数量](#get-candidate-auto-compounding-count)。您还需要[检索您自己的委托数量](#get-your-number-of-existing-delegations)。获得必要信息后，您可以单击 **Developer** 选项卡，从下拉列表中选择 **Extrinsics**，然后执行以下步骤：

 1. 选择您最初委托的并希望为其设置或更新自动复合的账户
 2. 选择 **parachainStaking** pallet
 3. 选择 **setAutoCompound** 外部函数
 4. 设置您委托的候选人地址。对于这个例子，它被设置为`{{ networks.moonbase.staking.candidates.address1 }}`
 5. 通过输入一个0-100的数字设置自动复合的奖励百分比
 6. 对于 **candidateAutoCompoundingDelegationHint** 字段，输入配置了自动复合的候选人的委托数量
 7. 对于 **delegationCountHint** 字段，输入您的委托数量
 8. 点击 **Submit Transaction** 按钮并签署交易

![Staking Chain State Query](/images/tokens/staking/stake/stake-9.png)

## 如何停止委托 {: #how-to-stop-delegations } 

在runtime升级（[runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/){target=_blank}）中，用户与质押功能的交互方式进行了重大升级，其中包含取消质押的方式。

如果您希望退出或者停止一个委托，首先您需要计划（schedule），等待退出生效期，再执行（execute）该退出请求。如果您已经是委托人，您可以通过`scheduleRevokeDelegation`函数，请求从一个特定的收集人处解除质押Token来请求停止您的委托。计划请求不会自动撤销您的委托，需等待一个[退出生效期](/learn/features/staking/#quick-reference){target=_blank}，然后通过`executeDelegationRequest`函数执行请求。

### 计划停止委托的请求 {: #schedule-request-to-stop-delegations }

导航至**Developer**标签下的**Extrinsics**菜单中，计划一个请求来移除您对某一收集人的委托。随后，请执行以下步骤：

 1. 选择您希望移除委托的账户
 2. 选择`parachainStaking` pallet
 3. 选择`scheduleRevokeDelegation`函数
 4. 设置您希望移除委托的收集人地址。在本示例中为`{{ networks.moonbase.staking.candidates.address1 }}`
 5. 点击**Submit Transaction**按钮，并签名确认交易

![Staking Schedule Request to Revoke Delegation Extrinsic](/images/tokens/staking/stake/stake-10.png)

!!! 注意事项
    每个候选人只能有一个待定的计划请求。

计划该请求后，需要等待[退出延迟](/learn/features/staking/#quick-reference){target=_blank}之后，再执行该请求。如果您试图在退出生效期之前执行，将会导致该参数失败，并且您将会在Polkadot.js Apps的`parachainStaking.PendingDelegationRequest`看到错误。

### 执行停止委托的请求 {: #execute-request-to-stop-delegations }

在发起计划请求，并已经通过退出生效期后，您可以返回**Developer**标签下**Extrinsics**菜单并执行以下步骤：

 1. 选择执行停止委托的账户
 2. 选择**parachainStaking** pallet
 3. 选择**executeDelegationRequest**函数
 4. 设置您希望移除委托的委托人地址。在本示例中为Alice的地址`0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`
 5. 设置您希望移除委托的收集人地址。在本示例中为`{{ networks.moonbase.staking.candidates.address1 }}`
 6. 点击**Submit Transaction**按钮，并签名确认交易

![Staking Execute Revoke Delegation Extrinsic](/images/tokens/staking/stake/stake-11.png)

交易确认后，您可以在**Developer**标签下的**Chain state**中验证委托是否被成功移除。随后，执行以下步骤：

 1. 选择**parachainStaking** pallet
 2. 选择**delegatorState**查询
 3. 选择您的账户
 4. 确保**include option**滑块处于打开状态
 5. 点击**+**按钮发送状态查询

![Staking Verify Delegation is Revoked](/images/tokens/staking/stake/stake-12.png)

在返回结果中可以看到，账户中（在本示例中为Alice的账户）有一个保留委托列表，每个委托都包含了候选收集人的目标地址及质押数量。`{{ networks.moonbase.staking.candidates.address1 }}`不再出现。如果您不再有任何委托，将返回`<none>`。

为确保撤销按预期执行，您可以按照上面[验证委托](#verifying-delegations)部分中的步骤进行操作。

### 取消停止委托的请求 {: #cancel-request-to-stop-delegations }

如果您计划了停止委托的请求，只要请求还未被执行，您仍然可以在任何时候取消，并且您所有的委托仍然保持原样。请执行以下步骤取消请求：

1. 选择取消已计划请求的账户
2. 选择**parachainStaking** pallet
3. 选择**cancelDelegationRequest**函数
4. 输入您希望取消请求相对应的收集人地址
5. 点击**Submit Transaction**按钮，并签名确认交易

![Staking Cancel Scheduled Request to Revoke Delegation](/images/tokens/staking/stake/stake-13.png)

## 质押奖励 {: #staking-rewards } 

收集人有效集的候选人通过生产区块获得奖励，委托人也会获得奖励。您可以在Moonbeam质押概述的[奖励分配页面](/learn/features/staking/#reward-distribution){target=_blank}大致了解奖励的计算方式。

总而言之，收集人获得奖励后（奖励包括收集人本身的权益），将根据占该收集人所有委托人总权益的比例对各个委托人进行奖励分成。

委托人可以选择自动复合他们的奖励，以便他们的奖励自动应用于他们的总委托金额。 如果委托人有多个委托，则需要为每个委托设置自动复合。

--8<-- 'text/disclaimers/staking-risks.md'
*质押的MOVR/GLMR代币将被锁定，取回它们需要{{ networks.moonriver.delegator_timings.del_bond_less.days }}天/{{ networks.moonbeam.delegator_timings.del_bond_less.days }}天等待期。*
--8<-- 'text/disclaimers/staking-risks-part-2.md'
