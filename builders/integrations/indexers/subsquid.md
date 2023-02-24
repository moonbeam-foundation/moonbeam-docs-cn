---
title: 使用Subsquid检索Moonbeam数据
description: 学习如何在Moonbeam和Moonriver上使用Subsquid运行Substrate和EVM数据
---

# 在Moonbeam上使用Subsquid进行检索

![Subsquid Banner](/images/builders/integrations/indexers/subsquid/subsquid-banner.png)

## 概览 {: #introduction }

[Subsquid](https://subsquid.io){target=_blank}为基于Substrate区块链所使用的检索节点框架。简单而言，Subsquid可以被当成一个包含GraphQL服务器的ETL（提取、转换和加载）工具，提供全面的筛选、分页甚至是全文字搜索等服务。

Subsquid具有来自以太坊虚拟机（EVM）和Substrate数据的原生完整支持，允许开发者在任何Moonbeam网络中的任何项目提取链上数据并运行EVM记录和Substrate实体（事件、extrinsics和储存项），并利用单一个GraphQL端点提供搜索结果的相关数据。通过Subsquid，开发者既能够根据EVM主题、合约地址以及区块编号进行筛选。

本教程将会包含如何在Moonriver网络上创建一个Subsquid项目（也就是*“Squid"*）检索ERC-721 Token的转移记录。因此，您将会专注于`Transfer` EVM事件主题中。此教程也同样适用于Moonbeam或Moonbase Alpha。

--8<-- 'text/disclaimers/third-party-content-intro.md'

## 查看先决条件 {: #checking-prerequisites}

要顺利运行Squid项目，您需要安装以下软件：

- [Node.js](https://nodejs.org/en/download/){target=_blank} 版本16及后续版本
- [Docker](https://docs.docker.com/get-docker/){target=_blank}

## 创建一个项目 {: #create-a-project }

您可以使用Subsquid提供的模板代码库来创建项目，您可以跟随以下步骤进行操作：

1. 导向至[GitHub上的`squid-template`代码库](https://github.com/subsquid/squid-template){target=_blank}

2. 点击**Use this template**按钮

3. 选取账户以及用于您项目的代码库名称

4. 复制创建的代码库（请记得将`<account>`更换为您的GitHub账户）：

    ```bash
    git clone git@github.com:<account>/squid-template.git
    ```
    
5. 接着安装项目目录中的依赖项：

    ```bash
    cd squid-template && npm i
    ```
    
6. 同时，您还需要安装些许额外的依赖项以检索EVM数据：

    ```bash
    npm i @ethersproject/abi ethers @subsquid/substrate-evm-processor @subsquid/evm-typegen
    ```

[![Image from Gyazo](https://i.gyazo.com/a6d785e88ce366a327ce2bd60735df87.gif)](https://gyazo.com/a6d785e88ce366a327ce2bd60735df87)

下个部分将会使用模板并根据个人需求一步一步的进行修改，以获得和运行正确的数据。要查看完整的项目，您可以导向至在[GitHub上的`squid-evm-template`代码库](https://github.com/subsquid/squid-evm-template){target=_blank}。

## 定义实体模式 {: #define-entity-schema }

要在此教程中根据需求修改项目，您将会需要在模式中进行改变并定义追踪的实体，包含如下：

- Token转移
- Token所有权
- 合约以及其铸造的Token

您可以编辑`schema.graphql`文件进行修改：

```graphql
type Token @entity {
  id: ID!
  owner: Owner
  uri: String
  transfers: [Transfer!]! @derivedFrom(field: "token")
  contract: Contract
}

type Owner @entity {
  id: ID!
  ownedTokens: [Token!]! @derivedFrom(field: "owner")
  balance: BigInt
}

type Contract @entity {
  id: ID!
  name: String
  symbol: String
  totalSupply: BigInt
  mintedTokens: [Token!]! @derivedFrom(field: "contract")
}

type Transfer @entity {
  id: ID!
  token: Token!
  from: Owner
  to: Owner
  timestamp: BigInt!
  block: Int!
  transactionHash: String!
}
```

其中有几点关于[模式定义](https://docs.subsquid.io/develop-a-squid/schema-file/){target=_blank}，值得注意的部分如下所示：

  - **`@entity`** —— 表示此类型将被转换在数据库中储存的ORM模型
  - **`@derivedFrom`** —— 表示数据中的区域将不会永久保持，而会进行变化
  - **type references**（如： `from: Owner`）—— 作为两个实体之间的关系连接

要为模式定义生产TypeScript实体，您可以运行`codegen`工具：

```bash
npx sqd codegen
```

您可以在`src/model/generated`找到自动生成的文件。

![Subsquid Project structure](/images/builders/integrations/indexers/subsquid/subsquid-1.png)

## ABI定义和Wrapper {: #abi-definition-and-wrapper}

Subsquid支持为Substrate数据源（事件、extrinsics和储存项）自动构建TypeScript类型的安全接口，并会在Runtime中自动检测更变。要专门为EVM日志生成TypeScript接口和解码函数，可以使用Subsquid的`evm-typegen`工具。

要提取和运行ERC-721数据，您必须获取其应用二进制接口（Application Binary Interface, ABI）的定义。您可以在JSON文件中获取，并在其后导入项目之中。

1. 创建一个`abis`文件夹并为ERC-721 ABI创建一个JSON文件

    ```bash
    mkdir src/abis
    touch src/abis/ERC721.json
    ```
    
2. 复制[ERC-721接口的ABI](https://www.github.com/PureStake/moonbeam-docs/blob/master/.snippets/code/subsquid/erc721.md){target=_blank}，并粘贴至`ERC721.json`文件

!!! 注意事项
    ERC-721 ABI定义了合约里面所有事件的签名。`Transfer`事件有三个函数，分别为 `from`、`to`和`tokenId`，其类型分别为`address`、`address`和`uint256`。因此，`Transfer`事件真正的定义将为`Transfer(address, address, uint256)`。

### 修改TypeScript配置 {: #adjust-typescript-configuration }

要在TypeScript代码中读取并导入ABI JSON文件，您需要为`tsconfig.json`文件添加一个选项。请打开文件并在`"compilerOptions"`部分添加`"resolveJsonModule": true`选项：

```json
// tsconfig.json
{
  "compilerOptions": {
    ...
    "resolveJsonModule": true
  },
  ...
}
```

### 使用ABI以获得和解码事件数据 {: #get-and-decode-event-data }

要从ABI定义自动生成TypeScript接口并解码事件数据，只需从项目的根文件夹运行以下命令：

```bash
npx squid-evm-typegen --abi src/abi/ERC721.json --output src/abi/erc721.ts
```

`abi`参数指向之前创建的JSON文件，而`output`参数是将由命令本身生成的文件的名称。

## 定义和绑定事件处理程序 {: #define-and-bind-event-handlers }

Subsquid SDK提供用户[处理器](https://docs.subsquid.io/develop-a-squid/substrate-processor/){target=_blank}，被称为`SubstrateProcessor`，在特定情况下被称为[`SubstrateEvmProcessor`](https://docs.subsquid.io/substrate-indexing/evm-support/){target=_blank}。*处理器连接至 [Subsquid archive](https://docs.subsquid.io/docs/archives/){target=_blank}以获取链上数据。其自开始设定的开始区块运作，直到设定的最后一个区块或是新的数据被加入至链上时停止。

处理器提供会“处理”如同Substrate事件、extrinsics、储存项或是EVM记录等特定数据的附加函数。这函数能够通过指定事件、extrinsic名称、EVM记录合约地址进行配置。当处理器正在处理数据时，如果其遇到配置的事件名称，他将会执行“处理”函数内的内容。

在开始使用事件处理程序之前，有必要定义一些常量和一些辅助函数来管理EVM合约。您可以为这些项目创建一个附加文件：

```bash
touch src/contract.ts
```

### 管理EVM合约 {: #event-handler-and-helper-functions }

在 `src/contract.ts` 文件中，您将执行以下步骤：

1. 定义链节点端点（可选）
2. 创建一个合约接口来存储地址和ABI等信息
3. 定义函数以从数据库中获取合约实体或创建一个
4. 定义`processTransfer` EVM日志处理程序，实现跟踪令牌传输的逻辑

```typescript
// src/contracts.ts
import { assertNotNull, Store } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import * as erc721 from "./abi/erc721";
import { Contract } from "./model";
 
export const CHAIN_NODE = "wss://wss.api.moonriver.moonbeam.network";

export const contract = new ethers.Contract(
  "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a",
  erc721.abi,
  new ethers.providers.WebSocketProvider(assertNotNull(CHAIN_NODE))
);
 
export function createContractEntity(): Contract {
  return new Contract({
    id: contract.address,
    name: "Moonsama",
    symbol: "MSAMA",
    totalSupply: 1000n,
  });
}
 
let contractEntity: Contract | undefined;
 
export async function getContractEntity({
  store,
}: {
  store: Store;
}): Promise<Contract> {
  if (contractEntity == null) {
    contractEntity = await store.get(Contract, contract.address);
  }
  return assertNotNull(contractEntity);
}

async function processTransfer(ctx: EvmLogHandlerContext): Promise<void> {
  const transfer =
    events["Transfer(address,address,uint256)"].decode(ctx);

  let from = await ctx.store.get(Owner, transfer.from);
  if (from == null) {
    from = new Owner({ id: transfer.from, balance: 0n });
    await ctx.store.save(from);
  }

  let to = await ctx.store.get(Owner, transfer.to);
  if (to == null) {
    to = new Owner({ id: transfer.to, balance: 0n });
    await ctx.store.save(to);
  }

  let token = await ctx.store.get(Token, transfer.tokenId.toString());
  if (token == null) {
    token = new Token({
      id: transfer.tokenId.toString(),
      uri: await contract.tokenURI(transfer.tokenId),
      contract: await getContractEntity(ctx),
      owner: to,
    });
    await ctx.store.save(token);
  } else {
    token.owner = to;
    await ctx.store.save(token);
  }

  await ctx.store.save(
    new Transfer({
      id: ctx.txHash,
      token,
      from,
      to,
      timestamp: BigInt(ctx.substrate.block.timestamp),
      block: ctx.substrate.block.height,
      transactionHash: ctx.txHash,
    })
  );
}
```

“处理程序”函数包含一个`Context`的正确类型（此例为`EvmLogHandlerContext`）。此情况包含触发事件和接口以储存数据，并用于提取、运行和储存数据至数据库中。

!!! 注意事项
    关于活动处理程序，其同样能够在处理器中被绑定为”箭头函数“。

### 创建处理器并附带处理程序 {: #create-processor-and-attach-handler } 

现在您可以将处理程序函数附加至处理器并设置处理其确保能够顺利执行。您可以编辑`src/processor.ts`文件以进行操作。

1. 移除先前存在的代码
2. 更新导入以包含`CHAIN_NODE`和`contract`常量、`getContractEntity`和`createContractEntity`辅助函数、`processTransfer`处理函数和`events`映射
3. 使用`SubstrateEvmProcessor`创建一个处理器并自行命名。举例而言，您可以使用`moonriver-substrate`或是根据您使用的网络命名
4. 更新数据源和类型包
5. 附加EVM记录处理程序函数和区块前的触发器，其将会在数据库中创建和储存合约实体

```typescript
// src/processor.ts
import {
  EvmLogHandlerContext,
  SubstrateEvmProcessor,
} from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import { CHAIN_NODE, contract, createContractEntity, getContractEntity, processTransfer } from "./contract";
import { events } from "./abi/erc721";
import { Owner, Token, Transfer } from "./model";

const processor = new SubstrateEvmProcessor("moonriver-substrate");

processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("moonriver")[0].url,
});

processor.addPreHook({ range: { from: 0, to: 0 } }, async (ctx) => {
  await ctx.store.save(createContractEntity());
});

processor.addEvmLogHandler(
  contract.address,
  {
    filter: [events["Transfer(address,address,uint256)"].topic],
  },
  processTransfer
);

processor.run();
```

如果您希望在Moonbeam或Moonbase Alpha上进行操作，请确认数据源已更新至正确网路：

=== "Moonbeam"
    ```
    processor.setDataSource({
      chain: CHAIN_NODE,
      archive: lookupArchive("moonbeam")[0].url,
    });
    ```

=== "Moonriver"
    ```
    processor.setDataSource({
      chain: CHAIN_NODE,
      archive: lookupArchive("moonriver")[0].url,
    });
    ```

=== "Moonbase Alpha"
    ```
    processor.setDataSource({
      chain: CHAIN_NODE,
      archive: lookupArchive("moonbase")[0].url,
    });
    ```

!!! 注意事项
    `lookupArchive`为用于查询[archive registry](https://github.com/subsquid/archive-registry){target=_blank}并根据网络名称获取存档地址。网络名称均需为小写。

## 启动和设置数据库 {: #launch-and-set-up-the-database }

当您在本地运行项目，在此教程中您可以使用`docker-compose.yml`文件的模板启动一个PostgreSQL容器。您可以在您的终端中运行以下命令进行操作：

```bash
docker-compose up -d
```

[![Image from Gyazo](https://i.gyazo.com/71e9b457a3267e0a1d40496abcfc6e0a.gif)](https://gyazo.com/71e9b457a3267e0a1d40496abcfc6e0a)

!!! 注意事项
    `-d`参数可自行决定是否使用，其将以`daemon`模式启动容器，如此一来终端将不会被阻挡且不会出现其他额外输出。

Squid项目皆会通过[ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping){target=_blank}自动管理数据库连接和模式。

要设置数据库，您可以跟随以下步骤进行操作：

1. 构建代码

    ```bash
    npm run build
    ```
    
2. 移除模板的默认迁移

    ```bash
    rm -rf db/migrations/*.js
    ```
    
3. 确认Postgres Docker容器`squid-template_db_1`正在运行

    ```bash
    docker ps -a
    ```
    
4. 关闭目前数据库（如果您先前并未运行任何项目则无需执行此动作），并创建新的数据库、创建初始迁移并应用迁移

    ```bash
    npx sqd db drop
    npx sqd db create
    npx sqd db create-migration Init
    npx sqd db migrate
    ```
    
    ![Drop the database, re-create it, generate a migration and apply it](/images/builders/integrations/indexers/subsquid/subsquid-2.png)

## 启动项目 {: #launch-the-project }

您可以使用以下命令启动处理器（其将会阻挡当前终端）：

```bash
node -r dotenv/config lib/processor.js
```

[![Image from Gyazo](https://i.gyazo.com/13223997aa1e9738c842634826b39654.gif)](https://gyazo.com/13223997aa1e9738c842634826b39654)

最终，在个别的终端视窗中启动GraphQL服务器：

```bash
npx squid-graphql-server
```

导向至[`localhost:4350/graphql`](http://localhost:4350/graphql){target=_blank}以获取[GraphiQl](https://github.com/graphql/graphiql){target=_blank}控制器。在此视窗中，您可以进行执行如下所示的查询，以搜索拥有最大余额的账户持有人：

```graphql
query MyQuery {
  owners(limit: 10, where: {}, orderBy: balance_DESC) {
    balance
    id
  }
}
```

或是查看特定用户所持有的Token：

```graphql
query MyQuery {
  tokens(where: {owner: {id_eq: "0x495E889d1A6cEB447a57dcc1C68410299392380c"}}) {
    uri
    contract {
      id
      name
      symbol
      totalSupply
    }
  }
}
```

![GraphiQL playground with some sample queries](/images/builders/integrations/indexers/subsquid/subsquid-3.png)

恭喜您已成功设置，您可以开始使用此搜索功能了！

## 发布项目 {: #publish-the-project }

Subsquid提供一个SaaS解决方案以托管其社区创建的项目。请查看Subsquid官方文档网站上[部署您的Squid的教程](https://docs.subsquid.io/docs/deploy-squid/){target=_blank}以获取更多信息。

您同样可以导向至[Aquarium](https://app.subsquid.io/aquarium){target=_blank}查看其托管的项目。

## 示例项目代码库 {: #example-project-repository }

您可以在GitHub上查看[完成的完整项目](https://github.com/subsquid/squid-evm-template){target=_blank}。

[Subsquid文档](https://docs.subsquid.io/){target=_blank}包含许多信息且为最适合新手开始的平台，如果您希望了解除教程外的更多信息，请查看官方文档网站。

--8<-- 'text/disclaimers/third-party-content.md'