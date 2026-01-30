import React, { useEffect } from 'react'
import { AppComparativoConMes } from './Pages/ComparativoConMes/AppComparativoConMes'
import { AppDetalleLeads } from './Pages/DetalleLeads/AppDetalleLeads'
import { AppComparativoDiaxDia } from './Pages/ComparativoDiaxDia/AppComparativoDiaxDia'
import { AppComparativoConMesRenovaciones } from './Pages/ComparativoConMes/AppComparativoConMesRenovaciones'
export const App1 = () => {
    return (
        <>
        <AppComparativoConMesRenovaciones titulo={'RENOVACIONES'}/>
        <AppComparativoConMes titulo={'TOTALES'}/>
        {/* <AppDetalleLeads/> */}
        {/* <AppComparativoDiaxDia/> */}
        </>
    )
}
