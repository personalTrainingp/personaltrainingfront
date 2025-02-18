import { Dialog } from 'primereact/dialog'
import { FileUpload } from 'primereact/fileupload'
import React, { useState } from 'react'
import { useBlobsStore } from './useBlobsStore';

export const ModalAgregarImgs = ({show, onHide, data, uidImageParam}) => {
    const [files, setFiles] = useState([]);
    const { registrarBlobs } = useBlobsStore()
    const onFileSelect = (event) => {
      setFiles(event.files);
      console.log("Archivos seleccionados:", event.files, uidImageParam);
    };
  
    const onUpload = () => {
        registrarBlobs(files, uidImageParam)
      console.log("Subiendo archivos:", files);
      // Aquí puedes manejar la subida de archivos manualmente (ej. con fetch o axios)
    };
  return (
    <Dialog header={'LUGARES'} visible={show} onHide={onHide}>
        <FileUpload 
                    name="files"
                    multiple
                    customUpload
                    onSelect={onFileSelect}
                    uploadHandler={onUpload}
                    auto={false}
                    chooseLabel="Seleccionar archivos"
                    uploadLabel="Subir"
                    cancelLabel="Cancelar" />
    </Dialog>
  )
}
