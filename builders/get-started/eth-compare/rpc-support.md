---
title: RPC支持
description: 本文描述了以太坊开发者需要了解的Moonbeam提供的以太坊RPC支持方面与以太坊本身可提供支持的主要差异
---

![Moonbeam v Ethereum - RPC Support Banner](/images/builders/get-started/eth-compare/rpc-support-banner.png)

## 概览

虽然Moonbeam致力于兼容以太坊Web3 API和EVM，但开发者仍需了解Moonbeam在[以太坊API JSON-RPC](https://eth.wiki/json-rpc/API#json-rpc-methods)支持方面与以太坊之间的重要差异。

Moonbeam团队与[Parity](https://www.parity.io/)密切合作开发[Frontier](https://github.com/paritytech/frontier)。Frontier是基于Substrate的以太坊兼容层，它允许开发人员运行未经修改的以太坊DApp。

尽管如此，并非所有的以太坊JSON RPC方法都被支持，一些被支持的方法返回默认值（与以太坊PoW共识算法相关的那些）。本教程将概述关于以太坊RPC支持的一些主要差异，以及首次使用Moonbeam时需要了解的事项。

## 基本以太坊JSON RPC方法

截止本文撰写时，Moonbeam支持的以太坊API的基本JSON RPC方法：

 - **[eth_protocolVersion](https://eth.wiki/json-rpc/API#eth_protocolversion)** —— 默认返回`1`
 - **[eth_syncing](https://eth.wiki/json-rpc/API#eth_syncing)** —— 返回一个对象，关于同步状态或`false`的数据
 - **[eth_hashrate](https://eth.wiki/json-rpc/API#eth_hashrate)** —— 默认返回`"0x0"`
 - **[eth_coinbase](https://eth.wiki/json-rpc/API#eth_coinbase)** —— 返回最新的区块作者。不仅限为已确认的区块
 - **[eth_mining](https://eth.wiki/json-rpc/API#eth_mining)** —— 默认返回`false`
 - **[eth_chainId](https://eth.wiki/json-rpc/API#eth_chainid)** —— 返回用户签署当前区块的Chain ID
 - **[eth_gasPrice](https://eth.wiki/json-rpc/API#eth_gasprice)** —— 返回当前的gas价格
 - **[eth_accounts](https://eth.wiki/json-rpc/API#eth_accounts)** 返回由客户端拥有的地址列表
 - **[eth_blockNumber](https://eth.wiki/json-rpc/API#eth_blocknumber)** —— 返回最高可用区块号
 - **[eth_getBalance](https://eth.wiki/json-rpc/API#eth_getbalance)** —— 返回指定地址余额
 - **[eth_getStorageAt](https://eth.wiki/json-rpc/API#eth_getstorageat)** —— 返回指定地址的存储内容
 - **[eth_getBlockByHash](https://eth.wiki/json-rpc/API#eth_getblockbyhash)** —— 返回指定哈希的区块
 - **[eth_getBlockByNumber](https://eth.wiki/json-rpc/API#eth_getblockbynumber)** —— 返回指定区块号的区块
 - **[eth_getTransactionCount](https://eth.wiki/json-rpc/API#eth_gettransactioncount)** —— 返回从指定地址发送的交易数量（nonce）
 - **[eth_getBlockTransactionCountByHash](https://eth.wiki/json-rpc/API#eth_getblocktransactioncountbyhash)** —— 返回具有指定区块哈希的区块中的交易数量
 - **[eth_getBlockTransactionCountByNumber](https://eth.wiki/json-rpc/API#eth_getblocktransactioncountbynumber)** —— 返回具有指定区块号的区块中的交易数量
 - **[eth_getUncleCountByBlockHash](https://eth.wiki/json-rpc/API#eth_getunclecountbyblockhash)** —— 默认返回`"0x0"`
 - **[eth_getUncleCountByBlockNumber](https://eth.wiki/json-rpc/API#eth_getunclecountbyblocknumber)** —— 默认返回`"0x0"`
 - **[eth_getCode](https://eth.wiki/json-rpc/API#eth_getcode)** —— 返回指定区块号的指定地址的代码
 - **[eth_sendTransaction](https://eth.wiki/json-rpc/API#eth_sendtransaction)** —— 如果数据字段包含代码，则创建新的消息实现调用或创建合约。返回交易哈希，如果交易尚不可用，则返回零哈希
 - **[eth_sendRawTransaction](https://eth.wiki/json-rpc/API#eth_sendrawtransaction)** —— 为已签名的交易创建新的消息调用或创建合约。返回交易哈希，如果交易尚不可用，则返回零哈希
 - **[eth_call](https://eth.wiki/json-rpc/API#eth_call)** —— 立即执行新的消息调用，无需在区块链上创建交易，返回已执行调用的值
 - **[eth_estimateGas](https://eth.wiki/json-rpc/API#eth_estimategas)** —— 返回指定一笔成功的交易所需的预计gas费
 - **[eth_getTransactionByHash](https://eth.wiki/json-rpc/API#eth_gettransactionbyhash)** —— 返回指定哈希的交易信息
 - **[eth_getTransactionByBlockHashAndIndex](https://eth.wiki/json-rpc/API#eth_gettransactionbyblockhashandindex)** —— 返回指定区块哈希和指定索引位置的交易信息
 - **[eth_getTransactionByBlockNumberAndIndex](https://eth.wiki/json-rpc/API#eth_gettransactionbyblocknumberandindex)** —— 返回指定区块号和指定索引位置的交易信息
 - **[eth_getTransactionReceipt](https://eth.wiki/json-rpc/API#eth_gettransactionreceipt)** —— 返回指定交易哈希的交易回执
 - **[eth_getUncleByBlockHashAndIndex](https://eth.wiki/json-rpc/API#eth_getunclebyblockhashandindex)** —— 默认返回`"null"`
 - **[eth_getUncleByBlockNumberAndIndex](https://eth.wiki/json-rpc/API#eth_getunclebyblocknumberandindex)** —— 默认返回`"null"`
 - **[eth_getLogs](https://eth.wiki/json-rpc/API#eth_getlogs)** —— 返回指定交易哈希的交易回执
 - **[eth_getWork](https://eth.wiki/json-rpc/API#eth_getwork)** —— 默认返回`["0x0","0x0","0x0"]`
 - **[eth_submitWork](https://eth.wiki/json-rpc/API#eth_submitwork)** —— Moonbeam暂不支持
 - **[eth_submitHashrate](https://eth.wiki/json-rpc/API#eth_submithashrate)** —— Moonbeam暂不支持

## 过滤器相关以太坊JSON RPC方法

截止本文撰写时，Moonbeam支持的以太坊API的过滤器相关JSON RPC方法：

- **[eth_newFilter](https://eth.wiki/json-rpc/API#eth_newfilter)** —— 根据所提供的输入创建过滤器对象。返回一个过滤器ID
 - **[eth_newBlockFilter](https://eth.wiki/json-rpc/API#eth_newblockfilter)** —— 在节点中创建过滤器以在新的区块到达时进行通知。返回一个过滤器ID
 - **[eth_newPendingTransactionFilter](https://eth.wiki/json-rpc/API#eth_newpendingtransactionfilter)** —— 在节点中创建过滤器以在新的待处理事务到达时进行通知。返回一个过滤器ID
 - **[eth_getFilterChanges](https://eth.wiki/json-rpc/API#eth_getfilterchanges)** —— 过滤器的轮询方法（参考以上方法）。返回自上次轮询以来发生的日志数组
 - **[eth_getFilterLogs](https://eth.wiki/json-rpc/API#eth_getfilterlogs)** —— 返回指定ID过滤器匹配的所有日志数组
 - **[eth_uninstallFilter](https://eth.wiki/json-rpc/API#eth_uninstallfilter)** —— 卸载指定ID的过滤器。应在不需要轮询时使用。一段时间后未使用`eth_getFilterChanges`请求过滤器超时

## 事件订阅以太坊JSON RPC方法

截止本文撰写时，Moonbeam支持的以太坊API的[事件订阅JSON RPC方法](https://geth.ethereum.org/docs/rpc/pubsub)：

- **[eth_subscribe](https://geth.ethereum.org/docs/rpc/pubsub#create-subscription)** —— 为指定订阅名称创建订阅。如果成功，返回订阅ID
- **[eth_unsubscribe](https://geth.ethereum.org/docs/rpc/pubsub#cancel-subscription)** —— 取消指定ID的订阅

### 已支持订阅

截止本文撰写时，已支持的订阅：

 - **[newHeads](https://geth.ethereum.org/docs/rpc/pubsub#newheads)** —— 每次将新的标题附加至链都会触发通知

 - **[logs](https://geth.ethereum.org/docs/rpc/pubsub#logs)** —— 返回包含在新导入区块中并匹配指定过滤条件的日志
 - **[newPendingTransactions](https://geth.ethereum.org/docs/rpc/pubsub#newpendingtransactions)** —— 返回所有增加至待处理状态的交易哈希
 - **[syncing](https://geth.ethereum.org/docs/rpc/pubsub#syncing)** —— 表示节点开始或停止与网络同步

如果您想获得跟多关于这些订阅的详细教程，请查看[事件订阅](/builders/tools/pubsub/)教程。
