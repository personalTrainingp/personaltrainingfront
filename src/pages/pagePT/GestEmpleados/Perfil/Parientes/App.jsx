import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { ModalCustom } from './ModalCustom'
import { DataTable } from './DataTable'

export const App = () => {
    const [isOpenModalCustomPariente, setisOpenModalCustomPariente] = useState(false)
    const onOpenModalCustomPariente = ()=>{
        setisOpenModalCustomPariente(true)
    }
    const onCloseModalCustomPariente = ()=>{
        setisOpenModalCustomPariente(false)
    }
  return (
    <div>
        <Button label='AGREGAR PARIENTE' onClick={onOpenModalCustomPariente}/>
        <DataTable/>
        <ModalCustom show={isOpenModalCustomPariente} onHide={onCloseModalCustomPariente}/>
    </div>
  )
}
