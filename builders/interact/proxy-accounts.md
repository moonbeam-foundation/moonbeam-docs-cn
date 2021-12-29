---
title: 代理账户
description: 学习如何在基于Moonbeam的网络设置代理账户
---

# 设置代理账户

![Setting up a Proxy Account](/images/builders/interact/proxy-accounts/proxies-banner.png)

## 概览 {: #introduction }

代理帐户可以代表用户执行有限数量的操作，并起到保护底层帐户的作用。这允许用户将其主账户进行安全冷存储，同时使代理能够主动执行功能并利用主账户中的Token权重参与网络。

代理账户可以执行特定Substrate功能，如author映射、质押、余额等。这允许您授权您信任的账户执行收集人或委托人的功能。代理也同样能保证质押账户在冷存储中的安全性。

本教程将引导您如何在Moonbase Alpha测试网上创建用于余额转账的代理账户以及如何执行代理交易。

## 查看先决条件

在操作本教程之前，您需要准备：

- 打开[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/explorer)并已连接至Moonbase Alpha
- 在Moonbase Alpha上创建或拥有2个账户
- 至少有一个账户拥有`DEV` Token。您可以通过Moonbase Alpha的[水龙头](/builders/get-started/moonbase/#get-tokens/)获得用于测试的DEV Token

如果您想要把您的账户导入Polkadot.js Apps，请参考[使用Polkadot.js Apps与Moonbeam交互](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account)的教程。

## 一般定义

设置代理账户时，代理绑定的Token将会从您的可用余额转移至您的预留余额。绑定为必要步骤，因为添加代理需要链上存储空间。从账户中移除代理后，绑定的Token将退还到您的可用余额中。

保证金根据保证金基础和保证金系数计算所得：

- **保证金基础** —— 为拥有代理列表帐户预留金额
- **保证金系数** —— 为主账户拥有的每个代理预留的额外金额

保证金计算公式：`deposit base + deposit factor * number of proxies`

=== "Moonriver"
    |    变量    |                       值                        |
    |:--------------:|:--------------------------------------------------:|
    |  保证金基数  |  {{ networks.moonriver.proxy.deposit_base }}枚MOVR  |
    | 保证金系数 | {{ networks.moonriver.proxy.deposit_factor }}枚MOVR |
    |  代理上限   | {{ networks.moonriver.proxy.max_proxies }}个代理 |

=== "Moonbase Alpha"
    |    变量    |                       值                        |
    |:--------------:|:--------------------------------------------------:|
    |  保证金基数  |   {{ networks.moonbase.proxy.deposit_base }}枚DEV   |
    | 保证金系数 |  {{ networks.moonbase.proxy.deposit_factor }}枚DEV  |
    |  代理上限   |  {{ networks.moonbase.proxy.max_proxies }}个代理 |

## 代理类型

创建代理账户时，您必须选择一种代理类型来定义代理的使用方式，可用选项如下：

- **`AuthorMapping`** —— 允许收集人将服务从一台服务器迁移至另一台服务器
- **`CancelProxy`** —— 允许代理账户拒绝和移除任何已公布的代理调用
- **`Staking`** —— 允许代理账户执行质押相关交易，例如收集人或委托人功能，包括`authorMapping()`
- **`Governance`** —— 允许代理账户执行治理相关交易，例如投票或民主提案
- **`NonTransfer`** —— 允许代理账户提交除余额转账以外的任何交易类型
- **`Balances`** —— 允许代理账户仅处理发送资金相关交易
- **`Any`** —— 允许代理账户使用由代理pallet支持的任何函数

在本教程中，您将使用余额代理类型设置代理账户。由于此代理类型能够代表主账户花费资金，因此您需谨慎操作，只对您信任的账户提供访问权限。代理将有权转移主账户中的所有资金，如若不授权，代理可能转移所有主账户的资金。另外，请确保根据需求移除代理。

## 创建代理账户

在Polkadot.js Apps，您可以在**Extrinsics**页面或**Accounts**页面创建代理账户。然而，如果您要创建延时代理，您将需要在**Extrinsics**页面进行操作。时间延迟通过指定基于多个区块的延迟时段为代理提供额外安全层。延迟期结束前，代理账户无法执行交易。这使主账户能够在该时间段审查代理的待处理交易（可能存在恶意操作的交易），在必要时于执行前取消操作。

想要创建代理账户，进入**Developer**标签，在下拉菜单中选择**Extrinsics**。然后执行以下步骤：

1. 选择主账户

2. 在**submit the following extrinsic**下拉菜单中选择**proxy**

3. 选择**addProxy**函数

4. 为代理选择**delegate**账户

5. 在**proxyType**下拉菜单中选择**Balances**

6. 若需要，您也可以使用指定数量的区块设置时间延迟，为主帐户增加额外的安全层以查看待处理的交易

7. 点击**Submit Transaction** 

![Creating a Proxy Account](/images/builders/interact/proxy-accounts/proxies-1.png)

随后，将会跳出弹窗要求您授权和签署交易。点击**Sign and Submit**创建代理关系。

![Submit Transaction to Create a Proxy Account](/images/builders/interact/proxy-accounts/proxies-2.png)

交易成功提交后，您将收到交易确认的通知。

如前文所述，您也可以从**Accounts**创建代理账户。进入**Accounts**页面，点击主账户旁边的三个竖点，选择**Add proxy**。

![Add Proxy](/images/builders/interact/proxy-accounts/proxies-3.png)

!!! 注意事项
    如果帐户中已有代理，显示的选项将会是**Manage proxies**，而不是显示**Add proxy**。

随后，将会跳出弹窗，您将能够输入所需信息（如主账户/被代理账户、代理账户、代理类型等）以创建代理账户。

![Add Proxy from Accounts Page](/images/builders/interact/proxy-accounts/proxies-4.png)

在下一部分，您将学习如何验证您的代理账户是否已成功设置。

## 验证您的代理账户

您可以通过**Accounts**页面或**Chain state**页面验证您的代理账户是否已成功设置。

在**Chain state**页面验证您的代理账户，您需执行以下步骤：

1. 点击**Developer**标签

2. 在下拉菜单中选择**Chain state**

3. 在**selected state query**下拉菜单中选择**proxy**

4. 选择**proxies**函数

5. 选择您的主账户/被代理账户

6. 点击**+**按钮发送查询请求

![Verify your Proxy Accounts](/images/builders/interact/proxy-accounts/proxies-5.png)

随后将在页面出现结果，显示所有代理的信息，包括委托/代理地址、代理类型、延迟期（若有设置）以及为所有代理绑定的总绑定数量（以wei为单位）。

如前所述，您也可以通过**Accounts**页面验证您的代理账户。进入**Accounts**页面，主账户旁边应出现代理图标。将鼠标移至该图标，点击**Proxy overview**查看您的代理。

![Proxy Overview Button](/images/builders/interact/proxy-accounts/proxies-6.png)

随后将跳出弹窗，您可以查看所有代理账户的信息。

![Proxy Overview Pop-up](/images/builders/interact/proxy-accounts/proxies-7.png)

## 执行代理交易

完成上述操作后，您已拥有一个代理账户并验证该账户已成功设置，现在您可以使用代理账户代表您的主账户执行交易。

首先进入**Extrinsics**页面，随后执行以下操作：

1. 在**using the select account**下拉菜单中选择代理账户提交交易

2. 在**submit the following extrinsic**下拉菜单中选择**proxy**

3. 选择**proxy**函数

4. 在**real**下拉菜单中选择主账户

5. 选择**balances**函数

6. 选择**transfer**函数

7. 在**dest**字段输入资金接收地址

8. 在**value**字段输入资金数量（以wei为单位）。例如，您将发送2枚DEV token，您需输入`2000000000000000000`（若以wei为单位）

9. 点击**Submit Transaction**

![Execute a Proxy Transaction](/images/builders/interact/proxy-accounts/proxies-8.png)

随后，将会跳出弹窗要求您授权和签署交易。输入代理账户的密码后点击**Sign and Submit**。

交易成功提交后，您将收到交易确认的通知。如果您进入**Accounts**页面，您将看到您主账户的余额已减少。您再查看您的接收账户的余额，您将看到余额已增加。

这样就可以了！这意味着您已成功使用代理账户代表您的主账户执行交易！

## 移除代理账户

与创建代理账户相似，您可以在**Extrinsics**页面或**Accounts**页面移除代理账户。无论您在哪个页面操作，您都可以选择移除单个代理帐户或与您的主帐户关联的所有代理。

在**Extrinsics**页面移除代理账户，您需要执行以下步骤：

1. 在**using the selected account**下拉菜单选择您的主账户

2. 选择**proxy**

3. 选择**removeProxy**以移除单个代理账户或**removeProxies**以移除所有关联代理

4. 如果移除单个代理账户，在**delegate**字段输入要移除的代理账户

5. 选择**proxyType**函数，本示例中应选择**Balances**

6. 若需要，在区块数量中选择延迟时段

7. 点击**Submit Transaction**

![Remove a Proxy Account](/images/builders/interact/proxy-accounts/proxies-9.png)

随后，将会跳出弹窗要求您授权和签署交易。可以选择从主账户或代理账户签署和发送交易，但为了移除代理，交易必须从主账户发送。输入您的密码并点击**Sign and Submit**。

您可以遵循[验证您的代理账户](#verifying-your-proxy-account)部分的操作步骤，查看您的代理是否已被移除。

如前所示，您也可以在**Accounts**页面移除代理账户。进入**Accounts**页面，点击主账户旁边的三个竖点，选择**Manage Proxies**。

![Manage Proxies](/images/builders/interact/proxy-accounts/proxies-10.png)

随后将跳出弹窗，您可以查看所有代理账户的信息。您可以点击代理账户旁边的**X**按钮移除单个代理账户。代理将从列表中移除，随后点击**Submit**。接下来，输入您的密码提交交易。您也可以点击**Clear all**移除所有的代理，随后系统将自动提示您输入密码和提交交易。

![Remove a Proxy Account from the Accounts Page](/images/builders/interact/proxy-accounts/proxies-11.png)

交易成功提交后，您可以查看您当前的代理。如果您移除了所有代理，您会看到代理图标不再显示在主帐户旁边。

这样就可以了！您已成功学会如何创建代理账户、查看所有与主账户相关联的代理账户、执行代理交易以及移除代理账户！