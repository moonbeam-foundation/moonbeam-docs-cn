---
title: Truffle Development Life Cycle from Start to End - Truffle开发周期（从开始到结束）
description: Learn how to develop, test, and deploy smart contracts with Truffle and how to take your contracts from a local development node to Moonbeam MainNet. 学习如何使用Truffle开发、测试和部署智能合约以及如何将您的智能合约从本地开发节点部署至Moonbeam主网
---

# Smart Contract Development with Truffle: From a Local Development Node to Moonbeam MainNet - Truffle智能合约开发：从本地开发节点至Moonbeam主网

![Banner Image](/images/tutorials/eth-api/truffle-start-to-end/truffle-banner.png)

_January 10, 2022 | by Erin Shaben_

## Introduction 概览 {: #introduction }

For this tutorial, we'll be going through the smart contract development life cycle with [Truffle](/builders/build/eth-api/dev-env/truffle){target=_blank}. As we're starting to develop our contracts, we'll use a [Moonbeam Development Node](/builders/get-started/networks/moonbeam-dev){target=_blank} so we can quickly iterate on our code as we build it and test it. Then we'll progress to using the [Moonbase Alpha TestNet](/builders/get-started/networks/moonbase){target=_blank} so we can test our contracts on a live network with tokens that do not hold any real value, so we don't have to worry about paying for any mistakes. Finally, once we feel confident in our code, we'll deploy our contracts to [Moonbeam MainNet](/builders/get-started/networks/moonbeam){target=_blank}.

在本教程中，我们将使用[Truffle](/builders/build/eth-api/dev-env/truffle){target=_blank}完成智能合约开发周期。当我们开始开发合约时，我们将使用[Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev){target=_blank}，因此我们可以在构建时快速更迭代码并进行测试。然后我们将继续使用[Moonbase Alpha测试网](/builders/get-started/networks/moonbase){target=_blank}以便我们可以使用不具有任何实际价值的Token在实时网络上测试我们的合约，所以我们不必因此担心需要为任何错误付出代价。最后，一旦我们确定代码正确，我们就会将合约部署到[Moonbeam主网](/builders/get-started/networks/moonbeam){target=_blank}。

For the purposes of this tutorial, we'll create a simple NFT marketplace to list and sell a NFT collection that we'll call Dizzy Dragons. We'll create two contracts in our Truffle project: the NFT marketplace contract where we'll list the Dizzy Dragon NFTs and a Dizzy Dragons contract that we'll use to mint the NFTs. Then we'll use Truffle's built-in testing features to test our contracts and ensure they work as expected before deploying them to each network. **Please note that the contracts we'll be creating today are for educational purposes and should not be used in a production environment**.

出于编写教程的目的，我们将创建一个简单的NFT市场来列出和销售我们称之为Dizzy Dragons的NFT系列。我们将在我们的Truffle项目中创建两个合约：我们将在其中列出Dizzy Dragon NFT的NFT市场合约和我们将用于铸造NFT的Dizzy Dragons合约。然后我们将使用Truffle内置的测试功能来测试我们的合约，并确保它们在部署至每个网络之前依照预期运作。**请注意，我们今天将创建的合约用于教育目的，不应在生产环境中使用**。

## Checking Prerequisites 查看先决条件 {: #checking-prerequisites }

For this tutorial, you'll need the following:

要跟随此教程操作，您需要准备以下内容：

- Have [Docker installed](https://docs.docker.com/get-docker/){target=_blank}

- 完成[Docker安装](https://docs.docker.com/get-docker/){target=_blank}

- An account funded with DEV tokens to be used on the Moonbase Alpha TestNet and GLMR tokens to be used on Moonbeam MainNet.

- 一个在Moonbase Alpha测试网上拥有足够DEV Token以及在Moonbeam主网上拥有足够GLMR Token的账户

  --8<-- 'text/faucet/faucet-list-item.md'

- Your own endpoint and API key for Moonbeam, which you can get from one of the supported [Endpoint Providers](/builders/get-started/endpoints/){target=_blank}

- 您拥有的对Moonbeam终端和API密钥，您可以从支持的[端点提供者](/builders/get-started/endpoints/){target=_blank}处获得

- To [generate a Moonscan API key](https://docs.moonbeam.network/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank} that will be used to verify our contracts

- [生成Moonscan API密钥](https://docs.moonbeam.network/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}，用于验证我们的合约

## Create a Truffle Project 创建一个Truffle项目 {: #create-a-truffle-project }

To quickly get started with Truffle, we're going to use the [Moonbeam Truffle Box](https://github.com/PureStake/moonbeam-truffle-box){target=_blank}, which provides a boilerplate setup for developing and deploying smart contracts on Moonbeam. 

要快速上手使用Truffle，我们将使用[Moonbeam Truffle Box](https://github.com/PureStake/moonbeam-truffle-box){target=_blank}，其提供一个在Moonbeam上进行开发和部署智能合约的样板。

The Moonbeam Truffle Box comes pre-configured for a local Moonbeam development node and Moonbase Alpha. We'll need to add support for Moonbeam so when we're ready to deploy our contracts to MainNet, we'll be all set!

Moonbeam Truffle Box原先针对Moonbeam开发节点和Moonbase Alpha配置。我们需要在我们准备将合约部署至合约主网时使其支持Moonbeam网络，这样就完成了所有准备工作！

It also comes with a couple of plugins: the [Moonbeam Truffle plugin](https://github.com/purestake/moonbeam-truffle-plugin){target=_blank} and the [Truffle verify plugin](https://github.com/rkalis/truffle-plugin-verify){target=_blank}. The Moonbeam Truffle plugin will help us quickly get started with a local Moonbeam development node. The Truffle verify plugin will allow us to verify our smart contracts directly from within our Truffle project. We'll just need to configure a Moonscan API key to be able to use the Truffle verify plugin!

它还附带了几个插件：[Moonbeam Truffle插件](https://github.com/purestake/moonbeam-truffle-plugin){target=_blank}和[Truffle验证插件](https://github .com/rkalis/truffle-plugin-verify){target=_blank}。Moonbeam Truffle插件将帮助我们快速开始本地Moonbeam开发节点。Truffle验证插件将使我们能够直接从我们的Truffle项目中验证我们的智能合约。我们只需要配置一个Moonscan API密钥就可以使用Truffle验证插件！

!!! note 注意事项
    If you haven't done so already, you can follow the instructions to [generate a Moonscan API key](https://docs.moonbeam.network/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}. Your Moonbeam Moonscan API key will also work on Moonbase Alpha, but if you want to deploy to Moonriver, you will need a [Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank} API key.

如果您尚未完成Moonscan API，您可以跟随教程以[生成Moonscan API密钥](https://docs.moonbeam.network/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}。您的Moonbeam Moonscan API密钥也同样适用于Moonbase Alpha，但是如果您想要将其部署至Moonriver，您将会需要一个[Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank} API密钥。

Without further ado, let's create our project:

让我们直接开始创建我们的项目：

1. You can either install Truffle globally or clone the [Moonbeam Truffle Box](https://github.com/PureStake/moonbeam-truffle-box){target=_blank} repository:
    您可以选择全局安装Truffle或是复制[Moonbeam Truffle Box](https://github.com/PureStake/moonbeam-truffle-box){target=_blank}库：

    ```
    npm install -g truffle
    mkdir moonbeam-truffle-box && cd moonbeam-truffle-box
    truffle unbox PureStake/moonbeam-truffle-box
    ```

    To avoid globally installing Truffle, you can run the following command and then access the Truffle commands by using `npx truffle <command>`:
    要避免全局安装Truffle，您可以运行以下命令并通过使用`npx truffle <command>`访问Truffle命令：

    ```
    git clone https://github.com/PureStake/moonbeam-truffle-box
    cd moonbeam-truffle-box
    ```

2. Install the dependencies that come with the Moonbeam Truffle Box:
    安装Moonbeam Truffle Box中的依赖项：

    ```
    npm install
    ```

3. Open the `truffle-config.js` file, where you'll find the network configurations for a local development node and Moonbase Alpha. You'll need to add the Moonbeam configurations and your Moonscan API key here:
    打开`truffle-config.js`文件，您将会在其中找到针对本地开发节点和Moonbase Alpha的网络配置。您需要在此加入Moonbeam配置和您的Moonscan API密钥：
    
    ```
    ...
    networks: {
      ...
      moonbeam: {
        provider: () => {
          ...
          return new HDWalletProvider(
            "PRIVATE-KEY-HERE",  // Insert your private key here
            "{{ networks.moonbeam.rpc_url }}" // Insert your RPC URL here
          )
        },
        network_id: {{ networks.moonbeam.chain_id }} // (hex: {{ networks.moonbeam.hex_chain_id }}),
      },
    },
    ...
    api_keys: {
      moonscan: "MOONSCAN-API-KEY-HERE"
    },
    ...
    ```

Now we should have a Truffle project that is configured for each of the networks we'll be deploying smart contracts to in this guide.

现在我们应该已经将Truffle项目配置至本教程将会部署至的所有网络之中。

For the sake of this guide, we can remove the `MyToken.sol` contract and the associated tests that come with the project:

出于本教程目的，我们将会移除`MyToken.sol`合约以及项目的相关测试：

```
rm contracts/MyToken.sol test/test_MyToken.js
```

## Contract Setup 合约设置 {: #contract-setup }

The contracts in the following sections import contracts from [OpenZeppelin](https://www.openzeppelin.com/contracts){target=_blank}. If you followed the steps in the [Create a Truffle Project](#create-a-truffle-project) section, the Moonbeam Truffle box comes with the `openzeppelin/contracts` dependency already installed. If you created your project a different way, you'll need to install the dependency yourself. You can do so using the following command:

以下部分中的合约为从[OpenZeppelin](https://www.openzeppelin.com/contracts){target=_blank}导入。如果您跟随[创建Truffle项目](#create-a-truffle-project)部分中的步骤进行操作，Moonbeam Truffle Box会附带已安装的`openzeppelin/contracts`依赖项。如果您以不同的方式创建项目，则需要自己安装依赖项。您可以使用以下命令执行此操作：

```
npm i @openzeppelin/contracts
```

### Add Simple NFT Marketplace Contract 添加简易NFT市场合约 {: #example-nft-marketplace-contract }

As the goal is to go over the development life cycle, let's start off with a simple NFT marketplace contract with minimal functionality. We'll create this marketplace specifically for our new Dizzy Dragons NFT collection. 

由于我们的目标是经历整个开发周期，因此让我们从一个功能最少的简易NFT市场合约开始。我们将专门为我们新的Dizzy Dragons NFT系列创建这个市场。

The marketplace contract will have two functions that allow a Dizzy Dragon NFT to be listed and purchased: `listNft` and `purchaseNft`. Ideally, an NFT marketplace would have additional functionality such as the ability to fetch a listing, update or cancel listings, and more. However, **this contract and our Dizzy Dragon NFT collection is just for demonstration purposes**.

市场合约将具有两个功能，允许上架和购买Dizzy Dragon NFT：`listNft`和`purchaseNft`。一般而言，在理想情况下NFT市场应具有附加功能，例如获取清单、更新或取消清单等功能。但是，**此合约和我们的Dizzy Dragon NFT系列仅用于演示目的**。

We'll add our contract to the `contracts` directory:

我们将我们的合约添加至`contracts`目录：

```
touch contracts/NftMarketplace.sol
```

In the `NftMarketplace.sol` file, we'll add the following example contract:

在`NftMarketplace.sol`文件中，我们将会添加以下范例合约：

```Solidity
// Inspired by https://github.com/PatrickAlphaC/hardhat-nft-marketplace-fcc/blob/main/contracts/NftMarketplace.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NotOwner();
error PriceMustBeAboveZero();
error NotApprovedForMarketplace();
error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);

contract NftMarketplace is ReentrancyGuard {
    struct Listing {
        uint256 price;
        address seller;
    }

    // Map the NFT address to the listing information
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    event NftListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
    event NftPurchased(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        // Ensure that only the owner of an NFT can list it
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    function listNft(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert PriceMustBeAboveZero();
        }
        IERC721 nft = IERC721(nftAddress);
        // Make sure that the marketplace has been approved to transfer the NFT
        if (nft.getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }
        // Save the NFT to state
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit NftListed(msg.sender, nftAddress, tokenId, price);
    }

    function purchaseNft(address nftAddress, uint256 tokenId)
        external
        payable
        nonReentrant
    {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        // Make sure the payment received is not less than the listing price
        if (msg.value < listedItem.price) {
            revert PriceNotMet(nftAddress, tokenId, listedItem.price);
        }
        // Remove the NFT from state
        delete (s_listings[nftAddress][tokenId]);
        // Transfer the NFT to the buyer
        IERC721(nftAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);
        emit NftPurchased(msg.sender, nftAddress, tokenId, listedItem.price);
        // Send the payment to the seller
        (bool success, ) = payable(listedItem.seller).call{value: msg.value}("");
        require(success, "Transfer failed");
    }
}
```

!!! challenge 挑战
    Try to create a `getListing` function that, given the address of an NFT and its token ID, returns the listing.

尝试创建一个能够以给定NFT地址和Token ID获取列出的`getListing`函数。

### Add NFT Contract 添加NFT合约 {: #add-nft-contract }

In order to test our NFT Marketplace contract, we'll need to mint a Dizzy Dragon NFT. To do so, we'll create a simple NFT contract named `DizzyDragons.sol`:

要测试我们的NFT市场合约，我们需要铸造一个Dizzy Dragon NFT。因此，我们需要创建一个称为`DizzyDragons.sol`的简易NFT合约：

```
touch contracts/DizzyDragons.sol
```

In the `DizzyDragons.sol` file, we'll add the following example contract:

在`DizzyDragons.sol`文件中，我们将添加以下范例合约：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DizzyDragons is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  
  address nftMarketplace;

  event NftMinted(uint256);

  constructor(address _nftMarketplace) ERC721("DizzyDragons", "DDRGN") {
    nftMarketplace = _nftMarketplace;
  }

  function mint(string memory _tokenURI) public {
    // Increase the token ID counter
    _tokenIds.increment();
    // Save the token ID to be used to safely mint a new NFT
    uint256 newTokenId = _tokenIds.current();
    _safeMint(msg.sender, newTokenId);
    // Set the token URI metadata for the NFT
    _setTokenURI(newTokenId, _tokenURI);
    // Approve the NFT marketplace to transfer the NFT
    approve(nftMarketplace, newTokenId);
    emit NftMinted(newTokenId);
  }
}
```

### Compile the Contracts 编译合约 {: #compile-contracts }

Now that we have created our contracts, we can go ahead and compile them, which will automatically generate artifacts for each contract. We'll use the artifacts later on when we're writing our tests and deploying our contracts. 

现在我们已经成功创建了我们的合约，我们需要继续操作并编译他们，其会自动为每个合约生成架构，我们将会在后面编写测试和部署合约时使用这些架构。

To compile our contracts, we can run the following command:

要编译我们的合约，我们可以先运行以下命令：

```
npx truffle compile
```

![Run Truffle compile](/images/tutorials/eth-api/truffle-start-to-end/truffle-1.png)

The artifacts will be written to the `build/contracts` directory.

架构将会被写入`build/contracts`目录。

### Setup Deployment Script 设置部署脚本 {: #setup-deployment-script }

Let's update the deployment migratio script so that later on we can jump straight into deploying our contracts. We'll deploy the `NftMarketplace` contract followed by the `DizzyDragons` contract, as we'll need to pass in the address of the marketplace to the constructor of the `DizzyDragons` contract. 

我们需先更新部署迁移脚本，以便能够在其后直接部署我们的合约。我们将会在部署`NftMarketplace`合约后部署`DizzyDragons`合约，因为我们需要输入市场的地址传递至`DizzyDragons`合约构建函数。

To update the deployment script, open up the `migrations/2_deploy_contracts.js` migration file and replace it with the following:

要更新部署脚本，请打开`migrations/2_deploy_contracts.js`迁移文件并将内容替换成以下内容：

```js
var NftMarketplace = artifacts.require("NftMarketplace");
var DizzyDragons = artifacts.require("DizzyDragons");

module.exports = async function (deployer) {
  // Deploy the NFT Marketplace
  await deployer.deploy(NftMarketplace);
  const nftMarketplace = await NftMarketplace.deployed();
  // Deploy the Dizzy Dragons contract
  await deployer.deploy(DizzyDragons, nftMarketplace.address);
};
```

## Start up the Development Node 启动开发节点 {: #start-development-node }

Before we jump into writing our tests, let's take some time now to start up our develpoment node so that we can run our tests against it.

在我们开始编写测试之前，让我们花费一点时间启动开发节点，这样我们才能够运行测试。

Since the Moonbeam Truffle box comes with the Moonbeam Truffle plugin, starting up a development node is a breeze. All you need is to have [Docker installed](https://docs.docker.com/get-docker/){target=_blank}. If you are all set with Docker, you need to fetch the latest Moonbeam Docker image by running:

由于Moonbeam Truffle box附带Moonbeam Truffle插件，因此启动开发节点变得轻而易举。您只需要安装 [Docker](https://docs.docker.com/get-docker/){target=_blank}即可。如果您已准备好使用Docker，您则可以通过运行以下命令获取最新的Moonbeam Docker映像：

```
npx truffle run moonbeam install
```

Then you can start the node:

接着您可以启动节点：

```
npx truffle run moonbeam start
```

Once your node has been successfully started, you should see the following output in your terminal:

当您的节点被成功启动后，您将能够在您的终端看见以下输出：

![Install and spin up a Moonbeam development node](/images/tutorials/eth-api/truffle-start-to-end/truffle-2.png)

You can check out all of the available commands in the [Using the Moonbeam Truffle Plugin to Run a Node](/builders/build/eth-api/dev-env/truffle/#using-the-moonbeam-truffle-plugin-to-run-a-node){target=_blank} section of our Truffle docs. 

您可以在Truffle相关文档中[使用Moonbeam Truffle插件运行节点](/builders/build/eth-api/dev-env/truffle/#using-the-moonbeam-truffle-plugin-to-run-a-node){target=_blank}部分查看所有可用命令。

You can also set up a development node without the Moonbeam Truffle plugin, to do so, please refer to the [Getting Started with a Moonbeam Development Node](/builders/get-started/networks/moonbeam-dev/){target=_blank} guide.

您也可以不使用Moonbeam Truffle插件设置开发节点，请查看[启动Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev/){target=_blank}教程了解如何操作。

## Write Tests 编写测试 {: #write-tests }

Before sending our code out into the wild, we'll want to test our smart contracts to ensure they function as expected. Truffle provides the option of writing tests in JavaScript, TypeScript, or Solidity. It also comes with out-of-the-box support for [Mocha](https://mochajs.org/){target=_blank} and [Chai](https://chaijs.com/){target=_blank}.

在将我们的代码发送出去之前，我们要测试我们的智能合约以确保其按预期运行。Truffle提供了使用JavaScript、TypeScript或Solidity编写测试的选项。它还为[Mocha](https://mochajs.org/){target=_blank}和[Chai](https://chaijs.com/){target=_blank}提供开箱即用的支持。

For this guide, we'll write our tests in JavaScript so we can take advantage of the built-in support for Mocha and Chai. 

以此教程来说，我们将会用JavaScript编写我们的测试以利用Mocha和Chai的内置支持。

If you're familiar with Mocha, you're probably used to using the `describe` function to group tests and the `it` function for each individual test. When writing tests with Truffle, you'll replace `describe` with `contract`. The `contract` function is exactly like `describe`, but it includes additional functionality that will re-deploy your migrations at the beginning of every test file, providing a clean-room environment. You'll still use the `it` function like you normally would for the individual tests.

如果您熟悉Mocha，您可能习惯于使用`describe`函数对测试进行分组，并使用`it`函数对每个单独的测试进行测试。使用Truffle编写测试时，您需要将`describe`替换为`contract`。`contract`函数与`describe`完全一样，但它包含额外的功能，您可以在每个测试文件的开头重新部署您的迁移，提供一个干净的环境。同时，您仍然会如同针对单个测试一样使用`it`函数。

Truffle also makes testing easier by including a `web3` instance in each test file that is configured for the correct network, so you don't have to configure anything yourself. You'll simply run `npx truffle test --network <network-name>`.

Truffle还通过在为正确网络配置的每个测试文件中包含一个`web3`实例来简化测试，因此您无需自行配置任何东西，只需运行`npx truffle test --network <network-name>`即可。

### Test Setup 测试设置 {: #test-setup }

To get started with our tests, we can add our test file, which will start with `test_` to indicate that it's a test file:

要开始我们的测试，我们可以添加我们的测试文件，它将以`test_`开头以表达其为一个测试文件：

```
touch test/test_NftMarketplace.js
```

Now that we can set up our test file, let's take a minute to review what we'll need to do next:

现在我们已经能够设置我们的测试文件，让我们花几分钟时间了解我们接下来的步骤：

- Import the artifacts for the `NftMarketplace` and `DizzyDragons` contracts using Truffle's `artifacts.require()`, which provides an abstraction instance of a contract
- 使用Truffle的`artifacts.require()`，其提供合约的抽象实例，来导入`NftMarketplace`和`DizzyDragons`架构
- Create a `contract` function to group our tests. The `contract` function will also provide us with our account we have setup in our `truffle-config.js` file. As we used the Moonbeam Truffle box, our development account has been set up for us. When we move on to deploy and test our contracts on Moonbase Alpha and Moonbeam, we'll need to configure our accounts
- 创建一个`contract`函数来对我们的测试进行分组。`contract`函数还将为我们提供我们在`truffle-config.js`文件中设置的帐户。当我们使用Moonbeam Truffle box时，我们的开发帐户已经为我们设置完毕。当我们继续在Moonbase Alpha和Moonbeam上部署和测试我们的合约时，则需要自行配置的账户
- For each test, we're going to need to deploy our contracts and mint an NFT. To do this, we can take advantage of the [`beforeEach` hook provided by Mocha](https://mochajs.org/#hooks){target=_blank}
- 对于每个测试，我们都需要部署我们的合约并创建一个NFT。为此，我们可以利用[Mocha提供的`beforeEach` hook](https://mochajs.org/#hooks){target=_blank}
- As we'll be minting an NFT for each test, we'll need to have a `tokenUri`. The `tokenUri` that we'll use for our examples will be for Daizy, our first Dizzy Dragon NFT. The `tokenUri` will be set to `"https://gateway.pinata.cloud/ipfs/QmTCib5LvSrb7sshLhLvzmV7wdSdmSt3yjB4dqQaA58Td9"`, which was created specifically for this tutorial and is for educational purposes only 
- 由于我们将为每个测试创建一个NFT，因此我们需要一个`tokenUri`。我们在范例中使用的`tokenUri`将用于Daizy，这是我们的第一个Dizzy Dragon NFT。`tokenUri`将设置为`"https://gateway.pinata.cloud/ipfs/QmTCib5LvSrb7sshLhLvzmV7wdSdmSt3yjB4dqQaA58Td9"`，这是专门为本教程创建的，仅用于教育目的

You can enter the `tokenUri` into your web browser to view the metadata for Daizy and the [image for Daizy](https://gateway.pinata.cloud/ipfs/QmTzmrRb6TmEsP96dCoBv2kjdiCiojagBU7YJ95RaAuuF4?_gl=1*m58ja2*_ga*ODc3ODA3MjcwLjE2NzQ2NjQ2ODY.*_ga_5RMPXG14TE*MTY3NDY2NDY4Ni4xLjEuMTY3NDY2NDcwMi40NC4wLjA.){target=_blank} has also been pinned so you can easily see what Daizy looks like!

您可以在您的浏览器中输入`tokenUri`以查看Daizy的元数据，以及[Daizy的图像](https://gateway.pinata.cloud/ipfs/QmTzmrRb6TmEsP96dCoBv2kjdiCiojagBU7YJ95RaAuuF4?_gl=1*m58ja2*_ga*ODc3ODA3MjcwLjE2NzQ2NjQ2ODY.*_ga_5RMPXG14TE*MTY3NDY2NDY4Ni4xLjEuMTY3NDY2NDcwMi40NC4wLjA.){target=_blank}也已同时输入以供您查看。

![Daizy NFT metadata and image](/images/tutorials/eth-api/truffle-start-to-end/truffle-3.png)

So, now that we have a game plan, let's implement it! In the `test_NftMarketplace.js` file, we can add the following code:

接着，让我们继续执行计划！在`test_NftMarketplace.js`文件中，我们可以添加以下代码：

```js
const NftMarketplace = artifacts.require("NftMarketplace");
const DizzyDragons = artifacts.require("DizzyDragons");

contract("NftMarketplace", (accounts) => {
  const tokenUri =
    "https://gateway.pinata.cloud/ipfs/QmTCib5LvSrb7sshLhLvzmV7wdSdmSt3yjB4dqQaA58Td9";
  let nftMarketplace;
  let dizzyDragonsNft;
  let mintedNft;

  beforeEach(async () => {
    // Deploy the marketplace
    nftMarketplace = await NftMarketplace.deployed();
    // Deploy a Dizzy Dragon NFT
    dizzyDragonsNft = await DizzyDragons.deployed();
    // Mint Daizy the Dizzy Dragon NFT
    mintedNft = await dizzyDragonsNft.mint(tokenUri);
  });

  // TODO: Add tests here
});
```

!!! note 注意事项
    You don't have to import Mocha or Web3 as both packages comes out-of-the-box with Truffle! 

您无需导入Mocha或是Web3，因为两个包皆包含在Truffle之中！

Now we're ready to start writing our tests!

现在我们已经做好编写测试的准备！

### Test Minting NFTs 测试铸造NFT {: #test-minting-nfts }

For our first test, let's make sure that we are minting our new Dizzy Dragon NFT as expected. We'll use the event logs from the transaction to ensure that the `NftMinted` event of the `DizzyDragons` contract has been emitted. The event logs will return the arguments passed to the `NftMinted` event, which will be the token ID:

在我们的首个测试，确保Dizzy Dragon NFT正如预期在铸造。我们将会使用来自交易的事件日志以确保`DizzyDragons`合约中的`NftMinted`已发出。事件日志将会返回传递至`NftMinted`事件的内容，其将会是Token ID：

```sol
event NftMinted(uint256);
```

The JavaScript event logs for the minting transaction will resemble the following:

铸造交易的JavaScript事件日志将类似于下方代码：

```js
{
  ...
  event: 'NftMinted',
  args: {
    '0': BN // Token ID
  }
}
```

We'll need to convert the BN to a number using `toNumber()` and then we can also test that the token ID of the NFT is `1`. Since we are deploying the `DizzyDragons` contract fresh before each test, it should always be the first NFT minted.

我们需要使用`toNumber()`将BN转换为数字，然后我们还可以测试NFT的Token ID是否为`1`。由于我们在每次测试前都部署了新的`DizzyDragons`合约，因此它应该始终是第一个铸造的NFT。

In place of the `// TODO: Add tests here` comment, you can add the following test:

在`// TODO: Add tests here`命令中，您可以添加以下测试：

```js
  it("should mint a new Dizzy Dragon NFT", async () => {
    // Access the logs of the mint transaction
    // Remember: mintedNft was created in the beforeEach function!
    // We grab the 2nd index here, because in the mint function _safeMint is
    // called, which emits a Transfer event. Then the approve function is called,
    // which emits an Approval event, and lastly the NftMinted event is emitted
    const nftMintedLog = mintedNft.logs[2];

    // We'll use these variables from the event logs in our tests
    const event = nftMintedLog.event;
    const tokenId = nftMintedLog.args[0].toNumber();

    // Use Mocha's assert to test that the NftMinted event was emitted
    // and the token ID of the NFT is 1
    assert.equal(event, "NftMinted");
    assert.equal(tokenId, 1);
  });
```

Assuming your [Moonbeam development node is up and running](#start-development-node), you can run the test with the following command:

假设您[Moonbeam开发节点已设置完毕并顺利运行](#start-development-node)，您可以使用以下命令运行测试：

```
npx truffle test --network dev
```

![Run first test](/images/tutorials/eth-api/truffle-start-to-end/truffle-4.png)

### Test Listing NFTs 测试上架NFT {: #test-listing-nfts }

For our next test, we're going to test that we can successfully list our freshly minted NFT using the `listNft` function of the `NftMarketplace` contract. So, again we'll use our event logs to test that the `NftListed` event has been emitted along with the correct state variables such as the seller and token ID. The event logs will return the arguments passed to the `NftMinted` event, which will be the seller's address, the NFT's address, the token ID and the listing price:

对于我们的下一个测试，我们将测试我们是否可以使用`NftMarketplace`合约的`listNft`功能成功上架我们新铸造的NFT。因此，我们将再次使用我们的事件日志来测试是否已发出`NftListed`事件以及正确的状态变量，例如卖家和Token ID。事件日志将返回传递给`NftMinted`事件的参数，这将是卖家的地址、NFT的地址、Token ID和标价：

```sol
event NftListed(
    address indexed seller,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
);
```

So, our event logs should resemble the following:

事件日志应当类似下方代码：

```js
{
  ...
  event: 'NftListed',
  args: {
    ...
    seller: '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b',
    nftAddress: '0x4D73053013F876e319f07B27B59158Cca01A64C5',
    tokenId: [BN],
    price: [BN]
  }
}
```

With this in mind, we can tackle our next test. So, after the first test, we can go ahead and the following:

了解上述内容后，我们可以进入下一个测试。因此，在第一次测试之后，我们可以继续进行以下操作：

```js
  it("should list a new Dizzy Dragon NFT", async () => {
    // Access the logs of the mint transaction so we can grab
    // the contract address of the NFT and the token ID
    const nftMintedLog = mintedNft.logs[2];

    // Assemble the arguments needed to list the NFT that was minted
    // in the beforeEach function
    const price = await web3.utils.toWei("1", "ether"); // Set the price of the NFT to 1 ether
    const nftAddress = nftMintedLog.address; 
    const mintTokenId = nftMintedLog.args[0].toNumber();

    // Call the listNft function of the NftMarketplace contract with the
    // address of the NFT, the token ID, and the price
    const listResult = await nftMarketplace.listNft(
      nftAddress,
      mintTokenId,
      price
    );
    
    // We'll use these variables from the event logs in our tests. Use
    // the 0 index because the NftListed event is the only event emitted
    const event = listResult.logs[0].event;
    const seller = listResult.logs[0].args.seller;
    const tokenId = listResult.logs[0].args.tokenId.toNumber();

    // Use Mocha's assert to test that the NftListed event was emitted
    // with the correct arguments for the seller and token ID
    assert.equal(event, "NftListed");
    assert.equal(seller, accounts[0]);
    assert.equal(tokenId, mintTokenId);
  });
```

Again, you can run the tests to make sure that the tests pass as expected.

同样，您可以运行测试以确认测试通过预期。

![Run first two tests](/images/tutorials/eth-api/truffle-start-to-end/truffle-5.png)

### Test Purchasing NFTs 测试购买NFT {: #test-purchasing-nfts }

Finally, let's test that an NFT on our marketplace can be purchased using the `purchaseNft` function of the `NftMarketplace` contract. Similarly to our previous tests, we'll use the event logs to test that the `NftPurchased` event has been emitted along with the correct state variables such as the buyer and token ID. The event logs will return the arguments passed to the `NftPurchased` event, which will be the buyer's address, the NFT's address, the token ID and the purchase price:

最后，让我们测试是否可以使用`NftMarketplace`合约的`purchaseNft`功能购买我们市场上的NFT。与我们之前的测试类似，我们将使用事件日志来测试是否已发出`NftPurchased`事件以及正确的状态变量，例如买家和Token ID。事件日志将返回传递给`NftPurchased`事件的参数，即买家地址、NFT地址、Token ID和购买价格：

```sol
event NftListed(
    address indexed buyer,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
);
```

So, our event logs should resemble the following:

事件日志应当如下：

```js
{
  ...
  event: 'NftPurchased',
  args: {
    ...
    buyer: '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b',
    nftAddress: '0xDdd543E793D91AD9282ACde331ac250A445C9079',
    tokenId: [BN],
    price: [BN]
  }
}
```

Let's jump into writing the next test by adding the following to our test file:

让我们通过添加下方代码段至测试文件以编写下个测试：

```js
  it("should buy a new Dizzy Dragon NFT", async () => {
    const nftMintedLog = mintedNft.logs[2];

    // List the NFT first
    const price = await web3.utils.toWei("1", "ether"); 
    const nftAddress = nftMintedLog.address;
    const mintTokenId = nftMintedLog.args[0].toNumber();
    await nftMarketplace.listNft(
      nftAddress,
      mintTokenId,
      price
    );
    
    // Purchase the NFT using the purchaseNft function and passing in the
    // address of the NFT and the token ID. We'll also send a payment along
    // for the asking price of the NFT
    const purchaseNft = await nftMarketplace.purchaseNft(
        nftAddress,
        mintTokenId,
        { value: price }
    );

    // We'll use these variables from the event logs in our tests. Use
    // the 0 index because the NftPurchased event is the only event emitted
    const event = purchaseNft.logs[0].event;
    const buyer = purchaseNft.logs[0].args.buyer;
    const tokenId = listResult.logs[0].args.tokenId.toNumber();

    // Use Mocha's assert to test that the NftPurchased event was emitted
    // with the correct argument for the buyer and token ID
    assert.equal(event, "NftPurchased"); 
    assert.equal(buyer, accounts[0]);
    assert.equal(tokenId, mintTokenId);
  });
```

That's it for the tests! To run them all, go ahead and run:

测试内容即此！如要运行他们，请运行以下命令：

```
npx truffle test --network dev
```

![Run all tests](/images/tutorials/eth-api/truffle-start-to-end/truffle-6.png)

With Mocha, you have the flexbility to test for a variety of edge cases and don't have to use `assert.equal` as we did in our examples. Since support for the Chai assertion library is included, you can also use [Chai's `assert` API](https://www.chaijs.com/guide/styles/#assert){target=_blank} or their [`expect`](https://www.chaijs.com/guide/styles/#expect){target=_blank} and [`should`](https://www.chaijs.com/guide/styles/#should){target=_blank} APIs. For example, you can also assert for failures using [Chai's `assert.fail` method](https://www.chaijs.com/api/assert/#method_fail){target=_blank}.

使用Mocha，您可以灵活地测试各种情况，而不必像我们在示例中那样使用`assert.equal`。由于包含对Chai断言库的支持，您还可以使用[Chai的`assert` API](https://www.chaijs.com/guide/styles/#assert){target=_blank}或他们的[`expect` ](https://www.chaijs.com/guide/styles/#expect){target=_blank}和[`should`](https://www.chaijs.com/guide/styles/#should){target =_blank} API。例如，您还可以使用[Chai的`assert.fail`函数](https://www.chaijs.com/api/assert/#method_fail){target=_blank}以断言失败。

!!! challenge 挑战
    Try adding a test that uses a `tokenUri` for an NFT that hasn't approved the `NftMarketplace` contract to transfer it. You should assert that the call will fail.

尝试为尚未批准`NftMarketplace`合约传输的NFT添加一个使用`tokenUri`的测试。您应该断言该调用将失败。

When you're done testing on the Moonbeam development node, don't forget to stop and remove the node! You can do so by running:

在Moonbeam开发节点上完成测试后，请确保停止并删除节点！你可以通过运行下列命令执行：

```
npx truffle run moonbeam stop && \
npx truffle run moonbeam remove
```

![Stop the development node](/images/tutorials/eth-api/truffle-start-to-end/truffle-7.png)

## Deploy to Moonbase Alpha TestNet 部署至Moonbase Alpha测试网 {: #deploying-to-moonbase-alpha }

Now that we've been able to rapidly develop our contracts with our Moonbeam development node and feel confident with our code, we can move on to testing it on the Moonbase Alpha TestNet. 

现在我们已经能够使用我们的Moonbeam开发节点快速开发我们的合约并对代码充满信心，我们可以继续在Moonbase Alpha测试网上测试它。

First, you'll need to update your `truffle-config.js` file and add in the private key of your account on Moonbase Alpha. The `privateKeyMoonbase` variable already exists, you just need to set it to your private key. **This is just for demonstration purposes only, never store your private keys in a JavaScript file**.

首先，您需要更新您的`truffle-config.js`文件并添加您在Moonbase Alpha上的帐户私钥。 此处，`privateKeyMoonbase`变量已经存在，您只需将其设置为您的私钥即可。**这仅用于演示目的，切勿将您的私钥存储在JavaScript文件中**。

Once you've set your account up, you can run your tests on Moonbase Alpha to make sure they work as expected on a live network:

设置帐户后，您可以在Moonbase Alpha上运行测试以确保它们在实际网络上按预期运作：

```
npx truffle test --network moonbase
```

![Run all tests on Moonbase Alpha](/images/tutorials/eth-api/truffle-start-to-end/truffle-8.png)

!!! note 注意事项
    To avoid hitting rate limits with the public endpoint, you can get your own endpoint from one of the supported [Endpoint Providers](/builders/get-started/endpoints/){target=_blank}.

为避免公共终端达到速率限制，您可以从支持的[端点提供者](/builders/get-started/endpoints/){target=_blank}中获取您自己的端点。

Since we already updated our migration script, we're all set to deploy our contracts using this command:

由于我们已经更新了我们的迁移脚本，我们可以使用此命令部署我们的合约：

```
npx truffle migrate --network moonbase
```

You should see the transaction hashes for the deployment of each contract in your terminal and that a total of three deployments have been made.

您应该在终端中看到每个合约部署的交易哈希，现在总共已完成了三个部署。

![Deploy contracts on Moonbase Alpha](/images/tutorials/eth-api/truffle-start-to-end/truffle-9.png)

With our contracts deployed, we could begin to build a dApp with a frontend that interacts with these contracts, but it's out of scope for this tutorial.

部署合约后，我们可以开始构建一个带有与这些合约交互的前端的dApp，但这超出了本教程的范围。

Once you've deployed your contracts, don't forget to verify them! You will run the `run verify` command and pass in the deployed contracts' names and the network where they've been deployed to:

部署合约后，不要忘记验证它们！您将运行`run verify`命令并输入已部署合约的名称和它们已部署到的网络：

```
npx truffle run verify NftMarketplace DizzyDragons --network moonbase
```

![Verify contracts on Moonbase Alpha](/images/tutorials/eth-api/truffle-start-to-end/truffle-10.png)

For reference, you can check out how the verified contracts will look on Moonscan for the [NftMarketplace](https://moonbase.moonscan.io/address/0x14138a5c7c6F0f33cB02aa63D45BDE2Cd0E17A90#code){target=_blank} and [DizzyDragons](https://moonbase.moonscan.io/address/0x747CB7cCD05BCb4A94e284af9Cc35189C3f9c540#code){target=_blank} contracts.

作为参考，您可以查看[NftMarketplace](https://moonbase.moonscan.io/address/0x14138a5c7c6F0f33cB02aa63D45BDE2Cd0E17A90#code){target=_blank}和[DizzyDragons](https:/ /moonbase.moonscan.io/address/0x747CB7cCD05BCb4A94e284af9Cc35189C3f9c540#code){target=_blank}合约。

Feel free to play around and interact with your contracts on the TestNet! Since DEV tokens have no real monetary value, now is a good time to work out any kinks before we deploy our contracts to Moonbeam MainNet where the tokens do have value!

您可以随意在测试网上玩耍并与您的合约互动！由于DEV Token没有真正的价值，现在将会是解决任何问题的好时机，然后再将我们的合约部署到Token有实际价值的Moonbeam主网上！

## Deploy to Production on Moonbeam MainNet 在Moonbeam主网上完成生产部署 {: #deploying-to-production }

We thought we felt confident before, but now that we've tested our contracts on Moonbase Alpha we feel even more confident. So let's deploy our contracts on Moonbeam!

现在我们已经在Moonbase Alpha上测试了我们的合约，接下来让我们在Moonbeam上部署我们的合约吧！

Again, you'll need to update your `truffle-config.js` and add in the private key of your account on Moonbeam. If you're interested in a secure way to add your private keys, you can check out the [Truffle Dashboard](https://trufflesuite.com/blog/introducing-truffle-dashboard/){target=_blank}, which allows you to connect to your MetaMask wallet without any configuration. For more information, please refer to the [Truffle docs on using the Truffle Dashboard](https://trufflesuite.com/docs/truffle/how-to/use-the-truffle-dashboard/){target=_blank}. Whatever you do, **never store your private keys in a JavaScript file**.

同样，您需要更新您的`truffle-config.js`并添加您在Moonbeam上的帐户的私钥。如果您对添加私钥的安全方式感兴趣，可以查看[Truffle Dashboard](https://trufflesuite.com/blog/introducing-truffle-dashboard/){target=_blank}，它允许您无需任何配置即可连接到您的MetaMask钱包。有关更多信息，请参阅[关于使用Truffle Dashboard的Truffle文档](https://trufflesuite.com/docs/truffle/how-to/use-the-truffle-dashboard/){target=_blank}。但切记**永远不要将您的私钥存储在JavaScript文件中**。

Since the Moonbeam Truffle box doesn't come with the Moonbeam network configurations, you'll need to add them:

由于Moonbeam Truffle box未附带Moonbeam网络配置，因此您需要添加它们：

```
...
module.exports = {
  networks: {
    ...
    moonbeam: {
      provider: () => {
        ...
        return new HDWalletProvider(
          'PRIVATE-KEY-HERE',  // Insert your private key here
          '{{ networks.moonbeam.rpc_url }}' // Insert your RPC URL here
        )
      },
      network_id: {{ networks.moonbeam.chain_id }} // (hex: {{ networks.moonbeam.hex_chain_id }}),
    },
  }
}
```

If you're using Truffle Dashboard, you'll need to [add the host/port configuration for your dashboard](https://trufflesuite.com/docs/truffle/how-to/use-the-truffle-dashboard/#connecting-to-the-dashboard){target=_blank}.

如果您使用的是Truffle Dashboard，则需要[为您的数据面板添加主机和端口配置](https://trufflesuite.com/docs/truffle/how-to/use-the-truffle-dashboard/#connecting-to-the-dashboard){target=_blank}。

You can deploy your contracts using this command:

您可以使用以下命令部署您的合约：

```
npx truffle migrate --network moonbeam
```

You should see the transaction hashes for the deployment of each contract in your terminal and that a total of three deployments have been made.

您应当能够在您的终端中看到每个合约部署的交易哈希，总共会有三个合约部署。

![Deploy contracts on Moonbeam](/images/tutorials/eth-api/truffle-start-to-end/truffle-11.png)

Again, don't forget to verify the contracts! You will run the `run verify` command and pass in the deployed contracts' names and `moonbeam` as the network:

同样，别忘记验证合约！您可以运行`run verify`命令并输入部署合约的名称以及`moonbeam`网络：

```
npx truffle run verify NftMarketplace DizzyDragons --network moonbeam
```

![Deploy contracts on Moonbeam](/images/tutorials/eth-api/truffle-start-to-end/truffle-12.png)

!!! note 注意事项
    If you're using a Truffle Dashboard, you'll replace `--network moonbeam` with `--network dashboard` for any of the Truffle commands.

如果您使用的是Truffle Dashboard，则需要将任何Truffle命令的`--network moonbeam`替换为`--network dashboard`。

For reference, you can check out how the verified contracts will look on Moonscan for the [NftMarketplace](https://moonbeam.moonscan.io/address/0x37d844beF1E617a3677b086Dd2C8186C1Fd48C34#code){target=_blank} and [DizzyDragons](https://moonbeam.moonscan.io/address/0x815bAe9E539fF8326D82dfEA9FE588633A93FEB5#code){target=_blank} contracts.

作为参考，您可以查看[NftMarketplace](https://moonbeam.moonscan.io/address/0x37d844beF1E617a3677b086Dd2C8186C1Fd48C34#code){target=_blank}和[DizzyDragons](https:/ /moonbeam.moonscan.io/address/0x815bAe9E539fF8326D82dfEA9FE588633A93FEB5#code){target=_blank}合约。

And that's it! You've successfully deployed your contracts to Moonbeam MainNet after thoroughly testing them out on a local Moonbeam development node and the Moonbase Alpha TestNet! Congrats! You've gone through the entire development life cycle using Truffle!

这样就可以了！在本地Moonbeam开发节点和Moonbase Alpha测试网上对合约进行全面测试后，您已成功将合约部署到Moonbeam主网！恭喜！您已经使用Truffle完成了整个开发周期！

--8<-- 'text/disclaimers/educational-tutorial.md'

--8<-- 'text/disclaimers/third-party-content.md'