---
title: 将XC-20s发送至其他链
description: 学习如何使用X-Tokens pallet将XC-20s发送至其他链。另外，X-Tokens预编译允许您通过以太坊API访问核心功能。
---

# 使用X-Tokens Pallet发送XC-20s

## 概览 {: #introduction }

为同质化资产转移构建XCM消息通道并非一件易事。因此，开发者可以通过利用wrapper函数/pallet在Polkadot/Kusama上使用XCM功能。

此类包装器的一个示例是[X-Tokens](https://github.com/open-web3-stack/open-runtime-module-library/tree/master/xtokens){target=_blank} Pallet，用于提供通过XCM转移同质化资产的不同方法。

本教程将向您展示如何利用X-Tokens Pallet在生态系统（中继链/平行链）中从基于Moonbeam的网络发送[XC-20s](/builders/interoperability/xcm/xc20/overview/){target=_blank}至其他链。此外，您还将学习如何使用X-Tokens预编译通过以太坊API执行同样的操作。

**开发者须知若发送不正确的XCM消息可能会导致资金丢失。**因此，XCM功能需先在测试网上进行测试后才可移至生产环境。

## XCM相关定义 {: #relevant-definitions }

本教程假设您已经拥有基础的XCM知识。如果没有，请阅读[XCM概览](/builders/interoperability/xcm/overview){target=_blank}页面。

对于本指南，您需要了解以下定义：

--8<-- 'text/builders/interoperability/xcm/general-xcm-definitions2.md'

## X-Tokens Pallet接口 {: #x-tokens-pallet-interface }

### Extrinsics {: #extrinsics }

X-Tokens Pallet提供以下extrinsics（函数）：

 - **transfer**(currencyId, amount, dest, destWeightLimit) — 转移一个币种，根据原生Token（自身储备）或是资产ID定义
 - **transferMultiasset**(asset, dest, destWeightLimit) — 转移一种同质化资产，根据其multilocation定义
 - **transferMultiassetWithFee**(asset, fee, dest, destWeightLimit) — 转移一种同质化资产，但其能够让资产的发送者使用另外一种资产支付转移费用。两者皆根据其multilocation定义
 - **transferMultiassets**(assets, feeItem, dest, destWeightLimit) — 转移多种同质化资产，并定义其中哪种资产将会被用于支付转移费用。所有资产皆由其multilocation定义
 - **transferMulticurrencies**(currencies, feeItem, dest, destWeightLimit) — 转移多个币种，并定义其中哪种币种将会被用于支付转移费用。所有币种都将通过原生Token（自身储备）或是资产ID定义
 - **transferWithFee**(currencyId, amount, fee, dest, destWeightLimit) — 转移一个币种，但允许资产发送者使用不同的资产支付转移费用。两者皆由其multilocation定义

其中需要提供消息输入的函数定义如下：

 - **currencyId/currencies** — 将通过XCM转移的币种ID。不同runtime有不同的方法定义ID。以基于Moonbeam的网络为例子，币种可以被定义为：

    - `SelfReserve` - 代表原生Token
    - `ForeignAsset` - 代表[外部XC-20](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=_blank}（请不要与XC-20地址混淆）的资产ID
    - `LocalAssetReserve` - *弃用* 通过使用`Erc20`货币类型来使用 [local XC-20s](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}
    - `Erc20` - 代表[本地XC-20（ERC-20）](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}的合约地址

 - **amount** — 将通过XCM转移的Token数量
 - **dest** — 一个multilocation，用于定义将通过XCM转移Token的目标地址。其支持不同地址格式，如20或32字节的地址（以太坊或是Substrate格式）
 - **destWeightLimit** — 一个枚举，表示您提供给目标链希望其执行XCM消息的最大执行时间。该枚举包含以下选项：

    - `Unlimited` - 允许使用全部gas来支付权重
    - `Limited` - 将gas的使用量限制为特定值

    如果您提供的权重不足，XCM将会执行失败，且资金将会被锁定在主权账户或是特定的pallet中。**正确设置目标权重非常重要，这将避免XCM失败**

 - **asset/assets** — 个用于定义通过XCM转移资产的multilocation。每条平行链将会有不同定义资产的方式。举例而言，基于Moonbeam的网络将会由其原生Token的Balances Pallet索引定义
 - **fee** — 一个用于定义支付XCM在目标链上执行的multilocation
 - **feeItem** — 一个用于定义发送多样资产位置的索引，将用于支付XCM在目标链上的执行。举例而言，如果仅发送一种资产，`feeItem`将会是`0`

### 存储函数 {: #storage-methods }

X-Tokens Pallet包含以下只读存储函数：

- **palletVersion**() - 提供正在使用的X-Tokens Pallet的版本

### Pallet常量 {: #constants }

X-Tokens Pallet包含以下只读函数以获取pallet常量：

- **baseXcmWeight**() - 返回执行所需的基础XCM权重
- **selfLocation**() - 返回链的multilocation

## XCM Instructions for Transfers via X-Tokens {: #xcm-instructions }

X-Tokens Pallet使用的XCM指令定义于[X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/polkadot-{{networks.polkadot.spec_version}}/xtokens){target=_blank}。

无论用的是哪一个传输方法，将原生资产送回其原始链（例如，xcDOT从Moonbeam返回Polkadot）和将原生资产从原始链发送到目标链（例如，DOT从Polkadot发送到Moonbeam）的操作指示都是相同的。

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/overview/DOT-to-xcDOT-instructions.md'

学习更多关于如何使用搭建XCM指令来传输本地资产至目标链，比如将Dot发送至Moonbeam，您可以参考[X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/polkadot-{{networks.polkadot.spec_version}}/xtokens){target=_blank}作为例子。您可能需要[`transfer_self_reserve_asset`](https://github.com/open-web3-stack/open-runtime-module-library/blob/polkadot-{{networks.polkadot.spec_version}}/xtokens/src/lib.rs#L680){target=_blank}这个函数。在这个函数中，您会发现它调用了`TransferReserveAsset`函数并且使用了`assets`, `dest`, 与 `xcm`三个参数。其中`xcm`参数包括了`BuyExecution`与`DepositAsset`指令。您可以访问Polkadot的Github库，在那您可以找到[`TransferReserveAsset`](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/xcm-executor/src/lib.rs#L514){target=_blank}这个指令。这条XCM消息结合了`ReserveAssetDeposited`指令，`ClearOrigin`指令与`xcm`参数，`xcm`参数包括`BuyExecution`和`DepositAsset`指令。

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/overview/xcDOT-to-DOT-instructions.md'

学习更多关于如何使用搭建XCM指令来传输本地资产至目标链，比如将xcDOT发送至Polkadot，您可以参考[X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/polkadot-{{networks.polkadot.spec_version}}/xtokens){target=_blank}作为例子。您可能需要[`transfer_to_reserve`](https://github.com/open-web3-stack/open-runtime-module-library/blob/polkadot-{{networks.polkadot.spec_version}}/xtokens/src/lib.rs#L697){target=_blank}这个函数。在这个函数中，您会发现它调用了`WithdrawAsset`函数，然后调用`InitiateReserveWithdraw`并且使用了`assets`, `dest`, 与 `xcm`三个参数。其中`xcm`参数包括了`BuyExecution`与`DepositAsset`指令。您可以访问Polkadot的Github库，在那您可以找到[`InitiateReserveWithdraw` instruction](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/xcm-executor/src/lib.rs#L638){target=_blank}这个指令。这条XCM消息结合了`WithdrawAsset`指令，`ClearOrigin`指令与`xcm`参数，`xcm`参数包括`BuyExecution`和`DepositAsset`指令。

## 使用X-Tokens Pallet构建XCM消息 {: #build-xcm-xtokens-pallet}

此教程将会包含使用X-Tokens Pallet构建XCM消息的过程，更详细来说为使用`transfer`和`transferMultiasset`函数。然而，这两种情况仍然可以外推至其他函数，特别是当您熟悉了multilocation的使用之后。

!!! 注意事项
    每条平行链皆能够通过pallet允许/禁止特定函数。因此，开发者需要确认使用的函数是被平行链允许的。相反来说，如果使用了被禁止的函数，交易将会如同`system.CallFiltered`显示一般失败。

本教程将以转移xcUNIT Token为例。xcUNIT是Alphanet中继链Token的[XC-20](/builders/interoperability/xcm/xc20/overview){target=_blank}形式。本教程也同样适用于其他XC-20 Token。

### 查看先决条件 {: #xtokens-check-prerequisites}

要跟随本教程操作，您需要准备以下内容：

- 一个拥有资金的账户。
 --8<-- 'text/_common/faucet/faucet-list-item.md'
- 一些xcUNIT Token。您可以在[Moonbeam-Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}上将DEV Token（Moonbase Alpha的原生Token）兑换成xcUNIT。Moonbeam-Swap是Moonbase Alpha上的Uniswap-V2版本的示范协议。

    ![Moonbeam Swap xcUNIT](/images/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/xtokens-1.png)

要查看您的xcUNIT余额，您可以使用以下地址将XC-20添加至MetaMask：

```text
0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
```

!!! 注意事项
    想要了解如何计算预编译地址，您可以查看[计算外部XC-20预编译地址](/builders/interoperability/xcm/xc20/overview/#calculate-xc20-address){target=_blank}教程。

本教程也同样适用于其他的[外部XC-20或本地XC-20](/builders/interoperability/xcm/xc20/overview){target=_blank}。如果您要针对另一个外部XC-20调整本教程，您需要拥有要转移资产的资产ID以及该资产的小数位数，您可以根据[外部XC-20s的检索列表](/builders/interoperability/xcm/xc20/overview/#list-xchain-assets){target=_blank}获取这些信息。如果您要针对本地XC-20调整本教程，则需要拥有XC-20的合约地址。

如果您要转移本地XC-20，请注意每个网络的转移仅限于以下gas单位：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.erc20_xcm.transfer_gas_limit }}
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.erc20_xcm.transfer_gas_limit }}
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.erc20_xcm.transfer_gas_limit }}
    ```

### X-Tokens转移函数 {: #xtokens-transfer-function}

在本示例中，您将会构建一个XCM消息，通过X-Tokens Pallet的`transfer`函数将xcUNIT从Moonbase Alpha转移回其中继链上。为此，您需要使用[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api){target=_blank}。

由于您将使用X-Tokens Pallet的`transfer`函数进行交互，您可以执行以下步骤来获取`currencyId`、`amount`、`dest`和`destWeightLimit`的参数：

1. 定义`currencyId`。对于外部XC-20，您将使用`ForeignAsset`货币类型和资产ID，在本示例中为`42259045809535163221576417993425387648`。对于本地XC-20，您将需要Token地址。在JavaScript中，将翻译为：

    === "外部XC-20"

        ```js
        const currencyId = { 
          ForeignAsset: { 
            ForeignAsset: 42259045809535163221576417993425387648n 
          } 
        };
        ```

    === "本地XC-20"

        ```js
        const currencyId = { Erc20: { contractAddress: 'INSERT_ERC_20_ADDRESS' } };
        ```

2. 指定要转移的`amount`。在本示例中，您将发送1个xcUNIT，即有12位小数位：

    ```js
    const amount = 1000000000000n;
    ```

3. 定义目的地的multilocation，这将定位来自Moonbase Alpha的中继链上的账户。请注意，中继链可以接收的唯一资产是它自己的：

    ```js
    const dest = { 
      V3: { 
        parents: 1, 
        interior: { X1: { AccountId32: { id: relayAccount } } } 
      } 
    };
    ```

    !!! 注意事项
        对于`AccountId32`、`AccountIndex64`或`AccountKey20`，您可以选择指定`network`参数。如果不指定，则默认为`None`。

4. 将`destWeightLimit`设置为`Unlimited`。在JavaScript中，您需要将`Unlimited`设置为`null`（如[`XcmV3WeightLimit`的TypeScript接口](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/typescript-api/src/moonbase/interfaces/augment-api-tx.ts#L3045){target=_blank}中所述）：

    ```js
    const destWeightLimit = { Unlimited: null };
    ```

    !!! 注意事项
        如果您想限制目标权重，可以使用`Limited`来实现，这需要您输入`refTime`和`proofSize`的值。其中`refTime`是可用于执行的计算时间量，`proofSize`是可使用的存储量（以字节为单位）。

        在JavaScript中，这会转换为：
        
        ```js
        { Limited: { refTime: 'INSERT_ALLOWED_AMOUNT', proofSize: 'INSERT_ALLOWED_AMOUNT' } };
        ```

现在您已经有了每个参数的值，您可以编写传送脚本了。 为此，您需要执行以下步骤：

 1. 提供调用的输入数据，这包含：
     - 用于创建提供商的Moonbase Alpha端点URL
     - `transfer`函数的每个参数值
 2. 创建Keyring实例，这将用于传送交易
 3. 创建[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}提供商
 4. 使用`currencyId`、`amount`、`dest`和`destWeightLimit`构建`xTokens.transfer` extrinsic
 5. 使用`signAndSend` extrinsic（函数）和第二步创建的Keyring实例发送交易

!!! 请记住
    本教程仅用于演示目的，请勿将您的私钥存储在JavaScript文件中。

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/transfer.js'
```

!!! 注意事项
    您可以使用以下编码的调用数据在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1e00018080778c30c20fa2ebc0ed18d2cbca1f0010a5d4e800000000000000000000000301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300){target=_blank}上查看上述脚本的示例，该脚本将1个xcUNIT发送到中继链上Alice的账户：`0x1e00018080778c30c20fa2ebc0ed18d2cbca1f0010a5d4e8000000000000000000 00000301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300`。

交易被处理后，中继链上的目标账户应该收到转账金额减去在目标链上执行XCM时扣除的一小笔费用。

### X-Tokens转移MultiAsset（多种资产）函数 {: #xtokens-transfer-multiasset-function}

在本示例中，您将会构建一个XCM消息，通过X-Tokens Pallet的`transferMultiasset`函数将xcUNIT从Moonbase Alpha转移回其中继链上。

由于您将使用X-Tokens Pallet的`transferMultiasset`函数进行交互，您可以执行以下步骤来获取`asset`、`dest`和`destWeightLimit`的参数：

1. 定义`asset`的XCM资产multilocation，这将以Moonbase Alpha为起点的中继链中的UNIT Token为目标。每个链对自己的资产都有不同的看法。因此，您必须为每个目的地设置不同的资产multilocation

    === "外部XC-20"

        ```js
        // Multilocation for UNIT in the relay chain
        const asset = {
          V3: {
            id: {
              Concrete: {
                parents: 1,
                interior: null,
              },
            },
            fun: {
              Fungible: { Fungible: 1000000000000n }, // 1 token
            },
          },
        };
        ```

    === "本地XC-20"

        ```js
        // Multilocation for a local XC-20 on Moonbeam
        const asset = {
          V3: {
            id: {
              Concrete: {
                parents: 0,
                interior: {
                  X2: [{ PalletInstance: 48 }, { AccountKey20: { key: 'INSERT_ERC_20_ADDRESS' } }],
                },
              },
            },
            fun: {
              Fungible: { Fungible: 1000000000000000000n }, // 1 token
            },
          },
        };
        ```

2. 定义`dest`的XCM目的地multilocation，这将以Moonbase Alpha的中继链中的一个账户为起点：

    ```js
    const dest = {
      V3: {
        parents: 1,
        interior: { X1: { AccountId32: { id: relayAccount } } },
      },
    };
    ```

    !!! 注意事项
        对于`AccountId32`、`AccountIndex64`或`AccountKey20`，您可以选择指定`network`参数。如果不指定，则默认为`None`。

3. 将目的地权重限制设置为`Unlimited`。在JavaScript中，您需要将`Unlimited`设置为`null`（如[`XcmV3WeightLimit`的TypeScript接口](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/typescript-api/src/moonbase/interfaces/augment-api-tx.ts#L3045){target=_blank}中所述：

    ```js
    const destWeightLimit = { Unlimited: null };
    ```

    !!! 注意事项
        如果您想限制目的地权重，可以使用`Limited`来实现，这需要您输入`refTime`和`proofSize`的值。其中`refTime`是可用于执行的计算时间量，`proofSize`是可使用的存储量（以字节为单位）。

        在JavaScript中，这会转换为：

        ```js
        { Limited: { refTime: 'INSERT_ALLOWED_AMOUNT', proofSize: 'INSERT_ALLOWED_AMOUNT' } };
        ```

现在您已经有了每个参数的值，您可以编写转移脚本了。为此，您将执行以下步骤：

 1. 提供调用的输入数据，这包含：
     - 用于创建提供商的Moonbase Alpha端点URL
     - `transferMultiasset`函数的每个参数值
 2. 创建Keyring实例，这将用于传送交易
 3. 创建[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}提供商
 4. 使用`asset`、`dest`和`destWeightLimit`创建`xTokens.transferMultiasset` extrinsic
 5. 使用`signAndSend` extrinsic和第二步创建的Keyring实例发送交易

!!! 请记住
    本教程仅用于演示目的，请勿将您的私钥存储在JavaScript文件中。

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/transfer-multiasset.js'
```

!!! 注意事项
    您可以使用以下编码的调用数据在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1e00018080778c30c20fa2ebc0ed18d2cbca1f0010a5d4e800000000000000000000000301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300){target=_blank}上查看上述脚本的示例，该脚本将1个xcUNIT发送到中继链上Alice的账户：`0x1e010300010000070010a5d4e80301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300`。

交易被处理后，中继链上的目标账户应该收到转账金额减去在目标链上执行XCM时扣除的一小笔费用。

## XC-Tokens预编译 {: #xtokens-precompile}

X-Tokens预编译合约将会允许开发者通过基于Moonbeam网络的以太坊API访问XCM Token转移功能。如同其他[预编译合约](/builders/pallets-precompiles/precompiles/){target=_blank}，X-Tokens预编译位于以下地址：

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.xtokens}}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.xtokens}}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.xtokens}}
     ```

--8<-- 'text/builders/pallets-precompiles/precompiles/security.md'

### X-Tokens Solidity接口 {: #xtokens-solidity-interface }

[Xtokens.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank}是一个开发者能够使用以太坊API与X-Tokens Pallet交互的接口。

此接口包含以下函数：

 - **transfer**(*address* currencyAddress, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) — 用于表示[上述示例](#xtokens-transfer-function)中提及的`transfer`函数。然而，在使用币种ID之外，您需要为`currencyAddress`提供资产地址：

    - 对于[外部XC-20s](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=_blank}，您可以提供[XC-20预编译地址](/builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=_blank}
    - 对于原生Token（如GLMR、MOVR和DEV），您可以提供[ERC-20预编译](/builders/pallets-precompiles/precompiles/erc20/#the-erc20-interface){target=_blank}地址，即`{{networks.moonbeam.precompiles.erc20 }}`
    - 对于[本地XC-20s](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}，您可以提供Token的地址

    `destination` multilocation将会以一种特殊形式构建（我们将在下一部分提及）

 - **transferMultiasset**(*Multilocation* *memory* asset, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) — 用于表示[上述示例](#xtokens-transfer-multiasset-function)中提及的`transferMultiasset`函数。两种multilocation将会以一种特殊形式构建（我们将在下一部分提及）

### 构建预编译Multilocation {: #building-the-precompile-multilocation }

在X-Tokens预编译接口中，`Multilocation`结构根据下列函数定义：

--8<-- 'text/builders/interoperability/xcm/xcm-precompile-multilocation.md'

以下代码片段介绍了`Multilocation`结构的一些示例，因为它们需要输入到X-Tokens预编译函数中：

```js
// Multilocation targeting the relay chain or its asset from a parachain
{
    1, // parents = 1
    [] // interior = here
}

// Multilocation targeting Moonbase Alpha DEV token from another parachain
{
    1, // parents = 1
    // Size of array is 2, meaning is an X2 interior
    [
        '0x00000003E8', // Selector Parachain, ID = 1000 (Moonbase Alpha)
        '0x0403' // Pallet Instance = 3
    ]
}

// Multilocation targeting Alice's account on the relay chain from Moonbase Alpha
{
    1, // parents = 1
    // Size of array is 1, meaning is an X1 interior
    [
        '0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300' 
        // AccountKey32 Selector + Address in hex + Network(Option) Null
    ]
}
```

### 使用库与X-Tokens交互 {: #using-libraries-to-interact-with-xtokens}

使用库与以太坊API交互时，Multilocation结构可以像任何其他结构一样进行格式化。以下代码片段包括上述提及的[X-Tokens转移函数](#xtokens-transfer-function)、[X-Tokens多资产转移函数](#xtokens-transfer-multiasset-function)和Multilocation结构示例。您可以在Github上找到[X-Tokens ABI](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-docs/master/.snippets/code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/abi.js){target=_blank}。

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer/web3.py'
    ```

!!! 注意事项
    要在Moonbeam或Moonriver上测试上述示例，您可以将RPC URL替换为您自己的端点和API密钥，您可以从支持的[端点提供商](/builders/get-started/endpoints/){target=_blank}中获取该密钥。
