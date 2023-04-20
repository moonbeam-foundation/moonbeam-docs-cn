---
title: 使用Subsquid检索Moonbeam数据
description: 学习如何在Moonbeam和Moonriver上使用Subsquid运行Substrate和EVM数据
---

# 在Moonbeam上使用Subsquid进行检索

![Subsquid Banner](/images/builders/integrations/indexers/subsquid/subsquid-banner.png)

## 概览 {: #introduction }

[Subsquid](https://subsquid.io){target=_blank} is a query node framework for Substrate-based blockchains. In very simple terms, Subsquid can be thought of as an ETL (extract, transform, and load) tool with a GraphQL server included. It enables comprehensive filtering, pagination, and even full-text search capabilities.

[Subsquid](https://subsquid.io){target=_blank}为基于Substrate区块链所使用的检索节点框架。简单而言，Subsquid可以被当成一个包含GraphQL服务器的ETL（提取、转换和加载）工具，提供全面的筛选、分页甚至是全文字搜索等服务。

Subsquid has native and full support for both Ethereum Virtual Machine (EVM) and Substrate data. Since Moonbeam is a Substrate-based smart contact platform that is EVM-compatible, Subsquid can be used to index both EVM and Substrate-based data. Subsquid offers a Substrate Archive and Processor and an EVM Archive and Processor. The Substrate Archive and Processor can be used to index both Substrate and EVM data. This allows developers to extract on-chain data from any of the Moonbeam networks and process EVM logs as well as Substrate entities (events, extrinsics, and storage items) in one single project and serve the resulting data with one single GraphQL endpoint. If you exclusively want to index EVM data, it is recommended to use the EVM Archive and Processor.

Subsquid具有来自以太坊虚拟机（EVM）和Substrate数据的原生完整支持，允许开发者在任何Moonbeam网络中的任何项目提取链上数据并运行EVM记录和Substrate实体（事件、extrinsics和储存项），并利用单一个GraphQL端点提供搜索结果的相关数据。通过Subsquid，开发者既能够根据EVM主题、合约地址以及区块编号进行筛选。

This guide will show you how to create Substrate and EVM projects with Subsquid and configure it to index data on Moonbeam. 

本教程将会包含如何在Moonriver网络上创建一个Subsquid项目（也就是*“Squid"*）检索ERC-721 Token的转移记录。因此，您将会专注于`Transfer` EVM事件主题中。此教程也同样适用于Moonbeam或Moonbase Alpha。

--8<-- 'text/disclaimers/third-party-content-intro.md'

## 查看先决条件 {: #checking-prerequisites }

To get started with Subsquid, you'll need to have the following:

要顺利运行Squid项目，您需要安装以下软件：

- [Node.js](https://nodejs.org/en/download/){target=_blank} 版本16及后续版本
- [Docker](https://docs.docker.com/get-docker/){target=_blank}
- [Squid CLI](https://docs.subsquid.io/squid-cli/installation/){target=_blank} 版本2.1.0及后续版本

!!! note
    The squid template is not compatible with `yarn`, so you'll need to use `npm` instead.

## Index Substrate Data on Moonbeam {: #index-substrate-calls-events }

To get started indexing Substrate data on Moonbeam, you'll need to create a Subsquid project and configure it for Moonbeam by taking the following steps:

1. Create a Subsquid project based on the Substrate template by running:

    ```
    sqd init <insert-squid-name> --template substrate
    ```

    For more information on getting started with this template, please check out the [Quickstart: Substrate chains](https://docs.subsquid.io/quickstart/quickstart-substrate/){target=_blank} guide on Subsquid's documentation site.

2. To configure your Subsquid project to run on Moonbeam, you'll need to update the `typegen.json` file. The `typegen.json` file is responsible for generating TypeScript interface classes for your data. Depending on the network you're indexing data on, the `specVersions` value in the `typegen.json` file should be configured as follows:

    === "Moonbeam"
        ```
        "specVersions": "https://moonbeam.archive.subsquid.io/graphql",
        ```

    === "Moonriver"
        ```
        "specVersions": "https://moonriver.archive.subsquid.io/graphql",
        ```

    === "Moonbase Alpha"
        ```
        "specVersions": "https://moonbase.archive.subsquid.io/graphql",
        ```

3. Modify the `src/processor.ts` file, which is where squids instantiate the processor, configure it, and attach handler functions. The processor fetches historical on-chain data from an [Archive](https://docs.subsquid.io/archives/overview/){target=_blank}, which is a specialized data lake. You'll need to configure your processor to pull data from the Archive that corresponds to the network you are indexing data on:

    === "Moonbeam"
        ```
        const processor = new SubstrateBatchProcessor();
        processor.setDataSource({
          chain: {{ networks.moonbeam.rpc_url }},
          // Resolves to "https://moonbeam.archive.subsquid.io"
          archive: lookupArchive("moonbeam", { type: "Substrate" }),
        });
        ```

    === "Moonriver"
        ```
        const processor = new SubstrateBatchProcessor();
        processor.setDataSource({
          chain: {{ networks.moonriver.rpc_url }},
          // Resolves to "https://moonriver.archive.subsquid.io"
          archive: lookupArchive("moonriver", { type: "Substrate" }),
        });
        ```

    === "Moonbase Alpha"
        ```
        const processor = new SubstrateBatchProcessor();
        processor.setDataSource({
          chain: {{ networks.moonbase.rpc_url }},
          // Resolves to "https://moonbase.archive.subsquid.io"
          archive: lookupArchive("moonbase", { type: "Substrate" }),
        });
        ```

And that's all you have to do to configure your Subsquid project to index Substrate data on Moonbeam! Now you can update the `schema.graphql`, `typgen.json`, and `src/processor.ts` files to index the data you need for your project!

## Index Ethereum Data on Moonbeam {: #index-ethereum-contracts }

To get started indexing EVM data on Moonbeam, you'll need to create a Subsquid project and configure it for Moonbeam by taking the following steps:

1. You can create a Subsquid project for EVM data by using the generic [EVM template](https://github.com/subsquid-labs/squid-evm-template){target=_blank} or you can use the [ABI template](https://github.com/subsquid-labs/squid-abi-template){target=_blank} for indexing data related to a specific contract:

    === "EVM"
        ```
        sqd init <insert-squid-name> --template evm
        ```

    === "ABI"
        ```
        sqd init <insert-squid-name> --template abi
        ```

    For more information on getting started with both of these templates, please check out the following Subsquid docs:

      - [Quickstart: EVM chains](https://docs.subsquid.io/quickstart/quickstart-ethereum/){target=_blank}
      - [Quickstart: generate from ABI](https://docs.subsquid.io/quickstart/quickstart-abi/){target=_blank}

2. To configure your Subsquid project to run on Moonbeam, you'll need to update the `typegen.json` file. The `typegen.json` file is responsible for generating TypeScript interface classes for your data. Depending on the network you're indexing data on, the `specVersions` value in the `typegen.json` file should be configured as follows:

    === "Moonbeam"
        ```
        "specVersions": "https://moonbeam.archive.subsquid.io/graphql",
        ```

    === "Moonriver"
        ```
        "specVersions": "https://moonriver.archive.subsquid.io/graphql",
        ```

    === "Moonbase Alpha"
        ```
        "specVersions": "https://moonbase.archive.subsquid.io/graphql",
        ```

3. Modify the `src/processor.ts` file, which is where squids instantiate the processor, configure it, and attach handler functions. The processor fetches historical on-chain data from an [Archive](https://docs.subsquid.io/archives/overview/){target=_blank}, which is a specialized data lake. You'll need to configure your processor to pull data from the Archive that corresponds to the network you are indexing data on:

    === "Moonbeam"
        ```
        const processor = new EvmBatchProcessor();
        processor.setDataSource({
          chain: {{ networks.moonbeam.rpc_url }},
          // Resolves to "https://moonbeam-evm.archive.subsquid.io"
          archive: lookupArchive("moonbeam", { type: "EVM" })
        });
        ```

    === "Moonriver"
        ```
        const processor = new EvmBatchProcessor();
        processor.setDataSource({
          chain: {{ networks.moonriver.rpc_url }},
          // Resolves to "https://moonriver-evm.archive.subsquid.io"
          archive: lookupArchive("moonriver", { type: "EVM" }),
        });
        ```

    === "Moonbase Alpha"
        ```
        const processor = new EvmBatchProcessor();
        processor.setDataSource({
          chain: {{ networks.moonbase.rpc_url }},
          // Resolves to "https://moonbase-evm.archive.subsquid.io"
          archive: lookupArchive("moonbase", { type: "EVM" }),
        });
        ```

And that's all you have to do to configure your Subsquid project to index EVM data on Moonbeam! Now you can update the `schema.graphql`, `typgen.json`, and `src/processor.ts` files to index the data you need for your project!

If you're interested in a step-by-step tutorial to get started indexing data on Moonbeam, you can check out the [Index NFT Token Transfers on Moonbeam with Subsquid](/tutorials/integrations/nft-subsquid){target=_blank} tutorial!

--8<-- 'text/disclaimers/third-party-content.md'