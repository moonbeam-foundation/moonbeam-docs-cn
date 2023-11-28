---
title: 运行Moonbeam开发节点
description: 遵循本教程学习如何启动您的首个Moonbeam开发节点，以及如何配置以用于开发目的并连接它。
---

# 设置Moonbeam开发节点

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/-bRooBW2g0o' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## 概览 {: #introduction }

Moonbeam开发节点是您自己的个人开发环境，用于在Moonbeam上构建和测试应用程序。对于以太坊开发者来说，它相当于Hardhat Network或Ganache。它助您快速轻松上手，而无需承担中继链的开销。您可以使用`--sealing`选项启动您的节点，以在收到交易后立即、手动或以自定义间隔创建区块。默认情况下，当收到交易时将创建一个区块，这类似于Hardhat Network的默认行为和Ganache的instamine（即时）功能。

如果您完整地遵循本教程操作，您将拥有一个在本地环境中运行的Moonbeam开发节点，其中包含10个[预注资的账户](#pre-funded-development-accounts)。

!!! 注意事项
    本教程使用[Moonbase Alpha](https://github.com/moonbeam-foundation/moonbeam/releases/tag/{{ networks.development.build_tag }}){target=_blank}的{{ networks.development.build_tag }}标签创建。为实现与以太坊的全面兼容，基于Substrate的Moonbeam平台和[Frontier](https://github.com/paritytech/frontier){target=_blank}组件正处于积极开发阶段。
    --8<-- 'text/_common/assumes-mac-or-ubuntu-env.md'

## 启动Moonbeam开发节点 {: #spin-up-a-node }

目前有两种方式运行Moonbeam节点：使用[Docker来执行预构建的二进制文件](#getting-started-with-docker)，或[在本地编译二进制文件](#getting-started-with-the-binary-file)然后自行设置开发节点。使用Docker更为快速便捷，您无需安装Substrate和所有依赖项，并且可以跳过构建节点的过程。但您必须[安装Docker](https://docs.docker.com/get-docker/){target=_blank}。另一方面，如果您决定要完成构建自己的开发节点的过程，则需要大约30分钟或更长时间才能完成，具体情况取决于您的硬件设备。

## 使用Docker启动节点 {: #getting-started-with-docker }

使用Docker可让您在几秒钟内启动节点。安装Docker后，您可以执行以下步骤来启动您的节点：

1. 执行以下命令下载最新Moonbeam镜像：

    ```bash
    docker pull purestake/moonbeam:{{ networks.development.build_tag }}
    ```

    控制台日志的结尾应如下所示：

    ![Docker - imaged pulled](/images/builders/get-started/networks/moonbeam-dev/moonbeam-dev-1.png)

2. 通过运行以下Docker命令启动Moonbeam开发节点，该命令将以即时封装模式启动节点以进行本地测试，以便在收到交易时立即创建区块：

    === "Ubuntu"

        ```bash
        docker run --rm --name {{ networks.development.container_name }} --network host \
        purestake/moonbeam:{{ networks.development.build_tag }} \
        --dev --rpc-external
        ```

    === "MacOS"

        ```bash
        docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 \
        purestake/moonbeam:{{ networks.development.build_tag }} \
        --dev --rpc-external
        ```

    === "Windows"

        ```bash
        docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 ^
        purestake/moonbeam:{{ networks.development.build_tag }} ^
        --dev --rpc-external
        ```

!!! 注意事项
    如果您的电脑使用的是Apple芯片, Docker可能无法完美运行您使用的镜像文件. 为了提升性能, 请尝试 [使用二进制文件启动节点](#getting-started-with-the-binary-file).

如果节点已经启动，您将看到显示区块待创建的空闲状态界面：

![Docker - output shows blocks being produced](/images/builders/get-started/networks/moonbeam-dev/moonbeam-dev-2.png)

您可点击常用[标志](#node-flags)及[选项](#node-options)来查阅更多用于示例的标志及选项。如果要查看所有标志、选项和子命令的完整列表，请通过运行以下命令打开帮助菜单：

```bash
docker run --rm --name {{ networks.development.container_name }} \
purestake/moonbeam \
--help
```

如果您已经使用Docker来启动节点，则可以跳过下一部分的教程，直接进入[配置Moonbeam开发节点](#configure-moonbeam-dev-node)部分。

## 使用二进制文件启动节点 {: #getting-started-with-the-binary-file }

!!! 注意事项
    如果您了解目前所在执行的操作，您可以直接在[Moonbeam版本发布页面](https://github.com/moonbeam-foundation/moonbeam/releases){target=_blank}上下载每个版本附带的预编译二进制文件。但这并不适用于所有系统，例如：二进制文件仅适用于具有特定依赖项版本的x86-64 Linux。确保兼容性的最安全方法是在运行二进制文件的系统中编译二进制文件。

要构建二进制文件，您可以执行以下步骤：

1. 克隆Moonbeam代码库的特定标签，你可以在[Moonbeam GitHub代码库](https://github.com/moonbeam-foundation/moonbeam/){target=_blank}上找到它：

    ```bash
    git clone -b {{ networks.development.build_tag }} https://github.com/moonbeam-foundation/moonbeam
    cd moonbeam
    ```

2. 如果您已安装Rust，您可跳过以下两个步骤。如果您未安装Rust，请执行以下命令[通过Rust推荐方式](https://www.rust-lang.org/tools/install){target=_blank}安装Rust和其先决条件：

!!! 注意事项
    安装路径包含空格会造成编译错误

    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/installrust.md'
    ```

3. 运行以下命令更新您的PATH环境变量：

    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/updatepath.md'
    ```

4. 运行以下命令构建开发节点：

    !!! 注意事项
        如果您使用的是Ubuntu 20.04或22.04，那么您需要在构建二进制文件之前安装这些额外的依赖项：

        ```bash
        apt install clang protobuf-compiler libprotobuf-dev -y 
        ```

        MacOS用户请使用Homebrew来安装依赖项:
        
        ```bash
        brew install llvm
        brew install protobuf
        ```
    
    
    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/build.md'
    ```

    构建输出的末尾应如下所示：

    ![End of build output](/images/builders/get-started/networks/moonbeam-dev/moonbeam-dev-3.png)

!!! 注意事项
    初始构建将会需要一些时间。取决于您的硬件设备，构建过程大约需要30分钟。

然后，您可以通过以下命令运行开发节点：

```bash
--8<-- 'code/builders/get-started/networks/moonbeam-dev/runnode.md'
```

!!! 注意事项
    对于不熟悉Substrate的人来说，`--dev`标志是一种在单节点开发者配置中运行基于Substrate的节点以用于测试目的的方法。当您使用`--dev`标志运行您的节点时，您的节点将以全新状态启动，并且不会持久保存其状态。

您将看到显示区块待创建的空闲状态界面：

![Output shows blocks being produced](/images/builders/get-started/networks/moonbeam-dev/moonbeam-dev-4.png)

您可点击常用[标志](#node-flags)及[选项](#node-options)来查阅更多用于示例的标志及选项。如果要查看所有标志、选项和子命令的完整列表，请通过运行以下命令打开帮助菜单：

```bash
./target/release/moonbeam --help
```

## 配置Moonbeam开发节点 {: #configure-moonbeam-dev-node }

现在您已知道如何启动和运行标准的Moonbeam开发节点，您可能还想知道如何配置它。以下部分将介绍一些在启动节点时可以使用的常见配置。

### 配置节点的常用标志 {: #node-flags }

标志不带参数。要使用标志，请将其添加到命令末尾。例如：

```bash
--8<-- 'code/builders/get-started/networks/moonbeam-dev/runnode.md'
```

- **`--dev`** - 指定开发链
- **`--tmp`** - 运行一个临时节点，该节点将在流程结束时删除所有配置
- **`--rpc-external`** - 监听所有RPC与Websocket接口

### 配置节点的常用选项 {: #node-options }

选项接受一个选项右侧的参数。例如：

```bash
--8<-- 'code/builders/get-started/networks/moonbeam-dev/runnodewithsealinginterval.md'
```

- **`-l <log pattern>` or `--log <log pattern>`** - 设置自定义日志记录筛选器。日志模式的语法为`<target>=<level>`。例如，要打印所有JSON RPC日志，命令应如下所示：`-l json=trace`
- **`--sealing <interval>`** - 什么时候区块需要被封装在开发服务中。可接受的时间间隔参数为：`instant`、`manual`、或一个代表计时器间隔（以毫秒为单位）的数字（例如，`6000`是指节点每6秒产生一次区块）。默认设置是`instant`。请参阅下面的[配置区块生产](#configure-block-production)部分以获取更多信息
- **`--rpc-port <port>`** - 用来配置HTTP与WS连接的统一端口。接收一个port作为参数，默认为{{ networks.parachain.rpc }}
- **`--ws-port <port>`** - *从[v0.33.0客户端版本](https://github.com/moonbeam-foundation/moonbeam/releases/tag/v0.33.0){target=_blank}开始已弃用，HTTP与WS连接改为统一使用`--rpc-port`来配置* 设置WebSockets RPC服务器的TCP端口。从[v0.30.0客户端版本](https://github.com/moonbeam-foundation/moonbeam/releases/tag/v0.30.0){target=_blank}开始使用，用来设置HTTP与WS连接的统一端口. 接收一个port作为参数
- **`--rpc-max-connections <connections>`** - 配置HTTP与WS连接的上限总和. 默认连接数为100
- **`--ws-max-connections <connections>`** - * *从[v0.33.0客户端版本](https://github.com/moonbeam-foundation/moonbeam/releases/tag/v0.33.0){target=_blank}开始已弃用, 改为使用`--rpc-max-connections`参数来限制 HTTP与WS连接数量上线* - 配置HTTP与WS连接的上限总和. 默认连接数为100
- **`--rpc-cors <origins>`** - 指定允许浏览器源头访问HTTP和WS RPC服务器。该源头可以是允许访问的以逗号分隔的来源列表，或者您也可以指定`null`。当运行一个开发节点时，预设为允许所有源头

如需命令行标志和选项的完整列表，请在命令末尾添加`--help`来启动Moonbeam开发节点。

### 配置区块生产 {: #configure-block-production }

默认情况下，您的Moonbeam开发节点以即时封装模式启动，该模式会在收到交易时立即创建区块。但是，您可以使用`--sealing`选项指定何时制造或封装区块。

`--sealing`标志接受以下任何参数：

- `instant` - 正如我们已经介绍过的，这是默认选项，一旦收到交易就会创建区块
- `manual` - 允许您手动生成区块。如果收到交易，在您手动创建一个之前不会产生区块
- 以毫秒为单位的间隔 - 在特定时间间隔创建一个区块。例如，如果将其设置为`6000`，您将让节点每6秒产生一个区块

该标志应按以下格式附加到启动命令中：

```bash
--sealing <interval>
```

如果选择`manual`，您需要自己手动使用`engine_createBlock` JSON RPC方法来创建区块：

```bash
engine_createBlock(createEmpty: *bool*, finalize: *bool*, parentHash?: *BlockHash*)
```

例如，您可以使用以下代码片段使用[Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}（一个可以轻松地与JSON RPC方法进行交互的以太坊库）手动创建区块：

```js
import { ethers } from 'ethers';

const produceBlock = async () => {
  // Connect to the Ethereum node (if applicable, replace the URL with your node's address)
  const provider = new ethers.JsonRpcProvider(
    '{{ networks.development.rpc_url }}'
  );

  // Set the custom JSON-RPC method and parameters
  const method = 'engine_createBlock';
  const params = [true, true, null];

  try {
    // Send the custom JSON-RPC call
    const result = await provider.send(method, params);
  } catch (error) {
    // Handle any errors that may occur
    console.error('Error:', error.message);
  }
};

produceBlock();
```

!!! 注意事项
    如果您不熟悉Ethers，请参阅[Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}文档页面以了解更多信息。

## 预注资的开发账户 {: #pre-funded-development-accounts }

Moonbeam拥有[统一账户](/learn/features/unified-accounts){target=_blank}系统，使用户能够拥有可以与Substrate API和以太坊API交互的以太坊格式H160账户。因此，您可以通过[Polkadot.js Apps](#connecting-polkadot-js-apps-to-a-local-moonbeam-node)或[MetaMask](/tokens/connect/metamask){target=_blank}（或者任何其他[EVM钱包](/tokens/connect/){target=_blank}）与您的账户交互。此外，您还可以使用其他[开发工具](/builders/build/eth-api/dev-env/){target=_blank}，例如[Remix](/builders/build/eth-api/dev-env/remix/){target=_blank}和[Hardhat](/builders/build/eth-api/dev-env/hardhat/){target=_blank}。

您的Moonbeam开发节点带有十个预注资的以太坊风格的开发帐户。这些地址源自于Substrate的规范开发助记词：

```text
bottom drive obey lake curtain smoke basket hold race lonely fit walk
```

??? note "开发账户地址和私钥"
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/dev-accounts.md'

另外，开发节点中还包括一个用于测试目的的额外预注资帐户：

--8<-- 'code/builders/get-started/networks/moonbeam-dev/dev-testing-account.md'

你可以将这些帐户中的任何一个通过使用他们的私钥连接到[MetaMask](/tokens/connect/metamask/){target=_blank}、[Talisman](/tokens/connect/talisman/){target=_blank}、[Polkadot.js Apps](/tokens/connect/polkadotjs/){target=_blank}等。

## 开发节点端点 {: #access-your-development-node }

您可以使用以下RPC和WSS端点访问您的Moonbeam开发节点：

=== "HTTP"

    ```text
    {{ networks.development.rpc_url }}
    ```

=== "WSS"

    ```text
    {{ networks.development.wss_url }}
    ```

## 区块浏览器 {: #block-explorers }

您可以使用以下任一区块浏览器来浏览Moonbeam开发节点:

 - **Substrate API** — [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:9944#/explorer){target=_blank}在WS端口`{{ networks.parachain.ws }}`
 - **基于JSON-RPC的以太坊API** — [Moonbeam Basic浏览器](https://moonbeam-explorer.netlify.app/?network=MoonbeamDevNode){target=_blank}在HTTP端口`{{ networks.parachain.ws }}`

## 调试（Debug）、追踪（Trace）和TxPool API {: #debug-trace-txpool-apis }

您也可以通过运行追踪节点访问一些非标准的RPC方法，这将允许开发者在runtime期间检查和调试交易。追踪节点使用的是与标准Moonbeam开发节点不同的Docker镜像。

想要学习如何运行Moonbeam开发追踪节点，请查看[运行追踪节点](/node-operators/networks/tracing-node){target=_blank}的操作指南并确保在操作过程中已切换至**Moonbeam Development Node**标签。随后，通过您的追踪节点访问非标准的RPC方法，详情请查看[Debug & Trace](/builders/build/eth-api/debug-trace){target=_blank}操作指南。

### 清除开发节点 {: #purging-your-node }

如果您想删除与您节点关联的数据，您可以清除它。清除节点的说明因启动节点的方式而异。

### 清除由Docker启动的节点 {: #purge-docker-node }

如果您使用Docker和`-v`标志来启动您的节点，为您的Docker容器指定挂载目录，您将需要清除该目录。为此，请运行以下命令：

```bash
sudo rm -rf {{ networks.moonbase.node_directory }}/*
```

如果您按照本指南中的说明进行操作并且未使用`-v`标志，您可停止并删除Docker容器，关联的数据也将与其一起被删除。为此，请运行以下命令：

```bash
sudo docker stop `CONTAINER_ID` && docker rm `CONTAINER_ID`
```

### 清除由二进制文件启动的节点 {: #purge-binary-node }

通过二进制文件运行节点时，数据存储在本地目录中，该目录通常位于`~/.local/shared/moonbeam/chains/development/db`。如果要启动该节点的新实例，您可以删除该文件夹的内容，或者在`moonbeam`文件夹中运行以下命令：

```bash
./target/release/moonbeam purge-chain --dev -y
```

这将删除数据文件夹。请注意，所有链数据均已丢失。想要了解所有可用`purge-chain`命令，您可以查看我们文档的[清除二进制数据](/node-operators/networks/run-a-node/systemd/#purging-compiled-binary){target=_blank}部分。
