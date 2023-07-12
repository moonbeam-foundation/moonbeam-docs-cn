---
title: 如何使用Chopsticks分叉Moonbeam
description: 学习如何通过Chopsticks重放区块、解析状态更迭、测试XCM交互以及本地分叉Moonbeam整体网络等基础操作。
---

# 如何使用Chopsticks分叉Moonbeam

![Chopsticks diagram](/images/builders/build/substrate-api/chopsticks/chopsticks-banner.png)

## 概览 {: #introduction }

[Chopsticks](https://github.com/AcalaNetwork/chopsticks){target=_blank}提供了一种开发者友好型方法，让其可以在本地分叉现有的基于Substrate的链。它允许重放区块以轻松检查extrinsics是如何影响状态，或是为XCM测试进行多个区块分叉等等。这允许开发者在本地开发环境中测试和试验他们自己的自定义区块链配置时，无需部署实时网络。

整体来说，Chopsticks旨在简化在Substrate上构建区块链应用的流程并让其能够普及至更多开发者。

## Forking Moonbeam用Chopsticks {: #forking-moonbeam }

To use Chopsticks, you can install it as a package with the [Node package manager](https://nodejs.org/en){target=_blank} or [Yarn](https://yarnpkg.com/){target=_blank}:  

```
npm i @acala-network/chopsticks@latest
```

Once installed, you can run commands with the Node package executor. For example, this runs Chopstick's base command:  

```
npx @acala-network/chopsticks
```

To run Chopsticks, you will need some sort of configuration, typically through a file. Chopsticks' source repository includes a set of [YAML](https://yaml.org/){target=_blank} configuration files that can be used to create a local copy of a variety of Substrate chains. You can download the configuration files from the [source repository's `configs` folder](https://github.com/AcalaNetwork/chopsticks.git){target=_blank}.  

Moonbeam、Moonriver和Moonbase Alpha都有可用的默认文件。下面的示例配置为Moonbeam网络当前使用的配置

=== "Moonbeam"
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

=== "Moonriver"
    ```yaml
    endpoint: wss://wss.moonriver.moonbeam.network
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

=== "Moonbase Alpha"
    ```yaml
    endpoint: wss://wss.api.moonbase.moonbeam.network
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
      Sudo:
        Key: "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"
      AuthorFilter:
        EligibleRatio: 100
        EligibleCount: 100
    ```

可以包含在配置文件的设置:

|            选项            |                                    描述                                    |
|:--------------------------:|:--------------------------------------------------------------------------:|
|         `genesis`          |              构建分叉的指向平行链原始创世文件的链接，而非端点              |
|        `timestamp`         |                           构建分叉的区块的时间戳                           |
|         `endpoint`         |                           进行分叉的平行链端点。                           |
|          `block`           |                   用于指定重放分叉的区块哈希或是区块号。                   |
|      `wasm-override`       |                      用作平行链的WASM路径，而非端点。                      |
|            `db`            |             导向至储存或是将会储存平行链数据库的文件名称路径。             |
|          `config`          |                           配置文件的路径或URL。                            |
|           `port`           |                              公开端点的端口。                              |
|     `build-block-mode`     | 区块如何在分叉中被构建：批处理（batch）、手动（manual）、立即（instant）。 |
|      `import-storage`      |             预先定义的JSON/YAML存储文件路径以覆盖平行链存储。              |
| `allow-unresolved-imports` |              在使用WASM构建平行链时是否允许WASM未解析的导入。              |
|           `html`           |                  包含此标志以生成区块之间存储差异的预览。                  |
|   `mock-signature-host`    |  模拟签名主机，让任何以0xdeadbeef开头并由0xcd填充的签名都被认为是有效的。  |

You can use the configuration file with the base command `npx @acala-network/chopsticks` to fork assets by providing it with the `--config` flag.  

You can use a raw GitHub URL of the default configuration files, a path to a local configuration file, or simply use the chain's name for the `--config` flag. For example, the following commands all use Moonbeam's configuration in the same way:  

=== "Chain Name"
    ```
    npx @acala-network/chopsticks --config=moonbeam
    ```

=== "GitHub URL"
    ```
    npx @acala-network/chopsticks \
    --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonbeam.yml
    ```

=== "Local File Path"
    ```
    npx @acala-network/chopsticks --config=configs/moonbeam.yml
    ```

!!! note
    If using a file path, make sure you've downloaded the [Moonbeam configuration file](https://github.com/AcalaNetwork/chopsticks/blob/master/configs/moonbeam.yml){target=_blank}, or have created your own.

A configuration file is not necessary, however. All of the settings (except `genesis` and `timestamp`) can also be passed as flags to configure the environment completely in the command line. For example, the following command forks Moonbase Alpha at block 100.

```
npx @acala-network/chopsticks --endpoint {{ networks.moonbase.rpc_url }} --block 100
```

### Quick Start {: #quickstart }

The simplest way to fork Moonbeam is through the configuration files that are stored in the Chopsticks GitHub repository:  

=== "Moonbeam"
    ```
    npx @acala-network/chopsticks \
    --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonbeam.yml
    ```

=== "Moonriver"
    ```
    npx @acala-network/chopsticks \
    --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonriver.yml
    ```

=== "Moonbase Alpha"
    ```
    npx @acala-network/chopsticks \
    --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonbase-alpha.yml
    ```

### 与分叉交互 {: #interacting-with-a-fork }

当您在运行分叉时，默认情况下，您可以在进行访问:

```
`ws://localhost:8000`
```

您将能够通过[Polkadot.js](https://github.com/polkadot-js/common){target=blank}等库及其[它的用户界面Polkadot.js Apps](https://github.com/polkadot-js/apps){target=_blank}与平行链进行交互。

您可以通过[Polkadot.js Apps用户界面](https://polkadot.js.org/apps/#/explorer){target=_blank}与Chopsticks交互。为此，请访问该页面并执行以下步骤

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

|           标志           |                          描述                          |
|:------------------------:|:------------------------------------------------------:|
|         `endpoint`         |                 进行分叉的平行链端点。                 |
|          `block`           |         用于指定重放分叉的区块哈希或是区块号。         |
|      `wasm-override`       |            用作平行链的WASM路径，而非端点。            |
|            `db`            |   导向至储存或是将会储存平行链数据库的文件名称路径。   |
|          `config`          |                 配置文件的路径或URL。                  |
| `output-path=/[file_path]` | 用于把结果打印至一个JSON文件中而非在终端中打印出结果。 |
|           `html`           |      包含此标志以生成区块之间存储差异预览的HTML。      |
|           `open`           |                   选择是否打开HTML。                   |

举例来说，运行以下命令将会重新运行Moonbeam的区块1000，并在`moonbeam-output.json`文件中写入存储差异和其他数据：

```
npx @acala-network/chopsticks run-block  \
--endpoint wss://wss.api.moonbeam.network  \
--output-path=./moonbeam-output.json  \
--block 1000
```

## XCM测试 {: #xcm-testing }

要在网络间测试XCM消息，您可以在本地分叉多个平行链和中继链。举例来说，假设你已经从的源Github repository下载了[`configs`文件夹](https://github.com/AcalaNetwork/chopsticks/tree/master/configs){target=_blank}，以下命令将会分叉Moonriver、Karura和Kusama：

```
npx @acala-network/chopsticks xcm \
--r=kusama.yml \
--p=moonriver.yml \
--p=karura.yml
```

您应当能看到类似于以下输出的内容：

```
[13:50:57.807] INFO (rpc/64805): Loading config file https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonriver.yml
[13:50:59.655] INFO (rpc/64805): Moonriver RPC listening on port 8000
[13:50:59.656] INFO (rpc/64805): Loading config file https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/karura.yml
[13:51:03.275] INFO (rpc/64805): Karura RPC listening on port 8001
[13:51:03.586] INFO (xcm/64805): Connected parachains [2000,2023]
[13:51:03.586] INFO (rpc/64805): Loading config file https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/kusama.yml
[13:51:07.241] INFO (rpc/64805): Kusama RPC listening on port 8002
[13:51:07.700] INFO (xcm/64805): Connected relaychain 'Kusama' with parachain 'Moonriver'
[13:51:08.386] INFO (xcm/64805): Connected relaychain 'Kusama' with parachain 'Karura'
```

Including the `r` flag as the relay chain is optional, as Chopsticks will automatically mock a relay chain between networks. You can also use a raw GitHub URL or the name of a popular branch, similar to the base command.

## WebSocket命令 {: #websocket-commands }

Chopsticks的内部websocket服务器有特殊的端点，允许操作本地Substrate链。这些是可以调用的方法：

|      方法      |       参数        |                    描述                    |
|:--------------:|:-----------------:|:------------------------------------------:|
|  `dev_newBlock`  |      `options`      |           生成一个或多个新区块。           |
| `dev_setStorage` | `values`, `blockHash` |          创建或覆盖任何存储的值。          |
| `dev_timeTravel` |       `date`        |       将区块的时间戳设置为`date`值。       |
|  `dev_setHead`   |   `hashOrNumber`    | 将区块链的块头设置为特定的哈希值或区块号。 |

The parameters above are formatted in the following ways:  

|   Parameter    |               Format                |                                Example                                 |
|:--------------:|:-----------------------------------:|:----------------------------------------------------------------------:|
|   `options`    | `{ "to": number, "count": number }` |                            `{ "count": 5 }`                            |
|    `values`    |              `Object`               | `{ "Sudo": { "Key": "0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b" } }`  |
|  `blockHash`   |              `string`               | `"0x1a34506b33e918a0106b100db027425a83681e2332fe311ee99d6156d2a91697"` |
|     `date`     |               `Date`                |                        `"2030-08-15T00:00:00"`                         |
| `hashOrNumber` |               `number               |                                string`                                 |

- **`options` { "to": number, "count": number }** - 可选，保留`null`以创建一个区块。使用`"to"`创建达到特定值的区块，使用`"count"`增加特定数量的区块 
- **`values` Object** - 类似于存储值路径的JSON对象，类似于您通过Polkadot.js检索的内容
- **`blockHash` string** - 可选，存储值发生变更的区块哈希
- **`date` string** - 一个日期字符串（与JavaScript日期库兼容），它将更改时间戳，从该时间戳开始创建下一个区块。所有未来的区块将在该时间点之后依次出现
- **`hashOrNumber` number | string** - 如果找到，链头将被设置为具有该值的区块号或区块哈希的区块

每个方法都可以通过连接到websocket（默认为`ws://localhost:8000`）并以以下格式发送数据和参数来调用。将`METHOD_NAME`替换为方法名称，将`PARAMETER_1`和`PARAMETER_2`替换或删除为与方法相关的参数数据：

```
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "METHOD_NAME",
    "params": [PARAMETER_1, PARAMETER_2...]
}
```

--8<-- 'text/disclaimers/third-party-content.md'