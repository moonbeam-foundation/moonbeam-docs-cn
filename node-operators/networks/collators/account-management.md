---
title: 账号管理
description: 学习如何管理您的收集人账户，包括创建和转换会话密钥、映射您的author ID、设置身份以及创建代理账户。
---

# 收集人账户管理

![Collator Account Management Banner](/images/node-operators/networks/collators/account-management/account-management-banner.png)

## 概览 {: #introduction }

在基于Moonbeam的网络上运行收集人节点时，您需要注意一些账户管理活动。首先也是最重要的，您将需要为您的主服务器和备份用服务器创建会话密钥，用于签署区块。随后，您将需要映射每个会话密钥（也称为author ID）到您的H160账户，用于接收区块奖励。

另外，您还可以考虑一些其他的账户管理活动，例如设置链上身份或设置代理账户。

本教程将引导您如何管理您的收集人账户，包括创建和转换会话密钥、映射您的author ID、设置身份以及创建代理账户。

## 会话密钥 {: #session-keys }

收集人将使用author ID来签署区块，它类似于[会话密钥](https://wiki.polkadot.network/docs/learn-keys#session-keys){target=_blank}。为了符合Substrate标准，Moonbeam收集人的会话密钥为[SR25519](https://wiki.polkadot.network/docs/learn-keys#what-is-sr25519-and-where-did-it-come-from){target=_blank}。本教程将向您展示如何创建/转换与收集人节点相关联的会话密钥。

首先，请确保您正在[运行收集人节点](/node-operators/networks/run-a-node/overview/){target=_blank}。开始运行收集人节点后，您的终端应出现类似以下日志：

![Collator Terminal Logs](/images/node-operators/networks/collators/account-management/account-1.png)

接下来，通过使用`author_rotateKeys`方法将RPC调用发送到HTTP端点来创建/转换会话密钥。举例而言，如果您的收集人HTTP端点位于端口`9933`，则JSON-RPC调用可能如下所示：

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

收集人节点应使用新的author ID（会话密钥）的相应公钥进行响应。

![Collator Terminal Logs RPC Rotate Keys](/images/node-operators/networks/collators/account-management/account-2.png)

请确保您已记下author ID的公钥。您的每台服务器，包括主服务器和备份服务器，都应该拥有其独特的密钥。由于密钥永远不会离开您的服务器，因此您可以将其视为该服务器的唯一ID。

接下来，author ID将被映射到H160以太坊式地址（用于接收区块奖励）。

## 映射Author ID到您的账户 {: #map-author-id-to-your-account }

生成author ID（会话密钥）后的下一步是将其映射到您的H160帐户（以太坊式地址）。该账户将用于接收区块奖励，请确保您拥有其私钥。

在author ID映射到您的账户时，系统将会发送一定数量的Token绑定到您的账户。这些Token由author ID注册获得。网络发送的绑定数量设置如下所示：

 - Moonbeam -  {{ networks.moonbeam.staking.collator_map_bond }}枚GLMR
 - Moonriver - {{ networks.moonriver.staking.collator_map_bond }}枚MOVR
 - Moonbase Alpha - {{ networks.moonbase.staking.collator_map_bond }}枚DEV 

`authorMapping`模块具有以下extrinsics编程：

 - **addAssociation**(*address* authorID) —— 将您的author ID映射到发送交易的H160账户，确认这是其私钥的真正持有者。这将需要一定的[绑定数量](#:~:text=绑定数量)
 - **clearAssociation**(*address* authorID) —— 将清除author ID和发送交易的H160账户之间的连接，需要由author ID的持有者进行操作。这将退还绑定数量
 - **updateAssociation**(*address* oldAuthorID, *address* newAuthorID) —— 将旧的author ID映射到新的author ID，对私钥转换和迁移极为实用。这将自动执行`add`和`clear`两个关联函数，使得私钥转换无需第二次绑定

这个模块同时也新增以下RPC调用（链状态）：

- **mapping**(*address* optionalAuthorID) —— 将显示所有储存在链上的映射内容，或是根据您的输入显示相关内容

### 映射Extrinsic {: #mapping-extrinsic }

如果您想要将您的author ID映射到您的账户，您需要成为[候选人池](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}中的一员。当您成功成为候选人，您将需要传送您的映射extrinsic。请注意，每一次注册author ID将会绑定Token。为此，请执行以下步骤：

 1. 进入**Developer**标签
 2. 点击**Extrinsics**
 3. 选取您想要映射author ID的目标账户（用于签署交易）
 4. 选择**authorMapping**
 5. 选择**addAssociation()**函数
 6. 输入author ID。在本示例中，可在前一个部分通过RPC调用`author_rotateKeys`获得
 7. 点击**Submit Transaction**

![Author ID Mapping to Account Extrinsic](/images/node-operators/networks/collators/account-management/account-3.png)

如果交易成功，您将在屏幕上看到确认通知。如果没有，请确认您是否已加入[候选人池](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}。

![Author ID Mapping to Account Extrinsic Successful](/images/node-operators/networks/collators/account-management/account-4.png)

### 检查映射设定 {: #checking-the-mappings } 

您也可以通过验证链上状态来确认目前的链上映射情况。为此，请执行以下步骤：

 1. 进入**Developer**标签
 2. 点击**Chain state**
 3. 选择**authorMapping**作为查询状态
 4. 选择**mappingWithDeposit**函数
 5. 提供author ID进行查询。您也可以通过关闭按钮以停止检索所有链上的映射情况
 6. 点击**+**按钮来传送RPC调用

![Author ID Mapping Chain State](/images/node-operators/networks/collators/account-management/account-5.png)

您应该能够看到与提供的author ID相关联的H160帐户。如果未包含author ID，这将返回存储在链上的所有映射。

## 设置身份 {: #setting-an-identity }

设置链上身份将便于识别您的收集人节点身份。与显示您的帐户地址不同，这将显示您所选择的名称。

您有多种方式可以设置您的身份。您可以查看[管理您的账户身份](/builders/interact/identity/){target=_blank}文档页面为您的收集人节点设置身份。

## 代理账户 {: #proxy-accounts }

代理帐户可以代表用户执行有限数量的操作。代理允许用户将主账户进行安全冷存储，同时使用代理代表主账户积极参与网络。您可以随时取消代理帐户的授权。您可以对您的代理设置一个延迟时段，为代理提供额外安全层。延迟时段将为您提供一定的时间来检查交易，并在必要时于执行前取消操作。

您可以参考[此文档页面](/builders/interact/proxy-accounts/){target=_blank}设置代理账户。