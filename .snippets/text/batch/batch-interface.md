该接口包括以下功能：

- **batchSome**(*address[]* to, *uint256[]* value, *bytes[]* callData, *uint64[]* gasLimit) — 执行多个调用，其中每个数组的相同索引合并到单个子调用所需的信息。如果某一子调用回滚状态，仍将尝试执行其余子调用
- **batchSomeUntilFailure**(*address[]* to, *uint256[]* value, *bytes[]* callData, *uint64[]* gasLimit) — 执行多次调用，其中每个数组的相同索引合并到单个子调用所需的信息。如果某一子调用回滚状态，则不会尝试执行后续子调用
- **batchAll**(*address[]* to, *uint256[]* value, *bytes[]* callData, *uint64[]* gasLimit) — 以原子方式执行多个子调用，其中每个数组的相同索引组合成单个子调用所需的信息。如果任何子调用执行失败，所有子调用都将回滚状态

这些函数中每个都具有以下参数：

- ***address[]* to** - 与子调用数组对应的地址数组，每个地址对应一个子调用
- ***uint256[]* value** - 与子调用数组对应的原生代币数额组，其中索引对应于*to*数组中相同索引的子调用。如果此数组比*to*数组短，则后面所有子调用数额将默认为0
- ***bytes[]* callData** - 与子调用数组对应的的callData数组，其中索引对应于*to*数组中相同索引的子调用。如果此数组比*to*数组短，则以下所有子事务都将不包含callData
- ***uint64[]* gasLimit** - 与子调用数组对应的gas上限数组，其中索引对应于*to*数组中相同索引的子调用。 0值被默认为无限制，并将转发批量交易的所有剩余给gas。如果此数组比*to*数组短，则以下所有子调用都将转发所有剩余的gas

该界面还包括以下必需的事件：

- **SubcallSucceeded**(*uint256* index) - 当给定索引的子调用成功时发出
- **SubcallFailed**(*uint256* index) - 当给定索引的子调用失败时发出