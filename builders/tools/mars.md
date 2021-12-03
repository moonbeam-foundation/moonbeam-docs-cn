---
title: Mars
description: 通过此教程学习如何配置Mars在Moonbeam开发节点或Moonbase Alpha测试网上部署Solidity智能合约。
---

# Mars

![Mars Introduction](/images/builders/tools/eth-dev-env/mars-banner.png)
## 概览 {: #introduction }

[Mars](https://github.com/EthWorks/Mars)是用于部署Solidity智能合约的一种新的基础设施即代码的开发工具。Mars使编写高级部署脚本变得轻而易举，并可为管理开发者提供状态更改，确保开发者部署永远处于最新版本。由于Moonbeam兼容以太坊，您可以如同在以太坊开发一般使用Mars在Moonbeam上进行开发。您仅需要切换网络到希望部署的网络即可。

## 配置Mars连接至Moonbeam {: #configure-mars-to-connect-to-moonbeam } 

假设您已经有一个JavaScript或TypeScript项目，您可以输入以下指令安装Mars：

```
npm install ethereum-mars
```

如果想配置Mars以部署至Moonbeam开发节点或是Moonbase Alpha测试网，请在部署脚本内新增以下网络配置：

```typescript
import { deploy } from 'ethereum-mars';
const privateKey = "<insert-your-private-key-here>";
// For Moonbeam development node
deploy({network: '{{ networks.development.rpc_url }}', privateKey},(deployer) => {
  // Deployment logic will go here
});
// For Moonbase Alpha
deploy({network: '{{ networks.moonbase.rpc_url }}', privateKey},(deployer) => {
  // Deployment logic will go here
});
```

## 分步教程 {: #tutorial }

如果您想获得更加详细的使用Mars的分步教程，您可以查看在Moonbeam上使用[Waffle & Mars](/builders/interact/waffle-mars/)进行开发的详细教程。

