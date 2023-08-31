在这一部分，您将创建一个脚本，该脚本使用Solidity编译器为`Incrementer.sol`合约输出字节码和接口（ABI）。首先，您可以通过运行以下命令创建一个`compile.js`文件：

```bash
touch compile.js
```

接下来，您将为此文件创建脚本，并执行以下步骤：

1. 导入`fs`和`solc`安装包

2. 使用`fs.readFileSync`函数，您将读取`Incrementer.sol`的文件内容并保存至`source`

3. 通过指定要使用的`language`、`sources`和`settings`为Solidity编译器构建`input`对象

4. 通过`input`对象，您可以使用`solc.compile`编译合约

5. 提取已编译的合约文件并导出以在部署脚本中使用

```js
--8<-- 'code/web3-contract-local/compile.js'
```
