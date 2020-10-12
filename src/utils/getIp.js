const { exec } = require('child_process')
const { logIpQuery } = require('./logActions')

const getIp = () => {
  return new Promise((resolve, reject) => {
    exec(
      'dig +short myip.opendns.com @resolver1.opendns.com',
      (err, stdout, stderr) => {
        if (err) {
          logIpQuery(err)
          reject(err)
        }
        if (stderr) {
          logIpQuery(stderr)
          reject(stderr)
        }

        const ip = stdout.trim()
        logIpQuery(null, ip)
        resolve(ip)
      }
    )
  })
}

module.exports = {
  getIp,
}
