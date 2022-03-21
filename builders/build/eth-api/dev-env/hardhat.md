---
title: Hardhat
description: 使用Hardhat在Moonbeam上编译、部署和调试以太坊智能合约
---

# 使用Hardhat部署至Moonbeam

![Hardhat Create Project](/images/builders/build/eth-api/dev-env/hardhat/hardhat-banner.png)

## 概览 {: #introduction }

[Hardhat](https://hardhat.org/){target=blank}是一个以太坊开发环境，可帮助开发人员管理和自动化构建智能合约和DApp所固有的重复性任务。Hardhat可以直接与Moonbeam的以太坊API交互，因此可以在部署智能合约至Moonbeam时使用。

本教程将涵盖如何使用Hardhat在Moonbase Alpha测试网上编译、部署和调试以太坊智能合约。本教程也同样适用于Moonbeam、Moonriver和Moonbeam开发节点。

## 查看先决条件 {: #checking-prerequisites }

在开始之前，您将需要准备以下内容：

 - 安装MetaMask并[将其连接至Moonbase Alpha](/tokens/connect/metamask/){target=blank}
 - 拥有资金的账户，您可以从[Mission Control](/builders/get-started/moonbase/#get-tokens/){target=blank}获取资金
 - 
--8<-- 'text/common/endpoint-examples.md'

## 创建Hardhat项目 {: #creating-a-hardhat-project }

如果您还未有Hardhat项目，您将需要创建一个。为此，您可以执行以下步骤：

1. 为您的项目创建一个目录
   
    ```
    mkdir hardhat && cd hardhat
    ```
    
2. 初始化将创建`package.json`文件的项目
   
    ```
    npm init -y
    ```
    
3. 安装Hardhat
   
    ```
    npm install hardhat
    ```
    
4. 创建项目
   
    ```
    npx hardhat
    ```
    
    !!! 注意事项
        `npx`用于运行安装在项目中的本地可执行文件。虽然Hardhat可以全网安装，但是我们建议在每个项目中进行本地安装，这样您可以按项目控制项目版本。
    
5. 系统将会显示菜单，允许您创建新的项目或使用范本项目。在本示例中，您可以选择**Create an empty hardhat.config.js**

![Hardhat Create Project](/images/builders/build/eth-api/dev-env/hardhat/hardhat-1.png)

这将在您的项目目录中创建一个Hardhat配置文件（`hardhat.config.js`）。

Hardhat项目创建完毕后，您可以安装[ethers plugin](https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html){target=blank}。这将为使用[ethers.js](/builders/tools/eth-libraries/etherjs/){target=blank}代码库与网络交互提供一种简便方式。您可以运行以下命令进行安装：

```
npm install @nomiclabs/hardhat-ethers ethers
```

## 合约文件 {: #the-contract-file }

现在您已经创建了一个空白的项目，接下来您可以通过运行以下命令创建一个`contracts`目录：

```
mkdir contracts && cd contracts
```

将要作为示例部署的智能合约被称为`Box`，这将存储一个数值，用于稍后检索使用。在`contracts`目录中，您可以创建`Box.sol`文件：

```
touch Box.sol
```

打开文件，并为其添加以下合约内容：

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

## Hardhat配置文件 {: #hardhat-configuration-file }

在部署合约至Moonbase Alpha之前，您将需要修改Hardhat配置文件，并创建一个安全的文件以便您存储私钥。

您可以通过运行以下命令创建一个`secrets.json`文件以存储您的私钥：

```
touch secrets.json
```

接下来将您的私钥添加至文件中：

```json
{
    "privateKey": "YOUR-PRIVATE-KEY-HERE"
}
```

请确保将文件添加至项目的`.gitignore`中，切勿泄漏您的私钥。

!!! 注意事项
    请妥善管理您的私钥，使用指定的secret manager或类似管理器。切勿将您的私钥保存或提交至代码库。

接下来您可以遵循以下步骤修改`hardhat.config.js`文件并将Moonbase Alpha添加为网络：

1. 导入Ethers plugin

2. 导入`secrets.json`文件

3. 在`module.exports`中，您需要提供Solidity版本（根据我们的合约文件，Solidity版本为`0.8.1`）

4. 添加Moonbase Alpha网络配置

```js
// 1. Import the ethers plugin required to interact with the contract
require('@nomiclabs/hardhat-ethers');

// 2. Import your private key from your pre-funded Moonbase Alpha testing account
const { privateKey } = require('./secrets.json');

module.exports = {
  // 3. Specify the Solidity version
  solidity: "0.8.1",

  networks: {
    // 4. Add the Moonbase Alpha network specification
    moonbase: {
      url: '{{ networks.moonbase.rpc_url }}',
      chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex,
      accounts: [privateKey]
    }
  }
};
```

您可以修改`hardhat.config.js`文件以使用任何Moonbeam网络：

=== "Moonbeam"
    ```
    moonbeam: {
        url: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonbeam.chain_id }}, // (hex: {{ networks.moonbeam.hex_chain_id }}),
        accounts: [privateKey]
      },
    ```

=== "Moonriver"
    ```
    moonriver: {
        url: '{{ networks.moonriver.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonriver.chain_id }}, // (hex: {{ networks.moonriver.hex_chain_id }}),
        accounts: [privateKey]
      },
    ```

=== "Moonbase Alpha"
    ```
    moonbase: {
        url: '{{ networks.moonbase.rpc_url }}',
        chainId: {{ networks.moonbase.chain_id }}, // (hex: {{ networks.moonbase.hex_chain_id }}),
        accounts: [privateKey]
      },
    ```

=== "Moonbeam Dev Node"
    ```      
    dev: {
        url: '{{ networks.development.rpc_url }}',
        chainId: {{ networks.development.chain_id }}, // (hex: {{ networks.development.hex_chain_id }}),
        accounts: [privateKey]
      },
    ```

恭喜您！您现在可以开始部署了！

## 编译Solidity {: #compiling-solidity }

您可以简单运行以下命令编译合约：

```
npx hardhat compile
```

![Hardhat Contract Compile](/images/builders/build/eth-api/dev-env/hardhat/hardhat-2.png)

编译后，将会创建一个`artifacts`目录：这保存了合约的字节码和元数据，为`.json`文件。您可以将此目录添加至您的`.gitignore`。

## 部署合约 {: #deploying-the-contract }

要部署`Box.sol`智能合约，您将需要撰写一个简单的部署脚本。您可以为此脚本创建一个新目录并命名为`scripts`，然后为其添加一个名为`deploy.js`的新文件：

```
mkdir scripts && cd scripts
touch deploy.js
```

接下来，您需要通过`ethers`撰写一个部署脚本。因为您将使用Hardhat运行此脚本，所以您无需导入任何代码库。

要开始操作，您可以执行以下步骤：

1. 通过`getContractFactory`方法为合约创建一个本地实例

2. 使用此实例中存在的`deploy`方法来实例化智能合约

3. 使用`deployed`等待部署

4. 部署后，您可以使用合约实例获取合约的地址

```js
// scripts/deploy.js
async function main() {
   // 1. Get the contract to deploy
   const Box = await ethers.getContractFactory('Box');
   console.log('Deploying Box...');

   // 2. Instantiating a new Box smart contract
   const box = await Box.deploy();

   // 3. Waiting for the deployment to resolve
   await box.deployed();

   // 4. Use the contract instance to get the contract address
   console.log('Box deployed to:', box.address);
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
```

您现在可以使用`run`命令并指定`moonbase`作为网络来部署`Box.sol`合约：

```
  npx hardhat run --network moonbase scripts/deploy.js
```

如果您正在使用另一个Moonbeam网络，请确保您已指定正确的网络。网络名称需要与`hardhat.config.js`中所定义的网络相匹配。

稍等片刻，合约将成功部署，您可以在终端看到合约地址。

![Hardhat Contract Deploy](/images/builders/build/eth-api/dev-env/hardhat/hardhat-3.png)

恭喜您，您的合约已完成！请保存地址，用于后续与合约实例的交互。

## 与合约交互 {: #interacting-with-the-contract }

要在Moonbase Alpha上与您刚部署的合约交互，您可以通过运行以下命令启动Hardhat `console`：

```
npx hardhat console --network moonbase
```

接下来，您可以执行以下步骤（一次输入一行）：

1. 创建一个`Box.sol`合约的本地实例
   
    ```js
    const Box = await ethers.getContractFactory('Box');
    ```
    
2. 使用合约地址，将本地实例连接至已部署的合约
   
    ```js
    const box = await Box.attach('0x425668350bD782D80D457d5F9bc7782A24B8c2ef');
    ```
    
3. 与此合约交互。在本示例中，您可以调用`store`方法并存储一个简单的值
   
    ```js
    await box.store(5)
    ```

交易将通过您的Moonbase账户进行签署并传送至网络。后台输出将如下所示：

![Transaction output](/images/builders/build/eth-api/dev-env/hardhat/hardhat-4.png)

请注意您的地址将被标记为`from`，即合约地址，以及正在传送的`data`。现在，您可以通过运行以下命令来检索数值：

```js
(await box.retrieve()).toNumber()
```

您将看到`5`或者您初始存储的数值。

恭喜您，您已经成功使用Hardhat部署合约并与之交互。

--8<-- 'text/disclaimers/third-party-content.md'