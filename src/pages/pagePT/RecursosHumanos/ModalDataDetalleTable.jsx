import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { Dialog } from 'primereact/dialog'
import React, { useState } from 'react'
import { Table } from 'react-bootstrap'
import { ModalVistaDias } from './ModalVistaDias'

export const ModalDataDetalleTable = ({mesAnio, show, onHide, data, dataContratoxFecha, dataMarcacionxFecha, unirAsistenciaYContrato}) => {
  const [isOpenModalVistaDias, setisOpenModalVistaDias] = useState(false)
  const [dataVistaDias, setdataVistaDias] = useState([])
  const dataContratoConMarcacion = dataContratoxFecha.map(c =>{
    const dataMarcacions = dataMarcacionxFecha.filter(m=>m.dni===c.numDoc_empl)
    const dataPlanilla = unirAsistenciaYContrato(dataMarcacions, c?._empl[0]?.contrato_empl?.filter(f=>f.id_tipo_horario===0), c.salario_empl)
    return {
      dataMarcacions,
      dataPlanilla,
      ...c
    }
  })
  console.log({dataContratoConMarcacion});
  const onOpenModalVistaDias = (dataVista)=>{
    setisOpenModalVistaDias(true)
    setdataVistaDias(dataVista)
  }
  const onCloseModalVistaDias = ()=>{
    setisOpenModalVistaDias(false)
  }

  return (
      <div className='fs-4'>
        <Table striped responsive>
          <thead className='bg-primary text-white'>
            <tr className='text-white'>
              {/* <th className='text-white'>CARGO</th> */}
              <th className='text-white'>COLABORADOR</th>
              <th className='text-white'>SEGUN CONTRATO <SymbolSoles fontSizeS={'10px'}/></th>
              <th className='text-white'>DIAS LABORABLES SEGUN CONTRATO</th>
              <th className='text-white'>MINUTOS CON TARDANZA</th>
              <th className='text-white'>DESCUENTO</th>
              <th className='text-white'>MONTO A PAGAR <SymbolSoles fontSizeS={'10px'}/></th>
              {/* <th className='text-white'>BANCO</th>
              <th className='text-white'>CUENTA O CCI</th> */}
            </tr>
          </thead>
          <tbody>
            {dataContratoConMarcacion?.map((item, index) => (
              <tr key={index}>
                {/* <td>{item.cargo}</td> */}
                {/* <td>{item.nombre_empl}</td> */}
                <td>{item.nombre_empl}</td>
                <td><NumberFormatMoney amount={item._empl[0].sueldo}/></td>
                <td>31</td>
                <td onClick={()=>onOpenModalVistaDias(item.dataPlanilla)}>
                  {item.dataPlanilla.reduce((total, p) => total + (p?.asistenciaYcontrato?.minutosDiferencia || 0),0)}
                </td>
                <td>
                  {item._empl[0].sueldo-item.dataPlanilla.reduce((total, p) => total + (p?.asistenciaYcontrato?.sueldoNeto || 0),0)}
                </td>
                <td>
                  {item.dataPlanilla.reduce((total, p) => total + (p?.asistenciaYcontrato?.sueldoNeto || 0),0)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <ModalVistaDias show={isOpenModalVistaDias} header={''} onHide={onCloseModalVistaDias} data={dataVistaDias}/>
      </div>
  )
}
