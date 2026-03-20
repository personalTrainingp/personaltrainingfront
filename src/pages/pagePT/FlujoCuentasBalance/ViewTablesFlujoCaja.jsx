import React, { useEffect, useState } from 'react'
import { generarMesYanio } from './helpers/generarMesYanio'
import { TableResumen } from './DataTables/TableResumen'
import { useFlujoCaja } from './hook/useFlujoCajaStore'
import { DataTablePrincipal } from './DataTables/DataTablePrincipal'
import { ModalTableItems } from './view/ModalTableItems'
import { ModalCustomGasto } from '../GestGastos/ModalCustomGasto'
import { ViewResumenTotal } from './ViewResumenTotal'
import { ModalCustomCuentasBalances } from '../CuentasBalances/ModalCustomCuentasBalances'

export const ViewTablesFlujoCaja = ({arrayFecha=[], anio, id_empresa, classNameEmpresa, bgPastel, textEmpresa, bgTotal}) => {
    const { dataCuentasBalancexFecha:dataPorPagarxFecha, obtenerCuentasBalancexFecha: obtenerPorPagarxFecha } = useFlujoCaja()
    const { dataCuentasBalancexFecha: dataPorCobrarxFecha, obtenerCuentasBalancexFecha: obtenerPorCobrarxFecha } = useFlujoCaja()
    const [data, setdata] = useState({isOpen: false, items: [], header: ''})
    const [isOpenModalCustomGasto, setisOpenModalCustomGasto] = useState({isOpen: false, id: 0, headerTipo: ''})
    useEffect(() => {
        obtenerPorPagarxFecha(id_empresa, arrayFecha, 'PorPagar')
        obtenerPorCobrarxFecha(id_empresa, arrayFecha, 'PorCobrar')
    }, [])
    const onOpenModalTableItems = (data)=>{
        setdata({isOpen: true, items: data, header: ''})
    }
    const onCloseModalTableItems = ()=>{
        setdata({isOpen: false, items: [], header: ''})
    }
    const onOpenModalCustomGasto = (id, headerTipo)=>{
        setisOpenModalCustomGasto({isOpen: true, id: id, headerTipo})
    }
    const onCloseModalCustomGasto = ()=>{
        setisOpenModalCustomGasto({isOpen: false, id: 0, headerTipo: ''})
    }
  return (
    <div>
        <div className='fs-1 text-center'>CUENTAS POR COBRAR</div>
        <div className="tab-scroll-container">
            {
                dataPorCobrarxFecha?.map((data, i)=>{
                    return (
                        <DataTablePrincipal 
                            index={i+1}
                            anio={anio}
                            id_empresa={id_empresa}
                            onOpenModalTableItems={onOpenModalTableItems} 
                            tipo={'PorCobrar'}
                            key={`${data.grupo}`} 
                            bgPastel={bgPastel} 
                            bgTotal={classNameEmpresa} 
                            itemsxDias={data?.items}  
                            nombreGrupo={data.grupo} 
                            conceptos={data.conceptos} 
                            data={dataPorCobrarxFecha} 
                            fechas={generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1]))}/>
                    )
                })
            }
        </div>
            <div className='fs-1 text-center'>CUENTAS POR PAGAR</div>
        <div className='tab-scroll-container'>
            {
                dataPorPagarxFecha.filter(f=>f.grupo!=="COMPRA PRODUCTOS/ACTIVOS").map((data,i)=>{
                    return (
                        <DataTablePrincipal 
                            index={i+1}
                            anio={anio}
                            id_empresa={id_empresa}
                            onOpenModalTableItems={onOpenModalTableItems} 
                            key={`${data.grupo}`} 
                            tipo={'PorPagar'}
                            bgPastel={bgPastel} 
                            bgTotal={classNameEmpresa} 
                            itemsxDias={data?.items}  
                            nombreGrupo={data.grupo} 
                            conceptos={data.conceptos} 
                            data={dataPorPagarxFecha} 
                            fechas={generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1]))}
                            />
                    )
                })
            }
        </div>
        <div className='tab-scroll-container'>
            {/* <ViewResumenTotal 
                onOpenModalTableItems={onOpenModalTableItems}  
                bgPastel={bgPastel} 
                bgTotal={classNameEmpresa} 
                id_enterprice={id_empresa} 
                anio={[arrayFecha[0], arrayFecha[1]]}
                fechas={generarMesYanio(new Date(arrayFecha[0]), new Date(arrayFecha[1]))} /> */}
        </div>
            <ModalTableItems textEmpresa={textEmpresa} bgTotal={classNameEmpresa} show={data.isOpen} onHide={onCloseModalTableItems} items={data.items} onOpenModalCustom={onOpenModalCustomGasto}/>
            <ModalCustomCuentasBalances headerTipo={isOpenModalCustomGasto.headerTipo} tipo={isOpenModalCustomGasto.headerTipo} id={isOpenModalCustomGasto.id} idEmpresa={id_empresa} isCopy={false} onHide={onCloseModalCustomGasto} onOpenModalGasto={onOpenModalCustomGasto} show={isOpenModalCustomGasto.isOpen}/>
    </div>
  )
}
