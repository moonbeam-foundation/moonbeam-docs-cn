---
title: XC-20转移概览
description: 了解资产转移的类型以及通过XCM进行远程资产转移的一些基础知识，包括用于资产转移的XCM指令。
---

# XC-20转移概览

## 概览 {: #introduction }

XCM指令的正确组合可用于将资产从一个平行链转移到另一个平行链。目前，使用XCM进行资产转移主要有两种类型：资产传送和远程转移。

资产传送包括通过销毁原始链中转移的金额并在目标链上创建复制品（与销毁的金额相同），将资产从一个区块链移动到另一个区块链。在这种情况下，每个链都将原生资产作为储备，类似于销毁-铸造桥接机制。该模型需要一定程度的信任，因为两条链中的任何一条都可能恶意铸造更多资产。

远程转移包括通过原始链中的中间账户将资产从一个区块链转移到另一个区块链，该中间账户由目标链以免信任方式拥有。这个中间账户被称为“主权”账户。在这种情况下，原始链资产不会被销毁，而是由主权账户持有。目标链中的 XCM执行将包装（也称为“虚拟”或“跨链”资产）表示形式铸造到目标地址。包装资产始终可以与原生资产以 1:1 的比例互换。这类似于锁定-铸造和销毁-解锁桥接机制。资产原始的链称为储备链。

![Asset Teleporting and Remote Transfers](/images/builders/interoperability/xcm/xc20/send-xc20s/overview/overview-1.png)

目前，Moonbeam通过XCM使用远程转移的方式进行XC-20转移。

本页面介绍XCM远程转移的基础知识。如果您想了解如何进行XC-20转账，请参阅[通过Substrate API进行XC-20转移](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/){target=_blank}或[通过以太坊API进行XC-20转账](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/){target=_blank}教程。

## 资产转移的XCM指令 {: #xcm-instructions-for-asset-transfers }

X-Tokens Pallet和X-Tokens Precompile通过抽象出构建用于传输的XCM消息的过程，可以轻松地跨链发送资产。本教程旨在填补有关抽象逻辑的一些知识空白，特别是使用哪些XCM指令来构建XCM消息以发送资产跨链。

[X-Tokens Pallet extrinsics](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet#extrinsics){target=_blank}使用的XCM指令在[X-Tokens Open Runtime Module Library](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/moonbeam-{{ polkadot_sdk }}/xtokens){target=_blank}库中定义。

要使用的XCM指令集取决于正在传输的token和采用的路由。例如，有一组XCM指令用于将原生资产发送回其原始链（储备链），例如从Moonbeam发送xcDOT回Polkadot，而另一组XCM指令用于将原生资产从原始链发送回至目标链，例如DOT从Polkadot到Moonbeam。

以下部分提供了通过XCM进行Token传输所涉及的XCM指令的一些示例。

### 从储备链转移储备资产{: #transfer-native-from-origin } 

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/overview/DOT-to-xcDOT-instructions.md'

要检查XCM消息的指令是如何构建的，以将自备（原生）资产转移到目标链，例如DOT到Moonbeam，您可以参考[X-Tokens Open Runtime Module Library](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/moonbeam-{{ polkadot_sdk }}/xtokens){target=_blank}库中的[`transfer_self_reserve_asset`](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/moonbeam-{{ polkadot_sdk }}/xtokens/src/lib.rs#L679){target=_blank}函数。

它调用`TransferReserveAsset`并传入`assets`、`dest`和 `xcm`作为参数。尤其是， `xcm`参数包括`BuyExecution`和`DepositAsset`指令。如果您随后前往Polkadot GitHub库，您可以找到[`TransferReserveAsset`指令](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/xcm-executor/src/lib.rs#L514){target=_blank}。XCM消息是通过将`ReserveAssetDeposited`和`ClearOrigin`指令与`xcm`参数相结合来构造的，如上所述包括`BuyExecution`和`DepositAsset`指令。

### 将储备资产转回储备链{: #transfer-native-to-origin }

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/overview/xcDOT-to-DOT-instructions.md'

要检查XCM消息的指令是如何构建的，以将储备资产转移到目标链，例如将xcDOT转移到Polkadot，您可以参考[X-Tokens Open Runtime Module Library](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/moonbeam-{{ polkadot_sdk }}/xtokens){target=_blank}库中的[`transfer_to_reserve`](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/moonbeam-{{ polkadot_sdk }}/xtokens/src/lib.rs#L696){target=_blank}函数。

它调用`WithdrawAsset`，然后调用`InitiateReserveWithdraw`，并传入`assets`、`dest`和`xcm`作为参数。尤其是， `xcm`参数包括`BuyExecution`和`DepositAsset`指令。如果您随后前往Polkadot GitHub存储库，您可以找到[`InitiateReserveWithdraw`指令](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/xcm-executor/src/lib.rs#L638){target=_blank}。XCM消息是通过将`WithdrawAsset`和`ClearOrigin`指令与`xcm`参数相结合来构造的，如上所述包括`BuyExecution`和`DepositAsset`指令。
