---
title: 运行收集人节点
description: 关于运行节点后如何深入了解并成为Moonbeam网络中收集人的说明
---

# 在Moonbeam上运行收集人

## 概览 {: #introduction }

收集人是网络的其中一员，其职责是维护他们所参与的平行链。他们运行一个全节点（针对他们特定的平行链和中继链），并为中继链验证者生成状态转换证明。

成为候选收集人之前，您还需要考虑一些额外的[要求](/node-operators/networks/collators/requirements/){target=_blank}，包括硬件设备、绑定数量和账户要求。

拥有最低Token质押量（即收集人自身绑定的最低数量）的收集人才有资格成为候选收集人。只有一定数量的总质押量（包括收集人自身绑定的数量和委托的质押量）排名靠前的候选收集人才会进入收集人有效集。反之，收集人将留在候选收集人池中。

候选人进入收集人有效集后才有资格生产区块。

Moonbeam使用[Nimbus平行链共识框架](/learn/features/consensus/){target=_blank}，通过一个两步过滤器将候选人分配到收集人有效集，随后再分配到区块生产插槽：

 - 平行链质押过滤器根据每个网络中的Token质押量挑选排名靠前的候选人。每个网络候选人的具体排名数量，请参考文档网页的[最低收集人绑定数量](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=_blank}部分。这个过滤后的池被称为“精选候选人池”（即收集人有效集）。每一轮这个池中的候选人都会进行更新
 - 固定规模子集过滤器为每个块生产槽选出的候选者挑选伪随机子集

用户可以在Moonbeam、Moonriver和Moonbase Alpha网络上启动全节点，并激活`collate`功能作为候选收集人参与生态系统。您可以查看文档网页的[运行节点](/node-operators/networks/run-a-node/){target=_blank}部分选择使用[Docker](/node-operators/networks/run-a-node/docker/){target=_blank}或[Systemd](/node-operators/networks/run-a-node/systemd/){target=_blank}启动节点。

## 加入Discord {: #join-discord }

对于收集人，实时获取配置的更新和更改至关重要。如果您的节点出现任何问题，及时与我们取得联系也相当重要，反之亦然，因为这不仅会对收集人和委托人的奖励产生负面影响，同样也会对网络产生负面影响。

出于此目的，我们使用[Discord](https://discord.com/invite/moonbeam){target=_blank}渠道。与收集人相关的Discord频道如下所示：

 - **tech-upgrades-announcements** —— 此频道将发布收集人需要遵循的相关配置更新或更改。以及任何需要注意的技术问题，例如网络卡顿
 - **collators** —— 收集人讨论频道。这是一个活跃和友好的收集人社区，如果您有任何问题，可以随时在此频道询问。如果需要收集人注意的问题，我们也将在此频道邀请收集人进行回复
 - **meet-the-collators** —— 您可以在此频道向所有潜在委托人进行自我介绍

加入Discord后，欢迎您随时私信*gilmouta*或*artkaseman*介绍自己。这方便我们了解您，如您的节点有问题，可以随时与我们取得联系。另外，我们也将分配相关的Discord收集人角色，使您能够在*meet-the-collators*频道发布消息。
