require('dotenv').config()

var axios = require('axios')
var Mail = require('../helper/mail')

/*
 * Send email periodically.
 */
const sendEmailWorker = async () => {
  try {
    const responseUsers = await axios.get('http://api-user-tanam.herokuapp.com/users')
    const users = responseUsers.data.data
    users.map(async user => {
      const responseLands = await axios.get(`http://api-land-tanam.herokuapp.com/lands/by-user/${user.id}`)
      const lands = responseLands.data.data
      await Mail.sendEmail(user, lands)
    })
    console.log('Daily report sent at ' + new Date(Date.now()).toLocaleString())
  } catch (err) {
    console.error(err)
    console.log('Error: ' + err + ' at ' + new Date(Date.now()).toLocaleString())
  }
}

sendEmailWorker()
