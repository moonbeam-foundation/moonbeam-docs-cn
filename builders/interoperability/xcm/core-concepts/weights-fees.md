---
title: XCM执行费用
description: 学习XCM指令的相关内容，包含如何处理XCM执行费用以及计算在Polkadot、Kusama和基于Moonbeam的网络上的费用。
---

# Moonbeam上的XCM费用

## 概览 {: #introduction}

XCM旨在成为共识系统之间传递信息的语言。传送XCM消息包含一系列在源链和目标链上执行的指令。XCM指令的集合将执行如Token转账等不同的动作。为了处理和执行每个XCM指令，通常需要支付相关的费用。

然而，XCM技术被设计为通用、可扩展且高效，因此才能够在发展的生态当中保持可用和潜力。正因如此，其通用性适用于包含XCM执行费用支付的概念。在以太坊中，费用包含在交易协议之中，而在Polkadot生态当中，每条平行链皆有灵活性定义如何处理XCM费用。

本教程将会包含费用支付的几个方面，例如谁该负责支付XCM执行费用、该如何支付以及如何在Moonbeam上计算费用。

!!! 注意事项
    **以下内容仅供参考**。自本文撰写以来，权重和extrinsic的基础花费可能发生变化。请确保您检查实际的值，且勿将以下信息用于生产的应用程序中。

## 费用支付 {: #payment-of-fees }

一般来说，费用支付的过程如下：

1. 提供所需资产

2. 必须协商资产交换的计算时间（或权重）

3. 在提供的权重限制或资金足够执行的情况下，XCM将会如指令描述运行

每条链皆能够配置XCM费用的组成，以及使用哪些Token支付（不论是本地或是外部资产）。举例来说：

- **Polkadot和Kusama** - XCM执行费用分别以DOT或KSM结算，并支付给区块验证人
- **Moonbeam和Moonriver** - XCM执行费用可以使用本地储备资产（分别为GLMR或MOVR）支付，但用户也可以使用源自其他链的资产支付，如果这些资产已注册为[XCM执行资产](/builders/interoperability/xcm/xc-registration/assets/){target=_blank}。当XCM执行（Token转移或远程执行）以本地储备资产（GLMR或MOVR）支付时，{{ networks.moonbeam.treasury.tx_fees_burned }}%的费用将被销毁，而{{ networks.moonbeam.treasury.tx_fees_allocated }}%的费用将被发送至财政库。当XCM执行以外部资产支付时，费用将发送至财政库

您可以想象以下情景：Alice在Polkadot上拥有一定数量的DOT，她想要传送至Moonbeam给Alith。Alice因此传送了一个包含一系列XCM指令的XCM消息，将从Alice Polkadot上的账户拿取一定量的DOT并将铸造相同数量的xcDOT至Alith的账户。部分指令将会在Polkadot上执行，而其他部分指令将会在Moonbeam上执行。

那究竟Alice是如何在Moonbeam完成支付，执行她的指令完成其请求？她的请求将会通过一系列包含在XCM消息中的XCM指令完成，允许其在扣除相关XCM执行费用后购买执行时间。此处的执行时间将会用于发行和转移xcDOT，xcDOT为DOT在Moonbeam上的表现形式。这代表当Alice传送一些DOT至Alith在Moonbeam上的账户时，她将会在扣除XCM执行费用后获得与原先DOT数量比例为1:1的xcDOT。请注意在此情境中，XCM的执行费用以xcDOT支付，并发送给财政库。

Alice请求的资产转移过程如下：

1. 资产将会传送给Moonbeam在Polkadot上的账户（主权账户），并在收到资产后传送XCM消息至Moonbeam

2. 传送至Moonbeam的XCM消息将会：

    1. 铸造相关资产在Moonbeam的表现形式

    2. 购买相应执行时间

    3. 使用执行时间在扣除执行费用后将资产在Moonbeam上的表现形式存入目标账户

### XCM指令 {: #xcm-instructions }

一个XCM消息由一系列的XCM指令组成，而不同的XCM指令组合将会导向不同的执行动作。举例而言，要将DOT传送至Moonbeam，将会使用以下XCM指令：

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/overview/DOT-to-xcDOT-instructions.md'

要检查XCM消息中的指令是如何构建，以传送自有资产至目标链，例如传送DOT至Moonbeam，您可以参考[X-Tokens Open Runtime Module Library](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/moonbeam-{{ polkadot_sdk }}/xtokens){target=_blank}（作为范例）。查看[`transfer_self_reserve_asset`](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/moonbeam-{{ polkadot_sdk }}/xtokens/src/lib.rs#L679){target=_blank}函数，您将会看到其调用`TransferReserveAsset`并输入`assets`、`dest`和`xcm`作为参数。详细来说，`xcm`参数包含`BuyExecution`和`DepositAsset`指令。如果您导向至Polkadot GitHub库，您可以找到[`TransferReserveAsset`指令](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-executor/src/lib.rs#L511){target=_blank}。此XCM消息由使用`xcm`参数的`ReserveAssetDeposited`和`ClearOrigin`指令组成，如上所示其中包含`BuyExecution`和`DepositAsset`指令。

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/overview/xcDOT-to-DOT-instructions.md'

要检查XCM消息中的指令是如何构建，以传送自有资产至目标链，例如传送xcDOT至Polkadot，您可以参考[X-Tokens Open Runtime Module Library](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/moonbeam-{{ polkadot_sdk }}/xtokens){target=_blank}。查看 [`transfer_to_reserve`](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/moonbeam-{{ polkadot_sdk }}/xtokens/src/lib.rs#L696){target=_blank}函数，您将会看到其调用`WithdrawAsset`和`InitiateReserveWithdraw`，并输入`assets`、`dest`和`xcm`作为参数。详细来说，`xcm`参数包含`BuyExecution`和`DepositAsset`指令。如果您导向至Polkadot GitHub库，您可以找到[`InitiateReserveWithdraw`指令](https://github.com/paritytech/polkadot-sdk/blob/{{polkadot_sdk}}/polkadot/xcm/xcm-executor/src/lib.rs#L639){target=_blank}。此XCM消息由使用`xcm`参数的`WithdrawAsset`和`ClearOrigin`指令组成，如上所述其中包含`BuyExecution`和`DepositAsset`指令。

## 中继链XCM费用计算 {: #rel-chain-xcm-fee-calc }

Substrate已推出一个权重系统，决定一个函数的权重，也就是从计算花费的角度决定一个extrinsic的昂贵程度。一个权重单位被定义为一皮秒的执行时间。当在支付费用时，除了如网络拥塞的情况外，用户将会根据所调用函数的权重支付交易费用。

以下部分将会解释如何在Polkadot和Kusama计算XCM费用。请注意，Kusama特别使用基准化的数据决定XCM指令的总权重花费，因部分XCM指令可能包含数据库的读写，这将增加调用的权重。

目前在Polkadot和Kusama中有两个可用数据库，RocksDB（预设）和ParityDB，两者皆在每个网络具有不同的相关权重花费。

### Polkadot {: #polkadot }

Polkadot上的总权重花费包括：给定指令本身的费用和数据库读写的费用。Polkadot对指令和数据库读写操作使用基准化的权重。以下为数据库执行权重花费的细节：

|                                                                                      Database                                                                                      |                         Read                         |                         Write                         |
|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------:|:-----------------------------------------------------:|
| [RocksDB (default)](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/constants/src/weights/rocksdb_weights.rs){target=_blank} | {{ networks.polkadot.rocks_db.read_weight.display }} | {{ networks.polkadot.rocks_db.write_weight.display }} |
|     [ParityDB](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/constants/src/weights/paritydb_weights.rs){target=_blank}     |    {{ networks.polkadot.parity_db.read_weight }}     |    {{ networks.polkadot.parity_db.write_weight }}     |

现在您已了解Polkadot上数据库读写的权重花费，您可以使用指令的基础权重来计算给定指令的权重花费。

举例来说，[`WithdrawAsset`指令](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L55-L63){target=_blank}的基础权重为`{{ networks.polkadot.xcm_instructions.withdraw.base_weight.display }}`，并执行一次数据库读取和一次数据库写入。因此，`WithdrawAsset`指令的总权重花费计算如下：

```text
{{ networks.polkadot.xcm_instructions.withdraw.base_weight.numbers_only }} + {{ networks.polkadot.rocks_db.read_weight.numbers_only }} + {{ networks.polkadot.rocks_db.write_weight.numbers_only }} = {{ networks.polkadot.xcm_instructions.withdraw.total_weight.numbers_only }}
```

[`BuyExecution`指令](https://github.com/polkadot-fellows/runtimes/blob/{{networks.polkadot.spec_version}}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L70-L76){target=_blank}的基础权重为`{{ networks.polkadot.xcm_instructions.buy_exec.base_weight }}`，并不包括任何数据库的读取和写入。因此，`BuyExecution`指令的总权重花费为`{{ networks.polkadot.xcm_instructions.buy_exec.total_weight }}`。

在Polkadot上，基准化的基础权重分为两类：可替代的和通用的。可替代权重适用于涉及移动资产的XCM指令，通用权重适用于其他所有内容。您可以直接在Polkadot Runtime中查看[可替代资产](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L50){target=_blank}和[通用资产](https://github.com/polkadot-fellows/runtimes/blob/{{networks.polkadot.spec_version}}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L46){target=_blank}的当前权重。

在指令权重花费的计算架构完成后，您能够以DOT为单位计算指令的花费。

在Polkadot中，[`ExtrinsicBaseWeight`](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/constants/src/weights/extrinsic_weights.rs#L56){target=_blank}被设置为`{{ networks.polkadot.extrinsic_base_weight.display }}`，也就是[一分的十分之一](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/constants/src/lib.rs#L89){target=blank}。一分为`10^10 / 100`。

因此您可以使用以下公式计算一个XCM指令的执行费用：

```text
XCM-DOT-Cost = XCMInstrWeight * DOTWeightToFeeCoefficient
```

其中，`DOTWeightToFeeCoefficient`为常量（为一分），并可以通过以下计算获得：

```text
DOTWeightToFeeCoefficient = 10^10 / ( 10 * 100 * DOTExtrinsicBaseWeight )
```

使用实际数值：

```text
DOTWeightToFeeCoefficient = 10^10 / ( 10 * 100 * {{ networks.polkadot.extrinsic_base_weight.numbers_only }} )
```

最后，`DOTWeightToFeeCoefficient`将会等于`{{ networks.polkadot.xcm_instructions.planck_dot_weight }} Planck-DOT`。现在，您可以开始以DOT为单位计算最终费用，并使用`DOTWeightToFeeCoefficient`作为常量和`TotalWeight`作为变量：

```text
XCM-Planck-DOT-Cost = TotalWeight * DOTWeightToFeeCoefficient
XCM-DOT-Cost = XCM-Planck-DOT-Cost / DOTDecimalConversion
```

因此，`WithdrawAsset`指令的实际计算方式如下：

```text
XCM-Planck-DOT-Cost = {{ networks.polkadot.xcm_instructions.withdraw.total_weight.numbers_only }} * {{ networks.polkadot.xcm_instructions.planck_dot_weight }} 
XCM-DOT-Cost = {{ networks.polkadot.xcm_instructions.withdraw.planck_dot_cost }} / 10^10
```

该特定指令的总花费为`{{ networks.polkadot.xcm_instructions.withdraw.dot_cost }} DOT`。

作为范例，您可以使用以下权重和指令花费计算传送一条XCM消息以转移xcDOT至DOT到Polkadot网络上所需的总花费：

|                                                                                            Instruction                                                                                             |                                 Weight                                 |                                Cost                                 |
|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------:|:-------------------------------------------------------------------:|
| [`WithdrawAsset`](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L55-L63){target=_blank}  | {{ networks.polkadot.xcm_instructions.withdraw.total_weight.display }} |   {{ networks.polkadot.xcm_instructions.withdraw.dot_cost }} DOT    |
|   [`ClearOrigin`](https://github.com/polkadot-fellows/runtimes/blob/{{networks.polkadot.spec_version}}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L129-L135){target=_blank}   |   {{ networks.polkadot.xcm_instructions.clear_origin.total_weight }}   | {{ networks.polkadot.xcm_instructions.clear_origin.dot_cost }} DOT  |
|   [`BuyExecution`](https://github.com/polkadot-fellows/runtimes/blob/{{networks.polkadot.spec_version}}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L70-L76){target=_blank}    |     {{ networks.polkadot.xcm_instructions.buy_exec.total_weight }}     |   {{ networks.polkadot.xcm_instructions.buy_exec.dot_cost }} DOT    |
| [`DepositAsset`](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L147-L155){target=_blank} |  {{ networks.polkadot.xcm_instructions.deposit_asset.total_weight }}   | {{ networks.polkadot.xcm_instructions.deposit_asset.dot_cost }} DOT |
|                                                                                             **TOTAL**                                                                                              |        **{{ networks.polkadot.xcm_message.transfer.weight }}**         |      **{{ networks.polkadot.xcm_message.transfer.cost }} DOT**      |

### Kusama {: #kusama }

Kusama上的总权重花费包括：给定指令本身的费用和数据库读写的费用。尚未对数据库读写操作进行基准测试，而对指令权重进行了基准测试。以下为数据库执行权重花费的细节：

|                                                                                    Database                                                                                    |                        Read                        |                        Write                        |
|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------:|:---------------------------------------------------:|
| [RocksDB (default)](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/constants/src/weights/rocksdb_weights.rs){target=_blank} | {{ networks.kusama.rocks_db.read_weight.display }} | {{ networks.kusama.rocks_db.write_weight.display }} |
|     [ParityDB](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/constants/src/weights/paritydb_weights.rs){target=_blank}     |    {{ networks.kusama.parity_db.read_weight }}     |    {{ networks.kusama.parity_db.write_weight }}     |

现在你已经了解了在Kusama上进行数据库读写的权重成本，你可以使用指令的基础权重来计算特定指令的权重成本。

举例来说，[`WithdrawAsset`指令](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L54-L62){target=_blank}的基础权重为`{{ networks.kusama.xcm_instructions.withdraw.base_weight.display }}`，并执行一次数据库读取和一次数据库写入。因此，`WithdrawAsset`指令的总权重花费计算如下：

```text
{{ networks.kusama.xcm_instructions.withdraw.base_weight.numbers_only }} + {{ networks.kusama.rocks_db.read_weight.numbers_only }} + {{ networks.kusama.rocks_db.write_weight.numbers_only }} = {{ networks.kusama.xcm_instructions.withdraw.total_weight.numbers_only }}
```

[`BuyExecution`指令](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L76-L82){target=_blank}的基础权重为`{{ networks.kusama.xcm_instructions.buy_exec.base_weight }}`，并不包括任何数据库的读取和写入。因此，`BuyExecution`指令的总权重花费为`{{ networks.kusama.xcm_instructions.buy_exec.total_weight }}`。

在Kusama上，基准化的基础权重分为两类：可替代的和通用的。可替代权重适用于涉及移动资产的XCM指令，通用权重适用于其他所有内容。您可以直接在Kusama Runtime中查看[可替代资产](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L49){target=_blank}和[通用资产](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L50){target=_blank}的当前权重。

在指令权重花费的计算架构完成后，您能够以KSM为单位计算指令的花费。

在Kusama中，[`ExtrinsicBaseWeight`](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/constants/src/weights/extrinsic_weights.rs#L56){target=_blank}被设置为`{{ networks.kusama.extrinsic_base_weight.display }}`，也就是[一分的十分之一](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/constants/src/lib.rs#L87){target=blank}。一分为`10^12 / 30,000`。

因此您可以使用以下公式计算一个XCM指令的执行费用：

```text
XCM-KSM-Cost = XCMInstrWeight * KSMWeightToFeeCoefficient
```

其中，`KSMWeightToFeeCoefficient`为常量（为一分），并可以通过以下计算获得：

```text
KSMWeightToFeeCoefficient = 10^12 / ( 10 * 3000 * KSMExtrinsicBaseWeight )
```

使用实际数值：

```text
KSMWeightToFeeCoefficient = 10^12 / ( 10 * 3000 * {{ networks.kusama.extrinsic_base_weight.numbers_only }} )
```

最后，`KSMWeightToFeeCoefficient`将会等于`{{ networks.kusama.xcm_instructions.planck_ksm_weight }} Planck-KSM`。现在，您可以开始以KSM为单位计算最终费用，并使用`KSMWeightToFeeCoefficient`作为常量和`TotalWeight` ({{ networks.kusama.xcm_instructions.withdraw.total_weight.display }})作为变量：

```text
XCM-Planck-KSM-Cost = TotalWeight * KSMWeightToFeeCoefficient
XCM-KSM-Cost = XCM-Planck-KSM-Cost / KSMDecimalConversion
```

因此，`WithdrawAsset`指令的实际计算方式如下：

```text
XCM-Planck-KSM-Cost = {{ networks.kusama.xcm_instructions.withdraw.total_weight.numbers_only }} * {{ networks.kusama.xcm_instructions.planck_ksm_weight }} 
XCM-KSM-Cost = {{ networks.kusama.xcm_instructions.withdraw.planck_ksm_cost }} / 10^12
```

该特定指令的总花费为`{{ networks.kusama.xcm_instructions.withdraw.ksm_cost }} KSM`。

作为范例，您可以使用以下权重和指令花费计算传送一条XCM消息以转移xcKSM至KSM到Kusama网络上所需的总花费：

|                                                                                          Instruction                                                                                           |                                Weight                                |                               Cost                                |
|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------:|:-----------------------------------------------------------------:|
| [`WithdrawAsset`](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L54-L62){target=_blank}  | {{ networks.kusama.xcm_instructions.withdraw.total_weight.display }} |   {{ networks.kusama.xcm_instructions.withdraw.ksm_cost }} KSM    |
|   [`ClearOrigin`](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L135-L141){target=_blank}   |   {{ networks.kusama.xcm_instructions.clear_origin.total_weight }}   | {{ networks.kusama.xcm_instructions.clear_origin.ksm_cost }} KSM  |
|   [`BuyExecution`](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L76-L82){target=_blank}    |     {{ networks.kusama.xcm_instructions.buy_exec.total_weight }}     |   {{ networks.kusama.xcm_instructions.buy_exec.ksm_cost }} KSM    |
| [`DepositAsset`](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L132-L140){target=_blank} |  {{ networks.kusama.xcm_instructions.deposit_asset.total_weight }}   | {{ networks.kusama.xcm_instructions.deposit_asset.ksm_cost }} KSM |
|                                                                                           **TOTAL**                                                                                            |        **{{ networks.kusama.xcm_message.transfer.weight }}**         |      **{{ networks.kusama.xcm_message.transfer.cost }} KSM**      |

## 基于Moonbeam网络的XCM费用计算 {: #moonbeam-xcm-fee-calc }

Substrate已推出一个权重系统，决定一个函数的权重，也就是从计算成本的角度决定一个extrinsic的昂贵程度。一个权重单位被定义为一皮秒的执行时间。当在支付费用时，用户将会根据所调用函数的权重支付交易费用，接着每个平行链皆可以决定如何将权重转换至费用，举例而言，计算交易大小或是存储花费的额外费用。

对于所有基于Moonbeam的网络，通用XCM指令是通过基准化测试的，而可替代XCM指令仍然使用每条指令的固定权重。因此，基准化的XCM指令的总权重花费除了考虑给定指令所需的权重外，还考虑数据库读取和写入的次数。以下为数据库执行权重花费的细节：

|                                                                              Database                                                                               |                   Read                    |                   Write                    |
|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------:|:------------------------------------------:|
| [RocksDB (default)](https://github.com/paritytech/polkadot-sdk/blob/{{polkadot_sdk}}/substrate/frame/support/src/weights/rocksdb_weights.rs#L27-L28){target=_blank} | {{ xcm.db_weights.rocksdb_read.display }} | {{ xcm.db_weights.rocksdb_write.display }} |

现在您已了解Moonbase Alpha上数据库读写的权重花费，您可以使用指令的基础权重和额外的数据库读写（如果适用）来计算可替代和通用XCM指令的权重花费。

举例来说，`WithdrawAsset`指令是可替代XCM指令的一部分。因此，这并没有进行基准测试。[`WithdrawAsset`指令](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/fungible.rs#L38){target=_blank}总权重花费为`{{ xcm.fungible_weights.display }}`，不包括转移本地XC-20的花费。本地XC-20的`WithdrawAsset`指令的总权重花费基于以太坊gas和Substrate权重的转换。

[`BuyExecution`指令](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/generic.rs#L128-L129){target=_blank}的基础权重为`{{ xcm.generic_weights.buy_exec.base_weight.display }}`，并执行4个数据库的读取（`assetManager` pallet用于获取`unitsPerSecond`）。因此，`BuyExecution`指令的总权重花费计算如下：

```text
{{ xcm.generic_weights.buy_exec.base_weight.numbers_only }} + 4 * {{ xcm.db_weights.rocksdb_read.numbers_only }} = {{ xcm.generic_weights.buy_exec.total_weight.numbers_only }}
```

您可以在以下表格中获取所有XCM指令的权重值，这适用于所有基于Moonbeam的网络：

|                                                                                    Benchmarked Instructions                                                                                     |                                                                                   Non-Benchmarked Instructions                                                                                    |
|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| [Generic XCM Instructions](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/generic.rs#L93){target=_blank} | [Fungible XCM Instructions](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/fungible.rs#L30){target=_blank} |

以下部分将展开概述如何计算基于Moonbeam网络的XCM费用。主要包含两种情况：

 - 以本地储备Token支付费用（如GLMR、MOVR或DEV等本地Token）
 - 以外部资产（如XC-20）支付费用

### 储备资产的费用计算 {: #moonbeam-reserve-assets }

对于每个XCM指令，权重单位将会被转换为余额单位作为费用计算的一部分。每个基于Moonbeam网络单个权重单位的Wei数量分别如下：

|                                                                                                  Moonbeam                                                                                                  |                                                                                                   Moonriver                                                                                                   |                                                                                               Moonbase Alpha                                                                                               |
|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| [{{ networks.moonbeam.xcm.instructions.wei_per_weight.display }}](https://github.com/moonbeam-foundation/moonbeam/blob/{{networks.moonbeam.spec_version}}/runtime/moonbeam/src/lib.rs#L138){target=_blank} | [{{ networks.moonriver.xcm.instructions.wei_per_weight.display }}](https://github.com/moonbeam-foundation/moonbeam/blob/{{networks.moonriver.spec_version}}/runtime/moonriver/src/lib.rs#L143){target=_blank} | [{{ networks.moonbase.xcm.instructions.wei_per_weight.display }}](https://github.com/moonbeam-foundation/moonbeam/blob/{{networks.moonbase.spec_version}}/runtime/moonbase/src/lib.rs#L147){target=_blank} |

这意味着以Moonbeam为例，计算一个XCM指令以储备资产作为费用的公式如下：

```text
XCM-Wei-Cost = XCMInstrWeight * WeiPerWeight
XCM-GLMR-Cost = XCM-Wei-Cost / 10^18
```

因此，可替代指令的实际计算如下：

```text
XCM-Wei-Cost = {{ xcm.fungible_weights.numbers_only }} * {{ networks.moonbeam.xcm.instructions.wei_per_weight.numbers_only }}
XCM-GLMR-Cost = {{ networks.moonbeam.xcm.transfer_glmr.wei_cost }} / 10^18
```

最后，在Moonbeam上一个XCM指令的总费用为`{{ networks.moonbeam.xcm.transfer_glmr.glmr_cost }} GLMR`。

### 外部资产的费用计算 {: #fee-calc-external-assets }

考虑Alice在Moonbeam上向Alith的账户发送DOT的场景，费用从Alith收到的xcDOT金额中收取。要确定支付多少费用，Moonbeam使用了一个名为`UnitsPerSecond`的概念，代表网络在XCM执行时间内每秒收取的Token单位（包含小数）。 Moonbeam（可能还有其他平行链）将使用此概念来确定使用与其储备不同的资产执行XCM的费用。

此外，在Moonbeam上执行XCM可以通过资产源链的多种资产（[XC-20s](/builders/interoperability/xcm/xc20/overview/){target=_blank}）支付。举例来说，在撰写本文时，从[Kusama Asset Hub](https://polkadot.js.org/apps/?rpc=wss://kusama-asset-hub-rpc.polkadot.io#/explorer){target=_blank}（原为Statemine）发送的XCM消息可以用xcKSM、xcRMRK或xcUSDT支付。只要该资产在Moonbeam/Moonriver中设置了`UnitsPerSecond`，它就可以用于为来自该特定链的XCM消息支付XCM执行费用。

要找出给定的资产的`UnitsPerSecond`，您可以使用以下脚本，该脚本查询`assetManager.assetTypeUnitsPerSecond`，并传入对应资产的multilocation。如果您不确定multilocation，可以使用`assetManager.assetIdType`查询进行检索。

```js
--8<-- 'code/builders/interoperability/xcm/core-concepts/weights-fees/units-per-second.js'
```

当您运行脚本后，您应该在终端看到`The UnitsPerSecond for xcDOT is 33,068,783,068`。

请记住，一个权重单位被定义为一皮秒的执行时间。 因此，确定执行时间的计算公式如下：

```text
ExecutionTime = Weight / Picosecond
```

要确定Alice将DOT传送到Moonbeam的总权重，您需要传送所需的4个XCM指令中每一个的权重：

|                                                                                           Instruction                                                                                           |                            Weight                             |
|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------:|
| [`ReserveAssetDeposited`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/fungible.rs#L71){target=_blank} |              {{ xcm.fungible_weights.display }}               |
|      [`ClearOrigin`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/generic.rs#L191){target=_blank}      |        {{ xcm.generic_weights.clear_origin.display }}         |
|   [`BuyExecution`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/generic.rs#L128-L129){target=_blank}   |    {{ xcm.generic_weights.buy_exec.total_weight.display }}    |
|     [`DepositAsset`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/fungible.rs#L60){target=_blank}      |              {{ xcm.fungible_weights.display }}               |
|                                                                                            **TOTAL**                                                                                            | {{ networks.moonbeam.xcm.transfer_dot.total_weight.display }} |

!!! 注意事项
    对于`BuyExecution`指令，[4个数据库读取的权重单位](#moonbeam-xcm-fee-calc)如上表所述。

获得总权重后，您可以使用以下计算公式来计算Alice将DOT转移到Moonbeam的执行时间：

```text
ExecutionTime = {{ networks.moonbeam.xcm.transfer_dot.total_weight.numbers_only }} / 10^12
```

这代表4个XCM指令需花费`{{ networks.moonbeam.xcm.transfer_dot.exec_time }}`秒的区块执行时间。

要计算以xcDOT为单位的总花费，您将需要资产的单位位数作为查询，以xcDOT为例，其资产单位为10个位数。您可以通过[检索资产元数据](/builders/interoperability/xcm/xc20/overview/#list-xchain-assets){target=_blank}查询资产的单位位数。

区块执行的公式可以用于决定Alice转移DOT至Alith在Moonbeam上账户所需的花费，以下为总花费的计算公式：

```text
XCM-Cost = ( UnitsPerSecond / DecimalConversion ) * ExecutionTime
```

转移花费的计算公式如下：

```text
XCM-Cost = ( {{ networks.moonbeam.xcm.units_per_second.xcdot.numbers_only }} / 10^10 ) * {{ networks.moonbeam.xcm.transfer_dot.exec_time }}
```

Alice转移DOT至Alith账户的总花费为`{{ networks.moonbeam.xcm.transfer_dot.xcdot_cost }} xcDOT` xcDOT。
