---
title: 通过API验证智能合约
description: 学习如何使用现有的基于API的验证函数在Moonbeam网络上验证智能合约
---

# 基于API的合约验证

## 概览 {: #introduction }

验证智能合约能够大幅提升他们的透明性和安全性，在Moonbeam网络上部署的智能合约能够使用基于API的工具进行验证，包含Moonscan API和Sourcify。

此页面将会列出使用基于API的工具在Moonbeam网络上验证智能合约、查询验证状态以及元数据的步骤。

## 使用Moonscan API {: #using-moonscan-api }

[Moonscan](https://moonscan.io/){target=_blank}为Etherscan的官方分叉，用于浏览或是查询链上数据，因此成为一个适合与Moonbeam网络上数据交互并分析的开发者工具。

类似于[Etherscan API](https://docs.etherscan.io/){target=_blank}，Moonscan有一整套的REST API端点，可用于验证智能合约、获取验证合约的ABI和源代码以及与Moonbeam网络上受到验证的合约交互。

### 生成Moonscan API私钥 {: #generating-a-moonscan-api-key }

在使用Moonscan API之前，您需要生成一个Moonscan API私钥。请跟随Etherscan嵌入页面中[生成私钥的部分教程](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=blank}，因其API私钥能够同时用于这两者。

### Moonscan公共API URL {: #moonscan-public-api-url }

The Moonscan API URL for Moonbeam networks is as follows:
Moonbeam相关网络的Moonscan API URL如下：

=== "Moonbeam"

    ```text
    https://api-moonbeam.moonscan.io/api
    ```

=== "Moonriver"

    ```text
    https://api-moonriver.moonscan.io/api
    ```

=== "Moonbase Alpha"

    ```text
    https://api-moonbase.moonscan.io/api
    ```

### 验证源代码 {: #verify-source-code }

要使用Moonscan API验证合约源代码，您需要拟定一个包含所有相关合约创建信息的POST请求，并将其请求传送至Moonscan的REST API。以下为使用JavaScript和[Axios](https://axios-http.com/docs/intro){target=_blank}（HTTP用户端）的范例代码：

=== "Moonbeam"
    ```javascript
    // Submit Source Code for Verification
    const response = await axios.post("https://api-moonbeam.moonscan.io/api", {
        apikey: "INSERT-API-KEY-HERE",
        module: "contract",
        action: "verifysourcecode",
        contractAddress: "INSERT-CONTRACT-ADDRESS-HERE",
        sourceCode: "INSERT-SOURCE-CODE-HERE", // flattened if necessary
        codeformat: "solidity-single-file" // or you can use "solidity-standard-json-input"
        contractname: "INSERT-CONTRACT-NAME-HERE", // if codeformat = solidity-standard-json-input, then enter contractname as ex: erc20.sol:erc20
        compilerversion: "INSERT-COMPILER-VERSION-HERE" // see https://etherscan.io/solcversions for list of support versions
        optimizationUsed: 0 // 0 = no optimization, 1 = optimization was used (applicable when codeformat=solidity-single-file)
        runs: 200 // set to 200 as default unless otherwise (applicable when codeformat=solidity-single-file) 
        constructorArguements: "INSERT-CONSTRUCTOR-ARGUMENTS-HERE" // if applicable
        evmversion: "INSERT-EVM-VERSION-HERE", // options: homestead, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul (applicable when codeformat=solidity-single-file)
        licenseType: 1, // valid codes 1-14 where 1=No License ... 14=Business Source License 1.1, see https://etherscan.io/contract-license-types
        libraryname1: "INSERT-LIBRARY-NAME-HERE" // if applicable, enter the name of the first library used, i.e. SafeMath (up to 10 libraries can be used)
        libraryaddress1: "INSERT-LIBRARY-ADDRESS-HERE" // if applicable, enter the address of the first library used
        libraryname2: "INSERT-LIBRARY-NAME-HERE", // if applicable, enter the name of the second library used
        libraryaddress2: "INSERT-LIBRARY-ADDRESS-HERE", // if applicable, enter the address of the second library used
        // ...
    }, headers: { "Content-Type": "application/x-www-form-urlencoded" })

    if (response.data.status == "1") {
        // 1 = submission success, use the guid returned (response.data.response.data) to check the status of your submission
        // average time of processing is 30-60 seconds
        console.log(response.data.status + "; " + response.data.message + "; " + response.data.result)
        // response.data.response.data is the GUID receipt for the submission, you can use this guid for checking the verification status
    } else {
        // 0 = error
        console.log(response.data.status + "; " + response.data.message + "; " + response.data.result)
    }
    ```

=== "Moonriver"
    ```javascript
    // Submit Source Code for Verification
    const response = await axios.post("https://api-moonriver.moonscan.io/api", {
        apikey: "INSERT-API-KEY-HERE",
        module: "contract",
        action: "verifysourcecode",
        contractAddress: "INSERT-CONTRACT-ADDRESS-HERE",
        sourceCode: "INSERT-SOURCE-CODE-HERE", // flattened if necessary
        codeformat: "solidity-single-file" // or you can use "solidity-standard-json-input"
        contractname: "INSERT-CONTRACT-NAME-HERE", // if codeformat = solidity-standard-json-input, then enter contractname as ex: erc20.sol:erc20
        compilerversion: "INSERT-COMPILER-VERSION-HERE" // see https://etherscan.io/solcversions for list of support versions
        optimizationUsed: 0 // 0 = no optimization, 1 = optimization was used (applicable when codeformat=solidity-single-file)
        runs: 200 // set to 200 as default unless otherwise (applicable when codeformat=solidity-single-file) 
        constructorArguements: "INSERT-CONSTRUCTOR-ARGUMENTS-HERE" // if applicable
        evmversion: "INSERT-EVM-VERSION-HERE", // options: homestead, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul (applicable when codeformat=solidity-single-file)
        licenseType: 1, // valid codes 1-14 where 1=No License ... 14=Business Source License 1.1, see https://etherscan.io/contract-license-types
        libraryname1: "INSERT-LIBRARY-NAME-HERE" // if applicable, enter the name of the first library used, i.e. SafeMath (up to 10 libraries can be used)
        libraryaddress1: "INSERT-LIBRARY-ADDRESS-HERE" // if applicable, enter the address of the first library used
        libraryname2: "INSERT-LIBRARY-NAME-HERE", // if applicable, enter the name of the second library used
        libraryaddress2: "INSERT-LIBRARY-ADDRESS-HERE", // if applicable, enter the address of the second library used
        // ...
    }, headers: { "Content-Type": "application/x-www-form-urlencoded" })

    if (response.data.status == "1") {
        // 1 = submission success, use the guid returned (response.data.response.data) to check the status of your submission
        // average time of processing is 30-60 seconds
        console.log(response.data.status + "; " + response.data.message + "; " + response.data.result)
        // response.data.response.data is the GUID receipt for the submission, you can use this guid for checking the verification status
    } else {
        // 0 = error
        console.log(response.data.status + "; " + response.data.message + "; " + response.data.result)
    }
    ```

=== "Moonbase"
    ```javascript
    // Submit Source Code for Verification
    const response = await axios.post("https://api-moonbase.moonscan.io/api", {
        apikey: "INSERT-API-KEY-HERE",
        module: "contract",
        action: "verifysourcecode",
        contractAddress: "INSERT-CONTRACT-ADDRESS-HERE",
        sourceCode: "INSERT-SOURCE-CODE-HERE", // flattened if necessary
        codeformat: "solidity-single-file" // or you can use "solidity-standard-json-input"
        contractname: "INSERT-CONTRACT-NAME-HERE", // if codeformat = solidity-standard-json-input, then enter contractname as ex: erc20.sol:erc20
        compilerversion: "INSERT-COMPILER-VERSION-HERE" // see https://etherscan.io/solcversions for list of support versions
        optimizationUsed: 0 // 0 = no optimization, 1 = optimization was used (applicable when codeformat=solidity-single-file)
        runs: 200 // set to 200 as default unless otherwise (applicable when codeformat=solidity-single-file) 
        constructorArguements: "INSERT-CONSTRUCTOR-ARGUMENTS-HERE" // if applicable
        evmversion: "INSERT-EVM-VERSION-HERE", // options: homestead, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul (applicable when codeformat=solidity-single-file)
        licenseType: 1, // valid codes 1-14 where 1=No License ... 14=Business Source License 1.1, see https://etherscan.io/contract-license-types
        libraryname1: "INSERT-LIBRARY-NAME-HERE" // if applicable, enter the name of the first library used, i.e. SafeMath (up to 10 libraries can be used)
        libraryaddress1: "INSERT-LIBRARY-ADDRESS-HERE" // if applicable, enter the address of the first library used
        libraryname2: "INSERT-LIBRARY-NAME-HERE", // if applicable, enter the name of the second library used
        libraryaddress2: "INSERT-LIBRARY-ADDRESS-HERE", // if applicable, enter the address of the second library used
        // ...
    }, headers: { "Content-Type": "application/x-www-form-urlencoded" })

    if (response.data.status == "1") {
        // 1 = submission success, use the guid returned (response.data.response.data) to check the status of your submission
        // average time of processing is 30-60 seconds
        console.log(response.data.status + "; " + response.data.message + "; " + response.data.result)
        // response.data.response.data is the GUID receipt for the submission, you can use this guid for checking the verification status
    } else {
        // 0 = error
        console.log(response.data.status + "; " + response.data.message + "; " + response.data.result)
    }
    ```

在成功提交后，将会获得一个GUID作为结果。此GUID将会用于查看提交状态。

=== "Moonbeam"
    ```bash
    curl https://api-moonbeam.moonscan.io/api
            ?module=contract
            &action=checkverifystatus
            &guid=INSERT-GUID-FROM-RESPONSE-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

=== "Moonriver"
    ```bash
    curl https://api-moonriver.moonscan.io/api
            ?module=contract
            &action=checkverifystatus
            &guid=INSERT-GUID-FROM-RESPONSE-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

=== "Moonbase Alpha"
    ```bash
    curl https://api-moonbase.moonscan.io/api
            ?module=contract
            &action=checkverifystatus
            &guid=INSERT-GUID-FROM-RESPONSE-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

### 检索验证合约的ABI {: #retrieve-contract-abi-for-verified-contracts }

当您合约已在Moonscan上获得验证，您可以使用以下端点检索合约ABI：

=== "Moonbeam"
    ```bash
    curl https://api-moonbeam.moonscan.io/api
            ?module=contract
            &action=getabi
            &address=INSERT-CONTRACT-ADDRESS-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

=== "Moonriver"
    ```bash
    curl https://api-moonriver.moonscan.io/api
            ?module=contract
            &action=getabi
            &address=INSERT-CONTRACT-ADDRESS-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

=== "Moonbase Alpha"
    ```bash
    curl https://api-moonbase.moonscan.io/api
            ?module=contract
            &action=getabi
            &address=INSERT-CONTRACT-ADDRESS-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

### 检索验证合约的源代码 {: #retrieve-contract-source-code-for-verified-contracts }

当您的合约已在Moonscan上获得验证，您可以使用以下端点检索合约源代码：

=== "Moonbeam"
    ```bash
    curl https://api-moonbeam.moonscan.io/api
            ?module=contract
            &action=getsourcecode
            &address=INSERT-CONTRACT-ADDRESS-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

=== "Moonriver"
    ```bash
    curl https://api-moonriver.moonscan.io/api
            ?module=contract
            &action=getsourcecode
            &address=INSERT-CONTRACT-ADDRESS-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

=== "Moonbase Alpha"
    ```bash
    curl https://api-moonbase.moonscan.io/api
            ?module=contract
            &action=getsourcecode
            &address=INSERT-CONTRACT-ADDRESS-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

## 使用Sourcify API {: #using-sourcify-api }

[Sourcify](https://sourcify.dev/){target=_blank}是一个多链去中心化的自动合约验证服务，并维护公共合约元数据库。Sourcify同样提供公共服务器API供开发者进行验证、查看合约是否获得验证以及用于查看元数据文件的API库。

### Sourcify公共服务器URL {: #sourcify-public-server-url }

Sourcify API端点可通过以下公共服务器访问：

=== "Production"

    ```bash
    https://sourcify.dev/server
    ```

=== "Staging"
    ```bash
    https://staging.sourcify.dev/server
    ```

### Moonbeam网络的链ID {: #moonbeam-network-chain-ids }

Sourcify使用链ID验证请求的目标网络。Moonbeam相关网络的链ID如下：

=== "Moonbeam"
    ```bash
    {{ networks.moonbeam.chain_id }}
    ```

=== "Moonriver"
    ```bash
    {{ networks.moonriver.chain_id }}
    ```

=== "Moonbase"
    ```bash
    {{ networks.moonbase.chain_id }}
    ```

### 完美匹配 vs 部分匹配 {: #full-vs-partial-match }

Sourcify支持两种验证匹配结果。

完整匹配（有时被成为完美匹配）代表当部署合约字节码的每个字节与提供的源代码文件使用元数据文件的编译设定的输出相同。

部分匹配代表在链上部署合约的字节码除了元数据哈希与元数据和源代码文件重新编译后的字节码相同。对于部分匹配的结果而言，部署合约以及提供的源代码和元数据在功能上是相同的，不同的地方为源代码注释、变量名称或是如源路径等元数据的部分。

### 验证合约 {: #verify-contract }

您可以使用POST请求在Sourcify验证合约，以下为使用JavaScript撰写的范例代码：

=== "Moonbeam"
    ```javascript
    // Submit Contract Source Code and Metadata for Verification
    const response = await axios.post("https://sourcify.dev/server/verify", {
        "address": "INSERT-CONTRACT-ADDRESS-HERE"
        "chain": {{ networks.moonbeam.chain_id }}, // chain ID of Moonbeam
        "files": {
            "metadata-1.json": "INSERT-JSON-FILE-HERE", // metadata file for contract file 1
            "metadata-2.json": "INSERT-JSON-FILE-HERE", // metadata file for contract file 2
            "file1-name.sol": "INSERT-SOL-FILE-HERE", // contract source file 1
            "file2-name.sol": "INSERT-SOL-FILE-HERE" // contract source file 2
            //...
        },
        "chosenContract": 1 // (optional) index of the contract, if the provided files contain multiple metadata files          
    })

    if (result.status == "perfect") {
        // perfect match
        console.log(result.status + ";" + result.address);
    } elseif (result.status == "partial") {
        // partial match
        console.log(result.status + ";" + result.address);
    } else {
        // non-matching
        console.log(result.status + ";" + result.address);
    }
    ```

=== "Moonriver"
    ```javascript
    // Submit Contract Source Code and Metadata for Verification
    const response = await axios.post("https://sourcify.dev/server/verify", {
        "address": "INSERT-CONTRACT-ADDRESS-HERE"
        "chain": {{ networks.moonriver.chain_id }}, // chain ID of Moonriver
        "files": {
            "metadata-1.json": "INSERT-JSON-FILE-HERE", // metadata file for contract file 1
            "metadata-2.json": "INSERT-JSON-FILE-HERE", // metadata file for contract file 2
            "file1-name.sol": "INSERT-SOL-FILE-HERE", // contract source file 1
            "file2-name.sol": "INSERT-SOL-FILE-HERE" // contract source file 2
            //...
        },
        "chosenContract": 1 // (optional) index of the contract, if the provided files contain multiple metadata files          
    })

    if (result.status == "perfect") {
        // perfect match
        console.log(result.status + ";" + result.address);
    } elseif (result.status == "partial") {
        // partial match
        console.log(result.status + ";" + result.address);
    } else {
        // non-matching
        console.log(result.status + ";" + result.address);
    }
    ```

=== "Moonbase"
    ```javascript
    // Submit Contract Source Code and Metadata for Verification
    const response = await axios.post("https://sourcify.dev/server/verify", {
        "address": "INSERT-CONTRACT-ADDRESS-HERE"
        "chain": {{ networks.moonbase.chain_id }}, // chain ID of Moonbase Alpha
        "files": {
            "metadata-1.json": "INSERT-JSON-FILE-HERE", // metadata file for contract file 1
            "metadata-2.json": "INSERT-JSON-FILE-HERE", // metadata file for contract file 2
            "file1-name.sol": "INSERT-SOL-FILE-HERE", // contract source file 1
            "file2-name.sol": "INSERT-SOL-FILE-HERE" // contract source file 2
            //...
        },
        "chosenContract": 1 // (optional) index of the contract, if the provided files contain multiple metadata files          
    })

    if (result.status == "perfect") {
        // perfect match
        console.log(result.status + ";" + result.address);
    } elseif (result.status == "partial") {
        // partial match
        console.log(result.status + ";" + result.address);
    } else {
        // non-matching
        console.log(result.status + ";" + result.address);
    }
    ```

同样的，您能够使用[Sourcify拥有的GUI](https://sourcify.dev/#/verifier){target=blank}提交合约验证。

### 通过地址和链ID查看验证状态 {: #check-verification-status-by-address-and-chain-id } 

Sourcify提供开发者端点以同时查看多个EVM链上合约的验证状态，这可以通过URL函数实现，如指定合约地址以及网络的链ID。

此端点有两种变化，其中之一为完美匹配，另外一个为部分匹配：

=== "完美匹配"

    ```bash
    curl https://sourcify.dev/server/check-by-addresses
            ?addresses={INSERT-ADDRESS-1-HERE, INSERT-ADDRESS-2-HERE, ...}
            &chainIds={INSERT-CHAIN-ID-1, INSERT-CHAIN-ID-2, ...}
    ```
    
=== "部分匹配"

    ```bash
    curl https://sourcify.dev/server/check-all-by-addresses
            ?addresses={INSERT-ADDRESS-1-HERE, INSERT-ADDRESS-2-HERE, ...}
            &chainIds={INSERT-CHAIN-ID-1, INSERT-CHAIN-ID-2, ...}
    ```

您将会获得一个JSON对象的响应，结构如下所示：

```json
[
  {
    "address": "address1",
    "status": "perfect",
    "chainIds": [
      "chainId1",
      "chaindId2"
    ]
  },
  {
    "address": "address2",
    "status": "partial",
    "chainIds": [
      "chaindId2"
    ]
  }
]
```

### 为验证合约检索源文件 {: #get-contract-source-files-for-verified-contracts }

您同样可以通过Sourcify库检索验证合约的源文件。

此终端有两种变化，其中之一为完美匹配的源文件：

=== "Moonbeam"
    ```bash
    curl https://sourcify.dev/server/files/{{ networks.moonbeam.chain_id }}/INSERT-YOUR-CONTRACT-ADDRESS-HERE
    ```
=== "Moonriver"
    ```bash
    curl https://sourcify.dev/server/files/{{ networks.moonriver.chain_id }}/INSERT-YOUR-CONTRACT-ADDRESS-HERE
    ```
=== "Moonbase"
    ```bash
    curl https://sourcify.dev/server/files/{{ networks.moonbase.chain_id }}/INSERT-YOUR-CONTRACT-ADDRESS-HERE
    ```

另外一个为完美匹配和部分匹配的源文件：

=== "Moonbeam"
    ```bash
    curl https://sourcify.dev/server/files/any/{{ networks.moonbeam.chain_id }}/INSERT-YOUR-CONTRACT-ADDRESS-HERE
    ```
=== "Moonriver"
    ```bash
    curl https://sourcify.dev/server/files/any/{{ networks.moonriver.chain_id }}/INSERT-YOUR-CONTRACT-ADDRESS-HERE
    ```
=== "Moonbase"
    ```bash
    curl https://sourcify.dev/server/files/any/{{ networks.moonbase.chain_id }}/INSERT-YOUR-CONTRACT-ADDRESS-HERE
    ```

### 在Foundry中使用Sourcify {: #using-sourcify-with-foundry }

Foundry的Forge工具内置了对Sourcify验证的支持，类似于[内置支持的Etherscan](/builders/build/eth-api/verify-contracts/etherscan-plugins#using-foundry-to-verify){target=_blank}。本指南部分中的示例将使用在[Foundry指南](/builders/build/eth-api/dev-env/foundry/){target=_blank}中创建的 `MyToken.sol` 合约。

使用Sourcify的Foundry项目必须让其编译器发出元数据文件。这可以在 `foundry.toml` 文件中配置：

```toml
[profile.default]
# Input your custom or default config options here
extra_output_files = ["metadata"]
```

如果您已经部署了示例合约，您可以使用`verify-contract`命令对其进行验证。在验证合约之前，您需要对构造函数参数进行ABI编码。要对示例合约执行此操作，您可以运行以下命令：

```bash
cast abi-encode "constructor(uint256)" 100
```

结果应该是`0x0000000000000000000000000000000000000000000000000000000000000064`。然后，您可以使用以下命令验证合约：

=== "Moonbeam"

    ```bash
    forge verify-contract --chain-id {{ networks.moonbeam.chain_id }} \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    --verifier sourcify YOUR_CONTRACT_ADDRESS src/MyToken.sol:MyToken 
    ```

=== "Moonriver"

    ```bash
    forge verify-contract --chain-id {{ networks.moonriver.chain_id }} \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    --verifier sourcify YOUR_CONTRACT_ADDRESS src/MyToken.sol:MyToken 
    ```

=== "Moonbase Alpha"

    ```bash
    forge verify-contract --chain-id {{ networks.moonbase.chain_id }} \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    --verifier sourcify YOUR_CONTRACT_ADDRESS src/MyToken.sol:MyToken 
    ```

![Foundry Verify](/images/builders/build/eth-api/verify-contracts/api-verification/api-1.png)

如果您想同时部署示例合约并进行验证，则可以使用以下命令：

=== "Moonbeam"

    ```bash
    forge create --rpc-url {{ networks.moonbeam.rpc_url }} \
    --constructor-args 100 \
    --verify --verifier sourcify \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken  
    ```

=== "Moonriver"

    ```bash
    forge create --rpc-url {{ networks.moonriver.rpc_url }} \
    --constructor-args 100 \
    --verify --verifier sourcify \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken  
    ```

=== "Moonbase Alpha"

    ```bash
    forge create --rpc-url {{ networks.moonbase.rpc_url }} \
    --constructor-args 100 \
    --verify --verifier sourcify \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken    
    ```

![Foundry Contract Deploy and Verify](/images/builders/build/eth-api/verify-contracts/api-verification/api-2.png)