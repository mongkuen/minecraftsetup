const path = require('path')
const winston = require('winston')
require('winston-daily-rotate-file')

const { format } = require('logform')
const { combine, timestamp, json, printf, splat } = format

const { configs } = require('triple-beam')
const colors = require('colors/safe')
const colorMap = configs.cli.colors

const combinedDir = path.resolve('logs', 'combined')
const errorDir = path.resolve('logs', 'error')

const fileFormat = combine(timestamp(), json(), splat())
const cliFormat = format.combine(
  splat(),
  timestamp(),
  printf((info) => {
    const color = colorMap[info.level]
    const colorMsg = colors[color]

    const level = colorMsg(`[${info.level}]\t`)
    const label = `- ${colorMsg(info.label)}:`
    const timestamp = colors.grey(`(${info.timestamp})`)

    //
    // CLI format
    // [info]	 (2020-10-12T20:35:15.777Z) - Home DNS record was found: serve.mongkuen.com (5f84bcb4b5b36e2f68910479) found @ 209.50.7.38
    //
    const baseMsg = `${level} ${timestamp} ${label} ${info.message}`
    return info.stacktrace ? `${baseMsg}\n${info.stacktrace}` : baseMsg
  })
)

const logger = winston.createLogger({
  level: 'info',
  transports: [
    //
    // - Write all logs with level `info` and below to `%DATE%-combined.log`
    // - Write all logs with level `error` and below to `%DATE%-error.log`
    //
    new winston.transports.Console({
      format: cliFormat,
    }),
    new winston.transports.DailyRotateFile({
      dirname: combinedDir,
      filename: '%DATE%-combined',
      datePattern: 'YYYY-MM-DD',
      extension: '.log',
      maxFiles: '14d',
      format: fileFormat,
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      dirname: errorDir,
      filename: '%DATE%-error',
      datePattern: 'YYYY-MM-DD',
      extension: '.log',
      maxFiles: '14d',
      format: fileFormat,
    }),
  ],
})

module.exports = {
  logger: logger,
  logInfo: logger.info,
  logWarn: logger.warn,
  logError: logger.error,
}
