import React from 'react'
import { ComparativaVentasxAnioxPrograma } from './ComparativaVentasxAnioxPrograma'
import { ComparativaVentasxAnio } from './ComparativaVentasxAnio'
import { TabPanel, TabView } from 'primereact/tabview'
import { ComparativaEgresosxAnio } from './ComparativaEgresosxAnio'
import { ComparativaUtilidadesxAnio } from './ComparativaUtilidadesxAnio'
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
        </TabView>
        {/* <div className='text-center text-black' style={{fontSize: '70px'}}>
            CHANGE 45
        </div>
        <ComparativaVentasxAnioxPrograma id_empresa={id_empresa} id_programa={2}/>
        <div className='text-center text-black' style={{fontSize: '70px'}}>
            FS 45
        </div>
        <ComparativaVentasxAnioxPrograma id_empresa={id_empresa} id_programa={3}/>
        <div className='text-center text-black' style={{fontSize: '70px'}}>
            FISIO MUSCLE
        </div>
        <ComparativaVentasxAnioxPrograma id_empresa={id_empresa} id_programa={4}/> */}
    </div>
  )
}
