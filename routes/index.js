var express = require('express')
var router = express.Router()
var axios = require('axios')
var Excel = require('exceljs')
var Mail = require('../helper/mail')
var File = require('../helper/file')

/*
 * Check if API is live.
 */
router.get('/', (req, res) => {
  res.send('You are connected')
})

/*
* Download report endpoint.
*/
router.get('/download/:landId/:timeStart?/:timeEnd?', async (req, res) => {
  try {
    if (!req.params.landId) {
      return res.status(400).send({ status: 400, message: 'No landId provided' })
    }
    /* let response
    if (!req.params.timeStart || !req.params.timeEnd) {
      response = await axios.get(`http://api-dashboard-tanam.herokuapp.com/real-time/${req.params.landId}`)
    } else {
      response = await axios.get(`http://api-dashboard-tanam.herokuapp.com/real-time/${req.params.landId}/${req.params.timeStart}/${req.params.timeEnd}`)
    } */
    const response = await axios.get(`http://api-dashboard-tanam.herokuapp.com/real-time/${req.params.landId}`)
    const data = response.data.data
    if (!data || data.length === 0) {
      return res.status(400).send({ status: 400, message: 'There is no data' })
    }
    const date = new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear()
    const filename = 'Laporan_Lahan_' + req.params.landId + '_' + date
    var workbook = new Excel.Workbook()
    var worksheet = workbook.addWorksheet('Sheet Laporan')
    worksheet.addRow(['Rekap Laporan Lahan ' + req.params.landId + ' ' + date])
    worksheet.mergeCells('A1', 'F1')
    worksheet.columns = [
      { key: 'A', width: 15 },
      { key: 'B', width: 15 },
      { key: 'C', width: 15 },
      { key: 'D', width: 15 },
      { key: 'E', width: 15 },
      { key: 'F', width: 25 }
    ]
    worksheet.addRow(['Rata-rata', 'Suhu (C)', 'Kelembaban (%)', 'Cahaya (Cd/m2)', 'Angin (m/s)', 'Cuaca'])
    worksheet.addRow([
      'Rata-rata', data.average.suhu, data.average.kelembaban,
      data.average.cahaya, data.average.angin, data.average.cuaca
    ])
    worksheet.mergeCells('A2', 'A3')
    worksheet.addRow(['Suhu (C)', 'Kelembaban (%)', 'Cahaya (Cd/m2)', 'Angin (m/s)', 'Cuaca', 'Waktu (GMT)'])
    data.sensor_data.map(item => {
      worksheet.addRow([
        item.suhu, item.kelembaban, item.cahaya,
        item.angin, item.cuaca, item.waktu
      ])
    })
    await File.sendWorkbook(workbook, res, filename)
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
