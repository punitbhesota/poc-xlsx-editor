// src/components/SpreadsheetEditor.js

import React, { useState, useRef } from 'react';
import Handsontable from 'handsontable';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const SpreadsheetEditor = () => {
  const [data, setData] = useState([]);
  const hotTableComponent = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryString = e.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
      setData(worksheet);
    };

    reader.readAsBinaryString(file);
  };

  

  const handleFileDownload = () => {
    const hot = hotTableComponent.current.hotInstance;
    const updatedData = hot.getData();
    const worksheet = XLSX.utils.aoa_to_sheet(updatedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'updated_spreadsheet.xlsx');
  };

  const paddedData = data.map(row => (
    row.length < 10 ? [...row, ...Array(10- row.length).fill('')] : row
  ));
  console.log("hello",data)

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {data.length > 0 && (
        <HotTable
          data={paddedData}
          colHeaders={true}
          rowHeaders={true}
          width="800"
          height="400"
          ref={hotTableComponent}
          licenseKey="non-commercial-and-evaluation"
          fixedColumnsLeft={10} 
        />
      )}
      <button onClick={handleFileDownload}>Download Updated File</button>
    </div>
  );
};

export default SpreadsheetEditor;
