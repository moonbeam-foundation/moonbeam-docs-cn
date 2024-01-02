#### 在前端使用SQL后台 {: #use-sql }

Moonbeam节点预装的[Frontier](/learn/features/eth-compatibility/#frontier){target=_blank} 数据库可以修改为使用SQL的后端。Frontier 数据库是 Moonbeam 节点的标准配置，包含以太坊的相关元素，例如交易、区块和日志。由于 eth_getLogs 方法非常耗费资源，与默认的 RocksDB 数据库相比，SQL 后端旨在为索引和查询以太坊日志提供更高性能的选择。

要启动一个使用 Frontier SQL 后端的节点，您需要在启动命令中添加 `--frontier-backend-type sql` 标志。

您可以使用其他标志来配置 SQL 后端，例如数据池的大小、查询超时等；有关更多信息，请参阅[Flags](/node-operators/networks/run-a-node/flags#flags-for-sql-backend){target=_blank} 页面。