---
title: 共识和确定性
description: 本文描述了以太坊开发者需要了解的Moonbeam在共识和确定性方面与以太坊之间的主要差异
---

# Moonbeam共识和确定性

## 概览 {: #introduction }

虽然Moonbeam致力于兼容以太坊Web3 API和EVM，但开发者仍需了解Moonbeam在共识和确定性方面与以太坊之间的主要差异。

简而言之，共识是不同主体就共享状态达成一致的一种方式。当创建区块时，网络的节点需要决定哪个区块将会代表下一个有效状态。而确定性则负责定义该有效状态何时无法被替代或是逆转。

以太坊最开始是使用基于[工作量证明（(PoW）](https://ethereum.org/en/developers/docs/consensus-mechanisms/pow/){target=_blank}的共识协议提供概率确定性。然而，从2022开始，以太坊不再使用PoW，而是改用[权益证明（PoS）](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/){target=_blank}提供最终确定性。与其相反的是，Moonbeam使用基于委托权益证明（DPoS）的混合共识协议提供最终确定性。DPoS是Polkadot的[提名权益证明 (NPoS)](https://wiki.polkadot.network/docs/learn-consensus){target=_blank}概念的演变，它允许委托人选择他们想要支持的候选收集人以及支持的比例，从而将更多权力交给Token持有者。

本教程将概述关于共识和确定性的一些主要差异，以及首次使用Moonbeam时需要了解的事项。

## 以太坊共识和确定性 {: #ethereum-consensus-and-finality }

如上所述，以太坊目前使用PoS共识协议，其中验证人将ETH质押在网络中并负责生产区块和检查新区块的有效性。区块生产的时间是固定的，分为12秒slots和32 slot epochs。每个slot随机选择一个验证人生产区块并传播至网络。每个slot都有一个随机选择的验证人委员会，负责确定区块的有效性。网络中的权益越大，验证人被选择生成或验证区块的机会就越大。

在以太坊的PoS共识协议中，最终确定性是通过“checkpoint”区块来实现的。验证者人就特定checkpoint区块的区块状态达成一致，这些checkpoint区块始终是一个epoch中的第一个区块，如果三分之二的验证人同意，则该区块被最终确定。区块确定性可以恢复，但是由于有强大的经济激励措施，因此验证人不会试图串通恢复区块。您可以在Vitalik的[On Settlement Finality](https://blog.ethereum.org/2016/05/09/on-settlement-finality/){target=blank}博客文章的Casper部分获取关于确定性的更多信息 。

## Moonbeam共识和确定性 {: #moonbeam-consensus-and-finality }

在Polkadot运行的机制中具有收集人和验证人，[收集人](https://wiki.polkadot.network/docs/en/learn-collator){target=_blank}负责通过收集用户端的交易记录并为中继链[验证人](https://wiki.polkadot.network/docs/en/learn-validator){target=_blank}生产状态交易证明来维持平行链（本示例中为Moonbeam）的运作。而收集人集（产生区块的节点）是根据其[网络上获得的质押量](/learn/features/consensus/){target=_blank}来选择的。

在确定性方面，Polkadot和Kusama依赖[GRANDPA](https://wiki.polkadot.network/docs/learn-consensus#finality-gadget-grandpa){target=_blank}运作。GRANDPA为任何指定交易（区块）提供确定性的功能。换句话说，当区块/交易被标志为结束后，除非通过链上治理和分叉，将无法被恢复。Moonbeam遵循这样的最终确定性。

## PoS和DPoS的主要差异 {: #main-differences }

在共识方面，Moonbeam主要基于委托权益证明（DPoS）模式，而以太坊遵循权益证明（PoS）模式，两者略有不同。尽管这两种机制都依赖于使用权益来验证和创建新区块，但仍存在一些关键差异。

通过以太坊上的PoS，验证人被选择根据自己在网络中的权益来生成和验证区块。只要验证人存入了验证人保证金，就可以选择他们来生成和验证区块。 然而，如前所述，网络中的质押量越大，选择验证者来生成和验证区块的机会就越大。

另一方面，通过Moonbeam上的DPoS，收集人有资格根据自身质押量加上网络中的委托人的质押量来生成区块。任何Token持有者都可以选择将其Token委托给候选收集人。质押量排名靠前的候选收集人（包括社区代表）将加入活跃收集人集。活跃收集人集中的候选收集人数量受[治理](/learn/features/governance){target=_blank}的约束。一旦进入活跃收集人集，收集人将被随机选择以使用[Nimbus共识框架](/learn/features/consensus/){target=_blank}生成区块。请注意，一旦收集人进入活跃收集人集，其总质押量不会影响他们被选择生产区块的机会。

就确定性而言，由于其使用的checkpoint确定性系统，以太坊上的区块可能比Moonbeam上的区块需要更长的时间才能完成。在以太坊中，验证人确定checkpoint区块的最终性，checkpoint区块始终是一个epoch中的第一个区块。由于一个epoch有32个slot，每个slot为12秒，因此一个区块的最终确定至少需要384秒，即6.4分钟。

Moonbeam不使用checkpoint区块，而是依赖Polkadot的GRANDPA确定性小工具，其中确定性过程与区块生产并行完成。此外，最终确定过程结合了区块链的结构，允许中继链验证人对他们认为有效的最高区块进行投票。在这种情况下，投票将适用于最终确定的所有区块，从而加快最终确定过程。当一个区块被包含在中继链后，一个区块就可以在Moonbeam上的一个区块内最终确定。

## 通过Ethereum RPC检查交易确定性 {: #check-tx-finality-with-ethereum-rpc-endpoints }

尽管确定性的小工具有所不同，但您可以使用相同的、相对简单的策略来检查以太坊和Moonbeam上的交易确定性：

 1. 您可以询问网络获取最新最终确定区块的哈希
 2. 使用哈希检索区块号
 3. 将其与交易的区块号进行对比。如果交易被包含在之前的区块中，则该交易已完成
 4. 为保证检查的安全性，按编号检索区块并验证给定的交易哈希是否在区块中

下方代码片段遵循这一策略来检查交易确定性。其使用[默认块参数](https://ethereum.org/en/developers/docs/apis/json-rpc/#default-block){target=_blank}的`finalized`选项来获取最新最终确定的区块。

--8<-- 'text/_common/endpoint-examples.md'

!!! 注意事项
    下方教程中提供的代码片段不适用于生产环境。请确保针对每个用例进行调整。

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/get-started/eth-compare/consensus-finality/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/get-started/eth-compare/consensus-finality/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/get-started/eth-compare/consensus-finality/web3.py'
    ```

## 使用Moonbeam RPC端点检查交易确定性 {: #check-tx-finality-with-moonbeam-rpc-endpoints }

Moonbeam添加了对两个自定义RPC端点`moon_isBlockFinalized`和`moon_isTxFinalized`的支持，可用于检查链上事件是否已完成。这两个方法都十分直接，您不需要对比区块数字来确保一个交易的完成性。

您可以前往Moonbeam自定义API页面的[确定性RPC端点](/builders/build/moonbeam-custom-api#finality-rpc-endpoints){target=_blank}部分获取更多信息。

您可以修改这些脚本以使用`moon_isBlockFinalized`和`moon_isTxFinalized`。为此，您可以使用[Web3.js](https://web3js.readthedocs.io/){target=_blank}和[Ethers.js](https://docs.ethers.org/){target=_blank}的`send`方法对Substrate JSON-RPC进行自定义调用。自定义RPC请求也可以使用 [Web3.py](https://web3py.readthedocs.io/){target=_blank}和`make_request`方法。您需要将方法名称和参数传递给自定义请求，您可以在[Moonbeam自定义API](/builders/build/moonbeam-custom-api/){target=_blank}页面上找到该请求。

???+ code "moon_isBlockFinalized"

    === "Ethers.js"

        ```js
        --8<-- 'code/builders/get-started/eth-compare/consensus-finality/custom-rpc/block/ethers.js'
        ```

    === "Web3.js"

        ```js
        --8<-- 'code/builders/get-started/eth-compare/consensus-finality/custom-rpc/block/web3.js'
        ```

    === "Web3.py"

        ```py
        --8<-- 'code/builders/get-started/eth-compare/consensus-finality/custom-rpc/block/web3.py'
        ```

??? code "moon_isTxFinalized"

    === "Ethers.js"

        ```js
        --8<-- 'code/builders/get-started/eth-compare/consensus-finality/custom-rpc/tx/ethers.js'
        ```

    === "Web3.js"

        ```js
        --8<-- 'code/builders/get-started/eth-compare/consensus-finality/custom-rpc/tx/web3.js'
        ```

    === "Web3.py"

        ```py
        --8<-- 'code/builders/get-started/eth-compare/consensus-finality/custom-rpc/tx/web3.py'
        ```

## 使用Substrate库检查交易确定性 {: #check-tx-finality-with-substrate-rpc-endpoints }

利用以下三个Substrate JSON-RPC的RPC请求，您能够获取当前最终确定的区块并将其与您提供的交易区块号进行比较：

- `chain_getFinalizedHead` - 第一个请求将获取最后的最终确定区块的区块哈希
- `chain_getHeader` - 第二个请求将获取给定区块哈希的区块头
- `eth_getTransactionReceipt` - 第三个请求将检索给定区块哈希的交易收据

[Polkadot.js API package](/builders/build/substrate-api/polkadot-js-api){target=_blank}和[Python Substrate Interface package](/builders/build/substrate-api/py-substrate-interface){target=_blank}为开发者提供一种使用JavaScript和Python与Substrate链交互的方式。

您可以在[Polkadot.js官方文档网站](https://polkadot.js.org/docs/substrate/rpc){target=_blank}获取关于Polkadot.js和Substrate JSON-RPC的更多信息，并在[PySubstrate官方文档网站](https://polkascan.github.io/py-substrate-interface/){target=_blank}获取关于Python Substrate接口的更多信息。

=== "Polkadot.js"

    ```js
    --8<-- 'code/builders/get-started/eth-compare/consensus-finality/polkadotjs.js'
    ```

=== "py-substrate-interface"

    ```py
    --8<-- 'code/builders/get-started/eth-compare/consensus-finality/pysubstrateinterface.py'
    ```

--8<-- 'text/_disclaimers/third-party-content.md'
