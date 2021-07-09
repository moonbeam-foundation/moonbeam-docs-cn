---
title: Ledger
description: 通过本教程学习如何利用Moonbeam兼容以太坊的特性，使用Ledger硬件钱包在Moonbeam内签署交易
---

# Ledger硬件钱包

![Intro diagram](/images/ledger/ledger-banner.png)

## 概览

硬件钱包可提供一个相对安全的加密资产存储方式，因其密钥（用于签署交易）是以离线的方式储存。截至本教程撰写时，Ledger可提供两种硬件钱包的解决方案：Ledger Nano S和Ledger Nano X。

因为Moonbeam完全兼容以太坊的特性，且Ledger现在支持不同Chain ID网络的签署，您能够使用Ledger装置在Moonbeam签署交易！

本教程将会带您了解如何在Moonbase Alpha上开始使用您的Ledger硬件钱包。本教程仅包括使用Ledger Nano X设备的执行步骤，但这也适用于Ledger Nano S。同样的步骤也可以在Moonbeam生态系统的其他网络实行。

## 查看先决条件

在您开始之前，请将您的[Ledger Live](https://www.ledger.com/ledger-live/download)更新至最新的可用版本。与此同时，请确认您的Ledger硬件钱包运行的是最新的固件。Ledger的技术支持网站有提供如何提升[Ledger Nano S](https://support.ledger.com/hc/en-us/articles/360002731113-Update-Ledger-Nano-S-firmware)和[Ledger Nano X](https://support.ledger.com/hc/en-us/articles/360013349800-Update-Ledger-Nano-X-firmware)设备固件的教程。

当您确认您所运行的是最新版本的固件，请确保您同时运行的是最新的以太坊应用。Ledger的技术支持网站同样提供了[如何安装以太坊应用的教程](https://support.ledger.com/hc/en-us/articles/360009576554-Ethereum-ETH-)。

截至本教程撰写时，使用的版本如下：

 - Ledger Live 2.29
 - Ledger Nano S firmware v2.0.0
 - Ledger Nano X firmware v1.3.0
 - Ethereum app v1.8.5

除此之外，您还需要MetaMask作为您Ledger设备与Moonbase Alpha之间的媒介，请确保您的[MetaMask已成功连接至Moonbase Alpha](/integrations/wallets/metamask/)。谷歌浏览器的用户（v91）需要额外的步骤，具体可以参考[此教程](#谷歌浏览器)；火狐的用户则会有较为直观和简易的使用体验。

请注意，您的Ledger设备会在您连接至MetaMask的网络内签署交易。

## 将您的Ledger账户导入MetaMask

首先，您需要将您的Ledger设备连接至电脑并将其解锁，打开以太坊应用。接下来，请跟随以下步骤，将您的Ledger以太坊账户导入MetaMask中：

 1. 点击右上角的logo展开使用菜单
 2. 选取“连接硬件钱包“

![MetaMask Connect Hardware Wallet](/images/ledger/ledger-images1.png)

进入下个页面后，选择您要在MetaMask使用的硬件钱包。截至本教程撰写时，仅支持Ledger和Trezor硬件钱包。您可以根据以下步骤进行操作：

 1. 点选Ledger logo
 2. 点击“继续”

![MetaMask Select Ledger Hardware Wallet](/images/ledger/ledger-images2.png)

如果MetaMask已经成功连接至您的Ledger设备，您将能看到五个以太坊式的账户。相反地，如果您没有看到账户的画面，请在此确认您已经将Ledger Live关闭，Ledger设备已成功连接至电脑并解锁，且已开启以太坊应用。如果您使用的是谷歌浏览器，请查看这些[额外步骤](#谷歌浏览器)。

在五个以太坊式账户列表中，请跟随以下步骤：

 1. 选取您想从您Ledger设备导入的账户
 2. 点击“解锁”

![MetaMask Select Ethereum Accounts to Import](/images/ledger/ledger-images3.png)

如果您成功将您Ledger的以太坊式账户导入MetaMask，您将能在MetaMask主页看到以下画面：

![MetaMask Successfully Imported Ledger Account](/images/ledger/ledger-images4.png)

您现在已成功从Ledger设备导入一个兼容Moonbeam的账户且准备好[使用您的硬件钱包签署交易](#使用您的Ledger签署交易)。

### 谷歌浏览器

在谷歌浏览器的版本91（v91），希望将Ledger设备连接至MetaMask的用户需要运行Ledger Live的最新版本（截至本教程撰写时为v2.29）。

除此之外，在MetaMask内也需要开启支持Ledger Live的功能，您可以使用以下步骤进行操作：

 1. 展开右上角的菜单，点击“设置”
 2. 点击“高级选项”
 3. 开启“使用Ledger Live”

随着此功能的开启，MetaMask将会在尝试连接您的Ledger设备时开启Ledger Live。如果您想了解更多，可以查看[此MetaMask博客文章](https://metamask.zendesk.com/hc/en-us/articles/360020394612-How-to-connect-a-Trezor-or-Ledger-Hardware-Wallet)。

## 使用您的Ledger签署交易

如果您已成功[将您的Ledger账户导入MetaMask](#将您的Ledger账户导入MetaMask)，并准备好使用您的Ledger设备在Moonbeam上签署交易。本教程将会带您了解如何在Moonbase Alpha测试网传送一个基础的交易，这些步骤同样适用于Moonbeam生态系统的其他网络。

首先，确保您的Ledger账户[有足够的DEV Token](/getting-started/moonbase/faucet/)。接着，点击“发送”按钮。

![MetaMask Ledger Account Funded](/images/ledger/ledger-images5.png)

如同操作一个标准的交易，您要设置接收方的地址，输入您想发送的Token数量，确认交易细节后点击确认。这会在您的Ledger设备开启一个交易签署指示，您可以跟随以下步骤进行操作：

 1. 点击按钮以进入下一个画面。您的Ledger设备将会提醒您检查本次交易
 2. 检查将要发送的Token数量。请注意，Token对应于MetaMask所连接的网络。**在这里是DEV Token，不是ETH！**检查完毕后，进入下一个画面
 3. 检查接收方地址后，进入下一个画面
 4. 检查网络的Chain ID，您可以通过此信息确认MetaMask所连接到的网络。举例而言，Moonbase Alpha的Chain ID是1287，Moonriver是1285（尚未上线），Moonbeam是1284（尚未上线）。检查完毕后，进入下一个页面。
 5. 检查适用于本次交易的最高费用，由Gas费乘以您在MetaMask设置的Gas限制计算。检查完毕后，进入下一个页面
 6. 如果您同意所有交易的细节则可以通过本次交易。这将会签署交易并通过MetaMask发送。如果您不同意，则进入下一个页面
 7. 如果您不同意所有的交易细节，请拒绝。这将会取消交易而MetaMsk会将本次交易标记为失败。

!!! 注意事项
    截至本教程撰写时所显示的Token一直是`ETH`。请注意，所使用的Token是对应与MetaMask所连接的网络。

![MetaMask Ledger Transaction Wizard](/images/ledger/ledger-images6.png)

在您通过交易之后，MetaMask会将其发送至网络。当交易确认完成，MetaMask的主画面将会显示“发送”。

![MetaMask Ledger Transaction Wizard](/images/ledger/ledger-images7.png)

就这样！您已经成功在Moonbase Alpha使用您的Ledger硬件钱包签署交易！

## 使用您的Ledger与合约交互

默认情况下，Ledger设备不接受交易对象中的`data`字段。因此，用户无法部署智能合约或与智能合约交互。

然而，如果您想要使用您的Ledger硬件钱包执行有关智能合约的交易，您需要修改以太坊应用中的配置参数。您可以跟随以下步骤进行操作：

 1. 打开Ledger以太坊应用
 2. 导航至“设定”
 3. 找到“合约数据“页面，它应出现在页面底部并显示“不允许”。
 4. 选取这个选项并将其修改为“允许”

!!! 注意事项
    此选项对于您的Ledger设备与可能存在于Moonbeam生态系统的ERC20 Token合约之间的交互是必要的。

![MetaMask Ledger Allow Contracts Tx](/images/ledger/ledger-images8.png)