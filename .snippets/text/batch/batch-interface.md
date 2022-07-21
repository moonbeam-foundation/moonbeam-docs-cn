该接口包括以下功能：

- **batchSome(*address[]* to, *uint256[]* value, *bytes[]* call_data, *uint64[]* gas_limit)** — 执行多个调用，其中每个数组的相同索引合并到单个子调用所需的信息。如果某一子调用回滚状态，仍将尝试执行其余子调用
- **batchSomeUntilFailure(*address[]* to, *uint256[]* value, *bytes[]* call_data, *uint64[]* gas_limit)** — 执行多次调用，其中每个数组的相同索引合并到单个子调用所需的信息。如果某一子调用回滚状态，则不会尝试执行后续子调用
- **batchAll(*address[]* to, *uint256[]* value, *bytes[]* call_data, *uint64[]* gas_limit)** — 以原子方式执行多个子调用，其中每个数组的相同索引组合成单个子调用所需的信息。如果任何子调用执行失败，所有子调用都将回滚状态

该界面还包括以下必需的事件：

- **SubcallSucceeded(*uint256* index)** - 当给定索引的子调用成功时发出
- **SubcallFailed(*uint256* index)** - 当给定索引的子调用失败时发出