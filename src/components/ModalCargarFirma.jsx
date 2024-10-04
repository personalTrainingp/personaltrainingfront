import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import styled from 'styled-components';

export const ModalCargarFirma = ({show, onHide}) => {
    const [fileImage, setfileImage] = useState(null)
    const onCancelModal = ()=>{
        onHide();
    }
    const onSubmitModalFirma = ()=>{
      onCancelModal();
    }
    const onChangeFileImage = (e)=>{
      const file = e.target.files[0]
      const formReader = new FileReader();
      formReader.onload = () => {
        
        setfileImage(formReader.result)
      }
        if (file) {
          formReader.readAsDataURL(file); // Lee el archivo como base64
        }
    }
    
  return (
    <Dialog header={'Cargar firma'} onHide={onCancelModal} visible={show}>
      <SPANContainer>
        <form id="file-upload-form" className="uploader">
            <input id="file-upload" onChange={onChangeFileImage} type="file" name="fileUpload" accept="image/*" />

            <label for="file-upload" id="file-drag">
              <img id="file-image" src={fileImage} alt="Preview" className="hidden"/>
              <div id="start">
                <i className="fa fa-download" aria-hidden="true"></i>
                <div>Selecciona una imagen o arrastrela aqui</div>
                <div id="notimage" className="hidden">Porfavor seleccione una imagen</div>
                <span id="file-upload-btn" className="btn btn-primary">Selecciona una imagen</span>
              </div>
              <div id="response" className="hidden">
                <div id="messages"></div>
                <progress className="progress" id="file-progress" value="0">
                  <span>0</span>%
                </progress>
              </div>
            </label>
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

h2 {
  font-family: "Roboto", sans-serif;
  font-size: 26px;
  line-height: 1;
  color: #454cad;
  margin-bottom: 0;
}
p {
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  color: #5f6982;
}
// Upload Demo
// 
.uploader {
  display: block;
  clear: both;
  margin: 0 auto;
  width: 100%;
  max-width: 600px;

  label {
    float: left;
    clear: both;
    width: 100%;
    padding: 2rem 1.5rem;
    text-align: center;
    background: #fff;
    border-radius: 7px;
    border: 3px solid #eee;
    transition: all .2s ease;
    user-select: none;

    &:hover {
      border-color: #454cad;
    }
    &.hover {
      border: 3px solid #454cad;
      box-shadow: inset 0 0 0 6px #eee;
      
      #start {
        i.fa {
          transform: scale(0.8);
          opacity: 0.3;
        }
      }
    }
  }

  #start {
    float: left;
    clear: both;
    width: 100%;
    &.hidden {
      display: none;
    }
    i.fa {
      font-size: 50px;
      margin-bottom: 1rem;
      transition: all .2s ease-in-out;
    }
  }
  #response {
    float: left;
    clear: both;
    width: 100%;
    &.hidden {
      display: none;
    }
    #messages {
      margin-bottom: .5rem;
    }
  }

  #file-image {
    display: inline;
    margin: 0 auto .5rem auto;
    width: auto;
    height: auto;
    max-width: 180px;
    &.hidden {
      display: none;
    }
  }
  
  #notimage {
    display: block;
    float: left;
    clear: both;
    width: 100%;
    &.hidden {
      display: none;
    }
  }

  progress,
  .progress {
    // appearance: none;
    display: inline;
    clear: both;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    height: 8px;
    border: 0;
    border-radius: 4px;
    background-color: #eee;
    overflow: hidden;
  }

  .progress[value]::-webkit-progress-bar {
    border-radius: 4px;
    background-color: #eee;
  }

  .progress[value]::-webkit-progress-value {
    background: linear-gradient(to right, darken(#454cad,8%) 0%, #454cad 50%);
    border-radius: 4px; 
  }
  .progress[value]::-moz-progress-bar {
    background: linear-gradient(to right, darken(#454cad,8%) 0%, #454cad 50%);
    border-radius: 4px; 
  }

  input[type="file"] {
    display: none;
  }

  div {
    margin: 0 0 .5rem 0;
    color: #5f6982;
  }
  .btn {
    display: inline-block;
    margin: .5rem .5rem 1rem .5rem;
    clear: both;
    font-family: inherit;
    font-weight: 700;
    font-size: 14px;
    text-decoration: none;
    text-transform: initial;
    border: none;
    border-radius: .2rem;
    outline: none;
    padding: 0 1rem;
    height: 36px;
    line-height: 36px;
    color: #fff;
    transition: all 0.2s ease-in-out;
    box-sizing: border-box;
    background: #454cad;
    border-color: #454cad;
    cursor: pointer;
  }
}
`