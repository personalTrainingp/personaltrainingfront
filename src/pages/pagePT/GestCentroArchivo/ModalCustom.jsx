import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import styled from 'styled-components'
import Select from 'react-select'
import { Button } from 'primereact/button'
import Swal from 'sweetalert2'
import { useCenterArchive } from './hook/useCenterArchive'
const registerFile = {
  id_tipo_doc: 0,
  observacion: '',
  titulo: '',
  id_seccionVisible: 0
}
const registerArchivo={
    imgAvatar_BASE64: ''
}
export const ModalCustom = ({uid_file, show, onHide, id}) => {
    const [file, setfile] = useState(null)
    const { obtenerArchivoxID, dataxID, onUpdateArchivo } = useCenterArchive()
  const { formState, id_tipo_doc, id_empresa, id_seccionVisible, titulo, observacion, id_sub_tipo_doc, onInputChangeReact, onInputChange, onResetForm } = useForm(id!==0?dataxID:registerFile)
  const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
  const { obtenerParametroPorEntidadyGrupo:obtenerTipoDoc, DataGeneral:datatipoDoc } = useTerminoStore()
  const { obtenerParametroPorEntidadyGrupo:obtenerSubTipoDoc, DataGeneral:dataSubtipoDoc } = useTerminoStore()
  useEffect(() => {
    if (id!==0) {
        obtenerArchivoxID(id)
    }
  }, [id])
  
  useEffect(() => {
    obtenerParametroPorEntidadyGrupo('centro-archivo', 'categoria')
    obtenerTipoDoc('centro-archivo','tipo-archivo')
    obtenerSubTipoDoc('centro-archivo', 'sub-tipo-archivo')
  }, [show])
    
    const onSubmitFile = (e)=>{
        e.preventDefault()
        if (id!==0) {
            onUpdateArchivo(id, id_empresa, formState)
        }else{
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
            console.log({formData, file});
            onPostArchivCenter(formState, id_seccionVisible, id_empresa, formData)
        }
        // postFiles(uid_file, formState, formData)
        cancelModal()
    }
    const cancelModal = ()=>{
        setfile(null)
        onHide()
        onResetForm()
    }
    const onChangeFile = (e)=>{
        const file = e.target.files[0]
        console.log({file});
        
        setfile(file)
    }
  return (
    <Dialog header={`Agregar un documento`} style={{width: '30rem'}} visible={show} onHide={cancelModal}>
        <DIVContainer>
            {/* <FileUploaderSN fileAccepted={".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"} onFileUpload={onChangeFileDieta} showPreview={true}/> */}
            <form className="dropzone-box" onSubmit={onSubmitFile}>
            <Row>
                {
                    id===0 && (
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
                    )
                }
                <Col xxl={12}>
                    <div className="mb-2">
                        <label htmlFor="id_empresa" className="form-label">
                            Empresa:
                        </label>
                        <Select
                                onChange={(e)=>onInputChangeReact(e, "id_empresa")}
                                name={"id_empresa"}
                                placeholder={'Seleccione la empresa'}
                                className="react-select"
                                classNamePrefix="react-select"
                                value={[
                                    { value: 598, label: 'CHANGE' },
                                    { value: 599, label: 'CIRCUS' },
                                    { value: 601, label: 'REDUCTO' },
                                    { value: 800, label: 'RAL' },
                                ].find(
                                    (option) => option.value === id_empresa
                                )}
                                options={[
                                    { value: 598, label: 'CHANGE' },
                                    { value: 599, label: 'CIRCUS' },
                                    { value: 601, label: 'REDUCTO' },
                                    { value: 800, label: 'RAL' },
                                ]}
                                required
                        ></Select>
                    </div>
                </Col>
                <Col xxl={12}>
                    <div className="mb-2">
                        <label htmlFor="id_tipo_doc" className="form-label">
                            Tipo:
                        </label>
                        <Select
                                onChange={(e)=>onInputChangeReact(e, "id_tipo_doc")}
                                name={"id_tipo_doc"}
                                placeholder={'Seleccione la tipo'}
                                className="react-select"
                                classNamePrefix="react-select"
                                value={DataGeneral.find(
                                    (option) => option.value === id_tipo_doc
                                )}
                                options={DataGeneral}
                                required
                        ></Select>
                    </div>
                </Col>
                <Col xxl={12}>
                    <div className="mb-2">
                        <label htmlFor="id_sub_tipo_doc" className="form-label">
                            Sub tipo:
                        </label>
                        <Select
                                onChange={(e)=>onInputChangeReact(e, "id_sub_tipo_doc")}
                                name={"id_sub_tipo_doc"}
                                placeholder={'Seleccione la tipo'}
                                className="react-select"
                                classNamePrefix="react-select"
                                value={dataSubtipoDoc.find(
                                    (option) => option.value === id_sub_tipo_doc
                                )}
                                options={dataSubtipoDoc}
                                required
                        ></Select>
                    </div>
                </Col>
                <Col xxl={12}>
                    <div className="mb-2">
                        <label htmlFor="titulo" className="form-label">
                            TITULO:
                        </label>
                        <input 
                            className='form-control'
                            name={'titulo'}
                            value={titulo}
                            onChange={onInputChange}
                            required
                        />
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
                            placeholder='Detalle del archivo'
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