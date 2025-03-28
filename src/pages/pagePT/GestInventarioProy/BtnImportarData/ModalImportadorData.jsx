import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import React, { useState } from 'react'
import ExcelJS from "exceljs";
import styled from 'styled-components';

export const ModalImportadorData = ({onShow, onHide}) => {
  console.log(onShow);
  const [file_DIETA, setfile_DIETA] = useState(null)
  const [dataExcel, setdataExcel] = useState([])
  const [data, setData] = useState([]);
  const onChangeFile = (e)=>{
    console.log("acac");
    const file = e.target.files[0]
    setfile_DIETA(file)
  }
  const handleFileUpload = (e)=>{
    e.preventDefault()
    const file = event.target.files[0];
    if (!file) return;

    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;

      // Leer el archivo Excel
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.getWorksheet(1); // Seleccionar la primera hoja
      const rows = [];
      const images = [];

      // Leer las filas del Excel
      worksheet.eachRow((row, rowIndex) => {
        const rowData = row.values; // Obtiene valores de la fila
        rows.push({ id: rowIndex, data: rowData });
      });

      // Leer las imágenes de la hoja
      worksheet.getImages().forEach((image) => {
        console.log(image);
        
        const imageData = workbook.getImage(image.imageId);
        const buffer = imageData.buffer;
        const blob = new Blob([buffer], { type: imageData.extension }); // Crear un Blob
        const url = URL.createObjectURL(blob); // Convertir en URL para mostrar
        images.push({ id: image.imageId, url });
      });

      // Guardar datos y URLs de las imágenes en el estado
      setData({ rows, images });
    };

    reader.readAsArrayBuffer(file);
  }
  console.log(data);
  
  return (
    <Dialog position='bottom' header={'IMPORTAR DATOS'} style={{width: '100%'}} visible={onShow} onHide={onHide}>
      <div>
        <Button label='VER FORMATO' text/>
        <DIVContainer>
        <div className="dropzone-area my-2">
                    <div className="file-upload-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2"
                            stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                        </svg>
                    </div>
                    <p>Haga clic para cargar UN EXCEL</p>
                    <form>
                      <input 
                      accept={".xlsx"}
                      name='file_DIETA'
                      onChange={handleFileUpload}
                      type="file" required/>
                      <p className="message">{file_DIETA ? `${file_DIETA?.name}, ${file_DIETA?.size} bytes` : "SIN ARCHIVOS SELECCIONADO"}</p>
                      <Button label='¿CARGAR ARCHIVO?' type='submit'/>
                    </form>
                </div>
        </DIVContainer>
      </div>
      <div>
        
      </div>
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