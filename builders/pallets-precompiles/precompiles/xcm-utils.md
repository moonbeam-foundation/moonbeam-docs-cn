---
title: XCM-Utils预编译合约
description: 通过Moonbeam的预编译XCM-Utils合约，了解可供智能合约开发者使用的各类XCM相关实用性函数。
keywords: solidity, 以太坊, xcm, utils, moonbeam, 预编译, 合约
---

# 与XCM-Utils预编译交互

![Precomiled XCM-Utils Banner](/images/builders/pallets-precompiles/precompiles/xcm-utils/xcm-utils-banner.png)

## 概览 {: #xcmutils-precompile}

XCM-utils预编译合约为开发者提供了直接在EVM中与XCM相关的实用性函数。这允许开发者能够更轻松地与其他XCM相关的预编译进行交易和交互。

与其他[预编译合约](/builders/pallets-precompiles/precompiles/){target=_blank}类似，XCM-utils预编译位于以下地址：

=== "Moonbeam"
     ```
     {{networks.moonbeam.precompiles.xcm_utils }}
     ```

=== "Moonriver"
     ```
     {{networks.moonriver.precompiles.xcm_utils }}
     ```

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.xcm_utils}}
     ```

--8<-- 'text/precompiles/security.md'

## XCM-Utils Solidity接口 {: #xcmutils-solidity-interface } 

[XcmUtils.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol){target=_blank}是一个与预编译交互的接口：

!!! 注意事项
    预编译将在之后更新以包含更多其他功能。欢迎您在[Discord](https://discord.gg/PfpUATX){target=_blank}给出其他实用性函数的建议。

此接口包含以下函数：

 - **multilocationToAddress**(*Multilocation memory* multilocation) — 只读函数，为给定multilocation返回multilocation的衍生账户
 - **weightMessage**(*bytes memory* message) — 只读函数，返回XCM消息将在链上消耗的权重。消息参数必须为SCALE编码的XCM版本化的XCM消息
 - **getUnitsPerSecond**(*Multilocation memory* multilocation) — 只读函数，为以`Multilocation`形式给定的资产获取每秒单位数。multilocation必须描述一个可以支持作为费用支付的资产，例如[外部XC-20](/builders/interoperability/xcm/xc20/xc20){target=_blank}，否则此函数将回退当前调用(revert)

在XCM-utils预编译中的`Multilocation`结构构建与[XCM Transactor预编译的Multilocation](/builders/interoperability/xcm/xcm-transactor#building-the-precompile-multilocation){target=_blank}相同。

## 使用XCM-Utils预编译 {: #using-the-xcmutils-precompile }

XCM-Utils预编译允许用户无需前往波卡库即可通过Ethereum JSON-RPC读取数据。此功能更多的是带来了便利性，而不是为了智能合约用例。

对于`multilocationToAddress`，一个示例用例是能够通过将其multilocation派生的地址加入白名单来允许来自其他平行链的交易。一个用户可以通过计算和存储地址来将multilocation加入白名单。EVM交易可以通过[远程EVM调用](/builders/interoperability/xcm/remote-evm-calls){target=_blank}从其他平行链进行发起。

```solidity
// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.3;

import "https://github.com/PureStake/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol";

contract MultilocationWhitelistExample {
    XcmUtils xcmutils = XcmUtils(0x000000000000000000000000000000000000080C);
    mapping(address => bool) public whitelistedAddresses;

    modifier onlyWhitelisted(address addr) {
        _;
        require(whitelistedAddresses[addr], "Address not whitelisted!");
        _;
    }

    function addWhitelistedMultilocation(
        XcmUtils.Multilocation calldata externalMultilocation
    ) external onlyWhitelisted(msg.sender) {
        address derivedAddress = xcmutils.multilocationToAddress(
            externalMultilocation
        );
        whitelistedAddresses[derivedAddress] = true;
    }

    ...
}
```
