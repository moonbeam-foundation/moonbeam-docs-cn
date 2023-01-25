---
title: Ethereum App
description: 本教程将引导您如何使用您的Ledger硬件钱包通过Ledger Live上的Ethereum app在基于Moonbeam的网络内签署交易。
---

# 使用Ledger和Ethereum App与Moonbeam交互

![Intro banner](/images/tokens/connect/ledger/ledger-banner.png)

## 概览 {: #introduction }

硬件钱包可提供一个相对安全的加密资产存储方式，因其私钥（用于签署交易）是以离线的方式储存。截至本教程撰写时，Ledger可提供两种硬件钱包的解决方案：Ledger Nano S和Ledger Nano X。

对于Moonbeam、Moonriver和Moonbase Alpha测试网，您可以通过设置chain ID在Ledger Live上使用Ethereum app。Moonbeam的chain ID为1284，Mioonriver的chain ID为1285，而Moonbase Alpha的chain ID为1287。

对于Moonbeam和Moonriver，您也可以选择在Ledger Live上使用专用的[Moonbeam app](/tokens/connect/ledger/moonbeam/){target=_blank}或[Moonriver app](/tokens/connect/ledger/moonriver/){target=_blank}，此方式无需设置chain ID即可连接至正确的网络。请注意您只能使用Moonbeam app连接至Moonbeam网络，而Moonriver app只能用于连接Moonriver网络。这些专用app无法用于其他基于Moonbeam的网络。

在本教程中，您将学会如何使用Ethereum app在Moonbeam开始使用您的Ledger硬件钱包。本教程以Ledger Nano X设备为例进行演示操作，但操作步骤也同样适用于Ledger Nano S。

--8<-- 'text/disclaimers/third-party-content-intro.md'

--8<-- 'text/ledger/checking-prereqs.md'

--8<-- 'text/ledger/checking-prereqs-ll.md'

## 安装Ledger Live App {: install-the-ledger-live-app }

如果您想要连接至Moonbeam、Moonriver或Moonbase Alpha测试网，您可以通过安装Ethereum app来实现，随后您将需要指定chain ID。

--8<-- 'text/ledger/install-eth-app.md'

在Ledger Live app，您将在**Manager**页面的**Apps installed**标签下看到您所安装的app。app成功安装后，您可以关闭Ledger Live。

<img src="/images/tokens/connect/ledger/ethereum/ledger-1.png" alt="Moonriver Ledger App Installed" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

## 将您的Ledger账户导入MetaMask {: #import-your-ledger-account-to-metamask }

现在您已成功在Ledger Live上安装了app，接下来您可以将您的Ledger连接至电脑并将其解锁，然后打开Ethereum app。

--8<-- 'text/ledger/import-ledger/step-1.md'

![MetaMask Connect Hardware Wallet](/images/tokens/connect/ledger/ethereum/ledger-2.png)

--8<-- 'text/ledger/import-ledger/step-2.md'

![MetaMask Select Ledger Hardware Wallet](/images/tokens/connect/ledger/ethereum/ledger-3.png)

--8<-- 'text/ledger/import-ledger/step-3.md'

![Ledger on Chrome](/images/tokens/connect/ledger/ethereum/ledger-4.png)

--8<-- 'text/ledger/import-ledger/step-4.md'

如果MetaMask能成功连接至您的Ledger设备，您将能看到一个包含5个Moonbeam/以太坊式账户的列表。如果您并未见到上述画面，请再次检查Ledger Live是否已关闭、Ledger设备是否已连接至您的电脑并成功解锁，并确保Ethereum app已开启。

--8<-- 'text/ledger/import-accounts.md'

![MetaMask Select Ethereum Accounts to Import](/images/tokens/connect/ledger/ethereum/ledger-5.png)

如果您已成功导入您的Ledger账户，您将能够在MetaMask页面上看到您的账户以及余额，如下图所示：

![MetaMask Successfully Imported Ledger Account](/images/tokens/connect/ledger/ethereum/ledger-6.png)

您可以在MetaMask随时切换账户以查看您导入的Ledger账户余额。

您已经成功从您的Ledger设备导入一个兼容Moonbeam的账户，现在您可以开始使用您的Ledger设备进行交互。

--8<-- 'text/ledger/receive-tokens.md'


![MetaMask Copy Account](/images/tokens/connect/ledger/ethereum/ledger-7.png)

接下来，您将需要获取一些GLMR、MOVR或DEV Token并转入您所复制的账户地址。交易完成后，您将能看到余额更新。

--8<-- 'text/faucet/faucet-sentence.md'

## 发送Token {: #send-tokens }

接着，您可以使用您的Ledger设备在Moonbeam上发送和签署交易。如果您希望开始发送交易，点击**Send**按钮：

![MetaMask Ledger Account Funded](/images/tokens/connect/ledger/ethereum/ledger-8.png)

--8<-- 'text/ledger/send-tokens/set-of-steps-1.md'
4. 检查网络的chain ID。此信息可以在MetaMask连接至的网络内确认。Moonbeam的chain ID为1284 (hex: 0x504)，Moonriver的为1285 (hex: 0x505)，以及Moonbase Alpha的为1287 (hex: 0x507)。确认后，进入下个页面

5. 检查适用此交易的最大费用，这是Gas费用乘以您在MetaMask上设置的Gas限制。确认后，进入下个页面

6. 如果您同意所有交易细节，请批准交易。这将会签署交易并触发MetaMask发送此交易。如果您不同意交易细节，请拒绝交易。这将会取消本次交易，MetaMask同时会将本次交易标注为失败

![MetaMask Ledger Transaction Wizard](/images/tokens/connect/ledger/ethereum/ledger-9.png)

在您通过交易之后，MetaMask会将此发送至网络上。当交易被成功确认后，将会被显示在MetaMask的**Activity**标签中的**Send**一栏。

![MetaMask Ledger Transaction Wizard](/images/tokens/connect/ledger/ethereum/ledger-10.png)

这样就可以了！您已成功签署交易并使用您的Ledger硬件钱包在Moonbeam上发送一些Token。

--8<-- 'text/ledger/blind-signing.md'

![MetaMask Ledger Allow Contracts Tx](/images/tokens/connect/ledger/ethereum/ledger-11.png)

--8<-- 'text/ledger/ledger-live.md'

--8<-- 'text/disclaimers/third-party-content.md'