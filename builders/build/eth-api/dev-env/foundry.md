---
title: 使用Foundry部署合约
description: 学习如何使用以太坊部署环境Foundry在Moonbeam编译、部署和调试Solidity智能合约。
---

# 使用Foundry部署合约至Moonbeam

![Foundry Create Project](/images/builders/build/eth-api/dev-env/foundry/foundry-banner.png)

## 概览 {: #introduction }

[Foundry](https://github.com/foundry-rs/foundry){target=_blank}是一个用Rust语言编写的以太坊部署环境，能够帮助开发者管理依赖项、编译项目、运行测试、部署合约以及从命令行与区块链交互。Foundry可以直接与Moonbeam的以太坊API交互，所以可以直接用于将智能合约部署至Moonbeam。

Foundry由三个工具组成：

- **Forge** - 编译、测试和部署合约
- **Cast** - 用于与合约交互的命令行界面
- **Anvil** - 用于开发目的的本地测试节点，可分叉预先存在的网络

本教程将涵盖如何使用Foundry在Moonbase Alpha TestNet上编译、部署和调试以太坊智能合约。此教程同样适用于Moonbeam、Moonriver和Moonbeam开发节点。

## 查看先决条件 {: #checking-prerequisites }

开始之前，您将需要准备以下内容：

 - 拥有资金的账户
    --8<-- 'text/faucet/faucet-list-item.md'
 - 
--8<-- 'text/common/endpoint-examples.md'
 - 提前[安装Foundry](https://book.getfoundry.sh/getting-started/installation){target=_blank}

## 创建Foundry项目 {: #creating-a-foundry-project }

如果您尚未拥有Foundry项目，您需要通过以下步骤创建一个：

1. 如果您尚未安装，您需要先安装Foundry。如果您在Linux或MacOS系统操作，您可以运行以下命令：

    ```
    curl -L https://foundry.paradigm.xyz | bash
    foundryup
    ```
    
    如果在Windows系统操作，您必须安装Rust，然后从源代码构建Foundry：

    ```
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs/ | sh
    cargo install --git https://github.com/foundry-rs/foundry foundry-cli anvil --bins --locked
    ```
    
2. 创建项目，这将创建一个文件夹，其中包含3个文件夹：

    ```
    forge init foundry
    ```

创建默认项目后，您将看到以下三个文件夹：

- `lib` - 项目所有的依赖项以git子模块的形式
- `src` - 用于存放智能合约（以及功能）
- `test` - 用于存放项目的Forge测试，这些测试是用Solidity编写的

除了这三个文件夹，还将创建一个git项目以及一个预先编写的`.gitignore`文件，其中相关文件类型和文件夹被忽略。

## 源代码文件夹 {: #the-src-folder }

`src`文件夹可能已经包含`Contract.sol`（一个最小的Solidity合约），您可以自行删除此合约。相反，您需要部署一个ERC-20合约。在合约目录中，您可以创建一个`MyToken.sol`文件：

```
cd src
touch MyToken.sol
```

打开文件并添加以下合约：

```solidity
pragma solidity ^0.8.0;

// Import OpenZeppelin Contract
import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

// This ERC-20 contract mints the specified amount of tokens to the contract creator
contract MyToken is ERC20 {
  constructor(uint256 initialSupply) ERC20("MyToken", "MYTOK") {
    _mint(msg.sender, initialSupply);
  }
}
```

在尝试编译合约之前，您需要安装OpenZeppelin合约作为依赖项。您可能需要先将以前的更改提交到git。默认情况下，Foundry使用git子模块而非npm程序包，因此没有使用传统的npm导入路径和命令。相反，使用OpenZeppelin Github repo的名称。

```
forge install OpenZeppelin/openzeppelin-contracts
```

## 编译Solidity {: #compiling-solidity }

安装完所有的依赖项后，您可以开始编译合约：

```
forge build
```

![Foundry Contract Compile](/images/builders/build/eth-api/dev-env/foundry/foundry-1.png)

编译完成后，将创建两个文件夹：`out`和`cache`。您合约的ABI和字节码将包含在`out`文件夹中。这两个文件夹已被默认Foundry项目初始化中包含的`.gitignore`忽略。

## 部署合约 {: #deploying-the-contract }

使用Forge部署合约需要一个命令，但您将需要包含一个RPC端点、一个拥有资金的私钥和构造函数参数。`MyToken.sol`要求在其构造函数中提供Token初始供应量，因此以下每个命令将包含100作为构造函数。您可以为正确的网络使用命令部署`MyToken.sol`合约。

=== "Moonbeam"
    ```
    forge create --rpc-url {{ networks.moonbeam.rpc_url }} \
    --constructor-args 100 \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken 
    ```

=== "Moonriver"
    ```
    forge create --rpc-url {{ networks.moonriver.rpc_url }} \
    --constructor-args 100 \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken 
    ```

=== "Moonbase Alpha"
    ```
    forge create --rpc-url {{ networks.moonbase.rpc_url }} \
    --constructor-args 100 \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken 
    ```

=== "Moonbeam开发节点"
    ```      
    forge create --rpc-url {{ networks.development.rpc_url }} \
    --constructor-args 100 \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken 
    ```

几分钟后，合约完成部署，您将在终端看到地址。

![Foundry Contract Deploy](/images/builders/build/eth-api/dev-env/foundry/foundry-2.png)

恭喜您，您的合约已上线！保存地址，用于后续合约实例交互。

## 与合约交互 {: #interacting-with-the-contract }

Foundry包括cast，一个用于执行以太坊RPC调用的CLI。

尝试使用cast检索Token名称，其中`YOUR_CONTRACT_ADDRESS`是您在上一部分部署合约的地址：

=== "Moonbeam"
    ```
    cast call YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"
    ```
    cast call YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"
    ```
    cast call YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonbase.rpc_url }}
    ```

=== "Moonbeam开发节点"
    ```      
    cast call YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.development.rpc_url }}
    ```

您需要获取此数据的hex格式：

```
0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000074d79546f6b656e00000000000000000000000000000000000000000000000000
```

此数据非可读，但您可以使用cast将其转换成您想要的格式。在这种情况下，数据是文本，因此您可以将其转换为ascii字符以查看“My Token”：

![Foundry Contract View](/images/builders/build/eth-api/dev-env/foundry/foundry-3.png)

```
cast --to-ascii 0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000074d79546f6b656e00000000000000000000000000000000000000000000000000
```

您也可以使用cast来改变数据。通过将其发送到0地址来尝试销毁Token。

=== "Moonbeam"
    ```
    cast send --private-key YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.moonbeam.rpc_url }} \
    --chain {{ networks.moonbeam.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonriver"
    ```
    cast send --private-key YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.moonriver.rpc_url }} \
    --chain {{ networks.moonriver.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonbase Alpha"
    ```
    cast send --private-key YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.moonbase.rpc_url }} \
    --chain {{ networks.moonbase.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonbeam开发节点"
    ```      
    cast send --private-key YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.development.rpc_url }} \
    --chain {{ networks.development.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

交易将由您的Moonbase账户签署并传播到网络。输出应如下所示：

![Foundry Contract Interaction](/images/builders/build/eth-api/dev-env/foundry/foundry-4.png)

恭喜您！您已成功使用Foundry部署和交互合约！

--8<-- 'text/disclaimers/third-party-content.md'