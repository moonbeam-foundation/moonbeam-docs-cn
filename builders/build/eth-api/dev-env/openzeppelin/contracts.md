---
title: 部署OpenZeppelin智能合约
description: 了解如何使用 OpenZeppelin Contracts Wizard创建常见智能合约，例如ERC-20和 ERC-721代币，并将它们部署在Moonbeam上。
---

# OpenZeppelin合约&库

## 概览 {: #introduction }

[OpenZeppelin](https://openzeppelin.com/){target=_blank}合约和库已成为行业标准，其开源代码模板经历了太坊及其他区块链的实战考验，帮助开发者最大限度降低风险。OpenZeppelin代码包括使用度最高的ERC标准及拓展部署，已被社区在各类指南以及操作教程中大量使用。

由于Moonbeam是完全兼容以太坊的区块链，OpenZeppelin所有合约和库都无需经过任何修改就能在Moonbeam上部署。

本教程分为两部分，第一部分介绍使用OpenZeppelin代码创建智能合约的线上工具OpenZeppelin Contracts Wizard；第二部分则为Moonbeam上的合约部署提供步骤指引。

## OpenZeppelin Contract Wizard {: #openzeppelin-contract-wizard }

OpenZeppelin开发了一种基于网络的线上智能合约交互式工具，它可能是使用OpenZeppelin代码编写智能合约最简单快捷的方式。这一工具称为[Contracts Wizard](https://docs.openzeppelin.com/contracts/5.x/wizard){target=_blank}。

目前Contracts Wizard支持以下ERC标准：

 - [**ERC-20**](https://ethereum.org/zh/developers/docs/standards/tokens/erc-20/){target=_blank} —— 遵守[EIP-20](https://eips.ethereum.org/EIPS/eip-20){target=_blank}的同质化代币标准。同质化指的是所有代币均相同，并可互换，也就是说它们具有相同的价值。同质化代币的一个典型例子就是法币，面值相等的纸币其价值相等
 - [**ERC-721**](https://ethereum.org/zh/developers/docs/standards/tokens/erc-721/){target=_blank} —— 遵守[EIP-721](https://eips.ethereum.org/EIPS/eip-721){target=_blank}的非同质化代币合约。非同质化指的是每一枚代币都不一样，因此独一无二。ERC-721代币可以用于代表某一特定物品的所有权，例如游戏、房地产中的收藏品等
 - [**ERC-1155**](https://docs.openzeppelin.com/contracts/5.x/erc1155){target=_blank} —— 遵守[EIP-1155](https://eips.ethereum.org/EIPS/eip-1155){target=_blank}标准，也被称为多代币合约，因为同一个智能合约可以同时代表同质化和非同质化代币

Contracts Wizard由以下环节组成：

 1. **代币标准选择** —— 显示Contracts Wizard所支持的所有标准
 2. **设置** —— 为每一种代币标准提供基准线设置，例如代币名称、代码、预铸造（合约部署时的代币供应量）以及URI（非同质化代币）
 3. **功能** —— 显示每一种代币标准的所有功能列表。可以再通过以下链接获取各功能的更多信息：
     - [ERC-20](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20){target=_blank}
     - [ERC-721](https://docs.openzeppelin.com/contracts/5.x/api/token/erc721){target=_blank}
     - [ERC-1155](https://docs.openzeppelin.com/contracts/5.x/api/token/erc1155){target=_blank}
 4. **访问控制** —— 每种代币标准所有可用的[访问控制机制](https://docs.openzeppelin.com/contracts/5.x/access-control){target=_blank}列表
 5. **交互代码显示** —— 显示用户设置下的智能合约代码

![OpenZeppelin Contracts Wizard](/images/builders/build/eth-api/dev-env/openzeppelin/contracts/oz-wizard-1.webp)

完成设置和功能准备后，只需要复制粘贴代码到合约文件即可。

## 在Moonbeam上部署OpenZeppelin合约  {: #deploying-openzeppelin-contracts-on-moonbeam }

本小节将介绍在Moonbeam上部署OpenZeppelin合约的步骤，适用于以下合约：

 - ERC-20（同质化代币）
 - ERC-721（非同质化代币）
 - ERC-1155（多代币标准）

所有合约代码均通过OpenZeppelin的[Contract Wizard](https://docs.openzeppelin.com/contracts/5.x/wizard){target=_blank}获取。

### 检查先决条件  {: #checking-prerequisites }

请确保安装[MetaMask](https://metamask.io/){target=_blank}，并已连接至Moonbase Alpha测试网。如果您想在Moonbeam或Moonriver网络部署，请连接到相应的网络。我们将在**Injected Web3**环境下使用[Remix IDE](https://remix.ethereum.org/){target=_blank}进行合约部署。相关指引请点击以下链接：

 - [使用MetaMask与Moonbeam进行交互](/builders/integrations/wallets/metamask/){target=_blank}
 - [使用Remix与Moonbeam进行交互](/builders/build/eth-api/dev-env/remix/){target=_blank}

### 部署ERC-20代币 {: #deploying-an-erc20-token }

在本示例中，我们将在Moonbase Alpha上部署一枚ERC20代币，最终使用的代码结合了OpenZeppelin中的不同合约：

 - **`ERC20.sol`** —— 通过基础界面的可选功能进行ERC20代币部署。包括带有`mint`函数的供应机制，但仅能从主合约中调用
 - **`Ownable.sol`** —— 拓展组件，能够限制对某种特定函数的调用

可铸造的ERC-20 OpenZeppelin代币合约有一个`mint`函数，合约持有者仅可以调用这一函数。默认设置下，合约所有者即为合约的部署者地址。此外，还会有预先铸造的`1000`枚代币被发送到在`constructor`函数中设置的合约部署者地址。

首先，我们需要进入[Remix](https://remix.ethereum.org/) ，并进行以下操作：

 1. 点击**Create New File**（新建文档）图标，并设置文档名称。在本示例中设置为`ERC20.sol`
 2. 确保文档已创建成功。点击文档，利用文本编辑器打开文档
 3. 使用文档编辑器编写智能合约。在本示例中，我们使用了以下代码：

```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

我们从[Contract Wizard](/integrations/openzeppelin/contracts/#openzeppelin-contract-wizard)中抽取了这个ERC20代币智能合约，并设置预先铸造1000枚代币，激活`Mintable`功能。

![Getting Started with Remix](/images/builders/build/eth-api/dev-env/openzeppelin/contracts/oz-contracts-1.webp)

写好智能合约后，就可以根据以下步骤进行编译：

 1. 进入**Solidity Compiler**（Solidity 编译器）
 2. 点击“compile（编译）”按钮
 3. 您还可以尝试使用**Auto compile**（自动编译）功能

![Compile ERC-20 Contract with Remix](/images/builders/build/eth-api/dev-env/openzeppelin/contracts/oz-contracts-2.webp)

合约编译完成后，就可以通过以下步骤进行部署：

 1. 进入**Deploy & Run Transactions**（部署与运行交易）标签
 2. 使用MetaMask的注入提供者将环境改为**Injected Web3**。此后，合约将被部署到MetaMask所连接到的网络中。MetaMask可能会出现弹窗，显示Remix正在尝试连接到您的钱包
 3. 选择需要部署的合约。在本示例中为`ERC20.sol`文档中的`MyToken`合约
 4. 一切就绪后，点击**Deploy**（部署）按钮。在MetaMask中检查交易信息并进行确认
 5. 几秒钟后，交易便可确认完成。然后可以在**Deployed Contracts**（已部署合约）中看到您的合约

![Deploy ERC-20 Contract with Remix](/images/builders/build/eth-api/dev-env/openzeppelin/contracts/oz-contracts-3.webp)

至此，我们已经使用OpenZeppelin合约和库完成了ERC-20代币合约的部署。接下来，我们就可以通过Remix与代币合约进行交互，或者将合约添加到MetaMask。

### 部署ERC-721代币 {: #deploying-an-erc721-token }

在本示例中，我们将向Moonbase Alpha部署一枚ERC-721代币。最终我们所使用的代码结合了从OpenZeppelin中抽取的不同合约：

 - **`ERC721.sol`** —— 通过基础界面的可选功能进行ERC-721代币部署。包括带有`_mint`函数的供应机制，但仅能从主合约中调用
 - **`ERC721Burnable.sol`** —— 拓展组件，使得代币所有者（或授权地址）可以对代币进行销毁
 - **`ERC721Enumerable.sol`** —— 拓展组件，可实现代币的链上枚举
 - **`Ownable.sol`** —— 拓展组件，能够限制对某种特定函数的调用

可铸造的ERC-721 OpenZeppelin代币合约有一个`mint`函数，只有合约持有者可以调用这一函数。默认设置下，合约所有者即为合约的部署者地址。

和[ERC-20合约](/builders/build/eth-api/dev-env/openzeppelin/contracts/#deploying-an-erc20-token){target=_blank}的部署一样，第一步也是进入[Remix](https://remix.ethereum.org/){target=_blank}并创建新文档。在本示例中，文档名称将被设为`ERC721.sol`。

下一步需要编写智能合约并进行编译。在本示例中，我们使用了以下代码：

```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC721, ERC721Enumerable, ERC721Burnable, Ownable {
    constructor() ERC721("MyToken", "MTK") {}

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "Test";
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

我们从[Contract Wizard](/builders/build/eth-api/dev-env/openzeppelin/contracts/#openzeppelin-contract-wizard)中抽取了这个ERC721代币智能合约，将`Base URI`设为`Test`，并激活`Mintable`、`Burnable`以及`Enumerable`功能。

合约编译完成后下一步，您需要：

 1. 进入**Deploy & Run Transactions**（部署与运行交易）标签
 2. 使用MetaMask的注入提供者将环境改为**Injected Web3**。此后，合约将被部署到MetaMask所连接到的网络中。MetaMask可能会出现弹窗，显示Remix正在尝试连接到您的钱包
 3. 选择需要部署的合约。在本示例中为`ERC721.sol`文档中的`MyToken`合约
 4. 一切就绪后，点击**Deploy**按钮。在MetaMask中检查交易信息并进行确认
 5. 几秒钟后，交易便可确认完成。然后可以在**Deployed Contracts**中看到您的合约

![Deploy ERC-721 Contract with Remix](/images/builders/build/eth-api/dev-env/openzeppelin/contracts/oz-contracts-4.webp)

至此，我们已经使用OpenZeppelin合约和库完成了ERC-721代币合约的部署。接下来，我们就可以通过Remix与代币合约进行交互，或者将合约添加到MetaMask。

### 部署ERC-1155代币 {: #deploying-an-erc1155-token }

在本示例中，我们将向Moonbase Alpha部署一枚ERC-1155代币。最终我们所使用的代码结合了从OpenZeppelin中抽取的不同合约：

 - **`ERC-1155`** —— 通过基础界面的可选功能进行ERC-1155代币部署。包括带有`_mint`函数的供应机制，但仅能从主合约中调用
 - **`Pausable.sol`** —— 拓展组件，能够暂停代币转移、铸造及销毁
 - **`Ownable.sol`** —— 拓展组件，能够限制对某些特定函数的调用

OpenZeppelin的ERC-1155代币合约提供只能在`constructor`函数中调用的`_mint`函数。因此在本示例中，我们将创建1000枚ID为`0`的代币以及一枚ID为`1`的独特代币。

第一步是进入[Remix](https://remix.ethereum.org/){target=_blank}并创建新文档。在本示例中，文档命名为`ERC1155.sol`。

和[ERC-20](/builders/build/eth-api/dev-env/openzeppelin/contracts/#deploying-an-erc20-token)代币部署一样，下一步需要编写智能合约并进行编译。在本示例中，我们使用了以下代码：

```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract MyToken is ERC1155, Ownable, Pausable {
    constructor() ERC1155("Test") {
        _mint(msg.sender, 0, 1000 * 10 ** 18, "");
        _mint(msg.sender, 1, 1, "");
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
```

我们从[Contract Wizard](/builders/build/eth-api/dev-env/openzeppelin/contracts/#openzeppelin-contract-wizard){target=_blank}中抽取了这个ERC-1155代币智能合约，设置为无`Base URI`，并激活`Pausable`功能。我们对constructor函数进行了修改，可同时铸造同质化和非同质化代币。

合约编译完成后下一步，您需要：

 1. 进入**Deploy & Run Transactions**（部署与运行交易）标签
 2. 使用MetaMask的注入提供者将环境改为**Injected Web3**。此后，合约将被部署到MetaMask所连接到的网络中。MetaMask可能会出现弹窗，显示Remix正在尝试连接到您的钱包
 3. 选择需要部署的合约。在本示例中为`ERC1155.sol`文档中的`MyToken`合约
 4. 一切就绪后，点击**Deploy**（部署）按钮。在MetaMask中检查交易信息并进行确认
 5. 几秒钟后，交易便可确认完成。然后可以在**Deployed Contracts**（已部署合约）中看到您的合约

![Deploy ERC-1155 Contract with Remix](/images/builders/build/eth-api/dev-env/openzeppelin/contracts/oz-contracts-5.webp)

至此，我们已经使用OpenZeppelin合约和库完成了ERC-1155代币合约的部署。接下来，我们就可以通过Remix与代币合约进行交互。

--8<-- 'text/_disclaimers/third-party-content.md'
