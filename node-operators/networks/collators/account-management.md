---
title: 收集人账号管理
description: 学习如何管理您的收集人账户，包括生成会话密钥、映射Nimbus ID、设置身份以及创建代理账户。
---

# 收集人账户管理

## 概览 {: #introduction }

在基于Moonbeam的网络上运行收集人节点时，您需要注意一些账户管理活动。首先也是最重要的，您将需要为您的主服务器和备份用服务器创建[会话密钥](https://wiki.polkadot.network/docs/learn-keys#session-keys){target=_blank}，用于确定区块生产和签署区块。

另外，您还可以考虑一些其他的账户管理活动，例如设置链上身份或设置代理账户。

本教程将引导您如何管理您的收集人账户，包括创建和转换会话密钥、注册和更新会话密钥、设置身份以及创建代理账户。

## 新增和更新会话密钥的流程 {: #process }

第一次新增会话密钥的流程与轮换会话密钥的流程相同。具体流程如下：

1. 使用`author_rotateKeys` RPC函数[生成会话密钥](#session-keys)。调用此函数将返回一个128个十六进制字符，其中包含Nimbus ID和VRF会话密钥的公钥
2. [加入候选人池](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}（如果已加入请忽略此步骤）
3. 使用[Author Mapping Pallet](#author-mapping-interface)的`setKeys(keys)` extrinsic[将会话密钥映射](#mapping-extrinsic)至您的候选人账户，这将接受整个128个十六进制字符作为值输入。当你第一次调用`setKeys`时，您将需要提交[映射保证金](#mapping-bonds)。如果您要轮换您的密钥并且先前已经提交了映射保证金，则不需要提交新的保证金

此流程的每个步骤将如下所示。

## 生成会话密钥 {: #session-keys }

--8<-- 'text/node-operators/collators/account-management/generate-session-keys.md'

## 管理会话密钥 {: #manage-session-keys }

一旦您已经创建或轮换您的会话密钥，您将能够使用Author Mapping Pallet中的extrinsics管理您的会话密钥。您也可以映射您的会话密钥，验证链上映射并移除会话密钥。

### 作者映射Pallet接口 {: #author-mapping-interface }

`authorMapping`模块具有以下extrinsics编程：

- **setKeys**(keys) —— 接受调用`author_rotateKeys`的结果，这是您的Nimbus和VRF密钥的串联公钥，并立即设置会话密钥。在密钥轮换或迁移后很有用。调用`setKeys` 需要[绑定代币](#mapping-bonds)。替换弃用的`addAssociation`和`updateAssociation`函数
- **removeKeys**() - 删除会话密钥。替换已弃用的`clearAssociation` extrinsic

这个模块同时也新增以下RPC调用（链状态）：

- **mappingWithDeposit**(NimbusPrimitivesNimbusCryptoPublic | string | Uint8Array) —— 将显示所有储存在链上的映射内容，或是根据您提供的Nimbus ID显示相关内容
- **nimbusLookup**(AccountId20) - 显示所有收集人或给定收集人地址的帐户ID到Nimbus ID的反向映射

### 映射会话密钥 {: #mapping-extrinsic }

有了新生成的会话密钥后，接下来您可以将您的会话密钥映射至H160账户（以太坊格式的地址）。确保您持有此账户的私钥，因为该账户将用于接收区块奖励。

要映射您的会话密钥至您的账户，您需要在[候选人池](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}中。当您成为候选人后，您需要发送映射extrinsic，这将需要您提交一笔映射保证金。

#### 映射保证金 {: #mapping-bonds }

映射保证金是按会话密钥注册的。映射到您帐户的保证金数量如下：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.staking.collator_map_bond }} GLMR
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.staking.collator_map_bond }} MOVR
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.staking.collator_map_bond }} DEV
    ```

#### 使用Polkadot.js Apps映射会话密钥 {: #use-polkadotjs-apps }

在本指南中，您将学习如何从Polkadot.js应用映射会话密钥。 要了解如何通过作者映射预编译合约创建映射，您可以参考[与作者映射预编译交互](/builders/pallets-precompiles/precompiles/author-mapping){target=_blank}页面。

从[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=_blank}(确保您已连接到正确的网络），点击页面上方的**Developer**，在下拉菜单中选择**Extrinsics**选项，然后执行以下步骤：

 1. 选择您要映射Nimbus ID的关联帐户（用于签署交易）
 2. 选择**authorMapping** extrinsic
 3. 将方法设置为 **setKeys()**
 4. 输入 **keys**。就是上一节通过RPC调用`author_rotateKeys`得到的响应，就是你的Nimbus ID和VRF会话密钥的串联公钥
 5. 点击**Submit Transaction**

![Author ID Mapping to Account Extrinsic](/images/node-operators/networks/collators/account-management/account-3.png)

!!! 注意事项
    如果您收到以下错误，您可能需要再次尝试轮换和映射您的密钥：`VRF PreDigest was not included in the digests (check rand key is in keystore)`。

如果交易成功，您将在屏幕上看到确认通知。如果没有，请确认您是否已加入[候选人池](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}。

### 检查映射设定 {: #checking-the-mappings }

您可以通过验证链状态来检查当前的链上映射。 您可以通过以下两种方式之一执行此操作：通过`mappingWithDeposit`方法或`nimbusLookup`方法。 这两种方法都可用于查询所有收集人或特定收集人的链上数据。

您可以检查特定收集人的当前链上映射，也可以检查存储在链上的所有映射。

### 使用带有存款方法的映射 {: #using-mapping-with-deposit }

要使用`mappingWithDeposit`方法检查特定收集人的映射，您需要获取Nimbus ID。 为此，您可以使用串联公钥的前64个十六进制字符来获取Nimbus ID。要验证Nimbus ID是否正确，您可以运行以下命令，并将前64个字符传递到`params`数组中：

```bash
curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d   '{
  "jsonrpc":"2.0",
  "id":1,
  "method":"author_hasKey",
  "params": ["72c7ca7ef07941a3caeb520806576b52cb085f7577cc12cd36c2d64dbf73757a", "nmbs"]
}'
```

如果正确，则响应应返回`"result": true`。

![Check Nimbus Key](/images/node-operators/networks/collators/account-management/account-4.png)

从[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=_blank}，点击页面上方的**Developer**，在下拉菜单中选择**Chain State**选项，然后执行以下步骤：

 1. 选择**authorMapping**作为状态查询
 2. 选择**mappingWithDeposit**函数
 3. 提供Nimbus ID 进行查询。您也可以通过禁用滑块以检索所有链上的映射情况
 4. 点击**+**按钮传送PRC调用

![Nimbus ID Mapping Chain State](/images/node-operators/networks/collators/account-management/account-5.png)

您应该能够看到与提供的Nimbus ID相关联的H160帐户。如果未包含Nimbus ID，这将返回存储在链上的所有映射。

### 使用Nimbus查找方法 {: #using-nimbus-lookup }

要使用`nimbusLookup`方法检查特定收集人的映射，您将需要收集人的地址。 如果您不向该方法传递参数，则可以检索所有链上映射。

从[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=_blank}，点击页面上方的**Developer**，在下拉菜单中选择**Chain State**选项，然后执行以下步骤：

 1. 选择**authorMapping**作为状态查询
 2. 选择**nimbusLookup**函数
 3. 提供收集人地址进行查询。或者，您也可以禁用滑块以检索所有映射
 4. 点击**+**按钮传送PRC调用

![Nimbus ID Mapping Chain State](/images/node-operators/networks/collators/account-management/account-6.png)

您应该能够看到与所提供的H160帐户关联的Nimbus ID。 如果没有提供账户，这将返回存储在链上的所有映射。

### 移除会话密钥 {: #removing-session-keys }

在移除会话密钥之前，您需要确保已停止参与收集活动并离开候选池。首先，您需要发起离开候选池的请求，等待退出期生效后，再执行该请求。关于分步教程，请参阅Moonbeam收集人活动页面的[停止参与收集活动](/node-operators/networks/collators/activities/#stop-colating){target=_blank}部分。

当您离开候选人池后，您可以移除您的会话密钥。然后，映射保证金将返还至您的账户。

从[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=_blank}，点击页面上方的**Developer**，在下拉菜单中选择**Extrinsics**选项，然后执行以下步骤：

1. 选择账户
2. 选择**authorMapping** pallet和**removeKeys** extrinsic
3. 点击**Submit Transaction**

![Remove session keys on Polkadot.js Apps](/images/node-operators/networks/collators/account-management/account-7.png)

交易进行后，映射保证金将返还给您。确保密钥已移除，您可以通过[检查映射](#checking-the-mappings)部分进行查看。

## 设置身份 {: #setting-an-identity }

设置链上身份将便于识别您的收集人节点身份。与显示您的帐户地址不同，这将显示您所选择的名称。

您有多种方式可以设置您的身份。您可以查看[管理您的账户身份](/tokens/manage/identity/){target=_blank}文档页面为您的收集人节点设置身份。

## 代理账户 {: #proxy-accounts }

代理帐户可以代表用户执行有限数量的操作。代理允许用户将主账户进行安全冷存储，同时使用代理代表主账户积极参与网络。您可以随时取消代理帐户的授权。您可以对您的代理设置一个延迟时段，为代理提供额外安全层。延迟时段将为您提供一定的时间来检查交易，并在必要时于执行前取消操作。

您可以参考[此文档页面](/tokens/manage/proxy-accounts/){target=_blank}设置代理账户。
