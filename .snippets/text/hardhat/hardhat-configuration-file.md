Next you can take the following steps to modify the `hardhat.config.js` file and add Moonbase Alpha as a network:

接下来，您可以执行以下命令调整`hardhat.config.js`文件并将Moonbase Alpha添加为网络：

1. Import plugins. The Hardhat Ethers plugin comes out of the box with Hardhat, so you don't need to worry about installing it yourself

   导入插件。Hardhat附带Hardhat Ethers，因此您无需自行安装

2. Import the `secrets.json` file

   导入`secrets.json`文件

3. Inside the `module.exports`, you need to provide the Solidity version

   在`module.exports`中，您需要提供Solidity版本

4. Add the Moonbase Alpha network configuration

   添加Moonbase Alpha网络配置