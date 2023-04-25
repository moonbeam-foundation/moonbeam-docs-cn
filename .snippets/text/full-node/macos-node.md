---
title: 适用于MacOS的全节点Docker命令
---

# MacOS收集人和全节点命令

对于v0.27.0之前的客户端版本，`--state-pruning`命令行标志被命名为`--pruning`。

对于v0.30.0之前的客户端版本，`--rpc-port`用于指定HTTP连接的端口，`--ws-port`用于指定WS连接的端口。从客户端版本v0.30.0开始，默认为端口`9933`的`--rpc-port`命令行标志已被弃用，并且到该端口的最大连接数已硬编码为100。`--ws-port`命令行标志，默认为端口`9944`，同时适用于HTTP连接和WS连接。您可以使用`--ws-max-connections`来调整HTTP和WS连接的总限制。

## Moonbeam全节点 {: #moonbeam-full-node } 

```
docker run -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.31.1 \
--base-path=/data \
--chain moonbeam \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--state-pruning archive \
--trie-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbeam收集人节点 {: #moonbeam-collator } 

```
docker run -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.31.1 \
--base-path=/data \
--chain moonbeam \
--name="YOUR-NODE-NAME" \
--collator \
--execution wasm \
--wasm-execution compiled \
--trie-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonriver全节点 {: #moonriver-full-node } 

```
docker run -p 9944:9944 -v "/var/lib/moonriver-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.31.1 \
--base-path=/data \
--chain moonriver \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--state-pruning archive \
--trie-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonriver收集人节点 {: #moonriver-collator } 

```
docker run -p 9944:9944 -v "/var/lib/moonriver-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.31.1 \
--base-path=/data \
--chain moonriver \
--name="YOUR-NODE-NAME" \
--collator \
--execution wasm \
--wasm-execution compiled \
--trie-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbase Alpha全节点 {: #moonbase-alpha-full-node } 

```
docker run -p 9944:9944 -v "/var/lib/alphanet-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.31.1 \
--base-path=/data \
--chain alphanet \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--state-pruning archive \
--trie-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbase Alpha收集人节点 {: #moonbase-alpha-collator } 

```
docker run -p 9944:9944 -v "/var/lib/alphanet-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.31.1 \
--base-path=/data \
--chain alphanet \
--name="YOUR-NODE-NAME" \
--collator \
--execution wasm \
--wasm-execution compiled \
--trie-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```
