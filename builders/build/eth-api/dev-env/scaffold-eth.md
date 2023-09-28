---
title: 使用Scaffold-ETH在Moonbeam上开发DApp
description: 通过本教程学习如何使用Scaffold-ETH快速在Moonbeam上部署带有React UI和subgraph的Solidity DApp。
---

# 使用Scaffold-ETH在Moonbeam上部署DApp

## 概览 {: #introduction }

[Scaffold-ETH](https://github.com/scaffold-eth/scaffold-eth){target=_blank}是以太坊常用开发工具的集合，使开发人员能够快速部署Solidity智能合约，并上线带有React前端和已部署subgraph的DApp。目前有一些预制模板可供常见DApp类型，如NFT、ERC-20 Token、多签钱包、简易DEX等使用。

Scaffold-ETH由一些子组件组成，包括Hardhat、The Graph和React UI。所有这些组件只需稍作修改就可在Moonbeam网络上使用。本教程将引导您如何在Moonbeam网络上使用Scaffold-ETH部署和运行默认示例合约和DApp。

## 查看先决条件 {: #checking-prerequisites }

要运行Scaffold-ETH的The Graph组件，您还需要在您的系统安装以下程序以从Docker运行本地The Graph节点：

 - [Docker](https://docs.docker.com/get-docker/){target=_blank}
 - [Docker Compose](https://docs.docker.com/compose/install/){target=_blank}
 - [JQ](https://stedolan.github.io/jq/download/){target=_blank}

 --8<-- 'text/_common/endpoint-examples.md'

### 安装Scaffold-ETH {: #installing-scaffold-eth }

首先，从GitHub代码库下载Scaffold-ETH。

在命令行输入：

```bash
git clone https://github.com/scaffold-eth/scaffold-eth.git
```

下载完成后，运行：

```bash
yarn install
```

![Scaffold-ETH installation output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-1.png)

当依赖项已安装且在控制台输出无任何错误（如上图所示），您可以继续修改Scaffold-ETH的不同组件。

## 修改配置 {: #modify-configurations }

您需要对组成Scaffold-ETH的三个主要组件进行配置修改。

--8<-- 'text/_common/endpoint-examples.md'

### Hardhat组件 {: #hardhat-component }

您可以在`/packages/hardhat`文件下对Hardhat组件进行修改配置。

1. 您需要修改的文件名为`scaffold-eth/packages/hardhat/hardhat.config.js`。首先，将`defaultNetwork`常量设置为您想要部署智能合约的网络

    === "Moonbeam"

        ```js
        defaultNetwork = "moonbeam";
        ```

    === "Moonriver"

        ```js
        defaultNetwork = "moonriver";
        ```

    === "Moonbase Alpha"

        ```js
        defaultNetwork = "moonbaseAlpha";
        ```

    === "Moonbeam开发节点"

        ```js
        defaultNetwork = "moonbeamDevNode";
        ```

2. 在同一个文件的`module.exports/etherscan/apiKey`部分，为[Moonscan](https://moonscan.io/){target=_blank}添加API密钥，用于验证已部署的智能合约。了解如何生成Moonscan API密钥，请查看[Etherscan Plugins](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}部分。

3. （可选）在`function mnemonic()`部分，注释当网络未设置为`localhost`时控制台发出警告

    ```js
    if (defaultNetwork !== "localhost") {
      //console.log(
      //  "☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`."
      //);
    }
    ```

4. 在 `scaffold-eth/packages/hardhat/` 下创建一个名为 `mnemonic.txt` 的文件，然后将合约部署者账户的助记词复制粘贴到该文件中。

关于如何在Moonbeam上使用Hardhat部署合约的更多资讯，请参考[Hardhat页面](/builders/build/eth-api/dev-env/hardhat/){target=_blank}。

### The Graph组件 {: #the-graph-component }

在Scaffold-ETH的The Graph组件中，您需要修改两个文件将本地TheGraph节点实例指向对应Moonbeam RPC端点。

1. 首先，修改`servers/graph-node/environment/ethereum`下的`scaffold-eth/packages/services/graph-node/docker-compose.yaml`文件，将The Graph节点的RPC端点更改为索引。

    对于Moonbeam或Moonriver，您可以使用私有的[RPC网络端点](/builders/get-started/endpoints/){target=_blank}和相应的网络前缀。对于Moonbase Alpha或Moonbeam开发节点，您可以使用以下端点：

    === "Moonbase Alpha"

        ```yaml
        ethereum: "moonbaseAlpha:{{ networks.moonbase.rpc_url }}"
        ```

    === "Moonbeam开发节点"

        ```yaml
        ethereum: "moonbeamDevNode:{{ networks.development.rpc_url }}"
        ```

2. 接下来，您需要修改`subgraph/subgraph.yaml`。将正在部署的合约中`dataSources/network`字段更改为先前在`docker-compose.yaml`中定义的对应网络名称：

    === "Moonbeam"

        ```yaml
        network: moonbeam
        ```

    === "Moonriver"

        ```yaml
        network: moonriver
        ```

    === "Moonbase Alpha"

        ```yaml
        network: moonbaseAlpha 
        ```

    === "Moonbeam开发节点"

        ```yaml
        network: moonbeamDevNode
        ```

3. 接着，在同一个文件`subgraph.yaml`中，将`dataSources/source/address`字段更改为含有`0x`前缀的合约部署地址
    
4. 最后，在同一个文件`subgraph.template.yaml`中，将`dataSources/mapping/abis/file`字段更改为：

    === "Moonbeam"

        ```yaml
        file: ./abis/moonbeam_YourContract.json
        ```

    === "Moonriver"

        ```yaml
        file: ./abis/moonriver_YourContract.json
        ```

    === "Moonbase Alpha"

        ```yaml
        file: ./abis/moonbaseAlpha_YourContract.json
        ```

    === "Moonbeam开发节点"

        ```yaml
        file: ./abis/moonbeamDevNode_YourContract.json
        ```

    !!! 注意事项
        如果您不部署示例合约，此处的文件名将有所不同，但遵循相同的 `<网络前缀>_<合约文件名>` 格式。

关于如何在Moonbeam上使用The Graph部署合约的更多资讯，请参考[The Graph页面](/builders/integrations/indexers/thegraph/){target=_blank}。关于如何在Moonbeam上运行The Graph节点的更多资讯，请参考[The Graph Node页面](/node-operators/indexer-nodes/thegraph-node/){target=_blank}。

### React组件 {: #react-component }

现在，您需要在React组件中修改两个文件以添加Moonbeam网络。
  
1. 首先，修改`scaffold-eth/packages/react-app/src/App.jsx`，并将`initialNetwork`常量设置从`constants.js`导出的对应网络定义成默认网络：

    === "Moonbeam"

        ```js
        const initialNetwork = NETWORKS.moonbeam;
        ```

    === "Moonriver"

        ```js
        const initialNetwork = NETWORKS.moonriver;
        ```

    === "Moonbase Alpha"

        ```js
        const initialNetwork = NETWORKS.moonbaseAlpha;
        ```

    === "Moonbeam开发节点"

        ```js
        const initialNetwork = NETWORKS.moonbeamDevNode;
        ```

2. 在同一个文件`App.jsx`中，将`networkOptions`设置为您的DApp所支持的网络，例如：

    ```js
    const networkOptions = [initialNetwork.name, "moonbeam", "moonriver"];
    ```

## 部署并启动DApp {: #deploy-and-launch-the-dapp }

1. 所有配置文件修改完毕后，通过输入以下代码启动本地The Graph节点实例：

    ```bash
    yarn run-graph-node
    ```

    这将通过Docker镜像启动一个本地节点实例，并控制台输出将显示它正在索引其指向的网络区块

    ![The Graph node output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-2.png)

2. 在终端打开新的标签或窗口。然后，通过运行以下命令编译和部署智能合约：

    ```bash
    yarn deploy
    ```

    ![Contract deployment output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-3.png)

    如果您要使用The Graph，请将部署的合约地址填入`subgraph.yaml`。如果不用The Graph，你可以跳到第5步来启动React 服务器

3. 接下来，通过输入以下命令以创建sub-graph：

    ```bash
    yarn graph-create-local
    ```

    ![Create sub-graph output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-4.png)

4. 接下来，部署sub-graph至本地graph节点：

    === "Moonbeam"

        ```bash
        yarn graph-codegen && yarn graph-build --network moonbeam && yarn graph-deploy-local
        ```

    === "Moonriver"

        ```bash
        yarn graph-codegen && yarn graph-build --network moonriver && yarn graph-deploy-local
        ```

    === "Moonbase Alpha"

        ```bash
        yarn graph-codegen && yarn graph-build --network moonbaseAlpha && yarn graph-deploy-local
        ```

    === "Moonbeam开发节点"

        ```bash
        yarn graph-codegen && yarn graph-build --network moonbeamDevNode && yarn graph-deploy-local
        ```

    系统将提示您为正在部署的sub-graph输入版本名称

    ![Sub-graph deployment output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-5.png)

5. 最后，您可以通过输入以下命令启动React服务器：

    ```bash
    yarn start
    ```

    这将默认在`http://localhost:3000/`启动基于React的DApp UI

    ![React server output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-6.png)

6. 现在，您可以将您的浏览器指向`http://localhost:3000/`并与React前端交互

    ![React UI](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-7.png)

### 验证合约 {: #Verifying-Contracts }

如果您还想要使用Scaffold-ETH来验证已部署的智能合约，并且已经在`hardhat.config.js`输入对应的Moonscan API密钥，您可以使用以下命令来验证智能合约：

=== "Moonbeam"

    ```bash
    yarn verify --network moonbeam INSERT_CONTRACT_ADDRESS
    ```

=== "Moonriver"

    ```bash
    yarn verify --network moonriver INSERT_CONTRACT_ADDRESS
    ```

=== "Moonbase Alpha"

    ```bash
    yarn verify --network moonbaseAlpha INSERT_CONTRACT_ADDRESS
    ```

!!! 注意事项
    如果您正在验证的智能合约具有构造函数方法参数，您还需要将使用的参数附加到上述命令的末尾。

稍等片刻，控制台输出将显示验证结果。如果成功，则会显示Moonscan上已验证合约的 URL。

![Contract verify output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-8.png)

关于如何在Moonbeam上使用Hardhat Etherscan插件验证智能合约，请参考[Etherscan Plugins页面](/builders/build/eth-api/verify-contracts/etherscan-plugins/#using-the-hardhat-etherscan-plugin){target=_blank}。

--8<-- 'text/_disclaimers/third-party-content.md'
