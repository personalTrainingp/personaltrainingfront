import React, { useEffect } from 'react'
import { AppComparativoConMes } from './Pages/ComparativoConMes/AppComparativoConMes'
import { AppDetalleLeads } from './Pages/DetalleLeads/AppDetalleLeads'
import { AppComparativoDiaxDia } from './Pages/ComparativoDiaxDia/AppComparativoDiaxDia'
import { AppComparativoConMesRenovaciones } from './Pages/ComparativoConMes/AppComparativoConMesRenovaciones'
import { AppDetalleMetas } from './Pages/DetalleMetas/AppDetalleMetas'
export const App1 = () => {
    return (
        <>
        {/* <AppComparativoConMesRenovaciones titulo={'RENOVACIONES'}/> */}
        {/* <AppComparativoConMes titulo={'TOTALES'}/> */}
        <AppDetalleMetas/>
        {/* <AppDetalleLeads/> */}
        {/* <AppComparativoDiaxDia/> */}
        </>
    )
}
