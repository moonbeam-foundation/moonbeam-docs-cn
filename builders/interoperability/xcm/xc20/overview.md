---
title: XC-20和跨链资产
description: 学习如何使用预编译的资产Solidity合约通过ERC-20接口与Moonbeam上的跨链Token交互。
---

# XC-20概况

## 概览 {: #introduction }

[跨共识信息格式（XCM）](https://wiki.polkadot.network/docs/learn-crosschain){target=_blank}定义了两条互操作的区块链之间传递信息的方式。此格式为Moonbeam/Moonriver与中继链或是其他波卡/Kusama生态内平行链之间打开了传递信息和资产的大门。

Substrate资产具有原生可互操作性。然而，开发者需要使用Substrate API与其交互。而这使开发者的体验感降低，尤其是来自以太坊生态的开发者。因此，为了协助开发者上手波卡和Kusama提供的原生互操作性，Moonbeam引入了XC-20概念。

XC-20为Moonbeam上独特的资产类别，其结合了Substrate资产的优点（原生可互操作性）但又使开发者能够通过预编译合约（以太坊API）使用熟悉的[ERC-20接口](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank}与之交互。除此之外，开发者能够使用常用以太坊开发框架或dApp集成XC-20资产。

![Moonbeam XC-20 XCM Integration With Polkadot](/images/builders/interoperability/xcm/overview/overview-4.png)

## XC-20类型 {: #types-of-xc-20s }

目前有两种XC-20类型：[外部XC-20](/builders/interoperability/xcm/xc20/xc20){target=_blank}和[可铸造XC-20](/builders/interoperability/xcm/xc20/mintable-xc20){target=_blank}。

外部XC-20是从其他平行链或中继链转移到Moonbeam的原生跨链资产。因此，实际的Token存在于每条链的Moonbeam主权账户中。所有的外部XC-20资产使用_xc_作为其名称的前缀与其他资产类别进行区分。

可铸造XC-20也是跨链资产，但其可以直接在Moonbeam上铸造和销毁，也可以转移至其他平行链。由于可铸造XC-20是在Moonbeam上创建，不是其他平行链或中继链的原生资产，因此资产的名称、符号和小数点都是完全可配置的。正是如此，无需在这类资产的名称或符号前加_xc_作为前缀。

两种XC-20类型的核心都是Substrate资产，在底层通过Substrate API进行交互。然而，Moonbeam提供了ERC-20接口与这些资产进行交互，因此无需Substrate基本知识也可直接操作。从用户角度来看，两种类型的XC-20都以相同的方式进行交互，唯一的区别在于可铸造XC-20包含了ERC-20接口的扩展，具有一些管理资产的额外功能，例如制造和销毁。

XC-20的跨链转移是通过[X-Tokens pallet](/builders/interoperability/xcm/xc20/xtokens/){target=_blank}来完成的。转移外部XC-20资产和可铸造XC-20资产的操作说明根据特定资产的多位置会有些许不同。

## XC-20与ERC-20 {: #xc-20-vs-erc-20 }

尽管XC-20和ERC-20有很多相似之处，但仍需要注意两者之间的差异。

首先，XC-20是基于Substrate的资产，因此，它们也受到治理等Substrate功能的直接影响。此外，通过Substrate API完成的XC-20交易不会在基于EVM的区块浏览器中可见，例如[Moonscan](https://moonscan.io){target=_blank}。只有通过以太坊API完成的交易才能通过此类浏览器看到。

尽管如此，XC-20可以通过ERC-20接口进行交互，因此它们具有可以从Substrate和Ethereum API交互的特性。这为开发者在使用这类资产时提供了更大的灵活性，并允许与基于EVM的智能合约（如DEX、借贷平台等）无缝集成。

## ERC-20接口 {: #the-erc20-interface }

Moonbeam上的[ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank}接口遵循[EIP-20 Token标准](https://eips.ethereum.org/EIPS/eip-20){target=_blank}，这是智能合约中Token的标准API接口。此标准定义了一个Token合约必须实现与应用程序互操作所需的函数和动作。

--8<-- 'text/erc20-interface/erc20-interface.md'

可铸造XC-20还包括仅允许Token合约或指定账户的所有者调用的附加功能。请查看[Mintable XC-20](/builders/interoperability/xcm/xc20/mintable-xc20){target=_blank}页面获取关于附加功能和可用指定角色的更多信息。

## ERC-20 Permit接口 {: #the-erc20-permit-interface }

Moonbeam上的[Permit.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank}接口遵循[EIP-2612标准](https://eips.ethereum.org/EIPS/eip-2612){target=_blank}，使用`permit`函数扩展了ERC-20接口。Permit是可用于更改帐户的ERC-20限额的签名消息。

标准的ERC-20 `approve`函数在其设计中受到限制，因为`allowance`仅能由交易的发送者`msg.sender`进行修改。您可在[OpenZeppelin的ERC-20接口的实现](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol#L136){target=_blank}中找到，通过[`msgSender`函数](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Context.sol#L17){target=_blank}设置`owner`，最终将其设置为`msg.sender`。

用户可以签署信息而非签署`approve`交易，该签名可以用于调用`permit`函数以修改`allowance`。如此一来，仅需少量gas即可进行Token转移。另外，用户也无需发送两次交易来批准和转移Token。关于`permit`函数的示例，请查看[OpenZeppelin的ERC-20 Permit扩展的实现](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L41){target=_blank}。

The [Permit.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank}接口包含以下函数：

- **permit**(*address* owner, *address* spender, *uint256*, value, *uint256*, deadline, *uint8* v, *bytes32* r, *bytes32* s) —— 任何人均可调用批准permit
- **nonces**(*address* owner) —— 反馈给定所有者当前的nonce
- **DOMAIN_SEPARATOR**() —— 返回用于避免重放攻击的EIP-712域分隔符。这遵循[EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=_blank}实现

**DOMAIN_SEPARATOR()**是在[EIP-712标准](https://eips.ethereum.org/EIPS/eip-712){target=_blank}中定义，计算如下：

```
keccak256(PERMIT_DOMAIN, name, version, chain_id, address)
```

哈希的参数可以分解为：

 - **PERMIT_DOMAIN** —— `EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)`的`keccak256`
 - **name** —— 一种Token名称，但包含以下注意事项：
     - 如果Token的定义了名称，则域名的**name**为`XC20: <name>`，其中`<name>`是Token名称
     - 如果Token的未定义名称，则域名的**name**为`XC20: No name`
 - **version** —— 签名域的版本，在本示例中，**version**设置为 `1`
 - **chainId** —— 网络的chain ID
 - **verifyingContract** —— XC-20地址

!!! 注意事项
    在之前的Runtime 1600升级中，**name**字段未遵循标准的[EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=_blank}实现。

域分隔符的计算可以在[Moonbeam的EIP-2612](https://github.com/PureStake/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L130-L154){target=_blank}实现中看到，在[OpenZeppelin的`EIP712`合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L70-L84){target=_blank}中显示了一个实际的示例。

除了域分隔符，[`hashStruct`](https://eips.ethereum.org/EIPS/eip-712#definition-of-hashstruct){target=_blank}保证签名只能用于给定函数参数的`permit`函数。这使用了一个给定数值确保签名不会受到重放攻击。哈希结构的计算可以在[Moonbeam的EIP-2612](https://github.com/PureStake/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L167-L175){target=_blank}实现中看到，在[OpenZeppelin的`ERC20Permit`合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L52){target=_blank}中显示了一个实际的示例。

域分隔符和哈希结构可以用于构建[最终哈希](https://github.com/PureStake/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L177-L181){target=_blank}的完全编码消息。在[OpenZeppelin的`EIP712`合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L101){target=_blank}中显示了一个实际的示例。

使用最终哈希以及`v`、`r`和`s`数值，通过[ECRECOVER预编译](/builders/build/canonical-contracts/precompiles/eth-mainnet/#verify-signatures-with-ecrecover){target=_blank}可以验证和恢复签名。如果验证成功，nonce和限额将会更新。

## 使用Remix与预编译交互 {: #interact-with-the-precompile-using-remix }

无论是外部资产还是铸造资产，其交互的方式是一样的。但是，如果您是可铸造Token合约或具有特定功能的指定账户的所有者，还有一些额外的函数可供您交互。更多信息，请查看Mintable XC-20页面的[与可铸造XC-20特定函数交互](/builders/interoperability/xcm/xc20/mintable-xc20/#interact-with-the-precompile-using-remix){target=_blank}部分。

### 查看先决条件 {: #checking-prerequisites }

要通过XC-20预编译批准花费或转移XC-20，您将需要准备以下内容：

- [安装MetaMask并连接至Moonbase Alpha测试网](/tokens/connect/metamask/){target=_blank}
- 在Moonbase Alpha上创建或拥有2个账户
- 至少有一个账户拥有`DEV` Token
--8<-- 'text/faucet/faucet-list-item.md'
- 您想要交互的XC-20预编译地址。计算预编译地址的操作说明会有些许不同，这取决于XC-20资产是迁移至Moonbeam的外部资产或是直接在Moonbeam上铸造
    - [计算外部XC-20预编译地址](/builders/interoperability/xcm/xc20/xc20/#calculate-xc20-address){target=_blank}
    - [计算可铸造XC-20预编译地址](/builders/interoperability/xcm/xc20/mintable-xc20/#calculate-xc20-address){target=_blank}

此教程将涵盖如何与[ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank}接口交互。您可以修改以下操作说明并使用[Permit.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank}接口。

### 添加&编译接口 {: #add-the-interface-to-remix }

您可以使用[Remix](https://remix.ethereum.org/){target=_blank}与XC-20预编译交互，首先您需要将ERC-20接口添加至Remix：

1. 获取[ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank}的复制文档
2. 将文档内容粘贴至名为**IERC20.sol**的Remix文档

![Load the interface in Remix](/images/builders/interoperability/xcm/xc20/overview/overview-1.png)

当您成功在Remix读取ERC-20接口后，您将需要编译：

1. 点击（从上至下的）第二个**Compile**标签
2. 编译**IERC20.sol**文档

![Compiling IERC20.sol](/images/builders/interoperability/xcm/xc20/overview/overview-2.png)

当接口已成功被编译后，您将会在**Compile**标签旁看到绿色的打勾符号。

### 访问预编译 {: #access-the-precompile }

您将使用获得的XC-20预编译地址访问接口，而非部署ERC-20预编译：

1. 在Remix内的**Compile**标签下点击**Deploy and Run**标签。请注意，预编译合约已被部署
2. 确保已在**ENVIRONMENT**下拉菜单中选择**Injected Web3**。当您已经选择**Injected Web3**，MetaMask将会跳出弹窗要求将您的账户连接至Remix
3. 确认**ACCOUNT**下显示的为正确账户
4. 确认已在**CONTRACT**下拉菜单中选择**IERC20 - IERC20.sol**。由于此为预编译合约，您不需要部署任何代码。同时，我们将会在**At Address**字段内显示预编译地址
5. 提供在[计算外部XC-20预编译地址](/builders/interoperability/xcm/xc20/xc20){target=_blank}或[计算可铸造XC-20预编译地址](/builders/interoperability/xcm/xc20/mintable-xc20){target=_blank}操作说明计算得到的XC-20预编译地址。在本示例中为`0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080`，然后点击**At Address**

![Access the address](/images/builders/interoperability/xcm/xc20/overview/overview-3.png)

!!! 注意事项
    如果您希望确保运行顺利，您可以使用您的搜寻引擎查询校验工具以校验您的XC-20预编译地址。当地址校验成功，您可以将其用在**At Address**字段中。

XC-20的**IERC20**预编译将会在**Deployed Contracts**列表下显示。现在您可以使用任何ERC-20函数以获得XC-20的信息或是转移XC-20。

![Interact with the precompile functions](/images/builders/interoperability/xcm/xc20/overview/overview-4.png)

如果您想更深入学习每个函数，您可以查看[ERC-20预编译教程](/builders/build/canonical-contracts/precompiles/erc20/){target=_blank}并加以修改来适用XC-20预编译交互。