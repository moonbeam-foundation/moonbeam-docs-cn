
 - **Voting** — a tool used by token holders to either approve ("Aye") or reject ("Nay") a proposal. The weight a vote has is defined by two factors: the number of tokens locked and lock duration (called Conviction)
   
 - **投票** — Token持有者用于批准（“赞成”）或拒绝（“反对”）提案的工具。投票权重由两个因素决定：锁定的Token数量和锁定期限（称为信念值）
   
    - **Conviction** — the time that token holders voluntarily lock their tokens when voting: the longer they are locked, the more weight their vote has
    - **信念值** — Token持有者投票时自愿锁定Token的时间：锁定时间越长，投票权重越大
    - **Lock balance** — the number of tokens that a user commits to a vote (note, this is not the same as a user's total account balance)
    - **锁定余额** — 用户承诺投票的Token数量（请注意，这与用户的总账户余额不同）
    
    Moonbeam uses a concept of voluntary locking that allows token holders to increase their voting power by locking tokens for a longer period of time. Specifying no Lock Period means a user's vote is valued at 10% of their lock balance. Additional voting power can be achieved by specifying a greater conviction. For each increase in Conviction (vote multiplier), the Lock Periods double.
    
    Moonbeam使用自愿锁定的概念，允许Token持有者通过锁定Token一段时间来增加其投票权。无锁定期意味着用户的投票权重为其锁定余额的10%。通过增加信念值可获得更高的投票权重。每增加一次信念值（投票乘数），则锁定期会加倍。