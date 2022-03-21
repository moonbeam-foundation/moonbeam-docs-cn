---
title: 使用Scaffold-ETH
description: 通过本教程学习如何使用Scaffold-ETH快速在Moonbeam上部署带有React UI和subgraph的Solidity DApp。
---

# 使用Scaffold-ETH在Moonbeam上部署DApp

![Scaffold-ETH Banner](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-banner.png)

## 概览 {: #introduction }

[Scaffold-ETH](https://github.com/scaffold-eth/scaffold-eth){target=_blank}是以太坊常用开发工具的集合，使开发人员能够快速部署Solidity智能合约，并上线带有React前端和已部署subgraph的DApp。目前有一些预制模板可供常见DApp类型，如NFT、ERC-20 Token、多签钱包、简易DEX等使用。

Scaffold-ETH由一些子组件组成，包括Hardhat、The Graph和React UI。所有这些组件只需稍作修改就可在Moonbeam网络上使用。本教程将引导您如何在Moonbeam网络上使用Scaffold-ETH部署和运行默认示例合约和DApp。

## 查看先决条件 {: #checking-prerequisites }

--8<-- 'text/common/install-nodejs.md'

要运行Scaffold-ETH的The Graph组件，您还需要在您的系统安装以下程序以从Docker运行本地The Graph节点：

 - [Docker](https://docs.docker.com/get-docker/){target=_blank}
 - [Docker Compose](https://docs.docker.com/compose/install/){target=_blank}
 - [JQ](https://stedolan.github.io/jq/download/){target=_blank}

### 安装Scaffold-ETH {: #installing-scaffold-eth }

首先，从GitHub代码库下载Scaffold-ETH。

在命令行输入：

```
git clone https://github.com/scaffold-eth/scaffold-eth.git
```

下载完成后，运行：

```
yarn install
```

![Scaffold-ETH installation output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-1.png)

当依赖项已安装且在控制台输出无任何错误（如上图所示），您可以继续修改Scaffold-ETH的不同组件。

## 修改配置 {: #modify-configurations }

您需要对组成Scaffold-ETH的三个主要组件进行配置修改。

### Hardhat组件 {: #hardhat-component }

您可以在`/packages/hardhat`文件下对Hardhat组件进行修改配置。

1. 您需要修改的文件名为`scaffold-eth/packages/hardhat/hardhat.config.js`。在`module.exports/networks`部分，添加您想要使用的Moonbeam网络的网络定义：包括RPC端点、chain ID以及部署合约账户的私钥

    === "Moonbeam"

        ```js
        moonbeam: {
            url: '{{ networks.moonbeam.rpc_url }}',
            chainId: {{ networks.moonbeam.chain_id }},  // {{ networks.moonbeam.hex_chain_id }} in hex,
            accounts: ["Deployment Account Private Key"]
        }
        ```
    
    === "Moonriver"

        ```js
        moonriver: {
            url: '{{ networks.moonriver.rpc_url }}',
            chainId: {{ networks.moonriver.chain_id }},  // {{ networks.moonriver.hex_chain_id }} in hex,
            accounts: ["Deployment Account Private Key"] 
        }
        ```
    
    === "Moonbase Alpha"

        ```js
        moonbaseAlpha: {
            url: '{{ networks.moonbase.rpc_url }}',
            chainId: {{ networks.moonbase.chain_id }},  // {{ networks.moonbase.hex_chain_id }} in hex,
            accounts: ["Deployment Account Private Key"]
        }
        ```
    
    === "Moonbeam Dev Node"

        ```js
        moonbeamDevNode: {
            url: '{{ networks.development.rpc_url }}',
            chainId: {{ networks.development.chain_id }},  // {{ networks.development.hex_chain_id }} in hex,
            accounts: ["Deployment Account Private Key"]
        }
        ```
    
2. 在同一个文件中，使用您已定义的网络名称，将`defaultNetwork`常量设置为您想要部署智能合约的网络

    === "Moonbeam"
        ```
        defaultNetwork = "moonbeam";
        ```
    
    === "Moonriver"
        ```
        defaultNetwork = "moonriver";
        ```
    
    === "Moonbase Alpha"
        ```
        defaultNetwork = "moonbaseAlpha";
        ```
    
    === "Moonbeam Dev Node"
        ```
        defaultNetwork = "moonbeamDevNode";
        ```
    
3. 在同一个文件的`module.exports/etherscan/apiKey`部分，为[Moonscan](https://moonscan.io/){target=_blank}添加API密钥，用于验证已部署的智能合约。了解如何生成Moonscan API密钥，请查看[Etherscan Plugins](/builders/tools/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}部分。


4. （可选）在`function mnemonic()`部分，注释当网络未设置为`localhost`时控制台发出警告

    ```js
    if (defaultNetwork !== "localhost") {
      //console.log(
      //  "☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`."
      //);
    }
    ```

关于如何在Moonbeam上使用Hardhat部署合约的更多资讯，请参考[Hardhat页面](/builders/interact/hardhat/){target=_blank}。

### The Graph组件 {: #the-graph-component }

在Scaffold-ETH的The Graph组件中，您需要修改两个文件将本地TheGraph节点实例指向对应Moonbeam RPC端点。

1. 首先，修改`servers/graph-node/environment/ethereum`下的`scaffold-eth/packages/services/graph-node/docker-compose.yaml`文件，将The Graph节点的 RPC端点更改为索引：


    === "Moonbeam"
        ```
        'moonbeam:{{ networks.moonbeam.rpc_url }}'
        ```
    
    === "Moonriver"
        ```
        'moonriver:{{ networks.moonriver.rpc_url }}'
        ```
    
    === "Moonbase Alpha"
        ```
        'mbase:{{ networks.moonbase.rpc_url }}'
        ```
    
    === "Moonbeam Dev Node"
        ```
        'mbase:{{ networks.development.rpc_url }}'
        ```
    
    !!! 注意事项
        本示例使用Moonbeam公共RPC端点，但对于生产DApp，建议使用私有API端点提供商。查看[此页面](/builders/get-started/endpoints/#endpoint-providers){target=_blank}获取更多信息。

2. 接下来，您需要修改`subgraph/src/subgraph.template.yaml`。将正在部署的合约中`dataSources/network`字段更改为先前在`docker-compose.yaml`中定义的对应网络名称：

    === "Moonbeam"
        ```
        network: moonbeam 
        ```
    
    === "Moonriver"
        ```
        network: moonriver
        ```
    
    === "Moonbase Alpha"
        ```
        network: mbase 
        ```
    
    === "Moonbeam Dev Node"
        ```
        network: mbase 
        ```
    
3. 接着，在同一个文件`subgraph.template.yaml`中，将`dataSources/source/address`字段更改为：

    === "Moonbeam"
        ```
        {% raw %}
        address: "{{moonbeam_YourContractAddress}}"
        {% endraw %}
        ```
    
    === "Moonriver"
        ```
        {% raw %}
        address: "{{moonriver_YourContractAddress}}"
        {% endraw %}
        ```
    
    === "Moonbase Alpha"
        ```
        {% raw %}
        address: "{{moonbaseAlpha_YourContractAddress}}"
        {% endraw %}
        ```
        
    === "Moonbeam Dev Node"
        ```
        {% raw %}
        address: "{{moonbeamDevNode_YourContractAddress}}"
        {% endraw %}
        ```
    
4. 最后，在同一个文件`subgraph.template.yaml`中，将`dataSources/mapping/abis/file`字段更改为：

    === "Moonbeam"
        ```
        file: ./abis/moonbeam_YourContract.json
        ```
    
    === "Moonriver"
        ```
        file: ./abis/moonriver_YourContract.json
        ```
    
    === "Moonbase Alpha"
        ```
        file: ./abis/moonbaseAlpha_YourContract.json
        ```
    
    === "Moonbeam Dev Node"
        ```
         file: ./abis/moonbeamDevNode_YourContract.json
        ```

关于如何在Moonbeam上使用The Graph部署合约的更多资讯，请参考[The Graph页面](/builders/integrations/indexers/thegraph/){target=_blank}。关于如何在Moonbeam上运行The Graph节点的更多资讯，请参考[The Graph Node页面](/node-operators/indexer-nodes/thegraph-node/){target=_blank}。

### React组件 {: #react-component }

现在，您需要在React组件中修改两个文件以添加Moonbeam网络。

1. 首先，在`NETWORKS`常量下将对应Moonbeam网络添加至`scaffold-eth/packages/react-app/src/constants.js`：

    === "Moonbeam"

        ```js
        moonbeam: {
            name: "moonbeam",
            color: "#42A2A0",
            chainId: {{ networks.moonbeam.chain_id }}, // {{ networks.moonbeam.hex_chain_id }} in hex,
            blockExplorer: "{{ networks.moonbeam.block_explorer }}",
            rpcUrl: "{{ networks.moonbeam.rpc_url }}",
            gasPrice: 100000000000,
            faucet: "",
        },
        ```
    
    === "Moonriver"

        ```js
        moonriver: {
            name: "moonriver",
            color: "#42A2A0",
            chainId: {{ networks.moonriver.chain_id }}, // {{ networks.moonriver.hex_chain_id }} in hex,
            blockExplorer: "{{ networks.moonriver.block_explorer }}",
            rpcUrl: "{{ networks.moonriver.rpc_url }}",
            gasPrice: 1000000000,
            faucet: "",
        },
        ```
    
    === "Moonbase Alpha"

        ```js
        moonbaseAlpha: {
            name: "moonbaseAlpha",
            color: "#42A2A0",
            chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex,
            blockExplorer: "{{ networks.moonbase.block_explorer }}",
            rpcUrl: "{{ networks.moonbase.rpc_url }}",
            gasPrice: 1000000000,
            faucet: "https://discord.gg/SZNP8bWHZq",
        },
        ```
    
    === "Moonbeam Dev Node"

        ```js
        moonbeamDevNode: {
            name: "moonbeamDevNode",
            color: "#42A2A0",
            chainId: {{ networks.development.chain_id }}, // {{ networks.development.hex_chain_id }} in hex,
            blockExplorer: "{{ networks.development.block_explorer }}",
            rpcUrl: "{{ networks.development.rpc_url }}",
            gasPrice: 1000000000,
            faucet: "",
        }
        ```
    
2. 接下来，修改`scaffold-eth/packages/react-app/src/App.jsx`，并将`initialNetwork`常量设置从`constants.js`导出的对应网络定义成默认网络：

    === "Moonbeam"
        ```
        const initialNetwork = NETWORKS.moonbeam;
        ```
    
    === "Moonriver"
        ```
        const initialNetwork = NETWORKS.moonriver;
        ```
    
    === "Moonbase Alpha"
        ```
        const initialNetwork = NETWORKS.moonbaseAlpha;
        ```
    
    === "Moonbeam Dev Node"
        ```
        const initialNetwork = NETWORKS.moonbeamDevNode;
        ```
    
3. 在同一个文件`App.jsx`中，将`networkOptions`设置为您的DApp所支持的网络，例如：

    ```
    const networkOptions = [initialNetwork.name, "moonbeam", "moonriver"];
    ```

## 部署并启动DApp {: #deploy-and-launch-the-dapp }

1. 所有配置文件修改完毕后，通过输入以下代码启动本地The Graph节点实例：

    ```
    yarn run-graph-node
    ```
    
    这将通过Docker镜像启动一个本地节点实例，并控制台输出将显示它正在索引其指向的网络区块

    ![The Graph node output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-2.png)

2. 在终端打开新的标签或窗口。然后，通过运行以下命令编译和部署智能合约：

    ```
    yarn deploy
    ```
    
    ![Contract deployment output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-3.png)

3. 接下来，通过输入以下命令以创建sub-graph：

    ```
    yarn graph-create-local
    ```
    
    ![Create sub-graph output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-4.png)

4. 接下来，部署sub-graph至本地graph节点：

    ```
    yarn graph-ship-local
    ```
    
    系统将提示您为正在部署的sub-graph输入版本名称

    ![Sub-graph deployment output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-5.png)

5. 最后，您可以通过输入以下命令启动React服务器：

    ```
    yarn start
    ```
    
    这将默认在`http://localhost:3000/`启动基于React的DApp UI

    ![React server output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-6.png)

6. 现在，您可以将您的浏览器指向`http://localhost:3000/`并与React前端交互

    ![React UI](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-7.png)

### 验证合约 {: #Verifying-Contracts }

如果您还想要使用Scaffold-ETH来验证已部署的智能合约，并且已经在`hardhat.config.js`输入对应的Moonscan API密钥，您可以使用以下命令来验证智能合约：

=== "Moonbeam"
    ```
    yarn verify --network moonbeam <CONTRACT-ADDRESS>
    ```

=== "Moonriver"
    ```
    yarn verify --network moonriver <CONTRACT-ADDRESS>
    ```

=== "Moonbase Alpha"
    ```
    yarn verify --network moonbaseAlpha <CONTRACT-ADDRESS>
    ```

稍等片刻，控制台输出将显示验证结果。如果成功，则会显示Moonscan上已验证合约的 URL。

![Contract verify output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-8.png)

关于如何在Moonbeam上使用Hardhat Etherscan插件验证智能合约，请参考[Etherscan Plugins页面](/builders/tools/verify-contracts/etherscan-plugins/#using-the-hardhat-etherscan-plugin){target=_blank}。