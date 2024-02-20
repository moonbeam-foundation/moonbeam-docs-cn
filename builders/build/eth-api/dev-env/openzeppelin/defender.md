---
title: 如何使用OpenZeppelin Defender
description:  通过此教程学习如何使用OpenZeppelin Defender在兼容以太坊的Moonbeam上安全地管理智能合约。
---

# OpenZeppelin Defender

## 概览 {: #introduction }

[OpenZeppelin Defender](https://docs.openzeppelin.com/defender/){target=\_blank}是基于网络的应用程序，让开发者可以通过安全的方式实现智能合约运行的自动化。Defender V2提供以下组件：

 - [**Code Inspector**](https://defender.openzeppelin.com/v2/#/code){target=_blank} — 由OpenZeppelin工程师开发的自动代码分析AI模型和工具
 - [**Audit**](https://defender.openzeppelin.com/v2/#/audit){target=_blank} — 管理智能合约审计过程，跟踪问题和解决方案
 - [**Deploy**](https://defender.openzeppelin.com/v2/#/deploy){target=_blank} — 管理部署和升级，确保发布安全
 - [**Monitor**](https://defender.openzeppelin.com/v2/#/monitor){target=_blank} — 监控智能合约的事件、功能和交易，并通过电子邮件接收通知
 - [**Incident Response**](https://defender.openzeppelin.com/v2/#/incident-response){target=_blank} — 配置预定义的事件响应场景，可由监控器自动触发或人工触发
 - [**Actions**](https://defender.openzeppelin.com/v2/#/actions/automatic){target=_blank} — 创建自动 Action，以执行链上或链下操作
 - [**Access Control**](https://defender.openzeppelin.com/v2/#/access-control/contracts){target=_blank} — 轻松管理智能合约账户、角色和权限

OpenZeppelin Defender现已上线Moonbeam、Moonriver和Moonbase Alpha测试网。本教程将介绍如何使用Defender，并演示如何通过OpenZeppelin的 Action 与 Access Control 组件暂停部署于Moonbase Alpha的智能合约，也可适用于Moonbeam和Moonriver。

如需了解更多信息，请参阅OpenZeppelin团队撰写的Defender[文档页面](https://docs.openzeppelin.com/defender/)。

## 开始使用Defender {: #getting-started-with-defender }

本小节将介绍在Moonbase Alpha上开始使用OpenZeppelin的步骤。

### 检查先决条件 {: #checking-prerequisites }

请确保安装[MetaMask](https://metamask.io/){target=\_blank}，并已连接至Moonbase Alpha测试网。如果您还没有将MetaMask连接到测试网，请根据我们的[MetaMask整合教程](/builders/integrations/wallets/metamask/){target=\_blank}进行操作。

此外，您还需要登录[Defender](https://defender.openzeppelin.com/v2/#/overview){target=_blank}网站并注册OpenZeppelin免费账户。

### 部署可暂停合约Box {: #deploying-the-pauseable-box-contract }

本教程使用的合约是在[智能合约升级教程](https://docs.openzeppelin.com/learn/upgrading-smart-contracts){target=\_blank}中的`Box.sol`合约的拓展，是OpenZeppelin文档中抽取的合约。此外，本合约可升级、[可暂停](https://docs.openzeppelin.com/contracts/4.x/api/security#Pausable){target=\_blank}，能够充分发挥Admin组件的优势。您可以使用以下代码进行合约部署，并根据[智能合约升级教程](https://docs.openzeppelin.com/learn/upgrading-smart-contracts){target=\_blank}进行操作：

```solidity
--8<-- 'code/builders/build/eth-api/dev-env/openzeppelin/PausableBox.sol'
```

!!! 注意事项
    使用Remix或其他工具（例如Hardhat）部署完上述合约后，您需要调用 `initialize` 函数来正确设置可升级合约的所有者。如果您不调用此函数，所有

## 使用Access Control组件 {: #using-the-access-control-component }

本节将引导您使用[OpenZeppelin Defender的访问控制（Access Control）组件](https://defender.openzeppelin.com/v2/#/access-control/contracts){target=_blank} 在Moonbase Alpha上管理智能合约。

### 导入合约 {: #importing-your-contract }

使用Defender访问控制的第一步是添加您想要管理的合约。请按照以下步骤操作：

 1. 点击 **Access Control** 菜单项 
 2. 点击 **Add Contract**
 3. 为您的合约添加一个名称
 4. 选择部署合约的 **Network** 。这个演示中我们选择Moonbase Alpha
 5. 粘贴合约地址
 6. 如果您的合约已被验证，它的ABI将自动导入，否则需要在这粘贴合约ABI。合约ABI可以在[Remix](https://remix.ethereum.org/){target=_blank}中获取，也可以在编译过程后（例如Hardhat）创建的 `.json` 文件中找到
 7. 检查完所有信息后，单击 **Create** 按钮

 ![OpenZeppelin Defender Access Control Add Contract](/images/builders/build/eth-api/dev-env/openzeppelin/defender/new/oz-defender-1.png)

如果一切都成功导入，您应该在 **Access Control Contracts** 主屏幕上看到您的合约。您应该在 **Owner** 字段中看到用于部署可暂停 Box 合约的地址。如果您看到`0x0000000000000000000000000000000000000000`，这意味着您在部署可暂停Box合约后没有调用 `initialize` 函数。并且为了简化后续步骤，请将您的地址添加到Defender地址簿中。方法是将鼠标悬停在 **Owner** 字段中的地址上，然后单击 **Import into Defender 2.0**。

 ![OpenZeppelin Defender Access Control Contract Added](/images/builders/build/eth-api/dev-env/openzeppelin/defender/new/oz-defender-2.png)


然后，您可以按照以下步骤将您的地址添加到Defender地址簿：

1. 为您的地址输入名称
2. 选择地址所属的网络
3. 粘贴地址
4. 查看所有信息并点击 **Create**

![OpenZeppelin Defender Manage Address Book](/images/builders/build/eth-api/dev-env/openzeppelin/defender/new/oz-defender-3.png)

### 创建合约提案 {: #create-a-contract-proposal }

提案指的是合约即将执行的行动。您可以提案运行合约中的任何函数，包括但不限于：

- **Pause** —— 检测到暂停功能后可用。可暂停代币转移、铸造及销毁
- **Upgrade** —— 检测到升级功能后可用。[可通过代理合约对合约进行升级](https://docs.openzeppelin.com/learn/upgrading-smart-contracts){target=\_blank}
- **Admin action** —— 可调用受管理合约的任何函数

在本示例中，我们创建了一个新提案，提案内容为暂停合约。为此，需要进行以下操作：

 1. 点击 **Actions** 菜单项 
 2. 点击 **Transaction Proposals**
 3. 输入提案名称
 4. 输入提案描述，此为可选
 5. 从[imported contracts](#importing-your-contract)下拉列表中选择目标合约
 6. 选择作为提案一部分来执行的函数
 7. 选择所需的审批流程。为了演示，我们将在下一步创建一个只有所有者才能参与的简单审批流程

![OpenZeppelin Defender Actions New Pause Proposal](/images/builders/build/eth-api/dev-env/openzeppelin/defender/new/oz-defender-4.png)

要创建一个简单的，只有合约所有者才能参与的新审批流程，请执行以下步骤：

 1. 输入审批流程名称
 2. 选择 **EOA**
 3. 选择Box可暂停合约的所有者
 4. 查看所有信息并按 **Save Changes**

![OpenZeppelin Defender Actions Create Approval Process](/images/builders/build/eth-api/dev-env/openzeppelin/defender/new/oz-defender-5.png)

最后一步是提交交易提案。执行以下步骤：

1. 点击 **Connect Wallet** 并将您的EVM账户连接到Defender
2. 点击 **Submit Transaction Proposal**

### 同意合约提案 {: #approve-a-contract-proposal }

点击 **Continue**，您将访问提案状态页面。在这里您可以执行提案。点击 **Approve and Execute**，并在您的EVM钱包中确认交易。一旦交易处理完成，状态应显示为 **Executed**。

![OpenZeppelin Defender Actions Contract Proposal Pause Approve and Execute](/images/builders/build/eth-api/dev-env/openzeppelin/defender/new/oz-defender-7.png)

如果一切顺利，您的Box可暂停合约现在已被暂停。如果您想尝试其他场景，您可以尝试创建取消暂停合约的提案。

恭喜！您现在已经掌握了如何使用OpenZeppelin Defender在Moonbeam网络上管理智能合约。如需了解更多信息，您可以查看[OpenZeppelin Defender 文档](https://docs.openzeppelin.com/defender/v2/){target=_blank}. 

--8<-- 'text/_disclaimers/third-party-content.md'
