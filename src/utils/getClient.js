const NetlifyAPI = require('netlify')

const client = new NetlifyAPI(process.env.NETLIFY_AUTH_TOKEN)

const getClient = () => {
  return client
}

module.exports = {
  getClient,
}
