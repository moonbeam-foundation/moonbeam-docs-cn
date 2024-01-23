---
title: 编译二进制文件以运行节点
description: 学习如何手动编译二进制文件以运行完整的 Moonbeam 节点。编译二进制文件大约需要 30 分钟，并需要至少 32GB 的内存。
---

# 手动编译Moonbeam二进制文件

## 概述

运行一个基于Moonbeam网络的全节点可让您连接到区块链网络、与boot节点同步、获得本地RPC端点以使用、在平行链上生成区块等等。

本指南适用于有编译[Substrate](https://substrate.dev/)类区块链节点经验的人士。平行链节点与典型的Substrate节点类似，但也存在一些差异。一个Substrate平行链节点的构建会更大，因为它包含运行平行链本身需要的代码，以及同步中继链和建立两者之间通信的代码。因此，构建此类节点需要相当多的资源，可能需要超过30分钟并需要32GB的内存。

如果您想快速开始，而无需自己编译二进制文件，可以使用 [The Release Binary](/node-operators/networks/run-a-node/systemd){target=\_blank}。

## 编译二进制文件 {: #compile-the-binary }

手动编译二进制文件大约需要30分钟，并需要至少32GB的内存。

使用以下命令来构建最新的Moonbeam平行链。

1. 克隆Moonbeam代码库

    ```bash
    git clone https://github.com/moonbeam-foundation/moonbeam
    cd moonbeam
    ```

2. 使用最新版本的发布

    ```bash
    git checkout tags/$(git describe --tags)
    ```

3. 如果您已经安装Rust，您可以跳过以下两个步骤。否则请使用[Rust的推荐方式](https://www.rust-lang.org/tools/install){target=\_blank}安装Rust及其预装项

    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/installrust.md'
    ```

4. 更新您的`PATH`环境变量 

    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/updatepath.md'
    ```

5. 构建平行链二进制文件

    !!! 注意事项
        如果您使用的是Ubuntu 20.04或22.04，在构建二进制文件前您将需要另外安装以下依赖项：

        ```bash
        apt install clang protobuf-compiler libprotobuf-dev pkg-config libssl-dev -y 
        ```

    ```bash
    cargo build --release
    ```

![Compiling Binary](/images/node-operators/networks/run-a-node/compile-binary/full-node-binary-1.png)

如果在窗口看到  _cargo not found error_ 错误，请手动将Rust添加至你的系统路径或重新启动系统：

```bash
--8<-- 'code/builders/get-started/networks/moonbeam-dev/updatepath.md'
```

现在您可以使用Moonbeam二进制文件运行Systemd服务。要设置和运行服务，请参考[使用Systemd在Moonbeam上运行节点](/node-operators/networks/run-a-node/systemd){target=\_blank}教程.