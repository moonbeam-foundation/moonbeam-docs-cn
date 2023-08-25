---
title: 作者映射预编译
description: 通过此教程收集人将学习如何使用作者映射solidity接口将会话密钥映射至用于支付奖励的Moonbeam地址。
keywords: Solidity，以太坊，作者映射，收集人，moonbeam，预编译，合约，区块生产者
---

# 使用作者映射预编译交互

## 概览 {: #introduction }

Moonbeam上的作者映射预编译合约允许收集人候选人通过熟悉且易于使用的Solidity接口，将会话密钥映射至用于支付区块奖励的Moonbeam地址。这将使候选人使用Ledger或任何与Moonbeam兼容的以太坊钱包完成作者映射。但是，建议您在实体隔离的设备上生成您的密钥。更多信息请参考[收集人要求页面的账户要求部分](/node-operators/networks/collators/requirements/#account-requirements){target=_blank}。

要成为收集人候选人，您必须[运行一个收集人节点](/node-operators/networks/run-a-node/overview/){target=_blank}。在生成您的会话密钥并将其映射到您的账户之前，您也需要[加入一个候选人池](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}，提交一笔[保证金](#bonds)并完全同步您的节点。在映射会话密钥时需要支付一笔[额外的费用](#bonds)。

预编译位于以下地址：

=== "Moonbeam"
     ```
     {{networks.moonbeam.precompiles.author_mapping }}
     ```

=== "Moonriver"
     ```
     {{networks.moonriver.precompiles.author_mapping }}
     ```

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.author_mapping }}
     ```

--8<-- 'text/precompiles/security.md'

## 作者映射Solidity接口 {: #the-solidity-interface }

[`AuthorMappingInterface.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=_blank}是一个Solidity接口，允许开发者与预编译的方法交互。

- **removeKeys**() — 移除作者ID和会话密钥。替代已弃用的`clearAssociation` extrinsic
- **setKeys**(*bytes memory* keys) — 接受调用`author_rotateKeys`的结果，这是您的Nimbus和VRF密钥的串联公钥，并立刻设置作者ID和会话密钥。在密钥轮换或迁移后会非常有用。调用`setKeys`需要一笔[保证金](#mapping-bonds)。替代已弃用的`addAssociation`和`updateAssociation` extrinsics
- **nimbusIdOf**(*address* who) - 获取给定地址的Nimbus ID。如果给定地址不存在，返回`0`
- **addressOf**(*bytes32* nimbusId) - 获取与给定Nimbus ID关联的地址。如果Nimbus ID未知，则返回`0`
- **keysOf**(*bytes32* nimbusId) - 获取与给定的Nimbus ID关联的密钥。如果Nimbus ID未知，则返回空字节

## 需要的保证金 {: #bonds }

要跟随本教程操作，您将需要加入候选人池并将您的会话密钥映射到您的H160以太坊格式账户。执行这两个步骤需要两笔保证金。

加入候选人池的最低保证金设置如下：

=== "Moonbeam"
    ```
    {{ networks.moonbeam.staking.min_can_stk }} GLMR
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.staking.min_can_stk }} MOVR
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.staking.min_can_stk }} DEV
    ```

用您的账户映射您的会话密钥时会发送一笔保证金。此保证金由每个会话密钥注册时获得。保证金设置如下：

=== "Moonbeam"
    ```
    {{ networks.moonbeam.staking.collator_map_bond }} GLMR
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.staking.collator_map_bond }} MOVR
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.staking.collator_map_bond }} DEV
    ```

## 与Solidity接口交互 {: #interact-with-the-solidity-interface }

### 查看先决条件 {: #checking-prerequisites }

以下示例将在Moonbase Alpha上演示，但操作步骤也同样适用于Moonbeam和Moonriver。您需要准备以下内容：

 - 安装MetaMask并[连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - 拥有DEV Token的账户。您需要有足够的DEV来支付[候选人和映射的保证金](#bonds)加上发送交易和映射会话密钥到您账户的gas费用。要获取足够的DEV Token来遵循本教程操作，您可以通过[Moonbeam Discord服务器](https://discord.gg/PfpUATX){target=_blank}联系管理员获得。
 - 确保您正在[运行一个收集人节点](/node-operators/networks/run-a-node/overview/){target=_blank}且完全同步
 - 确保您已[加入候选人池](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}

如之前所述，您可以使用Ledger将其连接至MetaMask，详情请参考[Ledger](/tokens/connect/ledger/){target=_blank}教程将您的Ledger导入MetaMask。请注意，不建议您使用Ledger用于生产目的。更多信息请参考[收集人要求页面的账户要求部分](/node-operators/networks/collators/requirements/#account-requirements){target=_blank}。

### 生成会话密钥 {: #generate-session-keys }

--8<-- 'text/collators/generate-session-keys.md'

### Remix设置 {: #remix-set-up }

首先，获取[`AuthorMappingInterface.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=_blank}的副本并执行以下操作：

1. 点击**File explorer**标签
2. 将文件内容复制并粘贴至命名为`AuthorMappingInterface.sol`的[Remix文件](https://remix.ethereum.org/){target=_blank}

![Copying and Pasting the Author Mapping Interface into Remix](/images/builders/pallets-precompiles/precompiles/author-mapping/author-mapping-1.png)

### 编译合约 {: #compile-the-contract }

1. 点击**Compile**标签（从上至下第二个）
2. 编译接口，点击**Compile AuthorMappingInterface.sol**

![Compiling AuthorMappingInterface.sol](/images/builders/pallets-precompiles/precompiles/author-mapping/author-mapping-2.png)

### 访问合约 {: #access-the-contract }

1. 点击Remix中**Compile**正下方的**Deploy and Run**标签。请注意，您不是在此处部署合约，而是访问已经部署的预编译合约
2. 确保在**ENVIRONMENT**下拉菜单中选择**Injected Provider - Metamask**
3. 确保在**CONTRACT**下拉菜单中选择**AuthorMappingInterface.sol**。因为这是一个预编译合约，因此无需部署，相反，您需要在**At Address**字段中提供预编译的地址
4. 提供Moonbase Alpha的作者映射预编译地址：`{{networks.moonbase.precompiles.author_mapping}}`并点击**At Address**

![Provide the address](/images/builders/pallets-precompiles/precompiles/author-mapping/author-mapping-3.png)

作者映射预编译将出现在**Deployed Contracts**列表中。

### 映射会话密钥 {: #map-session-keys }

接下来是将您的会话密钥映射到您的H160账户（以太坊格式的地址）。确保您持有此账户的私钥，此账户将用于支付区块奖励。

要将您的会话密钥映射到您的账户，您需要先加入[候选人池](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}。当您成为候选人后，您需要发送一个映射extrinsic。请注意，每个作者ID注册时将绑定一笔保证金。

在开始之前，确保您已连接至您想要映射会话密钥的账户。此账户将用于接收区块奖励。

1. 展开**AUTHORMAPPING**合约
2. 展开**setKeys**方法
3. 输入您的会话密钥
4. 点击**transact**
5. 点击**Confirm**确认跳出的MetaMask交易

![Map your session keys](/images/builders/pallets-precompiles/precompiles/author-mapping/author-mapping-4.png)

要验证您的会话密钥是否映射成功，您可以使用`mappingWithDeposit`方法或[作者映射pallet](/node-operators/networks/collators/account-management/#author-mapping-interface){target=_blank}的`nimbusLookup`方法。详情您可以参考[收集人账户管理教程的查看映射部分](/node-operators/networks/collators/account-management/#check-the-mappings){target=_blank}。