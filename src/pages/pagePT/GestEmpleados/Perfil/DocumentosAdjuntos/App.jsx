import React, { useState } from 'react'
import { DataTable } from './DataTable'
import { Button } from 'primereact/button'
import { ModalCustomArchivo } from './ModalCustomArchivo'

export const App = ({uid_docs}) => {
    const [isOpenModalCustomDocAdj, setisOpenModalCustomDocAdj] = useState({isOpen: false, doc: null})
    const onCloseModalCustomDocAdj = ()=>{
        setisOpenModalCustomDocAdj({isOpen: false, doc: null})
    }
    const onOpenModalCustomDocAdj = (doc=null)=>{
        setisOpenModalCustomDocAdj({isOpen: true, doc})
    }
  return (
    <div>
        <Button label='AGREGAR DOCUMENTO' onClick={()=>onOpenModalCustomDocAdj()}/>
        <ModalCustomArchivo uid_location={uid_docs} show={isOpenModalCustomDocAdj.isOpen} doc={isOpenModalCustomDocAdj.doc} onHide={onCloseModalCustomDocAdj} />
        <DataTable uid_location={uid_docs} onEditar={onOpenModalCustomDocAdj}/>
        {uid_docs}
    </div>
  )
}
