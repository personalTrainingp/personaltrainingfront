import { ImagenUploader } from '@/components/ImagenUploader'
import { InputButton, InputMoney, InputSelect, InputText, InputTextArea } from '@/components/InputText'
import config from '@/config'
import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useArticuloStore } from './hook/useArticuloStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
const customArticulo = {
    modelo: '',
    producto: '',
    id_marca: 0,
    costo_unitario_soles: 0.00,
    costo_unitario_dolares: 0.00,
    mano_obra_dolares: 0.00,
    mano_obra_soles: 0.00,
    descripcion: '',
    nameavatar_articulo: '',
    id_categoria: 0
}
export const ModalCustomArticulo = ({show, onHide, id, idEmpresa}) => {
    const { onPostArticulo, onUpdateArticuloxID, onObtenerArticuloxID, dataArticuloxID } = useArticuloStore()
        const { obtenerParametroPorEntidadyGrupo: obtenerMarcas, DataGeneral: dataMarcas } = useTerminoStore()
        const { obtenerParametroPorEntidadyGrupo: obtenerCategoria, DataGeneral: dataCategoria } = useTerminoStore()
        const { obtenerParametroPorEntidadyGrupo: obtenerSubCategoria, DataGeneral: dataSubCategoria } = useTerminoStore()
    const { formState, modelo, producto, id_marca, id_categoria, id_subcategoria, costo_unitario_soles, costo_unitario_dolares, mano_obra_soles, mano_obra_dolares, descripcion, nameavatar_articulo, onInputChange, onResetForm } = useForm(id==0?customArticulo:dataArticuloxID)
    const onSubmitCustomArticulo=()=>{
        if (id==0) {
            if(nameavatar_articulo){
                const formData = new FormData()
                formData.append('file', nameavatar_articulo)
                onPostArticulo(formState, formData, idEmpresa)
            }
            onCancelar()
            return;
        }else{
            const formData = new FormData()
            formData.append('file', nameavatar_articulo)
            console.log(nameavatar_articulo);
            onUpdateArticuloxID(formState, id, idEmpresa, formData)
            onCancelar()
        }
    }
    const onCancelar = ()=>{
        onResetForm()
        onHide()
    }
    useEffect(() => {
        if(show){
            obtenerMarcas('articulo', 'marca')
            obtenerCategoria('articulo', 'categoria')
            obtenerSubCategoria('articulo', 'subcategoria')
        }
    }, [show])
    
    useEffect(() => {
        if(id!==0){
            onObtenerArticuloxID(id)
        }
    }, [id, show])
  return (
    <Dialog visible={show} onHide={onCancelar} header={`${id!==0?'EDITAR ARTICULO':'AGREGAR ARTICULO'}`} style={{width: '80rem'}}>
        <form>
            <Row>
                <Col lg={3}>
                    <ImagenUploader
                        name="nameavatar_articulo"
                        height='300px'
                        onChange={onInputChange}
                        value={`${config.API_IMG.AVATAR_ARTICULO}${nameavatar_articulo}`}
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
                                <InputSelect label={'Marca'} nameInput={'id_marca'} options={dataMarcas} value={id_marca} onChange={onInputChange}  />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className='mb-2'>
                                <InputSelect label={'Categoria'} nameInput={'id_categoria'} options={dataCategoria} value={id_categoria} onChange={onInputChange}  />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className='mb-2'>
                                <InputSelect label={'Subcategoria'} nameInput={'id_subcategoria'} options={dataSubCategoria} value={id_subcategoria} onChange={onInputChange}  />
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
                                <InputButton label={'Cancelar'} onClick={onCancelar} variant={'link'}/>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </form>

    </Dialog>
  )
}
