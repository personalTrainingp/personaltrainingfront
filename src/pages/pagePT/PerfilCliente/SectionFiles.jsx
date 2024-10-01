import React, { useState } from 'react'
import { ModalAddFile } from './ModalAddFile'
import { Button } from 'primereact/button';

export const SectionFiles = ({uid_file}) => {
    const [isModalAddFile, setisModalAddFile] = useState(false);
    const onOpenModalAddFile = ()=>{
        setisModalAddFile(true)
    }
    const onCloseModalAddFile = ()=>{
        setisModalAddFile(false)
    }
    return(
        <>
        <Button label='Agregar documento' onClick={onOpenModalAddFile}/>
        <ModalAddFile onHide={onCloseModalAddFile} show={isModalAddFile}/>
        </>
    )
}
