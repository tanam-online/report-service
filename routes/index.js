var express = require('express')
var router = express.Router()
var axios = require('axios')
var Mail = require('../helper/mail')
var File = require('../helper/file')

/*
* Download report endpoint.
*/
router.get('/download/:landId/:timeStart?/:timeEnd?', async (req, res) => {
  try {
    if (!req.params.landId) {
      return res.status(400).send({ status: 400, message: 'No landId provided' })
    }
    let response
    if (!req.params.timeStart || !req.params.timeEnd) {
      response = await axios.get(`http://api-monitoring-tanam.herokuapp.com/real-time/${req.params.landId}`)
    } else {
      response = await axios.get(`http://api-monitoring-tanam.herokuapp.com/real-time/
                                  /${req.params.landId}/${req.params.timeStart}/${req.params.timeEnd}`)
    }
    const data = response.data.data[0]
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
    const responseUser = await axios.get(`http://api-user-tanam.herokuapp.com/users/${req.params.id}`)
    const user = responseUser.data.data[0]
    if (!user || user.length === 0) {
      return res.status(400).send({ status: 400, message: 'User not found' })
    }
    const responseLands = await axios.get(`http://api-land-tanam.herokuapp.com/lands/by-user/${req.params.id}`)
    const lands = responseLands.data.data
    if (!lands || lands.length === 0) {
      return res.status(400).send({ status: 400, message: 'User has no land' })
    }
    const result = await Mail.sendEmail(user, lands)
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
