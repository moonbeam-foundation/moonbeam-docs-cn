---
title: Covalent API
description: 使用Covalent API查询Moonbeam上的区块链数据，例如余额、交易、转账、Token持有者和日志。
---

# 开始使用Covalent API

## 概览 {: #introduction }

[Covalent](https://www.covalenthq.com/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}是一个托管式区块链数据解决方案，提供访问[超过100个支持区块链](https://www.covalenthq.com/docs/networks/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}的历史和当前链上数据，包括[Moonbeam、Moonriver和Moonbase Alpha](https://www.covalenthq.com/docs/networks/moonbeam/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}。Covalent维护每个支持区块链的完整档案副本，即区块链的余额、日志事件和NFT数据均可以从创世区块获取。这些数据可以通过以下方式获取：

- [Unified API](#unified-api) - 使用熟悉的REST API将区块链数据合并到您的app中
- [Increment](#increment) - 使用无代码分析来创建和嵌入自定义图表

本教程涵盖了使用[Covalent API](https://www.covalenthq.com/docs/api/){target=\_blank}所需的所有内容，以及如何使用curl指令访问Moonbeam API端点、JavaScript和Python片段。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Unified API {: #unified-api }

Covalent的Unified API是一个功能强大且易于使用的REST API，它为所有区块链网络上的资产提供可见性。对应每一个网络它的请求和响应对象格式都是一致的。例如，一个用户想要获取同一个钱包地址在所有支持链上的不同Token余额，他只要通过改变请求URL中的唯一区块链名称或ID路径参数就能做到。Covalent的Unified API比JSON-RPC接口提供了更多的数据灵活性，后者通常仅限于特定区块上的数据查询。Covalent的Unified API也允许查询多个对象并批量导出数据。

[![Example API response in JSON](/images/builders/integrations/indexers/covalent/covalent-1.png)](https://www.covalenthq.com/docs/api/balances/get-token-balances-for-address/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank} *点击上述图片亲自尝试请求。*

### 快速开始 {: #quick-start }

如果您已熟悉Covalent并已经准备好开始操作，只需chainID和网络名称即可快速开始。

=== "Moonbeam"
    |    参数     |                 值                 |
    |:-----------:|:----------------------------------:|
    | `chainName` |         `moonbeam-mainnet`         |
    |  `chainID`  | `{{ networks.moonbeam.chain_id }}` |

=== "Moonriver"
    |    参数     |                 值                  |
    |:-----------:|:-----------------------------------:|
    | `chainName` |        `moonbeam-moonriver`         |
    |  `chainID`  | `{{ networks.moonriver.chain_id }}` |

=== "Moonbase Alpha"
    |    参数     |                 值                 |
    |:-----------:|:----------------------------------:|
    | `chainName` |     `moonbeam-moonbase-alpha`      |
    |  `chainID`  | `{{ networks.moonbase.chain_id }}` |

### Unified API基础知识 {: #fundamentals-of-the-unified-api }

 - Covalent API是RESTful，围绕网页端界面主要资源进行开发
 - 当前API版本为V1
 - 所有端点的默认返回形式为JSON
 - 所有请求均要验证，用户需要获取一个[免费的API密钥](https://www.covalenthq.com/platform/#/auth/register/){target=\_blank}来使用Covalent API
 - API调用的收费以credit计价，并根据特定调用而有所不同。创建API密钥后，您将获得大量免费credit开始操作（截至本文撰写时为100,000）。您可以在[Increment数据面板](https://www.covalenthq.com/platform/increment/#/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}上追踪这些免费credit的使用情况
 - API的root URL为[https://api.covalenthq.com/v1/](https://api.covalenthq.com/v1/){target=\_blank}
 - 所有请求均通过HTTPS完成（通过纯HTTP的调用将失败）
 - Covalent API采用实时刷新方式，刷新率为30秒或2个区块，每批次为10分钟或40个区块

### 端点类型 {: #types-of-endpoints }

Covalent API有三类端点：

 - **A类** — A端点提供丰富的在所有区块链网络共通的数据，包括余额、交易和日志事件等
 - **B类** — 专门为特定区块链上的特定协议而设置的端点，例如Uniswap就是仅适用于以太坊的端点，无法在其他区块链网络上使用
 - **C类** — 由社区构建并维护，但由Covalent基础设施提供支持的端点

### 支持端点的示例 {: #sample-supported-endpoints }

支持端点的完整列表请查看[Covalent API参考文档](https://www.covalenthq.com/docs/api/guide/overview/){target=\_blank}。支持端点包括但不限于：

 - **Balances** — 获取某一地址的Token余额。这一函数将返回一个包含所有ERC-20和NFT Token余额（包括ERC-721和ERC-1155）的列表，以及这些Token目前的现货价格（若有）
 - **Transactions** — 返回某一地址的所有交易记录，包括解码的日志事件。这一函数将深度抓取区块链并返回索引到这一地址的所有交易
 - **Transfers** — 获取某一地址的ERC-20 Token转移记录以及历史Token价格（若有）
 - **Token holders** — 返回Token持有者列表，并标有页码
 - **Log events (smart contract)** — 返回特定智能合约发出的已解码日志事件列表，并标有页码
 - **Log events (topic hash)** — 返回已解码日志事件列表，并标有页码，各个事件主题的哈希值之间用逗号分开
 - **Security (Token Approvals)** — 返回按钱包资产的支出者分类的所有Token合约的批准列表

### 请求格式 {: #request-formatting }

=== "Moonbeam"
    |                                                                                  端点                                                                                  |                                              格式                                               |
    |:----------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------:|
    |          [Balances](https://www.covalenthq.com/docs/api/balances/get-token-balances-for-address/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}           |      api.covalenthq.com/v1/{{ networks.moonbeam.chain_id }}/address/{ADDRESS}/balances_v2/      |
    |       [Transactions](https://www.covalenthq.com/docs/api/transactions/get-transactions-for-address/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}        |    api.covalenthq.com/v1/{{ networks.moonbeam.chain_id }}/address/{ADDRESS}/transactions_v2/    |
    |                            [Transfers](https://www.covalenthq.com/docs/api/balances/get-erc20-token-transfers-for-address/){target=\_blank}                             |     api.covalenthq.com/v1/{{ networks.moonbeam.chain_id }}/address/{ADDRESS}/transfers_v2/      |
    |                   [Token holders](https://www.covalenthq.com/docs/api/balances/#balances/get-token-holders-as-of-any-block-height-v2){target=\_blank}                   | api.covalenthq.com/v1/{{ networks.moonbeam.chain_id }}/tokens/{CONTRACT_ADDRESS}/token_holders/ |
    | [Log events (smart contract)](https://www.covalenthq.com/docs/api/base/get-log-events-by-contract-address/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank} |    api.covalenthq.com/v1/{{ networks.moonbeam.chain_id }}/events/address/{CONTRACT_ADDRESS}/    |
    |                            [Log events (topic hash)](https://www.covalenthq.com/docs/api/base/get-log-events-by-topic-hash/){target=\_blank}                            |          api.covalenthq.com/v1/{{ networks.moonbeam.chain_id }}/events/topics/{TOPIC}/          |
    |                       [Security (Token Approvals)](https://www.covalenthq.com/docs/api/security/get-token-approvals-for-address/){target=\_blank}                       |           api.covalenthq.com/v1/{{ networks.moonbeam.chain_id }}/approvals/{ADDRESS}/           |

=== "Moonriver"
    |                                                                                  端点                                                                                  |                                               格式                                               |
    |:----------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------:|
    |          [Balances](https://www.covalenthq.com/docs/api/balances/get-token-balances-for-address/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}           |      api.covalenthq.com/v1/{{ networks.moonriver.chain_id }}/address/{ADDRESS}/balances_v2/      |
    |       [Transactions](https://www.covalenthq.com/docs/api/transactions/get-transactions-for-address/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}        |    api.covalenthq.com/v1/{{ networks.moonriver.chain_id }}/address/{ADDRESS}/transactions_v2/    |
    |                            [Transfers](https://www.covalenthq.com/docs/api/balances/get-erc20-token-transfers-for-address/){target=\_blank}                             |     api.covalenthq.com/v1/{{ networks.moonriver.chain_id }}/address/{ADDRESS}/transfers_v2/      |
    |                   [Token holders](https://www.covalenthq.com/docs/api/balances/#balances/get-token-holders-as-of-any-block-height-v2){target=\_blank}                   | api.covalenthq.com/v1/{{ networks.moonriver.chain_id }}/tokens/{CONTRACT_ADDRESS}/token_holders/ |
    | [Log events (smart contract)](https://www.covalenthq.com/docs/api/base/get-log-events-by-contract-address/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank} |    api.covalenthq.com/v1/{{ networks.moonriver.chain_id }}/events/address/{CONTRACT_ADDRESS}/    |
    |                            [Log events (topic hash)](https://www.covalenthq.com/docs/api/base/get-log-events-by-topic-hash/){target=\_blank}                            |          api.covalenthq.com/v1/{{ networks.moonriver.chain_id }}/events/topics/{TOPIC}/          |
    |                       [Security (Token Approvals)](https://www.covalenthq.com/docs/api/security/get-token-approvals-for-address/){target=\_blank}                       |           api.covalenthq.com/v1/{{ networks.moonriver.chain_id }}/approvals/{ADDRESS}/           |

=== "Moonbase Alpha"
    |                                                                                  端点                                                                                  |                                              格式                                               |
    |:----------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------:|
    |          [Balances](https://www.covalenthq.com/docs/api/balances/get-token-balances-for-address/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}           |      api.covalenthq.com/v1/{{ networks.moonbase.chain_id }}/address/{ADDRESS}/balances_v2/      |
    |       [Transactions](https://www.covalenthq.com/docs/api/transactions/get-transactions-for-address/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}        |    api.covalenthq.com/v1/{{ networks.moonbase.chain_id }}/address/{ADDRESS}/transactions_v2/    |
    |                            [Transfers](https://www.covalenthq.com/docs/api/balances/get-erc20-token-transfers-for-address/){target=\_blank}                             |     api.covalenthq.com/v1/{{ networks.moonbase.chain_id }}/address/{ADDRESS}/transfers_v2/      |
    |                   [Token holders](https://www.covalenthq.com/docs/api/balances/#balances/get-token-holders-as-of-any-block-height-v2){target=\_blank}                   | api.covalenthq.com/v1/{{ networks.moonbase.chain_id }}/tokens/{CONTRACT_ADDRESS}/token_holders/ |
    | [Log events (smart contract)](https://www.covalenthq.com/docs/api/base/get-log-events-by-contract-address/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank} |    api.covalenthq.com/v1/{{ networks.moonbase.chain_id }}/events/address/{CONTRACT_ADDRESS}/    |
    |                            [Log events (topic hash)](https://www.covalenthq.com/docs/api/base/get-log-events-by-topic-hash/){target=\_blank}                            |          api.covalenthq.com/v1/{{ networks.moonbase.chain_id }}/events/topics/{TOPIC}/          |
    |                       [Security (Token Approvals)](https://www.covalenthq.com/docs/api/security/get-token-approvals-for-address/){target=\_blank}                       |           api.covalenthq.com/v1/{{ networks.moonbase.chain_id }}/approvals/{ADDRESS}/           |

### API参数 {: #api-parameters }

=== "Moonbeam"
    |          参数          |       值        |
    |:----------------------:|:---------------:|
    |    Response Formats    |    JSON, CSV    |
    | Real-Time Data Latency |    2 blocks     |
    |   Batch Data Latency   |   30 minutes    |
    |     API Free Tier      | Limit of 4 RPS  |
    |    API Premium Tier    | Limit of 50 RPS |

=== "Moonriver"
    |          参数          |       值        |
    |:----------------------:|:---------------:|
    |    Response Formats    |    JSON, CSV    |
    | Real-Time Data Latency |    2 blocks     |
    |   Batch Data Latency   |   30 minutes    |
    |     API Free Tier      | Limit of 4 RPS  |
    |    API Premium Tier    | Limit of 50 RPS |

=== "Moonbase Alpha"
    |          参数          |       值        |
    |:----------------------:|:---------------:|
    |    Response Formats    |    JSON, CSV    |
    | Real-Time Data Latency |    2 blocks     |
    |   Batch Data Latency   |   30 minutes    |
    |     API Free Tier      | Limit of 4 RPS  |
    |    API Premium Tier    | Limit of 50 RPS |

### API参考资料 {: #api-resources }

- [API参考和浏览器内端点演示](https://www.covalenthq.com/docs/api/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}
- [Covalen快速入门](https://www.covalenthq.com/docs/unified-api/quickstart/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}
- [教程参考](https://www.covalenthq.com/docs/unified-api/guides/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}

## 如何使用Unified API {: #how-to-use-the-unified-api }

首先，确保您有[API密钥](https://www.covalenthq.com/platform/#/auth/register/){target=\_blank}，以`ckey_`开头。拥有API密钥后，您能够访问任何支持的端点。要获取特定网络的信息，您需要提供chain ID。

### 查看先决条件 {: #checking-prerequisites }

要开始使用Covalent API，您需要准备以下内容：

 - 免费的[Covalent AP密钥](https://www.covalenthq.com/platform/#/auth/register/){target=\_blank}
 - 安装MetaMask并将其[连接至Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
 - 一个拥有资金的账户。
    --8<-- 'text/_common/faucet/faucet-list-item.md'

### 使用Curl {: #using-curl }

Token Holder端点是Covalent支持的端点之一，该端点返回特定Token的所有Token持有者的列表。在本示例中，您可以检查ERTH的Token持有者。Moonbase Alpha上的ERTH Token合约地址为：`0x08B40414525687731C23F430CEBb424b332b3d35`。

将占位符替换成API密钥后，尝试在终端窗口中运行以下命令：

```bash
curl https://api.covalenthq.com/v1/1287/tokens/\
0x08B40414525687731C23F430CEBb424b332b3d35/token_holders/ \
-u { INSERT_YOUR_API_KEY }:
```

!!! 注意事项
    API密钥后面的冒号`:`必不可少，否则系统会提示您输入密码（实则不需要）。

您的地址需要拥有一些ERTH Token，否则您的地址将不会出现在列表中。前往 [Moonbase Alpha ERC-20水龙头](https://moonbase-minterc20.netlify.app/){target=\_blank}，先铸造一些ERTH Token，然后再重复以上的Covalent API请求步骤。Covalent API会进行实时更新，现在您应该会在ERTH Token持有者名单中看到自己的地址。

### 使用Javascript {: #using-javascript }

复制粘贴以下代码块到您选择的环境中，或是[JSFiddle](https://jsfiddle.net/){target=\_blank}中。设置好API密钥后，将该地址设置为常用地址。请记住，我们在Moonbase Alpha网络中的chain ID是`{{ networks.moonbase.chain_id }}`。

=== "Using Fetch"

    ```js
    // set your API key
    const apiKey = 'INSERT_YOUR_API_KEY';
    
    function getData() {
    const address = '0xFEC4f9D5B322Aa834056E85946A32c35A3f5aDD8'; // example
    const chainId = '{{ networks.moonbase.chain_id }}'; // Moonbase Alpha TestNet chain ID
    const url = new URL(
      `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`
    );
    
    url.search = new URLSearchParams({
      key: apiKey,
    });
    
    // use fetch API to get Covalent data
    fetch(url)
      .then((resp) => resp.json())
      .then(function (data) {
      const result = data.data;
    
      console.log(result);
      return result;
      });
    }
    
    getData();
    ```

=== "Using Async"

    ```js
    // set your API key
    const apiKey = 'INSERT_YOUR_API_KEY';
    const address = '0xFEC4f9D5B322Aa834056E85946A32c35A3f5aDD8'; // example
    const chainId = '{{ networks.moonbase.chain_id }}'; // Moonbase Alpha TestNet chain ID
    const url = new URL(
      `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`
    );
    
    url.search = new URLSearchParams({
      key: apiKey,
    });
    
    async function getData() {
      const response = await fetch(url);
      const result = await response.json();
      console.log(result);
      return result;
    }
    
    getData();
    ```

balances端点返回所有ERC-20和NFT Token余额的列表，包括ERC-72和ERC-1155余额，及其当前的现货价格（若有）。

![JavaScript Console Output](/images/builders/integrations/indexers/covalent/covalent-2.png)

### 使用Python {: #using-python }

Covalent没有官方的API包装器，用户需要使用Python[请求库](https://pypi.org/project/requests/){target=\_blank}才能直接调用API。通过`pip install requests`从指令行中将请求安装到运行环境中，然后将其导入，并在您的代码中使用。使用HTTP verbs get方法从API中返回相关信息。复制粘贴以下代码块到您选择的环境并运行。输出内容将与以上截图相似，但形式可能有所不同，这取决于运行环境。

```python
import requests


def fetch_wallet_balance(address):
    api_url = "https://api.covalenthq.com"
    endpoint = f"/v1/{{ networks.moonbase.chain_id }}/address/{address}/balances_v2/"
    url = api_url + endpoint
    response = requests.get(url, auth=("INSERT_YOUR_API_KEY", ""))
    print(response.json())
    return response.json()


# Example address request
fetch_wallet_balance("0xFEC4f9D5B322Aa834056E85946A32c35A3f5aDD8")
```

!!! 注意事项
    `auth`的第二个参数留空，因为不需要密码，只需要您的API密钥。

## Increment {: #increment }

[Increment](https://www.covalenthq.com/docs/increment/){target=\_blank}是一个无代码图表与报告生成工具，它让用户能够使用数据模型来构建动态、个性化的图表。该工具直接将业务逻辑（包括覆盖范围、留存率和收入）编码到一个SQL编译器中，然后由该编译器输出有效的SQL结果。Increment能够将使用SQL创建的任何图表转换并嵌入进一个标准化且开源的维度(dimension)和度量(measure)集合，其被称为模型。

[![Example Increment chart](/images/builders/integrations/indexers/covalent/covalent-3.png)](https://www.covalenthq.com/platform/increment/#/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank} *点击上述图片尝试Increment。*

### 常见用例 {: #common-use-cases }

Increment可用于：

- [分析区块链网络](https://www.covalenthq.com/docs/increment/data-models/chain-gdp/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}
- [分析DEX](https://www.covalenthq.com/docs/increment/data-models/swap-land/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}
- [分析NFT市场](https://www.covalenthq.com/docs/increment/data-models/jpeg-analysis/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}
- [追踪月度活跃钱包](https://www.covalenthq.com/docs/networks/moonbeam/?utm_source=moonbeam&utm_medium=partner-docs#network-status){target=\_blank}

[![Example network status increment](/images/builders/integrations/indexers/covalent/covalent-4.png)](https://www.covalenthq.com/docs/networks/moonbeam/?utm_source=moonbeam&utm_medium=partner-docs#network-status){target=\_blank} *点击上图获取最新的Moonbeam网络活跃钱包数，交易笔数和Token数（可按日、周、月或年获取数据）。*

### Increment参考资料 {: #increment-resources }

- [Increment平台](https://www.covalenthq.com/platform/increment/#/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}
- [Increment文档](https://www.covalenthq.com/docs/increment/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}
- [数据模型概览](https://www.covalenthq.com/docs/increment/data-models/model-intro/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}
- [浏览所有数据模型](https://www.covalenthq.com/platform/increment/#/pages/covalent/chain-gdp/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}
- [与数据模型交互](https://www.covalenthq.com/platform/increment/#/sql/query_b6c88fd8604f49d5920ca86fa7/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}

--8<-- 'text/_disclaimers/third-party-content.md'
