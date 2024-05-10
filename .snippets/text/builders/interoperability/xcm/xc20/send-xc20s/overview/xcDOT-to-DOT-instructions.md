使用以下指令将xcDOT从Moonbeam发送回Polkadot：

1. [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=\_blank} - 在Moonbeam上执行。移除资产并将其存入保管寄存中
2. [`InitiateReserveWithdraw`](https://github.com/paritytech/xcm-format#initiatereservewithdraw){target=\_blank} - 在Moonbeam上执行。将资产从保管寄存中移除（本质上它会被burn掉）并发送一条XCM消息至目标链。XCM消息以`WithdrawAsset`指令开始
3. [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=\_blank} - 在Polkadot上执行。移除资产并将其存入保管寄存
4. [`ClearOrigin`](https://github.com/paritytech/xcm-format#clearorigin){target=\_blank} - 在Polkadot上执行。用于确保之后的XCM指令不使用XCM发送者的权限
5. [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=\_blank} - 在Polkadot上执行。使用保管的资产支付执行费用。具体费用根据目标链定义，在这个例子中目标为Polkadot
6. [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=\_blank} - 在Polkadot上执行。将资产从保管中移除并且发送至Polkadot上的目标账户
