import { ImagenUploader } from '@/components/ImagenUploader'
import { InputButton, InputMoney, InputSelect, InputText, InputTextArea } from '@/components/InputText'
import config from '@/config'
import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useArticuloStore } from './hook/useArticuloStore'

const customArticulo = {
    modelo: '',
    producto: '',
    id_marca: '',
    costo_unitario_soles: 0.00,
    costo_unitario_dolares: 0.00,
    mano_obra_dolares: 0.00,
    mano_obra_soles: 0.00,
    descripcion: ''
}
export const ModalCustomArticulo = ({show, onHide, id}) => {
    const { formState, modelo, producto, id_marca, costo_unitario_soles, costo_unitario_dolares, mano_obra_soles, mano_obra_dolares, descripcion, onInputChange, onResetForm,  } = useForm(customArticulo)
    const { onPostArticulo, onUpdateArticulo } = useArticuloStore()
    const onSubmitCustomArticulo=()=>{
        if (id==0) {
            
        }else{
            
        }
    }
    useEffect(() => {
        
    }, [])
    
  return (
    <Dialog visible={show} onHide={onHide} header={`${id!==0?'EDITAR ARTICULO':'AGREGAR ARTICULO'}`} style={{width: '80rem'}}>
        <form>
            <Row>
                <Col lg={3}>
                <ImagenUploader
                    name="imgAvatar_BASE64"
                    value={`${config.API_IMG.AVATAR_ARTICULO}`}
                    height='300px'
                    // onChange={(e)=>{
                    //     onRegisterFileChange(e)
                    //     ViewDataImg(e)
                    // }}
                    />
                </Col>
                <Col lg={9}>
                    <Row>
                        <Col lg={4}>
                            <div className='mb-2'>
                                <InputText label={'modelo'} nameInput={'modelo'} onChange={onInputChange} value={modelo} />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className='mb-2'>
                                <InputText label={'item'} nameInput={'producto'} onChange={onInputChange} value={producto} />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className='mb-2'>
                                <InputSelect label={'Marca'} nameInput={'id_marca'} onChange={onInputChange}  />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className='mb-2'>
                                <InputMoney label={'COSTO UNITARIO SOLES'} nameInput={'costo_unitario_soles'} onChange={onInputChange} value={costo_unitario_soles}/>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className='mb-2'>
                                <InputMoney label={'COSTO UNITARIO DOLARES'} nameInput={'costo_unitario_dolares'} onChange={onInputChange} value={costo_unitario_dolares}/>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className='mb-2'>
                                <InputMoney label={'COSTO MANO OBRA SOLES'} nameInput={'mano_obra_soles'} onChange={onInputChange} value={mano_obra_soles}/>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className='mb-2'>
                                <InputMoney label={'COSTO MANO OBRA DOLARES'} nameInput={'mano_obra_dolares'} onChange={onInputChange} value={mano_obra_dolares}/>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className='mb-2'>
                                <InputTextArea label={'Descripcion'} nameInput={'descripcion'} onChange={onInputChange} value={descripcion}/>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className='mb-2'>
                                <InputButton label={'Guardar'} onClick={onSubmitCustomArticulo}/>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </form>

    </Dialog>
  )
}
