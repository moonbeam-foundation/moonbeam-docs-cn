---
title: 如何使用thirdweb
description: 本教程将向您展示thirdweb的一些功能，可用于开发和部署智能合约，并在Moonbeam上的DApp中与其交互。
---

# 在Moonbeam上使用thirdweb

![thirdweb banner](/images/builders/build/eth-api/dev-env/thirdweb/thirdweb-banner.png)

## 概览 {: #introduction }

[thirdweb](https://thirdweb.com/){target=_blank}是一个完整的Web3开发框架，提供开发智能合约、构建DApp等所需要的一切。

通过thirdweb，您可以访问帮助您完成DApp开发周期的每个阶段的工具。您可以创建自定义智能合约或使用thirdweb预先构建的合约快速开始操作。在这里，您可以使用thirdweb的CLI部署智能合约。然后，您可以使用选择的语言（包括但不限于React、TypeScript和Python）创建Web3应用程序并与智能合约交互。

本教程将向您展示thirdweb的一些功能，可在Moonbeam上开发智能合约和DApp。查看thirdweb的所有功能，请参考[thirdweb文档网站](https://portal.thirdweb.com/){target=_blank}。

## 创建智能合约 {: #create-contract }

要使用thirdweb CLI创建新的智能合约，请遵循以下步骤：

1. 在CLI中，运行以下命令：

    ```bash
    npx thirdweb create contract
    ```

2. 对命令行提示进行偏好设置：

    1. 项目名称
    2. 选择框架：**Hardhat**或**Foundry**
    3. 为智能合约命名
    4. 选择基础合约的类型：**Empty**、[**ERC20**](https://portal.thirdweb.com/solidity/base-contracts/erc20base){target=_blank}、[**ERC721**](https://portal.thirdweb.com/solidity/base-contracts/erc721base){target=_blank}或[**ERC1155**](https://portal.thirdweb.com/solidity/base-contracts/erc1155base){target=_blank}
    5. 添加任何需要的[扩展程序](https://portal.thirdweb.com/solidity/extensions){target=_blank}

3. 创建后，导向至项目目录，并打开首选的代码编辑器
4. 如果您打开`contracts`文件夹，您将找到您的智能合约；这是用Solidity编写的智能合约

    以下是没有指定扩展的`ERC721Base`合约的代码。它实现了[`ERC721Base.sol`](https://github.com/thirdweb-dev/contracts/blob/main/contracts/base/ERC721Base.sol){target=_blank}合约内的所有逻辑；其实现了[`ERC721A`](https://github.com/thirdweb-dev/contracts/blob/main/contracts/eip/ERC721A.sol){target=_blank}标准。

    ```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    import '@thirdweb-dev/contracts/base/ERC721Base.sol';
    
    contract Contract is ERC721Base {
        constructor(
            string memory _name,
            string memory _symbol,
            address _royaltyRecipient,
            uint128 _royaltyBps
        ) ERC721Base(_name, _symbol, _royaltyRecipient, _royaltyBps) {}
    }
    ```

    通过以下步骤，该合约继承了`ERC721Base`的功能：

    - 导入`ERC721Base`合约
    - 通过声明您的合约是`ERC721Base`合约来继承合约
    - 实现任何所需的函数，例如constructor构造函数

5. 根据自定义逻辑修改合约后，您可以使用[Deploy](https://portal.thirdweb.com/deploy){target=_blank}将其部署至Moonbeam。我们将在下一个部分中展开讲述

您也可以直接从thirdweb Explore页面部署NFT、Token或市场的预构建合约：

1. 前往[thirdweb Explore页面](https://thirdweb.com/explore){target=_blank}

    ![thirdweb Explore](/images/builders/build/eth-api/dev-env/thirdweb/thirdweb-1.png)

2. 从可用选项中选择您要部署的合约类型，例如：NFT、Token、市场等
3. 遵循屏幕上方的提示配置和部署您的合约

关于在Explore页面上的可用合约的更多信息，请查看[thirdweb文档网站的预先构建合约部分](https://portal.thirdweb.com/pre-built-contracts){target=_blank}。

## 部署合约 {: #deploy-contract }

[Deploy](https://portal.thirdweb.com/deploy){target=_blank}是thirdweb的工具，允许您轻松部署智能合约至任何EVM兼容网络，而无需配置PRC URL，暴露私钥、编写脚本，以及验证合约等其他额外设置。

1. 要使用deploy部署智能合约，导向至项目的根目录并执行以下命令：

    ```bash
    npx thirdweb deploy
    ```

    执行此命令将触发以下操作：

    - 在当前目录中编译所有的合约
    - 提供您希望部署合约的选项
    - 上传您的合约源代码（ABI）至IPFS

2. 完成后，将打开数据面板界面以完成参数填写

    - `_name` - 合约名称
    - `_symbol` - 符号或“代码”
    - `_royaltyRecipient` - 用于接收二次销售特许权的钱包地址
    - `_royaltyBps` - 每次二次销售将给予特许权使用费接收者的基点 (bps)，例如：500 = 5%

3. 选择Moonbeam作为网络
4. 根据需要在合约的数据面板上管理其他设置，例如上传NFT、配置许可等

在Deploy的其他信息，请参考[thirdweb的文档网站](https://portal.thirdweb.com/deploy){target=_blank}。

## 创建应用程序 {: #create-application }

thirdweb提供适用于多种编程语言的SDK，例如React、React Native、TypeScript、Python、Go和Unity。首先，您需要创建一个应用程序，然后可以选择要使用的SDK：

1. 在CLI中，运行以下命令：

    ```bash
    npx thirdweb create --app
    ```

2. 对命令行提示进行偏好设置：

    1. 设置项目名称
    2. 选择网络。您可以选择**EVM**兼容网络Moonbeam
    3. 选择框架：**Next.js**、**Create React App**、**Vite**、**React Native**、**Node.js**或**Express**.。在本示例中，选择**Create React App**
    4. 选择语言：**JavaScript**或**TypeScript**

3. 使用React或TypeScript SDK与应用程序的功能交互。这将在下方与合约交互部分展开讲述。

## 与合约交互 {: #interact-with-a-contract }

thirdweb provides several SDKs to allow you to interact with your contract including: thirdweb提供多个SDK，允许您与合约交互，包括[React](https://portal.thirdweb.com/react){target=_blank}、[React Native](https://portal.thirdweb.com/react-native){target=_blank}、[TypeScript](https://portal.thirdweb.com/typescript){target=_blank}、[Python](https://portal.thirdweb.com/python){target=_blank}、[Go](https://portal.thirdweb.com/go){target=_blank}和[Unity](https://portal.thirdweb.com/unity){target=_blank}。

本文档将向您展示如何使用React与部署至Moonbeam的合约交互。您可以在thirdweb文档网站查看[完整React SDK参考](https://portal.thirdweb.com/react){target=_blank}。

要创建一个预先配置了thirdweb SDK的新应用程序，请运行并选择您的首选配置：

```bash
npx thirdweb create app --evm
```

或者通过运行以下命令将其安装至您现有的项目中：

```bash
npx thirdweb install
```

### 在Moonbeam上初始化SDK {: #initialize-sdk-on-moonbeam }

将您的应用程序包装在`thirdwebProvider`组件中，并将`activeChain`更改为Moonbeam。

```jsx
import { thirdwebProvider } from '@thirdweb-dev/react';
import { Moonbeam } from '@thirdweb-dev/chains';

const App = () => {
  return (
    <thirdwebProvider activeChain={Moonbeam}>
      <YourApp />
    </thirdwebProvider>
  );
};
```

### 获取合约 {: #get-contract }

要与您的合约连接，使用SDK的[`getContract`](https://portal.thirdweb.com/typescript/sdk.thirdwebsdk.getcontract){target=_blank}函数。

```jsx
import { useContract } from '@thirdweb-dev/react';

function App() {
  const { contract, isLoading, error } = useContract('INSERT_CONTRACT_ADDRESS');
}
```

### 调用合约功能 {: #calling-contract-functions }

对于基于扩展的功能，请使用内置支持的hook。目前，有多种hook可供您使用，以下是一些示例：

- 使用NFT扩展程序通过[`useOwnedNFTs` hook](https://portal.thirdweb.com/react/react.useownednfts){target=_blank}访问某个地址拥有的NFT列表：

    ```jsx
    import { useOwnedNFTs, useContract, useAddress } from '@thirdweb-dev/react';
    
    // Your smart contract address
    const contractAddress = 'INSERT_CONTRACT_ADDRESS';
    
    function App() {
      const address = useAddress();
      const { contract } = useContract(contractAddress);
      const { data, isLoading, error } = useOwnedNFTs(contract, address);
    }
    ```

- 使用[`useContractRead` hook](https://portal.thirdweb.com/react/react.usecontractread){target=_blank}通过传入要使用的函数名称，以此在合约上调用任何可读函数：

    ```jsx
    import { useContractRead, useContract } from '@thirdweb-dev/react';
    
    // Your smart contract address
    const contractAddress = 'INSERT_CONTRACT_ADDRESS';
    
    function App() {
      const { contract } = useContract(contractAddress);
      // Read data from your smart contract using the function or variables name
      const { data, isLoading, error } = useContractRead(contract, 'INSERT_NAME');
    }
    ```

- 使用[`useContractWrite` hook](https://portal.thirdweb.com/react/react.usecontractwrite){target=_blank}通过传入要使用的函数名称在合约上调用任何编写函数：

    ```jsx
    import {
      useContractWrite,
      useContract,
      Web3Button,
    } from '@thirdweb-dev/react';
    
    // Your smart contract address
    const contractAddress = 'INSERT_CONTRACT_ADDRESS';
    
    function App() {
      const { contract } = useContract(contractAddress);
      const { mutateAsync, isLoading, error } = useContractWrite(
        contract,
        'INSERT_NAME'
      );
    
      return (
        <Web3Button
          contractAddress={contractAddress}
          // Calls the 'INSERT_NAME' function on your smart contract
          // with 'INSERT_ARGUMENT' as the first argument
          action={() => mutateAsync({ args: ['INSERT_ARGUMENT'] })}
        >
          Send Transaction
        </Web3Button>
      );
    }
    ```

### Connect Wallet {: #connect-wallet }

您可以通过多种方式创建自定义[connect wallet](https://portal.thirdweb.com/react/connecting-wallets){target=_blank}的体验。您可以使用[`ConnectWallet`组件](https://portal.thirdweb.com/react/connecting-wallets#using-the-connect-wallet-button){target=_blank}，或者如果您要更高级化的自定义功能，可以使用[`useConnect` hook](https://portal.thirdweb.com/react/connecting-wallets#using-hooks){target=_blank}。

以下示例将向您展示如何使用`ConnectWallet`组件。为此，您将需要指定支持的钱包并将其传给提供商。

```jsx
import {
  thirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnectV1,
  walletConnect,
  safeWallet,
  paperWallet,
} from '@thirdweb-dev/react';

function MyApp() {
  return (
    <thirdwebProvider
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect({
          projectId: 'INSERT_YOUR_PROJECT_ID', // optional
        }),
        walletConnectV1(),
        safeWallet(),
        paperWallet({
          clientId: 'INSERT_YOUR_CLIENT_ID', // required
        }),
      ]}
      activeChain={Moonbeam}
    >
      <App />
    </thirdwebProvider>
  );
}
```

接下来，您需要添加connect wallet按钮，引导终端用户使用任何上述支持的钱包登陆。

```jsx
import { ConnectWallet } from '@thirdweb-dev/react';

function App() {
  return <ConnectWallet />;
}
```

## 部署应用 {: #deploy-application }

您可以通过运行以下命令，将静态网页端应用程序托管在去中心化存储上：

```bash
npx thirdweb deploy --app
```

通过运行此命令，您的应用程序将构建为生产环境，并使用thirdweb的去中心化文件管理解决方案 [Storage](https://portal.thirdweb.com/storage){target=_blank}进行存储。构建的应用程序上传到去中心化存储网络IPFS，并为您的应用程序生成唯一的URL。此URL用作您的应用程序在网络上的永久托管位置。

如果您还有任何疑问或在操作过程中遇到任何问题，请通过[support.thirdweb.com](http://support.thirdweb.com/){target=_blank}联系thirdweb客服。

--8<-- 'text/disclaimers/third-party-content.md'
