const { writeFileSync } = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { logDockerRestart } = require('./logActions')

const restartDockerDns = (ip) => {
  return new Promise((resolve, reject) => {
    const hostsPath = path.resolve('.', 'dns', 'dnsmasq.hosts')
    writeFileSync(hostsPath, `${ip} mco.lbsg.net`)

    exec(
      `docker-compose -f ${path.resolve(
        '.',
        'dns',
        'docker-compose.yml'
      )} restart`,
      (err, stdout, stderr) => {
        if (err) {
          logDockerRestart(err)
          reject(err)
        }
        if (stderr) {
          logDockerRestart(stderr)
          reject(stderr)
        }
        logDockerRestart(null, 'Restarted!')
        resolve()
      }
    )
  }).catch(() => {
    return
  })
}

module.exports = {
  restartDockerDns,
}
