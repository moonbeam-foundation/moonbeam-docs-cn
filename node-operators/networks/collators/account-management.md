---
title: 收集人账号管理
description: 学习如何管理您的收集人账户，包括生成会话密钥、映射Nimbus ID、设置身份以及创建代理账户。
---

# 收集人账户管理

![Collator Account Management Banner](/images/node-operators/networks/collators/account-management/account-management-banner.png)

## 概览 {: #introduction }

在基于Moonbeam的网络上运行收集人节点时，您需要注意一些账户管理活动。首先也是最重要的，您将需要为您的主服务器和备份用服务器创建[会话密钥](https://wiki.polkadot.network/docs/learn-keys#session-keys){target=_blank}，用于确定区块生产和签署区块。

另外，您还可以考虑一些其他的账户管理活动，例如设置链上身份或设置代理账户。

本教程将引导您如何管理您的收集人账户，包括创建和转换会话密钥、注册和更新会话密钥、设置身份以及创建代理账户。

## 生成会话密钥 {: #session-keys }

--8<-- 'text/collators/generate-session-keys.md'

## 需要的保证金 {: #mapping-bonds }

在Nimbus ID映射到您的账户时，系统将会发送一定数量的Token绑定到您的账户。这些Token由Nimbus ID注册获得。网络发送的Token数量设置如下所示：

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

## 作者映射Pallet接口 {: #author-mapping-interface }

`authorMapping`模块具有以下extrinsics编程：

 - **setKeys**(keys) —— 接受调用`author_rotateKeys`的结果，这是您的Nimbus和VRF密钥的串联公钥，并立即设置作者ID和会话密钥。在密钥轮换或迁移后很有用。调用`setKeys` 需要[绑定代币](#需要的保证金--mapping-bonds)。替换弃用的`addAssociation`和`updateAssociation`函数
- **removeKeys**() - 删除作者 ID 和会话密钥。替换已弃用的`clearAssociation` extrinsic

以下函数**已弃用**，但仍存在向后兼容性：

 - **addAssociation**(nimbusID) —— 将您的Nimbus ID映射到发送交易的H160账户，确认这是其私钥的真正持有者。这将需要一定的[绑定数量](#需要的保证金--mapping-bonds)。此函数通过默认将`keys`设置为Nimbus ID来保持向后兼容性
 - **updateAssociation**(oldNimbusID, newNimbusID) —— 将旧的Nimbus ID映射到新的Nimbus ID，对私钥转换和迁移极为实用。这将自动执行`add`和`clear`两个关联函数，使得私钥转换无需第二次绑定。此函数通过默认将`newKeys`设置为Nimbus ID来保持向后兼容性
 - **clearAssociation**(nimbusID) — 清除作者ID与发送交易的H160帐户的关联，该帐户需要是该作者ID的所有者。也退还押金

这个模块同时也新增以下RPC调用（链状态）：

- **mappingWithDeposit**(NimbusPrimitivesNimbusCryptoPublic | string | Uint8Array) —— 将显示所有储存在链上的映射内容，或是根据您的输入显示相关内容

### 映射Extrinsic {: #mapping-extrinsic }

生成会话密钥后的下一步是注册会话密钥和映射Nimbus ID到H160账户（即以太坊格式的地址）。确保您拥有该账户的私钥，这将用于接收区块奖励。

如果您想要将您的Nimbus ID映射到您的账户，您需要成为[候选人池](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}中的一员。当您成为候选人后，您需要传送您的映射extrinsic。请注意，每一次注册Nimbus ID将会绑定Token。要执行操作，点击页面上方的**Developer**，在下拉菜单中选择**Extrinsics**选项，然后执行以下步骤：

 1. 选择您要映射Nimbus ID的关联帐户（用于签署交易）
 2. 选择**authorMapping** extrinsic
 3. 将方法设置为 **setKeys()**
 4. 输入 **keys**。就是上一节通过RPC调用`author_rotateKeys`得到的响应，就是你的Nimbus ID和VRF会话密钥的串联公钥
 5. 点击**Submit Transaction**

![Author ID Mapping to Account Extrinsic](/images/node-operators/networks/collators/account-management/account-3.png)

如果交易成功，您将在屏幕上看到确认通知。如果没有，请确认您是否已加入[候选人池](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}。

如果您收到以下错误，您可能需要再次尝试轮换和映射您的密钥：`VRF PreDigest was not included in the digests (check rand key is in keystore)`。

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

 3. 提供Nimbus ID 进行查询。您也可以通过关闭按钮以停止检索所有链上的映射情况

  4. 点击**+**按钮传送PRC调用

![Author ID Mapping Chain State](/images/node-operators/networks/collators/account-management/account-5.png)

您应该能够看到与提供的Nimbus ID相关联的H160帐户。如果未包含Nimbus ID，这将返回存储在链上的所有映射。

## 设置身份 {: #setting-an-identity }

设置链上身份将便于识别您的收集人节点身份。与显示您的帐户地址不同，这将显示您所选择的名称。

您有多种方式可以设置您的身份。您可以查看[管理您的账户身份](/tokens/manage/identity/){target=_blank}文档页面为您的收集人节点设置身份。

## 代理账户 {: #proxy-accounts }

代理帐户可以代表用户执行有限数量的操作。代理允许用户将主账户进行安全冷存储，同时使用代理代表主账户积极参与网络。您可以随时取消代理帐户的授权。您可以对您的代理设置一个延迟时段，为代理提供额外安全层。延迟时段将为您提供一定的时间来检查交易，并在必要时于执行前取消操作。

您可以参考[此文档页面](/tokens/manage/proxy-accounts/){target=_blank}设置代理账户。
