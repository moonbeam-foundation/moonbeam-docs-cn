---
title: 使用Tenderly进行调试和模拟交易
description: 跟随教程中的详细步骤以了解如何操作Tenderly，包含使用调试器（Debugger）、分叉和模拟交易以及监控智能合约
---

# 使用Tenderly模拟和调试交易

_作者：Kevin Neilson_

## 概览 {: #introduction }

Tenderly是一个用于EVM网络的一体化开发平台，允许Web3开发者能够构建、测试、监控和操作他们的智能合约。Tenderly拥有[全套产品选项](/builders/build/eth-api/dev-env/tenderly/)，可以帮助您作为开发者在智能合约的整个生命周期中（从开发的最早阶段到维护）管理和监控实时生产dApp。

Tenderly提供的大多数服务都是免费使用的，但您需要订阅付费计划才能使用实时警报和作战室功能等高级功能。Tenderly支持Moonbeam和Moonriver，但目前不支持Moonbase Alpha。有关Tenderly产品的更多信息，请查看[Tenderly简介](/builders/build/eth-api/dev-env/tenderly/)。

在本教程中，我们将会探索Tenderly两个最具代表性的功能，调试器和模拟器。

## 查看先决条件 {: #checking-prerequisites }

在开始之前，您需要具备以下条件：

 - 拥有一个免费的[Tenderly账户](https://dashboard.tenderly.co/register?utm_source=homepage){target=\_blank}。您无需订阅付费计划即可完成本教程

## 创建一个Tenderly项目 {: #create-a-tenderly-project }

虽然并不是完全必要，但创建一个Tenderly项目能够更好地管理和访问Tenderly的可用功能。在**Select Project**下拉选单中，您可以点击**Create Project**或是访问[创建项目链接](https://dashboard.tenderly.co/projects/create){target=\_blank}执行此动作。

您可以命名项目名称并点击**Create Project**。虽然您可以在其后随时更改您的项目名称，但URL将会保持您初始创建的设定。

![Create a Tenderly account](/images/tutorials/eth-api/using-tenderly/tenderly-1.png)

一个免费的账户有创建一个项目的限制，但您可以在单一项目下设定多个智能合约。

## 添加智能合约 {: #add-smart-contracts }

添加一个智能合约至您的Tenderly项目类似于标上书签。虽然并非必要的，添加智能合约将会解锁额外Tenderly在平台上建议搜索合约的功能。

要添加智能合约至您的Tenderly项目，点击**Inspect**标题下**Contracts**标签，接着点击**Add Contracts**。然后，执行以下步骤：

1. 输入合约地址。在此教程中，我们会使用FRAX稳定币合约`0x322E86852e492a7Ee17f28a78c663da38FB33bfb`
2. 选取合约部署至的网络，此例中我们会选取**Moonbeam**
3. 命名合约以更好地在操作界面中辨识
4. 点击**Add Contract**

![Add a smart contract](/images/tutorials/eth-api/using-tenderly/tenderly-2.png)

## 模拟交易 {: #simulate-a-transaction }

模拟将会让您了解交易在不会正式传送至区块链的前提下是如何执行的。您可以在任何时间点或是最新的区块模拟交易。

导向至**Simulator**标签，让我们通过以下步骤在Moonbeam网络上创建一个模拟交易：

1. 选取您希望交互的合约。此处显示的名称是您在[添加合约至您的Tenderly工作环境中](#add-smart-contracts)时设置的名称
2. 选取您希望调用的合约函数。在此处`Transfer`函数被选取作为演示
3. 接着，我们将会输入函数的相关参数。关于目标地址，您可以输入任何地址，在本示例中我们将输入Alith的地址：`0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`
4. 您也可以输入任意数量，在本示例中为`10000000000`
5. 选取**Pending Block**以在Moonbeam最新生产的区块运行模拟
6. 指定发出地址为Baltathar：`0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0`，或是任何您希望模拟的地址
7. 点击**Simulate Transaction**

![Simulate a transaction against Moonbeam](/images/tutorials/eth-api/using-tenderly/tenderly-3.png)

显然，这个模拟交易将会失败，因为我们试图发送我们没有的10,000 FRAX。但是，使用[Tenderly模拟器](https://docs.tenderly.co/simulations-and-forks/how-to-simulate-a-transaction){target=\_blank}，我们可以修改区块链状态并运行假设不同条件的模拟。例如，我们假设Baltathar实际上持有10,000 FRAX的余额来运行模拟。点击右上角的**Re-Simulate**，然后执行以下步骤：

1. 展开**State Overrides**部分
2. 点击**Add State Override**
3. 选取相关合约，此处为FRAX的合约
4. 在**Storage Variables**部分的项目，我们将会通过指定私钥：`balanceOf[0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0]`和数值：`10000000000`来取代Baltathar持有余额的映射。请注意您正在**Storage Variables**部分中执行此步骤，而非**Balance**部分
5. 点击**Add**以确认点击状态覆盖
6. 点击**Simulate Transaction**

![Simulate a transaction against Moonbeam with state overrides](/images/tutorials/eth-api/using-tenderly/tenderly-4.png)

!!! 注意事项
    请记得Alith和Baltathar属于[公共开发者账户列表](/builders/get-started/networks/moonbeam-dev/#pre-funded-development-accounts){target=\_blank}，拥有公开的私钥。如您传送资金至这两个地址，将导致资金损失。

如果您正确添加状态覆盖，您应当能在运行模拟时看见模拟成功的画面。如果您看见错误警示，您可以点击**Re-Simulate**并验证您是否正确配置状态覆盖。

![Transaction simulation with state override success](/images/tutorials/eth-api/using-tenderly/tenderly-5.png)

您也可以通过[Tenderly模拟API](https://docs.tenderly.co/simulations-and-forks/simulation-api){target=\_blank}来访问Tenderly的交易模拟器。

## 分叉链 {: #fork-the-chain }

### 创建一个分叉 {: #create-a-fork }

模拟非常适合一次性测试，但如果您想测试一系列相互依赖的交易怎么办？在这种情况下，分叉是更好的选择，因为分叉是有状态的。此外，当您想要在链上私有环境中与合约交互而无需重新部署现有智能合约时，[Tenderly forks](https://docs.tenderly.co/simulations-and-forks/forks){target=\_blank}是一个绝佳的选择。

!!! 注意事项
    使用Tenderly的分叉功能时需要注意一些限制。您无法与任何[Moonbeam预编译合约](/builders/pallets-precompiles/precompiles/){target=\_blank}或其函数进行交互。预编译是Substrate实现的一部分，因此无法在模拟EVM环境中复制。这会阻止您在Moonbeam和基于Substrate的功能（例如质押和治理）上与跨链资产进行交互。

通过Tenderly创建分叉非常简单，您可以导向至**Forks**标签并采取以下步骤：

1. 在**Network**下拉选单中，选取**Moonbeam**或是**Moonriver**
2. （可选）命名您的分叉
3. 如果您仅需要某个特定区块截至的数值，您可以关闭**Use Latest Block滑块并指定区块编码。或者，您可以保持原状让其包含至最新区块的所有区块
4. 点击**Create**

![Create a fork](/images/tutorials/eth-api/using-tenderly/tenderly-6.png)

### 与分叉交互 {: #interacting-with-the-fork }

在下一部分中，我们将演示分叉的状态性以及它们如何帮助您测试单个模拟之外的场景。使用您刚刚创建的分叉，尝试调用`transfer`函数将一些FRAX从Baltahar发送到Alice，就像您之前在[模拟部分](#simulate-a-transaction)中所做的那样，但没有状态覆盖。不出所料的操作失败，因为Baltahar没有FRAX余额。但是，让我们通过在分叉环境中为Baltahar铸造一些FRAX来改变这一点。为此，请执行以下步骤：

1. 选取您希望交互的合约
2. 选取您希望调用的函数，此出我们会选取`minter_mint`
3. 输入Baltathar地址：`0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0`
4. 输入铸造数量，如`10000000000000`
5. 铸造在FRAX合约中扮演一个特权的角色。我们需要在我们的分叉中执行此交易的传送者为[FRAX合约的授权铸造者](https://moonbeam.moonscan.io/token/0x322e86852e492a7ee17f28a78c663da38fb33bfb#readContract){target=\_blank}，即为`0x343e4f06bf240d22fbdfd4a2fe5858bc66e79f12`
6. 点击**Simulate Transaction**

![Run simulation on fork to mint FRAX](/images/tutorials/eth-api/using-tenderly/tenderly-7.png)

很好！让我们继续并尝试执行Baltathar，因其已经拥有了足够的FRAX。您可以点击**New Simulation**，然后执行以下步骤：

1. 在下拉选单中选取`FRAX`合约
2. 选取您希望调用的合约函数，此处我们将选取`transfer`
3. 接着，我们将会输入函数的相关参数。输入Alith的地址作为目标地址：`0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`
4. 您可以指定任何非零数量，如`123`
5. 指定来源地址为Baltathar`0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0`
6. 点击**Simulate Transaction**

![Run simulation on fork to transfer FRAX](/images/tutorials/eth-api/using-tenderly/tenderly-8.png)

请注意，右上角的**ForkParameters**下的父区块为**Previous Simulation**。这代表我们现在提交的模拟将建立在前一个模拟中所做的任何状态更改的基础上。如果您发现错误表明余额不足，这可能是由于意外覆盖区块编号以使用与原始 `minter_mint`交易相同的区块编号造成的。

Tenderly同样为您的分叉生成一个自定义的RPC url，类似于`https://rpc.tenderly.co/fork/YOUR_UNIQUE_FORK_IDENTIFIER`。您可以使用此RPC url来从[Hardhat](/builders/build/eth-api/dev-env/hardhat){target=\_blank}、[Foundry](/builders/build/eth-api/dev-env/foundry){target=\_blank}或是其他任意[开发环境](/builders/build/eth-api/dev-env/){target=\_blank}来传送交易至您的分叉。

## 调试 {: #debugging }

[调试器](https://docs.tenderly.co/debugger/how-to-use-tenderly-debugger){target=\_blank}是Tenderly最强大、最受好评的功能之一。它的速度相当快，并且仅需要最少的设置。事实上，如果您正在研究的合约已经在链上进行了验证，那么启动调试器就像在Tenderly上搜索交易哈希一样简单。让我们尝试一下。

在上方的搜索栏中，您可以粘贴合约地址或交易哈希。请注意Tenderly支持Moonbeam和Moonriver，但目前不支持Moonbase Alpha。以下是StellaSwap上GLMR/FRAX交易对的交易哈希示例：

```text
0x80c87ab47e077ca491045047389e6bd88a748ca24971a288d09608834a3bda07
```

找到交易哈希后，您会在顶部看到有关交易的所有典型统计信息，例如状态、Gas价格、使用的Gas等。接下来，您将看到传输的Token的详细信息。在底部，您将看到每个函数调用的一长串列表。鉴于兑换是一种相对复杂的交互，并且StellaSwap使用可升级的代理合约，您将在此示例中看到相当长的列表。

![Debugger 1](/images/tutorials/eth-api/using-tenderly/tenderly-9.png)

如果您单击左侧导航栏上的**Contract**，您将看到与交易交互的每个合约的列表。您可以点击合约查看更多详细信息，如果合约经过验证，您还可以查看完整的源代码。

![Debugger 2](/images/tutorials/eth-api/using-tenderly/tenderly-10.png)

在左侧导航栏下方，您将看到一个**Events**标签，后面跟着一个**State Changes**标签，该标签以可视化形式表现了因交易发生的链状态更动。

![Debugger 3](/images/tutorials/eth-api/using-tenderly/tenderly-11.png)

如果您下滑至**Debugger**标签，您将能够逐条查看合约并在最底部查看状态信息，允许您标注任何错误的来源。

![Debugger 4](/images/tutorials/eth-api/using-tenderly/tenderly-12.png)

最后，您能看到**Gas Profiler**，赋予您以可视化的形式查看Gas在交易系列动作中执行和花费的去向。您可以点击任何函数调用栏位（以蓝色长方形的形式表现）查看每个调用花费了多少Gas。

![Debugger 4](/images/tutorials/eth-api/using-tenderly/tenderly-13.png)

要更详细地了解如何使用Tenderly调试器，请查看[Tenderly调试器指南](https://docs.tenderly.co/debugger/how-to-use-tenderly-debugger){target=\_blank}。就是这样！您已顺利掌握Tenderly，这肯定会节省您的时间并简化您在Moonbeam上构建dApp的开发体验。

--8<-- 'text/_disclaimers/educational-tutorial.md'

--8<-- 'text/_disclaimers/third-party-content.md'
