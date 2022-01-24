---
title: Substrate API Sidecar
description: 如何在Moonbeam网络上使用基于Substrate的REST服务
---

# 在Moonbeam上使用Substrate API Sidecar

![Substrate API Sidecar](/images/builders/tools/sidecar/sidecar-banner.png)

## 概览 {: #introduction }

Substrate API Sidecar允许应用程序通过REST API访问基于Substrate区块链的区块、账户余额和其他信息。这对于需要在Moonbeam网络上持续追踪账户余额和其他状态更新的交易所、钱包或其他类型的应用程序非常有用。本文将介绍如何为Moonbeam安装和运行Substrate API Sidecar，以及常用API端点。

## 安装和运行Substrate API Sidecar {: #installing-and-running-substrate-api-sidecar } 

有多种方式可以安装和运行Substrate API Sidecar。本教程将介绍通过NPM在本地安装和运行Substrate API Sidecar。通过Docker运行或源代码构建和运行Substrate API Sidecar，请参考[Substrate API Sidecar Github Repository](https://github.com/paritytech/substrate-api-sidecar#readme)。

### 查看先决条件 {: #checking-prerequisites }

通过NPM在本地运行此服务需要先安装node.js。

--8<-- 'text/common/install-nodejs.md'

#### 安装Substrate API Sidecar {: #installing-the-substrate-api-sidecar }

在当前代码库安装Substrate API Sidecar服务，请在命令行运行以下命令：

```
npm install @substrate/api-sidecar@{{ networks.moonbase.substrate_api_sidecar.stable_version }}
```

Substrate API Sidecar v{{ networks.moonbase.substrate_api_sidecar.stable_version }}是当前已测试过可与Moonbeam网络共同使用的稳定版本。您可以通过在安装的根目录运行以下命令来验证是否成功安装。

```
node_modules/.bin/substrate-api-sidecar --version
```

## 设置Substrate API Sidecar {: #setting-up-the-substrate-api-sidecar }

在Sidecar将运行的终端中，导出网络WS端点的环境变量，例如：

=== "Moonriver"
    ```
    export SAS_SUBSTRATE_WS_URL=wss://wss.moonriver.moonbeam.network
    ```

=== "Moonbase Alpha"
    ```
    export SAS_SUBSTRATE_WS_URL=wss://wss.testnet.moonbeam.network
    ```

=== "Moonbeam Dev Node"
    ```
    export SAS_SUBSTRATE_WS_URL=ws://127.0.0.1:9944
    ```

请参考[公共端点](/builders/get-started/endpoints/)页面获取Moonbeam网络端口完整列表。

设置环境变量后，您可以使用`echo`命令，运行以下命令检查环境变量是否正确设置：

```
echo $SAS_SUBSTRATE_WS_URL
```

这将显示您设置的网络端点。

## 运行Substrate API Sidecar {: #running-substrate-api-sidecar }

根据您设置的网络端点环境变量，在安装的根目录运行以下命令：

```
node_modules/.bin/substrate-api-sidecar 
```

如果安装和配置成功后，您应该在后台看到以下输出：

![Successful Output](/images/builders/tools/sidecar/sidecar-1.png)

## Substrate API Sidecar端点 {: #substrate-api-sidecar-endpoints }

常用的Substrate API Sidecar端点包括：

 - **GET /blocks/head** —— 获取最近确定的区块。可选参数`finalized`可设置为`false`以获取最新已知区块（该块可能尚未被最终确定）
 - **GET /blocks/head/header** —— 获取最近确定的区块头。可选参数`finalized`可设置为`false`以获取最新已知区块头（该块可能尚未被最终确定）
 - **GET /blocks/{blockId}** —— 通过区块的高度或哈希获取该区块
 - **GET /accounts/{accountId}/balance-info** —— 获取账户的余额信息
 - **GET /node/version** —— 获取关于Substrates节点实现和版本控制的信息
 - **GET /runtime/metadata** —— 以解码的JSON格式获取runtime原数据

请参考[官方资料库](https://paritytech.github.io/substrate-api-sidecar/dist/)获取Substrate API Sidecar上的可用API列表。

## 区块JSON对象中的EVM字段映射 {: #evm-fields-mapping-in-block-json-object}

Substrate API Sidecar将Moonbeam区块作为JSON对象返回。与Moonbeam交易的EVM执行相关信息位于`extrinsics`顶级字段下，其中个人外部函数以数字方式组织为嵌套的JSON对象。嵌套结构如下所示：

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
                    |--nonce
                    |--gasPrice
                    |--gasLimit
                    |--signature
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

Moonbeam EVM交易可以通过在当前外部函数对象下的`method`字段进行验证，`method`字段可设置为：

```
{extrinsic number}.method.pallet = "ethereum"
{extrinsic number}.method.method = "transact"
```

要获取EVM发送方地址、接收方地址、EVM哈希，检查在当前外部函数对象下的`events`字段并验证`method`字段已设置为：

```
{event number}.method.pallet: "ethereum"
{event number}.method.method: "Executed" 
```

然后将EVM字段映射总结为如下所示：

| EVM Field              | Block JSON Field                                           |
| ---------------------- | ---------------------------------------------------------- |
| `Nonce`                | extrinsics.{extrinsic number}.args.transaction.nonce       |
| `GasPrice`             | extrinsics.{extrinsic number}.args.transaction.gasPrice    |
| `GasLimit`             | extrinsics.{extrinsic number}.args.transaction.gasLimit    |
| `Signature`            | extrinsics.{extrinsic number}.args.transaction.signature   |
| `Sender Address`       | extrinsics.{extrinsic number}.events.{event number}.data.0 |
| `Recipient Address`    | extrinsics.{extrinsic number}.events.{event number}.data.1 |
| `EVM Hash`             | extrinsics.{extrinsic number}.events.{event number}.data.2 |
| `EVM Execution Status` | extrinsics.{extrinsic number}.events.{event number}.data.3 |

!!! 注意事项
    EVM交易的交易号和签名字段位于`extrinsics.{extrinsic number}.args.transaction`，而`extrinsics.{extrinsic number}`下的`nonce`和`signature`字段是 Substrate交易的交易号和签名，需为EVM交易设置为`null`。


### 计算Gas花费 {: #computing-gas-used }

要计算EVM交易执行期间的Gas花费或费用，可使用以下计算公式：

```
GasPrice * Tx Weight / {{ networks.moonbase.tx_weight_to_gas_ratio }}
```

其中GasPrice可以根据上表从区块中读取，Tx Weight可以通过在相关外部函数的事件下的`method`字段进行如下设置检索获得：

```
pallet: "system", method: "ExtrinsicSuccess" 
```

Tx Weight映射到区块JSON对象的以下字段：

```
extrinsics.{extrinsic number}.events.{event number}.data.0.weight
```
