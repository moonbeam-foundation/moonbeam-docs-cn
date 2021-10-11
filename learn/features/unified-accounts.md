---
title: 统一账户
description: 目前Moonbeam本地使用基于以太坊的H160账户系统且获得Polkadot.js Apps的支持。
---
# 统一账户

![Intro diagram](/images/learn/features/unified-accounts/unified-accounts-banner.png)

## 概览 {: #introduction } 

随着[Moonbase Alpha测试网v3升级版本的发布](https://moonbeam.network/announcements/moonbeam-network-upgrades-account-structure-to-match-ethereum/)，我们已对Moonbeam底层账户系统进行重大升级，将默认的Substrate式账户和密钥替换为以太坊式账户和密钥。

同时我们也升级了Polkadot.js Apps交互界面，以实现对H160地址和ECDSA密钥的原生支持。您可参考[此教程](/integrations/wallets/polkadotjs/)获取更多信息。

## Substrate EVM兼容的区块链 {: #substrate-evm-compatible-blockchain } 

波卡（Polkadot）生态系统中所有平行链都可实现完全兼容EVM，让Solidity智能合约仅需稍作修改甚至不需要修改即可执行。Substrate让这一集成成为可能——只需将[EVM模块](https://docs.rs/pallet-evm/2.0.1/pallet_evm/)插入运行时间，以获取EVM支持，并且插入[Ethereum Pallet with Frontier](https://github.com/paritytech/frontier)获得以太坊RPC兼容性。Moonbeam和Parity共同开发了这些开源模块，让许多平行链能够兼容以太坊。

但还有重要的一点需要注意。通过上述配置，用户（假设名字为Alice）可以拥有以太坊式地址（H160格式），这个地址在Substrate链上长度是40+2十六进制字符。与此地址相配的还有一个私钥，可以在链上的以太坊一侧用于签名确认交易。此外，这一地址也被映射到Substrate Balance模块下的Substrate式地址的储存槽中（H256格式）。

但是，Alice只知道H160地址的私钥，而不是知道其映射版本。因此，她不能使用H256地址发送交易，只能通过API进行只读操作。所以，她需要另一个H256地址来配对不同的私钥，才能在区块链的Substrate侧进行质押挖矿、管理余额、参与治理等操作。

以下图表阐释了这一配置。

![Old account system diagram](/images/learn/features/unified-accounts/unified-accounts-1.png)

然而这样一来，Alice的用户体验可能非常差。首先，她需要先将代币转移到H160映射的H256地址上才能进行交易，并通过EVM部署合约。其次，她还需要在另外一个H256地址（她有不同的私钥）上持有一定的余额，才能使用Substrate功能。简而言之，Alice需要至少两个私钥才能同时使用Substrate和EVM上的全部功能。

## Moonbeam统一账户 {: #moonbeam-unified-accounts } 

Moonbeam致力于在Polkadot上创造一个完全兼容以太坊的环境，并提供最好的用户体验。除了基本的以太坊功能以外，还提供了链上治理、质押挖矿、跨链整合等额外功能。

有了统一账户，用户（假设名字叫Bob）只需要一个H160地址就能够使用包括EVM和Substrate在内的所有功能。

以下图表阐释了这一新的配置。

![New account system diagram](/images/learn/features/unified-accounts/unified-accounts-2.png)

可以看到，Bob仅有一个配对地址的私钥。他不需要在两个不同账户之间转移余额，只需通过一个账户和一个私钥就可以获取所有功能。Moonbeam对单一账户进行了标准化调整，以符合以太坊式H160地址和ECDSA密钥标准。