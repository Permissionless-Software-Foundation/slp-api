/*
  This file is used to store unsecure, application-specific data common to all
  environments.
*/

module.exports = {
  port: process.env.PORT || 5001,
  logPass: 'test',

  // Email Server, for sending emails.
  emailServer: process.env.EMAILSERVER ? process.env.EMAILSERVER : 'mail.someserver.com',
  emailUser: process.env.EMAILUSER ? process.env.EMAILUSER : 'noreply@someserver.com',
  emailPassword: process.env.EMAILPASS ? process.env.EMAILPASS : 'emailpassword',

  // BCH Full Node RPC
  rpcUserName: process.env.RPC_USER_NAME ? process.env.RPC_USER_NAME : 'bitcoin',
  rpcPassword: process.env.RPC_PASSWORD ? process.env.RPC_PASSWORD : 'password',
  rpcUrl: process.env.RPC_URL ? process.env.RPC_URL : '0.0.0.0:8332'
}
