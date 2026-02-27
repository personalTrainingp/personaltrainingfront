import React, { useEffect, useState } from 'react'
import { generarMesYanio } from './helpers/generarMesYanio'
import { TableResumen } from './DataTables/TableResumen'
import { useFlujoCaja } from './hook/useFlujoCaja'
import { DataTablePrincipal } from './DataTables/DataTablePrincipal'
import { ModalTableItems } from './view/ModalTableItems'
import { ModalCustomGasto } from '../GestGastos/ModalCustomGasto'
import { ViewResumenTotal } from './ViewResumenTotal'

export const ViewTablesFlujoCaja = ({arrayFecha=[], anio, id_empresa, classNameEmpresa, bgPastel}) => {
    const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja()
    const [data, setdata] = useState({isOpen: false, items: [], header: ''})
    const [isOpenModalCustomGasto, setisOpenModalCustomGasto] = useState({isOpen: false, id: 0})
    useEffect(() => {
        obtenerEgresosxFecha(id_empresa, arrayFecha)
        obtenerIngresosxFecha(id_empresa, arrayFecha)
    }, [])
    console.log({dataIngresosxFecha, dataGastosxFecha});
    const onOpenModalTableItems = (data)=>{
        console.log({data, dm: 'ass'});
        
        setdata({isOpen: true, items: data, header: ''})
    }
    const onCloseModalTableItems = ()=>{
        setdata({isOpen: false, items: [], header: ''})
    }
    const onOpenModalCustomGasto = (id)=>{
        setisOpenModalCustomGasto({isOpen: true, id: id})
    }
    const onCloseModalCustomGasto = ()=>{
        setisOpenModalCustomGasto({isOpen: false, id: 0})
    }
  return (
    <div>
            <div className='fs-1 text-center'>INGRESOS</div>
        <div className="tab-scroll-container">
            {
                dataIngresosxFecha?.map((data, i)=>{
                    return (
                        <DataTablePrincipal 
                            index={i+1}
                            id_empresa={id_empresa}
                            onOpenModalTableItems={onOpenModalTableItems} 
                            key={`${data.grupo}`} 
                            bgPastel={bgPastel} 
                            bgTotal={classNameEmpresa} 
                            itemsxDias={data?.items}  
                            nombreGrupo={data.grupo} 
                            conceptos={data.conceptos} 
                            data={dataGastosxFecha} 
                            fechas={generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1]))}/>
                    )
                })
            }
        </div>
            <div className='fs-1 text-center'>EGRESOS</div>
        <div className='tab-scroll-container'>
            {
                dataGastosxFecha.filter(f=>f.grupo!=="COMPRA PRODUCTOS/ACTIVOS").map((data,i)=>{
                    return (
                        <DataTablePrincipal 
                            index={i+1}
                            id_empresa={id_empresa}
                            onOpenModalTableItems={onOpenModalTableItems} 
                            key={`${data.grupo}`} 
                            bgPastel={bgPastel} 
                            bgTotal={classNameEmpresa} 
                            itemsxDias={data?.items}  
                            nombreGrupo={data.grupo} 
                            conceptos={data.conceptos} 
                            data={dataGastosxFecha} 
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
            <ModalTableItems show={data.isOpen} onHide={onCloseModalTableItems} items={data.items} onOpenModalCustom={onOpenModalCustomGasto}/>
            <ModalCustomGasto id={isOpenModalCustomGasto.id} id_enterprice={id_empresa} isCopy={false} onHide={onCloseModalCustomGasto} onOpenModalGasto={onOpenModalCustomGasto} show={isOpenModalCustomGasto.isOpen}/>
    </div>
  )
}
