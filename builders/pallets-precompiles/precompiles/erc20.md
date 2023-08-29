---
title:  原生Token ERC-20预编译
description:  学习如何在Moonbeam上访问并交互原生Token ERC-20，以及如何使用ERC-20预编译合约。
keywords: 标准合约, 以太坊, moonbeam, 预编译, 智能合约, token, 原生
---

# 原生Token ERC-20预编译

## 概览 {: #introduction }

Moonbeam上的原生Token ERC-20预编译合约允许开发者通过ERC-20接口与原生协议Token交互。尽管GLMR和MOVR并非ERC-20 Token，您现在可以假设他们为原生ERC-20资产与他们交互！

这种预编译的主要优势之一是消除了将协议Token包装为ERC-20智能合约必要性，例如以太坊上的WETH。此外，还可以防止具有相同协议Token的多个包装。因此，需要通过ERC-20接口与协议Token交互的DApp无需单独的智能合约即可实现。

在后台，[ERC-20预编译](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/src/lib.rs)执行与Substrate Balances Pallet相关的特定Substrate操作，由Rust编码。Balances Pallet提供处理[Moonbeam各种余额类型](/builders/get-started/eth-compare/balances/#moonbeam-account-balances)、设置余额、转移余额等功能。

本教程将向您展示如何通过ERC-20预编译用Moobase Alpha测试网的原生协议Token——DEV Token交互。您也可以跟随并调整以下教程以了解该如何以ERC-20的形式使用GLMR或MOVR。

预编译位于以下地址：

=== "Moonbeam"
     ```
     {{networks.moonbeam.precompiles.erc20 }}
     ```

=== "Moonriver"
     ```
     {{networks.moonriver.precompiles.erc20 }}
     ```

=== "Moonbase Alpha"
     ```
     {{networks.moonriver.precompiles.erc20 }}
     ```

--8<-- 'text/precompiles/security.md'

## ERC-20接口 {: #the-erc20-interface }

Moonbeam上的[ERC20.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol)接口遵循[EIP-20 Token标准](https://eips.ethereum.org/EIPS/eip-20){target=_blank}，即智能合约中Token的标准API接口。此标准定义了Token合约必须实现与不同应用程序互操作所需的功能和事件。

--8<-- 'text/erc20-interface/erc20-interface.md'

!!! 注意事项
    ERC-20预编译不包括`deposit`和`withdraw`功能，以及包装的Token合约预期的后续事件，例如WETH。

## 与Solidity接口交互 {: #interact-with-the-solidity-interface }

### 查看先决条件 {: #checking-prerequisites }

遵循本教程操作，您将需要以下条件：

- [安装MetaMask并连接至Moonbase Alpha测试网](/tokens/connect/metamask/){target=_blank}
- 在Moonbase Alpha上创建或拥有两个账户，以测试ERC-20预编译不同的功能
- 具有拥有一定数量DEV的账户。
--8<-- 'text/faucet/faucet-list-item.md'

### 添加Token至MetaMask {: #add-token-to-metamask }

如果您想要在MetaMask上如同ERC-20一样与Moonbase Alpha Token交互，您可以使用预编译地址创建自定义Token。

首先，打开MetaMask，确保您已[连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}并执行以下操作：

1. 切换至**Assets**标签
2. 点击**Import tokens**

![Import Tokens from Assets Tab in MetaMask](/images/builders/pallets-precompiles/precompiles/erc20/erc20-1.png)

现在，您可以创建一个自定义Token：

1. 为Token合约地址输入预编译地址：`{{networks.moonbase.precompiles.erc20 }}`。输入后，**Token Symbol**和**Token Decimal**将会自动填充。若未自动填充，请在Token符号一栏输入`DEV`，在小数位数一栏输入`18`
2. 点击**Add Custom Token**

![Add Custom Token](/images/builders/pallets-precompiles/precompiles/erc20/erc20-2.png)

MetaMask将会提示您点击**导入Token**来导入DEV Token，您可以在钱包中查询token详情。

![Confirm and Import Tokens](/images/builders/pallets-precompiles/precompiles/erc20/erc20-3.png)

这样就意味着您已成功将DEV Token作为自定义ERC-20 Token添加至Moonbase Alpha测试网。

### 设置Remix {: #remix-set-up }

您可以使用[Remix](https://remix.ethereum.org/){target=_blank}与ERC-20预编译交互。为此，您需要执行以下操作：

1. 获取[`ERC20.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=_blank}副本
2. 将文档内容粘贴至名为`IERC20.sol`的Remix文档

### 编译合约 {: #compile-the-contract }

接下来，您将需要在Remix编译接口：

1. 点击**Compile**标签（从上至下第二个图标）
2. 点击**Compile IER20.sol**来编译接口

![Compiling IERC20.sol](/images/builders/pallets-precompiles/precompiles/erc20/erc20-4.png)

如果接口编译成功后，您将在**Compile**标签旁看到一个绿色的复选标记。

### 访问合约 {: #access-the-contract }

您将访问指定预编译合约地址的接口，而不是部署ERC-20预编译。为此，请执行以下操作：

1. 在Remix的**Compile**标签下点击**Deploy and Run**。请注意预编译合约已部署
2. 在**ENVIRONMENT**下拉菜单中选择**Injected Web3**。选择**Injected Web3**后，MetaMask将跳出提示连接您的账户至Remix
3. 请确保在**ACCOUNT**一栏显示的账户正确
4. 在**CONTRACT**下拉菜单中选择**IERC20 - IERC20.sol**。这是预编译合约，所以无需部署任何代码。但是您需要在**At Address**字段提供预编译地址
5. 提供ERC-20预编译地址：`{{networks.moonbase.precompiles.erc20}}`并点击**At Address**

![Access the address](/images/builders/pallets-precompiles/precompiles/erc20/erc20-5.png)

**IERC20**预编译将会显示在**Deployed Contracts**列表。

### 获取Token基本信息 {: #get-basic-token-information }

ERC-20接口允许您快速获取Token信息，包括Token总供应量、名称、符号和小数位数。您可通过以下步骤获取这些信息：

1. 在**Deployed Contracts**一栏展开**IERC20**合约
2. 点击**decimals**以获取Moonbase Alpha原生协议Token的小数位数
3. 点击**name**以获取Token名称
4. 点击**symbol**以获取Token符号
5. 点击**totalSupply**以获取在Moonbase Alpha存在的Token总供应量

![Total Supply](/images/builders/pallets-precompiles/precompiles/erc20/erc20-6.png)

每一次调用的回复将显示在对应的函数中。

### 获取账户余额 {: #get-account-balance }

您可以通过调用`balanceOf`函数，并输入地址以查看在Moonbase Alpha上任何地址的余额：

1. 展开**balanceOf**函数
2. 在**owner**字段输入您想要查看余额的地址
3. 点击**call**

![Get Balance of an Account](/images/builders/pallets-precompiles/precompiles/erc20/erc20-7.png)

该账户余额将会显示在`balanceOf`函数下。

### 批准支出 {: #approve-a-spend }

您将需要提供支出者地址以及支出者允许支出的Token数量。支出者可以是外部帐户或智能合约。在本示例中，您将批准支出者支出1枚DEV Token。您需执行以下步骤：

1. 展开**approve**函数
2. 输入支出者地址。您应该在之前已创建两个账户，因此您可以使用第二个账户作为支出者
3. 在**value**字段输入支出者可以支出的Token数量。在本示例中，您将允许支持者支出1枚以Wei为单位的DEV Token（`1000000000000000000`）
4. 点击**transact**
5. MetaMask将跳出弹窗，提示您检查交易详情。点击**View full transaction details**以检查发送给支出者的Token数量和支出者地址
6. 如果信息无误，点击**Confirm**发送交易

![Confirm Approve Transaction](/images/builders/pallets-precompiles/precompiles/erc20/erc20-8.png)

交易成功发送后，您将发现您的账户余额未发生变化。因为您只批准支出给定数量的Token，而支出者尚未支出Token。在下一部分，您将使用`allowance`函数来验证支出者是否能够代表您支出1枚DEV Token。

### 获取支出者额度 {: #get-allowance-of-spender }

为检查支出者是否收到了[批准支出](#approve-a-spend)部分的额度，请执行以下步骤：

1. 展开**allowance**函数
2. 在**owner**字段输入您的地址
3. 输入在上一部分中您提供的**spender**地址
4. 点击**call**

![Get Allowance of Spender](/images/builders/pallets-precompiles/precompiles/erc20/erc20-9.png)

调用完成后，支出者的额度将会显示，应为等值1枚DEV Token（`1000000000000000000`）。

### 发送Token {: #send-transfer }

想要从一个账户直接发送Token至另一账户，您可以通过以下步骤调用`transfer`函数：

1. 展开**transfer**函数
2. 输入DEV接收方地址。您应该在之前已创建两个账户，因此您可以使用第二个账户作为接收方
3. 输入要发送的DEV Token数量。在本示例中，您将发送1枚DEV Token（`1000000000000000000`）
4. 点击**transact**
5. MetaMask将跳出弹窗，提示您检查交易详情。如果信息无误，请点击**Confirm**

![Send Standard Transfer](/images/builders/pallets-precompiles/precompiles/erc20/erc20-10.png)

交易完成后，您可以使用`balanceOf`函数或查看MetaMask来[查看您的余额](#get-account-balance)。您将会发现您的余额减少了1枚DEV Token。您也可以使用`balanceOf`函数以查看接收方余额已显示增加1枚DEV Token。

### 发送TransferFrom函数 {: #send-transferfrom }

到目前为止，您应该已批准支出1枚DEV Token，并通过标准`transfer`函数发送了1枚DEV Token。 `transferFrom`函数与标准的`transfer`函数不同的是它允许您定义Token接收方的地址。只要您有Token，您就可以指定一个拥有额度的地址或您的地址。在本示例中，您将使用支出者的帐户发起一笔交易，将允许的Token从所有者转移到支出者。支出者可以将Token发送至任何账户，但在本示例中，以所有者发送至支出者为例。

首先，您需要在MetaMask切换支出者账户。切换成功后，目前在Remix的**Accounts**标签下选中的是支出者的地址：

![Switch accounts Remix](/images/builders/pallets-precompiles/precompiles/erc20/erc20-11.png)

接下来，您可以发起和发送转账。请执行以下步骤：

1. 展开**transferFrom**函数
2. 在**from**字段输入您作为所有者的地址
3. 在**to**字段输入接收方地址，应为支出者地址
4. 输入发送的DEV Token数量。同样地，目前只允许支出者发送1枚DEV Token，请输入`1000000000000000000`
5. 点击**transact**

![Send Standard Transfer](/images/builders/pallets-precompiles/precompiles/erc20/erc20-12.png)

交易完成后，您可以使用`balanceOf`函数来[查看您的余额](#get-account-balance)。支出者余额应该增加了1枚DEV Token，且额度现已用尽。想要验证支出者不再拥有额度，您可以调用`allowance`函数，输入所有人和支出者地址，结果应为0。

![Zero Allowance](/images/builders/pallets-precompiles/precompiles/erc20/erc20-13.png)

这样就意味着您已成功使用MetaMask和Remix与ERC-20预编译交互！