---
title: 收集人账号管理
description: 学习如何管理您的收集人账户，包括生成会话密钥、映射author ID、设置身份以及创建代理账户。
---

# 收集人账户管理

![Collator Account Management Banner](/images/node-operators/networks/collators/account-management/account-management-banner.png)

## 概览 {: #introduction }

在基于Moonbeam的网络上运行收集人节点时，您需要注意一些账户管理活动。首先也是最重要的，您将需要为您的主服务器和备份用服务器创建[会话密钥](https://wiki.polkadot.network/docs/learn-keys#session-keys){target=_blank}，用于确定区块生产和签署区块。

另外，您还可以考虑一些其他的账户管理活动，例如设置链上身份或设置代理账户。

本教程将引导您如何管理您的收集人账户，包括创建和转换会话密钥、注册和更新会话密钥、设置身份以及创建代理账户。

## 生成会话密钥 {: #session-keys }

为了符合Substrate标准，Moonbeam收集人的会话密钥为[SR25519](https://wiki.polkadot.network/docs/learn-keys#what-is-sr25519-and-where-did-it-come-from){target=_blank}。本教程将向您展示如何创建/转换与收集人节点相关联的会话密钥。

首先，请确保您正在[运行收集人节点](/node-operators/networks/run-a-node/overview/){target=_blank}。开始运行收集人节点后，您的终端应出现类似以下日志：

![Collator Terminal Logs](/images/node-operators/networks/collators/account-management/account-1.png)

接下来，通过使用`author_rotateKeys`方法将RPC调用发送到HTTP端点来创建/转换会话密钥。当您调用 `author_rotateKeys` 时，结果是两个密钥的大小。回复将包含串联的作者ID（Nimbus 密钥）和VRF密钥。作者ID 用于签署区块并创建与您的H160帐户的关联，以便支付区块奖励。区块生产需要[VRF](https://wiki.polkadot.network/docs/learn-randomness#vrf){target=_blank}密钥。

举例而言，如果您的收集人HTTP端点位于端口`9933`，则JSON-RPC调用可能如下所示：

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

收集人节点应使用串联的新会话密钥的相应公钥进行回复。`0x`前缀后的前64位十六进制字符代表您的作者ID，最后64位十六进制字符是您的VRF会话密钥的公钥。在下一部分映射您的作者ID和设置会话密钥时，您将使用串联的公钥。

![Collator Terminal Logs RPC Rotate Keys](/images/node-operators/networks/collators/account-management/account-2.png)

确保您已记下串联的会话密钥公钥。您的每台服务器，包括主服务器和备份服务器，都应该拥有其独特的密钥。由于密钥永远不会离开您的服务器，因此您可以将其视为该服务器的唯一ID。

接下来，您将需要注册您的会话密钥并将author ID会话密钥映射到H160以太坊格式的地址（用于接收区块奖励）。

## 映射Author ID并设置会话密钥 {: #map-author-id-set-session-keys }

在author ID映射到您的账户时，系统将会发送一定数量的Token绑定到您的账户。这些Token由author ID注册获得。网络发送的Token数量设置如下所示：

 - Moonbeam -  {{ networks.moonbeam.staking.collator_map_bond }}枚GLMR
 - Moonriver - {{ networks.moonriver.staking.collator_map_bond }}枚MOVR
 - Moonbase Alpha - {{ networks.moonbase.staking.collator_map_bond }}枚DEV

`authorMapping`模块具有以下extrinsics编程：

 - **setKeys**(*address* keys) —— 接受调用`author_rotateKeys`的结果，这是您的Nimbus和VRF密钥的串联公钥，并立即设置作者ID和会话密钥。在密钥轮换或迁移后很有用。调用`setKeys` 需要[绑定代币]（#:~:text=Token数量设置如下）。替换弃用的`addAssociation`和`updateAssociation`函数
- **removeKeys**() - 删除作者 ID 和会话密钥。替换已弃用的“clearAssociation”extrinsic

以下函数**已弃用**，但仍存在向后兼容性：

 - **addAssociation**(*address* authorID) —— 将您的author ID映射到发送交易的H160账户，确认这是其私钥的真正持有者。这将需要一定的[绑定数量](#:~:text=The bond set is as follows)。此函数通过默认将`keys`设置为author ID来保持向后兼容性
 - **updateAssociation**(*address* oldAuthorID, *address* newAuthorID) —— 将旧的author ID映射到新的author ID，对私钥转换和迁移极为实用。这将自动执行`add`和`clear`两个关联函数，使得私钥转换无需第二次绑定。此函数通过默认将`newKeys`设置为author ID来保持向后兼容性
 - **clearAssociation**(*address* authorID) — 清除作者ID与发送交易的H160帐户的关联，该帐户需要是该作者ID的所有者。也退还押金

这个模块同时也新增以下RPC调用（链状态）：

- **mapping**(*address* optionalAuthorID) —— 将显示所有储存在链上的映射内容，或是根据您的输入显示相关内容

### 映射Extrinsic {: #mapping-extrinsic }

生成会话密钥后的下一步是注册会话密钥和映射author ID到H160账户（即以太坊格式的地址）。确保您拥有该账户的私钥，这将用于接收区块奖励。

如果您想要将您的author ID映射到您的账户，您需要成为[候选人池](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}中的一员。当您成为候选人后，您需要传送您的映射extrinsic。请注意，每一次注册author ID将会绑定Token。要执行操作，点击页面上方的**Developer**，在下拉菜单中选择**Extrinsics**选项，然后执行以下步骤：

 1. 选择您要映射author ID的关联帐户（用于签署交易）
 2. 选择**authorMapping** extrinsic
 3. 将方法设置为 **setKeys()**
 4. 输入密钥。就是上一节通过RPC调用`author_rotateKeys`得到的响应，就是你的author ID和VRF会话密钥的串联公钥
 5. 点击**Submit Transaction**

![Author ID Mapping to Account Extrinsic](/images/node-operators/networks/collators/account-management/account-3.png)

如果交易成功，您将在屏幕上看到确认通知。如果没有，请确认您是否已加入[候选人池](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}。

### 检查映射设定 {: #checking-the-mappings }

您也可以通过验证链上状态来确认目前的链上映射情况。要检查特定的作者ID，您可以使用串联公钥的前64位十六进制字符来获取作者ID。要验证作者ID是否正确，您可以运行以下命令，并将前64个字符传递到`params`数组中：

```
curl http://127.0.0.1:9933 -H "Content-Type:application/json;charset=utf-8" -d   '{
  "jsonrpc":"2.0",
  "id":1,
  "method":"author_hasKey",
  "params": ["72c7ca7ef07941a3caeb520806576b52cb085f7577cc12cd36c2d64dbf73757a", "nmbs"]
}'
```

如果正确，则响应应返回`"result": true`。

![Check Nimbus Key](/images/node-operators/networks/collators/account-management/account-4.png)

您也可以通过验证链上状态来确认目前的链上映射情况。要执行操作，点击页面上方的**Developer**，在下拉菜单中选择**Chain State**选项，然后执行以下步骤：

 1. 选择**authorMapping**作为状态查询

 2. 选择**mappingWithDeposit**函数

 3. 提供author ID (Nimbus ID)进行查询。您也可以通过关闭按钮以停止检索所有链上的映射情况

  4. 点击**+**按钮传送PRC调用

![Author ID Mapping Chain State](/images/node-operators/networks/collators/account-management/account-5.png)

您应该能够看到与提供的author ID相关联的H160帐户。如果未包含author ID，这将返回存储在链上的所有映射。

## 设置身份 {: #setting-an-identity }

设置链上身份将便于识别您的收集人节点身份。与显示您的帐户地址不同，这将显示您所选择的名称。

您有多种方式可以设置您的身份。您可以查看[管理您的账户身份](/tokens/manage/identity/){target=_blank}文档页面为您的收集人节点设置身份。

## 代理账户 {: #proxy-accounts }

代理帐户可以代表用户执行有限数量的操作。代理允许用户将主账户进行安全冷存储，同时使用代理代表主账户积极参与网络。您可以随时取消代理帐户的授权。您可以对您的代理设置一个延迟时段，为代理提供额外安全层。延迟时段将为您提供一定的时间来检查交易，并在必要时于执行前取消操作。

您可以参考[此文档页面](/tokens/manage/proxy-accounts/){target=_blank}设置代理账户。
