---
title: Moonbeam Safe多签钱包
description: 学习如何通过Moonbeam Safe多签钱包使用和管理资金。在Moonbeam上创建一个新的多重签名钱包并接收和发送Token（以及ERC-20 Token）至Safe钱包。
---

# 与Moonbeam Safe多签钱包交互

## 概览 {: #introduction }

单签名钱包（简称singlesig）是一种只有一个所有者持有私钥的钱包，可以控制账户持有的所有资产。因此，如果私钥丢失将导致永久无法访问钱包并损失资金。

为解决此问题，多重签名钱包（简称multisig）应运而生。多重签名钱包需要至少有两个及以上的所有者持有私钥。如果其中一人失了私钥，其他人仍然可以访问钱包和资金。此外，多重签名钱包可能需要阈值签名，只有获得一定数量的授权，提案才能通过并执行交易。这为资产创建了一个额外的安全层。

为了帮助管理单签名钱包和多重签名钱包，[Gnosis Safe](https://gnosis-safe.io/){target=\_blank}被fork创建了[Moonbeam Safe](https://multisig.moonbeam.network/){target=\_blank}。Safe钱包可以配置为多重签名合约，允许两个或更多所有者持有资金并从Safe钱包转移资金。您还可以将Safe钱包配置为只有一个所有者的单签名合约。

本教程将引导您如何在Moonbase Alpha测试网上创建多重签名Safe钱包。您还将学习如何将DEV和ERC-20 Token发送至Safe钱包或从Safe钱包发送，以及如何使用Safe钱包与智能合约进行交互。本教程也适用于Moonbeam和Moonriver。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 查看先决条件 {: #checking-prerequisites }

首先，您需要准备几个资金充裕的[MetaMask账户](#metamask-accounts)和一些准备发送至Safe钱包的[ERC-20 Token](#erc20-tokens)，以及一个[已部署的智能合约](#deployed-smart-contract)进行交互。

### MetaMask账户 {: #metamask-accounts }

在本教程中，您将在Moonbase Alpha上创建一个Safe钱包与其交互并管理您的资金。要连接至Safe钱包，您需要执行以下操作：

 - 安装MetaMask并[连接至Moonbase Alpha](/tokens/connect/metamask/)
 - 需要准备至少两个资金充裕的账户 
 --8<-- 'text/_common/faucet/faucet-list-item.md'

您将需要至少两个帐户，因为您将设置一个具有3个所有者的多重签名Safe钱包，并且需要获得2/3的签名确认才能执行任何交易。因此，在本教程中，您需要在至少两个帐户之间来回切换才能确认和发送交易。

本教程将使用以下账户：

 - **Alice** — 0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
 - **Bob** — 0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0
 - **Charlie** — 0x798d4Ba9baf0064Ec19eB4F0a1a45785ae9D6DFc

### ERC-20 Tokens {: #erc20-tokens }

本教程的后半部分将引导您如何在Safe钱包发送和接收ERC-20 Token。因此，您需要部署一些ERC-20 Token并将其添加至您的MetaMask帐户中。您可以查看[使用Remix部署至Moonbeam](/builders/interact/remix/)操作教程，特别是[在Moonbeam上使用Remix部署合约](/builders/interact/remix/#deploying-a-contract-to-moonbeam-using-remix)和[通过MetaMask与基于Moonbeam的ERC20进行交互](/builders/interact/remix/#interacting-with-a-moonbeam-based-erc-20-from-metamask)两部分将向您展示如何部署ERC20  Token并将其导入MetaMask。

### 已部署的智能合约 {: #deployed-smart-contract }

本教程的最后部分将引导您如何使用Safe钱包与智能合约进行交互。所以您将需要一个已部署的智能合约与其交互。详细的操作指南可参考[在Moonbeam上使用Remix部署合约](/builders/tools/remix/#deploying-a-contract-to-moonbeam){target=\_blank}。

您可以前往[Remix](https://remix.ethereum.org/){target=\_blank}并为以下`SetText.sol`合约创建一个新文件：

```solidity
pragma solidity ^0.8.0;

contract SetText {
    string public text;
    
    function setTextData(string calldata _text) public {
        text = _text;
    }
}
```

这是一个带有单个函数`setTextData`的简单合约，接受一个字符串并使用它来设置`text`变量。

您将需要合约地址和ABI，请确保您已将它们复制或保存到其他地方，以备不时之需。

## 创建一个Safe钱包 {: #create-a-safe }

要创建一个Safe钱包，导航至[Moonbeam Safe](https://multisig.moonbeam.network/?chain=mbase){target=\_blank}。本教程将引导您在Moonbase Alpha上创建一个Safe钱包，您也可以修改配置在[Moonbeam](https://multisig.moonbeam.network/?chain=mbeam){target=\_blank}或[Moonriver](https://multisig.moonbeam.network/?chain=mriver){target=\_blank}上创建一个Safe钱包。您可点击页面右上角的网络下拉菜单切换网络。

### 连接MetaMask {: #connect-metamask }

进入[Moonbase Alpha](https://multisig.moonbeam.network/moonbase/){target=\_blank}页面后，开始创建Safe钱包之前先连接您的钱包：

 1. 点击**Connect Wallet**

  2. 选择钱包连接至Moonbeam Safe。本示例中您可以使用MetaMask。如果MetaMask没有出现在选项列表中，点击**Show More**并选择**MetaMask**

![Connect Wallet to Moonbeam Safe](/images/tokens/manage/multisig-safe/safe-1.png)

如果您还没有登录MetaMask，系统将会提示您登录。随后，将引导您添加和连接您的帐户，以及添加和切换至Moonbase Alpha网络：

 1. 选择账户并连接至Safe钱包。您将需要选择至少3个所有者账户中的其中两个，然后点击**Next**。本示例中，将选择Alice、Bob和Charlie账户。

 2. 点击**Connect**连接至已选账户

 3. 如果您还没有连接至Moonbase Alpha，或者您还没有在您的MetaMask添加Moonbase Alpha网络，点击**Approve**将Moonbase Alpha添加为自定义网络

 4. 点击**Switch Network**将网络切换至Moonbase Alpha

![Connect MetaMask to Moonbase Alpha](/images/tokens/manage/multisig-safe/safe-2.png)

现在，您可以在右上方确认您的MetaMask账户已连接至Moonbase Alpha网络。如果您使用的是开发账户，您应该可以看到Alice的账户地址。如果不是，请再次确认您的MetaMask并切换到Alice账户。

### 创建新的Safe钱包  {: #create-new-safe }

点击**Create new Safe**，在Moonbase Alpha上创建一个新的Safe钱包。页面将出现一个向导，引导您完成创建新的Safe钱包。完成这些步骤并创建新的Safe钱包，即表示您同意使用条款和隐私政策。因此，在开始之前，请仔细查看这些内容。

![Create Safe](/images/tokens/manage/multisig-safe/safe-3.png)

您将需要给您的Safe钱包设置名称：

 1. 输入您的新Safe钱包名称，您可以使用`moonbeam-tutorial`

  2. 点击**Start**

![Submit Safe Name](/images/tokens/manage/multisig-safe/safe-4.png)

接下来是所有者和签名确认部分。在这个部分中，您将添加Safe钱包的所有者并设置阈值。阈值决定了在交易执行之前需要多少位所有者来签名确认。

创建Safe钱包的时候可以使用许多不同的设置。Safe钱包可以有1个或多个所有者以及不同的阈值级别。请注意，不建议创建只有1个所有者的Safe钱包，因为它会产生单点故障的可能性。

在本教程中，您将创建一个具有3个所有者并要求阈值为2的多重签名设置，因此至少需要3个所有者中的2人使用私钥签署才能通过Safe钱包执行交易。

您的帐户将自动预先填写为第一个所有者，但如果您想使用不同的帐户，则可以更改此设置。在本示例中，Alice的帐户已预先填写。除了Alice之外，您还可以添加Bob和Charlie作为所有者：

 1. 点击**Add another owner**

 2. 输入**Bob**作为第二个所有者，以及他的地址：`0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0`

 3. 输入**Charlie**作为第三个所有者，以及他的地址：`0x798d4Ba9baf0064Ec19eB4F0a1a45785ae9D6DFc`

 4. 设置3个所有者的确认阈值为**2**

  5. 点击**Review**进入向导的最后步骤

![Enter Safe Owners](/images/tokens/manage/multisig-safe/safe-5.png)

最后，您可以查看所有Safe钱包和所有者的详细信息，确认信息无误后：

 1. 点击**Submit**创建新的Safe钱包。这将在Moonbase Alpha上产生约少于0.001 DEV的手续费。MetaMask将会跳出弹窗提示您确认签署交易。

  2. 点击**Confirm**发送交易并创建Safe钱包

![Send Transaction to Create Multisig Safe](/images/tokens/manage/multisig-safe/safe-6.png)

处理交易和创建Safe钱包可能需要几分钟时间。创建成功后，您将会看到一条消息，提示“Your Safe was created successfully”。然后，您可以点击**Get Started**加载您的Safe钱包并开始交互。

![Safe Created Successfully](/images/tokens/manage/multisig-safe/safe-7.png)

## 配置Safe钱包  {: #configure-safe }

您可以随时管理您的Safe钱包并在创建时更改一些参数设置。为此，您可以点击左侧菜单上的**Settings**选项。

![Modify Safe Settings](/images/tokens/manage/multisig-safe/safe-8.png)

随后，您将会看到以下选项：

 - **Safe Details** — 允许您更改Safe钱包名称。这是一个无需链上交互的本地操作
 - **Owners** — 允许您发起一个链上提案，从Safe钱包增加/移除所有者
 - **Policies** — 允许您发起一个链上提案，更改多重签名阈值以执行交易
 - **Advanced** — 允许您从Safe钱包查看其他参数，如自定义交易nonce、模块和事物卫士（Transaction Guard）

## 接收和发送Token  {: #receive-and-send-tokens }

### 接收Token  {: #receive-tokens }

现在，您已经创建了您的Safe钱包，可以开始进行交互。首先，通过发送一些DEV Token来加载Safe。您可以从任何拥有DEV Token的账户发送至Safe钱包。在本示例中，您可以使用Alice账户。将鼠标移至资产列表的**DEV**上，显示**Send**和**Receive**按钮后，点击**Receive**。

![Receive Tokens to the Safe](/images/tokens/manage/multisig-safe/safe-9.png)

随后将会跳出弹窗，显示Safe钱包的地址。点击地址右侧的复制图标以复制地址，然后点击**Done**。

![Copy Safe Address](/images/tokens/manage/multisig-safe/safe-10.png)

接下来，打开您的MetaMask以发起交易：

 1. 点击**Send**发送交易

 2. 将Safe钱包的地址粘贴至输入框内

 3. 输入您将要发送至Safe钱包的DEV Token数量。在本示例中，您可以设置为2个DEV Token

 4. 点击**Next**

  5. 查看交易详情，点击**Confirm**

![Send DEV Tokens to the Safe](/images/tokens/manage/multisig-safe/safe-11.png)

交易已经发送，您的DEV Token余额也会更新在Safe钱包。

### 发送Token  {: #send-tokens }

现在，您的Safe钱包已经有资金，您可以将资产从Safe钱包发送至另一个账户。在本示例中，您可以发送1个DEV Token至Bob的地址。将鼠标移至资产列表的**DEV**上，点击**Send**。

![Send Tokens from the Safe](/images/tokens/manage/multisig-safe/safe-12.png)

随后将会跳出弹窗，您需输入接收人和需要发送的DEV Token数量：

 1. 输入Bob的地址

 2. 在资产列表选择**DEV**

 3. 在DEV Token数量处输入1

  4. 点击**Review**

![Send 1 DEV Token from the Safe to Bob](/images/tokens/manage/multisig-safe/safe-13.png)

然后查看详细信息，点击**Submit**。MetaMask将跳出弹窗，您将看到您发送的不是交易而是消息。点击**Sign**签名消息。

![Submit Transaction and Sign Message](/images/tokens/manage/multisig-safe/safe-14.png)

现在，如果您返回Safe钱包，在**Transactions**标签下，您应该能够看得到已经发起的向Bob的地址发送1个DEV Token的交易提案。但是，您可以看到只收到2个确认中的其中一个，还需要另一个所有者确认才可执行交易。

![Transaction Needs Confirmations](/images/tokens/manage/multisig-safe/safe-15.png)

### 交易确认  {: #transaction-confirmation }

对于多重签名钱包Safe的所有用例，确认（或拒绝）交易提案的过程是相似的。其中一位所有者发起执行操作的提案。其他所有者可以批准或拒绝该提案。一旦达到签名阈值，任何所有者都可以在批准的情况下执行交易提案，如果拒绝则交易提案不通过。

在本示例中，如果三个所有者中的其中两个决定拒绝该提案，则资产将被保留在Safe钱包。在这种情况下，您可以从Bob的账户或者Charlie的账户确认交易。

在MetaMask切换账户至Bob的账户（或Charlie的账户）。然后返回以Bob的账户连接的Safe钱包。现在**Confirm**的按钮应该已经启用。Bob需要继续下一步操作，点击**Confirm** 以满足阈值并发送交易。随后将会跳出弹窗，要求您批准交易：

 1. 勾选**Execute transaction**框以在确认后立即执行交易。您也可以取消勾选在后续手动执行交易

 2. 点击**Submit**

  3. MetaMask将跳出弹窗，要求您确认交易。确认信息无误后，点击**Confirm**

!!! 注意事项
    如果您收到交易可能失败的错误消息，您可能需要增加gas限制。您可以在**Advanced options**或MetaMask中执行此操作。

![Submit Transaction Confirmation](/images/tokens/manage/multisig-safe/safe-16.png)

交易将从**QUEUE**标签移除，但是可以在**HISTORY**标签下找到交易记录。此外，Bob的余额现在增加了1个DEV  Token，而Safe钱包的DEV Token余额减少了。

![Successfully Executed Transaction](/images/tokens/manage/multisig-safe/safe-17.png)

这样就意味着您已经成功在Safe钱包接收和发送DEV Token了！

## 接收和发送ERC-20 Token  {: #receive-and-send-erc20-tokens }

### 接收ERC-20 Token  {: #receive-erc20-tokens }

接下来就是在Safe钱包接收和发送ERC-20 Token。您需要确保您的MetaMask已经有充足的**MYTOK** ERC-20 Token。如果还没有，请返回查看先决条件，参考[ERC-20 Tokens](#erc20-tokens)部分。

本示例中，您应该仍然连接着Bob的账户。因此，您将从Bob的账户发送MYTOK Token至Safe钱包。

您需要再次获取Safe钱包地址。您可以点击左上角**Copy to clipboard**图标来复制地址。随后，打开MetaMask：

 1. 切换至**Assets**标签，在列表中选择**MYTOK**

 2. 点击**Send**

 3. 在输入框内粘贴Safe钱包地址

 4. 输入需要发送的MYTOK数量。您应该已经跟随[使用Remix部署至Moonbeam](/builders/interact/remix/){target=\_blank}操作教程铸造了8,000,000个MYTOK。所以在本示例中，您可以发送数量一栏输入1,000 MYTOK

 5. 点击**Next**

  6. 查看交易详情，然后点击**Confirm**发送交易

![Send ERC-20s to the Safe](/images/tokens/manage/multisig-safe/safe-18.png)

如果您返回至Safe钱包，在**Assets**列表中您应该可以看到**MyToken**的余额已经显示为1,000 MYTOK。**MyToken**可能需要几分钟才能出现，您无需执行任何添加资产的操作，它会自动出现。

### 发送ERC-20 Token  {: #send-erc20-tokens }

现在，您的Safe钱包已经有MYTOK，您可以将一些MYTOK从Safe钱包发送至另一个账户。在本示例中，您可以发送10个MYTOK至Charlie的账户。

将鼠标移至资产列表的**MyToken**上，点击**Send**。

![Send ERC-20s from the Safe](/images/tokens/manage/multisig-safe/safe-19.png)

随后将会跳出弹窗，您需输入接收人和需要发送的MYTOK Token数量：

 1. 输入Charlie的地址

 2. 在资产列表选择**MyToken**

 3. 在MYTOK Token数量处输入10

  4. 点击**Review**并查看详情

![Send ERC-20s to Charlie from the Safe](/images/tokens/manage/multisig-safe/safe-20.png)

确认信息无误后，请执行以下操作：

 1. 点击**Submit**。MetaMask将跳出弹窗，您将看到您发送的不是交易而是消息。

  2. 点击**Sign**签名消息。

![Sign Message to Send ERC-20s to Charlie from the Safe](/images/tokens/manage/multisig-safe/safe-21.png)

现在，如果您返回Safe钱包，在**Transactions**标签下，您应该能够看得到已经发起的向Charlie的地址发送10个MYTOK Token的交易提案。但是，您可以看到只收到2个确认中的其中一个，还需要另一个所有者确认才可执行交易。

![Transaction Needs Confirmation](/images/tokens/manage/multisig-safe/safe-22.png)

您需要将账号切换至Alice或者Charlie，确认交易并执行。您可遵循上面[交易确认](#transaction-confirmation)部分的步骤进行操作。

当另外两个账户的其中一个账户确认交易后，交易将被移到**HISTORY**标签。

![Successfully Executed Transaction](/images/tokens/manage/multisig-safe/safe-23.png)

这样就意味着您已经成功在Safe钱包接收和发送ERC-20 Token了！

## 与智能合约交互  {: #interact-with-a-smart-contract }

在这一部分，您将使用Safe钱包与智能合约交互。您应该已经使用Remix部署了`SetText.sol`合约。如果还没有，请返回查看先决条件，参考[已部署的智能合约](#deployed-smart-contract){target=\_blank}部分。

在这一部分的教程中，您仍然需要连接至Alice的账户

在Safe钱包中，您需要执行以下操作：

 1. 点击左侧的**New Transaction**

  2. 然后，选择**Contract interaction**

![New Contract Interaction](/images/tokens/manage/multisig-safe/safe-24.png)

随后将会跳出**Contract interaction**的弹窗，您需要填写智能合约详细内容：

 1. 在**Contract address**字段输入智能合约地址

 2. 在**ABI**内容框内粘贴ABI

 3. 在出现的的**Method**下拉菜单中选择`setTextData`函数

 4. 然后会出现`_text`输入字段。您可以输入任何内容，在本示例中为`polkadots and moonbeams`

  5. 点击**Review**

![Create Contract Interaction](/images/tokens/manage/multisig-safe/safe-25.png)

确认信息无误后，请执行以下操作：

 1. Click **Submit**. MetaMask will pop-up and you'll notice that instead of sending a transaction, you're sending a message

    点击**Submit**。MetaMask将跳出弹窗，您将看到您发送的不是交易而是消息

 2. Click **Sign** to sign the message

    点击**Sign**签署消息

![Submit Contract Interaction](/images/tokens/manage/multisig-safe/safe-26.png)

现在，如果您返回Safe钱包，在**Transactions**标签下，您应该能够看得到为**Contract interaction**发起的交易提案。但是，您可以看到只收到2个确认中的其中一个，还需要另一个所有者确认才可执行交易。

![Transaction Needs Confirmation](/images/tokens/manage/multisig-safe/safe-27.png)

您需要将账号切换至Bob或者Charlie，确认交易并执行。您可遵循上面[交易确认](#transaction-confirmation)部分的步骤进行操作。

当另外两个账户的其中一个账户确认交易后，交易将被移到**HISTORY**标签。

![Transaction History](/images/tokens/manage/multisig-safe/safe-28.png)

请仔细检查设置的文本内容无误。您可以通过再次执行该过程进行确认，除了从**Method**下拉菜单中选择**setTextData**以外，您可以选择**text**来读取`text`值。这将是一个调用（call）而不是一个交易，因此会出现一个**Call**按钮。点击后，将会直接出现一个弹窗，您应该会看到调用的结果`polkadots and Moonbeams`。

![Contract Interaction Call Result](/images/tokens/manage/multisig-safe/safe-29.png)

这样就意味着您已经成功使用Safe钱包与智能合约交互了！

## 使用Moonbeam Safe API {: #using-moonbeam-safe-apis }

Moonbeam、Moonriver和Moonbase Alpha也支持用API来与Moonbeam Safe进行交互。

=== "Moonbeam"

     ```text
     {{networks.moonbeam.multisig.api_page }}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.multisig.api_page}}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.multisig.api_page}}
     ```

作为使用API的示例，请尝试从Moonbeam Safe API检索有关多签钱包的信息。从Safe页面，复制您的多签地址：

![Contract Interaction Call Result](/images/tokens/manage/multisig-safe/safe-30.png)

然后您可以开始使用API：

 1. 打开对应网络的API页面
 2. 向下滚动到 **Safes** 部分并单击 **/safes/{address}/** 端点部分以展开其页面
 3. 点击右侧的**Try it out**按钮

![Contract Interaction Call Result](/images/tokens/manage/multisig-safe/safe-31.png)

页面中应出现一个**Execute**按钮：

 1. 将您的保险箱地址粘贴到**Address**输入栏
 2. 点击**Execute**
 3. 有关您的保险箱的信息将显示在下方

![Contract Interaction Call Result](/images/tokens/manage/multisig-safe/safe-32.png)

恭喜！您已成功使用API for Moonbeam Safes。为了方便或添加到您自己的应用程序中，仍有许多其他端点可供使用。

--8<-- 'text/_disclaimers/third-party-content.md'
