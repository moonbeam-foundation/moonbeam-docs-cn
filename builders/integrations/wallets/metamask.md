---
title: 将MetaMask集成至DApp
description: 本教程向您展示如何将MetaMask集成到DApp中，并通过单击按钮自动将用户连接到 Moonbeam。
---

# 将MetaMask集成至DApp

## 概览 {: #introduction }

随着MetaMask的[自定义网络API](https://consensys.net/blog/metamask/connect-users-to-layer-2-networks-with-the-metamask-custom-networks-api/){target=_blank}的发布，现在可以提示用户添加Moonbeam的测试网Moonbase Alpha。

本教程将引导您添加“连接Moonbase Alpha”按钮以提示用户将其MetaMask账户连接至Moonbase Alpha。用户无需获取Moonbase Alpha的网络配置，并将其以自定义网络添加至MetaMask。想要从您的DApp与Moonbeam进行交互，用户只需简单的几个点击按钮的步骤即可连接至Moonbase Alpha，并开始交互。

MetaMask向网站注入一个用户访问的全局以太坊API `window.ethereum`，允许网站读取和请求用户的区块链数据。您将使用以太坊提供商引导您的用户如何将Moonbase Alpha添加为自定义网络。为此，您需要：

- 检查以太坊提供商是否存在，并确认是否为MetaMask
- 请求获取用户的账户地址
- 将Moonbase Alpha添加为新的网络

本教程将分为两个部分。第一部分为添加用于触发MetaMask弹窗并连接Moonbase Alpha的按钮。第二部分为创建将用户连接到MetaMask的逻辑。这种方式以便您在浏览此教程时只需点击按钮即可测试功能。

## 查看先决条件 {: #checking-prerequisites }

要添加Connect MetaMask按钮，您将需要JavaScript项目以及安装完成的MetaMask扩展程序用于本地测试。

建议使用MetaMask的`detect-provider`实用性工具包，以检测在`window.ethereum`注入的提供商。工具包为MetaMask扩展程序和MetaMask Mobile检测提供商。运行以下命令在您的JavaScript项目安装工具包：

```
npm install @metamask/detect-provider
```

## 添加按钮 {: #add-a-button }

首先您将需要添加用于连接MetaMask至Moonbase Alpha的按钮。当您在下一个步骤创建逻辑时，您可以测试代码。

在本教程下一部分， 您将创建一个名为`configureMoonbaseAlpha`的函数，因此点击按钮时将调用`configureMoonbaseAlpha`函数。

```html
<button onClick={configureMoonbaseAlpha()}>Connect to Moonbase Alpha</button>
```

## 添加逻辑 {: #add-logic }

成功创建按钮后，现在您将需要添加点击按钮时使用的`configureMoonbaseAlpha`函数。

1. 在`window.ethereum`检测提供商是否为MetaMask。如果您想要简单的解决方案，您可以直接访问`window.ethereum`。您也可以使用MetaMask的`detect-provider`工具包，为您的MetaMask扩展程序和MetaMask Mobile检测提供商

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
    
2. 通过调用`eth_requestAccounts`函数来请求获取用户的账户。这将提示MetaMask跳出弹窗，要求用户选择想要连接的账户。在后台，通过调用`wallet_requestPermissions`函数来检查账户的权限。目前仅限于`eth_accounts`可用于连接。因此，您最终要验证您是否有权访问从`eth_accounts`返回的用户地址。如果您有兴趣了解更多权限系统的相关信息，请查看[EIP-2255](https://eips.ethereum.org/EIPS/eip-2255){target=_blank}

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
    
    ![Add accounts to MetaMask](/images/builders/integrations/wallets/metamask/metamask-1.png)

3. 通过调用`wallet_addEthereumChain`函数将Moonbase Alpha添加为新的网络。这将提示用户提供将Moonbase Alpha添加为自定义网络的权限。成功添加网络后，将提示用户切换网络至Moonbase Alpha

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
                            chainId: "{{ networks.moonbase.hex_chain_id }}", // Moonbase Alpha's chainId is {{ networks.moonbase.chain_id }}, which is {{ networks.moonbase.hex_chain_id }} in hex
                            chainName: "Moonbase Alpha",
                            nativeCurrency: {
                                name: 'DEV',
                                symbol: 'DEV',
                                decimals: 18
                            },
                        rpcUrls: ["{{ networks.moonbase.rpc_url }}"],
                        blockExplorerUrls: ["{{ networks.moonbase.block_explorer }}"]
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
    
    ![Add and switch networks in MetaMask](/images/builders/integrations/wallets/metamask/metamask-2.png)

现在，您应该已经完成按钮创建，用户只需点击按钮，根据操作指示即可将MetaMask账户连接至Moonbase Alpha。

### 确认连接 {: #confirm-connection }

您可能会有知道用户是否将其MetaMask连接至Moonbase Alpha的逻辑。如果用户已经连接，您也可以禁用此按钮。要确认用户是否已经连接至Moonbase Alpha，您可以调用`eth_chainId`函数，它将返回用户当前chain ID：

```javascript
    const chainId = await provider.request({
        method: 'eth_chainId'
    })
    // Moonbase Alpha's chainId is {{ networks.moonbase.chain_id }}, which is {{ networks.moonbase.hex_chain_id }} in hex
    if (chainId === "{{ networks.moonbase.hex_chain_id }}"){
        // At this point, you might want to disable the "Connect" button
        // or inform the user that they are already connected to the
        // Moonbase Alpha testnet
    }
```

## 监听账户变化 {: #listen-to-account-changes }

为了确保您的项目或dApp与最新的账户信息保持同步，您可以添加MetaMask提供的`accountsChanged`事件监听器。当`eth_accounts`返回的值发生变化时，MetaMask将发出此事件。如果返回地址，则它是您的用户最近提供访问权限的帐户。如果没有返回地址，则表示用户没有提供任何具有访问权限的帐户。

```javascript
    provider.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
            // MetaMask is locked or the user doesn't have any connected accounts
            console.log('Please connect to MetaMask.');
        } 
    })
```

## 监听链变化 {: #listen-to-chain-changes }

为了使您的项目或dApp与连接链的变化保持同步，您可以订阅`chainChanged`事件。当连接的链发生变化时，MetaMask将发出此事件。

```javascript
    provider.on("chainChanged", () => {
        // MetaMask recommends reloading the page unless you have good reason not to
        window.location.reload();
    })
```

若非必要情况，MetaMask建议在链变化时重新加载页面，因为与链更改保持一致至关重要。