/**
 * Hàm xuất dữ liệu ra file CSV chuẩn UTF-8 (có BOM cho Excel tiếng Việt không lỗi font)
 * @param {string} filename - Tên file tải về (không kèm đuôi .csv)
 * @param {Array<string>} headers - Danh sách tiêu đề các cột
 * @param {Array<Array<any>>} rows - Dữ liệu các dòng
 */
export function exportToCSV(filename, headers, rows) {
  const csvContent = '\uFEFF' + [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('link')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
