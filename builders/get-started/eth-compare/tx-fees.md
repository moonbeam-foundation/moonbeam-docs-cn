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

## Substrate API交易费用 {: #substrate-api-transaction-fees }

Moonbeam上通过Substrate API发送的交易费用可直接从Sidecar block JSON对象读取。嵌套结构如下所示：

```JSON
RESPONSE JSON Block Object:
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

|      交易信息      |                        JSON对象字段                         |
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

### 计算以太坊API交易费用 {: #calculating-ethereum-api-transaction-fees }

要计算通过以太坊API在Moonbeam交易产生的费用，可以使用以下计算公式：

=== "EIP-1559"
    ```
    Gas Price = Base Fee + Max Priority Fee Per Gas< Max Fee Per Gas ? 
                Base Fee + Max Priority Fee Per Gas: 
                Max Fee Per Gas;
    Transaction Fee = (Gas Price * Transaction Weight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```
=== "Legacy"
    ```
    Transaction Fee = (Gas Price * Transaction Weight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```
=== "EIP-2930"
    ```
    Transaction Fee = (Gas Price * Transaction Weight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```

随着Runtime 1900的推出，Sidecar API报告的内容与用于EVM交易费用的内容之间存在“Transaction Weight”不匹配。 因此，您需要将以下金额添加至“Transaction Weight”：

=== "Moonbeam"
    ```
    86298000
    ```
=== "Moonriver"
    ```
    86298000
    ```
=== "Moonbase Alpha"
    ```
    250000000
    ```

适用交易类型的`Gas Price`, `Max Fee Per Gas`和`Max Priority Fee Per Gas`值可以根据[Sidecar API页面](/builders/build/substrate-api/sidecar/#evm-fields-mapping-in-block-json-object){target=_blank}描述的结构从Block JSON对象读取，且被截短后复制在下方：

=== "EIP-1559"
    |         EVM字段          |                                 JSON对象字段                                 |
    |:------------------------:|:----------------------------------------------------------------------------:|
    |     Max Fee Per Gas      |     `extrinsics[extrinsic_number].args.transaction.eip1559.maxFeePerGas`     |
    | Max Priority Fee Per Gas | `extrinsics[extrinsic_number].args.transaction.eip1559.maxPriorityFeePerGas` |

=== "Legacy"
    |  EVM字段  |                          JSON对象字段                           |
    |:---------:|:---------------------------------------------------------------:|
    | Gas Price | `extrinsics[extrinsic_number].args.transaction.legacy.gasPrice` |

=== "EIP-2930"
    |  EVM字段  |                           JSON对象字段                           |
    |:---------:|:----------------------------------------------------------------:|
    | Gas Price | `extrinsics[extrinsic_number].args.transaction.eip2930.gasPrice` |

[EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank}中引入的`Base Fee`是由网络自设的一个值。`EIP1559`类型交易的`Base Fee`目前在Moonbeam网络上是静态的，并有以下指定的值：

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

`Transaction Weight`是一类Substrate机制，用于验证给定交易在一个区块内所需的执行时间。对于所有交易类型，`Transaction Weight`可以在相关extrinsic的事件下获取，其中`method`字段设置如下：

```
pallet: "system", method: "ExtrinsicSuccess" 
```

随后，`Transaction Weight`将被映射至Block JSON对象的以下字段中：

```
extrinsics[extrinsic_number].events[event_number].data[0].weight
```

!!! note
    请记住，Runtime190X存在`Transaction Weight`不匹配。您需要为它的值添加一个常量。查看[计算以太坊API交易费用](#calculating-ethereum-api-transaction-fees)了解更多信息。

### 与以太坊的关键性差异 {: #ethereum-api-transaction-fees}

如上所述，Moonbeam和以太坊上的交易费用模型有一些关键性的差异，开发者在Moonbeam上构建时需要注意以下部分：

  - Moonbeam网络上的网络基本费用目前是静态的。这可能有很多因素，其中之一是发送交易时设置的gas价格低于基本费用将导致交易失败，即使网络上的当前区块未满。这与以太坊不同，以太坊对要接受交易的gas价格没有限制。

    网络基本费用可能会在未来的Runtime更新中进行更新。

  - Moonbeam交易费用模型中使用的gas数量是通过固定比例{{ networks.moonbase.tx_weight_to_gas_ratio }}从交易的Substrate extrinsic权重值映射而来。通过此数值乘以单位gas价格来计算交易费用。此费用模型意味着通过以太坊API发送如基本转账等交易可能会比Substrate API更为便宜。

### 费用记录 端点 {: #eth-feehistory-endpoint }

Moonbeam网络实施[`eth_feeHistory`](https://docs.alchemy.com/reference/eth-feehistory){target_blank} JSON-RPC端点作为对EIP-1559支持的一部分。

`eth_feeHistory`返回一系列的历史gas信息，可供您参考和计算在提交EIP-1559交易时为`Max Fee Per Gas`和`Max Priority Fee Per Gas`字段设置的内容。

以下curl示例将使用`eth_feeHistory`返回从各自Moonbeam网络上的最新区块开始的最后10个区块的gas信息：

=== "Moonbeam"

    ```sh
    curl --location 
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
    curl --location 
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
    curl --location 
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
    curl --location 
         --request POST '{{ networks.development.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    ```

## 计算交易费用的示例代码 {: #sample-code }

以下代码片段使用[Axios HTTP客户端](https://axios-http.com/){target=_blank}来为最终区块查询[Sidecar端点`/blocks/head`](https://paritytech.github.io/substrate-api-sidecar/dist/){target=_blank}。随后，根据交易类型（以太坊API：legacy、EIP-1559或EIP-2930标准以及Substrate API）计算区块中所有交易的交易费用，以及区块中的总交易费用。

以下代码示例仅用于演示目的，代码需进行修改并进一步测试后才可正式用于生产环境。

--8<-- 'code/vs-ethereum/tx-fees-block.md'

--8<-- 'text/disclaimers/third-party-content.md'
