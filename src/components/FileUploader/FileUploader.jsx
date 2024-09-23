import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import useFileUploader from './useFileUploader';
import styled from 'styled-components';
import { useEffect } from 'react';

const FileUploader = ({ showPreview = true, onFileUpload }) => {
  const { selectedFiles, handleAcceptedFiles, removeFile } = useFileUploader(showPreview);
  return (
    <>
    {
      selectedFiles.length<=0 && (
        <Dropzone onDrop={(acceptedFiles) => handleAcceptedFiles(acceptedFiles, onFileUpload)}>
          {({ getRootProps, getInputProps }) => (
            <div className="dropzone">
              <div className="dz-message needsclick" {...getRootProps()}>
                <input {...getInputProps()} />
                <i className="h1 text-muted ri-upload-cloud-2-line"></i>
                <h3>Adjuntar documento</h3>
              </div>
            </div>
          )}
        </Dropzone>
      )
    }

      {showPreview && selectedFiles.length > 0 && (
        <div className="dropzone-previews mt-3" id="uploadPreviewTemplate">
          {(selectedFiles || []).map((f, i) => {
            return (
              <Card className="mt-1 mb-0 shadow-none border" key={i + '-file'}>
                <div className="p-2">
                  <Row className="align-items-center">
                    {f.preview && (
                      <Col className="col-auto">
                        <img
                          data-dz-thumbnail=""
                          className="avatar-sm rounded bg-light"
                          alt={f.name}
                          src={f.preview}
                        />
                      </Col>
                    )}
                    {!f.preview && (
                      <Col className="col-auto">
                        <div className="avatar-sm">
                          <span className="avatar-title bg-primary rounded">
                            {f.type.split('/')[0]}
                          </span>
                        </div>
                      </Col>
                    )}
                    <Col className="ps-0">
                      <Link to="" className="text-muted fw-bold">
                        {f.name}
                      </Link>
                      <p className="mb-0">
                        <strong>{f.formattedSize}</strong>
                      </p>
                    </Col>
                    <Col className="text-end">
                      <Link
                        to=""
                        className="btn btn-link btn-lg text-muted shadow-none"
                      >
                        <i
                          className="ri-close-line"
                          onClick={() => removeFile(f)}
                        ></i>
                      </Link>
                    </Col>
                  </Row>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

const FileUploaderSN = ({showPreview = true, onFileUpload, fileAccepted})=>{
  const { selectedFiles, handleAcceptedFiles, removeFile } = useFileUploader(showPreview);
  // console.log(onFileUpload);
  const onDropZoneChange = (acceptedFiles)=>{
    const file = acceptedFiles[0];  // Solo el primer archivo
    handleAcceptedFiles([file], onFileUpload); // Pasa solo el archivo seleccionado
    // if (acceptedFiles.length > 0) {
    // }
  }
  useEffect(() => {
    if(selectedFiles.length>1){
      removeFile(selectedFiles[0]);
    }
  }, [selectedFiles])
  
  
  return (
    <>
    {
      (
        <Dropzone onDrop={(acceptedFiles) => onDropZoneChange(acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <DIVContainer>
            <form className="dropzone-box">
            <div className="dropzone-area"  {...getRootProps()}>
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
                accept={".pdf,.doc"} 
                {...getInputProps()}
                style={{ display: "none" }} type="file" required id="upload-file" name="uploaded-file"/>
                <p className="message">{selectedFiles.length>0 ? `${selectedFiles[0]?.name}, ${selectedFiles[0]?.size} bytes` : "SIN ARCHIVOS SELECCIONADO"}</p>
            </div>
            </form>
        </DIVContainer>
          )}
        </Dropzone>
      )
    }
    </>
  );
}
const FileReaderDieta = ({selectedFiles})=>{
  return (
    <form className="dropzone-box">
            <div className="dropzone-area">
                <div className="file-upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2"
                        stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                    </svg>
                </div>
                <p>Haga clic para cargar un documento</p>
                <input 
                accept={".pdf,.doc"}
                style={{ display: "none" }} type="file" required id="upload-file" name="uploaded-file"/>
                <p className="message">{selectedFiles.length>0 ? `${selectedFiles[0]?.name}, ${selectedFiles[0]?.size} bytes` : "SIN ARCHIVOS SELECCIONADO"}</p>
            </div>
            </form>
  )
}
export { FileUploader, FileUploaderSN, FileReaderDieta };


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