---
title: 质押预编译
description: Moonbeam平行链质押以太坊Solidity预编译接口的演示
---

# 质押预编译

![Staking Moonbeam Banner](/images/staking/staking-precompile-banner.png)

## 概览 {: #introduction } 

最近推出一种名为[平行链质押](https://github.com/PureStake/moonbeam/tree/master/pallets/parachain-staking/src)的委托权益证明pallet，使token持有者（提名人）能够准确表达他们愿意支持的候选收集人以及希望质押的数量。除此之外，平行链质押pallet的设计也将使链上的委托人和收集人共享风险与回报。

质押模块是使用Rust进行编码的，它同时也是pallet的一部分，正常来说无法从Moonbeam的以太坊一侧访问和使用。然而，一个质押预编译能让开发者通过在位于地址`{{networks.moonbase.staking.precompile_address}}`的预编译合约中的以太坊API使用质押功能。质押预编译功能在发布[Moonbase Alpha v8 release](https://moonbeam.network/announcements/testnet-upgrade-moonbase-alpha-v8/)时首次推出。

## 平行链质押Solidity接口  {: #the-parachainstaking-solidity-interface } 

[质押接口.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)是一个接口，通过Solidity合约与平行链质押互操作。因此，Solidity开发者无需学习Substrate API，即可使用熟悉的以太坊界面操作质押功能。

接口包含以下的函数：

 - **is_nominator**(*address* collator) —— 检查指定地址当前是否为质押提名人的只读函数
 - **is_candidate**(*address* collator) —— 检查指定地址当前是否为收集人候选者的只读函数
 - **min_nomination**() —— 获得最小提名数量的只读函数
 - **join_candidates**(*unit256* amount) —— 允许账户加入拥有指定保证金金额的候选收集人集
 - **leave_candidates**() —— 立即从候选人池中移除账户防止其他人将其选为收集人，并在BondDuration轮次结束后触发解绑
 - **go_offline**() —— 在不解除绑定的情况下暂时离开候选收集人集
 - **go_online**() —— 在先前调用go_offline()后，重新加入候选收集人集
 - **candidate_bond_more**(*uint256* more) —— 候选收集人根据特定金额增加保证金
 - **candidate_bond_less**(*uint256* less) —— 候选收集人根据特定金额减少保证金
 - **nominate**(*address* collator, *uint256* amount) —— 如果操作人并不是提名人，此函数将会将其加入提名人集。如果操作人已经是提名人，此函数将会修改其提名数量
 - **leave_nominators**() —— 离开提名人集并撤销所有正在进行中的提名
 - **revoke_nominations**(*address* collator) —— 撤销特定提名
 - **nominator_bond_more**(*address* collator, *uint256* more) —— 提名人根据特定金额为指定收集人提高保证金数量
 - **nominator_bond_less**(*address* collator, *uint256* less) —— 提名人根据特定金额为指定收集人减少保证金数量

## 操作质押预编译 {: #interacting-with-the-staking-precompile } 

### 查看先决条件 {: #checking-prerequisites }
以下的示例将会在Moonbase Alpha上演示，然而这同样适用于其他网络，包括Moonriver和Moonbeam。

 - 安装MetaMask并将其[连接至Moonbase Alpha](/getting-started/moonbase/metamask/)
 - 拥有一个超过`{{networks.moonbase.staking.min_nom_stake}}`枚token的账户。您可以通过[Mission Control](/getting-started/moonbase/faucet/)获得。/getting-started/moonbase/faucet/)

!!! 注意事项
    由于需要最低的提名数量以及gas费用，以下示例中需要持有超过`{{networks.moonbase.staking.min_nom_stake}}`枚tokens才可进行操作。若想获取更多超过水龙头分配的token，请随时通过Discord联系我们，我们很高兴为您提供帮助。

### Remix设置 {: #remix-set-up } 
1. 获得[StakingInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)的复制文档
2. 复制并贴上文档内容至名为StakingInterface.sol的Remix文档

![Copying and Pasting the Staking Interface into Remix](/images/staking/staking-precompile-1.png)

### 编译合约 {: #compile-the-contract } 
1. 点击（从上至下）的第二个Compile标签
2. 编译[Staking Interface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)

![Compiling StakingInteface.sol](/images/staking/staking-precompile-2.png)

### 读取合约 {: #access-the-contract } 
1. 点击Remix界面中Compile标签正下方的Deploy and Run标签。**注意：**我们现在并不是在这里部署合约，而是使用先前部署的预编译合约。
2. 确认已选取Environment下拉菜单中的“Injected Web3”。
3. 确认已在Contract下拉菜单中勾选”ParachainStaking - Stakinginterface.sol“。另外，因为这是一个预编译合约，无需进行部署。相反地，我们将会在“At Address”区块提供预编译的地址。
4. 提供质押预编译的地址：`{{networks.moonbase.staking.precompile_address}}`并点击“At Address”。

![Provide the address](/images/staking/staking-precompile-3.png)

### 提名一个收集人 {: #nominate-a-collator } 
在这个示例中，我们需要提名一个收集人。提名人持有token，并为担保的收集人质押。所有用户只要持有超过 `{{networks.moonbase.staking.min_nom_stake}}`枚token皆可成为提名人。

1. 使用合约地址扩充面板。找到提名函数并展开面板以查看函数
2. 提供收集人的地址，如`{{ networks.moonbase.staking.collators.address1 }}`
3. 提供在WEI中提名的数量。最低提名的token数量为`{{networks.moonbase.staking.min_nom_stake}}` ，所以WEI中最低的数量是`5000000000000000000`
4. 点击“transact”并在MetaMask确认交易

![Nominate a Collator](/images/staking/staking-precompile-4.png)

### 验证提名 {: #verify-nomination } 
如果您想要验证您的提名是否成功，您能够在Polkadot.js应用查看链状态。首先，[将Metamask地址加入Polkadot.js应用的地址簿](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/addresses)。如果您已经完成这个步骤，您可以略过此步骤并直接进入下个部分。

#### 将MetaMask地址加入地址簿 {: #add-metamask-address-to-address-book } 
1. 导向至Accounts -> Address Book
2. 点击“Add contact”
3. 加入您的Metamask地址
4. 提供一个账户的昵称

![Add to Address Book](/images/staking/staking-precompile-5.png)

#### 验证提名人状态 {: #verify-nominator-state } 
1. 为了验证您已成功提名，进入[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/chainstate)导向至Developer -> Chain State
2. 选取“parachainStaking” pallet
3. 选取“nominatorState”查询
4. 点击“Plus”按钮以获得结果并验证您的提名

![Verify Nomination](/images/staking/staking-precompile-6.png)

### 撤销一个提名 {: #revoking-a-nomination } 
如果您想撤销提名并拿回您的token，使用`revoke_nomination`并且输入提名时所提供的地址。您可以再次在Polkadot.js Apps检查您的提名人状态以确认。

![Revoke Nomination](/images/staking/staking-precompile-7.png)