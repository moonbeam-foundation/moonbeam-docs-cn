---
title: 如何使用Python Substrate Interface
description: 学习如何在Moonbeam网络上使用Python Substrate Interface库查询链上数据、发送交易等。
---

# Python Substrate Interface

![Intro diagram](/images/builders/build/substrate-api/py-substrate-interface/py-substrate-interface-banner.png)

## 概览 {: #introduction }

[Python Substrate Interface](https://github.com/polkascan/py-substrate-interface){target=_blank}库允许应用程序开发者查询Moonbeam节点并使用原生Python接口与节点的波卡或Substrate功能交互。您将在本文中找到可用功能的概述和一些常用代码示例以快速使用Python Substrate Interface与Moonbeam网络交互。

## 查看先决条件 {: #checking-prerequisites }

在开始操作之前，您将需要准备以下内容：

 - 拥有资金的账户。以Moonbase Alpha而言，您可以从[Mission Control](/builders/get-started/networks/moonbase/#get-tokens/){target=_blank}获取用于测试的DEV Token
 - 
 --8<-- 'text/common/endpoint-examples.md'
 - 安装[`pip`](https://pypi.org/project/pip/){target=_blank}

!!! note 注意事项
    --8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

### 安装Python Substrate Interface {: #installing-python-substrate-interface }

您可以通过`pip`为您的项目安装Python Substrate Interface库。在您的项目目录中运行以下命令：

```
pip install substrate-interface
```

## 创建一个API提供商实例 {: #creating-an-API-provider-instance }

与ETH API库相似，您必须先将Python Substrate Interface API的API实例进行实例化。使用您想要交互的Moonbeam网络的websocket端点创建`WsProvider`。

--8<-- 'text/common/endpoint-examples.md'

=== "Moonbeam"

    ```python
    # Imports
    from substrateinterface import SubstrateInterface
    
    # Construct the API provider
    ws_provider = SubstrateInterface(
        url="{{ networks.moonbeam.wss_url }}",
    )   
    ```

=== "Moonriver"

    ```python
    # Imports
    from substrateinterface import SubstrateInterface
    
    # Construct the API provider
    ws_provider = SubstrateInterface(
        url="{{ networks.moonriver.wss_url }}",
    )   
    ```

=== "Moonbase Alpha"

    ```python
    # Imports
    from substrateinterface import SubstrateInterface
    
    # Construct the API provider
    ws_provider = SubstrateInterface(
        url="{{ networks.moonbase.wss_url }}",
    )   
    ```

=== "Moonbeam Dev Node"

    ```python
    # Import
    from substrateinterface import SubstrateInterface
    
    # Construct the API provider
    ws_provider = SubstrateInterface(
        url="{{ networks.development.wss_url }}",
    )   
    ```

## 查询信息 {: #querying-for-information }

在这一部分，您将学习如何使用Python Substrate Interface库查询Moonbeam网络的链上信息。

### 访问Runtime常量 {: #accessing-runtime-constants }

元数据中提供了所有的runtime常量，如`BlockWeights`、`DefaultBlocksPerRound`和`ExistentialDeposit`。您可以使用[`get_metadata_constants`](https://polkascan.github.io/py-substrate-interface/#substrateinterface.SubstrateInterface.get_metadata_constants){target=_blank}函数查看Moonbeam网络中元数据的可用runtime常数列表。

元数据中的可用runtime常量可以通过[`get_constant`](https://polkascan.github.io/py-substrate-interface/#substrateinterface.SubstrateInterface.get_constant){target=_blank}函数查询。

```python
# Imports
from substrateinterface import SubstrateInterface

# Construct the API provider
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
)   

# List of available runtime constants in the metadata
constant_list = ws_provider.get_metadata_constants()
print(constant_list)

# Retrieve the Existential Deposit constant on Moonbeam, which is 0
constant = ws_provider.get_constant("Balances", "ExistentialDeposit")
print(constant.value)

```
### 检索区块和Extrinsics {: #retrieving-blocks-and-extrinsics }

您可以使用Python Substrate Interface API检索Moonbeam网络的基本信息，如区块和extrinsics。

您可以使用[`get_block`](https://polkascan.github.io/py-substrate-interface/#substrateinterface.SubstrateInterface.get_block){target=_blank}函数检索区块。您也可以访问区块中的extrinsics和数据字段，这是一个Python字典。

您可以使用[`get_block_header`](https://polkascan.github.io/py-substrate-interface/#substrateinterface.SubstrateInterface.get_block_header){target=_blank}函数检索区块头。

```python
# Imports
from substrateinterface import SubstrateInterface

# Construct the API provider
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
)   

# Retrieve the latest block
block = ws_provider.get_block()

# Retrieve the latest finalized block
block = ws_provider.get_block_header(finalized_only = True)

# Retrieve a block given its Substrate block hash
block_hash = "0xa499d4ebccdabe31218d232460c0f8b91bd08f72aca25f9b25b04b6dfb7a2acb"
block = ws_provider.get_block(block_hash=block_hash)

# Iterate through the extrinsics inside the block
for extrinsic in block['extrinsics']:
    if 'address' in extrinsic:
        signed_by_address = extrinsic['address'].value
    else:
        signed_by_address = None
    print('\nPallet: {}\nCall: {}\nSigned by: {}'.format(
        extrinsic["call"]["call_module"].name,
        extrinsic["call"]["call_function"].name,
        signed_by_address
    ))
```

!!! 注意事项
    上述代码示例中所使用的区块哈希是Substrate区块哈希。假设您在Python Substrate Interface中使用的标准方法为原语的Substrate版本，如区块或交易哈希（tx hash）。

### 订阅新的区块头 {: #subscribing-to-new-block-headers }

您还可以修改上述示例以使用基于订阅的模型来监听新的区块头。

```python
# Imports
from substrateinterface import SubstrateInterface

# Construct the API provider
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
) 

def subscription_handler(obj, update_nr, subscription_id):

    print(f"New block #{obj['header']['number']}")

    if update_nr > 10:
        return {'message': 'Subscription will cancel when a value is returned', 'updates_processed': update_nr}


result = ws_provider.subscribe_block_headers(subscription_handler)
```

### 查询存储信息 {: #querying-for-storage-information }

您可以使用[`get_metadata_storage_functions`](https://polkascan.github.io/py-substrate-interface/#substrateinterface.SubstrateInterface.get_metadata_storage_functions){target=_blank}查看Moonbeam网络中元数据的可用存储函数列表。

通过[`query`](https://polkascan.github.io/py-substrate-interface/#substrateinterface.SubstrateInterface.query){target=_blank}函数可以查询通过存储函数在元数据中提供的链状态。

Substrate系统模块，如`System`、`Timestamp`和`Balances`，可以查询提供账户和余额等基本信息。因为可用存储函数是从元数据中动态读取，所以您还可以查询Moonbeam自定义模块的存储信息，如`ParachainStaking`和`Democracy`，以获取指定Moonbeam网络的状态信息。

```python
# Imports
from substrateinterface import SubstrateInterface

# Construct the API provider
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
) 

# List of available storage functions in the metadata
method_list = ws_provider.get_metadata_storage_functions()
print(method_list)

# Query basic account information
account_info = ws_provider.query(
    module='System',
    storage_function='Account',
    params=['0x578002f699722394afc52169069a1FfC98DA36f1']
)
# Log the account nonce
print(account_info.value['nonce'])
# Log the account free balance
print(account_info.value['data']['free'])

# Query candidate pool information from Moonbeam's Parachain Staking module
candidate_pool_info = ws_provider.query(
    module='ParachainStaking',
    storage_function='CandidatePool',
    params=[]
)
print(candidate_pool_info)
```

## 签署和交易 {: #signing-and-transactions }

### 创建密钥对 {: #creating-a-keypair }

Python Substrate Interface中的密钥对是用于任何数据的签署，包括转账、消息或合约交互。

您可以从短格式私钥或助记词创建密钥对实例。以Moonbeam网络而言，您还需要将`KeypairType`指定为`KeypairType.ECDSA`。

```python
# Imports
from substrateinterface import Keypair, KeypairType

# Define the shortform private key
privatekey = bytes.fromhex("enter-shortform-private-key-without-0x-prefix")

# Define the account mnenomic
mnemonic = "enter-account-mnemonic"

# Generate the keypair from shortform private key
keypair = Keypair.create_from_private_key(privatekey, crypto_type=KeypairType.ECDSA)

# Generate the keypair from mnemonic
keypair = Keypair.create_from_mnemonic(mnemonic, crypto_type=KeypairType.ECDSA)
```

### 发起和发送交易 {: #forming-and-sending-a-transaction }

[`compose_call`](https://polkascan.github.io/py-substrate-interface/#substrateinterface.SubstrateInterface.compose_call){target=_blank}函数可以用于组成调用负载，以作为未签署的extrinsic或提案使用。

通过[`create_signed_extrinsic`](https://polkascan.github.io/py-substrate-interface/#substrateinterface.SubstrateInterface.create_signed_extrinsic){target=_blank}函数使用密钥对签署负载。

使用[`submit_extrinsic`](https://polkascan.github.io/py-substrate-interface/#substrateinterface.SubstrateInterface.submit_extrinsic){target=_blank}函数提交签署的extrinsic。

此函数也将返回`ExtrinsicReceipt`，其中包含extrinsic的链上执行信息。如果您需要检查接收方信息，您可以在提交extrinsic时将`wait_for_inclusion`设置为`True`，等待extrinsic成功包含在区块中。

以下示例代码将显示发送交易的一个完整示例。

```python

# Imports
from substrateinterface import SubstrateInterface, Keypair, KeypairType
from substrateinterface.exceptions import SubstrateRequestException

# Construct the API provider
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
) 

# Define the shortform private key of the sending account
privatekey = bytes.fromhex("enter-shortform-private-key-without-0x-prefix")

# Generate the keypair
keypair = Keypair.create_from_private_key(privatekey, crypto_type=KeypairType.ECDSA)

# Form a transaction call
call = ws_provider.compose_call(
    call_module='Balances',
    call_function='transfer',
    call_params={
        'dest': '0x44236223aB4291b93EEd10E4B511B37a398DEE55',
        'value': 1 * 10**18
     }
)

# Form a signed extrinsic
extrinsic = ws_provider.create_signed_extrinsic(call=call, keypair=keypair)

# Submit the extrinsic
try:
    receipt = ws_provider.submit_extrinsic(extrinsic, wait_for_inclusion=True)
    print("Extrinsic '{}' sent and included in block '{}'".format(receipt.extrinsic_hash, receipt.block_hash)) 
except SubstrateRequestException as e:
    print("Failed to send: {}".format(e))

```

### 离线签署 {: #offline-signing } 

您可以通过[`sign`](https://polkascan.github.io/py-substrate-interface/#substrateinterface.Keypair.sign){target=_blank}函数使用密钥对签署交易负载或任何数据。这方式可用于离线签署交易。

1. 首先，在线上设备生成签名负载：

    ```python
    # Imports
    from substrateinterface import SubstrateInterface
    
    # Construct the API provider
    ws_provider = SubstrateInterface(
        url="{{ networks.moonbase.wss_url }}",
    ) 
      
    # Construct a transaction call
    call = ws_provider.compose_call(
        call_module='Balances',
        call_function='transfer',
        call_params={
            'dest': '0x44236223aB4291b93EEd10E4B511B37a398DEE55',
            'value': 1 * 10**18
        }
    )
    
    # Generate the signature payload
    signature_payload = ws_provider.generate_signature_payload(call=call)
    ```
    
2. 在离线设备使用发送账户的私钥创建一个密钥对，并签署签名负载：

    ```python
    # Imports
    from substrateinterface import Keypair, KeypairType
    
    # Define the signature payload from the offline machine
    signature_payload = "signature payload from offline machine"
    
    # Define the shortform private key of the sender account
    privatekey = bytes.fromhex("enter-shortform-private-key-without-0x-prefix")
    
    # Generate the keypair from shortform private key
    keypair = Keypair.create_from_private_key(privatekey, crypto_type=KeypairType.ECDSA)
    
    # Sign the signature_payload 
    signature = keypair.sign(signature_payload)
    ```
    
3. 在线上设备使用发送账户的公钥创建一个密钥对，并使用离线设备生成的签名提交extrinsic：

    ```python
    
    # Imports
    from substrateinterface import SubstrateInterface, Keypair, KeypairType
    
    # Construct the API provider
    ws_provider = SubstrateInterface(
        url="{{ networks.moonbase.wss_url }}",
    ) 
    
    # Define the signature from the offline machine
    signature = "generated signature from offline machine"
    
    # Construct a keypair with the Ethereum style wallet address of the sending account
    keypair = Keypair(public_key="enter-sender-wallet-address-without-0x", crypto_type=KeypairType.ECDSA)
    
    # Construct the same transaction call that was signed
    call = ws_provider.compose_call(
        call_module='Balances',
        call_function='transfer',
        call_params={
            'dest': '0x44236223aB4291b93EEd10E4B511B37a398DEE55',
            'value': 1 * 10**18
        }
    )
    
    # Construct the signed extrinsic with the generated signature
    extrinsic = substrate.create_signed_extrinsic(
        call=call,
        keypair=keypair,
        signature=signature
    )
    
    # Submit the signed extrinsic
    result = substrate.submit_extrinsic(
        extrinsic=extrinsic
    )
    
    # Print the execution result
    print(result.extrinsic_hash)
    ```

## 自定义RPC请求 {: #custom-rpc-requests }

您也可以使用[`rpc_request`](https://polkascan.github.io/py-substrate-interface/#substrateinterface.SubstrateInterface.rpc_request){target=_blank}函数创建自定义RPC请求。

这对于与Moonbeam的[ETH JSON RPC](/builders/get-started/eth-compare/rpc-support/){target=_blank}端点或Moonbeam的[自定义RPC](/builders/build/moonbeam-custom-api/){target=_blank}端点交互特别有效。

关于如何通过Python Substrate Interface使用自定义RPC调用以检查给定交易哈希的最终性，请参考[共识和确定性页面](/builders/get-started/eth-compare/consensus-finality/#checking-tx-finality-with-substrate-libraries)的示例。

--8<-- 'text/disclaimers/third-party-content.md'
