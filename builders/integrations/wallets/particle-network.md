---
title: 将Particle Network集成至DApp
description: 学习如何将Particle Network的智能钱包即服务集成至Moonbeam上的dApp中，从而实现基于MPC入门和ERC-4337账户抽象交互。
---

# Particle Network的智能钱包即服务

## 概览 {: #introduction }

[Particle Network](https://particle.network/){target=\_blank}是一个[智能钱包即服务](https://docs.particle.network/getting-started/smart-wallet-as-a-service){target=\_blank}提供商，它允许开发者通过使用可定制的模块化外部拥有账户（Externally Owned Account，简称EOA）和[账户抽象（Account Abstraction，简称AA）](https://docs.particle.network/developers/account-abstraction){target=\_blank}嵌入式钱包组件来提升用户体验。

Particle智能钱包即服务堆栈的其中一个重要组件是[Particle Auth](https://docs.particle.network/developers/auth-service){target=\_blank}，该组件可通过用户熟悉的Web2账户（例如谷歌账户、邮箱地址和电话号码）简化用户入门流程。这是通过使用[基于多方计算的阈值签名方案（MPC-TSS）](https://docs.article.network/developers/auth-service){target=\_blank}技术进行密钥管理来实现的。

想要了解关于Particle堆栈的完整版介绍，请参考Particle的博客文章：[介绍Particle智能钱包即服务模块化堆栈](https://blog.particle.network/announcing-our-smart-wallet-as-a-service-modular-stack-upgrading-waas-with-erc-4337/){target=\_blank}。

Particle通过标准EOA交互和原生[ERC-4337](https://eips.ethereum.org/EIPS/eip-4337){target=\_blank} SimpleAccount实现支持Moonbeam、Moonriver和Moonbase Alpha测试网，从而促进全堆栈账户抽象。

具体来说，Particle Network的Moonbeam集成由以下组件组成：

- Particle Network [Wallet-as-a-Service](https://docs.particle.network/getting-started/smart-wallet-as-a-service){target=\_blank} - 这是一个由Particle Network提供的钱包即服务旗舰产品，支持由MPC-TSS支持的应用程序嵌入式钱包，从而实现无缝且类似Web2入门和交互的体验。
- Particle Network Modular [AA Stack](https://docs.particle.network/developers/account-abstraction){target=\_blank} - 除了以EOA为中心的基本交互之外（此交互默认情况下通过Particle的钱包即服务实现），Particle还具有原生模块化账户抽象堆栈，用于Moonbeam上ERC-4337账户抽象的实现。这意味着在构建支持账户抽象的应用程序时，您可以将智能账户、bundler和paymaster与Particle的钱包即服务结合使用，从而获得固有的灵活性

![Particle Network Smart WaaS map](/images/builders/integrations/wallets/particle/particle-1.webp)

本教程中，我们将展示使用Particle Network的智能钱包即服务的分步教程。

## 创建应用程序 {: #create-an-application }

要在Moonbeam上使用Particle Network的智能钱包即服务，首先您需要通过在[Particle Network数据面板](https://dashboard.particle.network)创建账户并启动应用程序。

1. 前往Particle Network数据面板，然后注册或登录

    ![Dashboard login](/images/builders/integrations/wallets/particle/particle-2.webp)

2. 登陆后，点击**Add New Project**创建新项目

    ![Project creation](/images/builders/integrations/wallets/particle/particle-3.webp)

3. 输入项目名称并点击**Save**保存

    ![Application creation](/images/builders/integrations/wallets/particle/particle-4.webp)

4. 在项目的数据面板处，往下滑动找到**Your Apps**部分，选择**iOS**、**Android**或**Web**并提供要求的信息以创建新的App

    ![Application creation](/images/builders/integrations/wallets/particle/particle-5.webp)

5. 最后，复制**Project ID**、**Client Key**和**App ID**

    ![Application dashboard](/images/builders/integrations/wallets/particle/particle-6.webp)

## 安装依赖项 {: #install-dependencies }

要将Particle Network集成至Moonbeam，您需要安装一系列的依赖项，具体取决于您是否要完全使用Particle的钱包即服务生成的默认EOA，或使用附加的智能账户。

无论是使用EOA还是智能合约，都需要先安装`@particle-network/auth`。

=== "npm"

    ```bash
    npm install @particle-network/auth
    ```

=== "yarn"

    ```bash
    yarn add @particle-network/auth
    ```

如果您想要原生使用ERC-4337账户抽象，还需要安装`@particle-network/aa`。

=== "npm"

    ```bash
    npm install @particle-network/aa
    ```

=== "yarn"

    ```bash
    yarn add @particle-network/aa
    ```

创建抽象账户后，您需要将其传给提供商。您可以使用Particle或任何EVM钱包提供商。如果您使用的是Particle提供商，您需要安装`@particle-network/provider`。

=== "npm"

    ```bash
    npm install @particle-network/provider
    ```

=== "yarn"

    ```bash
    yarn add @particle-network/provider
    ```

## 配置Particle Network {: #configure-particle-network }

创建好应用程序并安装完依赖项后，您可以开始配置项目了。

配置项目需要执行以下步骤：

1. 从 [`@particle-network/auth`](https://docs.particle.network/developers/auth-service/sdks/web){target=\_blank}导入[`ParticleNetwork`](https://docs.particle.network/developers/auth-service/sdks/web#step-2-setup-developer-api-key){target=\_blank}
2. 您将在下一个步骤用到Moonbeam的链名称和ID，因此您需要先从[`@particle-network/chains`](https://docs.particle.network/developers/other-services/node-service/evm-chains-api){target=\_blank}导入`Moonbeam`
3. 使用您的项目凭据以及Moonbeam的链名称和ID初始化`ParticleNetwork`，并且您可以在这里选择配置钱包显示和安全设置

    !!! 注意事项
        您可以使用[dotenv](https://www.dotenv.org/){target=\_blank}安全存储您的项目凭证。

```js
--8<-- 'code/builders/integrations/wallets/particle/configure-particle.js'
```

## 创建ERC-4337账户抽象 {: #create-erc-4337-account-abstraction }

如果您想要使用ERC-4337账户抽象，您需要执行一些额外的步骤：

1. 从[`@particle-network/aa`](https://docs.particle.network/developers/account-abstraction/sdks/web){target=\_blank}和[`@particle-network/auth`](https://docs.particle.network/developers/auth-service/sdks/web){target=\_blank}导入`SmartAccount`
2. 使用您在上述步骤创建的`particle`实例，初始化`ParticleProvider`以处理钱包连接请求
3. 使用提供商、项目凭证以及账户抽象实现和配置来初始化[`SmartAccount`](https://docs.particle.network/developers/account-abstraction/sdks/web#initialize-the-smartaccount){target=\_blank}。对于Moonbeam来说，您需要使用`simple`实现并传入Moonbeam链ID
4. 启用ERC-4337模式，指定`SIMPLE`实现

```js hl_lines="3 4 21-34 37-40"
--8<-- 'code/builders/integrations/wallets/particle/configure-aa.js'
```

到现在为止，您已经注册并创建了一个应用程序，安装了所有所需依赖项，同时配置了`ParticleNetwork`和`SmartAccount`（若适用）。

### 包装EIP-1193提供商 {: #create-a-custom-provider }

如果您要与[Ethers.js](https://docs.ethers.org/){target=\_blank}或[Web3.js](https://docs.web3js.org/){target=\_blank}等以太坊库交互，您可以将账户抽象包装在自定义的提供商中。

为此，您需要执行以下步骤：

1. 从`'@particle-network/aa'`导入[`AAWrapProvider`](https://docs.particle.network/developers/account-abstraction/sdks/web#initialize-the-smartaccount){target=\_blank}
2. 自行选择导入所需要的库
3. 使用上述步骤中创建的账户抽象初始化`AAWrapProvider`
4. 使用所选择的库和`AAWrapProvider`包装EIP-1193提供商

=== "Ethers.js"

    ```js hl_lines="4 5 44 45"
    --8<-- 'code/builders/integrations/wallets/particle/custom-ethers-provider.js'
    ```

=== "Web3.js"

    ```js hl_lines="4 5 44 45"
    --8<-- 'code/builders/integrations/wallets/particle/custom-web3-provider.js'
    ```

## 使用示例 {: #example-of-utilization }

完成上述操作后，您可以根据上述类似步骤使用Particle Network，如下方示例应用程序所示：

具体来说，该应用程序通过社交登录在Moonbeam主网上创建一个智能账户，然后使用该应用程序发送一笔0.001 GLMR的测试交易。

```js
--8<-- 'code/builders/integrations/wallets/particle/example-app.js'
```

要查看包含上述代码的完整演示代码库，请访问[particle-moonbeam-demo GitHub repository](https://github.com/TABASCOatw/particle-moonbeam-demo){target=\_blank}。

这就是关于Particle智能钱包即服务堆栈以及如何在Moonbeam上开始使用Particle的简要介绍。想要了解更多信息，请参考[Particle Network文档网站](https://docs.particle.network){target=\_blank}。

--8<-- 'text/_disclaimers/third-party-content.md'
