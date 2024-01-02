---
title: 使用Docker运行节点
description: 如何使用Docker为Moonbeam网络运行一个全平行链节点，以便您能拥有自己的RPC端点或产生区块。
---

# 使用Docker在Moonbeam上运行节点

## 概览 {: #introduction }

在基于Moonbeam的网络运行一个全节点使您能够连接至网络，与bootnode节点同步，获得RPC端点的本地访问，在平行链上创建区块，以及更多其他不同的功能。

在本指南中，您将学习如何使用[Docker](https://www.docker.com/){target=_blank}快速启动 一个Moonbeam节点，以及如何维护和清理您的节点。

## 检查先决条件 {: #checking-prerequisites }

开始之前,您需要:
- [安装Docker](https://docs.docker.com/get-docker/){target=_blank}。截止本文截稿, Docker使用的版本为24.0.6
- 确保您的系统满足[基本要求](/node-operators/networks/run-a-node/overview#requirements){target=_blank}。连接至Kusama上的Moonriver或是Polkadot上的Moonbeam，通常需要几天时间来完成中继链内嵌的同步。

## 设置链数据的储存空间 {: #storage-chain-data }

设置一个目录来储存链数据，您需要：

1. 创建一个本地目录

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

2. 接着，请确认您已经为储存链数据的本地目录设定所有权和权限许可。您为特定用户或当前用户设置必要权限许可（将`INSERT_DOCKER_USER`替换为运行`docker`命令的用户）：

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

## 初始命令 {: #start-up-commands }

开始节点需要执行`docker run`命令。如果您设定的是收集人节点，确认您使用的是[收集人](#收集人--collator)代码段。

注意，在以下初始命令中，您需要：

 - 将 `INSERT_YOUR_NODE_NAME` 改成您选择的节名名字。您需要在两个地方更改这个数值：平行链一个，中继链一次
 - 用服务器实际RAM的50%替换`INSERT_RAM_IN_MB`。例如服务器有32 GB RAM，这里则应配置为 `16000`. 内存配置最低值为 `2000`，但这将低于推荐配置

了解更多初始命令的不同选项与其他常用选项，请参考文档的[Flags](/node-operators/networks/run-a-node/flags){target=_blank}页面。

### 全节点 {: #full-node }

???+ code "Linux代码片段"

    === "Moonbeam"

        ```bash
        docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path=/data \
        --chain {{ networks.moonbeam.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --db-cache INSERT_RAM_IN_MB \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "Moonriver"

        ```bash
        docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
        --base-path=/data \
        --chain {{ networks.moonriver.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --db-cache INSERT_RAM_IN_MB\
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "Moonbase Alpha"

        ```bash
        docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
        --base-path=/data \
        --chain {{ networks.moonbase.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --db-cache INSERT_RAM_IN_MB\
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

??? code "MacOS代码片段"

    === "Moonbeam"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
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
        moonbeamfoundation/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
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
        moonbeamfoundation/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
        --base-path=/data \
        --chain alphanet \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

--8<-- 'text/node-operators/networks/run-a-node/external-access.md'

??? code "Moonbeam的启动命令示例"

    === "Linux"

        ```bash hl_lines="10"
        docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path=/data \
        --chain {{ networks.moonbeam.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --db-cache INSERT_RAM_IN_MB \
        --unsafe-rpc-external \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "MacOS"

        ```bash hl_lines="9"
        docker run -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path=/data \
        --chain moonbeam \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --unsafe-rpc-external \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

--8<-- 'text/node-operators/networks/run-a-node/sql-backend.md'

??? code "Moonbeam的启动命令示例"

    === "Linux"

        ```bash hl_lines="11"
        docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path=/data \
        --chain {{ networks.moonbeam.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        # This is a comment
        --db-cache INSERT_RAM_IN_MB \
        --frontier-backend-type sql \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "MacOS"

        ```bash hl_lines="9"
        docker run -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path=/data \
        --chain moonbeam \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --frontier-backend-type sql \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"


### 收集人节点 {: #collator }

???+ code "Linux snippets"

    === "Moonbeam"

        ```bash
        docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path=/data \
        --chain {{ networks.moonbeam.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --collator \
        --trie-cache-size 1073741824 \
        --db-cache INSERT_RAM_IN_MB\
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "Moonriver"

        ```bash
        docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
        --base-path=/data \
        --chain {{ networks.moonriver.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --collator \
        --trie-cache-size 1073741824 \
        --db-cache INSERT_RAM_IN_MB\
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "Moonbase Alpha"

        ```bash
        docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
        --base-path=/data \
        --chain {{ networks.moonbase.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --collator \
        --trie-cache-size 1073741824 \
        --db-cache INSERT_RAM_IN_MB\
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

??? code "MacOS snippets"

    === "Moonbeam"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
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
        moonbeamfoundation/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
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
        moonbeamfoundation/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
        --base-path=/data \
        --chain alphanet \
        --name="INSERT_YOUR_NODE_NAME" \
        --collator \
        --trie-cache-size 1073741824 \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

## 同步您的节点 {: #syncing-your-node }

在Docker拉取必要的镜像后，您的全节点将启动并显示许多信息，如区块链参数、节点名称、作用、创世状态等。

![Full Node Starting](/images/node-operators/networks/run-a-node/docker/full-node-docker-1.png)

在同步过程中，您既会看到镶嵌中继链([Relaychain])的日志也会看到平行链([🌗])的日志。日志展示了目标区块(实时网络中的state)与最好区块（本地网络同步state）。

![Full Node Starting](/images/node-operators/networks/run-a-node/docker/full-node-docker-2.png)

如果您使用的是Moonbase Alpha的安装指南，在同步后您会得到一个本地运行的Moonbase Alpha测试网节点！如果是Moonbeam或Moonriver，如果您按照Moonriver或Moonbeam的节点教程操作，当同步完成，您将能够与同类节点连接并且能够看到在Moonriver/Moonbeam网络上生产的区块！

!!! 注意事项
    同步相应的内嵌中继链需要数天的时间，请注意您的系统符合[要求](/node-operators/networks/run-a-node/overview#requirements)。

## 维护您的节点 {: #maintain-your-node }

随着Moonbeam网络不断发展，有时需要升级节点软件。升级版本发布后，我们将通过[Discord channel](https://discord.gg/PfpUATX)通知节点运营者，并告知这些升级是否为必要升级（一些客户端升级为可选操作）。升级过程简单直接，并且全节点及收集人的升级过程一样。

1. 停止Docker容器：

    ```bash
    sudo docker stop INSERT_CONTAINER_ID
    ```
    
2. 从[Moonbeam GitHub Release](https://github.com/moonbeam-foundation/moonbeam/releases/)页面获取Moonbeam的最新版本

3. 使用最新版本启动您的节点。您需要将开始命令中的的版本替换成最新版本，并运行它

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
