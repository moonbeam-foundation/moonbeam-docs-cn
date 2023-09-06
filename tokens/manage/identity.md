---
title: 管理身份
description: 学习如何在基于Moonbeam的网络上创建和管理链上身份，其中包括个人信息（例如：姓名和社交媒体名称）。
---

# 管理您的账户身份

## 概览 {: #introduction }

[Substrate](/learn/platform/technology/#substrate-framework){target=_blank}身份pallet是「开箱即用」的解决方案，能够新增个人信息至您的链上账户。个人信息可以包含的基础类别如真实姓名、显示名称、网站、推特用户名、Riot（现为Elemet）名称。您同样也可以利用自定区域新增其他相关信息。

一旦您的身份信息上链，您就可以请求注册服务商验证您的身份。注册服务商将执行适当的尽职调查以验证提交的身份信息，并根据他们的调查结果在链上提供他们的判断，并且您的帐户旁边会出现一个绿色的复选标记。

此教程将会带您了解如何在Moonbase Alpha测试网上设置或清除一个身份（这也适用于Moonbeam和Moonriver网络）。

## 一般定义 {: #general-definitions }

您必须绑定一定数量的资金才能将您的信息储存至链上，而这些资金将会在身份最终清除后返回至您的账户。目前有两个不同种类的字段：默认和自定义。如果您使用了自定义字段，您将会需要根据您所使用的字段提交额外的押金。

- **默认字段包含** —— 真实姓名、显示名称、网站、推特用户名、Riot（现为Element）名称

- **自定义字段包含** —— 任何相关信息。举例而言，您可以包含您的Discord用户名

=== "Moonbeam"
    |      变量      |               定义               |                       值                        |
    |:--------------:|:--------------------------------:|:-----------------------------------------------:|
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

## 查看先决条件 {: #checking-prerequisites }

使用本指南将需要以下几个先决条件：

- 您需要在PolkadotJS App浏览器上连接至[Moonbase Alpha测试网](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network){target=_blank}。此教程也适用于[Moonbeam](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network){target=_blank}和[Moonriver](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbeam.network){target=_blank}
- 同时，您也需要在PolkadotJS Apps创建或是导入一个账户。如果您尚未创建或导入账户，请跟随以下教程来[创建或导入一个H160账户](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank}
- 请确认账户中有足够资金。
 --8<-- 'text/faucet/faucet-list-item.md'

## 开始使用 {: #get-started }

根据包含的信息，用户可以通过几个不同的方式使用PolkadotJS Apps来设置并清除身份。如果您希望仅使用默认字段来注册您的身份，您可以跟随[通过账户UI管理身份](#managing-an-identity-via-accounts)的教程操作。

如果您希望获得更定制化的使用体验，并想要在默认字段的基础上增加自定义字段，您可以跟随[通过ExtrinsicUI管理身份](#managing-an-identity-via-extrinsics)的教程操作。

!!! 注意事项
    请注意，建议使用Polkadot.js Apps上的**Accounts**界面来管理您的身份，因为它提供了一个易于使用的界面，强制执行字符限制。 如果您使用 **Extrinsics** 用户界面，请注意您在每个字段（即姓名、电子邮件等）中的输入必须不超过 32 个字符，否则，您的信息将被截断。

## 通过账户管理身份 {: #manage-via-accounts }

### 设置身份 {: #set-identity-accounts }

如果想开始使用账户UI设置一个身份，请导向至PolkadotJS Apps浏览器的[Accounts标签](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/accounts){target=_blank}页面。

您应该已经有一个已连接网络的账户，所以您可以点击您的账户名称以确认实时的账户余额。在设置身份并传送交易之后，您提交的款项将会从您的可转账余额转移至您的储蓄账户。

![Starting account balances](/images/tokens/manage/identity/identity-1.png)

您可以根据以下步骤设置您的身份：

1. 点击您想设置身份账户旁边的三个垂直点按钮
2. 在跳出的弹窗中选择**Set on-chain identity**

![Set on-chain identity](/images/tokens/manage/identity/identity-2.png)

接着，将会跳出一个注册和设置身份的弹窗，您可以开始填写您的信息。您无需填写所有字段，可根据自身情况选择只填写其中一个或是全部。举例而言：

1. 设置您的显示名称
2. 点击电子邮箱一栏的**include field**按钮并且输入您的电子邮箱
3. 点击Twitter一栏的**include field**按钮并且输入您的Twitter用户名
4. 完成填写信息并确认提交金额后，点击**Set Identity**

![Set your identity](/images/tokens/manage/identity/identity-3.png)

您将会需要签署本次交易。如果所有细节都已确认并无问题，您可以输入您的密码并点击Sign and Submit以签署和发送本次交易。

您将在页面右上角看到状态通知的弹窗。当交易成功确认后，您可以再次点击您的账户名称，操作面板将会从右侧弹出。您的余额将会改变，同时您也可以看到您的新身份信息。

![Updated account balances](/images/tokens/manage/identity/identity-4.png)

如果身份信息与您输入的一致，则恭喜您以成功设置身份！

当您清除您的身份，您储备账户中的Token将会被重新转回您的可转移余额中。如果您需要更改您的身份，您可以重新操作设置身份的流程。请注意，即使您只需要改变或是覆盖其中一个字段，您还是需要重新输入所有字段信息。您将无需额外支付款项，除非您使用自定义字段，您仍需要支付gas费。

### 清除身份 {: #clear-identity-accounts }

如果您想从PolkadotJS Apps界面的[Accounts标签](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/accounts){target=_blank}中清除您的身份，您可以跟随以下步骤：

1. 点击您希望清除身份信息账户旁的三个垂直点按钮
2. 在跳出的弹窗中选择**Set on-chain identity**

![Set on-chain identity](/images/tokens/manage/identity/identity-5.png)

接着，将跳出设置身份的弹窗，其中包含您曾经填写的信息。您需要点击**Clear Identity**。

![Clear identity](/images/tokens/manage/identity/identity-6.png)

您将会需要签署本次交易。如果所有细节都已确认并无问题，您可以输入您的密码并点击**Sign and Submit**以签署和发送本次交易。

您将在页面右上角看到状态通知的弹窗。当交易成功确认后，您可以再次点击您的账户名称，操作面板将会从右侧弹出。您可以看到储备余额已经被重新转移至您的可转移余额账户中，同时您也可以看到您的身份信息已被移除。

恭喜，您已经成功清除您的身份。如果您想要新增新的身份，您可以随时进行操作。

## 通过Extrinsic管理身份 {: #manage-via-extrinsics }

### 设置身份 {: #set-identity-extrinsics }

如果您想要使用Extrinsic UI注册一个身份，请导向PolkadotJS Apps的[Extrinsics页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}。接着，您可以跟随以下步骤操作：

1. 选取您的账户
2. 从**submit the following extrinsic**的下拉菜单中选取身份
3. 选取**setIdentity(info)**函数
4. 开始输入您的身份信息
    1. 选取数据格式。在此示例中，您可以使用**Raw**数据，但您仍可以选择以BlackTwo256、Sha256、Keccak256以及ShaThree256散列格式输入您的数据
    2. 以选定的格式输入数据

![Set your identity using the Extrinsic UI](/images/tokens/manage/identity/identity-7.png)

根据个人选择，如果您希望加入自定义字段，您可以跟随以下步骤操作：

1. 上滑页面并选择**Add item** 
2. 接着将会出现两个字段：第一个为字段名称，第二个为数值。输入字段名称
    1. 选取输入字段名称的数据格式，同样您也可以使用**Raw**数据
    2. 以选定的格式输入字段名称
3. 输入数值
    1. 选取输入数值的数据格式，同样您也可以使用**Raw**数据
    2. 以选定的格式输入数值

![Add custom fields](/images/tokens/manage/identity/identity-8.png)

最后，如果您添加了所有身份信息，您可以下滑页面并点击**Submit Transaction**。

![Submit identity information](/images/tokens/manage/identity/identity-9.png)

您将会需要签署本次交易。如果所有细节都已确认并无问题，您可以输入您的密码并点击**Sign and Submit**以签署和发送本次交易。

您将在页面右上角看到状态通知的弹窗。当交易成功确认后，您已经成功设置了身份！如果您想要确认您的身份信息是否正确，您可以确认您的身份。

### 确认身份 {: #confirm-identity-extrinsics }

如果您想重新确认您的身份信息，您可以导向至**Developer**标签并进入[Chain state](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/chainstate){target=_blank}页面。

在**Chain State**的界面，请确认已选取**Storage**选项。接着您可以开始查询您的身份信息：

1. 将**selected state query**设置为**identity**
2. 选取**identityOf(AccountId)**函数
3. 选取您的账户
4. 点击**+**按钮获得您的身份信息

![Request identity information](/images/tokens/manage/identity/identity-10.png)

恭喜，现在您已经成功设置一个身份！当您清除您的身份，您储备余额的Token将会被重新转回至您的可转移余额当中。如果您需要更改您的身份，您可以重新操作设置身份的流程。请注意，即使您只需要改变或是覆盖其中一个字段，您还是需要重新输入所有字段信息。您将无需额外支付款项，除非您使用自定义字段，您仍需要支付gas费。

### 清除身份 {: #clear-identity-extrinsics }

如果您想从PolkadotJS Apps界面的[Extrinsics标签](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}中清除您的身份，您可以跟随以下步骤：

1. 在**using the selected account**下拉菜单中选取您的账户
2. 在**submit the following extrinsic**下拉菜单中选取**identity**
3. 选取**clearIdentity()**函数
4. 点击**Submit Transaction**

![Clear an identity using the Extrinsics UI](/images/tokens/manage/identity/identity-11.png)

您将会需要签署本次交易。如果所有细节都已确认并无问题，您可以输入您的密码并点击**Sign and Submit**以签署和发送本次交易。

您将在页面右上角看到状态通知的弹窗。

如果您想验证是否成功移除身份信息，您可以重新跟随[确认身份](#confirm-identity-extrinsics)部分的步骤。但在查看身份信息时，您将获得**none**的回复。这代表您账户并没有连接的身份信息。如果您检查您的余额，您将能见到您先前设置身份所传送的Token已经重新回到您的可转移账户中。就这样！恭喜您已经成功清除身份。

## 身份判定 {: #identity-judgement }

提交您的身份信息后，您可以请求注册服务商验证您的身份。注册商的任务是验证提交的身份信息，并可以为其服务设定费用。当您请求身份判定时，您需要指定要验证您的信息的注册服务商以及您愿意为提供判定而支付的最高费用。仅当所选注册服务商收取的费用低于您指定的最高费用时，才会处理该请求，否则交易将失败。费用将被锁定，直到注册服务商完成判定过程，然后才会将费用转移给注册服务商。 注册服务商费用是在您最初创建身份时支付的押金之外的费用。

注册服务商申请人是通过链上民主任命的。如果指定的注册服务商做出错误判定或被证明不可信，可以通过民主方式将其撤职。

注册服务商将执行适当的尽职调查以验证提交的身份信息，并根据他们的调查结果提供判定并分配最多七个信任级别：

- **Unknown（未知）** - 尚未做出判定。这是默认值
- **Fee Paid（已付费）** - 表示用户已请求判定并且判定正在进行中
- **Reasonable（合理）** - 信息看起来合理，但未使用合法身份证件进行深入检查
- **Known Good（已知良好）** - 信息正确且是基于对合法身份文件的核查
- **Out of Date（过时）** - 信息曾经是良好的，但现在已经过时了 
- **Low Quality（低质量）** - 信息质量低或不精确，但可以根据需要进行更新
- **Erroneous（有误）** - 信息有误，可能表明存在恶意。此状态无法修改，只有在删除整个身份后才能被删除

### 当前注册服务商 {: #current-registrars }

在请求身份判定时，您需要提供您想要完成请求的注册服务商的索引。

目前的注册服务商如下：

=== "Moonbeam"
    |                                                              注册服务商                                                               |                               运营商                               |                    地址                    | 索引（Index） |
    |:-------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------:|:------------------------------------------:|:-------------:|
    |        [Registrar #0](https://forum.moonbeam.foundation/t/referendum-73-status-passed-identity-registrar-0/208){target=_blank}        | [Moonbeam Foundation](https://moonbeam.foundation/){target=_blank} | 0xbE6E642b25Fa7925AFA1600C48Ab9aA3461DC7f1 |       0       |
    | [Registrar #1](https://forum.moonbeam.foundation/t/referendum-82-status-passed-new-registrar-proposal-registrar-1/319){target=_blank} |         [Chevdor](https://www.chevdor.com/){target=_blank}         | 0xeaB597B91b66d9C3EA5E3a39e22C524c287d61a5 |       1       |

=== "Moonriver"
    |                                                               注册服务商                                                               |                               运营商                               |                    地址                    | 索引（Index） |
    |:--------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------:|:------------------------------------------:|:-------------:|
    |         [Registrar #0](https://forum.moonbeam.foundation/t/proposal-32-status-voting-identity-registrar-0/187){target=_blank}          | [Moonbeam Foundation](https://moonbeam.foundation/){target=_blank} | 0x031590D13434CC554f7257A89B2E0B10d67CCCBa |       0       |
    | [Registrar #1](https://forum.moonbeam.foundation/t/referendum-125-status-passed-new-registrar-proposal-registrar-1/303){target=_blank} |         [Chevdor](https://www.chevdor.com/){target=_blank}         | 0x2d18250E01312A155E81381F938B8bA8bb4d97B3 |       1       |

=== "Moonbase Alpha"
    |                                     注册服务商                                      |                       运营商                       |                    地址                    | 索引（Index） |
    |:-----------------------------------------------------------------------------------:|:--------------------------------------------------:|:------------------------------------------:|:-------------:|
    | [Registrar #1](https://www.chevdor.com/post/2020/07/14/reg-updates/){target=_blank} | [Chevdor](https://www.chevdor.com/){target=_blank} | 0x4aD549e07E96BaD335A8b99C8fd32e95EE538904 |       1       |


您想获得当前注册服务商的完整列表，包括每个注册服务商收取的费用，可以前往[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network){target=_blank}，选择**Developer**选项卡，从下拉菜单中选择 **Chain State**，然后执行以下步骤：

1. 选择**identity** pallet
2. 选择**registrars** extrinsic
3. 点击**+**按钮

![View registrar list](/images/tokens/manage/identity/identity-12.png)

### 请求身份判定 {: #request-judgement }

请求身份判定，在**Extrinsics**页面，您可以进行以下操作：

1. 从**using the selected account**下拉菜单选取您的账户
2. 在**submit the following extrinsic**下拉菜单中选取**identity**
3. 选取**requestJudgement()**函数
4. 输入您要查看并对您的身份信息提供判定的注册服务商的索引
5. 输入您愿意支付的最高费用（以Wei为单位）。这必须高于注册服务商设置的费用，否则交易将失败
6. 点击**Submit Transaction**

![Request identity judgement](/images/tokens/manage/identity/identity-13.png)

一旦交易通过，费用将从您的可用余额中扣除并锁定，直到判定完成。

判定完成并验证成功后，您的账户旁边会出现一个绿色的复选标记。如果成功，您的身份将被分配到以下三个信任级别之一：low quality（低质量）、reasonable（合理）或known good（已知良好）。在**账户**页面，您可以点击您的账户名查看您的身份信息和您的身份判定结果。

![Identity verified](/images/tokens/manage/identity/identity-14.png)

### 取消身份判定请求 {: #cancel-judgement-request }

如果注册服务商没有完成您的判定，您可以取消请求并收回锁定的费用。为此，请从**Extrinsics**页面执行以下步骤：

1. 在**using the selected account**下拉菜单中选取您的账户
2. 在**submit the following extrinsic**下拉菜单中选取**identity**
3. 选取**cancelRequest()**函数
4. 点击**Submit Transaction**

![Cancel judgement request](/images/tokens/manage/identity/identity-15.png)

然后系统会提示您签署并发送交易。一旦通过，您锁定的资金将退还给您。

