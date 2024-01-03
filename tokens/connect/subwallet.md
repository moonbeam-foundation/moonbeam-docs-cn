---
title: How to Connect SubWallet to Moonbeam - 如何连接SubWallet至Moonbeam
description: This guide walks you through how to connect SubWallet, a comprehensive Polkadot, Substrate, and Ethereum wallet, to Moonbeam. 
通过本教程学习如何将SubWallet（一款波卡、Substrate和以太坊综合性钱包）连接至Moonbeam。
---

# Interacting with Moonbeam Using SubWallet - 使用SubWallet与Moonbeam交互

## Introduction - 概览 {: #introduction }

Developers and users of Moonbeam have a variety of options when it comes to wallets. Thanks to Moonbeam's seamless Ethereum compatibility, Moonbeam supports a great variety of popular wallets, including [SubWallet](https://www.subwallet.app/){target=_blank}.

Moonbeam的开发者和用户在使用钱包时有多种选择。得益于Moonbeam与以太坊的无缝兼容性，Moonbeam支持[SubWallet](https://www.subwallet.app/){target=_blank}等多种常用钱包。

SubWallet is a comprehensive Web3 wallet that natively supports Substrate and Ethereum accounts. Although Moonbeam is a Substrate-based blockchain, it has a [unified account system](/learn/features/unified-accounts){target=_blank} that replaces the default Substrate-style accounts and keys with Ethereum-style accounts and keys. Since SubWallet supports Ethereum-style accounts, you can interact with your Moonbeam account using SubWallet.

SubWallet是一款原生支持Substrate和以太坊账户的综合性Web3钱包。尽管Moonbeam是一条基于Substrate的区块链，但是其有一个[统一的账户系统](/learn/features/unified-accounts){target=_blank}，用以太坊格式的账户和密钥替代了默认的Substrate格式的账户和密钥。由于Substrate支持以太坊格式的账户，因此您可以使用SubWallet与Moonbeam账户交互。

This guide takes you through all the necessary steps, from installing SubWallet to setting up a wallet, connecting it to Moonbeam, and sending funds.

本教程将引导您如何从安装SubWallet到设置钱包，以及如何将其连接至Moonbeam并发送资金。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Install SubWallet - 安装SubWallet {: #install-subwallet }

There are several ways you can interact with SubWallet: they have **a browser extension, a mobile app, and a web-accessible dashboard**.

与SubWallet交互有多种方式，例如**通过浏览器扩展程序、移动端App或网页端数据面板**。

You can get started by heading to [SubWallet's download page](https://www.subwallet.app/download.html){target=_blank} and downloading SubWallet for the platform of your choice.

首先前往[SubWallet下载页面](https://www.subwallet.app/download.html){target=_blank}，根据个人使用习惯下载SubWallet。

If you choose to use the web-accessible dashboard, you won't need to download anything. You can access the dashboard at [web.subwallet.app](https://web.subwallet.app/welcome){target=_blank}.

如果您选择使用通过网页访问的数据面板，您无需下载任何东西，只需在[web.subwallet.app](https://web.subwallet.app/welcome){target=_blank}访问数据面板即可。

The interfaces for the mobile app, browser extension, and web dashboard are quite similar, so you can adapt the following instructions, which focus on the browser extension, for the mobile app and web dashboard.

移动端App、浏览器扩展程序和网页端数据面板的界面类似，以下操作以浏览器扩展程序为例，您也可以针对移动端App和网页端数据面板调整以下步骤。

## Setup a Wallet - 设置钱包 {: #setup-a-wallet }

Once you've downloaded the SubWallet Browser Extension, you'll be prompted to set up your wallet. You'll be able to choose from the following options:

当您下载好SubWallet浏览器扩展程序后，您将收到设置钱包的提示。您可以通过以下选项完成钱包设置：

- **Create a new account** - allows you to create an entirely new account by creating a password and generating a seed phrase
- **创建新账户** - 通过创建密码和生成助记词创建一个全新的账户
- **Import an account** - allows you to import an existing account using the seed phrase, JSON file, private key, or by QR code
- **导入账户** - 使用助记词、JSON文件、私钥或扫描二维码导入现有账户
- **Attach an account** - allows you to connect to an account without the private key. You can use this method to connect to a cold storage wallet, like Keystone, or a watch-only account. With a watch-only account, you will not be able to transfer funds or interact with your account; you'll only be able to view account balances

- **附加帐户** - 在没有私钥的情况下连接账户。您可以使用此方法连接至冷钱包（如Keystone，或仅观看账户。使用仅观看的账户，您只能查看账户余额，无法实现转账或与账户交互

    !!! note 注意事项
        Ledger is supported on the browser extension but is not yet available on the mobile app. Support for Ledger on the mobile app is coming soon!

    Ledger目前仅可在浏览器扩展程序上使用，移动端App暂不支持。但此功能即将推出，敬请期待！

- **Connect wallet** - *only available on the web dashboard* - allows you to connect to a browser extension wallet. You can use this method to easily connect to an account you've created using the SubWallet browser extension or another wallet, such as MetaMask

- **连接钱包** - *仅供网页端数据面板使用* - 可连接至浏览器扩展程序钱包。您可以使用此方式轻松连接至通过SubWallet浏览器扩展程序或其他钱包（如MetaMask）创建的账户

The following sections will provide step-by-step instructions for [creating a new account](#create-a-new-account-extension) and [importing an existing account](#import-an-account-extension) with SubWallet.

以下部分将展开讲述如何使用SubWallet[创建新账户](#create-a-new-account-extension)和[导入现有账户](#import-an-account-extension)。

If you're attaching an account, you can find step-by-step instructions on [SubWallet's Account management documentation](https://docs.subwallet.app/main/extension-user-guide/account-management){target=_blank}. Similarly, if you're connecting a wallet on the web dashboard, you can find instructions on [SubWallet's Connect extension documentation](https://docs.subwallet.app/main/web-dashboard-user-guide/account-management/connect-extension){target=_blank}.

如果您使用附加账户功能，您可以参考[SubWallet账户管理文档](https://docs.subwallet.app/main/extension-user-guide/account-management){target=_blank}的分步教程进行操作。同样地，如果您想要在网页端数据面板上连接钱包，您可以参考[SubWallet连接扩展程序文档](https://docs.subwallet.app/main/web-dashboard-user-guide/account-management/connect-extension){target=_blank}的教程。

### Create a New Account - 创建新钱包 {: #create-a-new-account }

Creating a new account will generate a seed phrase that can derive multiple Ethereum and Substrate accounts. By default, SubWallet will generate a single Ethereum and a single Substrate account, but you can easily derive more from the same seed phrase. To interact with Moonbeam, you will need to use an Ethereum account. Click **Create a new account** to get started.

创建新钱包将生成可以派生多个以太坊和Substrate账户的助记词。默认情况下，SubWallet将生成一个以太坊账户和一个Substrate账户，但是您可以轻松从同一个助记词中生成更多的账户。要与Moonbeam交互，您可以使用以太坊账户。点击**Create a new account**开始创建新账户。

![The main screen of the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-1.png)

On the following screen, you'll be prompted to create a password to secure your new wallet:

在下方页面中，您需要创建密码以保护您的新账户：

1. Enter a password that has at least 8 characters

   输入至少为8个字符的密码

2. Confirm the password by entering it again

   重新输入确认密码

3. Click **Continue**

   点击**Continue**按钮继续操作

![The create a password screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-2.png)

You'll then be prompted to back up your seed phrase. This is an important step, especially because you have the option to later derive additional accounts from this seed phrase.

随后，系统将提示您备份助记词。此步骤对于后续要从该助记词中派生其他账户的人来说至关重要。

1. View your seed phrase and save it in a safe place

    查看助记词并将其存储在安全的地方

    !!! remember 请注意
        You should never share your seed phrase (mnemonic) or private key with anyone. This gives them direct access to your funds. This guide is for educational purposes only.

    请勿将助记词或私钥分享与他人。这将能够直接获取您的资产。本教程仅用于操作演示目的

2. Once you've safely stored your seed phrase, click **I have kept it somewhere safe**

    安全存储助记词后，点击**I have kept it somewhere safe**

![Back up your seed phrase on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-3.png)

!!! note 注意事项
    If you're creating a new account on the mobile app, you'll have to re-enter your seed phrase to verify that you have stored it. The words have to be entered in the correct order.

如果您在移动端App创建一个新账户，您需要重新输入存储的助记词进行验证。请确保按照正确的顺序输入单词。

After you've created a password and saved your seed phrase, you'll be connected to your account. You can [add additional accounts](#add-additional-accounts) at any time.

当您创建密码并存储助记词后，您将连接至您的账户。您可以随时[添加其他账户](#add-additional-accounts)。

### Import an Account - 导入账户 {: #import-an-account }

To import an existing account into SubWallet, you can select **Import an account**.

要导入现有账户至SubWallet，您可以选择**Import an account**按钮。

![The main screen of the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-4.png)

On the following screen, select the method by which you would like to import the existing account. You can choose from **Import from seed phrase**, **Import from Polkadot.{js}**, **Import by MetaMask private key**, and **Import by QR code**.

在下方页面中，选择要导入现有账户的方式，包括**Import from seed phrase**（从助记词导入）、**Import from Polkadot.{js}**（从Polkadot.{js}导入）、**Import by MetaMask private key**（通过MetaMask私钥导入），以及**Import by QR code**（通过二维码导入）。

If you select **Import from seed phrase**, there are some incompatibility issues that can arise when importing an account from seed phrase. For example, Trust Wallet and SafePal are among the wallets not compatible with SubWallet. If you run into incompatibility issues, SubWallet recommends creating a new wallet.

如果您选择**Import from seed phrase**（从助记词导入），从助记词导入账户时可能会出现一些不兼容问题。例如，Trust Wallet和SafePal钱包都与SubWallet不兼容。如果您遇到不兼容的问题SubWallet建议您创建一个新钱包。

If you select **Import from Polkadot.{js}**, you'll need to make sure that the account was created in Polkadot.js via private key. If it was created with a seed phrase and you attempt to import it to SubWallet, a different public address will be used. This is because Polkadot.js uses [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki){target=_blank}, whereas Ethereum uses [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki){target=_blank} or [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki){target=_blank}.

如果您选择**Import from Polkadot.{js}**（从Polkadot.{js}导入），您需要确保该账号是通过私钥在Polkadot.js中创建的。如果该账户是通过助记词创建并且尝试将其导入SubWallet，您将会得到一个一样的公共地址。这是因为Polkadot.js使用的是[BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki){target=_blank}，而以太坊使用的是[BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki){target=_blank}或[BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki){target=_blank}。

![Select the import option from the Import account screen of the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-5.png)

If you import your account via seed phrase, you can select your account type as either Substrate (Polkadot) or EVM (Ethereum), or both. Moonbeam uses Ethereum-style accounts, so you'll need to select **Ethereum** to import an account for Moonbeam-based networks.

如果您通过助记词导入账户，您将需要选择账户类型，即Substrate (Polkadot)或EVM (Ethereum)，或两者都是。Moonbeam使用的是以太坊格式的账户，因此您需要选择**Ethereum**为基于Moonbeam的网络导入账户。

![Select the account type to import on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-6.png)

Once you've completed the import process, you'll be prompted to enter a password to secure your new wallet:

当您完成导入流程后，系统将提示您输入密码以保护您的新账户：

1. Enter a password that has at least 8 characters

   输入至少为8个字符的密码

2. Confirm the password by entering it again

   重新输入确认密码

3. Click **Continue**

   点击**Continue**按钮继续操作

![The create a password screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-7.png)

Next, you'll be able to provide the relevant seed phrase, private key, JSON file, or QR code, and you can begin using your new account right away. You can add [additional accounts](#add-additional-accounts) at any time.

接下来，您可以通过提供账户相关的助记词、私钥、JSON文件或二维码即可开始使用新账户。您可以随时[添加其他账户](#add-additional-accounts)。

### Add Additional Accounts - 添加其他账户 {: #add-additional-accounts }

After you have created a new account or imported an existing account to SubWallet, you can add additional accounts by taking the following steps:

当您创建密码并存储助记词后，您将连接至您的账户。您可以通过执行以下步骤创建其他账户：

1. Click on the account dropdown

   点击账户下拉菜单

2. Select one of the options from the bottom of the screen. You can click **Create a new account**, the import button to import an existing account, or the attach button to attach to an existing cold storage wallet or watch-only account

   在页面底部选择选项，您可以选择第一个按钮**Create a new account**，重复上述步骤创建新账户；您也可以选择第二个按钮导入现有账户，或者第三个按钮附加现冷钱包或仅观看账户

![View account details and create a new account, import one, or attach one.](/images/tokens/connect/subwallet/subwallet-8.png)

If you're creating a new account, you can then choose **Create with new seed phrase** or **Derive from an existing account**. If you're creating a new account with a new seed phrase, you'll need to select the account type and back up the account, similar to the instructions in the [Create a New Account](#create-a-new-account) section. If you choose to derive a new account, you'll be prompted to select the existing account that you want to derive the account from.

如果您选择创建新账户，您可以选择**Create with new seed phrase**（使用新的助记词创建新账户）或**Derive from an existing account**（从现有账户衍生新账户）。如果您选择使用新的助记词创建新账户，您可以参考[创建新账户](#create-a-new-account)部分的步骤。如果您选择现有账户衍生新账户，系统将提示您选择用于衍生账户的现有账户。

If you're importing a new account, you'll need to choose whether to import using a seed phrase, JSON file, MetaMask private key or QR code, then repeat the process outlined in the [Import an Account](#import-an-account) section.

如果您选择导入新账户，您需要选择使用助记词、JSON文件、MetaMask私钥或二维码进行导入，然后重复上述[导入账户](#import-an-account)部分的步骤进行操作。

If you're attaching an account, you can find out step-by-step instructions on [SubWallet's Account management documentation](https://docs.subwallet.app/main/extension-user-guide/account-management){target=_blank}.

如果您选择附加账户，您可以参考[SubWallet账户管理文档](https://docs.subwallet.app/main/extension-user-guide/account-management){target=_blank}的分步教程进行操作。

## Connect SubWallet to Moonbeam {: #connect-subwallet-to-moonbeam }

To configure SubWallet for Moonbeam, select the **Customize your asset display** icon next to the **Search a token** icon.

要为Moonbeam配置SubWallet，选择**Search a token**图标旁的**Customize your asset display**图标自定义资产显示。

![The tokens screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-9.png)

To add Moonbeam, you can:

您可以通过以下步骤添加Moonbeam：

1. Search for "Moon" to view all Moonbeam-based networks, or search for a specific network

   在搜索栏中输入“Moon”将出现所有基于Moonbeam网络，或者您可以根据自己的需求输入指定网络名称

2. Toggle the switch to connect to the network

   启动想要连接的网络的开关

![The customize asset display screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-10.png)

If you're trying to connect to a [local Moonbeam development node](/builders/get-started/networks/moonbeam-dev){target=_blank}, you can select the hamburger menu from the top left corner, which will take you to the settings page.

如果您想要连接至[本地Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev){target=_blank}，您可以点击页面左上角的菜单栏，进入设置页面。

![The tokens screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-11.png)

From the settings menu, click **Manage networks**.

在设置菜单栏点击**Manage networks**。

![The settings screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-12.png)

Click the **+** icon in the top right corner and enter in the [network configurations](/builders/get-started/quick-start/#network-configurations){target=_blank}. You can also manage and connect to other networks from this menu.

点击右上角的**+**图标，进入[网络配置](/builders/get-started/quick-start/#network-configurations){target=_blank}页面。你可以在此菜单栏管理和连接其他网络。

![The tokens screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-13.png)

By default, all balances are hidden in SubWallet, but if you press the **Show balance** icon, you can toggle balance visibility.

默认情况下，SubWallet中的所有余额均会被隐藏，点击**Show balance**图标即可显示余额。

![The tokens screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-14.png)

## Interact with the Network - 与网络交互 {: #interact-with-the-network }

Once you've [connected SubWallet](#connect-subwallet-to-moonbeam) to any Moonbeam-based network, you can start using your wallet by:

当您[将SubWallet连接](#connect-subwallet-to-moonbeam)至任何基于Moonbeam的网络后，您可以使用钱包开始以下操作：

- Receiving a token from another address
- 从另一个地址接收Token
- Sending a token to another address
- 将Token发送到另一个地址
- Adding tokens to SubWallet and interacting with them
- 将Token添加至SubWallet并与其交互

### Receive a Token - 接收Token {: #receive-a-token }

To receive a token from another account, you would need to show your wallet address to your counterparty, and they can send their assets to such address.

要从另一个账户接收Token，您需要向交易方出示您的钱包地址，便于他们将资产发送到该地址。

To copy your address, click on the **Get address** icon.

复制地址，点击**Get address**图标。

![The tokens screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-15.png)

If you have multiple accounts and have selected **All accounts** from the account dropdown menu, you'll need to select the receiving account you want to send the assets to. Otherwise, make sure that the account you're connected to (which is displayed at the top of the screen) is the account you want to send the assets to. **This should be your Moonbeam account, which is an Ethereum-style address.**

如果您有多个账户，并且从账户下拉菜单中选择了**All accounts**，您最好手动再次选择用于接收资产的地址。否则，请确认您当前连接的账户（显示在页面顶部）是正确的接收资产地址。**该账户是Moonbeam账户，即以太坊格式的地址。**

![Select an account to receive tokens on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-16.png)

Next, you can search for and choose the token that you would like to receive. For this example, DEV is chosen.

接下来，您可以搜索选择要接收的Token。在本示例中为DEV。

![Search and choose desired token on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-17.png)

!!! note 注意事项
    SubWallet supports receiving cross-chain tokens, so please be sure to check that the chain logo under the token name matches your desired chain.

SubWallet支持接收跨链Token，因此请确保Token名称下的链logo是否与您想要选择的链相符。

You will be shown the QR code and the address linked to your account. **Double-check that the address shown is an Ethereum-style account**.

随后，您将看到一个二维码和链接到您账户的地址。**请再次检查显示的地址是否为以太坊格式的账户**。

![QR code and address to receive tokens on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-18.png)

Now you just need to show the QR code or address to the sender.

现在您只需要向发送方展示二维码或地址即可。

### Send a Transaction - 发送交易 {: #send-a-transaction }

To get started with a simple token transfer to another address on Moonbeam, you can click the **Send** icon.

要在Moonbeam上将一个简单的Token转移到另一个账户，您可以点击**Send**图标。

![The tokens screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-19.png)

Next, you can take the following steps:

接下来，执行以下步骤：

1. Specify the asset to send and the destination chain

    指定要发送的资产和目标链

    !!! note 注意事项
        Some tokens are allowed to be transferred cross-chain, so when choosing the destination network, you can choose the dropdown menu to see the available options.

    一些Token是允许跨链转移的，因此在选择目标网络时，您可以选择下拉菜单来查看可用选项

2. Enter the destination address, which can also be done using the address book or by scanning the recipient's QR code

    输入目标地址，这也可以通过地址库或扫描接收方二维码完成

    !!! note 注意事项
        If you're using the mobile app, click **Next** to proceed.

    如果您正在使用移动端App，点击**Next**继续操作。

3. Enter the amount of tokens to send

    输入要发送的Token数量

4. Look over the transaction details, then press **Transfer**

    查看交易详情，点击**Transfer**

![The transfer screen on the SubWallet browser extension, where you can enter in the transaction details.](/images/tokens/connect/subwallet/subwallet-20.png)

On the next screen, you'll be able to review the transaction details and submit the transaction. If the transaction details look good, you can click **Approve** to send the transaction.

在下一个页面，您需要检查交易详情并提交交易。如果交易无误，点击**Approve**发送交易。

![The transfer confirmation screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-21.png)

After you send the transaction, you'll be able to review the transaction details.

交易发送后，您将能够看到交易详情。

And that's it! For more information on how to use SubWallet, please refer to [SubWallet's documentation](https://docs.subwallet.app/main/){target=_blank}.

这样就可以了。关于如何使用SubWallet的更多信息，请参考[SubWallet官方文档网站](https://docs.subwallet.app/main/){target=_blank}。

--8<-- 'text/_disclaimers/third-party-content.md'
