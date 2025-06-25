export function generateCSV(data: any[]): string {
  if (data.length === 0) return ""

  const headers = ["Date", "Student Name", "Student ID", "Grade", "Status"]
  const csvContent = [
    headers.join(","),
    ...data.map((record) =>
      [record.date, `"${record.studentName}"`, record.studentId || "N/A", record.grade || "N/A", record.status].join(
        ",",
      ),
    ),
  ].join("\n")

  return csvContent
}

export function generatePDF(data: any[]): void {
  // In a real application, you would use a library like jsPDF or Puppeteer
  // For this demo, we'll create a simple HTML version and trigger print

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Attendance Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header { text-align: center; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Attendance Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Student Name</th>
            <th>Student ID</th>
            <th>Grade</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (record) => `
            <tr>
              <td>${record.date}</td>
              <td>${record.studentName}</td>
              <td>${record.studentId || "N/A"}</td>
              <td>${record.grade || "N/A"}</td>
              <td>${record.status}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </body>
    </html>
  `

  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
  }
}
