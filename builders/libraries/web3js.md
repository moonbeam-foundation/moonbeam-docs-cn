---
title: 如何使用Ethereum Web3.js代码库
description: 通过本教程学习如何使用以太坊web3.js JavaScript代码库在Moonbeam上发送交易和部署Solidity智能合约。
---

# Web3.js JavaScript代码库

## 概览 {: #introduction }

[Web3.js](https://web3js.readthedocs.io/){target=\_blank}是一组代码库，允许开发者使用JavaScript，并通过HTTP、IPC或WebSocker协议与以太坊节点交互。Moonbeam拥有与以太坊相似的API供用户使用，其与以太坊风格的JSON-RPC调用完全兼容。因此，开发者可以利用此兼容特性并使用Web3.js库与Moonbeam节点交互，与在以太坊操作相同。

在本教程中，您将学习如何使用Web3.js库在Moonbase Alpha上发送交易和部署合约。本教程也同样适用于[Moonbeam](/builders/get-started/networks/moonbeam/){target=\_blank}、[Moonriver](/builders/get-started/networks/moonriver/){target=\_blank}或[Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev/){target=\_blank}。

## 查看先决条件 {: #checking-prerequisites }

在开始本教程示例之前，您将需要提前准备以下内容：

 - 具有拥有一定数量资金的账户。
  --8<-- 'text/_common/faucet/faucet-list-item.md'
- 
  --8<-- 'text/_common/endpoint-examples-list-item.md'

!!! 注意事项
    --8<-- 'text/_common/assumes-mac-or-ubuntu-env.md'

## 安装Web3.js {: #install-web3js }

首先，您需要开始一个基本的JavaScript项目。第一步，创建一个目录来存储您在本教程中将要生成的所有文件，并使用以下命令来初始化该文件夹：

```bash
mkdir web3-examples && cd web3-examples && npm init --y
```

在本教程中，您将需要安装Web3.js代码库和Solidity编译器。您可以通过运行以下命令来安装两者的NPM安装包：

=== "npm"

    ```bash
    npm install web3 solc@0.8.0
    ```

=== "yarn"

    ```bash
    yarn add web3 solc@0.8.0
    ```

## 在Moonbeam上设置Web3.js {: #setup-web3-with-moonbeam }

您可以为任何Moonbeam网络配置web3.js。
--8<-- 'text/_common/endpoint-setup.md'

每个网络最简单的设置方式如下所示：

=== "Moonbeam"

    ```js
    const { Web3 } = require('web3');
    
    //Create Web3 instance
    const web3 = new Web3('{{ networks.moonbeam.rpc_url }}'); // Insert your RPC URL here
    ```

=== "Moonriver"

    ```js
    const { Web3 } = require('web3');
    
    //Create Web3 instance
    const web3 = new Web3('{{ networks.moonriver.rpc_url }}'); // Insert your RPC URL here
    ```

=== "Moonbase Alpha"

    ```js
    const { Web3 } = require('web3');
    
    //Create Web3 instance
    const web3 = new Web3('{{ networks.moonbase.rpc_url }}');
    ```

=== "Moonbeam开发节点"

    ```js
    const { Web3 } = require('web3');
    
    //Create Web3 instance
    const web3 = new Web3('{{ networks.development.rpc_url }}');
    ```

将此代码片段保存起来，因为您将在以下部分使用的脚本中用到它。

## 发送交易 {: #send-a-transaction }

在这一部分，您将需要创建一些脚本。第一个脚本将用于发送交易前查看账户余额。第二个脚本将执行交易。

您也可以使用余额脚本在交易发送后查看账户余额。

### 查看余额脚本 {: #check-balances-script }

您仅需要一个文件以查看交易发送前后两个地址的余额。首先，您可以运行以下命令创建一个`balances.js`文件：

```bash
touch balances.js
```

接下来，您将为此文件创建脚本并完成以下步骤：

1. [设置Web3提供者](#setup-web3-with-moonbeam)

2. 定义`addressFrom`和`addressTo`变量

3. 创建打包了`web3.eth.getBalance`函数的异步`balances`函数

4. 使用`web3.eth.getBalance`函数获取`addressFrom`和`addressTo`地址的余额。您也可以使用`web3.utils.fromWei`函数将余额转换成以DEV为单位的数字便于阅读

5. 最后，运行`balances`函数

```js
// 1. Add the Web3 provider logic here:
// {...}

// 2. Create address variables
const addressFrom = 'INSERT_FROM_ADDRESS';
const addressTo = 'INSERT_TO_ADDRESS';

// 3. Create balances function
const balances = async () => {
  // 4. Fetch balance info
  const balanceFrom = web3.utils.fromWei(
    await web3.eth.getBalance(addressFrom),
    'ether'
  );
  const balanceTo = web3.utils.fromWei(
    await web3.eth.getBalance(addressTo),
    'ether'
  );

  console.log(`The balance of ${addressFrom} is: ${balanceFrom} DEV`);
  console.log(`The balance of ${addressTo} is: ${balanceTo} DEV`);
};

// 5. Call balances function
balances();
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/build/eth-api/libraries/web3-js/balances.js'
    ```

您可以运行以下命令以运行脚本并获取账户余额：

```bash
node balances.js
```

如果成功，发送地址和接收地址的余额将以DEV为单位显示在终端。

### 发送交易脚本 {: #send-transaction-script }

您仅需要一个文件即可在账户之间执行交易。在本示例中，您将从拥有私钥的发送地址转移1个DEV Token至另一个地址。首先，您可以运行以下命令创建一个`transaction.js`文件：

```bash
touch transaction.js
```

接下来，您将为此文件创建脚本并完成以下步骤：

1. [设置Web3提供者](#setup-web3-with-moonbeam)
2. 定义`accountFrom`，包括`privateKey`和`addressTo`变量。此处需要私钥以创建一个钱包实例。**请注意：此处操作仅用于演示目的，请勿将您的私钥存储在JavaScript文件中**
3. 创建打包了交易标的以及签署和发送函数的异步`send`函数
4. 使用`web3.eth.accounts.signTransaction`函数创建和签署交易，传入交易的`gas`、`addressTo`、`value`、`gasPrice`、和`nonce`以及发送者的`privateKey`
5. 使用`web3.eth.sendSignedTransaction`函数发送已签署的交易，然后使用`await`等待交易处理完毕并返回交易回执
6. 最后，运行`send`函数

```js
// 1. Add the Web3 provider logic here:
// {...}

// 2. Create account variables
const accountFrom = {
  privateKey: 'INSERT_YOUR_PRIVATE_KEY',
  address: 'INSERT_PUBLIC_ADDRESS_OF_PK',,
};
const addressTo = 'INSERT_TO_ADDRESS'; // Change addressTo

// 3. Create send function
const send = async () => {
  console.log(
    `Attempting to send transaction from ${accountFrom.address} to ${addressTo}`
  );

  // 4. Sign tx with PK
  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      gas: 21000,
      to: addressTo,
      value: web3.utils.toWei('1', 'ether'),
      gasPrice: await web3.eth.getGasPrice(),
      nonce: await web3.eth.getTransactionCount(accountFrom.address),
    },
    accountFrom.privateKey
  );

  // 5. Send tx and wait for receipt
  const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
  );
  console.log(
    `Transaction successful with hash: ${createReceipt.transactionHash}`
  );
};

// 6. Call send function
send();
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/build/eth-api/libraries/web3-js/transaction.js'
    ```

您可以在终端运行以下命令以运行脚本：

```bash
node transaction.js
```

如果交易成功，您将在终端看到显示的交易哈希。

您也可以使用`balances.js`脚本为发送地址和接收地址查看余额是否变化。整体操作流程如下所示：

![Send Tx Web3js](/images/builders/ethereum/libraries/web3js/web3js-1.webp)

## 部署合约 {: #deploy-a-contract }

--8<-- 'text/builders/build/eth-api/libraries/contract.md'

### 编译合约脚本 {: #compile-contract-script }

--8<-- 'text/builders/build/eth-api/libraries/compile-js.md'
--8<-- 'text/builders/build/eth-api/libraries/compile.md'

```js
--8<-- 'code/builders/build/eth-api/libraries/compile.js'
```

### 部署合约脚本 {: #deploy-contract-script }

有了用于编译`Incrementer.sol`合约的脚本，您就可以使用这些结果发送部署的签名交易。首先，您可以为部署的脚本创建一个名为`deploy.js`的文件：

```bash
touch deploy.js
```

接下来，您将为此文件创建脚本并完成以下步骤：

1. 从`compile.js`导入合约文件
2. [设置Web3提供者](#setup-web3-with-moonbeam)
3. 定义`accountFrom`，包括`privateKey`和`addressTo`变量。此私钥将用于创建一个钱包实例。**请注意：此处操作仅用于演示目的，请勿将您的私钥存储在JavaScript文件中**
4. 为已编译的合约保存`bytecode`和`abi`
5. 创建将用于部署合约的异步`deploy`函数
6. 使用`web3.eth.Contract`函数创建合约实例
7. 创建构造函数并为增量器传入`bytecode`和初始值。在本示例中，您可以将初始值设置为`5`
8. 使用`web3.eth.accounts.signTransaction`函数创建和签署交易，传入交易的`data`、`gas`、`gasPrice`、和`nonce`以及发送者的`privateKey`
9. 使用`web3.eth.sendSignedTransaction`发送已签署的交易并传入原始交易，然后使用`await`等待交易处理完毕并返回交易回执
10. 最后，运行`deploy`函数

```js
// 1. Import the contract file
const contractFile = require('./compile');

// 2. Add the Web3 provider logic here:
// {...}

// 3. Create address variables
const accountFrom = {
  privateKey: 'INSERT_YOUR_PRIVATE_KEY',
  address: 'INSERT_PUBLIC_ADDRESS_OF_PK',,
};

// 4. Get the bytecode and API
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

// 5. Create deploy function
const deploy = async () => {
  console.log(`Attempting to deploy from account ${accountFrom.address}`);

  // 6. Create contract instance
  const incrementer = new web3.eth.Contract(abi);

  // 7. Create constructor tx
  const incrementerTx = incrementer.deploy({
    data: bytecode,
    arguments: [5],
  });

  // 8. Sign transacation and send
  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      data: incrementerTx.encodeABI(),
      gas: await incrementerTx.estimateGas(),
      gasPrice: await web3.eth.getGasPrice(),
      nonce: await web3.eth.getTransactionCount(accountFrom.address),
    },
    accountFrom.privateKey
  );

  // 9. Send tx and wait for receipt
  const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
  );
  console.log(`Contract deployed at address: ${createReceipt.contractAddress}`);
};

// 10. Call deploy function
deploy();
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/build/eth-api/libraries/web3-js/deploy.js'
    ```

您可以在终端运行以下命令以运行脚本：

```bash
node deploy.js
```

如果成功，合约地址将显示在终端。

![Deploy Contract Web3js](/images/builders/ethereum/libraries/web3js/web3js-2.webp)

### 读取合约数据（调用函数） {: #read-contract-data }

调用函数是无需修改合约存储（更改变量）的交互类型，这意味着无需发送交易，只需读取已部署合约的各种存储变量。

首先，您需要创建一个文件并命名为`get.js`：

```bash
touch get.js
```

接下来，您可以遵循以下步骤创建脚本：

1. 从`compile.js`文件导入`abi`
2. [设置Web3提供者](#setup-web3-with-moonbeam)
3. 使用已部署合约的地址创建`contractAddress`变量
4. 使用`web3.eth.Contract`函数并传入`abi`和`contractAddress`以创建合约实例
5. 创建异步`get`函数
6. 使用合约实例以调用其中一个合约函数并输入任何需要的信息。在本示例中，您将调用`number`函数（此函数无需任何输入）。您可以使用`await`，这将在请求解决后返回请求的数值
7. 最后，调用`get`函数

```js
// 1. Import the contract abi
const { abi } = require('./compile');

// 2. Add the Web3 provider logic here:
// {...}

// 3. Create address variables
const contractAddress = 'INSERT_CONTRACT_ADDRESS';

// 4. Create contract instance
const incrementer = new web3.eth.Contract(abi, contractAddress);

// 5. Create get function
const get = async () => {
  console.log(`Making a call to contract at address: ${contractAddress}`);

  // 6. Call contract
  const data = await incrementer.methods.number().call();

  console.log(`The current number stored is: ${data}`);
};

// 7. Call get function
get();
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/build/eth-api/libraries/web3-js/get.js'
    ```

您可以在终端运行以下命令以运行脚本：

```bash
node get.js
```

如果成功，数值将显示在终端。

### 交互合约（发送函数） {: #interact-with-contract }

发送函数是修改合约存储（更改变量）的交互类型，这意味着需要签署和发送交易。在这一部分，您将创建两个脚本：一个是增量，另一个是重置增量器。首先，您可以为每个脚本创建一个文件，并分别命名为`increment.js`和`reset.js`：

```bash
touch increment.js reset.js
```

接下来，打开`increment.js`文件并执行以下步骤以创建脚本：

1. 从`compile.js`文件导入`abi`
2. [设置Web3提供者](#setup-web3-with-moonbeam)
3. 定义初始账户的`privateKey`、已部署合约的`contractAddress`以及要增量的`_value`。此私钥将用于创建一个钱包实例。**请注意：此处操作仅用于演示目的，请勿将您的私钥存储在JavaScript文件中**
4. 使用`web3.eth.Contract`函数并传入`abi`和`contractAddress`创建合约实例
5. 通过合约实例使用`methods.increment`函数并传入`_value`作为输入值来构建增量交易
6. 创建异步`increment`函数
7. 使用您之前创建的合约实例和增量交易，使用发送者的私钥对交易进行签名。您将使用`web3.eth.accounts.signTransaction`函数并指定交易的`to`地址、`data`、`gas`、`gasPrice`、和`nonce`
8. 使用`web3.eth.sendSignedTransaction`发送已签署的交易并传入原始交易，然后使用`await`等待交易处理完毕并返回交易回执
9. 最后，调用`increment`函数

```js
// 1. Import the contract abi
const { abi } = require('./compile');

// 2. Add the Web3 provider logic here:
// {...}

// 3. Create variables
const accountFrom = {
  privateKey: 'INSERT_YOUR_PRIVATE_KEY',
  address: 'INSERT_PUBLIC_ADDRESS_OF_PK',
};
const contractAddress = 'INSERT_CONTRACT_ADDRESS';
const _value = 3;

// 4. Create contract instance
const incrementer = new web3.eth.Contract(abi, contractAddress);

// 5. Build increment tx
const incrementTx = incrementer.methods.increment(_value);

// 6. Create increment function
const increment = async () => {
  console.log(
    `Calling the increment by ${_value} function in contract at address: ${contractAddress}`
  );

  // 7. Prepare and sign tx with PK
  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      to: contractAddress,
      data: incrementTx.encodeABI(),
      gas: await incrementTx.estimateGas(),
      gasPrice: await web3.eth.getGasPrice(),
      nonce: await web3.eth.getTransactionCount(accountFrom.address),
    },
    accountFrom.privateKey
  );

  // 8. Send tx and wait for receipt
  const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
  );
  console.log(`Tx successful with hash: ${createReceipt.transactionHash}`);
};

// 9. Call increment function
increment();
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/build/eth-api/libraries/web3-js/increment.js'
    ```

您可以在终端运行以下命令以运行脚本：

```bash
node increment.js
```

如果成功，交易哈希将显示在终端。您可以在`increment.js`脚本旁边使用`get.js`脚本以确保数值如预期变化：

![Increment Contract Web3js](/images/builders/ethereum/libraries/web3js/web3js-3.webp)

接下来，您可以打开`reset.js`文件并执行以下步骤以创建脚本：

1. 从`compile.js`文件导入`abi`
2. [设置Web3提供者](#setup-web3-with-moonbeam)
3. 定义初始账户的`privateKey`、已部署合约的`contractAddress`。此私钥将用于创建一个钱包实例。**请注意：此处操作仅用于演示目的，请勿将您的私钥存储在JavaScript文件中**
4. 使用`web3.eth.Contract`函数并传入`abi`和`contractAddress`以创建合约实例
5. 使用`methods.reset`函数通过合约实例构建重置交易
6. 创建异步`reset`函数
7. 使用您之前创建的合约实例和增量交易，使用发送者的私钥对交易进行签名。您将使用`web3.eth.accounts.signTransaction`函数并指定交易的`to`地址、`data`、`gas`、`gasPrice`、和`nonce`
8. 使用`web3.eth.sendSignedTransaction`发送已签署的交易，然后使用`await`等待交易处理完毕并返回交易回执
9. 最后，调用`reset`函数

```js
// 1. Import the contract abi
const { abi } = require('./compile');

// 2. Add the Web3 provider logic here:
// {...}

// 3. Create variables
const accountFrom = {
  privateKey: 'INSERT_YOUR_PRIVATE_KEY',
  address: 'INSERT_PUBLIC_ADDRESS_OF_PK',
};
const contractAddress = 'INSERT_CONTRACT_ADDRESS';

// 4. Create Contract Instance
const incrementer = new web3.eth.Contract(abi, contractAddress);

// 5. Build reset tx
const resetTx = incrementer.methods.reset();

// 6. Create reset function
const reset = async () => {
  console.log(
    `Calling the reset function in contract at address: ${contractAddress}`
  );

  // 7. Sign tx with PK
  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      to: contractAddress,
      data: resetTx.encodeABI(),
      gas: await resetTx.estimateGas(),
      gasPrice: await web3.eth.getGasPrice(),
      nonce: await web3.eth.getTransactionCount(accountFrom.address),
    },
    accountFrom.privateKey
  );

  // 8. Send tx and wait for receipt
  const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
  );
  console.log(`Tx successful with hash: ${createReceipt.transactionHash}`);
};

// 9. Call reset function
reset();
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/build/eth-api/libraries/web3-js/reset.js'
    ```

您可以在终端运行以下命令以运行脚本：

```bash
node reset.js
```

如果成功，交易哈希将显示在终端。您可以在`reset.js`脚本旁边使用`get.js`脚本以确保数值如预期变化：

![Reset Contract Web3js](/images/builders/ethereum/libraries/web3js/web3js-4.webp)

--8<-- 'text/_disclaimers/third-party-content.md'
