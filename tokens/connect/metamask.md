---
title: 如何连接MetaMask
description: 通过此教程学习如何将MetaMask（一个基于浏览器的以太坊钱包）连接至基于Moonbeam的网络，并转移资金。
---

# 使用MetaMask与Moonbeam交互

## 概览 {: #introduction }

开发人员可以利用Moonbeam与以太坊兼容的特色，将一些[MetaMask](https://metamask.io/){target=_blank}等工具整合至DApp中。如此一来，就可以使用MetaMask提供的库与要部署的链相交互。

目前为止，MetaMask可以配置并连接的网络包括：Moonbeam、Moonriver、Moonbase Alpha测试网和Moonbeam开发节点。

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

!!! 注意事项
    MetaMask将会跳出弹框，要求授权添加自定义网络。经授权后，MetaMask会将切换至您当前的网络。

学习[如何将连接MetaMask按钮集成](/builders/integrations/wallets/metamask/){target=_blank}至您的dApp，便于用户只需单击按钮即可连接至Moonbase Alpha。本教程也同样适用于其他基于Moonbeam的网络。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 安装MetaMask扩展程序 {: #install-the-metamask-extension }

首先，从谷歌Chrome浏览器的网上应用商店安装全新且默认的[MetaMask](https://metamask.io/){target=_blank}。下载、安装和初始化该扩展程序后，遵循**Get Started**指南进行设置。您需要创建一个MetaMask钱包，设置密码并储存您的助记词（请妥善保存您的助记词，该助记词将用于授权您账户中的资金）。

## 创建钱包 {: #setup-a-wallet }

[MetaMask](https://metamask.io){target=_blank}安装完毕后，将会自动跳出一个带有新任务的欢迎页面。此处，您有两个选项：

- **创建新钱包** - 您将完成一些步骤来获取新的助记词。请安全存储此助记词，切勿将其分享与他人
- **导入现有钱包** - 您已存储助记词，并且想要从该助记词恢复账户

![Metamask Setup Interface](/images/tokens/connect/metamask/metamask-1.png)

根据您的个人需求选择，然后遵循步骤进行操作，即可完成设置。

!!! 注意事项
    通过更改已知的地址索引，可以从助记词派生出多个账户。默认情况下，当从助记词创建或导入账户时，您会获得地址索引为0的账户。您只需在MetaMask主屏幕中添加新账户即可获得其他索引。

## 导入账户 {: #import-accounts }

当您创建钱包或导入现有钱包后，您还可以选择导入任何您持有私钥的账户至MetaMask。

在本示例中，您将从开发账户使用私钥。点击切换账户的按钮，使用私钥导入账户。此处显示的为**Account 1**。

![Importing account from private key metamask menu](/images/tokens/connect/metamask/metamask-2.png)

接下来，点击**Import Account**。

![Importing account from private key account switcher menu](/images/tokens/connect/metamask/metamask-3.png)

最后，输入您要导入的账户私钥。举例来说，您可以使用在Moonbeam开发节点中预先提供资金的账户之一。本教程将使用Gerald的密钥。输入私钥后，点击**Import**。

??? 注意事项 "开发账户地址和私钥"
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/dev-accounts.md'
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/dev-testing-account.md'

![Paste your account key into MetaMask](/images/tokens/connect/metamask/metamask-4.png)

导入后将出现如下图所示的**Account 2**：

![MetaMask displaying your new Account 2](/images/tokens/connect/metamask/metamask-5.png)

## 将MetaMask连接至Moonbeam {: #connect-metamask-to-moonbeam }

当您完成安装[MetaMask](https://metamask.io/)，并创建或导入账户后，您可以将其连接至任何基于Moonbeam的网络。随后，请遵循以下步骤：

1. 点击页面左上角的网络选择菜单栏
2. 选择**Add Network**添加网络

![Add new network in Metamask menu](/images/tokens/connect/metamask/metamask-6.png)

然后，前往页面底部，点击**Add a network manually**手动添加网络：

![Add network manually in Metamask](/images/tokens/connect/metamask/metamask-7.png)

您可在此处使用以下网络为MetaMask进行配置：

=== "Moonbeam"
    |           变量            |                                        值                                        |
    |:-------------------------:|:--------------------------------------------------------------------------------:|
    |       Network Name        |                                    `Moonbeam`                                    |
    |          RPC URL          |                     `{{ networks.moonbeam.public_rpc_url }}`                     |
    |         Chain ID          | `{{ networks.moonbeam.chain_id }}` (hex: `{{ networks.moonbeam.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                      `GLMR`                                      |
    | Block Explorer (Optional) |                     `{{ networks.moonbeam.block_explorer }}`                     |

=== "Moonriver"
    |           变量            |                                         值                                         |
    |:-------------------------:|:----------------------------------------------------------------------------------:|
    |       Network Name        |                                    `Moonriver`                                     |
    |          RPC URL          |                     `{{ networks.moonriver.public_rpc_url }}`                      |
    |         Chain ID          | `{{ networks.moonriver.chain_id }}` (hex: `{{ networks.moonriver.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                       `MOVR`                                       |
    | Block Explorer (Optional) |                     `{{ networks.moonriver.block_explorer }}`                      |

=== "Moonbase Alpha"
    |           变量            |                                        值                                        |
    |:-------------------------:|:--------------------------------------------------------------------------------:|
    |       Network Name        |                                 `Moonbase Alpha`                                 |
    |          RPC URL          |                        `{{ networks.moonbase.rpc_url }}`                         |
    |         Chain ID          | `{{ networks.moonbase.chain_id }}` (hex: `{{ networks.moonbase.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                      `DEV`                                       |
    | Block Explorer (Optional) |                     `{{ networks.moonbase.block_explorer }}`                     |

=== "Moonbeam Dev Node"
    |           变量            |                                           值                                           |
    |:-------------------------:|:--------------------------------------------------------------------------------------:|
    |       Network Name        |                                     `Moonbeam Dev`                                     |
    |          RPC URL          |                          `{{ networks.development.rpc_url }}`                          |
    |         Chain ID          | `{{ networks.development.chain_id }}` (hex: `{{ networks.development.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                         `DEV`                                          |
    | Block Explorer (Optional) |                      `{{ networks.development.block_explorer }}`                       |

首先，请填写以下信息：

1. **Network name** - 您要连接的网络名称
2. **RPC URL** - 网络的[RPC端点](/builders/get-started/endpoints/){target=_blank}
3. **Chain ID** - 以太坊兼容网络的chain ID
4. **Symbol** -（可选）网络原生Token的符号。以Moonbeam为例，其原生Token的符号为**GLMR**
5. **Block Explorer** -（可选）[区块浏览器](/builders/get-started/explorers/){target=_blank}的URL
6. 确认所有信息无误后，点击**Save**保存信息

![Add network in Metamask](/images/tokens/connect/metamask/metamask-8.png)

随后，网络将跳出弹窗说明您已成功添加网络。此外，系统还会提示您**Switch to Moonbase Alpha**切换至Moonbase Alpha，即本示例中添加的网络。

![Successfully added a network in Metamask](/images/tokens/connect/metamask/metamask-9.png)

## 与网络交互 {: #interact-with-the-network }

当您[将MetaMask连接](#connect-metamask-to-moonbeam)至任何基于Moonbeam网络后，您可以通过以下方式开始使用钱包：

- 将Token转移至另一个地址
- 添加ERC-20至MetaMask并与其交互
- 添加ERC-721至MetaMask并与其交互

### 发起一笔转账 { #initiate-a-transfer }

此部分将展示如何在Moonbeam使用MetaMask向另一个地址发起一笔简单的Token转账。

为此，请执行以下步骤：

1. 确保您已连接至正确的网络
2. 确保您已选择即将用于转账的账户
3. 在MetaMask钱包的主屏幕，点击**Send**按钮

![Initiate balance transfer in Metamask](/images/tokens/connect/metamask/metamask-10.png)

接下来，您要输入发送Token的地址。在本示例中，我们将选择已经导入MetaMask的钱包，即**Bob**。

![Select account to send tokens to in Metamask](/images/tokens/connect/metamask/metamask-11.png)

在下一个页面，执行以下步骤：

1. 输入要发送的Token数量
2. 确认所有信息无误后，点击**Next**按钮

![Set the amount of tokens to send in Metamask](/images/tokens/connect/metamask/metamask-12.png)

最后，确认所有gas相关的参数和费用是否准确。如果一切信息无误后，点击**Confirm**按钮。随后，交易将发送至网络！

![Confirming a transaction in Metamask](/images/tokens/connect/metamask/metamask-13.png)

交易确认后，返回钱包主屏幕，您会看到交易处于**Pending**待处理状态。约一分钟后，交易应被**Confirmed**确认处理。如果您点击交易，可以在区块浏览器中查看更多详情。

![Transaction confirmed in Metamask](/images/tokens/connect/metamask/metamask-14.png)

### 添加ERC-20 Token {: #add-an-erc20-token }

要添加ERC-20至MetaMask钱包，您需要使用其地址导入Token：

1. 确保已在MetaMask切换至**Tokens**标签
2. 点击**Import tokens**
3. 输入要导入的Token合约地址。**Token symbol**和**Token decimal**会自动填充，若需要您可以编辑**Token symbol**
4. 点击**Next**

![The tokens tab and the import tokens process in MetaMask, where the token address, symbol, and decimal are defined.](/images/tokens/connect/metamask/metamask-15.png)

接下来，您需要确认Token导入的信息。确认信息无误后，点击**Import**。

![Review the token details and finalize the import in MetaMask.](/images/tokens/connect/metamask/metamask-16.png)

在**Tokens**标签下，您能够看到Token和账户余额。

![View the imported token in the list of assets on the tokens tab in MetaMask.](/images/tokens/connect/metamask/metamask-17.png)

### 添加ERC-721 Token {: #add-an-erc721-token }

要添加ERC-721至您的MetaMask钱包，您将需要Token地址：

1. 确保已在MetaMask切换至**NFTs**标签
2. 点击**Import NFT**
3. 输入要导入的NFT的**Address**地址以及**Token ID**
4. 点击**Import**

![The NFTs tab and the import NFT process in MetaMask, where the address and the token ID of the NFT are defined.](/images/tokens/connect/metamask/metamask-18.png)

导入NFT后，您可以在**NFTs**标签下查看NFT。点击NFT查看更多详情。

![View the imported NFT in the list of NFTs on the NFTs tab in MetaMask.](/images/tokens/connect/metamask/metamask-19.png)

--8<-- 'text/_disclaimers/third-party-content.md'
