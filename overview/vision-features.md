---
title: Vision
标题：愿景
description: Moonbeam is designed to enable a multi-chain future, where users and assets can move freely across many specialized and heterogenous chains.
描述：Moonbeam是为了跨链而设计的，用户和资产可以在许多专门的和异构的链上自由移动。

---

# Our Vision for Moonbeam
# Moonbeam愿景

We believe in a multi-chain future with many chains, and many users and assets on those chains. In this context, we have created Moonbeam: a smart contract platform that provides an Ethereum-compatible environment for building decentralized applications. Moonbeam was designed to serve these new kinds of assets and users that exist across two or more chains.

我们相信未来会存在很多的链，用户和资产都会在这些链上。在此背景下，我们创建了Moonbeam:一个智能合约平台，为构建去中心化应用程序提供了一个与以太坊兼容的环境。Moonbeam旨在服务于这些跨两个或多个链的新型资产和用户。

Existing smart contract platforms are designed to service the users and assets on a single, specific chain.  By providing cross-chain smart contract functionality, Moonbeam allows developers to shift existing workloads and logic to Moonbeam and extend the reach of their applications to new users and assets on other chains.

现有的智能合约平台旨在为单个特定链上的用户和资产提供服务。通过提供跨链智能合约功能，Moonbeam允许开发人员将现有的产品转移到Moonbeam，并将其应用程序的范围扩展到其他链上的新用户和资产。

Moonbeam's cross-chain integration is accomplished by becoming a [parachain](/resources/glossary/#parachains) on the Polkadot network.  The [Polkadot network](/resources/glossary/#polkadot) provides integration and connectivity between parachains that are connected to the network and to other non-Polkadot-based chains, such as Ethereum and Bitcoin, via bridges.

Moonbeam的跨链整合是通过成为Polkadot网络上的[旁链](/resources/glossary/#旁链)来完成的。[Polkadot network](/resources/glossary/# Polkadot)提供了连接到网络和其他非Polkadot链(如以太坊和比特币)之间的集成和连接。

## Who Benefits From Moonbeam
## 谁比较适合使用Moonbeam

There are three main audiences who can most benefit from Moonbeam's cross-chain functionality:
从Moonbeam的跨链功能中获益最多的主要用户有三种:

###Existing Ethereum-Based Projects
Projects that are struggling with cost and scalability challenges on Ethereum can use Moonbeam to: 

 - Move portions of their existing workloads and state off of Ethereum Layer 1 with minimal required changes.  
 - Implement a hybrid approach, where applications live on both Ethereum and Moonbeam simultaneously.  
 - Extend their reach to the Polkadot network and other chains that are connected to Polkadot.  

###Polkadot Ecosystem Projects
Ecosystem projects that need smart contract functionality can use Moonbeam to:  

 - Augment their existing parachains and parathreads.  
 - Add new functionality that is needed but not included on the main [Polkadot Relay Chain](/resources/glossary/#relay-chain). For example, they could create a place where teams can crowdfund their projects, implement lockdrops, and process other, more complex financial transactions than are provided by base [Substrate](/resources/glossary/#substrate) functionality.  
 - Leverage the mature and extensive Ethereum development toolchain.  

###Developers of New DApps
Individuals and teams that want to try building on Polkadot can use Moonbeam to: 

 - Leverage the specialized functionality from Polkadot parachains while reaching users and assets on other chains.  
 - Compose functionality from Polkadot parachains by using Moonbeam as a lightweight integration layer that aggregates network services before presenting them to end users. Implementing a composed service using pre-built integrations on a smart contract platform will be a lot faster and easier (in many cases) than building a full Substrate runtime and performing the integrations yourself in the runtime.  

##Key Features and Functionality  
##关键特性和功能
Moonbeam achieves these goals with the following key features:  
Moonbeam通过以下特点实现目标:

 - **Decentralized and Permissionless** , providing a base requirement for censorship resistance and support for many existing and future DApp use cases.  
 - **去中心化和无权限的**，为抵制审查提供基本要求，并支持许多现有和未来的DApp用例。

 - **Contains a Full EVM Implementation** , enabling Solidity-based smart contracts to be migrated with minimal change and with expected execution results.  
- **包含完整的EVM实现**，尽可能少的调整基于solidy开发的智能合约，在迁移后依然可以运行。

 - **Implements the Web3 RPC API** so that existing DApp front-ends can be migrated with minimal change required, and so existing Ethereum-based tools, such as Truffle, Remix, and MetaMask, can be used without modification against Moonbeam.  
- **实现了Web3 RPC API**，使现有的DApp前端可以通过最小的更改进行迁移，因此现有的基于以太坊的工具，如Truffle、Remix和MetaMask，可以使用而不需要对Moonbeam进行修改。

 - **Compatible with the Substrate Ecosystem Toolset** , including block explorers, front-end development libraries, and wallets, allowing developers and users to use the right tool for what they are trying to accomplish.  
- **兼容基板生态系统工具集**，包括块探索者，前端开发库，和钱包，允许开发人员和用户使用正确的工具，他们试图完成的。

 - **Native Cross-Chain Integration** via the Polkadot network and via token bridges, which allows for token movement, state visibility, and message passing with Ethereum and other chains. 
 - **本机跨链集成**通过polkdot网络和令牌桥接，允许令牌移动、状态可见性和与以太坊和其他链的消息传递。 

 - **On-Chain Governance** to allow stakeholders to quickly and forklessly evolve the base protocol according to developer and community needs.  
 - **链上治理**允许涉众根据开发人员和社区的需要快速和叉式地发展基础协议。

This unique combination of elements fills a strategic market gap, while allowing Moonbeam to address future developer needs as the Polkadot network grows over time.  Building your own chain with Substrate is powerful, but also comes with a number of additional responsibilities, such as learning and implementing the chain’s runtime in Rust, creating a token economy, and incentivizing a community of node operators.
这种独特的元素组合填补了战略市场空白，同时也让Moonbeam能够满足未来随着Polkadot网络的发展而增长的开发者需求。使用基板构建自己的链是很强大的，但也伴随着一些额外的责任，例如在Rust中学习和实现链的运行时，创建令牌经济，并激励节点运营商社区。

For many developers and projects, an Ethereum-compatible smart contract approach will be much simpler and faster to implement.  And by building these smart contracts on Moonbeam, developers can still integrate with other chains and get value from Polkadot-based network effects.

对于许多开发人员和项目来说，与以太坊兼容的智能合约方法实现起来要简单得多，也快得多。通过在Moonbeam上构建这些智能合约，开发者仍然可以与其他链进行整合，并从基于polkadoo的网络效应中获得价值。
