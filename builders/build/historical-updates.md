---
title: 历史更新
description: Moonbeam和Moonriver上历史更新概览，包含应用于Moonbeam代源码上的迁移内容和漏洞修复记录。
---

# 历史更新

![Historical Updates Banner](/images/builders/build/historical-updates/banner.png)

## 概览 {: #introduction }

此页面提供一个关于Moonbeam和Moonriver上的历史更新概览，例如Moonbeam源代码的漏洞修复记录和应用的数据迁移。

此页面旨在提供与需要执行数据迁移更新有关的意外行为和数据不一致的信息。

## 漏洞修复 {: #bug-fixes }

#### 无效交易存储 {: #invalid-transactions-stored }

对于无法支付交易成本的无效交易，EVM pallet会将交易元数据插入存储系统而非丢弃它，因为没有交易成本的验证。因此，runtime存储系统因无效交易数据而变得不必要的膨胀。

此漏洞仅影响Moonriver和Moonbase Alpha并存在于以下Runtime和区块区间：

|      网络      | 出现时间 | 修复时间 | 影响的区块区间 |
|:--------------:|:--------:|:--------:|:--------------:|
|   Moonriver    |   RT49   |  RT600   |   0 - 455106   |
| Moonbase Alpha |   RT40   |  RT600   |   0 - 675175   |

关于更多信息，您可以查看[GitHub上的相关Frontier PR](https://github.com/paritytech/frontier/pull/465){target=_blank}。

***

#### 以太坊费用未发送至财政库 {: #ethereum-fees-to-treasury }

Moonbeam上的交易费用模型有20%的费用进入链上财政库，80%作为通缩力量销毁。在runtime 800之前，以太坊交易不会导致20%的交易费用进入链上财政库。

此漏洞仅影响Moonriver和Moonbase Alpha并存在于以下Runtime和区块区间：

|      网络      | 出现时间 | 修复时间 | 影响的区块区间 |
|:--------------:|:--------:|:--------:|:--------------:|
|   Moonriver    |   RT49   |  RT800   |   0 - 684728   |
| Moonbase Alpha |   RT40   |  RT800   |   0 - 915684   |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/732){target=_blank}.

***

#### 遗失返还资金 {: #missing-refunds }

Moonbeam配置为将保留账户最低存款（Existential Deposit）设置为0，代表所有账户不需要最低余额数量即可被视为活跃。对于具有此配置的基于Substrate的链而言，由于零余额帐户被视为不存在，因此遗漏对该帐户的退款。

此漏洞存在于以下Runtime和区块区间：

|      网络      | 出现时间 | 修复时间 | 影响的区块区间 |
|:--------------:|:--------:|:--------:|:--------------:|
|    Moonbeam    |  RT900   |  RT1001  |    0 - 5164    |
|   Moonriver    |   RT49   |  RT1001  |  0 - 1052241   |
| Moonbase Alpha |   RT40   |  RT1001  |  0 - 1285915   |

关于更多信息，您可以在Github上查看[相关Frontier PR](https://github.com/paritytech/frontier/pull/509){target=_blank}以及有关的[Substrate PR](https://github.com/paritytech/substrate/issues/10117){target=_blank}。

***

#### 错误收集人选择 {: #incorrect-collator-selection }

当通过`delegatorBondMore` extrinsic增加委托时，收集人候选人的总委托并未正确更新。这导致增加的委托金额未包含在候选人的总金额中，而该金额是用于确定哪些候选人会在活跃的收集人集中。因此，即使一些候选人实际上应该进入活动集中，但他们因此问题而没有被选中进入活跃收集人集中，从而影响他们自己和他们的委托人的奖励。

此漏洞存在于以下Runtime和区块区间：

|      网络      | 出现时间 | 修复时间 | 影响的区块区间 |
|:--------------:|:--------:|:--------:|:--------------:|
|    Moonbeam    |  RT900   |  RT1300  |   0 - 524762   |
|   Moonriver    |   RT49   |  RT1300  |  0 - 1541735   |
| Moonbase Alpha |   RT40   |  RT1300  |  0 - 1761128   |

关于更多信息，您可以在[GitHub上查看相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1291){target=_blank}。

***

#### 新账户事件漏洞 {: #new-account-event }

创建新帐户时会发出`System.NewAccount`事件。但是，存在一个漏洞，即某些帐户在创建时未发出此事件。已应用一个修补程序来修补受影响的帐户并在稍后发出`System.NewAccount`。

该修补程序已应用于以下区块区间：

|      网络      |                                                              区块区间                                                               |
|:--------------:|:-----------------------------------------------------------------------------------------------------------------------------------:|
|    Moonbeam    | [1041355 - 1041358 和 1100752](https://moonbeam.subscan.io/extrinsic?module=evm&call=hotfix_inc_account_sufficients){target=_blank} |
|   Moonriver    |      [1835760 - 1835769](https://moonriver.subscan.io/extrinsic?module=evm&call=hotfix_inc_account_sufficients){target=_blank}      |
| Moonbase Alpha |  [2097782 - 2097974](https://moonbase.subscan.io/extrinsic?address=&module=evm&call=hotfix_inc_account_sufficients){target=_blank}  |


此漏洞存在于以下Runtime和区块区间：

|      网络      | 出现时间 | 修复时间 | 影响的区块区间 |
|:--------------:|:--------:|:--------:|:--------------:|
|    Moonbeam    |  RT900   |  RT1401  |   0 - 915320   |
|   Moonriver    |   RT49   |  RT1401  |  0 - 1705939   |
| Moonbase Alpha |   RT40   |  RT1400  |  0 - 1962557   |

关于更多信息，您可以在[GitHub上查看相关的Frontier PR](https://github.com/moonbeam-foundation/frontier/pull/46/files){target=_blank}.

***

#### 错误时间戳单位 {: #incorrect-timestamp-units }

EIP-2612和以太坊区块以秒为单位处理时间戳，然而Moonbeam采用的Substrate时间戳使用毫秒。此漏洞仅影响EIP-2612的实现，而非`block.timestamp`数值。

此漏洞存在于以下Runtime和区块区间：

|      网络      | 出现时间 | 修复时间 | 影响的区块区间 |
|:--------------:|:--------:|:--------:|:--------------:|
|    Moonbeam    |  RT900   |  RT1606  |  0 - 1326697   |
|   Moonriver    |   RT49   |  RT1605  |  0 - 2077598   |
| Moonbase Alpha |   RT40   |  RT1603  |  0 - 2285346   |

关于更多信息，您可以在[GitHub上查看相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1451){target=_blank}。

***

#### 错误委托奖励计算 {: #incorrect-delegation-reward-calculation }

每当有待处理请求时，所有委托和收集人的奖励支出都被低估了。委托奖励是根据每个委托人绑定的Token数量相对于给定收集人的总占比计算的。通过计算待处理请求的委托金额，收集人及其委托的奖励低于原本应有的水平。

此漏洞存在于以下Runtime和区块区间：

|      网络      | 出现时间 | 修复时间 |  影响的区块区间   |
|:--------------:|:--------:|:--------:|:-----------------:|
|    Moonbeam    |  RT1001  |  RT1802  |  5165 - 1919457   |
|   Moonriver    |  RT1001  |  RT1801  | 1052242 - 2572555 |
| Moonbase Alpha |  RT1001  |  RT1800  | 1285916 - 2748785 |

关于更多信息，您可以在[GitHub上查看相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1719){target=_blank}。

***

#### 区块母哈希错误计算 {: #block-parent-hash-calculated-incorrectly }

在EIP-1559推出后，其包含的新以太坊交易种类，让区块头的母哈希被错误计算为`H256::default`。

此漏洞仅影响Moonbase Alpha并存在于以下Runtime和区块区间：

|      网络      | 出现时间 | 修复时间 |  影响的区块区间   |
|:--------------:|:--------:|:--------:|:-----------------:|
| Moonbase Alpha |  RT1200  |  RT1201  | 1648994 - 1679618 |

关于更多信息，您可以在[GitHub上查看相关Frontier PR](https://github.com/paritytech/frontier/pull/570){target=_blank}。

***

#### EIP-1559汽油费的错误处理 {: #incorrect-gas-fees-eip1559 }

随着EIP-1559支持的引入，处理`maxFeePerGas`和`maxPriorityFeePerGas`的逻辑被错误地实现了，导致`maxPriorityFeePerGas`被添加到`baseFee`中，即使总和超过了`maxFeePerGas`。

此漏洞存在于以下Runtime和区块区间：

|      网络      | 出现时间 | 修复时间 |  影响的区块区间   |
|:--------------:|:--------:|:--------:|:-----------------:|
|    Moonbeam    |  RT1201  |  RT1401  |  415946 - 915320  |
|   Moonriver    |  RT1201  |  RT1401  | 1471037 - 1705939 |
| Moonbase Alpha |  RT1200  |  RT1400  | 1648994 - 1962557 |

关于更多信息，您可以查看[相关Frontier PR](https://github.com/moonbeam-foundation/frontier/pull/45){target=_blank}.

***

#### 支付给收集人的交易费用 {: #transaction-fees-paid-to-collators }

对于包含优先费用的EIP-1559交易的区块，交易费用被错误地计算并分配给了区块的收集人。Moonbeam上用于交易和智能合约执行的费用模型经过设计，20%的费用将存入链上财政库，80%将作为通货紧缩力量而销毁。由于这个漏洞，受影响交易的交易费用没有按预期销毁。

此漏洞存在于以下Runtime和区块区间：

|      网络      | 出现时间 | 修复时间 |  影响的区块区间   |
|:--------------:|:--------:|:--------:|:-----------------:|
|    Moonbeam    |  RT1201  |  RT1504  | 415946 - 1117309  |
|   Moonriver    |  RT1201  |  RT1504  | 1471037 - 1910639 |
| Moonbase Alpha |  RT1200  |  RT1504  | 1648994 - 2221772 |

关于更多信息，您可以在[GitHub上查看相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1528){target=_blank}。

***

#### 错误状态根哈希 {: #incorrect-state-root-hash }

由于未考虑交易类型字节，因此对于非遗留交易的状态根哈希计算部分错误。在[EIP-2930](https://eips.ethereum.org/EIPS/eip-2930){target=_blank}和[EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank}的支持下，引入的交易类型分别为`0x01`（1）和`0x02`（2）。这些交易类型在状态根哈希的计算中被忽略。

此漏洞存在于以下Runtime和区块区间：

|      网络      | 出现时间 | 修复时间 |  影响的区块区间   |
|:--------------:|:--------:|:--------:|:-----------------:|
|    Moonbeam    |  RT1201  |  RT1701  | 415946 - 1581456  |
|   Moonriver    |  RT1201  |  RT1701  | 1471037 - 2281722 |
| Moonbase Alpha |  RT1200  |  RT1700  | 1648994 - 2529735 |

关于更多信息，您可以在GitHub上查看[相关Frontier PR](https://github.com/moonbeam-foundation/frontier/pull/86){target=_blank}和[Moonbeam PR](https://github.com/moonbeam-foundation/moonbeam/pull/1678/files){target=_blank}。

***

#### Ethereum Transations Duplicated in Storage {: #ethereum-transactions-duplicated-in-storage }

以太坊Pallet中的Frontier引入了一个上游错误，导致Runtime升级时存在的待处理交易在两个不同区块的存储中发生重复。此错误仅影响引入此错误的Runtime升级后的前两个区块。

仅有Moonriver和Moonbase Alpha被影响。此错误在以下Runtime发生并影响以下区块：

|      网络      | 出现时间 |   影响的区块区间    |
|:--------------:|:--------:|:-------------------:|
|   Moonriver    |  RT1605  | 2077599 and 2077600 |
| Moonbase Alpha |  RT1603  | 2285347 and 2285348 |

以下交易被复制：

=== "Moonriver"

    ```js
    '0x2cceda1436e32ae3b3a2194a8cb5bc4188259600c714789bae1fedc0bbc5125f',
    '0x3043660e35e89cafd7b0e0dce9636f5fcc218fce2a57d1104cf21aabbff9a1c0',
    '0x514411fb5c08f7c5aa6c61c38f33edfa74ff7e160831f6140e8dd3783648dbca',
    '0xf1647c357d8e1b05c522d11cff1f5090a4df114595d0f4b9e4ac5bb746473eea',
    '0x4be94803fe7839d5ef13ddd2633a293b4a7dddbe526839c15c1646c72e7b0b23',
    '0x15fceb009bd49692b598859f9146303ed4d8204b38e35c147fcdb18956679dbe',
    '0xa7460d23d5c633feec3d8e8f4382240d9b71a0d770f7541c3c32504b5403b70c',
    '0x1c838b4c4e7796a9db5edfd0377aee6e0d89b623bf1d7803f766f4cf71daefb9',
    '0xfb233a893e62d717ed627585f14b1ee8b3e300ac4e2c3016eb63e546a60820f0',
    '0xfaf8908838683ad51894eb3c68196afb99ba2e2bb698a40108960ee55417b56a',
    '0xa53973acbeac9fe948015dcfad6e0cb28d91b93c8115347c178333e73fd332d3',
    '0x9df769c96c5fdd505c67fee27eaff3714bf8f3d45a2afc02dd2984884b3cecac',
    '0x8f912ae91b408f082026992a87060ed245dac6e382a84288bd38fc08dbac30fe',
    '0xb22af459d24cb25bc53785bdd0ae6a573e24f226c94fd8d2e4663b87d3b07a88',
    '0x8ab9cd2bde7d679f798528b0c75325787f5fc7997e00589445b35b3954a815aa',
    '0xd08a1f82f4d3dc553b4b559925f997ef8bb85cb24cb4d0b893f017129fb33b78',
    '0xa1d40bce7cc607c19ca4b37152b6d8d3a408e3de6b9789c5977fcdef7ef14d97',
    '0xe442227634db10f5d0e8c1da09f8721c2a57267edbf97c4325c4f8432fd48ade',
    '0x0b4f5d8338a7c2b1604c1c42e96b12dc2a9d5ab264eb74ff730354e9765de13f',
    '0x0b00fc907701003aad75560d8b1a33cbf4b75f76c81d776b8b92d20e1d2e9d31',
    '0x9c18bd783f28427d873970ff9deaf1549db2f9a76e3edd6bdeae11358e447ef4',
    '0x8b2523f163989969dd0ebcac85d14805756bc0075b89da1274fd2c53ccaa396a',
    '0x47e80a0c533265974a55ea62131814e31b10f42895709f7e531e3e7b69f1387c'
    ```

=== "Moonbase Alpha"

    ```js
    '0x006a6843eb35ad35a9ea9a99affa8d81f1ed500253c98cc9c080d84171a0afb3',
    '0x64c102f664eb435206ad4fcb49b526722176bcf74801c79473c3b5b2c281a243',
    '0xf546335453b6e35ce7e236ee873c96ba3a22602b3acc4f45f5d68b33a76d79ca',
    '0x4ed713ccd474fc33d2022a802f064cc012e3e37cd22891d4a89c7ba3d776f2db',
    '0xa5355f86844bb23fe666b10b509543fa377a9e324513eb221e0a2c926a64cae4',
    '0xc14791a3a392018fc3438f39cac1d572e8baadd4ed350e0355d1ca874a169e6a'
    ```

被复制的交易属于第一个区块。因此，在Moonriver上的交易属于区块2077599，而在Moonbase Alpha上受影响的交易属于2285347。

关于更多信息，您可以在[GitHub上查看相关Frontier PR](https://github.com/paritytech/frontier/pull/638){target=_blank}。

***

#### 非交易调用的过高Gas限制 {: #gas-limit-too-high-for-non-transactional-calls }

当进行非交易调用时，例如`eth_call`或`eth_estimateGas`，在没有为过去的区块指定Gas限制的情况下进行时，客户端默认使用Gas限制乘数（10x），这会导致Gas限制验证失败。因为它是针对区块Gas限制的上限进行验证的。因此，如果给定调用的Gas限制大于区块Gas限制，则会返回Gas限制过高错误的结果。

此漏洞存在于以下Runtime和区块区间：

|      网络      | 出现时间 | 修复时间 |  影响的区块区间   |
|:--------------:|:--------:|:--------:|:-----------------:|
|    Moonbeam    |  RT1701  |  RT1802  | 1581457 - 1919457 |
|   Moonriver    |  RT1701  |  RT1802  | 2281723 - 2616189 |
| Moonbase Alpha |  RT1700  |  RT1802  | 2529736 - 2879402 |

关于更多信息，您可以在[GitHub上查看相关Frontier PR](https://github.com/paritytech/frontier/pull/935){target=_blank}。

***

#### Remote EVM Calls Return Identical Transaction Hashes {: #remote-evm-calls-return-identical-tx-hashes }

当从具有相同交易负载和随机数的不同账户发送多个远程EVM调用时，每个调用都会返回相同的交易哈希。这是极有可能的，因为远程EVM调用通过无密钥账户执行，因此如果发送者都具有相同的随机数并且发送相同的交易对象，则交易哈希的计算将会没有差异。此问题已通过向以太坊使远程EVM调用成为可能的XCM Pallet添加全局随机数解决。

此漏洞仅影响Moonbase Alpha并存在于以下Runtime和区块区间：

|      网络      | 出现时间 | 修复时间 |  影响的区块区间   |
|:--------------:|:----------:|:------:|:--------------------:|
| Moonbase Alpha |   RT1700   | RT1900 |  2529736 - 3069634   |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1790){target=_blank}。

***

## 迁移 {: #migrations }

当更改或添加存储项并需要用数据填充时，迁移是必要的。下面列出的迁移部分是由受影响的pallet来分类的。

### 作者映射pallet {: #author-mapping }

#### 更新映射存储项 {: #update-mapping-storage-item }

此迁移更新了作者映射pallet现已弃用的`Mapping`存储项，以使用更安全的哈希器类型。哈希器类型已更新为[Blake2_128Concat](https://paritytech.github.io/substrate/master/frame_support/struct.Blake2_128Concat.html){target=_blank}而非[Twox64Concat](https://paritytech.github.io/substrate/master/frame_support/struct.Twox64Concat.html){target=_blank}。

此迁移仅适用于Moonriver和Moonbase Alpha，并在以下Runtime和区块执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|   Moonriver    |    RT800    |  684728  |
| Moonbase Alpha |    RT800    |  915684  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/679){target=_blank}。

***

#### 添加VRF密钥支持 {: #add-support-for-vrf-keys }

当推出VRF密钥支持时，作者映射pallet的`MappingWithDeposit`存储项已更新为包含`keys`字段以支持可通过Nimbus ID查找的VRF密钥。因此，此处应用迁移以使用此新字段更新现有存储项。

此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|    Moonbeam    |   RT1502    | 1107285  |
|   Moonriver    |   RT1502    | 1814458  |
| Moonbase Alpha |   RT1502    | 2112058  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1407){target=_blank}。

***

#### 一个Nimbus ID对应一个账户ID {: #one-nimbus-id-per-account-id }

此处应用迁移以确保一个帐户ID只能有一个Nimbus ID。此迁移接受给定帐户拥有的第一个Nimbus ID，并清除与该帐户关联的任何其他Nimbus ID。对于任何已清除的相关内容，该相关内容的保证金将被退还。

此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|    Moonbeam    |   RT1606    | 1326697  |
|   Moonriver    |   RT1605    | 2077599  |
| Moonbase Alpha |   RT1603    | 2285347  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1525){target=_blank}。

***

### 基础费用Pallet {: #base-fee }

#### 设置弹性存储项数值 {: #set-elasticity }

此迁移部分将基础费用pallet的`Elasticity`存储项设置为0，从而使`BaseFeePerGas`保持不变。

此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|    Moonbeam    |   RT1300    |  524762  |
|   Moonriver    |   RT1300    | 1541735  |
| Moonbase Alpha |   RT1300    | 1761128  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1744){target=_blank}。

***

### 民主Pallet {: #democracy }

#### 原像存储转移至新的原像Pallet

此处应用迁移将存储在民主pallet中的原像移动到新的原像pallet。由于[波卡的上游更改](https://github.com/paritytech/substrate/pull/11649){target=_blank}，需要在Moonbeam上进行此迁移。

Moonbeam中有一个原像受到影响，其从调度程序队列中被丢弃并且从未执行过：`0x14262a42aa6ccb3cae0a169b939ca5b185bc317bb7c449ca1741a0600008d306`。这个原像已被最初提交原像的账户 [手动移除](https://moonbeam.subscan.io/extrinsic/2693398-8){target=_blank}了。


此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|    Moonbeam    |   RT2000    | 3310369  |
|   Moonriver    |   RT2000    | 3202604  |
| Moonbase Alpha |   RT2000    | 2673234  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1962){target=_blank}。

***

### 平行链质押Pallet {: #parachain-staking }

#### 更新收集人状态存储项 {: #update-collator-state-storage-item }

此处应用迁移将平行链质押pallet的`Collator`存储项更新为新的`Collator2`存储项。此变动更新了收集人状态以包括以下内容：

- `nominators`集是所有提名人（委托人）帐户ID的列表，不包含各自的绑定余额
- 一个新的`top_nominators`存储项，返回所有最高提名人的列表，这些提名人按绑定金额从大到小排序
- 一个新的`bottom_nominators`存储项，返回所有底部提名人的列表，按绑定金额从最小到最大排序
- `total`存储项已替换为`total_counted`和`total_backing`。 `total_counted`返回最高提名和收集人自身绑定金额的总和，而`total_backing`返回所有提名人和收集人自身绑定金额的总和

此迁移仅适用于Moonriver和Moonbase Alpha，并在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|   Moonriver    |    RT53     |   9696   |
| Moonbase Alpha |    RT52     |  238827  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/505){target=_blank}。

***

#### 修补总质押数量 {: #patch-total-staked-amount }

由于一个可能导致数量不正确的潜在漏洞，此处对平行链质押Pallet中`CollatorState`存储项的`total`质押金额进行了迁移。

此迁移仅适用于Moonriver和Moonbase Alpha，并在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|   Moonriver    |    RT53     |   9696   |
| Moonbase Alpha |    RT52     |  238827  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/502){target=_blank}。

***

#### 支持延迟提名人（委托人）离开 {: #support-delayed-nominator-exits }

用于处理候选人退出的退出队列已更新成包括对延迟提名人（委托人）退出和撤销的支持，这需要迁移以将`ExitQueue`平行链质押pallet存储项更新为`ExitQueue2`。 `NominatorState`存储项也被迁移到`NominatorState2`，以防止提名人在已经安排退出时执行更多提名。

此部分迁移仅适用于Moonriver和Moonbase Alpha，并在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|   Moonriver    |    RT200    |  259002  |
| Moonbase Alpha |    RT200    |  457614  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/610){target=_blank}。

***

#### 清除质押存储膨胀 {: #purge-staking-storage-bloat }

此处应用迁移来清除超过两轮的平行链质押pallet的`Points`和`AtStake`存储项的质押存储膨胀。

此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|    Moonbeam    |   RT1001    |   5165   |
|   Moonriver    |   RT1001    | 1052242  |
| Moonbase Alpha |   RT1001    | 1285916  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/970){target=_blank}。

***

#### 支持手动离开和DPoS术语 {: #support-manual-exits-dpos-terminology }

平行链质押pallet已更新成包括手动退出。如果候选人或委托人想要减少或撤销他们的绑定金额，或是离开候选人或委托人池，他们需要先安排一个请求，等待延迟期结束，然后手动执行请求。因此，此处应用迁移以使用手动退出API替换自动退出队列，包括`ExitQueue2`存储项。

此外，此处将提名权益证明（NPoS）更改为委托权益证明（DPoS）术语，这标志着从“提名”到“委托”的完整改变。这需要迁移以下平行链质押pallet存储项：

- `CollatorState2`迁移至`CandidateState`
- `NominatorState2`迁移至`DelegatorState`

此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|    Moonbeam    |   RT1001    |   5165   |
|   Moonriver    |   RT1001    | 1052242  |
| Moonbase Alpha |   RT1001    | 1285916  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/810){target=_blank}。

***

#### 提高每位候选人的最高委托量 {: #increase-max-delegations-per-candidate }

此处应用迁移以增加平行链质押pallet中每个候选人的最大委托数量。它将Moonbase Alpha和Moonriver上的委托从100增加到500，在Moonbeam上从100增加到1000。

此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|    Moonbeam    |   RT1101    |  171061  |
|   Moonriver    |   RT1101    | 1188000  |
| Moonbase Alpha |   RT1100    | 1426319  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1096){target=_blank}。

***

#### 将委托人提名分为前段和后段 {: #split-candidate-delegations-top-bottom }

此迁移将平行链质押pallet中已弃用的`CandidateState`存储项拆分为以下三个新的存储项，以避免不必要的存储读取：

- `CandidateInfo`
- `TopDelegations`
- `BottomDelegations`

此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|    Moonbeam    |   RT1201    |  415946  |
|   Moonriver    |   RT1201    | 1471037  |
| Moonbase Alpha |   RT1200    | 1648994  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1117){target=_blank}。

***

#### 修补错误的总委托量 {: #patch-incorrect-total-delegations }

此处应用迁移来修复[错误收集人选择](#incorrect-collator-selection)漏洞并修补所有候选人的授权总数。

此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|    Moonbeam    |   RT1300    |  524762  |
|   Moonriver    |   RT1300    | 1541735  |
| Moonbase Alpha |   RT1300    | 1761128  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1291){target=_blank}。

***

#### 将委托人状态拆分为委托计划要求 {: #split-delegator-state }

此处应用迁移将待处理委托人请求从平行链质押pallet的`DelegatorState`存储项移动到一个新的`DelegationScheduledRequests`存储项中。

此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|    Moonbeam    |   RT1502    | 1107285  |
|   Moonriver    |   RT1502    | 1814458  |
| Moonbase Alpha |   RT1502    | 2112058  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1408){target=_blank}。

***

#### 将质押储备替换为锁定余额 {: #replace-staking-reserves }

此处应用迁移将用户的预留余额更改为锁定余额。锁定余额与民主锁定资金是同一种类型资金，使用户可以使用他们的质押资金参与民主活动。

此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|    Moonbeam    |   RT1701    | 1581457  |
|   Moonriver    |   RT1701    | 2281723  |
| Moonbase Alpha |   RT1700    | 2529736  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1604){target=_blank}。

***

#### 支持自动复利 {: #auto-compounding-support }

为支持自动复利，此处对平行链质押pallet中的`AtStake`存储项应用了两个迁移：

- `RemovePaidRoundsFromAtStake` - 移除与已支付轮次相关的任何陈旧的`AtStake`条目，这些轮次有候选人没有产生任何区块。此迁移是`MigrateAtStakeAutoCompound`迁移的先决条件
- `MigrateAtStakeAutoCompound` - 迁移`AtStake`条目的未付费轮次的快照

此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|    Moonbeam    |   RT1901    | 2317683  |
|   Moonriver    |   RT1901    | 2911863  |
| Moonbase Alpha |   RT1900    | 3069635  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1878){target=_blank}。

***

### Referenda Pallet {: #referenda-pallet }

为支持在已关闭公投中退还提交的押金，添加了一个更新`ReferendumInfo`类别的迁移。以下`ReferendumInfo`的不变量的更改，让第二个参数`Deposit<AccountId, Balance>`现能够自定义，`Option<Deposit<AccountId, Balance>>`：`Approved` `Rejected`、`Cancelled`和`TimedOut`。

此处源于[Substrate](https://github.com/paritytech/substrate/pull/12788){target=_blank} repository的上游变更。

此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2302      |    3456477    |
|   Moonriver    |      RT2302      |    4133065    |
| Moonbase Alpha |      RT2301      |    4172407    |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/2134){target=_blank}。

***

### XCM相关Pallet {: #xcm-related-pallets }

#### 更新交易信息存储项 {: #update-transaction-info }

此处于XCM Transactor Pallet的`TransactInfo`存储项进行迁移，更改了以下内容：

- 添加`max_weight`以防止交易者在目标链中拖延队列
- 删除`fee_per_byte`、`metadata_size`和`base_weight`，因为XCM交易不需要这些内容
- `fee_per_second`替换了`fee_per_weight`以更好地反映`fee_per_weight`单位低于1的情况（如Kusama）

此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|    Moonbeam    |   RT1201    |  415946  |
|   Moonriver    |   RT1201    | 1471037  |
| Moonbase Alpha |   RT1200    | 1648994  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1114){target=_blank}。

***

#### 添加对Statemine前缀重大更改的支持 {: #add-support-statemine-prefix }

以下三个迁移已添加到资产管理器pallet，以避免[Statemine对其表示资产的方式的重大更改](https://github.com/paritytech/cumulus/pull/831){target=_blank}和在未来重大变化可能出现的问题：

- `UnitsWithAssetType` - 将`AssetTypeUnitsPerSecond`存储项更新为`AssetType`到`units_per_second`的映射，而不是映射`AssetId`到`units_per_second`。这样做是为了避免在出现重大更改时需要进行额外的迁移
- `PopulateAssetTypeIdStorage` - 创建一个新的`AssetTypeId`存储项，其中包含`AssetType`到`AssetId`的映射，这允许`assetIds`和`AssetTypes`的分开
- `ChangeStateminePrefixes` - 将已注册的Statemine资产更新为新的形式

此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|    Moonbeam    |   RT1201    |  415946  |
|   Moonriver    |   RT1201    | 1471037  |
| Moonbase Alpha |   RT1200    | 1648994  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1159){target=_blank}。

***

#### 添加支持费用支付资产存储项 {: #add-supported-fee-payment-assets }

通过从`AssetTypeUnitsPerSecond`存储项中读取支持的资产数据，将迁移应用于资产管理器pallet，该pallet创建了新的`SupportedFeePaymentAssets`存储项。该存储项将持有我们接受的用于XCM费用支付的所有资产。将在收到传入的XCM消息时读取它，如果资产不在存储列表中，则该消息将不会被处理。

此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|    Moonbeam    |   RT1300    |  524762  |
|   Moonriver    |   RT1300    | 1541735  |
| Moonbase Alpha |   RT1300    | 1761128  |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/moonbeam-foundation/moonbeam/pull/1118){target=_blank}。

***

### Nimbus作者筛选Pallet {: #nimbus }

#### 替换可用比率为可用计数 {: #replace-eligible-ratio }

此处对Nimbus库应用了一项重大更改，该存储库弃用了`EligibleRatio`以支持`EligibleCount`配置。因此，迁移被应用到Moonbeam库，如果`EligibleRatio`值存在，该存储库将填充新的`EligibleCount`值作为在该区块高度上定义的潜在作者的百分比。否则，该值被设置为默认值`50`。

此迁移在以下Runtime和区块中执行：

|      网络      | 执行Runtime | 应用区块 |
|:--------------:|:-----------:|:--------:|
|    Moonbeam    |   RT1502    | 1107285  |
|   Moonriver    |   RT1502    | 1814458  |
| Moonbase Alpha |   RT1502    | 2112058  |

关于更多信息，您可以查看Github上的[相关Nimbus PR](https://github.com/moonbeam-foundation/nimbus/pull/45/){target=_blank}和[Moonbeam PR](https://github.com/moonbeam-foundation/moonbeam/pull/1400){target=_blank}。
