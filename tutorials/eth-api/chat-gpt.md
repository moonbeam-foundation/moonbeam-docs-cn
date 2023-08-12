---
title: 使用GPT-4编写和调试Solidity智能合约
description: 学习如何使用OpenAI的ChatGPT（GPT-4）生成AI LLM以在Moonbeam网络上编写、调试和部署Solidity智能合约
---

# 使用GPT-4来编写和调试Solidity智能合约

![Banner Image](/images/tutorials/eth-api/chatgpt/chatgpt-banner.png)

_作者：Kevin Neilson_

## 概览 {: #introduction }

现今，走在街上几乎到处都能听到有关生成式人工智能带来变革性影响的类似对话。当然，这同时适用于物理世界和虚拟世界（例如Twitter）。您现在可能已经听说过像ChatGPT这样的人工智能工具可以计划您的假期、起草一篇论文，并给您讲一个笑话。但您知道ChatGPT甚至可以为您编写可用的Solidity代码吗？而且，它不仅止于返回一个没有任何上下文的`.sol`文件。它实际上可以向您解释代码的结构，引导您完成部署步骤，以及*drumroll*，甚至为您编写测试文件。是的，没错。当ChatGPT可以为您解决这个问题时，就不再有缺乏测试覆盖率的借口了。

在本教程中，我们将会探讨ChatGPT如何协助您编写、部署和调试Solidity智能合约。但首先，我们需要更深入了解什么是ChatGPT。

## ChatGPT概览 {: #an-overview-of-chatgpt }

### 什么是 ChatGPT？ {: #what-is-chatgpt }

[ChatGPT](https://chat.openai.com/){target=_blank}是由OpenAI公司创建的基于文本的大型语言模型（LLM）。根据OpenAI的说法，*“对话格式使ChatGPT能够回答后续问题、承认错误、挑战不正确的前提并拒绝不适当的请求。”*ChatGPT可以与您进行对话并记住您的聊天历史记录，直到新对话开始。要了解有关ChatGPT的更多信息，请查看[OpenAI博客上的ChatGPT简介](https://openai.com/blog/chatgpt){target=_blank}。

### GPT-4与ChatGPT的对比 {: #gpt-4-vs-chatgpt }

截至本文撰写时，GPT-4是作为ChatGPT Plus订阅服务提供的最新版本，每月费用为20美元。虽然GPT-4是一项付费服务，但您可以使用早期版本中提供的免费服务等级来遵循相同的教程。GPT-4是一个明显更先进的模型，因此您可能会注意到回应质量与早期版本的差异，特别是在调试步骤的模型推理方面。

### 使用限制 {: #limitations }

- 截至本文撰写时，ChatGPT仍处于研究预览阶段
- ChatGPT有时会产生幻觉，即输出实际上是错误，但令人信服且听起来合理的答案。而且在这种情况下，它通常不会警告您不准确的情况
- ChatGPT所拥有的知识截止日期约为2021年9月。处于此日期之后的事件或是内容，它无法访问相关数据
- ChatGPT生成的代码并未经过审计、检查或验证，有可能包含错误
- 即使输入此教程中包含的相同内容至GPT-4，但仍然有可能获得不同的输出回答 - 因为ChatGPT作为语言模型的架构所致

![Limitations](/images/tutorials/eth-api/chatgpt/chatgpt-1.png)

**请注意，我们今天创建的合约仅用于教育目的，不适合用于真正的生产环境。**

## 查看先决条件 {: #checking-prerequisites }

要跟随本教程，您需要具备以下条件：

- 能访问[ChatGPT的免费OpenAI账户](https://chat.openai.com/){target=_blank}
- 一个能够用于Moonbase Alpha测试网并拥有足够DEV Token的账户，协助您部署合约
 --8<-- 'text/faucet/faucet-list-item.md'

## 注册一个OpenAI账户 {: #sign-up-for-an-openai-account }

您可以访问[OpenAI 网站](https://chat.openai.com/auth/login){target=_blank}注册免费账户以访问ChatGPT。您需要提供电子邮件地址和电话号码。完成本教程不需要订阅ChatGPT Plus。

![Sign up for OpenAI account](/images/tutorials/eth-api/chatgpt/chatgpt-2.png)

## 创建一个ERC-20 Token合约 {: #create-an-erc-20-token-contract }

要开始与[ChatGPT](https://chat.openai.com/?model=gpt-4){target=_blank}交互，您可以跟随以下步骤：

1. 在左上角点击**New Chat**
2. 选取您希望使用的模型，任何模型皆适用于此教程
3. 输入您的内容至输入框中并在确认后点击回车键

![Prompt chatGPT](/images/tutorials/eth-api/chatgpt/chatgpt-3.png)

关于第一个输入内容，我们将会询问ChatGPT如何创建一个ERC-20 Token，具有指定名称、标志和初始供应。您的输入内容并不需要与下方完全相同，您可以根据需求进行修改。

```text
I would like to create an ERC-20 token called "KevinToken" 
with the symbol "KEV" and an initial supply of 40000000.
```

![ChatGPT's 1st response](/images/tutorials/eth-api/chatgpt/chatgpt-4.png)

这是一个很好的开始。ChatGPT为我们生成了一个简单但实用的ERC-20 Token，它满足我们指定的所有参数。它还阐明了如何使用[OpenZeppelin标准](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol){target=_blank}创建ERC-20 Token合约，以及初始供应量的方向。最后，它提醒我们这只是一个开始，我们可能还希望实现其他考虑因素，例如铸币和销毁。

!!! 注意事项
    如果您并未获得您预期的输出，您可以点击**Regenerate Response**生成新的回答或重组您的要求。

ChatGPT能够随时在合约创建后进行修改或扩张。您只要呆在相同的聊天视窗中（不要点击新的对话视窗），ChatGPT即会包含其先前的输出。作为范例，让ChatGPT修改我们的Token以使其能够被铸造或销毁：

```text
This looks great, but I'd really like my ERC-20 to be both mintable and burnable. 
```

ChatGPT很乐意效劳。请注意它如何维护我们最初指定的参数，即Token名称和标志。

![ChatGPT's 2nd response](/images/tutorials/eth-api/chatgpt/chatgpt-5.png)

## 准备部署指令 {: #preparing-deployment-instructions }

此教程部分的命名非常谨慎，以避免暗示ChatGPT将为我们进行部署。ChatGPT无法访问互联网，无法直接与区块链网络交互，但它可以为我们提供详细的说明，解释我们如何自己做到这一点。现在让我们向ChatGPT询问有关部署最近创建的ERC20合约的说明。对于此示例，我们向ChatGPT询问[Hardhat部署说明](/builders/build/eth-api/dev-env/hardhat/){target=_blank}：

```text
I would like to use Hardhat to compile and deploy
 this smart contract to the Moonbase Alpha network.  
```

![ChatGPT's 3rd response](/images/tutorials/eth-api/chatgpt/chatgpt-6.png)

意料之中，ChatGPT为我们提供了一系列详细的部署步骤，从安装说明到完整的部署脚本。请注意，它甚至会记住我们第一个提示中的小细节。在我们的初始提示中，我们要求Token的初始供应量为`400000000`，ChatGPT将此参数包含在它生成的部署脚本中。

另一个观察结果是，它生成的RPC URL尽管有效，但却已过时。这一问题是由于ChatGPT的知识储备截止日期为2021年9月，即更新的RPC URL发布之前。Moonbase Alpha的当前RPC URL是：

```text
{{ networks.moonbase.rpc_url }}
```

!!! 注意事项
    ChatGPT的知识储备截止日期约为2021年9月。在此日期之后，它无法访问现今事件或其他数据。

ChatGPT输出的代码片段在此处被故意省略，以鼓励您自行尝试！请记住，用完全相同的指令提示它至少会产生略有不同的结果 - 这是[大型语言模型的固有特色](https://blog.dataiku.com/large-language-model-chatgpt){target=_blank}。

## 编写测试用例 {: #writing-test-cases }

到现在为止，您已经快成为ChatGPT专家了。因此，ChatGPT的功能扩展到为您的智能合约编写测试用例也就不足为奇了，您所需要做的就是询问：

```text
Hey GPT4 can you help me write some tests for the smart contract above?  
```

![ChatGPT's 4th response](/images/tutorials/eth-api/chatgpt/chatgpt-7.png)

ChatGPT为我们提供了大量测试用例，特别是围绕铸造和销毁功能。在它忙于编写测试用例时，但它似乎逐渐减弱并停止，在最后也没有通常会出现的总结评论。这次中断源于ChatGPT的500字限制。虽然500字的限制是一个硬性的停止，但ChatGPT的思路仍在继续，所以你可以简单地要求它继续，它会很高兴地答应。请注意，对于有限制消息数量的订阅方案，这将算作您分配的附加消息。

!!! 注意事项
    ChatGPT具有大约500个字词或是4,000个字符的回复限制。然而，您可以通过简单的询问其跟进信息来获得之后的部分。

![ChatGPT's 5th response](/images/tutorials/eth-api/chatgpt/chatgpt-8.png)

ChatGPT为我们完成了测试用例的编写，并通过告诉我们如何运行它们来结束。

## 调试 {: #debugging }

到目前为止，我们已经介绍了ChatGPT可以为您编写智能合约并帮助您部署和测试它们的功能。更重要的是，它还可以帮助您调试智能合约。您可以与ChatGPT分享您的问题，它将帮助您找到问题所在。

如果问题很明确，ChatGPT通常会告诉您到底出了什么问题以及如何修复它。在其他情况下，如果您面临的问题可能有多种根本原因，ChatGPT会建议潜在修复的列表。

如果您尝试了它建议的所有步骤，但问题仍然存在，您只需告知ChatGPT，它将继续帮助您排除故障。作为后续，它可能会要求您提供代码片段或系统配置信息，以更好地帮助您解决手头的问题。

[重入错误](https://web.archive.org/web/20221121064906/https://consensys.github.io/smart-contract-best-practices/attacks/reentrancy/){target=_blank}是导致[2016年以太坊上的原始DAO崩溃](https://en.wikipedia.org/wiki/The_DAO_(organization)){target=_blank}。让我们向ChatGPT提示一个包含重入漏洞的错误函数，看看ChatGPT是否能够发现问题。我们继续将以下不安全的代码片段复制并粘贴到ChatGPT中，并询问它是否有任何问题。

```solidity
// INSECURE
mapping (address => uint) private userBalances;

function withdrawBalance() public {
    uint amountToWithdraw = userBalances[msg.sender];
    (bool success, ) = msg.sender.call.value(amountToWithdraw)(""); // At this point, the caller's code is executed, and can call withdrawBalance again
    require(success);
    userBalances[msg.sender] = 0;
}
```

![ChatGPT's 6th response](/images/tutorials/eth-api/chatgpt/chatgpt-9.png)

可以看到，ChatGPT发现了确切的错误，解释了问题的根源，并让我们知道如何修复它。

## 高级提示工程 {: #advanced-prompt-engineering }

[提示工程](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/concepts/prompt-engineering){target=_blank}既是一门艺术，也是一门科学，掌握它可以帮助您充分利用ChatGPT等生成式AI工具。虽然不是详尽的列表，但以下是一些可以帮助您编写更好的提示的基本概念：

- 具体并参数化您的请求。您向ChatGPT提供的详细信息越多，实际输出就越符合您的期望
- 不要害怕修改！您不需要重复整个提示，您可以只要求更改，ChatGPT将相应地修改其之前的输出
- 考虑重复或改写提示的关键部分。一些研究表明大型语言模型会强调您重复的部分。您可以通过重申您想要解决的最重要的概念来完成提示

有关详细信息，请确保查看Microsoft的这篇关于[高级提示工程](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/concepts/advanced-prompt-engineering?pivots=programming-language-chat-completions){target=_blank}的文章。

## 结论 {: #conclusion }

如您所见，ChatGPT几乎可以帮助您完成智能合约开发过程的每一步。它可以帮助您为Moonbeam编写、部署和调试Solidity智能合约。尽管像ChatGPT这样的大型语言模型拥有强大的功能，但很明显，这只是该技术所提供的功能的开始。

重要的是要记住，ChatGPT只能作为开发者的辅助工具，不能完成任何类型的审计或审查。开发者必须注意，像ChatGPT这样的生成式AI工具可能会生成不准确、有错误或无法工作的代码。本教程中生成的任何代码仅用于演示目的，不应在生产环境中使用。

--8<-- 'text/disclaimers/educational-tutorial.md'

--8<-- 'text/disclaimers/third-party-content.md'
