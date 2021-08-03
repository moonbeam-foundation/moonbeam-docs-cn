---
title: 部署合约
description: 学习如何使用Web3.js、Ethers.js或Web3.py，通过简单脚本将未经改动的基于Solidity的智能合约部署到Moonbeam节点。
---

# 如何使用以太坊库Moonbeam部署合约

![Ethereum Libraries Integrations Moonbeam](/images/sendtx/web3-libraries-banner.png)

## 概览 {: #introduction }

本教程将按步骤介绍如何通过Solidity编译器和三个不同的以太坊库，手动在Moonbeam签名并发送交易。以下为本教程所使用的三个库：

 - [Web3.js](https://web3js.readthedocs.io/)
 - [Ethers.js](https://docs.ethers.io/)
 - [Web3.py](https://web3py.readthedocs.io/)

您也可以使用另外两个库来编译智能合约

 - [Solc-js](https://www.npmjs.com/package/solc)是通过JavaScript实现的编译器
 - [Py-solc-x](https://pypi.org/project/py-solc-x/)是通过Python实现的编译器

!!! 注意事项
    --8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

## 检查先决条件 {: #checking-prerequisites }

本教程基于web3.js和ethers.js的以太坊库，您需要提前安装Node.js和NPM。若需参考基于web.py的教程，您需先安装Python和PIP。在撰写本教程时，使用的各版本如下：

 - Node.js v15.10.0
 - NPM v7.5.3
 - Python v3.6.9 (web3 requires Python >= 3.5.3 and < 4)
 - PIP3 v9.0.1

现在，使用以下命令创建一个目录，储存所有相关文件：

```
mkdir incrementer && cd incrementer/
```

若您使用JavaScript库，您可先创建一个简单的`package.json`文件（非必要）：

```
npm init --yes
```

在目录中，使用以下命令安装需要使用的库和Solidity编译器（_web3.py_和_py-solc-x_已安装在默认PIP3目录中）

=== "Web3.js"
    ```
    npm i web3 npm i solc@0.8.0
    ```

=== "Ethers.js"
    ```
    npm i ethers npm i solc@0.8.0
    ```

=== "Web3.py"
    ```
    pip3 install web3 pip3 install py-solc-x
    ```

撰写本教程时，所用各版本如下：

 - Web3.js v1.33 (`npm ls web3`)
 - Ethers.js v5.0.31 (`npm ls ethers`)
 - Solc (JS) v0.8.0 (`npm ls solc`)
 - Web3.py v5.17.0 (`pip3 show web3`)
 - Py-solc-x v1.1.0 (`pip3 show py-solc-x`)

此案例的设置相对简单，设置包含以下文件：

 - **_Incrementer.sol_** —— 拥有我们Solidity代码的文件
 - **_compile.\*_** —— 用Solidity编译器编译合约
 - **_deploy.\*_**: 将处理我们本地Moonbeam节点的部署工作
 - **_get.\*_** —— 将调用节点来获取「number」的当前值
 - **_increment.\*_** —— 将进行交易来增加存储在Moonbeam节点上的数量
 - **_reset.\*_** —— 此功能会将存储的数字重置为零

## 合约文件 {: #the-contract-file }

我们将使用一个简单的增量合约，任意为其命名为_Incrementer.sol_，您可在[这里](/snippets/code/web3-contract-local/Incrementer.sol)找到。相关Solidity代码如下：

```solidity
--8<-- 'code/web3-contract-local/Incrementer.sol'
```

`constructor`函数将在合约部署完成时运行，该函数设定储存在链上「number」变量的初始值（默认为0）。 `increment`函数把已经提供的`_value`添加到当前「number」，但需要发送交易，因为这会修改储存的数据。最后，`reset`函数将已储存的值重置归零。

!!! 注意事项
    此合约为简单演示，仅作说明用途，无实际价值。

## 合约编译 {: #compiling-the-contract }

编译文件的唯一目的是通过Solidity编译器生成合约的字节码和二进制接口（Application Binary Interface (ABI) ）。您可通过以下链接找到对应库的代码片段（文件被命名为`compile.*`）：

 - Web3.js: [_compile.js_](/snippets/code/web3-contract-local/compile.js)
 - Ethers.js: [_compile.js_](/snippets/code/web3-contract-local/compile.js)
 - Web3.py: [_compile.py_](/snippets/code/web3py-contract/compile.py)

!!! 注意事项
    两个JavaScript库的编译文件相同，因为他们绑定一个Solidity编译器（相同的包），同时共享JavaScript

=== "Web3.js"
    ```
    --8<-- 'code/web3-contract-local/compile.js'
    ```

=== "Ethers.js"
    ```
    --8<-- 'code/web3-contract-local/compile.js'
    ```

=== "Web3.py"
    ```
    --8<-- 'code/web3py-contract/compile.py'
    ```

### Web3.js和Ethers.js {: #web3js-and-ethersjs }

在[脚本](/snippets/code/web3-contract-local/compile.js)的第一部分，获取合约的路径，并读取其内容。

接下来，构建Solidity编译器的输入对象，并将其作为输入传递给`solc.compile`函数。

最后，提取并导出`Incrementer.sol`文件的`Incrementer`合约数据，以便部署脚本。

### Web3.py {: #web3py } 

在[脚本](/snippets/code/web3py-contract/compile.py)的第一部分，使用`solcx.compile_files`函数来编译合约文件。请注意，合约文件与编译脚本位于同一目录中。

!!! 注意事项
    当运行`compile.py`时，您可能会收到一个需要安装`Solc`的错误提示。如遇此情况，请取消在文件中注释执行`solcx.install_solc()`的行，并用`python3 compile.py`重新运行编译文件。更多信息您可通过[此链接](https://pypi.org/project/py-solc-x/)查看。

接下来，结束脚本，导出合约数据。在此例中，仅定义接口（ABI）和字节码。

## 合约部署 {: #deploying-the-contract }

无论使用哪种库，部署已编译智能合约的策略都有些相似。本合约实例使用其接口（ABI）和字节码所创建。部署功能可通过发送已签名的交易来部署合约。您可以通过以下链接找到对应库的代码片段（文件被命名为`deploy.*`）：

 - Web3.js: [_deploy.js_](/snippets/code/web3-contract-local/deploy.js)
 - Ethers.js: [_deploy.js_](/snippets/code/ethers-contract-local/deploy.js)
 - Web3.py: [_deploy.py_](/snippets/code/web3py-contract/deploy.py)

简单起见，部署文件由两个部分组成。如同前例，您使用的库、合约的ABI和字节码会在第一部分（"Define Provider & Variables"）被导入。此外，提供者和提供者的帐户（具有私钥）也会被定义。请注意，`providerRPC`同时拥有标准独立节点的RPC终端和[Moonbase Alpha](/networks/moonbase/)的终端。

第二部分（"Deploy Contract"）概述了实际的合约部署。请注意，在此例中，数字变量的初始值设置为5。其中部分关键要点我们将在后面展开讨论。

=== "Web3.js"
    ```
    --8<-- 'code/web3-contract-local/deploy.js'
    ```

=== "Ethers.js"
    ```
    --8<-- 'code/ethers-contract-local/deploy.js'
    ```

=== "Web3.py"
    ```
    --8<-- 'code/web3py-contract/deploy.py'
    ```

!!! 注意事项
    _deploy.*_ 脚本提供合约地址作为输出结果。 该脚本用于合约交互文件，使用便捷。

### Web3.js {: #web3js } 

在[此脚本](/snippets/code/web3-contract-local/deploy.js)的第一部分，您可以看到`web3`实例（或提供者（Provider））可通过带有提供者（Provider）RPC的`web3`构造创建。您可以通过改变提供者（Provider）RPC，选择要将交易发送到您指定的网络。

为了交易和日志记录，需定义私钥以及与之关联的地址，此处仅需要私钥。 此外，您可以从编译器的输出中获取字节码和接口（ABI）。

第二部分中，演示了如何通过ABI来创建合约实例。使用`deploy`函数生成构造函数交易，该函数需要构造函数的字节码和参数。

接下来，使用`web3.eth.accounts.signTransaction()`方式来签名构造函数交易。数据域对应字节码，与构造函数输入参数一起编码。请注意，使用构造函数中的`estimateGas()`选项来获得gas值。

最后，发送已签名的交易，同时合约地址也会显示。

### Ethers.js {: #ethersjs } 

[此脚本](/snippets/code/ethers-contract-local/deploy.js)的第一部分中，可以使用名称、RPC URL（必需）和Chain ID来指定不同的网络。提供者（Provider）（类似上述 `web3`实例）通过`ethers.providers.StaticJsonRpcProvider` 方式创建。另外还有一种方法是通过`ethers.providers.JsonRpcProvide(providerRPC)`方式，该方式只需要RPC终端地址。但是这种方法可能会产生与单个项目的兼容性问题。

需要用到上面提到的提供者 （Provider）和私钥来创建钱包实例，进而签名交易。此外，您可以从编译器的输出中获取字节码和ABI 。

在第二部分中，我们演示了如何使用ABI，字节码和钱包创建合约实例。因此，合约实例已经有签名器。接下来，使用`deploy`函数发送交易，该函数需要构造函数的输入参数。使用合约部署交易的`deployed()`函数来获取交易回执。

最后，显示合约地址。

### Web3.py {: #web3py } 

在[此脚本](/snippets/code/web3py-contract/deploy.py)的第一部分，您可看到使用带有提供者（Provider）RPC的 `Web3(Web3.HTTPProvider(provider_rpc))`创建`web3`实例（或提供者（Provider））。您可以通过改变提供者（Provider）RPC，选择要将交易发送到您指定的网络。

私钥和与之关联的公共地址功能：签名交易和建立来源地址。

在第二部分中，演示使用`web3.eth.contract()`创建合约实例，提供从编译文件导入的ABI和字节码。接下来，使用合约实例的`constructor().buildTransaction()`方法建立构造交易。请注意，在 `constructor()`代码中，您需要输入构造函数的所需参数，包含`from`即交易发送地址（请确保使用和私钥相关的地址）。此外，可以通过 `web3.eth.getTransactionCount(address)`方式获得交易个数。

使用`web3.eth.account.signTransaction()`签名交易，同时传输交易及私钥。

最后，发送已签名的交易，同时合约地址也会显示在终端。

## 合约读取（调用程序）{: #reading-from-the-contract-call-methods }

调用方法不需要修改合约存储（更改变量）的交互类型，这意味着无需发送任何交易。

下面简单介绍 _get.*_ 文件（调用方法中最简单的一种），该文件将获取合约中存储的当前值。您可以通过以下链接找到对应库的代码段（文件被命名为`get.*`):

 - Web3.js: [_get.js_](/snippets/code/web3-contract-local/get.js)
 - Ethers.js: [_get.js_](/snippets/code/ethers-contract-local/get.js)
 - Web3.py: [_get.py_](/snippets/code/web3py-contract/get.py)

简单起见，调用文件由两个部分组成。如同前例，您使用的库，合约的ABI和字节码会在第一部分（"Define Provider & Variables"）被导入。此外，提供者和合约地址也会被定义。请注意，`providerRPC`同时拥有标准独立节点的RPC终端和[Moonbase Alpha](/networks/moonbase/)的终端。

第二部分（“Call Function”）简述了合约的实际调用。无论使用哪种库，都将创建合约实例（链接到合约地址），并从中查询调用程序。其中部分关键要点我们将会在后面展开讨论。

=== "Web3.js"
    ```
    --8<-- 'code/web3-contract-local/get.js'
    ```

=== "Ethers.js"
    ```
    --8<-- 'code/ethers-contract-local/get.js'
    ```

=== "Web3.py"
    ```
    --8<-- 'code/web3py-contract/get.py'
    ```

### Web3.js {: #web3js } 

在[脚本](/snippets/code/web3-contract-local/get.js)的第一部分，`web3`实例（或提供者（Provider））是由带有提供者（Provider）RPC的`web3`构造创建。您可以通过改变提供者（Provider）RPC，选择要将交易发送到您指定的网络。

合约接口（ABI）和地址也需要与之交互。

第二部分，我们演示了通过提供的ABI和合约地址，使用``web3.eth.Contract()``创建合约实例。接下来，将合约实例、调用函数和输入（如有必要）替换为`contract`，`methodName`和`_input`，使用`contract.methods.methodName(_input).call()`函数来查询调用程序。这意味着脚本执行之后将返回值。

最后，显示返回值。

### Ethers.js {: #ethersjs } 

[此脚本](/snippets/code/ethers-contract-local/get.js)的第一部分中，使用名称、RPC URL（必需）和Chain ID来指定不同的网络。提供者(Provider)（类似上述`web3`实例）通过`ethers.providers.StaticJsonRpcProvider`方式创建。另外一种是通过`ethers.providers.JsonRpcProvide(providerRPC)`方式，该方式只需要RPC终端地址。但是这种方法可能会产生与单个项目的兼容性问题。

合约接口（ABI）和地址也需要与之交互。

第二部分中，我们演示了通过提供的合约地址、ABI以及提供者（Provider），使用 `ethers.Contract()`创建合约实例。接下来，将合约实例、调用函数和输入（如有必要）替换为 `contract` `methodName`和 `_input` ，使用 `contract.methodName(_input)`函数来查询调用程序。这意味着脚本执行之后将返回值。

最后，显示返回值。

### Web3.py {: #web3py } 

[此脚本](/snippets/code/web3py-contract/get.py)的第一部分中，您可以看到`web3`实例（或者提供者）是由`Web3(Web3.HTTPProvider(provider_rpc))`方式和提供者RPC创建。您可以通过改变提供者（Provider）RPC，选择要将交易发送到您指定的网络。

合约接口（ABI）和地址也需要与之交互。

在第二部分中，我们演示了通过提供ABI和地址，使用 `web3.eth.contract()`创建合约实例。接下来，将合约实例，调用函数和输入（如有必要）替换为 `contract`、 `methodName`和 `_input`，使用``contract.functions.method_name(input).call()`函数来查询调用程序。这意味着脚本执行之后将返回值。

最后，显示返回值。

## 合约交互（发送程序）{: #interacting-with-the-contract-send-methods }

发送程序是修改合约存储（更改变量）的交互类型，也就是需要对交易进行签名和发送。

首先，概述 _increment.*_ 文件，该文件将合约中存储的当前数字增加给定值。 您可以通过以下链接找到对应库的代码段（文件被命名为`increment。*`）：

 - Web3.js: [_increment.js_](/snippets/code/web3-contract-local/increment.js)
 - Ethers.js: [_increment.js_](/snippets/code/ethers-contract-local/increment.js)
 - Web3.py: [_increment.py_](/snippets/code/web3py-contract/increment.py)

简单起见，增量文件由两个部分组成。如同前例，使用的库以及合约的ABI和字节码会在第一部分（"Define Provider & Variables"）被导入。此外，提供者、合约地址和`increment`函数的值也会被定义。请注意，`providerRPC`同时拥有标准独立节点的RPC终端和[Moonbase Alpha](/networks/moonbase/)的终端。

第二部分（“Send Function”）简述了交易要调用的实际函数。无论使用哪种库，都将创建合约实例（链接到合约地址），并从中查询发送程序。

=== "Web3.js"
    ```
    --8<-- 'code/web3-contract-local/increment.js'
    ```

=== "Ethers.js"
    ```
    --8<-- 'code/ethers-contract-local/increment.js'
    ```

=== "Web3.py"
    ```
    --8<-- 'code/web3py-contract/increment.py'
    ```

其次，用来合约交互的文件是 _reset.*_ ，该文件的功能是将合约中存储的数字重置归零。您可以通过以下链接找到对应库的代码段（文件被命名为`reset.*`）：

 - Web3.js: [_reset.js_](/snippets/code/web3-contract-local/reset.js)
 - Ethers.js: [_reset.js_](/snippets/code/ethers-contract-local/reset.js)
 - Web3.py: [_reset.py_](/snippets/code/web3py-contract/reset.py)

每个文件的结构与每个库的 _increment.*_ 对应结构类似，主要区别在于调用程序。

=== "Web3.js"
    ```
    --8<-- 'code/web3-contract-local/reset.js'
    ```

=== "Ethers.js"
    ```
    --8<-- 'code/ethers-contract-local/reset.js'
    ```

=== "Web3.py"
    ```
    --8<-- 'code/web3py-contract/reset.py'
    ```

### Web3.js {: #web3js } 

在此脚本（[increment](/snippets/code/web3-contract-local/increment.js)或者[reset](/snippets/code/web3-contract-local/reset.js)文件）的第一部分，您可以看到`web3`实例（或提供者（Provider））是由带有提供者（Provider）RPC的`web3`构造创建。您可以通过改变提供者（Provider）RPC，将交易发送到您指定的网络。

定义私钥和与之关联的地址是为了交易和日志记录。此处仅需要私钥。 此外，合约接口（ABI）和地址也需要与之交互。如有必要，您可以定义所需的任何变量作为要与之交互的函数的输入。

在第二部分中，演示了通过提供ABI和地址，使用`web3.eth.Contract()`创建合约实例。接下来，将合约实例、调用函数和输入（如有必要）替换为`contract`，`methodName`和`_input`，使用`contract.methods.methodName(_input)`函数来构造交易对象。

接下来，使用`web3.eth.accounts.signTransaction()`方式来签名交易。数据域对应字节码，与构造函数输入参数一起编码。请注意，使用交易对象中的`estimateGas()`选项来获得gas值。

最后，发送已签名的交易，交易哈希也会同步显示。

### Ethers.js {: #ethersjs } 

在此脚本（[increment](/snippets/code/ethers-contract-local/increment.js)或者[reset](/snippets/code/ethers-contract-local/reset.js)文件）第一部分中，使用名称、RPC URL（必需）和Chain ID来指定不同的网络。提供者（Provider）（类似上述`web3`实例）由`ethers.providers.StaticJsonRpcProvider`方式创建。另外一种方法是通过`ethers.providers.JsonRpcProvide(providerRPC)`，该方式只需要RPC终端地址。但是这种方法可能会产生与单个项目的兼容性问题。

定义私钥是为了创建钱包实例，同样也需要前文提到的提供者（Provider）辅助。钱包实例的功能室签名交易。此外，合约接口（ABI）和地址也需要与之交互。如有必要，您可以定义所需的任何变量作为要与之交互的函数的输入。

在第二部分中，我们演示了通过ABI、地址以及钱包，通过`ethers.Contract()`创建合约实例。因此，合约实例已经有签名器。接下来，将合约实例，调用函数和输入（如有必要）替换 为`contract`、 `methodName`和`_input`，使用`contract.methodName(_input)`函数来发送与特定函数相对应的交易。使用合约部署交易的`wait()`函数来获取交易回执。

最后，交易哈希值可在终端显示。

### Web3.py {: #web3py } 

在此脚本（[increment](/snippets/code/web3py-contract/increment.py)或者[reset](/snippets/code/web3py-contract/reset.py)文件）的第一部分，您可以看到`web3`实例（或提供者（Provider））由带有提供者（Provider）RPC的`web3`构造创建。您可以通过改变提供者（Provider）RPC，选择要将交易发送到您指定的网络。

定义私钥和与之关联的地址是为了签名交易和创立发送地址。 此外，合约接口（ABI）和地址也需要与之交互。

在第二部分中，我们演示了通过提供ABI和地址，使用`web3.eth.contract()`创建合约实例。接下来，将合约实例、调用函数和输入（如有必要）替换为`contract`、`methodName`和`_input`，使用`contract.functions.methodName(_input).buildTransaction`函数来构建交易对象。在`buildTransaction()`代码中，您需要输入`from`交易发送地址（请确保使用和私钥相关的地址）。此外，可以通过`web3.eth.getTransactionCount(address)` 方式获得交易个数。

使用`web3.eth.account.signTransaction()`签名交易，同时传输上面步骤提到的交易对象及私钥。

最后，交易哈希值可在终端显示。

## 运行脚本 {: #running-the-scripts }

在本小节，您可以按照[本教程](/getting-started/local-node/setting-up-a-node/)运行适用于独立节点的代码。此外，每笔交易都是从节点随附的预付款帐户发送：

--8<-- 'text/metamask-local/dev-account.md'

首先，运行部署合同（请注意，此处已为每个库重命名目录）：

=== "Web3.js"
    ```
    node deploy.js
    ```

=== "Ethers.js"
    ```
    node deploy.js
    ```

=== "Web3.py"
    ```
    python3 deploy.py
    ```

这将部署合同并返回地址：

=== "Web3.js"
    ![Deploy Contract Web3js](/images/deploycontract/contract-deploy-web3js.png)

=== "Ethers.js"
    ![Deploy Contract Etherjs](/images/deploycontract/contract-deploy-ethers.png)

=== "Web3.py"
    ![Deploy Contract Web3py](/images/deploycontract/contract-deploy-web3py.png)

接下来，运行增量文件。 您可以使用「get」文件在递增之前和之后验证合约中存储的数字值：

=== "Web3.js"
    ```
    node get.js node increment.js node get.js
    ```

=== "Ethers.js"
    ```
    node get.js node increment.js node get.js
    ```

=== "Web3.py"
    ```
    python3 get.py python3 increment.py python3 get.py
    ```

这将显示增量交易之前的值，交易哈希以及增量之后的值：

=== "Web3.js"
    ![Increment Contract Web3js](/images/deploycontract/contract-increment-web3js.png)

=== "Ethers.js"
    ![Increment Contract Etherjs](/images/deploycontract/contract-increment-ethers.png)

=== "Web3.py"
    ![Increment Contract Web3py](/images/deploycontract/contract-increment-web3py.png)

最后，运行重置（reset）文件。再一次，您可使用get文件在递增之前和之后验证合约中存储的数字值：

=== "Web3.js"
    ```
    node get.js node reset.js node get.js
    ```

=== "Ethers.js"
    ```
    node get.js node reset.js node get.js
    ```

=== "Web3.py"
    ```
    python3 get.py python3 reset.py python3 get.py
    ```

这将显示重置交易之前的值，交易哈希以及重置之后的值：

=== "Web3.js"
    ![Reset Contract Web3js](/images/deploycontract/contract-reset-web3js.png)

=== "Ethers.js"
    ![Reset Contract Etherjs](/images/deploycontract/contract-reset-ethers.png)

=== "Web3.py"
    ![Reset Contract Web3py](/images/deploycontract/contract-reset-web3py.png)
