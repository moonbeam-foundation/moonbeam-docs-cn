---
title: Index NFT Transfers with Subsquid - 使用Subsquid索引NFT转移
description: Learn how to use Subsquid, a query node framework for Substrate-based chains, to index and process Substrate and EVM data for Moonbeam and Moonriver.
通过本教程学习如何使用Subsquid（基于Substrate区块链的查询节点框架）索引和处理Moonbeam和Moonriver的Substrate和EVM数据。
---

# Indexing NFT Transfers on Moonbeam with Subsquid - 使用Subsquid在Moonbeam上索引NFT转移

![Subsquid Banner](/images/builders/integrations/indexers/subsquid/subsquid-banner.png)

_March 7, 2023 | by Massimo Luraschi_

_本文档更新至2023年3月7日｜作者：Massimo Luraschi_

## Introduction 概览 {: #introduction }

[Subsquid](https://subsquid.io){target=_blank} is a full-stack blockchain indexing SDK with specialized data lakes (Archives) optimized for the extraction of large volumes of historical on-chain data.

[Subsquid](https://subsquid.io){target=_blank}是一个全栈区块链索引SDK，其具有专门的数据湖（Archives），对大量历史链上数据的提取进行了优化。

The SDK offers a highly customizable Extract-Transform-Load-Query stack and indexing speeds of up to and beyond 50,000 blocks per second when indexing events and transactions.

SDK提供高度可自定义的Extract-Transform-Load-Query堆栈，索引事件和交易时其索引速度高达每秒超过50,000区块。

Subsquid has native and full support for both the Ethereum Virtual Machine and Substrate data. This allows developers to extract on-chain data from any of the Moonbeam networks and process EVM logs as well as Substrate entities (events, extrinsics and storage items) in one single project and serve the resulting data with one single GraphQL endpoint. With Subsquid, filtering by EVM topic, contract address, and block range are all possible.

Subsquid拥有原生和全面的EVM和Substrate数据支持。这允许开发者从任何Moonbeam网络提取链上数据，在单个项目处理EVM日志和Substrate entities（事件、extrinsics和存储项）并使用单个GraphQL端点提供结果数据。通过Subsquid，可以根据EVM主题、智能合约和区块范围进行筛选。

This guide will explain how to create a Subsquid project (also known as a *"squid"*) from a template (indexing Moonsama transfers on Moonriver), and change it to index ERC-721 token transfers on the Moonbeam network. As such, you'll be looking at the `Transfer` EVM event topics. This guide can be adapted for Moonbase Alpha as well.

本教程将介绍如何从在Moonriver上索引Moonsama转移的模板中创建Subsquid项目（也称为*"squid"*），并将其改为在Moonbeam网络上索引ERC-721 Token转移。这样一来，您会看到`Transfer` EVM事件主题。本教程也同样适用于Moonbase Alpha。

--8<-- 'text/disclaimers/third-party-content-intro.md'

## Checking Prerequisites - 查看先决条件 {: #checking-prerequisites }

For a Squid project to be able to run, you need to have the following installed:

要使Squid项目能够运行，您需要提前准备以下内容：

- Familiarity with Git 
- 熟悉Git
- [Node.js](https://nodejs.org/en/download/){target=_blank} version 16 or later
- [Node.js](https://nodejs.org/en/download/){target=_blank} v16及以上版本
- [Docker](https://docs.docker.com/get-docker/){target=_blank}
- [Squid CLI](https://docs.subsquid.io/squid-cli/installation){target=_blank}

!!! note 注意事项
    This tutorial uses custom scripts defined in `commands.json`. The scripts are automatically picked up as `sqd` sub-commands.

此教程使用`commands.json`中定义的自定义脚本。此脚本会自动作为`sqd`子命令进行获取。

## Scaffold a Project From a Template - 从模板中scaffold一个项目 {: #scaffolding-using-sqd-init }

We will start with the [`frontier-evm` squid template](https://github.com/subsquid-labs/squid-frontier-evm-template/){target=_blank} available through [`sqd init`](https://docs.subsquid.io/squid-cli/){target=_blank}. It is built to index EVM smart contracts deployed on Moonriver, but it is also capable of indexing Substrate events. To retrieve the template and install the dependencies, run

我们将从[`sqd init`](https://docs.subsquid.io/squid-cli/){target=_blank}使用[`frontier-evm` squid模板](https://github.com/subsquid-labs/squid-frontier-evm-template/){target=_blank}开始创建。其旨在索引Moonriver上部署的EVM智能合约，但是它也同样可以索引Substrate事件。要检索模板并安装依赖项，请运行以下命令：

```bash
sqd init moonbeam-tutorial --template frontier-evm
cd moonbeam-tutorial
npm ci
```

## Define Entity Schema - 定义Entity Schema  {: #define-entity-schema }

Next, we ensure that the data [schema](https://docs.subsquid.io/basics/schema-file/){target=_blank} of the squid defines [entities](https://docs.subsquid.io/basics/schema-file/entities/){target=_blank} that we would like to track. We are interested in:

接下来，我们要确保squid的数据[schema](https://docs.subsquid.io/basics/schema-file/){target=_blank}定义我们想要追踪的[entities](https://docs.subsquid.io/basics/schema-file/entities/){target=_blank}，具体如下：

* Token transfers
* Token转移
* Ownership of tokens
* Token所有权
* Contracts and their minted tokens
* 合约及其铸造的Token

Luckily, the EVM template already contains a schema file that defines the exact entities we need:

幸运的是，EVM模板已经包含了定义我们所需entities的schema文件：

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

It's worth noting a couple of things in this [schema definition](https://docs.subsquid.io/basics/schema-file/){target=_blank}:

此[schema定义](https://docs.subsquid.io/basics/schema-file/){target=_blank}中需要注意以下几个部分：

* **`@entity`** - signals that this type will be translated into an ORM model that is going to be persisted in the database
* **`@entity`** - 表明此类型将被转换为持久保存在数据库中的ORM模型
* **`@derivedFrom`** - signals that the field will not be persisted in the database. Instead, it will be [derived from](https://docs.subsquid.io/basics/schema-file/entity-relations/){target=_blank} the entity relations
* **`@derivedFrom`** - 表示该字段不会保留在数据库中。而是[来自](https://docs.subsquid.io/basics/schema-file/entity-relations/){target=_blank}entity关系
* **type references** (e.g. `from: Owner`) - when used on entity types, they establish a relation between two entities
* **type references** (e.g. `from: Owner`) - 当使用entity类型时，他们建立两个entity之间的关系

TypeScript entity classes have to be regenerated whenever the schema is changed, and to do that we use the `squid-typeorm-codegen` tool. The pre-packaged `commands.json` already comes with a `codegen` shortcut, so we can invoke it with `sqd`:

当schema更改时，都必须重新生成TypeScript entity类，我们可以使用`squid-typeorm-codegen`工具来实现。预先打包的`commands.json`已经包含`codegen`快捷方式，因此我们可以使用`sqd`来调用它：

```bash
sqd codegen
```

The (re)generated entity classes can then be browsed at `src/model/generated`.

（重新）生成的entity类可以在`src/model/generated`中找到。

## ABI Definition and Wrapper - ABI定义和Wrapper {: #abi-definition }

Subsquid maintains [tools](https://docs.subsquid.io/substrate-indexing/squid-substrate-typegen/){target=_blank} for automated generation of TypeScript classes for handling Substrate data sources (events, extrinsics, storage items). Possible runtime upgrades are automatically detected and accounted for.

Subsquid维护[工具](https://docs.subsquid.io/substrate-indexing/squid-substrate-typegen/){target=_blank}，用于自动生成TypeScript类，以处理Substrate数据源（事件、extrinsics、存储项）。Runtime升级时会自动检测并说明。

Similar functionality is available for EVM indexing through the [`squid-evm-typegen`](https://docs.subsquid.io/evm-indexing/squid-evm-typegen/){target=_blank} tool. It generates TypeScript modules for handling EVM logs and transactions based on a [JSON ABI](https://docs.ethers.io/v5/api/utils/abi/){target=_blank} of the contract.

类似的功能可以通过[`squid-evm-typegen`](https://docs.subsquid.io/evm-indexing/squid-evm-typegen/){target=_blank}用于EVM索引。这将根据合约的[JSON ABI](https://docs.ethers.io/v5/api/utils/abi/){target=_blank}生成TypeScript模块，用于处理EVM日志和基于交易。

For our squid we will need such a module for the [ERC-721](https://eips.ethereum.org/EIPS/eip-721){target=_blank}-compliant part of the contracts' interfaces. Once again, the template repository already includes it, but it is still important to explain what needs to be done in case one wants to index a different type of contract.

对于我们的squid，我们将需要一个用于满足合约接口兼容[ERC-721](https://eips.ethereum.org/EIPS/eip-721){target=_blank}部分的模块。再次提醒，此模板的代码库已将其包含在里面，但是仍需要解释索引不同类型合约时需要完成的事项。

The procedure uses a `sqd` script from the template that uses `squid-evm-typegen` to generate Typescript facades for JSON ABIs stored in the `abi` folder. Place any ABIs you requre for interfacing your contracts there and run:

该过程使用模板中的`sqd`脚本，该脚本使用`squid-evm-typegen`为存储在`abi`文件夹中的JSON ABI生成Typescript facades。放入连接合约所需的任何ABI并运行以下命令：

```bash
sqd typegen
```

The results will be stored at `src/abi`. One module will be generated for each ABI file, and it will include constants useful for filtering and functions for decoding EVM events and functions defined in the ABI.

结果将存储在`src/abi`中。这将为每个ABI文件生成一个模块，此模块会包含用于筛选的常量和用于解码ABI中定义的EVM事件和函数的函数。

## Define and Bind Event Handler(s) - 定义和绑定事件处理器 {: #define-event-handlers }

Subsquid SDK provides users with the [`SubstrateBatchProcessor` class](https://docs.subsquid.io/substrate-indexing/){target=_blank}. Its instances connect to chain-specific [Subsquid archives](https://docs.subsquid.io/archives/overview/){target=_blank} to get chain data and apply custom transformations. The indexing begins at the starting block and keeps up with new blocks after reaching the tip.

Subsquid SDK为用户提供[`SubstrateBatchProcessor`类](https://docs.subsquid.io/substrate-indexing/){target=_blank}。其实例连接指定区块链的[Subsquid archives](https://docs.subsquid.io/archives/overview/){target=_blank}以访问链数据并进行自定义转换。索引从起始区块开始，并在达到最高值之后与最新区块保持一致。

The `SubstrateBatchProcessor` [exposes methods](https://docs.subsquid.io/substrate-indexing/configuration/){target=_blank} to "subscribe" to specific data such as Substrate events, extrinsics, storage items or, for EVM, logs and transactions. The actual data processing is then started by calling the `.run()` function. This will start generating requests to the Archive for [*batches*](https://docs.subsquid.io/basics/batch-processing/){target=_blank} of data specified in the configuration, and will trigger the callback function, or *batch handler* (passed to `.run()` as second argument) every time a batch is returned by the Archive.

`SubstrateBatchProcessor`公开了“订阅”指定数据的[函数](https://docs.subsquid.io/substrate-indexing/configuration/){target=_blank}，包括Substrate事件、extrinsics、存储项、或者EVM日志和交易。然后，通过调用`.run()`函数开始实际数据处理。这将开始为配置中指定数据的[*batches*](https://docs.subsquid.io/basics/batch-processing/){target=_blank}生成对Archive的请求，并触发回调函数，如果每次由Archive返回batch则触发*batch handler*（作为第二个参数传递给`.run()`）。

It is in this callback function that all the mapping logic is expressed. This is where chain data decoding should be implemented, and where the code to save processed data on the database should be defined.

回调函数表达了所有的映射逻辑。此处实现链数据解码，也会定义将处理后的数据保存在数据库中的代码。

### Managing the EVM contract - 管理EVM合约 {: #managing-the-evm-contract }

Before we begin defining the mapping logic of the squid, we are going to rewrite the `src/contracts.ts` utility module for managing the involved EVM contracts. It will export:

在开始定义squid的映射逻辑之前，我们要先重写`src/contracts.ts`公用设施模块以管理参与的EVM合约。这将导出：

* Addresses of [Gromlins](https://moonscan.io/token/0xf27a6c72398eb7e25543d19fda370b7083474735){target=_blank} contract
* [Gromlins](https://moonscan.io/token/0xf27a6c72398eb7e25543d19fda370b7083474735){target=_blank}合约的地址
* A function that will create and save an instance of the `Contract` entity to the database
* 一个创建和保存`Contract` entity实例至数据库的函数
* A function that rill return a `Contract` instance (either the already existing one, or a newly created entity). The first time the function is called, it verifies if a `Contract` does exist already, in the negative case, it will invoke the first function, and cache the result, so on subsequent calls the cached version will be returned
* 一个返回`Contract`实例（已经存在或新创建的entity）的函数。第一次调用该函数时，它会验证`Contract`是否已经存在，反之，它将调用第一个函数，并缓存结果，因此在后续调用中将会返回缓存版本

Here are the full file contents:

查看完整的文件内容：

```typescript
--8<-- 'code/tutorials/integrations/nft-subsquid/contract.ts'
```

You might notice a warning that the `Context` variable hasn't been exported, but don't worry, as we'll export it from the `src/processor.ts` file in the next section.

你可能会收到`Context`变量未导出的警告，但是无需担心，我们将从在下一部分中从`src/processor.ts`文件导出。

!!! note 注意事项
    The `createContractEntity` function is accessing the **state** of the contract via a chain RPC endpoint. This is slowing down the indexing a little, but this data is only available this way. You'll find more information on accessing state in the [dedicated section of our docs](https://docs.subsquid.io/substrate-indexing/evm-support#access-the-contract-state){target=_blank}.

`createContractEntity`函数通过链的RPC端点访问合约的**state**。这会稍微减慢索引的速度，但这是访问此数据的唯一方法。您可以在[此文档](https://docs.subsquid.io/substrate-indexing/evm-support#access-the-contract-state){target=_blank}找到获取状态的更多信息。

## Configure Processor and Attach Handler - 配置处理器 {: #configure-processor }

The `src/processor.ts` file is where squids instantiate the processor (a `SubstrateBatchProcessor` in our case), configure it and attach the handler functions.

`src/processor.ts`文件是squids实例化处理器（本示例中为`SubstrateBatchProcessor`）和配置并添加处理器函数的地方。

Not much needs to be changed here, except adapting the template code to handle the Gromlins contract and setting the processor to use the `moonbeam` archive URL retrieved from the [archive registry](https://github.com/subsquid/archive-registry){target=_blank}.

此处只需要调整模板代码以处理Gromlins合约并将处理器设置为使用从[archive registry](https://github.com/subsquid/archive-registry){target=_blank}中检索到的`moonbeam` archive URL。

--8<-- 'text/common/endpoint-examples.md'

If you are adapting this guide for Moonriver or Moonbase Alpha, be sure to update the data source to the correct network:

此教程也同样适用于Moonriver或Moonbase Alpha，但请确保将数据源更新为正确的网络：

=== "Moonbeam"
    ```
    processor.setDataSource({
      chain: process.env.RPC_ENDPOINT, // TODO: Add the endpoint to your .env file
      archive: lookupArchive("moonbeam", {type: "Substrate"}),
    });
    ```

=== "Moonriver"
    ```
    processor.setDataSource({
      chain: process.env.RPC_ENDPOINT, // TODO: Add the endpoint to your .env file
      archive: lookupArchive("moonriver", {type: "Substrate"}),
    });
    ```

=== "Moonbase Alpha"
    ```
    processor.setDataSource({
      chain: process.env.RPC_ENDPOINT, // TODO: Add the endpoint to your .env file
      archive: lookupArchive("moonbase", {type: "Substrate"}),
    });
    ```

!!! note 注意事项
    The `lookupArchive` function is used to consult the [archive registry](https://github.com/subsquid/archive-registry){target=_blank} and yield the archive address, given a network name. Network names should be in lowercase.

`lookupArchive`函数用于查询[archive registry](https://github.com/subsquid/archive-registry){target=_blank}并在给定网络名称的情况下生成archive地址。注意网络名称需为小写。

You'll also need to modify the `Context` type so that it is exported and can be used in the `src/contract.ts` file.

您也需要修改`Context`类型，使其可以导出并用于`src/contract.ts`文件中。

```ts
export type Context = BatchContext<Store, Item>;
```

Here is the end result:

终端显示应为：

```typescript
--8<-- 'code/tutorials/integrations/nft-subsquid/processor.ts'
```

!!! note 注意事项
    It is also worth pointing out that the `contract.tokenURI` call is accessing the **state** of the contract via a chain RPC endpoint. This is slowing down the indexing a little bit, but this data is only available this way. You'll find more information on accessing state in the [dedicated section of the Subsquid docs](https://docs.subsquid.io/substrate-indexing/evm-support#access-the-contract-state){target=_blank}.

`contract.tokenURI`调用通过链RPC端点访问合约的**state**。这会稍微减慢索引的速度，但这是访问此数据的唯一方法。您可以在[此文档](https://docs.subsquid.io/substrate-indexing/evm-support#access-the-contract-state){target=_blank}找到获取状态的更多信息。

!!! note 注意事项
    This code expects to find a URL of a working Moonbeam RPC endpoint in the `RPC_ENDPOINT` environment variable. Set it in the `.env` file and in [Aquarium secrets](https://docs.subsquid.io/deploy-squid/env-variables){target=_blank} if and when you deploy your squid there. We tested the code using a public endpoint available at `wss://wss.api.moonbeam.network`; for production, we recommend using [private endpoints](/builders/get-started/endpoints#endpoint-providers){target=_blank}.

此代码期望在`RPC_ENDPOINT`环境变量中找到适用于Moonbeam RPC端点的URL。如果您准备将squid部署至Moonbeam时，您可以在`.env`文件和[Aquarium secrets](https://docs.subsquid.io/deploy-squid/env-variables){target=_blank}中设置。我们已经使用`wss://wss.api.moonbeam.network`提供的公共端点测试代码；如果您想用于生产环境，我们建议您使用[私有端点](/builders/get-started/endpoints#endpoint-providers){target=_blank}。

## Launch and Set Up the Database - 启动并设置数据库 {: #launch-database }

When running the project locally it is possible to use the `docker-compose.yml` file that comes with the template to launch a PostgreSQL container. To do so, run `sqd up` in your terminal.

当本地运行项目时，可以使用模板附带的`docker-compose.yml`文件启动PostgreSQL容器。为此，请在您的终端运行`sqd up`。

Squid projects automatically manage the database connection and schema via an [ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping){target=_blank}. In this approach the schema is managed through migration files. Because we made changes to the schema, we need to remove the existing migration(s) and create a new one, then apply the new migration.

Squid项目通过[ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping){target=_blank}自动管理数据库连接和schema。在此方式中，schema通过迁移文档进行管理。因为我们对schema进行了更改，所以我们需要删除现有的迁移并创建一个新的迁移，然后应用新的迁移。

This involves the following steps:

为此，请执行以下步骤：

1. Build the code:

    构建代码

    ```bash
    sqd build
    ```

2. Make sure you start with a clean Postgres database. The following commands drop-create a new Postgres instance in Docker:

    确保您从一个空白的Postgres数据库开始操作。以下命令将在Docker中删除创建一个新的Postgres实例：

    ```bash
    sqd down
    sqd up
    ```

3. Generate the new migration (this will wipe any old migrations):

    生成新的迁移（这将清除所有旧迁移）：

    ```bash
    sqd migration:generate
    ```

4. Apply the migration, so that the tables are created in the database:

    应用迁移，以便在数据库中创建表格

    ```bash
    sqd migration:apply
    ```

## Launch the Project - 启动项目 {: #launch-project }

To launch the processor run the following command (this will block the current terminal):

运行以下命令启动处理器（这将阻止当前的终端）：

```bash
sqd process
```

Finally, in a separate terminal window, launch the GraphQL server:

最后，在另一个终端窗口，启动GraphQL服务器：

```bash
sqd serve
```

Visit [`localhost:4350/graphql`](http://localhost:4350/graphql){target=_blank} to access the [GraphiQL](https://github.com/graphql/graphiql){target=_blank} console. From this window, you can perform queries such as this one, to find out the account owners with the biggest balances:

前往[`localhost:4350/graphql`](http://localhost:4350/graphql){target=_blank}来访问[GraphiQL](https://github.com/graphql/graphiql){target=_blank}控制台。在此窗口中，您可以执行类似这样的查询，找到拥有余额量最大的账户所有者：

```graphql
query MyQuery {
  owners(limit: 10, where: {}, orderBy: balance_DESC) {
    balance
    id
  }
}
```

Or this other one, looking up the tokens owned by a given owner:

或者找出给定所有者的Token持有数量：

```graphql
query MyQuery {
  tokens(where: {owner: {id_eq: "0x5274a86d39fd6db8e73d0ab6d7d5419c1bf593f8"}}) {
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

Have fun playing around with queries, after all, it's a _playground_!

您可以根据自己的需求，尝试各种查询。

## Publish the Project - 发布项目 {: #publish-the-project }

Subsquid offers a SaaS solution to host projects created by its community. All templates ship with a deployment manifest file named `squid.yml`, which can be used, in conjunction to the Squid CLI command `sqd deploy`.

Subsquid提供SaaS解决方案来管理由社区创建的项目。所有的模板都附带一个名为`squid.yml`的部署manifest文件，该文件可以与Squid CLI命令`sqd deploy`结合使用。

Please refer to the [Deploy your Squid section](https://docs.subsquid.io/deploy-squid/quickstart/){target=_blank} on Subquid's documentation site for more information.

请查阅Subquid文档网站的[部署Squid部分](https://docs.subsquid.io/deploy-squid/quickstart/){target=_blank}获取更多信息。

## Example Project Repository 示例项目代码库 {: #example-project-repository }

You can view the template used here, as well as many other example repositories [on Subsquid's examples organization on GitHub](https://github.com/orgs/subsquid-labs/repositories){target=_blank}.

您可以在[GitHub的Subsquid示例部分](https://github.com/orgs/subsquid-labs/repositories){target=_blank}查看本教程使用的模板，以及其他示例代码库。

[Subsquid's documentation](https://docs.subsquid.io/){target=_blank} contains informative material, and it's the best place to start, if you are curious about some aspects that were not fully explained in this guide.

如果您对本教程的解释存在疑问，请前往[Subsquid的文档网站](https://docs.subsquid.io/){target=_blank}获取更详细的内容。

--8<-- 'text/disclaimers/educational-tutorial.md'

--8<-- 'text/disclaimers/third-party-content.md'
