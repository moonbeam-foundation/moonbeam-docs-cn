---
title: How to Connect MetaMask 如何连接MetaMask
description: This guide walks you through how to connect MetaMask, a browser-based Ethereum wallet, to Moonbeam-based networks and how to transfer funds.
通过此教程学习如何将MetaMask（一个基于浏览器的以太坊钱包）连接至基于Moonbeam的网络，并转移资金。
---

# Interacting with Moonbeam Using MetaMask - 使用MetaMask与Moonbeam交互

## Introduction - 概览 {: #introduction }

Developers can leverage Moonbeam's Ethereum compatibility features to integrate tools, such as [MetaMask](https://metamask.io/){target=_blank}, into their dApps. By doing so, they can use the injected library MetaMask provides to interact with the blockchain.

开发人员可以利用Moonbeam与以太坊兼容的特色，将一些[MetaMask](https://metamask.io/){target=_blank}等工具整合至DApp中。如此一来，就可以使用MetaMask提供的库与要部署的链相交互。

Currently, MetaMask can be configured to connect to a few networks: Moonbeam, Moonriver, the Moonbase Alpha TestNet, and a Moonbeam development node.

目前为止，MetaMask可以配置并连接的网络包括：Moonbeam、Moonriver、Moonbase Alpha测试网和Moonbeam开发节点。

If you already have MetaMask installed, you can easily connect MetaMask to the network of your choice:

如果您已经成功安装MetaMask，您可以使用MetaMask轻松连接至您选择的网络：

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbeam">连接至Moonbeam</a>
</div>

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonriver">连接至Moonriver</a>
</div>

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbase">连接至Moonbase Alpha</a>
</div>

!!! note 注意事项
    MetaMask will pop up asking for permission to add a custom network. Once you approve permissions, MetaMask will switch your current network.

MetaMask将会跳出弹框，要求授权添加自定义网络。经授权后，MetaMask会将切换至您当前的网络。

Learn [how to integrate a Connect MetaMask button](/builders/integrations/wallets/metamask/){target=_blank} into your dApp, so that users can connect to Moonbase Alpha with a simple click of a button. The guide can also be adapted for the other Moonbeam-based networks.

学习[如何将连接MetaMask按钮集成](/builders/integrations/wallets/metamask/){target=_blank}至您的dApp，便于用户只需单击按钮即可连接至Moonbase Alpha。本教程也同样适用于其他基于Moonbeam的网络。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Install the MetaMask Extension - 安装MetaMask扩展程序 {: #install-the-metamask-extension }

First, you'll start with a fresh and default [MetaMask](https://metamask.io/){target=_blank} installation from the Chrome store. After downloading, installing, and initializing the extension, follow the **Get Started** guide. In there, you need to create a wallet, set a password, and store your secret backup phrase (this gives direct access to your funds, so make sure to store these in a secure place).

首先，从谷歌Chrome浏览器的网上应用商店安装全新且默认的[MetaMask](https://metamask.io/){target=_blank}。下载、安装和初始化该扩展程序后，遵循**Get Started**指南进行设置。您需要创建一个MetaMask钱包，设置密码并储存您的助记词（请妥善保存您的助记词，该助记词将用于授权您账户中的资金）。

## Setup a Wallet - 创建钱包 {: #setup-a-wallet }

After installing [MetaMask](https://metamask.io){target=_blank}, the setup will automatically open a new task with a welcome screen. Here, you are offered two options:

[MetaMask](https://metamask.io){target=_blank}安装完毕后，将会自动跳出一个带有新任务的欢迎页面。此处，您有两个选项：

- **Create a new wallet** - you'll go through some steps to get a new seed phrase. Ensure you store this phrase securely and you don't share it publicly
- **创建新钱包** - 您将完成一些步骤来获取新的助记词。请安全存储此助记词，切勿将其分享与他人
- **Import an existing wallet** - you already have a seed phrase stored, and you want to restore an account from that recovery phrase
- **导入现有钱包** - 您已存储助记词，并且想要从该助记词恢复账户

![Metamask Setup Interface](/images/tokens/connect/metamask/new/metamask-1.png)

Once you've clicked on the option that adapts to your needs, follow the steps, and you should be all setup.

根据您的个人需求选择，然后遵循步骤进行操作，即可完成设置。

!!! note 注意事项
    Multiple accounts can be derived from a seed phrase by changing what is known as the address index. By default, when creating or importing an account from the seed phrase, you get the account with the address index 0. You can get the other indexes by just adding new accounts in the main Metamask screen.

通过更改已知的地址索引，可以从助记词派生出多个账户。默认情况下，当从助记词创建或导入账户时，您会获得地址索引为0的账户。您只需在MetaMask主屏幕中添加新账户即可获得其他索引。

## Import Accounts - 导入账户 {: #import-accounts }

Once you've created a wallet or imported an existing one, you can also import any account into MetaMask if you hold the private keys.

当您创建钱包或导入现有钱包后，您还可以选择导入任何您持有私钥的账户至MetaMask。

For this example, you'll use private keys from the development account. Click the account switcher button to import an account using its private keys. That is where it says **Account 1**.

在本示例中，您将从开发账户使用私钥。点击切换账户的按钮，使用私钥导入账户。此处显示的为**Account 1**。

![Importing account from private key metamask menu](/images/tokens/connect/metamask/new/metamask-2.png)

Next, click on **Import Account**.

接下来，点击**Import Account**。

![Importing account from private key account switcher menu](/images/tokens/connect/metamask/new/metamask-3.png)

Finally, enter the private keys of the account you are trying to import. For example, you can use one of the accounts prefunded in the Moonbeam development node. This guide uses Gerald's key. Once you've entered the private key, click on **Import**.

最后，输入您要导入的账户私钥。举例来说，您可以使用在Moonbeam开发节点中预先提供资金的账户之一。本教程将使用Gerald的密钥。输入私钥后，点击**Import**。

??? note "Development account addresses and private keys 开发账户地址和私钥"
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/dev-accounts.md'
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/dev-testing-account.md'

![Paste your account key into MetaMask](/images/tokens/connect/metamask/new/metamask-4.png)

You should end up with an imported **Account 2** that looks like this:

导入后将出现如下图所示的**Account 2**：

![MetaMask displaying your new Account 2](/images/tokens/connect/metamask/new/metamask-5.png)

## Connect MetaMask to Moonbeam - 将MetaMask连接至Moonbeam {: #connect-metamask-to-moonbeam }

Once you have [MetaMask](https://metamask.io/){target=_blank} installed and have created or imported an account, you can connect it to any Moonbeam-based network. To do so, take the following steps:

当您完成安装[MetaMask](https://metamask.io/)，并创建或导入账户后，您可以将其连接至任何基于Moonbeam的网络。随后，请遵循以下步骤：

1. Click in the upper left network selector menu

   点击页面左上角的网络选择菜单栏

2. Select **Add Network**

   选择**Add Network**添加网络

![Add new network in Metamask menu](/images/tokens/connect/metamask/new/metamask-6.png)

Next, go to the bottom of the page and click on **Add a network manually**:

然后，前往页面底部，点击**Add a network manually**手动添加网络：

![Add network manually in Metamask](/images/tokens/connect/metamask/new/metamask-7.png)

Here, you can configure MetaMask for the following networks:

您可在此处使用以下网络为MetaMask进行配置：

=== "Moonbeam"
    |         Variable - 变量          |                                      Value - 值                                       |
    |:-------------------------:|:--------------------------------------------------------------------------------:|
    |       Network Name        |                                    `Moonbeam`                                    |
    |          RPC URL          |                     `{{ networks.moonbeam.public_rpc_url }}`                     |
    |         Chain ID          | `{{ networks.moonbeam.chain_id }}` (hex: `{{ networks.moonbeam.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                      `GLMR`                                      |
    | Block Explorer (Optional) |                     `{{ networks.moonbeam.block_explorer }}`                     |

=== "Moonriver"
    |         Variable - 变量          |                                       Value - 值                                        |
    |:-------------------------:|:----------------------------------------------------------------------------------:|
    |       Network Name        |                                    `Moonriver`                                     |
    |          RPC URL          |                     `{{ networks.moonriver.public_rpc_url }}`                      |
    |         Chain ID          | `{{ networks.moonriver.chain_id }}` (hex: `{{ networks.moonriver.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                       `MOVR`                                       |
    | Block Explorer (Optional) |                     `{{ networks.moonriver.block_explorer }}`                      |

=== "Moonbase Alpha"
    |         Variable - 变量          |                                      Value - 值                                       |
    |:-------------------------:|:--------------------------------------------------------------------------------:|
    |       Network Name        |                                 `Moonbase Alpha`                                 |
    |          RPC URL          |                        `{{ networks.moonbase.rpc_url }}`                         |
    |         Chain ID          | `{{ networks.moonbase.chain_id }}` (hex: `{{ networks.moonbase.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                      `DEV`                                       |
    | Block Explorer (Optional) |                     `{{ networks.moonbase.block_explorer }}`                     |

=== "Moonbeam Dev Node"
    |         Variable - 变量          |                                         Value - 值                                          |
    |:-------------------------:|:--------------------------------------------------------------------------------------:|
    |       Network Name        |                                     `Moonbeam Dev`                                     |
    |          RPC URL          |                          `{{ networks.development.rpc_url }}`                          |
    |         Chain ID          | `{{ networks.development.chain_id }}` (hex: `{{ networks.development.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                         `DEV`                                          |
    | Block Explorer (Optional) |                      `{{ networks.development.block_explorer }}`                       |

To do so, fill in the following information:

首先，请填写以下信息：

1. **Network name** - name that represents the network you are connecting to

   **Network name** - 您要连接的网络名称

2. **RPC URL** - [RPC endpoint](https://docs.moonbeam.network/builders/get-started/endpoints/){target=_blank} of the network

   **RPC URL** - 网络的[RPC端点](https://docs.moonbeam.network/builders/get-started/endpoints/){target=_blank}

3. **Chain ID** - chain ID of the Ethereum compatible network

   **Chain ID** - 以太坊兼容网络的chain ID

4. **Symbol** - (optional) symbol of the native token of the network. For example, for Moonbeam, the value would be **GLMR**

   **Symbol** -（可选）网络原生Token的符号。以Moonbeam为例，其原生Token的符号为**GLMR**

5. **Block Explorer** - (optional) URL of the [block explorer](https://docs.moonbeam.network/builders/get-started/explorers/){target=_blank}

   **Symbol** -（可选）[区块浏览器](https://docs.moonbeam.network/builders/get-started/explorers/){target=_blank}的URL

6. Once you've verified all the information, click on **Save**

   确认所有信息无误后，点击**Save**保存信息

![Add network in Metamask](/images/tokens/connect/metamask/new/metamask-8.png)

Once you've added the network, you'll be redirected to a screen stating that you've successfully added a network. Furthermore, you'll be prompted to **Switch to Moonbase Alpha**, the network added in this example.

随后，网络将跳出弹窗说明您已成功添加网络。此外，系统还会提示您**Switch to Moonbase Alpha**切换至Moonbase Alpha，即本示例中添加的网络。

![Successfully added a network in Metamask](/images/tokens/connect/metamask/new/metamask-9.png)

## Interact with the Network - 与网络交互 {: #interact-with-the-network }

Once you've [connected Metamask](#connect-metamask-to-moonbeam) to any Moonbeam-based network, you can start using your wallet by:

当您[将MetaMask连接](#connect-metamask-to-moonbeam)至任何基于Moonbeam网络后，您可以通过以下方式开始使用钱包：

- Sending a token transfer to another address
- 将Token转移至另一个地址
- Adding ERC-20s to Metamask and interacting with them
- 添加ERC-20至MetaMask并与其交互
- Adding ERC-721s to Metamask and interacting with them
- 添加ERC-721至MetaMask并与其交互

### Initiate a Transfer - 发起一笔转账 { #initiate-a-transfer }

This section showcases how to do a simple token transfer to another address as an example of using Metamask with Moonbeam.

此部分将展示如何在Moonbeam使用MetaMask向另一个地址发起一笔简单的Token转账。

To do so, take the following steps:

为此，请执行以下步骤：

1. Ensure you are connected to the correct network

   确保您已连接至正确的网络

2. Ensure you have selected the account you want to use for the transfer

   确保您已选择即将用于转账的账户

3. On the main screen of your Metamask wallet, click on **Send**

   在MetaMask钱包的主屏幕，点击**Send**按钮

![Initiate balance transfer in Metamask](/images/tokens/connect/metamask/new/metamask-10.png)

Next, you can enter the address to which you want to send the tokens. For this example, a wallet that has already been imported to Metamask is selected, known as **Bob**.

接下来，您要输入发送Token的地址。在本示例中，我们将选择已经导入MetaMask的钱包，即**Bob**。

![Select account to send tokens to in Metamask](/images/tokens/connect/metamask/new/metamask-11.png)

On the next screen, take the following steps:

在下一个页面，执行以下步骤：

1. Enter the number of tokens you want to send

   输入要发送的Token数量

2. Verify that all the information is correct, and click on **Next**

   确认所有信息无误后，点击**Next**按钮

![Set the amount of tokens to send in Metamask](/images/tokens/connect/metamask/new/metamask-12.png)

Lastly, confirm that all the gas-related parameters and fees are correct. After you've verified that everything is OK, click **Confirm**. At this point, your transaction has been sent to the network!

最后，确认所有gas相关的参数和费用是否准确。如果一切信息无误后，点击**Confirm**按钮。随后，交易将发送至网络！

![Confirming a transaction in Metamask](/images/tokens/connect/metamask/new/metamask-13.png)

Once you've confirmed your transaction, you are taken back to the main screen of your wallet, where you'll see the transaction as **Pending**. After less than a minute, the transaction should be **Confirmed**. If you click on your transaction, you can check more details and view it in a block explorer.

交易确认后，返回钱包主屏幕，您会看到交易处于**Pending**待处理状态。约一分钟后，交易应被**Confirmed**确认处理。如果您点击交易，可以在区块浏览器中查看更多详情。

![Transaction confirmed in Metamask](/images/tokens/connect/metamask/new/metamask-14.png)

### Add an ERC-20 Token - 添加ERC-20 Token {: #add-an-erc20-token }

To add an ERC-20 to your MetaMask wallet, you'll need to import the token using its address:

要添加ERC-20至MetaMask钱包，您需要使用其地址导入Token：

1. Make sure you've switched to the **Tokens** tab in MetaMask

   确保已在MetaMask切换至**Tokens**标签

2. Click **Import tokens**

   点击**Import tokens**

3. Enter the contract address of the token you want to import. The **Token symbol** and **Token decimal** fields will automatically be populated, but you can edit the **Token symbol** if needed

   输入要导入的Token合约地址。**Token symbol**和**Token decimal**会自动填充，若需要您可以编辑**Token symbol**

4. Click **Next**

   点击**Next**

![The tokens tab and the import tokens process in MetaMask, where the token address, symbol, and decimal are defined.](/images/tokens/connect/metamask/new/metamask-15.png)

Next, you'll be able to review the token import details. To finalize the import, you can click **Import**.

接下来，您需要确认Token导入的信息。确认信息无误后，点击**Import**。

![Review the token details and finalize the import in MetaMask.](/images/tokens/connect/metamask/new/metamask-16.png)

Under the **Tokens** tab, you'll be able to see the token and the account balance for the token.

在**Tokens**标签下，您能够看到Token和账户余额。

![View the imported token in the list of assets on the tokens tab in MetaMask.](/images/tokens/connect/metamask/new/metamask-17.png)

### Add an ERC-721 Token - 添加ERC-721 Token {: #add-an-erc721-token }

To add an ERC-721 to your MetaMask wallet, you'll need the token's address:

要添加ERC-721至您的MetaMask钱包，您将需要Token地址：

1. Make sure you've switched to the **NFTs** tab in MetaMask

   确保已在MetaMask切换至**NFTs**标签

2. Click **Import NFT**

   点击**Import NFT**

3. Enter the **Address** of the NFT you want to import and the **Token ID**

   输入要导入的NFT的**Address**地址以及**Token ID**

4. Click **Import**

   点击**Import**

![The NFTs tab and the import NFT process in MetaMask, where the address and the token ID of the NFT are defined.](/images/tokens/connect/metamask/new/metamask-18.png)

Once you've imported your NFT, you'll be able to see a preview of your NFT in the **NFTs** tab. You can click on the NFT to see more details.

导入NFT后，您可以在**NFTs**标签下查看NFT。点击NFT查看更多详情。

![View the imported NFT in the list of NFTs on the NFTs tab in MetaMask.](/images/tokens/connect/metamask/new/metamask-19.png)

--8<-- 'text/_disclaimers/third-party-content.md'
