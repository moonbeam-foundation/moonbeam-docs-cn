---
title: Telemetry
description: 如何在Moonbeam网络上通过运行Telemetry来设置平行链全节点
---

# 运行Telemetry设置全节点

![Telemetry Moonbeam Banner](/images/fullnode/telemetry-banner.png)

## 概览

Moonbase Alpha v6版本以及近期的Moonriver发布后，用户可以创建节点并连接到Moonbase Alpha测试网或是Kusama上的Moonriver。具体操作步骤，请查阅[此教程](https://github.com/PureStake/moonbeam-docs-cn/blob/master/node-operators/networks/full-node)。

本教程将介绍激活基于Moonbeam节点的telemetry服务器的必要步骤。

!!! 注意事项
    以下步骤适用于与默认启用的标准波卡（Polkadot）telemetry不同的telemetry实例（您可利用`--no-telemetry`标记在不激活telemetry的情况下运行节点）。请知悉，本教程中的步骤仅对收集人节点是强制性的。

## Telemetry Exporter简介

Moonbeam将运行一个telemetry服务器，收集来自网络中所有Moonbeam平行链节点Prometheus参数。运行这一服务器对我们的开发阶段将有重要的帮助。

指标exporter可以作为Kubernetes sidecar运行，或作为运行VM的本地二进制文档。它会向服务器推送数据，因此您不需要针对这一服务激活任何输入端口。

目前我们使用[Gantree Node Watchdog](https://github.com/gantree-io/gantree-node-watchdog)服务自动上传telemetry。激活telemetry后，还可以从[Gantree App](https://app.gantree.io/)进入Prometheus/Grafana服务器。具体操作可在GitHub repository中找到。如果您需要更多信息，请见以下简单指引。

目前我们需要运行两个节点watchdog，一个用于平行链，另一个用于中继链。未来发布版本将对这一功能进行升级。

如需获取帮助，请联系的[Discord server](https://discord.gg/FQXm74UQ7V)或[Gantree Discord](https://discord.gg/N95McPjHZ2)。

## 查看先决条件

在按照本教程进行操作前，您需要：

  1. 登录[https://app.gantree.io](https://app.gantree.io/)并创建账户。找到API密钥并进行复制。

  2. 通过我们的[Discord server](https://discord.gg/FQXm74UQ7V)请求获取PCK密钥


您可以在所有基于Moonbeam的网络使用相同的PCK密钥，目前包含Moonbase Alpha和Moonriver。

## 通过Docker容器运行Telemetry Exporter

下面我们将通过Docker容器运行两个Gantree node watchdog实例，一个用于平行链，另一个用于中继链。

### 所需配置信息

- GANTREE_NODE_WATCHDOG_API_KEY
- GANTREE_NODE_WATCHDOG_PROJECT_ID
- GANTREE_NODE_WATCHDOG_CLIENT_ID
- GANTREE_NODE_WATCHDOG_PCKRC
- GANTREE_NODE_WATCHDOG_METRICS_HOST

### 操作指引

首先，克隆实例的监测客户端代码库，并创建镜像：

```
git clone https://github.com/gantree-io/gantree-node-watchdog
cd gantree-node-watchdog
# checkout latest release
git checkout tags/$(git tag | tail -1)
docker build .  
# get the IMAGE-NAME for use below
docker images
```

运行docker容器（平行链Gantree node watchdog）。请注意，需要替换以下内容：

  - 将`IMAGE-NAME`替换为在上一步所获取的名称
  - 将`YOUR-API-KEY`替换为[https://app.gantree.io](https://app.gantree.io/)提供的API密钥
  - `YOUR-SERVER-NAME`
  - 将`YOUR-PCK-KEY`替换为通过Discord server请求获取的PCK密钥（您可以在基于Moonbeam的网络使用同一个PCK密钥）

无论您连接至哪一个网络， `PROJECT_ID`标记将会永远被设置为`moonbeam`。`CLIENT_ID`应当包含您的公司名称，我们才能在Prometheus/Grafana仪表板迅速辨认您。

```
docker run -it --network="host" \
-e GANTREE_NODE_WATCHDOG_API_KEY="YOUR-API-KEY" \
-e GANTREE_NODE_WATCHDOG_PROJECT_ID="moonbeam" \
-e GANTREE_NODE_WATCHDOG_CLIENT_ID="YOUR-SERVER-NAME-parachain" \
-e GANTREE_NODE_WATCHDOG_PCKRC="YOUR-PCK-KEY" \
-e GANTREE_NODE_WATCHDOG_METRICS_HOST="http://127.0.0.1:9615" \
--name gantree_watchdog_parachain IMAGE-NAME
```

接下来，运行中继链Gantree node watchdog。请注意，需要替换与上一步相同的信息。

```
docker run -it --network="host" \
-e GANTREE_NODE_WATCHDOG_API_KEY="YOUR-API-KEY" \
-e GANTREE_NODE_WATCHDOG_PROJECT_ID="moonbeam" \
-e GANTREE_NODE_WATCHDOG_CLIENT_ID="YOUR-SERVER-NAME-relay" \
-e GANTREE_NODE_WATCHDOG_PCKRC="YOUR-PCK-KEY" \
-e GANTREE_NODE_WATCHDOG_METRICS_HOST="http://127.0.0.1:9616" \
--name gantree_watchdog_relay IMAGE-NAME
```

在日志中可以看到“waiting for provisioning”消息。如果这是您第一次运行Gantree，他将会等待直到您回到网站入口点击“provision dashboard”并将其切换至“provisoning”。切换将会需要数分钟的时间。完成后，可以登录[https://app.gantree.io](https://app.gantree.io/)并选择网络。您会看到`View Monitoring Dashboard`链接，点击将跳转到您的定制Prometheus / Grafana面板，在那里可以按照您的需求进行个性化设置。

一切正常后，您可以更新命令以在守护程序模式下运行。删除`-it`并在上面的命令中添加`-d`。

## 通过Systemd运行Telemetry Exporter

下面我们将通过Systemd运行两个Gantree node watchdog实例，一个用于平行链，另一个用于中继链。

### 所需配置信息

- GANTREE_NODE_WATCHDOG_API_KEY
- GANTREE_NODE_WATCHDOG_PROJECT_ID
- GANTREE_NODE_WATCHDOG_CLIENT_ID
- GANTREE_NODE_WATCHDOG_PCKRC
- GANTREE_NODE_WATCHDOG_METRICS_HOST

### 操作指引

首先，在这个[发布页面](https://github.com/gantree-io/gantree-node-watchdog/releases)下载Gantree node watchdog二进制文档，并解压到文件夹，例如`/usr/local/bin`。

下一步，为配置文档创建两个文件夹：

```
mkdir -p /var/lib/gantree/parachain
mkdir -p /var/lib/gantree/relay
```

下一步，生成配置文档，将每个文档放进上一步创建的文件夹中。请注意，需要替换以下信息：

  - 将`YOUR-API-KEY`替换成[https://app.gantree.io](https://app.gantree.io/)所提供的API密钥
  - `YOUR-SERVER-NAME`
  - 将`YOUR-PCK-KEY`替换为通过Discord server请求获取的PCK密钥

无论您连接至哪一个网络，`PROJECT_ID`标记将会永远被设置为`moonbeam`。`CLIENT_ID`应当包含您的公司行号，我们才能在Prometheus/Grafana仪表板上轻易地认出。

平行链：

```
# Contents of /var/lib/gantree/parachain/.gnw_config.json
{
  "api_key": "YOUR-API-KEY",
  "project_id": "moonbeam",
  "client_id": "YOUR-SERVER-NAME-parachain",
  "pckrc": "YOUR-PCK-KEY",
  "metrics_host": "http://127.0.0.1:9615"
}
```

嵌入式中继链：

```
# Contents of /var/lib/gantree/relay/.gnw_config.json
{
  "api_key": "YOUR-API-KEY",
  "project_id": "moonbeam",
  "client_id": "YOUR-SERVER-NAME-relay",
  "pckrc": "YOUR-PCK-KEY",
  "metrics_host": "http://127.0.0.1:9616"
}
```

下一步，创建systemd配置文档。

平行链：

```
# Contents of /etc/systemd/system/gantree-parachain.service

[Unit]
Description=Gantree Node Watchdog Parachain
After=network.target

[Service]
WorkingDirectory=/var/lib/gantree/parachain
Type=simple
Restart=always
ExecStart=/usr/local/bin/gantree_node_watchdog

[Install]
WantedBy=multi-user.target
```

嵌入式中继链：

```
# Contents of /etc/systemd/system/gantree-relay.service

[Unit]
Description=Gantree Node Watchdog Relay
After=network.target

[Service]
WorkingDirectory=/var/lib/gantree/relay
Type=simple
Restart=always
ExecStart=/usr/local/bin/gantree_node_watchdog

[Install]
WantedBy=multi-user.target
```

现在激活并启动systemd服务，检测日志错误：

```
sudo systemctl enable gantree-parachain
sudo systemctl start gantree-parachain && journalctl -f -u gantree-parachain

sudo systemctl enable gantree-relay
sudo systemctl start gantree-relay && journalctl -f -u gantree-relay
```

在日志中可以看到“waiting for provisioning”消息。完成后，可以登录[https://app.gantree.io](https://app.gantree.io/) 并选择网络。您会看到`View Monitoring Dashboard`链接，点击将跳转到您的定制Prometheus / Grafana面板，在那里可以按照您的需求进行个性化设置。