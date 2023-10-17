---
title: 使用Subsquid索引NFT转账
description: 学习如何使用Subsquid（基于Substrate链的查询节点框架）索引和处理Moonbeam和Moonriver的NFT转移数据。
---

# 使用Subsquid索引在Moonbeam上的NFT转账

_作者：Massimo Luraschi_

## 概览 {: #introduction }

[Subsquid](https://subsquid.io){target=_blank}是一个全栈区块链索引SDK，其具有专门的数据湖（Archives），对大量历史链上数据的提取进行了优化。

SDK提供高度可自定义的Extract-Transform-Load-Query栈，索引事件和交易时其索引速度高达每秒超过50,000区块以上。

Subsquid拥有原生和全面的以太坊虚拟机数据和Substrate数据支持。这允许开发者从任何Moonbeam网络提取链上数据，在单个项目中处理EVM日志和Substrate entities（事件、extrinsics和存储项），并使用单个GraphQL端点提供结果数据。通过Subsquid，可以根据EVM主题、智能合约地址和区块范围进行筛选。

本教程将介绍如何从在Moonriver上索引Moonsama转账的模板中创建Subsquid项目（也称为*"squid"*），并将其改为在Moonbeam网络上索引ERC-721 Token转账。这样一来，您将查看`Transfer` EVM事件主题。本教程也同样适用于Moonbase Alpha。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 查看先决条件 {: #checking-prerequisites }

要使Squid项目能够运行，您需要提前准备以下内容：

- 熟悉Git
- [Node.js](https://nodejs.org/en/download/){target=_blank} v16及以上版本
- [Docker](https://docs.docker.com/get-docker/){target=_blank}
- [Squid CLI](https://docs.subsquid.io/squid-cli/installation){target=_blank}

!!! 注意事项
    此教程使用`commands.json`中定义的自定义脚本。此脚本会自动作为`sqd`子命令进行获取。

## 从模板中搭建一个项目 {: #scaffolding-using-sqd-init }

我们将从[`sqd init`](https://docs.subsquid.io/squid-cli/){target=_blank}使用[`frontier-evm` squid模板](https://github.com/subsquid-labs/squid-frontier-evm-template/){target=_blank}开始创建。其旨在索引Moonriver上部署的EVM智能合约，但是它也同样可以索引Substrate事件。要检索模板并安装依赖项，请运行以下命令：

```bash
sqd init moonbeam-tutorial --template frontier-evm
cd moonbeam-tutorial
npm ci
```

## 定义Entity Schema  {: #define-entity-schema }

接下来，我们要确保squid的数据[schema](https://docs.subsquid.io/basics/schema-file/){target=_blank}定义了我们想要追踪的[entities](https://docs.subsquid.io/basics/schema-file/entities/){target=_blank}，具体如下：

* Token转帐
* Token所有权
* 合约及其铸造的Token

幸运的是，EVM模板已经包含了一个schema文件，其定义了我们所需的entities：

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

此[schema定义](https://docs.subsquid.io/basics/schema-file/){target=_blank}中需要注意以下几个部分：

* **`@entity`** - 表明此类型将被转换为持久保存在数据库中的ORM模型
* **`@derivedFrom`** - 表示该字段不会保留在数据库中。而是[派生自](https://docs.subsquid.io/basics/schema-file/entity-relations/){target=_blank}entity关系
* **type references** (e.g. `from: Owner`) - 当用于entity类型时，他们建立了两个entity之间的关系

当schema更改时，都必须重新生成TypeScript entity类，我们可以使用`squid-typeorm-codegen`工具来实现。预先打包的`commands.json`已经包含`codegen`快捷方式，因此我们可以使用`sqd`来调用它：

```bash
sqd codegen
```

（重新）生成的entity类可以在`src/model/generated`中找到。

## ABI定义和Wrapper {: #abi-definition }

Subsquid维护[工具](https://docs.subsquid.io/substrate-indexing/squid-substrate-typegen/){target=_blank}，用于自动生成TypeScript类，以处理Substrate数据源（事件、extrinsics、存储项）。Runtime升级已考虑在内，并会自动检测。

类似的功能可以通过[`squid-evm-typegen`](https://docs.subsquid.io/evm-indexing/squid-evm-typegen/){target=_blank}用于EVM索引。它将根据合约的[JSON ABI](https://docs.ethers.org/v5/api/utils/abi/){target=_blank}生成TypeScript模块，用于处理EVM日志和交易。

对于我们的squid，我们将需要一个用于满足合约接口的兼容[ERC-721](https://eips.ethereum.org/EIPS/eip-721){target=_blank}部分的模块。再次提醒，此模板的代码库已将其包含在里面，但是解释索引不同类型合约时需要完成的事项仍然很重要。

该过程使用模板中的`sqd`脚本，该脚本使用`squid-evm-typegen`为存储在`abi`文件夹中的JSON ABI生成Typescript facades。放入连接合约所需的任何ABI并运行以下命令：

```bash
sqd typegen
```

结果将存储在`src/abi`中。每个ABI文件将生成一个模块，此模块会包含用于筛选的常量和用于解码ABI中定义的EVM事件和函数的函数。

## 定义和绑定事件处理器 {: #define-event-handlers }

Subsquid SDK为用户提供[`SubstrateBatchProcessor`类](https://docs.subsquid.io/substrate-indexing/){target=_blank}。其实例连接指定区块链的[Subsquid archives](https://docs.subsquid.io/archives/overview/){target=_blank}以访问链数据并进行自定义转换。索引从起始区块开始，并在达到最高值之后与最新区块保持一致。

`SubstrateBatchProcessor`[公开函数](https://docs.subsquid.io/substrate-indexing/configuration/){target=_blank}以“订阅”指定数据，包括Substrate事件、extrinsics、存储项、或者EVM的日志和交易。然后，通过调用`.run()`函数开始实际数据处理。这将开始为配置中指定数据的[*batches*](https://docs.subsquid.io/basics/batch-processing/){target=_blank}生成对Archive的请求，并在每次由Archive返回一个batch时触发回调函数或*batch handler*（作为第二个参数传递给`.run()`）。

回调函数表达了所有的映射逻辑。这是应该实现链数据解码的地方，也是应该编写将处理后数据保存在数据库中的代码的地方。

### 管理EVM合约 {: #managing-the-evm-contract }

在开始定义squid的映射逻辑之前，我们要先重写`src/contracts.ts`实用程序模块以管理涉及的EVM合约。这将导出：

* [Gromlins](https://moonscan.io/token/0xf27a6c72398eb7e25543d19fda370b7083474735){target=_blank}合约的地址
* 一个创建和保存`Contract` entity实例至数据库的函数
* 一个返回`Contract`实例（已经存在或新创建的entity）的函数。第一次调用该函数时，它会验证`Contract`是否已经存在，反之，它将调用第一个函数，并缓存结果，因此在后续调用中将会返回缓存版本

以下是完整的文件内容：

```typescript
--8<-- 'code/tutorials/integrations/nft-subsquid/contract.ts'
```

你可能会收到`Context`变量未导出的警告，但是无需担心，我们将从在下一部分中从`src/processor.ts`文件导出。

!!! 注意事项
    `createContractEntity`函数通过链的RPC端点访问合约的**state**。这会稍微减慢索引的速度，但这是访问此数据的唯一方法。您可以在[此文档](https://docs.subsquid.io/substrate-indexing/evm-support#access-the-contract-state){target=_blank}找到获取状态的更多信息。

## 配置处理器（Processor）并附加处理程序（Handler） {: #configure-processor }

`src/processor.ts`文件是squid实例化处理器（本示例中为`SubstrateBatchProcessor`）、配置它并添加处理函数的地方。

此处只需要调整模板代码以处理Gromlins合约并将处理器设置为使用从[archive registry](https://github.com/subsquid/archive-registry){target=_blank}中检索到的`moonbeam` archive URL。

--8<-- 'text/_common/endpoint-examples.md'

此教程也同样适用于Moonriver或Moonbase Alpha，但请确保将数据源更新为正确的网络：

=== "Moonbeam"

    ```js
    processor.setDataSource({
      chain: process.env.RPC_ENDPOINT, // TODO: Add the endpoint to your .env file
      archive: lookupArchive('moonbeam', { type: 'Substrate' }),
    });
    ```

=== "Moonriver"

    ```js
    processor.setDataSource({
      chain: process.env.RPC_ENDPOINT, // TODO: Add the endpoint to your .env file
      archive: lookupArchive('moonriver', { type: 'Substrate' }),
    });
    ```

=== "Moonbase Alpha"

    ```js
    processor.setDataSource({
      chain: process.env.RPC_ENDPOINT, // TODO: Add the endpoint to your .env file
      archive: lookupArchive('moonbase', { type: 'Substrate' }),
    });
    ```

!!! 注意事项
    `lookupArchive`函数用于查询[archive registry](https://github.com/subsquid/archive-registry){target=_blank}并在给定网络名称的情况下生成archive地址。注意网络名称需为小写。

您也需要修改`Context`类型，使其可以导出并用于`src/contract.ts`文件中。

```ts
export type Context = BatchContext<Store, Item>;
```

以下是最终结果：

```typescript
--8<-- 'code/tutorials/integrations/nft-subsquid/processor.ts'
```

!!! 注意事项
    `contract.tokenURI`调用通过链RPC端点访问合约的**state**。这会稍微减慢索引的速度，但这是访问此数据的唯一方法。您可以在[此文档](https://docs.subsquid.io/substrate-indexing/evm-support#access-the-contract-state){target=_blank}找到获取状态的更多信息。

!!! 注意事项
    此代码期望在`RPC_ENDPOINT`环境变量中找到适用于Moonbeam RPC端点的URL。如果您准备将squid部署至Moonbeam时，您可以在`.env`文件和[Aquarium secrets](https://docs.subsquid.io/deploy-squid/env-variables){target=_blank}中设置。我们已经使用`wss://wss.api.moonbeam.network`公共端点测试了代码；如果您想用于生产环境，我们建议您使用[私有端点](/builders/get-started/endpoints#endpoint-providers){target=_blank}。

## 启动并设置数据库 {: #launch-database }

当本地运行项目时，可以使用模板附带的`docker-compose.yml`文件启动PostgreSQL容器。为此，请在您的终端运行`sqd up`。

Squid项目通过[ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping){target=_blank}自动管理数据库连接和schema。在此方式中，schema通过迁移文档进行管理。因为我们对schema进行了更改，所以我们需要删除现有的迁移并创建一个新的迁移，然后应用新的迁移。

为此，请执行以下步骤：

1. 构建代码：

    ```bash
    sqd build
    ```

2. 确保您从一个空白的Postgres数据库开始操作。以下命令将在Docker中删除创建一个新的Postgres实例：

    ```bash
    sqd down
    sqd up
    ```

3. 生成新的迁移（这将清除所有旧迁移）：

    ```bash
    sqd migration:generate
    ```

4. 应用迁移，以便在数据库中创建表格：

    ```bash
    sqd migration:apply
    ```

## 启动项目 {: #launch-project }

运行以下命令启动处理器（这将阻挡当前的终端）：

```bash
sqd process
```

最后，在另一个终端窗口，启动GraphQL服务器：

```bash
sqd serve
```

前往[`localhost:4350/graphql`](http://localhost:4350/graphql){target=_blank}来访问[GraphiQL](https://github.com/graphql/graphiql){target=_blank}控制台。在此窗口中，您可以执行类似这样的查询，找到拥有余额量最大的账户所有者：

```graphql
query MyQuery {
  owners(limit: 10, where: {}, orderBy: balance_DESC) {
    balance
    id
  }
}
```

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

您可以根据自己的需求，尝试各种查询。

## 发布项目 {: #publish-the-project }

Subsquid提供SaaS解决方案来管理由社区创建的项目。所有的模板都附带一个名为`squid.yml`的部署manifest文件，该文件可以与Squid CLI命令`sqd deploy`结合使用。

请查阅Subquid文档网站的[部署Squid部分](https://docs.subsquid.io/deploy-squid/quickstart/){target=_blank}获取更多信息。

## 示例项目代码库 {: #example-project-repository }

您可以在[GitHub的Subsquid示例部分](https://github.com/orgs/subsquid-labs/repositories){target=_blank}查看本教程使用的模板，以及其他示例代码库。

如果您对本教程中未完整解释的某些方面感到好奇，请前往[Subsquid的文档网站](https://docs.subsquid.io/){target=_blank}获取更详细的内容。

--8<-- 'text/_disclaimers/educational-tutorial.md'

--8<-- 'text/_disclaimers/third-party-content.md'
