---
title: 收集人
description: 学习如何在运行节点后成为Moonbeam网络的收集人
---

# 在Moonbeam上运行收集人

![Collator Moonbeam Banner](/images/node-operators/networks/collators/collator-banner.png)

## 概览 {: #introduction } 

收集人在网络上维护其所参与的平行链。他们运行（所在平行链及中继链的）全节点，并为中继链验证人创建状态转移证明。

用户可以在Moonbase Alpha和Moonriver上启动全节点，并启用`collate`功能作为候选收集人参与生态系统的运行。候选人进入收集人有效集后有资格生产区块。

Moonbeam使用[Nimbus平行链共识框架](/learn/features/consensus/)，通过一个两步过滤器将候选人分配到收集人有效集，随后再分配到区块生产插槽：

 - 平行链质押过滤器根据每个网络中的Token质押量挑选Moonbase Alpha上排名前{{ networks.moonbase.staking.max_candidates }}名候选人和Moonriver上排名前{{ networks.moonriver.staking.max_candidates }}名候选人。这个过滤后的池被称为“精选候选人池”。每一轮这个池中的候选人都会进行更新
 - 固定规模子集过滤法在第一次过滤的基础之上对每个区块生产插槽进行伪随机的子集选择

此教程将带您完成以下步骤：

 - **[技术要求](#technical-requirements)** —— 展示您必须满足的技术角度标准
 - **[账户与质押要求](#accounts-and-staking-requirements)** —— 如何完成您的帐户设置并绑定Token成为候选人
 - **[生成会话密钥](#generate-session-keys)** —— 解释说明如何生成会话密钥（用于将您的author ID映射到您的H160帐户）
 - **[映射author ID至您的账户](#map-author-id-to-your-account)** —— 概述如何将您的公共会话密钥映射到您的H160帐户（用于接收区块奖励）

## 技术要求 {: #technical-requirements }

从技术角度来看，收集人必须满足以下技术要求：

 - 必须运行带有收集选项的全节点。可根据[启动全节点教程](/node-operators/networks/run-a-node/overview/)选择收集人的特定代码段

## 账户与质押要求 {: #accounts-and-staking-requirements }

和波卡（Polkadot）验证人相似，收集人也需要创建账户。Moonbeam使用的是拥有私钥的H160账户或以太坊式账户。另外，需要拥有最低Token质押量才有资格成为候选人。只有一定数量的根据提名质押量排名靠前的收集人才会进入收集人有效集。

=== "Moonriver"
    |    变量     |                           值                           |
    |:---------------:|:---------------------------------------------------------:|
    |   绑定数量   | {{ networks.moonriver.staking.candidate_bond_min }}枚MOVR  |
    | 有效集上限 | {{ networks.moonriver.staking.max_candidates }}名收集人 |

=== "Moonbase Alpha"
    |    变量     |                          值                           |
    |:---------------:|:--------------------------------------------------------:|
    |   绑定数量   |  {{ networks.moonbase.staking.candidate_bond_min }}枚DEV  |
    | 有效集上限 | {{ networks.moonbase.staking.max_candidates }}名收集人 |

### Polkadot.js账户 {: #account-in-polkadotjs }

每个收集人都有一个与收集活动相关联的账户。该账户用于识别收集人作为区块生产者的身份，并从区块奖励中发送相关款项。

目前，创建[Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts)账户有两种方法：

 - 从[MetaMask](/tokens/connect/metamask/)或[MathWallet](/tokens/connect/mathwallet/)等外部钱包或服务中导入现有的（或创建新的）H160账户
 - 使用[Polkadot.js](/tokens/connect/polkadotjs/)创建新的H160账户

将H160账户导入到Polkadot.js后，就可以在**Accounts**标签下看到该账户。请确保手上已有公共地址（`PUBLIC_KEY`），我们在设置[全节点](/node-operators/networks/run-a-node/overview/)的收集选项时需要用到它。

![Account in Polkadot.js](/images/node-operators/networks/collators/collator-polkadotjs-1.png)

## 成为候选收集人 {: #become-a-candidate }

在开始之前，您需要注意以下与收集和委托活动相关的不同操作的时间安排：

=== "Moonriver"
    |               变量                |                                                                          值                                                                          |
    |:-------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |           离开候选人            |    {{ networks.moonriver.collator_timings.leave_candidates.rounds }}轮（{{ networks.moonriver.collator_timings.leave_candidates.hours }}小时）    |
    |          撤销委托           | {{ networks.moonriver.delegator_timings.revoke_delegations.rounds }}轮（{{ networks.moonriver.delegator_timings.revoke_delegations.hours }}小时） |
    |     减少候选人委托      |       {{ networks.moonriver.collator_timings.can_bond_less.rounds }}轮（{{ networks.moonriver.collator_timings.can_bond_less.hours }}小时）       |
    | 奖励发放（在本轮结束后） |    {{ networks.moonriver.delegator_timings.rewards_payouts.rounds }}轮（{{ networks.moonriver.delegator_timings.rewards_payouts.hours }}小时）    |

=== "Moonbase Alpha"
    |               变量                |                                                                         值                                                                         |
    |:-------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |           离开候选人            |    {{ networks.moonbase.collator_timings.leave_candidates.rounds }}轮（{{ networks.moonbase.collator_timings.leave_candidates.hours }}小时）    |
    |          撤销委托           | {{ networks.moonbase.delegator_timings.revoke_delegations.rounds }}轮（{{ networks.moonbase.delegator_timings.revoke_delegations.hours }}小时） |
    |     减少候选人委托      |     {{ networks.moonriver.delegator_timings.del_bond_less.rounds }}轮（{{ networks.moonriver.delegator_timings.del_bond_less.hours }}小时）     |
    | 奖励发放（在本轮结束后） |    {{ networks.moonbase.delegator_timings.rewards_payouts.rounds }} rounds ({{ networks.moonbase.delegator_timings.rewards_payouts.hours }}小时）    |

!!! 注意事项
    加入候选收集人池将即刻生效。添加或增加委托也将即刻生效，但奖励会在 {{networks.moonriver.delegator_timings.rewards_payouts.rounds }}轮后开始发放。上表所列值可能会在未来发布新版本时有所调整。

### 获取候选池的大小 {: #get-the-size-of-the-candidate-pool }

首先，您需要获取`candidatePool`的大小（可通过治理更改），该参数将用于后续交易中。为此，您必须从[Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/js)中运行以下JavaScript代码段:

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

![Get Number of Candidates](/images/node-operators/networks/collators/collator-polkadotjs-2.png)

### 加入候选人池 {: #join-the-candidate-pool }

节点开始运行并同步网络后，您将成为候选人（并加入候选人池）。根据您所连接的网络，在Polkadot.js选择[Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts)或[Moonriver](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.moonriver.moonbeam.network#/accounts)，并执行以下步骤：

 1. 进入**Developer**标签，点击**Extrinsics**

 2. 选择您想用于参与收集活动的账户

 3. 确认您的收集人账户已充值[所需的最低质押量](#accounts-and-staking-requirements)，并有多余金额用于支付交易费

 4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet

 5. 打开下拉菜单，在质押相关的所有外部参数中，选择**joinCandidates()**函数

 6. 将绑定数量设置为成为候选人的[最低数量](#accounts-and-staking-requirements)（输入数量需以`wei`为单位）。例如，在Moonbase Alpha的最低绑定数量为{{ networks.moonbase.staking.candidate_bond_min }}枚DEV，以wei为单位应输入`{{ networks.moonbase.staking.candidate_bond_min_wei }}`（即21个0）。在Moonriver的最低绑定数量为{{ networks.moonriver.staking.candidate_bond_min }}枚MOVR，以wei为单位应输入`{{ networks.moonriver.staking.candidate_bond_min_wei }}`（即20个0）。这里仅考虑候选人的绑定数量，其他委托量将不计入统计

 7. 设置候选人数量即候选人池大小。如何设置该数值请查看[获取候选人池的大小](#get-the-size-of-the-candidate-pool)部分

  8. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Join candidate pool via Polkadot.js](/images/node-operators/networks/collators/collator-polkadotjs-16.png)

!!! 注意事项
    函数名称和最低绑定数量要求可能会在未来发布新版本时有所调整。

如上所述，只有在Moonbase Alpha上委托质押量最高的前{{ networks.moonbase.staking.max_collators }}名候选人和Mooriver上委托质押量最高的前{{ networks.moonriver.staking.max_collators }}名候选人才可以进入收集人有效集。

## 停止参与收集活动 {: #stop-collating }

在最新的runtime升级（[runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/)）中，用户与质押功能的交互方式进行了重大升级，其中包含取消质押的方式。

想要停止参与收集活动并离开候选人池，您必须先发起请求。发起请求并不会自动将您从候选人池中移除，您需要等待延迟时段，才能够执行请求并停止参与收集活动。在Moonriver上会有{{ networks.moonriver.collator_timings.leave_candidates.rounds }}轮（{{ networks.moonriver.collator_timings.leave_candidates.hours }}小时）的延迟。在Moonbase Alpha上会有{{ networks.moonbase.collator_timings.leave_candidates.rounds }}（{{ networks.moonbase.collator_timings.leave_candidates.hours }}小时）的延迟。在等待具体的轮次数的过程中，如果您在有效集中您仍有资格生产区块和获取奖励。

#### 发起离开候选人的请求 {: #schedule-request-to-leave-candidates }

执行以下步骤开始发起一个请求：

 1. 进入**Developer**标签

 2. 点击**Extrinsics**

 3. 选择您的候选人账户

 4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet

 5. 选择**scheduleLeaveCandidates**函数

 6. 输入`candidateCount`（可从[获取候选人池的大小](#get-the-size-of-the-candidate-pool)部分获得）

  7. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Schedule leave candidates request](/images/node-operators/networks/collators/collator-polkadotjs-9.png)

#### 执行离开候选人的请求 {: #execute-request-to-leave-candidates }

延迟时段过后，您将能够执行离开候选人的请求。为此，您需执行以下步骤：

 1. 进入**Developer**标签

 2. 点击**Extrinsics**

 3. 选择您的候选人账户

 4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet

 5. 选择**executeLeaveCandidates**函数

 6. 选择目标候选人账户（在提交`scheduleLeaveCandidates`函数后，任何人都可以在延迟时段过后执行请求）

  7. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Execute leave candidates request](/images/node-operators/networks/collators/collator-polkadotjs-10.png)

#### 取消离开候选人的请求 {: #cancel-request-to-leave-candidates }

如果您已发起离开候选人池的请求，只要请求还未被执行，您仍可以取消请求并留在候选人池中。为此，您需执行以下步骤：

 1. 进入**Developer**标签

 2. 点击**Extrinsics**

 3. 选择您的候选人账户

 4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet

 5. 选择**cancelLeaveCandidates**函数

 6. 输入`candidateCount`（可从[获取候选人池的大小](#get-the-size-of-the-candidate-pool)部分获得）

  7. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Cancel leave candidates request](/images/node-operators/networks/collators/collator-polkadotjs-11.png)

## 更改候选人绑定数量 {: #change-candidate-bond-amount }

更改您的候选人绑定数量将略有不同，具体取决于您要增加绑定数量还是减少绑定数量。如果您想要增加绑定数量，过程颇为简单，您可直接通过`candidateBondMore()`函数增加质押量，无需等待任何延迟，也无需发起和执行请求，您的请求将会即刻自动被执行。

如果您想要减少绑定数量，您需要发起请求并等待延迟时段，随后您将能够执行请求，减少绑定部分的Token将返回至您的账户。在Moonbase Alpha上会有{{ networks.moonbase.collator_timings.can_bond_less.rounds }}轮（{{ networks.moonbase.collator_timings.can_bond_less.hours }}小时）的延迟，在Moonriver上会有{{ networks.moonriver.collator_timings.can_bond_less.rounds }}轮（{{ networks.moonriver.collator_timings.can_bond_less.hours }}小时）的延迟。换句话说，发起请求并不会即刻或自动减少绑定数量，只有在请求被执行后才会减少绑定数量。

### 增加绑定数量 {: #bond-more }

作为候选人，有两种增加质押量的选择。第一个，也是我们所推荐的选项是将要质押的资金发送到另一个属于您控制的地址，并[委托您的收集人](tokens/staking/stake/#how-to-nominate-a-collator)。第二个，是拥有{{ networks.moonriver.staking.candidate_bond_min }}枚MOVR的收集人通过[Polkadot JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.moonriver.moonbeam.network#/accounts)增加其绑定数量，具体步骤如下所示：

 1. 进入**Developer**标签

 2. 点击**Extrinsics**

 3. 选择您的收集人账户（并验证该账户是否有足够资金可用于绑定）

 4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet

 5. 打开下拉菜单，在质押相关的所有外部参数中，选择**candidateBondMore()**函数

 6. 在**more: BalanceOf**字段中输入要增加的绑定数量

  7. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

!!! 注意事项
    收集人不会因增加绑定数量而获得额外奖励。想要增加您质押的MOVR数量，建议您将资金发送至另一个拥有的地址并委托给您的收集人。

![Collator Bond More](/images/node-operators/networks/collators/collator-polkadotjs-7.png)

### 减少绑定数量 {: #bond-less }

在最新的runtime升级（[runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/)）中，用户与质押功能的交互方式进行了重大升级，其中包含取消质押的方式。作为在Moonriver上的收集人或候选收集人，如果您所绑定的MOVR数量超过{{ networks.moonriver.staking.candidate_bond_min }}枚，您可以减少您的绑定数量。

!!! 注意事项
    Moonriver收集人的绑定数量在早期网络启动阶段为100枚MOVR。作为收集人，如果您所绑定的数量等于或少于{{ networks.moonriver.staking.candidate_bond_min }}枚MOVR，您将无法减少您的绑定数量。

想要减少绑定数量，您需要先发起请求并等待延迟时段，随后执行请求。只要请求还未被执行，您仍可随时[取消请求](#cancel-request)。

在Moonbase Alpha上会有{{ networks.moonbase.delegator_timings.revoke_delegations.rounds }}轮（{{ networks.moonbase.delegator_timings.revoke_delegations.hours }}小时）的延迟，在Moonriver上会有{{ networks.moonriver.delegator_timings.revoke_delegations.rounds }}轮（{{ networks.moonriver.delegator_timings.revoke_delegations.hours }}小时）的延迟。

#### 发起请求 {: #schedule-request }

想要发起减少绑定数量的请求，您可执行以下步骤：

 1. 进入**Developer**标签

 2. 点击**Extrinsics**

 3. 选择您的候选人账户

 4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet

 5. 打开下拉菜单，选择**scheduleCandidateBondLess()**函数

 6. 在**less: BalanceOf**字段中输入要减少的绑定数量

  7. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Schedule Candidate Bond Less](/images/node-operators/networks/collators/collator-polkadotjs-12.png)

当交易确认，您将需要等待延迟时段，然后才能为您执行减少绑定数量的请求。如果您尝试在延迟时段前操作，该操作将会失败，并且您将看到来自Polkadot.js Apps的`parachainStaking.PendingDelegationRequest`错误。

#### 执行请求 {: #execute-request }

延迟时段过后，您将能够执行减少绑定数量的请求。为此，您需执行以下步骤：

 1. 进入**Developer**标签

 2. 点击**Extrinsics**

 3. 选择您要执行请求的账户

 4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet

 5. 选择**executeCandidateBondLess**函数

 6. 选择目标候选人账户（在提交`scheduleCandidateBondLess`函数后，任何人都可以在延迟时段过后执行请求）

  7. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Execute Candidate Bond Less](/images/node-operators/networks/collators/collator-polkadotjs-13.png)

交易确认后，您可以在**Accounts**标签处查看您的可用余额。请注意，请求已执行，您的余额已更新。

#### 取消请求 {: #cancel-request }

如果您已发起增加或减少绑定数量的请求，只要请求还未被执行，您仍可以取消请求并保持原有的绑定数量。为此，您需执行以下步骤：

 1. 进入**Developer**标签

 2. 点击**Extrinsics**

 3. 选择您的候选人账户（并验证该账户是否有足够资金可用于绑定）

 4. 在**submit the following extrinsic**菜单中选择**parachainStaking** pallet

 5. 选择**cancelCandidateBondRequest**函数

  6. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Cancel leave candidates request](/images/node-operators/networks/collators/collator-polkadotjs-14.png)


## 会话密钥 {: #session-keys }

收集人将使用author ID（基本上是[会话密钥](https://wiki.polkadot.network/docs/learn-keys#session-keys)）签署区块。为了符合Substrate标准，Moonbeam收集人的会话密钥为[SR25519](https://wiki.polkadot.network/docs/learn-keys#what-is-sr25519-and-where-did-it-come-from)。本教程将向您展示如何创建/转换与收集人节点相关联的会话密钥。

首先，请确保您正在[运行收集人节点](/node-operators/networks/run-a-node/overview/)并已公开RPC端口。一旦您开始运行收集人节点，您的终端应出现类似以下日志：

![Collator Terminal Logs](/images/node-operators/networks/collators/collator-terminal-1.png)

接下来，通过使用`author_rotateKeys`方法将RPC调用发送到HTTP端点来转换会话密钥。若收集人的HTTP端点位于端口`9933`，则JSON-RPC调用可能如下所示：

```
curl http://127.0.0.1:9933 -H \
"Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"author_rotateKeys",
    "params": []
  }'
```

收集人节点应使用新的author ID（会话密钥）的相应公共密钥进行响应。

![Collator Terminal Logs RPC Rotate Keys](/images/node-operators/networks/collators/collator-terminal-2.png)

请确保您已记下author ID的公钥。接下来，这将被映射到H160以太坊式地址（用于接收区块奖励）。

## 映射Author ID到您的账户 {: #map-author-id-to-your-account }

生成author ID（会话密钥）后，将其映射到您的H160帐户（以太坊式地址）。该账户将用于接收区块奖励，请确保您拥有其私钥。

在author ID映射到您的账户时，系统将会发送一定数量的Token绑定到您的账户。该Token由author ID注册获得。网络发送的Token数量设置如下所示：

 - Moonbase Alpha - {{ networks.moonbase.staking.collator_map_bond }}枚DEV 
 - Moonriver - {{ networks.moonriver.staking.collator_map_bond }}枚MOVR

`authorMapping`模块具有以下外部编程：

 - **addAssociation** (*address* authorID) —— 将您的author ID映射到发送交易的H160账户，确认这是其私钥的真正持有者。这将需要一定的[绑定数量](#accounts-and-staking-requirements)
 - **clearAssociation** (*address* authorID) —— 将清除author ID和发送交易的H160账户之间的连接，需要由author ID的持有者进行操作。这将退还绑定数量
 - **updateAssociation** (*address* oldAuthorID, *address* newAuthorID) —— 将旧的author ID映射至新的author ID，对私钥转换和迁移极为实用。这将自动执行`add`和`clear`两个关联函数，使得私钥转换无需第二次绑定

这个模块同时也新增以下RPC调用（链状态）：

- **mapping** (*address* optionalAuthorID) —— 将显示所有储存在链上的映射内容，或是根据您的输入显示相关内容

### 映射外部信息 {: #mapping-extrinsic }

如果您想要将您的author ID映射至您的账户，您需要成为[候选人池](#become-a-candidate)中的一员。当您成功成为候选人，您将需要传送您的映射外部信息（交易）。请注意，每一次注册author ID将会绑定Token。为此，请执行以下步骤：

 1. 进入**Developer**标签

 2. 点击**Extrinsics**

 3. 选取您想要映射author ID的目标账户（用于签署此交易）

 4. 选择**authorMapping**函数

 5. 选择**addAssociation()**函数

 6. 输入author ID。在本示例中，可在前一个部分通过RPC调用`author_rotateKeys`获得

  7. 点击**Submit Transaction**

![Author ID Mapping to Account Extrinsic](/images/node-operators/networks/collators/collator-polkadotjs-4.png)

如果交易成功，您将看到确认通知。如果没有，请确认您是否已加入[候选人池](#become-a-candidate)。

![Author ID Mapping to Account Extrinsic Successful](/images/node-operators/networks/collators/collator-polkadotjs-5.png)

### 检查映射设定 {: #checking-the-mappings }

您也可以通过验证链上状态来确认目前的链上映射情况。为此，请执行以下步骤：

 1. 进入**Developer**标签

 2. 点击**Chain state**

 3. 选择**authorMapping**作为查询状态

 4. 选择**mappingWithDeposit**函数

 5. 提供author ID进行查询。您也可以通过关闭按钮以停止检索所有链上的映射情况

  6. 点击**+**按钮来传送RPC调用

![Author ID Mapping Chain State](/images/node-operators/networks/collators/collator-polkadotjs-6.png)

您应该能够看到与提供的author ID相关联的H160帐户。如果未包含author ID，这将返回存储在链上的所有映射。
