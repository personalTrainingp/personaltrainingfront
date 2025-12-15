import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { DataTableMovimientoArticulo } from './DataTableMovimientoArticulo'
import { ModalCustomMovimientosArticulo } from './ModalCustomMovimientosArticulo'

export const App = ({movimiento, idArticulo, idEmpresa}) => {
  const [isOpenCustomMovimientoArticulo, setisOpenCustomMovimientoArticulo] = useState({isOpen: false, id: 0, idArticulo, movimiento})
  const onOpenModalMovimientoArticulo = (id,  movimiento, idArticulo)=>{
    console.log({id,  movimiento, idArticulo});
    
    setisOpenCustomMovimientoArticulo({isOpen: true, id, movimiento, idArticulo})
  }
  const onCloseModalMovimientoArticulo = ()=>{
    setisOpenCustomMovimientoArticulo({isOpen: false, id: 0, idArticulo: 0, movimiento: ''})
  }
  return (
    <div>
        <Button onClick={()=>onOpenModalMovimientoArticulo(0, movimiento, idArticulo)}>Agregar</Button>
        <DataTableMovimientoArticulo idEmpresa={idEmpresa} idArticulo={isOpenCustomMovimientoArticulo.idArticulo} accion={isOpenCustomMovimientoArticulo.movimiento} onOpenModalCustomMovimientoArticulo={onOpenModalMovimientoArticulo}/>
        <ModalCustomMovimientosArticulo idEmpresa={idEmpresa} idArticulo={isOpenCustomMovimientoArticulo.idArticulo} show={isOpenCustomMovimientoArticulo.isOpen} id={isOpenCustomMovimientoArticulo.id} movimiento={isOpenCustomMovimientoArticulo.movimiento} onHide={onCloseModalMovimientoArticulo}/>
    </div>
  )
}
