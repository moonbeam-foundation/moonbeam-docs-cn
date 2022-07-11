---
title: 与Moonbeam民主预编译交互
description: 如何使用以太坊API与Moonbeam Solidity 民主预编译接口进行交互。
keywords: 标准合约, 以太坊, moonbeam, 预编译, 智能合约, 民主
---

# 与民主预编译交互

![Staking Moonbeam Banner](/images/builders/build/canonical-contracts/precompiles/democracy/democracy-banner.png)

## 概览 {: #introduction }

作为波卡（Polkadot）的平行链，得益于[Substrate民主pallet](https://docs.rs/pallet-democracy/latest/pallet_democracy/){target=_blank}，Moonbeam拥有原生的链上治理功能。民主pallet使用Rust语言编码，无法直接从Moonbeam的以太坊方面访问。然而，民主预编译让您能够直接通过solidity接口直接访问Substrate民主pallet的治理功能。除此之外，这将能够大幅度改进终端用户的操作体验。举例而言，Token持有者将能够直接使用MetaMask进行公投，无需将账户汇入Polkadot.js App后使用复杂的界面进行操作。

民主预编译位于以下地址：

=== "Moonbeam"
     ```
     {{networks.moonbeam.precompiles.democracy}}
     ```

=== "Moonriver"
     ```
     {{networks.moonriver.precompiles.democracy}}
     ```

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.democracy}}
     ```

## 民主预编译Solidity接口 {: #the-democracy-solidity-interface }

[DemocracyInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}是一个能够用于Solidity合约与民主pallet交互的接口。预编译的精妙之处在于您无需学习Substrate API，就可以使用熟悉的以太坊界面与质押功能交互。

接口包含以下函数：

 - **public_prop_count**() —— 获取过去和现在提案总数的只读函数
 - **deposit_of**(*uint256* prop_index) —— 获取提案中锁定Token总数量的只读函数
 - **lowest_unbaked**() —— 获取当前公投中索引排序最低的公投的只读函数。详细来说，Baked Referendum为已结束（或是已通过和已制定执行日期）的公投。Unbaked Referendum则为正在进行中的公投。
 - **propose**(*bytes32* proposal_hash, *uint256* value) —— 通过提交哈希和锁定的Token数量提交提案
 - **second**(*uint256* prop_index, *uint256* seconds_upper_bound) —— 通过提供提案索引编码和大于或等于现有附议此提案的数字以附议一个提案（必须计算权重）。不需要数量，因为附议这个动作需要具有与原先提案者锁定相同的数量。

 - **standard_vote**(*uint256* ref_index, *bool* aye, *uint256* vote_amount, *uint256* conviction) ）—— 通过提供提案索引编号、投票趋向（`true`为执行此提案，`false`为保持现状）、锁定的Token数量以及“信念值”，来进行投票。“信念值”为`0`与`6`之间的一个数字，`0`代表没有锁定时间，而`6`代表最大锁定时间。
 - **remove_vote**(*uint256* ref_index)  —— 此函数用于在逾期的民主锁定之前于特定公投上移除投票。请注意，移除投票不能在提案投票进行中时撤销或是取消
 - **delegate**(*address* representative, *uint256* candidateCount, *uint256* amount) —— 通过提供需要被委托的特定账户信息、用于所有委托投票的Token锁定之间函数以及用于委托的Token数量的“信念值”系数，以委托其投票权力至其他账户
 - **un_delegate**() —— 为委托人用于解除投票权力的函数。在原先委托指令中的Token锁定时间参数被解除后，Token将会解锁并能够领取。
 - **unlock**(*address* target) —— 解锁逾期锁定的Token。在使用**unlock**之前，您必须为各个提案所锁定的Token调用**remove_vote**，不然这些Token将会保持锁定。这个函数能够被任何账户调用
 - **note_preimage**(*bytes* encoded_proposal) —— 为即将到来的提案注册一个原像（Preimage）。此函数不需要提案处于调度队列中，但需要押金以进行操作，押金将会在提案生效后返还。
 - **note_imminent_preimage**(*bytes* encoded_proposal) —— 为即将到来的提案注册一个原像（Preimage）。此函数需要提案处在调度队列中，同时不需要任何押金。当调用成功，例如：原像（Preimage）尚未被上传且与近期的提案相匹配，不支付任何费用。

此接口同样包含目前尚未被支持但有可能在将来支持的函数：

- **ongoing_referendum_info**(*uint256* ref_index) —— 返回特定进行中公投的以元组形式表达的只读函数，内容包含以下：
     1. 公投结束区块（*uint256*）
     2. 提案哈希（*bytes32*）
     3. [the biasing mechanism](https://wiki.polkadot.network/docs/learn-governance#super-majority-approve){target=_blank}0为SuperMajorityApprove，1为SuperMajorityAgainst，2为SimpleMajority (*uint256*)
     4. 执行延迟时间（*uint256*）
     5. 总同意票数，包含Token锁定时间参数（*uint256*）
     6. 总反对票数，包含Token锁定时间参数（*uint256*）
     7. 当前投票结果，不包含Token锁定时间参数（*uint256*）

 - **finished_referendum_info**(*uint256* ref_index) —— 返回公投是否通过以及结束区块信息的只读函数

## 查看先决条件 {: #checking-prerequisites } 

以下为在Moonbase Alpha网络的操作演示，然而，您能够在Moonbeam和Moonriver采用类似的步骤。在进入操作接口之前，您可以先熟悉在Moonbeam上[如何提案](/tokens/governance/proposals/){target=_blank}和[如何投票](/tokens/governance/voting/){target=_blank}。除此之外，您还需要：

 - 安装MetaMask并[连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - 具有拥有一定数量DEV的账户。 
 --8<-- 'text/faucet/faucet-list-item.md'

## 设置Remix {: #remix-set-up }

1. 复制[DemocracyInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}

2. 将档案内容复制并贴上至[Remix](https://remix.ethereum.org/){target=_blank}，并将其命名为DemocracyInterface.sol

![Copying and Pasting the Democracy Interface into Remix](/images/builders/build/canonical-contracts/precompiles/democracy/democracy-1.png)

## 编译合约 {: #compile-the-contract } 

1. 点击位于由上至下第二个的Compile标签

2. 编译[DemocracyInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}

![Compiling DemocracyInteface.sol](/images/builders/build/canonical-contracts/precompiles/democracy/democracy-2.png)

## 访问合约 {: #access-the-contract } 

1. 在Remix点击位于Compile标签下方的Deploy and Run标签。**注意**：您并不是在此部署合约，您是在访问一个已经部署的预编译合约

2. 确认在Environment下拉菜单中的**Injected Web3**已被选取

3. 确保**DemocracyInterface.sol**已在**Contract**下拉菜单中被选去。由于此为预编译合约，并不需要进行部署，您需要的是在**At Address**中提供预编译合约的地址

4. 为Moonbase Alpha提供民主预编译的地址：`{{networks.moonbase.precompiles.democracy}}` 并点击**At Address**

5. 此民主预编译将会出现在**Deployed Contracts**列表中

![Provide the address](/images/builders/build/canonical-contracts/precompiles/democracy/democracy-3.png)

## 提交提案 {: #submit-a-proposal } 

### 获得哈希和带编码的提案 {: #submit-the-preimage-hash } 

如果您拥有提案的哈希，您可以通过[DemocracyInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}提交提案。如果您拥有带编码的提案，您同样可以通过预编译合约提交原像。为获得提案哈希和带编码的提案，根据以下步骤在[Polkadot.JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank}进行操作：

 1. 选取一个账户（任何账户皆可，因为您不需要提交任何交易）

 2. 选取您希望交互的pallet以及可调度的函数（或是动作）以进行提案。您选取的动作将会决定您随后的操作步骤。在此例子中，此为`system`pallet和`remark`函数

 3. 输入remark函数的内容，确保其为独特的。重复的提案如“Hello World！”将不会被接受

 4. 复制原像哈希，这代表着此提案。您将会在通过民主预编译提交提案时使用此哈希

  5. 点击**Submit preimage**按钮，但请不要在下一页签署和确认此交易

![Get the proposal hash](/images/builders/build/canonical-contracts/precompiles/democracy/democracy-4.png)

在下个页面，根据以下步骤进行操作：

 1. 点击三角形图像以显示字节状态下带编码的提案

  2. 复制带编码的提案——您将在随后步骤中使用**note_preimage**时用到它

![Get the encoded proposal](/images/builders/build/canonical-contracts/precompiles/democracy/democracy-5.png)

!!! 注意事项
     请**不要**在此签署和提交交易。您将会在随后步骤中通过**note_preimage**提交此信息。

### 调用Propose函数 {: #call-the-propose-function } 

1. 展开民主预编译合约以查看可用函数

2. 寻找**propose**函数并点击按钮展开区块

3. 输入提案哈希

4. 输入以Wei为单位的Token数值来绑定。最低绑定数量为{{ networks.moonbase.democracy.min_deposit }} DEV，{{ networks.moonriver.democracy.min_deposit }} MOVR或是{{ networks.moonbeam.democracy.min_deposit }} GLMR。以此例而言为4 DEV或是已经输入的`4000000000000000000` 

5. 点击**transact**并在MetaMask确认交易

![Call the propose function](/images/builders/build/canonical-contracts/precompiles/democracy/democracy-6.png)

### 提交原像（Preimage） {: #submit-the-preimage } 

在此步骤，您将会使用您在[Polkadot.JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank}获得的带编码的提案，并通过民主预编译后中的**note_preimage**函数提交。尽管其名称，即原像（Preimage）并不需要在提案之前提交。然而，提交原像（Preimage）仍然需要在提案能够执行前进行提交。请跟随以下步骤通过**note_preimage**提交原像（Preimage）：

1. 展开民主预编译合约以查看可用函数

2. 找到**note_preimage**函数并点击按钮以展开区块

3. 复制您在先前获得的带编码的提案。请注意，提案编码与原像（Preimage）哈希不同。请确认您输入的是正确的数值

4. 点击**transact**并在MetaMask确认交易

![Submit the preimage](/images/builders/build/canonical-contracts/precompiles/democracy/democracy-7.png)

在您交易确认后您可以回到[Polkadot.JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank}的民主页面中确认您的提案是否在提案列表当中。

## 附议提案 {: #second-a-proposal } 

附议提案将能够使其进入公投阶段，但需要绑定与先前提案者相同的Token数量。被附议的提案转移至公投需要一定时间，在Moonbase Alpha为{{ networks.moonbase.democracy.launch_period.days}}日，在Moonriver为{{ networks.moonbase.democracy.launch_period.days}}日，在Moonbeam为{{ networks.moonbeam.democracy.launch_period.days}}日。

### 获得提案索引编码 {: #get-the-proposal-index } 

首先，您将需要获得您希望支持的提案的相关信息。当您在先前的步骤中提交提案，其将会有至少一个提案处于列表当中。您可以跟随以下步骤在[Polkadot.JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank}中获得提案的索引编码：

1. 导向至**Governance**标签

2. 点击**Democracy**

3. 寻找**Proposals**区块并点击三角形图示查看提案的更多细节

4. 记录提案号码，此为您需要的首个参数

5. 记录已附议的数字。如果并没有任何支持，此区块将会保持空白

![Get the proposal information](/images/builders/build/canonical-contracts/precompiles/democracy/democracy-8.png)

### 调用Second函数 {: #call-the-second-function } 

现在，您可以回到Remix以通过民主预编译附议提案，请跟随以下步骤进行操作：

1. 如其尚未展开，展开民主预编译合约以查看可用函数

2. 寻找**second**函数并点击按钮以展开区块

3. 输入提案编码以附议

4. 虽然您要支持的提案编码已经记录如上，此时仍然需要参数上线。为避免出现gas预计错误，您需要输入明显大于附议数量的数字，在此例中输入的数字为`10` 

5. 点击**transact**并在MetaMask确认此交易

恭喜您已成功！如需查看您支持的提案，您可以返回[Polkadot.JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank}并查看您的账户是否出现在支持列表当中

![Second via the precompile](/images/builders/build/canonical-contracts/precompiles/democracy/democracy-9.png)

!!! 注意事项
    提案编码与公投编码不同。当提案进入公投状态，其将会获得新的公投索引编码。

## 在公投中进行投票 {: #vote-on-a-referendum } 

获得附议的提案转移至公投状态需要一定时间，在Moonbase Alpha为{{ networks.moonbase.democracy.launch_period.days}}日，在Moonriver为{{ networks.moonbase.democracy.launch_period.days}}，在Moonbeam为{{ networks.moonbeam.democracy.launch_period.days}}。如果在Moonbase Alpha中没有正在进行中的公投，您可能需要等待启用阶段以度过您支持提案的转移时间，方能进入公投阶段。

### 获得公投编码 {: #get-the-referendum-index } 

首先，如果您希望进行投票，您需要获得公投的编码。记住，提案编码与公投编码两者不同。您可以跟随以下步骤在[Polkadot.JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank}上获得公投编码：

1. 导向至**Governance**标签

2. 点击**Democracy**

3. 查看**Referenda**区块，并点击三角形图示以查看更多关于公投的信息。如果并没有看见三角形图示，这代表仅仅有提案哈希，提案的原像（Preimage）并没有被提交

4. 记录公投编码

![Get the referendum index](/images/builders/build/canonical-contracts/precompiles/democracy/democracy-10.png)

### 使用标准投票函数 {: #call-the-standard-vote-function } 

现在，您可以准备返回至Remix以通过民主预编译在公投进行投票，请跟随以下步骤进行操作：

1. 展开民主预编译合约以查看可用函数

2. 寻找**standard_vote**函数并点击按钮以查看区块

3. 输入公投编码以进行投票

4. 将此字段留空表示否定或输入1表示赞成。在公投的背景下，`Nay`是保持现状不变的投票，`Aye`是通过公投提议

5. 输入以Wei表示的Token数量，避免输入您的全部余额，因为您仍然需要支付交易费用

6. 输入位于0-6之间的Token锁定时间参数，这代表您希望锁定用以投票的Token的时间，0代表无锁定时间，6代表最大锁定时间。关于更多锁定时间的信息，请查看[如何投票](/tokens/governance/voting/){target=_blank}教程。

7. 点击**transact**并在MetaMask确认此交易

![Call the vote function](/images/builders/build/canonical-contracts/precompiles/democracy/democracy-11.png)

恭喜，您已完成在民主预编译教程中的全部步骤。除此之外，仍有数个函数被记录与[DemocracyInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}当中，如果您对于那些函数或是民主预编译有任何问题，欢迎至我们官方[*Discord*](https://discord.gg/moonbeam){target=_blank}询问。
