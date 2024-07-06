import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Handsontable from 'handsontable';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';

const SpreadsheetEditor5 = () => {
  const [data, setData] = useState([]);
  const [cellMeta, setCellMeta] = useState([]);
  const hotTableComponent = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

      setData(json);
      extractStyles(worksheet);
    };

    reader.readAsArrayBuffer(file);
  };

  const extractStyles = (worksheet) => {
    const styles = [];
    for (let cell in worksheet) {
      if (worksheet[cell].s) {
        const { s: style } = worksheet[cell];
        const row = XLSX.utils.decode_cell(cell).r;
        const col = XLSX.utils.decode_cell(cell).c;
        styles.push({ row, col, style });
      }
    }
    setCellMeta(styles);
  };

  useEffect(() => {
    if (hotTableComponent.current) {
      cellMeta.forEach(({ row, col, style }) => {
        const meta = hotTableComponent.current.hotInstance.getCellMeta(row, col);
        if (style.font) {
          if (style.font.color) {
            meta.renderer = (instance, td, ...rest) => {
              Handsontable.renderers.TextRenderer.apply(this, arguments);
              td.style.color = `#${style.font.color}`;
            };
          }
        }
        if (style.fill) {
          meta.renderer = (instance, td, ...rest) => {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            td.style.backgroundColor = `#${style.fill.fgColor.rgb}`;
          };
        }
        hotTableComponent.current.hotInstance.setCellMetaObject(row, col, meta);
      });
      hotTableComponent.current.hotInstance.render();
    }
  }, [cellMeta]);

  const downloadExcel = () => {
    const editedData = hotTableComponent.current.hotInstance.getData();
    const ws = XLSX.utils.aoa_to_sheet(editedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'updated.xlsx');
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={downloadExcel}>Download Updated Excel</button>
      <div id="hot-container">
        <HotTable ref={hotTableComponent} data={data} colHeaders={true} rowHeaders={true} contextMenu={true} minSpareRows={1} />
      </div>
    </div>
  );
};

export default SpreadsheetEditor5;
