---
title: 快速开始操作
description: 在Moonbeam上开始开发、部署和与智能合约交互所需要知道的一切。
---

# 在Moonbeam上开发的快速入门指南

## 概览 {: #overview }

Moonbeam是波卡上完全兼容以太坊的智能合约平台。如此一来，您可以通过[以太坊API](/builders/build/eth-api/){target=\_blank}和[Substrate API](/builders/build/substrate-api/){target=\_blank}与Moonbeam交互。

尽管Moonbeam是一个基于Substrate的平台，但是Moonbeam使用[统一账户](/learn/features/unified-accounts){target=\_blank}系统，将Substrate格式的账户和密钥替换成以太坊格式的账户和密钥。因此，您可以通过简单添加Moonbeam的网络配置，使用Moonbeam账户与[MetaMask](/tokens/connect/metamask){target=\_blank}、[Ledger](/tokens/connect/ledger/){target=\_blank}和其他兼容以太坊的钱包交互。同样地，您可以使用以太坊[代码库](/builders/build/eth-api/libraries/){target=\_blank}和[开发环境](/builders/build/eth-api/dev-env/){target=\_blank}在Moonbeam上开发。

## Moonbeam网络 {: #moonbeam-networks }

要开始在Moonbeam上开发，您需要了解Moonbeam生态系统中各个网络的基本信息。

|                                           网络                                           |   网络类型    |                        中继链                         | 原生资产符号 | 原生资产小数位数 |
|:----------------------------------------------------------------------------------------:|:-------------:|:-----------------------------------------------------:|:------------:|:----------------:|
|           [Moonbeam](/builders/get-started/networks/moonbeam){target=\_blank}            |    MainNet    | [Polkadot](https://polkadot.network/){target=\_blank} |     GLMR     |        18        |
|          [Moonriver](/builders/get-started/networks/moonriver){target=\_blank}           |    MainNet    |   [Kusama](https://kusama.network/){target=\_blank}   |     MOVR     |        18        |
|        [Moonbase Alpha](/builders/get-started/networks/moonbase){target=\_blank}         |    TestNet    |                    Alphanet relay                     |     DEV      |        18        |
| [Moonbeam Development Node](/builders/get-started/networks/moonbeam-dev){target=\_blank} | Local TestNet |                         None                          |     DEV      |        18        |

!!! 注意事项
    Moonbeam开发节点没有中继链，因其目的是成为您自己的个人开发环境，您无需通过中继链，便可在其中快速开始开发。

### 网路配置 {: #network-configurations }

使用开发者工具时，根据工具的不同，您可能需要配置Moonbeam与网络交互。为此，您可以使用以下信息：

=== "Moonbeam"

    |      变量       |                                                                         值                                                                          |
    |:---------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------:|
    |    Chain ID     |                                                  <pre>```{{ networks.moonbeam.chain_id }}```</pre>                                                  |
    | Public RPC URLs | <pre>```https://moonbeam.public.blastapi.io```</pre>  <pre>```https://moonbeam-mainnet.gateway.pokt.network/v1/lb/629a2b5650ec8c0039bb30f0```</pre> |
    | Public WSS URLs |                                                 <pre>```wss://moonbeam.public.blastapi.io```</pre>                                                  |

=== "Moonriver"

    |      变量       |                                                                          值                                                                           |
    |:---------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |    Chain ID     |                                                  <pre>```{{ networks.moonriver.chain_id }}```</pre>                                                   |
    | Public RPC URLs | <pre>```https://moonriver.public.blastapi.io```</pre>  <pre>```https://moonriver-mainnet.gateway.pokt.network/v1/lb/62a74fdb123e6f003963642f```</pre> |
    | Public WSS URLs |                                                  <pre>```wss://moonriver.public.blastapi.io```</pre>                                                  |

=== "Moonbase Alpha"

    |      变量       |                                                      值                                                      |
    |:---------------:|:------------------------------------------------------------------------------------------------------------:|
    |    Chain ID     |                              <pre>```{{ networks.moonbase.chain_id }}```</pre>                               |
    | Public RPC URLs | <pre>```https://moonbase-alpha.public.blastapi.io```</pre>  <pre>```{{ networks.moonbase.rpc_url }}```</pre> |
    | Public WSS URLs |  <pre>```wss://moonbase-alpha.public.blastapi.io```</pre>  <pre>```{{ networks.moonbase.wss_url }}```</pre>  |

=== "Moonbeam开发节点"

    |     变量      |                          值                          |
    |:-------------:|:----------------------------------------------------:|
    |   Chain ID    | <pre>```{{ networks.development.chain_id }}```</pre> |
    | Local RPC URL | <pre>```{{ networks.development.rpc_url }}```</pre>  |
    | Local WSS URL | <pre>```{{ networks.development.wss_url }}```</pre>  |

!!! 注意事项
    您可以从[支持的RPC提供商](/builders/get-started/endpoints/#endpoint-providers){target=\_blank}之一创建适合开发或生产的端点。

### 区块浏览器 {: #explorers }

Moonbeam提供两种不同类型的浏览器：一种是查询以太坊API，另一种专用于Substrate API。所有基于EVM的交易可以通过以太坊API访问，其中Substrate API可以依赖于Substrate原生功能，例如治理、质押和一些基于EVM交易的信息。关于每个浏览器的更多信息，请查阅[区块浏览器](/builders/get-started/explorers){target=\_blank}页面。

--8<-- 'text/builders/get-started/explorers/explorers.md'

## 注资测试网账户 {: #testnet-tokens }

要开始在测试网上开发，您将需要向您的账户注入一些DEV Token以发送交易。请注意，DEV Token并无真实价值，仅用于测试目的。

|                                          测试网                                          |                                                                      从哪里获取Token                                                                      |
|:----------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------:|
|        [Moonbase Alpha](/builders/get-started/networks/moonbase){target=\_blank}         | 从[Moonbase Alpha Faucet](https://faucet.moonbeam.network/){target=\_blank}网站。 <br>水龙头会每24个小时分配{{ networks.moonbase.website_faucet_amount }} |
| [Moonbeam Development Node](/builders/get-started/networks/moonbeam-dev){target=\_blank} |        您开发节点附带的 [10个预注资账户](/builders/get-started/networks/moonbeam-dev/#pre-funded-development-accounts){target=\_blank}中的任何一个        |

## 开发工具 {: #development-tools }

因为Moonbeam是一个完全兼容以太坊的Substrate链，因此您可以使用基于Substrate工具和基于以太坊的工具。

### JavaScript 工具 {: #javascript }

=== "Ethereum"
    |                                     工具                                      |      类型       |
    |:-----------------------------------------------------------------------------:|:---------------:|
    |    [Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=\_blank}    |     Library     |
    |      [Web3.js](/builders/build/eth-api/libraries/web3js){target=\_blank}      |     Library     |
    | [OpenZeppelin](/builders/build/eth-api/dev-env/openzeppelin/){target=\_blank} | Dev Environment |
    |        [Remix](/builders/build/eth-api/dev-env/remix){target=\_blank}         | Dev Environment |
    |      [Hardhat](/builders/build/eth-api/dev-env/hardhat){target=\_blank}       | Dev Environment |
    |     [thirdweb](/builders/build/eth-api/dev-env/thirdweb){target=\_blank}      | Dev Environment |
    | [Waffle & Mars](/builders/build/eth-api/dev-env/waffle-mars){target=\_blank}  | Dev Environment |
    | [Scaffold-Eth](/builders/build/eth-api/dev-env/scaffold-eth){target=\_blank}  | Dev Environment |

=== "Substrate"
    |                                       工具                                       |  类型   |
    |:--------------------------------------------------------------------------------:|:-------:|
    | [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api){target=\_blank} | Library |

### Python工具 {: #python }

=== "Ethereum"
    |                                工具                                 |      类型       |
    |:-------------------------------------------------------------------:|:---------------:|
    | [Web3.py](/builders/build/eth-api/libraries/web3py){target=\_blank} |     Library     |
    |   [thirdweb](https://portal.thirdweb.com/python){target=\_blank}    | Dev Environment |

=== "Substrate"
    |                                              工具                                              |  类型   |
    |:----------------------------------------------------------------------------------------------:|:-------:|
    | [Py Substrate Interface](/builders/build/substrate-api/py-substrate-interface){target=\_blank} | Library |
