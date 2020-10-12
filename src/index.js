const dotenv = require('dotenv')
dotenv.config()
const { logIpCompare, logDnsCheck } = require('./utils/logActions')
const { getIp } = require('./utils/getIp')
const { getHomeRecord } = require('./utils/getHomeRecord')
const { recreateHomeRecord } = require('./utils/recreateHomeRecord')

const updateNetlifyDns = async () => {
  logDnsCheck(null, '***** STARTING... *****')
  const ip = await getIp()
  const homeRecord = await getHomeRecord()

  if (homeRecord && ip) {
    if (homeRecord.value === ip) {
      logIpCompare(null, 'Current IP matches DNS record, no actions taken')
    } else {
      logIpCompare(null, 'Current IP mismatch DNS record, recreating record')
      recreateHomeRecord(homeRecord, ip)
    }
  }
  logDnsCheck(null, '***** DONE! *****')
}

const init = () => {
  const twentyMinutes = 1000 * 60 * 20

  updateNetlifyDns()
  setInterval(() => {
    updateNetlifyDns()
  }, twentyMinutes)
}

init()
