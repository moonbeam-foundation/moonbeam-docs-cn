---
title: 与代理预编译交互
description: 如何使用Moonbeam代理Solidity预编译接口从Substrate的代理Pallet添加和移除代理账户。
keywords: solidity, ethereum, proxy, moonbeam, precompiled, contracts, substrate
---

# 与代理预编译交互

## 概览 {: #introduction }

Moonbeam上代理预编译允许账户设置代理账户以作为代表执行有限数量的操作，例如治理、质押或余额转移。

若一个用户想要为另一个用户提供执行有限数量操作的权限，传统方式只有将第一个账户的私钥提供给第二个账户才能实现。而Moonbeam包含了能够启用代理账户的[Substrate代理Pallet](/builders/pallets-precompiles/pallets/proxy){target=_blank}。代理帐户的作用是其提供了额外的安全层，可以为主帐户执行操作。举例来说，如果一个用户希望将其主账户安全存放于冷钱包中，同时仍想要访问钱包的部分功能（例如治理或质押），这是最好的选择。

**代理预编译仅可以从外部拥有账户（Externally Owned Account，EOA）或是[批量预编译](/builders/pallets-precompiles/precompiles/batch){target=_blank}调用。**

要了解关于代理账户的更多信息以及如何在无需使用代理预编译的情况下根据自身需求设置代理账户，请查看[设置代理账户](/tokens/manage/proxy-accounts){target=_blank}页面。

代理预编译位于以下地址：

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.proxy}}
     ```
=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.proxy}}
     ```
=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.proxy}}
     ```

--8<-- 'text/builders/pallets-precompiles/precompiles/security.md'

## 代理Solidity接口 {: #the-proxy-solidity-interface }

[`Proxy.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=_blank}是一个接口，通过Solidity合约可以与代理Pallet交互。您无需熟悉Substrate API，您可直接使用您所熟悉的以太坊接口与之交互。

接口包含以下函数：

 - **addProxy**(*address* delegate, *ProxyType* proxyType, *uint32* delay) - 达到特定的`delay`区块数量（一般为0）后，为发送者注册一个代理账户。若调用者的代理已存在，此函数将会失败
 - **removeProxy**(*address* delegate, *ProxyType* proxyType, *uint32* delay) - 为发送者移除已注册的代理
 - **removeProxies**() - 移除委托给发送者的所有代理账户
 - **isProxy**(*address* real, *address* delegate, *ProxyType* proxyType, *uint32* delay) - 若委托地址为`proxyType`类型的代理则返回布尔值`true`，地址`real`会有指定的`delay`

`proxyType`参数由以下`ProxyType`枚举定义，其中值从`0`开始，具有最宽松的代理类型，并由`uint8`值表示：

```solidity
enum ProxyType {
    Any,
    NonTransfer,
    Governance,
    Staking,
    CancelProxy,
    Balances,
    AuthorMapping,
    IdentityJudgement
}
```

## 代理类型 {: #proxy-types }

可以委托账户的代理角色有多种类型，其中通过`ProxyType`枚举在`Proxy.sol`中表示。以下列表包含所有可能的代理以及可以代表主账户执行的交易类型：

 - **Any** - 任何代理类型，将允许代理账户进行`Governance`、`Staking`、`Balances`和`AuthorMapping`代理类型可以执行的任何类型的交易。请注意，余额转移只允许EOA，而不允许合约或预编译
 - **NonTransfer** - 非转账代理，将允许代理账户通过`Governance`、`Staking`和`AuthorMapping`预编译执行任何类型的`msg.value`为0的交易
 - **Governance** - 治理代理，将允许治理账户执行任何治理类型的相关交易（包括民主或理事会Pallet）
 - **Staking** - 质押代理，将允许代理账户通过`Staking`预编译执行质押相关的交易，包括对`AuthorMapping`预编译的调用
 - **CancelProxy** - 取消代理，允许代理账户拒绝和移除延迟的主账户代理公告。目前，代理预编译尚未支持该操作
 - **Balances** - 余额代理，将允许代理账户仅执行余额转账至EOA
 - **AuthorMapping** - 此类型的代理账户仅供收集人使用，将服务从一个服务器迁移至另一个服务器
 - **IdentityJudgement** - 身份验证代理，将允许代理账户判断和验证波卡上账户相关的个人信息。目前，代理预编译尚未支持该操作

## 与Solidity接口交互 {: #interact-with-the-solidity-interface }

以下部分将介绍如何与Remix中的代理预编译进行交互。请注意，**代理预编译仅可以从外部拥有账户（Externally Owned Account，EOA）或是[批量预编译](/builders/pallets-precompiles/precompiles/batch){target=_blank}调用。**

### 查看先决条件 {: #checking-prerequisites }

以下示例在Moonbase Alpha上演示，步骤也同样适用于Moonbeam和Moonriver。首先，您需要准备以下内容：

 - 安装MetaMask并[连接至Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - 拥有DEV的账户。
 --8<-- 'text/_common/faucet/faucet-list-item.md'
 - 第二个账户，将作为代理账户（资金可选）

### Remix设置 {: #remix-set-up }

开始之前，获取[`Proxy.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=_blank}副本，并执行以下步骤：

1. 点击**File explorer**标签

2. 复制文件内容并粘贴至名为`Proxy.sol`的[Remix文件](https://remix.ethereum.org/){target=_blank}

![Copying and Pasting the Proxy Interface into Remix](/images/builders/pallets-precompiles/precompiles/proxy/proxy-1.png)

### 编译合约 {: #compile-the-contract }

1. 点击**Compile**标签（从上至下第二个）
2. 然后编译接口，点击**Compile Proxy.sol**

![Compiling Proxy.sol](/images/builders/pallets-precompiles/precompiles/proxy/proxy-2.png)

### 访问合约 {: #access-the-contract }

1. 在Remix的**Compile**下方，点击**Deploy and Run**标签。请注意，您不是在此处部署合约，而是访问一个已经部署的预编译合约
2. 确保在**ENVIRONMENT**下拉菜单中已选择**Injected Provider - Metamask**
3. 确保在**CONTRACT**下拉菜单中已选择**Proxy.sol**。因为这是一个预编译的合约，因此您无需部署，但是您需要在**At Address**字段中提供预编译的地址
4. 为Moonbase Alpha提供代理预编译的地址：`{{networks.moonbase.precompiles.proxy}}`并点击**At Address**
5. 代理预编译将出现在**Deployed Contracts**列表中

![Provide the address](/images/builders/pallets-precompiles/precompiles/proxy/proxy-3.png)

### 添加代理 {: #add-proxy }

若您的账户尚未设置代理，您可以通过代理预编译为您的账户添加代理。在本示例中，您将添加[余额](#:~:text=Balances)代理至账户。为此，您可以执行以下步骤：

1. 展开代理预编译合约，您可以看到可用的函数
2. 找到**addProxy**函数并点击按钮展开此部分
3. 在**delegate**一栏输入您的第二个账户地址，将**proxyType**设置为`5`，将**delay**设置为`0`
4. 点击**transact**按钮并在MetaMask确认交易

!!! 注意事项
    在Remix中构建交易时，**proxyType**表示为`uint8`，而不是预期的`ProxyType`枚举。在Solidity中，枚举被编译为`uint8`，因此当您将**proxyType**设置为`5`时，这将指示`ProxyType`枚举中的第6个元素，即余额代理。

![Call the addProxy function](/images/builders/pallets-precompiles/precompiles/proxy/proxy-4.png)

### 查看代理是否成功添加 {: #check-proxy } 

您可以确定一个帐户是否是主帐户的代理帐户。在此示例中，您将输入[上一部分添加的代理](#add-proxy)参数以确定代理帐户是否添加成功：

1. 找到**isProxy**函数并点击按钮展开此部分
2. 在**real**一栏输入您的主账户地址，在**delegate**一栏输入您的第二个账户地址，将**proxyType**设置为`5`，将**delay**设置为`0`
3. 点击**call**按钮

若一切无误，后台将输出`true`。

![Call the isProxy function](/images/builders/pallets-precompiles/precompiles/proxy/proxy-5.png)

### 移除代理 {: #remove-proxy }

您可以通过代理预编译将代理从您的账户移除。在本示例中，您将从您的代理账户移除[上一部分添加的余额代理](#add-proxy)。为此，您可以执行以下步骤：

1. 展开代理预编译合约，您可以看到可用的函数
2. 找到**removeProxy**函数并点击按钮展开此部分
3. 在**delegate**一栏输入您的第二个账户地址，将**proxyType**设置为`5`，将**delay**设置为`0`
4. 点击**transact**按钮并在MetaMask确认交易

交易确认之后，如果您重复 [查看代理是否成功添加](#check-proxy)步骤，结果将显示`false`。

![Call the removeProxy function](/images/builders/pallets-precompiles/precompiles/proxy/proxy-6.png)

这样就可以了！您已成功完成代理预编译。关于设置代理的其他参考资料可在[设置代理账户](/tokens/manage/proxy-accounts){target=_blank}页面和波卡文档库的[代理账户](https://wiki.polkadot.network/docs/learn-proxies){target=_blank}页面找到。若您有任何关于代理预编预方面的问题，欢迎随时在[Discord](https://discord.gg/moonbeam){target=_blank}上与我们取得联系。