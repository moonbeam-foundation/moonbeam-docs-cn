---
title: 调用许可预编译合约
description: 学习如何在Moonbeam上使用调用许可预编译合约，实现可以由任何人或任何智能合约调度的EVM调用签署许可。
keywords: solidity、以太坊、调用许可、许可、无需Gas费交易、moonbeam、预编译、合约
---

# 与调用许可预编译交互

![Precomiled Contracts Banner](/images/builders/pallets-precompiles/precompiles/call-permit/call-permit-banner.png)

## 概览 {: #introduction }

Moonbeam上的调用许可预编译能让用户签署一个为任何EVM调用的许可（一个签署的[EIP-712](https://eips.ethereum.org/EIPS/eip-712){target=_blank}消息）且该许可能够由任何人或任何智能合约调度。这与[ERC-20许可Solidity接口](/builders/xcm/xc20/overview/#the-erc20-permit-interface){target=_blank}相似，但其适用于除了批准外的任何EVM调用。

调度调用许可时，代表签署此许可的用户且调度许可的用户或是合约将支付交易费用。因此，此预编译能够被用于执行无需Gas费用的交易。

举例来说，Alice签署了一个调用许可，接着Bob调度其允许并代表Alice执行调用。Bob将负责支付交易费用，因此Alice并不需要使用任何原生资产支付此交易，除非此调用包含转账。

此调用许可预编译目前仅在Moonbase Alpha上可用，并位于以下地址：

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.call_permit }}
     ```

## 调用许可Solidity接口 {: #the-call-permit-interface }

[CallPermit.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=_blank}为一个Solidity接口，让开发者能够与预编译的三个函数交互。

此接口包含以下函数：

- **dispatch**(*address* from, *address* to, *uint256* value, *bytes* data, *uint64[]* gaslimit, *uint256* deadline, *uint8* v, *bytes32* r, *bytes32* s) — 调用代表其他用户调用EIP-712许可。此函数能够被任何人或是智能合约使用。如果许可并不可用，或调度的调用被撤回/错误（如缺失Gas），此交易将会被重置。如果函数被成功调用，签名者的随机数将会被增加以避免此允许被重复调用。以下为此函数参数的概览：
     - `from` - 此许可的签名者，调用将会代表此地址被调度
     - `to`  - 接收调度的调用地址
     - `value` - 从`from`账户转移的数值
     - `data` - 调用所需的数据，或是要执行的操作
     - `gasLimit` - 调度此调用所需的Gas限制。开发者能够为此参数提供一个参数以防止调度人操纵Gas限制
     - `deadline` - 许可不可用所需的时间，以UNIX秒为单位。在JavaScript中，您可以在JavaScript脚本或是浏览器控制台通过运行`console.log(Date.now())`获得现在以UNIX秒为单位的时间
     - `v` - 签名的恢复ID，整个签名串的最后一个字节
     - `r` - 签名串的首32个字节
     - `s` - 签名串的第二个32个字节
- **nonces**(*address* owner) - 回传当前随机数给指定所有者
- **DOMAIN_SEPARATOR**() - 回传用于避免重复攻击的EIP-712域名分隔器，跟随[EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=_blank}实现执行

**DOMAIN_SEPARATOR()**定义于[EIP-712标准](https://eips.ethereum.org/EIPS/eip-712){target=_blank}中，并由以下公式计算：

```
keccak256(PERMIT_DOMAIN, name, version, chain_id, address)
```

此哈希的参数可被拆分为以下部分：

 - **PERMIT_DOMAIN** -`EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)`的`keccak256`
 - **name** - 签署域名的名称，必须为`"Call Permit Precompile"`
 - **version** - 签署域名的版本，在本示例中**version**设置为`1`
 - **chainId** - 网络的链ID
 - **verifyingContract** - 用于验证签名的合约地址，在本示例中被称为调用许可预编译地址

当已调用`dispatch`，此许可需要在该调用被调度前获得验证。首个步骤为[计算域名分隔器](https://github.com/PureStake/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L138){target=_blank}，您可以在[Moonbeam的实现](https://github.com/PureStake/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L112-L126){target=_blank}中找到计算过程，或是您可以在[OpenZeppelin的EIP712合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L70-L84){target=_blank}中找到实际范例。

其中，[签名哈希以及给定参数](https://github.com/PureStake/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L140-L151){target=_blank}因用于保证签名仅能够被用于调用许可而生成。它使用一个给定的随机数确保签名不会被重复攻击影响，这与[OpenZeppelin的`ERC20Permit`合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L52){target=_blank}相似，除了`PERMIT_TYPEHASH`本身为一个调用许可，且其参数等于[调度函数](#:~:text=The interface includes the following functions)与随机数的综合。

域名分隔器以及哈希结构能够被用于构建完全编码消息的[最终哈希](https://github.com/PureStake/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L153-L157){target=_blank}，您可以在[OpenZeppelin的EIP712合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L70-L84)找到实际范例{target=_blank}。

签名能够通过最终哈希以及v、r和s数值[验证和恢复](https://github.com/PureStake/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L211-L223){target=_blank}。如其成功被验证，随机数将会增加1且调用将会被调度。

## 设置合约 {: #setup-the-example-contract }

在本示例中，您将会了解如何签署一个在简单的范例合约中更新消息的调用许可，[`SetMessage.sol`](#example-contract)。在您可以生成调用许可签名前，您将需要部署合约并为调用许可定义`dispatch`函数参数。

当您设置好范例合约，您可以开始设置调用许可预编译合约。

### 查看先决条件 {: #checking-prerequisites }

要跟随此教程，您需要准备以下内容：

- [安装MetaMask并连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
- 在Moonbase Alpha创建或是拥有两个账户以测试调用许可预编译的不同功能
- 至少其中一个账户需要拥有`DEV` Token
   --8<-- 'text/faucet/faucet-list-item.md'

### 范例合约 {: #example-contract }

`SetMessage.sol`将被作为调用许可的范例合约用于教程中，但实际上任何可以交互的合约皆可。

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.7;

contract SetMessage {
    string storedMessage;

    function set(string calldata x) public {
        storedMessage = x;
    }

    function get() public view returns (string memory) {
        return storedMessage;
    }
}
```

### Remix设置 {: #remix-set-up }

您可以使用[Remix](https://remix.ethereum.org/){target=_blank}编译和部署范例合约。要增加合约，您可以跟随以下步骤：

1. 复制[`SetMessage.sol`](#example-contract){target=_blank}合约
2. 将文件内容复制至Remix文件中并命名为`SetMesage.sol`
3. 获得[`CallPermit.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=_blank}的副本
4. 将文件内容复制至Remix文件中并命名为`CallPermit.sol`

![Copying and pasting the example contract into Remix](/images/builders/pallets-precompiles/precompiles/call-permit/call-1.png)

### 编译和部署范例合约 {: #compile-deploy-example-contract }

首先您需要编译范例合约：

1. 点击**Compile**标签（从上至下第二个）
2. 接着点击**Compile SetMessage.sol**编译接口

![Compiling SetMessage.sol](/images/builders/pallets-precompiles/precompiles/call-permit/call-2.png)

其后您可以开始部署：

1. 点击**Deploy and Run**标签，其位于Remix中**Compile**标签的下方。请注意：此处您并非部署一个合约，而是访问一个已经部署完毕的预编译合约
2. 在**ENVIRONMENT**下拉菜单中选择**Injected Provider - Metamask**
3. 在**CONTRACT**下拉菜单中选择**SetMessage.sol**
4. 点击**Deploy**
5. MetaMask将跳出弹窗，要求您点击**Confirm**确认交易

![Provide the address](/images/builders/pallets-precompiles/precompiles/call-permit/call-3.png)

合约将会出现在左侧板块中**Deployed Contracts**的列表下。复制合约地址，用于下个部分生成调用许可的签名。

### 编译和访问调用许可预编译 {: #compile-access-call-permit }

首先您需要编译调用许可的预编译合约：

1. 点击**Compile**标签（从上至下第二个）
2. 接着点击**Compile CallPermit.sol**编译接口

![Compiling SetMessage.sol](/images/builders/pallets-precompiles/precompiles/call-permit/call-4.png)

您无需接着部署合约，您仅需要访问给定的预编译地址：

1. 点击**Deploy and Run**标签，其位于Remix中**Compile**标签正下方。注意：此处您并非部署一个合约，而是访问一个已经部署完毕的预编译合约
2. 在**ENVIRONMENT**下拉菜单中选择**Injected Provider - Metamask**
3. 在**CONTRACT**下拉菜单中选择**SetMessage.sol**。由于这是一个预编译合约所以并不需要部署，您可以直接在**At Address**字段中提供预编译的地址
4. 提供Moonbase Alpha调用许可预编译地址：`{{networks.moonbase.precompiles.call_permit}}`，接着点击**At Address**
5. 调用许可的预编译将会出现在**Deployed Contracts**列表中

![Provide the address](/images/builders/pallets-precompiles/precompiles/call-permit/call-5.png)

## 生产调用许可签名 {: #generate-call-permit-signature}

要与调用许可预编译交互，您需要拥有或是生成一个签名以调度调用许可。生成签名有多种方式，此教程将会包含两个方法：使用[MetaMask扩展程序](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn){target=_blank}和[JSFiddle](https://jsfiddle.net/){target=_blank}以及[使用MetaMask的`@metamask/eth-sig-util` npm包](https://www.npmjs.com/package/@metamask/eth-sig-util){target=_blank}。

不论您选择哪种方法生成签名，您均需要执行以下步骤：

1. `message`将会被创建且包含需要创建调用许可的部分数据，包含会被传送至`dispatch`函数以及签名者随机数的参数
2. 将组合用户需要签署数据的JSON结构并包含所有`dispatch`函数和随机数需要的种类。这将会得出`CallPermit`种类并将作为`primaryType`储存
3. 域名分隔器将使用`"Call Permit Precompile"`创建，需要完全相同的名称、DApp或平台的版本、使用签名的网络的链ID以及将验证签名的合约地址
4. 所有组合的数据，`types`、`domain`、`primaryType`以及`message`将会使用MetaMask签署（不论是在浏览器或是用过MetaMask的JavaScript签名库）
5. 签名将被回传，接着您可以使用[Ethers.js](https://docs.ethers.io/v5/){target=_blank} [`splitSignature` 函数](https://docs.ethers.io/v5/api/utils/bytes/#utils-splitSignature){target=_blank}回传签名的`v`、`r`和`s`数值。

### 调用许可参数 {: #call-permit-arguments }

如同先前[调用许可接口](#the-call-permit-interface)的部分所述，`dispatch`需要使用以下参数：`from`、`to`、`value`、`data`、`gasLimit`、`deadline`、`v`、`r`和`s`。

要获得签名的参数（`v`、`r`和`s`），您将需要签署一条包含上述参数外的参数加上签名者的随机数的消息。

- `from` - 您希望签署调用许可的账户地址
- `to` - `SetMessage.sol`合约的合约地址
- `value` - 在本示例中可以为`0`，因为您将用于设置消息而非转移资金
- `data` - 您可以传送任何消息，您仅需要通过`SetMessage.sol`合约设置消息的十六进制表现方式。这将会包含`set`函数的函数选择器以及消息的字节。在本示例中，您可以传送`hello world`，以下为其十六进制表现：

     ```
     0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000
     ```
- `gasLimit` - `100000`将足够用于传送调度的调用
- `deadline` - 您可以在JavaScript脚本中或浏览器控制台运行`console.log(Date.now())`获得当前以UNIX秒为单位的时间。获得当前时间后，您可以添加额外的时间（以秒为单位）来表示调用许可何时到期

您同样需要签名者的随机数，如果这是您第一次签署一个调用许可则随机数将会为`0`。您也可以在Remix中查看随机数：

1. 展开调用许可合约
2. 在**nonces**函数旁输入签名者的地址并点击**nonces**
3. 结果将会在函数下方显示

![Get the nonce](/images/builders/pallets-precompiles/precompiles/call-permit/call-6.png)

### 使用浏览器 {: #use-the-browser }

开始之前，您可以打开[JSFiddle](https://jsfiddle.net/){target=_blank}或在浏览器中打开其他JavaScript界面。首先，您需要新增[Ethers.js](https://docs.ethers.io/v5/){target=_blank}，因其需要用于获得签名的`v`、`r`和`s`数值：

1. 点击**Resources**
2. 接着输入`ethers`，下拉选单应当弹出符合的库。选择**ethers**
3. 点击**+**按钮

Ethers.js的CDN应当在**Resources**下方的库列表出现

![Add Ethers to JSFiddle](/images/builders/pallets-precompiles/precompiles/call-permit/call-7.png)

在**Javascript**代码框中复制并贴下方JavaScript代码段，确保取代`to`变量，或是任何您需要修改的变量：

```js
const main = async () => {
  await window.ethereum.enable();
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });


  const from = accounts[0];
  const to = "INSERT-TO-ADDRESS-HERE";
  const value = 0;
  const data = "0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000";
  const gaslimit = 100000;
  const nonce = "INSERT-SIGNERS-NONCE-HERE";
  const deadline = "INSERT-DEADLINE-HERE";

  const createPermitMessageData = function() {
    const message = {
      from: from,
      to: to,
      value: value,
      data: data,
      gaslimit: gaslimit,
      nonce: nonce,
      deadline: deadline,
    };

    const typedData = JSON.stringify({
      types: {
        EIP712Domain: [{
            name: "name",
            type: "string"
          },
          {
            name: "version",
            type: "string"
          },
          {
            name: "chainId",
            type: "uint256"
          },
          {
            name: "verifyingContract",
            type: "address"
          },
        ],
        CallPermit: [{
            name: "from",
            type: "address"
          },
          {
            name: "to",
            type: "address"
          },
          {
            name: "value",
            type: "uint256"
          },
          {
            name: "data",
            type: "bytes"
          },
          {
            name: "gaslimit",
            type: "uint64"
          },
          {
            name: "nonce",
            type: "uint256"
          },
          {
            name: "deadline",
            type: "uint256"
          },
        ],
      },
      primaryType: "CallPermit",
      domain: {
        name: "Call Permit Precompile",
        version: "1",
        chainId: {{ networks.moonbase.chain_id }},
        verifyingContract: "{{ networks.moonbase.precompiles.call_permit }}",
      },
      message: message,
    });

    return {
      typedData,
      message,
    };
  };

  const method = "eth_signTypedData_v4";
  const messageData = createPermitMessageData();
  const params = [from, messageData.typedData];

  web3.currentProvider.sendAsync({
      method,
      params,
      from,
    },
    function(err, result) {
      if (err) return console.dir(err);
      if (result.error) {
        alert(result.error.message);
        return console.error("ERROR", result);
      }
      console.log("Signature:" + JSON.stringify(result.result));
      console.log(ethers.utils.splitSignature(result.result))

    }
  );
}

main()
```

要运行代码，在页面上方点击**Run**，或者您可以使用`control`和`s`。MetaMask应跳出弹窗要求您连接账户。确保您选择您希望用于签署消息的账户，接着签署消息。

![Sign the message with MetaMask](/images/builders/pallets-precompiles/precompiles/call-permit/call-8.png)

当您成功签署消息后，回到JSFiddle，如果控制台尚未开启，请直接开启并查看签名数值（包含`v`、`r`和`s`数值）。复制这些数值，用于后续部分与调用许可预编译交互。

![Signature values in the JSFiddle console](/images/builders/pallets-precompiles/precompiles/call-permit/call-9.png)

### 使用MetaMask的JS签名库 {: #use-metamasks-signing-library }

要使用JavaScript和[MetaMask的`@metamask/eth-sig-util` npm包](https://www.npmjs.com/package/@metamask/eth-sig-util){target=_blank}，您首先需要在本地创建项目。您可以通过以下命令创建：

```
mkdir call-permit-example && cd call-permit-example && touch getSignature.js
npm init -y
```

您现在应该有一个文件，您可以在其中创建脚本以获取签名以及`package.json`文件。打开`package.json`文件，接着在`"dependencies"`部分添加：

```
"type": "module"
```

接下来，您可以安装MetaMask签名库和[Ethers.js](https://docs.ethers.io/v5/){target=_blank}：

```
npm i @metamask/eth-sig-util ethers
```

!!! 注意事项
    私钥可直接访问您的资产，请勿将其泄露给他人。以下步骤仅用于演示目的。

在`getSignature.js`文件中，您可以复制以下代码段：

```js
import ethers from "ethers";
import {
  signTypedData, SignTypedDataVersion,
} from "@metamask/eth-sig-util";

const from = "INSERT-FROM-ADDRESS-HERE"
const to = "INSERT-TO-ADDRESS-HERE";
const value = 0;
const data = "0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000";
const gaslimit = 100000;
const nonce = "INSERT-SIGNERS-NONCE-HERE";
const deadline = "INSERT-DEADLINE-HERE";

const createPermitMessageData = () => {
  const message = {
    from: from,
    to: to,
    value: value,
    data: data,
    gaslimit: gaslimit,
    nonce: nonce,
    deadline: deadline,
  };

  const typedData = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      CallPermit: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "data", type: "bytes" },
        { name: "gaslimit", type: "uint64" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    primaryType: "CallPermit",
    domain: {
      name: "Call Permit Precompile",
      version: "1",
      chainId: {{ networks.moonbase.chain_id }},
      verifyingContract: "{{ networks.moonbase.precompiles.call_permit }}",
    },
    message: message,
  };

  return {
    typedData,
    message,
  };
}

const messageData = createPermitMessageData();

// For demo purposes only. Never store your private key in a JavaScript/TypeScript file
const signature = signTypedData({
  privateKey: Buffer.from("INSERT-FROM-ACCOUNT-PRIVATE-KEY", "hex"),
  data: messageData.typedData,
  version: SignTypedDataVersion.V4
})

console.log(`Transaction successful with hash: ${signature}`);
console.log(ethers.utils.splitSignature(signature))
```

您可以使用以下命令运行脚本：

```
node getSignature.js
```

在控制台中，您应当看到签名串以及包含`v`、`r`和 `s`的签名数值。您可以复制这些数值，用于下个部分与调用许可预编译交互。

![Signature values in the console](/images/builders/pallets-precompiles/precompiles/call-permit/call-10.png)

## 与Solidity接口交互 {: #interact-with-the-solidity-interface }

现在您已经生成调用许可的签名，您将能够测试调用许可预编译的`dispatch`函数。

### 调度调用 {: #dispatch-a-call }

当您传送`dispatch`函数，您将需要与签署调用许可时所需的相同参数。开始操作之前，返回Remix中的**Deploy and Run**标签，并在**Deployed Contract**部分展开调用许可合约。请确认您已连接至您希望执行调用许可和支付交易费用的账户，随后跟随以下步骤：

1. 在**from**字段输入您希望用于签署调用许可的账户地址
2. 复制和粘贴`SetMessage.sol`的合约地址
3. 在**value**字段输入`0`
4. 为`set`函数输入函数选择器以及您希望为`SetMessage.sol`合约传送消息的十六进制表现方式，在本示例中我们可以使用`hello world`：

     ```
     0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000
     ```   
5. 在**gasLimit**字段输入`100000`
6. 在签署调用许可时输入`deadline` 
7. 复制在生成调用许可签名时获得的`v`数值并粘贴至**v**字段
8. 复制在生成调用许可签名时获得的`r`数值并粘贴至**r**字段
9. 复制在生成调用许可签名时获得的`s`数值并粘贴至**s**字段
10. 点击**transact**传送交易
11. MetaMask将跳出弹窗要求您确认交易

![Dispatch the call permit](/images/builders/pallets-precompiles/precompiles/call-permit/call-11.png)

当交易成功进行，您可以确认消息是否更新为`hello world`。您可以跟随以下步骤验证：

1. 展开`SetMessage.sol`合约
2. 点击**get**
3. 结果将会在函数下显示，并显示为`hello world`

![Verify the dispatch was executed as intended](/images/builders/pallets-precompiles/precompiles/call-permit/call-12.png)

恭喜您！您已经成功生成一个调用许可签名并代表签名者调用！