---
title: Solidity预编译
description: Moonbeam上可用Solidity预编译的概述。预编译使您能够使用以太坊API与Substrate功能交互。
---

# Moonbeam上预编译合约的概述

## 概述 {: #introduction }

在Moonbeam上，预编译合约是拥有以太坊格式地址的原生Substrate代码，与其他智能合约一样能够可以使用以太坊API进行调用。预编译允许您直接调用Substrate runtime，其通常在Moonbeam的以太坊这端无法访问。

用于实施预编译的Substrate代码可以在[EVM pallet](/learn/features/eth-compatibility/#evm-pallet){target=_blank}中找到。EVM pallet包含了[以太坊上的标准预编译以及一些不特定于以太坊的预编译](https://github.com/paritytech/frontier/tree/master/frame/evm/precompile){target=_blank}。它也包含了通过通用[`Precompiles` 特征](https://paritytech.github.io/frontier/rustdocs/pallet_evm/trait.Precompile.html){target=_blank}创建和执行自定义预编译的能力。目前已经创建了好几个特定于Moonbeam的自定义预编译，您可以在[Moonbeam代码库](https://github.com/moonbeam-foundation/moonbeam/tree/master/precompiles){target=_blank}中找到。

以太坊预编译合约包含了带有大量计算的复杂功能，例如哈希和加密等。Moonbeam上自定义预编译合约提供对基于Substrate功能的访问，例如质押、治理、XCM相关函数等。

特定于Moonbeam的预编译可以通过以太坊API使用大家熟悉又简单易懂的Solidity接口来进行交互，它们最终被用于与底层Substrate接口进行交互。该流程如下图所示：

![Precompiled Contracts Diagram](/images/builders/pallets-precompiles/precompiles/overview/overview-1.png)

--8<-- 'text/builders/pallets-precompiles/precompiles/security.md'

## 预编译合约地址 {: #precompiled-contract-addresses }

预编译合约是通过其地址并基于其原始网络来分类的。如果您将预编译地址转化至小数格式，并依据数值将其分类，则有以下几种类别：

- **0-1023** - [以太坊主网预编译](#ethereum-mainnet-precompiles)
- **1024-2047** - [不在以太坊也不是特定于Moonbeam](#non-moonbeam-specific-nor-ethereum-precomiles)的预编译
- **2048-4095** - [特定于Moonbeam的预编译](#moonbeam-specific-precompiles)

--8<-- 'text/builders/build/canonical-contracts/eth-mainnet.md'

--8<-- 'text/builders/build/canonical-contracts/non-specific.md'

### Moonbeam特定预编译 {: #moonbeam-specific-precompiles }

=== "Moonbeam"
    |                                                                           合约                                                                            |                                 地址                                 |
    |:---------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------:|
    |    [Parachain Staking](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank}     |             {{ networks.moonbeam.precompiles.staking }}              |
    |   [Crowdloan Rewards](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/crowdloan-rewards/CrowdloanInterface.sol){target=_blank}    |            {{ networks.moonbeam.precompiles.crowdloan }}             |
    |            [ERC-20 Interface](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=_blank}            |              {{ networks.moonbeam.precompiles.erc20 }}               |
    |        [Democracy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}        |            {{ networks.moonbeam.precompiles.democracy }}             |
    |                   [Xtokens](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank}                   |             {{ networks.moonbeam.precompiles.xtokens }}              |
    |          [Relay Encoder](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/relay-encoder/RelayEncoder.sol){target=_blank}           |          {{ networks.moonbeam.precompiles.relay_encoder }}           |
    | [XCM Transactor Legacy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=_blank} |       {{networks.moonbeam.precompiles.xcm_transactor_v1 }}       |
    |    [Author Mapping](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=_blank}     |          {{ networks.moonbeam.precompiles.author_mapping }}          |
    |                      [Batch](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank}                      |              {{ networks.moonbeam.precompiles.batch }}               |
    |              [Randomness](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=_blank}               |             {{networks.moonbeam.precompiles.randomness}}             |
    |             [Call Permit](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=_blank}              |            {{networks.moonbeam.precompiles.call_permit }}            |
    |                      [Proxy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=_blank}                      |               {{networks.moonbeam.precompiles.proxy }}               |
    |              [XCM Utilities](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol){target=_blank}               |             {{networks.moonbeam.precompiles.xcm_utils }}             |
    |    [XCM Transactor](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v2/XcmTransactorV2.sol){target=_blank}     |           {{networks.moonbeam.precompiles.xcm_transactor_v2}}           |
    |          [Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}           |        {{networks.moonbeam.precompiles.collective_council }}         |
    |    [Technical Committee Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}     |     {{networks.moonbeam.precompiles.collective_tech_committee }}     |
    |      [Treasury Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}      |        {{networks.moonbeam.precompiles.collective_treasury }}        |
    |                [Referenda](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank}                |             {{networks.moonbeam.precompiles.referenda }}             |
    |    [Conviction Voting](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=_blank}     |         {{networks.moonbeam.precompiles.conviction_voting }}         |
    |                 [Preimage](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=_blank}                  |             {{networks.moonbeam.precompiles.preimage }}              |
    |        [OpenGov Tech Committee](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}         | {{networks.moonbeam.precompiles.collective_opengov_tech_committee }} |
    | [Precompile Registry](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=_blank}  |             {{networks.moonbeam.precompiles.registry }}              |
    |                         [GMP](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/gmp/Gmp.sol){target=_blank}                         |                {{networks.moonbeam.precompiles.gmp }}                |

=== "Moonriver"
    |                                                                           合约                                                                            |                                 地址                                  |
    |:---------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------:|
    |    [Parachain Staking](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank}     |              {{ networks.moonriver.precompiles.staking}}              |
    |   [Crowdloan Rewards](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/crowdloan-rewards/CrowdloanInterface.sol){target=_blank}    |            {{ networks.moonriver.precompiles.crowdloan }}             |
    |            [ERC-20 Interface](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=_blank}            |              {{ networks.moonriver.precompiles.erc20 }}               |
    |        [Democracy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}        |            {{ networks.moonriver.precompiles.democracy }}             |
    |                   [Xtokens](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank}                   |             {{ networks.moonriver.precompiles.xtokens }}              |
    |          [Relay Encoder](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/relay-encoder/RelayEncoder.sol){target=_blank}           |          {{ networks.moonriver.precompiles.relay_encoder }}           |
    | [XCM Transactor Legacy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=_blank} |       {{networks.moonriver.precompiles.xcm_transactor_v1 }}       |
    |    [Author Mapping](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=_blank}     |          {{ networks.moonriver.precompiles.author_mapping }}          |
    |                      [Batch](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank}                      |              {{ networks.moonriver.precompiles.batch }}               |
    |              [Randomness](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=_blank}               |             {{networks.moonriver.precompiles.randomness}}             |
    |             [Call Permit](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=_blank}              |            {{networks.moonriver.precompiles.call_permit }}            |
    |                      [Proxy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=_blank}                      |               {{networks.moonriver.precompiles.proxy }}               |
    |              [XCM Utilities](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol){target=_blank}               |             {{networks.moonriver.precompiles.xcm_utils }}             |
    |    [XCM Transactor](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v2/XcmTransactorV2.sol){target=_blank}     |           {{networks.moonriver.precompiles.xcm_transactor_v2}}           |
    |          [Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}           |        {{networks.moonriver.precompiles.collective_council }}         |
    |    [Technical Committee Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}     |     {{networks.moonriver.precompiles.collective_tech_committee }}     |
    |      [Treasury Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}      |        {{networks.moonriver.precompiles.collective_treasury }}        |
    |                [Referenda](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank}                |             {{networks.moonriver.precompiles.referenda }}             |
    |    [Conviction Voting](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=_blank}     |         {{networks.moonriver.precompiles.conviction_voting }}         |
    |                 [Preimage](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=_blank}                  |             {{networks.moonriver.precompiles.preimage }}              |
    |        [OpenGov Tech Committee](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}         | {{networks.moonriver.precompiles.collective_opengov_tech_committee }} |
    | [Precompile Registry](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=_blank}  |             {{networks.moonriver.precompiles.registry }}              |
    |                         [GMP](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/gmp/Gmp.sol){target=_blank}                         |                {{networks.moonriver.precompiles.gmp }}                |

=== "Moonbase Alpha"
    |                                                                           合约                                                                            |                                 地址                                 |
    |:---------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------:|
    |    [Parachain Staking](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank}     |              {{ networks.moonbase.precompiles.staking}}              |
    |   [Crowdloan Rewards](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/crowdloan-rewards/CrowdloanInterface.sol){target=_blank}    |            {{ networks.moonbase.precompiles.crowdloan }}             |
    |            [ERC-20 Interface](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=_blank}            |              {{ networks.moonbase.precompiles.erc20 }}               |
    |        [Democracy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}        |            {{ networks.moonbase.precompiles.democracy }}             |
    |                   [Xtokens](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank}                   |             {{ networks.moonbase.precompiles.xtokens }}              |
    |          [Relay Encoder](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/relay-encoder/RelayEncoder.sol){target=_blank}           |          {{ networks.moonbase.precompiles.relay_encoder }}           |
    | [XCM Transactor Legacy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=_blank} |       {{networks.moonbase.precompiles.xcm_transactor_v1 }}       |
    |    [Author Mapping](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=_blank}     |          {{ networks.moonbase.precompiles.author_mapping }}          |
    |                      [Batch](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank}                      |              {{ networks.moonbase.precompiles.batch }}               |
    |              [Randomness](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=_blank}               |            {{ networks.moonbase.precompiles.randomness}}             |
    |             [Call Permit](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=_blank}              |           {{ networks.moonbase.precompiles.call_permit }}            |
    |                      [Proxy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=_blank}                      |               {{networks.moonbase.precompiles.proxy }}               |
    |              [XCM Utilities](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol){target=_blank}               |             {{networks.moonbase.precompiles.xcm_utils }}             |
    |    [XCM Transactor](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v2/XcmTransactorV2.sol){target=_blank}     |           {{networks.moonbase.precompiles.xcm_transactor_v2}}           |
    |          [Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}           |        {{networks.moonbase.precompiles.collective_council }}         |
    |    [Technical Committee Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}     |     {{networks.moonbase.precompiles.collective_tech_committee }}     |
    |      [Treasury Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}      |        {{networks.moonbase.precompiles.collective_treasury }}        |
    |                [Referenda](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank}                |             {{networks.moonbase.precompiles.referenda }}             |
    |    [Conviction Voting](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=_blank}     |         {{networks.moonbase.precompiles.conviction_voting }}         |
    |                 [Preimage](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=_blank}                  |             {{networks.moonbase.precompiles.preimage }}              |
    |        [OpenGov Tech Committee](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}         | {{networks.moonbase.precompiles.collective_opengov_tech_committee }} |
    | [Precompile Registry](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=_blank}  |             {{networks.moonbase.precompiles.registry }}              |
    |                         [GMP](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/gmp/Gmp.sol){target=_blank}                         |                {{networks.moonbase.precompiles.gmp }}                |