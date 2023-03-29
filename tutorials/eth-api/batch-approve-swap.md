---
title: Approve & Swap with the Batch Precompile 通过Batch Precompile批准和兑换
description: Learn how to use the batch precompile on Moonbeam to batch an approval and swap into a single call, so you can approve the exact amount of tokens for the swap.
学习如何使用Moonbeam上的Batch Precompile将批准和兑换批处理至单个调用中，从而批准用于兑换的准确Token数量。
---

# Use the Batch Precompile to Approve and Swap Tokens 使用Batch Precompile批准和兑换Token

![Banner Image](/images/tutorials/eth-api/batch-approve-swap/batch-banner.png)

_December 21, 2022 | by Erin Shaben_

_本教程更新至2022年12月21日 | 作者：Erin Shaben_

## Introduction 概览 {: #introduction } 

Token approvals are critical for interacting with smart contracts securely, preventing smart contracts without permission from accessing a user's tokens. When a smart contract is given approval to access a user's tokens, the amount of tokens it has access to is often an unlimited amount, depending on the DApp.

Token批准对于安全地与智能合约交互非常重要，能够防止智能合约在无许可的情况下访问用户Token。当智能合约被批准访问用户Token时，能够访问的Token数量通常是无限量的，具体取决于DApp。

One of the reasons why many DApps use an unlimited amount is so that users don't need to continue to sign approval transactions every time they want to move their tokens. This is in addition to the second transaction required to actually swap the tokens. For networks like Ethereum, this can be expensive. However, if the approved smart contract has a vulnerability, it could be exploited and the users' tokens could be transferred at any time without requiring further approval. In addition, if a user no longer wants the DApp's contract to have access to their tokens, they have to revoke the token approval, which requires another transaction to be sent.

许多DApp使用无限量的原因之一是用户无需在每次想要转移Token的时候继续签署批准交易。这是对实际兑换Token所需的第二次交易的补充。像以太坊这样的网络，手续费会很昂贵。然而如果已批准的智能合约存在漏洞，则会被利用且用户的Token可能会在无需进一步的批准情况下随时被转移。此外，如果用户不在想要DApp合约继续访问其Token，则需要撤销Token批准，这需要发送另一笔交易。

As a DApp developer on Moonbeam, this process can be easily avoided, providing your users with more control over their assets. This can be done using the [batch precompile](/builders/pallets-precompiles/precompiles/batch){target=_blank} to batch an approval and swap into a single transaction, instead of the typical two transaction process. This allows for the approval amount to be the exact swap amount instead of having unlimited access to your users' tokens. 

作为Moonbeam上的DApp开发者，可以轻松避免此流程，为用户提供对资产的掌控。这可以通过[batch precompile](/builders/pallets-precompiles/precompiles/batch){target=_blank}将批准和兑换批处理至单个交易中来实现，从而无需通过两个交易流程。这允许批准金额为准确的兑换金额，而不是无限量地访问用户Token。

In this tutorial, we'll dive into the process of batching an approval and swap into one transaction using the `batchAll` function of the batch precompile contract. We'll create and deploy an ERC-20 contract and a simple DEX contract for the swap on the Moonbase Alpha TestNet using [Hardhat](/builders/build/eth-api/dev-env/hardhat){target=_blank} and [Ethers](/builders/build/eth-api/libraries/ethersjs){target=_blank}. 

在本教程中，我们将深入了解使用batch precompile合约的`batchAll`函数将批准和兑换批处理至一个交易的操作流程。我们将使用[Hardhat](/builders/build/eth-api/dev-env/hardhat){target=_blank}和[Ethers](/builders/build/eth-api/libraries/ethersjs){target=_blank}创建和部署一个ERC-20合约和一个简单的DEX合约，用于在Moonbase Alpha测试网上兑换。

## Checking Prerequisites 查看先决条件 {: #checking-prerequisites }

For this tutorial, you'll need the following:

在本教程中，您将需要准备以下内容：

- An account with funds. 拥有资金的账户
  --8<-- 'text/faucet/faucet-list-item.md'
- An empty Hardhat project that is configured for the Moonbase Alpha TestNet. For step-by-step instructions, please refer to the [Creating a Hardhat Project](/builders/build/eth-api/dev-env/hardhat/#creating-a-hardhat-project){target=_blank} and the [Hardhat Configuration File](/builders/build/eth-api/dev-env/hardhat/#hardhat-configuration-file){target=_blank} sections of our Hardhat documentation page
- 为Moonbase Alpha TestNet配置一个空白的Hardhat项目。关于详细教程，请参考Hardhat文档页面的[创建Hardhat项目](/builders/build/eth-api/dev-env/hardhat/#creating-a-hardhat-project){target=_blank}和[Hardhat配置文件](/builders/build/eth-api/dev-env/hardhat/#hardhat-configuration-file){target=_blank}部分
- --8<-- 'text/common/endpoint-examples.md'

### Install Dependencies 安装依赖项 {: #install-dependencies }

Once you have your Hardhat project, you can install the [Ethers plugin](https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html){target=_blank}. This provides a convenient way to use the [Ethers.js](/builders/build/eth-api/libraries/ethersjs/){target=_blank} library to interact with the network.

当您准备好Hardhat项目后，您可以安装[Ethers插件](https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html){target=_blank}。这将提供一种便捷的方式，以便使用[Ethers.js](/builders/build/eth-api/libraries/ethersjs/){target=_blank}库与网络交互。

You can also install the [OpenZeppelin contracts library](https://docs.openzeppelin.com/contracts/){target=_blank}, as we'll be importing the `ERC20.sol` contract and `IERC20.sol` interface in our contracts.

您也可以安装[OpenZeppelin合约库](https://docs.openzeppelin.com/contracts/){target=_blank}，我们将在合约中导入`ERC20.sol`合约和`IERC20.sol`接口。

To install the necessary dependencies, run the following command:

要安装必要依赖项，请运行以下命令：

```
npm install @nomiclabs/hardhat-ethers ethers @openzeppelin/contracts
```

## Contract Setup 合约设置 {: #contracts }

The following are the contracts that we'll be working with today:

在本教程中，我们将使用以下合约：

- `Batch.sol` - one of the precompile contracts on Moonbeam that allows you to combine multiple EVM calls into one. For more information on the available methods, please refer to the [Batch Solidity Interface](/builders/pallets-precompiles/precompiles/batch/#the-batch-interface){target=_blank} documentation
- `Batch.sol` - Moonbeam上的其中一个预编译合约，允许您将多个EVM调用结合到一个。您可通过[Batch Solidity接口](/builders/pallets-precompiles/precompiles/batch/#the-batch-interface){target=_blank}文档获取可用函数的更多信息
- `DemoToken.sol` - an ERC-20 contract for the `DemoToken` (DTOK) token, which on deployment mints an initial supply and assigns them to the contract owner. It's a standard ERC-20 token, you can review the [IERC20 interface](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#IERC20){target=_blank} for more information on the available methods
- `DemoToken.sol` - `DemoToken` (DTOK) token的ERC-20合约，在部署时铸造初始供应量并将其分配给合约所有者。这是一个标准ERC-20 Token，您可以查看[IERC20接口](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#IERC20){target=_blank}获取可用函数的更多信息
- `SimpleDex.sol` - a simple example of a DEX that on deployment deploys the `DemoToken` contract, which mints 1000 DTOKs, and allows you to swap DEV token for DTOKs and vice versa. **This contract is for demo purposes only**. The `SimpleDex` contract contains the following methods:
- `SimpleDex.sol` - DEX的一个简单示例，在部署时部署`DemoToken`合约，该合约铸造1000 DTOK，并允许您将DEV Token兑换成DTOK，反之亦然。**此合约仅供演示使用**。`SimpleDex`合约包含以下函数：
    - **token**() - a read-only method that returns the address of the `DemoToken` contract
    - **token**() - 只读函数，返回`DemoToken`合约的地址
    - **swapDevForDemoToken**() - a payable function that accepts DEV tokens in exchange for DTOK tokens. The function checks to make sure there are enough DTOK tokens held in the contract before making the transfer. After the transfer is made, a `Bought` event is emitted
    - **swapDevForDemoToken**() - 支付函数，接收DEV Token以兑换DTOK Token。在转账前，此函数会检查以确保合约中有足够的DTOK Token。转账发起后，发出`Bought`事件
    - **swapDemoTokenForDev**(*uint256* amount) - accepts the amount of DTOKs to swap for DEV tokens. The function checks to make sure the caller of the function has approved the contract to transfer their DTOKs before swapping the DTOKs back to DEV. After the transfer is made, a `Sold` event is emitted
    - **swapDemoTokenForDev**(*uint256* amount) - 接收DTOK Token以兑换DEV Token。在将DTOK兑换回DEV Token之前，此函数会检查以确保函数的调用者已经批准转移DTOK的合约，发出`Sold`事件

If you don't already have a `contracts` directory in your Hardhat project, you can create a new directory:

如果您的Hardhat项目中还没有`contracts`目录，您可以创建一个新目录：

```
mkdir contracts && cd contracts
```

Then, you can create a single file that we'll use to store the code for the `DemoToken` and `SimpleDex` contract:

然后，您可以创建一个新文件，用于存储`DemoToken`和`SimpleDex`合约的代码：

```
touch SimpleDex.sol Batch.sol
```

In the `SimpleDex.sol` file, you can paste in the following code for the `DemoToken` and `SimpleDex` contracts:

在`SimpleDex.sol`文件中，您可以为`DemoToken`和`SimpleDex`合约粘贴以下代码：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DemoToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("DemoToken", "DTOK") {
        // Assign 500 DTOK tokens to the SimpleDex contract
        _mint(msg.sender, initialSupply / 2);
        // Assign 500 DTOK tokens to the EOA that deployed the SimpleDex contract
        _mint(tx.origin, initialSupply / 2);
    }
}

contract SimpleDex {
    IERC20 public token;

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    // Make constructor payable so that DEV liquidity exists for the contract
    constructor() payable {
        // Mint 1000 DTOK tokens. Half will be assigned to the SimpleDex contract 
        // and the other half will be assigned to the EOA that deployed the
        // SimpleDex contract
        token = new DemoToken(1000000000000000000000);
    }

    // Function to swap DEV for DTOK tokens
    function swapDevForDemoToken() payable public {
        // Verify the contract has enough tokens for the requested amount
        uint256 amountTobuy = msg.value;
        uint256 dexBalance = token.balanceOf(address(this));
        require(amountTobuy > 0, "You need to send some DEV");
        require(amountTobuy <= dexBalance, "Not enough tokens in the reserve");
        // If enough, swap the DEV to DTOKs
        token.transfer(msg.sender, amountTobuy);
        emit Bought(amountTobuy);
    }

    // Function to swap DTOK for DEV tokens
    function swapDemoTokenForDev(uint256 amount) public {
        // Make sure the requested amount is greater than 0 and the caller
        // has approved the requested amount of tokens to be transferred
        require(amount > 0, "You need to sell at least some tokens");
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= amount, "Check the token allowance");
        // Transfer the DTOKs to the contract
        token.transferFrom(msg.sender, address(this), amount);
        // Transfer the DEV tokens back to the caller
        payable(msg.sender).transfer(amount);
        emit Sold(amount);
    }
}
```

In the `Batch.sol` file, you can paste in the [batch precompile contract](https://github.com/PureStake/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank}. 

在`Batch.sol`文件中，您可以粘贴在[batch precompile合约t](https://github.com/PureStake/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank}中。

### Compile & Deploy Contracts 编译 & 部署合约 {: #compile-deploy-contracts }

To compile the contracts, we'll go ahead and run the following Hardhat command:

要编译合约，请先运行以下Hardhat命令：

```
npx hardhat compile
```

![Compile contracts](/images/tutorials/eth-api/batch-approve-swap/batch-1.png)

After compilation, an `artifacts` directory is created: it holds the bytecode and metadata of the contract, which are `.json` files. It’s a good idea to add this directory to the `.gitignore` file.

编译完成后，将创建一个`artifacts`目录：其包含合约的字节码和元数据，即`.json`文件。建议将此目录添加至`.gitignore`文件中。

Next, we can deploy the `SimpleDex` contract, which upon deployment will automatically deploy the `DemoToken` contract and mint 1000 DTOKs and assign half of them to the `SimpleDex` contract and the other half to the address that you're initiating the deployment from.

接下来，我们可以部署`SimpleDex`合约，部署后将自动部署`DemoToken`合约并铸造1000 DTOK，然后将一半Token分配给`SimpleDex`合约，剩下一半给初始部署的地址。

We'll also add some initial liquidity to the contract by passing in a `value` when calling `deploy`. Since the value needs to be in Wei, we can use `ethers.utils.parseEther` to pass in a value such as `"0.5"` DEV and it will convert the value to Wei for us.

我们也将通过在调用`deploy`时传入`value`为合约添加一些初始流动性。由于此值需要以Wei为单位，我们可以使用`ethers.utils.parseEther`来实现，输入值（比如`"0.5"` DEV）后，此函数会将值转换为以Wei为单位。

Before deploying the contract, we'll need to create the deployment script. We'll create a new directory for the script and name it `scripts` and add a new file to it called `deploy.js`:

在部署合约之前，我们将需要创建部署脚本。我们将先为脚本创建一个新目录，命名为`scripts`，并添加一个名为`deploy.js`的新文件：

```
mkdir scripts && touch scripts/deploy.js
```

In the `deploy.js` script, you can paste in the following code, which will deploy the `SimpleDex` contract and print the address of the contract to the terminal upon successful deployment:

在`deploy.js`脚本中，您可以粘贴以下代码，该代码将部署`SimpleDex`合约并在部署成功后将合约地址显示在终端：

```js
async function main() {
  // Liquidity to add in DEV (i.e., ".5") to be converted to Wei
  const value = ethers.utils.parseEther("INSERT-AMOUNT-OF-DEV");

  // Deploy the SimpleDex contract, which will also automatically deploy
  // the DemoToken contract and add liquidity to the contract
  const SimpleDex = await ethers.getContractFactory("SimpleDex",);
  const simpleDex = await SimpleDex.deploy({ value })
  await simpleDex.deployed();

  console.log(`SimpleDex deployed to ${simpleDex.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Now we can deploy the `SimpleDex` contract using the `run` command and specifying `moonbase` as the network:

现在，我们可以使用`run`命令部署`SimpleDex`合约并指定`moonbase`作为网络：

```
npx hardhat run --network moonbase scripts/deploy.js
```

!!! note 注意事项
    If you want to run the script in a standalone fashion using `node <script>`, you'll need to require the Hardhat Runtime Environment explicitly using `const hre = require("hardhat");` in the `deploy.js` file.

如果你想要使用`node <script>`以独立方式运行脚本，您需要在`deploy.js`文件中使用`const hre = require("hardhat");`显式要求Hardhat Runtime Environment。

![Deploy contracts](/images/tutorials/eth-api/batch-approve-swap/batch-2.png)

After a few seconds, the contract will be deployed, and you should see the address in the terminal. We'll need to use the address in the following sections to interact with the contract, so make sure you save it.

几分钟后，合约将被部署，您会在终端看到地址。我们需要在以下部分与合约交互时用到该地址，请确保您已保存该地址。

## Swap Tokens 兑换Token {: #swapping-tokens }

With the contract deployed, now we can create a script that will enable us to get started by swapping DEV tokens for DTOK tokens. Once we have the DTOKs, we can get into the approval and swap. We'll take a quick look at how the approval and swap work normally before diving into using the batch precompile to batch these transactions. 

合约部署后，现在我们可以创建一个脚本，开始将DEV Token兑换成DTOK Token的操作。当您拥有DTOK后，我们可以批准和兑换Token了。在使用batch precompile以批处理这些交易前，我们先快速了解一下批准和兑换通常使如何运作的。

For simplicity, we'll create a single script to handle all of the logic needed to swap DEV to DTOKs and back, called `swap.js`. We'll add this file to the `scripts` directory:

简单来说，我们会创建一个名为`swap.js`的脚本来处理来回兑换DEV和DTOK所需的所有逻辑。我们将此文件添加至`scripts`目录：

```
touch scripts/swap.js
```

### Create Contract Instances 创建合约实例 {: #create-contract-instances }

We'll need to create contract instances for each of our contracts so that we can access each contract's functions. For this, we're going to use the `getContractAt` helper function of the Hardhat plugin.

我们需要为每个合约创建合约实例，以便我们可以访问每个合约的函数。为此，我们需要使用Hardhat插件的`getContractAt`辅助函数。

For this step, we're going to need the contract address of the `SimpleDex` contract. Then we'll be able to use the `SimpleDex` contract instance to retrieve the `DemoToken` contract address through the `token` function.

这一步骤我们需要用到`SimpleDex`合约的合约地址。然后才能够使用`SimpleDex`合约实例通过`token`函数来获取`DemoToken`合约地址。

We'll also need to add a contract instance for the batch precompile, which is located at `{{ networks.moonbase.precompiles.batch }}`.

我们也需要为batch precompile添加合约实例，该合约实例位于`{{ networks.moonbase.precompiles.batch }}`。

You can add the following code to the `swap.js` file:

您可以添加以下代码至`swap.js`文件：

```js
const simpleDexAddress = "INSERT-ADDRESS-OF-DEX";

async function main() {
  // Create instance of SimpleDex.sol
  const simpleDex = await ethers.getContractAt(
    "SimpleDex",
    simpleDexAddress
  );

  // Create instance of DemoToken.sol
  const demoTokenAddress = await simpleDex.token();
  const demoToken = await ethers.getContractAt(
    "DemoToken",
    demoTokenAddress
  );

  // Create instance of Batch.sol
  const batchAddress = "{{ networks.moonbase.precompiles.batch }}";
  const batch = await ethers.getContractAt("Batch", batchAddress);
}
main();
```

### Add Check Balances Helper Function 添加检查余额的辅助函数 {: #add-function-to-check-balances }

Next, we're going to create a helper function that will be used to check the balance of DTOK tokens the DEX and the signer account has. This will be particularly useful to see balance changes after the swaps are complete.

接下来，我们要创建一个辅助函数用于检查DEX和签署者账户中所拥有的DTOK余额。这在兑换完成后查看余额变更非常有效。

Since the `DemoToken` contract has an ERC-20 interface, you can check the balance of DTOKs an account has using the `balanceOf` function. So, we'll call the `balanceOf` function, passing in the address of the signer and the DEX, and then print the formatted results in DTOKs to the terminal:

由于`DemoToken`合约有一个ERC-20接口，您可以使用`balanceOf`函数检查账户拥有的DTOK余额。因此，我们将调用`balanceOf`函数，传入签署者和DEX的地址，然后将格式化的结果以DTOK形式显示到终端：

```js
async function checkBalances(demoToken) {
  // Get the signer
  const signer = (await ethers.getSigner()).address;

  // Get the balance of the DEX and print it
  const dexBalance = ethers.utils.formatEther(
    await demoToken.balanceOf(simpleDexAddress)
  );
  console.log(`Dex ${simpleDexAddress} has a balance of: ${dexBalance} DTOKs`);

  // Get the balance of the signer and print it
  const signerBalance = ethers.utils.formatEther(
    await demoToken.balanceOf(signer)
  );
  console.log(
    `Account ${signer} has a balance of: ${signerBalance} DTOKs`
  );
}
```

### Approve & Swap Tokens for DEV using the Batch Precompile 使用Batch Precompile批准和兑换DEV Token {: #add-logic-to-swap-dtoks }

At this point, you should already have some DTOKs in your signing account, and the `SimpleDex` contract should have some DEV liquidity. If not, you can use the `simpleDex.swapDevForDemoToken` function to acquire some DTOKs and add liquidity to the DEX. 

现在，您应该已经拥有一些DTOK在签署者账户中，`SimpleDex`合约已经有一些DEV流动性。如果没有的话，您可以使用`simpleDex.swapDevForDemoToken`函数来获取一些DTOK并添加流动性至DEX。

Now, we can approve the DEX to spend some DTOK tokens on our behalf so that we can swap the DTOKs for DEVs. On Ethereum, for example, we would need to send two transactions to be able to swap the DTOKs back to DEVs: an approval and a transfer. However, on Moonbeam, thanks to the batch precompile contract, you can batch these two transactions into a single one. This allows us to set the approval amount for the exact amount of the swap.

接下来，我们可以批准DEX代表我们支付一些DTOK Token，以便我们将DTOK兑换成DEV。举例来说，在以太坊上，我们需要发送两笔交易才能将DTOK兑换回DEV，一笔是批准，另一笔是转账。然后，在Moonbeam上，得益于batch precompile合约，您可以将这两笔交易合并为一笔交易。这允许我们为兑换的准确金额设置批准金额。

So instead of calling `demoToken.approve(spender, amount)` and then `simpleDex.swapDemoTokenForDev(amount)`, we'll get the encoded call data for each of these transactions and pass them into the batch precompile's `batchAll` function. To get the encoded call data, we'll use Ether's `interface.encodeFunctionData` function and pass in the necessary parameters. For example, we'll swap .2 DTOK for .2 DEV. In this case, for the approval, we can pass in the DEX address as the `spender` and set the `amount` to .2 DTOK. We'll also set the `amount` to swap as .2 DTOK. Again, we can use the `ethers.utils.parseEther` function to convert the amount in DTOK to Wei for us.

因此我们要调用`simpleDex.swapDemoTokenForDev(amount)`，而不是`demoToken.approve(spender, amount)`，我们将为每笔交易获取编码的调用数据并将其传入batch precompile的`batchAll`函数中。要获取编码的调用数据，我们将使用Ether的`interface.encodeFunctionData`函数并传入必要参数。举例而言，我们将把2个DTOK兑换成2个DEV。在本示例中，为了批准，我们将传入DEX地址作为`spender`，并设置`amount`为2个DTOK。我们也将设置`amount`以兑换为2个DTOK。同样，我们可以使用`ethers.utils.parseEther`函数以将DTOK中的金额转换为以Wei为单位的数值。

Once we have the encoded call data, we can use it to call the `batchAll` function of the batch precompile. This function performs multiple calls atomically, where the same index of each array combine into the information required for a single subcall. If a subcall reverts, all subcalls will revert. The following parameters are required by the `batchAll` function:

获得编码的调用数据后，我们可以使用该数据调用batch precompile的`batchAll`函数。此函数将以原子方式执行多个调用，其中每个数组的相同索引组合成单个子调用所需的信息。如果一个子调用恢复，则所有子调用都将恢复。`batchAll`函数需要以下参数：

--8<-- 'text/batch/batch-parameters.md'

So, the first index of each array will correspond to the approval and the second will correspond to the swap.

因此，每个数组的第一个索引将对应批准，第二个将对应兑换。

After the swap, we'll check the balances using the `checkBalances` function to make sure the balances have changed as expected.

兑换后，我们将使用`checkBalances`函数检查余额以确保余额会如预期进行变化。

We'll update the `main` function to include the following logic:

我们将更新`main`函数以包含以下逻辑：

```js
async function main() {
  // ...

  // Parse the value to swap to Wei
  const amountDtok = ethers.utils.parseEther("INSERT-AMOUNT-OF-DTOK-TO-SWAP");

  // Get the encoded call data for the approval and swap
  const approvalCallData = demoToken.interface.encodeFunctionData("approve", [
    simpleDexAddress,
    amountDtok,
  ]);
  const swapCallData = simpleDex.interface.encodeFunctionData(
    "swapDemoTokenForDev",
    [amountDtok]
  );

  // Assemble and send the batch transaction
  const batchAll = await batch.batchAll(
    [demoTokenAddress, simpleDexAddress], // to address
    [], // value of the native token to send 
    [approvalCallData, swapCallData], // call data
    [] // gas limit
  );
  await batchAll.wait();
  console.log(`Approve and swap DTOK tokens for DEV tokens: ${batchAll.hash}`);

  // Check balances after the swap
  await checkBalances(demoToken);
}
```

So, if you set the amount to swap to be .2 DTOK, the DEX balance will increase by .2 DTOK, and the signing account's balance will decrease by .2 DTOK. The transaction hash for the swap will also be printed to the terminal, so you can use [Moonscan](https://moonbase.moonscan.io){target=_blank} to view more information on the transaction.

如果您将兑换的金额设置为2个DTOK，则DEX余额将会增加2个DTOK，并且签署账户的余额将会减少2个DTOK。兑换的交易哈希将显示在终端，您可以通过Moonscan](https://moonbase.moonscan.io){target=_blank}查看交易的更多信息。

You can view the [complete script on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/tutorials/eth-api/batch-approve-swap/swap.js){target=_blank}.

您可以[在GitHub上查看完整的脚本](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/tutorials/eth-api/batch-approve-swap/swap.js){target=_blank}。

To run the script, you can use the following command:

要运行脚本，您可以使用以下命令：

```
npx hardhat run --network moonbase scripts/swap.js
```

In the terminal, you should see the following items:

在终端，您将看到以下内容：

- The transaction hash for the batch approval and swap
- 批处理批准和兑换的交易哈希
- The DEX's DTOK balance after the batch approval and swap
- 批处理批准和兑换后DEX上的DTOK余额
- Your account's DTOK balance after the batch approval and swap
- 批处理批准和兑换后账户的DTOK余额

![Swap tokens](/images/tutorials/eth-api/batch-approve-swap/batch-3.png)

And that's it! You've successfully used the batch precompile contract to batch an approval and swap into a single transaction, allowing for the approval amount to be the exact swap amount.

这样就可以了！您已成功使用合约将批准和兑换批处理至单个交易，允许批准金额为准确的兑换金额。

## Uniswap V2 Implementation - Uniswap V2实现 {: #uniswap-v2-implementation }

If we had a Uniswap V2-style DEX, the typical process for a swap would involve the router, which provides methods to safely swap assets, including the `swapExactTokensForETH` function. This function can be compared to the `swapDemoTokenForDev` function of the SimpleDex contract in the example above, where it swaps tokens in exchange for the native asset.

如果我们有一个Uniswap V2风格的DEX，基本兑换过程将会涉及路由器，这将提供安全兑换资产的函数，包括`swapExactTokensForETH`函数。此函数可以与上述示例中SimpleDex合约的`swapDemoTokenForDev`函数进行对比，它可以兑换Token以换取原生资产。

Before using the `swapExactTokensForETH` function, we would first need to approve the router as the spender and specify the approved amount to spend. Then, we could use the swap function once the router has been authorized to move our assets.

在使用`swapExactTokensForETH`函数之前，我们要先批准路由器作为支付者并指定要支付的批准金额。然后，当路由器通过授权后，我们可以使用兑换函数转移资产。

Like our previous example, this two-transaction process can be modified to batch the approval and the `swapExactTokensForETH` function into a single transaction using the batch precompile.

如上述示例所述，我们可以修改两个交易的过程，以使用batch precompile将批准和`swapExactTokensForETH`函数批处理到单个交易中。

This example will be based off the [Uniswap V2 deployment on Moonbase Alpha](https://github.com/PureStake/moonbeam-uniswap){target=_blank}. We'll approve the router to spend ERTH tokens and then swap ERTH for DEV tokens. Before diving into this example, make sure you swap some DEV for ERTH tokens on the [Moonbeam-swap DApp](https://moonbeam-swap.netlify.app/#/swap){target=_blank}, so that you have some ERTH to approve and swap back to DEV.

此示例将基于[Uniswap V2在Moonbase Alpha上的部署](https://github.com/PureStake/moonbeam-uniswap){target=_blank}。我们将批准路由器支付ERTH Token，然后将ERTH换成 DEV Token。在深入研究此示例之前，请确保您已在[Moonbeam-swap DApp](https://moonbeam-swap.netlify.app/#/swap){target=_blank}上将一些DEV兑换成ERTH Token，从而您可以将一些ERTH批准并换回 DEV。

Again, we'll use the `batchAll` function of the batch precompile. So, we'll need to get the encoded call data for the approval and the swap. To get the encoded call data, we'll use Ether's `interface.encodeFunctionData` function and pass in the necessary parameters.

同样，我们将使用batch precompile的`batchAll`函数。因此，我们需要获取编码的调用函数用于批准和兑换。要获取编码的调用数据，我们将使用Ether的`interface.encodeFunctionData`函数并传入必要参数。

For the `approve(spender, amount)` function, we'll need to pass in the Uniswap V2 router contract as the `spender`, as well as the amount of ERTH tokens approved to spend for the `amount`.

对于`approve(spender, amount)`函数，我们需要传入Uniswap V2路由器合约作为`spender`，以及批准用于`amount`的ERTH Token数量。

For the `swapExactTokensForETH(amountIn, amountOutMin, path, to, deadline)` function, we'll need to specify the amount of tokens to send, the minimum amount of output tokens that must be received so the transaction won't revert, the token addresses for the swap, the recipient of the native asset, and the deadline after which the transaction will revert. To swap ERTH to DEV, the path will be ERTH to WETH, so the path array will need to include the ERTH token address and the WETH token address: `[0x08B40414525687731C23F430CEBb424b332b3d35, 0xD909178CC99d318e4D46e7E66a972955859670E1]`.

对于`swapExactTokensForETH(amountIn, amountOutMin, path, to, deadline)`函数，我们需要指定要发送的Token数量，必须接收的最小输出Token数量，以便交易不会恢复，兑换的Token地址、原生资产的接收方以及交易将恢复的截止日期。要将ERTH兑换成DEV，路径是从ERTH到 WETH，因此路径数组将需要包括ERTH Token地址和WETH Token地址：`[0x08B40414525687731C23F430CEBb424b332b3d35, 0xD909178CC99d318e4D46e7E66a972955859670E1]`。

In addition to the ERTH and WETH addresses, to create a contract instance of the router contract, you'll also need the [router address](https://github.com/PureStake/moonbeam-uniswap/blob/f494f9a7a07bd3c5b94ac46484c9c7e6c781203f/uniswap-contracts-moonbeam/address.json#L14){target=_blank}, which is `0x8a1932D6E26433F3037bd6c3A40C816222a6Ccd4`.

除了ERTH和WETH地址，需要创建路由器合约的合约实例，您也需要用到[路由器地址](https://github.com/PureStake/moonbeam-uniswap/blob/f494f9a7a07bd3c5b94ac46484c9c7e6c781203f/uniswap-contracts-moonbeam/address.json#L14){target=_blank}，即`0x8a1932D6E26433F3037bd6c3A40C816222a6Ccd4`。

The code will resemble the following:

代码将与下方内容类似：

```js
// Define contract addresses
const erthTokenAddress = "0x08B40414525687731C23F430CEBb424b332b3d35";
const routerAddress = "0x8a1932D6E26433F3037bd6c3A40C816222a6Ccd4";
const wethTokenAddress = "0xD909178CC99d318e4D46e7E66a972955859670E1";

async function main() {
  // Create contract instances for the ERTH token, the Uniswap V2 router contract,
  // and the batch precompile
  // ...

  // Access the interface of the ERTH contract instance to get the encoded 
  // call data for the approval
  const amountErth = ethers.utils.parseEther("INSERT-AMOUNT-OF-ERTH-TO-SWAP");
  const approvalCallData = earth.interface.encodeFunctionData("approve", [
    routerAddress,
    amountErth,
  ]);

  // Access the interface of the Uniswap V2 router contract instance to get
  // the encoded call data for the swap
  const swapCallData = router.interface.encodeFunctionData(
    "swapExactTokensForETH",
    [
      amountErth, // amountIn
      "INSERT-AMOUNT-OUT-MIN", // amountOutMin
     [
      erthTokenAddress, // ERTH token address
      wethTokenAddress // WETH token address
      ], // path 
     "INSERT-YOUR-ADDRESS", // to
     "INSERT-DEADLINE" // deadline
    ]
  );

  // Assemble and send the batch transaction
  const batchAll = await batch.batchAll(
    [erthTokenAddress, routerAddress], // to address
    [], // value of the native token to send 
    [approvalCallData, swapCallData], // call data
    [] // gas limit
  );
  await batchAll.wait();
  console.log(`Approve and swap ERTH tokens for DEV tokens: ${batchAll.hash}`);
}
main();
```

!!! note 注意事项
    If you need the ABI to create a contract instance for any of the contracts in this example, all of the contracts are verified on [Moonscan](https://moonbase.moonscan.io){target=_blank}. So, you can search for the contract addresses on Moonscan and head to the **Contract** tab to get the **Contract ABI**.

如果您需要ABI为本示例中的任何合约创建合约实例，则所有合约都在[Moonscan](https://moonbase.moonscan.io){target=_blank}上进行了验证。因此，您可以在Moonscan上搜索合约地址并前往**Contract**标签获取**Contract ABI**。

This will result in the approval and swap being batched into a single transaction and the transaction hash will be printed to the console. You can now adapt and apply this logic to your Uniswap V2-style application!

这将导致批准和交换被批处理到单个交易中，交易哈希将显示在控制台。您现在可以修改此逻辑并应用到Uniswap V2风格的应用程序中！

--8<-- 'text/disclaimers/educational-tutorial.md'
--8<-- 'text/disclaimers/third-party-content.md'