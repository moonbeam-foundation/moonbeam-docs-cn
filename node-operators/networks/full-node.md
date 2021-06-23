---
title: 运行节点
description: 如何通过Moonbeam网络运行完整的平行链节点以拥有RPC端点或产生区块。
---

# 在Moonbeam上运行节点

![Full Node Moonbeam Banner](/images/fullnode/fullnode-banner.png)

## 概览

Moonbase Alpha v6版本发布后，用户可以启动一个节点。该节点不仅与Moonbase Alpha测试网相连，还与bootnode节点同步，且提供对RPC终端的本地访问，甚至可以在平行链上创建区块。

在我们的测试网上，中继链由PureStake托管并运行。但随着区块链的发展，在Kusama以及后续在波卡（Polkadot）上都将会有更多部署。以下是未来即将推出的网络名称及其相应的[区块链参数文档](https://substrate.dev/docs/en/knowledgebase/integrate/chain-spec)名称：

|      网络      |      |      托管方      |      | 区块链名称 |
| :------------: | :--: | :--------------: | :--: | :--------: |
| Moonbase Alpha |      |    PureStake     |      |  alphanet  |
|   Moonriver    |      |      Kusama      |      |    _无_    |
|    Moonbeam    |      | 波卡（Polkadot） |      |    _无_    |

本教程的目标人群是有基于[Substrate](https://substrate.dev/)创建区块链经验的用户。运行平行链和运行Substrate节点大致相似，仅有几个不同之处。Substrate平行链节点会运行两个流程：分别与中继链和平行链同步。因此很多操作都需要进行两次，例如数据库目录、所使用端口、日志记录等。

!!! 注意事项
    Moonbase Alpha仍被视为是一个Alpha网络，因此其正常运行时间*不会*达到100%。平行链*将*不时地进行清理。在开发自己的应用程序时，请确保您已采取方法，可重新快速地将合约与账户部署到新的平行链。[Discord channel](https://discord.gg/PfpUATX)会提前24小时发布将要清理区块链的通知。

## 要求

下表列出了运行节点所需的最低建议参数。随着网络的发展，在Kusama和波卡（Polkadot）主网上的部署对磁盘的要求将会更高。

|      组件      |      | 最低参数要求                                                 |
| :------------: | :--: | :----------------------------------------------------------- |
| **中央处理器** |      | 8核（早期开发阶段，未经过优化）                              |
|    **内存**    |      | 16 GB（早期开发阶段，未经过优化）                            |
|  **固态硬盘**  |      | 50 GB（测试网最低要求）                                      |
|   **防火墙**   |      | 必须向流入流量开放P2P端口：<br>&nbsp; &nbsp; - 来源：任何来源<br>&nbsp; &nbsp; - 目标地址：30333、30334 TCP |

!!! 注意事项
    如果在节点运行时没有看到`Imported`消息（没有`[Relaychain]`标签），您可能需要重新检查端口配置。

## 运行端口

如上所述，中继链/平行链节点将从多个端口获取信息。默认Substrate端口用于平行链，而中继链则负责获取下一个更高端口的消息。

只有指定P2P端口才需要对流入流量开放。

### 平行链全节点的默认端口

|      描述      |      |                端口                 |
| :------------: | :--: | :---------------------------------: |
|    **P2P**     |      | {{ networks.parachain.p2p }} (TCP)  |
|    **RPC**     |      |    {{ networks.parachain.rpc }}     |
|     **WS**     |      |     {{ networks.parachain.ws }}     |
| **Prometheus** |      | {{ networks.parachain.prometheus }} |

### 嵌入式中继链默认端口

|      描述      |      |                 Port                  |
| :------------: | :--: | :-----------------------------------: |
|    **P2P**     |      | {{ networks.relay_chain.p2p }} (TCP)  |
|    **RPC**     |      |    {{ networks.relay_chain.rpc }}     |
|     **WS**     |      |     {{ networks.relay_chain.ws }}     |
| **Prometheus** |      | {{ networks.relay_chain.prometheus }} |

## Docker安装指引

使用Docker可以快速创建Moonbase Alpha节点。关于Docker安装的更多详情，请访问[这一页面](https://docs.docker.com/get-docker/)。截至本文撰写时，所使用的Docker版本为19.03.6版本。

首先创建本地目录，用于储存链上数据：

```
mkdir {{ networks.moonbase.node_directory }}
```

下一步，为特定用户或当前用户设置必要权限许可（为将要运行`docker`命令的用户替换`DOCKER_USER`）：

```
# chown to a specific user
chown DOCKER_USER {{ networks.moonbase.node_directory }}

# chown to current user
sudo chown -R $(id -u):$(id -g) {{ networks.moonbase.node_directory }}
```

!!! 注意事项
    请确保已设置好储存链上数据本地目录的相应所有权和权限。

下一步，执行docker run指令。请注意，您在这里需要：

 - 替换两处`YOUR-NODE-NAME`。
 - 对于收集人，需要将`PUBLIC_KEY`替换成与收集活动相关的公共地址。

!!! 注意事项
    如果您设置的是收集人节点，请确保根据“收集人”代码段进行操作。

### 全节点

=== "Ubuntu"
    ```
    docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbase.parachain_docker_tag }} \
    --rpc-cors all \
    --base-path=/data \
    --chain alphanet \
    --name="YOUR-NODE-NAME" \
    --execution wasm \
    --wasm-execution compiled \
    --in-peers 200 \
    --out-peers 200 \
    --pruning archive \
    --state-cache-size 1 \
    -- \
    --pruning archive \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

=== "MacOS"
    ```
    docker run -p {{ networks.parachain.rpc }}:{{ networks.parachain.rpc }} -p {{ networks.parachain.ws }}:{{ networks.parachain.ws }} -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbase.parachain_docker_tag }} \
    --ws-external \
    --rpc-external \
    --rpc-cors all \
    --base-path=/data \
    --chain alphanet \
    --name="YOUR-NODE-NAME" \
    --execution wasm \
    --wasm-execution compiled \
    --in-peers 200 \
    --out-peers 200 \
    --pruning archive \
    --state-cache-size 1 \
    -- \
    --pruning archive \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```
### 收集人

=== "Ubuntu"
    ```
    docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbase.parachain_docker_tag }} \
    --base-path=/data \
    --chain alphanet \
    --name="YOUR-NODE-NAME" \
    --collator \
    --author-id PUBLIC_KEY \
    --execution wasm \
    --wasm-execution compiled \
    --in-peers 200 \
    --out-peers 200 \
    --pruning archive \
    --state-cache-size 1 \
    -- \
    --pruning archive \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

=== "MacOS"
    ```
    docker run -p {{ networks.parachain.rpc }}:{{ networks.parachain.rpc }} -p {{ networks.parachain.ws }}:{{ networks.parachain.ws }} -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbase.parachain_docker_tag }} \
    --ws-external \
    --rpc-external \
    --base-path=/data \
    --chain alphanet \
    --name="YOUR-NODE-NAME" \
    --collator \
    --author-id PUBLIC_KEY \
    --execution wasm \
    --wasm-execution compiled \
    --in-peers 200 \
    --out-peers 200 \
    --pruning archive \
    --state-cache-size 1 \
    -- \
    --pruning archive \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

在Docker拉取必要的镜像后，Moonbase Alpha全节点将启动并显示许多信息，如区块链参数、节点名称、作用、创世状态等：

![Full Node Starting](/images/fullnode/fullnode-docker1.png)

!!! 注意事项
    如果默认telemetry有问题，您可以增加`--no-telemetry`，在不激活telemetry的情况下可运行全节点。

!!! 注意事项
    您可使用`--promethues-port XXXX`标记（将`XXXX`替换成真实的接口序号）指定个性化Prometheus端口，平行链和嵌入式中继链都可以进行这项操作。

以上命令将激活所有已开放的端口，包括P2P、RPC和Prometheus (telemetry) 端口。该命令也可与Gantree Node Watchdog telemetry兼容使用。如果您要开放特定端口，请运行以下Docker run命令进行激活。但这样做会阻止Gantree Node Watchdog (telemetry) 容器获取moonbeam容器的数据。因此，除非您懂得如何进行[Docker连接](https://docs.docker.com/network/)，否则在运行收集人时请不要采用这种操作方式。

```
docker run -p {{ networks.relay_chain.p2p }}:{{ networks.relay_chain.p2p }} -p {{ networks.parachain.p2p }}:{{ networks.parachain.p2p }} -p {{ networks.parachain.rpc }}:{{ networks.parachain.rpc }} -p {{ networks.parachain.ws }}:{{ networks.parachain.ws }} #rest of code goes here
```

在同步过程中，您可以看到嵌入式中继链和平行链的消息（无标签）。这些消息将显示目标区块（测试网）和最佳区块（本地节点同步状态）。

![Full Node Starting](/images/fullnode/fullnode-docker2.png)

同步完成后，Moonbase Alpha测试网节点即进入本地运行！

## 二进制文档安装指引

本小节将介绍二进制文档编译以及作为systemd服务运行Moonbeam全节点的流程。本教程所使用的示例基于Ubuntu 18.04的环境。Moonbase Alpha也可能与其他Linux版本相兼容，但目前我们仅测试了Ubuntu 18.04版本。

### 编译二进制文档

通过以下指令可以创建最新版本的Moonbeam平行链。

首先，克隆moonbeam repo。

```
git clone https://github.com/PureStake/moonbeam
cd moonbeam
```

检查最新版本：

```
git checkout tags/$(git tag | tail -1)
```

下一步，执行以下命令安装Substrate和所有必要的操作环境，包括Rust：

```
--8<-- 'code/setting-up-node/substrate.md'
```

最后，创建平行链二进制文档：

```
cargo build --release
```

![Compiling Binary](/images/fullnode/fullnode-binary1.png)

如果终端显示*cargo not found error*，请在系统路径中手动加入Rust，或重启系统：

```
--8<-- 'code/setting-up-node/cargoerror.md'
```

### 运行Systemd服务

通过以下指令完成所有与服务运行相关的设置。

首先，创建服务账户：

```
adduser moonbase_service --system --no-create-home
```

下一步，创建目录用于储存二进制文档和数据，并设置必要的权限：

```
mkdir {{ networks.moonbase.node_directory }}
chown moonbase_service {{ networks.moonbase.node_directory }}
```

!!! 注意事项
    请确保已设置好储存链上数据的本地目录相应所有权和权限。

下一步，复制上一小节所创建的二进制文档到以下新建文件夹：

```
cp ./target/release/{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}
```

下一步，创建systemd配置文档。请注意，在这里需要：

 - 替换两处`YOUR-NODE-NAME`
 - 再次检查确认二进制文档是否位于以下正确路径 (*ExecStart*)
 - 如果您使用不同目录，请再次检查基本路径
 - 对收集人，需要将`PUBLIC-KEY`改为上述步骤中所创建的H160以太坊地址公钥
 - 将文档命名为`/etc/systemd/system/moonbeam.service`

!!! 注意事项
    如果您设置的是收集人节点，请确保根据“收集人”代码段进行操作。

=== "全节点"
    ```
    [Unit]
    Description="Moonbase Alpha systemd service"
    After=network.target
    StartLimitIntervalSec=0
    ```

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonbase_service
    SyslogIdentifier=moonbase
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonbase.node_directory }}/{{ networks.moonbase.binary_name }} \
         --parachain-id 1000 \
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --pruning=archive \
         --state-cache-size 1 \
         --unsafe-rpc-external \
         --unsafe-ws-external \
         --rpc-methods=Safe \
         --rpc-cors all \
         --log rpc=info \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain alphanet \
         --name "YOUR-NODE-NAME" \
        --in-peers 200 \
        --out-peers 200 \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --pruning=archive \
         --name="YOUR-NODE-NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "收集人"
    ```
    [Unit]
    Description="Moonbase Alpha systemd service"
    After=network.target
    StartLimitIntervalSec=0
    ```

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonbase_service
    SyslogIdentifier=moonbase
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonbase.node_directory }}/{{ networks.moonbase.binary_name }} \
         --parachain-id 1000 \
         --collator \
         --author-id PUBLIC_KEY \
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --pruning=archive \
         --state-cache-size 1 \
         --unsafe-rpc-external \
         --unsafe-ws-external \
         --rpc-methods=Safe \
         --log rpc=info \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain alphanet \
         --name "YOUR-NODE-NAME" \
         --in-peers 200 \
         --out-peers 200 \
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
    如果默认telemetry有问题，您可以增加`--no-telemetry`，在不激活telemetry的情况下可运行全节点。

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

![Service Status](/images/fullnode/fullnode-binary2.png)

您也可以执行以下命令检查日志：

```
journalctl -f -u moonbeam.service
```

![Service Logs](/images/fullnode/fullnode-binary3.png)

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

在重大升级前后，Moonbase Alpha有时会进行清理和重置。如果升级后还有清理环节，我们也会（通过[Discord channel](https://discord.gg/PfpUATX)）提前通知节点运营者。如果您的个人数据目录崩溃，也可以清理节点。

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

请按照[本教程](/node-operators/networks/telemetry/)激活Moonbase Alpha节点telemetry服务器。

运行telemetry对全节点而言并不是必要的，但对收集人而言是必要的。

您可访问[此链接](https://telemetry.波卡（Polkadot）.io/#list/Moonbase Alpha)了解目前Moonbase Alpha telemetry信息。

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