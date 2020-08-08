/*
  Integration tests for the hydrate(utxos) endpoint.
*/

const axios = require('axios')
const assert = require('chai').assert

const SERVER = 'https://slp-api.fullstack.cash'

const app = require('../../bin/server')

// We can use this variable to test with the local server
// const config = require('../../config')
// const LOCALHOST = `http://localhost:${config.port}`

describe('#hydrate', () => {
  before(async () => {
    await app.startServer() // This should be the second instruction.
  })
  it('should hydrate a token UTXO', async () => {
    const utxos = [
      {
        txid:
          'd56a2b446d8149c39ca7e06163fe8097168c3604915f631bc58777d669135a56',
        vout: 3,
        value: '6816',
        height: 606848,
        confirmations: 13,
        satoshis: 6816
      },
      {
        txid:
          'd56a2b446d8149c39ca7e06163fe8097168c3604915f631bc58777d669135a56',
        vout: 2,
        value: '546',
        height: 606848,
        confirmations: 13,
        satoshis: 546
      }
    ]

    const result = await axios.post(`${SERVER}/slp/hydrateutxos`, { utxos })
    const details = result.data.details

    assert.isArray(details)
    assert.equal(details.length, 2)
    assert.property(details[0], 'txid')
    assert.property(details[0], 'vout')
    assert.property(details[0], 'value')
    assert.property(details[0], 'height')
    assert.property(details[0], 'confirmations')
    assert.property(details[0], 'satoshis')
    assert.property(details[0], 'isValid')

    console.log(`Hydrated UTXO data:\n${JSON.stringify(result.data.details, null, 2)}`)
  })
})
