import React, { useEffect, useMemo } from 'react'
import { Badge, Modal, Spinner, Table } from 'react-bootstrap'
import dayjs from 'dayjs'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { useGestionComercialStore } from './useGestionComercialStore'

const formatFecha = (fecha)=> fecha ? dayjs(fecha).format('DD/MM/YYYY') : ''
const dia = (fecha)=> dayjs(fecha).startOf('day')

// Días sin membresía entre el fin de la anterior y el inicio de cada una (null = primera membresía).
// Se compara con el fin más tardío de las anteriores: si renovó antes de vencer, son 0 días.
const conDiasInactivo = (membresias)=>{
  const ordenadas = [...membresias].sort((a, b)=> dia(a.fec_inicio_mem).diff(dia(b.fec_inicio_mem)))
  let finAnterior = null
  const diasInactivo = new Map()
  for (const m of ordenadas) {
    diasInactivo.set(m.id, finAnterior && m.fec_inicio_mem ? Math.max(dia(m.fec_inicio_mem).diff(finAnterior, 'day') - 1, 0) : null)
    if (m.fec_fin_mem && (!finAnterior || dia(m.fec_fin_mem).isAfter(finAnterior))) finAnterior = dia(m.fec_fin_mem)
  }
  // Días que lleva inactivo hoy desde que venció su última membresía (0 = activo)
  const inactivoHoy = finAnterior && dayjs().startOf('day').isAfter(finAnterior) ? dayjs().startOf('day').diff(finAnterior, 'day') : 0
  // La más reciente primero
  return { membresias: ordenadas.reverse(), diasInactivo, inactivoHoy, ultimoFin: finAnterior }
}

const BadgeDiasInactivo = ({dias})=>{
  if (dias === null) return <Badge bg='secondary'>PRIMERA MEMBRESIA</Badge>
  if (dias === 0) return <Badge bg='success'>CONTINUO</Badge>
  return <Badge bg={dias > 30 ? 'danger' : 'warning'} text={dias > 30 ? undefined : 'dark'}>{dias} {dias === 1 ? 'DIA' : 'DIAS'}</Badge>
}

export const ModalMembresiasCliente = ({show, onHide, lead=null}) => {
  const { obtenerMembresiasxCliente, dataMembresiasCliente, isLoadingMembresias } = useGestionComercialStore()
  useEffect(() => {
    if (show && lead?.id_cli) obtenerMembresiasxCliente(lead.id_cli)
  }, [show, lead?.id_cli])
  const { membresias, diasInactivo, inactivoHoy, ultimoFin } = useMemo(()=>conDiasInactivo(dataMembresiasCliente), [dataMembresiasCliente])
  return (
    <Modal show={show} onHide={onHide} size='xl'>
        <Modal.Header closeButton>
            <Modal.Title>
                MEMBRESIAS {lead?.cliente?.nombres_apellidos_cli ? `- ${lead.cliente.nombres_apellidos_cli}` : ''}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {
                isLoadingMembresias ? (
                    <div className='text-center py-4'><Spinner animation='border'/></div>
                ) : dataMembresiasCliente.length === 0 ? (
                    <div className='text-center text-muted py-4'>EL CLIENTE NO TIENE MEMBRESIAS</div>
                ) : (
                    <>
                    <div className='mb-3 fs-5'>
                        {
                            inactivoHoy > 0 ? (
                                <span>ESTADO ACTUAL: <Badge bg='danger'>INACTIVO HACE {inactivoHoy} {inactivoHoy === 1 ? 'DIA' : 'DIAS'}</Badge> <span className='text-muted fs-6'>(su última membresía venció el {ultimoFin.format('DD/MM/YYYY')})</span></span>
                            ) : (
                                <span>ESTADO ACTUAL: <Badge bg='success'>ACTIVO</Badge></span>
                            )
                        }
                    </div>
                    <Table responsive striped hover className='mb-0'>
                        <thead>
                            <tr>
                                <th>PROGRAMA</th>
                                <th>FECHA INICIO</th>
                                <th>FECHA FIN</th>
                                <th>MONTO</th>
                                <th>PLAN</th>
                                <th>ASESOR</th>
                                <th title='Días sin membresía entre el fin de la membresía anterior y el inicio de esta'>DIAS INACTIVO PREVIOS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                membresias.map((m)=>(
                                    <tr key={m.id}>
                                        <td>{m.tb_ProgramaTraining?.name_pgm ?? 'SIN DEFINIR'}</td>
                                        <td>{formatFecha(m.fec_inicio_mem)}</td>
                                        <td>{formatFecha(m.fec_fin_mem)}</td>
                                        <td><NumberFormatMoney amount={m.tarifa_monto ?? 0} className=''/></td>
                                        <td>
                                            {m.tb_semana_training?.semanas_st ? `${m.tb_semana_training.semanas_st} SEMANAS` : ''}
                                            {m.tarifa_venta?.nombreTarifa_tt ? ` - ${m.tarifa_venta.nombreTarifa_tt}` : ''}
                                        </td>
                                        <td>{m.tb_ventum?.tb_empleado?.nombres_apellidos_empl}</td>
                                        <td><BadgeDiasInactivo dias={diasInactivo.get(m.id)}/></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                    </>
                )
            }
        </Modal.Body>
    </Modal>
  )
}
