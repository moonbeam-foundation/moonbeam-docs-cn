## 使用您的Ledger与合约交互 {: #interact-with-contracts-using-your-ledger }

默认情况下，Ledger设备无法自动填充事务对象中的`data`字段。因此，用户无法部署或与智能合约交互。

但是，如果您希望使用您的Ledger硬件钱包处理与智能合约相关的事务，您需要更改您设备app中的配置参数。为此，您需要执行以下步骤：

 1. 在您的Ledger，打开Moonriver或Ethereum app
 2. 导向至**Settings**
 3. 找到**Blind signing**页面。在该页面底部应显示**NOT Enabled**
 4. 选择或启用该选项，将其更改为**Enabled**

!!! 注意事项
    此选项是使用您的Ledger与可能上线于Moonbeam生态系统的ERC-20 token合约交互的必要步骤。

