---
title: 运行节点
description: 了解为Moonbeam网络运行平行链全节点以便您拥有自己的RPC端点或生成区块的所有必要细节。
---

# 在Moonbeam上运行节点

## 概览 {: #introduction }

在基于Moonbeam的网络运行一个全节点使您能够连接至网络，与bootnode节点同步，获得RPC端点的本地访问，在平行链上创建区块，以及更多其他不同的功能。

Moonbeam拥有多种不同的部署渠道，包含Moonbase Alpha测试网，Kusama上的Moonriver，以及波卡（Polkadot）上的Moonbeam。以下是网络的环境名称以及其对应的[区块链参数文档](https://substrate.dev/docs/en/knowledgebase/integrate/chain-spec)名称：

|      网络      |       托管方        |             区块链名称              |
|:--------------:|:-------------------:|:-----------------------------------:|
| Moonbase Alpha | Moonbeam Foundation | {{ networks.moonbase.chain_spec }}  |
|   Moonriver    |       Kusama        | {{ networks.moonriver.chain_spec }} |
|    Moonbeam    |      Polkadot       | {{ networks.moonbeam.chain_spec }}  |

!!! 注意事项
    Moonbase Alpha仍被视为是一个Alpha网络，因此其正常运行时间_不会_达到100%。平行链将不时地进行清理。在开发自己的应用程序时，请确保您已采取预案快速地将合约与账户重新部署到新的平行链。[Discord channel](https://discord.gg/PfpUATX)会至少提前24小时发布清理区块链的通知。

## 需求 {: #requirements }

运行平行链节点和Substrate节点大致相似，但仍存在一些差异。Substrate平行链节点将会是较大的工程，因为其包含平行链本身以及与中继链同步的代码，还有促进两者之间的交互同步。因此，这项工程相对较大，需要30分钟和32GB的存储空间。

下表列出了运行节点所需的最低建议参数。随着网络的发展，在Kusama和波卡（Polkadot）主网上的部署对磁盘的要求将会更高。

=== "Moonbeam"
    |        组件         |                                                最低参数要求                                                 |
    |:-------------------:|:-----------------------------------------------------------------------------------------------------------:|
    | **CPU 中央处理器**  |                            {{ networks.moonbeam.node.cores }}核（最快单核速度）                             |
    |    **RAM 内存**     |                                     {{ networks.moonbeam.node.ram }} GB                                     |
    |  **SSD 固态硬盘**   |                                 {{ networks.moonbeam.node.hd }} TB（推荐）                                  |
    | **Firewall 防火墙** | P2P端口必须向流入流量开放：<br>&nbsp; &nbsp; - 来源：任何来源<br>&nbsp; &nbsp; - 目标地址：30333, 30334 TCP |

=== "Moonriver"
    |        组件         |                                                最低参数要求                                                 |
    |:-------------------:|:-----------------------------------------------------------------------------------------------------------:|
    | **CPU 中央处理器**  |                            {{ networks.moonriver.node.cores }}核（最快单核速度）                            |
    |    **RAM 内存**     |                                    {{ networks.moonriver.node.ram }} GB                                     |
    |  **SSD 固态硬盘**   |                                 {{ networks.moonriver.node.hd }} TB（推荐）                                 |
    | **Firewall 防火墙** | P2P端口必须向流入流量开放：<br>&nbsp; &nbsp; - 来源：任何来源<br>&nbsp; &nbsp; - 目标地址：30333, 30334 TCP |

=== "Moonbase Alpha"
    |        组件         |                                                最低参数要求                                                 |
    |:-------------------:|:-----------------------------------------------------------------------------------------------------------:|
    | **CPU 中央处理器**  |                            {{ networks.moonbase.node.cores }}核（最快单核速度）                             |
    |    **RAM 内存**     |                                     {{ networks.moonbase.node.ram }} GB                                     |
    |  **SSD 固态硬盘**   |                                 {{ networks.moonbase.node.hd }} TB（推荐）                                  |
    | **Firewall 防火墙** | P2P端口必须向流入流量开放：<br>&nbsp; &nbsp; - 来源：任何来源<br>&nbsp; &nbsp; - 目标地址：30333, 30334 TCP |

!!! 注意事项
    如果在节点运行时没有看到`Imported`消息（没有`[Relaychain]`标签），您可能需要重新检查端口配置。

## 运行端口 {: #running-ports }

如上所述，中继链/平行链节点将从多个端口获取信息。默认Substrate端口用于平行链，而中继链则获取下一个更高端口的消息。

只有指定P2P端口才需要对流入流量开放。**收集人节点不可以开放任何WS或RPC端口。**

--8<-- 'text/node-operators/client-changes.md'

### 平行链全节点的默认端口 {: #default-ports-for-a-parachain-full-node }

|      描述      |                端口                 |
|:--------------:|:-----------------------------------:|
|    **P2P**     | {{ networks.parachain.p2p }} (TCP)  |
|  **RPC & WS**  |     {{ networks.parachain.ws }}     |
| **Prometheus** | {{ networks.parachain.prometheus }} |

### 嵌入式中继链默认端口 {: #default-ports-of-embedded-relay-chain }

|      描述      |                 端口                  |
|:--------------:|:-------------------------------------:|
|    **P2P**     | {{ networks.relay_chain.p2p }} (TCP)  |
|  **RPC & WS**  |     {{ networks.relay_chain.ws }}     |
| **Prometheus** | {{ networks.relay_chain.prometheus }} |

## 安装指引 {: #installation }

以下有两个不同的教程帮助您运行一个基于Moonbeam的节点：

- [使用Docker](/node-operators/networks/run-a-node/docker)：此方法提供您一个快速简便的方式开始使用Docker容器
- [使用Systemd](/node-operators/networks/run-a-node/systemd)：此方法适用于有编译Substrate节点经验的人

## Debug、Trace和TxPool API {: #debug-trace-txpool-apis }

您也可以通过运行追踪节点访问一些非标准RPC方式的权限，这将允许开发者在runtime期间检查和调试交易事件。与标准Moonbase Alpha，Moonriver，或Moonbeam节点相比，追踪节点使用的是不同的Docker镜像。

请查看[运行追踪节点](/builders/build/eth-api/debug-trace)的操作指南并确保在操作过程中已切换至正确网络。随后，通过您的追踪节点访问非标准RPC方法，详情请查看[Debug & Trace](/builders/tools/debug-trace)指南。

## 日志和故障排除 {: #logs-and-troubleshooting }

您将看到中继链和平行链的所有日志。中继链将以`[Relaychain]`为前缀，而平行链没有。

### P2P端口暂未开放 {: #p2p-ports-not-open }

如果您没有看到`Imported`消息（没有`[Relaychain]`标签），则需要重新检查P2P端口配置。P2P端口必须向流入流量开放。

### 同步 {: #in-sync }

两个区块链必须保持随时同步。在正常情况下您能够看到`Imported`或`Idle`消息，以及已连接的其他节点。

### 创世错配 {: #genesis-mismatching }

Moonbase Alpha测试网会频繁进行升级。因此，您可能会看到以下消息：

```text
DATE [Relaychain] Bootnode with peer id `ID` is on a different
chain (our genesis: GENESIS_ID theirs: OTHER_GENESIS_ID)
```

这个消息通常意味着您运行的版本已经过旧，需要进行升级。

每次升级（以及相应的区块链清理）我们都将提前至少24小时通过[Discord channel](https://discord.gg/PfpUATX)通知。

由于节点的启动方式不同，清除区块链链数据的指引也会有所不同：

  - 对于Docker，您可以查看[使用Docker](/node-operators/networks/run-a-node/docker)页面的[清除节点](/node-operators/networks/run-a-node/docker/#purge-your-node)部分
  - 对于Systemd，您可以查看[使用Systemd](/node-operators/networks/run-a-node/systemd)页面的[清除节点](/node-operators/networks/run-a-node/systemd/#purge-your-node)部分