---
title: 收集人
description: 通过此教程学习运行节点后在Moonbeam网络上成为收集人
---

# 在Moonbeam上运行收集人节点

![Collator Moonbeam Banner](/images/fullnode/collator-banner.png)

## 概览

收集人在网络上维护其所参与的平行链。他们运行（所在平行链及中继链的）完整节点，并为中继链验证人创建状态转移证明。

Moonbase Alpha v6版本发布后，用户不仅可以创建完整节点。也可以调用`collate`功能，并作为收集人参与生态系统的运行。

本教程将介绍如何创建自己的收集人节点。收集人节点是完整节点的延伸。

## 技术要求

收集人必须满足以下技术要求：

 - 必须运行带有验证选项的完整节点。可根据[此教程](/node-operators/networks/full-node/)选择收集人的特定代码段
 - 启动完整节点的telemetry服务器。具体操作步骤请见[此教程](/node-operators/networks/telemetry/)

## 账户与质押要求

和波卡（Polkadot）验证人相似，收集人也需要创建账户（本示例使用的是H160账户），并拥有提名质押量（DEV代币）才能够参与验证。目前收集人插槽数量有限，但未来可能会有所增加。

收集人需要有至少{{ networks.moonbase.collator_min_stake }}DEV才有资格成为候选收集人。只有提名质押量最高的{{ networks.moonbase.collator_slots }}个收集人才会进入活跃收集人群体。

!!! 注意事项
    目前，通过助记词创建或从PolkadotJS导入账户，再将账户导入到MetaMask等以太坊钱包时，会产生不同公共地址。这是因为PolkadotJS使用的是BIP39格式，而以太坊则使用的是BIP32或BIP44格式。

## PolkadotJS账户

每个收集人都有一个与收集活动相关的账户。该账户用于识别收集人作为区块生产者的身份，并从区块奖励中发送相关款项。

目前，创建[PolkadotJS](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts)账户有两种方法：

 - 从[MetaMask](/integrations/wallets/metamask/)或[MathWallet](/integrations/wallets/mathwallet/)等外部钱包或服务中导入现有的（或创建新的）H160账户
 - 使用[PolkadotJS](/integrations/wallets/polkadotjs/)创建新的H160账户/integrations/wallets/polkadotjs/)

将H160账户导入到PolkadotJS后，就可以在“Accounts”标签下看到该账户。请确保手上已有公共地址（`PUBLIC_KEY`），我们在设置[部署完整节点](/node-operators/networks/full-node/)的收集选项时需要用到它。

![Account in PolkadotJS](/images/fullnode/collator-polkadotjs1.png)

## 成为候选收集人

节点开始运行并同步网络后，在[PolkadotJS](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts)通过以下步骤成为候选收集人：

 1. 进入“Developers”标签，点击“Extrinsics”
 2. 选择您用于参与收集活动的账户
 3. 确认您的收集人账户已充值至少{{ networks.moonbase.collator_min_stake }}DEV代币，并有多余金额用于支付交易费
 4. 在“submit the following extrinsics”菜单中选择`parachainStaking`模块
 5. 打开下拉菜单，在质押相关的所有外部参数中，选择`joinCandidates()`函数
 6. 将绑定金额设置到至少{{ networks.moonbase.collator_min_stake }}（即成为候选收集人所需最低数量）。这里仅考虑收集人本身的绑定数量，其他提名质押量不计入
 7. 提交交易。根据向导指引使用创建账户时的密码进行交易签名

![Join Collators pool PolkadotJS](/images/fullnode/collator-polkadotjs2.png)

!!! 注意事项
    函数名称和最低绑定金额要求可能会在未来发布新版本时有所调整。

如上所述，只有提名质押量最高的{{ networks.moonbase.collator_slots }}个收集人才可以进入活跃收集人群体。

## 停止参与收集活动

与Polkadot的`chill()`函数相似，按照前述相同步骤进行操作，便可离开候选收集人池，但在第5步时需要选择`leaveCandidates()`函数。


## 相关时长

下表列出了收集相关活动所需时长：

|           活动           |      | 轮次 |      | 市场 |
| :----------------------: | :--: | :--: | :--: | :--: |
|  加入/离开候选收集人池   |      |  2   |      |  4   |
|      新增/移除提名       |      |  1   |      |  2   |
| 奖励支付（在本轮结束后） |      |  2   |      |  4   |

!!! 注意事项 
    上表所列值可能会在未来发布新版本时有所调整。