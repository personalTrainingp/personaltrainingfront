import React, { useMemo } from 'react'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import dayjs from 'dayjs'
import { Col, Row } from 'react-bootstrap'

const orden = [
    'change 45',
    'fs 45',
    'fisio muscle'
];

// desde/hasta son fechas 'YYYY-MM-DD' (hora peruana): incluye "desde", excluye "hasta".
export const TableSeguimientos = ({desde, hasta, title='SEG', dataSeguimientoxFecha, bodyHeadcontadorDia, contadorKey, contadorLabel}) => {
        const data = useMemo(() => dataSeguimientoxFecha.filter(f =>
            (!desde || f.fecha_vencimiento >= desde) && (!hasta || f.fecha_vencimiento < hasta)
        ), [dataSeguimientoxFecha, desde, hasta])
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
        <DataTableCR
            exportExtraColumns={columnsExports}
            columns={columns}
            data={data}
        />
    </div>
  )
}
