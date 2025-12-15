import { useState } from 'react'
import { DataTableArticulos } from './DataTableArticulos'
import { ModalCustomArticulo } from './ModalCustomArticulo'
import { Button } from 'react-bootstrap'
import { ModalMovimientoItem } from './ModalMovimientoItem'

export const App2 = ({id_empresa}) => {
    const [isOpenModalCustomArticulo, setisOpenModalCustomArticulo] = useState({isOpen: false, id: 0})
    const [isOpenModalCustomMovItem, setisOpenModalCustomMovItem] = useState({isOpen: false, id: 0})
    const onOpenModalCustomArticulo=(id)=>{
        setisOpenModalCustomArticulo({id, isOpen: true})
    }
    const onCloseModalCustomArticulo=()=>{
        setisOpenModalCustomArticulo({id: 0, isOpen: false})
    }
    const onOpenModalCustomMovItem = (id)=>{
        setisOpenModalCustomMovItem({id, isOpen: true})
    }
    const onCloseModalCustomMovItem = ()=>{
        setisOpenModalCustomMovItem({id: 0, isOpen: false})
    }
  return (
    <>
        <Button className='' onClick={()=>onOpenModalCustomArticulo(0)}>AGREGAR ARTICULO</Button>
        <DataTableArticulos  onOpenModalCustomArticulo={onOpenModalCustomArticulo} onOpenModalMovimientos={onOpenModalCustomMovItem} idEmpresa={id_empresa}/>
        <ModalCustomArticulo id={isOpenModalCustomArticulo.id} onHide={onCloseModalCustomArticulo} show={isOpenModalCustomArticulo.isOpen} idEmpresa={id_empresa}/>
        <ModalMovimientoItem idArticulo={isOpenModalCustomMovItem.id} id_enterprice={id_empresa} show={isOpenModalCustomMovItem.isOpen} onHide={onCloseModalCustomMovItem}/>
    </>
  )
}
