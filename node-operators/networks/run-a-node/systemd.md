---
title: 使用Systemd在Moonbeam上运行节点
description: 如何使用Systemd为Moonbeam网络运行一个平行链全节点，以便您能拥有自己的RPC端点或产生区块
---

# 使用Systemd在Moonbeam上运行节点

![Full Node Moonbeam Banner](/images/node-operators/networks/run-a-node/systemd/systemd-banner.png)

## 概览 {: #introduction }

在基于Moonbeam的网络运行一个全节点使您能够连接至网络，与bootnode节点同步，获得RPC端点的本地访问，在平行链上创建区块，以及更多其他不同的功能。

本教程的目标人群是有基于[Substrate](https://substrate.dev/)创建区块链经验的用户。运行平行链节点和Substrate节点大致相似，但仍存在一些差异。Substrate平行链节点将会是较大的工程，因为其包含平行链本身以及与中继链同步的代码，还有促进两者之间的交互同步。因此，这项工程相对较大，需要30分钟和32GB的存储空间。

!!! 注意事项
    Moonbase Alpha仍被视为是一个Alpha网络，因此其正常运行时间_不会_达到100%。平行链将不时地进行清理。在开发自己的应用程序时，请确保您已采取方法快速地将合约与账户重新部署到新的平行链。[Discord channel](https://discord.gg/PfpUATX)会至少提前24小时发布清理区块链的通知。

## 上手指南 {: #getting-started } 

以下小节将介绍使用二进制以及作为systemd服务运行Moonbeam全节点的操作流程。本教程所使用的示例基于Ubuntu 18.04的环境。Moonbeam也可能与其他Linux版本相兼容，但目前我们仅测试了Ubuntu版本。

如果您不想自己编译二进制文件，您可以使用[发布的二进制文件](#the-release-binary)。如果您想要自己编译二进制文件，请查看[编译二进制文件](#compile-the-binary)部分，安装依赖项和编译可能需要约30分钟。

## 发布的二进制文件 {: #the-release-binary }

使用`wget`快速获取最新[发布的二进制文件](https://github.com/PureStake/moonbeam/releases)：

=== "Moonbeam"
    ```
    wget https://github.com/PureStake/moonbeam/releases/download/{{ networks.moonbeam.parachain_release_tag }}/moonbeam
    ```

=== "Moonriver"
    ```
    wget https://github.com/PureStake/moonbeam/releases/download/{{ networks.moonriver.parachain_release_tag }}/moonbeam
    ``` 

=== "Moonbase Alpha"
    ```
    wget https://github.com/PureStake/moonbeam/releases/download/{{ networks.moonbase.parachain_release_tag }}/moonbeam
    ```

您可以在您的终端运行`sha256sum`命令来确认您所下载的是否为正确版本，您应该看到以下输出：

=== "Moonbeam"
    ```
    {{ networks.moonbeam.parachain_sha256sum }}
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.parachain_sha256sum }}
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.parachain_sha256sum }}
    ```

当您检索到二进制文件，您可以直接[运行systemd服务](#running-the-systemd-service)开始运行您的节点。

## 编译二进制文件 {: #compile-the-binary }

手动编译二进制文件需要约30分钟和32GB的存储空间。

以下命令将创建最新版本的Moonbeam平行链。

1. 克隆Moonbeam repo。

    ```
    git clone https://github.com/PureStake/moonbeam
    cd moonbeam
    ```

2. 检查最新版本：

    ```
    git checkout tags/$(git describe --tags)
    ```

3. 如果您已安装Rust，您可跳过以下两个步骤。如果您未安装Rust，请通过执行以下命令[通过Rust推荐方式](https://www.rust-lang.org/tools/install)安装Rust和其先决条件：

    ```
    --8<-- 'code/setting-up-node/installrust.md'
    ```

4. 接下来，通过运行以下命令更新您的PATH环境变量：

    ```
    --8<-- 'code/setting-up-node/updatepath.md'
    ```

5. 编译平行链二进制文件：

    ```
    cargo build --release
    ```

![Compiling Binary](/images/node-operators/networks/run-a-node/systemd/full-node-binary-1.png)

如果在终端显示_cargo not found error_的错误提示，请将Rust手动添加至您的系统路径或重启系统：

```
--8<-- 'code/setting-up-node/updatepath.md'
```

现在，您可以使用Moonbeam二进制文件运行systemd服务。

## 运行服务 {: #setup-the-service }

通过以下指令完成所有与服务运行相关的设置。

1. 首先，创建一个服务账户：

    === "Moonbeam"
        ```
        adduser moonbeam_service --system --no-create-home
        ```

    === "Moonriver"
        ```
        adduser moonriver_service --system --no-create-home
        ```

    === "Moonbase Alpha"
        ```
        adduser moonbase_service --system --no-create-home
        ```
   
2. 创建一个目录来存储二进制文件和数据（您可能需要`sudo`）：

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

3. 将上一小节所创建的二进制文件复制到创建的文件夹中。如果您是自己[编译二进制文件](#compile-the-binary)，则需要将二进制文件移动到目标目录（`./target/release/`）。或者，将Moonbeam二进制文件移动到根目录（可能需要`sudo`）：

    === "Moonbeam"
        ```
        mv ./{{ networks.moonbeam.binary_name }} {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"
        ```
        mv ./{{ networks.moonriver.binary_name }} {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"
        ```
        mv ./{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}
        ```

4. 在存储链上数据的本地目录设置相应的权限:

    === "Moonbeam"
        ```
        sudo chown -R moonbeam_service {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"
        ```
        sudo chown -R moonriver_service {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"
        ```
        sudo chown -R moonbase_service {{ networks.moonbase.node_directory }}
        ```

## 创建配置文件 {: #create-the-configuration-file }

接下来，创建systemd配置文件。如果您设定的是收集人节点，请确认您使用的是“收集人”的代码段。您需执行以下操作：

 - 替换两处`YOUR-NODE-NAME`
 - 用服务器实际RAM的50%替换 `<50% RAM in MB>`。例如服务器有32 GB RAM，这里则应配置为 `16000`. 内存配置最低值为 `2000`，但这将低于推荐配置。
 - 再次检查确认二进制文件是否位于以下正确路径 (*ExecStart*)
 - 如果您使用不同目录，请再次检查基本路径
 - 将文档命名为`/etc/systemd/system/moonbeam.service`

### 全节点 {: #full-node }

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
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --execution wasm \
         --wasm-execution compiled \
         --state-pruning=archive \
         --state-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonbeam.node_directory }} \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
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
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --execution wasm \
         --wasm-execution compiled \
         --state-pruning=archive \
         --state-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonriver.node_directory }} \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
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
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --execution wasm \
         --wasm-execution compiled \
         --state-pruning=archive \
         --state-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --execution wasm \
         --name="YOUR-NODE-NAME (Embedded Relay)"

    [Install]
    WantedBy=multi-user.target
    ```

### 收集人 {: #collator }

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
         --validator \
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --execution wasm \
         --wasm-execution compiled \
         --state-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonbeam.node_directory }} \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
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
         --validator \
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --execution wasm \
         --wasm-execution compiled \
         --state-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonriver.node_directory }} \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
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
         --validator \
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --execution wasm \
         --wasm-execution compiled \
         --state-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --execution wasm \
         --name="YOUR-NODE-NAME (Embedded Relay)"

    [Install]
    WantedBy=multi-user.target
    ```

!!! 注意事项
    如果您想要运行RPC终端、连接至polkadot.js.org或是运行您自己的应用，使用`--unsafe-rpc-external`和/或`--unsafe-ws-external`标志来运行能够从外部访问RPC端口的全节点。您能够通过执行`moonbeam --help`以获得更多细节。我们**不建议**收集人节点使用此配置。有关上述标志的概述，请参阅开发者文档的[标志](/node-operators/networks/run-a-node/flags){target=_blank}页面。

!!! 注意事项
    您可使用`--promethues-port XXXX`标志（将`XXXX`替换成真实的端口号）指定自定义Prometheus端口，平行链和嵌入式中继链都可以进行这项操作。

## 运行服务 {: #run-the-service }

--8<-- 'text/systemd/run-service.md'

![Service Status](/images/node-operators/networks/run-a-node/systemd/full-node-binary-2.png)

您也可以执行以下命令检查日志：

```
journalctl -f -u moonbeam.service
```

![Service Logs](/images/node-operators/networks/run-a-node/systemd/full-node-binary-3.png)

如果出于任何原因需要停止服务，可以运行：

```
systemctl stop moonbeam.service
```

## 更新客户端 {: #update-the-client }

随着Moonbeam网络不断发展，有时需要升级节点软件。升级版本发布后，我们将通过[Discord channel](https://discord.gg/PfpUATX)通知节点运营者，并告知这些升级是否为必要升级（一些客户端升级为可选操作）。升级过程简单直接，并且对于全节点及收集人，其升级过程一样。

如果您想要更新您的客户端，您可以保持现有的链数据原封不动，只需按照以下步骤更新二进制文件：

1. 停止systemd服务：

    ```
    sudo systemctl stop moonbeam.service
    ```
    
2. 移除二进制文件的旧版本：
   
    === "Moonbeam"
        ```
        rm  {{ networks.moonbeam.node_directory }}/moonbeam
        ```
    
    === "Moonriver"
        ```
        rm  {{ networks.moonriver.node_directory }}/moonbeam
        ```

    === "Moonbase Alpha"
        ```
        rm  {{ networks.moonbase.node_directory }}/moonbeam
        ```
        
3. 从[Moonbeam GitHub Release](https://github.com/PureStake/moonbeam/releases/)页面获取Moonbeam的最新版本

4. 如果您使用的是发布的二进制文件，更新版本并运行以下命令：

    ```
    wget https://github.com/PureStake/moonbeam/releases/download/<NEW VERSION TAG HERE>/moonbeam
    ```
    
    如果您想要编译二进制文件，请参考[编译二进制文件](#compile-the-binary)指引，确保您已通过运行`git checkout`获取最新版本。

5. 将二进制文件移动到数据目录：

    === "Moonbeam"
        ```
        # If you used the release binary:
        mv ./{{ networks.moonbeam.binary_name }} {{ networks.moonbeam.node_directory }}
    
        # Or if you compiled the binary:
        mv ./target/release/{{ networks.moonbeam.binary_name }} {{ networks.moonbeam.node_directory }}
        ```
    
    === "Moonriver"
        ```
        # If you used the release binary:
        mv ./{{ networks.moonriver.binary_name }} {{ networks.moonriver.node_directory }}
    
        # Or if you compiled the binary:
        mv ./target/release/{{ networks.moonriver.binary_name }} {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"
        ```
        # If you used the release binary:
        mv ./{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}
    
        # Or if you compiled the binary:
        mv ./target/release/{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}
        ```
    

6. 更新权限：

    === "Moonbeam"
        ```
        chmod +x moonbeam
        chown moonbeam_service moonbeam
        ```
    
    === "Moonriver"
        ```
        chmod +x moonbeam
        chown moonriver_service moonbeam
        ```

    === "Moonbase Alpha"
        ```
        chmod +x moonbeam
        chown moonbase_service moonbeam
        ```
    
7. 启动您的服务：

    ```
    systemctl start moonbeam.service
    ```

您可以运行以上命令查看节点的状态或日志。

## 清除节点 {: #purge-your-node }

如果您需要Moonbeam节点的新实例，您可以通过删除相关联的数据目录来清除您的节点。

取决于您使用的是发布的二进制文件还是自己编译的二进制文件，清除链数据的方式也有所不同。如果您是自己编译二进制文件，您可跳过该步骤至[清除编译的二进制文件](#purge-compiled-binary)部分。

### 清除发布的二进制文件 {: #purge-release-binary }

首先，您需要停止systemd服务：

```
sudo systemctl stop moonbeam
```

您可以运行以下命令清除您的平行链和中继链数据：

=== "Moonbeam"
    ```
    sudo rm -rf {{ networks.moonbeam.node_directory }}/*
    ```

=== "Moonriver"
    ```
    sudo rm -rf {{ networks.moonriver.node_directory }}/*
    ```

=== "Moonbase Alpha"
    ```
    sudo rm -rf {{ networks.moonbase.node_directory }}/*
    ```

仅为指定链移除平行链数据，您可运行以下命令：

=== "Moonbeam"
    ```
    sudo rm -rf {{ networks.moonbeam.node_directory }}/chains/*
    ```

=== "Moonriver"
    ```
    sudo rm -rf {{ networks.moonriver.node_directory }}/chains/*
    ```

=== "Moonbase Alpha"
    ```
    sudo rm -rf {{ networks.moonbase.node_directory }}/chains/*
    ```


同样地，仅移除中继链数据，您可运行以下命令：

=== "Moonbeam"
    ```
    sudo rm -rf {{ networks.moonbeam.node_directory }}/polkadot/*
    ```

=== "Moonriver"
    ```
    sudo rm -rf {{ networks.moonriver.node_directory }}/polkadot/*
    ```

=== "Moonbase Alpha"
    ```
    sudo rm -rf {{ networks.moonbase.node_directory }}/polkadot/*
    ```

--8<-- 'text/purge-chain/post-purge.md'

### 清除编译的二进制文件 {: #purge-compiled-binary }

如果您想要启动一个新的节点实例，您可以使用一些`purge-chain`命令，它们将按照指令删除以前的链数据。清除平行链和中继链数据的基本命令如下所示：

```
./target/release/moonbeam purge-chain
```

如果您想要指定清除的数据，您可以添加以下标志到上述命令：

- `--parachain`：只删除平行链数据库，保持中继链数据完整
- `--relaychain`：只删除中继链数据库，保持平行链数据完整

您也可以指定清除的链：

- `--chain`：使用预定义链或具有chainspec的文件路径来指定链

只清除您的Moonbase Alpha数据，您需要运行以下命令：

```
./target/release/moonbeam purge-chain --parachain --chain alphanet
```

清除开发链的指定chainspec路径，您可以运行以下命令：

```
./target/release/moonbeam purge-chain --chain example-moonbeam-dev-service.json
```

想要获得可用的`purge-chain`命令的完整列表，您可以通过运行以下命令访问帮助菜单：

```
./target/release/moonbeam purge-chain --help
```

--8<-- 'text/purge-chain/post-purge.md'