---
title: Ethers.js
description: 通过本教程以学习如何使用以太坊EtherJS代码库在Moonbeam上部署Solidity智能合约
---

# Ethers.js JavaScript代码库

![Intro diagram](/images/builders/build/eth-api/libraries/ethers/ethersjs-banner.png)

## 概览 {: #introduction }

[ethers.js](https://docs.ethers.io/){target=_blank}代码库提供用户使用JavaScript与以太坊节点交互的多样工具，类似于web3.js。Moonbeam拥有与以太坊相似的API供用户使用，其与以太坊风格的JSON RPC调用完全兼容。因此，开发者可以利用此兼容特性并使用ether.js库与Moonbeam节点交互，与在以太坊操作相同。您可以在此[博客文章](https://medium.com/l4-media/announcing-ethers-js-a-web3-alternative-6f134fdd06f3){target=_blank}了解更多关于ether.js的信息。

在本教程中，您将学习如何使用ethers.js库在Moonbase Alpha上发送交易和部署合约。本教程也同样适用于[Moonbeam](/builders/get-started/networks/moonbeam/){target=_blank}，[Moonriver](/builders/get-started/networks/moonriver/){target=_blank}，或是[Moonbeam development node](/builders/get-started/networks/moonbeam-dev/){target=_blank}。

## 查看先决条件 {: #checking-prerequisites }

在开始本教程示例之前，您将需要提前准备以下内容：

 - 拥有资金的账户。以Moonbase Alpha而言，以Moonbase Alpha为例，您可以从[任务中心](/builders/get-started/moonbase/#get-tokens/)获得用于测试目的的DEV Token
 - 
--8<-- 'text/common/endpoint-examples.md'

!!! 注意事项
    --8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

## 创建一个JavaScript项目 {: #create-a-javascript-project }

首先，您需要创建一个目录，以存储您在本教程中将要创建的所有文件：

```
mkdir ethers-examples && cd ethers-examples
```

在本教程中，您将需要安装ether.js代码库和Solidity编译器。您可以通过运行以下命令来安装两者的NPM安装包：

```
npm install ethers solc@0.8.0
```

## 设置Ehters提供商 {: #setting-up-the-ethers-provider }

在本教程中，您将会创建提供不同功能的脚本，如发送交易、部署合约以及与一个已部署合约交互。在大部分的脚本中，您需要创建一个[Ethers提供者](https://docs.ethers.io/v5/api/providers/){target=_blank}与网络交互。

--8<-- 'text/common/endpoint-setup.md'

为创建一个提供者，您可以遵循以下步骤：

1. 导入`ethers`代码库

2. 定义`providerRPC`标的，包括您希望在其上发送交易的网络配置。您将会需要包含网络的`name`、`rpc`和`chainId` 

3. 使用`ethers.providers.StaticJsonRpcProvider`函数创建`provider` 。除此之外，您也可以使用`ethers.providers.JsonRpcProvide(providerRPC)`函数，其仅需要提供者RPC端点的地址。此操作可能因为个别项目规格而存在兼容性问题

=== "Moonbeam"

    ```js
    // 1. Import ethers
    const ethers = require('ethers');
    
    // 2. Define network configurations
    const providerRPC = {
      moonbeam: {
        name: 'moonbeam',
        rpc: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonbeam.chain_id }}, // {{ networks.moonbeam.hex_chain_id }} in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      providerRPC.moonbeam.rpc, 
      {
        chainId: providerRPC.moonbeam.chainId,
        name: providerRPC.moonbeam.name,
      }
    );
    ```

=== "Moonriver"

    ```js
    // 1. Import ethers
    const ethers = require('ethers');
    
    // 2. Define network configurations
    const providerRPC = {
      moonriver: {
        name: 'moonriver',
        rpc: '{{ networks.moonriver.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonriver.chain_id }}, // {{ networks.moonriver.hex_chain_id }} in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      providerRPC.moonriver.rpc, 
      {
        chainId: providerRPC.moonriver.chainId,
        name: providerRPC.moonriver.name,
      }
    );
    ```

=== "Moonbase Alpha"

    ```js
    // 1. Import ethers
    const ethers = require('ethers');
    
    // 2. Define network configurations
    const providerRPC = {
      moonbase: {
        name: 'moonbase-alpha',
        rpc: '{{ networks.moonbase.rpc_url }}',
        chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      providerRPC.moonbase.rpc, 
      {
        chainId: providerRPC.moonbase.chainId,
        name: providerRPC.moonbase.name,
      }
    );
    ```

=== "Moonbeam开发节点"

    ```js
    // 1. Import ethers
    const ethers = require('ethers');
    
    // 2. Define network configurations
    const providerRPC = {
      dev: {
        name: 'moonbeam-development',
        rpc: '{{ networks.development.rpc_url }}',
        chainId: {{ networks.development.chain_id }}, // {{ networks.development.hex_chain_id }} in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      providerRPC.dev.rpc, 
      {
        chainId: providerRPC.dev.chainId,
        name: providerRPC.dev.name,
      }
    );
    ```

## 发送交易 {: #send-a-transaction }

在这一部分，您将需要创建一些脚本。第一个脚本将用于发送交易前检查账户余额。第二个脚本将执行交易。

您也可以在交易发送后，使用余额脚本查看账户余额。

### 查看余额脚本 {: #check-balances-script }

您仅需要一个文件查看交易发送前后两个地址的余额。首先，您可以运行以下命令创建一个`balances.js`文件：

```
touch balances.js
```

接下来，您将为此文件创建脚本并完成以下步骤：

1. [设置Ethers提供者](#setting-up-the-ethers-provider)

2. 定义`addressFrom`和`addressTo`变量

3. 创建打包了`provider.getBalance`函数的异步`balances`函数

4. 使用`provider.getBalance`函数获取`addressFrom`和`addressTo`地址的余额。您也可以使用`eths.utils.formatEther`函数将余额转换成以ETH为单位的数字便于阅读

5. 最后，运行`balances`函数

```js
// 1. Add the Ethers provider logic here:
// {...}

// 2. Create address variables
const addressFrom = 'ADDRESS-FROM-HERE';
const addressTo = 'ADDRESS-TO-HERE';

// 3. Create balances function
const balances = async () => {
  // 4. Fetch balances
  const balanceFrom = ethers.utils.formatEther(await provider.getBalance(addressFrom));
  const balanceTo = ethers.utils.formatEther(await provider.getBalance(addressTo));

  console.log(`The balance of ${addressFrom} is: ${balanceFrom} ETH`);
  console.log(`The balance of ${addressTo} is: ${balanceTo} ETH`);
};

// 5. Call the balances function
balances();
```

您可以查看[GitHub上的完整脚本](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/ethers-tx-local/balances.js){target=_blank}。

您可以运行以下命令以运行脚本并获取账户余额：

```
node balances.js
```

如果成功，发送地址和接收地址的余额将以ETH为单位显示在终端。

### 发送交易脚本 {: #send-transaction-script }

在本示例中，您将从拥有私钥的发送地址转移1个DEV Token至另一个地址。首先，您可以运行以下命令创建一个`transaction.js`文件：

```
touch transaction.js
```

接下来，您将为此文件创建脚本并完成以下步骤：

1. [设置Ethers提供者](#setting-up-the-ethers-provider)

2. 定义`privateKey`和`addressTo`变量。此处需要私钥以创建一个钱包实例。**请注意：此处操作仅用于演示目的，请勿将您的私钥存储在JavaScript文件中**

3. 使用先前步骤中的`privateKey`和`provider`创建一个钱包。此钱包实例将会被用于签署交易

4. 创建打包了交易标的以及`wallet.sendTransaction`函数的异步`send`函数

5. 创建仅需要接受者地址以及发送数量的交易标的。注意，您可以使用`ethers.utils.parseEther`，其能够处理Ether至Wei的必要单位换算，如同使用`ethers.utils.parseUnits(value, 'ether')`

6. 使用`wallet.sendTransaction`函数发送交易，然后使用`await`等待交易处理完毕并返回交易回执

7. 最后，运行`send`函数

```js
// 1. Add the Ethers provider logic here:
// {...}

// 2. Create account variables
const account_from = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
};
const addressTo = 'ADDRESS-TO-HERE';

// 3. Create wallet
let wallet = new ethers.Wallet(account_from.privateKey, provider);

// 4. Create send function
const send = async () => {
  console.log(`Attempting to send transaction from ${wallet.address} to ${addressTo}`);

  // 5. Create tx object
  const tx = {
    to: addressTo,
    value: ethers.utils.parseEther('1'),
  };

  // 6. Sign and send tx - wait for receipt
  const createReceipt = await wallet.sendTransaction(tx);
  await createReceipt.wait();
  console.log(`Transaction successful with hash: ${createReceipt.hash}`);
};

// 7. Call the send function
send();
```

您可以查看[GitHub上的完整脚本](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/ethers-tx-local/transaction.js){target=_blank}。

您可以在终端运行以下命令以运行脚本：

```
node transaction.js
```

如果交易成功，您将在终端看到显示的交易哈希。

您也可以使用`balances.js`脚本为发送地址和接收地址查看余额是否变化。整体操作流程如下所示：

![Send Tx Etherjs](/images/builders/build/eth-api/libraries/ethers/ethers-1.png)

## 部署合约 {: #deploy-a-contract }

--8<-- 'text/libraries/contract.md'

### 编译合约脚本 {: #compile-contract-script }

--8<-- 'text/libraries/compile.md'

### 部署合约脚本 {: #deploy-contract-script }

有了用于编译`Incrementer.sol`合约的脚本，您就可以使用这些结果发送部署的签名交易。首先，您可以为部署的脚本创建一个名为`deploy.js`的文件：

```
touch deploy.js
```

接下来，您将为此文件创建脚本并完成以下步骤：

1. 从`compile.js`导入合约文件

2. [设置Ethers提供者](#setting-up-the-ethers-provider)

3. 为初始账户定义`privateKey` ，此私钥将用于创建一个钱包实例。**请注意：此处操作仅用于演示目的，请勿将您的私钥存储在JavaScript文件中**

4. 为已编译合约储存`bytecode`和`abi`

5. 使用先前步骤的`privateKey`和`provider`创建钱包。此钱包实例将会被用于签署交易

6. 使用`ethers.ContractFactory`函数创建具有签名者的合约实例，提供`abi`、`bytecode`以及`wallet`参数 

7. 创建用于部署合约的异步`deploy`函数

8. 在`deploy`函数中，使用`incrementer`合约实例以连接`deploy`并输入初始数值。在本示例中，您可以将初始值设置为`5`。这将会为交易部署传送交易，您可以使用合约部署交易的`deployed`以等待交易记录

9. 最后，运行`deploy`函数

```js
// 1. Import the contract file
const contractFile = require('./compile');

// 2. Add the Ethers provider logic here:
// {...}

// 3. Create account variables
const account_from = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
};

// 4. Save the bytecode and ABI
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

// 5. Create wallet
let wallet = new ethers.Wallet(account_from.privateKey, provider);

// 6. Create contract instance with signer
const incrementer = new ethers.ContractFactory(abi, bytecode, wallet);

// 7. Create deploy function
const deploy = async () => {
  console.log(`Attempting to deploy from account: ${wallet.address}`);

  // 8. Send tx (initial value set to 5) and wait for receipt
  const contract = await incrementer.deploy([5]);
  await contract.deployed();

  console.log(`Contract deployed at address: ${contract.address}`);
};

// 9. Call the deploy function
deploy();
```

您可以查看[GitHub上的完整脚本](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/ethers-contract-local/deploy.js){target=_blank}。

您可以在终端运行以下命令以运行脚本：

```
node deploy.js
```

如果成功，合约地址将显示在终端。

![Deploy Contract Etherjs](/images/builders/build/eth-api/libraries/ethers/ethers-2.png)


### 读取合约数据（调用函数） {: #read-contract-data }

调用函数是无需修改合约存储（更改变量）的交互类型，这意味着无需发送交易，只需读取已部署合约的各种存储变量。

首先，您需要创建一个文件并命名为`get.js`：

```
touch get.js
```

接下来，您可以遵循以下步骤创建脚本：

1. 从`compile.js`文件导入`abi`

2. [设置Ethers提供者](#setting-up-the-ethers-provider)

3. 使用已部署合约的地址创建`contractAddress`变量

4. 使用`ethers.Contract`函数并传入`contractAddress`、`abi`和`provider`以创建合约实例

5. 创建异步`get`函数

6. 使用合约实例以调用其中一个合约函数并输入任何需要的信息。在本示例中，您将调用`number`函数（此函数无需任何输入）。您可以使用`await`，这将在请求解决后返回请求的数值

7. 最后，运行`get`函数

```js
// 1. Import the ABI
const { abi } = require('./compile');

// 2. Add the Ethers provider logic here:
// {...}

// 3. Contract address variable
const contractAddress = 'CONTRACT-ADDRESS-HERE';

// 4. Create contract instance
const incrementer = new ethers.Contract(contractAddress, abi, provider);

// 5. Create get function
const get = async () => {
  console.log(`Making a call to contract at address: ${contractAddress}`);

  // 6. Call contract 
  const data = await incrementer.number();

  console.log(`The current number stored is: ${data}`);
};

// 7. Call get function
get();
```

您可以查看[GitHub上的完整脚本](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/ethers-contract-local/get.js){target=_blank}。

您可以在终端运行以下命令以运行脚本：

```
node get.js
```

如果成功，数值将显示在终端。

### 交互合约（发送函数）{: #interact-with-contract }

发送函数是修改合约存储（更改变量）的交互类型，这意味着需要签署和发送交易。在这一部分，您将创建两个脚本：一个是增量，另一个是重置增量器。首先，您可以为每个脚本创建一个文件，并分别命名为`increment.js`和`reset.js`：

```
touch increment.js reset.js
```

接下来，打开`increment.js`文件并执行以下步骤以创建脚本：

1. 从`compile.js`文件导入`abi`

2. [设置Ethers提供者](#setting-up-the-ethers-provider)

3. 为初始账户定义`privateKey`、已部署合约的`contractAddress`以及要增量的`_value`。此处的私钥将用于创建钱包实例。**请注意：此处操作仅用于演示目的，请勿将您的私钥存储在JavaScript文件中**

4. 使用先前步骤中的`privateKey`和`provider`创建钱包，钱包实例将用于传送交易

5. 使用`ethers.Contract`函数并输入`contractAddress`、 `abi`和`provider`以创建合约实例

6. 使用异步`increment`函数

7. 使用合约实例以调用其中一个合约函数并输入任何需要的信息。在本示例中，您将调用`increment`函数（此函数无需任何输入）。您可以使用`await`，这将在请求解决后返回请求的数值

8. 最后，运行`increment`函数

```js
// 1. Import the contract ABI
const { abi } = require('./compile');

// 2. Add the Ethers provider logic here:
// {...}

// 3. Create variables
const account_from = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
};
const contractAddress = 'CONTRACT-ADDRESS-HERE';
const _value = 3;

// 4. Create wallet
let wallet = new ethers.Wallet(account_from.privateKey, provider);

// 5. Create contract instance with signer
const incrementer = new ethers.Contract(contractAddress, abi, wallet);

// 6. Create increment function
const increment = async () => {
  console.log(
    `Calling the increment by ${_value} function in contract at address: ${contractAddress}`
  );

  // 7. Sign and send tx and wait for receipt
  const createReceipt = await incrementer.increment([_value]);
  await createReceipt.wait();

  console.log(`Tx successful with hash: ${createReceipt.hash}`);
};

// 8. Call the increment function
increment();
```

您可以查看[GitHub上的完整脚本](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/ethers-contract-local/increment.js){target=_blank}。

您可以在终端运行以下命令以运行脚本：

```
node increment.js
```

如果成功，交易哈希将显示在终端。您可以在`increment.js`脚本旁边使用`get.js`脚本以确保数值如预期变化：

![Increment Contract Ethers](/images/builders/build/eth-api/libraries/ethers/ethers-3.png)

接下来，您可以打开`reset.js`文件并执行以下步骤以创建脚本：

1. 从`compile.js`文件导入`abi`

2. [设置Ethers提供者](#setting-up-the-ethers-provider)

3. 为初始地址和已部署合约的`contractAddress`定义`privateKey` ，此处私钥用于创建一个钱包实例。**请注意：此处操作仅用于演示目的，请勿将您的私钥存储在JavaScript文件中**

4. 使用先前步骤的`privateKey`和`provider`创建一个钱包，此钱包实例将用于签署交易

5. 使用`ethers.Contract` 函数并输入`contractAddress`、`abi`和`provider`以创建合约实例

6. 创建异步`reset`函数

7. 使用合约实例以调用其中一个合约函数并输入任何需要的信息。在本示例中，您将调用`reset`函数（此函数无需任何输入）。您可以使用`await`，这将在请求解决后返回请求的数值

8. 最后，运行`reset`函数

```js
// 1. Import the contract ABI
const { abi } = require('./compile');

// 2. Add the Ethers provider logic here:
// {...}

// 3. Create variables
const account_from = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
};
const contractAddress = 'CONTRACT-ADDRESS-HERE';

// 4. Create wallet
let wallet = new ethers.Wallet(account_from.privateKey, provider);

// 5. Create contract instance with signer
const incrementer = new ethers.Contract(contractAddress, abi, wallet);

// 6. Create reset function
const reset = async () => {
  console.log(`Calling the reset function in contract at address: ${contractAddress}`);

  // 7. sign and send tx and wait for receipt
  const createReceipt = await incrementer.reset();
  await createReceipt.wait();

  console.log(`Tx successful with hash: ${createReceipt.hash}`);
};

// 8. Call the reset function
reset();
```

您可以查看在[GitHub上的完整脚本](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/ethers-contract-local/reset.js){target=_blank}。

您可以在终端运行以下命令以运行脚本：

```
node reset.js
```

如果成功，交易哈希将显示在终端。您可以在`reset.js`脚本配合使用`get.js`脚本以确保数值如预期变化：

![Reset Contract Ethers](/images/builders/build/eth-api/libraries/ethers/ethers-4.png)

--8<-- 'text/disclaimers/third-party-content.md'