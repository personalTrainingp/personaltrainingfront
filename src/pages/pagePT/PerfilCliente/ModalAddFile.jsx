import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import styled from 'styled-components'
import Select from 'react-select'
import { Button } from 'primereact/button'
import { useFilesStore } from '@/hooks/hookApi/useFilesStore'
import Swal from 'sweetalert2'
const registerFile = {
  id_tipo_file: 0,
  observacion: '',
}
export const ModalAddFile = ({uid_file, show, onHide}) => {
  const [file, setfile] = useState(null)
  const { formState, id_tipo_file, observacion, onInputChangeReact, onInputChange, onResetForm } = useForm(registerFile)
  const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
  const { postFiles } = useFilesStore()
  useEffect(() => {
    obtenerParametroPorEntidadyGrupo('files', 'tipo_doc')
  }, [])
    
    const onSubmitFile = (e)=>{
        e.preventDefault()
        if(!file){
            Swal.fire({
				icon: 'error',
				title: 'No hay documento adjunto',
				showConfirmButton: false,
				timer: 5000,
			});
            return;
        }
        const formData = new FormData()
        formData.append('file', file)
        postFiles(uid_file, formState, formData)
        cancelModal()
    }
    const cancelModal = ()=>{
        setfile(null)
        onHide()
        onResetForm()
    }
    const onChangeFile = (e)=>{
        const file = e.target.files[0]
        setfile(file)
    }
  return (
    <Dialog header='Agregar un documento' style={{width: '30rem'}} visible={show} onHide={cancelModal}>
        <DIVContainer>
            {/* <FileUploaderSN fileAccepted={".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"} onFileUpload={onChangeFileDieta} showPreview={true}/> */}
            <form className="dropzone-box" onSubmit={onSubmitFile}>
            {/*  */}
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
                    accept={".pdf,.doc"}
                    name='file'
                    onChange={onChangeFile}
                    type="file" 
                    required
                    />
                    <p className="message">{file ? `${file?.name}, ${file?.size} bytes` : "SIN ARCHIVOS SELECCIONADO"}</p>
                </div>
                </Col>
                <Col xxl={12}>
                    <div className="mb-2">
                        <label htmlFor="id_tipo_file" className="form-label">
                            Tipo de documento:
                        </label>
                        <Select
                                onChange={(e)=>onInputChangeReact(e, "id_tipo_file")}
                                name={"id_tipo_file"}
                                placeholder={'Seleccione el tipo de documento'}
                                className="react-select"
                                classNamePrefix="react-select"
                                value={DataGeneral.find(
                                    (option) => option.value === id_tipo_file
                                )}
                                options={DataGeneral}
                                required
                        ></Select>
                    </div>
                </Col>
                <Col xxl={12}>
                    <div className="mb-2">
                        <label htmlFor="observacion" className="form-label">
                            Descripcion:
                        </label>
                        <textarea
                            name='observacion'
                            className='form-control'
                            placeholder='Este traspaso es...'
                            value={observacion}
                            onChange={onInputChange}
                            required
                        />
                    </div>
                </Col>
                <Button label='CANCELAR' onClick={cancelModal} text className='mx-2'/>
                <Button label='GUARDAR' type='submit' className='mx-2'/>
            </Row>
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