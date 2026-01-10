import { AttendanceRecord } from '@/types/attendance';

export const exportToExcel = (data: AttendanceRecord[], filename: string = 'attendance-report') => {
  // Create CSV content
  const headers = ['Member Name', 'Event', 'Date', 'Status', 'Check-in Time', 'Group'];
  const csvContent = [
    headers.join(','),
    ...data.map(record => [
      record.memberName,
      record.eventName,
      record.date,
      record.status,
      record.checkInTime || '',
      record.group || ''
    ].join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async (data: AttendanceRecord[], filename: string = 'attendance-report') => {
  // For PDF export, we'll create a simple HTML table and trigger print
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Attendance Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .present { color: green; }
        .absent { color: red; }
        .late { color: orange; }
      </style>
    </head>
    <body>
      <h1>Attendance Report</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
      <table>
        <thead>
          <tr>
            <th>Member Name</th>
            <th>Event</th>
            <th>Date</th>
            <th>Status</th>
            <th>Check-in Time</th>
            <th>Group</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(record => `
            <tr>
              <td>${record.memberName}</td>
              <td>${record.eventName}</td>
              <td>${record.date}</td>
              <td class="${record.status}">${record.status}</td>
              <td>${record.checkInTime || '-'}</td>
              <td>${record.group || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for the content to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
};

export const generateSummaryStats = (data: AttendanceRecord[]) => {
  const totalRecords = data.length;
  const presentCount = data.filter(r => r.status === 'present').length;
  const absentCount = data.filter(r => r.status === 'absent').length;
  const lateCount = data.filter(r => r.status === 'late').length;
  
  const attendanceRate = totalRecords > 0 ? ((presentCount + lateCount) / totalRecords * 100).toFixed(1) : '0';
  
  const groupStats = data.reduce((acc, record) => {
    const group = record.group || 'Unknown';
    if (!acc[group]) {
      acc[group] = { total: 0, present: 0, absent: 0, late: 0 };
    }
    acc[group].total++;
    acc[group][record.status]++;
    return acc;
  }, {} as Record<string, { total: number; present: number; absent: number; late: number }>);

  return {
    totalRecords,
    presentCount,
    absentCount,
    lateCount,
    attendanceRate,
    groupStats
  };
};
