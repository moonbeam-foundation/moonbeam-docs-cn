```solidity
struct Multilocation {
    uint8 parents;
    bytes[] interior;
}
```

As with a standard [multilocation](/builders/interoperability/xcm/core-concepts/multilocations){target=\_blank}, there are `parents` and `interior` elements. However, instead of defining the multilocation as an object, with Ethereum libraries, the struct is defined as an array, which contains a `uint8` for the `parents` as the first element and a bytes array for the `interior` as the second element.

The normal values you would see for the `parents` element are:

请注意每个multilocation皆有`parents`元素，请使用`uint8`和一组字节定义。Parents代表有多少“hops”在通过中继链中您需要执行的传递向上方向。作为`uint8`，您将会看到以下数值：

|   Origin    | Destination | Parents Value |
|:-----------:|:-----------:|:-------------:|
| Parachain A | Parachain A |       0       |
| Parachain A | Relay Chain |       1       |
| Parachain A | Parachain B |       1       |

For the `interior` element, the number of fields you need to drill down to in the target chain to reach the exact location of the target, such as the specific asset or account, represents the size of the bytes array:

字节阵列（`bytes[]`）定义了内部参数以及其在multilocation的内容。阵列的大小则根据以下定义`interior`数值：

|    Array     | Size | Interior Value |
|:------------:|:----:|:--------------:|
|      []      |  0   |      Here      |
|    [XYZ]     |  1   |       X1       |
|  [XYZ, ABC]  |  2   |       X2       |
| [XYZ, ... N] |  N   |       XN       |

!!! 注意事项
    内部值`Here`通常用于中继链（作为目标链或以中继链资产为目标）。

Each field required to reach the exact location of the target needs to be defined as a hex string. The first byte (2 hexadecimal characters) corresponds to the selector of the field. For example:

假设所有字节阵列包含数据。所有元素的首个字节（2个十六进制数值）与`XN`部分的选择器相关，举例来说：

| Byte Value |    Selector    | Data Type |
|:----------:|:--------------:|-----------|
|    0x00    |   Parachain    | bytes4    |
|    0x01    |  AccountId32   | bytes32   |
|    0x02    | AccountIndex64 | u64       |
|    0x03    |  AccountKey20  | bytes20   |
|    0x04    | PalletInstance | byte      |
|    0x05    |  GeneralIndex  | u128      |
|    0x06    |   GeneralKey   | bytes[]   |

Next, depending on the selector and its data type, the following bytes correspond to the actual data being provided. Note that for `AccountId32`, `AccountIndex64`, and `AccountKey20`, the optional `network` field is appended at the end. For example:

接着，根据选择器及其数据类型，以下字节对应于提供的实际数据。请注意在Polkadot.js Apps示例中出现的`AccountId32`，`AccountIndex64`和`AccountKey20`，`network`将会在最后添加。如下所示：

|    Selector    |       Data Value       |             Represents             |
|:--------------:|:----------------------:|:----------------------------------:|
|   Parachain    |    "0x00+000007E7"     |         Parachain ID 2023          |
|  AccountId32   | "0x01+AccountId32+00"  | AccountId32, Network(Option) Null  |
|  AccountId32   | "0x01+AccountId32+02"  |   AccountId32, Network Polkadot    |
|  AccountKey20  | "0x03+AccountKey20+00" | AccountKey20, Network(Option) Null |
| PalletInstance |       "0x04+03"        |         Pallet Instance 3          |

!!! 注意事项
    `interior`数据通常需要使用引号包含，或您将会获得`invalid tuple value`错误。
