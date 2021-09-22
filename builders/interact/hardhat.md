---
title: 使用Hardhat
description: 在Moonbeam上使用Hardhat来编译、部署和调试以太坊智能合约。
---

# 在Moonbeam上使用Hardhat进行开发

![Hardhat Create Project](/images/hardhat/hardhat-banner.png)

## 概览 {: #introduction } 

Hardhat是一种以太坊开发环境，帮助开发者管理并实现智能合约和DApp开发重复任务的自动化。Hardhat可以直接与Moonbeam的以太坊API进行交互，因此可以用于将智能合约部署到Moonbeam。

本教程将介绍如何使用Hardhat在Moonbase Alpha测试网上进行以太坊智能合约编译、部署和调试。

## 查看先决条件 {: #checking-prerequisites } 

--8<-- 'text/common/install-nodejs.md'

在撰写本教程时，所用版本分别为15.7.0 和7.4.3版本。

此外，您还需要进行以下操作：

 - 安装MetaMask并[连接到Moonbase](/getting-started/moonbase/metamask/)
 - 创建账户并充值资金。您可以从[Mission Control](/getting-started/moonbase/faucet/)获取相关操作指引

满足所有以上要求后就可以开始使用Hardhat进行开发了。

## 创建Hardhat项目 {: #starting-a-hardhat-project } 

要创建新项目，需要先为其创建目录：

```
mkdir hardhat && cd hardhat
```

然后运行以下代码启动项目：

```
npm init -y
```

注意这里新创建的`package.json`，它会随着我们安装项目从属项而持续扩大。

接下来要在新创建的项目目录中安装Hardhat：

```
npm install hardhat
```

安装好后运行：

```
npx hardhat
```

这将在我们的项目目录中创建一个Hardhat config文档（`hardhat.config.js`）。

!!! 注意事项
    `npx`用于运行在项目本地安装的可执行指令。虽然Hardhat也可全局安装，但我们建议只在每个项目本地安装，这样可以在项目基本信息中控制其版本。

运行指令后，选择`Create an empty hardhat.config.js`：

![Hardhat Create Project](/images/hardhat/hardhat-images-1.png)

## 合约文档 {: #the-contract-file } 

将合约文档储存在`contracts`目录中。创建：

```
mkdir contracts && cd contracts
```

我们将创建一个名为Box的智能合约进行部署。用户可以在这个智能合约中储存数值，并在后期调用。

文档另存为`contracts/Box.sol`：

```solidity
// contracts/Box.sol
pragma solidity ^0.8.1;

contract Box {
    uint256 private value;

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Stores a new value in the contract
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
}
```

## Hardhat配置文档 {: #hardhat-configuration-file } 

下面对Hardhat配置文档进行调整，然后编写合约并进行Moonbase Alpha部署。

如果还未创建合约，请先创建MetaMask账户，[连接到Moonbase Alpha](/getting-started/moonbase/metamask/)，然后通过[Mission Control](/getting-started/moonbase/faucet/)进行充值。我们将使用创建的账户密钥进行合约部署。

首先请求[ethers插件](https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html)调用[ethers.js][/integrations/ethers/]库，简化区块链交互过程。运行以下代码安装`ethers`插件：

```
npm install @nomiclabs/hardhat-ethers ethers
```

下一步导入从MetaMask获取的密钥，存储在一个`.json`文档中。

!!! 注意事项
    请务必通过指定的秘密管理器或类似服务保存密钥。不要将您的密钥保存在代码库中。

在`module.exports`文档中，我们需要提供Solidity版本（根据合约文档为`0.8.1`版本）以及网络的详细信息：

 - Network name: `moonbase`
 - URL: `{{ networks.moonbase.rpc_url }}`
 - ChainID: `{{ networks.moonbase.chain_id }}`

如果您想部署到Moonbeam本地开发节点，可以使用以下网络详细信息：

 - Network name: `dev`
 - URL: `{{ networks.development.rpc_url }}`
 - ChainID: `{{ networks.development.chain_id }}`

Hardhat配置文档将显示如下：

```js
// ethers plugin required to interact with the contract
require('@nomiclabs/hardhat-ethers');

// private key from the pre-funded Moonbase Alpha testing account
const { privateKey } = require('./secrets.json');

module.exports = {
  // latest Solidity version
  solidity: "0.8.1",

  networks: {
    // Moonbase Alpha network specification
    moonbase: {
      url: `{{ networks.moonbase.rpc_url }}`,
      chainId: {{ networks.moonbase.chain_id }},
      accounts: [privateKey]
    }
  }
};
```

下一步，创建`secrets.json`，前文提到的密钥将储存在这个地方。请将该文档加入到项目的`.gitignore`中，不要披露您的密钥。`secrets.json`文档必须包含`privateKey`输入值，例如：

```js
{
    "privateKey": "YOUR-PRIVATE-KEY-HERE"
}
```

恭喜！接下来可以开始部署合约了！

## 编写Solidity代码 {: #compiling-solidity } 

`Box.sol`合约将使用Solidity 0.8.1版本。请确保Hardhat配置文档已根据Solidity的这一版本进行正确设置。完成后运行以下指令编译合约：

```
npx hardhat compile
```

![Hardhat Contract Compile](/images/hardhat/hardhat-images-2.png)

编译完成后将创建`artifacts`目录：合约的字节码和元数据将以`.json`文档形式保存在这个目录下。我们建议将这一目录加入到您的`.gitignore`。

## 部署合约 {: #deploying-the-contract } 

部署Box智能合约需要编写一个简单的`deployment script`脚本。首先，创建一个新目录（`scripts`），在目录下创建新文档`deploy.js`。

```
mkdir scripts && cd scripts
touch deploy.js
```

然后使用`ethers`来编写部署脚本。由于我们将用Hardhat来运行脚本，因此不需要导入任何库。该脚本是[此教程](/getting-started/local-node/deploy-contract/#deploying-the-contract)中使用的简化版本。

首先，通过`getContractFactory()`方法创建一个合约的本地实例。接着，使用实例中包含的`deploy()`方法发起智能合约。最后，使用`deployed()`等待部署完成。合约部署完毕后，就可以在Box实例中获取合约地址。

```js
// scripts/deploy.js
async function main() {
   // We get the contract to deploy
   const Box = await ethers.getContractFactory('Box');
   console.log('Deploying Box...');

   // Instantiating a new Box smart contract
   const box = await Box.deploy();

   // Waiting for the deployment to resolve
   await box.deployed();
   console.log('Box deployed to:', box.address);
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
```

使用`run`指令将`Box`合约部署到`Moonbase Alpha`：

```
  npx hardhat run --network moonbase scripts/deploy.js
```

!!! 注意事项
    要想部署到Moonbeam开发节点上，请在`run`指令中将`moonbase`换成`dev`。

合约在几秒之后便可部署完成，然后您就可以在终端上看到地址。

![Hardhat Contract Deploy](/images/hardhat/hardhat-images-3.png)

恭喜，您的合约现已上线！请保存地址，下一步我们将用它来与合约实例进行交互。

## 与合约进行交互 {: #interacting-with-the-contract } 

使用Hardhat与Moonbase Alpha上部署的新合约进行交互。首先运行以下代码唤起`hardhat console`：

```
npx hardhat console --network moonbase
```

!!! 注意事项
    如果要部署到Moonbeam开发节点上，请在`console`指令中将`moonbase`换成`dev`。

然后逐行加入以下代码。再创建一个`Box.sol`合约的本地实例。每一行代码执行后将出现`undefined`输出值，可以忽略：

```js
const Box = await ethers.getContractFactory('Box');
```

然后输入部署合约时获得的地址，将这一实例连接到已有实例：

```js
const box = await Box.attach('0x425668350bD782D80D457d5F9bc7782A24B8c2ef');
```

连接到合约后即可进行交互。当console指令还在运行时，调用`store`方法，并储存一个简单值：

```
await box.store(5)
```

交易将由您的Moonbase账户签名，并广播到整个网络。输出值与下面内容相似：

![Transaction output](/images/hardhat/hardhat-images-4.png)

请注意输入的`from`地址、合约地址和`data`。现在可以运行以下代码获取数值：

```
(await box.retrieve()).toNumber()
```

返回结果应当是`5`或您最初所储存的数值。

恭喜， 您已完成Hardhat操作指引! 🤯 🎉

如需了解关于Hardhat、Hardhat插件以及其他功能的更多详情，请访问[hardhat.org](https://hardhat.org/)。