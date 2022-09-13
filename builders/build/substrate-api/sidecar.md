---
title: 在Moonbeam上使用Substrate API Sidecar
description: 了解如何使用基于Substrate的REST服务在Moonbeam网络上来查询区块、账户余额、计算交易费用等。
---

# 在Moonbeam上使用Substrate API Sidecar

![Substrate API Sidecar](/images/builders/build/substrate-api/sidecar/sidecar-banner.png)

## 概览 {: #introduction } 

Substrate API Sidecar允许应用程序通过REST API访问基于Substrate区块链的区块、账户余额和其他信息。这对于需要在Moonbeam网络上持续追踪账户余额和其他状态更新的交易所、钱包或其他类型的应用程序非常有用。本文将介绍如何为Moonbeam安装和运行Substrate API Sidecar，以及常用API端点。

## 安装和运行Substrate API Sidecar {: #installing-and-running-substrate-api-sidecar } 

有多种方式可以安装和运行Substrate API Sidecar。本教程将介绍通过NPM在本地安装和运行Substrate API Sidecar。通过Docker运行或从源代码构建和运行Substrate API Sidecar，请参考[Substrate API Sidecar Github Repository](https://github.com/paritytech/substrate-api-sidecar#readme)。

### 查看先决条件 {: #checking-prerequisites }

通过NPM在本地运行此服务需要先安装node.js。

--8<-- 'text/common/install-nodejs.md'

### 安装Substrate API Sidecar {: #installing-the-substrate-api-sidecar }

在当前目录下本地安装Substrate API Sidecar服务，请在命令行运行以下命令：

```
npm install @substrate/api-sidecar@{{ networks.moonbase.substrate_api_sidecar.stable_version }}
```

!!!注意事项
     如果当前目录还没有Node.js项目结构，则需要先执行`mkdir node_modules`，手动创建`node_modules`目录。

Substrate API Sidecar v{{ networks.moonbase.substrate_api_sidecar.stable_version }}是当前经过测试过可与Moonbeam网络共同使用的稳定版本。您可以通过在安装的根目录运行以下命令来验证是否成功安装：

```
node_modules/.bin/substrate-api-sidecar --version
```

## 设置Substrate API Sidecar {: #setting-up-the-substrate-api-sidecar }

在Sidecar将运行的终端中，导出网络WS端点的环境变量，例如：

=== "Moonbeam"
    ```
    export SAS_SUBSTRATE_WS_URL=wss://wss.api.moonbeam.network
    ```

=== "Moonriver"
    ```
    export SAS_SUBSTRATE_WS_URL=wss://wss.api.moonriver.moonbeam.network
    ```

=== "Moonbase Alpha"
    ```
    export SAS_SUBSTRATE_WS_URL=wss://wss.api.moonbase.moonbeam.network
    ```

=== "Moonbeam开发节点"
    ```
    export SAS_SUBSTRATE_WS_URL=ws://127.0.0.1:9944
    ```

请参考[公共端点](/builders/get-started/endpoints/)页面获取Moonbeam网络端点完整列表。

设置环境变量后，您可以使用`echo`命令，运行以下命令检查环境变量是否正确设置：

```
echo $SAS_SUBSTRATE_WS_URL
```

这将显示您设置的网络端点。

## 运行Substrate API Sidecar {: #running-substrate-api-sidecar } 

根据设置的网络端点环境变量，在安装的根目录运行以下命令：

```
node_modules/.bin/substrate-api-sidecar 
```

如果安装和配置成功后，您应该在后台看到以下输出：

![Successful Output](/images/builders/build/substrate-api/sidecar/sidecar-1.png)

## Substrate API Sidecar端点 {: #substrate-api-sidecar-endpoints } 

常用的Substrate API Sidecar端点包括：

 - **GET /blocks/head** —— 获取最近确定的区块。可选参数`finalized`可设置为`false`以获取最新已知区块（该区块可能尚未被最终确定）
 - **GET /blocks/head/header** —— 获取最近确定的区块头。可选参数`finalized`可设置为`false`以获取最新已知区块头（该区块头可能尚未被最终确定）
 - **GET /blocks/{blockId}** —— 通过区块的高度或哈希获取该区块
 - **GET /accounts/{accountId}/balance-info** —— 获取账户的余额信息
 - **GET /node/version** —— 获取关于Substrates节点实现和版本控制的信息
 - **GET /runtime/metadata** —— 以解码的JSON格式获取runtime元数据

请参考[官方资料库](https://paritytech.github.io/substrate-api-sidecar/dist/)获取Substrate API Sidecar上的可用API端点列表。

## 区块JSON对象中的EVM字段映射 {: #evm-fields-mapping-in-block-json-object }

Substrate API Sidecar将Moonbeam区块作为JSON对象返回。与Moonbeam交易的EVM执行相关信息位于`extrinsics`顶级字段下，其中个人extrinsics以数字方式组织为嵌套的JSON对象。嵌套结构如下所示：

```JSON
RESPONSE JSON Block Object:
    |--extrinsics
        |--{extrinsic number}
            |--method
                |--pallet: "ethereum"
                |--method: "transact"
            |--signature:
            |--nonce: 
            |--args
                |--transaction
                    |--{transaction type}
            |--hash
            |--events
                |--{event number}
                    |--method
                        |--pallet: "ethereum"
                        |--method: "Executed"
                    |--data
                        |--0
                        |--1
                        |--2
                        |--3
    ...

```

Moonbeam EVM交易可以通过在当前extrinsic对象下的`method`字段进行验证，`method`字段可设置为：

```
{extrinsic number}.method.pallet = "ethereum"
{extrinsic number}.method.method = "transact"
```

### 交易类型和负载 {: #transaction-types-and-payload }

Moonbeam EVM目前支持3种交易标准：`legacy`、 `eip1559`和`eip2930`。这些对应上述JSON对象示意图中的`transaction type`字段。每个交易类型的交易负载包含以下字段：

=== "EIP1559"
    ```JSON
        ...
        |--eip1559
            |--chainId
            |--nonce
            |--maxPriorityFeePerGas
            |--maxFeePerGas
            |--gasLimit
            |--action
            |--value
            |--input
            |--accessList
            |--oddYParity
            |--r
            |--s      
        ...
    ```

=== "Legacy"
    ```JSON
        ...
        |--legacy
            |--nonce
            |--gasPrice
            |--gasLimit
            |--action
            |--value
            |--input
            |--signature       
        ...
    ```

=== "EIP2930"
    ```JSON
        ...
        |--eip2930
            |--chainId
            |--nonce
            |--gasPrice
            |--gasLimit
            |--action
            |--value
            |--input
            |--accessList 
            |--oddYParity
            |--r
            |--s      
        ...
    ```

想要获取关于新的[EIP1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank}和[EIP2930](https://eips.ethereum.org/EIPS/eip-2930){target=_blank}交易类型更多信息，及其每个字段的含义，请参考各自的官方以太坊提案。

### 交易字段映射 {: #transaction-field-mappings }

要获取EVM发送方地址、接收方地址，以及任何EVM交易类型的EVM哈希，检查在当前extrinsic对象下的`events`字段并验证`method`字段已设置为：

```
{event number}.method.pallet: "ethereum"
{event number}.method.method: "Executed" 
```

然后将EVM字段映射总结为如下所示：

=== "EIP1559"
    |        EVM Field         |                               Block JSON Field                                |
    |:------------------------:|:-----------------------------------------------------------------------------:|
    |         Chain ID         |       `extrinsics.{extrinsic number}.args.transaction.eip1559.chainId`        |
    |          Nonce           |        `extrinsics.{extrinsic number}.args.transaction.eip1559.nonce`         |
    | Max Priority Fee Per Gas | `extrinsics.{extrinsic number}.args.transaction.eip1559.maxPriorityFeePerGas` |
    |     Max Fee Per Gas      |     `extrinsics.{extrinsic number}.args.transaction.eip1559.maxFeePerGas`     |
    |        Gas Limit         |       `extrinsics.{extrinsic number}.args.transaction.eip1559.gasLimit`       |
    |       Access List        |      `extrinsics.{extrinsic number}.args.transaction.eip1559.accessList`      |
    |        Signature         |    `extrinsics.{extrinsic number}.args.transaction.eip1559.oddYParity/r/s`    |
    |      Sender Address      |         `extrinsics.{extrinsic number}.events.{event number}.data.0`          |
    |    Recipient Address     |         `extrinsics.{extrinsic number}.events.{event number}.data.1`          |
    |         EVM Hash         |         `extrinsics.{extrinsic number}.events.{event number}.data.2`          |
    |   EVM Execution Status   |         `extrinsics.{extrinsic number}.events.{event number}.data.3`          |

=== "Legacy"
    |      EVM Field       |                         Block JSON Field                          |
    |:--------------------:|:-----------------------------------------------------------------:|
    |        Nonce         |   `extrinsics.{extrinsic number}.args.transaction.legacy.nonce`   |
    |      Gas Price       | `extrinsics.{extrinsic number}.args.transaction.legacy.gasPrice`  |
    |      Gas Limit       | `extrinsics.{extrinsic number}.args.transaction.legacy.gasLimit`  |
    |        Value         |   `extrinsics.{extrinsic number}.args.transaction.legacy.value`   |
    |      Signature       | `extrinsics.{extrinsic number}.args.transaction.legacy.signature` |
    |    Sender Address    |   `extrinsics.{extrinsic number}.events.{event number}.data.0`    |
    |  Recipient Address   |   `extrinsics.{extrinsic number}.events.{event number}.data.1`    |
    |       EVM Hash       |   `extrinsics.{extrinsic number}.events.{event number}.data.2`    |
    | EVM Execution Status |   `extrinsics.{extrinsic number}.events.{event number}.data.3`    |

=== "EIP2930"
    |      EVM Field       |                            Block JSON Field                             |
    |:--------------------:|:-----------------------------------------------------------------------:|
    |       Chain ID       |    `extrinsics.{extrinsic number}.args.transaction.eip2930.chainId`     |
    |        Nonce         |     `extrinsics.{extrinsic number}.args.transaction.eip2930.nonce`      |
    |       GasPrice       |    `extrinsics.{extrinsic number}.args.transaction.eip2930.gasPrice`    |
    |       GasLimit       |    `extrinsics.{extrinsic number}.args.transaction.eip2930.gasLimit`    |
    |        Value         |     `extrinsics.{extrinsic number}.args.transaction.eip2930.value`      |
    |     Access List      |   `extrinsics.{extrinsic number}.args.transaction.eip2930.accessList`   |
    |      Signature       | `extrinsics.{extrinsic number}.args.transaction.eip2930.oddYParity/r/s` |
    |    Sender Address    |      `extrinsics.{extrinsic number}.events.{event number}.data.0`       |
    |  Recipient Address   |      `extrinsics.{extrinsic number}.events.{event number}.data.1`       |
    |       EVM Hash       |      `extrinsics.{extrinsic number}.events.{event number}.data.2`       |
    | EVM Execution Status |      `extrinsics.{extrinsic number}.events.{event number}.data.3`       |

!!! 注意事项
    EVM交易号和签名字段位于`extrinsics.{extrinsic number}.args.transaction.{transaction type}`，而`extrinsics.{extrinsic number}`下的`nonce`和`signature`字段是Substrate交易号和签名，需为EVM交易设置为`null`。

    成功执行的EVM交易将在"EVM Execution Status"字段下返回`succeed: "Stopped"`或`succeed: "Returned"`。

### ERC-20代币转账 {: #erc-20-token-transfers }

智能合约（例如部署在Moonbeam上的ERC-20合约）发出的事件可以从Sidecar区块的JSON对象中解码。它的嵌套结构如下：

```JSON
RESPONSE JSON Block Object:
    |--extrinsics
        |--{extrinsic number}
            |--method
                |--pallet: "ethereum"
                |--method: "transact"
            |--signature:
            |--nonce: 
            |--args
                |--transaction
                    |--{transaction type}
            |--hash
            |--events
                |--{event number}
                    |--method
                        |--pallet: "evm"
                        |--method: "Log"
                    |--data
                        |--0
                            |-- address
                            |-- topics
                                |--0
                                |--1
                                |--2
					        |-- data
            ...
    ...

```

Moonbeam ERC-20代币转账所发出的[`Transfer`](https://eips.ethereum.org/EIPS/eip-20){target=_blank}事件，可解码如下：


|     交易信息      |                           对应JSON字段                            |
|:-----------------------:|:---------------------------------------------------------------------:|
| ERC-20合约地址 | `extrinsics.{extrinsic number}.events.{event number}.data.0.address`  |
|  事件签名哈希   | `extrinsics.{extrinsic number}.events.{event number}.data.0.topics.0` |
|     发送人地址      | `extrinsics.{extrinsic number}.events.{event number}.data.0.topics.1` |
|    接纳人地址    | `extrinsics.{extrinsic number}.events.{event number}.data.0.topics.2` |
|         数额          |   `extrinsics.{extrinsic number}.events.{event number}.data.0.data`   |

EVM智能合约发出的其他事件也可以以类似的方式进行解码，但事件主题和JSON字段的内容将根据事件的定义而改变。

!!! 注意事项
    转账金额以Wei和十六进制格式给出。 


### 计算Gas花费 {: #computing-gas-used } 

要计算EVM交易执行期间的Gas花费或费用，可使用以下计算公式：

=== "EIP1559"
    ```
    Gas Used =（Base Fee + Max Priority Fee Per Gas) * Transaction Weight / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```
=== "Legacy"
    ```
    Gas Used = Gas Price * Transaction Weight / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```
=== "EIP2930"
    ```
    Gas Used = Gas Price * Transaction Weight / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```

适用交易类型的`Gas Price`和`Max Priority Fee Per Gas`数值可以根据上述表格从区块中读取。

EIP-1559引入的`Base Fee`由网络自身决定。`EIP1559`类型交易的`Base Fee`目前在Moonbeam网络上为固定值，如下所示：

=== "Moonbeam"
    |   变量   |    值    |
    |:--------:|:--------:|
    | Base Fee | 100 Gwei |

=== "Moonriver"
    |   变量   |   值   |
    |:--------:|:------:|
    | Base Fee | 1 Gwei |

=== "Moonbase Alpha"
    |   变量   |   值   |
    |:--------:|:------:|
    | Base Fee | 1 Gwei |

`Transaction Weight`是一种Substrate机制，用于管理验证区块所需的时间。对于所有的交易类型，`Transaction Weight`可以通过在相关extrinsic事件下的`method`进行如下设置以检索获得：

```
pallet: "system", method: "ExtrinsicSuccess" 
```

随后，`Transaction Weight`将映射至区块JSON对象的以下字段：

```
extrinsics.{extrinsic number}.events.{event number}.data.0.weight
```

--8<-- 'text/disclaimers/third-party-content.md'