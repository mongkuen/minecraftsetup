const { readFileSync } = require('fs')
const path = require('path')

const getDnsmasqIp = () => {
  const hostsPath = path.resolve('.', 'dns', 'dnsmasq.hosts')
  const hosts = readFileSync(hostsPath, { encoding: 'utf8' })
  const ip = hosts.split(' ')[0]
  return ip
}

module.exports = {
  getDnsmasqIp,
}
