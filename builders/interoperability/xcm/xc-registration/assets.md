---
title: 注册XC资产
description: 本教程包含您在注册本地或是外部XC-20资产所需了解的信息，让您能够开始通过XCM执行跨链资产转移
---

# 如何注册跨链资产

## 概览 {: #introduction }

通过XCM进行资产跨链转移，两条链之间需要有一个开放的通道，并且资产需要在目标链上注册。如果两条链之间不存在通道，则需要打开一个通道。请查看[XC资产通道注册](/builders/interoperability/xcm/xc-registration/xc-integration){target=_blank}教程，了解如何在Moonbeam和其他链之间建立通道的相关信息。

本教程将向您展示如何在Moonbeam上注册[外部XC-20资产](/builders/interoperability/xcm/xc20/overview#external-xc20s){target=_blank}并提供注册Moonbeam资产所需的信息，包括Moonbeam原生资产（GLMR、MOVR和DEV）以及在其他链上的[本地XC-20资产](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=_blank}（支持XCM的ERC-20s）。

此教程中的范例使用一个CLI工具开发以简化整个流程，您可以在[xcm-tools GitHub库](https://github.com/Moonsong-Labs/xcm-tools)中找到{target=_blank}。

```bash
git clone https://github.com/Moonsong-Labs/xcm-tools && \
cd xcm-tools && \
yarn
```

## 在Moonbeam上注册外部XC-20资产 {: #register-xc-20s }

在Moonbeam上注册外部XC-20资产是一个多步骤的过程，在较高层面上，包含在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}上提议资产注册，以及创建链上治理提案。

如果Moonbeam和资产的源链之间尚不存在通道，则需要打开一个通道。您可以将与通道相关的调用和资产注册调用进行批量处理，如此您只需提交一个提案。您首先需要创建几个论坛帖子：一个[XCM公开](/builders/interoperability/xcm/xc-registration/forum-templates#xcm-disclosures){target=_blank}帖子和一个[XCM提案](/builders/interoperability/xcm/xc-registration/forum-templates#xcm-proposals){target=_blank}帖子。

收集社区成员的反馈后，您可以创建提案以打开通道并注册任何资产。有关打开通道的更多信息，请参阅[与Moonbeam建立XC集成](/builders/interoperability/xcm/xc-registration/xc-integration/){target=_blank}指南。

![Asset registration if XC channel doesn't exist](/images/builders/interoperability/xcm/xc-registration/assets/assets-1.png)

如果链之间已经存在通道，您需要创建论坛帖子来注册资产，收集反馈，然后提交提案来注册资产。

![Asset registration if XC channel exists](/images/builders/interoperability/xcm/xc-registration/assets/assets-2.png)

### 创建一个论坛帖子 {: #create-a-forum-post }

要在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}上创建论坛帖子，您需要确保将帖子添加到正确的类别并添加相关内容。关于一般准则和需遵循的模板，请参阅[XCM集成的Moonbeam社区论坛模板](/builders/interoperability/xcm/xc-registration/forum-templates#){target=_blank}页面。

### 创建提案以注册资产 {: #create-a-proposal }

要在Moonbeam上注册其他链的原生资产，您需要提交一个调用`assetManager.registerForeignAsset` extrinsic的治理提案。除外，您需要通过`assetManager.setAssetUnitsPerSecond` extrinsic设置资产的每秒单位数值。每秒单位数值为Token在XCM转账期间每秒使用执行时间的Token单位。如何计算单位每秒数值将会包含在以下部分。

要开始操作，您需要收集以下资产信息：

- 资产存在的平行链ID
- 资产的元数据，包含：
  - 资产名称
  - 资产符号。您需要在资产符号前加入“xc”以标明该资产为XCM可用资产
  - 该资产的小数位数
  - 每秒单位数值
- 从Moonbeam方面查看的资产multilocation

有了这些信息，您就可以获取两个调用的编码调用数据，并将调用数据批处理到单个交易中。从那里，您可以开始治理流程，其中包括使用调用提交原像，然后使用原像创建提案。如果您还同时打开一个通道，则可以将与通道相关的调用数据添加到批量资产注册调用数据中，并为所有内容打开一个提案。Moonbeam上的资产和通道注册提案应分配至General Admin Track。

![Overview of the proposal process](/images/builders/interoperability/xcm/xc-registration/assets/assets-3.png)

### 计算资产的每秒单位 {: #calculate-units-per-second }

每秒单位数是执行XCM消息时每秒收取的Token数量。在注册时，XCM转账的目标成本为0.02美元。随着Token价格的波动，每秒的单位数可能会通过治理进行更新。

计算一个资产每秒单位数值的最简单方法是通过在[xcm-tools](https://github.com/Moonsong-Labs/xcm-tools){target=_blank}库中的[`calculate-units-per-second.ts` script](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/calculate-units-per-second.ts){target=_blank}。该脚本接收以下参数：

- `--decimals`或`--d` - 您计算每秒单位的Token的小数位数
- `--xcm-weight-cost`或`--xwc` - 整个XCM消息执行的总权重花费。在每个Moonbeam链上的XCM运行预估权重如下：

    === "Moonbeam"

        ```text
        800000000
        ```

    === "Moonriver"

        ```text
        800000000
        ```

    === "Moonbase Alpha"

        ```text
        638978000
        ```

- `--target`或`--t` - （可选）XCM执行的目标价，预设为`$0.02`
- `--asset`或`--a` - （可选）Token的[Coingecko API ID](https://www.coingecko.com/){target=_blank}
- `--price`或`--p` - （可选）如果Coingecko API并不支持该Token，您可以手动指定价格

举例来说，要计算DOT（波卡原生Token）的每秒单位，其小数位数为10，您可以在Moonbeam上运行以下命令：

```bash
yarn calculate-units-per-second --d 10 --a polkadot --xwc 800000000 
```

应当会出现以下输出（截至本教程撰写时）：

```text
Token Price is $7.33
The UnitsPerSecond needs to be set 34106412005
```

### 为资产注册生成编码调用数据 {: #generate-encoded-calldata-for-asset-registration }

如果您对Moonbeam的治理系统不熟悉，可以在[Moonbeam治理](/learn/features/governance){target=_blank}页面了解更多信息。对于Moonbeam上的任何治理提案，您都需要提交一个原像，它定义了要执行的操作，然后您可以使用原像提交提案。

要提交一个原像，您可以为每个您希望执行的extrinsic获得相应的编码调用数据。如同先前提及的，您将会使用`assetManager.registerForeignAsset`，并根据需求使用`assetManager.setAssetUnitsPerSecond`和`system.setStorage` extrinsic。

您可以使用[`xcm-asset-registrator.ts`脚本](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/xcm-asset-registrator.ts){target= _blank}来计算编码的调用数据，甚至可以根据需求提交原像和提案。提案必须通过General Admin Track提交。如果您要注册资产并打开通道，则需要等待提交原像和提案，直到获得与通道相关的调用的调用数据。

要为`assetManager.registerForeignAsset` extrinsic获取编码调用数据，您可以使用以下参数：

- `--ws-provider`或`--w` - 用于请求的WebSocket提供者。每个基于Moonbeam的网络的WSS网络端点如下：

    === "Moonbeam"

        ```text
        wss://wss.api.moonbeam.network
        ```

    === "Moonriver"

        ```text
        wss://wss.api.moonriver.moonbeam.network
        ```

    === "Moonbase Alpha"

        ```text
        {{ networks.moonbase.wss_url }}
        ```

- `--asset`或`--a` - 资产的multilocation
- `--name`或`--n` - 资产名称
- `--symbol`或`--sym` - 资产的符号。**请记得，“xc”应添加到符号前面，以标明该资产是启用XCM的资产**
- `--decimals`或`--d` - 资产的小数位数
- `--existential-deposit`或`--ed` - （可选） - 注册资产的存在存款。这应该始终设置为`1`
- `--sufficient`或`--suf` - （可选）- 充足性，决定是否可以将资产发送到没有原生Token余额的账户。这应该始终设置为`true`

除了设置资产注册，创建批量交易同样设置了每秒单位数和恢复代码的交易预编译，您可以选择添加以下参数：

- `--units-per-second`或`--u` - （可选） - 每秒单位数，指定注册资产中每秒执行的费用金额。您应该在[上个部分教程](#calculate-units-per-second)中计算出该值。如果已提供该数值，脚本将为治理提案创建一个批量交易，该交易至少会注册资产并设置链上的每秒单位数
- `--revert-code`或`--revert` - （可选） - 在EVM中注册资产预编译的恢复代码。如果已提供代码，脚本将为治理提案创建一个批量交易，该交易至少将注册资产并设置恢复代码。

    !!! 注意事项
        **对于Moonbeam上的提案来说，此标志并非必需的**，因为它包含[OpenGov](/learn/features/governance#opengov) General Admin Origin无法执行的`system.setStorage`调用。稍后可以通过调用[预编译注册表预编译](/builders/pallets-precompiles/precompiles/registry){target=_blank}来设置虚拟EVM字节码，您无需担心需通过治理设置恢复代码！

作为实际范例，以下命令将会生成编码调用数据以从具有一般密钥的`1`平行链888注册一个资产：

```bash
yarn register-asset -w wss://wss.api.moonbase.moonbeam.network \
--asset '{ "parents": 1, "interior": { "X2": [{ "Parachain": 888 }, {"GeneralKey": "0x000000000000000001"}]}}' \
--symbol "xcEXTN" --decimals 18 \
--name "Example Token" \
--units-per-second 20070165297881393351 \ 
--ed 1 --sufficient true
```

输出应当如下：

```text
Encoded proposal for registerAsset is 0x1f0000010200e10d0624000000000000000001344578616d706c6520546f6b656e1878634558544e12000000000000000000000000000000000000
Encoded proposal for setAssetUnitsPerSecond is 0x1f0100010200e10d0624000000000000000001c7a8978b008d8716010000000000000026000000
Encoded calldata for tx is 0x0102081f0000010200e10d0624000000000000000001344578616d706c6520546f6b656e1878634558544e120000000000000000000000000000000000001f0100010200e10d0624000000000000000001c7a8978b008d8716010000000000000026000000
```

### 为资产注册以编程方式提交原像和提案 {: #submit-preimage-proposal }

如果您输入以下可选的引数，脚本提供了以编程的方式为资产注册提交一个原像和民主提案：

- `--account-priv-key`或`--account` - （可选） - 提交原像和提案的账户私钥 
- `--sudo`或`--x` - （可选） - 用`sudo.sudo`包装交易。如果您想向团队提供SCALE编码的调用数据以便通过SUDO提交，这可以用于Moonbase Alpha
- `--send-preimage-hash`或`--h` - （可选） - 提交原像 
- `--send-proposal-as`或`--s` - （可选） - 指定提案该如何传送，可以接受以下选项：
    - `democracy` - 通过使用Governance v1的一般民主传送提案
    - `council-external` - 将提案作为外部提案发送，由理事会使用Governance v1进行投票
    - `v2` - 通过OpenGov（Governance v2）发送提案。此选项应用于Moonbeam。如果您选择此选项，您还需要使用`--track`引数来指定哪个[Track](/learn/features/governance#general-definitions--general-definitions-gov2){target=_blank}该提案将通过，并使用`--delay`引数指定提案通过之后和提案执行之前的延迟时间（以区块为单位）
- `--collectiveThreshold`或`--c` - （可选） - 需要通过提案的理事会投票数量，默认设置为`1`
- `--at-block` - （可选） - 调用需要被执行的区块编码
- `--track` - （可选） - 提案需通过的OpenGov提案Track。以Moonbeam来说，需使用General Admin Origin
- `--delay` - （可选） - 提案通过之后在执行之前的延迟时间（以区块为单位），默认为`100`个区块

总而言之，您可以使用以下命令使用OpenGov提交原像和提案，该命令会批量进行资产注册并设置资产的每秒单位。

=== "Moonbeam"

    ```bash
    yarn register-asset -w wss://wss.api.moonbeam.network  \
    --asset 'INSERT_ASSET_MULTILOCATION' \
    --symbol "INSERT_TOKEN_SYMBOL" \
    --decimals INSERT_TOKEN_DECIMALS \
    --name "INSERT_TOKEN_NAME" \
    --units-per-second INSERT_UNITS_PER_SECOND \
    --existential-deposit 1 \
    --sufficient true \
    --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" \
    --send-preimage-hash true \
    --send-proposal-as v2
    --track '{ "Origins": "GeneralAdmin" }'
    ```

=== "Moonriver"

    ```bash
    yarn register-asset -w wss://wss.api.moonriver.moonbeam.network  \
    --asset 'INSERT_ASSET_MULTILOCATION' \
    --symbol "INSERT_TOKEN_SYMBOL" \
    --decimals INSERT_TOKEN_DECIMALS \
    --name "INSERT_TOKEN_NAME" \
    --units-per-second INSERT_UNITS_PER_SECOND \
    --existential-deposit 1 \
    --sufficient true \
    --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" \
    --send-preimage-hash true \
    --send-proposal-as v2
    --track '{ "Origins": "GeneralAdmin" }'
    ```

对于Moonbase Alpha来说，您不需要进行治理。相反，您可以使用`--sudo`标签并将输出提供给 Moonbeam 团队，以便可以通过Sudo快速添加资产和通道。

您可以在[xcm-tools库的`README.md`中查看其他示例](https://github.com/Moonsong-Labs/xcm-tools#example-to-note-pre-image-and-propose-through-opengov2-with-custom-track){target=_blank}。

### 在Moonbeam上测试资产注册 {: #test-asset-registration }

您的资产注册后，团队将提供资产ID和[XC-20预编译](/builders/interoperability/xcm/xc20/interact/#the-erc20-interface){target=_blank}地址。

您的XC-20预编译地址是通过将资产ID十进制数转换为十六进制数并在其前面加上F来计算的，直到获得40个十六进制字符（加上“0x”）地址。有关如何计算的更多信息，请参阅外部XC-20预编译地址的[计算外部XC-20资产预编译地址](/builders/interoperability/xcm/xc20/interact/#calculate-xc20-address){target=_blank}部分的外部XC-20教程。

资产成功注册后，您可以尝试将Token从平行链转移到您正在集成的基于Moonbeam的网络。

!!! 注意事项
    请注意基于Moonbeam的网络使用AccountKey20（以太坊格式地址）

作为测试用途，请同样提供您的平行链WSS端点以让[Moonbeam dApp](https://apps.moonbeam.network/){target=_blank}能够与之连接。最后，请为相关账户充值：

=== "Moonbeam"

    ```text
    AccountId: {{ networks.moonbeam.xcm.channel.account_id }}
    Hex:       {{ networks.moonbeam.xcm.channel.account_id_hex }}
    ```

=== "Moonriver"

    ```text
    AccountId: {{ networks.moonriver.xcm.channel.account_id }}
    Hex:       {{ networks.moonriver.xcm.channel.account_id_hex }}
    ```

=== "Moonbase Alpha"

    ```text
    AccountId: {{ networks.moonbase.xcm.channel.account_id }}
    Hex:       {{ networks.moonbase.xcm.channel.account_id_hex }}
    ```

!!! 注意事项
    对于Moonbeam和Moonriver测试，请将价值50美元的Token发送至上述账户。此外，提供一个以太坊式账户来发送价值50美元的GLMR/MOVR用于测试目的。

[XC-20资产](/builders/interoperability/xcm/xc20/){target=_blank}是具有[ERC-20接口](/builders/interoperability/xcm/xc20/overview/#the-erc20){target=_blank}的基于Substrate的资产。这意味着它们可以添加到MetaMask并与生态系统中存在的任何EVM DApp组合。该组合可以将您与您认为与XC-20集成相关的任何DApp连接起来。

如果您需要DEV Token（Moonbase Alpha的原生Token）来使用您的XC-20资产，您可以从[Moonbase Alpha水龙头](/builders/get-started/networks/moonbase/#moonbase-alpha-faucet){target=_blank}，每24小时分配 {{networks.moonbase.website_faucet_amount }}。如果您需要更多信息，请随时通过 [Telegram](https://t.me/Moonbeam_Official){target=_blank}或[Discord](https://discord.gg/PfpUATX){target=_blank}与团队联系。

## 在其他链上注册Moonbeam资产 {: #register-moonbeam-assets-on-another-chain }

为了实现Moonbeam资产（包括Moonbeam原生资产，GLMR、MOVR、DEV，和部署在Moonbeam上的本地XC-20资产，也就是支持XCM的ERC-20资产）在Moonbeam和另一条链之间进行跨链转移，您需要将资产注册到另一条链上。由于每个链存储跨链资产的方式不同，因此在另一个链上注册Moonbeam资产的具体步骤会根据链的不同而有所不同。至少，您需要了解Moonbeam上资产的元数据和multilocation。

除了资产注册之外，还需要采取其他步骤来实现与Moonbeam的跨链集成。有关更多信息，请参阅[与Moonbeam建立XC集成](/builders/interoperability/xcm/xc-registration/xc-integration){target=_blank}教程。

### 在其他链上注册Moonbeam原生资产 {: #register-moonbeam-native-assets }

每个网络的元数据如下：

=== "Moonbeam"
    |     变量     |         值          |
    |:------------:|:-------------------:|
    |     名称     |       Glimmer       |
    |     符号     |        GLMR         |
    |   小数位数   |         18          |
    | 最低账户存款 | 1 (1 * 10^-18 GLMR) |

=== "Moonriver"
    |     变量     |         值          |
    |:------------:|:-------------------:|
    |     名称     |      Moonriver      |
    |     符号     |        MOVR         |
    |   小数位数   |         18          |
    | 最低账户存款 | 1 (1 * 10^-18 MOVR) |

=== "Moonbase Alpha"
    |     变量     |         值         |
    |:------------:|:------------------:|
    |     名称     |        DEV         |
    |     符号     |        DEV         |
    |   小数位数   |         18         |
    | 最低账户存款 | 1 (1 * 10^-18 DEV) |

Moonbeam原生资产的multilocation包括Moonbeam网络的平行链ID和Moonbeam资产所在的Pallet实例，对应于Balances Pallet的索引。每个网络的multilocation如下：

=== "Moonbeam"

    ```js
    {
      V3: {
        parents: 1,
        interior: {
          X2: [
            { 
              Parachain: 2004
            },
            {
              PalletInstance: 10
            }
          ]
        }
      }
    }
    ```

=== "Moonriver"

    ```js
    {
      V3: {
        parents: 1,
        interior: {
          X2: [
            { 
              Parachain: 2023
            },
            {
              PalletInstance: 10
            }
          ]
        }
      }
    }
    ```

=== "Moonbase Alpha"

    ```js
    {
      V3: {
        parents: 1,
        interior: {
          X2: [
            { 
              Parachain: 1000
            },
            {
              PalletInstance: 3
            }
          ]
        }
      }
    }
    ```

### 在其他链上注册本地XC-20资产 {: #register-local-xc20 }

本地XC-20资产的multilocation包括Moonbeam的平行链ID、pallet实例和ERC-20的地址。Pallet实例对应于ERC-20 XCM Bridge Pallet的索引，因为这是允许任何ERC-20通过XCM传输的Pallet。

**要在其他链上注册，本地XC-20资产必须严格遵守[EIP-20](https://eips.ethereum.org/EIPS/eip-20){target=_blank}中描述的标准ERC-20接口。其中，尤其是[`transfer`函数](https://eips.ethereum.org/EIPS/eip-20#transfer){target=_blank}必须如EIP-20中所述：**

```js
function transfer(address _to, uint256 _value) public returns (bool success)
```

如果`transfer`函数的函数选择器与标准不同，则跨链转账可能会失败。

您可以使用以下multilocation注册一个本地XC-20资产：

=== "Moonbeam"

    ```js
    {
      parents: 1,
      interior: {
        X3: [
          { 
            Parachain: 2004
          },
          {
            PalletInstance: 110
          },
          {
            AccountKey20: {
              key: 'INSERT_ERC20_ADDRESS'
            }
          }
        ]
      }
    }
    ```

=== "Moonriver"

    ```js
    {
      parents: 1,
      interior: {
        X3: [
          { 
            Parachain: 2023
          },
          {
            PalletInstance: 110
          },
          {
            AccountKey20: {
              key: 'INSERT_ERC20_ADDRESS'
            }
          }
        ]
      }
    }
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 1,
      interior: {
        X3: [
          { 
            Parachain: 1000
          },
          {
            PalletInstance: 48
          },
          {
            AccountKey20: {
              key: 'INSERT_ERC20_ADDRESS'
            }
          }
        ]
      }
    }
    ```

因为在Moonbeam上本地XC-20s就是ERC-20s，在Moonbeam上创建ERC-20并不需要支付押金。但是在别的平行链上注册资产可能需要支付押金。请联系目标平行链团队获取详细信息。