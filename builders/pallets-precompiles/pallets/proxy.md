---
title: Proxy Pallet
description: 学习如何使用Moonbeam上Proxy Pallet中可用的extrinsics、存储方法和常量来代表账户进行调用。
keywords: proxy, substrate, moonbeam, polkadot
---

# 代理Pallet

## 概览 {: #introduction }

代理帐户可以代表用户执行有限数量的操作，并起到保护底层帐户安全的作用。这允许用户将其主账户进行安全冷存储，同时使代理能够主动执行功能并利用主账户中的Token权重参与网络。

[Substrate的代理Pallet](https://wiki.polkadot.network/docs/learn-proxies){target=_blank}能够让用户创建代理账户、移除代理账户、作为代理账户执行调用以及宣布代理交易。要增加和移除代理账户，您可以使用代理预编译：一个能够通过以太坊API交互的Solidity接口。更多关于如何使用代理预编译合约交互的信息，请参考[如何与代理预编译交互](/builders/pallets-precompiles/precompiles/proxy){target=_blank}教程。

本文将概述代理pallet中可用pallet常量的extrinsics、存储方法和getters。

## 代理Pallet接口 {: #proxy-pallet-interface }

### Extrinsics {: #extrinsics }

代理Pallet提供以下extrinsics（函数）：

- **addProxy**(delegate, proxyType, delay) - 为发送者注册一个能够代表发送者执行调用的代理账户。若`delay`设置的数值大于0，则代理账户将必须宣布交易并在等待区块达到该数值后作为代理账户执行交易。此函数将触发`ProxyAdded`事件
- **announce**(real, callHash) - 通过需要延迟的代理账户注册一个代理交易的公告。此函数将触发`Announced`事件
- **anonymous**(proxyType, delay, index) - 创建一个因无法获取私钥权限而无法访问的新账户。发送者将根据指定的类型和延迟成为账户的代理。请注意，若移除代理，则主账户将无法访问。此函数将触发`AnonymousCreated`事件
- **killAnonymous**(spawner, proxyType, index, height, extIndex) - 移除之前生成的匿名代理
- **proxy**(real, forceProxyType, call) - 作为代理执行交易。此函数将触发`ProxyExecuted`事件
- **proxyAnnounced**(delegate, real, forceProxyType, call) - 作为代理执行交易并移除先前的对应交易公告。此函数将触发`ProxyExecuted`事件
- **rejectAnnouncement**(delegate, callHash) - 若发送者是一个主账户，则将从其代理账户移除指定公告
- **removeAnnouncement**(real, callHash) - 若发送者是一个代理账户，则将从其主账户移除指定公告
- **removeProxies**() - 注销发送者的所有代理账户
- **removeProxy**(delegate, proxyType, delay) - 注销发送者的指定代理账户。此函数将触发`ProxyRemoved`事件

!!! 注意事项
    匿名代理在Moonbeam网络上是禁止的，因其会轻易被滥用。不正确使用代理账户可能会造成资金和账户余额的永久损失。

### 存储方法 {: #storage-methods }

代理Pallet包含以下只读存储函数以获取链状态数据：

- **announcements**(AccountId20) - 返回由指定代理账户执行的所有公告
- **palletVersion**() - 返回当前Pallet版本
- **proxies**(AccountId20) - 返回指定主账户的所有代理账户的映射和数量

### Pallet常量 {: #constants }

代理Pallet包含以下只读存储函数以获取Pallet常量：

- **announcementDepositBase**() - 返回创建公告所需的基本货币数量
- **announcementDepositFactor**() - 返回每个公告所需的货币数量
- **maxPending**() - 返回允许待处理的延迟公告的最大数量
- **maxProxies**() - 返回单个账户允许的代理账户最大数量
- **proxyDepositBase**() - 返回创建代理所需的基本货币数量
- **proxyDepositFactor**() - 返回每个添加的代理所需的货币数量