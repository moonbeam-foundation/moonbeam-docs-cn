接下来，您可以遵循以下步骤修改`hardhat.config.js`文件并将Moonbase Alpha添加为网络：

1. 导入插件。Hardhat附带Hardhat Ethers，因此您无需自行安装

2. 导入`secrets.json`文件

3. 在`module.exports`中，您需要提供Solidity版本

4. 添加Moonbase Alpha网络配置