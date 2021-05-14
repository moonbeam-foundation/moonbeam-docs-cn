---
title: 设置节点
description: 此教程将帮助您学习如何设置您的第一个Moonbeam节点，以及如何将其连接到Polkadot JS GUI并加以控制。
---

# 如何设置Moonbeam节点并连接至Polkadot JS GUI

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed//p_0OAHSlHNM' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>You can find all of the relevant code for this tutorial on the <a href="{{ config.site_url }}resources/code-snippets/">code snippets page</a></div>

## 概览

本教程将指导您如何设置一个独立的Moonbeam本地节点，并测试Moonbeam与以太坊之间的兼容性与功能性。

!!! 注意事项 
    本教程使用[Moonbase Alpha](https://github.com/PureStake/moonbeam)的tutorial-v7标签建立。为实现与以太坊的全面兼容，基于Substrate的Moonbeam平台和[Frontier](https://github.com/paritytech/frontier)组件正处于积极开发阶段。本教程示例基于Ubuntu 18.04的环境，用户需根据其所使用的MacOS和Windows版本进行微调。
    --8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

Moonbeam开发节点是基于您的个人开发环境，在Moonbeam上构建和测试应用程序，相当于以太坊开发人员使用的Ganache。Moonbeam助您快速轻松地上手，无需承担中继链的成本。您可以使用 `--sealing` 选项，立即启动节点来创建区块，或者在交易完成后的自定义时间段创建区块。默认情况下，收到交易意味着一个区块即被创建，类似于Ganache的instamine功能。

如您参考本教程指示操作，您可顺利连接至默认的Polkadot JS GUI的Moonbeam节点，同时获得10个 [预注资的账户](/getting-started/local-node/setting-up-a-node/#pre-funded-development-accounts)，该节点可在本地环境运行。

另有两种方法助您运行Moonbeam节点：使用[Docker来执行预建二进制](/getting-started/local-node/setting-up-a-node/#getting-started-with-docker)，或[在本地编译二进制](/getting-started/local-node/setting-up-a-node/#getting-started-with-the-binary-file)设置开发节点。点击此处便可安装[Docker](https://docs.docker.com/get-docker/)。Docker更为快速便捷，您无需安装Substrate，所有辅助项，且无需构建节点即可运行。另一方面，如果您仍希望体验构建节点进程，则需要大约30分钟或更长时间完成，具体情况取决于您的硬件设备。

## 使用Docker进行安装与设置

使用Docker可让您可以在几秒钟内启动节点。安装Docker后，您可执行下列指令来下载相关图像：

```
docker pull purestake/moonbeam:{{ networks.development.build_tag }}
```

控制台日志的结尾应该与以下图片一致：

![Docker - imaged pulled](/images/setting-up-a-node/setting-up-node-1.png)

完成Docker镜像下载后，您可以执行以下命令：

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

该命令可通过即时密封模式启动Moonbeam开发节点以进行本地测试，因此收到到交易时区块即被创建。如果节点已经启动，您会见到一个显示区块待创建的空闲状态界面：

![Docker - output shows blocks being produced](/images/setting-up-a-node/setting-up-node-2.png)

您可点击[一般标识及选项](/getting-started/local-node/setting-up-a-node/#common-flags-and-options)来查阅更多实例的标识及选项。如果要查看所有标识、选项和子命令的完整列表，请通过运行以下命令打开帮助菜单：

```
docker run --rm --name {{ networks.development.container_name }} \
purestake/moonbeam \
--help
```

如果您已经使用Docker来启动节点，则可以跳过下一部分的教程，直接进入[设置Moonbeam节点并连接至Polkadot JS GUI](/getting-started/local-node/setting-up-a-node/#connecting-polkadot-js-apps-to-a-local-moonbeam-node).
## 安装与预设  

第一步，我们通过下列链接来克隆一个Moonbeam Repo的特定标签：

[https://github.com/PureStake/moonbeam/](https://github.com/PureStake/moonbeam/)

```
git clone -b {{ networks.development.build_tag }} https://github.com/PureStake/moonbeam
cd moonbeam
```

第二步，执行以下命令安装Substrate及其必备组件（包含Rust）：

```
--8<-- 'code/setting-up-node/substrate.md'
```

完成上述步骤后，使用以下指令运行独立节点：

```
--8<-- 'code/setting-up-node/build.md'
```

如果您的设备出现”a cargo not found error“，您可手动将Rust加入您的系统路径（或是重启系统）：

```
--8<-- 'code/setting-up-node/cargoerror.md'
```

!!! 注意事项
    初始构建将会需要一些时间，根据您的硬件装置而定，安装节点大约需要30分钟。

以下为节点安装完毕后出现的画面：

![End of build output](/images/setting-up-a-node/setting-up-node-3.png)

然后，您将在开发者模式下运行节点，执行以下命令即可实现：

```
--8<-- 'code/setting-up-node/runnode.md'
```

!!! 注意事项
    如果您是 Substrate 入门者 ，您可通过单节点的开发者配置，使用`--dev` flag 运行基于Substrate的节点。点击[Substrate 指南](https://substrate.dev/docs/en/tutorials/create-your-first-substrate-chain/interact)了解更多信息。

您将看到显示区块待创建的空闲状态界面：

![Output shows blocks being produced](/images/setting-up-a-node/setting-up-node-4.png)

您可点击[一般标识及选项](/getting-started/local-node/setting-up-a-node/#common-flags-and-options)来查阅更多用于实例的标识及选项。如果要查看所有标识、选项和子命令的完整列表，请通过运行以下命令打开帮助菜单：

```
./target/release/moonbeam --help
```
## 如何将Polkadot JS Apps 连接至本地Moonbeam节点

发展节点是Substrate-based的节点，您可使用标准的Substrate工具来与之交互。两个可使用的RPC终端是：

 - HTTP: `http://127.0.0.1:9933`
 - WS: `ws://127.0.0.1:9944` 

首先，我们将节点连接至Polkadot JS Apps。打开浏览器并输入链接：[https://polkadot.js.org/apps/#/explorer](https://polkadot.js.org/apps/#/explorer) 。进入网站之后，Polkadot JS Apps将被启动，并自动连接至Polkadot主网。

![Polkadot JS Apps](/images/setting-up-a-node/setting-up-node-5.png)

然后，点击左上角打开目录，再点击Development子目录，选择“Local Node” 选项，点击该选项后Polkadot JS Apps 将连接至`ws://127.0.0.1:9944` 。点击上面的Switch选项，成功连接您的本地独立Moonbeam节点。

![Select Local Node](/images/setting-up-a-node/setting-up-node-6.png)

连接成功之后，您可以查看独立Moonbeam节点生产区块的情况。

![Select Local Node](/images/setting-up-a-node/setting-up-node-7.png)

## 如何查询账户状态

随着[Moonbase Alpha v3](https://www.purestake.com/news/moonbeam-network-upgrades-account-structure-to-match-ethereum/)的发布，Moonbeam可支持在单一账户的模式下运行，该模式为以太坊的H160并且已被Polkadot JS Apps支持。如果您想查看账户上的余额，您可直接将您的账户汇入至Accounts。了解更多，请参考[统一账户](/learn/unified-accounts/)页面。

您也可以利用Moonbeam完整的以太坊RPC功能，使用[MetaMask](/getting-started/local-node/using-metamask/)查询账户的余额。除此之外，您还可以利用其他的开发工具，如[Remix](/getting-started/local-node/using-remix/)和[Truffle](/getting-started/local-node/using-truffle/) 等等。

## 一般命令、标识及选项

### 清除数据

通过二进制文件运行节点时，数据存储在本地目录中，该目录通常位于`~/.local/shared/moonbeam/chains/development/db`。如果要启动该节点的新实例，您可以删除该文件夹的内容，或者在`moonbeam`文件夹中运行以下命令：

```
./target/release/moonbeam purge-chain --dev -y
```

这将删除数据文件夹，请注意，所有链数据均已丢失。

如果您使用Docker，则数据文件夹与Docker容器本身关联。
### 节点标识

标识不带参数。 要使用标识，请将其添加到命令末尾。例如：

```
--8<-- 'code/setting-up-node/runnode.md'
```

- `--dev`: 指定开发链
- `--no-telemetry`: 禁用连接到Substrate telemetry服务器。对于全局链，默认情况下telemetry处于启用状态。如果您正在运行开发（`--dev`）节点，则telemetry处于不可用状态。
- `--tmp`: 运行一个临时节点，该节点将在流程结束时删除所有配置
- `--rpc-external`: 监听所有RPC接口
- `--ws-external`: 监听所有Websocket接口

### 节点选项

选项接受选项右侧的参数。例如：

```
--8<-- 'code/setting-up-node/runnodewithsealinginterval.md'
```

- `-l <log pattern>` or `--log <log pattern>`: 设置自定义日志记录筛选器。日志模式的语法为 `<target>=<level>`。例如，要打印所有RPC日志，该命令应如下所示： `-l rpc=trace`。
- `--sealing <interval>`: 当区块应当被密封在开发服务中。可接受的时间间隔参数为 `instant`、 `manual`或一个代表计时器间隔（以毫秒为单位）的数字（例如，`6000` 是指节点每6秒产生一次块）。默认设置是`instant`。
- `--rpc-port <port>`: 设置HTTP RPC服务器的TCP端口。接受端口作为参数。
- `--ws-port <port>`: 设置WebSockets RPC服务器的TCP端口。 接受端口作为参数。

如需标志和选项的完整列表，请在命令末尾添加 `--help` 来启动Moonbeam开发节点。

## 高级标志和选项

--8<-- 'text/setting-up-node/advanced-flags.md'

例如，当运行二进制文件时：

```
./target/release/moonbeam --dev --execution=Native --ethapi=debug,trace
```

## 预注资开发账户

您的Moonbeam开发节点带有十个预注资的开发帐户。这些地址源自于Substrate的规范开发助记符：

```
bottom drive obey lake curtain smoke basket hold race lonely fit walk
```

查阅[使用 MetaMask](https://docs.moonbeam.network/getting-started/local-node/using-metamask/)页面，开始与您的帐户进行交互。

另外，开发节点中还包括一个用于可测试的预注资帐户：

--8<-- 'text/setting-up-node/dev-accounts.md'