---
title: 使用Foundry部署合约
description: 学习如何使用以太坊部署环境Foundry在Moonbeam编译、部署和调试Solidity智能合约。
---

# 使用Foundry部署合约至Moonbeam

## 概览 {: #introduction }

[Foundry](https://github.com/foundry-rs/foundry){target=_blank}是一个用Rust语言编写的以太坊部署环境，能够帮助开发者管理依赖项、编译项目、运行测试、部署合约以及从命令行与区块链交互。Foundry可以直接与Moonbeam的以太坊API交互，所以可以直接用于将智能合约部署至Moonbeam。

Foundry由四个工具组成：

- **[Forge](https://book.getfoundry.sh/forge/){target=_blank}** - 编译、测试和部署合约
- **[Cast](https://book.getfoundry.sh/cast/){target=_blank}** - 用于与合约交互的命令行界面
- **[Anvil](https://book.getfoundry.sh/anvil/){target=_blank}** - 用于开发目的的本地测试节点，可分叉预先存在的网络
- **[Chisel](https://book.getfoundry.sh/chisel/){target=_blank}** - 用于快速测试Solidity片段的Solidity REPL（交互式编程环境）

本教程将涵盖如何使用Foundry在Moonbase Alpha TestNet上编译、部署和调试以太坊智能合约。此教程同样适用于Moonbeam、Moonriver和Moonbeam开发节点。

## 查看先决条件 {: #checking-prerequisites }

开始之前，您将需要准备以下内容：

 - 拥有资金的账户。
 --8<-- 'text/_common/faucet/faucet-list-item.md'
 - 
 --8<-- 'text/_common/endpoint-examples-list-item.md'
 - 提前[安装Foundry](https://book.getfoundry.sh/getting-started/installation){target=_blank}

## 创建Foundry项目 {: #creating-a-foundry-project }

如果您尚未拥有Foundry项目，您需要通过以下步骤创建一个：

1. 如果您尚未安装，您需要先安装Foundry。如果您在Linux或MacOS系统操作，您可以运行以下命令：

    ```bash
    curl -L https://foundry.paradigm.xyz | bash
    foundryup
    ```

    如果在Windows系统操作，您必须安装Rust，然后从源代码构建Foundry：

    ```bash
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs/ | sh
    cargo install --git https://github.com/foundry-rs/foundry foundry-cli anvil --bins --locked
    ```

2. 创建项目，这将创建一个文件夹，其中包含三个文件夹：

    ```bash
    forge init foundry
    ```

创建默认项目后，您将看到以下三个文件夹：

- `lib` - 项目所有的依赖项以git子模块的形式
- `src` - 用于存放智能合约（以及功能）
- `test` - 用于存放项目的Forge测试，这些测试是用Solidity编写的

除了这三个文件夹，还将创建一个git项目以及一个预先编写的`.gitignore`文件，其中相关文件类型和文件夹被忽略。

## 源代码文件夹 {: #the-src-folder }

`src`文件夹可能已经包含`Counter.sol`（一个最小的Solidity合约），您可以自行删除此合约。同时为了避免可能出现的报错，您也需要删除 `scripts` 文件夹中的 `Counter.s.sol` 以及 `test` 文件夹中的 `Counter.t.sol`. 下一步您需要部署一个ERC-20合约。在合约目录中，您可以创建一个`MyToken.sol`文件：

```bash
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

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

## 编译Solidity {: #compiling-solidity }

安装完所有的依赖项后，您可以开始编译合约：

```bash
forge build
```

![Foundry Contract Compile](/images/builders/build/eth-api/dev-env/foundry/foundry-1.webp)

编译完成后，将创建两个文件夹：`out`和`cache`。您合约的ABI和字节码将包含在`out`文件夹中。这两个文件夹已被默认Foundry项目初始化中包含的`.gitignore`忽略。

## 部署合约 {: #deploying-the-contract }

使用Forge部署合约需要一个命令，但您将需要包含一个RPC端点、一个拥有资金的私钥和构造函数参数。`MyToken.sol`要求在其构造函数中提供Token初始供应量，因此以下每个命令将包含100作为构造函数。您可以为正确的网络使用命令部署`MyToken.sol`合约。

=== "Moonbeam"

    ```bash
    forge create --rpc-url {{ networks.moonbeam.rpc_url }} \
    --constructor-args 100 \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken
    ```

=== "Moonriver"

    ```bash
    forge create --rpc-url {{ networks.moonriver.rpc_url }} \
    --constructor-args 100 \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken
    ```

=== "Moonbase Alpha"

    ```bash
    forge create --rpc-url {{ networks.moonbase.rpc_url }} \
    --constructor-args 100 \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken
    ```

=== "Moonbeam开发节点"

    ```bash
    forge create --rpc-url {{ networks.development.rpc_url }} \
    --constructor-args 100 \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken
    ```

几分钟后，合约完成部署，您将在终端看到地址。

![Foundry Contract Deploy](/images/builders/build/eth-api/dev-env/foundry/foundry-2.webp)

恭喜您，您的合约已上线！保存地址，用于后续合约实例交互。

## 与合约交互 {: #interacting-with-the-contract }

Foundry包括cast，一个用于执行以太坊RPC调用的CLI。

尝试使用cast检索Token名称，其中`YOUR_CONTRACT_ADDRESS`是您在上一部分部署合约的地址：

=== "Moonbeam"

    ```bash
    cast call YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"

    ```bash
    cast call YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"

    ```bash
    cast call YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonbase.rpc_url }}
    ```

=== "Moonbeam开发节点"

    ```bash
    cast call YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.development.rpc_url }}
    ```

您需要获取此数据的hex格式：

```text
0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000074d79546f6b656e00000000000000000000000000000000000000000000000000
```

此数据非可读，但您可以使用cast将其转换成您想要的格式。在这种情况下，数据是文本，因此您可以将其转换为ascii字符以查看“My Token”：

![Foundry Contract View](/images/builders/build/eth-api/dev-env/foundry/foundry-3.webp)

```bash
cast --to-ascii 0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000074d79546f6b656e00000000000000000000000000000000000000000000000000
```

您也可以使用cast来改变数据。通过将其发送到0地址来尝试销毁Token。

=== "Moonbeam"

    ```bash
    cast send --private-key YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.moonbeam.rpc_url }} \
    --chain {{ networks.moonbeam.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonriver"

    ```bash
    cast send --private-key YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.moonriver.rpc_url }} \
    --chain {{ networks.moonriver.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonbase Alpha"

    ```bash
    cast send --private-key YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.moonbase.rpc_url }} \
    --chain {{ networks.moonbase.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonbeam开发节点"

    ```bash
    cast send --private-key YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.development.rpc_url }} \
    --chain {{ networks.development.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

交易将由您的Moonbase账户签署并传播到网络。输出应如下所示：

![Foundry Contract Interaction](/images/builders/build/eth-api/dev-env/foundry/foundry-4.webp)

恭喜您！您已成功使用Foundry部署和交互合约！

## 使用Anvil进行分叉 {: #forking-with-cast-anvil }

如上所述，[Anvil](https://book.getfoundry.sh/anvil/){target=_blank}是用于开发目的的本地测试网节点，可以分叉预先存在的网络。分叉Moonbeam允许用户与部署在网络上的实时合约交互。

使用Anvil分叉时需要注意一些限制。由于Anvil是基于EVM实现，因此您无法与任何Moonbeam已编译的合约及其功能交互。预编译是Substrate实现的一部分，因此无法在模拟的EVM环境中复制。从而，您无法与在Moonbeam上的跨链资产和基于Substrate的功能（如质押和治理）进行交互。

要分叉Moonbeam或Moonriver，您将需要用到您的端点和API钥匙，您可通过支持的[端点提供商](/builders/get-started/endpoints/){target=_blank}获取。

要从命令行分叉Moonbeam，您可以在Foundry项目的目录中运行以下命令：

=== "Moonbeam"

    ```bash
    anvil --fork-url {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"

    ```bash
    anvil --fork-url {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"

    ```bash
    anvil --fork-url {{ networks.moonbase.rpc_url }}
    ```

分叉的实例将拥有10个已经预先注资10,000测试Token的开发账户。分叉的实例位于`http://127.0.0.1:8545/`。终端输出应类似于以下内容：

![Forking terminal screen](/images/builders/build/eth-api/dev-env/foundry/foundry-5.webp)

要验证您是否已分叉了网络，您可以查询最新的区块号：

```bash
curl --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545 
```

如果您已经将`result`[从16进制转换成十进制](https://www.rapidtables.com/convert/number/hex-to-decimal.html){target=_blank}，您应该在分叉网络时获得了最新区块号。您可以[使用区块浏览器](/builders/get-started/explorers){target=_blank}交叉查询区块号。

从这里，您可以将新合约部署到您的Moonbeam的分叉实例或与已部署的合约进行交互。在本教程的上述示例的基础上，您可以使用Cast进行调用，来检查您部署合约的帐户中铸造的MYTOK Token的余额：

```bash
cast call INSERT_CONTRACT_ADDRESS  "balanceOf(address)(uint256)" INSERT_YOUR_ADDRESS --rpc-url http://localhost:8545
```

## 使用Chisel {: #using-chisel }

Chisel是一个Solidity REPL，或shell。它允许开发者直接在控制台中编写Solidity以测试比较小的代码片段，让开发者跳过项目设置和合约部署步骤，实现快速的操作流程。

由于Chisel主要用于快速测试，因此可以用于Foundry以外的项目。但是，如果在Foundry项目内执行，在运行时会将配置保留在`foundry.toml`中。

在本示例中，您将在Solidity中测试一些`abi`的功能。因为其相对比较复杂可以很好地演示Chisel的作用。要开始使用Chisel，请在命令行中运行以下命令以启动Chisel shell：

```bash
chisel
```

在Chisel shell中，您可以像在函数中运行一样编写Solidity代码：

```solidity
bytes memory myData = abi.encode(100, true, "Develop on Moonbeam");
```

假设您对`abi`如何编码数据感兴趣，因为您正在研究如何最有效地将数据存储在区块链上，从而节省gas费用。要查看`myData`是如何存储在内存中的，您可以在Chisel shell中使用以下命令：

```bash
!memdump
```

`memdump`将显示当前会话中的所有数据。您可能会看到类似下面这样的内容。如果您不熟悉hex格式或者ABI编码的工作原理，那么您可能无法找到`myData`变量的存储位置。

![memdump in Chisel](/images/builders/build/eth-api/dev-env/foundry/foundry-6.webp)

幸运的是，Chisel会轻松帮您找到这些信息存储位置。使用`!rawstack`命令，您可以找到变量值在栈中的位置。

```bash
!rawstack myData
```

在此情况下，因为字节的长度超过32个字节，因此将显示内存指针。这样您已经从`!memdump`命令了解了整个栈。

![rawstack in Chisel](/images/builders/build/eth-api/dev-env/foundry/foundry-7.webp)

`!rawstack`命令显示`myData`变量存储在`0x80`中，与从`!memdump`命令检索到的内存内容对比时，看起来`myData`存储如下所示：

```text
[0x80:0xa0]: 0x00000000000000000000000000000000000000000000000000000000000000a0
[0xa0:0xc0]: 0x0000000000000000000000000000000000000000000000000000000000000064
[0xc0:0xe0]: 0x0000000000000000000000000000000000000000000000000000000000000001
[0xe0:0x100]: 0x0000000000000000000000000000000000000000000000000000000000000060
[0x100:0x120]: 0x0000000000000000000000000000000000000000000000000000000000000013
[0x120:0x140]: 0x446576656c6f70206f6e204d6f6f6e6265616d00000000000000000000000000
```

乍一看数据很合理，因为`0xa0`的值`0x64`等于100，`0xc0`的值`0x01`等于true。如果您想要了解ABI编码的工作原理，请参考[ABI的Solidity文档](https://docs.soliditylang.org/en/v0.8.18/abi-spec.html){target=_blank}。在本示例中，这种数据打包方式有很多个零，因此作为智能合约开发者，您可以尝试使用结构或者bitwise（按位）代码更有效地将数据打包在一起。

由于您已经完成这段代码，您可以清除Chisel的状态，以防止其干扰您想要尝试的任何未来逻辑（在运行相同的Chisel实例时）：

```bash
!clear
```

测试Chisel还有一个更简单的方式。当编写以分号`;`结尾的代码时，Chisel将其作为一个语句来运行，并将其值存储在Chisel的Runtime（运行时）状态中。但是，如果您真的只需要查看ABI编码数据的表示方式，那么您可以将代码作为表达式运行。要使用相同的`abi`示例进行尝试，请在Chisel shell中编写以下内容：

```bash
abi.encode(100, true, "Develop on Moonbeam")
```

您应该看到如下所示输出：

![Expressions in Chisel](/images/builders/build/eth-api/dev-env/foundry/foundry-8.webp)

虽然它没有以相同的方式显示数据，但您仍然可以获得数据的内容，并且它还进一步分解了信息的编码方式，例如让您知道`0xa0`值定义了数据长度。

默认情况下，当您离开Chisel shell时，不会保留任何数据。但是你可以通过指示chisel进行操作。 例如，您可以执行以下步骤存储一个变量：

1. 在Chisel中存储`uint256`

    ```bash
    uint256 myNumber = 101;
    ```

2. 使用`!save`存储会话。在本示例中，您可以使用数字`1`作为存储ID

    ```bash
    !save 1
    ```

3. 退出对话

    ```bash
    !quit
    ```

然后，要查看并与您存储的Chisel状态进行交互，您可以执行以下步骤：

1. 查看存储的Chisel状态列表

     ```bash
     chisel list
     ```

2. 加载存储的状态

    ```bash
    chisel load
    ```

3. 查看上一组步骤中保存在Chisel中的`uint256`

    ```bash
    !rawstack myNumber
    ```

![Saving state in Chisel](/images/builders/build/eth-api/dev-env/foundry/foundry-9.webp)

您甚至可以在使用Chisel时分叉网络：

```bash
!fork {{ networks.moonbase.rpc_url }}
```

然后，例如，您可以查询其中一个Moonbase Alpha收集人的余额：

```text
0x4c5A56ed5A4FF7B09aA86560AfD7d383F4831Cce.balance
```

![Forking in Chisel](/images/builders/build/eth-api/dev-env/foundry/foundry-10.webp)

如果您想要获取关于Chisel的更多信息，请下载Foundry并参考其[官方页面](https://book.getfoundry.sh/reference/chisel/){target=_blank}。

## 通过Hardhat使用Foundry {: #foundry-with-hardhat }

通常，您希望集成的项目的所有设置都在[Hardhat](/builders/build/eth-api/dev-env/hardhat){target=_blank}中，因此将整个项目转换为Foundry是一项艰巨的任务。通过创建同时使用Hardhat和Foundry功能的混合项目，可以避免这项额外的工作。这可以通过Hardhat的[hardhat-foundry插件](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-foundry){target=_blank}来实现。

要将预先存在的Foundry项目转换成混合项目，您需要先在同一个文件夹中安装Hardhat项目：

```bash
npm init
npm install --save-dev hardhat @nomicfoundation/hardhat-foundry
npx hardhat init
```

更多信息，请参考[创建Hardhat项目](/builders/build/eth-api/dev-env/hardhat/#creating-a-hardhat-project){target=_blank}的文档。

初始化新的Hardhat项目后，将会出现一些新的文件夹和文件：`contracts`、`hardhat.config.js`、`scripts`和`test/Lock.js`。您只需稍微调整即可创建一个混合项目：

1. 在Repo中编辑`hardhat.config.js`文件。打开后，在头部添加下方指令：

    ```javascript
    require("@nomicfoundation/hardhat-foundry");
    ```

    添加`hardhat-foundry`插件后，Hardhat的`contracts`文件夹将失效，因为现在Hardhat期望所有智能合约都存储在Foundry的`src`文件夹中

2. 将`contracts`文件夹中的所有智能合约移至`src`文件夹，然后删除`contracts`文件夹
3. 编辑`foundry.toml`文件以确保通过Git子模块和npm安装的依赖项可以由Forge工具编译。编辑`profile.default`以确保`libs`条目同时具有`lib`和`node_modules`：

    ```toml
    [profile.default]
    src = 'src'
    out = 'out'
    libs = ['lib', 'node_modules']
    solc = '0.8.20'
    evm_version = 'london'
    ```

现在，无论依赖关系如何，`forge build`和`npx hardhat compile`都应该可以工作。
`forge test`和`npx hardhat test`现在应该能够访问所有智能合约和依赖项。`forge test`将仅用于Solidity测试，而`npx Hardhat test`将仅用于JavaScript测试。如果您想结合使用它们，那么您可以在`package.json`文件中创建一个新脚本：

```json
"scripts": {
    "test": "npx hardhat test && forge test"
}
```

您可以运行以下指令：

```bash
npm run test
```

最后，虽非必要，但可以将所有JavaScript脚本从`scripts`文件夹移动到Foundry的`script`文件夹中，并删除`scripts`文件夹，这样就不会出现两个具有相同用途的文件夹。

--8<-- 'text/_disclaimers/third-party-content.md'
