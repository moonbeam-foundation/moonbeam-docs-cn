在下几个部分中您将要编译和部署的合约是一个简单的增量合约，命名为`Incrementer.sol`。您可以先为合约创建一个文件：

```
touch Incrementer.sol
```

接下来，您可以添加Solidity代码至文件：

```solidity
--8<-- 'code/web3-contract-local/Incrementer.sol'
```

`constructor`函数将在合约部署时运行，设置存储在链上的数字变量的初始值（默认值为0）。`increment`函数将提供的`_value`添加至当前数字，但是需要发送一个交易以修改存储的数据。最后，`reset`函数将存储的数值重置为零。

!!! 注意事项
    此合约为简单示例，仅供演示使用，其数值无实际意义。