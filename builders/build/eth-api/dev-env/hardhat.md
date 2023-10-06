---
title: 用Hardhat部署智能合约
description: 了解如何使用Hardhat在Moonbeam上编译、部署和调试以太坊智能合约。
---

# 使用Hardhat部署至Moonbeam

## 概览 {: #introduction }

[Hardhat](https://hardhat.org/){target=_blank}是一个以太坊开发环境，可帮助开发人员管理和自动化构建智能合约和DApp所固有的重复性任务。Hardhat可以直接与Moonbeam的以太坊API交互，因此可以在部署智能合约至Moonbeam时使用。

本教程将涵盖如何使用Hardhat在Moonbase Alpha测试网上编译、部署和调试以太坊智能合约。本教程也同样适用于Moonbeam、Moonriver和Moonbeam开发节点。

## 查看先决条件 {: #checking-prerequisites }

在开始之前，您将需要准备以下内容：

- 安装MetaMask并[将其连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
- 具有拥有一定数量资金的账户。
 --8<-- 'text/_common/faucet/faucet-list-item.md'
- 
  --8<-- 'text/_common/endpoint-examples-list-item.md'

## 创建Hardhat项目 {: #creating-a-hardhat-project }

如果您还未有Hardhat项目，您将需要创建一个。为此，您可以执行以下步骤：

1. 为您的项目创建一个目录

    ```sh
    mkdir hardhat && cd hardhat
    ```

2. 初始化将创建`package.json`文件的项目

    ```sh
    npm init -y
    ```

3. 安装Hardhat

    ```sh
    npm install hardhat
    ```

4. 创建项目

    ```sh
    npx hardhat init
    ```

    !!! 注意事项
        `npx`用于运行安装在项目中的本地可执行文件。虽然Hardhat可以全网安装，但是我们建议在每个项目中进行本地安装，这样您可以按项目控制项目版本。

5. 系统将会显示菜单，允许您创建新的项目或使用范本项目。在本示例中，您可以选择**Create an empty hardhat.config.js**

![Hardhat Create Project](/images/builders/build/eth-api/dev-env/hardhat/hardhat-1.png)

这将在您的项目目录中创建一个Hardhat配置文件（`hardhat.config.js`）。

Hardhat项目创建完毕后，您可以安装[Ethers plugin](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-ethers){target=_blank}。这将为使用[Ethers.js](/builders/build/eth-api/libraries/ethersjs/){target=_blank}代码库与网络交互提供一种简便方式。您可以运行以下命令进行安装：

```sh
npm install @nomicfoundation/hardhat-ethers ethers
```

## 合约文件 {: #the-contract-file }

现在您已经创建了一个空白的项目，接下来您可以通过运行以下命令创建一个`contracts`目录：

```sh
mkdir contracts && cd contracts
```

将要作为示例部署的智能合约被称为`Box`，这将存储一个数值，用于稍后检索使用。在`contracts`目录中，您可以创建`Box.sol`文件：

```sh
touch Box.sol
```

打开文件，并为其添加以下合约内容：

```solidity
// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract Box {
    uint256 private value;

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Stores a new value in the contract
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
}
```

## Hardhat配置文件 {: #hardhat-configuration-file }

在部署合约至Moonbase Alpha之前，您将需要修改Hardhat配置文件，并创建一个安全的文件以便您存储私钥。

--8<-- 'text/builders/build/eth-api/dev-env/hardhat/hardhat-configuration-file.md'
    您可以修改`hardhat.config.js`文件，使其可用于任何Moonbeam网络：

    === "Moonbeam"

        ```js
        moonbeam: {
            url: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here

            chainId: {{ networks.moonbeam.chain_id }}, // (hex: {{ networks.moonbeam.hex_chain_id }})
            accounts: [privateKey]
          },
        ```

    === "Moonriver"

        ```js
        moonriver: {
            url: '{{ networks.moonriver.rpc_url }}', // Insert your RPC URL here

            chainId: {{ networks.moonriver.chain_id }}, // (hex: {{ networks.moonriver.hex_chain_id }})
            accounts: [privateKey]
          },
        ```

    === "Moonbase Alpha"

        ```js
        moonbase: {
            url: '{{ networks.moonbase.rpc_url }}',

            chainId: {{ networks.moonbase.chain_id }}, // (hex: {{ networks.moonbase.hex_chain_id }})
            accounts: [privateKey]
          },
        ```

    === "Moonbeam开发节点"

        ```js
        dev: {
            url: '{{ networks.development.rpc_url }}',

            chainId: {{ networks.development.chain_id }}, // (hex: {{ networks.development.hex_chain_id }})
            accounts: [privateKey]
          },
        ```

```js
// 1. Import the Ethers plugin required to interact with the contract
require('@nomicfoundation/hardhat-ethers');

// 2. Add your private key from your pre-funded Moonbase Alpha testing account
const privateKey = 'INSERT_PRIVATE_KEY';

module.exports = {
  // 3. Specify the Solidity version
  solidity: "0.8.1",

  networks: {
    // 4. Add the Moonbase Alpha network specification
    moonbase: {
      url: '{{ networks.moonbase.rpc_url }}',
      chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex,
      accounts: [privateKey]
    }
  }
};
```

恭喜您！您现在可以开始部署了！

## 编译Solidity {: #compiling-solidity }

您可以简单运行以下命令编译合约：

```sh
npx hardhat compile
```

![Hardhat Contract Compile](/images/builders/build/eth-api/dev-env/hardhat/hardhat-2.png)

编译后，将会创建一个`artifacts`目录：这保存了合约的字节码和元数据，为`.json`文件。您可以将此目录添加至您的`.gitignore`。

## 部署合约 {: #deploying-the-contract }

要部署`Box.sol`智能合约，您将需要撰写一个简单的部署脚本。您可以为此脚本创建一个新目录并命名为`scripts`，然后为其添加一个名为`deploy.js`的新文件：

```sh
mkdir scripts && cd scripts
touch deploy.js
```

接下来，您需要通过`ethers`撰写一个部署脚本。因为您将使用Hardhat运行此脚本，所以您无需导入任何代码库。

要开始操作，您可以执行以下步骤：

1. 通过`getContractFactory`方法为合约创建一个本地实例
2. 使用此实例中存在的`deploy`方法来实例化智能合约
3. 使用`deployed`等待部署
4. 部署后，您可以使用合约实例获取合约的地址

```js
// scripts/deploy.js
async function main() {
   // 1. Get the contract to deploy
   const Box = await ethers.getContractFactory('Box');
   console.log('Deploying Box...');

   // 2. Instantiating a new Box smart contract
   const box = await Box.deploy();

   // 3. Waiting for the deployment to resolve
   await box.waitForDeployment();

   // 4. Use the contract instance to get the contract address
   console.log('Box deployed to:', box.target);
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
```

您现在可以使用`run`命令并指定`moonbase`作为网络来部署`Box.sol`合约：

```sh
npx hardhat run --network moonbase scripts/deploy.js
```

如果您正在使用另一个Moonbeam网络，请确保您已指定正确的网络。网络名称需要与`hardhat.config.js`中所定义的网络相匹配。

稍等片刻，合约将成功部署，您可以在终端看到合约地址。

![Hardhat Contract Deploy](/images/builders/build/eth-api/dev-env/hardhat/hardhat-3.png)

恭喜您，您的合约已完成！请保存地址，用于后续与合约实例的交互。

## 与合约交互 {: #interacting-with-the-contract }

要在Moonbase Alpha上与您刚部署的合约交互，您可以通过运行以下命令启动Hardhat `console`：

```sh
npx hardhat console --network moonbase
```

接下来，您可以执行以下步骤（一次输入一行）：

1. 创建一个`Box.sol`合约的本地实例

    ```js
    const Box = await ethers.getContractFactory('Box');
    ```

2. 使用合约地址，将本地实例连接至已部署的合约

    ```js
    const box = await Box.attach('0x425668350bD782D80D457d5F9bc7782A24B8c2ef');
    ```

3. 与此合约交互。在本示例中，您可以调用`store`方法并存储一个简单的值

    ```js
    await box.store(5)
    ```

交易将通过您的Moonbase账户进行签署并传送至网络。后台输出将如下所示：

![Transaction output](/images/builders/build/eth-api/dev-env/hardhat/hardhat-4.png)

请注意您的地址将被标记为`from`，即合约地址，以及正在传送的`data`。现在，您可以通过运行以下命令来检索数值：

```js
await box.retrieve();
```

您将看到`5`或者您初始存储的数值。

恭喜您，您已经成功使用Hardhat部署合约并与之交互。

## 使用Hardhat进行分叉 {: #hardhat-forking }

您可以使用Hardhat[分叉（fork）](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks){target=_blank} 包括Moonbeam在内的任何EVM兼容链。分叉是在本地模拟实时Moonbeam网络，使您可以在本地测试环境中与已部署在Moonbeam上的合约交互。因为Hardhat的分叉是基于EVM实现，您可以通过[Moonbeam](/builders/get-started/eth-compare/rpc-support/){target=_blank}和[Hardhat](https://hardhat.org/hardhat-network/docs/reference#json-rpc-methods-support){target=_blank}支持的标准以太坊JSON RPC方法与分叉网络交互。

您需要了解一些使用Hardhat进行分叉的注意事项。您无法与任何Moonbeam预编译合约及其函数交互。预编译是Substrate实现的一部分，因此无法在模拟的EVM环境中复制。这将阻止您与Moonbeam上的跨链资产和基于Substrate的功能（例如质押和治理）进行交互。

当前分叉Moonbeam存在一个问题，为了解决此问题，您需要先手动修补Hardhat。您可以通过[GitHub上的问题](https://github.com/NomicFoundation/hardhat/issues/2395#issuecomment-1043838164){target=_blank}和相关[PR](https://github.com/NomicFoundation/hardhat/pull/2313){target=_blank}获取更多信息。

### 修补Hardhat {: #patching-hardhat }

在开始之前，您需要应用一个临时补丁来解决RPC错误，直到Hardhat修复了根本问题。错误如下所示：

```sh
Error HH604: Error running JSON-RPC server: Invalid JSON-RPC response's result.

Errors: Invalid value null supplied to : RpcBlockWithTransactions | null/transactions: RpcTransaction Array/0: RpcTransaction/accessList: Array<{ address: DATA, storageKeys: Array<DATA> | null }> | undefined, Invalid value null supplied to : RpcBlockWithTransactions | null/transactions: RpcTransaction Array/1: RpcTransaction/accessList: Array<{ address: DATA, storageKeys: Array<DATA> | null }> | undefined, Invalid value null supplied to : RpcBlockWithTransactions | null/transactions: RpcTransaction Array/2: RpcTransaction/accessList: Array<{ address: DATA, storageKeys: Array<DATA> | null }> | undefined
```

要修补Hardhat，您需要打开您项目中的`node_modules/hardhat/internal/hardhat-network/jsonrpc/client.js`文件。接下来，添加`addAccessList`函数并更新`_perform`和`_performBatch`函数。

现在，您可以移除预先存在的`_perform`和`_performBatch`函数，并在其中添加以下代码片段：

```js
  addAccessList(method, rawResult) {
    if (
      method.startsWith('eth_getBlock') &&
      rawResult &&
      rawResult.transactions?.length
    ) {
      rawResult.transactions.forEach((t) => {
        if (t.accessList == null) t.accessList = [];
      });
    }
  }
  async _perform(method, params, tType, getMaxAffectedBlockNumber) {
    const cacheKey = this._getCacheKey(method, params);
    const cachedResult = this._getFromCache(cacheKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    if (this._forkCachePath !== undefined) {
      const diskCachedResult = await this._getFromDiskCache(
        this._forkCachePath,
        cacheKey,
        tType
      );
      if (diskCachedResult !== undefined) {
        this._storeInCache(cacheKey, diskCachedResult);
        return diskCachedResult;
      }
    }
    const rawResult = await this._send(method, params);
    this.addAccessList(method, rawResult);
    const decodedResult = (0, decodeJsonRpcResponse_1.decodeJsonRpcResponse)(
      rawResult,
      tType
    );
    const blockNumber = getMaxAffectedBlockNumber(decodedResult);
    if (this._canBeCached(blockNumber)) {
      this._storeInCache(cacheKey, decodedResult);
      if (this._forkCachePath !== undefined) {
        await this._storeInDiskCache(this._forkCachePath, cacheKey, rawResult);
      }
    }
    return decodedResult;
  }
  async _performBatch(batch, getMaxAffectedBlockNumber) {
    // Perform Batch caches the entire batch at once.
    // It could implement something more clever, like caching per request
    // but it's only used in one place, and those other requests aren't
    // used anywhere else.
    const cacheKey = this._getBatchCacheKey(batch);
    const cachedResult = this._getFromCache(cacheKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    if (this._forkCachePath !== undefined) {
      const diskCachedResult = await this._getBatchFromDiskCache(
        this._forkCachePath,
        cacheKey,
        batch.map((b) => b.tType)
      );
      if (diskCachedResult !== undefined) {
        this._storeInCache(cacheKey, diskCachedResult);
        return diskCachedResult;
      }
    }
    const rawResults = await this._sendBatch(batch);
    const decodedResults = rawResults.map((result, i) => {
      this.addAccessList(batch[i].method, result);
      return (0, decodeJsonRpcResponse_1.decodeJsonRpcResponse)(
        result,
        batch[i].tType
      );
    });
    const blockNumber = getMaxAffectedBlockNumber(decodedResults);
    if (this._canBeCached(blockNumber)) {
      this._storeInCache(cacheKey, decodedResults);
      if (this._forkCachePath !== undefined) {
        await this._storeInDiskCache(this._forkCachePath, cacheKey, rawResults);
      }
    }
    return decodedResults;
  }
```

然后，您可以通过运行以下命令使用[patch-package](https://www.npmjs.com/package/patch-package){target=_blank}自动应用代码包：

```sh
npx patch-package hardhat
```

随即会创建一个`patches`目录，现在您可以分叉Moonbeam且在运行时不会遇到任何错误了。

### 分叉Moonbeam {: #forking-moonbeam }

您可以从命令行分叉Moonbeam或配置您的Hardhat项目以始终从您的`hardhat.config.js`文件运行此分叉。要分叉Moonbeam或Moonriver，需要用到您自己的端点和API密钥，您可以从[端点提供商](/builders/get-started/endpoints/){target=_blank}所支持的列表中获取。

要从命令行分叉Moonbeam，您可以从您的Hardhat项目目录中运行以下命令：

=== "Moonbeam"

    ```sh
    npx hardhat node --fork {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"

    ```sh
    npx hardhat node --fork {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"

    ```sh
    npx hardhat node --fork {{ networks.moonbase.rpc_url }}
    ```

如果您想要配置您的Hardhat项目，您可以使用以下配置更新您的`hardhat.config.js`文件：

=== "Moonbeam"

    ```js
    ...
    networks: {
        hardhat: {
            forking: {
            url: "{{ networks.moonbeam.rpc_url }}",
            }
        }
    }
    ...
    ```

=== "Moonriver"

    ```js
    ...
    networks: {
        hardhat: {
            forking: {
            url: "{{ networks.moonriver.rpc_url }}",
            }
        }
    }
    ...
    ```

=== "Moonbase Alpha"

    ```js
    ...
    networks: {
        hardhat: {
            forking: {
            url: "{{ networks.moonbase.rpc_url }}",
            }
        }
    }
    ...
    ```

当您启动Hardhat分叉时，您会有20个预先注资10,000个测试Token的开发账户。分叉好的实例位于`http://127.0.0.1:8545/`。在您的终端中，将会显示类似以下输出：

![Forking terminal screen](/images/builders/build/eth-api/dev-env/hardhat/hardhat-5.png)

要验证您是否已经分叉好网络，您可以查询最新区块号：

```sh
curl --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545 
```

如果您已经将`result`[从16进制转换成十进制](https://www.rapidtables.com/convert/number/hex-to-decimal.html){target=_blank}，您应该在分叉网络时获得了最新区块号。您可以[使用区块浏览器](/builders/get-started/explorers){target=_blank}交叉查询区块号。

在这里，您可以部署新的合约到您的Moonbeam分叉实例，或者通过创建已部署合约的本地实例与已部署合约交互。

要与已部署合约交互，您可以使用`ethers`在`scripts`目录中创建新的脚本。因为您将使用Hardhat运行此脚本，因此您无需导入任何库。在脚本中，您可以使用以下代码片段访问网络上的实时合约。

```js
const hre = require('hardhat');

async function main() {
  const provider = new ethers.providers.StaticJsonRpcProvider(
    'http://127.0.0.1:8545/'
  );

  const contract = new ethers.Contract(
    'INSERT_CONTRACT_ADDRESS',
    'INSERT_CONTRACT_ABI',
    provider
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

--8<-- 'text/_disclaimers/third-party-content.md'
