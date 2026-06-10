import React, { useEffect, useState } from 'react'
import { generarMesYanio } from '../helpers/generarMesYanio'
import { Table } from 'react-bootstrap'
import { ModalTableItems } from './ModalTableItems'
import { useFlujoCaja } from '../hook/useFlujoCajaStore'
import { TrItem, TrItemBolsa2, TrItemBolsaChange2, TrItemGastos2, TrItemUtilidades2, TrItemVentas2 } from './TrItem2'
export const Trimestre1Total = ({classNameEmpresa, header, bgPastel, mesDiaDesde='', mesDiaDespues='', id_empresa}) => {
    const anio2026 = [`2026-${mesDiaDesde} 15:45:47.6640000 +00:00`, `2026-${mesDiaDespues} 15:45:47.6640000 +00:00`]
    const anio2025 = [`2025-${mesDiaDesde} 15:45:47.6640000 +00:00`, `2025-${mesDiaDespues} 15:45:47.6640000 +00:00`]
    const anio2024 = [`2024-${mesDiaDesde} 15:45:47.6640000 +00:00`, `2024-${mesDiaDespues} 15:45:47.6640000 +00:00`]
    const { obtenerIngresosxFecha:obtenerIngresos2026, dataIngresosxFecha:dataIngresos2026 } = useFlujoCaja();
    const { obtenerIngresosxFecha:obtenerIngresos2025, dataIngresosxFecha:dataIngresos2025 } = useFlujoCaja();
    const { obtenerIngresosxFecha:obtenerIngresos2024, dataIngresosxFecha:dataIngresos2024 } = useFlujoCaja();
    const { obtenerEgresosxFecha: obtenerEgresos2026, dataGastosxFecha:dataEgresos2026 } = useFlujoCaja();
    const { obtenerEgresosxFecha: obtenerEgresos2025, dataGastosxFecha:dataEgresos2025 } = useFlujoCaja();
    const { obtenerEgresosxFecha: obtenerEgresos2024, dataGastosxFecha:dataEgresos2024 } = useFlujoCaja();
    const [dataItems, setdataItems] = useState({data: [], isOpen: false})
    const onOpenModalDataItems = (data)=>{
        setdataItems({data, isOpen: true})
    }
    const onCloseModalDataItems = ()=>{
        setdataItems({data: [], isOpen: false})
    }
    useEffect(() => {
        const obtenerDatos = async () => {
            await Promise.all([
                obtenerIngresos2026(id_empresa, anio2026),
                obtenerIngresos2025(id_empresa, anio2025),
                obtenerIngresos2024(id_empresa, anio2024),
                obtenerEgresos2026(id_empresa, anio2026),
                obtenerEgresos2025(id_empresa, anio2025),
                obtenerEgresos2024(id_empresa, anio2024),
            ])
        }
        obtenerDatos()
    }, [id_empresa]);
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
                        <TrItemVentas2 mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={dataIngresos2026} arrayFechaAnterior={dataIngresos2025} id_empresa={id_empresa}/>
                        <TrItemVentas2 mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={dataIngresos2025} arrayFechaAnterior={dataIngresos2024} id_empresa={id_empresa}/>
                        <TrItemVentas2 mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2024} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={dataIngresos2024} arrayFechaAnterior={dataIngresos2024} id_empresa={id_empresa}/>
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
                        <TrItemGastos2 mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={dataEgresos2026} arrayFechaAnterior={dataEgresos2025} id_empresa={id_empresa}/>
                        <TrItemGastos2 mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={dataEgresos2025} arrayFechaAnterior={dataEgresos2024} id_empresa={id_empresa}/>
                        <TrItemGastos2 mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2024} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={dataEgresos2024} arrayFechaAnterior={dataEgresos2024} id_empresa={id_empresa}/>
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
                        <TrItemUtilidades2 arrayFechasGastos={dataEgresos2026} arrayFechaAnteriorGastos={dataEgresos2025}
    arrayFechasIngresos={dataIngresos2026} arrayFechaAnteriorIngresos={dataIngresos2025} mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={dataEgresos2026} arrayFechaAnterior={dataEgresos2025} id_empresa={id_empresa}/>
                        <TrItemUtilidades2 arrayFechasGastos={dataEgresos2025} arrayFechaAnteriorGastos={dataEgresos2024}
    arrayFechasIngresos={dataIngresos2025} arrayFechaAnteriorIngresos={dataIngresos2024} mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={dataEgresos2025} arrayFechaAnterior={dataEgresos2024} id_empresa={id_empresa}/>
                        <TrItemUtilidades2 arrayFechasGastos={dataEgresos2024} arrayFechaAnteriorGastos={dataEgresos2024}
    arrayFechasIngresos={dataIngresos2024} arrayFechaAnteriorIngresos={dataIngresos2024} mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2024} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={dataEgresos2024} arrayFechaAnterior={dataEgresos2024} id_empresa={id_empresa}/>
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
                        <TrItemBolsa2 arrayFechasGastos={dataEgresos2026} arrayFechaAnteriorGastos={dataEgresos2025}
    arrayFechasIngresos={dataIngresos2026} arrayFechaAnteriorIngresos={dataIngresos2025} mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={dataEgresos2026} arrayFechaAnterior={dataEgresos2025} id_empresa={id_empresa}/>
                        <TrItemBolsa2 arrayFechasGastos={dataEgresos2025} arrayFechaAnteriorGastos={dataEgresos2024}
    arrayFechasIngresos={dataIngresos2025} arrayFechaAnteriorIngresos={dataIngresos2024} mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={dataEgresos2025} arrayFechaAnterior={dataEgresos2024} id_empresa={id_empresa}/>
                    </tbody>
                </Table>
            </div>
        </div>
        <div>
            <div style={{fontSize: '70px'}} className='text-black text-center'>CHANGE + BOLSA</div>
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
                        <TrItemBolsaChange2 arrayFechasGastos={dataEgresos2026} arrayFechaAnteriorGastos={dataEgresos2025}
    arrayFechasIngresos={dataIngresos2026} arrayFechaAnteriorIngresos={dataIngresos2025} mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2026} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={dataEgresos2026} arrayFechaAnterior={dataEgresos2025} id_empresa={id_empresa}/>
                        <TrItemBolsaChange2 arrayFechasGastos={dataEgresos2025} arrayFechaAnteriorGastos={dataEgresos2024}
    arrayFechasIngresos={dataIngresos2025} arrayFechaAnteriorIngresos={dataIngresos2024} mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={dataEgresos2025} arrayFechaAnterior={dataEgresos2024} id_empresa={id_empresa}/>
                        <TrItemBolsaChange2 arrayFechasGastos={dataEgresos2024} arrayFechaAnteriorGastos={dataEgresos2024}
    arrayFechasIngresos={dataIngresos2024} arrayFechaAnteriorIngresos={dataIngresos2024} mesDiaDesde={mesDiaDesde} mesDiaDespues={mesDiaDespues} anio={2025} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={dataEgresos2025} arrayFechaAnterior={dataEgresos2024} id_empresa={id_empresa}/>
                    </tbody>
                </Table>
            </div>
        </div>
        {/* 
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
        */}
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
