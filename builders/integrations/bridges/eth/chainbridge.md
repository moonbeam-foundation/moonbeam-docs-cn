---
title: ChainBridge协议的以太坊Moonbeam跨链转接桥
description: 如何使用ChainBridge协议以智能合约形式实现以太坊和Moonbeam之间的链间资产转移。
---

# ChainBridge协议的以太坊Moonbeam跨链转接桥

![ChainBridge Moonbeam banner](/images/builders/integrations/bridges/eth/chainbridge/chainbridge-banner.png)

## 概览 {: #introduction } 

跨链转接桥是连接两个经济独立、技术相异的区块链，实现链间沟通的解决方案。转接桥可以有两种：一种是中心化的可信协议，另一种是去中心化的无信任协议。[ChainSafe](https://chainsafe.io/)团队推出的模块化的多方向[ChainBridge](https://github.com/ChainSafe/ChainBridge#installation)就是现有的解决方案之一，现已支持Moonbeam部署，连接Moonbase Alpha测试网和以太坊Rinkeby/Kovan测试网。

本教程共分为两个部分。第一部分，我们将介绍ChainBridge的一般工作流程。第二部分，我们将通过多个示例演示如何在Moonbase Alpha和Rinkeby/Kovan间进行ERC-20和ERC-721资产的转移。

 - [ChainBridge的运行机制](/integrations/bridges/ethereum/chainbridge/#how-the-bridge-works)
    - [一般定义](/integrations/bridges/ethereum/chainbridge/#general-definitions)
 - [使用ChainBridge部署Moonbase Alpha](/integrations/bridges/ethereum/chainbridge/#try-it-on-moonbase-alpha)
    - [进行ERC-20代币转移](/integrations/bridges/ethereum/chainbridge/#erc-20-token-transfer)
    - [进行ERC-721代币转移](/integrations/bridges/ethereum/chainbridge/#erc-721-token-transfer)
    - [一般应用程序](/integrations/bridges/ethereum/chainbridge/#generic-handler)

## ChainBridge的运行机制 {: #how-the-bridge-works } 

ChainBridge本质上是一个消息传递协议，利用源链上的事件将消息通过一定路径传递到目标链上。在消息传递的过程中，ChainBridge主要有三个主要功能：

 - 侦听器：从源链中提取事件，并构建消息
 - 路由器：将侦听器构建的消息传递给写入器
 - 写入器：进行消息转译，并将交易提交到目标链

ChainBridge目前依赖于受信任的中继器来执行这些角色。此外，还设置了防止中继器滥用权力、误操作资金的机制。中继器在目标链上创建提案，并提交由部署在源链和目标链上的其它中继器进行投票，提案必须获得一定票数才能进行执行。

在转接桥的两边部署有不同的智能合约，每个合约都有其特定功能：

 - **桥接合约** **–** 这一合约面向用户与中继器，它可以调用处理合约，处理充值请求、在源链发起交易、在目标链执行提案等
 - **处理程序合约** – 验证用户提交的参数，并创建充值/执行记录
 - **目标合约** – 正如其名，目标合约就是部署在转接桥两端，完成桥接功能的合约

### 一般工作流程 {: #general-workflow } 

在ChainBridge模型下，从链A到链B的数据和价值转移的一般工作流程如下：

  - 用户通过链A的桥接合约中_deposit()_发起交易。用户需要输入目标链信息、源ID以及_calldata_（定义见示意图后“一般定义”章节）。经过几次检查后，将调用处理程序合约的_deposit()_来执行目标合约的相应调用。
  - 在执行链A中的目标合约功能后，桥接合约发出*Deposit* 事件消息，该事件包含链B上执行交易所需要的必要信息。这被称为“提案”。 每个提案有五种可能的状态（未激活、已激活、已通过、已执行、已取消）。
  - 中继器将随时听取区块链两端的消息。当中继器从链A中提取事件，就会发起提案进行投票，投票将在链B的桥接合约上进行。这时，提案状态将从“未激活”变为“已激活”。
  - 中继器必须就提案进行投票。每当中继器投票时，桥接合约就会发出事件消息，更新提案状态。一旦达到预定义的阀值（票数需达到一定数量才可执行交易），提案状态就会从“已激活”变为“已通过”。中继器将通过桥接合约在链B上执行该提案。
  - 经过几次检查后，转接桥将通过链B的处理程序合约在目标合约中执行提案，并同时发出另一个事件消息，将提案状态从“已通过”变为“已执行”。

工作流程整体示意图如下所示：

![ChainBridge Moonbeam diagram](/images/builders/integrations/bridges/eth/chainbridge/chainbridge-diagram.png)

在转接桥两端的目标合约通过一系列的注册进行连接，注册通过桥接合约在相应的处理程序合约中进行。目前，只有桥接合约管理员可以进行注册。

### 一般定义 {: #general-definitions } 

以下是ChainBridge从链A到链B的工作流程中所涉及到的一些概念定义：

 - **ChainBridge Chain ID** – 与网络Chain ID不同，它是ChainBridge协议在不同链上使用的独特网络标识符，与网络本身的Chain ID不同。例如，Moonbase Alpha 和Rinkeby的ChainBridge Chain ID分别是43和4（Kovan的ChainBridge Chain ID为42）
 - **Resource ID** – 由32个字节组成，用于在跨链环境中给各种资产提供唯一的标识。其中一个字节是资产的Chain ID，剩下31字节用于在ChainBridge中表示该资产，反映资产以及所在链信息。例如，通过Resource ID，可以表示链A上的代币X就是链B上的代币Y
 - **Calldata** - 处理合约所需参数，包含在链B执行提案的必要信息。具体的序列化将由处理合约进行定义。更多详情，请见[这里](https://chainbridge.chainsafe.io/chains/ethereum/#erc20-erc721-handlers)

## 使用ChainBridge部署Moonbase Alpha {: #try-it-on-moonbase-alpha } 

我们通过部署ChainBridge创建了一个中继器，两端分别与Moonbase Alpha测试网和以太坊Rinkeby、Kovan测试网相连。

ChainSafe为ERC-20和ERC-721接口[预先编写好了处理合约程序](https://chainbridge.chainsafe.io/chains/ethereum/#handler-contracts)，能够实现不同链之间ERC-20和ERC-721代币的转移。更多详情请见[这里](https://chainbridge.chainsafe.io/chains/ethereum/#handler-contracts)。通过这种做法，我们将上述一般工作流程的范围进行了限定，使得处理合约仅执行某些特定代币功能，如_锁定/销毁_和_铸造/解锁_等。

本教程将通过两个不同示例来讲解如何通过桥在链间进行代币转移。首先，需铸造ERC-20S和ERC-721 Moon代币，并通过Moonbase Alpha到Kovan的桥进行代币转移。可遵循相同的步骤并将其应用于Rinkeby。要连接到Moonbase Alpha 和Rinkeby/Kovan测试网，您需要以下信息：

```
# Kovan/Rinkeby - Moonbase Alpha bridge contract address:
    {{ networks.moonbase.chainbridge.bridge_address }}

 # Kovan/Rinkeby - Moonbase Alpha ERC-20 handler contract:
    {{ networks.moonbase.chainbridge.ERC20_handler }}
   
# Kovan/Rinkeby - Moonbase Alpha ERC-721 handler contract:
    {{ networks.moonbase.chainbridge.ERC721_handler }}
```

!!! 注意事项
    上述桥接合约、ERC-20处理程序合约和ERC-721处理程序合约地址均适用于Kovan和Rinkeby。

### 进行ERC-20代币转移 {: #erc-20-token-transfer } 

ERC-20代币需要先通过中继器在处理程序合约上进行注册，才能通过转接桥进行转移。因桥接功能测试所需，我们部署了一枚ERC-20代币（ERC20S），所有用户都可以铸造5枚代币：

```
# Kovan/Rinkeby - Moonbase Alpha custom ERC-20 sample token:
    {{ networks.moonbase.chainbridge.ERC20S }}
```

同样地，直接使用桥接合约、输入正确参数调用`deposit()`的工作量很大。为简化过程，我们对桥接合约进行了修改，在`deposit()`中提前输入了必要参数：

```
# Kovan/Rinkeby - Moonbase Alpha custom bridge contract:
    {{ networks.moonbase.chainbridge.bridge_address }}
```


简单来说，在这个示例中，我们修改了用于发起交易的合约，提前定义好了_chainID_和_resourceID_。用户只需输入接收地址和发送的资产数量，*calldata*对象将自动生成。

本示例的一般工作流程示意图如下所示：

![ChainBridge ERC-20 workflow](/images/builders/integrations/bridges/eth/chainbridge/chainbridge-erc20.png)

无论代币转移方向如何，想要通过示例ERC-20代币尝试桥接功能，还需要完成以下步骤：

 - 在源链上铸造代币（源链处理程序合约将获得这些代币的使用权）
 - 使用源链上经过修改的桥接合约发送代币
 - 等待过程完成
 - 目标链处理程序合约将获得代币的使用权并返还代币
 - 使用目标链上经过修改的桥接合约发送代币

!!! 注意事项
    处理程序合约代表所有者需有足够限额才能进行代币转移。若转移失败，请检查限额。

下面尝试将ERC-20S代币从**Moonbase Alpha** 转移到**Kovan**。我们将使用[Remix](/integrations/remix/)完成这一任务。首先，我们可以调用以下合约接口铸造代币：

```solidity
pragma solidity ^0.8.1;

/**
    Interface for the Custom ERC-20 Token contract for ChainBridge implementation
    Kovan/Rinkeby - Moonbase Alpha ERC-20 Address : 
        {{ networks.moonbase.chainbridge.ERC20S }}
*/

interface ICustomERC20 {

    // Mint 5 ERC-20S Tokens
    function mintTokens() external;

    // Get Token Name
    function name() external view returns (string memory);
    
    /** 
        Increase allowance to Handler
        Kovan/Rinkeby - Moonbase Alpha ERC-20 Handler:
           {{ networks.moonbase.chainbridge.ERC20_handler}}
    */
    function increaseAllowance(address spender, uint256 addedValue) external returns (bool);
    
    // Get allowance
    function allowance(address owner, address spender) external view returns (uint256);
}
```

请注意，ERC-20代币合约的铸造函数也经过了修改，以允许相应处理程序合约对这些代币的使用权。

将自定义ERC-20合同添加到Remix并进行编译后，创建ERC-20S代币：

1. 跳转至Remix的**Deploy & Run Transactions**页面
2. 从**Environment**下拉列表中选择Injected Web3
3. 加载自定义ERC-20代币合约地址，然后点击**At Address**
4. 调用`mintTokens()`函数并进行交易签名
5. 交易确认后，即可收到5枚ERC-20S代币。将代币转入[MetaMask](/integrations/wallets/metamask/)，即可查看余额

![ChainBridge ERC-20 mint Tokens](/images/builders/integrations/bridges/eth/chainbridge/chainbridge-1.png)

接收到代币后，就可以进行后续步骤，通过转接桥将代币发送到目标链上。在这一示例中，代币将从**Moonbase Alpha**发送到**Kovan**。将会有一个单一接口，可用于传输ERC-20S和ERC-721M代币。在此示例中，将通过以下接口合约使用`sendERC20SToken()`发起已铸造的ERC-20S代币交易：

```solidity
pragma solidity 0.8.1;

/**
    Simple Interface to interact with bridge to transfer the ERC-20S and ERC-721M tokens
    Kovan/Rinkeby - Moonbase Alpha Bridge Address: 
        {{ networks.moonbase.chainbridge.bridge_address }}
 */

interface IBridge {

    /**
     * Calls the `deposit` function of the Chainbridge Bridge contract for the custom ERC-20 (ERC-20Sample) 
     * by building the requested bytes object from: the recipient, the specified amount and the destination
     * chainId.
     * @notice Use the destination `eth_chainId`.
     */
    function sendERC20SToken(uint256 destinationChainID, address recipient, uint256 amount) external;
    
    /**
     * Calls the `deposit` function for the custom ERC-721 (ERC-721Moon) that is only mintable in the
     * MOON side of the bridge. It builds the bytes object requested by the method from: the recipient,
     * the specified token ID and the destination chainId.
     * @notice Use the destination `eth_chainId`.
     */
    function sendERC721MoonToken(uint256 destinationChainID, address recipient, uint256 tokenId) external;
}
```

将桥接合约添加至Remix并进行编译后，您需要完成以下步骤方可通过桥以发送ERC20代币：

1. 加载桥接合约地址并点击**At Address**
2. 调用`sendERC20SToken()`函数，输入目标Chain ID（在这一示例中为Kovan: `42`）
3. 在桥的另一侧输入接收地址
4. 输入需要转移的WEI数量
5. 点击**transact**，随后MetaMask将弹出窗口以要求签名确认交易

交易确认后，Kovan相应地址将收到转移过来的代币。整个过程需要3分钟左右。

![ChainBridge ERC-20 send Tokens](/images/builders/integrations/bridges/eth/chainbridge/chainbridge-2.png)

将代币转入[MetaMask](/integrations/wallets/metamask/)并连接到目标链（在这一示例中为Kovan）即可查看余额。

![ChainBridge ERC-20 balance](/images/builders/integrations/bridges/eth/chainbridge/chainbridge-3.png)

你也可以在Kovan上铸造ERC-20S代币并将其转移至Moonbase Alpha。可以使用接口合约提供的`increaseAllowance()`进行使用许可或提高限额。通过使用接口合约中的`allowance()`，可以在ERC-20代币合约中查看处理程序合约的限额。

!!! 注意事项
    处理程序合约代表所有者需有足够限额才能进行代币转移。若转移失败，请检查限额。

### 进行ERC-721代币转移 {: #erc-721-token-transfer } 

和上一个示例相似，ERC-721代币合约也需要经过中继器注册才能使用转接桥进行转移。为此，我们创建了一个定制化的ERC-721代币合约，让所有用户都可以铸造代币，用于进行桥接功能的测试。然而，由于每个代币是非同质化且独一无二的，只能在源链代币合约上铸造，无法在目标合约上铸造。因此，我们需要一对ERC-721合约地址才能实现Rinkeby/Kovan和Moonbase Alpha之间两个方向的代币转移。下面是本示例的工作流程示意图，重点需要注意的是代币ID和元数据。

![ChainBridge ERC-721 workflow](/images/builders/integrations/bridges/eth/chainbridge/chainbridge-erc721.png)

在Moonbase Alpha上铸造代币（名称：ERC-721Moon，代号：ERC-721M）并在Moonbase Alpha和Rinkeby/Kovan之间进行代币转移，需要以下地址信息：

```
# Kovan/Rinkeby - Moonbase Alpha ERC-721 Moon tokens (ERC-721M),
# Mint function in Moonbase Alpha: 
    {{ networks.moonbase.chainbridge.ERC721M }}
```

这次，我们对桥接合约进行了修改，简化了使用过程，不需要与桥接合约进行交互，也不需要调用`deposit()`（地址与上一示例相同）：

```
# Kovan/Rinkeby - Moonbase Alpha custom bridge contract:
    {{ networks.moonbase.chainbridge.bridge_address }}
```

简单来说，在这个示例中，我们修改了用于发起交易的桥接合约，提前定义好了_chainID_和_resourceID_。用户只需输入接收地址和代币ID，*calldata*对象将自动生成。

下面尝试将ERC-721M代币从**Kovan** 转移到**Moonbase Alpha**。我们将使用[Remix](/integrations/remix/)完成这一任务。首先，我们可以使用以下接口连接到源链ERC-721合约，并铸造代币。`tokenOfOwnerByIndex()`也可以用来检查特定地址持有的代币ID，并传递地址信息和索引到报价请求（每个代币ID作为与地址相关的阵列元素进行储存）：

```solidity
pragma solidity ^0.8.1;

/**
    Interface for the Custom ERC-721 Token contract for ChainBridge implementation:
    Kovan/Rinkeby - Moonbase Alpha:
        ERC-721Moon: {{ networks.moonbase.chainbridge.ERC721M }}

    ERC-721Moon tokens are only mintable on Moonbase Alpha
*/

interface ICustomERC721 {
    
    // Mint 1 ERC-721 Token
    function mintToken() external returns (uint256);
    
    // Query tokens owned by Owner
    function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256);

    // Get Token Name
    function name() external view returns (string memory);
    
    // Get Token URI
    function tokenURI(uint256 tokenId) external view returns (string memory);
    
    /**
        Set Approval for Handler 
        Kovan/Rinkeby - Moonbase Alpha ERC-721 Handler:
           {{ networks.moonbase.chainbridge.ERC721_handler }}
    */
    function approve(address to, uint256 tokenId) external;
    
    // Check the address approved for a specific token ID
    function getApproved(uint256 tokenId) external view returns (address);
}
```

请注意，ERC-721代币合约的铸造函数也经过了修改，以允许相应处理程序合约对这些代币的使用权。

将合约添加至Remix并进行编译后，我们要铸造一个ERC-721M代币：

1. 跳转至Remix的**Deploy & Run Transactions**页面
2. 从**Environment**下拉列表中选择Injected Web3
3. 加载自定义ERC-721M代币合约地址，然后点击**At Address**
4. 调用`mintTokens()`函数并进行交易签名
5. 交易确认后，即可收到1枚ERC-721M代币。将代币转入[MetaMask](/integrations/wallets/metamask/)，即可查看余额

![ChainBridge ERC-721 mint Tokens](/images/builders/integrations/bridges/eth/chainbridge/chainbridge-4.png) 

可以通过以下接口合约使用`sendERC721MoonToken()`函数发起交易，将最初铸造的代币（ERC-721E）转移到Moonbase Alpha。

```solidity
pragma solidity 0.8.1;

/**
    Simple Interface to interact with bridge to transfer the ERC-20S and ERC-721M tokens
    Kovan/Rinkeby - Moonbase Alpha Bridge Address: 
        {{ networks.moonbase.chainbridge.bridge_address }}
 */

interface IBridge {

    /**
     * Calls the `deposit` function of the Chainbridge Bridge contract for the custom ERC-20 (ERC-20Sample) 
     * by building the requested bytes object from: the recipient, the specified amount and the destination
     * chainId.
     * @notice Use the destination `eth_chainId`.
     */
    function sendERC20SToken(uint256 destinationChainID, address recipient, uint256 amount) external;
    
    /**
     * Calls the `deposit` function for the custom ERC-721 (ERC-721Moon) that is only mintable in the
     * MOON side of the bridge. It builds the bytes object requested by the method from: the recipient,
     * the specified token ID and the destination chainId.
     * @notice Use the destination `eth_chainId`.
     */
    function sendERC721MoonToken(uint256 destinationChainID, address recipient, uint256 tokenId) external;
}
```

现在，您可以继续通过转接桥将ERC-721M代币发送到目标链上。在这一示例中，代币将从Moonbase Alpha发送到Kovan。通过转接桥转移ERC-721M代币，需执行以下操作：

1. 加载桥接合约地址并点击**At Address**
2. 调用`sendERC721MoonToken()`函数发起交易，将最初在Moonbase Alpha铸造的ERC-721M代币转移至目标链（在这一示例中为Kovan: `42`）
3. 在桥的另一侧输入接收地址
4. 输入需要转移的代币ID
5. 点击**transact**，随后MetaMask将弹出窗口以要求签名确认交易

交易确认后，Kovan相应地址将收到转移过来的代币ID。整个过程需要3分钟左右。

![ChainBridge ERC-721 send Token](/images/builders/integrations/bridges/eth/chainbridge/chainbridge-5.png)

将代币加入[MetaMask](/integrations/wallets/metamask/)并连接到目标链（在这一示例中为Kovan）即可查看余额。

![ChainBridge ERC-721 balance](/images/builders/integrations/bridges/eth/chainbridge/chainbridge-6.png)

请注意，仅可在Moonbase Alpha上铸造ERC-721M代币并转移至Kovan或Rinkey。请一定要先在ERC-721代币合约中查看处理程序合约的限额。可以使用接口合约提供的`approve()`许可处理程序合约发送代币。通过`getApproved()`可以查看每个代币ID的许可情况。

!!! 注意事项
    处理程序合约只有在获得所有者许可的前提下才能代表所有者进行代币转移。若转移失败，请检查许可情况。

### 一般处理程序 {: #generic-handler } 

与一般工作流程相似，一般处理程序可以在链A执行某个函数的同时创建在链B执行另一函数的提案。这为实现两个独立区块链之间的连接提供了极具吸引力的解决方案。

一般处理程序地址为：
```
{{ networks.moonbase.chainbridge.generic_handler }}
```

如果你有兴趣部署这一功能，可以直接通过我们的[Discord server](https://discord.com/invite/PfpUATX)联系我们。我们非常乐意商讨部署事宜。

### Moonbase Alpha ChainBridge用户界面 {: #moonbase-alpha-chainbridge-ui } 

使用[Moonbase Alpha ChainBridge用户界面](https://moonbase-chainbridge.netlify.app/)，无需设置Remix合约即可体验将ERC-20S代币从Moonbase Alpha转移到Kovan或Rinkeby的操作过程。

--8<-- 'text/disclaimers/third-party-content.md'