---
title: 在Moonscan上新增Token信息
description: 在Moonscan上为部署在基于Moonbeam网络的ERC-20、ERC-721和ERC-1155 Token新增Token信息并创建Token简介。
---

# 在Moonscan上新增Token信息

## 概览 {: #introduction }

本教程将向您介绍为[Moonscan](https://moonscan.io){target=_blank}上的ERC-20、ERC-721和ERC-1155 Token新增Token简介的过程。

Moonscan是一个适用于EVM兼容链的区块浏览器和分析平台。 Moonscan经Moonbeam和Etherscan集成所推出，允许用户和开发者们访问开发者工具和网络统计数据，从而为Moonriver和Moonbeam的EVM提供深入的数据分析和洞察。

开发者能够为Moonriver和Moonbeam上的Token创建简介。该简介页面捕获Token背后的项目基本信息、社交媒体链接、价格数据链接以及与项目Token销售有关的其他信息。

![Example token profile](/images/builders/get-started/token-profile/profile-1.png)

本教程将向您展示如何为Moonscan上的ERC-20 Token范本创建简介。该ERC-20 Token范本部署在Moonriver上，称为DemoToken (DEMO)。本教程的操作步骤也同样适用于任何基于Moonbeam网络和ERC-721或ERC-1155 Token。

## 查看先决条件 {: #checking-prerequisites }

在开始本教程之前，您将需要准备：

- 一个[Moonscan账户](https://moonscan.io/register){target=_blank}

您将需要在本教程后半部分验证Token合约地址的所有权。您可以选择手动或自动操作此步骤，如果您选择自动操作，您需要执行以下步骤：

- 访问部署Token合约的账户，可以作为所有者签署消息
- 安装MetaMask并连接至Token部署的网络

## 开始操作 {: #getting-started }

开始操作前，请确保登陆您的Moonscan账户。成功登陆后，您可以前往想要增加Token简介的页面。对于ERC-20 Token，您可以在搜索栏搜索Token名称。对于其他Token，您可以手动输入URL。

=== "Moonbeam"

    ```text
    https://moonscan.io/token/INSERT_CONTRACT_ADDRESS
    ```

=== "Moonriver"

    ```text
    https://moonriver.moonscan.io/token/INSERT_CONTRACT_ADDRESS 
    ```

=== "Moonbase Alpha"

    ```text
    https://moonbase.moonscan.io/token/INSERT_CONTRACT_ADDRESS
    ```

在Social Profiles旁边，您可以点击**Update**。

![Update token](/images/builders/get-started/token-profile/profile-2.png)

您将被引导至**Token Update Application Form**页面。

如果您尚未验证您的合约源代码，您将需要先完成此步骤。如果您已验证您的合约，您可以跳过此步骤进入[验证地址所有者](#verifying-address-ownership)部分。

## 验证合约源代码 {: #verifying-contract-source-code }

您有多种方式可以验证您的合约源代码。您可以直接从Moonscan验证，如果您是通过Hardhat或Truffle部署合约，您也可以使用其对应的[Etherscan plugins](/builders/build/eth-api/verify-contracts/etherscan-plugins/){target=_blank}验证。

要直接从Moonscan验证您的合约源代码，您可以点击**tool**链接。

![Token update application form](/images/builders/get-started/token-profile/profile-3.png)

您将被引导至**Verify & Publish Contract Source Code**页面，您可以在此页面输入有关合约及其编译方式的详细信息。

1. 输入Token合约地址

2. 在下拉菜单中选择**Compiler Type**

3. 选择您使用的**Compile Version**

4. 选择**Open Source License Type**

5. 检查并勾选**I agree to the terms of service**

6. 点击**Continue**

![Verify & publish contract - page 1](/images/builders/get-started/token-profile/profile-4.png)

接下来您将进入下一页面，您可以在此页面输入合约源代码并指定使用的其他设置和参数。

1. 合约地址和预编译已自动填充。如果您要启用优化功能，可以在**Optimization**一栏的下拉菜单中进行更新

2. 输入合约源代码的扁平化版本。您可以使用Flattener Remix plugin以扁平化合约

3. 若需要，可更新**Constructor Arguments、** **Contract Library Address**和**Misc Settings**部分

4. 点击**I’m not a robot**

5. 最后，点击**Verify and Publish**

![Verify & publish contract - page 2](/images/builders/get-started/token-profile/profile-5.png)

现在，您的合约源代码已完成验证。您可以开始接下来的步骤，验证您是合约地址的所有者。

## 验证地址所有权 {: #verifying-address-ownership }

在**Token Update Application Form**页面，您应该在屏幕上方看到您需要验证您是合约地址所有者的消息。在开始验证之前，您需要点击**tool**链接。

![Token update application form](/images/builders/get-started/token-profile/profile-6.png)

您将被引导至**Verify Address Ownership**页面，在此页面您可以选择手动或通过连接至Web3签署消息以验证您的所有权。如果您选择手动验证所有权，您将需要消息签名的哈希。如果您连接至Web3，则会自动为您计算哈希。

![Verify address ownership](/images/builders/get-started/token-profile/profile-7.png)

### 手动签署信息 {: #sign-message-manually }

如果您要手动验证所有权，您将需要消息签署的哈希。如果您自身已计算哈希，您可以点击**Sign Message Manually**，输入**Message Signature Hash**，然后点击**Verify Ownership**。

![Manually verify address ownership](/images/builders/get-started/token-profile/profile-8.png)

### 连接至Web3 {: #connect-to-web3 }

您可以使用MetaMask轻松计算消息签署的哈希。您需要将部署合约的帐户连接至MetaMask 。随后，点击**Connect to Web3**，MetaMask将跳出弹窗。

1. 选择要连接的账户，即用于部署合约的账户

2. 连接账户

![Connect MetaMask account](/images/builders/get-started/token-profile/profile-9.png)

返回**Verify Address Ownership**页面，您可以完成以下步骤：

1. 点击**Sign with Web3**

2. MetaMask将跳出弹窗，点击**Sign**签署消息

![Sign message on MetaMask to verify address ownership](/images/builders/get-started/token-profile/profile-10.png)

消息签署完成后，您可以点击**Click to Proceed**。您将看到**Message Signature Hash**已经自动填充。随后，点击**Verify Ownership**。

![Verify address ownership submission](/images/builders/get-started/token-profile/profile-11.png)

## 创建简介 {: #creating-the-profile }

现在您可以开始创建Token简介页面，添加必要信息，包括项目信息、社交媒体链接、价格数据链接，以及更多。在提交之前，请确保所有提供的链接均可使用且能够安全访问。

必填信息如下所示：

- **请求类型**
- **Token合约地址**
- **请求者姓名**
- **请求者邮箱地址**
- **项目官方网站**
- **项目官方邮箱地址**
- **能够下载logo（尺寸为32x32 png）的链接**
- **项目介绍**

其他信息均为选填。完成所有信息填写后，您可以点击页面底部的**Submit**。

![Create token profile](/images/builders/get-started/token-profile/profile-12.png)

这样就可以了！您已成功在Moonscan上为您的Token创建并提交简介。Moonscan团队将尽快审核您所提交的内容，并根据需求为您提供进一步的说明。