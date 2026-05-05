import React from 'react'
import { ComparativaVentasxAnioxPrograma } from './ComparativaVentasxAnioxPrograma'
import { ComparativaVentasxAnio } from './ComparativaVentasxAnio'
export const TablesTrimestralTotal = ({id_empresa}) => {
  return (
    <div>
        <ComparativaVentasxAnio id_empresa={id_empresa}/>
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
