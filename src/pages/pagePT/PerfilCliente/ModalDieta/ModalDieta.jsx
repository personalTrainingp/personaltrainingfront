import { FileUploader } from '@/components'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import styled from 'styled-components'

export const ModalDieta = ({show, onHide}) => {

    const fotterDialog = (
        <>
            <Button label='CANCELAR' text className='mx-2'/>
            <Button label='GUARDAR' className='mx-2'/>
        </>
    )

    const [file, setFile] = useState(null);
    const dropzoneRef = useRef(null);
    const inputRef = useRef(null);
    const formRef = useRef(null);
  
    const handleFileChange = (e) => {
      if (e.target.files.length) {
        setFile(e.target.files[0]);
      }
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      if (e.dataTransfer.files.length) {
        inputRef.current.files = e.dataTransfer.files;
        setFile(e.dataTransfer.files[0]);
      }
      dropzoneRef.current.classList.remove("dropzone--over");
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
      dropzoneRef.current.classList.add("dropzone--over");
    };
  
    const handleDragLeave = () => {
      dropzoneRef.current.classList.remove("dropzone--over");
    };
  
    const handleReset = () => {
      setFile(null);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const selectedFile = inputRef.current.files[0];
      console.log(selectedFile);
    };
  
    useEffect(() => {
      const dropzoneElement = dropzoneRef.current;
      dropzoneElement.addEventListener("dragover", handleDragOver);
      dropzoneElement.addEventListener("dragleave", handleDragLeave);
      dropzoneElement.addEventListener("dragend", handleDragLeave);
      dropzoneElement.addEventListener("drop", handleDrop);
  
      return () => {
        dropzoneElement.removeEventListener("dragover", handleDragOver);
        dropzoneElement.removeEventListener("dragleave", handleDragLeave);
        dropzoneElement.removeEventListener("dragend", handleDragLeave);
        dropzoneElement.removeEventListener("drop", handleDrop);
      };
    }, []);
    
  return (
    
    <Dialog footer={fotterDialog} header="Subir y adjuntar archivos" visible={show} style={{ width: '30vw', height: '60vh' }} onHide={onHide}>
        <DIVContainer>
            <form ref={formRef} onSubmit={handleSubmit} className="dropzone-box">
            <div ref={dropzoneRef} className="dropzone-area">
                <div className="file-upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2"
                        stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                    </svg>
                </div>
                <p>Haga clic para cargar o arrastre y suelte</p>
                <input 
          ref={inputRef} 
          onChange={handleFileChange} 
          style={{ display: "none" }} type="file" required id="upload-file" name="uploaded-file"/>
                <p className="message">{file ? `${file.name}, ${file.size} bytes` : "No Files Selected"}</p>
            </div>
            </form>
        </DIVContainer>
    </Dialog>
  )
}

const DIVContainer = styled.div`
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