**DOMAIN_SEPARATOR()**定义于[EIP-712标准](https://eips.ethereum.org/EIPS/eip-712){target=\_blank}中，并由以下公式计算：

```js
keccak256(PERMIT_DOMAIN, name, version, chain_id, address)
```

此哈希的参数可被拆分为以下部分：

 - **PERMIT_DOMAIN** -`EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)`的`keccak256`
 - **name** - 签署域名的名称，必须为`"Call Permit Precompile"`
 - **version** - 签署域名的版本，在本示例中**version**设置为`1`
 - **chainId** - 网络的链ID
 - **verifyingContract** - 用于验证签名的合约地址，在本示例中被称为调用许可预编译地址
