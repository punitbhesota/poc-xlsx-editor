import React, { useState } from 'react';
import ExcelJS from 'exceljs';

function SE4() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please upload a file first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const workbook = new ExcelJS.Workbook();

      try {
        await workbook.xlsx.load(arrayBuffer);

        // Make your updates here. For example, updating the first cell of the first sheet:
        const worksheet = workbook.getWorksheet(1);
        const cell = worksheet.getCell('A1');
        cell.value = 'Updated Value';

        // Save the updated workbook to a Blob
        const updatedWorkbook = await workbook.xlsx.writeBuffer();
        const blob = new Blob([updatedWorkbook], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Trigger a download of the updated file
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'updated_file.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error loading the workbook', error);
        alert('Error loading the workbook. Please ensure it is a valid .xlsx file.');
      }
    };

    reader.onerror = (error) => {
      console.error('FileReader error', error);
      alert('Error reading the file.');
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={!file}>
        Upload and Update Excel File
      </button>
    </div>
  );
}

export default SE4;
