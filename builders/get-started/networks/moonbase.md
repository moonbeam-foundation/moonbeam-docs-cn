---
title: Moonbase Alpha快速上手教程
description: Moonbeam测试网（Moonbase Alpha）是进入波卡（Polkadot）生态的首选入口。通过此教程学习如何连接至Moonbase Alpha测试网。
---

# 快速上手Moonbase Alpha测试网

--8<-- 'text/testnet/connect.md'

## 区块浏览器 {: #block-explorers }

您可以使用任意区块浏览器查看Moonbase Alpha：

 - **Ethereum API （等同于Etherscan）** —— [Moonscan](https://moonbase.moonscan.io/){target=_blank}
 - **带索引的Ethereum API** —— [Blockscout](https://moonbase-blockscout.testnet.moonbeam.network/){target=_blank}
 - **基于Ethereum API JSON-RPC** —— [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=MoonbaseAlpha){target=_blank}
 - **Substrate API** —— [Subscan](https://moonbase.subscan.io/){target=_blank}或[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer){target=_blank}

更多关于上述区块浏览器的信息，请直接查看[区块浏览器](/builders/get-started/explorers/){target=_blank} 部分。

## 连接MetaMask {: #connect-metamask }

如果您已经安装了MetaMask，您可以轻松地将MetaMask连接至Moonbase Alpha测试网：

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbase">连接MetaMask</a>
</div>

!!! 注意事项
    MetaMask将会跳出弹框，要求授权将Moonbase Alpha添加为自定义网络。经授权后，MetaMask会将您当前的网络切换到Moonbase Alpha。

如果您还没有安装MetaMask，请查看[使用MetaMask与Moonbeam交互](/tokens/connect/metamask/){target=_blank} 教程。

## 获得Token {: #get-tokens }

要开始在Moonbase Alpha上开发部署，您可以在通过Moonbase Alpha水龙头或手动申请获得DEV测试代币。对于特定金额的测试代币，您可以随时通过我们的社区渠道直接与我们联系。

您可以输入您的地址以自动从[Moonbase Alpha Faucet](https://apps.moonbeam.network/moonbase-alpha/faucet/){target=_blank}网站请求DEV测试代币。水龙头每24小时最多分配{{ networks.moonbase.website_faucet_amount }}枚DEV。

![Moonbase Alpha Faucet Web](/images/builders/get-started/networks/moonbase/moonbase-1.png)

!!! 注意事项
    Moonbase Alpha DEV Token并不具备任何实际价值。请不要向水龙头发送非必要请求。

## 演示DApp {: #Demo-DApps }

许多DApp已经部署在Moonbase Alpha，您能够试验各种应用和集成。您也可以通过 [Moonbase ERC20 Minter](https://moonbase-minterc20.netlify.app/){target=_blank}或[Moonbeam Uniswap](https://moonbeam-swap.netlify.app/#/swap){target=_blank} DApps获得多种测试Token。例如，需要测试XCM相关功能的情况下，[Moonbeam Uniswap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}可以协助您获得跨链资产，如xcUNITs或xcKarura。在下面的表格中，您可以找到每个样本DApp，以及相应的URL和GitHub repository。

### 参考链接 {: #quick-links } 

|                                           DApp                                            |        描述        |                                                                        Repository                                                                        |
|:-----------------------------------------------------------------------------------------:|:------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------:|
|     [Moonbase ERC-20 Minter](https://moonbase-minterc20.netlify.app/){target=_blank}      |   ERC-20 Faucet    |                [https://github.com/PureStake/moonbase-mintableERC20](https://github.com/PureStake/moonbase-mintableERC20){target=_blank}                 |
|        [Moonbeam Uniswap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}        |  Uniswap V2 Fork   |                      [https://github.com/PureStake/moonbeam-uniswap](https://github.com/PureStake/moonbeam-uniswap){target=_blank}                       |
|       [MoonLink Dashboard](https://moonlink-dashboard.netlify.app/){target=_blank}        |   Chainlink Demo   |                    [https://github.com/PureStake/moonlink-dashboard](https://github.com/PureStake/moonlink-dashboard){target=_blank}                     |
|        [MoonLotto Lottery](https://moonbase-moonlotto.netlify.app/){target=_blank}        |   TheGraph Demo    | [Interface](https://github.com/PureStake/moonlotto-interface){target=_blank}, [Subgraph](https://github.com/PureStake/moonlotto-subgraph){target=_blank} |
| [Moonbeam WalletConnect](https://moonbeam-walletconnect-demo.netlify.app/){target=_blank} | WalletConnect Demo |           [https://github.com/PureStake/moonbeam-walletconnect-demo](https://github.com/PureStake/moonbeam-walletconnect-demo){target=_blank}            |
| [Moonbase ChainBridge](https://moonbase-chainbridge.netlify.app/transfer){target=_blank}  |  ChainBridge Demo  |                        [https://github.com/PureStake/chainbridge-ui](https://github.com/PureStake/chainbridge-ui){target=_blank}                         |
|              [MoonGas](https://moonbeam-gasinfo.netlify.app/){target=_blank}              | Gas Price Tracker  |                 [https://github.com/albertov19/moonbeam-gas-station](https://github.com/albertov19/moonbeam-gas-station){target=_blank}                  |

!!! 注意事项
    这些DApp仅用于演示目的，可能不完整或不适合用于生产部署。

### Moonbase ERC20 Minter {: #moonbase-erc20-minter } 

[Moonbase ERC-20 Minter](https://moonbase-minterc20.netlify.app/){target=_blank}使您能够铸造多样的ERC-20测试Token，对应太阳系的八大行星以及冥王星。开始铸造Token前，请先点击屏幕右上方“**Connect MetaMask**”。然后，鼠标往下滚至**Mint Tokens**处，选择ERC-20合约。点击**Submit Tx**并在MetaMask中确认交易。每次铸造会产生100枚Token，您可以每小时为每个合约铸造Token。

![ERC20 Minter](/images/builders/get-started/networks/moonbase/moonbase-2.png)

### Moonbeam Uniswap {: #moonbeam-uniswap } 

[Moonbeam Uniswap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}是[Uniswap-V2](https://uniswap.org/blog/uniswap-v2){target=_blank}的分叉，部署在Moonbase Alpha上。需要注意的是，Moonbeam Uniswap允许开发者可轻松交换以获取[跨链资产](/builders/xcm/xc20/){target=_blank}，如为XCM测试目的的xcKarura或xcUNITs。请执行以下步骤完成交换：

1. 点击**Select a token**

2. 连接您的MetaMask钱包，并确保在Moonbase Alpha网络上

3. 点击**Choose a List** 

4. 选择**Moon Menu** 

5. 在列表中寻找或者选择想要交换的资产

![Moonbeam Swap](/images/builders/get-started/networks/moonbase/moonbase-3.png)

!!! 注意事项
    如果您在**Moon Menu**下只能看到部分资产列表，您的浏览器可能缓存了**Moon Menu**的旧版本。请清除缓存并重新加入**Moon Menu**可解决此问题。

### MoonLink Dashboard {: #moonlink-dashboard } 

[MoonLink Dashboard](https://moonlink-dashboard.netlify.app/){target=_blank}实时展示Chainlink喂价。更多关于所有Moonbeam网络中所有Chainlink喂价信息的完整列表、以及如何获取喂价信息的相关步骤教程，请直接查阅[Moonbeam文档中的预言机部分](/builders/integrations/oracles/chainlink/){target=_blank}。您也可以查阅[MoonLink Dashboard repository](https://github.com/PureStake/moonlink-dashboard){target=_blank}. 

![MoonLink Dashboard](/images/builders/get-started/networks/moonbase/moonbase-4.png)

### MoonLotto Lottery {: #moonlotto-lottery } 

[MoonLotto](https://moonbase-moonlotto.netlify.app/){target=_blank}是在Moonbase Alpha上的一个简单彩票游戏，源自[The Graph's Example Subgraph](https://github.com/graphprotocol/example-subgraph){target=_blank}。购买一张彩票需要1 DEV，如果每半小时有超过10位参与者，则出一位赢家。

[MoonLotto.sol](https://github.com/PureStake/moonlotto-subgraph/blob/main/contracts/MoonLotto.sol){target=_blank}持有彩票的合约逻辑。请执行以下步骤参与：

1. 连接您的MetaMask钱包，并确保在Moonbase Alpha网络上
2. 输入彩票接收方地址，或勾选**I want to buy a ticket for my address**
3. 点击**Submit on MetaMask**并在MetaMask中确认交易

![MoonLotto Lottery](/images/builders/get-started/networks/moonbase/moonbase-5.png)

### Moonbeam WalletConnect {: #moonbeam-walletconnect } 

[Moonbeam WalletConnect](https://moonbeam-walletconnect-demo.netlify.app/){target=_blank}展示了将[WalletConnect](https://walletconnect.com/){target=_blank}轻松集成到您的DApp并解锁对各种加密钱包的支持。请确保在[demo app repository](https://github.com/PureStake/moonbeam-walletconnect-demo){target=_blank}先查阅WalletConnect集成如何工作。请执行以下步骤开始：

1. 点击**Connect Wallet**
2. 使用[与WalletConnect兼容的钱包](https://explorer.walletconnect.com/registry?type=wallet){target=_blank}扫描二维码

![Moonbeam WalletConnect](/images/builders/get-started/networks/moonbase/moonbase-6.png)

### Moonbase ChainBridge {: #moonbase-chainbridge } 

[Moonbase ChainBridge](https://moonbase-chainbridge.netlify.app/transfer){target=_blank}使得您能够从Moonbase Alpha桥接ERC-20 Token至Ethereum的Rinkeby和Kovan测试网（反之亦然）。关于使用ChainBridge的ERC-20、ERC-721和Generic Handlers的更多信息，请确保查阅[ChainBridge协议的以太坊Moonbeam跨链转接桥](/builders/integrations/bridges/chainbridge/)的步骤教程{target=_blank} 。您也可以查阅[Moonbase ChainBridge repository](https://github.com/PureStake/chainbridge-ui){target=_blank}。启动跨链桥转移前，请连接您的MetaMask钱包，并确保在Moonbase Alpha网络上，然后执行以下步骤：

1. 点击**Mint ERC20S**

2. 选定一个目标网络（无论目标网络如何，铸造的Token都是相同的）

3. 在选择**Token**下拉菜单中选择**ERC20S** 

4. 点击**Mint Tokens**并在MetaMask确认交易

5. 返回至**Transfer**一栏

6. 选择目标网络

7. 在选择**Token**下拉菜单中选择**ERC20S** 

8. 输入需要转移的Token数量

9. 输入目的地地址，或勾选**I want to send funds to my address**

10. 点击**Start Transfer**并在MetaMask确认交易。DApp将更新跨链桥转移的状态

![Moonbase ChainBridge](/images/builders/get-started/networks/moonbase/moonbase-7.png)

### MoonGas {: #moongas } 

[MoonGas](https://moonbeam-gasinfo.netlify.app/){target=_blank}是一个便于使用的数据面板，用于查看所有Moonbeam网络中前一个区块中交易的最低、最高和平均gas价格。请注意，这些数据可能会英文区块而波动很大，并且偶尔会包含异常值。您可以查阅[repository for MoonGas](https://github.com/albertov19/moonbeam-gas-station){target=_blank}。

您将注意到Moonbeam最小gas价格是100 Gwei，然而Moonriver和Moonbase Alpha的仅仅是1 Gwei。这种差异源于[GLMR与MOVR初始供应量的百倍差距](https://moonbeam.foundation/news/moonbeam-community-announcement/){target=_blank}，因此，Moonbeam最小值100 Gwei就相当于Moonriver最小值1 Gwei。

![MoonGas](/images/builders/get-started/networks/moonbase/moonbase-8.png)
