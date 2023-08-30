---
title: 随机数Pallet
description: 学习Moonbeam上随机数Pallet中的可用extrinsics、存储方法和常量，以检索随机请求和结果的数据。
keywords: randomness, VRF, substrate, pallet, moonbeam, polkadot
---

# 随机数Pallet

## 概览 {: #introduction }

Moonbeam使用可验证随机函数（Verifiable Random Functions，VRF）生成可以在链上验证的随机数。VRF是一种利用一些输入值并产生随机数的加密函数，并证明这些数值是由提交者生成。此证明可以由任何人验证，以确保准确计算生成的随机数计算。关于Moonbeam上随机数的更多信息，例如随机数来源、请求和完成周期等，请参考[Moonbeam上的随机数](/learn/features/randomness){target=_blank}的概览页面。

随机数Pallet使您能够查看尚未完成或清除随机请求、随机结果等。要实际请求和完成随机数，您可以使用随机数预编译和随机数消费者合约。预编译是一个Solidity接口，能够通过以太坊API请求随机数、查看请求状态、完成请求以及更多。关于如何使用这两种合约的更过信息，请参考[随机数预编译教程](/builders/pallets-precompiles/precompiles/randomness){target=_blank}。

本文将提供一个在随机数Pallet中可用Pallet常量的存储函数和getters的概览。

## 随机数Pallet接口 {: #parachain-staking-pallet-interface }

### 存储方法 {: #storage-methods } 

随机数Pallet包含以下只读存储方法来获取链状态数据：

- **localVrfOutput**() - 返回当前本地每个区块VRF随机数
- **palletVersion**() - 返回当前pallet版本
- **randomnessResults**(PalletRandomnessRequestType) - 完成所有具有相同原始随机数的请求的随机数快照
- **relayEpoch**() - 返回中继Epoch
- **requestCount**() - 返回至今为止发出的随机请求数量以及用于生成下一个请求的UID
- **requests**(u64) - 返回给定随机请求或所有尚未完成或清除的随机请求

### Pallet常量 {: #constants }

随机数Pallet包含以下只读函数来获取Pallet常量：

- **blockExpirationDelay**() - 在本地VRF请求过期并被清除前必须经过的区块数量
- **deposit**() - 当请求随机词时应作为安全保证金的数量。每个请求需要一笔保证金
- **epochExpirationDelay**() - 在BABE请求过期并被清除前必须经过的Epoch数量
- **maxBlockDelay**() - （发出请求之后）在本地VRF请求被完成前必须经过的最大区块数量
- **maxRandomWords**() - 最大可被请求的随机词数量
- **minBlockDelay**() - （发出请求之后）在本地VRF请求被完成前必须经过的最小区块数量