---
title: SubQuery
description: 学习如何通过使用SubQuery，在Moonbeam和Moonriver上索引Substrate和EVM数据
---

# 使用SubQuery索引Moonbeam

![SubQuery Banner](/images/builders/integrations/indexers/subquery/subquery-banner.png)

## 概览 {: #introduction }

[SubQuery](https://subquery.network/){target=_blank}是一个数据聚合层，在Layer 1区块链（例如在波卡上的Moonbeam）和DApp之间运行。这项服务解锁区块链数据并转换至可查询状态，以便能够在直观的应用程序中使用。允许DApp开发者聚焦于核心用例和前端，而无需在构建为处理数据自定义后端上浪费时间。

SubQuery支持索引任意Moonbeam网络的以太坊虚拟机（EVM）和Substrate数据。使用SubQuery关键优势是您能够通过单一项目和工具跨Moonbeam的EVM和Substrate代码来灵活收集查询数据，随后使用GraphQL查询该数据。

举例而言，除Substrate数据源外，SubQuery还能够筛选并查询EVM日志和交易。相比较其他索引工具，SubQuery引入更多高级筛选功能，允许筛选：非合约交易、交易发送者、合约和索引日志参数，因此开发者能够构建各种满足他们特定数据需求的项目。

## 查看先决条件 {: #checking-prerequisites }

在本教程偏后部分，您可以选择将项目部署到本地运行的SubQuery节点。为此，您需要先执行以下步骤安装至您的系统：

 - [Docker](https://docs.docker.com/get-docker/){target=_blank}
 - [Docker Compose](https://docs.docker.com/compose/install/){target=_blank}

## 开始操作 {: #getting-started }

首先，您需要[创建一个SubQuery项目](https://doc.subquery.network/create/introduction/){target=_blank}.

请执行以下步骤：

1. 全局安装SubQuery CLI：

    ```
    npm install -g @subql/cli
    ```
    
2. 创建您SubQuery项目的目录：

    ```
    mkdir subquery-example && cd subquery-example
    ```
    
3. 使用下方命令以初始化您SubQuery项目：

    ```
    subql init PROJECT_NAME
    ```
    
    系统会提示一系列问题。关于**Select a network**，您可以选择任一Moonbeam网络：**Moonbeam**、**Moonriver**、**Moonbeam Alpha**。关于RPC endpoint，您可以输入正创建项目的特定网络的[Network Endpoint](/builders/get-started/endpoints/){target=_blank}

4. 安装来自您项目目录的依赖项：

    ```
    cd PROJECT_NAME && npm install
    ```

在初始化完成后，您将拥有包含以下文件的基础SubQuery项目（除其他以外）：

- **`project.yaml`** —— [Manifest File](https://doc.subquery.network/create/manifest/){target=_blank}作为您项目的入口点
- **`schema.graphql`** —— [GraphQL Schema](https://doc.subquery.network/create/graphql/){target=_blank}定义您数据的形状
- **`src/mappings/mappingHandlers.ts`** —— 导出[Mapping](https://doc.subquery.network/create/mapping/){target=_blank}函数，用来定义链数据如何转换至在架构中定义的GraphQL实体

索引Moonbeam数据只需两个步骤：[添加Moonbeam自定义数据源](#adding-the-moonbeam-custom-data-source){target=_blank}，随后[索引Moonbeam数据](#indexing-moonbeam-data){target=_blank}。

## 添加Moonbeam自定义数据源 {: #adding-the-moonbeam-custom-data-source }

数据源定义将被筛选及抓取的数据。另外也定义了被应用的数据转换的映射函数处理程序的位置。

SubQuery已经创建了专门用来和Moonbeam [Frontier](https://github.com/paritytech/frontier){target=_blank}的实现一起工作的数据处理器。允许您参照处理器使用的特定ABI源以解析参数和事件来源或者调用的智能合约地址。概括来说，SubQuery作为中间件，能够提供额外筛选和数据转换。

1. 在您的SubQuery项目中，您可以通过运行以下[NPM](https://www.npmjs.com/){target=_blank}命令以添加自定义数据源作为依赖项：

    ```
    npm install @subql/contract-processors
    ```
    
2. 添加[Moonbeam自定义数据源](https://doc.subquery.network/create/moonbeam/#data-source-spec){target=_blank}至您`project.yaml`清单文件：

    ```yaml
    dataSources:
      - kind: substrate/Moonbeam
        processor:
          file: './node_modules/@subql/contract-processors/dist/moonbeam.js'
          options: {...}
        assets: {...}
        mapping: {...}
    ```

上方配置可分为：

- **kind** —— *必填*，指定自定义Moonbeam数据处理器
- **processor.file** —— *必填*，参照数据处理器代码所在的文件
- **processor.options** —— 包含特定的Moonbeam处理器[options](https://doc.subquery.network/create/moonbeam/#processor-options){target=_blank}，包括处理器用来解析参数的`abi`。还有合约事务来源或者调用的`address`
- **assets** —— 外部资产ABI文件的对象
- **mapping** —— 映射规范。包含映射入口的路径、映射函数，以及它们任何额外映射筛选器相对应的处理器种类

## 设置GraphQL架构 {: #setup-the-graphql-schema }

在`schema.graphql`文件中，您可以更新该文件，包括一个`Transaction`和`Approval`实体。关于交易事件和通过调用将会在本教程后半部分讲述。

```
type Transaction @entity {
  id: ID! # Transaction hash
  value: BigInt!
  to: String!
  from: String!
  contractAddress: String!
}

type Approval @entity {
  id: ID! # Transaction hash
  value: BigInt!
  owner: String!
  spender: String!
  contractAddress: String!
}
```

## 索引Moonbeam数据 {: #indexing-moonbeam-data }

接下来，您可以为自定义数据源添加映射规范和处理程序至您的代码。映射规范包含定义如何链数据被转换的[映射函数](https://doc.subquery.network/create/mapping/#){target=_blank}

您范本的SubQuery项目包含三个映射函数，可在`src/mappings/mappingHandlers.ts`目录下找到。这些映射函数变身链数据至您定义的GraphQL实体。三个处理程序如下：

- **Block handler** —— 用于在每次将新区块添加到网络时捕获信息。每区块调用一次此函数
- **Event handler** —— 用于捕获新区块发出特定事件的信息。由于该函数会在任意时间的事件发出时被调用，您可以使用映射筛选器来只处理你需要的事件。这可以改善性能并减少索引次数
- **Call handler** —— 用于捕获特定extrinsics的信息

在您范本的SubQuery项目中，您将注意到传递给`handleEvent`映射函数的事件是`SubstrateEvent`。相似，传递给`handleCall`映射函数的extrinsic是`SubstrateExtrinsic`。相对在Moonbeam上，您的映射函数将收到[`MoonbeamEvent`](https://doc.subquery.network/create/moonbeam/#moonbeamevent){target=_blank}和[`MoonbeamCall`](https://doc.subquery.network/create/moonbeam/#moonbeamcall){target=_blank}。两者建立在Ether's [TransactionResponse](https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse){target=_blank}或者[Log](https://docs.ethers.io/v5/api/providers/types/#providers-Log){target=_blank}种类的基础上。

为更新您范本的SubQuery项目可被Moonbeam使用，您可以采取以下步骤：

1. 输入以下内容：

    ```js
import { MoonbeamEvent, MoonbeamCall } from '@subql/contract-processors/dist/moonbeam';
    import { Approval, Transaction } from "../types";
    ```
    
    `Approval`和`Transaction`种类将在下面几步自动生成。

2. 用Moonbeam的映射函数替换`handleEvent`函数。在本例，`handleMoonbeamEvent`函数将基于交易事件构建一个新交易并保存：

    ```js
    export async function handleMoonbeamEvent(event: MoonbeamEvent<TransferEventArgs>): Promise<void> {
        const transaction = new Transaction(event.transactionHash);
    
        transaction.value = event.args.value.toBigInt();
        transaction.from = event.args.from;
        transaction.to = event.args.to;
        transaction.contractAddress = event.address;
    
        await transaction.save();
    }
    ```
    
3. 用Moonbeam的映射函数替换`handleCall`函数。在本例，`handleMoonbeamCall`函数将基于审批函数调用构建一个新审批并保存：

    ```js
    export async function handleMoonbeamCall(event: MoonbeamCall<ApproveCallArgs>): Promise<void> {
        const approval = new Approval(event.hash);
    
        approval.owner = event.from;
        approval.value = event.args._value.toBigInt();
        approval.spender = event.args._spender;
        approval.contractAddress = event.to;
    
        await approval.save();
    }
    ```
    
4. 为使用`MoonbeamEvent`和`MoonbeamCall`处理程序、`handleMoonbeamEvent`和`handleMoonbeamCall`映射函数，您可以添加它们至您的`project.yaml`清单文件：

    ```yaml
        mapping:
          file: './dist/index.js'
          handlers:
            - handler: handleMoonbeamEvent
              kind: substrate/MoonbeamEvent
              filter: {...}
            - handler: handleMoonbeamCall
              kind: substrate/MoonbeamCall
              filter: {...}
    ```
    
    !!! 注意事项
        您也可以使用`filter`来只侦听某些事件或者特殊函数调用。
    
5. 生成在您GraphQL模式文件中定义的必需的GraphQL模型：

    ```
    npm run codegen
    ```
    
6. 使用Docker，[发布您的项目](https://doc.subquery.network/publish/publish/){target=_blank}至[SubQuery项目](https://project.subquery.network/){target=_blank}，或者[在本地运行一个SubQuery节点](https://doc.subquery.network/run/run/){target=_blank} 

    ```
    docker-compose pull && docker-compose up
    ```
    
    !!! 注意事项
        第一次下载所需包可能会需要一些时间，但不久您便可以看到一个正在运行的SubQuery节点。
    
7. 现在您可以通过http://localhost:3000查询您的项目，在该页面，您将找到GraphQL playground。在playground的右上角，您将找到**Docs**按钮，可以打开文档。该文档自动生成，可协助您寻找您可查询的实体或者函数。

    ```
    {
      query {
        {...}
      }
    }
    ```

恭喜您！现在您已经拥有一个接受GraphQL API查询的Moonbeam SubQuery项目！

## 示例项目 {: #example-projects }

如需看您创建的完整示例项目，请至[GitHub repository](https://github.com/subquery/tutorials-moonriver-evm-starter){target=_blank}或者通过[SubQuery浏览器上在线的SubQuery项目](https://explorer.subquery.network/subquery/subquery/moonriver-evm-starter-project){target=_blank}.

如您有任何问题，请确保[SubQuery documentation for Moonbeam](https://doc.subquery.network/create/moonbeam){target=_blank}上查找，或者在[SubQuery Discord](https://discord.com/invite/subquery){target=_blank}的#technical-support 频道联系SubQuery团队。

您可任意复制[GitHub上的示例项目](https://github.com/subquery/tutorials-moonriver-evm-starter){target=_blank}.

如您所见，创建一个单一项目中索引Substrate和EVM数据的Moonbeam、Moonriver或者Moonbase Alpha项目是非常容易的。您可以使用SubQuery高级scaffolding工具以加快DApp开发，并利用更丰富的索引数据来构建更直观的DApp。

### Moonbuilder教程 {: #moonbuilders-tutorial }

SubQuery于12月加入[Moonbuilders workshop](https://www.crowdcast.io/e/moonbuilders-ws/10){target=_blank}，展示如何创建一个简单的SubQuery项目。您可以自己尝试[生成范本项目](https://github.com/stwiname/moonbuilders-demo){target=_blank} 。
