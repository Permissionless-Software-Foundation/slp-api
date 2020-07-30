/*
  Based on this example:
  https://github.com/simpleledger/slp-validate/blob/master/examples/1-validate-tx-rpc-burn-valid-stop.ts
*/

const slpValidate = require('slp-validate')
const ValidatorType1 = slpValidate.ValidatorType1
const RpcClient = require('bitcoin-rpc-promise-retry')

const config = require('../../../config')

const wlogger = require('../../lib/wlogger')

let _this

class SLP {
  constructor () {
    // Instantiate the RPC connection to the full node.
    const connectionString = `http://${config.rpcUserName}:${
      config.rpcPassword
    }@${config.rpcUrl}`

    // Encapsulate the RPC client.
    this.rpc = new RpcClient(connectionString)

    // Instantiate the type of validate being used.
    this.slpValidator = new ValidatorType1({
      getRawTransaction: async txid => {
        const rawTx = await _this.rpc.getRawTransaction(txid)
        // console.log(`rawTx: ${JSON.stringify(rawTx, null, 2)}`)
        return rawTx
      }
    })

    _this = this
  }

  // Validates an SLP token TXID.
  // curl -X GET http://127.0.0.1:5001/slp/validate/0e2fc27ec0438cd7e1ac6d4b549e218e6663c75480248f5cc6361cb11c742d74
  async validateTxid (ctx, next) {
    // console.log(`ctx: ${JSON.stringify(ctx, null, 2)}`)

    try {
      const txid = ctx.params.txid

      // Get the raw transaction from the full node.
      try {
        await _this.slpValidator.getRawTransaction(txid)
        // console.log('rawTx: ', rawTx)
      } catch (err) {
        wlogger.error(`err with getRawTransaction(${txid}): `, err)
        // throw new Error('Error trying to get raw transaction from full node.')
        throw err
      }

      // false by default.
      let isValid = false

      // Validat the TXID.
      try {
        isValid = await _this.slpValidator.isValidSlpTxid({ txid })
        // console.log('isValid: ', isValid)
      } catch (error) {
        console.log(error)
        isValid = false
      }

      ctx.body = {
        isValid: isValid
      }
    } catch (err) {
      wlogger.error('Error in slp/validateTxid/txid: ', err)

      if (err === 404 || err.name === 'CastError') {
        ctx.throw(404)
      }

      ctx.throw(500)
    }

    if (next) {
      return next()
    }
  }
}

module.exports = SLP
