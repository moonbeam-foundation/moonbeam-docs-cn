---
title: 通过Wormhole进行跨链操作
description: 学习如何使用Wormhole桥接资产、设置中继器以及将Moonbeam dApp连接到多个区块链上的资产和功能的其他方法。
---

# Wormhole Network

## 概览

[Wormhole](https://wormhole.com/){target=_blank}是一种通过称为VAAs（Verifiable Action Approvals）的消息来为Web3验证和保护跨链通信的协议。Wormhole的基础设施能够使dApp用户通过一键操作与任何链上的任意资产或应用程序交互。有一个多签协议和19个签署[Guardians](https://book.wormhole.com/wormhole/5_guardianNetwork.html){target=_blank}赋能, Wormhole可以让dApps跨链传输任意消息.

Wormhole由多个模块化的交换组件组成，这些组件可以独立使用并支持由多个团队构建的逐渐增加的可组合应用程序。在其协议之上构建xDapp允许快速进行跨链资产转移和跨链逻辑以提供最大的Web互操作性。Wormhole的架构包含签署Guardian网络、桥接智能合约和中继器。请查看技术栈图以获取更多信息。

![Wormhole Technology Stack diagram](/images/builders/interoperability/protocols/wormhole/wormhole-1.png)

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 开始操作 {: #getting-started }

开始使用Wormhole构建跨链应用程序可能所需的资源：

- **[开发者文档](https://book.wormhole.com/introduction/introduction.html){target=_blank}** - 技术性指南
- **[门户网站](https://www.portalbridge.com/#/transfer){target=_blank}** - 跨链转移资产的桥接UI

## 合约 {: #contracts }

查看部署至Moonbeam的Wormhole合约列表，以及通过Wormhole连接至Moonbeam的网络。

- **主网合约** - [Moonbeam](https://book.wormhole.com/reference/contracts.html#mainnet){target=_blank}

- **测试网合约** - [Moonbase Alpha](https://book.wormhole.com/reference/contracts.html#testnet){target=_blank}

## 使用Relayer Engine设置专用中继器 {: #setting-up-a-specialized-relayer-with-the-relayer-engine }

在此部分中，您将部署一个基本的Wormhole互连智能合约并启动一个专用中继器用于发送跨链消息。

首先，您需要了解一些背景。 VAAs（Verifiable Action Approvals）是Wormhole版本的经过验证的跨链消息。如果Wormhole的19名守护者有13名验证了一则特定消息，则该消息将获得批准并在其他链上接收。与Guardian（守护者）网络（充当Wormhole协议的验证人）相邻的是网络间谍。他们不做任何验证工作。相反，他们会监视守护者网络并作为一个页面以允许用户和应用查看哪些VAAs已获得批准。

中继器的职责是为目标链的执行支付费用，且在许多协议中，中继器又是由用户支付费用。Wormhole目前还没有通用中继器，所以Wormhole的架构需要dApp开发者创建并维护其自己的专用中继器（而不是拥有可以为许多不同的智能合约执行的中继器）。一个开发者如果想要合约调用者为目标链支付gas费用，则需要设计自己的系统。这可能看起来工作量很大，但这允许对消息处理的方式进行微调。举例而言，一个中继器可以同时发送相同的消息至多条链，称为多播（multicasting）。

### 查看先决条件 {: #checking-prerequisites }

在开始跟随本教程操作之前，您需要准备以下内容：

- [安装MetaMask并连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
- [安装Docker](https://docs.docker.com/get-docker/){target=_blank}
- 准备一个账户，为该账户提供一定数量的`DEV` token.
   --8<-- 'text/_common/faucet/faucet-list-item.md'
- 使用同一个账户，从您选择的Wormhole连接的EVM中提供原生资产至该账户。Faucet[如下方图表所示](#deploying-the-wormhole-contract-with-remix-on-moonbase-alpha)

### 使用Remix在Moonbase Alpha上部署Wormhole合约 {:deploying-the-wormhole-contract-with-remix-on-moonbase-alpha}

要发送跨链消息，在本教程中，你将需要部署和使用一个智能合约。每条连接至Wormhole的链都会有某种[Wormhole核心桥接](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/interfaces/IWormhole.sol){target=_blank}的实现，其功能为发布和验证VAAs。每一个核心桥接合约（每条链一个）的实现均由守护者网络上的守护者见证，这便是他们得知何时开始验证一条消息的方式。

不同于其他跨链合约，Wormhole并不提供用户可以继承并在其上构建的母合约。这是因为Wormhole的第一条链Solana，不像Solidity一样在其智能合约中提供特有的继承。为了让每条链上的设计体验相似，Wormhole让他们的Solidity开发者直接与EVM链上的Wormhole核心桥接智能合约交互。

本文中要部署的[智能合约](https://github.com/jboetticher/relayer-engine-docs-example/blob/main/SimpleGeneralMessage.sol){target=_blank}储存在一个由Wormhole的Relayer Engine存储库分叉出来的Git存储库中。这将从一条链向另一条链发送字符串，并在通过Wormhole协议接收到字符串时进行存储。要部署脚本，将合约复制并粘贴至Remix或打开[Remix gist链接](https://remix.ethereum.org/?#gist=6aac8f954e245d6394f685af5d404b4b){target=_blank}。

首先，该智能合约中的代码是基于[Wormhole的最佳实践开发文档](https://book.wormhole.com/technical/evm/bestPractices.html){target=_blank}，但某些方面（如安全性）已被简化。当您编写用于生产环境的智能合约时，请查阅文档以更好地了解其标准。需要明确的是，**不要在生产环境中使用以下智能合约**。

1. 前往**Solidity Compiler**标签
2. 点击**Compile**按钮
3. 前往Remix的**Deploy & Run Transactions**标签
4. 将环境设置为**Injected Web3**。这将使用MetaMask作为Web3提供商。确保您的MetaMask已连接至Moonbase Alpha网络

![Set up smart contract deployment](/images/builders/interoperability/protocols/wormhole/wormhole-2.png)

如需在每条链上部署，您将需要Wormhole核心桥接的本地实例以及每条对应链的chain ID。如下所示为选定的几个测试网提供了这些数据。您可以在Wormhole的[文档网站](https://book.wormhole.com/reference/contracts.html#testnet){target=_blank}找到其他网络的端点。请注意，为本文设计的智能合约和中继器仅支持EVM，因此在本次演示只能使用EVM。

|                                          网络 & 水龙头                                          |                 核心桥地址                 | Wormhole 链ID |
|:-----------------------------------------------------------------------------------------------:|:------------------------------------------:|:-------------:|
|               [Polygon Mumbai](https://faucet.polygon.technology/){target=_blank}               | 0x0CBE91CF822c73C2315FB05100C2F714765d5c20 |       5       |
|                  [Avalanche Fuji](https://faucet.avax.network/){target=_blank}                  | 0x7bbcE28e64B3F8b84d876Ab298393c38ad7aac4C |       6       |
|                 [Fantom TestNet](https://faucet.fantom.network/){target=_blank}                 | 0x1BB3B4119b7BA9dfad76B0545fb3F531383c3bB7 |      10       |
|                       [Goerli](https://goerlifaucet.com/){target=_blank}                        | 0x706abc4E45D419950511e474C7B9Ed348A4a716c |       2       |
| [Moonbase Alpha](/builders/get-started/networks/moonbase/#moonbase-alpha-faucet){target=_blank} | 0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901 |      16       |

1. 确保选择的合约为**SimpleGeneralMessage**
2. 点击箭头按钮打开部署菜单
3. 在**_CHAINID**输入框内输入相关chain ID
4. 在**WORMHOLE_CORE_BRIDGE_ADDRESS**输入框内输入相关核心桥接地址
5. 点击**transact**按钮以开始部署交易
6. 点击MetaMask中的**Confirm**按钮以开始部署

当您在Moonbase Alpha上成功部署合约后，请确保复制其地址并使用连接到Wormhole的任何其他[EVM测试网](https://book.wormhole.com/reference/contracts.html#testnet){target=_blank}重复该流程，以确保您可以跨链发送消息。注意您需要在MetaMask更改网络以部署至正确的网络。

### 将Moonbase Alpha的互连合约列入白名单 {:whitelisting-moonbase-alpha-connected-contract}

此时，您需要将相同的智能合约部署两次。 一个在Moonbase Alpha上，另一个在另外的EVM链上。

Wormhole建议在互连合约中包含一个白名单系统，您将在尝试发送跨链消息前用于`SimpleGeneralMessage`。

要添加白名单合约，您必须调用`addTrustedAddress(bytes32 sender, uint16 _chainId)`函数，这需要一个*bytes32*格式的地址和一个chain ID。您可以在[上述表格](#deploying-the-wormhole-contract-with-remix-on-moonbase-alpha)中以及[Wormhole的文档网站](https://book.wormhole.com/reference/contracts.html#testnet){target=_blank}中找到chain ID。

```sol
function addTrustedAddress(bytes32 sender, uint16 _chainId) external {
    myTrustedContracts[sender][_chainId] = true;
}
```

注意`sender`参数是一个`bytes32`类型，而非`address`类型。Wormhole的VAAs以`bytes32`的形式提供发射器（源）地址，所以它们以`bytes32`的形式存储和检查。若要将`address`类型转换为`bytes32`，您将需要再加上24个0。这是因为`address`的值是20个bytes，小于`bytes32`的32个。每个byte有两个十六进制字符，所以：

```text
zeros to add = (32 bytes - 20 bytes) * 2 hexadecimal characters
zeros to add = 24
```

例如，如果您的互连合约地址是`0xaf108eF646c8214c9DD9C13CBC5fadf964Bbe293`，您需要将下列内容输入至Remix：

```text
0x000000000000000000000000af108ef646c8214c9dd9c13cbc5fadf964bbe293
```

现在我们将继续使用Remix来确保您的两个互连合约相互信任。若您要来回发送消息，您必须对已部署的两个合约执行此操作。若要在不同链上切换合约，通过MetaMask连接至目标网络。

1. 确保您处于**Injected Provider**环境
2. 确保您使用的是正确账户
3. 确保合约仍是**SimpleGeneralMessage**
4. 最后，将目标合约的地址粘贴至**At Address**输入框

![At address](/images/builders/interoperability/protocols/wormhole/wormhole-4.png)

添加受信任的远程地址：

1. 在部署的合约中找到并打开**addTrustedAddress**函数
2. 当您在Moonbase Alpha上时，将**sender**设置为您在部署在其他EVM测试网上合约的正确格式地址（即添加了24个0的格式）
3. 将 **_chainId**设置为另一个合约部署至的链的Wormhole chain ID。之后，在MetaMask中交易并确认

当您在另一个EVM测试网时，将**sender**设置为您在Moonbase Alpha部署合约的正确格式地址（即添加24个0的格式）。将**_chainId**设置为Moonbase Alpha的Wormhole chain ID (16)。最后，在MetaMask中交易并确认。 

![Add trusted address](/images/builders/interoperability/protocols/wormhole/wormhole-5.png)

在此部分中，您应该已经将两条链上的两笔交易发送到两个合约中的白名单地址。之后，您应该被允许在互连合约之间发送消息。

### 运行Wormhole守护者网络间谍 {: #running-wormhole-guardian-spy }

现在您将为Wormhole运行一个测试网中继器！本教程是基于Wormhole的[relayer-engine](https://github.com/wormhole-foundation/relayer-engine){target=_blank} Github存储库的，截至本文撰写时，该存储库已提交至[`cc0aad4`](https://github.com/wormhole-foundation/relayer-engine/commit/cc0aad43787a87ecd9f0d9893d8ccf92901d7adb){target=_blank}。目前仍处于开发阶段，文件夹结构可能会发生比较大的变化。

克隆专门为与`SimpleGeneralMessage`交互的[relayer-engine分叉](https://github.com/jboetticher/relayer-engine-docs-example){target=_blank}。运行该中继器需要[Docker](https://docs.docker.com/get-docker/){target=_blank}和[npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=_blank}，所以请确保您已将其安装到您的设备上。

首先需要设置。使用npm包管理器通过命令行安装依赖项（像以太币和中继引擎本身）。

```bash
npm install
cd plugins/simplegeneralmessage_plugin
npm install
```

完成之后，查看不同的文件夹。有3个文件夹：`src`、`relay-engine-config`和`plugins`。`src`文件夹包含充当整个应用程序起点的脚本，因此它包括了设置（setup）。`relayer-engine-config`包含特定于`SimpleGeneralMessage`智能合约的JSON配置文件。`plugins`文件夹包含具有与`SimpleGeneralMessage`智能合约中继相关的逻辑的插件。

在深入了解如何运行任何东西或任何插件脚本如何工作之前，您首先需要了解中继器的不同组件以及中继器的作用。

中继器过滤并接收来自守护者网络的VAA，并对此进行处理。在此情况下，中继器会过滤来自您部署的互连合约的守护者批准的消息，然后解析该VAA，确定其目的地，最终尝试在目的地执行一个叫做`processMyMessage(bytes32 VAA)`的函数。您需要了解的是来自其他参与者的中继器可以收到这个VAA且其他中继器可以以他们认为合适的任何方式执行任何VAA。

从技术角度来看，该中继器的实现分为四个部分。

1. 一个为所有VAA监视Wormhole守护者网络的非验证间谍节点
2. 一个称为监听器的组件，其收集任何间谍节点的输出，过滤出与中继器相关信息，然后将其打包至工作流对象中
3. 存储监听器输出的工作流对象的Redis数据库
4. 一个称为执行者的组件，从数据库中弹出工作流并以某种方式处理（在此情况下，在目标链上发送交易）

从头开始，可能要做很多。幸运的是，Wormhole提供了一个`relayer-engine`包来帮助设置。

最好按顺序处理这四个组件的配置和设置，所以从间谍节点开始。间谍节点使用Docker，所以在尝试运行节点前确保docker处于活跃状态。启动Docker容器的命令很长，所以为了简化步骤，已经以npm脚本形式添加至代码库的父目录。您只需运行：

```bash
npm run testnet-spy
```

首先，您应该能看到一些来自于Docker容器启动的日志。然后，很多日志应该会向控制台发送垃圾信息。这些都是通过Wormhole测试网的所有VAAs，可以看到其数量之庞大！但您无需解析任何日志，代码可以帮助我们完成此步骤。让它在后台运行并获取另一个终端实例以进行下一步。

![Run the spy relayer](/images/builders/interoperability/protocols/wormhole/wormhole-6.png)

### 设置监听器组件 {:setting-up-the-listener-component}

现在我们要解析中继器的自定义代码以及可配置组件。监听器组件名副其实将监听间谍代码以获取相关消息。若要定义什么是相关消息，您必须编辑一个配置文件。

在`plugins/simplegeneralmessage_plugin/config/devnet.json`中，有一个叫做`spyServiceFilters`的数组。数组中的每一个对象会将与中继器相关的合约VAA列入白名单。该对象包含一个`chainId`（Wormhole chain ID）以及一个`emitterAddress`。例如，在下图中，第一个对象会监视由`0x428097dCddCB00Ab65e63AB9bc56Bb48d106ECBE`在Moonbase Alpha （Wormhole chain ID是16）上发送的VAA。

请确保编辑`spyServiceFilters`数组以便中继器监听您部署的两个合约。

```json
"spyServiceFilters": [
    {
        "chainId": 16,
        "emitterAddress": "0x428097dCddCB00Ab65e63AB9bc56Bb48d106ECBE"
    },
    {
        "chainId": 10,
        "emitterAddress": "0x5017Fd40aeA8Ab94693bE41b3bE4e90F45860bA4"
    }
]
```

在`simplegeneralmessage_plugin`文件夹中，打开`src/plugin.ts`。该文件包含中继器的监听器和执行器两个组件的插件代码，但注释已明确说明哪些函数与哪个组件相关。该文件的片段如下所示，请遵循教程操作。若没有执行操作，您可以在[它的Github repository](https://github.com/jboetticher/relayer-engine-docs-example/blob/main/plugins/simplegeneralmessage_plugin/src/plugin.ts){target=_blank}获取整个文件。

接下来看下方的`getFilters()`函数。`spyServiceFilters`对象被注入至`getFilters()`所属的插件类别中。注意该过程中没有发生任何过滤，这仅仅是过滤器的准备工作。VAA的真正过滤发生在`relayer-engine`包中，使用此`getFilters()`函数来了解要过滤的内容。

如果开发者想要向过滤器添加额外的逻辑，可在此处完成。就目前而言，只需列出一些硬编码的地址即可。

```ts
 // How the relayer injects the VAA filters.
 // This is the default implementation provided by the dummy plugin.
 getFilters(): ContractFilter[] {
   if (this.pluginConfig.spyServiceFilters) {
     return this.pluginConfig.spyServiceFilters;
   }
   this.logger.error('Contract filters not specified in config');
   throw new Error('Contract filters not specified in config');
 }
```

过滤完后，监听器需要在下方`consumeEvent(vaa, stagingArea)`函数中将工作流数据写入Redis数据库。

工作流其实仅仅是执行器用于正确执行所需的来自于监听器的数据。在这种情况下，添加至工作流的唯一信息是收到VAA的时间以及VAA本身的解析数据。如果开发者想要将更多相关信息添加至工作流，他们可以在`workflowData`对象中操作。

`nextStagingArea`对象是使用的事件（过滤后的VAA）相互影响的一种方法。例如，如果一名开发者想要将两个VAA打包至一个工作流，他们不会每次都返回一个`workflowData`。

```ts
 // Receives VAAs and returns workflows.
  async consumeEvent(
    vaa: ParsedVaaWithBytes,
    stagingArea: StagingAreaKeyLock,
  ): Promise<
    | {
      workflowData: WorkflowPayload;
      workflowOptions?: WorkflowOptions;
    }
    | undefined
  > {
    this.logger.debug(`VAA hash: ${vaa.hash.toString('base64')}`);

    return {
      workflowData: {
        vaa: vaa.bytes.toString('base64'),
      },
    };
  }
```

这就是所有关于监听器组件的所需内容。大部分代码藏于`relayer-engine`包中，对用户不可见。

如果您还记得组件列表的话，第三个是Redis数据库组件。与数据库相关的大部分代码对用户隐藏，因为`relayer-engine`包会从其写入和阅读，并将任何相关数据注入插件代码。要运行Redis数据库，只需在父目录中运行以下命令：

```bash
npm run redis
```

### 设置执行器组件 {: #setting-up-the-executor-component}

最后，您必须处理执行器组件。执行器组件从Redis数据库获取工作流数据并对该数据进行某种执行操作。对于大多数中继器来说，该执行会包括一个链上交易，因为一个中继器相当于VAA无需信任的预言机。

`relayer-engine`包帮助插件处理钱包。目前，该包仅支持Solana和EVM钱包，随着进一步发展将会支持更多链。但将NEAR或Algorand集成至中继器并非无可能，因为除了包已经提供的钱包处理系统外，您只需要再编写一个自己的钱包处理系统即可。

若要使用包提供的内置钱包处理系统，在`relayer-engine-config/executor.json.example`打开文件。该示例脚本旨在为您展示如何格式化您的密钥（当前的密钥由Wormhole提供）。

将示例文件重命名为`executor.json`。在`executor.json`的对象`privateKeys`中，将每个数组的内容替换为您的密钥。密钥条目的账号会是在执行器组件中支付执行费用的账号。

泄露密钥可能导致资金流失，因此请妥善保管您的密钥。虽然`executor.json`在存储库中被git忽略，请确保您在测试网使用的钱包中没有任何主网资金。

```json
{
   "privateKeys": {
       "16": [
           "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
       ],
       "2": [
           "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
       ],
       "5": [
           "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
       ],
       "6": [
           "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
       ],
       "10": [
           "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
       ],
   }
}
```

如果`privateKeys`对象中任何条目的密钥属于您未使用的链，则从`privateKeys`对象中删除这些条目。

如果您正在使用一条并未在上方EVM测试网列表中列出的链，您将需要添加您自己的数组。该数组的密钥应该在另一个您之前决定部署的EVM的Wormhole chain ID。例如，如果您在Fantom TestNet上部署，您将添加以下对象，因为Fantom TestNet的Wormhole chain ID是10。

```json
"10": [
    "INSERT_YOUR_PRIVATE_KEY"
]
```

现在执行器的钱包已处理完成，我们看看执行器代码本身，其存在于`plugins/simplegeneralmessage_plugin/src/plugin.ts` 文件中。若您没有跟随操作，可以在[其GitHub存储库](https://github.com/jboetticher/relayer-engine-docs-example/blob/main/plugins/simplegeneralmessage_plugin/src/plugin.ts){target=_blank}获取整个文件。

所有逻辑都发生在`handleWorkflow(workflow, providers, execute)`函数里，不过其下也有一些辅助函数。这是`relayer-engine`包在Redis数据库中有工作流要被使用时调用的函数。注意注入函数的三个参数：`workflow`、`providers`和`execute`。

- `workflow`对象在监听器组件的`consumeEvent(vaa, stagingArea)`函数执行时提供存放在数据库的数据。在这种境况下，仅有VAA以及其被接收的时间会被存放至数据库，其被存放在本地`payload`变量中
- `providers`对象注入Ethers以及其他链提供商，这对于查询链上数据或进行其他区块链相关操作可能有帮助。如之前所述，目前被该包支持的提供商仅有Solana和EVM。`providers`对象不被用于实现
- `execute`对象中目前有两个函数：`onEVM(options)`和`onSolana(options)`。这些函数需要一个Wormhole chain ID和一个有钱包对象注入的回调函数。包含的钱包是基于在`executor.json`文件中配置的密钥

该函数要做的第一件实质性的事情是解析工作流（workflow）对象，然后通过一些辅助函数解析其VAA。之后，它带着解析后的VAA负载，将其转换至十六进制格式，并使用Ethers实用程序将负载ABI解码至其在智能合约中定义的独立值。

有了Ethers解码的数据，我们可以知道负载所传送至的目标合约以及目标链，因为数据被打包至消息中了。该函数检查指定的目标chain ID是否属于一个EVM，并将使用上述的`execute.onEVM(options)`函数执行。否则，它将记录一个错误，因为系统会因简单起见而不与非EVM链交互。

```ts
// Consumes a workflow for execution
async handleWorkflow(
  workflow: Workflow,
  providers: Providers,
  execute: ActionExecutor
): Promise<void> {
  this.logger.info(`Workflow ${workflow.id} received...`);

  const { vaa } = this.parseWorkflowPayload(workflow);
  const parsed = wh.parseVaa(vaa);
  this.logger.info(`Parsed VAA. seq: ${parsed.sequence}`);

  // Here we are parsing the payload so that we can send it to the right recipient
  const hexPayload = parsed.payload.toString('hex');
  let [recipient, destID, sender, message] =
    ethers.utils.defaultAbiCoder.decode(
      ['bytes32', 'uint16', 'bytes32', 'string'],
      '0x' + hexPayload
    );
  recipient = this.formatAddress(recipient);
  sender = this.formatAddress(sender);
  const destChainID = destID as ChainId;
  this.logger.info(
    `VAA: ${sender} sent "${message}" to ${recipient} on chain ${destID}.`
  );

  // Execution logic
  if (wh.isEVMChain(destChainID)) {
    // This is where you do all of the EVM execution.
    // Add your own private wallet for the executor to inject in 
    // relayer-engine-config/executor.json
    await execute.onEVM({
      chainId: destChainID,
      f: async (wallet, chainId) => {
        const contract = new ethers.Contract(recipient, abi, wallet.wallet);
        const result = await contract.processMyMessage(vaa);
        this.logger.info(result);
      },
    });
  } else {
    // The relayer plugin has a built-in Solana wallet handler, which you could use
    // here. NEAR & Algorand are supported by Wormhole, but they're not supported by
    // the relayer plugin. If you want to interact with NEAR or Algorand you'd have
    // to make your own wallet management system, that's all
    this.logger.error(
      'Requested chainID is not an EVM chain, which is currently unsupported.'
    );
  }
};
```

在回调函数中，使用Ethers包创建一个[合约对象](https://docs.ethers.org/v6/api/contract/#Contract){target=_blank}。其导入的ABI从`SimpleGeneralMessage`合约的编译中导出，所以该代码假设VAA中指定的消息接收者是或从`SimpleGeneralMessage`合约继承。

然后，该代码会尝试用VAA执行函数`processMyMessage(bytes32 VAA)`，这是此前被定义为用于中继消息的函数。该函数名字是为智能合约随意设置的，因为中继器可以指定调用任何函数。这说明了开发者可以更改该中继器代码！

```ts
await execute.onEVM({
  chainId: destChainID,
  f: async (wallet, chainId) => {
    const contract = new ethers.Contract(recipient, abi, wallet.wallet);
    const result = await contract.processMyMessage(vaa);
    this.logger.info(result);
  },
});
```

最后一步就是检查`relayer-engine-config/common.json`。该配置文件控制着整个中继器的执行。请确保您在使用的TestNet EVM是列出在该文件中`supportedChains`对象内的。如果其未被列出，该插件不会正常运行。如果您在运行的一条链未被列出，您将需要以下列格式从[Wormhole的开发者文档](https://book.wormhole.com/reference/contracts.html#testnet){target=_blank}导入数据至配置文件。

该中继器还有许多其他配置。例如，`mode`字符串设置为`"BOTH"`以确保使用监听器和执行器插件，也可根据开发者需求选择只运行其中一个。此外，还有多个日志级别可供指定，如`"error"`可用来只记录错误消息。然而，在本次演示中只需保留配置设置即可。

```json
 "mode": "BOTH",
 "logLevel": "debug",
 ...
    {
        "chainId": 16,
        "chainName": "Moonbase Alpha",
        "nodeUrl": "https://rpc.api.moonbase.moonbeam.network",
        "bridgeAddress": "0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901",
        "tokenBridgeAddress": "0xbc976D4b9D57E57c3cA52e1Fd136C45FF7955A96"
    },
```

配置这样就行了！现在需要运行它。在您的终端实例（未运行间谍节点的实例），导航至父文件夹。运行下列命令：

```bash
npm run start
```

您应该会在控制台中看到类似以下日志内容。

![Run the relayer](/images/builders/interoperability/protocols/wormhole/wormhole-7.png)

### 通过Wormhole从Moonbase传送跨链消息 {: #send-message-from-moonbase }

现在，要想发送一条跨链消息，您只需要调用`sendMessage(string memory message, address destAddress, uint16 destChainId)`函数。

使用Remix接口。此范例将向Fantom测试网发送跨链消息，但您可以将`destChainId`替换成您想要的任何EVM。接着，检查以下事项：

1. 环境为**Injected Provider**，网络为1287（Moonbase Alpha）
2. 您的钱包里有来自[faucet](https://faucet.moonbeam.network/){target=_blank}的大量资金，以支付源链和目标链上的交易Gas成本
3. 在**sendMessage**部分的**message**输入框中输入您选择的短消息（在本示例中为"this is a message"）
4. 将您的在目标链上的SimpleGeneralMessage实例的地址放入**destAddress**输入框中
5. 将目标链的Wormhole chain ID放入**sendMessage**部分的**destChainId**输入框中
6. 当完成所有步骤后，请执行交易并在MetaMask中确认

![Send a transaction](/images/builders/interoperability/protocols/wormhole/wormhole-8.png)

几秒到一分钟后，跨链消息应该已经通过您在本地机器上托管的中继器正确中继。

![Message relay in the logs](/images/builders/interoperability/protocols/wormhole/wormhole-9.png)

## Moonbeam路由流动性集成 {: #moonbeam-routed-liquidity-integration }

Wormhole将通过Moonbeam路由流动性（Moonbeam Routed Liquidity，MRL）计划为平行链提供流动性。该计划允许通过Moonbeam网络发送流动性，将流动性从Wormhole连接的链一键转移到平行链钱包中。

[MRL](/builders/interoperability/mrl){target=_blank}通过[GMP预编译](/builders/pallets-precompiles/precompiles/gmp){target=_blank}来实现，GMP预编译的文档中详细解释了应该如何通过该合约正确构建跨链消息。

--8<-- 'text/_disclaimers/third-party-content.md'
