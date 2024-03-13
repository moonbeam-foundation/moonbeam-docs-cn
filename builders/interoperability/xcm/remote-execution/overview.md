---
title: 远程执行概览
description: 了解通过XCM消息进行远程执行的基础知识。远程执行允许用户使用他们通过XCM远程控制的账户在其他区块链上执行操作。
---

# 通过XCM进行远程执行

## 概览 {: #introduction }  

[跨共识消息（XCM）](https://wiki.polkadot.network/docs/learn-crosschain) {target=\_blank}格式定义了如何在可互操作的区块链之间发送消息。这种格式为发送XCM消息打开了大门，该消息在基于Moonbeam的网络、中继链或波卡/Kusama生态系统中的其他平行链中执行任意字节集。

通过XCM的远程执行为跨链交互开辟了一系列新的可能性，从在其他链上执行操作到用户在无需切换链的情况下执行远程操作。

本页面介绍了XCM远程执行的基础知识。如果您想了解如何通过XCM进行远程执行，请参阅[通过Substrate API远程执行](/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/){target=\_blank}或[通过以太坊API远程执行](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/){target=\_blank}教程。

## 执行来源 {: #execution-origin }

一般来说，所有的交易都有一个来源，也就是调用的来源。以太坊交易只有一种来源类型，即`msg.sender`，它是发起交易的账户。

基于Substrate的交易更加复杂，因为它们可以具有不同的来源和不同的权限级别。这类似于使用特定的`require`语句进行EVM智能合约调用，其中调用必须来自允许的地址。相反，这些权限级别是在基于Substrate的runtime本身中编程的。

来源对于Substrate runtime的不同组件非常重要，因此，对于Moonbeam runtime也是如此。例如，它们在[链上治理实施](/learn/features/governance/){target=\_blank}中定义了它们继承的权限级别。

在执行XCM消息期间，来源定义了XCM执行的背景。默认情况下，XCM由目标链中的来源链的主权账户执行。这种波卡特有的属性，即在执行XCM时计算出的远程来源，称为[Computed Origins](/builders/interoperability/xcm/remote-execution/computed-origins/){target=\_blank}（以前称为Multilocation Derivative Accounts）。

根据目标链的配置，包括`DescendOrigin` XCM指令可以转换执行XCM消息的来源。此属性对于远程XCM执行非常重要，因为当前执行的操作使用的是新转换的来源，而不是源链的主权账户。

## 远程执行的XCM指令 {: xcm-instructions-remote-execution }

通过XCM在Moonbeam（作为示例）上执行远程执行所需的核心XCM指令如下：

 - [`DescendOrigin`](/builders/interoperability/xcm/core-concepts/instructions#descend-origin){target=\_blank} -（可选）在Moonbeam中执行。改变源以创建一个新的Computed Origin，代表源链中的发送者通过XCM控制的无密钥账户
 - [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions#withdraw-asset){target=\_blank} - 在Moonbeam中执行。从Computed Origin中取出资金
 - [`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions#buy-execution){target=\_blank} - 在Moonbeam中执行。使用先前XCM指令获取的资金来支付XCM执行费用，包括远程调用
 - [`Transact`](/builders/interoperability/xcm/core-concepts/instructions#transact){target=\_blank} - 在Moonbeam中执行。执行XCM指令中提供的任意字节

为了更正确地处理某些场景，上面提到的XCM指令可以由其他XCM指令补充，例如执行失败。一个例子是包含[`SetAppendix`](/builders/interoperability/xcm/core-concepts/instructions#set-appendix){target=\_blank}、 [`RefundSurplus`](/builders/interoperability/xcm/core-concepts/instructions#refund-surplus){target=\_blank}和[`Deposit`](/builders/interoperability/xcm/core-concepts/instructions#deposit-asset){target=\_blank}。

## 通用XCM进行远程执行的通用流程 {: #general-remote-execution-via-xcm-flow }

用户在源链中通过pallet构建XCM发起交易，该XCM至少需要包含[远程执行所需的XCM指令](#xcm-instructions-remote-execution)。交易在源链中执行，源链将包含给定指令的XCM消息发送到目标链。

XCM消息到达目标链并由目标链执行。默认情况下，它是使用源链的主权账户作为Computed Origin来执行的。使用这种来源类型的一个示例是当链打开或接受中继链上的HRMP通道时。

如果XCM消息包含[`DescendOrigin`](/builders/interoperability/xcm/core-concepts/instructions#descend-origin){target=\_blank}指令，则目标链可能会改变来源以计算新的Computed Origin（与基于Moonbeam的网络的情况相同）。

接下来，[`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions#withdraw-asset){target=\_blank}从Computed Origin（主权账户或转换账户）获取资金，然后通过[`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions#buy-execution){target=\_blank} XCM指令用于支付XCM执行费用。请注意，在这两个指令中，您需要指定要使用的资产。此外，您必须将要执行的字节包含在要购买的执行量中。

最后，[`Transact`](/builders/interoperability/xcm/core-concepts/instructions#transact){target=\_blank}执行与目标链中的pallet和函数相对应的任意字节集。您必须指定要使用的来源类型（通常是`SovereignAccount`）以及执行字节所需的权重（类似于以太坊的gas）。

![Diagram of the XCM instructions executed on the destination chain for remote execution.](/images/builders/interoperability/xcm/remote-execution/overview/overview-1.png)
