---
title: 使用SubQuery和GraphQL索引数据
description: 学习如何使用SubQuery为Moonbeam和Moonriver索引Substrate和EVM数据并用GraphQL查询数据。
---

# 使用SubQuery索引Moonbeam

![SubQuery Banner](/images/builders/integrations/indexers/subquery/subquery-banner.png)

## 概览 {: #introduction }

[SubQuery](https://subquery.network/){target=_blank}是一个数据聚合层，在Layer 1区块链（例如Moonbeam和波卡）和DApp之间运行。这项服务解锁区块链数据并转换至可查询状态，以便能够在直观的应用程序中使用。这允许DApp开发者聚焦于核心用例和前端，无需在构建为处理数据的自定义后端上浪费时间。

SubQuery支持索引任意Moonbeam网络的以太坊虚拟机（EVM）和Substrate数据。使用SubQuery关键优势是您能够通过单一项目和工具跨Moonbeam的EVM和Substrate代码来灵活收集查询数据，随后使用GraphQL查询该数据。

举例而言，除Substrate数据源外，SubQuery还能够筛选并查询EVM日志和交易。相比较其他索引工具，SubQuery引入更多高级筛选功能，允许筛选非合约交易、交易发送者、合约和索引日志参数，因此开发者能够构建各种满足他们特定数据需求的项目。

本教程将引导您学习如何创建在Moonbeam上索引ERC-20转移和批准的SubQuery项目。具体来说，本教程将涵盖索引`Transfer`事件和`approve`函数的调用。

--8<-- 'text/disclaimers/third-party-content-intro.md'

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
    
    !!! 注意事项
        截至本教程撰写时，所用版本为1.3.1。
    
2. 使用以下命令初始化您的SubQuery项目：

    ```
    subql init PROJECT_NAME
    ```
    
3. 随后，根据提示完成一系列问题：

    1. 关于**Select a network**，您可以选择**Substrate**

        ![Select Moonbeam](/images/builders/integrations/indexers/subquery/subquery-1.png)

    2. 系统将提示您**Select a network（选择网络）**。截至本教程撰写时，Moonriver是唯一选项。您可以继续操作，选择**Moonriver**，这也同样适用于Moonbeam和Moonbase Alpha

        ![Select moonbeam-starter](/images/builders/integrations/indexers/subquery/subquery-2.png)    

    3. 随后，系统将提示您**Select a template project（选择一个示例项目）**。您可以选择EVM启动项目或从git端点创建一个项目。本教程将基于Moonriver EVM启动项目操作，您可以选择**moonriver-evm-starter**

        ![Select moonbeam-starter](/images/builders/integrations/indexers/subquery/subquery-3.png)    

    4. 这将为您复制启动项目，随后根据提示回答一些额外的问题。您可以直接按回车键输入默认值或者根据需求输入自定义值

        ![Create project](/images/builders/integrations/indexers/subquery/subquery-4.png)   

4. 这将为您的SubQuery项目自动创建一个目录。您只需要从项目目录中安装依赖项：

    ```
    cd PROJECT_NAME && yarn install
    ```

初始化设置完成后，您将拥有一个包含以下文件（以及其他文件）的基础SubQuery项目：

- **[`project.yaml`](https://github.com/subquery/tutorials-frontier-evm-starter/blob/moonriver/project.yaml){target=_blank}** —— [Manifest File](https://doc.subquery.network/build/manifest.html){target=_blank}，作为项目的入口点
- **[`schema.graphql`](https://github.com/subquery/tutorials-frontier-evm-starter/blob/moonriver/schema.graphql){target=_blank}** —— [GraphQL Schema](https://doc.subquery.network/build/graphql.html){target=_blank}，定义数据形状。模板包括`Transaction` 和`Approval`实体
- **[`src/mappings/mappingHandlers.ts`](https://github.com/subquery/tutorials-frontier-evm-starter/blob/moonriver/src/mappings/mappingHandlers.ts){target=_blank}** —— 导出[Mapping](https://doc.subquery.network/build/mapping.html){target=_blank}函数，用于定义如何将链数据转换为架构中定义的GraphQL实体
- **[`src/chaintypes.ts`](https://github.com/subquery/tutorials-frontier-evm-starter/blob/moonriver/src/chaintypes.ts){target=_blank}** —— 专为Moonbeam导出链的类型，便于索引Moonbeam数据
- **[`erc20.abi.json`](https://github.com/subquery/tutorials-frontier-evm-starter/blob/moonriver/erc20.abi.json){target=_blank}** —— 包含标准ERC-20接口的ABI的JSON文件，将用于筛选ERC-20转移和批准数据

如果您查看`package.json`文件，您将会发现`chaintypes`已经导出在该文件中。如果未发现此情况，或者您正在扩展现有Substrate项目以添加Moonbeam网络支持，您将需要包含以下代码段：

```json
  "exports": {
    "chaintypes": "src/chaintypes.ts"
  }
```

## 更新网络配置 {: #updating-the-network-configuration }

您将需要在`project.yaml`文件中更新`network`配置。`chainId`字段处可用于输入您想要索引的网络创世哈希。

每个网络的`network`配置如下所示：

=== "Moonbeam"
    ```
    network:
    chainId: '0xfe58ea77779b7abda7da4ec526d14db9b1e9cd40a217c34892af80a9b332b76d'
    endpoint: 'https://moonbeam.api.onfinality.io/public'
    dictionary: 'https://api.subquery.network/sq/subquery/moonbeam-dictionary'
    chaintypes:
      file: ./dist/chaintypes.js
    ```

=== "Moonriver"
    ```yaml
    network:
    chainId: '0x401a1f9dca3da46f5c4091016c8a2f26dcea05865116b286f60f668207d1474b'
    endpoint: 'https://moonriver.api.onfinality.io/public'
    dictionary: 'https://api.subquery.network/sq/subquery/moonriver-dictionary'
    chaintypes:
      file: ./dist/chaintypes.js
    ```

=== "Moonbase Alpha"
    ```
    network:
    chainId: '0x91bc6e169807aaa54802737e1c504b2577d4fafedd5a02c10293b1cd60e39527'
    endpoint: 'https://moonbeam-alpha.api.onfinality.io/public'
    dictionary: 'https://api.subquery.network/sq/subquery/moonbase-alpha-dictionary'
    chaintypes:
      file: ./dist/chaintypes.js    
    ```

## Moonbeam自定义数据源 {: #moonbeam-custom-data-source }

您也需要更新`project.yaml`文件中的`dataSources`配置。数据源定义将被筛选以及抓取的数据，另外也定义了要应用的数据转换的映射函数，以及其处理程序的位置。

SubQuery已经创建了专门用来和Moonbeam [Frontier](https://github.com/paritytech/frontier){target=blank}实现一起工作的数据处理器。这允许您参照处理器使用的特定ABI源以解析参数和事件来源或者调用的智能合约地址。概括来说，SubQuery作为中间件，能够提供额外筛选和数据转换。如果您使用的是示例模板，则Frontier EVM处理器已注入依赖项。如果您使用的是scratch，请确保您运行以下命令安装：

```
yarn add @subql/frontier-evm-processor
```

如果您使用的是示例模板，您将看到ERC-20 ABI已经显示在`dataSources.processor.options`下面。[Solarbeam (SOLAR) token](https://moonriver.moonscan.io/address/0x6bd193ee6d2104f14f94e2ca6efefae561a4334b){target=_blank}在Moonriver上的地址已经罗列出来。在本示例中，您可以在Moonbeam上使用[Wrapped GLMR (WGLMR) token](https://moonscan.io/address/0xAcc15dC74880C9944775448304B263D191c6077F){target=_blank}的地址：`0xAcc15dC74880C9944775448304B263D191c6077F`。

在`dataSources`配置中的字段可以拆分为以下几个部分：

- **kind** —— *必填*，指定自定义Moonbeam数据处理器
- **startBlock** —— 指定开始索引数据的区块
- **processor.file** —— *必填*，引用数据处理器代码所在的文件
- **processor.options** —— 包含指定Frontier EVM处理器的[处理器选项](https://doc.subquery.network/build/substrate-evm.html#processor-options){target=_blank}，包括处理器用于解析参数的`abi`，以及合约事件来源或调用的`address`
- **assets** —— 外部资产ABI文件的对象
- **mapping** —— 映射规范。这包括映射条目的路径、映射函数以及任何其他映射筛选器所对应的处理器类型

## GraphQL架构 {: #setup-the-graphql-schema }

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

要生成架构文件中定义的所需GraphQL模型，您可以运行以下命令：

```
yarn codegen
```

![yarn codegen results](/images/builders/integrations/indexers/subquery/subquery-5.png) 

这些模型将在下一部分介绍映射处理器中使用。

## 映射处理器 {: #mapping-handlers }

映射规范包含定义链数据如何转换的[映射函数](https://doc.subquery.network/create/mapping/#){target=_blank}。

示例模板包含两个映射函数，可在`src/mappings/mappingHandlers.ts`目录下方找到。这些映射函数将转换成您定义的GraphQL实体。两个处理器如下所示：

- **Event handler** —— 用于捕获新的区块发出特定事件的信息。由于该函数会在任意时间的事件发出时被调用，您可以使用映射筛选器来只处理您需要的事件。这可以改善性能并减少索引次数
- **Call handler** —— 用于捕获特定extrinsics的信息

在一般的SubQuery项目中，传递给`handleEvent`映射函数的事件是`SubstrateEvent`。同样地，传递给`handleCall`映射函数的extrinsic是`SubstrateExtrinsic`。但在Moonbeam上，您的映射函数将收到[`FrontierEvmEvent`](https://doc.subquery.network/create/substrate-evm/#frontierevmevent){target=_blank}和[`FrontierEvmCall`](https://doc.subquery.network/create/moonbeam/#frontierevmcall){target=_blank}。两者建立在Ether的[TransactionResponse](https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse){target=blank}或者[Log](https://docs.ethers.io/v5/api/providers/types/#providers-Log){target=blank}种类的基础上。

在本示例中，`FrontierEvmEvent`将用于处理和筛选`Transfer`事件，`FrontierEvmCall`将用于处理和筛选`approve`函数调用。您可根据自己的需求自行添加处理器。

随后，映射处理器将出现在`project.yaml` manifest文件`dataSources`配置的下。您可以为您的每个处理器创建一个`mapping.handlers.handler`配置。`handleMoonbeamEvent`和`handlerMoonbeamCall`处理器已包含在示例模板中。

在Moonbeam上调整WGLMR token的模板之前，您将需要将`mapping.handlers.handler.filter`下方的`from`字段设置为WGLMR合约地址：

```yaml
mapping:
  file: './dist/index.js'
  handlers:
    - handler: handleMoonbeamEvent
      kind: substrate/FrontierEvmEvent
      filter:
        topics:
          - Transfer(address indexed from,address indexed to,uint256 value)
          - null
          - null
          - null
    - handler: handleMoonbeamCall
      kind: substrate/FrontierEvmCall
      filter:
        function: approve(address to,uint256 value)
        from: '0xAcc15dC74880C9944775448304B263D191c6077F'
```

!!! 注意事项
    您也可以通过设置`filter`字段只监听指定事件或特定功能调用。

## 部署项目 {: #deploying-your-project }

要部署您的项目至SubQuery管理的服务器，您必须在上传前构建您的配置。您可以通过运行以下代码完成配置：

```
yarn build
```

![yarn build results](/images/builders/integrations/indexers/subquery/subquery-6.png)   

接下来，使用Docker[发布您的项目](https://doc.subquery.network/publish/publish/){target=_blank}至[SubQuery项目](https://project.subquery.network/){target=_blank}或[本地运行一个SubQuery节点](https://doc.subquery.network/run/run/){target=_blank}。为此，您可以运行以下命令：

```
docker-compose pull && docker-compose up
```

![docker-compose logs](/images/builders/integrations/indexers/subquery/subquery-7.png)   

!!! 注意事项
    第一次下载所需安装包可能会需要一些时间，但不久您便可以看到一个正在运行的SubQuery节点。

启动您的数据库和同步节点可能会需要一些时间，但最终您将看到您的节点开始生产区块。

![fetching blocks logs](/images/builders/integrations/indexers/subquery/subquery-8.png)   

现在您可以打开浏览器输入[http://localhost:3000](http://localhost:3000){target=_blank}查询您的项目，在该页面，您将找到GraphQL playground。在playground的右上角，点击**Docs**按钮可以打开文档。该文档自动生成，可协助寻找您可查询的实体或者函数。

![GraphQL playground](/images/builders/integrations/indexers/subquery/subquery-9.png)   

恭喜您！现在您已经拥有一个接受GraphQL API查询的Moonbeam SubQuery项目！请注意，根据您所配置的初始区块，索引Moonbeam可能需要几天时间。

## 示例项目 {: #example-projects }

如需查看与上述创建类似的在Moonriver上构建的完整示例项目，请至[live Moonriver EVM Starter Project on the SubQuery Explorer](https://explorer.subquery.network/subquery/subquery/moonriver-evm-starter-project){target=_blank}，或者在[SubQuery Explorer](https://explorer.subquery.network/){target=_blank}上查看其他项目。

如您有任何问题，您可查阅[SubQuery documentation for Substrate EVM Support](https://doc.subquery.network/create/substrate-evm/){target=_blank}页面，或者在[SubQuery Discord](https://discord.com/invite/subquery){target=_blank}的#technical-support频道联系SubQuery团队。

### Moonbuilders教程 {: #moonbuilders-tutorial }

SubQuery于2021年12月参加了[Moonbuilders workshop](https://www.crowdcast.io/e/moonbuilders-ws/10){target=_blank}，向大家展示了如何创建一个简单的SubQuery项目。您可以自行尝试[生成范本项目](https://github.com/stwiname/moonbuilders-demo){target=_blank}。

--8<-- 'text/disclaimers/third-party-content.md'