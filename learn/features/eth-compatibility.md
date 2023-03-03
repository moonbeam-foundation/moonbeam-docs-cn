---
title: 以太坊兼容性
description: 如果您习惯了以太坊的开发环境，那么转至波卡（Polkadot）平行链开发并不容易。本文是对Moonbeam以太坊兼容性的概述。
---

# 以太坊兼容性

![Ethereum Compatibility Banner](/images/learn/features/eth-compatibility/banner-image.png)

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

## Frontier {: #frontier }

[Frontier](https://paritytech.github.io/frontier/){target=_blank} 是Substrate的以太坊兼容层。Frontier的目标是让标准的以太坊DApp无需修改即可在基于Substrate的链上运行。Frontier通过提供一些可以插入Substrate运行时（runtime）的Substrate pallet使这成为可能。以下pallet可以根据需要单独使用，也可以根据链所需的功能一起使用：

- **[EVM pallet](#evm-pallet){target=_blank}** - 处理EVM执行
- **[Ethereum pallet](#ethereum-pallet){target=_blank}** - 负责存储区块数据并提供RPC兼容性
- **基础费用pallet** - 添加对EIP-1559交易的支持并处理基本费用计算
- **动态费用pallet** - 计算动态最低gas价格

Moonbeam使用EVM和Ethereum pallet来实现完全的以太坊兼容。Moonbeam不使用基本费用或动态费用pallet。对于基本费用计算，Moonbeam有自己的[动态费用机制](https://forum.moonbeam.foundation/t/proposal-status-idea-dynamic-fee-mechanism-for-moonbeam-and-moonriver/241){target=_blank}，从RT2100开始，已推广到了Moonbase Alpha。目前，Moonbeam和Moonriver有一个静态的、硬编码的基本费用，而动态费用系统正在 Moonbase Alpha上进行测试。

### EVM Pallet {: #evm-pallet }

[EVM pallet](https://paritytech.github.io/frontier/frame/evm.html){target=_blank} 实现了沙盒虚拟堆栈机并使用[SputnikVM](https://github.com/rust-blockchain/evm){target=_blank}作为底层EVM引擎。

EVM执行以太坊智能合约字节码，其中通常使用Solidity等语言编写，然后将其编译为EVM字节码。EVM pallet的目标是在Substrate运行时模拟在以太坊上执行智能合约的功能。因此，它允许现有的EVM代码在基于Substrate的区块链中执行。

EVM内部是标准的H160以太坊式账户，并且它们具有关联数据，例如余额和nonce。EVM中的所有帐户都由可配置的Substrate帐户类型支持。Moonbeam已将 Substrate账户类型配置为非标准的H160账户，以完全兼容以太坊。因此，您只需要一个帐户即可与 Substrate运行时和EVM交互。 关于Moonbeam账户体系的更多信息，请参考[统一账户](/learn/features/unified-accounts/){target=_blank}页面。

通过统一的账户系统，一个映射的Substrate账户可以调用EVM pallet将基于Substrate的货币余额存入或提取到一个EVM pallet管理和使用的不同余额中。 一旦存在余额，就可以创建智能合约并与之交互。

还可以配置EVM pallet，以便任何可调度的调用都不会导致EVM的执行，但来自运行时的其他pallet的例外情况除外。Moonbeam配置成让pallet Ethereum全权负责EVM的执行。使用pallet Ethereum可以通过Ethereum API实现EVM交互。

如果区块链不需要以太坊模拟，只需要EVM执行，Substrate会完全使用其账户模型并代表EVM账户签署交易。 然而，在这个模型中，以太坊RPC不可用，DApps 必须使用Substrate API编写它们的前端。

与以太坊相比，EVM pallet应该产生几乎相同的执行结果，例如gas费用和余额变化。但是，仍然存在一些差异。有关详细信息，请参阅Frontier EVM Pallet文档的[EVM module vs Ethereum network](https://paritytech.github.io/frontier/frame/evm.html#evm-module-vs-ethereum-network){target=_blank}部分。

还有一些[预编译](https://github.com/paritytech/frontier/tree/4c05c2b09e71336d6b11207e6d12e486b4d2705c#evm-pallet-precompiles){target=_blank}可以与EVM pallet一起使用，扩展EVM的功能。Moonbeam使用以下EVM预编译：

- **[pallet-evm-precompile-simple](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_simple/){target=_blank}** - 包括五个基本预编译: ECRecover, ECRecoverPublicKey, Identity, RIPEMD160, SHA256
- **[pallet-evm-precompile-blake2](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_blake2/struct.Blake2F.html){target=_blank}** - 包括 BLAKE2 预编译
- **[pallet-evm-precompile-bn128](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_bn128/index.html){target=_blank}** - 包括三个 BN128 预编译: BN128Add、BN128Mul和BN128Pairing
- **[pallet-evm-precompile-modexp](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_modexp/struct.Modexp.html){target=_blank}** - 包括模幂预编译 
- **[pallet-evm-precompile-sha3fips](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_sha3fips/struct.Sha3FIPS256.html){target=_blank}** - 包括标准SHA3预编译
- **[pallet-evm-precompile-dispatch](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_dispatch/struct.Dispatch.html){target=_blank}** - 包括调度（dispatch）预编译

您可以在[以太网主网预编译合约](/builders/pallets-precompiles/precompiles/eth-mainnet){target=_blank}页面上找到大部分这些预编译的概述。

### Ethereum Pallet {: #ethereum-pallet}

[Ethereum pallet](https://paritytech.github.io/frontier/frame/ethereum.html){target=_blank} 负责处理区块，交易收据和状态。 它通过存储以太坊风格的区块和其在Substrate运行时中关联的交易哈希来实现向Moonbeam发送和接收以太坊格式的数据。

当用户提交一个原始以太坊交易时，它会通过pallet Ethereum的`transact` extrinsic转换为一个Substrate交易。使用Ethereum pallet作为EVM pallet的唯一执行者，强制所有数据以与以太坊兼容的方式进行存储和交易。这使得由Etherscan构建的[Moonscan](/builders/get-started/explorers#moonscan){target=_blank}等区块浏览器能够索引区块数据。

除了支持以太坊风格的数据外，以Ethereum pallet与[RPC模块](https://github.com/paritytech/frontier/tree/master/client/rpc){target=_blank}相结合还提供了RPC支持。这使得可以使用[基本的以太坊JSON-RPC方法](/builders/get-started/eth-compare/rpc-support#basic-ethereum-json-rpc-methods){target=_blank}，最终允许现有的以太坊DApps以最少的更改部署到Moonbeam。