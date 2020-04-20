/*var helper = require('sendgrid').mail;
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);*/
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = (recipient) => {
/*var from_email = new helper.Email('report@tanam.com');
var to_email = new helper.Email(receiver);
var subject = 'Laporan Harian Lahan Anda';
var content = new helper.Content('html', '<p>Halo sahabat Tanam! Berikut adalah laporan lahan Anda untuk hari ini.</p><p>Klik tombol ini: <button href="linkToDownloadExcelFile" target="_blank">Unduh file laporan</button></p>');
var mail = new helper.Mail(from_email, subject, to_email, content);
var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON(),
});
await sg.API(request, (error, response) => {
  console.log(response.statusCode);
  console.log(response.body);
  console.log(response.headers);
});*/
const msg = {
  to: recipient.email,
  from: 'report@tanam.online',
  subject: 'Laporan Harian Lahan Anda',
  //text: 'Hello plain world!',
  html: `<p>Halo, ${recipient.name}! Berikut adalah laporan lahan Anda untuk hari ini.</p><br><p>Klik tombol berikut: <button href="http://api-report-tanam.herokuapp.com/download/${recipient.id}" target="_blank">Unduh file laporan</button></p>`,
};
const result = await sgMail.send(msg);
console.log(result)
return result
}