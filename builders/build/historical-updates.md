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

|      网络      |       出现时间       |     修复时间     |            影响的区块区间            |
| :------------: | :-----------------: | :------------: | :---------------------------------: |
|   Moonriver    |        RT49         |     RT600      |             0 - 455106              |
| Moonbase Alpha |        RT40         |     RT600      |             0 - 675175              |

关于更多信息，您可以查看[GitHub上的相关Frontier PR](https://github.com/paritytech/frontier/pull/465){target=_blank}。

***

#### 遗失返还资金 {: #missing-refunds } 

Moonbeam配置为将保留账户最低存款（Existential Deposit）设置为0，代表所有账户不需要最低余额数量即可被视为活跃。对于具有此配置的基于Substrate的链而言，由于零余额帐户被视为不存在，因此遗漏对该帐户的退款。

此漏洞存在于以下Runtime和区块区间：

|      网络      |       出现时间       |     修复时间     |            影响的区块区间            |
| :------------: | :-----------------: | :------------: | :---------------------------------: |
|    Moonbeam    |        RT900        |     RT1001     |              0 - 5164               |
|   Moonriver    |        RT49         |     RT1001     |             0 - 1052241             |
| Moonbase Alpha |        RT40         |     RT1001     |             0 - 1285915             |

关于更多信息，您可以在Github上查看[相关Frontier PR](https://github.com/paritytech/frontier/pull/509){target=_blank}以及有关的[Substrate PR](https://github.com/paritytech/substrate/issues/10117){target=_blank}。

***

#### 错误收集人选择 {: #incorrect-collator-selection } 

当通过`delegatorBondMore` extrinsic增加委托时，收集人候选人的总委托并未正确更新。这导致增加的委托金额未包含在候选人的总金额中，而该金额是用于确定哪些候选人会在活跃的收集人集中。因此，即使一些候选人实际上应该进入活动集中，但他们因此问题而没有被选中进入活跃收集人集中，从而影响他们自己和他们的委托人的奖励。

此漏洞存在于以下Runtime和区块区间：

|      网络      |       出现时间       |     修复时间     |            影响的区块区间            |
| :------------: | :-----------------: | :------------: | :---------------------------------: |
|    Moonbeam    |        RT900        |     RT1300     |             0 - 524762              |
|   Moonriver    |        RT49         |     RT1300     |             0 - 1541735             |
| Moonbase Alpha |        RT40         |     RT1300     |             0 - 1761128             |

关于更多信息，您可以在[GitHub上查看相关PR](https://github.com/PureStake/moonbeam/pull/1291){target=_blank}。

***

#### 错误时间戳单位 {: #incorrect-timestamp-units } 

EIP-2612和以太坊区块以秒为单位处理时间戳，然而Moonbeam采用的Substrate时间戳使用毫秒。此漏洞仅影响EIP-2612的实现，而非`block.timestamp`数值。

此漏洞存在于以下Runtime和区块区间：

|      网络      |       出现时间       |     修复时间     |            影响的区块区间            |
| :------------: | :-----------------: | :------------: | :---------------------------------: |
|    Moonbeam    |        RT900        |     RT1606     |             0 - 1326697             |
|   Moonriver    |        RT49         |     RT1605     |             0 - 2077598             |
| Moonbase Alpha |        RT40         |     RT1603     |             0 - 2285346             |

关于更多信息，您可以在[GitHub上查看相关PR](https://github.com/PureStake/moonbeam/pull/1451){target=_blank}。

***

#### 错误委托奖励计算 {: #incorrect-delegation-reward-calculation } 

每当有待处理请求时，所有委托和收集人的奖励支出都被低估了。委托奖励是根据每个委托人绑定的Token数量相对于给定收集人的总占比计算的。通过计算待处理请求的委托金额，收集人及其委托的奖励低于原本应有的水平。

此漏洞存在于以下Runtime和区块区间：

|      网络      |       出现时间       |     修复时间     |            影响的区块区间            |
| :------------: | :-----------------: | :------------: | :---------------------------------: |
|    Moonbeam    |       RT1001        |     RT1802     |           5165 - 1919457            |
|   Moonriver    |       RT1001        |     RT1801     |          1052242 - 2572555          |
| Moonbase Alpha |       RT1001        |     RT1800     |          1285916 - 2748785          |

关于更多信息，您可以在[GitHub上查看相关PR](https://github.com/PureStake/moonbeam/pull/1719){target=_blank}。

***

#### 区块母哈希错误计算 {: #block-parent-hash-calculated-incorrectly } 

在EIP-1559推出后，其包含的新以太坊交易种类，让区块头的母哈希被错误计算为`H256::default`。

此漏洞仅影响Moonbase Alpha并存在于以下Runtime和区块区间：

|      网络      |       出现时间       |     修复时间     |            影响的区块区间            |
| :------------: | :-----------------: | :------------: | :---------------------------------: |
| Moonbase Alpha |       RT1200        |     RT1201     |          1648994 - 1679618          |

关于更多信息，您可以在[GitHub上查看相关Frontier PR](https://github.com/paritytech/frontier/pull/570){target=_blank}。

***

#### 支付给收集人的交易费用 {: #transaction-fees-paid-to-collators } 

对于包含优先费用的EIP-1559交易的区块，交易费用被错误地计算并分配给了区块的收集人。Moonbeam上用于交易和智能合约执行的费用模型经过设计，20%的费用将存入链上财政库，80%将作为通货紧缩力量而销毁。由于这个漏洞，受影响交易的交易费用没有按预期销毁。

此漏洞存在于以下Runtime和区块区间：

|      网络      |       出现时间       |     修复时间     |            影响的区块区间            |
| :------------: | :-----------------: | :------------: | :---------------------------------: |
|    Moonbeam    |       RT1201        |     RT1504     |          415946 - 1117309           |
|   Moonriver    |       RT1201        |     RT1504     |          1471037 - 1910639          |
| Moonbase Alpha |       RT1200        |     RT1504     |          1648994 - 2221772          |

关于更多信息，您可以在[GitHub上查看相关PR](https://github.com/PureStake/moonbeam/pull/1528){target=_blank}。

***

#### 错误状态根哈希 {: #incorrect-state-root-hash }

由于未考虑交易类型字节，因此对于非遗留交易的状态根哈希计算部分错误。在[EIP-2930](https://eips.ethereum.org/EIPS/eip-2930){target=_blank}和[EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank}的支持下，引入的交易类型分别为`0x01`（1）和`0x02`（2）。这些交易类型在状态根哈希的计算中被忽略。

此漏洞存在于以下Runtime和区块区间：

|      网络      |       出现时间       |     修复时间     |            影响的区块区间            |
| :------------: | :-----------------: | :------------: | :---------------------------------: |
|    Moonbeam    |       RT1201        |     RT1701     |          415946 - 1581456           |
|   Moonriver    |       RT1201        |     RT1701     |          1471037 - 2281722          |
| Moonbase Alpha |       RT1200        |     RT1700     |          1648994 - 2529735          |

关于更多信息，您可以在GitHub上查看[相关Frontier PR](https://github.com/PureStake/frontier/pull/86){target=_blank}和[Moonbeam PR](https://github.com/PureStake/moonbeam/pull/1678/files){target=_blank}。

***

#### 非交易调用的过高Gas限制 {: #gas-limit-too-high-for-non-transactional-calls }

当进行非交易调用时，例如`eth_call`或`eth_estimateGas`，在没有为过去的区块指定Gas限制的情况下进行时，客户端默认使用Gas限制乘数（10x），这会导致Gas限制验证失败。因为它是针对区块Gas限制的上限进行验证的。因此，如果给定调用的Gas限制大于区块Gas限制，则会返回Gas限制过高错误的结果。

此漏洞存在于以下Runtime和区块区间：

|      网络      |       出现时间       |     修复时间     |            影响的区块区间            |
| :------------: | :-----------------: | :------------: | :---------------------------------: |
|    Moonbeam    |       RT1701        |     RT1802     |          1581457 - 1919457          |
|   Moonriver    |       RT1701        |     RT1802     |          2281723 - 2616189          |
| Moonbase Alpha |       RT1700        |     RT1802     |          2529736 - 2879402          |

关于更多信息，您可以在[GitHub上查看相关Frontier PR](https://github.com/paritytech/frontier/pull/935){target=_blank}。

***

## 迁移 {: #migrations } 

当更改或添加存储项并需要用数据填充时，迁移是必要的。下面列出的迁移部分是由受影响的pallet来分类的。

### 作者映射pallet {: #author-mapping }

#### 更新映射存储项 {: #update-mapping-storage-item } 

此迁移更新了作者映射pallet现已弃用的`Mapping`存储项，以使用更安全的哈希器类型。哈希器类型已更新为[Blake2_128Concat](https://paritytech.github.io/substrate/master/frame_support/struct.Blake2_128Concat.html){target=_blank}而非[Twox64Concat](https://paritytech.github.io/substrate/master/frame_support/struct.Twox64Concat.html){target=_blank}。

此迁移仅适用于Moonriver和Moonbase Alpha，并在以下Runtime和区块执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|   Moonriver    |            RT800             |         684728         |
| Moonbase Alpha |            RT800             |         915684         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/679){target=_blank}。

***

#### 添加VRF密钥支持 {: #add-support-for-vrf-keys }

当推出VRF密钥支持时，作者映射pallet的`MappingWithDeposit`存储项已更新为包含`keys`字段以支持可通过Nimbus ID查找的VRF密钥。因此，此处应用迁移以使用此新字段更新现有存储项。

此迁移在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|    Moonbeam    |            RT1502            |        1107285         |
|   Moonriver    |            RT1502            |        1814458         |
| Moonbase Alpha |            RT1502            |        2112058         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/1407){target=_blank}。

***

#### 一个Nimbus ID对应一个账户ID {: #one-nimbus-id-per-account-id } 

此处应用迁移以确保一个帐户ID只能有一个Nimbus ID。此迁移接受给定帐户拥有的第一个Nimbus ID，并清除与该帐户关联的任何其他Nimbus ID。对于任何已清除的相关内容，该相关内容的保证金将被退还。

此迁移在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|    Moonbeam    |            RT1606            |        1326697         |
|   Moonriver    |            RT1605            |        2077599         |
| Moonbase Alpha |            RT1603            |        2285347         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/1525){target=_blank}。

***

### 基础费用Pallet {: #base-fee } 

#### 设置弹性存储项数值 {: #set-elasticity } 

此迁移部分将基础费用pallet的`Elasticity`存储项设置为0，从而使`BaseFeePerGas`保持不变。

此迁移在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|    Moonbeam    |            RT1300            |         524762         |
|   Moonriver    |            RT1300            |        1541735         |
| Moonbase Alpha |            RT1300            |        1761128         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/1744){target=_blank}。

***

### 民主Pallet {: #democracy } 

#### 原像存储转移至新的原像Pallet

此处应用迁移将存储在民主pallet中的原像移动到新的原像pallet。由于[波卡的上游更改](https://github.com/paritytech/substrate/pull/11649){target=_blank}，需要在Moonbeam上进行此迁移。

Moonbeam中有一个原像受到影响，其从调度程序队列中被丢弃并且从未执行过：`0x14262a42aa6ccb3cae0a169b939ca5b185bc317bb7c449ca1741a0600008d306`。这个原像已被最初提交原像的账户 [手动移除]了(https://moonbeam.subscan.io/extrinsic/2693398-8){target=_blank}。


此迁移在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|    Moonbeam    |            RT2000            |        3310369         |
|   Moonriver    |            RT2000            |        3202604         |
| Moonbase Alpha |            RT2000            |        2673234         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/1962){target=_blank}。

***

### 平行链质押Pallet {: #parachain-staking }

#### 更新收集人状态存储项 {: #update-collator-state-storage-item } 

此处应用迁移将平行链质押pallet的`Collator`存储项更新为新的`Collator2`存储项。此变动更新了收集人状态以包括以下内容：

- `nominators`集是所有提名人（委托人）帐户ID的列表，不包含各自的绑定余额
- 一个新的`top_nominators`存储项，返回所有最高提名人的列表，这些提名人按绑定金额从大到小排序
- 一个新的`bottom_nominators`存储项，返回所有底部提名人的列表，按绑定金额从最小到最大排序
- `total`存储项已替换为`total_counted`和`total_backing`。 `total_counted`返回最高提名和收集人自身绑定金额的总和，而`total_backing`返回所有提名人和收集人自身绑定金额的总和

此迁移仅适用于Moonriver和Moonbase Alpha，并在以下Runtime和区块中执行：

|      网络      |         执行Runtime        |        应用区块        |
| :------------: | :-----------------------: | :--------------------: |
|   Moonriver    |           RT53            |          9696          |
| Moonbase Alpha |           RT52            |         238827         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/505){target=_blank}。

***

#### 修补总质押数量 {: #patch-total-staked-amount } 

由于一个可能导致数量不正确的潜在漏洞，此处对平行链质押pallet中`CollatorState`存储项的`total`质押金额进行了迁移。

此迁移仅适用于Moonriver和Moonbase Alpha，并在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|   Moonriver    |             RT53             |          9696          |
| Moonbase Alpha |             RT52             |         238827         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/502){target=_blank}。

***

#### 支持延迟提名人（委托人）离开 {: #support-delayed-nominator-exits } 

用于处理候选人退出的退出队列已更新成包括对延迟提名人（委托人）退出和撤销的支持，这需要迁移以将`ExitQueue`平行链质押pallet存储项更新为`ExitQueue2`。 `NominatorState`存储项也被迁移到`NominatorState2`，以防止提名人在已经安排退出时执行更多提名。

此部分迁移仅适用于Moonriver和Moonbase Alpha，并在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|   Moonriver    |            RT200             |         259002         |
| Moonbase Alpha |            RT200             |         457614         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/610){target=_blank}。

***

#### 清除质押存储膨胀 {: #purge-staking-storage-bloat }

此处应用迁移来清除超过两轮的平行链质押pallet的`Points`和`AtStake`存储项的质押存储膨胀。

此迁移在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|    Moonbeam    |            RT1001            |          5165          |
|   Moonriver    |            RT1001            |        1052242         |
| Moonbase Alpha |            RT1001            |        1285916         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/970){target=_blank}。

***

#### 支持手动离开和DPoS术语 {: #support-manual-exits-dpos-terminology } 

平行链质押pallet已更新成包括手动退出。如果候选人或委托人想要减少或撤销他们的绑定金额，或是离开候选人或委托人池，他们需要先安排一个请求，等待延迟期结束，然后手动执行请求。因此，此处应用迁移以使用手动退出API替换自动退出队列，包括`ExitQueue2`存储项。

此外，此处将提名权益证明（NPoS）更改为委托权益证明（DPoS）术语，这标志着从“提名”到“委托”的完整改变。这需要迁移以下平行链质押pallet存储项：

- `CollatorState2`迁移至`CandidateState`
- `NominatorState2`迁移至`DelegatorState`

此迁移在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|    Moonbeam    |            RT1001            |          5165          |
|   Moonriver    |            RT1001            |        1052242         |
| Moonbase Alpha |            RT1001            |        1285916         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/810){target=_blank}。

***

#### 提高每位候选人的最高委托量 {: #increase-max-delegations-per-candidate }

此处应用迁移以增加平行链质押pallet中每个候选人的最大委托数量。它将Moonbase Alpha和Moonriver上的委托从100增加到500，在Moonbeam上从100增加到1000。

此迁移在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|    Moonbeam    |            RT1101            |         171061         |
|   Moonriver    |            RT1101            |        1188000         |
| Moonbase Alpha |            RT1100            |        1426319         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/1096){target=_blank}。

***

#### 将委托人提名分为前段和后段 {: #split-candidate-delegations-top-bottom }

此迁移将平行链质押pallet中已弃用的`CandidateState`存储项拆分为以下三个新的存储项，以避免不必要的存储读取：

- `CandidateInfo`
- `TopDelegations`
- `BottomDelegations`

此迁移在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|    Moonbeam    |            RT1201            |         415946         |
|   Moonriver    |            RT1201            |        1471037         |
| Moonbase Alpha |            RT1200            |        1648994         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/1117){target=_blank}。

***

#### 修补错误的总委托量 {: #patch-incorrect-total-delegations }

此处应用迁移来修复[错误收集人选择](#incorrect-collator-selection)漏洞并修补所有候选人的授权总数。

此迁移在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|    Moonbeam    |            RT1300            |         524762         |
|   Moonriver    |            RT1300            |        1541735         |
| Moonbase Alpha |            RT1300            |        1761128         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/1291){target=_blank}。

***

#### 将委托人状态拆分为委托计划要求 {: #split-delegator-state }

此处应用迁移将待处理委托人请求从平行链质押pallet的`DelegatorState`存储项移动到一个新的`DelegationScheduledRequests`存储项中。

此迁移在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|    Moonbeam    |            RT1502            |        1107285         |
|   Moonriver    |            RT1502            |        1814458         |
| Moonbase Alpha |            RT1502            |        2112058         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/1408){target=_blank}。

***

#### 将质押储备替换为锁定余额 {: #replace-staking-reserves }

此处应用迁移将用户的预留余额更改为锁定余额。锁定余额与民主锁定资金是同一种类型资金，使用户可以使用他们的质押资金参与民主活动。

此迁移在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|    Moonbeam    |            RT1701            |        1581457         |
|   Moonriver    |            RT1701            |        2281723         |
| Moonbase Alpha |            RT1700            |        2529736         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/1604){target=_blank}。

***

#### 支持自动复利 {: #auto-compounding-support } 

为支持自动复利，此处对平行链质押pallet中的`AtStake`存储项应用了两个迁移：

- `RemovePaidRoundsFromAtStake` - 移除与已支付轮次相关的任何陈旧的`AtStake`条目，这些轮次有候选人没有产生任何区块。此迁移是`MigrateAtStakeAutoCompound`迁移的先决条件
- `MigrateAtStakeAutoCompound` - 迁移`AtStake`条目的未付费轮次的快照

此迁移在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|    Moonbeam    |            RT1901            |        2317683         |
|   Moonriver    |            RT1901            |        2911863         |
| Moonbase Alpha |            RT1900            |        3069635         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/1878){target=_blank}。

***

### XCM相关Pallet {: #xcm-related-pallets } 

#### 更新交易信息存储项 {: #update-transaction-info } 

此处于XCM-transactor pallet的`TransactInfo`存储项进行迁移，更改了以下内容：

- 添加`max_weight`以防止交易者在目标链中拖延队列
- 删除`fee_per_byte`、`metadata_size`和`base_weight`，因为XCM交易不需要这些内容
- `fee_per_second`替换了`fee_per_weight`以更好地反映`fee_per_weight`单位低于1的情况（如Kusama）

此迁移在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|    Moonbeam    |            RT1201            |         415946         |
|   Moonriver    |            RT1201            |        1471037         |
| Moonbase Alpha |            RT1200            |        1648994         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/1114){target=_blank}。

***

#### 添加对Statemine前缀重大更改的支持 {: #add-support-statemine-prefix }

以下三个迁移已添加到资产管理器pallet，以避免[Statemine对其表示资产的方式的重大更改](https://github.com/paritytech/cumulus/pull/831){target=_blank}和在未来重大变化可能出现的问题：

- `UnitsWithAssetType` - 将`AssetTypeUnitsPerSecond`存储项更新为`AssetType`到`units_per_second`的映射，而不是映射`AssetId`到`units_per_second`。这样做是为了避免在出现重大更改时需要进行额外的迁移
- `PopulateAssetTypeIdStorage` - 创建一个新的`AssetTypeId`存储项，其中包含`AssetType`到`AssetId`的映射，这允许`assetIds`和`AssetTypes`的分开
- `ChangeStateminePrefixes` - 将已注册的Statemine资产更新为新的形式

此迁移在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|    Moonbeam    |            RT1201            |         415946         |
|   Moonriver    |            RT1201            |        1471037         |
| Moonbase Alpha |            RT1200            |        1648994         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/1159){target=_blank}。

***

#### 添加支持费用支付资产存储项 {: #add-supported-fee-payment-assets }

通过从`AssetTypeUnitsPerSecond`存储项中读取支持的资产数据，将迁移应用于资产管理器pallet，该pallet创建了新的`SupportedFeePaymentAssets`存储项。该存储项将持有我们接受的用于XCM费用支付的所有资产。将在收到传入的XCM消息时读取它，如果资产不在存储列表中，则该消息将不会被处理。

此迁移在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|    Moonbeam    |            RT1300            |         524762         |
|   Moonriver    |            RT1300            |        1541735         |
| Moonbase Alpha |            RT1300            |        1761128         |

关于更多信息，您可以查看[GitHub上的相关PR](https://github.com/PureStake/moonbeam/pull/1118){target=_blank}。

***

### Nimbus作者筛选Pallet {: #nimbus } 

#### 替换可用比率为可用计数 {: #replace-eligible-ratio } 

此处对Nimbus库应用了一项重大更改，该存储库弃用了`EligibleRatio`以支持`EligibleCount`配置。因此，迁移被应用到Moonbeam库，如果`EligibleRatio`值存在，该存储库将填充新的`EligibleCount`值作为在该区块高度上定义的潜在作者的百分比。否则，该值被设置为默认值`50`。

此迁移在以下Runtime和区块中执行：

|      网络      |          执行Runtime         |         应用区块         |
| :------------: | :--------------------------: | :--------------------: |
|    Moonbeam    |            RT1502            |        1107285         |
|   Moonriver    |            RT1502            |        1814458         |
| Moonbase Alpha |            RT1502            |        2112058         |

关于更多信息，您可以查看Github上的[相关Nimbus PR](https://github.com/PureStake/nimbus/pull/45/){target=_blank}和[Moonbeam PR](https://github.com/PureStake/moonbeam/pull/1400){target=_blank}。
