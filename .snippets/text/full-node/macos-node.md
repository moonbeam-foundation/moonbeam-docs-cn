---
title: 适用于MacOS的全节点Docker命令
---

# MacOS收集人和全节点命令

对于v0.27.0之前的客户端版本，`--state-pruning`标志被命名为`--pruning`。

## Moonbeam全节点 {: #moonbeam-full-node } 

```
docker run -p 9933:9933 -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.26.1 \
--base-path=/data \
--chain moonbeam \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--state-pruning archive \
--state-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbeam收集人节点 {: #moonbeam-collator } 

```
docker run -p 9933:9933 -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.26.1 \
--base-path=/data \
--chain moonbeam \
--name="YOUR-NODE-NAME" \
--validator \
--execution wasm \
--wasm-execution compiled \
--state-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonriver全节点 {: #moonriver-full-node } 

```
docker run -p 9933:9933 -p 9944:9944 -v "/var/lib/moonriver-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.26.1 \
--base-path=/data \
--chain moonriver \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--state-pruning archive \
--state-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonriver收集人节点 {: #moonriver-collator } 

```
docker run -p 9933:9933 -p 9944:9944 -v "/var/lib/moonriver-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.26.1 \
--base-path=/data \
--chain moonriver \
--name="YOUR-NODE-NAME" \
--validator \
--execution wasm \
--wasm-execution compiled \
--state-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbase Alpha全节点 {: #moonbase-alpha-full-node } 

```
docker run -p 9933:9933 -p 9944:9944 -v "/var/lib/alphanet-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.26.1 \
--base-path=/data \
--chain alphanet \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--state-pruning archive \
--state-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbase Alpha收集人节点 {: #moonbase-alpha-collator } 

```
docker run -p 9933:9933 -p 9944:9944 -v "/var/lib/alphanet-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.26.1 \
--base-path=/data \
--chain alphanet \
--name="YOUR-NODE-NAME" \
--validator \
--execution wasm \
--wasm-execution compiled \
--state-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```
