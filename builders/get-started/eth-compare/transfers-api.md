---
title: 转账API
description: 本文描述了以太坊开发者需要了解的Moonbeam在可用余额转账与以太坊之间的主要差异
---

## 概览

虽然Moonbeam致力于兼容以太坊Web3 API和EVM，但开发者仍需了解Moonbeam在余额转账方面与以太坊之间的主要差异。

Token持有者有两种方式来启动Moonbeam上的余额转账功能。一方面，用户可以通过MetaMask、MathWallet或其他任何使用以太坊JSON-RPC的工具等应用程序来使用以太坊API。另一方面，用户可以通过Polkadot.js App网站使用Substrate API。

开发者需要注意的是，Token持有者可以利用这两个API来转移代币。本教程将概述围绕这两个API进行余额转账的一些主要差异，以及首次使用Moonbeam时需要了解的事项。

## 以太坊转账

使用以太坊API的简单余额转账依赖于`eth_sendRawTransaction` JSON RPC。这可以直接从一个账户到另一个账户，或通过智能合约。

在以太坊上有不同的策略来监听转账或余额变化，本教程中并未涉及。但它们都集中在使用以太坊JSON RPC的不同策略上。

## Moonbeam转账

如先前所述，Moonbeam使Token持有者能够通过以太坊和Substrate API执行转账。在Moonbeam上有多种情况可以触发Token转账。因此，为了监控所有的转账，**您应该使用Polkadot.js SDK**（Substrate API）。

在介绍不同情况之前，有两个与区块相关的不同要素。

 - **Extrinsic** —— 指源于系统本身之外的状态变化。最常见的外部参数形式是交易。它们是按执行顺序排列的
- **Events** —— 指由外部参数产生的日志。每个外部参数可以有多个事件。它们按执行顺序排列。

不同的转账场景如下:

 - **Substrate转账** —— 这将创建一个外部参数，`balances.transfer`或`balances.transferKeepAlive`。这将触发**一个**`balances.Transfer`事件
 - **Substrate功能** —— 一些原生Substrate功能可以创建外部参数，将Token发送至一个地址。例如，[Treasury](/learn/features/ Treasury /)可以创建一个外部参数，如`treasury.proposeSend`，这将触发**一个或多个**`balances.Transfer`事件
 - **Ethereum转账** —— 这将创建一个`ethereum.transact`外部参数，为一个空白输入值。这将触发**一个**`balances.Transfer`事件
 -  **通过智能合约进行以太坊转账** —— 这将创建一个`ethereum.transact`外部参数，多个数据成为输入值。这将触发**一个或多个**`balances.Transfer`事件

All the scenarios described above will effectively transfer tokens. The easiest way to monitor them all is to rely on the `balances.Transfer` event.

上述所有场景都将能有效地进行Token转账。监控它们最简单的方法就是通过`balances.Transfer`事件。

## 使用Substrate API来监控所有余额转账

[Polkadot.js API程序包](https://polkadot.js.org/docs/api/start)为开发人员提供了一种使用Javascript与Substrate链相交互的方式。

以下代码片段使用Polkadot.js循环访问从提供者获取的每个事件。然后，检查是否与一个`balances.Transfer`事件对应。如果是，这将提取一个转账的`from`、`to`以及`amount`并显示在控制台上。请注意，`amount`是以最小的单位（Wei）来显示的。您可以在他们的[官方文档网站](https://polkadot.js.org/docs/substrate/rpc)找到关于Polkadot.js和Substrate JSON RPC的所有可用信息。

--8<-- 'code/vs-ethereum/balance-event.md'

此外，您可以在[此脚本](https://gist.github.com/crystalin/b2ce44a208af60d62b5ecd1bad513bce)中找到更多余额转账相关具体案例的代码片段。

