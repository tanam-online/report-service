require('dotenv').config()

var axios = require('axios')
var Mail = require('../helper/mail')

/*
 * Send email periodically.
 */
const sendEmailWorker = async () => {
  try {
    const response = await axios.get('http://api-user-tanam.herokuapp.com/users')
    const users = response.data
    users.map(async user => {
      await Mail.sendEmail(user)
    })
    console.log('Daily report sent at ' + new Date(Date.now()).toLocaleString())
  } catch (err) {
    console.error(err)
    console.log('Error: ' + err + ' at ' + new Date(Date.now()).toLocaleString())
  }
}

sendEmailWorker()
