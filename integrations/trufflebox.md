---
title: Moonbeam Truffle Box
description: 学习如何使用预置的Moonbeam Truffle Box快速在Mooonbeam上部署您的Solidity智能合约。
---
# Moonbeam Truffle Box

![Intro diagram](/images/integrations/integrations-trufflebox-banner.png)

##概览
为帮助更多开发者在Moonbeam上进行部署，我们[推出了Moonbeam Truffle box](https://moonbeam.network/announcements/moonbeam-truffle-box-available-solidity-developers/)。有了Moonbeam Truffle box，开发者就可以获得模板设置，并且能迅速在Moonbeam上部署智能合约。此外，我们还整合了Moonbeam Truffle插件，导入了可以作为镜像独立运行本地节点的指令。通过这一方式，开发者无需设置本地节点（此前可能需要40分钟来编写二进制文件），从而为本地开发提供了快捷简单的解决方案。

本教程将全程指导您进行box设置，使用Moonbeam Truffle插件，并且在独立Moonbeam节点和Moonbase Alpha上使用box基本配置的Truffle来部署合约。

!!! 注意事项
    本教程操作均基于Ubuntu 18.04系统。截至发稿时，所使用的Node.js和npm版本分别为15.2.1和7.0.8版本（Node.js版本需要高于10.23.0）。另外我们也注意到使用npm 7.0.15版本进行安装会出现错误。您可以通过`npm install -g npm@version`将npm降级到所需版本解决这一问题。

## 查看先决条件

--8<-- 'text/common/install-nodejs.md'

截至发稿时，所用版本分别为15.2.1和7.0.8版本。接下来，我们可以选择全面安装Truffle。执行以下指令即可进行安装：


```
npm install -g truffle
```

截至发稿时，所用版本为5.1.51版本。

## 下载并安装Truffle Box

如果您已经全面安装了Truffle，那么只需执行以下指令即可启动Moonbeam Truffle box：

```
mkdir moonbeam-truffle-box && cd moonbeam-truffle-box
truffle unbox PureStake/moonbeam-truffle-box
```

![Unbox Moonbeam Truffle box](/images/trufflebox/trufflebox-07.png)

不过box也附带有Truffle，专门服务于不想全面安装Truffle的用户。在这种情况下，您可以直接复制以下指令：

```
git clone https://github.com/PureStake/moonbeam-truffle-box
cd moonbeam-truffle-box
```

本地系统已有所需文件后，下一步是运行以下指令安装附带程序：

```
npm install
```

!!! 注意事项
    我们注意到，使用npm 7.0.15版本进行安装会出现错误。您可以通过`npm install -g npm@version`将npm降级到7.0.8 或6.14.9等所需版本解决这一问题。

完成以上所有步骤后，运行Moonbeam Truffle box的所需环境就已经设置完毕。

## 基本功能

Box预先设置了两个网络：`dev`（服务于独立节点）和`moonbase`（服务于Moonbeam测试网）。此外还包含一个ERC20代币合约和一个简单的测试脚本。Solidity编译器的默认设置为`^0.7.0`，可以按需求修改。如果您有使用Truffle的经验，您将会熟悉整个设置过程。

```js
const HDWalletProvider = require('@truffle/hdwallet-provider');
// Moonbeam Development Node Private Key
const privateKeyDev =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
// Moonbase Alpha Private Key --> Please change this to your own Private Key with funds
// NOTE: Do not store your private key in plaintext files
//       this is only for demostration purposes only
const privateKeyMoonbase =
   'YOUR_PRIVATE_KEY_HERE_ONLY_FOR_DEMOSTRATION_PURPOSES';

module.exports = {
   networks: {
      // Standalode Network
      dev: {
         provider: () => {
            //...
            return new HDWalletProvider(
               privateKeyDev,
               'http://localhost:9933/'
            );
         },
         network_id: 1281,
      },
      // Moonbase Alpha TestNet
      moonbase: {
         provider: () => {
            //...
            return new HDWalletProvider(
               privateKeyMoonbase,
               'https://rpc.testnet.moonbeam.network'
            );
         },
         network_id: 1287,
      },
   },
   // Solidity 0.7.0 Compiler
   compilers: {
      solc: {
         version: '^0.7.0',
      },
   },
   // Moonbeam Truffle Plugin
   plugins: ['moonbeam-truffle-plugin'],
};
```

`truffle-config.js`文档也包含了独立节点的创始账户私钥。与这一私钥关联的地址会持有这一开发环境下的所有代币。假如要在Moonbase Alpha测试网上部署，您就需要提供持有资金的地址私钥。为此，您可以创建一个MetaMask账户，通过[TestNet水龙头](/getting-started/moonbase/faucet/)注入资金，并输出其私钥。

和在以太坊网络上使用Truffle一样，在Moonbeam上您也可以运行一般指令来创建、测试和部署智能合约。例如，可以用内置的ERC20代币合约尝试以下指令：

```
truffle compile # compiles the contract
truffle test #run the tests included in the test folder
truffle migrate --network network_name  #deploys to the specified network
```

根据您希望部署合约的网络，您需要在dev（服务于独立节点）或moonbase（服务于测试网）上更改network_name的内容。

!!! 注意事项
    如果您没有全面安装Truffle，则可以使用 `npx truffle`或`./node_modules/.bin/truffle` 来代替 `truffle` 。

## Moonbeam Truffle插件

要创建独立Moonbeam节点，也可以跟随[此指南](/getting-started/local-node/setting-up-a-node/)进行操作。整个过程大概需要40分钟，并且您需要安装Substrate和所有附带程序。Moonbeam Truffle插件则可以加速独立节点部署，且只需要安装镜像（截至发稿时，所用镜像版本为19.03.6版本）。关于安装镜像的更多信息，请访问[这个页面](https://docs.docker.com/get-docker/)。下载镜像文件，请运行以下代码：

```
truffle run moonbeam install
```

![Install Moonbeam Truffle box](/images/trufflebox/trufflebox-01.png)


随后，您将获得一系列的指令，可用于控制包含在镜像文件中的节点：

```
truffle run moonbeam start
truffle run moonbeam status
truffle run moonbeam pause
truffle run moonbeam unpause
truffle run moonbeam stop
truffle run moonbeam remove
```

上述指令将执行以下功能：

-  Start：启动Moonbeam独立节点。提供两个RPC终端
      - HTTP: `http://127.0.0.1:9933` 
      - WS: `ws://127.0.0.1:9944`
-  Status：告诉用户是否有正在运行的Moonbeam独立节点
-  Pause：暂停正在运行的独立节点
-  Unpause：恢复已暂停独立节点的运行
-  Stop：停止正在运行的独立节点，同时移除Docker容器
-  Remove：删除purestake/moonbase Docker文件

下图是这些指令的输出内容：

![Install Moonbeam Truffle box](/images/trufflebox/trufflebox-02.png)

如果您对Docker很熟悉，可以跳过插件指令，直接与Docker镜像交互。

## 测试Moonbeam Truffle Box

Box已经符合初始的最低启动要求。首先，我们可以运行以下指令创建合约：

```
truffle compile
```
![Compile Contracts](/images/trufflebox/trufflebox-03.png)

如果您已经全面安装了Truffle，就可以跳过指令中./node_modules/.bin/这一部分。成功创建合约后，就可以运行box中包含的基础测试（请注意，这里使用Ganache而不是Moonbeam独立节点进行测试）：

```
truffle test
```

![Test Contract Moonbeam Truffle box](/images/trufflebox/trufflebox-04.png)

运行插件安装指令之后，就会下载Moonbeam独立节点的Docker镜像。下面让我们启动本地节点，并在本地环境部署代币合约：

```
truffle run moonbeam start
truffle migrate --network dev
```

![Deploy on Dev Moonbeam Truffle box](/images/trufflebox/trufflebox-05.png)

最后，我们就可以在Moonbase Alpha部署代币合约了。但首先请您要确保已经为truffle-config.js文档中的资金设置了私钥。设置好私钥后，就可以执行指向测试网的迁移指令。

```
truffle migrate --network moonbase
```

![Deploy on Moonbase Moonbeam Truffle box](/images/trufflebox/trufflebox-06.png)

以上就是在独立Moonbeam节点和Moonbase Alpha上使用Moonbeam Truffle box部署简单的ERC20代币合约的所有步骤。
