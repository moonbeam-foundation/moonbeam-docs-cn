---
title: Moonbeam收集人要求
description: 了解在Moonbeam网络上成为收集人和维护收集人节点的要求，包括对硬件、绑定等的要求。
---

# 收集人要求

## 概览 {: #introduction } 

在开始运行收集人节点之前您需要了解一些基本要求。首先，您需要遵循社区准则并满足技术要求。您需要拥有高配硬件设备、安全创建且存储的账户、满足绑定数量要求以及完成收集人问卷调查。

在Moonbeam或Moonriver这类生产网络上开始收集活动之前，建议您先在Moonbase Alpha测试网络上进行操作，完成所有的必备要求。

本教程将引导您完成所有成为收集人的基本要求，以便您可以随时启动并运行您的节点。

## 社区准则 {: #community-guidelines }

Moonbeam基金会首要目标之一是维护Moonriver和Moonbeam网络的去中心化。为进一步实现这一目标，Moonbeam基金会将对以下任何情况发生时保留采取行动的权利：

- 任何实体在任一网络运行超过4个收集人
- 收集人以不法手段对待社区或其他收集人

另外，对社区和网络具有一定程度的投入和付出是获得社区信任和吸引更多社区成员所不可或缺的。以下包含一些可以为社区作出贡献的建议：

- 在社区保持活跃度
    - [加入Discord](/node-operators/networks/collators/overview/#join-discord)并自我介绍，若需要可随时更新，以及帮助支持社区成员或其他收集人
- 创建教程和教学性内容
- [成为Moonbeam大使](https://moonbeam.network/community/ambassadors/){target=_blank}
- 贡献与生态系统相关的开源软件
- 积极参与治理和投票

## 硬件设备要求 {: #hardware-requirements } 

收集人必须运行带有收集选项的全节点。您可遵循[运行节点](/node-operators/networks/run-a-node/overview/)的教程以及[使用Systemd](/node-operators/networks/run-a-node/systemd/)的安装步骤进行操作。请确保您为收集人使用特定代码段。

!!! 注意事项
    运行一个**收集人**节点对CPU的要求高于本教程上述所提供的要求。为了使您的收集人节点能够跟上高交易吞吐量，具有高时钟速度和单核性能的CPU非常重要，因为区块生产/导入过程几乎完全是单线程的。因为Docker将对性能产生重大影响，因此也不建议在Docker中运行收集人节点。

从硬件设备角度来看，拥有高配硬件设备至关重要，这能够加快区块生产并使收益最大化。以下是一些表现良好并提供最佳结果的硬件设备推荐：

- **Recommended CPUs** - Intel Xeon E-2386/2388 or Ryzen 9 5950x/5900x
- **Recommended NVMe** - 1 TB NVMe
- **Recommended RAM** - 32 GB RAM

另外，您还需注意以下因素：

- 因为绝大部分云服务提供商更关注于多线程性能而非单线程性能，所以建议使用裸机提供商
- 您需要在不同数据库和国家的主裸机服务器和备份裸机服务器，Hetzner适用于这些服务器，但是不能同时用于两种服务器
- 您的Moonbeam服务器仅供Moonbeam使用，请勿与其他App共享同一个服务器

## 账户要求 {: #account-requirements } 

和波卡（Polkadot）验证人相似，收集人也需要创建账户。Moonbeam使用的是拥有私钥的H160账户或以太坊式账户。作为收集人，您有责任正确管理您的私钥，否则将导致资产丢失。

目前有很多以太坊钱包可供使用，但出于生产目的，建议您尽可能安全地生成密钥以及备份密钥。您可以通过一种名为Moonkey的工具使用Moonbeam二进制文件生成密钥。Moonkey可以用于生成以太坊式账户和Substrate式账户。

要安全地生成密钥，建议在实体隔离的设备下进行操作。成功生成密钥后，请确保您安全存储密钥。以下有一些存储密钥的方式（安全性从上到下逐渐增强）

- 写下并妥善保管您的密钥
- 将您的密钥刻在金属板上
- 使用类似[Horcrux](https://gitlab.com/unit410/horcrux){target=_blank}工具对密钥进行分片

但是我们还是建议您提前做好研究，使用您认为值得信赖的工具。

### 开始使用Moonkey {: #getting-started-with-moonkey } 

首先是从GitHub上获取Moonkey二进制文件。您可以下载二进制文件（在Linux/Ubuntu上进行测试）：

`https://github.com/PureStake/moonbeam/releases/download/v0.8.0/moonkey`

下载该工具后，确保您拥有正确的访问权限以执行二进制文件。接下来，通过检查已下载的文件哈希确认是否为正确版本。

对于基于Linux系统，如Ubuntu，打开终端，并前往Moonkey二进制文件所在的文件夹。您可以在此处使用sha256sum工具来计算SHA256哈希：

```
019c3de832ded3fccffae950835bb455482fca92714448cc0086a7c5f3d48d3e
```

在您成功验证哈希后，建议将二进制文件移到实体隔离（即无网络接口）的设备中。您也可以直接在实体隔离的设备中查看文件的哈希。

### 使用Moonkey生成账户 {: #generating-an-account-with-moonkey } 

Moonkey二进制文件使用起来非常简单，您只需执行二进制，所有与新创建账户的相关信息都会显示。

具体信息包括：

- **助记词** —— 由24个单词组成。助记词可以直接访问您的资金，请确保您安全存储这些单词
- **私钥** —— 与账户相关联的私钥，用于交易签署。私钥是助记词的派生，能够直接访问您的资金，请确保您安全存储
- **公共地址** —— 您账户的地址
- **派生路径** —— 说明分层确定性（HD）钱包如何派生特定密钥

!!! 注意事项
    请安全储存您的私钥/助记词，切勿将其分享给任何人。私钥/助记词将直接访问您的资金。

建议您在实体隔离的设备中使用二进制文件。

### 其他Moonkey功能 {: #other-moonkey-features } 

Moonkey也提供一些其他的功能，具体如下所示：

- `-help` – 显示帮助信息
- `-version` – 显示您所运行的Moonkey版本
- `-w12` – 生成12个单词的助记词（默认为24个）

还有以下可用选项：

- `-account-index` – 提供要在派生路径中使用的帐户索引
- `-mnemonic` – 提供助记词

## 绑定数量要求 {: #bonding-requirements } 

作为收集人您需要知道两个绑定数量：一个是加入收集人池的绑定数量，另一个是密钥关联的绑定数量。

### 最低收集人绑定数量 {: #minimum-collator-bond }

首先，您需要拥有最低Token质押量（即收集人自身绑定的最低数量）才有资格成为候选收集人。只有一定数量的总质押量（包括收集人自身绑定的数量和委托的质押量）排名靠前的候选收集人才会进入收集人有效集。

=== "Moonbeam"
    |       变量       |                            值                             |
    |:----------------:|:---------------------------------------------------------:|
    | 最低自身绑定数量 |     {{ networks.moonbeam.staking.min_can_stk }}枚GLMR     |
    |    有效集上限    | {{ networks.moonbeam.staking.max_candidates }}名collators |

=== "Moonriver"
    |       变量       |                             值                             |
    |:----------------:|:----------------------------------------------------------:|
    | 最低自身绑定数量 |     {{ networks.moonriver.staking.min_can_stk }}枚MOVR     |
    |    有效集上限    | {{ networks.moonriver.staking.max_candidates }}名collators |

=== "Moonbase Alpha"
    |       变量       |                            值                             |
    |:----------------:|:---------------------------------------------------------:|
    | 最低自身绑定数量 |     {{ networks.moonbase.staking.min_can_stk }}枚DEV      |
    |    有效集上限    | {{ networks.moonbase.staking.max_candidates }}名collators |


### 密钥关联绑定数量 {: #key-association-bond }

其次，您将需要为密钥关联绑定数量。当[映射author ID](/node-operators/networks/collators/account-management){target=_blank}（会话密钥）与您的帐户获取区块奖励时，将发送绑定数量，并且该绑定数量是根据的author ID注册的。

=== "Moonbeam"
    |     变量     |                           值                            |
    |:------------:|:-------------------------------------------------------:|
    | 最低绑定数量 | {{ networks.moonbeam.staking.collator_map_bond }}枚GLMR |

=== "Moonriver"
    |     变量     |                            值                            |
    |:------------:|:--------------------------------------------------------:|
    | 最低绑定数量 | {{ networks.moonriver.staking.collator_map_bond }}枚MOVR |

=== "Moonbase Alpha"
    |     变量     |                           值                           |
    |:------------:|:------------------------------------------------------:|
    | 最低绑定数量 | {{ networks.moonbase.staking.collator_map_bond }}枚DEV |

## 收集人问卷调查 {: #collator-questionnaire }

[收集人问卷调查](https://docs.google.com/forms/d/e/1FAIpQLSfjmcXdiOXWtquYlBhdgXBunCKWHadaQCgPuBtzih1fd0W3aA/viewform)旨在评估所有收集人在Moonbase Alpha上状态。因此，在填写此表格之前，您需要先在Moonbase Alpha上运行一个收集人节点。您将需要在表格中提供您的联系方式和一些基本的硬件设备规格。这将提供一种能与Moonbeam团队沟通的方式，以便在您的节点无法正常运行时能及时与您取得联系。
