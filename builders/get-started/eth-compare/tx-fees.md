---
title: 计算交易费用
description: 学习在Moonbeam上的交易费用模型以及开发者需要知道的与以太坊的不同之处。
---

# 计算Moonbeam上的交易费用

## 概览 {: #introduction }

与Moonbeam上[用于发送转账的以太坊和Substrate API](/builders/get-started/eth-compare/transfers-api/){target=\_blank}类似，Moonbeam上的Substrate和EVM也有不同的交易费用模型，开发者应知道何时需要计算和继续追踪其交易的交易费用。

首先，以太坊上的交易都会消耗gas，gas是根据交易的复杂性和数据存储需求计算得出的。与之相对，Substrate交易使用“weight”这个概念来计算交易费用。在本教程中，您将学习如何计算Substrate和以太坊的交易费用。在以太坊的部分您还会学到Moonbeam与以太坊在交易费计算上的关键差异。

### Moonbeam与以太坊的主要差异 {: #key-differences-with-ethereum}

Moonbeam和以太坊的交易费计算模型有一些主要差异，开发者在开发Moonbeam时应当注意这些不同：

  - [动态交易费机制{](https://forum.moonbeam.foundation/t/proposal-status-idea-dynamic-fee-mechanism-for-moonbeam-and-moonriver/241){target=\_blank}与[EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=\_blank}类似，但实现方式不同。

  - Moonbeam交易费计算模型中使用的gas是通过Substrate extrinsic weight计算得来。首先将Substrate extrinsic weight数值映射为 {{ networks.moonbase.tx_weight_to_gas_ratio }} 的固定因子，计算得出交易的gas unit; 然后将该值与单位价格相乘来计算总gas费用。这个费用模型意味着通过以太坊API实现基本交易，比如转账，可能会比通过Substrate API更便宜。

  - 与EVM不同，除gas之外Moonbeam交易还包含一些其他指标，其中很重要的一个就是proof size。Proof size是中继链验证节点验证Moonbeam state变换时所需的存储空间。当一个交易的proof size超过限制（区块proof size的25%）时，该交易将抛出“Out of Gas”错误（即便 gasometer 中还有剩余gas）。此附加指标还会影响交易的退款（refund）。Moonbeam的退款是根据交易执行后使用最多的资源计算得出，如果一个交易消耗的proof size大于残留的gas，则退款数额将基于proof size计算。

  - Moonbeam实现了[MBIP-5](https://github.com/moonbeam-foundation/moonbeam/blob/master/MBIPS/MBIP-5.md){target=\_blank}中定义的一个新机制，该机制限制了区块能使用的存储上限，并且如果一个交易会造成存储数据增加，那它将需要支付更多gas

## MBIP-5概述 {: #overview-of-mbip-5 }

MBIP-5 是一个为了更好应对网络存储增长而提出的关于Moonbeam交易费机制的改动。与以太坊不同，MBIP-5 通过提高特定交易的gas以及限制单个区块的储存总量来控制网络存储增长速度。

这个提案将影响以下三类交易：合约部署（导致链上state增加）；创建新存储条目的交易；以及创建新帐户的预编译合约调用。

区块存储上限限制了单个区块中所有交易造成储存量增长的总和，对应不同网络这个值为：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.mbip_5.block_storage_limit }}KB
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.mbip_5.block_storage_limit }}KB
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.mbip_5.block_storage_limit }}KB
    ```

储存单位（bytes）与gas的转换率为：

```text
转化率 = 区块gas上限 / (区块储存上限 * 1024 Bytes)
```

不同网络对应的区块gas上限为：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.gas_block }}
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.gas_block }}
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.gas_block }}
    ```

已知区块的gas与储存上限，我们可以利用以下公式来计算gas与储存的比率：

=== "Moonbeam"

    ```text
    比率 = {{ networks.moonbeam.gas_block_numbers_only }} / ({{ networks.moonbeam.mbip_5.block_storage_limit }} * 1024)
    比率 = {{ networks.moonbeam.mbip_5.gas_storage_ratio }} 
    ```

=== "Moonriver"

    ```text
    比率 = {{ networks.moonriver.gas_block_numbers_only }} / ({{ networks.moonriver.mbip_5.block_storage_limit }} * 1024)
    比率 = {{ networks.moonriver.mbip_5.gas_storage_ratio }} 
    ```

=== "Moonbase Alpha"

    ```text
    比率 = {{ networks.moonbase.gas_block_numbers_only }} / ({{ networks.moonbase.mbip_5.block_storage_limit }} * 1024)
    比率 = {{ networks.moonbase.mbip_5.gas_storage_ratio }} 
    ```

然后，您可以用交易的实际存储增长（以byte为单位）乘以gas与存储的比率，来计算该交易实际需要额外支付的gas单位。例如，如果执行交易使存储增加了 {{ networks.moonbase.mbip_5.example_storage }} byte，则可以使用以下公式来计算额外gas

=== "Moonbeam"

    ```text
    额外Gas = {{ networks.moonbeam.mbip_5.example_storage }} * {{ networks.moonbeam.mbip_5.gas_storage_ratio }}
    额外Gas = {{ networks.moonbeam.mbip_5.example_addtl_gas }}
    ```

=== "Moonriver"

    ```text
    额外Gas = {{ networks.moonriver.mbip_5.example_storage }} * {{ networks.moonriver.mbip_5.gas_storage_ratio }}
    额外Gas = {{ networks.moonriver.mbip_5.example_addtl_gas }}
    ```

=== "Moonbase Alpha"

    ```text
    额外Gas = {{ networks.moonbase.mbip_5.example_storage }} * {{ networks.moonbase.mbip_5.gas_storage_ratio }}
    额外Gas = {{ networks.moonbase.mbip_5.example_addtl_gas }}
    ```

我们可以通过在以太坊与Moonbeam分别部署两个不同的合约并且对比他们的gas预算来感受这个MBIP造成的主要影响，部署的两个合约一个修改链上的储存状态，另一个不修改。例如下面这个合约会在链上存储一个名字，然后使用这个名字来发送一个消息。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SayHello {
    mapping(address => string) public addressToName;

    constructor(string memory _name) {
        addressToName[msg.sender] = _name;
    }

    // Store a name associated to the address of the sender
    function setName(string memory _name) public {
        addressToName[msg.sender] = _name;
    } 
    
    // Use the name in storage associated to the sender
    function sayHello() external view returns (string memory) {
        return string(abi.encodePacked("Hello ", addressToName[msg.sender]));
    }
}
```

你可以将这个合约部署到Moonriver，以太坊，Moonbeam的测试网Moonbase Alpha, 以及以太网的测试网Sepolia。以上合约已经部署至Moonbase Alpha与Sepolia，您可以直接使用以下地址与其交互:

=== "Moonbase Alpha"

    ```text
    0xDFF8E772A9B212dc4FbA19fa650B440C5c7fd7fd
    ```

=== "Sepolia"

    ```text
    0x8D0C059d191011E90b963156569A8299d7fE777d
    ```

接下来，您可以使用`eth_estimateGas`方法来获取调用每个网络上的`setName`和`sayHello`函数的gas预估值。为此，您需要准备每个交易的bytecode，bytecode中包括了函数选择器，以及`setName`函数的`_name`参数。下面的实例将名称设置为“Chloe”：

=== "Set Name"

    ```text
    0xc47f00270000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000543686c6f65000000000000000000000000000000000000000000000000000000
    ```

=== "Say Hello"

    ```text
    0xef5fb05b
    ```

现在, 您可以使用下面这个curl命令来获取Moonbase Alpha上的这个合约的gas预估值:

=== "Set Name"

    ```sh
    curl {{ networks.moonbase.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
    '{
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_estimateGas",
        "params":[{
            "to": "0xDFF8E772A9B212dc4FbA19fa650B440C5c7fd7fd",
            "data": "0xc47f00270000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000543686c6f65000000000000000000000000000000000000000000000000000000"
        }]
    }'
    ```

=== "Say Hello"

    ```sh
    curl {{ networks.moonbase.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
    '{
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_estimateGas",
        "params":[{
            "to": "0xDFF8E772A9B212dc4FbA19fa650B440C5c7fd7fd",
            "data": "0xef5fb05b"
        }]
    }'
    ```

在Sepolia上, 您能够在`data` 使用同样的bytecode，您只需要修改RPC URL与合约地址:

=== "Set Name"

    ```sh
    curl https://sepolia.publicgoods.network -H "Content-Type:application/json;charset=utf-8" -d \
    '{
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_estimateGas",
        "params":[{
            "to": "0x8D0C059d191011E90b963156569A8299d7fE777d",
            "data": "0xc47f00270000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000543686c6f65000000000000000000000000000000000000000000000000000000"
        }]
    }'
    ```

=== "Say Hello"

    ```sh
    curl https://sepolia.publicgoods.network -H "Content-Type:application/json;charset=utf-8" -d \
    '{
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_estimateGas",
        "params":[{
            "to": "0x8D0C059d191011E90b963156569A8299d7fE777d",
            "data": "0xef5fb05b"
        }]
    }'
    ```

在写这篇文章的时候, 这两个网络的gas预估值如下所示:

=== "Moonbase Alpha"

    |   Method   | Gas Estimate |
    |:----------:|:------------:|
    |  `setName` |     45977    |
    | `sayHello` |     25938    |

=== "Sepolia"

    |   Method   | Gas Estimate |
    |:----------:|:------------:|
    |  `setName` |     21520    |
    | `sayHello` |     21064    |

您会看到在Sepolia上，这两个调用的gas估计值非常相似，而在Moonbase Alpha上，这两个调用之间存在明显的差异，并且修改存储的`setName`调用比`sayHello`调用使用更多的 gas。

## 以太坊API交易费用 {: #ethereum-api-transaction-fees }

要计算通过以太坊API在Moonbeam交易产生的费用，可以使用以下计算公式：

=== "EIP-1559"

    ```text
    GasPrice = BaseFee + MaxPriorityFeePerGas < MaxFeePerGas ?
                BaseFee + MaxPriorityFeePerGas :
                MaxFeePerGas;
    Transaction Fee = (GasPrice * TransactionWeight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```

=== "Legacy"

    ```text
    Transaction Fee = (GasPrice * TransactionWeight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```

=== "EIP-2930"

    ```text
    Transaction Fee = (GasPrice * TransactionWeight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```

以下部分更详细地描述了计算交易费用的每个组成部分。

### 基础费用 {: #base-fee}

`BaseFee`是在传送交易时被收取的最小费用，数值由网络本身设置。[EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=\_blank}中引入的`Base Fee`是由网络自设的一个值。Moonbeam有自己的[动态费用机制](https://forum.moonbeam.foundation/t/proposal-status-idea-dynamic-fee-mechanism-for-moonbeam-and-moonriver/241){target=\_blank}计算基础费用，它是根据区块拥塞情况来进行调整。从runtime 2300（运行时2300）开始，动态费用机制已推广到所有基于Moonbeam的网络。

每个网络的最低gas价格（Minimum Gas Price）如下：

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

    ```text
    BaseFee = NextFeeMultiplier * 125000000000 / 10^18
    ```

=== "Moonriver"

    ```text
    BaseFee = NextFeeMultiplier * 1250000000 / 10^18
    ```

=== "Moonbase Alpha"

    ```text
    BaseFee = NextFeeMultiplier * 125000000 / 10^18
    ```

通过以下端点，可以从Substrate Sidecar API检索`NextFeeMultiplier`的值：

```text
GET /pallets/transaction-payment/storage/nextFeeMultiplier?at={blockId}
```

Sidecar的pallet端点返回与pallet相关的数据，例如pallet存储中的数据。您可以在[Sidecar官方文档](https://paritytech.github.io/substrate-api-sidecar/dist/#operations-tag-pallets){target=\_blank}中阅读更多关于pallet端点的信息。需要从存储中获取的手头数据是`nextFeeMultiplier`，它可以在`transaction-payment` pallet中找到。存储的`nextFeeMultiplier`值可以直接从Sidecar存储结构中读取。读取结果为JSON对象，相关嵌套结构如下：

```text
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

`GasPrice`为用于指定在[EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=\_blank}前遗留交易的Gas价格。`MaxFeePerGas`和`MaxPriorityFeePerGas`在EIP-1559与`BaseFee`一同出现。`MaxFeePerGas`定义了允许支付以Gas为单位的最大费用，为`BaseFee`和`MaxPriorityFeePerGas`的总和。`MaxPriorityFeePerGas`为由交易的传送者配置的最大优先费用，用于在区块中激励优先处理该交易。

尽管Moonbeam与以太坊兼容，但它的核心还是基于Substrate的链，并且优先级在Substrate中的工作方式与在以太坊中不同。在Substrate中，交易并不按Gas价格确定优先顺序。为了解决这个问题，Moonbeam使用了修改后的优先级系统，该系统使用以太坊优先的解决方案重新确定Substrate交易的优先级。Substrate交易仍会经历有效性过程，在此过程中会为其分配交易标签、寿命和优先级。然后，原始优先级将被基于每Gas交易费用的新优先级覆盖，该费用源自交易的小费和权重。如果交易是以太坊交易，则根据优先费设置优先级。

值得注意的是，优先级并不是负责确定区块中交易顺序的唯一组件。其他组件（例如交易的寿命）也在排序过程中发挥作用。

适用交易类型的`GasPrice`, `MaxFeePerGas`和`MaxPriorityFeePerGas`的值可以根据[Sidecar API页面](/builders/build/substrate-api/sidecar/#evm-fields-mapping-in-block-json-object){target=\_blank}描述的结构从Block JSON对象读取，特定区块中以太坊交易的数据可以从以下区块端点中提取：

```text
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

```text
pallet: "system", method: "ExtrinsicSuccess" 
```

随后，`TransactionWeight`将被映射至Block JSON对象的以下字段中：

```text
extrinsics[extrinsic_number].events[event_number].data[0].weight
```

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

以下代码片段使用[Axios HTTP客户端](https://axios-http.com/){target=\_blank}来为最终区块查询[Sidecar端点`/blocks/head`](https://paritytech.github.io/substrate-api-sidecar/dist/#operations-tag-blocks){target=\_blank}。随后，根据交易类型（以太坊API：legacy、EIP-1559或EIP-2930标准以及Substrate API）计算区块中所有交易的交易费用，以及区块中的总交易费用。

以下代码示例仅用于演示目的，代码需进行修改并进一步测试后才可正式用于生产环境。

您可以将以下代码片段用于任何基于Moonbeam的网络，但您需要相应地修改`baseFee`。您可以参考[基本费用](#base-fee)部分以获取每个网络的计算结果。

```js
--8<-- 'code/builders/get-started/eth-compare/tx-fees/tx-fees-block-dynamic.js'
```

## Substrate API交易费用 {: #substrate-api-transaction-fees }

本教程假设您通过[Substrate API Sidecar](/builders/build/substrate-api/sidecar/){target=\_blank}服务与Moonbeam区块交互。也有其他与Moonbeam区块交互的方式，例如使用[Polkadot.js API library](/builders/build/substrate-api/polkadot-js-api/){target=\_blank}。检索区块后，两种方式的逻辑都是相同的。

您可以参考[Substrate API Sidecar页面](/builders/build/substrate-api/sidecar/){target=\_blank}获取关于安装和运行自己的Sidecar服务实例，以及如何为Moonbeam交易编码Sidecar区块的更多细节。

**请注意，此页面信息假定您运行的是版本{{ networks.moonbase.substrate_api_sidecar.stable_version }} 的Substrate Sidecar REST API。**

所有关于通过Substrate API发送的交易费用数据的信息都可以从以下区块端点中提取：

```text
GET /blocks/{blockId}
```

区块端点将返回与一个或多个区块相关的数据。您可以在[Sidecar官方文档](https://paritytech.github.io/substrate-api-sidecar/dist/#operations-tag-blocks){target=\_blank}上阅读有关区块端点的更多信息。读取结果为JSON对象，相关嵌套结构如下所示：

```text
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

```text
pallet: "transactionPayment", method: "TransactionFeePaid" 
```

随后，将用于支付此extrinsic的总交易费用映射至Block JSON对象的以下字段中：

```text
extrinsics[extrinsic_number].events[event_number].data[1]
```

--8<-- 'text/_disclaimers/third-party-content.md'
