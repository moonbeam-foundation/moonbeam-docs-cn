---
title: 质押预编译
description: Moonbeam平行链质押以太坊Solidity预编译接口的演示
---

# 与质押预编译交互

![Staking Moonbeam Banner](/images/builders/tools/precompiles/staking/staking-banner.png)

## 概览 {: #introduction }

最近推出一种名为[平行链质押](https://github.com/PureStake/moonbeam/tree/master/pallets/parachain-staking/src)的委托权益证明Pallet，使Token持有者（提名人）能够准确表达他们愿意支持的候选收集人以及希望质押的数量。除此之外，平行链质押Pallet的设计也将使链上的委托人和收集人共享风险与回报。

质押模块是使用Rust进行编码的，它同时也是Pallet的一部分，正常来说无法从Moonbeam的以太坊一侧访问和使用。然而，一个质押预编译能让开发者通过在位于地址`{{networks.moonbase.precompiles.staking}}`的预编译合约中的以太坊API使用质押功能。质押预编译功能在发布[Moonbase Alpha v8 release](https://moonbeam.network/announcements/testnet-upgrade-moonbase-alpha-v8/)时首次推出。

本教程将向您展示如何在Moonbase Alpha上与质押预编译交互。此教程同样适用于Moonriver。

## 平行链质押Solidity接口 {: #the-parachain-staking-solidity-interface }

[StakingInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)是一个接口，通过Solidity合约与平行链质押交互。因此，Solidity开发者无需学习Substrate API，即可使用熟悉的以太坊界面操作质押功能。

接口包含以下的函数：

 - **is_nominator**(*address* nominator) —— 检查指定地址当前是否为质押提名人的只读函数
 - **is_candidate**(*address* collator) —— 检查指定地址当前是否为候选收集人的只读函数
 - **is_selected_candidate**(*address* collator) —— 检查指定地址当前是否为活跃收集人集其中一部分的只读函数
 - **points**(*uint256* round) —— 获取在给定轮次中授予所有收集人总分的只读函数
 - **min_nomination**() —— 获取最小提名数量的只读函数
 - **candidate_count**() —— 获取当前候选收集人数量的只读函数
 - **collator_nomination_count**(*address* collator) —— 返回指定收集人地址的提名数量的只读函数
 - **nominator_nomination_count**(*address* nominator) —— 返回指定提名人地址提名数的只读函数
 - **join_candidates**(*uint256* amount, *uint256* candidateCount) —— 允许帐户加入拥有指定绑定数量和当前候选人数量的候选收集人集
 - **leave_candidates**(*uint256* amount, *uint256* candidateCount) —— 立即从候选收集人池中删除帐户以防止其他人将其选为收集人，并在BondDuration轮次结束后触发解绑
 - **go_offline**() —— 在不解除绑定的情况下暂时离开候选收集人集
 - **go_online**() —— 在先前调用go_offline()后，重新加入候选收集人集
 - **candidate_bond_more**(*uint256* more) —— 候选收集人根据指定数量增加绑定数量
 - **candidate_bond_less**(*uint256* less) —— 候选收集人根据指定数量减少绑定数量
 - **nominate**(*address* collator, *uint256* amount, *uint256* collatorNominationCount, *uint256* nominatorNominationCount) —— 如果操作人并不是提名人，此函数将会将其加入提名人集。如果操作人已经是提名人，此函数将会修改其提名数量
 - **leave_nominators**(*uint256* nominatorNominationCount) —— 离开提名人集并撤销所有正在进行中的提名
 - **revoke_nominations**(*address* collator) —— 撤销指定提名
 - **nominator_bond_more**(*address* collator, *uint256* more) —— 提名人根据指定数量为收集人增加绑定数量
 - **nominator_bond_less**(*address* collator, *uint256* less) —— 提名人根据指定数量为收集人减少绑定数量

## 查看先决条件 {: #checking-prerequisites } 

以下的示例将会在Moonbase Alpha上演示，然而这同样适用于其他网络，包括Moonriver和Moonbeam。

 - 安装MetaMask并将其[连接至Moonbase Alpha](/tokens/connect/metamask/)
 - 拥有一个超过`{{networks.moonbase.staking.min_del_stake}}`枚Token的账户。您可以通过[Mission Control](/builders/get-started/moonbase/#get-tokens/)获得

!!! 注意事项
    由于需要最低的提名数量以及gas费用，以下示例中需要持有超过`{{networks.moonbase.staking.min_del_stake}}`枚Token才可进行操作。若想获取更多超过水龙头分配的Token，请随时通过Discord联系我们，我们很高兴为您提供帮助。

## Remix设置 {: #remix-set-up }

1. 获得[StakingInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)的复制文档

2. 将文档内容复制并粘贴至名为StakingInterface.sol的Remix文档

![Copying and Pasting the Staking Interface into Remix](/images/builders/tools/precompiles/staking-for-cn/staking-1.png)

## 编译合约 {: #compile-the-contract }  

1. 点击（从上至下的）第二个Compile标签

2. 编译[Staking Interface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)

![Compiling StakingInteface.sol](/images/builders/tools/precompiles/staking-for-cn/staking-2.png)

## 读取合约 {: #access-the-contract }

1. 点击Remix界面中Compile标签正下方的Deploy and Run标签。**注意：**我们现在并不是在这里部署合约，而是使用先前部署的预编译合约

2. 确认已选取Environment下拉菜单中的“Injected Web3”

3. 确认已在Contract下拉菜单中勾选”ParachainStaking - Stakinginterface.sol“。另外，因为这是一个预编译合约，无需进行部署。相反地，我们将会在“At Address”区块提供预编译的地址

4. 提供质押预编译的地址：`{{networks.moonbase.precompiles.staking}}`并点击“At Address”

5. 平行链质押预编译将出现在"Deployed Contracts"列表

![Provide the address](/images/builders/tools/precompiles/staking-for-cn/staking-3.png)

## 提名一个收集人 {: #nominate-a-collator }

在本示例中，我们需要在Moonbase Alpha上提名一个收集人。提名人持有Token，并为担保的收集人质押。所有用户只要持有超过{{networks.moonbase.staking.min_del_stake}}枚可用Token皆可成为提名人。

您可自行研究并选择想要提名的收集人。在本教程中，我们将使用以下收集人地址：`{{ networks.moonbase.staking.candidates.address1 }}`。

In order to nominate a collator, you'll need to determine the current collator nomination count and nominator nomination count. The collator nomination count is the numner of nominations backing a specific collator. The nominator nomination count is the number of nominations made by the nominator.

想要提名一个收集人，您将需要确定当前收集人的提名数量和提名人的提名数量。收集人的提名数量是支持指定收集人的提名数。提名人的提名数量是提名人已参与提名的次数。

### 获取收集人的提名数量 {: #get-the-collator-nominator-count }

获取收集人提名数量，您需要调用质押预编译提供的函数。在"Deployed Contracts"列表下找到"PARACHAINSTAKING"合约，然后执行以下操作：

1. 找到"collator_nominator_count"函数并展开面板

2. 输入收集人地址（`{{ networks.moonbase.staking.candidates.address1 }}`）

3. 点击"call"

4. 调用完成后，将会显示结果

![Call collator nomination count](/images/builders/tools/precompiles/staking-for-cn/staking-4.png)

### 获取现有提名数 {: #get-your-number-of-existing-nominations }

获取现有提名数您可以通过调用"nominator_nomination_count"函数轻松获取现有的提名数，您需要执行以下操作：

1. 找到"nominator_nomination_count"函数并展开面板

2. 输入地址

3. 点击"call"

4. 调用完成后，将会显示结果

![Call nominator nomination count](/images/builders/tools/precompiles/staking-for-cn/staking-5.png)

### 调用提名 {: #call-nominate }

现在，您已获取[收集人的提名人数](#get-the-collator-nominator-count)和[现有提名数](#get-your-number-of-existing-nominations)，接下来您可以开始提名一个收集人。为此，您需要执行以下操作：

1. 发现"nominate"函数并展开面板

2. 输入收集人地址（`{{ networks.moonbase.staking.candidates.address1 }}`）

3. 提供在WEI中提名的数量。最低提名的Token数量为`{{networks.moonbase.staking.min_del_stake}}`，所以WEI中最低的数量是`5000000000000000000`

4. 输入收集人的提名数量

5. 输入您的提名数量

6. 点击"transact"

7. MetaMask将跳出弹窗，请查看详情并确认交易

![Nominate a Collator](/images/builders/tools/precompiles/staking-for-cn/staking-6.png)

## 验证提名 {: #verify-nomination }

您可以在Polkadot.js Apps查看链状态以验证您的提名是否成功。首先，[将MetaMask地址加入Polkadot.js Apps地址簿](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/addresses)。如果您已经完成这个步骤，您可以略过此步骤并直接进入下个部分。

### 将MetaMask地址加入地址簿 {: #add-metamask-address-to-address-book }

1. 导向至"Accounts" -> "Address Book"

2. 点击"Add contact"

3. 添加您的MetaMask地址

4. 为账户提供一个昵称

5. 点击"Save"

![Add to Address Book](/images/builders/tools/precompiles/staking-for-cn/staking-7.png)

### 验证提名人状态 {: #verify-nominator-state }

1. 为了验证您已成功提名，进入[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/chainstate)导向至"Developer" -> "Chain State"

2. 选择"parachainStaking" Pallet

3. 选择"nominatorState2"查询

4. 输入您的地址

5. 点击"+"按钮返回结果并验证您的提名

!!! 注意事项
    如果您想要查看提名概述，无需在"blockhash to query at"字段中输入任何内容。

![Verify Nomination](/images/builders/tools/precompiles/staking-for-cn/staking-8.png)

## 撤销一个提名 {: #revoking-a-nomination }

如果您想要撤销提名并收回您的Token，请返回Remix，然后执行以下操作：

1. 在"Deployed Contracts"列表，找到"nominator_nomination_count"函数并展开面板

2. 输入您想要撤销提名的收集人地址

3. 点击"transact"

4. MetaMask将跳出弹窗，请查看详情并确认交易

![Revoke Nomination](/images/builders/tools/precompiles/staking-for-cn/staking-9.png)

调用完成后，将会显示结果。您也可以在Polkadot.js Apps上再次检查您的提名人状态进行确认。
