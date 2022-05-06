---
title: 共识和确定性
description: 本文描述了以太坊开发者需要了解的Moonbeam在共识和确定性方面与以太坊之间的主要差异。
---

# 共识和确定性

![Moonbeam v Ethereum - Consensus and Finality Banner](/images/builders/get-started/eth-compare/consensus-finality-banner.png)

## 概览 {: #introduction } 

虽然Moonbeam致力于兼容以太坊Web3 API和EVM，但开发者仍需了解Moonbeam在共识和确定性方面与以太坊之间的主要差异。

简而言之，共识是不同主体就共享状态达成一致的一种方式。当创建区块时，网络的节点需要决定哪个区块将会代表下一个有效状态。而确定性则负责定义该有效状态何时无法被替代或是逆转。

截止本文撰写时，以太坊使用的是基于[工作量证明（PoW）](https://ethereum.org/en/developers/docs/consensus-mechanisms/pow/)的共识协议提供概率确定性。与其相反的是，Moonbeam使用基于[提名权益证明（NPoS）](https://wiki.polkadot.network/docs/learn-consensus)的混合共识协议提供确定性。

本教程将概述关于共识和确定性的一些主要差异，以及首次使用Moonbeam时需要了解的事项。

## 以太坊共识和确定性 {: #ethereum-consensus-and-finality } 

如同先前所述，以太坊目前使用的是PoW共识协议以及最长链规则，确定性的部分则是由概率决定的。

概率确定性代表一个区块（及其所有交易）不被恢复的概率会随着搭建在其之上的区块数量增加而增加。因此，确认的区块数越多，交易就越安全，发生这种被篡改及重组的可能性也就越低。如Vitalik所撰写的[关于确定性的博客](https://blog.ethereum.org/2016/05/09/on-settlement-finality/)中所建议的：_”您可以等待13次确认以获得攻击者100万分之一攻击成功的概率。“_

## Moonbeam共识和确定性 {: #moonbeam-consensus-and-finality } 

在波卡运行的机制中具有收集人和验证人，[收集人](https://wiki.polkadot.network/docs/en/learn-collator)负责通过收集用户端的交易记录并为中继链[验证人](https://wiki.polkadot.network/docs/en/learn-validator)生产状态交易证明来维持平行链（本示例中为Moonbeam）的运作。而收集人集（产生区块的节点）是根据其[网络上获得的质押数量](/learn/features/consensus/)来选择的。

在确定性方面，波卡和Kusama依赖[GRANDPA](https://wiki.polkadot.network/docs/learn-consensus#finality-gadget-grandpa)运作。GRANDPA为任何指定交易（区块）提供确定性的功能。换句话说，当区块/交易被标志为结束后，除非通过链上治理和分叉，将无法被恢复。Moonbeam遵循这样的最终确定性。

## 主要差异 {: #main-differences } 

在共识方面，Moonbeam主要基于委托权益证明（NPoS）模式，而以太坊遵循工作量证明（PoW）模式，两者大相径庭。因此，PoW概念如`difficulty`、`uncles`和`hashrate`等，在Moonbeam上没有任何意义。

对于与以太坊PoW相关并返回值的API，默认值将会被返回。现有遵循PoW机制的以太坊合约（如矿池合约）将会无法在Moonbeam上运作。

然而，Moonbeam的最终确定性可用于提供比以太坊目前更好的用户体验。检查交易确定性的策略相当简单：

 1. 您查询网络最新终结区块的哈希

 2. 您使用哈希截取区块编号

 3. 您使用区块编号对比您的交易，如果您的交易被包含在先前区块当中代表它已经被确认

 4. 进行安全检查，按编号检索区块，并验证给定的交易哈希被包含在该区块当中

以下部分将会列出您该如何使用以太坊JSON-RPC（自定义Web3请求）和Substrate（波卡）JSON-RPC检查交易终结的进度。

## 使用Moonbeam RPC端点查询交易确定性 {: #checking-tx-finality-with-moonbeam-rpc-endpoints }

Moonbeam添加了对`moon_isBlockFinalized`和`moon_isTxFinalized`自定义RPC端点的支持，可用于查询链上事件是否已最终确定。

您可以在[Moonbeam自定义API页面](/builders/build/moonbeam-custom-api#finality-rpc-endpoints){target=_blank} 中查阅详细API信息。

## 使用以太坊库查询交易确定性 {: #checking-tx-finality-with-ethereum-libraries } 

您可以在[Web3.js](https://web3js.readthedocs.io/)和[Ethers.js](https://docs.ethers.io/)中使用`send`方法连接至Substrate JSON-RPC。同样也可以在[Web3.py](https://web3py.readthedocs.io/)中使用`make_request`方法执行自定义RPC请求，您可以使用Web3.js的例子作为基准。

此代码依赖来自Substrate JSON-RPC的两个自定义RPC请求：`chain_getFinalizedHead` 和`chain_getHeader`。第一个请求将会获得最新确认区块的区块哈希，第二个请求将获得已知区块哈希的区块标题。 `eth_getBlockByNumber`和`eth_getTransactionReceipt`的调用也是如此，以检查给定的交易哈希是否包含在区块中。

--8<-- 'text/common/endpoint-examples.md'

!!! 注意事项
    以下所提供的代码片段并不适用于每个生产环境，请确保您已根据实际案例进行修改或调整。

=== "web3.js"
    --8<-- 'code/vs-ethereum/web3.md'

=== "ethers.js"
    --8<-- 'code/vs-ethereum/ethers.md'

=== "web3.py"
    --8<-- 'code/vs-ethereum/web3py.md'

## Checking Tx Finality with Substrate Libraries {: #checking-tx-finality-with-substrate-libraries }

[Polkadot.js API组件](https://polkadot.js.org/docs/api/start)和[Python Substrate Interface组件](https://github.com/polkascan/py-substrate-interface)提供开发者使用Javascript操作Substrate链的方法。

给定一个交易哈希（`tx_hash`），以下代码片段会获取当前的最终区块，并将其与您提供的交易的区块高度进行比较。该代码依赖于来自 Substrate JSON-RPC的三个RPC请求：

- `chain_getFinalizedHead` - 第一个请求获取最新的最终确认区块的区块哈希
- `chain_getHeader` - 第二个请求获取给定区块哈希的块头
- `eth_getTransactionReceipt` - 检索给定交易哈希的ETH交易收据

您可以在[Polkadot.js官方文档网站](https://polkadot.js.org/docs/substrate/rpc)和[Python Substrate Interface官方文档网站](https://polkascan.github.io/py-substrate-interface/)查询所有关于这两个库的详细JSON RPC信息。

=== "Polkadot.js"
    --8<-- 'code/vs-ethereum/polkadotjs.md'

=== "py-substrate-interface"
    --8<-- 'code/vs-ethereum/pysubstrateinterface.md'