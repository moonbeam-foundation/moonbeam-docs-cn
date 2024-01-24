---
title: Moonbeam收集人活动
description: 关于深入了解并学习成为Moonbeam网络中收集人相关活动的说明
---

# 收集人活动

## 概览 {: #introduction }

在基于Moonbeam的网络上成为收集人需要您满足[绑定要求](/node-operators/networks/collators/requirements/#bonding-requirements){target=_blank}并加入候选人池。在您加入候选人池后，您可以调整您的自身绑定数量或决定何时离开候选人池。

如果您想要减少您的自身绑定数量或离开候选人池，您首先需要发起请求，在[退出生效期](#collator-timings)后才能执行请求。

本教程将向您展示离开候选人池或减少自身绑定数量时需要注意的重要时间安排，如何加入和离开候选人池以及调整您的自身绑定数量。

## 收集人时间安排 {: #collator-timings }

在开始之前，您需要注意以下与收集活动相关的不同操作的时间安排：

=== "Moonbeam"
    |               变量                |                                                                         值                                                                         |
    |:-------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |            轮次时长             |                        {{ networks.moonbeam.staking.round_blocks }}区块（{{ networks.moonbeam.staking.round_hours }}小时）                        |
    |           离开候选人            |    {{ networks.moonbeam.collator_timings.leave_candidates.rounds }}轮次（{{ networks.moonbeam.collator_timings.leave_candidates.hours }}小时）    |
    |           撤销委托           | {{ networks.moonbeam.delegator_timings.revoke_delegations.rounds }}轮次（{{ networks.moonbeam.delegator_timings.revoke_delegations.hours }}小时） |
    |        减少自身委托量         |       {{ networks.moonbeam.collator_timings.can_bond_less.rounds }}轮次（{{ networks.moonbeam.collator_timings.can_bond_less.hours }}小时）       |
    | 奖励发放（在本轮结束后） |    {{ networks.moonbeam.delegator_timings.rewards_payouts.rounds }}轮次（{{ networks.moonbeam.delegator_timings.rewards_payouts.hours }}小时）    |

=== "Moonriver"
    |               变量                |                                                                          值                                                                          |
    |:-------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |            轮次时长             |                        {{ networks.moonriver.staking.round_blocks }}区块（{{ networks.moonriver.staking.round_hours }}小时）                        |
    |           离开候选人            |    {{ networks.moonriver.collator_timings.leave_candidates.rounds }}轮次{{ networks.moonriver.collator_timings.leave_candidates.hours }}小时）    |
    |           撤销委托           | {{ networks.moonriver.delegator_timings.revoke_delegations.rounds }}轮次（{{ networks.moonriver.delegator_timings.revoke_delegations.hours }}小时） |
    |        减少自身委托量         |       {{ networks.moonriver.collator_timings.can_bond_less.rounds }}轮次（{{ networks.moonriver.collator_timings.can_bond_less.hours }}小时）       |
    | 奖励发放（在本轮结束后） |    {{ networks.moonriver.delegator_timings.rewards_payouts.rounds }}轮次（{{ networks.moonriver.delegator_timings.rewards_payouts.hours }}小时）    |

=== "Moonbase Alpha"
    |               变量                |                                                                         值                                                                         |
    |:-------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |            轮次时长             |                        {{ networks.moonbase.staking.round_blocks }}区块（{{ networks.moonbase.staking.round_hours }}小时）                        |
    |           离开候选人            |    {{ networks.moonbase.collator_timings.leave_candidates.rounds }}轮次（{{ networks.moonbase.collator_timings.leave_candidates.hours }}小时）    |
    |           撤销委托           | {{ networks.moonbase.delegator_timings.revoke_delegations.rounds }}轮次（{{ networks.moonbase.delegator_timings.revoke_delegations.hours }}小时） |
    |      减少自身委托量      |      {{ networks.moonbase.delegator_timings.del_bond_less.rounds }}轮次（{{ networks.moonbase.delegator_timings.del_bond_less.hours }}小时）      |
    | 奖励发放（在本轮结束后） |    {{ networks.moonbase.delegator_timings.rewards_payouts.rounds }}轮次（{{ networks.moonbase.delegator_timings.rewards_payouts.hours }}小时）    |

!!! 注意事项
    上表所列值可能会在未来发布新版本时有所调整。

## 成为候选人 {: #become-a-candidate } 

### 获取候选人池的大小 {: #get-the-size-of-the-candidate-pool } 

首先，您需要获取`candidatePool`的大小（可通过治理更改），该参数将用于后续交易中。为此，您必须从[Polkadot.js](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/js){target=_blank}中运行以下JavaScript代码段：

```js
// Simple script to get candidate pool size
const candidatePool = await api.query.parachainStaking.candidatePool();
console.log(`Candidate pool size is: ${candidatePool.length}`);
```

点击**Developer**标签，从下拉菜单中选择**JavaScript**，然后执行以下步骤：

 1. 复制上述代码段并粘贴至代码编辑框内。（可选）点击保存图标，并为代码段设置一个名称，如”Get candidatePool size“。这将在本地保存代码段
 2. 点击运行图标，以执行编辑框内的代码
 3. 点击复制图标复制结果，将在加入候选人池时使用

![Get Number of Candidates](/images/node-operators/networks/collators/activities/activities-1.webp)

### 加入候选人池 {: #join-the-candidate-pool } 

节点开始运行并同步网络后，您将成为候选人（并加入候选人池）。根据您所连接的网络，前往[Polkadot.js](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/accounts){target=_blank}，点击**Developer**标签，从下拉菜单中选择**Extrinsics**，然后进行以下步骤：

  1. 选择您想用于参与收集活动的账户。确认您的收集人账户已充值[所需的最低质押量](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=_blank}，并有多余金额用于支付交易费
  2. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet
  3. 打开下拉菜单，在质押相关的所有extrinsics中，选择**joinCandidates()**
  4. 将绑定数量设置为成为候选人的[最低数量](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=_blank}（输入数量需以`Wei`为单位）。例如，在Moonbase Alpha的最低绑定数量为{{ networks.moonbase.staking.min_can_stk }}枚DEV，以wei为单位应输入`{{ networks.moonbase.staking.min_can_stk_wei }}`（即{{ networks.moonbase.staking.min_can_stk }}再额外加18个0）。这里仅考虑候选人的绑定数量，其他委托量将不计入统计
  5. 设置候选人数量即候选人池大小。如何设置该数值请查看[获取候选人池的大小](#get-the-size-of-the-candidate-pool)部分
  6. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Join candidate pool via Polkadot.js](/images/node-operators/networks/collators/activities/activities-2.webp)

!!! 注意事项
    函数名称和最低绑定数量要求可能会在未来发布新版本时有所调整。

如上所述，只有质押量排名靠前的收集人才可以进入收集人有效集。每个网络候选人的具体排名数量和最低绑定数量请查看[最低收集人绑定数量](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=_blank}部分。

## 停止参与收集活动 {: #stop-collating } 

在runtime升级（[runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/)）{target=_blank}中，用户与质押功能的交互方式进行了重大升级，其中包含取消质押的方式。

想要停止参与收集活动并离开候选人池，您必须先发起请求。发起请求自动将您从收集人有效集中移除，因此您将不再有资格生产区块或获得奖励。您需要等待[退出生效期](#collator-timings)，才能够执行离开请求。在等待完退出生效期并执行请求后，您将从候选人池中移除。

类似[Polkadot's `chill()`](https://wiki.polkadot.network/docs/maintain-guides-how-to-chill){target=_blank}功能，无需解绑您的Token，您可以[暂时离开候选人池](#temporarily-leave-the-candidate-pool)。

### 发起离开候选人的请求 {: #schedule-request-to-leave-candidates }

进入**Developer**标签，点击**Extrinsics**，然后执行以下步骤，开始发起一个请求：

 1. 选择您的候选人账户

 2. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet

 3. 选择**scheduleLeaveCandidates** extrinsic

 4. 输入`candidateCount`（可从[获取候选人池的大小](#get-the-size-of-the-candidate-pool)部分获得）

 5. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Schedule leave candidates request](/images/node-operators/networks/collators/activities/activities-3.webp)

### 执行离开候选人的请求 {: #execute-request-to-leave-candidates }

等待期过后，您将能够执行离开候选人池的请求。为此，您需首先获得候选人拥有的委托数量。您可以查询包括委托数量的候选人信息。点击**Developer**标签，选择**Chain state**，执行以下步骤，开始执行一个请求：

 1. 从**selected state query**下拉菜单中，选择**parachainStaking**

 2. 选择 **candidateInfo** extrinsic

 3. 选择收集人账户以获得信息

 4. 点击 **+** 按键，提交extrinsic

  5. 复制**`delegationCount`**，之后用于执行离开候选人的请求

![Get delegation count](/images/node-operators/networks/collators/activities/activities-4.webp)

现在您有了委托数量，可以执行请求。回到**Extrinsics**标签，并执行以下步骤：

 1. 选择您的候选人账户

 2. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet

 3. 选择**executeLeaveCandidates** extrinsic

 4. 选择目标候选人账户（在提交`scheduleLeaveCandidates` extrinsic后，任何人都可以在退出生效期后执行请求）

 5. 输入候选人的委托数量

 6. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Execute leave candidates request](/images/node-operators/networks/collators/activities/activities-5.webp)

### 取消离开候选人的请求 {: #cancel-request-to-leave-candidates }

如果您已发起离开候选人池的请求，只要请求还未被执行，您仍可以取消请求并留在候选人池中。请确保您从**Developer**标签中点击**Extrinsics**，并执行以下步骤取消请求：

    1. 选择您的候选人账户
    2. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet
    3. 选择**cancelLeaveCandidates** extrinsic
    4. 输入`candidateCount`（可从[获取候选人池的大小](#get-the-size-of-the-candidate-pool)部分获得）
    5. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Cancel leave candidates request](/images/node-operators/networks/collators/activities/activities-6.webp)

### 暂时离开候选人池 {: #temporarily-leave-the-candidate-pool }

如果您想暂时离开候选人池，通过使用`goOffline`可轻松做到。这很有用，比如您需要暂时离开候选人池进入维护操作。完成后，使用`goOnline`便可以重新加入池。

要暂时离开池，请执行以下步骤：

  1. 导向至**Developer**标签
  2. 点击**Extrinsics**
  3. 选择您的候选人账户
  4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet
  5. 选择**goOffline** extrinsic
  6. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Temporarily leave candidates pool](/images/node-operators/networks/collators/activities/activities-7.webp) 

然后，无论何时只要您希望都可以通过`goOnline`重新加入，通过以上同样的步骤，在步骤5选择`goOnline`。请注意，只有在您已经调用过`goOffline`的情况下，才能够调用`goOnline`。

## 更改自身绑定数量 {: #change-self-bond-amount }

作为候选人，更改您的自身绑定数量将略有不同，具体取决于您要增加绑定数量还是减少绑定数量。如果您想要增加绑定数量，过程颇为简单，您可直接通过`candidateBondMore()` extrinsic增加质押量，无需等待退出生效期，也无需发起和执行请求，您的请求将会即刻自动被执行。

如果您想要减少绑定数量，您需要发起请求并等待[退出生效期](#collator-timings)，随后您将能够执行请求，减少绑定部分的Token将返回至您的账户。换句话说，发起请求并不会即刻或自动减少绑定数量，只有在请求被执行后才会减少绑定数量。

### 增加自身绑定数量 {: #bond-more }

作为候选人，有两种增加质押量的选择。第一个，也是我们所推荐的选项是将要质押的资金发送到另一个您所拥有的地址，并[委托您的收集人](/tokens/staking/stake/#how-to-nominate-a-collator)。第二个，已经拥有[最低自身绑定数量](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=_blank}的收集人可以通过[Polkadot JS Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbeam.network#/accounts)增加其绑定数量。导向至**Developer**标签，点击**Extrinsics**，并进行以下步骤：

  1. 选择您的收集人账户（并验证该账户是否有足够资金可用于绑定）
  2. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet
  3. 打开下拉菜单，在质押相关的所有extrinsics中，选择**candidateBondMore()**函数
  4. 在**more: BalanceOf**字段中输入要增加的绑定数量
  5. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Collator Bond More](/images/node-operators/networks/collators/activities/activities-8.webp)

### 减少自身绑定数量 {: #bond-less}

在最新的runtime升级（[runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/)）中，用户与质押功能的交互方式进行了重大升级，其中包含取消质押的方式。作为收集人或候选收集人，您可能想要减少您的绑定数量，确保您所绑定的数量在减少后仍超过[最低自身绑定数量](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=_blank}。

想要减少绑定数量，您需要先发起请求并等待[退出生效期](#collator-timings)，随后执行请求。只要请求还未被执行，您仍可随时[取消请求](#cancel-bond-less-request)。

#### 发起减少绑定数量的请求 {: #schedule-bond-less }

想要发起减少绑定数量的请求，请确保已经点击**Developer**标签并点击**Extrinsics**，随后执行以下步骤：

  1. 选择您的候选人账户
  2. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet
  3. 打开下拉菜单，选择**scheduleCandidateBondLess()**函数
  4. 在**less: BalanceOf**字段中输入要减少的绑定数量
  5. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Schedule Candidate Bond Less](/images/node-operators/networks/collators/activities/activities-9.webp)

当交易确认，您将需要等待退出生效期，然后才能为您执行减少绑定数量的请求。如果您尝试在退出生效期前操作，该extrinsic将会失败，并且您将看到来自Polkadot.js Apps的`parachainStaking.PendingDelegationRequest`错误。

#### 执行减少绑定数量的请求 {: #execute-bond-less-request }

退出生效期后，您将能够执行减少绑定数量的请求。请导向至**Developer**标签并选择**Extrinsics**，随后执行以下步骤：

  1. 选择您要执行请求的账户
  2. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet
  3. 选择**executeCandidateBondLess** extrinsic
  4. 选择目标候选人账户（在提交`scheduleCandidateBondLess`后，任何人都可以在退出生效期后执行请求）
  5. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Execute Candidate Bond Less](/images/node-operators/networks/collators/activities/activities-10.webp)

交易确认后，您可以在**Accounts**标签处查看您的可用余额。请注意，请求已执行，您的余额已更新。

#### 取消减少绑定数量的请求 {: #cancel-bond-less-request }

如果您已发起增加或减少绑定数量的请求，只要请求还未被执行，您仍可以取消请求并保持原有的绑定数量。请导向至**Developer**标签并选择**Extrinsics**，随后执行以下步骤：

  1. 选择您的候选人账户（并验证该账户是否有足够资金可用于绑定）
  2. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet
  3. 选择**cancelCandidateBondRequest** extrinsic
  4. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Cancel leave candidates request](/images/node-operators/networks/collators/activities/activities-11.webp)
