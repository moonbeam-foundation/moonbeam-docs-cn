---
title: 可铸造XC-20
description: 学习如何在基于Moonbeam网络铸造和销毁以及通过XCM在所有Substrate链之间转移的跨链资产
---

# 可铸造XC-20

![Cross-Chain Assets Precompiled Contracts Banner](/images/builders/xcm/xc20/mintable-xc20/mintable-xc20-banner.png)

## 概览 {: #introduction }

如同[XC-20概况](/builders/xcm/xc20/overview){target=_blank}文章内所述，[XC-20有两种类型](/builders/xcm/xc20/overview#types-of-xc-20s){target=_blank}：[外部的](/builders/xcm/xc20/xc20){target=_blank}和可铸造的。外部和可铸造的XC-20之间最大的不同为可铸造XC-20代表那些直接在Moonbeam网络上铸造和销毁，但是具有原生XCM可互操作性的资产。同样如同[XC-20概况](/builders/xcm/xc20/overview){target=_blank}文章内所述，可铸造XC-20资产如已在其他链上注册为XCM类型资产，即可自由的在所有注册的平行链上转移。相反地，外部XC-20资产则是锁定在Moonbeam，同时在中继链或是其他平行链上拥有的主权账户中。此教程将涵盖可铸造XC-20类型的资产。

所有XC-20核心皆为Substrate类型资产。一般而言，开发者需要通过Substrate API与任何Substrate资产交互。然而，Moonbeam移除了Substrate的相关部分并让用户和开发者能够通过预编译合约的ERC-20接口与此类资产交互。因此，开发者能够使用标准的以太坊开发者工具与这些资产交互。可铸造XC-20包含ERC-20接口的扩展以及一些关于管理资产和元数据设置（如名称、象征和资产小数位数等）的信息。此外，同样有一些额外的角色供资产进行注册和管理。

目前，可铸造XC-20资产需要通过民主提案创建，并通过链上治理投票。当该提案获得多数投票且同意，其资产即可在Moonbeam上注册并被铸造。除外，创建可铸造XC-20 Token需要一定数量Token的[存入](#create-a-proposal)（绑定）。

## 可铸造XC-20资产角色 {: #mintable-xc-20-roles }

在您注册和管理可铸造XC-20资产时需要注意一些重要的角色。这些角色，除了创建者之外，皆由所有者通过[`set_team` extrinsic](#additional-functions)设置给其他账户，以下为所有角色的列表：

- **所有者（Owner）**—— 拥有合约并能够管理资产的账户
- **创建者（Creator）**—— 负责创建资产并支付相关存入费用的账户
- **发行者（Issuer）**—— 指定能够发行或是铸造Token的账户，默认为所有者（Owner）
- **管理员（Admin）**—— 指定能够销毁Token和解锁账户和资产的账户，默认为所有者（Owner）
- **锁定者（Freezer）**—— 能够锁定账户和资产的指定账户，默认为所有者（Owner）

以下为所有角色各自负责任务的相关表格：

|       角色       |   铸造   |   销毁   |   锁定   |   解冻   |
| :---------------: | :------: | :------: | :------: | :------: |
|  所有者（Owner）  |    ✓     |    ✓     |    ✓     |    ✓     |
| 创建者（Creator） |    X     |    X     |    X     |    X     |
| 发行者（Issuer）  |    ✓     |    X     |    X     |    X     |
|  管理员（Admin）  |    X     |    ✓     |    X     |    ✓     |
| 锁定者（Freezer） |    X     |    X     |    ✓     |    X     |

## 可铸造XC-20的特殊功能 {: #additional-functions }

可铸造XC-20包含所有者或是指定账户才能使用的特殊功能，其被包含在[LocalAsset.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/LocalAsset.sol){target=_blank}接口当中，具体如下所示：

- **mint(*address* to, *uint256* value)** —— 铸造一定数量的Token至指定地址，仅有所有者（Owner）和发行者（Issuer）能够使用此函数
- **burn(*address* from, *uint256* value)** —— 销毁指定地址中的指定数量Token，仅有所有者（Owner）和管理员（Admin）能够使用此函数
- **freeze(*address* account)** —— 锁定指定账户一定数量的Token并禁止相关交易，仅有所有者（Owner）和发行者（Issuer）能够使用此函数
- **thaw(*address* account)** —— 解锁特定账户的Token使其能够与Token交互，仅有所有者（Owner）和管理员（Admin）能够使用此函数
- **freeze_asset()** —— 锁定整个资产运行以及Token，仅有所有者（Owner）和锁定者（Freezer）能够使用此函数
- **thaw_asset()** —— 解锁整个资产运行和Token，仅有所有者（Owner）和管理员（Admin）能够使用此函数
- **transfer_ownership(*address* owner)** —— 将此资产的所有权转移至新的指定账户，仅有所有者（Owner）能够使用此函数
- **set_team(*address* issuer, *address* admin, *address* freezer)** —— 允许所有者（Owner）设定此Token的发行者（Issuer）、管理员（Admin）以及锁定者（Freezer）。请查看[可铸造XC-20角色](#mintable-xc-20-roles)部分以查看每个角色的细节。仅有所有者（Owner）能够使用此函数
- **set_metadata(*string calldata* name, *string calldata* symbol, *uint8* decimals)** —— 设定此资产的名称、符号以及资产位数。资产位数可以自行配置并不需要于Moonbeam原生资产具有相同的资产位数
- **clear_metadata()** —— 清除此资产现有的名称、符号以及资产位数

## 获取可铸造XC-20资产的列表 {: #retrieve-list-of-mintable-xc-20s }

要获取Moonbase Alpha测试网上目前可用的可铸造XC-20资产列表，请导向至[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer){target=_blank}并确保您已连接至Moonbase Alpha。不同于外部XC-20资产，可铸造XC-20资产并不会在**Assets**栏位下出现。要查询可用的可铸造XC-20资产，您需要导向至**Developer**标签，并在下拉菜单中选择**Chain State**，然后跟随以下步骤：

1.   在**selected state query**下拉菜单中，选择**localAssets**
--8<-- 'text/xc-20/list-of-assets.md'

![Fetch list of cross-chain assets](/images/builders/xcm/xc20/mintable-xc20/mintable-xc20-1.png)

点击按钮后结果将会显示，包含Moonbase Alpha上已注册的可铸造XC-20资产的资产ID以及其他相关信息。资产ID将会自动生成并为通过BLKAE2散列的随机数以代表创建的本地资产，其ID将会在其后用于访问资产以及计算预编译地址。

## 获取可铸造XC-20资产的元数据 {: #retrieve-metadata-for-mintable-xc-20s }

要快速获得特定可铸造XC-20资产的相关信息（如名称、符号等）您可以使用**metadata** extrinsic以获得其元数据。举例而言，您可以使用资产ID`144992676743556815849525085098140609495`，并跟随以下步骤进行操作：

1. 在**selected state query**下拉菜单中，选择**localAssets**
--8<-- 'text/xc-20/retrieve-metadata.md'

![Get asset metadata](/images/builders/xcm/xc20/mintable-xc20/mintable-xc20-2.png)

在元数据的结果显现后，您还能看到与TestLoacalAsset可铸造XC-20资产对应的资产ID。

## 计算可铸造XC-20资产的预编译地址 {: #calculate-xc20-address }

现在您已经获得可用的可铸造XC-20资产列表，但在您通过预编译合约与他们交互之前，您需要通过资产ID生成预编译地址。您可以在检索[可铸造XC-20资产列表部分](#retrieve-list-of-mintable-xc-20s)获得特定资产的资产ID。

可铸造XC-20预编译地址通过以下公式计算：

```
address = "0xFFFFFFFE..." + DecimalToHex(AssetId)
```

根据上述的计算公式，第一个步骤为获得资产ID的u128表现形式并将其转换成十六进制数值，您可以使用搜寻引擎寻找适合的转换工具。举例而言，资产ID`144992676743556815849525085098140609495`的十六进制数值为`6D1492E39F1674F65A6F600B4589ABD7`。

可铸造XC-20预编译地址仅可以落在`0xFFFFFFFE00000000000000000000000000000000`和 `0xFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF`范围之间。因此，地址的首八位数字必定是`FFFFFFFE`。另外，由于以太坊地址的长度为40个字符，您需要在十六进制数值前输入 `0`以确保地址长度为40个字符。

十六进制数值的长度已经算出为32个字符，因此前缀的首八个字母`FFFFFFFE`加上其将会获得您用于与XC-20预编译交互的长度为40个字符的地址。举例而言，此示例中的完整地址为`0xFFFFFFFE6D1492E39F1674F65A6F600B4589ABD7`。

现在您已经成功计算可铸造XC-20预编译地址，您可以如同操作ERC-20资产一般在Remix通过地址与此类XC-20资产交互。

## 注册一个可铸造XC-20资产 {: #register-a-mxc-20 }

这一部分将会引导您如何在[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer){target=_blank}注册一个资产并使用[Remix](https://remix.ethereum.org/){target=_blank}与可铸造XC-20资产特定的函数交互。如果您仅想通过标准ERC-20接口与可铸造XC-20资产交互，请查看XC-20预编译页面的[如何使用Remix与预编译合约交互](/builders/xcm/xc20/overview/#interact-with-the-precompile-using-remix){target=_blank}部分。

### Checking Prerequisites {: #checking-prerequisites } 查看先决条件 {: #checking-prerequisites }

要在Moonbase Alpha上注册一个可铸造XC-20资产，您需要准备以下内容：

- [安装MetaMask并将其连接至Moonbase Alpha测试网](/tokens/connect/metamask/){target=_blank}
- 具有拥有一定数量DEV的账户
 --8<-- 'text/faucet/faucet-list-item.md'

### 创建提案{: #create-a-proposal } 

要在Moonbeam上创建可铸造XC-20资产，首个步骤为创建提案。资产的创建者（Creator）将需要存入一定资产，每个网络所需的锁定数量如下：

=== "Moonbeam"
    ```
    {{ networks.moonbeam.mintable_xc20.asset_deposit }} GLMR
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.mintable_xc20.asset_deposit }} MOVR
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.mintable_xc20.asset_deposit }} DEV
    ```

接着，导向至[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer){target=_blank}并确保您已连接至Moonbase Alpha。在网页最上方点击**Governance**并在下拉菜单中选择**Democracy**。接着，选择**+ Submit preimage**并跟随以下步骤进行操作：

1. 选择您希望用于创建提案所要用的账户

2. 在**propose**下拉菜单中选择**assetManager**

3. 接着选择**registerLocalAsset**函数

4. 输入创建者（Creator）的地址

5. 输入所有者（Owener）的地址

6. 设定**isSufficient**，如果设定为`true`，则其可以在转移至另一个没有原生Token余额的账户

7. 设定**minBalance**

8. 复制**preimage hash**并用于下个步骤

9. 点击**+ Submit preimage**

![Create preimage to register the mintable XC-20](/images/builders/xcm/xc20/mintable-xc20/mintable-xc20-3.png)

当原像（Preimage）已经成功创建并提交后，您需要完整地提交提案。您可以点击**+ Submit proposal**并跟随以下步骤进行操作：

1. 选择您希望用于提交提案的账户

2. 在**preimage hash**中贴上先前复制的内容，如果您并未复制数值，您可以在页面上方选择**Developer**并在下拉选单中点选**Chain State**，接着查询使用**preimages**函数，确保**include option**为关闭状态后提交查询

3. 您可以根据需求自由更新存入数量

4. 点击**+ Submit proposal**

![Create proposal to register the mintable XC-20](/images/builders/xcm/xc20/mintable-xc20/mintable-xc20-4.png)

您将会看到弹出视窗并要求签署提案，当您签署成功后您将会在**Democracy**页面的**proposals**一栏下方见到您的提案

您的提案将会被交付至民主和链上治理，请查看Moonbeam的治理页面以了解Moonbeam的[治理](/learn/features/governance){target=_blank}是如何运作的。

### 设定资产元数据 {: #set-asset-metadata }

当提案通过并颁布后，您设定为所有者（Owner）的账户将能够设定资产元数据，包含资产名称、符号以及资产位数。您需要存入一定数量Token以设置元数据，以下为每个网络的要求：

=== "Moonbeam"
    ```
    {{ networks.moonbeam.mintable_xc20.metadata_base_deposit }} GLMR base fee + ({{ networks.moonbeam.mintable_xc20.metadata_byte_deposit }} GLMR x number of bytes stored)
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.mintable_xc20.metadata_base_deposit }} MOVR base fee + ({{ networks.moonriver.mintable_xc20.metadata_byte_deposit }} MOVR x number of bytes stored)
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.mintable_xc20.metadata_base_deposit }} DEV base fee + ({{ networks.moonbase.mintable_xc20.metadata_byte_deposit }} DEV x number of bytes stored)
    ```

要设置资产元数据，您需要[获取资产ID](#retrieve-list-of-mintable-xc-20s)。当您拥有资产ID，点击页面上方的**Developer**并在下拉选单中选择**Extrinsics**，接着跟随以下步骤进行操作：

1. 选择所有者（Owner）账户

2. 在**submit the following extrinsic**下拉选单中，选择**localAssets**

3. 接着选择**setMetadata** extrinsic

4. 输入资产ID

5. 输入资产名称

6. 设置资产符号

7. 设置资产位数，其不必与Moonbeam原生Token一样为18位数，您可以根据需求配置

8. 点击**Submit Transaction**

![Set metadata for mintable XC-20](/images/builders/xcm/xc20/mintable-xc20/mintable-xc20-5.png)

您可以使用**Extrinsics**页面使用其他函数如铸造Token、提名团队、锁定以及解锁资产/账户等。

### 使用Remix与可铸造XC-20资产特定功能交互 {: #interact-with-the-precompile-using-remix }

如前所示，此部分教程将仅涵盖Token合约拥有者以及具有特定[角色](#mintable-xc-20-roles)的指定账户如何与可铸造XC-20资产的特定功能交互。如果您仅想通过标准ERC-20接口与可铸造XC-20资产交互，请查看XC-20预编译页面中的[使用Remix与预编译合约交互](/builders/xcm/xc20/overview/#interact-with-the-precompile-using-remix){target=_blank}部分。

首先，您需要添加`LocalAsset`至[Remix](https://remix.ethereum.org/){target=_blank}，接着跟随以下步骤进行操作：

1. 获得[LocalAsset.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/LocalAsset.sol){target=_blank}复制文件

2. 将其内容贴入Remix文件并命名为**ILocalAsset.sol**

![Load the interface in Remix](/images/builders/xcm/xc20/mintable-xc20/mintable-xc20-6.png)

当您在Remix运行接口，您需要编译它：

1. 点击页面上方**Compile**标签

2. 编译**ILocalAsset.sol**文件

![Compiling IERC20.sol](/images/builders/xcm/xc20/mintable-xc20/mintable-xc20-7.png)

如果接口被成功编译，您将能够在**Compile**标签旁看到绿色打勾符号。

与部署预编译合约不同，您将会使用XC-20预编译地址访问接口：

1. 点击Remix中**Compile**标签下方的**Deploy and Run**标签。请注意此处预编译合约已经为部署状态

2. 确保**Environment**下拉选单中的**Injected Web3**已被选择。当您选择**Injected Web3**，您的MetaMask将会弹出视窗以将您的账户连接至Remix

3. 确认**Account**下方显示为正确的账户

4. 确认已在**Contract**下拉选单中选择**ILocalAsset - ILocalAsset.sol**。由于此为预编译合约，因此并不需要部署任何节点。相反地，我们将在**At Address**字段提供预编译合约的地址

5. 提供在[计算预编译合约地址](#calculate-precompile-address)部分获得的XC-20预编译合约地址，`0xFFFFFFFE6D1492E39F1674F65A6F600B4589ABD7`，并点击**At Address**

![Access the address](/images/builders/xcm/xc20/mintable-xc20/mintable-xc20-8.png)

!!! 注意事项
    您可以通过搜寻引擎查询可用工具自行校验XC-20预编译合约的地址。当地址校验成功后，您可以再将其用于**At Address**字段。

可铸造XC-20资产的预编译合约将会出现在**Deployed Contracts**的列表下方，现在您可以自由使用任何可用的函数。

![Interact with the precompile functions](/images/builders/xcm/xc20/mintable-xc20/mintable-xc20-9.png)
