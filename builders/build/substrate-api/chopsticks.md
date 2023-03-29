---
title: How to use Chopsticks to Fork Moonbeam - 如何使用Chopsticks分叉Moonbeam
description: Learn the basics of how to use Chopsticks to replay blocks, dissect state changes, test XCM interactions, and locally fork the entirety of a Moonbeam network. 学习如何通过Chopsticks重放区块、解析状态更迭、测试XCM交互以及本地分叉Moonbeam整体网络等基础操作。
---

# How to Use Chopsticks to Fork Moonbeam 如何使用Chopsticks分叉Moonbeam

![Chopsticks diagram](/images/builders/build/substrate-api/chopsticks/chopsticks-banner.png)

## Introduction 概览 {: #introduction }

[Chopsticks](https://github.com/AcalaNetwork/chopsticks){target=_blank} provides a developer-friendly method of locally forking existing Substrate based chains. It allows for the replaying of blocks to easily examine how extrinsics effect state, the forking of multiple blocks for XCM testing, and more. This allows developers to test and experiment with their own custom blockchain configurations in a local development environment, without the need to deploy a live network.  

[Chopsticks](https://github.com/AcalaNetwork/chopsticks){target=_blank}提供了一种开发者友好型方法，让其可以在本地分叉现有的基于Substrate的链。它允许重放区块以轻松检查extrinsics是如何影响状态，或是为XCM测试进行多个区块分叉等等。这允许开发者在本地开发环境中测试和试验他们自己的自定义区块链配置时，无需部署实时网络。

Overall, Chopsticks aims to simplify the process of building blockchain applications on Substrate and make it accessible to a wider range of developers.

整体来说，Chopsticks旨在简化在Substrate上构建区块链应用的流程并让其能够普及至更多开发者。

## Checking Prerequisites 查看先决条件 {: #checking-prerequisites }

To use Chopsticks, you will need the following:  

要使用Chopsticks，您需要准备以下内容：

- Have [Node](https://nodejs.org/en/download/){target=_blank} installed  
- 安装[Node](https://nodejs.org/en/download/){target=_blank}
- Have [Docker](https://docs.docker.com/get-docker/){target=_blank} installed
- 安装[Docker](https://docs.docker.com/get-docker/){target=_blank}
- (Optional) Have a recent version of [Rust installed](https://www.rust-lang.org/tools/install){target=_blank} 
- 安装最新版本的[Rust](https://www.rust-lang.org/tools/install){target=_blank}

## Configuring Chopsticks 配置Chopsticks {: configuring-chopsticks }

There are two ways to use Chopsticks. The first and recommended way is by installing it as a package:  

```
yarn add @acala-network/chopsticks
```

The alternate option is to clone Chopsticks from its GitHub repository, add dependencies, and build it. Note that the commands in this guide will assume that you are using the package installation, which uses `npx @acala-network/chopsticks` or `yarn dlx` instead of `npm run` or `yarn start` for local builds:

```
git clone --recurse-submodules https://github.com/AcalaNetwork/chopsticks.git && \
cd chopsticks && \
yarn && \
yarn build-wasm
```

Chopsticks includes a set of [YAML](https://yaml.org/){target=_blank} configuration files that can be used to create a local copy of a variety of Substrate chains. You can view each of the default configuration files within the `configs` folder of the [source repository](https://github.com/AcalaNetwork/chopsticks.git){target=_blank}. Moonbeam, Moonriver, and Moonbase Alpha all have default files available. The example configuration below is the current configuration for Moonbeam: 

Chopsticks中包含一组[YAML](https://yaml.org/){target=_blank}配置文件，可用于创建各种Substrate链的本地副本。您可以在`configs`文件夹中查看每个默认的配置文件。Moonbeam、Moonriver和Moonbase Alpha都有可用的默认文件。下面的示例配置为Moonbeam网络当前使用的配置： 

```yaml
endpoint: wss://wss.api.moonbeam.network
mock-signature-host: true
db: ./db.sqlite

import-storage:
  System:
    Account:
      -
        -
          - "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"
        - data:
            free: "100000000000000000000000"
  TechCommitteeCollective:
    Members: ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"]
  CouncilCollective:
    Members: ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"]
  TreasuryCouncilCollective:
    Members: ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"]
  AuthorFilter:
    EligibleRatio: 100
    EligibleCount: 100
```

The settings that can be included in the config file are the same as the flags in the [`dev` command](#forking-moonbeam){target=_blank}, as well as these additional options:  

可以包含在配置文件的设置与[`dev`命令](#forking-moonbeam){target=_blank}中的标记相同，以及以下的附加选项：

| Option 选项 |                       Description 描述                       |
| :---------: | :----------------------------------------------------------: |
|   genesis   | The link to a parachain's raw genesis file to build the fork from, instead of an endpoint. 进行分叉的平行链原始创世文件链接，而非端点 |
|  timestamp  |    Timestamp of the block to fork from. 区块分叉的时间戳     |

## Forking Moonbeam 分叉Moonbeam {: #forking-moonbeam }

The simplest way to fork Moonbeam is through the previously introduced configuration files:  

分叉Moonbeam最简单的方法是使用先前介绍的配置文件：

=== "Moonbeam"
    ```
    npx @acala-network/chopsticks dev --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonbeam.yml
    ```

=== "Moonriver"
    ```
    npx @acala-network/chopsticks dev --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonriver.yml
    ```

=== "Moonbase Alpha"
    ```
    npx @acala-network/chopsticks dev --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonbase-alpha.yml
    ```

A configuration file is not necessary, however. There are additional commands and flags to configure the environment completely in the command line.  

然而，配置文件并非完全必要。还有其他命令和标记可以在命令行中进行完整的环境配置。

The `npx @acala-network/chopsticks dev` command forks a chain, and includes following flags:  

`npx @acala-network/chopsticks dev`命令将会分叉一条链，其中包含以下标记：

|        Flag 标记         |                       Description 描述                       |
| :----------------------: | :----------------------------------------------------------: |
|         endpoint         | The endpoint of the parachain to fork. 平行链进行分叉的端点。 |
|          block           | Use to specify at which block hash or number to replay the fork. 用于指定重放分叉的区块哈希或是编码。 |
|      wasm-override       | Path of the WASM to use as the parachain, instead of an endpoint. 作为平行链使用的WASM路径，非单一端点。 |
|            db            | Path to the name of the file that stores or will store the parachain's database. 导向至储存或是将会储存平行链数据库的文件名称路径。 |
|          config          |          Path or URL of the config file. 配置文件的路径。           |
|           port           |     The port to expose an endpoint on. 公开端点的端口。      |
|     build-block-mode     | How blocks should be built in the fork: batch, manual, instant. 区块如何在分叉中被构建：批处理、手动、立即。 |
|      import-storage      | A pre-defined JSON/YAML storage file path to override in the parachain's storage. 预先定义的JSON/YAML存储文件路径以覆盖平行链存储。 |
| allow-unresolved-imports | Whether to allow WASM unresolved imports when using a WASM to build the parachain. 在使用WASM构建平行链时是否允许WASM未解析导入。 |
|      import-storage      | Include to generate storage diff preview between blocks. 在区块之间被包含用于产生不同存储预览 |
|   mock-signature-host    | Mock signature host so any signature starts with 0xdeadbeef and filled by 0xcd is considered valid. 模拟签名主机，让任何以0xdeadbeef开头并由0xcd填充的签名都被认为是有效的 |

### Interacting with a Fork 与分叉交互 {: #interacting-with-a-fork }

When running a fork, by default it will be accessible at `ws://localhost:8000`. You will be able to interact with the parachain via libraries such as [Polkadot.js](https://github.com/polkadot-js/common){target=_blank} and its [user interface, Polkadot.js Apps](https://github.com/polkadot-js/apps){target=_blank}.  

当您在运行分叉时，默认情况下，您可以在`ws://localhost:8000`进行访问。您将能够通过 [Polkadot.js](https://github.com/polkadot-js/common){target=blank}及其[本地构建的用户界面和Polkadot.js Apps](https://github.com/polkadot-js/apps){target=_blank}等库与平行链进行交互。

You can interact with Chopsticks via the [Polkadot.js Apps hosted user interface](https://polkadot.js.org/apps/#/explorer){target=_blank}. To do so, visit the page and take the following steps:

1. Click the icon in the top left

   点击左上角标志

2. Go to the bottom and open **Development**

   在页面最底端打开**Development**

3. Select the **Custom** endpoint and enter `ws://localhost:8000`

   选择**Custom**端点并输入`ws://localhost:8000`

4. Click the **Switch** button

   点击**Switch**按钮

![Open WSS](/images/builders/build/substrate-api/chopsticks/chopsticks-1.png)
![Switch WSS](/images/builders/build/substrate-api/chopsticks/chopsticks-2.png)

You should now be able to interact with the fork as you would in the hosted version of Polkadot.js Apps.

您现在应当在Polkadot.js Apps的托管版本并且能够与分叉交互。

!!! note
    If your browser cannot connect to the WebSocket endpoint provided by Chopsticks, you might need to allow insecure connections for the Polkadot.js Apps URL. Another solution is to run the [Docker version of Polkadot.js Apps](https://github.com/polkadot-js/apps#docker){target=_blank}.

## Replaying Blocks 重放区块 {: #replaying-blocks }

In the case where you would like to replay a block and retrieve its information to dissect the effects of an extrinsic, you can use the `npx @acala-network/chopsticks run-block` command. Its following flags are:  

如果您想重放一个区块并检索其信息以剖析extrinsic，您可以使用`npx @acala-network/chopsticks run-block`命令。它的以下标记为：

|        Flag 标记         |                       Description 描述                       |
| :----------------------: | :----------------------------------------------------------: |
|         endpoint         | The endpoint of the parachain to fork. 平行链进行分叉的端点。 |
|          block           | Use to specify at which block hash or number to replay the fork. 用于指定重放分叉的区块哈希或是编码。 |
|      wasm-override       | Path of the WASM to use as the parachain, instead of forking an endpoint. 作为平行链使用的WASM路径，非单一端点。 |
|            db            | Path to the name of the file that stores or will store the parachain's database. 导向至储存或是将会储存平行链数据库的文件名称路径。 |
|          config          |          Path or URL of the config file. 配置文件的路径。           |
| output-path=/[file_path] | Use to print out results to a JSON file instead of printing it out in the console. 用于于JSON文件中列出结果而非在终端中列出的命令。 |
|           html           | Include to generate an HTML representation of the storage diff preview between blocks. 在区块之间被包含用于产生一个HTML表现型。 |
|           open           | Whether to open the HTML representation. 选择是否打开HTML表现型。 |

For example, running the following command will re-run Moonbeam's block 1000, and write the storage diff and other data in a `moonbeam-output.json` file:  

举例来说，运行以下命令将会重新运行Moonbeam的区块1000，并在`moonbeam-output.json`文件中写出存储差异和其他数据：

```
npx @acala-network/chopsticks run-block --endpoint wss://wss.api.moonbeam.network --block 1000 --output-path=./moonbeam-output.json
```

## XCM Testing XCM测试 {: #xcm-testing }

To test out XCM messages between networks, you can fork multiple parachains and a relay chain locally. For example, the following will fork Moonriver, Karura, and Kusama given that you've downloaded the [config folder from the GitHub repository](https://github.com/AcalaNetwork/chopsticks/tree/master/configs){target=_blank}:  

要在网络间测试XCM消息，您可以在本地分叉多个平行链和中继链。举例来说，以下命令将会分叉Moonriver、Karura和Kusama：

```
npx @acala-network/chopsticks xcm --relaychain=configs/kusama.yml --parachain=configs/moonriver.yml --parachain=configs/karura.yml
```

You should see something like the following output:  

您应当能看到以下输出：

```
[12:48:58.766] INFO (rpc/21840): Moonriver RPC listening on port 8000
[12:49:03.266] INFO (rpc/21840): Karura RPC listening on port 8001
[12:49:03.565] INFO (xcm/21840): Connected parachains [2000,2023]
[12:49:07.058] INFO (rpc/21840): Kusama RPC listening on port 8002
[12:49:07.557] INFO (xcm/21840): Connected relaychain 'Kusama' with parachain 'Moonriver'
[12:49:08.227] INFO (xcm/21840): Connected relaychain 'Kusama' with parachain 'Karura'
```

Including the `relaychain` command is optional, as Chopsticks will automatically mock a relay chain between networks.  

## WebSocket Commands

Chopsticks' internal websocket server has special endpoints that allows the manipulation of the local Substrate chain. These are the methods that can be invoked:  

|     Method     |    Parameters     |                          Description                          |
|:--------------:|:-----------------:|:-------------------------------------------------------------:|
|  dev_newBlock  |      options      |               Generates one or more new blocks.               |
| dev_setStorage | values, blockHash |         Create or overwrite the value of any storage.         |
| dev_timeTravel |       date        |     Sets the timestamp of the block to the `date` value.      |
|  dev_setHead   |   hashOrNumber    | Sets the head of the blockchain to a specific hash or number. |

Each method can be invoked by connecting to the websocket (`ws://localhost:8000` by default) and sending the data and parameters in the following format. Replace `METHOD_NAME` with the name of the method, and replace or delete `PARAMETER_1` and `PARAMETER_2` with the parameter data relevant to the method:  

```
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "METHOD_NAME",
    "params": [PARAMETER_1, PARAMETER_2...]
}
```

Parameters can be described in the following ways:  

- **`options` { "to": number, "count": number }** - optional, leave `null` to create one block. Use `"to"` to create blocks up to a certain value, use `"count"` to increase by a certain number of blocks  
- **`values` Object** - a JSON object resembling the path to a storage value, similar to what you would retrieve via Polkadot.js  
- **`blockHash` string** - optional, the blockhash at which the storage value is changed
- **`date` string** - a Date string (compatible with the JavaScript Date library) that will change the time stamp from which the next blocks being created will be at. All future blocks will be sequentially after that point in time
- **`hashOrNumber` number | string** - if found, the chain head will be set to the block with the block number or block hash of this value

--8<-- 'text/disclaimers/third-party-content.md'