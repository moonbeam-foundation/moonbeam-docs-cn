---
title: 使用SubQuery和GraphQL索引Moonbeam
description: 学习如何通过使用SubQuery，在Moonbeam和Moonriver上索引Substrate和EVM数据，并使用 GraphQL 查询数据。
---

# 使用SubQuery索引Moonbeam

![SubQuery Banner](/images/builders/integrations/indexers/subquery/subquery-banner.png)

## 概览 {: #introduction }

[SubQuery](https://subquery.network/){target=_blank}是一个数据聚合层，在Layer 1区块链（例如Moonbeam和波卡）和DApp之间运行。这项服务解锁区块链数据并转换至可查询状态，以便能够在直观的应用程序中使用。这允许DApp开发者聚焦于核心用例和前端，无需在构建为处理数据的自定义后端上浪费时间。

SubQuery支持索引任意Moonbeam网络的以太坊虚拟机（EVM）和Substrate数据。使用SubQuery关键优势是您能够通过单一项目和工具跨Moonbeam的EVM和Substrate代码来灵活收集查询数据，随后使用GraphQL查询该数据。

举例而言，除Substrate数据源外，SubQuery还能够筛选并查询EVM日志和交易。相比较其他索引工具，SubQuery引入更多高级筛选功能，允许筛选非合约交易、交易发送者、合约和索引日志参数，因此开发者能够构建各种满足他们特定数据需求的项目。

本教程将引导您学习如何创建在Moonbeam上索引ERC-20转移和批准的SubQuery项目。具体来说，本教程将涵盖索引`Transfer`事件和`approve`函数的调用。

## 查看先决条件 {: #checking-prerequisites }

在本教程的后半部分，您可以选择将项目部署到本地运行的SubQuery节点。为此，您需要先在您的系统安装以下内容：

 - [Docker](https://docs.docker.com/get-docker/){target=_blank}
 - [Docker Compose](https://docs.docker.com/compose/install/){target=_blank}

!!! 注意事项
    如果Docker Compose是通过`sudo apt install docker-compose`命令为Linux安装的，您可能会在本教程后半部分遇到一些错误。请确保您遵循官方[Install Docker Compose](https://docs.docker.com/compose/install/){target=_blank}教程中关于Linux的说明。

## 创建一个项目 {: #creating-a-project }

首先，您将需要[创建一个SubQuery项目](https://doc.subquery.network/create/introduction/){target=_blank}。您可以选择为Moonbeam、Moonriver或Moonbase Alpha创建项目。在本教程中，我们将选择Moonbeam创建项目。

一般来说，您将需要：

1. 全网安装SubQuery CLI：

    ```
    npm install -g @subql/cli
    ```
    
2. 使用以下命令初始化您的SubQuery项目：

    ```
    subql init PROJECT_NAME
    ```
    
3. 随后，根据提示完成一系列问题：

    1. 关于**Select a network**，您可以选择任一Moonbeam网络。在本示例中，您可以选择**Moonbeam**

        ![Select Moonbeam](/images/builders/integrations/indexers/subquery/subquery-1.png)    

    2. 您可以为每个网络选择一个模板项目（每个网络都有启动项目供你使用）。尤其是Moonriver，您可以在标准启动项目和EVM启动项目中选择。本教程将基于Moonriver EVM启动项目操作，但将从适用Moonbeam的可用标准启动项目进行构建。接下来，您可以选择**moonbeam-starter**

        ![Select moonbeam-starter](/images/builders/integrations/indexers/subquery/subquery-2.png)    

    3. 这将复制启动项目，随后您可以根据提示回答一些额外的问题。您可以直接按回车键输入默认值或者根据需求输入自定义值

        ![Create project](/images/builders/integrations/indexers/subquery/subquery-2.png)   

4. 这将为您的SubQuery项目自动创建一个目录。您只需要从项目目录中安装依赖项：

    ```
    cd PROJECT_NAME && yarn install
    ```

初始化设置完成后，您将拥有一个包含以下文件（以及其他文件）的基础SubQuery项目：

- **`project.yaml`** —— [Manifest File](https://doc.subquery.network/create/manifest/){target=_blank}，作为项目的入口点
- **`schema.graphql`** —— [GraphQL Schema](https://doc.subquery.network/create/graphql/){target=_blank}，定义数据的形状
- **`src/mappings/mappingHandlers.ts`** —— 导出[Mapping](https://doc.subquery.network/create/mapping/){target=_blank}函数，用于定义如何将链数据转换为架构中定义的GraphQL实体
- **`src/chaintypes.ts`** —— 专为Moonbeam导出链的类型，便于您索引Moonbeam数据

如果您查看`package.json`文件，您将会发现`chaintypes`已经导出在该文件中。如果未发现此情况，或者您正在扩展现有Substrate项目以添加Moonbeam网络支持，您将需要包含以下代码段：

```json
  "exports": {
    "chaintypes": "src/chaintypes.ts"
  }
```

## 添加ERC-20合约ABI {: #adding-the-erc-20-contract-abi }

要索引ERC-20数据，您将需要添加一个包含ERC-20 ABI的JSON文件。您可以将ABI用于标准ERC-20接口，这适用于所有使用此通用接口的ERC-20合约。

您可以运行以下命令创建文件：

```sh
touch erc20.abi.json
```

随后，您可以将[用于ERC-20接口的ABI](https://www.github.com/PureStake/moonbeam-docs/blob/master/.snippets/code/subquery/erc20-abi.md){target=_blank}复制粘贴至JSON文件。

在接下来的步骤中，您能够使用ABI筛选ERC-20转移和批准的数据。

## 添加Moonbeam自定义数据源 {: #adding-the-moonbeam-custom-data-source }

数据源定义将被筛选以及抓取的数据，另外也定义了要应用的数据转换的映射函数，以及其处理程序的位置。

SubQuery已经创建了专门用来和Moonbeam [Frontier](https://github.com/paritytech/frontier){target=blank}实现一起工作的数据处理器。这允许您参照处理器使用的特定ABI源以解析参数和事件来源或者调用的智能合约地址。概括来说，SubQuery作为中间件，能够提供额外筛选和数据转换。

在本示例中，您将需要在处理器选项中指定ERC-20 ABI。您也可以为特定的ERC-20 Token指定合约地址，从而使处理器仅返回特定Token的数据。您可以使用Wrapped GLMR (WGLMR) Token的地址：`0xAcc15dC74880C9944775448304B263D191c6077F`。

1. 在您的SubQuery项目中，您可以通过运行以下命令将自定义数据源添加为依赖项：

    ```
    yarn add @subql/contract-processors
    ```
    
2. 将现有的`dataSources`部分替换成您的`project.yaml` manifest文件中的[Frontier EVM自定义数据源](https://doc.subquery.network/create/substrate-evm/#data-source-spec){target=_blank}：

    ```yaml
    dataSources:
      - kind: substrate/FrontierEvm
        startBlock: 1
        processor:
          file: './node_modules/@subql/contract-processors/dist/frontierEvm.js'
          options:
            abi: erc20 # this must match one of the keys in the assets field
            address: '0xAcc15dC74880C9944775448304B263D191c6077F' # optionally get data for a specific contract (WGLMR)
        assets: 
          erc20:
            file: './erc20.abi.json'
        mapping: {...} # the data for this field will be added later on in this guide
    ```

上述配置可以拆分为以下几个部分：

- **kind** —— *必填*，指定自定义Moonbeam数据处理器
- **startBlock** —— 指定要开始索引数据的区块
- **processor.file** —— *必填*，引用数据处理器代码所在的文件
- **processor.options** —— 包含指定Frontier EVM处理器的[处理器选项](https://doc.subquery.network/create/substrate-evm/#processor-options){target=_blank}，包括处理器用于解析参数的`abi`，以及合约事件来源或调用的`address`
- **assets** —— 外部资产ABI文件的对象
- **mapping** —— 映射规范。这包括映射条目的路径、映射函数以及任何其他映射筛选器所对应的处理器类型

## 设置GraphQL架构 {: #setup-the-graphql-schema }

在`schema.graphql`文件中，您可以更新该文件以包含一个`Transaction`和`Approval`实体。关于交易事件和批准调用将会在本教程后半部分讲述。

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

关于此示例完整的schema.graphql文件，您可以在[GitHub](https://www.github.com/PureStake/moonbeam-docs/blob/master/.snippets/code/subquery/schema.graphql.md){target=_blank}上查看。

## 索引Moonbeam数据 {: #indexing-moonbeam-data }

接下来，您可以为自定义数据源添加映射规范和处理程序至您的代码。映射规范包含定义如何转换链数据的[映射函数](https://doc.subquery.network/create/mapping/#){target=blank}。

您的SubQuery项目包含三个映射函数，可在`src/mappings/mappingHandlers.ts`目录下找到。这些映射函数将链数据转换成您定义的GraphQL实体。三个处理器如下所示：

- **Block handler** —— 用于每次将新的区块添加至网络时捕获信息。每个区块调用一次该函数
- **Event handler** —— 用于捕获新的区块发出特定事件的信息。由于该函数会在任意时间的事件发出时被调用，您可以使用映射筛选器来只处理您需要的事件。这可以改善性能并减少索引次数
- **Call handler** —— 用于捕获特定extrinsics的信息

在您的SubQuery项目中，您将注意到传递给`handleEvent`映射函数的事件是`SubstrateEvent`。同样地，传递给`handleCall`映射函数的extrinsic是`SubstrateExtrinsic`。但在Moonbeam上，您的映射函数将收到[`FrontierEvmEvent`](https://doc.subquery.network/create/substrate-evm/#frontierevmevent){target=blank}和[`FrontierEvmCall`](https://doc.subquery.network/create/moonbeam/#frontierevmcall){target=blank}。两者建立在Ether的[TransactionResponse](https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse){target=blank}或者[Log](https://docs.ethers.io/v5/api/providers/types/#providers-Log){target=blank}种类的基础上。

在本示例中，`FrontierEvmEvent`将用于处理和筛选`Transfer`事件，`FrontierEvmCall`将用于处理和筛选`approve`函数调用。

在为Moonbeam更新项目之前，您需要安装[ethers.js](https://docs.ethers.io/){target=_blank}，用于指定转移和批准事件参数的类型：

```
yarn add ethers
```

接下来，您可以更新您的SubQuery项目以在Moonbeam上使用。你可以执行以下步骤：

1. 输入以下内容：

    ```js
import { FrontierEvmEvent, FrontierEvmCall } from '@subql/contract-processors/dist/frontierEvm';
    import { Approval, Transaction } from "../types";
    import { BigNumber } from "ethers";
    ```
    
    `Approval`和`Transaction`种类将在下面几个步骤中自动生成

2. 为基于ERC-20 ABI的转移事件和批准调用设置类型

    ```ts
    type TransferEventArgs = [string, string, BigNumber] & { from: string; to: string; value: BigNumber; };
    type ApproveCallArgs = [string, BigNumber] & { _spender: string; _value: BigNumber; }
    ```
    
3. 您可以移除之前的`handleBlock`函数

4. 将`handleEvent`函数替换成指定Moonbeam映射函数。在本示例中，`handleMoonbeamEvent`函数将基于交易事件构建一个新交易并保存：

    ```ts
    export async function handleMoonbeamEvent(event: FrontierEvmEvent<TransferEventArgs>): Promise<void> {
        const transaction = new Transaction(event.transactionHash);
    
        transaction.value = event.args.value.toBigInt();
        transaction.from = event.args.from;
        transaction.to = event.args.to;
        transaction.contractAddress = event.address;
    
        await transaction.save();
    }
    ```
    
5. 将`handleCall`函数替换成指定Moonbeam映射函数。在本示例中，`handleMoonbeamCall`函数将基于批准函数调用构建一个新批准并保存：

    ```ts
    export async function handleMoonbeamCall(event: FrontierEvmCall<ApproveCallArgs>): Promise<void> {
        const approval = new Approval(event.hash);
    
        approval.owner = event.from;
        approval.value = event.args._value.toBigInt();
        approval.spender = event.args._spender;
        approval.contractAddress = event.to;
    
        await approval.save();
    }
    ```
    
6. 要实际使用`FrontierEvmEvent`和`FrontierEvmCall`处理器、`handleMoonbeamEvent`和`handleMoonbeamCall`映射函数，您可以将其添加至您的`project.yaml` manifest文件中（在`dataSources`的下面）：

    ```yaml
        mapping:
          file: './dist/index.js'
          handlers:
            - handler: handleMoonbeamEvent
              kind: substrate/FrontierEvmEvent
              filter:
                topics:
                  - Transfer(address indexed from,address indexed to,uint256 value)
            - handler: handleMoonbeamCall
              kind: substrate/FrontierEvmCall
              filter:
                function: approve(address to,uint256 value)
                from: '0xAcc15dC74880C9944775448304B263D191c6077F'
    ```
    
    !!! 注意事项
        您也可以使用`filter`来只监听某些事件或者特定函数调用。
    
7. 生成在您GraphQL模式文件中定义的所需GraphQL模型：

    ```
    yarn codegen
    ```
    
    ![yarn codegen results](/images/builders/integrations/indexers/subquery/subquery-4.png)   

8. 要部署您的项目至SubQuery管理的服务器，您必须在上传前构建您的配置。您可以通过运行以下代码完成配置：

    ```
    yarn build
    ```
    
    ![yarn build results](/images/builders/integrations/indexers/subquery/subquery-5.png)   

9. 使用Docker[发布您的项目](https://doc.subquery.network/publish/publish/){target=blank}至[SubQuery项目](https://project.subquery.network/)或本地[运行一个SubQuery节点](https://doc.subquery.network/run/run/){target=_blank}

    ```
    docker-compose pull && docker-compose up
    ```
    
    ![docker-compose logs](/images/builders/integrations/indexers/subquery/subquery-6.png)   

    !!! 注意事项
        第一次下载所需安装包可能会需要一些时间，但不久您便可以看到一个正在运行的SubQuery节点。

您可以在GitHub上查看完整的[mappingHandlers.ts文件](https://www.github.com/PureStake/moonbeam-docs/blob/master/.snippets/code/subquery/mappingHandlers.ts.md){target=blank}或者[本示例的project.yaml文件](https://www.github.com/PureStake/moonbeam-docs/blob/master/.snippets/code/subquery/project.yaml.md){target=blank}。

启动您的数据库和同步节点可能会需要一些时间，但最终您将看到您的节点开始生产区块。

![fetching blocks logs](/images/builders/integrations/indexers/subquery/subquery-7.png)   

现在您可以打开浏览器输入http://localhost:3000查询您的项目，在该页面，您将找到GraphQL playground。在playground的右上角，找到**Docs**按钮，可以打开文档。该文档自动生成，可协助寻找您可查询的实体或者函数。

![GraphQL playground](/images/builders/integrations/indexers/subquery/subquery-8.png)   

恭喜您！现在您已经拥有一个接受GraphQL API查询的Moonbeam SubQuery项目！请注意，根据您所配置的初始区块，索引Moonbeam可能需要几天时间。

## 示例项目 {: #example-projects }

如需查看与上述创建类似的在Moonriver上构建的完整示例项目，请至[SubQuery Moonriver EVM Starter GitHub repository](https://github.com/subquery/tutorials-frontier-evm-starter){target=blank}，或者通过[SubQuery浏览器上在线的SubQuery项目](https://explorer.subquery.network/subquery/subquery/moonriver-evm-starter-project){target=blank}.

如您有任何问题，您可查阅[SubQuery documentation for Substrate EVM Support](https://doc.subquery.network/create/substrate-evm/){target=blank}页面，或者在[SubQuery Discord](https://discord.com/invite/subquery){target=blank}的#technical-support频道联系SubQuery团队。

您可任意复制[GitHub上的Moonriver EVM启动示例项目](https://github.com/subquery/tutorials-frontier-evm-starter){target=blank}.

如您所见，创建一个在单一项目中索引Substrate和EVM数据的Moonbeam、Moonriver或者Moonbase Alpha项目是非常容易的。您可以使用SubQuery的高级scaffolding工具以加快DApp开发，并利用更丰富的索引数据来构建更直观的DApp。

### Moonbuilder教程

SubQuery于2021年12月参加了[Moonbuilders workshop](https://www.crowdcast.io/e/moonbuilders-ws/10){target=blank}，向大家展示了如何创建一个简单的SubQuery项目。您可以自行尝试[生成范本项目](https://github.com/stwiname/moonbuilders-demo){target=blank} 。
