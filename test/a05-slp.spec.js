/*
  Unit tests for SLP validation endpoints.
*/

'use strict'

// const config = require('../../config')

const testUtils = require('./utils')
// const rp = require('request-promise')
const assert = require('chai').assert
const sinon = require('sinon')

// const LOCALHOST = `http://localhost:${config.port}`

const SLP = require('../src/modules/slp/controller')
const slp = new SLP()

const mockData = require('./mocks/slp-mocks')

const context = {}

// Default to unit tests unless something else is specified
if (!process.env.TEST) process.env.TEST = 'unit'

describe('SLP', () => {
  let sandbox
  let ctx

  before(async () => {
    const testUser = await testUtils.loginTestUser()
    // console.log(`testUser: ${JSON.stringify(testUser, null, 2)}`)

    context.testUser = testUser
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    ctx = Object.assign({}, mockData.ctxMock)
    ctx.params = {}
    ctx.request = {}
    ctx.throw = () => {
      const err = this.err
      throw err
    }
  })

  afterEach(() => sandbox.restore())

  describe('GET /validate/:txid', () => {
    // Only run these tests if this is an integration test.
    // Because of the way slp-validate is structured, it's incredibly difficult
    // to mock for unit tests.
    if (process.env.TEST !== 'unit') {
      it('should validate a genesis txid', async () => {
        // const mockTx =
        //   '0200000001ad831c1d04db55320eed88f86cefe11d232e0562899dcb07f4058b94ecba0cfc000000006a473044022039e13a6aa2ea1563d204b4e2f757983c4c29c7bfb7b2a3c5934db4ca8e3c9c2c02202135885fb91ef1dc9e1e4323a3c8d3d514c58631328197eaa36d5c28430103b64121038c295f820a24bd42bb25af93583e6d58bcbc46a3c7db8635ecfe4a6ced334224ffffffff040000000000000000596a04534c500001010747454e4553495306534c5053444b1c534c502053444b206578616d706c65207573696e6720424954424f5815646576656c6f7065722e626974636f696e2e636f6d4c000108010208000000bcdf49b0022020000000000001976a914653509aac57b54d4ecc1e5ae14d8a0522d7611a688ac22020000000000001976a914653509aac57b54d4ecc1e5ae14d8a0522d7611a688acdd0d0000000000001976a914653509aac57b54d4ecc1e5ae14d8a0522d7611a688ac00000000'

        // Mock the actual network call.
        // if (process.env.TEST === 'unit') {
        //   // sandbox.stub(slp.rpc, 'getRawTransaction').resolves(mockTx)
        //   sandbox.stub(slp.slpValidator, 'getRawTransaction').resolves(mockTx)
        //   sandbox.stub(slp.slpValidator, 'isValidSlpTxid').resolves(true)
        // }

        const txid =
          '0e2fc27ec0438cd7e1ac6d4b549e218e6663c75480248f5cc6361cb11c742d74'

        ctx.params.txid = txid

        await slp.validateTxid(ctx)
        // console.log(`ctx: ${JSON.stringify(ctx, null, 2)}`)

        assert.equal(ctx.body.isValid, true)
      })

      it('should return false for non-SLP txid', async () => {
        // const mockTx =
        //   '02000000016d1a17fe402ab83b7c45ab14751fcefe6b8006eb239ba13980a14f6169c68161010000006b483045022100f0dc7bd03a1769cd8444c3cc87a21fc2f961a48a818190eae085c419a21f1dd7022028ae55d1a565ca07acc51f8d512dfaf942b072e21e1b34117da885e73703c66d41210295df871c64c58dc460f9283a472909d1286415289dfa099907ea942cf74a30ebffffffff02e8030000000000001976a9149fc83c5ae60205bfd2407ad7c2e8bf8db718838988ac90b90000000000001976a9140c43dc98064e5979ddf15134201a1451d0715c6088ac00000000'

        // Mock the actual network call for unit tests.
        // if (process.env.TEST === 'unit') {
        //   sandbox.stub(slp.rpc, 'getRawTransaction').resolves(mockTx)
        //   sandbox.stub(slp.slpValidator, 'isValidSlpTxid').resolves(false)
        // }

        const txid =
          '5f09d317e24c5d376f737a2711f3bd1d381abdb41743fff3819b4f76382e1eac'

        ctx.params.txid = txid

        await slp.validateTxid(ctx)

        assert.equal(ctx.body.isValid, false)
      })
    }
  })

  describe('POST /hydrateutxos', () => {
    it('should throw error if input is not an array.', async () => {
      try {
        const body = {
          utxos: 'test'
        }

        ctx.request.body = body
        await slp.hydrateUtxos(ctx)

        assert.equal(true, false, 'Unexpected result.')
      } catch (err) {
        assert.include(err.message, 'Input must be an array')
      }
    })
    it('should throw error if Array is empty', async () => {
      try {
        const body = {
          utxos: []
        }
        ctx.request.body = body
        await slp.hydrateUtxos(ctx)

        assert.equal(true, false, 'Unexpected result.')
      } catch (err) {
        assert.include(err.message, 'Array should not be empty')
      }
    })

    it('should throw error if Array is too long', async () => {
      try {
        const utxo = {
          txid:
            'bd158c564dd4ef54305b14f44f8e94c44b649f246dab14bcb42fb0d0078b8a90',
          vout: 3,
          amount: 0.00002015,
          satoshis: 2015,
          height: 594892,
          confirmations: 5
        }

        const utxos = []

        // Populate array with 21 utxos
        for (let i = 0; i < 21; i++) {
          utxos.push(utxo)
        }

        const body = {
          utxos: utxos
        }

        ctx.request.body = body

        await slp.hydrateUtxos(ctx)

        assert.equal(true, false, 'Unexpected result.')
      } catch (err) {
        assert.include(err.message, 'Array too long, max length is 20')
      }
    })
    it('should return utxo details', async () => {
      try {
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
        const body = {
          utxos: utxos
        }

        ctx.request.body = body

        // Add mocks for unit test
        if (process.env.TEST === 'unit') {
          sandbox
            .stub(slp.bchjs.SLP.Utils, 'tokenUtxoDetails')
            .resolves(mockData.hydrateRes)
        }

        await slp.hydrateUtxos(ctx)

        const result = ctx.body.details

        assert.isArray(result)
        assert.equal(result.length, 2)
        assert.property(result[0], 'txid')
        assert.property(result[0], 'vout')
        assert.property(result[0], 'value')
        assert.property(result[0], 'height')
        assert.property(result[0], 'confirmations')
        assert.property(result[0], 'satoshis')
        assert.property(result[0], 'isValid')
      } catch (err) {
        assert.equal(true, false, 'Unexpected result.')
      }
    })
  })
})
