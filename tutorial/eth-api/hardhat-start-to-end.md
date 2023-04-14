---
title: Hardhat Developer Workflow - Hardhat开发流程
description: Learn how to develop, test, and deploy smart contracts with Hardhat and how to take your contracts from a local development node to Moonbeam MainNet.
学习如何使用Hardhat开发、测试、部署智能合约以及如何将合约从本地开发节点迁移至Moonbeam主网。
---

# Hardhat Developer Workflow - Hardhat开发流程

![Learn about the typical Hardhat Ethereum Developer workflow from start to finish.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-banner.png)
_January 16, 2023 | by Kevin Neilson & Erin Shaben_

_本文档更新至2023年1月16日｜作者：Kevin Neilson & Erin Shaben_

## Introduction - 概览 {: #introduction } 

In this tutorial, we'll walk through the [Hardhat development environment](https://hardhat.org/){target=_blank} in the context of launching a [pooled staking DAO contract](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}. We'll walk through the typical developer workflow in detail from start to finish. 

在本教程中，我们将演示在[Hardhat开发环境](https://hardhat.org/){target=_blank}中启动[pooled staking DAO合约](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}的完整开发流程。

We'll assemble the components of the staking DAO and compile the necessary contracts. Then, we'll build a test suite with a variety of test cases relevant to our staking DAO, and run it against a local development node. Finally, we'll deploy the staking DAO to both Moonbase Alpha and Moonbeam and verify the contracts via the [Hardhat Etherscan plugin](/builders/build/eth-api/verify-contracts/etherscan-plugins/#using-the-hardhat-etherscan-plugin){target=_blank}. If this is your first time exploring Hardhat, you may wish to start with [the introduction to Hardhat guide](/builders/build/eth-api/dev-env/hardhat/){target=_blank}. 

我们将组合staking DAO的组件并编译必要合约。然后，使用staking DAO相关的各类测试用例构建测试套件并针对本地开发节点进行运行。最后，我们将staking DAO部署至Moonbase Alpha和Moonbeam并通过[Hardhat Etherscan插件](/builders/build/eth-api/verify-contracts/etherscan-plugins/#using-the-hardhat-etherscan-plugin){target=_blank}验证合约。如果您尚未了解Hardhat，建议您先阅读[Hardhat教程](/builders/build/eth-api/dev-env/hardhat/){target=_blank}。

_The information presented herein is for informational purposes only and has been provided by third parties. Moonbeam does not endorse any project listed and described on the Moonbeam docs website (https://docs.moonbeam.network/)._

此处所有信息由第三方提供，仅供参考之用。Moonbeam不保证Moonbeam文档网站（https://docs.moonbeam.network/）上列出和描述项目的准确性、完整性和真实性。

## Checking Prerequisites - 查看先决条件 {: #checking-prerequisites } 

To get started, you will need the following:

开始之前，您需要准备以下内容：

 - A Moonbase Alpha account funded with DEV. 拥有DEV的Moonbase Alpha账户
    --8<-- 'text/faucet/faucet-list-item.md'
 - A [Moonscan API Key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}
 - [Moonscan API密钥](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}
 - For the [Testing section](#running-your-tests) you'll need to have [a local Moonbeam node up and running](/builders/get-started/networks/moonbeam-dev/){target=_blank}
 - 在[测试部分](#running-your-tests)您将需要拥有[一个启动且正在运行的本地Moonbeam节点](/builders/get-started/networks/moonbeam-dev/){target=_blank}
  - 
--8<-- 'text/common/endpoint-examples.md'

## Creating a Hardhat Project - 创建Hardhat项目 {: #creating-a-hardhat-project }

You will need to create a Hardhat project if you don't already have one. You can create one by completing the following steps:

如果您尚未拥有Hardhat项目，您可以通过以下步骤创建一个Hardhat项目：

1. Create a directory for your project

    为您的项目创建一个目录

    ```
    mkdir stakingDAO && cd stakingDAO
    ```

2. Initialize the project which will create a `package.json` file

    初始化将要创建`package.json`文件的项目

    ```
    npm init -y
    ```

3. Install Hardhat

    安装Hardhat

    ```
    npm install hardhat
    ```

4. Create a project

    创建项目

    ```
    npx hardhat
    ```

    !!! note 注意事项
        `npx` is used to run executables installed locally in your project. Although Hardhat can be installed globally, it is recommended to install it locally in each project so that you can control the version on a project by project basis.

    `npx`用于运行项目中本地安装的可执行文件。Hardhat虽然可以全局安装，但是建议每个项目本地安装，这样可以根据项目控制版本。

5. A menu will appear which will allow you to create a new project or use a sample project. For this example, you can choose **Create an empty hardhat.config.js**

    随后会显示菜单，允许您创建新项目或使用示例项目。在本示例中，您可以选择**Create an empty hardhat.config.js**

![Create an empty Hardhat project.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-1.png)

This will create a Hardhat config file (`hardhat.config.js`) in your project directory.

这将在您的项目目录中创建一个Hardhat配置文件（`hardhat.config.js`）。

## Add Smart Contracts - 添加智能合约 {: #add-smart-contracts }

The smart contract featured in this tutorial is more complex than the one in the [Introduction to Hardhat](/builders/build/eth-api/dev-env/hardhat/){target=_blank} but the nature of the contract means it's perfect to demonstrate some of the advanced capabilities of Hardhat. [`DelegationDAO.sol`](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank} is a pooled staking DAO that uses [`StakingInterface.sol`](/builders/pallets-precompiles/precompiles/staking/){target=_blank} to autonomously delegate to a [collator](/learn/platform/glossary/#collators){target=_blank} when it reaches a determined threshold. Pooled staking contracts such as [`DelegationDAO.sol`](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank} allow delegators with less than the protocol minimum bond to join together to delegate their pooled funds and earn a share of staking rewards. 

本教程中使用的智能合约比[Hardhat概览](/builders/build/eth-api/dev-env/hardhat/){target=_blank}中的更为复杂，但是合约的性质更适合演示Hardhet的一些高级功能。[`DelegationDAO.sol`](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}是一个pooled staking DAO，当其达到特定的阈值时使用[`StakingInterface.sol`](/builders/pallets-precompiles/precompiles/staking/){target=_blank}来自动委托给[收集人](/learn/platform/glossary/#collators){target=_blank}。如[`DelegationDAO.sol`](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}这样的staking合约允许低于最低协议保证金的收集人通过将资金放在同一个委托池中赚取部分质押奖励。

!!! note 注意事项
    `DelegationDAO.sol` is unreviewed and unaudited. It is designed only for demonstration purposes and not intended for production use. It may contain bugs or logic errors that could result in loss of funds. 

`DelegationDAO.sol`未经过审核和审计，仅用于演示目的。其中可能会包含漏洞或者逻辑错误而导致资产损失，请勿在生产环境中使用。

To get started, take the following steps:

要开始操作，请执行以下步骤：

1. Create a `contracts` directory to hold your project's smart contracts

    创建`contracts`目录已存放项目的智能合约

    ```
    mkdir contracts
    ```

2. Create a new file called `DelegationDAO.sol`

    创建名为`DelegationDAO.sol`的新文件

    ```
    touch contracts/DelegationDAO.sol
    ```

3. Copy and paste the contents of [DelegationDAO.sol](https://raw.githubusercontent.com/PureStake/moonbeam-intro-course-resources/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank} into `DelegationDAO.sol` 

    将[DelegationDAO.sol](https://raw.githubusercontent.com/PureStake/moonbeam-intro-course-resources/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}中的内容复制并粘贴至`DelegationDAO.sol` 

4. Create a new file called `StakingInterface.sol` in the `contracts` directory

    在`contracts`目录中创建名为`StakingInterface.sol`的新文件

    ```
    touch contracts/StakingInterface.sol
    ```

5. Copy and paste the contents of [StakingInterface.sol](https://raw.githubusercontent.com/PureStake/moonbeam/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank} into `StakingInterface.sol`

    将[StakingInterface.sol](https://raw.githubusercontent.com/PureStake/moonbeam/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank}内容复制并粘贴至`StakingInterface.sol`

6. `DelegationDAO.sol` relies on a couple of standard [OpenZeppelin](https://www.openzeppelin.com/){target=_blank} contracts. Add the library with the following command: 

    `DelegationDAO.sol`依赖于标准[OpenZeppelin](https://www.openzeppelin.com/){target=_blank}合约。使用以下命令添加库：

    ```
    npm install @openzeppelin/contracts
    ```

## Hardhat Configuration File - Hardhat配置文件 {: #hardhat-configuration-file } 

Before you can deploy the contract to Moonbase Alpha, you'll need to modify the Hardhat configuration file and create a secure file to store your private keys and your [Moonscan API key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank} in.

在将合约部署至Moonbase Alpha之前，您需要调整Hardhat配置文件并创建安全的文件用于存储私钥和[Moonscan API密钥](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}。

You can create a `secrets.json` file to store your private keys by running:

您可以运行以下命令来创建一个`secrets.json`文件以存储私钥：

```
touch secrets.json
```

Then add your private keys for your two accounts on Moonbase Alpha. Since some of the testing will be done on a development node, you'll also need to add the private keys of two of the prefunded development node accounts, which for this example, we can use Alice and Bob. In addition, you'll add your Moonscan API key, which can be used for both Moonbase Alpha and Moonbeam.

然后，为您在Moonbase Alpha上的两个账户添加私钥。由于一些测试会在开发节点上完成，您也需要为两个预注资的开发节点账户添加私钥。在本示例中，我们将使用Alice和Bob两个账户。另外，您需要添加Moonscan API密钥，可用于Moonbase Alpha和Moonbeam。

!!! note 注意事项
    Any real funds sent to the Alice and Bob development accounts will be lost immediately. Take precautions to never send MainNet funds to exposed development accounts.

任何发送至Alice和Bob开发账户的真实资产将会马上丢失。请勿将主网资产发送至公开的开发账户。

```json
{
    "privateKey": "YOUR-PRIVATE-KEY-HERE",
    "privateKey2": "YOUR-SECOND-PRIVATE-KEY-HERE",
    "alicePrivateKey": "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133",
    "bobPrivateKey": "0x8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b",
    "moonbeamMoonscanAPIKey": "YOUR-MOONSCAN-API-KEY-HERE"
}
```

If you have separate accounts for Moonbeam MainNet, you can add them as separate variables or update the `privateKey` and `privateKey2` variables once you're ready to deploy to MainNet.

如果您有单独的Moonbeam主网账户，您可以为单独的账户添加不同的变量或在准备部署至主网时更新`privateKey`和`privateKey2`变量。

Your `secrets.json` should resemble the following:

您的`secrets.json`应如下所示：

![Add Moonscan API Key to secrets.json.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-2.png)

Make sure to add the file to your project's `.gitignore`, and to never reveal your private key.

确保添加文件至您项目的`.gitignore`中，并保管好您的私钥，请勿将其泄露给他人。

!!! remember 注意
    Please always manage your private keys with a designated secret manager or similar service. Never save or commit your private keys inside your repositories.

请使用指定私钥管理器或类似设备来管理您的私钥。请勿在代码存储库中存储或提交您的私钥。

When setting up the `hardhat.config.js` file, we'll need to import a few plugins that we'll use throughout this guide. So to get started, we'll need the [Hardhat Toolbox plugin](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox){target=_blank}, which conveniently bundles together the packages that we'll need later on for testing. We'll also need the [Hardhat Etherscan plugin](/builders/build/eth-api/verify-contracts/etherscan-plugins/#using-the-hardhat-etherscan-plugin){target=_blank}, which we'll use to verify our contracts. Both of these plugins can be installed with the following command:

设置`hardhat.config.js`文件时，我们需要导入一些教程所需的插件。开始之前，需要准备好[Hardhat Toolbox插件](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox){target=_blank}，这可以轻松地将一些后续用于测试的包打包在一起。我们也会用到[Hardhat Etherscan插件](/builders/build/eth-api/verify-contracts/etherscan-plugins/#using-the-hardhat-etherscan-plugin){target=_blank}，这将用于验证合约。这些插件均可以通过以下命令安装：

```
npm install --save-dev @nomicfoundation/hardhat-toolbox @nomiclabs/hardhat-etherscan
```

If you're curious about additional Hardhat plugins, here is [a complete list of official Hardhat plugins](https://hardhat.org/hardhat-runner/plugins){target=_blank}.

如果您需要其他的Hardhat插件，请访问[官方Hardhat插件完成列表](https://hardhat.org/hardhat-runner/plugins){target=_blank}。

--8<-- 'text/hardhat/hardhat-configuration-file.md'

5. Import your [Moonscan API key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}, which is required for the verification steps we'll be taking later in this tutorial

   导入[Moonscan API密钥](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}，用于本教程后续验证部分

```js
// 1. Import the Ethers, Hardhat Toolbox, and Etherscan plugins 
// required to interact with our contracts
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('@nomiclabs/hardhat-ethers');

// 2. Import your private key from your pre-funded Moonbase Alpha testing 
// account and your Moonscan API key
const { privateKey, privateKey2, moonbeamMoonscanAPIKey, alicePrivateKey, bobPrivateKey } = require('./secrets.json');

module.exports = {
  // 3. Specify the Solidity version
  solidity: "0.8.17",

  networks: {
    // 4. Add the Moonbase Alpha network specification
    moonbase: {
      url: '{{ networks.moonbase.rpc_url }}',
      chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex
      accounts: [privateKey, privateKey2]
    },
    dev: {
      url: 'http://127.0.0.1:9933',
      chainId: 1281, // {{ networks.development.hex_chain_id }} in hex
      accounts: [alicePrivateKey, bobPrivateKey]
    },
    moonbeam: {
      url: '{{ networks.moonbeam.public_rpc_url }}', // Or insert your own RPC URL here
      chainId: 1284, // {{ networks.moonbeam.hex_chain_id }} in hex
      accounts: [privateKey, privateKey2]
    },
  },
  // 5. Set up your Moonscan API key for contract verification
  // Moonbeam and Moonbase Alpha Moonscan use the same API key
  etherscan: {
    apiKey: {
      moonbaseAlpha: moonbeamMoonscanAPIKey, // Moonbase Moonscan API Key
      moonbeam: moonbeamMoonscanAPIKey, // Moonbeam Moonscan API Key    
    }
  }
};
```

You can modify the `hardhat.config.js` file to use any of the Moonbeam networks:

您可以调整`hardhat.config.js`文件，使其可用于任何Moonbeam网络：

=== "Moonbeam"
    ```
    moonbeam: {
        url: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonbeam.chain_id }}, // (hex: {{ networks.moonbeam.hex_chain_id }})
        accounts: [privateKey]
      },
    ```

=== "Moonriver"
    ```
    moonriver: {
        url: '{{ networks.moonriver.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonriver.chain_id }}, // (hex: {{ networks.moonriver.hex_chain_id }})
        accounts: [privateKey]
      },
    ```

=== "Moonbase Alpha"
    ```
    moonbase: {
        url: '{{ networks.moonbase.rpc_url }}',
        chainId: {{ networks.moonbase.chain_id }}, // (hex: {{ networks.moonbase.hex_chain_id }})
        accounts: [privateKey]
      },
    ```

=== "Moonbeam Dev Node"
    ```      
    dev: {
        url: '{{ networks.development.rpc_url }}',
        chainId: {{ networks.development.chain_id }}, // (hex: {{ networks.development.hex_chain_id }})
        accounts: [privateKey]
      },
    ```

You're now ready to move on to compilation and testing.

现在您可以开始编译并测试合约。

## Compiling the Contract - 编译合约 {: #compiling-the-contract } 

To compile the contract you can simply run:

您可以简单运行以下命令编译合约

```
npx hardhat compile
```

![Learn how to compile your Solidity contracts with Hardhat.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-3.png)

After compilation, an `artifacts` directory is created: it holds the bytecode and metadata of the contract, which are `.json` files. It’s a good idea to add this directory to your `.gitignore`.

编译合约后，会创建一个`artifacts`目录，该目录包含合约的字节码和原数据，即`.json`文件。建议您将此目录添加至`.gitignore`。

## Testing - 测试 {: #testing }

A robust smart contract development workflow is incomplete without a testing suite. Hardhat has a number of tools that make it easy to write and run tests. In this section, you'll learn the basics of testing your smart contracts and some more advanced techniques. 

测试套件是一个完整合约开发流程不可或缺的。Hardhat有一系列的工具，可以轻松助您实现编写和运行测试。在这一部分，您将学习测试智能合约的基本知识和一些高级技术。

Hardhat tests are typically written with Mocha and Chai. [Mocha](https://mochajs.org/){target=_blank} is a JavaScript testing framework and [Chai](https://www.chaijs.com/){target=_blank} is a BDD/TDD JavaScript assertion library. BDD/TDD stands for behavior and test driven development respectively. Effective BDD/TDD necessitates writing your tests *before* writing your smart contract code. The structure of this tutorial doesn't strictly follow these guidelines, but you may wish to adopt these principles in your development workflow. Hardhat recommends using [Hardhat Toolbox](https://hardhat.org/hardhat-runner/docs/guides/migrating-from-hardhat-waffle){target=_blank}, a plugin that bundles everything you need to get started with Hardhat, including Mocha and Chai. 

Hardhat测试通常使用用Mocha和Chai编写，[Mocha](https://mochajs.org/){target=_blank}是一个JavaScript测试框架，[Chai](https://www.chaijs.com/){target=_blank}是一个BDD/TDD JavaScript断言库。BDD/TDD分别代表行为和测试驱动开发。有效的BDD/TDD需要在编写智能合约代码*之前*编写测试。本教程的结构没有严格遵循这些准则，但您可能需要在您的开发流程中采用这些原则。Hardhat建议使用[Hardhat工具箱](https://hardhat.org/hardhat-runner/docs/guides/migrating-from-hardhat-waffle){target=_blank}，这是一个插件，会将所有使用Hardhat所需的插件打包在一起，包括Mocha和Chai。

Because we will initially be running our tests on a local Moonbeam node, we need to specify Alice's address as the address of our target collator (Alice's account is the only collator for a local development node): 

因为我们最初在本地Moonbeam节点上运行测试，所以需要指定Alice的地址作为目标收集人的地址（Alice的账户是本地开发节点的唯一收集人）。

```
0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
```

If instead you prefer to run your tests against Moonbase Alpha, you can choose the below collator, or [any other collator on Moonbase Alpha](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank} you would like the DAO to delegate to:

相反，如果您想要通过Moonbase Alpha运行测试，则可以选择以下收集人，或者任何您想要委托的[Moonbase Alpha上的其他收集人](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank}：

```
{{ networks.moonbase.staking.candidates.address1 }}
```

### Configuring the Test File - 配置测试文件 {: #configuring-the-test-file }

To set up your test file, take the following steps:

要设置测试文件，请执行以下步骤：

1. Create a `tests` directory 

    创建`tests`目录

    ```
    mkdir tests
    ```

2. Create a new file called `Dao.js`

    创建一个名为`Dao.js`的新文件

    ```
    touch tests/Dao.js
    ```

3. Then copy and paste the contents below to set up the initial structure of your test file. Be sure to read the comments as they can clarify the purpose of each line 

    然后复制并粘贴以下内容以设置测试文件的初始结构。请仔细阅读注释，因为它们可以阐明每一行的目的

    ``` javascript
    // Import Hardhat and Hardhat Toolbox
    const { ethers } = require("hardhat");
    require("@nomicfoundation/hardhat-toolbox");
    
    // Import Chai to use its assertion functions here
    const { expect } = require("chai");
    
    // Indicate Alice's address as the target collator on local development node
    const targetCollator = "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac";
    ```

### Deploying a Staking DAO for Testing - 部署Staking DAO用于测试 {: #deploying-a-staking-dao-for-testing }

Before we can run any test cases we'll need to launch a staking DAO with an initial configuration. Our setup here is relatively simple - we'll be deploying a staking DAO with a single administrator (the deployer) and then adding a new member to the DAO. This simple setup is perfect for demonstration purposes, but it's easy to imagine more complex configurations you'd like to test, such as a scenario with 100 DAO members or one with multiple admins of the DAO. 

在运行任何用例之前，我们需要启动一个带有初始配置的staking DAO，我们此处的设置相对舰队，我们将用单个管理员（部署者）部署staking DAO，然后添加新成员至DAO。此简单设置非常适合用于演示，您也可以轻松想象您想要测试的更复杂的配置，例如有100个DAO成员的场景或者有多个DAO管理员的场景。

Mocha's `describe` function enables you to organize your tests. Multiple `describe` functions can be nested together. It's entirely optional but can be useful especially in complex projects with a large number of test cases. You can read more about constructing tests and [getting started with Mocha](https://mochajs.org/#getting-started){target=_blank} on the Mocha docs site.

Mocha的`describe`函数使您能够组织测试 多个`describe`函数可以嵌套在一起。该函数是可选函数，但在有大量测试用例的复杂项目中极其有用。您可以在Mocha文档网站获取关于构建测试和[Mocha入门操作](https://mochajs.org/#getting-started){target=_blank}的更多信息。

We'll define a function called `deployDao` that will contain the setup steps for our staking DAO. To configure your test file, add the following snippet:

我们将定义一个名为`deployDao`的函数，这将包含我们staking DAO的设置步骤。要配置测试文件，请添加以下代码段：

```javascript
// The describe function receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function
describe("Dao contract", function () {
  async function deployDao() {
    // Get the contract factory and signers here
    const [deployer, member1] = await ethers.getSigners();
    const delegationDao = await ethers.getContractFactory("DelegationDAO");
    
    // Deploy the staking DAO and wait for the deployment transaction to be confirmed
    const deployedDao = await delegationDao.deploy(targetCollator, deployer.address);
    await deployedDao.deployed();

    // Add a new member to the DAO
    await deployedDao.grant_member(member1.address);

    // Return the deployed DAO to allow the tests to access and interact with it
    return { deployedDao };
  }

  // The test cases should be added here

});
```

### Writing your First Test Cases - 编写第一个测试用例 {: #writing-your-first-test-cases }

First, you'll create a subsection called `Deployment` to keep the test file organized. This will be nested within the `Dao contract` describe function. Next you'll define your first test case by using the `it` Mocha function. This first test is simply checking to see that the staking DAO is correctly storing the address of the target collator.

首先，您要创建一个名为`Deployment`的子部分以管理测试文件。这将包含在`Dao contract`描述函数中。接下来，您将使用`it` Mocha函数定义您的第一个测试用例。第一个测试只是简单地检查staking DAO是否正确存储了目标收集人的地址。

Go ahead and add the below snippet to the end of your `Dao contract` function. 

然后，将以下代码段添加至`Dao contract`函数最后。

```javascript
// You can nest calls to create subsections
describe("Deployment", function () {
  // Mocha's it function is used to define each of your tests.
  // It receives the test name, and a callback function.
  // If the callback function is async, Mocha will await it
  it("should store the correct target collator in the DAO", async function () {
    
    // Set up our test environment by calling deployDao
    const { deployedDao } = await deployDao();

    // The expect function receives a value and wraps it in an assertion object.
    // This test will pass if the DAO stored the correct target collator
    expect(await deployedDao.target()).to.equal(targetCollator);
  });

  // The following test cases should be added here
});
```

Now, add another test case. When a staking DAO is launched, it shouldn't have any funds. This test verifies that is indeed the case. Go ahead and add the following test case to your `Dao.js` file:

现在，添加另一个测试用例。当staking DAO启动时，不会有任何资金。该测试验证在本示例中如此。 随后，将以下测试用例添加到`Dao.js`文件中：

```javascript
it("should initially have 0 funds in the DAO", async function () {
  const { deployedDao } = await deployDao();

  // This test will pass if the DAO has no funds as expected before any contributions
  expect(await deployedDao.totalStake()).to.equal(0);
});
```

### Function Reverts - 函数恢复 {: #function-reverts }

Now, you'll implement a more complex test case with a slightly different architecture. In prior examples, you've verified that a function returns an expected value. In this one, you'll be verifying that a function reverts. You'll also change the address of the caller to test an admin-only function. 

现在，您将使用稍微不同的架构来实现更复杂的测试用例。在上述示例中，您已验证函数返回预期值。 在这一部分中，您将验证函数是否恢复。您还将更改调用方的地址以测试仅限管理员的功能。

In the [staking DAO contract](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}, only admins are authorized to add new members to the DAO. One could write a test that checks to see if the admin is authorized to add new members but perhaps a more important test is to ensure that *non-admins* can't add new members. To run this test case under a different account, you're going to ask for another address when you call `ethers.getSigners()` and specify the caller in the assertion with `connect(member1)`. Finally, after the function call you'll append `.to.be.reverted` to indicate that the test case is successful if the function reverts. And if it doesn't revert it's a failed test! 

在[staking DAO合约](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}中，只有管理员有权限添加新成员至DAO。我们可以编写一个测试查看管理员是否有权限添加新成员，但是可能更重要的测试是确保*非管理员*不能添加新成员。要在不同的账户下运行此测试用例，您需要在调用`ethers.getSigners()`时请求另一个地址，并在断言中使用`connect(member1)`指定调用方。最后，在函数调用后，您将附加`.to.be.reverted`以指示如果函数恢复则测试用例成功。反之则代表测试失败。

```javascript
it("should not allow non-admins to grant membership", async function () {
  const { deployedDao } = await deployDao();

  // We ask ethers for two accounts back this time
  const [deployer, member1] = await ethers.getSigners();

  // We use connect to call grant_member from member1's account instead of admin.
  // This test will succeed if the function call reverts and fails if the call succeeds
  await expect(deployedDao.connect(member1).grant_member("0x0000000000000000000000000000000000000000")).to.be.reverted;
});
```

### Signing Transactions from Other Accounts - 从其他账户签署交易 {: #signing-transactions-from-other-accounts }

For this example, you'll check to verify whether the newly added DAO member can call the `check_free_balance()` function of staking DAO, which has an access modifier such that only members can access it. 

在本示例中，您将验证新添加的DAO成员是否可以调用staking DAO的`check_free_balance()`函数，该函数有访问修改者的权限，而且仅限成员访问。

```javascript
it("should only allow members to access member-only functions", async function () {
  const { deployedDao } = await deployDao();

  // We ask ethers for two accounts back this time
  const [deployer, member1] = await ethers.getSigners();

  // This test will succeed if the DAO member can call the member-only function.
  // We use connect here to call the function from the account of the new member
  expect(await deployedDao.connect(member1).check_free_balance()).to.equal(0);
});
```

And that's it! You're now ready to run your tests!

这样就可以了！您现在可以运行测试了！

### Running your Tests - 运行测试 {: #running-your-tests }

If you've followed all of the prior sections, your [`Dao.js`](https://raw.githubusercontent.com/PureStake/moonbeam-intro-course-resources/main/delegation-dao-lesson-one/Dao.js){target=_blank} test file should be all set to go. Otherwise, you can copy the [complete snippet from GitHub](https://github.com/PureStake/moonbeam-docs/blob/master/.snippets/code/hardhat/dao-js-test-file.js){target=_blank} into your `Dao.js` test file.

如果您已遵循上述部分，则您的[`Dao.js`](https://raw.githubusercontent.com/PureStake/moonbeam-intro-course-resources/main/delegation-dao-lesson-one/Dao.js){target=_blank}测试文件应该已经完成所有设置。否则，您需要[从GitHub将完成的代码段](https://github.com/PureStake/moonbeam-docs/blob/master/.snippets/code/hardhat/dao-js-test-file.js){target=_blank}复制到`Dao.js`测试文件中。

Since our test cases encompass mostly configuration and setup of the staking DAO and don't involve actual delegation actions, we'll be running our tests on a Moonbeam development node (local node). Remember that Alice (`0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`) is the only collator on a local development node. You can use the flag `--network moonbase` to run the tests using Moonbase Alpha. In that case, be sure that your deployer address is sufficiently funded with DEV tokens. 

由于我们的测试用例主要包含staking DAO的配置和设置，不涉及实际委托操作，因此我们将在Moonbeam开发节点（本地节点）上运行我们的测试。请注意，Alice（`0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`）是本地开发节点上唯一的收集人。 您可以使用标志`--network moonbase`来使用Moonbase Alpha运行测试。在这种情况下，请确保您的部署者地址有足够的DEV token。

!!! challenge 挑战
    Try to create an additional test case that verifies the staking DAO successfully delegates to a collator once `minDelegationStk` is met. You'll need to test this on Moonbase Alpha rather than a local development node.

尝试创建一个额外的测试用例，以验证满足`minDelegationStk`时staking DAO就成功委托给收集人。您需要在Moonbase Alpha而不是本地开发节点上进行测试。

First, make sure that your local Moonbeam node is running by following the [instructions for launching a local development node](/builders/get-started/networks/moonbeam-dev/){target=_blank}. Take precautions if you import the Alice and Bob private keys into your `secrets.json` file because you could inadvertently send real funds to those accounts, which would result in a loss of those funds.  

首先，遵循[启动本地开发节点的指南](/builders/get-started/networks/moonbeam-dev/){target=_blank}确保您的本地Moonbeam节点正在运行。如果您将Alice和Bob私钥导入到`secrets.json`文件中，请注意，如果您将真实资金发送到这些账户会导致资金损失。

You can run your tests with the following command: 

您可以使用以下命令运行测试：

```
npx hardhat test --network dev tests/Dao.js
```

If everything was set up correctly, you should see output like the following: 

如果设置无误，您将看到以下输出：

![Run your test suite of test cases with Hardhat.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-4.png)

## Deploying to Moonbase Alpha - 部署至Moonbase Alpha {: #deploying-to-moonbase-alpha } 

In the following steps, we'll be deploying the `DelegationDAO` to the Moonbase Alpha TestNet. Before deploying to Moonbase Alpha or Moonbeam, double check you're not using the Alice and Bob accounts, which should only be used on a local development node.

在以下步骤中，我们将部署`DelegationDAO`至Moonbase Alpha测试网。在部署至Moonbase Alpha或Moonbeam之前，请确认您所使用的账户不是Alice和Bob账户，这两个账户仅用于本地开发节点。

As a side note, `DelegationDAO` relies on [`StakingInterface.sol`](/builders/pallets-precompiles/precompiles/staking/){target=_blank}, which is a Substrate-based offering unique to Moonbeam networks. The Hardhat Network and forked networks are simulated EVM environments which do not include the Substrate-based precompiles like `StakingInterface.sol`. Therefore, `DelegationDAO` will not work properly if deployed to the local default Hardhat Network or a [forked network](/builders/build/eth-api/dev-env/hardhat/#forking-moonbeam){target=_blank}. 

另外，请注意`DelegationDAO`依赖于 [`StakingInterface.sol`](/builders/pallets-precompiles/precompiles/staking/){target=_blank}，这是Moonbeam 网络特定的基于Substrate的产品。Hardhat网络和分叉网络是模拟的EVM环境，不包括基于Substrate的预编译，如`StakingInterface.sol`。因此，如果将`DelegationDAO`部署到本地默认的Hardhat网络或 [分叉网络](/builders/build/eth-api/dev-env/hardhat/#forking-moonbeam){target=_blank}，则将无法正常工作。

To deploy `DelegationDAO.sol`, you can write a simple script. You can create a new directory for the script and name it `scripts`:

要部署`DelegationDAO.sol`，您可以编写一个简单的脚本。您可以为脚本创建一个新的目录，并命名为`scripts`：

```
mkdir scripts
```

Then add a new file to it called `deploy.js`:

然后，添加名为`deploy.js`的新文件：

```
touch scripts/deploy.js
```

Next, you need to write your deployment script which can be done using `ethers`. Because you'll be running it with Hardhat, you don't need to import any libraries.

接下来，您需要编写部署脚本，可通过使用`ethers`完成此步骤。由于您将使用Hardhat运行，因此无需导入任何库：

To get started, take the following steps:

接着，执行以下步骤：

1. Specify the address of the active collator the DAO intends to delegate to. In this case, we've specified the address of the PS-1 Collator (note: this is different from the address of the Alice collator on a local development node)

   指定DAO要委托的活跃收集人地址。在本示例中，我们将使用PS-1收集人的地址（注意：这与本地开发节点上的Alice收集人的地址不同）

2. Specify the deployer address as the admin of the DAO. It's important that the deployer be the admin of the DAO to ensure later tests work as expected

   将部署者地址指定为DAO管理员。重要的是部署者为DAO管理员，以确保后续测试按预期工作

3. Create a local instance of the contract with the `getContractFactory` method

   使用`getContractFactory`函数创建一个合约的本地实例

4. Use the `deploy` method that exists within this instance to instantiate the smart contract

   使用已存在于本实例中的`deploy`函数来实例化智能合约

5. Once deployed, you can fetch the address of the contract using the contract instance

   部署后，您可以使用合约实例获取合约地址

When all is said and done your deployment script should look similar to the following: 

一切无误，您的部署脚本应如下所示：

```javascript
// 1. The PS-1 collator on Moonbase Alpha is chosen as the DAO's target
const targetCollator = "{{ networks.moonbase.staking.candidates.address1 }}"

async function main() {
  // 2. Get the address of the deployer to later be set as the admin of the DAO
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // 3. Get an instance of DelegationDAO
  const delegationDao = await ethers.getContractFactory("DelegationDAO");
  
  // 4. Deploy the contract specifying two params: the desired collator to
  // delegate to and the address of the deployer (the initial DAO admin)
  const deployedDao = await delegationDao.deploy(targetCollator, deployer.address);
  
  // 5. Print out the address of the deployed staking DAO contract
  console.log("DAO address:", deployedDao.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Make sure you've funded your accounts with Moonbase Alpha DEV tokens. You can now deploy `DelegationDAO.sol` using the `run` command and specifying `moonbase` as the network (as configured in the `hardhat.config.js` file):

确保您已在账户中存入Moonbase Alpha DEV Token。现在您可以使用`run`命令部署`DelegationDAO.sol`，并指定`moonbase`作为网络（在`hardhat.config.js`文件中配置）：

```
npx hardhat run --network moonbase scripts/deploy.js
```

After a few seconds, the contract is deployed, and you should see the address in the terminal.

几分钟后，合约会成功部署，您将在终端看到地址。

![Deploy a Contract to Moonbase Alpha with Hardhat.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-5.png)

Congratulations, your contract is live on Moonbase Alpha! Save the address, as you will use it to interact with this contract instance in the next step.

恭喜您，您的合约已上线Moonbase Alpha！请保存地址，这将在后续步骤中用于合约实例交互。

## Verifying Contracts on Moonbase Alpha - 在Moonbase Alpha上验证合约 {: #verifying-contracts-on-moonbase-alpha }

Contract verification is an essential step of any developer's workflow, particularly in the theoretical example of this staking DAO. Potential participants in the DAO need to be assured that the smart contract works as intended - and verifying the contract allows anyone to observe and analyze the deployed smart contract. 

合约验证是任何开发流程中必不可少的一步，尤其是对于staking DAO的理论示例来说。DAO中的潜在参与者需要确保智能合约按预期工作，并且验证合约以允许任何人可以查看和分析已部署的智能合约。

While it's possible to verify smart contracts on the [Moonscan website](https://moonscan.io/verifyContract){target=_blank}, the Hardhat Etherscan plugin enables us to verify our staking DAO in a faster and easier manner. It's not an exaggeration to say that the plugin dramatically simplifies the contract verification process, especially for projects that include multiple Solidity files or libraries. 

虽然可以在[Moonscan网站](https://moonscan.io/verifyContract){target=_blank}上验证智能合约，但是Hardhat Etherscan插件提供更快速且简单的方式以验证staking DAO。该插件极大程度上简化了合约验证的流程，尤其是包含多个Solidity文件或库的项目。

Before beginning the contract verification process, you'll need to [acquire a Moonscan API Key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}. Note that Moonbeam and Moonbase Alpha use the same [Moonbeam Moonscan](https://moonscan.io/){target=_blank} API key, whereas you'll need a distinct API key for [Moonriver](https://moonriver.moonscan.io/){target=_blank}. 

在开始合约验证流程之前，您需要先[获取Moonscan API密钥](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}。注意：Moonbeam和Moonbase Alpha使用相同的[Moonbeam Moonscan](https://moonscan.io/){target=_blank} API密钥，而[Moonriver](https://moonriver.moonscan.io/){target=_blank}需要不同的API密钥。

Double check that your `secrets.json` file includes your API key for [Moonbeam Moonscan](https://moonscan.io/){target=_blank}. 

请再次确认您的`secrets.json`文件包含了[Moonbeam Moonscan](https://moonscan.io/){target=_blank} API密钥。

![Add Moonscan API Key to Secret.json.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-2.png)

To verify the contract, you will run the `verify` command and pass in the network where the `DelegationDao` contract is deployed, the address of the contract, and the two constructor arguments that you specified in your `deploy.js` file, namely, the address of the target collator and the address you deployed the smart contract with (sourced from your `secrets.json` file).

要验证合约，您可以运行`verify`命令并传入部署`DelegationDao`合约的网络、合约地址，和在`deploy.js`文件中指定的两个构造函数，即目标收集人地址和部署智能合约的地址（来源于`secrets.json`文件）。

```
npx hardhat verify --network moonbase <CONTRACT-ADDRESS> "{{ networks.moonbase.staking.candidates.address1 }}" "DEPLOYER-ADDRESS"
```

!!! note 注意事项
    If you're deploying `DelegationDAO.sol` verbatim without any changes, you may get an `Already Verified` error because Moonscan automatically recognizes and verifies smart contracts that have matching bytecode. Your contract will still show as verified, so there is nothing else you need to do. However, if you'd prefer to verify your own `DelegationDAO.sol`, you can make a small change to the contract (such as changing a comment) and repeating the compilation, deployment and verification steps.

如果您在没有任何更改的情况下逐字部署`DelegationDAO.sol`，您可能会收到`Already Verified`的错误提示，因为Moonscan会自动识别并验证具有匹配字节码的智能合约。您的合约仍将显示为已验证，因此您无需执行任何其他操作。但是，如果您想要验证自己的`DelegationDAO.sol`，您可以对合约进行稍作修改（例如更改注释）并重复编译、部署和验证步骤。

In your terminal you should see the source code for your contract was successfully submitted for verification. If the verification was successful, you should see **Successfully verified contract** and there will be a link to the contract code on [Moonscan for Moonbase Alpha](https://moonbase.moonscan.io/){target=_blank}. If the plugin returns an error, double check that your API key is configured correctly and that you have specified all necessary parameters in the verification command. You can refer to the [guide to the Hardhat Etherscan plugin](/builders/build/eth-api/verify-contracts/etherscan-plugins/){target=_blank} for more information.

在您的终端中，您会看到合约源代码已成功提交以用于验证。如果验证成功，您会看到**Successfully verified contract**并且会有一个指向[Moonscan for Moonbase Alpha](https://moonbase.moonscan.io/){target=_blank}上的合约代码的链接。如果插件返回错误，请仔细检查您的API密钥配置是否正确，以及您是否已在验证命令中指定所有必要的参数。您可以通过[Hardhat Etherscan插件指南](/builders/build/eth-api/verify-contracts/etherscan-plugins/){target=_blank}获取更多信息。

![Verify contracts on Moonbase Alpha using the Hardhat Etherscan plugin.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-6.png)

## Deploying to Production on Moonbeam Mainnet - 在Moonbeam主网上部署到生产环境 {: #deploying-to-production-on-moonbeam-mainnet }

!!! note 注意事项
    `DelegationDAO.sol` is unreviewed and unaudited. It is designed only for demonstration purposes and not intended for production use. It may contain bugs or logic errors that could result in loss of funds. 

`DelegationDAO.sol`未经过审核和审计，仅用于演示目的。其中可能会包含漏洞或者逻辑错误而导致资产损失，请勿在生产环境中使用。

In the following steps, we'll be deploying the `DelegationDAO` contract to the Moonbeam MainNet network. Remember to add the Moonbeam network to your [`hardhat.config.js`](#hardhat-configuration-file) and update your `secrets.json` file with the private keys of your accounts on Moonbeam if you haven't done so already. Before deploying `DelegationDAO` to Moonbeam, we need to change the address of the target collator, since our target collator on Moonbase Alpha does not exist on Moonbeam. Head to your deploy script and change the target collator to `0x1C86E56007FCBF759348dcF0479596a9857Ba105` or [another Moonbeam collator](https://apps.moonbeam.network/moonbeam/staking){target=_blank} of your choice. Your `deploy.js` script should thus look like the following: 

在以下步骤中，我们将部署`DelegationDAO`合约至Moonbeam主网。如果您尚未设置网络，请先将Moonbeam网络添加到您的[`hardhat.config.js`](#hardhat-configuration-file)中并使用您在Moonbeam上的帐户私钥更新您的`secrets.json`文件。在将`DelegationDAO`部署到Moonbeam之前，由于我们在Moonbase Alpha上的目标收集人在Moonbeam上并不存在，我们需要更改目标收集人的地址。前往您的部署脚本并将目标收集人更改为您选择的`0x1C86E56007FCBF759348dcF0479596a9857Ba105`或[另一个 Moonbeam收集人](https://apps.moonbeam.network/moonbeam/staking){target=_blank}。 因此，您的`deploy.js`脚本应如下所示：

```javascript
// 1. The PureStake-03 collator on Moonbeam is chosen as the DAO's target
const targetCollator = "0x1C86E56007FCBF759348dcF0479596a9857Ba105"

async function main() {
  // 2. Get the address of the deployer to later be set as the admin of the DAO
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // 3. Get an instance of DelegationDAO
  const delegationDao = await ethers.getContractFactory("DelegationDAO");
  
  // 4. Deploy the contract specifying two params: the desired collator to delegate
  // to and the address of the deployer (synonymous with initial DAO admin)
  const deployedDao = await delegationDao.deploy(targetCollator, deployer.address);
  console.log("DAO address:", deployedDao.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

You can now deploy `DelegationDAO.sol` using the `run` command and specifying `moonbeam` as the network:

现在您可以使用`run`命令部署`DelegationDAO.sol`并将`moonbeam`指定为网络：

```
npx hardhat run --network moonbeam scripts/deploy.js
```

If you're using another Moonbeam network, make sure that you specify the correct network. The network name needs to match how it's defined in the `hardhat.config.js`.

如果您使用的是另一个Moonbeam网络，请确保您已指定正确的网络。网络名称需要与`hardhat.config.js`中定义的保持一致。

After a few seconds, the contract is deployed, and you should see the address in the terminal.

几分钟后，合约会成功部署，您将在终端看到地址。

![Deploy a Contract to Moonbeam with HardHat.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-7.png)

Congratulations, your contract is live on Moonbeam! Save the address, as you will use it to interact with this contract instance in the next step.

恭喜您，您的合约已上线Moonbeam！请保存地址，这将在后续步骤中用于合约实例交互。

## Verifying Contracts on Moonbeam - 在Moonbeam上验证合约 {: #verifying-contracts-on-moonbeam }

In this section, we'll be verifying the contract that was just deployed on Moonbeam. Before beginning the contract verification process, you'll need to [acquire a Moonscan API Key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}. Note that Moonbeam and Moonbase Alpha use the same [Moonbeam Moonscan](https://moonscan.io/){target=_blank} API key, whereas you'll need a distinct API key for [Moonriver](https://moonriver.moonscan.io/){target=_blank}. 

在这一部分，我们将验证刚刚部署至Moonbeam的合约。在开始合约验证流程之前，您需要先[获取Moonscan API密钥](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}。注意：Moonbeam和Moonbase Alpha使用相同的[Moonbeam Moonscan](https://moonscan.io/){target=_blank} API密钥，而[Moonriver](https://moonriver.moonscan.io/){target=_blank}需要不同的API密钥。

Double check that your `secrets.json` file includes your API key for [Moonbeam Moonscan](https://moonscan.io/){target=_blank}. 

请再次确认您的`secrets.json`文件包含了[Moonbeam Moonscan](https://moonscan.io/) API密钥。

![Add Moonscan API Key to Secret.json.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-2.png)

To verify the contract, you will run the `verify` command and pass in the network where the `DelegationDao` contract is deployed, the address of the contract, and the two constructor arguments that you specified in your `deploy.js` file, namely, the address of the target collator and the address you deployed the smart contract with (sourced from your `secrets.json` file). Remember that the target collator of the staking DAO on Moonbeam is different from the target collator of the staking DAO on Moonbase Alpha. 

要验证合约，您可以运行`verify`命令并传入部署`DelegationDao`合约的网络、合约地址，和在`deploy.js`文件中指定的两个构造函数，即目标收集人地址和部署智能合约的地址（来源于`secrets.json`文件）。请注意：Moonbeam上的staking DAO的目标收集人与Moonbase Alpha上的staking DAO的目标收集人不同。

```
npx hardhat verify --network moonbeam <CONTRACT-ADDRESS> "0x1C86E56007FCBF759348dcF0479596a9857Ba105" "DEPLOYER-ADDRESS"
```

!!! note 注意事项
    If you're deploying `DelegationDAO.sol` verbatim without any changes, you may get an `Already Verified` error because Moonscan automatically recognizes and verifies smart contracts that have matching bytecode. Your contract will still show as verified, so there is nothing else you need to do. However, if you'd prefer to verify your own `DelegationDAO.sol`, you can make a small change to the contract (such as changing a comment) and repeating the compilation, deployment, and verification steps.

如果您在没有任何更改的情况下逐字部署`DelegationDAO.sol`，您可能会收到`Already Verified`的错误提示，因为Moonscan会自动识别并验证具有匹配字节码的智能合约。您的合约仍将显示为已验证，因此您无需执行任何其他操作。但是，如果您想要验证自己的`DelegationDAO.sol`，您可以对合约进行稍作修改（例如更改注释）并重复编译、部署和验证步骤。

In your terminal you should see the source code for your contract was successfully submitted for verification. If the verification was successful, you should see **Successfully verified contract** and there will be a link to the contract code on [Moonbeam Moonscan](https://moonscan.io/){target=_blank}. If the plugin returns an error, double check that your API key is configured correctly and that you have specified all necessary parameters in the verification command. You can refer to the [guide to the Hardhat Etherscan plugin](/builders/build/eth-api/verify-contracts/etherscan-plugins/){target=_blank} for more information.

在您的终端中，您会看到合约源代码已成功提交以用于验证。如果验证成功，您会看到**Successfully verified contract**并且会有一个指向[Moonbeam Moonscan](https://moonscan.io/){target=_blank}上的合约代码的链接。如果插件返回错误，请仔细检查您的API密钥配置是否正确，以及您是否已在验证命令中指定所有必要的参数。您可以通过[Hardhat Etherscan插件指南](/builders/build/eth-api/verify-contracts/etherscan-plugins/){target=_blank}获取更多信息。

![Verify contracts on Moonbeam using Hardhat Etherscan plugin.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-8.png)

And that's it! We covered a lot of ground in this tutorial but there's more resources available if you'd like to go deeper, including the following:

这样就可以了！我们在本教程中介绍了很多基础知识。如果您想深入了解，可以访问以下链接获取更多信息：

- [测试合约的Hardhat指南](https://hardhat.org/hardhat-runner/docs/guides/test-contracts){target=_blank}
- [编写任务和脚本](https://hardhat.org/hardhat-runner/docs/guides/tasks-and-scripts){target=_blank}

--8<-- 'text/disclaimers/educational-tutorial.md'

--8<-- 'text/disclaimers/third-party-content.md'