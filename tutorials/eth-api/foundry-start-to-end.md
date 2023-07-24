---
title: Foundry开发生命周期（从开始到结束）
description: 遵循本分步教程学习如何使用Foundry在Moonbeam上构建项目，从编写智能合约和测试到在测试网和主网上进行部署。
---

# 在Moonbeam上使用Foundry

![Banner Image](/images/tutorials/eth-api/foundry-start-to-end/foundry-banner.png)

_作者：Jeremy Boetticher_

## 概览 {: #introduction }

Foundry已成为越来越受欢迎的用于开发智能合约的开发环境，因其只需要一种语言（Solidity）即可使用。建议您在开始使用Foundry之前，先阅读[在Moonbeam网络上使用Foundry的介绍文章](/builders/build/eth-api/dev-env/foundry){target=_blank}。在本教程中，我们将深入代码库，以全面了解如何正确开发、测试和部署。

在本次操作演示中，我们将部署两个智能合约。一个是Token，另一个将基于此Token上。我们也将编写单元测试以确保合约如预期运作。要部署合约，我们要先编写脚本，Foundry将使用此脚本来决定部署逻辑。最后，我们要在Moonbeam网络的区块浏览器上验证智能合约。

## 查看先决条件 {: #checking-prerequisites }

开始之前，您将需要准备以下内容：

 - 拥有资金的账户
    --8<-- 'text/faucet/faucet-list-item.md'
 -
--8<-- 'text/common/endpoint-examples.md'
 - [安装Foundry](https://book.getfoundry.sh/getting-started/installation){target=_blank}
 - 一个[Moonscan API密钥](/builders/build/eth-api/verify-contracts/api-verification/#generating-a-moonscan-api-key){target=_blank}

## 创建Foundry项目 {: #create-a-foundry-project }

首先，创建一个Foundry项目。如果您已安装Foundry，您可以运行以下命令：

```bash
forge init foundry && cd foundry
```

这将使`forge`实用程序初始化一个名为`foundry`的新文件夹，并在其中初始化一个Foundry项目。`script`、`src`和`test`文件夹中可能已经有文件。请确保将其删除，因为我们会在之后编写自己的文件。

在编写任何代码之前，您需要先做一些事情。首先，我们要添加对[OpenZeppelin的智能合约](https://github.com/OpenZeppelin/openzeppelin-contracts){target=_blank}的依赖，因其包含一些有用的合约，将用于编写Token智能合约。为此，使用其GitHub代码库名称来完成添加:

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

这会将OpenZeppelin git子模块添加到您的`lib`文件夹中。 为确保此依赖项已映射，您可以覆盖特殊文件`remappings.txt`中的映射：

```bash
forge remappings > remappings.txt
```

该文件中的每一行都是可以在项目的智能合约中引用的依赖项之一。可以编辑和重命名依赖项，以便在处理智能合约时更容易引用不同的文件夹和文件。如果正确安装了OpenZeppelin，将显示与下方类似的输出：

```
ds-test/=lib/forge-std/lib/ds-test/src/
forge-std/=lib/forge-std/src/
openzeppelin-contracts/=lib/openzeppelin-contracts/
```

最后，打开`foundry.toml`文件。在准备Etherscan验证和部署时，将此添加到文件中：

```toml
[profile.default]
src = 'src'
out = 'out'
libs = ['lib']
solc_version = '0.8.17'

[rpc_endpoints]
moonbase = "https://rpc.api.moonbase.moonbeam.network"
moonbeam = "https://rpc.api.moobeam.network"

[etherscan]
moonbase = { key = "${MOONSCAN_API_KEY}" }
moonbeam = { key = "${MOONSCAN_API_KEY}" }
```

第一个添加的是`profile.default`下面的`solc_version`的规范。`rpc_endpoints`标签允许您定义在部署到命名网络时要使用的RPC端点，在本例中为Moonbase Alpha和Moonbeam。`etherscan`标签允许您添加用于智能合约验证的Etherscan API密钥，我们将在之后展开讨论。

## 添加智能合约 {: #add-smart-contracts-in-foundry }

Foundry中默认部署的智能合约属于`src`文件夹。 在本教程中，我们将编写两个智能合约。 首先从Token开始：

```bash
touch MyToken.sol
```

打开文件并添加以下内容：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin Contract
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

// This ERC-20 contract mints the specified amount of tokens to the contract creator
contract MyToken is ERC20 {
  constructor(uint256 initialSupply) ERC20("MyToken", "MYTOK") {
    _mint(msg.sender, initialSupply);
  }

  // An external minting function allows anyone to mint as many tokens as they want
  function mint(uint256 toMint, address to) external {
    require(toMint <= 1 ether);
    _mint(to, toMint);
  }
}
```

如您所见，OpenZeppelin `ERC20`智能合约是通过`remappings.txt`中定义的映射导入的。

第二个智能合约（我们将其命名为`Container.sol`）将依赖于这个Token合约。这是一个简单的合约，包含我们将要部署的ERC-20 Token。您可以通过执行以下命令来创建文件：

```bash
touch Container.sol
```

打开文件并添加以下内容：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin Contract
import {MyToken} from "./MyToken.sol";

enum ContainerStatus {
    Unsatisfied,
    Full,
    Overflowing
}

contract Container {
    MyToken token;
    uint256 capacity;
    ContainerStatus public status;

    constructor(MyToken _token, uint256 _capacity) {
        token = _token;
        capacity = _capacity;
        status = ContainerStatus.Unsatisfied;
    }

    // Updates the status value based on the number of tokens that this contract has
    function updateStatus() public {
        address container = address(this);
        uint256 balance = token.balanceOf(container);
        if (balance < capacity) {
            status = ContainerStatus.Unsatisfied;
        } else if (balance == capacity) {
            status = ContainerStatus.Full;
        } else if (_isOverflowing(balance)) {
            status = ContainerStatus.Overflowing;
        }
    }

    // Returns true if the contract should be in an overflowing state, false if otherwise
    function _isOverflowing(uint256 balance) internal view returns (bool) {
        return balance > capacity;
    }
}
```

`Container`智能合约可以根据其持有的Token数量及其设置的初始容量值来更新其状态。如果只有的Token数量大于其容量，则状态可以更新为`Overflowing`。如果持有的Token数量等于容量，则状态可以更新为`Full`。否则，合约将开始并保持`Unsatisfied`状态。

`Container`需要一个`MyToken`智能合约实例才能运行，因此当我们部署时，我们需要逻辑来确保其与`MyToken`智能合约实例一起部署。

## 编写测试 {: #write-tests }

在我们部署任何合约至测试网或主网前，建议您先测试您的智能合约。多种测试类型如下所示：

- **单元测试（Unit tests）** — 允许您测试智能合约功能的特定部分。当您编写自己的智能合约时，建议您将功能分成不同的部分，以便进行单元测试
- **模糊测试（Fuzz tests）** — 允许您使用各种输入测试智能合约以检查边缘情况
- **集成测试（Integration tests）** — 允许您在智能合约与其他智能合约一起工作时对其进行测试，以便您了解其能够在已部署的环境中按预期运作
    - **分叉测试（Forking tests）** - 允许您创建分叉（网络的副本）的集成测试，以便您可以在预先存在的网络上模拟一系列交易

### Foundry中的单元测试 {: #unit-tests-in-foundry}

要开始为此教程编写测试，先在`test`文件中创建一个新的文件：

```bash
cd test
touch MyToken.t.sol
```

根据惯例，所有的测试需要以`.t.sol`结尾并以正在测试的智能合约名称开始。实际上，测试可以存储在任何地方，如果有以*"test"*开始的函数，则被视为测试。

接下来，开始为Token智能合约编写测试。打开`MyToken.t.sol`并添加以下内容：

```solidity
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken public token;

    // Runs before each test
    function setUp() public {
        token = new MyToken(100);
    }

    // Tests if minting during the constructor happens properly
    function testConstructorMint() public {
        assertEq(token.balanceOf(address(this)), 100);
    }
}
```

我们来分析一下此处的代码：第一行是典型的Solidity文件：设置Solidity版本。接下来的两行是导入。`forge-std/Test.sol`是Forge（也就是Foundry）包含的用于帮助测试的标准库。这包括`Test`智能合约，某些断言（assertion）和[forge cheatcodes](https://book.getfoundry.sh/forge/cheatcodes){target=_blank}。

如果您查看`MyTokenTest`智能合约，您将看到两个函数。第一个是`setUp`，在每个测试之前运行。因此在此测试合约中，每次运行测试函数时都会部署`MyToken`新实例。如果函数以*"test"* 开头，则该函数为测试函数。所以第二个函数`testConstructorMint`是一个测试函数。

现在，我们再写一些关于`Container`的测试：

```bash
touch Container.t.sol
```

然后添加以下内容：

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {MyToken} from "../src/MyToken.sol";
import {Container, ContainerStatus} from "../src/Container.sol";

contract ContainerTest is Test {
    MyToken public token;
    Container public container;

    uint256 constant CAPACITY = 100;

    // Runs before each test
    function setUp() public {
        token = new MyToken(1000);
        container = new Container(token, CAPACITY);
    }

    // Tests if the container is unsatisfied right after constructing
    function testInitialUnsatisfied() public {
        assertEq(token.balanceOf(address(container)), 0);
        assertTrue(container.status() == ContainerStatus.Unsatisfied);
    }

    // Tests if the container will be "full" once it reaches its capacity
    function testContainerFull() public {
        token.transfer(address(container), CAPACITY);
        container.updateStatus();

        assertEq(token.balanceOf(address(container)), CAPACITY);
        assertTrue(container.status() == ContainerStatus.Full);
    }
}
```

此测试合约有两个测试，所以在运行测试时，会有`MyToken`和`Container`的两次部署，总共为4个智能合约。您可以运行以下命令来查看测试结果：

```bash
forge test
```

测试时，您将看到以下输出：

![Unit Testing in Foundry](/images/tutorials/eth-api/foundry-start-to-end/foundry-1.png)

### Foundry中的测试套件（Test Harness） {: #test-harnesses-in-foundry }

有时候您会希望在智能合约中对`internal`函数进行单元测试。为此，您需要编写测试套件智能合约，其继承自智能合约并将内部函数公开作为公共函数。

举例来说，在`Container`中有一个名为`_isOverflowing`的内部函数，用于检查智能合约是否有比容量更多的Token。要测试此函数，请添加以下测试套件智能合约至`Container.t.sol`文件中：

```solidity
contract ContainerHarness is Container {
    constructor(MyToken _token, uint256 _capacity) Container(_token, _capacity) {}

    function exposed_isOverflowing(uint256 balance) external view returns(bool) {
        return _isOverflowing(balance);
    }
}
```

在`ContainerTest`智能合约里面，您可以添加一个新测试，用于测试之前不可读取的`_isOverflowing`合约：

```solidity
    // Tests for negative cases of the internal _isOverflowing function
    function testIsOverflowingFalse() public {
        ContainerHarness harness = new ContainerHarness(token , CAPACITY);
        assertFalse(harness.exposed_isOverflowing(CAPACITY - 1));
        assertFalse(harness.exposed_isOverflowing(CAPACITY));
        assertFalse(harness.exposed_isOverflowing(0));
    }
```

现在，当您用`forge test`运行测试时，您将看到`testIsOverflowingFalse`已经通过！

![Test Harness in Foundry](/images/tutorials/eth-api/foundry-start-to-end/foundry-2.png)

### Foundry中的模糊测试 {: #fuzzing-tests-in-foundry}

当您编写单元测试时，您只能使用一些输入进行测试。您可以尝试测试边缘情况，选择一些值，可以是一个或者两个随机值。但是在处理输入时，有无数种不同的输入需要测试。如何保证其适用于每个值？如果把少于10个的输入替换成10000个不同的输入，会不会更安全呢？

开发者可以测试很多输入的最佳方式之一是通过模糊测试（fuzzing或fuzz测试）。当测试函数中包含输入时，Foundry会自动进行模糊测试。为了说明这一点，将以下测试添加到`MyToken.t.sol`中的`MyTokenTest`合约。

```solidity
    // Fuzz tests for success upon minting tokens one ether or below
    function testMintOneEtherOrBelow(uint256 amountToMint) public {
        vm.assume(amountToMint <= 1 ether);

        token.mint(amountToMint, msg.sender);
        assertEq(token.balanceOf(msg.sender), amountToMint);
    }
```

这些测试包含`uint256 amountToMint`作为输入，告知Foundry使用`uint256`输入进行模糊测试。默认情况下，Foundry将输入256个不同的输入，但可以使用[`FOUNDRY_FUZZ_RUNS`环境变量](https://book.getfoundry.sh/reference/config/testing#runs){target=_blank}配置。

此外，该函数的第一行使用`vm.assume`以仅使用小于等于1 ether的输入，如果有人试图一次铸造超过1 ether，则`mint`函数将返还。此cheatcode可以帮助您将模糊测试引导到正确的范围。

我们来看一下另一个放入`MyTokenTest`合约中的模糊测试，但是我们预计会失败：

```solidity
    // Fuzz tests for failure upon minting tokens above one ether
    function testFailMintAboveOneEther(uint256 amountToMint) public {
        vm.assume(amountToMint > 1 ether);
        
        token.mint(amountToMint, msg.sender);
    }
```

在Foundry中，当你预想到测试会失败，您无需以*"test"*开始，可以直接以*"testFail"*开始测试函数名。在此测试中，我们假设`amountToMint`超过1 ether（即结果会失败）。

现在运行测试：

```bash
forge test
```

您将在控制台看到以下类似输出：

![Fuzzing Tests in Foundry](/images/tutorials/eth-api/foundry-start-to-end/foundry-3.png)

### Foundry中的分叉测试 {: #forking-tests-in-foundry}

在Foundry中，您可以在本地分叉网络，从而您可以测试合约如何在已部署合约的环境中运行。举例来说，如果有人在Moonbeam上已部署需要Token智能合约的智能合约`A`，您可以分叉Moonbeam网络并在分叉上部署您自己的Token以测试智能合约`A`如何反应。

!!! 注意事项
    Moonbeam的自定义预编译合约目前暂不可在Foundry分叉中使用，因为预编译是基于Substrate，而典型的合约是完全基于EVM。更多内容请参考：[Moonbeam上分叉](/builders/build/eth-api/dev-env/foundry#forking-with-anvil){target=_blank}和[Moonbeam和以太坊之间的异同之处](/builders/get-started/eth-compare){target=_blank}.

在本教程中，您将测试`Container`智能合约如何在Moonbase Alpha上与已部署的`MyToken`合约交互。

将名为`testAlternateTokenOnMoonbaseFork`的新测试函数添加至`Container.t.sol`中的`ContainerTest`智能合约。

```solidity
    // Fork tests in the Moonbase Alpha environment
    function testAlternateTokenOnMoonbaseFork() public {
        // Creates and selects a fork, returns a fork ID
        uint256 moonbaseFork = vm.createFork("moonbase");
        vm.selectFork(moonbaseFork);
        assertEq(vm.activeFork(), moonbaseFork);

        // Get token that's already deployed & deploys a container instance
        token = MyToken(0x359436610E917e477D73d8946C2A2505765ACe90);
        container = new Container(token, CAPACITY);

        // Mint tokens to the container & update container status
        token.mint(CAPACITY, address(container));
        container.updateStatus();

        // Assert that the capacity is full, just like the rest of the time
        assertEq(token.balanceOf(address(container)), CAPACITY);
        assertTrue(container.status() == ContainerStatus.Full);
    }
```

此函数的第一步（也是第一行）是让测试函数使用`vm.createFork`分叉网络。`vm`是由Forge标准库提供的cheatcode。创建分叉需要的是一个RPC URL或者存储在`foundry.toml`文件中的RPC URL别名。在本示例中，我们在[设置步骤](#setup-a-foundry-project){target=_blank}中为"moonbase"添加了一个RPC URL，因此在测试函数中我们将只需传递`"moonbase"`。此cheatcode函数返回创建分叉的ID，该ID存储在`uint256`中，是激活分叉所必需的。

在第二行中，即分叉创建后，将通过`vm.selectFork`在测试环境中选择和使用分叉。第三行只是为了证明当前的分叉，通过`vm.activeFork`检索，与Moonbase Alpha分叉相同。

第四行代码检索已部署的`MyToken`实例，这就是分叉的用武之地：您可以使用已经部署的合约。

剩下的代码测试容量，就像您期望的本地测试一样。如果您运行测试（使用`-vvvv`标签可以得到额外的日志），您将看到测试通过了：

```bash
forge test -vvvv
```

![Forking Tests in Foundry](/images/tutorials/eth-api/foundry-start-to-end/foundry-4.png)

这就是测试的步骤！您可以在GitHub上查看完整的[`Container.t.sol`文件](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-docs/master/.snippets/code/tutorials/eth-api/foundry-start-to-end/Container.t.sol){target=_blank}和[`MyToken.t.sol`文件](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-docs/master/.snippets/code/tutorials/eth-api/foundry-start-to-end/MyToken.t.sol){target=_blank}。

## 使用Solidity脚本在Foundry中部署 {: #deploy-in-foundry-with-solidity-scripts }

Foundry中的测试和脚本均以Solidity编写。与其他开发者环境一样，可以编写脚本来帮助与已部署智能合约交互，或协助完成手动难以实现的复杂部署流程。即使脚本是用Solidity编写，但是这些脚本不会部署到链上。相反，大部分的逻辑实际上是在链下运行的，因此使用Foundry无需担心像HardHat这类JavaScript环境会产生任何额外的gas费用。

### 在Moonbase Alpha上部署 {: #deploy-on-moonbase-alpha }

在本教程中，我们将使用Foundry的脚本部署`MyToken`和`Container`智能合约。要创建部署脚本，在`script`文件夹中创建一个新文件：

```bash
cd script
touch Container.s.sol
```

按照惯例，脚本应该以`s.sol`结尾，并且名称要与相关的脚本相似。在本示例中，我们要部署`Container`智能合约，因此我们将脚本命名为`Container.s.sol`，但如果您使用其他合适的或更具描述性的名称，也不会是世界末日。

在脚本中，添加以下内容：

```solidity
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import {MyToken} from "../src/MyToken.sol";
import {Container} from "../src/Container.sol";

contract ContainerDeployScript is Script {
    // Runs the script; deploys MyToken and Container
    function run() public {
        // Get the private key from the .env
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Make a new token
        MyToken token = new MyToken(1000);

        // Make a new container
        new Container(token, 500);

        vm.stopBroadcast();
    }
}
```

我们来分析一下此处的代码。第一行是标配：说明Solidity版本。导入内容包含之前添加的两个智能合约，我们即将部署这两个合约。导入`Script`合约包括了在脚本中使用的附加功能。

接下来，我们来看一下合约中的逻辑。只有一个函数`run`，脚本逻辑都在里面。在此`run`函数中，经常使用到`vm`对象。所有Forge cheatcode存储在里面，其决定了运行Solidity的虚拟机的状态。

在`run`函数的第一行中，`vm.envUint`用于从系统环境变量获取私钥（我们将在后续完成此操作）。在第二行中，`vm.startBroadcast`开始播报，即表示后续逻辑会发生在链上。因此，当使用`new`关键字实例化`MyToken`和`Container`合约时，这两个合约会在链上实例化。最后一行，`vm.stopBroadcast`结束播报。

在我们运行此脚本之前，先要设置一些环境变量。创建一个新的`.env`文件：

```bash
touch .env
```

在此文件中，添加以下内容：

```
PRIVATE_KEY=YOUR_PRIVATE_KEY
MOONSCAN_API_KEY=YOUR_MOONSCAN_API_KEY
```

!!! 注意事项
    Foundry提供[用于处理私钥的其他选项](https://book.getfoundry.sh/reference/forge/forge-script#wallet-options---raw){target=_blank}。根据个人选择决定是否在控制台使用该私钥，私钥是否存储在设备环境中，是否使用硬件钱包或者使用keystore。

要添加这些环境变量，请运行以下命令：

```bash
source .env
```

现在，您的脚本和项目已经可以准备部署了！使用以下命令进行操作：

```bash
forge script Container.s.sol:ContainerDeployScript --broadcast --verify -vvvv --rpc-url moonbase
```

此命令将`ContainerDeployScript`合约作为脚本运行。`--broadcast`选项告知Forge允许交易播报，`--verify`选项告知Forge在部署时向Moonscan验证，`-vvvv`使命令输出更详细，`--rpc-url moonbase`将网络设置为在`foundry.toml`中设置的`moonbase`。

您将看到类似以下输出：

![Running a Script in Foundry](/images/tutorials/eth-api/foundry-start-to-end/foundry-5.png)

您应该能够看到您的合约已成功部署并且已在Moonscan上得到验证。可以查看我[部署`Container.sol`合约](https://moonbase.moonscan.io/address/0xe8bf2e654d7c1c1ba8f55fed280ddd241e46ced9#code)的地方。

您可以在[GitHub](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-docs/master/.snippets/code/tutorials/eth-api/foundry-start-to-end/Container.s.sol){target=_blank}上查看整个部署脚本。

### 在Moonbeam主网上部署 {: #deploy-on-moonbeam-mainnet }

现在您对您的智能合约已经感到满意，并且想在Moonbeam主网上进行部署。此过程的操作与上述操作类似，因为您已在`foundry.toml`文件中添加了Moonbeam主网的信息，您只需将rpc-url从`moonbase`改成`moonbeam`即可：

```bash
forge script Container.s.sol:ContainerDeployScript --broadcast --verify -vvvv --rpc-url moonbeam
```

请注意，虽然这比较复杂，但是还有其他[在Foundry中处理私钥的方法](https://book.getfoundry.sh/reference/forge/forge-script#wallet-options---raw){target=_blank}。 其中一些方法可以被认为比将生产私钥存储在环境变量中更安全。

这样就可以了！您已经从无到有，完成了一个完全经过测试、部署和验证的Foundry项目。现在您可以稍作调整将Foundry用于您自己的项目！

--8<-- 'text/disclaimers/educational-tutorial.md'

--8<-- 'text/disclaimers/third-party-content.md'
