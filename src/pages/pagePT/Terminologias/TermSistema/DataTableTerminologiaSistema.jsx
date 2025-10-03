import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { ModalCustomTermSistema } from './ModalCustomTermSistema'
import { useTerminoSistema } from './useTerminoSistema'
import { Button } from 'primereact/button'
import { useSelector } from 'react-redux'

export const DataTableTerminologiaSistema = ({dataTerm, entidad, grupo}) => {
  const [isOpenModalCustomTermSistema, setisOpenModalCustomTermSistema] = useState({isOpen: false, id: 0, label: ''})
  const { obtenerTerminologiaSistema } = useTerminoSistema()
  const {dataView} = useSelector(e=>e.DATA)
  const onOpenModalCustomTermSistema = (id, label)=>{
    setisOpenModalCustomTermSistema({isOpen: true, id, label})
  }
  const onCloseModalCustomTermSistema = ()=>{
    setisOpenModalCustomTermSistema({isOpen: false, id: 0, label: ''})
  }
  useEffect(() => {
    obtenerTerminologiaSistema(entidad, grupo)
  }, [entidad])
  
  return (
    <div>
      <Button label='AGREGAR' onClick={()=>onOpenModalCustomTermSistema(0, '')}/>
      <Table>
        <thead>
          <tr>
            <th>id</th>
            <th>Valor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            dataView?.map(d=>{
              return (
                <tr>
                  <td>{d?.value}</td>
                  <td>{d?.label}</td>
                  <td>
                    <i onClick={()=>onOpenModalCustomTermSistema(d?.value, d?.label)} className='pi pi-pencil mx-4'></i>
                    <i  className='pi pi-trash  '></i>
                  </td>
                </tr>
              )
            })

          }
        </tbody>
      </Table>
      <ModalCustomTermSistema label={isOpenModalCustomTermSistema.label} id={isOpenModalCustomTermSistema.id} entidad={entidad} grupo={grupo} show={isOpenModalCustomTermSistema.isOpen} onHide={onCloseModalCustomTermSistema}/>
    </div>
  )
}
