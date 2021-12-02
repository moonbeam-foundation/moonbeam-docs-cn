---
title: Graph节点
description: 通过此教程学习如何在Moonbeam上使用The Graph索引协议构建API
---

# 在Moonbeam上运行Graph节点

![The Graph Node on Moonbeam](/images/node-operators/indexer-nodes/the-graph/the-graph-node-banner.png)

## 概览 {: #introduction } 

Graph节点负责从区块链上获取事件消息，并精准更新数据存储。数据存储可通过GraphQL终端请求进行访问。

设置Graph节点有两种途径：可以使用Docker运行多合一的镜像，也可以采用[Rust部署](https://github.com/graphprotocol/graph-node)。本教程将介绍第一种方法。此方法更为便捷，且能帮助您快速创建Graph节点。

!!! 注意事项
    本教程示例基于Ubuntu 18.04和MacOS的环境，用户需根据其所使用其他系统进行微调。

## 查看先决条件 {: #checking-prerequisites } 

在创建Graph节点之前，请确保系统上已安装以下工具：

 - [Docker](https://docs.docker.com/get-docker/)
 - [Docker Compose](https://docs.docker.com/compose/install/)
 - [JQ](https://stedolan.github.io/jq/download/)

此外，您还需要有一个已启用`--ethapi=trace`选项且正在运行的节点。当前，有以下两种不同类型的节点供您选择：

 - **Moonbeam**开发节点 —— 在私有环境下运行自己的Moonbeam实例。具体操作请见[此教程](/getting-started/local-node/setting-up-a-node/)。请务必查看[高级标记章节](/getting-started/local-node/setting-up-a-node/#advanced-flags-and-options)
 - **Moonbase Alpha**节点 —— 在测试网上运行完整节点，并进入自己的私有终端。具体操作请见[此教程](/node-operators/networks/full-node/)。请务必查看[高级标记章节](/node-operators/networks/full-node/#advanced-flags-and-options)

在教程中，我们将用`--ethapi=trace`标记Graph节点，对应Moonbase Alpha完整节点运行。

如果您想运行开启`tracing`的全节点，请参考[运行追踪节点](/node-operators/networks/tracing-node)指南。

## 运行Graph节点 {: #running-a-graph-node } 

首先，克隆[Graph节点代码库](https://github.com/graphprotocol/graph-node/)：

```
git clone https://github.com/graphprotocol/graph-node/ \
&& cd graph-node/docker
```

接下来，执行`setup.sh`文档。这一步将拉出所有必要的Docker镜像，并在`docker-compose.yml`文档中写入必要信息。

```
./setup.sh
```

上一条指令的日志尾端应与以下内容相似：

![Graph Node setup](/images/node-operators/indexer-nodes/the-graph/the-graph-node-1.png)

设置好所有相关内容后，需要在`docker-compose.yml`文档中修改“Ethereum environment”，让其指向运行该Graph节点的节点终端。请注意，`setup.sh`文档会检测`Host IP`并写入一个值，因此您需要进行相应修改。

```
ethereum: 'mbase:{{ networks.development.rpc_url }}'
```

整个`docker-compose.yml`文档应与以下内容相似：

```
version: '3'
services:
  graph-node:
    image: graphprotocol/graph-node
    ports:
      - '8000:8000'
      - '8001:8001'
      - '8020:8020'
      - '8030:8030'
      - '8040:8040'
    depends_on:
      - ipfs
      - postgres
    environment:
      postgres_host: postgres
      postgres_user: graph-node
      postgres_pass: let-me-in
      postgres_db: graph-node
      ipfs: 'ipfs:5001'
      ethereum: 'mbase:{{ networks.development.rpc_url }}'
      RUST_LOG: info
  ipfs:
    image: ipfs/go-ipfs:v0.4.23
    ports:
      - '5001:5001'
    volumes:
      - ./data/ipfs:/data/ipfs
  postgres:
    image: postgres
    ports:
      - '5432:5432'
    command: ["postgres", "-cshared_preload_libraries=pg_stat_statements"]
    environment:
      POSTGRES_USER: graph-node
      POSTGRES_PASSWORD: let-me-in
      POSTGRES_DB: graph-node
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
```

最后，只需运行以下指令即可运行Graph节点：

```
docker-compose up
```

![Graph Node compose up](/images/node-operators/indexer-nodes/the-graph/the-graph-node-2.png)

稍后您就可以看到Graph节点与网络中最新可用区块同步的日志：

![Graph Node logs](/images/node-operators/indexer-nodes/the-graph/the-graph-node-3.png)

这就代表您已在Moonbase Alpha测试网成功部署并运行Graph节点。欢迎您随时对本示例进行调整，以适用于Moonbeam开发节点。
