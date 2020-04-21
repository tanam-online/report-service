var sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.sendEmail = async (user, lands) => {
  let html = `<p>Halo, ${user.nama}! Berikut adalah laporan lahan Anda untuk hari ini.</p>
                <p>Klik tautan berikut:`
  lands.map(land => {
    html += `<br><a href="http://api-report-tanam.herokuapp.com/download/${land.id}" target="_blank">
               Unduh file laporan ${land.nama}
             </a>`
  })
  html += '</p>'
  const msg = {
    to: user.email,
    from: {
      email: 'report@tanam.online',
      name: 'Report Service Tanam'
    },
    subject: 'Laporan Harian Lahan Anda',
    html: html
  }
  await sgMail.send(msg)
  return 'Email sent succcessfully'
}
