---
title: How to use viem Ethereum Library - 如何使用viem以太坊库
description: Check out this tutorial to learn how to use the viem TypeScript interface for Ethereum to send transactions and deploy Solidity smart contracts to Moonbeam.
查看本教程学习如何使用以太坊的viem TypeScript接口以发送交易并部署Solidity智能合约至Moonbeam。
---

# viem TypeScript Ethereum Library - viem TypeScript以太坊库

## Introduction - 概览 {: #introduction }

[viem](https://viem.sh/){target=_blank} is a modular TypeScript library that allows developers to interact with abstractions over the JSON-RPC API, making it easy to interact with Ethereum nodes. Since Moonbeam has an Ethereum-like API available that is fully compatible with Ethereum-style JSON RPC invocations, developers can leverage this compatibility to interact with Moonbeam nodes. For more information on viem, check out their [documentation site](https://viem.sh/docs/getting-started.html){target=_blank}.

[viem](https://viem.sh/){target=_blank}是一个模块化的TypeScript库，它提供JSON-RPC API的抽象化封装让开发者能够与之交互，从而轻松与以太坊节点交互。由于Moonbeam的类以太坊API完全兼容以太坊格式的JSON RPC调用，因此开发者可以利用此兼容性与Moonbeam节点交互。关于viem的更多信息，请参考其[官方文档网站](https://viem.sh/docs/getting-started.html){target=_blank}。

In this guide, you'll learn how to use viem to send a transaction and deploy a contract on the Moonbase Alpha TestNet. This guide can be adapted for [Moonbeam](/builders/get-started/networks/moonbeam/){target=_blank}, [Moonriver](/builders/get-started/networks/moonriver/){target=_blank}, or a [Moonbeam development node](/builders/get-started/networks/moonbeam-dev/){target=_blank}.

在本教程中，您将学习如何使用viem发送交易并部署合约至Moonbase Alpha测试网。本教程也同样适用于[Moonbeam](/builders/get-started/networks/moonbeam/){target=_blank}、[Moonriver](/builders/get-started/networks/moonriver/){target=_blank}或[Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev/){target=_blank}。

## Checking Prerequisites - 查看先决条件 {: #checking-prerequisites }

For the examples in this guide, you will need to have the following:

开始操作之前，您将需要准备以下内容：

- An account with funds.一个拥有资金的账户。
  --8<-- 'text/_common/faucet/faucet-list-item.md'
- 
  --8<-- 'text/_common/endpoint-examples-list-item.md'

!!! note
    --8<-- 'text/_common/assumes-mac-or-ubuntu-env.md'

## Installing viem - 安装viem {: #installing-viem }

To get started, you'll need to create a basic TypeScript project. First, create a directory to store all of the files you'll be creating throughout this guide, and initialize the project with the following command:

您需要创建一个基础的TypeScript项目。首先，创建一个目录，用于存储所有的本教程中要创建的文件。然后使用以下命令初始化项目：

```bash
mkdir viem-examples && cd viem-examples && npm init --y
```

For this guide, you'll need to install the viem library and the Solidity compiler. To install both packages, you can run the following command:

在本教程中，您需要安装viem库和Solidity编译器。您可以通过运行以下命令安装这两个包：

=== "npm"

    ```bash
    npm install typescript ts-node viem solc@0.8.0
    ```

=== "yarn"

    ```bash
    yarn add typescript ts-node viem solc@0.8.0
    ```

You can create a TypeScript configuration file by running:

您可以通过运行以下命令创建TypeScript配置：

```bash
npx tsc --init
```

!!! note 注意事项
    This tutorial was created using Node.js v18.18.0.

截至本教程撰写时所使用的Node.js为18.18.0版本。

## Set Up a viem Client (Provider) - 设置viem Client（提供者） {: #setting-up-a-viem-provider }

Throughout this guide, you'll be creating a bunch of scripts that provide different functionality, such as sending a transaction, deploying a contract, and interacting with a deployed contract. In most of these scripts, you'll need to create a [viem client](https://docs.ethers.org/v6/api/providers/){target=_blank} to interact with the network.

在本教程中，您将创建一些提供不同功能的脚本，例如发送交易、部署合约和与已部署的合约交互。在大部分脚本中，您需要创建一个[viem client](https://docs.ethers.org/v6/api/providers/){target=_blank}用于与网络交互。

--8<-- 'text/common/endpoint-setup.md'

You can create a viem client for reading chain data, like balances or contract data, using the `createPublicClient` function, or you can create a viem client for writing chain data, like sending transactions, using the `createWalletClient` function.

您可以使用`createPublicClient`函数创建一个用于读取链数据的viem client，例如余额或合约数据；您也可以使用`createWalletClient`函数创建一个用于写入链数据的viem client，例如发送交易。

### For Reading Chain Data - 用于读取链数据 {: #for-reading-chain-data }

To create a client for reading chain data, you can take the following steps:

要创建一个用于读取链数据的客户端，请执行以下步骤：

1. Import the `createPublicClient` and `http` functions from `viem` and the network you want to interact with from `viem/chains`. The chain can be any of the following: `moonbeam`, `moonriver`, or `moonbaseAlpha`

   从`viem`导入`createPublicClient`和`http`函数，并从`viem/chains`导入想要交互的网络。链可以为`moonbeam`、`moonriver`或`moonbaseAlpha`

2. Create the `client` using the `createPublicClient` function and pass in the network and the HTTP RPC endpoint

   使用`createPublicClient`函数创建`client`，并配置network和HTTP RPC端点

=== "Moonbeam"

    ```ts
    import { createPublicClient, http } from 'viem';
    import { moonbeam } from 'viem/chains';
    
    const rpcUrl = '{{ networks.moonbeam.rpc_url }}'
    const publicClient = createPublicClient({
      chain: moonbeam,
      transport: http(rpcUrl),
    });
    ```

=== "Moonriver"

    ```ts
    import { createPublicClient, http } from 'viem';
    import { moonriver } from 'viem/chains';
    
    const rpcUrl = '{{ networks.moonriver.rpc_url }}'
    const publicClient = createPublicClient({
      chain: moonriver,
      transport: http(rpcUrl),
    });
    ```

=== "Moonbase Alpha"

    ```ts
    import { createPublicClient, http } from 'viem';
    import { moonbaseAlpha } from 'viem/chains';
    
    const rpcUrl = '{{ networks.moonbase.rpc_url }}'
    const publicClient = createPublicClient({
      chain: moonbaseAlpha,
      transport: http(rpcUrl),
    });
    ```

=== "Moonbeam Dev Node"

    ```ts
    import { createPublicClient, http } from 'viem';
    import { moonbeamDev } from 'viem/chains';
    
    const rpcUrl = '{{ networks.development.rpc_url }}'
    const publicClient = createPublicClient({
      chain: moonbeamDev,
      transport: http(rpcUrl);
    })
    ```

### For Writing Chain Data - 用于写入链数据 {: #for-writing-chain-data }

To create a client for reading chain data, you can take the following steps:

要创建一个用于读取链数据的客户端，请执行以下步骤：

1. Import the `createWalletClient` and `http` functions from `viem`, the `privateKeyToAccount` function for loading your accounts via their private keys, and the network you want to interact with from `viem/chains`. The chain can be any of the following: `moonbeam`, `moonriver`, or `moonbaseAlpha`

   从`viem`导入`createWalletClient`和`http`函数，通过其私钥导入加载账户的`privateKeyToAccount`函数，以及从`viem/chains`导入想要交互的网络。链可以为`moonbeam`、`moonriver`或`moonbaseAlpha`

2. Create your account using the `privateKeyToAccount` function

   使用`privateKeyToAccount`函数创建账户

3. Create the `client` using the `createWalletClient` function and pass in the account, network, and the HTTP RPC endpoint

   使用`createWalletClient`函数创建`client`，并传入账户和HTTP RPC端点

!!! remember 请注意
    This is for demo purposes only. Never store your private key in a TypeScript file.

本教程仅用于操作演示，请勿将您的私钥存储于TypeScript文件中。

=== "Moonbeam"

    ```ts
    import { createWalletClient, http } from 'viem';
    import { privateKeyToAccount } from 'viem/accounts';
    import { moonbeam } from 'viem/chains';
    
    const account = privateKeyToAccount('INSERT_PRIVATE_KEY');
    const rpcUrl = '{{ networks.moonbeam.rpc_url }}'
    const walletClient = createWalletClient({
      account,
      chain: moonbeam,
      transport: http(rpcUrl),
    });
    ```

=== "Moonriver"

    ```ts
    import { createWalletClient, http } from 'viem';
    import { privateKeyToAccount } from 'viem/accounts';
    import { moonriver } from 'viem/chains';
    
    const account = privateKeyToAccount('INSERT_PRIVATE_KEY');
    const rpcUrl = '{{ networks.moonriver.rpc_url }}'
    const walletClient = createWalletClient({
      account,
      chain: moonriver,
      transport: http(rpcUrl),
    });
    ```

=== "Moonbase Alpha"

    ```ts
    import { createWalletClient, http } from 'viem';
    import { privateKeyToAccount } from 'viem/accounts';
    import { moonbaseAlpha } from 'viem/chains';
    
    const account = privateKeyToAccount('INSERT_PRIVATE_KEY');
    const rpcUrl = '{{ networks.moonbase.rpc_url }}'
    const walletClient = createWalletClient({
      account,
      chain: moonbaseAlpha,
      transport: http(rpcUrl),
    });
    ```

=== "Moonbeam Dev Node"

    ```ts
    import { createWalletClient, http } from 'viem';
    import { privateKeyToAccount } from 'viem/accounts';
    import { moonbeamDev } from 'viem/chains';
    
    const account = privateKeyToAccount('INSERT_PRIVATE_KEY');
    const rpcUrl = '{{ networks.development.rpc_url }}'
    const walletClient = createWalletClient({
      account,
      chain: moonbeamDev,
      transport: http(rpcUrl),
    });
    ```

!!! note 注意事项
    To interact with browser-based wallets, you can use the following code to create an account:

要与基于浏览器的钱包交互，您可以使用以下代码创建钱包：

    ```ts
    const [account] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    const walletClient = createWalletClient({
      account,
      chain: moonbeam,
      transport: custom(window.ethereum),
    });
    ```

## Send a Transaction - 发送交易 {: #send-transaction }

During this section, you'll be creating a couple of scripts. The first one will be to check the balances of your accounts before trying to send a transaction. The second script will actually send the transaction.

在这一部分，您将创建一些脚本。第一个脚本是在尝试发送交易之前查看账户余额，第二个脚本是实际发送交易。

You can also use the balance script to check the account balances after the transaction has been sent.

您也需要使用余额脚本查看交易发送后的账户余额。

### Check Balances Script - 查看余额脚本 {: #check-balances-script }

You'll only need one file to check the balances of both addresses before and after the transaction is sent. To get started, you can create a `balances.ts` file by running:

您只需要一个文件即可在交易发送前后检查两个地址的余额。首先，您需要通过运行以下命令创建一个`balances.ts`文件。

```bash
touch balances.ts
```

Next, you will create the script for this file and complete the following steps:

接下来，您可以为此文件创建脚本，并执行以下步骤：

1. Update your imports to include the `createPublicClient`, `http`, and `formatEther` functions from `viem` and the network you want to interact with from `viem/chains`

   更新您的导入以包含`viem`中的`createPublicClient`、`http`和`formatEther`函数，以及您想要从`viem/chains`交互的网络

2. [Set up a public viem client](#for-reading-chain-data), which can be used for reading chain data, such as account balances

   [设置viem client](#for-reading-chain-data)，此客户端可用于读取链数据，例如账户余额

3. Define the `addressFrom` and `addressTo` variables

   定义`addressFrom`和`addressTo`变量

4. Create the asynchronous `balances` function that wraps the `publicClient.getBalance` method

   创建`balances`异步函数，该函数包装了`publicClient.getBalance`函数

5. Use the `publicClient.getBalance` function to fetch the balances for the `addressFrom` and `addressTo` addresses. You can also leverage the `formatEther` function to transform the balance into a more readable number (in GLMR, MOVR, or DEV)

   使用`publicClient.getBalance`函数获取`addressFrom`和`addressTo`地址的余额。您也可以使用`formatEther`函数将余额转换成特定单位的数值，例如GLMR、MOVR或DEV

6. Lastly, run the `balances` function

   最后，运行`balances`函数

```ts
--8<-- 'code/builders/build/eth-api/libraries/viem/balances.ts'
```

To run the script and fetch the account balances, you can run the following command:

要运行脚本和获取账户余额，您可以运行以下命令：

```bash
npx ts-node balances.ts
```

If successful, the balances for the origin and receiving address will be displayed in your terminal in DEV.

如果成功，发送地址和接收地址的余额将以DEV为单位显示在终端。

![The result of running the balances script in the terminal](/images/builders/build/eth-api/libraries/viem/viem-1.png)

### Send Transaction Script - 发送交易脚本 {: #send-transaction-script }

You'll only need one file to execute a transaction between accounts. For this example, you'll be transferring 1 DEV token from an origin address (from which you hold the private key) to another address. To get started, you can create a `transaction.ts` file by running:

您只需要一个文件即可在两个账户之间执行交易。在本示例中，您将从源地址（即拥有私钥的账户）转移一个DEV到另一个地址。首先，您需要运行以下命令创建一个`transaction.ts`文件。

```bash
touch transaction.ts
```

Next, you will create the script for this file and complete the following steps:

接下来，您可以为此文件创建脚本，并执行以下步骤：

1. Update your imports to include the `createWalletClient`, `http`, and `parseEther` functions from `viem`, the `privateKeyToAccount` function from `viem/accounts`, and the network you want to interact with from `viem/chains`

   更新您的导入以包含`viem`中的`createWalletClient`、`http`和`parseEther`函数，`viem/accounts`中的`privateKeyToAccount`函数，以及您想要从`viem/chains`交互的网络

2. [Set up a viem wallet client](#for-writing-chain-data) for writing chain data, which can be used along with your private key to send transactions. **Note: This is for example purposes only. Never store your private keys in a TypeScript file**

   [设置viem wallet client](#for-writing-chain-data)用于写入链数据，该客户端配上私钥一起可用于发送交易。**请注意：本教程仅用于操作演示，请勿将您的私钥存储于TypeScript文件中**

3. [Set up a public viem client](#for-reading-chain-data) for reading chain data, which will be used to wait for the transaction receipt

   [设置公共viem client](#for-reading-chain-data)，用于读取链数据，该客户端将用于等待交易回执

4. Define the `addressTo` variable

   定义`addressTo`变量

5. Create the asynchronous `send` function, which wraps the transaction object and the `walletClient.sendTransaction` method

   创建了`send`异步函数，该函数包装了交易对象和`walletClient.sendTransaction`函数

6. Use the `walletClient.sendTransaction` function to sign and send the transaction. You'll need to pass in the transaction object, which only requires the recipient's address and the amount to send. Note that `parseEther` can be used, which handles the necessary unit conversions from Ether to Wei, similar to using `parseUnits(value, decimals)`. Use `await` to wait until the transaction is processed and the transaction hash is returned

   `walletClient.sendTransaction`函数能用于签署和发送交易。该函数只需要传入一个交易对象，交易对象仅需包含接收者地址和发送的金额。请注意您可以使用`parseEther`函数来处理Ether和Wei之间的单位转换，该转换是必要的且类似于`parseUnits(value, decimals)`。使用`await`等待交易处理完毕并返回交易哈希值

7. Use the `publicClient.waitForTransactionReceipt` function to wait for the transaction receipt, signaling that the transaction has been completed. This is particularly helpful if you need the transaction receipt or if you're running the `balances.ts` script directly after this one to check if the balances have been updated as expected

   使用`publicClient.waitForTransactionReceipt`函数等待交易回执，这表明交易已完成。如果您需要交易回执，或者在此之后直接运行`balances.ts`脚本来检查余额是否已按预期更新，此函数特别有用

8. Lastly, run the `send` function

   最后，运行`send`函数

```ts
--8<-- 'code/builders/build/eth-api/libraries/viem/transaction.ts'
```

To run the script, you can run the following command in your terminal:

要运行脚本，您可以在终端运行以下命令：

```bash
npx ts-node transaction.ts
```

If the transaction was successful, in your terminal you'll see the transaction hash has been printed out.

如果交易成功，您将在终端看到交易哈希。

You can also use the `balances.ts` script to check that the balances for the origin and receiving accounts have changed. The entire workflow would look like this:

您也可以使用`balances.ts`脚本查看发送和接收账户更改的余额。整个工作流程如下：

![The result of running the transaction and balances scripts in the terminal](/images/builders/build/eth-api/libraries/viem/viem-2.png)

## Deploy a Contract - 部署合约 {: #deploy-contract }

--8<-- 'text/builders/build/eth-api/libraries/contract.md'

### Compile Contract Script - 编译合约脚本 {: #compile-contract-script }

--8<-- 'text/builders/build/eth-api/libraries/compile-ts.md'
--8<-- 'text/builders/build/eth-api/libraries/compile.md'

```js
--8<-- 'code/builders/build/eth-api/libraries/compile.ts'
```

### Deploy Contract Script - 部署合约脚本 {: #deploy-contract-script }

With the script for compiling the `Incrementer.sol` contract in place, you can then use the results to send a signed transaction that deploys it. To do so, you can create a file for the deployment script called `deploy.ts`:

在使用脚本编译`Incrementer.sol`合约后，您可以将结果用签署的交易部署至链上。首先，您可以为部署脚本创建一个名为`deploy.ts`的文件：

```bash
touch deploy.ts
```

Next, you will create the script for this file and complete the following steps:

接下来，您可以为此文件创建脚本，并执行以下步骤：

1. Update your imports to include the `createPublicClient`, `createWalletClient`, and `http` functions from `viem`, the `privateKeyToAccount` function from `viem/accounts`, the network you want to interact with from `viem/chains`, and the `contractFile` from the `compile.ts` file you created in the [Compile Contract Script](#compile-contract-script) section

   更新您的导入以包含`viem`中的`createPublicClient`、`createWalletClient`和`http`函数、`viem/accounts`中的`privateKeyToAccount`函数、您想要从`viem/chains`交互的网络，以及从您在[编译合约脚本](#compile-contract-script)部分创建的`compile.ts`文件中的`contractFile`

2. [Set up a viem wallet client](#for-writing-chain-data) for writing chain data, which will be used along with your private key to deploy the `Incrementer` contract. **Note: This is for example purposes only. Never store your private keys in a TypeScript file**

   [设置viem wallet client](#for-writing-chain-data)，用于写入链数据，该客户端可用于与私钥一起部署`Incrementer`合约。**请注意：本教程仅用于操作演示，请勿将您的私钥存储于TypeScript文件中**

3. [Set up a public viem client](#for-reading-chain-data) for reading chain data, which will be used to read the transaction receipt for the deployment

   [设置公共viem client](#for-reading-chain-data)，用于读取链数据，该客户端将用于读取部署的交易回执

4. Load the contract `bytecode` and `abi` for the compiled contract

   为编译的合约加载合约`bytecode`和`abi`

5. Create the asynchronous `deploy` function that will be used to deploy the contract via the `walletClient.deployContract` method

   创建`deploy`异步函数，该函数使用 `walletClient.deployContract`函数部署合约

6. Use the `walletClient.deployContract` function to sign and send the transaction. You'll need to pass in the contract's ABI and bytecode, the account to deploy the transaction from, and the initial value for the incrementer. Use `await` to wait until the transaction is processed and the transaction hash is returned

   使用`walletClient.deployContract`函数签署和发送交易。您需要传入合约的ABI和字节码，部署交易的账户，以及incrementer的初始值。使用`await`等待交易处理完毕并返回交易哈希值

7. Use the `publicClient.readContract` function to get the transaction receipt for the deployment. Use `await` to wait until the transaction is processed and the contract address is returned

   使用`publicClient.readContract`函数获取部署的交易回执。使用`await`等待交易处理完毕并返回交易地址

8. Lastly, run the `deploy` function

   最后，运行`deploy`函数

```ts
--8<-- 'code/builders/build/eth-api/libraries/viem/deploy.ts'
```

To run the script, you can enter the following command into your terminal:

要运行脚本，您可以在终端运行以下命令：

```bash
npx ts-node deploy.ts
```

If successful, the contract's address will be displayed in the terminal.

如果成功，您将在终端看到合约地址。

![The result of running the deploy script in the terminal](/images/builders/build/eth-api/libraries/viem/viem-3.png)

### Read Contract Data (Call Methods) - 读取合约数据（调用函数） {: #read-contract-data }

Call methods are the type of interaction that doesn't modify the contract's storage (change variables), meaning no transaction needs to be sent. They simply read various storage variables of the deployed contract.

Call函数是一种不会修改合约存储（更改变量）的交互类型，这意味着无需发送任何交易。他们只是读取已部署合约的各种存储变量。

To get started, you can create a file and name it `get.ts`:

首先，您需要创建一个文件，将其命名为`get.ts`：

```bash
touch get.ts
```

Then you can take the following steps to create the script:

然后，您可以执行以下步骤创建脚本：

1. Update your imports to include the `createPublicClient` and `http` functions from `viem`, the network you want to interact with from `viem/chains`, and the `contractFile` from the `compile.ts` file you created in the [Compile Contract Script](#compile-contract-script) section

   更新您的导入以包含`viem`中的`createPublicClient`和`http`函数，`viem/chains`中您想要交互的网络，以及从您在[编译合约脚本](#compile-contract-script)部分创建的`compile.ts`文件中的`contractFile`

2. [Set up a public viem client](#for-reading-chain-data) for reading chain data, which will be used to read the current number of the `Incrementer` contract

   [设置公共viem client](#for-reading-chain-data)，用于读取链数据，该客户端可用于读取`Incrementer`合约的当前数量。

3. Create the `contractAddress` variable using the address of the deployed contract and the `abi` variable using the `contractFile` from the `compile.ts` file

   使用已部署合约的地址创建`contractAddress`变量，以及使用`compile.ts`文件中的`contractFile`创建`abi`变量

4. Create the asynchronous `get` function

   创建`get`异步函数

5. Call the contract using the `publicClient.readContract` function, passing in the `abi`, the name of the function, the `contractAddress`, and any arguments (if needed). You can use `await`, which will return the value requested once the request promise resolves

   使用`publicClient.readContract`函数调用合约，传入`abi`、函数名称、`contractAddress`和任何参数（若需要）。您可以使用`await`，当请求承诺解决，将返回请求的值

6. Lastly, call the `get` function

   最后，调用`get`函数

```ts
--8<-- 'code/builders/build/eth-api/libraries/viem/get.ts'
```

To run the script, you can enter the following command in your terminal:

要运行脚本，您可以在终端运行以下命令：

```bash
npx ts-node get.ts
```

If successful, the value will be displayed in the terminal.

如果成功，您将在终端看到值。

![The result of running the get script in the terminal](/images/builders/build/eth-api/libraries/viem/viem-4.png)

### Interact with Contract (Send Methods) - 与合约交互（发送函数） {: #interact-with-contract }

Send methods are the type of interactions that modify the contract's storage (change variables), meaning a transaction needs to be signed and sent. In this section, you'll create two scripts: one to increment and one to reset the incrementer. To get started, you can create a file for each script and name them `increment.ts` and `reset.ts`:

Send函数是一种修改合约存储（更改变量）的交互类型，这意味着需要签署并发送交易。在这一部分中，您将创建两个脚本：一个用于增量，一个用于重置增量器。 首先，您可以为每个脚本创建一个文件，并将其分别命名为`increment.ts`和`reset.ts`：

```bash
touch increment.ts reset.ts
```

Open the `increment.ts` file and take the following steps to create the script:

打开`increment.ts`文件，并执行以下步骤创建脚本：

1. Update your imports to include the `createWalletClient` and `http` functions from `viem`, the network you want to interact with from `viem/chains`, and the `contractFile` from the `compile.ts` file you created in the [Compile Contract Script](#compile-contract-script) section

   更新您的导入以包含`viem`中的`createWalletClient`和`http`函数，`viem/chains`中您想要交互的网络，以及从您在[编译合约脚本](#compile-contract-script)部分创建的`compile.ts`文件中的`contractFile`

2. [Set up a viem wallet client](#for-writing-chain-data) for writing chain data, which will be used along with your private key to send a transaction. **Note: This is for example purposes only. Never store your private keys in a TypeScript file**

   [设置viem wallet client](#for-writing-chain-data)，用于写入链数据，该客户端可用于与私钥一起发送交易。**请注意：本教程仅用于操作演示，请勿将您的私钥存储于TypeScript文件中**

3. [Set up a public viem client](#for-reading-chain-data) for reading chain data, which will be used to wait for the transaction receipt

   [设置公共viem client](#for-reading-chain-data)，用于读取链数据，该客户端将用于等待交易回执

4. Create the `contractAddress` variable using the address of the deployed contract, the `abi` variable using the `contractFile` from the `compile.ts` file, and the `_value` to increment the contract by

   使用已部署合约的地址创建`contractAddress`变量，使用`compile.ts`文件中的`contractFile`创建`abi`变量，以及创建合约递增的`_value`

5. Create the asynchronous `increment` function

   创建`increment`异步函数

6. Call the contract using the `walletClient.writeContract` function, passing in the `abi`, the name of the function, the `contractAddress`, and the `_value`. You can use `await`, which will return the transaction hash once the request promise resolves

   使用`walletClient.writeContract`函数调用合约，传入`abi`、函数名称、`contractAddress`和`_value`。您可以使用`await`，当请求承诺解决，将返回交易哈希

7. Use the `publicClient.waitForTransactionReceipt` function to wait for the transaction receipt, signaling that the transaction has been completed. This is particularly helpful if you need the transaction receipt or if you're running the `get.ts` script directly after this one to check that the current number has been updated as expected

   使用`publicClient.waitForTransactionReceipt`函数等待交易回执，这表明交易已完成。如果您需要交易回执，或者在此之后直接运行`get.ts`脚本来检查当前数值是否已按预期更新，此函数特别有用

8. Lastly, call the `increment` function

   最后，调用`increment`函数

```js
--8<-- 'code/builders/build/eth-api/libraries/viem/increment.ts'
```

To run the script, you can enter the following command in your terminal:

要运行脚本，您可以在终端运行以下命令：

```bash
npx ts-node increment.ts
```

If successful, the transaction hash will be displayed in the terminal. You can use the `get.ts` script alongside the `increment.ts` script to make sure that value is changing as expected.

如果成功，您将在终端看到交易哈希。 您可以一同使用`get.ts`脚本和`increment.ts`脚本，以确保该值按预期更改。

![The result of running the increment and get scripts in the terminal](/images/builders/build/eth-api/libraries/viem/viem-5.png)

Next, you can open the `reset.ts` file and take the following steps to create the script:

接下来，您可以打开`reset.ts`文件，并执行以下步骤创建脚本：

1. Update your imports to include the `createWalletClient` and `http` functions from `viem`, the network you want to interact with from `viem/chains`, and the `contractFile` from the `compile.ts` file you created in the [Compile Contract Script](#compile-contract-script) section

   更新您的导入以包含`viem`中的`createWalletClient`和`http`函数，`viem/chains`中您想要交互的网络，以及从您在[编译合约脚本](#compile-contract-script)部分创建的`compile.ts`文件中的`contractFile`

2. [Set up a viem wallet client](#for-writing-chain-data) for writing chain data, which will be used along with your private key to send a transaction. **Note: This is for example purposes only. Never store your private keys in a TypeScript file**

   [设置viem wallet client](#for-writing-chain-data)，用于写入链数据，该客户端可用于与私钥一起发送交易。**请注意：本教程仅用于操作演示，请勿将您的私钥存储于TypeScript文件中**

3. [Set up a public viem client](#for-reading-chain-data) for reading chain data, which will be used to wait for the transaction receipt

   [设置公共viem client](#for-reading-chain-data)，用于读取链数据，该客户端将用于等待交易回执

4. Create the `contractAddress` variable using the address of the deployed contract and the `abi` variable using the `contractFile` from the `compile.ts` file to increment the contract by

   使用已部署合约的地址创建`contractAddress`变量，并使用`compile.ts`文件中的`contractFile`创建`abi`变量，以实现合约增量

5. Create the asynchronous `reset` function

   创建`reset`异步函数

6. Call the contract using the `walletClient.writeContract` function, passing in the `abi`, the name of the function, the `contractAddress`, and an empty array for the arguments. You can use `await`, which will return the transaction hash once the request promise resolves

   使用`walletClient.writeContract`函数调用合约，传入`abi`、函数名称、`contractAddress`和一个参数空白数组。您可以使用`await`，当请求承诺解决，将返回交易哈希

7. Use the `publicClient.waitForTransactionReceipt` function to wait for the transaction receipt, signaling that the transaction has been completed. This is particularly helpful if you need the transaction receipt or if you're running the `get.ts` script directly after this one to check that the current number has been reset to `0`

   使用`publicClient.waitForTransactionReceipt`函数等待交易回执，这表明交易已完成。如果您需要交易回执，或者在此之后直接运行`get.ts`脚本来检查当前数值是否已按预期更新，此函数特别有用

8. Lastly, call the `reset` function

   最后，调用`reset`函数

```ts
--8<-- 'code/builders/build/eth-api/libraries/viem/reset.ts'
```

To run the script, you can enter the following command in your terminal:

要运行脚本，您可以在终端运行以下命令：

```bash
npx ts-node reset.ts
```

If successful, the transaction hash will be displayed in the terminal. You can use the `get.ts` script alongside the `reset.ts` script to make sure that value is changing as expected.

如果成功，您将在终端看到交易哈希。 您可以一同使用`get.ts`脚本和`reset.ts`脚本，以确保该值按预期更改。

![The result of running the reset and get scripts in the terminal](/images/builders/build/eth-api/libraries/viem/viem-6.png)

--8<-- 'text/_disclaimers/third-party-content.md'
