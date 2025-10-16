import React, { useState } from 'react'
import { DataTable } from './DataTable'
import { Button } from 'primereact/button'
import { ModalCustomArchivo } from './ModalCustomArchivo'

export const App = ({uid_docs}) => {
    const [isOpenModalCustomDocAdj, setisOpenModalCustomDocAdj] = useState({isOpen: false, id: 0})
    const onCloseModalCustomDocAdj = ()=>{
        setisOpenModalCustomDocAdj({isOpen: false, id: 0})
    }
    const onOpenModalCustomDocAdj = (id)=>{
        setisOpenModalCustomDocAdj({isOpen: true, id})
    }
  return (
    <div>
        <Button label='AGREGAR DOCUMENTO' onClick={()=>onOpenModalCustomDocAdj(0)}/>
        <ModalCustomArchivo uid_location={uid_docs} show={isOpenModalCustomDocAdj.isOpen} id={isOpenModalCustomDocAdj.id} onHide={onCloseModalCustomDocAdj} />
        <DataTable uid_location={uid_docs}/>
        {uid_docs}
    </div>
  )
}
