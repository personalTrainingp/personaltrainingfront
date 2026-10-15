import React, { useMemo } from 'react'
import { Modal, Table } from 'react-bootstrap'
import dayjs from 'dayjs'

// Por cada dia del mes actual (hasta hoy): prospectos de META (tb_leadsDia) y prospectos
// registrados en gestion de prospecto. Click en un dia filtra la tabla grande por esa fecha
export const ModalProspectosRedes = ({show, onHide, data = [], leads = [], filtroFecha, onSelectFecha}) => {
  const dias = useMemo(() => {
    const metaxDia = new Map()
    data.forEach(p=>metaxDia.set(p.fecha, (metaxDia.get(p.fecha) ?? 0) + p.cantidad))
    const leadsxDia = new Map()
    leads.forEach(l=>{
      if (!l.fecha_registro) return
      const fecha = dayjs(l.fecha_registro).format('YYYY-MM-DD')
      leadsxDia.set(fecha, (leadsxDia.get(fecha) ?? 0) + 1)
    })
    const hoy = dayjs()
    const filas = []
    for (let d = hoy.startOf('month'); !d.isAfter(hoy, 'day'); d = d.add(1, 'day')) {
      const fecha = d.format('YYYY-MM-DD')
      filas.push({fecha, meta: metaxDia.get(fecha) ?? 0, prospectos: leadsxDia.get(fecha) ?? 0})
    }
    return filas
  }, [data, leads])
  const totalMeta = dias.reduce((acc, d)=>acc + d.meta, 0)
  const totalProspectos = dias.reduce((acc, d)=>acc + d.prospectos, 0)
  return (
    <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header closeButton>
            <Modal.Title>PROSPECTOS DE {dayjs().locale('es').format('MMMM YYYY').toUpperCase()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='text-muted small mb-2'>Haz click en un dia para filtrar la tabla por esa fecha</div>
            <Table bordered hover size='sm' className='text-center'>
                <thead>
                    <tr>
                        <th>FECHA</th>
                        <th>CANTIDAD DE META</th>
                        <th>CANTIDAD DE PROSPECTOS</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dias.map(d=>(
                            <tr key={d.fecha} className={`cursor-pointer ${filtroFecha===d.fecha ? 'table-primary' : ''}`} onClick={()=>onSelectFecha(d.fecha)}>
                                <td>{dayjs(d.fecha).locale('es').format('dddd D [de] MMMM')}</td>
                                <td>{d.meta}</td>
                                <td>{d.prospectos}</td>
                            </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                    <tr className='fw-bold'>
                        <td>TOTAL</td>
                        <td>{totalMeta}</td>
                        <td>{totalProspectos}</td>
                    </tr>
                </tfoot>
            </Table>
        </Modal.Body>
    </Modal>
  )
}
