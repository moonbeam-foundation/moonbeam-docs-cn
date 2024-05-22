import { ApiPromise, WsProvider } from '@polkadot/api';

const assetLocation = {
  V4: {
    parents: INSERT_PARENTS,
    interior: INSERT_INTERIOR,
  },
};;

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });
  const tx = api.tx.xcmTransactor.removeTransactInfo(assetLocation);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
};
main();