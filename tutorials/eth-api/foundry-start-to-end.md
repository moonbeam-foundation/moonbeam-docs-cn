---
title: Foundry Development Life Cycle from Start to End - Foundry开发生命周期（从开始到结束）
description: Follow a step-by-step tutorial on how to use Foundry to build a project on Moonbeam from writing smart contracts and tests to deploying on TestNet and MainNet.
遵循本教程学习如何使用Foundry在Moonbeam上构建项目，从编写智能合约和测试到在测试网和主网上部署。
---

# Using Foundry Start to End with Moonbeam 在Moonbeam上使用Foundry

![Banner Image](/images/tutorials/eth-api/foundry-start-to-end/foundry-banner.png)

_January 10th, 2022 | by Jeremy Boetticher_

_本教程更新至January 10th, 2022 | 作者Jeremy Boetticher_

## Introduction 概览 {: #introduction } 

Foundry has become an increasingly popular developer environment to develop smart contracts with, since utilizing it only requires a single language: Solidity. Moonbeam offers [introductory documentation on using Foundry](/builders/build/eth-api/dev-env/foundry){target=_blank} with Moonbeam networks, which is recommended to read to get an introduction to using Foundry. In this tutorial we will be dipping our toes deeper into the library to get a more cohesive look at how to properly develop, test, and deploy.  

Foundry已逐渐发展成为开发者部署智能合约的受欢迎开发者环境之一，因其只需要一种语言（Solidity）即可使用。建议您在开始使用Foundry之前，先阅读[在Moonbeam网络上使用Foundry的介绍文章](/builders/build/eth-api/dev-env/foundry){target=_blank}。在本教程中，我们将深入代码库，以全面了解如何正确开发、测试和部署。

In this demonstration, we will deploy two smart contracts. One is a token and another will depend on that token. We will also write unit tests to ensure that the contracts work as expected. To deploy them, we will write a script that Foundry will use to determine the deployment logic. Finally, we will verify the smart contracts on a Moonbeam network's blockchain explorer.  

在本次操作演示中，我们将部署两个智能合约。一个是Token，另一个将在此Token基础上。我们也将编写单元测试以确保合约如预期运作。要部署合约，我们要先编写脚本，Foundry将使用此脚本来决定部署逻辑。最后，我们要在Moonbeam网络的区块浏览器上验证智能合约。

## Checking Prerequisites 查看先决条件 {: #checking-prerequisites } 

To get started, you will need the following:

开始之前，您将需要准备以下内容：

 - Have an account with funds. 拥有资金的账户
    --8<-- 'text/faucet/faucet-list-item.md'
 - 
--8<-- 'text/common/endpoint-examples.md'
 - Have [Foundry installed](https://book.getfoundry.sh/getting-started/installation){target=_blank} [安装Foundry](https://book.getfoundry.sh/getting-started/installation){target=_blank}
 - Have a [Moonscan API Key](/builders/build/eth-api/verify-contracts/api-verification/#generating-a-moonscan-api-key){target=_blank} 一个[Moonscan API密钥](/builders/build/eth-api/verify-contracts/api-verification/#generating-a-moonscan-api-key){target=_blank}

## Create a Foundry Project 创建Foundry项目 {: #create-a-foundry-project }

The first step to start a Foundry project is of course to create it. If you have Foundry installed, you can run:

首先，创建一个Foundry项目。如果您已安装Foundry，您可以运行以下命令：

```
forge init foundry && cd foundry
```

This will have the `forge` utility initialize a new folder named `foundry` with a Foundry project initialized within it. The `script`, `src`, and `test` folders may have files in them already. Be sure to delete them, because we will be writing our own soon.  

这将使`forge`实用程序初始化一个名为`foundry`的新文件夹，并在其中初始化一个Foundry项目。`script`、`src`和`test`文件夹中可能已经有文件。请确保将其删除，因为我们会在之后编写自己的文件。

From here, there are a few things to do first before writing any code. First, we want to add a dependency to [OpenZeppelin's smart contracts](https://github.com/OpenZeppelin/openzeppelin-contracts){target=_blank}, because they include helpful contracts to use when writing token smart contracts. To do so, add them using their GitHub repository name:  

在编写任何代码之前，您需要先做一些事情。首先，将依赖项添加至[OpenZeppelin的智能合约](https://github.com/OpenZeppelin/openzeppelin-contracts){target=_blank}中，因其包含一些有用的合约，将用于编写Token智能合约。为此，使用其GitHub代码库名称完成依赖项添加。

```
forge install OpenZeppelin/openzeppelin-contracts
```

This will add the OpenZeppelin git submodule to your `lib` folder. To be sure that this dependency is mapped, you can override the mappings in a special file, `remappings.txt`:  

这会将OpenZeppelin git子模块添加到您的`lib`文件夹中。 为确保此依赖项已映射，您可以覆盖特殊文件`remappings.txt`中的映射：

```
forge remappings > remappings.txt
```

Every line in this file is one of the dependencies that can be referenced in the project's smart contracts. Dependencies can be edited and renamed so that it's easier to reference different folders and files when working on smart contracts. It should look similar to this with OpenZeppelin installed properly:

该文件中的每一行都是可以在项目的智能合约中引用的依赖项之一。可以编辑和重命名依赖项，以便在处理智能合约时更容易引用不同的文件夹和文件。如果正确安装了OpenZeppelin，后台将显示与下方类似的输出：

```
ds-test/=lib/forge-std/lib/ds-test/src/
forge-std/=lib/forge-std/src/
openzeppelin-contracts/=lib/openzeppelin-contracts/
```

Finally, let's open up the `foundry.toml` file. In preparation for Etherscan verification and deployment, add this to the file:

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

The first addition is a specification of the `solc_version`, underneath `profile.default`. The `rpc_endpoints` tag allows you to define which RPC endpoints to use when deploying to a named network, in this case, Moonbase Alpha and Moonbeam. The `etherscan` tag allows you to add Etherscan API keys for smart contract verification, which we will go over later.  

第一个添加的是`profile.default`下面的`solc_version`的规范。`rpc_endpoints`标签允许您定义在部署到命名网络时要使用的RPC端点，在本例中为Moonbase Alpha和Moonbeam。`etherscan`标签允许您添加用于智能合约验证的Etherscan API密钥，我们将在之后展开讨论。

## Add Smart Contracts 添加智能合约 {: #add-smart-contracts-in-foundry }

Smart contracts in Foundry that are meant to be deployed by default belong in the `src` folder. In this tutorial, we'll write two smart contracts. Starting with the token:

Foundry中默认部署的智能合约属于`src`文件夹。 在本教程中，我们将编写两个智能合约。 首先从Token开始：

```
touch MyToken.sol
```

Open the file and add the following to it:

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

As you can see, the OpenZeppelin `ERC20` smart contract is imported by the mapping defined in `remappings.txt`.

如您所见，OpenZeppelin `ERC20`智能合约是通过`remappings.txt`中定义的映射导入的。

The second smart contract, which we'll name `Container.sol`, will depend on this token contract. It is a simple contract that holds the ERC-20 token we'll deploy. You can create the file by executing:  

第二个智能合约（我们将其命名为`Container.sol`）将依赖于这个Token合约。这是一个简单的合约，包含我们将要部署的ERC-20 Token。您可以通过执行以下命令来创建文件：

```
touch Container.sol
```

Open the file and add the following to it:

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

The `Container` smart contract can have its status updated based on how many tokens it holds and what its initial capacity value was set to. If the number of tokens it holds is above its capacity, its status can be updated to `Overflowing`. If it holds tokens equal to capacity, its status can be updated to `Full`. Otherwise, the contract will start and stay in the `Unsatisfied` state.  

`Container`智能合约可以根据其持有的Token数量及其设置的初始容量值来更新其状态。如果只有的Token数量大于其容量，则状态可以更新为`Overflowing`。如果持有的Token数量等于容量，则状态可以更新为`Full`。否则，合约将开始并保持`Unsatisfied`状态。

`Container` requires a `MyToken` smart contract instance to function, so when we deploy it, we will need logic to ensure that it is deployed with a `MyToken` smart contract.  

`Container`需要一个`MyToken`智能合约实例才能运行，因此当我们部署时，我们需要逻辑来确保其与`MyToken`智能合约一起部署。

## Write Tests 编写测试 {: #write-tests }

Before we deploy anything to a TestNet or MainNet, however, it's good to test your smart contracts. There are many types of tests:

在我们部署任何合约至测试网或主网前，建议您先测试您的智能合约。多种测试类型如下所示：

- **Unit tests** — allow you to test specific parts of a smart contract's functionality. When writing your own smart contracts, it can be a good idea to break functionality into different sections so that it is easier to unit test
- **Unit tests** — 允许您测试智能合约功能的特定部分。当您编写自己的智能合约时，建议您将功能分成不同的部分，以便进行单元测试
- **Fuzz tests** — allow you to test a smart contract with a wide variety of inputs to check for edge cases
- **Fuzz tests** — 允许您使用各种输入测试智能合约以检查边缘情况
- **Integration tests** — allow you to test a smart contract when it works in conjunction with other smart contracts, so that you know it works as expected in a deployed environment
- **Integration tests** — 允许您在智能合约与其他智能合约一起工作时对其进行测试，以便您了解其能够在已部署的环境中按预期运作
    - **Forking tests** - integration tests that allows you to make a fork (a carbon copy of a network), so that you can simulate a series of transactions on a preexisting network
    - **Forking tests** - 允许您创建分叉（网络的副本）的集成测试，以便您可以在预先存在的网络上模拟一系列交易

### Unit Tests in Foundry - Foundry中的Unit Test {: #unit-tests-in-foundry}

To get started with writing tests for this tutorial, make a new file in the `test` folder:  

要开始编写测试，先在`test`文件中创建一个新的文件：

```
cd test
touch MyToken.t.sol
```

By convention, all of your tests should end with `.t.sol` and start with the name of the smart contract that it is testing. In practice, the test can be stored anywhere, and is considered a test if it has a function that starts with the word *"test"*. 

根据惯例，所有的测试需要以`.t.sol`结尾并以正在测试的智能合约名称开始。实际上，测试可以存储在任何地方，如果有以"test"开始的函数，则被视为测试。

Let's start by writing a test for the token smart contract. Open up `MyToken.t.sol` and add:  

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

Let's break down what's happening here. The first line is typical for a Solidity file: setting the Solidity version. The next two lines are imports. `forge-std/Test.sol` is the standard library that Forge (and thus Foundry) includes to help with testing. This includes the `Test` smart contract, certain assertions, and [forge cheatcodes](https://book.getfoundry.sh/forge/cheatcodes){target=_blank}.  

我们来分析一下此处的代码：第一行是典型的Solidity文件：设置Solidity版本。接下来的两行是导入。`forge-std/Test.sol` Forge（以及 Foundry）包含的用于帮助测试的标准库。这包括`Test`智能合约，某些断言和[forge cheatcode](https://book.getfoundry.sh/forge/cheatcodes){target=_blank}。

If you take a look at the `MyTokenTest` smart contract, you'll see two functions. The first is `setUp`, which is run before each test. So in this test contract, a new instance of `MyToken` is deployed every time a test function is run. You know if a function is a test function if it starts with the word *"test"*, so the second function, `testConstructorMint` is a test function.  

如果您查看`MyTokenTest`智能合约，您将看到两个函数。第一个是`setUp`，在每次测试之前运行。因此在此测试合约中，每次运行测试函数时都会部署`MyToken`新实例。如果函数以*"test"* 开头，则该函数为测试函数。所以第二个函数`testConstructorMint`是一个测试函数。

Great! Let's write some more tests, but for `Container`.  

现在，我们再写一些关于`Container`的测试：

```
touch Container.t.sol
```

And add the following:  

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

This test smart contract has two tests, so when running the tests, there will be two deployments of both `MyToken` and `Container`, for four smart contracts in total. You can run the following command to see the result of the test:  

此测试合约有两个测试，所以在运行测试时，会有`MyToken`和`Container`的两次部署，总共为4个智能合约。您可以运行以下命令来查看测试结果：

```
forge test
```

When testing, you should see the following output:  

测试时，您将看到以下输出：

![Unit Testing in Foundry](/images/tutorials/eth-api/foundry-start-to-end/foundry-1.png)

### Test Harnesses in Foundry - Foundry中的Test Harness {: #test-harnesses-in-foundry }

Sometimes you'll want to unit test an `internal` function in a smart contract. To do so, you'll have to write a test harness smart contract, which inherits from the smart contract and exposes the internal function as a public one.  

有时候您会希望在智能合约中对`internal`函数进行单元测试。为此，您需要编写测试工具智能合约，其继承自智能合约并向内部函数公开作为公共函数。

For example, in `Container`, there is an internal function named `_isOverflowing`, which checks to see if the smart contract has more tokens than its capacity. To test this, add the following test harness smart contract to the `Container.t.sol` file:  

举例来说，在`Container`中有一个名为`_isOverflowing`的内部函数，用于检查智能合约是否有比容量更多的Token。要测试此函数，请添加以下测试工具智能合约添加至`Container.t.sol`文件中：

```solidity
contract ContainerHarness is Container {
    constructor(MyToken _token, uint256 _capacity) Container(_token, _capacity) {}

    function exposed_isOverflowing(uint256 balance) external view returns(bool) {
        return _isOverflowing(balance);
    }
}
```

Now, inside of the `ContainerTest` smart contract, you can add a new test that tests the previously unreachable `_isOverflowing` contract:  

在`ContainerTest`智能合约里面，您可以添加一个新测试，用于测试上述不可读取的`_isOverflowing`合约：

```solidity
    // Tests for negative cases of the internal _isOverflowing function
    function testIsOverflowingFalse() public {
        ContainerHarness harness = new ContainerHarness(token , CAPACITY);
        assertFalse(harness.exposed_isOverflowing(CAPACITY - 1));
        assertFalse(harness.exposed_isOverflowing(CAPACITY));
        assertFalse(harness.exposed_isOverflowing(0));
    }
```

Now, when you run the test with `forge test`, you should see that `testIsOverflowingFalse` passes!  

现在，当您用`forge test`运行测试时，您将看到`testIsOverflowingFalse`已经通过！

![Test Harness in Foundry](/images/tutorials/eth-api/foundry-start-to-end/foundry-2.png)

### Fuzzing Tests in Foundry - Foundry中的Fuzzing Test {: #fuzzing-tests-in-foundry}

When you write a unit test, you can only use so many inputs to test. You can try testing edge cases, a few select values, perhaps one or two random ones. But when working with inputs, there are nearly an infinite amount of different ones to test! How can you be sure that they work for every value? Wouldn't you feel safer if you could test 10000 different inputs instead of less than 10?  

当您编写单元测试时，您只能使用这些输入进行测试。您可以尝试测试边缘情况，选择一些值，可以是一个或者两个随机值。但是在处理输入时，有无数种不同的东西需要测试。如何保证其适用于每个值？如果把10000个不同的输入替换成少于10个输入，会不会更容易操作且安全呢？

One of the best ways that developers can test many inputs is through fuzzing, or fuzz tests. Foundry automatically fuzz tests when an input in a test function is included. To illustrate this, add the following test to the `MyTokenTest` contract in `MyToken.t.sol`.  

开发者可以测试很多输入的最佳方式之一是通过模糊测试（fuzzing或fuzz test）。当输入包含在测试函数中时，Foundry会自动进行模糊测试。为了说明这一点，将以下测试添加到`MyToken.t.sol`中的`MyTokenTest`合约。

```solidity
    // Fuzz tests for success upon minting tokens one ether or below
    function testMintOneEtherOrBelow(uint256 amountToMint) public {
        vm.assume(amountToMint <= 1 ether);

        token.mint(amountToMint, msg.sender);
        assertEq(token.balanceOf(msg.sender), amountToMint);
    }
```

This test includes `uint256 amountToMint` as input, which tells Foundry to fuzz with `uint256` inputs! By default, Foundry will input 256 different inputs, but this can be configured with the [`FOUNDRY_FUZZ_RUNS` environment variable](https://book.getfoundry.sh/reference/config/testing#runs){target=_blank}.  

这些测试包含`uint256 amountToMint`作为输入，告知Foundry使用`uint256`输入进行模糊测试。默认情况下，Foundry将输入256个不同的输入，但可以使用[`FOUNDRY_FUZZ_RUNS`环境变量](https://book.getfoundry.sh/reference/config/testing#runs){target=_blank}配置。

Additionally, the first line in the function uses `vm.assume` to only use inputs that are less than or equal to 1 ether, since the `mint` function reverts if someone tries to mint more than 1 ether at a time. This cheatcode helps you direct the fuzzing into the right range.  

此外，该函数的第一行使用`vm.assume`以仅使用小于等于1 ether的输入，如果有人试图一次铸造超过1 ether，则`mint`函数将返还。此cheatcode可以帮助您将模糊测试引导到正确的范围。

Let's look at another fuzzing test to put in the `MyTokenTest` contract, but this time where we expect to fail:  

我们来看一下另一个放入`MyTokenTest`合约中的模糊测试，但是我们预计会失败：

```solidity
    // Fuzz tests for failure upon minting tokens above one ether
    function testFailMintAboveOneEther(uint256 amountToMint) public {
        vm.assume(amountToMint > 1 ether);
        
        token.mint(amountToMint, msg.sender);
    }
```

In Foundry, when you want to test for a failure, instead of just starting your test function with the world *"test"*, you start it with *"testFail"*. In this test, we assume that the `amountToMint` is above 1 ether, which should fail!  

在Foundry中，当你预想到测试会失败，您无需以*"test"*开始，可以直接以*"testFail"*开始测试函数。在此测试中，我们假设`amountToMint`超过1 ether（即结果会失败）。

Now run the tests:  

现在运行测试：

```
forge test
```

You should see something similar to the following in the console:

您将在控制台看到以下类似输出：

![Fuzzing Tests in Foundry](/images/tutorials/eth-api/foundry-start-to-end/foundry-3.png)

### Forking Tests in Foundry - Foundry中的Forking Test {: #forking-tests-in-foundry}

In Foundry, you can locally fork a network so that you can test out how the contracts would work in an environment with already deployed smart contracts. For example, if someone deployed smart contract `A` on Moonbeam that required a token smart contract, you could fork the Moonbeam network and deploy your own token on the fork to test out how smart contract `A` would react to it.  

在Foundry中，您可以在本地分叉网络，从而您可以测试合约如何在已部署合约的环境中运行。举例来说，如果有人在需要Token智能合约的Moonbeam上部署智能合约`A`，您可以分叉Moonbeam网络并在分叉上部署您自己的Token以测试智能合约`A`如何反应。

!!! note 注意事项
    Moonbeam's custom precompile smart contracts currently do not work in Foundry forks because precompiles are substrate based whereas typical smart contracts are completely based on the EVM. Learn more about [forking on Moonbeam](/builders/build/eth-api/dev-env/foundry#forking-with-anvil){target=_blank} and the [differences between Moonbeam and Ethereum](/builders/get-started/eth-compare){target=_blank}.

Moonbeam的自定义预编译合约目前暂不可在Foundry分叉中使用，因为预编译是基于Substrate，而典型的合约是完全基于EVM。更多内容请参考：[Moonbeam上分叉](/builders/build/eth-api/dev-env/foundry#forking-with-anvil){target=_blank}和[Moonbeam和以太坊之间的异同之处](/builders/get-started/eth-compare){target=_blank}.

In this tutorial, you will be testing out how your `Container` smart contract interacts with an already deployed `MyToken` contract on Moonbase Alpha.  

在本教程中，您将测试`Container`智能合约如何在Moonbase Alpha上与已部署的`MyToken`合约交互。

Let's add a new test function to the `ContainerTest` smart contract in `Container.t.sol` called `testAlternateTokenOnMoonbaseFork`:

将名为`testAlternateTokenOnMoonbaseFork`的新函数添加至`Container.t.sol`中的`ContainerTest`智能合约。

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

The first step (and thus first line) in this function is to have the test function fork a network with `vm.createFork`. Recall that `vm` is a cheatcode provided by the Forge standard library. All that's necessary to create a fork is an RPC URL, or an alias for an RPC URL that's stored in the `foundry.toml` file. In this case, we added an RPC URL for "moonbase" in [the setup step](#setup-a-foundry-project), so in the test function we will just pass the word `"moonbase"`. This cheatcode function returns an ID for the fork created, which is stored in an `uint256` and is necessary for activating the fork.  

此函数的第一步（也是第一行）是让测试函数使用`vm.createFork`分叉网络。`vm`是由Forge标准库提供的cheatcode。创建分叉需要的是一个RPC URL或者存储在`foundry.toml`文件中的RPC URL别名。在本示例中，我们在[设置步骤](#setup-a-foundry-project)中为"moonbase"添加一个RPC URL，因此在测试函数中我们将只需传递`"moonbase"`。此cheatcode函数返回创建分叉的ID，该ID存储在`uint256`中是激活分叉所必需的。

On the second line, after the fork has been created, the environment will select and use the fork in the test environment with `vm.selectFork`. The third line is just to demonstrate that the current fork, retrieved with `vm.activeFork`, is the same as the Moonbase Alpha fork.  

在第二行中，即分叉创建后，环境将通过`vm.selectFork`在测试环境中选择和使用分叉。第三行只是为了证明当前的分叉，通过`vm.activeFork`检索，与Moonbase Alpha分叉相同。

The fourth line of code retrieves an already deployed instance of `MyToken`, which is what's useful about forking: you can use contracts that are already deployed.  

第四行代码检索已部署的`MyToken`实例，这就是分叉的用武之地：您可以使用已经部署的合约。

The rest of the code tests capacity like you would expect a local test to. If you run the tests (with the `-vvvv` tag for extra logging), you'll see that it passes:  

剩下的代码测试您想要进行本地测试的容量。如果您（为其他日志使用`-vvvv`标签）运行测试您将看到如下所示：

```
forge test --vvvv
```

![Forking Tests in Foundry](/images/tutorials/eth-api/foundry-start-to-end/foundry-4.png)

That's it for testing! You can see the complete [`Container.t.sol` file](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/tutorials/eth-api/foundry-start-to-end/Container.t.sol){target=_blank} and [`MyToken.t.sol` file](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/tutorials/eth-api/foundry-start-to-end/MyToken.t.sol){target=_blank} on GitHub.

这就是测试的步骤！您可以在GitHub上查看完整的[`Container.t.sol`文件](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/tutorials/eth-api/foundry-start-to-end/Container.t.sol){target=_blank}和[`MyToken.t.sol`文件](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/tutorials/eth-api/foundry-start-to-end/MyToken.t.sol){target=_blank}。

## Deploy in Foundry with Solidity Scripts 使用Solidity脚本在Foundry中部署 {: #deploy-in-foundry-with-solidity-scripts }

Not only are tests in Foundry written in Solidity, the scripts are too! Like other developer environments, scripts can be written to help interact with deployed smart contracts or can help along a complex deployment process that would be difficult to do manually. Even though scripts are written in Solidity, they are never deployed to a chain. Instead, much of the logic is actually run off-chain, so don't worry about any additional gas costs for using Foundry instead of a JavaScript environment like HardHat.  

Foundry中的测试和脚本均以Solidity编写。与其他开发者环境一样，可以编写的脚本能够用来帮助与已部署智能合约交互，或协助完成手动难以实现的复杂部署流程。即使脚本是用Solidity编写，但是这些脚本不会部署到链上。相反，大部分的逻辑实际上是在链下运行的，因此使用Foundry无需担心像HardHat这类JavaScript环境会产生任何额外的gas费用。

### Deploy on Moonbase Alpha - 在Moonbase Alpha上部署 {: #deploy-on-moonbase-alpha }

In this tutorial, we will be using Foundry's scripts to deploy both the `MyToken` and `Container` smart contracts. To create the deployment scripts, create a new file in the `script` folder:  

在本教程中，我们将使用Foundry的脚本部署`MyToken`和`Container`智能合约。要创建部署脚本，在`script`文件中创建一个新文件：

```
cd script
touch Container.s.sol
```

By convention, scripts should end with `s.sol`, and have a name similar to the script that it relates to. In this case, we are deploying the `Container` smart contract, so we have named the script `Container.s.sol`, though it's not the end of the world if you use some other suitable or more descriptive name.  

按照惯例，脚本应该以`s.sol`结尾，并且名称要与相关的脚本相似。在本示例中，我们要部署`Container`智能合约，因此我们将脚本命名为`Container.s.sol`，但如果您使用其他更合适的或更具描述性的名称，可以在后缀补充。

In this script, add:  

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

Let's break this script down. The first line is standard: declaring the solidity version. The imports include the two smart contracts you previously added, which will be deployed. This includes additional functionality to use in a script, including the `Script` contract.  

我们来分析一下此处的代码。第一行是标准：说明Solidity版本。导入内容包含之前添加的两个智能合约，我们即将部署这两个合约。这包括在脚本中使用的附加功能，包括`Script`合约。

Now let's look at the logic in the contract. There is a single function, `run`, which is where the script logic is hosted. In this `run` function, the `vm` object is used often. This is where all of the Forge cheatcodes are stored, which determines the state of the virtual machine that the solidity is run in.  

接下来，我们来看一下合约中的逻辑。只有一个函数`run`，其用于托管脚本逻辑。在此`run`函数中，经常使用到`vm`对象。所有Forge cheatcode存储在此处，其决定了运行Solidity虚拟机的状态。

In the first line within the `run` function, `vm.envUint` is used to get a private key from the system's environment variables (we will do this soon). In the second line, `vm.startBroadcast` starts a broadcast, which indicates that the following logic should take place on-chain. So when the `MyToken` and the `Container` contracts are instantiated with the `new` keyword, they are instantiated on-chain. The final line, `vm.stopBroadcast` ends the broadcast.  

在`run`函数的第一行中，`vm.envUint`用于从系统环境变量获取私钥（我们将在后续完成此操作）。在第二行中，`vm.startBroadcast`开始播报，即表示以下逻辑可以发生在链上。因此，当使用`new`关键字实例化`MyToken`和`Container`合约时，这两个合约会在链上实例化。最后一行，`vm.stopBroadcast`结束播报。

Before we run this script, let's set up some of our environment variables. Create a new `.env` file:  

在我们运行此脚本之前，先要设置一些环境变量。创建一个新的`.env`文件：

```
touch .env
```

And within this file, add the following:  

在此文件中，添加以下内容：

```
PRIVATE_KEY=YOUR_PRIVATE_KEY
MOONSCAN_API_KEY=YOUR_MOONSCAN_API_KEY
```

!!! note 注意事项
    Foundry provides [additional options for handling your private key](https://book.getfoundry.sh/reference/forge/forge-script#wallet-options---raw){target=_blank}. It is up to you to decide whether or not you would rather use it in the console, have it stored in your device's environment, using a hardware wallet, or using a keystore.

Foundry提供[用于处理私钥的其他选项](https://book.getfoundry.sh/reference/forge/forge-script#wallet-options---raw){target=_blank}。根据个人选择决定是否在控制台使用该私钥，私钥是否存储在设备环境中，是否使用硬件钱包或者使用keystore。

To add these environment variables, run the following command:  

要添加这些环境变量，请运行以下命令：

```
source .env
```

Now your script and project should be ready for deployment! Use the following command to do so:  

现在，您的脚本和项目已经可以准备部署了！使用以下命令进行操作：

```
forge script Container.s.sol:ContainerDeployScript --broadcast --verify -vvvv --rpc-url moonbase
```

What this command does is run the `ContainerDeployScript` contract as a script. The `--broadcast` option tells Forge to allow broadcasting of transactions, the `--verify` option tells Forge to verify to Moonscan when deploying, `-vvvv` makes the command output verbose, and `--rpc-url moonbase` sets the network to what `moonbase` was set to in `foundry.toml`.  

此命令将`ContainerDeployScript`合约作为脚本运行。`--broadcast`选项告知Forge允许交易播报，`--verify`选项告知Forge在部署时向Moonscan验证，`-vvvv`使命令输出冗长，`--rpc-url moonbase`将网络设置为在`foundry.toml`中设置的`moonbase`。

You should see something like this as output:  

您将看到以下输出：

![Running a Script in Foundry](/images/tutorials/eth-api/foundry-start-to-end/foundry-5.png)

You should be able to see that your contracts were deployed, and are verified on Moonscan! For example, this is where my [`Container.sol` contract was deployed](https://moonbase.moonscan.io/address/0xe8bf2e654d7c1c1ba8f55fed280ddd241e46ced9#code){target=_blank}.  

您应该能够看到您的合约已成功部署并且已在Moonscan上得到验证。可以查看我[部署`Container.sol`合约](https://moonbase.moonscan.io/address/0xe8bf2e654d7c1c1ba8f55fed280ddd241e46ced9#code)的地方。

The entire deployment script is [available on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/tutorials/eth-api/foundry-start-to-end/Container.s.sol){target=_blank}.  

您可以在[GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/tutorials/eth-api/foundry-start-to-end/Container.s.sol){target=_blank}上查看整个部署脚本。

### Deploy on Moonbeam MainNet 在Moonbeam主网上部署 {: #deploy-on-moonbeam-mainnet }

Let's say that you're comfortable with your smart contracts and you want to deploy on the Moonbeam MainNet! The process isn't too different from what was just done, you just have to change the command's rpc-url from `moonbase` to `moonbeam`, since you've already added Moonbeam MainNet's information in the `foundry.toml` file: 

现在智能合约已经准备完毕，您可以在Moonbeam主网上进行部署。此过程的操作与上述操作类似，因为您已在`foundry.toml`文件中添加了Moonbeam主网的信息，您只需将rpc-url从`moonbase`改成`moonbeam`即可。

```
forge script Container.s.sol:ContainerDeployScript --broadcast --verify -vvvv --rpc-url moonbeam
```

It's important to note that there are additional, albeit more complex, [ways of handling private keys in Foundry](https://book.getfoundry.sh/reference/forge/forge-script#wallet-options---raw){target=_blank}. Some of these methods can be considered safer than storing a production private key in environment variables.  

请注意，虽然这比较复杂，但是还有其他[在Foundry中处理私钥的方法](https://book.getfoundry.sh/reference/forge/forge-script#wallet-options---raw){target=_blank}。 其中一些方法可能比将生产私钥存储在环境变量中更安全。

That's it! You've gone from nothing to a fully tested, deployed, and verified Foundry project. You can now adapt this so that you can use Foundry in your own projects!

这样就可以了！您已经完成了从没有到完全测试、部署和验证Foundry项目。现在您可以稍作调整将Foundry用于您自己的项目！ 

--8<-- 'text/disclaimers/educational-tutorial.md'

--8<-- 'text/disclaimers/third-party-content.md'