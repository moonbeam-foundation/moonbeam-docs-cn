---
title: 跨共识消息格式（XCM）
description: 跨共识消息格式（XCM）运作机制概览，以及开发者该如何运用波卡/kusama间的XCM使用新资产。
---

# 跨共识消息格式（XCM）

## 概览 {: #introduction }

波卡的[架构](https://wiki.polkadot.network/docs/learn-architecture){target=\_blank}使平行链能够原生地与其他平行链互操作，允许任何种类数据和资产的跨链传递。

为实现跨链传递功能，[跨共识消息格式（XCM）](https://wiki.polkadot.network/docs/learn-crosschain){target=\_blank}格式定义了一种围绕如何在两个互操作区块链间执行传递消息的表达语言。XCM并不限制于波卡内，其目标是成为两个共识系统间的通用和可扩展性语言。

此页面将简单介绍XCM及其相关元素。更多信息请参阅[Polkadot的Wiki文档](https://wiki.polkadot.network/docs/learn-crosschain){target=\_blank}。

如果您想要了解更多XCM相关内容，请查看以下内容：

- [**XCM核心概念**](/builders/interoperability/xcm/core-concepts/){target=\_blank} - 了解[XCM指令](/builders/interoperability/xcm/core-concepts/instructions/){target=\_blank}、[Multilocations](/builders/interoperability/xcm/core-concepts/multilocations/){target=\_blank}和[XCM费用](/builders/interoperability/xcm/core-concepts/weights-fees/){target=\_blank}相关内容
- [**XC注册**](/builders/interoperability/xcm/xc-registration/){target=\_blank} - 了解[打开与Moonbeam的XCM通道](/builders/interoperability/xcm/xc-registration/xc-integration/){target=\_blank}以及如何[将波卡原生资产注册为XC-20资产](/builders/interoperability/xcm/xc-registration/assets/){target=\_blank}
- [**XC-20**](/builders/interoperability/xcm/xc20/){target=\_blank} - 了解仅限Moonbeam资产级别的[概述](/builders/interoperability/xcm/xc20/overview/){target=\_blank}并学习如何[与XC-20交互](/builders/interoperability/xcm/xc20/interact/){target=\_blank}，以及如何[通过XCM传送XC-20](/builders/interoperability/xcm/xc20/send-xc20s/){target=\_blank}
- [**通过XCM远程执行**](/builders/interoperability/xcm/remote-execution/){target=\_blank} - 掌握与通过XCM远程执行相关的所有概念，从[高级概述](/builders/interoperability/xcm/remote-execution/overview/){target=\_blank}开始，然后[计算起源](/builders/interoperability/xcm/remote-execution/computed-origins/){target=\_blank}，最后通过[XCM进行远程调用](/builders/interoperability/xcm/remote-execution/substrate-calls/){target=\_blank}和通过[XCM进行远程EVM调用](/builders/interoperability/xcm/remote-execution/remote-evm-calls/){target=\_blank}
- [**XCM SDK**](/builders/interoperability/xcm/xcm-sdk/v1/reference/){target=\_blank} -了解如何[使用Moonbeam的XCM SDK](/builders/interoperability/xcm/xcm-sdk/v1/xcm-sdk/){target=\_blank}
- **XCM调试和工具** - 了解如何通过[传送和执行通用XCM消息](/builders/interoperability/xcm/send-execute-xcm/){target=\_blank}测试一些XCM场景，或如何使用[XCM Utilities Precompile](/builders/interoperability/xcm/xcm-utils/){target=\_blank}直接在EVM中访问XCM相关的实用性函数

## XCM基本定义 {: #general-xcm-definitions }

--8<-- 'text/builders/interoperability/xcm/general-xcm-definitions.md'
--8<-- 'text/builders/interoperability/xcm/general-xcm-definitions2.md'

## 通过XCM的跨链传输协议 {: #xcm-transport-protocols }

XCM实现了两个跨共识或传输协议，用于作为其组成平行链之间的XCM消息，Moonbeam是其中之一：

- **垂直消息传递（VMP）**— 当一个项目作为平行链加入，它就会自动与中继链建立双向通信通道。因此，无需进行链注册。VMP分为两种消息传递传输协议：
    * **向上消息传递（UMP）** — 允许平行链传递消息至中继链，如Moonbeam传递消息至波卡
    * **向下消息传递（UMP）** — 允许中继链将消息向下传递到其平行链之一，例如从波卡到Moonbeam
- **跨链消息传递（XCMP）**  — 在连接到同一个中继链的情况下，允许两个平行链相互交换消息。跨链交易使用基于Merkle Tree的基础排队机制以确保真确度。收集人在平行链间交换消息，而中继链验证人将会对这些信息进行验证

!!! 注意事项
    目前，XCMP仍在开发当中。当前暂时使用称为水平中继路由信息传递（HRMP）进行传递，消息将会在中继链存储和读取，此协议将会在XCMP完整部署后弃用

![Vertical Message Passing and Cross-chain Message Passing Overview](/images/builders/interoperability/xcm/overview/overview-1.webp)

## 建立跨链通信 {: #channel-registration }

在两条链开始通信之前，必须先建立一个消息通道。消息通道不具有双向性，代表从A链至B链的消息通道只能将消息从A链传送至B链。因此，如需要双向传递消息必须开启两个消息通道。

中继链和平行链之间的XCM通道已在连接时自动打开。然而，如果平行链A希望与平行链B之间打开消息通道，平行链A必须在其网络中发送一个开启通道的函数，此函数同时也属于XCM的一部分。

尽管平行链A已经表达其与平行链B之间开启XCM通道的意愿，但后者仍未将其是否愿意收取来自平行链A消息的意愿传送至中继链。因此，如要建立一个完整消息通道，平行链B也必须传送函数（同样也是XCM）至中继链。接受开启消息通道的函数与先前的函数相同。然而，编码调用数据的部分仅需包含新方法（接受消息通道）和初始传送者的平行链ID（在此以平行链A为例）。当两条平行链皆同意后，消息通道将会在下个时段开启。

要了解更多关于通道注册的流程，请参考[如何使用Moonbeam建立XC集成](/builders/interoperability/xcm/xc-registration/xc-integration/){target=\_blank}教程。

![XCM Channel Registration Overview](/images/builders/interoperability/xcm/overview/overview-2.webp)

通道建立后，便可以在平行链之间发送跨链消息。对于资产传输，在通过XCM传输之前注册资产，可通过将其作为常量插入到运行时中，也可以通过pallet进行注册。Moonbeam中包括了Substrate pallet，在无需runtime升级的情况下即可处理资产注册，从而简化流程。

要了解如何在Moonbeam上注册资产，以及添加Moonbeam资产至另一条链的必要信息，请参阅[如何注册跨链资产](/builders/interoperability/xcm/xc-registration/assets/){target=\_blank}教程。

## Moonbeam上的XCM {: #moonbeam-and-xcm }

Moonbeam作为波卡生态系统中的平行链，其中最重要的XCM实现是波卡和其他平行链以及Moonbeam之间的资产转移，这允许使用户将其Token带入Moonbeam以及其他dApp中。

为此，Moonbeam引入了[XC-20](/builders/interoperability/xcm/xc20/overview/){target=\_blank}，它扩展了Moonbeam独特的以太坊兼容性功能。XC-20允许波卡原生资产通过预编译的合约通过标准[ERC-20接口](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target =_blank}表示。当这些资产注册到Moonbeam后，就可以将其设置为XCM执行费资产。因此，当用户将此类资产转移到Moonbeam时，一小部分金额将用于支付XCM执行费用。

另外，部署至Moonbeam的ERC-20可以通过XCM发送至波卡生态中的其他链。因此， 从开发者的角度来看，XC-20是具有作为XCM跨链资产额外优势的ERC-20 Token，且dApp可以通过熟悉的ERC-20界面轻松支持它们。

![Moonbeam XC-20 XCM Integration With Polkadot](/images/builders/interoperability/xcm/overview/overview-3.webp)

要将XC-20从波卡生态发送到Moonbeam，开发者需要通过Substrate API使用[X-Tokens Pallet](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/){target=\_blank}并通过以太坊API使用[X-Tokens Precompile](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/){target=\_blank}进行传输。

Moonbeam的另一个独特功能是能够从EVM智能合约启动XCM操作，或通过远程执行通过XCM消息调用其EVM。这解锁了一系列新的可能性，Moonbeam上的合约可以通过XCM访问平行链特定的功能，或者其他平行链生态系统可以使用Moonbeam上的EVM智能合约来扩展其功能。

以下部分将对上述提及的重要用例进行一个深入分析。

### Moonbeam和波卡之间的XCM传输 {: #transfers-moonbeam-polkadot }

Moonbeam作为波卡生态系统中的平行链，XCM + VMP的组合将能够使DOT在两者之间自由传输。因此，DOT在Moonbeam上注册为[_xcDOT_](https://moonscan.io/token/0xffffffff1fcacbd218edc0eba20fc2308c778080){target=\_blank}。

Alice（波卡）希望从波卡转移一定数量的DOT至Moonbeam上的账户，称为Alith。因此，她使用一个XCM来表达她的意图。在此转账中，Moonbeam拥有在波卡上的主权账户。

所以，在波卡上的XCM信息执行将会转移特定数量的DOT至Moonbeam于波卡上的主权账户。当资产成功存入后，消息的第二部分将会被传送至Moonbeam。

Moonbeam将会原地执行XCM消息内包含的指定动作。在此例子中为铸造和转账同样数量的_xcDOT_ （跨链DOT）至Alice指定的账户，也就是Alith。在目标区块链上执行XCM的费用已经在转移资产时使用部分资产支付（在此示例中为_xcDOT_ ）。

![Transfers from the Relay Chain to Moonbeam](/images/builders/interoperability/xcm/overview/overview-4.webp)

请注意以下重点：

- Alice和Alith可以是不同账户。举例而言，波卡账户为SR25519（或是ED25519）格式，而Moonbeam为ECDSA（以太坊格式）账户。两者也可以属于不同所有者
- 此流程包含一定程度的信任，因一条链将会仰赖另外一条链以执行其XCM信消息的一部分。这将会在runtime级别上进行排序，因此可以轻易验证
- 在此示例中，跨链DOT（_xcDOT_）是Moonbeam在波卡上的主权账户所持有DOT的包装形式。_xcDOT_将能够随时在Moonbeam进行转账以及以1:1的形式兑换初始存入的DOT（其中减去一部分费用）

Alith将其_xcDOT_存入流动性池中。接着，Charleth需要更多_xcDOT_，于是在流动性池进行兑换，他希望转移一些_xcDOT_至其波卡账户。因此，他发起XCM消息以表达其意图。

接着，在Moonbeam上执行的XCM信息将会销毁一定数量的_xcDOT_。当资产已被销毁，消息的第二部分将会被传送至波卡。

波卡将会原地执行XCM消息内包含的指定动作。在此示例中将从Moonbeam主权账户转移与销毁的_xcDOT_数量相同的DOT至Charleth指定的账户，在此示例中被称为Charley。

![Transfers Back from Moonbeam to the Relay Chain](/images/builders/interoperability/xcm/overview/overview-5.webp)

### Moonbeam和其他平行链之间的XCM传输 {: #transfers-moonbeam-other-parachains }

Moonbeam作为波卡生态中的平行链，XCM + XCMP的组合使资产能够在Moonbeam与其他平行链之间自由转移。此部分将会包含这与Moonbeam和波卡之间XCM的最大不同。

首先，两个平行链间必须存在一个消息通道，且将要转移的资产必须已经在目标链上注册。当符合两个条件后，XCM才能在两条平行链间传递。

接着，当Alith（Moonbeam）从Moonbeam转移一定数量的GLMR至目标链上的账户（Alice）时，Token将会被转移至目标链在Moonbeam上拥有的主权账户。

由于XCM消息是在目标平行链上执行，因此将会铸造并转移同样数量的_xcGLMR_（跨链GLMR）至Alith指定的地址，在此示例中为Alice。XCM消息在目标平行链的执行费用以在转移资产时使用部分资产支付（此示例为_xcGLMR_）。

![Transfers from Moonbeam to another Parachain](/images/builders/interoperability/xcm/overview/overview-6.webp)

将_xcGLMR_转回Moonbeam的流程与上述流程相似。首先，XCM消息执行将会销毁返回至Moonbeam的_xcGLMR_数量。当成功销毁后，XCM消息剩余的部分将会通过中继链传送至Moonbeam。Moonbeam将会原地执行XCM消息并转移GLMR（销毁的_xcGLMR_数量）从目标链的主权账户至指定地址。

### Moonbeam和其他链之间的远程执行 {: #execution-chains-moonbeam }

如上所述，XCM也能实现Moonbeam与波卡生态中的其他链的远程执行。

与其他用例相似，在两条链之间进行远程执行之前必须先建立指定XCM通道。通道是通用的，既可以用于资产转移，也可以用于远程执行。

另一个重要组成部分是支付远程执行费用的资产。在Moonbeam上，当注册XC-20时，可以将其设置为XCM执行费资产。因此，当转移XC-20资产到Moonbeam时，XCM执行费用将从转移金额中扣除。对于远程执行，用户可以在XCM消息中包含少量Token以支付XCM执行费用。

Alice（波卡）希望通过Moonbeam上的智能合约执行一个远程操作。因此，她发起XCM消息以表达其意图。她之前必须通过GLMR或_xcDOT_为她在Moonbeam上拥有的XCM执行账户提供资金。

Moonbeam将会在本地执行XCM消息内包含的指定动作。在此例子中为提取Alice决定的XCM执行费用的资产，并在Moonbeam上购买一些执行时间，以在Moonbeam的EVM上执行智能合约调用。

您可以在[远程执行](/builders/interoperability/xcm/remote-execution/overview/){target=\_blank}获取更多详细信息。
