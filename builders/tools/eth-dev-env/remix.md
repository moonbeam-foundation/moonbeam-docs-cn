---
title: Remix
description: 通过此教程学习如何使用主流的以太坊开发人员工具之一Remix IDE与Moonbeam进行交互。
---

# Remix

![Intro diagram](/images/builders/build/eth-api/dev-env/remix/remix-banner.png)

## 概览 {: #introduction }

开发者还可使用[Remix IDE](https://remix.ethereum.org/)来与Moonbeam进行交互。Remix IDE是以太坊智能合约最常用的开发环境之一，可提供基于网络的解决方案实现在本地VM或外部Web3提供者（例如MetaMask）上快速编译和部署Solidity和Vyper代码。通过将两种工具结合，开发者可以快速启动在Moonbeam上的部署。

## 在Moonbeam上部署合约 {: #deploying-a-contract-to-moonbeam }

我们将通过以下基础合约展示如何使用[Remix](https://remix.ethereum.org/)在Moonbeam上部署智能合约：

```solidity
pragma solidity ^0.7.5;
contract SimpleContract{
    string public text;
    
    constructor(string memory _input) {
        text = _input;
    }
}
```

合约编译完成后，可以在Remix找到“Deploy & Run Transactions”标签，遵循以下操作步骤开始部署合约：

1. 将Remix环境设置为“Injected Web3”

2. 设置您的账户，确保账户内有资产。对于Moonbase Alpha，您可以通过[测试网水龙头](/builders/get-started/moonbase/#discord-mission-control/)充值

3. 在构造函数中输入`Test Contract`，然后点击“Deploy”

4. MetaMask将跳出显示交易相关信息的弹窗，点击“Confirm”进行签名

![Deploying Contract](/images/builders/build/eth-api/dev-env/remix/remix-1.png)

交易确认后，合约将出现在Remix的“Deployed Contracts”栏目中。在这里即可与合约功能进行交互。

![Interact with Contract](/images/builders/build/eth-api/dev-env/remix/remix-2.png)

## 分步教程 {: #tutorial }

如果您想获得更加详细的分步教程，您可以查看在Moonbeam上使用[Remix](/builders/interact/remix/)进行开发的详细教程。

