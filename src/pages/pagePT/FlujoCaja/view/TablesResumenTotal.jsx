import React, { useEffect, useState } from 'react'
import { ViewResumenTotal } from '../ViewResumenTotal'
import { generarMesYanio } from '../helpers/generarMesYanio'
import { Table } from 'react-bootstrap'
import { TdItem } from './TdItem'
import { TrItemVentas, TrItemEgresos, TrItemUtilidad, TrItemInventario, TrItemExtraordionario, TrItemUtilidadesSuma } from './TrItem'
import dayjs from 'dayjs'
import { useFlujoCaja } from '../hook/useFlujoCajaStore'
import { ModalTableItems } from './ModalTableItems'
export const TablesResumenTotal = ({classNameEmpresa, bgPastel, id_empresa}) => {
    const anio2026 = ['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']
    const anio2025 = ['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']
    const anio2024 = ['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']
    const anioTotal = ['2024-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']
    const [dataItems, setdataItems] = useState({data: [], isOpen: false})
    const { obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja();
    useEffect(() => {
        // obtenerIngresosxFecha(id_empresa, arrayFechas);
    }, []);
    const onOpenModalDataItems = (data)=>{
        setdataItems({data, isOpen: true})
    }
    const onCloseModalDataItems = ()=>{
        setdataItems({data: [], isOpen: false})
    }
  return (
    <div>
        <div>
            <div style={{fontSize: '70px'}} className='text-black text-center'>INGRESOS</div>
            <div className='tab-scroll-container'>
                <Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
                    <thead>
                        <tr>
                            <th style={{width: '300px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white text-center`}><div className='text-black text-center'>AÑO / MES</div></th>
                            {
                                generarMesYanio(new Date(anio2026[0]), new Date(anio2026[1])).map(e=>{
                                    return (
                                        <th className='text-center' style={{width: '240px'}}>{e.mesSTR}</th>
                                    )
                                })
                            }
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '340px'}}>TOTAL ANUAL</th>
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '340px'}}>PROMEDIO MENSUAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemVentas anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={anio2026} id_empresa={id_empresa}/>
                        <TrItemVentas anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={anio2025} id_empresa={id_empresa}/>
                        <TrItemVentas anio={2024} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={anio2024} id_empresa={id_empresa}/>
                        <TrItemVentas anio={2020} className={'fs-1'} classNameTotal={'text-center border-left-10 border-right-10 border-bottom-10 '} label='TOTAL ACUMULADO' arrayFechas={anioTotal} id_empresa={id_empresa}/>
                    </tbody>
                </Table>
            </div>
        </div>
        <div>
            <div style={{fontSize: '70px'}} className='text-black text-center'>EGRESOS</div>
            <div className='tab-scroll-container'>
                <Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
                    <thead>
                        <tr>
                            <th style={{width: '300px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white text-center`}><div className='text-black'>AÑO / MES</div></th>
                            {
                                generarMesYanio(new Date(anio2026[0]), new Date(anio2026[1])).map(e=>{
                                    return (
                                        <th className='text-center' style={{width: '240px'}}>{e.mesSTR}</th>
                                    )
                                })
                            }
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '340px'}}>TOTAL ANUAL</th>
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '340px'}}>PROMEDIO MENSUAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemEgresos onOpenModalDataItems={onOpenModalDataItems} anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={anio2026} id_empresa={id_empresa}/>
                        <TrItemEgresos onOpenModalDataItems={onOpenModalDataItems} anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={anio2025} id_empresa={id_empresa}/>
                        <TrItemEgresos onOpenModalDataItems={onOpenModalDataItems} anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={anio2024} id_empresa={id_empresa}/>
                        <TrItemEgresos onOpenModalDataItems={onOpenModalDataItems} anio={2020} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='TOTAL ACUMULADO' arrayFechas={anioTotal} id_empresa={id_empresa}/>
                    </tbody>
                </Table>
            </div>
        </div>
        <div>
            <div style={{fontSize: '70px'}} className='text-black text-center'>INGRESOS - EGRESOS = UTILIDAD / PERDIDA = CHANGE</div>
            <div className='tab-scroll-container'>
                <Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
                    <thead>
                        <tr>
                            <th style={{width: '300px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white text-center`}><div className='text-black'>AÑO / MES</div></th>
                            {
                                generarMesYanio(new Date(anio2026[0]), new Date(anio2026[1])).map(e=>{
                                    return (
                                        <th className='text-center' style={{width: '240px'}}>{e.mesSTR}</th>
                                    )
                                })
                            }
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '340px'}}>TOTAL ANUAL</th>
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '340px'}}>PROMEDIO MENSUAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemUtilidad anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={anio2026} id_empresa={id_empresa}/>
                        <TrItemUtilidad anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={anio2025} id_empresa={id_empresa}/>
                        <TrItemUtilidad anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={anio2024} id_empresa={id_empresa}/>
                        <TrItemUtilidad anio={2020} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='TOTAL ACUMULADO' arrayFechas={anioTotal} id_empresa={id_empresa}/>
                    </tbody>
                </Table>
            </div>
        </div>
        <div>
            <div style={{fontSize: '70px'}} className='text-black text-center'>BOLSA</div>
            <div className='tab-scroll-container'>
                <Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
                    <thead>
                        <tr>
                            <th style={{width: '300px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white text-center`}><div className='text-black'>AÑO / MES</div></th>
                            {
                                generarMesYanio(new Date(anio2026[0]), new Date(anio2026[1])).map(e=>{
                                    return (
                                        <th className='text-center' style={{width: '240px'}}>{e.mesSTR}</th>
                                    )
                                })
                            }
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '340px'}}>TOTAL ANUAL</th>
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '340px'}}>PROMEDIO MENSUAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemExtraordionario anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={anio2026} id_empresa={id_empresa}/>
                        <TrItemExtraordionario anio={2023} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={anio2025} id_empresa={id_empresa}/>
                        <TrItemExtraordionario anio={2020} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='TOTAL ACUMULADO' arrayFechas={anioTotal} id_empresa={id_empresa}/>
                    </tbody>
                </Table>
            </div>
        </div>
        <div>
            <div style={{fontSize: '70px'}} className='text-black text-center'>CHANGE + BOLSA </div>
            <div className='tab-scroll-container'>
                <Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
                    <thead>
                        <tr>
                            <th style={{width: '300px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white text-center`}><div className='text-black'>AÑO / MES</div></th>
                            {
                                generarMesYanio(new Date(anio2026[0]), new Date(anio2026[1])).map(e=>{
                                    return (
                                        <th className='text-center' style={{width: '240px'}}>{e.mesSTR}</th>
                                    )
                                })
                            }
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '340px'}}>TOTAL ANUAL</th>
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '340px'}}>PROMEDIO MENSUAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemUtilidadesSuma anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={anio2026} id_empresa={id_empresa}/>
                        <TrItemUtilidadesSuma anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={anio2025} id_empresa={id_empresa}/>
                        <TrItemUtilidadesSuma anio={2024} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={anio2024} id_empresa={id_empresa}/>
                        <TrItemUtilidadesSuma anio={2020} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='TOTAL ACUMULADO' arrayFechas={anioTotal} id_empresa={id_empresa}/>
                    </tbody>
                </Table>
            </div>
        </div>
        {/* 
        */}
        <div>
            <div style={{fontSize: '70px'}} className='text-black text-center'>COMPRA ACTIVOS</div>
            <div className='tab-scroll-container'>
                <Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
                    <thead>
                        <tr>
                            <th style={{width: '300px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white text-center`}><div className='text-black'>AÑO / MES</div></th>
                            {
                                generarMesYanio(new Date(anio2026[0]), new Date(anio2026[1])).map(e=>{
                                    return (
                                        <th className='text-center' style={{width: '240px'}}>{e.mesSTR}</th>
                                    )
                                })
                            }
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '340px'}}>TOTAL ANUAL</th>
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '340px'}}>PROMEDIO MENSUAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemInventario onOpenModalDataItems={onOpenModalDataItems} anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={anio2026} id_empresa={id_empresa}/>
                        <TrItemInventario onOpenModalDataItems={onOpenModalDataItems} anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={anio2025} id_empresa={id_empresa}/>
                        <TrItemInventario onOpenModalDataItems={onOpenModalDataItems} anio={2024} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={anio2024} id_empresa={id_empresa}/>
                        <TrItemInventario onOpenModalDataItems={onOpenModalDataItems} anio={2020} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='TOTAL ACUMULADO' arrayFechas={anioTotal} id_empresa={id_empresa}/>
                    </tbody>
                </Table>
            </div>
        </div> 
        
        <ModalTableItems 
                link={''}
                bgHeader={classNameEmpresa}
                textEmpresa={'textEmpresa'}
                isShowConceptos = {false}
                mes={'data.mes'}
                anio={'data.anio'}
            show={dataItems.isOpen} onHide={onCloseModalDataItems} items={dataItems.data} id_empresa={id_empresa}/>
    </div>
  )
}
