const { ApiPromise, WsProvider } = require("@polkadot/api");

async function main() {
  // Instantiate the API
  const wsProvider = new WsProvider(process.argv[2]);
  const api = await ApiPromise.create({ provider: wsProvider });

  let account = await api.query.system.account(
    process.argv[3]
  );
  console.log(account.data.free.toNumber());
}

main()
  .catch(console.error)
  .finally(() => process.exit());
