---
title: Covalent API
description: 使用Covalent API在Moonbeam上查询区块链数据，包括余额、交易、代币持有人和事件等信息。
---

# 开始使用Covalent API

![Covalent on Moonbeam](/images/builders/integrations/indexers/covalent/covalent-banner.png)

## 概览 {: #introduction } 

[Covalent](https://www.covalenthq.com/){target=_blank}通过统一的API为所有区块链网络上的资产提供完全的公开透明。简而言之，用户无需任何代码，就可以从各个区块链上获取详细的区块链交易数据。通过统一的[Covalent API](https://www.covalenthq.com/docs/api/#/0/0/USD/1){target=_blank}界面，用户可以创建全新的应用程序或者调整现有的应用程序，无需重新配置或维护基础设施。Covalent现已支持Moonbase Alpha，并且计划支持Moonbeam和Moonriver。

--8<-- 'text/disclaimers/third-party-content-intro.md'

## 快速上手 {: #quick-start } 

如果您熟悉Covalent并希望学习如何直接进入任何基于Moonbeam的网络，您只需提供Chain ID：

=== "Moonbeam"
    ```
    {{ networks.moonbeam.chain_id }}
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.chain_id }}
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.chain_id }}
    ```

## 终端类型 {: #types-of-endpoints } 

Covalent API有两类终端：

 - **A类** —— 可以在所有区块链网络中使用，能够返回详细区块链数据的终端，包括余额、交易和日志事件等
 - **B类** —— 专门为特定区块链上的特定协议而设置的终端，例如Uniswap就是仅适用于以太坊的终端，无法在其他区块链网络上使用

## Covalent API基础知识 {: #fundamentals-of-the-covalent-api } 
 - Covalent API是RESTful，围绕网页端界面主要资源进行开发
 - 当前的Covalent API版本为版本1
 - 所有终端的默认返回形式为JSON
 - 所有请求均要求验证，用户需要有[可用的API密钥](https://www.covalenthq.com/platform/#/auth/register/){target=_blank}才能使用Covalent API
 - Covalent API的根URL为https://api.covalenthq.com/v1/
 - 所有请求均通过HTTPS完成（若使用HTTP则请求失败）
 - Covalent API采用实时刷新方式，刷新率为30秒或2个区块，每批次为10分钟或40个区块

## 支持终端 {: #supported-endpoints } 
 - **Balances** —— 获取某一地址的代币余额。这一函数将返回一个包含所有ERC-20和NFT代币余额（包括ERC-721 和ERC-1155）的列表，以及这些代币目前的现货价格（若有）
 - **Transactions** —— 返回某一地址的所有交易记录，包括解码的日志事件。这一函数将深度抓取区块链并返回索引到这一地址的所有交易
 - **Transfers** —— 获取某一地址的ERC-20代币转移记录以及历史代币价格（若有）)
 - **Token Holders** —— 返回代币持有者列表，并标有页码
 - **Log Events (Smart Contract)** —— 返回特定智能合约发出的已解码日志事件，并标有页码
 - **Log Events (Topic Hash)** —— 返回已解码日志事件，各个事件主题的哈希值之间用逗号分开，并标有页码


### 请求格式 {: #request-formatting } 
| 终端 |     | 格式 |
| :---------- | :-: | :------------------- |
|      Balances       |     |          api.covalenthq.com/v1/1287/address/{address}/balances_v2/          |
|      Transactions       |     |           api.covalenthq.com/v1/1287/address/{address}/transactions_v2/|
|      Transfers       |     |           api.covalenthq.com/v1/1287/address/{address}/transfers_v2/           |
|      Token Holders       |     |           api.covalenthq.com/v1/1287/tokens/{contract_address}/token_holders/           |
|      Log Events (Smart Contract)       |     |           api.covalenthq.com/v1/1287/events/address/{contract_address}/           |
|      Log Events (Topic Hash)      |     |           api.covalenthq.com/v1/1287/events/topics/{topic}/           |

## 查看先决条件 {: #checking-prerequisites } 

所有请求均需进行验证。要想使用Covalent API，用户需要有[可用的API密钥](https://www.covalenthq.com/platform/#/auth/register/){target=_blank}，此外还需要执行以下操作：

 - 安装MetaMask并[连接到Moonbase](/tokens/connect/metamask/){target=_blank}
 - 具有拥有一定数量资金的账户。 
 --8<-- 'text/faucet/faucet-list-item.md'
 
## Covalent API使用测试 {: #try-it-out } 
首先确保您已获得以“ckey_”开头的[API密钥](https://www.covalenthq.com/platform/#/auth/register/){target=_blank}。Token Holders终端将返回某一特定代币所有持有者的列表，调用这个API需要执行以下操作：

 - 您的API密钥
 - Moonbase Alpha Chain ID: {{ networks.moonbase.chain_id }} (hex: {{ networks.moonbase.hex_chain_id }})
 - 智能合约（此示例中为ERTH代币）：0x08B40414525687731C23F430CEBb424b332b3d35

### 使用Curl  {: #using-curl } 
将占位符替换为您的API密钥，然后在终端窗口运行以下指令。

```
curl https://api.covalenthq.com/v1/1287/tokens/\
0x08B40414525687731C23F430CEBb424b332b3d35/token_holders/ \
-u {YOUR API KEY HERE}:
```
!!! 注意事项
    API密钥后的冒号`:`非常重要，如果没有这个冒号，您就会被要求输入密码（但其实不需要密码）。


Covalent API将返回ERTH代币持有者名单。如果您未持有ERTH代币，名单中将不会出现您的地址。访问[Moonbase Alpha ERC-20代币任务中心](https://moonbase-minterc20.netlify.app/)，先铸造一些ERTH代币，然后再重复以上的Covalent API请求步骤。Covalent API会进行实时更新，现在您应该会在ERTH代币持有者名单中看到自己的地址。

## Javascript示例 {: #javascript-examples } 

复制粘贴以下代码块到您选择的环境中，或是[JSFiddle](https://jsfiddle.net/){target=_blank}中。设置好API密钥后，将该地址设置为常用地址。请记住，我们在Moonbase Alpha网络中的链上ID是`{{ networks.moonbase.chain_id }}`。

=== "Using Fetch"
    ```js
    // set your API key
	const APIKEY = 'YOUR API KEY HERE';

	function getData() {
	const address = '0xFEC4f9D5B322Aa834056E85946A32c35A3f5aDD8'; //example
	const chainId = '{{ networks.moonbase.chain_id }}'; //Moonbeam Testnet (Moonbase Alpha Chain ID)
	const url = new URL(`https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`);
	
	url.search = new URLSearchParams({
	    key: APIKEY
	})
	
	// use fetch API to get Covalent data
	fetch(url)
	.then((resp) => resp.json())
	.then(function(data) {
	    const result = data.data;
	  
	    console.log(result)
	    return result
	    }
	)}
	
	getData();
	```

=== "Using Async"
    ```js
    // set your API key
    const APIKEY = 'YOUR API KEY HERE';
	const address = '0xFEC4f9D5B322Aa834056E85946A32c35A3f5aDD8'; //example
	const chainId = '{{ networks.moonbase.chain_id }}'; //Moonbeam Testnet (Moonbase Alpha Chain ID)
	const url = new URL(`https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`);

    url.search = new URLSearchParams({
        key: APIKEY
    })
    
    async function getData() {
    	const response = await fetch(url);
    	const result = await response.json();
    	console.log(result)
    	return result;
    }
    
    getData();
    
    ```

输出内容应与以下内容相似。余额终端将返回所有ERC-20和NFT代币余额（包括ERC-721和ERC-1155）列表，以及它们目前的现货价格（若有）。

![Javascript Console Output](/images/builders/integrations/indexers/covalent/covalentjs.png)

## Python示例 {: #python-example }
Covalent没有官方的API包装器，用户需要使用Python [请求库](https://pypi.org/project/requests/){target=_blank}才能直接调用API。通过`pip install requests`从指令行中将请求安装到运行环境中，然后将其导入，并在您的代码中使用。使用HTTP verbs get方法从API中返回相关信息。复制粘贴以下代码块到您选择的环境并运行。输出内容将与以上截图相似，但形式可能有所不同，这取决于运行环境。

```python
import requests

def fetch_wallet_balance(address):
	api_url = 'https://api.covalenthq.com'
    endpoint = f'/v1/1287/address/{address}/balances_v2/'
    url = api_url + endpoint
    r = requests.get(url, auth=('YOUR API KEY HERE',''))
    print(r.json())
    return(r.json())

#Example address request
fetch_wallet_balance('0xFEC4f9D5B322Aa834056E85946A32c35A3f5aDD8')

```

!!! 注意事项
    `auth`的第二个参数留空，因为不需要密码，只需要您的API密钥。

### 由社区创建的工具库 {: #community-built-libraries } 
Covalent目前拥有Python、Node、Go代码库，这些代码库作为[Covalent Alchemists项目](https://www.covalenthq.com/alchemists/){target=_blank}的一部分，都是由社区进行创建和维护。这些社区创建的工具为Covalent API用户带来价值，可以在[这里获取](https://www.covalenthq.com/docs/tools/community){target=_blank}。

!!! 注意事项
    这些工具并非由Covalent进行维护。用户需要自行尽职调查，在使用这些项目的工具之前对其进行评估。

--8<-- 'text/disclaimers/third-party-content.md'