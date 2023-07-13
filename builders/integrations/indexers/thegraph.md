---
title: 使用The Graph构建API
description: 了解如何使用Moonbeam上的Graph索引协议构建称为subgraph的API，以存储和获取给定智能合约的链上数据。
---

# 在Moonbeam上使用The Graph

## 概览 {: #introduction } 

索引协议可以更有效地组织信息，便于应用程序访问及使用。例如，Google就是通过索引整个互联网的信息，快速为搜索者提供所需信息。

[The Graph](https://thegraph.com/){target=_blank}是一个去中心化、开源的索引协议，可以为以太坊等网络查询信息进行服务。简而言之，The Graph提供了一种更有效的、储存智能合约发出的事件消息数据的方式，让其他项目或DApp都可以便捷地利用这些数据。

此外，开发人员还可以创建相应的API（称为Subgraph）。用户或其他开发人员可以用Subgraph来查询与一系列智能合约相关的数据，数据将通过标准化GraphQL API进行获取。您可以访问[此文档](https://thegraph.com/docs/en/about/introduction/#what-the-graph-is){target=_blank}了解更多关于The Graph协议的信息。

因为Moonbeam支持以太坊跟踪模块，The Graph可以索引Moonbeam上的区块链数据。本教程将介绍如何在Moonbase Alpha上为彩票合约创建简单的subgraph。本教程也可以在Moonbeam和Moonriver网络上使用。

--8<-- 'text/disclaimers/third-party-content-intro.md'

## 快速开始 {: #quick-start } 

如果您已经熟悉使用The Graph，并且想很快开始在Moonbeam上面开发，您可以在Subgraph manifest (`subgraph.yaml`)中配置以下网络：

=== "Moonbeam"
    ```
    dataSources:
      network: moonbeam
    ```

=== "Moonriver"
    ```
    dataSources:
      network: moonriver
    ```

=== "Moonbase Alpha"
    ```
    dataSources:
      network: mbase
    ```

=== "Moonbeam开发节点"
    ```
    dataSources:
      network: mbase
    ```

## 查看先决条件 {: #checking-prerequisites } 

在Moonbase Alpha上使用The Graph有两种方式：

 - 在Moonbase Alpha上运行Graph节点，并将Subgraph指向这一节点。具体操作步骤请见[此教程](/node-operators/indexers/thegraph-node/){target=_blank}（也可适用于Moonbeam和Moonriver）
 - 通过[Graph Explorer网站](https://thegraph.com/explorer/){target=_blank}将您的Subgraph指向The Graph API。为此，您需要创建账户，并获取访问代币  
    
## 彩票合约 {: #the-lottery-contract } 

我们将使用一个简单的彩票合约作为示例。您可以通过[MoonLotto Repo](https://github.com/PureStake/moonlotto-subgraph/blob/main/contracts/MoonLotto.sol){target=_blank}找到其Solidity文档。

合约玩家可以通过这个合约为自己购买彩票，也可以送给另外一位用户。一个小时后，如果参与者达到了十位，并且下一位玩家进入后，就会触发某一函数决定中奖者。所有储存在合约中的资金将发送到中奖者的地址上，然后游戏进入下一轮。

该合约的主要函数有：

 - **joinLottery** —— 没有输入值。进入本轮抽奖的函数，发送到合约的值（代币数量）需要与彩票价格相等
 - **giftTicket** —— 一个输入值：彩票接收者的地址。与`joinLottery`函数相似，但彩票持有者可以和彩票购买者为不同的地址
 - **enterLottery** —— 一个输入值：彩票持有者的地址。为内部函数，处理彩票逻辑。一个小时后，若参与者达到十人或更多，即调用`pickWinner`函数
 - **pickWinner** —— 没有输入值。为内部函数，通过伪随机数发生器（仅作演示用途）选择中奖者。该函数负责处理资金转移和重新设定下一轮彩票变量的逻辑

### 彩票合约事件 {: #events-of-the-lottery-contract } 

The Graph使用彩票合约发出的事件消息进行数据索引。彩票合约仅发出两种事件消息：

 - **PlayerJoined** —— 在`enterLottery`函数内，提供最后一个加入玩家相关的信息，例如玩家地址、本轮轮次、彩票是否已经送出，以及本轮的奖金数额等
 - **LotteryResult** —在`pickWinner`函数内，提供进行中轮次抽奖的相关信息，例如中奖者地址、本轮轮次、中奖者持有的奖券是否为赠予、彩票奖金数额大小以及抽奖时间戳等

## 创建Subgraph {: #creating-a-subgraph } 

本章节将介绍创建Subgraph的流程。彩票Subgraph的[GitHub代码库](https://github.com/PureStake/moonlotto-subgraph){target=_blank}有您所需的所有信息。此外，代码库还包含了该彩票合约以及Hardhat配置文件和部署脚本。如果您想了解更多关于配置文件和使用Hardhat部署智能合约，可以查看[Hardhat集成教程](/builders/build/eth-api/dev-env/hardhat/){target=_blank}。

第一步，克隆代码库并安装附带程序：

```
git clone https://github.com/PureStake/moonlotto-subgraph \
&& cd moonlotto-subgraph && yarn
```

运行以下代码为The Graph创建TypeScript类型：

```
npx graph codegen --output-dir src/types/
```

!!! 注意事项
    创建类型需要您在`subgraph.yaml`文档中指定ABI文档。在本示例的代码库中已经存在该文档，但在一般操作过程中，这是在编译好合约之后才获得的。

`codegen`命令也可使用`yarn codegen`执行。

在本示例中，合约的部署地址为`{{ networks.moonbase.thegraph.lotto_contract }}`。[Moonloto代码库](https://github.com/PureStake/moonlotto-subgraph){target=_blank}中的`README.md`文档也有合约编译与部署的必要步骤指引。

### Subgraph核心架构 {: #subgraphs-core-structure } 

一般而言，Subgraph定义了The Graph将从区块链上索引的数据以及其存储方式。Subgraph一般含有以下文档：

 - **subgraph.yaml** —— 包含着[Subgraph manifest](https://thegraph.com/docs/en/developer/create-subgraph-hosted/#the-subgraph-manifest){target=_blank}文件的YAML文档，也就是与Subgraph索引的智能合约相关的信息
 - **schema.graphql** —— [GraphQL schema](https://thegraph.com/docs/en/developer/create-subgraph-hosted/#the-graph-ql-schema){target=_blank}文档，定义正在创建的Subgraph的数据储存及其架构。通过[GraphQL interface definition schema](https://graphql.org/learn/schema/#type-language)){target=_blank}编写。
 - **AssemblyScript mappings** —— TypeScript中的代码（接下来编译为[AssemblyScript](https://github.com/AssemblyScript/assemblyscript){target=_blank}，用于将合约中的事件数据翻译成schema中定义的实体

创建Subgraph需要对文档进行修改，文档的修改没有特定顺序。

### Schema.graphql {: #schemagraphql } 

在对`schema.graphql`进行修改之前，需要先列明要从合约事件中抽取的数据。需要根据DApp本身的要求对schema进行定义。本示例中虽然没有与彩票相关的DApp，但我们定义了四个实体：

 - **Round** —— 一轮彩票抽奖活动。它将储存以下索引：轮次、发出奖金、轮次开始的时间戳、中奖者、结果出炉的时间以及参与彩票（从`Ticket`实体中获取）等相关信息
 - **Player** —— 参加了至少一轮的玩家。它将存储玩家地址和所有参与彩票（从`Ticket`实体中获取）的相关信息
 - **Ticket** —— 指的是参与一轮彩票抽奖活动的奖券。它将存储以下相关信息：奖券是否为赠予、持有者地址、奖券生效的轮次，以及奖券是否为最终中奖等

简而言之，`schema.graphql`函数的显示应与以下代码段相似：

```
type Round @entity {
  id: ID!
  index: BigInt!
  prize: BigInt! 
  timestampInit: BigInt!
  timestampEnd: BigInt
  tickets: [Ticket!] @derivedFrom(field: "round")
}

type Player @entity {
  id: ID!
  address: Bytes!
  tickets: [Ticket!] @derivedFrom(field: "player")
}

type Ticket @entity {
  id: ID!
  isGifted: Boolean!
  player: Player!
  round: Round!
  isWinner: Boolean!
}
```

### Subgraph清单文件 {: #subgraph-manifest } 

`subgraph.yaml`文档（或Subgraph的清单文件）包含与所索引智能合约相关的信息，其中包括映射所需的数据。数据将由Graph节点储存，应用程序可请求获取。

`subgraph.yaml`文档中一些重要参数有：

 - **repository** —— subgraph的Github代码库
 - **schema/file** —— `schema.graphql`文档的位置
 - **dataSources/name** —— Subgraph的名称
 - **network** —— 网络名称。对于所有在Moonbase Alpha上部署的Subgraph，这一值**必须**设置为`mbase`。Moonbeam和 Moonriver可分别使用`moonbeam`和`moonriver`标签
 - **dataSources/source/address** —— 利息合约地址
 - **dataSources/source/abi** —— 合约界面在以`codegen`命令创建的`types`文件夹中储存的位置
 - **dataSources/source/startBlock** —— 索引开始的第一个区块。在理想的情况下，这个数值和合约创建区块接近。在[Moonscan](https://moonbase.moonscan.io/)上提供合约地址即可获取这一信息。在本示例中，合约的创建区块为`{{ networks.moonbase.thegraph.block_number }}`
 - **dataSources/mapping/file** —— 映射文档的位置
 - **dataSources/mapping/entities** —— 在`schema.graphql`文档中实体的定义
 - **dataSources/abis/name** —— 合约界面在`types/dataSources/name`文档中的储存位置
 - **dataSources/abis/file** —— 带有合约ABI的`.json`文档的储存位置
 - **dataSources/eventHandlers** —— 不定义任何数值，但在这一章节指的是The Graph即将索引的所有事件
 - **dataSources/eventHandlers/event** —— 即将被合约跟踪的事件的结构。需要提供事件名称及其变量类型
 - **dataSources/eventHandlers/handler** —— 处理事件数据的`mapping.ts`文档中的函数名称

简而言之，`subgraph.yaml`函数的显示应与以下代码段相似：

```
specVersion: 0.0.4
description: Moonbeam lottery subgraph tutorial
repository: https://github.com/PureStake/moonlotto-subgraph
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum/contract
    name: MoonLotto
    network: mbase
    source:
      address: '{{ networks.moonbase.thegraph.lotto_contract }}'
      abi: MoonLotto
      startBlock: {{ networks.moonbase.thegraph.block_number }}
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      file: ./src/mapping.ts
      entities:
        - Player
        - Round
        - Ticket
        - Winner
      abis:
        - name: MoonLotto
          file: ./artifacts/contracts/MoonLotto.sol/MoonLotto.json
      eventHandlers:
        - event: PlayerJoined(uint256,address,uint256,bool,uint256)
          handler: handlePlayerJoined
        - event: LotteryResult(uint256,address,uint256,bool,uint256,uint256)
          handler: handleLotteryResult
```

### 映射 {: #mappings } 

映射文档是将区块链数据转换为在schema文档中定义的实体。`subgraph.yaml`文档中的每一个事件处理函数都需要在映射中有一个后续函数。

彩票合约示例中所用的映射文档可以在[Moonlotto Github Repository](https://github.com/PureStake/moonlotto-subgraph/blob/main/src/mapping.ts){target=_blank}中找到。

一般而言，处理函数的工作流程是：加载事件数据，检查是否已存在，以最优方式排列数据，并进行保存。例如， `PlayerJoined`事件的处理函数如下：

```js
export function handlePlayerJoined(event: PlayerJoined): void {
  // ID for the round:
  // round number
  let roundId = event.params.round.toString();
  // try to load Round from a previous player
  let round = Round.load(roundId);
  // if round doesn't exists, it's the first player in the round -> create round
  if (round == null) {
    round = new Round(roundId);
    round.timestampInit = event.block.timestamp;
  }
  round.index = event.params.round;
  round.prize = event.params.prizeAmount;

  round.save();

  // ID for the player:
  // issuer address
  let playerId = event.params.player.toHex();
  // try to load Player from previous rounds
  let player = Player.load(playerId);
  // if player doesn't exists, create it
  if (player == null) {
    player = new Player(playerId);
  }
  player.address = event.params.player;

  player.save();

  // ID for the ticket (round - player_address - ticket_index_round):
  // `${round_number}-${player_address}-${ticket_index_per_round}`
  let nextTicketIndex = event.params.ticketIndex.toString();
  let ticketId = `${roundId}-${playerId}-${nextTicketIndex}`;

  let ticket = new Ticket(ticketId);
  ticket.round = roundId;
  ticket.player = playerId;
  ticket.isGifted = event.params.isGifted;
  ticket.isWinner = false;

  ticket.save();  
}
```

## 部署Subgraph {: #deploying-a-subgraph }

部署Subgraph有几种方式。本教程会介绍使用[托管式服务部署](#using-the-hosted-service){target=_blank}，及使用[本地节点部署](#using-a-local-graph-node){target=_blank}。

### 使用托管式服务 {: #using-the-hosted-service }

如果您准备使用The Graph API（托管式服务），您需要进行以下步骤：

 - 首先您需要有Github账户，创建[Graph Explorer](https://thegraph.com/explorer/){target=_blank}账户
 - 进入主面板，并输入访问代币
 - 在Graph Explorer网页点击**Add Subgraph**按钮，创建Subgraph。输入Subgraph名称。

然后在命令行中添加access token和部署Subgraph
```
npx graph auth --product hosted-service <access-token>
npx graph deploy --product hosted-service <username>/<subgraph-name>    
```
 - **username** —— 即将创建的Subgraph相关的用户名
 - **subgraph-Name** —— Subgraph名称
 - **access-token** —— 使用Graph API服务的access token

!!! 注意事项
    以上步骤均可在[此链接](https://thegraph.com/docs/developer/quick-start#4-deploy-your-subgraph){target=_blank}中找到。


### 使用本地Graph节点 {: #using-a-local-graph-node }

如果您使用的是本地Graph节点，可以通过执行以下代码创建Subgraph：

```
npx graph create <username>/<subgraph-name> --node <graph-node>  
```

在以上代码中：

 - **username** —— 即将创建的Subgraph相关的用户名
 - **subgraphName** —— Subgraph名称
 - **graph-node** —— 使用托管式服务的URL；一般而言，本地Graph节点是`http://127.0.0.1:8020`


一旦创建完成后即可运行以下命令，用与此前相同的参数进行Subgraph部署：

```
npx graph deploy <username>/<subgraphName> \
--ipfs <ipfs-url> \
--node <graph-node> \
--access-token <access-token>
```

在以上命令中：

 - **username** —— 创建Subgraph时所使用的用户名
 - **subraphName**  —— 创建Subgraph时所定义的Subgraph名称
 - **ipfs-url** —— IPFS 的URL；如果使用的是The Graph API，可以使用`https://api.thegraph.com/ipfs/`地址。如果运行的是本地Graph节点，默认值为`http://localhost:5001`
 - **graph-node** —— 所使用的托管式服务的URL；如果使用的是The Graph API，可以使用 `https://api.thegraph.com/deploy/`。如果运行的是本地Graph节点，默认值为 `http://localhost:8020`
 - **access-token** —— 使用The Graph API的访问代币；如果使用的是本地Graph节点，那么这一参数为非必要参数

上述命令的日志应与以下内容相似：

![The Graph deployed](/images/builders/integrations/indexers/the-graph/the-graph-1.png)

现在各种DApp均可使用Subgraph终端获取由The Graph协议索引的数据。

--8<-- 'text/disclaimers/third-party-content.md'