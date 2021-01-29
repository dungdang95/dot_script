const { ApiPromise, WsProvider } = require("@polkadot/api");
const { Keyring } = require("@polkadot/keyring");

const BOB = process.argv[4];

async function main() {
  // Instantiate the API
  const wsProvider = new WsProvider(process.argv[2]);
  const api = await ApiPromise.create({ provider: wsProvider });

  const keyring = new Keyring({ type: "sr25519" });

  const alice = keyring.addFromUri(process.argv[3]);

  const transfer = api.tx.balances.transfer(BOB, Number(process.argv[5]));

  const hash = await transfer.signAndSend(alice);

  console.log(hash.toHex());
}

main()
  .catch(console.error)
  .finally(() => process.exit());
