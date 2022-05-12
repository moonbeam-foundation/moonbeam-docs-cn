---
title: 运行节点标志和选项
description: 有助于在Moonbeam上运行一个完整平行链节点的标志；了解如何访问节点操作员可用的所有标志。
---

# 有助于在Moonbeam上运行节点的标志

![Full Node Moonbeam Banner](/images/node-operators/networks/run-a-node/flags/flags-banner.png)

## 概览 {: #introduction }

当您在启动自己的Moonbeam节点时，有些必需的或是可选的标志供您使用。

此教程将会包含一些常见标志并向您展示如何使用所有的可用标志。

## 常见标志 {: #common-flags }

- **`--validator`** —— 为候选收集人启用验证人模式，当可用时允许节点活跃参与区块生产
- **`--port`** —— 指定端对端协议的TCP端口。平行链的默认端口为`{{ networks.parachain.p2p }}`，嵌入的中继链则为`{{ networks.relay_chain.p2p }}`
- **`--rpc-port`** —— 指定HTTP RPC服务器的TCP端口。平行链的默认端口为`{{ networks.parachain.rpc }}`，嵌入的中继链则为`{{ networks.relay_chain.rpc }}` 
- **`--ws-port`** —— 指定WebSockets RPC服务器的TCP端口。平行链的的默认端口`{{ networks.parachain.ws }}`，嵌入的中继链则为`{{ networks.relay_chain.ws }}`
- **`--execution`** —— 指定所有执行内容该使用的执行策略。Substrate runtime被编译为本地可执行文件，该执行文件被包含在节点本地的一部分，以及存储在链上的WebAssembly二进制文件中。可用的选项如下：
    - **`native`** —— 仅执行本地文件
    - **`wasm`** —— 仅执行wasm文件
    - **`both`** —— 执行本地和wasm文件
    - **`nativeelsewasm`** —— 优先执行本地文件，但无法执行时执行wasm文件
- **`--wasm-execution`** —— 指定执行wasm runtime代码时的函数方法，以下为可用选项：
    - **`compiled`** —— 此为默认选项，使用[wasmtime](https://github.com/paritytech/wasmtime){target=_blank}编译的runtime
    - **`interpreted-i-know-what-i-do`** —— 使用[wasmi interpreter](https://github.com/paritytech/wasmi){target=_blank}
- **`--pruning`** —— 指定状态调整模式。如果为使用`--validator`标志运行的节点，默认保持所有区块的状态。否则，状态仅会保留最近的256个区块，以下为可用选项：
    - **`archive`** —— 保持所有区块的状态
    - **`<number-of-blocks>`** —— 指定保留状态的自定义区块编号
- **`--state-cache-size`** —— 指定内部状态缓存的大小，默认为`67108864`。您可以将其设置为`0`以关闭缓存换取收集人表现提升
- **`--db-cache`** —— 指定数据库缓存能够使用的记忆体。一般建议设置为您服务器拥有的实际RAM的50%。举例而言，32GB RAM的服务器建议将此选项设置为`16000`。虽然其最小值可以为`2000`，但低于建议的规格
- **`--base-path`** —— 指定您链上数据储存的路径
- **`--chain`** —— 指定使用的链规格。其可以为预先设定的链规格，如`{{ networks.moonbeam.chain_spec }}`、 `{{ networks.moonriver.chain_spec }}`、或 `{{ networks.moonbase.chain_spec }}`。也可以是具有链规格的特定文档路径（如使用`build-spec`命令输出的文档）
- **`--name`** —— 为节点指定可辨识的名称，在启用的情况下在[telemetry](https://telemetry.polkadot.io/){target=_blank}可见
- **`--telemetry-url`** —— 指定telemetry服务器所连接的URL。此标志能够用于为多个telemetry端点多次使用。此标志使用两个参数，分别为URL和日志详细级别（Verbosity Level）。日志详细级别范围为0-9，0代表最低级别。预期使用此标志的格式为'<URL VERBOSITY>'，如`--telemetry-url 'wss://foo/bar 0'`
- **`--in-peers`** —— 指定可接受向内连接的最大数量，默认为`25`
- **`--out-peers`** —— 指定可接受向外连接的最大数量以维持稳定，默认为`25`
- **`--runtime-cache-size 32`** - 将保留在内存缓存中的不同运行时版本的数量配置为`32`

## 如何访问所有可用标志 {: #how-to-access-all-of-the-available-flags }

关于可用标志的完整列表，您可以命令末尾添加`--help`来启动Moonbeam节点。此命令将会根据您启动节点的方法以及您使用Docker或Systemd而有所不同，方法如下所示：

### Docker {: #docker }

=== "Moonbeam"
    ```
    docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
    --help
    ```

=== "Moonriver"
    ```
    docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
    --help
    ```

=== "Moonbase Alpha"
    ```
    docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
    --help
    ```

### Systemd {: #systemd }

=== "Moonbeam"
    ```
    # If you used the release binary
    ./{{ networks.moonbeam.binary_name }} --help

    # Or if you compiled the binary
    ./target/release/{{ networks.moonbeam.binary_name }} --help
    ```

=== "Moonriver"
    ```
    # If you used the release binary
    ./{{ networks.moonriver.binary_name }} --help

    # Or if you compiled the binary
    ./target/release/{{ networks.moonriver.binary_name }} --help
    ```

=== "Moonbase Alpha"
    ```
    # If you used the release binary
    ./{{ networks.moonbase.binary_name }} --help

    # Or if you compiled the binary
    ./target/release/{{ networks.moonbase.binary_name }} --help
    ```
