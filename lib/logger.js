const Factory = require('winston-simple-wrapper').Factory
const logger = new Factory({
  transports: [{
    type: 'console',
    level: 'info'
  }, {
    type: 'file',
    level: 'info',
    filename: 'log-output.log'
  }]
})

module.exports = logger