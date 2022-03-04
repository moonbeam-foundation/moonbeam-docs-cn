---
title: 使用Ledger
description: 本教程将引导您如何利用Moonbeam兼容以太坊的特性，使用Ledger硬件钱包在Moonbeam内签署交易。
---

# 使用Ledger硬件钱包与Moonbeam交互

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/ct4h9MN41j4' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## 概览 {: #introduction }

硬件钱包可提供一个相对安全的加密资产存储方式，因其私钥（用于签署交易）是以离线的方式储存。截至本教程撰写时，Ledger可提供两种硬件钱包的解决方案：Ledger Nano S和Ledger Nano X。

随着Moonriver应用在Ledger的上线，您现在无需与链上配置互动即可使用您的Ledger设备签署交易。如果您希望在基于Moonbeam的网络上使用您的Ledger设备，您可以在Ledger Live上的以太坊应用设置您的Chain ID。

您可以通过设置Chain ID在Ledger Live上使用Ethereum应用程序来连接Moonbeam、Moonriver 和 Moonbase Alpha测试网。Moonbeam的Chain ID是1284，Moonriver的Chain ID是1285，Moonbase Alpha的Chain ID是1287。

对于 Moonriver，您还可以选择在 Ledger Live 上使用专用的 Moonriver 应用程序，这样您就不必担心设置链 ID，并且您知道您已连接到正确的网络。请注意，Moonriver 应用程序只能用于连接 Moonriver 网络，不适用于 Moonbeam 或 Moonbase Alpha。

本教程将会带您了解如何在Moonbeam上开始使用您的Ledger硬件钱包。本教程仅包括使用Ledger Nano X设备的执行步骤，但这也同样适用于Ledger Nano S。

## 查看先决条件 {: #checking-prerequisites }

在您开始之前，请将您的[Ledger Live](https://www.ledger.com/ledger-live/download)更新至最新的可用版本。与此同时，请确认您的Ledger硬件钱包运行的是最新的固件。Ledger的技术支持网站有提供如何提升[Ledger Nano S](https://support.ledger.com/hc/en-us/articles/360002731113-Update-Ledger-Nano-S-firmware)和[Ledger Nano X](https://support.ledger.com/hc/en-us/articles/360013349800-Update-Ledger-Nano-X-firmware)设备固件的教程。

截至本教程撰写时，使用的版本如下：

 - [Ledger Live 2.35.1](https://support.ledger.com/hc/en-us/articles/360020773319-What-s-new-in-Ledger-Live-?docs=true)
 - [Ledger Nano S firmware v2.0.0](https://support.ledger.com/hc/en-us/articles/360010446000-Ledger-Nano-S-firmware-release-notes?docs=true)
 - [Ledger Nano X firmware v2.0.1](https://support.ledger.com/hc/en-us/articles/360014980580-Ledger-Nano-X-firmware-release-notes?docs=true)

除此之外，您还需要MetaMask作为您Ledger设备与Moonbeam之间的媒介，请确保您的MetaMask已经[连接至Moonbeam](/tokens/connect/metamask/)。

在[MetaMask的10.5.0版本](https://consensys.net/blog/metamask/metamask-and-ledger-integration-fixed/)，将您的Ledger设备连接至Chrome变得相对简单，您只需要安装最新版本的MetaMask应用即可。

## 安装Ledger Live应用 {: install-the-ledger-live-app }

您可以通过设置Chain ID在Ledger Live上使用Ethereum应用程序来连接Moonbeam、Moonriver 和 Moonbase Alpha测试网。

如果您希望连接至Moonriver，您可以在Ledger Live的应用目录选取Moonriver应用，但在这之前您需要先安装以太坊应用。因为Moonriver应用依赖于以太坊应用的功能，为确保流程无误，请先安装以太坊应用，再安装Moonriver应用。除此之外，对于其他基于Moonbeam的网络您只需要安装以太坊应用并在其后输入特定的Chain ID。

打开Ledger Live，然后：

1. 在菜单栏中选取**Manager**
2. 连接并解锁您的设备（这必须在安装前完成）
3. 在**App catalog**搜寻Ethereum（ETH）并点击**Install**。您的Ledger设备将会显示**Processing**，安装完毕后应用将会出现在您的Ledger设备中。
4. *这步仅适用于Moonriver* 在**App catalog**中搜寻Moonriver（MOVR）并点击**Install**。同样，您的Ledger设备将会显示**Processing**，并会在安装完毕后显示在您的Ledger设备中。

在Ledger Live应用中，您应能够看到以太坊或Moonriver应用出现在**Manager**页面上的**Apps installed**的标签下。确认已成功安装应用后，您可以关闭Ledger Live页面。

<img src="/images/tokens/connect/ledger/ledger-1.png" alt="Moonriver Ledger App Installed" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

## 将您的Ledger账户导入MetaMask {: #import-your-ledger-account-to-metamask }

当您已成功从Ledger Live安装了Moonriver或以太坊应用后，请将您的Ledger设备连接至电脑并将其解锁，然后再开启Moonriver应用。如果您使用的是Moonriver以外的基于Moonbeam的网络，您可以直接打开以太坊应用。随后，您可以根据以下步骤将您的Ledger账户导入MetaMask：

 1. 点击右上角的logo展开菜单栏

  2. 选取**Connect Hardware Wallet**

![MetaMask Connect Hardware Wallet](/images/tokens/connect/ledger/ledger-2.png)

进入下个页面后，选择您要在MetaMask使用的硬件钱包。截至本教程撰写时，仅支持Ledger和Trezor硬件钱包。您可以根据以下步骤进行操作：

 1. 选取Ledger logo

  2. 点击**Continue**

![MetaMask Select Ledger Hardware Wallet](/images/tokens/connect/ledger/ledger-3.png)

如果您使用的是Chrome或是基于Chrome的浏览器（如Brace），您将会需要通过WebHID选取您希望连接的Ledger设备：

1. 在弹窗中选取您的Ledger设备

2. 点击**Connect**

![Ledger on Chrome](/images/tokens/connect/ledger/ledger-4.png)

如果未出现弹窗，您将会需要修改您的MetaMask设定允许其使用WebHID连接。您可以根据以下步骤查看并更新您的MetaMask设定：

1. 展开右上角的菜单栏并进入**Settings**

2. 导向至**Advanced**

3. 下滑至**Preferred Ledger Connection Type**并在下拉列表中选取**WebHID**

!!! 注意事项

​    **Preferred Ledger Connection Type**设置仅能在Chrome或是基于Chrome的浏览器上使用。此设置不会出现在其他浏览器（如Firefox）。

如果MetaMask能成功连接至您的Ledger设备，您将能看到5个Moonbeam/以太坊式账户的列表。如果您并未见到上述画面，请检查Ledger Live是否已经关闭、是否已经将Ledger设备连接至您的电脑并成功解锁，以及是否成功开启Moonriver应用。如果您使用的是其他基于Moonbeam的网络，确保以太坊应用已经在您的Ledger设备上开启。

### 导入账户并查看余额 {: #import-accounts-and-view-balances }

在5个Moonbeam账户的列表中，根据以下步骤进行操作：

 1. 选取您希望从您的Ledger设备导入的账户

  2. 点击**Unlock**

![MetaMask Select Ethereum Accounts to Import](/images/tokens/connect/ledger/ledger-5.png)

如果您已经成功导入您的Ledger账户，您将能够在MetaMask页面上看到您的账户以及余额，如下图所示：

![MetaMask Successfully Imported Ledger Account](/images/tokens/connect/ledger/ledger-6.png)

您可以在MetaMask随时切换账户以查看您Ledger账户的余额。

您已经成功从您的Ledger设备导入一个Moonbeam兼容的账户，您可以开始使用您的Ledger设备进行互动。

## 获得Token {: #receive-tokens }

如果您希望开始使用您的Ledger设备进行交互，您将需要转入一些资金。您可以通过在MetaMask上点击您的账户名称和地址复制您的账户地址。

![MetaMask Copy Account](/images/tokens/connect/ledger/ledger-7.png)

接着，您将需要获取一些MOVR或是DEV Token并转入您所复制的账户地址。交易完成后，您将能看到余额更新。

如果您需要DEV Token用于测试Moonbase Alpha测试网，您可以至水龙头[获取Token](/builders/get-started/moonbase/#get-tokens)。

## 发送Token {: #send-tokens }

接着，您可以使用您的Ledger设备在Moonbeam上发送和签署交易。如果您希望开始发送交易，点击**Send**按钮：

![MetaMask Ledger Account Funded](/images/tokens/connect/ledger/ledger-8.png)

如同正常的交易，请设置接收人地址、输入发送金额、检查交易细节后并确认。这将会启用您Ledger设备的交易签名向导，您可以根据以下步骤进行操作：

 1. 点击按钮以进入下个画面，您的Ledger设备仅会在签署交易时提醒您

 2. 检查发送的Token数量并跳转至下个画面

 3. 检查接收人地址并进入下个画面

 4. *此步骤仅适用于以太坊应用*。检查网络的Chain ID。本信息可以在MetaMask连接至的网络信息内确认。举例而言，Moonbeam为1284（hex: 0x504）、Moonriver为1285（hex: 0x505）以及Moonbase Alpha的Chain ID是1287（hex: 0x507）。确认后，进入下个画面。

 5. 检查适用此交易的最大费用，这经由Gas费用乘以您在MetaMask上设置的Gas限制。确认完毕后，进入下个页面。

 6. 如果您同意所有的交易细节，请批准交易。这将会签署交易并触发MetaMask发送此交易。如果不同意交易细节，请进入下个页面

  7. 如果您不同意所有交易细节，请拒绝交易。这将会取消本次交易，MetaMask同时会将本次交易标注为失败。

![MetaMask Ledger Transaction Wizard](/images/tokens/connect/ledger/ledger-9.png)

在您通过交易之后，MetaMask将会将此发送至网络上。当交易被成功确认后，将会被显示在MetaMask的**Activity**标签中的**Send**一栏。

![MetaMask Ledger Transaction Wizard](/images/tokens/connect/ledger/ledger-10.png)

恭喜您已成功签署此交易并使用Ledger硬件钱包在Moonbeam发送一些Token。

## 使用您的Ledger与合约交互 {: #interact-with-contracts-using-your-ledger }

默认情况下，Ledger设备不接受交易对象中的`data`字段。因此，用户无法部署智能合约或与智能合约交互。

然而，如果您想要使用您的Ledger硬件钱包执行有关智能合约的交易，您需要修改以太坊应用中的配置参数。您可以跟随以下步骤进行操作：

 1. 在您的Ledger中，打开Moonriver或是以太坊应用

 2. 导向至**Settings**

 3. 找到**Blind signing**页面，它应出现在页面底部并显示**NOT Enabled**

  4. 选取这个选项并将其修改为**Enabled**

!!! 注意事项
    此选项对于您的Ledger设备与可能存在于Moonbeam生态系统的ERC-20 Token合约之间的交互是必要的。

![MetaMask Ledger Allow Contracts Tx](/images/tokens/connect/ledger/ledger-11.png)

--8<-- 'text/disclaimers/third-party-content.md'