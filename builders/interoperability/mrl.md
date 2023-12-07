---
title: Moonbeam路由流动性
description: 学习与Moonbeam相关网络建立跨链集成后，如何通过Moonbeam接收路由流动性。
---

# Moonbeam路由流动性 - Moonbeam Routed Liquidity（MRL）

## 概览 {: #introduction }

Moonbeam路由流动性（MRL）是Moonbeam的多种用例之一：与Moonbeam连接的任何区块链都能够通过Moonbeam将流动性导入波卡的其它平行链。而这是由多个组件协同工作来实现的：

- **通用信息传递 - General Message Passing (GMP)** - GMP是一套连接包括Moonbeam在内数个区块链的传输协议。它可以用来跨链传递包含任意数据的消息，并且让代币可以通过[跨区块链GMP协议](/builders/interoperability/protocols){target=_blank}在非平行链区块链之间流通。
- [**跨共识信息传递 - Cross-Consensus Message (XCM) Passing**](builders/interoperability/xcm/overview/){target=_blank} - Polkadot的GMP变种。是推动Polkadot及其平行链（包括Moonbeam）之间跨链互操作的主要技术。
- **适配XCM的ERC-20代币** - 也称为[本地XC-20](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}，是指Moonbeam EVM上原生的，已适配XCM的所有ERC-20代币。
- [**GMP预编译合同**](/builders/pallets-precompiles/precompiles/gmp/){target=_blank} - 是一个[预编译合同](/builders/pallets-precompiles/precompiles/overview/){target=_blank}， 它是XCM与来自[Wormhole GMP 协议](/builders/interoperability/protocols/wormhole/){target=_blank}信息的接口。

通过组合这些组件，Web3的流动性能通过Moonbeam无缝导入其他平行链。流动性的传递既可以通过[GMP预编译](/builders/pallets-precompiles/precompiles/gmp){target=_blank}也可以通过传统智能合约，Moonbeam支持智能合约与XCM预编译之间的互相交互，比如[X-Tokens](/builders/interoperability/xcm/xc20/xtokens#xtokens-precompile){target=_blank}。

GMP协议通常以锁定/铸造或销毁/铸造方式移动资产。这种流动性通常以ERC-20代币的形式存在于Moonbeam上。现在Moonbeam上所有ERC-20代币都已支持XCM，只要代币在其他平行链上注册过，它们就可以在平行链上被认证。Moonbeam上启用XCM的ERC-20代币被称为[本地XC-20代币](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=_blank}。

本指南将主要解释一个平行链应该如何与Wormhole SDK和接口集成，以通过Moonbeam从非平行链区块链获得流动性。它也会解释使用时需要的基本配置以及如何有哪些是Wormhole协议支持的代币。

## 先决条件 {: #prerequisites }

要开始与您的平行链进行MRL集成，您首先需要：

- [通过HRMP通道建立与Moonbeam的跨链集成](/builders/interoperability/xcm/xc-registration/xc-integration){target=_blank}以便资产可以从Moonbeam发送到您的平行链。
- [在您的平行链上注册Moonbeam的资产](/builders/interoperability/xcm/xc-registration/assets#register-moonbeam-native-assets){target=_blank}。由于负责跨链资产传送的XCM message pallet的功能限制，我们只能使用Moonbeam的原生gas资产来支付信息回传的跨链费用。
- [注册您要路由到您平行链的本地XC-20代币](/builders/interoperability/xcm/xc-registration/assets#register-local-xc20){target=_blank}
    - 允许这些本地XC-20代币用于支付XCM费用
- 允许用户发送`Transact`指令(通过`polkadotXcm.Send`或者[XCM Transactor Pallet](/builders/interoperability/xcm/xcm-transactor#xcm-transactor-pallet-interface){target=_blank})，这将启用远程EVM调用，允许远程平行链上的账户与 Moonbeam上的Bridge智能合约交互。

## Wormhole MRL {: #mrl-through-wormhole }

Wormhole是第一个为公众搭建的GMP平台，虽然MRL计划支持多种不同GMP提供商，但现在仍以Wormhole为主。在完成所有[先决条件](#prerequisites)之后，您还需要完成以下步骤来通过Wormhole接收流动性：

- 通知Moonbeam团队您希望加入MRL计划，以便我们为您提供技术实施方面的帮助。
- 与Wormhole团队和其他依赖MRL的前端联系以敲定技术细节并同步公告。他们可能会需要以下信息：
    - 平行链ID
    - 平行链使用的账户类型（例如，AccountId32 或 AccountKey20）
    - 已注册代币的地址和名称
    - [Wormhole Connect](https://wormhole.com/connect/){target=_blank}前台可用的端点
    - 希望您的平行链通过Wormhole Connect连接的理由

### 通过Wormhole将代币发送至平行链 {: #sending-tokens-through-wormhole }

MRL提供了一个一键式解决方案，允许您将Multilocation定义为最终目的地，以便资产从任何与[Wormhole Connect](https://wormhole.com/connect/){target=_blank}集成的Wormhole链中转移。

要通过Wormhole和MRL发送代币，用户界面将使用[Wormhole TokenBridge](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/interfaces/ITokenBridge.sol){target=_blank}和[Moonbeam GMP预编译](/builders/pallets-precompiles/precompiles/gmp){target=_blank}的混合体。

转移流动性的用户将调用起始链上部署的Wormhole TokenBridge智能合约中的`transferTokensWithPayload`函数，该方法通过 `ITokenBridge.sol`接口来将代币发送给GMP Precompile。此函数要求一个bytes负载，该负载必须格式化为SCALE编码的Multilocation对象，并包装在另一个预编译特定版本化的类型中。要了解如何构建此负载，请参阅GMP Precompile文档中的[搭建Wormhole负载](/builders/pallets-precompiles/precompiles/gmp#building-the-payload-for-wormhole){target=_blank}部分。

Wormhole使用一套分布式节点来监视多个区块链的状态。Wormhole将这些节点称为[守护者节点（Guardians）](https://docs.wormhole.com/wormhole/explore-wormhole/guardian){target=_blank}。Guardian节点的职责是监控消息并签署相应的负载。如果2/3 Wormhole参与签署的Guardian节点者验证了某个消息，则该消息将被批准并可以在其他链上接收。

Guardian节点的签名与消息组合成为一个叫做[已验证操作批准（Verified Action Approval (VAA)）](https://docs.wormhole.com/wormhole/explore-wormhole/vaa){target=_blank}的证明。这些VAA将由Wormhole网络中的中继器（Relayer）传递至其目的地，然后在目的地链上VAA将被用于执行某项操作。在本文中，VAA会被传递给GMP Precompile的`wormholeTransferERC20`函数，该函数通过Wormhole桥接合约（该合约铸造代币，处理VAA，并使用XCM消息将代币中继到平行链。请注意，作为集成MRL的平行链，您大概率不需要部署或使用GMP预编译合约。

中继器的唯一工作是将Wormhole Guardian节点批准的交易传递到目的地链。部分中继器已经支持MRL但任何人都可以独立运行专属中继器。此外，用户在通过Wormhole进行桥接时可以在目的地链上手动执行该交易，并完全避免使用中继器。

![Transfering wormhole MRL](/images/builders/interoperability/mrl/mrl-1.png)

### 通过Wormhole将代币从平行链发送回原链 {: #sending-tokens-back-through-wormhole }

要通过Wormhole将代币从平行链发送回原链，用户需要发送一笔交易。推荐使用`utility.batchAll`批处理将代币转账交易和远程执行操作交易打包到同一个extrinsic中。例如同一个extrinsic中可以包含一个`xTokens.transferMultiassets`交易加上带有`Transact`指令的 `polkadotXcm.send`交易。

批处理能提供一个一键式解决方案。然而目前而言，这个操作需要用户在平行链上拥有xcGLMR（GLMR的外部代币）。这主要是因为两个原因：

- 本地XC-20（启用XCM的ERC-20）不能用于支付Moonbeam上的XCM执行费用。这是一个设计决策，因为XC-20代币的设计需要贴近传统的ERC-20代币，使用ERC-20接口中的transfer函数来转移资产。处理XC-20的XCM指令仅限于将资金从一个账户转移到另一个账户，而XCM流程中需要资产寄存机制，这两者并不兼容。
- 目前，XCM相关pallet的限制让我们无法使用XCM来转移具有不同储备链的代币。这也导致了在发送XC-20时无法将费用代币设置为本地平行链代币。

将来，[X-Tokens Pallet](/builders/interoperability/xcm/xc20/xtokens#x-tokens-pallet-interface){target=_blank}将得到更新，允许使用本地gas货币为XCM付费。使用不同pallet的平行链需要自己实现在一个消息中转移储备与非储备资产的解决方案。

举个例子，下面是将MRL代币通过Wormhole从平行链发送回原链过程的简要概述：

1. 使用[Utility Pallet](/builders/pallets-precompiles/pallets/utility){target=_blank}的`batchAll`extrinsic发送一个批处理交易，其中包含以下两个调用：
    - **`xTokens.transferMultiassets`** - 将xcGLMR和本地XC-20发送到用户的[Multilocation衍生账户（multilocation-derivative account）](#calculate-multilocation-derivative-account){target=_blank}。Multilocation衍生账户是Moonbeam上的一个无密钥账户，另一个平行链上的账户可以通过XCM来控制该账户。
    - **`polkadotXcm.send`** - 带有`Transact`指令。通过XCM向Moonbeam上的Batch预编译合同发送[远程EVM调用](/builders/interoperability/xcm/remote-evm-calls/){target=_blank}，该Batch预编译使用 `ethereumXcm.transact`将以下两个调用批处理到一个远程EVM交易中：
        - **`approve`**（本地 XC-20 合约）- 授权Wormhole中继器转移本地 XC-20
        - **`transferTokensWithRelay`**（中继器合约）- 调用Moonbeam上Wormhole TokenBridge智能合约上的`transferTokensWithPayload`函数来跨链转移代币，该函数广播消息供Wormhole Guardian节点拾取。
2. Guardian节点网络将拾取Wormhole交易并对其签名
3. Wormhole中继器将代币中继到原链和目标账户

![Transfering Wormhole MRL out](/images/builders/interoperability/mrl/mrl-2.png)

现在我们已对MRL有了大致的了解，接下来我们将通过实例实现上述功能。以下的示例将向您展示如何将资产从平行链转移到Moonbase Alpha，并通过Wormhole返回原链，本指南也同样适用于Moonbeam。

#### 计算Multilocation衍生账户（Multilocation-Derivative Account） {: #calculate-multilocation-derivative-account }

要通过Wormhole发送代币回原链，您需要计算用户在Moonbeam上的Multilocation衍生账户。您可以使用[xcm-tools repository](https://github.com/Moonsong-Labs/xcm-tools){target=_blank}中的[`calculate-multilocation-derivative-account.ts`脚本](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/calculate-multilocation-derivative-account.ts){target=_blank}在链外完成此步骤。有关更多详细信息，您可以参考远程EVM调用文档中的[计算Multilocation衍生账户](/builders/interoperability/xcm/remote-evm-calls/#calculate-multilocation-derivative){target=_blank}部分。

除此以外，您还可以使用[XCM Utilities 预编译](/builders/pallets-precompiles/precompiles/xcm-utils)中的`multilocationToAddress`函数。

#### 构建Transfer Multiassets Extrinsic {: #build-transfer-multiassets }

当有了multilocation衍生账户，您就可以开始构建`utility.batchAll`交易。开始之前，您需要确认以下包已被安装：

```bash
npm i @polkadot/api ethers
```

现在您可以开始构建`xTokens.transferMultiassets`交易，该交易接受四个参数：`assets`, `feeItem`, `dest`, 和 `destWeightLimit`。您可以在[X-Tokens Pallet接口](/builders/interoperability/xcm/xc20/xtokens#x-tokens-pallet-interface){target=_blank}文档中找到这些参数的更多信息。

简而言之，`assets`参数定义了xcDEV（Moonbeam的xcGLMR）和本地XC-20的multilocation和数量，并将xcDEV定位为第一资产，本地XC-20定位为第二资产。`feeItem`被设置为xcDEV资产的索引，在本例中为`0`，`feeItem`用DEV来支付Moonbase Alpha的执行费用。`dest`是一个multilocation，它用于定义我们在前一小节里计算得到的Moonbase Alpha multilocation衍生账户。

此示例的`xTokens.transferMultiassets`如下所示：

???+ code "multiassets转账逻辑"

    ```js
    --8<-- 'code/builders/interoperability/mrl/transfer-multiassets.js'
    ```

在Moonbeam上使用，您需要修改以下参数:

|           Parameter            | Value |
|:------------------------------:|:-----:|
|          Parachain ID          | 2004  |
|     Balances Pallet Index      |  10   |
| ERC-20 XCM Bridge Pallet Index |  110  |

#### 构建远程EVM调用 {: #build-the-remote-evm-call }

要生成batch交易的第二个调用`polkadotXcm.send`，您需要先创建一个EVM交易，然后再拼装执行该EVM交易的XCM指令。这个EVM交易可以构建为一个与[Batch预编译](/builders/pallets-precompiles/precompiles/batch){target=_blank}交互的交易，以便在同一交易中执行两个交易。这很是个很有用的技巧，因为这个EVM交易必须同时批准Wormhole中继器来中继本地XC-20代币以及这个中继操作本身。

要创建batch交易并将其包装在远程EVM调用中以便在Moonbeam上执行，您需要执行以下步骤：

1. 创建本地XC-20、[Wormhole中继器](https://github.com/wormhole-foundation/example-token-bridge-relayer/blob/main/evm/src/token-bridge-relayer/TokenBridgeRelayer.sol){target=_blank}和[Batch预编译合约](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank}的实例您需要每个合约的ABI：

    ??? code "ERC-20接口ABI"

        ```js
        --8<-- 'code/builders/interoperability/mrl/abi/ERC20.js'
        ```

    ??? code "TokenBridge中继器ABI"

        ```js
        --8<-- 'code/builders/interoperability/mrl/abi/TokenRelayer.js'
        ```

    ??? code "Batch预编译合约ABI"

        ```js
        --8<-- 'code/builders/interoperability/mrl/abi/Batch.js'
        ```

    在Moonbase Alpha这个特定示例中，您还需要一个Wormhole中继器的地址。您可以使用：

    === "Moonbase Alpha"

        ```text
        0x9563a59c15842a6f322b10f69d1dd88b41f2e97b
        ```

2. 使用Ethers的`encodeFunctionData`函数来encode batch交易中使用的`approve`交易和`transferTokensWithRelay`交易并得到encoded call data
3. 将两个交易合并为一个batch交易，并再次使用Ethers的`encodeFunctionData`函数来encode该交易的call data
4. 使用`ethereumXcm.transact`extrinsic为batch交易创建远程EVM调用，该extrinsic使用上一步得到的encoded call data作为`xcmTransaction`参数。有关更多信息，请参阅[远程EVM调用文档](/builders/interoperability/xcm/remote-evm-calls#ethereum-xcm-pallet-interface){target=_blank}

???+ code "创建远程EVM调用逻辑"

    ```js
    --8<-- 'code/mrl/evm-tx.js'
    ```

接下来，您需要创建extrinsic以将远程EVM调用发送到Moonbeam。您需要发送一个XCM消息来执行`Transact`XCM指令。最常见的做法是通过`polkadotXcm.send`发送`WithdrawAsset`, `BuyExecution`, 和 `Transact`指令。也可用 `RefundSurplus`和 `DepositAsset`来确保资产不会被锁，但技术上它们不是必须的。

???+ code "发送远程EVM调用逻辑"

    ```js
    --8<-- 'code/mrl/polkadotxcm-send.js'
    ```

#### 构建Batch Extrinsic {: #build-batch-extrinsic }

为确保`xTokens.transferMultiassets`与`polkadotXcm.send`交易同时发送，您可以使用`utility.batchAll`将它们批量处理在一起。至少在现在，这有助于确保资产转移在EVM交易之前发生，这是一个十分必要的特质。但是这在以后可能会因为XCM升级而发生变化。

???+ code "将multilocation资产交易与远程EVM调用发送打包"

    ```js
    --8<-- 'code/builders/interoperability/mrl/batch-extrinsics.js'
    ```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/interoperability/mrl/complete-script.js'
    ```

如果您想查看一个完全实现了此功能的示例项目，可以访问这个[GitHub repository](https://github.com/jboetticher/mrl-reverse){target=_blank}。

请注意，并非每个平行链都包括X-Tokens和其他必要Pallet。基于Substrate的链都非常灵活，甚至没有一个固定标准。如果您认为您的平行链不支持此路径，请在[Moonbeam论坛](https://forum.moonbeam.network/){target=_blank}上和Wormhole团队中提供替代解决方案。

### Wormhole支持的代币 {: #tokens-available-through-wormhole }

虽然Wormhole在技术上支持跨链转移任何代币，但中继器并不支持所有代币的费用支付。基于Wormhole MRL的解决方案可转移的ERC-20资产取决于[xLabs 中继器](https://xlabs.xyz/){target=_blank}能接受的代币种类。以下表格中列出了Moonbeam支持的代币：

=== "Moonbeam"

    | Token Name |                  Address                   |
    |:----------:|:------------------------------------------:|
    |   WMATIC   | 0x82DbDa803bb52434B1f4F41A6F0Acb1242A7dFa3 |
    |   WGLMR    | 0xAcc15dC74880C9944775448304B263D191c6077F |
    |    WFTM    | 0x609AedD990bf45926bca9E4eE988b4Fb98587D3A |
    |    WETH    | 0xab3f0245B83feB11d15AAffeFD7AD465a59817eD |
    |    WBTC    | 0xE57eBd2d67B462E9926e04a8e33f01cD0D64346D |
    |   wTBTC    | 0xeCd65E4B89495Ae63b4f11cA872a23680A7c419c |
    |    WBNB    | 0xE3b841C3f96e647E6dc01b468d6D0AD3562a9eeb |
    |   WAVAX    | 0xd4937A95BeC789CC1AE1640714C61c160279B22F |
    |    USDT    | 0xc30E9cA94CF52f3Bf5692aaCF81353a27052c46f |
    |    USDC    | 0x931715FEE2d06333043d11F658C8CE934aC61D0c |
    |    SUI     | 0x484eCCE6775143D3335Ed2C7bCB22151C53B9F49 |
    |    CELO    | 0xc1a792041985F65c17Eb65E66E254DC879CF380b |

使用前请花时间用[Wormhole资产验证器](https://www.portalbridge.com/#/token-origin-verifier){target=_blank}验证这些代币在Moonbeam上仍然是有效的Wormhole资产。

--8<-- 'text/disclaimers/third-party-content.md'