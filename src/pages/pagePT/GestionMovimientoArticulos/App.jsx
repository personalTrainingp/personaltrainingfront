import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { DataTableMovimientoArticulo } from './DataTableMovimientoArticulo'
import { ModalCustomMovimientosArticulo } from './ModalCustomMovimientosArticulo'

export const App = ({movimiento}) => {
  const [isOpenCustomMovimientoArticulo, setisOpenCustomMovimientoArticulo] = useState({isOpen: false, id: 0})
  const onOpenModalMovimientoArticulo = (id)=>{
    setisOpenCustomMovimientoArticulo({isOpen: true, id})
  }
  const onCloseModalMovimientoArticulo = ()=>{
    setisOpenCustomMovimientoArticulo({isOpen: false, id: 0})
  }
  return (
    <div>
        <Button onClick={()=>onOpenModalMovimientoArticulo(0)}>Agregar</Button>
        <DataTableMovimientoArticulo />
        <ModalCustomMovimientosArticulo show={isOpenCustomMovimientoArticulo.isOpen} id={isOpenCustomMovimientoArticulo.id} movimiento={movimiento} onHide={onCloseModalMovimientoArticulo}/>
    </div>
  )
}
