---
title: 使用Plugins验证智能合约
description: 学习如何使用Hardhat，Truffle，和Foundry提供的Etherscan插件在Moonbeam网络上验证智能合约
---

# 使用Etherscan插件验证智能合约

## 概览 {: #introduction }

验证智能合约是为部署在Moonbeam上的合约提供透明度和安全性的一种好方法。与Etherscan的合约验证服务集成的插件有很多，其中包括[`hardhat-verify`插件](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify){target=_blank}和[`truffle-plugin-verify`插件](https://github.com/rkalis/truffle-plugin-verify){target=_blank}。这两种插件均能通过本地检测需要验证的合约及其所需的Solidity库（若有）来自动执行验证合约的过程。

Hardhat插件可以无缝集成至您的[Hardhat](https://hardhat.org/){target=_blank}项目，同样地Truffle插件也可以集成至您的[Truffle](https://trufflesuite.com/){target=_blank}项目。[Foundry](https://github.com/foundry-rs/foundry){target=_blank}也具有Etherscan功能，但它们内置于其Forge工具中，而非包含在单独的插件中。

本教程将向您展示如何使用两者插件验证部署至Moonbase Alpha的智能合约。本教程也同样适用于Moonbeam和Moonriver。

## 查看先决条件 {: #checking-prerequisites }

在开始本教程之前，您将需要准备以下内容：

- [安装MetaMask并将其连接至Moonbase Alpha](/tokens/connect/metamask/)测试网
- 一个拥有`DEV` Token的账户
 --8<-- 'text/_common/faucet/faucet-list-item.md'
- 一个您将尝试验证合约网络的Moonscan API密钥。如果您选择在Moonbeam和Moonbase Alpha上验证合约，您将需要一个[Moonbeam Moonscan](https://moonscan.io/){target=_blank} API密钥；如果您选择在Moonriver上验证合约，您将需要一个[Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank} API密钥
- 安装和配置Git

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

本教程此部分将以[使用Hardhat部署至Moonbeam](/builders/build/eth-api/dev-env/hardhat/){target=_blank}所创建的`Box.sol`合约为例。

开始使用Hardhat Etherscan插件之前，您需要先运行以下代码安装插件库：

```bash
npm install --save-dev @nomicfoundation/hardhat-verify
```

!!! 注意事项
    `@nomicfoundation/hardhat-verify`的3.0.1版本中已添加对基于Moonbeam网络的支持。您可以通过查看`devDependencies`部分的`package.json`来确认所使用的版本并更新至3.0.1或以上的版本（若需要）。

您可以将您的Moonscan API密钥与您的私钥一起添加到`hardhat.config.js`文件中。在本示例中，您将需要[Moonbeam Moonscan](https://moonscan.io/){target=_blank} API密钥。如果您想要在Moonriver上验证合约，您将需要[Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank} API密钥。

从您的Hardhat项目中，打开`hardhat.config.js`文件，导入`hardhat-verify`插件和您的Moonscan API密钥，并添加Etherscan配置：

```js
require('@nomicfoundation/hardhat-verify');

module.exports = {
  networks: {
    moonbeam: { ... },
    moonriver: { ... },
    moonbase: { ... }
  },
  etherscan: {
    apiKey: {
      moonbeam: 'INSERT_MOONSCAN_API_KEY', // Moonbeam Moonscan API Key
      moonriver: 'INSERT_MOONSCAN_API_KEY', // Moonriver Moonscan API Key
      moonbaseAlpha: 'INSERT_MOONSCAN_API_KEY', // Moonbeam Moonscan API Key    
    }
  }
};
```

要验证合约，您需要运行`verify`命令并传入已部署合约的地址及其部署的网络：

```bash
npx hardhat verify --network moonbase INSERT_CONTRACT_ADDRESS
```

在您的终端，您将看到您的合约源代码已成功提交验证。如果验证成功，您将在终端看到**Successfully verified contract**以及[Moonbase Alpha上的Moonscan](https://moonbase.moonscan.io/){target=_blank}的合约代码链接。

![Successful verification using hardhat-verify plugin](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-3.png)

如果您正在验证具有constructor函数的合约，您将需要运行上述命令并在命令末尾添加用于部署合约的constructor函数。例如：

```bash
npx hardhat verify --network moonbase INSERT_CONTRACT_ADDRESS INSERT_CONSTRUCTOR_ARGS
```

参考[Hardhat Verify文档网站](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify){target=_blank}获取其他如下所示用例：

- [complex函数](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#complex-arguments){target=_blank}
- [无法检测到地址的库](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#libraries-with-undetectable-addresses){target=_blank}
- 使用[多个API密钥](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#multiple-api-keys-and-alternative-block-explorers){target=_blank}
- 使用[`verify`命令编程](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#using-programmatically){target=_blank}
- [检测正确的constructor函数](https://info.etherscan.com/determine-correct-constructor-argument-during-source-code-verification-on-etherscan/){target=_blank}

## 使用Truffle验证插件 {: #using-the-truffle-verify-plugin }

本教程此部分将以[使用Truffle部署合约至Moonbeam](/builders/build/eth-api/dev-env/truffle/){target=_blank}所创建的`MyToken.sol`合约为例。

开始使用`truffle-plugin-verify`之前，您需要先打开您的Truffle项目并运行以下代码安装插件：

```bash
npm install --save-dev truffle-plugin-verify
```

接下来，您需要将插件添加至您的`truffle-config.js`文件，并添加Etherscan配置。在本示例中，您将需要[Moonbeam Moonscan](https://moonscan.io/){target=_blank} API密钥。如果您想要在Moonriver上验证合约，您将需要[Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank} API密钥。Truffle配置内容应如下所示：

```js
module.exports = {
  networks: { ... },
  compilers: { ... },
  plugins: ['moonbeam-truffle-plugin', 'truffle-plugin-verify'],
  api_keys: {
    moonscan: 'INSERT_YOUR_MOONSCAN_API_KEY'
  }
}
```

要验证合约，您需要运行`run verify`命令并传入已部署合约的名称及其部署的网络：

```bash
truffle run verify MyToken --network moonbase
```

如果验证成功，您将在终端看到**Pass - Verified**以及[Moonbase Alpha上的Moonscan](https://moonbase.moonscan.io/){target=_blank}的合约代码链接。

![Successful verification using truffle-verify-plugin](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-4.png)

更多关于插件的详细信息，请参考[README.md文档](https://github.com/rkalis/truffle-plugin-verify#readme){target=_blank}的`truffle-plugin-verify` GitHub repo。

## 使用Foundry验证 {: #using-foundry-to-verify }

本教程此部分将以[使用Foundry部署合约至Moonbeam](/builders/build/eth-api/dev-env/foundry/){target=_blank}所创建的`MyToken.sol`合约为例。

除了Foundry项目，您将需要[Moonbeam Moonscan](https://moonscan.io/){target=_blank} API密钥。此API密钥可用于Moonbeam和Moonbase Alpha网络。如果您想要在Moonriver上验证合约，您将需要[Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank} API密钥。

如果您已部署示例合约，您可以使用`verify-contract`命令行来验证。在验证合约之前，您将需要ABI编码constructor函数。为此，您可以运行以下命令：

```bash
cast abi-encode "constructor(uint256)" 100
```

结果将显示为`0x0000000000000000000000000000000000000000000000000000000000000064`。随后您可以使用以下命令来验证合约：

=== "Moonbeam"

    ```bash
    forge verify-contract --chain-id {{ networks.moonbeam.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    src/MyToken.sol:MyToken \
    --etherscan-api-key INSERT_YOUR_MOONSCAN_API_KEY
    ```

=== "Moonriver"

    ```bash
    forge verify-contract --chain-id {{ networks.moonriver.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    src/MyToken.sol:MyToken \
    --etherscan-api-key INSERT_YOUR_MOONSCAN_API_KEY
    ```

=== "Moonbase Alpha"

    ```bash
    forge verify-contract --chain-id {{ networks.moonbase.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    src/MyToken.sol:MyToken \
    --etherscan-api-key INSERT_YOUR_MOONSCAN_API_KEY
    ```

![Foundry Verify](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-5.png)

如果您想要部署示例合约的同时进行验证，您可以使用以下命令：

=== "Moonbeam"

    ```bash
    forge create --rpc-url {{ networks.moonbeam.rpc_url }} \
    --constructor-args 100 \
    --etherscan-api-key INSERT_YOUR_MOONSCAN_API_KEY \
    --verify --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken
    ```

=== "Moonriver"

    ```bash
    forge create --rpc-url {{ networks.moonriver.rpc_url }} \
    --constructor-args 100 \
    --etherscan-api-key INSERT_YOUR_MOONSCAN_API_KEY \
    --verify --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken
    ```

=== "Moonbase Alpha"

    ```bash
    forge create --rpc-url {{ networks.moonbase.rpc_url }} \
    --constructor-args 100 \
    --etherscan-api-key INSERT_YOUR_MOONSCAN_API_KEY \
    --verify --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken
    ```

![Foundry Contract Deploy and Verify](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-6.png)

--8<-- 'text/_disclaimers/third-party-content.md'
