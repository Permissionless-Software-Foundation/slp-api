/*
  Integration tests for the hydrate(utxos) endpoint.
*/

const axios = require('axios')

const SERVER = 'https://slp-api.fullstack.cash'

describe('#hydrate', () => {
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
    console.log(`result.data: ${JSON.stringify(result.data, null, 2)}`)

    console.log(`Hydrated UTXO data:\n${JSON.stringify(result.data.details, null, 2)}`)
  })
})
