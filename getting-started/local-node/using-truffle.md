---
title: Truffle使用教程
description: 通过本教程，学习如何通过Truffle将基于Solidity的智能合约轻松部署到Moonbeam。
---

# 如何通过Truffle交互Moonbeam

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed//RD5MefSPNeo' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>You can find all of the relevant code for this tutorial on the <a href="{{ config.site_url }}resources/code/">code snippets page</a></div>

## 概览

[Truffle](https://www.trufflesuite.com/)是一个以太坊智能合约集成开发工具。本教程介绍了如何通过Truffle将基于Solidity的智能合约部署到Moonbeam节点。鉴于Moonbeam兼容以太坊的特性，Truffle可与Moonbeam节点一起直接使用。

!!! 注意事项
    本教程用[Moonbase Alpha](https://github.com/PureStake/moonbeam/releases/tag/v0.3.0)的tutorial-v7标签建立。为实现与以太坊的全面兼容，基于Substrate的Moonbeam平台和[Frontier](https://github.com/paritytech/frontier)组件正处于积极开发阶段。本教程示例基于Ubuntu 18.04的环境，用户需根据其所使用的MacOS和Windows版本进行微调。
    --8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

针对本教程，您需有一个在`--dev`模式下运行的独立Moonbeam节点。您在[这里](/getting-started/local-node/setting-up-a-node/)查看详细的步骤，也可以使用以下示例中的[Moonbeam Truffle 插件](/integrations/trufflebox/#the-moonbeam-truffle-plugin)完成此操作。

## 查看先决条件

--8<-- 'text/common/install-nodejs.md'


接下来，您只需执行以下指令即可进行安装：

```
npm install -g truffle
```

截至发稿时，所用版本分别为15.2.1，7.0.8和5.1.52版本。

!!! 注意事项
    对于以下示例，Moonbeam Truffle Box上已带有Truffle开发模板，因此无需进行全面安装。您也可以运行`npx truffle`或者`./node_modules/.bin/truffle`以此来替代`truffle`.

## 开始运行Truffle

为了简化Truffle入门流程，我们在网站上[发布了Moonbeam Truffle Box](https://moonbeam.network/announcements/moonbeam-truffle-box-available-solidity-developers/)，提供开发模板以加快在Moonbeam上部署合约的进程。您可以访问[此链接](/integrations/trufflebox/)了解更多关于Box的信息。

请参照[以下说明](/integrations/trufflebox/#downloading-and-setting-up-the-truffle-box)下载Moonbeam Truffle Box。进入目录后，让我们来看一下`truffle-config.js`文件（出于本教程的目的，我们删除了一些信息）：

```js
const HDWalletProvider = require('@truffle/hdwallet-provider');
// Moonbeam Development Node Private Key
const privateKeyDev =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
//...
module.exports = {
   networks: {
      dev: {
         provider: () => {
            ...
            return new HDWalletProvider(privateKeyDev, 'http://localhost:9933/')
         },
         network_id: 1281,
      },
      //...
   },
   plugins: ['moonbeam-truffle-plugin']
};
```

注意，这里我们所使用的是Truffle的`HD-Wallet-Provider`作为分层确定性钱包。另外，我们也设定了一个指向独立节点提供者URL的`dev`网络，以及开发帐户的私钥，该帐户将所有资金都保存在独立节点中。

## 运行开发节点

您可以按照[本教程](/getting-started/local-node/setting-up-a-node/)搭建Moonbeam开发节点。整个搭建过程约40分钟，您需要安装Substrate及其所有附属项。Moonbeam Truffle插件提供了一种更快启动开发节点的方式，唯一的要求是安装Docker（撰写本教程时Docker所用版本为19.03.6版本）。

首先，我们需要线下载相应的Docker映像，然后在您的本地环境中驱动独立的Moonbeam节点：

```
truffle run moonbeam install
```

![Docker image download](/images/truffle/using-truffle-1.png)

下载后，我们可以使用以下指令来开始生成本地节点：

```
truffle run moonbeam start
```

您将看到节点启动的提示消息，紧随其后的是两个有效终端。

![Moonbeam local node started](/images/truffle/using-truffle-2.png)

您可以通过以下代码来停止运行独立Moonbeam节点，并删除Docker映像：

```
truffle run moonbeam stop && \
truffle run moonbeam remove
```

![Moonbeam local node stoped and image removed](/images/truffle/using-truffle-3.png)

## 合约文件

Truffle Box中还包含一个ERC-20代币合约：

```solidity
pragma solidity ^0.7.5;

// Import OpenZeppelin Contract
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// This ERC-20 contract mints the specified amount of tokens to the contract creator.
contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MYTOK")
    {
        _mint(msg.sender, initialSupply);
    }
}
```

这是一个基于当前OpenZepplin ERC-20合约编写的简易版ERC-20合约。该合约使用"MYTOK" 符号及标准18个小数位来创建“MyToken”。此外，还将为合约创建者分配初始代币。

如果我们查看`migrations/2_deploy_contracts.js`下的Truffle合约迁移脚本，内容如下：

```javascript
var MyToken = artifacts.require('MyToken');

module.exports = function (deployer) {
   deployer.deploy(MyToken, '8000000000000000000000000');
};
```

“8000000000000000000000000”是合约初始代币供应量，即800万小数点后18位。

## 使用Truffle在Moonbeam上部署合约

我们在部署之前必须先对合约进行编译。（之所以称之为“合约”，是因为一般在Truffle部署中包含 `Migrations.sol` 合约。您可以使用以下命令执行此操作：

```
truffle compile
```

若操作成功，您将会看到如下图所示情况：

![Truffle compile success message](/images/truffle/using-truffle-4.png)

现在我们开始准备部署已编译完的合约。您可以使用以下命令执行此操作：

```
truffle migrate --network dev
```

若操作成功，您将看到部署成功的信息，其中包括部署合约的地址：

![Successful contract deployment actions](/images/truffle/using-truffle-5.png)

若您已遵循[MetaMask使用教程](/getting-started/local-node/using-metamask/)以及[Remix使用教程](/getting-started/local-node/using-remix/)，您可将已部署的合约地址加载到MetaMask或Remix中。
