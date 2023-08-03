```js
 struct Multilocation {
    uint8 parents;
    bytes[] interior;
}
```

请注意每个multilocation皆有`parents`元素，请使用`uint8`和一组字节定义。Parents代表有多少“hops”在通过中继链中您需要执行的传递向上方向。作为`uint8`，您将会看到以下数值：

|   Origin    | Destination | Parents Value |
|:-----------:|:-----------:|:-------------:|
| Parachain A | Parachain A |       0       |
| Parachain A | Relay Chain |       1       |
| Parachain A | Parachain B |       1       |

字节阵列（`bytes[]`）定义了内部参数以及其在multilocation的内容。阵列的大小则根据以下定义`interior`数值：

|    Array     | Size | Interior Value |
|:------------:|:----:|:--------------:|
|      []      |  0   |      Here      |
|    [XYZ]     |  1   |       X1       |
|  [XYZ, ABC]  |  2   |       X2       |
| [XYZ, ... N] |  N   |       XN       |

!!! 注意事项
    内部值`Here`通常用于中继链（作为目标链或以中继链资产为目标）。

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

接着，根据选择器及其数据类型，以下字节对应于提供的实际数据。请注意在Polkadot.js Apps示例中出现的`AccountId32`，`AccountIndex64`和`AccountKey20`，`network`将会在最后添加。如下所示：

|    Selector    |      Data Value       |            Represents             |
|:--------------:|:---------------------:|:---------------------------------:|
|   Parachain    |    "0x00+000007E7"    |         Parachain ID 2023         |
|  AccountId32   | "0x01+AccountId32+00" | AccountId32, Network(Option) Null |
|  AccountId32   | "0x01+AccountId32+03" |   AccountId32, Network Polkadot   |
| PalletInstance |       "0x04+03"       |         Pallet Instance 3         |

!!! 注意事项
    `interior`数据通常需要使用引号包含。如果您未遵循此规则，您将会获得`invalid tuple value`错误。