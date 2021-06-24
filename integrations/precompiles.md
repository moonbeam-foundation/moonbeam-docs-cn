---
title: 预编译合约
description:  通过此教程学习如何在Moonbeam测试网Moonbase Alpha上使用完全兼容以太坊的预编译合约。
---

# Moonbase Alpha预编译合约

## 概览

[Moonbase Alpha v2](https://moonbeam.network/announcements/moonbase-alpha-v2-contract-events-pub-sub-capabilities/)版本中新增的另外一个功能，就是提供以太坊上的一些原生[预编译合约](https://docs.klaytn.com/smart-contract/precompiled-contracts)。

目前这一功能包括了五个预编译合约：ecrecover、sha256、ripemd-160、恒等函数和模幂运算函数。

在本教程中，我们将介绍这些预编译函数的使用和/或验证方法。

## 查看先决条件

--8<-- 'text/common/install-nodejs.md'

在撰写本教程时，所用版本分别为15.2.1和7.0.8版本。此外，您还需要进行以下指令安装Web3包：

```
npm install --save web3
```

可以通过`ls`指令验证Web3安装版本：

```
npm ls web3
```
在撰写本教程时，所用版本为1.3.0版本。此外，我们还将使用[Remix](/integrations/remix/)，并通过[MetaMask](/integrations/wallets/metamask/)将其连接到Moonbase Alpha测试网。

## 使用ECRECOVER进行签名验证

这一预编译合约的主要功能是验证消息签名。一般来说，将某笔交易的签名值输入到`ecrecover`中，将会返回一个地址，如果该地址与发送该交易的公共地址相同，则签名通过验证。

我们用一个简单的例子来说明如何利用这一预编译合约。我们需要进行签名，然后获取包含这些数值的已签名消息，从而获得交易签名值（v, r, s）：

```solidity
const Web3 = require('web3');

// Provider
const web3 = new Web3('https://rpc.testnet.moonbeam.network');

// Address and Private Key
const address = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const pk1 = '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
const msg = web3.utils.sha3('supercalifragilisticexpialidocious');

async function signMessage(pk) {
   try {
   // Sign and get Signed Message
      const smsg = await web3.eth.accounts.sign(msg, pk);
      console.log(smsg);
   } catch (error) {
      console.error(error);
   }
}

signMessage(pk1);
```

这一代码将在终端返回以下对象：

```js
{
  message: '0xc2ae6711c7a897c75140343cde1cbdba96ebbd756f5914fde5c12fadf002ec97',
  messageHash: '0xc51dac836bc7841a01c4b631fa620904fc8724d7f9f1d3c420f0e02adf229d50',
  v: '0x1b',
  r: '0x44287513919034a471a7dc2b2ed121f95984ae23b20f9637ba8dff471b6719ef',
  s: '0x7d7dc30309a3baffbfd9342b97d0e804092c0aeb5821319aa732bc09146eafb4',
  signature: '0x44287513919034a471a7dc2b2ed121f95984ae23b20f9637ba8dff471b6719ef7d7dc30309a3baffbfd9342b97d0e804092c0aeb5821319aa732bc09146eafb41b'
}
```
有了这些必要数值，我们就可以来到Remix测试预编译合约。请注意，签名验证也可以通过Web3 JS库来实现，但在本示例中，我们会使用Remix，以确保它使用的是区块链上的预编译合约。我们可以使用以下Solidity代码进行签名验证：

```solidity
pragma solidity ^0.7.0;

contract ECRECOVER{
    address addressTest = 0x12Cb274aAD8251C875c0bf6872b67d9983E53fDd;
    bytes32 msgHash = 0xc51dac836bc7841a01c4b631fa620904fc8724d7f9f1d3c420f0e02adf229d50;
    uint8 v = 0x1b;
    bytes32 r = 0x44287513919034a471a7dc2b2ed121f95984ae23b20f9637ba8dff471b6719ef;
    bytes32 s = 0x7d7dc30309a3baffbfd9342b97d0e804092c0aeb5821319aa732bc09146eafb4;
    
    
    function verify() public view returns(bool) {
        // Use ECRECOVER to verify address
        return (ecrecover(msgHash, v, r, s) == (addressTest));
    }
}
```

使用[Remix编译器与部署](/getting-started/local-node/using-remix/)并将[MetaMask指向Moonbase Alpha](/getting-started/moonbase/metamask/)，即可部署合约，并调用`verify()`方法进行验证。如果`ecrecover`返回的地址与消息签名所使用的地址（与密钥相关，需在合约中手动设置）一致，就会返回*true*。

## 使用SHA256函数获取哈希值

向这一函数输入数据可返回其SHA256哈希值。测试这一预编译合约，可以使用此[在线工具](https://md5calc.com/hash/sha256)来计算任何字符串的SHA256哈希值。在本示例中，我们将使用`Hello World!`的哈希值。直接进入Remix并部署以下代码，计算出来的哈希值将在`expectedHash`变量中显示：

```solidity
pragma solidity ^0.7.0;

contract Hash256{
    bytes32 public expectedHash = 0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069;

    function calculateHash() internal pure returns (bytes32) {
        string memory word = 'Hello World!';
        bytes32 hash = sha256(bytes (word));
        
        return hash;        
    }
    
    function checkHash() public view returns(bool) {
        return (calculateHash() == expectedHash);
    }
}

```
合约部署后，就可以调用`checkHash()`方法进行验证。如果`calculateHash()`返回的哈希值与所提供的哈希值一致，即返回*true* 。

## 使用RIPEMD-160函数获取哈希值

向这一函数输入数据可返回其RIPEMD-160哈希值。测试这一预编译合约，可以使用这个[在线工具](https://md5calc.com/hash/ripemd160)来计算任何字符串的RIPEMD-160哈希值。在本示例中，我们仍使用`Hello World!`的哈希值。我们将使用相同的代码，但使用另一个函数：`ripemd160`函数。请注意，这个函数返回的是`bytes20`类型的变量：

```solidity
pragma solidity ^0.7.0;

contract HashRipmd160{
    bytes20 public expectedHash = hex'8476ee4631b9b30ac2754b0ee0c47e161d3f724c';

    function calculateHash() internal pure returns (bytes20) {
        string memory word = 'Hello World!';
        bytes20 hash = ripemd160(bytes (word));
        
        return hash;        
    }
    
    function checkHash() public view returns(bool) {
        return (calculateHash() == expectedHash);
    }
}
```
合约部署后，就可以调用`checkHash()`方法进行验证。如果`calculateHash()`返回的哈希值与所提供的哈希值一致，即返回*true* 。

## 恒等函数

这一函数也被称为“数据复制”函数，是复制内存数据性价比较高的方法。Solidity编译器不支持这一函数，因此需要内联汇编。可以使用[以下代码](https://docs.klaytn.com/smart-contract/precompiled-contracts#address-0x-04-datacopy-data)（经修改已适应Solidity）调用这个预编译合约。我们可以使用此[在线工具](https://web3-type-converter.onbrn.com/)来获取任何字符串的字节码，因为它是`callDataCopy()`方法的输入值。

```solidity
pragma solidity ^0.7.0;

contract Identity{
    
    bytes public memoryStored;

    function callDatacopy(bytes memory data) public returns (bytes memory) {
    bytes memory result = new bytes(data.length);
    assembly {
        let len := mload(data)
        if iszero(call(gas(), 0x04, 0, add(data, 0x20), len, add(result,0x20), len)) {
            invalid()
        }
    }
    
    memoryStored = result;

    return result;
    }
}
```
合约部署后，就可以调用`callDataCopy()`方法来验证`memoryStored`是否与您在函数中所输入的字节码相符。

## 模幂运算函数

我们要介绍的第五个预编译合约主要用于计算整数*b*（基数）乘以*e*次方（指数）并除以一个正整数*m*（除数）后的余数。

Solidity编译器并不支持这一函数，因此需要内联汇编。[以下代码](https://docs.klaytn.com/smart-contract/precompiled-contracts#address-0x05-bigmodexp-base-exp-mod)经过了简化，能更好地呈现这一预编译合约的功能。

```solidity
pragma solidity ^0.7.0;

contract ModularCheck {

    uint public checkResult;

    // Function to Verify ModExp Result
    function verify( uint _base, uint _exp, uint _modulus) public {
        checkResult = modExp(_base, _exp, _modulus);
    }

    function modExp(uint256 _b, uint256 _e, uint256 _m) public returns (uint256 result) {
        assembly {
            // Free memory pointer
            let pointer := mload(0x40)
            // Define length of base, exponent and modulus. 0x20 == 32 bytes
            mstore(pointer, 0x20)
            mstore(add(pointer, 0x20), 0x20)
            mstore(add(pointer, 0x40), 0x20)
            // Define variables base, exponent and modulus
            mstore(add(pointer, 0x60), _b)
            mstore(add(pointer, 0x80), _e)
            mstore(add(pointer, 0xa0), _m)
            // Store the result
            let value := mload(0xc0)
            // Call the precompiled contract 0x05 = bigModExp
            if iszero(call(not(0), 0x05, 0, pointer, 0xc0, value, 0x20)) {
                revert(0, 0)
            }
            result := mload(value)
        }
    }
}
```

您也可以在[Remix](/integrations/remix/)环境中尝试使用这一合约。调用`verify()`函数，输入基数、指数和除数，结果将储存在函数的`checkResult`变量中。
