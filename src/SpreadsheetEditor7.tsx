'use client'
import 'regenerator-runtime/runtime'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Workbook } from '@fortune-sheet/react'
import {} from "@fortune-sheet/core";
import "@fortune-sheet/react/dist/index.css"
//@ts-ignore
import LuckyExcel from 'luckyexcel'
import Exceljs from "exceljs"
import { getDriveId, getDriveItems, getSiteId, getToken } from './apis';
import Stream from "stream"

const Spreadsheet = () => {
  const ref = useRef<any>()
  const [sheetData, setSheetData] = useState<any>([])
  const [driveItems,setDriveItems] = useState([])
  const [mergeInfo, setMergeInfo] = useState()
  const [newData, setNewData] = useState()

  useEffect(() => {
    if (ref && ref.current) {
      console.log(ref.current.getAllSheets())
      if(sheetData.length > 0) {
        setMergeInfo(sheetData[0].config.merge)
      }
    }
  }, [sheetData])


  useEffect(() => {
    if(mergeInfo) {
      Object.keys(mergeInfo).forEach(key => {
        const merge: any = mergeInfo[key]
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

  const convertExport = () => {
    console.log("CALLED", ref.current.getAllSheets()[0].data)
    LuckyExcel.transformLuckyToExcel(ref.current.getAllSheets(), (exportJson, luckysheetfile) => {
      console.log("🚀 ~ LuckyExcel.transformLuckyToExcel ~ luckysheetfile:", luckysheetfile)
      console.log("🚀 ~ LuckyExcel.transformLuckyToExcel ~ exportJson:", exportJson)
    })
  }

  const onChangeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    if (!input.files?.length) {
      return;
    }
    const file = input.files[0];
    const workbook = new Exceljs.Workbook();
    await workbook.xlsx.readFile("/Users/ayushagrawal/Documents/Eqaim/excel/poc-xlsx-editor/src/spread.xlsx");
    const sheet = workbook.getWorksheet("Sheet 1");
    console.log("🚀 ~ onChangeHandler ~ sheet:", sheet)
    //@ts-ignore
    LuckyExcel.transformExcelToLucky(file, function(exportJson, luckysheetfile) {
      console.log("====", exportJson.sheets)
      setSheetData(exportJson.sheets)
      console.log("🚀 ~ LuckyExcel.transformExcelToLucky ~ exportJson.sheets:", exportJson.sheets)

      // Read dropdown options and merged cells
      exportJson.sheets.forEach((sheet: any) => {
        const { data, config } = sheet

        // Read dropdown options
        data.forEach((row: any, rowIndex: number) => {
          row.forEach((cell: any, colIndex: number) => {
            if (cell.dv) {
              const cellAddress = `${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`
              console.log(`Cell: ${cellAddress} - Dropdown options: ${cell.dv}`)
            }
          })
        })

        // Read merged cells
        if (config && config.merge) {
          const mergedCells = config.merge
          Object.keys(mergedCells).forEach(key => {
            const merge = mergedCells[key]
            const startCellAddress = `${String.fromCharCode(65 + merge.c)}${merge.r + 1}`
            const endCellAddress = `${String.fromCharCode(65 + merge.c + merge.cs - 1)}${merge.r + merge.rs}`
            console.log(`Merged Cell: ${startCellAddress} to ${endCellAddress}`)
          })
        }
      })
    });
  }

  // const fetchDriveItems = async () => {
  //   const token = await getToken();
  //   if(token){
  //     const siteId = await getSiteId(token);
  //     if(siteId){
  //       const driveId = await getDriveId(token, siteId);
  //       if(driveId){
  //         const driveItems = await getDriveItems(token,driveId);
  //         setDriveItems(driveItems)
  //       }
  //     }
  //   }
  // };

  // useEffect(() => {
  //   fetchDriveItems();
  // }, []);


  // const handleJsonToExcel = () => {
  //   const xlsx = require("xlsx")//npm install xlsx
  //   const fs = require("fs")//npm install fs
  //   var rawFile = fs.readFileSync("./datas.json")//dir of your json file as param
  //   var raw = JSON.parse(rawFile)
  //   var files  = []
  //   for (each in raw){
  //       files.push(raw[each])
  //       }  
  //     var obj = files.map((e) =>{
  //           return e
  //         })

  //     var newWB = xlsx.book_new()

  //     var newWS = xlsx.utils.json_to_sheet(obj)

  //     xlsx.utils.book_append_sheet(newWB,newWS,"name")//workbook name as param

  //     xlsx.writeFile(newWB,"Sample-Sales-Data.xlsx")
  // }
  return (
    <div style={{height: '100vh'}}>
      {sheetData.length > 0 ? <>
        <Workbook ref={ref} data={[...sheetData]} />
        <button onClick={convertExport}>Export</button>
      </> : <input type="file" onChange={onChangeHandler} />}
    </div>
  )
}

export default Spreadsheet
