import React from 'react'

export const DataTableInventario = ({value}) => {
    
    const IdBodyTemplate = (rowData, { rowIndex })=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(`${rowIndex+1}`, globalFilterValue)}</span>
            </div>
        )
    }
    const ItemBodyTemplate = (rowData)=>{
        return (
            <>
                <div className=''>PRODUCTO</div>
            <div className="flex align-items-center gap-2 font-24 fw-bold">
                <span>{rowData.producto}</span>
            </div>
            </>
        )
    }
    const costototaldolaresBodyTemplate = (rowData)=>{
        const costo_total_dolares = (rowData.costo_unitario_dolares*rowData.cantidad)+rowData.mano_obra_dolares
        return (
            <>
                <div className='text-color-dolar'>COSTO TOTAL $.</div>
                <div className="d-flex font-24 w-100" >
                    <div className='text-left w-100 text-color-dolar fw-bold text-right'>
                    <NumberFormatMoney amount={costo_total_dolares}/>
                    </div>
                </div>
            </>
        )
    }
    const costounitariodolaresBodyTemplate = (rowData)=>{
        return (
            <div className=''> 
            <div className='text-color-dolar'> COSTO UNITARIO $.</div>
            
                <div className="d-flex font-24 w-100" >
                    <div className='text-left w-100 text-color-dolar fw-bold text-right'>
                    <NumberFormatMoney amount={rowData.costo_unitario_dolares}/>
                    </div>
                </div>
            </div>
        )
    }
    
        const costoManoObraBodyTemplate = (rowData)=>{
            return (
                <>
                <div className=''> COSTO MANO OBRA S/.</div>
                
                <div className="d-flex font-24 w-100" >
                    <div className='text-left w-100 fw-bold text-right'>
                    <NumberFormatMoney amount={rowData.mano_obra_soles}/>
                    </div>
                </div>
                </>
            )
        }
    const costototalsolesBodyTemplate = (rowData)=>{
        const costo_total_soles = (rowData.costo_unitario_soles*rowData.cantidad)+rowData.mano_obra_soles
        return (
            <>
                <div className=''> COSTO TOTAL S/.</div>
            
                <div className="d-flex font-24 w-100" >
                    <div className='text-left w-100 fw-bold text-right'>
                    <NumberFormatMoney amount={costo_total_soles}/>
                    </div>
                </div>
            </>
        )
    }
  return (
    <div>DataTableInventario</div>
  )
}
