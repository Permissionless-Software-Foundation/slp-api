/*
  Mocking data for slp unit tests.
*/

const sinon = require('sinon')

// Mock the ctx object that would get passed in a normal query.
const mockCtx = {
  request: {
    method: 'GET',
    url:
      '/slp/validate/1e2fc27ec0438cd7e1ac6d4b549e218e6663c75480248f5cc6361cb11c742d74',
    header: {
      accept: 'application/json',
      host: 'localhost:5001',
      connection: 'close'
    }
  },
  response: {
    status: 404,
    message: 'Not Found',
    header: {
      vary: 'Origin'
    }
  },
  app: {
    subdomainOffset: 2,
    proxy: false,
    env: 'development'
  },
  originalUrl:
    '/slp/validate/1e2fc27ec0438cd7e1ac6d4b549e218e6663c75480248f5cc6361cb11c742d74',
  req: '<original node req>',
  res: '<original node res>',
  socket: '<original node socket>'
}

const hydrateRes = [
  {
    txid: 'd56a2b446d8149c39ca7e06163fe8097168c3604915f631bc58777d669135a56',
    vout: 3,
    value: '6816',
    height: 606848,
    confirmations: 13,
    satoshis: 6816,
    isValid: false
  },
  {
    txid: 'd56a2b446d8149c39ca7e06163fe8097168c3604915f631bc58777d669135a56',
    vout: 2,
    value: '546',
    height: 606848,
    confirmations: 13,
    satoshis: 546,
    isValid: false
  }
]

const mockValidatorType1 = class ValidatorType1 {
  constructor () {
    this.logger = {}
    this.getRawTransaction = sinon.stub().returns({})
    this.cachedValidations = sinon.stub().returns({})
    this.cachedRawTransactions = sinon.stub().returns({})
  }
}

module.exports = {
  mockCtx,
  hydrateRes,
  mockValidatorType1
}
