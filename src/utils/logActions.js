const { logInfo, logError, logWarn } = require('./logger')

const handleErrorLogging = ({ label, error }) => {
  error instanceof Error
    ? logError({
        label,
        message: error.message,
        splat: [{ stacktrace: error.stack }],
      })
    : logError({ label, message: error })
}

const logIpQuery = (err, message) => {
  err
    ? handleErrorLogging({ label: 'IP query failure', error: err })
    : logInfo({ label: 'IP query success', message })
}

const logHomeRecord = (err, message) => {
  err
    ? handleErrorLogging({ label: 'Home DNS record not found', error: err })
    : logInfo({ label: 'Home DNS record was found', message })
}

const logHomeRecreate = (err, message) => {
  err
    ? handleErrorLogging({
        label: 'Home DNS record recreation failure',
        error: err,
      })
    : logInfo({ label: 'Home DNS record recreation success', message })
}

const logIpCompare = (err, message) => {
  err
    ? logWarn({ label: 'IP compare mismatch', message })
    : logInfo({ label: 'IP compare match', message })
}

const logDnsCheck = (err, message) => {
  err ? undefined : logInfo({ label: 'Checking DNS records match', message })
}

module.exports = {
  logIpQuery,
  logHomeRecord,
  logHomeRecreate,
  logIpCompare,
  logDnsCheck,
}
