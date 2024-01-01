---
title: 如何使用viem以太坊库
description: 查看本教程学习如何使用以太坊的viem TypeScript接口以发送交易并部署Solidity智能合约至Moonbeam。
---

# viem TypeScript以太坊库

## 概览 {: #introduction }

[viem](https://viem.sh/){target=_blank}是一个模块化的TypeScript库，它提供JSON-RPC API的抽象化封装让开发者能够与之交互，从而轻松与以太坊节点交互。由于Moonbeam的类以太坊API完全兼容以太坊格式的JSON-RPC调用，因此开发者可以利用此兼容性与Moonbeam节点交互。关于viem的更多信息，请参考其[官方文档网站](https://viem.sh/docs/getting-started.html){target=_blank}。

在本教程中，您将学习如何使用viem发送交易并部署合约至Moonbase Alpha测试网。本教程也同样适用于[Moonbeam](/builders/get-started/networks/moonbeam/){target=_blank}、[Moonriver](/builders/get-started/networks/moonriver/){target=_blank}或[Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev/){target=_blank}。

## 查看先决条件 {: #checking-prerequisites }

开始操作之前，您将需要准备以下内容：

- An account with funds.一个拥有资金的账户。
  --8<-- 'text/_common/faucet/faucet-list-item.md'
- 
  --8<-- 'text/_common/endpoint-examples-list-item.md'

!!! 注意事项
    --8<-- 'text/_common/assumes-mac-or-ubuntu-env.md'

## 安装viem {: #installing-viem }

您需要创建一个基础的TypeScript项目。首先，创建一个目录，用于存储所有的本教程中要创建的文件。然后使用以下命令初始化项目：

```bash
mkdir viem-examples && cd viem-examples && npm init --y
```

在本教程中，您需要安装viem库和Solidity编译器。您可以通过运行以下命令安装这两个包：

=== "npm"

    ```bash
    npm install typescript ts-node viem solc@0.8.0
    ```

=== "yarn"

    ```bash
    yarn add typescript ts-node viem solc@0.8.0
    ```

您可以通过运行以下命令创建TypeScript配置：

```bash
npx tsc --init
```

!!! 注意事项
    截至本教程撰写时所使用的Node.js为18.18.0版本。

## 设置viem Client（提供者） {: #setting-up-a-viem-provider }

在本教程中，您将创建一些提供不同功能的脚本，例如发送交易、部署合约和与已部署的合约交互。在大部分脚本中，您需要创建一个[viem client](https://docs.ethers.org/v6/api/providers/){target=_blank}用于与网络交互。

--8<-- 'text/common/endpoint-setup.md'

您可以使用`createPublicClient`函数创建一个用于读取链数据的viem client，例如余额或合约数据；您也可以使用`createWalletClient`函数创建一个用于写入链数据的viem client，例如发送交易。

### 用于读取链数据 {: #for-reading-chain-data }

要创建一个用于读取链数据的客户端，请执行以下步骤：

1. 从`viem`导入`createPublicClient`和`http`函数，并从`viem/chains`导入想要交互的网络。链可以为`moonbeam`、`moonriver`或`moonbaseAlpha`
2. 使用`createPublicClient`函数创建`client`，并配置network和HTTP RPC端点

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

=== "Moonbeam开发节点"

    ```ts
    import { createPublicClient, http } from 'viem';
    import { moonbeamDev } from 'viem/chains';
    
    const rpcUrl = '{{ networks.development.rpc_url }}'
    const publicClient = createPublicClient({
      chain: moonbeamDev,
      transport: http(rpcUrl);
    })
    ```

### 用于写入链数据 {: #for-writing-chain-data }

要创建一个用于读取链数据的客户端，请执行以下步骤：

1. 从`viem`导入`createWalletClient`和`http`函数，通过其私钥导入加载账户的`privateKeyToAccount`函数，以及从`viem/chains`导入想要交互的网络。链可以为`moonbeam`、`moonriver`或`moonbaseAlpha`
2. 使用`privateKeyToAccount`函数创建账户
3. 使用`createWalletClient`函数创建`client`，并传入账户和HTTP RPC端点

!!! 请记住
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

=== "Moonbeam开发节点"

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

!!! 注意事项
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

## 发送交易 {: #send-transaction }

在这一部分，您将创建一些脚本。第一个脚本是在尝试发送交易之前查看账户余额，第二个脚本是实际发送交易。

您也需要使用余额脚本查看交易发送后的账户余额。

### 查看余额脚本 {: #check-balances-script }

您只需要一个文件即可在交易发送前后检查两个地址的余额。首先，您需要通过运行以下命令创建一个`balances.ts`文件。

```bash
touch balances.ts
```

接下来，您可以为此文件创建脚本，并执行以下步骤：

1. 更新您的导入以包含`viem`中的`createPublicClient`、`http`和`formatEther`函数，以及您想要从`viem/chains`交互的网络
2. [设置viem client](#for-reading-chain-data)，此客户端可用于读取链数据，例如账户余额
3. 定义`addressFrom`和`addressTo`变量
4. 创建`balances`异步函数，该函数包装了`publicClient.getBalance`函数
5. 使用`publicClient.getBalance`函数获取`addressFrom`和`addressTo`地址的余额。您也可以使用`formatEther`函数将余额转换成特定单位的数值，例如GLMR、MOVR或DEV
6. 最后，运行`balances`函数

```ts
--8<-- 'code/builders/build/eth-api/libraries/viem/balances.ts'
```

要运行脚本和获取账户余额，您可以运行以下命令：

```bash
npx ts-node balances.ts
```

如果成功，发送地址和接收地址的余额将以DEV为单位显示在终端。

![The result of running the balances script in the terminal](/images/builders/build/eth-api/libraries/viem/viem-1.png)

### 发送交易脚本 {: #send-transaction-script }

您只需要一个文件即可在两个账户之间执行交易。在本示例中，您将从源地址（即拥有私钥的账户）转移一个DEV到另一个地址。首先，您需要运行以下命令创建一个`transaction.ts`文件。

```bash
touch transaction.ts
```

接下来，您可以为此文件创建脚本，并执行以下步骤：

1. 更新您的导入以包含`viem`中的`createWalletClient`、`http`和`parseEther`函数，`viem/accounts`中的`privateKeyToAccount`函数，以及您想要从`viem/chains`交互的网络
2. [设置viem wallet client](#for-writing-chain-data)用于写入链数据，该客户端配上私钥一起可用于发送交易。**请注意：本教程仅用于操作演示，请勿将您的私钥存储于TypeScript文件中**
3. [设置公共viem client](#for-reading-chain-data)，用于读取链数据，该客户端将用于等待交易回执
4. 定义`addressTo`变量
5. 创建了`send`异步函数，该函数包装了交易对象和`walletClient.sendTransaction`函数
6. `walletClient.sendTransaction`函数能用于签署和发送交易。该函数只需要传入一个交易对象，交易对象仅需包含接收者地址和发送的金额。请注意您可以使用`parseEther`函数来处理Ether和Wei之间的单位转换，该转换是必要的且类似于`parseUnits(value, decimals)`。使用`await`等待交易处理完毕并返回交易哈希值
7. 使用`publicClient.waitForTransactionReceipt`函数等待交易回执，这表明交易已完成。如果您需要交易回执，或者在此之后直接运行`balances.ts`脚本来检查余额是否已按预期更新，此函数特别有用
8. 最后，运行`send`函数

```ts
--8<-- 'code/builders/build/eth-api/libraries/viem/transaction.ts'
```

要运行脚本，您可以在终端运行以下命令：

```bash
npx ts-node transaction.ts
```

如果交易成功，您将在终端看到交易哈希。

您也可以使用`balances.ts`脚本查看发送和接收账户更改的余额。整个工作流程如下：

![The result of running the transaction and balances scripts in the terminal](/images/builders/build/eth-api/libraries/viem/viem-2.png)

## 部署合约 {: #deploy-contract }

--8<-- 'text/builders/build/eth-api/libraries/contract.md'

### 编译合约脚本 {: #compile-contract-script }

--8<-- 'text/builders/build/eth-api/libraries/compile-ts.md'
--8<-- 'text/builders/build/eth-api/libraries/compile.md'

```js
--8<-- 'code/builders/build/eth-api/libraries/compile.ts'
```

### 部署合约脚本 {: #deploy-contract-script }

在使用脚本编译`Incrementer.sol`合约后，您可以将结果用签署的交易部署至链上。首先，您可以为部署脚本创建一个名为`deploy.ts`的文件：

```bash
touch deploy.ts
```

接下来，您可以为此文件创建脚本，并执行以下步骤：

1. 更新您的导入以包含`viem`中的`createPublicClient`、`createWalletClient`和`http`函数、`viem/accounts`中的`privateKeyToAccount`函数、您想要从`viem/chains`交互的网络，以及从您在[编译合约脚本](#compile-contract-script)部分创建的`compile.ts`文件中的`contractFile`
2. [设置viem wallet client](#for-writing-chain-data)，用于写入链数据，该客户端可用于与私钥一起部署`Incrementer`合约。**请注意：本教程仅用于操作演示，请勿将您的私钥存储于TypeScript文件中**
3. [设置公共viem client](#for-reading-chain-data)，用于读取链数据，该客户端将用于读取部署的交易回执
4. 为编译的合约加载合约`bytecode`和`abi`
5. 创建`deploy`异步函数，该函数使用 `walletClient.deployContract`函数部署合约
6. 使用`walletClient.deployContract`函数签署和发送交易。您需要传入合约的ABI和字节码，部署交易的账户，以及incrementer的初始值。使用`await`等待交易处理完毕并返回交易哈希值
7. 使用`publicClient.readContract`函数获取部署的交易回执。使用`await`等待交易处理完毕并返回交易地址
8. 最后，运行`deploy`函数

```ts
--8<-- 'code/builders/build/eth-api/libraries/viem/deploy.ts'
```

要运行脚本，您可以在终端运行以下命令：

```bash
npx ts-node deploy.ts
```

如果成功，您将在终端看到合约地址。

![The result of running the deploy script in the terminal](/images/builders/build/eth-api/libraries/viem/viem-3.png)

### 读取合约数据（调用函数） {: #read-contract-data }

Call函数是一种不会修改合约存储（更改变量）的交互类型，这意味着无需发送任何交易。他们只是读取已部署合约的各种存储变量。

首先，您需要创建一个文件，将其命名为`get.ts`：

```bash
touch get.ts
```

然后，您可以执行以下步骤创建脚本：

1. 更新您的导入以包含`viem`中的`createPublicClient`和`http`函数，`viem/chains`中您想要交互的网络，以及从您在[编译合约脚本](#compile-contract-script)部分创建的`compile.ts`文件中的`contractFile`
2. [设置公共viem client](#for-reading-chain-data)，用于读取链数据，该客户端可用于读取`Incrementer`合约的当前数量。
3. 使用已部署合约的地址创建`contractAddress`变量，以及使用`compile.ts`文件中的`contractFile`创建`abi`变量
4. 创建`get`异步函数
5. 使用`publicClient.readContract`函数调用合约，传入`abi`、函数名称、`contractAddress`和任何参数（若需要）。您可以使用`await`，当请求承诺解决，将返回请求的值
6. 最后，调用`get`函数

```ts
--8<-- 'code/builders/build/eth-api/libraries/viem/get.ts'
```

要运行脚本，您可以在终端运行以下命令：

```bash
npx ts-node get.ts
```

如果成功，您将在终端看到值。

![The result of running the get script in the terminal](/images/builders/build/eth-api/libraries/viem/viem-4.png)

### 与合约交互（发送函数） {: #interact-with-contract }

Send函数是一种修改合约存储（更改变量）的交互类型，这意味着需要签署并发送交易。在这一部分中，您将创建两个脚本：一个用于增量，一个用于重置增量器。 首先，您可以为每个脚本创建一个文件，并将其分别命名为`increment.ts`和`reset.ts`：

```bash
touch increment.ts reset.ts
```

打开`increment.ts`文件，并执行以下步骤创建脚本：

1. 更新您的导入以包含`viem`中的`createWalletClient`和`http`函数，`viem/chains`中您想要交互的网络，以及从您在[编译合约脚本](#compile-contract-script)部分创建的`compile.ts`文件中的`contractFile`
2. [设置viem wallet client](#for-writing-chain-data)，用于写入链数据，该客户端可用于与私钥一起发送交易。**请注意：本教程仅用于操作演示，请勿将您的私钥存储于TypeScript文件中**
3. [设置公共viem client](#for-reading-chain-data)，用于读取链数据，该客户端将用于等待交易回执
4. 使用已部署合约的地址创建`contractAddress`变量，使用`compile.ts`文件中的`contractFile`创建`abi`变量，以及创建合约递增的`_value`
5. 创建`increment`异步函数
6. 使用`walletClient.writeContract`函数调用合约，传入`abi`、函数名称、`contractAddress`和`_value`。您可以使用`await`，当请求承诺解决，将返回交易哈希
7. 使用`publicClient.waitForTransactionReceipt`函数等待交易回执，这表明交易已完成。如果您需要交易回执，或者在此之后直接运行`get.ts`脚本来检查当前数值是否已按预期更新，此函数特别有用
8. 最后，调用`increment`函数

```js
--8<-- 'code/builders/build/eth-api/libraries/viem/increment.ts'
```

要运行脚本，您可以在终端运行以下命令：

```bash
npx ts-node increment.ts
```

如果成功，您将在终端看到交易哈希。 您可以一同使用`get.ts`脚本和`increment.ts`脚本，以确保该值按预期更改。

![The result of running the increment and get scripts in the terminal](/images/builders/build/eth-api/libraries/viem/viem-5.png)

接下来，您可以打开`reset.ts`文件，并执行以下步骤创建脚本：

1. 更新您的导入以包含`viem`中的`createWalletClient`和`http`函数，`viem/chains`中您想要交互的网络，以及从您在[编译合约脚本](#compile-contract-script)部分创建的`compile.ts`文件中的`contractFile`
2. [设置viem wallet client](#for-writing-chain-data)，用于写入链数据，该客户端可用于与私钥一起发送交易。**请注意：本教程仅用于操作演示，请勿将您的私钥存储于TypeScript文件中**
3. [设置公共viem client](#for-reading-chain-data)，用于读取链数据，该客户端将用于等待交易回执
4. 使用已部署合约的地址创建`contractAddress`变量，并使用`compile.ts`文件中的`contractFile`创建`abi`变量，以实现合约增量
5. 创建`reset`异步函数
6. 使用`walletClient.writeContract`函数调用合约，传入`abi`、函数名称、`contractAddress`和一个参数空白数组。您可以使用`await`，当请求承诺解决，将返回交易哈希
7. 使用`publicClient.waitForTransactionReceipt`函数等待交易回执，这表明交易已完成。如果您需要交易回执，或者在此之后直接运行`get.ts`脚本来检查当前数值是否已按预期更新，此函数特别有用
8. 最后，调用`reset`函数

```ts
--8<-- 'code/builders/build/eth-api/libraries/viem/reset.ts'
```

要运行脚本，您可以在终端运行以下命令：

```bash
npx ts-node reset.ts
```

如果成功，您将在终端看到交易哈希。 您可以一同使用`get.ts`脚本和`reset.ts`脚本，以确保该值按预期更改。

![The result of running the reset and get scripts in the terminal](/images/builders/build/eth-api/libraries/viem/viem-6.png)

--8<-- 'text/_disclaimers/third-party-content.md'
