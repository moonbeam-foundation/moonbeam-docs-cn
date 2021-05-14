随着Moonbase Alpha v7版本的发布，节点还提供对某些非标准RPC方法的访问，开发人员可以在运行时检查和调试事务。目前用户可以创建以下两种不同节点：

 - Geth调试API：具体来说是`debug_traceTransaction`方法。这将尝试以与执行事务相同的方式进行事务运行。有关此RPC方法详情，请见[此链接](https://geth.ethereum.org/docs/rpc/ns-debug#debug_tracetransaction)
 - OpenEthereum跟踪模块：具体来说是`trace_filter`方法。这将返回与作为RPC调用输入提供的特定过滤器匹配的跟踪。有关此RPC方法详情，请见[此链接](https://openethereum.github.io/JSONRPC-trace-module#trace_filter)

可通过使用以下标志激活以上所述功能：

 - `--ethapi=debug`：为`debug_traceTransaction` RPC调用Geth调试API

   `debug_traceTransaction` RPC call

 - `--ethapi=trace`：为`trace_filter` RPC调用OpenEthereum跟踪模块

   `trace_filter` RPC call

!!! 注意事项
    调试及跟踪功能均处于积极开发阶段。由于这些请求对CPU的要求颇高，所以建议运行带有`--execution=Native`标志的节点。这些节点（包括部分可执行文件）将在本地运行，而非存储在链上的Wasm二进制文件。

您可以在运行节点时组合两个标志。

在默认情况下，单个`trace_filter`请求被允许返回的跟踪条目上限为`500`。请求超过上限将返回错误。您可通过以下标志设置上限：

 - `--ethapi-trace-max-count <uint>`：设置节点要返回的跟踪条目上限

请求处理的区块被暂时存储在高速缓存中（默认时间为`300`秒），超出该时间的区块将被删除。您可通过以下标志设置删除时间：

 - `-ethapi-trace-cache-duration <uint>`：设置时间段（以秒为单位），超出该时间段后，该区块存储在`trace_filter,`的缓存将被删除