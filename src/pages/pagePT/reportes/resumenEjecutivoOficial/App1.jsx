import React, { useEffect } from 'react'
import { AppComparativoConMes } from './Pages/ComparativoConMes/AppComparativoConMes'
import { AppDetalleLeads } from './Pages/DetalleLeads/AppDetalleLeads'
import { AppComparativoDiaxDia } from './Pages/ComparativoDiaxDia/AppComparativoDiaxDia'
import { AppComparativoConMesRenovaciones } from './Pages/ComparativoConMes/AppComparativoConMesRenovaciones'
import { AppDetalleMetas } from './Pages/DetalleMetas/AppDetalleMetas'
import { AppReporteSeguimientoInactivo } from './Pages/AppReporteSeguimientoInactivo/AppReporteSeguimientoInactivo'
import { AppDetalleProgramas } from './Pages/AppDetalleProgramas/AppDetalleProgramas'
import { generarMesYanio } from './helpers/generarMesYanio'
export const App1 = () => {
    return (
        <>
        {/* <AppDetalleProgramas arrayFechas={generarMesYanio('2024-09-01 15:45:47.6640000 +00:00')}/> */}
        {/* <AppComparativoConMesRenovaciones titulo={'RENOVACIONES'}/> */}
        <AppComparativoConMes titulo={'TOTALES'}/>
        {/* <AppDetalleMetas/> */}
        {/* <AppDetalleLeads/>  */}
        {/* <AppReporteSeguimientoInactivo/> */}
        {/* <AppComparativoDiaxDia/> */}
        </>
    )
}
