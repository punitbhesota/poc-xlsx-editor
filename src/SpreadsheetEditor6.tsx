'use client'
import 'regenerator-runtime/runtime'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Workbook } from '@fortune-sheet/react'
import {} from "@fortune-sheet/core";
import "@fortune-sheet/react/dist/index.css"
//@ts-ignore
import LuckyExcel from 'luckyexcel'

const Spreadsheet = () => {
  const ref = useRef<any>()
  const [sheetData, setSheetData] = useState([])
  useEffect(() => {
    if(ref && ref.current) {
      console.log(ref.current.getAllSheets())
      }
  })

  const l: any = {'0_0' : {r: 0, c: 0, rs: 1, cs: 2}, '1_0': {r: 1, c: 0, rs: 1, cs: 4}}

  for(let item of Object.values(l)) {
    console.log(item)
  }

  const onChangeHandler = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
        return;
    }
    const file = input.files[0];
    console.log(file);
    //@ts-ignore
    LuckyExcel.transformExcelToLucky(file, function(exportJson, luckysheetfile){
      console.log("====", exportJson.sheets)
      setSheetData(exportJson.sheets)
    });
  }

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
          <button>Export</button>
        </> : <input type="file" onChange={onChangeHandler} />}
    </div>
  )
}

export default Spreadsheet