---
title: 如何使用OpenZeppelin Defender
description:  通过此教程学习如何使用OpenZeppelin Defender在兼容以太坊的Moonbeam上安全地管理智能合约。
---

# OpenZeppelin Defender

![OpenZeppelin Defender Banner](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-banner.png)

## 概览 {: #introduction } 

[OpenZeppelin Defender](https://docs.openzeppelin.com/defender/){target=_blank}是基于网络的应用程序，让开发者可以通过安全的方式实现智能合约运行的自动化。Defender提供以下不同的组件：

 - [**Admin**](https://docs.openzeppelin.com/defender/admin){target=_blank} —— 实现所有智能合约运行过程的自动化，例如进入权限控制、升级、暂停等，并提供安全保障
 - [**Relay**](https://docs.openzeppelin.com/defender/relay){target=_blank} —— 通过具备私有中继器部署、安全的私有交易基础设施进行构建
 - [**Autotasks**](https://docs.openzeppelin.com/defender/autotasks){target=_blank} —— 创建自动化脚本，与智能合约交互
 - [**Sentinel**](https://docs.openzeppelin.com/defender/sentinel){target=_blank} —— 监控智能合约的事件、功能及交易，并通过邮件接收通知
 - [**Advisor**](https://docs.openzeppelin.com/defender/advisor){target=_blank} —— 学习并应用开发、测试、监控及运行等环节的最佳实践

OpenZeppelin Defender现已上线Moonbeam、Moonriver和Moonbase Alpha测试网。本教程将介绍如何使用Defender，并演示如何通过Admin组件暂停部署于Moonbase Alpha的智能合约，也可适用于Moonbeam和Moonriver。

如需了解更多信息，请参阅OpenZeppelin团队撰写的Defender[文档页面](https://docs.openzeppelin.com/defender/)。

## 开始使用Defender {: #getting-started-with-defender } 

本小节将介绍在Moonbase Alpha上开始使用OpenZeppelin的步骤。

### 检查先决条件 {: #checking-prerequisites } 

请确保安装[MetaMask](https://metamask.io/){target=_blank}，并已连接至Moonbase Alpha测试网。如果您还没有将MetaMask连接到测试网，请根据我们的[MetaMask整合教程](/integrations/wallets/metamask/){target=_blank}进行操作。

此外，您还需要登录[Defender](https://defender.openzeppelin.com/){target=_blank}网站并注册OpenZeppelin免费账户。

本教程使用的合约是在[智能合约升级教程](https://docs.openzeppelin.com/learn/upgrading-smart-contracts){target=_blank}中的`Box.sol`合约的拓展，是OpenZeppelin文档中抽取的合约。此外，本合约可升级、[可暂停](https://docs.openzeppelin.com/contracts/4.x/api/security#Pausable){target=_blank}，能够充分发挥Admin组件的优势。您可以使用以下代码进行合约部署，并根据[智能合约升级教程](https://docs.openzeppelin.com/learn/upgrading-smart-contracts){target=_blank}进行操作：

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract PausableBox is Initializable, PausableUpgradeable, OwnableUpgradeable {
    uint256 private value;
 
    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Initialize
    function initialize() initializer public {
        __Ownable_init();
        __Pausable_init_unchained();
    }
 
    // Stores a new value in the contract
    function store(uint256 newValue) whenNotPaused public {
        value = newValue;
        emit ValueChanged(newValue);
    }
 
    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
    
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
```

### 连接Defender {: #connecting-defender } 

注册了OpenZeppelin Defender账户以后，登录[Defender App](https://defender.openzeppelin.com/){target=_blank}。在主屏幕中，您将看到[MetaMask已连接到Moonbase Alpha](/getting-started/moonbase/metamask/){target=_blank}，点击右上角的**Connect wallet**（连接钱包）按钮：

![OpenZeppelin Defender Connect](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-1.png)

如果操作成功，您可以看到自己的地址，并显示**Connected to Moonbase Alpha**（已连接到Moonbase Alpha）。

## 使用Admin组件 {: #using-the-admin-component } 

本小节将介绍如何使用OpenZeppelin Defender Admin组件管理Moonbase Alpha上的智能合约。

### 导入合约 {: #importing-your-contract } 

使用Defender Admin的第一步是添加需管理的合约。点击右上角附近的**Add contract**（添加合约）按钮，进入**import contract**（导入合约）页面，然后进行以下操作：

 1. 设置合约名称（仅用于显示）
 2. 选择需管理合约所在的网络。如果该合约已经以相同地址部署到多个网络中，这一步将尤其有用。在这一示例中，输入`Moonbase Alpha`
 3. 输入合约地址
 4. 粘贴合约ABI。可以通过[Remix](/builders/tools/remix/){target=_blank}或者在编译过程（例如在Truffle或HardHat）中创建的`.json`文件中找到
 5. 检查合约功能是否被正确识别
 6. 检查所有信息后，点击**Add**（添加）按钮

![OpenZeppelin Defender Admin Add Contract](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-2.png)

导入成功后，就可以在Admin组件主界面看到该合约：

![OpenZeppelin Defender Admin Contract Added](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-3.png)

### 创建合约提案 {: #create-a-contract-proposal } 

提案指的是合约即将执行的行动。截至本文撰写时，该合约已产生三个主要提案/行动：

- **Pause** —— 检测到暂停功能后可用。可暂停代币转移、铸造及销毁
- **Upgrade** —— 检测到升级功能后可用。[可通过代理合约对合约进行升级](https://docs.openzeppelin.com/learn/upgrading-smart-contracts){target=_blank}
- **Admin action** —— 可调用受管理合约的任何函数

在本示例中，我们创建了一个新提案，提案内容为暂停合约。为此，需要进行以下操作：

 1. 点击**New proposal**（新建提案）按钮，显示所有选项
 2. 点击**Pause**（暂停）

![OpenZeppelin Defender Admin Contract New Pause Proposal](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-4.png)

提案页面将打开，显示所有需要填写的提案相关信息。在本示例中，需要提供以下信息：

 1. Admin账户地址。如果想通过现有钱包（在获得所有必要许可的前提下）运行，该提案这一字段可以留空
 2. 提案名称
 3. 提案描述。为合约的其他成员/管理员提供的信息越详细越好（若使用多重签名钱包）
 4. 点击**Create pause proposal**（创建暂停提案）

![OpenZeppelin Defender Admin Contract Pause Proposal Details](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-5.png)

成功创建提案后，提案将显示在合约管理员主面板上。

![OpenZeppelin Defender Admin Contract Proposal List](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-6.png)

### 同意合约提案 {: #approve-a-contract-proposal } 

创建合约提案后，下一步是同意并执行提案。进入提案，并点击**Approve and Execute**（同意并执行）。

![OpenZeppelin Defender Admin Contract Proposal Pause Approve](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-7.png)


通过这一步骤将创建一笔交易，需要使用MetaMask签名。此后提案状态将改为**Executed（confirmation pending)**。交易被处理后，状态将显示为**Executed**（已执行）。

![OpenZeppelin Defender Admin Contract Proposal Pause Executed](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-8.png)

合约状态也将从**Running**（运行中）变为**Paused**（已暂停）。现在您已学会如何使用Admin组件管理智能合约了。

--8<-- 'text/disclaimers/third-party-content.md'