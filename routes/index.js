var express = require('express')
var router = express.Router()
var axios = require('axios')
var Mail = require('../helper/mail')
var File = require('../helper/file')

/*
* Download report endpoint.
*/
router.get('/download/:id/:land/:timeStart/:timeEnd', async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send({ status: 400, message: 'No id provided' })
    }
    let response
    if (!req.params.timeStart || !req.params.timeEnd) {
      response = await axios.get(`http://api-monitoring-tanam.herokuapp.com/real-time/${req.params.id}/${req.params.land}`)
    } else {
      response = await axios.get(`http://api-monitoring-tanam.herokuapp.com/real-time/${req.params.id}/${req.params.land}/${timeStart}/${timeEnd}`)
    }
    const data = response.data[0]
    const result = await File.generateFile(data)
    /* const resultJson = {
      status: result
    } */
    res.send(result)
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
    const response = await axios.get(`http://api-user-tanam.herokuapp.com/users/${req.params.id}`)
    const user = response.data[0]
    const result = await Mail.sendEmail(user)
    const resultJson = {
      status: result
    }
    res.send(resultJson)
  } catch (err) {
    console.error(err)
    return res.status(500).send(err)
  }
})

module.exports = router
