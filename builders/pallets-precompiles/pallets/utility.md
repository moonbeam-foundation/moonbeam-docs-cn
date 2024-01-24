---
title: Utility Pallet
description: 学习Moonbeam上Utility Pallet的可用extrinsics以及如何使用Polkadot.js Apps和Polkadot.js API与其交互。
keywords: utility, batch, substrate, pallet, moonbeam, polkadot
---

# Utility Pallet

## 概览 {: #introduction }

通过Substrate的Utility Pallet，Moonbeam上的用户可以通过2个可用批量extrinsics将多个调用包含在单个交易中，并使用衍生账户发送调用。

本教程将提供Utility Pallet的概述和示例，关于其中可用的pallet常量的extrinsic和getter。

## 衍生账户 {: #derivative-accounts }

衍生账户是使用索引从另一个账户衍生出来的账户。这使衍生账户能够派遣交易并使用原账户支付交易费用。由于此账户的私钥是未知的，因此交易必须由pallet的`asDerivative` extrinsic发起。举例来说，Alice有一个索引为`0`的衍生账户，如果她使用`asDerivative`函数转移任何余额，Alice仍将支付交易费，但转移的资金将从索引为`0`的衍生账户提取。

衍生是通过计算`modlpy/utilisuba` + `originalAddress` + `index`的Blake2哈希来完成的。您可以[使用脚本来计算给定原账户和索引的衍生账户](https://github.com/albertov19/PolkaTools/blob/main/calculateDerivedAddress.ts){target=_blank}。

其中一个衍生账户的用例可在XCM Transactor Pallet找到。Pallet允许用户从主权账户的衍生账户执行远程跨链调用，这使调用可在单个交易中轻松执行。更多信息，请参考[使用XCM Transactor Pallet进行远程执行](/builders/interoperability/xcm/xcm-transactor/){target=_blank}教程。

## Utility Pallet接口 {: #utility-pallet-interface }

### Extrinsics {: #extrinsics }

Utility Pallet提供以下extrinsics（函数）：

- **asDerivative**(index, call) - 在给定索引数和调用的情况下，通过发送者的索引匿名发送调用
- **batch**(calls) - 发送一批派遣的调用。若调用失败，将处理该时间点的任何成功调用，并触发`BatchInterrupted`事件。若所有调用成功，将触发`BatchCompleted`。调用次数不得超过[限制](#constants)
- **batchAll**(calls) - 发送一批派遣的调用并以原子方式执行。若其中一个调用失败，则整个交易将回滚并失败。调用次数不得超过[限制](#constants)
- **dispatchAs**(asOrigin, call) - 派遣一个提供原账户和要派遣调用的函数调用。此调用的派遣源必须为`Root`

### Pallet常量 {: #constants }

Utility Pallet包含以下只读函数来获取pallet常量：

- **batchedCallsLimit**() - 返回批量调用次数限制

## 使用Batch Extrinsics  {: #using-the-batch-extrinsics }

您可以使用Polkadot.js Apps接口或通过Polkadot.js API获取batch extrinsics。此示例将向您展示如何从Polkadot.js Apps使用`batch` extrinsic。如果您使用Polkadot.js API，您可以通过`api.tx.utility.batch`接口获取Utility Pallet。更多关于使用API批量处理交易，请参考[Polkadot.js API Library](/builders/build/substrate-api/polkadot-js-api/#batching-transactions){target=_blank}页面。

首先，您可以前往[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}并连接至Moonbase Alpha。此操作流程也同样适用于Moonbeam和Moonriver。

您可以发送任何调用的组合，如余额转账、民主、质押以及更多。

举个简单的例子，您可以选择余额转账。点击**Developer**下拉菜单，选择**Extrinsics**并执行以下步骤：

1. 选择提交`batch` extrinsic的账户

2. 在**submit the following extrinsic**菜单处选择**utility**

3. 选择**batch** extrinsic

4. 首个调用的字段将会自动填充，要添加第二个调用可点击**Add item**

5. 关于首个调用，选择**balances**

6. 选择**transfer** extrinsic

7. 输入接收资金的账户

8. 在**value**字段处输入要发送的DEV Token数量，确保您的账户为18位数位

9. 关于第二个调用，您可以重复操作步骤5至步骤8

10. 点击**Submit Transaction**立即发送调用

![Send batch transaction](/images/builders/pallets-precompiles/pallets/utility/utility-1.webp)

接下来，您将需要输入您的密码并点击**Sign and Submit**。随后，您可以在[Subscan](https://moonbase.subscan.io/){target=_blank}上查看extrinsic。

!!! 注意事项
    作为参考，您可以[在Subscan上查看此示例的确切extrinsic](https://moonbase.subscan.io/extrinsic/2561364-6){target=_blank}。

如果您查看extrinsic页面底部的**Events**标签，您应该看到几个事件，包括2个`balances (Transfer)`事件、2个`utility (ItemCompleted)`事件和1个包含批量处理交易详细信息的`utility (BatchCompleted)`事件。
