---
title: XC-20和跨链资产
description: 学习如何使用预编译的资产Solidity合约通过ERC-20接口与Moonbeam上的跨链Token交互。
---

# XC-20概况

![Cross-Chain Assets Precompiled Contracts Banner](/images/builders/interoperability/xcm/xc20/overview/overview-banner.png)

## 概览 {: #introduction }

[跨共识信息格式（XCM）](https://wiki.polkadot.network/docs/learn-crosschain){target=_blank}定义了两条互操作的区块链之间传递信息的方式。此格式为Moonbeam/Moonriver与中继链或是其他波卡/Kusama生态内平行链之间打开了传递信息和资产的大门。

Substrate assets are natively interoperable. However, developers need to tap into the Substrate API to interact with them, with no real visibility into the EVM. Consquently, interoperable Substrate assets are not that attractive for developers building on the EVM. To fix that and to help developers tap into the native interoperability that Polkadot/Kusama offers, Moonbeam introduced the concept of XC-20s.

XC-20s are a unique asset class on Moonbeam. It combines the power of Substrate assets (native interoperability) but allows users and developers to interact with them through a familiar [ERC-20 interface](/builders/interoperability/xcm/xc20/interact#the-erc20-interface){target=_blank}. On the EVM side, XC-20s have an [ERC-20 interface](/builders/interoperability/xcm/xc20/interact#the-erc20-interface){target=_blank}, so smart contracts and users can easily interact with them, and no knowledge of Substrate is required. This ultimately provides greater flexibility for developers when working with these types of assets and allows seamless integrations with EVM-based smart contracts such as DEXs and lending platforms, among others. Moreover, developers can integrate XC-20s with regular [Ethereum development frameworks](/builders/build/eth-api/dev-env/){target=_blank} or dApps, and create connected contracts strategies with such assets. Moreover, with the introduction of [RT2301](https://github.com/moonbeam-foundation/moonbeam/tree/runtime-2301){target=_blank}, all ERC-20s are XCM-ready, meaning they can also be referred to as XC-20s.

XC-20为Moonbeam上独特的资产类别，其结合了Substrate资产的优点（原生可互操作性）但又使开发者能够通过预编译合约（以太坊API）使用熟悉的[ERC-20接口](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank}与之交互。除此之外，开发者能够使用常用以太坊开发框架或dApp集成XC-20资产。

![Moonbeam XC-20 XCM Integration With Polkadot](/images/builders/interoperability/xcm/overview/overview-4.png)

This page aims to cover the basics on XC-20s, if you want to learn how to interact with or transfer XC-20s, please refer to the [Interact with XC-20s](/builders/interoperability/xcm/xc20/interact){target=_blank} or the [Using the X-Tokens Pallet To Send XC-20s](/builders/interoperability/xcm/xc20/xtokens){target=_blank} guides.

## XC-20类型 {: #types-of-xc-20s }

目前有两种XC-20类型：[外部XC-20](/builders/interoperability/xcm/xc20/xc20){target=_blank}和[可铸造XC-20](/builders/interoperability/xcm/xc20/mintable-xc20){target=_blank}。

### What are Local XC-20s? {: #local-xc20s }

Local XC-20s are all ERC-20s that exist on the EVM, and that can be transferred cross-chain through XCM. In order for local XC-20s to be transferred to another parachain, the asset needs to be registered on that chain. When transferring local XC-20s, the actual tokens reside in the destination chain's Sovereign account on Moonbeam. Local XC-20s must follow [the ERC-20 interface outlined in this guide](/builders/interoperability/xcm/xc20/interact#the-erc20-interface){target=_blank}, they cannot be customized ERC-20s.  More specifically, the function selector of the `transfer` function must be as described in [EIP-20](https://eips.ethereum.org/EIPS/eip-20){target=_blank}:

```js
function transfer(address _to, uint256 _value) public returns (bool success)
```

If the function selector of the `transfer` function deviates from the standard, the cross-chain transfer will fail.

### What are External XC-20s? {: #external-xc20s }

外部XC-20是从其他平行链或中继链转移到Moonbeam的原生跨链资产。因此，实际的Token存在于每条链的Moonbeam主权账户中。所有的外部XC-20资产使用_xc_作为其名称的前缀与其他资产类别进行区分。

### Local XC-20s vs External XC-20s {: #xc-20-comparison }

Both types of XC-20s can be easily sent to other parachains in the ecosystem as if they were Substrate assets, through both the Ethereum and Substrate API. However, using the Substrate API for XCM transfer will emit EVM logs for local XC-20s, but not for external XC-20s. Using the Ethereum API is recommended to provide more visibility into the XCM actions through EVM-based explorers, such as [Moonscan](https://moonscan.io){target=_blank}.

Within Moonbeam, local XC-20s can only be transferred through their regular ERC-20 interface. On the contrary, external XC-20s can be transferred through both interfaces (Substrate and ERC-20). If external XC-20s are transferred through the Substrate API, the transaction won't be visible from EVM-based block explorers. Only transactions done via the Ethereum API are visible through such explorers.

The main difference between these two types of assets is that local XC-20s are EVM ERC-20s that have XCM capabilities, while external XC-20s are Substrate assets with an ERC-20 interface on top.

Cross-chain transfers of XC-20s are done using the [X-Tokens Pallet](/builders/interoperability/xcm/xc20/xtokens/){target=_blank}. To learn how to use the X-Tokens Pallet to transfer XC-20s, you can refer to the [Using the X-Tokens Pallet To Send XC-20s](/builders/interoperability/xcm/xc20/xtokens){target=_blank} guide.

XC-20的跨链转移是通过[X-Tokens pallet](/builders/interoperability/xcm/xc20/xtokens/){target=_blank}来完成的。转移外部XC-20资产和可铸造XC-20资产的操作说明根据特定资产的多位置会有些许不同。

## Current List of External XC-20s - 现有的外部XC-20资产 {: #current-xc20-assets }

目前每个网络可用的外部XC-20资产列表如下所示：

=== "Moonbeam"
    | 原始网络  | XC-20表现形式 |                                                             XC-20地址                                                             |
    |:---------:|:-------------:|:---------------------------------------------------------------------------------------------------------------------------------:|
    | Polkadot  |     xcDOT     | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonscan.io/token/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080){target=_blank} |
    |   Acala   |    xcaUSD     | [0xfFfFFFFF52C56A9257bB97f4B2b6F7B2D624ecda](https://moonscan.io/token/0xfFfFFFFF52C56A9257bB97f4B2b6F7B2D624ecda){target=_blank} |
    |   Acala   |     xcACA     | [0xffffFFffa922Fef94566104a6e5A35a4fCDDAA9f](https://moonscan.io/token/0xffffFFffa922Fef94566104a6e5A35a4fCDDAA9f){target=_blank} |
    |   Astar   |    xcASTR     | [0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf](https://moonscan.io/token/0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf){target=_blank} |
    |  Bifrost  |     xcBNC     | [0xffffffff7cc06abdf7201b350a1265c62c8601d2](https://moonscan.io/token/0xffffffff7cc06abdf7201b350a1265c62c8601d2){target=_blank} |
    | Darwinia  |    xcRING     | [0xFfffFfff5e90e365eDcA87fB4c8306Df1E91464f](https://moonscan.io/token/0xFfffFfff5e90e365eDcA87fB4c8306Df1E91464f){target=_blank} |
    | Interlay  |    xcIBTC     | [0xFFFFFfFf5AC1f9A51A93F5C527385edF7Fe98A52](https://moonscan.io/token/0xFFFFFfFf5AC1f9A51A93F5C527385edF7Fe98A52){target=_blank} |
    | Interlay  |    xcINTR     | [0xFffFFFFF4C1cbCd97597339702436d4F18a375Ab](https://moonscan.io/token/0xFffFFFFF4C1cbCd97597339702436d4F18a375Ab){target=_blank} |
    | Parallel  |    xcPARA     | [0xFfFffFFF18898CB5Fe1E88E668152B4f4052A947](https://moonscan.io/token/0xFfFffFFF18898CB5Fe1E88E668152B4f4052A947){target=_blank} |
    |   Phala   |     xcPHA     | [0xFFFfFfFf63d24eCc8eB8a7b5D0803e900F7b6cED](https://moonscan.io/token/0xFFFfFfFf63d24eCc8eB8a7b5D0803e900F7b6cED){target=_blank} |
    | Statemint |    xcUSDT     | [0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d](https://moonscan.io/token/0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d){target=_blank} |

     _*您可以在Polkadot.js Apps上查询[资产ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/assets){target=_blank}_

=== "Moonriver"
    |   原始网络   | XC-20表现形式 |                                                                  XC-20地址                                                                  |
    |:------------:|:-------------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
    |    Kusama    |     xcKSM     | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonriver.moonscan.io/token/0xffffffff1fcacbd218edc0eba20fc2308c778080){target=_blank} |
    |   Bifrost    |     xcBNC     | [0xFFfFFfFFF075423be54811EcB478e911F22dDe7D](https://moonriver.moonscan.io/token/0xFFfFFfFFF075423be54811EcB478e911F22dDe7D){target=_blank} |
    |   Calamari   |     xcKMA     | [0xffffffffA083189F870640B141AE1E882C2B5BAD](https://moonriver.moonscan.io/token/0xffffffffA083189F870640B141AE1E882C2B5BAD){target=_blank} |
    |     Crab     |    xcCRAB     | [0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165](https://moonriver.moonscan.io/token/0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165){target=_blank} |
    | Crust-Shadow |     xcCSM     | [0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7](https://moonriver.moonscan.io/token/0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7){target=_blank} |
    |    Heiko     |     xcHKO     | [0xffffffFF394054BCDa1902B6A6436840435655a3](https://moonriver.moonscan.io/token/0xffffffFF394054BCDa1902B6A6436840435655a3){target=_blank} |
    |  Integritee  |    xcTEER     | [0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e](https://moonriver.moonscan.io/token/0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e){target=_blank} |
    |    Karura    |     xcKAR     | [0xFfFFFFfF08220AD2E6e157f26eD8bD22A336A0A5](https://moonriver.moonscan.io/token/0xFfFFFFfF08220AD2E6e157f26eD8bD22A336A0A5){target=_blank} |
    |    Karura    |    xcaUSD     | [0xFfFffFFfa1B026a00FbAA67c86D5d1d5BF8D8228](https://moonriver.moonscan.io/token/0xFfFffFFfa1B026a00FbAA67c86D5d1d5BF8D8228){target=_blank} |
    |    Khala     |     xcPHA     | [0xffFfFFff8E6b63d9e447B6d4C45BDA8AF9dc9603](https://moonriver.moonscan.io/token/0xffFfFFff8E6b63d9e447B6d4C45BDA8AF9dc9603){target=_blank} |
    |   Kintsugi   |    xcKINT     | [0xfffFFFFF83F4f317d3cbF6EC6250AeC3697b3fF2](https://moonriver.moonscan.io/token/0xfffFFFFF83F4f317d3cbF6EC6250AeC3697b3fF2){target=_blank} |
    |   Kintsugi   |    xckBTC     | [0xFFFfFfFfF6E528AD57184579beeE00c5d5e646F0](https://moonriver.moonscan.io/token/0xFFFfFfFfF6E528AD57184579beeE00c5d5e646F0){target=_blank} |
    |    Litmus    |     xcLIT     | [0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0](https://moonriver.moonscan.io/token/0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0){target=_blank} |
    |  Robonomics  |     xcXRT     | [0xFffFFffF51470Dca3dbe535bD2880a9CcDBc6Bd9](https://moonriver.moonscan.io/token/0xFffFFffF51470Dca3dbe535bD2880a9CcDBc6Bd9){target=_blank} |
    |    Shiden    |     xcSDN     | [0xFFFfffFF0Ca324C842330521525E7De111F38972](https://moonriver.moonscan.io/token/0xFFFfffFF0Ca324C842330521525E7De111F38972){target=_blank} |
    |  Statemine   |    xcRMRK     | [0xffffffFF893264794d9d57E1E0E21E0042aF5A0A](https://moonriver.moonscan.io/token/0xffffffFF893264794d9d57E1E0E21E0042aF5A0A){target=_blank} |
    |  Statemine   |    xcUSDT     | [0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d](https://moonriver.moonscan.io/token/0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d){target=_blank} |

    _*您可以在Polkadot.js Apps上查询[资产ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbeam.network#/assets){target=_blank}_

=== "Moonbase Alpha"
    |       原始网络        | XC-20表现形式 |                                                                 XC-20地址                                                                  |
    |:---------------------:|:-------------:|:------------------------------------------------------------------------------------------------------------------------------------------:|
    | Relay Chain Alphanet  |    xcUNIT     | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonbase.moonscan.io/token/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080){target=_blank} |
    |   Basilisk Alphanet   |     xcBSX     | [0xFFfFfFfF4d0Ff56d0097BBd14920eaC488540BFA](https://moonbase.moonscan.io/token/0xFFfFfFfF4d0Ff56d0097BBd14920eaC488540BFA){target=_blank} |
    |    Clover Alphanet    |     xcCLV     | [0xFfFfFffFD3ba399d7D9d684D94b22767a5FA1cCA](https://moonbase.moonscan.io/token/0xFfFfFffFD3ba399d7D9d684D94b22767a5FA1cCA){target=_blank} |
    | Crust/Shadow Alphanet |     xcCSM     | [0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7](https://moonbase.moonscan.io/token/0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7){target=_blank} |
    |  Integritee Alphanet  |    xcTEER     | [0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e](https://moonbase.moonscan.io/token/0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e){target=_blank} |
    |   Kintsugi Alphanet   |    xckBTC     | [0xFffFfFff5C2Ec77818D0863088929C1106635d26](https://moonbase.moonscan.io/token/0xFffFfFff5C2Ec77818D0863088929C1106635d26){target=_blank} |
    |   Kintsugi Alphanet   |    xcKINT     | [0xFFFfffff27C019790DFBEE7cB70F5996671B2882](https://moonbase.moonscan.io/token/0xFFFfffff27C019790DFBEE7cB70F5996671B2882){target=_blank} |
    |   Litentry Alphanet   |     xcLIT     | [0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0](https://moonbase.moonscan.io/token/0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0){target=_blank} |
    |   Pangolin Alphanet   |   xcPARING    | [0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165](https://moonbase.moonscan.io/token/0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165){target=_blank} |
    |  Statemine Alphanet   |     xcTT1     | [0xfFffFfFf75976211C786fe4d73d2477e222786Ac](https://moonbase.moonscan.io/token/0xfFffFfFf75976211C786fe4d73d2477e222786Ac){target=_blank} |

     _*您可以在Polkadot.js Apps上查询[资产ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=_blank}_

##  Retrieve List of External XC-20s - 获取外部XC-20资产的列表 {: #list-xchain-assets }

To fetch a list of the currently available external XC-20s along with their associated metadata, you can query the chain state using the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api){target=_blank}. You'll take the following steps:

1. Create an API provider for the network you'd like to get the list of assets for. You can use the following WSS endpoints for each network:

    === "Moonbeam"
        ```
        wss://wss.api.moonbeam.network
        ```

    === "Moonriver"
        ```
        wss://wss.api.moonriver.moonbeam.network
        ```

    === "Moonbase Alpha"
        ```
        {{ networks.moonbase.wss_url }}
        ```

2. Query the `assets` pallet for all assets
3. Iterate over the list of assets to get all of the asset IDs along with their associated metadata

```js
--8<-- 'code/xc20/retrieve-xc20s.js'
```

The result will display the asset ID along with some additional information for all of the registered external XC-20s.

## XC-20s Solidity Interface {: #xc20s-solidity-interface }

Both types of XC-20s have the standard ERC-20 interface. In addition, all external XC-20s also possess the ERC-20 Permit interface. The following two sections describe each of the interfaces separately.

### ERC-20接口 {: #the-erc20-interface }

As mentioned, you can interact with XC-20s via an ERC-20 interface. The [ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank} interface on Moonbeam follows the [EIP-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20){target=_blank}, which is the standard API interface for tokens within smart contracts. The standard defines the required functions and events that a token contract must implement to be interoperable with different applications.

Moonbeam上的[ERC20.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank}接口遵循[EIP-20 Token标准](https://eips.ethereum.org/EIPS/eip-20){target=_blank}，这是智能合约中Token的标准API接口。此标准定义了一个Token合约必须实现与应用程序互操作所需的函数和动作。

--8<-- 'text/erc20-interface/erc20-interface.md'

## ERC-20 Permit接口 {: #the-erc20-permit-interface }

Moonbeam上的[Permit.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank}接口遵循[EIP-2612标准](https://eips.ethereum.org/EIPS/eip-2612){target=_blank}，使用`permit`函数扩展了ERC-20接口。Permit是可用于更改帐户的ERC-20限额的签名消息。

标准的ERC-20 `approve`函数在其设计中受到限制，因为`allowance`仅能由交易的发送者`msg.sender`进行修改。您可在[OpenZeppelin的ERC-20接口的实现](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol#L136){target=_blank}中找到，通过[`msgSender`函数](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Context.sol#L17){target=_blank}设置`owner`，最终将其设置为`msg.sender`。

用户可以签署信息而非签署`approve`交易，该签名可以用于调用`permit`函数以修改`allowance`。如此一来，仅需少量gas即可进行Token转移。另外，用户也无需发送两次交易来批准和转移Token。关于`permit`函数的示例，请查看[OpenZeppelin的ERC-20 Permit扩展的实现](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L41){target=_blank}。

The [Permit.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank}接口包含以下函数：

- **permit**(*address* owner, *address* spender, *uint256*, value, *uint256*, deadline, *uint8* v, *bytes32* r, *bytes32* s) —— 任何人均可调用批准permit
- **nonces**(*address* owner) —— 反馈给定所有者当前的nonce
- **DOMAIN_SEPARATOR**() —— 返回用于避免重放攻击的EIP-712域分隔符。这遵循[EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=_blank}实现

**DOMAIN_SEPARATOR()**是在[EIP-712标准](https://eips.ethereum.org/EIPS/eip-712){target=_blank}中定义，计算如下：

```
keccak256(PERMIT_DOMAIN, name, version, chain_id, address)
```

哈希的参数可以分解为：

 - **PERMIT_DOMAIN** —— `EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)`的`keccak256`
 - **name** —— 一种Token名称，但包含以下注意事项：
     - 如果Token的定义了名称，则域名的**name**为`XC20: <name>`，其中`<name>`是Token名称
     - 如果Token的未定义名称，则域名的**name**为`XC20: No name`
 - **version** —— 签名域的版本，在本示例中，**version**设置为 `1`
 - **chainId** —— 网络的chain ID
 - **verifyingContract** —— XC-20地址

!!! 注意事项
    在之前的Runtime 1600升级中，**name**字段未遵循标准的[EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=_blank}实现。

域分隔符的计算可以在[Moonbeam的EIP-2612](https://github.com/moonbeam-foundation/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L130-L154){target=_blank}实现中看到，在[OpenZeppelin的`EIP712`合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L70-L84){target=_blank}中显示了一个实际的示例。

除了域分隔符，[`hashStruct`](https://eips.ethereum.org/EIPS/eip-712#definition-of-hashstruct){target=_blank}保证签名只能用于给定函数参数的`permit`函数。这使用了一个给定数值确保签名不会受到重放攻击。哈希结构的计算可以在[Moonbeam的EIP-2612](https://github.com/moonbeam-foundation/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L167-L175){target=_blank}实现中看到，在[OpenZeppelin的`ERC20Permit`合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L52){target=_blank}中显示了一个实际的示例。

域分隔符和哈希结构可以用于构建[最终哈希](https://github.com/moonbeam-foundation/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L177-L181){target=_blank}的完全编码消息。在[OpenZeppelin的`EIP712`合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L101){target=_blank}中显示了一个实际的示例。

使用最终哈希以及`v`、`r`和`s`数值，通过[ECRECOVER预编译](/builders/build/canonical-contracts/precompiles/eth-mainnet/#verify-signatures-with-ecrecover){target=_blank}可以验证和恢复签名。如果验证成功，nonce和限额将会更新。

## Interact with External XC-20s Using an ERC-20 Interface - 使用Remix与预编译交互 {: #interact-with-the-precompile-using-remix }

This section of the guide will show you how to interact with XC-20s via the ERC-20 interface using [Remix](/builders/build/eth-api/dev-env/remix){target=_blank}. Because local XC-20s are representations of regular ERC-20s, this section is focused on external XC-20s.

To interact with external XC-20s, you'll need to first calculate the precompile address of the XC-20 asset you want to interact with. Then, you can interact with the ERC-20 interface as you would with any other ERC-20.

You can adapt the instructions in this section to be used with the [Permit.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank} interface.

您可以修改以下操作说明并使用[Permit.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank}接口。

### 查看先决条件 {: #checking-prerequisites }

To approve a spend or transfer external XC-20s via the ERC-20 interface, you will need:

要通过XC-20预编译批准花费或转移XC-20，您将需要准备以下内容：

- [安装MetaMask并连接至Moonbase Alpha测试网](/tokens/connect/metamask/){target=_blank}
- 在Moonbase Alpha上创建或拥有2个账户
- 至少有一个账户拥有`DEV` Token
--8<-- 'text/faucet/faucet-list-item.md'

### 计算外部XC-20的预编译地址 - Calculate External XC-20 Precompile Addresses {: #calculate-xc20-address }

现在您已经获得可用的外部XC-20资产列表，但在您通过预编译合约与之交互前，您需要通过资产ID生成预编译地址。

外部XC-20预编译的地址通过以下公式计算：

```
address = "0xFFFFFFFF..." + DecimalToHex(AssetId)
```

根据上述的计算公式，第一个步骤为获得资产ID的u128表现形式并将其转换为十六进制数值。您可以使用您的搜寻引擎查看适合的转换工具。举例而言，资产ID`42259045809535163221576417993425387648`的十六进制数值为`1FCACBD218EDC0EBA20FC2308C778080`。

外部XC-20预编译仅可以落在`0xFFFFFFFF00000000000000000000000000000000`和`0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF`范围之间。

由于以太坊地址的长度为40个字符，您的预编译地址将会由8个`F`开始，接着输入`0`直到地址加上十六进制数值后为40个字符。

十六进制数值的长度已经为32个字符，因此前缀的8个`F`加上十六进制数值您即会获得40个字符长度的地址，并可用其与XC-20预编译合约交互。举例而言，此示例中提及资产ID的完整地址为`0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080`。

现在您已经成功计算外部XC-20的预编译地址，您可以在Remix上使用地址如同与ERC-20交互一般与XC-20资产交互。要学习如何与XC-20资产交互，请查看XC-20概况页面中的[如何使用Remix与预编译合约交互](/builders/interoperability/xcm/xc20/overview/#interact-with-the-precompile-using-remix)的部分。

### 添加&编译接口 {: #add-the-interface-to-remix }

您可以使用[Remix](https://remix.ethereum.org/){target=_blank}与XC-20预编译交互，首先您需要将ERC-20接口添加至Remix：

1. 获取[ERC20.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank}的复制文档
2. 将文档内容粘贴至名为**IERC20.sol**的Remix文档

![Load the interface in Remix](/images/builders/interoperability/xcm/xc20/overview/overview-1.png)

当您成功在Remix读取ERC-20接口后，您将需要编译：

1. 点击（从上至下的）第二个**Compile**标签
2. 编译**IERC20.sol**文档

![Compiling IERC20.sol](/images/builders/interoperability/xcm/xc20/overview/overview-2.png)

当接口已成功被编译后，您将会在**Compile**标签旁看到绿色的打勾符号。

### 访问预编译 {: #access-the-precompile }

您将使用获得的XC-20预编译地址访问接口，而非部署ERC-20预编译：

1. 在Remix内的**Compile**标签下点击**Deploy and Run**标签。请注意，预编译合约已被部署
2. 确保已在**ENVIRONMENT**下拉菜单中选择**Injected Web3**。当您已经选择**Injected Web3**，MetaMask将会跳出弹窗要求将您的账户连接至Remix
3. 确认**ACCOUNT**下显示的为正确账户
4. 确认已在**CONTRACT**下拉菜单中选择**IERC20 - IERC20.sol**。由于此为预编译合约，您不需要部署任何代码。同时，我们将会在**At Address**字段内显示预编译地址
5. 提供在[计算外部XC-20预编译地址](/builders/interoperability/xcm/xc20/xc20){target=_blank}或[计算可铸造XC-20预编译地址](/builders/interoperability/xcm/xc20/mintable-xc20){target=_blank}操作说明计算得到的XC-20预编译地址。在本示例中为`0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080`，然后点击**At Address**

![Access the address](/images/builders/interoperability/xcm/xc20/overview/overview-3.png)

!!! 注意事项
    如果您希望确保运行顺利，您可以使用您的搜寻引擎查询校验工具以校验您的XC-20预编译地址。当地址校验成功，您可以将其用在**At Address**字段中。

XC-20的**IERC20**预编译将会在**Deployed Contracts**列表下显示。现在您可以使用任何ERC-20函数以获得XC-20的信息或是转移XC-20。

![Interact with the precompile functions](/images/builders/interoperability/xcm/xc20/overview/overview-4.png)

如果您想更深入学习每个函数，您可以查看[ERC-20预编译教程](/builders/build/canonical-contracts/precompiles/erc20/){target=_blank}并加以修改来适用XC-20预编译交互。
