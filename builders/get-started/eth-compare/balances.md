---
title: 账户余额
description: 本文描述了以太坊开发者需要了解的Moonbeam在账户余额方面与以太坊之间的主要差异。
---

# 账户余额

## 概览 {: #introduction }

虽然Moonbeam致力于兼容以太坊Web3 API和EVM，但开发者仍需了解Moonbeam在账户余额方面与以太坊之间一些重要的差异。

Moonbeam的设计初衷之一是创建一个最大程度接近以太坊的环境，并提供一组兼容以太坊的Web3 RPC端点。作为基于Substrate的智能合约链，Moonbeam将公开Substrate RPC，且具有由Substrate提供支持的完整功能，例如质押、治理以及其他不属于以太坊API的功能。

Moonbeam的[统一账户](/learn/features/unified-accounts/){target=_blank}是Moonbeam实现以太坊兼容性的一种方式，通过将协议的底层账户类型更改为以太坊式类型（即H160或以“0x”开头的20字节的地址）Substrate和以太坊API均使用统一账户，并在区块链上映射相同的底层数据存储。尽管如此，来自以太坊用户在通过以太坊API使用Moonbeam账户时仍需了解一些重要差异。

本教程将概述关于账户余额的一些主要差异，以及首次使用Moonbeam时需要了解的事项。

## 以太坊账户余额 {: #ethereum-account-balances }

以太坊上的账户是一个拥有Token余额（本示例中为Ether/ETH）的实体账户。账户持有者可以在以太坊上发送ETH交易，并且可以由用户（用私钥签署）或智能合约控制。

因此，以太坊有两种主要的账户类型，分别为用户拥有和合约拥有的。不论类型为何种，一个以太坊账户皆具有一个余额字段，代表该地址持有的Wei数量（Wei为ETH的面额单位，每个ETH为1*10^18 Wei）

![Ethereum balances diagram](/images/builders/get-started/eth-compare/balances/balances-1.png)

## Moonbeam账户余额 {: #moonbeam-account-balances }

Moonbeam上的账户是一个拥有Token余额（Token种类取决于网络）的实体账户。 就像在以太坊上一样，账户持有者可以在他们连接的Moonbeam网络上发送Token交易。 此外，账户可以由用户（用私钥签署）或智能合约控制。

与以太坊一样，Moonbeam有两种主要的账户类型：用户型账户及合约型账户。 在这两种帐户类型中，另外还有[代理帐户](https://wiki.polkadot.network/docs/learn-proxies){target=_blank}，用来代表另一个帐户执行有限数量的操作。 然而，在余额方面，所有Moonbeam账户都有以下五种不同的[余额类型](https://wiki.polkadot.network/docs/learn-accounts#balance-types){target=_blank}：

 - **Free** —— 指在Substrate API内可使用（未锁定/冻结）的余额。 `free`余额的概念取决于要执行的操作。 例如，民主投票不会从`free`余额中减少分配给投票的余额，但Token持有者将无法转移该余额
 - **Reducible** —— 指通过Moonbeam上的以太坊API可使用（未锁定/冻结）的余额。 例如，MetaMask显示的余额是真正的可支出余额，是所有可被民主治理锁定的余额（在Polkadot.js中显示为可转移）
 - **Reserved** —— 指由于链上要求而持有的余额，可以通过执行一些链上操作来释放。 例如，用于创建代理账户或设置链上身份的绑定会显示为`reserved balance`。 这些资金在被释放之前**不能**通过以太坊API访问
 - **Misc frozen** —— 指在提取资金时`free`余额可能不会低于的余额，交易费除外。 例如，用于对治理提案进行投票的资金会显示为`misc frozen`。 这些资金在被释放之前**不能**通过以太坊API访问
 - **Fee frozen** —— 指在专门支付交易费时`free`余额可能不会低于的余额。 这些资金在被释放之前**不能**通过以太坊API访问

![Moonbeam balances diagram](/images/builders/get-started/eth-compare/balances/balances-2.png)

您可以使用[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/accounts){target=_blank}查询您的余额，包括您的`free`余额（可转帐）和预留余额（如果存在）。

![View balances on Polkadot.js Apps](/images/builders/get-started/eth-compare/balances/balances-3.png)

您还可以使用Polkadot.js Apps查看您的余额锁定。在开始之前，请确保Polkadot.js Apps连接到正确的网络。然后点击**Developer**标签，然后选择 **Chain State**，并执行以下步骤：

1. 从**selected state query**下拉列表中选择**balances**
2. 选择**locks** extrinsic
3. 输入您的地址
4. 点击 **+** 按钮提交extrinsic

![View locks on Polkadot.js Apps](/images/builders/get-started/eth-compare/balances/balances-4.png)

## 主要区别 {: #main-differences }

以太坊和Moonbeam上账户余额的主要区别在于Moonbeam中锁定和保留余额的概念。账户仍然拥有这些Token，但（尚）不能用来交易。

从以太坊API的角度来说，一个账户可能会显示有一定的余额（称为`reducible`余额）。 然而，通过在链上操作后，该余额值可能会增加（或减少）而实际上并没有余额转移。

需要注意的是，此处描述的差异仅适用于原生代币（GLMR、MOVR）的账户余额以及不与智能合约交互的资产余额。但如果通过智能合约与Moonbeam账户余额交互，其特性与以太坊相同。例如，如果您在Moonriver上将MOVR转换为Wrapped MOVR，则这个余额将无法通过质押或治理操作改变，因为这是只能合约存储的一部分。在这种情况下，该账户的可减少余额已被提交到Wrapped MOVR智能合约，并且不能被 Substrate类操作修改。
