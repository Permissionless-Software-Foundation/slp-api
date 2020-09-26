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

    // console.log(
    //   `Hydrated UTXO data:\n${JSON.stringify(result.data.details, null, 2)}`
    // )
  })

  it('should hydrate a NFT UTXO', async () => {
    const utxos = [
      {
        height: 649122,
        tx_hash:
          '7665c787d44abd94950ca8d3873aade115ba53effa3d7ad9a8c2d74cfdba939e',
        tx_pos: 0,
        value: 1000
      },
      {
        height: 649122,
        tx_hash:
          '7665c787d44abd94950ca8d3873aade115ba53effa3d7ad9a8c2d74cfdba939e',
        tx_pos: 2,
        value: 3250
      },
      {
        height: 649122,
        tx_hash:
          'd9b8277529a31ca632ecfd19f724678967531c98ecb1972c1af533e877aa2757',
        tx_pos: 1,
        value: 546
      },
      {
        height: 0,
        tx_hash:
          '952e19352f073761d94b03e1c27035ac1553ed56f8e34290db2ba61e4320985c',
        tx_pos: 1,
        value: 546
      }
    ]

    const result = await axios.post(`${SERVER}/slp/hydrateutxos`, { utxos })
    const details = result.data.details
    console.log(`details: ${JSON.stringify(details, null, 2)}`)
  })
})
