为了符合Substrate标准，Moonbeam收集人的会话密钥为[SR25519](https://wiki.polkadot.network/docs/learn-keys#what-is-sr25519-and-where-did-it-come-from){target=\_blank}。本教程将向您展示如何创建/转换与收集人节点相关联的会话密钥。

首先，请确保您正在[运行收集人节点](/node-operators/networks/run-a-node/overview/){target=\_blank}。开始运行收集人节点后，您的终端应出现类似以下日志：

![Collator Terminal Logs](/images/node-operators/networks/collators/account-management/account-1.webp)

接下来，通过使用`author_rotateKeys`方法将RPC调用发送到HTTP端点来创建/转换会话密钥。当您调用 `author_rotateKeys` 时，结果是两个密钥的大小。回复将包含串联的作者ID（Nimbus 密钥）和VRF密钥。作者ID 用于签署区块并创建与您的H160帐户的关联，以便支付区块奖励。区块生产需要[VRF](https://wiki.polkadot.network/docs/learn-randomness#vrf){target=\_blank}密钥。

举例而言，如果您的收集人HTTP端点位于端口`9944`，则JSON-RPC调用可能如下所示：

```bash
curl http://127.0.0.1:9944 -H \
"Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"author_rotateKeys",
    "params": []
  }'
```

收集人节点应使用串联的新会话密钥的相应公钥进行回复。`0x`前缀后的前64位十六进制字符代表您的作者ID，最后64位十六进制字符是您的VRF会话密钥的公钥。在下一部分映射您的作者ID和设置会话密钥时，您将使用串联的公钥。

![Collator Terminal Logs RPC Rotate Keys](/images/node-operators/networks/collators/account-management/account-2.webp)

确保您已记下串联的会话密钥公钥。您的每台服务器，包括主服务器和备份服务器，都应该拥有其独特的密钥。由于密钥永远不会离开您的服务器，因此您可以将其视为该服务器的唯一ID。

接下来，您将需要注册您的会话密钥并将author ID会话密钥映射到H160以太坊格式的地址（用于接收区块奖励）。