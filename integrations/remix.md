---
title: Remix IDE
description: 通过此教程学习如何使用主流的以太坊开发人员工具之一Remix IDE与Moonbeam进行交互。
---

# 使用Remix与Moonbeam进行交互

![Intro diagram](/images/integrations/integrations-remix-banner.png)

## 概览 {: #introduction } 

开发者还可使用[Remix IDE](https://remix.ethereum.org/)来与Moonbeam进行交互。Remix IDE是以太坊智能合约最常用的开发环境之一，可提供基于网络的解决方案以实现在本地VM或外部Web3提供者（例如MetaMask）上快速编译和部署Solidity和Vyper代码。通过将两种工具结合，开发者可以快速启动在Moonbeam上的部署。
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

编译完成后，我们可以来到“Deploy & Run Transactions”标签下。首先需要将环境设置为"Injected Web3."，需要使用MetaMask导入的提供者，通过提供者把合约部署到与其相连的网络上，在本示例中为Moonbase Alpha测试网。

我们将使用一个存有资产余额的MetaMask账户来部署合约。可以通过我们的[测试网水龙头](/getting-started/moonbase/faucet/)充值，然后在Moonbase Alpha上部署。接下来，在构造函数中输入`Test Contract`，然后点击“部署”。MetaMask弹窗将显示交易相关信息，我们需要点击“确认”进行签名。

![Deploying Contract](/images/remix/integrations-remix-1.png)

交易确认后，合约将出现在Remix的“Deployed Contracts”栏目中。从这里即可与合约功能进行交互。

![Interact with Contract](/images/remix/integrations-remix-2.png)

## 分步教程 {: #step-by-step-tutorials }
如果您想获得更加详细的分步教程，请阅读[在Moonbeam开发节点上使用Remix](/getting-started/local-node/using-remix/)。只需修改这些步骤，并将MetaMask[与Moonbase Alpha测试网相连](/getting-started/moonbase/metamask/)，即可在Moonbase Alpha测试网上部署。

