 - **主权账户** — 生态系统中每条链预设的账户，用于中继链和其他平行链。它的地址为特定单词和平行链ID连接的 `blake2` 哈希（中继链中的主权账户为`blake2(para+ParachainID)`，其他中的主权账户为`blake2(sibl+ParachainID)`平行链），将哈希截断为正确的长度。该帐户归root所支配，只能通过SUDO（如果有）或民主（技术委员会或公民投票）使用。主权账户通常在其它链上签署 XCM 消息
 - **Multilocation** —  一种指定整个中继链或平行链生态系统中来源点（相对或绝对来源）的方式；例如，它可用于指定特定的平行链、资产、账户，甚至是一个Pallet。一般而言，multilocation定义包含为`parents`和`interior`:
    - `parents` - 是指需要从来源点“跳跃”多少次可以进入`parent`区块链
    - `interior`，是指定义目标点需要多少个字段
    
    例如，要从另一个平行链中定位ID为`1000`的平行链，multilocation将是 `{ "parents": 1, "interior": { "X1": [{ "Parachain": 1000 }]}}`