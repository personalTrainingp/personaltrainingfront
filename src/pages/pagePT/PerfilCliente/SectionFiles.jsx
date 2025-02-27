import React, { useEffect, useState } from 'react'
import { ModalAddFile } from './ModalAddFile'
import { Button } from 'primereact/button';
import { Card,  Col, Row } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import { ItemFileCli } from './ItemFileCli';
import { useSelector } from 'react-redux';
import { useFilesStore } from '@/hooks/hookApi/useFilesStore';
import { confirmDialog } from 'primereact/confirmdialog';

export const SectionFiles = ({uid_file}) => {
    const [isModalAddFile, setisModalAddFile] = useState(false);
    const { datafilesAdj } = useSelector(e=>e.authClient)
    const { obtenerFilesxUIDLOCATION, onDeleteFilesxID } = useFilesStore()
    const onOpenModalAddFile = ()=>{
        setisModalAddFile(true)
    }
    const onCloseModalAddFile = ()=>{
        setisModalAddFile(false)
    }
    useEffect(() => {
        obtenerFilesxUIDLOCATION(uid_file)
    }, [])
    console.log({datafilesAdj}, uid_file);
    
    const onDeleteFile=(id)=>{
        confirmDialog({
            message: 'Estas seguro de querer eliminar este documento',
            header: 'Eliminar Documento',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: ()=>{
                onDeleteFilesxID(id, uid_file)
            },
            reject: ()=>{
                console.log("error");
            }
        });
    }
    
    return(
        <>
        <Button label='Agregar documento' onClick={onOpenModalAddFile}/>
            <Row className='m-2'>
                    {
                        datafilesAdj?.map(f=>(
                            <Col key={f.id} xl={12}>
                                <ItemFileCli name_file={f.tb_image?.name_image} fecha_creacion={f.createdAt} deleteFile={()=>onDeleteFile(f.id)} observacion={f.observacion} tipo_doc={f.id_tipo_file}/>
                            </Col>
                        ))
                    }
            </Row>
        <ModalAddFile uid_file={uid_file} onHide={onCloseModalAddFile} show={isModalAddFile}/>
        </>
    )
}
