---
title: 运行节点
description: 如何为Moonbeam网络运行一个完整的平行链节点、拥有自己的RPC端点或是产生区块。
---

# 在Moonbeam上运行节点

![Full Node Moonbeam Banner](/images/fullnode/fullnode-banner.png)

## 概览

在基于Moonbeam的网络运行一个全节点使你能够连接至网络，与bootnode节点同步，获得RPC终端的本地访问，在平行链上创建区块，以及更多其他不同的功能。

Moonbeam拥有多种不同的部署，包含Moonbase Alpha测试网，Kusama上的Moonriver，以及最后波卡（Polkadot）上的Moonbeam。以下是网络的环境名称以及其对应的[区块链参数文档](https://substrate.dev/docs/en/knowledgebase/integrate/chain-spec)名称：

|      网络      |      |      托管方      |      | 区块链名称 |
| :------------: | :--: | :--------------: | :--: | :--------: |
| Moonbase Alpha |      |    PureStake     |      |  alphanet  |
|   Moonriver    |      |      Kusama      |      | moonriver  |
|    Moonbeam    |      | 波卡（Polkadot） |      |    _无_    |

本教程的目标人群是有基于Substrate创建区块链经验的用户。运行平行链节点和Substrate节点大致相似，但仍有几个不同之处。Substrate平行链阶段将会是较大的工程，因为其包含平行链本身以及与中继链同步的代码，还有促进两者之间的交流。因此，这项工程相对较大，需要30分钟和32GB的存储空间。

!!! 注意事项
    Moonbase Alpha仍被视为是一个Alpha网络，因此其正常运行时间不会达到100%。平行链将不时地进行清理。在开发自己的应用程序时，请确保您已采取方法，可重新快速地将合约与账户部署到新的平行链。[Discord channel](https://discord.gg/PfpUATX)会提前24小时发布将清理区块链的通知。

## 需求

下表列出了运行节点所需的最低建议参数。随着网络的发展，在Kusama和波卡（Polkadot）主网上的部署对磁盘的要求将会更高。

=== "Moonbase Alpha"
    |    组件    |      | 最低参数要求                                                 |
    | :--------: | :--: | :----------------------------------------------------------- |
    | 中央处理器 |      | 8核（最快单核速度）                                          |
    |    内存    |      | 16 GB                                                        |
    |  固态硬盘  |      | 50GB（最低要求）                                             |
    |   防火墙   |      | 必须向流入流量开放P2P端口：<br>&nbsp; &nbsp; - 来源：任何来源<br>&nbsp; &nbsp; - 目标地址：30333, 30334 TCP |

=== "Moonriver"
    |    组件    |      | 最低参数要求                                                 |
    | :--------: | :--: | :----------------------------------------------------------- |
    | 中央处理器 |      | 8核（最快单核速度）                                          |
    |    内存    |      | 16 GB                                                        |
    |  固态硬盘  |      | 300GB（最低要求）                                            |
    |   防火墙   |      | 必须向流入流量开放P2P端口： <br>&nbsp; &nbsp; - 来源：任何来源<br>&nbsp; &nbsp; - 目标地址：30333, 30334 TCP |

!!! 注意事项
    如果在节点运行时没有看到`Imported`消息（没有`[Relaychain]`标签），您可能需要重新检查端口配置。

## 运行端口

如上所述，中继链/平行链节点将从多个端口获取信息。默认Substrate端口用于平行链，而中继链则获取下一个更高端口的消息。

只有指定P2P端口才需要对流入流量开放。

### 平行链全节点的默认端口

|      描述      |      |                端口                 |
| :------------: | :--: | :---------------------------------: |
|    **P2P**     |      | {{ networks.parachain.p2p }} (TCP)  |
|    **RPC**     |      |    {{ networks.parachain.rpc }}     |
|     **WS**     |      |     {{ networks.parachain.ws }}     |
| **Prometheus** |      | {{ networks.parachain.prometheus }} |

### 嵌入式中继链默认端口

|      描述      |      |                 端口                  |
| :------------: | :--: | :-----------------------------------: |
|    **P2P**     |      | {{ networks.relay_chain.p2p }} (TCP)  |
|    **RPC**     |      |    {{ networks.relay_chain.rpc }}     |
|     **WS**     |      |     {{ networks.relay_chain.ws }}     |
| **Prometheus** |      | {{ networks.relay_chain.prometheus }} |

## Docker安装指引

使用Docker可以快速创建Moonbase Alpha节点。关于安装Docker的更多资讯，请访问[这一页面](https://docs.docker.com/get-docker/)。截至本文撰写时，所使用的Docker版本为19.03.6。当您连接至Kusama上的Moonriver将需要数天的时间同步Kusama中继链内嵌入的数据。请确认您的系统符合以下[要求](#需求)。

创建一个本地目录以储存链上数据：

=== "Moonbase Alpha"
    ```
    mkdir {{ networks.moonbase.node_directory }}
    ```

=== "Moonriver"
    ```
    mkdir {{ networks.moonriver.node_directory }}
    ```

接着，请确认您已经为储存链数据的本地目录设定所有权和权限许可。在这里，记得为特定用户或当前用户设置必要权限许可（为将要运行`docker`命令的用户替换为`DOCKER_USER`）：

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

下一步，执行docker run指令。如果您设定的是收集人节点，请确认您使用的是“收集人”的代码段。请注意，您需要替换两处`YOUR-NODE-NAME`。

### 全节点

=== "Moonbase Alpha"
    ```
    docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
    --base-path=/data \
    --chain alphanet \
    --name="YOUR-NODE-NAME" \
    --execution wasm \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 1 \
    -- \
    --pruning archive \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

=== "Moonriver"
    ```
    docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
    --base-path=/data \
    --chain {{ networks.moonriver.chain_spec }} \
    --name="YOUR-NODE-NAME" \
    --execution wasm \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 1 \
    -- \
    --pruning archive \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

### 收集人

=== "Moonbase Alpha"
    ```
    docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
    --base-path=/data \
    --chain alphanet \
    --name="YOUR-NODE-NAME" \
    --validator \
    --execution wasm \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 1 \
    -- \
    --pruning archive \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

=== "Moonriver"
    ```
    docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
    --base-path=/data \
    --chain {{ networks.moonriver.chain_spec }} \
    --name="YOUR-NODE-NAME" \
    --validator \
    --execution wasm \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 1 \
    -- \
    --pruning archive \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

如果您使用的是MacOS，您可以在[这里](/snippets/text/full-node/macos-node/)找到所有的代码段。

在Docker拉取必要的镜像后，Moonbeam（或Moonriver）节点将启动并显示许多信息，如区块链参数、节点名称、作用、创世状态等：

![Full Node Starting](/images/fullnode/fullnode-docker1.png)

!!! 注意事项
    如果您想要运行RPC端点、连接至polkadot.js.org或是运行您自己的应用，使用`--unsafe-rpc-external`或是 `--unsafe-ws-external`来运行能够从外部访问RPC端口的全节点。您能够通过执行`moonbeam --help`以获得更多细节。

!!! 注意事项
    您可使用`--promethues-port XXXX`标记（将`XXXX`替换成真实的接口序号）指定个性化Prometheus端口，平行链和嵌入式中继链都可以进行这项操作。

以上命令将激活所有已开放且基本运行所需的端口，包括P2P、RPC和Prometheus (telemetry) 端口。该命令也可与Gantree Node Watchdog telemetry兼容使用。如果您要开放特定端口，请激活以下Docker运行命令。但这样做会阻止Gantree Node Watchdog (telemetry) 容器获取moonbeam容器的数据。因此，除非您懂得如何进行[Docker连接](https://docs.docker.com/network/)，否则在运行收集人时请不要采用这种操作方式。

```
docker run -p {{ networks.relay_chain.p2p }}:{{ networks.relay_chain.p2p }} -p {{ networks.parachain.p2p }}:{{ networks.parachain.p2p }} -p {{ networks.parachain.rpc }}:{{ networks.parachain.rpc }} -p {{ networks.parachain.ws }}:{{ networks.parachain.ws }} #rest of code goes here
```

在同步过程中，您可以看到嵌入式中继链和平行链的消息（无标签）。这些消息将显示目标区块（实时网络状态）和最佳区块（本地节点同步状态）。

![Full Node Starting](/images/fullnode/fullnode-docker2.png)

!!! 注意事项
    同步Kusama的内嵌中继链需要数天的时间，请注意您的系统符合[要求](#需求)。

如果您跟随的是Moonbase Alpha的节点教程，当同步完成，您将获得一个在本地运行的Moonbase Alpha测试网节点！

如果您按照Moonrive的节点教程，当同步完成，您将能够与同类节点连接并且能够看到在Moonriver网络上生产的区块！请注意，在这个部分将会需要数天来同步Kusama的中继链数据。

## 二进制文档安装指引

本小节将介绍使用发布的二进制文档以及作为systemd服务运行Moonbeam全节点的流程。本教程所使用的示例基于Ubuntu 18.04的环境。Moonbeam也可能与其他Linux版本相兼容，但目前我们仅测试了Ubuntu 18.04版本。

如果您想要自己建立二进制文档，请查看编译[二进制文档](/node-operators/networks/compile-binary)教程。

### 使用发布的二进制文档

有许多方式能够开始操作Moonbeam的二进制文档。您可以自己编译二进制文档，但整个过程需要大约30分钟来安装依赖项和编译文档。如果您对这个路线有兴趣，您可以在文档内查看编译二进制的页面。

或者是您可以使用[发布的文档](https://github.com/PureStake/moonbeam/releases)马上开始。

使用`wget`来抓取最新发布的二进制文档：


=== "Moonbase Alpha"
    ```
    wget https://github.com/PureStake/moonbeam/releases/download/{{ networks.moonbase.parachain_release_tag }}/moonbeam
    ```

=== "Moonriver"
    ```
    wget https://github.com/PureStake/moonbeam/releases/download/{{ networks.moonriver.parachain_release_tag }}/moonbeam
    ```

为了确认您下载的是正确的版本，您可以在终端运行`sha256sum moonbeam`指令，您应当看到以下的画面： 

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.parachain_sha256sum }}
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.parachain_sha256sum }}
    ```

当您检索到二进制文档，您可以使用它来运行systemd服务。

### 运行Systemd服务

通过以下指令完成所有与服务运行相关的设置。

首先，创建服务账户：

=== "Moonbase Alpha"
    ```
    adduser moonbase_service --system --no-create-home
    ```

=== "Moonriver"
    ```
    adduser moonriver_service --system --no-create-home
    ```

下一步，创建目录用于储存二进制文档和数据。同时，确保您已经为储存链上数据的本地目录设定了必要的权限。

=== "Moonbase Alpha"
    ```
    mkdir {{ networks.moonbase.node_directory }}
    chown moonbase_service {{ networks.moonbase.node_directory }}
    ```

=== "Moonriver"
    ```
    mkdir {{ networks.moonriver.node_directory }}
    chown moonriver_service {{ networks.moonriver.node_directory }}
    ```

下一步，复制上一小节所创建的二进制文档到以下新建文件夹。如果您是自己编译二进制文档，您将需要将二进制文档复制到目标目录（`./target/release/{{ networks.moonbase.binary_name }}`）。或者，将Moonbeam二进制文档复制到root。

=== "Moonbase Alpha"
    ```
    cp ./{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}
    ```

=== "Moonriver"
    ```
    cp ./{{ networks.moonriver.binary_name }} {{ networks.moonriver.node_directory }}
    ```

接着下一步是创建systemd配置文档。如果您设定的是收集人节点，请确认使用的是“收集人”的代码段。请注意，在这里需要：

 - 替换两处`YOUR-NODE-NAME`
 - 再次检查确认二进制文档是否位于以下正确路径 (*ExecStart*)
 - 如果您使用不同目录，请再次检查基本路径
 - 将文档命名为`/etc/systemd/system/moonbeam.service`

#### 全节点

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
         --pruning=archive \
         --state-cache-size 1 \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain alphanet \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --pruning=archive \
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
         --pruning=archive \
         --state-cache-size 1 \
         --base-path {{ networks.moonriver.node_directory }} \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --pruning=archive \
         --name="YOUR-NODE-NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

#### 收集人

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
         --pruning=archive \
         --state-cache-size 1 \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain alphanet \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --pruning=archive \
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
         --pruning=archive \
         --state-cache-size 1 \
         --base-path {{ networks.moonriver.node_directory }} \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --pruning=archive \
         --name="YOUR-NODE-NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

!!! 注意事项
    您可使用`--promethues-port XXXX`标记（将`XXXX`替换成真实的接口序号）指定个性化Prometheus端口，平行链和嵌入式中继链都可以进行这项操作。

运行以下命令即可注册并开始服务：

```
systemctl enable moonbeam.service
systemctl start moonbeam.service
```

最后一步，验证服务正在运行：

```
systemctl status moonbeam.service
```

![Service Status](/images/fullnode/fullnode-binary1.png)

您也可以执行以下命令检查日志：

```
journalctl -f -u moonbeam.service
```

![Service Logs](/images/fullnode/fullnode-binary2.png)

## 高级标记及选项

--8<-- 'text/setting-up-node/advanced-flags.md'

## 客户端升级

随着Moonbeam网络不断发展，有时需要升级节点软件。升级版本发布后，我们将通过[Discord channel](https://discord.gg/PfpUATX)通知节点运营者，并告知这些升级是否为必要升级（一些客户端升级为可选操作）。升级过程简单直接，并且对于全节点及收集人，其升级过程一样。

首先停止docker容器或systemd服务：

```
sudo docker stop `CONTAINER_ID`
# or
sudo systemctl stop moonbeam
```

下一步，重复前述步骤安装新版本。请确保您使用的是最新标签。升级后可再次启动服务。

### 区块链清理

在重大升级前后，Moonbase Alpha通常会进行清理和重置。如果升级后还有清理环节，我们也会（通过[Discord channel](https://discord.gg/PfpUATX)）提前通知节点运营者。如果您的个人数据目录崩溃，也可以清理节点。

第一步，停止docker容器或systemd服务：

```
sudo docker stop `CONTAINER_ID`
# or
sudo systemctl stop moonbeam
```

下一步，移除链上数据储存文件夹内容（包括平行链和中继链）：

```
sudo rm -rf {{ networks.moonbase.node_directory }}/*
```

最后，重复前述步骤安装最新版本，请确保您使用的是最新标签。完成后即可运行全新节点，使用全新数据目录。

## Telemetry

请按照[本教程](/node-operators/networks/telemetry/)激活Moonbase Alpha或是Moonriver节点telemetry服务器。

运行telemetry对全节点而言并不是必要的，但对收集人而言是必要的。

您可访问最新的[Moonbase Alpha telemetry](https://telemetry.polkadot.io/#list/Moonbase%20Alpha)和[Moonriver telmetry](https://telemetry.polkadot.io/#list/Moonriver)数据。

## 日志与故障检测

您可以查看中继链和平行链的日志。中继链日志将以`[Relaychain]`为前缀，而平行链日志没有前缀。

### P2P端口不开放

如果您没有看到`Imported`消息（没有`[Relaychain]`标签），则需要检查P2P端口配置。P2P端口必须向流入流量开放。

### 同步

两个区块链必须保持随时同步。在正常情况下您能够看到`Imported`或`Idle`消息，以及已连接的其他节点。

### 创世错配

Moonbase Alpha测试网会频繁进行升级。因此，您可能会看到以下消息：

```
DATE [Relaychain] Bootnode with peer id `ID` is on a different
chain (our genesis: GENESIS_ID theirs: OTHER_GENESIS_ID)
```

这个消息通常意味着您运行的版本已经过旧，需要进行升级。

每次升级（以及相应的区块链清理）我们都将提前至少24小时通过[Discord channel](https://discord.gg/PfpUATX)宣布。