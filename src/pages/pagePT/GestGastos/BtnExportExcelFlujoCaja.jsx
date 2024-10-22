import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver'; // Para guardar el archivo generado
import { Button } from 'primereact/button';
import { useVentasStore } from '@/hooks/hookApi/useVentasStore';
import { useAportesIngresosStore } from '@/hooks/hookApi/useAportesIngresosStore';
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore';
import dayjs from 'dayjs';

export const BtnExportExcelFlujoCaja = ({id_empresa, dataGastos, dataTipoCambio, dataAporte, dataVentas, fechaInit}) => {

  dataGastos = dataGastos.filter(f=>f.tb_parametros_gasto?.id_empresa===id_empresa)
  // const prueba = dataGastos.filter(f=>f.tb_parametros_gasto?.id===686)
  dataVentas = dataVentas.map(v=>{
    return {
      fecha_venta: v.fecha_venta,
      detalle_ventaMembresia: v.detalle_ventaMembresia,
      detalle_ventaCitas: v.detalle_ventaCitas,
      detalle_ventaProductos: v.detalle_ventaProductos,
    }
  })
  dataVentas = dataVentas.map((e) => {
    // Filtrar productos con id_categoria igual a 17
    const productosFiltradosAcc = e.detalle_ventaProductos.filter(
      (item) => item.tb_producto.id_categoria === 17
    );
    const productosFiltradosSup = e.detalle_ventaProductos.filter(
      (item) => item.tb_producto.id_categoria === 18
    );
    const NutFiltrados = e.detalle_ventaCitas.filter(
      (item) => item.tb_servicio.tipo_servicio === 'NUTRI'
    );
    const TratEsteticoFiltrados = e.detalle_ventaCitas.filter(
      (item) => item.tb_servicio.tipo_servicio === 'FITOL'
    );
    return {
      detalle_membresia: e.detalle_ventaMembresia,
      detalle_prodAccesorios: productosFiltradosAcc,
      detalle_prodSuplementos: productosFiltradosSup,
      detalle_cita_tratest: TratEsteticoFiltrados,
      detalle_cita_nut: NutFiltrados,
      fecha_venta: e.fecha_venta,
    };
  });
  dataGastos = dataGastos.map(eg=>{
    const tipoCambio = dataTipoCambio.find(tc=> tc.fecha === eg.fec_pago&&eg.moneda==='USD')
    if (tipoCambio) {
      return {
        ...eg,
        moneda: 'PEN',
        monto: eg.monto * parseFloat(tipoCambio.precio_venta)
      }
    }
    return eg;
  })
  dataTipoCambio = dataTipoCambio.map(tc=>{
    return {
      moneda: tc.moneda,
      precio_venta: tc.precio_venta,
      fecha: tc.fecha
    }
  })
  // console.log(prueba.map(e=>{return {fec_comprobante: e.fec_comprobante, id: e.id, desc: e.descripcion, monto: e.monto, prov: e.tb_Proveedor.razon_social_prov}}));
  


  // console.log(agruparPorMes(dataVentas));
  
  function agruparPorNombreGasto(data) {
    const groupedData = data.reduce((acc, item) => {
      // const mes = item.fec_pago.getMonth() + 1; // Obtener el mes (de 0 a 11)
      
      const nombre_gasto = item.tb_parametros_gasto?.nombre_gasto;
  
      const existingGroup = acc.find(group => 
        // group.mes === mes && 
        group.nombre_gasto === nombre_gasto);
        
        if (existingGroup) {
          existingGroup.data.push(item);
          // existingGroup.monto_total += item.monto;

      } else {
          acc.push({ nombre_gasto,  data: [item] });
      }
  
      return acc;
  }, []);
  return groupedData;
  }
  function agruparPorMesYMoneda(data) {
    return data.reduce((acc, item) => {
      const mes = new Date(item?.fec_comprobante)?.toISOString().slice(5, 7); // Extraer el mes en formato 'MM'
      const { moneda, monto } = item;
  
      let mesGroup = acc.find(group => group.mes === mes);
      if (!mesGroup) {
        mesGroup = { mes, monto: [] };
        acc.push(mesGroup);
      }
      let monedaGroup = mesGroup.monto.find(m => m.moneda === moneda);
      if (!monedaGroup) {
        monedaGroup = { moneda, monto_total: 0 };
        mesGroup.monto.push(monedaGroup);
      }
  
      monedaGroup.monto_total += monto;
  
      return acc;
    }, []);
  }
  
  
  function agruparPorMesYGrupo(data) {
    // Agrupar los datos por mes y grupo
    const agrupado = data.reduce((result, item) => {
      // const mes = obtenerMes(item.fec_pago);
      const grupo = item.tb_parametros_gasto?.grupo;
      
      // Buscar si ya existe una entrada para la combinación de mes y grupo
      let mesGrupoExistente = result.find(mesGrupo => 
        mesGrupo?.grupo === grupo
      );
  
      if (mesGrupoExistente) {
        // Si ya existe, agrega el item al array `data`
        mesGrupoExistente.data.push(item);
      } else {
        // Si no existe, crea una nueva entrada en el resultado
        result.push({
          // mes: mes,
          grupo: grupo,
          data: [item]
        });
      }
  
      return result;
    }, []);
  
    // Ordenar el resultado por mes y grupo
    return agrupado.sort((a, b) => {
      if (a.mes !== b.mes) {
        return a?.mes?.localeCompare(b.mes);
      }
      return a?.grupo?.localeCompare(b.grupo);
    });
  }
  function agruparPorMesEnGastos(data) {
    return data.filter(c=>c.n_comprabante?.length>4).reduce((acc, curr) => {
        const mes = curr.fec_pago.slice(5, 7); // Obtiene el año y mes en formato 'YYYY-MM'
        const found = acc.find(item => item.mes === mes);
    
        if (found) {
            found.monto += curr.monto;
        } else {
            acc.push({ mes, monto: curr.monto, data:[acc] });
        }
    
        return acc;
    }, []);
  }
  function EncontrarElItemDeGastoPorMes(mes) {
    
    return agruparPorMesEnGastos(dataGastos).find(item => item.mes === mes)?agruparPorMesEnGastos(dataGastos).find(item => item.mes === mes).monto:0
  }
  function IgvCompras(mes) {
    const sumaCompra = EncontrarElItemDeGastoPorMes(mes)
    const baseIGV = (sumaCompra/1.18)
    const igvCompra = baseIGV*0.18
    return igvCompra
  }

  // console.log(agruparPorMesEnGastos(dataGastos));
  const exportToExcel = async () => {
    // Crear un nuevo libro de trabajo Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Gastos filtrados');
    const worksheetTipoCambio = workbook.addWorksheet('Tipo de cambio');
  // Filtrar datos por moneda
  
  const dataGastos2 = agruparPorMesYGrupo(dataGastos).map((e) => {
    return {
      grupo: e.grupo,
      dataConceptos: agruparPorNombreGasto(e.data)
    };
  });
  
    // Datos de ejemplo
    // Definir estilos para las celdas
    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center' },
      border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCC00' } },
    };

    const cellStyle = {
      alignment: { horizontal: 'left' },
      border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
    };
    const yellowFillStyle = {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCC00' } },
    };
  // Definir columnas para las hojas de trabajo
  const columns = [
    { key: '', width: 20},
    { key: 'ENERO', width: 10 },
    { key: 'FEBRERO', width: 10 },
    { key: 'MARZO', width: 10 },
    { key: 'ABRIL', width: 10 },
    { key: 'MAYO', width: 10 },
    { key: 'JUNIO', width: 8 },
    { key: 'JULIO', width: 10 },
    { key: 'AGOSTO', width: 10 },
    { key: 'SEPTIEMBRE', width: 15 },
    { key: 'OCTUBRE', width: 15 },
    { key: 'NOVIEMBRE', width: 15 },
    { key: 'DICIEMBRE', width: 15 },
    { key: '[PORCENTAJE]', width: 15 },
  ];

  worksheet.columns = columns;
  worksheetTipoCambio.columns = columns;

  function filtrarXmes(data, mes) {
    return agruparPorMesYMoneda(data).filter(f=>f.mes===mes)[0]?.monto[0].monto_total
  }
  function filtrarXmes_PROGRAMA(data, mes) {
    return agruparPorMes(data)[0].data.find(f=>f.mes===mes)?agruparPorMes(data)[0].data.find(f=>f.mes===mes).monto_total:0
  }
  function filtrarXmes_ACCESORIO(data, mes) {
    return agruparPorMes(data)[1].data.find(f=>f.mes===mes)?agruparPorMes(data)[1].data.find(f=>f.mes===mes).monto_total:0
  }
  function filtrarXmes_SUPLEMENTOS(data, mes) {
    return agruparPorMes(data)[2].data.find(f=>f.mes===mes)?agruparPorMes(data)[2].data.find(f=>f.mes===mes).monto_total:0
  }
  function filtrarXmes_NUTRI(data, mes) {
    return agruparPorMes(data)[3].data.find(f=>f.mes===mes)?agruparPorMes(data)[3].data.find(f=>f.mes===mes).monto_total:0
  }
  function filtrarXmes_TRAT(data, mes) {
    return agruparPorMes(data)[4].data.find(f=>f.mes===mes)?agruparPorMes(data)[4].data.find(f=>f.mes===mes).monto_total:0
  }
  function SumaTotalEnVentasxMes(mes) {
    return filtrarXmes_PROGRAMA(dataVentas, mes)+filtrarXmes_TRAT(dataVentas, mes)+filtrarXmes_ACCESORIO(dataVentas, mes)+filtrarXmes_SUPLEMENTOS(dataVentas, mes)
  }
  function SumaTotalEnComprasxMes(mes) {
    return 
  }
  function IgvVentas(mes) {
    const sumaVentas = SumaTotalEnVentasxMes(mes)
    const baseIGV = (sumaVentas/1.18)
    const igvVentas = baseIGV*0.18
    return igvVentas
  }
  function CalcularCreditoFiscalxMes(mes) {
    return IgvVentas(mes) - IgvCompras(mes)
  }
  // Función para agregar datos a una hoja de trabajo
  
  const addDataToWorksheet = (worksheet, data) => {
    worksheet.mergeCells('B1:O1');
    worksheet.getCell('B1').value = `FLUJO DE CAJA Y BANCO ANUALIZADO ${dayjs(fechaInit).get("year")} de ${id_empresa}`;
    worksheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B1').font = { size: 25, bold: true };
    // Combinar las celdas de B4 hasta D4
    //TODO: INGRESOS
    worksheet.mergeCells('B4:O4');
    worksheet.getCell('B4').value = `INGRESOS`;
    worksheet.getCell('B4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B4').font = { size: 17, bold: true, color: { argb: 'FFFF0000' } };
    // Agregar un valor a la celda combinada
    worksheet.addRow(["", 'ENERO', 'FEBRERO', 'MARZO', "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE", "TOTAL", "[porcentaje]"]).eachCell((cell) => {
      cell.fill = headerStyle.fill;
      cell.font = headerStyle.font;
      cell.alignment = headerStyle.alignment;
      cell.border = headerStyle.border;
    });
    worksheet.addRow(["Programas", 
      filtrarXmes_PROGRAMA(dataVentas, '01'), 
      filtrarXmes_PROGRAMA(dataVentas, '02'),
      filtrarXmes_PROGRAMA(dataVentas, '03'),
      filtrarXmes_PROGRAMA(dataVentas, '04'),
      filtrarXmes_PROGRAMA(dataVentas, '05'),
      filtrarXmes_PROGRAMA(dataVentas, '06'),
      filtrarXmes_PROGRAMA(dataVentas, '07'),
      filtrarXmes_PROGRAMA(dataVentas, '08'),
      filtrarXmes_PROGRAMA(dataVentas, '09'),
      filtrarXmes_PROGRAMA(dataVentas, '10'),
      filtrarXmes_PROGRAMA(dataVentas, '11'),
      filtrarXmes_PROGRAMA(dataVentas, '12')
      , "TOTAL"]).eachCell((cell) => {
      cell.fill = cellStyle.fill;
      cell.font = cellStyle.font;
      cell.alignment = cellStyle.alignment;
      cell.border = cellStyle.border;
    });
    worksheet.addRow(["Tratamientos esteticos",
      filtrarXmes_TRAT(dataVentas, '01'), 
      filtrarXmes_TRAT(dataVentas, '02'),
      filtrarXmes_TRAT(dataVentas, '03'),
      filtrarXmes_TRAT(dataVentas, '04'),
      filtrarXmes_TRAT(dataVentas, '05'),
      filtrarXmes_TRAT(dataVentas, '06'),
      filtrarXmes_TRAT(dataVentas, '07'),
      filtrarXmes_TRAT(dataVentas, '08'),
      filtrarXmes_TRAT(dataVentas, '09'),
      filtrarXmes_TRAT(dataVentas, '10'),
      filtrarXmes_TRAT(dataVentas, '11'),
      filtrarXmes_TRAT(dataVentas, '12')
      , "TOTAL"]).eachCell((cell) => {
      cell.fill = cellStyle.fill;
      cell.font = cellStyle.font;
      cell.alignment = cellStyle.alignment;
      cell.border = cellStyle.border;
    });
    worksheet.addRow(["Accesorios", 
      filtrarXmes_ACCESORIO(dataVentas, '01'), 
      filtrarXmes_ACCESORIO(dataVentas, '02'),
      filtrarXmes_ACCESORIO(dataVentas, '03'),
      filtrarXmes_ACCESORIO(dataVentas, '04'),
      filtrarXmes_ACCESORIO(dataVentas, '05'),
      filtrarXmes_ACCESORIO(dataVentas, '06'),
      filtrarXmes_ACCESORIO(dataVentas, '07'),
      filtrarXmes_ACCESORIO(dataVentas, '08'),
      filtrarXmes_ACCESORIO(dataVentas, '09'),
      filtrarXmes_ACCESORIO(dataVentas, '10'),
      filtrarXmes_ACCESORIO(dataVentas, '11'),
      filtrarXmes_ACCESORIO(dataVentas, '12')
      , "TOTAL"]).eachCell((cell) => {
      cell.fill = cellStyle.fill;
      cell.font = cellStyle.font;
      cell.alignment = cellStyle.alignment;
      cell.border = cellStyle.border;
    });
    worksheet.addRow(["Suplementos", 
      filtrarXmes_SUPLEMENTOS(dataVentas, '01'), 
      filtrarXmes_SUPLEMENTOS(dataVentas, '02'),
      filtrarXmes_SUPLEMENTOS(dataVentas, '03'),
      filtrarXmes_SUPLEMENTOS(dataVentas, '04'),
      filtrarXmes_SUPLEMENTOS(dataVentas, '05'),
      filtrarXmes_SUPLEMENTOS(dataVentas, '06'),
      filtrarXmes_SUPLEMENTOS(dataVentas, '07'),
      filtrarXmes_SUPLEMENTOS(dataVentas, '08'),
      filtrarXmes_SUPLEMENTOS(dataVentas, '09'),
      filtrarXmes_SUPLEMENTOS(dataVentas, '10'),
      filtrarXmes_SUPLEMENTOS(dataVentas, '11'),
      filtrarXmes_SUPLEMENTOS(dataVentas, '12')
      , "TOTAL"]).eachCell((cell) => {
      cell.fill = cellStyle.fill;
      cell.font = cellStyle.font;
      cell.alignment = cellStyle.alignment;
      cell.border = cellStyle.border;
    });
    worksheet.addRow(["TOTAL", 
      SumaTotalEnVentasxMes('01'), 
      SumaTotalEnVentasxMes('02'),
      SumaTotalEnVentasxMes('03'),
      SumaTotalEnVentasxMes('04'),
      SumaTotalEnVentasxMes('05'),
      SumaTotalEnVentasxMes('06'),
      SumaTotalEnVentasxMes('07'),
      SumaTotalEnVentasxMes('08'),
      SumaTotalEnVentasxMes('09'),
      SumaTotalEnVentasxMes('10'),
      SumaTotalEnVentasxMes('11'),
      SumaTotalEnVentasxMes('12')
      , "TOTAL"]).eachCell((cell) => {
      cell.fill = cellStyle.fill;
      cell.font = cellStyle.font;
      cell.alignment = cellStyle.alignment;
      cell.border = cellStyle.border;
    });
    ///TODO EGRESOS
    worksheet.addRow();
    worksheet.mergeCells('B13:O13');
    worksheet.getCell('B13').value = `EGRESOS`;
    worksheet.getCell('B13').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B13').font = { size: 17, bold: true, color: { argb: 'FFFF0000' } };
    // Agregar un valor a la celda combinada
    data.forEach(r=>{
      const rowEncabezado = worksheet.addRow([r.grupo, 'ENERO', 'FEBRERO', 'MARZO', "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE", "TOTAL", "[porcentaje]"]).eachCell((cell) => {
        cell.fill = headerStyle.fill;
        cell.font = headerStyle.font;
        cell.alignment = headerStyle.alignment;
        cell.border = headerStyle.border;
      });
      

      r.dataConceptos.forEach((e) => {
        const row = worksheet.addRow([e.nombre_gasto, 
                          filtrarXmes(e.data, '01')?filtrarXmes(e.data, '01'):0, 
                          filtrarXmes(e.data, '02')?filtrarXmes(e.data, '02'):0, 
                          filtrarXmes(e.data, '03')?filtrarXmes(e.data, '03'):0, 
                          filtrarXmes(e.data, '04')?filtrarXmes(e.data, '04'):0, 
                          filtrarXmes(e.data, '05')?filtrarXmes(e.data, '05'):0, 
                          filtrarXmes(e.data, '06')?filtrarXmes(e.data, '06'):0, 
                          filtrarXmes(e.data, '07')?filtrarXmes(e.data, '07'):0, 
                          filtrarXmes(e.data, '08')?filtrarXmes(e.data, '08'):0, 
                          filtrarXmes(e.data, '09')?filtrarXmes(e.data, '09'):0, 
                          filtrarXmes(e.data, '10')?filtrarXmes(e.data, '10'):0, 
                          filtrarXmes(e.data, '11')?filtrarXmes(e.data, '11'):0, 
                          filtrarXmes(e.data, '12')?filtrarXmes(e.data, '12'):0 ,
                        ])
                        row.getCell(1).fill = yellowFillStyle.fill;
                        row.eachCell((cell) => {
          cell.alignment = cellStyle.alignment;
          cell.border = cellStyle.border;
        });
      });
      worksheet.addRow();
    })

    ///TODO CREDITO FISCAL
    const creditRow = worksheet.addRow();
    worksheet.mergeCells(creditRow._number, 2, creditRow._number, 13); // Combina de B hasta O
    worksheet.getCell(`B${creditRow._number}`).value = "CREDITO FISCAL";
    worksheet.getCell(`B${creditRow._number}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`B${creditRow._number}`).font = { size: 14, bold: true, color: { argb: 'FF000000' } };
    worksheet.getCell(`B${creditRow._number}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDDDDD' } };

    const rowEncabezadoCREDITO_FISC = worksheet.addRow(["", 'ENERO', 'FEBRERO', 'MARZO', "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"]).eachCell((cell) => {
      cell.fill = headerStyle.fill;
      cell.font = headerStyle.font;
      cell.alignment = headerStyle.alignment;
      cell.border = headerStyle.border;
    });
    worksheet.addRow(["ACUMULADO", 
                      0, 
                      CalcularCreditoFiscalxMes("01"), 
                      worksheet.getCell("C154").value, 
                      "", "", "", "", "", "", "", "", ""]).eachCell((cell) => {
      cell.fill = headerStyle.fill;
      cell.font = headerStyle.font;
      cell.alignment = headerStyle.alignment;
      cell.border = headerStyle.border;
    });
    worksheet.addRow(["IGV VENTAS", IgvVentas('01'), IgvVentas('02'), IgvVentas('03'), IgvVentas('04'), IgvVentas('05'), IgvVentas('06'), IgvVentas('07'), IgvVentas('08'), IgvVentas('09'), IgvVentas('10'), IgvVentas('11'), IgvVentas('12')]).eachCell((cell) => {
      cell.fill = headerStyle.fill;
      cell.font = headerStyle.font;
      cell.alignment = headerStyle.alignment;
      cell.border = headerStyle.border;
    });
    worksheet.addRow(["IGV COMPRAS", 
      IgvCompras("01"), 
      IgvCompras("02"), 
      IgvCompras("03"), 
      IgvCompras("04"), 
      IgvCompras("05"), 
      IgvCompras("06"), 
                      IgvCompras("07"), 
                      IgvCompras("08"), 
                      IgvCompras("09"), 
                      IgvCompras("10"), 
                      IgvCompras("11"), 
                      IgvCompras("12")]).eachCell((cell) => {
      cell.fill = headerStyle.fill;
      cell.font = headerStyle.font;
      cell.alignment = headerStyle.alignment;
      cell.border = headerStyle.border;
    });
    worksheet.addRow(["CREDITO FISCAL", 
                      CalcularCreditoFiscalxMes("01"), 
                      worksheet.getCell("C151").value-CalcularCreditoFiscalxMes("02"), 
                      worksheet.getCell("D151").value-CalcularCreditoFiscalxMes("03"), 
                      worksheet.getCell("E151").value-CalcularCreditoFiscalxMes("04"), 
                      worksheet.getCell("F151").value-CalcularCreditoFiscalxMes("05"), 
                      worksheet.getCell("G151").value-CalcularCreditoFiscalxMes("06"), 
                      CalcularCreditoFiscalxMes("07"), 
                      CalcularCreditoFiscalxMes("08"), 
                      CalcularCreditoFiscalxMes("09"), 
                      CalcularCreditoFiscalxMes("10"), 
                      CalcularCreditoFiscalxMes("11"), 
                      CalcularCreditoFiscalxMes("12")]).eachCell((cell) => {
      cell.fill = headerStyle.fill;
      cell.font = headerStyle.font;
      cell.alignment = headerStyle.alignment;
      cell.border = headerStyle.border;
    });
  };

  const addDataToWorkSheetTipoCambio = (worksheet, data)=>{
    //TODO: INGRESOS
    worksheet.mergeCells('B4:O4');
    worksheet.getCell('B4').value = `TIPO DE CAMBIO`;
    worksheet.getCell('B4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B4').font = { size: 17, bold: true, color: { argb: 'FFFF0000' } };
    // Agregar un valor a la celda combinada
    data.forEach(r=>{
      const rowEncabezado = worksheet.addRow(['MONEDA', 'FECHA', 'PRECIO DE VENTA' ]).eachCell((cell) => {
        cell.fill = headerStyle.fill;
        cell.font = headerStyle.font;
        cell.alignment = headerStyle.alignment;
        cell.border = headerStyle.border;
      });
      const row = worksheet.addRow([r.moneda, r.fecha, r.precio_venta 
      ])
      row.getCell(1).fill = yellowFillStyle.fill;
      row.eachCell((cell) => {
      cell.alignment = cellStyle.alignment;
      cell.border = cellStyle.border;
      });
      worksheet.addRow();
    })
  }

  // Agregar datos a cada hoja de trabajo
  addDataToWorksheet(worksheet, dataGastos2);
  addDataToWorkSheetTipoCambio(worksheetTipoCambio, dataTipoCambio)

    // Generar el archivo Excel en formato Blob
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Guardar el archivo generado usando FileSaver.js (o similar)
    saveAs(blob, 'Flujo de caja.xlsx');
  };

  return (
    <div>
      <Button label="EXPORTAR FLUJO DE CAJA" icon='pi pi-file-export' text onClick={exportToExcel}/>
      {/* <Button variant="success" onClick={exportToExcel}>Exportar Excel: {data.length} datos</Button> */}
    </div>
  );
}


function agruparPorMes(datos) {
  const resultado = [
      { total_monto_membresia: 0, data: [] },
      { total_monto_prod_acc: 0, data: [] },
      { total_monto_prod_sup: 0, data: [] },
      { total_monto_cita_nut: 0, data: [] },
      { total_monto_cita_trat_est: 0, data: [] }
  ];

  datos.forEach(item => {
      const mes = new Date(item.fecha_venta).getMonth() + 1;
      const mesStr = mes.toString().padStart(2, '0');

      // Procesar membresías
      item.detalle_membresia.forEach(m => {
          resultado[0].total_monto_membresia += m.tarifa_monto;
          agregarAlMes(resultado[0].data, mesStr, m.tarifa_monto);
      });

      // Procesar productos accesorios
      item.detalle_prodAccesorios.forEach(p => {
          resultado[1].total_monto_prod_acc += p.tarifa_monto;
          agregarAlMes(resultado[1].data, mesStr, p.tarifa_monto);
      });

      // Procesar productos suplementos
      item.detalle_prodSuplementos.forEach(p => {
          resultado[2].total_monto_prod_sup += p.tarifa_monto;
          agregarAlMes(resultado[2].data, mesStr, p.tarifa_monto);
      });

      // Procesar citas nutricionales
      item.detalle_cita_nut.forEach(c => {
          resultado[3].total_monto_cita_nut += c.tarifa_monto;
          agregarAlMes(resultado[3].data, mesStr, c.tarifa_monto);
      });

      // Procesar citas tratamientos estéticos
      item.detalle_cita_tratest.forEach(c => {
          resultado[4].total_monto_cita_trat_est += c.tarifa_monto;
          agregarAlMes(resultado[4].data, mesStr, c.tarifa_monto);
      });
  });

  return resultado;
}

function agregarAlMes(data, mes, monto) {
  let mesData = data.find(d => d.mes === mes);
  if (!mesData) {
      mesData = { mes: mes, monto_total: 0 };
      data.push(mesData);
  }
  mesData.monto_total += monto;
}







function agruparPorFechaYGrupo(data) {
  return data.reduce((result, item) => {
    // Buscar si ya existe una entrada para la combinación de fec_pago y grupo
    let grupoExistente = result.find(grupo => 
      grupo.fec_pago === item.fec_pago && grupo.grupo === item.tb_parametros_gasto?.grupo
    );

    if (grupoExistente) {
      // Si ya existe, agrega el item al array `data`
      grupoExistente.data.push(item);
    } else {
      // Si no existe, crea una nueva entrada en el resultado
      result.push({
        fec_pago: item.fec_pago,
        grupo: item.tb_parametros_gasto?.grupo,
        data: [item]
      });
    }

    return result;
  }, []);
}
// function agruparDatos(datos) {
//   // Crear un objeto para almacenar los datos agrupados
//   const agrupados = datos.reduce((acc, item) => {
//     // Extraer el mes y año de fec_pago en formato 'YYYY-MM'
//     const mes = new Date(item?.data[0]?.fec_comprobante)?.toISOString().slice(0, 7);
//     const nombre_gasto = item.nombre_gasto;
    
//     // Crear una clave única para cada combinación de nombre_gasto y mes
//     const clave = `${nombre_gasto}-${mes}`;

//     // Inicializar el objeto si no existe
//     if (!acc[clave]) {
//       acc[clave] = {
//         nombre_gasto,
//         mes,
//         fec_pago: item.data[0].fec_pago,
//         data: item.data,
//         monto_total: 0
//       };
//     }

//     // Acumular el monto total
//     acc[clave].monto_total += item.monto_total;

//     return acc;
//   }, {});

//   // Convertir el objeto agrupado en un array
//   return Object.values(agrupados);
// }


function agruparPorFecPagoAndMonto(data) {
  const groupedData = data.reduce((acc, item) => {
    const mes = item.fec_pago.getMonth() + 1; // Obtener el mes (de 0 a 11)
    const nombre_gasto = item.tb_parametros_gasto?.nombre_gasto;

    const existingGroup = acc.find(group => group.mes === mes);

    if (existingGroup) {
        existingGroup.monto_total += item.monto;
    } else {
        acc.push({ mes, nombre_gasto, monto_total: item.monto, data });
    }

    return acc;
  }, []);
return groupedData;
}