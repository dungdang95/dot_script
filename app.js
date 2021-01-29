const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { Keyring } = require("@polkadot/keyring");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post("/balance", async (req, res) => {
  (async () => {
    try {
      const data = req.body;
      const wsProvider = new WsProvider(data.rpc);
      const api = await ApiPromise.create({ provider: wsProvider });
      const account = await api.query.system.account(data.address);
      return { balance: account.data.free.toNumber() };
    } catch (error) {
      console.log("error", error);
      res.status(400).json({
        result: null,
        error,
      });
    }
  })()
    .then((result) => {
      res.json({ result, error: null });
    })
    .catch((error) => {
      res.status(400).json({
        result: null,
        error,
      });
    });
});

app.post("/sweep-assll", async (req, res) => {
  (async () => {
    try {
      const data = req.body;
      const wsProvider = new WsProvider(data.rpc);
      const api = await ApiPromise.create({ provider: wsProvider });

      const keyring = new Keyring({ type: "sr25519" });

      const from = keyring.addFromUri(data.from);

      const transfer = api.tx.balances.transfer(data.to, Number(data.amount));

      const hash = await transfer.signAndSend(from);

      return { hash };
    } catch (error) {
      console.log("error", error);
      res.status(400).json({
        result: null,
        error,
      });
    }
  })()
    .then((result) => {
      res.json({ result, error: null });
    })
    .catch((error) => {
      res.status(400).json({
        result: null,
        error,
      });
    });
});

app.post("/sweep-all", async (req, res) => {
  (async () => {
    try {
      const data = req.body;
      console.log(data);
      const wsProvider = new WsProvider(data.rpc);
      const api = await ApiPromise.create({ provider: wsProvider });
      const keyring = new Keyring({ type: "sr25519" });
      const from = keyring.addFromUri(data.from);
      let balance = await api.query.system.account(from.address);
      console.log(balance.data.free.toNumber());
      const info = await api.tx.balances
        .transfer(data.to, balance.data.free.toNumber())
        .paymentInfo(from);
      console.log(info);
      const transfer = api.tx.balances.transfer(
        data.to,
        balance.data.free.toNumber() - info.partialFee.toNumber()
      );

      const hash = await transfer.signAndSend(from);
      return { hash };
    } catch (error) {
      console.log("error", error);
      res.status(400).json({
        result: null,
        error,
      });
    }
  })()
    .then((result) => {
      res.json({ result, error: null });
    })
    .catch((error) => {
      res.status(400).json({
        result: null,
        error,
      });
    });
});
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
