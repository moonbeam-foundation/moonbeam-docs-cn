---
title: Razor Network预言机
description: 如何通过智能合约在Moonbeam以太坊DApp使用Razor Network预言机喂价
---

# Razor Network预言机

## 概览 {: #introduction } 

开发者现在可以使用Razor Network预言机在Moonbase Alpha测试网上部署桥接合约，从而获取价格信息。桥接合约作为中间件发出事件信息，该信息被Razor Network预言机基础设施获取，并向桥接合约发送报价。

要想获取喂价，就需要与下表中的桥接合约地址进行交互：

|   网络    | |     合约地址        |
|:--------------:|-|:------------------------------------------:|
| Moonbase Alpha | | 0xa7f180fb18EF0d65049fE03d4308bA33a28b6513 |

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Jobs {: #jobs }

每个喂价数据都与一个Job ID相对应，例如：

| Job ID |      |  标的报价[美元]  |
| :----: | ---- | :--------------: |
|   1    |      |       ETH        |
|   2    |      |       BTC        |
|   3    |      | Microsoft Stocks |

通过[Razor网络浏览器](https://razorscan.io/#/custom){target=\_blank}可以查看喂价数据对应的Job ID（喂价每5分钟更新一次）。更多详情，请访问[Razor文档](https://docs.razor.network/){target=\_blank}。

## 从桥接合约获取数据 {: #get-data-from-bridge-contract } 

合约通过执行桥接合约接口可调用`getResult`和`getJob`函数以使用Razor Network预言机来获取代币价格等链上数据。

```solidity
pragma solidity 0.6.11;

interface Razor {
    
    function getResult(uint256 id) external view returns (uint256);
    
    function getJob(uint256 id) external view returns(string memory url, string memory selector, string memory name, bool repeat, uint256 result);
}
```

第一个函数`getResult`使用对应Job ID的数据源来获取报价。例如，输入`1`就会收到Job ID为 `1`的相应报价。

第二个函数`getJob`使用对应Job ID的数据源来获取关于数据源的基本信息，如名称、价格、获取价格的URL等。

### 合约示例 {: #example-contract } 

Moonbase Alpha测试网上已经预先部署了桥接合约（地址为`{{ networks.moonbase.razor.bridge_address }}`），方便您快速查看Razor Network预言机的喂价信息。

您只需要桥接合约接口，该接口可调出`getResult`结构，让合约可以调用函数进行报价请求。


您可以使用以下`Demo`脚本，它包括了多个函数：

 - **fetchPrice** - 一个请求单一Job ID的_视图_函数。例如，输入任务ID`1`即可获取`ETH`/`USD`报价。
 - **fetchMultiPrices** - 一个请求多个Job ID的_视图_函数。例如，输入任务ID`[1,2]`即可同时获取`ETH`/`USD`和`BTC`/ `USD`报价。
 - **savePrice** - 一个请求单一Job ID的_公有_函数。函数将发送交易并修改储存在合约中的`price`变量。
 - **saveMultiPrices** - 一个请求多个Job ID的_公有_函数。例如，输入任务ID`[1,2]`即可同时获取`ETH`/`USD`和`BTC`/`USD`报价。函数将发送交易并修改储存在合约中的`pricesArr`阵列，阵列将按照输入顺序显示每个报价对的价格。

```solidity
pragma solidity 0.6.11;

interface Razor {
    function getResult(uint256 id) external view returns (uint256);
    function getJob(uint256 id) external view returns(string memory url, string memory selector, string memory name, bool repeat, uint256 result);
}

contract Demo {
    // Interface
    Razor internal razor;
    
    // Variables
    uint256 public price;
    uint256[] public pricesArr;

    constructor(address _bridgeAddress) public {
        razor = Razor(_bridgeAddress); // Bridge Contract Address
                                       // Moonbase Alpha {{ networks.moonbase.razor.bridge_address }}
    }

    function fetchPrice(uint256 _jobID) public view returns (uint256){
        return razor.getResult(_jobID);
    }
    
    function fetchMultiPrices(uint256[] memory jobs) external view returns(uint256[] memory){
        uint256[] memory prices = new uint256[](jobs.length);
        for(uint256 i=0;i<jobs.length;i++){
            prices[i] = razor.getResult(jobs[i]);
        }
        return prices;
    }
    
    function savePrice(uint _jobID) public {
        price = razor.getResult(_jobID);
    }

    function saveMultiPrices(uint[] calldata _jobIDs) public {
        delete pricesArr;
        
        for (uint256 i = 0; i < _jobIDs.length; i++) {
            pricesArr.push(razor.getResult(_jobIDs[i]));
        }

    }
}
```

### 在Moonbase Alpha上进行测试 {: #try-it-on-moonbase-alpha } 

测试预言机功能最简单的方式就是将接口指向部署在`{{ networks.moonbase.razor.bridge_address }}`的桥接合约：

```solidity
pragma solidity 0.6.11;

interface Razor {
    function getResult(uint256 id) external view returns (uint256);
    function getJob(uint256 id) external view returns(string memory url, string memory selector, string memory name, bool repeat, uint256 result);
}
```

完成后，您将获得两个视图函数，和此前的示例非常相似：

 - **getPrice** - 根据函数中对应输入的数据，提供单一Job ID喂价。例如，输入任务ID`1`就会收到`ETH`/`USD`的报价。
 - **getMultiPrices** - 根据函数中对应输入的阵列，提供多个Job ID喂价。例如，输入Job ID`[1,2]`就会收到`ETH`/`USD`和`BTC`/`USD`的报价。

下面您可以尝试通过[Remix](/builders/build/eth-api/dev-env/remix/)获取`BTC`/ `USD` 的报价。

创建文件和编译合约后，点击**Deploy and Run Transactions**标签，输入合约地址（`{{ networks.moonbase.razor.bridge_address }}`）并点击**At Address**。请确保已将**ENVIRONMENT**设置为**Injected Web3**，只有在该设置下才能与Moonbase Alpha连接（通过Web3 提供者的钱包）。

![Razor Remix deploy](/images/builders/integrations/oracles/razor/razor-demo-1.png)

通过这一方法，您将创建一个可以进行交互的demo合约实例。使用`getPrice()`和`getMultiPrices()`函数即可请求相应报价对的数据。

![Razor check price](/images/builders/integrations/oracles/razor/razor-demo-2.png)

--8<-- 'text/_disclaimers/third-party-content.md'
