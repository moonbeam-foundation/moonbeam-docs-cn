---
title: XCM指令
description: 当XCM指令组合在一起时，将组成执行跨链操作的XCM消息。本文将介绍一些常用指令。
---

# XCM指令

## 概览 {: #introduction }

XCM消息包含一系列的[操作和指令](https://github.com/paritytech/xcm-format#5-the-xcvm-instruction-set){target=\_blank}，这些指令由跨链虚拟机（XCVM）执行。一个操作（例如将Token从一条链传到另一条链）由XCVM在源链和目标链中部分执行的指令组成。

举例来说，一个将DOT从波卡转移到Moonbeam的XCM消息会包含以下XCM指令（按顺序排序），其中一些指令在波卡执行，一些指令在Moonbeam执行：

 1. [TransferReserveAsset](#transfer-reserve-asset) — 该指令在波卡执行

 2. [ReserveAssetDeposited](#reserve-asset-deposited) — 该指令在Moonbeam执行

 3. [ClearOrigin](#clear-origin) — 该指令在Moonbeam执行

 4. [BuyExecution](#buy-execution) — 该指令在Moonbeam执行

  5. [DepositAsset](#deposit-asset) — 该指令在Moonbeam执行

从头开始构建XCM消息的指令并非是件容易的事情。因此开发者可以利用包装函数和pallet来使用XCM功能。[X-Tokens](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/){target=\_blank}和[XCM Transactor](/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/){target=\_blank} Pallet提供具有预定义XCM指令集的函数，用于发送[XC-20](/builders/interoperability/xcm/xc20/overview/){target=\_blank}或通过XCM在其他链上远程执行。

如果您感兴趣尝试使用不同指令的组合，您可以[使用Polkadot XCM Pallet执行和发送自定义XCM消息](/builders/interoperability/xcm/send-execute-xcm){target=\_blank}。

本教程将提供关于一些常用XCM指令的概览，包括上述示例中使用的指令。

## Buy Execution {: #buy-execution }

[`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=\_blank}指令通常在目标链执行。该指令从持有的暂存处（XCVM中的一个临时位置）提取资产用于支付执行费用。目标链决定支付的费用。

## Clear Origin {: #clear-origin }

[`ClearOrigin`](https://github.com/paritytech/xcm-format#clearorigin){target=\_blank}指令在目标链执行。该指令清除XCM作者的源，因此确保后续XCM指令无法控制作者的权限。

## Deposit Asset {: #deposit-asset }

[`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=\_blank}指令在目标链执行。该指令将资产从持有的暂存处（XCVM中的临时位置）中移除，并将资产传送至在目标链上的目标账户。

## Descend Origin {: #descend-origin }

[`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=\_blank}指令在目标链执行。该指令改变目标链上的源以匹配源链上的源，以确保在目标链上的操作，和对应在源链上启动XCM消息的代表是一致的。

## Initiate Reserve Withdraw {: #initiate-reserve-withdraw }

[`InitiateReserveWithdraw`](https://github.com/paritytech/xcm-format#initiatereservewithdraw){target=\_blank}指令在源链执行。该指令将资产从持有的暂存处（XCVM中的临时位置）中移除（本质上是销毁），并给储备链发送一条以`WithdrawAsset`指令开头的XCM消息。

## Refund Surplus {: #refund-surplus }

[`RefundSurplus`](https://github.com/paritytech/xcm-format#refundsurplus){target=\_blank}指令通常在XCM处理后在目标链执行。该指令将从`BuyExecution`指令中获取任何剩余资产，并将这些资产放入持有的暂存处（XCVM中的临时位置）中。

## Reserve Asset Deposited {: #reserve-asset-deposited }

[`ReserveAssetDeposited`](https://github.com/paritytech/xcm-format#reserveassetdeposited-){target=\_blank}指令在目标链执行。该指令将主权账户接收到资产以某种形式存入持有的暂存处（XCVM中的临时位置）中。

## Set Appendix {: #set-appendix }

[`SetAppendix`](https://github.com/paritytech/xcm-format#setappendix){target=\_blank}指令在目标链执行。该指令设置附加的暂存处，用于保存当前执行完成后应运行的代码。

## Transfer Reserve Asset {: #transfer-reserve-asset }

[`TransferReserveAsset`](https://github.com/paritytech/xcm-format#transferreserveasset){target=\_blank}指令在储备链执行。该指令将资产从源账户中移除，并将其充值到目标链中的目标账户。然后向目标链发送一条XCM消息，该消息使用`ReserveAssetDeposited`指令开始，向其后跟着要执行的其它XCM指令。

## Transact {: #transact }

[`Transact`](https://github.com/paritytech/xcm-format#transact){target=\_blank}指令在目标链执行。该指令负责发布一个编译完成的已知源的调用数据（call data），允许在目标链上执行特定的操作或功能。

## Withdraw Asset {: #withdraw-asset }

[`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=\_blank}指令可以在源链或目标链中执行。该指令删除资产并将其存放在持有的暂存处（XCVM中的临时位置）中。
