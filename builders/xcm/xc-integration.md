---
title: 开通跨链通道
description: 学习如何与基于Moonbeam的网络建立跨链集成，包括开通和接受HRMP通道以及注册资产。
---

# 与Moonbeam建立XC集成

![XCM Overview Banner](/images/builders/xcm/xc-integration/xc-integration-banner.png)

## 概览 {: #introduction }

跨链消息传递（Cross-Chain Message Passing，XCMP）仍在开发当中，暂替方案是横向中继路由消息传递（Horizontal Relay-routed Message Passing，HRMP）。HRMP具有与XCMP相同的接口和功能，但其消息通过中继链存储和读取，而对于XCMP，只有消息相关的元数据存储在中继链。由于所有的消息通过HRMP的中继链传递，因此对资源的要求更高。HRMP将会在XCMP实施后被弃用。

所有与Moonbeam的XCMP通道集成均是单向的，这意味着消息仅在一个方向上流动。如果A链向B链发起一个通道，则A链将只被允许发送消息给B链，B链无法向A链发送消息。如此而来，B链需要再向A链开通通道，才能实现链间的消息互通。

XCMP（或HRMP）通道开通后，两条链的相应资产需要先注册才能转移。

本教程将涵盖如何在平行链和基于Moonbeam的网络之间开通和接受HRMP通道。另外，本教程提供在平行链上注册基于Moonbeam网络资产的所需数据以及在任何基于Moonbeam网络上注册资产时所需的数据。

## 集成流程概况 {: #overview-of-integration }

Moonriver/Moonbeam XCM集成的第一步是通过Alphanet中继链与Moonbase Alpha TestNet集成。若要与Moonbeam集成需要先完成与Moonriver的集成。

### Moonbase Alpha {: #moonbase-alpha }

与Moonbase Alpha集成的整个流程大改可以概括为如下步骤：

1. 与Alphanet中继链同步节点

2. 提供WASM/Genesis head hash和平行链ID以备使用

3. 计算在Alphanet中继链上的平行链主权账户（通过Moonbeam团队提供帮助）

4. 提供平行链资产详情，以便在Moonbase Alpha上注册资产

5. （通过SUDO或治理）从平行链向Moonbase Alpha开通HRMP通道

6. （通过SUDO或治理）从Moonbase Alpha接受HRMP通道

7. 在平行链上注册Moonbase Alpha的DEV Token（可选）

8. 要测试XCM集成，请发送一些Token至：

    ```
    AccoundId: 5GWpSdqkkKGZmdKQ9nkSF7TmHp6JWt28BMGQNuG4MXtSvq3e
    Hex:       0xc4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a063
    ```
    
9. 测试XCM集成

完成这些步骤后，双方团队均已成功测试资产转移，您的平行链Token可添加至[Moonbeam DApp](https://apps.moonbeam.network/moonbase-alpha){target=_blank}的跨链资产部分。若充值和提现按预期运行，则可以开始与Moonriver集成。

### Moonriver & Moonbeam {: #moonriver-moonbeam }

与Moonriver和Moonbeam建立HRMP通道的流程也差不多相似，具体如下所示：

1. 提供平行链资产详情，以便在Moonriver/Moonbeam上注册资产

2. 创建向Moonriver/Moonbeam开通HRMP通道的提案。若需要，您可以创建一些提案来注册MOVR/GLMR或者您也可以随时注册

3. 当第一步的提案通过后，Moonbeam将执行这些提案：

    1. 接受从Moonriver/Moonbeam传入的HRMP通道

    2. 发起从Moonriver/Moonbeam传出的HRMP通道提案

    3. 将资产注册为[XC-20 token](/builders/xcm/xc20/overview){target=_blank}格式

    常规执行时间如下：

      - **Moonriver** - 约为{{ networks.moonriver.democracy.vote_period.days }}天的投票期 + {{ networks.moonriver.democracy.enact_period.days }}天的执行期
      - **Moonbeam** - 约为{{ networks.moonbeam.democracy.vote_period.days }}天的投票期 + {{ networks.moonbeam.democracy.enact_period.days }}天的执行期
    
4. 接受从Moonriver/Moonbeam传出的HRMP通道

5. 兑换$50等值的Token用于测试XCM集成。请将Token发送至：

    ```
    AccoundId: 5DnP2NuCTxfW4E9rJvzbt895sEsYRD7HC9QEgcqmNt7VWkD4
    Hex:       0x4c0524ef80ae843b694b225880e50a7a62a6b86f7fb2af3cecd893deea80b926)
    ```
    
6. 提供以太坊格式的地址用于MOVR/GMLR

7. 用提供的Token测试XCM集成

完成这些步骤后，便可以正常运作，Moonriver/Moonbeam上的新XC-20资产可添加至[Moonbeam DApp](https://apps.moonbeam.network/){target=_blank}的跨链资产部分。

## 重新锚定支持 {: #re-anchoring-support}

在波卡0.9.16版本发布后，重新锚定逻辑将发生[重大变化](https://github.com/paritytech/polkadot/pull/4470){target=_blank}。此逻辑用于计算平行链如何从multilocation角度看待自身储备Token。

在0.9.16之前的版本无法正确计算重新锚定，因此平行链需要在其runtime同时支持错误（0.9.16之前的版本）和正确（0.9.16之后的版本）。下方示例为一个平行链（其平行链ID为1000且希望表示自己的Token）的错误和正确的重新锚定逻辑：

- 错误重新锚定（0.9.16之前的版本） - `MultiLocation { parents: 1, interior: Parachain(1000)}`
- 正确重新锚定（0.9.16之后的版本）- `MultiLocation { parents: 0, interior: Here }`

## 同步节点 {: #sync-a-node }

要同步一个节点，您可以使用[Alphanet中继链规格](https://drive.google.com/drive/folders/1JVyj518T8a77xKXOBgcBe77EEsjnSFFO){target=_blank}（注意：中继链基于Westend，同步需要约1天的时间）。

您可参考[Moonbase Alpha的规格文件](https://raw.githubusercontent.com/PureStake/moonbeam/runtime-1103/specs/alphanet/parachain-embedded-specs-v8.json){target=_blank}，并将其调整为适应于您的链。

您需要准备以下内容：

- Genesis head/wasm hash
- 平行链ID。您可以在[中继链Polkadot.js Apps页面](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/parachains){target=_blank}找到所需的平行链ID

[此处有一些Alphanet生态系统中继链的快照](http://snapshots.moonbeam.network.s3-website.us-east-2.amazonaws.com/){target=_blank}可供您使用以快速开始操作。

## 计算平行链主权账户并注入资金 {: #calculate-and-fund-the-parachain-sovereign-account }

要计算您的平行链主权账户，您可以使用[`calculateSovereignAddress.ts` script](https://github.com/albertov19/xcmTools/blob/main/calculateSovereignAddress.ts){target=_blank}。要运行脚本，您需要提供平行链ID和相关联的中继链名称。中继链可接受的值为`polkadot`、`kusama`和`moonbase`。

例如，Moonbase Alpha的中继链和其他平行链的主权账户可以通过运行以下命令获得：

```
ts-node calculateSovereignAddress.ts --paraid 1000 --r moonbase
```

这将输出以下响应：

```
Sovereign Account Address on Relay: 0x70617261e8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on other Parachains (Generic): 0x7369626ce8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on Moonbase Alpha: 0x7369626ce8030000000000000000000000000000
```

开始操作Moonbase Alpha中继链时，当您获得您的主权账户地址时，请通过[Telegram](https://t.me/Moonbeam_Official){target=_blank}或[Discord](https://discord.gg/PfpUATX){target=_blank}联系团队，以便团队在中继链层面为您提供资金。若非如此，您将无法创建HRMP通道。

## 创建HRMP通道 {: #create-an-hrmp-channel }

要创建HRMP通道，您需要发送一个XCM消息给中继链，请求通过中继链开通一个通道。此消息需要包含以下XCM指令：

 1. [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 从初始平行链中继链的主权账户提取资金以备使用

 2. [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - 从中继链购买执行时间以执行XCM消息

 3. [Transact](https://github.com/paritytech/xcm-format#transact){target=_blank} - 提供中继链调用数据来执行

  4. [DepositAsset](https://github.com/paritytech/xcm-format#depositasset){target=_blank} -（可选）执行后退还剩余资金。若为提供，将不退还资金

### 获取中继链编码调用数据 {: #get-the-relay-chain-encoded-call-data }

要获取在第三步执行的调用数据，您可前往Polkdot.js Apps并连接至[Moonbase Alpha中继链](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=_blank}、[Kusama](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama.api.onfinality.io%2Fpublic-ws#/extrinsics){target=_blank}或[Polkadot](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpolkadot.api.onfinality.io%2Fpublic-ws#/extrinsics){target=_blank}的WSS端点。导向**Developer**标签，选择**Extrinsics**，并执行以下步骤：

1. 在**submit the following extrinsic**下拉菜单中选择**hrmp**

2. 选择**hrmpInitOpenChannel** extrinsic

3. 输入Moonbeam平行链ID作为**recipient（接收方）**

    === "Moonbeam"
        ```
        2004
        ```

    === "Moonriver"
        ```
        2023
        ```

    === "Moonbase Alpha"
        ```
        1000
        ```

 4. 输入**proposedMaxCapacity**，此值设置为相应中继链的配置（`configuration.activeConfig.hrmpChannelMaxCapacity`）

    === "Moonbeam"
        ```
        1000
        ```

    === "Moonriver"
        ```
        1000
        ```

    === "Moonbase Alpha"
        ```
        1000
        ```

 5. 输入**proposedMaxMessageSize**，此值设置为相应中继链的配置（`configuration.activeConfig.hrmpChannelMaxMessageSize`）

    === "Moonbeam"
        ```
        102400
        ```

    === "Moonriver"
        ```
        102400
        ```

    === "Moonbase Alpha"
        ```
        102400
        ```

  6. 复制上述提及`Transact` XCM指令所需的编码调用数据。例如，在Moonbase Alpha上的编码调用数据为`0x3300e8030000e803000000900100`

![Get open HRMP channel relay chain call data on Polkadot.js Apps](/images/builders/xcm/xc-integration/xc-integration-1.png)

### 发送XCM消息至中继链 {: #send-an-xcm-message-to-the-relay-chain-open }

现在您已经有了中继链编码调用数据，您可以使用这些数据并发送XCM消息来请求开通一个通道。此XCM消息需要从根账户（SUDO或通过治理）发送。

在开始之前，**请注意所用数值仅供Moonbase Alpha中继链参考，不适用于其他网络**。

首先，前往[Polkadot.js Apps](https://polkadot.js.org/apps/#/explorer){target=_blank}并连接至平行链的WSS端点。随后，导向至**Developer**标签，选择**Extrinsics**并执行以下步骤：

1. 在**submit the following extrinsic**下拉菜单中选择**polakdotXcm**

2. 选择**send** extrinsic

3. 为**dest**设置以下信息

    | 参数 |     数值      |
    |:---------:|:-----:|
    |  Version  |  V1   |
    |  Parents  |   1   |
    | Interior  | Here  |
    
4. 对于**message**，您可以将**version**设置为`V2`并添加以下内容

    1. 选择**WithdrawAsset**指令并设置以下值

        | 参数 |     数值      |
        |:---------:|:-------------:|
        |    Id     |   Concrete    |
        |  Parents  |       0       |
        | Interior  |     Here      |
        |    Fun    |   Fungible    |
        | Fungible  | 1000000000000 |
        
    2. 选择**BuyExecution**指令并设置以下值
    
        | 参数 |     数值      |
        |:-----------:|:-------------:|
        |     Id      |   Concrete    |
        |   Parents   |       0       |
        |  Interior   |     Here      |
        |     Fun     |   Fungible    |
        |  Fungible   | 1000000000000 |
        | WeightLimit |   Unlimited   |
        
    3. 选择**Transact**指令并设置以下值
    
        | 参数 |     数值      |
        |:-------------------:|:------------------------------------------------------------------------------------------------:|
        |     OriginType      |                                              Native                                              |
        | RequireWeightAtMost |                                            1000000000                                            |
        |       Encoded       | { paste the call data from the [previous section](#get-the-relay-chain-encoded-call-data) here } |
        
    4. 选择**RefundSurplus**指令

    5. 选择**DepositAsset**指令并设置以下值
    
        | 参数 |     数值      |
        |:---------:|:------------------------------------------------:|
        |  Assets   |                       Wild                       |
        |   Wild    |                       All                        |
        | MaxAssets |                        1                         |
        |  Parents  |                        0                         |
        | Interior  |                        X1                        |
        |    X1     |                   AccountId32                    |
        |  Network  |                       Any                        |
        |    Id     | { enter the relay chain sovereign account here } |
        
        主权账户地址如下所示：
                
        === "Polkadot"
        
            ```
            0x70617261d4070000000000000000000000000000000000000000000000000000
            ```
        
        === "Kusama"
            ```
            0x70617261e7070000000000000000000000000000000000000000000000000000
            ```
        
        === "Moonbase Alpha"
            ```
            0x70617261e8030000000000000000000000000000000000000000000000000000
            ```
    
 5. 点击**Submit Transaction**

!!! 注意事项
    使用上述示例中的值和Moonbase Alpha中继链的主权账户地址，extrinsic的编码调用数据为`0x1c000101000214000400000000070010a5d4e81300000000070010a5d4e800060002286bee383300e8030000e803000000900100140d0100040001010070617261e8030000000000000000000000000000000000000000000000000000`。

![Open HRMP channel XCM message on Polkadot.js Apps](/images/builders/xcm/xc-integration/xc-integration-2.png)

消息发送后，中继链将执行内容和打开通道的请求。请您在请求打开通道后在[Telegram](https://t.me/Moonbeam_Official){target=_blank} or [Discord](https://discord.gg/PfpUATX){target=_blank}联系我们，请求需通过Moonbeam方接收后才可执行。

## 接受HRMP通道 {: #accept-the-hrmp-channel }

如先前所提及的，所有与Moonbeam集成的XCMP通道均是单向的。如此一来，当您的平行链上线后，需要有一个通道，Moonbeam将请求把Token发送回您的平行链，然后您需要接受它。

接受通道的流程与打开通道的类似，意味着您需要在中继链构建编码调用数据，然后通过来自平行链的XCM消息来执行。

### 获取中继链编码调用数据 {: #get-the-relay-chain-encoded-call-data }

要获取在第三步执行的调用数据，您可前往Polkdot.js Apps并连接至[Moonbase Alpha中继链](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=_blank}、[Kusama](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama.api.onfinality.io%2Fpublic-ws#/extrinsics){target=_blank}或[Polkadot](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpolkadot.api.onfinality.io%2Fpublic-ws#/extrinsics){target=_blank}的WSS端点。导向**Developer**标签，选择**Extrinsics**，并执行以下步骤：

1. 在**submit the following extrinsic**下拉菜单中选择**hrmp**

2. 选择**hrmpAcceptOpenChannel** extrinsic

3. 输入Moonbeam平行链ID作为**sender（发送方）**

    === "Moonbeam"
        ```
        2004
        ```
    
    === "Moonriver"
        ```
        2023
        ```
    
    === "Moonbase Alpha"
        ```
        1000
        ```
    
4. 复制编码调用数据，将用于`Transact` XCM指令。例如，在Moonbase Alpha上的编码调用数据为`0x3301e8030000`

![Get accept HRMP channel relay chain call data on Polkadot.js Apps](/images/builders/xcm/xc-integration/xc-integration-3.png)

### 发送XCM消息至中继链 {: #send-an-xcm-message-to-the-relay-chain-accept }

构建和发送XCM消息的步骤与打开通道的类似，主要区别在于`Transact`指令，您需要提供上一部分中`hrmpAcceptOpenChannel` extrinsic计算所得编码调用数据。此XCM消息需要从根账户（SUDO或通过治理）发送。

请返回创建HRMP通道部分，并遵循[发送XCM消息至中继链](#send-an-xcm-message-to-the-relay-chain-open)的步骤进行操作，您需要将第四步的编码调用数据修改为准确的数据。

![Accept HRMP channel XCM message on Polkadot.js Apps](/images/builders/xcm/xc-integration/xc-integration-4.png)

## 在您的平行链注册Moonbeam资产 {: #register-moonbeams-asset-on-your-parachain }

要在您的平行链上注册任何基于Moonbeam网络的Token，您可以使用以下内容。

每个基于Moonbeam网络的WSS网络端点：

=== "Moonbeam"
    ```
    wss://wss.api.moonbeam.network
    ```

=== "Moonriver"
    ```
    wss://wss.api.moonriver.moonbeam.network
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.wss_url }}
    ```

每个基于Moonbeam网络的资产元数据：

=== "Moonbeam"
    ```
    Name: Glimmer
    Symbol: GLMR
    Decimals: 18
    ```

=== "Moonriver"
    ```
    Name: Moonriver Token
    Symbol: MOVR
    Decimals: 18
    ```

=== "Moonbase Alpha"
    ```
    Name: DEV
    Symbol: DEV
    Decimals: 18
    ```

每个基于Moonbeam网络资产的Multilocation：

=== "Moonbeam"
    ```
    {
      "parents": 1,
      "interior": {
        "X2": [
          { 
            "Parachain": 2004,
            "PalletInstance": 10
          }
        ]
      }
    }
    ```

=== "Moonriver"
    ```
    {
      "parents": 1,
      "interior": {
        "X2": [
          { 
            "Parachain": 2023,
            "PalletInstance": 10
          }
        ]
      }
    }
    ```

=== "Moonbase Alpha"
    ```
    {
      "parents": 1,
      "interior": {
        "X2": [
          { 
            "Parachain": 1000,
            "PalletInstance": 3
          }
        ]
      }
    }
    ```

## 在Moonbeam上注册您的资产 {: #register-your-asset-on-moonbeam }

当通道双向开通后，您需要在Moonbeam上注册您的平行链资产。为此，您需要以下内容：

- 资产的Multilocation（Moonbase Alpha/Moonriver/Moonbeam）。请注明平行链ID和interior（若使用pallet index、general index等）
- 资产名称
- 资产表示（以xc为前缀）
- 小数位数

资产注册后，团队需确认。另外，团队将提供资产ID，[XC-20预编译](/builders/xcm/xc20/overview/#the-erc20-interface){target=_blank}地址，并设置`UnitsPerSecond`，即每秒执行XCM消息所需的Token数量。在注册时，XCM转账的目标成本为`$0.02`。`UnitsPerSecond`可能会随着Token价格的波动而更新。

您的XC-20预编译地址是通过将资产ID十进制数字转换为十六进制来计算的，并在前面加上F，直到您获得加上“0x"后达到40个字符长度的地址。关于如何计算XC-20预编译，请参考外部XC-20教程的[计算外部XC-20预编译地址](/builders/xcm/xc20/xc20/#calculate-xc20-address){target=_blank}的部分。

当资产成功注册后，您可以尝试将您的Token从平行链转移至Moonbase Alpha。

!!! 注意事项
    请注意基于Moonbeam的网络使用AccountKey20（即以太坊格式的地址）。

为了进行测试，请提供Moonbeam dApp可以连接到的平行链WSS端点。最后，请为相应账户注入资金：

=== "Moonbeam"
    ```
    AccoundId: 5DnP2NuCTxfW4E9rJvzbt895sEsYRD7HC9QEgcqmNt7VWkD4
    Hex:       0x4c0524ef80ae843b694b225880e50a7a62a6b86f7fb2af3cecd893deea80b926
    ```

=== "Moonriver"
    ```
    AccoundId: 5DnP2NuCTxfW4E9rJvzbt895sEsYRD7HC9QEgcqmNt7VWkD4
    Hex:       0x4c0524ef80ae843b694b225880e50a7a62a6b86f7fb2af3cecd893deea80b926
    ```

=== "Moonbase Alpha"
    ```
    AccountId: 5GWpSdqkkKGZmdKQ9nkSF7TmHp6JWt28BMGQNuG4MXtSvq3e
    Hex:       0xc4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a063
    ```

!!! 注意事项
    要测试Moonbeam和Moonriver，请发送$50等值的Token到上述账户。另外，为了测试，请准备一个以太坊格式的地址来发送$50等值的GLMR/MOVR。

## 在Moonbeam上使用您的资产 {: #use-your-asset-on-moonbeam }

[XC-20s](/builders/xcm/xc20/){target=_blank}是使用[ERC-20接口](/builders/xcm/xc20/overview/#the-erc20-interface){target=_blank}的Substrate资产。这意味着需要将其添加至MetaMask，并可以使用生态系统中的任何EVM DApp进行组合。团队可以协助您与任何XC-20集成相关的Dapp连接起来。

若您需要DEV Token（Moonbase Alpha的原生Token）来使用您的XC-20资产，您可以从 [Moonbase Alpha Faucet](/builders/get-started/networks/moonbase/#moonbase-alpha-faucet){target=_blank}获取（每24小时会分配 {{ networks.moonbase.website_faucet_amount }}枚DEV）。若您需要更多的Token，请在[Telegram](https://t.me/Moonbeam_Official){target=_blank} or [Discord](https://discord.gg/PfpUATX){target=_blank}上联系Moonbeam团队。