---
title: 运行追踪节点
description: 学习如何运用Geth的Debug和Txpool API，以及OpenEthereum的Trace模块在Moonbeam上运行节点
---

# Debug API和Trace模块

![Debug & Trace Moonbeam Banner](/images/node-operators/networks/tracing-node/tracing-node-banner.png)

## 概览 {: #introduction }

Geth的`debug`和`txpool` API以及OpenEthereum的`trace`模块提供一个非标准RPC方法以获得交易处理的深度信息。作为Moonbeam为开发者提供无缝以太坊开发体验目标的其中一部分，Moonbeam支持部分非标准RPC方法。支持这些RPC方法是个重要的里程碑，因为如[The Graph](https://thegraph.com/)或[Blockscout](https://docs.blockscout.com/)等项目仰赖这些方法检索区块链数据。 

想要使用支持的RPC方法，您需要运行一个追踪节点。与运行一个全节点略有不同，追踪节点使用一个不同的Docker镜像，名为`purestake/moonbeam-tracing`，运用其来实现追踪功能。同时，也需使用额外的标识来告诉节点需要支持哪个非标准功能。

本教程将介绍如何使用`debug`、`txpool`以及`tracing`在Moonbeam上运行一个追踪节点。

## 查看先决条件 {: #checking-prerequisites }

在运行一个追踪节点前，您需要安装Docker。关于安装Docker的更多信息，请访问[此网页](https://docs.docker.com/get-docker/)。撰写本教程时，使用的Docker版本为19.03.6。

如果您在先前尚未运行过Moonbeam全节点，您将会需要建立一个目录以储存链数据：

=== "Moonbase Alpha"
    ```
    mkdir {{ networks.moonbase.node_directory }}
    ```

=== "Moonriver"
    ```
    mkdir {{ networks.moonriver.node_directory }}
    ```

接着，确认您根据储存链数据的本地目录设定所有权和许可权。在本示例中，您需要为特定或是现有用户设定所需的许可权（将`DOCKER_USER`替换为将运行`docker`命令的实际用户）：

=== "Moonbase Alpha"

    ```
    # chown to a specific user
    chown DOCKER_USER {{ networks.moonbase.node_directory }}
    
    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonbase.node_directory }}
    ```

=== "Moonriver"
    ```
    # chown to a specific user
    chown DOCKER_USER {{ networks.moonriver.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonriver.node_directory }}
    ```

## 运行一个追踪节点 {: #run-a-tracing-node }

运行一个`debug`、`txpool`和`tracing`节点类似于[运行一个全节点](/node-operators/networks/run-a-node/overview/)。您将会需要使用`purestake/moonbeam-tracing`镜像，而非标准`purestake/moonbeam` Docker镜像。最新的支持版本可以在[Docker Hub for the `moonbeam-tracing` image](https://hub.docker.com/r/purestake/moonbeam-tracing/tags)上找到。

您同样需要根据您启用的功能使用以下标识开始您的节点：

  - **`--ethapi=debug`** — 选择性标识，启用`debug_traceTransaction`、`debug_traceBlockByNumber`和`debug_traceBlockByHash`
  - **`--ethapi=trace`** — 选择性标识，启用`trace_filter` 
  - **`--ethapi=txpool`** — 选择性标识，启用`txpool_content`、`txpool_inspect`和`txpool_status`
  - **`--wasm-runtime-overrides=/moonbeam/<network>-substitutes-tracing`** — 用于追踪指定存储本地WASM runtime路径的**必备**标识。接受网络作为参数`moonbase`（用于开发节点和 Moonbase Alpha）或`moonriver`

运行追踪节点的完整命令如以下所示：

!!! note
    用服务器实际RAM的50%替换 `<50% RAM in MB>`。例如服务器有32 GB RAM，这里则应配置为 `16000`. 内存配置最低值为 `2000`，但这将低于推荐配置。

=== "Moonbeam Development Node"
    ```
    docker run --network="host" -v "/var/lib/alphanet-data:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    {{ networks.development.tracing_tag }} \
    --base-path=/data \
    --name="Moonbeam-Tutorial" \
    --pruning archive \
    --state-cache-size 1 \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing \
    --dev
    ```

=== "Moonbase Alpha"
    ```
    docker run --network="host" -v "/var/lib/alphanet-data:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    {{ networks.moonbase.tracing_tag }} \
    --base-path=/data \
    --chain alphanet \
    --name="Moonbeam-Tutorial" \
    --pruning archive \
    --state-cache-size 1 \
    --db-cache <50% RAM in MB> \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing \
    -- \
    --execution wasm \
    --pruning archive \
    --name="Moonbeam-Tutorial (Embedded Relay)"
    ```

=== "Moonriver"
    ```
    docker run --network="host" -v "/var/lib/alphanet-data:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    {{ networks.moonriver.tracing_tag }} \
    --base-path=/data \
    --chain moonriver \
    --name="Moonbeam-Tutorial" \
    --pruning archive \
    --state-cache-size 1 \
    --db-cache <50% RAM in MB> \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonriver-substitutes-tracing \
    -- \
    --execution wasm \
    --pruning archive \
    --name="Moonbeam-Tutorial (Embedded Relay)"
    ```

!!! 注意事项
    ​如果您希望运行一个RPC终端以连接polkadot.js.org或是运行自有应用，请使用`--unsafe-rpc-external`或是`--unsafe-ws-external`标识以运行一个能够外部访问RPC接口的全节点。更多细节可以通过运行`moonbeam --help`命令获得。

如果您已经成功运行Moonbase Alpha追踪节点，您应当会见到如下图所示的终端日志：

![Debug API](/images/builders/tools/debug-trace/debug-trace-1.png)

## 其他标识 {: #additional-flags }

想要使用作为节点可执行文件的一部分包含的本机runtime而不是存储在链上的Wasm二进制文件，请运行以下命令：

  - **`--execution=native`** — 设定需要由`native`使用的所有执行内容的执行策略

一般而言，允许追踪一个`trace_filter`追踪条目返回的最大数量为`500`。超过此限制的请求将会返回错误指示。您可以使用以下标识设置另外一个不同的最大限制：

  - **`--ethapi-trace-max-count <uint>`** — 设定节点返回跟踪条目的最大数量

请求处理的区块会临时存储在缓存中一段时间（初始设置为`300`秒），之后将被删除。您可以使用以下标志设置不同的删除时间：

  - **`-ethapi-trace-cache-duration <uint>`** — 设置持续时间（以秒为单位），在此之后给定块的`trace_filter`缓存被丢弃

## 使用一个追踪节点 {: #using-a-tracing-node }

想要了解其他在Moonbeam上的可用非标准RPC方法，以及如何通过追踪节点使用这些方法，请访问[Debug & Trace](/builders/tools/debug-trace/)教程。