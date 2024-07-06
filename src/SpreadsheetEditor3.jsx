import React, { useState } from 'react';
import ExcelJS from 'exceljs';

function SpreadsheetEditor3() {
  const [workbook, setWorkbook] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleUpload = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target.result;
      const workbook = new ExcelJS.Workbook();
      workbook.xlsx.readBuffer(buffer).then(() => {
        setWorkbook(workbook);
      });
    };
    reader.readAsArrayBuffer(file);
  };


  const handleDownload = async () => {
    if (!workbook) {
      alert('Please upload an XLSX file first.');
      return;
    }

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });


    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName || 'updated_data.xlsx';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div>
      <input type="file" accept=".xlsx" onChange={handleUpload} />
      <button onClick={handleDownload} disabled={!workbook}>Download Updated File</button>
    </div>
  );
}

export default SpreadsheetEditor3;
