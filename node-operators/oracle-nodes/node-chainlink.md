---
title: 运行Chainlink预言机节点
description: 如何在Moonbeam网络设置Chainlink预言机节点为智能合约提供链上数据
---

# 在Moonbeam上运行Chainlink预言机节点

![Chainlink Moonbeam Banner](/images/node-operators/oracle-nodes/chainlink/chainlink-node-banner.png)

## 概览 {: #introduction } 

作为一个开放、无许可的网络，任何人都可以在Moonbeam上运行预言机，为智能合约提供数据。

本文概述了在Moonbase Alpha上设置Chainlink预言机的流程。

!!! 注意事项
    文中所用示例仅作演示用途。请**务必**妥善管理密码，请勿将密码储存在纯文本中。文中示例均在Ubuntu 18.04环境下运行，但也有包含了MacOs的调用。本教程仅适用于开发设置，并不适用于生产环境。

## 基本请求模型 {: #basic-request-model } 

在开始之前，我们需要先了解“基本请求模型”的基本知识。

一个预言机节点有一系列Job ID，每个ID对应用户可发起的任务。例如，使用Chainlink的喂价获取价格数据，用户需要通过*客户*合约发送请求，传递以下信息：

 - 预言机地址：预言机节点部署的合约地址
 - Job ID：需要执行的任务
 - 支付：预言机在收到LINK代币支付后，将完成请求

这一请求实际上会向LINK代币合约发送*transferAndCall*指令，由该合约进行支付处理，并且将该请求传输给预言机合约。随同该请求一并发出的还有事件信息，后者会被预言机节点拾取。接下来，节点就会获取必要数据并执行*fulfilOracleRequest*函数，这一函数将执行回调，将请求的信息储存在客户合约中。具体工作流程如下图所示。

![Basic Request Diagram](/images/node-operators/oracle-nodes/chainlink/chainlink-basic-request.png)

## 高级用户 {: #advanced-users } 

如果您已经熟悉如何运行Chainlink预言机节点，可以通过以下信息快速进行Moonbase Alpha测试网部署：

 - [Chainlink文档](https://docs.chain.link/docs/running-a-chainlink-node)
 - Moonbase Alpha WSS EndPoint: `wss://wss.api.moonbase.moonbeam.network`
 - Moonbase Alpha ChainId: `{{ networks.moonbase.chain_id }}` (hex: `{{ networks.moonbase.hex_chain_id}}`)
 - Moonbase Alpha上的LINK代币地址：`0xa36085F69e2889c224210F603D836748e7dC0088`
 - 从我们的[任务中心](/getting-started/moonbase/faucet/)获取Moonbase Alpha代币

## 如何操作 {: #getting-started } 

本教程将介绍设置预言机节点的步骤，简单概括如下：

 - 设置一个与Moonbase Alpha连接的Chainlink节点
 - 资金节点
 - 部署预言机合约
 - 在Chainlink节点上创建任务
 - 绑定节点与预言机
 - 使用客户合约进行测试

操作需要满足以下基本要求：

 - 有运行Postgres DB和ChainLink节点的Docker容器。如您想了解关于安装Docker的更多详情，请访问[这一页面](https://docs.docker.com/get-docker/)
 - 账户中需有一定余额。您可以通过[Metamask](/integrations/wallets/metamask/)创建账户，并通过我们的[任务中心](/getting-started/moonbase/faucet/)充值资金
 - 能够使用Remix IDE，以满足部署预言机合约的需求。如您想了解关于Moonbeam 上的Remix运行环境，请访问[这一页面](/integrations/remix/)

## 节点设置 {: #node-setup } 

首先创建一个新目录，将所有必要文档放入目录内，例如：

```
mkdir -p ~/.chainlink-moonbeam //
cd ~/.chainlink-moonbeam
```

下一步使用Docker创建Postgres DB。请执行以下命令（MacOs用户请将`--network host \`替换为`-p 5432:5432`）：

```
docker run -d --name chainlink_postgres_db \
    --volume chainlink_postgres_data:/var/lib/postgresql/data \
    -e 'POSTGRES_PASSWORD={YOU_PASSWORD_HERE}' \
    -e 'POSTGRES_USER=chainlink' \
    --network host \
    -t postgres:11
```

请确保将`{YOU_PASSWORD_HERE}`替换为真实的密码。

!!! 注意事项
    请记住，请勿将真实密码储存在纯文本中。以上示例仅作演示用途。

如果镜像失效，Docker将继续下载必要的镜像。下一步，在新创建目录下创建Chainlink环境文档，该文档将在Chainlink容器创建过程中被读取。MacOs用户请将`localhost`替换成`host.docker.internal`。

```
echo "ROOT=/chainlink
LOG_LEVEL=debug
ETH_CHAIN_ID=1287
MIN_OUTGOING_CONFIRMATIONS=2
LINK_CONTRACT_ADDRESS={LINK TOKEN CONTRACT ADDRESS}
CHAINLINK_TLS_PORT=0
SECURE_COOKIES=false
GAS_UPDATER_ENABLED=false
ALLOW_ORIGINS=*
ETH_URL=wss://wss.api.moonbase.moonbeam.network
DATABASE_URL=postgresql://chainlink:{YOUR_PASSWORD_HERE}@localhost:5432/chainlink?sslmode=disable
MINIMUM_CONTRACT_PAYMENT=0" > ~/.chainlink-moonbeam/.env
```

除了密码（`{YOUR_PASSWORD_HERE}`）以外，还需要提供Link代币合约（`{LINK TOKEN CONTRACT ADDRESS}`）。创建环境文档后，还需要`.api`文档来储存用户和密码，用于进入节点API、节点运营用户界面以及Chainlink命令模式。

```
echo "{AN_EMAIL_ADDRESS}" >  ~/.chainlink-moonbeam/.api
echo "{ANOTHER_PASSWORD}"   >> ~/.chainlink-moonbeam/.api
```

设置一个邮件地址和另一个密码。最后，还需要另一个文档来储存节点地址的钱包密码：

```
echo "{THIRD_PASSWORD}" > ~/.chainlink-moonbeam/.password
```

在创建好所有必要文档后，请执行以下命令（MacOs用户请将`--network host \`替换成`-p 6688:6688`）激活容器：

```
docker run -d --name chainlink_oracle_node \
    --volume $(pwd):/chainlink \
    --env-file=.env \
    --network host \
    -t smartcontract/chainlink:0.9.2 \
        local n \
        -p /chainlink/.password \
        -a /chainlink/.api
```

通过以下命令来验证运行是否正常，以及日志是否持续记录：

```
docker ps #Containers Running
docker logs --tail 50 {container_id} #Logs progressing
```

![Docker logs](/images/node-operators/oracle-nodes/chainlink/chainlink-node-1.png)

## 合约设置 {: #contract-setup } 

预言机节点进入运行后，接着设置智能合约。

首先，我们需要获取预言机节点地址，用于发送交易和写入链上数据。请登录[ChainLink节点用户界面](http://localhost:6688/)，使用`.api`文档中的证书来获取地址。如下图所示：

![Chainlink login](/images/node-operators/oracle-nodes/chainlink/chainlink-node-2.png)

进入“Configuration Page”页面，并复制节点地址。通过[Moonbeam任务中心](/getting-started/moonbase/faucet/)注入资金。

![Chainlink address](/images/node-operators/oracle-nodes/chainlink/chainlink-node-3.png)

下一步，部署预言机合约，它是区块链和节点之间的中间件。合约将发送包含所有必要信息的事件信息，并被预言机节点读取。然后节点将完成请求，并将所请求的数据写入调用者的合约。

预言机合约的源代码可以在Chainlink的官方[GitHub repository](https://github.com/smartcontractkit/chainlink/tree/develop/contracts/src/v0.6)中找到。在本示例中，我们将使用Remix来与Moonbase Alpha交互并部署合约。在Remix环境下，可以复制以下代码：

```
pragma solidity ^0.6.6;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/Oracle.sol";
```

编译好合约后，进入“Deploy and Run Transactions”标签，输入Link代币地址，并部署合约。部署完成后，复制合约地址。

![Deploy Oracle using Remix](/images/node-operators/oracle-nodes/chainlink/chainlink-node-4.png)

最后，绑定预言机节点和预言机智能合约。节点可以捕获发送到特定预言机合约的请求，但只有被授权（即绑定）的节点才能完成这一任务。

使用预言机合约中的`setFulfillmentPermission()`函数进行授权，这一操作需要两个参数：

 - 需要绑定到合约的节点地址（即上一步的内容）
 - 设置绑定状态下的布尔值，在本示例中设置为`true`

我们可以使用在Remix上部署的合约实例来完成这一操作，并在视图函数`getAuthorizationStatus()`中输入预言机节点地址，检查预言机节点是否获得授权。

![Authorize Chainlink Oracle Node](/images/node-operators/oracle-nodes/chainlink/chainlink-node-5.png)

## 在预言机节点上创建任务 {: #create-job-on-the-oracle-node } 

Chainlink预言机配置的最后一步就是创建任务。请参阅[Chainlink官方文档](https://docs.chain.link/docs/job-specifications)：

> 任务参数包含了一系列任务，节点必须执行这些任务才能获得最终结果。一条参数包含至少一个启动程序和一个任务（此前已详细讨论）。参数使用标准化JSON进行定义，实现人类可读，并能够轻易被Chainlink节点所分析。

如果将预言机看作API服务，那么任务就是其中一个函数，我们调用这个函数并获得返回结果。创建第一个任务，请来到节点的[“Jobs”板块](http://localhost:6688/jobs)，并点击“New Job”。

![Chainlink Oracle New Job](/images/node-operators/oracle-nodes/chainlink/chainlink-node-6.png)

下一步，粘贴以下JSON代码。创建的任务将请求ETH目前的的美金价格。请务必输入您的预言机合约地址（`YOUR_ORACLE_CONTRACT_ADDRESS`）。

```
{
  "initiators": [
    {
      "type": "runlog",
      "params": { "address": "YOUR_ORACLE_CONTRACT_ADDRESS" }
    }
  ],
  "tasks": [
    {
      "type": "httpget",
      "params": { "get": "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD" }
    },
    {
      "type": "jsonparse",
      "params": { "path": [ "USD" ] }
    },
    {
      "type": "multiply",
      "params": { "times": 100 }
    },
    { "type": "ethuint256" },
    { "type": "ethtx" }
  ]
}
```

![Chainlink New Job JSON Blob](/images/node-operators/oracle-nodes/chainlink/chainlink-node-7.png)

成功！现在，Chainlink预言机节点已经设置成功，并且该节点已经在Moonbase Alpha上运行。

## 预言机测试 {: #test-the-oracle } 

To verify the Oracle is up and answering requests, follow our [using an Oracle](/integrations/oracles/chainlink/) tutorial. The main idea is to deploy a client contract that requests to the Oracle, and the Oracle writes the requested data into the contract's storage.

要验证预言机的在线状态以及是否能正常完成请求，请参阅[预言机使用教程](/integrations/oracles/chainlink/)进行操作。主要步骤是：部署一个客户合约，向预言机发送请求，并使预言机向客户合约中写入所请求的数据。

--8<-- 'text/disclaimers/third-party-content.md'