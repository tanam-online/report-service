exports.generateFile = async () => {
  console.log('file generated in X format')
}

/* exports.sendWorkbook = async (workbook, response) => {
	const date = new Date().getDate().
    const fileName = 'Laporan Lahan ' + new Date.get + '.xlsx';

    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader("Content-Disposition", "attachment; filename=" + fileName);

     await workbook.xlsx.write(response);

    response.end();
} */
