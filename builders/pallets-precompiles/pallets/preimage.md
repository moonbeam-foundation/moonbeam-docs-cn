---
title: Preimage Pallet
description: Learn about the available extrinsics and storage methods for the Preimage Pallet on Moonbeam, which are used to store and manage on-chain preimages.
了解Moonbeam上Preimage Pallet的可用extrinsics和存储函数，以用于存储和管理链上原像
keywords: democracy, substrate, pallet, moonbeam, polkadot, preimage
---

# Preimage Pallet

![Preimage Moonbeam Banner](/images/builders/pallets-precompiles/pallets/preimage-banner.png)

## Introduction 概览 {: #introduction }

The Preimage Pallet allows for the users and the runtime to store the preimage of a hash on chain. This can be used by other pallets for storing and managing large byte-blobs. For example, token holders can submit a democracy proposal through the Democracy Pallet using a preimage hash. 

Preimage Pallet允许用户和Runtime在链上存储哈希的原像。其他pallet也可使用此pallet来存储和管理大的byte-blob。例句而言，Token持有者可以使用原像哈希通过Democracy Pallet提交民主提案。

--8<-- 'text/pallets/gov1-gov2.md'
Some of the functionality of the Preimage Pallet is available through the [Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage/){target=_blank}. 

Preimage Pallet的一些功能可以通过[Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage/){target=_blank}使用。

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the Preimage Pallet on Moonbeam. This guide assumes you are familiar with governance-related terminology, if not, please check out the [governance overview page](/learn/features/governance/#opengov){target=_blank} for more information.

本教程将概述Moonbeam上Preimage Pallet中的可用extrinsics、存储函数和pallet常量的获取方式。本教程假设您已熟悉治理相关的专业术语，反之您可以在[治理概览页面](/learn/features/governance/#opengov){target=_blank}获取更多信息。

## Preimage Pallet Interface - Preimage Pallet接口 {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

The Preimage Pallet provides the following extrinsics (functions):

Preimage Pallet提供以下extrinsics（函数）：

- **notePreimage**(encodedProposal) - registers a preimage for an upcoming proposal given the encoded preimage of a proposal. If the preimage was previously requested, no fees or deposits are taken for providing the preimage. Otherwise, a deposit is taken proportional to the size of the preimage. Emits a `Noted` event
- **notePreimage**(encodedProposal) - 给定提案的编码原像，为即将到来的提案注册原像。 如果先前已请求原像，则不会因提供原像而收取任何费用或押金。 否则，将根据原像的大小比例收取押金。发出`Noted`事件
- **requestPreimage**(bytes) - requests a preimage to be uploaded to the chain without paying any fees or deposits. If the preimage request has already been provided on-chain by a user, their related deposit is unreserved, and they no longer control the preimage. Emits a `Requested` event
- **requestPreimage**(bytes) - 请求将原像上传到链上，无需支付任何费用或押金。 如果用户已经在链上提供了原像请求，则他们的相关保证金将被取消保留，并且他们不再控制原像。发出`Requested`事件
- **unnotePreimage**(hash) - clears an unrequested preimage from the runtime storage given the hash of the preimage to be removed. Emits a `Cleared` event
- **unnotePreimage**(hash) - 给定要删除的原像哈希，从runtime存储中清除未请求的原像。发出`Cleared`事件
- **unrequestPreimage**(hash) - clears a previously made request for a preimage. Emits a `Cleared` event
- **unrequestPreimage**(hash) - 清除先前提出的原像请求。发出`Cleared`事件

### Storage Methods 存储函数 {: #storage-methods }

The Preimage Pallet includes the following read-only storage methods to obtain chain state data:

Preimage Pallet包括以下只读存储函数来获取链上状态数据：

- **palletVersion**() - returns the current pallet version
- **palletVersion**() - 返回当前pallet版本
- **preimageFor**((H256, u32)) - returns a list of the proposal hashes of all preimages along with their associated data. If given a proposal hash and the length of the associated data, a specific preimage is returned
- **preimageFor**((H256, u32)) - 返回所有原像及其关联数据的提案哈希列表。如果给定提案哈希和关联数据的长度，则返回特定的原像
- **statusFor**(H256) - returns the request status of all preimages or for a given preimage hash 
- **statusFor**(H256) - 返回所有原像或给定原像哈希的请求状态
