---
title: 收集人常见问题
description: 关于成为收集人和收集人活动的一些常见问题以及在Moonbeam上运行和操作收集人节点时的注意事项
---

# 常见问题

![Collator FAQ Banner](/images/node-operators/networks/collators/faq-banner.png)

## 概览 {: #introduction }

收集人是其所参与的平行链中必不可少的一个部分。他们接收交易并为中继链验证人创建状态转换证明。

运行Moobeam收集人需要Linux系统管理技能、仔细监控以及对细节的关注。我们整理了一些技巧和窍门，以助您快速开始和运行。

## Q & A

**Q: 我可以在哪里获得帮助？**

**A:** 在[Discord](https://discord.gg/RyVefR79FA){target=_blank}有一个活跃且友好的收集人社区。在您需要帮助之前先加入Discord收集人频道，并介绍自己。私信**PureStake-Gil#0433**或**PureStake-Art#6950** ，并进行自我介绍，负责人会根据您的问题给到相应的解决方案

***

**Q: 我如何获取最新消息？**

**A:** 所有的更新和重要技术信息都将及时更新在[Discord](https://discord.gg/PhfEbKYqak){target=_blank}的**#tech-upgrades-announcements**频道。加入并关注此频道。您也可以根据自身需求，通过Slack或电报群等获取最新消息。

***

**Q: 我如何注册自己的节点？**

**A:** 您可在[此问卷调查表格](https://docs.google.com/forms/d/e/1FAIpQLSfjmcXdiOXWtquYlBhdgXBunCKWHadaQCgPuBtzih1fd0W3aA/viewform){target=_blank}中提交您的联系方式以及一些基本硬件设备。您必须在Moonbase Alpha上运行一个收集人节点后方可填写问卷调查。

***

**Q: 硬件要求有哪些？**

**A:** 运行收集人节点需要高配硬件才能够处理交易并使您的收益最大化。这对于生产区块和奖励是一个非常重要的因素。

在高配裸机上运行systemd服务器（即运行物理服务器，而非云虚拟机或docker容器）。您可以运行自己的服务器，也可以选择服务器提供商来为您管理服务器。

每个裸机每次只能运行一个服务器，请勿同时运行多个服务器。

***

**Q: 运行收集人有什么适合的硬件推荐？**

**A:**

硬件推荐如下所示：

- 高配CPU：
  - Ryzen 9 5950x or 5900x 
  - Intel Xeon E-2386 or E-2388
- 在不同数据库和国家的主裸机服务器和备份裸机服务器，Hetzner可以满足两者
- 不与其他任何App共享的Moonbeam独立服务器
- 1 TB NVMe HDD
- 32 GB RAM 

***

**Q: 如何备份节点？**

**A:** 在不同的国家和服务提供商运行两个同样规格的裸机。如果您的主机出现故障，您可以快速备份您的服务并继续生产区块和获取奖励。请参考以下[故障转移](#:~:text=如果我的主节点关闭，故障转移流程是怎么样的)部分的回答。

***

**Q: 有哪些网络可以选择？** 

**A:** 有三个网络可供选择，每个网络均需要独立硬件设备。Moonbase Alpha测试网是用于测试和熟悉设置，可免费使用。

- **Moonbeam** - 波卡上的生产网络
- **Moonriver** - Kusama上的生产网络 
- **Moonbase Alpha TestNet** - 开发网络

***

**Q: 我的防火墙允许哪些端口？**

**A:** 

- 允许TCP端口上的所有传入请求{{ networks.parachain.p2p }}和{{ networks.relay_chain.p2p }}
- 在TCP端口22上允许来自您的管理IP的请求
- 删除所有其他端口

***

**Q: 是否有CPU优化的二进制文件？** 

**A:** 在每个[版本更新页面](https://github.com/PureStake/moonbeam/releases){target=_blank}都有CPU优化的二进制文件。为您的CPU架构选择二进制文件。

- **Moonbeam-znver3** - Ryzen 9
- **Moonbeam-skylake** - Intel 
- **Moonbeam** - 可用于所有其他CPU

***

**Q: 监控节点有什么推荐？** 

**A:** 监控对于网络的健康和收益最大化至关重要。我们建议使用[Grafana Labs](https://grafana.com){target=_blank}。他们有一个免费的处理层，可以用于处理6个以上的Moonbeam服务器。

***

**Q: 有哪些KPI需要监控？** 

**A:** 主要的关键性能指标是生产的区块。对此prometheus metric被称为`substrate_proposer_block_constructed_count`。

***

**Q: 我应该如何设置警报？**

**A:** 设置警报对于保持您的Moonbeam节点持续生产区块和获取奖励至关重要。我们推荐由[Grafana Labs](https://grafana.com){target=_blank}提供支持的[pagerduty.com](https://www.pagerduty.com/){target=_blank}。使用上述的[KPI查询](#:~:text=substrate_proposer_block_constructed_count)功能并设置数值低于1时发起警报。警报需要7天24小时随时呼叫待命人员。

***

**Q: 什么是Nimbus密钥？**

**A:** Nimbus密钥与[波卡的会话密钥](https://wiki.polkadot.network/docs/learn-keys#session-keys){target=_blank}相似，您的主机和备份机需要有唯一的密钥。将密钥输出保存至安全的地方，确保当您收到警报时可以获取到密钥。您可以参考[会话密钥](/node-operators/networks/collators/account-management/#session-keys){target=_blank}的文档页面创建您的密钥。

***

**Q: 如果我的主节点关闭，故障转移流程是怎么样的？**

**A:** 当主服务器关闭时，执行故障转移到备份服务器的最佳方法是执行密钥相关更新。每个服务器已经有一组唯一的[密钥](#:~:text=什么是Nimbus密钥)。运行`setKeys` author映射extrinsic。您可以遵循[映射Extrinsic](/node-operators/networks/collators/account-management/#mapping-extrinsic){target=_blank}的教程进行修改以使用`setKeys` extrinsic。

***

**Q: 我需要设置中心化日志记录吗？**

**A:** [Grafana Labs](https://grafana.com){target=_blank}也同样可以配置中心化日志记录，这也是我们所推荐的。您可以在同一个地方看到所有的节点记录。[Kibana](https://www.elastic.co/kibana/){target=_blank}提供更强大的中心化日志功能，但是Grafana更为简单，适合初学者。

***

**Q: 我需要在日志中寻找什么？** 

**A:** 日志对于决定您是否完成同步并准备好加入收集人池非常有用。查看日志末尾内容并确定以下内容：

1. 您的中继链是否同步

2. 您的平行链是否同步

当您的节点已经同步，您应该在您的日志中看到**Idle**，如下图所示：

![In sync Relay chain and parachain](/images/node-operators/networks/collators/account-management/account-1.png)

通常会发生一种情况，在您的节点同步之前就加入了收集人池。这种情况下，您将无法生产任何区块或获得任何奖励。请耐心等待，直到您处于同步和空闲状态后再加入候选池。

![Relay chain not in sync yet](/images/node-operators/networks/run-a-node/docker/full-node-docker-2.png)

中继链同步时间远远长于平行链。您将在中继链同步后才能看到最终区块。

***

**Q: 成为收集人的绑定数量是多少？**

**A:** 您需要知道两种绑定数量。请在执行以下步骤前确保您的节点已配置和同步完毕。

第一个是[加入收集人池的绑定数量](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}：

- **Moonbeam** - 最低{{ networks.moonbeam.staking.min_can_stk }}枚GLMR
- **Moonriver** - 最低{{ networks.moonriver.staking.min_can_stk }}枚MOVR
- **Moonbase Alpha** - 最低{{ networks.moonbase.staking.min_can_stk }}枚DEV

第二个是[密钥关联的绑定数量](/node-operators/networks/collators/account-management/#mapping-bonds){target=_blank}：

- **Moonbeam** - 最低{{ networks.moonbeam.staking.collator_map_bond }}枚GLMR
- **Moonriver** - 最低{{ networks.moonriver.staking.collator_map_bond }}枚MOVR
- **Moonbase Alpha** - 最低{{ networks.moonbase.staking.collator_map_bond }}枚DEV

***

**Q: 如何在我的收集人账户设置身份？**  

**A:** 链上设置身份将帮助您识别您的节点并吸引更多委托量。您可以通过[管理身份](/tokens/manage/identity/){target=_blank}文档页面的操作教程设置身份。
