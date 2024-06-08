import { CurrencyMask } from '@/components/CurrencyMask'
import { useMetaStore } from '@/hooks/hookApi/useMetaStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import React, { useEffect } from 'react'
import { Button, Col, Modal } from 'react-bootstrap'
import Select from 'react-select'
const registerAsesorMeta = {
    meta_asesor: '',
    id_asesor: '',

}
export const ModalRegisterMetaAsesor = ({show, onHide, data, id_meta, meta}) => {
    const { meta_asesor, formState, id_asesor,  onInputChangeReact, onInputChange, onInputChangeRange, onResetForm } = useForm(data?data: registerAsesorMeta)
    const cancelModal = ()=>{
        onHide()
        onResetForm()
    }
    
    const {obtenerParametrosVendedores, DataVendedores} = useTerminoStore()
    const { startRegisterMetaAsesor, obtenerMetasAsesorxMetas, DataAsesorxMeta } = useMetaStore()
    useEffect(() => {
        obtenerParametrosVendedores()
    }, [])
    useEffect(() => {
        obtenerMetasAsesorxMetas(id_meta)
    }, [])
    const submitMetaAsesor = (e)=>{
        e.preventDefault()
        let nuevoArrayVenta = DataVendedores.filter(itemVenta => {
            return !DataAsesorxMeta.some(itemVentaVendida => itemVentaVendida.id_asesor === itemVenta.value);
        });
        console.log(nuevoArrayVenta);
        startRegisterMetaAsesor(id_meta, formState)
        cancelModal()
    }
    
  return (
    <>
    <Modal show={show} onHide={cancelModal} size='xxl'>
        <Modal.Header>
            <Modal.Title>Registrar la meta por asesor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={submitMetaAsesor}>
                <Col xl={12}>
                    <div className='mb-2'>
                        <Select
                            onChange={(e) => onInputChangeReact(e, 'id_asesor')}
                            name={'id_asesor'}
                            placeholder={'Seleccionar el asesor'}
                            className="react-select"
                            classNamePrefix="react-select"
                            options={DataVendedores.filter(itemVenta => {
                                return !DataAsesorxMeta.some(itemVentaVendida => itemVentaVendida.id_asesor === itemVenta.value);
                            })}
                            value={DataVendedores.filter(itemVenta => {
                                return !DataAsesorxMeta.some(itemVentaVendida => itemVentaVendida.id_asesor === itemVenta.value);
                            }).find(o => o.value === id_asesor) || 'Sin valor'}
                            required
                        ></Select>

                    </div>
                </Col>
                <Col xl={12}>
                        <div className='mb-2'>
                            <label>Meta para el asesor:</label>
                            <input  
                            className='form-control'
                            id='meta_asesor'
                            name='meta_asesor'
                            value={meta_asesor}
                            onChange={onInputChange}
                            required
                            />
                        </div>
                        </Col>
                        <Col xl={12}>
                        <input
                            
                            type='range'
                            className=' range-meta'
                            value={meta_asesor}
                            max={meta}
                            name='meta_asesor'
                            step={0.01}
                            onChange={e=>onInputChange(e)}
                        />
                        </Col>
                        <Col xl={12} className='mt-3'>
                            <Button type='submit'>Guardar</Button>
                            <a className='m-2 text-danger' onClick={cancelModal}>Cancelar</a>
                        </Col>

            </form>
        </Modal.Body>
    </Modal>
    </>
  )
}
