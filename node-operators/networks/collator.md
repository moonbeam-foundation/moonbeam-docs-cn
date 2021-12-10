---
title: 收集人
description: 通过此教程学习如何在运行节点后成为Moonbeam网络的收集人
---

# 在Moonbeam上运行收集人

![Collator Moonbeam Banner](/images/node-operators/networks/collators-for-cn/collator-banner.png)

## 概览 {: #introduction }

收集人在网络上维护其所参与的平行链。他们运行（所在平行链及中继链的）全节点，并为中继链验证人创建状态转移证明。

用户可以在Moonbase Alpha和Moonriver上启动全节点，并启用`collate`功能作为收集人参与生态系统的运行。

Moonbeam使用[Nimbus平行链共识框架](/learn/features/consensus/)，通过一个两步过滤器将收集人分配到区块生产插槽：

 - 平行链质押过滤器根据每个网络中的Token质押量挑选Moonbase Alpha上排名前{{networks.moonbase.staking.max_candidates }}名收集人和Moonriver上排名前{{networks.moonriver.staking.max_candidates }}名收集人。这个过滤后的池被称为“精选候选收集人池”。每一轮这个池中的候选收集人都会进行更新
 - 固定规模子集过滤法在第一次过滤的基础之上对每个区块生产插槽进行伪随机的子集选择

此教程将带您完成以下步骤：

 - **[技术要求](#technical-requirements)** —— 展示如何从技术角度满足技术标准
 - **[账户与质押要求](#accounts-and-staking-requirements)** —— 如何完成您的帐户设置并绑定Token成为候选收集人
 - **[生成会话密钥](#generate-session-keys)** —— 解释说明如何生成会话密钥（用于将您的author ID映射到您的H160帐户）
 - **[映射author ID至您的账户](#map-author-id-to-your-account)** —— 概述如何将您的公共会话密钥映射到您的H160帐户（用于接收区块奖励）

## 技术要求 {: #technical-requirements }

从技术角度来看，收集人必须满足以下技术要求：

 - 必须运行带有验证选项的全节点。可根据[启动全节点教程](/node-operators/networks/run-a-node/overview/)选择收集人的特定代码段

## 账户与质押要求 {: #accounts-and-staking-requirements }

和波卡（Polkadot）验证人相似，收集人也需要创建账户。Moonbeam使用的是拥有私钥的H160账户或者基本的以太坊式账户。另外，需要拥有最低Token质押量才有资格成为候选人。只有一定数量的根据提名质押量排名靠前的收集人才会进入活跃「收集人集」。

=== "Moonbase Alpha"
    |    变量     |                          值                          |
    |:---------------:|:-------------------------------------------------------:|
    |   绑定量   | {{ networks.moonbase.staking.candidate_bond_min }}枚DEV   |
    | 活跃收集人集上限 | {{ networks.moonbase.staking.max_candidates }}名收集人 |

=== "Moonriver"
    |    变量     |                          值                           |
    |:---------------:|:--------------------------------------------------------:|
    |   绑定量   | {{ networks.moonriver.staking.candidate_bond_min }}枚MOVR  |
    | 活跃收集人集上限 | {{ networks.moonriver.staking.max_candidates }}名收集人 |

### Polkadot.js账户 {: #account-in-polkadotjs }

每个收集人都有一个与收集活动相关联的账户。该账户用于识别收集人作为区块生产者的身份，并从区块奖励中发送相关款项。

目前，创建[Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts)账户有两种方法：

 - 从[MetaMask](/tokens/connect/metamask/)或[MathWallet](/tokens/connect/mathwallet/)等外部钱包或服务中导入现有的（或创建新的）H160账户
 - 使用[Polkadot.js](/tokens/connect/polkadotjs/)创建新的H160账户

将H160账户导入到Polkadot.js后，就可以在“Accounts”标签下看到该账户。请确保手上已有公共地址（`PUBLIC_KEY`），我们在设置[部署全节点](/node-operators/networks/full-node/)的收集选项时需要用到它。

![Account in Polkadot.js](/images/node-operators/networks/collators-for-cn/collator-polkadotjs-1.png)

## 成为候选收集人 {: #become-a-collator-candidate }

在开始之前，您需要注意以下与收集活动相关的不同操作的时间安排：

=== "Moonbase Alpha"
    |               变量                |       值        |
    |:-------------------------------------:|:------------------:|
    |    加入/离开候选收集人池     | {{ networks.moonbase.collator_timings.leave_candidates.rounds }}轮次（{{ networks.moonbase.collator_timings.leave_candidates.hours }}小时） |
    |        新增/移除提名         | {{ networks.moonbase.collator_timings.can_bond_less.rounds }}轮次（{{ networks.moonbase.collator_timings.can_bond_less.hours }}小时） |
    | 奖励发放（在本轮结束后） | {{ networks.moonbase.delegator_timings.rewards_payouts.rounds }}轮次（{{ networks.moonbase.delegator_timings.rewards_payouts.hours }}小时） |

=== "Moonriver"
    |               变量                |       值        |
    |:-------------------------------------:|:------------------:|
    |    加入/离开候选收集人池     | {{ networks.moonriver.collator_timings.leave_candidates.rounds }}轮次（{{ networks.moonriver.collator_timings.leave_candidates.hours }}小时） |
    |        新增/移除提名         | {{ networks.moonriver.collator_timings.can_bond_less.rounds }}轮次（{{ networks.moonriver.collator_timings.can_bond_less.hours }}小时） |
    | 奖励发放（在本轮结束后） | {{ networks.moonriver.delegator_timings.rewards_payouts.rounds }}轮次（{{ networks.moonriver.delegator_timings.rewards_payouts.hours }}小时） |

!!! 注意事项
    上表所列值可能会在未来发布新版本时有所调整。

### 获取候选池的大小 {: #get-the-size-of-the-candidate-pool }

首先，您需要获取`candidatePool`的大小（可通过治理更改），该参数将用于后续交易中。为此，您必须从[Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/js)中运行以下JavaScript代码段:

```js
// Simple script to get candidate pool size
const candidatePool = await api.query.parachainStaking.candidatePool();
console.log(`Candidate pool size is: ${candidatePool.length}`);
```

  1. 进入“Developers”标签
  2. 点击"JavaScript"
  3. 复制上述代码段并粘贴至编辑框内
  4. （可选）点击保存图标，并为代码段设置一个名称，如”Get candidatePool size“。这将在本地保存代码段
  5. 点击运行图标，以执行编辑框内的代码
  6. 点击复制图标复制结果，将在加入候选收集人池时使用

![Get Number of Candidates](/images/node-operators/networks/collators-for-cn/collator-polkadotjs-2.png)

### 加入候选人池 {: #join-the-candidate-pool }

节点开始运行并同步网络后，您将成为候选收集人（并加入候选收集人池）。根据您所连接的网络，在Polkadot.js选择[Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts)或[Moonriver](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.moonriver.moonbeam.network#/accounts)，并执行以下步骤：

  1. 进入“Developers”标签，点击“Extrinsics”
  2. 选择您用于参与收集活动的账户
  3. 确认您的收集人账户已充值[所需的最低质押量](#accounts-and-staking-requirement)，并有多余金额用于支付交易费
  4. 在“submit the following extrinsics”菜单中选择`parachainStaking`模块
  5. 打开下拉菜单，在质押相关的所有外部参数中，选择`joinCandidates()`函数
  6. 将绑定金额设置为成为候选收集人的[最低数量](#accounts-and-staking-requirements)。这里仅考虑收集人的绑定数量，其他提名质押量不计入
  7. 设置候选人数量即候选人池大小。如何设置该数值请查看[此部分](#get-the-size-of-the-candidate-pool)
  8. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Join Collators pool Polkadot.js](/images/node-operators/networks/collators-for-cn/collator-polkadotjs-3.png)

!!! 注意事项
    函数名称和最低绑定金额要求可能会在未来发布新版本时有所调整。

如上所述，只有在Moonbase Alpha上提名质押量最高的前{{ networks.moonbase.staking.max_candidates }}名收集人和Mooriver上提名质押量最高的前{{ networks.moonriver.staking.max_candidates }}名收集人才可以进入活跃「收集人集」。

### 停止参与收集活动 {: #stop-collating }

与波卡（Polkadot）的`chill()`函数相似，按照前述相同步骤进行操作，便可离开候选收集人池，但在第5步时需要选择`leaveCandidates()`函数。

### 增加绑定量 {: #bond-more }
作为收集人或者候选收集人，有两种增加质押的选择。第一个，也是我们所推荐的选项是将要质押的资金发送到另一个拥有的地址，并[提名您的收集人](/tokens/staking/stake/#how-to-nominate-a-collator)。第二个，是拥有 {{networks.moonriver.staking.candidate_bond_min }}枚MOVR的收集人通过[Polkadot JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.moonriver.moonbeam.network#/accounts)增加其绑定数量，具体操作如下所示：

  1. 进入“Developer”标签
  2. 点击“Extrinsics”
  3. 选择您的收集人账户（并确认绑定所需的额外资金）
  4. 在“submit the following extrinsics”菜单中选择`parachainStaking`模块
  5. 打开下拉菜单，在质押相关的所有外部参数中，选择`candidateBondMore()`函数
  6. 在`more: BalanceOf`字段中设置要增加的绑定数量
  7. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Collator Bond More](/images/node-operators/networks/collators-for-cn/collator-polkadotjs-7.png)

### 减少绑定量 {: #bond-less }
作为收集人或候选收集人，如果您所绑定的MOVR数量超过{{ networks.moonriver.staking.candidate_bond_min }}枚，您可以减少您的绑定数量。

!!! note 注意事项
    Moonriver收集人现在在网络启动过程的绑定数量一度为100枚MOVR。作为收集人，如果您所绑定的数量等于或少于{{ networks.moonriver.staking.candidate_bond_min }}枚MOVR，您将无法减少您的绑定数量。

  1. 进入“Developer”标签
  2. 点击“Extrinsics”
  3. 选择您的收集人账户
  4. 在“submit the following extrinsics”菜单中选择`parachainStaking`模块
  5. 打开下拉菜单，在质押相关的所有外部参数中，选择`candidateBondLess()`函数
  6. 在`less: BalanceOf`字段中设置要减少的绑定数量
  7. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Collator Bond Less](/images/node-operators/networks/collators-for-cn/collator-polkadotjs-8.png)

## 会话密钥 {: #session-keys }

随着[Moonbase Alpha v8](/networks/testnet/)版本的发布，收集人将使用author ID（基本上是[会话密钥](https://wiki.polkadot.network/docs/learn-keys#session-keys)）签署区块。为了符合Substrate标准，Moonbeam收集人的会话密钥为[SR25519](https://wiki.polkadot.network/docs/learn-keys#what-is-sr25519-and-where-did-it-come-from)。本教程将向您展示如何创建/转换与收集人节点相关联的会话密钥。

首先，请确保您正在[运行收集人节点](/node-operators/networks/run-a-node/overview/)并已公开RPC端口。一旦您开始运行收集人节点，您的终端应出现类似以下日志：

![Collator Terminal Logs](/images/node-operators/networks/collators-for-cn/collator-terminal-1.png)

接着，通过使用`author_rotateKeys`方法将RPC调用发送到HTTP端点来转换会话密钥。若收集人的HTTP端点位于端口`9933`，则JSON-RPC调用可能如下所示：

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

![Collator Terminal Logs RPC Rotate Keys](/images/node-operators/networks/collators-for-cn/collator-terminal-2.png)

请确保您已记下author ID的公钥。接下来，这将被映射到H160以太坊式地址（用于接收区块奖励）。

## 映射Author ID到您的账户 {: #map-author-id-to-your-account }

生成author ID（会话密钥）后，将其映射到您的H160帐户（以太坊式地址）。该账户将用于接收区块奖励，请确保您拥有其私钥。

在author ID映射到您的账户时，系统将会发送一定数量的Token绑定到您的账户。该Token由author ID注册获得。网络发送的Token数量设置如下所示：

 - Moonbase Alpha - {{ networks.moonbase.staking.collator_map_bond }}枚DEV 
 - Moonriver - {{ networks.moonriver.staking.collator_map_bond }}枚MOVR 

`authorMapping`模块具有以下外部编程：

 - **addAssociation** (*address* authorID) —— 将您的author ID映射到发送交易的H160账户，确认这是其私钥的真正持有者。这将需要一定的[绑定量](#accounts-and-staking-requirements)
 - **clearAssociation** (*address* authorID) —— 将清除author ID和发送交易的H160账户之间的连接，需要由author ID的持有者进行操作。这将退还绑定量
 - **updateAssociation** (*address* oldAuthorID, *address* newAuthorID) —— 将旧的author ID映射至新的author ID，对私钥转换和迁移极为实用。并将自动执行`add`和`clear`两个连接外部参数，使得私钥转换无需第二次绑定量

这个模块同时也新增以下RPC调用（链状态）：

- **mapping** (*address* optionalAuthorID) —— 将显示所有储存在链上的映射内容，或是根据您的输入显示相关内容。

### 映射外部信息 {: #mapping-extrinsic }

如果您想要将您的author ID映射至您的账户，您需要成为[候选收集人池](#become-a-collator-candidate)中的一员。当您成功成为候选人，您将需要传送您的映射外部信息（交易）。请注意，每一次注册author ID将会绑定Token。请执行以下步骤：

  1. 进入“Developer“标签
  2. 选择”Extrinsics”
  3. 选取您想要映射author ID的目标账户（用于签署此交易）
  4. 选取`authorMapping`外部信息
  5. 将方法设置为`addAssociation()` 
  6. 输入author ID。在此示例中，这在前一个部分通过RPC调用`author_rotateKeys`获得
  7. 点击“Submit Transaction”

![Author ID Mapping to Account Extrinsic](/images/node-operators/networks/collators-for-cn/collator-polkadotjs-4.png)

如果交易成功，您将看到确认通知。如果没有，请确认您是否已加入[候选收集人池](#become-a-collator-candidate)。

![Author ID Mapping to Account Extrinsic Successful](/images/node-operators/networks/collators-for-cn/collator-polkadotjs-5.png)

### 检查映射设定 {: #checking-the-mappings }

您也可以通过验证链上状态来确认目前的链上映射情况，请根据以下步骤进行操作：

 1. 进入“Developer”标签
 2. 选择“Chain State”
 3. 选择`authorMapping`作为查询状态
 4. 选择`mappingWithDeposit`方法
 5. 提供author ID进行查询。您也可以通过关闭按钮以停止检索所有链上的映射情况
 6. 点击“+”按钮来传送RPC调用

![Author ID Mapping Chain State](/images/node-operators/networks/collators-for-cn/collator-polkadotjs-6.png)

You should be able to see the H160 account associated with the author ID provided. If no author ID was included, this would return all the mappings stored on-chain.

您应该能够看到与提供的author ID相关联的H160帐户。如果未包含author ID，这将返回存储在链上的所有映射。
