var express = require('express')
var router = express.Router()
var Email = require('../helper/email')

/*
 * Download report endpoint.
 */
router.get('/download', async (req, res) => {
  res.send('index')
})

/*
 * Send email endpoint.
 */
router.get('/send-email', async (req, res) => {
  await Email.sendEmail()
  res.send('index')
})

module.exports = router
