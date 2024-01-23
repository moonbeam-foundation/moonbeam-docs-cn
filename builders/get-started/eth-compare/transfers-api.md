---
title: 在Moonbeam上转账和订阅余额变化
description: 本文描述了以太坊开发者需要了解的Moonbeam在可用余额转账与以太坊之间的主要差异。
---

# 在Moonbeam上转账和订阅余额变化

## 概览 {: #introduction }

虽然Moonbeam致力于兼容以太坊Web3 API和EVM，但开发者仍需了解Moonbeam在原生Token（例如：GLMR和MOVR）余额转账方面与以太坊之间的主要差异。

Token持有者有两种方式来启动Moonbeam上的余额转账功能。一方面，用户可以通过MetaMask、MathWallet或其他任何使用以太坊JSON-RPC的工具等应用程序来使用以太坊API。另一方面，用户可以通过Polkadot.js App网站使用Substrate API或直接使用Substrate RPC。

开发者需要注意的是，Token持有者可以利用这两类API来转移原生Token。请注意，本教程内容不适用于其他类资产的转账，例如Moonriver或Moonbeam EVM中基于ERC-20的资产。这些资产的转移只能通过以太坊API完成，因为需要与智能合约交互。

本教程将概述围绕这两类API进行余额转账的一些主要差异，以及首次使用Moonbeam时需要了解的事项。

## 以太坊转账 {: #ethereum-transfers }

使用以太坊API的简单余额转账依赖于`eth_sendRawTransaction` JSON-RPC。这可以直接从一个账户到另一个账户，或通过智能合约。

在以太坊上有不同的策略来监听转账或余额变化，本教程中并未涉及。但它们都集中在使用以太坊JSON-RPC的不同策略上。

## Moonbeam转账 {: #moonbeam-transfers }

如先前所述，Moonbeam使Token持有者能够通过以太坊和Substrate API执行原生Token转账。在Moonbeam上有多种情况可以触发Token转账。因此，为了监控所有的转账，**您应该使用Polkadot.js SDK**（Substrate API）。

在介绍不同情况之前，有两个与区块相关的不同要素。

- **Extrinsic** — 指源于系统本身之外的状态变化。最常见的Extrinsic形式是交易。它们是按执行顺序排列的
- **Events** — 指由Extrinsic产生的日志。每个Extrinsic可以有多个事件。它们按执行顺序排列。

不同的转账场景如下:

- **Substrate转账** — 这将创建一个Extrinsic，`balances.transferAllowDeath`或`balances.transferKeepAlive`。这将触发**一个**`balances.Transfer`事件
- **Substrate功能** — 一些原生Substrate功能可以创建Extrinsic，将Token发送至一个地址。例如，[Treasury](/learn/features/treasury/){target=\_blank}可以创建一个Extrinsic，如`treasury.proposeSend`，这将触发**一个或多个**`balances.Transfer`事件
- **Ethereum转账** — 这将创建一个`ethereum.transact`Extrinsic，为一个空白输入值。这将触发**一个**`balances.Transfer`事件
- **通过智能合约进行以太坊转账** — 这将创建一个`ethereum.transact`Extrinsic，多个数据成为输入值。这将触发**一个或多个**`balances.Transfer`事件

上述所有场景都将能有效地进行原生代币转账。监控它们最简单的方法就是通过`balances.Transfer`事件。

## 监控原生Token余额转账 {: #monitor-transfers }

以下代码示例将演示如何使用[Polkadot.js API库](https://polkadot.js.org/docs/api/start){target=\_blank}或[Substrate API Sidecar](https://github.com/paritytech/substrate-api-sidecar){target=\_blank}监听通过Substrate或Ethereum API发送的两种类型的原生Token转账。下方代码片段仅用于演示目的，请将其进行调整并进一步测试后再用于生产环境。

### 使用Polkadot.js API {: #using-polkadotjs-api }

[Polkadot.js API程序包](https://polkadot.js.org/docs/api/start){target=\_blank}为开发人员提供了一种使用Javascript与Substrate链相交互的方式。

以下代码片段使用[`subscribeFinalizedHeads`](https://polkadot.js.org/docs/substrate/rpc/#subscribefinalizedheads-header){target=\_blank}订阅最新确认的区块头，并循环访问之中的每个事件。然后，检查是否与一个`balances.Transfer`事件对应。如果是，这将提取一个转账的`from`、`to`以及`amount`并显示在控制台上。请注意，`amount`是以最小的单位（Wei）来显示的。您可以在他们的[官方文档网站](https://polkadot.js.org/docs/substrate/rpc){target=\_blank}找到关于Polkadot.js和Substrate JSON-RPC的所有可用信息。

```ts
--8<-- 'code/builders/get-started/eth-compare/transfers-api/balance-event.ts'
```

此外，您可以在[此脚本](https://gist.github.com/crystalin/b2ce44a208af60d62b5ecd1bad513bce){target=\_blank}中找到更多余额转账相关具体案例的代码片段。

### 使用Substrate API Sidecar {: #using-substrate-api-sidecar }

开发者也可以使用[Substrate API Sidecar](https://github.com/paritytech/substrate-api-sidecar){target=\_blank}检索Moonbeam区块并监控通过Substrate和Ethereum API发送的交易。Substrate API Sidecar是一种REST API服务，用于与使用Substrate框架构建的区块链交互。

以下代码片段使用Axios HTTP客户端查询Sidecar端点`/blocks/head`(https://paritytech.github.io/substrate-api-sidecar/dist/){target=\_blank}以获取最新确认的区块头。然后，在EVM和Substrate API级别解码原生Token转账的`from`、`to`、`value`、`tx hash`、和`transaction status` 区块。

```js
--8<-- 'code/builders/get-started/eth-compare/transfers-api/sidecar-transfer.js'
```

关于安装和运行Sidecar服务实例，以及如何解码Moonbeam交易的Sidecar区块等更多信息，请参考[Substrate API Sidecar页面](/builders/build/substrate-api/sidecar/){target=\_blank}。
