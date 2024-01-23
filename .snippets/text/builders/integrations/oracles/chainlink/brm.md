在开始获取数据本身之前，您必须先了解“基本请求模型”的基础信息。从Chainlink预言机请求和接收数据的一般流程如下所示：

1. 客户合约创建并向Chainlink预言机发出数据请求

2. 请求通过LINK Token合约的`transferAndCall`函数发出。LINK Token是一个符合[ERC-677](https://github.com/ethereum/EIPs/issues/677){target=\_blank}的Token，即允许转移Token并将请求传输给预言机合约

3. 转移Token后，LINK合约将调用预言机合约的`onTokenTransfer`函数

4. 预言机合约由预言机节点运营者管理，负责处理通过LINK Token发出的链上请求。预言机合约收到请求后，将会向节点发出一个事件，并由该节点执行操作

5. 预言机节点完成请求后，节点使用预言机合约的`fulfillOracleRequest`函数，通过在原始请求中定义的回调函数将结果返回给客户合约

![Basic Request Diagram](/images/builders/integrations/oracles/chainlink/chainlink-basic-request.png)

当通过客户合约创建数据请求后，需要传入以下参数以确保交易能够进行并返回正确信息：

 - **Oracle address** —— 预言机节点部署合约的地址
 - **Job ID** —— 要执行的任务。一个预言机节点有一组Job ID，其中每个Job对应一个用户可以请求的任务，例如：获取喂价
 - **Payment** —— 预言机为完成请求而收到的LINK Token款项