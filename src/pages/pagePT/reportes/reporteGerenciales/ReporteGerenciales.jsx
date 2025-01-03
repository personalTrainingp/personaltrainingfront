
// import React, { useEffect, useRef, useState } from 'react'
// import { ResumenReporteGeneral } from './ResumenReporteGeneral/ResumenReporteGeneral'
// import { PageBreadcrumb } from '@/components'
// import { Toast } from 'primereact/toast'
// import { useReporteStore } from '@/hooks/hookApi/useReporteStore'
// import { Calendar } from 'primereact/calendar'
// import { TabPanel, TabView } from 'primereact/tabview'
// import { Card, CardBody, Col, Row } from 'react-bootstrap'
// import { ResumenUtilidadesProgramas } from './ResumenReporteGeneral copy/ResumenUtilidadesProgramas'
// import { CardEstimado } from '@/components/CardTab/CardEstimado'
// import { useVentasStore } from '@/hooks/hookApi/useVentasStore'
// import { FormatRangoFecha } from '@/components/componentesReutilizables/FormatRangoFecha'
// import { BtnExportExcelFlujoCaja } from '../../GestGastos/BtnExportExcelFlujoCaja'
// import { useAportesIngresosStore } from '@/hooks/hookApi/useAportesIngresosStore'
// import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
// import { useTipoCambioStore } from '@/hooks/hookApi/useTipoCambioStore'
// import { locale } from 'primereact/api'
// locale('es')
// export const ReporteGerenciales = () => {
//   const toast = useRef(null)
//   const [rangoFechas, setrangoFechas] = useState([new Date(new Date().getFullYear(), 0, 1), new Date()])
//   const { obtenerReporteDeResumenUTILIDAD, reportegerencial_resumenGeneral, utilidadesProgramas } = useReporteStore()
//   const { dataVentaxFecha, obtenerVentasPorFecha, IngresosSeparados_x_Fecha } = useVentasStore()
//   const { obtenerAportesPorFechas, dataAportes } = useAportesIngresosStore()
//   const { obtenerGastosPorFecha, dataGasto } = useGf_GvStore()
//   const { obtenerTipoCambioPorFecha, tipocambio, obtenerTipoDeCambiosPorRangoDeFechas, dataTipoCambio } = useTipoCambioStore()
//   useEffect(() => {
//     if(rangoFechas[0]===null) return;
//     if(rangoFechas[1]===null) return;
//     obtenerReporteDeResumenUTILIDAD(rangoFechas)
//     obtenerVentasPorFecha(rangoFechas)
//     obtenerAportesPorFechas(rangoFechas)
//     obtenerGastosPorFecha(rangoFechas)
//     obtenerTipoDeCambiosPorRangoDeFechas(rangoFechas)
//     // obtenerTipoCambioPorFecha(rangoFechas)
//   }, [rangoFechas])
//   const showToast = (severity, summary, detail, label) => {
//     toast.current.show({ severity, summary, detail, label });
//   };
  
//   return (
//     <>
//     <PageBreadcrumb title="Reporte gerencial" subName="reporte-gerenciales" />
//     <TabView>
//       <TabPanel header='CHANGE'>

//       <div className='flex-auto mb-2'>
//       <label htmlFor="buttondisplay" className="font-bold block mb-2">
//                       RANGO DE FECHAS
//       </label>
//       <Calendar value={rangoFechas} locale='es' onChange={(e)=>setrangoFechas(e.value)} showIcon selectionMode="range" readOnlyInput hideOnRangeSelection/>
//       <FormatRangoFecha rangoFechas={rangoFechas}/>
//       <BtnExportExcelFlujoCaja id_empresa={598} dataGastos={dataGasto} dataTipoCambio={dataTipoCambio} dataAporte={dataAportes} dataVentas={dataVentaxFecha} fechaInit={rangoFechas[0]}/>
//     </div>
//       <ResumenReporteGeneral data={reportegerencial_resumenGeneral} IngresosSeparados_x_Fecha={IngresosSeparados_x_Fecha}/>
//       <Row>
//         <Col>
//           <ResumenUtilidadesProgramas data={utilidadesProgramas}/>
//         </Col>
//         <Col>
//           <Card>
//             <CardBody>
//               <h4>RESUMEN ACCESORIOS</h4>
//               <CardEstimado backgroundColor={'bg-success'} title={'INGRESOS'} montoSoles={'S/.4,600.40'}/>
//               <CardEstimado backgroundColor={'bg-danger'} title={'EGRESO'} montoSoles={'S/.1,202.00'}/>
//               <CardEstimado backgroundColor={'bg-info'} title={'UTILIDADES'} montoSoles={'S/.3,398.40'}/>
//             </CardBody>
//           </Card>
//         </Col>
//         <Col>
//           <Card>
//               <CardBody>
//                 <h4>RESUMEN SUPLEMENTOS</h4>
//                 <CardEstimado backgroundColor={'bg-success'} title={'INGRESOS'} montoSoles={'S/.618.00'}/>
//                 <CardEstimado backgroundColor={'bg-danger'} title={'EGRESO'} montoSoles={'S/.162.99'}/>
//                 <CardEstimado backgroundColor={'bg-info'} title={'UTILIDADES'} montoSoles={'S/.455.01'}/>
//               </CardBody>
//             </Card>
//         </Col>
//         <Col>
//         <Card>
//             <CardBody>
//               <h4>RESUMEN TRATAMIENTOS ESTETICOS</h4>
//               <CardEstimado backgroundColor={'bg-success'} title={'INGRESOS'} montoSoles={'S/4,267.90'}/>
//               <CardEstimado backgroundColor={'bg-danger'} title={'EGRESO'} montoSoles={'S/1,292.58'}/>
//               <CardEstimado backgroundColor={'bg-info'} title={'UTILIDADES'} montoSoles={'S/2,975.32'}/>
//               {/* <CardEstimado backgroundColor={'bg-primary'} title={'INGRESOS DIRECTOS'} montoSoles={'S/2,125,943.00'}/>*/}
//               {/* <CardEstimado backgroundColor={'bg-success'} title={'INGRESOS TOTALES'} montoSoles={'S/2,125,943.00'}/>
//               <CardEstimado backgroundColor={'bg-danger'} title={'EGRESOS DIRECTOS'} items={[{label: 'IGV', monto: '1234.00'}, {label: 'POS', monto: '1234.00'},{label: 'RENTA', monto: '1234.00'},{label: 'COMISIONES', monto: '1234.00'}]} montoSoles={'S/2,125,943.00'}/>
//               <CardEstimado backgroundColor={'bg-danger'} title={'TOTAL GASTOS'} montoSoles={'S/2,125,943.00'}/>
//               <CardEstimado backgroundColor={'bg-info'} title={'UTILIDAD BRUTA'} montoSoles={'S/2,125,943.00'}/>  */}
//               </CardBody>
//               </Card>
//             </Col>
//           </Row>
//           </TabPanel>
//           <TabPanel header='CIRCUS'>
//             <BtnExportExcelFlujoCaja id_empresa={599} dataGastos={dataGasto} dataTipoCambio={dataTipoCambio} dataAporte={dataAportes} dataVentas={dataVentaxFecha} fechaInit={rangoFechas[0]}/>
//           </TabPanel>
//           <TabPanel header='PERSONAL TRAINING'>
//             <BtnExportExcelFlujoCaja id_empresa={0} dataGastos={dataGasto} dataTipoCambio={dataTipoCambio} dataAporte={dataAportes} dataVentas={dataVentaxFecha} fechaInit={rangoFechas[0]}/>
//           </TabPanel>
//         </TabView>
//         </>
//       )
//     }
    






import React, { useEffect, useRef, useState } from 'react'
import { ResumenReporteGeneral } from './ResumenReporteGeneral/ResumenReporteGeneral'
import { PageBreadcrumb } from '@/components'
import { Toast } from 'primereact/toast'
import { useReporteStore } from '@/hooks/hookApi/useReporteStore'
import { Calendar } from 'primereact/calendar'
import { TabPanel, TabView } from 'primereact/tabview'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { ResumenUtilidadesProgramas } from './ResumenReporteGeneral copy/ResumenUtilidadesProgramas'
import { CardEstimado } from '@/components/CardTab/CardEstimado'
import { useVentasStore } from '@/hooks/hookApi/useVentasStore'
import { FormatRangoFecha } from '@/components/componentesReutilizables/FormatRangoFecha'
import { BtnExportExcelFlujoCaja } from '../../GestGastos/BtnExportExcelFlujoCaja'
import { useAportesIngresosStore } from '@/hooks/hookApi/useAportesIngresosStore'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import { useTipoCambioStore } from '@/hooks/hookApi/useTipoCambioStore'
import { UtilidadesMes } from './UtilidadesMes'
import { UtilidadesProgramas } from './UtilidadesProgramas'
import { ItemTotales } from './ItemTotales'
import { UtilidadesProductos } from './UtilidadesProductos'
import { UtilidadesCitas } from './UtilidadesCitas'
import SimpleBar from 'simplebar-react'
import { SelectButton } from 'primereact/selectbutton'
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import { useDispatch } from 'react-redux';

export const ReporteGerenciales = () => {
  const toast = useRef(null)
  const [rangoFechas, setrangoFechas] = useState([new Date(new Date().getFullYear(), 0, 1), new Date()])
  const { obtenerReporteDeResumenUTILIDAD, reportegerencial_resumenGeneral, utilidadesProgramas } = useReporteStore()
  const { dataVentaxFecha, obtenerVentasPorFecha, IngresosSeparados_x_Fecha } = useVentasStore()
  const { obtenerAportesPorFechas, dataAportes } = useAportesIngresosStore()
  const { obtenerGastosPorFecha, dataGasto } = useGf_GvStore()
  const { obtenerTipoCambioPorFecha, tipocambio, obtenerTipoDeCambiosPorRangoDeFechas, dataTipoCambio } = useTipoCambioStore()
  const { obtenerUtilidadesPorCita , ventasxCita  , obtenerUtilidadesPorProducto , ventasxProducto} = useReporteStore();

  const [anio, setAnio] = useState(2024);
  const items = [
      { name: '2024', value: 2024 },
      { name: '2023', value: 2023 },
      { name: '2022', value: 2022 },
      { name: '2021', value: 2021 },
  ];
  useEffect(() => {
    if(rangoFechas[0]===null) return;
    if(rangoFechas[1]===null) return;
    obtenerReporteDeResumenUTILIDAD(rangoFechas)
    obtenerVentasPorFecha(rangoFechas)
    obtenerAportesPorFechas(rangoFechas)
    obtenerGastosPorFecha(rangoFechas)
    obtenerTipoDeCambiosPorRangoDeFechas(rangoFechas)
    // obtenerTipoCambioPorFecha(rangoFechas)
    obtenerUtilidadesPorCita(rangoFechas)
    obtenerUtilidadesPorProducto(rangoFechas)
  }, [rangoFechas])

  console.log("Rango de las fechas");
  console.log(rangoFechas);

  console.log("ventasxProducto");
  console.log(ventasxProducto);

  console.log("ventasxCita");
  console.log(ventasxCita);
  let utilidadesxNutricion = {};
  let utilidadesxTratamientoEstetico =  ventasxCita?.response?.FITOL || {};
  utilidadesxTratamientoEstetico = Object.values(utilidadesxTratamientoEstetico);

  let utilidadxSuplementos = ventasxProducto?.response?.[17] || {};
  let utilidadxAccesorio = ventasxProducto?.response?.[18] || {};



  const showToast = (severity, summary, detail, label) => {
    toast.current.show({ severity, summary, detail, label });
  };
  const onSeleccionar = (e) => {
    // Si el usuario intenta deseleccionar, evitarlo
    if (e.value) {
      setrangoFechas([new Date(e.value, 0, 1), new Date(e.value, 11, 31)])
      setAnio(e.value);
    }
};


const dataUtilidadesTratEst=[
  {
    anio: '2024',
    mes: '10 masajes reductores + biogym',
    total_ingresos: 100,
    total_gasto: 80,
    total_bene: 20,
    margen: '10'
},
  {
      anio: '2024',
      mes: '10 MASAJES REDUCTORES + GEL FRIO CON VENDA',
      total_ingresos: 100,
      total_gasto: 80,
      total_bene: 20,
      margen: '10'
  },
  {
      anio: '2024',
      mes: '10 LPG + ULTRACAVITACIÓN',
      total_ingresos: 100,
      total_gasto: 80,
      total_bene: 20,
      margen: '10'
  },
]

const dataUtilidadesSuplementos=[
  {
    anio: '2024',
    mes: 'Isology',
    total_ingresos: <NumberFormatMoney amount={3502.28}/>,
    total_gasto: <NumberFormatMoney amount={92.28}/>,
    total_bene: <NumberFormatMoney amount={3502.28-92.28}/>,
    margen: '0.97'
},
  {
      anio: '2024',
      mes: 'bfr',
      total_ingresos: <NumberFormatMoney amount={352.28}/>,
      total_gasto: <NumberFormatMoney amount={20.28}/>,
      total_bene: <NumberFormatMoney amount={352.28-20.28}/>,
      margen: '0.94'
  },
]

const dataUtilidadesAccesorio=[
  {
    anio: '2024',
    mes: 'Guantes xxl',
    total_ingresos: 100,
    total_gasto: 80,
    total_bene: 20,
    margen: '10'
},
  {
      anio: '2024',
      mes: 'Guantes small',
      total_ingresos: 100,
      total_gasto: 80,
      total_bene: 20,
      margen: '10'
  },
  {
      anio: '2024',
      mes: 'Guantes xl',
      total_ingresos: 100,
      total_gasto: 80,
      total_bene: 20,
      margen: '10'
  },
]
const dataUtilidadesNutricion=[
  {
    anio: '2024',
    mes: 'Citas',
    total_ingresos: 100,
    total_gasto: 80,
    total_bene: 20,
    margen: '10'
}
]
  return (
    <>
    <PageBreadcrumb title="Reporte gerencial" subName="reporte-gerenciales" />
    <TabView>
      <TabPanel header='CHANGE'>
        <BtnExportExcelFlujoCaja id_empresa={598} dataGastos={dataGasto} dataTipoCambio={dataTipoCambio} dataAporte={dataAportes} dataVentas={dataVentaxFecha} fechaInit={rangoFechas[0]}/>
        <Row>
          <Col xxl={4}>
          </Col>
          <Col xxl={4}>
          
          <div className="d-flex justify-content-center">
            <SelectButton value={anio} onChange={onSeleccionar} optionLabel="name" options={items} />
        </div>
          </Col>
          <Col xxl={4}>
          </Col>
        </Row>
        <Row>
          <Col xxl={12}>
            <Row>
              <Col>
                <ItemTotales itemLabel={'Ingresos'} itemTotal={<MoneyFormatter amount={600000}/>}/>
              </Col>
              <Col>
                <ItemTotales itemLabel={'Egresos'} itemTotal={<MoneyFormatter amount={200000}/>}/>
              </Col>
              <Col>
                <ItemTotales itemLabel={'Utilidad'} itemTotal={<MoneyFormatter amount={400000}/>}/>
              </Col>
              <Col>
                <ItemTotales itemLabel={'Margen'} itemTotal={`${(400000/600000).toFixed(2)}%`}/>
              </Col>
            </Row>
          </Col>
          <Col xxl={6}>
            <SimpleBar style={{height: '700px'}}>
              <Card>
                <Card.Header>
                  <Card.Title className='text-center font-20'>Total de utilidades por mes</Card.Title>
                </Card.Header>
                <Card.Body>
                  <UtilidadesMes/>
                </Card.Body>
              </Card>
            </SimpleBar>
          </Col>
          <Col xxl={6}>
            <SimpleBar style={{height: '700px'}}>
              <UtilidadesProgramas/>
              <UtilidadesProductos name_producto={'SUPLEMENTOS'} dataUtilidades={utilidadxSuplementos}/>
              <UtilidadesProductos name_producto={'ACCESORIOS'} dataUtilidades={utilidadxAccesorio}/>
              <UtilidadesCitas name_cita={"TRATAMIENTOS ESTETICOS"} dataUtilidades={utilidadesxTratamientoEstetico}/>
              <UtilidadesCitas name_cita={"NUTRICION"} dataUtilidades={utilidadesxNutricion}/>
            </SimpleBar>
          </Col>
        </Row>
      </TabPanel>
      <TabPanel header='CIRCUS'>
        <BtnExportExcelFlujoCaja id_empresa={599} dataGastos={dataGasto} dataTipoCambio={dataTipoCambio} dataAporte={dataAportes} dataVentas={dataVentaxFecha} fechaInit={rangoFechas[0]}/>
      </TabPanel>
      <TabPanel header='PERSONAL TRAINING'>
        <BtnExportExcelFlujoCaja id_empresa={0} dataGastos={dataGasto} dataTipoCambio={dataTipoCambio} dataAporte={dataAportes} dataVentas={dataVentaxFecha} fechaInit={rangoFechas[0]}/>
      </TabPanel>
    </TabView>
    </>
  )
}
