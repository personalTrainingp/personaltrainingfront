import React, { useMemo, useState } from 'react'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import dayjs from 'dayjs'
import { Col, Row } from 'react-bootstrap'

const orden = [
    'change 45',
    'fs 45',
    'fisio muscle'
];

// desde/hasta son fechas 'YYYY-MM-DD' (hora peruana): incluye "desde", excluye "hasta".
export const TableSeguimientos = ({desde, hasta, title='SEG', dataSeguimientoxFecha, bodyHeadcontadorDia, contadorKey, contadorLabel, nombreExcel='seguimiento', tieneHuella=()=>null}) => {
        const data = useMemo(() => dataSeguimientoxFecha.filter(f =>
            (!desde || f.fecha_vencimiento >= desde) && (!hasta || f.fecha_vencimiento < hasta)
        ), [dataSeguimientoxFecha, desde, hasta])
        // Reporte general de la tabla: huellas y contratos (ultima membresia de cada socio)
        const huellasCargando = tieneHuella('') === null
        const conHuella = huellasCargando ? 0 : data.filter(f => tieneHuella(f.dni)).length
        const conContrato = data.filter(f => f.contrato === 'CON CONTRATO').length
        const sinContrato = data.filter(f => f.contrato === 'SIN CONTRATO').length
        const noRequiere = data.length - conContrato - sinContrato
        const pct = (n, total) => total === 0 ? '0.00' : ((n / total) * 100).toFixed(2)
        const filtroNoRequiere = { label: 'NO REQUIERE CONTRATO', filtro: (f) => f.contrato === 'NO REQUIERE' }
        const tarjetasReporte = [
            {
                titulo: 'HUELLAS',
                items: [
                    { label: 'SIN HUELLA', valor: data.length - conHuella, total: data.length, cargando: huellasCargando, filtro: (f) => tieneHuella(f.dni) === false },
                    { label: 'CON HUELLA', valor: conHuella, total: data.length, cargando: huellasCargando, filtro: (f) => tieneHuella(f.dni) === true },
                ],
            },
            {
                titulo: 'CONTRATOS',
                items: [
                    { label: 'SIN CONTRATO', valor: sinContrato, total: conContrato + sinContrato, filtro: (f) => f.contrato === 'SIN CONTRATO' },
                    { label: 'CON CONTRATO', valor: conContrato, total: conContrato + sinContrato, filtro: (f) => f.contrato === 'CON CONTRATO' },
                ],
            },
        ]
        // Al hacer click en un numero del reporte se filtra la tabla (otro click lo quita)
        const [filtroReporte, setfiltroReporte] = useState(null)
        const filtroActivo = [...tarjetasReporte.flatMap(t => t.items), filtroNoRequiere].find(r => r.label === filtroReporte)
        const dataTabla = filtroActivo ? data.filter(filtroActivo.filtro) : data
        const onClickReporte = (r) => {
            if (r.cargando) return
            setfiltroReporte(actual => actual === r.label ? null : r.label)
        }
        const resultado = Object.values(
            data.reduce((acc, item) => {
                if (!acc[item.nombre_programa]) {
                acc[item.nombre_programa] = {
                    nombre_programa: item.nombre_programa,
                    data: [],
                };
                }

                acc[item.nombre_programa].data.push(item);

                return acc;
            }, {})
            );
        const columns=[
            {id: 0, header: 'id', render: (row, index)=>{
                return (
                    <>
                    <div style={{fontSize: '20px'}}>
                        {index+1}
                    </div>
                    </>
                )
            }},
            {id: 1, header: 'SOCIO', accessor: 'nombres_apellidos_cli', render: (row)=>{
                return (
                    <>
                    <span className='' style={{fontSize: '15px'}}>
                        <div>
                            {`${row?.nombres_cli} ${row?.apPaterno_cli} ${row?.apMaterno_cli}`}
                        </div>
                        <div>
                            EMAIL: {row.email_cli}
                        </div>
                        <div>
                            TELEFONO: {row.tel_cli}
                        </div>

                    </span>
                    </>
                )
            }},
            {id: 2, header: <>PROGRAMA/SESIONES/<br/>HORARIO</>, render:(row)=>{
                return (
                    <>
                    <div style={{fontSize: '20px'}}>
                        <div>
                            {row.nombre_programa}
                        </div>
                        <div>
                            {dayjs.utc(row.horario, 'hh:mm:ss').format('hh:mm A')}
                        </div>
                    </div>
                    </>
                )
            }},
            {id: 3, header: bodyHeadcontadorDia, accessor: contadorKey, sortable: true, render: (row)=>{
                return (
                    <>
                        {row[contadorKey]}
                    <span className='mx-1' style={{fontSize: '15px'}}>
                        {contadorLabel}
                    </span>
                    </>
                )
            }},
            {id: 4, header: <>fecha de <br/> vencimiento</>, render: (row)=>{
                return (
                    <>
                    <div style={{fontSize: '15px'}}>
                        {row.fecha_vencimiento_}
                    </div>
                    </>
                )
            }},
        ]
        const columnsExports = [
            {
                id: 'id',
                exportHeader: 'ID',
                exportValue: (row) => row.id,
		    },
            {
                id: 'cliente',
                exportHeader: 'CLIENTE',
                exportValue: (row)=>`${row.nombres_cli} ${row.apPaterno_cli} ${row.apMaterno_cli}`
            },
            {
                id: 'diasvencidos',
                exportHeader: 'FECHA DE VENCIMIENTO',
                exportValue: (row)=>row.fecha_vencimiento
            },
            {id: 'programa', exportHeader: 'programa', exportValue: (row)=>`${row.nombre_programa}`},
            {id: 'id_venta', exportHeader: 'N° VENTA', exportValue: (row)=>row.id_venta},
            {id: 'fecha_venta', exportHeader: 'FECHA DE VENTA', exportValue: (row)=>row.fecha_venta},
            {id: 'monto_venta', exportHeader: 'MONTO VENTA S/.', exportValue: (row)=>row.monto_venta},
            {id: 'cantidad_membresias', exportHeader: 'CANTIDAD DE MEMBRESIAS', exportValue: (row)=>row.cantidad_membresias},
            {id: 'contador', exportHeader: bodyHeadcontadorDia, exportValue: (row)=>row[contadorKey]},
            {id: 'email', exportHeader: 'email', exportValue: (row)=>`${row.email_cli}`},
            {id: 'telefono', exportHeader: 'TELEFONO', exportValue: (row)=>`${row.tel_cli}`},
        ]

  return (
    <div className='m-2' style={{width: '80%'}}>
        <div className='fs-2 fw-bold text-change'>
            {title}
            <span className='text-black mx-1'>
                TOTAL
            </span>
            <span className='text-black mx-2'>
                {data.length}
            </span>
        </div>
        <div>
            <Row>
                {
                    resultado
                        .sort((a, b) => {
                            const ia = orden.indexOf(a.nombre_programa.toLowerCase());
                            const ib = orden.indexOf(b.nombre_programa.toLowerCase());

                            if (ia === -1 && ib === -1) {
                                return a.nombre_programa.localeCompare(b.nombre_programa);
                            }
                            if (ia === -1) return 1;
                            if (ib === -1) return -1;

                            return ia - ib;
                        }).map(m=>{
                        return (
                            <Col lg={4} key={m.nombre_programa}>
                                <div className='card p-3'>
                                    <span className='fs-2'>
                                        {m.nombre_programa}
                                    </span>
                                    <div className='fs-2 fw-bold text-change'>
                                        {m.data.length} / {((m.data.length/data.length)*100).toFixed(2)}%
                                    </div>
                                </div>
                            </Col>
                        )
                    })
                }
            </Row>
        </div>
        <Row className='my-2'>
            {
                tarjetasReporte.map(t=>(
                    <Col xs={6} key={t.titulo}>
                        <div className='card p-3 h-100 mb-0'>
                            <div className='fs-3 fw-bold'>{t.titulo}</div>
                            <ul className='list-unstyled mb-0'>
                                {
                                    t.items.map(r=>(
                                        <li
                                            key={r.label}
                                            onClick={()=>onClickReporte(r)}
                                            className={`d-flex justify-content-between align-items-center px-2 my-1 rounded fs-4 ${r.cargando ? '' : 'cursor-pointer'}`}
                                            style={{ border: `2px solid ${filtroReporte === r.label ? 'currentColor' : 'transparent'}` }}
                                            title={filtroReporte === r.label ? 'Quitar filtro' : `Filtrar la tabla: ${r.label}`}
                                        >
                                            <span>{r.label}</span>
                                            {
                                                r.cargando
                                                    ? <span className='text-muted'>...</span>
                                                    : <span><b className='text-change'>{r.valor}</b> <span className='fs-5'>/ {pct(r.valor, r.total)}%</span></span>
                                            }
                                        </li>
                                    ))
                                }
                                {
                                    t.titulo === 'CONTRATOS' && noRequiere > 0 && (
                                        <li
                                            onClick={()=>onClickReporte(filtroNoRequiere)}
                                            className='px-2 my-1 rounded fs-6 text-muted cursor-pointer'
                                            style={{ border: `2px solid ${filtroReporte === filtroNoRequiere.label ? 'currentColor' : 'transparent'}` }}
                                            title='Ultima membresia con monto 0: no requiere contrato'
                                        >
                                            {noRequiere} no requieren contrato (monto 0)
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </Col>
                ))
            }
        </Row>
        {
            filtroActivo && (
                <div className='mb-2 fs-5'>
                    Mostrando <b>{dataTabla.length}</b> socios: <b>{filtroActivo.label}</b>
                    <a className='ms-3 text-danger cursor-pointer' onClick={()=>setfiltroReporte(null)}>Quitar filtro</a>
                </div>
            )
        }
        <DataTableCR
            exportExtraColumns={columnsExports}
            exportFileName={nombreExcel}
            columns={columns}
            data={dataTabla}
        />
    </div>
  )
}
