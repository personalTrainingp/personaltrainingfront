import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { NumberFormatMoney, NumberFormatter } from '@/components/CurrencyMask'
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
      // dataMarcacions,
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
        {/* <pre>
                
          {JSON.stringify(dataContratoConMarcacion, null, 2)}
        </pre> */}
        <Table striped responsive>
          <thead className='bg-primary text-white'>
            <tr className='text-white'>
              {/* <th className='text-white'>CARGO</th> */}
              <th className='text-white'>COLABORADOR</th>
              <th className='text-white'>SEGUN CONTRATO <SymbolSoles fontSizeS={'10px'}/></th>
              <th className='text-white'>DIAS LABORABLES SEGUN CONTRATO</th>
              <th className='text-white'>MINUTOS LABORABLES</th>
              <th className='text-white'>MINUTOS ASISTIDOS</th>
              <th className='text-white'>DESCUENTO</th>
              <th className='text-white'>MONTO A PAGAR <SymbolSoles fontSizeS={'10px'}/></th>
              {/* <th className='text-white'>BANCO</th>
              <th className='text-white'>CUENTA O CCI</th> */}
            </tr>
          </thead>
          <tbody>
            {dataContratoConMarcacion?.map((item, index) => {
              const minutosLaborables = item.dataPlanilla.reduce((total, p) => total + (p?.asistenciaYcontrato?.minutosContratadosDelDia || 0),0)
              const minutosTarde = item.dataPlanilla.filter(f=>f?.asistenciaYcontrato.minutosDiferencia>1).reduce((total, p) => total + (p?.asistenciaYcontrato?.minutosDiferencia || 0),0)
              const minutosAsistidos = minutosLaborables-minutosTarde
              const montoLaborable = item.dataPlanilla.reduce((total, p) => total + (p?.asistenciaYcontrato?.sueldoDelDia || 0),0)
              const montoAsistidos = (minutosAsistidos*montoLaborable)/minutosLaborables
              return (
                <tr key={index}>
                  {/* <td>{item.cargo}</td> */}
                  {/* <td>{item.nombre_empl}</td> */}
                  <td>{item.nombre_empl}</td>
                  <td><NumberFormatMoney amount={item._empl[0].sueldo}/></td>
                  <td>31</td>
                  <td onClick={()=>onOpenModalVistaDias(item.dataPlanilla)}>
                    <div className='bg-danger'>
                      <NumberFormatter amount={minutosLaborables}/>
                    {/* {minutosLaborables} */}
                    </div>
                  </td>
                  <td onClick={()=>onOpenModalVistaDias(item.dataPlanilla)}>
                    <div className='bg-danger'>
                      <NumberFormatter amount={minutosAsistidos}/>
                    {/* {minutosAsistidos} */}
                    </div>
                  </td>
                  {/* MONTO */}
                  <td onClick={()=>onOpenModalVistaDias(item.dataPlanilla)}>
                    <div className='bg-danger'>
                      <NumberFormatMoney amount={montoLaborable-montoAsistidos}/>
                    {/* {montoLaborable-montoAsistidos} */}
                    </div>
                  </td>
                  <td onClick={()=>onOpenModalVistaDias(item.dataPlanilla)}>
                    <div className='bg-danger'>
                      <NumberFormatMoney amount={montoAsistidos}/>
                    {/* {montoAsistidos} */}
                    </div>
                  </td>
                  
                  {/* */}
                </tr>
              )
            }
            )}
          </tbody>
        </Table>
        <ModalVistaDias show={isOpenModalVistaDias} header={''} onHide={onCloseModalVistaDias} data={dataVistaDias}/>
      </div>
  )
}
