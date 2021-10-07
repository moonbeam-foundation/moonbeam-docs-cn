一个预言机节点有一系列Job ID，每个ID对应用户可发起的任务。例如，使用Chainlink的喂价获取价格数据，用户需要通过*客户*合约发送请求，传递以下信息：

 - 预言机地址：预言机节点部署的合约地址
 - Job ID：需要执行的任务
 - 支付：预言机在收到LINK代币支付后，将完成请求

这一请求实际上会向LINK代币合约发送*transferAndCall*指令，由该合约进行支付处理，并且将该请求传输给预言机合约。随同该请求一并发出的还有事件信息，后者会被预言机节点拾取。接下来，节点就会获取必要数据并执行*fulfilOracleRequest*函数，这一函数将执行回调，将请求的信息储存在客户合约中。具体工作流程如下图所示。

![Basic Request Diagram](/images/builders/integrations/oracles/chainlink/chainlink-basic-request.png)

