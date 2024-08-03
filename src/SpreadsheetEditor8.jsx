import React, { useEffect, useRef, useState } from "react";
import { Workbook } from "@fortune-sheet/react";
import ExcelJS from "exceljs";
import "@fortune-sheet/react/dist/index.css"
import LuckyExcel from "luckyexcel";

const SpreadsheetEditor8 = () => {
  const ref = useRef();
  const [sheetData, setSheetData] = useState([]);
  const [mergeInfo, setMergeInfo] = useState();

  useEffect(() => {
    if (ref && ref.current) {
      console.log(ref.current.getAllSheets());
      if (sheetData.length > 0) {
        setMergeInfo(sheetData[0].config.merge);
      }
    }
  }, [sheetData]);

  useEffect(() => {
    if(mergeInfo) {
      Object.keys(mergeInfo).forEach(key => {
        const merge = mergeInfo[key]
        const startCellAddressR = merge.r
        const startCellAddressC = merge.c
        const endCellAddressR = merge.r + merge.rs - 1
        const endCellAddressC = merge.c + merge.cs - 1
        if(ref && ref.current) {
          console.log("MERGING CELL")
          ref.current.mergeCells([
            {row: [startCellAddressR, endCellAddressR], column: [startCellAddressC, endCellAddressC]}
          ], 'merge-horizontal')
        }
      })
    }
  }, [mergeInfo])

  const handleFileUpload = async (event) => {
    const input = event.target;
    if (!input.files?.length) {
      return;
    }
    const file = input.files[0];
    let dropdownInfo = null

    const reader = new FileReader();
    reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const workbook = new ExcelJS.Workbook();
        try {
          await workbook.xlsx.load(arrayBuffer);
          const worksheet = workbook.getWorksheet(1);
          dropdownInfo = worksheet.dataValidations.model
          LuckyExcel.transformExcelToLucky(
            file,
            function (exportJson, luckysheetfile) {
              const sheets = exportJson.sheets
              for(let sheet of sheets) {
                  if(dropdownInfo && Object.keys(dropdownInfo).length > 0) {
                      const dataVerification = {}
                      for(let key of Object.keys(dropdownInfo)) {
                          const value = dropdownInfo[key]
                          if(value.type === 'list') {
                              const splited = key.split('')
                              const col_ = splited[0].charCodeAt(0) - 65
                              const row_ = Number(splited[1]) - 1
                              const f_key = `${row_}_${col_}`
                              dataVerification[f_key] = {
                                  type : "dropdown",
                                  type2 : "",
                                  rangeTxt : key,
                                  value1 : value.formulae[0].replace(/["']/g, ""),
                                  value2 : "",
                                  validity : "",
                                  remote : false,
                                  prohibitInput : true,
                                  hintShow : false,
                                  hintValue : "",
                                  checked : false
                              }
                          }
                      }
                      sheet.dataVerification = dataVerification
                  }
              }
              setSheetData(sheets);
            }
          );
        } catch (error) {
          console.error('Error loading the workbook', error);
          alert('Error loading the workbook. Please ensure it is a valid .xlsx file.');
        }
      };

    reader.readAsArrayBuffer(file);
  };
  return (
      <div style={{ height: "100vh" }}>
        {sheetData.length > 0 ? (
          <>
            <Workbook ref={ref} data={[...sheetData]} />
            <button >Export</button>
          </>
        ) : (
          <input type="file" onChange={handleFileUpload} />
        )}
      </div>
  );
};

export default SpreadsheetEditor8;
