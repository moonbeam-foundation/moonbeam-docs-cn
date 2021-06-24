---
title: 发送交易
description: 学习如何使用web.js、 esthers.js和web3.py编写基础脚本在兼容以太坊网络的Moonbeam上创建并发送交易。
---

# 如何通过以太坊库在Moonbeam发送交易

![Ethereum Libraries Integrations Moonbeam](/images/sendtx/web3-libraries-banner.png)

## 概览

本教程将按步骤介绍如何使用三个不同的以太坊库在Moonbeam手动签署并发送交易。以下为本教程使用的三个库：

 - [Web3.js](https://web3js.readthedocs.io/)
 - [Ethers.js](https://docs.ethers.io/)
 - [Web3.py](https://web3py.readthedocs.io/)

!!! 注意事项
    --8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

## 检查先决条件

若需使用基于web3.js和ethers.js的例程，您需要提前安装Node.js和NPM。若需使用基于web3.py的例程，您需要安装Python和PIP。以下为本教程所使用的版本（截止至本文撰写时）：

 - Node.js v15.10.0
 - NPM v7.5.3
 - Python v3.6.9 (web3 requires Python >= 3.5.3 and < 4)
 - PIP3 v9.0.1

现在，我们可以使用以下命令创建一个目录来储存所有相关文件：

```
mkdir transaction && cd transaction/
```

如果您使用的是JavaScript库，您可先创建一个简单的`package.json`文件（非强制）：

```
npm init --yes
```

在目录中，通过以下命令安装要使用的库（web3.py会被安装到PIP3的默认目录中）：

=== "Web3.js"
    ```
    npm i web3
    ```

=== "Ethers.js"
    ```
    npm i ethers
    ```

=== "Web3.py"
    ```
    pip3 install web3
    ```

我们撰写本教程时，使用的各版本如下：

 - Web3.js v1.33 (`npm ls web3`)
 - Ethers.js v5.0.31 (`npm ls ethers`)
 - Web3.py v5.17.0 (`pip3 show web3`)

## 交易文件

只需一个文件即可执行帐户之间的交易。我们会示范如何通过以下脚本，从拥有私钥的初始地址转账1个代币至另一个指定地址。您可以通过以下链接找到对应库的代码片段（文件被命名为`transaction.*`）：

 - Web3.js: [_transaction.js_](/snippets/code/web3-tx-local/transaction.js)
 - Ethers.js: [_transaction.js_](/snippets/code/ethers-tx-local/transaction.js)
 - Web3.py: [_transaction.py_](/snippets/code/web3py-tx/transaction.py)

无论使用哪个库，每个文件都被分为三个部分：第一部分（“Define Provider & Variables”），导入需使用的库，被定义的提供者以及其他变量（变量会随着库的改变而改变）。请注意，`providerRPC`同时拥有标准独立节点RPC端点和[Moonbase Alpha](/networks/testnet/)的端点。

第二部分（“Create and Deploy Transaction”），概述了传送交易所需要的函数。其中部分关键要点我们将会在后面展开讨论。

=== "Web3.js"
    ```
    --8<-- 'code/web3-tx-local/transaction.js'
    ```

=== "Ethers.js"
    ```
    --8<-- 'code/ethers-tx-local/transaction.js'
    ```

=== "Web3.py"
    ```
    --8<-- 'code/web3py-tx/transaction.py'
    ```

### Web3.js

[脚本](/snippets/code/web3-tx-local/transaction.js)的第一部分，`web3`实例（或提供者）通过RPC提供的`Web3`构造函数创建。您可以通过改变构造函数的提供者RPC，选择要将交易发送到哪个网络。

私钥及其关联的公共地址分别用于交易签名及日志记录。仅需提供私钥即可。

还有一点必不可少，定义`addressTo`，即交易接收地址。

第二部分，使用`to`、`value`和`gas`字段创建交易对象。这些字段分别描述了交易接收地址，交易金额，以及交易消耗的Gas（本示例中为21000）。比如，您可以通过使用`web3.utils.toWei()`函数输入需要交易的ETH数量并转换成以WEI为单位的输出。调用`web3.eth.accounts.signTransaction()`方法对交易进行私钥签名。请注意，这里您需要解决一个「返回请求」。

接下来，您可以调用 `web3.eth.sendSignedTransaction()`发送签名后的交易（通过`console.log(createTransaction)`查看v-r-s价值），需要提供位于`createTransaction.rawTransaction`的已签名交易。

最后，请运行异步部署函数。

### Ethers.js

[脚本](/snippets/code/ethers-tx-local/transaction.js)的第一部分，您可以使用名字、RPC URL（必需）和Chain ID来指定不同的网络。另一种方式是调用`ethers.providers.StaticJsonRpcProvider`或`ethers.providers.JsonRpcProvide(providerRPC)`创建提供者（类似于`web3`实例），后者仅需提供者RPC的端点地址，但调用此函数能会导致与某些项目格式规范的兼容性问题。

私钥可用于创建钱包实例，需要上一步内提及的提供者辅助。钱包实例可用于对交易进行签名。

还有一点必不可少，定义`addressTo`，即交易接收地址。

在第二部分，用异步函数封装`wallet.sendTransaction(txObject)`的方法。交易对象相对简单，只需提供接收者的地址以及转账数量即可。请注意，您也可以使用`ethers.utils.parseEther()`来控制ETH与WEI之间的单位转换，这与使用`ethers.utils.parseUnits(value,'ether')`相似。

当交易发送成功，您会收到具有一些属性的交易回复（在该示例中被命名为`createReceipt`）。比如，您可以调用`createReceipt.wait()`方法来等待交易处理完毕（当接收状态为「OK」，即表示交易处理完毕）。

最后，请运行异步部署函数。

### Web3.py

在[脚本](/snippets/code/web3py-tx/transaction.py)的第一部分， `web3`实例（或是提供者）是使用提供者RPC的`Web3(Web3.HTTPProvider(provider_rpc))`所创建的。您可以通过改变提供者RPC，选择要将交易发送到哪个网络。

私钥及其关联的公共地址分别用于交易签名及日志记录。无需提供公共地址。

还有一点必不可少，定义`addressTo`，即交易接收地址。

在第二部分，使用`nonce`、 `gasPrice`、 `gas`、 `to`和`value`字段创建交易对象。这些字段分别描述了交易数量、gas价格（Moonbase Alpha与独立节点之间的gas价格为0）、交易消耗的gas（本示例中为21000）、交易接收地址及交易金额。请注意，您可通过`web3.eth.getTransactionCount(address)`查阅交易数量。比如，您可通过`web3.utils.toWei()`函数，输入需要交易的ETH数量并转换成以WEI为单位的输出。调用`web3.eth.account.signTransaction()`方法对交易进行私钥签名。

交易签名成功后，您可调用`web3.eth.sendSignedTransaction()`进行交易，需要提供位于`createTransaction.rawTransaction`的已签名交易。

## 余额文件

在运行脚本之前，您需要在交易前和交易后检查您的余额文件。您可通过简单的查询账户余额来进行检查。

您可通过以下链接找到对应库的代码段（文件被命名为`balances.*`）：

 - Web3.js: [_balances.js_](/snippets/code/web3-tx-local/balances.js)
 - Ethers.js: [_balances.js_](/snippets/code/ethers-tx-local/balances.js)
 - Web3.py: [_balances.py_](/snippets/code/web3py-tx/balances.py)

简单起见，余额文件由两个部分组成。如同前例，您要使用的库会在第一部分（“Define Provider & Variables”）被导入，提供者和发送/接收地址（查询余额）也会被定义。

第二部分（“Balance Call Function”）概述了获取先前定义的账户余额的所需函数。请注意，`providerRPC`同时拥有标准独立节点的RPC端点和[Moonbase Alpha](/networks/testnet/)的端点。其中的关键要点我们将会在后面展开讨论。

=== "Web3.js"
    ```
    --8<-- 'code/web3-tx-local/balances.js'
    ```

=== "Ethers.js"
    ```
    --8<-- 'code/ethers-tx-local/balances.js'
    ```

=== "Web3.py"
    ```
    --8<-- 'code/web3py-tx/balances.py'
    ```

### Web3.js

[此脚本](/snippets/code/web3-tx-local/balances.js)的第一部分与[交易文件](/getting-started/local-node/send-transaction/#web3js)非常相似，最大的不同是没有发送交易的需求，此脚本不需要您的私钥。

第二部分中，调用封装了web3方法的异步函数`web3.eth.getBalance(address)`来获取地址余额。同时，您可以使用`web3.utils.fromWei()`函数将余额转换成更容易识别ETH数量的计量单位。

### Ethers.js

[此脚本](/snippets/code/ethers-tx-local/balances.js)的第一部分与[交易文件](/getting-started/local-node/send-transaction/#ethersjs)非常相似，最大的不同是无需私钥传送交易需求。但是，您仅需要定义`addressFrom`。

在第二部分中，通过调用封装了提供者方法的异步函数`provider.getBalance(address)`获取地址余额。同时，您也可以使用`ethers.utils.formatEther()`函数，将余额转换成更容易识别ETH数量的计量单位。

### Web3.py

[此脚本](/snippets/code/web3py-tx/balances.py)的第一个部分与[交易文件](/getting-started/local-node/send-transaction/#web3py)非常相似。最大的不同是无需私钥传送交易需求。

第二部分中，调用`web3.eth.getBalance(address)`来获取接收地址的余额。同时，您也可以使用`eb3.fromWei()`函数，将余额转换成更容易识别ETH数量的计量单位。

## 如何运行脚本

在这个部分，之前所显示的代码已针对独立节点进行了调整，您可以根据以下[教程](/getting-started/local-node/setting-up-a-node/)来运行。与此同时，每笔交易均从节点随附的预付款帐户发送。

--8<-- 'text/metamask-local/dev-account.md'

首先，在交易前使用以下命令检查双方的余额（注：目录已为每个库重命名）：

=== "Web3.js"
    ```
    node balances.js
    ```

=== "Ethers.js"
    ```
    node balances.js
    ```

=== "Web3.py"
    ```
    python3 balances.py
    ```

接着，运行_transaction.*_ 脚本来执行此项交易：

=== "Web3.js"
    ```
    node transaction.js
    ```

=== "Ethers.js"
    ```
    node transaction.js
    ```

=== "Web3.py"
    ```
    python3 transaction.py
    ```

最后，再次检查账户余额以确认转账是否成功，如下图所示：

=== "Web3.js"
    ![Send Tx Web3js](/images/sendtx/sendtx-web3js.png)

=== "Ethers.js"
    ![Send Tx Etherjs](/images/sendtx/sendtx-ethers.png)

=== "Web3.py"
    ![Send Tx Web3py](/images/sendtx/sendtx-web3py.png)