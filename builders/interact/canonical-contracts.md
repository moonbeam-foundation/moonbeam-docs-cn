---
title: 标准合约
description: 本文概述了Moonbeam、Moonriver和Moonbase Alpha上可用的标准合约，包括一些公用基础设施和一些预编译合约
---

# 标准合约

![Canonical contracts banner](/images/builders/build/canonical-contracts/contract-addresses/canonical-contracts-banner.png)

## 公用基础设施合约 {: #common-goods-contracts}

以下为已创建的合约地址：

=== "Moonbeam"
    |                                            合约                                            |                  地址                  |
    |:----------------------------------------------------------------------------------------------:|:------------------------------------------:|
    |   [WMOVR](https://moonbeam.moonscan.io/address/0xf50225a84382c74CbdeA10b0c176f71fc3DE0C4d/)    | 0xf50225a84382c74CbdeA10b0c176f71fc3DE0C4d |
    | [Multicall](https://moonbeam.moonscan.io/address/0x83e3b61886770de2F64AAcaD2724ED4f08F7f36B/)  | 0x83e3b61886770de2F64AAcaD2724ED4f08F7f36B |
    | [Multicall2](https://moonbeam.moonscan.io/address/0x6477204E12A7236b9619385ea453F370aD897bb2/) | 0x6477204E12A7236b9619385ea453F370aD897bb2 |
    |                      [EIP 1820](https://eips.ethereum.org/EIPS/eip-1820)                       | 0x1820a4b7618bde71dce8cdc73aab6c95905fad24 |


=== "Moonriver"
    |                                               合约                                               |                  地址                   |
    |:-----------------------------------------------------------------------------------------------------:|:------------------------------------------:|
    |      [WMOVR](https://moonriver.moonscan.io/address/0xf50225a84382c74CbdeA10b0c176f71fc3DE0C4d/)       | 0xf50225a84382c74CbdeA10b0c176f71fc3DE0C4d |
    |    [Multicall](https://moonriver.moonscan.io/address/0x270f2F35bED92B7A59eA5F08F6B3fd34c8D9D9b5/)*    | 0x270f2F35bED92B7A59eA5F08F6B3fd34c8D9D9b5 |
    |    [Multicall2](https://moonriver.moonscan.io/address/0xaef00a0cf402d9dedd54092d9ca179be6f9e5ce3/)    | 0xaef00a0cf402d9dedd54092d9ca179be6f9e5ce3 |
    | [Multisig Factory](https://moonriver.moonscan.io/address/0x4e59b44847b379578588920cA78FbF26c0B4956C/) | 0x4e59b44847b379578588920cA78FbF26c0B4956C |
    |                          [EIP 1820](https://eips.ethereum.org/EIPS/eip-1820)                          | 0x1820a4b7618bde71dce8cdc73aab6c95905fad24 |


    _*SushiSwap部署_

=== "Moonbase Alpha"
    |                                                           合约                                                           |                  地址                   |
    |:----------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------:|
    |       [WDEV](https://moonbase-blockscout.testnet.moonbeam.network/address/0xD909178CC99d318e4D46e7E66a972955859670E1/)       | 0xD909178CC99d318e4D46e7E66a972955859670E1 |
    |    [Multicall](https://moonbase-blockscout.testnet.moonbeam.network/address/0x4E2cfca20580747AdBA58cd677A998f8B261Fc21/)*    | 0x4E2cfca20580747AdBA58cd677A998f8B261Fc21 |
    | [Multisig Factory](https://moonbase-blockscout.testnet.moonbeam.network/address/0x4e59b44847b379578588920cA78FbF26c0B4956C/) | 0x4e59b44847b379578588920cA78FbF26c0B4956C |
    |                                     [EIP 1820](https://eips.ethereum.org/EIPS/eip-1820)                                      | 0x1820a4b7618bde71dce8cdc73aab6c95905fad24 |

    _*[UniswapV2 Demo Repo](https://github.com/PureStake/moonbeam-uniswap/tree/main/uniswap-contracts-moonbeam)部署_

## 预编译合约 {: #precompiled-contracts }

Moonbeam、Moonriver和Moonbase Alpha上包含一组按地址和基于源网络分类的预编译合约。如果将预编译地址转换为十进制格式，并按数值进行分类，分类将如下所示：

- **0-1023** - [以太坊主网预编译](#ethereum-mainnet-precompiles)
- **1024-2047** - [不在以太坊中且不特定于Moonbeam](#non-moonbeam-specific-nor-ethereum-precomiles)的预编译
- **2048-4095** - [Moonbeam特定预编译](#moonbeam-specific-precompiles)

### 以太坊主网预编译 {: #ethereum-mainnet-precompiles }

|                             合约                             |                    地址                    |
| :----------------------------------------------------------: | :----------------------------------------: |
| [ECRECOVER](/builders/tools/precompiles/#verify-signatures-with-ecrecover/) | 0x0000000000000000000000000000000000000001 |
| [SHA256](/builders/tools/precompiles/#hashing-with-sha256/)  | 0x0000000000000000000000000000000000000002 |
| [RIPEMD160](/builders/tools/precompiles/#hashing-with-ripemd-160/) | 0x0000000000000000000000000000000000000003 |
| [Identity](/builders/tools/precompiles/#the-identity-function/) | 0x0000000000000000000000000000000000000004 |
| [Modular Exponentiation](/builders/tools/precompiles/#modular-exponentiation/) | 0x0000000000000000000000000000000000000005 |
| [Bn128Add](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_bn128/struct.Bn128Add.html) | 0x0000000000000000000000000000000000000006 |
| [Bn128Mul](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_bn128/struct.Bn128Mul.html) | 0x0000000000000000000000000000000000000007 |
| [Bn128Pairing](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_bn128/struct.Bn128Pairing.html) | 0x0000000000000000000000000000000000000008 |

### 非Moonbeam特定或以太坊预编译 {: #non-moonbeam-specific-nor-ethereum-precompiles }

|                             合约                             |                    地址                    |
| :----------------------------------------------------------: | :----------------------------------------: |
| [Sha3FIPS256](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_sha3fips/struct.Sha3FIPS256.html) | 0x0000000000000000000000000000000000000400 |
| [Dispatch](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_dispatch/struct.Dispatch.html) | 0x0000000000000000000000000000000000000401 |
| [ECRecoverPublicKey](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_simple/struct.ECRecoverPublicKey.html) | 0x0000000000000000000000000000000000000402 |

### Moonbeam特定预编译 {: #moonbeam-specific-precompiles }

=== "Moonbeam"
    |                                                          合约                                                           |                     地址                      |
    |:---------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------:|
    |  [Parachain Staking](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)  |    {{networks.moonbeam.precompiles.staking}}     |
    | [Crowdloan Rewards](https://github.com/PureStake/moonbeam/blob/master/precompiles/crowdloan-rewards/CrowdloanInterface.sol) |   {{networks.moonbeam.precompiles.crowdloan }}   |
    |                [Xtokens](https://github.com/PureStake/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol)                 |    {{networks.moonbeam.precompiles.xtokens}}     |
    |        [Relay Encoder](https://github.com/PureStake/moonbeam/blob/master/precompiles/relay-encoder/RelayEncoder.sol)        | {{networks.moonbeam.precompiles.relay_encoder}}  |
    |      [XCM Transactor](https://github.com/PureStake/moonbeam/blob/master/precompiles/xcm_transactor/XcmTransactor.sol)       | {{networks.moonbeam.precompiles.xcm_transactor}} |
    |  [Author Mapping](https://github.com/PureStake/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol)  | {{networks.moonbeam.precompiles.author_mapping}} |

=== "Moonriver"
    |                                                          合约                                                           |                     地址                      |
    |:---------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------:|
    |  [Parachain Staking](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)  |    {{networks.moonriver.precompiles.staking}}     |
    | [Crowdloan Rewards](https://github.com/PureStake/moonbeam/blob/master/precompiles/crowdloan-rewards/CrowdloanInterface.sol) |   {{networks.moonriver.precompiles.crowdloan }}   |
    |         [ERC-20 Interface](https://github.com/PureStake/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol)          |     {{networks.moonriver.precompiles.erc20 }}     |
    |     [Democracy](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol)      |   {{networks.moonriver.precompiles.democracy}}    |
    |                [Xtokens](https://github.com/PureStake/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol)                 |    {{networks.moonriver.precompiles.xtokens}}     |
    |        [Relay Encoder](https://github.com/PureStake/moonbeam/blob/master/precompiles/relay-encoder/RelayEncoder.sol)        | {{networks.moonriver.precompiles.relay_encoder}}  |
    |      [XCM Transactor](https://github.com/PureStake/moonbeam/blob/master/precompiles/xcm_transactor/XcmTransactor.sol)       | {{networks.moonriver.precompiles.xcm_transactor}} |
    |  [Author Mapping](https://github.com/PureStake/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol)  | {{networks.moonriver.precompiles.author_mapping}} |

=== "Moonbase Alpha"
    |                                                          合约                                                           |                     地址                      |
    |:---------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------:|
    |  [Parachain Staking](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)  |    {{networks.moonbase.precompiles.staking}}     |
    | [Crowdloan Rewards](https://github.com/PureStake/moonbeam/blob/master/precompiles/crowdloan-rewards/CrowdloanInterface.sol) |   {{networks.moonbase.precompiles.crowdloan }}   |
    |         [ERC-20 Interface](https://github.com/PureStake/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol)          |     {{networks.moonbase.precompiles.erc20 }}     |
    |     [Democracy](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol)      |   {{networks.moonbase.precompiles.democracy}}    |
    |                [Xtokens](https://github.com/PureStake/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol)                 |    {{networks.moonbase.precompiles.xtokens}}     |
    |        [Relay Encoder](https://github.com/PureStake/moonbeam/blob/master/precompiles/relay-encoder/RelayEncoder.sol)        | {{networks.moonbase.precompiles.relay_encoder}}  |
    |      [XCM Transactor](https://github.com/PureStake/moonbeam/blob/master/precompiles/xcm_transactor/XcmTransactor.sol)       | {{networks.moonbase.precompiles.xcm_transactor}} |
    |  [Author Mapping](https://github.com/PureStake/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol)  | {{networks.moonbase.precompiles.author_mapping}} |

