---
title: Preimage Pallet（原像Pallet）
description: 了解Moonbeam上Preimage Pallet的可用extrinsics和存储函数，以用于存储和管理链上原像
keywords: 民主, substrate, pallet, moonbeam, polkadot, 波卡, 原像
---

# Preimage Pallet

![Preimage Moonbeam Banner](/images/builders/pallets-precompiles/pallets/preimage-banner.png)

## 概览 {: #introduction }

Preimage Pallet允许用户和Runtime在链上存储原像哈希。其他pallet也可使用此pallet来存储和管理大的字节码（byte-blob）。例如，Token持有者可以使用原像哈希通过Democracy Pallet提交民主提案。

治理相关功能是基于3个新的pallet和预编译：[Preimage Pallet](/builders/pallets-precompiles/pallets/preimage){target=_blank}和[Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage){target=_blank}、[Referenda Pallet](/builders/pallets-precompiles/pallets/referenda){target=_blank}和[Referenda Precompile](/builders/pallets-precompiles/precompiles/referenda){target=_blank}，以及[Conviction Voting Pallet](/builders/pallets-precompiles/pallets/conviction-voting){target=_blank}和[Conviction Voting Precompile](/builders/pallets-precompiles/precompiles/conviction-voting){target=_blank}。上述预编译是Solidity接口，使您能够使用以太坊API执行治理功能。

本教程将概述Moonbeam上Preimage Pallet中的可用extrinsics、存储函数和pallet常量的获取方式。本教程假设您已熟悉治理相关的专业术语，反之您可以在[治理概览页面](/learn/features/governance/#opengov){target=_blank}获取更多信息。

## Preimage Pallet接口 {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

Preimage Pallet提供以下extrinsics（函数）：

- **notePreimage**(encodedProposal) - 给定提案的编码原像，为即将到来的提案注册原像。 如果先前已请求原像，则不会因提供原像而收取任何费用或押金。 否则，将根据原像的大小比例收取押金。发出`Noted`事件
- **requestPreimage**(bytes) - 请求将原像上传到链上，无需支付任何费用或押金。 如果用户已经在链上提供了原像请求，则他们的相关保证金将被取消保留，并且他们不再控制原像。发出`Requested`事件
- **unnotePreimage**(hash) - 给定要删除的原像哈希，从runtime存储中清除未请求的原像。发出`Cleared`事件
- **unrequestPreimage**(hash) - 清除先前提出的原像请求。发出`Cleared`事件

### 存储函数 {: #storage-methods }

Preimage Pallet包括以下只读存储函数来获取链上状态数据：

- **palletVersion**() - 返回当前pallet版本
- **preimageFor**((H256, u32)) - 返回所有原像及其关联数据的提案哈希列表。如果给定提案哈希和关联数据的长度，则返回特定的原像
- **statusFor**(H256) - 返回所有原像或给定原像哈希的请求状态
