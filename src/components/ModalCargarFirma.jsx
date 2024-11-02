import { useVentasStore } from '@/hooks/hookApi/useVentasStore';
import { onSetBase64Firma } from '@/store/data/dataSlice';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

export const ModalCargarFirma = ({idVenta, idCli, show, onHide}) => {
    const [file, setfile] = useState(null)
    const { agregarFirmaEnContratoCliente } = useVentasStore()
    const dispatch = useDispatch(); // Obtener el dispatch del store para actualizar el estado de la firma base64
    const maxSize = 5 * 1024 * 1024; // Tamaño máximo permitido en bytes (5 MB en este caso)
    const onCancelModal = ()=>{
        onHide();
    }
    const onSubmitModalFirma = (e)=>{

      dispatch(onSetBase64Firma(file))
      console.log(file);
      if (file) {
        if (file.size > maxSize || file.type!=='image/png') {
          alert("El archivo es demasiado grande, O no cumple con los requisitos del sistema");
          return;
        } else {
            agregarFirmaEnContratoCliente(file, idVenta, idCli)
            onCancelModal();
        }
      }
  
    }
    const onChangeFileImage = (e)=>{
      const fileI = e.target.files[0]
      setfile(fileI)
    }
    
  return (
    <Dialog header={'Cargar firma'} onHide={onCancelModal} visible={show}>
      <SPANContainer>
        <form id="file-upload-form" className="uploader">
          <Row>
            <Col xxl={12}>
                <div className="dropzone-area my-2">
                    <div className="file-upload-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2"
                            stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                        </svg>
                    </div>
                    <p>Haga clic para cargar el documento</p>
                    <input 
                    accept="image/*"
                    name='file'
                    onChange={onChangeFileImage}
                    type="file" 
                    required
                    />
                    <p className="message">{file ? `${file?.name}, ${file?.size} bytes` : "SIN ARCHIVOS SELECCIONADO"}</p>
                </div>
                </Col>
          </Row>
          </form>
      </SPANContainer>
        <Row>
                <Col lg={12}>
                    <div className='d-flex justify-content-center'>
                        <Button className='m-2' onClick={onCancelModal} outlined severity='danger'>Cerrar</Button>
                        <Button className='m-2' onClick={onSubmitModalFirma}>Guardar</Button>
                    </div>
                </Col>
            </Row>
    </Dialog>
  )
}

const SPANContainer = styled.div`
.dropzone-box {
    color: #a80038;
    border-radius: 2rem;
    padding: 2rem;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    max-width: 36rem;
    width: 100%;
    background-color: #fff;
}

.dropzone-box h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.dropzone-area {
    padding: 1rem;
    position: relative;
    margin-top: 1rem;
    min-height: 16rem;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 2px dashed #a80038;
    border-radius: 1rem;
    color: #a80038;
    cursor: pointer;
}

.dropzone-area [type="file"] {
    cursor: pointer;
    position: absolute;
    opacity: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.dropzone-area .file-upload-icon svg {
    height: 5rem;
    width: 5rem;
    margin-bottom: 0.5rem;
    stroke: #a80038;
}

.dropzone--over {
    border-style: solid;
    background-color: #F8F8FF;
}

.dropzone-actions {
    display: flex;
    justify-content: space-between;
    padding-top: 1.5rem;
    margin-top: 1.5rem;
    border-top: 1px solid #D3D3D3;
    gap: 1rem;
    flex-wrap: wrap;
}

.dropzone-actions button {
    flex-grow: 1;
    min-height: 3rem;
    font-size: 1.2rem;
}

.dropzone-actions button:hover {
    text-decoration: underline;
}

.dropzone-actions button[type='reset'] {
    background-color: transparent;
    border: 1px solid #D3D3D3;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    color: #a80038;
    cursor: pointer;
}

.dropzone-actions button[type='submit'] {
    background-color: #a80038;
    border: 1px solid #a80038;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    color: #fff;
    cursor: pointer;
}
`