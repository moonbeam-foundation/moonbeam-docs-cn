---
title: XCM Multilocations
description: 学习任何关于multilocation的内容，包含他们在XCM中扮演的角色，以及如何设计一个multilocation来定位生态中一个特定的点。
---

# Multilocations

## 概览 {: #introduction }

Multilocation定义了相对于给定起始，某个点在整个中继链/平行链生态系统中的特定位置。它可用于定位特定的平行链、资产、账户，甚至是平行链内的pallet。

Multilocation遵循分层结构，其中某些位置封装在其他位置内。例如，中继链封装了与其连接的所有平行链。同样，平行链封装了其中存在的所有pallet、账户和资产。

![Hierarchy of multilocations](/images/builders/interoperability/xcm/core-concepts/multilocations/multilocations-1.png)

## 定义一个Multilocation {: #defining-a-multilocation }

一个multilocation包含两个参数：

- `parents` - 指的是您需要从给定源向上进行多少次“hops”进入父区块链。从中继链生态系统中平行链的角度来看，只能有一个父级，因此`parents`的值只能是`0`来代表平行链，或者`1`来代表中继链。在定义考虑以太坊等其他共识系统的通用位置时，`parents`可以具有更高的数值
- `interior` - 指的是需要定义目标点的字段数量。从中继链中，您可以向下追溯以定位特定的平行链，账户，资产或该平行链上的pallet。由于这种向下移动可能更加复杂，因此[Junctions](#junctions)用于表示到达目标位置所需的步骤，并由`XN`定义，其中`N`是所需的Junctions数量。如果不需要Junction来定义目标点，则其值将为`Here`而不是`X1`

例如，如果您的目标是中继链本身，则您将使用`Here`，因为您定义的不是一个中继链上的账户、一条平行链或是平行链上特定的点。

另一方面，如果您的目标是一个中继链上的账户、一条平行链或平行链中特定点，您将根据需要使用一个或多个Junction。

### Junctions {: #junctions }

一个Junction可以是以下任何一种：

- `Parachain` - 使用平行链ID描述平行链

    ```js
    { Parachain: INSERT_PARACHAIN_ID }
    ```

- `AccountId32` - 描述32字节Substrate形式的账户。接受可选的`network`参数，该参数可以是以下之一：`Any`、`Named`、`Polkadot`或`Kusama`

    ```js
    { AccountId32: { id: INSERT_ADDRESS, network: INSERT_NETWORK } }
    ```

- `AccountIndex64` - 描述64字节（8-byte）索引的账户。接受可选的`network`参数，该参数可以是以下之一：`Any`、`Named`、`Polkadot`或`Kusama`

    ```js
    { AccountIndex64: { index: INSERT_ACCOUNT_INDEX, network: INSERT_NETWORK } }
    ```

- `AccountKey20` - 描述20字节，如同在Moonbeam上使用的以太坊形式账户。接受可选的`network`参数，该参数可以是以下之一：`Any`、`Named`、`Polkadot`或`Kusama`

    ```js
    { AccountKey20: { key: INSERT_ADDRESS, network: INSERT_NETWORK } }
    ```

- `PalletInstance` - 描述目标链上pallet的索引

    ```js
    { PalletInstance: INSERT_PALLET_INSTANCE_INDEX }
    ```

- `GeneralIndex` - 描述一个无特定说明的索引，可用于定位以钥值格式存储的数据

    ```js
    { GeneralIndex: INSERT_GENERAL_INDEX }
    ```

- `GeneralKey` - 描述一个无特定说明的密钥，可用于针对更复杂的数据结构。这需要您指定数据的`data`和`length`

    ```js
    { GeneralKey: { length: INSERT_LENGTH_OF_DATA, data: [INSERT_DATA] } }
    ```

- `OnlyChild` - 用于描述一个位置的子级，如果该位置父级和子级之间仅存在一对一关系。目前不使用它，除非作为衍生内容时的备选方案

- `Plurality` - 描述满足特定条件或具有共同特征的多个元素。这需要您指定Junction代表的[Body ID](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/src/v3/junction.rs#L121-L147){target=\_blank}和[主体部分](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/src/v3/junction.rs#L192-L221){target=\_blank}

    ```js
    { Plurality: { id: INSERT_BODY_ID, part: INSERT_BODY_PART } }
    ```

使用Junction时，您将使用`XN`，其中`N`是到达目标位置所需的Junction数量。例如，如果您要从平行链定位Moonbeam上的账户，则需要将`parents`设置为`1`，并且您需要定义两个Junction：`Parachain`和`AccountKey20`，因此您将使用`X2`，这是一个包含每个Junction的阵列：

```js
{
  parents: 1,
  interior: {
    X2: [
      { Parachain: 2004 },
      { AccountKey20: { key: 'INSERT_MOONBEAM_ADDRESS' } },
    ],
  },
};
```

## Multilocation范例 {: #example-multilocations }

### 从其他平行链定位Moonbeam {: #target-moonbeam-from-parachain }

要从其他平行链定位基于Moonbeam的链，您将需要使用以下multilocation：

=== "Moonbeam"

    ```js
    {
      parents: 1,
      interior: {
        X1: [{ Parachain: 2004 }],
      },
    };
    ```

=== "Moonriver"

    ```js
    {
      parents: 1,
      interior: {
        X1: [{ Parachain: 2023 }],
      },
    };
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 1,
      interior: {
        X1: [{ Parachain: 1000 }],
      },
    };
    ```

### 从其他平行链定位Moonbeam账户 {: #target-account-moonbeam-from-parachain }

要从其他平行链定位基于Moonbeam链的账户，您将需要使用以下multilocation：

=== "Moonbeam"

    ```js
    {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 2004 },
          { AccountKey20: { key: 'INSERT_MOONBEAM_ADDRESS' } },
        ],
      },
    };
    ```

=== "Moonriver"

    ```js
    {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 2023 },
          { AccountKey20: { key: 'INSERT_MOONBEAM_ADDRESS' } },
        ],
      },
    };
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 1000 },
          { AccountKey20: { key: 'INSERT_MOONBEAM_ADDRESS' } },
        ],
      },
    };
    ```

### 从其他平行链定位Moonbeam原生资产 {: #target-moonbeam-native-asset-from-parachain }

要从其他平行链定位基于Moonbeam链的原生资产，您将需要使用以下multilocation：

=== "Moonbeam"

    ```js
    {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 2004 },
          { PalletInstance: 10 }, // Index of the Balances Pallet on Moonbeam
        ],
      },
    };
    ```

=== "Moonriver"

    ```js
    {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 2023 },
          { PalletInstance: 10 }, // Index of the Balances Pallet on Moonriver
        ],
      },
    };
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 1000 },
          { PalletInstance: 3 }, // Index of the Balances Pallet on Moonbase Alpha
        ],
      },
    };
    ```

### 从中继链定位Moonbeam {: #target-moonbeam-from-relay }

要从中继链定位基于Moonbeam的链，您将需要使用以下multilocation：

=== "Moonbeam"

    ```js
    {
      parents: 0,
      interior: {
        X1: [{ Parachain: 2004 }],
      },
    };
    ```

=== "Moonriver"

    ```js
    {
      parents: 0,
      interior: {
        X1: [{ Parachain: 2023 }],
      },
    };
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 0,
      interior: {
        X1: [{ Parachain: 1000 }],
      },
    };
    ```

### 从Moonbeam定位中继链 {: #target-relay-from-moonbeam }

要基于Moonbeam的链定位中继链，您将需要使用以下multilocation：

=== "Moonbeam"

    ```js
    {
      parents: 1,
      interior: Here,
    };
    ```

=== "Moonriver"

    ```js
    {
      parents: 1,
      interior: Here,
    };
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 1,
      interior: Here,
    };
    ```

### 从Moonbeam定位中继链账户 {: #target-account-relay-from-moonbeam }

要从基于Moonbeam的链定位中继链特定账户，您将需要使用以下multilocation：

=== "Moonbeam"

    ```js
    {
      parents: 1,
      interior: { X1: { AccountId32: { id: INSERT_RELAY_ADDRESS } } },
    };
    ```

=== "Moonriver"

    ```js
    {
      parents: 1,
      interior: { X1: { AccountId32: { id: INSERT_RELAY_ADDRESS } } },
    };
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 1,
      interior: { X1: { AccountId32: { id: INSERT_RELAY_ADDRESS } } },
    };
    ```

### 从Moonbeam定位其他平行链 {: #target-parachain-from-moonbeam }

要从基于Moonbeam的链定位其他平行链（举例来说，一个ID为1234的平行链），您将需要使用以下multilocation：

=== "Moonbeam"

    ```js
    {
      parents: 1,
      interior: {
        X1: [{ Parachain: 1234 }],
      },
    };
    ```

=== "Moonriver"

    ```js
    {
      parents: 1,
      interior: {
        X1: [{ Parachain: 1234 }],
      },
    };
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 1,
      interior: {
        X1: [{ Parachain: 1234 }],
      },
    };
    ```
