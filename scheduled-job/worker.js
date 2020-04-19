require('dotenv').config()

var pool = require('./db/config')
var Email = require('../helper/email')

/*
 * Send email periodically.
 */
const sendEmailWorker = async () => {
  try {
    await Email.sendEmail()


    const client = await pool.connect()
    const lahans = await client.query('SELECT id FROM lahan;')
    const ids = (lahans) ? lahans.rows : null
    const cuacaEnum = ['cerah', 'berawan', 'hujan']
    ids.map(async id => {
      const payload = [
        id.id,
        Math.floor(Math.random() * 50),
        Math.floor(Math.random() * 50),
        Math.floor(Math.random() * 50),
        Math.floor(Math.random() * 50),
        Math.floor(Math.random() * 50),
        Math.floor(Math.random() * 50),
        cuacaEnum[Math.floor(Math.random() * 3)]
      ]
      await client.query(`INSERT INTO data_sensor (id_lahan, suhu, kelembaban_udara, tekanan_udara, kecepatan_angin, 
                          kelembaban_tanah, intensitas_cahaya, cuaca, waktu) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 
                          CURRENT_TIMESTAMP)`, payload)
    })
    console.log('Data updated at ' + new Date(Date.now()).toLocaleString())
    client.release()
  } catch (err) {
    console.error(err)
    console.log('Error: ' + err + ' at ' + new Date(Date.now()).toLocaleString())
  }
}

sendEmailWorker()
