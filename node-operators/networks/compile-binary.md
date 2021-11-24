---
title: 编译二进制文档
description: 如何编译Moonbeam二进制文档为Moonbeam网络运行完整的平行链节点、使用RPC端点和产生区块。
---

# 编译Moonbeam二进制文档

![Full Node Moonbeam Banner](/images/node-operators/networks/compile-binary/compile-binary-banner.png)

## 概览 {: #introduction } 

目前有许多方式能够开始在Moonbeam网络运行全节点。本教程将会带您了解从Rust源代码编译Moonbeam二进制文档的过程。至于更多关于如何运行节点，或是如何开始使用Docker的资讯，请查看我们文档的[运行节点](/node-operators/networks/full-node)页面。

本教程的目标人群是有基于[Substrate](https://substrate.dev/)创建区块链经验的用户。运行平行链节点和Substrate节点大致相似，但仍有几个不同之处。Substrate平行链阶段将会是较大的工程，因为其包含平行链本身以及与中继链同步的代码，还有促进两者之间的交流。因此，这项工程相对较大，需要30分钟和32GB的内存。

## 编译二进制文档 {: #compiling-the-binary } 

通过以下指令可以创建最新版本的Moonbeam平行链。

首先，克隆moonbeam repo。

```
git clone https://github.com/PureStake/moonbeam
cd moonbeam
```

检查最新版本：

```
git checkout tags/$(git tag | tail -1)
```

下一步，执行以下命令安装Substrate和所有必要的操作环境，包括Rust：

```
--8<-- 'code/setting-up-node/installrust.md'
```

最后，创建平行链二进制文档：

```
cargo build --release
```

![Compiling Binary](/images/node-operators/networks/compile-binary/compile-binary-1.png)

如果终端显示*cargo not found error*，请在系统路径中手动加入Rust，或重启系统：

```
--8<-- 'code/setting-up-node/updatepath.md'
```

现在您已可以使用Moonbeam二进制文档[运行Systemd服务](/node-operators/networks/full-node/#running-the-systemd-service)。