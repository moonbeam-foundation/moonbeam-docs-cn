---
title: XCM执行费用
description: 学习XCM指令的内容，包含如何处理XCM执行费用以及计算在波卡、Kusama和基于Moonbeam的网络上的费用。
---

# Moonbeam上的XCM费用

![XCM Fees Banner](/images/builders/xcm/fees/fees-banner.png)

## 概览 {: #introduction}

XCM目标为成为共识系统之间沟通的语言。传送XCM消息包含一些列在原链和目标链上执行的指令。XCM指令的集合将执行如Token转账等不同的动作。要处理和执行每个XCM指令，基本上皆需支付一定数量的相关费用。

然而，XCM技术被设计为通用、可扩展且高效，因此才能够在发展的生态当中保持可用和潜力。正因如此，其通用性适用于包含XCM执行费用支付的概念。在以太坊中，费用包含在交易协议之中，而在波卡生态当中，每条平行链皆有能够定义XCM支付该如何处理的能力。

本教程将会包含费用支付，如谁该负责支付XCM执行费用、该如何支付以及如何在Moonbeam上计算费用。

## 费用支付 {: #payment-of-fees }

一般来说，费用支付的过程如下：

1. 提供所需资产

2. 必须协商资产交换计算时间（或权重）

3. 在提供的权重限制以及资金足够执行的情况下，XCM将会如指令描述运行

每条链皆能够配置XCM费用的组成，以及使用哪些Token支付（不论是原生或是外部资产）。举例来说，波卡和Kusama上的费用可分别由DOT和KSM支付给区块的验证人。在Moonbeam和Moonriver上，XCM执行费用能够使用原生储备资产（分别为GLMR和MOVR）支付，但用户也能够使用源自其他链的资产支付，其费用将会被传送至财政库中。

您可以想像以下情景：Alice在波卡上拥有一定数量的DOT，她想要传送至Moonbeam给Alith。Alice因此传送了一个包含一系列XCM指令的XCM消息，将从Alice波卡上的账户拿取一定量的DOT并将铸造相同数量的xcDOT至Alith的账户。部分指令将会在波卡上执行，而其他部分指令将会在Moonbeam上执行。

那究竟Alice是如何支付Moonbeam执行她的指令完成其请求？她的请求将会通过一系列包含在XCM消息中的XCM指令完成，允许其在扣除相关XCM执行费用后购买执行时间。此处的执行时间将会用于发行和转移xcDOT，xcDOT为DOT在Moonbeam上的表现形式。这代表当Alice传送一些DOT至Alith在Moonbeam上的账户时，她将会在扣除XCM执行费用后获得与原先DOT数量比例为1:1的xcDOT。请注意在此情境中，XCM的执行费用以xcDOT支付。

Alice请求的资产转移过程如下：

1. 资产将会传送Moonbeam在波卡上的账户（主权账户），并在收到资产后传送XCM消息至Moonbeam

2. 传送至Moonbeam的XCM消息将会：

    1. 铸造相关资产在Moonbeam的表现形式

    2. 购买相应执行时间

    3. 使用执行时间在扣除执行费用后将资产在Moonbeam上的表现形式存入目标账户

### XCM指令 {: #xcm-instructions }

一个XCM消息由一系列的XCM指令组成，而不同的XCM指令组合将会导向不同的执行动作。举例而言，要将DOT传送至Moonbeam，将会使用以下XCM指令：

1. [`TransferReserveAsset`](https://github.com/paritytech/xcm-format#transferreserveasset){target=_blank} - 在波卡上执行。此指令会将资产从原账户存入目标账户。在此例子中，目标账户为Moonbeam在波卡上的主权账户。接着，这将会传送一条XCM消息至目标链，也就是Moonbeam。XCM指令将会在Moonbeam上被执行

2. [`ReserveAssetDeposited`](https://github.com/paritytech/xcm-format#reserveassetdeposited){target=_blank} - 在Moonbeam上执行。此指令将会把主权账户获得资产在Moonbeam上的表现形式传送至注册持有者中，一个在跨共识虚拟机（XCVM）中的暂时储存地

3. [`ClearOrigin`](https://github.com/paritytech/xcm-format#clearorigin){target=_blank} - 在Moonbeam上执行。此指令会确保最新的XCM指令不会覆盖XCM作者的授权

4. [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - 在Moonbeam上执行。此指令会使用暂存的资产支付执行费用，费用的数量依据目标链决定，在本示例中为Moonbeam

5. [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - 在Moonbeam上执行。此指令会移除暂存区域的资产并将其传送至Moonbeam上的目标账户

要检查XCM消息中的指令是如何构建以传送自有资产至目标链，例如传送DOT至Moonbeam，您可以查看[X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/master/xtokens){target=_blank}（作为范例）。查看 [`transfer_self_reserve_asset`](https://github.com/open-web3-stack/open-runtime-module-library/blob/8c625a5ab43c1c56cdeed5f8d814a891566d4cf8/xtokens/src/lib.rs#L660){target=_blank}函数，您将会看到其调用`TransferReserveAsset`并输入`assets`、`dest`和`xcm`作为参数。详细来说，`xcm`参数包含`BuyExecution`和`DepositAsset`指令。如果您导向至Polkadot GitHub库，您可以找到[`TransferReserveAsset` 指令](https://github.com/paritytech/polkadot/blob/master/xcm/xcm-executor/src/lib.rs#L304){target=_blank}。此XCM消息由使用`xcm`参数的`ReserveAssetDeposited`和`ClearOrigin`指令组成，如上所示其中包含`BuyExecution`和 `DepositAsset`指令。

要将xcDOT从Moonbeam转移回波卡，您可以使用以下指令：

1. [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 在Moonbeam上执行。此指令将会移除资产并将它们存放在暂存处

2. [`InitiateReserveWithdraw`](https://github.com/paritytech/xcm-format#initiatereservewithdraw){target=_blank} - 在Moonbeam上执行。此指令会将资产从暂存处移除并使用`WithdrawAsset`为开头的指令传送一条XCM消息至目标链

3. [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 在波卡上执行。此指令会移除资产并将它们存放在暂存处

4. [`ClearOrigin`](https://github.com/paritytech/xcm-format#clearorigin){target=_blank} - 在波卡上执行。此指令会确保最新的XCM指令不会覆盖XCM作者的授权

5. [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - 在波卡上执行。此指令会使用暂存的资产支付执行费用，费用的数量依据目标链决定，在本示例中为波卡网络

6. [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - 在波卡上执行。此指令会移除暂存区域的资产并将其传送至波卡上的目标账户

要检查XCM消息中的指令是如何构建以传送自有资产至目标链，例如传送xcDOT至波卡，您可以查看[X-Tokens Open Runtime Module Librar](https://github.com/open-web3-stack/open-runtime-module-library/tree/master/xtokens){target=_blank}（作为范例）。查看 [`transfer_self_reserve_asset`](https://github.com/open-web3-stack/open-runtime-module-library/blob/8c625a5ab43c1c56cdeed5f8d814a891566d4cf8/xtokens/src/lib.rs#L660){target=_blank}函数，您将会看到其调用`TransferReserveAsset`并输入`assets`、`dest`和`xcm`作为参数。详细来说，`xcm`参数包含`BuyExecution`和`DepositAsset` 指令。如果您导向至Polkadot GitHub库，您可以找到[`TransferReserveAsset` 指令](https://github.com/paritytech/polkadot/blob/master/xcm/xcm-executor/src/lib.rs#L304){target=_blank}。此XCM消息由使用`xcm`参数的`ReserveAssetDeposited`和`ClearOrigin`指令组成，如上所述其中包含`BuyExecution` 和 `DepositAsset`指令。

## 储备资产费用计算 {: #fee-calc-reserve-assets }

Substrate先前发布了一个权重系统，决定一个函数的权重，也就是计算的费用。当在支付费用时，除了如网络拥塞的情况外，用户将会根据函数的权重支付交易费用。每个单位权重的定义为一个皮秒的执行时间。

以下部分将会解释如何在波卡、Kusama和基于Moonbeam的网络计算XCM费用。请注意，Kusama特别使用基准化的数据决定XCM指令的总权重花费，因部分XCM指令可能包含数据库的读写，这将增加调用的权重。

目前在波卡和Kusama中有两个可用数据库，RocksDB（预设）和ParityDB，两者皆在每个网络具有不同的相关权重花费。

### Polkadot {: #polkadot }

如同先前提到的，波卡目前对所有XCM指令采取[相同权重数量](https://github.com/paritytech/polkadot/blob/e76cd144f9dad8c1304fd1476f92495bbb9ad22e/runtime/polkadot/src/xcm_config.rs#L95){target=_blank}的计算方式，也就是`{{ networks.polkadot.xcm_instruction.weight.display }}`权重单位。

虽然波卡目前并未使用数据库的权重单位计算花费，但以下仍记载了数据库运行包含的权重单位作为参考。

|     Database      |                     Read                      |                     Write                      |
| :---------------: | :-------------------------------------------: | :--------------------------------------------: |
| RocksDB (default) | {{ networks.polkadot.rocks_db.read_weight }}  | {{ networks.polkadot.rocks_db.write_weight }}  |
|     ParityDB      | {{ networks.polkadot.parity_db.read_weight }} | {{ networks.polkadot.parity_db.write_weight }} |

在指令权重花费的计算架构完成后，您能够以DOT为单位计算指令的花费。

在波卡中，[`ExtrinsicBaseWeight`](https://github.com/paritytech/polkadot/blob/master/runtime/polkadot/constants/src/weights/extrinsic_weights.rs#L56){target=_blank}被设置为`{{ networks.polkadot.extrinsic_base_weight.display }}`，也就是一分的十分之一。一分为`10^10 / 10,000`。因此，在计算以DOT为单位的最终费用的公式中包含一个常量：

```
Planck-DOT-Weight =  PlanckDOT-Mapped * (1 / ExtrinsicBaseWeight)
```

常量由以下方式计算获得：

```
Planck-DOT-Weight = (10^10 / 10000) * (1 / {{ networks.polkadot.extrinsic_base_weight.numbers_only }})
```

因此，`Planck-DOT-Weight`与`{{ networks.polkadot.xcm_instruction.planck_dot_weight }} Planck-DOT`相同。现在您可以开始用DOT来计算最终费用，使用`Planck-DOT-Weight`作为常量，`TotalWeight`作为变量：

```
Total-Planck-DOT = TotalWeight * Planck-DOT-Weight
DOT = Total-Planck-DOT / DOTDecimalConversion
```

因此，一个XCM指令的实际计算方式如下：

```
Total-Planck-DOT = {{ networks.polkadot.xcm_instruction.weight.numbers_only }} * {{ networks.polkadot.xcm_instruction.planck_dot_weight }} 
DOT = {{ networks.polkadot.xcm_instruction.planck_dot_cost }} / 10^10
```

总花费为`{{ networks.polkadot.xcm_instruction.dot_cost }} DOT`

作为范例，您可以使用以下权重和指令花费计算传送一条XCM消息以转移xcDOT至DOT到波卡网络上所需的总花费：

|  Instruction  |                         Weight                          |                           Cost                            |
| :-----------: | :-----------------------------------------------------: | :-------------------------------------------------------: |
| WithdrawAsset | {{ networks.polkadot.xcm_instruction.weight.display }}  |   {{ networks.polkadot.xcm_instruction.dot_cost }} DOT    |
|  ClearOrigin  | {{ networks.polkadot.xcm_instruction.weight.display }}  |   {{ networks.polkadot.xcm_instruction.dot_cost }} DOT    |
| BuyExecution  | {{ networks.polkadot.xcm_instruction.weight.display }}  |   {{ networks.polkadot.xcm_instruction.dot_cost }} DOT    |
| DepositAsset  | {{ networks.polkadot.xcm_instruction.weight.display }}  |   {{ networks.polkadot.xcm_instruction.dot_cost }} DOT    |
|   **TOTAL**   | **{{ networks.polkadot.xcm_message.transfer.weight }}** | **{{ networks.polkadot.xcm_message.transfer.cost }} DOT** |

### Kusama {: #kusama }

Kusama上的总权重花费包括：给定指令本身花费和数据库读写的费用。尚未对数据库读写操作进行基准测试，而对指令权重进行了基准测试。以下为数据库执行权重花费的细节：

|     Database      |                    Read                     |                    Write                     |
| :---------------: | :-----------------------------------------: | :------------------------------------------: |
| RocksDB (default) | {{ networks.kusama.rocks_db.read_weight }}  | {{ networks.kusama.rocks_db.write_weight }}  |
|     ParityDB      | {{ networks.kusama.parity_db.read_weight }} | {{ networks.kusama.parity_db.write_weight }} |

现在您了解Kusama上数据库读写的权重花费，您可以使用指令的基础权重花费计算总花费。

[`WithdrawAsset` 指令](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L49-L53){target=_blank}具有`{{ networks.kusama.xcm_instruction.withdraw.base_weight }}`基础权重，且包含一个数据库读取和一个数据库写入。因此，`WithdrawAsset`指令的总权重花费将用以下方式计算：

```
{{ networks.kusama.xcm_instruction.withdraw.base_weight }} + {{ networks.kusama.rocks_db.read_weight}} + {{ networks.kusama.rocks_db.write_weight}} = {{ networks.kusama.xcm_instruction.withdraw.total_weight }}
```

`BuyExecution`指令具有`{{ networks.kusama.xcm_instruction.buy_exec.base_weight }}`基础权重，且不包含任何数据库读写。因此，[`BuyExecution` 指令](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L59-L61){target=_blank}的总权重花费为`{{ networks.kusama.xcm_instruction.buy_exec.total_weight }}`。

在Kusama上，标准化的基础权重分为两类：可替代的和通用的。可替代的权重为用于转移资产的XCM指令，而通用的基础权重用于其他类型指令。您可以在Kusama Runtime代码中查看[可替代资产](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L45){target=_blank}和[通用资产](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L46){target=_blank}的权重。

在了解指令的权重花费架构后，您可以以KSM为单位计算指令花费。

在Kusama中，[`ExtrinsicBaseWeight`](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/constants/src/weights/extrinsic_weights.rs#L56){target=_blank}被设置为`{{ networks.kusama.extrinsic_base_weight.display }}`，为一分的十分之一。一分为`10^12 / 30,000`，因此，在计算以DOT为单位的最终费用的公式中包含一个常量：

```
Planck-KSM-Weight =  PlanckKSM-Mapped * (1 / ExtrinsicBaseWeight)
```

`Planck-KSM-Weight`常量由以下方式计算获得：

```
Planck-KSM-Weight = (10^12 / 30000 * 10) * (1 / {{ networks.kusama.extrinsic_base_weight.numbers_only }})
```

所以，`Planck-KSM-Weight`与`{{ networks.kusama.xcm_instruction.planck_ksm_weight }} Planck-KSM`相同，现在您可以开始以KSM为单位计算最终费用，使用`Planck-KSM-Weight`作为常量和`TotalWeight`作为变量：

```
Total-Planck-KSM = TotalWeight * Planck-KSM-Weight
KSM = Total-Planck-KSM / KSMDecimalConversion
```

因此，以下为`WithdrawAsset`的实际计算方式：

```
Total-Planck-KSM = {{ networks.kusama.xcm_instruction.withdraw.total_weight }} * {{ networks.kusama.xcm_instruction.planck_ksm_weight }}
KSM = {{ networks.kusama.xcm_instruction.withdraw.planck_ksm_cost }} / 10^12
```

总花费为`{{ networks.kusama.xcm_instruction.withdraw.ksm_cost }} KSM`。

作为范例，您可以使用以下权重和指令花费计算传送一条XCM消息以转移xcKSM至KSM在Kusama网络的总花费：

|  Instruction  |                            Weight                            |                             Cost                             |
| :-----------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| WithdrawAsset | {{ networks.kusama.xcm_instruction.withdraw.total_weight }}  | {{ networks.kusama.xcm_instruction.withdraw.ksm_cost }} KSM  |
|  ClearOrigin  | {{ networks.kusama.xcm_instruction.clear_origin.total_weight }} | {{ networks.kusama.xcm_instruction.clear_origin.ksm_cost }} KSM |
| BuyExecution  | {{ networks.kusama.xcm_instruction.buy_exec.total_weight }}  | {{ networks.kusama.xcm_instruction.buy_exec.ksm_cost }} KSM  |
| DepositAsset  | {{ networks.kusama.xcm_instruction.deposit_asset.total_weight }} | {{ networks.kusama.xcm_instruction.deposit_asset.ksm_cost }} KSM |
|   **TOTAL**   |    **{{ networks.kusama.xcm_message.transfer.weight }}**     |   **{{ networks.kusama.xcm_message.transfer.cost }} KSM**    |

### 基于Moonbeam的网络 {: #moonbeam-based-networks }

Moonbeam上每个XCM指令使用固定的权重数量。接着权重单位将被转变成余额单位作为费用计算的一部分。每个基于Moonbeam网络的权重数量和每单位权重的Wei如下所示：

=== "Moonbeam"
    |                                                                                                   权重                                                                                                    |                                                                            每单位权重的Wei                                                                            |
    |:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    | [{{ networks.moonbeam.xcm.instructions.weight_units.display }}](https://github.com/PureStake/moonbeam/blob/f19ba9de013a1c789425d3b71e8a92d54f2191af/runtime/moonbeam/src/xcm_config.rs#L201){target=_blank} | [{{ networks.moonbeam.xcm.instructions.wei_per_weight.display }}](https://github.com/PureStake/moonbeam/blob/master/runtime/moonbeam/src/lib.rs#L128){target=_blank} |

=== "Moonriver"
    |                                                                                                    权重                                                                                                     |                                                                            每单位权重的Wei                                                                             |
    |:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    | [{{ networks.moonriver.xcm.instructions.weight_units.display }}](https://github.com/PureStake/moonbeam/blob/f19ba9de013a1c789425d3b71e8a92d54f2191af/runtime/moonriver/src/xcm_config.rs#L208){target=_blank} | [{{ networks.moonriver.xcm.instructions.wei_per_weight.display }}](https://github.com/PureStake/moonbeam/blob/master/runtime/moonbeam/src/lib.rs#L128){target=_blank} |

=== "Moonbase Alpha"
    |                                                                                                   权重                                                                                                    |                                                                                             每单位权重的Wei                                                                                             |
    |:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    | [{{ networks.moonbase.xcm.instructions.weight_units.display }}](https://github.com/PureStake/moonbeam/blob/f19ba9de013a1c789425d3b71e8a92d54f2191af/runtime/moonbase/src/xcm_config.rs#L219){target=_blank} | [{{ networks.moonbase.xcm.instructions.wei_per_weight.display }}](https://github.com/PureStake/moonbeam/blob/f19ba9de013a1c789425d3b71e8a92d54f2191af/runtime/moonbase/src/lib.rs#L135){target=_blank} |

这代表在Moonbeam上可以使用以下公式计算一个XCM指令的费用：

```
Wei = Weight * Wei_Per_Weight
GLMR = Wei / (10^18)
```

因此，实际的计算方式为：

```
Wei = {{ networks.moonbeam.xcm.instructions.weight_units.numbers_only }} * {{ networks.moonbeam.xcm.instructions.wei_per_weight.display }}
GLMR = {{ networks.moonbeam.xcm.instructions.wei_cost }} / (10^18)
```

在Moonbeam上执行XCM指令的总花费为`{{ networks.moonbeam.xcm.instructions.glmr_cost }} GLMR`。

## 外部资产的费用计算 {: #fee-calc-external-assets }

您可以想像以下情景，当Alice希望传送DOT至Alith在Moonbeam上的账户，费用将会从Alith获得的DOT数量中扣除。要决定收取的费用，Moonbeam使用`UnitsPerSecond`的概念，也就是参考网络每秒XCM执行时间收费的Token单位（考虑小数）。Moonbeam使用此概念（或是其他平行链）来决定该如何使用储备资产外的资产收取XCM的执行费用。

除外，Moonbeam上的XCM执行能够使用原链的多种资产支付，也就是资产原来的地方。举例而言，截至撰写时，来自[Statemine](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fstatemine-rpc.polkadot.io#/explorer){target=_blank}的XCM消息能够使用xcKSM、xcRMRK和xcUSDT支付。只要资产在Moonbeam或是Moonriver设有`UnitsPerSecond`，其就可以用于支付来自特定链XCM消息的执行。

要寻找特定资产的`UnitsPerSecond`设置，您可以查询`assetManager.assetTypeUnitsPerSecond`并在问题栏位中输入资产的multilocation。

如果您不确定multilocation的数值，您可以使用`assetManager.assetIdType`进行检索。

举例来说，您可以导向至[Polkadot.js Apps的Moonbeam页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/chainstate){target=_blank}，在**Developer**下拉选单中选取**Chain State**。接着跟随以下步骤：

1. 在**selected state query**下拉菜单中选取**assetManager**

2. 选取**assetIdType** extrinsic

3. 在**Option**下方输入资产ID或是取消选取**include option**以获得所有资产的信息。此范例将会获取xcUNITs的信息，其资产ID为`42259045809535163221576417993425387648`

4. 点击**+**按钮以提交查询

![Get the xcUNIT asset multilocation](/images/builders/xcm/fees/fees-1.png)

您可以使用查询结果并用于查询**assetTypeUnitesPerSecond** extrinsic：

1. 确保已选取**assetManager**

2. 选取**assetTypeUnitesPerSecond** extrinsic

3. 在**MoonbeamRuntimeXcmConfigAssetType**选取**Xcm**

4. 在**parents**一栏输入`1`

5. 在**interior**选取`Here`

6. 点击**+**提交查询

xcDOT的`UnitsPerSecond`数值为`{{ networks.moonbeam.xcm.units_per_second.xcdot.display }}`

![Get the xcUNIT units per second value](/images/builders/xcm/fees/fees-2.png)

请记得权重的单位定义为执行时间的一皮秒，以下为定义执行时间的公式：

```
ExecutionTime = (Weight / Picosecond) * NumberOfInstructions
```

要定义Alice转移DOT至Moonbeam的执行时间（包含4个XCM指令），您可以使用以下计算方式：

```
ExecutionTime = ({{ networks.moonbeam.xcm.instructions.weight_units.numbers_only }} / 10^12) * 4
```

这代表4个XCM指令需花费`{{ networks.moonbeam.xcm.message.transfer.exec_time }}`秒的区块执行时间。

要计算以xcDOT为单位的总花费，您将需要资产的单位位数作为查询，以xcDOT为例为10个位数。您可以通过[检索资产元数据](/builders/xcm/xc20/xc20/#x-chain-assets-metadata){target=_blank}查询资产的单位位数。

区块执行的公式可以用于决定Alice转移DOT至Alith在Moonbeam上账户所需的花费，以下为总花费的计算公式：

```
Cost = (UnitsPerSecond / DecimalConversion) * ExecutionTime
```

转移花费的计算公式如下：

```
Cost = ({{ networks.moonbeam.xcm.units_per_second.xcdot.numbers_only }} / 10^10) * {{ networks.moonbeam.xcm.message.transfer.exec_time }}
```

Alice转移DOT至Alith账户的总花费为`{{ networks.moonbeam.xcm.message.transfer.xcdot_cost }} xcDOT`。