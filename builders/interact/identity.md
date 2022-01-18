---
title: 管理身份
description: 学习如何在基于Moonbeam的网络上创建和清除身份，包括您的姓名和社交账号等个人信息
---

# 管理您的账户身份

![Managing your Account Identity](/images/builders/interact/identity/identity-banner.png)

## 概览 {: #introduction }

[Substrate](/learn/platform/technology/#substrate-framework)身份pallet是「开箱即用」的解决方案，能够新增个人信息至您的链上账户。个人信息可以包含的基础类别如真实姓名、显示名称、网站、推特用户名、Riot（现为Elemet）名称。您同样也可以利用自定区域新增其他相关信息。

此教程将会带您了解如何在Moonbase Alpha测试网上设置或清除一个身份（这也适用于Moonbeam和Moonriver网络）。

## 一般定义

您必须绑定一定数量的资金才能将您的信息储存至链上，而这些资金将会在身份最终清除后返回至您的账户。目前有两个不同种类的字段：默认和自定义。如果您使用了自定义字段，您将会需要根据您所使用的字段提交额外的押金。

- **默认字段包含** —— 真实姓名、显示名称、网站、推特用户名、Riot（现为Elemet）名称
- **自定义字段包含** —— 任何相关信息。举例而言，您可以包含您的Discord用户名

=== "Moonbeam"
    |      变量      |               定义               |                        值                        |
    |:--------------:|:--------------------------------:|:------------------------------------------------:|
    |    基础押金    |      用于设置身份的押金数量      | {{ networks.moonbeam.identity.basic_dep }} GLMR |
    |    字段押金    | 用于设置身份的每个字段的押金数量 | {{ networks.moonbeam.identity.field_dep }} GLMR |
    | 最大附加字段数 |  可储存于一个ID的最大附加字段数  |   {{ networks.moonbeam.identity.max_fields }}   |

=== "Moonriver"
    |      变量      |               定义               |                        值                        |
    |:--------------:|:--------------------------------:|:------------------------------------------------:|
    |    基础押金    |      用于设置身份的押金数量      | {{ networks.moonriver.identity.basic_dep }} MOVR |
    |    字段押金    | 用于设置身份的每个字段的押金数量 | {{ networks.moonriver.identity.field_dep }} MOVR |
    | 最大附加字段数 |  可储存于一个ID的最大附加字段数  |   {{ networks.moonriver.identity.max_fields }}   |

=== "Moonbase Alpha"
    |      变量      |               定义               |                       值                       |
    |:--------------:|:--------------------------------:|:----------------------------------------------:|
    |    基础押金    |      用于设置身份的押金数量      | {{ networks.moonbase.identity.basic_dep }} DEV |
    |    字段押金    | 用于设置身份的每个字段的押金数量 | {{ networks.moonbase.identity.field_dep }} DEV |
    | 最大附加字段数 |  可储存于一个ID的最大附加字段数  |  {{ networks.moonbase.identity.max_fields }}   |

## 查看先决条件 { : #checking-prerequisites }

您需要在PolkadotJS App浏览器上连接至[Moonbase Alpha测试网](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network)。此教程也适用于[Moonriver](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.moonriver.moonbeam.network)。 

同时，您也需要在PolkadotJS Apps创建或是导入一个账户。如果您尚未创建或导入账户，请跟随以下教程来[创建或导入一个H160账户](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account)。如果您使用的是Moonbase Alpha，请确保您的账户中有足够的DEV Token，如果在Moonriver网络则须具有足够的MOVR。关于DEV Token水龙头的相关信息，请访问Moonbase Alpha官方文档网站的[获得Token](/builders/get-started/moonbase/#get-tokens)板块。

## 开始使用

根据包含的信息，用户可以通过几个不同的方式使用PolkadotJS Apps来设置并清除身份。如果您希望仅使用默认字段来注册您的身份，您可以跟随[通过账户UI管理身份](#managing-an-identity-via-accounts)的教程操作。

如果您希望获得更定制化的使用体验，并想要在默认字段的基础上增加自定义字段，您可以跟随[通过外部参数UI管理身份](#managing-an-identity-via-extrinsics)的教程操作。

## 通过账户管理身份

### 设置身份

如果想开始使用账户UI设置一个身份，请导向至PolkadotJS Apps浏览器的[Accounts标签](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts)页面。

您应该已经有一个已连接网络的账户，所以您可以点击您的账户名称以确认实时的账户余额。在设置身份并传送交易之后，您提交的款项将会从您的可转账余额转移至您的储蓄账户。

![Starting account balances](/images/builders/interact/identity/identity-1.png)

您可以根据以下步骤设置您的身份：

1. 点击您想设置身份账户旁边的三个垂直点按钮

2. 在跳出的弹窗中选择**Set on-chain identity**

![Set on-chain identity](/images/builders/interact/identity/identity-2.png)

接着，将会跳出一个注册和设置身份的弹窗，您可以开始填写您的信息。您无需填写所有字段，可根据自身情况选择只填写其中一个或是全部。举例而言：

1. 设置您的显示名称
   
2. 点击电子邮箱一栏的**include field**按钮并且输入您的电子邮箱

3. 点击Twitter一栏的**include field**按钮并且输入您的Twitter用户名

4. 完成填写信息并确认提交金额后，点击**Set Identity**

![Set your identity](/images/builders/interact/identity/identity-3.png)

您将会需要签署本次交易。如果所有细节都已确认并无问题，您可以输入您的密码并点击Sign and Submit以签署和发送本次交易。

![Authorize transaction](/images/builders/interact/identity/identity-4.png)

您将在页面右上角看到状态通知的弹窗。当交易成功确认后，您可以再次点击您的账户名称，操作面板将会从右侧弹出。您的余额将会改变，同时您也可以看到您的新身份信息。

![Updated account balances](/images/builders/interact/identity/identity-5.png)

如果身份信息与您输入的一致，则恭喜您以成功设置身份！

当您清除您的身份，您储备账户中的Token将会被重新转回您的可转移余额中。如果您需要更改您的身份，您可以重新操作设置身份的流程。请注意，即使您只需要改变或是覆盖其中一个字段，您还是需要重新输入所有字段信息。您将无需额外支付款项，除非您使用自定义字段，您仍需要支付gas费。

### 清除身份

如果您想从PolkadotJS Apps界面的[Accounts标签](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts)中清除您的身份，您可以跟随以下步骤：

1. 点击您希望清除身份信息账户旁的三个垂直点按钮

2. 在跳出的弹窗中选择**Set on-chain identity**

![Set on-chain identity](/images/builders/interact/identity/identity-6.png)

接着，将跳出设置身份的弹窗，其中包含您曾经填写的信息。您需要点击**Clear Identity**。

![Clear identity](/images/builders/interact/identity/identity-7.png)

您将会需要签署本次交易。如果所有细节都已确认并无问题，您可以输入您的密码并点击Sign and Submit以签署和发送本次交易。

![Authorize transaction](/images/builders/interact/identity/identity-8.png)

您将在页面右上角看到状态通知的弹窗。当交易成功确认后，您可以再次点击您的账户名称，操作面板将会从右侧弹出。您可以看到储备余额已经被重新转移至您的可转移余额账户中，同时您也可以看到您的身份信息已被移除。

![Updated account balances](/images/builders/interact/identity/identity-9.png)

恭喜，您已经成功清除您的身份。如果您想要新增新的身份，您可以随时进行操作。

## 通过外部参数管理身份

### 设置身份

如果您想要使用外部参数UI注册一个身份，请导向PolkadotJS Apps的[Extrinsics页面](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics)。接着，您可以跟随以下步骤操作：

1. 选取您的账户

2. 从**submit the following extrinsic**的下拉表单中选取身份

3. 选取**setIdentity(info)**函数

4. 开始输入您的身份信息

    1. 选取数据格式。在此示例中，您可以使用**Raw**数据，但您仍可以选择以BlackTwo256、Sha256、Keccak256以及ShaThree256散列格式输入您的数据

    2. 以选定的格式输入数据

![Set your identity using the Extrincs UI](/images/builders/interact/identity/identity-10.png)

根据个人选择，如果您希望加入自定义字段，您可以跟随以下步骤操作：

1. 上滑页面并选择**Add item** 

2. 接着将会出现两个字段：第一个为字段名称，第二个为数值。输入字段名称

    1. 选取输入字段名称的数据格式，同样您也可以使用**Raw**数据

    2. 以选定的格式输入字段名称

3. 输入数值

    1. 选取输入数值的数据格式，同样您也可以使用**Raw**数据

    2. 以选定的格式输入数值

![Add custom fields](/images/builders/interact/identity/identity-11.png)

最后，如果您添加了所有身份信息，您可以下滑页面并点击**Submit Transaction**。

![Submit identity information](/images/builders/interact/identity/identity-12.png)

您将会需要签署本次交易。如果所有细节都已确认并无问题，您可以输入您的密码并点击**Sign and Submit**以签署和发送本次交易。

![Authorize transaction](/images/builders/interact/identity/identity-13.png)

您将在页面右上角看到状态通知的弹窗。当交易成功确认后，您已经成功设置了身份！如果您想要确认您的身份信息是否正确，您可以确认您的身份。

### 确认身份

如果您想重新确认您的身份信息，您可以导向至**开发者**标签并进入[Chain state](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/chainstate)页面。

![Navigate to Chain State](/images/builders/interact/identity/identity-14.png)

在**Chain State**的界面，请确认已选取**Storage**选项。接着您可以开始查询您的身份信息：

1. 将**selected state query**设置为**身份**

2. 选取**identityOf(AccountId)**函数

3. 选取您的账户

4. 点击**+**按钮获得您的身份信息

![Request identity information](/images/builders/interact/identity/identity-15.png)

恭喜，现在您已经成功设置一个身份！当您清除您的身份，您储备余额的Token将会被重新转回至您的可转移余额当中。如果您需要更改您的身份，您可以重新操作设置身份的流程。请注意，即使您只需要改变或是覆盖其中一个字段，您还是需要重新输入所有字段信息。您将无需额外支付款项，除非您使用自定义字段，您仍需要支付gas费。

### 清除身份

如果您想从PolkadotJS Apps界面的[Extrinsics标签](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics)中清除您的身份，您可以跟随以下步骤：

1. 在**using the selected account**下拉选单中选取您的账户

2. 在**submit the following extrinsic**下拉选单中选取身份

3. 选取**clearIdentity()**函数

4. 点击**Submit Transaction**

![Clear an identity using the Extrinsics UI](/images/builders/interact/identity/identity-16.png)

您将会需要签署本次交易。如果所有细节都已确认并无问题，您可以输入您的密码并点击**Sign and Submit**以签署和发送本次交易。

![Authorize transaction](/images/builders/interact/identity/identity-17.png)

您将在页面右上角看到状态通知的弹窗。

如果您想验证是否成功移除身份信息，您可以重新跟随[确认身份](#confirm-an-identity)部分的步骤。但在查看身份信息时，您将**不会**获得回复。这代表您账户并没有连接的身份信息。如果您检查您的余额，您将能见到您先前设置身份所传送的Token已经重新回到您的可转移账户中。就这样！恭喜您已经成功清除身份。
