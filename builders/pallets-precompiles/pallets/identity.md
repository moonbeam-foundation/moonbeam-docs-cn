---
title: Identity Pallet
description: 本教程涵盖了Moonbeam上Identity Pallet的可用函数，可用于创建和管理链上身份。
---

# Identity Pallet

## 概览 {: #introduction }

[Substrate](/learn/platform/technology/#substrate-framework){target=_blank} Identity Pallet是一个原装的可以直接使用的解决方案，它被用于添加个人信息至链上账户。个人信息包括法定姓名、对外显示的名称、网站、Twitter名称和Riot（现为Element）名称等默认字段。您也可以通过填写自定义字段来加入任何其他相关信息。

此Pallet也包含供注册人使用的请求判决与验证链上身份功能。注册人账户需通过治理指定，他们负责验证提交的身份信息并根据调查结果提供判决，来收取一定费用。

本教程将提供Moonbeam Identity Pallet内的extrinsics，存储函数和参数getter的概述。本教程假定您已熟悉与identity相关的术语，若您尚未了解相关内容，请查看[管理您的账户身份](/tokens/manage/identity){target=_blank}页面获取更多信息。

## Identity Pallet接口 {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

Identity Pallet提供以下extrinsics（函数）：

- **addRegistrar**(account) - 增加一个账户，作为注册人
- **addSub**(sub, data) - 增加一个账户，作为调用者的子账户
- **cancelRequest**(regIndex) - 取消调用者给指定注册人发送的判定请求
- **clearIdentity**() - 清除调用者的身份
- **killIdentity**(target) - 移除账户的身份和子账户
- **provideJudgement**(regIndex, target, judgement, identity) - 为账户身份提供判断。调用者必须为对应`index`的注册人账户
- **quitSub**() - 将调用者从子身份账户移除
- **removeSub**(sub) - 为调用者移除从子身份账户
- **renameSub**(sub) - 为调用者重命名子身份账户
- **requestJudgement**(regIndex, maxFee) - 请求指定注册人的判断以及调用者愿意支付的最高费用
- **setAccountId**(index, new) - 为注册人设置新账户。此调用者必须是对应`index`的注册人账户
- **setFee**(index, fee) - 为注册人设置费用。此调用者必须是对应`index`的注册人账户
- **setFields**(index, fields) - 设置注册人的身份。此调用者必须是对应`index`的注册人账户
- **setIdentity**(info) - 为调用者设置身份
- **setSubs**(subs) - 为调用者设置子账户

### 存储函数 {: #storage-methods }

Identity Pallet包含以下只读函数，用于获取链上数据：

- **identityOf**(AccountId20) - 为所有账户或给定账户返回身份信息
- **palletVersion**() - 返回当前的Pallet版本
- **registrars**() - 返回注册人集
- **subsOf**(AccountId20) - 为所有账户或给定账户返回子身份
- **superOf**(AccountId20) - 为所有账户或给定账户返回超级身份

### Pallet常量 {: #constants }

Identity Pallet包含以下只读函数，用于获取Pallet常量：

- **basicDeposit**() - 为注册身份返回持有的资金数量
- **fieldDeposit**() - 为注册身份返回每附加字段的资金数量
- **maxAdditionalFields**() - 返回一个ID中可存储的最大字段数量
- **maxRegistrars**() - 返回系统中允许的最大注册人数量
- **maxSubAccounts**() - 返回每个账户允许的最大子账户数量
- **subAccountDeposit**() - 返回注册子账户持有的资金数量
