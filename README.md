# slp-api
This repository is a REST API based on the [Koa API Boilerplate](https://github.com/christroutner/koa-api-boilerplate). It incorporates the [slp-validate](https://github.com/simpleledger/slp-validate.js) library for creating an alternative to SLPDB for validating token transactions. It also does hydration of UTXOs with SLP information, which is a fairly intensive task, and should be done in software that 'lives closely' with the full node and SLPDB.

## License
[MIT](./LICENSE.md)
