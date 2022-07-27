---
title: 运行Moonbeam开发节点
description: 通过此教程学习如何设置您的第一个Moonbeam开发节点，以及如何使用Polkadot.js GUI连接并操作此节点。
---

# 设置Moonbeam开发节点

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/-bRooBW2g0o' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## 概览 {: #introduction }

本教程将引导您如何创建一个Moonbeam开发节点，用于测试Moonbeam的以太坊兼容性功能。

!!! 注意事项
    本教程使用[Moonbase Alpha](https://github.com/PureStake/moonbeam/releases/tag/{{ networks.development.build_tag }})的{{ networks.development.build_tag }}标签创建。为实现与以太坊的全面兼容，基于Substrate的Moonbeam平台和[Frontier](https://github.com/paritytech/frontier)组件正处于积极开发阶段。

--8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

Moonbeam开发节点是基于您的个人开发环境，在Moonbeam上构建和测试应用程序，相当于以太坊开发人员使用的Ganache。Moonbeam助您快速轻松地上手，无需承担中继链的成本。您可以使用`--sealing`选项，立即启动节点来创建区块，或者在交易完成后的自定义时间段创建区块。默认情况下，收到交易意味着一个区块即被创建，类似于Ganache的instamine功能。

如果您遵循本教程操作，您可顺利在本地环境运行Moonbeam开发节点，同时获得10个[预注资的账户](#pre-funded-development-accounts)，并将其连接至默认的Polkadot.js GUI。

目前有两种方式运行Moonbeam节点：使用[Docker来执行预建二进制](#getting-started-with-docker)，或[在本地编译二进制](#getting-started-with-the-binary-file)设置开发节点。点击此处便可安装[Docker](https://docs.docker.com/get-docker/)。Docker更为快速便捷，您无需安装Substrate和所有依赖项，且无需构建节点即可运行。另一方面，如果您仍希望体验构建开发节点进程，则需要大约30分钟或更长时间完成，具体情况取决于您的硬件设备。

## 使用Docker进行安装与设置 {: #getting-started-with-docker }

使用Docker可让您在几秒钟内启动节点。安装Docker后，您可执行以下命令下载相关镜像：

```
docker pull purestake/moonbeam:{{ networks.development.build_tag }}
```

控制台日志的结尾应如下所示：

![Docker - imaged pulled](/images/builders/get-started/networks/moonbeam-dev/moonbeam-dev-1.png)

完成Docker镜像下载后，接下来是运行镜像。

您可以通过以下命令运行Docker镜像：

=== "Ubuntu"
    ```
    docker run --rm --name {{ networks.development.container_name }} --network host \
    purestake/moonbeam:{{ networks.development.build_tag }} \
    --dev
    ```

=== "MacOS"
    ```
    docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 -p 9933:9933 \
    purestake/moonbeam:{{ networks.development.build_tag }} \
    --dev --ws-external --rpc-external
    ```

=== "Windows"
    ```
    docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 -p 9933:9933 ^
    purestake/moonbeam:{{ networks.development.build_tag }} ^
    --dev --ws-external --rpc-external
    ```

该命令可通过即时密封模式启动Moonbeam开发节点以进行本地测试，因此收到交易时区块即被创建。如果节点已经启动，您将看到显示区块待创建的空闲状态界面：

![Docker - output shows blocks being produced](/images/builders/get-started/networks/moonbeam-dev/moonbeam-dev-2.png)

您可点击[常用标识及选项](#commands-flags-and-options)来查阅更多实例的标识及选项。如果要查看所有标识、选项和子命令的完整列表，请通过运行以下命令打开帮助菜单：

```
docker run --rm --name {{ networks.development.container_name }} \
purestake/moonbeam \
--help
```

如果您已经使用Docker来启动节点，则可以跳过下一部分的教程，直接进入[设置Moonbeam本地节点并连接至Polkadot.js GUI](#connecting-polkadot-js-apps-to-a-local-moonbeam-node)。

## 使用二进制文件进行安装与设置 {: #getting-started-with-the-binary-file }

!!! 注意事项
    如果您了解目前所在执行的操作，您可以直接在[Moonbeam版本发布页面](https://github.com/PureStake/moonbeam/releases)上下载每个版本附带的预编译二进制文件。但这并不适用于所有系统，例如：二进制文件仅适用于具有特定依赖项版本的x86-64 Linux。确保兼容性的最安全方法是在运行二进制文件的系统中编译二进制文件。

第一步，我们通过下列链接来克隆一个Moonbeam Repo的特定标签：

[https://github.com/PureStake/moonbeam/](https://github.com/PureStake/moonbeam/)

```
git clone -b {{ networks.development.build_tag }} https://github.com/PureStake/moonbeam
cd moonbeam
```

如果您已安装Rust，您可跳过以下两个步骤。如果您未安装Rust，请执行以下命令[通过Rust推荐方式](https://www.rust-lang.org/tools/install)安装Rust和其先决条件：

```
--8<-- 'code/setting-up-node/installrust.md'
```

接下来，运行以下命令更新您的PATH环境变量：

```
--8<-- 'code/setting-up-node/updatepath.md'
```

现在，运行以下命令构建开发节点：

```
--8<-- 'code/setting-up-node/build.md'
```

!!! 注意事项
    初始构建将会需要一些时间，取决于您的硬件设备，安装节点大约需要30分钟。

输出的末尾应如下所示：

![End of build output](/images/builders/get-started/networks/moonbeam-dev/moonbeam-dev-3.png)

然后，您可以通过以下命令运行开发节点：

```
--8<-- 'code/setting-up-node/runnode.md'
```

!!! 注意事项
    如果您是Substrate入门者 ，您可通过单节点的开发者配置，使用`--dev`标志运行基于Substrate的节点。点击[Substrate指南](https://substrate.dev/docs/en/tutorials/create-your-first-substrate-chain/interact)了解更多信息。

您将看到显示区块待创建的空闲状态界面：

![Output shows blocks being produced](/images/builders/get-started/networks/moonbeam-dev/moonbeam-dev-4.png)

您可点击[常用标识及选项](#commands-flags-and-options)来查阅更多用于实例的标识及选项。如果要查看所有标识、选项和子命令的完整列表，请通过运行以下命令打开帮助菜单：

```
./target/release/moonbeam --help
```
## 将Polkadot.js Apps连接至本地Moonbeam节点 {: #connecting-polkadot-js-apps-to-a-local-moonbeam-node }

开发节点是基于Substrate框架的节点，您可使用标准的Substrate工具来与之交互。两个可使用的RPC端点如下所示：

 - **HTTP** - `http://127.0.0.1:9933`
 - **WS** - `ws://127.0.0.1:9944` 

首先，我们将节点连接至Polkadot.js Apps。打开浏览器并输入链接：[https://polkadot.js.org/apps/#/explorer](https://polkadot.js.org/apps/#/explorer)。进入网站之后，Polkadot.js Apps将被启动，并自动连接至Polkadot主网。

![Polkadot.js Apps](/images/builders/get-started/networks/moonbeam-dev/moonbeam-dev-5.png)

然后，点击左上角打开目录进行网络配置，再点击Development子目录，选择“Local Node” 选项，点击该选项后Polkadot.js Apps将连接至`ws://127.0.0.1:9944`。点击上面的Switch选项，成功连接您的Moonbeam开发节点。

![Select Local Node](/images/builders/get-started/networks/moonbeam-dev/moonbeam-dev-6.png)

成功连接Polkadot.js Apps之后，您将看到Moonbeam开发节点生产区块的情况。

![Select Local Node](/images/builders/get-started/networks/moonbeam-dev/moonbeam-dev-7.png)

## 查询账户状态 {: #querying-account-state }

随着[Moonbase Alpha v3](https://www.purestake.com/news/moonbeam-network-upgrades-account-structure-to-match-ethereum/)的发布，Moonbeam可支持在统一账户模式下运行，该模式支持以太坊的H160账户格式并且已与Polkadot.js Apps兼容。如果您想查看账户上的余额，您可直接将您的账户导入至Accounts。更多详情请参考[统一账户](/learn/features/unified-accounts/)部分。

您也可以利用Moonbeam完整的以太坊RPC功能，使用[MetaMask](/tokens/connect/metamask/)查询账户的余额。除此之外，您还可以利用其他的开发工具，如[Remix](/builders/build/eth-api/dev-env/remix/)和[Truffle](/builders/build/eth-api/dev-env/truffle/)等。

## 常用命令、标识及选项 {: #common-commands-flags-and-options }

### 清除您的节点 {: #purging-your-node }

通过二进制文件运行节点时，数据存储在本地目录中，该目录通常位于`~/.local/shared/moonbeam/chains/development/db`。如果要启动该节点的新实例，您可以删除该文件夹的内容，或者在`moonbeam`文件夹中运行以下命令：

```
./target/release/moonbeam purge-chain --dev -y
```

这将删除数据文件夹，请注意，所有链数据均已丢失。想要了解所有可用`purge-chain`命令，您可以查看文档的[清除二进制数据](/node-operators/networks/run-a-node/systemd/#purging-compiled-binary)部分。

如果您使用Docker和`-v`标志来启动您的节点，为您的Docker容器指定挂载目录，您将需要清除该目录。为此，请运行以下命令：

```
sudo rm -rf {{ networks.moonbase.node_directory }}/*
```

如果您在操作中未使用`-v`标志，您可停止并清除Docker容器，同时关联的数据也将被清除。为此，请运行以下命令：

```
sudo docker stop `CONTAINER_ID` && docker rm `CONTAINER_ID`
```

### 节点标志 {: #node-flags }

标志不带参数。 要使用标志，请将其添加到命令末尾。例如：

```
--8<-- 'code/setting-up-node/runnode.md'
```

- **`--dev`**：指定开发链
- **`--no-telemetry`**：禁用连接到Substrate telemetry服务器。对于全局链，默认情况下telemetry处于启用状态。如果您正在运行开发（`--dev`）节点，则telemetry处于不可用状态。
- **`--tmp`**：运行一个临时节点，该节点将在流程结束时删除所有配置
- **`--rpc-external`**：监听所有RPC接口
- **`--ws-external`**：监听所有Websocket接口

### 节点选项 {: #node-options }

选项接受一个选项右侧的参数。例如：

```
--8<-- 'code/setting-up-node/runnodewithsealinginterval.md'
```

- **`-l <log pattern>` or `--log <log pattern>`**：设置自定义日志记录筛选器。日志模式的语法为`<target>=<level>`。例如，要打印所有JSON RPC日志，该命令应如下所示：`-l json=trace`
- **`--sealing <interval>`**：当区块需要被密封在开发服务中。可接受的时间间隔参数为 `instant`、 `manual`或一个代表计时器间隔（以毫秒为单位）的数字（例如，`6000`是指节点每6秒产生一次区块）。默认设置是`instant`
- **`--rpc-port <port>`**：设置HTTP RPC服务器的TCP端口。接受端口作为参数
- **`--ws-port <port>`**：设置WebSockets RPC服务器的TCP端口。 接受端口作为参数

如需标志和选项的完整列表，请在命令末尾添加`--help`来启动Moonbeam开发节点。

## Debug、Trace和TxPool API {: #debug-trace-txpool-apis }

您也可以通过运行追踪节点访问一些非标准RPC方式的权限，这将允许开发者在runtime期间检查和调试交易事件。与标准Moonbeam开发节点相比，追踪节点使用的是不同的Docker镜像。

想要学习如何运行Moonbeam开发追踪节点，请查看[运行追踪节点](/node-operators/networks/tracing-node)的操作指南并确保在操作过程中已切换至**Moonbeam开发节点**标签。随后，通过您的追踪节点访问非标准RPC方法，详情请查看[Debug & Trace](/builders/build/eth-api/debug-trace)指南。

## 预注资的开发账户 {: #pre-funded-development-accounts }

您的Moonbeam开发节点带有十个预注资的开发帐户。这些地址源自于Substrate的规范开发助记词：

```
bottom drive obey lake curtain smoke basket hold race lonely fit walk
```

--8<-- 'code/setting-up-node/dev-accounts.md'

查阅[使用MetaMask](/tokens/connect/metamask/)页面，开始与您的帐户进行交互。

另外，开发节点中还包括一个用于可测试的预注资帐户：

--8<-- 'code/setting-up-node/dev-testing-account.md'

## 区块链浏览器

您可以使用以下区块链浏览器来浏览Moonbeam开发节点:

 - **Substrate API** —— [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer) WS端口`9944`
 - **基于以太坊 API JSON-RPC** —— [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=MoonbeamDevNode) HTTP端口`9933`
