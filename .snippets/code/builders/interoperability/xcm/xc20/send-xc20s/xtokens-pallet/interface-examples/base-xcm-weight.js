import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const baseXcmWeight = api.consts.xTokens.baseXcmWeight;
  console.log(baseXcmWeight.toJSON());
};

main();