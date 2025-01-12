import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver'; // Para guardar el archivo generado
import { Button } from 'primereact/button';
import dayjs from 'dayjs';
import { arrayDistrito } from '@/types/type';

export const BtnExportSeguimiento = ({dataExport}) => {
    console.log(dataExport, "999");
    
    dataExport = dataExport.map(d=>{
        return {
            nombres_cli: d.tb_ventum.tb_cliente.nombre_cli,
            apellidos_cli: `${d.tb_ventum.tb_cliente.apPaterno_cli} ${d.tb_ventum.tb_cliente.apPaterno_cli}`,
            distrito: arrayDistrito.find(u=>u.value === d.tb_ventum.tb_cliente.ubigeo_distrito_cli)?.label,
            email: d.tb_ventum.tb_cliente.email_cli,
            telefono: d.tb_ventum.tb_cliente.tel_cli,
            programa: d.ProgramavsSemana.split('|')[0],
            semana: d.ProgramavsSemana.split('|')[1],
            hora: d.ProgramavsSemana.split('|')[2],
            fecha_fin: d.fec_fin_mem_new.split('T')[0],
            sesiones_pendientes: d.diasFaltan
        }
    })
    console.log(dataExport, "daaaaa");
  
  const exportToExcel = async () => {
    // Crear un nuevo libro de trabajo Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data seguimiento');
  
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
    { key: 'nombre_cli', width: 40 },
    { key: 'apellidos_cli', width: 40 },
    { key: 'distrito', width: 20 },
    { key: 'email', width: 20 },
    { key: 'telefono', width: 20 },
    { key: 'programa', width: 20 },
    { key: 'semana', width: 20 },
    { key: 'hora', width: 20 },
    { key: 'fecha_fin', width: 20 },
    { key: 'sesiones_pendientes', width: 10 }
  ];

  worksheet.columns = columns;

  const addDataToWorksheet = (worksheet, dataSeguimiento) => {
    worksheet.mergeCells('B1:O1');
    worksheet.getCell('B1').value = `SEGUIMIENTO`;
    worksheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B1').font = { size: 25, bold: true };
    // Combinar las celdas de B4 hasta D4
    ///TODO EGRESOS
    
    const rowEncabezado = worksheet.addRow(['NOMBRES', "APELLIDOS", 'DISTRITOS', 'EMAIL', 'TELEFONOS', 'programa', 'semana', 'hora', "FECHA DE VENCIMIENTO", "SESIONES PENDIENTES"]).eachCell((cell) => {
        cell.fill = headerStyle.fill;
        cell.font = headerStyle.font;
        cell.alignment = headerStyle.alignment;
        cell.border = headerStyle.border;
      });
    dataSeguimiento.forEach(e=> {
        const row = worksheet.addRow([
          e.nombres_cli,
          e.apellidos_cli,
            e.distrito,
            e.email,
            e.telefono,
            e.programa,
            e.semana,
            e.hora,
            e.fecha_fin,
            e.sesiones_pendientes
        ])
                        row.eachCell((cell) => {
          cell.alignment = cellStyle.alignment;
          cell.border = cellStyle.border;
        });
      });
  };

  // Agregar datos a cada hoja de trabajo
  addDataToWorksheet(worksheet, dataExport);

    // Generar el archivo Excel en formato Blob
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Guardar el archivo generado usando FileSaver.js (o similar)
    saveAs(blob, 'Flujo de caja.xlsx');
  };

  return (
    <div>
      <Button label="EXPORTAR DATA" icon='pi pi-file-export' text onClick={exportToExcel}/>
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