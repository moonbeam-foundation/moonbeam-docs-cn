---
title: 在Moonbeam上订阅以太坊格式事件
description: 使用类似于以太坊的pubsub功能来订阅Moonbeam上的以太坊格式事件。
---

# 事件订阅

## 概览  {: #introduction } 

Moonbeam支持以太坊式事件的事件订阅。这允许您订阅事件并进行相应处理，而不需轮询。

对某特定事件的订阅会返回一个 id。对于与订阅匹配的每个事件，带有相关数据的通知将与订阅ID一起发送。

在本指南中，您将学习如何在Moonbase Alpha上订阅事件日志、待处理交易和新的区块。本指南也适用于Moonbeam或Moonriver。

## 查看先决条件 {: #checking-prerequisites } 
本教程所使用的示例基于Ubuntu 18.04的环境。除此之外，还需要进行以下操作：

 - 安装MetaMask并[连接到Moonbase](/tokens/connect/metamask/){target=_blank}
 - 具有拥有一定数量资金的账户。 
 --8<-- 'text/faucet/faucet-list-item.md'
 - 在Moonbase上部署您的ERC-20代币。您可以根据我们的[Remix教程](/builders/build/eth-api/dev-env/remix/){target=_blank}进行操作，但首先要确保MetaMask指向Moonbase

--8<-- 'text/common/install-nodejs.md'

在撰写本教程时，所用版本分别为14.6.0 和6.14.6版本。此外，您还需执行以下命令安装Web3安装包：

```
npm install --save web3
```

您也可以通过`ls`指令验证Web3安装版本：

```
npm ls web3
```

在撰写本教程时，所用版本为1.3.0版本。

## 订阅事件日志 {: #subscribe-to-event-logs } 
每个采用ERC-20代币标准的合约都会发送与代币转移相关的事件信息，即`event Transfer(address indexed from, address indexed to, uint256 value)`。在以下示例中，您将了解如何订阅这些事件日志。请执行以下代码调用Web3.js库：

```js
const Web3 = require('web3');
const web3 = new Web3('wss://wss.api.moonbase.moonbeam.network');

web3.eth.subscribe('logs', {
    address: 'ContractAddress',
    topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']
}, (error, result) => {
    if (error)
        console.error(error);
})
    .on("connected", function (subscriptionId) {
        console.log(subscriptionId);
    })
    .on("data", function (log) {
        console.log(log);
    });
```

请注意，您需连接到Moonbase Alpha的WebSocket终端。调用`web3.eth.subscribe(‘logs’,  options [, callback])`方法订阅过滤后的事件日志。在本示例中，过滤选项有：事件发出的合约地址，以及用于描述事件的主题。更多关于事件主题的信息可以在[了解以太坊事件日志](https://medium.com/mycrypto/understanding-event-logs-on-the-ethereum-blockchain-f4ae7ba50378){target=_blank}这篇Medium文章中找到。如果事件没有主题，用户将订阅该合约发出的所有事件信息。如果仅过滤`Transfer`(代币转帐)事件，需要包含通过以下方式计算的事件签名：

```js
EventSignature = keccak256(Transfer(address,address,uint256))
```

计算结果显示在此前的代码段中，稍后将回过头来介绍关于过滤主题的内容。剩下代码负责处理的是回调函数。执行该代码后，您将获得一个任务ID，终端将等待订阅事件的发生：

![Subscription ID](/images/builders/build/eth-api/pubsub/pubsub-1.png)

接下来， ERC-20代币转移事件通过以下参数发送：

 - **原地址** - `0x44236223aB4291b93EEd10E4B511B37a398DEE55`
 - **目标地址** - `0x8841701Dba3639B254D9CEe712E49D188A1e941e`
 - **价值（代币数量）** - `1000000000000000000` - （即1的后面有18个0）

发送该事件后，该事件所发出的事件日志将显示在终端：

![Log of the transfer event](/images/builders/build/eth-api/pubsub/pubsub-2.png)

您的目标事件发送了两个索引信息：首先是`from`发送地址，然后是`to`接收地址，这些信息都将作为事件主题。而另一段返回的数据则是代币数量，该信息没有索引。因此，一共返回了三个主题（最多能返回四个）与LOG3操作码相对应：

![Description of LOG3](/images/builders/build/eth-api/pubsub/pubsub-3.png)

这里可以看到，`from`和`to`地址都包含在日志所返回的主题中。以太坊地址的长度为40 hex character（1 hex character等于4比特，所以为160比特或称为H160形式）。因此，要转换成64 hex character长度的H256地址，还需要加上24个0。

无索引数据将显示在返回日志的`data`字段，但这一代码形式为bytes32/hex。您可以使用此[Web3类型串换工具](https://web3-type-converter.onbrn.com/){target=_blank}对其解码，并且验证这一`data`实际上等于1（加上18个0）。

如果事件返回了多个无索引数据，这些数据将根据事件发出顺序，依次附在前一个数据之后。因此每个数据值都会被解码成32字节（或64 hex character长度）的小片段。

### 使用通配符和条件格式  {: #using-wildcards-and-conditional-formatting } 

考虑到通配符和条件格式的应用，v2版本新增的日志订阅功能在用于主题方面还有一些局限。但在[Moonbase Alpha v3](https://moonbeam.network/announcements/moonbeam-network-upgrades-account-structure-to-match-ethereum/){target=_blank}版本中，这些局限已经得到解决。

延续上一小节的例子，我们将尝试通过以下代码订阅代币合约事件：

```js
const Web3 = require('web3');
const web3 = new Web3('wss://wss.api.moonbase.moonbeam.network');

web3.eth
   .subscribe(
      'logs',
      {
         address: 'ContractAddress',
         topics: [
            null,
            [
               '0x00000000000000000000000044236223aB4291b93EEd10E4B511B37a398DEE55',
               '0x0000000000000000000000008841701Dba3639B254D9CEe712E49D188A1e941e',
            ],
         ],
      },
      (error, result) => {
         if (error) console.error(error);
      }
   )
   .on('connected', function (subscriptionId) {
      console.log(subscriptionId);
   })
   .on('data', function (log) {
      console.log(log);
   });
```

在这里使用通配符`null`代替事件签名，可以进行过滤并接收所有订阅合约发送的事件信息。但在这一设置下，您还可以使用另一个（`topic_1`）输入值来定义此前提到的地址过滤器。例如在这个例子中，您要得到的效果是只在当`topic_1`是我们所提供的地址之一时，才接收事件信息。请注意，地址需要以H256形式输入。例如，地址`0x44236223aB4291b93EEd10E4B511B37a398DEE55`需要输入为`0x00000000000000000000000044236223aB4291b93EEd10E4B511B37a398DEE55`。和此前一样，订阅的输出值将在`topic_0`处显示事件签名，告诉您该合约发出的事件。

![Conditional Subscription](/images/builders/build/eth-api/pubsub/pubsub-4.png)

如上所示，当您使用条件格式分别输入两个地址后，会获得具有相同订阅ID的两个日志。不同地址发出的交易事件将不会记载到这个订阅日志。

这个例子说明，您可以仅订阅某个特定合约的事件日志。但是，Web3.js库也提供其他订阅类型，将在下节展开介绍。

## 订阅收到的待处理交易信息 {: #subscribe-to-incoming-pending-transactions } 

您可以调用`web3.eth.subscribe(‘pendingTransactions’, [, callback])`方法订阅待处理交易信息，并用相同的回调函数来检查返回值。这种方法比此前例子中的方法要简单很多，它返回的是待处理交易的哈希值。

![Subscribe pending transactions response](/images/builders/build/eth-api/pubsub/pubsub-5.png)

您可以验证，该笔交易的哈希值与MetaMask（或Remix）上显示的一致。

## 订阅收到的区块头 {: #subscribe-to-incoming-block-headers } 

使用Web3.js库还可以订阅新区块头。您可以调用`web3.eth.subscribe('newBlockHeaders' [, callback])`方法进行订阅，并调用同样的回调函数检查返回值。通过这种方法，可以订阅刚收到的区块头，也可以追踪区块链的变化。

![Subscribe to block headers response](/images/builders/build/eth-api/pubsub/pubsub-6.png)

请注意，图片中只显示了一个区块头，但在实际操作过程中，会显示所有产生区块的相关信息，所以区块信息很快会占满整个终端屏幕。

## 检查节点是否与网络同步 {: #check-if-a-node-is-synchronized-with-the-network } 

通过发布/订阅功能，还可以检查某个订阅的特定节点是否与网络同步。可以调用[`web3.eth.subscribe(‘syncing' [, callback])`](https://web3js.readthedocs.io/en/v1.2.11/web3-eth-subscribe.html#subscribe-syncing){target=_blank}方法，并通过相同的回调函数检查返回值。当节点没有在同步时，此订阅将返回一个为`false`的布尔值，或节点在同步时，则返回一个描述同步进度的对象，如下图所示。

![Subscribe to syncing response](/images/builders/build/eth-api/pubsub/pubsub-7.png)

!!!注意事项
    [Frontier](https://github.com/paritytech/frontier){target=_blank}的发布/订阅功能目前还在开发中。在此版本中，用户可以订阅特定的事件类型，但可能仍存在一些限制。

