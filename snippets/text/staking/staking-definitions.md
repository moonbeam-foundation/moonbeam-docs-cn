关于Moonbeam质押挖矿系统，我们需要了解以下重要参数：

 - **候选人（Candidates）** — 进入有效集后有资格生产区块的节点
 - **收集人（Collators）** — 区块生产者，负责收集用户的交易，并生成状态转移证明，由中继链进行验证。如果做出不当行为，其权益就会被削减
 - **委托人（Delegators）** — 进行质押挖矿的代币持有者，为特定的候选收集人投票担保，只要账户中持有[最低数额](https://wiki.polkadot.network/docs/learn-accounts#balance-types)以上的代币都能成为委托人
 - **最低委托质押量（Minimum delegation stake）** — 成为委托人所需的最低代币质押量
 - **最低委托持有量（Minimum delegation）** — 委托人要委托收集人所需的最低代币持有量
 - **候选人委托人限额（Maximum delegators per candidate）** — 每个候选人能接受的最高委托人数量
 - **委托人候选人限额（Maximum candidates per delegator）** — 每个委托人能提名的最高候选人数量
 - **轮次（Round）** — 执行质押操作的时效衡量单位。例如，在下一轮开始时制定新的委托。当绑定减少或撤销授权时，资金会在体格轮次后返还。