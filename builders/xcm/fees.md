---
title: XCM执行费用
description: 学习XCM指令的内容，包含如何处理XCM执行费用以及计算在波卡、Kusama和基于Moonbeam的网络上的费用。
---

# Moonbeam上的XCM费用

![XCM Fees Banner](/images/builders/xcm/fees/fees-banner.png)

## 概览 {: #introduction}

XCM旨在成为共识系统之间沟通的语言。传送XCM消息包含一系列在原链和目标链上执行的指令。XCM指令的集合将执行如Token转账等不同的动作。要处理和执行每个XCM指令，基本上皆需支付一定数量的相关费用。

然而，XCM技术被设计为通用、可扩展且高效，因此才能够在发展的生态当中保持可用和潜力。正因如此，其通用性适用于包含XCM执行费用支付的概念。在以太坊中，费用包含在交易协议之中，而在波卡生态当中，每条平行链皆有能够定义XCM支付该如何处理的能力。

本教程将会包含费用支付，如谁该负责支付XCM执行费用、该如何支付以及如何在Moonbeam上计算费用。

## 费用支付 {: #payment-of-fees }

一般来说，费用支付的过程如下：

1. 提供所需资产
2. 必须协商资产交换计算时间（或权重）
3. 在提供的权重限制或资金足够执行的情况下，XCM将会如指令描述运行

每条链皆能够配置XCM费用的组成，以及使用哪些Token支付（不论是原生或是外部资产）。举例来说，波卡和Kusama上的费用可分别由DOT和KSM支付给区块的验证人。在Moonbeam和Moonriver，XCM执行费用能够使用原生储备资产（分别为GLMR和MOVR）支付，但用户也能够使用源自其他链的资产支付，其费用将会被传送至财政库中。

您可以想像以下情景：Alice在波卡上拥有一定数量的DOT，她想要传送至Moonbeam给Alith。Alice因此传送了一个包含一系列XCM指令的XCM消息，将从Alice波卡上的账户拿取一定量的DOT并将铸造相同数量的xcDOT至Alith的账户。部分指令将会在波卡上执行，而其他部分指令将会在Moonbeam上执行。

那究竟Alice是如何在Moonbeam完成支付，执行她的指令完成其请求？她的请求将会通过一系列包含在XCM消息中的XCM指令完成，允许其在扣除相关XCM执行费用后购买执行时间。此处的执行时间将会用于发行和转移xcDOT，xcDOT为DOT在Moonbeam上的表现形式。这代表当Alice传送一些DOT至Alith在Moonbeam上的账户时，她将会在扣除XCM执行费用后获得与原先DOT数量比例为1:1的xcDOT。请注意在此情境中，XCM的执行费用以xcDOT支付。

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

要检查XCM消息中的指令是如何构建，以传送自有资产至目标链，例如传送DOT至Moonbeam，您可以查看[X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/master/xtokens){target=_blank}（作为范例）。查看 [`transfer_self_reserve_asset`](https://github.com/open-web3-stack/open-runtime-module-library/blob/8c625a5ab43c1c56cdeed5f8d814a891566d4cf8/xtokens/src/lib.rs#L660){target=_blank}函数，您将会看到其调用`TransferReserveAsset`并输入`assets`、`dest`和`xcm`作为参数。详细来说，`xcm`参数包含`BuyExecution`和`DepositAsset`指令。如果您导向至Polkadot GitHub库，您可以找到[`TransferReserveAsset` 指令](https://github.com/paritytech/polkadot/blob/master/xcm/xcm-executor/src/lib.rs#L304){target=_blank}。此XCM消息由使用`xcm`参数的`ReserveAssetDeposited`和`ClearOrigin`指令组成，如上所示其中包含`BuyExecution`和`DepositAsset`指令。

要将xcDOT从Moonbeam转移回波卡，您可以使用以下指令：

1. [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 在Moonbeam上执行。此指令将会移除资产并将它们存放在暂存处

2. [`InitiateReserveWithdraw`](https://github.com/paritytech/xcm-format#initiatereservewithdraw){target=_blank} - 在Moonbeam上执行。此指令会将资产从暂存处移除并使用`WithdrawAsset`为开头的指令传送一条XCM消息至目标链

3. [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 在波卡上执行。此指令会移除资产并将它们存放在暂存处

4. [`ClearOrigin`](https://github.com/paritytech/xcm-format#clearorigin){target=_blank} - 在波卡上执行。此指令会确保最新的XCM指令不会覆盖XCM作者的授权

5. [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - 在波卡上执行。此指令会使用暂存的资产支付执行费用，费用的数量依据目标链决定，在本示例中为波卡网络

6. [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - 在波卡上执行。此指令会移除暂存区域的资产并将其传送至波卡上的目标账户

要检查XCM消息中的指令是如何构建，以传送自有资产至目标链，例如传送xcDOT至波卡，您可以查看[X-Tokens Open Runtime Module Librar](https://github.com/open-web3-stack/open-runtime-module-library/tree/master/xtokens){target=_blank}（作为范例）。查看 [`transfer_to_reserve`](https://github.com/open-web3-stack/open-runtime-module-library/blob/8c625a5ab43c1c56cdeed5f8d814a891566d4cf8/xtokens/src/lib.rs#L677){target=_blank}函数，您将会看到其调用`WithdrawAsset`和`InitiateReserveWithdraw`，并输入`assets`、`dest`和`xcm`作为参数。详细来说，`xcm`参数包含`BuyExecution`和`DepositAsset`指令。如果您导向至Polkadot GitHub库，您可以找到[`InitiateReserveWithdraw` 指令](https://github.com/paritytech/polkadot/blob/master/xcm/xcm-executor/src/lib.rs#L410){target=_blank}。此XCM消息由使用`xcm`参数的`WithdrawAsset`和`ClearOrigin`指令组成，如上所述其中包含`BuyExecution`和`DepositAsset`指令。

## 中继链XCM费用计算 {: #rel-chain-xcm-fee-calc }

Substrate已推出一个权重系统，决定一个函数的权重，也就是从计算成本的角度决定一个extrinsic的昂贵程度。一个权重单位被定义为一皮秒的执行时间。当在支付费用时，除了如网络拥塞的情况外，用户将会根据所调用函数的权重支付交易费用。

以下部分将会解释如何在波卡和Kusama计算XCM费用。请注意，Kusama特别使用基准化的数据决定XCM指令的总权重花费，因部分XCM指令可能包含数据库的读写，这将增加调用的权重。

目前在波卡和Kusama中有两个可用数据库，RocksDB（预设）和ParityDB，两者皆在每个网络具有不同的相关权重花费。

### Polkadot {: #polkadot }

如同先前提到的，波卡目前对所有XCM指令采取[固定权重数量](https://github.com/paritytech/polkadot/blob/e76cd144f9dad8c1304fd1476f92495bbb9ad22e/runtime/polkadot/src/xcm_config.rs#L95){target=_blank}的计算方式，也就是`{{ networks.polkadot.xcm_instruction.weight.display }}`权重单位。

虽然波卡目前并未使用数据库的权重单位计算花费，但以下仍记载了数据库运行包含的权重单位作为参考。

|     数据库      |                     读                      |                     写                      |
|:-----------------:|:---------------------------------------------:|:----------------------------------------------:|
| RocksDB (default) | {{ networks.polkadot.rocks_db.read_weight }}  | {{ networks.polkadot.rocks_db.write_weight }}  |
|     ParityDB      | {{ networks.polkadot.parity_db.read_weight }} | {{ networks.polkadot.parity_db.write_weight }} |

在指令权重花费的计算架构完成后，您能够以DOT为单位计算指令的花费。

在波卡中，[`ExtrinsicBaseWeight`](https://github.com/paritytech/polkadot/blob/master/runtime/polkadot/constants/src/weights/extrinsic_weights.rs#L56){target=_blank}被设置为`{{ networks.polkadot.extrinsic_base_weight.display }}`，也就是[一分的十分之一](https://github.com/paritytech/polkadot/blob/master/runtime/polkadot/constants/src/lib.rs#L87){targer=blank}。一分为`10^10 / 100`。

因此您可以使用以下公式计算一个XCM指令的执行费用：

```
XCM-DOT-Cost = XCMInstrWeight * DOTWeightToFeeCoefficient
```

`DOTWeightToFeeCoefficient`为常量（为一分），并可以通过以下计算获得：

```
DOTWeightToFeeCoefficient = ( 10^10 / ( 10 * 100 )) * ( 1 / DOTExtrinsicBaseWeight )
```

使用实际数值：

```
DOTWeightToFeeCoefficient = ( 10^10 / ( 10 * 100 * {{ networks.polkadot.extrinsic_base_weight.numbers_only }} )
```

最后`DOTWeightToFeeCoefficient`将会等于`{{ networks.polkadot.xcm_instruction.planck_dot_weight }} Planck-DOT`。现在，您可以开始以DOT为单位计算最终费用，并使用`DOTWeightToFeeCoefficient`常量和`TotalWeight`变量：

```
XCM-Planck-DOT-Cost = TotalWeight * DOTWeightToFeeCoefficient
XCM-DOT-Cost = XCM-Planck-DOT-Cost / DOTDecimalConversion
```

因此，一个XCM指令的实际计算方式如下：

```
XCM-Planck-DOT-Cost = {{ networks.polkadot.xcm_instruction.weight.numbers_only }} * {{ networks.polkadot.xcm_instruction.planck_dot_weight }} 
XCM-DOT-Cost = {{ networks.polkadot.xcm_instruction.planck_dot_cost }} / 10^10
```

总花费为`{{ networks.polkadot.xcm_instruction.dot_cost }} DOT`。

作为范例，您可以使用以下权重和指令花费计算传送一条XCM消息以转移xcDOT至DOT到波卡网络上所需的总花费：

|  指令  |                         重量                          |                           成本                            |
|:-------------:|:-------------------------------------------------------:|:---------------------------------------------------------:|
| WithdrawAsset | {{ networks.polkadot.xcm_instruction.weight.display }}  |   {{ networks.polkadot.xcm_instruction.dot_cost }} DOT    |
|  ClearOrigin  | {{ networks.polkadot.xcm_instruction.weight.display }}  |   {{ networks.polkadot.xcm_instruction.dot_cost }} DOT    |
| BuyExecution  | {{ networks.polkadot.xcm_instruction.weight.display }}  |   {{ networks.polkadot.xcm_instruction.dot_cost }} DOT    |
| DepositAsset  | {{ networks.polkadot.xcm_instruction.weight.display }}  |   {{ networks.polkadot.xcm_instruction.dot_cost }} DOT    |
|   **总量**   | **{{ networks.polkadot.xcm_message.transfer.weight }}** | **{{ networks.polkadot.xcm_message.transfer.cost }} DOT** |

### Kusama {: #kusama }

Kusama上的总权重花费包括：给定指令本身花费和数据库读写的费用。尚未对数据库读写操作进行基准测试，而对指令权重进行了基准测试。以下为数据库执行权重花费的细节：

|     数据库      |                    读                     |                   写                     |
|:-----------------:|:-------------------------------------------:|:--------------------------------------------:|
| RocksDB (default) | {{ networks.kusama.rocks_db.read_weight }}  | {{ networks.kusama.rocks_db.write_weight }}  |
|     ParityDB      | {{ networks.kusama.parity_db.read_weight }} | {{ networks.kusama.parity_db.write_weight }} |

现在您了解Kusama上数据库读写的权重花费，您可以使用指令的基础权重花费计算总花费。

[`WithdrawAsset` 指令](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L49-L53){target=_blank}具有`{{ networks.kusama.xcm_instruction.withdraw.base_weight }}`基础权重，且包含一个数据库读取和一个数据库写入。因此，`WithdrawAsset`指令的总权重花费将用以下方式计算：

```
{{ networks.kusama.xcm_instruction.withdraw.base_weight }} + {{ networks.kusama.rocks_db.read_weight}} + {{ networks.kusama.rocks_db.write_weight}} = {{ networks.kusama.xcm_instruction.withdraw.total_weight }}
```

`BuyExecution`指令具有`{{ networks.kusama.xcm_instruction.buy_exec.base_weight }}`基础权重，且不包含任何数据库读写。因此，[`BuyExecution` 指令](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L59-L61){target=_blank}的总权重花费为`{{ networks.kusama.xcm_instruction.buy_exec.total_weight }}`。

在Kusama上，基准化的基础权重分为两类：可替代的和通用的。可替代的权重为用于转移资产的XCM指令，而通用的基础权重用于其他类型指令。您可以在Kusama Runtime代码中查看[可替代资产](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L45){target=_blank}和[通用资产](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L46){target=_blank}的权重。

在了解指令的权重花费架构后，您可以以KSM为单位计算指令花费。

在Kusama中，[`ExtrinsicBaseWeight`](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/constants/src/weights/extrinsic_weights.rs#L56){target=_blank}被设置为`{{ networks.kusama.extrinsic_base_weight.display }}`，为[一分的十分之一](https://github.com/paritytech/kusama/blob/master/runtime/polkadot/constants/src/lib.rs#L85){targer=blank}。一分为`10^12 / 30,000`。

因此您可以使用以下公式计算一个XCM指令的执行费用：

```
XCM-KSM-Cost = XCMInstrWeight * KSMWeightToFeeCoefficient
```

`KSMWeightToFeeCoefficient`为常量（为一分），并可以通过以下计算获得：

```
KSMWeightToFeeCoefficient = ( 10^12 / ( 10 * 30000 )) * ( 1 / KSMExtrinsicBaseWeight )
```

使用实际数值：

```
KSMWeightToFeeCoefficient = ( 10^12 / ( 10 * 30000 * {{ networks.kusama.extrinsic_base_weight.numbers_only }} )
```

所以，`KSMWeightToFeeCoefficient`与`{{ networks.kusama.xcm_instruction.planck_ksm_weight }} Planck-KSM`相同，现在您可以开始以KSM为单位计算最终费用，使用`KSMWeightToFeeCoefficient`作为常量和`TotalWeight`作为变量：

```
XCM-Planck-KSM-Cost = TotalWeight * KSMWeightToFeeCoefficient
XCM-KSM-Cost = XCM-Planck-KSM-Cost / KSMDecimalConversion
```

因此，以下为`WithdrawAsset`的实际计算方式：

```
XCM-Planck-KSM-Cost = {{ networks.kusama.xcm_instruction.withdraw.total_weight }} * {{ networks.kusama.xcm_instruction.planck_ksm_weight }} 
XCM-KSM-Cost = {{ networks.kusama.xcm_instruction.withdraw.planck_ksm_cost }} / 10^12
```

总花费为`{{ networks.kusama.xcm_instruction.withdraw.ksm_cost }} KSM`。

作为范例，您可以使用以下权重和指令花费计算传送一条XCM消息以在Kusama网络上转移xcKSM至KSM的总花费：

|  指令  |                              重量                              |                               成本                               |
|:-------------:|:----------------------------------------------------------------:|:----------------------------------------------------------------:|
| WithdrawAsset |   {{ networks.kusama.xcm_instruction.withdraw.total_weight }}    |   {{ networks.kusama.xcm_instruction.withdraw.ksm_cost }} KSM    |
|  ClearOrigin  | {{ networks.kusama.xcm_instruction.clear_origin.total_weight }}  | {{ networks.kusama.xcm_instruction.clear_origin.ksm_cost }} KSM  |
| BuyExecution  |   {{ networks.kusama.xcm_instruction.buy_exec.total_weight }}    |   {{ networks.kusama.xcm_instruction.buy_exec.ksm_cost }} KSM    |
| DepositAsset  | {{ networks.kusama.xcm_instruction.deposit_asset.total_weight }} | {{ networks.kusama.xcm_instruction.deposit_asset.ksm_cost }} KSM |
|   **总量**   |      **{{ networks.kusama.xcm_message.transfer.weight }}**       |     **{{ networks.kusama.xcm_message.transfer.cost }} KSM**      |


## 基于Moonbeam网络的XCM费用计算 {: #moonbeam-xcm-fee-calc }

Substrate已推出一个权重系统，决定一个函数的权重，也就是从计算成本的角度决定一个extrinsic的昂贵程度。一个权重单位被定义为一皮秒的执行时间。当在支付费用时，用户将会根据所调用函数的权重支付交易费用，接着每个平行链皆可以决定如何将权重转换至费用，举例而言，计算交易大小或是存储花费的额外费用。

基于Moonbeam的网络针对每一个XCM指令使用同样的权重，分别如下：

|                                                                                                  Moonbeam                                                                                                   |                                                                                                   Moonriver                                                                                                   |                                                                                               Moonbase Alpha                                                                                                |
|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| [{{ networks.moonbeam.xcm.instructions.weight_units.display }}](https://github.com/PureStake/moonbeam/blob/f19ba9de013a1c789425d3b71e8a92d54f2191af/runtime/moonbeam/src/xcm_config.rs#L201){target=_blank} | [{{ networks.moonriver.xcm.instructions.weight_units.display }}](https://github.com/PureStake/moonbeam/blob/f19ba9de013a1c789425d3b71e8a92d54f2191af/runtime/moonriver/src/xcm_config.rs#L208){target=_blank} | [{{ networks.moonbase.xcm.instructions.weight_units.display }}](https://github.com/PureStake/moonbeam/blob/f19ba9de013a1c789425d3b71e8a92d54f2191af/runtime/moonbase/src/xcm_config.rs#L219){target=_blank} |

以下部分教程将会包含如何在基于Moonbeam的网络计算XCM费用，有两个主要的应用场景：

 - 以储备Token支付费用（如GLMR、MOVR或DEV等原生Token）
 - 使用外部资产（XC-20s）支付费用

### 储备资产的费用计算 {: #moonbeam-reserve-assets }

对于每个XCM指令，权重单位将会被转换为余额单位作为费用计算的一部分。每个基于Moonbeam网络单个权重单位的Wei数量分别如下：

|                                                                               Moonbeam                                                                               |                                                                               Moonriver                                                                               |                                                                                             Moonbase Alpha                                                                                             |
|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| [{{ networks.moonbeam.xcm.instructions.wei_per_weight.display }}](https://github.com/PureStake/moonbeam/blob/master/runtime/moonbeam/src/lib.rs#L129){target=_blank} | [{{ networks.moonriver.xcm.instructions.wei_per_weight.display }}](https://github.com/PureStake/moonbeam/blob/master/runtime/moonbeam/src/lib.rs#L129){target=_blank} | [{{ networks.moonbase.xcm.instructions.wei_per_weight.display }}](https://github.com/PureStake/moonbeam/blob/f19ba9de013a1c789425d3b71e8a92d54f2191af/runtime/moonbase/src/lib.rs#L135){target=_blank} |

这意味着以Moonbeam为例，计算一个XCM指令以储备资产作为费用的公式如下：

```
Wei = XCMInstrWeight * Wei_Per_Weight
GLMR = Wei / (10^18)
```

因此，实际计算如下：

```
XCM-Wei-Cost = {{ networks.moonbeam.xcm.instructions.weight_units.numbers_only }} * {{ networks.moonbeam.xcm.instructions.wei_per_weight.display }}
XCM-GLMR-Cost = {{ networks.moonbeam.xcm.instructions.wei_cost }} / (10^18)
```

最后，在Moonbeam上一的XCM指令的总费用为`{{ networks.moonbeam.xcm.instructions.glmr_cost }} GLMR`。

### 外部资产的费用计算 {: #fee-calc-external-assets }

考虑Alice在Moonbeam上向Alith的账户发送DOT的场景，费用从Alith收到的xcDOT金额中收取。要确定支付多少费用，Moonbeam使用了一个名为`UnitsPerSecond`的概念，代表网络在XCM执行时间内每秒收取的Token单位（包含小数）。 Moonbeam（可能还有其他平行链）将使用此概念来确定使用与其储备不同的资产执行XCM的费用。

此外，在Moonbeam上执行XCM可以由原本资产来源链的多种资产（[XC-20s](/builders/xcm/xc20/overview/){target=_blank}）支付。举例来说，在撰写本文时，从[Statemine](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fstatemine-rpc.polkadot.io#/explorer)发送的XCM消息{target=_blank}可以用xcKSM、xcRMRK 或xcUSDT支付。只要该资产在Moonbeam/Moonriver中设置了`UnitsPerSecond`，它就可以用于为来自该特定链的XCM消息支付XCM执行费用。

要找出给定的资产是否在`UnitsPerSecond`列表中，您可以使用`assetManager.assetTypeUnitsPerSecond`函数并输入想要查看的资产的multilocation。

如果您不确定其multilocation，您可以使用`assetManager.assetIdType`函数检索。

举例来说，您可以导向至[Polkadot.js App的Moonbeam页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/chainstate){target=_blank}，并在**Developer**下拉选单中选取**Chain State**。接着，您可以跟随以下步骤操作：

1. 在**selected state query**下拉选单中，选取**assetManager**
2. 选取**assetIdType** extrinsic
3. 在**Option**下方输入资产ID或是关闭**include option**以移除所有资产的信息。在本教程中将会获得xcUNIT的信息，其资产ID为`42259045809535163221576417993425387648`
4. 点击**+**按钮提交查询

![Get the xcUNIT asset multilocation](/images/builders/xcm/fees/fees-1.png)

您可以使用查询结果，并将其用于查询**assetTypeUnitesPerSecond** extrinsic：

1. 确保已选取**assetManager**
2. 选取**assetTypeUnitesPerSecond** extrinsic
3. 在**MoonbeamRuntimeXcmConfigAssetType**选取**Xcm**
4. 在**parents**一栏输入`1`
5. 在**interior**选取`Here`
6. 点击**+**提交查询

xcDOT的`UnitsPerSecond`数值为`{{ networks.moonbeam.xcm.units_per_second.xcdot.transfer }}`。

![Get the xcUNIT units per second value](/images/builders/xcm/fees/fees-2.png)

请记得，权重的单位定义为执行时间的一皮秒，以下为定义执行时间的公式：

```
ExecutionTime = (Weight / Picosecond) * NumberOfInstructions
```

要定义Alice转移DOT至Moonbeam的执行时间（包含4个XCM指令），您可以使用以下计算方式：

```
ExecutionTime = ({{ networks.moonbeam.xcm.instructions.weight_units.numbers_only }} / 10^12) * 4
```

这代表4个XCM指令需花费`{{ networks.moonbeam.xcm.message.transfer.exec_time }}`秒的区块执行时间。

要计算以xcDOT为单位的总花费，您将需要资产的单位位数作为查询，以xcDOT为例，其资产单位为10个位数。您可以通过[检索资产元数据](/builders/xcm/xc20/xc20/#x-chain-assets-metadata){target=_blank}查询资产的单位位数。

区块执行的公式可以用于决定Alice转移DOT至Alith在Moonbeam上账户所需的花费，以下为总花费的计算公式：

```
XCM-Cost = (UnitsPerSecond / DecimalConversion) * ExecutionTime
```

转移花费的计算公式如下：

```
XCM-Cost = ({{ networks.moonbeam.xcm.units_per_second.xcdot.transfer_numbers_only }} / 10^10) * {{ networks.moonbeam.xcm.message.transfer.exec_time }}
```

Alice转移DOT至Alith账户的总花费为`{{ networks.moonbeam.xcm.message.transfer.xcdot_cost }} xcDOT`。

## XCM-Transactor费用 {: #xcm-transactor-fees }

[XCM-transactor pallet](/builders/xcm/xcm-transactor/){target=_blank}构建了一个能够在其他生态链上远程交易的XCM消息。

开发者有两种方法通过pallet远程交易：

1. [`transactThroughDerivative`](/builders/xcm/xcm-transactor/#xcmtransactor-transact-through-derivative){target=_blank}

2. [`transactThroughSigned`](/builders/xcm/xcm-transactor/#xcmtransactor-transact-through-signed){target=_blank}，调用者在目标链上的账户为一个multilocation原生的账户，且必须要拥有足够支付XCM执行费用，加上其他用于远程执行函数调度的费用

一般而言，XCM指令通常包含以下远程执行：

 - 首个指令将处理原链上的Token。这可以为将Token转移至某个主权账户，或是销毁相关的[XC-20资产](/builders/xcm/xc20/overview/){target=_blank}，让其可以被用于目标链。这些指令将会在原链上执行
 - [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank}（可选） - 使用指令中提供的multilocation来改变起点。这仅用于`transactThroughSigned`和`transactThroughSignedMultilocation`函数，因为来源不再是主权账户，而是[multilocation衍生账户](/builders/xcm/xcm-transactor/#general-xcm-definitions){target=_blank}
 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 在目标链上执行。移除资产并将其放于待使用
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - 在目标链上执行，将会把保存资产拿出以支付执行费用，支付的费用由目标链决定
 - [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} - 在目标链执行，自给定的原链调用编码的调用数据

因此，在目标链上的XCM执行包含3到4个XCM指令，依据使用的函数而定。此部分包含每个上述提及的操作场景中的XCM费用是如何计算的，因其不尽相同。

### 通过衍生费用交易 {: #transact-through-derivative-fees }

通过衍生函数交易包含3个XCM指令：[`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank}、[`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank}以及[`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank}。

在[通过主权衍生账户进行交易](/builders/xcm/xcm-transactor/#xcmtransactor-transact-through-derivative){target=_blank}时，交易费用由原链的主权账户支付目标链，但由衍生账户调度。因此，XCM交易者pallet将销毁一定数量的相应XC-20 Token，以释放主权账户中的一些余额用于支付XCM执行费。

您可以想像以下情景：Alice想要从Moonbeam使用通过主权extrinsic在波卡中进行远程交易（她已经在她的账户中注册了一个索引）。要预估从Alice的账户中将销毁多少XC-20 Token，您需要检查特定于中继链的交易信息。因此，请前往[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network#/chainstate){target=_blank}的链状态页面并设置以下选项：

1. 选取**xcmTransactor** pallet
2. 选取**transactInfoWithWeightLimit**方法
3. 为目标链设置multilocation，根据您希望查询的交易信息。在此范例中，您可以将**parents**设置为`1`
4. 在**interior**选取`Here`
5. 点击 **+**

![Get the Transact Through Derivative Weight Info for Polkadot](/images/builders/xcm/fees/fees-3.png)

在获得的回应中，您可以看到`transactExtraWeight`为`{{ networks.polkadot.xcm_message.transact.weight }}`。这是在该特定目标链中执行此远程调用的三个XCM指令所需的权重。接下来，您需要找到该特定链的`UnitsPerSecond`。在同一个[Polkadot.js Apps页面](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network#/chainstate){target=_blank}，设置以下选项：

1. 选取**xcmTransactor**pallet
2. 选取**destinationAssetFeePerSecond**函数
3. 为目标链设置multilocation，根据您希望查询的交易信息。在此范例中，您可以将**parents**设置为`1`
4. 在**interior**选取`Here`
5. 点击 **+**

![Get the Units Per Second for Transact Through Derivative for Polkadot](/images/builders/xcm/fees/fees-4.png)

请注意，`UnitsPerSecond`与在[中继链XCM费用计算](#polkadot)部分所预估的花费相关，或是如果是其他平行链则跟[权重单位的Wei](#moonbeam-reserve-assets)相关。如同先前，计算相关的XCM执行费用与`transactExtraWeight`乘以`UnitsPerSecond`一样简单明了：

```
XCM-Planck-DOT-Cost = transactExtraWeight * UnitsPerSecond / WeightToSeconds
XCM-DOT-Cost = XCM-Planck-DOT-Cost / DOTDecimalConversion
```

因此，以下为一个通过衍生调用的XCM-transactor交易费用的实际计算：

```
XCM-Planck-DOT-Cost = {{ networks.polkadot.xcm_message.transact.numbers_only }} * {{ networks.moonbeam.xcm.units_per_second.xcdot.transact_numbers_only }} / 10^12
XCM-DOT-Cost = {{ networks.polkadot.xcm_message.transact.planck_dot_cost }} / 10^10
```

通过衍生交易的成本是`{{ networks.polkadot.xcm_message.transact.dot_cost }} DOT`。 **请注意，这不包括远程执行调用的成本，仅包括XCM执行费用。** 因此，被销毁的XC-20 Token数量，还要考虑作为函数调用中输入的目标权重，可以在计算中添加到`transactExtraWeight`中。

### 通过签署费用交易 {: #transact-through-signed-fees }

通过签署函数进行的交易（multilocation衍生账户）由4个XCM指令组成：[`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank}、[`WithdrawAsset`]( https://github.com/paritytech/xcm-format#withdrawasset){target=_blank}、[`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank}和[`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank}。

在[通过multilocation衍生账户进行交易](/builders/xcm/xcm-transactor/#xcmtransactor-transact-through-derivative){target=_blank}时，交易费用由发出调用的同一账户支付，其为目标链中的multilocation衍生帐户。因此，multilocation衍生帐户必须持有必要的资金来支付整个执行费用。请注意，支付费用的目标Token不需要在原链中注册为XC-20。

您可以想像以下情景：Alice想要使用通过签名函数的交易从Moonbase Alpha在另一条链（平行链 ID 888，在Moonbase Alpha中继链生态系统中）进行远程交易。要估计Alice的multilocation衍生账户执行远程调用所需的Token数量，您需要检查在目标链的特定交易信息。为此，请前往[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network#/chainstate){target=_blank}的链状态页面并设置以下选项：


1. 选取**xcmTransactor** pallet
2. 选取**transactInfoWithWeightLimit**方法
3. 为目标链设置multilocation，根据您希望查询的交易信息。在此范例中，您可以将**parents**设置为`1`
4. 在**interior**中选取`X1`
5. 在**X1**一栏中选取`Parachain`
6. 将**Parachain**设置为`888`
7. 点击 **+**

![Get the Transact Through Derivative Weight Info for another Parachain](/images/builders/xcm/fees/fees-5.png)

在获得的回应中，您可以看到`transactExtraWeightSigned`为`{{ networks.moonbase_beta.xcm_message.transact.weight }}`。这是在该特定目标链中执行此远程调用的4个XCM指令所需的权重。接下来，您需要找到目标链每执行XCM权重收取的费用。通常，您会查看该特定链的`UnitsPerSecond`。但在这种情况下并不会销毁XC-20 Token。因此，`UnitsPerSecond`可以作为参考，但不能保证估算的Token数量是正确的。要获取`UnitsPerSecond`作为参考值，在同一个[Polkadot.js Apps页面](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network #/chainstate){target=_blank}，设置以下选项：

1. 选取**xcmTransactor** pallet
2. 选取**destinationAssetFeePerSecond**方法
3. 为目标链设置multilocation，根据您希望查询的交易信息。在此范例中，您可以将**parents**设置为`1`
4. 在**interior**中选取`X2`
5. 在**X1**一栏中选取`Parachain`
6. 将**Parachain**设置为`888`
7. 在**X2**一栏选取`PalletInstance`
8. 将**PalletInstance**设置为`3`
9. 点击 **+**

![Get the Units Per Second for Transact Through Derivative for another Parachain](/images/builders/xcm/fees/fees-6.png)

请注意，此`UnitsPerSecond`与[中继链XCM费用计算](/builders/xcm/fees/#polkadot){target=_blank}部分中的预估成本有关，如果目标是另一个平行链，将与[权重单位的Wei数值](/builders/xcm/fees/#moonbeam-reserve-assets){target=_blank}部分中显示的成本有关。您需要找到正确的数值，以确保multilocation衍生账户持有的Token数量是正确的。如同先前，计算相关的XCM执行费用与`transactExtraWeight`乘以`UnitsPerSecond`一样简单明了（用于估算）：

```
XCM-Wei-Token-Cost = transactExtraWeight * UnitsPerSecond / WeightToSeconds
XCM-Token-Cost = XCM-Wei-Token-Cost / TokensDecimalConversion
```

因此，实际一个通过衍生调用的XCM-transactor交易费用的实际计算如下：

```
XCM-Wei-Token-Cost = {{ networks.moonbase_beta.xcm_message.transact.numbers_only }} * {{ networks.moonbase.xcm.units_per_second.xcbetadev.transact_numbers_only }}
XCM-Token-Cost = {{ networks.moonbase_beta.xcm_message.transact.wei_betadev_cost }} / 10^18
```

通过签名进行交易的费用为`{{ networks.moonbase_beta.xcm_message.transact.betadev_cost }} TOKEN`。 **请注意，这不包括远程执行调用的费用，仅包括XCM执行费用。**