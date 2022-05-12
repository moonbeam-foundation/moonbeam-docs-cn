---
title: 适用于MacOS的全节点Docker命令
---

# MacOS收集人和全节点命令

## Moonbeam全节点 {: #moonbeam-full-node } 

```
docker run -p 9933:9933 -p 9944:9944 -v "{{ networks.moonbeam.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
--base-path=/data \
--chain {{ networks.moonbeam.chain_spec }} \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 0 \
-- \
--execution wasm \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbeam收集人节点 {: #moonbeam-collator } 

```
docker run -p 9933:9933 -p 9944:9944 -v "{{ networks.moonbeam.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
--base-path=/data \
--chain {{ networks.moonbeam.chain_spec }} \
--name="YOUR-NODE-NAME" \
--validator \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 0 \
-- \
--execution wasm \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```
## Moonriver全节点 {: #moonriver-full-node } 

```
docker run -p 9933:9933 -p 9944:9944 -v "{{ networks.moonriver.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
--base-path=/data \
--chain {{ networks.moonriver.chain_spec }} \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 0 \
-- \
--execution wasm \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonriver收集人节点 {: #moonriver-collator } 

```
docker run -p 9933:9933 -p 9944:9944 -v "{{ networks.moonriver.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
--base-path=/data \
--chain {{ networks.moonriver.chain_spec }} \
--name="YOUR-NODE-NAME" \
--validator \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 0 \
-- \
--execution wasm \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbase Alpha全节点 {: #moonbase-alpha-full-node } 

```
docker run -p 9933:9933 -p 9944:9944 -v "{{ networks.moonbase.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
--base-path=/data \
--chain {{ networks.moonbase.chain_spec }} \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 0 \
-- \
--execution wasm \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbase Alpha收集人节点 {: #moonbase-alpha-collator } 

```
docker run -p 9933:9933 -p 9944:9944 -v "{{ networks.moonbase.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
--base-path=/data \
--chain {{ networks.moonbase.chain_spec }} \
--name="YOUR-NODE-NAME" \
--validator \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 0 \
-- \
--execution wasm \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```
