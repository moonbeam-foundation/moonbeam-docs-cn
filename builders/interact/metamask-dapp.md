---
title: 将MetaMask集成至DApp
description: 通过此教程学习如何在Moonbeam测试网使用MetaMask。此教程将展示如何将MetaMask集成至DApp，并自动连接至Moonbase Alpha。
---

# 将MetaMask集成至DApp

![Intro banner](/images/integrations/integrations-metamask-banner.png)

## 概览 {: #introduction }

随着MetaMask的[自定义网络API](https://consensys.net/blog/metamask/connect-users-to-layer-2-networks-with-the-metamask-custom-networks-api/)的发布，用户可以根据提示添加Moonbeam的测试网，Moonbase Alpha。

本教程将引导您添加“连接至Moonbase Alpha”按钮，该按钮提示用户如何将MetaMask帐户连接到Moonbase Alpha。用户无需担心或了解Moonbase Alpha的网络配置以及在 MetaMask添加自定义网络。想要将您的dApp与Moonbeam交互，只需单击几个按钮即可连接至Moonbase Alpha并开始使用。

MetaMask向用户在`window.ethereum`访问的网站注入了一个全网以太坊API，允许网站读取和请求用户的区块链数据。您将使用以太坊提供者引导用户完成将Moonbase Alpha添加为自定义网络的过程。通常您需要完成以下步骤：

- 检查以太坊提供者是否存在以及是否是MetaMask
- 请求用户账户地址
- 将Moonbase Alpha添加为新链

本教程分为两个部分。第一部分涉及新增按钮用于触发MetaMask弹窗并连接至Moonbase Alpha。第二部分将创建连接至MetaMask的逻辑。如此一来，当您在浏览本教程时，只需点击按钮即可测试该功能。

## 查看先决条件 {: #checking-prerequisites }

要添加Connect MetaMask按钮，您将需要一个JavaScript项目和已安装的MetaMask浏览器扩展用于本地测试。

建议使用MetaMask的`detect-provider` 实用程序包来检测在`window.ethereum`中注入的提供者。该程序包用于检测MetaMask扩展和MetaMask Mobile的提供者。要在JavaScript项目中安装程序包，请运行以下指令：

```
npm install @metamask/detect-provider
```

## 添加按钮 {: #add-a-button }

首先，您需添加用于将MetaMask连接至Moonbase Alpha的按钮。这样，您可以在下一步骤创建逻辑时，通过本教程直接测试代码。

在本教程下一部分创建的函数被称为`configureMoonbaseAlpha`，所以点击按钮时将调用`configureMoonbaseAlpha`。

```html
<button onClick={configureMoonbaseAlpha()}>Connect to Moonbase Alpha</button>
```

## 添加逻辑 {: #add-logic }

现在，您已经完成按钮的添加。接下来，您需要添加`configureMoonbaseAlpha`函数，单击即可使用。

1. 在`window.ethereum`检测提供者，并检查是否为MetaMask。如果您希望有一个简单的解决方案，可以直接访问`window.ethereum`。或者您可以使用MetaMask的`detect-provider`程序包，该程序包将为您检测MetaMask扩展和MetaMask Mobile的提供者。

```javascript
import detectEthereumProvider from '@metamask/detect-provider';

const configureMoonbaseAlpha = async () => {
    const provider = await detectEthereumProvider({ mustBeMetaMask: true });
    if (provider) {
        // Logic will go here    
    } else {
        console.error("Please install MetaMask");
    }
}
```

2. 通过调用`eth_requestAccounts`方式来请求用户账号。MetaMask将跳出弹框，请求用户选择想要连接的账户。在此情况下，通过调用`wallet_requestPermissions`来检查权限。目前，`eth_accounts`是唯一权限。因此，您最终要验证您是否有权访问从`eth_accounts`返回的用户地址。若您想要了解更多关于权限系统的信息，请查看[EIP-2255](https://eips.ethereum.org/EIPS/eip-2255)。

```javascript
import detectEthereumProvider from '@metamask/detect-provider';

const configureMoonbaseAlpha = async () => {
    const provider = await detectEthereumProvider({ mustBeMetaMask: true });
    if (provider) {
        try {
            await provider.request({ method: "eth_requestAccounts"});
        } catch(e) {
            console.error(e);
        }  
    } else {
        console.error("Please install MetaMask");
    }
}
```
<img src="/images/integrations/integrations-metamask-1.png" alt="Integrate MetaMask into a Dapp - Select account" style="width: 50%; display: block; margin-left: auto; margin-right: auto;"/>
<img src="/images/integrations/integrations-metamask-2.png" alt="Integrate MetaMask into a Dapp - Connect account" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

3. 通过调用`wallet_addEthereumChain`将Moonbase Alpha添加为新链。这将提示用户授权将Moonbase Alpha添加为自定义网络。

```javascript
import detectEthereumProvider from '@metamask/detect-provider';

const configureMoonbaseAlpha = async () => {
    const provider = await detectEthereumProvider({ mustBeMetaMask: true });
    if (provider) {
        try {
            await provider.request({ method: "eth_requestAccounts"});
            await provider.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: "0x507", // Moonbase Alpha's chainId is 1287, which is 0x507 in hex
                        chainName: "Moonbase Alpha",
                        nativeCurrency: {
                            name: 'DEV',
                            symbol: 'DEV',
                            decimals: 18
                        },
                       rpcUrls: ["https://rpc.testnet.moonbeam.network"],
                       blockExplorerUrls: ["https://moonbase-blockscout.testnet.moonbeam.network/"]
                    },
                ]
            })
        } catch(e) {
            console.error(e);
        }  
    } else {
        console.error("Please install MetaMask");
    }
}
```

<img src="/images/integrations/integrations-metamask-3.png" alt="Integrate MetaMask into a Dapp - Add network" style="width: 50%; display: block; margin-left: auto; margin-right: auto;"/>

当成功添加网络后，系统将提示用户将网络切换至Moonbase Alpha。

<img src="/images/integrations/integrations-metamask-4.png" alt="Integrate MetaMask into a Dapp - Switch to network" style="width: 50%; display: block; margin-left: auto; margin-right: auto;"/>

现在，您应该可以通过按钮实现一键连接，将MetaMask账户连接至Moonbase Alpha。

<img src="/images/integrations/integrations-metamask-5.png" alt="Integrate MetaMask into a Dapp - Account connected to Moonbase Alpha"/>

### 确认连接 {: #confirm-connection }

现在您拥有查看用户是否连接至Moonbase Alpha的逻辑。如果您已连接至Moonbase Alpha，您可以关闭此按钮。您可以调用`eth_chainId`（这将返回用户当前的Chain ID）来确认是否已连接Moonbase Alpha：

```javascript
    const chainId = await provider.request({
        method: 'eth_chainId'
    })
    // Moonbase Alpha's chainId is 1287, which is 0x507 in hex
    if (chainId === "0x507"){
        // At this point, you might want to disable the "Connect" button
        // or inform the user that they are already connected to the
        // Moonbase Alpha testnet
    }
```

## 监听账户变更最新资讯 {: #listen-to-account-changes }

为确保您的项目或dApp与最新的账户信息保持同步，您可以添加由MetaMask提供的`accountsChanged`事件监听器。当`eth_accounts`返回值发生变化，MetaMask将会自动发送此事件。如果返回地址，则是您的用户最近提供访问权限的帐户。如果没有返回地址，则表示用户没有为任何帐户提供访问权限。

```javascript
    provider.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
            // MetaMask is locked or the user doesn't have any connected accounts
            console.log('Please connect to MetaMask.');
        } 
    })
```

## 监听链变更最新资讯 {: #listen-to-chain-changes }

为确保您的项目或dApp与已连接的链保持同步，您可以订阅`chainChanged`事件。当链发生变化时，MetaMask将会自动发送此事件。

```javascript
    provider.on("chainChanged", () => {
        // MetaMask recommends reloading the page unless you have good reason not to
        window.location.reload();
    })
```

MetaMask建议重新加载网页，无论链在何时发生了变化，除非有其他充分无需加载的原因，同步链变更是非常重要的。
