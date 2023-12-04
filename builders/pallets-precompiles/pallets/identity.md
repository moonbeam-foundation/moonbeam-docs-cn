---
title: Identity Pallet
description: This guide covers the available functions in the Identity Pallet on Moonbeam, which are used to create and manage on-chain identities.
本教程涵盖了Moonbeam上Identity Pallet的可用函数，可用于创建和管理链上身份。
---

# Identity Pallet

## Introduction - 概览 {: #introduction }

The [Substrate](/learn/platform/technology/#substrate-framework){target=_blank} Identity Pallet is an out-of-the-box solution for adding personal information to your on-chain account. Personal information can include default fields such as your legal name, display name, website, Twitter handle, and Riot (now known as Element) name. You can also take advantage of custom fields to include any other relevant information.

[Substrate](/learn/platform/technology/#substrate-framework){target=_blank} Identity Pallet是一个可以直接使用的解决方案，用于添加个人信息至链上账户。个人信息包括法定姓名、对外显示的名称、网站、Twitter名称和Riot（现为Element）名称等默认字段。您也可以通过填写自定义字段包含任何其他相关信息。

The pallet also includes functionality to request judgments and verify on-chain identities from registrars, which are accounts appointed via governance to verify the identity information submitted and provide judgment on their findings for a fee.

此Pallet也包含请求判断和验证注册人链上身份的功能，这些注册人是通过治理指定的账户，用于验证提交的身份信息并根据调查结果提供判断，以收取一定费用。

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the Identity Pallet on Moonbeam. This guide assumes you are familiar with identity-related terminology; if not, please check out the [Managing your Account Identity](/tokens/manage/identity){target=_blank} page for more information.

本教程将提供关于Moonbeam上Identity Pallet内的可用pallet常量的extrinsics、存储函数和getter的概述。本教程假定您已熟悉身份相关的术语，若您尚未了解相关内容，请查看[管理您的账户身份](/tokens/manage/identity){target=_blank}页面获取更过信息。

## Identity Pallet Interface - Identity Pallet接口 {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

The Identity Pallet provides the following extrinsics (functions):

Identity Pallet提供以下extrinsics（函数）：

- **addRegistrar**(account) - adds an account as a registrar
- **addRegistrar**(account) - 增加一个账户，作为注册人
- **addSub**(sub, data) - adds an account as a sub-account of the caller
- **addSub**(sub, data) - 增加一个账户，作为调用者的子账户
- **cancelRequest**(regIndex) - cancels the caller's request for judgment from a given registrar
- **cancelRequest**(regIndex) - 取消调用者对给定注册人的判断请求
- **clearIdentity**() - clears the identity for the caller
- **clearIdentity**() - 清除调用者的身份
- **killIdentity**(target) - removes an account's identity and sub-accounts
- **killIdentity**(target) - 移除账户的身份和子账户
- **provideJudgement**(regIndex, target, judgement, identity) - provides judgment on an account's identity.  The caller must be the registrar account that corresponds to the `index`
- **provideJudgement**(regIndex, target, judgement, identity) - 为账户身份提供判断。调用者必须为对应`index`的注册人账户
- **quitSub**() - removes the caller as a sub identity account
- **quitSub**() - 将调用者从子身份账户移除
- **removeSub**(sub) - removes a sub-identity account for the caller
- **removeSub**(sub) - 为调用者移除从子身份账户
- **renameSub**(sub) - renames a sub-identity account for the caller
- **renameSub**(sub) - 为调用者重命名子身份账户
- **requestJudgement**(regIndex, maxFee) - requests judgment from a given registrar along with the maximum fee the caller is willing to pay
- **requestJudgement**(regIndex, maxFee) - 请求指定注册人的判断以及调用者愿意支付的最高费用
- **setAccountId**(index, new) - sets a new account for a registrar. The caller must be the registrar account that corresponds to the `index`
- **setAccountId**(index, new) - 为注册人设置新账户。此调用者必须是对应`index`的注册人账户
- **setFee**(index, fee) - sets the fee for a registar. The caller must be the registrar account that corresponds to the `index`
- **setFee**(index, fee) - 为注册人设置费用。此调用者必须是对应`index`的注册人账户
- **setFields**(index, fields) - sets the registrar's identity. The caller must be the registrar account that corresponds to the `index`
- **setFields**(index, fields) - 设置注册人的身份。此调用者必须是对应`index`的注册人账户
- **setIdentity**(info) - sets the identity for the caller
- **setIdentity**(info) - 为调用者设置身份
- **setSubs**(subs) - sets the sub-accounts for the caller
- **setSubs**(subs) - 为调用者设置子账户

### Storage Methods - 存储函数 {: #storage-methods }

The Identity Pallet includes the following read-only storage methods to obtain chain state data:

Identity Pallet包含以下只读函数，用于获取链上数据：

- **identityOf**(AccountId20) - returns identity information for all accounts or for a given account
- **identityOf**(AccountId20) - 为所有账户或给定账户返回身份信息
- **palletVersion**() - returns the current pallet version
- **palletVersion**() - 返回当前的Pallet版本
- **registrars**() - returns the set of registrars
- **registrars**() - 返回注册人集
- **subsOf**(AccountId20) - returns the sub identities for all accounts or for a given account
- **subsOf**(AccountId20) - 为所有账户或给定账户返回子身份
- **superOf**(AccountId20) - returns the super identity of all sub-accounts or for a given sub-account
- **superOf**(AccountId20) - 为所有账户或给定账户返回超级身份

### Pallet Constants - Pallet常量 {: #constants }

The Identity Pallet includes the following read-only functions to obtain pallet constants:

Identity Pallet包含以下只读函数，用于获取Pallet常量：

- **basicDeposit**() - returns the amount held on deposit for a registered identity
- **basicDeposit**() - 为注册身份返回持有的资金数量
- **fieldDeposit**() - returns the amount held on deposit per additional field for a registered identity
- **fieldDeposit**() - 为注册身份返回每附加字段的资金数量
- **maxAdditionalFields**() - returns the maximum number of fields that can be stored in an ID
- **maxAdditionalFields**() - 返回一个ID中可存储的最大字段数量
- **maxRegistrars**() - returns the maximum number of registrars allowed in the system
- **maxRegistrars**() - 返回系统中允许的最大注册人数量
- **maxSubAccounts**() - returns the maximum number of sub-accounts allowed per account
- **maxSubAccounts**() - 返回每个账户允许的最大子账户数量
- **subAccountDeposit**() - returns the amount held on deposit for a registered sub-account
- **subAccountDeposit**() - 返回注册子账户持有的资金数量
