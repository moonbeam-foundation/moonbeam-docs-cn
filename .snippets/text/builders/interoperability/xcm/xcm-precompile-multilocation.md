```solidity
struct Multilocation {
    uint8 parents;
    bytes[] interior;
}
```

在标准的[multilocation](/builders/interoperability/xcm/core-concepts/multilocations){target=\_blank}中有 `parents` 和 `interior` 两个元素。但是使用以太坊库时，multilocation不是定义为对象，而是定义为一个数组，其中第一个元素是 `uint8` 类型的 `parents`，第二个元素是字节数组类型的 `interior`。  

您通常会看到以下值用于  `parents` 元素：  

|   Origin    | Destination | Parents Value |
|:-----------:|:-----------:|:-------------:|
| Parachain A | Parachain A |       0       |
| Parachain A | Relay Chain |       1       |
| Parachain A | Parachain B |       1       |

对于 `interior` 元素，字节数组的大小代表了在目标链中到达目标确切位置（例如特定资产或账户）所需的字段数量：

|    Array     | Size | Interior Value |
|:------------:|:----:|:--------------:|
|      []      |  0   |      Here      |
|    [XYZ]     |  1   |       X1       |
|  [XYZ, ABC]  |  2   |       X2       |
| [XYZ, ... N] |  N   |       XN       |

!!! 注意事项
    内部值`Here`通常用于中继链（作为目标链或以中继链资产为目标）。

到达目标的确切位置，每一个需要的字段都必须定义为一个十六进制字符串。第一个字节（2*十六进制字符）对应于字段的选择器。例如：

| Byte Value |    Selector    | Data Type |
|:----------:|:--------------:|-----------|
|    0x00    |   Parachain    | bytes4    |
|    0x01    |  AccountId32   | bytes32   |
|    0x02    | AccountIndex64 | u64       |
|    0x03    |  AccountKey20  | bytes20   |
|    0x04    | PalletInstance | byte      |
|    0x05    |  GeneralIndex  | u128      |
|    0x06    |   GeneralKey   | bytes[]   |

接下来，根据选择器及其数据类型，以下字节对应了实际提供的数据。请注意，对于 `AccountId32`, `AccountIndex64` 和 `AccountKey20`，可选的 `network` 字段会附加在结尾。例如：

|    Selector    |       Data Value       |             Represents             |
|:--------------:|:----------------------:|:----------------------------------:|
|   Parachain    |    "0x00+000007E7"     |         Parachain ID 2023          |
|  AccountId32   | "0x01+AccountId32+00"  | AccountId32, Network(Option) Null  |
|  AccountId32   | "0x01+AccountId32+02"  |   AccountId32, Network Polkadot    |
|  AccountKey20  | "0x03+AccountKey20+00" | AccountKey20, Network(Option) Null |
| PalletInstance |       "0x04+03"        |         Pallet Instance 3          |

!!! 注意事项
    `interior`数据通常需要使用引号包含，或您将会获得`invalid tuple value`错误。
