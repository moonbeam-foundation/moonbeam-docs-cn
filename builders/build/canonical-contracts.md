---
title: Moonbeam标准合约
description: 本文概述了Moonbeam、Moonriver和Moonbase Alpha上可用的标准合约，包括一些公用基础设施和预编译合约。
keywords: 标准合约, 以太坊, moonbeam, 预编译, 智能合约
---

# 标准合约

## 公用基础设施合约 {: #common-goods-contracts}

以下为已创建的合约地址：

=== "Moonbeam"
    |                                                          合约                                                           |                    地址                    |
    |:-----------------------------------------------------------------------------------------------------------------------:|:------------------------------------------:|
    |      [WGLMR](https://moonbeam.moonscan.io/address/0xAcc15dC74880C9944775448304B263D191c6077F#code){target=_blank}       | 0xAcc15dC74880C9944775448304B263D191c6077F |
    |    [Multicall](https://moonbeam.moonscan.io/address/0x83e3b61886770de2F64AAcaD2724ED4f08F7f36B#code){target=_blank}     | 0x83e3b61886770de2F64AAcaD2724ED4f08F7f36B |
    |    [Multicall2](https://moonbeam.moonscan.io/address/0x6477204E12A7236b9619385ea453F370aD897bb2#code){target=_blank}    | 0x6477204E12A7236b9619385ea453F370aD897bb2 |
    |    [Multicall3](https://moonbeam.moonscan.io/address/0xca11bde05977b3631167028862be2a173976ca11#code){target=_blank}    | 0xcA11bde05977b3631167028862bE2a173976CA11 |
    | [Multisig Factory](https://moonbeam.moonscan.io/address/0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2#code){target=_blank} | 0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2 |
    |                           [EIP-1820](https://eips.ethereum.org/EIPS/eip-1820){target=_blank}                            | 0x1820a4b7618bde71dce8cdc73aab6c95905fad24 |

=== "Moonriver"
    |                                                           合约                                                           |                    地址                    |
    |:------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------:|
    |      [WMOVR](https://moonriver.moonscan.io/address/0x98878B06940aE243284CA214f92Bb71a2b032B8A#code){target=_blank}       | 0x98878B06940aE243284CA214f92Bb71a2b032B8A |
    |    [Multicall](https://moonriver.moonscan.io/address/0x30f283Cc0284482e9c29dFB143bd483B5C19954b#code){target=_blank}*    | 0x30f283Cc0284482e9c29dFB143bd483B5C19954b |
    |    [Multicall2](https://moonriver.moonscan.io/address/0xaef00a0cf402d9dedd54092d9ca179be6f9e5ce3#code){target=_blank}    | 0xaef00a0cf402d9dedd54092d9ca179be6f9e5ce3 |
    |   [Multicall3](https://moonriver.moonscan.io/address/0xca11bde05977b3631167028862be2a173976ca11#code/){target=_blank}    | 0xcA11bde05977b3631167028862bE2a173976CA11 |
    | [Multisig Factory](https://moonriver.moonscan.io/address/0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2#code){target=_blank} | 0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2 |
    |                            [EIP-1820](https://eips.ethereum.org/EIPS/eip-1820){target=_blank}                            | 0x1820a4b7618bde71dce8cdc73aab6c95905fad24 |

    _*SushiSwap部署_

=== "Moonbase Alpha"
    |                                                          合约                                                           |                    地址                    |
    |:-----------------------------------------------------------------------------------------------------------------------:|:------------------------------------------:|
    |       [WDEV](https://moonbase.moonscan.io/address/0xD909178CC99d318e4D46e7E66a972955859670E1#code){target=_blank}       | 0xD909178CC99d318e4D46e7E66a972955859670E1 |
    |    [Multicall](https://moonbase.moonscan.io/address/0x4E2cfca20580747AdBA58cd677A998f8B261Fc21#code){target=_blank}*    | 0x4E2cfca20580747AdBA58cd677A998f8B261Fc21 |
    |    [Multicall2](https://moonbase.moonscan.io/address/0x37084d0158C68128d6Bc3E5db537Be996f7B6979#code){target=_blank}    | 0x37084d0158C68128d6Bc3E5db537Be996f7B6979 |
    |   [Multicall3](https://moonbase.moonscan.io/address/0xca11bde05977b3631167028862be2a173976ca11#code/){target=_blank}    | 0xcA11bde05977b3631167028862bE2a173976CA11 |
    | [Multisig Factory](https://moonbase.moonscan.io/address/0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2#code){target=_blank} | 0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2 |
    |                           [EIP-1820](https://eips.ethereum.org/EIPS/eip-1820){target=_blank}                            | 0x1820a4b7618bde71dce8cdc73aab6c95905fad24 |

    _*[UniswapV2 Demo Repo](https://github.com/papermoonio/moonbeam-uniswap/tree/main/uniswap-contracts-moonbeam){target=_blank}部署_

## 预编译合约 {: #precompiled-contracts }

Moonbeam、Moonriver和Moonbase Alpha上包含一组按地址和基于源网络分类的预编译合约。如果将预编译地址转换为十进制格式，并按数值进行分类，分类将如下所示：

- **0-1023** - [以太坊主网预编译](#ethereum-mainnet-precompiles)
- **1024-2047** - [不在以太坊中且不特定于Moonbeam](#non-moonbeam-specific-nor-ethereum-precomiles)的预编译
- **2048-4095** - [Moonbeam特定预编译](#moonbeam-specific-precompiles)

--8<-- 'text/builders/build/canonical-contracts/eth-mainnet.md'

--8<-- 'text/builders/build/canonical-contracts/non-specific.md'

### Moonbeam特定预编译 {: #moonbeam-specific-precompiles }

=== "Moonbeam"
    |                                                                           合约                                                                           |                                 地址                                 |
    |:--------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------:|
    |    [Parachain Staking](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank}    |             {{ networks.moonbeam.precompiles.staking }}              |
    |   [Crowdloan Rewards](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/crowdloan-rewards/CrowdloanInterface.sol){target=_blank}   |            {{ networks.moonbeam.precompiles.crowdloan }}             |
    |           [ERC-20 Interface](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=_blank}            |              {{ networks.moonbeam.precompiles.erc20 }}               |
    |       [Democracy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}        |            {{ networks.moonbeam.precompiles.democracy }}             |
    |                  [Xtokens](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank}                   |             {{ networks.moonbeam.precompiles.xtokens }}              |
    |          [Relay Encoder](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/relay-encoder/RelayEncoder.sol){target=_blank}          |          {{ networks.moonbeam.precompiles.relay_encoder }}           |
    |  [XCM Transactor V1](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=_blank}   |         {{networks.moonbeam.precompiles.xcm_transactor_v1 }}         |
    |    [Author Mapping](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=_blank}    |          {{ networks.moonbeam.precompiles.author_mapping }}          |
    |                     [Batch](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank}                      |              {{ networks.moonbeam.precompiles.batch }}               |
    |              [Randomness](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=_blank}              |             {{networks.moonbeam.precompiles.randomness}}             |
    |             [Call Permit](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=_blank}             |            {{networks.moonbeam.precompiles.call_permit }}            |
    |                     [Proxy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=_blank}                      |               {{networks.moonbeam.precompiles.proxy }}               |
    |              [XCM Utilities](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol){target=_blank}              |             {{networks.moonbeam.precompiles.xcm_utils }}             |
    |  [XCM Transactor V2](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v2/XcmTransactorV2.sol){target=_blank}   |         {{networks.moonbeam.precompiles.xcm_transactor_v2}}          |
    |          [Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}          |        {{networks.moonbeam.precompiles.collective_council }}         |
    |    [Technical Committee Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}    |     {{networks.moonbeam.precompiles.collective_tech_committee }}     |
    |     [Treasury Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}      |        {{networks.moonbeam.precompiles.collective_treasury }}        |
    |               [Referenda](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank}                |             {{networks.moonbeam.precompiles.referenda }}             |
    |    [Conviction Voting](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=_blank}    |         {{networks.moonbeam.precompiles.conviction_voting }}         |
    |                 [Preimage](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=_blank}                 |             {{networks.moonbeam.precompiles.preimage }}              |
    |        [OpenGov Tech Committee](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}        | {{networks.moonbeam.precompiles.collective_opengov_tech_committee }} |
    | [Precompile Registry](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=_blank} |             {{networks.moonbeam.precompiles.registry }}              |
    |                        [GMP](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/gmp/Gmp.sol){target=_blank}                         |                {{networks.moonbeam.precompiles.gmp }}                |

=== "Moonriver"
    |                                                                           合约                                                                           |                                 地址                                  |
    |:--------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------:|
    |    [Parachain Staking](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank}    |              {{ networks.moonriver.precompiles.staking}}              |
    |   [Crowdloan Rewards](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/crowdloan-rewards/CrowdloanInterface.sol){target=_blank}   |            {{ networks.moonriver.precompiles.crowdloan }}             |
    |           [ERC-20 Interface](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=_blank}            |              {{ networks.moonriver.precompiles.erc20 }}               |
    |       [Democracy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}        |            {{ networks.moonriver.precompiles.democracy }}             |
    |                  [Xtokens](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank}                   |             {{ networks.moonriver.precompiles.xtokens }}              |
    |          [Relay Encoder](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/relay-encoder/RelayEncoder.sol){target=_blank}          |          {{ networks.moonriver.precompiles.relay_encoder }}           |
    |  [XCM Transactor V1](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=_blank}   |         {{networks.moonriver.precompiles.xcm_transactor_v1 }}         |
    |    [Author Mapping](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=_blank}    |          {{ networks.moonriver.precompiles.author_mapping }}          |
    |                     [Batch](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank}                      |              {{ networks.moonriver.precompiles.batch }}               |
    |              [Randomness](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=_blank}              |             {{networks.moonriver.precompiles.randomness}}             |
    |             [Call Permit](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=_blank}             |            {{networks.moonriver.precompiles.call_permit }}            |
    |                     [Proxy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=_blank}                      |               {{networks.moonriver.precompiles.proxy }}               |
    |              [XCM Utilities](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol){target=_blank}              |             {{networks.moonbeam.precompiles.xcm_utils }}              |
    |  [XCM Transactor V2](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v2/XcmTransactorV2.sol){target=_blank}   |         {{networks.moonriver.precompiles.xcm_transactor_v2}}          |
    |          [Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}          |        {{networks.moonriver.precompiles.collective_council }}         |
    |    [Technical Committee Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}    |     {{networks.moonriver.precompiles.collective_tech_committee }}     |
    |     [Treasury Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}      |        {{networks.moonriver.precompiles.collective_treasury }}        |
    |               [Referenda](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank}                |             {{networks.moonriver.precompiles.referenda }}             |
    |    [Conviction Voting](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=_blank}    |         {{networks.moonriver.precompiles.conviction_voting }}         |
    |                 [Preimage](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=_blank}                 |             {{networks.moonriver.precompiles.preimage }}              |
    |        [OpenGov Tech Committee](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}        | {{networks.moonriver.precompiles.collective_opengov_tech_committee }} |
    | [Precompile Registry](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=_blank} |             {{networks.moonriver.precompiles.registry }}              |
    |                        [GMP](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/gmp/Gmp.sol){target=_blank}                         |                {{networks.moonriver.precompiles.gmp }}                |

=== "Moonbase Alpha"
    |                                                                           合约                                                                           |                                 地址                                 |
    |:--------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------:|
    |    [Parachain Staking](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank}    |              {{ networks.moonbase.precompiles.staking}}              |
    |   [Crowdloan Rewards](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/crowdloan-rewards/CrowdloanInterface.sol){target=_blank}   |            {{ networks.moonbase.precompiles.crowdloan }}             |
    |           [ERC-20 Interface](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=_blank}            |              {{ networks.moonbase.precompiles.erc20 }}               |
    |       [Democracy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}        |            {{ networks.moonbase.precompiles.democracy }}             |
    |                  [Xtokens](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank}                   |             {{ networks.moonbase.precompiles.xtokens }}              |
    |          [Relay Encoder](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/relay-encoder/RelayEncoder.sol){target=_blank}          |          {{ networks.moonbase.precompiles.relay_encoder }}           |
    |  [XCM Transactor V1](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=_blank}   |         {{networks.moonbase.precompiles.xcm_transactor_v1 }}         |
    |    [Author Mapping](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=_blank}    |          {{ networks.moonbase.precompiles.author_mapping }}          |
    |                     [Batch](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank}                      |              {{ networks.moonbase.precompiles.batch }}               |
    |              [Randomness](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=_blank}              |            {{ networks.moonbase.precompiles.randomness}}             |
    |             [Call Permit](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=_blank}             |           {{ networks.moonbase.precompiles.call_permit }}            |
    |                     [Proxy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=_blank}                      |               {{networks.moonbase.precompiles.proxy }}               |
    |              [XCM Utilities](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol){target=_blank}              |             {{networks.moonbase.precompiles.xcm_utils }}             |
    |  [XCM Transactor V2](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v2/XcmTransactorV2.sol){target=_blank}   |         {{networks.moonbase.precompiles.xcm_transactor_v2}}          |
    |          [Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}          |        {{networks.moonbase.precompiles.collective_council }}         |
    |    [Technical Committee Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}    |     {{networks.moonbase.precompiles.collective_tech_committee }}     |
    |     [Treasury Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}      |        {{networks.moonbase.precompiles.collective_treasury }}        |
    |               [Referenda](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank}                |             {{networks.moonbase.precompiles.referenda }}             |
    |    [Conviction Voting](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=_blank}    |         {{networks.moonbase.precompiles.conviction_voting }}         |
    |                 [Preimage](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=_blank}                 |             {{networks.moonbase.precompiles.preimage }}              |
    |        [OpenGov Tech Committee](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}        | {{networks.moonbase.precompiles.collective_opengov_tech_committee }} |
    | [Precompile Registry](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=_blank} |             {{networks.moonbase.precompiles.registry }}              |
    |                        [GMP](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/gmp/Gmp.sol){target=_blank}                         |                {{networks.moonbase.precompiles.gmp }}                |
    |  [XCM Transactor V3](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v3/XcmTransactorV3.sol){target=_blank}   |         {{networks.moonbase.precompiles.xcm_transactor_v3}}          |
    |                 [Identity](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/identity/Identity.sol){target=_blank}                 |              {{networks.moonbase.precompiles.identity}}              |
