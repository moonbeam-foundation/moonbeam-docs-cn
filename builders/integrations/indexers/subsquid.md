---
title: 使用Subsquid检索Moonbeam数据
description: 学习如何在Moonbeam和Moonriver上使用Subsquid运行Substrate和EVM数据
---

# 在Moonbeam上使用Subsquid进行检索

## 概览 {: #introduction }

[Subsquid](https://subsquid.io){target=\_blank}是一个数据网络，通过Subsquid的分布式数据湖和开源软件开发工具包（SDK），用户能够快速高效地检索过百个区块链的数据。简单而言，Subsquid可以被当成一个包含GraphQL服务器的ETL（Extract-Transform-Load，数据提取、转换与加载）工具，提供全面的筛选、分页甚至是全文字搜索等服务。

Subsquid为以太坊虚拟机（EVM）和Substrate数据均提供原生的完整支持。由于Moonbeam是一个基于Substrate的EVM兼容的智能合约平台，Subsquid可用于索引EVM的和基于Substrate的数据。Subsquid提供了一个Substrate Archive和Processor，还有一个EVM Archive和Processor。 Substrate Archive和Processor可用于索引Substrate和EVM数据。这使得开发者在单个项目中可以从任何Moonbeam网络中提取链上数据并处理EVM记录和Substrate实体（事件、extrinsics和储存项），并利用单个GraphQL端点提供搜索结果的相关数据。如果你只想索引EVM数据，推荐使用EVM Archive和Processor。

本指南将向您展示如何使用Subsquid创建Substrate和EVM项目，并将其配置为可以在Moonbeam上索引数据。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 查看先决条件 {: #checking-prerequisites }

要顺利运行Squid项目，您需要安装以下软件：

- [Node.js](https://nodejs.org/en/download/){target=\_blank} 版本16及后续版本
- [Docker](https://docs.docker.com/get-docker/){target=\_blank}
- [Squid CLI](https://docs.subsquid.io/squid-cli/installation/){target=\_blank} 版本2.1.0及后续版本

!!! 注意事项
    squid模板与`yarn`不兼容，因此您需要改用`npm`。

## 索引Moonbeam上的Substrate数据 {: #index-substrate-calls-events }

要开始索引Moonbeam上的Substrate数据，您需要创建一个Subsquid项目并按照以下步骤为Moonbeam配置它：

1. 通过运行以下命令创建基于Substrate模板的Subsquid项目：

    ```bash
    sqd init INSERT_SQUID_NAME --template substrate
    ```

    有关开始使用此模板的更多信息，请查看Subsquid文档网站上的[快速入门：Substrate链](https://docs.subsquid.io/quickstart/quickstart-substrate/){target=\_blank}指南。

2. 要配置您的Subsquid项目以在Moonbeam上运行，您需要更新`typegen.json`文件。`typegen.json`文件负责为您的数据生成TypeScript接口类。根据您在其上索引数据的网络，`typegen.json`文件中的`specVersions`值应配置如下：

    === "Moonbeam"

        ```json
        "specVersions": "https://moonbeam.archive.subsquid.io/graphql",
        ```

    === "Moonriver"

        ```json
        "specVersions": "https://moonriver.archive.subsquid.io/graphql",
        ```

    === "Moonbase Alpha"

        ```json
        "specVersions": "https://moonbase.archive.subsquid.io/graphql",
        ```

3. 修改`src/processor.ts`文件，squid在该文件中实例化处理器、配置处理器并附加处理函数。处理器从[Archive](https://docs.subsquid.io/glossary/#archives/){target=\_blank}（一个专门的数据湖）中获取历史链上数据。您需要将处理器配置为从与您索引数据的网络相对应的Archive（存档）中提取数据：

    === "Moonbeam"

        ```js
        const processor = new SubstrateBatchProcessor();
        processor.setDataSource({
          chain: '{{ networks.moonbeam.rpc_url }}',
          // Resolves to 'https://moonbeam.archive.subsquid.io'
          archive: lookupArchive('moonbeam', { type: 'Substrate' }),
        });
        ```

    === "Moonriver"

        ```js
        const processor = new SubstrateBatchProcessor();
        processor.setDataSource({
          chain: '{{ networks.moonriver.rpc_url }}',
          // Resolves to 'https://moonriver.archive.subsquid.io'
          archive: lookupArchive('moonriver', { type: 'Substrate' }),
        });
        ```

    === "Moonbase Alpha"

        ```js
        const processor = new SubstrateBatchProcessor();
        processor.setDataSource({
          chain: '{{ networks.moonbase.rpc_url }}',
          // Resolves to 'https://moonbase.archive.subsquid.io'
          archive: lookupArchive('moonbase', { type: 'Substrate' }),
        });
        ```

这就是配置Subsquid项目以索引Moonbeam上的Substrate数据所需要做的全部工作！现在您可以更新`schema.graphql`、`typgen.json`和`src/processor.ts`文件来索引项目所需的数据！

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

2. 要配置您的Subsquid项目以在Moonbeam上运行，您需要更新`typegen.json`文件。`typegen.json`文件负责为您的数据生成TypeScript接口类。根据您在其上索引数据的网络，`typegen.json`文件中的`specVersions`值应配置如下：

    === "Moonbeam"

        ```json
        "specVersions": "https://moonbeam.archive.subsquid.io/graphql",
        ```

    === "Moonriver"

        ```json
        "specVersions": "https://moonriver.archive.subsquid.io/graphql",
        ```

    === "Moonbase Alpha"

        ```json
        "specVersions": "https://moonbase.archive.subsquid.io/graphql",
        ```

3. 修改`src/processor.ts`文件，squid在该文件中实例化处理器、配置处理器并附加处理函数。处理器从[Archive](https://docs.subsquid.io/glossary/#archives/){target=\_blank}（一个专门的数据湖）中获取历史链上数据。您需要将处理器配置为从与您索引数据的网络相对应的Archive（存档）中提取数据：

    === "Moonbeam"

        ```js
        const processor = new EvmBatchProcessor();
        processor.setDataSource({
          chain: '{{ networks.moonbeam.rpc_url }}',
          // Resolves to 'https://moonbeam-evm.archive.subsquid.io'
          archive: lookupArchive('moonbeam', { type: 'EVM' })
        });
        ```

    === "Moonriver"

        ```js
        const processor = new EvmBatchProcessor();
        processor.setDataSource({
          chain: '{{ networks.moonriver.rpc_url }}',
          // Resolves to 'https://moonriver-evm.archive.subsquid.io'
          archive: lookupArchive('moonriver', { type: 'EVM' }),
        });
        ```

    === "Moonbase Alpha"

        ```js
        const processor = new EvmBatchProcessor();
        processor.setDataSource({
          chain: '{{ networks.moonbase.rpc_url }}',
          // Resolves to 'https://moonbase-evm.archive.subsquid.io'
          archive: lookupArchive('moonbase', { type: 'EVM' }),
        });
        ```

这就是配置Subsquid项目以索引Moonbeam上的EVM数据所需要做的全部工作！现在您可以更新`schema.graphql`、`typgen.json`和`src/processor.ts`文件来索引项目所需的数据！

如果您对开始索引在Moonbeam上数据的分步教程感兴趣，可以查看[使用Subsquid索引在Moonbeam上的NFT代币转账](/tutorials/integrations/nft-subsquid){target=\_blank}教程！

--8<-- 'text/_disclaimers/third-party-content.md'
