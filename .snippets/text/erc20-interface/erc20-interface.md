该接口包括以下函数：

- **name()** - 只读函数，用于返回Token名称
- **symbol()** - 只读函数，用于返回Token符号
- **decimals()** - 只读函数，用于返回Token小数位数
- **totalSupply()** - 只读函数，用于返回现有的Token总数
- **balanceOf**(*address* who) - 只读函数，用于返回指定地址的余额
- **allowance**(*address* owner, *address* spender) - 只读函数，用于检查和返回所有者允许给支出者的Token数量
- **transfer**(*address* to, *uint256* value) - 转移一定Token数量至特定地址，若交易成功则返回True
- **approve**(*address* spender, *uint256* value) - 批准指定地址代表`msg.sender`支出特定的Token数量。若成功则返回True
- **transferFrom**(*address* from, *address* to, *uint256* value) - 从一个指定地址转移Token至另一个指定地址，若成功则返回True

!!! 注意事项
    ERC-20标准没有明确多次调用`approve`的具体影响，但是使用此功能多次更改额度可能会开启攻击向量。为避免不正确或意外的交易排序，您可以先将`spender`额度减少至`0`，然后再设置一个预期的额度。更多关于攻击向量的详情，请参阅[ERC-20 API: An Attack Vector on Approve/TransferFrom Methods](https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/edit#){target=_blank} 

该接口也包含以下必要事件：

- **Transfer**(*address indexed* from, *address indexed* to, *uint256* value) - 执行交易时发出
- **Approval**(*address indexed* owner, *address indexed* spender, *uint256* value) - 注册通过时发出