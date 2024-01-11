---
title: Brownie
description: 利用Moonbeam的EVM兼容性，使用以太坊开发环境Brownie在Moonbeam上使用Python编译、部署和调试智能合约。
---

# 使用Brownie在Moonbeam上进行部署

## 概览 {: #introduction }

[Brownie](https://eth-brownie.readthedocs.io/){target=_blank}是一个以太坊开发环境，用于协助Python开发者管理和自动化构建智能合约以及DApp所需的重复性任务。Brownie能够直接与Moonbeam的以太坊API交互，因此其可以用于在Moonbeam上部署智能合约。

本教程将会包含如何在Moonbase Alpha测试网使用Brownie与以太坊式智能合约进行编译、部署和交互。此教程也同样适用于Moonbeam、Moonriver以及Moonbeam开发节点。

## 查看先决条件 {: #checking-prerequisites }

首先，您需要准备以下先决条件：

 - 安装MetaMask并[连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - 具有拥有一定数量资金的账户。
  --8<-- 'text/_common/faucet/faucet-list-item.md'
 - 
--8<-- 'text/_common/endpoint-examples-list-item.md'

## 创建Brownie项目 {: #creating-a-brownie-project }

您将会需要安装Brownie并创建一个Brownie项目（如果您尚未创建）。您可以选择创建一个空白的项目或是使用[Brownie mix](https://eth-brownie.readthedocs.io/en/stable/init.html?highlight=brownie%20mix#creating-a-project-from-a-template){target=_blank}（基础的项目模板）创建项目。本教程将以创建一个空白的项目为例，您可以通过跟随以下步骤进行操作：

1. 为您的项目创建目录

    ```bash
    mkdir brownie && cd brownie
    ```

2. 如果您尚未安装`pipx`，执行以下命令进行安装

    ```bash
    python3 -m pip install --user pipx
    python3 -m pipx ensurepath
    ```

3. [使用`pipx`安装Brownie](https://eth-brownie.readthedocs.io/en/stable/install.html){target=_blank}。如果您尚未安装`pipx` ，您可以跟随上个步骤进行安装

    ```bash
    pipx install eth-brownie
    ```

    !!! 注意事项
        [`pipx`](https://github.com/pypa/pipx){target=_blank}用于运行本地安装在您的项目中的可执行文件。Brownie将会被安装在一个虚拟环境中并可在命令行直接使用。

4. 创建项目

    ```bash
    brownie init
    ```

![Create Brownie project](/images/builders/build/eth-api/dev-env/brownie/brownie-1.png)

您的Brownie项目应包含以下空白目录：

- **build** —— 用于例如来自编译的合约代码的项目数据
- **contracts** —— 用于储存智能合约文件
- **interfaces** —— 用于项目所需的智能合约接口
- **reports** —— 用于在[Brownie GUI](https://eth-brownie.readthedocs.io/en/stable/gui.html){target=_blank}使用的JSON报告文件
- **scripts** —— 为Python脚本用于部署合约或是其他自动化事务存在的地方
- **tests** —— 用于储存测试项目的Python脚本。Brownie将使用`pytest`框架进行单位测试

另外一个不被包含但需要注意且同样重要的文件为`brownie-config.yaml`配置文件。此配置文件为可选项，在自定义特定设置，如默认网络、编译器版本和设置时将会派上用场。

## 网络配置 {: #network-configuration }

要部署至Moonbeam网络，您需要添加并配置网络。Brownie中的网络配置需通过命令行添加。Brownie可以被用于开发和生产环境。

从版本1.19.3开始，Brownie开箱即可支持Moonbeam、Moonriver和Moonbase Alpha。要查看支持的网络的完整列表，您可以运行以下命令：

```bash
brownie networks list
```

![Network list](/images/builders/build/eth-api/dev-env/brownie/brownie-2.png)

如果您希望将合约部署到Moonbeam开发节点，则需要添加网络配置。在后台，Brownie使用Ganache开发环境。但是，由于Moonbeam开发节点将充当您自己的个人开发环境，因此不需要Ganache。因此，您可以将开发节点配置为“live”网络。

要添加Moonbeam开发节点配置，您可以运行以下命令：

```bash
brownie networks add Moonbeam moonbeam-dev host={{ networks.development.rpc_url }} name=Development chainid={{ networks.development.chain_id }}
```

如果您成功添加了网络，您将会在终端看到关于网络细节的成功信息。

要部署Moonbeam网络或是在特定网络上进行测试，您可以通过以下命令扩展至指定的网络：

=== "Moonbeam"

    ```bash
    --network moonbeam-main
    ```

=== "Moonriver"

    ```bash
    --network moonriver-main
    ```

=== "Moonbase Alpha"

    ```bash
    --network moonbeam-test
    ```

=== "Moonbeam开发节点"

    ```bash
    --network moonbeam-dev
    ```

如果您希望设置默认网络，您可以通过添加以下代码段至`brownie-config.yaml`配置文件进行操作：

=== "Moonbeam"

    ```yaml
    networks:
        default: moonbeam-main
    ```

=== "Moonriver"

    ```yaml
    networks:
        default: moonriver-main
    ```

=== "Moonbase Alpha"

    ```yaml
    networks:
        default: moonbeam-test
    ```

=== "Moonbeam开发节点"

    ```yaml
    networks:
        default: moonbeam-dev
    ```

!!! 注意事项
    请注意`brownie-config.yaml`并不会由系统自动创建，您需要自行创建此目录文件。

## 账户配置 {: #account-configuration }

在您部署合约之前，您需要配置您的账户，其同样为通过命令行进行操作。您可以运行以下命令添加新的账户：

```bash
brownie accounts new {INSERT_ACCOUNT_NAME}
```

请确认您将`{INSERT_ACCOUNT_NAME}`替换成您想要设置的账户名称。在本教程中，`alice`将会是账户名称。

系统将跳出弹窗提示您输入私钥和加密账户密码。如果账户被成功配置，您将会在终端中看到您的账户地址。

![Add account](/images/builders/build/eth-api/dev-env/brownie/brownie-3.png)

## 合约文件 {: #the-contract-file }

接着您可以在`contracts`目录中创建合约。在本教程中，您将部署的智能合约为`Box`，用于存储后续读取的数据。您可以运行以下命令创建一个`Box.sol`合约：

```bash
cd contracts && touch Box.sol
```

打开文件并添加以下合约内容：

```solidity
// contracts/Box.sol
pragma solidity ^0.8.1;

contract Box {
    uint256 private value;

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Stores a new value in the contract
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
}
```

## 编译Solidity {: #compiling-solidity }

要编译合约您可以运行以下命令：

```bash
brownie compile
```

![Compile Brownie project](/images/builders/build/eth-api/dev-env/brownie/brownie-4.png)

!!! 注意事项
    首次编译合约时需要安装`solc`二进制文件，因此可能需要较长的时间。

在成功编译后，您将会在`build/contracts`目录中找到您的文件。此文件包含智能合约的字节码和元数据，皆为`.json`文件。此外，`build`目录应当处于`.gitignore`文件之中，如果并非如此，请您将其移入。

如果您希望设置指定的编译器版本，您可以在`brownie-config.yaml`文件中操作。请注意，如果您尚未创建此文件，您需要创建一个。接着，您可以指定编译器（如下所示）：

```yaml
compiler:
  evm_version: london
  solc:
    version: 0.8.13
    optimizer:
      enabled: true
      runs: 200
```

当Brownie接收到更改的消息时，您的合约才会重新编译。您可以运行以下命令强制执行新的编译：

```bash
brownie compile --all
```

## 部署合约 {: #deploying-the-contract }

要部署`Box.sol`智能合约，您将需要撰写一个简单的部署脚本。您可以在`scripts`目录中创建一个新文件并将其命名为`deploy.py`：

```bash
cd scripts && touch deploy.py
```

接着，您将需要撰写您的部署脚本。您可以跟随以下步骤开始进行操作：

1. 从`brownie`导入`Box`合约和`accounts`模块

2. 使用`accounts.load()`加载您的账户，这将解密您的文件并根据提供的账户名称获取账户信息

3. 使用实例中存在的`deploy`函数指定`from`账户和`gas_limit`以将其实例化

```py
# scripts/deploy.py
from brownie import Box, accounts

def main():
    account = accounts.load("alice")
    return Box.deploy({"from": account, "gas_limit": "200000"})
```

您可以使用`run`命令并指定网络来部署`Box.sol`合约：

=== "Moonbeam"

    ```bash
    brownie run scripts/deploy.py --network moonbeam-main
    ```

=== "Moonriver"

    ```bash
    brownie run scripts/deploy.py --network moonriver-mainn
    ```

=== "Moonbase Alpha"

    ```bash
    brownie run scripts/deploy.py --network moonbeam-test
    ```

=== "Moonbeam开发节点"

    ```bash
    brownie run scripts/deploy.py --network moonbeam-dev
    ```

在数秒后，合约将会被部署且在终端中可见。

![Deploy Brownie project](/images/builders/build/eth-api/dev-env/brownie/brownie-5.png)

恭喜您，您的合约已上线！您可以储存地址，您将会在下个步骤中使用该地址并与之交互。

## 与合约交互 {: #interacting-with-the-contract }

您可以使用Brownie控制台与合约交互以进行快速调试和测试，也可以编写脚本进行交互。

### 使用Brownie控制台 {: #using-brownie-console }

要与您新部署的合约交互，您可以在Brownie控制台中运行以下命令：

=== "Moonbeam"

    ```bash
    brownie console --network moonbeam-main
    ```

=== "Moonriver"

    ```bash
    brownie console --network moonriver-main
    ```

=== "Moonbase Alpha"

    ```bash
    brownie console --network moonbeam-test
    ```

=== "Moonbeam开发节点"

    ```bash
    brownie console --network moonbeam-dev
    ```

随后，合约实例将会自动在终端中可见且可访问。它将会被打包在`ContractContainer`中，并允许您部署新的合约实例。要访问部署的合约，您可以使用`Box[0]`。您可以跟随以下步骤，调用`store`函数并将数值设置为`5`：

1. 为合约创建一个变量

    ```bash
    box = Box[0]
    ```

2. 使用您的账户调用`store`函数并将数值设置为`5`

    ```bash
    box.store(5, {'from': accounts.load('alice'), 'gas_limit': '50000'})
    ```

3. 输入您账户的密码

此交易将会由您的账户签署并传送至网络。现在，您可以通过以下步骤获取数据：

1. 调用`retrieve`函数

    ```bash
    box.retrieve({'from': accounts.load('alice')})
    ```

2. 输入密码

您将会看见`5`或是任何您先前储存的数据。

![Interact with Brownie project](/images/builders/build/eth-api/dev-env/brownie/brownie-6.png)

恭喜您！您已经成功通过Brownie部署合约并与之交互！

### 使用脚本 {: #using-a-script }

您还可以编写一个脚本来与您新部署的合约进行交互。首先，您可以在`scripts`目录中创建一个新文件：

```bash
cd scripts && touch store-and-retrieve.py
```

接下来，您需要编写存储和查询数值的脚本。请执行以下步骤：

1. 从`brownie`导入`Box`合约和`accounts`模块
2. 使用`accounts.load()`加载您的帐户，它会解密密钥库文件并返回给定帐户名称的帐户信息
3. 为`Box`合约创建一个变量
4. 使用`store`和`retrieve`函数存储一个值，然后检索它并打印到控制台

```py
# scripts/store-and-retrieve.py
from brownie import Box, accounts

def main():
    account = accounts.load("alice")
    box = Box[0]
    store = box.store(5, {"from": accounts.load("alice"), "gas_limit": "50000"})
    retrieve = box.retrieve({"from": accounts.load("alice")})
```

要运行脚本，您可以使用以下命令：

=== "Moonbeam"

    ```bash
    brownie run scripts/store-and-retrieve.py --network moonbeam-main
    ```

=== "Moonriver"

    ```bash
    brownie run scripts/store-and-retrieve.py --network moonriver-main
    ```

=== "Moonbase Alpha"

    ```bash
    brownie run scripts/store-and-retrieve.py --network moonbeam-test
    ```

=== "Moonbeam开发节点"

    ```bash
    brownie run scripts/store-and-retrieve.py --network moonbeam-dev
    ```

您需要输入Alice的密码才能发送交易以更新存储值。交易完成后，您应该会在控制台上看到交易哈希和“5”。

恭喜，您已成功部署并使用Brownie与合约交互！

--8<-- 'text/_disclaimers/third-party-content.md'
