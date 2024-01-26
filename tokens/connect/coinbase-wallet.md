---
title: 将Coinbase Wallet连接至Moonbeam
description: 本教程讲引导您如何为Moonbeam配置Coinbase Wallet扩展程序和移动端App，以及如何在Moonbeam上创建钱包并发送资金。
---

# 使用Coinbase Wallet与Moonbeam交互

## 概览 {: #introduction }

[Coinbase Wallet](https://wallet.coinbase.com/?_branch_match_id=977295450874474909&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXT8%2FXS07SLddLzs%2FVD8%2FJynFKSy02zE4CAFZ0JzQfAAAA){target=\_blank}和[MetaMask](/tokens/connect/metamask/){target=\_blank}一样是一个自托管（非托管）的钱包，目前支持iOS和安卓移动以及浏览器扩展程序。您现在可以在Coinbase Wallet上通过添加Moonbeam、Moonriver和Moonbase Alpha测试网为自定义网络并与其交互。

请注意Coinbase Wallet和Coinbase Exchange是两个完全不同的产品，Coinbase Exchange是一个用于买卖加密货币的托管式平台。在Coinbase Wallet上持有的Token并不代表也能用于Coinbase Exchange。如果您想要从您的Coinbase Wallet发送一些Coinbase Exchange暂未支持的Token至交易平台，这意味着您将永远丢失这些资产。

本教程将向您展示设置Coinbase Wallet移动端和浏览器应用程序并为其配置Moonbeam网络的步骤。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 安装Coinbase Wallet {: #install-coinbase-wallet }

您可以从iOS App商店和Google Play商店[下载Coinbase Wallet App](https://wallet.coinbase.com/?_branch_match_id=977295450874474909&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXT8%2FXS07SLddLzs%2FVD8%2FJynFKSy02zE4CAFZ0JzQfAAAA){target=\_blank}或从Chrome商店安装浏览器扩展程序。

移动端App和浏览器扩展程序基本相似，本教程以移动端App为例，但操作步骤也同样适用于浏览器扩展程序。主要区别在于，当您添加Moonbase Alpha作为自定义网络时，您可以在浏览器扩展程序上与网络交互，而移动端App尚未支持此功能。但此区别仅限于Moonbase Alpha。如果您连接的是Moonbeam或Moonriver，则您可以在移动端App或浏览器扩展程序进行连接。

## 创建钱包 {: #create-a-wallet }

安装后打开App，根据提示选择创建新钱包或导入现有钱包。本教程以创建一个新的钱包为例。首先，点击**Create a new wallet**创建新钱包。

随后，系统将提示您创建密码。完成密码输入后，您需要再次输入密码进行验证。

![Create an account on the Coinbase Wallet mobile app.](/images/tokens/connect/coinbase-wallet/coinbase-1.webp)

密码创建后即代表钱包已成功创建。最后一步是通过备份您的助记词已确保您的账户安全。为此，您需要执行以下步骤：

1. 导向至**Settings**页面
2. 从菜单栏选择**Security**
3. 点击您要备份助记词的钱包，该钱包名称旁边应显示**Not backed up**尚未备份
4. 输入密码
5. 选择备份助记词的方式有两种：一种是将助记词加密备份到iCloud (iOS)或Google Drive (Android)，另一种是手动保存该助记词，当然您也可以同时执行这两种操作。如果您要将助记词备份到iCloud或Google Drive，则必须创建一个密码来保护云端中的助记词。**此密码无法重置，因此请妥善保管**。如果您选择手动保存助记词，请确保以安全的方式进行存储
6. 完成所有步骤后，点击**Complete backup**

![Back up your wallet's recovery phrase through the settings menu.](/images/tokens/connect/coinbase-wallet/coinbase-2.webp)

!!! 注意事项
    如果您使用的是浏览器扩展程序，操作流程会有些许不同。系统会提示您立即备份钱包，并且您只能选择手动执行此操作。

恭喜您已完成设置步骤，您的钱包现已准备完毕。接下来，您可以将Coinbase Wallet连接至Moonbeam网络。

### 将Coinbase Wallet连接至Moonbeam {: #connect-coinbase-to-moonbeam }

尽管Coinbase Wallet有一个内置浏览器，但是目前暂不支持自动添加自定义网络，所以您可以手动添加网络详情。为此，请执行以下步骤：

 1. 导向至**Settings**标签
 2. 点击**Networks**
 3. 点击右上角的**+**图标
 4. 在这里，您可以为Moonbeam、Moonriver或Moonbase Alpha测试网填写网络详情

    === "Moonbeam"
        |           变量            |                                        值                                        |
        |:-------------------------:|:--------------------------------------------------------------------------------:|
        |       Network Name        |                                    `Moonbeam`                                    |
        |          RPC URL          |                     `{{ networks.moonbeam.public_rpc_url }}`                     |
        |          ChainID          | `{{ networks.moonbeam.chain_id }}` (hex: `{{ networks.moonbeam.hex_chain_id }}`) |
        |     Symbol (Optional)     |                                      `GLMR`                                      |
        | Block Explorer (Optional) |                     `{{ networks.moonbeam.block_explorer }}`                     |

    === "Moonriver"
        |           变量            |                                         值                                         |
        |:-------------------------:|:----------------------------------------------------------------------------------:|
        |       Network Name        |                                    `Moonriver`                                     |
        |          RPC URL          |                     `{{ networks.moonriver.public_rpc_url }}`                      |
        |          ChainID          | `{{ networks.moonriver.chain_id }}` (hex: `{{ networks.moonriver.hex_chain_id }}`) |
        |     Symbol (Optional)     |                                       `MOVR`                                       |
        | Block Explorer (Optional) |                     `{{ networks.moonriver.block_explorer }}`                      |

    === "Moonbase Alpha"
        |           变量            |                                        值                                        |
        |:-------------------------:|:--------------------------------------------------------------------------------:|
        |       Network Name        |                                 `Moonbase Alpha`                                 |
        |          RPC URL          |                        `{{ networks.moonbase.rpc_url }}`                         |
        |          ChainID          | `{{ networks.moonbase.chain_id }}` (hex: `{{ networks.moonbase.hex_chain_id }}`) |
        |     Symbol (Optional)     |                                      `DEV`                                       |
        | Block Explorer (Optional) |                     `{{ networks.moonbase.block_explorer }}`                     |

 5. 填写完成后点击**Add Network**

![Add Moonbeam as a custom network through the network settings.](/images/tokens/connect/coinbase-wallet/coinbase-3.webp)

返回**Networks**页面，您可以从**Custom**标签下看到已添加的网络。接下来，要与Moonbeam网络进行交互，您可以通过执行以下步骤将网络状态转换为**Active**：

1. 点击**Moonbeam**
2. 将屏幕划到底部，打开**Active network**按钮
3. 点击**Save**

![Set Moonbeam as the active network.](/images/tokens/connect/coinbase-wallet/coinbase-4.webp)

### 接收资金 {: #receiving-funds }

要查看和管理您的资产，您可以点击页面顶部导航栏菜单中的**Assets**。

您已根据上述教程创建了一新钱包，由于该钱包是新钱包，因此app显示的余额为`$0.00`，并且**Crypto**标签中未有任何资产。您可以通过发送一些GLMR至此账户来更改设置。要发送资金至您的Coinbase Wallet App，请执行以下步骤：

 1. 点击**Receive**
 2. 点击二维码图标或点击**Ethereum address**旁边的复制图标。Moonbeam兼容以太坊，因此您可以使用Moonbeam上提供的以太坊账户

![Copy your Ethereum address so you can receive funds.](/images/tokens/connect/coinbase-wallet/coinbase-5.webp)

现在，您已经有接收资金的地址了，您可以向改地址发送资金。想要查看资产是否达到账户，请确保您已在**Networks**设置中的网络配置页面激活了所选网络，具体步骤如[上一部分](#connect-coinbase-to-moonbeam)所述。

### 发送资金 {: #sending-funds }

要从您的Coinbase Wallet发送资金，请导向至**Assets**标签，并执行以下步骤：

 1. 点击**Send**
 2. 在下一个页面，输入您想要发送的资产数量
 3. 点击**Next**
 4. 输入接收地址
 5. 点击**Confirm**后继续
 6. 查看交易详情，确保无误后，点击**Send**
 7. 交易成功发送后，点击**Done**

![Send funds.](/images/tokens/connect/coinbase-wallet/coinbase-6.webp)

在**Transactions**标签下，您可以看到已传出的交易，包括接收地址、交易状态，以及发送的数量/金额。您可以点击每笔交易了解更多信息。

![View your transaction history from the transactions screen.](/images/tokens/connect/coinbase-wallet/coinbase-7.webp)

这样就可以了！您已成功设置您的Coinbase Wallet App，并将其连接至Moonbeam网络。另外，您也已成功学会如何发送和接收资金。

## 限制 {: #limitations }

 - 目前，Coinbase Wallet仅在您App的交易记录中显示传出交易。您可以通过区块浏览器（如[Moonscan](https://moonscan.io/){target=\_blank}）输入您的地址以查看您的完整交易记录，包括传入交易
 - 在Coinbase Wallet移动端App上，您可以将Moonbase Alpha添加为自定义网络。但是，您不能从App端看到余额或传送的交易。如果您想查看这类信息，您需要使用浏览器扩展程序

## 参考资料 {: #additional-resources }

 - [Coinbase Wallet常见问题](https://wallet.coinbase.com/faq/){target=\_blank}
 - [Coinbase Wallet入门教程](https://www.coinbase.com/wallet/getting-started-mobile){target=\_blank}

--8<-- 'text/_disclaimers/third-party-content.md'
