const dotenv = require('dotenv')
dotenv.config()
const { logIpCompare, logDnsCheck } = require('./utils/logActions')
const { getIp } = require('./utils/getIp')
const { getDnsmasqIp } = require('./utils/getDnsmasqIp')
const { getHomeRecord } = require('./utils/getHomeRecord')
const { recreateHomeRecord } = require('./utils/recreateHomeRecord')
const { restartDockerDns } = require('./utils/restartDockerDns')

const updateNetlifyDns = async () => {
  logDnsCheck(null, '***** STARTING... *****')
  const ip = await getIp()
  const homeRecord = await getHomeRecord()

  if (homeRecord && ip) {
    if (homeRecord.value === ip) {
      logIpCompare(
        null,
        `Current IP matches DNS record (${ip}), no actions taken`
      )
    } else {
      logIpCompare(
        true,
        `Current IP (${ip}) mismatch DNS record (${homeRecord.value}), recreating record`
      )
      await recreateHomeRecord(homeRecord, ip)
    }
  }

  const dnsmasqIp = getDnsmasqIp()
  if (dnsmasqIp && ip && dnsmasqIp !== ip) await restartDockerDns(ip)

  logDnsCheck(null, '***** DONE! *****')
}

const init = async () => {
  const twentyMinutes = 1000 * 60 * 20

  await updateNetlifyDns()
  setInterval(async () => {
    await updateNetlifyDns()
  }, twentyMinutes)
}

init()
