
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { arrayEstados, arrayFinanzas, arrayMonedas, arrayTipoAporte } from '@/types/type'
import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, ModalBody, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { CurrencyMask } from '@/components/CurrencyMask'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { useAportesIngresosStore } from '@/hooks/hookApi/useAportesIngresosStore'
const registerAportes = {
    id_inversionista: 0, 
    fecha_aporte:'', 
    moneda:'', 
    monto_aporte:'', 
    id_receptor: 0, 
    id_tipo_aporte:0, 
    id_forma_pago:0, 
    n_operacion: '',
    id_banco:0, 
    fec_comprobante: '', 
    id_tipo_comprobante: 0, 
    n_comprobante: '',
    observacion:'',
    tipo_aporte: 0
}
export const ModalAportante = ({onHide, show, data, isLoading}) => {
    const onClickCancelModal = ()=>{
        onHide()
        onResetForm()
    }
    const [loadingRegister, setloadingRegister] = useState(false)
    const {dataParametrosGastos} = useSelector(e=>e.finanzas)
    const { obtenerParametroPorEntidadyGrupo: obtenerParametroTipoComprobante, DataGeneral: DataTipoComprobante } = useTerminoStore()
    const { startRegistrarAportes } = useAportesIngresosStore()
    // const { obtenerParametroPorEntidadyGrupo: obtenerParametroFormaPago, DataGeneral: DataFormaPago } = useTerminoStore()
    const { obtenerParametrosFormaPago, DataFormaPago } = useTerminoStore()
    const { obtenerInversionistaRegistrados, dataInversionistas } = useTerminoStore()
    const { obtenerParametrosBancos, DataBancos } = useTerminoStore()
    const [showLoading, setshowLoading] = useState(false)
    // const { obtenerTipoCambioPorFecha, tipocambio } = useTipoCambioStore()
    // useEffect(() => {
    //     obtenerTipoCambioPorFecha(new Date().toLocaleDateString())
    // }, [])
        

        useEffect(() => {
            obtenerParametroTipoComprobante('finanzas', 'tipo_comprabante')
            obtenerInversionistaRegistrados()
            obtenerParametrosFormaPago()
            obtenerParametrosBancos()
        }, [])
        
        const saveProspecto = async(e)=>{
            e.preventDefault()
            if(data){
                // console.log("con");
                
                setshowLoading(true)
                // await startActualizarGastos(formState, data.id)
                setshowLoading(false)
                // console.log("sin ");
                // showToast('success', 'Editar gasto', 'Gasto editado correctamente', 'success')
                onClickCancelModal()
                return;
            }
            setshowLoading(true)
            await startRegistrarAportes(formState)
            setshowLoading(false)
            // showToast(objetoToast);
            onClickCancelModal()
        }
        const [openModalProv, setopenModalProv] = useState(false)
    const cancelarAporte = ()=>{
        onHide()
        onResetForm()
    }
    const {formState, 
            id_inversionista, 
            fecha_aporte, 
            moneda, 
            monto_aporte, 
            id_forma_pago, 
            id_banco, 
            n_operacion,
            fec_comprobante, 
            id_tipo_comprobante, 
            tipo_aporte,
            n_comprobante, observacion, onResetForm, onInputChange, onInputChangeReact} = useForm(data?data:registerAportes)
  return (
    <>
    {showLoading?(
        <Modal size='sm' show={showLoading}>
            <ModalBody>
            <div className='d-flex flex-column align-items-center justify-content-center text-center' style={{height: '15vh'}}>
                    <span className="loader-box2"></span>
                    <br/>
                    <p className='fw-bold font-16'>
                        Si demora mucho, comprobar su conexion a internet
                    </p>
            </div>
            </ModalBody>
        </Modal> 
    ):(
        <>
        
			<Dialog
            visible={show}
            style={{ width: '70rem' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header="Nuevo Aporte"
            modal
            className="p-fluid"
            onHide={cancelarAporte}
        >
            <form onSubmit={saveProspecto}>
                <Row>
                    <Col lg={5}>
                        <div className="field">
                            <label htmlFor="id_inversionista" className="font-bold">
                                Inversionista*
                            </label>
                            <Select
                                onChange={(e) => onInputChangeReact(e, 'id_inversionista')}
                                name="id_inversionista"
                                placeholder={'Seleccionar el inversionista'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={dataInversionistas}
                                value={dataInversionistas.find(
                                    (option) => option.value === id_inversionista
                                )||0}
                                
                                required
							/>
                        </div>
                    </Col>
                    <Col lg={7}>
                        <div className="field">
                            <label htmlFor="tipo_aporte" className="font-bold">
                                Tipo*
                            </label>
                            <Select
                                onChange={(e) => onInputChangeReact(e, 'tipo_aporte')}
                                name="tipo_aporte"
                                placeholder={'Seleccionar el tipo'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={arrayTipoAporte}
                                value={arrayTipoAporte.find(
                                    (option) => option.value === tipo_aporte
                                )||0}
                                
                                required
							/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="field">
                            <label htmlFor="fecha_aporte" className="font-bold">
                                Fecha del aporte*
                            </label>
                            <InputText
                                value={fecha_aporte}
                                name='fecha_aporte'
                                type='Date'
                                onChange={onInputChange}
                                required
                                autoFocus
                            />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="field">
                            <label htmlFor="moneda" className="font-bold">
                                Moneda*
                            </label>
                            
                            <Select
                                    onChange={(e) => onInputChangeReact(e, 'moneda')}
                                    name="moneda"
                                    placeholder={'Seleccionar la moneda'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={arrayMonedas}
                                    value={arrayMonedas.find(
                                        (option) => option.value === moneda
                                    )}
                                    required
                                />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="field">
                            <label htmlFor="monto_aporte" className="font-bold">
                                Monto*
                            </label>
                            <InputText
                                value={monto_aporte}
                                name='monto_aporte'
                                type='text'
                                onChange={onInputChange}
                                required
                                autoFocus
                            />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="field">
                            <label htmlFor="id_forma_pago" className="font-bold">
                                Formas de ingreso*
                            </label>
                            <Select
                                onChange={(e) => onInputChangeReact(e, 'id_forma_pago')}
                                name="id_forma_pago"
                                placeholder={'Seleccionar la forma de aporte'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={DataFormaPago}
                                value={DataFormaPago.find(
                                    (option) => option.value === id_forma_pago
                                )||0}
                                
                                required
							/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="field">
                            <label htmlFor="id_banco" className="font-bold">
                                Banco*
                            </label>
                            <Select
                                onChange={(e) => onInputChangeReact(e, 'id_banco')}
                                name="id_banco"
                                placeholder={'Seleccionar la Banco'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={DataBancos}
                                value={DataBancos.find(
                                    (option) => option.value === id_banco
                                )||0}
							/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="field">
                            <label htmlFor="n_operacion" className="font-bold">
                                N de operacion*
                            </label>
                            <InputText
                                value={n_operacion}
                                name='n_operacion'
                                placeholder='00000'
                                type='text'
                                onChange={onInputChange}
                                required
                                autoFocus
                            />
                        </div>
                    </Col>
                    <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="id_tipo_comprobante" className="form-label">
                                    Tipo de comprobante*
                                </label>
                                <Select
                                    onChange={(e) => onInputChangeReact(e, 'id_tipo_comprobante')}
                                    name="id_tipo_comprobante"
                                    placeholder={'Seleccionar el tipo de comprobante'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={DataTipoComprobante}
                                    value={DataTipoComprobante.find(
                                        (option) => option.value === id_tipo_comprobante
                                    )}
                                    required
                                />
                            </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-4">
                            <label htmlFor="n_comprobante" className="form-label">
                                Numero de comprobante
                            </label>
                            <input
                                    className="form-control"
                                    name="n_comprobante"
                                    id="n_comprobante"
                                    value={n_comprobante}
                                    onChange={onInputChange}
                                    placeholder="EJ. 6060606"
                                />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-4">
                            <label htmlFor="fec_comprobante" className="form-label">
                                fecha de comprobante
                            </label>
                            <input
                                    className="form-control"
                                    type='date'
                                    name="fec_comprobante"
                                    id="fec_comprobante"
                                    value={fec_comprobante}
                                    onChange={onInputChange}
                                    placeholder="EJ. 20-02-24"
                                />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className="field">
                            <label htmlFor="observacion" className="font-bold">
                                Observacion
                            </label>
                            <InputTextarea
                                id="name"
                                value={observacion}
                                name='observacion'
                                onChange={onInputChange}
                                autoFocus
                                rows={3}
                                cols={20}
                            />
                        </div>
                    </Col>
                    
            <Col>
                                    <Button className='mx-2' type='submit' >Guardar</Button>
                                    <a className='mx-2' style={{cursor: 'pointer', color: 'red'}} onClick={cancelarAporte}>Cancelar</a>
                                </Col>
                </Row>
            </form>
        </Dialog>
        </>
    ) 

    }
    </>
  )
}


/*

import React, { useEffect } from 'react'

import { InputTextarea } from 'primereact/inputtextarea';

import { RadioButton } from 'primereact/radiobutton';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { useForm } from '@/hooks/useForm';
import Select from 'react-select'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { useProspectoStore } from '@/hooks/hookApi/useProspectoStore';
import { arrayGrupos, arrayMonedas } from '@/types/type';
import { useAportesIngresosStore } from '@/hooks/hookApi/useAportesIngresosStore';
const registerAportes = {
    id_inversionista: 0, 
    grupo:'', 
    fecha_aporte:'', 
    moneda:'', 
    monto_aporte:'', 
    id_receptor: 0, 
    id_tipo_aporte:0, 
    id_forma_pago:0, 
    id_banco:0, 
    fec_comprobante: '', 
    id_tipo_comprobante: 0, 
    n_comprobante: '',
    observacion:''
}
export const ModalAportante = ({show, onHide, data}) => {
    const { obtenerProgramasActivos, programasActivos } = useTerminoStore()
    const { obtenerParametrosVendedores, DataVendedores } = useTerminoStore()
    const { startRegistrarAportes } = useAportesIngresosStore()

    const { obtenerInversionistaRegistrados, dataInversionistas } = useTerminoStore()
    const saveProspecto = () =>{
        startRegistrarAportes(formState)
        cancelarAporte()
    }
    
    const { obtenerParametroPorEntidadyGrupo: obtenerParametroTipoComprobante, DataGeneral: DataTipoComprobante } = useTerminoStore()
    // const { obtenerParametroPorEntidadyGrupo: obtenerParametroFormaPago, DataGeneral: DataFormaPago } = useTerminoStore()
    const { obtenerParametrosFormaPago, DataFormaPago } = useTerminoStore()
    const { obtenerParametrosBancos, DataBancos } = useTerminoStore()
    const { dataColaboradores, obtenerDataColaboradores } = useTerminoStore()
    useEffect(() => {
        obtenerProgramasActivos()
        obtenerParametrosVendedores()
        obtenerInversionistaRegistrados()
        obtenerParametrosFormaPago()
        obtenerParametrosBancos()
        obtenerDataColaboradores()
        obtenerParametroTipoComprobante('finanzas', 'tipo_comprabante')
    }, [])
    
    const cancelarAporte = ()=>{
        onHide()
        onResetForm()
    }
    const {formState, 
            id_inversionista, 
            grupo, 
            fecha_aporte, 
            moneda, 
            monto_aporte, 
            id_receptor, 
            id_tipo_aporte, 
            id_forma_pago, 
            id_banco, 
            fec_comprobante, 
            id_tipo_comprobante, 
            n_comprobante, observacion, onResetForm, onInputChange, onInputChangeReact} = useForm(data?data:registerAportes)
	const productDialogFooter = (
		<React.Fragment>
			<Button label="Cancelar" icon="pi pi-times" className='text-danger' outlined onClick={cancelarAporte} />
			<Button label={"Guardar"} className='bg-success' icon="pi pi-check" onClick={saveProspecto} />
		</React.Fragment>
	);
    const dataGrupo = [
        {value: '', },

    ]
  return (
    
			<Dialog
            visible={show}
            style={{ width: '70rem' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header="Nuevo Aporte"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={cancelarAporte}
        >
            <form>
                <Row>
                    <Col lg={12}>
                        <div className="field">
                            <label htmlFor="id_inversionista" className="font-bold">
                                Inversionista*
                            </label>
                            <Select
                                onChange={(e) => onInputChangeReact(e, 'id_inversionista')}
                                name="id_inversionista"
                                placeholder={'Seleccionar el inversionista'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={dataInversionistas}
                                value={dataInversionistas.find(
                                    (option) => option.value === id_inversionista
                                )||0}
                                
                                required
							/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="field">
                            <label htmlFor="fecha_aporte" className="font-bold">
                                Fecha del aporte*
                            </label>
                            <InputText
                                value={fecha_aporte}
                                name='fecha_aporte'
                                type='Date'
                                onChange={onInputChange}
                                required
                                autoFocus
                            />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="field">
                            <label htmlFor="moneda" className="font-bold">
                                Moneda*
                            </label>
                            
                            <Select
                                    onChange={(e) => onInputChangeReact(e, 'moneda')}
                                    name="moneda"
                                    placeholder={'Seleccionar la moneda'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={arrayMonedas}
                                    value={arrayMonedas.find(
                                        (option) => option.value === moneda
                                    )}
                                    required
                                />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="field">
                            <label htmlFor="monto_aporte" className="font-bold">
                                Monto*
                            </label>
                            <InputText
                                value={monto_aporte}
                                name='monto_aporte'
                                type='text'
                                onChange={onInputChange}
                                required
                                autoFocus
                            />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="field">
                            <label htmlFor="id_forma_pago" className="font-bold">
                                Formas de ingreso*
                            </label>
                            <Select
                                onChange={(e) => onInputChangeReact(e, 'id_forma_pago')}
                                name="id_forma_pago"
                                placeholder={'Seleccionar la forma de aporte'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={DataFormaPago}
                                value={DataFormaPago.find(
                                    (option) => option.value === id_forma_pago
                                )||0}
                                
                                required
							/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="field">
                            <label htmlFor="id_banco" className="font-bold">
                                Banco*
                            </label>
                            <Select
                                onChange={(e) => onInputChangeReact(e, 'id_banco')}
                                name="id_banco"
                                placeholder={'Seleccionar la Banco'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={DataBancos}
                                value={DataBancos.find(
                                    (option) => option.value === id_banco
                                )||0}
							/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="field">
                            <label htmlFor="monto_aporte" className="font-bold">
                                N de operacion*
                            </label>
                            <InputText
                                value={monto_aporte}
                                name='monto_aporte'
                                placeholder='00000'
                                type='text'
                                onChange={onInputChange}
                                required
                                autoFocus
                            />
                        </div>
                    </Col>
                    <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="id_tipo_comprobante" className="form-label">
                                    Tipo de comprobante*
                                </label>
                                <Select
                                    onChange={(e) => onInputChangeReact(e, 'id_tipo_comprobante')}
                                    name="id_tipo_comprobante"
                                    placeholder={'Seleccionar el tipo de comprobante'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={DataTipoComprobante}
                                    value={DataTipoComprobante.find(
                                        (option) => option.value === id_tipo_comprobante
                                    )}
                                    required
                                />
                            </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-4">
                            <label htmlFor="n_comprobante" className="form-label">
                                Numero de comprobante
                            </label>
                            <input
                                    className="form-control"
                                    name="n_comprobante"
                                    id="n_comprobante"
                                    value={n_comprobante}
                                    onChange={onInputChange}
                                    placeholder="EJ. 6060606"
                                />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-4">
                            <label htmlFor="fec_comprobante" className="form-label">
                                fecha de comprobante
                            </label>
                            <input
                                    className="form-control"
                                    type='date'
                                    name="fec_comprobante"
                                    id="fec_comprobante"
                                    value={fec_comprobante}
                                    onChange={onInputChange}
                                    placeholder="EJ. 20-02-24"
                                />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className="field">
                            <label htmlFor="observacion" className="font-bold">
                                Observacion
                            </label>
                            <InputTextarea
                                id="name"
                                value={observacion}
                                name='observacion'
                                onChange={onInputChange}
                                autoFocus
                                rows={3}
                                cols={20}
                            />
                        </div>
                    </Col>
                    
                </Row>
            </form>
        </Dialog>
  )
}


*/