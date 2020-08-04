const config = require('../../config')

// Instantiate the JWT handling library for FullStack.cash.
const JwtLib = require('jwt-bch-lib')
const jwtLib = new JwtLib({
  // Overwrite default values with the values in the config file.
  server: 'https://auth.fullstack.cash',
  login: config.fullstackLogin,
  password: config.fullstackPass
})

// Winston logger
const wlogger = require('./wlogger')

async function getJwt () {
  try {
    // Log into the auth server.
    await jwtLib.register()

    let apiToken = jwtLib.userData.apiToken

    // Ensure the JWT token is valid to use.
    const isValid = await jwtLib.validateApiToken()

    // Get a new token with the same API level, if the existing token is not
    // valid (probably expired).
    if (!isValid.isValid) {
      apiToken = await jwtLib.getApiToken(jwtLib.userData.apiLevel)
      wlogger.info('The JWT token was not valid. Retrieved new JWT token.\n')
    } else {
      wlogger.info('JWT token is valid.\n')
    }

    // Set the environment variable.
    process.env.BCHJSTOKEN = apiToken
  } catch (err) {
    wlogger.error('Error in token-liquidity.js/getJwt(): ', err)
    throw err
  }
}

module.exports = {
  getJwt
}
