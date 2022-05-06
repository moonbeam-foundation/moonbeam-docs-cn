---
title: 专业术语
description: 我们整理了与波卡相关的中英对照术语表，助您了解更多波卡生态的相关信息。
---

# 专业术语

事实上已经有很多关于波卡（Polkadot）、Substrate和新兴的Parity / Web3生态系统的专业术语。 我们对此进行了汇总，助您更好地理解Moonbeam文档、项目计划和操作教程。

### 收集人 （Collators） {: #collators } 

收集人是支持波卡（Polkadot）网络内平行链网络的主要参与者之一。 在Moonbeam，收集人负责产生区块，并将所产生的区块提交到波卡（Polkadot）中继链进行最终确定的节点。

### 委托人 (Delegators) {: #delegators } 

委托人是Moonbeam代币持有者，可选择其“支持”的平行链候选收集人节点。任何持有高于最低委托数量`free`余额的用户均可通过质押操作成为委托人。

### 提名人 (Nominators) {: #nominators } 

提名人是中继链代币持有者，可选择其“支持”的验证人。 提名人可以收到验证人的部分奖励，如果验证人行为不当，则可能会削减提名人已抵押的代币。 提名人最多可以提名16位验证人作为受信任的验证节点候选人，质押会分给所选择并且在当前有效集内的验证人。如果您希望在波卡（Polkadot）和/或Kusama上委托PureStake验证人节点，请查看[此教程](https://www.purestake.com/technology/polkadot-validator/)。

### 提名权益证明（Nominated Proof of Stake） {: #nominated-proof-of-stake } 

NPoS共识机制（提名权益证明）机制通过选择验证人集合，实现最强化的Polkadot链上安全。该机制的核心是权益证明系统（PoS），即委托人支持验证人。 获得最多支持的候选验证人可选举成为验证节点之一。 如果验证人行为不当，将大幅削减其已质押的代币。 因此，提名人应对他们提名的验证人进行尽职调查。如果您希望在波卡（Polkadot）和/或Kusama上提名PureStake，请查看[此教程](https://www.purestake.com/technology/polkadot-validator/)。

### 平行链 （Parachains） {: #parachains } 

平行链是基于波卡（Polkadot）运行的区块链。 平行链在波卡（Polkadot）获得共享的安全性，并实现集成波卡（Polkadot）网络的各类项目。这些项目需在特定时期（长达两年）内质押DOT（中继链的原生代币）来获得平行链插槽。

### 平行线程 （Parathreads） {: #parathreads } 

平行线程是连接到波卡（Polkadot）的区块链（是平行链的临时版）。通过逐个区块竞争完成区块（在DOT）， 平行线程能与波卡（Polkadot）网络的其他项目进行交互。 它们通过与其他的平行线程竞争完成出块，这意味着出价最高的块将在该回合中完成交互。

### 波卡 （Polkadot） {: #polkadot } 

波卡（Polkadot）构建了一个允许不同区块链在公共安全保障下，进行信息交换的网络。 波卡（Polkadot）使用Substrate开发框架构建。 连接到波卡的链称之为平行链。

### 中继链 （Relay Chain） {: #relay-chain } 

中继链是波卡（Polkadot）网络的中心链。平行链连接到中继链，并将其用于共享安全性和消息传递。中继链上的验证人有助于保护平行链。

### 智能合约 （Smart Contract） {: #smart-contract } 

智能合约是一种计算机程序或交易协议，旨在自动执行合约或协议的条款，控制或记录与法律相关的事件和动作。智能合约的总体目标是满足共同的合同条件（例如付款项、留置权、保密性，甚至强制执行），最大限度地减少异常以及对可信中介的需求。 相关的经济目标包括减少欺诈损失、仲裁、执行成本以及其他交易成本。[点击此处了解更多](https://en.wikipedia.org/wiki/Smart_contract)。

### Substrate {: #substrate } 

Substract是由Parity Technologies根据其执行的多个区块链客户端的经验而创建的基于Rust的区块链开发框架。 该框架具有构建区块链所需的多个模块和功能，包括P2P网络、共识机制、质押、加密货币、链上治理模块等，极大地减少了执行区块链所需的时间和工程量。

### Substrate Frame Pallets {: #substrate-frame-pallets } 

Substrate Frame Pallets基于Rust的模块的集合，提供构建区块链所需的功能。

### 验证人 （Validators） {: #validators } 

验证人是在网络中质押DOT保护波卡（Polkadot）中继链的节点，如果验证人行为不当，DOT数量则会被削减。 验证人最终确定了平行链上来自收集人的区块，并与其他验证人一起就下一个中继链区块达成共识。

### WebAssembly/Wasm {: #webassemblywasm } 

WebAssembly（缩写为Wasm）是基于堆栈虚拟机的二进制指令格式。Wasm被设计为编程语言的可移植编译目标，从而在 Web 上为客户端和服务器应用程序进行部署。
