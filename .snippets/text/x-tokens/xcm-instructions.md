举例来说，如果想将Dot转移至Moonbeam，可以使用以下XCM指令：

1. [`TransferReserveAsset`](https://github.com/paritytech/xcm-format#transferreserveasset){target=_blank} - 在Polkadot上执行，将资产从初始账户转移并存入目标账户。在这个例子中，目标账户是Moonbeam在Polkadot上的Sovereign账户。然后它将发送一条XCM信息至目标链，也就是Moonbeam。消息中包含了将要执行的的XCM指令
2. [`ReserveAssetDeposited`](https://github.com/paritytech/xcm-format#reserveassetdeposited-){target=_blank} - 在Moonbeam上执行，将Sovereign账户收到资产的本地表示存储在临时保管寄存中，这是一个在Cross-Consensus Virtual Machine (XCVM) 中的临时地址。
3. [`ClearOrigin`](https://github.com/paritytech/xcm-format#clearorigin){target=_blank} - 在Moonbeam上执行。用于确保之后的XCM指令不使用XCM发送者的权限
4. [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - 在Moonbeam上执行。使用保管的资产支付执行费用。具体费用根据目标链定义，在这个例子中目标为Moonbeam
5. [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - 在Moonbeam上执行。将资产从保管中移除并且发送至Moonbeam上的目标账户

学习更多关于如何使用搭建XCM指令来传输本地资产至目标链，比如将Dot发送至Moonbeam，您可以参考[X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/polkadot-{{networks.polkadot.spec_version}}/xtokens){target=_blank}作为例子。您可能需要[`transfer_self_reserve_asset`](https://github.com/open-web3-stack/open-runtime-module-library/blob/polkadot-{{networks.polkadot.spec_version}}/xtokens/src/lib.rs#L680){target=_blank}这个函数。在这个函数中，您会发现它调用了`TransferReserveAsset`函数并且使用了`assets`, `dest`, 与 `xcm`三个参数。其中`xcm`参数包括了`BuyExecution`与`DepositAsset`指令。您可以访问Polkadot的Github库，在那您可以找到[`TransferReserveAsset`](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/xcm-executor/src/lib.rs#L514){target=_blank}这个指令。这条XCM消息结合了`ReserveAssetDeposited`指令，`ClearOrigin`指令与`xcm`参数，`xcm`参数包括`BuyExecution`和`DepositAsset`指令。

使用以下指令将xcDot从Moonbeam发送回Polkadot：

1. [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 在Moonbeam上执行。移除资产并将其存入保管寄存中
2. [`InitiateReserveWithdraw`](https://github.com/paritytech/xcm-format#initiatereservewithdraw){target=_blank} - 在Moonbeam上执行。将资产从保管寄存中移除（本质上它会被burn掉）并发送一条XCM消息至目标链。XCM消息以`WithdrawAsset`指令开始
3. [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - 在Polkadot上执行。移除资产并将其存入保管寄存
4. [`ClearOrigin`](https://github.com/paritytech/xcm-format#clearorigin){target=_blank} - 在Polkadot上执行。用于确保之后的XCM指令不使用XCM发送者的权限
5. [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - 在Polkadot上执行。使用保管的资产支付执行费用。具体费用根据目标链定义，在这个例子中目标为Polkadot
6. [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - 在Polkadot上执行。将资产从保管中移除并且发送至Polkadot上的目标账户

学习更多关于如何使用搭建XCM指令来传输本地资产至目标链，比如将xcDOT发送至Polkadot，您可以参考[X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/polkadot-{{networks.polkadot.spec_version}}/xtokens){target=_blank}作为例子。您可能需要[`transfer_to_reserve`](https://github.com/open-web3-stack/open-runtime-module-library/blob/polkadot-{{networks.polkadot.spec_version}}/xtokens/src/lib.rs#L697){target=_blank}这个函数。在这个函数中，您会发现它调用了`WithdrawAsset`函数，然后调用`InitiateReserveWithdraw`并且使用了`assets`, `dest`, 与 `xcm`三个参数。其中`xcm`参数包括了`BuyExecution`与`DepositAsset`指令。您可以访问Polkadot的Github库，在那您可以找到[`InitiateReserveWithdraw` instruction](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/xcm-executor/src/lib.rs#L638){target=_blank}这个指令。这条XCM消息结合了`WithdrawAsset`指令，`ClearOrigin`指令与`xcm`参数，`xcm`参数包括`BuyExecution`和`DepositAsset`指令。