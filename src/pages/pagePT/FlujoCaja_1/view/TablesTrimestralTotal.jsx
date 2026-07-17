import React from 'react'
import { ComparativaVentasxAnioxPrograma } from './ComparativaVentasxAnioxPrograma'
import { ComparativaVentasxAnio } from './ComparativaVentasxAnio'
import { TabPanel, TabView } from 'primereact/tabview'
import { ComparativaEgresosxAnio } from './ComparativaEgresosxAnio'
import { ComparativaUtilidadesxAnio } from './ComparativaUtilidadesxAnio'
import { ComparativaUtilidadesBolsaxAnio } from './ComparativaUtilidadesBolsaxAnio'
export const TablesTrimestralTotal = ({id_empresa}) => {
  return (
    <div>
        <TabView>
            <TabPanel header='INGRESOS'>
                <ComparativaVentasxAnio id_empresa={id_empresa}/>
            </TabPanel>
            <TabPanel header='EGRESOS'>
                <ComparativaEgresosxAnio id_empresa={id_empresa}/>
            </TabPanel>
            <TabPanel header='INGRESOS - EGRESOS = UTILIDAD / PERDIDA = CHANGE'>
                <ComparativaUtilidadesxAnio id_empresa={id_empresa}/>
            </TabPanel>
            <TabPanel header='CHANGE + BOLSA'>
                <ComparativaUtilidadesBolsaxAnio id_empresa={id_empresa}/>
            </TabPanel>
        </TabView>
    </div>
  )
}
