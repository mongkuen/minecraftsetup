const { logInfo, logError } = require('./logger')

const logIpQuery = (err, message) => {
  if (err) {
    const errLabel = 'IP query failure'
    err instanceof Error
      ? logError({
          label: errLabel,
          message: err.message,
          splat: [{ stacktrace: err.stack }],
        })
      : logError({ label: errLabel, message: err })
  } else {
    logInfo({ label: 'IP query success', message })
  }
}

module.exports = {
  logIpQuery,
}
