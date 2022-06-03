---
title: 针对收集人的Orbiter计划
description: 了解针对收集人的Moonbeam Orbiter计划，包含参与条件、绑定需求、奖励、性能指标以及更多。
---

# Moonbeam Orbiter计划

Moonbeam基金会宣布Orbiter计划将进入试验阶段。类似于[Kusama 1000验证人计划](https://thousand-validators.kusama.network/){target=_blank}，此计划允许收集人参与网络的多样性和安全性，无需其拥有特定的资金数量或是处在活跃收集人集中。此计划是基于社区意见进行开发。

Moonbeam基金会将确保Orbiter计划的收集人处于活跃收集人集，并赋予计划成员生产区块的权限，其又被称为Orbiters。

活跃Orbiter将会以固定的顺序轮换以确保每个轮次的公平分配。与此同时，Orbiter的表现将会被监测且每个轮次的奖励将会根据Orbiter在当轮次生产的区块返还给每个Orbiter。总体奖励将与分配给每个特定收集人账户的所有其他Orbiter共享。

只要Orbiter表现处于整体中的一定区间之中，将会保持其轮次的定位。然而当其跌落门槛的标准，将会被移除并降级至Moonbase Alpha的等候名单中。新的Orbiter将会自原先的等候名单中脱颖而出取代其位子。

## 计划时长 {: #duration }

目前计划仍然处于试验阶段，Moonbeam基金会将会根据执行结果实时进行调整。因此，目前并没有明确的结束日期，但整个试验将有可能在计划实施期间结束或是变更。Moonbeam基金会鼓励参与者在整个计划中提供反馈，并注意细节或概念将有可能与此处解释不同。

## 参与资格 {: #eligibility }

要参与Orbiter计划，您必须符合以下参与条件：

- 由于计划本身要求，每个Orbiter必须通过身份验证且不能为特定国家的居民
- 每个Orbiter必须质押一定资金，以避免恶意行为的出现且此资金将有可能被削减
- 每个个体（个人或是团体）仅能在各个网络上运行一个Oribter，如一个在Moonriver，一个在Moonbeam
- Orbiter将无法在其Orbiter相同的网络上运行另外一个收集人账户。然而，在仅在单一网络上运行的情况下，Orbiter将能够在另外一个网络上运行收集人，如在Moonbeam上运行一个收集人，在Moonrriver上运行一个Orbiter

## 沟通交流 {: #communication }

Moonbeam基金会已为此计划创建一个私人的Discord群组，大部分的对话将会在其频道中进行或是以DM进行。当您填写并提交申请表单，您将会被添加至群组当中。

## 申请和加入过程 {: #application-and-onboarding-process }

要加入Orbiter计划，您将需要填写申请表单并提交联系方式、社群媒体账号以及收集人和节点详情。在表格最后，您将需要根据操作流程完成身份验证。

<div class="button-wrapper">
    <a href="https://docs.google.com/forms/d/e/1FAIpQLSewdSAFgs0ZbgvlflmZbHrSpe6uH9HdXdGIL7i07AB2pFgxVQ/viewform" target="_blank" class="md-button">Moonbeam Orbiter Program Application</a>
</div>
当您通过了身份验证并成功通过此次计划的申请，您将会收到通知并开始进行加入流程，以下为加入流程的步骤：

1. 获得通知后，在Moonbase Alpha运行Orbiter
2. 在完成Moonbase Alpha试验期后，您将会被通知获得在Moonriver上运行的资格
3. 准备您的Moonriver Orbiter节点
4. 准备完毕后，绑定资金以表示您已准备好生产区块
5. Orbiter将会被添加至Moonriver的等候列表中
6. Orbiter将会在插槽可用时被添加为计划收集人
7. Orbiter开始在Moonriver上生产区块并获得收益
8. Orbiter计划整体将会受到评估，根据结果更改规则并扩展至Moonbeam

## 绑定资金 {: #bond }

如上所述，每个Orbiter必须绑定一定资金以参与此次计划。绑定的资金与活跃收集人集不同，因绑定资金并不会获得任何提名奖励。目前的绑定规则如下：

=== "Moonbeam"
    ```
    {{ networks.moonbeam.orbiter.bond }}
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.orbiter.bond }} MOVR
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.orbiter.bond }} DEV
    ```

## Orbiter和计划收集人配置 {: #configuration }

计划收集人由Moonbeam基金会运营，并分配权限给Orbiter以生产区块。以下为每个网络单个计划收集人最高可提供给Orbiter的数量：

=== "Moonbeam"
    ```
    {{ networks.moonbeam.orbiter.max_orbiters_per_collator }}
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.orbiter.max_orbiters_per_collator }} Orbiters/Program Collator
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.orbiter.max_orbiters_per_collator }} Orbiters/Program Collator
    ```

除此之外，Moonbeam和Moonriver上的计划收集人数量在活跃收集人中具有一定的限制，而Moonbase Alpha则不受到限制，以下为各个网络最高的计划收集人数量：

=== "Moonbeam"
    ```
    {{ networks.moonbeam.orbiter.max_collators }}
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.orbiter.max_collators }} Program Collators
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.orbiter.max_collators }} Program Collators
    ```

每个Orbiter将会在下个Orbiter取代之前运行特定轮次，以下为每个网络能够运行的轮次数量：

=== "Moonbeam"
    ```
    {{ networks.moonbeam.orbiter.active.rounds }}
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.orbiter.active.rounds }} rounds (~{{ networks.moonriver.orbiter.active.hours }} hours)
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.orbiter.active.rounds }} rounds (~{{ networks.moonbase.orbiter.active.hours }} hours)
    ```

## 奖励 {: #rewards }

Orbiter的奖励将会与分配到同一个计划收集人的Orbiter一同分享。每个计划收集人能被分配到的Oribter数量已在[配置部分](#configuration)说明。以Moonriver为例为{{ networks.moonriver.orbiter.max_orbiters_per_collator }}，因此每个收集人奖励大约为1/{{ networks.moonriver.orbiter.max_orbiters_per_collator }}。每个Orbiter在运行时生产的区块将会被记录，并将会根据记录发放奖励。

## 性能指标 {: #performance-metrics }

每个Orbiter的表现将会在一定期间内检测和衡量，以确保其运行顺利且能够正常生产区块。如果其表现处于所有计划收集人的一定区间内，预期Orbiter将利用最高级的装置以保持在区间内。关于更多硬件设备的需求，请查看收集人[配备要求页面](/node-operators/networks/collators/requirements/){target=_blank}。

Metrics will be assessed over 7 day periods. The performance metrics are as follows:

指标将会以七天的维度进行衡量，以下为用于评判的性能指标：

- Orbiter在其运行的最近3个轮次内有生产区块
- Orbiter的区块生产量处于计划内7天平均生产量的两个标准差以内
- Orbiter每个区块的交易量处于计划内7天平均的两个标准差以内
- Orbiter的区块大小处于计划内7天平均的两个标准差以内

!!! 注意事项
    以上指标有可能在试验期间变更。

## 离开计划 {: #leaving-the-program } 

任何Orbiter都能在任何时间离开计划并收取其绑定资金。唯一的限制为无法在该Orbiter是活跃状态时离开，但在非运行时则可以随时离开。
