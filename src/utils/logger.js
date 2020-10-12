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
    const label = `- ${colorMsg(info.label)}\t`
    const timestamp = colors.grey(`(${info.timestamp}):\t`)

    //
    // CLI format
    // [info]	 - IP query success	 (2020-10-12T00:32:44.735Z):	 123.123.123.123
    //
    const baseMsg = `${level} ${label} ${timestamp} ${info.message}`
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
  logError: logger.error,
}
