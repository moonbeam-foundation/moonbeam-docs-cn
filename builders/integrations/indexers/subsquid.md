---
title: 使用Subsquid检索Moonbeam数据
description: 学习如何在Moonbeam和Moonriver上使用Subsquid运行Substrate和EVM数据
---

# 在Moonbeam上使用Subsquid进行检索

## 概览 {: #introduction }

[Subsquid](https://subsquid.io){target=\_blank}是一个数据网络，通过Subsquid的分布式数据湖和开源软件开发工具包（SDK），用户能够快速高效地检索过百个区块链的数据。简单而言，Subsquid可以被当成一个包含GraphQL服务器的ETL（Extract-Transform-Load，数据提取、转换与加载）工具，提供全面的筛选、分页甚至是全文字搜索等服务。

Subsquid为以太坊虚拟机（EVM）和Substrate数据均提供原生的完整支持。由于Moonbeam是一个基于Substrate的EVM兼容的智能合约平台，Subsquid可用于索引EVM的和基于Substrate的数据。Subsquid提供了一个Substrate Archive和Processor，还有一个EVM Archive和Processor。 Substrate Archive和Processor可用于索引Substrate和EVM数据。这使得开发者在单个项目中可以从任何Moonbeam网络中提取链上数据并处理EVM记录和Substrate实体（事件、extrinsics和储存项），并利用单个GraphQL端点提供搜索结果的相关数据。如果你只想索引EVM数据，推荐使用EVM Archive和Processor。

本快速指南将向您展示如何使用Subsquid创建Substrate和EVM项目，并将其配置为可以在Moonbeam上索引数据。如果需要更完整的端到端教程，请查看[使用Subsquid索引本地Moonbeam开发节点](/tutorials/integrations/local-subsquid/){target=_blank}


--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 查看先决条件 {: #checking-prerequisites }

要顺利运行Squid项目，您需要安装以下软件：

- [Node.js](https://nodejs.org/en/download/){target=\_blank} 版本16及后续版本
- [Docker](https://docs.docker.com/get-docker/){target=\_blank}
- [Squid CLI](https://docs.subsquid.io/squid-cli/installation/){target=\_blank}

!!! 注意事项
    squid模板与`yarn`不兼容，因此您需要改用`npm`。

## 索引Moonbeam上的Substrate数据 {: #index-substrate-calls-events }

要开始索引Moonbeam上的Substrate数据，您需要创建一个Subsquid项目并按照以下步骤为Moonbeam配置它：

1. 通过运行以下命令创建基于Substrate模板的Subsquid项目：

    ```bash
    sqd init INSERT_SQUID_NAME --template substrate
    ```

    有关开始使用此模板的更多信息，请查看Subsquid文档网站上的[快速入门：Substrate链](https://docs.subsquid.io/quickstart/quickstart-substrate/){target=\_blank}指南。

2. 导航至Squid项目的根目录并运行以下命令安装依赖项：

    ```bash
    npm ci
    ```

3. 要配置您的Subsquid项目以在Moonbeam上运行，您需要更新`typegen.json`文件。`typegen.json`文件负责为您的数据生成TypeScript接口类。根据您在其上索引数据的网络，`typegen.json`文件中的`specVersions`值应配置如下：

    === "Moonbeam"

        ```json
        "specVersions": "https://v2.archive.subsquid.io/network/moonbeam-mainnet",
        ```

    === "Moonriver"

        ```json
        "specVersions": "https://v2.archive.subsquid.io/network/moonriver-mainnet",
        ```

    === "Moonbase Alpha"

        ```json
        "specVersions": "https://v2.archive.subsquid.io/network/moonbase-testnet",
        ```

4. 修改`src/processor.ts`文件，squid在该文件中实例化处理器、配置处理器并附加处理函数。处理器从[Archive](https://docs.subsquid.io/archives/overview/){target=\_blank}（一个专门的数据湖）中获取历史链上数据。您需要将处理器配置为从与您索引数据的[网络](https://docs.subsquid.io/substrate-indexing/supported-networks/){target=_blank}相对应的Archive（存档）中提取数据：

    === "Moonbeam"

        ```js
        const processor = new SubstrateBatchProcessor();
        processor.setDataSource({
          chain: '{{ networks.moonbeam.rpc_url }}',
          // Resolves to 'https://v2.archive.subsquid.io/network/moonbeam-mainnet'
          archive: lookupArchive('moonbeam', {type: 'Substrate', release: 'ArrowSquid'}),
        })
        ```

    === "Moonriver"

        ```js
        const processor = new SubstrateBatchProcessor();
        processor.setDataSource({
          chain: '{{ networks.moonriver.rpc_url }}',
          // Resolves to 'https://v2.archive.subsquid.io/network/moonriver-mainnet'
          archive: lookupArchive('moonriver', {type: 'Substrate', release: 'ArrowSquid'}),
        })
        });
        ```

    === "Moonbase Alpha"

        ```js
        const processor = new SubstrateBatchProcessor();
        processor.setDataSource({
          chain: '{{ networks.moonbase.rpc_url }}',
          // Resolves to 'https://v2.archive.subsquid.io/network/moonbase-testnet'
          archive: lookupArchive('moonbase', {type: 'Substrate', release: 'ArrowSquid'}),
        })
        });
        ```

    !!! note
        --8<-- 'text/_common/endpoint-setup.md'

5. 接下来我们还需要微调一下模板。Subsquid Substrate模板配置为处理Substrate账户类型，但 Moonbeam使用的是以太坊风格账户。`src/main.ts` 文件中的 `getTransferEvents` 函数迭代所有由 `processor.ts` 注入的事件，并将相关的 `transfer` 事件存储在数据库中。在 `getTransferEvents` 函数中，请移除 `from` 和 `to` 字段的ss58编码。在未修改的Substrate模板中，`from` 和 `to` 字段使用 ss58 编码如下所示：

    ```ts
    from: ss58.codec('kusama').encode(rec.from),
    to: ss58.codec('kusama').encode(rec.to),
    ```

    移除ss58编码后，相应的行如下：

    ```ts
    from: rec.from, 
    to: rec.to, 
    ```

这就是配置Subsquid项目以索引Moonbeam上的Substrate数据所需要做的全部工作！现在您可以更新`schema.graphql`、`typgen.json`和`src/processor.ts`文件来索引项目所需的数据！接下来，按照 [运行索引器](#run-your-indexer)部分中的步骤运行您的索引器并查询您的Squid。



## 索引Moonbeam上的以太坊数据 {: #index-ethereum-contracts }

要开始索引Moonbeam上的EVM数据，您需要创建一个Subsquid项目并按照以下步骤为Moonbeam配置它：

1. 您可以使用通用[EVM 模板](https://github.com/subsquid-labs/squid-evm-template){target=\_blank}为EVM数据创建Subsquid项目，也可以使用[ABI模板](https://github.com/subsquid-labs/squid-abi-template){target=\_blank}用于索引与特定合约相关的数据：

    === "EVM"

        ```bash
        sqd init INSERT_SQUID_NAME --template evm
        ```

    === "ABI"

        ```bash
        sqd init INSERT_SQUID_NAME --template abi
        ```

    有关开始使用这两个模板的更多信息，请查看以下Subsquid文档：

      - [快速入门：EVM链](https://docs.subsquid.io/quickstart/quickstart-ethereum/){target=\_blank}
      - [快速入门：从ABI生成](https://docs.subsquid.io/quickstart/quickstart-abi/){target=\_blank}

2. 导航到您的Squid项目的根目录并通过运行以下命令安装依赖项：

    ```bash
    npm ci
    ```

3. 修改`src/processor.ts`文件，squid在该文件中实例化处理器、配置处理器并附加处理函数。处理器从[Archive](https://docs.subsquid.io/archives/overview/){target=\_blank}（一个专门的数据湖）中获取历史链上数据。您需要将处理器配置为从与您索引数据的[网络](https://docs.subsquid.io/evm-indexing/supported-networks/){target=_blank}相对应的Archive（存档）中提取数据：

    === "Moonbeam"

        ```js
        const processor = new EvmBatchProcessor();
        processor.setDataSource({
          chain: '{{ networks.moonbeam.rpc_url }}',
          // Resolves to 'https://v2.archive.subsquid.io/network/moonbeam-mainnet'
          archive: lookupArchive('moonbeam', { type: 'EVM' })
        })
        ```

    === "Moonriver"

        ```js
        const processor = new EvmBatchProcessor();
        processor.setDataSource({
          chain: '{{ networks.moonriver.rpc_url }}',
          // Resolves to 'https://v2.archive.subsquid.io/network/moonriver-mainnet'
          archive: lookupArchive('moonriver', { type: 'EVM' }),
        })
        ```

    === "Moonbase Alpha"

        ```js
        const processor = new EvmBatchProcessor();
        processor.setDataSource({
          chain: '{{ networks.moonbase.rpc_url }}',
          // Resolves to 'https://v2.archive.subsquid.io/network/moonbase-testnet'
          archive: lookupArchive('moonbase', { type: 'EVM' }),
        })
        ```

    !!! note
        --8<-- 'text/_common/endpoint-setup.md'

这就是配置Subsquid项目以索引Moonbeam上的EVM数据所需要做的全部工作！现在您可以更新`schema.graphql`、`typgen.json`和`src/processor.ts`文件来索引项目所需的数据！接下来继续执行以下部分以运行您的索引器并查询您的Squid。

## 运行索引器 {: #run-your-indexer }

以下步骤适用于Substrate和EVM索引器。正确配置后，运行Subsquid索引器只需几个步骤:

1. 启动Postgres:

    ```bash
    sqd up
    ```

2. 检查并运行处理器：

    ```bash
    sqd process
    ```

3. 在同一目录中打开另一个终端窗口，然后启动 GraphQL 服务器：

    ```bash
    sqd serve
    ```

4. 您可以使用以下示例查询模板Substrate或EVM Squid。如果您修改了Squid模板以索引不同的数据，则需要相应地修改查询语句。

    === "Substrate索引器"

        ```graphql
        query MyQuery {
          accountsConnection(orderBy: id_ASC) {
            totalCount
          }
        }
        ```

    === "EVM索引器"

        ```graphql
        query MyQuery {
          burns(orderBy: value_DESC) {
            address
            block
            id
            txHash
            value
          }
        }
        ```

如果您对开始索引在Moonbeam上数据的分步教程感兴趣，可以查看[使用Subsquid索引在Moonbeam上的NFT代币转账](/tutorials/integrations/nft-subsquid){target=\_blank}教程！

--8<-- 'text/_disclaimers/third-party-content.md'
