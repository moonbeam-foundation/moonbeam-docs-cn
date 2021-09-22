---
title: 以太坊兼容性
description: 如果您习惯了以太坊的开发环境，那么转至波卡（Polkadot）平行链开发并不容易。本文将介绍初次接触Moonbeam时的注意事项。
---

# 以太坊兼容性

## Moonbeam和以太坊的差异之处 {: #differences-between-moonbeam-and-ethereum } 

虽然目前Moonbeam已在努力实现兼容以太坊Web3 API和EVM，但Moonbeam相比于以太坊仍存在一定的区别。

首先，Moonbeam采用权益证明（Proof of Stake）共识机制，这意味着工作量证明（Proof of Work）相关概念在Moonbeam网络上通常意义不大，例如挖矿难度、叔块、哈希率等。对于在以太坊工作量证明网络上返回相关值的API， Moonbeam网络返回的是默认值。 目前依赖于工作量证明内部网络的以太坊合约（例如矿池合约等）在Moonbeam网络上都无法正常运行。

另外一个和以太坊的重要区别是Moonbeam还拥有一系列基于Substrate功能的链上治理特点，这些链上治理模块可实现基于代币权重来投票进行区块链升级的功能。

## Moonbeam和以太坊的相同之处 {: #what-stays-the-same } 

以太坊Layer 1现有的工作量和状态只需要经过少量的修改便可转移到Moonbeam（上述差异部分提到的情况除外），而其他的应用程序、合约和工具则将基本保持不变。

Moonbeam支持以下几点：

 - **基于Solidity的智能合约**
 - **生态系统工具**（例如区块浏览器、前端开发库、钱包等）
 - **开发工具**（例如Truffle、Remix、MetaMask等）
 - **通过桥接的以太坊代币**（例如代币转移、状态可视化、消息传达等）