---
title: 账户余额
description: 本文描述了以太坊开发者需要了解的Moonbeam在账户余额方面与以太坊之间的主要差异
---

![Moonbeam v Ethereum - Account Balances Banner](/images/eth-compare/balances-banner.png)

## 概览

虽然Moonbeam致力于兼容以太坊Web3 API和EVM，但开发者仍需了解Moonbeam在账户余额方面与以太坊之间一些重要的差异。

本教程将概述关于账户余额的一些主要差异，以及首次使用Moonbeam时需要了解的事项。

## 以太坊账户余额

以太坊上的账户是一个拥有Token余额（本示例中为Ether/ETH）的实体账户。账户持有者可以在以太坊上发送ETH交易，并且可以由用户（用私钥签署）或智能合约控制。

因此，以太坊有两种主要的账户类型，分别为用户拥有和合约拥有的。不论类型为何种，一个以太坊账户皆具有一个余额字段，代表该地址持有的Wei数量（Wei为ETH的面额单位，每个ETH为1*10^18 Wei）

_An image will be here_

## Moonbeam账户余额

Moonbeam上的账户是一个拥有Token余额（Token种类取决于网络）的实体账户。 就像在以太坊上一样，账户持有者可以在他们连接的Moonbeam网络上发送Token交易。 此外，账户可以由用户（用私钥签署）或智能合约控制。

与以太坊一样，Moonbeam有两种主要的账户类型：用户型账户及合约型账户。 在这两种帐户类型中，另外还有[代理帐户](https://wiki.polkadot.network/docs/learn-proxies)，用来代表另一个帐户执行有限数量的操作。 然而，在余额方面，所有Moonbeam账户都有以下五种不同的[余额类型](https://wiki.polkadot.network/docs/learn-accounts#balance-types)：

 - **Free** —— 指在Substrate API内可使用（未锁定/冻结）的余额。 `free`余额的概念取决于要执行的操作。 例如，民主投票不会从`free`余额中减少分配给投票的余额，但Token持有者将无法转移该余额
 - **Redudicble** —— 指通过Moonbeam上的以太坊API可使用（未锁定/冻结）的余额。 例如，MetaMask显示的余额是真正的可支出余额，是所有可被民主治理锁定的余额（在Polkadot.js中显示为可转移）
 - **Reserved** —— 指由于链上要求而持有的余额，可以通过执行一些链上操作来释放。 例如，在协议级别质押的资金（平行链质押）会显示为`reserved balance`。 这些资金在被释放之前**不能**通过以太坊API访问
 - **Misc frozen** —— 指在提取资金时`free`余额可能不会低于的余额，交易费除外。 例如，用于对治理提案进行投票的资金会显示为`misc frozen`。 这些资金在被释放之前**不能**通过以太坊API访问
 - **Fee frozen** —— 指在专门支付交易费时`free`余额可能不会低于的余额。 这些资金在被释放之前**不能**通过以太坊API访问

_An image will be here_

## 主要区别

以太坊和Moonbeam上账户余额的主要区别在于Moonbeam中锁定和保留余额的概念。账户仍然拥有这些Token，但（尚）不能用来交易。

从以太坊API的角度来说，一个账户可能会显示有一定的余额（称为`reducible`余额）。 然而，通过在链上操作后，该余额值可能会增加（或减少）而实际上并没有余额转移。

