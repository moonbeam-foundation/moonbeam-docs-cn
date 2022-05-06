---
title: 技术与架构
description: 基于Rust语言以及Substrate框架，Moonbeam不仅能够为开发者提供了丰富的工具，也可以进行专业化和优化。
---

# 技术

## Moonbeam开发堆栈 {: #the-moonbeam-development-stack } 

Moonbeam是基于Substrate框架用Rust程序设计语言创建的智能合约区块链平台。

### Rust程序设计语言 {: #rust-programming-language } 

Rust非常适用于区块链编程，其拥有和C语言、C++语言一样的高性能。同时还有两者所不具备的内置内存安全功能，在编译过程中这一功能尤其出色，可避免因使用C语言、C++语言编程而遇到的的许多常见漏洞和安全问题。

### Substrate框架 {: #substrate-framework } 

Substrate框架提供了一系列丰富的区块链创建工具，包括能够实现一般状态转移功能时的执行环境，以及实现多种区块链子系统的一系列可插拔的模块设计。

通过多个现有的Substrate框架模块，Moonbeam可提供重要的区块链服务与功能，包括核心区块链数据结构、对等网络、共识机制、账户、资产、余额等。在运行时间内，通过定制化的模块和逻辑可实现例如跨链代币整合等特殊行为和功能。对于已调用的模块，Moonbeam将保持与上游Substrate编码库的密切连接，随时进行漏洞修补、强化功能并且增加新功能。

## 区块链运行时间 {: #blockchain-runtime } 

Moonbeam核心运行时间规定了Moonbeam区块链的状态转移功能和行为。Moonbeam运行时间通过[FRAME](/resources/glossary/#substrate-frame-pallets)模块创建，包括数个标准模块以及定制模块。运行时间将编译成[WebAssembly (Wasm)](/resources/glossary/#webassemblywasm) 二进制代码和原生二进制代码，这些编译版本将在波卡（Polkadot）中继链和Moonbeam节点环境中执行。

!!! 注意事项
    Substrate Frame Pallets是一系列基于Rust的模块组合，提供构建区块链的所需功能。WebAssembly是开放标准，定义可移植的二进制编码形式。不同的编程语言、编译器和浏览器均对其提供支持。您可在[专业术语](/resources/glossary/)中可查看更多。

Moonbeam运行时间使用的关键Substrate Frame Pallets包括：

 - **余额（Balances）** —— 支持账户，余额和转账
 - **以太坊虚拟机（EVM）** —— 基于SputnikVM实现完整的基于Rust语言的EVM，为Moonbeam智能合约提供状态转移逻辑
 - **以太坊（Ethereum）** —— 为EVM提供以太坊区块模拟处理
 - **RPC-Ethereum** —— 在Substrate框架下的Web3 RPC实行
 - **理事会（Council）** —— 包括和理事会及提案相关的治理机制
 - **民主权利（Democracy）** —— 基于代币权重的公共投票功能
 - **Executive** —— 编排层，可向其他运行时间模块发送调用指令
 - **Indices** —— 支持用户创建账户地址名称的简称
 - **System** —— 提供低层级类型、存储和区块链功能
 - **财政库（Treasury）** —— 链上财政库，可以调动资金支持例如平行链插槽等公益项目

此外，Moonbeam也使用Cumulus库来提供与波卡（Polkadot）中继链的集成。

除了以上这些Substrate Frame Pallets以外，我们还将使用Moonbeam的特殊功能模块，包括收集人机制和奖励，以及其他开发者工具。

## 以太坊兼容性架构 {: #ethereum-compatibility-architecture } 

Moonbeam上的智能合约可以使用Solidity、Vyper和任何能够将智能合约编译成EVM兼容字节码的语言执行。Moonbeam旨在提供一个与现有以太坊开发者工具链相兼容的、平滑的、安全的智能合约开发、测试和执行环境。

在Moonbeam上的执行智能合约，将尽量做到与以太坊 Layer 1接近。Moonbeam是单分片，因此跨合约调用与以太坊 Layer 1相同。

![Diagram showing the interactions made possible through Moonbeam's Ethereum compatibility](/images/learn/platform/technology-diagram.png)

上图展示了更高维度的交互流。DApp或现有以太坊开发者工具发出Web3 RPC调用指令，例如Truffle等，并被Moonbeam节点接收。节点同时可使用Web3 RPC和Substrate RPC，即可使用以太坊工具或Substrate工具和Moonbeam节点交互。RPC调用指令将被相关的Substrate运行时间功能进行处理，对签名进行检查，并处理所有的外部请求。对智能合约的调用指令最终会被发送到EVM，由EVM来执行状态的转移。

通过在Substrate Pallet-EVM上部署EVM，不仅可实现完整的基于Rust语言的EVM，还可获得Parity工程团队的支持。