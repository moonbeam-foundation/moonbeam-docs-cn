---
title: 计算交易费用
description: 学习在Moonbeam上的交易费用模型以及开发者需要知道的与以太坊的不同之处。
---

# 计算Moonbeam上的交易费用

![Transaction Fees Banner](/images/builders/get-started/eth-compare/tx-fees-banner.png)

## 概览 {: #introduction }

与Moonbeam上[用于发送转账的以太坊和Substrate API](/builders/get-started/eth-compare/transfers-api/){target=_blank}类似，Moonbeam上的Substrate和EVM也有不同的交易费用模型，开发者应知道何时需要计算和继续追踪其交易的交易费用。

本教程假设您通过[Substrate API Sidecar](/builders/build/substrate-api/sidecar/){target=_blank}服务与Moonbeam区块交互。也有其他与Moonbeam区块交互的方式，例如使用[Polkadot.js API library](/builders/build/substrate-api/polkadot-js-api/){target=_blank}。检索区块后，两种方式的逻辑都是相同的。

您可以参考[Substrate API Sidecar页面](/builders/build/substrate-api/sidecar/){target=_blank}获取关于安装和运行自己的Sidecar服务实例，以及如何为Moonbeam交易编码Sidecar区块的更多细节。

**请注意，此页面信息假定您运行的是版本{{ networks.moonbase.substrate_api_sidecar.stable_version }} 的Substrate Sidecar REST API。**

## Substrate API交易费用 {: #substrate-api-transaction-fees }

所有关于通过Substrate API发送的交易费用数据的信息都可以从以下区块端点中提取：

```
GET /blocks/{blockId}
```

区块端点将返回与一个或多个区块相关的数据。您可以在[Sidecar官方文档](https://paritytech.github.io/substrate-api-sidecar/dist/#operations-tag-blocks){target=_blank}上阅读有关区块端点的更多信息。读取结果为JSON对象，相关嵌套结构如下所示：

```JSON
RESPONSE JSON Block Object:
    ...
    |--number
    |--extrinsics
        |--{extrinsic_number}
            |--method
            |--signature
            |--nonce
            |--args
            |--tip           
            |--hash
            |--info
            |--era
            |--events
                |--{event_number}
                    |--method
                        |--pallet: "transactionPayment"
                        |--method: "TransactionFeePaid"
                    |--data
                        |--0
                        |--1
                        |--2
    ...

```

对象映射总结如下：

|      交易信息      |                          JSON对象字段                         |
|:------------------:|:-----------------------------------------------------------:|
| Fee paying account | `extrinsics[extrinsic_number].events[event_number].data[0]` |
|  Total fees paid   | `extrinsics[extrinsic_number].events[event_number].data[1]` |
|        Tip         | `extrinsics[extrinsic_number].events[event_number].data[2]` |

交易费用相关信息可以在相关extrinsic的事件下获取，其中`method`字段设置如下：

```
pallet: "transactionPayment", method: "TransactionFeePaid" 
```

随后，将用于支付此extrinsic的总交易费用映射至Block JSON对象的以下字段中：

```
extrinsics[extrinsic_number].events[event_number].data[1]
```

## 以太坊API交易费用 {: #ethereum-api-transaction-fees }

要计算通过以太坊API在Moonbeam交易产生的费用，可以使用以下计算公式：

=== "EIP-1559"
    ```
    GasPrice = BaseFee + MaxPriorityFeePerGas < MaxFeePerGas ? 
                BaseFee + MaxPriorityFeePerGas : 
                MaxFeePerGas;
    Transaction Fee = (GasPrice * TransactionWeight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```
=== "Legacy"
    ```
    Transaction Fee = (GasPrice * TransactionWeight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```
=== "EIP-2930"
    ```
    Transaction Fee = (GasPrice * TransactionWeight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```

以下部分更详细地描述了计算交易费用的每个组成部分。

### 基础费用 {: #base-fee}

[EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank}中引入的`Base Fee`是由网络自设的一个值。Moonbeam有自己的[动态费用机制](https://forum.moonbeam.foundation/t/proposal-status-idea-dynamic-fee-mechanism-for-moonbeam-and-moonriver/241){target=_blank}计算基础费用，它是根据区块拥塞情况来进行调整。从runtime 2300（运行时2300）开始，动态费用机制已推广到所有基于Moonbeam的网络。

每个网络的最低汽油价格（Minimum Gas Price）如下：

=== "Moonbeam"
    |        变量       |    值     |
    |:-----------------:|:--------:|
    | Minimum Gas Price | 125 Gwei |

=== "Moonriver"
    |        变量       |     值     |
    |:-----------------:|:---------:|
    | Minimum Gas Price | 1.25 Gwei |

=== "Moonbase Alpha"
    |        变量       |      值     |
    |:-----------------:|:----------:|
    | Minimum Gas Price | 0.125 Gwei |

要计算动态基本费用，请使用以下计算：

=== "Moonbeam"

    ```
    BaseFee = NextFeeMultiplier * 125000000000 / 10^18
    ```

=== "Moonriver"

    ```
    BaseFee = NextFeeMultiplier * 1250000000 / 10^18
    ```

=== "Moonbase Alpha"

    ```
    BaseFee = NextFeeMultiplier * 125000000 / 10^18
    ```

通过以下端点，可以从Substrate Sidecar API检索`NextFeeMultiplier`的值：

```
GET /pallets/transaction-payment/storage/nextFeeMultiplier?at={blockId}
```

Sidecar的pallet端点返回与pallet相关的数据，例如pallet存储中的数据。您可以在[Sidecar官方文档](https://paritytech.github.io/substrate-api-sidecar/dist/#operations-tag-pallets){target=_blank}中阅读更多关于pallet端点的信息。需要从存储中获取的手头数据是`nextFeeMultiplier`，它可以在`transaction-payment` pallet中找到。存储的`nextFeeMultiplier`值可以直接从Sidecar存储结构中读取。读取结果为JSON对象，相关嵌套结构如下：

```JSON
RESPONSE JSON Storage Object:
    |--at
        |--hash
        |--height
    |--pallet
    |--palletIndex
    |--storageItem
    |--keys
    |--value
```

相关数据将存储在JSON对象的`value`键中。该值是定点数据类型，因此实际值是通过将`value`除以`10^18`得到的。这就是为什么[`BaseFee`的计算](#ethereum-api-transaction-fees)包括这样的操作。

### GasPrice，MaxFeePerGas和MaxPriorityFeePerGas {: #gasprice-maxfeepergas-maxpriorityfeepergas }

适用交易类型的`GasPrice`, `MaxFeePerGas`和`MaxPriorityFeePerGas`的值可以根据[Sidecar API页面](/builders/build/substrate-api/sidecar/#evm-fields-mapping-in-block-json-object){target=_blank}描述的结构从Block JSON对象读取，特定区块中以太坊交易的数据可以从以下区块端点中提取：

```
GET /blocks/{blockId}
```

相关值的路径也被截短后复制在下方：

=== "EIP-1559"
    |        EVM字段        |                                 JSON对象字段                                 |
    |:--------------------:|:----------------------------------------------------------------------------:|
    |     MaxFeePerGas     |     `extrinsics[extrinsic_number].args.transaction.eip1559.maxFeePerGas`     |
    | MaxPriorityFeePerGas | `extrinsics[extrinsic_number].args.transaction.eip1559.maxPriorityFeePerGas` |

=== "Legacy"
    |  EVM字段  |                          JSON对象字段                           |
    |:---------:|:---------------------------------------------------------------:|
    | GasPrice  | `extrinsics[extrinsic_number].args.transaction.legacy.gasPrice` |

=== "EIP-2930"
    |  EVM字段  |                           JSON对象字段                           |
    |:---------:|:----------------------------------------------------------------:|
    | GasPrice  | `extrinsics[extrinsic_number].args.transaction.eip2930.gasPrice` |

### 交易权重 {: #transaction-weight}

`TransactionWeight`是一类Substrate机制，用于衡量给定交易在一个区块内执行所需的执行时间。对于所有交易类型，`TransactionWeight`可以在相关extrinsic的事件下获取，其中`method`字段设置如下：

```
pallet: "system", method: "ExtrinsicSuccess" 
```

随后，`TransactionWeight`将被映射至Block JSON对象的以下字段中：

```
extrinsics[extrinsic_number].events[event_number].data[0].weight
```

### 与以太坊的关键性差异 {: #ethereum-api-transaction-fees}

如上所述，Moonbeam和以太坊上的交易费用模型有一些关键性的差异，开发者在Moonbeam上构建时需要注意以下部分：

  - [动态费用机制](https://forum.moonbeam.foundation/t/proposal-status-idea-dynamic-fee-mechanism-for-moonbeam-and-moonriver/241){target=_blank}类似于[EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank}，但实现不同

  - Moonbeam交易费用模型中使用的gas数量是通过固定比例{{ networks.moonbase.tx_weight_to_gas_ratio }}从交易的Substrate extrinsic权重值映射而来。通过此数值乘以单位gas价格来计算交易费用。此费用模型意味着通过以太坊API发送如基本转账等交易可能会比Substrate API更为便宜。

### 费用记录端点 {: #eth-feehistory-endpoint }

Moonbeam网络实施[`eth_feeHistory`](https://docs.alchemy.com/reference/eth-feehistory){target_blank} JSON-RPC端点作为对EIP-1559支持的一部分。

`eth_feeHistory`返回一系列的历史gas信息，可供您参考和计算在提交EIP-1559交易时为`MaxFeePerGas`和`MaxPriorityFeePerGas`字段设置的内容。

以下curl示例将使用`eth_feeHistory`返回从各自Moonbeam网络上的最新区块开始的最后10个区块的gas信息：

=== "Moonbeam"
    ```sh
    curl --location \
         --request POST '{{ networks.moonbeam.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    ```
=== "Moonriver"
    ```sh
    curl --location \
         --request POST '{{ networks.moonriver.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    ```
=== "Moonbase Alpha"
    ```sh
    curl --location \
         --request POST '{{ networks.moonbase.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    ```
=== "Moonbeam开发节点"
    ```sh
    curl --location \
         --request POST '{{ networks.development.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    ```

### 计算交易费用的示例代码 {: #sample-code }

以下代码片段使用[Axios HTTP客户端](https://axios-http.com/){target=_blank}来为最终区块查询[Sidecar端点`/blocks/head`](https://paritytech.github.io/substrate-api-sidecar/dist/#operations-tag-blocks){target=_blank}。随后，根据交易类型（以太坊API：legacy、EIP-1559或EIP-2930标准以及Substrate API）计算区块中所有交易的交易费用，以及区块中的总交易费用。

以下代码示例仅用于演示目的，代码需进行修改并进一步测试后才可正式用于生产环境。

您可以将以下代码片段用于任何基于Moonbeam的网络，但您需要相应地修改`baseFee`。您可以参考[基本费用](#base-fee)部分以获取每个网络的计算结果。

--8<-- 'code/vs-ethereum/tx-fees-block-dynamic.md'

--8<-- 'text/disclaimers/third-party-content.md'
