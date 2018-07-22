const debug = require('debug')('telegraf:webhook')

module.exports = function (hookPath, updateHandler, errorHandler) {
  return (req, res, next) => {
    debug('Incoming request', req.method, req.url)
    if (req.method !== 'POST' || req.url !== hookPath) {
      if (typeof next === 'function') {
        return next()
      }
      res.statusCode = 403
      return res.end()
    }
    const update = req.body
    updateHandler(update, res)
      .then(() => {
        if(!res.finished) {
          res.end()
        }
      })
      .catch(err => {
        debug('Webhook error', err)
        res.writeHead(500)
        res.end()
      })
  }
}
