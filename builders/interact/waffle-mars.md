---
title: 使用Waffle和Mars
description: 通过此教程学习如何使用Waffle和Mars在Moonbeam上编写、编译、测试和部署以太坊智能合约。
---

# 在Moonbeam上使用Waffle和Mars

![Waffle and Mars on Moonbeam](/images/builders/interact/waffle-mars/waffle-mars-banner.png)

## 概览 {: #introduction } 

[Waffle](https://getwaffle.io/)是编译和测试智能合约的库，[Mars](https://github.com/EthWorks/Mars)是部署管理器。 Waffle和Mars可以一起用于编写、编译、测试和部署以太坊智能合约。由于Moonbeam的以太坊兼容性，因此可以使用Waffle和Mars将智能合约部署到Moonbeam开发节点或Moonbase Alpha测试网。

Waffle使用最少的依赖项，具有易于学习和扩展的编写语法，并在编译和测试智能合约时提供快速的执行时间。此外，Waffle与[TypeScript](https://www.typescriptlang.org/)的兼容和[Chai matchers](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html)的使用使得检视和编写测试变得容易。

Mars提供了一个简单的、与TypeScript兼容的框架，用于创建高级部署脚本并与状态更改保持同步。 Mars专注于「基础设施即代码」，允许开发人员指定该如何部署他们的智能合约，然后使用这些规范自动处理状态更改及部署。

在本教程中，您需先创建一个TypeScript项目，然后使用Waffle编写、编译和测试智能合约，接着使用Mars将其部署到Moonbase Alpha测试网上。
## 查看先决条件 {: #checking-prerequisites } 

--8<-- 'text/common/install-nodejs.md'

在撰写本教程时，所用版本分别为15.12.0和7.6.3版本。

Waffle和Mars可与本地运行的Moonbeam开发节点一起使用，但就本教程而言，您将部署至 Moonbase Alpha。因此，您需确保用开发的账户有充足资金。您可以[使用MetaMask创建帐户](/getting-started/moonbase/metamask/#creating-a-wallet)或[使用Polkadot.js Apps创建帐户](/integrations/wallets/polkadotjs/#creating-or-importing-an-h160-account)。

创建帐户后，导出本教程中所需要使用的私钥，并确保您的帐户有资金。如果需要，可以在[水龙头faucet](/getting-started/moonbase/faucet/)获取“DEV”代币。

## 使用Waffle和Mars创建TypeScript项目 {: #create-a-typescript-project-with-waffle-mars } 

首先，您需创建一个TypeScript项目并安装和配置一些依赖项。

1. 创建项目目录并更改为：
```
mkdir waffle-mars && cd waffle-mars
```

2. 初始化项目。这将在目录中创建一个`package.json`：
```
npm init -y
```

3. 安装以下依赖项：
```
npm install ethereum-waffle ethereum-mars ethers \
@openzeppelin/contracts typescript ts-node chai \
@types/chai mocha @types/mocha
```
    - [Waffle](https://github.com/EthWorks/Waffle) - for writing, compiling, and testing smart contracts
    - [Mars](https://github.com/EthWorks/Mars) - for deploying smart contracts to Moonbeam
    - [Ethers](https://github.com/ethers-io/ethers.js/) - for interacting with Moonbeam's Ethereum API
    - [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts) - the contract you'll be creating will use OpenZeppelin's ERC-20 base implementation
    - [TypeScript](https://github.com/microsoft/TypeScript) - the project will be a TypeScript project
    - [TS Node](https://github.com/TypeStrong/ts-node) - for executing the deployment script you'll create later in this guide
    - [Chai](https://github.com/chaijs/chai) - an assertion library used alongside Waffle for writing tests
    - [@types/chai](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/HEAD/types/chai) - contains the type definitions for chai
    - [Mocha](https://github.com/mochajs/mocha) - a testing framework for writing tests alongside Waffle
    - [@types/mocha](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/HEAD/types/mocha) - contains the type definitions for mocha

4. 创建一个[TypeScript配置](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)文件：
```
touch tsconfig.json
```

5. 添加基本的TypeScript配置：
```
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2019",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "module": "CommonJS",
    "composite": true,
    "sourceMap": true,
    "declaration": true,
    "noEmit": true
  }
}
```

现在，您应该有一个基本的TypeScript项目，其中包含使用Waffle和Mars进行构建所需的依赖项。
## 添加合约  {: #add-a-contract } 

在本教程中，您将创建一个ERC-20合约，该合约基于Open Zeppelin的ERC-20模板向合约创建者铸造指定数量的代币。

1. 创建一个目录来存储您的合约和智能合约文件：
```
mkdir contracts && cd contracts && touch MyToken.sol
```

2. 添加以下合约至MyToken.sol：
```
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MYTOK") {}

    function initialize(uint initialSupply) public {
      _mint(msg.sender, initialSupply);
    }
}
```

在此合约中，您正在创建一个名为MyToken的ERC-20代币，其符号为MYTOK，作为合约的创建者，您可根据需求设置MYTOK的铸造数量。

## 使用Waffle编译和测试 {: #use-waffle-to-compile-and-test } 

### 使用Waffle编译 {: #compile-with-waffle } 

首先，您有一个编写好的智能合约，下一步就是使用Waffle来编译它。在编译之前，您需先配置 Waffle。

1. 返回项目的根目录并创建一个`waffle.json`文件来配置Waffle：
```
cd .. && touch waffle.json
```

2. 编辑`waffle.json`以指定编译器配置，包含合约目录等。在本示例中，我们将使用`solcjs` 和您用于合约的Solidity 版本，即`0.8.0`：
```json
{
  "compilerType": "solcjs", // Specifies compiler to use
  "compilerVersion": "0.8.0", // Specifies version of the compiler
  "compilerOptions": {
    "optimizer": { // Optional optimizer settings
      "enabled": true, // Enable optimizer
      "runs": 20000 // Optimize how many times you want to run the code
    }
  },
  "sourceDirectory": "./contracts", // Path to directory containing smart contracts
  "outputDirectory": "./build", // Path to directory where Waffle saves compiler output
  "typechainEnabled": true // Enable typed artifact generation
}
```

3. 在`package.json`中添加一个脚本来运行Waffle：
```json
"scripts": {
  "build": "waffle"
},
```

这就是配置Waffle的所有步骤，现在您可以完整使用`build`脚本来编译`MyToken`合约：

```
npm run build
```

![Waffle compiler output](/images/builders/interact/waffle-mars/waffle-mars-1.png)

编译合约后，Waffle将JSON输出存储在`build`目录中。本教程中的合约基于Open Zeppelin的 ERC-20模板，因此相关的ERC-20 JSON文件也会出现在`build`目录中。

### 使用Waffle测试 {: #test-with-waffle } 

在部署合约并将其对外发送之前，需先对其进行测试。 Waffle提供了一个高级测试框架，并提供了许多工具来帮助您进行测试。

您将针对 Moonbase Alpha测试网运行测试，并需要相应的RPC URL来连接至`{{ networks.moonbase.rpc_url }}`。由于您将针对测试网运行测试，因此可能需要花费几分钟才能运行所有测试。如果您想获得更有效的测试体验，您可以使用[`instant seal`](/getting-started/local-node/setting-up-a-node/#node-options)[设置Moonbeam开发节点](/getting-started/local-node/setting-up-a-node/)。运行具有`instant seal`功能的Moonbeam本地开发节点与使用[Ganache](https://www.trufflesuite.com/ganache)可获得的快速迭代体验相似。

1. 创建一个目录来包含您的测试，并创建一个文件来测试您的`MyToken`合约
```
mkdir test && cd test && touch MyToken.test.ts
```

2. 打开`MyToken.test.ts`文件并设置您的测试文件以使用Waffle的Solidity插件，然后使用Ethers自定义JSON-RPC提供者连接至Moonbase Alpha：
```typescript
import { use, expect } from 'chai';
import { Provider } from '@ethersproject/providers';
import { solidity } from 'ethereum-waffle';
import { ethers, Wallet } from 'ethers';
import { MyToken, MyTokenFactory } from '../build/types';

// Tell Chai to use Waffle's Solidity plugin
use(solidity);

describe ('MyToken', () => {
  // Use custom provider to connect to Moonbase Alpha
  let provider: Provider = new ethers.providers.JsonRpcProvider('{{ networks.moonbase.rpc_url }}');
  let wallet: Wallet;
  let walletTo: Wallet;
  let token: MyToken;

  beforeEach(async () => {
    // Logic for setting up the wallet and deploying MyToken will go here
  });

  // Tests will go here
})
```

3. 在运行每个测试之前，您需要创建钱包并将它们连接至提供者（Provider），使用钱包部署`MyToken`合约的实例，然后使用 10 个代币的初始供应量调用`initialize`函数：
```typescript
  beforeEach(async () => {
    const PRIVATE_KEY = '<insert-your-private-key-here>'
    // Create a wallet instance using your private key & connect it to the provider
    wallet = new Wallet(PRIVATE_KEY).connect(provider);

    // Create a random account to transfer tokens to & connect it to the provider
    walletTo = Wallet.createRandom().connect(provider);

    // Use your wallet to deploy the MyToken contract
    token = await new MyTokenFactory(wallet).deploy();

    // Mint 10 tokens to the contract owner, which is you
    let contractTransaction = await token.initialize(10);

    // Wait until the transaction is confirmed before running tests
    await contractTransaction.wait();
  });
```

4. 现在您可以创建您的第一个测试用例。第一次测试用例将检查您的初始余额，以确保您收到了10个代币的初始供应量。请注意测试用例应考虑成功和失败的情况，为了遵循测试结果，需先编写失败的测试的代码：
```typescript
it('Mints the correct initial balance', async () => {
  expect(await token.balanceOf(wallet.address)).to.equal(1); // This should fail
});
```

5. 在运行第一个测试用例之前，您需要回到根方向并添加一个`.mocharc.json` Mocha配置文件：
```
cd .. && touch .mocharc.json
```

6. 现在，您可以编辑`.mocharc.json`文件来配置Mocha：
```json
{
  "require": "ts-node/register/transpile-only", // Use ts-node to transpile the code for tests
  "timeout": 600000, // Set timeout to 10 minutes
  "extension": "test.ts" // Specify extension for test files
}
```

7. 您还需要在`package.json`中添加一个脚本来运行你的测试用例：
```json
"scripts": {
  "build": "waffle",
  "test": "mocha",
},
```

8. 若您已准备好运行测试，只需使用您刚刚创建并运行的`test`脚本：
```
npm run test
```
请注意，因为测试是针对Moonbase Alpha运行的，所以处理可能需要几分钟时间。但如果一切都按预期进行，您应该会有一个失败的测试。

9. 接下来，您可以返回并编辑测试，检查10个代币：
```typescript
it('Mints the correct initial balance', async () => {
  expect(await token.balanceOf(wallet.address)).to.equal(10); // This should pass
});
```
10. 如果您再次运行测试，您现在应该会看到一个通过的测试：
```
npm run test
```

11. 您已经测试了铸造代币的能力，接下来您将测试转移铸造代币的能力。如果您想再次编写一个失败的测试，最终测试应该如下所示：
```typescript
it('Should transfer the correct amount of tokens to the destination account', async () => {
  // Send the destination wallet 7 tokens
  await (await token.transfer(walletTo.address, 7)).wait();

  // Expect the destination wallet to have received the 7 tokens
  expect(await token.balanceOf(walletTo.address)).to.equal(7);
});
```

恭喜您！您的两个测试用例均已通过。您的测试文件应如下所示：
```typescript
import { use, expect } from 'chai';
import { Provider } from '@ethersproject/providers';
import { solidity } from 'ethereum-waffle';
import { ethers, Wallet } from 'ethers';
import { MyToken, MyTokenFactory } from '../build/types';

use(solidity);

describe ('MyToken', () => {
  let provider: Provider = new ethers.providers.JsonRpcProvider('{{ networks.moonbase.rpc_url }}');
  let wallet: Wallet;
  let walletTo: Wallet;
  let token: MyToken;

  beforeEach(async () => {
    const PRIVATE_KEY = '<insert-your-private-key-here>'
    wallet = new Wallet(PRIVATE_KEY).connect(provider);
    walletTo = Wallet.createRandom().connect(provider);
    token = await new MyTokenFactory(wallet).deploy();
    let contractTransaction = await token.initialize(10);
    await contractTransaction.wait();
  });

  it('Mints the correct initial balance', async () => {
    expect(await token.balanceOf(wallet.address)).to.equal(10);
  });

  it('Should transfer the correct amount of tokens to the destination account', async () => {
    await (await token.transfer(walletTo.address, 7)).wait();
    expect(await token.balanceOf(walletTo.address)).to.equal(7);
  });
})
```

如果您想自己编写更多测试用例，您可以考虑测试从没有任何资金的账户转账或从没有足够资金的账户转账。

## 使用Mars在Moonbase Alpha上部署 {: #use-mars-to-deploy-to-moonbase-alpha } 

在编译合约之后并准备部署合约之前，您必须为Mars生成合约工件。 Mars使用合约工件在部署中进行类型检查。然后您需要创建一个部署脚本并部署`MyToken`智能合约。

请知晓：合约将部署至Moonbase Alpha并需要使用测试网进行配置：

--8<-- 'text/testnet/testnet-details.md'

部署将分为三个部分：[生成工件](#生成工件)、[创建部署脚本](#创建部署脚本)和[使用Mars部署](#使用Mars进行部署)。

### 生成工件 {: #generate-artifacts } 

您需要为Mars生成工件，以便在部署脚本中启用类型检查。

1. 更新现有脚本以在`package.json`中运行Waffle以包含Mars：
```json
"scripts": {
  "build": "waffle && mars",
  "test": "mocha",
},
```

2. 生成工件并创建部署所需的`artifacts.ts`文件
```
npm run build
```
![Waffle and Mars compiler output](/images/builders/interact/waffle-mars/waffle-mars-2.png)

如果您打开`build`目录，可以看到一个`artifacts.ts`文件，其中包含部署所需的工件数据。您需要编写部署脚本，才能继续进行部署。部署脚本将用于说明Mars部署哪个合约，部署到哪个网络，以及使用哪个帐户来触发部署。

### 创建部署脚本 {: #create-a-deployment-script } 

现在，您需要为Moonbase Alpha测试网配置`MyToken`合约的部署。

在此步骤中，您将创建部署脚本，该脚本将定义应如何部署合约。Mars提供了一个`deploy`功能，您可以向它传递选项，例如用于部署合约的帐户私钥、所要部署的网络等。`deploy`函数内部用于定义要部署的合约的地方。 Mars有一个`contract`函数，用来接受`name`、`artifact`和 `constructorArgs`。此函数将用于部署`MyToken`合约，初始供应量为10个MYTOK。


1. 创建一个`src`目录来包含你的部署脚本并创建脚本来部署`MyToken`合约：
```
mkdir src && cd src && touch deploy.ts
```

2. 在`deploy.ts`中，使用Mars的`deploy`函数创建一个脚本，使用您账户的私钥部署至 Moonbase Alpha：
```javascript
import { deploy } from 'ethereum-mars';

const privateKey = "<insert-your-private-key-here>";
deploy({network: '{{ networks.moonbase.rpc_url }}', privateKey},(deployer) => {
  // Deployment logic will go here
});
```

3. 设置`deploy`函数来部署在上述步骤中创建的`MyToken`合约：
```javascript
import { deploy, contract } from 'ethereum-mars';
import { MyToken } from '../build/artifacts';

const privateKey = "<insert-your-private-key-here>";
deploy({network: '{{ networks.moonbase.rpc_url }}', privateKey}, () => {
  contract('myToken', MyToken, [10]);
});
```

4. 将部署脚本添加到`package.json`中的`scripts`对象：
```json
  "scripts": {
    "build": "waffle && mars",
    "test": "mocha",
    "deploy": "ts-node src/deploy.ts"
  },
```

到目前为止，您应该已经在`deploy.ts`中创建了一个部署脚本，用于将`MyToken`合约部署至Moonbase Alpha，并添加了轻松调用脚本和部署合约的功能。

### 使用Mars进行部署 {: #deploy-with-mars } 

若您已配置了部署，现在可以真正部署至Moonbase Alpha了。

1. 使用您刚刚创建的脚本部署合约：
```
npm run deploy
```

2. 在您的终端中，Mars会提示您点击`ENTER`发送您的交易：
![Mars confirm deployment](/images/builders/interact/waffle-mars/waffle-mars-3.png)

如果成功，您会看到有关您的交易的详细信息，包括哈希值、区块及地址。

![Mars deployment output](/images/builders/interact/waffle-mars/waffle-mars-4.png)

恭喜！您已经成功通过Waffle和Mars在Moonbase Alpha上部署合约了！

## 示例项目 {: #example-project } 

如果您想在Moonbeam上查看Waffle和Mars项目的完整示例，请查看以下由EthWorks（Waffle和Mars背后的团队）成员创建的[moonbeam-waffle-mars-example](https://github.com/EthWorks/moonbeam-waffle-mars-example)。