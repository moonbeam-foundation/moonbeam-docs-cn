---
title: 使用插件验证智能合约
description: 学习如何使用Hardhat和Truffle提供的Etherscan插件在Moonbeam网络上验证智能合约。
---

# 使用Etherscan插件验证智能合约

![Etherscan Plugins Banner](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-banner.png)

## 概览 {: #introduction }

验证智能合约是为部署在Moonbeam上的合约提供透明度和安全性的一种好方法。与Etherscan的合约验证服务集成的插件有很多，其中包括[`hardhat-etherscan` plugin](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html){target=_blank}和[`truffle-plugin-verify` plugin](https://github.com/rkalis/truffle-plugin-verify){target=_blank}。这两种插件均能通过本地检测需要验证的合约及其所需的Solidity库（若有）来自动执行验证合约的过程。

Hardhat插件可以无缝集成至您的[Hardhat](https://hardhat.org/){target=_blank}项目，同样地Truffle插件也可以集成至您的[Truffle](https://trufflesuite.com/){target=_blank}项目。

本教程将向您展示如何使用两者插件验证部署至Moonbase Alpha的智能合约。本教程也同样适用于Moonbeam和Moonriver。

## 查看先决条件 {: #checking-prerequisites }

在开始本教程之前，您将需要提前准备：

- [安装MetaMask并将其连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}测试网
- 具有拥有一定数量DEV的账户。 
--8<-- 'text/faucet/faucet-list-item.md'
- 一个您将尝试验证合约的网络的Moonscan API密钥。如果您选择在Moonbeam和Moonbase Alpha上验证合约，您将需要一个[Moonbeam Moonscan](https://moonscan.io/){target=_blank} API密钥；如果您选择在Moonriver上验证合约，您将需要一个[Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank} API密钥

## 生成Moonscan API密钥 {: generating-a-moonscan-api-key }

要生成Moonscan API密钥，您需要先注册一个账号。这取决于您想要在哪个网络上验证合约，请确保您在Moonscan上选择正确的网络创建API密钥。如果您选择在Moonbeam和Moonbase Alpha上验证合约，您可以前往[Moonbeam Moonscan](https://moonscan.io/){target=_blank}；如果您选择在Moonriver上验证合约，您可以前往[Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank}。要注册一个账号，请遵循以下步骤：

1. 点击**Sign In**

2. 选择**Click to sign up**后注册您的新账号

![Sign up for Moonscan](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-1.png)

完成注册并登录新账号后，您将能够创建API密钥。

1. 在左侧菜单中选择**API-KEYs**

2. 点击**+ Add**按钮增加新的密钥

![Add an API key](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-2.png)

系统将提示您为您的API密钥输入**AppName**。随后，点击**Continue**，该密钥将会显示在您的API密钥列表中。

## 使用Hardhat Etherscan插件 {: #using-the-hardhat-etherscan-plugin }

本教程此部分将以[使用Hardhat部署至Moonbeam](builders/build/eth-api/dev-env/hardhat/){target=_blank}所创建的`Box.sol`合约为例。

开始使用Hardhat Etherscan插件之前，您需要先运行以下代码安装插件库：

```
npm install --save-dev @nomiclabs/hardhat-etherscan
```

您可以将您的Moonscan API密钥与您的私钥一起添加到`secrets.json`文件中。在本示例中，您将需要[Moonbeam Moonscan](https://moonscan.io/){target=_blank} API密钥。如果您想要在Moonriver上验证合约，您将需要[Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank} API密钥。

从您的Hardhat项目中，打开`hardhat.config.js`文件，导入`hardhat-etherscan`插件和您的Moonscan API密钥，并添加Etherscan配置：

```js
require("@nomiclabs/hardhat-etherscan");

const { privateKey, moonscanApiKey } = require('./secrets.json');

module.exports = {
  networks: {
    moonbase: { ... }
  },
  etherscan: {
    apiKey: moonscanApiKey
  }
};
```

要验证合约，您需要运行`verify`命令并传入已部署合约的地址及其部署的网络：

```
npx hardhat verify --network moonbase <CONTRACT-ADDRESS>
```

在您的终端，您将看到您的合约源代码已成功提交验证。如果验证成功，您将在终端看到**Successfully verified contract**以及[Moonbase Alpha上的Moonscan](https://moonbase.moonscan.io/){target=_blank}的合约代码链接。

![Successful verification using hardhat-etherscan plugin](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-3.png)

如果您正在验证具有constructor arguments的合约，您将需要运行上述命令并在命令末尾添加用于部署合约的constructor arguments。例如：

```
npx hardhat verify --network moonbase <CONTRACT-ADDRESS> "<constructor argument>"
```

参考[Hardhat Etherscan文档网站](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html){target=_blank}获取其他如下所示用例：

- [complex参数](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html#complex-arguments){target=_blank}
- [无法检测到地址的库](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html#libraries-with-undetectable-addresses){target=_blank}
- 使用[多个API密钥](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html#multiple-api-keys-and-alternative-block-explorers){target=_blank}
- 使用[`verify`命令编程](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html#using-programmatically){target=_blank}
- [检测正确的constructor arguments](https://info.etherscan.com/determine-correct-constructor-argument-during-source-code-verification-on-etherscan/){target=_blank}

## 使用Truffle验证插件 {: #using-the-truffle-verify-plugin }

本教程此部分将以[使用Truffle部署至Moonbeam](/builders/build/eth-api/dev-env/truffle/){target=_blank}所创建的`MyToken.sol`合约为例。

开始使用`truffle-plugin-verify`之前，您需要先打开您的Truffle项目并运行以下代码安装插件：

```
npm install --save-dev truffle-plugin-verify
```

接下来，您需要将插件添加至您的`truffle-config.js`文件，并添加Etherscan配置。在本示例中，您将需要[Moonbeam Moonscan](https://moonscan.io/){target=_blank} API密钥。如果您想要在Moonriver上验证合约，您将需要[Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank} API密钥。Truffle配置内容应如下所示：

```js
module.exports = {
  networks: { ... },
  compilers: { ... },
  plugins: ['moonbeam-truffle-plugin', 'truffle-plugin-verify'],
  api_keys: {
    moonscan: 'INSERT-YOUR-MOONSCAN-API-KEY'
  }
}
```

要验证合约，您需要运行`run verify`命令并传入已部署合约的名称及其部署的网络：

```
truffle run verify MyToken --network moonbase
```

如果验证成功，您将在终端看到**Pass - Verified**以及[Moonbase Alpha上的Moonscan](https://moonbase.moonscan.io/){target=_blank}的合约代码链接。

![Successful verification using truffle-verify-plugin](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-4.png)

更多关于插件的详细信息，请参考[README.md文档](https://github.com/rkalis/truffle-plugin-verify#readme){target=_blank}的`truffle-plugin-verify` GitHub代码库。