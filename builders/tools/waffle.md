---
title: Waffle
description: 通过此教程学习如何配置Waffle在本地运行的Moonbeam开发节点或Moonbase Alpha测试网上测试Solidity智能合约。
---

# Waffle

![Waffle Introduction](/images/waffle-mars/waffle-banner.png)
## 概览 {: #introduction } 

[Waffle](https://www.getwaffle.io/)是一个广泛使用的开发框架，用于编译、测试和部署Solidity智能合约。由于Moonbeam兼容以太坊，只需一些额外配置，您就可以如同在以太坊上开发一般，使用Waffle在Moonbeam上进行开发。

## 配置Waffle连接至Moonbeam {: #configure-waffle-to-connect-to-moonbeam } 

假设您已经有一个JavaScript或TypeScript项目，您可以输入以下指令安装Waffle：

```
npm install ethereum-waffle
```

想要配置Waffle以运行测试Moonbeam开发节点或Moonbase Alpha测试网，您需在您的测试中创建一个自定义提供者和添加网络配置：

=== "JavaScript"

    ```js
    describe ('Test Contract', () => {
      // Use custom provider to connect to Moonbase Alpha or Moonbeam development node
      const moonbaseAlphaProvider = new ethers.providers.JsonRpcProvider('{{ networks.moonbase.rpc_url }}');
      const devProvider = new ethers.providers.JsonRpcProvider('{{ networks.development.rpc_url }}');
    })
    ```

=== "TypeScript"

    ```typescript
    describe ('Test Contract', () => {
      // Use custom provider to connect to Moonbase Alpha or Moonbeam development node
      const moonbaseAlphaProvider: Provider = new ethers.providers.JsonRpcProvider('{{ networks.moonbase.rpc_url }}');
      const devProvider: Provider = new ethers.providers.JsonRpcProvider('{{ networks.development.rpc_url }}');
    })
    ```

## 分步教程 {: #tutorial }

如果您想获得更加详细的使用Waffle的分步教程，您可以查看在Moonbeam上使用[Waffle & Mars](/builders/interact/waffle-mars/)进行开发的详细教程。