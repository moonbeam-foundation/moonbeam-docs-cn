---
title: Multisig Pallet
description: 通过本文了解Multisig Pallet，其利用Substrate功能提供批准和调度来自Moonbeam上多签调用的能力。
---

# Multisig Pallet

## 概览 {: #introduction }

多签钱包是一种特殊类型的钱包，顾名思义，需要多个签名才能执行交易。多签有一组签名者，并定义了批准交易所需签名数量的阈值。这种类型的钱包提供了额外的安全性和去中心化层。

Moonbeam上的Multisig Pallet利用Substrate功能，允许本地批准和调度来自多签的调用。通过Multisig Pallet，多个签名者（在Substrate中也叫做signatories）可以批准并调度交易，其来源确定派生于签名者账户ID集和在批准前必须调用的账户数量阈值。

本文将概述extrinsics、存储函数和Moonbeam上Multisig Pallet中可用的Pallet常量的getter。另外，还包括一个简短的演示，介绍如何创建多签账户并发送需要三个签名者中的两个来批准和发送交易的交易。

## Multisig Pallet接口 {: #multisig-pallet-interface }

### Extrinsics {: #extrinsics }

Multisig Pallet提供以下extrinsics（函数）：

- **asMulti**(threshold, otherSignatories, maybeTimepoint, call, maxWeight) - 批准并在可能的情况下从由多个签名（多签）组成的复合源调度进行调用。如果该调用已获得足够数量签名者的批准，则该调用将被调度。如果这是第一次批准，则[`depositBase`](#constants)将被保留再加上`threshold`乘以[`depositFactor`](#constants)。当调用被调度或取消，预留的总金额将被退还。如果最终批准，则应使用此函数，反之您将需要使用`approveAsMulti`，因为其只需要调用的哈希值
- **approveAsMulti**(threshold, otherSignatories, maybeTimepoint, callHash, maxWeight) - 批准来自复合源的调用。您需要使用`asMulti`来代替最终批准
- **asMultiThreshold**(otherSignatories, call) - 立即用调用者的单一批准调度多签调用
- **cancelAsMulti**(threshold, otherSignatories, maybeTimepoint, callHash) - 取消来自复合源的预先存在的、正在进行的调用。成功取消后，任何保留的押金将被退还

其中需要提供的输入内容可以被定义为：

- **threshold** - 执行调度所需的批准总数
- **otherSignatories** - 可以批准调度的账户（发件人除外）
- **maybeTimepoint** - 第一次批准交易的时间点（区块号和交易索引），除非是第一次批准，否则该字段必须为`None`
- **call** - 要执行的调用
- **callHash** - 要执行的调用的哈希值
- **maxWeight** - 调度的最大权重

### 存储函数 {: #storage-methods }

Multisig Pallet包含以下只读存储函数来获取链状态数据：

- **multisigs**() - 返回给定账户的开放多签操作集
- **palletVersion**() - 返回当前Pallet版本

### Pallet常量 {: #constants }

Multisig Pallet包含以下只读函数来获取Pallet常量：

- **depositBase**() - 返回为创建多签执行或后续存储调度调用保留所需的基本货币数量。这是为附加存储项所保留的，其密钥大小为`32 + sizeof(AccountId)`字节，其中在Moonbeam上的为`32 + 20`，值的大小为`4 + sizeof((BlockNumber, Balance, AccountId))`，在Moonbeam上的为`4 + 4 + 16 +20`字节。
- **depositFactor**() - 返回创建多签执行时每单位阈值所需的货币数量。这是为了向预先存在的存储值中添加20个字节所保留的
- **maxSignatories**() - 返回多签中允许的最大签名者数量

## 如何创建多签账户 {: #create-a-multisig-account }

您可以从Polkadot.js应用程序界面轻松创建多签账户。最简单的方法是在[**Accounts**页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/accounts){target=_blank}进行操作。

首先，点击**Multisig**。

![Add a multisig on Polkadot.js Apps](/images/builders/pallets-precompiles/pallets/multisig/multisig-1.png)

接下来，您可以执行以下步骤：

1. 选择您要添加到多签的账户。在本示例中，将选择三个账户：Alice、Bob和Charlie
2. 在**threshold**中输入数字。在本示例中将使用`2`
3. 设置多签账户的名称。在本示例中将Alice、Bob和Charlie的多签账户设置为`ABC`
4. 点击**Create**

![Set up the multisig members](/images/builders/pallets-precompiles/pallets/multisig/multisig-2.png)

现在，ABC多签账户将显示在**Accounts**页面的**multisig**部分下。

![View the multisig account on the Accounts page of Polkadot.js Apps](/images/builders/pallets-precompiles/pallets/multisig/multisig-3.png)

您可以单击多签账户旁边的彩色图标来复制地址并使用DEV Token为其提供资金。
--8<-- 'text/_common/faucet/faucet-sentence.md'

## 如何创建多签交易 {: #create-a-multisig-transaction }

现在，您已创建多签账户，您可以从构建多签账户的其中一个账户创建一个多签调用。在本示例中将从Alice的账户创建调用。因此，Alice将需要提交一笔押金。押金的计算方式如下：

```text
Deposit = depositBase + threshold * depositFactor
```

您可以使用[Pallet常量](#constants)的getter函数获取`depositBase`和`depositFactor`。

当调用被批准和调度/取消后，押金将被退还给Alice。

由于此多签有两个阈值，因此如果不是Bob和Charlie同时批准的情况下，需要两位中至少一位批准该调用。最后批准调用的账户还需要调度调用。 当使用`asMulti`函数批准调用时，会自动完成调用的调度。

了解基础知识后，现在可以开始创建多签调用了。 在本示例中，您可以创建一个调用，将0.1 DEV 从ABC多重签名账户转移到Charlie的账户。首先，您需要获取用于转接的编码调用数据。前往Polkadot.js应用程序上的[**Extrinsics** 页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/ extrinsics){target=_blank}并执行以下步骤：

1. 确保已选择账户。并非一定是ABC多签账户，因为所选的账户并未包含在编码的调用数据中
2. 选择**balances** pallet和**transfer** extrinsic
3. 选择Charlie作为**dest**账户
4. 输入要转移的金额，在本示例中为`0.1` DEV
5. 点击**encoded call data**旁边的复制按钮
6. 点击**encoded call hash**旁边的复制按钮。请注意您无需提交extrinsic，只需要提交编码的调用数据和编码的调用哈希

![Get the encoded call data for a balance transfer](/images/builders/pallets-precompiles/pallets/multisig/multisig-4.png)

确保您已复制并存储编码的调用数据和编码的调用哈希，您将在本教程的后部分操作中用于批准多签调用。在本示例中，编码的调用数据和编码的哈希如下所示：

=== "Encoded call data"

    ```text
    0x0300798d4ba9baf0064ec19eb4f0a1a45785ae9d6dfc1300008a5d78456301
    ```

=== "Encoded call hash"

    ```text
    0x76d1a0a8f6eb177dd7a561ef954e83893823fa5d77f576910f3fdc6cb4666dea
    ```

接下来，您可以通过使用`asMulti` extrinsic创建多签调用。具体请执行以下步骤：

1. 选择您想要用于创建调用的账户，在本示例中为Alice
2. 选择**multisig** pallet和**asMulti** extrinsic
3. 设置多签的阈值，该值与之前在**Accounts**页面设置的相同，为`2`
4. 添加多签相关联的其他账户：Bob和Charlie
5. 由于这是创建多签调用的第一笔交易，因此请确保关闭在**maybeTimepoint**字段处的**include option**滑块。您只需输入此信息以进行依赖于了解创建调用时间点的批准
6. 为余额和转账提供调用信息，与之前的步骤的一样，选择**balances** pallet和**transfer** extrinsic
7. 将**dest**账户设置为Charlie
8. **value**设置为`0.1` DEV token
9. 将**refTime**和**proofSize**字段保留为0
10. 点击**Submit Transaction**创建多签调用

![Create a multisig call](/images/builders/pallets-precompiles/pallets/multisig/multisig-5.png)

现在您已经创建了多签调用，可以从Bob/Charlie的账户或两者提交批准交易。请记住，需要获得三名多签成员中至少两位的批准才可批准并调度调用。由于Alice创建了多签调用，这意味着她已经自动批准了此调用。

您可以通过Polkadot.js应用程序的**Accounts**页面轻松批准交易。接下来，在您的多签账户旁边，您将看到一个多签图标。如果您将鼠标停留在图标上，可以看到如下图所示的提示，然后点击**View pending approvals**。

![View pending multisig approvals](/images/builders/pallets-precompiles/pallets/multisig/multisig-6.png)

随后，页面将跳出**pending call hashes**的弹窗，您需要执行以下步骤：

1. 由于此时您应该只有一个哈希，因此您可以从此列表中直接选择。如果您有多个哈希，您可以将列表中的哈希与本节前面复制的编码调用哈希进行比较
2. **depositor**一栏会自动填充。在本示例中为Alice
3. 在**approval type**一栏，您可以选择批准或拒绝调用。在本示例中，您可以选择**Approve this call hash**
4. 选择您想要批准交易的账号。在本示例中为Bob的账号
5. 点击**Approve**提交批准交易。在后端将使用Multisig Pallet的`approveAsMulti` extrinsic

![Approve a multisig call](/images/builders/pallets-precompiles/pallets/multisig/multisig-7.png)

到目前为止，Alice和Bob已经批准了多签调用，这意味着已经满足了阈值。但是，由于您尚未提交执行批准，则调用尚未调度。为此，您将需要执行上述同样的步骤再加一些额外的步骤：

1. 选择您想要批准交易的账号。在本示例中为Charlie的账号
2. 开启**multisig message with call (for final approval)**按钮。在后端将extrinsic切换成`asMulti`，如果在此情况下满足批准阈值，则会自动批准并调度调用
3. **call data for final approval**一栏会自动出现。输入您之前复制的编码调用数据
4. 点击**Approve**提交批准，这也会调度多签调用

![Approve and dispatch a multisig call](/images/builders/pallets-precompiles/pallets/multisig/multisig-8.png)

最终交易提交后，0.1 DEV token将从ABC多签账户转移至Charlie的账户，押金也将退还给Alice账户。这样就可以了！您已成功创建一个多签调用、批准调用并调度调用。