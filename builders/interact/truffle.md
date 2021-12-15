---
title: Truffle使用教程
description: 通过本教程，学习如何通过Truffle将基于Solidity的智能合约轻松部署到Moonbeam。
---

# 使用Truffle部署至Moonbeam

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/RD5MefSPNeo' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## 概览 {: #introduction }

[Truffle](https://www.trufflesuite.com/)是一个以太坊智能合约集成开发工具。本教程介绍了如何通过Truffle将基于Solidity的智能合约部署到Moonbeam节点。鉴于Moonbeam兼容以太坊的特性，Truffle可与Moonbeam节点一起直接使用。

!!! 注意事项
    本教程用[Moonbase Alpha](https://github.com/PureStake/moonbeam/releases/tag/{{ networks.moonbase.version }}) {{ networks.moonbase.version }}版本的{{ networks.development.build_tag}}标签建立。为实现与以太坊的全面兼容，基于Substrate的Moonbeam平台和[Frontier](https://github.com/paritytech/frontier)组件正处于积极开发阶段。

--8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

针对本教程，您需有一个在`--dev`模式下运行的独立Moonbeam节点。您在[这里](/builders/get-started/moonbeam-dev/)查看详细的步骤，也可以使用以下示例中的[Moonbeam Truffle 插件](#using-the-moonbeam-truffle-plugin-to-run-a-node)完成此操作。

## 查看先决条件 {: #checking-prerequisites }

--8<-- 'text/common/install-nodejs.md'

接下来，您只需执行以下指令即可全网安装Truffle：

```
npm install -g truffle
```

截至发稿时，所用版本分别为15.12.0, 7.6.3和5.2.4版本。

!!! 注意事项
    对于以下示例，Moonbeam Truffle Box上已带有Truffle开发模板，因此无需进行全网安装。您也可以运行`npx truffle`或者`./node_modules/.bin/truffle`以此来替代`truffle`.

## 开始运行Truffle {: #getting-started-with-truffle }

为了简化Truffle入门流程，我们在网站上[发布了Moonbeam Truffle Box](https://moonbeam.network/announcements/moonbeam-truffle-box-available-solidity-developers/)，提供开发模板以加快在Moonbeam上部署合约的进程。

### 使用Moonbeam Truffle Box创建项目 {: #creating-a-project-using-the-moonbeam-truffle-box }

开始使用Moonbeam Truffle box。若您已全网安装Truffle，您可执行以下操作：

```
mkdir moonbeam-truffle-box && cd moonbeam-truffle-box
truffle unbox PureStake/moonbeam-truffle-box
```

![Unbox Moonbeam Truffle box](/images/builders/interact/eth-dev-env/truffle/truffle-1.png)

若您不想全网安装Truffle，Moonbeam Truffle box也有Truffle作为依赖项可以使用。在这种情况下，您可以直接克隆以下代码库：

```
git clone https://github.com/PureStake/moonbeam-truffle-box
cd moonbeam-truffle-box
```

使用本地系统中的文档，通过运行以下指令安装所有依赖项：

```
npm install
```

!!! 注意事项
    我们在使用npm 7.0.15版本安装软件包时注意到一个错误。您可以通过运行`npm install -g npm@version`并将版本设置为所需的版本来降级npm。例如，7.0.8或 6.14.9。

### Truffle配置文件 {: #the-truffle-configuration-file }

在目录中，导航至`truffle-config.js`文件（出于本教程的目的，我们删除了一些信息）：

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
            return new HDWalletProvider(privateKeyDev, '{{ networks.development.rpc_url }}')
         },
         network_id: {{ networks.development.chain_id }},  // {{ networks.development.hex_chain_id }} in hex,
      },
      //...
   },
   plugins: ['moonbeam-truffle-plugin']
};
```

请注意，这里我们所使用的是Truffle的`HD-Wallet-Provider`作为分层确定性钱包。另外，我们也设定了一个指向独立节点提供者URL的`dev`网络，以及开发帐户的私钥，该帐户将所有资金都保存在独立节点中。

要部署至Moonbase Alpha测试网或者Moonriver，您需要提供持有资金的地址的私钥。对于Moonbase Alpha，您可以在MetaMask中创建一个帐户，使用[测试网水龙头](/builders/get-started/moonbase/#get-tokens/)注入资金，并导出其私钥。

您可以在下方找到所有网络的网络配置：

=== "Moonriver"
    ```
    moonriver: {
      provider: () => {
         ...
         return new HDWalletProvider(privateKeyMoonriver, '{{ networks.moonriver.rpc_url }}') // Insert your private key here
      },
      network_id: {{ networks.moonriver.chain_id }} (hex: {{ networks.moonriver.hex_chain_id }}),
    },
    ```

=== "Moonbase Alpha"
    ```
    moonbase: {
      provider: () => {
         ...
         return new HDWalletProvider(privateKeyMoonbase, '{{ networks.moonbase.rpc_url }}') // Insert your private key here
      },
      network_id: {{ networks.moonbase.chain_id }} (hex: {{ networks.moonbase.hex_chain_id }}),
    },
    ```

=== "Moonbeam Dev Node"
    ```
    dev: {
      provider: () => {
         ...
         return new HDWalletProvider(privateKeyDev, '{{ networks.development.rpc_url }}') // Insert your private key here
      },
      network_id: {{ networks.development.chain_id }} (hex: {{ networks.development.hex_chain_id }}),
    },
    ```

## 使用Moonbeam Truffle插件运行节点 {: #using-the-moonbeam-truffle-plugin-to-run-a-node }

您可以按照[本教程](/builders/get-started/moonbeam-dev/)搭建Moonbeam开发节点。整个搭建过程约40分钟，您需要安装Substrate及其所有依赖项。Moonbeam Truffle插件提供了一种更快启动开发节点的方式，唯一的要求是安装Docker（撰写本教程时Docker所用版本为19.03.6版本）。

首先，我们需要线下载相应的Docker映像，然后在您的本地环境中驱动Moonbeam开发节点：

```
truffle run moonbeam install
```

![Docker image download](/images/builders/interact/eth-dev-env/truffle/truffle-2.png)

下载后，我们可以使用以下指令来开始生成本地节点：

```
truffle run moonbeam start
```

您将看到节点启动的提示消息，紧随其后的是两个有效终端。

![Moonbeam local node started](/images/builders/interact/eth-dev-env/truffle/truffle-3.png)

您可以通过以下代码来停止运行Moonbeam开发节点，并删除Docker映像：

```
truffle run moonbeam stop && \
truffle run moonbeam remove
```

![Moonbeam local node stoped and image removed](/images/builders/interact/eth-dev-env/truffle/truffle-4.png)

您还可以选择暂停和取消暂停Moonbeam开发节点：

```
truffle run moonbeam pause
truffle run moonbeam unpause
```

您可以在下图中看到这些命令的输出：

![Install Moonbeam Truffle box](/images/builders/interact/eth-dev-env/truffle/truffle-5.png)

!!! 注意事项
    如果您熟悉Docker，您可以跳过插件命令，直接与Docker映像交互。

## 合约文件 {: #the-contract-file }

Truffle Box中还包含一个ERC-20 Token合约：

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

这是一个基于当前OpenZepplin ERC-20合约编写的简易版ERC-20合约。该合约使用"MYTOK" 符号及标准18个小数位来创建“MyToken”。此外，还将为合约创建者设置初始Token供应量。

如果我们查看`migrations/2_deploy_contracts.js`下的Truffle合约迁移脚本，内容如下：

```javascript
var MyToken = artifacts.require('MyToken');

module.exports = function (deployer) {
   deployer.deploy(MyToken, '8000000000000000000000000');
};
```

“8000000000000000000000000”是合约初始Token供应量，即800万小数点后18位。

## 使用Truffle在Moonbeam上部署合约 {: #deploying-a-contract-to-moonbeam-using-truffle }

我们在部署之前必须先对合约进行编译。（之所以称之为“合约”，是因为一般在Truffle部署中包含`Migrations.sol`合约。您可以使用以下命令执行此操作：

```
truffle compile
```

若操作成功，您将会看到如下图所示情况：

![Truffle compile success message](/images/builders/interact/eth-dev-env/truffle/truffle-6.png)

现在我们开始准备部署已编译完的合约。您可以使用以下命令执行此操作：

=== "Moonriver"
    ```
truffle migrate --network moonriver
    ```

=== "Moonbase Alpha"
    ```
    truffle migrate --network moonbase
    ```

=== "Moonbeam Dev Node"
    ```
    truffle migrate --network dev
    ```

若操作成功，您将看到部署成功的信息，其中包括部署合约的地址：

![Successful contract deployment actions](/images/builders/interact/eth-dev-env/truffle/truffle-7.png)

