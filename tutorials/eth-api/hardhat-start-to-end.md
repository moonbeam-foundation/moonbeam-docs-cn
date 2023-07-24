---
title: Hardhat开发流程
description: 学习如何使用Hardhat开发、测试、部署智能合约以及如何将合约从本地开发节点迁移至Moonbeam主网。
---

# Hardhat开发流程

![Learn about the typical Hardhat Ethereum Developer workflow from start to finish.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-banner.png)
_本文档更新至2023年1月16日｜作者：Kevin Neilson & Erin Shaben_

## 概览 {: #introduction }

在本教程中，我们将从头至尾详细演示在[Hardhat开发环境](https://hardhat.org/){target=_blank}中启动[pooled staking DAO（汇集质押DAO）合约](https://github.com/moonbeam-foundation/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}的典型开发流程。

我们将组装staking DAO的组件并编译必要合约。然后，使用staking DAO相关的各类测试用例构建测试套件并在本地开发节点上运行。最后，我们将staking DAO部署至Moonbase Alpha和Moonbeam并通过[Hardhat Etherscan插件](/builders/build/eth-api/verify-contracts/etherscan-plugins/#using-the-hardhat-etherscan-plugin){target=_blank}验证合约。如果您尚未了解Hardhat，建议您先阅读[Hardhat教程](/builders/build/eth-api/dev-env/hardhat/){target=_blank}。

_此处所有信息由第三方提供，仅供参考之用。Moonbeam不为Moonbeam文档网站（https://docs.moonbeam.network/）上列出和描述的任何项目背书。_

## 查看先决条件 {: #checking-prerequisites }

开始之前，您需要准备以下内容：

 - 拥有DEV的Moonbase Alpha账户
    --8<-- 'text/faucet/faucet-list-item.md'
 - [Moonscan API密钥](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}
 - 在[测试部分](#running-your-tests)您将需要拥有[一个启动且正在运行的Moonbeam本地节点](/builders/get-started/networks/moonbeam-dev/){target=_blank}
  -
--8<-- 'text/common/endpoint-examples.md'

## 创建Hardhat项目 {: #creating-a-hardhat-project }

如果您尚未拥有Hardhat项目，您可以通过完成以下步骤创建一个：

1. 为您的项目创建一个目录

    ```bash
    mkdir stakingDAO && cd stakingDAO
    ```

2. 初始化将要创建一个`package.json`文件的项目

    ```bash
    npm init -y
    ```

3. 安装Hardhat

    ```bash
    npm install hardhat
    ```

4. 创建项目

    ```bash
    npx hardhat
    ```

    !!! 注意事项
        `npx`用于运行项目中本地安装的可执行文件。Hardhat虽然可以全局安装，但是建议在每个项目本地安装，这样可以逐个项目地控制版本。

5. 随后会显示菜单，允许您创建新项目或使用示例项目。在本示例中，您可以选择**Create an empty hardhat.config.js**

![Create an empty Hardhat project.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-1.png)

这将在您的项目目录中创建一个Hardhat配置文件（`hardhat.config.js`）。

## 添加智能合约 {: #add-smart-contracts }

本教程中使用的智能合约比[Hardhat概览](/builders/build/eth-api/dev-env/hardhat/){target=_blank}中的更为复杂，但是此合约的特性更适合展示Hardhat的一些高级功能。[`DelegationDAO.sol`](https://github.com/moonbeam-foundation/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}是一个pooled staking DAO，当其达到特定的阈值时使用[`StakingInterface.sol`](/builders/pallets-precompiles/precompiles/staking/){target=_blank}来自动委托给[收集人](/learn/platform/glossary/#collators){target=_blank}。像[`DelegationDAO.sol`](https://github.com/moonbeam-foundation/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}这样的质押合约允许低于最低协议保证金的委托人联合起来通过将资金放在同一个委托池中赚取部分质押奖励。

!!! 注意事项
    `DelegationDAO.sol`未经过审核和审计，仅用于演示目的。其中可能会包含漏洞或者逻辑错误而导致资产损失，请勿在生产环境中使用。

要开始操作，请执行以下步骤：

1. 创建`contracts`目录以存放项目的智能合约

    ```bash
    mkdir contracts
    ```

2. 创建名为`DelegationDAO.sol`的新文件

    ```bash
    touch contracts/DelegationDAO.sol
    ```

3. 将[DelegationDAO.sol](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-intro-course-resources/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}中的内容复制并粘贴至`DelegationDAO.sol`
4. 在`contracts`目录中创建名为`StakingInterface.sol`的新文件

    ```bash
    touch contracts/StakingInterface.sol
    ```

5. 将[StakingInterface.sol](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank}内容复制并粘贴至`StakingInterface.sol`
6. `DelegationDAO.sol`依赖于几个标准[OpenZeppelin](https://www.openzeppelin.com/){target=_blank}合约。使用以下命令添加库：

    ```bash
    npm install @openzeppelin/contracts
    ```

## Hardhat配置文件 {: #hardhat-configuration-file }

在将合约部署至Moonbase Alpha之前，您需要修改Hardhat配置文件并创建一个安全文件用于存储私钥和[Moonscan API密钥](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}。

您可以运行以下命令来创建一个`secrets.json`文件以存储私钥：

```bash
touch secrets.json
```

然后，为您在Moonbase Alpha上的两个账户添加私钥。由于一些测试会在开发节点上完成，您也需要为两个预注资的开发节点账户添加私钥（在本示例中，我们将使用Alice和Bob两个账户）。另外，您需要添加Moonscan API密钥，可用于Moonbase Alpha和Moonbeam。

!!! 注意事项
    任何发送至Alice和Bob开发账户的真实资产将会马上丢失。采取预防措施，切勿将主网资产发送至公开的开发账户。

```json
{
    "privateKey": "YOUR_PRIVATE_KEY_HERE",
    "privateKey2": "YOUR_SECOND_PRIVATE_KEY_HERE",
    "alicePrivateKey": "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133",
    "bobPrivateKey": "0x8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b",
    "moonbeamMoonscanAPIKey": "YOUR_MOONSCAN_API_KEY_HERE"
}
```

如果您有单独的Moonbeam主网账户，您可以为单独的账户添加不同的变量或在准备部署至主网时更新`privateKey`和`privateKey2`变量。

您的`secrets.json`应类似于以下内容：

![Add Moonscan API Key to secrets.json.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-2.png)

确保添加此文件至您项目的`.gitignore`中，并保管好您的私钥，切勿将其泄露给他人。

!!! 请记住
    请始终使用指定私钥管理器或类似服务来管理您的私钥。切勿在代码库中存储或提交您的私钥。

设置`hardhat.config.js`文件时，我们需要导入一些教程所需的插件。开始之前，需要准备好[Hardhat Toolbox插件](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox){target=_blank}，这可以轻松地将一些后续用于测试的包打包在一起。我们也会用到[Hardhat Etherscan插件](/builders/build/eth-api/verify-contracts/etherscan-plugins/#using-the-hardhat-etherscan-plugin){target=_blank}，其将用于验证合约。这两个插件可以通过以下命令安装：

```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox @nomiclabs/hardhat-etherscan
```

如果您需要其他的Hardhat插件，请访问[官方Hardhat插件完整列表](https://hardhat.org/hardhat-runner/plugins){target=_blank}。

--8<-- 'text/hardhat/hardhat-configuration-file.md'
5. 导入[Moonscan API密钥](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}，用于本教程后续验证部分

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

您可以修改`hardhat.config.js`文件，使其可用于任何Moonbeam网络：

=== "Moonbeam"

    ```js
    moonbeam: {
        url: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here

        chainId: {{ networks.moonbeam.chain_id }}, // (hex: {{ networks.moonbeam.hex_chain_id }})
        accounts: [privateKey]
      },
    ```

=== "Moonriver"

    ```js
    moonriver: {
        url: '{{ networks.moonriver.rpc_url }}', // Insert your RPC URL here

        chainId: {{ networks.moonriver.chain_id }}, // (hex: {{ networks.moonriver.hex_chain_id }})
        accounts: [privateKey]
      },
    ```

=== "Moonbase Alpha"

    ```js
    moonbase: {
        url: '{{ networks.moonbase.rpc_url }}',

        chainId: {{ networks.moonbase.chain_id }}, // (hex: {{ networks.moonbase.hex_chain_id }})
        accounts: [privateKey]
      },
    ```

=== "Moonbeam Dev Node"

    ```js
    dev: {
        url: '{{ networks.development.rpc_url }}',

        chainId: {{ networks.development.chain_id }}, // (hex: {{ networks.development.hex_chain_id }})
        accounts: [privateKey]
      },
    ```

现在您可以开始编译并测试合约。

## 编译合约 {: #compiling-the-contract }

您可以简单运行以下命令以编译合约：

```bash
npx hardhat compile
```

![Learn how to compile your Solidity contracts with Hardhat.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-3.png)

编译合约后，会创建一个`artifacts`目录，该目录包含合约的字节码和元数据，即`.json`文件。建议您将此目录添加至`.gitignore`。

## 测试 {: #testing }

测试套件是一个完整且强大的智能合约开发流程不可或缺的。Hardhat有一系列的工具，可以轻松助您编写和运行测试。在这一部分，您将学习测试智能合约的基本知识和一些高级技术。

Hardhat测试通常使用Mocha和Chai编写，[Mocha](https://mochajs.org/){target=_blank}是一个JavaScript测试框架，[Chai](https://www.chaijs.com/){target=_blank}是一个BDD/TDD JavaScript断言库。BDD/TDD分别代表行为和测试驱动开发。有效的BDD/TDD需要在编写智能合约代码*之前*编写测试。本教程的结构没有严格遵循这些准则，但您可能需要在您的开发流程中采用这些原则。Hardhat建议使用[Hardhat工具箱](https://hardhat.org/hardhat-runner/docs/guides/migrating-from-hardhat-waffle){target=_blank}，它是一个插件，会将所有开始使用Hardhat所需的插件打包在一起，包括Mocha和Chai。

因为我们最初将在本地Moonbeam节点上运行测试，所以需要指定Alice的地址作为目标收集人的地址（Alice的账户是本地开发节点的唯一收集人）。

```
0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
```

相反，如果您想要通过Moonbase Alpha运行测试，则可以选择以下收集人，或者任何您想要DAO委托给的[Moonbase Alpha上的其他收集人](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank}：

```
{{ networks.moonbase.staking.candidates.address1 }}
```

### 配置测试文件 {: #configuring-the-test-file }

要设置测试文件，请执行以下步骤：

1. 创建`tests`目录

    ```bash
    mkdir tests
    ```

2. 创建一个名为`Dao.js`的新文件

    ```bash
    touch tests/Dao.js
    ```

3. 然后复制并粘贴以下内容以设置测试文件的初始结构。请仔细阅读注释，因为它们阐明了每行代码的目的

    ``` javascript
    // 导入Hardhat和Hardhat Toolbox
    const { ethers } = require("hardhat");
    require("@nomicfoundation/hardhat-toolbox");
    
    // 在此处导入Chai以使用其断言函数
    const { expect } = require("chai");
    
    // 指定Alice的地址作为本地开发节点上的目标收集人
    const targetCollator = "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac";
    ```

### 部署Staking DAO用于测试 {: #deploying-a-staking-dao-for-testing }

在运行任何用例之前，我们需要启动一个带有初始配置的staking DAO，我们此处的设置相对简单，我们将用单个管理员（部署者）部署staking DAO，然后添加新成员至DAO。此简单设置非常适合用于演示，您也很容易想象您想要测试的更复杂的配置，例如有100个DAO成员的场景或者有多个DAO管理员的场景。

Mocha的`describe`函数使您能够组织您的测试。多个`describe`函数可以嵌套在一起。它完全是可选的，但在有大量测试用例的复杂项目中极其有用。您可以在Mocha文档网站查阅关于构建测试和[Mocha入门操作](https://mochajs.org/#getting-started){target=_blank}的更多信息。

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

### 编写第一个测试用例 {: #writing-your-first-test-cases }

首先，您要创建一个名为`Deployment`的子部分以分类管理测试文件。其将包含在`Dao contract` describe函数中。接下来，您将使用`it` Mocha函数定义您的第一个测试用例。第一个测试只是简单地检查staking DAO是否正确存储了目标收集人的地址。

请将以下代码段添加至`Dao contract`函数的末尾。

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

现在，添加另一个测试用例。当staking DAO启动时，不会有任何资金。该测试验证确实如此。请将以下测试用例添加到`Dao.js`文件中：

```javascript
it("should initially have 0 funds in the DAO", async function () {
  const { deployedDao } = await deployDao();

  // This test will pass if the DAO has no funds as expected before any contributions
  expect(await deployedDao.totalStake()).to.equal(0);
});
```

### 函数还原（Revert） {: #function-reverts }

现在，您将使用稍微不同的架构来实现更复杂的测试用例。在上述示例中，您已验证函数返回预期值。在这一部分中，您将验证函数是否会还原。您将更改调用者的地址以测试仅限管理员的功能。

在[staking DAO合约](https://github.com/moonbeam-foundation/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}中，只有管理员有权限添加新成员至DAO。我们可以编写一个测试查看管理员是否有权限添加新成员，但是可能更重要的测试是确保*非管理员*不能添加新成员。要在不同的账户下运行此测试用例，您需要在调用`ethers.getSigners()`时请求另一个地址，并在断言中使用`connect(member1)`指定调用者。最后，在函数调用后，您将附加`.to.be.reverted`以指示如果函数还原则测试用例成功。反之则代表测试失败。

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

### 从其他账户签署交易 {: #signing-transactions-from-other-accounts }

在本示例中，您将验证新添加的DAO成员是否可以调用staking DAO的`check_free_balance()`函数，该函数有访问修饰符，仅限成员访问。

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

这样就可以了！您现在可以运行测试了！

### 运行测试 {: #running-your-tests }

如果您已遵循上述部分，则您的[`Dao.js`](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-intro-course-resources/main/delegation-dao-lesson-one/Dao.js){target=_blank}测试文件应该都准备好了。否则，您需要[从GitHub将完整的代码段](https://github.com/moonbeam-foundation/moonbeam-docs/blob/master/.snippets/code/hardhat/dao-js-test-file.js){target=_blank}复制到`Dao.js`测试文件中。

由于我们的测试用例主要包含staking DAO的配置和设置，不涉及实际委托操作，因此我们将在Moonbeam开发节点（本地节点）上运行我们的测试。请注意，Alice（`0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`）是本地开发节点上唯一的收集人。您可以使用标志`--network moonbase`来使用Moonbase Alpha运行测试。在这种情况下，请确保您的部署者地址有足够的DEV token。

!!! 挑战
    尝试创建一个额外的测试用例，以验证满足`minDelegationStk`时staking DAO是否成功委托给收集人。您需要在Moonbase Alpha而不是本地开发节点上进行测试。

首先，遵循[启动本地开发节点的指南](/builders/get-started/networks/moonbeam-dev/){target=_blank}确保您的本地Moonbeam节点正在运行。如果您将Alice和Bob私钥导入到`secrets.json`文件中，请注意，如果您将真实资金发送到这些账户会导致这些资金损失。

您可以使用以下命令运行测试：

```bash
npx hardhat test --network dev tests/Dao.js
```

如果设置无误，您将看到以下输出：

![Run your test suite of test cases with Hardhat.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-4.png)

## 部署至Moonbase Alpha {: #deploying-to-moonbase-alpha }

在以下步骤中，我们将部署`DelegationDAO`至Moonbase Alpha测试网。在部署至Moonbase Alpha或Moonbeam之前，请确认您所使用的账户不是Alice和Bob账户，这两个账户仅用于本地开发节点。

另外，请注意`DelegationDAO`依赖于 [`StakingInterface.sol`](/builders/pallets-precompiles/precompiles/staking/){target=_blank}，这是Moonbeam网络独有的基于Substrate的产品。Hardhat网络和分叉网络是模拟的EVM环境，不包括像`StakingInterface.sol`的基于Substrate的预编译。因此，如果将`DelegationDAO`部署到本地默认的Hardhat网络或一个[分叉网络](/builders/build/eth-api/dev-env/hardhat/#forking-moonbeam){target=_blank}，它将无法正常工作。

要部署`DelegationDAO.sol`，您可以编写一个简单的脚本。您可以为脚本创建一个新的目录，并命名为`scripts`：

```bash
mkdir scripts
```

然后，添加名为`deploy.js`的新文件：

```bash
touch scripts/deploy.js
```

接下来，您需要编写部署脚本，可通过使用`ethers`完成此步骤。由于您将使用Hardhat运行，因此无需导入任何库：

接着，执行以下步骤：

1. 指定DAO要委托的活跃收集人地址。在本示例中，我们将使用PS-1收集人的地址（注意：这与本地开发节点上的Alice收集人的地址不同）
2. 将部署者地址指定为DAO的管理员。部署者作为DAO管理员这点很重要，用以确保后续测试按预期工作
3. 使用`getContractFactory`函数创建一个合约的本地实例
4. 使用已存在于此实例中的`deploy`函数来实例化智能合约
5. 部署后，您可以使用合约实例获取合约地址

一切无误，您的部署脚本应类似于以下内容：

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

确保您已在账户中存入Moonbase Alpha DEV Token。现在您可以使用`run`命令部署`DelegationDAO.sol`，并指定`moonbase`作为网络（已在`hardhat.config.js`文件中配置）：

```bash
npx hardhat run --network moonbase scripts/deploy.js
```

几秒钟后，合约会成功部署，您将在终端看到地址。

![Deploy a Contract to Moonbase Alpha with Hardhat.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-5.png)

恭喜您，您的合约已上线Moonbase Alpha！请保存地址，这将在后续步骤中用于与此合约实例交互。

## 验证在Moonbase Alpha上的合约 {: #verifying-contracts-on-moonbase-alpha }

合约验证是任何开发流程中必不可少的一步，尤其是对于staking DAO的理论示例来说。DAO中的潜在参与者需要确保智能合约按预期工作，并且验证合约以允许任何人可以查看和分析已部署的智能合约。

虽然可以在[Moonscan网站](https://moonscan.io/verifyContract){target=_blank}上验证智能合约，但是Hardhat Etherscan插件提供更快速且简单的方式以验证staking DAO。毫不夸张地说，该插件极大地简化了合约验证的流程，尤其是对于包含多个Solidity文件或库的项目。

在开始合约验证流程之前，您需要先[获取Moonscan API密钥](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}。注意：Moonbeam和Moonbase Alpha使用相同的[Moonbeam Moonscan](https://moonscan.io/){target=_blank} API密钥，而[Moonriver](https://moonriver.moonscan.io/){target=_blank}需要不同的API密钥。

请再次确认您的`secrets.json`文件包含了您的[Moonbeam Moonscan](https://moonscan.io/){target=_blank} API密钥。

![Add Moonscan API Key to Secret.json.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-2.png)

要验证合约，您可以运行`verify`命令并传入部署`DelegationDao`合约的网络、合约地址，以及在`deploy.js`文件中给出的两个构造函数参数，即目标收集人地址和部署智能合约的部署者地址（来源于`secrets.json`文件）。

```bash
npx hardhat verify --network moonbase <CONTRACT-ADDRESS> "{{ networks.moonbase.staking.candidates.address1 }}" "DEPLOYER-ADDRESS"
```

!!! 注意事项
    如果您在没有任何更改的情况下逐字部署`DelegationDAO.sol`，您可能会收到`Already Verified`的错误提示，因为Moonscan会自动识别并验证具有匹配字节码的智能合约。您的合约仍将显示为已验证，因此您无需执行任何其他操作。但是，如果您想要验证自己的`DelegationDAO.sol`，您可以对合约稍作修改（例如更改注释）并重复编译、部署和验证步骤。

在您的终端中，您会看到合约源代码已成功提交以用于验证。如果验证成功，您会看到**Successfully verified contract**并且会有一个指向[Moonscan for Moonbase Alpha](https://moonbase.moonscan.io/){target=_blank}上的合约代码的链接。如果插件返回错误，请仔细检查您的API密钥配置是否正确，以及您是否已在验证命令中指定所有必要的参数。您可以通过[Hardhat Etherscan插件指南](/builders/build/eth-api/verify-contracts/etherscan-plugins/){target=_blank}获取更多信息。

![Verify contracts on Moonbase Alpha using the Hardhat Etherscan plugin.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-6.png)

## 部署到Moonbeam主网上的生产环境 {: #deploying-to-production-on-moonbeam-mainnet }

!!! 注意事项
    `DelegationDAO.sol`未经过审核和审计，仅用于演示目的。其中可能会包含漏洞或者逻辑错误而导致资产损失，请勿在生产环境中使用。

在以下步骤中，我们将部署`DelegationDAO`合约至Moonbeam主网。如果您尚未设置网络，请先将Moonbeam网络添加到您的[`hardhat.config.js`](#hardhat-configuration-file)中并使用您在Moonbeam上的帐户私钥更新您的`secrets.json`文件。在将`DelegationDAO`部署到Moonbeam之前，由于我们在Moonbase Alpha上的目标收集人在Moonbeam上并不存在，我们需要更改目标收集人的地址。前往您的部署脚本并将目标收集人更改为`0x1C86E56007FCBF759348dcF0479596a9857Ba105`或您选择的[另一个Moonbeam收集人](https://apps.moonbeam.network/moonbeam/staking){target=_blank}。因此，您的`deploy.js`脚本应如下所示：

```javascript
// 1. The moonbeam-foundation-03 collator on Moonbeam is chosen as the DAO's target
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

现在您可以使用`run`命令部署`DelegationDAO.sol`并将`moonbeam`指定为网络：

```bash
npx hardhat run --network moonbeam scripts/deploy.js
```

如果您使用的是另一个Moonbeam网络，请确保您已指定正确的网络。网络名称需要与`hardhat.config.js`中定义的保持一致。

几秒钟后，合约会成功部署，您将在终端看到地址。

![Deploy a Contract to Moonbeam with HardHat.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-7.png)

恭喜您，您的合约已上线Moonbeam！请保存地址，其将在后续步骤中用于与合约实例交互。

## 验证在Moonbeam上的合约 {: #verifying-contracts-on-moonbeam }

在这一部分，我们将验证刚刚部署至Moonbeam的合约。在开始合约验证流程之前，您需要先[获取Moonscan API密钥](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}。注意：Moonbeam和Moonbase Alpha使用相同的[Moonbeam Moonscan](https://moonscan.io/){target=_blank} API密钥，而[Moonriver](https://moonriver.moonscan.io/){target=_blank}需要不同的API密钥。

请再次确认您的`secrets.json`文件包含了[Moonbeam Moonscan](https://moonscan.io/) API密钥。

![Add Moonscan API Key to Secret.json.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-2.png)

要验证合约，您可以运行`verify`命令并传入部署`DelegationDao`合约的网络、合约地址，以及在`deploy.js`文件中给出的两个构造函数参数，即目标收集人地址和部署智能合约的部署者地址（来源于`secrets.json`文件）。请注意：Moonbeam上的staking DAO的目标收集人与Moonbase Alpha上的staking DAO的目标收集人不同。

```bash
npx hardhat verify --network moonbeam <CONTRACT-ADDRESS> "0x1C86E56007FCBF759348dcF0479596a9857Ba105" "DEPLOYER-ADDRESS"
```

!!! 注意事项
    如果您在没有任何更改的情况下逐字部署`DelegationDAO.sol`，您可能会收到`Already Verified`的错误提示，因为Moonscan会自动识别并验证具有匹配字节码的智能合约。您的合约仍将显示为已验证，因此您无需执行任何其他操作。但是，如果您想要验证自己的`DelegationDAO.sol`，您可以对合约稍作修改（例如更改注释）并重复编译、部署和验证步骤。

在您的终端中，您会看到合约源代码已成功提交以用于验证。如果验证成功，您会看到**Successfully verified contract**并且会有一个指向[Moonbeam Moonscan](https://moonscan.io/){target=_blank}上的合约代码的链接。如果插件返回错误，请仔细检查您的API密钥配置是否正确，以及您是否已在验证命令中指定所有必要的参数。您可以通过[Hardhat Etherscan插件指南](/builders/build/eth-api/verify-contracts/etherscan-plugins/){target=_blank}获取更多信息。

![Verify contracts on Moonbeam using Hardhat Etherscan plugin.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-8.png)

这样就可以了！我们在本教程中介绍了很多基础知识。如果您想深入了解，可以访问以下链接获取更多信息：

- [测试合约的Hardhat指南](https://hardhat.org/hardhat-runner/docs/guides/test-contracts){target=_blank}
- [编写任务和脚本](https://hardhat.org/hardhat-runner/docs/guides/tasks-and-scripts){target=_blank}

--8<-- 'text/disclaimers/educational-tutorial.md'

--8<-- 'text/disclaimers/third-party-content.md'
