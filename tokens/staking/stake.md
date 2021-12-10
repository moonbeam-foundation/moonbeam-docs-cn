---
title: 如何质押
description: 本教程将展示如何通过提名收集人在Moonbeam质押代币
---

# 如何进行代币质押挖矿

![Staking Moonbeam Banner](/images/tokens/staking/stake/stake-banner.png)

## 概览 {: #introduction } 

质押最高的权益者（区块生产者）可加入活跃收集人池，入选后将负责为中继链提供区块。

代币持有者可以向收集人质押自己的代币，这一过程称为提名，也称为质押挖矿。通过这种方式，代币持有者可为某个收集人进行担保，而他们的提名则被视为对收集人的信任。

如果收集人行为不当，其网络权益将会被削减，这也会影响到用户用于提名的代币（但Moonbase Alpha目前上仍未上线这一功能）。在通货膨胀的模型下，如果这些收集人行为恰当，则可以获得区块奖励，他们可以将区块奖励作为质押挖矿回报返回给提名者。

[Moonbase Alpha v6](https://github.com/PureStake/moonbeam/releases/tag/v0.6.0)发布后，网络用户现在可以质押代币并提名收集人。本文将示范如何在Moonbase Alpha上质押，但Moonriver质押的步骤也是同样的。

## 一般定义 {: #general-definitions } 

--8<-- 'text/staking/staking-definitions.md'

目前，对于Moonbase Alpha来说，上述参数具体如下：

|        变量        |      |                              值                              |
| :----------------: | :--: | :----------------------------------------------------------: |
|   最低提名质押量   |      |     {{ networks.moonbase.staking.min_nom_stake }}枚代币      |
|   最低提名持有量   |      |     {{ networks.moonbase.staking.min_nom_amount}}枚代币      |
| 提名者的收集人限额 |      |       {{ networks.moonbase.staking.max_col_per_nom }}        |
|        轮次        |      | {{ networks.moonbase.staking.round_blocks }}区块（{{ networks.moonbase.staking.round_hours }}小时） |
|      绑定时长      |      |         {{ networks.moonbase.staking.bond_lock }}轮          |

## 外部参数定义 {: #extrinsics-definitions } 

质押挖矿模块有很多外部参数，本教程无法逐一进行介绍。但以下列表已经囊括与提名流程相关的外部参数：

!!! 注意事项
    随着质押挖矿模块不断升级，外部参数可能发生变化。

 - **nominate** —— 两个输入值：将被提名的收集人地址以及质押数量。提名一个收集人的外部参数。代币数量至少为五个
 - **leaveNominators** —— 无输入值。离开提名人群体的外部参数。由于该参数，所有现有提名将被撤销
 - **nominatorBondLess** —— 两个输入值：已提名的收集人地址及质押数量。为已获提名的收集人减少质押代币数量的外部参数。代币质押总量不能少于五个
 - **nominatorBondMore** —— 两个输入值：已提名的收集人地址及质押数量。为已获提名的收集人增加质押代币数量的外部参数
 - **revokeNomination** —— 一个输入值：已提名的收集人地址。撤销现有提名的外部参数

## 获取质押参数 {: #retrieving-staking-parameters }

您现在可以阅读关于质押的所有参数，如列在[一般定义](#general-definitions)的参数和来自Polkadot.js Apps的参数。

导向至Polkadot.js Apps **Chain State**界面，并将其连接[Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/chainstate)或是[Moonriver](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.moonriver.moonbeam.network/#chainstate)。

接着，请跟随以下步骤检索各种质押参数：

1. 在**Chain State**界面选取**Constants**标签
2. 在**selected constant query**的下拉选单中选取**parachainStaking**
3. 选取任何您希望获取数据的参数。举例而言，您可以使用**maxCollatorsPerNominator**，这将会返回您可提名的最大收集人数
4. 点击**+**以获取数据

![Retrieving staking parameters](/images/tokens/staking/stake-for-cn/stake-1.png)

您应当可以看到单个提名人可提名的最大收集人数。截至本文撰写时，在Moonbase Alpha上单个提名人可提名的最大收集人数为100。

## 获取收集人名单 {: #retrieving-the-list-of-collators }

在开始质押代币前，从网络中获取收集人名单至关重要。您可以通过以下步骤进行查看:

 1. 进入"Developer"栏 
 2. 点击"Chain State"
 3. 选择进行交互的模块。在本示例中为`parachainStaking`模块
 4. 选择请求状态。在本示例中为`selectedCandidates`或`candidatePool`状态
 5. 点击"+"按钮发送状态请求

以下每个外部参数都会返回不同结果：

 - **selectedCandidates** —— 返回目前处于活跃状态的收集人群体，也就是总Token质押量前八名的收集人（提名人的质押量也包括在内）
 - **candidatePool** —— 返回目前所有收集人的名单，包括不在活跃收集人群体中的收集人

![Staking Account](/images/tokens/staking/stake-for-cn/stake-2.png)

## 获取收集人提名数 {: #get-the-collator-nominator-count } 

首先，您需要查询`collator_nominator_count`， 因为提名时需要这个参数。此参数可以通过[Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/js)运行以下代码获得：

```js
// Simple script to get collator_nominator_count
// Remember to replace COLLATOR_ADDRESS with the address of desired collator.
const collatorAccount = 'COLLATOR_ADDRESS'; 
const collatorInfo = await api.query.parachainStaking.collatorState2(collatorAccount);
console.log(collatorInfo.toHuman()["nominators"].length);
```

 1. 打开"Developer"栏 
 2. 点击"JavaScript"
 3. 将上面的代码粘贴到编辑器
 4. （可选）点击存储并选择一个文件名，比如“获得收集人提名数”；这样即可本地存储代码
 5. 点击执行按钮；这会使代码在编辑器里运行
 6. 拷贝运行结果，这会在提名时作为参数

![Get collator nominator count](/images/tokens/staking/stake-for-cn/stake-3.png)

## 获取提名人目前提名数 {: #get-your-number-of-existing-nominations } 

如果您从来没有从这个账户进行提名，您可以跳过这步。但是如果您不确定您目前有多少个提名，您可以从[Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/js)运行以下的Javascript代码来获取`nomination_count`这个参数：

```js
// Simple script to get your number of existing nominations.
// Remember to replace YOUR_ADDRESS_HERE with your nominator address.
const yourNominatorAccount = 'YOUR_ADDRESS_HERE'; 
const nominatorInfo = await api.query.parachainStaking.nominatorState2(yourNominatorAccount);
console.log(nominatorInfo.toHuman()["nominations"].length);
```

 1. 打开"Developer"栏 
 2. 点击"JavaScript"
 3. 将上面的代码粘贴到编辑器
 4. （可选）点击存储并选择一个文件名，比如“获得提名人人提名数”；这样即可本地存储代码
 5. 点击执行按钮；这会使代码在编辑器里运行
 6. 拷贝运行结果，这会在提名时作为参数

![Get existing nomination count](/images/tokens/staking/stake-for-cn/stake-4.png)

## 如何提名收集人 {: #how-to-nominate-a-collator } 

本小节将介绍提名收集人的流程。本教程将用以下收集人作为示例：

|  变量   |      |                        地址                        |
| :-----: | :--: | :------------------------------------------------: |
| 校对器1 |      | {{ networks.moonbase.staking.collators.address1 }} |
| 校对器2 |      | {{ networks.moonbase.staking.collators.address2 }} |

使用Polkadot.js Apps交互界面进入质押挖矿功能。在此之前需要导入/创建以太坊式账户（H160地址），具体操作方式请见[此教程](/integrations/wallets/polkadotjs/#creating-or-importing-an-h160-account)。

在本示例中，我们导入了一个账户，并命名为“Alice”。

目前所有与质押挖矿相关的功能都需要通过“Developer”标签下的“Extrinsics”菜单进入：

![Staking Account](/images/tokens/staking/stake-for-cn/stake-5.png)

提名收集人，需要提供以下信息：

 1. 选择希望质押代币的账户
 2. 选择需要进行交互的模块。在本示例中为`parachainStaking`模块
 3. 选择本次交易需要使用的外部参数，这会决定接下来步骤的填写内容。在本示例中为`nominate`外部参数
 4. 设置您要提名的收集人地址。在本示例中为 `{{ networks.moonbase.staking.collators.address1 }}`
 5. 设置您要质押的代币数量
 6. 输入您[从JavaScript命令窗](/tokens/staking/stake/#get-the-collator-nominator-count)获取的`collator_nominator_count`参数
 7. 输入您[从JavaScript命令窗](/tokens/staking/stake/#get-your-number-of-existing-nominations)获取的`nomination_count` 参数；如果您从没用这个账户提过命，这里填`0`
 8. 点击“Submit Transaction”按钮，并签名确认交易

![Staking Join Nominators Extrinsics](/images/tokens/staking/stake-for-cn/stake-6.png)

!!! 注意事项
    第6步和第7步中用到的参数是为了估算Gas，所以不必和实际数据一致。但是，他们不应低于实际数据。 

交易确认后可以返回到“Accounts”标签查看冻结余额（应与质押的代币数量一致）。

您可以在“Developer”标签下的“Chain state”中查看是否已成功提名。

![Staking Account and Chain State](/images/tokens/staking/stake-for-cn/stake-7.png)

在此，请提供以下信息：

 1. 选择需要进行交互的模块。在本示例中为`parachainStaking`模块
 2. 选择请求状态。在本示例中为`nominators`状态
 3. 确保已经关闭“include option”滑块
 4. 点击"+"按钮发送状态请求

![Staking Chain State Query](/images/tokens/staking/stake-for-cn/stake-8.png)

在返回结果中可以看到，账户中（在本示例中为Alice的账户）有一个提名列表，每个提名都包含了收集人的目标地址及质押数量。

您也可以通过以上同样的步骤提名其他的收集人。例如，Alice也提名了 `{{ networks.moonbase.staking.collators.address2 }}` 。

## 如何停止提名 {: #how-to-stop-nominations } 

如果您已经是一个提名者，停止提名有两种方法。使用`revokeNomination`外部参数从特定收集人地址解锁您的代币，或使用`leaveNominators`外部参数撤销所有正在进行中的提名。

本小节继续沿用上一小节的例子。假设您现在有至少两个已激活的提名。

在“Developer”标签下的“Extrinsics”菜单中，您可以移除对某一收集人的提名。在此需要提供以下信息：

 1. 选择您需要移除提名的代币账户
 2. 选择需要进行交互的模块。在本示例中为`parachainStaking`模块
 3. 选择本次交易需要使用的外部参数，这会决定接下来步骤的填写内容。在本示例中为`revokeNomination`外部参数
 4. 设置您希望移除提名的收集人地址。在本示例中为 `{{ networks.moonbase.staking.collators.address2 }}`
 5. 点击“提交交易”按钮，并签名确认交易

![Staking Revoke Nomination Extrinsic](/images/tokens/staking/stake-for-cn/stake-9.png)

交易确认后，可以在“Developer”标签下的“Chain state”中查看是否已撤销提名。

在此需要提供以下信息：

  1. 选择需要进行交互的模块。在本示例中为`parachainStaking`模块
  2. 选择请求状态。在本示例中为`nominatorState`状态
  3. 确保已经关闭“include options”滑块
  4. 点击"+"按钮发送状态请求

![Staking Revoke Nomination Chain State](/images/tokens/staking/stake-for-cn/stake-8.png)

在返回结果中可以看到，账户中（在本示例中为Alice的账户）有一个提名列表，每个提名都包含了收集人的目标地址及质押数量。

通过`leaveNominators`外部参数，您可以继续移除所有正在进行中的提名（“外部参数”指引中的第3步）。这一参数无输入值：

![Staking Leave Nominatiors Extrinsic](/images/tokens/staking/stake-for-cn/stake-10.png)

确认交易后，您的账户将不会出现在`nominatorState`状态中，同时您（相关质押）的冻结余额也将归零。

## 质押挖矿奖励  {: #staking-rewards } 

收集人通过生产区块获得奖励，提名者也会获得奖励。在[此页面](/staking/overview/#reward-distribution)可以大概了解奖励的计算方式。

总而言之，收集人获得奖励后（奖励包括收集人本身的权益），将根据占该收集人所有提名者总权益的比例对各个提名人进行奖励分成。

从上述例子可以看到，在经过两轮支付后，Alice获得了`0.0044`代币作为奖励：

![Staking Reward Example](/images/tokens/staking/stake-for-cn/stake-11.png)
