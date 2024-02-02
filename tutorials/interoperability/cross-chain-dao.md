---
title: 使用OpenZeppelin的Governor构建跨链DAO
description: 在本教程中，您将了解互连合约以及如何在Moonbeam上使用OpenZeppelin的Governor合约创建跨链DAO。
---

# 使用OpenZeppelin的Governor合约构建跨链DAO

_作者：Jeremy Boetticher_

## 概览 {: #introduction }

Moonbeam致力于支持互操作性和跨链逻辑。其[互连合约（Connected Contracts）](https://moonbeam.network/builders/connected-contracts/){target=\_blank}需要更新之前理解的智能合约概念，以适应跨链世界。虽然一些跨链原语（例如跨链Token）已经存在多年，但是其他的跨链原语（例如跨链swap、AMM和本教程中使用的DAO）现在才开始使用。

在本教程中，我们将演示为跨链DAO编写智能合约。本示例中的智能合约将基于OpenZeppelin的治理智能合约，展示从单链到跨链的演变，并突出了将DApp概念从单链到多链转换时所面临的一些不兼容性。本示例中使用的跨链协议为[LayerZero](/builders/interoperability/protocols/layerzero){target=\_blank}，但是我们鼓励您将其概念调整为您认为合适的任何其他协议，因为跨链概念通常在Moonbeam上的协议之间会有重叠。

本教程的目的不是对跨链DAO的最终定义，而是提供一个后续能够用于编写复杂跨链DApp的示例。本教程将聚焦于架构，尤其是跨链智能合约逻辑，而非部署和测试。**以下智能合约尚未测试，不建议用于生产环境**。也就是说，您可以从这些设计中获取灵感来编写自己的跨链DAO。[此GitHub代码库](https://github.com/jboetticher/cross-chain-dao){target=\_blank}中提供了DAO的完整代码和演示，以及相关操作说明。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 想法和计划 {: #intuition-and-planning }

DAO是去中心化自治组织，想要让智能合约成为DAO，其必须满足以下条件：

- **去中心化** — 控制权是分散化的，在多个参与者之间分布
- **有自治能力** — 执行必须在不依赖于个人、治理或团队的情况下发生
- **有组织性** — 必须设定一种方式来提出并采取行动：代码即法律

最好的单链DAO之一是[Compound Finance的DAO](https://compound.finance/governance){target=\_blank}。原因在于：智能合约允许用户以交易参数的形式提出要在链上采取的行动，这些行动随后作为origin和智能合约一起执行，这体现了**组织性**；提案的执行是无需许可的且无需依赖任何人或团队，这体现了**自治能力**；提案通过Compound Finance token的持有者投票决定，这体现了**去中心化**。

接下来让我们来深入了解像Compound Finance DAO这样的DAO中的提案流程：

![Typical DAO](/images/tutorials/interoperability/cross-chain-dao/cross-chain-dao-1.webp)

1. **提案（Proposal）** — 用户提议DAO执行单个或多个交易
2. **投票（Voting）** — 等待投票延迟期后，投票期将正式开启，允许用户使用其投票权重进行投票。投票权重通常由在提案开始和投票延迟期尾之间的某个时间的Token余额快照决定
3. **时间锁（Timelock）** — 一个可选的时间段，允许用户在提案执行前退出生态系统（出售其Token）
4. **执行（Execution）** — 如果投票成功，任何用户均可以无需信任地执行它

那么什么是跨链DAO？在跨链DAO中，你通常会采取的行动也应该是可以跨链的：提案、投票、执行、取消等。因为跨链会复制大量信息，因此需要用到更复杂的架构。

构建跨链DApp的方法有很多种。您可以创建一个更加分布式的系统，系统中的数据和逻辑分布到多条链，以扩大其使用率。另一方面，您可以使用中心辐射（hub-and-spoke）模式，其中主要逻辑和数据存储在单链上，跨链消息将与之交互。

![Cross Chain DAO](/images/tutorials/interoperability/cross-chain-dao/cross-chain-dao-2.webp)

我们将对以下步骤展开分析：

1. **提案** — 用户提议DAO在**hub（中心）**链上执行单个或多个交易。跨链消息将发送至**spoke（辐条）**链上的卫星智能合约，以告知即将发生的投票参数
2. **投票** — 等待投票延迟期后，投票期将正式开启，允许用户在每条链上使用其投票权重进行投票。投票权重由在提案开始和结束之间某个特定时间点的每条链上的跨链Token数量决定
3. **收集（Collection）** — 投票期后，**hub**链上的跨链DAO发送请求至**spoke**链以将每条链的投票结果发送至**hub**链
4. **时间锁** — 一个可选的时间段，允许用户在提案执行前退出生态系统（出售其Token）
5. **执行** — 如果投票成功，任何用户均可在**hub**链上无需信任地执行它

!!! 注意事项
    注意此处新增的收集阶段。这是跨链方面改变逻辑最多的地方。本质上，必须在投票期结束后收集每条spoke链上的选票并提交给hub链。

此处显示的流程，允许任何持有DAO Token的人参与跨链投票。为了保存只读信息，我们将把其存储在一条链上。比较少见的一次性操作（例如提案、取消等）最好作为中心辐射（hub-and-spoke）模式来完成。关于投票逻辑的信息，由于用户将在多条链上进行投票，因此投票权重和投票总和将存储在每条spoke链上。由于跨链手续费相对偏贵，仅在投票结束后才将他们发送到hub链。

![Smart contracts overview](/images/tutorials/interoperability/cross-chain-dao/cross-chain-dao-3.webp)  

当然，这只是实现跨链DAO的一种方法，我们鼓励您考虑其他更好的方法。 在下一部分中，我们来看一个实现。

## 查看先决条件 {: #checking-prerequisites }

在我们开始编写整个项目之前，您可以在[跨链DAO GitHub代码库](https://github.com/jboetticher/cross-chain-dao){target=\_blank}找到已完成的内容。它使用Hardhat，因此先决条件将有助于了解此代码库的工作原理。 本教程将不包含有关如何使用Hardhat的信息，仅关注智能合约部分。如果要遵循本教程操作，您需要准备以下内容：

- 一个新的Hardhat项目并[了解如何使用Hardhat](/builders/build/eth-api/dev-env/hardhat/){target=\_blank}
- [安装OpenZeppelin智能合约](https://github.com/OpenZeppelin/openzeppelin-contracts){target=\_blank}，将其作为依赖项
- [安装LayerZero智能合约](https://github.com/LayerZero-Labs/solidity-examples){target=\_blank}，将其作为依赖项

要安装两个依赖项，您可以运行以下命令：

```bash
npm install @openzeppelin/contracts @layerzerolabs/solidity-examples
```

## 编写跨链DAO Token合约 {: #cross-chain-dao-token-contract }

首先，我们从基础部分开始，梳理一下用户将如何计算其投票权。

在Compound Finance的DAO中，用户需要用到COMP Token投票，这实现了DAO的去中心化。OpenZeppelin的`Governor`智能合约也有此功能，将Token投票的功能抽象化为[`IVotes`接口](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/utils/IVotes.sol){target=\_blank}。

`IVotes`接口需要很多不同的函数来表示投票方案中的不同权重。幸运的是，OpenZeppelin提供了`IVotes`的ERC-20实现，称为[ERC20Votes](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Votes.sol){target=\_blank}。

如上述[想法和计划](#intuition-and-planning){target=\_blank}部分所述，我们计划让用户在每条链上进行投票，并且只在收集阶段将投票数据发送到hub链。这意味着投票权重必须存储在每条链上。这很简单，因为我们只要确保将`ERC20Votes`合约部署在每条链上，也就是说，使DAO Token成为跨链Token。

之前我们提到将LayerZero作本教程的跨链协议。选择LayerZero的原因在于其[OFT合约](https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/token/oft/v1/OFT.sol){target=\_blank}使ERC-20 Token跨链变得极其简单。但是，这并不代表您必须使用LayerZero，其他的跨链协议都有自己的方法和创建跨链资产的能力。

我们将创建一个名为`OFTVotes.sol`的新文件：

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@layerzerolabs/solidity-examples/contracts/token/oft/IOFT.sol";
import "@layerzerolabs/solidity-examples/contracts/token/oft/OFTCore.sol";

abstract contract OFTVotes is OFTCore, ERC20Votes, IOFT {
    constructor(string memory _name, string memory _symbol, address _lzEndpoint) ERC20(_name, _symbol) OFTCore(_lzEndpoint) {}
}
```

如您所见，`OFTVotes`是继承自`OFTCore`、`ERC20Votes`和`IOFT`智能合约的抽象智能合约。如果合理实现，这将赋予其跨链ERC-20属性以及投票属性。接下来，将以下函数覆盖添加至`OFTVotes`智能合约中：

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(OFTCore, IERC165) returns (bool) {
    return interfaceId == type(IOFT).interfaceId || interfaceId == type(IERC20).interfaceId || super.supportsInterface(interfaceId);
}

function token() public view virtual override returns (address) {
    return address(this);
}

function circulatingSupply() public view virtual override returns (uint) {
    return totalSupply();
}

function _debitFrom(address _from, uint16, bytes memory, uint _amount) internal virtual override returns(uint) {
    address spender = _msgSender();
    if (_from != spender) _spendAllowance(_from, spender, _amount);
    _burn(_from, _amount);
    return _amount;
}

function _creditTo(uint16, address _toAddress, uint _amount) internal virtual override returns(uint) {
    _mint(_toAddress, _amount);
    return _amount;
}
```

前几个函数只是确保与它们继承的智能合约的兼容性。

`_debitFrom`函数包含销毁Token的逻辑，以便跨链桥可以运作。同样，`_creditTo`函数包含铸造Token的逻辑。`OFTCore`智能合约会用到这两个函数。想要知道为何跨链桥包装时会涉及铸造和销毁，因为OFT是[传送资产](/builders/interoperability/xcm/overview/#xcm-transport-protocols){target=\_blank}而非包装资产（与XCM资产协议类似）。

`OFTVotes`合约是抽象合约，所以让我们创建一个我们用于部署的最终版本的智能合约。在 `contracts`文件夹中，创建一个名为`CrossChainDAOToken.sol`的新智能合约并添加以下内容：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./OFTVotes.sol";

contract CrossChainDAOToken is OFTVotes {
    constructor(uint256 _initialSupply, address _lzEndpoint)
        OFTVotes("Cross Chain DAO Token", "CCDT", _lzEndpoint)
        ERC20Permit("Cross Chain DAO Token")
    {
        _mint(msg.sender, _initialSupply);
    }

    // The functions below are overrides required by Solidity

    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Votes) {
        super._burn(account, amount);
    }
}
```

这个智能合约的作用是在构造函数中添加元数据并为用户创建初始Token。所有被覆盖的函数只是因为Solidity规则才存在，它们只是默认为父合约的实现。我们没有将元数据添加到`OFTVotes`的唯一原因是该智能合约理论上可以在其他地方重复使用。

`CrossChainDAOToken`智能合约现在可以部署到spoke链和hub链上了。您可以在[示例代码库](https://github.com/jboetticher/cross-chain-dao/blob/main/contracts/CrossChainDAOToken.sol){target=\_blank}查看完整版本。


## 编写跨链DAO合约 {: #cross-chain-dao-contract }

下面是本教程的核心部分：跨链DAO。需要明确的是，并非*所有*的跨链逻辑都将存储在跨链DAO智能合约中。相反，我们会将hub逻辑单独放到一个合约中，并将[spoke链逻辑放到另一个合约](#dao-satellite-contract){target=\_blank}中。根据中心辐射（hub-and-spoke）模式，这样做是有道理的：一些逻辑存储在单条hub链上，而spoke链通过更简单的satellite合约与之交互。在spoke链上的逻辑不需要在hub链上。

我们可以从创建跨链DAO的基础开始，然后对其进行编辑使其成为跨链DAO。为此，请执行以下步骤：

1. 使用OpenZeppelin的contract wizard创建基础合约
2. 为跨链消息添加支持（在本示例中将通过LayerZero实现）
3. 从spoke链统计投票
4. 在投票和执行阶段之间添加新的收集阶段
    - 请求从spoke链收集的投票
    - 接收从spoke链收集的投票
5. 添加功能以在有新提案供投票时通知spoke链
6. （可选）添加接收跨链消息以执行非投票操作（如提议或执行）的能力

### 使用OpenZeppelin的Contract Wizard开始操作 {: #starting-with-the-openzeppelin-contract-wizard }

在单链DAO的基础上可以考虑编写跨链DAO，但是存在很多不同的实现。我们将使用[OpenZeppelin](https://www.openzeppelin.com/contracts){target=\_blank}的治理智能合约。这主要有两个原因，一方面是OpenZeppelin已经拥有一个普遍使用的智能合约代码库，另一方面是他们基于Compound Finance的DAO，我们已经在[上述部分](#intuition-and-planning)中深入了解了。

使用`Governor`智能合约配置的一个好方法是使用OpenZeppelin的contract wizard。前往[OpenZeppelin合约页面](https://www.openzeppelin.com/contracts){target=\_blank}，往下滑动页面找到并点击**Governor**标签，您可以看到配置`Governor`智能合约的不同方式。

出于演示目的，我们将尽可能地生成一个简单的基础智能合约。

1. 将`Governor`合约命名为**CrossChainDAO**
2. 为简单起见，将**Voting Delay**设置为0，从而使提案提出后立即得到投票权重快照
3. 将**Voting Period**设置为较短的时间，例如6分钟
4. 为了计算法定人数（投票通过所需的最小投票权重），将**Quorum**设置为数字 (**#**) 1
5. 禁用**Timelock**，因为Timelock时间段是一个可选项

![OpenZeppelin Contract Wizard](/images/tutorials/interoperability/cross-chain-dao/cross-chain-dao-4.webp)

您应该在OpenZeppelin的contract wizard中看到与下面类似的合约：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";

contract CrossChainDAO is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes {
    constructor(IVotes _token)
        Governor("CrossChainDAO")
        GovernorSettings(0 /* 0 block */, 30 /* 6 minutes */, 0)
        GovernorVotes(_token)
    {}

    function quorum(uint256 blockNumber) public pure override returns (uint256) {
        return 1e18;
    }

    // The following functions are overrides required by Solidity.

    function votingDelay() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }
}
```

接下来把`CrossChainDAO`智能合约作为`CrossChainDAO.sol`添加到工作目录中。

### 添加跨链支持 { #adding-cross-chain-support }

下一个任务是支持跨链消息传递。对于此实现，我们将使用LayerZero提供的[`NonblockingLzApp`智能合约](https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/lzApp/NonblockingLzApp.sol){target=\_blank}，可以轻松接收和发送跨链消息。大多数跨链协议都会有一些智能合约可以继承以接收通用字节负载，因此您可以对不同的父智能合约使用类似的逻辑。

首先，请执行以下步骤：

1. 导入`NonblockingLzApp`并将其添加至`CrossChainDAO`的父智能合约中
2. 通过传入LayerZero的链上智能合约作为输入来根据`NonblockingLzApp`合约的要求更新构造函数
3. 创建一个函数，使其能够覆盖`NonblockingLzApp`合约的`_nonblockingLzReceive`函数，该函数将负责接收跨链数据

```solidity
// ...other imports go here
import "@layerzerolabs/solidity-examples/contracts/lzApp/NonblockingLzApp.sol";

contract CrossChainDAO is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, NonblockingLzApp {
    constructor(IVotes _token, address lzEndpoint)
        Governor("CrossChainDAO")
        GovernorSettings(0 /* 0 blocks */, 30 /* 6 minutes */, 0)
        GovernorVotes(_token)
        NonblockingLzApp(lzEndpoint)
    { }

    function _nonblockingLzReceive( uint16 _srcChainId, bytes memory, uint64, bytes memory _payload) internal override {
        // TODO: add cross-chain logic
    }
} 
```

我们将在实现收集阶段时完全实现`_nonblockingLzReceive`函数。只要理解这就是LayerZero的跨链协议在有消息传入时交互的接口即可。

### 使用跨链Governor统计合约统计票数 {: #counting-votes-with-cross-chain-governor-counting-contract }

我们将通过`_nonblockingLzReceive`接收跨链投票数据，但是如果没有存储或统计数据，此操作将毫无意义。该逻辑和数据将存放在`CrossChainDAO`的父合约中。所以让我们在开始编写`_nonblockinglzReceive`函数之前实现这个父合约。

OpenZeppelin将DAO的许多方面分为多个智能合约，从而更容易替换一些逻辑部分且无需更改其他部分。我们无需了解OpenZeppelin的contract wizard产生的所有不同智能合约，但是必须了解[`GovernorCountingSimple`合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/extensions/GovernorCountingSimple.sol){target=\_blank}。

`GovernorCountingSimple`合约定义了如何统计票数以及投票详情。其存储每个提案的投票数量，投票选项（赞成、反对、弃权），以及是否达到法定人数。

幸运的是，在转换为跨链版本的时候，很多统计票数的逻辑并没有改变。跨链变量和单链变量之间的唯一区别是，跨链变量必须考虑收集阶段和和随之而来的选票。我们可以先添加一些逻辑。

在我们自己编写任何自定义代码之前，先将[`GovernorCountingSimple`合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/extensions/GovernorCountingSimple.sol){target= _blank}复制并粘贴至名为`CrossChainGovernorCountingSimple.sol`的新文件中。您可以从其代码库或`node_modules`文件夹中获取此合约。

接下来，我们来更改以下内容：

1. 更新导入的合约以使用`@openzeppelin/contracts`而不是使用相对路径
2. 将合约重命名为`CrossChainGovernorCountingSimple`
3. 添加一个接受`uint16[]`参数的构造函数，用于定义`CrossChainDAO`智能合约将连接的spoke链
4. 添加一个struct及其相对应的映射，用于存储从其他链接收到的投票数据

```solidity
import "@openzeppelin/contracts/governance/Governor.sol"

abstract contract CrossChainGovernorCountingSimple is Governor {
    // ...
    // The lz-chain IDs that the DAO expects to receive data from during the 
    // collection phase
    uint16[] public spokeChains;

    constructor(uint16[] memory _spokeChains) {
        spokeChains = _spokeChains;
    }

    struct SpokeProposalVote {
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        bool initialized;
    }

    // Maps a proposal ID to a map of a chain ID to summarized spoke voting data
    mapping(uint256 => mapping(uint16 => SpokeProposalVote)) public spokeVotes;
    // ...
}
```

!!! 挑战
    在准备将跨链DAO应用于生产环境之前，您可以通过治理使spoke链变得可修改，而不是保持静态。您可以通过添加额外函数来实现这一功能吗？ 哪个地址可以访问此函数？    

    *提示：用映射替换数组。*

`SpokeProposalVote`基于`GovernorCountingSimple`中的[`ProposalVote`结构](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/dfcc1d16c5efd0fd2a7abac56680810c861a9cd3/contracts/governance/extensions/GovernorCountingSimple.sol#L23){target=\_blank}构建。主要有两个区别，一个是新结构包含一个名为`initialized`的`bool`，因此可以通过从`spokeVotes`映射中检索结构来检查是否从spoke链接收到数据。另一个是`SpokeProposalVote`不包括用户投票映射，因为该信息保留在spoke链上，这对于统计投票是否成功是非必要的。

!!! 挑战
    新的`SpokeProposalVote`结构与`ProposalVote`结构非常相似。您可以挑战为智能合约想出一个只需要一个结构即可实现的更优化的数据结构吗？

现在我们已经有地方可以存储跨链数据，接下来需要有数据结构来组织它。跨链数据对于在统计投票是否达到法定人数以及投票是否通过中很重要。通过遍历来自每条spoke链存储的跨链数据，每条spoke链的投票数被添加到法定人数和投票成功的统计中。为此，您将需要修改`_quorumReached`和`_voteSucceeded`函数。

```solidity
function _quorumReached(uint256 proposalId) internal view virtual override returns (bool) {
    ProposalVote storage proposalVote = _proposalVotes[proposalId];
    uint256 abstainVotes = proposalVote.abstainVotes;
    uint256 forVotes = proposalVote.forVotes;

    for (uint16 i = 0; i < spokeChains.length; i++) {
        SpokeProposalVote storage v = spokeVotes[proposalId][spokeChains[i]];
        abstainVotes += v.abstainVotes;
        forVotes += v.forVotes;
    }

    return quorum(proposalSnapshot(proposalId)) <= forVotes + abstainVotes;
}

function _voteSucceeded(uint256 proposalId) internal view virtual override returns (bool) {
    ProposalVote storage proposalVote = _proposalVotes[proposalId];
    uint256 againstVotes = proposalVote.againstVotes;
    uint256 forVotes = proposalVote.forVotes;

    for (uint16 i = 0; i < spokeChains.length; i++) {
        SpokeProposalVote storage v = spokeVotes[proposalId][spokeChains[i]];
        againstVotes += v.againstVotes;
        forVotes += v.forVotes;
    }
    return forVotes > againstVotes;
}
```

这应该就是对跨链投票的统计和存储的所有更改了。您可以在[GitHub代码库](https://github.com/jboetticher/cross-chain-dao/blob/main/contracts/CrossChainGovernorCountingSimple.sol){target=\_blank}中查看已完成状态的智能合约。

现在，在子合约`CrossChainDAO`中，您可以导入`CrossChainGovernorCountingSimple`合约并用它替换`GovernorCountingSimple`：

```solidity
// ...
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "./CrossChainGovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";

contract CrossChainDAO is Governor, GovernorSettings, CrossChainGovernorCountingSimple, GovernorVotes, NonblockingLzApp {

    constructor(IVotes _token, address lzEndpoint)
        Governor("CrossChainDAO")
        GovernorSettings(0 /* 0 blocks */, 30 /* 6 minutes */, 0)
        GovernorVotes(_token)
        NonblockingLzApp(lzEndpoint)
        CrossChainGovernorCountingSimple(_spokeChains)
    { }

    // ...
}
```

### 实现收集阶段 {: #implementing-a-collection-phase }

回想最初的构想，应该在投票期和提案执行之间添加一个新的收集阶段。 在这个阶段期间：

1. 必须推迟执行阶段
2. hub链必须从spoke链请求投票数据
3. spoke链必须随后发送投票数据

#### 定义收集阶段并阻止执行 {: #defining-the-collection-phase-and-preventing-execution }

首先要解决第一个问题：确保在收集阶段禁止执行。这将有效地从`CrossChainDAO`合约中定义收集阶段。

我们需要执行以下内容：

1. 添加两个新的映射`collectionStarted`和`collectionFinished`，将用于追踪在此章节多个函数中将使用的收集状态
2. 添加一个函数，以覆盖OpenZeppelin `Governor`合约的`_beforeExecute`函数，该函数通过检查`initialized`来查看每个spoke链是否在执行提案之前已发送了投票数据
3. 添加一个函数，如果所有卫星链都发回了跨链消息，则将收集阶段标记为`true`

```solidity
mapping(uint256 => bool) public collectionStarted;
mapping(uint256 => bool) public collectionFinished;

function _beforeExecute(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) internal override {
    finishCollectionPhase(proposalId);

    require(
        collectionFinished[proposalId],
        "Collection phase for this proposal is unfinished!"
    );

    super._beforeExecute(proposalId, targets, values, calldatas, descriptionHash);
}

function finishCollectionPhase(uint256 proposalId) public {
    bool phaseFinished = true;
    for (uint16 i = 0; i < spokeChains.length && phaseFinished; i++) {
        phaseFinished =
            phaseFinished &&
            spokeVotes[proposalId][spokeChains[i]].initialized;
    }

    collectionFinished[proposalId] = phaseFinished;
}
```

如果需要，您还可以在[IGovernor state machine](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4f4b6ab40315e2fbfc06e65d78f06c5b26d4646c/contracts/governance/IGovernor.sol#L15){target=\_blank}中添加收集阶段。这将需要花费更多的时间和精力而不一定值得，它对于从头开始编写跨链DAO来说更可行，因此我们不会在本教程中这样做。

#### 从Spoke链请求投票 {: #requesting-votes-from-spoke-chains }

接下来，我们需要了解如何从spoke链请求投票数据。我们可以通过创建一个新的公共的无需信任的函数来开始收集阶段，类似于`execute`函数：

```solidity
// Requests the voting data from all of the spoke chains
function requestCollections(uint256 proposalId) public payable {
    require(
        block.number > proposalDeadline(proposalId),
        "Cannot request for vote collection until after the vote period is over!"
    );
    require(
        !collectionStarted[proposalId],
        "Collection phase for this proposal has already started!"
    );

    collectionStarted[proposalId] = true;

    // Sends an empty message to each of the aggregators. If they receive a 
    // message at all, it is their cue to send data back
    uint256 crossChainFee = msg.value / spokeChains.length;
    for (uint16 i = 0; i < spokeChains.length; i++) {
        // Using "1" as the function selector
        bytes memory payload = abi.encode(1, abi.encode(proposalId));
        _lzSend({
            _dstChainId: spokeChains[i],
            _payload: payload,
            _refundAddress: payable(address(this)),
            _zroPaymentAddress: address(0x0),
            _adapterParams: bytes(""),
            _nativeFee: crossChainFee
        });
    }
}
```

此函数允许任何用户启动特定`proposalId`的收集过程，只需满足以下条件：

1. 提案的投票阶段已经结束
2. 收集阶段尚未开启

每个spoke链都有一个与之关联的`DAOSatellite`智能合约，它也可以接收和发送跨链消息。此函数在收集阶段向每个已注册spoke链的`DAOSatellite`发送跨链消息。该消息包含函数选择器、`1`和提案ID。函数选择器用于从目标`DAOSatellite`合约请求给定提案的投票数据，而不是其他一些操作（我们将在后续重新讨论[此概念](#receiving-votes-from-spoke-chains)）。

!!! 注意事项
    通过使用LayerZero，必须在单个交易中发送多条消息，以便每条spoke链都可以接收数据。LayerZero和其他跨链协议一样，[是**unicast（单播）**而不是**multicast（多播）**](https://layerzero.gitbook.io/docs/faq/messaging-properties#multicast){target=\_blank}。就像跨链消息只能到达一个目的地。在设计中心辐射（hub-and-spoke）架构时，研究一下您的[协议是否支持multicast消息传递](https://docs.wormhole.com/wormhole/explore-wormhole/core-contracts#multicast){target=\_blank}，因为它更为简洁。

请求数据部分就到此为止了，因为之后的大部分逻辑将会在[DAO Satellite](#dao-satellite-contract)中。 

#### 从Spoke链接收投票 {: #receiving-votes-from-spoke-chains }

回想一下，使用LayerZero的互连合约实现了`_nonblockingLzReceive`函数来接收跨链消息。对于传入消息，我们必须保证能够在收集阶段从其他链接收投票数据。像优秀的软件开发者一样，我们希望保持可扩展性。我们可能还想从执行其他操作（如执行或提议）的其他链接收消息。但是我们在一个接收函数中只能得到一个负载。那么，我们如何来解决这个问题？

!!! 注意事项
    为简单起见，我们不会在本教程中实现跨链执行或提案。引入函数选择器这一概念是因为它是跨链DApp中的一个重要主题。

让我们想想EVM。智能合约是如何知道交易要调用一个特定功能？每个函数都有一个函数选择器，它是一个映射到特定操作的哈希值。我们可以做同样的事情，但使用跨链消息和整数而不是哈希。

我们将`_nonblockingLzReceive`函数更新为如下：

1. 将函数选择器定义为`uint16`变量，并存储在字节负载开头。从现在开始，我们将确保在我们的设计中**发送的每条跨链消息都将在其负载的开头具有`uint16`函数选择器**。
2. 使用assembly（汇编）将位于`payload's address + 32 bytes`处的数据加载到`option`变量中。要了解该步骤的必要性，您需要对`abi.encode`的工作原理有一些初步了解。ABI编码负载的前32个字节专用于有关整个负载大小的信息。在这些头32个字节之后，存储其余信息，在本例中为函数选择器
3. 根据`option`变量的输入，执行某种类型的跨链操作。对于此示例，数字`0`映射到从其他链接收投票数据的选项。您可以为下一个数字`1`添加其他功能，例如提议或执行
4. 如果`option`为`0`，我们需要添加接收投票数据的功能。因此，我们将调用一个函数来接收投票数据并将`_srcChainId`和新解包的`payload`传递给该函数。我们将在以下步骤中创建此函数

将以下代码添加至`_nonblockingLzReceive`函数中：

```solidity
// Gets a function selector option
uint16 option;
assembly {
    option := mload(add(payload, 32))
}

// Some options for cross-chain actions are: propose, vote, vote with reason,
// vote with reason and params, cancel, etc.
if (option == 0) {
    onReceiveSpokeVotingData(_srcChainId, payload);
} else if (option == 1) {
    // TODO: Feel free to put your own cross-chain actions (propose, execute, etc.)
} else {
    // TODO: You could revert here if you wanted to
}
```

当收到来自任何跨链协议的跨链消息时，其带有任意字节的负载。通常，此字节负载是通过调用`abi.encode`创建的，其中插入了多种类型的数据。对于接收此数据的智能合约，数据必须使用`abi.decode`解码，其中信息以预期的方式解码。例如，如果接收智能合约的逻辑需要`uint16`和`address`才能正常运行，它将通过包含`abi.decode(payload, (uint16, address))`进行解码。

当我们将多种函数打包到具有单个负载的消息中时，该负载可能会以多种格式出现，因为不同的函数需要不同的字节。因此，我们必须在解码整个消息之前检查函数选择器。

!!! 注意事项
    `abi.encode`函数是最常使用的，因为它对动态类型的支持最多，但如果您的用例允许，您也可以使用`abi.encodePacked`。如果您选择进行此更改，则必须更改assembly级别的逻辑。

我们尚未编写`onReceiveSpokeVotingData`函数。 为此，我们需要执行以下步骤：

1. 创建接受`_srcChainId`和`payload`的`onReceiveSpokeVotingData`函数
2. 存储外部投票数据以备后续使用。我们已经通过`SpokeProposalVote`结构在[`CrossChainGovernorCountingSimple`](#counting-votes-with-cross-chain-governor-counting-contract){target=\_blank}中定义了我们想要从spoke链获得的信息类型。我们需要三个投票值：`forVotes`、`againstVotes`和`abstainVotes`。 另外，我们想知道收到的数据是针对哪个提案的，因此我们还需要一个提案ID

```solidity
function onReceiveSpokeVotingData(uint16 _srcChainId, bytes memory payload) internal virtual {
    (
        , // uint16 option
        uint256 _proposalId,
        uint256 _for,
        uint256 _against,
        uint256 _abstain
    ) = abi.decode(payload, (uint16, uint256, uint256, uint256, uint256));
}
```

我们现在可以将数据存储在`CrossChainGovernorCountingSimple`中定义的`spokeVotes`映射中，只要该数据尚未存储：

```solidity
    // As long as the received data isn't already initialized...
    if (spokeVotes[_proposalId][_srcChainId].initialized) {
        revert("Already initialized!");
    } else {
        // Add it to the map (while setting initialized true)
        spokeVotes[_proposalId][_srcChainId] = SpokeProposalVote(
            _for,
            _against,
            _abstain,
            true
        );
    }
```

至此，收集阶段已经完成！收集阶段在计算完所有选票和发送请求spoke链的投票数据的消息之前阻止执行提案。

### 发起跨链提案 { #making-proposals-cross-chain }

OpenZeppelin的`Governor`智能合约带有`propose`函数，但它不能帮助我们实现目的。当用户发送提案时，智能合约需要发送跨链消息，通知spoke链有新的提案要投票。但是目标链也需要gas来支付消息传送。大多数跨链协议目前需要为目标链的交易以源链的原生Token来支付额外的gas费用，并且只能通过payable（支付）函数发送。`propose`函数不是payable（可支付的），因此我们必须编写自己的跨链版本。

!!! 注意事项
    从技术层面上来讲，跨链消息应该在投票延迟期结束时发送，以便与获得投票权重快照（snapshot）时同步。在这种情况下，提案和快照是同时进行的。

我们将`Governor`智能合约中包含的原始`propose`函数重命名为`crossCahinPropose`。然后将其修改为发送包含提案信息的跨链消息到每条spoke链，spoke链的ID存储在 [`CrossChainGovernorCountingSimple`合约](#counting-votes-with-cross-chain-governor-counting-contract){target=\_blank}中：

```solidity
function crossChainPropose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description) 
    public payable virtual returns (uint256) {
    uint256 proposalId = super.propose(targets, values, calldatas, description);

    // Sends the proposal to all of the other chains
    if (spokeChains.length > 0) {
        uint256 crossChainFee = msg.value / spokeChains.length;

        // Iterate over every spoke chain
        for (uint16 i = 0; i < spokeChains.length; i++) {
            bytes memory payload = abi.encode(
                0, // Function selector "0" for destination contract
                abi.encode(proposalId, block.timestamp) // Encoding the proposal start
            );

            // Send a cross-chain message with LayerZero to the chain in the iterator
            _lzSend({
                _dstChainId: spokeChains[i],
                _payload: payload,
                _refundAddress: payable(address(this)),
                _zroPaymentAddress: address(0x0),
                _adapterParams: bytes(""),
                _nativeFee: crossChainFee
            });
        }
    }

    return proposalId;
}
```

我们在设计`CrossChainDAO`智能合约的`_nonblockingLzReceive`函数时希望能够有函数选择器。同样，现在我们希望卫星智能合约也能实现这些功能。在这种情况下，我们将`0`定义为收到新提案。当从spoke链[请求投票信息](#requesting-votes-from-spoke-chains){target=\_blank}时，我们做了同样的事情。

至此，`CrossChainDAO.sol`智能合约就完成了！您可以在[GitHub代码库](https://github.com/jboetticher/cross-chain-dao/blob/main/contracts/CrossChainDAO.sol){target=\_blank}中查看已完成的智能合约。

## 编写DAO卫星（Satellite）合约 {: #dao-satellite-contract }

到目前为止，我们只讨论了跨链DAO及其附带的Token。跨链DAO永远不会部署到spoke链上，因为跨每个spoke链复制*所有*数据的效率不高。 但是，我们仍然需要一个接口来使用spoke链上的`CrossChainDAO`智能合约。 因此，我们将创建一个名为`DAOSatellite`的卫星合约。

我们将执行以下步骤来创建新的`DAOSatellite`合约：

1. 添加依赖并继承`NonblockingLzApp`合约
2. 添加一个构造函数，定义什么是hub链（每条链在LayerZero和所有其他跨链协议中都有自己的ID）、LayerZero端点、定义投票权重的跨链Token，以及每个区块的平均秒数权重（将在后续详细介绍）
3. 添加一些结构和存储变量以备后续使用。它们主要是`CrossChainDAO`及其父合约中内容的精简版本
4. 添加一个函数来检查给定的提案ID是否有效并开放投票

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@layerzerolabs/solidity-examples/contracts/lzApp/NonblockingLzApp.sol";
import "@openzeppelin/contracts/utils/Timers.sol";
import "@openzeppelin/contracts/utils/Checkpoints.sol";
import "@openzeppelin/contracts/governance/utils/IVotes.sol";

contract DAOSatellite is NonblockingLzApp { 
    struct ProposalVote {
        uint256 againstVotes;
        uint256 forVotes;
        uint256 abstainVotes;
        mapping(address => bool) hasVoted;
    }

    enum VoteType {
        Against,
        For,
        Abstain
    }

    struct RemoteProposal {
        // Blocks provided by the hub chain as to when the local votes should start/finish.
        uint256 localVoteStart;
        bool voteFinished;
    }

    constructor(uint16 _hubChain, address _endpoint, IVotes _token, uint _targetSecondsPerBlock) 
        NonblockingLzApp(_endpoint) payable {
        hubChain = _hubChain;
        token = _token;
        targetSecondsPerBlock = _targetSecondsPerBlock;
    }

    uint16 public immutable hubChain;
    IVotes public immutable token;
    uint256 public immutable targetSecondsPerBlock;
    mapping(uint256 => RemoteProposal) public proposals;
    mapping(uint256 => ProposalVote) public proposalVotes;

    function isProposal(uint256 proposalId) view public returns(bool) {
        return proposals[proposalId].localVoteStart != 0;
    }
}
```

由于此智能合约继承自`NonblockingLzApp`，因此需要`_nonblockingLzReceive`来接收跨链消息。 这个智能合约与`CrossChainDAO`智能合约通信，目前有两个`CrossChainDAO`发送消息的实例：

- 当`CrossChainDAO`想要通知spoke链一个新提议时（函数选择器为`0`）
- 当`CrossChainDAO`希望spoke链将它们的投票数据发送到hub链时（函数选择器为`1`）

像`CrossChainDAO`一样，使用函数选择器编写接收函数`_nonblockingLzReceive`：

```solidity
function _nonblockingLzReceive(uint16 _srcChainId, bytes memory, uint64, bytes memory _payload) internal override {
    require(_srcChainId == hubChain, "Only messages from the hub chain can be received!");

    uint16 option;
    assembly {
        option := mload(add(_payload, 32))
    }

    if (option == 0) {
        // Begin a proposal on the local chain, with local block times
     }
    else if (option == 1) {
        // Send vote results back to the hub chain
     }
}
```

首先，处理第一个操作`if (option == 0)`，在本地链上开始一个提案：

1. 解码负载，其中包括提案ID及其创建提案的时间戳，如[CrossChainDAO部分](#making-proposals-cross-chain)中所述
2. 执行一些计算，通过根据时间戳和预定的每区块秒数估值从当前区块减去一些区块，来生成`cutOffBlockEstimation`
3. 在提案映射中添加一个`RemoteProposal`结构，有效地在spoke链上注册提案及其投票相关数据

```solidity
(, uint256 proposalId, uint256 proposalStart) = abi.decode(_payload, (uint16, uint256, uint256));
require(!isProposal(proposalId), "Proposal ID must be unique.");

uint256 cutOffBlockEstimation = 0;
if(proposalStart < block.timestamp) {
    uint256 blockAdjustment = (block.timestamp - proposalStart) / targetSecondsPerBlock;
    if(blockAdjustment < block.number) {
        cutOffBlockEstimation = block.number - blockAdjustment;
    }
    else {
        cutOffBlockEstimation = block.number;
    }
}
else {
    cutOffBlockEstimation = block.number;
}

proposals[proposalId] = RemoteProposal(cutOffBlockEstimation, false);
```

上述代码段中的计算不足以确保设置正确。虽然具体开始投票的时间并不重要，但获得投票权重快照的时间却很重要。如果生成投票权重快照的时间在spoke链和hub链之间相距太远，用户可以将Token从一条链发送到另一条链，从而有效地使其投票权重翻倍。下方列出了一些[应对策略示例](#double-weight-attack-from-snapshot-mismatch)，因为太过复杂，所以无法在本教程中展开解释。 与此同时，唯一的策略是根据时间戳和预定的每区块秒数估值从当前区块中减去一些区块。

现在让我们添加将投票结果发送回hub链的逻辑：

1. 从跨链消息中获取提案ID
2. 从相关映射中获取上述提案的数据
3. 将该数据编码为`CrossChainDAO`定义的负载
4. 通过LayerZero发送该数据

```solidity
uint256 proposalId = abi.decode(_payload, (uint256));
ProposalVote storage votes = proposalVotes[proposalId];
bytes memory votingPayload = abi.encode(
    0, 
    abi.encode(proposalId, votes.forVotes, votes.againstVotes, votes.abstainVotes)
);
_lzSend({
    _dstChainId: hubChain,
    _payload: votingPayload,
    _refundAddress: payable(address(this)),
    _zroPaymentAddress: address(0x0),
    _adapterParams: bytes(""),
    // NOTE: DAOSatellite needs to be funded beforehand, in the constructor.
    //       There are better solutions, such as cross-chain swaps being built in from the hub chain, but
    //       this is the easiest solution for demonstration purposes.
    _nativeFee: 0.1 ether 
});
proposals[proposalId].voteFinished = true;
```

此处唯一的问题是必须含括跨链消息在hub链上交易的gas费用，除此之外没有其他简单的接收方式。[下方有能够避免这个问题的选项](#chained-cross-chain-message-fees)，但为了简单起见，卫星合约必须每隔一段时间发送一次原生Token。

最后，需要添加允许用户投票的投票机制。该机制与[`GovernorCountingSimple`智能合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/extensions/GovernorCountingSimple.sol){target=\_blank}中的机制近乎相同，可以复制大部分的代码：

```solidity
function castVote(uint256 proposalId, uint8 support) public virtual returns (uint256 balance)
{
    RemoteProposal storage proposal = proposals[proposalId];
    require(
        !proposal.voteFinished,
        "DAOSatellite: vote not currently active"
    );
    require(
        isProposal(proposalId), 
        "DAOSatellite: not a started vote"
    );

    uint256 weight = token.getPastVotes(msg.sender, proposal.localVoteStart);
    _countVote(proposalId, msg.sender, support, weight);

    return weight;
}

function _countVote(uint256 proposalId, address account, uint8 support, uint256 weight) internal virtual 
{
    ProposalVote storage proposalVote = proposalVotes[proposalId];

    require(!proposalVote.hasVoted[account], "DAOSatellite: vote already cast");
    proposalVote.hasVoted[account] = true;

    if (support == uint8(VoteType.Against)) {
        proposalVote.againstVotes += weight;
    } else if (support == uint8(VoteType.For)) {
        proposalVote.forVotes += weight;
    } else if (support == uint8(VoteType.Abstain)) {
        proposalVote.abstainVotes += weight;
    } else {
        revert("DAOSatellite: invalid value for enum VoteType");
    }
}
```

请注意，`castVote`函数需要满足以下要求：

- 提案尚未结束
- 提案存在，即有数据存储在`proposals`映射中

事实上，`_countVote`函数是直接从hub链[复制](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4fb6833e325658946c2185862b8e57e32f3683bc/contracts/governance/extensions/GovernorCountingSimple.sol#L78){target=\_blank}而来！单链dApp的大部分逻辑只需细微调整即可在跨链dApp中直接使用。

这基本上就是satellite合约的情况。它相对来说还是简单的，因为大部分逻辑只是对hub链上发生的事情的反映。您可以在[GitHub代码库](https://github.com/jboetticher/cross-chain-dao/blob/main/contracts/DAOSatellite.sol){target=\_blank}中查看已完成的智能合约。

现在，每个智能合约都已经完成，可以开始如下所示的部署计划了。如果您想要继续往下操作，跨链DAO的[GitHub代码库](https://github.com/jboetticher/cross-chain-dao){target=\_blank}允许您在测试网上进行部署。

![Smart contracts overview](/images/tutorials/interoperability/cross-chain-dao/cross-chain-dao-3.webp)  

请注意，**本教程中的智能合约未经测试，请勿将其用于生产环境**。

## 注意事项和其他设计 {: #caveats-and-other-designs }

到目前为止，您已全部完成智能合约系统的每个部分。 整个智能合约系统的内容有很多，而且仍有部分需要经过开发测试才能投入生产环境中。

这个跨链DAO的设计是在OpenZeppelin的Governor基础上创建的，但这并不意味着它没有任何缺陷。要构建第一个版本的跨链DApp建议可以先使用预先存在的智能合约。但是当你准备编写生产环境就绪的代码时，建议从头开始，只保留仍与设计相关的部分。处理针对单链设计的逻辑可能会让你遇到很多麻烦，在编写跨链智能合约时，您会发现这种情况很常见。

例如，`Governor`智能合约中的`propose`函数无法使用，必须更换为新的跨链函数。建议完全删除`propose`函数，但由于`Governor`智能合约的设计方式，目前无法做到这一点。这是一个明显的问题，它表明虽然使用预先存在的智能合约对跨链DApp进行原型设计是件好事，但最好可以完全重写他们，同时仍然重用一些逻辑。

!!! 挑战
    挑战重写`CrossChainDAO`智能合约，使其只包含跨链交互所必需的逻辑和功能。当您编写合约的时候，您能实现下方建议的任何替代设计吗？

### 将跨链选择器划分为多个合约 {: #division-of-the-cross-chain-selector-into-multiple-contracts }

`CrossChainDAO`和`DAOSatellite`智能合约中使用的跨链函数选择方法可以很好地运行。但是，您可以将跨链消息定向到多个在`CrossChainDAO`中具有特殊权限的智能合约，而不是在单个智能合约中使用选择器。如果您相信智能合约的单一功能原则（SRP），您可能会发现这很有帮助。

例如，hub链的`CrossChainDAO`可以由接收跨链数据的主合约和另外两个智能合约组成：`CrossChainExecutor`和`CrossChainProposer`。因此，当与`DAOSatellite`合约交互以向`CrossChainDAO`发送消息时，spoke链的智能合约可以将`CrossChainExecutor`作为目标来进行提案执行或将`CrossChainProposer`作为目标来进行提议。这将消除双重包装负载的需要，以及在跨链消息接收功能中包含函数选择逻辑的需要。它甚至可以帮助将单链DAO转换为具有跨链能力的DAO。

![Single Responsibility Principle](/images/tutorials/interoperability/cross-chain-dao/cross-chain-dao-5.webp)  

### 分布式提案和执行 {: #distributed-proposal-and-execution }

如果您希望用户能够在多条链上执行提案而不只是hub链，有几种方法可以解决这个问题：

- 坚持中心辐射（hub-and-spoke）模型
- 完全去中心化

中心辐射（hub-and-spoke）模型已在本教程中进行了详细介绍。在这种情况下，执行可能发生在多个链上，您必须在每个链上都有一个代表hub链执行的智能合约（可以添加到`DAOSatellite`）。该智能合约将从`Governor`智能合约提供的`execute`函数接收消息。这很简单，但是跨链消息可能太多，从而导致效率不高。

如果您决定完全去中心化DAO，很有可能完全删除`DAOSatellite`智能合约并在每条链上部署修改后的`CrossChainDAO`智能合约。每个`CrossChainDAO`都可以控制要在其链上执行的提案。然而，这将需要重新设计提案的制作和发送方式。

在生成提案ID时，您可能还会发现问题。接下来，看一下ID是如何生成的：

```solidity
function hashProposal(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) public pure virtual override returns (uint256) {
    return uint256(keccak256(abi.encode(targets, values, calldatas, descriptionHash)));
}
```

想象一下相同的描述和交易细节可以在A链和B链上发送。这可能会导致错误，因为会有冲突的交易发生。建议包含另一个参数来哈希提案ID：提案要在其上执行的链的链ID。

### 来自快照不匹配的双权重攻击 {: #double-weight-attack-from-snapshot-mismatch }

通过`CrossChainDAOToken`在链之间分配投票权重的一个主要问题是区块在网络之间没有正确对齐。这可能会导致多个链之间的投票快照不够接近，从而导致当DAO Token的跨链转账抢在新提案的投票权重快照前运行时，投票权重翻倍。

一种选择是使用预言机将区块与时间戳对齐，以确保spoke链上的快照尽可能接近hub链的时间戳。

一个更简单的解决方案是改变`ERC20Votes`智能合约，使其依赖于时间戳而不是区块，但如果两条链上的区块生产者串通一气，这仍然可能受到攻击。

或者，您可以更改`OFTVotes`智能合约，将投票权重的添加推迟到收到权重后的几个区块。

### 连锁的跨链消息费用 {: chained-cross-chain-message-fees }

spoke链的`DAOSatellite`智能合约中有一个经常被忽视的缺陷，当从hub链请求投票数据时，目标链费用必须事先存储在智能合约中，有两个可能的解决方案：

- 存储数据请求，并允许任何人无需信任地发回数据
- 使用请求数据的跨链消息从hub链发送gas

第一种解决方案是最简单的，但如果您不打算运行额外的基础设施，它可能会增加从提议到执行的周转时间。类似于提案完成后任何人都可以运行`execute`函数的方式，将编写一个新函数以允许任何人将投票数据发送到hub链。最好，这还需要一个[收集阶段的超时限制](#collection-phase-time-out)。

![Chained Execution](/images/tutorials/interoperability/cross-chain-dao/cross-chain-dao-6.webp)  

第二种解决方案要复杂得多。 它需要一个设置来发送带有负载的Token，而不是像当前合约那样只发送负载，并且在目标链上发生兑换以得到原生Token以进行跨链交易。

### 收集阶段超时限制 {: collection-phase-time-out }

如果您想要安全并且您认为spoke链可能会停滞甚至停止被支持，您可能希望包括一种方法来限制收集阶段所花费的时间，并为您的DAO的治理添加一种方法来增加和移除spoke链。

例如，hub链会等待30个区块，然后才会忽略来自spoke链的投票数据。如果DAO的参与者认为A链应该从未来的投票中移除，他们可以启动一个提案来完成，类似于OpenZeppelin的`GovernorSettings`合约。

--8<-- 'text/_disclaimers/educational-tutorial.md'

--8<-- 'text/_disclaimers/third-party-content.md'