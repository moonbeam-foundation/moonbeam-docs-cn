复制您在[Moonbase中继链](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}的现有或新创建的账户。您将需要它来计算相应的多地点衍生账户，这是一种特殊类型的无密钥账户（其私钥未知）。来自多地点衍生账户的交易只能通过来自中继链上相应账户的有效XCM指令启动。换句话说，您是唯一可以在您的多地点衍生账户上发起交易的人——如果您无法访问您的Moonbase中继链账户，您也将无法访问您的多地点衍生账户。

如要产生多地点衍生账户，首先请复制[xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank}代码库，运行`yarn`指令以安装所有必要代码包并运行以下指令：

```sh
yarn calculate-multilocation-derivative-account \
--ws-provider wss://wss.api.moonbase.moonbeam.network \
--address INSERT_MOONBASE_RELAY_ACCOUNT \
--para-id INSERT_ORIGIN_PARACHAIN_ID_IF_APPLIES \
--parents INSERT_PARENTS_VALUE_IF_APPLIES
```

接着，让我们检查以上指令中输入的相关参数：

- `--ws-provider` 或 `-w` 标志对应我们用于获得此信息的端点
- `--address` 或 `-a`标志对应您的Moonbase中继链账户地址
- `--para-id` 或 `-p`标志对应原链（如有）的平行链ID。如果您从中继链传送XCM则无需提供此参数
- The `-parents` flag corresponds to the parents value of the origin chain in relation to the destination chain. If you're deriving a multi-location derivative account on a parachain destination from a relay chain origin, this value would be `1`. If left out, the parents value defaults to `0`