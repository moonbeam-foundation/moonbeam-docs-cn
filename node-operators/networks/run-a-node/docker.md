---
title: 使用Docker运行节点
description: 如何使用Docker为Moonbeam网络运行一个全平行链节点，以便您能拥有自己的RPC端点或产生区块。
---

# 使用Docker在Moonbeam上运行节点

## 概览 {: #introduction }

在基于Moonbeam的网络运行一个全节点使您能够连接至网络，与bootnode节点同步，获得RPC端点的本地访问，在平行链上创建区块，以及更多其他不同的功能。

## 安装指引 {: #installation-instructions }

使用Docker可以快速创建Moonbeam节点。关于安装Docker的更多资讯，请访问[此页面](https://docs.docker.com/get-docker/)。截至本文截稿，所使用的Docker版本为19.03.6。当您连接至Kusama上的Moonriver，或Polkadot上的Moonbeam时，将需要数天的时间同步相应中继链内嵌入的数据。请确认您的系统符合以下[要求](/node-operators/networks/run-a-node/overview#requirements)。

创建一个本地目录以储存链上数据：

=== "Moonbeam"

    ```bash
    mkdir {{ networks.moonbeam.node_directory }}
    ```

=== "Moonriver"

    ```bash
    mkdir {{ networks.moonriver.node_directory }}
    ```

=== "Moonbase Alpha"

    ```bash
    mkdir {{ networks.moonbase.node_directory }}
    ```

接着，请确认您已经为储存链数据的本地目录设定所有权和权限许可。在本示例中，为特定用户或当前用户设置必要权限许可（为将要运行`docker`命令的用户替换为`INSERT_DOCKER_USER`）：

=== "Moonbeam"

    ```bash
    # chown to a specific user
    chown INSERT_DOCKER_USER {{ networks.moonbeam.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonbeam.node_directory }}
    ```

=== "Moonriver"

    ```bash
    # chown to a specific user
    chown INSERT_DOCKER_USER {{ networks.moonriver.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonriver.node_directory }}
    ```

=== "Moonbase Alpha"

    ```bash
    # chown to a specific user
    chown INSERT_DOCKER_USER {{ networks.moonbase.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonbase.node_directory }}
    ```
    
下一步，执行Docker运行的命令。如果您设定的是收集人节点，确认您使用的是[收集人](#收集人--collator)代码段。注意，您需要替换：

 - 在两处替换 `INSERT_YOUR_NODE_NAME` 
 - 用服务器实际RAM的50%替换 `<50% RAM in MB>`。例如服务器有32 GB RAM，这里则应配置为 `16000`. 内存配置最低值为 `2000`，但这将低于推荐配置

!!! 注意事项
    对于v0.27.0之前的客户端版本，`--state-pruning`标志被命名为`--pruning`。

    对于v0.30.0之前的客户端版本，`--rpc-port`用于指定HTTP连接的端口，`--ws-port`用于指定WS连接的端口。从客户端版本v0.30.0开始，`--rpc-port`已被弃用，`--ws-port`命令行标志同时适用于HTTP连接和WS连接。类似地，`--rpc-max-connections`命令行标志已被弃用，现在被硬编码为100。您可以使用`--ws-max-connections`来调整HTTP和WS连接的总限制。

### 全节点 {: #full-node }

???+ code "Linux snippets"

    === "Moonbeam"

        ```bash
        docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path=/data \
        --chain {{ networks.moonbeam.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --db-cache <50% RAM in MB> \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "Moonriver"

        ```bash
        docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
        --base-path=/data \
        --chain {{ networks.moonriver.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --db-cache <50% RAM in MB> \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "Moonbase Alpha"

        ```bash
        docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
        --base-path=/data \
        --chain {{ networks.moonbase.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --db-cache <50% RAM in MB> \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

??? code "MacOS snippets"

    === "Moonbeam"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path=/data \
        --chain moonbeam \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "Moonriver"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/moonriver-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
        --base-path=/data \
        --chain moonriver \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "Moonbase Alpha"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/alphanet-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
        --base-path=/data \
        --chain alphanet \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

!!! 注意事项
    如果您想要运行RPC终端、连接至Polkadot.js Apps或是运行您自己的应用，使用`--unsafe-rpc-external`和/或`--unsafe-ws-external`标志来运行能够从外部访问RPC端口的全节点。您能够通过执行`moonbeam --help`以获得更多细节。我们**不建议**收集人节点使用此配置。

### 收集人 {: #collator }

???+ code "Linux snippets"

    === "Moonbeam"

        ```bash
        docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path=/data \
        --chain {{ networks.moonbeam.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --collator \
        --trie-cache-size 1073741824 \
        --db-cache <50% RAM in MB> \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "Moonriver"

        ```bash
        docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
        --base-path=/data \
        --chain {{ networks.moonriver.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --collator \
        --trie-cache-size 1073741824 \
        --db-cache <50% RAM in MB> \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "Moonbase Alpha"

        ```bash
        docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
        --base-path=/data \
        --chain {{ networks.moonbase.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --collator \
        --trie-cache-size 1073741824 \
        --db-cache <50% RAM in MB> \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

??? code "MacOS snippets"

    === "Moonbeam"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path=/data \
        --chain moonbeam \
        --name="INSERT_YOUR_NODE_NAME" \
        --collator \
        --trie-cache-size 1073741824 \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "Moonriver"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/moonriver-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
        --base-path=/data \
        --chain moonriver \
        --name="INSERT_YOUR_NODE_NAME" \
        --collator \
        --trie-cache-size 1073741824 \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "Moonbase Alpha"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/alphanet-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
        --base-path=/data \
        --chain alphanet \
        --name="INSERT_YOUR_NODE_NAME" \
        --collator \
        --trie-cache-size 1073741824 \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

!!! 注意事项
    有关上述标志的概述，请参阅开发者文档的[标志](/node-operators/networks/run-a-node/flags){target=_blank}页面。

在Docker拉取必要的镜像后，您的Moonbeam（或Moonriver）全节点将启动并显示许多信息，如区块链参数、节点名称、作用、创世状态等：

![Full Node Starting](/images/node-operators/networks/run-a-node/docker/full-node-docker-1.png)

!!! 注意事项
    您可使用`--promethues-port XXXX`标志（将`XXXX`替换成真实的端口号）指定自定义Prometheus端口，平行链和嵌入式中继链都可以进行这项操作。

```bash
docker run -p {{ networks.relay_chain.p2p }}:{{ networks.relay_chain.p2p }} -p {{ networks.parachain.p2p }}:{{ networks.parachain.p2p }} -p {{ networks.parachain.ws }}:{{ networks.parachain.ws }} # rest of code goes here
```

在同步过程中，您将看到嵌入式中继链和平行链的消息（无标签）。这些消息将显示目标区块（实时网络状态）和最佳区块（本地节点同步状态）。

![Full Node Starting](/images/node-operators/networks/run-a-node/docker/full-node-docker-2.png)

!!! 注意事项
    同步相应的内嵌中继链需要数天的时间，请注意您的系统符合[要求](/node-operators/networks/run-a-node/overview#requirements)。

如果您按照Moonbase Alpha的节点教程操作，当同步完成，您将获得一个在本地运行的Moonbase Alpha测试网节点！

如果您按照Moonriver或Moonbeam的节点教程操作，当同步完成，您将能够与同类节点连接并且能够看到在Moonriver/Moonbeam网络上生产的区块！请注意，这个部分将会需要数天时间来先同步中继链数据。

## 客户端升级 {: #update-the-client }

随着Moonbeam网络不断发展，有时需要升级节点软件。升级版本发布后，我们将通过[Discord channel](https://discord.gg/PfpUATX)通知节点运营者，并告知这些升级是否为必要升级（一些客户端升级为可选操作）。升级过程简单直接，并且全节点及收集人的升级过程一样。

1. 停止Docker容器：

    ```bash
    sudo docker stop INSERT_CONTAINER_ID
    ```
    
2. 从[Moonbeam GitHub Release](https://github.com/moonbeam-foundation/moonbeam/releases/)页面获取Moonbeam的最新版本

3. 使用最新版本启动您的节点。您需要将[全节点](#full-node)或[收集人](#collator)命令的版本替换成最新版本，并运行它

当您的节点再次运行时，您将在您的终端看到日志。

## 清除节点 {: #purge-your-node }

如果您需要Moonbeam节点的新实例，您可以通过删除相关联的数据目录来清除您的节点。

首先，您想需要停止Docker容器：

```bash
  sudo docker stop INSERT_CONTAINER_ID
```

如果您在启动节点的时候未使用`-v`标志来指定用于存储链数据的本地目录，则数据文件夹会与Docker容器本身相关。因此，移除Docker容器将移除链数据。

如果您使用`-v`标志启动节点，则需要清除指定的目录。例如，对于直接关联的数据，您可以运行以下命令来清除您的平行链和中继链数据：

=== "Moonbeam"

    ```bash
    sudo rm -rf {{ networks.moonbeam.node_directory }}/*
    ```

=== "Moonriver"

    ```bash
    sudo rm -rf {{ networks.moonriver.node_directory }}/*
    ```

=== "Moonbase Alpha"

    ```bash
    sudo rm -rf {{ networks.moonbase.node_directory }}/*
    ```

仅为指定链移除平行链数据，您可运行以下命令：

=== "Moonbeam"

    ```bash
    sudo rm -rf {{ networks.moonbeam.node_directory }}/chains/*
    ```

=== "Moonriver"

    ```bash
    sudo rm -rf {{ networks.moonriver.node_directory }}/chains/*
    ```

=== "Moonbase Alpha"

    ```bash
    sudo rm -rf {{ networks.moonbase.node_directory }}/chains/*
    ```

同样地，仅移除中继链数据，您可运行以下命令：

=== "Moonbeam"

    ```bash
    sudo rm -rf {{ networks.moonbeam.node_directory }}/polkadot/*
    ```

=== "Moonriver"

    ```bash
    sudo rm -rf {{ networks.moonriver.node_directory }}/polkadot/*
    ```

=== "Moonbase Alpha"

    ```bash
    sudo rm -rf {{ networks.moonbase.node_directory }}/polkadot/*
    ```

--8<-- 'text/node-operators/networks/run-a-node/post-purge.md'
