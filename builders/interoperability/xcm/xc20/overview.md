---
title: XC-20和跨链资产
description: 了解Moonbeam跨链资产类型（尤其是本地XC-20和外部XC-20），并查看Moonbeam上的外部XC-20列表。
---

# XC-20概述

## 概览 {: #introduction }

[跨共识信息格式（XCM）](https://wiki.polkadot.network/docs/learn-crosschain){target=_blank}定义了两条互操作区块链之间传递信息的方式。此格式为Moonbeam/Moonriver与中继链或是其他波卡/Kusama生态内平行链之间打开了传递信息和资产的大门。

Substrate资产具有原生可互操作性。然而，开发者需要使用Substrate API与其交互。而这使开发者的体验感降低，尤其是来自以太坊生态的开发者。因此，为了协助开发者上手波卡和Kusama提供的原生互操作性，Moonbeam引入了XC-20概念。

XC-20为Moonbeam上独特的资产类别，其结合了Substrate资产的优点（原生可互操作性）但又使开发者能够通过预编译合约（以太坊API）使用熟悉的[ERC-20接口](/builders/interoperability/xcm/xc20/interact#the-erc20-interface){target=_blank}与之交互。在EVM方面，XC-20具有[ERC-20接口](/builders/interoperability/xcm/xc20/interact#the-erc20-interface){target=_blank}，因此智能合约和用户可以轻松地与其交互 ，并且无需了解 Substrate。这最终为开发人员在处理这些类型的资产时提供了更大的灵活性，并允许与基于EVM的智能合约（例如DEX和借贷平台等）无缝集成。 此外，开发人员可以将XC-20与常规的[以太坊开发框架](/builders/build/eth-api/dev-env/){target=_blank}或dApp集成，并使用此类资产创建互连合约策略。此外，随着[RT2301](https://github.com/moonbeam-foundation/moonbeam/tree/runtime-2301){target=_blank}的引入，所有ERC-20都已支持XCM，这意味着它们也可以作为XC-20。

![Moonbeam XC-20 XCM Integration With Polkadot](/images/builders/interoperability/xcm/overview/overview-3.png)

此页面涵盖了XC-20的基本概念，如果您想要了解如何与之交互或转移XC-20，请参考[与XC-20交互](/builders/interoperability/xcm/xc20/interact){target=_blank}或[使用X-Tokens Pallet发送XC-20](/builders/interoperability/xcm/xc20/xtokens){target=_blank}教程。

## XC-20类型 {: #types-of-xc-20s }

目前有两种XC-20类型：本地XC-20和外部XC-20。

### 什么是本地XC-20？ {: #local-xc20s }

本地XC-20是EVM上存在的所有ERC-20，可以通过XCM跨链传输。为了将本地XC-20转移到另一个平行链，资产需要在该链上注册。转移本地XC-20时，实际的Token存在于Moonbeam上目标链的主权账户中。本地XC-20必须遵循[本教程中ERC-20接口](/builders/interoperability/xcm/xc20/interact#the-erc20-interface){target=_blank}部分，它们不能自定义ERC-20。 更具体地说，`transfer`函数的函数选择器必须如[EIP-20](https://eips.ethereum.org/EIPS/eip-20){target=_blank}中所述：

```js
function transfer(address _to, uint256 _value) public returns (bool success)
```

如果`transfer`函数的函数选择器偏离标准，则跨链转账将会失败。

### 什么是外部XC-20？ {: #external-xc20s }

外部XC-20是从其他平行链或中继链转移到Moonbeam的原生跨链资产。这些资产的核心是Substrate资产。当转移外部XC-20时，实际的Token存在于每条链的Moonbeam主权账户中。所有的外部XC-20资产使用_xc_作为其名称的前缀与其他资产类别进行区分。

### 本地XC-20与外部XC-20的区别 {: #xc-20-comparison }

与其他Substrate资产一样，两种类型的XC-20都可以通过以太坊和Substrate API轻松发送到生态系统中的其他平行链。 但是，使用Substrate API进行XCM转移将为本地XC-20发出EVM日志，但不会为外部XC-20发出EVM日志。建议使用以太坊API，通过基于EVM的浏览器（例如[Moonscan](https://moonscan.io){target=_blank}）提供对XCM操作的更多可见性。

在 Moonbeam上，本地XC-20只能通过其常规ERC-20接口进行转移。 相反，外部XC-20可以通过两个接口（Substrate和ERC-20）进行转移。如果外部XC-20通过Substrate API转移，则基于EVM的区块浏览器将看不到该交易。只有通过以太坊API完成的交易才能通过此类浏览器可见。

两种资产类型的主要区别在于本地XC-20时EVM ERC-20，其具有XCM功能，然而外部XC-20是Substrate资产，顶部具有ERC-20接口。

XC-20的跨链资产转移可以通过[X-Tokens Pallet](/builders/interoperability/xcm/xc20/xtokens/){target=_blank}完成。要了解如何使用X-Tokens Pallet转移XC-20s，您可以参考[使用X-Tokens Pallet发送XC-20s](/builders/interoperability/xcm/xc20/xtokens){target=_blank}的教程。

## 当前可用的外部XC-20列表 {: #current-xc20-assets }

每个网络当前可用的外部XC-20资产列表如下所示：

=== "Moonbeam"
    |         来源          |  符号   |                                                             XC-20地址                                                             |
    |:---------------------:|:-------:|:---------------------------------------------------------------------------------------------------------------------------------:|
    |       Polkadot        |  xcDOT  | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonscan.io/token/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080){target=_blank} |
    |         Acala         | xcaSEED | [0xfFfFFFFF52C56A9257bB97f4B2b6F7B2D624ecda](https://moonscan.io/token/0xfFfFFFFF52C56A9257bB97f4B2b6F7B2D624ecda){target=_blank} |
    |         Acala         |  xcACA  | [0xffffFFffa922Fef94566104a6e5A35a4fCDDAA9f](https://moonscan.io/token/0xffffFFffa922Fef94566104a6e5A35a4fCDDAA9f){target=_blank} |
    |         Acala         | xcLDOT  | [0xFFfFfFffA9cfFfa9834235Fe53f4733F1b8B28d4](https://moonscan.io/token/0xFFfFfFffA9cfFfa9834235Fe53f4733F1b8B28d4){target=_blank} |
    |         Astar         | xcASTR  | [0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf](https://moonscan.io/token/0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf){target=_blank} |
    |        Bifrost        |  xcBNC  | [0xffffffff7cc06abdf7201b350a1265c62c8601d2](https://moonscan.io/token/0xffffffff7cc06abdf7201b350a1265c62c8601d2){target=_blank} |
    |        Bifrost        |  xcFIL  | [0xfFFfFFFF6C57e17D210DF507c82807149fFd70B2](https://moonscan.io/token/0xfFFfFFFF6C57e17D210DF507c82807149fFd70B2){target=_blank} |
    |        Bifrost        | xcvDOT  | [0xFFFfffFf15e1b7E3dF971DD813Bc394deB899aBf](https://moonscan.io/token/0xFFFfffFf15e1b7E3dF971DD813Bc394deB899aBf){target=_blank} |
    |        Bifrost        | xcvFIL  | [0xFffffFffCd0aD0EA6576B7b285295c85E94cf4c1](https://moonscan.io/token/0xFffffFffCd0aD0EA6576B7b285295c85E94cf4c1){target=_blank} |
    |        Bifrost        | xcvGLMR | [0xFfFfFFff99dABE1a8De0EA22bAa6FD48fdE96F6c](https://moonscan.io/token/0xFfFfFFff99dABE1a8De0EA22bAa6FD48fdE96F6c){target=_blank} |
    |      Centrifuge       |  xcCFG  | [0xFFfFfFff44bD9D2FFEE20B25D1Cf9E78Edb6Eae3](https://moonscan.io/token/0xFFfFfFff44bD9D2FFEE20B25D1Cf9E78Edb6Eae3){target=_blank} |
    |       Darwinia        | xcRING  | [0xFfffFfff5e90e365eDcA87fB4c8306Df1E91464f](https://moonscan.io/token/0xFfffFfff5e90e365eDcA87fB4c8306Df1E91464f){target=_blank} |
    |      Equilibrium      |  xcEQ   | [0xFffFFfFf8f6267e040D8a0638C576dfBa4F0F6D6](https://moonscan.io/token/0xFffFFfFf8f6267e040D8a0638C576dfBa4F0F6D6){target=_blank} |
    |      Equilibrium      |  xcEQD  | [0xFFffFfFF8cdA1707bAF23834d211B08726B1E499](https://moonscan.io/token/0xFFffFfFF8cdA1707bAF23834d211B08726B1E499){target=_blank} |
    |        HydraDX        |  xcHDX  | [0xFFFfFfff345Dc44DDAE98Df024Eb494321E73FcC](https://moonscan.io/token/0xFFFfFfff345Dc44DDAE98Df024Eb494321E73FcC){target=_blank} |
    |       Interlay        | xcIBTC  | [0xFFFFFfFf5AC1f9A51A93F5C527385edF7Fe98A52](https://moonscan.io/token/0xFFFFFfFf5AC1f9A51A93F5C527385edF7Fe98A52){target=_blank} |
    |       Interlay        | xcINTR  | [0xFffFFFFF4C1cbCd97597339702436d4F18a375Ab](https://moonscan.io/token/0xFffFFFFF4C1cbCd97597339702436d4F18a375Ab){target=_blank} |
    |         Manta         | xcMANTA | [0xfFFffFFf7D3875460d4509eb8d0362c611B4E841](https://moonscan.io/token/0xfFFffFFf7D3875460d4509eb8d0362c611B4E841){target=_blank} |
    |         Nodle         | xcNODL  | [0xfffffffFe896ba7Cb118b9Fa571c6dC0a99dEfF1](https://moonscan.io/token/0xfffffffFe896ba7Cb118b9Fa571c6dC0a99dEfF1){target=_blank} |
    | OriginTrail Parachain |  xcOTP  | [0xFfffffFfB3229c8E7657eABEA704d5e75246e544](https://moonscan.io/token/0xFfffffFfB3229c8E7657eABEA704d5e75246e544){target=_blank} |
    |       Parallel        | xcPARA  | [0xFfFffFFF18898CB5Fe1E88E668152B4f4052A947](https://moonscan.io/token/0xFfFffFFF18898CB5Fe1E88E668152B4f4052A947){target=_blank} |
    |       Pendulum        |  xcPEN  | [0xffffffff2257622f345e1acde0d4f46d7d1d77d0](https://moonscan.io/token/0xffffffff2257622f345e1acde0d4f46d7d1d77d0){target=_blank} |
    |         Phala         |  xcPHA  | [0xFFFfFfFf63d24eCc8eB8a7b5D0803e900F7b6cED](https://moonscan.io/token/0xFFFfFfFf63d24eCc8eB8a7b5D0803e900F7b6cED){target=_blank} |
    |       Polkadex        | xcPDEX  | [0xfFffFFFF43e0d9b84010b1b67bA501bc81e33C7A](https://moonscan.io/token/0xfFffFFFF43e0d9b84010b1b67bA501bc81e33C7A){target=_blank} |
    |  Polkadot Asset Hub   | xcUSDC  | [0xFFfffffF7D2B0B761Af01Ca8e25242976ac0aD7D](https://moonscan.io/token/0xFFfffffF7D2B0B761Af01Ca8e25242976ac0aD7D){target=_blank} |
    |  Polkadot Asset Hub   | xcUSDT  | [0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d](https://moonscan.io/token/0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d){target=_blank} |
    |       Subsocial       |  xcSUB  | [0xffffffff43b4560bc0c451a3386e082bff50ac90](https://moonscan.io/token/0xffffffff43b4560bc0c451a3386e082bff50ac90){target=_blank} |
    |       Zeitgeist       |  xcZTG  | [0xFFFFfffF71815ab6142E0E20c7259126C6B40612](https://moonscan.io/token/0xFFFFfffF71815ab6142E0E20c7259126C6B40612){target=_blank} |

     _*您可以在Polkadot.js Apps上查看每个[资产ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/assets){target=_blank}_

=== "Moonriver"
    |       来源       |  符号   |                                                                  XC-20地址                                                                  |
    |:----------------:|:-------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
    |      Kusama      |  xcKSM  | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonriver.moonscan.io/token/0xffffffff1fcacbd218edc0eba20fc2308c778080){target=_blank} |
    |     Bifrost      |  xcBNC  | [0xFFfFFfFFF075423be54811EcB478e911F22dDe7D](https://moonriver.moonscan.io/token/0xFFfFFfFFF075423be54811EcB478e911F22dDe7D){target=_blank} |
    |     Bifrost      | xcvBNC  | [0xFFffffff3646A00f78caDf8883c5A2791BfCDdc4](https://moonriver.moonscan.io/token/0xFFffffff3646A00f78caDf8883c5A2791BfCDdc4){target=_blank} |
    |     Bifrost      | xcvKSM  | [0xFFffffFFC6DEec7Fc8B11A2C8ddE9a59F8c62EFe](https://moonriver.moonscan.io/token/0xFFffffFFC6DEec7Fc8B11A2C8ddE9a59F8c62EFe){target=_blank} |
    |     Bifrost      | xcvMOVR | [0xfFfffFfF98e37bF6a393504b5aDC5B53B4D0ba11](https://moonriver.moonscan.io/token/0xfFfffFfF98e37bF6a393504b5aDC5B53B4D0ba11){target=_blank} |
    |     Calamari     |  xcKMA  | [0xffffffffA083189F870640B141AE1E882C2B5BAD](https://moonriver.moonscan.io/token/0xffffffffA083189F870640B141AE1E882C2B5BAD){target=_blank} |
    |       Crab       | xcCRAB  | [0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165](https://moonriver.moonscan.io/token/0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165){target=_blank} |
    |   Crust-Shadow   |  xcCSM  | [0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7](https://moonriver.moonscan.io/token/0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7){target=_blank} |
    |      Heiko       |  xcHKO  | [0xffffffFF394054BCDa1902B6A6436840435655a3](https://moonriver.moonscan.io/token/0xffffffFF394054BCDa1902B6A6436840435655a3){target=_blank} |
    |    Integritee    | xcTEER  | [0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e](https://moonriver.moonscan.io/token/0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e){target=_blank} |
    |      Karura      |  xcKAR  | [0xFfFFFFfF08220AD2E6e157f26eD8bD22A336A0A5](https://moonriver.moonscan.io/token/0xFfFFFFfF08220AD2E6e157f26eD8bD22A336A0A5){target=_blank} |
    |      Karura      | xcaSEED | [0xFfFffFFfa1B026a00FbAA67c86D5d1d5BF8D8228](https://moonriver.moonscan.io/token/0xFfFffFFfa1B026a00FbAA67c86D5d1d5BF8D8228){target=_blank} |
    |      Khala       |  xcPHA  | [0xffFfFFff8E6b63d9e447B6d4C45BDA8AF9dc9603](https://moonriver.moonscan.io/token/0xffFfFFff8E6b63d9e447B6d4C45BDA8AF9dc9603){target=_blank} |
    |     Kintsugi     | xcKINT  | [0xfffFFFFF83F4f317d3cbF6EC6250AeC3697b3fF2](https://moonriver.moonscan.io/token/0xfffFFFFF83F4f317d3cbF6EC6250AeC3697b3fF2){target=_blank} |
    |     Kintsugi     | xckBTC  | [0xFFFfFfFfF6E528AD57184579beeE00c5d5e646F0](https://moonriver.moonscan.io/token/0xFFFfFfFfF6E528AD57184579beeE00c5d5e646F0){target=_blank} |
    | Kusama Asset Hub | xcRMRK  | [0xffffffFF893264794d9d57E1E0E21E0042aF5A0A](https://moonriver.moonscan.io/token/0xffffffFF893264794d9d57E1E0E21E0042aF5A0A){target=_blank} |
    | Kusama Asset Hub | xcUSDT  | [0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d](https://moonriver.moonscan.io/token/0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d){target=_blank} |
    |      Litmus      |  xcLIT  | [0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0](https://moonriver.moonscan.io/token/0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0){target=_blank} |
    |     Mangata      |  xcMGX  | [0xffFfFffF58d867EEa1Ce5126A4769542116324e9](https://moonriver.moonscan.io/token/0xffFfFffF58d867EEa1Ce5126A4769542116324e9){target=_blank} |
    |     Picasso      | xcPICA  | [0xFffFfFFf7dD9B9C60ac83e49D7E3E1f7A1370aD2](https://moonriver.moonscan.io/token/0xFffFfFFf7dD9B9C60ac83e49D7E3E1f7A1370aD2){target=_blank} |
    |    Robonomics    |  xcXRT  | [0xFffFFffF51470Dca3dbe535bD2880a9CcDBc6Bd9](https://moonriver.moonscan.io/token/0xFffFFffF51470Dca3dbe535bD2880a9CcDBc6Bd9){target=_blank} |
    |      Shiden      |  xcSDN  | [0xFFFfffFF0Ca324C842330521525E7De111F38972](https://moonriver.moonscan.io/token/0xFFFfffFF0Ca324C842330521525E7De111F38972){target=_blank} |
    |      Turing      |  xcTUR  | [0xfFffffFf6448d0746f2a66342B67ef9CAf89478E](https://moonriver.moonscan.io/token/0xfFffffFf6448d0746f2a66342B67ef9CAf89478E){target=_blank} |

    _*您可以在Polkadot.js Apps上查看每个[资产ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbeam.network#/assets){target=_blank}_

=== "Moonbase Alpha"
    |         来源         |  符号  |                                                                 XC-20地址                                                                  |
    |:--------------------:|:------:|:------------------------------------------------------------------------------------------------------------------------------------------:|
    | Relay Chain Alphanet | xcUNIT | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonbase.moonscan.io/token/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080){target=_blank} |

     _*您可以在Polkadot.js Apps上查看每个[资产ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=_blank}_

### 检索外部XC-20列表与原数据信息 {: #list-xchain-assets }

要获取当前可用的外部XC-20列表以及其关联的元数据，您可以使用[Polkadot.js API](/builders/build/substrate-api/polkadot-js-api){target=_blank}查询链状态。为此，您可以遵循以下步骤：

1. 为您想要获取其资产列表的网络创建一个API提供商。 您可以为每个网络使用以下WSS端点：

    === "Moonbeam"

        ```text
        wss://wss.api.moonbeam.network
        ```

    === "Moonriver"

        ```text
        wss://wss.api.moonriver.moonbeam.network
        ```

    === "Moonbase Alpha"

        ```text
        {{ networks.moonbase.wss_url }}
        ```

2. 查询所有资产的`assets` pallet
3. 迭代资产列表以获取所有资产ID及其关联的元数据

```js
--8<-- 'code/builders/interoperability/xcm/xc20/overview/retrieve-xc20s.js'
```

结果将显示资产ID以及所有已注册外部XC-20的一些附加信息。

## 获取本地XC-20元数据信息 {: #retrieve-local-xc20-metadata }
在Moonbeam上本地XC-20s为ERC-20s，它们无法通过XCM传输至其他平行链，您可以将本地XC-20s当作ERC-20来交互。如果您有ERC-20的地址与ABI，您可以通过使用ERC-20标准接口来获取元数据信息，包括它的名字，符号以及小数点位数。
以下实例展示了如何在Moonbase Alpha上获取[Jupiter token](https://moonbase.moonscan.io/token/0x9aac6fb41773af877a2be73c99897f3ddfacf576){target=_blank}的元数据:
=== "Ethers.js"
    ```js
    --8<-- 'code/xc20/local-xc20s/ethers.js'
    ```
=== "Web3.js"
    ```js
    --8<-- 'code/xc20/local-xc20s/web3.js'
    ```
=== "Web3.py"
    ```py
    --8<-- 'code/xc20/local-xc20s/web3.py'
    ```
