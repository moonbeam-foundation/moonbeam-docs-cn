---
title: 如何使用Ethereum Web3.py代码库
description: 通过本教程学习如何使用以太坊Web3 Python代码库在Moonbeam上发送交易和部署Solidity智能合约。
---

# Web3.py Python代码库

## 概览 {: #introduction }

[Web3.py](https://web3py.readthedocs.io/)是一组代码库，允许开发者使用Python，并通过HTTP、IPC或WebSocket协议与以太坊节点交互。Moonbeam拥有与以太坊相似的API供用户使用，其与以太坊风格的JSON-RPC调用完全兼容。因此，开发者可以利用此兼容特性并使用Web3.py库与Moonbeam节点交互，与在以太坊操作相同。

在本教程中，您将学习如何使用Web3.py库在Moonbase Alpha上发送交易和部署合约。本教程也同样适用于[Moonbeam](/builders/get-started/networks/moonbeam/){target=_blank}、[Moonriver](/builders/get-started/networks/moonriver/){target=_blank}或[Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev/){target=_blank}。

## 查看先决条件 {: #checking-prerequisites }

在开始本教程示例之前，您将需要提前准备以下内容：

 - 具有拥有一定数量资金的账户。
  --8<-- 'text/_common/faucet/faucet-list-item.md'
 - 
  --8<-- 'text/_common/endpoint-examples-list-item.md'

!!! 注意事项
    --8<-- 'text/_common/assumes-mac-or-ubuntu-env.md'

## 创建Python项目 {: #create-a-python-project }

首先，您需要创建一个目录，以存储您在本教程中将要创建的所有文件：

```bash
mkdir web3-examples && cd web3-examples
```

在本教程中，您将需要安装Web3.py代码库和Solidity编译器。您可以通过运行以下命令来安装两者的安装包：

```bash
pip3 install web3 py-solc-x solc-select
```

## 在Moonbeam上设置Web3.py {: #setup-web3-with-moonbeam }

在这个文章中，您将会创建多个用来实现不同功能的脚本；比如发送交易，部署智能合约，与已部署的智能合约交互。在大部的脚本中您都需要创建一个[Web3.py provider](https://web3py.readthedocs.io/en/stable/providers.html)来与网路互动。

--8<-- 'text/_common/endpoint-setup.md'

您需要通过以下步骤来创建一个provider:

1. 导入`web3`代码库
2. 用`Web3(Web3.HTTPProvider())`方法创建一个`web3`provider并提供一个网络终端URL

=== "Moonbeam"

    ```python
    # 1. 导入web3.py
    from web3 import Web3
    
    # 2. 创建web3.py provider
    web3 = Web3(Web3.HTTPProvider("{{ networks.moonbeam.rpc_url }}")) # Insert your RPC URL here
    ```

=== "Moonriver"

    ```python
    # 1. 导入web3.py
    from web3 import Web3
    
    # 2. 创建web3.py provider
    web3 = Web3(Web3.HTTPProvider("{{ networks.moonriver.rpc_url }}")) # Insert your RPC URL here
    ```

=== "Moonbase Alpha"

    ```python
    # 1. 导入web3.py
    from web3 import Web3
    
    # 2. 创建web3.py provider
    web3 = Web3(Web3.HTTPProvider("{{ networks.moonbase.rpc_url }}"))
    ```

=== "Moonbeam开发节点"

    ```python
    # 1. 导入web3.py
    from web3 import Web3
    
    # 2. 创建web3.py provider
    web3 = Web3(Web3.HTTPProvider("{{ networks.development.rpc_url }}"))
    ```

您可以记下这个代码范例，您将在之后部分的脚本示例中使到它。

## 发送交易 {: #send-a-transaction }

在这一部分，您将需要创建一些脚本。第一个脚本将用于发送交易前查看账户余额。第二个脚本将执行交易。

您也可以使用余额脚本在交易发送后查看账户余额。

### 查看余额脚本 {: #check-balances-script }

您仅需要一个文件以查看交易发送前后两个地址的余额。首先，您可以运行以下命令创建一个`balances.py`文件：

```bash
touch balances.py
```

接下来，您将为此文件创建脚本并完成以下步骤：

1. [设置Web3提供者](#setup-web3-with-moonbeam)
2. 定义`address_from`和`address_to`变量
3. 使用`web3.eth.get_balance`函数获取账户余额并使用`web3.from_wei`格式化结果

```python
--8<-- 'code/builders/build/eth-api/libraries/web3-py/balances.py'
```

您可以运行以下命令以运行脚本并获取账户余额：

```bash
python3 balances.py
```

如果成功，发送地址和接收地址的余额将以ETH为单位显示在终端。

### 发送交易脚本 {: #send-transaction-script }

您仅需要一个文件即可在账户之间执行交易。在本示例中，您将从拥有私钥的发送地址转移1个DEV Token至另一个地址。首先，您可以运行以下命令创建一个`transaction.py`文件：

```bash
touch transaction.py
```

接下来，您将为此文件创建脚本并完成以下步骤：

1. 添加导入，包含Web3.py和`rpc_gas_price_strategy`，将会用于以下步骤以获得交易使用的Gas价格
2. [设置Web3提供者](#setup-web3-with-moonbeam)
3. 定义`account_from`，包括`private_key`和`address_to`变量。此处需要私钥以签署交易。**请注意：此处操作仅用于演示目的，请勿将您的私钥存储在Python文件中**
4. 使用[Web3.py Gas Price API](https://web3py.readthedocs.io/en/stable/gas_price.html){target=_blank}设置gas价格策略。在本示例中，您将使用导入的`rpc_gas_price_strategy`
5. 使用`web3.eth.account.sign_transaction`函数创建和签署交易，传入交易的`nonce`、`gas`、`gasPrice`、`to`和`value`以及发送者的`private_key`。您可以通过`web3.eth.get_transaction_count`函数并传入发送者地址获取`nonce`。您可以通过`web3.eth.generate_gas_price`函数预设`gasPrice`。您可以通过`web3.to_wei`函数将数字格式化成以Wei为单位的易读数字
6. 使用`web3.eth.send_raw_transaction`函数发送已签署交易，然后使用`web3.eth.wait_for_transaction_receipt`函数等待获取交易回执

```python
--8<-- 'code/builders/build/eth-api/libraries/web3-py/transaction.py'
```

您可以在终端运行以下命令以运行脚本：

```bash
python3 transaction.py
```

如果交易成功，您将在终端看到显示的交易哈希。

您也可以使用`balances.py`脚本为发送地址和接收地址查看余额是否变化。整体操作流程如下所示：

![Send Tx Web3py](/images/builders/build/eth-api/libraries/web3py/web3py-1.webp)

## 部署合约 {: #deploy-a-contract }

--8<-- 'text/builders/build/eth-api/libraries/contract.md'

### 编译合约脚本 {: #compile-contract-script }

在这一部分，您将创建一个脚本，此脚本使用Solidity编译器为`Incrementer.sol`合约输出字节码和接口（ABI）。首先，您可以运行以下命令创建一个`compile.py`文件：

```bash
touch compile.py
```

接下来，您将为此文件创建脚本并完成以下步骤：

1. 导入`solcx`程序包
2. **（可选）**如果您还未安装Solidity编译器，您可以通过`solcx.install_solc`函数进行安装
3. 使用`solcx.compile_files`函数编译`Incrementer.sol`函数
4. 导出合约的ABI和字节码

```python
--8<-- 'code/builders/build/eth-api/libraries/web3-py/compile.py'
```

!!! 注意事项
    如果您遇到`Solc is not installed`报错，反注释代码示例的第二步并运行它。

### 部署合约脚本 {: #deploy-contract-script }

有了用于编译`Incrementer.sol`合约的脚本，您就可以使用结果以发送部署的签名交易。首先，您可以为部署的脚本创建一个名为`deploy.py`的文件：

```bash
touch deploy.py
```

接下来，您将为此文件创建脚本并完成以下步骤：

1. 添加导入，包含Web3.py以及ABI和`Incrementer.sol`合约的字节码
2. [设置Web3提供者](#setup-web3-with-moonbeam)
3. 定义`account_from`，包括`private_key`变量。此私钥将用于签署交易。**请注意：此处操作仅用于演示目的，请勿将您的私钥存储在Python文件中**
4. 使用`web3.eth.contract`函数并传入合约的ABI和字节码创建合约实例
5. 使用合约实例并传入需要增量的数值创建构造交易。在本示例中，您可以将数值设置为`5`。随后，您将使用`build_transaction`函数传入交易信息，包括发送者的`from`和`nonce`。您可以通过`web3.eth.get_transaction_count`函数获取`nonce`
6. 使用`web3.eth.account.sign_transaction`函数签署交易并传入构造交易和发送者的`private_key`
7. 使用`web3.eth.send_raw_transaction`函数发送已签署交易，然后使用`web3.eth.wait_for_transaction_receipt`函数等待获取交易回执

```python
--8<-- 'code/builders/build/eth-api/libraries/web3-py/deploy.py'
```

您可以在终端运行以下命令以运行脚本：

```bash
python3 deploy.py
```

如果成功，合约地址将显示在终端。

![Deploy Contract Web3py](/images/builders/build/eth-api/libraries/web3py/web3py-2.webp)

### 读取合约数据（调用函数） {: #read-contract-data }

调用函数是无需修改合约存储（更改变量）的交互类型，这意味着无需发送交易，只需读取已部署合约的各种存储变量。

首先，您需要创建一个文件并命名为`get.py`：

```bash
touch get.py
```

接下来，您可以遵循以下步骤创建脚本：

1. 添加导入，包含Web3.py以及ABI和`Incrementer.sol`合约的字节码
2. [设置Web3提供者](#setup-web3-with-moonbeam)
3. 定义部署合约中的contract_address
4. 使用`web3.eth.contract`函数并传入已部署合约的ABI和地址创建合约实例
5. 使用合约实例，您随后可以调用`number`函数

```python
--8<-- 'code/builders/build/eth-api/libraries/web3-py/get.py'
```

您可以在终端运行以下命令以运行脚本：

```bash
python3 get.py
```

如果成功，数值将显示在终端。

### 交互合约（发送函数） {: #interact-with-contract }

发送函数是修改合约存储（更改变量）的交互类型，这意味着需要签署和发送交易。在这一部分，您将创建两个脚本：一个是增量，另一个是重置增量器。首先，您可以为每个脚本创建一个文件，并分别命名为`increment.py`和`reset.py`：

```bash
touch increment.py reset.py
```

接下来，打开`increment.py`文件并执行以下步骤以创建脚本：

1. 添加导入，包含Web3.py以及ABI和`Incrementer.sol`合约的字节码
2. [设置Web3提供者](#setup-web3-with-moonbeam)
3. 定义`account_from`，包括`private_key`、已部署合约`contract_address`以及要增量的`value`。此私钥将用于签署交易。**请注意：此处操作仅用于演示目的，请勿将您的私钥存储在Python文件中**
4. 使用`web3.eth.Contract`函数并传入已部署合约的ABI和地址以创建合约实例
5. 使用合约实例和传入要增量的数值创建构造交易。随后，您将使用`build_transaction`函数传入交易信息，包括发送者的`from`地址和`nonce`。您可以通过`web3.eth.get_transaction_count`函数获取`nonce`
6. 使用`web3.eth.account.sign_transaction`函数签署交易并传入增量交易和发送者的`private_key`
7. 使用`web3.eth.send_raw_transaction`函数发送已签署交易，然后使用`web3.eth.wait_for_transaction_receipt`函数等待获取交易回执

```python
--8<-- 'code/builders/build/eth-api/libraries/web3-py/increment.py'
```

您可以在终端运行以下命令以运行脚本：

```bash
python3 increment.py
```

如果成功，交易哈希将显示在终端。您可以在`increment.py`脚本旁边使用`get.py`脚本以确保数值如预期变化：

![Increment Contract Web3py](/images/builders/build/eth-api/libraries/web3py/web3py-3.webp)

接下来，您可以打开`reset.py`文件并执行以下步骤以创建脚本：

1. 添加导入，包含Web3.py以及ABI和`Incrementer.sol`合约的字节码
2. [设置Web3提供者](#setup-web3-with-moonbeam)
3. 定义`account_from`，包括`private_key`和已部署合约`contract_address`。此私钥将用于签署交易。**请注意：此处操作仅用于演示目的，请勿将您的私钥存储在Python文件中**
4. 使用`web3.eth.contract`函数并传入已部署合约的ABI和地址以创建合约实例
5. 使用合约实例构建重置交易。随后，您将使用`build_transaction`函数传入交易信息，包括发送者的`from`地址和`nonce`。您可以通过`web3.eth.get_transaction_count`函数获取`nonce`
6. 使用`web3.eth.account.sign_transaction`函数签署交易并传入重置交易和发送者的`private_key`
7. 使用`web3.eth.send_raw_transaction`函数发送已签署交易，然后使用`web3.eth.wait_for_transaction_receipt`函数等待获取交易回执

```python
--8<-- 'code/builders/build/eth-api/libraries/web3-py/reset.py'
```

您可以在终端运行以下命令以运行脚本：

```bash
python3 reset.py
```

如果成功，交易哈希将显示在终端。您可以在`reset.py`脚本旁边使用`get.py`脚本以确保数值如预期变化：

![Reset Contract Web3py](/images/builders/build/eth-api/libraries/web3py/web3py-4.webp)

--8<-- 'text/_disclaimers/third-party-content.md'
