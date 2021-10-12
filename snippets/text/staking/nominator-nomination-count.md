如果您从来没有从这个账户进行提名，您可以跳过这步。但是如果您不确定您目前有多少个提名，您可以从[Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/js)运行以下的Javascript代码来获取`nomination_count`这个参数：

```js
// Simple script to get your number of existing nominations.
// Remember to replace YOUR_ADDRESS_HERE with your nominator address.
const yourNominatorAccount = 'YOUR_ADDRESS_HERE'; 
const nominatorInfo = await api.query.parachainStaking.nominatorState2(yourNominatorAccount);
console.log(nominatorInfo.toHuman()["nominations"].length);
```

 1. 打开"Developer"栏 
 2. 点击"JavaScript"
 3. 将上面的代码粘贴到编辑器
 4. （可选）点击存储并选择一个文件名，比如“获得提名人人提名数”；这样即可本地存储代码
 5. 点击执行按钮；这会使代码在编辑器里运行
 6. 拷贝运行结果，这会在提名时作为参数

![Get existing nomination count](/images/tokens/staking/stake/stake-4.png)