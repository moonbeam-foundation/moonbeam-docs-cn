---
title: Truffle
description: 通过本教程学习如何通过Truffle将基于Solidity的智能合约轻松部署到Moonbeam
---

# 使用Truffle部署至Moonbeam

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/RD5MefSPNeo' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## 概览 {: #introduction }

本教程将向您展示通过以太坊上常用的智能合约开发工具[Truffle](https://www.trufflesuite.com/){target=blank}将基于Solidity智能合约部署至Moonbeam节点的操作过程。鉴于Moonbeam兼容以太坊的特性，Truffle可与Moonbeam节点一起直接使用。

为简化使用Truffle的步骤，您可以使用[Moonbeam Truffle box](https://github.com/PureStake/moonbeam-truffle-box){target=blank}。这将提供一个模板设置以加快在Moonbeam上的部署流程。Moonbeam Truffle box自带[Moonbeam Truffle plugin](https://github.com/purestake/moonbeam-truffle-plugin){target=blank}，使您可以快速开始使用[Moonbeam开发节点](/ builders/get-started/moonbeam-dev/){target=blank}。

本教程将向您展示如何在本地运行的开发节点上使用Moonbeam Truffle box和Moonbeam Truffle plugin部署合约并之其交互。这教程也同样适用于Moonbeam、Moonriver和Moonbase Alpha测试网。

## 查看先决条件 {: #checking-prerequisites }

本教程将使用Moonbeam Truffle box和Moonbeam Truffle plugin，所以您无需创建一个新账户，也无需为账户充值。Moonbeam开发节点拥有10个预充值帐户。然而，如果您想要使用Moonbeam、Moonriver或Moonbase Alpha，您将需要一个拥有资金的账户。对于Moonbase Alpha测试网，您可以通过[Mission Control](/builders/get-started/moonbase/#get-tokens/){target=blank}获得用于测试目的的DEV Token。

--8<-- 'text/common/endpoint-examples.md'

使用Moonbeam Truffle plugin之前，您需要准备已经安装的[Docker](https://docs.docker.com/get-docker/){target=blank}。

在以下示例中，您无需全网安装Truffle，因其已作为依赖项包含在Moonbeam Truffle box中。但是，如果您希望使用`truffle`命令直接替代运行中的`npx truffle`或`./node_modules/.bin/truffle`，您可以通过运行以下命令进行全网安装：

```
npm install -g truffle
```

## 使用Moonbeam Truffle Box创建项目 {: #creating-a-project-using-the-moonbeam-truffle-box }

您可以遵循以下步骤以开始使用Moonbeam Truffle box：

1. 如果您已全网安装Truffle，您可以执行：

    ```
    mkdir moonbeam-truffle-box && cd moonbeam-truffle-box
    truffle unbox PureStake/moonbeam-truffle-box
    ```
    
    ![Unbox Moonbeam Truffle box](/images/builders/build/eth-api/dev-env/truffle/truffle-1.png)

    否则，您可以直接复制以下代码库：

    ```
    git clone https://github.com/PureStake/moonbeam-truffle-box
    cd moonbeam-truffle-box
    ```
    
2. 使用本地系统中的文件，您可以通过运行以下命令安装所有依赖项：

    ```
    npm install
    ```

如果您查看`moonbeam-truffle-box`目录内部，您将发现以下需要注意的目录和文件：

- **`contracts`** —— 一个目录，用于存储您创建的任何Solidity合约，包括以下Moonbeam Truffle box中的合约：
    - **`Migrations.sol`** —— 使用Truffle[迁移](https://trufflesuite.com/docs/truffle/getting-started/running-migrations.html){target=blank}功能所需的合约
    - **`MyToken.sol`** —— 示例合约
- **`migrations`** —— 包含帮助您部署合约至网络的JavaScript文件。这带有以下脚本：
    - **`1_initial_migration.js`** —— 部署`Migrations.sol`合约的脚本。由于此合约需要先部署才能使用迁移，因此合约以`1`开头，您可以从那里创建具有递增编号前缀的新的迁移
    - **`2_deploy_contracts.js`** —— 部署示例合约`MyToken.sol`的脚本
- **`truffle-config.js`** —— 项目的[配置文件](https://trufflesuite.com/docs/truffle/reference/configuration){target=blank}，您可以在其中定义项目可以部署的网络以及编译合约时所使用的编译器等

## 使用Moonbeam Truffle Plugin运行节点 {: #using-the-moonbeam-truffle-plugin-to-run-a-node }

现在，您已经创建了一个简单的Truffle项目，接下来您可以启动本地Moonbeam开发节点部署合约。Moonbeam Truffle plugin提供了一种在后台使用[Docker](https://www.docker.com/){target=blank}快速开始开发节点的方法。

要在您的本地环境启动Moonbeam开发节点，您需要：

1. 下载对应的Docker镜像：

    ```
truffle run moonbeam install
    ```
    
    ![Docker image download](/images/builders/build/eth-api/dev-env/truffle/truffle-2.png)

2. 下载后，您可以运行以下命令开始生成本地节点：

    ```
    truffle run moonbeam start
    ```
    
    您将看到节点启动的提示消息，紧随其后的是两个有效终端。

    ![Moonbeam local node started](/images/builders/build/eth-api/dev-env/truffle/truffle-3.png)

当您使用完Moonbeam开发节点后，您可以运行以下命令行停止运行Moonbeam开发节点并将Docker镜像移除：

```
truffle run moonbeam stop && \
truffle run moonbeam remove
```

![Moonbeam local node stoped and image removed](/images/builders/build/eth-api/dev-env/truffle/truffle-4.png)

您可以选择暂停和取消暂停您的Moonbeam开发节点：

```
truffle run moonbeam pause
truffle run moonbeam unpause
```

您可以在下图中看到这些命令的输出：

![Install Moonbeam Truffle box](/images/builders/build/eth-api/dev-env/truffle/truffle-5.png)

!!! 注意事项
    如果您熟悉Docker，您可以跳过插件命令，直接与Docker映像交互。

## Truffle配置文件 {: #the-truffle-configuration-file }

Truffle配置文件已经包含了开始操作和部署合约至本地Moonbeam开发节点所需要的内容。打开`truffle-config.js`文件并查看以下详情：

1. 来自Truffle的`HDWalletProvider`安装包已经被导入并作为分层确定性钱包使用

2. `privateKeyDev`变量对应您的开发节点的私钥，该账户持有一定资金用于开发使用。您的开发节点拥有10个预充值帐户

3. 在`networks`下面，您将看到`dev`网络配置，这将配置使用本地开发节点正在运行的端口以及开发帐户的私钥。对于部署合约至本地开发节点，两者缺一不可

4. 在`compilers`下面，列出的solc编译器版本应设置为支持您希望部署的任何合约的版本。本示例所设置的支持版本为`0.7.0`及以上

5. 在`plugins`下面，您将看到够快速启动本地Moonbeam开发节点的`moonbeam-truffle-plugin`以及为您自动执行合约验证步骤的`truffle-plugin-verify`插件。想要获取如何使用插件的更多信息，请查看[使用Etherscan Plugins验证智能合约](/builders/build/eth-api/verify-contracts/etherscan-plugins/)

```js
// 1. Import HDWalletProvider
const HDWalletProvider = require('@truffle/hdwallet-provider');

// 2. Moonbeam development node private key
const privateKeyDev =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';

module.exports = {
  networks: {
    // 3. Configure networks
    dev: {
      provider: () => {
        ...
        return new HDWalletProvider(privateKeyDev, '{{ networks.development.rpc_url }}')
      },
      network_id: {{ networks.development.chain_id }},  // {{ networks.development.hex_chain_id }} in hex,
    },
  },
   // 4. Configure compiler & version
  compilers: {
    solc: {
      version: '^0.7.0',
    },  
  },
  // 5. Plugin configuration
  plugins: ['moonbeam-truffle-plugin', 'truffle-plugin-verify'],
};
```

!!! 注意事项
    出于本教程目的，一些配置文件已从上述示例中移除。

如果您要使用Moonbeam、Moonriver或Moonbase Alpha，您将需要为对应网络更新配置文件。
--8<-- 'text/common/endpoint-setup.md'
您也需要为网络上拥有资金的账户更新私钥：

=== "Moonbeam"
    ```
    moonbeam: {
      provider: () => {
        ...
        return new HDWalletProvider(
          'PRIVATE-KEY-HERE',  // Insert your private key here
          '{{ networks.moonbeam.rpc_url }}' // Insert your RPC URL here
        )
      },
      network_id: {{ networks.moonbeam.chain_id }} (hex: {{ networks.moonbeam.hex_chain_id }}),
    },
    ```

=== "Moonriver"
    ```
    moonriver: {
      provider: () => {
        ...
        return new HDWalletProvider(
          'PRIVATE-KEY-HERE',  // Insert your private key here
          '{{ networks.moonriver.rpc_url }}' // Insert your RPC URL here
        )
      },
      network_id: {{ networks.moonriver.chain_id }} (hex: {{ networks.moonriver.hex_chain_id }}),
    },
    ```

=== "Moonbase Alpha"
    ```
    moonbase: {
      provider: () => {
        ...
        return new HDWalletProvider(
          'PRIVATE-KEY-HERE',  // Insert your private key here
          '{{ networks.moonbase.rpc_url }}' // Insert your RPC URL here
        )
      },
      network_id: {{ networks.moonbase.chain_id }} (hex: {{ networks.moonbase.hex_chain_id }}),
    },
    ```

## 合约文件 {: #the-contract-file }

在`contracts`目录下，您将看到一个名为`MyToken`的ERC-20 Token合约，这将为合约所有者铸造一定数量的Token：

```solidity
pragma solidity ^0.7.5;

// Import OpenZeppelin Contract
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// This ERC-20 contract mints the specified amount of tokens to the contract creator.
contract MyToken is ERC20 {
  constructor(uint256 initialSupply) ERC20("MyToken", "MYTOK") {
    _mint(msg.sender, initialSupply);
  }
}
```

这是一个基于[OpenZepplin](/builders/build/eth-api/dev-env/openzeppelin/overview/){target=blank} ERC-20合约模板的的简易版ERC-20合约。该合约创建以`MyToken`为符号和标准的 18 位小数的`MyToken`。此外，还将为合约创建者设置初始Token供应量。

## 迁移脚本 {: #the-migration-script }

Truffle使用一种称为迁移（Migrations）的概念。迁移是JavaScript文件，帮助您将合约部署至网络。

如果您在`migrations`目录中查看迁移脚本，您将看到其中有两个文件。如前所述，需要先部署`1_initial_migration.js`脚本并且需要启用Truffle的迁移功能。如果您查看在`migrations/2_deploy_contracts.js`下的迁移脚本，这其中包含以下内容：

```javascript
var MyToken = artifacts.require('MyToken');

module.exports = function (deployer) {
   deployer.deploy(MyToken, '8000000000000000000000000');
};
```

此脚本导入编译合约时创建的`MyToken`合约工件。然后使用它来部署具有任何初始构造函数值的合约。

在本示例中，`8000000000000000000000000`是合约初始Token供应量，即800万小数点后18位。

## 使用Truffle部署合约至Moonbeam {: #deploying-a-contract-to-moonbeam-using-truffle }

在部署之前必须先对合约进行编译。友情提示，您将使用`migrations/1_initial_migration.js`脚本先部署`Migrations.sol`合约。这将为您启用Truffle的迁移功能。您可以执行以下步骤编译和部署您的合约：

1. 编译合约：

    ```
truffle compile
    ```
    
    如果成功，您将看到如下所示的输出：

    ![Truffle compile success message](/images/builders/build/eth-api/dev-env/truffle/truffle-6.png)

2. 部署已编译的合约：

    === "Moonbeam"
        ```
        truffle migrate --network moonbeam
        ```
    
    === "Moonriver"
        ```
        truffle migrate --network moonriver
        ```
    
    === "Moonbase Alpha"
        ```
        truffle migrate --network moonbase
        ```
    
    === "Moonbeam Dev Node"
        ```
        truffle migrate --network dev
        ```
    
    如果成功，您将看到部署成功的信息，包括已部署合约的地址：

    ![Successful contract deployment actions](/images/builders/build/eth-api/dev-env/truffle/truffle-7.png)

--8<-- 'text/disclaimers/third-party-content.md'