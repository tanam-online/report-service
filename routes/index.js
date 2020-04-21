var express = require('express')
var router = express.Router()
var axios = require('axios')
var Excel = require('exceljs')
// require('core-js/modules/es.promise');
// require('core-js/modules/es.object.assign');
// require('core-js/modules/es.object.keys');
// require('regenerator-runtime/runtime');
// npm install core-js/modules/es.promise core-js/modules/es.object.assign core-js/modules/es.object.keys regenerator-runtime/runtime
//var Excel = require('exceljs/dist/es5')
var Mail = require('../helper/mail')
var File = require('../helper/file')

/*
 * Check if API is live.
 */
router.get('/', (req, res) => {
  res.send('You are connected')
})


router.get('/test', async (req, res) => {
  var Excel = require('exceljs');
  var workbook = new Excel.Workbook();
  var worksheet = workbook.addWorksheet('My Sheet');
  worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 32 },
      { header: 'D.O.B.', key: 'DOB', width: 10 }
  ];
  worksheet.addRow({id: 1, name: 'John Doe', dob: new Date(1970,1,1)});
  worksheet.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965,1,7)});
  //workbook.commit();
  /*workbook.xlsx.writeFile('./temp.xlsx').then(function() {
      // done
      console.log('file is written');
  });
*/
  async function sendWorkbook(workbook, response) { 
    var fileName = 'FileName.xlsx';

    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader("Content-Disposition", "attachment; filename=" + fileName);

     await workbook.xlsx.write(response);

    response.end();
  }
  await sendWorkbook(workbook, res)
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
    const result = await File.generateFile(data)

    const date = new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear()
    const fileName = 'Laporan_Lahan_' + req.params.landId + '_' + date + '.xlsx'

    // res.writeHead(200, {
    // 'Content-Disposition': 'attachment; filename=' + fileName,
    // 'Transfer-Encoding': 'chunked',
    // 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    // })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName)

    let workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res })
    let worksheet = workbook.addWorksheet('Sheet Laporan')
    console.log(worksheet)
    worksheet.addTable = {
      name: 'Report',
      ref: 'A1',
      headerRow: true,
      totalsRow: true,
      style: {
        theme: 'TableStyleDark3',
        showRowStripes: true
      },
      columns: [
        { name: 'Date', totalsRowLabel: 'Totals:', filterButton: true },
        { name: 'Amount', totalsRowFunction: 'sum', filterButton: false }
      ],
      rows: [
        [new Date('2019-07-20'), 70.10],
        [new Date('2019-07-21'), 70.60],
        [new Date('2019-07-22'), 70.10]
      ]
    }
    console.log(worksheet)
    //console.log(respSheet)
    // worksheet.addRow(['foo', 'bar']).commit()
    // await worksheet.commit()
    // await workbook.commit()

    // var workbook = new Excel.Workbook();
    // var worksheet = workbook.addWorksheet('Sheet Laporan');

    // worksheet.columns = [
    //     { header: 'Id', key: 'id', width: 10 },
    //     { header: 'Name', key: 'name', width: 32 },
    //     { header: 'D.O.B.', key: 'DOB', width: 10 }
    // ];
    // worksheet.addRow({id: 1, name: 'John Doe', dob: new Date(1970,1,1)});
    // worksheet.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965,1,7)});

    // var tempFilePath = tempfile('.xlsx');
    // workbook.xlsx.writeFile(tempFilePath).then(function() {
    //     console.log('file is written');
    //     res.sendFile(tempFilePath, function(err){
    //         console.log('---------- error downloading file: ' + err);
    //     });
    // });


    console.log(res)

    // worksheet.commit()
    // workbook.commit()

    await workbook.xlsx.write(res)

    res.end();
    const resultJson = {
      status: 'Laporan has been downloaded'
    }
    //res.write(chunk)
    // res.send(resultJson)
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
