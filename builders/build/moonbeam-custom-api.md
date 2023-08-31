---
title: Moonbeam自定义API
description: 此页面涵盖Moonbeam自定义API端点（特定于Moonbeam的JSON RPC方法信息）。
---

# Moonbeam自定义API

## Finality RPC端点 {: #finality-rpc-endpoints }

Moonbeam节点现已添加对两个自定义JSON RPC端点`moon_isBlockFinalized`和`moon_isTxFinalized`的支持，用于检查链上事件是否最终确定。关于这两个端点的基本信息如下所示：

=== "moon_isBlockFinalized"
    | 变量 |                                                值                                                 |
    |:----:|:-------------------------------------------------------------------------------------------------:|
    | 端点 |                                      `moon_isBlockFinalized`                                      |
    | 描述 | Check for the finality of the block given by its block hash通过给定的区块哈希检查区块的最终确定性 |
    | 参数 |     `block_hash`: **STRING** 区块的哈希，接受Substrate格式或以太坊格式的区块哈希作为其输入值      |
    | 返回 |   `result`: **BOOLEAN** 如果区块被最终确定则返回`true`，如果区块未被最终确定或找到则返回`false`   |

=== "moon_isTxFinalized"
    | 变量 |                                            值                                             |
    |:----:|:-----------------------------------------------------------------------------------------:|
    | 端点 |                                   `moon_isTxFinalized`                                    |
    | 描述 |                         通过给定的EVM tx哈希检查交易的最终确定性                          |
    | 参数 |                          `tx_hash`: **STRING** 交易的EVM tx哈希                           |
    | 返回 | `result`: **BOOLEAN** 如果tx被最终确定则返回`true`，如果tx未被最终确定或找到则返回`false` |

您可以通过以下curl示例尝试这些端点。这些示例查询的是Moonbase Alpha的公共RPC端点，但是您可以通过更改RPC端点的URL，并使用您从所支持的[端点提供商](/builders/get-started/endpoints/){target=_blank}获得自己的端点和API密钥与Moonbeam和Moonriver一同使用。

=== "moon_isBlockFinalized"

    ```bash
    curl -H "Content-Type: application/json" -X POST --data
        '[{
            "jsonrpc":"2.0",
            "id":"1",
            "method":"moon_isBlockFinalized",
            "params":["Put-Block-Hash-Here"
        ]}]'
        {{ networks.moonbase.rpc_url }}
    ```

=== "moon_isTxFinalized"

    ```bash
    curl -H "Content-Type: application/json" -X POST --data
        '[{
            "jsonrpc":"2.0",
            "id":"1",
            "method":"moon_isTxFinalized",
            "params":["Put-Tx-Hash-Here"
        ]}]'
        {{ networks.moonbase.rpc_url }}
    ```
