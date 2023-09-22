---
title: 将WalletConnect集成至DApp
description: 了解如何将WalletConnect集成到基于任何Moonbeam网络的DApp中，特别是让用户可以连接他们的移动钱包。
---

# 将WalletConnect集成至DApp

## 概览 {: #introduction }

[WalletConnect](https://walletconnect.com/){target=_blank}是一个供钱包和DApp之间安全交互的开源协议。

WalletConnect通过使用桥接服务器以中继负载在DApp和移动端钱包构建一个远端连接。通过DApp中的二维码即可发起连接，用户需要扫描二维码并在移动端钱包上通过。当连接成功建立后，DApp和钱包之间的负载将会通过共享私钥进行加密。

![WalletConnect flow](/images/builders/integrations/wallets/walletconnect/walletconnect-1.png)

WalletConnet同样也可以用于连接DApp和电脑钱包，但此教程仅包含移动端钱包的连接。

在本教程中，您将会了解如何将WalletConnect集成至在Moonbase Alpha测试网构建的简易DApp。本教程将会分为几个部分，第一个部分为将DApp连接至您手机上的MetaMask移动端钱包。当成功建立连接后，教程将会解释如何解除连接。如此以来，您将可以在测试您的DApp时随时连接或是取消连接您的MetaMask，以免您的MetaMask具有过多冗余的WalletConnect连接存在。接着，您将会了解在成功连接后如何显示网络、账户信息以及从您的DApp传送交易至MetaMask移动端钱包以进行确认。

本教程为[WalletConnect Example Dapp](https://example.walletconnect.org/){target=_blank}（[source code](https://github.com/WalletConnect/walletconnect-example-dapp){target=_blank}）的修改和优化版本。如果您想查看最终结果，您可以前往[Moonbeam WalletConnect Demo app](https://moonbeam-walletconnect-demo.netlify.app/){target=_blank}（[source code](https://github.com/papermoonio/moonbeam-walletconnect-demo){target=_blank}）

## 快速开始 {: #quick-start }

如果您已经具有一个支持WalletConnect的DApp并想要支持Moonbeam，您可以使用以下的网络配置：

=== "Moonbeam"

    ```js
    {
      name: "Moonbeam",
      short_name: "moonbeam",
      chain: "Moonbeam",
      network: "mainnet",
      chain_id: {{ networks.moonbeam.chain_id }},
      network_id: {{ networks.moonbeam.chain_id }},
      rpc_url: "{{ networks.moonbeam.public_rpc_url }}",
      native_currency: {
        symbol: "GLMR",
        name: "Glimmer",
        decimals: "18",
        contractAddress: "",
        balance: "",
      },
    },
    ```

=== "Moonriver"

    ```js
    {
      name: "Moonriver",
      short_name: "moonriver",
      chain: "Moonriver",
      network: "mainnet",
      chain_id: {{ networks.moonriver.chain_id }},
      network_id: {{ networks.moonriver.chain_id }},
      rpc_url: "{{ networks.moonriver.public_rpc_url }}",
      native_currency: {
        symbol: "MOVR",
        name: "Moonriver",
        decimals: "18",
        contractAddress: "",
        balance: "",
      },
    },
    ```

=== "Moonbase Alpha"

    ```js
    {
      name: "Moonbase Alpha",
      short_name: "moonbase",
      chain: "Moonbase",
      network: "testnet",
      chain_id: {{ networks.moonbase.chain_id }},
      network_id: {{ networks.moonbase.chain_id }},
      rpc_url: "{{ networks.moonbase.rpc_url }}",
      native_currency: {
        symbol: "DEV",
        name: "DEV",
        decimals: "18",
        contractAddress: "",
        balance: "",
      },
    },
    ```

## 查看先决条件 {: #checking-prerequisites }

在本教程中，您将会使用以[React](https://reactjs.org/){target=_blank}构建的简易终端DApp通过WalletConnect连接至移动端钱包。因此，您将会需要一个React项目以及MetaMask移动端钱包以进行测试。目前已经有建立好的范本，其中包含需要的工具包、基础撰写模式以及需要加入逻辑和UI元素的占位符。然而，如果您要使用您自己的DApp进行测试，您将需要安装以下所需依赖项：

```bash
npm install ethers @walletconnect/client @walletconnect/qrcode-modal
```

本教程将会使用MetaMask移动端钱包以进行测试。您可以前往[metamask.io/download/](https://metamask.io/download/){target=_blank}并切换**iOS**或**Android**标签下载MetaMask移动端钱包。

最后，您需要一个拥有足够DEV Token的Moonbase Alpha测试网账户，您方能传送测试交易。
 --8<-- 'text/_common/faucet/faucet-sentence.md'

## 开始测试 {: #getting-started }

Moonbeam WalletConnect范本提供了所有您目前为止需要的内容，为了迅速开始进行测试，请跟随以下步骤：

1. 复制[walletconnect-template GitHub repository](https://github.com/papermoonio/moonbeam-walletconnect-template){target=_blank}
2. 运行`npm install`以安装所需依赖项
3. 运行`npm start`以启动DApp的本地实例

为测试WalletConnect连接功能，您可以使用MetaMask移动端钱包。在本教程中，您将需要在您的MetaMask移动端钱包中连接至Moonbase Alpha测试网。接着，您将会了解如何查看连接网络是否为支持网络，并在用户连接至错误网络时显现连接错误并建议用户连接至支持的网络。

目前有许多方式可以将MetaMask移动端钱包连接至Moonbase Alpha测试网。您可以在**Networks**部分的**Settings**菜单中手动添加Moonbase Alpha测试网配置。您也可以打开MetaMask移动端钱包的**Browser**页面并导向至[docs.moonbeam.network](https://docs.moonbeam.network){target=_blank}，接着点击页面上方的**Connect MetaMask**后在菜单中选择**Moonbase Alpha**。这将会跳出弹窗协助您自动添加Moonbase Alpha网络配置，这意味着您无需手动输入配置信息。

## 将DApp连接至MetaMask移动端钱包 {: #connect-dapp-to-metamask-mobile }

在这个部分，您将会了解如何在您的DApp和MetaMask移动端钱包之间建立连接。WalletConnect将会通过使用桥接服务器以中继负载在DApp和移动端钱包构建一个远端连接。此连接将会通过在DApp中通过发起二维码建立，用户需要扫描二维码并在移动端钱包上通过。

首先，您可以打开[`App.js` file of the template](https://github.com/papermoonio/moonbeam-walletconnect-template/blob/main/src/App.js)并在`connect`函数进行修改。本函数将会通过为WalletConnect连接器创建一个新的实例处理连接逻辑。您将会注意到`setFetching`状态回调函数已经准备完毕。当连接已成功构建后，这将会用于设置`fetching`状态变量为`true` 。一般来说， `connect`函数将会用于以下情景：

1. 建立WalletConnect连接器并以URL形式传送至桥接服务器和WalletConnect二维码模型
2. 使用`setConnector`状态回调函数以更新`connector`状态变量
3. 查看连接是否已成功建立，如果并未成功建立即创建一个新的连接要求

```js
const connect = async () => { 
  setFetching(true);

  // 1. Create connector
  const connector = new WalletConnect({ bridge: "https://bridge.walletconnect.org", qrcodeModal: QRCodeModal });

  // 2. Update the connector state
  setConnector(connector);

  // 3. If not connected, create a new session
  if (!connector.connected) {
    await connector.createSession();
  }
};
```

现在您已经成功设定了`connect`函数，您可以创建一个**Connect Wallet**按钮并称为`onClick`。您可以在[范本](https://github.com/papermoonio/moonbeam-walletconnect-template/blob/main/src/App.js#L124){target=_blank}中使用以下按钮取代`{/* buttons and network details will go here */}`留言：

```js
<Button onClick={connect}>Connect Wallet</Button>
```

为了测试目前的代码运行是否顺利，如果您尚未完全准备完毕您可以运行 `npm start`以为您的DApp运行一个本地实例，并点击**Connect Wallet**，WalletConnect的二维码模型将会跳出。

![Scan QR code from DApp](/images/builders/integrations/wallets/walletconnect/walletconnect-2.png)

要从MetaMask移动端钱包构建连接，您可以：

1. 点击右上角的扫描图标并扫描二维码

2. 页面底下将会跳出弹窗显示您将连接的DApp，点击**Connect**

3. 如果您成功连接，您将在MetaMask看见跳出的弹窗显示**Connect to Moonbeam WalletConnect Demo App**

![Connect WalletConnect on MetaMask mobile](/images/builders/integrations/wallets/walletconnect/walletconnect-3.png)

目前而言，您的DApp仍仅显示**Connect Wallet**按钮，因此下一步将会是在连接时显示**Disconnect**按钮。

## 如何解除连接

当您正在开发您的DApp与WalletConnect之间的集成时，解除连接功能也是至关重要的，如此一来您才能了解集成的顺序以及过程。同样的，您也不希望您的MetaMask移动端钱包有过多的WalletConnect的连接。

如果您在任何时候希望手动解除连接，您可以在MetaMask中导向至**Settings**，并跟随以下步骤：

1. 选取**Experimental**

2. 在**WalletConnect Sessions**部分点击**View Sessions**

3. 如果您希望移除特定连接，您可以点击此部分

4. 屏幕上将会跳出一个弹窗，点击**End**

![End WalletConnect Session on MetaMask mobile](/images/builders/integrations/wallets/walletconnect/walletconnect-4.png)

虽然这对于开发而言很重要，此解除连接的方法也同样使用于终端用户。下一个部分教程将会解释如何处理您的DApp和MetaMask移动端钱包解除连接的逻辑。

### 解除DApp连接 {: #disconnect-from-dapp }

为了让用户易于使用，您的DApp应当要具有**Disconnect**按钮使用户能够解除其钱包与您的DApp之间正在进行的连接。首先您可以创建操作逻辑接着您可以创建按钮。

在解除连接时，您需要将您的DApp设置为最初状态，您可以创建 `resetApp` 函数以重置状态，其为通过状态挂钩进行操作。

```js
const resetApp = () => {
  setConnector(null);
  setFetching(false);
};
```

除了重置您的DApp状态之外，您同样需要使用 `connector`以及WalletConnect的 `killSession` 函数来终止此连接。由于这些功能都将在用户点解**Disconnect**按钮时发生，您可以只创建 `killSession` 函数以处理状态重置和解除连接的操作。

```js
const killSession = () => {
  // Make sure the connector exists before trying to kill the session
  if (connector) {
    connector.killSession();
  }
  resetApp();
};
```

现在您已经具有了所有的逻辑以处理解除连接的操作，您将会需要一个**Disconnect**按纽包含`onClick` 以触发 `killSession` 函数。由于您仅希望在用户已连接时显示**Disconnect**按钮，您可以使用 [conditional renderering](https://reactjs.org/docs/conditional-rendering.html){target=_blank}。条件渲染（Conditional renderering）使您能够查看指定的参数，如果当前条件符合您的设定您将可以渲染一个元件或是其他元件。在此例当中，如果您获取的并不是先前连接和连接器的存在，您可以渲染**Disconnect**按钮，否则渲染**Connect Wallet**按钮。您可以使用以下部分取代已存在的`<Button>` ：

```js
{connector && !fetching ? (
  <OutlinedButton onClick={killSession}>Disconnect</OutlinedButton>
) : (
  <Button onClick={connect}>Connect Wallet</Button>
)}
```

如果您在测试解除连接逻辑的时候发现您点击**Connect Wallet**的时候不会出现任何反应或是弹窗，请确认您是否手动在MetaMask行动钱包解除了任何先前存在的连接。如果您仍遇到问题，请重新刷新您的浏览器。

现在，当用户点击**Disconnect**时，DApp将会被重置，用户行动钱包的连接也将会被解除，**Connect Wallet**按钮将会重新出现。

### 解除MetaMask行动钱包连接 {: #disconnect-from-metamask-mobile }

如前所述，用户仅仅可以在其移动端钱包解除和终止连接。如果用户发起解除连接，WalletConnect将会发出一个`disconnect`事件供DApp监听。当收到`disconnect`事件，DApp状态将会需要被重置回先前的状态。在此示例中，用户已经在其移动端钱包中解除了连接，因此我们不需要使用`killSession`在移动端钱包解除连接。

您将会注意到在范本中，`disconnect`事件在[React Effect Hook](https://reactjs.org/docs/hooks-effect.html){target=_blank}中被监听。作用回调函数将会让您在函数组件中执行副作用操作，如获取数据和设置订阅。

在`disconnect`获得响应后，您可以新增`resetApp`函数。如此一来，当任何`disconnect`事件被发出，您将能够重置您DApp的状态。

```js
connector.on("disconnect", async (error) => {
  if (error) {
    // Handle errors as you see fit
    console.error(error);
  }
  resetApp();
});
```

目前为止，您已经设定了在DApp和MetaMask移动端钱包之间建立连接和解除连接所需的基础逻辑。当连接成功被建立，将会出现**Disconnect**按钮。在下一个部分，您将会了解连接时所展示的信息，如账户和网络等细节。

## 检查网络支持和显示结果 {: #check-network-support-display-result }

当连接和解除连接的逻辑已成功完成，您可以开始扩展用户连接至DApp时显示的内容。首先您需要检查网络是否为支持的网络，如果不是，则会显示提示要求您切换网络。

范本包含了支持网络的列表，您可以在[`src/helpers/networks.js`](https://github.com/papermoonio/moonbeam-walletconnect-template/blob/main/src/helpers/networks.js){target=_blank}中找到。由于本教程仅用于测试，您只能使用Moonbase Alpha进行测试。但欢迎您使用Moonbeam和Moonriver网络配置，以及根据需求新增其他支持的网络。

您可以在`onConnect`函数新增检查是否为支持网络的逻辑。`onConnect`函数将会在`connect`事件被发送时触发。当用户已连接至支持的网络，您可以显示如chain ID、网络名称和更多关于网络的信息。您可以新增以下的状态参数和函数：

```js
const [account, setAccount] = useState(null);
const [chainId, setChainId] = useState(null);
const [supported, setSupported] = useState(false);
const [network, setNetwork] = useState(null);
const [symbol, setSymbol] = useState(null);
```

请确认您是否在`resetApp`函数中新增这些状态函数，所有状态函数才能够被重置为其原先的状态。

您将会注意到`onConnect`函数已经接受两个参数：连接网络的chain ID和账户。您可以为`chainId`和`account`设置状态变量并检查网络是否为支持网络。您可以使用chain ID以检查网络是否在支持网络的列表当中。如果结果为是，您可以使用`setSupported`状态回调函数以将状态设置为`true`，如果为否，则将其设置为`false`。

```js
const onConnect = async (chainId, connectedAccount) => {
  setAccount(connectedAccount);
  setChainId(chainId);

  // get chain data
  const networkData = SUPPORTED_NETWORKS.filter((chain) => chain.chain_id === chainId)[0];

  if (!networkData) {
    setSupported(false);
  } else {
    setSupported(true);
    // set additional network data here
  }
};
```

如果网络在支持网络的列表当中，您可以接着存保存额外的网络名称和标识。标识将会在其后用户显示连接账户余额时用到。

您可以使用以下内容取代`// set additional network data here`条：

```js
setNetwork(networkData.name);
setSymbol(networkData.native_currency.symbol);
```

您将同样需要更新`useEffect`依赖项阵列以包含`chainId`和`account`状态变量，才能使用其重新渲染其中任意一个变量。

```js
useEffect(() => {
  ...
}, [connector, chainId, account]);
```

接着在页面上渲染状态变量，您可以在**Disconnect**按钮包含额外的UI元素。同样，您可以使用条件渲染以显示具体详情或是在连接至错误网络时显示错误信息：

```js
{connector && !fetching ? (
  <LoadedData>
    <Data>
      <strong>Connected Account: </strong>
      {account}
    </Data>
    <Data>
      <strong>Chain ID: </strong>
      {chainId}
    </Data>
    {supported ? (
      <>
        <Data>
          <strong>Network: </strong>
          {network}
        </Data>
      </>
    ) : (
      <strong>
        Network not supported. Please disconnect, switch networks, and connect again.
      </strong>
    )}
    <OutlinedButton onClick={killSession}>Disconnect</OutlinedButton>
  </LoadedData>
) : (
  <Button onClick={connect}>Connect Wallet</Button>
)}
```

您可以调整以上代码段以更好地处理错误。

## 刷新数据 {: #refresh-data }

当您在开发DApp时，您将会希望在基于WalletConnect连接的情况下处理页面刷新和更新所需数据。否则，您将会发现您需要花费许多时间在MetaMask移动端钱包中解除连接。

范本当中已经包含`refreshData`函数，其将会在特定情况下被触发。如果`connector`存在且成功连接，但`chainId`或`account`并不存在，您将会需要调用`refreshData`函数并使用`connector`配置以更新状态并重新渲染页面上的变量。

您可以使用以下内容取代`// check state variables here & if needed refresh the app`[留言](https://github.com/papermoonio/moonbeam-walletconnect-template/blob/main/src/App.js#L84){target=_blank}：

```js
// If any of these variables do not exist and the connector is connected, refresh the data
if ((!chainId || !account) && connector.connected) {
  refreshData();
}
```

您可以在建立连接后通过刷新页面测试此逻辑，在不重新设置**Connect Wallet**的情况下，您将会看到账户和网络信息，**Disconnect**按钮也将会出现。

## 新增账户余额 {: #add-account-balance }

根据您的需求，您或许会希望在连接的网络上显示账户余额，您可以使用[Ethers](https://docs.ethers.org/){target=_blank}创建一个提供者，用于获取连接账户的余额。

您可以通过为`balance`加入另一个状态变量开始进行操作：

```js
const [balance, setBalance] = useState(null);
```

确认您已在`resetApp`函数中新增状态回调函数，并使用其重置余额变量至其初始状态。

简单来说，您可以直接在`onConnect`函数中新增获取账户余额和将其保存至状态。您将需要：

1. 通过传送网络RPC URL、chain ID和名称创建Ethers提供者

2. 使用提供者触发`getBalance`，其将会以`BigNumber`形式返回余额

3. 在Ether中将`BigNumber`形式的余额转变成文字形式表现

4. 使用`setBalance`状态回调函数以存取余额状态

```js
const onConnect = async (chainId, address) => {
  setAccount(address);

  const networkData = SUPPORTED_NETWORKS.filter((network) => network.chain_id === chainId)[0];  

  if (!networkData){
    setSupported(false);
  } else {
    setSupported(true);
    setNetwork(networkData.name);
    setSymbol(networkData.native_currency.symbol);
    setChainId(chainId);

    // 1. Create an Ethers provider
    const provider = new ethers.JsonRpcProvider(networkData.rpc_url, {
      chainId,
      name: networkData.name
    });

    // 2. Get the account balance
    const balance = await provider.getBalance(address);
    // 3. Format the balance
    const formattedBalance = ethers.formatEther(balance);
    // 4. Save the balance to state
    setBalance(formattedBalance);
  }
};
```

您将会需要在`useEffect`依赖项阵列中新增`balance`状态变量以及`connector`、 `chainId`和`account`变量。

您同样可以使用`balance`状态变量以刷新页面数据。

```js
// If any of these variables do not exist and the connector is connected, refresh the data
if ((!chainId || !account || !balance) && connector.connected) {
  refreshData();
}
```

最后，您可以在用户连接至支持网络时显示账户余额。您可以使用先前创建的`symbol`状态变量在Moonbase Alpha显示**DEV**余额。

```js
{supported ? (
  <>
    <Data>
      <strong>Network: </strong>
      {network}
    </Data>
    <Data>
      <strong>Balance: </strong>
      {balance} {symbol}
    </Data>
  </>
) : (
  <strong>Network not supported. Please disconnect, switch networks, and connect again.</strong>
)}
```

此示例可以修改为从Ethers获取其他所需数据。

## 传送交易 {: #send-a-transaction }

要完整地利用WalletConnect提供的优势和价值，您可以在您的DApp中触发交易并在MetaMask移动端钱包中进行确认和签署。

首先，您将需要更新先前在范本中被创建的`sendTransaction`函数。此函数将会使用WalletConnect `connector`传送交易。在本教程中，您可以在Moonbase Alpha传送2个DEV Token至您的账户。

```js
const sendTransaction = async () => {
  try {
    await connector.sendTransaction({ from: account, to: account, value: "0x1BC16D674EC80000" });
  } catch (e) {
    // Handle the error as you see fit
    console.error(e);
  }
};
```

要在DApp中发起交易，您需要创建一个按钮包含`onClick`以触发`sendTransaction`函数。此动作仅会在连接至支持网络时被执行。

```js
{supported ? (
  <>
    <Data>
      <strong>Network: </strong>
      {network}
    </Data>
    <Data>
      <strong>Balance: </strong>
      {balance} {symbol}
    </Data>
    <OutlinedButton onClick={sendTransaction}>Send Transaction</OutlinedButton>
  </>
) : (
  <strong>Network not supported. Please disconnect, switch networks, and connect again.</strong>
)}
```

当您点击**Send Transaction**，MetaMask移动端钱包将会跳出弹窗显示交易细节：

1. 为签署和传送交易，点击**Confirm**
2. 如果交易成功发送，您将会在MetaMask移动端钱包中看见通知

![Send Transaction](/images/builders/integrations/wallets/walletconnect/walletconnect-5.png)

同样您也可以在[Moonscan](https://moonbase.moonscan.io/){target=_blank}中搜寻您的账户地址以验证交易是否成功。

## 最终结果 {: #final-result }

![DApp Final Result](/images/builders/integrations/wallets/walletconnect/walletconnect-6.png)

要一次性检查此教程中的代码，您可以前往[moonbeam-walletconnect-demo GitHub repository](https://github.com/papermoonio/moonbeam-walletconnect-demo){target=_blank}。

要查看所有代码细节，您可以前往[Moonbeam WalletConnect Demo App](https://moonbeam-walletconnect-demo.netlify.app/){target=_blank}。

## 其他注意事项 {: #additional-considerations }

本教程仅仅包含设置WalletConnect连接的基础设定，但您仍可以通过多种方式为用户或是您本身改善使用体验。您或许可以考虑新增以下设置：

- 新增加载程序，用于当交易正在等待确认时或是通知您的用户查看其移动端钱包以确认交易
- 新增通知功能，让用户能够查看交易状态
- 新增适当的错误处理方案
- 新增自动更新余额数据的功能
