import React, { useEffect } from 'react'
import { Modal, Spinner, Table } from 'react-bootstrap'
import dayjs from 'dayjs'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { useGestionComercialStore } from './useGestionComercialStore'

const formatFecha = (fecha)=> fecha ? dayjs(fecha).format('DD/MM/YYYY') : ''

export const ModalMembresiasCliente = ({show, onHide, lead=null}) => {
  const { obtenerMembresiasxCliente, dataMembresiasCliente, isLoadingMembresias } = useGestionComercialStore()
  useEffect(() => {
    if (show && lead?.id_cli) obtenerMembresiasxCliente(lead.id_cli)
  }, [show, lead?.id_cli])
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
                    <Table responsive striped hover className='mb-0'>
                        <thead>
                            <tr>
                                <th>PROGRAMA</th>
                                <th>FECHA INICIO</th>
                                <th>FECHA FIN</th>
                                <th>MONTO</th>
                                <th>PLAN</th>
                                <th>ASESOR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataMembresiasCliente.map((m)=>(
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
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                )
            }
        </Modal.Body>
    </Modal>
  )
}
