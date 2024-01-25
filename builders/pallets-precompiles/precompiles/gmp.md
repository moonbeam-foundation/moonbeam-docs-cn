---
title: GMP预编译
description: 学习在Moonbeam上的GMP预编译，以及如何通过如Wormhole提供的桥使用Moonbeam路由流动性计划
keywords: solidity, ethereum, GMP, wormhole, moonbeam, bridge, connected, contracts, MRL
---

# 与GMP预编译交互

## 概览 {: #introduction }

Moonbeam路由流动性（MRL）是指Moonbeam作为端口平行链的用例，适用于从源链到其他波卡平行链的流动性。此用例因为通用消息传递（GMP）的出现而实现，其中带有任意数据和Token的消息可以通过[与链无关的GMP协议](/builders/interoperability/protocols){target=\_blank}在非平行链区块链上发送。这些GMP协议可以与[波卡的XCM消息传递系统](/builders/interoperability/xcm/overview){target=\_blank}结合，以实现无缝流动性路由。

GMP预编译充当Moonbeam路由流动性的接口，作为来自GMP协议的承载Token消息和通过[XCMP](/builders/interoperability/xcm/overview/#xcm-transport-protocols){target=\_blank}连接到Moonbeam的平行链之间的中间人。目前GMP预编译仅支持通过 [Wormhole GMP协议](/builders/interoperability/protocols/wormhole){target=\_blank}传递流动性。

GMP预编译位于以下地址：

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.gmp}}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.gmp}}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.gmp}}
     ```

实际上，开发者不太可能直接与预编译进行交互。GMP协议的中继层与预编译交互以完成跨链操作，因此跨链操作起源的源链是开发者有责任确保*最终*使用GMP预编译的地方。

## GMP Solidity接口 {: #the-gmp-solidity-interface }

[`Gmp.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/gmp/Gmp.sol){target=\_blank}是一个允许开发者与预编译交互的Solidity接口：

- **wormholeTransferERC20**(*bytes memory* vaa) - 接受一个Wormhole的桥接转账[VAA (Verified Action Approval)](https://book.wormhole.com/wormhole/4_vaa.html){target=_blank}，通过Wormhole Token桥铸造Token并将流动性转移至自定义的有效负载[multilocation](/builders/interoperability/xcm/overview/#general-xcm-definitions){target=_blank}。有效负载被预计称为预编译专属的SCALE编码项目，如先前在此教程的[Wormhole部分](#building-the-payload-for-wormhole)解释一般

VAA为在源链交易后生成的包含有效负载的包，由Wormhole[守护者网络间谍](https://book.wormhole.com/wormhole/6_relayers.html?search=#specialized-relayers){target=\_blank}发现。

用户必须与预编译交互的最常见实例是在恢复的情况下，也就是中继器不完成MRL事务。举例来说，用户必须搜索其源链交易附带的VAA，然后手动调用`wormholeTransferERC20`函数。

## 为Wormhole构建有效负载 {: #building-the-payload-for-wormhole }

目前GMP预编译仅支持使用Wormhole通过Moonbeam发送流动性以及发送到其他平行链。GMP预编译不协助从平行链返回Moonbeam以及其他Wormhole连接链的路线。

要从像以太坊这样的与Wormhole连接的源链发送流动性，用户必须调用[`transferTokensWithPayload`函数](https://book.wormhole.com/technical/evm/tokenLayer.html#contract-controlled-transfer){target=\_blank}在[WormholeTokenBridge智能合约](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/interfaces/ITokenBridge.sol){target=\_blank}的[origin-chain部署](https://book.wormhole.com/reference/contracts.html#token-bridge){target=\_blank}。此函数需要一个字节有效负载，该有效负载必须格式化为包含在[另一个预编译特定版本类型](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/precompiles/gmp/src/types.rs#L25-L48){target=\_blank}中的SCALE编码multilocation对象。

如果您不熟悉波卡生态系统，您可能不熟悉SCALE编码和multilocation。[SCALE编码](https://docs.substrate.io/reference/scale-codec/){target=\_blank}是波卡使用的一种紧凑形式的编码。[`MultiLocation`类型](https://wiki.polkadot.network/docs/learn-xcvm){target=\_blank}用于定义波卡中的相对点，例如特定平行链上的特定账户（Polkadot区块链）。

Moonbeam的GMP协议需要一个multilocation来代表流动性路由的目的地，目的地可能代表着其他平行链上的账户。不论它是什么，这个目的地必须相对于Moonbeam来表达。

!!! 注意事项
    Multilocation以相对形式出现是非常重要的，因为平行链团队有可能给你一个相对于他们自身链的multilocation，有可能与你认知不同。提供错误的multilocation有可能导致**资金损失**！

每一个平行链有他们自己解读multilocation的函数，建议您与项目确认您所形成的multilocation是正确的，也就是说，一个最有可能通过账户形成的multilocation。

有很多种账户可以被包含在multilocation之中，您需要在行程您的multilocation之前了解相关信息。其中两种最常见的分别为：

- **AccountKey20** — 20个字节长的账户ID，包含如在Moonbeam中的以太坊兼容账户ID
- **AccountId32** — 32个字节长的账户ID，为波卡及平行链的标准

以下multilocation模板以其他平行链上的账户为目标，以Moonbeam作为相对来源。要使用它们，请将`INSERT_PARACHAIN_ID`替换为您希望向其发送资金的网络的平行链ID，并将`INSERT_ADDRESS`替换为您希望向该平行链发送资金的账户地址。

=== "AccountId32"

    ```js
    {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 'INSERT_PARACHAIN_ID' },
          {
            AccountId32: {
              id: 'INSERT_ADDRESS',
            },
          },
        ],
      },
    }
    ```

=== "AccountKey20"

    ```js
    {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 'INSERT_PARACHAIN_ID' },
          {
            AccountKey20: {
              key: 'INSERT_ADDRESS',
            },
          },
        ],
      },
    }
    ```

如果没有正确的工具，可能很难对整个有效负载进行正确的SCALE编码，特别是因为[预编译所需的自定义类型](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/precompiles/gmp/src/types.rs#L25-L48){target=\_blank}。幸运的是，有波卡JavaScript包可以帮助实现这一点。

这个预编译合约接受的user action有V1和V2两个版本。V1版本接受`XcmRoutingUserAction`类型，它会尝试将资产传送至multilocation定义的目标地址。V2版本接受`XcmRoutingUserActionWithFee`类型，它不仅会尝试将资产传送至目标地址，同时也接受费用的支付。中继节点能够使用V2版来定义处理交易所需要在Moonbeam支付的费用。

以下脚本展示了如何创建可用作GMP预编译有效负载的`Uint8Array`：

=== "V1"

    ```typescript
    --8<-- 'code/builders/pallets-precompiles/precompiles/gmp/v1-payload.ts'
    ```

=== "V2"

    ```typescript
    --8<-- 'code/builders/pallets-precompiles/precompiles/gmp/v2-payload.ts'
    ```

## 限制 {: #restrictions }

GMP预编译仍然在其发展的早期阶段，目前还是有许多限制，当前仅支持至平行链“满意路径”。以下为您需要了解的限制内容：

- 目前没有费用机制。在Moonbeam上运行将流动性转移至其他平行链的中继层将会负责支付交易费用，此机制或将在未来更动
- 预编译并不会确保目标链是否支持传送的Token。**错误的multilocation有可能导致资金损失**
- 错误的构建multilocation将导致回溯，Token将会被锁住并导致资金损失
- 目前并没有从平行链至其他如以太坊的链的返回路径。这会是一个在一键方案实现前需要研究的协议层级课题
    - 由于ERC-20 XC资产的限制，通过Moonbeam从平行链发送回Token的唯一方法是在原始平行链上拥有xcGLMR，并在发送回Token时将其用作费用
