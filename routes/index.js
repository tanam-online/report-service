var express = require('express')
var router = express.Router()
var axios = require('axios')
var Mail = require('../helper/mail')
var File = require('../helper/file')

/*
 * Download report endpoint.
 */
router.get('/download/:id', async (req, res) => {
	try {
  if (!req.params.id) {
  	return res.status(400).send({ status: 400, message: 'No id provided' })
  }
  if (!req.body.time_start || !req.body.time_end) {
  	const response = await axios.get(`http://api-monitoring-tanam.herokuapp.com/real-time/${id}/${lahan}`)
  }
  else {
  	const time_start = req.body.time_start
  	const time_end = req.body.time_end
    const response = await axios.get(`http://api-monitoring-tanam.herokuapp.com/real-time/${id}/${lahan}/${time_start}/${time_end}`)
  }
  const data = response.data[0]
  const result = await File.generateFile(data)
  const resultJson = {
  	status: result
  }
  res.send('file')
  } catch (err) {
    console.error(err)
    return res.status(500).send(err)
  }
})

/*
 * Send email endpoint.
 */
router.get('/send-email/:id', async (req, res) => {
	try {
  if (!req.params.id) {
  	return res.status(400).send({ status: 400, message: 'No id provided' })
  }
  const response = await axios.get(`http://api-user-tanam.herokuapp.com/users/${id}`)
  const user = response.data[0]
  const result = await Mail.sendEmail(user)
  const resultJson = {
  	status: result
  }
  res.send(result)
  } catch (err) {
    console.error(err)
    return res.status(500).send(err)
  }
})

module.exports = router
