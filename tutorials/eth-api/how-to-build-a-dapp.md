---
title: 如何构建一个DApp
description: 通过解析一个范例项目，深入了解去中心化应用（DApp）前端、智能合约以及存储系统。
---

# 如何构建一个DApp：完整的DApp架构

_作者：Jeremy Boetticher_

## 概览 {: #introduction }

去中心化应用（DApp）重新定义了应用程序在Web3中的构建、管理和交互方式。通过利用区块链技术，DApp提供了一个安全、透明且无需信任的系统，在无需任何中央授权的情况下即可实现点对点交互。DApp架构的核心由几个主要组件组成，它们协同工作以创建一个强大且去中心化的生态系统。这些组件包括智能合约、节点、前端用户界面等。

![DApp Architecture Diagram](/images/tutorials/eth-api/how-to-build-a-dapp/how-to-build-a-dapp-1.png)

在本教程中，您将通过编写一个用以铸造Token的完整DApp来面对面了解每个主要组件。我们还将探索DApp的其他可选组件，这些组件可以增强您未来项目的用户体验。您可以在[GitHub上的monorepo](https://github.com/jboetticher/complete-example-dapp){target=_blank}中查看完整的项目内容。

![DApp End Result](/images/tutorials/eth-api/how-to-build-a-dapp/how-to-build-a-dapp-2.png)

## 查看先决条件 {: #checking-prerequisites }

要开始进行操作，您需要具备以下条件：

 - 一个拥有DEV的Moonbase Alpha账户
    --8<-- 'text/faucet/faucet-list-item.md'
 - 已安装版本16或是以上的[Node.js](https://nodejs.org/en/download/){target=_blank}
 - [VS Code](https://code.visualstudio.com/){target=_blank}与Juan Blanco的[Solidity扩展](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity){target=_blank}是推荐的IDE
 - JavaScript和React的相关背景知识
 - 对于Solidity的基础了解。如果您并不熟悉Solidity，网络上有很多相关资源，包含[Solidity范例教程](https://solidity-by-example.org/){target=_blank}。大约15分钟的快速学习即可用于本教程之中
 - 已安装类似于[MetaMask](/tokens/connect/metamask){target=_blank}的钱包

## 节点和JSON-RPC端点 {: #nodes-and-json-rpc-endpoints }

一般来说，JSON-RPC是一种利用JSON对数据进行编码的远程过程调用（RPC）协议。在Web3产业中，它们指的是DApp开发者用来发送请求和接收来自区块链节点响应的特定JSON-RPC，这让它成为与智能合约交互的关键元素。它们允许前端用户界面与智能合约无缝交互，并为用户提供有关其操作的实时反馈。它们还允许开发者先部署他们的智能合约！

要让JSON-RPC与Moonbeam区块链进行通信，您需要运行一个节点。但这可能是昂贵、复杂且麻烦的。幸运的是，只要您有权*访问*节点，就可以与区块链进行交互。Moonbase Alpha有[一些免费和付费节点选项](/learn/platform/networks/moonbase/#network-endpoints){target=_blank}。在本教程中，我们将使用Moonbeam基金会的Moonbase Alpha公共节点，但建议您获取自己的[私有端点](/builders/get-started/endpoints/#endpoint-providers){target=_blank}。

```text
{{ networks.moonbase.rpc_url }}
```

现在您有了一个URL。您会如何使用它？通过`HTTPS`，JSON-RPC请求是`POST`请求，其中包括用于读取和写入数据的特定函数，例如用于以只读方式执行智能合约功能的`eth_call`或用于将签名交易提交到的网络`eth_sendRawTransaction`（为改变区块链状态的调用）。整个JSON请求结构将始终具有类似于以下的结构：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_getBalance",
  "params": ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac", "latest"]
}
```

此范例为使用`0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`账户的余额（在Moonbase Alpha中为DEV）。让我们解析其中的元素：

- `jsonrpc` — JSON-RPC APR版本，通常为“2.0”
- `id` — 用于定义请求回应的常数值，通常可以保持为
- `method` — 特定从/至区块链读/写数据的函数。您可以在[我们的文档网站查看许多不同的RPC函数](/builders/get-started/eth-compare/rpc-support){target=_blank}
- `params` — 根据特定`method`的输入参数阵列

事实上还有其他额外的元素会被加入至JSON-RPC请求中，但这四个最为常见。

在当前，这些JSON-RPC请求非常有用，但是在编写代码时，一遍又一遍地创建JSON对象可能会很麻烦。这就是为什么存在有助于抽象和促进这些请求的使用的库。Moonbeam提供了[许多库的文档](/builders/build/eth-api/libraries){target=_blank}，我们将在本教程中使用[Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}。您仅需要了解，每当我们通过Ethers.js包与区块链交互时，我们实际上是在使用 JSON-RPC！

## 智能合约 {: #smart-contracts }

智能合约是自动执行的合约，协议条款将会直接被写入代码中。它们充当任何DApp的去中心化后端，自动化并强制执行系统内的商业逻辑。

如果您来自传统的Web开发背景，智能合约的用意旨在取代后端，但需要注意的是：用户必须拥有原生Token（GLMR、MOVR、DEV等）才能发出状态更改请求，存储信息可能会很昂贵，并且**存储的信息均不为仅自己可见**。

当您将智能合约部署到Moonbeam上时，您会上传一系列EVM或以太坊虚拟机可以理解的指令。每当有人与智能合约交互时，EVM都会执行这些透明、防篡改且不可变的指令来更改区块链的状态。在智能合约中正确编写指令非常重要，因为区块链的状态定义了有关DApp的最关键信息，例如谁拥有多少资金金额。

由于指令在低（组合）级别上很难编写和理解，因此我们使用Solidity等智能合约语言来简化它们的编写。为了帮助编写、调试、测试和编译这些智能合约语言，以太坊社区的开发者创建了开发者环境，例如[Hardhat](/builders/build/eth-api/dev-env/hardhat){target=_blank}和[Foundry](/builders/build/eth-api/dev-env/foundry){target=_blank}。Moonbeam的开发者网站提供了有关[大量开发者环境](/builders/build/eth-api/dev-env){target=_blank}的信息。

本教程将会使用Hardhat管理智能合约。

### 创建一个Hardhat项目 {: #create-hardhat-project }

您可以使用以下指令在Hardhat上发起项目：

```bash
npx hardhat init
```

创建JavaScript或TypeScript Hardhat项目时，系统会询问您是否要安装示例项目的依赖项，即为安装Hardhat和[Hardhat Toolbox插件](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox#hardhat-toolbox){target=_blank}。您不需要工具箱中包含的所有插件，因此您可以安装Hardhat、Ethers和Hardhat Ethers插件，这就是本教程所需的全部内容：

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-ethers ethers
```

在我们开始编写智能合约之前，让我们先将JSON-RPC URL添加至配置之中，我们可以使用以下代码设置`hardhat.config.js`文件，并将`YOUR_PRIVATE_KEY`取代为您具有资金账户的私钥。

!!! 注意事项
    这仅用于测试目的，**请勿将您具有真实资金的账户私钥以文字的方式储存**。

```javascript
require('@nomicfoundation/hardhat-ethers');
module.exports = {
  solidity: '0.8.17',
  networks: {
    moonbase: {
      url: '{{ networks.moonbase.rpc_url }}',
      chainId: {{ networks.moonbase.chain_id }},
      accounts: ['YOUR_PRIVATE_KEY']
    }
  }
};
```

### 编写智能合约 {: #write-smart-contracts }

本教程的目的是在创建一个允许您以一个价格铸造Token的DApp，让我们在这部分编写关于此功能的智能合约！

当您已经发起一个Hardhat项目，您将能够在其`contracts`文件夹编写智能合约。其文件夹中拥有一个初始的智能合约，被称为`Lock.sol`，但您需要删除它并添加一个被称为`MintableERC20.sol`的智能文件。

Token的标准称为ERC-20，其中ERC代表“*以太坊请求评论*”。很久以前，这个标准就被定义了，现在大多数与Token配合使用的智能合约都期望Token具有ERC-20定义的所有功能。幸运的是，您不必凭记忆知道它，因为OpenZeppelin智能合约团队为我们提供了可供使用的智能合约基础。

安装[OpenZeppelin智能合约](https://docs.openzeppelin.com/contracts/4.x/){target=_blank}：

```bash
npm install @openzeppelin/contracts
```

现在，在您的`MintableERC20.sol`中添加以下代码：

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintableERC20 is ERC20, Ownable {
    constructor() ERC20("Mintable ERC 20", "MERC") {}
}
```

在编写智能合约时，您最终需要将他们进行编译。任何针对智能合约的开发环境皆有这个功能，在Hardhat中，您可以使用以下代码编译：

```bash
npx hardhat compile
```

在此应当能够顺利编译，将会由两个新的文件夹出现，分别为`artifacts`和`cache`。这两个文件夹存储了编译智能合约的信息。

让我们继续添加功能。您可以将以下常数、错误、事件和功能添加至您的Solidity文件：

```solidity
    uint256 public constant MAX_TO_MINT = 1000 ether;

    event PurchaseOccurred(address minter, uint256 amount);
    error MustMintOverZero();
    error MintRequestOverMax();
    error FailedToSendEtherToOwner();

    /**Purchases some of the token with native currency. */
    function purchaseMint() payable external {
        // Calculate amount to mint
        uint256 amountToMint = msg.value;

        // Check for no errors
        if(amountToMint == 0) revert MustMintOverZero();
        if(amountToMint + totalSupply() > MAX_TO_MINT) revert MintRequestOverMax();

        // Send to owner
        (bool success, ) = owner().call{value: msg.value}("");
        if(!success) revert FailedToSendEtherToOwner();

        // Mint to user
        _mint(msg.sender, amountToMint);
        emit PurchaseOccurred(msg.sender, amountToMint);
    }
```

??? code "MintableERC20.sol文档"

    ```solidity
    // SPDX-License-Identifier: UNLICENSED
    pragma solidity ^0.8.17;

    import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";
    
    contract MintableERC20 is ERC20, Ownable {
        constructor() ERC20("Mintable ERC 20", "MERC") {}
    
        uint256 public constant MAX_TO_MINT = 1000 ether;
    
        event PurchaseOccurred(address minter, uint256 amount);
        error MustMintOverZero();
        error MintRequestOverMax();
        error FailedToSendEtherToOwner();
    
        /**Purchases some of the token with native gas currency. */
        function purchaseMint() external payable {
            // Calculate amount to mint
            uint256 amountToMint = msg.value;
    
            // Check for no errors
            if (amountToMint == 0) revert MustMintOverZero();
            if (amountToMint + totalSupply() > MAX_TO_MINT)
                revert MintRequestOverMax();
    
            // Send to owner
            (bool success, ) = owner().call{value: msg.value}("");
            if (!success) revert FailedToSendEtherToOwner();
    
            // Mint to user
            _mint(msg.sender, amountToMint);
            emit PurchaseOccurred(msg.sender, amountToMint);
        }
    }
    ```

此函数将允许用户传送原生Moonbeam currency（如GLMR、MOVR或DEV）作为价值，因为其为可支付函数。让我们根据不同部分解析此函数。

1. 这将会根据传送的价值返还该铸造多少Token
2. 接着它会检查铸造数量是否为0或是总铸造数量是否超过`MAX_TO_MINT`，并在两种情况中回传错误描述
3. 合约接着会传送函数调用包含其中的数据至合约的所有者（默认为部署合约的地址，也就是您）
4. 最后，Token将会铸造给用户，一个事件将会在其后发起

为确保所有流程顺利，让我们再次使用Hardhat：

```bash
npx hardhat compile
```

您现在已经完成您DApp的智能合约！如果这是一个生产应用，我们将会为其编写测试，但这并不包含在本教程的范围中。让我们接着进行部署。

### 部署智能合约 {: #deploying-smart-contracts }

从本质上讲，Harhat是一个Node项目，它使用[Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}库与区块链进行交互。您还可以将Ethers.js与Hardhat的工具结合使用来创建脚本执行部署合约等操作。

您的Hardhat项目应当在文件夹中包含`scripts`脚本，被称为`deploy.js`。让我们以一个更加简单的脚本取代他。

```javascript
const hre = require('hardhat');

async function main() {
  const MintableERC20 = await hre.ethers.getContractFactory('MintableERC20');
  const token = await MintableERC20.deploy();
  await token.deployed();

  console.log(`Deployed to ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

该脚本使用Hardhat的Ethers库实例来获取我们之前编写的`MintableERC20.sol`智能合约的合约工厂。然后部署它并打印生成的智能合约的地址。使用Hardhat和Ethers.js库非常简单，但仅使用JSON-RPC就困难得多！

让我们在Moonbase Alpha上运行合约（其JSON-RPC端点先前在`hardhat.config.js`脚本中定义）：

```bash
npx hardhat run scripts/deploy.js --network moonbase
```

您应当能见到展示Token地址的输出，确保您将其**保存下来用于之后的教程中**！

!!! 挑战
    Hardhat的内置智能合约部署解决方案并不优秀，它不会自动保存与部署相关的交易和地址！这就是创建[hardhat-deploy](https://www.npmjs.com/package/hardhat-deploy#1-hardhat-deploy){target=_blank}包的原因。您能自己实现吗？或者您可以切换到不同的开发环境，例如[Foundry](https://github.com/foundry-rs/foundry){target=_blank}？

## 创建一个DApp前端 {: #creating-a-dapp-frontend }

前端为用户提供与基于区块链应用交互的界面。 React是一种用于构建用户界面的流行JavaScript库，由于其基于组件的架构，可促进可重用代码和高效渲染，因此通常用于开发DApp前端。 [useDApp包](https://usedapp.io/){target=_blank}是一个为DApp设计基于Ethers.js的React框架，通过提供一套全面的钩子和组件来简化构建DApp前端的过程以及以太坊区块链功能的集成。

!!! 注意事项
    一般来说，一个大型项目需要为他们的前端和智能合约在GitHub创建单独的库，但有些小型项目能够创建一个monorepo。

### 通过useDapp创建一个React项目 {: #create-react-project-with-usedapp }

让我们设置一个新的React项目并安装依赖项，这可以在没有问题的情况下在我们的Hardhat项目中创建。`create-react-app`包将会为我们创建新的`frontend`目录：

```bash
npx create-react-app frontend
cd frontend
npm install ethers@5.6.9 @usedapp/core @mui/material @mui/system @emotion/react @emotion/styled
```

如果您还记得的话，[Ethers.js](/builders/build/eth-api/libraries/ethersjs/){target=_blank}是一个协助JSON-RPC通信的库。useDApp包是一个类似的库，它使用Ethers.js并将其格式化为React hooks，以便它们在前端项目中更好地工作。我们还添加了两个用于样式和组件的[MUI](https://mui.com/){target=_blank}包。

接下来，让我们设置位于`frontend/src`目录中的`App.js`文件以添加一些视觉结构：

```javascript
import { useEthers } from '@usedapp/core';
import { Button, Grid, Card } from '@mui/material';
import { Box } from '@mui/system';

const styles = {
  box: { minHeight: '100vh', backgroundColor: '#1b3864' },
  vh100: { minHeight: '100vh' },
  card: { borderRadius: 4, padding: 4, maxWidth: '550px', width: '100%' },
  alignCenter: { textAlign: 'center' },
};

function App() {
  return (
    <Box sx={styles.box}>
      <Grid
        container
        direction='column'
        alignItems='center'
        justifyContent='center'
        style={styles.vh100}
      >
        {/* This is where we'll be putting our functional components! */}
      </Grid>
    </Box>
  );
}

export default App;
```

您可以通过在`frontend`库中运行以下指令开始React项目：

```bash
npm run start
```

!!! 注意事项
    此时，您可能会看到几个编译警告，但随着我们继续构建DApp，我们将进行更改以解决这些警告。

您的前端将在[localhost:3000](http://localhost:3000){target=_blank}上可用。

至此，我们的前端项目已经设置得足够好，可以开始处理功能代码了！

### 提供者、签名者和钱包 {: #providers-signers-and-wallets }

前端使用JSON-RPC与区块链通信，但我们将使用Ethers.js。当使用JSON-RPC时，Ethers.js喜欢将与区块链的交互程度抽象为对象，例如提供者、签名者和钱包。

提供者是前端用户界面和区块链网络之间的桥梁，促进通信和数据交换。它们抽象了与区块链交互的复杂性，提供了一个简单的API供前端使用。它们负责将DApp连接到特定的区块链节点，允许其从区块链读取数据，并且本质上包含JSON-RPC URL。

签名者是一种提供者，包含可用于签署交易的秘密。这允许前端创建交易，对其进行签名，然后使用`eth_sendRawTransaction`发送它们。签名者有多种类型，但我们最感兴趣的是钱包对象，它安全地存储和管理用户的私钥和数字资产。MetaMask等钱包通过通用且用户友好的流程促进交易签名。它们充当DApp中用户的代表，确保仅执行授权的交易。Ethers.js钱包对象代表我们前端代码中的此接口。

通常，使用Ethers.js的前端将要求您创建一个提供者，连接到用户的钱包（如适用），并创建一个钱包对象。在较大的项目中，这个过程可能会变得难以处理，尤其是在MetaMask之外还存在大量钱包的情况下。

??? code "MetaMask难以处理的示例"

    ```javascript
    // Detect if the browser has MetaMask installed
    let provider, signer;
    if (typeof window.ethereum !== 'undefined') {
      // Create a provider using MetaMask
      provider = new ethers.providers.Web3Provider(window.ethereum);
    
      // Connect to MetaMask
      async function connectToMetaMask() {
        try {
          // Request access to the user's MetaMask account
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
    
          // Create a signer (wallet) using the provider
          signer = provider.getSigner(accounts[0]);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      }
    
      // Call the function to connect to MetaMask
      connectToMetaMask();
    } else {
      console.log('MetaMask is not installed');
    }
    
    // ... also the code for disconnecting from the site
    // ... also the code that handles other wallets
    ```

幸运的是，我们安装了useDApp包，这为我们简化了许多流程。这同时也抽象了以太坊正在做的事情，这就是为什么我们在这里花了一些时间来解释它们。

#### 创建一个提供者 {: #create-provider }

让我们对useDApp包进行一些设置。首先，在React前端的`index.js`文件（位于`frontend/src`目录中）中，添加一个`DAppProvider`对象及其配置。这本质上充当Ethers.js提供程序对象，但可以通过useDApp hook在整个项目中使用：

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DAppProvider, MoonbaseAlpha } from '@usedapp/core';
import { getDefaultProvider } from 'ethers';

const config = {
  readOnlyChainId: MoonbaseAlpha.chainId,
  readOnlyUrls: {
    [MoonbaseAlpha.chainId]: getDefaultProvider(
      '{{ networks.moonbase.rpc_url }}'
    ),
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>
);
```

#### 连接至钱包 {: #connect-to-a-wallet }

现在，在您的`App.js`文件中，添加一个允许我们连接到MetaMask的按钮。幸运的是，我们不必编写任何特定于钱包的代码，因为useDApp通过`useEthers` hook为我们完成了这件事。

```javascript
function App() {
  const { activateBrowserWallet, deactivate, account } = useEthers();

  // Handle the wallet toggle
  const handleWalletConnection = () => {
    if (account) deactivate();
    else activateBrowserWallet();
  };

  return (
    <Box sx={styles.box}>
      <Grid
        container
        direction='column'
        alignItems='center'
        justifyContent='center'
        style={styles.vh100}
      >
        <Box position='absolute' top={8} right={16}>
          <Button variant='contained' onClick={handleWalletConnection}>
            {account
              ? `Disconnect ${account.substring(0, 5)}...`
              : 'Connect Wallet'}
          </Button>
        </Box>
      </Grid>
    </Box>
  );
};
```

现在屏幕右上角应该有一个按钮将您的钱包连接到您的前端！接下来，让我们了解如何从智能合约中读取数据。

### 从智能合约中读取数据 {: #reading-from-contracts }

只要我们知道我们想要读取什么，读取合约非常容易。对于我们的应用，我们将读取可以铸造的最大Token数量以及已铸造的Token数量。通过这种方式，我们可以向用户显示仍然可以铸造多少Token，并希望引起一些FOMO的注意……

如果您只是使用JSON-RPC，您可以使用`eth_call`来获取此数据，但这样做非常困难，因为您必须[对您的请求进行编码](https://docs.soliditylang.org/en/latest/abi-spec.html){target=_blank}采用称为ABI编码的非直接方法。幸运的是，Ethers.js允许我们轻松创建以人类可读的方式表示合约的对象，只要我们拥有合约的ABI。我们在Hardhat项目的`artifacts`目录中拥有`MintableERC20.sol`合约的ABI、`MintableERC20.json`！

因此，让我们首先将`MintableERC20.json`文件移动到我们的前端目录中。每次更改并重新编译智能合约时，您还必须更新前端中的ABI。有些项目的开发者设置会自动从同一源提取ABI，但在这种情况下，我们只需将其复制过来：

```text
|--artifacts
    |--@openzeppelin
    |--build-info
    |--contracts
        |--MintableERC20.sol
            |--MintableERC20.json // This is the file you're looking for!
            ...
|--cache
|--contracts
|--frontend
    |--public
    |--src
        |--MintableERC20.json // Copy the file to here!
        ...
    ...
...
```

现在我们有了ABI，我们可以使用它来创建`MintableERC20.sol`的合约实例，我们将用它来检索Token数据。

#### 创建一个智能合约实例 {: #create-a-contract-instance }

让我们在`App.js`中导入JSON文件和Ethers `Contract`对象。我们可以使用地址和ABI创建一个合约对象实例，因此将`YOUR_CONTRACT_ADDRESS_HERE`替换为您[部署时](#deploying-smart-contracts)复制的合约地址：

```javascript
// ... other imports
import MintableERC20 from './MintableERC20.json'; 
import { Contract } from 'ethers';

const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';

function App() {
  const contract = new Contract(contractAddress, MintableERC20.abi);
  // ...
}
```

??? code "App.js文档"

    ```js
    import { useEthers } from '@usedapp/core';
    import { Button, Grid, Card } from '@mui/material';
    import { Box } from '@mui/system';
    import { Contract } from 'ethers';
    import MintableERC20 from './MintableERC20.json'; 
    
    const styles = {
      box: { minHeight: '100vh', backgroundColor: '#1b3864' },
      vh100: { minHeight: '100vh' },
      card: { borderRadius: 4, padding: 4, maxWidth: '550px', width: '100%' },
      alignCenter: { textAlign: 'center' },
    };
    
    const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';
    
    function App() {
      const contract = new Contract(contractAddress, MintableERC20.abi);
      const { activateBrowserWallet, deactivate, account } = useEthers();
    
      // Handle the wallet toggle
      const handleWalletConnection = () => {
        if (account) deactivate();
        else activateBrowserWallet();
      };
    
      return (
        <Box sx={styles.box}>
          <Grid
            container
            direction='column'
            alignItems='center'
            justifyContent='center'
            style={styles.vh100}
          >
            <Box position='absolute' top={8} right={16}>
              <Button variant='contained' onClick={handleWalletConnection}>
                {account
                  ? `Disconnect ${account.substring(0, 5)}...`
                  : 'Connect Wallet'}
              </Button>
            </Box>
          </Grid>
        </Box>
      );
    }
    
    export default App;
    ```

#### 与合约接口交互以读取供应数据 {: #interact-with-contract-interface }

让我们在新的`SupplyComponent.js`文件中创建一个新的`SupplyComponent`，它将使用合约接口来检索Token供应数据并显示它：

```javascript
import { useCall } from '@usedapp/core';
import { utils } from 'ethers';
import { Grid } from '@mui/material';

export default function SupplyComponent({ contract }) {
  const totalSupply = useCall({ contract, method: 'totalSupply', args: [] });
  const maxSupply = useCall({ contract, method: 'MAX_TO_MINT', args: [] });
  const totalSupplyFormatted = totalSupply
    ? utils.formatEther(totalSupply.value.toString())
    : '...';
  const maxSupplyFormatted = maxSupply
    ? utils.formatEther(maxSupply.value.toString())
    : '...';

  const centeredText = { textAlign: 'center' };

  return (
    <Grid item xs={12}>
      <h3 style={centeredText}>
        Total Supply: {totalSupplyFormatted} / {maxSupplyFormatted}
      </h3>
    </Grid>
  );
}
```

请注意，该组件使用useDApp包提供的`useCall` hook。此调用接受我们之前创建的合约对象、字符串函数以及只读调用的任何相关参数，并返回输出。虽然它需要一些设置，但这一行比我们在不使用Ethers.js和useDApp时必须执行的整个`use_call` RPC调用要简单得多。

另外请注意，我们使用名为`formatEther`的实用程序格式来格式化输出值，而不是直接显示它们。这是因为我们的Token和Gas货币一样，存储为无符号整数，小数点固定为18位。实用函数有助于将该值格式化为我们所期望的方式。

现在我们可以为我们的前端增添趣味并调用合约中的只读函数。我们将更新前端，以便我们有地方显示我们的供应数据：

```javascript
// ... other imports
import SupplyComponent from './SupplyComponent';

function App() {
  // ...

  return (
    {/* Wrapper Components */}
      {/* Button Component */}
      <Card sx={styles.card}>
        <h1 style={styles.alignCenter}>Mint Your Token!</h1>
        <SupplyComponent contract={contract} />
      </Card>
    {/* Wrapper Components */}
  )
}
```

??? code "App.js文档"

    ```javascript
    import { useEthers } from '@usedapp/core';
    import { Button, Grid, Card } from '@mui/material';
    import { Box } from '@mui/system';
    import { Contract } from 'ethers';
    import MintableERC20 from './MintableERC20.json'; 
    import SupplyComponent from './SupplyComponent';
    
    const styles = {
      box: { minHeight: '100vh', backgroundColor: '#1b3864' },
      vh100: { minHeight: '100vh' },
      card: { borderRadius: 4, padding: 4, maxWidth: '550px', width: '100%' },
      alignCenter: { textAlign: 'center' },
    };
    const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';
    
    function App() {
      const { activateBrowserWallet, deactivate, account } = useEthers();
      const contract = new Contract(contractAddress, MintableERC20.abi);
    
      // Handle the wallet toggle
      const handleWalletConnection = () => {
        if (account) deactivate();
        else activateBrowserWallet();
      };
    
      return (
        <Box sx={styles.box}>
          <Grid
            container
            direction='column'
            alignItems='center'
            justifyContent='center'
            style={styles.vh100}
          >
            <Box position='absolute' top={8} right={16}>
              <Button variant='contained' onClick={handleWalletConnection}>
                {account
                  ? `Disconnect ${account.substring(0, 5)}...`
                  : 'Connect Wallet'}
              </Button>
            </Box>
            <Card sx={styles.card}>
              <h1 style={styles.alignCenter}>Mint Your Token!</h1>
              <SupplyComponent contract={contract} />
            </Card>
          </Grid>
        </Box>
      );
    }
    
    export default App;
    ```

我们的前端现在显示正确数据！

![Displaying data](/images/tutorials/eth-api/how-to-build-a-dapp/how-to-build-a-dapp-3.png)

!!! 挑战
    有一些附加信息可能有助于显示，例如连接账户当前拥有的Token数量：`balanceOf(address)`。您可以自己将其添加到前端吗？

### 传送交易 {: #sending-transactions }

现在是所有DApp中最重要的部分：状态更改交易。这是资金流动、Token铸造和价值传递的地方。  

如果您回想我们的智能合约，我们希望通过调用`purchaseMint`函数使用一些原生货币铸造一些Token。所以我们需要：

1. 让用户指定输入多少数值的文本输入
2. 让用户发起交易签名的按钮

让我们在名为`MintingComponent.js`的新文件中创建一个名为`MintingComponent`的新组件。首先，我们将处理文本输入，这将要求我们添加逻辑来存储要铸造的Token数量和文本字段元素。

```javascript
import { useState } from 'react';
import { useContractFunction, useEthers } from '@usedapp/core';
import { Button, CircularProgress, TextField, Grid } from '@mui/material';
import { utils } from 'ethers';

export default function MintingComponent({ contract }) {
  const [value, setValue] = useState(0);
  const textFieldStyle = { marginBottom: '16px' };

  return (
    <>
      <Grid item xs={12}>
        <TextField 
          type='number'
          onChange={(e) => setValue(e.target.value)}
          label='Enter value in DEV'
          variant='outlined'
          fullWidth
          style={textFieldStyle} 
        />
      </Grid>
      {/* This is where we'll add the button */}
    </>
  );
}
```

接着，我们需要创建发送交易的按钮，该按钮将调用合约的`purchaseMint`。与合约交互会有点困难，因为您可能不太熟悉它。我们已经在前面的部分中完成了很多设置，因此实际上不需要太多代码：

```javascript
export default function MintingComponent({ contract }) {
  // ...

  // Mint transaction
  const { account } = useEthers();
  const { state, send } = useContractFunction(contract, 'purchaseMint');
  const handlePurchaseMint = async () => {
    if (chainId !== MoonbaseAlpha.chainId) {
      await switchNetwork(MoonbaseAlpha.chainId);
    }
    send({ value: utils.parseEther(value.toString()) });
  };
  const isMining = state?.status === 'Mining';

  return (
    <>
      {/* ... */}
      <Grid item xs={12}>
        <Button
          variant='contained' color='primary' fullWidth
          onClick={handlePurchaseMint}
          disabled={state.status === 'Mining' || account == null}
        >
          {isMining? <CircularProgress size={24} /> : 'Purchase Mint'}
        </Button>
      </Grid>
    </>
  );
}
```

??? code "MintingComponent.js文档"

    ```js
    import { useState } from 'react';
    import { useContractFunction, useEthers } from '@usedapp/core';
    import { Button, CircularProgress, TextField, Grid } from '@mui/material';
    import { utils } from 'ethers';
    
    export default function MintingComponent({ contract }) {
      const [value, setValue] = useState(0);
      const textFieldStyle = { marginBottom: '16px' };
    
      const { account } = useEthers();
      const { state, send } = useContractFunction(contract, 'purchaseMint');
      const handlePurchaseMint = async () => {
        if (chainId !== MoonbaseAlpha.chainId) {
          await switchNetwork(MoonbaseAlpha.chainId);
        }
        send({ value: utils.parseEther(value.toString()) });
      };
      const isMining = state?.status === 'Mining';
    
      return (
        <>
          <Grid item xs={12}>
            <TextField 
              type='number'
              onChange={(e) => setValue(e.target.value)}
              label='Enter value in DEV'
              variant='outlined'
              fullWidth
              style={textFieldStyle} 
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant='contained' color='primary' fullWidth
              onClick={handlePurchaseMint}
              disabled={state.status === 'Mining' || account == null}
            >
              {isMining? <CircularProgress size={24} /> : 'Purchase Mint'}
            </Button>
          </Grid>
        </>
      );
    }
    ```

让我们来解析这些non-JSX代码：

1. 用户的账户信息是通过`useEthers`检索的，这是可以完成的，因为useDApp在整个项目中提供了此信息
2. useDApp中的`useContractFunction` hook用于创建一个函数`send`，它将签署并发送一个交易，该交易调用由`contract`对象定义的合约上的`purchaseMint`函数
3. 另一个函数`handlePurchaseMint`被定义来帮助将`TextField`组件定义的原生Gas值注入到`send`函数中。它首先检查用户的钱包是否连接到Moonbase Alpha，如果没有，它会提示用户切换网络
4. 辅助常数将确定交易是否仍处于`Mining`阶段，即尚未完成

现在让我们看看视觉组件。该按钮将在按下时调用`handlePurchaseMint`，这是有道理的。当交易发生时，如果用户未使用钱包连接到DApp（未定义账户价值时），该按钮也将被禁用。

这段代码本质上可以归结为将`useContractFunction` hook与`contract`对象结合使用，这比它在底层的作用要简单得多！让我们将此组件添加到主`App.js`文件中。

```javascript
// ... other imports
import MintingComponent from './MintingComponent';

function App() {
  // ...

  return (
    {/* Wrapper Components */}
      {/* Button Component */}
      <Card sx={styles.card}>
        <h1 style={styles.alignCenter}>Mint Your Token!</h1>
        <SupplyComponent contract={contract} />
        <MintingComponent contract={contract} />
      </Card>
    {/* Wrapper Components */}
  )
}
```

??? code "App.js文档"

    ```javascript
    import { useEthers } from '@usedapp/core';
    import { Button, Grid, Card } from '@mui/material';
    import { Box } from '@mui/system';
    import { Contract } from 'ethers';
    import MintableERC20 from './MintableERC20.json'; 
    import SupplyComponent from './SupplyComponent';
    import MintingComponent from './MintingComponent';
    
    const styles = {
      box: { minHeight: '100vh', backgroundColor: '#1b3864' },
      vh100: { minHeight: '100vh' },
      card: { borderRadius: 4, padding: 4, maxWidth: '550px', width: '100%' },
      alignCenter: { textAlign: 'center' },
    };
    const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';
    
    function App() {
      const { activateBrowserWallet, deactivate, account } = useEthers();
      const contract = new Contract(contractAddress, MintableERC20.abi);
    
      // Handle the wallet toggle
      const handleWalletConnection = () => {
        if (account) deactivate();
        else activateBrowserWallet();
      };
    
      return (
        <Box sx={styles.box}>
          <Grid
            container
            direction='column'
            alignItems='center'
            justifyContent='center'
            style={styles.vh100}
          >
            <Box position='absolute' top={8} right={16}>
              <Button variant='contained' onClick={handleWalletConnection}>
                {account
                  ? `Disconnect ${account.substring(0, 5)}...`
                  : 'Connect Wallet'}
              </Button>
            </Box>
            <Card sx={styles.card}>
              <h1 style={styles.alignCenter}>Mint Your Token!</h1>
              <SupplyComponent contract={contract} />
              <MintingComponent contract={contract} />
            </Card>
          </Grid>
        </Box>
      );
    }
    
    export default App;
    ```

![DApp with the Minting section](/images/tutorials/eth-api/how-to-build-a-dapp/how-to-build-a-dapp-4.png)  

如果您尝试输入**0.1**的数值并按下按钮，则会出现MetaMask提示。

### 合约中的读取事件 {: #reading-events-from-contracts }

了解交易中发生的情况的一种常见方法是通过事件（也称为日志）。这些日志由智能合约通过`emit`和`event`关键字发出，在响应式前端中非常重要。通常DApp会使用toast元素来实时表示事件，但对于这个DApp，我们将使用一个简单的表格。

我们在智能合约中创建了一个事件： `event PurchaseOccurred(address minter, uint256 amount)`，所以让我们弄清楚如何在前端显示其信息。

让我们在新文件`PurchaseOccurredEvents.js`中创建一个新组件`PurchaseOccurredEvents`，用于读取最后五个日志并将其显示在表格中：

```javascript
import { useLogs, useBlockNumber } from '@usedapp/core';
import { utils } from 'ethers';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export default function PurchaseOccurredEvents({ contract }) {
  return (
    <Grid item xs={12} marginTop={5}>
      <TableContainer >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Minter</TableCell>
              <TableCell align='right'>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* This is where we have to inject data from our logs! */}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
```

此组件目前用于创建一个空表格，让我们使用两个新的hook来读取这些日志：

```javascript
export default function PurchaseOccurredEvents({ contract }) {
  // Get block number to ensure that the useLogs doesn't search from 0, otherwise it will time out
  const blockNumber = useBlockNumber();

  // Create a filter & get the logs
  const filter = { args: [null, null], contract, event: 'PurchaseOccurred' };
  const logs = useLogs(filter, { fromBlock: blockNumber - 10000 });
  const parsedLogs = logs?.value.slice(-5).map(log => log.data);

  // ... 
}
```

以下为代码中发生的事情：

1. 区块编码是从`useBlockNumber` hook接收的，类似于使用JSON-RPC函数`eth_blockNumber`
2. 创建一个过滤器来过滤所有事件，其中合约上的任何参数都被注入到事件名称为`PurchaseOccurred`的组件中
3. 通过`useLogs` hook查询日志，类似于使用`eth_getLogs`JSON-RPC函数。请注意，我们只查询最后10,000个区块，否则将查询区块链的整个历史记录，并且RPC将超时
4. 解析生成的日志，并选择最近的五个

如果我们希望展现他们，我们可以进行以下操作：

```javascript
export default function PurchaseOccurredEvents({ contract }) {
  // ...
  return (
    <Grid item xs={12} marginTop={5}>
      <TableContainer >
        <Table>
          {/* TableHead Component */}
          <TableBody>
            {parsedLogs?.reverse().map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.minter}</TableCell>
                <TableCell align='right'>
                  {utils.formatEther(log.amount)} tokens
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
```

??? code "PurchaseOccurredEvents.js文档"

    ```js
    import { useLogs, useBlockNumber } from '@usedapp/core';
    import { utils } from 'ethers';
    import {
      Grid,
      Table,
      TableBody,
      TableCell,
      TableContainer,
      TableHead,
      TableRow,
    } from '@mui/material';
    
    export default function PurchaseOccurredEvents({ contract }) {
      // Get block number to ensure that the useLogs doesn't search from 0, otherwise it will time out
      const blockNumber = useBlockNumber();
    
      // Create a filter & get the logs
      const filter = { args: [null, null], contract, event: 'PurchaseOccurred' };
      const logs = useLogs(filter, { fromBlock: blockNumber - 10000 });
      const parsedLogs = logs?.value.slice(-5).map((log) => log.data);
      return (
        <Grid item xs={12} marginTop={5}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Minter</TableCell>
                  <TableCell align='right'>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedLogs?.reverse().map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log.minter}</TableCell>
                    <TableCell align='right'>
                      {utils.formatEther(log.amount)} tokens
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      );
    }
    ```

这同样会被添加至`App.js`。

```javascript
// ... other imports
import PurchaseOccurredEvents from './PurchaseOccurredEvents';

function App() {
  // ...

  return (
    {/* Wrapper Components */}
      {/* Button Component */}
      <Card sx={styles.card}>
        <h1 style={styles.alignCenter}>Mint Your Token!</h1>
        <SupplyComponent contract={contract} />
        <MintingComponent contract={contract} />
        <PurchaseOccurredEvents contract={contract} />
      </Card>
    {/* Wrapper Components */}
  )
}
```

??? code "App.js文档"

    ```js
    import { useEthers } from '@usedapp/core';
    import { Button, Grid, Card } from '@mui/material';
    import { Box } from '@mui/system';
    import { Contract } from 'ethers';
    import MintableERC20 from './MintableERC20.json'; 
    import SupplyComponent from './SupplyComponent';
    import MintingComponent from './MintingComponent';
    import PurchaseOccurredEvents from './PurchaseOccurredEvents';
    
    const styles = {
      box: { minHeight: '100vh', backgroundColor: '#1b3864' },
      vh100: { minHeight: '100vh' },
      card: { borderRadius: 4, padding: 4, maxWidth: '550px', width: '100%' },
      alignCenter: { textAlign: 'center' },
    };
    const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';
    
    function App() {
      const { activateBrowserWallet, deactivate, account } = useEthers();
      const contract = new Contract(contractAddress, MintableERC20.abi);
    
      // Handle the wallet toggle
      const handleWalletConnection = () => {
        if (account) deactivate();
        else activateBrowserWallet();
      };
    
      return (
        <Box sx={styles.box}>
          <Grid
            container
            direction='column'
            alignItems='center'
            justifyContent='center'
            style={styles.vh100}
          >
            <Box position='absolute' top={8} right={16}>
              <Button variant='contained' onClick={handleWalletConnection}>
                {account
                  ? `Disconnect ${account.substring(0, 5)}...`
                  : 'Connect Wallet'}
              </Button>
            </Box>
            <Card sx={styles.card}>
              <h1 style={styles.alignCenter}>Mint Your Token!</h1>
              <SupplyComponent contract={contract} />
              <MintingComponent contract={contract} />
              <PurchaseOccurredEvents contract={contract} />
            </Card>
          </Grid>
        </Box>
      );
    }
    
    export default App;
    ```

同时，如果您已完成了任何交易，您将会看见他们的弹窗！

![Finished DApp](/images/tutorials/eth-api/how-to-build-a-dapp/how-to-build-a-dapp-5.png)

现在您已经实现了DApp前端的三个主要组件：从存储中读取、发送交易和读取日志。有了这些构建模块以及您通过智能合约和节点获得的知识，您应该能够覆盖80%的DApp。

您可以在[GitHub上查看完整的范例DApp](https://github.com/jboetticher/complete-example-dapp){target=_blank}。

## 结论 {: #conclusion }

在本教程中，我们涵盖了完成DApp开发所必需的广泛主题和工具。我们从Hardhat开始，这是一个强大的开发环境，可以简化编写、测试和部署智能合约的过程。Ethers.js是一个与以太坊节点交互的流行库，被引入来管理钱包和交易。

我们深入研究了智能合约的编写过程，重点介绍了开发链上逻辑时的最佳实践和关键考虑因素。此教程随后探讨了useDApp，这是一个基于React的框架，用于创建用户友善的前端。我们讨论了从合约读取数据、执行交易和处理日志的技术，以确保无缝的用户体验。

当然，有更多进阶但不一定必要的DApp组件在教程中出现：

- 去中心化存储协议 — 以去中心化模式存储网站和文件的系统
- [预言机](/builders/integrations/oracles/){target=_blank} — 在区块链中为智能合约提供外部数据的第三方服务
- [检索协议](/builders/integrations/indexers/){target=_blank} — 用于处理和组织区块链数据的中间件，允许进行有效率的检索

如果您有兴趣深入了解从Web2到Web3的内容，您可以阅读关于[Web2与Web3开发的不同之处](https://moonbeam.network/blog/web2-vs-web3-development-heres-what-you-need-to-know-to-make-the-leap-to-blockchain/){target=_blank}的博客文章。

希望通过阅读本指南，您能够顺利在Moonbeam上创建新颖的DApp！

--8<-- 'text/disclaimers/educational-tutorial.md'

--8<-- 'text/disclaimers/third-party-content.md'
