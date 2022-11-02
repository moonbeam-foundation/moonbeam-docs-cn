---
title: 跨共识信息格式（XCM）
description: 跨共识信息格式（XCM）运作机制概览，以及开发者该如何运用波卡和Kusama的XCM和新型资产
---

# 跨共识信息格式（XCM）

![XCM Overview Banner](/images/builders/xcm/overview/overview-banner.png)

## 概览 {: #introduction } 

波卡的[架构](https://wiki.polkadot.network/docs/learn-architecture)使平行链能够原生地与其他平行链互操作，允许任何种类数据和资产的跨链传递。

为实现跨链传递功能，[跨共识信息格式（XCM）](https://wiki.polkadot.network/docs/learn-crosschain)格式定义了一种围绕如何在两个互操作区块链间执行传递信息的表达语言。XCM并不限制于波卡内，其目标是成为两个共识系统间的通用和可扩展性语言。

此页面是XCM和其相关定义的简要介绍和概述。更多信息可以在 [Polkadot 的 Wiki](https://wiki.polkadot.network/docs/learn-crosschain){target=_blank}中找到。

## General XCM Definitions {: #general-xcm-definitions }

--8<-- 'text/xcm/general-xcm-definitions.md'
--8<-- 'text/xcm/general-xcm-definitions2.md'

## XCM Instructions {: #xcm-instructions }

XCM消息包含一系列由跨共识虚拟机(XCVM)执行的[操作/指](https://github.com/paritytech/xcm-format#5-the-xcvm-instruction-set){target=_blank}令。一个操作（例如，将一个代币从一个区块链转移到另一个区块链）由XCVM在源链和目标链中部分执行的指令组成。

例如，一条将DOT从Polkadot转帐到Moonbeam的XCM消息将包括以下XCM指令（按此顺序），这些指令部分在Polkadot上执行，部分在Moonbeam上执行：

 1. [DepositReserveAsset](https://github.com/paritytech/xcm-format#reserveassetdeposited){target=_blank} — 在Kusama执行
 2. [ReserveAssetDepossited](https://github.com/paritytech/xcm-format#reserveassetdeposited){target=_blank} — 在Moonriver执行
 3. [ClearOrigin](https://github.com/paritytech/xcm-format#clearorigin){target=_blank} — 在Moonriver执行
 4. [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} — 在Moonriver执行
 5. [DepositAsset](https://github.com/paritytech/xcm-format#depositasset){target=_blank} — 在Moonriver执行

## XCM传递协议 {: #XCM-transport-protocols }

波卡实现两个跨共识或传递协议，用于其组成的平行链中以处理XCM消息，而Moonbeam是其中之一：

- **垂直信息传递（VMP）** —— 分为两种信息传递协议：
  * **向上信息传递（UMP）** —— 允许平行链传递信息至中继链，如Moonbeam传递信息至波卡
  * **向下信息传递（DMP）** —— 允许中继链将信息向下传递到其连接的平行链，例如从波卡到Moonbeam

- **跨链信息传递（XCMP）** —— 在连接至同一个中继链的情况下，允许两个平行链相互交换信息。跨链交易使用基于Merkle Tree的基础排队机制以确保真确度。收集人在平行链间交换信息，而中继链验证人将会对这些信息进行验证。

!!! 注意事项
    目前，XCMP仍在开发当中。当前暂时使用称为水平中继路由信息传递（HRMP）进行传递，信息将会在中继链存储和读取，此协议将会在XCMP完整部署后弃用。

![Vertical Message Passing and Cross-chain Message Passing Overview](/images/builders/xcm/overview/overview-1.png)

除此之外，至少在XCM信息实现的早期阶段，有两个最常见的用例：

- **资产传送** —— 通过销毁在初始区块链的资产并在目标链上创建相应数量的资产以将资产从一个区块链转移到另外一个区块链。在此情况下，每条链都将使用原生资产作为储备，类似于销毁铸造的桥接机制。此模式需要一定程度的信任，因为两条链中的任何一条都有可能恶意铸造更多资产
- **远程转移** —— 通过在初始区块链上由目标区块链所拥有的中间账户将资产转移至目标区块链。此中间账户称为“主权”账户。在此情况下，原本链上的资产将不会被销毁，而是由主权账户持有。而XCM的执行将会在目标链上铸造包装（又称“虚拟”或是“跨链”资产）的相应资产至目标地址。此包装资产将能够永远以1:1的比例与原生资产兑换。此机制类似于锁仓铸造或是销毁解锁的桥接机制

![Asset Teleporting and Remote Transfers](/images/builders/xcm/overview/overview-2.png)

关于更多XCM的细节相关文章请访问[Polkadot Wiki](https://wiki.polkadot.network/docs/learn-crosschain)。

目前Moonbeam仅支持远程转账。所有在Moonbeam上的跨链资产将以*xc + TokenName*的形式呈现。举例而言，波卡的DOT将会以 _xcDOT_ 在Moonbeam上呈现，而Kusama的KSM将会以 _xcKSM_ 在Moonriver上呈现。关于XC-20标准的更多内容请查看[这里](/builders/xcm/xc20)。

**开发者必须了解错误的XCM信息可能导致资产流失。**因此，在部署至真实经济环境之前，开发者必须先在测试网测试XCM功能。

## 频道注册 {: #channel-registration }

在两条链开始进行沟通信息之前，必须先建立一个信息频道。信息频道不具有双向性，代表从A链至B链的信息频道只能将信息从A链传送至B链。于是，资产转移也仅限从A链转移至B链。因此，如需要双向传递信息必须开启两个信息频道。

中继链和平行链之间的XCM信息频道已在连接时自动成立。然而，如果平行链A希望与平行链B之间建立信息频道，平行链A必须在其网络中发送一个开启频道的函数，此函数同时也属于XCM的一部分。此XCM消息至少包含以下[XCM 指令](#xcm-instructions)（按特定顺序）：

 1. [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank}
 2. [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution){target=_blank}
 3. [Transact](https://github.com/paritytech/xcm-format#transact){target=_blank}

在这里，**Transact** 将包含编码的呼叫数据，以在中继链中执行打开频道和接受频道操作。交易也可以包括额外的指令来退还执行期间未消耗的G资产。

发送到中继链的XCM消息至少包括以下信息：

- 信息被执行的地点（在此以中继链为例）
- 支付相关费用的账户（使用中继链Token支付）
- 交易被执行时可使用的费用
- 编码调用数据，通过模仿中继链上的函数取得，包含以下编码信息：
    * 于中继链上被调用的方法（开启信息频道）
    * 目标区块链的平行链ID（在此以B平行链为例）
    * 于目标点信息队列的最大信息数量
    * 可发送的最大信息大小

交易费用将以中继链的跨链资产（xc）形式（*xcRelayChainAsset*）支付。以波卡和Moonbeam为例，交易费用将会以 _xcDOT_ 支付，而以Kusama和Moonriver为例，交易费用将会以 _xcKSM_ 支付。因此，支付费用的账户需要有足够的_xcRelayChainAsset_。这可以在Moonbeam/Moonriver中通过从传入的XCM信息中收取费用来解决，也就是先以原始区块链上的资产支付，发送到财政库，并使用财政库账户支付信息频道注册费用。

尽管平行链A已经表达其与平行链B之间开启XCM信息频道的意愿，但后者仍未将其是否愿意收取来自平行链A信息的意愿传送至中继链。因此，如要建立一个完整信息频道，平行链B也必须传送函数（也是XCM）至中继链。接受开启信息频道的函数与先前的函数相同。然而，编码调用数据的部分仅需包含新方法（接受信息频道）和初始传送者的平行链ID（在此以平行链A为例）。当两条平行链皆同意后，信息频道将会在下个时段开启。

![XCM Channel Registration Overview](/images/builders/xcm/overview/overview-3.png)

以上提到的动作皆能通过SUDO（若可用）或是治理（技术委员会或是公投）执行。

当信息频道已被成功建立，资产需要在通过XCMs转移前进行注册，包含将其以常数的形式加入runtime或是通过pallet进行注册。在Moonbeam上注册资产流程将在下个部分展开解释。

## XCM 资产注册 {: #xcm-asset-registration }

当信息频道已在两条平行链或是中继链与平行链之间建立，即可以进行资产注册。

一般而言，资产注册可以在runtime级别进行，也就是当资产被注册且被XCM支持时，将会需要进行runtime升级。然而，Moonbeam中包括了Substrate pallet，在无需runtime升级的情况下即可处理资产注册，从而简化流程。

当在注册一个XCM资产时，函数需要包含以下部分（除其他事项外）：

- 原始资产所在网络的平行链ID
- 资产类别。截至本文撰写时，您可以注册原生平行链Token或是使用通过[Pallet资产](https://github.com/paritytech/substrate/blob/master/frame/assets/src/lib.rs)创建资产的相应索引。
- 资产名称、标志和单位（十进制）
- 最低额度

在XCM资产成功注册后，将需要设定每秒的执行单位，此为在目标平行链执行未来XCM信息的费用参数，类似于以太坊系的gas费。然而，此费用可以用其他Token支付，如：DOT。如果通过XCM转移的Token数量无法负担XCM执行，则会出现交易失败，已花费的费用也不会退回。

当信息频道建立成功，XCM资产已经在目标平行链中成功注册，也已经设定完毕每秒的执行单位，则用户应当能够开始转移资产。

以上提到的动作皆能通过SUDO（若可用）或是治理（技术委员会或是公投）执行。

## Moonbeam和XCM {: #moonbeam-and-xcm }

Moonbeam作为波卡生态系统中的平行链，其中最重要的XCM实现是使波卡和其他平行链的资产转移至Moonbeam，这将能够使用户将其Token带入Moonbeam以及其他dApp中。

为扩展至Moonbeam独特的以太坊兼容功能，外部资产将会通过预编译合约以标准的[ERC-20接口](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol)形式呈现。Moonbeam上的XCM资产将会被称为XC-20以与通过EVM产生的原生XCM资产区分。预编译合约将会使用适当的Substrate功能以执行要求动作。然而，以开发者的眼光来看，XC-20为具有XCM跨链资产优势的ERC-20 Token，dApp也将能以熟悉的ERC-20接口支持他们。

![Moonbeam XC-20 XCM Integration With Polkadot](/images/builders/xcm/overview/overview-4.png)

预编译本身并不支持跨链转账尽量保持与原始ERC-20接口相同。所以，开发者将会需要仰赖Substrate API和XCM将其资产转移回原先转入的链，或是在不同的[预编译合约](https://github.com/PureStake/moonbeam/tree/master/precompiles/xtokens){target=_blank}使用来自以太坊API的XCM基础功能。

根据目标区块链的不同，资产转移可以通过传送（Teleporting）和远程转移的方式进行，后者是最常使用的方法。目前，Moonbeam仅支持远程转移。

以下的段落将会提供两个Moonbeam上XCM最初用例的概览：Moonbeam和波卡间的资产转移（通过VMP）和平行链之间的资产转移（通过XCMP）。此文章将会在更多互操作功能启用时更新，如Moonbeam上的ERC-20功能转移至其他平行链，或是其他资产以ERC-20的形式转入Moonbeam。

### Moonbeam与波卡 {: #moonbeam-and-polkadot }

Moonbeam作为波卡生态系统中的平行链，XCM + VMP的组合将能够使DOT在两者之间自由转换。此部分将会提供所有关于执行流程中的步骤和概览。

当项目以平行链的形式接入，中继链则会自动与平行链拥有双向的信息频道，因此不需要进行任何的注册。然而，中继链的原生Token仍然需要在平行链上注册。

今天Alice（波卡）希望从波卡转移一定数量的DOT至Moonbeam上的账户，称为Alith。因此，她使用一个XCM来表达她的意图。在此转账中，Moonbeam拥有在波卡上的主权账户。

所以，在波卡上的XCM信息执行将会转移特定数量的DOT至Moonbeam于波卡上的主权账户。当资产成功存入后，信息的第二部分将会被传送至Moonbeam。

Moonbeam将会原地执行XCM信息内包含的指定动作。在此例子中为铸造和转帐同样数量的*xcDOT*（跨链DOT）至Alice指定的账户，也就是Alith。在目标区块链上执行XCM的费用已经在转移资产时使用部分资产支付（在此示例中为_xcDOTs_）。

![Transfers from the Relay Chain to Moonbeam](/images/builders/xcm/overview/overview-5.png)

请注意以下重点：

- Alice和Alith可以是不同账户。举例而言，波卡账户为SR25519（或是ED25519）格式，而Moonbeam为ECDSA（以太坊格式）账户。两者也可以属于不同所有者
- 此流程包含一定程度的信任，因一条链将会仰赖另外一条链以执行其XCM信息的一部分。这将会在runtime级别上进行排序，因此可以轻易验证
- 在此示例中，跨链DOT（*xcDOT*）是Moonbeam在波卡上的主权账户所持有DOT的包装形式。*xcDOT*将能够随时在Moonbeam进行转账以及以1:1的形式兑换初始存入的DOT

Alith将其*xcDOT*存入流动性矿池。接着，Charleth需要更多*xcDOT*，于是在流动性池进行兑换，他希望转移一些*xcDOT*至其波卡账户。因此，他发起XCM信息以表达其意图。

接着，在Moonbeam上执行的XCM信息将会销毁一定数量的*xcDOT*。当资产已被销毁，信息的第二部分将会被传送至波卡。

波卡将会执行XCM信息内包含的指定动作。在此示例中为自Moonbeam主权账户转移与销毁的*xcDOT*数量相同的DOT至Charleth指定的账户，在此示例中被称为Charley。

![Transfers Back from Moonbeam to the Relay Chain](/images/builders/xcm/overview/overview-6.png)

### Moonbeam与其他平行链 {: #moonbeam-and-other-parachains }

Moonbeam作为波卡生态中的平行链，XCM + XCMP的组合使资产能够在Moonbeam与其他平行链之间自由转移。此段落将会包含这与Moonbeam和波卡之间XCM的最大不同。

首先，两个平行链间必须存在一个信息频道，且将要转移的资产必须已经在目标链上注册。当符合两个条件后，XCM才能在两条平行链间传递。

接着，当Alith（Moonbeam）自Moonbeam转移一定数量的GLMR至目标链上的账户（Alice）时，Token将会被转移至目标链在Moonbeam上拥有的主权账户。

由于XCM信息为在目标平行链上执行，因此将会铸造并转移同样数量的*xcGLMR*（跨链GLMR）至Alith指定的地址，在此示例中为Alice。XCM信息在目标平行链的执行费用以在转移资产时使用部分资产支付（此示例为*xcGLMR*）。

![Transfers from Moonbeam to another Parachain](/images/builders/xcm/overview/overview-7.png)

将*xcGLMR*转回Moonbeam的流程与上述流程相似。首先，XCM信息执行将会销毁返回至Moonbeam的*xcGLMR*数量。当成功销毁后，XCM信息剩余的部分将会通过中继链传送至Moonbeam。Moonbeam将会原地执行XCM信息并转移GLMR（销毁的*xcGLMR*数量）从目标链的主权账户至指定地址。
