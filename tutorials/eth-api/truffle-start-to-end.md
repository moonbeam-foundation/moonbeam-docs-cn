---
title: Truffle开发生命周期（从开始到结束）
description: 学习如何使用Truffle开发、测试和部署智能合约以及如何将您的智能合约从本地开发节点部署至Moonbeam主网
---

# Truffle智能合约开发：从本地开发节点至Moonbeam主网

![Banner Image](/images/tutorials/eth-api/truffle-start-to-end/truffle-banner.png)

_2023年01月10日 | 作者：Erin Shaben_

## 概览 {: #introduction }

在本教程中，我们将使用[Truffle](/builders/build/eth-api/dev-env/truffle){target=_blank}完成智能合约开发生命周期。当我们开始开发合约时，我们将使用[Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev){target=_blank}，因此我们可以在构建时快速更迭代码并进行测试。然后我们将继续使用[Moonbase Alpha测试网](/builders/get-started/networks/moonbase){target=_blank}以便我们可以使用不具有任何实际价值的Token在实时网络上测试我们的合约，所以我们不必因此担心需要为任何错误付出代价。最后，一旦我们确定代码正确，我们就会将合约部署到[Moonbeam主网](/builders/get-started/networks/moonbeam){target=_blank}。

出于编写教程的目的，我们将创建一个简单的NFT市场来列出和销售我们称之为Dizzy Dragons的NFT系列。我们将在我们的Truffle项目中创建两个合约：我们将在其中列出Dizzy Dragon NFT的NFT市场合约和我们将用于铸造NFT的Dizzy Dragons合约。然后我们将使用Truffle内置的测试功能来测试我们的合约，并确保它们在部署至每个网络之前依照预期运作。**请注意，我们今天将创建的合约仅用于教育目的，不应在生产环境中使用**。

## 查看先决条件 {: #checking-prerequisites }

要跟随此教程操作，您需要准备以下内容：

- 完成[Docker安装](https://docs.docker.com/get-docker/){target=_blank}

- 一个在Moonbase Alpha测试网上拥有足够DEV Token以及在Moonbeam主网上拥有足够GLMR Token的账户

  --8<-- 'text/faucet/faucet-list-item.md'

- 您拥有的Moonbeam终端和对应API密钥，您可以从支持的[端点提供者](/builders/get-started/endpoints/){target=_blank}处获得

- [生成Moonscan API密钥](https://docs.moonbeam.network/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}，用于验证我们的合约

## 创建一个Truffle项目 {: #create-a-truffle-project }

要快速上手使用Truffle，我们将使用[Moonbeam Truffle Box](https://github.com/PureStake/moonbeam-truffle-box){target=_blank}，其提供一个在Moonbeam上进行开发和部署智能合约的样板设置。

Moonbeam Truffle Box已针对Moonbeam本地开发节点和Moonbase Alpha进行了预配置。我们需要在我们准备将合约部署至主网时使其支持Moonbeam网络，这样就完成了所有准备工作！

它还附带了几个插件：[Moonbeam Truffle插件](https://github.com/purestake/moonbeam-truffle-plugin){target=_blank}和[Truffle验证插件](https://github.com/rkalis/truffle-plugin-verify){target=_blank}。Moonbeam Truffle插件将帮助我们快速启动Moonbeam本地开发节点。Truffle验证插件将使我们能够直接从我们的Truffle项目中验证我们的智能合约。我们只需要配置一个Moonscan API密钥就可以使用Truffle验证插件！

!!! 注意事项
    如果您还没有这样做，您可以跟随教程以[生成Moonscan API密钥](https://docs.moonbeam.network/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}。您的Moonbeam Moonscan API密钥也同样适用于Moonbase Alpha，但是如果您想要将其部署至Moonriver，您将会需要一个[Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank} API密钥。

事不宜迟，让我们开始创建我们的项目：

1. 您可以选择全局安装Truffle或是复制[Moonbeam Truffle Box](https://github.com/PureStake/moonbeam-truffle-box){target=_blank}代码库：

    ```
    npm install -g truffle
    mkdir moonbeam-truffle-box && cd moonbeam-truffle-box
    truffle unbox PureStake/moonbeam-truffle-box
    ```

    要避免全局安装Truffle，您可以运行以下命令并通过使用`npx truffle <command>`访问Truffle命令：

    ```
    git clone https://github.com/PureStake/moonbeam-truffle-box
    cd moonbeam-truffle-box
    ```

2. 安装Moonbeam Truffle Box中的依赖项：

    ```
    npm install
    ```

3. 打开`truffle-config.js`文件，您将会在其中找到针对本地开发节点和Moonbase Alpha的网络配置。您需要在此加入Moonbeam配置和您的Moonscan API密钥：
    
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

现在我们应该已经有了一个Truffle项目，并为其配置好了本教程将会部署合约至的所有网络。

出于本教程目的，我们将会移除`MyToken.sol`合约以及项目的相关测试：

```
rm contracts/MyToken.sol test/test_MyToken.js
```

## 合约设置 {: #contract-setup }

以下部分中的合约为从[OpenZeppelin](https://www.openzeppelin.com/contracts){target=_blank}导入合约。如果您跟随[创建Truffle项目](#create-a-truffle-project)部分中的步骤进行操作，Moonbeam Truffle Box会附带已安装的`openzeppelin/contracts`依赖项。如果您以不同的方式创建项目，则需要自己安装依赖项。您可以使用以下命令执行此操作：

```
npm i @openzeppelin/contracts
```

### 添加简易NFT市场合约 {: #example-nft-marketplace-contract }

由于我们的目标是遍历整个开发生命周期，因此让我们从一个功能最少的简易NFT市场合约开始。我们将专门为我们新的Dizzy Dragons NFT系列创建这个市场。

市场合约将具有两个功能，允许上架和购买Dizzy Dragon NFT：`listNft`和`purchaseNft`。一般而言，在理想情况下NFT市场应具有更多附加功能，例如获取清单、更新或取消清单等功能。但是，**此合约和我们的Dizzy Dragon NFT系列仅用于演示目的**。

我们将我们的合约添加至`contracts`目录：

```
touch contracts/NftMarketplace.sol
```

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

!!! 挑战
    尝试创建一个`getListing`函数，使其能够在给定NFT地址和Token ID的情况下返回清单。

### 添加NFT合约 {: #add-nft-contract }

要测试我们的NFT市场合约，我们需要铸造一个Dizzy Dragon NFT。因此，我们需要创建一个称为`DizzyDragons.sol`的简易NFT合约：

```
touch contracts/DizzyDragons.sol
```

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

### 编译合约 {: #compile-contracts }

现在我们已经成功创建了我们的合约，我们需要继续操作并编译他们，其会自动为每个合约生成artifacts。我们将会在后面编写测试和部署合约时使用这些artifacts。

要编译我们的合约，我们可以先运行以下命令：

```
npx truffle compile
```

![Run Truffle compile](/images/tutorials/eth-api/truffle-start-to-end/truffle-1.png)

artifacts将会被写入`build/contracts`目录。

### 设置部署脚本 {: #setup-deployment-script }

我们需先更新部署迁移脚本，以便能够在其后直接部署我们的合约。我们将会在部署`NftMarketplace`合约后部署`DizzyDragons`合约，因为我们需要将市场合约的地址传递至`DizzyDragons`合约构建函数。

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

## 启动开发节点 {: #start-development-node }

在我们开始编写测试之前，让我们花费一点时间启动开发节点，这样我们才能够在其上运行测试。

由于Moonbeam Truffle box附带Moonbeam Truffle插件，因此启动开发节点变得轻而易举。您只需要安装[Docker](https://docs.docker.com/get-docker/){target=_blank}即可。如果您已准备好使用Docker，您则可以通过运行以下命令获取最新的Moonbeam Docker映像：

```
npx truffle run moonbeam install
```

接着您可以启动节点：

```
npx truffle run moonbeam start
```

当您的节点被成功启动后，您将能够在您的终端看见以下输出：

![Install and spin up a Moonbeam development node](/images/tutorials/eth-api/truffle-start-to-end/truffle-2.png)

您可以在Truffle相关文档中[使用Moonbeam Truffle插件运行节点](/builders/build/eth-api/dev-env/truffle/#using-the-moonbeam-truffle-plugin-to-run-a-node){target=_blank}部分查看所有可用命令。

您也可以不使用Moonbeam Truffle插件设置开发节点，请查看[启动Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev/){target=_blank}教程了解如何操作。

## 编写测试 {: #write-tests }

在将我们的代码发送出去之前，我们要测试我们的智能合约以确保其按预期运行。Truffle提供了使用JavaScript、TypeScript或Solidity编写测试的选项。它还为[Mocha](https://mochajs.org/){target=_blank}和[Chai](https://chaijs.com/){target=_blank}提供开箱即用的支持。

以此教程来说，我们将会用JavaScript编写我们的测试以利用Mocha和Chai的内置支持。

如果您熟悉Mocha，您可能习惯于使用`describe`函数对测试进行分组，并使用`it`函数编写每个单独的测试。使用Truffle编写测试时，您需要将`describe`替换为`contract`。`contract`函数与`describe`完全一样，但它包含额外的功能，包括在每个测试文件的开头重新部署您的迁移以提供一个干净的环境。同时，对于单个测试您仍然会像通常那样使用`it`函数。

Truffle还通过在每个测试文件中包含一个配置好正确网络的`web3`实例来简化测试，因此您无需自行配置任何东西，只需运行`npx truffle test --network <network-name>`即可。

### 测试设置 {: #test-setup }

要开始我们的测试，我们可以添加我们的测试文件，它将以`test_`开头以表达其为一个测试文件：

```
touch test/test_NftMarketplace.js
```

现在我们已经能够设置我们的测试文件，让我们花几分钟时间了解我们接下来的步骤：

- 使用Truffle的`artifacts.require()`，其提供合约的抽象实例，来导入`NftMarketplace`和`DizzyDragons`合约的artifacts
- 创建一个`contract`函数来对我们的测试进行分组。`contract`函数还将为我们提供我们在`truffle-config.js`文件中设置的帐户。当我们使用Moonbeam Truffle box时，我们的开发帐户已经为我们设置完毕。当我们继续在Moonbase Alpha和Moonbeam上部署和测试我们的合约时，则需要自行配置我们的账户
- 对于每个测试，我们都需要部署我们的合约并创建一个NFT。为此，我们可以利用[Mocha提供的`beforeEach` hook](https://mochajs.org/#hooks){target=_blank}
- 由于我们将为每个测试创建一个NFT，因此我们需要一个`tokenUri`。我们在范例中使用的`tokenUri`将用于Daizy，这是我们的第一个Dizzy Dragon NFT。`tokenUri`将设置为`"https://gateway.pinata.cloud/ipfs/QmTCib5LvSrb7sshLhLvzmV7wdSdmSt3yjB4dqQaA58Td9"`，这是专门为本教程创建的，仅用于教育目的

您可以在您的浏览器中输入`tokenUri`以查看Daizy的元数据，并且[Daizy的图片](https://gateway.pinata.cloud/ipfs/QmTzmrRb6TmEsP96dCoBv2kjdiCiojagBU7YJ95RaAuuF4?_gl=1*m58ja2*_ga*ODc3ODA3MjcwLjE2NzQ2NjQ2ODY.*_ga_5RMPXG14TE*MTY3NDY2NDY4Ni4xLjEuMTY3NDY2NDcwMi40NC4wLjA.){target=_blank}也已放上去，因此您可以轻松看到Daizy的样子！

![Daizy NFT metadata and image](/images/tutorials/eth-api/truffle-start-to-end/truffle-3.png)

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

!!! 注意事项
    您无需导入Mocha或是Web3，因为两个包皆包含在Truffle之中！

现在我们已经做好编写测试的准备！

### 测试铸造NFT {: #test-minting-nfts }

在我们的首个测试，确保我们正在按预期铸造新的Dizzy Dragon NFT。我们将会使用来自交易的事件日志以确保`DizzyDragons`合约中的`NftMinted`事件已发出。事件日志将会返回传递至`NftMinted`事件的参数，其将会是Token ID：

```sol
event NftMinted(uint256);
```

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

我们需要使用`toNumber()`将BN转换为数字，然后我们还可以测试NFT的Token ID是否为`1`。由于我们在每次测试前都部署了新的`DizzyDragons`合约，因此它应该始终是第一个铸造的NFT。

代替`// TODO: Add tests here`注释，您可以添加以下测试：

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

假设您[Moonbeam开发节点已设置完毕并顺利运行](#start-development-node)，您可以使用以下命令运行测试：

```
npx truffle test --network dev
```

![Run first test](/images/tutorials/eth-api/truffle-start-to-end/truffle-4.png)

### 测试上架NFT {: #test-listing-nfts }

对于我们的下一个测试，我们将测试我们是否可以使用`NftMarketplace`合约的`listNft`功能成功上架我们新铸造的NFT。因此，我们将再次使用我们的事件日志来测试是否已发出`NftListed`事件以及正确的状态变量，例如卖家和Token ID。事件日志将返回传递给`NftMinted`事件的参数，这将是卖家的地址、NFT的地址、Token ID和标价：

```sol
event NftListed(
    address indexed seller,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
);
```

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

同样，您可以运行测试以确认测试通过预期。

![Run first two tests](/images/tutorials/eth-api/truffle-start-to-end/truffle-5.png)

### 测试购买NFT {: #test-purchasing-nfts }

最后，让我们测试是否可以使用`NftMarketplace`合约的`purchaseNft`功能购买我们市场上的NFT。与我们之前的测试类似，我们将使用事件日志来测试是否已发出`NftPurchased`事件以及正确的状态变量，例如买家和Token ID。事件日志将返回传递给`NftPurchased`事件的参数，即买家地址、NFT地址、Token ID和购买价格：

```sol
event NftListed(
    address indexed buyer,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
);
```

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

测试内容就到此为止！如要运行他们，请运行以下命令：

```
npx truffle test --network dev
```

![Run all tests](/images/tutorials/eth-api/truffle-start-to-end/truffle-6.png)

使用Mocha，您可以灵活地测试各种边界情况，而不必像我们在示例中那样使用`assert.equal`。由于包含对Chai断言库的支持，您还可以使用[Chai的`assert` API](https://www.chaijs.com/guide/styles/#assert){target=_blank}或他们的[`expect` ](https://www.chaijs.com/guide/styles/#expect){target=_blank}和[`should`](https://www.chaijs.com/guide/styles/#should){target =_blank} API。例如，您还可以使用[Chai的`assert.fail`函数](https://www.chaijs.com/api/assert/#method_fail){target=_blank}以断言失败。

!!! 挑战
    尝试为尚未授权`NftMarketplace`合约传输的NFT添加一个使用`tokenUri`的测试。您应该断言该调用将失败。

在Moonbeam开发节点上完成测试后，请确保停止并删除节点！你可以通过运行下列命令执行：

```
npx truffle run moonbeam stop && \
npx truffle run moonbeam remove
```

![Stop the development node](/images/tutorials/eth-api/truffle-start-to-end/truffle-7.png)

## 部署至Moonbase Alpha测试网 {: #deploying-to-moonbase-alpha }

现在我们已经能够使用我们的Moonbeam开发节点快速开发我们的合约并对我们的代码充满信心，我们可以继续在Moonbase Alpha测试网上测试它。

首先，您需要更新您的`truffle-config.js`文件并添加您在Moonbase Alpha上的帐户私钥。 此处，`privateKeyMoonbase`变量已经存在，您只需将其设置为您的私钥即可。**这仅用于演示目的，切勿将您的私钥存储在JavaScript文件中**。

设置帐户后，您可以在Moonbase Alpha上运行测试以确保它们在实际网络上按预期运作：

```
npx truffle test --network moonbase
```

![Run all tests on Moonbase Alpha](/images/tutorials/eth-api/truffle-start-to-end/truffle-8.png)

!!! 注意事项
    为避免公共终端达到速率限制，您可以从支持的[端点提供者](/builders/get-started/endpoints/){target=_blank}中获取您自己的端点。

由于我们已经更新了我们的迁移脚本，我们可以使用此命令部署我们的合约：

```
npx truffle migrate --network moonbase
```

您应该在终端中看到每个合约部署的交易哈希，总共已完成了三个部署。

![Deploy contracts on Moonbase Alpha](/images/tutorials/eth-api/truffle-start-to-end/truffle-9.png)

部署合约后，我们可以开始构建一个带有与这些合约交互的前端的dApp，但这超出了本教程的范围。

部署合约后，不要忘记验证它们！您将运行`run verify`命令并输入已部署合约的名称和它们已部署到的网络：

```
npx truffle run verify NftMarketplace DizzyDragons --network moonbase
```

![Verify contracts on Moonbase Alpha](/images/tutorials/eth-api/truffle-start-to-end/truffle-10.png)

作为参考，您可以在Moonscan上查看已完成验证的[NftMarketplace](https://moonbase.moonscan.io/address/0x14138a5c7c6F0f33cB02aa63D45BDE2Cd0E17A90#code){target=_blank}和[DizzyDragons](https://moonbase.moonscan.io/address/0x747CB7cCD05BCb4A94e284af9Cc35189C3f9c540#code){target=_blank}合约。

您可以随意在测试网上玩耍并与您的合约互动！由于DEV Token没有真正的价值，现在将会是解决任何问题的好时机，然后再将我们的合约部署到Token有实际价值的Moonbeam主网上！

## 在Moonbeam主网上完成生产部署 {: #deploying-to-production }

现在我们已经在Moonbase Alpha上测试了我们的合约，接下来让我们在Moonbeam上部署我们的合约吧！

同样，您需要更新您的`truffle-config.js`并添加您在Moonbeam上的帐户的私钥。如果您对添加私钥的安全方式感兴趣，可以查看[Truffle Dashboard](https://trufflesuite.com/blog/introducing-truffle-dashboard/){target=_blank}，它允许您无需任何配置即可连接到您的MetaMask钱包。有关更多信息，请参阅[关于使用Truffle Dashboard的Truffle文档](https://trufflesuite.com/docs/truffle/how-to/use-the-truffle-dashboard/){target=_blank}。但切记，**永远不要将您的私钥存储在JavaScript文件中**。

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

如果您使用的是Truffle Dashboard，则需要[为您的数据面板添加主机和端口配置](https://trufflesuite.com/docs/truffle/how-to/use-the-truffle-dashboard/#connecting-to-the-dashboard){target=_blank}。

您可以使用以下命令部署您的合约：

```
npx truffle migrate --network moonbeam
```

您应当能够在您的终端中看到每个合约部署的交易哈希，总共会有三个合约部署。

![Deploy contracts on Moonbeam](/images/tutorials/eth-api/truffle-start-to-end/truffle-11.png)

同样，别忘记验证合约！您可以运行`run verify`命令并输入部署合约的名称以及`moonbeam`作为网络：

```
npx truffle run verify NftMarketplace DizzyDragons --network moonbeam
```

![Deploy contracts on Moonbeam](/images/tutorials/eth-api/truffle-start-to-end/truffle-12.png)

!!! 注意事项
    如果您使用的是Truffle Dashboard，则需要将任何Truffle命令的`--network moonbeam`替换为`--network dashboard`。

作为参考，您可以在Moonscan上查看已完成验证的[NftMarketplace](https://moonbeam.moonscan.io/address/0x37d844beF1E617a3677b086Dd2C8186C1Fd48C34#code){target=_blank}和[DizzyDragons](https://moonbeam.moonscan.io/address/0x815bAe9E539fF8326D82dfEA9FE588633A93FEB5#code){target=_blank}合约。

这样就可以了！在本地Moonbeam开发节点和Moonbase Alpha测试网上对合约进行全面测试后，您已成功将合约部署到Moonbeam主网！恭喜！您已经使用Truffle完成了整个开发生命周期！

--8<-- 'text/disclaimers/educational-tutorial.md'

--8<-- 'text/disclaimers/third-party-content.md'