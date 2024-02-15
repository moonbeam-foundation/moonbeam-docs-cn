---
title: 索引本地开发节点
description: 通过此教程了解如何使用Subsquid检索本地部署在Moonbeam开发节点上的dApp，提高您的dApp开发体验
---

# 使用Subsquid检索本地Moonbeam开发节点

_作者：Erin Shaben and Kevin Neilson_

## 概览 {: #introduction }

在开发dApp时，使用本地的开发环境而非如测试网或主网等实际运作的网络来开发智能合约是有益的。在本地进行开发，可以消除在实际网络开发时会遇到的一些麻烦，例如必须为开发账户提供资金和等待区块生成等等。在Moonbeam，开发者可以启动他们自己的本地[Moonbeam 开发节点](/builders/get-started/networks/moonbeam-dev){target=\_blank}以快速轻松地构建和测试应用。

但那些依赖检索器来检索区块链数据的dApp呢？这些应用的开发者该如何简化开发过程？[Subsquid](/builders/integrations/indexers/subsquid){target=\_blank} 是一个为Moonbeam等基于Substrate区块链开发的数据网络。它包含了超过100种区块链的数据，开发者现在也可以用它在本地开发环境（例如您的Moonbeam开发节点）上检索内容！

本教程将带您了解使用Subsquid在本地Moonbeam开发节点上检索数据的过程。我们将会创建一个ERC-20合约并使用Subsquid来检索我们的ERC-20的转账记录。

## 查看先决条件 {: #checking-prerequisites }

要跟随此教程，您需要具备以下条件：

- [完成安装Docker](https://docs.docker.com/get-docker/){target=\_blank}
- [完成安装Docker Compose](https://docs.docker.com/compose/install/){target=\_blank}
- 一个空白的Hardhat项目。关于详细的步骤指示，请查看我们Hardhat文档页面的[创建一个Hardhat项目](/builders/build/eth-api/dev-env/hardhat/#creating-a-hardhat-project){target=\_blank}部分
- 一个已在本地开发节点部署的[ERC-20 token](#deploy-an-erc-20-contract)，除非您打算检索Moonbase Alpha上已部署的ERC-20

在后面的教程中我们将会配置Hardhat项目和创建Subsquid项目。

## 创建一个本地开发节点 {: #spin-up-a-local-development-node }

首先，我们将使用Docker启动本地Moonbeam开发节点。出于本教程的教学目的，我们将配置我们的开发节点，使其以每四秒生成（密封）区块，这将简化调试过程。但是，您可以根据需求随意增加或减少这个时间，或者将您的节点配置为立即密封区块。使用即时密封设定时，区块链将在收到交易时创建一个区块。

在启动本地节点时，我们将会使用以下指令：

- `--dev` - 指定使用开发链
- `--sealing 4000` - 每四秒（4000毫秒）密封一个区块
- `--rpc-external` - 监听所有HTTP与WebSocket接口

要创建一个开发节点，您可以运行以下指令为Moonbeam提供最新的Docker映像：

=== "Ubuntu"

    ```bash
    docker run --rm --name {{ networks.development.container_name }} --network host \
    moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} \
    --dev --sealing 4000 --ws-external --rpc-external
    ```

=== "MacOS"

    ```bash
    docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 \
    moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} \
    --dev --sealing 4000 --ws-external --rpc-external
    ```

=== "Windows"

    ```bash
    docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 ^
    moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} ^
    --dev --sealing 4000 --ws-external --rpc-external
    ```

这些指令将会启动我们的开发节点，您可以使用9944端口。请注意Docker并不是必须的，您也可以[使用Moonbeam binary运行本地节点](/builders/get-started/networks/moonbeam-dev/#getting-started-with-the-binary-file){target=_blank}.

![Spin up a Moonbeam development node](/images/tutorials/integrations/local-subsquid/local-squid-1.webp)

我们的开发节点具有10个预先拥有资金的账户。

??? note "开发账户地址和私钥"
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/dev-accounts.md'

关于更多运行Moonbeam开发节点的信息，请查看[设置Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev){target=\_blank}的教程。

## 使用Hardhat部署ERC-20 {: #deploy-an-erc-20-with-hardhat }

你应该已经创建了一个空白的Hardhat项目，但如果你并没有创建Hardhat项目，你可以在我们的Hardhat文档页面查看[创建一个Hardhat项目](/builders/build/eth-api/dev-env/hardhat/#creating- a-hardhat-project){target=\_blank}的教程。

在本部分教程中，我们将为本地Moonbeam开发节点配置我们的Hardhat项目，创建ERC-20合约，并编写脚本以部署我们的合约并与之交互。

在开始创建项目之前，首先要安装一些需要的依赖项：[Hardhat Ethers插件](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-ethers){target=\_blank}和[OpenZeppelin合约](https://docs.openzeppelin.com/contracts/4.x/){target=\_blank}。Hardhat Ethers插件提供了一种使用[Ethers](/builders/build/eth-api/libraries/ethersjs){target=\_blank}库与网络交互的便捷方式。我们将使用OpenZeppelin的基础ERC-20实现来创建ERC-20。要安装这两个依赖项，您可以运行以下指令：

=== "npm"

    ```bash
    npm install @nomicfoundation/hardhat-ethers ethers@6 @openzeppelin/contracts
    ```

=== "yarn"

    ```bash
    yarn add @nomicfoundation/hardhat-ethers ethers@6 @openzeppelin/contracts
    ```

### 为一个本地开发节点配置Hardhat {: #create-a-hardhat-project }

在更新配置文件之前，我们需要获得其中一个开发帐户的私钥，该私钥将用于部署我们的合约和发送交易。在此例子中，我们将使用Alith的私钥：

```text
0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133
```

!!! 注意事项
    **请勿将私钥存储在JavaScript或Python文件中。**

    开发账户中通常包含私钥，且这些账户存在于您自己的开发环境。然而，当您持续为如Moonbase Alpha或Moonbeam（超出本教程的范围）等实时网络建立索引时，您需要通过指定的secret manager管理器或类似服务管理您的私钥。

现在我们可以编辑`hardhat.config.js`为我们的Moonbeam开发节点包含以下网络和帐户配置：

???+ code "hardhat.config.js"

    ```js
    --8<-- 'code/tutorials/integrations/local-subsquid/hardhat-config.js'
    ```

### 创建一个ERC-20合约 {: #create-an-erc-20-contract }

出于本教程目的，我们将创建一个简单的ERC-20合约。我们将依赖OpenZeppelin的ERC-20基础实现。我们将从为合约创建一个文件并将其命名为`MyTok.sol`开始：

```bash
mkdir -p contracts && touch contracts/MyTok.sol
```

现在我们可以编辑`MyTok.sol`文件并包含以下合约，它将生成MYTOK的初始供应数并仅允许合约所有者生成额外的Token：

???+ code "MyTok.sol"

    ```solidity
    --8<-- 'code/tutorials/integrations/local-subsquid/MyTok.sol'
    ```

### 部署一个ERC-20合约 {: #deploy-an-erc-20-contract }

现在我们已经成功设置我们的合约，我们能够编译和部署合约。

您可以运行以下指令编译合约：

```bash
npx hardhat compile
```

![Compile contracts using Hardhat](/images/tutorials/integrations/local-subsquid/local-squid-2.webp)

此指令将会编译合约并为其产生一个包含`artifacts`和合约ABI的目录。要部署合约，我们需要创建一个部署脚本来部署我们的ERC-20合约并生成MYTOK的初始供应。我们将使用Alith的账户来部署合约，并指定初始供应量为1000 MYTOK。MYTOK的初始供应将被铸造并发送给合约所有者，也就是Alith。

让我们跟随以下步骤来部署我们的合约：

1. 为我们的脚本创建一个目录的文件：

    ```bash
    mkdir -p scripts && touch scripts/deploy.js
    ```

2. 在`deploy.js`文件中添加以下脚本：

    ???+ code "deploy.js"

        ```js
        --8<-- 'code/tutorials/integrations/local-subsquid/deploy.js'
        ```

3. 使用我们在`hardhat.config.js`文件中设置的`dev`网络配置运行脚本：

    ```bash
    npx hardhat run scripts/deploy.js --network dev
    ```

部署合约的地址应当在终端出现，请保存该地址，我们将在后面的教程中用于合约交互。

![Deploy contracts using Hardhat](/images/tutorials/integrations/local-subsquid/local-squid-3.webp)

### 转移ERC-20 {: #transfer-erc-20s }

由于我们将检索ERC-20的`Transfer`事件，我们需要发送一些交易，将一些Token从Alith的账户转移到我们的其他测试账户。为此，我们将创建一个简单的脚本，将10个MYTOK转移给Baltathar、Charleth、Dorothy和Ethan。请跟随以下步骤：

1. 创建一个新的文件脚本以传送交易

    ```bash
    touch scripts/transactions.js
    ```

2. 在`transactions.js`文件中添加以下脚本并且加入您已经部署好的MyTok合约地址（上一步从控制台中获取）：

    ???+ code "transactions.js"

        ```js
        --8<-- 'code/tutorials/integrations/local-subsquid/transactions.js'
        ```

3. 运行脚本以传送交易：

    ```bash
    npx hardhat run scripts/transactions.js --network dev
    ```

当交易传送成功，您将会在终端中看到交易记录。

![Send transactions using Hardhat](/images/tutorials/integrations/local-subsquid/local-squid-4.webp)

现在我们可以创建Squid以在本地开发节点检索数据。

## 创建一个Subsquid项目 {: #create-subsquid-project }

现在我们将开始创建Subsquid项目。首先，我们需要安装[Subsquid CLI](https://docs.subsquid.io/squid-cli/){target=\_blank}：

```bash
npm i -g @subsquid/cli@latest
```

验证是否安装成功，运行：

```bash
sqd --version
```

现在我们将能够使用`sqd`指令与我们的Squid项目进行交互。要创建我们的项目，我们将使用`--template` (`-t`)标志，这将从模板创建一个项目。我们将使用EVM Squid模板，这是一个用于检索EVM链的入门项目。

您可以运行以下指令创建一个名为`local-squid`的EVM Squid项目：

```bash
sqd init local-squid --template evm
```

这将会创建一个拥有所有必要依赖项的Squid项目。您可以继续操作并安装所有依赖项：

```bash
cd local-squid && npm ci
```

现在我们已经完成我们项目的初始配置，我们需要配置我们的项目以从本地开发节点检索ERC-20`Transfer`事件。

### 设置ERC-20交易检索 {: #set-up-the-indexer-for-erc-20-transfer events}

为了检索ERC-20交易我们需要采取一系列行动：

1. 更新数据库架构并为数据生成模型。
2. 使用 `ERC20` 合约的ABI生成TypeScript接口类，供我们的数据采集器（Squid）索引 `Transfer` 事件。
3. 配置处理器以处理 `ERC20` 合约的 `Transfer` 事件。
4. 添加逻辑来处理 `Transfer` 事件并保存处理后的转账数据。

正如上面提到的，我们首先需要为转账数据定义数据库架构。为此，我们将编辑位于根目录下的 `schema.graphql` 文件，并创建 `Transfer` 和 `Account` 实体。您可以复制并粘贴以下架构，确保首先删除任何现有的架构。

???+ code "schema.graphql"

    ```graphql
    --8<-- 'code/tutorials/integrations/local-subsquid/schema.graphql'
    ```

现在，我们可以根据模式生成实体类，这些类将在处理转账数据时使用。我们在`src/model/generated` 目录中为每个实体创建一个新的类。

```bash
sqd codegen
```

下一步，我们将使用ERC-20 ABI自动生成TypeScript接口类。下面是一个通用的ERC-20标准ABI。请将其复制粘贴到项目根目录下 `abi` 文件夹内名为 `erc20.json` 的文件中。

??? code "ERC-20 ABI"

    ```json
    --8<-- 'code/tutorials/integrations/local-subsquid/erc20.json'
    ```

接下来，我们可以使用合约的ABI生成TypeScript接口类。 我们可以通过以下方式执行此操作：

```bash
sqd typegen
```
![Run sqd typegen](/images/tutorials/integrations/local-subsquid/local-squid-5.png)

这将在 `src/abi/erc20.ts` 文件中生成相关的TypeScript接口类。在本教程中，我们将专门访问 `events` 部分。

### 配置处理器 {: #configure-the-processor}

`processor.ts` 文件告诉Subsquid你想要采集的确切数据。数据格式转换将在后续步骤进行。在 `processor.ts` 文件中，我们需要指定数据源、合约地址、需要索引的事件以及区块范围。

打开 `src` 文件夹，找到 `processor.ts` 文件。

第一步，导入ERC-20 ABI，用于定义要索引的ERC-20数据：

```ts
import * as erc20 from './abi/erc20';
```
接下来告诉Subsquid我们想要关注的合约。使用以下代码创建一个常量来存储合约地址：

```ts
export const contractAddress = 'INSERT_CONTRACT_ADDRESS'.toLowerCase();
```

`.toLowerCase()` 很重要，因为Subsquid处理器对大小写敏感，一些区块浏览器会使用大写字母格式化合约地址。接下来你会看到一行 `export const processor = new EvmBatchProcessor()` , 接着是 `.setDataSource`。我们需要在这里做一些修改。Subsquid 为许多链（包括 Moonbeam、Moonriver 和 Moonbase Alpha）提供了[可用存档](https://docs.subsquid.io/evm-indexing/supported-networks/){target=_blank}，这些存档可以加快数据检索过程。对于索引本地开发节点，无需使用存档，唯一的数据源将是本地节点的 RPC URL。你可以将存档行注释掉或删除。修改后，你的代码应该类似于以下内容：

```ts
.setDataSource({
  chain: {
    url: assertNotNull('{{ networks.development.rpc_url }}'),
    rateLimit: 300,
  },
})
```

![Run Subsquid commands](/images/tutorials/integrations/local-subsquid/local-squid-6.webp)

Squid模板在你的 `.env` 文件中定义了一个RPC URL变量。你可以将其替换为本地开发节点的 RPC URL。如上所示，为了演示这里直接硬编码了本地开发节点的RPC URL。如果在 `.env` 文件中设置RPC URL，则相应的代码如下：

```text
RPC_ENDPOINT={{ networks.development.rpc_url }}
```

现在，让我们通过添加以下内容来定义我们要索引的事件：

```ts
.addLog({
  address: [contractAddress],
  topic0: [erc20.events.Transfer.topic],
  transaction: true,
})
```

`Transfer` 事件在 `erc20.ts` 中定义，该文件是在运行 `sqd typegen` 时自动生成的。`import * as erc20 from './abi/erc20'` 已经包含在Squid EVM模板中。

区块范围是一个重要的值，它可以用来缩小索引的区块范围。例如，如果你在Moonbeam上的 `1200000` 区块启用了你的ERC-20，那么就没有必要在该区块之前查询链上的 `Transfer` 事件。因为我们正在索引本地节点，所以可以排除这个字段或将其设置为0。设置准确的区块范围将提高你的索引器的效率。你可以按以下方式设置开始索引的最早区块：

```ts
.setBlockRange({
  from: 0, // Note the lack of quotes here
});
```

因为我们正在索引本地开发节点，这里选择的起始区块为0。但如果你在其他Moonbeam网络上索引数据，你应该将其更改为与你正在索引的数据相关的起始区块。

修改 `setFields` 部分，指定以下数据供我们的处理器读取：

```ts
.setFields({
  log: {
    topics: true,
    data: true,
  },
  transaction: {
    hash: true,
  },
})
```

完成上述步骤后，你的 processor.ts 文件应该类似于这样：

???+ code "processor.ts"

    ```ts
    --8<-- 'code/tutorials/integrations/local-subsquid/processor.ts'
    ```

### 转换并储存数据 {: #transform-and-save-the-data}

`processor.ts` 定义使用的数据，`main.ts` 定义大部分与处理和转换该数据相关的操作。简单来说，我们要进一步处理Subsquid处理器读取处理过的数据，并将所需的部分插入TypeORM数据库中。有关Subsquid如何工作的更多详细信息，请查看[Subsquid的开发Squid文档](https://docs.subsquid.io/basics/squid-development/){target=_blank}

我们的 `main.ts` 文件将扫描每个已处理区块中的 `Transfer` 事件，并解码转账细节，包括发送者、接收者和金额。脚本还将获取相关地址的账户详细信息，并使用提取的数据创建转账对象。然后，脚本将这些记录插入 TypeORM 数据库，使它们能够轻松查询。

让我们逐步分解构成 `main.ts` 的代码：

1. 在 `processor.run` 中，处理器将遍历所有选定的区块并查找 `Transfer` 事件日志。每当它发现一个 `Transfer` 事件，它都会将其存储在一个 `Transfer` 事件数组中等待进一步处理。
2. `TransferEvent` 接口是一种结构，它用来存储从事件日志中提取的数据。
3. `getTransfer` 是一个帮助函数，它用于从日志条目中提取和解码 ERC-20 `Transfer` 事件数据。它构建并返回一个 `TransferEvent` 对象，其中包含例如交易ID、区块号、发送者和接收者地址以及转账金额等详细信息。`getTransfer` 会在存储 `Transfer` 事件到数组时被调用 
4. `processTransfers` 用来补充转账数据，然后使用 `ctx.store` 方法将这些记录插入TypeORM数据库。虽不是绝对需要，但account模型允许我们在其架构中引入另一个实体，以演示如何在Squid中使用多个实体。
5. `getAccount` 是一个管理检索和创建account对象的帮助函数。根据一个账户ID和一个现有账户的映射，它将返回相应的账户对象。如果账户不在映射中，它会创建一个新的账户，并将其添加到映射中，然后返回它。

在稍后的部分我们将演示示例查询。您可以将以下代码复制粘贴到您的 `main.ts` 文件中：

???+ code "main.ts"

    ```ts
    --8<-- 'code/tutorials/integrations/local-subsquid/main.ts'
    ```

现在我们已经完成了所有必要的步骤，可以运行我们的索引器了！

### 运行检索器 {: #run-indexer }

要运行检索器，我们需要运行以下一系列的`sqd`指令：

1. 创建项目：

    ```bash
    sqd build
    ```

2. 启动数据库：

    ```bash
    sqd up
    ```

3. 按顺序运行以下两个命令：

    ```bash
    sqd migration:generate
    sqd migration:apply
    ```

4. 启动检索器：

    ```bash
    sqd process
    ```

!!! 注意事项
    您可以查看`commands.json`文件了解`sqd`指令执行了什么内容。

在终端中，您应当能看见检索器在处理区块！

![Run sqd process](/images/tutorials/integrations/local-subsquid/local-squid-6.png)

如果您的Squid没有正确地检索区块，请确保您的开发节点正在使用`--sealing`标志运行。以本教程例子来说，你应该将标志设置为`--sealing 4000`，这样每四秒就会产生一个区块。您也可以根据需要随意编辑时间间隔。在您尝试再次启动您的Squid之前，请运行以下指令来重新启动Squid：

1. 关闭您的Squid：

    ```bash
    sqd down
    ```

2. 重新启动您的Squid：

```bash
sqd archive-down && sqd down
```

接着您可以启动本地Archive和备用Squid：

```bash
sqd archive-up && sqd up
```

最后您将能够重新继续检索：

```bash
sqd process
```

现在您的检索器将开始检索您的开发节点！

## 查询您的Squid {: #query-your-squid }

要查询你的Squid，请在项目中打开一个新的终端窗口并运行以下命令：

```bash
sqd serve
```

就这么简单！现在你可以在 [http://localhost:4350/graphql](http://localhost:4350/graphql){target=_blank} 的GraphQL沙盒对你的Squid运行查询语句。您可以尝试创建您自己的GraphQL 语句，或使用以下查询语句：

???+ code "Sample query"

    ```ts
    --8<-- 'code/tutorials/integrations/local-subsquid/sample-query.graphql'
    ```

![Running queries in GraphQL playground](/images/tutorials/integrations/local-subsquid/local-squid-7.png)

这将返回所有的转账数据，包括转账至Alith账户的初始交易，以及Alith发送给Baltathar、Charleth、Dorothy和Ethan的转账。

就是这样！你已成功使用Subsquid在本地Moonbeam开发节点上索引数据！你可以在[GitHub](https://github.com/eshaben/local-squid-demo){target=_blank}上查看整个项目。

## 调试您的Squid {: #debug-your-squid }

在构建Squid时调试错误乍一看似乎很棘手，但幸运的是，有一些技术能够帮助您来简化这个过程。首先，如果您在遇到Squid错误，您应该通过取消注释 `.env` 文件中的调试模式行来启用调试模式。这将触发更详细的日志记录，并帮助您找到错误源。

```text
# Uncommenting the below line enables debug mode
SQD_DEBUG=*
```

您也可以直接向 `main.ts` 文件添加logging statement，以显示特定参数，例如区块高度等。例如，请参照以下增强版 `main.ts` ，其中包含详细日志记录 ：

??? code "main.ts"

    ```ts
    --8<-- 'code/tutorials/integrations/local-subsquid/main-with-logging.ts'
    ```

有关调试模式的更多信息，请参见 [Subsquid 调试指南](https://docs.subsquid.io/basics/logging/){target=_blank}。

### 常见错误 {: #common-errors }

下面是一些您在构建项目时可能遇到的常见错误以及如何解决。

```text
FATAL sqd:processor RpcError: Expect block number from id: BlockId::Number(15316)
```

此错误表明您的索引器正在尝试处理本地节点上不存在的块。您可以通过在处理器中设置合理的 `to` 区块上限来解决此问题，如下所示：

```ts
.setBlockRange({from: 0, to: 100})
```

当您在计算机上尝试使用多个Subsquid实例时，可能会出现另一个常见错误。

```text
Error response from daemon: driver failed programming external connectivity on endpoint my-awesome-squid-db-1
(49df671a7b0531abbb5dc5d2a4a3f5dc7e7505af89bf0ad1e5480bd1cdc61052):
Bind for 0.0.0.0:23798 failed: port is already allocated
```

此错误表明您在其他地方运行了另一个Subsquid实例。您可以使用命令 `sqd down` 或单击 Docker Desktop容器边上的**Stop**按钮优雅地停止它。

```text
Error: connect ECONNREFUSED 127.0.0.1:23798
     at createConnectionError (node:net:1634:14)
     at afterConnectMultiple (node:net:1664:40) {
     errno: -61,code: 'ECONNREFUSED',syscall: 'connect',
     address: '127.0.0.1',port: 23798}]}
```

要解决此问题，请在运行 `sqd migration:generate` 之前运行 `sqd up`。

如果您的Squid没有显示任何错误，但是无法检测到任何转账。请确保您的日志事件与您的处理器寻找的事件一致且相同。合约地址也必须是小写，您可以通过以下方式定义它来确保这一点：

```text
export const contractAddress = '0x37822de108AFFdd5cDCFDaAa2E32756Da284DB85'.toLowerCase();
```

--8<-- 'text/_disclaimers/educational-tutorial.md'

--8<-- 'text/_disclaimers/third-party-content.md'