---
title: 以太坊主网预编译合约
description: 了解如何在Moonbeam上使用以太坊标准预编译合约，例如ECRECOVER、SHA256等。
keywords: 以太坊, moonbeam, ecrecover, sha256, sha3FIPS256, ripemd-160, Bn128Add, Bn128Mul, Bn128Pairing
---

# 在Moonbase Alpha上的以太坊主网预编译合约

## 概览 {: #introduction }

[Moonbase Alpha v2](https://moonbeam.network/blog/moonbase-alpha-v2-contract-events-pub-sub-capabilities/)版本中新增的另外一个功能是提供以太坊上的一些原生[预编译合约](https://docs.klaytn.com/smart-contract/precompiled-contracts)。

目前这一功能包含以下预编译：ecrecover、sha256、sha3FIPS256、ripemd-160、Bn128Add、Bn128Mul、Bn128Pairing、恒等函数和模幂运算函数。

本教程中，我们将介绍如何使用和/或验证这些预编译。

## 查看先决条件 {: #checking-prerequisites }

--8<-- 'text/_common/install-nodejs.md'

撰写本教程时，所用版本分别为15.2.1和7.0.8。另外，我们还将需要通过执行以下命令安装Web3安装包：

```bash
npm install --save web3
```

您需要使用`ls`命令来验证所安装的Web3版本：

```bash
npm ls web3
```

撰写本教程时，所用版本为1.3.0。此外，我们还将使用[Remix](/builders/build/eth-api/dev-env/remix/)，并通过[MetaMask](/tokens/connect/metamask/)将其连接至Moonbase Alpha测试网。

--8<-- 'text/_common/endpoint-examples.md'

## 使用ECRECOVER进行签名验证 {: #verify-signatures-with-ecrecover }

这一预编译的主要功能是验证消息签名。一般来说，将某笔交易的签名值输入到`ecrecover`中，将会返回一个地址，如果该地址与发送该交易的公共地址相同，则签名通过验证。

我们用一个简单的例子来说明如何利用这一预编译功能。我们需要进行签名，然后获取包含这些数值的已签名消息，从而获得交易签名值（v, r, s）：

--8<-- 'code/builders/pallets-precompiles/precompiles/eth-mainnet/ecrecover.md'

这一代码将在终端返回以下对象：

--8<-- 'code/builders/pallets-precompiles/precompiles/eth-mainnet/ecrecoverresult.md'

有了这些必要数值，我们就可以到Remix测试预编译合约。请注意，签名验证也可以通过Web3.js库来实现，但在本示例中，我们将会使用Remix，以确保它使用的是区块链上的预编译合约。我们可以使用以下Solidity代码进行签名验证：

--8<-- 'code/builders/pallets-precompiles/precompiles/eth-mainnet/ecrecoverremix.md'

使用[Remix编译器部署](/builders/build/eth-api/dev-env/remix/)并将[MetaMask连接至Moonbase Alpha](/tokens/connect/metamask/)即可部署合约。调用`verify()`方法进行验证，如果`ecrecover`返回的地址与消息签名所使用的地址（与密钥相关，需在合约中手动设置）一致，即返回*true*。

## 使用SHA256函数获取哈希值 {: #hashing-with-sha256 }

向这一函数输入数据可返回其SHA256哈希值。测试这一预编译合约，可以使用此[在线工具](https://md5calc.com/hash/sha256)来计算任何字符串的SHA256哈希值。在本示例中，我们将使用`Hello World!`。直接进入Remix并部署以下代码，计算出来的哈希值将在`expectedHash`变量中显示：

--8<-- 'code/builders/pallets-precompiles/precompiles/eth-mainnet/sha256.md'

合约部署后，就可以调用`checkHash()`方法进行验证。如果`calculateHash()`返回的哈希值与所提供的哈希值一致，即返回*true* 。

## 使用SHA3FIPS256函数获取哈希值 {: #hashing-with-sha3fips256 }

SHA3-256是SHA-3安全散列算法（遵循[FIPS202](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf)）系列的一部分，其算法的输出长度为256比特。尽管SHA-3的名称与SHA256相似，但SHA-3系列使用完全不同的算法构建，因此对于相同的输入产生的哈希输出与SHA256不同。您可以使用此[在线工具](https://md5calc.com/hash/sha3-256)自行验证。计算SHA3-256输出后，在下拉菜单将算法改为SHA256并记下结果输出。

目前Solidity暂不支持SHA3-256，因此需要使用内联汇编的方式调用这一函数。您可使用以下代码调用这个预编译合约。

--8<-- 'code/builders/pallets-precompiles/precompiles/eth-mainnet/sha3fips.md'

使用[Remix编译器部署](/builders/build/eth-api/dev-env/remix/)并将[MetaMask连接至Moonbase Alpha](/tokens/connect/metamask/)即可部署合约。调用`sha3fips(bytes memory data)`方法返回数据参数的编码字符串。

## 使用RIPEMD160函数获取哈希值 {: #hashing-with-ripemd-160 }

向这一函数输入数据可返回其RIPEMD-160哈希值。测试这一预编译合约，可以使用这个[在线工具](https://md5calc.com/hash/ripemd160)来计算任何字符串的RIPEMD-160哈希值。在本示例中，我们仍使用`Hello World!`。我们将使用相同的代码，但使用另一个函数：`ripemd160`函数。请注意，这个函数返回的是`bytes20`类型的变量：

--8<-- 'code/builders/pallets-precompiles/precompiles/eth-mainnet/ripemd160.md'

合约部署后，就可以调用`checkHash()`方法进行验证。如果`calculateHash()`返回的哈希值与所提供的哈希值一致，即返回*true* 。

## BN128Add {: #bn128add }

BN128Add预编译实现了原生椭圆曲线点添加。它返回一个表示`(ax, ay) + (bx, by)`的椭圆曲线点，这样`(ax, ay)`和`(bx, by)`是曲线BN256上的有效点。

目前Solidity暂不支持BN128Add，因此需要使用内联汇编的方式调用这一函数。您可使用以下代码样本调用这个预编译合约。

--8<-- 'code/builders/pallets-precompiles/precompiles/eth-mainnet/bn128add.md'

使用[Remix编译器部署](/builders/build/eth-api/dev-env/remix/)并将[MetaMask连接至Moonbase Alpha](/tokens/connect/metamask/)即可部署合约。调用`callBn256Add(bytes32 ax, bytes32 ay, bytes32 bx, bytes32 by)`方法返回操作结果。

## BN128Mul {: #bn128mul }

BN128Mul预编译实现了原生椭圆曲线的标量乘法。它返回一个椭圆曲线点，表示`scalar * (x, y)`，使得`(x, y)`是曲线BN256上的有效曲线点。

目前Solidity暂不支持BN128Mul，因此需要使用内联汇编的方式调用这一函数。您可使用以下代码调用这个预编译合约。

--8<-- 'code/builders/pallets-precompiles/precompiles/eth-mainnet/bn128mul.md'

使用[Remix编译器部署](/builders/build/eth-api/dev-env/remix/)并将[MetaMask连接至Moonbase Alpha](/tokens/connect/metamask/)即可部署合约。调用`callBn256ScalarMul(bytes32 x, bytes32 y, bytes32 scalar)`方法返回操作结果。

## BN128Pairing {: #bn128pairing }

BN128Pairing预编译通过椭圆曲线配对操作进行zkSNARK验证。更多信息请访问[EIP-197](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-197.md)。

目前Solidity暂不支持BN128Pairing，因此需要使用内联汇编的方式调用这一函数。您可使用以下代码调用这个预编译合约。

--8<-- 'code/builders/pallets-precompiles/precompiles/eth-mainnet/bn128pairing.md'

使用[Remix编译器部署](/builders/build/eth-api/dev-env/remix/)并将[MetaMask连接至Moonbase Alpha](/tokens/connect/metamask/)即可部署合约。调用`function callBn256Pairing(bytes memory input)`方法返回操作结果。

## 恒等函数 {: #the-identity-function }

这一函数也被称为“数据复制”函数，是复制内存数据性价比较高的方法。

目前Solidity暂不支持恒等函数，因此需要使用内联汇编的方式调用这一函数。您可以使用[以下代码](https://docs.klaytn.com/smart-contract/precompiled-contracts#address-0x-04-datacopy-data)（经修改已适应Solidity）调用这个预编译合约。我们可以使用此[在线工具](https://web3-type-converter.onbrn.com/)来获取任何字符串的字节码，因为它是`callDataCopy()`方法的输入值。

--8<-- 'code/builders/pallets-precompiles/precompiles/eth-mainnet/identity.md'

合约部署后，就可以调用`callDataCopy()`方法来验证`memoryStored`是否与您在函数中所输入的字节码相符。

## 模幂运算函数 {: #modular-exponentiation }

我们要介绍的最后预编译合约主要用于计算整数*b*（基数）乘以*e*次方（指数）并除以一个正整数*m*（除数）后的余数。

目前Solidity暂不支持模幂运算函数，因此需要使用内联汇编的方式调用这一函数。[以下代码](https://docs.klaytn.com/smart-contract/precompiled-contracts#address-0x05-bigmodexp-base-exp-mod)经过了简化，能更好地呈现这一预编译合约的功能。

--8<-- 'code/builders/pallets-precompiles/precompiles/eth-mainnet/modularexp.md'

您也可以在[Remix](/builders/build/eth-api/dev-env/remix/)环境中尝试使用这一合约。调用`verify()`函数，输入基数、指数和除数，结果将储存在函数的`checkResult`变量中。
