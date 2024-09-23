import { CurrencyMask } from '@/components/CurrencyMask'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useTipoCambioStore } from '@/hooks/hookApi/useTipoCambioStore'
import { useForm } from '@/hooks/useForm'
import { onAddOneDetallePago } from '@/store/uiNuevaVenta/uiNuevaVenta'
// import { arrayFormaPagoTest } from '@/types/type'
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import Select from 'react-select'
const registerPago = {
    id_formaPago: 0,
    id_tipo_tarjeta: 0,
    id_tarjeta: 0,
    id_banco:0,
    fecha_pago: new Date().toISOString().slice(0, 10),
    monto_pago: '1',
    observacion_pago: '',
    n_operacion: '',
}
export const ModalVentasPay = ({show, onHide}) => {
    const dispatch = useDispatch()
    const {formState, fecha_pago, monto_pago, observacion_pago, id_forma_pago, n_operacion, id_tipo_tarjeta, id_tarjeta, id_banco, onInputChange, onInputChangeReact, onResetForm} = useForm(registerPago)
    const [formaPagoSelect, setFormaPagoSelect] = useState(0)
    const [BancoSelect, setBancoSelect] = useState(0)
    const [TipoTarjetaSelect, setTipoTarjetaSelect] = useState(0)
    const [TarjetaSelect, setTarjetaSelect] = useState(0)
    const {
		DataFormaPago,
        DataBancos,
        DataTipoTarjetas,
        DataTarjetas,
		obtenerParametrosFormaPago,
        obtenerParametrosBancos,
        obtenerParametrosTipoTarjeta,
        obtenerParametrosTarjetas,
        obtenerFormaDePagosActivos,
        dataFormaPagoActivo
	} = useTerminoStore()
	const { obtenerTipoCambioPorFecha, tipocambio } = useTipoCambioStore();
    const cancelModal = () =>{
        onHide()
        onResetForm()
    }
    const submitFormaPago = (e) =>{
        e.preventDefault()
        dispatch(onAddOneDetallePago({...formState, 
            monto_pago: parseFloat(monto_pago.replace(',', '')), 
            // label: `${formaPagoSelect.label}${BancoSelect.label?' / '.concat(BancoSelect.label):''}${TipoTarjetaSelect.label?' / '.concat(TipoTarjetaSelect.label):''}${TarjetaSelect.label?' / '.concat(TarjetaSelect.label):''}`, 
            value: `${formState.id_forma_pago}`}))
        cancelModal()
    }
    useEffect(() => {
        obtenerFormaDePagosActivos()
        obtenerTipoCambioPorFecha(new Date())
    }, [])
    // useEffect(() => {
    //     const formaPago = DataFormaPago.find(e=>e.value===id_forma_pago) || 0
    //     setFormaPagoSelect(formaPago)
    // }, [id_forma_pago])
    // useEffect(() => {
    //     const bancos = DataBancos.find(e=>e.value===id_banco) || 0
    //     setBancoSelect(bancos)
    // }, [id_banco])
    // useEffect(() => {
    //     const tipoTarjeta = DataTipoTarjetas.find(e=>e.value===id_tipo_tarjeta) || 0
    //     setTipoTarjetaSelect(tipoTarjeta)
    // }, [id_tipo_tarjeta])
    // useEffect(() => {
    //     const tarjetas = DataTarjetas.find(e=>e.value===id_tarjeta) || 0
    //     setTarjetaSelect(tarjetas)
    // }, [id_tarjeta])
    //   useEffect(() => {
	// 	obtenerParametrosFormaPago()
    //     obtenerParametrosBancos()
    //     obtenerParametrosTipoTarjeta()
    //     obtenerParametrosTarjetas()
    //   }, [])
    // console.log(dataFormaPagoActivo);
    
    // const dataFormaPagoActivo_CONDOLARES = dataFormaPagoActivo.map((e) => {
	// 			return {
	// 				value: e.value,
	// 				// label: `${e.label} ${e.value === 4 ? `| S/ ${(tipocambio.precio_compra*monto_pago?.replace(/,/g, '')).toFixed(2)}` : ''}`,
	// 			};
	// 		});
  return (
    <Modal show={show} onHide={cancelModal} size='xxl'>
        <Modal.Header>
            <Modal.Title>
                Registrar Pago
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={submitFormaPago}>
                      <div className='mb-2'>
                        <label>N operacion*:</label>
                        <input 
                          type='text' 
                          className='form-control'
                          id='n_operacion'
                          name='n_operacion'
                          value={n_operacion}
                          onChange={onInputChange}
                          required
                          />
                      </div>
                      {/* <div className='mb-2'>
                        <label>Forma de pago*:</label>
                            <Select
                            onChange={(e) => onInputChangeReact(e, 'id_forma_pago')}
                            name={'id_forma_pago'}
                            placeholder={'Seleccionar la forma de pago'}
                            className="react-select"
                            classNamePrefix="react-select"
                            options={arrayFormaPagoTest}
                            value={arrayFormaPagoTest.find(e=>e.value===id_forma_pago) || 0}
                            required
                            />
                      </div>
                       {(formaPagoSelect.value===52 || formaPagoSelect.value ===53) &&
                        <>
                        <div className='mb-2'>
                            <label>*Tipo de tarjetas:</label>
                                <Select
                                onChange={(e) => onInputChangeReact(e, 'id_tipo_tarjeta')}
                                name={'id_tipo_tarjeta'}
                                placeholder={'Seleccionar el tipo de tarjeta'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={DataTipoTarjetas}
                                value={DataTipoTarjetas.find(e=>e.value===id_tipo_tarjeta) || 0}
                                required
                                />
                        </div>
                        </>
                      }
                      
                      {(formaPagoSelect.value===52 || formaPagoSelect.value ===53) &&
                        <>
                        <div className='mb-2'>
                            <label>Tarjetas:</label>
                                <Select
                                onChange={(e) => onInputChangeReact(e, 'id_tarjeta')}
                                name={'id_tarjeta'}
                                placeholder={'Seleccionar tarjeta'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={DataTarjetas}
                                value={DataTarjetas.find(e=>e.value===id_tarjeta) || 0}
                                required
                                />
                        </div>
                        </>
                        }
                        {(formaPagoSelect.value===52 || formaPagoSelect.value ===53 || formaPagoSelect.value === 55 || formaPagoSelect.value===54) &&
                        <>
                        <div className='mb-2'>
                            <label>Banco:</label>
                                <Select
                                onChange={(e) => onInputChangeReact(e, 'id_banco')}
                                name={'id_banco'}
                                placeholder={'Seleccionar el banco'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={DataBancos}
                                value={DataBancos.find(e=>e.value===id_banco) || 0}
                                required
                                />
                        </div>
                        </>
                        } */}
                      <div className='mb-2'>
                        <label>Monto de pago:</label>
                        <input 
                          className='form-control'
                          id='monto_pago'
                          name='monto_pago'
                          value={monto_pago}
                          onChange={e=>onInputChange(CurrencyMask(e))}
                          required
                          />
                      </div>
                      {/* <div className='mb-2'>
                        <label>Observacion del pago:</label>
                        <textarea
                          className='form-control'
                          id='observacion_pago'
                          name='observacion_pago'
                          value={observacion_pago}
                          onChange={onInputChange}
                          required
                          />
                      </div> */}
                <Button className='mx-2' type='submit'>Agregar pago</Button>
                <a onClick={cancelModal} className='mx-2' style={{cursor: 'pointer', color: 'red'}}>Cancelar</a>
            </form>
        </Modal.Body>
    </Modal>
  )
}
