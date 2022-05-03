---
title: Nimbus平行链共识框架
description: 通过此教程学习了解Moonbeam的Nimbus共识框架以及其作为波卡（Polkadot）共享安全模型的一部分的运作原理
---

# Nimbus平行链共识框架

![Moonbeam Consensus Banner](/images/learn/features/consensus/consensus-banner.png)

## 概览 {: #introduction } 

波卡（Polkadot）依赖于一种[混合共识模型](https://wiki.polkadot.network/docs/learn-consensus)。根据这一方案，区块终结工具以及区块生产机制是分开的。因此，平行链只需要考虑区块生产即可，中继链则负责验证区块状态的转变。

在平行链层面，区块生产者被称为“[收集人](https://wiki.polkadot.network/docs/learn-collator)”，他们通过从用户处收集交易，并向中继链[验证人](https://wiki.polkadot.network/docs/learn-validator)提供区块来维持平行链（如Moonbeam）的运行。

但是对于以下问题，平行链可能需要采取一个无信任且去中心化的方式来加以解决（若可行）：

 - 在网络所有的节点之中，哪些被允许生产区块？
 - 如果多个节点都可以生产区块，那么他们会同时生产区块吗？每次生产区块的节点只有一个，还是有多个？

下面来介绍Nimbus。Nimbus是为基于[Cumulus](https://github.com/paritytech/cumulus)平行链上创建以插槽为基础的共识算法提供框架。Nimbus致力于为这些共识引擎提供组织管理部件的标准化部署，同时为研究开发人员希望定制的元素（过滤器）提供部署协助功能。这些过滤器经过定制后，可以定义区块生产插槽，也可以进行设置，通过几个步骤将区块生产者身份限定于一些「收集人子集」。

例如，Moonbeam就使用了两层结构。第一层由平行链质押过滤器组成，根据质押量排名选择活跃的收集人池；第二层增加了一个过滤器，进一步缩小每一个插槽的「收集人子集」的规模。

请注意，Nimbus只能选出在下一个可用插槽中有资格生产平行链区块的收集人。[Cumulus](https://wiki.polkadot.network/docs/build-pdk#cumulus)共识机制将进行最佳区块标记，而最终（中继链的）[BABE](https://wiki.polkadot.network/docs/learn-consensus#babe)和[GRANDPA](https://wiki.polkadot.network/docs/learn-consensus#grandpa-finality-gadget)混合共识模型会将这个平行链区块发送到中继链上，并最后终结。当中继链分叉在中继链层面完成以后，平行链区块就获得终结。

下面两个小节将介绍Moonbeam目前所使用的过滤策略。

## 平行链质押过滤 {: #parachain-staking-filtering } 

收集人可以通过外部函数直接绑定代币加入候选收集人池。加入候选池后，代币持有者可以通过在平行链层委托增加对该候选人的质押量（也被称为质押）。

平行链质押是Nimbus应用于候选收集人池的两大过滤器中的一个，根据网络中的代币质押量（包括候选人本身绑定的代币数量以及从代币持有者中所获得的提名数量）选出前{{ networks.moonbase.staking.max_candidates }}名的候选人。这个过滤后的池被称为“精选候选池”。这个池中的候选收集人在每一轮都会进行更新（每轮时长为{{ networks.moonbase.staking.round_blocks }}个区块），以下图表展示了在特定一轮中平行链质押过滤过程：

![Nimbus Parachain Staking Filter](/images/learn/features/consensus/consensus-1.png)

这个池还将通过另外一个过滤器，为下一个区块生产插槽返回一个符合资格的「候选人子集」。

如需了解更多质押相关的信息，请访问我们的[质押文档](/learn/features/staking/)。

## 固定规模子集过滤法 {: #fixed-size-subset-filtering } 

平行链质押挖矿过滤器启动应用后，将返回精选出的候选收集人，接下来第二个过滤器将按区块逐个启动应用，进一步选出更少的候选收集人，这些最终获选的收集人将有资格使用下一个区块生产插槽。

总而言之，第二个过滤器将在第一次过滤的基础之上进行伪随机的子集选择。合格率参数是可以调整的，它将决定这一子集的规模。

如果合格率高，将有更多收集人符合区块生产资格，网络错过区块生产插槽的概率就会更小。然而，分配到平行链上的验证人数量有限，这意味着产出的很多区块都无法获得验证人支持。而对于那些受到支持的区块来说，一个验证人所支持的区块越多，意味着中继链需要越长的时间来解决任何可能的分叉，并返回终结的区块。此外，这可能会为某些收集人带来不公平的优势，他们提案的区块能够更快上到中继链验证人，并且获得更高份额的区块奖励（若有）。

相反，如果合格率低，区块终结就会更快，区块生产在收集人之间的分布也会更加平均。然而，如果符合资格的收集人无法提案区块（无论是什么原因），网络都会跳过一个区块，从而影响其稳定性。

子集的规模确定后，收集人就会通过熵源随机选出。目前网络内部采取了“抛硬币”算法，但不久后将转而使用中继链的[随机信标](https://wiki.polkadot.network/docs/learn-randomness)，因此每个中继链区块将对应一个新的且符合资格的「收集人子集」。以下图表描述了在某一轮的某个名为`XYZ`的区块上，其固定规模子集过滤的过程：

![Nimbus Parachain Staking Filter](/images/learn/features/consensus/consensus-2.png)

## 为何选择Nimbus？{: #why-nimbus } 

您可能会问自己：为什么要选择Nimbus？在Moonbeam最初进行开发的时候，我们都没有预料到这一点。但随着Moonbeam日益发展，我们似乎越来越需要一个可定制的且直接了当的平行链共识机制。由于目前的可用模式有一些问题或技术上的限制，这一需求变得越来越明朗。

<!-- In the [relay chain provided consensus](https://github.com/paritytech/cumulus/blob/master/client/consensus/relay-chain/src/lib.rs), each node sees itself as a colator and can propose a parachain candidate block. It is then up to the relay chain to solve any possible forks and finalize a block. 

[AuRa](https://crates.io/crates/sc-consensus-aura) (short for authority-round) consensus mechanism is based on a known list of authorities that take turns to produce blocks in every slot. Each authority can propose only one block per slot and builds on top of the longest chain.-->

有了Nimbus以后，编写平行链共识引擎就像编写一个模块一样简单，这种简单性和灵活性是Nimbus带来的主要价值。

下面我们将来介绍Nimbus带来的一些技术效益。

### 权重和冗余执行 {: #weight-and-extra-execution } 

Nimbus将生产者验证执行代码放在一个[Substrate模块](https://substrate.dev/docs/en/knowledgebase/runtime/pallets)中，看上去似乎为一个区块增加了很多执行负担（和链下验证相比）。但如果从验证人的角度来考虑：

验证人也需要验证区块生产者的身份。通过将区块生产者验证的执行逻辑放在一个模块里，执行时间就可以进行对标，并根据相应的权重进行量化。如果这一执行时间没有计算在内，一个区块就有可能超出中继链的WASM执行极限（目前为0.5秒）。

在实际运行中，这一验证将非常快，执行时间一般不会超过极限。但从理论的角度来看，考虑其权重对于部署任务更好。

### 可重用性 {: #reusability } 

将生产者验证执行放进一个模块里还有另一个好处。与定制的执行器不同，这个单一的执行器可以重新用于在Nimbus框架下的共识机制中。这就是基于插槽的签名算法。

例如，[由中继链提供的共识算法](https://github.com/paritytech/cumulus/blob/master/client/consensus/relay-chain/src/lib.rs) [AuRa](https://crates.io/crates/sc-consensus-aura)和[BABE](https://crates.io/crates/sc-consensus-babe)都有他们自己的定制化执行器，而在Nimbus之中，这些共识机制可以重复使用同一个执行器。通过Nimbus实现的AuRa已经落地，其代码少于100行，充分体现了Nimbus强大的可重用性。

### 热插拔共识机制 {: #hot-swapping-consensus } 

平行链开发团队有时可能需要对共识机制进行修改、调整。如果没有Nimbus插拔共识机制，修改和调整可能需要通过客户端升级和硬分叉才能完成。

而有了Nimbus框架后，编写共识引擎就像编写[Substrate](https://substrate.dev/docs/en/knowledgebase/runtime/pallets)模块一样简单。因此，插拔共识机制也就像模块升级一样简单。

虽然热插拔仍与Nimbus内部的共识引擎（过滤器）绑定，但对于那些仍未选好长远共识机制的团队来说，它也会带来很大帮助。