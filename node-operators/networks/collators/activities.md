---
title: 收集人活动
description: 关于深入了解并学习成为Moonbeam网络中收集人相关活动的说明
---

# 收集人活动

![Collator Activities Banner](/images/node-operators/networks/collators/activities/activities-banner.png)

## 概览 {: #introduction }

在基于Moonbeam的网络上成为收集人需要您满足[绑定要求](/node-operators/networks/collators/requirements/#bonding-requirements){target=_blank}并加入候选人池。在您加入候选人池后，您可以调整您的自身绑定数量或决定何时离开候选人池。

如果您想要减少您的自身绑定数量或离开候选人池，您首先需要发起请求，在[退出生效期](#collator-timings)后才能执行请求。

本教程将向您展示离开候选人池或减少自身绑定数量时需要注意的重要时间安排，如何加入和离开候选人池以及调整您的自身绑定数量。

## 收集行动时间安排 {: #collator-timings }

在开始之前，您需要注意以下与收集活动相关的不同操作的时间安排：

=== "Moonbeam"
    |               变量                |                                                                         值                                                                         |
    |:-------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |            轮次时长             |                        {{ networks.moonbeam.staking.round_blocks }}轮（{{ networks.moonbeam.staking.round_hours }}小时）                        |
    |           离开候选人            |    {{ networks.moonbeam.collator_timings.leave_candidates.rounds }}轮（{{ networks.moonbeam.collator_timings.leave_candidates.hours }}小时）    |
    |           撤销委托           | {{ networks.moonbeam.delegator_timings.revoke_delegations.rounds }}轮（{{ networks.moonbeam.delegator_timings.revoke_delegations.hours }}小时） |
    |        减少自身委托量         |       {{ networks.moonbeam.collator_timings.can_bond_less.rounds }}轮（{{ networks.moonbeam.collator_timings.can_bond_less.hours }}小时）       |
    | 奖励发放（在本轮结束后） |    {{ networks.moonbeam.delegator_timings.rewards_payouts.rounds }}轮（{{ networks.moonbeam.delegator_timings.rewards_payouts.hours }}小时）    |

=== "Moonriver"
    |               变量                |                                                                          值                                                                          |
    |:-------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |            轮次时长             |                        {{ networks.moonriver.staking.round_blocks }}轮（{{ networks.moonriver.staking.round_hours }}小时）                        |
    |           离开候选人            |    {{ networks.moonriver.collator_timings.leave_candidates.rounds }}轮（{{ networks.moonriver.collator_timings.leave_candidates.hours }}小时）    |
    |           撤销委托           | {{ networks.moonriver.delegator_timings.revoke_delegations.rounds }}轮（{{ networks.moonriver.delegator_timings.revoke_delegations.hours }}小时） |
    |        减少自身委托量         |       {{ networks.moonriver.collator_timings.can_bond_less.rounds }}轮（{{ networks.moonriver.collator_timings.can_bond_less.hours }}小时）       |
    | 奖励发放（在本轮结束后） |    {{ networks.moonriver.delegator_timings.rewards_payouts.rounds }}轮（{{ networks.moonriver.delegator_timings.rewards_payouts.hours }}小时）    |

=== "Moonbase Alpha"
    |               变量                |                                                                         值                                                                         |
    |:-------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |            轮次时长             |                        {{ networks.moonbase.staking.round_blocks }}轮（{{ networks.moonbase.staking.round_hours }}小时）                        |
    |           离开候选人            |    {{ networks.moonbase.collator_timings.leave_candidates.rounds }}轮（{{ networks.moonbase.collator_timings.leave_candidates.hours }}小时）    |
    |           撤销委托           | {{ networks.moonbase.delegator_timings.revoke_delegations.rounds }}轮（{{ networks.moonbase.delegator_timings.revoke_delegations.hours }}小时） |
    |      减少自身委托量      |      {{ networks.moonbase.delegator_timings.del_bond_less.rounds }}轮（{{ networks.moonbase.delegator_timings.del_bond_less.hours }}小时）      |
    | 奖励发放（在本轮结束后） |    {{ networks.moonbase.delegator_timings.rewards_payouts.rounds }}轮（{{ networks.moonbase.delegator_timings.rewards_payouts.hours }}小时）    |

!!! 注意事项
    上表所列值可能会在未来发布新版本时有所调整。

## 成为候选人 {: #become-a-candidate } 

### 获取候选人池的大小 {: #get-the-size-of-the-candidate-pool } 

首先，您需要获取`candidatePool`的大小（可通过治理更改），该参数将用于后续交易中。为此，您必须从[Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/js){target=_blank}中运行以下JavaScript代码段：

```js
// Simple script to get candidate pool size
const candidatePool = await api.query.parachainStaking.candidatePool();
console.log(`Candidate pool size is: ${candidatePool.length}`);
```

 1. 进入**Developer**标签
 2. 点击**JavaScript**
 3. 复制上述代码段并粘贴至代码编辑框内
 4. （可选）点击保存图标，并为代码段设置一个名称，如”Get candidatePool size“。这将在本地保存代码段
 5. 点击运行图标，以执行编辑框内的代码
 6. 点击复制图标复制结果，将在加入候选人池时使用

![Get Number of Candidates](/images/node-operators/networks/collators/activities/activities-1.png)

### 加入候选人池 {: #join-the-candidate-pool } 

节点开始运行并同步网络后，您将成为候选人（并加入候选人池）。根据您所连接的网络，前往[Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts){target=_blank}，并执行以下步骤：

 1. 进入**Developer**标签，点击**Extrinsics**
 2. 选择您想用于参与收集活动的账户
 3. 确认您的收集人账户已充值[所需的最低质押量](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=_blank}，并有多余金额用于支付交易费
 4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet
 5. 打开下拉菜单，在质押相关的所有extrinsics中，选择**joinCandidates()**函数
 6. 将绑定数量设置为成为候选人的[最低数量](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=_blank}（输入数量需以`wei`为单位）。例如，在Moonbase Alpha的最低绑定数量为{{ networks.moonbase.staking.min_can_stk }}枚DEV，以wei为单位应输入`{{ networks.moonbase.staking.min_can_stk_wei }}`（即{{ networks.moonbase.staking.min_can_stk }}再额外加18个0）。这里仅考虑候选人的绑定数量，其他委托量将不计入统计
 7. 设置候选人数量即候选人池大小。如何设置该数值请查看[获取候选人池的大小](#get-the-size-of-the-candidate-pool)部分
 8. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Join candidate pool via Polkadot.js](/images/node-operators/networks/collators/activities/activities-2.png)

!!! 注意事项
    函数名称和最低绑定数量要求可能会在未来发布新版本时有所调整。

如上所述，只有质押量排名靠前的收集人才可以进入收集人有效集。每个网络候选人的具体排名数量和最低绑定数量请查看[账户与质押要求](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=_blank}部分。

## 停止参与收集活动 {: #stop-collating } 

在[runtime1001升级](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/){target=_blank}中，用户与质押功能的交互方式进行了重大升级，其中包含取消质押的方式。

想要停止参与收集活动并离开候选人池，您必须先发起请求。发起请求并不会自动将您从候选人池中移除，您需要等待[退出生效期](#collator-timings)，才能够执行请求并停止参与收集活动。在等待具体轮次数的过程中，如果您在有效集中您仍有资格生产区块和获取奖励。

### 发起离开候选人的请求 {: #schedule-request-to-leave-candidates }

执行以下步骤开始发起一个请求：

 1. 进入**Developer**标签
 2. 点击**Extrinsics**
 3. 选择您的候选人账户
 4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet
 5. 选择**scheduleLeaveCandidates** extrinsic
 6. 输入`candidateCount`（可从[获取候选人池的大小](#get-the-size-of-the-candidate-pool)部分获得）
 7. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Schedule leave candidates request](/images/node-operators/networks/collators/activities/activities-3.png)

### 执行离开候选人的请求 {: #execute-request-to-leave-candidates }

退出生效期后，您将能够执行离开候选人的请求。为此，您需执行以下步骤：

 1. 进入**Developer**标签
 2. 点击**Extrinsics**
 3. 选择您的候选人账户
 4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet
 5. 选择**executeLeaveCandidates** extrinsic
 6. 选择目标候选人账户（在提交`scheduleLeaveCandidates` extrinsic后，任何人都可以在退出生效期后执行请求）
 7. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Execute leave candidates request](/images/node-operators/networks/collators/activities/activities-4.png)

### 取消离开候选人的请求 {: #cancel-request-to-leave-candidates }

如果您已发起离开候选人池的请求，只要请求还未被执行，您仍可以取消请求并留在候选人池中。为此，您需执行以下步骤：

 1. 进入**Developer**标签
 2. 点击**Extrinsics**
 3. 选择您的候选人账户
 4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet
 5. 选择**cancelLeaveCandidates** extrinsic
 6. 输入`candidateCount`（可从[获取候选人池的大小](#get-the-size-of-the-candidate-pool)部分获得）
 7. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Cancel leave candidates request](/images/node-operators/networks/collators/activities/activities-5.png)

## 更改自身绑定数量 {: #change-self-bond-amount }

作为候选人，更改您的自身绑定数量将略有不同，具体取决于您要增加绑定数量还是减少绑定数量。如果您想要增加绑定数量，过程颇为简单，您可直接通过`candidateBondMore()` extrinsic增加质押量，无需等待退出生效期，也无需发起和执行请求，您的请求将会即刻自动被执行。

如果您想要减少绑定数量，您需要发起请求并等待[退出生效期](#collator-timings)，随后您将能够执行请求，减少绑定部分的Token将返回至您的账户。换句话说，发起请求并不会即刻或自动减少绑定数量，只有在请求被执行后才会减少绑定数量。

### 增加自身绑定数量 {: #bond-more }

作为候选人，有两种增加质押量的选择。第一个，也是我们所推荐的选项是将要质押的资金发送到另一个您所拥有的地址，并[委托您的收集人](/tokens/staking/stake/#how-to-nominate-a-collator)。第二个，已经拥有[最低自身绑定数量](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=_blank}的收集人可以通过[Polkadot JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonriver.moonbeam.network#/accounts){target=_blank}增加其绑定数量，具体步骤如下所示：

 1. 进入**Developer**标签
 2. 点击**Extrinsics**
 3. 选择您的收集人账户（并验证该账户是否有足够资金可用于绑定）
 4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet
 5. 打开下拉菜单，在质押相关的所有外部参数中，选择**candidateBondMore()**函数
 6. 在**more: BalanceOf**字段中输入要增加的绑定数量
 7. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Collator Bond More](/images/node-operators/networks/collators/activities/activities-7.png)

### 减少自身绑定数量 {: #bond-less}

在[runtime1001升级](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/){target=_blank}中，用户与质押功能的交互方式进行了重大升级，其中包含取消质押的方式。作为收集人或候选收集人，您可能想要减少您的绑定数量，确保您所绑定的数量在减少后仍超过[最低自身绑定数量](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=_blank}。

想要减少绑定数量，您需要先发起请求并等待[退出生效期](#collator-timings)，随后执行请求。只要请求还未被执行，您仍可随时[取消请求](#cancel-bond-less-request)。

#### 发起减少绑定数量的请求 {: #schedule-bond-less-request }

想要发起减少绑定数量的请求，您可执行以下步骤：

 1. 进入**Developer**标签
 2. 点击**Extrinsics**
 3. 选择您的候选人账户
 4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet
 5. 打开下拉菜单，选择**scheduleCandidateBondLess()**函数
 6. 在**less: BalanceOf**字段中输入要减少的绑定数量
 7. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Schedule Candidate Bond Less](/images/node-operators/networks/collators/activities/activities-8.png)

当交易确认，您将需要等待退出生效期，然后才能为您执行减少绑定数量的请求。如果您尝试在退出生效期前操作，该extrinsic将会失败，并且您将看到来自Polkadot.js Apps的`parachainStaking.PendingDelegationRequest`错误。

#### 执行减少绑定数量的请求 {: #execute-bond-less-request }

退出生效期后，您将能够执行减少绑定数量的请求。为此，您需执行以下步骤：

 1. 进入**Developer**标签
 2. 点击**Extrinsics**
 3. 选择您要执行请求的账户
 4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet
 5. 选择**executeCandidateBondLess** extrinsic
 6. 选择目标候选人账户（在提交`scheduleCandidateBondLess`函数后，任何人都可以在退出生效期后执行请求）
 7. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Execute Candidate Bond Less](/images/node-operators/networks/collators/activities/activities-9.png)

交易确认后，您可以在**Accounts**标签处查看您的可用余额。请注意，请求已执行，您的余额已更新。

#### 取消减少绑定数量的请求 {: #cancel-bond-less-request }

如果您已发起增加或减少绑定数量的请求，只要请求还未被执行，您仍可以取消请求并保持原有的绑定数量。为此，您需执行以下步骤：

 1. 进入**Developer**标签
 2. 点击**Extrinsics**
 3. 选择您的候选人账户（并验证该账户是否有足够资金可用于绑定）
 4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet
 5. 选择**cancelCandidateBondRequest** extrinsic
 6. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Cancel leave candidates request](/images/node-operators/networks/collators/activities/activities-10.png)