import React, { useEffect } from 'react'
import { AppComparativoConMes } from './Pages/ComparativoConMes/AppComparativoConMes'
import { AppComparativoDiaxDia } from './Pages/ComparativoDiaxDia/AppComparativoDiaxDia'
import { AppComparativoConMesRenovaciones } from './Pages/ComparativoConMes/AppComparativoConMesRenovaciones'
import { AppDetalleMetas } from './Pages/DetalleMetas/AppDetalleMetas'
import { AppReporteSeguimientoInactivo } from './Pages/AppReporteSeguimientoInactivo/AppReporteSeguimientoInactivo'
import { AppDetalleProgramas } from './Pages/AppDetalleProgramas/AppDetalleProgramas'
import { generarMesYanio } from './helpers/generarMesYanio'
import { useSelector } from 'react-redux'
import { AppVentasMF } from './VentasMonkFit/AppVentasMF'
import { AppDetalleLeads } from './Pages/AppDetalleLeads/AppDetalleLeads'
import { Accordion } from 'react-bootstrap'
import { FechaCorteReporte } from '@/components/RangeCalendars/FechaRange'
import { AppVentasxOrigen } from './Pages/AppVentasxOrigen/AppVentasxOrigen.JSX'
import { AppAsesoresxPrograma } from './Pages/AppAsesoresxPrograma/AppAsesoresxPrograma'
export const App1 = () => {
        const { corte } = useSelector((e) => e.DATA);

    return (
        <>
        <div style={{overflowY: 'hidden'}}>
            <FechaCorteReporte corte={corte.corte} inicio={corte.inicio}/>
            <div className='' style={{overflowY: 'scroll', height: '1000px'}}>
                <MiAccordion titulo={'VENTAS POR ORIGEN'} body={<AppVentasxOrigen arrayFechas={generarMesYanio('2024-09-01 15:45:47.6640000 +00:00')} titulo={'COMPARATIVO MENSUAL VS MES ACTUAL'} corte={corte}/>}/>
                <MiAccordion titulo={'COMPARATIVO MENSUAL VS MES ACTUAL'} body={<AppComparativoConMes titulo={'COMPARATIVO MENSUAL VS MES ACTUAL'} corte={corte}/>}/>
                <MiAccordion titulo={'RESUMEN DE CUOTA VS VENTAS'} body={<AppDetalleMetas titulo={'RESUMEN DE CUOTA VS VENTAS'} corte={corte}/>}/>
                <MiAccordion titulo={'DETALLE DE INVERSIÓN EN REDES VS RESULTADOS EN LEADS'} body={<AppDetalleLeads titulo={'DETALLE DE INVERSIÓN EN REDES VS RESULTADOS EN LEADS'} corte={corte}/> }/>
                <MiAccordion titulo={'CALENDARIO DE VENTAS POR DIA'} body={<AppComparativoDiaxDia/>}/>
                <MiAccordion titulo={'VENTAS POR PROGRAMA'} body={<AppDetalleProgramas corte={corte} arrayFechas={generarMesYanio('2024-09-01 15:45:47.6640000 +00:00')}/>}/>
                <MiAccordion titulo={'RENOVACIONES'} body={<AppComparativoConMesRenovaciones titulo={'RENOVACIONES'} corte={corte}/>}/>
                <MiAccordion titulo={'PROGRAMA POR ASESOR'} body={<AppAsesoresxPrograma titulo={'PROGRAMA POR ASESOR'} corte={corte}/>}/>
                {/* <AppVentasMF titulo={'Monkey fit'} corte={corte}/> */}
                {/* <AppDetalleLeads titulo={'DETALLE DE INVERSIÓN EN REDES VS RESULTADOS EN LEADS'} corte={corte}/>  */}
                {/* <AppReporteSeguimientoInactivo/> */}
            </div>

        </div>
        </>
    )
}



function MiAccordion({titulo, body}) {
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header >
          <div className='fs-2'>
            {titulo}
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <div style={{overflowY: 'scroll', width: '100%'}}>
            {body}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
