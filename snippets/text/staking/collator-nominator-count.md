首先，您需要查询`collator_nominator_count`， 因为提名时需要这个参数。此参数可以通过[Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/js)运行以下代码获得：

```js
// Simple script to get collator_nominator_count
// Remember to replace COLLATOR_ADDRESS with the address of desired collator.
const collatorAccount = 'COLLATOR_ADDRESS'; 
const collatorInfo = await api.query.parachainStaking.collatorState2(collatorAccount);
console.log(collatorInfo.toHuman()["nominators"].length);
```

 1. 打开"Developer"栏 
 2. 点击"JavaScript"
 3. 将上面的代码粘贴到编辑器
 4. （可选）点击存储并选择一个文件名，比如“获得收集人提名数”；这样即可本地存储代码
 5. 点击执行按钮；这会使代码在编辑器里运行
 6. 拷贝运行结果，这会在提名时作为参数

![Get collator nominator count](/images/tokens/staking/stake/stake-3.png)