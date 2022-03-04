---
title: 使用Coinbase Wallet
description: 本教程讲引导您如何使用Coinbase Wallet扩展程序和移动端App
---

# 使用Coinbase Wallet移动端App与Moonbeam交互

![Coinbase Wallet Banner](/images/tokens/connect/coinbase-wallet/coinbase-wallet-banner.png)

## 概览 {: #introduction }

[Coinbase Wallet](https://wallet.coinbase.com/?_branch_match_id=977295450874474909&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXT8%2FXS07SLddLzs%2FVD8%2FJynFKSy02zE4CAFZ0JzQfAAAA)和[MetaMask](/tokens/connect/metamask/)一样是一个自托管（非托管）的钱包，目前支持iOS和安卓移动端。另外，Coinbase Wallet也有浏览器扩展程序版本，但是该扩展程序目前暂不支持添加自定义网络，因此与Moonbeam不兼容。Coinbase Wallet是一个完全不同于Coinbase Exchange（一个用于买卖加密货币的托管式平台）的产品。您现在可以在Coinbase Wallet上通过添加Moonbeam、Moonriver和Moonbase Alpha测试网为自定义网络并与其交互。

本教程将向您展示设置Coinbase Wallet移动端应用程序并为其配置Moonbeam网络的步骤。

## 安装Coinbase Wallet App {: #install-the-coinbase-wallet-app }

您可以从iOS App商店和Google Play商店[下载Coinbase Wallet App](https://wallet.coinbase.com/?_branch_match_id=977295450874474909&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXT8%2FXS07SLddLzs%2FVD8%2FJynFKSy02zE4CAFZ0JzQfAAAA)。

## 创建钱包 {: #create-a-wallet }

安装后打开App，根据提示选择创建新钱包或导入现有钱包。本教程以创建一个新的钱包为例。首先，系统将提示您阅读法律使用条款。随后，您需创建一个独一无二的用户名。如果您想要设置您的用户名对其他钱包用户不可见，请选择**private**。接下来，您将看到您钱包的助记词。请知晓您的助记词可直接访问您的资金，确保将其存储在安全的地方，切勿与他人分享。

![Coinbase Wallet Image 1](/images/tokens/connect/coinbase-wallet/coinbase-wallet-1.png)

现在，系统将提示您创建密码或者您可以使用手机自带的认证方式如人脸识别。下一个页面将提醒您备份助记词的重要性。在iOS版本，您可以选择将您的助记词备份至iCloud，或者您可以手动保存这些助记词。在接下来的页面，将要求您确认您的助记词。友情提示：您的助记词可直接获取您的资金，请勿与他人分享。

![Coinbase Wallet Image 2](/images/tokens/connect/coinbase-wallet/coinbase-wallet-2.png)

恭喜您已完成设置步骤，您的钱包现已准备完毕。接下来，您可以连接Coinbase Wallet至Moonbeam网络。

## 连接Coinbase Wallet至Moonbeam {: #connect-coinbase-wallet-extension-to-moonbeam }

尽管Coinbase Wallet有一个内置浏览器，但是目前暂不支持自动添加自定义网络，所以您可以手动添加网络详情。为此，请执行以下步骤：

 1. 通过底部工具栏上的按钮导向至Settings标签

 2. 点击**Default Network**

 3. 点击右上角的**+**图标

 4. 在这里，您可以为Moonbeam、Moonriver或Moonbase Alpha测试网填写网络详情。完成后点击**Save**

 5. 返回至默认网络页面，您可以将默认网络切换至Moonbeam或Moonriver

![Coinbase Wallet Image 3](/images/tokens/connect/coinbase-wallet/coinbase-wallet-3.png)

每个网络的所有相关参数如下所示：

=== "Moonbeam"
    |         变量          |                                      值                                       |
    |:-------------------------:|:--------------------------------------------------------------------------------:|
    |       Network Name        |                                    `Moonbeam`                                    |
    |          RPC URL          |                        `{{ networks.moonbeam.rpc_url }}`                         |
    |          ChainID          | `{{ networks.moonbeam.chain_id }}` (hex: `{{ networks.moonbeam.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                      `GLMR`                                      |
    | Block Explorer (Optional) |                     `{{ networks.moonbeam.block_explorer }}`                     |

=== "Moonriver"
    |         变量          |                                       值                                        |
    |:-------------------------:|:----------------------------------------------------------------------------------:|
    |       Network Name        |                                    `Moonriver`                                     |
    |          RPC URL          |                         `{{ networks.moonriver.rpc_url }}`                         |
    |          ChainID          | `{{ networks.moonriver.chain_id }}` (hex: `{{ networks.moonriver.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                       `MOVR`                                       |
    | Block Explorer (Optional) |                     `{{ networks.moonriver.block_explorer }}`                      |

=== "Moonbase Alpha"
    |         变量          |                                      值                                       |
    |:-------------------------:|:--------------------------------------------------------------------------------:|
    |       Network Name        |                                 `Moonbase Alpha`                                 |
    |          RPC URL          |                        `{{ networks.moonbase.rpc_url }}`                         |
    |          ChainID          | `{{ networks.moonbase.chain_id }}` (hex: `{{ networks.moonbase.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                      `DEV`                                       |
    | Block Explorer (Optional) |                     `{{ networks.moonbase.block_explorer }}`                     |

## 接收资金 {: #receiving-funds }

您已根据上述教程创建了一个新钱包，因此App将显示一个包含**No coins found**消息的空白主屏幕。您可以通过发送一些GLMR至此账户来更改设置。要发送资金至您的Coinbase Wallet App，请执行以下步骤：

 1. 在App的Wallet标签（或主屏幕），点击**Receive**

 2. 搜索"GLMR"

 3. 点击**Moonbeam** 

  4. 在下一页面，您将看到您地址的二维码。点击**Share address**将您的地址发送至另一台设备

出于演示目的，我们将发送1枚GLMR至该Coinbase Wallet账户。在下一部分，您将学习如何从Coinbase Wallet App发送资金。

![Receiving funds](/images/tokens/connect/coinbase-wallet/coinbase-wallet-4.png)

## 发送资金 {: #sending-funds }

要从您的Coinbase Wallet发送资金，在App的Wallet标签（或主屏幕）点击您要发送的资产类别，随后请执行以下步骤：

 1. 点击**Send**

 2. 在下一页面，输入您想要发送的资产数量。如果您想要选择不同的资产类别，在底部点击资产名称

 3. 点击**Next**

 4. 点击**Details**查看交易Gas费用。Moonbeam没有矿工，该词汇在这里默认为工作量证明网络

  5. 查看交易详情，确定无误后点击**Send**

![Send funds](/images/tokens/connect/coinbase-wallet/coinbase-wallet-5.png)

这样就可以了！您已成功设置您的Coinbase Wallet App，将其连接至Moonbeam网络。另外，您也已成功学会如何发送和接收资金。


## 限制 {: #limitations }

 - 目前，Coinbase Wallet仅在您App的交易记录中显示传出交易。您可以通过区块浏览器（如[Moonscan](https://moonscan.io/)）输入您的地址以查看您的完整交易记录，包括传入交易
 - Coinbase Wallet暂不支持导入或导出私钥。如果您需要导入其他现有账户至您的钱包，您可以使用其他钱包，如[MetaMask](/tokens/connect/metamask/)
 - 请注意Coinbase Wallet和Coinbase Exchange是两个完全不同的产品，在Coinbase Wallet上持有的Token并不代表也能用于Coinbase Exchange。如果您想要从您的Coinbase Wallet发送一些Coinbase Exchange暂未支持的Token至交易平台，这意味着您将永远丢失这些资产。

## 参考内容 {: #additional-resources }

 - [Coinbase Wallet常见问题](https://wallet.coinbase.com/faq/)
 - [Coinbase Wallet入门教程](https://www.coinbase.com/wallet/getting-started-mobile)

 --8<-- 'text/disclaimers/third-party-content.md'