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

--8<-- 'text/chainlink/brm.md'

## 高级用户 {: #advanced-users } 

如果您已经熟悉如何运行Chainlink预言机节点，可以通过以下信息快速进行Moonbase Alpha测试网部署：

 - Chainlink文档：[运行一个Chainlink节点](https://docs.chain.link/docs/running-a-chainlink-node){target=_blank}
 - Moonbase Alpha WSS EndPoint: `wss://wss.api.moonbase.moonbeam.network`
 - Moonbase Alpha ChainId: `{{ networks.moonbase.chain_id }}` (hex: `{{ networks.moonbase.hex_chain_id}}`)
 - Moonbase Alpha上的LINK Token地址: `0xa36085F69e2889c224210F603D836748e7dC0088`
 - 
 --8<-- 'text/faucet/faucet-list-item.md'

## 查看先决条件 {: #checking-prerequisites }

请先准备以下条件后再按照本教程进行操作：

 - 为运行Postgres DB和Chainlink节点容器[安装Docker](https://docs.docker.com/get-docker/){target=_blank}
 - 带资金的账户。您可以在[MetaMask](/tokens/connect/metamask/){target=blank}创建一个账户。
 --8<-- 'text/faucet/faucet-list-item.md'
 - 访问[Remix IDE](https://remix.ethereum.org/){target=blank}，如您想要使用该程序部署预言机合约。更多信息，请查阅[使用Remix部署至Moonbeam](/builders/build/eth-api/dev-env/remix/){target=blank}教程

## 如何操作 {: #getting-started } 

本教程将介绍设置预言机节点的步骤，简单概括如下：

 - 设置一个与Moonbase Alpha连接的Chainlink节点
 - 给节点注入资金
 - 部署预言机合约
 - 在节点上创建Job
 - 绑定节点与预言机
 - 使用客户端合约进行测试

## 节点设置 {: #node-setup } 

请执行以下步骤开始设置节点：

1. 创建一个新目录，将所有必要文档放入目录内

    ```
    mkdir -p ~/.chainlink-moonbeam && cd ~/.chainlink-moonbeam
    ```

2. 用Docker创建Postgres DB (MacOS users请将`--network host \`替换为`-p 5432:5432`)

    ```
docker run -d --name chainlink_postgres_db \
        --volume chainlink_postgres_data:/var/lib/postgresql/data \
        -e 'POSTGRES_PASSWORD={YOUR-PASSWORD-HERE}' \
        -e 'POSTGRES_USER=chainlink' \
        --network host \
        -t postgres:11
    ```
    
    请确保将`{YOUR_PASSWORD_HERE}`替换为真实的密码。如果尚未下载必要的镜像，Docker将继续下载

3. 在`chainlink-moonbeam`目录下创建Chainlink环境文档。该文档将在Chainlink容器创建过程中被读取。MacOS用户请将`localhost`替换成`host.docker.internal`

    ```
echo "ROOT=/chainlink
    LOG_LEVEL=debug
    ETH_CHAIN_ID=1287
    MIN_OUTGOING_CONFIRMATIONS=2
    LINK_CONTRACT_ADDRESS={LINK-TOKEN-CONTRACT-ADDRESS}
    CHAINLINK_TLS_PORT=0
    SECURE_COOKIES=false
    GAS_UPDATER_ENABLED=false
    ALLOW_ORIGINS=*
    ETH_URL=wss://wss.api.moonbase.moonbeam.network
    DATABASE_URL=postgresql://chainlink:{YOUR-PASSWORD-HERE}@localhost:5432/chainlink?sslmode=disable
    MINIMUM_CONTRACT_PAYMENT=0" > ~/.chainlink-moonbeam/.env
    ```
    
    除了密码（`{YOUR_PASSWORD_HERE}`）以外，还需要提供LINK Token合约（`{LINK TOKEN CONTRACT ADDRESS}`）。

4. 创建`.api`文档来储存用户和密码，用于进入节点API、节点运营用户界面以及Chainlink命令模式

    ```
    touch .api
    ```

5. 设置一个邮件地址和另一个密码

    ```
    echo "{AN-EMAIL-ADDRESS}" > ~/.chainlink-moonbeam/.api
    echo "{ANOTHER-PASSWORD}" >> ~/.chainlink-moonbeam/.api
    ```

6. 最后，还需要另一个文档来储存节点地址的钱包密码

    ```
    touch .password
    ```

7. Set the third password 

    设置第三个密码

    ```
    echo "{THIRD-PASSWORD}" > ~/.chainlink-moonbeam/.password
    ```

8. 激活容器（MacOS用户请将`--network host \`替换成`-p 6688:6688`）

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

!!! 注意事项
    请记住，请勿将真实密码储存在纯文本中。以上示例仅作演示用途。

通过以下命令来验证运行是否正常，以及日志是否持续记录：

```
docker ps #Containers Running
docker logs --tail 50 {CONTAINER-ID} #Logs progressing
```

![Docker logs](/images/node-operators/oracle-nodes/chainlink/chainlink-node-1.png)

## 合约设置 {: #contract-setup } 

预言机节点运行后，您可以开始配置智能合约。首先，请执行以下步骤为预言机节点注入资金：

1. 通过登录[Chainlink节点用户界面](http://localhost:6688/){target=_blank} (位于`http://localhost:6688/`)获取预言机节点地址，用于发送交易和写入链上数据。您将需要使用`.api`文档中的证书来获取地址。

    ![Chainlink login](/images/node-operators/oracle-nodes/chainlink/chainlink-node-2.png)

2. 进入**Configuration Page**页面，并复制节点地址

3. 注入资金。
 --8<-- 'text/faucet/faucet-list-item.md'
  
    ![Chainlink address](/images/node-operators/oracle-nodes/chainlink/chainlink-node-3.png)

下一步，部署预言机合约，它是区块链和节点之间的中间件。合约将发送包含所有必要信息的事件信息，并被预言机节点读取。然后节点将完成请求，并将所请求的数据写入调用者的合约。

预言机合约的源代码可以在Chainlink的官方[GitHub repository](https://github.com/smartcontractkit/chainlink/tree/develop/contracts/src/v0.6/Oracle.sol){target=blank}中找到。在本示例中，您将使用Remix来与Moonbase Alpha交互并部署合约。在[Remix](https://remix.ethereum.org/){target=blank}环境下，可以复制以下代码：

```
pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/Oracle.sol";
```

编译合约后，您可以通过以下步骤部署并与合约进行交互：

1. 进入**Deploy and Run Transactions**标签
2. 请确保已经选择**Injected Web3**，并将MetaMask连接至Moonbase Alpha
3. 验证您的地址被选择
4. 输入LINK Token地址，并点击**Deploy**以部署合约。MetaMask将弹出弹窗，您可以确认交易
5. 部署完成后，在**Deployed Contracts**板块复制合约地址。

![Deploy Oracle using Remix](/images/node-operators/oracle-nodes/chainlink/chainlink-node-4.png)

最后，绑定预言机节点和预言机智能合约。节点可以捕获发送到特定预言机合约的请求，但只有被授权（即绑定）的节点才能完成这一任务。请执行以下步骤以绑定预言机节点和智能合约：

1. 使用预言机合约中的`setFulfillmentPermission()`函数进行授权，输入您想要与合约绑定的节点地址
2. 在`_allowed`字段中您可以设置绑定状态下的布尔值逻辑，本例输入`true`
3. 点击**transact**发送请求。MetaMask将弹出弹窗，您可以确认交易
4. 通过视图函数`getAuthorizationStatus()`检查预言机节点是否获得授权，传入预言机节点地址

![Authorize Chainlink Oracle Node](/images/node-operators/oracle-nodes/chainlink/chainlink-node-5.png)

## 创建Job {: #creating-a-job } 

Chainlink预言机配置的最后一步就是创建Job。请参阅[Chainlink官方文档](https://docs.chain.link/docs/job-specifications){target=_blank}：

> 任务参数包含了一系列任务，节点必须执行这些任务才能获得最终结果。一条参数包含至少一个启动程序和一个任务（此前已详细讨论）。参数使用标准化JSON进行定义，实现人类可读，并能够轻易被Chainlink节点所分析。

如果将预言机看作API服务，那么Job就是其中一个函数，您可以调用这个函数并获得返回结果。请执行以下步骤创建您的第一个Job：

1. 进入[您节点的Job板块](http://localhost:6688/jobs){target=_blank}
2. 点击**New Job**

![Chainlink oracle New Job](/images/node-operators/oracle-nodes/chainlink/chainlink-node-6.png)

下一步，您可以创建新的Job：

1. 粘贴以下JSON代码。创建的任务将请求ETH目前的的美金价格。

    ```json
    {
      "initiators": [
        {
          "type": "runlog",
          "params": { "address": "YOUR-ORACLE-CONTRACT-ADDRESS" }
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

2. 请务必输入您的预言机合约地址（`YOUR-ORACLE-CONTRACT-ADDRESS`）。

3. 点击**Create Job**以创建Job

![Chainlink New Job JSON Blob](/images/node-operators/oracle-nodes/chainlink/chainlink-node-7.png)

成功！现在，Chainlink预言机节点已经设置成功，并且该节点已经在Moonbase Alpha上运行。

### 使用任何API {: #using-any-api }

您也可以创建并使用job spec来处理任何API。您可以您可以通过例如[market.link](https://market.link/){target=_blank}等独立列表服务搜索预有Job。请注意，尽管这些Job可能会为其他网络实现，但您将能够使用job spec在Moonbase Alpha上为您的预言机节点创建Job。当您找到一个可以满足您需求的Job后，您将需要复制这个job spec JSON并使用它来创建一个新的Job。

举例来说，之前的job规格可以被更改的更为通用，因此可用于任何API：

```json
{
  "initiators": [
    {
      "type": "runlog",
      "params": { "address": "YOUR-ORACLE-CONTRACT-ADDRESS" }
    }
  ],
  "tasks": [
    { "type": "httpget" },
    { "type": "jsonparse" },
    { "type": "multiply" },
    { "type": "ethuint256" },
    { "type": "ethtx" }
  ]
}
```

如果您需要一个更定制化的系统，您可以查阅Chainlink的文档了解如何构建您自己的[外部适配器](https://docs.chain.link/docs/developers/){target=_blank}。

## 预言机测试 {: #test-the-oracle } 

要验证预言机的在线状态以及是否能正常完成请求，请查阅[Chainlink预言机](/integrations/oracles/chainlink/)教程。主要步骤是：部署一个客户端合约，向预言机发送请求，并使预言机向客户端合约中写入所请求的数据。

--8<-- 'text/disclaimers/third-party-content.md'