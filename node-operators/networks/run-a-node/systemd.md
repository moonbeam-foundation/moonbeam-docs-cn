---
title: 使用Systemd在Moonbeam上运行节点
description: 如何使用Systemd为Moonbeam网络运行一个平行链全节点，以便您能拥有自己的RPC端点或产生区块。
---

# 使用Systemd在Moonbeam上运行节点

## 概览 {: #introduction }

在基于Moonbeam的网络运行一个全节点使您能够连接至网络，与bootnode节点同步，获得RPC端点的本地访问，在平行链上创建区块，以及更多其他不同的功能。

在本指南中，您将学习如何使用[Systemd](https://systemd.io/){target=_blank}启动Moonbeam节点，以及如何维护和清理您的节点。

如果您有兴趣自己编译二进制文件（请注意这个过程可能需要超过30分钟并需要32GB内存）您可以查看[手动编译Moonbeam二进制文件](/node-operators/networks/run-a-node/compile-binary){target=_blank}指南。

## 查看先决条件 {: #checking-prerequisites }

以下小节将介绍使用二进制以及作为systemd服务运行Moonbeam全节点的操作流程。开始之前，您需要：
- 确认您的Ubuntu版本为18.04，20.04，或22.04。Moonbeam也可能与其他Linux版本相兼容，但目前我们仅测试了Ubuntu版本。
- 确保您的系统满足[基本要求](/node-operators/networks/run-a-node/overview#requirements){target=_blank}。连接至Kusama上的Moonriver或是Polkadot上的Moonbeam，通常需要几天时间来完成中继链内嵌的同步。

## 下载最新版二进制文件 {: #the-release-binary }

使用`wget`快速获取最新[发布的二进制文件](https://github.com/moonbeam-foundation/moonbeam/releases)：

=== "Moonbeam"

    ```bash
    wget https://github.com/moonbeam-foundation/moonbeam/releases/download/{{ networks.moonbeam.parachain_release_tag }}/moonbeam
    ```

=== "Moonriver"

    ```bash
    wget https://github.com/moonbeam-foundation/moonbeam/releases/download/{{ networks.moonriver.parachain_release_tag }}/moonbeam
    ``` 

=== "Moonbase Alpha"

    ```bash
    wget https://github.com/moonbeam-foundation/moonbeam/releases/download/{{ networks.moonbase.parachain_release_tag }}/moonbeam
    ```

您可以在您的终端运行`sha256sum`命令来确认您所下载的是否为正确版本，您应该看到以下输出：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.parachain_sha256sum }}
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.parachain_sha256sum }}
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.parachain_sha256sum }}
    ```

## 运行服务 {: #setup-the-service }

通过以下指令完成所有与服务运行相关的设置：

1. 首先，创建一个服务账户

    === "Moonbeam"

        ```bash
        adduser moonbeam_service --system --no-create-home
        ```

    === "Moonriver"

        ```bash
        adduser moonriver_service --system --no-create-home
        ```

    === "Moonbase Alpha"

        ```bash
        adduser moonbase_service --system --no-create-home
        ```

2. 创建一个目录来存储二进制文件和数据（您可能需要`sudo`）：

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

3. 将上一小节所创建的二进制文件复制到创建的文件夹中（可能需要`sudo`）：

    === "Moonbeam"

        ```bash
        mv ./{{ networks.moonbeam.binary_name }} {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"

        ```bash
        mv ./{{ networks.moonriver.binary_name }} {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"

        ```bash
        mv ./{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}
        ```

4. 在存储链上数据的本地目录设置相应的权限:

    === "Moonbeam"

        ```bash
        sudo chown -R moonbeam_service {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"

        ```bash
        sudo chown -R moonriver_service {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"

        ```bash
        sudo chown -R moonbase_service {{ networks.moonbase.node_directory }}
        ```

## 创建配置文件 {: #create-the-configuration-file }

接下来，创建systemd配置文件。如果您设定的是收集人节点，请确认您使用的是[收集人](#收集人--collator)的代码段。

首先您需要创建一个名为`/etc/systemd/system/moonbeam.service`的文件来储存配置信息。

请注意，在以下的启动配置中，您需要：

 - 将 `INSERT_YOUR_NODE_NAME` 改成您选择的节名名字。您需要在两个地方更改这个数值：平行链一个，中继链一次
 - 用服务器实际RAM的50%替换`INSERT_RAM_IN_MB`。例如服务器有32 GB RAM，这里则应配置为 `16000`. 内存配置最低值为 `2000`，但这将低于推荐配置
 - 再次检查确认二进制文件是否位于以下正确路径 (*ExecStart*)
 - 如果您使用不同目录，请再次检查基本路径

 有关以下启动命令中使用的标志的概述，以及其他常用标志，请参阅我们文档的[Flags](/node-operators/networks/run-a-node/flags){target=_blank}页面。

### 全节点 {: #full-node }

=== "Moonbeam"

    ```bash
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
         --state-pruning=archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbeam.node_directory }} \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonriver"

    ```bash
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
         --state-pruning=archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonriver.node_directory }} \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonbase Alpha"

    ```bash
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
         --state-pruning=archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"

    [Install]
    WantedBy=multi-user.target
    ```

--8<-- 'text/node-operators/networks/run-a-node/external-access.md'

??? code "Moonbeam启动命令实例"

    ```bash
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
         --state-pruning=archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbeam.node_directory }} \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         --unsafe-rpc-external \
         -- \
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"

    [Install]
    WantedBy=multi-user.target
    ```

--8<-- 'text/node-operators/networks/run-a-node/sql-backend.md'

??? code "Moonbeam启动命令实例"

    ```bash
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
         --state-pruning=archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbeam.node_directory }} \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         --frontier-backend-type sql \
         -- \
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"

    [Install]
    WantedBy=multi-user.target
    ```

### 收集人 {: #collator }

=== "Moonbeam"

    ```bash
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
         --collator \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbeam.node_directory }} \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonriver"

    ```bash
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
         --collator \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonriver.node_directory }} \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonbase Alpha"

    ```bash
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
         --collator \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"

    [Install]
    WantedBy=multi-user.target
    ```

## 运行服务 {: #run-the-service }

--8<-- 'text/node-operators/networks/run-a-node/systemd/run-service.md'

![Service Status](/images/node-operators/networks/run-a-node/systemd/systemd-1.webp)

您也可以执行以下命令检查日志：

```bash
journalctl -f -u moonbeam.service
```

![Service Logs](/images/node-operators/networks/run-a-node/systemd/systemd-2.webp)

在同步过程中，您既会看到镶嵌中继链([Relaychain])的日志也会看到平行链([🌗])的日志。日志展示了目标区块(实时网络中的state)与最好区块（本地网络同步state）。

!!! 注意事项
    同步相应的内嵌中继链需要数天的时间，请注意您的系统符合[要求](/node-operators/networks/run-a-node/overview#requirements){target=_blank}。

如果出于任何原因需要停止服务，可以运行：

```bash
systemctl stop moonbeam.service
```

## 维护您的系统 {: #maintain-your-node }

随着Moonbeam网络不断发展，有时需要升级节点软件。升级版本发布后，我们将通过[Discord channel](https://discord.gg/PfpUATX)通知节点运营者，并告知这些升级是否为必要升级（一些客户端升级为可选操作）。升级过程简单直接，并且对于全节点及收集人，其升级过程一样。

如果您想要更新您的客户端，您可以保持现有的链数据原封不动，只需按照以下步骤更新二进制文件：

1. 停止systemd服务

    ```bash
    sudo systemctl stop moonbeam.service
    ```

2. 移除二进制文件的旧版本

    === "Moonbeam"

        ```bash
        rm  {{ networks.moonbeam.node_directory }}/moonbeam
        ```

    === "Moonriver"

        ```bash
        rm  {{ networks.moonriver.node_directory }}/moonbeam
        ```

    === "Moonbase Alpha"

        ```bash
        rm  {{ networks.moonbase.node_directory }}/moonbeam
        ```

3. 从[Moonbeam GitHub Release](https://github.com/moonbeam-foundation/moonbeam/releases/)页面获取Moonbeam的最新版本

4. 更新版本

    ```bash
    wget https://github.com/moonbeam-foundation/moonbeam/releases/download/INSERT_NEW_VERSION_TAG/moonbeam
    ```

5. 将二进制文件移动到数据目录：

    === "Moonbeam"

        ```bash
        mv ./{{ networks.moonbeam.binary_name }} {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"

        ```bash
        mv ./{{ networks.moonriver.binary_name }} {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"

        ```bash
        mv ./{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}
        ```

    !!! note
        如果您使用的是[手动编译二进制文件](/node-operators/networks/run-a-node/compile-binary){target=_blank}，您需要将文件从 `./target/release/{{ networks.moonbeam.binary_name }}`移至数据目录。

6. 更新权限：

    === "Moonbeam"

        ```bash
        chmod +x moonbeam
        chown moonbeam_service moonbeam
        ```

    === "Moonriver"

        ```bash
        chmod +x moonbeam
        chown moonriver_service moonbeam
        ```

    === "Moonbase Alpha"

        ```bash
        chmod +x moonbeam
        chown moonbase_service moonbeam
        ```

7. 启动您的服务

    ```bash
    systemctl start moonbeam.service
    ```

您可以运行[这些命令](#run-the-service)来查看节点的状态或日志。

## 清除节点 {: #purge-your-node }

如果您需要Moonbeam节点的新实例，您可以通过删除相关联的数据目录来清除您的节点。

首先，您需要停止systemd服务：

```bash
sudo systemctl stop moonbeam
```

您可以运行以下命令清除您的平行链和中继链数据：

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