---
title: 通过XCM远程调用EVM
description: 如何通过XCM从任何已建立XCM通道的波卡平行链远程调用Moonbeam EVM上的智能合约
---

# 通过XCM远程调用EVM

![Remote EVM Calls Banner](/images/builders/interoperability/xcm/remote-evm-calls/xcmevm-banner.png)

## 概览 {: #introduction} 

[XCM-transactor pallet](/builders/interoperability/xcm/xcm-transactor/){target=_blank}提供了一个能够通过XCM进行远程跨链调用的简易接口。然而，这并没有考虑对Moonbeam的EVM进行远程调用的可能性，而只是对Substrate特定的pallets（功能）进行调用。

Moonbeam的EVM仅能通过[Ethereum pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum){target=_blank}访问。在许多事情外，这个pallet在将交易放入交易池前处理交易的某些验证步骤。接着，它会在将池子中的交易插入区块之前执行其他的验证步骤。最后，它会通过`transact`函数提供接口以执行经过验证的交易。以上所有步骤在结构和签名机制方面都遵循与以太坊交易相同的步骤。

但是，您无法直接通过一个XCM [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank}调用[Ethereum pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum){target=_blank}。主要因为远程EVM调用的调度者账户（在以太坊中为`msg.sender`）并不会在Moonbeam端签署XCM交易。XCM extrinsic会在其原始链中签名，接着XCM执行器会通过[`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank}指令，让与原链中的发送者链接的已知调用者调度调用的动作。在这种情况下，Ethereum pallet将会无法验证签名，及最终的验证交易步骤。

为解决此问题，引入了[Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}。它充当XCM [Transact](https://github.com/paritytech/xcm-format#transact){target=_blank}指令和[Ethereum pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum){target=_blank}之间的中间件，因为在通过XCM远程执行EVM调用时需要特别注意。Pallet将执行必要的检查并验证交易。接着，Pallet会调用Ethereum pallet将交易派遣给EVM。根据访问EVM的方式，常规和远程EVM的调用之间存在一些差异。

下列流程图描绘了通过XCM进行常规和远程EVM调用的路径：

![Happy parth for regular and remote EVM calls through XCM](/images/builders/interoperability/xcm/remote-evm-calls/xcmevm-1.png)

本教程将介绍常规和远程EVM调用之间的差异。此外将展示如何通过[Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}中函数执行远程EVM调用。

!!! 注意事项
    远程EVM调用通过[XCM-transactor pallet](/builders/interoperability/xcm/xcm-transactor/){target=_blank}完成。因此，建议您在尝试通过XCM执行远程EVM调用之前熟悉XCM-transactor概念。

**请注意，通过XCM对Moonbeam执行EVM的远程调用仍在积极开发中**。此外，**开发人员必须了解，发送不正确的XCM消息将导致资金损失。**因此，在迁移到生产环境之前须在测试网上测试XCM功能。

## 相关XCM定义 {: #general-xcm-definitions }

--8<-- 'text/xcm/general-xcm-definitions2.md'

 - **衍生账户** — 从另一个帐户衍生的帐户。衍生账户是无密钥的，也就是私钥未知。因此，与XCM特定用例相关的衍生账户只能通过XCM相关的extrinsics访问。对于远程的EVM调用，主要类型如下：
     - **Multilocation衍生账户** — 这会生成一个无密钥帐户，该帐户从由 [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} XCM指令和提供的Multilocation设置的新来源所衍生。对于基于Moonbeam的网络，[衍生函数](https://github.com/PureStake/moonbeam/blob/master/primitives/xcm/src/location_conversion.rs#L31-L37){target=_blank}计算Multilocation的`blake2`哈希，包括原始平行链ID，并截取正确长度的哈希（以太坊格式的帐户为20个字节）。XCM调用[原转换](https://github.com/paritytech/polkadot/blob/master/xcm/xcm-executor/src/lib.rs#L343){target=_blank}在`Transact`指令执行时发生。因此，每条平行链都可以使用自己想要的程序转换来源，因此发起交易的用户可能在每条平行链上拥有不同的衍生账户。该衍生账户用于支付交易费用，并被设置为调用的调度者
 - **交换信息** — 与XCM-transactor extrinsic的XCM远程执行部分的额外权重和费用信息有关。这部分为必要的，因主权账户将支付XCM交易费用。因此，XCM-transactor就计算费用数值，并向XCM-transactor extrinsic的发送方收取相应[XC-20 Token](/builders/interoperability/xcm/xc20/overview/){target=_blank}的估计数量以偿还主权账户

## 通过XCM执行常规和远程EVM调用的差异 {: #differences-regular-remote-evm}

正如[概览](#introduction)中所解释的，常规和远程EVM调用到达EVM的路径是完全不同的，其主要原因是交易的调度程序。

一个常规的EVM调用有一个明显的发送者使用其私钥签署以太坊交易。该签名，也就是ECDSA类型的签名，可以通过签名消息和签名算法生成的`r-s`值进行验证。而以太坊签名使用一个额外的变量，称为`v`，为恢复标识符。

通过远程EVM调用，签名者在另一条链中签署XCM交易。Moonbeam接收到后，必须使用以下指令构建的XCM消息如下：

 - [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank}
 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} 
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} 
 - [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} 

第一条指令`DescendOrigin`将通过[XCM相关定义部分](#general-xcm-definitions)中描述的**Multilocation衍生账户**机制在Moonbeam端转移XCM调用的源头。远程EVM调用是从该无密钥帐户（或相关的 [代理](/tokens/manage/proxy-accounts/){target=_blank}）派遣的。因此，由于交易并没有签署，它没有真正签名的`v-r-s`值，反而会是`0x1`。

由于远程EVM调用没有签名的实际`v-r-s`值，因此EVM交易哈希可能存在冲突问题，因为它被计算为已签名交易blob的keccak256哈希。如果两个具有相同随机数的账户提交相同的交易对象，它们最终会得到相同的EVM交易哈希。因此，所有远程EVM交易都使用附加到[Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}中的全网随机数。

另一个显着差异是在Gas价格方面。远程EVM调用的费用依照XCM的执行层收取。因此，EVM级别的Gas价格为零，EVM不会因执行本身收费。这也可以从远程EVM调用交易的接收收据中看出。因此，XCM消息必须被配置，以便让`BuyExecution`函数能够购买足够的权重来支付Gas的成本。

最后一个区别是Gas限制。以太坊使用Gas计量系统来调节可以在一个区块中完成的执行量。相反，Moonbeam使用的是[基于权重系统](https://docs.substrate.io/build/tx-weights-fees/){target=_blank}，其中每个调用的特点是在一个区块中执行所花费的时间。每个重量单位对应于一皮秒的执行时间。

XCM队列的配置表明XCM消息应该设置为`20,000,000,000`权重单位（即`0.02`秒的区块执行时间）内可被执行。假设XCM消息因给定区块中的执行时间不足而无法执行，并且权重要求超过`20,000,000,000`。在这种情况下，XCM消息将被标记为`overweight`，并且只能通过民主的方式执行。

每条XCM消息的`20,000,000,000`权重限制设置了可用于通过XCM进行远程EVM调用的Gas限制。对于所有基于Moonbeam的网络，比率为[`25,000` Gas单位每单位权重](https://github.com/PureStake/moonbeam/blob/master/runtime/moonbase/src/lib.rs#L371-L375){target=_blank}。考虑到您需要一些XCM消息权重来自行执行XCM指令。因此，远程EVM调用可能还剩下大约`18,000,000,000`的重量，即`720,000` Gas单位。因此，您可以为远程EVM调用提供的最大Gas限制约为`720,000`个Gas单位。请注意，此数值可能会在未来发生变化。

简单来说，以下为常规和远程EVM调用之间的主要区别：

1. 远程EVM调用使用全网随机数（由[Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}拥有）而不是每个账户的随机数
2. 远程EVM调用的签名的`v-r-s`值为`0x1`。无法通过一般函数从签名中检索发送者（例如，通过[ECRECOVER](/builders/pallets-precompiles/precompiles/eth-mainnet/#verify-signatures-with-ecrecover){target=_blank}）。然而，`from`被包含在交易收据和通过哈希获取交易数据时（使用以太坊 JSON RPC）
3. 所有远程EVM调用的Gas为零。EVM执行在XCM执行层而非在EVM层收费
4. 您可以为远程EVM调用设置的当前最大Gas限制为`720,000 `Gas单位

## Ethereum-XCM Pallet接口 {: #ethereum-xcm-pallet-interface}

### Extrinsics {: #extrinsics }

Ethereum-XCM pallet提供以下extrinsics（函数），可以通过`Transact`指令调用以通过XCM访问Moonbeam的EVM：

 - **transact**(xcmTransaction) — 通过XCM远程调用EVM的函数。只能通过执行XCM消息调用
 - **transactThroughProxy**(transactAs, xcmTransaction) — 类似于`transact` extrinsic，但此函数使用`transactAs`作为附加字段。此函数允许从具有已知密钥（`msg.sender`）的给定帐户派遣远程EVM调用。此帐户需要将**multilocation衍生账户**设置为Moonbeam上类型为`any`的代理账户。相反而言，远程EVM调用的调度将失败。交易费用仍由**multilocation衍生账户**支付

其中需要提供的输入可以被定义为如下：

 - **xcmTransaction** — 包含将被调度的调用的以太坊交易细节。这包括调用数据、`msg.value`和Gas限制
 - **transactAs** — 远程EVM调用将被派遣的帐户（`msg.sender`）。此部分设置的帐户需要将**multilocation衍生账户**设置为Moonbeam上类型为`any`的代理账户。交易费用仍将由**multilocation衍生账户**支付

## 通过XCM构建一个远程EVM调用 {: #build-remove-evm-call-xcm} 

本教程涵盖使用从中继链到Moonbase Alpha的XCM pallet为远程EVM调用构建XCM消息。详细而言，它将使用`transact`函数。使用`transactThroughProxy`函数的步骤则是相同的。但是，您需要提供`transactAs`帐户并确保该帐户已将**multilocation衍生账户**设置为Moonbase Alpha上的`any`类型的代理账户。

!!! 注意事项
    当在使用`transactThroughProxy`时，只要此帐户已将**multilocation衍生账户**设置为您正在使用的基于Moonbeam的网络中类型为`any`的代理，EVM调用将根据您提供的**transactAs**帐户调度，并作为`msg.sender`。但是，交易费用仍由**multilocation衍生账户**支付，因此您需要确保它有足够的资金来支付这些费用。

### 查看先决条件 {: #ethereumxcm-check-prerequisites}

为了能够从中继链在Polkadot.js应用程序中发送调用请求，您需要具备以下条件：

 - 一个在中继链上拥有资金（`UNIT`）的[账户](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}以支付交易费用。您可以通过在[Moonbeam-Swap](https://moonbeam-swap.netlify.app){target=_blank}上交换DEV Token（Moonbase Alpha的原生Token）来获得一些`xcUNIT`，此为先前在Moonbase Alpha演示的克隆Uniswap-V2。接着[将它们发送到中继链](/builders/interoperability/xcm/xc20/xtokens/){target=_blank}。此外，您也可以[联系我们](https://discord.gg/PfpUATX){target=_blank}直接获取一些`UNIT` Token
 - 为**multilocation衍生账户**提供资金，您可以按照[下一部分](#calculate-multilocation-derivative){target=_blank}中的步骤获得该账户。该账户必须有足够的DEV Token（或Moonbeam/Moonriver网络中的GLMR/MOVR）来支付远程EVM调用的XCM执行成本。请注意，此衍生账户是将发送远程EVM调用的帐户（`msg.sender`）。因此，帐户必须满足正确执行EVM调用所需的任何条件。例如，如果您正在执行ERC-20转账，请确保拥有任何相关的ERC-20 Token

!!! 注意事项
    假设您正在使用`transactThroughProxy`函数，在这种情况下，`transactAs`帐户必须满足正确执行EVM调用所需的任何条件，因为它将作为`msg.sender`。但是，**multilocation衍生账户**需要持有DEV Token（或Moonbeam/Moonriver网络中的GLMR/MOVR）以支付远程EVM调用的XCM执行成本的账户。

### 计算Multilocation衍生账户 {: #calculate-multilocation-derivative}

如先前所述，远程EVM调用是从被称为**multilocation衍生账户**的帐户派遣的。这是使用[`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank}指令提供的信息计算的。因此，计算账户直接取决于指令的构造方式。

举例来说，从中继链中，[`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank}指令是由[`XCM Pallet`](https://github.com/paritytech/polkadot/blob/master/xcm/pallet-xcm/src/lib.rs){target=_blank}本地输入的。在Moonbase Alpha的中继链（基于Westend）的情况下，具有以下格式（multilocation连接）：

```
{
  "descendOrigin":
    {
    "x1":
      {
        "accountId32":
        {
          "network":
          {
            "named":"0x57657374656e64"
          },
        "id":"decodedAddress"
        }  
      }
  }
}
```

其中`named`值对应十六进制的“Westend”（在本例中），而`decodedAddress`对应于在中继链上签署交易的账户地址（64字节格式）。当XCM指令在Moonbeam（本例中为Moonbase Alpha）中执行时，源头将被转化为以下multilocation：

```
{
  "descendOrigin":
    {
    "parents":1,
    "interior":
    {
      "x1":
      {
        "accountId32":
        {
          "network":
          {
            "named":"0x57657374656e64"
          },
         "id":"decodedAddress"
        }
      }
    }
  }
}
```
这是用于计算**multilocation衍生账户**的multilocation。您可以使用这个[计算**multilocation衍生账户**脚本](https://github.com/albertov19/xcmTools/blob/main/calculateMultilocationDerivative.ts){target=_blank}来帮助您获取它的值。本例中使用Alice的中继链账户，解码后的值为`0x78914a4d7a946a0e4ed641f336b498736336e05096e342c799cc33c0f868d62f`。因此，您可以通过运行以下指令来获取Moonbase Alpha中继链的**multilocation衍生账户**：

```sh
ts-node calculateMultilocationDerivative.ts \
--w wss://wss.api.moonbase.moonbeam.network \
--a 0x78914a4d7a946a0e4ed641f336b498736336e05096e342c799cc33c0f868d62f \
--n 0x57657374656e64
```

您将会获得以下结果：

```sh
{"parents":1,"interior":{"x1":{"accountId32":{"network":{"named":"0x57657374656e64"},"id":"0x78914a4d7a946a0e4ed641f336b498736336e05096e342c799cc33c0f868d62f"}}}}
32 byte address is 0x4e21340c3465ec0aa91542de3d4c5f4fc1def526222c7363e0f6f860ea4e503c
20 byte address is 0x4e21340c3465ec0aa91542de3d4c5f4fc1def526
```

在本示例中，Moonbase Alpha的**multilocation衍生账户**是`0x4e21340c3465ec0aa91542de3d4c5f4fc1def526`。请注意，只有Alice是唯一可以通过中继链的远程交易访问此帐户的人，因为她是其私钥的所有者，并且**multilocation衍生帐户**是无密钥的。

### Ethereum-XCM处理调用数据 {: #ethereumxcm-transact-data}

在将XCM消息从中继链发送到Moonbase Alpha之前，您需要获取将通过执行 [`Transact`](https://github.com/paritytech/xcm-format #transact){target=_blank} XCM指令调度的编码调用数据。在本示例中，您将为[Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}的`transact`函数构建编码调用数据{target=_blank}。

编码调用数据需要通过XCM执行的合约交互。在本范例中，您将与一个简单的[增量合约](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#code){target=_blank}进行交互。具体来说，是`increment`函数。此函数并没有输入参数，而会将`number`的值加一。此外，它会将执行函数的区块时间戳储存到`timestamp`变量中。

与`increment`函数交互的编码调用数据为`0xd09de08a`，即`increment()`的keccak256哈希的前8个十六进制字符（或4个字节）。如果函数有输入参数，它们也需要编码。获取编码调用数据最简单的方法是在[Remix](/builders/build/eth-api/dev-env/remix/#interacting-with-a-moonbeam-based-erc-20-from-metamask){target=_blank}或[Moonscan](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#code){target=_blank}进行模拟交易。接下来，在MetaMask 中，在签名之前检查**HEX**标签下的**HEX DATA: 4 BYTES**选择器。您无需签署交易。

通过合约交互数据，您可以为[Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}调用构建编码调用数据。为此，请前往[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}的extrinsics页面并跟随步骤设置以下选项（请注意，extrinsics页面仅将在您拥有帐户时显示）：

!!! 注意事项
    [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}当前实现不支持`CREATE`操作。因此，您无法通过远程EVM调用部署智能合约。

1. 选择**ethereumXcm** pallet
2. 选择**transact**函数
3. 将XCM交易版本设置为**V2**。先前版本已被弃用并将在未来移除
4. 根据需求设置Gas限制。建议您可以手动执行一个`eth_estimateGas` JSON RPC以了解需要多少Gas。在本示例中，Gas限制将被设置为`71000`
5. 将动作设置为**Call**
6. 输入您希望交互的合约地址。在本示例中，为[增量合约](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#code){target=_blank}，地址为`0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8`
7. 将数值设置为`0`。请注意这是因为这个交互并不需要DEV Token（或是Moonbeam/Moonriver网络中的GLMR/MOVR）。您将需要根据需求修改此数值
8. 输入与智能合约交互的编码调用数据。在本示例中为`0xd09de08a`
9. 验证所有参数，并复制[Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}的编码调用数据

!!! 注意事项
    以上调用配置的编码调用数据为`0x260001581501000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00`。

![Ethereum-XCM pallet encoded call data](/images/builders/interoperability/xcm/remote-evm-calls/xcmevm-2.png)

### 为远程XCM执行构建XCM {: #build-xcm-remote-evm}

在本示例中，您将构建一条XCM消息，通过[`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} XCM指令和[Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}的`transact`函数从其中继链在Moonbase Alpha种执行远程EVM调用。

如果您已经[检查了先决条件](#ethereumxcm-check-prerequisites)并且已有[Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}的[编码调用数据](#ethereumxcm-transact-data)，请导向至[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=_blank}的extrinsics页面并设置以下选项：

1. 选取您希望传送XCM的账户。确认账户符合所有[先决条件](#ethereumxcm-check-prerequisites)
2. 选取**xcmPallet** pallet
3. 选取**send**函数
4. 设置目标版本为**V1**
5. 将目标设置为Moonbase Alpha：
```
{
  "parents":0,
  "interior":
    {
    "x1":
      {
      "Parachain": 1000
    }
  }
}
```
6. 设置消息版本为**V2**
7. 在消息中新增三个物件并通过以下方式进行配置（对于一些新增资产的指令，您可能需要**Add item**）：
```
{
  "WithdrawAsset":
    [
      {
        "id":
          {
            "Concrete":
              {
                "parents": 0,
                "interior": {
                  "X1": {
                    "PalletInstance": 3
                  }
                }
              }
            "Fungible": 100000000000000000
          }
    ],
  "BuyExecution":
    {
      "fees": {
        "id":
          {
            "Concrete":
              {
                "parents": 0,
                "interior": {
                  "X1": {
                    "PalletInstance": 3
                  }
                }
              }
            "Fungible": 100000000000000000
          }
      },
      "weightLimit": "Unlimited"
    },
  "Transact":
    {
      "originType": "SovereignAccount",
      "requiredWeightAtMost": "4000000000",
      "call": {
        "encoded": "0x260001581501000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00"
      }

    }
}
```
8. 点击**Submit Transaction**按钮并签署交易

!!! 注意事项
    以上调用配置的编码调用数据为`0x630001000100a10f020c00040000010403001300008a5d78456301130000010403001300008a5d784563010006010300286bee7901260001581501000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00`。

![Remote XCM Call from Relay Chain](/images/builders/interoperability/xcm/remote-evm-calls/xcmevm-3.png)

一旦交易处理完毕，您可以在[中继链](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0x2a0e40a2e5261e792190826ce338ed513fe44dec16dd416a12f547d358773f98){target=_blank}和[Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer/query/0x7570d6fa34b9dccd8b8839c2986260034eafef732bbc09f8ae5f857c28765145){target=_blank}查看相关extrinsics和事件。

在中继链中，extrinsic为`xcmPallet.send`，关联事件为`xcmPallet.Sent`（其中与费用有关）。在Moonbase Alpha中，XCM执行在`parachainSystem.setValidationData`函数发生，并且可以注意多个关联事件：

 - **parachainSystem.DownwardMessagesReceived** — 表示接收到来自中继链的消息的事件。使用当前的XCM实现，来自其他平行链的消息将显示相同的事件
 - **balances.Withdraw** — 与提取Token以支付调用执行费用相关的事件。注意`who`地址是之前计算的**multilocation衍生账户**
 - **ethereum.Executed** — 与执行远程EVM调用相关的事件。它提供了`from`、 `to`、`transactionHash`（使用非标准签名和全网pallet随机数计算）和`exitReason`。目前，一些常见的EVM错误，例如Gas费用不足，会在退出原因中显示`Reverted`
 - **polkadotXcm.AssetsTrapped** — 当未使用从帐户中提取的部分用于费用的Token时发出的事件。通常，当您提供的权重超过要求或没有相关的XCM退款指令时，会发生这种情况。这些Token将被暂时销毁，并可以通过民主提案取回

要验证通过XCM的远程EVM调用是否成功，您可以前往[Moonscan中的合约页面](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#readContract){target=_blank}并验证新数值的数字及其时间戳。

## 通过哈希执行远程EVM调用交易 {: #remove-evm-call-txhash}

如先前所述，[常规和远程XCM EVM调用之间存在一些差异](#differences-regular-remote-evm)。使用Ethereum JSON RPC通过其哈希检索交易时可以看到一些主要差异。

为此，您首先需要检索要查询的交易哈希。 在本示例中，您可以使用[先前部分教程](#build-remove-evm-call-xcm)的交易哈希，为[0x85735a6be6aa0b3ad5f6ce877d8b9048137876517d9ca5b309bcd93ae997bf7a](https://moonbase.moonscan.io/tx/0x85735a6be6aa0b3ad5f6ce877d8b9048137876517d9ca5b309bcd93ae997bf7a){target=_blank}。接着打开终端，执行以下命令：

```sh
curl --location --request POST 'https://rpc.api.moonbase.moonbeam.network' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"eth_getTransactionByHash",
    "params": ["0x85735a6be6aa0b3ad5f6ce877d8b9048137876517d9ca5b309bcd93ae997bf7a"]
  }
'
```

如果JSON RPC请求发送正确，应获得以下结果：

```JSON
{
    "jsonrpc": "2.0",
    "result": {
        "hash": "0x85735a6be6aa0b3ad5f6ce877d8b9048137876517d9ca5b309bcd93ae997bf7a",
        "nonce": "0x1",
        "blockHash": "0xc4b573da6943cc94e55c2fb429160c5b24d91a9da6798102a28dd611c3b76cc0",
        "blockNumber": "0x2e7cf1",
        "transactionIndex": "0x0",
        "from": "0x4e21340c3465ec0aa91542de3d4c5f4fc1def526",
        "to": "0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8",
        "value": "0x0",
        "gasPrice": "0x0",
        "maxFeePerGas": "0x0",
        "maxPriorityFeePerGas": "0x0",
        "gas": "0x11558",
        "input": "0xd09de08a",
        "creates": null,
        "raw": "0xa902e7800180808301155894a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d88084d09de08ac0010101",
        "publicKey": "0x3a9b57bdedea5ddd864355487de6285e032eb8798316da6848587c7f67d71a7a7592a1094ba2123f95659827f40a7096ab4fc278fdde688e3a90ee16eed5f720",
        "chainId": "0x507",
        "standardV": "0x1",
        "v": "0x1",
        "r": "0x1",
        "s": "0x1",
        "accessList": [],
        "type": "0x2"
    },
    "id": 1
}
```

请注意，`v-r-s`值设置为`0x1`，Gas价格相关部分设置为`0x0`。另外，`nonce`字段对应[Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}的全网随机数，而不是调度者帐户的交易数量。

!!! 注意事项
    您可能会在Moonbase Alpha测试网中找到一些交易哈希冲突，因为通过XCM进行远程EVM调用的早期版本没有使用[Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}的全网随机数。
