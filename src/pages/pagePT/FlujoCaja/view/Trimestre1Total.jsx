import React, { useEffect, useState } from 'react'
import { ViewResumenTotal } from '../ViewResumenTotal'
import { generarMesYanio } from '../helpers/generarMesYanio'
import { Table } from 'react-bootstrap'
import { TdItem } from './TdItem'
import { TrItemVentas, TrItemEgresos, TrItemUtilidad, TrItemInventario, TrItemExtraordionario, TrItemUtilidadesSuma } from './TrItemTrimestre'
import dayjs from 'dayjs'
import { useFlujoCaja } from '../hook/useFlujoCajaStore'
import { ModalTableItems } from './ModalTableItems'
export const Trimestre1Total = ({classNameEmpresa, header, bgPastel, mesDiaDesde='', mesDiaDespues='', id_empresa}) => {
    const anio2026 = [`2026-${mesDiaDesde} 15:45:47.6640000 +00:00`, `2026-${mesDiaDespues} 15:45:47.6640000 +00:00`]
    const anio2025 = [`2025-${mesDiaDesde} 15:45:47.6640000 +00:00`, `2025-${mesDiaDespues} 15:45:47.6640000 +00:00`]
    const anio2024 = [`2024-${mesDiaDesde} 15:45:47.6640000 +00:00`, `2024-${mesDiaDespues} 15:45:47.6640000 +00:00`]
    const anioTotal = [`2024-${mesDiaDesde} 15:45:47.6640000 +00:00`, `2026-${mesDiaDespues} 15:45:47.6640000 +00:00`]
    const [dataItems, setdataItems] = useState({data: [], isOpen: false})
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
                                        <>
                                        <th className='text-center fs-2' style={{width: '240px'}}>{e.mesSTR}</th>
                                        <th className='text-center' style={{width: '160px'}}>{'%'}</th>
                                        </>
                                    )
                                })
                            }
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10 fs-2' style={{width: '340px'}}>TOTAL <br/> {header}</th>
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10 fs-2' style={{width: '340px'}}>PROMEDIO <br/> {header}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemVentas mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={anio2026} arrayFechaAnterior={anio2025} id_empresa={id_empresa}/>
                        <TrItemVentas mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={anio2025} arrayFechaAnterior={anio2024} id_empresa={id_empresa}/>
                        <TrItemVentas mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2024} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={anio2024} arrayFechaAnterior={anio2024} id_empresa={id_empresa}/>
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
                                        <>
                                        <th className='text-center fs-2' style={{width: '240px'}}>{e.mesSTR}</th>
                                        <th className='text-center fs-2' style={{width: '240px'}}>{'%'}</th>
                                        </>
                                    )
                                })
                            }
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10 fs-2' style={{width: '340px'}}>TOTAL <br/> {header}</th>
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10 fs-2' style={{width: '340px'}}>PROMEDIO <br/> {header}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemEgresos mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} onOpenModalDataItems={onOpenModalDataItems} anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={anio2026} arrayFechaAnterior={anio2025} id_empresa={id_empresa}/>
                        <TrItemEgresos mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} onOpenModalDataItems={onOpenModalDataItems} anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={anio2025} arrayFechaAnterior={anio2024} id_empresa={id_empresa}/>
                        <TrItemEgresos mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} onOpenModalDataItems={onOpenModalDataItems} anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={anio2024} arrayFechaAnterior={anio2024} id_empresa={id_empresa}/>
                    </tbody>
                </Table>
            </div>
        </div>
        <div>
            <div style={{fontSize: '70px'}} className='text-black text-center'>RESULTADO CHANGE</div>
            <div className='tab-scroll-container'>
                <Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
                    <thead>
                        <tr>
                            <th style={{width: '300px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white text-center`}><div className='text-black'>AÑO / MES</div></th>
                            {
                                generarMesYanio(new Date(anio2026[0]), new Date(anio2026[1])).map(e=>{
                                    return (
                                        <>
                                        <th className='text-center fs-2' style={{width: '240px'}}>{e.mesSTR}</th>
                                        <th className='text-center fs-2' style={{width: '240px'}}>{'%'}</th>
                                        </>
                                    )
                                })
                            }
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10 fs-2' style={{width: '340px'}}>TOTAL <br/> {header}</th>
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10 fs-2' style={{width: '340px'}}>PROMEDIO <br/> {header}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemUtilidad mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={anio2026} arrayFechaAnterior={anio2025} id_empresa={id_empresa}/>
                        <TrItemUtilidad mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={anio2025} arrayFechaAnterior={anio2024} id_empresa={id_empresa}/>
                        <TrItemUtilidad mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={anio2024} arrayFechaAnterior={anio2024} id_empresa={id_empresa}/>
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
                                        <>
                                            <th className='text-center fs-2' style={{width: '240px'}}>{e.mesSTR}</th>
                                            <th className='text-center fs-2' style={{width: '240px'}}>{'%'}</th>
                                        </>
                                    )
                                })
                            }
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10 fs-2' style={{width: '340px'}}>TOTAL <br/> {header}</th>
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10 fs-2' style={{width: '340px'}}>PROMEDIO <br/> {header}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemExtraordionario mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={anio2026} arrayFechaAnterior={anio2025} id_empresa={id_empresa}/>
                        <TrItemExtraordionario  mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2023} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={anio2025} arrayFechaAnterior={anio2025} id_empresa={id_empresa}/>
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
                                        <>
                                            <th className='text-center fs-2' style={{width: '240px'}}>{e.mesSTR}</th>
                                            <th className='text-center fs-2' style={{width: '240px'}}>{'%'}</th>
                                        </>
                                    )
                                })
                            }
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10 fs-2' style={{width: '340px'}}>TOTAL <br/> {header}</th>
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10 fs-2' style={{width: '340px'}}>PROMEDIO <br/> {header}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemUtilidadesSuma mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={anio2026} arrayFechaAnterior={anio2025} id_empresa={id_empresa}/>
                        <TrItemUtilidadesSuma mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={anio2025} arrayFechaAnterior={anio2024} id_empresa={id_empresa}/>
                        <TrItemUtilidadesSuma mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2024} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={anio2024} arrayFechaAnterior={anio2024} id_empresa={id_empresa}/>
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
                                        <>
                                            <th className='text-center fs-2' style={{width: '240px'}}>{e.mesSTR}</th>
                                            <th className='text-center fs-2' style={{width: '240px'}}>{'%'}</th>
                                        </>
                                    )
                                })
                            }
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10 fs-2' style={{width: '340px'}}>TOTAL <br/> {header}</th>
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10 fs-2' style={{width: '340px'}}>PROMEDIO <br/> {header}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemInventario  mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} onOpenModalDataItems={onOpenModalDataItems} anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={anio2026} arrayFechaAnterior={anio2025} id_empresa={id_empresa}/>
                        <TrItemInventario  mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} onOpenModalDataItems={onOpenModalDataItems} anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={anio2025} arrayFechaAnterior={anio2024} id_empresa={id_empresa}/>
                        <TrItemInventario  mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} onOpenModalDataItems={onOpenModalDataItems} anio={2024} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={anio2024} arrayFechaAnterior={anio2024} id_empresa={id_empresa}/>
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
