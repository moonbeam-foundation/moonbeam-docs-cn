---
title: 支持的RPC方法
description: 本文描述了以太坊开发者需要了解的Moonbeam提供的以太坊RPC支持方面与以太坊本身可提供支持的主要差异
---

# 支持的以太坊RPC方法

## 概览 {: #introduction }

虽然Moonbeam致力于兼容以太坊Web3 API和EVM，但开发者仍需了解Moonbeam在[以太坊API JSON-RPC](https://ethereum.org/zh/developers/docs/apis/json-rpc/#json-rpc-methods){target=_blank}支持方面与以太坊之间的重要差异。

Moonbeam团队与[Parity](https://www.parity.io/){target=_blank}密切合作开发[Frontier](/learn/features/eth-compatibility/#frontier){target=_blank}。Frontier是基于Substrate的以太坊兼容层，它允许开发人员运行未经修改的以太坊DApp。

尽管如此，并非所有的以太坊JSON-RPC方法都被支持，一些被支持的方法返回默认值（尤其是与以太坊PoW共识机制相关的那些）。本教程将概述关于以太坊RPC支持的一些主要差异，以及首次使用Moonbeam时需要了解的事项。

## 基本以太坊JSON-RPC方法 {: #basic-rpc-methods }

Moonbeam支持的以太坊API的基本JSON-RPC方法：

- **[eth_protocolVersion](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_protocolversion){target=_blank}** —— 默认返回`1`
- **[eth_syncing](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_syncing){target=_blank}** —— 返回一个对象，其中包含有关同步状态或`false`的数据
- **[eth_hashrate](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_hashrate){target=_blank}** —— 默认返回`"0x0"` 
- **[eth_coinbase](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_coinbase){target=_blank}** —— 返回最新的区块作者。不仅限于已确认的区块
- **[eth_mining](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_mining){target=_blank}** —— 默认返回`false`
- **[eth_chainId](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_chainId){target=_blank}** —— 返回用于签署当前区块的Chain ID
- **[eth_gasPrice](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_gasprice){target=_blank}** —— 返回每个单位gas使用的基本费用。这是目前每个网络的最低gas价格
- **[eth_accounts](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_accounts){target=_blank}** —— 返回由客户端拥有的地址列表
- **[eth_blockNumber](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_blocknumber){target=_blank}** —— 返回最高可用区块号
- **[eth_getBalance](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_getbalance){target=_blank}** —— 返回指定地址的余额
- **[eth_getStorageAt](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_getstorageat){target=_blank}** —— 返回指定地址的存储内容
- **[eth_getBlockByHash](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_getblockbyhash){target=_blank}** —— 返回指定哈希的区块信息，包括伦敦升级支持后区块的`baseFeePerGas`
- **[eth_getBlockByNumber](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_getblockbynumber){target=_blank}** —— 返回指定区块号的区块信息，包含伦敦升级支持后区块的`baseFeePerGas`
- **[eth_getTransactionCount](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_gettransactioncount){target=_blank}** —— 返回从指定地址发送的交易数量（nonce）
- **[eth_getBlockTransactionCountByHash](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbyhash){target=_blank}** —— 返回具有指定区块哈希的区块中的交易数量
- **[eth_getBlockTransactionCountByNumber](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbynumber){target=_blank}** —— 返回具有指定区块号的区块中的交易数量
- **[eth_getUncleCountByBlockHash](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_getunclecountbyblockhash){target=_blank}** —— 默认返回`"0x0"`
- **[eth_getUncleCountByBlockNumber](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_getunclecountbyblocknumber){target=_blank}** —— 默认返回`"0x0"`
- **[eth_getCode](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_getcode){target=_blank}** —— 返回指定区块号的指定地址的代码
- **[eth_sendTransaction](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_sendtransaction){target=_blank}** —— 如果数据字段包含代码，则创建新的消息调用交易或创建合约。返回交易哈希，如果交易尚不可用，则返回零哈希
- **[eth_sendRawTransaction](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_sendrawtransaction){target=_blank}** —— 为已签名的交易创建新的消息调用交易或创建合约。返回交易哈希，如果交易尚不可用，则返回零哈希
- **[eth_call](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_call){target=_blank}** —— 立即执行新的消息调用，无需在区块链上创建交易，返回已执行调用的值
- **[eth_estimateGas](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_estimategas){target=_blank}** —— 返回指定交易成功所需的预计gas费。您可以选择质地指定`gasPrice`或`maxFeePerGas`和`maxPriorityFeePerGas`
- **[eth_feeHistory](https://docs.alchemy.com/alchemy/apis/ethereum/eth-feehistory){target=_blank}** —— 返回指定范围内（最多1024个区块）的`baseFeePerGas`、`gasUsedRatio`、`oldestBlock`和`reward`
- **[eth_getTransactionByHash](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_gettransactionbyhash){target=_blank}** —— 返回指定哈希的交易信息。EIP-1559交易包含`maxPriorityFeePerGas`和`maxFeePerGas`字段
- **[eth_getTransactionByBlockHashAndIndex](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_gettransactionbyblockhashandindex){target=_blank}** —— 返回指定区块哈希和指定索引位置的交易信息。EIP-1559交易包含`maxPriorityFeePerGas`和`maxFeePerGas`字段
- **[eth_getTransactionByBlockNumberAndIndex](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_gettransactionbyblocknumberandindex){target=_blank}** —— 返回指定区块号和制定索引位置的交易信息。EIP-1559交易包含`maxPriorityFeePerGas`和`maxFeePerGas`字段
- **[eth_getTransactionReceipt](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_gettransactionreceipt){target=_blank}** —— 返回指定交易哈希的交易回执。Runtime 1200添加伦敦升级支持后，新的字段`effectiveGasPrice`添加至回执，用于指定交易的gas价格
- **[eth_getUncleByBlockHashAndIndex](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_getunclebyblockhashandindex){target=_blank}** —— 默认返回`null`
- **[eth_getUncleByBlockNumberAndIndex](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_getunclebyblocknumberandindex){target=_blank}** —— 默认返回`null`
- **[eth_getLogs](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_getlogs){target=_blank}** —— 返回匹配指定过滤器对象的所有日志数组
- **[eth_getWork](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_getwork){target=_blank}** —— 默认返回`["0x0","0x0","0x0"]`
- **[eth_submitWork](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_submitwork){target=_blank}** —— Moonbeam暂不支持
- **[eth_submitHashrate](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_submithashrate){target=_blank}** —— Moonbeam暂不支持

## 过滤器相关以太坊JSON-RPC方法 {: #filter-rpc-methods }

Moonbeam支持的以太坊API的过滤器相关JSON-RPC方法：

- **[eth_newFilter](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_newfilter){target=_blank}** —— 根据所提供的输入创建过滤器对象。返回一个过滤器ID
- **[eth_newBlockFilter](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_newblockfilter){target=_blank}** —— 在节点中创建过滤器以在新的区块到达时进行通知。返回一个过滤器ID
- **[eth_getFilterChanges](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_getfilterchanges){target=_blank}** —— 过滤器的轮询方法（参考以上方法）。返回自上次轮询以来发生的日志数组
- **[eth_getFilterLogs](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_getfilterlogs){target=_blank}** —— 返回匹配指定ID过滤器的所有日志数组
- **[eth_uninstallFilter](https://ethereum.org/zh/developers/docs/apis/json-rpc/#eth_uninstallfilter){target=_blank}** —— 卸载指定ID的过滤器。应在不需要轮询时使用。一段时间后未使用`eth_getFilterChanges`请求过滤器超时

## 事件订阅以太坊JSON-RPC方法 {: #event-subscription-rpc-methods }

截止本文撰写时，Moonbeam支持的以太坊API的[事件订阅JSON-RPC方法](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub){target=_blank}：

- **[eth_subscribe](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#create-subscription){target=_blank}** —— 为指定订阅名称创建订阅。如果成功，则返回订阅ID
- **[eth_unsubscribe](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#cancel-subscriptions){target=_blank}** —— 取消指定ID的订阅

### 已支持订阅 {: #supported-subscription }

截止本文撰写时，[已支持的订阅](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#supported-subscriptions){target=_blank}：

- **[newHeads](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#newheads){target=_blank}** —— 每次将新的标题附加至链都会触发通知
- **[logs](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#logs){target=_blank}** —— 返回包含在新导入区块中并匹配指定过滤条件的日志
- **[newPendingTransactions](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#newpendingtransactions){target=_blank}** —— 返回所有增加至待处理状态的交易哈希
- **[syncing](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#syncing){target=_blank}** —— 表示节点开始或停止与网络同步

如果您想获得跟多关于这些订阅的详细教程，请查看[事件订阅](/builders/build/eth-api/pubsub/)教程。


## Debug与Trace JSON-RPC方法 {: #debug-trace }

Moonbeam支持的Geth[debug](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug){target=_blank} 与 [txpool](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool){target=_blank}API，以及 OpenEthereum的[trace](https://openethereum.github.io/JSONRPC-trace-module){target=_blank}模块如下：

- **[debug_traceTransaction](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtracetransaction){target=_blank}** - 通过一个交易哈希，这个方法试着按照原始交易步骤重新执行该交易
- **[debug_traceBlockByNumber](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debug_traceblockbynumber){target=_blank}** - 给定一个区块编号，此方法尝试以与网络上执行的完全相同的方式重新执行该区块。
- **[debug_traceBlockByHash](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debug_traceblockbyhash){target=_blank}** - 给定一个区块哈希，此方法尝试以与网络上执行的完全相同的方式重新执行该区块。
- **[trace_filter](https://openethereum.github.io/JSONRPC-trace-module#trace_filter){target=_blank}** - 根据filter，此方法返回对应的trace
- **[txpool_content](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-content){target=_blank}** - 返回所有当前处于待处理状态的交易的详细信息，这些交易正在等待被纳入未来的下个或几个区块，并排队等待未来执行。
- **[txpool_inspect](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-inspect){target=_blank}** - 返回所有当前处于待处理状态的交易的摘要，这些交易正在等待被纳入未来的下个或几个区块，并排队等待未来执行。
- **[txpool_status](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-status){target=_blank}** - 返回所有当前处于待处理状态的交易数量，这些交易正在等待被纳入未来的下个或几个区块，并排队等待未来执行

学习更多关于这些debug和trace方法，访问[Debug API & Trace模块](/builders/build/eth-api/debug-trace/){target=_blank}教程.