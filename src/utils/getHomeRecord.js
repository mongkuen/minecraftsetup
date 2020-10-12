const { getClient } = require('./getClient')
const { logHomeRecord } = require('./logActions')

const getHomeRecord = async () => {
  try {
    const netlifyClient = getClient()
    const dnsRecords = await netlifyClient.getDnsRecords({
      zoneId: process.env.ZONE_ID,
    })
    const homeRecord = dnsRecords.find(
      (record) => record.hostname === process.env.HOME_RECORD_NAME
    )

    if (homeRecord) {
      const { hostname, value, id } = homeRecord
      logHomeRecord(null, `${hostname} (${id}) found @ ${value}`)
      return homeRecord
    } else {
      logHomeRecord('Record not found')
    }
  } catch (err) {
    logHomeRecord(err)
  }
}

module.exports = {
  getHomeRecord,
}
