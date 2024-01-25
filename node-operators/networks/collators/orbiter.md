---
title: 针对收集人的Orbiter计划
description: 了解针对收集人的Moonbeam Orbiter计划，包含参与条件、绑定需求、奖励、性能指标以及更多。
---

# Moonbeam Orbiter计划

## 概况 {: #introduction }

Moonbeam基金会宣布orbiter计划将进入试验阶段。类似于[Kusama 1000验证人计划](https://thousand-validators.kusama.network/){target=\_blank}，此计划允许收集人参与网络的多样性和安全性，无需其拥有特定的资金数量或是处在活跃收集人集中。此计划是基于社区意见进行开发。

Moonbeam基金会将确保orbiter计划的收集人处于活跃收集人集，并赋予计划成员生产区块的权限，其又被称为orbiters。

活跃orbiter将会以固定的顺序轮换以确保每个轮次的公平分配。与此同时，orbiter的表现将会被监测且每个轮次的奖励将会根据orbiter在当轮次生产的区块返还给每个orbiter。总体奖励将与分配给每个特定收集人账户的所有其他orbiter共享。

只要orbiter表现处于整体中的一定区间之中，将会保持其轮次的定位。然而当其跌落门槛的标准，将会被移除并降级至Moonbase Alpha的等候名单中。新的orbiter将会自原先的等候名单中脱颖而出取代其位子。

## 计划时长 {: #duration }

随着计划进展，Moonbeam基金会将会根据执行结果实时进行调整。因此，目前并没有明确的结束日期，但将有可能在计划实施期间结束或是变更。Moonbeam基金会鼓励参与者在整个计划中提供反馈，并注意细节或概念将有可能与此处解释不同。

## 参与资格 {: #eligibility }

要参与orbiter计划，您必须符合以下参与条件：

- 由于计划本身要求，每个orbiter必须通过KYC检查且不能为特定国家的居民
- 每个orbiter必须绑定一定资金，以避免恶意行为的出现且此资金将有可能被削减
- 每个个体（个人或是团体）仅能在各个网络上运行一个Oribter，如一个在Moonriver，一个在Moonbeam
- Orbiter将无法在其orbiter相同的网络上运行另外一个收集人账户。然而，在仅在单一网络上运行的情况下，orbiter将能够在另外一个网络上运行收集人，如在Moonbeam上运行一个收集人，在Moonrriver上运行一个orbiter

## 沟通交流 {: #communication }

Moonbeam基金会已为此计划创建一个私人的Discord群组，大部分的对话将会在其频道中进行或是以DM进行。当您填写并提交申请表单，您将会被添加至群组当中。

## Orbiter和Orbiter计划收集人池配置 {: #configuration }

计划收集人由Moonbeam基金会运营，并分配权限给orbiter以生产区块。以下为每个网络单个orbiter计划收集人池最高可提供的orbiter数量：

=== "Moonbeam"

    ```text
    每池 {{ networks.moonbeam.orbiter.max_orbiters_per_collator }} 个 orbiters
    ```

=== "Moonriver"

    ```text
    每池 {{ networks.moonriver.orbiter.max_orbiters_per_collator }} 个 orbiters
    ```
    
=== "Moonbase Alpha"

    ```text
    每池 {{ networks.moonbase.orbiter.max_orbiters_per_collator }} 个 orbiters
    ```

除此之外，Moonbeam和Moonriver上的orbiter计划收集人池在活跃收集人中具有一定的限制，而Moonbase Alpha则不受到限制，以下为各个网络最高的orbiter计划收集人池数量：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.orbiter.max_collators }} 个 orbiter 池
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.orbiter.max_collators }} 个 orbiter 池
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.orbiter.max_collators }} 个 orbiter 池
    ```

每个orbiter将会在下个orbiter取代之前运行特定轮次，以下为每个网络能够运行的轮次数量：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.orbiter.active.rounds }} 轮次 (~{{ networks.moonbeam.orbiter.active.hours }} 小时)
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.orbiter.active.rounds }} 轮次 (~{{ networks.moonriver.orbiter.active.hours }} 小时)
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.orbiter.active.rounds }} 轮次 (~{{ networks.moonbase.orbiter.active.hours }} 小时)
    ```

## 申请和加入过程 {: #application-and-onboarding-process }

要加入orbiter计划，您将需要填写申请表单，包括提交联系方式、社群媒体账号以及收集人和节点详情。在表格最后，您将需要根据操作流程完成KYC。

<div class="button-wrapper">
    <a href="https://docs.google.com/forms/d/e/1FAIpQLSewdSAFgs0ZbgvlflmZbHrSpe6uH9HdXdGIL7i07AB2pFgxVQ/viewform" target="_blank" class="md-button">Moonbeam orbiter Program Application</a>
</div>
当您通过KYC并成功通过此次计划的申请，您将会收到通知并开始进行加入流程。新的orbiter必须运行Moonbase Alpha节点两周后才有资格运行Moonriver节点。而orbiter运行Moonriver节点四周后才有资格运行Moonbeam节点。当您符合条件后，则无需在任何网络上运行orbiter。您可随时通过[取消注册](#leaving-the-program)离开任何网络，同时您将收到绑定的资金。要再次加入网络，您需要重新注册并进入等待列队。

加入过程的步骤简单概括如下：

- [准备您的节点并同步](/node-operators/networks/run-a-node/overview){target=\_blank}
- 完全同步后，您可以[生成会话密钥](/node-operators/networks/collators/account-management/#session-keys){target=\_blank}
- [注册会话密钥](/node-operators/networks/collators/account-management/#map-author-id-set-session-keys){target=\_blank}并绑定相关[映射资金](#mapping-bond)#bond)
- 准备就绪后，通过`moonbeamorbiters.orbiterRegister()` extrinsic注册orbiter并绑定相关[orbiter资金](#bond)
- orbiter将会进入等候列队，在插槽可用时被添加为orbiter计划收集人
- 插槽开放后，您将开始在相应的网络生产区块并收到奖励

## 绑定资金 {: #bond }

### 映射绑定资金 {: #mapping-bond}

在author ID映射到您的账户时，系统将会发送一笔资金绑定到您的账户。这笔资金由author ID注册获得。绑定的资金设置如下所示：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.staking.collator_map_bond }} GLMR
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.staking.collator_map_bond }} MOVR
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.staking.collator_map_bond }} DEV
    ``` 

### orbiter绑定资金 {: #orbiter-bond }

如上所述，每个orbiter必须提交一笔绑定资金才能参与该计划。绑定的资金与活跃收集人集不同，因绑定资金并不会获得任何提名奖励。目前的绑定规则如下：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.orbiter.bond }} GLMR
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.orbiter.bond }} MOVR
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.orbiter.bond }} DEV
    ```

## 奖励 {: #rewards }

Orbiter的奖励将会与分配到同一个orbiter计划收集人池的其他orbiter一同分享。每个orbiter计划收集人池的Oribter数量上限已在[配置部分](#configuration)说明。以Moonriver为例为{{ networks.moonriver.orbiter.max_orbiters_per_collator }}，因此每个收集人奖励大约为1/{{ networks.moonriver.orbiter.max_orbiters_per_collator }}。每个orbiter在运行时生产的区块将会被记录，并且根据比例分配奖励。

## 性能指标 {: #performance-metrics }

每个orbiter的表现将会在一定期间内检测和衡量，以确保其运行顺利且能够正常生产区块。如果其表现处于所有Oribter计划收集人池的一定区间内，预期orbiter将利用最高级的装置以保持在区间内。关于更多硬件设备的需求，请查看[收集人要求页面](https://docs.moonbeam.network/node-operators/networks/collators/requirements/){target=\_blank}。

指标将会以7天的维度进行衡量，以下为用于评判的性能指标：

- Orbiter在其运行的最近3个轮次内有生产区块
- Orbiter的区块生产量处于计划内7天平均生产量的两个标准差以内
- Orbiter每个区块的交易量处于计划内7天平均的两个标准差以内
- Orbiter的区块大小处于计划内7天平均的两个标准差以内

!!! 注意事项
    以上指标有可能在计划进行中变更。

## 离开计划 {: #leaving-the-program }

任何orbiter都能在任何时间离开计划并及时收到绑定的资金。唯一的限制为无法在该orbiter是活跃状态时离开，但在非运行时则可以通过调用`moonbeamorbiters.orbiterUnregister()` extrinsic随时离开计划。
