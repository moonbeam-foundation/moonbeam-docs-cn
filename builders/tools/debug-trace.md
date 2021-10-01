---
title: 调试及跟踪
description:  通过此教程学习如何在Moonbeam上使用Geth调试API及OpenEthereum跟踪模块
---

# 调试（Debug）API与跟踪（Trace）模块

![Full Node Moonbeam Banner](/images/debugtrace/debugtrace-banner.png)

## 概览 {: #introduction } 

Geth的调试API和OpenEthereum的跟踪模块均提供非标准的RPC方法，用于获取更多关于交易处理的详细信息。

随着Moonbase Alpha v7版本的发布，为开发者进一步提供以太坊无缝体验，Moonbeam开始启用 `debug_traceTransaction`和`trace_filter`RPC方法。

这两个RPC方法的启用是Moonbeam发展中的一个重要的里程碑，因为像[The Graph](https://thegraph.com/)和[Blockscout](https://docs.blockscout.com/)等很多项目都依赖于这两个方法来索引区块链数据。

两种方法的调用对节点来说会造成非常大的荷载，因此需要分别使用带有`debug_traceTransaction`的`--ethapi=debug`标记和/或者带有`trace_filter`的`--ethapi=trace`标记，以便本地运行节点进行RPC。目前用户可以创建以下两种不同节点：

 - **Moonbeam开发节点** —— 在私有环境下运行自己的Moonbeam实例。具体操作请见[此教程](/getting-started/local-node/setting-up-a-node/)。请务必查看[高级标记](/getting-started/local-node/setting-up-a-node/#advanced-flags-and-options)
 - **Moonbase Alpha节点** —— 在测试网上运行完整节点，并进入自己的私有终端。具体操作请见[此教程](/node-operators/networks/full-node/)。请务必查看[高级标记](/node-operators/networks/full-node/#advanced-flags-and-options)

## Geth调试API {: #geth-debug-api } 

有关`debug_traceTransaction`RPC的具体执行操作，请见[Geth调试API教程](https://geth.ethereum.org/docs/rpc/ns-debug#debug_tracetransaction)。

运行这一RPC方法需要先提供交易的哈希值。此外，还可提供以下可选参数：

 - **disableStorage** —— 一个输入值：布尔型（默认：*false*）。若设置为true，则内存捕获功能将关闭
 - **disableMemory** —— 一个输入值：布尔型（默认：*false*）。若设置为true，则存储捕获功能将关闭
 - **disableStack** —— 一个输入值：布尔型（默认：*false*）。若设置为true，则堆栈捕获功能将关闭

目前暂不支持基于JavaScript的交易跟踪。

## 跟踪模块 {: #trace-module } 

有关`trace_filter`的具体执行操作，请见[OpenEthereum追踪模块教程](https://openethereum.github.io/JSONRPC-trace-module#trace_filter)。

运行这一RPC方法需要以下任一可选参数：

 - **fromBlock** —— 一个输入值：可输入区块号(`hex`)， 创世区块`earliest` ，或者输入可用最佳区块`latest` （默认）。跟踪第一个区块
 - **toBlock** —— 一个输入值：可输入区块号(`hex`)，创世区块`earliest` ，或者输入可用最佳区块`latest` （默认）。跟踪最后一个区块
 - **fromAddress** —— 一个输入值：由地址组成的阵列。仅过滤这些地址发出的交易。如果输入的为空阵列，将不会进行过滤
 - **toAddress** ——  一个输入值：由地址组成的阵列。仅过滤这些地址接收的交易。如果输入的为空阵列，将不会进行过滤
 - **after** —— 一个输入值：偏移量（`uint`），默认为0。跟踪偏移号或起始号
 - **count** —— 一个输入值：跟踪次数（`uint`）。跟踪次数将以一连串的数字显示

## 在Moonbase Alpha上进行测试 {: #try-it-on-moonbase-alpha } 

如上所述，要使用这两种功能需要有运行`debug`和`trace`标记的节点。在这个示例中，我们使用的是Moonbase Alpha本地完整节点，RPC HTTP终端为`http://127.0.0.1:9933`。如果您已有运行的节点，也会看到相似的终端日志：

![Debug API](/images/debugtrace/debugtrace-images1.png)

例如，调用`debug_traceTransaction`后，您可在自己的终端发起以下JSON RPC请求（在本示例中，交易哈希值为`0x04978f83e778d715eb074352091b2159c0689b5ae2da2554e8fe8e609ab463bf`)：

```
curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"debug_traceTransaction",
    "params": ["0x04978f83e778d715eb074352091b2159c0689b5ae2da2554e8fe8e609ab463bf"]
  }'
```

节点将返回交易从始至终的每一个步骤信息（因篇幅过长，此处返回内容有所删减）：

![Trace Debug Node Running](/images/debugtrace/debugtrace-images2.png)

调用`trace_filter`后，您可在自己的终端发起以下JSON RPC请求（在本示例中，过滤范围从区块20000到25000，且接收地址为`0x4E0078423a39EfBC1F8B5104540aC2650a756577`，初始值为零偏移，并提供前20条跟踪结果）：

```
curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"trace_filter", "params":[{"fromBlock":"0x4E20","toBlock":"0x5014","toAddress":["0x4E0078423a39EfBC1F8B5104540aC2650a756577"],"after":0,"count":20}]
  }'
```

节点将返回过滤后的跟踪信息结果（因篇幅过长，此处返回内容有所删减）。

![Trace Filter Node Running](/images/debugtrace/debugtrace-images3.png)
