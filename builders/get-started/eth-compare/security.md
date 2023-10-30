---
title: 安全注意事项
description: 以太坊开发者在Moonbeam上进行开发时需要了解的安全注意事项的主要差异。
---

# 安全注意事项

## 概览 {: #introduction }

尽管在以太坊开发时不需要特别关注一些安全事项，但在Moonbeam上开发智能合约时，需要特别注意一些。Moonbeam有几个[预编译合约](/builders/pallets-precompiles/precompiles/){target=_blank}，这些是能通过以太坊API来帮助开发者绕过EVM获得基于Substrate的功能的Solidity接口。虽然这些预编译合约旨在改善开发者体验，使用者必须要注意一些可能存在的意外后果。

本教程将概述并举例一些在Moonbeam开发时应当注意的一些安全事项。

## 任意代码执行 {: #arbitrary-code-execution }

在Solidity中，任意代码执行指的是通过使用任何类型参数的任意数量，来执行代码和调用其他合约的函数的能力。

当一个智能合约允许用户影响其自己的`call()`并传入任何调用数据和/或`call()`目标时，该智能合约便允许任意执行另一个合约。[`call()` 函数](https://solidity-by-example.org/call/){target=_blank}可以通过Solidity中的[address data type in Solidity](https://docs.soliditylang.org/en/latest/types.html#address){target=_blank}使用。当`call()`函数被调用时，目标合约将通过任意调用数据被调用。

当**合约A**允许一名用户影响其对**合约B**的调用时，任意代码执行将遵循下图所示的样式。

![Arbitrary code execution](/images/builders/get-started/eth-compare/security/security-1.png)

正如之前所述，在Moonbeam上任意执行代码的一个主要问题是Moonbeam有一些可以被调用的预编译合约，这些合约可以用来绕过以太坊上通常有的一些保护措施。为了在Moonbeam上安全使用任意代码执行，您应该注意**仅适用于允许任意代码执行的合约的以下几点**：

- 例如Native ERC-20预编译、XC-20预编译，和XCM相关的预编译等等的Moonbeam[预编译合约](/builders/pallets-precompiles/precompiles/){target=_blank}允许用户在无需访问EVM的情况下也能管理和转移资产。然而，这些操作是通过原生Substrate代码完成的。所以，如果您的合约有原生Token或是XC-20并且允许任意代码执行的话，这些预编译可以绕过一般在EVM执行的安全检查，而用来盗窃合约内的余额
- 在使用`call()`函数时将交易对象的值属性设定为固定额度（例如`call{value: 0}(...)`），这一步可以通过调用原生资产预编译以及在编码的调用数据中指定要转移的金额来绕过
- 允许使用的合约的用户传入会在目标合约上执行任何函数的任意调用数据，特别是如果目标合约为预编译，是**不**安全的。为安全起见，您可以将您想要允许被执行的安全函数的函数选择器进行硬编码
- 在执行任意调用数据的函数中将目标合约（包括预编译）列入黑名单也**不**认为是安全的，因为其他预编译可能会在未来被添加。在执行任意调用数据的函数中提供目标合约白名单可以认为是安全的，前提是被调用的合约不是预编译，或者如果是预编译，进行调用的合约不持有任何原生Token或XC-20

在下面的章节中，您将通过示例了解每一个安全注意事项。

### 预编译可以覆盖设置值 {: #setting-a-value }

在以太坊上，一个允许任意代码执行的智能合约可以将一个调用的值强制设置为一个特定额（例如，`{value: 0}`），以确保只有这个额度的原生货币会在该交易中发送。然而在Moonbeam上，[原生ERC-20预编译合约](/builders/pallets-precompiles/precompiles/erc20){target=_blank}允许您通过Substrate API与Moonbeam上的原生货币以ERC-20形式进行交互。因此，您可以通过设置调用的`value`或是通过原生ERC-20预编译来从一个智能合约中转移Moonbeam原生资产。如果您设置了任意调用的`value`，它可以通过把[原生ERC-20预编译合约](/builders/pallets-precompiles/precompiles/erc20){target=_blank}作为目标并传入调用数据以转移原生资产来覆盖。因为ERC-20和XC-20不是原生资产，设置值属性不会为在以太坊或Moonbeam上的这些资产提供任何保护。

例如，如果您有一个允许任意代码执行的合约，且您向该合约传递编码的调用数据，将合约的余额转移至另一个地址，您基本上可以把这个合约的余额全部拿走。

若要获得编码的调用数据，您可以使用[Solidity文档中罗列的任何一个ABI编码函数 ](https://docs.soliditylang.org/en/latest/units-and-global-variables.html#abi-encoding-and-decoding-functions){target=_blank}，包括下列函数所示的`abi.encodeWithSelector`：

```solidity
function getBytes(address _erc20Contract, address _arbitraryCallContract, address _to) public view returns (bytes memory) {
    // Load ERC-20 interface of contract
    IERC20 erc20 = IERC20(_erc20Contract);
    // Get amount to transfer
    uint256 amount = erc20.balanceOf(_arbitraryCallContract);
    // Build the encoded call data
    return abi.encodeWithSelector(IERC20.transfer.selector, _to, amount);
}
```

获得编码的调用数据后，您就可以对[原生ERC-20预编译合约](/builders/pallets-precompiles/precompiles/erc20){target=_blank}进行任意调用，将调用值设置为`0`，并以字节单位传递调用数据：

```solidity
function makeArbitraryCall(address _target, bytes calldata _bytes) public {
    // Value: 0 does not protect against native ERC-20 precompile calls or XCM precompiles
    (bool success,) = _target.call{value: 0}(_bytes);
    require(success);
}
```

在编码的调用数据中，`0`的值会被指定的转移额度覆盖，在本示例中为合约的余额。

### 将安全的函数选择器列入白名单 {: #whitelisting-function-selectors }

通过把特定函数选择器列入白名单，您可以控制哪些函数可以被执行，并确保只有被认为是安全且不会调用预编译的函数允许被调用。

若要将函数选择器列入白名单，您可以对函数的签名进行[keccack256 hash](https://emn178.github.io/online-tools/keccak_256.html){target=_blank}处理。

当您完成将函数选择器列入白名单后，您可以使用内联汇编来从编码的调用数据中获得函数选择器，并使用[require函数](https://docs.soliditylang.org/en/v0.8.17/control-structures.html#panic-via-assert-and-error-via-require){target=_blank}进行比较。如果从编码的调用数据中获得的函数选择器与列入白名单的函数选择器相匹配，您就可以进行调用。否则将会异常。

```solidity
function makeArbitraryCall(address _target, bytes calldata _bytes) public {
    // Get the function selector from the encoded call data
    bytes4 selector;
    assembly {
        selector := calldataload(_bytes.offset)
    }

    // Ensure the call data calls an approved and safe function
    require(selector == INSERT_WHITELISTED_FUNCTION_SELECTOR);

    // Arbitrary call
    (bool success,) = _target.call(_bytes);
    require(success);
}
```

### 将安全合约列入白名单 {: #whitelisting-safe-contracts}

通过在可以执行任意调用数据的函数中，将特定目标合约地址列入白名单，您可以确保该调用是安全的，因为EVM将强制执行只能调用列入白名单的合约。这假设了被调用的合约不是预编译。如果是预编译，您最好确保进行调用的合约不持有原生Token或XC-20。

从任意代码执行将合约列入黑名单不认为是安全的，因为其他预编译可能会在未来被添加。

若要把一个合约列入白名单，您可以使用[require函数](https://docs.soliditylang.org/en/v0.8.17/control-structures.html#panic-via-assert-and-error-via-require){target=_blank}，该函数将把目标合约地址与列入白名单的合约地址进行比较。如果地址相匹配，该调用则可以被执行。否则将会异常。

```solidity
function makeArbitraryCall(address _target, bytes calldata _bytes) public {
    // Ensure the contract address is safe
    require(_target == INSERT_CONTRACT_ADDRESS);

    // Arbitrary call
    (bool success,) = _target.call(_bytes);
    require(success);
}
```

## 预编译可以绕过发送人（Sender）与来源（Origin）检查 {: #bypass-sender-origin-checks }

交易来源（`tx.origin`）是交易起源的外部账户 (EOA) 的地址。而`msg.sender`是发起当前调用的地址。`msg.sender`可以是一个EOA或一个合约。 如果一个合约调用另一个合约，而不是直接从EOA调用合约，这两者可以是不同的值。 在这种情况下，`msg.sender`将是调用合约，`tx.origin`将是最初调用调用合约的EOA。

例如，如果Alice调用合约A中的函数，然后这个函数再调用合约B中的函数，当查看对合约B的调用时，`tx.origin`是Alice，`msg.sender`是合约A。

!!! 注意事项
    [最佳做法](https://consensys.github.io/smart-contract-best-practices/development-recommendations/solidity-specific/tx-origin/){target=_blank}是，`tx.origin`不应该用于授权。相反，您应该使用`msg.sender`。

您可以使用[require 函数](https://docs.soliditylang.org/en/v0.8.17/control-structures.html#panic-via-assert-and-error-via-require){target=_blank}比较`tx.origin`和`msg.sender`。如果它们是相同的地址，则确保只有EOA可以调用该函数。如果`msg.sender`是合约地址，将抛出异常。

```solidity
function transferFunds(address payable _target) payable public {
    require(tx.origin == msg.sender);
    _target.call{value: msg.value};
}
```

在以太坊上，您可以使用此检查来确保给定的合约函数只能由EOA调用一次。这是因为在以太坊上，EOA每次交易只能与合约交互一次。然而，在Moonbeam上**情况并非如此**，因为EOA通过使用预编译合约可以一次性与合约多次交互，例如[batch](/builders/pallets-precompiles/precompiles/batch){target =_blank}和[call permit](/builders/pallets-precompiles/precompiles/call-permit){target=_blank}预编译。

通过batch（批量）预编译，用户可以原子地对一个合约执行多次调用。批处理函数的调用者将是`msg.sender`和`tx.origin`，一次性启用多个合约交互。

使用call permit（调用许可）预编译，如果用户想在一次交易中多次与合约交互，他们可以通过为每个合约交互签署许可并在单个函数调用中分派所有许可来实现。这只会绕过调度员是否与许可签名者是同一个帐户的`tx.origin == msg.sender`检查。否则，`msg.sender`将成为许可签署者，而`tx.origin`将成为调度员，从而引发异常。

## 可铸造XC-20 vs ERC-20 {: #mintable-xc-20s-vs-erc-20s }

[可铸造XC-20](/builders/interoperability/xcm/xc20/mintable-xc20){target=_blank}是[XC-20](/builders/interoperability/xcm/xc20/overview){target=_blank}的一种形式，它直接在Moonbeam铸造和销毁。与所有XC-20一样，可铸造XC-20是Substrate资产，可以通过预编译合约ERC-20接口与之交互。特别对于可铸造XC-20，ERC-20接口扩展包括了一些[附加功能](/builders/interoperability/xcm/xc20/mintable-xc20/#additional-functions){target=_blank}，例如铸造和销毁token、冻结和解冻token和账户等。此附加功能类似于以太坊中标准ERC-20的扩展，例如[ERC20Mintable](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#ERC20Mintable){target=_blank}、[ERC20Burnable](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#ERC20Burnable){target=_blank}和[ERC20Pausable](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#ERC20Pausable){target=_blank}扩展，**但需要注意的是它们并不完全相同**。

常见的以太坊ERC-20 [`burn`函数](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol#L277-L293){target=_blank}要求从中销毁token的帐户至少具有请求数量的token来销毁。也就是说，如果用户调用该函数试图销毁比他们实际拥有的要更多的token，则调用将失败。

在Substrate中，功能不同，并且不存在该要求。因此，用户可能会在调用该函数时，用到比他们实际持有的token数量大得多的销毁数量，该调用会成功，但只会销毁他们持有的token数量。话虽如此，您将需要使用[require函数](https://docs.soliditylang.org/en/v0.8.17/control-structures.html#panic-via-assert-and-error-via-require){target=_blank}手动要求该账户具有足够token，如下所示：

```solidity
require(mintableERC20.balanceOf(from) >= value, "burn amount exceeds balance")
```

此外，还需要注意的是，对于可铸造XC-20，可以铸造的最大`value`（或总供应量）实际受限于*uint128*，而普通的可铸造ERC-20的总供应量上限为*uint256*。如果总供应量超过2^128（不带小数），可铸造XC-20将表现不同，铸币将因溢出检查而失败。这对于传统token来说不太可能发生，因为它们无意达到如此高的数量，但这很值得一提，因为这与标准的以太坊ERC-20不同。
