在本节中，您将获得提案的原像哈希和编码后的提案数据。要获取原像哈希，您首先需要导航至[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#){target=_blank}的**Preimage**页面：

 1. 导航至[**Governance** 标签页](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network%2Fpublic-ws#/democracy){target=_blank}
 2. 从下拉菜单里选择**Preimages**
 3. 在**Preimages**页面点击**+ Add preimage**

![Add a new preimage](/images/builders/pallets-precompiles/precompiles/democracy/democracy-4.png)

然后执行以下步骤：

 1. 选取一个账户（任何账户皆可，因为您不需要提交任何交易）
 2. 选取您希望交互的pallet以及可调度的函数（或是动作）以进行提案。您选取的动作将会决定您随后的操作步骤。在此例子中，此为**system** pallet和**remark**函数
 3. 输入remark函数的内容，确保其为独特的。重复的提案如“Hello World！”将不会被接受
 4. 复制原像哈希，这代表着此提案。您将会在通过民主预编译提交提案时使用此哈希
 5. 点击**Submit preimage**按钮，但请不要在下一页签署和确认此交易 

![Get the proposal hash](/images/builders/pallets-precompiles/precompiles/democracy/democracy-5.png)

在下个页面，根据以下步骤进行操作：

 1. 点击三角形图像以显示字节状态下带编码的提案
 2. 复制带编码的提案——您将在随后步骤中使用**notePreimage**时用到它

![Get the encoded proposal](/images/builders/pallets-precompiles/precompiles/democracy/democracy-6.png)

!!! 注意事项
     请**不要**在此签署和提交交易。您将会在随后步骤中通过**notePreimage**提交此信息。