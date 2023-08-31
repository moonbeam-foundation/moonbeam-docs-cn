---
title: 如何使用Ethers.rs以太坊库
description: 学习如何使用EthersRS以太坊库，通过Rust语言发送交易和部署Solidity智能合约至Moonbeam
---

# Ethers.rs Rust库

## 概览 {: #introduction } 

[Ethers.rs](https://ethers.rs){target=_blank}库提供一套工具，通过Rust编程语言与以太坊节点交互，其运作方式与[Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}相似。Moonbeam拥有类似以太坊的API，能够与以太坊式的JSON RPC调用完全兼容。因此，开发者可以利用此兼容性并使用Ethers.rs库如同与以太坊一样与Moonbeam节点交互。您可以在其[官方文档](https://docs.rs/crate/ethers/latest/){target=_blank}获取更多关于如何使用Ethers.rs的信息。

在本教程中，您将学习如何使用Ethers.rs库在Moonbase Alpha上发送交易和部署合约。本教程也同样适用于 [Moonbeam](/builders/get-started/networks/moonbeam/){target=_blank}、[Moonriver](/builders/get-started/networks/moonriver/){target=_blank}和[Moonbeam开发节点](/builders/get-started/networks/moonbeam-dev/){target=_blank}。

## 查看先决条件 {: #checking-prerequisites } 

在本教程的示例中，您将需要准备以下内容：

 - 拥有资金的账户。
    --8<-- 'text/faucet/faucet-list-item.md'
 - 
--8<-- 'text/common/endpoint-examples.md'
 - 在设备上[安装Rust](https://www.rust-lang.org/tools/install){target=_blank}
 - 在设备上[安装solc](https://docs.soliditylang.org/en/v0.8.9/installing-solidity.html)。Ethers.rs包的建议使用[solc-select](https://github.com/crytic/solc-select){target=_blank} 

!!! 注意事项
    本教程的示例中假设您拥有基于MacOS或Ubuntu 20.04的环境，且需要针对Windows系统进行相应调整。

## 创建一个Rust项目 {: #create-a-rust-project }

首先，您可以使用Cargo工具创建一个新的Rust项目：

```bash
cargo init ethers-examples && cd ethers-examples
```

在本教程中，您将需要安装Ethers.rs库等。要在Rust项目中安装，您必须编辑文档中包含的`Cargo.toml`文件并将其包含在依赖项中：

```toml
[package]
name = "ethers-examples"
version = "0.1.0"
edition = "2021"

[dependencies]
ethers = "1.0.2"
ethers-solc = "1.0.2"
tokio = { version = "1", features = ["full"] }
serde_json = "1.0.89"
serde = "1.0.149"
```

本示例使用`ethers`和`ethers-solc` crate版本`1.0.2`用于RPC交互和Solidity编译。这也包含了`tokio` crate以运行异步Rust环境，因为与RPC交互需要异步代码。最后，这也包含了`serde_json`和`serde` crates来帮助序列化/反序列化此示例的代码。

如果这是您第一次使用`solc-select`，您将需要使用以下命令来安装和配置Solidity版本：

```bash
solc-select install 0.8.17 && solc-select use 0.8.17
```

## 设置Ethers提供商和客户端 {: #setting-up-the-ethers-provider-and-client }

在整个教程中，您将编写多个函数，用于提供不同的功能，例如发送交易、部署合约，以及与部署的合约交互。在大部分这些脚本中，您将需要使用[Ethers provider](https://docs.rs/ethers-providers/latest/ethers_providers/index.html){target=_blank}或[Ethers signer client](https://docs.rs/ethers/1.0.2/ethers/middleware/struct.SignerMiddleware.html){target=_blank}与网络进行交互。

--8<-- 'text/common/endpoint-setup.md'

创建提供商和签署者有多种方式，但是最简单的方式是通过`try_from`操作：

1. 从`ethers` crate导入`Provider`和`Http`
2. 为了方便操作，添加`Client`类型，当您开始创建发送交易和部署合约的函数时，将会使用此函数
3. 在`async fn main()`上方添加`tokio`属性，用于异步执行
4. 使用`try_from`尝试从RPC端点实例化JSON RPC提供商对象
5. 使用私钥创建钱包对象（私钥将用于签署交易）。**请注意：此示例仅用于演示目的，请勿将您的私钥存储于普通的Rust文件中**
6. 通过将提供商和钱包提供到`SignerMiddleware`对象中，将其包装到客户端中

=== "Moonbeam"

    ```rust
    // 1. Import ethers crate
    use ethers::providers::{Provider, Http};
    
    // 2. Add client type
    type Client = SignerMiddleware<Provider<Http>, Wallet<k256::ecdsa::SigningKey>>;
    
    // 3. Add annotation
    #[tokio::main]
    fn main() -> Result<(), Box<dyn std::error::Error>> {
        // 4. Use try_from with RPC endpoint
        let provider = Provider::<Http>::try_from(
            "{{ networks.moonbeam.rpc_url }}"
        )?;
        // 5. Use a private key to create a wallet
        // Do not include the private key in plain text in any production code
        // This is just for demonstration purposes
        // Do not include '0x' at the start of the private key
        let wallet: LocalWallet = "YOUR PRIVATE KEY"
            .parse::<LocalWallet>()?
            .with_chain_id(Chain::Moonbeam);
    
        // 6. Wrap the provider and wallet together to create a signer client
        let client = SignerMiddleware::new(provider.clone(), wallet.clone());
        Ok(())
    }
    ```

=== "Moonriver"

    ```rust
    // 1. Import ethers crate
    use ethers::providers::{Provider, Http};
    
    // 2. Add client type
    type Client = SignerMiddleware<Provider<Http>, Wallet<k256::ecdsa::SigningKey>>;
    
    // 3. Add annotation
    #[tokio::main]
    fn main() -> Result<(), Box<dyn std::error::Error>> {
        // 4. Use try_from with RPC endpoint
        let provider = Provider::<Http>::try_from(
            "{{ networks.moonriver.rpc_url }}"
        )?;
        // 5. Use a private key to create a wallet
        // Do not include the private key in plain text in any production code
        // This is just for demonstration purposes
        // Do not include '0x' at the start of the private key
        let wallet: LocalWallet = "YOUR PRIVATE KEY"
            .parse::<LocalWallet>()?
            .with_chain_id(Chain::Moonriver);
    
        // 6. Wrap the provider and wallet together to create a signer client
        let client = SignerMiddleware::new(provider.clone(), wallet.clone());
        Ok(())
    }
    ```

=== "Moonbase Alpha"

    ```rust
    // 1. Import ethers crate
    use ethers::providers::{Provider, Http};
    
    // 2. Add client type
    type Client = SignerMiddleware<Provider<Http>, Wallet<k256::ecdsa::SigningKey>>;
    
    // 3. Add annotation
    #[tokio::main]
    fn main() -> Result<(), Box<dyn std::error::Error>> {
        // 4. Use try_from with RPC endpoint
        let provider = Provider::<Http>::try_from(
            "{{ networks.moonbase.rpc_url }}"
        )?;
        // 5. Use a private key to create a wallet
        // Do not include the private key in plain text in any production code
        // This is just for demonstration purposes
        // Do not include '0x' at the start of the private key
        let wallet: LocalWallet = "YOUR PRIVATE KEY"
            .parse::<LocalWallet>()?
            .with_chain_id(Chain::Moonbase);
    
        // 6. Wrap the provider and wallet together to create a signer client
        let client = SignerMiddleware::new(provider.clone(), wallet.clone());
        Ok(())
    }
    ```

=== "Moonbeam开发节点"

    ```rust
    // 1. Import ethers crate
    use ethers::providers::{Provider, Http};
    
    // 2. Add client type
    type Client = SignerMiddleware<Provider<Http>, Wallet<k256::ecdsa::SigningKey>>;
    
    // 3. Add annotation
    #[tokio::main]
    fn main() -> Result<(), Box<dyn std::error::Error>> {
        // 4. Use try_from with RPC endpoint
        let provider = Provider::<Http>::try_from(
            "{{ networks.development.rpc_url }}"
        )?;
        // 5. Use a private key to create a wallet
        // Do not include the private key in plain text in any production code
        // This is just for demonstration purposes
        // Do not include '0x' at the start of the private key
        let wallet: LocalWallet = "YOUR PRIVATE KEY"
            .parse::<LocalWallet>()?
            .with_chain_id(Chain::MoonbeamDev);
    
        // 6. Wrap the provider and wallet together to create a signer client
        let client = SignerMiddleware::new(provider.clone(), wallet.clone());
        Ok(())
    }
    ```

## 发送交易 {: #send-a-transaction }

在这一部分中，您将创建几个函数，这将包含在同一个`main.rs`文件中，以避免从实现模块带来的额外复杂性。第一个函数将在尝试发送交易前检查账户余额。第二个函数将实际发送交易。要运行这些函数，您需要编辑`main`函数并运行`main.rs`脚本。

您应该根据[上述部分](#setting-up-the-ethers-provider-and-client)所描述的方法在`main.rs`中设置了提供商和客户端。要发送交易，您将需要添加几行代码：

1. 在您的导入中添加`use ethers::{utils, prelude::*};`，这将为您提供访问实用程序函数的权限，并且prelude导入所有必要的数据类型和特征
2. 因为您将从一个地址发送交易至另一个地址，您可以在`main`函数中指定发送和接收地址。**请注意：`address_from`值应该对应于`main`函数中所使用的私钥**

```rust
// ...
// 1. Add to imports
use ethers::{utils, prelude::*};

// ...

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...

    // 2. Add from and to address
    let address_from = "YOUR FROM ADDRESS".parse::<Address>()?
    let address_to = "YOUR TO ADDRESS".parse::<Address>()?
}
```

### 查看余额函数 {: #check-balances-function }

接下来，您将通过执行以下步骤创建函数以获取发送和接收账户的余额：

1. 创建一个名为`print_balances`的新异步函数，这将提供商对象的引用以及发送和接收地址作为输入
2. 使用`provider`对象的`get_balance`函数以获取交易发送和接收地址的余额
3. 输出发送和接收地址的结果余额
4. 在`main`函数中调用`print_balances`函数

```rust
// ...

// 1. Create an asynchronous function that takes a provider reference and from and to address as input
async fn print_balances(provider: &Provider<Http>, address_from: Address, address_to: Address) -> Result<(), Box<dyn std::error::Error>> {
    // 2. Use the get_balance function
    let balance_from = provider.get_balance(address_from, None).await?;
    let balance_to = provider.get_balance(address_to, None).await?;

    // 3. Print the resultant balance
    println!("{} has {}", address_from, balance_from);
    println!("{} has {}", address_to, balance_to);

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...

    // 4. Call print_balances function in main
    print_balances(&provider).await?;

    Ok(())
}
```

### 发送交易脚本 {: #send-transaction-script }

在本示例中，您将从源地址（即您持有私钥的地址）发送1 DEV至另一个地址。

1. 创建一个名为`send_transaction`的新异步函数，这将客户端对象的引用以及发送和接收地址作为输入
2. 创建交易对象，并包含`to`、`value`和`from`。当编写`value`输入时，使用`ethers::utils::parse_ether`函数
3. 使用`client`对象来发送交易
4. 交易确认后输出交易
5. 在`main`函数中调用`send_transaction`函数

```rust
// ...

// 1. Define an asynchronous function that takes a client provider and the from and to addresses as input
async fn send_transaction(client: &Client, address_from: Address, address_to: Address) -> Result<(), Box<dyn std::error::Error>> {
    println!(
        "Beginning transfer of 1 native currency from {} to {}.",
        address_from, address_to
    );

    // 2. Create a TransactionRequest object
    let tx = TransactionRequest::new()
        .to(address_to)
        .value(U256::from(utils::parse_ether(1)?))
        .from(address_from);
        
    // 3. Send the transaction with the client
    let tx = client.send_transaction(tx, None).await?.await?;

    // 4. Print out the result
    println!("Transaction Receipt: {}", serde_json::to_string(&tx)?);

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...

    // 5. Call send_transaction function in main
    send_transaction(&client, address_from, address_to).await?;

    Ok(())
}
```

您可以[在GitHub上查看完整的脚本](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-docs/master/.snippets/code/ethers-rust/send-tx/main.rs){target=_blank}。

要运行发送交易并在交易发送后检查余额的脚本，您可以运行以下命令：

```bash
cargo run
```

如果交易成功后，您将在终端看到交易详情以及地址余额。

![Terminal logs from sending a transaction](/images/builders/build/eth-api/libraries/ethersrs/ethersrs-1.png)

## 部署合约 {: #deploy-a-contract }

--8<-- 'text/libraries/contract.md'

在这一部分中，您将创建几个函数，这将包含在`main.rs`文件中，以避免从实现模块带来的额外复杂性。第一个函数将编译和部署合约。剩下的函数将用于与部署的合约交互。

您应该根据[设置Ethers提供商和客户端部分](#setting-up-the-ethers-provider-and-client)所描述的方法在`main.rs`中设置了提供商和客户端。

在开始部署合约之前，您将需要添加一些导入至`main.rs`文件中：

```rust
use ethers_solc::Solc;
use ethers::{prelude::*};
use std::{path::Path, sync::Arc};
```

`ethers_solc`导入将用于编译智能合约。Ethers的`prelude`导入一些必要数据类型和特征。最后，`std`导入将使您能够存储智能合约并将客户端包装成`Arc`类型以实现线程安全。

### 编译和部署合约脚本 {: #compile-and-deploy-contract-script }

此示例函数将编译和部署您在上述部分中创建的`Incrementer.sol`智能合约。`Incrementer.sol`智能合约需要在根目录中。在`main.rs`文件中，请执行以下步骤：

1. 创建名为`compile_deploy_contract`的新异步函数，这将客户端对象的引用作为输入，并返回`H160`格式的地址
2. 定义名为`source`的变量作为托管所有需要编译的智能合约的目录路径，该目录为根目录
3. 在根目录中使用`Solc` crate编译所有的智能合约
4. 从编译的结果中获取ABI和字节码，搜索`Incrementer.sol`合约
5. 使用ABI、字节码和客户端从智能合约创建一个合约工厂。客户端必须包装成`Arc`类型以实现线程安全
6. 使用工厂部署。在本示例中，在构造函数处以`5`作为初始值
7. 部署后输出地址
8. 返回地址
9. 在`main`函数中调用`compile_deploy_contract`函数

```rust
// ...

// 1. Define an asynchronous function that takes a client provider as input and returns H160
async fn compile_deploy_contract(client: &Client) -> Result<H160, Box<dyn std::error::Error>> {
    // 2. Define a path as the directory that hosts the smart contracts in the project
    let source = Path::new(&env!("CARGO_MANIFEST_DIR"));

    // 3. Compile all of the smart contracts
    let compiled = Solc::default()
        .compile_source(source)
        .expect("Could not compile contracts");

    // 4. Get ABI & Bytecode for Incrementer.sol
    let (abi, bytecode, _runtime_bytecode) = compiled
        .find("Incrementer")
        .expect("could not find contract")
        .into_parts_or_default();

    // 5. Create a contract factory which will be used to deploy instances of the contract
    let factory = ContractFactory::new(abi, bytecode, Arc::new(client.clone()));

    // 6. Deploy
    let contract = factory.deploy(U256::from(5))?.send().await?;
    
    // 7. Print out the address
    let addr = contract.address();
    println!("Incrementer.sol has been deployed to {:?}", addr);

    // 8. Return the address
    Ok(addr)
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...

    // 9. Call compile_deploy_contract function in main
    let addr = compile_deploy_contract(&client).await?;

    Ok(())
}
```

### 读取合约数据（调用函数） {: #read-contract-data }

调用函数是一种不修改合约存储（更改变量）的交互类型，这意味着无需发送交易。他们只读取已部署合约的各类存储变量。

Rust是typesafe，这就是为什么需要`Incrementer.sol`合约的ABI来生成typesafe Rust结构。在本示例中，您应该在名为`Incrementer_ABI.json`的Cargo项目的根目录中创建一个新文件：

```bash
touch Incrementer_ABI.json
```

`Incrementer.sol`的ABI如下所示，复制并将其粘贴至`Incrementer_ABI.json`文件中：

```json
[
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "increment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "number",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "reset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
```

然后，请执行以下步骤创建一个可以读取并返回`Incrementer.sol`合约`number`函数的函数：

1. 使用`abigen` macro为`Incrementer`智能合约生成一个type-safe接口
2. 创建一个名为`read_number`的新异步函数，这将客户端对象的引用和合约地址引用作为输入，并返回U256
3. 使用客户端和合约地址值创建一个由abigen macro生成的`Incrementer`对象的新实例
4. 在新的`Incrementer`对象中调用`number`函数
5. 输出结果值
6. 返回结果值
7. 在`main`函数中调用`read_number`函数

```rust
// ...

// 1. Generate a type-safe interface for the Incrementer smart contract
abigen!(
    Incrementer,
    "./Incrementer_ABI.json",
    event_derives(serde::Deserialize, serde::Serialize)
);

// 2. Define an asynchronous function that takes a client provider and address as input and returns a U256
async fn read_number(client: &Client, contract_addr: &H160) -> Result<U256, Box<dyn std::error::Error>> {
    // 3. Create contract instance
    let contract = Incrementer::new(contract_addr.clone(), Arc::new(client.clone()));

    // 4. Call contract's number function
    let value = contract.number().call().await?;

    // 5. Print out number
    println!("Incrementer's number is {}", value);

    // 6. Return the number
    Ok(value)
}

// ...

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...

    // 7. Call read_number function in main
    read_number(&client, &addr).await?;

    Ok(())
}
```

您可以[在GitHub中查看完整的脚本](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-docs/master/.snippets/code/ethers-rust/deploy-contract/main.rs){target=_blank}。

要运行部署合约和返回存储在`Incrementer`合约中的当前值的脚本，您可以在终端中输入以下命令：

```bash
cargo run
```

如果成功，您将在终端中看到已部署合约的地址和初始值（应为`5`）

![Terminal logs from deploy the contract](/images/builders/build/eth-api/libraries/ethersrs/ethersrs-2.png)

### 与合约交互（发送函数） {: #interact-with-contract }

发送函数是一种修改合约存储（更改变量）的交互类型，这意味着需要签署和发送交易。在这一部分中，您将创建两个函数：一个为increment，另一个为重置incrementer。此部分还将需要在[从智能合约读取](#read-contract-data)时初始化`Incrementer_ABI.json`文件。

执行以下步骤创建函数以递增：

1. 确保在`main.rs`文件中为`Incrementer_ABI.json`调用了abigen macro（如果它已存在于`main.rs`文件中，则无需再有第二个）
2. 创建一个名为`increment_number`的新异步函数，这将客户端对象的引用和地址作为输入
3. 使用客户端和合约地址值创建一个由abigen macro生成的`Incrementer`对象的新实例
4. 通过将`U256`对象作为输入值包含在新的`Incrementer`对象中调用`increment`函数。在本示例中，此数值为`5`
5. 在`main`函数调用`read_number`函数

```rust
// ...

// 1. Generate a type-safe interface for the Incrementer smart contract
abigen!(
    Incrementer,
    "./Incrementer_ABI.json",
    event_derives(serde::Deserialize, serde::Serialize)
);

// 2. Define an asynchronous function that takes a client provider and address as input
async fn increment_number(client: &Client, contract_addr: &H160) -> Result<(), Box<dyn std::error::Error>> {
    println!("Incrementing number...");

    // 3. Create contract instance
    let contract = Incrementer::new(contract_addr.clone(), Arc::new(client.clone()));

    // 4. Send contract transaction
    let tx = contract.increment(U256::from(5)).send().await?.await?;
    println!("Transaction Receipt: {}", serde_json::to_string(&tx)?);
    
    Ok(())
}

// ...

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...

    // 5. Call increment_number function in main
    increment_number(&client, &addr).await?;

    Ok(())
}
```

您可以[在GitHub上查看完整的脚本](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-docs/master/.snippets/code/ethers-rust/deploy-contract/main.rs){target=_blank}。

要运行脚本，您可以在终端输入以下命令：

```bash
cargo run
```

如果成功，交易收据将会显示在终端显示。您可以在`main`函数中使用`read_number`函数，以确保数值按预期变化。如果您在递增后使用`read_number`函数，您也会看到递增的数字，该数值应为`10`。

![Terminal logs from incrementing the number](/images/builders/build/eth-api/libraries/ethersrs/ethersrs-3.png)

接下来，您可以与`reset`函数进行交互：

1. 确保在`main.rs`文件中为`Incrementer_ABI.json`调用了abigen macro（如果它已存在于`main.rs`文件中，则无需再有第二个）
2. 创建一个名为`reset`的新异步函数，这将客户端对象的引用和地址作为输入
3. 使用客户端和合约地址值创建一个由abigen macro生成的`Incrementer`对象的新实例
4. 在新的`Incrementer`对象中调用`reset`函数
5. 在`main`函数中调用`reset`函数

```rust
// ...

// 1. Generate a type-safe interface for the Incrementer smart contract
abigen!(
    Incrementer,
    "./Incrementer_ABI.json",
    event_derives(serde::Deserialize, serde::Serialize)
);

// 2. Define an asynchronous function that takes a client provider and address as input
async fn reset(client: &Client, contract_addr: &H160) -> Result<(), Box<dyn std::error::Error>> {
    println!("Resetting number...");

    // 3. Create contract instance
    let contract = Incrementer::new(contract_addr.clone(), Arc::new(client.clone()));

    // 4. Send contract transaction
    let tx = contract.reset().send().await?.await?;
    println!("Transaction Receipt: {}", serde_json::to_string(&tx)?);
    
    Ok(())
}

// ...

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...

    // 5. Call reset function in main
    reset(&client, &addr).await?;

    Ok(())
}
```

如果成功，交易收据将会显示在终端显示。您可以在`main`函数中使用`read_number`函数，以确保数值按预期变化。如果您在重置数值后使用`read_number`函数，您应在终端看到`0`。

![Terminal logs from resetting the number](/images/builders/build/eth-api/libraries/ethersrs/ethersrs-4.png)

您可以[在GitHub上查看完整的脚本](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-docs/master/.snippets/code/ethers-rust/deploy-contract/main.rs){target=_blank}。

--8<-- 'text/disclaimers/third-party-content.md'