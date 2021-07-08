title: Covalent API
description: 使用 Covalent API Moonbeam 查询区块链数据
---

# 开始使用Covalent API

![The Graph on Moonbeam](/images/covalent/covalentbannerimage.png)

## 概览

Covalent通过统一的API为所有区块链网络上的资产提供完全的公开透明。简而言之，用户无需任何代码，就可以从各个区块链上获取详细的区块链交易数据。通过统一的Covalent API界面，用户可以创建全新的应用程序或者调整现有的应用程序，无需重新配置或维护基础设施。Covalent现已支持Moonbase Alpha，并且计划支持Moonbeam和Moonriver。

## 查看先决条件

所有请求均需进行验证。要想使用Covalent API，用户需要有[可用的API密钥](https://www.covalenthq.com/platform/#/auth/register/)，此外还需要执行以下操作：

 - 安装MetaMask并[连接到Moonbase](/getting-started/moonbase/metamask/)
 - 拥有一个账户并存有一定资金，该账户可以从[Mission Control](https://docs.moonbeam.network/getting-started/moonbase/faucet/)创建

## 终端类型

Covalent API有两类终端：

 - **A类** —— 可以在所有区块链网络中使用，能够返回详细区块链数据的终端，包括余额、交易和日志事件等
 - **B类** —— 专门为特定区块链上的特定协议而设置的终端，例如Uniswap就是仅适用于以太坊的终端，无法在其他区块链网络上使用

## Covalent API基础知识
 - Covalent API是RESTful，围绕网页端界面主要资源进行开发
 - 当前的Covalent API版本为版本1
 - 所有终端的默认返回形式为JSON
 - 所有请求均要求验证，用户需要有[可用的API密钥](https://www.covalenthq.com/platform/#/auth/register/)才能使用Covalent API
 - Covalent API的根URL为https://api.covalenthq.com/v1/
 - 所有请求均通过HTTPS完成（若使用HTTP则请求失败）
 - Covalent API采用实时刷新方式，刷新率为30秒或2个区块，每批次为10分钟或40个区块

## 支持终端
 - **Balances** —— 获取某一地址的代币余额。这一函数将返回一个包含所有ERC20和NFT代币余额（包括ERC721 和ERC1155）的列表，以及这些代币目前的现货价格（若有）
 - **Transactions** —— 返回某一地址的所有交易记录，包括解码的日志事件。这一函数将深度抓取区块链并返回索引到这一地址的所有交易
 - **Transfers** —— 获取某一地址的ERC20代币转移记录以及历史代币价格（若有）)
 - **Token Holders** —— 返回代币持有者列表，并标有页码
 - **Log Events (Smart Contract)** —— 返回特定智能合约发出的已解码日志事件，并标有页码
 - **Log Events (Topic Hash)** —— 返回已解码日志事件，各个事件主题的哈希值之间用逗号分开，并标有页码


### 请求格式
| 终端 |     | 格式 |
| :---------- | :-: | :------------------- |
|      Balances       |     |          api.covalenthq.com/v1/1287/address/{address}/balances_v2/          |
|      Transactions       |     |           api.covalenthq.com/v1/1287/address/{address}/transactions_v2/|
|      Transfers       |     |           api.covalenthq.com/v1/1287/address/{address}/transfers_v2/           |
|      Token Holders       |     |           api.covalenthq.com/v1/1287/tokens/{contract_address}/token_holders/           |
|      Log Events (Smart Contract)       |     |           api.covalenthq.com/v1/1287/events/address/{contract_address}/           |
|      Log Events (Topic Hash)      |     |           api.covalenthq.com/v1/1287/events/topics/{topic}/           |

## Covalent API使用测试
首先确保您已获得以“ckey_”开头的[API密钥](https://www.covalenthq.com/platform/#/auth/register/)。Token Holders终端将返回某一特定代币所有持有者的列表，调用这个API需要执行以下操作：

 - 您的API密钥
 - Moonbase Alpha Chain ID: 1287
 - 智能合约（此示例中为ERTH代币）：0x08B40414525687731C23F430CEBb424b332b3d35

### 使用Curl
将占位符替换为您的API密钥，然后在终端窗口运行以下指令。

```
curl https://api.covalenthq.com/v1/1287/tokens/\
0x08B40414525687731C23F430CEBb424b332b3d35/token_holders/ \
-u {YOUR API KEY HERE}:
```
!!! 注意事项
    API密钥后的冒号`:`非常重要，如果没有这个冒号，您就会被要求输入密码（但其实不需要密码）。


Covalent API将返回ERTH代币持有者名单。如果您未持有ERTH代币，名单中将不会出现您的地址。访问[Moonbase Alpha ERC-20代币水龙头](https://moonbase-minterc20.netlify.app/)，先铸造一些ERTH代币，然后再重复以上的Covalent API请求步骤。Covalent API会进行实时更新，现在您应该会在ERTH代币持有者名单中看到自己的地址。

## Javascript示例
复制粘贴以下代码块到您选择的环境中，或是[JSFiddle](https://jsfiddle.net/)中。设置好API密钥后，将该地址设置为常用地址。请记住，我们在Moonbase Alpha网络中的链上ID是`1287`。

=== "Using Fetch"
    ```js
    // set your API key
	const APIKEY = 'YOUR API KEY HERE';

	function getData() {
	const address = '0xFEC4f9D5B322Aa834056E85946A32c35A3f5aDD8'; //example
	const chainId = '1287'; //Moonbeam Testnet (Moonbase Alpha Chain ID)
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
	const chainId = '1287'; //Moonbeam Testnet (Moonbase Alpha Chain ID)
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

输出内容应与以下内容相似。余额终端将返回所有ERC20和NFT代币余额（包括ERC721和ERC1155）列表，以及它们目前的现货价格（若有）。

![Javascript Console Output](/images/covalent/covalentjs.png)

## Python示例
Covalent没有官方的API包装器，用户需要使用Python [请求库](https://pypi.org/project/requests/)才能直接调用API。通过`pip install requests`从指令行中将请求安装到运行环境中，然后将其导入，并在您的代码中使用。使用HTTP verbs get方法从API中返回相关信息。复制粘贴以下代码块到您选择的环境并运行。输出内容将与以上截图相似，但形式可能有所不同，这取决于运行环境。

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

### 由社区创建的工具库
Covalent目前拥有Python、Node、Go代码库，这些代码库作为[Covalent Alchemists项目](https://www.covalenthq.com/ambassador/)的一部分，都是由社区进行创建和维护。这些社区创建的工具为Covalent API用户带来价值，可以在[这里获取](https://www.covalenthq.com/docs/tools/community)。

!!! 注意事项
    这些工具并非由Covalent进行维护。用户需要自行尽职调查，在使用这些项目的工具之前对其进行评估。

