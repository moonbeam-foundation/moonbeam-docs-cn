---
title: 与XC-20资产交互
description: 本教程包含所有您需要在注册本地或是外部XC-20资产所需的内容，让您能够通过XCM进行跨链资产转账
---

# 在Moonbeam上与XC-20资产交互

![Interact with XC-20s Banner](/images/builders/interoperability/xcm/xc20/interact/interact-banner.png)

## 概览 {: #introduction }

正如[XC-20资产概览](/builders/interoperability/xcm/xc20/overview){target=_blank}页面中所述，XC-20资产是Moonbeam上的独特资产类别。尽管它们是Substrate原生资产，但它们也具有ERC-20接口，并且可以像任何其他ERC-20资产一般进行交互。此外，ERC-20 Permit接口可用于所有外部XC-20资产。

本教程涵盖XC-20资产的Solidity接口，包含标准ERC-20接口和ERC-20 Permit接口，以及如何使用这些接口与外部XC-20资产交互。

## XC-20资产Solidity接口 {: #xc20s-solidity-interface }

两种XC-20资产类别皆具有标准ERC-20接口。除此之外，所有外部XC-20资产皆拥有ERC-20 Permit接口。以下两个部分教程分别描述了接口的内容。

### ERC-20 Solidity接口 {: #the-erc20-interface }

如同先前提及的，您可以通过一个ERC-20接口与XC-20资产交互。在Moonbeam上的[ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank}接口跟随[EIP-20 Token标准](https://eips.ethereum.org/EIPS/eip-20){target=_blank}，也就是在智能合约中Token的标准API接口。此标准定义了一个Token合约需要能够与不同应用互操作的所需的函数和事件。

--8<-- 'text/erc20-interface/erc20-interface.md'

### ERC-20 Permit Solidity接口 {: #the-erc20-permit-interface }

外部XC-20资产同样拥有ERC-20 Permit接口。在Moonbeam上的[Permit.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank}接口跟随[EIP-2612标准](https://eips.ethereum.org/EIPS/eip-2612){target=_blank}，也就是使用了`permit` 函数拓展ERC-20接口。Permit为能够用于变动一个账户ERC-20余额的签署信息。请注意，本地XC-20资产同样具有Permit接口，但这对他们来说并不是适用于XCM所需的条件。

标准ERC-20 `approve`函数在设计时已被限制，因`allowance`仅能够由交易的传送者修改，也就是`msg.sender`。您能够在[OpenZeppelin的ERC-20接口实现](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol#L136){target=_blank}中查看，其通过[`msgSender`函数](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Context.sol#L17){target=_blank}设置`owner`并最终设置为`msg.sender`。

用户可以签署一条消息，而不是签署`approve`交易，并且该签名可用于调用`permit`函数来修改`allowance`。因此，它允许Gasless Token转账。此外，用户不再需要发送两笔交易来批准和转移Token。要查看`permit`函数的范例，您可以查看[OpenZeppelin对ERC-20 Permit扩展程序的实现](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L41){target=_blank}。

[Permit.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank}包含以下函数：

- **permit**(*address* owner, *address* spender, *uint256*, value, *uint256*, deadline, *uint8* v, *bytes32* r, *bytes32* s) - 使用一个批准permit，任何人皆可以调用
- **nonces**(*address* owner) - 根据给定所有者返回当前随机数
- **DOMAIN_SEPARATOR**() - 返还EIP-712域名分隔器，用于避免重放攻击，其跟随[EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=_blank}实现

**DOMAIN_SEPARATOR()**在[EIP-712标准](https://eips.ethereum.org/EIPS/eip-712){target=_blank}中被定义，并通过以下方式计算：

```text
keccak256(PERMIT_DOMAIN, name, version, chain_id, address)
```

哈希的参数可以被拆解如下：

 - **PERMIT_DOMAIN** - 为`EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)`的`keccak256`
 - **name** - 为Token名称，但根据以下条件更动：
     - 如果该Token已经有定义过的名称，此域名**name**为`XC20: <name>`，其中`<name>`为Token名称
     - 如果该Token并没有定义过的名称，此域名**name**为`XC20: No name`
 - **version** - 签名域名的版本。在此例子中，**version**被设置为`1`
 - **chainId** - 网络的链ID
 - **verifyingContract** - XC-20地址

!!! 注意事项
    在Runtime 1600版本升级前，**name**栏位并不跟随[EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=_blank}实现。

您可以在[Moonbeam的EIP-2612](https://github.com/PureStake/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L167-L175){target=_blank}实现中查看域名分隔器的计算，以及在[OpenZeppelin的`EIP712`合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L70-L84){target=_blank}中查看完整的范例。

除了域名分隔器之外，[`hashStruct`](https://eips.ethereum.org/EIPS/eip-712#definition-of-hashstruct){target=_blank}保证签名只能用于具有给定函数参数的`permit`函数。它使用给定的随机数来确保签名不会受到重放攻击。哈希结构的计算可以参见[Moonbeam的EIP-2612](https://github.com/PureStake/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L167-L175){target=_blank}实现，其中展示了[OpenZeppelin的`ERC20Permit`合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L52){target=_blank}的完整范例。

域名分隔器和哈希结构能够用于构建完全编码消息的[最终哈希](https://github.com/PureStake/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L177-L181){target=_blank}。您可以在[OpenZeppelin的`EIP712`合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L70-L84){target=_blank}查看完整范例。

通过最终哈希和`v`、`r`以及`s`数值，签名将能够被[验证和恢复](https://github.com/PureStake/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L212-L224){target=_blank}。如果成功通过验证，随机数将会增加1且余额将会更新。

## 使用一个ERC-20接口与外部XC-20资产交互 {: #interact-with-the-precompile-using-remix }

本部分教程将会展现该如何使用[Remix](/builders/build/eth-api/dev-env/remix){target=_blank}通过ERC-20接口与XC-20资产交互。因为本地XC-20资产为一般ERC-20资产的表现形式，此部分教程将会专注于外部XC-20资产。

要与外部XC-20资产交互，您需要计算您希望交互的XC-20资产得预编译地址。接着，您可以与ERC-20接口交互，正如与其他ERC-20接口交互一样。

您可以调节此部分教程中针对[Permit.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank}接口的指令。

### 查看先决条件 {: #checking-prerequisites }

要通过ERC-20接口批准一个外部XC-20资产得花费或是转账，您将需要：

- [已安装MetaMask并将其连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}测试网
- 在Moonbase Alpha上创建或拥有两个账户
- 至少一个账户需要拥有`DEV`Token。
 --8<-- 'text/faucet/faucet-list-item.md'

### 计算外部XC-20资产预编译地址 {: #calculate-xc20-address }

在您通过ERC-20接口与一个外部XC-20资产交互之前，您需要通过资产ID生成外部XC-20资产的预编译地址。

外部XC-20资产预编译地址可以通过以下方式计算：

```text
address = '0xFFFFFFFF...' + DecimalToHex(AssetId)
```

根据上述计算，第一步是获取资产ID的*u128*表示形式并将其转换为十六进制值。您可以使用您选择的搜索引擎查找用于将十进制转换为十六进制值的简单工具。对于资产ID`42259045809535163221576417993425387648`，十六进制值为`1FCACBD218EDC0EBA20FC2308C778080`。

外部XC-20资产的预编译仅会落在`0xFFFFFFFF00000000000000000000000000000000`和`0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF`之间。

由于以太坊地址有40个字符长，因此您需要从最初的8个`F`开始，然后在十六进制值前面加上`0`，直到地址有40个字符。

已经计算出的十六进制值有32个字符长，因此在十六进制值前面加上8个`F`将为您提供与XC-20资产预编译交互所需的40个字符的地址。对于此范例来说，完整地址为`0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080`。

现在您已经计算出外部XC-20资产预编译地址，您可以使用该地址与XC-20资产进行交互，就像与Remix中的任何其他ERC-20资产进行交互一样。

### 添加并编译接口 {: #add-the-interface-to-remix }

您现可以使用[Remix](https://remix.ethereum.org/){target=_blank}与ERC-20接口交互。首先，您需要添加接口至Remix：

1. 获得[ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank}的副本
2. 将文件内容贴至名称为**IERC20.sol**的Remix文件中

![Load the interface in Remix](/images/builders/interoperability/xcm/xc20/overview/overview-1.png)

当您已经在Remix中运行ERC-20接口，您将会需要编译它：

1. 在页面上方第二个部分点击**Compile**标签
2. 编译**IERC20.sol**文件

![Compiling IERC20.sol](/images/builders/interoperability/xcm/xc20/overview/overview-2.png)

如果此接口成功的完成编译，您将能够在**Compile**标签看见绿色勾号。

### 访问预编译 {: #access-the-precompile }

您将会访问给定地址的XC-20资产的接口，而非部署的ERC-20预编译：

1. 在Remix中的**Compile**标签下方点击**Deploy and Run**标签。请注意，预编译合约已部署
2. 确保在**ENVIRONMENT**下拉选单中选取**Injected Web3**。当您选取**Injected Web3**，您将会看见MetaMask弹窗提示将您的账户连接至Remix
3. 确保在**ACCOUNT**下方显示为正确的账户
4. 确保在**CONTRACT**下拉选单中选取**IERC20 - IERC20.sol**。由于此为预编译合约，您不需要部署任何代码。相反地，您将会在**At Address**栏位提供预编译地址
5. 提供XC-20的地址。对于本地XC-20资产，您应该已经在[计算外部XC-20预编译地址](#calculate-xc20-address){target=_blank}部分中计算过。在此范例中，您可以使用`0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080`并点击**At Address**

![Access the address](/images/builders/interoperability/xcm/xc20/overview/overview-3.png)

!!! 注意事项
    或者，您可以通过转到您选择的搜索引擎，并搜索对地址进行校验和的工具来对XC-20资产预编译地址进行校对。对地址进行校对后，您可以在**At Address**栏位中中使用它。

XC-20资产的**IERC20**预编译将出现在**Deployed Contracts**列表中。现在您可以随意调用任何标准ERC-20函数来获取有关XC-20资产的信息或转移XC-20资产。

![Interact with the precompile functions](/images/builders/interoperability/xcm/xc20/overview/overview-4.png)

要了解如何与每个功能交互，您可以查看[ERC-20预编译](/builders/pallets-precompiles/precompiles/erc20/){target=_blank}教程并修改它以便与XC-20预编译交互。
