import { NumberFormatMoney } from '@/components/CurrencyMask'
import dayjs from 'dayjs'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Table } from 'react-bootstrap'

export const ModalVistaDias = ({data, show, onHide, header}) => {

  return (
    <Dialog visible={show} onHide={onHide} header={header}>
        {/* <pre>
            {JSON.stringify(data, null, 2)}
        </pre> */}
        <Table>
            <thead>
                <tr>
                    <th>DIA</th>
                    <th>INICIO ACORDADO</th>
                    <th>INICIO ASISTIDO </th>
                    <th>MINUTOS FALTAN</th>
                    <th>MONTO POR DIA</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map(d=>{
                        return (
                            <tr>
                                <td>{dayjs.utc(d.fecha).format('dddd DD [de] MMMM [DEL] YYYY')}</td>
                                <td>{d?.asistenciaYcontrato?.contrato_empl?.hora_inicio}</td>
                                <td>{d?.asistenciaYcontrato?.marcacion_empl?.hora_marca}</td>
                                <td>{d?.asistenciaYcontrato?.minutosDiferencia>0&&d?.asistenciaYcontrato?.minutosDiferencia}</td>
                                <td>
                                    <NumberFormatMoney amount={d?.asistenciaYcontrato?.valorDia}/></td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    </Dialog>
  )
}
