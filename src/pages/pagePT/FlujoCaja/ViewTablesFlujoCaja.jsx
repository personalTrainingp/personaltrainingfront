import React, { useEffect, useState } from 'react'
import { generarMesYanio } from './helpers/generarMesYanio'
import { TableResumen } from './DataTables/TableResumen'
import { useFlujoCaja } from './hook/useFlujoCajaStore'
import { DataTablePrincipal } from './DataTables/DataTablePrincipal'
import { ModalTableItems } from './view/ModalTableItems'
import { ModalCustomGasto } from '../GestGastos/ModalCustomGasto'
import { ViewResumenTotal } from './ViewResumenTotal'
import { ModalTableItemsIngresos } from './view/ModalTableItemsIngresos'

export const ViewTablesFlujoCaja = ({arrayFecha=[], link, anio, id_empresa, classNameEmpresa, bgPastel, textEmpresa}) => {
    const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja()
    const [data, setdata] = useState({isOpen: false, items: [], header: ''})
    const [dataIngresos, setdataIngresos] = useState({isOpen: false, items: [], header: ''})
    useEffect(() => {
        obtenerEgresosxFecha(id_empresa, arrayFecha)
    }, [])
    useEffect(() => {
        obtenerIngresosxFecha(id_empresa, arrayFecha)
    }, [])
    
    const onOpenModalTableItems = (data)=>{
        setdata({isOpen: true, items: data, header: ''})
    }
    const onCloseModalTableItems = ()=>{
        setdata({isOpen: false, items: [], header: ''})
    }
    const onOpenModalTableItemsIngresos = (data)=>{
        setdataIngresos({isOpen: true, items: data, header: ''})
    }
    const onCloseModalTableItemsIngresos = ()=>{
        setdataIngresos({isOpen: false, items: [], header: ''})
    }
  return (
    <div>
        <div style={{fontSize: '70px'}} className='text-black text-center'>INGRESOS</div>
        <div className="tab-scroll-container">
            {
                dataIngresosxFecha
                .sort((a, b)=>a.orden-b.orden)
                ?.filter(f=>f.gastos?.length!==0)
                .filter((f)=>f.id!==121 && f.id!==46)
                ?.map((data, i)=>{
                    return (
                        <DataTablePrincipal 
                            index={i+1}
                            id_empresa={id_empresa}
                            onOpenModalTableItems={onOpenModalTableItemsIngresos} 
                            key={`${data.grupo}`} 
                            bgPastel={bgPastel} 
                            bgTotal={classNameEmpresa} 
                            itemsxDias={data?.itemsxDia}  
                            nombreGrupo={data.param_label} 
                            conceptos={data.parametro_grupo_gasto} 
                            data={dataGastosxFecha} 
                            anio={anio}
                            fechas={generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1]))}/>
                    )
                })
            }
        </div> 
            <div style={{fontSize: '70px'}} className='text-black text-center'>EGRESOS</div>
        <div className='tab-scroll-container'>
            {
                dataGastosxFecha
                .sort((a, b)=>a.orden-b.orden)
                .filter(f=>f.gastos?.length!==0)
                .filter((f)=>f.grupo!=='PRESTAMOS A TERCEROS'&& f.id!==97 && f.id!==110&& f.id!==153&& f.id!==103)
                ?.map((data,i)=>{
                    return (
                        <DataTablePrincipal 
                            index={i+1}
                            id_empresa={id_empresa}
                            onOpenModalTableItems={onOpenModalTableItems}
                            key={`${data.grupo}`}
                            bgPastel={bgPastel}
                            bgTotal={classNameEmpresa}
                            itemsxDias={data?.itemsxDia}
                            nombreGrupo={`${data.param_label}`}
                            conceptos={data.parametro_grupo_gasto}
                            data={dataGastosxFecha}
                            anio={anio}
                            fechas={generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1]))}
                            />
                    )
                })
            }
        </div>
        <div className='tab-scroll-container'>
            <ViewResumenTotal 
                onOpenModalTableItems={onOpenModalTableItems}  
                bgPastel={bgPastel} 
                bgTotal={classNameEmpresa} 
                id_enterprice={id_empresa} 
                anio={[arrayFecha[0], arrayFecha[1]]}
                fechas={generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1]))} />
        </div>
            <div style={{fontSize: '10px'}} className='text-black text-center'>EGRESOS</div>
        <div className='tab-scroll-container'>
            {
                dataGastosxFecha
                .sort((a, b)=>a.orden-b.orden)
                .filter(f=>f.gastos?.length!==0)
                .filter((f)=>f.id==97 || f.id==110 || f.id==103)
                ?.map((data,i)=>{
                    return (
                        <DataTablePrincipal 
                            index={data.id}
                            id_empresa={id_empresa}
                            onOpenModalTableItems={onOpenModalTableItems}
                            key={`${data.grupo}`}
                            bgPastel={bgPastel}
                            bgTotal={classNameEmpresa}
                            itemsxDias={data?.itemsxDia}
                            nombreGrupo={`${data.param_label}`}
                            conceptos={data.parametro_grupo_gasto}
                            data={dataGastosxFecha}
                            anio={anio}
                            fechas={generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1]))}
                            />
                    )
                })
            }
        </div>
            <ModalTableItems 
                link={link}
                bgHeader={classNameEmpresa}
                textEmpresa={textEmpresa}
            show={data.isOpen} onHide={onCloseModalTableItems} items={data.items} id_empresa={id_empresa}/>
            <ModalTableItemsIngresos
                bgHeader={classNameEmpresa}
                textEmpresa={textEmpresa}
            show={dataIngresos.isOpen} onHide={onCloseModalTableItemsIngresos} items={dataIngresos.items} id_empresa={id_empresa}/>
    </div>
  )
}
