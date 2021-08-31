---
title: 整合MetaMask
description: 学习如何在Moonriver（Moonbeam在Kusama上的部署）上使用MetaMask。本教程将教您如何将默认安装的MetaMask的连接至Moonriver。
---

# 如何将MetaMask连接至Moonriver

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/ywpc1UwpIyg' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>In this video, we'll show you how to connect your MetaMask wallet to the Moonriver network</a></div>

## 概览 {: #introduction } 

本教程列出了将MetaMask连接至Moonriver所需的步骤。相比此前的MetaMask教程，本篇简单易懂许多，因为您不需要连接到一个本地运行的Moonbeam节点上。我们开始吧。

如果您已成功安装MetaMask，可直接连接MetaMask至Moonriver：

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonriver">连接MetaMask</a>
</div>

!!! 注意事项
    MetaMask将会跳出一个弹窗要求您将Moonriver添加为自定义网络。当您同意后，MetaMask将会把当下的网络切换至Moonriver。

--8<-- 'text/common/create-metamask-wallet.md'

## 连接至Moonriver {: #connecting-to-moonriver } 

当您成功创建或是导入钱包之后，您会看见MetaMask的主界面。此时，请点击右上角的Logo然后进入Setting (设置)。

![MetaMask3](/images/testnet/testnet-metamask3.png)

进入左侧Networks的标签并点击“Add Network (添加网络) ”按钮。

![MetaMask4](/images/testnet/testnet-metamask4.png)

在对应空格复制粘贴下列信息，并点击Save (保存)：

 - Network Name: `Moonriver`
 - RPC URL: `{{ networks.moonriver.rpc_url }}`
 - ChainID: `{{ networks.moonriver.chain_id }}`
 - Symbol (Optional): `MOVR`
 - Block Explorer (Optional): `{{ networks.moonriver.block_explorer }}`

![Add Moonriver to MetaMask](/images/moonriver/moonriver-integrate-metamask-1.png)

恭喜！您已经成功将MetaMask连接至Moonriver（Moonbeam在Kusama上的部署）了。

![MetaMask connected to Moonriver](/images/moonriver/moonriver-integrate-metamask-2.png)
