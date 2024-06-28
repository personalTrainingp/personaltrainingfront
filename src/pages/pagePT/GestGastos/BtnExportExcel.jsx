import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver'; // Para guardar el archivo generado
import { Button } from 'react-bootstrap'; // Importa un componente de botón de Bootstrap como ejemplo

export const ExportToExcel = ({data}) => {
  
  // Función para manejar la exportación a Excel
  const exportToExcel = async () => {
    // Crear un nuevo libro de trabajo Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Gastos filtrados');
    const worksheetDolares = workbook.addWorksheet('Gastos filtrados por dolares');
    const worksheetSoles = workbook.addWorksheet('Gastos filtrados por soles');
  // Filtrar datos por moneda
  
  data = data.map((e) => {
    return {
      id: e.id,
      fec_comprobante: new Date(e.fec_comprobante).getFullYear()===1900? '': e.fec_comprobante,
      Proveedores: e.tb_Proveedor?.razon_social_prov,
      gasto: e.tb_parametros_gasto?.nombre_gasto,
      descripcion: e.descripcion,
      fec_pago: e.fec_pago,
      moneda: e.moneda,
      banco: e.parametro_banco?.label_param,
      comprobante: e.parametro_comprobante?.label_param,
      forma_pago: e.parametro_forma_pago?.label_param,
      monto: e.monto?.toFixed(2),
    };
  });
  const dataDolares = data.filter(e => e.moneda === 'USD');
  const dataSoles = data.filter(e => e.moneda === 'PEN');
    // Datos de ejemplo
    // Definir estilos para las celdas
    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center' },
      border: { top: { style: 'thin' }, bottom: { style: 'thin' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCC00' } },
    };

    const cellStyle = {
      alignment: { horizontal: 'left' },
      border: { top: { style: 'thin' }, bottom: { style: 'thin' } },
    };
  // Definir columnas para las hojas de trabajo
  const columns = [
    { key: 'Proveedores', width: 50 },
    { key: 'gasto', width: 40 },
    { key: 'fec_pago', width: 20 },
    { key: 'descripcion', width: 50 },
    { key: 'moneda', width: 1 },
    { key: 'monto', width: 20 },
    { key: 'banco', width: 20 },
    { key: 'forma_pago', width: 50 },
    { key: 'fec_comprobante', width: 20 },
  ];

  worksheet.columns = columns;
  worksheetDolares.columns = columns;
  worksheetSoles.columns = columns;


  // Función para agregar datos a una hoja de trabajo
  const addDataToWorksheet = (worksheet, data) => {
    worksheet.addRow(['Proveedores', 'Gastos', "fecha de pago", "Descripcion", "banco", "forma_pago", "comprobante", "fecha de comprobante", "Moneda", "Monto"]).eachCell((cell) => {
      cell.fill = headerStyle.fill;
      cell.font = headerStyle.font;
      cell.alignment = headerStyle.alignment;
      cell.border = headerStyle.border;
    });

    data.forEach((row) => {
      worksheet.addRow([row.Proveedores, row.gasto, row.fec_pago, row.descripcion, row.banco, row.forma_pago, row.comprobante, row.fec_comprobante, row.moneda, row.monto]).eachCell((cell) => {
        cell.alignment = cellStyle.alignment;
        cell.border = cellStyle.border;
      });
    });
  };

  // Agregar datos a cada hoja de trabajo
  addDataToWorksheet(worksheet, data);
  addDataToWorksheet(worksheetDolares, dataDolares);
  addDataToWorksheet(worksheetSoles, dataSoles);

    // Generar el archivo Excel en formato Blob
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Guardar el archivo generado usando FileSaver.js (o similar)
    saveAs(blob, 'example.xlsx');
  };

  return (
    <div>
      <Button variant="success" onClick={exportToExcel}>Exportar Excel: {data.length} datos</Button>
    </div>
  );
};







// import { Button } from "react-bootstrap";
// import FileSaver from "file-saver";
// import * as XLSX from "xlsx";

// export const BtnExportExcel = ({ csvData, fileName}) => {
// 	// ******** XLSX with object key as header *************
//   // const fileType =
//   //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
//   // const fileExtension = ".xlsx";

//   // const exportToCSV = (csvData, fileName) => {
//   //   const ws = XLSX.utils.json_to_sheet(csvData);
//   //   const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
//   //   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//   //   const data = new Blob([excelBuffer], { type: fileType });
//   //   FileSaver.saveAs(data, fileName + fileExtension);
//   // };

//   csvData = csvData.map((e) => {
//     return {
//       'fecha_reg': e.fec_registro,
//       Proveedores: e.tb_Proveedor?.razon_social_prov,
//       'gasto': e.tb_parametros_gasto?.nombre_gasto,
//       Descripcion: e.descripcion,
//       Moneda: e.moneda,
//       Monto: e.monto,
//     };
//   });
//   // ******** XLSX with new header *************
//   const wscols = [
//     { wch: Math.max(...csvData.map(customer => customer.fecha_reg?.length)) },
//     { wch: Math.max(...csvData.map(customer => customer.Proveedores?.length)) },
//     { wch: Math.max(...csvData.map(customer => customer.gasto?.length)) },
//     { wch: Math.max(...csvData.map(customer => 100)) },
//     {
//       wch: Math.max(...csvData.map(customer => customer.Moneda.length))
//     },
//     {
//       wch: Math.max(...csvData.map(customer => customer.Monto.length))
//     }
//   ];
//   const fileType =
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
//   const fileExtension = ".xlsx";

//   const Heading = [
//     {
//       fecha_reg: "Fechaa de registro",
//       Proveedores: "Proveedores",
//       gasto: "Gastos",
//       Descripcion: "Descripcion",
//       moneda: "Moneda",
//       Moneda: "Monto"
//     }
//   ];

//   const exportToCSV = (csvData, fileName, wscols) => {
//     const ws = XLSX.utils.json_to_sheet(Heading, {
//       header: ["Fechaa de registro", "Proveedores", "Gastos", "Descripcion", "Moneda", "Monto"],
//       skipHeader: true,
//       origin: 0 //ok
//     });
//     ws["!cols"] = wscols;
//     const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
//     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     const data = new Blob([excelBuffer], { type: fileType });
//     FileSaver.saveAs(data, fileName + fileExtension);
//   };

//   return (
//     <Button
//       variant="warning"
//       onClick={e => exportToCSV(csvData, fileName, wscols)}
//     >
//       Export XLSX
//     </Button>
//   );
// };
