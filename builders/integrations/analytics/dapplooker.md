---
title: Dapplooker
description: 使用Dapplooker分析和查询链上数据，并创建数据面板为Moonbeam和Moonriver可视化数据分析。
---

# 开始使用Dapplooker

![Dapplooker Banner](/images/builders/integrations/analytics/dapplooker/dapplooker-banner.png)

## 概览 {: #introduction }

Moonriver和Moonbeam上的开发者可以使用[Dapplooker](https://dapplooker.com/){target=_blank}平台分析其链上数据并运行SQL查询。此集成使项目能够创建图表和数据面板以追踪其智能合约并提供性能和采用方面的反馈。

Dapplooker分析平台协助基于Moonbeam的网络，帮助用户无需依赖工程师或分析师即可理解智能合约。Dapplooker直观的Visual SQL有助于以表格形式浏览智能合约数据，并使用易于使用的编辑器编写SQL查询。用户可以创建、分叉和与所有人共享数据面板。

本教程将涵盖通过Dapplooker平台注册项目所需的所有详情以及如何使用SQL编辑器构建分析。本教程适用于Moonbeam、Moonriver和Moonbase Alpha网络。

--8<-- 'text/disclaimers/third-party-content-intro.md'

## 查看先决条件 {: #checking-prerequisites }

在开始操作之前，您将需要创建一个Dapplooker账户。您可以[点击此处注册](https://dapplooker.com/signup){target=blank}并创建一个账户。如果您已注册，您可以直接[点击此处登录](https://dapplooker.com/login){target=blank}您的账户。

![Login to Dapplooker](/images/builders/integrations/analytics/dapplooker/dapplooker-1.png)

## 连接智能合约 {: #connect-smart-contracts }

要将智能合约连接至Dapplooker，您可以点击页面上方的**My Projects**按钮。

在**Register Your Project**页面，点击**Connect Dapp**，然后选择**Connect Smart Contract**选项。您也可以从菜单栏中浏览和运行已编入索引的DApp分析。

![Connect dapp](/images/builders/integrations/analytics/dapplooker/dapplooker-2.png)

随后，系统将提示您输入您项目和合约的详情：

1. 输入您的项目名称

2. 输入您项目运行所在的网络。网络可以选择**Moonbeam**、**Moonriver**或**Moonbase Alpha**

3. 如果您有多个相同合约的实例，你可以启动按钮

4. 输入您的合约地址。如果合约地址已在[Moonscan](https://moonscan.io/){target=_blank}验证，将在启动自动完成时出现。您可以在自动完成处选择合约地址。如果在自动完成时未出现合约地址，您可以输入您的合约地址，点击 **+** 按钮，然后点击上传按钮上传ABI

5. 输入您项目的网站

6. 上传您项目的Logo

7. 点击**Register**后智能合约事务事件数据将开始同步。同步完整的数据可能需要一段时间

![Register your dapp](/images/builders/integrations/analytics/dapplooker/dapplooker-3.png)

完成同步后，您将收到邮件通知。点击邮件中的链接将直接跳转至您的索引数据。

## 连接Subgraphs {: #connect-subgraphs }

要将subgraph连接至Dapplooker，您可以点击页面上方的**My Projects**按钮。

在**Register Your Project**页面，点击**Connect Dapp**，然后选择**Connect Subgraph**选项。您也可以从菜单栏中浏览和运行已编入索引的DApp分析。

![Connect dapp](/images/builders/integrations/analytics/dapplooker/dapplooker-4.png)

随后，系统将提示您输入您项目和subgraph的详情：

1. 输入您的项目名称

2. 输入您项目运行所在的网络。网络可以选择**Moonbeam**、**Moonriver**或**Moonbase Alpha**

3. 输入您的DApp subgraph端点

4. 输入您项目的网站

5. 上传您项目的Logo

6. 点击**Register**后subgraph实体数据将开始同步。同步完整的数据可能需要一段时间

![Register your dapp](/images/builders/integrations/analytics/dapplooker/dapplooker-5.png)

完成同步后，您将收到邮件通知。点击邮件中的链接将直接跳转至您的索引数据。

## 创建图表和数据面板 {: #create-charts-dashboards }

要开始创建图表可视化您的数据，您可以点击页面上方的**Create a Chart**。根据您的需求选择创建**Simple chart（简化图表）**、**Custom chart（自定义图表）**或者**Native query（本地查询）**图表。关于创建各类图表的更多信息，请参考[Dapplooker文档网站创建图表页面](https://dapplooker.notion.site/Create-Charts-2ab63e91f4a04dab8b06dfbedb72730e){target=_blank}。

如果您有兴趣创建一个数据面板，您可以点击页面上方的**Browse Data**。然后，点击**+**按钮，选择**New dashboard**。关于创建数据面板的更多信息，请参考[Dapplooker文档网站创建数据面板页面](https://dapplooker.notion.site/Create-Dashboards-61981cf5fde54d32a905eef59491c108){target=_blank}。

您可以在私人或公共文件夹中发布图表和数据面板。任何人均可访问公共图表和数据面板。您可以从公共图表复制、编辑和创建新的图表和数据面板。

## 示例图表和数据面板 {: #example-dashboards }

有一系列的图表和数据面板供您查看并构建自己的Moonbeam和Moonriver图表和数据面板。开始之前您可以先参考[Moonbeam Network Collection](https://analytics.dapplooker.com/collection/323-moonbeam-network-collection){target=blank}或[Moonriver Network Collection](https://analytics.dapplooker.com/collection/79-moonriver-network-collection){target=blank}。您可以在这两个网站轻松找到可以编辑的公共图表和数据面包的列表。

在开始编辑任何图表或数据面板之前，您可以点击右上角**Summarize**按钮和刷新图标中间的列表图标。这将带您进入编辑页，您可在此处自定义预先存在的数据。任何修改将不会自动保存，您需要手动点击**Save**才可应用您所修改的图表或数据面板。关于编辑和创建图表或数据面板的更多信息，请参考[Dapplooker文档网站](https://dapplooker.notion.site/Features-24c6faca79a847e4ae499e907784bbfc){target=_blank}。

您还可以在[Moonbeam Staking dashboards](https://analytics.dapplooker.com/browse/2/schema/moonbeam){target=blank}和[Moonriver Staking dashboards](https://analytics.dapplooker.com/browse/2/schema/moonriver){target=blank}列表查看和构建数据。

### 常用数据面板 {: #popular-dashboards }

- [Moonbeam Staking Dashboard](https://network.dapplooker.com/moonbeam/collator){target=_blank} —— Moonbeam上为收集人和委托人提供的包含APY数据的质押数据面板
- [Moonriver Staking Dashboard](https://network.dapplooker.com/moonriver/collator){target=_blank} —— Moonriver上为收集人和委托人提供的包含APY数据的质押数据面板
- [Dapplooker Explorer for Moonbeam](https://dapplooker.com/category/moonbeam?type=dashboard){target=_blank} —— 搜索Moonbeam上的常用数据面板
- [Dapplooker Explorer for Moonriver](https://dapplooker.com/category/moonriver?type=dashboard){target=_blank} —— 搜索Moonriver上的常用数据面板

--8<-- 'text/disclaimers/third-party-content.md'