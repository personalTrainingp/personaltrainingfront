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
    const dataPlanilla = unirAsistenciaYContrato(dataMarcacions, c?._empl[0]?.contrato_empl?.filter(f=>f.id_tipo_horario===0), c?._empl[0]?.sueldo)
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
              <th className='text-white'>DIAS ASISTENCIA</th>
              <th className='text-white'>TARDANZAS</th>
              <th className='text-white'>TARDANZAS INASISTENCIA <SymbolSoles fontSizeS={'10px'}/></th>
              <th className='text-white'>MONTO A PAGAR <SymbolSoles fontSizeS={'10px'}/></th>
              {/* <th className='text-white'>MONTO A PAGAR <SymbolSoles fontSizeS={'10px'}/></th> */}
              {/* <th className='text-white'>DESCUENTO</th> */}
              {/* <th className='text-white'>BANCO</th>
              <th className='text-white'>CUENTA O CCI</th> */}
            </tr>
          </thead>
          <tbody>
            {dataContratoConMarcacion?.map((item, index) => {
              const minutosLaborables = item.dataPlanilla.reduce((total, p) => total + (p?.asistenciaYcontrato?.minutosContratadosDelDia || 0),0)
              const minutosTarde = item.dataPlanilla.filter(f=>f?.asistenciaYcontrato.minutosDiferencia>1).reduce((total, p) => total + (p?.asistenciaYcontrato?.minutosDiferencia || 0),0)
              const diasFalta = item.dataPlanilla.filter(f=>f?.asistenciaYcontrato.minutosAsistidosDelDia==0)
              return (
                <tr key={index}>
                  {/* <td>{item.cargo}</td> */}
                  {/* <td>{item.nombre_empl}</td> */}
                  <td>{item.nombre_empl}</td>
                  <td><NumberFormatMoney amount={item._empl[0]?.sueldo}/></td>
                  <td>31</td>
                  <td>
                    <div>
                      {31-diasFalta.length}
                    </div>
                  </td>
                  <td onClick={()=>onOpenModalVistaDias(item.dataPlanilla)}>
                    <div>
                      <NumberFormatter amount={minutosTarde}/>
                    </div>
                  </td>
                  <td onClick={()=>onOpenModalVistaDias(item.dataPlanilla)}>
                    <div >
                      <NumberFormatMoney amount={minutosTarde*(item._empl[0]?.sueldo/31/9/60)}/>
                    </div>
                  </td>
                  <td onClick={()=>onOpenModalVistaDias(item.dataPlanilla)}>
                    <div >
                      <NumberFormatMoney amount={item._empl[0]?.sueldo/31 * (31-diasFalta.length)}/>
                    </div>
                  </td>
                  {/* <td onClick={()=>onOpenModalVistaDias(item.dataPlanilla)}>
                    <div>
                      <NumberFormatMoney amount={(item._empl[0]?.sueldo/31 * (31-diasFalta.length))-(minutosTarde*(item._empl[0]?.sueldo/31/9/60))}/>
                    </div>
                  </td> */}
                  {/* <td onClick={()=>onOpenModalVistaDias(item.dataPlanilla)}>
                    <div>
                      <NumberFormatMoney amount={montoAsistidos}/>
                    </div>
                  </td> */}
                  
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
