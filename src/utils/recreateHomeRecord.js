const { getClient } = require('./getClient')
const { logHomeRecreate } = require('./logActions')

const recreateHomeRecord = async (oldRecord, newIp) => {
  try {
    const netlifyClient = getClient()
    return netlifyClient
      .deleteDnsRecord({
        zone_id: process.env.ZONE_ID,
        dns_record_id: oldRecord.id,
      })
      .then(
        async () => {
          const newRecord = await netlifyClient.createDnsRecord({
            zone_id: process.env.ZONE_ID,
            body: {
              type: 'A',
              hostname: process.env.HOME_RECORD_NAME,
              value: newIp,
            },
          })
          const { hostname, id, value } = newRecord
          logHomeRecreate(null, `${hostname} (${id}) created @ ${value}`)
          return newRecord
        },
        () => {
          logHomeRecreate('Existing record deletion failure')
        }
      )
      .catch((err) => {
        logHomeRecreate(err)
      })
  } catch (err) {
    logHomeRecreate(err)
  }
}

module.exports = {
  recreateHomeRecord,
}
