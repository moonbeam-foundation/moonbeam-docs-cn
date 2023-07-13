---
title: 运行追踪节点
description: 学习如何运用Geth的Debug和Txpool API，以及OpenEthereum的Trace模块在Moonbeam上运行追踪节点
---

# 运行追踪节点

## 概览 {: #introduction }

Geth的`debug`和`txpool` API以及OpenEthereum的`trace`模块提供一个非标准RPC方法以获得交易处理的深度信息。作为Moonbeam为开发者提供无缝以太坊开发体验目标的其中一部分，Moonbeam支持部分非标准RPC方法。支持这些RPC方法是个重要的里程碑，因为如[The Graph](https://thegraph.com/){target=_blank}或[Blockscout](https://docs.blockscout.com/){target=_blank}等项目仰赖这些方法检索区块链数据。 

想要使用支持的RPC方法，您需要运行一个追踪节点。与运行一个全节点略有不同，追踪节点使用一个不同的Docker镜像，名为`purestake/moonbeam-tracing`，运用其来实现追踪功能。同时，也需使用额外的标志来告诉节点需要支持哪个非标准功能。

本教程将介绍如何使用`debug`、`txpool`以及`tracing`标志在Moonbeam上运行一个追踪节点。

## 查看先决条件 {: #checking-prerequisites }

与运行常规节点相似，您可以使用Docker或Systemd启动追踪节点。如果您选择使用Docker，您必须先[安装Docker](https://docs.docker.com/get-docker/){target=_blank}。撰写本教程时，使用的Docker版本为19.03.6。

## 追踪节点标志 {: #tracing-node-flags }

运行一个`debug`、`txpool`和`tracing`节点类似于[运行一个全节点](/node-operators/networks/run-a-node/overview/){target=_blank}。另外，您可以根据您启用的特定追踪功能使用以下标志：

  - **`--ethapi=debug`** —— 选择性标志，启用`debug_traceTransaction`、`debug_traceBlockByNumber`和`debug_traceBlockByHash`
  - **`--ethapi=trace`** —— 选择性标志，启用`trace_filter` 
  - **`--ethapi=txpool`** —— 选择性标志，启用`txpool_content`、`txpool_inspect`和`txpool_status`
  - **`--wasm-runtime-overrides=<path/to/overrides>`** —— **必备**标志，用于追踪指定存储本地WASM runtime路径。如果您使用的是Docker，路径则为`/moonbeam/<network>-substitutes-tracing`。接受网络作为参数： `moonbeam`、`moonriver`或`moonbase`（用于开发节点和 Moonbase Alpha）
  - **`--runtime-cache-size 64`** —— **必备**标志，将内存缓存中保留的不同runtime版本的数量配置为64
  - **`--execution=wasm`** —— 将所有执行上下文应该使用的执行策略设置为`wasm`。换句话说，这可以使用存储在链上的Wasm二进制文件
  - **`--ethapi-trace-max-count <uint>`** —— 设定节点返回最大追踪条目数。`trace_filter`的单个请求返回的默认最大追踪条目数为`500`
  - **`-ethapi-trace-cache-duration <uint>`** —— 设置持续时间（以秒为单位），在此之后给定块的`trace_filter`缓存被丢弃。区块存储在缓存中的默认时间为`300`秒

!!! 注意事项
    如果您希望运行一个RPC端点以连接Polkadot.js Apps或是运行自有应用，请使用`--unsafe-rpc-external`和/或`--unsafe-ws-external`标志以运行一个能够外部访问RPC端口的完整节点。更多细节可以通过运行`moonbeam --help`命令获得。

## 使用Docker运行一个追踪节点 {: #run-a-tracing-node-with-docker }

如果您之前未运行过标准的完整Moonbeam节点，您将需要设置一个目录来存储链数据：

=== "Moonbeam"
    ```
    mkdir {{ networks.moonbeam.node_directory }}
    ```

=== "Moonriver"
    ```
    mkdir {{ networks.moonriver.node_directory }}
    ```

=== "Moonbase Alpha"
    ```
    mkdir {{ networks.moonbase.node_directory }}
    ```

在开始操作之前，您将需要为指定或目前的用户设置必要的权限（将`DOCKER_USER`替换为要运行`docker`命令的实际用户）：

=== "Moonbeam"
    ```
    # chown to a specific user
    chown DOCKER_USER {{ networks.moonbeam.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonbeam.node_directory }}
    ```

=== "Moonriver"
    ```
    # chown to a specific user
    chown DOCKER_USER {{ networks.moonriver.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonriver.node_directory }}
    ```

=== "Moonbase Alpha"
    ```
    # chown to a specific user
    chown DOCKER_USER {{ networks.moonbase.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonbase.node_directory }}
    ```

您将需要使用`purestake/moonbeam-tracing`图像替代`purestake/moonbeam` docker图像。您可在[Docker Hub的`moonbeam-tracing`图像](https://hub.docker.com/r/purestake/moonbeam-tracing/tags)中找到最新的支持版本。

下一步，执行Docker运行的命令。注意，您需要替换：

 - 在两处替换 `YOUR-NODE-NAME` 
 - 用服务器实际RAM的50%替换 `<50% RAM in MB>`。例如服务器有32 GB RAM，这里则应配置为 `16000`. 内存配置最低值为 `2000`，但这将低于推荐配置

!!! 注意事项
    对于v0.27.0之前的客户端版本，`--state-pruning`标志被命名为`--pruning`。

    对于v0.30.0之前的客户端版本，`--rpc-port`用于指定HTTP连接的端口，`--ws-port`用于指定WS连接的端口。从客户端版本v0.30.0开始，`--rpc-port`已被弃用，`--ws-port`命令行标志同时适用于HTTP连接和WS连接。类似地，`--rpc-max-connections`命令行标志已被弃用，现在被硬编码为100。您可以使用`--ws-max-connections`来调整HTTP和WS连接的总限制。

运行一个追踪节点的完整命令如下所示：

=== "Moonbeam"
    ```
    docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    {{ networks.moonbeam.tracing_tag }} \
    --base-path=/data \
    --chain {{ networks.moonbeam.chain_spec }} \
    --name="YOUR-NODE-NAME" \
    --state-pruning archive \
    --trie-cache-size 0 \
    --db-cache <50% RAM in MB> \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonbeam-substitutes-tracing \
    --runtime-cache-size 64 \
    -- \
    --execution wasm \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

=== "Moonriver"
    ```
    docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    {{ networks.moonriver.tracing_tag }} \
    --base-path=/data \
    --chain {{ networks.moonriver.chain_spec }} \
    --name="YOUR-NODE-NAME" \
    --state-pruning archive \
    --trie-cache-size 0 \
    --db-cache <50% RAM in MB> \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonriver-substitutes-tracing \
    --runtime-cache-size 64 \
    -- \
    --execution wasm \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

=== "Moonbase Alpha"
    ```
    docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    {{ networks.moonbase.tracing_tag }} \
    --base-path=/data \
    --chain {{ networks.moonbase.chain_spec }} \
    --name="YOUR-NODE-NAME" \
    --state-pruning archive \
    --trie-cache-size 0 \
    --db-cache <50% RAM in MB> \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing \
    --runtime-cache-size 64 \
    -- \
    --execution wasm \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

=== "Moonbeam开发节点"
    ```
    docker run --network="host" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    {{ networks.development.tracing_tag }} \
    --name="YOUR-NODE-NAME" \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing \
    --runtime-cache-size 64 \
    --dev
    ```

如果您已经成功运行Moonbase Alpha追踪节点，您应当会见到如下图所示的终端日志：

![Debug API](/images/builders/build/eth-api/debug-trace/debug-trace-1.png)

## 使用Systemd运行一个追踪节点 {: #run-a-tracing-node-with-systemd }

当您使用Systemd运行一个节点时，您需要先设置Moonbeam二进制文件。您可遵循[使用Systemd在Moonbeam上运行一个节点](/node-operators/networks/run-a-node/systemd/){target=_blank}的操作说明进行操作。一般来说，您将需要：

1. 通过[已发布的二进制文件](/node-operators/networks/run-a-node/systemd/#the-release-binary){target=_blank}说明设置Moonbeam二进制文件。您也可以遵循[编译二进制文件](/node-operators/networks/run-a-node/systemd/#compile-the-binary){target=_blank}的说明自行编译二进制文件

2. 遵循[设置服务器](/node-operators/networks/run-a-node/systemd/#setup-the-service){target=_blank}的说明进行操作

当您完成操作说明中的特定部分，您可以继续执行以下操作。

### 设置Wasm Overrides {: #setup-the-wasm-overrides }

您将需要为Wasm runtime overrides创建一个目录，并从GitHub上的[Moonbeam Runtime Overrides repository](https://github.com/PureStake/moonbeam-runtime-overrides){target=_blank}中获取。

您可以将代码库复制到本地计算机上的任何位置。简单来说，您可以使用存储链上数据的目录。要设置Wasm override文件，您可以执行以下步骤：

1. 复制[Moonbeam Runtime Overrides repository](https://github.com/PureStake/moonbeam-runtime-overrides){target=_blank}

    ```
    git clone https://github.com/PureStake/moonbeam-runtime-overrides.git
    ```
    
2. 将Wasm overrides移到链上数据目录：

    === "Moonbeam"
        ```
        mv moonbeam-runtime-overrides/wasm {{ networks.moonbeam.node_directory }}
        ```
    
    === "Moonriver"
        ```
        mv moonbeam-runtime-overrides/wasm {{ networks.moonriver.node_directory }}
        ```
    
    === "Moonbase Alpha"
        ```
        mv moonbeam-runtime-overrides/wasm {{ networks.moonbase.node_directory }}
        ```
    
3. 您可以为未运行网络删除override文件

    === "Moonbeam"
        ```
        rm {{ networks.moonbeam.node_directory }}/wasm/moonriver-runtime-* &&  rm {{ networks.moonbeam.node_directory }}/wasm/moonbase-runtime-*
        ```
    
    === "Moonriver"
        ```
        rm {{ networks.moonriver.node_directory }}/wasm/moonbeam-runtime-* &&  rm {{ networks.moonriver.node_directory }}/wasm/moonbase-runtime-*
        ```
    
    === "Moonbase Alpha"
        ```
        rm {{ networks.moonbase.node_directory }}/wasm/moonbeam-runtime-* &&  rm {{ networks.moonbase.node_directory }}/wasm/moonriver-runtime-*
        ```
    
4. 为overrides设置用户权限：

    === "Moonbeam"
        ```
        chmod +x {{ networks.moonbeam.node_directory }}/wasm/*
        chown moonbeam_service {{ networks.moonbeam.node_directory }}/wasm/*
        ```
    
    === "Moonriver"
        ```
        chmod +x {{ networks.moonriver.node_directory }}/wasm/*
        chown moonriver_service {{ networks.moonriver.node_directory }}/wasm/*
        ```
    
    === "Moonbase Alpha"
        ```
        chmod +x {{ networks.moonbase.node_directory }}/wasm/*
        chown moonbase_service {{ networks.moonbase.node_directory }}/wasm/*
        ```

### 创建配置文件 {: #create-the-configuration-file }

接下来是创建systemd配置文件，您将需要：

 - 在两个不同的地方替换`YOUR-NODE-NAME`
 - 将`<50% RAM in MB>`替换成服务器实际RAM的50%。举例而言，对于32 GB RAM，数值必须设置为`16000`。最低值为`2000`，但这低于推荐的规格
 - 再次确认二进制文件在正确的路径，如下所述 (_ExecStart_)
 - 如果您使用的是不同的目录，请再次确认基本路径
 - 将文件命名为`/etc/systemd/system/moonbeam.service`

!!! 注意事项
    对于v0.27.0之前的客户端版本，`--state-pruning`标志被命名为`--pruning`。
    
    对于v0.30.0之前的客户端版本，`--rpc-port`用于指定HTTP连接的端口，`--ws-port`用于指定WS连接的端口。从客户端版本v0.30.0开始，`--rpc-port`已被弃用，`--ws-port`命令行标志同时适用于HTTP连接和WS连接。类似地，`--rpc-max-connections`命令行标志已被弃用，现在被硬编码为100。您可以使用`--ws-max-connections`来调整HTTP和WS连接的总限制。

=== "Moonbeam"
    ```
    [Unit]
    Description="Moonbeam systemd service"
    After=network.target
    StartLimitIntervalSec=0
    
    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonbeam_service
    SyslogIdentifier=moonbeam
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonbeam.node_directory }}/{{ networks.moonbeam.binary_name }} \
         --execution wasm \
         --state-pruning=archive \
         --trie-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonbeam.node_directory }} \
         --ethapi=debug,trace,txpool \
         --wasm-runtime-overrides={{ networks.moonbeam.node_directory }}/wasm \
         --runtime-cache-size 64 \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --execution wasm \
         --name="YOUR-NODE-NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonriver"
    ```
    [Unit]
    Description="Moonriver systemd service"
    After=network.target
    StartLimitIntervalSec=0
    
    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonriver_service
    SyslogIdentifier=moonriver
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonriver.node_directory }}/{{ networks.moonriver.binary_name }} \
         --execution wasm \
         --state-pruning=archive \
         --trie-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonriver.node_directory }} \
         --ethapi=debug,trace,txpool \
         --wasm-runtime-overrides={{ networks.moonriver.node_directory }}/wasm \
         --runtime-cache-size 64 \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --execution wasm \
         --name="YOUR-NODE-NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonbase Alpha"
    ```
    [Unit]
    Description="Moonbase Alpha systemd service"
    After=network.target
    StartLimitIntervalSec=0

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonbase_service
    SyslogIdentifier=moonbase
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonbase.node_directory }}/{{ networks.moonbase.binary_name }} \
         --execution wasm \
         --state-pruning=archive \
         --trie-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonbase.node_directory }} \
         --ethapi=debug,trace,txpool \
         --wasm-runtime-overrides={{ networks.moonbase.node_directory }}/wasm \
         --runtime-cache-size 64 \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --execution wasm \
         --name="YOUR-NODE-NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

### 运行服务器 {: #run-the-service }

--8<-- 'text/systemd/run-service.md'

![Service Status](/images/node-operators/networks/tracing-node/tracing-1.png)

您也可以运行以下命令查看启用的追踪节点的日志：

```
journalctl -f -u moonbeam.service
```

您的终端将会显示如下图所示的日志：

![Service logs of wasm rutime overrides being processed](/images/node-operators/networks/tracing-node/tracing-2.png)

## 使用一个追踪节点 {: #using-a-tracing-node }

想要了解其他在Moonbeam上的可用非标准RPC方法，以及如何通过追踪节点使用这些方法，请查看[Debug & Trace](/builders/build/eth-api/debug-trace/)教程。