---
title: MetaFab Gaming Toolkit - MetaFab游戏工具包
description: Develop your own blockchain game on Moonbeam using MetaFab! MetaFab streamlines game development with its easy-to-use API and language and framework SDKs.使用MetaFab在Moonbeam上开发您的区块链游戏！MetaFab通过其易用API、语言和SDK架构大幅精简了游戏开发流程。
---

# Build Web3 Games on Moonbeam with MetaFab's Developer Toolkit - 使用MetaFab开发者工具包在Moonbeam上构建Web3游戏

![MetaFab Moonbeam Banner](/images/builders/integrations/gaming/metafab/metafab-banner.png)

## Introduction - 概览 {: #introduction } 

Build frictionless blockchain games with [MetaFab](https://www.trymetafab.com/){target=_blank}’s API, the free, end-to-end, self-serve solution for games and gamified apps to integrate robust blockchain infrastructure in minutes, not months.
任何开发者皆可以使用[MetaFab](https://www.trymetafab.com/){target=_blank}所提供的API构建无摩擦的区块链游戏。MetaFab为一个针对游戏和游戏类应用与区块链基础机构快速集成方面提供免费、端对端且自主使用的解决方案。

## MetaFab on Moonbeam - Moonbeam上的MetaFab {: #metafab-on-moonbeam } 

Game developers within the Moonbeam ecosystem can use [MetaFab’s API](https://docs.trymetafab.com/reference/getcollections){target=_blank} and dashboard with SDKs for Unity, Unreal Engine, and other top programming languages to integrate frictionless blockchain systems for free, without any blockchain or Web3 development.

Moonbeam生态中的游戏开发者能够使用[MetaFab的API](https://www.trymetafab.com/){target=_blank}以及为如Unity、Unreal Engine和其他顶尖编程语言创建的数据面板无摩擦地集成区块链系统，无需进行区块链和Web3的开发流程。

**Note on player UX**: Players don’t care about the technology, which is why MetaFab allows developers to bury the wires of Web3 as deep under the game's surface as they choose. 

**玩家UX注意事项**：玩家并不关心技术，这就是为何MetaFab允许开发者根据选择将Web3贯穿在游戏的底层框架中。

It's imperative for the experience of any game or gamified application to be as frictionless as possible for players or users. MetaFab holds this principle at the core of every tool or product created.

对玩家或用户而言，任何游戏或游戏化应用的操作体验都必须尽可能顺畅。MetaFab将这一原则作为创建的每个工具或产品的核心。

**Note to developers**: MetaFab is a team of game developers that scaled their Web3 games platform to 100,000 players through single sign-on (SSO) player authentication, non-custodial wallets, an abstracted gas and transactional layer, and more. MetaFab adds, improves, and continually innovates around the needs of game developers and prioritizes simple but flexible integration and usage patterns.

**开发人员注意事项**：MetaFab是一个游戏开发团队，其通过单点登录（SSO）玩家身份验证、非托管钱包、抽象Gas和交易层等，将他们的Web3游戏平台扩展到100,000名玩家。MetaFab围绕游戏开发者的需求添加、改进和不断创新，并优先考虑简单但灵活的集成和使用模式。

This guide will dive into the MetaFab product suite at a high level.

本教程将会深入探讨MetaFab的产品系列。

## MetaFab's Language & Framework SDKs - MetaFab的语言以及SDK框架 {: #language-framework-sdks } 

MetaFab offers a handful of SDKs for popular languages and frameworks. These SDKs are generated through MetaFab's internal systems to match their OpenAPI specification, which is always in sync with their API reference. 

MetaFab为常用且流行的编程语言和框架提供了相应SDK。这些SDK通过MetaFab的内部系统生成以匹配其OpenAPI规范，该规范始终与其参考API同步。

The SDKs available are as follows:

以下为可用的SDK：

- [Unity](https://docs.trymetafab.com/docs/c-unity){target=_blank}
- [Android](https://docs.trymetafab.com/docs/android){target=_blank}
- [C#](https://docs.trymetafab.com/docs/c-sdk){target=_blank}
- [C++ (UE4)](https://docs.trymetafab.com/docs/c-unreal-engine-4-sdk){target=_blank}
- [GO](https://docs.trymetafab.com/docs/go){target=_blank}
- [Java](https://docs.trymetafab.com/docs/java){target=_blank}
- [JavaScript](https://docs.trymetafab.com/docs/javascript){target=_blank}
- [PHP](https://docs.trymetafab.com/docs/php){target=_blank}
- [Python](https://docs.trymetafab.com/docs/python){target=_blank}
- [Rust](https://docs.trymetafab.com/docs/rust){target=_blank}
- [Swift](https://docs.trymetafab.com/docs/swift-ios){target=_blank}
- [TypeScript](https://docs.trymetafab.com/docs/typescript){target=_blank}

## MetaFab's Developer Dashboard - MetaFab开发者数据面板 {: #developer-dashboard } 

The MetaFab Dashboard is a home base for a quick game overview, players, currencies, items, shops, loot boxes, contracts, and more. Intuitive management functionality, such as configuration and creation (plus more), is available. However, most opt to use their dashboard as a hub and work directly with the endpoints and code. [Create a dashboard and retrieve your developer keys](https://dashboard.trymetafab.com/auth/register){target=_blank}.

MetaFab数据面板是快速概览游戏、玩家、货币、物品、商店、战利品箱、合约等内容的大本营。提供开发者直观的管理功能，例如配置和创建等（以及更多）。但是，大多数开发者选择将他们的数据面板用作中心/枢纽并直接使用端点和代码开发。[创建数据面板并检索您的开发者密钥](https://dashboard.trymetafab.com/auth/register){target=_blank}。

![MetaFab's developer dashboard.](/images/builders/integrations/gaming/metafab/metafab-1.png)

## Players & Wallets - 玩家和钱包 {: #players-wallets } 

Think of a player as an account controlled (self-custody) by the player and managed by the game. Each player account created through MetaFab interacts with a game's currencies and smart contracts, of which can be [custom smart contracts](https://docs.trymetafab.com/docs/implementing-gasless-transactions){target=_blank}, on Moonbeam and any other supported chain by that game without worrying about gas.

此处可将玩家视为由玩家控制（自我托管）并由游戏管理的帐户。通过MetaFab创建的每个玩家帐户都将与游戏的货币和智能合约交互，其中可以是[自定义智能合约](https://docs.trymetafab.com/docs/implementing-gasless-transactions){target=_blank}，在Moonbeam和其他游戏支持的任何链皆无需担心Gas。

**External wallets**: MetaFab supports an industry-first system called approval delegation. Through a one-time external wallet connection, players can frictionlessly transact through that external wallet without ever needing to sign transactions, deal with wallet pop-ups and prompts, or share private keys.

**外部钱包**：MetaFab支持产业首创的授权委托系统。通过一次性的外部钱包连接，玩家可以通过该外部钱包顺畅地进行交易，而无需签署交易、处理钱包的弹出窗口和提示亦或是共享私钥。

MetaFab and games built on MetaFab never store private keys. With MetaFab, you can handle external and managed wallets through a single logic set. Read more about [MetaFab’s security considerations](https://docs.trymetafab.com/docs/security){target=_blank}.

MetaFab和基于MetaFab构建的游戏从不存储私钥信息。使用MetaFab，您可以通过单个逻辑集处理外部和托管钱包。查看相关细节，请参考[MetaFab的安全注意事项](https://docs.trymetafab.com/docs/security){target=_blank}。

## Authentication & Registration - 验证和注册 {: #authentication-registration } 

Games can either brand MetaFab’s out-of-the-box and fully customizable player authentication, registration, and wallet connection flow, or build their own from the ground up as needed.

游戏可以使用MetaFab的开箱即用且可完全根据需求定制的玩家身份验证、注册和钱包连接流程进行品牌推广，或者根据需求从头开始构建自己的游戏验证和注册流程。

![Register your game with MetaFab.](/images/builders/integrations/gaming/metafab/metafab-2.png)

**White-label authentication and registration**: Quickly design a flow to match a game's theme and domain and automatically handle player login, registration, and relaying of credentials, such as a player's ID and access token. Check out a [demo of our unbranded authentication page](https://connect.trymetafab.com/?chain=MATIC&flow=register&game=880c664b-3ce4-40a2-bf61-83b174ce5f94&redirectUri=https://trymetafab.com){target=_blank}.

**白标身份验证和注册**：快速设计流程以匹配游戏的主题和域名，并自动处理玩家登录、注册和凭证中继，例如玩家ID和Token使用等。查看详细流程，请参考[我们的无品牌认证页面的演示](https://connect.trymetafab.com/?chain=MATIC&flow=register&game=880c664b-3ce4-40a2-bf61-83b174ce5f94&redirectUri=https://trymetafab.com){target=_blank}。

**Build from the ground up**: MetaFab’s endpoints are flexible and work for games that choose to handle authentication and registration flows through their own implementation, methods, launcher, or other custom use cases.

**从头开始构建**：MetaFab的端点非常弹性化，也适用于选择通过自己的实现、方法、启动器或其他自定义用例处理身份验证和注册流程的游戏。

## Ecosystems, Cross-Game Interoperability, & SSO - 生态、跨游戏互操作性和SSO {: #ecosystems-interop-sso } 

Support a network of games with a consistent and standard SSO authentication flow. Enable new degrees of interoperability, frictionless player experiences, and more through a highly configurable organizational structure within an ecosystem of owned, portfolio, or partner games.

MetaFab支持具有一致且标准的SSO身份验证流程的游戏网络。游戏可以通过自有、投资组合或合作伙伴的游戏生态系统中高度可配置的组织结构，实现新高度的互操作性或是无摩擦玩家体验等。

![MetaFab's instrastructure diagram.](/images/builders/integrations/gaming/metafab/metafab-3.png)

**Seamlessly onboard new and existing games**: Integrate a “sign in with (XYZ)” button or method into any game and vertically integrate with MetaFab’s systems, including gas and transaction abstraction.

**无缝加入新游戏和现有游戏**：将“使用（XYZ）登录”按钮或方法集成到任何游戏中，并与MetaFab的系统垂直集成，包括Gas和交易抽象化。

MetaFab’s Ecosystem product allows unified achievement tracking (and more), permissioning flows, control, and security across games, and it is frictionless for players and easy to integrate for developers. Read more [about ecosystems](https://docs.trymetafab.com/docs/ecosystems-cross-game-interoperability){target=_blank}.

MetaFab生态系统产品允许统一的成就跟踪（以及更多）、许可流程、控制和跨游戏的安全性，并且对于玩家而言来说整体是顺畅且无摩擦的，对开发者来说也很容易集成。阅读更多相关信息，请参考[关于生态系统](https://docs.trymetafab.com/docs/ecosystems-cross-game-interoperability){target=_blank}。

## Configure & Deploy Smart Contracts - 配置和部署智能合约 {: #configure-deploy-smart-contracts } 

![Use MetaFab's template smart contracts: Digital Collectibles (ERC1155), Game Currencies (ERC20), Lootboxes, and Shops](/images/builders/integrations/gaming/metafab/metafab-4.png)

**MetaFab’s smart contracts**: Configure MetaFab’s pre-written smart contracts and cover various implementation patterns in a few lines of code. These include deploying in-game currencies to forging new items and enabling player-to-player trading through shops and crafting.

**MetaFab智能合约**：配置MetaFab的预写智能合约，几行代码覆盖各种实现范式。其中包括部署游戏内货币来锻造新物品，以及通过商店和创造实现玩家对玩家的交易。

**Import custom contracts**: Deploy custom smart contracts on any supported chain and leverage the full MetaFab product suite, including gasless transactions for players, simplified authentication flows, delegated EOA support, and more.

**导入自定义合约**：在任何支持的链上部署自定义智能合约并利用完整的MetaFab产品套件，包括玩家Gas交易、简化的身份验证流程、委托的EOA支持等。

## Resources for Learning More - 更多学习资源 {: #learn-more } 

To build on Moonbeam with MetaFab and explore the entire suite of what MetaFab offers, [get started](https://dashboard.trymetafab.com/auth/register){target=_blank}; it’s free, forever. There are no lock-ins, rate limits, transaction fees, or catches. MetaFab’s [future monetization strategy](https://docs.trymetafab.com/docs/free-pricing-business-model){target=_blank} does not gate these core services.

要使用MetaFab在Moonbeam上构建的产品套件并深入探索MetaFab提供的所有服务，[即刻开始操作](https://dashboard.trymetafab.com/auth/register){target=_blank}；它将永远免费，并没有锁定、速率限制、交易费用或捕获量等方面的限制。MetaFab的[未来获利战略](https://docs.trymetafab.com/docs/free-pricing-business-model){target=_blank}并没有为这些核心服务设定使用门槛。

We look forward to building alongside you!

我们期待与您一起构建！

Check out MetaFab's [complete developer documentation](https://docs.trymetafab.com/docs){target=_blank} to learn more.

查看MetaFab的[完整开发者文档页面](https://docs.trymetafab.com/docs){target=_blank}了解更多。

### Reference Links - 参考链接 {: #reference-links }

- [Sign-up](https://www.trymetafab.com/register){target=_blank}
- [Website](https://www.trymetafab.com){target=_blank}
- [Twitter](https://www.trymetafab.com){target=_blank}
- [Docs](https://docs.trymetafab.com){target=_blank}
- [API Reference](https://docs.trymetafab.com/reference){target=_blank}
- [GitHub Repos](https://github.com/orgs/MetaFabInc/repositories){target=_blank}

--8<-- 'text/disclaimers/third-party-content.md'