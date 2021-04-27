---
title: How to Stake
标题：如何stake
description: A guide that shows how you can stake your tokens in Moonbeam by nominating collators
描述：操作说明如何通过在Moonbeam中stake来指定收集人（collators）
---


# How to Stake your Tokens
# 如何Stake
![Staking Moonbeam Banner](/images/staking/staking-stake-banner.png)

## Introduction
## 介绍

Collators (block producers) with the highest stake in the network join the active pool of collators, from which they are selected to offer a block to the Relay Chain.
在网络中有较高stake的一些收集人（区块的产生者）会加入到活跃的收集人池中，他们会被挑选出来将块信息发送给中继链（Relay Chain）

Token holders can add to the collators' stake using their tokens, a process called nomination (also referred to as staking). When they do so, they are vouching for that specific collator, and their nomination is a signal of trust.
代币持有者可以使用他们的代币来增加收集人的stake，这一过程称为提名(stake)。当他们这样做的时候，他们是在为那个特定的收集人做担保，同时也表达了对这个收集人的信任。

When a collator does not behave appropriately, its stake in the network is slashed, affecting the tokens nominated by users as well (feature currently not available in Moonbase Alpha). If collators act accordingly, they'll receive block rewards as part of the inflationary model. They can share these as staking rewards with their nominators.
当一个收集人行为不当时，它在网络中的stake就会被削减，也会影响给他提名的用户的代币(该功能目前在Moonbase Alpha中不可用)。如果收集人按规定产生块，他们将获得作为通胀模型的一部分的区块奖励。他们可以把这些奖励与提名人一起分享。

With the release of [Moonbase Alpha v6](https://github.com/PureStake/moonbeam/releases/tag/v0.6.0), users of the network can now stake their tokens to nominate collators. This guide outlines all the steps to do so.
随着[Moonbase Alpha v6](https://github.com/PureStake/moonbeam/releases/tag/v0.6.0)的发布，用户现在可以通过代币来提名收集人。

## General Definitions
## 基本定义

--8<-- 'text/staking/staking-definitions.md'

Currently, for Moonbase Alpha:
目前Moonbase Alpha一些参数

|             Variable             |     |                                                  Value                                                  |
| :------------------------------: | :-: | :-----------------------------------------------------------------------------------------------------: |
|     Minimum nomination stake     |     |                          {{ networks.moonbase.staking.min_nom_stake }} tokens                           |
|        Minimum nomination        |     |                          {{ networks.moonbase.staking.min_nom_amount}} tokens                           |
| Maximum nominators per collators |     |                             {{ networks.moonbase.staking.max_nom_per_col }}                             |
| Maximum collators per nominator  |     |                             {{ networks.moonbase.staking.max_col_per_nom }}                             |
|              Round               |     | {{ networks.moonbase.staking.round_blocks }} blocks ({{ networks.moonbase.staking.round_hours }} hours) |
|          Bond duration           |     |                            {{ networks.moonbase.staking.bond_lock }} rounds                             |


## Extrinsics Definitions
## 外部信息定义

There are many extrinsics related to the staking pallet, so all of them are not covered in this guide. However, this list defines all of the extrinsics associated with the nomination process:
在staking模块中，有很多外部定义，尽管这些定义不会都在这份说明里，但是以下列出了关于提名相关的外部定义。

!!! note
    Extrinsics might change in the future as the staking pallet is updated.
!!! 注意
    外部信息定义会随着staking模块升级而有所调整

 - **joinNominators** — two inputs: address of collator to nominate and amount. Extrinsic to join the set of nominators and nominate your first collator. The amount must be at least {{ networks.moonbase.staking.min_nom_stake }} tokens
 - **joinNominators** - 两个入参：收集人的地址和提名的代币数量。 这是你参加提名和提名第一位收集人的外部信息。这个代币数量必须大于等于{{ networks.moonbase.staking.min_nom_stake }}

 - **leaveNominators** — no inputs. Extrinsic to leave the set of nominators. Consequently, all ongoing nominations will be revoked
 - **leaveNominators** - 没有入参。；退出参加提名的外部信息，现在参加的提名都会被退回。

 - **nominateNew** — two inputs: address of collator to nominate and amount. Extrinsic to nominate a new collator after already being part of the set of nominators (read `joinNominators` extrinsic). The amount must be at least {{ networks.moonbase.staking.min_nom_amount }} tokens
 - **nominateNew** - 两个入参：收集人的地址和提名的代币数量。在已经参加里提名之后，增加提名一位新的收集人（参考**joinNominators** ）。这个代币数量必须大于等于{{ networks.moonbase.staking.min_nom_stake }}

 - **nominatorBondLess** — two inputs: address of a nominated collator and amount. Extrinsic to reduce the amount of staked tokens for an already nominated collator. The amount must not decrease your overall total staked below {{ networks.moonbase.staking.min_nom_stake }} tokens
 - **nominatorBondLess** - 两个入参：已经提名的收集人地址和代币数量。减少stake在已经提名收集人的代币数量。减少后的代币数量不能低于{{ networks.moonbase.staking.min_nom_stake }} 。

 - **nominatorBondMore** — two inputs: address of a nominated collator and amount. Extrinsic to increase the amount of staked tokens for an already nominated collator
 - **nominatorBondMore** - 两个入参：已经提名的收集人地址和代币数量。增加stake在已经提名收集人的代币数量。
 
 - **revokeNomination** — one input: address of a nominated collator. Extrinsic to remove an existing nomination
 - **revokeNomination** - 一个入参。已经提名的收集人地址。取消目前存在的提名外部信息。

 - **switchNomination** — two inputs: address of an old nominated collator and address of the new collator to nominate. Extrinsic to switch an existing nomination from a nominated collator to a new collator. If you already nominate the new collator, this will increase the nomination amount
  - **switchNomination** -- 两个入参：之前的已经提名的收集人地址和新的将要提名的收集人地址。从现有的提名人转成新的提名人，如果你已经提名了新的收集人，那么这个收集人的提名stake数量增加。

## Retrieving the List of Collators
## 获取收集人列表

Before starting to stake tokens, it is important to retrieve the list of collators available in the network. To do so, navigate to "Chain state" under the "Developer" tab.
在stake代币之前，需要获取目前在网络中的可以提名的收集人。你可以在"Chain state"的下拉菜单"Developer"中找到。

![Staking Account](/images/staking/staking-stake-10.png)

Here, provide the following information:

 1. Choose the pallet to interact with. In this case, it is the `stake` pallet
 1. 选择你要使用的模块。这里我们选择`stake`模块
 2. Choose the state to query. In this case, it is the `validators` or `candidatePool` state
 2. 选择需要请求的状态。这里我们选择`validators`或者`candidatePool`状态。
 3. Send the state query by clicking on the "+" button
 3. 通过“+”按钮发送状态请求

Each extrinsic provides a different response:
不同的外部信息返回不同的回复

 - **validators** — returns the current active set of collators, that is, the top {{ networks.moonbase.staking.max_collators }} collators by total tokens staked (including nominations)
 - **validators** - 返回现在活跃的收集人信息，按照总stake的代币排序的前{{ networks.moonbase.staking.max_collators }}收集人。

 - **candidatePool** — returns the current list all of the collators, including those that are not in the active set
 - **candidatePool** - 返回目前所有的收集人的信息，包括那些不活跃的。
 
![Staking Account](/images/staking/staking-stake-11.png)

## How to Nominate a Collator
## 怎么提名收集人

This section goes over the process of nominating collators. The tutorial will use the following collators as reference:
这部分会分享如何提名收集人，下面的教程会用以下收集人做参考

|  Variable  |     |                      Address                       |
| :--------: | :-: | :------------------------------------------------: |
| Collator 1 |     | {{ networks.moonbase.staking.collators.address1 }} |
| Collator 2 |     | {{ networks.moonbase.staking.collators.address2 }} |

To access staking features, you need to use the PolkadotJS Apps interface. To do so, you need to import/create an Ethereum-style account first (H160 address), which you can do by following [this guide](/integrations/wallets/polkadotjs/#creating-or-importing-an-h160-account).

为了可以使用staking功能，你需要使用PolkadotJS应用。你需要导入以太坊样式的账户（H160 地址），你可以按照[该教程](/integrations/wallets/polkadotjs/#creating-or-importing-an-h160-account)操作

For this example, an account was imported and named with a super original name: Alice.
在这里例子中，我们导入一个用户，名字叫Alice

Currently, everything related to staking needs to be accessed via the "Extrinsics" menu, under the "Developer" tab:
目前，staking相关的功能都在"Extrinsics"菜单栏下面的"Developer"

![Staking Account](/images/staking/staking-stake-1.png)

Here, provide the following information:
接下来，我们可以按照如下步骤：

 1. Select the account from which you want to stake your tokens
 1. 选择你用操作stake的账户

 2. Choose the pallet you want to interact with. In this case, it is the `stake` pallet
 2. 选择你要使用的模块。这里我们选择`stake`模块
 3. Choose the extrinsic method to use for the transaction. This will determine the fields that need to fill in the following steps. In this case, it is the `joinNominators` extrinsic
 3. 选择外部信息方法，之后会跳出你之后要操作的界面。这里我们选择`joinNominators`外部信息
 4. Set the collator's address you want to nominate. In this case, it is set to `{{ networks.moonbase.staking.collators.address1 }}`
 4. 设置你要提名的收集人的地址，这里我们设置为`{{ networks.moonbase.staking.collators.address1 }}`
 5. Set the number of tokens you want to stake
 5. 设置你要stake的数量
 6. Click the "Submit Transaction" button and sign the transaction
 6. 点击“提交交易”按钮，并且完成签名发送交易。

![Staking Join Nominators Extrinsics](/images/staking/staking-stake-2.png)

Once the transaction is confirmed, you can head back to the "Accounts" tab to verify that you have a reserved balance (equal to the number of tokens staked).
一旦交易确认，你可以回到"Accounts" 菜单去确认你有一部预留余额（就是你stake的数量）


To verify a nomination, you can navigate to "Chain state" under the "Developer" tab.
你可以在"Chain state"菜单的下面"Developer"中确认提名

![Staking Account and Chain State](/images/staking/staking-stake-3.png)

Here, provide the following information:
接下来，我们可以按照如下步骤：

 1. Choose the pallet you want to interact with. In this case, it is the `stake` pallet
 1. 选择你要使用的模块。这里我们选择`stake`模块
 2. Choose the state to query. In this case, it is the `nominators` state
 2. 选择需要请求的状态。这里我们选择`nominators`状态。
 3. Make sure to disable the "include option" slider3
 3. 确保去掉"include option"
 4. Send the state query by clicking on the "+" button
 4. 通过“+”按钮发送状态请求

![Staking Chain State Query](/images/staking/staking-stake-4.png)

In the response, you should see your account (in this case, Alice's account) with a list of the nominations. Each nomination contains the target address of the collator and the amount.
在请求返回中，你应该可以看到你的账户（Alice）和一系列提名信息，每一个提名中包括了收集人地址和金额。

To nominate your next collator, you need to repeat the same process as before, but this time using the `nominateNew` extrinsic (in step 3 of the "Extrinsics" instructions). In this example, Alice will nominate `{{ networks.moonbase.staking.collators.address2 }}` with 10 tokens:

你需要重复相同的操作去完成下一个收集人的提名，但是这次可以使用`nominateNew`，这次我们会使用Alice用10个代币提名`{{ networks.moonbase.staking.collators.address2 }}` 

![Staking Nominate New Extrinsic](/images/staking/staking-stake-5.png)

Once the transaction is confirmed, you can verify your new nomination in the "Chain state" option under the "Developer" tab:
一旦交易确认，你可以在"Chain state"菜单的下面"Developer"中确认提名
![Staking Nominate New Cain State](/images/staking/staking-stake-6.png)

## How to Stop Nominations
## 如何停止提名

If you are already a nominator, you have two options to stop your nominations: using the `revokeNomination` extrinsic to unstake your tokens from a specific collator, or using the `leaveNominators` extrinsic to revoke all ongoing nominations.
如果你已经提名过，你可以有两种方式来停止提名：使用`revokeNomination`从指定收集人地址收回代币。

This example is a continuation of the previous section, meaning that it assumes that you have at least two active nominations.
这部分承接上面部分，看到这里你知道已经有两笔提名

You can remove your nomination from a specific collator by navigating to the "Extrinsics" menu under the "Developer" tab. Here, provide the following information:
你可以通过"Extrinsics"菜单下的"Developer"栏目，取消对某一个特定的收集人的提名

 1. Select the account from which you want to remove your nomination
 1. 选择你要操作的用户
 2. Choose the pallet you want to interact with. In this case, it is the `stake` pallet
 2. 选择你要使用的模块。这里我们选择`stake`模块
 3. Choose the extrinsic method to use for the transaction. This will determine the fields that need to fill in the following steps. In this case, it is the `revokeNomination` extrinsic
 3. 选择外部信息方法，之后会跳出你之后要操作的界面。这里我们选择`revokeNomination`外部信息
 4. Set the collator's address you want to remove your nomination from. In this case, it is set to `{{ networks.moonbase.staking.collators.address2 }}`
 4. 设置你要取消提名的收集人的地址，这里我们设置为`{{ networks.moonbase.staking.collators.address2 }}`
 5. Click the "Submit Transaction" button and sign the transaction
 5. 点击“提交交易”按钮，并且完成签名发送交易。


![Staking Revoke Nomination Extrinsic](/images/staking/staking-stake-7.png)

Once the transaction is confirmed, you can verify that your nomination was removed in the "Chain state" option under the "Developer" tab.
一旦交易确认，你可以在"Chain state"菜单的下面"Developer"中确认提名已经被移除

Here, provide the following information:
接下来，我们可以按照如下步骤：

 1. Choose the pallet you want to interact with. In this case, it is the `stake` pallet
 1. 选择你要使用的模块。这里我们选择`stake`模块
 2. Choose the state to query. In this case, it is the `nominators` state
 2. 选择需要请求的状态。这里我们选择`nominators`状态。
 3. Make sure to disable the "include options" slider
 3. 确保去掉"include option"
 4. Send the state query by clicking on the "+" button
 4. 通过“+”按钮发送状态请求

![Staking Revoke Nomination Cain State](/images/staking/staking-stake-8.png)

In the response, you should see your account (in this case, Alice's account) with a list of the nominations. Each nomination contains the target address of the collator, and the amount.
在请求返回中，你应该可以看到你的账户（Alice）和一系列提名信息，每一个提名中包括了收集人地址和金额。

As mentioned before, you can also remove all ongoing nominations with the `leaveNominators` extrinsic (in step 3 of the "Extrinsics" instructions). This extrinsic requires no input:
之前提到过，你可以使用`leaveNominators`一次性取消目前存在的提名，这个方法没有入参。

![Staking Leave Nominatiors Extrinsic](/images/staking/staking-stake-9.png)

Once the transaction is confirmed, your account should not be listed in the `nominators` state when queried, and you should have no reserved balance (related to staking).
一旦交易确认，你的账户将会从`nominators`信息中移除，同时你也不会有预留余额

## Staking Rewards
## Staking 奖励

As collators receive rewards from block production, nominators get rewards as well. A brief overview on how the rewards are calculated can be found on [this page](/staking/overview/#reward-distribution).

当生成一个区块的时候，收集人可以获得奖励，同时提名者也可以获得奖励。[这里](/staking/overview/#reward-distribution)简单的介绍了如何计算奖励的。

In summary, nominators will earn rewards based on their stake of the total nominations for the collator being rewarded (including the collator's stake as well).
总体来说，提名者获得的奖励是根据他占收集人所有的stake代币的占比（包括收集人自己的代币）

From the previous example, Alice was rewarded with `0.0044` tokens after two payout rounds:
前面的例子来看，在两轮之后Alice可以获得`0.0044`代币
![Staking Reward Example](/images/staking/staking-stake-10.png)

## We Want to Hear From You

If you have any feedback regarding how to stake your tokens on Moonbase Alpha or any other Moonbeam-related topic, feel free to reach out through our official development [Discord channel](https://discord.gg/PfpUATX).