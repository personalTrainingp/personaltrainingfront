import React, { useEffect, useState } from 'react'
import { useFlujoCaja } from './hook/useFlujoCajaStore'

export const ViewTablesFlujoCaja2 = ({arrayFecha=[], link, anio, id_empresa, classNameEmpresa, bgPastel, textEmpresa}) => {
    const { dataGastosxFecha, obtenerFlujoCaja, dataFlujoCaja } = useFlujoCaja()
    const [data, setdata] = useState({isOpen: false, items: [], itemsAcumulados: {}, anio: 2024, mes: 9, header: '', isShowConceptos: false})
    useEffect(() => {
        obtenerFlujoCaja(id_empresa, arrayFecha)
    }, [id_empresa, arrayFecha])
  return (
    <div>
        <div style={{fontSize: '70px'}} className='text-black text-center'>EGRESOS</div>
        <div className='tab-scroll-container'>
            
        </div>
        <pre>
            {JSON.stringify(dataFlujoCaja, null, 2)}
        </pre>
        {/* <div className='tab-scroll-container'>
            <ViewResumenTotal 
                onOpenModalTableItems={onOpenModalTableItems}  
                bgPastel={bgPastel} 
                bgTotal={classNameEmpresa} 
                id_enterprice={id_empresa} 
                anio={[arrayFecha[0], arrayFecha[1]]}
                fechas={generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1]))} />
        </div> */}
            {/* <div style={{fontSize: '10px'}} className='text-black text-center'>EGRESOS</div>
        <div className='tab-scroll-container'>
            {
                dataGastosxFecha.flujoxGrupo
                .sort((a, b)=>a.orden-b.orden)
                .filter(f=>f.gastos?.length!==0)
                .filter((f)=>f.id==97 || f.id==110 || f.id==103)
                ?.map((data,i, arr)=>{
                    return (
                        <DataTablePrincipal 
                            index={i+1}
                            id_empresa={id_empresa}
                            onOpenModalTableItems={onOpenModalTableItems}
                            key={`${data.grupo}`}
                            bgPastel={bgPastel}
                            bgTotal={classNameEmpresa}
                            itemsxDias={data?.itemsxDia}
                            data={arr}
                            nombreGrupo={`${data.param_label}`}
                            conceptos={data.parametro_grupo_gasto}
                            anio={anio}
                            fechas={generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1]))}
                            />
                    )
                })
            }
        </div> */}
        {/* <ModalTableItems 
                link={link}
                bgHeader={classNameEmpresa}
                textEmpresa={textEmpresa}
                isShowConceptos = {data.isShowConceptos}
                itemsAcumulados={data.itemsAcumulados}
                mes={data.mes}
                anio={data.anio}
            show={data.isOpen} onHide={onCloseModalTableItems} items={data.items} id_empresa={id_empresa}/> */}
    </div>
  )
}
