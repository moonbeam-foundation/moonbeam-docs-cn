关于Moonbeam质押挖矿系统，我们需要了解以下重要参数：

 - **收集人（Collators）** —— 区块生产者，负责收集用户的交易，并生成状态转移证明，由中继链进行验证。如果做出不当行为，其权益就会被削减
 - **提名人（Nominators）**—— 进行质押挖矿的代币持有者，为特定的收集人投票担保，只要账户中持有[最低数额](https://wiki.polkadot.network/docs/learn-accounts#balance-types)以上的代币都能成为提名人
 - **最低提名质押量（Minimum Nomination Stake）**—— 成为提名人所需的最低代币质押量
 - **最低提名持有量（Minimum Nomination）** —— 提名人要提名收集人所需的最低代币持有量
 - **收集人的提名人限额（Maximum Nominators per Collator）** —— 每个收集人能接受的最高提名人数量
 - **提名人的收集人限额（Maximum Collators per Nominator）**—— 每个提名人能提名的最高收集人数量
 - **轮次（Round）——** 每轮的区块数量。是奖励发放的重要参数

 - **绑定时长（Bond Duration）**—— 质押挖矿奖励延迟发放的轮次