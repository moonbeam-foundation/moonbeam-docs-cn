---
title: Moonbeam测试网概览
description: Moonbeam测试网（Moonbase Alpha当前配置的概述，以及如何使用Solidity开始在其上进行开发。
---

# Moonbeam测试网（Moonbase Alpha）

更新于2021年12月9日

!!! 注意事项 
    随着[Moonbase Alpha v8](https://github.com/PureStake/moonbeam/releases/tag/v0.8.0)版本的发布，最低Gas价格被设定为1 GDEV（类似于以太坊上的GWei）。如果您之前的部署时所设置的Gas价格为`0`的话，这对您来说可能是突破性的变化。

## 目标 {: #goal } 

首个Moonbeam测试网（又称Moonbase Alpha）旨在向开发者们提供一个在共享环境下，能够在Moonbeam上进行开发或部署的平台。由于Moonbeam将作为平行链部署在Kusama和Polkadot上，因此我们希望测试网能够直接反映各测试环节的配置。为此，我们决定将测试网开发为一个基于平行链的配置，而非独立的Substrate设置。

如果您有任何意见或建议，或需要任何技术支持，欢迎加入[Moonbase AlphaNet的专用Discord频道](https://discord.gg/PfpUATX)。

## 初始配置 {: #initial-configuration } 

Moonbase Alpha具有以下配置：

 - Moonbeam会以平行链方式接入中继链运行
 - 平行链上将会有两个收集者节点（由PureStake主导）以收集区块。外部收集节点可以加入网络。只有质押前{{ networks.moonbase.staking.max_candidates }}名收集人节点将被选为活跃收集人群体
 - 中继链上会有三个验证者节点（由PureStake主导）来决定中继链上的区块。其中一个会被选来敲定每一个由Moonbeam收集者收集来的区块。此设定为将来扩展为两个平行链配置提供了空间。
 - 将会有两个RPC端点（由PureStake主导）。同时，用户可以运行全节点来使用他们的私人RPC节点。

![TestNet Diagram](/images/learn/platform/networks/moonbase-diagram-v7.png)

## 版本特色 {: #features } 

以下为本系统的特色：

??? release v1 "_2020年9月_" 
    - Substrate中完全模拟以太坊区块的生产（以太坊pallet）
    - 通过可分派功能与Rust EVM实现交互（[EVM pallet](https://docs.rs/pallet-evm/2.0.1/pallet_evm/))
    - 在Substrate（[Frontier](https://github.com/paritytech/frontier)）中由以太坊RPC原生支持（Web3)。此功能提供了与以太坊开发者工具之间的兼容性，包括MetaMask、Remix和Truffle Substrate


??? release v2 "_2020年10月_"
    - 支持活动订阅功能（pub/sub），这是Web3 RPC端缺少的组件，但经常被DApp开发人员使用。您可以    [这里](/builders/build/eth-api/pubsub/)找到如何订阅活动的教程。
    - 支持以下的预编合约：[ecrecover](https://docs.klaytn.com/smart-contract/precompiled-contracts#address-0x-01-ecrecover-hash-v-r-s)、[sha256](https://docs.klaytn.com/smart-contract/precompiled-contracts#address-0x-02-sha-256-data)    [ripemd160](https://docs.klaytn.com/smart-contract/precompiled-contracts#address-0x-03-ripemd-160-data)和[身份函数](https://docs.klaytn.com/smart-contract/precompiled-contracts#address-0x-04-datacopy-data)（或datacopy)。


??? release v3 "_2020年11月_" 
    - 将Substrate和以太坊账户统一为H160的形式，我们将这个功能称为[统一账户](https://medium.com/moonbeam-network/moonbase-alpha-v3-introducing-unified-accounts-88fae3564cda)。    后，系统内将会只有一种账户并以单一地址来表示
    - 新增支持活动订阅功能及对主题使用通配符和条件格式的可能性。您可以在[这里](/builders/build/eth-api/pubsub/#using-wildcards-and-conditional-formatting)找到更多资讯
    - Polkadot.js Apps现在原生支持H160地址以及ECDSA密钥。您可以通过您的以太坊地址来使    Substrate的功能（当可以使用时），例如staking、balances和governance。您可以在[这里](/integrations/wallets/polkadotjs/)找到更多资讯


??? release v4 "_2020年12月_"
    - 将波卡（Polkadot）平行链协议升级至最新版本（[Parachains V1](https://w3f.github.io/parachain-implementers-guide/)），并修补数项问题，包含节点同步，为多个收集人能够    个平行链上同步做好准备
    - 在兼容以太坊的特点上做了几点改进：
        * 活动订阅ID现在变回以太坊式订阅ID
        * 修复了特定例案的Gas估算问题
        * 添加支持还原原因消息的功能
        * 支持不需使用ChainId的以太坊

??? release v5 "_2021年1月_"
    - 添加[Staking pallet](https://wiki.polkadot.network/docs/learn-staking)的定制版本（仅    限于测试以及开发用途）
    - 支持查询池中仍在排队待确认交易的功能
    - 修复检索过去活动时所出现的问题，以及部分修复关于智能合约的问题
    - 进行许多本质上的改进，包含EVM执行时间的优化，使其执行速度快上15至50倍
    - 支持[modexp](https://docs.klaytn.com/smart-contract/precompiled-contracts#address-0x05-bigmodexp-base-exp-mod)预编合约


??? release v6 "_2021年2月_"
    - 公开发布定制的[Staking pallet](https://wiki.polkadot.network/docs/learn-staking)，拥    有代币的用户可以委托候选人并获得奖励
    - 增加[Democracy pallet](https://github.com/paritytech/substrate/tree/HEAD/frame/democracy)，拥有代币的用户可以[上传提案](/governance/proposals/)并且[投票](/governance/voting/)
    - 将[Frontier RPC](https://github.com/paritytech/frontier)更新至最新版本，提高EVM至少五倍的    执行效率
    - Gas的使用限制提高至一个区块15M以及每一个交易13M的限制

??? release v7 "_2021年4月_"
    - 添加对以太坊调试/跟踪模块的支持。这些功能在默认情况下处于关闭状态，需要启动一个完整节点并打开该    功能才可使用
        - 修复区块传播问题，不再仅限于候选收集人，从而提高网络稳定性
        - 增加理事会和技术委员会，扩展治理功能
        - 重构质押模块，使用新名称来改善终端用户体验
        - 添了三个新的预编译：[Bn128Add](https://eips.ethereum.org/EIPS/eip-196)、[Bn128Mul](https://eips.ethereum.org/EIPS/eip-196)和[Bn128Pairing](https://eips.ethereum.org/EIPS/eip-197)

??? release v8 "_2021年5月_" 
    - 增加[财政库pallet](https://substrate.dev/rustdocs/latest/pallet_treasury/index.html)，为    Moonbase Alpha新增财政库功能。两个财政库已被加入至网络当中，一个财政库将会获得 20% 的交易费并由民众和议会治理。另一个财政库将会获得 30% 的区块奖励，并负责收集资金为未来的平行链插槽做准备。
        - 增加[代理pallet](https://substrate.dev/rustdocs/latest/pallet_proxy/index.html)，可在Moonbase Alpha上使用[代理账户](https://wiki.polkadot.network/docs/learn-proxies)
        - 引入新的共识机制Nimbus。Nimbus通过提供不同的过滤器，随机选择活跃收集人池的一部分来进行下一个区    块生产。此外，区块作者将使用可以映射到每个收集人的 H160 地址的会话密钥进行奖励支付。您可在[这里](/learn/consensus/)阅读更多关于Nimbus资讯。
        - 在地址`{{ networks.moonbase.precompiles.staking }}`处增加[质押预编译合约](https://github.com/PureStake/moonbeam/pull/358)。您可在[此链接](https://raw.githubusercontent.com/PureStake/moonbeam/master/precompiles/parachain-staking/StakingInterface.sol)找到如何与合约交互。
        - 增加初步日志布隆过滤器（Bloom Filter），以匹配通过Frontier的用户请求。进一步优化了此功能，以实现更快的响应时间和更可预测的性能
        - 增加[平行链众贷pallet](https://github.com/PureStake/crowdloan-rewards)，以测试众贷奖励分配
        - 众多升级以加强网络稳定性
        - 最低Gas价格设定为1 GDEV（类似于与以太坊上的GWei）


### 版本发布通知 {: #release-notes } 

如果您想了解更多关于Moonbase Alpha的更新，请参考以下的发布资料：

 - [Moonbase Alpha v2](https://github.com/PureStake/moonbeam/releases/tag/v0.2.0)
 - [Moonbase Alpha v3](https://github.com/PureStake/moonbeam/releases/tag/v0.3.0)
 - [Moonbase Alpha v4](https://github.com/PureStake/moonbeam/releases/tag/v0.4.0)
 - [Moonbase Alpha v5](https://github.com/PureStake/moonbeam/releases/tag/v0.5.0)
 - [Moonbase Alpha v6](https://github.com/PureStake/moonbeam/releases/tag/v0.6.0)
 - [Moonbase Alpha v7](https://github.com/PureStake/moonbeam/releases/tag/v0.7.0)
 - [Moonbase Alpha v8](https://github.com/PureStake/moonbeam/releases/tag/v0.8.0)

--8<-- 'text/testnet/connect.md'

## 遥测功能 {: #telemetry } 

您可以点击这个[链接](https://telemetry.polkadot.io/#list/Moonbase%20Alpha)来查看及时的Moonbase Alpha遥测资讯。

## 代币 {: #tokens } 

Moonbase Alpha上名为DEV的代币将按需求发行。 **DEV 代币没有价值，可以自由获取**。目前，您可以通过两种方式访问​​此令牌：通过Discord机器人或手动访问。

### Discord - 任务中心 {: #discord-mission-control }

为了自动请求测试Token，我们创建了一个Discord机器人（名为 Mission Control :sunglasses:），当您输入您的地址时，它将每24小时（每个 Discord 用户）自动发送最多5个 DEV 令牌。您可以在我们的 [Discord 频道](https://discord.gg/PfpUATX) 上查看。有关更多信息，请访问 [此站点](/builders/get-started/networks/moonbase/#get-tokens/)。
 
在“Miscellaneous”类别下，您将找到我们的AlphaNet机器人频道。输入以下消息，将 `<enter-address-here->` 替换为您的 H160 地址：
 
```
!faucet 发送 <enter-address-here->
```

### 手动程序 {: #manual-procedure }

对于超过我们的Discord机器人允许的Token请求，请通过我们的[Discord频道](https://discord.gg/PfpUATX) 直接联系版主。我们很高兴提供测试您的应用程序所需的Token。

## 权益证明 {: #proof-of-stake } 

Moonbase Alpha是一个完全去中心化的权益证明网络。用户可以选择委托收集人节点来生产区块和获得质押奖励。请注意，Moonbase Alpha的DEV代币是没有任何经济价值的。候选人有效集的上限将会由治理决定。有效集的集元组成将由质押（包括委托）排名决定。

## 限制 {: #limitations } 

因为这是Moonbeam的第一个测试网，所以仍然有一些限制。

部分[预编码](https://docs.klaytn.com/smart-contract/precompiled-contracts)尚未加入至此版本内，您可以在[这里](/builders/build/canonical-contracts/precompiles/)查询目前所支持的预编码。除此之外，您还是能够使用所有的内建功能。

随着Moonbase Alpha v6的版本发布，每一个区块的gas使用上限被设置为{{ networks.moonbase.gas_block }}，每次交易的gas使用上限被设置为{{ networks.moonbase.gas_tx }}。

用户目前仅能使用Moonbeam平行链。我们会在未来的网络中加入中继链，向用户提供测试转移代币的功能。