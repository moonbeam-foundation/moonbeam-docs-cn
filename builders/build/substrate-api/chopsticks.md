---
title: 如何使用Chopsticks分叉Moonbeam
description: 学习如何通过Chopsticks重放区块、解析状态更迭、测试XCM交互以及本地分叉Moonbeam整体网络等基础操作。
---

# 如何使用Chopsticks分叉Moonbeam

## 概览 {: #introduction }

[Chopsticks](https://github.com/AcalaNetwork/chopsticks){target=_blank}提供了一种开发者友好型方法，让其可以在本地分叉现有的基于Substrate的链。它允许重放区块以轻松检查extrinsics是如何影响状态，或是为XCM测试进行多个区块分叉等等。这允许开发者在本地开发环境中测试和试验他们自己的自定义区块链配置时，无需部署实时网络。

整体来说，Chopsticks旨在简化在Substrate上构建区块链应用的流程并让其能够普及至更多开发者。

## 查看先决条件 {: #checking-prerequisites }

要使用Chopsticks，您需要准备以下内容：

- 安装[Node](https://nodejs.org/en/download/){target=_blank}
- 安装[Docker](https://docs.docker.com/get-docker/){target=_blank}
- (可选)安装最新版本的[Rust](https://www.rust-lang.org/tools/install){target=_blank}

## 配置Chopsticks {: configuring-chopsticks }

一共有两种方式来使用Chopsticks。第一种也是推荐的方法是将它作为一个包安装：

```bash
yarn add @acala-network/chopsticks
```

另一种选择是从Chopsticks的GitHub库安装Chopsticks，添加依赖项并构建它。请注意，本指南中的命令将假设您正在使用包安装，它使用 `npx @acala-network/chopsticks`或`yarn dlx`而不是`npm run`或`yarn start`进行本地构建：

```bash
git clone --recurse-submodules https://github.com/AcalaNetwork/chopsticks.git && \
cd chopsticks && \
yarn && \
yarn build-wasm
```

Chopsticks中包含一组[YAML](https://yaml.org/){target=_blank}配置文件，可用于创建各种Substrate链的本地副本。您可以在[源代码库](https://github.com/AcalaNetwork/chopsticks.git){target=_blank}的`configs`文件夹中查看每个默认的配置文件。Moonbeam、Moonriver和Moonbase Alpha都有可用的默认文件。下面的示例配置为Moonbeam网络当前使用的配置：

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

可以包含在配置文件的设置与[`dev`命令](#forking-moonbeam){target=_blank}中的标志以及以下的附加选项相同：

|     选项     |                             描述                             |
| :---------: | :----------------------------------------------------------: |
|   genesis   |           构建分叉的指向平行链原始创世文件的链接，而非端点           |
|  timestamp  |                      构建分叉的区块的时间戳                      |

## 分叉Moonbeam {: #forking-moonbeam }

分叉Moonbeam最简单的方法是使用先前介绍的配置文件：

=== "Moonbeam"

    ```bash
    npx @acala-network/chopsticks dev --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonbeam.yml
    ```

=== "Moonriver"

    ```bash
    npx @acala-network/chopsticks dev --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonriver.yml
    ```

=== "Moonbase Alpha"

    ```bash
    npx @acala-network/chopsticks dev --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonbase-alpha.yml
    ```

然而，配置文件并非完全必要。还有其他命令和标志可以在命令行中进行完整的环境配置。

`npx @acala-network/chopsticks dev`命令将会分叉一条链，其中包含以下标志：

|           标志            |                               描述                               |
| :----------------------: | :--------------------------------------------------------------: |
|         endpoint         |                        进行分叉的平行链端点。                        |
|          block           |                  用于指定重放分叉的区块哈希或是区块号。                 |
|      wasm-override       |                    用作平行链的WASM路径，而非端点。                   |
|            db            |             导向至储存或是将会储存平行链数据库的文件名称路径。            |
|          config          |                        配置文件的路径或URL。                        |
|           port           |                           公开端点的端口。                          |
|     build-block-mode     | 区块如何在分叉中被构建：批处理（batch）、手动（manual）、立即（instant）。 |
|      import-storage      |            预先定义的JSON/YAML存储文件路径以覆盖平行链存储。            |
| allow-unresolved-imports |             在使用WASM构建平行链时是否允许WASM未解析的导入。            |
|           html           |                 包含此标志以生成区块之间存储差异的预览。                |
|   mock-signature-host    |   模拟签名主机，让任何以0xdeadbeef开头并由0xcd填充的签名都被认为是有效的。 |

### 与分叉交互 {: #interacting-with-a-fork }

当您在运行分叉时，默认情况下，您可以在`ws://localhost:8000`进行访问。您将能够通过[Polkadot.js](https://github.com/polkadot-js/common){target=blank}等库及其[它的用户界面Polkadot.js Apps](https://github.com/polkadot-js/apps){target=_blank}与平行链进行交互。

您可以通过[Polkadot.js Apps用户界面](https://polkadot.js.org/apps/#/explorer){target=_blank}与Chopsticks交互。为此，请访问该页面并执行以下步骤：

1. 点击左上角的图标

2. 在页面最底端打开**Development**

3. 选择**Custom**端点并输入`ws://localhost:8000`

4. 点击**Switch**按钮

![Open WSS](/images/builders/build/substrate-api/chopsticks/chopsticks-1.png)
![Switch WSS](/images/builders/build/substrate-api/chopsticks/chopsticks-2.png)

您现在应当在Polkadot.js Apps的托管版本并且能够与分叉交互。

!!! 注意事项
    如果您的浏览器无法连接到Chopsticks提供的WebSocket端点，您可能需要允许Polkadot.js APPs URL的不安全连接。另一种解决方案是运行[Polkadot.js Apps的Docker版本](https://github.com/polkadot-js/apps#docker){target=_blank}。

## 重放区块 {: #replaying-blocks }

如果您想重放一个区块并检索其信息以剖析extrinsic，您可以使用`npx @acala-network/chopsticks run-block`命令。它有以下标志：

|           标志            |                               描述                               |
| :----------------------: | :--------------------------------------------------------------: |
|         endpoint         |                        进行分叉的平行链端点。                        |
|          block           |                  用于指定重放分叉的区块哈希或是区块号。                 |
|      wasm-override       |                    用作平行链的WASM路径，而非端点。                   |
|            db            |             导向至储存或是将会储存平行链数据库的文件名称路径。            |
|          config          |                         配置文件的路径或URL。                        |
| output-path=/[file_path] |           用于把结果打印至一个JSON文件中而非在终端中打印出结果。          |
|           html           |               包含此标志以生成区块之间存储差异预览的HTML。              |
|           open           |                         选择是否打开HTML。                         |

举例来说，运行以下命令将会重新运行Moonbeam的区块1000，并在`moonbeam-output.json`文件中写入存储差异和其他数据：

```bash
npx @acala-network/chopsticks run-block --endpoint wss://wss.api.moonbeam.network --block 1000 --output-path=./moonbeam-output.json
```

## XCM测试 {: #xcm-testing }

要在网络间测试XCM消息，您可以在本地分叉多个平行链和中继链。举例来说，假设你已经从Github repository下载了[config文件夹](https://github.com/AcalaNetwork/chopsticks/tree/master/configs){target=_blank}，以下命令将会分叉Moonriver、Karura和Kusama：

```bash
npx @acala-network/chopsticks xcm --relaychain=configs/kusama.yml --parachain=configs/moonriver.yml --parachain=configs/karura.yml
```

您应当能看到类似于以下输出的内容：

```text
[12:48:58.766] INFO (rpc/21840): Moonriver RPC listening on port 8000
[12:49:03.266] INFO (rpc/21840): Karura RPC listening on port 8001
[12:49:03.565] INFO (xcm/21840): Connected parachains [2000,2023]
[12:49:07.058] INFO (rpc/21840): Kusama RPC listening on port 8002
[12:49:07.557] INFO (xcm/21840): Connected relaychain 'Kusama' with parachain 'Moonriver'
[12:49:08.227] INFO (xcm/21840): Connected relaychain 'Kusama' with parachain 'Karura'
```

`relaychain`命令标志是可选的，因为Chopsticks会自动模拟网络之间的中继链。

## WebSocket命令 {: #websocket-commands }

Chopsticks的内部websocket服务器有特殊的端点，允许操作本地Substrate链。这些是可以调用的方法：

|      方法       |       参数        |                              描述                              |
|:--------------:|:-----------------:|:-------------------------------------------------------------:|
|  dev_newBlock  |      options      |                       生成一个或多个新区块。                      |
| dev_setStorage | values, blockHash |                      创建或覆盖任何存储的值。                     |
| dev_timeTravel |       date        |                  将区块的时间戳设置为`date`值。                   |
|  dev_setHead   |   hashOrNumber    |              将区块链的块头设置为特定的哈希值或区块号。              |

每个方法都可以通过连接到websocket（默认为`ws://localhost:8000`）并以以下格式发送数据和参数来调用。将`METHOD_NAME`替换为方法名称，将`PARAMETER_1`和`PARAMETER_2`替换或删除为与方法相关的参数数据：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "METHOD_NAME",
    "params": ["PARAMETER_1", "PARAMETER_2", "..."]
}
```

以下是参数的描述：

- **`options` { "to": number, "count": number }** - 可选，保留`null`以创建一个区块。使用`"to"`创建达到特定值的区块，使用`"count"`增加特定数量的区块
- **`values` Object** - 类似于存储值路径的JSON对象，类似于您通过Polkadot.js检索的内容
- **`blockHash` string** - 可选，存储值发生变更的区块哈希
- **`date` string** - 一个日期字符串（与JavaScript日期库兼容），它将更改时间戳，从该时间戳开始创建下一个区块。所有未来的区块将在该时间点之后依次出现
- **`hashOrNumber` number | string** - 如果找到，链头将被设置为具有该值的区块号或区块哈希的区块

--8<-- 'text/disclaimers/third-party-content.md'