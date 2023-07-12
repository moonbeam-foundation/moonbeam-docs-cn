---
title: Moonbeam中的Polkadot Substrate
description: 探索Polkadot的Substrate开发者框架，并了解它如何影响Moonbeam网络和其他平行链中的区块链开发。
---

# Moonbeam上的Polkadot Substrate

![Substrate banner](/images/builders/build/substrate-api/substrate/substrate-banner.png)

## 什么是Substrate？ {: #what-is-substrate }

Polkadot的Substrate是一个开源的模块化SDK，用于在Rust中构建区块链。它是由Parity Technologies进行开发，与Polkadot背后的团队是同一团队。

Polkadot是一条连接许多区块链的链，而Substrate是Moonbeam使用的工具集，其为创建自定义、特定领域的区块链提供了基础构建区块。Substrate的FRAME框架设计灵活且无分叉，允许开发者选择最适合其区块链需求的组件并执行runtime升级，而无需像以太坊那样进行网络分叉。大多数开发者会倾向于使用Substrate来与Polkadot生态系统集成，但它的灵活性允许用户创建单链和平行链。

此文档将提供关于Polkadot的Substrate的概述，以及与Moonbeam生态系统的联系。如果您对使用Substrate和FRAME在Polkadot上开发感兴趣，请参考[Substrate Developer Hub](https://docs.substrate.io/learn/what-can-you-build/){target=_blank}提供的全面文档、教程和示例。

## Substrate Pallets {: #substrate-pallets }

Pallet是Substrate区块链的基本构建区块。它们是封装特定功能的模块化组件。每个pallet本质上都是一段Rust代码，规定了特定功能或功能如何在区块链runtime内运行。

Pallet用于制定和扩展基于Substrate区块链的功能。这些可以被视为是即插即用的模块，用于混合、匹配和配置以创建定制的区块链。每个pallet都是独立且设计为专注于做一件事，提供特定的功能，例如管理余额、处理共识或促进链上治理。

以下是一些所有Substrate开发者可以使用的开源pallet的示例：

- **[Balances Pallet](https://crates.io/crates/pallet-balances){target=_blank}** — 在Substrate区块链中管理账户余额
- **[Assets Pallet](https://crates.io/crates/pallet-assets){target=_blank}** — 处理链上同质化资产的创建和管理
- **Consensus Pallets** — 这些pallet为区块生产提供不同的共识机制，例如[AURA](https://crates.io/crates/pallet-aura){target=_blank}和[BABE](https://crates.io/crates/pallet-babe){target=_blank}
- **Governance Pallets** — 这些pallet（例如[Referenda](https://crates.io/crates/pallet-referenda){target=_blank}和[Collective](https://crates.io/crates/pallet-collective){target=_blank}）提供链上治理机制
- **[Frontier Pallets](https://paritytech.github.io/frontier/){target=_blank}** — 以太坊兼容层pallet，允许基于Substrate的区块链与Moonbeam团队首创的基于以太坊的应用程序交互，包括[EVM Pallet](https://crates.io/crates/pallet-evm){target=_blank}
- **[Parachain Staking Pallet](/builders/pallets-precompiles/pallets/staking/){target=_blank}** — Moonbeam创建的pallet，支持委托权益证明（DPoS）系统

除了Polkadot Substrate提供的标准pallet之外，开发者还可以[创建自己的Pallet](https://docs.substrate.io/tutorials/collectibles-workshop/03-create-pallet/){target=_blank}为自己的区块链添加自定义功能。

!!! 注意事项
    由于pallet都是开源的，因此开发者可以编辑预先存在的pallet。这种灵活性是使用Polkadot Substrate的优势之一。但同样重要的是，通过Polkadot中继链连接的每个平行链都会强制执行一些标准。

由Polkadot Substrate构建的Moonbeam runtime可以在[Moonbeam GitHub repository](https://github.com/PureStake/moonbeam){target=_blank}中找到。在repo代码库中，您可以在[`pallets`文件](https://github.com/PureStake/moonbeam/tree/master/pallets){target=_blank}当中看到由Moonbeam团队编写和编辑的其他自定义pallet。您可以可以在Moonbeam文档资料库的[Pallets部分](/builders/pallets-precompiles/pallets/){target=_blank}查看一些与Moonbeam有关的Substrate pallet。

您可以使用[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api){target=_blank}、[Python Substrate Interface]( /builders/build/substrate-api/py-substrate-interface){target=_blank}和[Substrate API Sidecar](/builders/build/substrate-api/sidecar){target=_blank}这类的开发者工具与这些pallet公开的Substrate功能交互。

## 无分叉升级 {: #forkless-upgrades }

使用Substrate在Polkadot上进行开发的最好的事情之一是能够向区块链runtime引入[无分叉升级](https://docs.substrate.io/maintain/runtime-upgrades/){target=_blank}。在传统的区块链架构中，对区块链的规则或逻辑进行实质性改变通常需要硬分叉。这个过程可能会具有破坏性和争议性，将社区和区块链本身分裂成两个独立的实体。

而Substrate采用了不同的方法。它将区块链的状态（数据）与其逻辑（规则）分开。逻辑包含在区块链的runtime中，该runtime本身存储在区块链上。这种设计允许runtime通过一种特殊的交易进行升级，有效地改变规则，而不会破坏区块链的连续性。

每当您使用Substrate构建区块链时，您会将Rust代码编译成构建二进制文件。此构建可以通过[FRAME的`set_code`调用](https://paritytech.github.io/substrate/master/frame_system/pallet/enum.Call.html#variant.set_code){target=_blank}上传到预先存在且正在运行的区块链中。当新的runtime上传并获得批准（通常通过链上治理流程）时，所有节点都会在指定的区块编号处自动切换到新的runtime。这个过程是丝滑且自动的，无需节点运营商手动升级其软件。

Moonbeam定期使用无分叉升级系统为Moonbeam生态系统添加额外功能。您可以在[Moonbeam 社区论坛](https://forum.moonbeam.foundation/){target=_blank}上查看和讨论Moonbeam即将推出的无分叉升级。

## 本地互操作性 {: #native-interoperability }

虽然Substrate允许开发者创建区块链，但其最大的优势之一是Substrate支持通过Polkadot和Kusama等中继链集成本地互操作性。

中继链是连接多个区块链（称为平行链）的中心链。 每个平行链都是一个独特的区块链，具有自己的runtime和状态，但所有平行链都连接到中继链并受到中继链的保护。基于Substrate的区块链可以通过连接到中继链而成为平行链。连接后，平行链可以通过一种称为[跨共识消息传递 (XCM)](/builders/interoperability/xcm/overview/){target=_blank}的机制与其他平行链进行通信，从而能够以相同的语言交换信息并进行交易，以实现广泛的可互操作应用程序。

本地互操作性提供以下优势：

- **共享安全性** — 平行链共享中继链的安全性，减少每条链保护自身安全所需的资源
- **链间通信** — 平行链可以相互通信，从而实现不同区块链之间数据和资产的传输
- **资产转移** — 可以相互通信的平行链可以轻松地在彼此之间发送原生资产

通过提供本地互操作性，Substrate能够创建多样化、互连的区块链生态系统。这符合多链未来的愿景，不同的区块链可以协同工作，提供更丰富、更强大的区块链环境。

Moonbeam网络与许多其他平行链有一系列XCM连接。您可以在 [Moonbeam社区论坛的XCM部分](https://forum.moonbeam.foundation/c/xcm-hrmp/13){target=_blank}查看即将推出的XCM集成。