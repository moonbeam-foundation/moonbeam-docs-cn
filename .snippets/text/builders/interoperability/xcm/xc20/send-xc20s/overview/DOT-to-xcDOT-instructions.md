举例来说，如果想将DOT转移至Moonbeam，可以使用以下XCM指令：

1. [`TransferReserveAsset`](/builders/interoperability/xcm/core-concepts/instructions#transfer-reserve-asset){target=_blank} - 在Polkadot上执行，将资产从初始账户转移并存入目标账户。在这个例子中，目标账户是Moonbeam在Polkadot上的Sovereign账户。然后它将发送一条XCM信息至目标链，也就是Moonbeam。消息中包含了将要执行的的XCM指令
2. [`ReserveAssetDeposited`](/builders/interoperability/xcm/core-concepts/instructions#reserve-asset-deposited){target=_blank} - 在Moonbeam上执行，将Sovereign账户收到资产的本地表示存储在临时保管寄存中，这是一个在Cross-Consensus Virtual Machine (XCVM) 中的临时地址。
3. [`ClearOrigin`](/builders/interoperability/xcm/core-concepts/instructions#clear-origin){target=_blank} - 在Moonbeam上执行。用于确保之后的XCM指令不使用XCM发送者的权限
4. [`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions#buy-execution){target=_blank} - 在Moonbeam上执行。使用保管的资产支付执行费用。具体费用根据目标链定义，在这个例子中目标为Moonbeam
5. [`DepositAsset`](/builders/interoperability/xcm/core-concepts/instructions#deposit-asset){target=_blank} - 在Moonbeam上执行。将资产从保管中移除并且发送至Moonbeam上的目标账户
