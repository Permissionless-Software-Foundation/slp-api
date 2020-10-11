# slp-api
This repository is a REST API based on the [Koa API Boilerplate](https://github.com/christroutner/koa-api-boilerplate). It incorporates the [slp-validate](https://github.com/simpleledger/slp-validate.js) library for creating an alternative to SLPDB for validating token transactions. It also does hydration of UTXOs with SLP information, which is a fairly intensive task, and should be done in software that 'lives closely' with the full node and SLPDB.

The token validation can take an unbounded amount of time as the app recursively retrieves data from a full node and analyzes it, in order to follow the DAG. This is why the validation has been wrapped into its own REST API. Applications querying this API can choose to disconnect if the API does not return a value after a period of time (5-10 seconds).

**TODO**: slp-validate should really be loaded as a Worker thread, so that it can be killed after a time-threshold (like 10 seconds), so that it doesn't take excessive processing time.

## License
[MIT](./LICENSE.md)
