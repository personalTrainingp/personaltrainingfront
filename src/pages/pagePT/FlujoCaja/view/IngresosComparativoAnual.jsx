import React, { useState } from 'react'
import { Table } from 'react-bootstrap'
import { generarMesYanio } from '../helpers/generarMesYanio'
import { TrItemVentas } from './TrItem'
import { ModalTableItems } from './ModalTableItems'

const anio2026 = ['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']
const anio2025 = ['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']
const anio2024 = ['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']
const anioTotal = ['2024-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']

const FILAS = [
    { label: '2026', anio: 2026, arrayFechas: anio2026, className: 'fs-2', classNameTotal: 'text-center border-left-10 border-right-10' },
    { label: '2025', anio: 2025, arrayFechas: anio2025, className: 'fs-2', classNameTotal: 'text-center border-left-10 border-right-10' },
    { label: '2024', anio: 2024, arrayFechas: anio2024, className: 'fs-2', classNameTotal: 'text-center border-left-10 border-right-10' },
    { label: 'TOTAL ACUMULADO', anio: 2020, arrayFechas: anioTotal, className: 'fs-1', classNameTotal: 'text-center border-left-10 border-right-10 border-bottom-10 ' },
]

// Tablas de ingresos del COMPARATIVO ANUAL del flujo de caja.
// filtroItem null = todos los ingresos; si no, por concepto (id_gasto).
const TABLAS = [
    { titulo: 'INGRESOS', filtroItem: null },
    { titulo: 'INGRESOS PROGRAMAS', filtroItem: (f) => f.id_gasto === 1148 },
    { titulo: 'INGRESOS SUPLEMENTOS', filtroItem: (f) => f.id_gasto === 1149 },
    { titulo: 'INGRESOS ACCESORIOS', filtroItem: (f) => f.id_gasto === 1150 },
]

export const IngresosComparativoAnual = ({ id_empresa, classNameEmpresa }) => {
    const [dataItems, setdataItems] = useState({ data: [], isOpen: false })
    const onOpenModalDataItems = (data) => setdataItems({ data, isOpen: true })
    const onCloseModalDataItems = () => setdataItems({ data: [], isOpen: false })
    const meses = generarMesYanio(new Date(anio2026[0]), new Date(anio2026[1]))
    return (
        <>
            {TABLAS.map((t) => (
                <div key={t.titulo}>
                    <div style={{ fontSize: '70px' }} className='text-black text-center'>{t.titulo}</div>
                    <div className='tab-scroll-container'>
                        <Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
                            <thead>
                                <tr>
                                    <th style={{ width: '300px' }} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white text-center`}><div className='text-black text-center'>AÑO / MES</div></th>
                                    {meses.map((e, i) => (
                                        <th key={i} className='text-center' style={{ width: '240px' }}>{e.mesSTR}</th>
                                    ))}
                                    <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{ width: '340px' }}>TOTAL ANUAL</th>
                                    <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{ width: '340px' }}>PROMEDIO MENSUAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {FILAS.map((f) => (
                                    <TrItemVentas
                                        key={f.label}
                                        filtroItem={t.filtroItem}
                                        onOpenModalDataItems={onOpenModalDataItems}
                                        anio={f.anio} className={f.className} classNameTotal={f.classNameTotal}
                                        label={f.label} arrayFechas={f.arrayFechas} id_empresa={id_empresa}
                                    />
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            ))}
            <ModalTableItems
                link={''}
                bgHeader={classNameEmpresa}
                textEmpresa={'textEmpresa'}
                isShowConceptos={false}
                mes={'data.mes'}
                anio={'data.anio'}
                show={dataItems.isOpen} onHide={onCloseModalDataItems} items={dataItems.data} id_empresa={id_empresa}
            />
        </>
    )
}
