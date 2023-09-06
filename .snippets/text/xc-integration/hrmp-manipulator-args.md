要使用该脚本，您需要提供以下的必须参数：

- `--parachain-ws-provider` or `--w` - 指定发起请求的平行链WebSocket提供者
- `--relay-ws-provider` or `--wr` - 指定发起请求的中继链WebSocket提供者
- `--hrmp-action` or `--hrmp` - 接收以下动作，可能动作分别为：`accept`、`cancel`、`close`和`open`
- `--target-para-id` or `-p` - 该请求的目标平行链ID
