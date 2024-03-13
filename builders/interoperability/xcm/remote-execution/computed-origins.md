---
title: Computed Origin账户
description: 了解Computed Origin账户，如何用它通过简单交易执行远程跨链调用，以及如何计算这些账户。
---

# Computed Origin账户

## 概览 {: #introduction }

Computed Origin，之前被称为multilocation衍生账户，是通过XCM执行远程调用时被计算的账户。

计算的来源是无密钥的（私钥未知）。因此，Computed Origin只能通过原始账户的XCM外部访问。换句话说，源账户是唯一可以在您的Computed Origin账户上发起交易的账户，如果您失去对源账户的访问权限，您也将失去对Computed Origin账户的访问权限。

Computed Origin是根据用于在目标链中执行XCM的源计算的。默认情况下，这是目标链中源链的主权账户。此源可以通过[`DescendOrigin`](/builders/interoperability/xcm/core-concepts/instructions#descend-origin){target=\_blank}XCM指令进行转换。然而，目标链可以决定是否使用新转换的源来执行XCM。在Moonbeam上，Computed Origin账户用于执行XCM。

基于Moonbeam的网络遵循[Polkadot制定的Computed Origin标准](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs ){target=\_blank}，即通过依赖于XCM消息来源的数据结构的`blake2`哈希。然而，由于Moonbeam使用以太坊格式的账户，Computed Origin被截断为20字节。

## 来源转换 {: #origin-conversion }

当一个远程调用中的`Transact`指令被执行时，[源转换](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-executor/src/lib.rs#L553){target=\_blank}就会启用。目标链上转换后的新源支付目标链上的XCM执行费用。

例如，在中继链中， [`DescendOrigin`](/builders/interoperability/xcm/core-concepts/instructions#descend-origin){target=\_blank}指令由[XCM Pallet](https: //github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/pallet-xcm/src/lib.rs){target=\_blank}原生注入。以Moonbase Alpha的中继链（基于Westend）为例，它具有以下格式（multilocation连接）：

```js
{
  DescendOrigin: {
    X1: {
      AccountId32: {
        network: { westend: null },
        id: decodedAddress,
      },
    },
  },
}
```

其中`decodedAddress`对应在中继链上签署交易的账户的地址（以解码的32字节格式呈现）。您可以使用以下代码片段确保您的地址已正确解码，如果需要,这个代码会将解码地址，如果不需要则忽略：

```js
import { decodeAddress } from '@polkadot/util-crypto';
const decodedAddress = decodeAddress('INSERT_ADDRESS');
```

当XCM指令在Moonbeam（本例中为Moonbase Alpha）中执行时，来源将转换为以下multilocation：

```js
{
  DescendOrigin: {
    parents: 1,
    interior: {
      X1: {
        AccountId32: {
          network: { westend: null },
          id: decodedAddress,
        },
      },
    },
  },
}
```

## 如何计算Computed Origin {: #calculate-computed-origin }

您可以通过[xcm-tools](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank}库中的`calculate-multilocation-derivative-account`或`calculate-remote-origin` 脚本轻松计算Computed Origin账户。

该脚本接受以下输入：

- `--ws-provider`或`-w` - 对应于用于获取Computed Origin的端点。这应该是目标链的端点
- `--address`或`--a` - 指定发送XCM消息的源链地址
- `--para-id` 或 `--p` -（可选）指定XCM消息的源链的平行链ID。它是可选项，因为XCM消息可能来自中继链（无平行链ID）。或者平行链可以充当其他平行链的中继链
- `--parents` - （可选）对应于源链相对于目标链的父值。如果您正在计算中继链上账户的Computed Origin账户，则该值将为`1`。如果省略，该值默认为`0`

要使用脚本，您可以跟随以下步骤：

1. 复制[xcm-tools](https://github.com/Moonsong-Labs/xcm-tools){target_blank}库
2. 运行`yarn`以安装必要包
3. 运行脚本

    ```bash
    yarn calculate-multilocation-derivative-account \
    --ws-provider INSERT_RPC_ENDPOINT \
    --address INSERT_ORIGIN_ACCOUNT \
    --para-id INSERT_ORIGIN_PARACHAIN_ID_IF_APPLIES \
    --parents INSERT_PARENTS_VALUE_IF_APPLIES
    ```

您还可以使用[XCM Utilities Precompile](/builders/interoperability/xcm/xcm-utils/){target=\_blank}的`multilocationToAddress`函数计算Computed Origin账户。

### 在基于Moonbeam的网络计算Computed Origin {: #calculate-the-computed-origin-on-moonbeam }

例如，要计算Alice的中继链账户在Moonbase Alpha上的Computed Origin，即`5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT`，您可以使用以下命令来运行脚本：

```bash
yarn calculate-multilocation-derivative-account \
--ws-provider wss://wss.api.moonbase.moonbeam.network \
--address 5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT \
--parents 1
```

!!! 注意事项
    对于Moonbeam或Moonriver，您需要拥有自己的端点和API密钥，您可以从支持的[端点提供商](/builders/get-started/endpoints/){target=\_blank}之一获取。

获取的输出包含以下数值：

|              名称               |                             数值                             |
| :-----------------------------: | :----------------------------------------------------------: |
|          源链编码地址           |      `5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT`      |
|          源链解码地址           | `0x3ec5f48ad0567c752275d87787954fef72f557b8bfa5eefc88665fa0beb89a56` |
|  在目标链上获得的Multilocation  | `{"parents":1,"interior":{"x1":{"accountId32":{"network": {"westend":null},"id":"0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0afb2e78fdbbbf4ce26c2556c"}}}}` |
| Copmuted Origin账户（32 bytes） | `0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0afb2e78fdbbbf4ce26c2556c` |
| Copmuted Origin账户（20 bytes） |         `0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0`         |

因此，在本例中，Alice在Moonbase Alpha上的Computed Origin账户为`0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0`。请注意，Alice是唯一可以通过中继链的远程交易访问此账户的人，因为她是其私钥的所有者，并且Computed Origin账户是无密钥的。
