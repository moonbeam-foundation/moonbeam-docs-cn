---
title:  批量预编译合约
description:  学习如何一次通过Moonbeam预编译批量合约执行多个转账交易以及合约交互。
keywords: solidity、以太坊、批量、交易、moonbeam、预编译、合约
---

# 与批量预编译合约交互

![Precomiled Contracts Banner](/images/builders/build/canonical-contracts/precompiles/batch/batch-banner.png)

## 概览 {: #introduction }

Moonbeam上的批量预编译合约允许开发者同时执行多个EVM调用。

目前来说，要让用户与多个合约进行交互，需要在用户的钱包中执行多个交易确认。举个简单的例子，需要先批准智能合约使用特定Token，然后再进行转账。但预编译合约能够使开发者优化使用者体验，因其可以将用户需要确认的交易数量减少为一个。此外，由于批量执行无需多次支付Gas费（每个交易的起始Gas费为21000单位），还能够节省用户所需的Gas费用。

此预编译合约直接与Substrate EVM pallet交互。批量函数的调用者将会在其地址为所有子交易执行`msg.sender`，但与[委托调用（Delegate Call）](https://docs.soliditylang.org/en/v0.8.15/introduction-to-smart-contracts.html#delegatecall-callcode-and-libraries){target=_blank}不同的是，目标合约的存储仍然被影响。实际上是用户签署了多笔交易，但只需要一次确认。

此预编译合约位于以下地址：

=== "Moonbeam"
     ```
     {{networks.moonbeam.precompiles.batch }}
     ```

=== "Moonriver"
     ```
     {{networks.moonriver.precompiles.batch }}
     ```

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.batch }}
     ```

## 批量Solidity接口 {: #the-batch-interface }

[Batch.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank}为允许开发者与预编译合约三个函数交互的Solidity接口。

--8<-- 'text/batch/batch-interface.md'

## 查看先决条件 {: #checking-prerequisites }

要跟随此教程操作，您需要准备以下内容：

- [安装MetaMask并连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
- 在Moonbase Alpha上创建或是拥有两个账户以测试批量预编译合约的不同功能
- 至少拥有一个具有`DEV`的账户。
   --8<-- 'text/faucet/faucet-list-item.md'

## 使用Remix与预编译合约交互 {: #interact-with-the-precompile-using-remix }

您可以使用[Remix](https://remix.ethereum.org/){target=_blank}与批量预编译合约交互，您可以将预编译合约加入至Remix并遵循以下教程：

1. 获得[`Batch.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank}副本

2. 将其文件内容粘贴至Remix文件内并命名为**Batch.sol**

3. 获得[`SimpleContract.sol`](#example-contract)副本

4. 将其文件内容粘贴至Remix文件内并命名为**SimpleContract.sol**

### 范例合约 {: #example-contract}

此`SimpleContract.sol`合约将会作为批量合约交互的范例，但在实际操作上所有合约皆可以进行交互。

 --8<-- 'code/batch/simple-contract.md'

### 编译合约 {: #compile-the-contract }

接着您需要在Remix中编译上述的两个文件：

1. 确保您打开**Batch.sol**文件

2. 点击**Compile**标签（从上到下第二个）

3. 点击**Compile Batch.sol**以编译合约

![Compiling Batch.sol](/images/builders/build/canonical-contracts/precompiles/batch/batch-1.png)

如果接口编译成功，你将会在**Compile**标签旁看到绿色的打勾图示。

### 使用预编译合约 {: #access-the-precompile }

您将会使用预编译合约的地址访问接口，而非部署批量预编译合约：

1. 在Remix中的**Compile**标签下方点击**Deploy and Run**标签，请确保预编译合约已部署成功

2. 确保**ENVIRONMENT**下拉菜单中已选取**Injected Web3**。当您选取**Injected Web3**后，MetaMask将会跳出弹窗要求将您的账户与Remix连接

3. 确保**ACCOUNT**下方显示的是正确的账户地址

4. 确保**CONTRACT**下拉菜单中**Batch - Batch.sol**已被选取。由于此为预编译合约，因此您不需要部署任何代码，但我们仍需要在**At Address**输入栏中提供预编译合约的地址

5. 提供批量预编译合约的地址：`{{networks.moonbase.precompiles.batch}}`并点击**At Address**

![Access the address](/images/builders/build/canonical-contracts/precompiles/batch/batch-2.png)

**BATCH**预编译合约将会出现在**Deployed Contract**的菜单当中。

### 部署范例合约 {: #deploy-example-contract }

另一方面，`SimpleContract.sol`将会作为一个新合约被部署。在开始本部分教程前，请为`SimpleContract.sol`档案重复[编译步骤](#compile-the-contract)。

1. 在Remix中的**Compile**标签下方点击**Deploy and Run**

2. 确保**ENVIRONMENT**下拉菜单中已选取**Injected Web3**，当您选取**Injected Web3**时，您或许将会见到MetaMask与Remix连接的弹窗

3. 确保**ACCOUNT**下方显示的是正确的账户地址

4. 确保**CONTRACT**下拉菜单中**SimpleContract - SimpleContract.sol**已被选取

5. 点击**Deploy**

6. 在MetaMask跳出的弹窗中点击**Confirm**以确认交易

![Deploy SimpleContract](/images/builders/build/canonical-contracts/precompiles/batch/batch-3.png)

**SIMPLECONTRACT**合约将会出现在**Deployed Contracts**当中。

### 通过预编译合约传送原生资产 {: #send-native-currency-via-precompile }

使用批量预编译合约传送原生资产相较于在Remix或是MetaMask点击按钮更加的复杂。在本示例中，您将会使用**batchAll**函数传送原生资产。

在交易时将会出现数量输入栏，需要填写特定数量的原生资产进行传送。在Remix中，这将会在**DEPLOY & RUN TRANSACTIONS**标签中的**VALUE**中显示。然而，在批量预编译合约中，此数据将会在批量函数中的**value**数组输入中被提供。

您可以尝试在Moonbase Alpha上转移原生资产至您指定的两个钱包：

1. 确保您连接的钱包中至少有0.5个DEV

2. 在**Deployed Contracts**中展开批量预编译合约

3. 展开**batchAll**函数

4. 在**to**输入栏中，根据以下格式输入您的地址：`["ADDRESS-1-HERE", "ADDRESS-2-HERE"]`，其中第一个地址代表您希望传送资产的第一个地址，而第二个地址为您希望传送资产的第二个地址

5. 在**value**输入栏中，输入您希望转移至个别地址以Wei为单位的数量。举例而言，`["100000000000000000", "200000000000000000"]`将会转移0.1 DEV至第一个地址和0.2 DEV至第二个地址

6. 在剩下的**call_data**和**gas_limit**输入栏中输入`[]`，调用数据和Gas限制在传送原生资产时不需要考虑

7. 点击**transact**

8. 在MetaMask跳出的弹窗中点击**Confirm**以确认交易

![Send Batch Transfer](/images/builders/build/canonical-contracts/precompiles/batch/batch-4.png)

当交易完成后，确保您查看两个地址的余额，不论是通过MetaMask或是[区块浏览器](/builders/get-started/explorers/){target=_blank}皆可。恭喜您！您已经成功通过批量预编译合约传送批量交易。

!!! 注意事项
    一般而言如果您希望通过合约传送资产或是传送资产至合约当中，您将会需要在整体交易对象中设定传送数量并与支付函数交互。然而，由于批量预编译合约直接与Substrate代码交互，并不是一个一般的以太坊交易，因此无需设置上述数据。

### 查看合约交易调用数据 {: #find-a-contract-interactions-call-data }

如Remix般的可视化接口和如Ethers.js般顺手的库隐藏了以太坊交易与Solidity智能合约之间的交互。函数的名称和输入数值被储存在[函数选择器](https://docs.soliditylang.org/en/latest/abi-spec.html#function-selector-and-argument-encoding)中{target=_blank}，且输入数值将会被编码，两者将会被整合并以交易的调用数据传送。如果您希望在批量交易中传送子交易，您需要事先了解调用数据。

您可以尝试使用Remix查询交易的调用数据：

1. 在**Deployed Contracts**下方展开`SimpleContract.sol`合约

2. 展开**setMessage**函数

3. 输入函数的数值，在本示例中**id**为`1`，而**m**（message）为`"moonbeam"`

4. 点击**transact**按钮旁的复制按钮以复制调用数据而非传送交易

![Transaction Call Data](/images/builders/build/canonical-contracts/precompiles/batch/batch-5.png)

现在您已经拥有该交易的调用数据！根据范例数据的`1` 和`"moonbeam"`，我们可以在调用数据中查找这些被编码的数据：

 --8<-- 'code/batch/simple-message-call-data.md'

调用数据可以被拆分为五行：

 - 第一行为函数选择器
 - 第二行为1，也就是**id**获得的数值
 - 接下来为**m**（message）的输入值。此最后三行相对抽象，因字串属于长度能够变动的[动态种类](https://docs.soliditylang.org/en/v0.8.15/abi-spec.html#use-of-dynamic-types){target=_blank}。第三行是一个偏移量，用于定义字符串数据的开始位置。第四行指的是字符串的长度，在本示例中为8，因为“moonbeam”是8个字符串长度。最后，第五行是向左对齐的”moonbeam“的十六进制格式（8个ASCII字符为16进制字符）并余留0个填充空间

### 通过预编译与函数交互 {: #function-interaction-via-precompile }

此部分教程范例将会使用**batchAll**函数以确保交易能够快速解决。请记得仍然有另外两个批量函数能够在无视错误情况下执行子交易或是停止衍生的子交易但却不收回先前执行的交易。

函数交互与[传送原生资产](#send-native-currency-via-precompile)非常相似，因两者皆为执行交易。然而，调用数据需要为函数提供适当的数值输入，且传送者有可能需要在每个子交易中限制花费的Gas费用。

`call_data`与`gas_limit`输入栏与那些和合约交互的子交易更加相关。对于在批量预编译合约接口的函数，`call_data`输入的是一个数组，其中每个索引对应每个子事务接受者的调用数据，也就是，`to`所需要的数值。如果`call_data`数组的数值小于`to`数组，剩余的子交易将会缺少调用数据（也就是没有输入的函数）。至于`gas_limit`则为在每个子交易中花费Gas数量有关的数组，如果其长度小于`to`数组，先前子交易剩余的Gas将会被转用。

您可以根据以下步骤传送一个批量交易：

1. 在`SimpleContract.sol`标题右方的复制按钮复制其合约地址，请确保您拥有来自[先前部分教程的调用数据](#finding-a-contract-interactions-call-data)

2. 在**Deployed Contracts**下方展开批量预编译合约

3. 展开**batchAll**函数

4. 在**to**输入栏中，以下述格式插入您先前复制的`SimpleContract.sol`合约地址：`["SIMPLE-CONTRACT-ADDRESS-HERE"]`

5. 在数值输入栏中，由于`["SIMPLE-CONTRACT-ADDRESS-HERE"]`并不需要支付任何原生资产，输入`["0"]`代表0 Wei

6. 在**call_data**输入栏位中，以下格式插入您在先前部分教程获得的函数数据：`["CALL-DATA-HERE"]`

7. 在**gas_limit**输入栏中，插入`[]`。您也可以输入Gas限制的数据，依据您的需求决定

8. 点击**transact**

9. 在MetaMask跳出的弹窗中点击**Confirm**以确认交易

![Batch Function Interaction](/images/builders/build/canonical-contracts/precompiles/batch/batch-6.png)

如果您使用与教程中相同的函数数据，请确认交易是否为成功状态：

1. 在**Deployed Contracts**下方展开`SimpleContract.sol`合约

2. 在**messages**按钮右方输入`1`

3. 点击蓝色的**messages**按钮

![SimpleContract Confirmation](/images/builders/build/canonical-contracts/precompiles/batch/batch-7.png)

  **"moonbeam"**这个单词应当显示在下方。恭喜！您已成功使用批量预编译合约与函数交互。

### 整合子交易 {: #combining-subtransactions }

目前为止，传送原生资产和与函数交互为分开的状态，但实际上两者可以整合在一起。

以下字符串可以整合在一起作为一个批量交易的输入数值，他们将传送1 DEV至公共Gerald账户（`0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b`）并与预先部署的`SimpleContract.sol`交互两次，以下为详细步骤：

此处将会有三个子交易，所有将会三个地址被输入在`to`输入数组中。第一个为公共Gerald账户，其次为预先部署的`SimpleContract.sol`合约。您可以使用您自身的`SimpleContract.sol`实例来取代，或是仅取代其中之一，您可以在单一信息中与多个合约交互。

```
[
  "0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b",
  "0xd14b70a55F6cBAc06d4FA49b99be0370D0e1BD39", 
  "0xd14b70a55F6cBAc06d4FA49b99be0370D0e1BD39"
]
```

同样地， `value`数组需要三个数值。`to`输入数组中的第一个地址需要执行的动作为传送1 DEV，因此1 DEV将会以Wei为单位输入在数组之中，接续的两个数值为0以为其子交易并不接受或是需要原生资产。

```
["1000000000000000000", "0", "0"]
```

如上， `call_data`数组也需要三个数值。由于传送原生资产并不需要调用数据，字符串可以以空白显示。而数组中的第二和第三个数值与**setMessage**的调用有关，将会把id设置为5和6。

```
[
  "", 
  "0x648345c8000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000009796f752061726520610000000000000000000000000000000000000000000000", 
  "0x648345c800000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000e61206d6f6f6e6265616d2070726f000000000000000000000000000000000000"
]
```

最后一个输入数值为`gas_input`，此数组可以为空白以将剩余的Gas用于其他子交易之中。

```
[]
```

您可以在Remix中使用这些输入数值传送一个批量交易，如同您[批量一个调用函数](#function-interaction-via-precompile)。

恭喜！您已成功使用MetaMask和Remix与ERC-20预编译合约交互。

## 使用以太坊开发者库 {: #using-ethereum-developer-libraries }

如果您跟随的是Moonbeam上的[Ethers.js教程](/builders/build/eth-api/libraries/ethersjs/){target=_blank}，您或许会发现难以为单一函数找到其调用数据。其答案则被藏于Ether的`utils.Interface`对象之中，而[encodeFunctionData](https://docs.ethers.io/v5/api/utils/abi/interface/#Interface--encoding){target=_blank}函数将能允许您输入函数名称以及获得调用数据的结果。Web3.js也具有类似的函数[encodeFunctionCall](https://web3js.readthedocs.io/en/v1.2.11/web3-eth-abi.html#encodefunctioncall){target=_blank}。

!!! 注意事项
    以下部分显示的代码段并非用于生产环境，请确保您根据用例修改。

=== "Web3.js"
     --8<-- 'code/batch/web3js-batch.md'

=== "Ethers.js"
     --8<-- 'code/batch/ethers-batch.md'

=== "Web3.py"
     --8<-- 'code/batch/web3py-batch.md'

最后，您应当已经了解如何使用批量预编译合约交互，如同您在以太坊与一般合约交互相同。