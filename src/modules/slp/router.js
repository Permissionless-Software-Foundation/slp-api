// const validator = require('../../middleware/validators')

const SLP = require('./controller')
const slp = new SLP()

// export const baseUrl = '/users'
module.exports.baseUrl = '/slp'

module.exports.routes = [
  {
    method: 'GET',
    route: '/validate/:txid',
    handlers: [slp.validateTxid]
  }
]
