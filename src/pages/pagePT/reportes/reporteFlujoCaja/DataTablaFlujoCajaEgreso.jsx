import React, { useEffect, useRef, useState } from 'react'
import { PageBreadcrumb } from '@/components'
import { Toast } from 'primereact/toast'
import { useReporteStore } from '@/hooks/hookApi/useReporteStore'
import { Calendar } from 'primereact/calendar'
import { TabPanel, TabView } from 'primereact/tabview'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { useVentasStore } from '@/hooks/hookApi/useVentasStore'
import { FormatRangoFecha } from '@/components/componentesReutilizables/FormatRangoFecha'
import { BtnExportExcelFlujoCaja } from '../../GestGastos/BtnExportExcelFlujoCaja'
import { useAportesIngresosStore } from '@/hooks/hookApi/useAportesIngresosStore'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import { useTipoCambioStore } from '@/hooks/hookApi/useTipoCambioStore'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

export const DataTablaFlujoCajaEgreso = ({id_empresa, dataEgreso, dataTipoCambio}) => {
  
  dataEgreso = dataEgreso.filter(f=>f.tb_parametros_gasto?.id_empresa===id_empresa)
  dataEgreso = dataEgreso?.map(eg=>{
    const tipoCambio = dataTipoCambio?.find(tc=> tc.fecha === eg.fec_pago&&eg.moneda==='USD')
    if (tipoCambio) {
      return {
        ...eg,
        moneda: 'PEN',
        monto: eg.monto * parseFloat(tipoCambio.precio_venta)
      }
    }
    return eg;
  })
  dataTipoCambio = dataTipoCambio?.map(tc=>{
    return {
      moneda: tc.moneda,
      precio_venta: tc.precio_venta,
      fecha: tc.fecha
    }
  })
  
  
  const dataGastos2 = agruparPorMesYGrupo(dataEgreso).map((e) => {
    return {
      grupo: e.grupo,
      dataConceptos: agruparPorNombreGasto(e.data)
    };
  });
  console.log(dataGastos2);
  
  
   // Plantilla para renderizar los conceptos
   const conceptoBodyTemplate = (e, mes) => {
    // console.log(e);
    return (
      <>
      </>
    )
    // switch (mes) {
    //   case 'ENERO':
    //     return e.data[0].ENERO
        
    //   case 'FEBRERO':
    //     return e.data[0].FEBRERO
    //   case 'MARZO':
    //     return e.data[0].MARZO
    //   case 'ABRIL':
    //     return e.data[0].ABRIL
      
    //   case 'MAYO':
    //     return e.data[0].MAYO
    //   case 'JUNIO':
    //     return e.data[0].JUNIO
      
    //   case 'JULIO':
    //     return e.data[0].JULIO
    //   case 'AGOSTO':
    //     return e.data[0].AGOSTO
    //   case 'SEPTIEMBRE':
    //     return e.data[0].SEPTIEMBRE

    //   case 'OCTUBRE':
    //     return e.data[0].OCTUBRE
        
    //   case 'NOVIEMBRE':
    //     return e.data[0].NOVIEMBRE
        
    //   case 'DICIEMBRE':
    //     return e.data[0].DICIEMBRE

    // }
   };
  
  return (
    <>
    <div>
            {dataGastos2.map((grupo, index) => 
            {
              // console.log(grupo.dataConceptos.map(t=>t.data[0]).ENERO);
              return(
                <div key={index} className="card">
                    <h3>Grupo: {grupo.grupo}</h3>
                    
                    <DataTable value={grupo.dataConceptos} responsiveLayout="scroll">
                        <Column field="nombre_gasto"  header="Nombre Gasto" style={{ minWidth: '30rem' }}></Column>
                        
                        <Column header="Enero" body={(e)=>conceptoBodyTemplate(e, 'ENERO')}></Column>
                        <Column header="Febrero" body={(e)=>conceptoBodyTemplate(e, 'FEBRERO')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column header="Marzo" body={(e)=>conceptoBodyTemplate(e, 'MARZO')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column header="Abril" body={(e)=>conceptoBodyTemplate(e, 'ABRIL')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column header="Mayo" body={(e)=>conceptoBodyTemplate(e, 'MAYO')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column header="Junio" body={(e)=>conceptoBodyTemplate(e, 'JUNIO')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column header="Julio" body={(e)=>conceptoBodyTemplate(e, 'JULIO')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column header="Agosto" body={(e)=>conceptoBodyTemplate(e, 'AGOSTO')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column header="Septiembre" body={(e)=>conceptoBodyTemplate(e, 'SEPTIEMBRE')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column header="Octubre" body={(e)=>conceptoBodyTemplate(e, 'OCTUBRE')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column header="Noviembre" body={(e)=>conceptoBodyTemplate(e, 'NOVIEMBRE')} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column header="Diciembre" body={(e)=>conceptoBodyTemplate(e, 'DICIEMBRE')} sortable style={{ minWidth: '12rem' }}></Column>
                    </DataTable>
                </div>
                )
          }
            )}
        </div>
        {/* {
          dataGastos2?.map(g=>{
            
            return(
              <DataTable
                  value={dataGastos2}
                  dataKey="id"
                  size='small'
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25]}
              >
                <Column header={g.grupo} sortable style={{ minWidth: '12rem' }} body={conceptoBodyTemplate}></Column>
                <Column header="Enero" sortable style={{ minWidth: '12rem' }}></Column>
                <Column header="Febrero" sortable style={{ minWidth: '12rem' }}></Column>
                <Column header="Marzo" sortable style={{ minWidth: '12rem' }}></Column>
                <Column header="Abril" sortable style={{ minWidth: '12rem' }}></Column>
                <Column header="Mayo" sortable style={{ minWidth: '12rem' }}></Column>
                <Column header="Junio" sortable style={{ minWidth: '12rem' }}></Column>
                <Column header="Julio" sortable style={{ minWidth: '12rem' }}></Column>
                <Column header="Agosto" sortable style={{ minWidth: '12rem' }}></Column>
                <Column header="Septiembre" sortable style={{ minWidth: '12rem' }}></Column>
                <Column header="Octubre" sortable style={{ minWidth: '12rem' }}></Column>
                <Column header="Noviembre" sortable style={{ minWidth: '12rem' }}></Column>
                <Column header="Diciembre" sortable style={{ minWidth: '12rem' }}></Column>
              </DataTable>
            )
          })
        } */}
    </>
  )
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

function agruparPorNombreGasto(data) {
  
  let groupedData = data.reduce((acc, item) => {
    // const mes = item.fec_pago.getMonth() + 1; // Obtener el mes (de 0 a 11)
    
    const nombre_gasto = item.tb_parametros_gasto?.nombre_gasto;
    const existingGroup = acc.find(group => 
      // group.mes === mes && 
      group.nombre_gasto === nombre_gasto
    );
      
      if (existingGroup) {
        existingGroup.data.push(item);
        // existingGroup.monto_total += item.monto;
      } else {
        acc.push({ id: item.tb_parametros_gasto.id, nombre_gasto,  data: [item] });
      }
    return acc;
}, []);
  // groupedData = groupedData.map(f=>{
  //   return {
  //     ...f,
  //     data: agruparxMesNames2(f.data)
  //   }
  // })
  

  
return groupedData.map(f=>{
    return {
      ...f,
      filterMes: agruparxMesNames2(f.data)
    }
  })
}
function agruparxMesNames(data, mes) {
  // Inicializar un objeto con todos los meses y sus montos a 0
const initialMonths = {
  ENERO: 0,
  FEBRERO: 0,
  MARZO: 0,
  ABRIL: 0,
  MAYO: 0,
  JUNIO: 0,
  JULIO: 0,
  AGOSTO: 0,
  SEPTIEMBRE: 0,
  OCTUBRE: 0,
  NOVIEMBRE: 0,
  DICIEMBRE: 0,
};

const monthNames = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
];
// Convertir el nombre del mes a su índice correspondiente
const monthIndex = monthNames.indexOf(mes.toUpperCase());

if (monthIndex === -1) {
  return `El mes ${mes} no es válido.`;
}

// Filtrar y sumar los montos del mes especificado
const montoTotal = data.reduce((acc, { monto, fec_pago }) => {
  const date = new Date(fec_pago);
  if (date.getMonth() === monthIndex) {
    return acc + monto;
  }
  return acc;
}, 0);

return montoTotal;
}

// Inicializar un objeto con todos los meses y sus montos a 0
const initialMonths = {
  ENERO: 0,
  FEBRERO: 0,
  MARZO: 0,
  ABRIL: 0,
  MAYO: 0,
  JUNIO: 0,
  JULIO: 0,
  AGOSTO: 0,
  SEPTIEMBRE: 0,
  OCTUBRE: 0,
  NOVIEMBRE: 0,
  DICIEMBRE: 0,
};

const monthNames = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
];


function agruparxMesNames2(data) {
  // console.log(data);
  console.log(data);
  
const result = data.reduce((acc, { monto, fec_comprobante }) => {
  const month = new Date(fec_comprobante).getMonth(); // Obtener el índice del mes
  const monthName = monthNames[month]; // Obtener el nombre del mes
  acc[monthName] += monto; // Sumar el monto al mes correspondiente
  return acc;
}, { ...initialMonths });

return [result]
}

