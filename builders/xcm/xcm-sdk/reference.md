---
title: XCM SDK参考
description: Moonbeam XCM SDK中接口和方法的参考，可用于Moonbeam和生态中其他链之间的XCM转移。
---

# Moonbeam XCM SDK参考

![XCM SDK Banner](/images/builders/xcm/sdk/reference-banner.png)

## 概览 {: #introduction }

Moonbeam XCM SDK使开发者能够轻松从波卡或Kusama生态系统中的中继链和其他平行链向Moonbeam或Moonriver充提资产。通过使用SDK，您无需担心确定原始或目标资产的multilocation或在哪个网络上使用extrinsics来发送XCM转移。

SDK提供了一个API，其中包括一系列接口，可用于获取每个支持资产的资产信息、初始化网络的链信息、实用方法，以及能够存款、提现和查看余额信息的方法。

此页面包含一个XCM SDK中可用接口和方法的列表。更多关于如何使用XCM SDK接口和方法的信息，请参考[使用XCM SDK](/builders/xcm/xcm-sdk/xcm-sdk){target=_blank}教程。

## 核心接口 {: #core-sdk-interfaces }

SDK提供以下核心接口，并可通过[初始化](/builders/xcm/xcm-sdk/xcm-sdk/#initializing){target=_blank}后访问：

|                                      接口                                      |                                           描述                                            |
|:------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------:|
|       [`symbols`](/builders/xcm/xcm-sdk/xcm-sdk/#symbols){target=_blank}       |              一个包含初始化Moonbeam网络的每个支持资产的资产原链符号的列表。               |
|        [`assets`](/builders/xcm/xcm-sdk/xcm-sdk/#assets){target=_blank}        |    一个初始化Moonbeam网络支持资产的列表，及其资产ID、<br> Moonbeam上的预编译地址和资产符号     |
|   [`moonAsset`](/builders/xcm/xcm-sdk/xcm-sdk/#native-assets){target=_blank}   |               包含初始化Moonbeam网络的资产ID、预编译合约地址和原生资产符号                |
| [`moonChain`](/builders/xcm/xcm-sdk/xcm-sdk/#native-chain-data){target=_blank} | 包含初始化Moonbeam网络的链密钥、名称、WSS端点、平行链ID、<br> 原生资产小数位数、链ID和每秒单位 |

## 核心方法 {: #core-sdk-methods }

SDK提供以下核心方法：

|                                            方法                                             |                          描述                          |
|:-------------------------------------------------------------------------------------------:|:------------------------------------------------------:|
|           [`init()`](/builders/xcm/xcm-sdk/xcm-sdk/#initializing){target=_blank}            | 初始化XCM SDK。**必须在其他SDK方法调用前先调用此方法** |
|            [`deposit()`](/builders/xcm/xcm-sdk/xcm-sdk/#deposit){target=_blank}             |      发起一笔存款，以将资产从其他链转移至Moonbeam      |
|           [`withdraw()`](/builders/xcm/xcm-sdk/xcm-sdk/#withdraw){target=_blank}            |      发起一笔提现，以将资产从Moonbeam转移至其他链      |
| [`subscribeToAssetsBalanceInfo()`](/builders/xcm/xcm-sdk/xcm-sdk/#subscribe){target=_blank} |          监听每个支持资产的给定账户的余额更改          |
|     [`isXcmSdkDeposit()`](/builders/xcm/xcm-sdk/xcm-sdk/#deposit-check){target=_blank}      |     返回一个布尔值，指示给定的转账数据是否用于存款     |
|    [`isXcmSdkWithdraw()`](/builders/xcm/xcm-sdk/xcm-sdk/#withdraw-check){target=_blank}     |     返回一个布尔值，指示给定的转账数据是否用于提现     |
|          [`toDecimals()`](/builders/xcm/xcm-sdk/xcm-sdk/#decimals){target=_blank}           |                以十进制格式返回给定余额                |

## 存款方法 {: #deposit-methods }

当构建存款所需的转移数据时，您将使用多种方法来构建底层XCM消息并进行发送：

|                                    方法                                     |                                                         描述                                                          |
|:---------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------:|
|    [`deposit()`](/builders/xcm/xcm-sdk/xcm-sdk/#deposit){target=_blank}     |                                     发起一笔存款，以将资产从其他链转移至Moonbeam                                      |
|       [`from()`](/builders/xcm/xcm-sdk/xcm-sdk/#from){target=_blank}        |                       设置存款的来源链。此函数从`deposit()`函数返回。**必须先调用`deposit()`**                        |
|    [`get()`](/builders/xcm/xcm-sdk/xcm-sdk/#get-deposit){target=_blank}     |        在Moonbeam上设置账户以存入资金以及 发送存款的来源账户。此函数从`from()`函数返回。**必须先调用`from()`**        |
|   [`send()`](/builders/xcm/xcm-sdk/xcm-sdk/#send-deposit){target=_blank}    |                      发送给定数量的存款转移数据。此函数从`get()`函数返回。**必须先调用`get()`**                       |
| [`getFee()`](/builders/xcm/xcm-sdk/xcm-sdk/#get-fee-deposit){target=_blank} | 返回转移给定数量的预估费用，该费用将以`deposit()`函数中指定的资产支付。<br> 此函数从`get()`函数返回。**必须先调用`get()`** |

## 提现方法 {: #withdraw-methods }

当构建提现所需的转移数据时，您将使用多种方法来构建底层XCM消息并进行发送：

|                                     方法                                     |                                                          描述                                                          |
|:----------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------:|
|    [`withdraw()`](/builders/xcm/xcm-sdk/xcm-sdk/#withdraw){target=_blank}    |                                      发起一笔提现，以将资产从Moonbeam转移至其他链                                      |
|          [`to()`](/builders/xcm/xcm-sdk/xcm-sdk/#to){target=_blank}          |                                此函数从`withdraw()`函数返回。**必须先调用`withdraw()`**                                |
|    [`get()`](/builders/xcm/xcm-sdk/xcm-sdk/#get-withdraw){target=_blank}     |                     在目标链上设置账户以发送提现资金。此函数从`to()`函数返回。**必须先调用`to()`**                     |
|   [`send()`](/builders/xcm/xcm-sdk/xcm-sdk/#send-withdraw){target=_blank}    |                        发送给定数量的提现转移数据。此函数返回`get()`函数。**必须先调用`get()`**                        |
| [`getFee()`](/builders/xcm/xcm-sdk/xcm-sdk/#get-fee-withdraw){target=_blank} | 返回转移给定数量的预估费用，该费用将以`withdraw()`函数中指定的资产支付。<br> 此函数从`get()`函数返回。**必须先调用`get()`** |
