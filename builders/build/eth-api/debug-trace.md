---
title: Debug & Trace交易
description: 学习如何使用Geth的Debug和Txpool API，以及OpenEthereum的Trace模块在Moonbeam上调用非标准RPC方式。
---

# Debug API与Trace模块

## 概览 {: #introduction }

Geth的 debug 与 txpool API，以及OpenEthereum的 trace 模块均提供非标准的RPC方法，用于获取更多关于交易处理的详细信息。作为Moonbeam为开发者提供无缝以太坊开发体验目标的其中一部分，Moonbeam支持部分非标准RPC方法。支持这些RPC方法是个重要的里程碑，因为如[The Graph](https://thegraph.com/){target=\_blank}等项目仰赖这些方法检索区块链数据。

要查看追踪RPC提供者，请查看[网络端点](/builders/get-started/endpoints#tracing-providers){target=\_blank}页面。

本教程将介绍Moonbeam上支持的RPC方法，以及如何通过使用curl命令对本地Moonbase Alpha追踪节点来调用这些方法。

## 支持的RPC方法 {: #supported-rpc-methods }

可用的RPC方法如下：

  - [`debug_traceTransaction`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtracetransaction){target=\_blank}
  - [`debug_traceBlockByNumber`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtraceblockbynumber){target=\_blank}
  - [`debug_traceBlockByHash`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtraceblockbyhash){target=\_blank}
  - [`trace_filter`](https://openethereum.github.io/JSONRPC-trace-module#trace_filter){target=\_blank}
  - [`txpool_content`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-content){target=\_blank}
  - [`txpool_inspect`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-inspect){target=\_blank}
  - [`txpool_status`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-status){target=\_blank}

## Debug API {: #debug-api }

有关debug RPC的具体执行操作，请参考[Geth的debug API教程](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug){target=\_blank}：

  - **[`debug_traceTransaction`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtracetransaction){target=\_blank}**  —— 需要追踪交易的哈希值
  - **[`debug_traceBlockByNumber`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtraceblockbynumber){target=\_blank}** —— 需要追踪区块的区块编号
  - **[`debug_traceBlockByHash`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtraceblockbyhash){target=\_blank}** —— 需要追踪区块的哈希值

此外，还可提供以下*可选*参数：

 - **disableStorage**(*boolean*) ——（默认：`false`）。若设置为`true`，则内存捕获功能将关闭
 - **disableMemory**(*boolean*) ——（默认：`false`）。若设置为`true`，则存储捕获功能将关闭
 - **disableStack**(*boolean*) ——（默认：`false`）。若设置为`true`，则堆栈捕获功能将关闭

## Txpool API {: #txpool-api }

有关txpool RPC的具体执行操作，请参考[Geth的txpool API教程](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool)：

  - **[`txpool_content`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-content){target=\_blank}** —— 无需任何参数
  - **[`txpool_inspect`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-inspect){target=\_blank}** —— 无需任何参数
  - **[`txpool_status`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-status){target=\_blank}** —— 无需任何参数

## Trace模块 {: #trace-module }

有关[`trace_filter`](https://openethereum.github.io/JSONRPC-trace-module#trace_filter){target=\_blank} RPC的具体执行操作，请参考[OpenEthereum的Trace模块教程](https://openethereum.github.io/JSONRPC-trace-module){target=\_blank}：

 - **fromBlock**(*uint* blockNumber) —— 输入区块编号(`hex`)， 创世区块`earliest` ，或可用最佳区块`latest` （默认）。追踪第一个区块
 - **toBlock**(*uint* blockNumber) —— 输入区块编号(`hex`)，创世区块`earliest` ，或可用最佳区块`latest` （默认）。追踪最后一个区块
 - **fromAddress**(*array* addresses) —— 仅过滤这些地址发出的交易。如果输入的为空阵列，将不会进行过滤
 - **toAddress**(*array* addresses) —— 仅过滤这些地址接收的交易。如果输入的为空阵列，将不会进行过滤
 - **after**(*uint* offset) —— 默认为`0`。追踪偏移号或起始号
 - **count**(*uint* numberOfTraces) —— 追踪次数将以一连串的数字显示

您需注意以下一些默认值：

 - `trace_filter`的单个请求允许返回的最大追踪条目数为`500`。超过此限制的请求将返回错误
 - 请求处理的区块会暂时存储在缓存中`300`秒，之后将被删除

如需更改默认值，您可以在启动追踪节点时添加[附加标识](/node-operators/networks/tracing-node/#additional-flags){target=\_blank}。

## 查看先决条件 {: #checking-prerequisites }

本教程假设您有一个Moonbase Alpha追踪节点的本地运行实例，并启用`debug`、`txpool`和`tracing`命令行标识。对于Moonbeam和Moonriver，你也可以相应调整说明。

如果您尚未运行追踪节点，您可以按照[运行追踪节点](/node-operators/networks/tracing-node/){target=\_blank}上的指南进行操作。RPC HTTP终端为`{{ networks.development.rpc_url }}`。

如果您已有运行的节点，也会看到相似的终端日志：

![Debug API](/images/builders/build/eth-api/debug-trace/debug-trace-1.webp)

## 使用Debug API {: #using-the-debug-api }

运行跟踪节点后，您可以在终端中开启另一个窗口，在其中运行`curl`命令并调用任何可用的JSON-RPC方法。例如，调用`debug_traceTransaction`后，您可在自己的终端发起以下JSON-RPC请求（在本示例中，交易哈希值为`0x04978f83e778d715eb074352091b2159c0689b5ae2da2554e8fe8e609ab463bf`）：

```bash
curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"debug_traceTransaction",
    "params": ["0x04978f83e778d715eb074352091b2159c0689b5ae2da2554e8fe8e609ab463bf"]
  }'
```

节点将返回交易从始至终的每一个步骤信息（因篇幅过长，此处返回内容有所删减）：

![Trace Debug Node Running](/images/builders/build/eth-api/debug-trace/debug-trace-2.webp)

如果您使用的是 `debug_traceBlockByNumber` 或 `debug_traceBlockByHash` 方法，您需要在`"params"`中添加`{"tracer": "callTracer"}`。`callTracer` 会返回交易及其下属调用。否则tracer将会尝试使用`raw`为预设值，目前这个模式并不被支持因为它会占用太多资源。举例来说，使用`debug_traceBlockByHash`方法时，您可以在terminal使用以下JSON-RPC请求（例子中使用的区块哈希值为`0x2633b66050c99d80f65fe96de6485fd407b87f0f59b485c33ab8f119e2c6f255`）:

```sh
curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"debug_traceBlockByHash",
    "params": ["0x2633b66050c99d80f65fe96de6485fd407b87f0f59b485c33ab8f119e2c6f255", {"tracer": "callTracer"}]
  }'
```

## 使用追踪模块 {: #using-the-tracing-module }

调用`trace_filter`后，您可在自己的终端发起以下JSON-RPC请求（在本示例中，过滤范围从区块20000到25000，且接收地址为`0x4E0078423a39EfBC1F8B5104540aC2650a756577`，初始值为零偏移，并提供前20条追踪结果）：

```bash
curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"trace_filter", "params":[{"fromBlock":"0x4E20","toBlock":"0x5014","toAddress":["0x4E0078423a39EfBC1F8B5104540aC2650a756577"],"after":0,"count":20}]
  }'
```

节点将返回过滤后的追踪信息结果（因篇幅过长，此处返回内容有所删减）。

![Trace Filter Node Running](/images/builders/build/eth-api/debug-trace/debug-trace-3.webp)

## 使用Txpool API {: #using-the-txpool-api }

由于目前支持的txpool方法都不需要参数，因此您可以通过更改任何txpool方法以适配以下curl命令：

```bash
curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"txpool_status", "params":[]
  }'
```

在本示例中，`txpool_status`方法将返回当前待定或排队的交易数。

![Txpool Request and Response](/images/builders/build/eth-api/debug-trace/debug-trace-4.webp)
