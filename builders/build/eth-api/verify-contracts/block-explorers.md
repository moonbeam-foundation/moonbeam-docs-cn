---
title: 使用区块浏览器验证智能合约
description: 学习如何使用区块浏览器在Moonbeam网络上验证智能合约。
---

# 使用区块浏览器验证智能合约

## 概览 {: #introduction }

通过区块浏览器上验证智能合约，这对于部署在Moonbeam上的智能合约是能够大幅提升透明度和安全性的方法。用户直接查看已被验证的智能合约的源代码，同时也可以使用部分区块浏览器的接口与合约的公开函数/代码互动。

本教程将会列出通过区块浏览器在Moonbeam网络上验证智能合约的所有步骤。

## 部署合约 {: #deploying-the-contract }

要在区块浏览器上验证一个智能合约，首先确保该合约已部署至目标网络。本教程将演示在[Moonbase Alpha](/builders/get-started/networks/moonbase/)上部署智能合约。

关于如何使用Moonbeam上的以太坊库部署智能合约，您可以查看[此教程](/builders/build/eth-api/libraries/)。同样，您也可以使用如[Remix](/builders/build/eth-api/dev-env/remix/#deploying-a-contract-to-moonbeam-using-remix)、[Truffle](/builders/build/eth-api/dev-env/truffle/#deploying-a-contract-to-moonbeam-using-truffle)或其他开发者工具在Moonbeam上部署智能合约。

本教程将会使用以上提及的部署教程中所使用的智能合约作为验证范本。

所使用的合约为简单的增量函数，根据功能命名为`Incrementer.sol`。内含的Solidity代码如以下所示：

```solidity
--8<-- 'code/web3-contract-local/Incrementer.sol'
```

### 收集验证合约所需信息 {: #collecting-information-for-contract-verification}

为验证合约，您将需要收集合约编译器和部署细节的相关信息以保证验证能够顺利进行。

1. 记录用于编译和部署合约的Solidity编译器版本。通常Solidity编译器的版本会在使用的部署工具中提及和描述
2. 记录任何在Solidity开源文件开头使用的任何SPDX证照识别码

    ```solidity
    // SPDX-License-Identifier: MIT
    ```

3. （可选） 如果在编译过程中开启过Optimization，记录Optimization运行系数的数值
4. （可选）如果合约构造方法接受参数，记录构造函数的[ABI编码形式](https://docs.soliditylang.org/en/develop/abi-spec.html)
5. 在部署后，记录智能合约部署的合约地址。合约的部署地址可以通过使用Truffle、Hardhat或以太坊库等基于命令行的开发工具，在控制台输出中获得，也可以通过Remix IDE等工具中在GUI中复制获得

![Example Compiler Options in Remix IDE](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-1.png)

![Contract Address in Remix IDE](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-2.png)

## 验证合约 {: #verifying-the-contract }

下一步将在您部署到的Moonbeam网络的EVM兼容浏览器中验证智能合约。

### Moonscan {: #moonscan }

在Moonscan中跟随以下步骤以验证合约：

1. 在Moonscan中导向至[Verify & Publish Contract Source Code](https://moonbase.moonscan.io/verifyContract)页面
2. 在第一个输入框中填入`0x`开头的合约部署地址
3. 选择编译器类型。在此`Incrementer.sol`示例中，选取**Solidity（Single file）**
4. 选取完编译器类型后，选取用于部署合约的编译器版本。如果所使用的编译器版本为nightly commit，取消输入框下的勾选框，即选取nightly版本
5. 选取所使用的开源证照。在此`Incrementer.sol`示例中，选取**MIT License（MIT）**。如果未使用任何证照，选取**No License（None）**
6. 在表格底下点击**Continue**按钮以进入下个页面

![First Page Screenshot](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-3.png)

在第二个页面，**Contract Address**、**Compiler**和**Constructor Arguments**的输入框应该都已自动填写完毕，您只需填写以下信息：

1. 在文字输入框中粘贴复制的合约内容
2. （可选）如果在编译时曾经开启**Optimization**，则选取**Yes**，并在**Misc Settings/Runs (Optmizer)**下输入运行次数
3. （可选）如果曾使用合约库及其地址，则新增合约库和地址
4. （可选）勾选任何可应用至您的合约的输入框，并根据指示填写信息
5. 在页面底下点击CAPTCHA和**Verify and Publish**按钮以确认信息并开始验证

![Second Page Screenshot](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-4.png)

经过一段时间后，验证的结果将会显示在浏览器上，成功结果的页面将会显示合约的ABI编码构造函数、合约名称、字节码和ABI。

​![Result Page Screenshot](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-5.png)

## 智能合约扁平化 {: #smart-contract-flattening }

要验证由多个文件组成的智能合约，其过程与先前略微不同，并且需要一些前置步骤以将目标智能合约的所有依赖项合并至单一的Solidity文件。

该预处理通常被称为智能合约扁平化。目前有部分工具可以用来扁平化多个部分的智能合约至单一的Solidity文件，如[Truffle Flattener](https://www.npmjs.com/package/truffle-flattener)。请参考各自智能合约扁平化工具的文档以获得更详细的说明。

扁平化多个部分的智能合约后，可以在区块浏览器上使用新的扁平化后的Solidity文件进行验证，其方式与本教程中所描述的验证单一文件智能合约的方式相同。

### 在Moonscan上验证多个部分的智能合约 {: #verify-multi-part-smart-contract-on-moonscan }

关于在Moonscan上进行验证，其有一个内建功能可以处理多个部分的智能合约。

在**Compiler Type**（上述示例中的第三个步骤）选取**Solidity (Multi-part files)**。在下个页面，选取并上传所有组成其智能合约的不同Solidity文件，包含嵌入依赖项的合约文件。

![Moonscan Multifile Page](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-6.png)

除此之外，其余验证过程与在Moonscan上验证单一文件合约的过程相同。
