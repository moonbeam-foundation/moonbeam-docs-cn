---
title: Tenderly开发平台
description: 学习如何使用以太坊开发平台Tenderly在Moonbeam上构建、调试、监控Solidity智能合约。
---

# 在Moonbeam上使用Tenderly

![Tenderly Banner](/images/builders/build/eth-api/dev-env/tenderly/tenderly-banner.png)

## 概览 {: #introduction } 

[Tenderly](https://tenderly.co/){target=_blank}是一个Web3开发平台，包含一套旨在帮助开发者贯穿DApp开发生命周期的工具。通过Tenderly，您可以构建、调试、测试、优化、监控、设置警报，以及查看分析Moonbeam和Moonriver上的智能合约。

Tenderly平台提供以下功能：

- **[Contract Verification](https://docs.tenderly.co/monitoring/smart-contract-verification/){target=_blank}** - 充分利用Tenderly的所有功能以验证智能合约非常重要，Tenderly提供了多种验证方法。您可以通过[Tenderly数据面板](https://docs.tenderly.co/monitoring/smart-contract-verification/verifying-a-smart-contract#verifying-a-smart-contract){target=_blank}、[Tenderly CLI](https://docs.tenderly.co/monitoring/smart-contract-verification/verifying-contracts-using-cli){target=_blank}或[Tenderly Hardhat插件](https://docs.tenderly.co/monitoring/smart-contract-verification/verifying-contracts-using-the-tenderly-hardhat-plugin){target=_blank}验证智能合约

- **[Debugger](https://docs.tenderly.co/debugger/how-to-use-tenderly-debugger){target=_blank}** - 使用可视化调试器检查交易并更好地了解代码。通过debugger，您可以查看交易的堆栈追踪，查看交易中的调用，识别合约并查看编码输入、输出和状态变量。您可以在Tenderly数据面板或[Tenderly Debugger谷歌扩展程序](https://docs.tenderly.co/simulations-and-forks/how-to-simulate-a-transaction){target=_blank}使用debugger

- **[Gas Profiler](https://docs.tenderly.co/debugger/how-to-use-tenderly-debugger#gas-profiler){target=_blank}** - 查看您更细化的gas花费情况，从而您可以优化您的智能合约并减少交易gas成本

- **[Simulator](https://docs.tenderly.co/simulations-and-forks/how-to-simulate-a-transaction){target=_blank}** - 在分叉的开发环境中模拟交易，以在无需将交易传送至链上的情况下了解其如何运作。通过这种方式，您可以了解交易的结果并确保在将其发送至网络前按预期运作。您可以尝试不同的参数，模拟历史和当前交易，并编辑合约源代码。您可以从Tenderly数据面板访问模拟器，或用[Tenderly Simulation API](https://docs.tenderly.co/simulations-and-forks/simulation-api){target=_blank}以编程的方式来利用模拟器

- **[Forks](https://docs.tenderly.co/simulations-and-forks/how-to-create-a-fork){target=_blank}** - 此功能在隔离环境中模拟实时Moonbeam网络，这使您可以与部署的合约和实时链上数据进行交互。分叉还使交易模拟更进了一步，它使您能够按时间顺序将多个模拟链接在一起。Forks允许复杂的交易测试场景，当出现一个交易依赖于另一个交易，并具有使用实时链上数据的好处。使用Tenderly分叉功能的时候需要注意一些限制。您不能与任何Moonbeam预编译的合约及其函数交互。预编译是Substrate实施的一部分，因此不能在模拟的EVM环境中复制。这禁止您在Moonbeam上与跨链资产交互和使用基于Substrate的功能（如质押和治理）

- **[Alerting](https://docs.tenderly.co/alerts/intro-to-alerts){target=_blank}** - 配置实时警报，在特定活动发生时通知，以便让您了解智能合约的情况

- **[Web3 Actions](https://docs.tenderly.co/web3-actions/intro-to-web3-actions){target=_blank}** - 在JavaScript或TypeScript创建可编程函数，当特定智能合约或链事件发生时，此函数能够通过Tenderly自动执行

- **[Analytics](https://docs.tenderly.co/analytics/general-analytics){target=_blank}** - 可视化交易和链上数据以深入了解当前项目进展。您可以使用Tenderly的分析构建器或创建自定义查询和脚本来满足您的分析需求

- **[Sandbox](https://sandbox.tenderly.co/){target=_blank}** - 在您的浏览器使用内置的JavaScript和Solidity编辑器来直接编写、编译、执行和调试您的智能合约。每次您运行您的代码，Tenderly会创建一个临时分叉，其中包含10个预注资的账户，每个账户有用于测试使用的100个Token

!!! 注意事项
    对Moonbeam和Moonriver的支持现分为两个阶段实现。目前集成正处于第一阶段，您可以[在Tenderly文档网站上查看局限性](https://docs.tenderly.co/supported-networks-and-languages#footnotes){target=_blank}。在第二阶段，对Moonbeam和Moonriver的支持将完全启动。

## 开始操作 {: #getting-started }

Tenderly数据面板提供对一站式Web3开发平台的访问。要开始使用数据面板，您将需要先[注册](https://dashboard.tenderly.co/register){target=_blank}一个新账号。注册成功后，您将能够开始使用您的Tenderly数据面板。

![Tenderly dashboard](/images/builders/build/eth-api/dev-env/tenderly/tenderly-1.png)

如果您尚未设置账号，您也可以使用[Tenderly浏览器](https://dashboard.tenderly.co/explorer){target=_blank}访问有限功能。在没有账户的情况下，您仍可以获取合约和交易的信息，然而，您将无法模拟交易或创建分叉的环境。

要以编程的方式与Tenderly的功能交互，您可以查看[Tenderly CLI](https://github.com/Tenderly/tenderly-cli){target=_blank} GitHub代码库以获取更多信息。

以下部分将向您展示如何开始在Moonbeam上使用Tenderly。更详细的文档，请参考[Tenderly'的文档网站](https://docs.tenderly.co/){target=_blank}

### 创建Sandbox {: #create-a-moonbeam-sandbox }

要使用Tenderly Sandbox部署合约至Moonbeam，您可以导向至[sandbox.tenderly.co](https://sandbox.tenderly.co/){target=_blank}并执行以下步骤：

1. 在左手边的Solidity编辑器中输入您的智能合约
2. 从**Network**菜单中选择**Moonbeam**或**Moonriver**，调整任何编译设置，并在需要时指定要在之上运行代码的区块
3. 为合约更新右侧的JavaScript编辑器。Ethers.js和Web3.js默认包含在Sandbox中，并可分别用`ethers`和`web3`实例化。另外需要注意的是Sandbox包含[global variables](https://docs.tenderly.co/tenderly-sandbox#available-javascript-global-variables){target=_blank}以简化开发，因此您无需更新Moonbeam的RPC URL
4. 一切准备就绪后，点击**RUN**开始编译合约并执行代码

如果您的代码包含部署合约或发送交易的逻辑，您将会在页面左下角的**Simulated Transactions**部分下方看到交易。

![Tenderly Sandbox](/images/builders/build/eth-api/dev-env/tenderly/tenderly-2.png)

### 添加合约 {: #add-a-contract }

开始使用Tenderly数据面板的入门操作是添加已部署的智能合约。添加合约后，您将能够创建交易模拟和分叉、使用debugger、设置监控和警报，等等。

要添加新合约，您可以点击数据面板左侧的**Contracts**，然后点击**Add Contract**。随后将跳出弹窗，请执行以下步骤：

1. 输入合约地址
2. 根据您想要部署智能合约的目的地，选择**Moonbeam**或**Moonriver**作为网络
3. （可选）为合约设置名称
4. （可选）如果您要添加其他合约，您可以启动**Add more**滑块。这将允许您在添加初始合约后添加更多合约
5. 最后点击**Add contract**将合约添加至数据面板

![Add a contract](/images/builders/build/eth-api/dev-env/tenderly/tenderly-3.png)

添加合约后，该合约将出现在**Contracts**数据面板的合约列表当中。如果合约尚未被验证，数据面板将会显示**Unverified**状态以及**Verify**按钮。

![Contract in list of contracts](/images/builders/build/eth-api/dev-env/tenderly/tenderly-4.png)

要充分利用Tenderly工具集，建议您验证您的智能合约，您可通过点击**Verify**按钮完成此操作。您可以通过上传合约的JSON、ABI或源代码验证您的合约。更多信息，请参考[Tenderly的文档](https://docs.tenderly.co/monitoring/smart-contract-verification/verifying-a-smart-contract#verifying-a-smart-contract){target=_blank}

### 创建分叉 {: #fork-moonbeam }

Tenderly的分叉功能在隔离环境中模拟实时Moonbeam网络，这使您能够与部署的合约和实时链上数据进行交互。

使用Tenderly分叉功能的时候需要注意一些限制。您不能与任何Moonbeam预编译的合约及其功能交互。预编译是Substrate实施的一部分，因此不能在模拟的EVM环境中复制。这禁止您在Moonbeam上与跨链资产交互和使用基于Substrate的功能（如质押和治理）。

Tenderly使通过数据面板创建分叉变得非常简单。首先，点击左侧菜单的**Forks**，然后点击**Create Fork**。随后，执行以下步骤：

1. 在**Network**下拉菜单中选择**Moonbeam**或**Moonriver**
2. （可选）为您的分叉设置名称
3. 如果您只需要特定区块前的数据，您可以关闭**Use Latest Block**滑块并指定区块号。反之，您可以保持滑块启动的状态以包含所有区块直到最新的区块
4. 点击**Create**

![Fork Moonbeam](/images/builders/build/eth-api/dev-env/tenderly/tenderly-5.png)

创建分叉后，您可以通过向分叉部署合约或使用其创建交易模拟来开始使用。

要部署合约至分叉，您可以点击**Deploy Contract**按钮，上传您的合约源代码，并设置编译器配置。提交部署后，您将看到部署的交易出现在**Simulated Transactions**标签下，并且可以点击simulation获取更多信息。

![Fork simulations](/images/builders/build/eth-api/dev-env/tenderly/tenderly-6.png)

要创建额外的模拟，您可以点击**New Simulation**按钮并输入模拟的配置。更多关于模拟的信息，请参考[Tenderly的如何模拟交易的文档](https://docs.tenderly.co/simulations-and-forks/how-to-simulate-a-transaction){target=_blank}。

现在您已经了解如何在Moonbeam上使用一些Tenderly的功能，您可以随时查看并了解其开发平台上的其他可用工具。更多信息请访问[Tenderly的文档网站](https://docs.tenderly.co/){target=_blank}。

--8<-- 'text/disclaimers/third-party-content.md'