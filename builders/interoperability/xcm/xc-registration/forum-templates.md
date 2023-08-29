---
title: XCM集成的论坛模板
description: 学习如何在创建一个与Moonbeam的跨链集成时，撰写您需要在Moonbeam社区论坛上发布的两篇帖子
---

# XCM集成的Moonbeam社区论坛模板

![Forum Templates Banner](/images/builders/interoperability/xcm/xc-registration/forum-templates/forum-banner.png)

## 概览 {: #introduction }

在Moonriver或Moonbeam主网上启动XCM集成时，必须在[Moonbeam社区论坛](https://forum.moonbeam.foundation/){target=_blank}上发布两个初步帖子，以便投票社区能够拥有提供反馈的机会。这两个初步帖子是XCM公开帖子和XCM提案帖子。**连接到Moonbase Alpha时无需执行此步骤。**

如果仅注册资产，则跨链通道必须已经建立，因此只需要发布XCM提案即可注册资产。

建议在实际提案在链上提交之前五天完成，以便为社区反馈提供时间。

## XCM公开帖子 {: #xcm-disclosure }

应发布的第一个帖子是[XCM公开类别](https://forum.moonbeam.foundation/c/xcm-hrmp/xcm-disclosures/15){target=_blank}中的关键信息，其中突出显示了关键内容对参与投票的社区成员的决定很重要的信息。仅在建立XCM集成时才需要这篇文章；如果集成已经存在并且您只需要注册资产，而不需要发布帖子。

当您点击**New Topic**按钮后，系统会提供一个模板，其中包含要填写的相关信息。请使用Moonbeam/Moonriver标签，具体使用取决于您要集成的网络。

在帖子中，请提供以下信息：

- **标题** - XCM公开信息：*您的网络名称*
- **网络信息** - 简单以一句话概括您的网络，以及提供您的官网、Twitter以及其他社群媒体链接

您同样需要提供以下问题的答案：

- 区块链网络代码是否开源？如是，请提供GitHub链接。如否，请提供解释说明
- 网络SUDO是否关闭？如果为关闭SUDO，网络是否被指定地址群体掌控？
- 网络的集成是否已经在Moonbase Alpha测试网进行完整测试？
- （仅用于Moonbeam HRMP提案）您的网络是否具有Kusama部署？如是，请提供其网络名称以及该网络是否与Moonriver集成
- 区块链网络代码是否经过审计？如是，请提供：
  - 审计者名称
  - 审计报告的发布日期
  - 审计报告的链接

## XCM提案帖子 {: #xcm-proposals }

第二个帖子是[XCM提案类别](https://forum.moonbeam.foundation/c/xcm-hrmp/xcm-proposals/14){target=_blank}中提案的初步草案。一旦提案在链上提交并可供投票，您还必须在[Moonbeam Polkassembly](https://moonbeam.polkassembly.io/opengov){target=_blank}或[Moonriver Polkassembly](https://moonriver.polkassembly.io/opengov){target=_blank}中为其添加描述。

点击**New Topic**按钮后，系统会提供一个模板，其中包含要填写的相关信息。请使用Moonbeam或Moonriver标签，具体取决于您要集成的网络。

在Moonbeam XCM提案论坛帖子和在Polkassembly中，请添加以下部分和信息：

- **标题** — *您的网络名称*提案以开启通道和注册*资产_名称*。如果您仅注册资产，您可以使用*您的网络名称*提案以注册*资产_名称*
- **概览** — 一句话概括整个提案
- **网络信息** — 一句话概括您的网络以及提供您的官网、Twitter和其他社群媒体渠道的链接
- **总结** — 提案内容的简单描述
- **链上提案参考** — 如果为Moonbeam或是Moonriver提案，添加提案编码和提案哈希
- **技术细节** — 提供社区能够理解的技术信息以及提案的目的
- **额外信息** — 任何您希望让社区知道的额外信息
