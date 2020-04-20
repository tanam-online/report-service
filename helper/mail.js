var sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.sendEmail = async (recipient) => {
  const msg = {
    to: recipient.email,
    from: 'report@tanam.online',
    fromname: 'Report Service Tanam',
    subject: 'Laporan Harian Lahan Anda',
    html: `<p>Halo, ${recipient.name}! Berikut adalah laporan lahan Anda untuk hari ini.</p>
      <p>Klik tautan berikut: 
        <a href="http://api-report-tanam.herokuapp.com/download/${recipient.id}" target="_blank">
          Unduh file laporan
        </a>
      </p>`
  }
  const result = await sgMail.send(msg)
  console.log(result)
  return result
}
