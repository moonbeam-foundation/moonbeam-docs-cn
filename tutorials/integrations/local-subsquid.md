---
title: 索引本地开发节点
description: 通过此教程了解如何使用Subsquid检索本地部署在Moonbeam开发节点上的dApp，提高您的dApp开发体验
---

# 使用Subsquid检索本地Moonbeam开发节点

![Subsquid Banner](/images/tutorials/integrations/local-subsquid/local-subsquid-banner.png)

_作者：Erin Shaben_

## 概览 {: #introduction }

在开发dApp时，使用本地的开发环境而非如测试网或主网等实际运作的网络来开发智能合约是有益的。在本地进行开发，可以消除在实际网络开发时会遇到的一些麻烦，例如必须为开发账户提供资金和等待区块生成等等。在Moonbeam，开发者可以启动他们自己的本地[Moonbeam 开发节点](/builders/get-started/networks/moonbeam-dev){target=_blank}以快速轻松地构建和测试应用。

但那些依赖检索器来检索区块链数据的dApp呢？这些应用的开发者该如何简化开发过程？通过[Subsquid](/builders/integrations/indexers/subsquid){target=_blank}，一个用于如Moonbeam等基于Substrate区块链的查询节点框架，现在可以在本地开发环境（例如您的Moonbeam开发节点）上检索内容！

本教程将带您了解使用Subsquid在本地Moonbeam开发节点上检索数据的过程。我们将会创建一个ERC-20合约并使用Subsquid来检索我们的ERC-20的转账记录。

本教程基于Massimo Luraschi关于如何[通过本地检索提高dApp开发效率](https://medium.com/subsquid/boost-your-dapp-development-productivity-with-local-indexing-3936ba7a8cec)的教程{target=_blank}，但已针对Moonbeam开发节点进行了修改。

## 查看先决条件 {: #checking-prerequisites }

要跟随此教程，您需要具备以下条件：

- [完成安装Docker](https://docs.docker.com/get-docker/){target=_blank}
- [完成安装Docker Compose](https://docs.docker.com/compose/install/){target=_blank}
- 一个空白的Hardhat项目。关于详细的步骤指示，请查看我们Hardhat文档页面的[创建一个Hardhat项目](/builders/build/eth-api/dev-env/hardhat/#creating-a-hardhat-project){target=_blank}部分

在后面的教程中我们将会配置Hardhat项目和创建Subsquid项目。

## 创建一个本地开发节点 {: #spin-up-a-local-development-node }

首先，我们将使用Docker启动本地Moonbeam开发节点。出于本教程的教学目的，我们将配置我们的开发节点，使其以每四秒生成（密封）区块，这将简化调试过程。但是，您可以根据需求随意增加或减少这个时间，或者将您的节点配置为立即密封区块。使用即时密封设定时，区块链将在收到交易时创建一个区块。

在启动本地节点时，我们将会使用以下指令：

- `--dev` - 指定使用开发链
- `--sealing 4000` - 每四秒（4000毫秒）密封一个区块
- `--ws-external` - 监听所有WebSocket接口

要创建一个开发节点，您可以运行以下指令为Moonbeam提供最新的Docker映像：

=== "Ubuntu"
    ```
    docker run --rm --name {{ networks.development.container_name }} --network host \
    purestake/moonbeam:{{ networks.development.build_tag }} \
    --dev --sealing 4000 --ws-external --rpc-external
    ```

=== "MacOS"
    ```
    docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 \
    purestake/moonbeam:{{ networks.development.build_tag }} \
    --dev --sealing 4000 --ws-external --rpc-external
    ```

=== "Windows"
    ```
    docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 ^
    purestake/moonbeam:{{ networks.development.build_tag }} ^
    --dev --sealing 4000 --ws-external --rpc-external
    ```

这些指令将会启动我们的开发节点，您可以使用9944端口。

![Spin up a Moonbeam development node](/images/tutorials/integrations/local-subsquid/local-squid-1.png)

我们的开发节点具有10个预先拥有资金的账户。

??? note "开发账户地址和私钥"
    --8<-- 'code/setting-up-node/dev-accounts.md'

关于更多运行Moonbeam开发节点的信息，请查看[设置Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev){target=_blank}的教程。

## 设置一个Hardhat项目 {: #create-a-hardhat-project }

你应该已经创建了一个空白的Hardhat项目，但如果你并没有创建Hardhat项目，你可以在我们的Hardhat文档页面查看[创建一个Hardhat项目](/builders/build/eth-api/dev-env/hardhat/#creating- a-hardhat-project){target=_blank}的教程。

在本部分教程中，我们将为本地Moonbeam开发节点配置我们的Hardhat项目，创建ERC-20合约，并编写脚本以部署我们的合约并与之交互。

在开始创建项目之前，首先要安装一些需要的依赖项：[Hardhat Ethers插件](https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html){target=_blank}和[OpenZeppelin合约](https://docs.openzeppelin.com/contracts/4.x/){target=_blank}。Hardhat Ethers插件提供了一种使用[Ethers](/builders/build/eth-api/libraries/ethersjs){target=_blank}库与网络交互的便捷方式。我们将使用OpenZeppelin的基础ERC-20实现来创建ERC-20。要安装这两个依赖项，您可以运行以下指令：

=== "npm"

    ```
    npm install @nomiclabs/hardhat-ethers ethers @openzeppelin/contracts
    ```

=== "yarn"

    ```
    yarn add @nomiclabs/hardhat-ethers ethers @openzeppelin/contracts
    ```

### 为一个本地开发节点配置Hardhat {: #create-a-hardhat-project }

在更新配置文件之前，我们需要获得其中一个开发帐户的私钥，该私钥将用于部署我们的合约和发送交易。在此例子中，我们将使用Alith的私钥：

```
0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133
```

!!! 注意事项
    **请勿将私钥存储在JavaScript或Python文件中。**

    开发账户中通常包含私钥，且这些账户存在于您自己的开发环境。然而，当您持续为如Moonbase Alpha或Moonbeam（超出本教程的范围）等实时网络建立索引时，您需要通过指定的secret manager管理器或类似服务管理您的私钥。

现在我们可以编辑`hardhat.config.js`为我们的Moonbeam开发节点包含以下网络和帐户配置：

```js
require('@nomiclabs/hardhat-ethers');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    dev: { 
      url: "{{ networks.development.rpc_url }}",
      chainId: {{ networks.development.chain_id }}, // (hex: {{ networks.development.hex_chain_id }}),
      accounts: ["0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133"], // Alith's private key
    },
  },
};
```

### 创建一个ERC-20合约 {: #create-an-erc-20-contract } 

出于本教程目的，我们将创建一个简单的ERC-20合约。我们将依赖OpenZeppelin的ERC-20基础实现。我们将从为合约创建一个文件并将其命名为`MyTok.sol`开始：

```
mkdir -p contracts && touch contracts/MyTok.sol
```

现在我们可以编辑`MyTok.sol`文件并包含以下合约，它将生成MYTOK的初始供应数并仅允许合约所有者生成额外的Token：

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyTok is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("MyToken", "MYTOK") {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

### 部署一个ERC-20合约 {: #deploy-erc-20-contract }

现在我们已经成功设置我们的合约，我们能够编译和部署合约。

您可以运行以下指令编译合约：

```
npx hardhat compile
```

![Compile contracts using Hardhat](/images/tutorials/integrations/local-subsquid/local-squid-2.png)

此指令将会编译合约并为其产生一个包含`artifacts`和合约ABI的目录。

要部署合约，我们需要创建一个部署脚本来部署我们的ERC-20合约并生成MYTOK的初始供应。我们将使用Alith的账户来部署合约，并指定初始供应量为1000 MYTOK。MYTOK的初始供应将被铸造并发送给合约所有者，也就是Alith。

让我们跟随以下步骤来部署我们的合约：

1. 为我们的脚本创建一个目录的文件：
    
    ```
    mkdir -p scripts && touch scripts/deploy.js
    ```
    
2. 在`deploy.js`文件中添加以下脚本：
    
    ```js
    // We require the Hardhat Runtime Environment explicitly here. This is optional
    // but useful for running the script in a standalone fashion through `node <script>`.
    //
    // You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
    // will compile your contracts, add the Hardhat Runtime Environment's members to the
    // global scope, and execute the script.
    const hre = require('hardhat');
    
    async function main() {
      // Get ERC-20 Contract
      const MyTok = await hre.ethers.getContractFactory('MyTok');
    
      // Deploy it with Inital supply of 1000
      const myTok = await MyTok.deploy(1000000000000000000000n);
    
      // Wait for the Deployment
      await myTok.deployed();
    
      console.log(`Contract deployed to ${myTok.address}`);
    }
    
    // We recommend this pattern to be able to use async/await everywhere
    // and properly handle errors.
    main().catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
    ```
    
3. 使用我们在`hardhat.config.js`文件中设置的`dev`网络配置运行脚本：
    
    ```
    npx hardhat run scripts/deploy.js --network dev
    ```

部署合约的地址应当在终端出现，请保存该地址，我们将在后面的教程中用于合约交互。

![Deploy contracts using Hardhat](/images/tutorials/integrations/local-subsquid/local-squid-3.png)

### 转移ERC-20 {: #transfer-erc-20s }

由于我们将检索ERC-20的`Transfer`事件，我们需要发送一些交易，将一些Token从Alith的账户转移到我们的其他测试账户。为此，我们将创建一个简单的脚本，将10个MYTOK转移给Baltathar、Charleth、Dorothy和Ethan。请跟随以下步骤：

1. 创建一个新的文件脚本以传送交易
    
    ```
    touch scripts/transactions.js
    ```
    
2. 在`transactions.js`文件中添加以下脚本：

    ```js
    // We require the Hardhat Runtime Environment explicitly here. This is optional
    // but useful for running the script in a standalone fashion through `node <script>`.
    //
    // You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
    // will compile your contracts, add the Hardhat Runtime Environment's members to the
    // global scope, and execute the script.
    const hre = require('hardhat');
    
    async function main() {
      // Get Contract ABI
      const MyTok = await hre.ethers.getContractFactory('MyTok');
    
      // Plug ABI to Address
      const myTok = await MyTok.attach('0xc01Ee7f10EA4aF4673cFff62710E1D7792aBa8f3');
    
      const value = hre.ethers.utils.parseUnits('10', 'ether');
    
      let tx;
      // Transfer to Baltathar
      tx = await myTok.transfer('0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0', value);
      await tx.wait();
      console.log(`Transfer to Baltathar with TxHash ${tx.hash}`);
    
      // Transfer to Charleth
      tx = await myTok.transfer('0x798d4Ba9baf0064Ec19eB4F0a1a45785ae9D6DFc', value);
      await tx.wait();
      console.log(`Transfer to Charleth with TxHash ${tx.hash}`);
    
      // Transfer to Dorothy
      tx = await myTok.transfer('0x773539d4Ac0e786233D90A233654ccEE26a613D9', value);
      await tx.wait();
      console.log(`Transfer to Dorothy with TxHash ${tx.hash}`);
    
      // Transfer to Ethan
      tx = await myTok.transfer('0xFf64d3F6efE2317EE2807d223a0Bdc4c0c49dfDB', value);
      await tx.wait();
      console.log(`Transfer to Ethan with TxHash ${tx.hash}`);
    }
    
    // We recommend this pattern to be able to use async/await everywhere
    // and properly handle errors.
    main().catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
    ```
    
3. 运行脚本以传送交易：
    
    ```
    npx hardhat run scripts/transactions.js --network dev
    ```

当交易传送成功，您将会在终端中看到交易记录。

![Send transactions using Hardhat](/images/tutorials/integrations/local-subsquid/local-squid-4.png)

现在我们可以创建Squid以在本地开发节点检索数据。

## 创建一个Subsquid项目 {: #create-subsquid-project } 

现在我们将开始创建Subsquid项目。首先，我们需要安装[Subsquid CLI](https://docs.subsquid.io/squid-cli/){target=_blank}：

```
npm i -g @subsquid/cli
```

现在我们将能够使用`sqd`指令与我们的Squid项目进行交互。要创建我们的项目，我们将使用`-t`标志，这将从模板创建一个项目。我们将使用EVM Squid模板，这是一个用于检索EVM链的入门项目。

您可以运行以下指令创建一个名为`local-squid`的EVM Squid项目：

```
sqd init local-squid -t evm
```

这将会创建一个拥有所有必要依赖项的Squid项目。您可以继续操作并安装所有依赖项：

```
cd local-squid && npm install
```

现在我们已经完成我们项目的初始配置，我们需要配置我们的项目以从本地开发节点检索ERC-20`Transfer`事件。

### 检索一个本地Moonbeam开发节点 {: #index-a-local-dev-node }

要检索本地开发节点，我们将使用Subsquid的EVM Archive。如果您不熟悉Subsquid，Archive是链上数据的数据湖，EVM Archive用于EVM数据。

EVM Archive通过Subsquid的`subsquid/eth-archive-worker`Docker映像提供。我们将Archive配置通过将其指向我们在`9944`运行的开发节点端口来检索我们的链上数据。

要开始进行操作，我们需要为Archive创建一个新的目录和Docker编译文件。

```
mkdir archive && touch archive/docker-compose.archive.yml
```

接着，我们可以添加以下代码至`docker-compose.archive.yml`文件中：

```yml
version: "3"

services:
  worker:
    image: subsquid/eth-archive-worker:latest
    environment:
      RUST_LOG: "info"
    ports:
      - 8080:8080
    command: [
            "/eth/eth-archive-worker",
            "--server-addr", "0.0.0.0:8080",
            "--db-path", "/data/db",
            "--data-path", "/data/parquet/files",
            "--request-timeout-secs", "300",
            "--connect-timeout-ms", "1000",
            "--block-batch-size", "10",
            "--http-req-concurrency", "10",
            "--best-block-offset", "10",
            "--rpc-urls", "http://host.docker.internal:9944/",
            "--max-resp-body-size", "30",
            "--resp-time-limit", "5000",
            "--query-concurrency", "16",
    ]
    # Uncomment this section on Linux machines.
    # The connection to local RPC node will not work otherwise.
    # extra_hosts:
    #   - "host.docker.internal:host-gateway"
    volumes:
      - database:/data/db

volumes:
  database:
```

!!! 注意事项
    如果您使用的是Linux，别忘记取消`extra_hosts`部分的评论。

为了轻松运行Archive，让我们更新位于`local-squid`根目录中的先前存在的`commands.json`文件，以包含`archive-up`和`archive-down`指令，这将启动并根据需要关闭Archive：

```json
{
    "$schema": "https://cdn.subsquid.io/schemas/commands.json",
    "commands": {
      "archive-up": {
        "description": "Start local Moonbeam Archive",
        "cmd": ["docker-compose", "-f", "archive/docker-compose.archive.yml", "up", "-d"]
      },
      "archive-down": {
        "description": "Stop local Moonbeam Archive",
        "cmd": ["docker-compose", "-f", "archive/docker-compose.archive.yml", "down"]
      },
      // ...
    }
  }
```

!!! 注意事项
    在`commands`对象中添加两个新指令的位置并不重要。您可以随意将它们添加到列表顶部或您认为合适的任何位置。

现在我们可以运行以下指令开始我们的Archive：

```
sqd archive-up
```

这将会在8080端口运行我们的Archive。

![Spin up a local Subsquid EVM Archive](/images/tutorials/integrations/local-subsquid/local-squid-5.png)

Archive的部分就是这样！现在我们需要更新我们的Squid项目来检索ERC-20`Transfer`事件，然后我们就可以运行检索器了！

### 检索ERC-20转账 {: #index-erc-20-transfer events}

要检索ERC-20转账，我们需要执行以下步骤：

1. 更新数据库结构并为数据生产模型
2. 使用`MyTok`合约的ABI生成TypeScript接口，我们的Squid将使用这些来检索`Transfer`事件
3. 配置处理器以处理来自我们本地开发节点和Archive的`MyTok`合约的`Transfer`事件。然后我们将添加逻辑以处理`Transfer`事件并保存处理过的传输数据

如先前所述，我们首先需要为传输数据定义数据库结构。为此，我们将编辑位于`local-squid`根目录中的`schema.graphql`文件，并创建一个`Transfer`实体：

```
type Transfer @entity {
  id: ID!
  block: Int!
  from: String! @index
  to: String! @index
  value: BigInt!
  txHash: String!
  timestamp: BigInt!
}
```

现在我们可以从结构中产生实体类，我们将会用这些信息处理转账数据：

```
sqd codegen
```

接着，我们可以使用我们列表上的第二个条目并用我们的合约ABI生成TypeScript接口类。为此，可以运行以下指令：

```
sqd typegen ../artifacts/contracts/MyTok.sol/MyTok.json
```

![Run Subsquid commands](/images/tutorials/integrations/local-subsquid/local-squid-6.png)

这将在`src/abi/MyTok.ts`文件中生成相关的TypeScript接口类。在本教程中，我们将专门使用`events`。

在第三步，我们将开始更新处理器。处理器从Archive中获取链上数据，按照指定的方式转换数据，并保存结果。我们将在`src/processor.ts`文件中处理每一项。

我们将会采取以下步骤操作：

1. 导入我们先前两个步骤产生的文件：数据模型和事件接口
2. 将`chain`数据来源设置为我们的本地开发节点，并将`archive`设置为本地Archive
3. 让处理器为`MyTok`合约处理EVM日志和筛选`Transfer`事件
4. 添加逻辑以处理转账数据。我们将迭代与`MyTok`合约相关的每个区块和`Transfer`事件，解码它们，并将传输数据保存到数据库

您可以在`src/processor.ts`文件中使用以下代码取代所有原有的内容：

```js
import { TypeormDatabase } from "@subsquid/typeorm-store";
import { EvmBatchProcessor } from "@subsquid/evm-processor";
import { Transfer } from "./model";
import { events } from "./abi/MyTok";

const contractAddress = "0xc01Ee7f10EA4aF4673cFff62710E1D7792aBa8f3".toLowerCase();
const processor = new EvmBatchProcessor()
  .setDataSource({
    chain: "http://localhost:9944", // Local development node
    archive: "http://localhost:8080", // Local Archive
  })
  .addLog(contractAddress, {
    filter: [[events.Transfer.topic]],
    data: {
      evmLog: {
        topics: true,
        data: true,
      },
      transaction: {
        hash: true
      }
    }
  });

processor.run(new TypeormDatabase(), async (ctx) => {
  const transfers: Transfer[] = []
  for (let c of ctx.blocks) {
    for (let i of c.items) {

      if (i.address === contractAddress && i.kind === "evmLog"){
          if (i.transaction){
            const { from, to, value } = events.Transfer.decode(i.evmLog)
            transfers.push(new Transfer({
              id: `${String(c.header.height).padStart(10, '0')}-${i.transaction.hash.slice(3,8)}`,
              block: c.header.height,
              from: from,
              to: to,
              value: value.toBigInt(),
              timestamp: BigInt(c.header.timestamp),
              txHash: i.transaction.hash
            }))
          }
      }
    }
   }
   await ctx.store.save(transfers)
});
```

现在我们已经完成所有必要的步骤，并已经准备好运行我们的检索器！

### 运行检索器 {: #run-indexer }

要运行检索器，我们需要运行一系列的`sqd`指令：

1. 创建项目：
    
    ```
    sqd build
    ```
    
2. 启动数据库：
    
    ```
    sqd up
    ```
    
3. 删除EVM模板附带的数据库迁移文件，并为新数据库结构生成一个新文件：
    
    ```
    sqd migration:clean
    sqd migration:generate
    ```
    
4. 启动检索器：
    
    ```
    sqd process
    ```

!!! 注意事项
    您可以查看`commands.json`文件了解`sqd`指令执行了什么内容。

在终端中，您应当能看见检索器在处理区块！

![Spin up a Subsquid indexer](/images/tutorials/integrations/local-subsquid/local-squid-7.png)

如果您的Squid没有正确地检索区块，请确保您的开发节点正在使用`--sealing`标志运行。以本教程例子来说，你应该将标志设置为`--sealing 4000`，这样每四秒就会产生一个区块。您也可以根据需要随意编辑时间间隔。在您尝试再次启动您的Squid之前，请运行以下指令来关闭本地Archive和Squid：

```
sqd archive-down && sqd down
```

接着您可以启动本地Archive和备用Squid：

```
sqd archive-up && sqd up
```

最后您将能够重新继续检索：

```
sqd process
```

现在您的检索器将没有问题的检索您的开发节点！

### 检查检索器 {: #query-indexer }

要检查我们的检索器，我们需要在新的终端视窗中启动GraphQL服务器：

```
sqd serve
```

GraphQL服务器将被启动，您可以在[localhost:4350/graphql](http://localhost:4350/graphql){target=_blank}进行访问。接着您将能够检查数据库中的所有转账数据：

```gql
query MyQuery {
  transfers {
    id
    block
    from
    to
    value
    txHash
  }
}
```

所有转账数据都应当出现，包含转账至Alith账户的初始供应转账，以及Alith与Baltathar、Charleth、Dorothy和Ethan之间的转账。

![Query transfer data using the GraphQL server](/images/tutorials/integrations/local-subsquid/local-squid-8.png)

就这样！您已经成功使用Subsquid在本地Moonbeam开发节点检索数据！您可以在[GitHub](https://github.com/eshaben/local-squid-demo){target=_blank}上查看完整的项目内容。

--8<-- 'text/disclaimers/educational-tutorial.md'

--8<-- 'text/disclaimers/third-party-content.md'
