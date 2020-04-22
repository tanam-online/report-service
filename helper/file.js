exports.sendWorkbook = async (workbook, response, filename) => {
  response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  response.setHeader('Content-Disposition', 'attachment; filename=' + filename + '.xlsx')
  await workbook.xlsx.write(response)
  response.end()
}
