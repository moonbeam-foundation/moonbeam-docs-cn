---
title: 用Hardhat部署智能合约
description: 了解如何使用Hardhat在Moonbeam上编译、部署和调试以太坊智能合约。
---

# 使用Hardhat部署至Moonbeam

## 概览 {: #introduction }

[Hardhat](https://hardhat.org/){target=_blank}是一个灵活可拓展的以太坊开发环境，它能帮助开发者简化智能合约开发过程。 由于Moonbeam与以太坊兼容，您可以在Moonbeam上使用Hardhat开发和部署智能合约。

Hardhat采用基于任务的开发方式，开发者可以定义和执行[任务](https://hardhat.org/hardhat-runner/docs/advanced/create-task#creating-a-task){target=_blank}以执行特定操作。这些操作包括编译和部署合约、运行测试等等。这些任务的可配置性很高，您可以创建、自定义和执行不同任务来满足您的需求。

您还可以通过使用[插件](https://hardhat.org/hardhat-runner/plugins){target=_blank}来扩展Hardhat的功能。插件是外部扩展应用，它们可与Hardhat集成以提供额外的功能与工具来简化工作流程。有些插件包括了常见的以太坊库，例如[Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}，[viem](/builders/build/eth-api/libraries/viem){target=_blank}和为Chai Assertion库添加以太坊功能的插件等等。 所有这些插件都可用于在Moonbeam上扩展您的Hardhat项目。

本指南将简要介绍Hardhat，并向您展示如何使用Hardhat在Moonbase Alpha测试网上编译、部署和调试以太坊智能合约。本指南还适用于Moonbeam、Moonriver或 Moonbeam开发节点。

请注意，尽管Hardhat带有一个[Hardhat Network](https://hardhat.org/docs#hardhat-network){target=_blank}组件，它能提供一个本地开发环境，但您应该使用[本地Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev){target=_blank}来代替。您可以像连接任何其他网络一样将 Moonbeam开发节点与Hardhat相连。

## 查看先决条件 {: #checking-prerequisites }

在开始之前，您将需要准备以下内容：

- 安装[MetaMask](/tokens/connect/metamask#install-the-metamask-extension){target=_blank}并[将其连接至Moonbase Alpha](/tokens/connect/metamask#connect-metamask-to-moonbeam){target=_blank}
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

4. 创建Hardhat项目

    ```sh
    npx hardhat init
    ```

    !!! 注意事项
        `npx`用于运行安装在项目中的本地可执行文件。虽然Hardhat可以全网安装，但是我们建议在每个项目中进行本地安装，这样您可以按项目控制项目版本。

5. 系统将会显示菜单，允许您创建新的项目或使用范本项目。在本示例中，您可以选择**Create an empty hardhat.config.js**，这会为您的项目创建一个Hardhat配置文件。

![Hardhat Create Project](/images/builders/build/eth-api/dev-env/hardhat/hardhat-1.png)

## Hardhat配置文件 {: #hardhat-configuration-file }

设置Hardhat配置文件是您Hardhat项目的开始。它定义了您Hardhat项目的不同设定以及可选项。比如使用的Solidity编译器版本以及您将部署智能合约的目标网络。

第一步，您的 `hardhat.config.js` 应包含以下内容：

```js
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.20',
};
```

在这个例子中，您会使用 `0.8.20` 版本的Solidity编译器版本；但是如果您的其他智能合约需要更新的版本，请记得在这里更改版本号。

下一步，您需要修改您的配置文件，在其中依据您部署智能合约的目标网络来添加网络配置。部署在Moonbeam网络需要配置以下这些选项：

- `url` - 节点的[RPC 端口](/builders/get-started/endpoints){target=_blank}
- `chainId` - 链ID，来验证网络是否正确
- `accounts` - 用来部署智能合约及与其交互的账号。您可以填入一组账户私钥的array，或使用[HD钱包](https://github.com/ethereumbook/ethereumbook/blob/develop/05wallets.asciidoc#hierarchical-deterministic-wallets-bip-32bip-44){target=_blank}

这个例子中的网络为Moonbase Alpha，您也可以修改这个配置以适配其他Moonbeam网络：

=== "Moonbeam"

    ```js
    module.exports = {
      solidity: '0.8.20',
      networks: {
        moonbeam: {
          url: '{{ networks.moonbeam.rpc_url }}', // 输入您的RPC URL
          chainId: {{ networks.moonbeam.chain_id }}, // (hex: {{ networks.moonbeam.hex_chain_id }}),
          accounts: ['INSERT_PRIVATE_KEY'],
        },
      },
    };
    ```

=== "Moonriver"

    ```js
    module.exports = {
      solidity: '0.8.20',
      networks: {
        moonriver: {
          url: '{{ networks.moonriver.rpc_url }}', // 输入您的RPC URL
          chainId: {{ networks.moonriver.chain_id }}, // (hex: {{ networks.moonriver.hex_chain_id }}),
          accounts: ['INSERT_PRIVATE_KEY'],
        },
      },
    };
    ```

=== "Moonbase Alpha"

    ```js
    module.exports = {
      solidity: '0.8.20',
      networks: {
        moonbase: {
          url: '{{ networks.moonbase.rpc_url }}', // 输入您的RPC URL
          chainId: {{ networks.moonbase.chain_id }}, // (hex: {{ networks.moonbase.hex_chain_id }}),
          accounts: ['INSERT_PRIVATE_KEY'],
        },
      },
    };
    ```

=== "Moonbeam 开发者节点"

    ```js
    module.exports = {
      solidity: '0.8.20',
      networks: {
        dev: {
          url: '{{ networks.development.rpc_url }}', // Insert your RPC URL here
          chainId: {{ networks.development.chain_id }}, // (hex: {{ networks.development.hex_chain_id }}),
          accounts: ['INSERT_PRIVATE_KEY'],
        },
      },
    };
    ```

!!! 请记住
    以上代码只是示例，请千万不要在您的Javascript文件中储存私钥

如果您想要在项目中使用插件，您需要安装插件并将通过`hardhat.config.js`文件将其导入。当一个插件导入后，它会成为[Hardhat Runtime Environment](https://hardhat.org/hardhat-runner/docs/advanced/hardhat-runtime-environment){target=_blank}的一部分，您可以在任务，脚本或别的地方使用该插件。

在这个范例中，您可以安装 `hardhat-ethers` 插件并且将其导入配置文件，这个插件为[Ethers.js](/builders/build/eth-api/libraries/ethersjs/){target=_blank}代码库提供了一个方便的封装，用于网络交互。

```bash
npm install @nomicfoundation/hardhat-ethers ethers@6
```

导入这个插件您需要在配置文件的开始添加以下`require`语句：

```js hl_lines="2"
/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-ethers');

const privateKey = 'INSERT_PRIVATE_KEY';

module.exports = {
  solidity: '0.8.20',
  networks: {
     moonbase: {
      url: 'https://rpc.api.moonbase.moonbeam.network',
      chainId: 1287, // 0x507 in hex,
      accounts: [privateKey]
    }
  }
};
```

关于其他配置选项的信息，请阅读Hardhat文档中的[Configuration](https://hardhat.org/hardhat-runner/docs/config#networks-configuration){target=_blank}部分。

## 合约文件 {: #the-contract-file }

现在您已经完成项目的配置，可以开始创建您的智能合约了。接下来要部署的合约并不复杂，它被命名为`Box`，它能储存一个数值并且读取这个数值。

使用以下步骤添加合约：


1. 创建`contracts`目录

    ```sh
    mkdir contracts
    ```

2. 创建`Box.sol`文件

    ```sh
    touch contracts/Box.sol
    ```

3. 打开文件，并为其添加以下合约内容：

    ```solidity
    // contracts/Box.sol
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.1;
    contract Box {
        uint256 private value;

        // 在数值变化时被调用
        event ValueChanged(uint256 newValue);
        // 在合约中储存新数值
        function store(uint256 newValue) public {
            value = newValue;
            emit ValueChanged(newValue);
        }
        // 读取最后储存的数值
        function retrieve() public view returns (uint256) {
            return value;
        }
    }
    ```

## 编译Solidity {: #compiling-solidity }

下一步是编译`Box.sol`智能合约，您可以使用内置的`compile`任务。这个任务会在`contracts`目录中寻找Solidity文件并且根据`hardhat.config.js`中定义的版本与设置来编译这些文件。

您可以简单运行以下命令编译合约：

```sh
npx hardhat compile
```

![Hardhat Contract Compile](/images/builders/build/eth-api/dev-env/hardhat/hardhat-2.png)

编译后，将会创建一个`artifacts`目录：这保存了合约的字节码和元数据，为`.json`文件。您可以将此目录添加至您的`.gitignore`。

如果您在编译后修改了合约内容，您可以用以上命令再次编译合约。Hardhat会自动识别更改内容并且重编译合约。如果没有更新内容，那将不会进行编译。如果有需求，您可以使用`clean`任务来强制重新编译，缓存文件会被清理且旧的artifect文件会被删除。

## 部署合约 {: #deploying-the-contract }

您需要创建一个使用[Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}的脚本来进行合约部署，并且您需要用`run`任务来执行这个脚本。

您可以为脚本添加一个新的目录，将其命名为`scripts`，在其中添加一个新文件`deploy.js`：

```sh
mkdir scripts && touch scripts/deploy.js
```

下一步您需要编写您的部署脚本文件。您不需要在脚本中直接导入任何库，因为您将使用Hardhat执行脚本，并且已经在`hardhat.config.js`文件导入了Ethers插件。但如果您想使用`node`运行脚本，您就需要在脚本中导入Ethers。

要开始操作，您可以执行以下步骤：

1. 通过`getContractFactory`方法为合约创建一个本地实例
2. 使用此实例中存在的`deploy`方法来实例化智能合约
3. 使用`waitForDeployment`等待部署
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

使用以下命令来运行脚本，部署`Box.sol`合约；您需要给这个命令定义一个部署合约的网络名称，这个名称已在`hardhat.config.js`中定义。

```sh
npx hardhat run --network moonbase scripts/deploy.js
```

!!! 注意
  如果您正在使用另一个Moonbeam网络，请确保您已指定正确的网络。网络名称需要与`hardhat.config.js`中所定义的网络相匹配。

稍等片刻，合约将成功部署，您可以在终端看到合约地址。

![Hardhat Contract Deploy](/images/builders/build/eth-api/dev-env/hardhat/hardhat-3.png)

恭喜您，您的合约已完成！请保存地址，用于后续与合约实例的交互。

## 与合约交互 {: #interacting-with-the-contract }

使用Hardhat与新合约交互的方式有几种：您可以使用`console`任务来启用一个可交互的JavaScript控制台；或者您也可以创建一个脚本并用`run`任务来执行它。

### 使用Hardhat控制台 {: #hardhat-console }

[Hardhat控制台](https://hardhat.org/hardhat-runner/docs/guides/hardhat-console){target=_blank}与任务和脚本使用同样的执行环境，因此它也能自动使用`hardhat.config.js`中定义的参数与插件。

执行以下命令开启Hardhat `console`：

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
    const box = await Box.attach('0xfBD78CE8C9E1169851119754C4Ea2f70AB159289');
    ```

3. 与此合约交互。在本示例中，您可以调用`store`方法并存储一个简单的值

    ```js
    await box.store(5);
    ```

交易将通过您在`hardhat.config.js`中定义的账户进行签署并传送至网络。后台输出将如下所示：

![Transaction output](/images/builders/build/eth-api/dev-env/hardhat/hardhat-4.png)

请注意您的地址将被标记为`from`，即合约地址，以及正在传送的`data`。现在，您可以通过运行以下命令来检索数值：

```js
await box.retrieve();
```

您将看到`5`或者您初始存储的数值。

### 使用脚本 {: #using-a-script }

与部署脚本相同，您也可以创建一个脚本来与合约交互。您可以将脚本存入`scripts`目录，并使用内置的`run`来运行它。

首先，在`scripts`目录下创建一个`set-value.js`文件：

```sh
touch scripts/set-value.js
```

然后将以下代码复制到`set-value.js`文件中：

```js
// scripts/set-value.js
async function main() {
  // Create instance of the Box contract
  const Box = await ethers.getContractFactory('Box');
  // Connect the instance to the deployed contract
  const box = await Box.attach('0xfBD78CE8C9E1169851119754C4Ea2f70AB159289');
  // Store a new value
  await box.store(2);
  // Retrieve the value
  const value = await box.retrieve();
  console.log(`The new value is: ${value}`);
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

运行以下命令来执行脚本：

```sh
npx hardhat run --network moonbase scripts/set-value.js
```

这个脚本应当返回`2`这个数值。

![The terminal output from executing the set-value.js script.](/images/builders/build/eth-api/dev-env/hardhat/hardhat-5-new.png)

## 使用Hardhat进行分叉 {: #hardhat-forking }

您可以使用Hardhat[分叉（fork）](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks){target=_blank} 包括Moonbeam在内的任何EVM兼容链。分叉是在本地模拟实时Moonbeam网络，使您可以在本地测试环境中与已部署在Moonbeam上的合约交互。因为Hardhat的分叉是基于EVM实现，您可以通过[Moonbeam](/builders/get-started/eth-compare/rpc-support/){target=_blank}和[Hardhat](https://hardhat.org/hardhat-network/docs/reference#json-rpc-methods-support){target=_blank}支持的标准以太坊JSON-RPC方法与分叉网络交互。

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
          url: '{{ networks.moonbeam.rpc_url }}',
        },
      },
    },
    ...
    ```

=== "Moonriver"

    ```js
    ...
    networks: {
      hardhat: {
        forking: {
          url: '{{ networks.moonriver.rpc_url }}',
        },
      },
    },
    ...
    ```

=== "Moonbase Alpha"

    ```js
    ...
    networks: {
      hardhat: {
        forking: {
          url: '{{ networks.moonbase.rpc_url }}',
        },
      },
    },
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
  const provider = new ethers.JsonRpcProvider(
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
