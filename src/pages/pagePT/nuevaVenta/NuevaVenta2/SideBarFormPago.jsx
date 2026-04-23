import { CurrencyMask } from '@/components/CurrencyMask'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useTipoCambioStore } from '@/hooks/hookApi/useTipoCambioStore'
import { useForm } from '@/hooks/useForm'
import { onAddOneDetallePago } from '@/store/uiNuevaVenta/uiNuevaVenta'
import { Sidebar } from 'primereact/sidebar'
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import Select from 'react-select'
import { useTerminologiaPagos } from './useTerminologiaPagos'
import { InputNumber, InputSelect } from '@/components/InputText'
const registerPago = {
    id_operador: 0,
    id_formaPago: 0,
    id_tipo_tarjeta: 0,
    id_tarjeta: 0,
    id_banco:0,
    fecha_pago: new Date().toISOString().slice(0, 10),
    monto_pago: '1',
    observacion_pago: '',
    n_operacion: '',
    n_cuotas: 0,
    es_nacional: 1
}
export const SideBarFormPago = ({show, onHide}) => {
    const dispatch = useDispatch()
    const {formState, monto_pago, es_nacional, id_forma_pago, id_operador, n_operacion, id_tipo_tarjeta, id_tarjeta, id_banco, n_cuotas, onInputChange, onResetForm} = useForm(registerPago)
    const [dataTipoTarjeta, setdataTipoTarjeta] = useState([])
    const [dataTarjetas, setdataTarjetas] = useState([])
    const [dataBancos, setdataBancos] = useState([])
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
  const { DataGeneral:dataOperadores, obtenerParametroPorEntidadyGrupo:obtenerOperadores } = useTerminoStore()
  const { dataFormaPagos, obtenerFormasPagos } = useTerminologiaPagos()
	const { obtenerTipoCambioPorFecha, tipocambio } = useTipoCambioStore();
    const cancelModal = () =>{
        onHide()
        onResetForm()
    }
    const submitFormaPago = (e) =>{
        e.preventDefault()
        dispatch(onAddOneDetallePago({
            ...formState, 
            es_nacional,
            monto_pago: parseFloat(monto_pago.replace(',', '')), 
            label_forma_pago: formaPago.find(e=>e.value===id_forma_pago).label,
            label_banco: dataBancos.find(b=>b.id_banco===id_banco)?.label_banco||0,
            label_tipo_tarjeta: dataTipoTarjeta.find(tt=>tt.id_tipo_tarjeta===id_tipo_tarjeta)?.label_tipo_tarjeta||'',
            label_tarjeta: dataTarjetas.find(t=>t.id_tarjeta===id_tarjeta)?.label,
            n_cuotas: n_cuotas,
            label_operador: '',
            // label: `${formaPagoSelect.label}${BancoSelect.label?' / '.concat(BancoSelect.label):''}${TipoTarjetaSelect.label?' / '.concat(TipoTarjetaSelect.label):''}${TarjetaSelect.label?' / '.concat(TarjetaSelect.label):''}`, 
            value: `${formState.id_forma_pago}`}))
        cancelModal()
    }
    useEffect(() => {

        obtenerOperadores('formapago', 'operador')
        obtenerFormaDePagosActivos()
        obtenerTipoCambioPorFecha(new Date())
        obtenerFormasPagos()
    }, [])
    // console.log(dataFormaPagoActivo.find(f=>f.id_forma_pago));
    const formaPago = dataFormaPagoActivo.map(f=>({
      value: f.id_forma_pago,
      label: `${f.id_forma_pago} - ${f.label_param}`,
    }))
    const tipoTarjeta = dataTipoTarjeta.map(tt=>({
      value: tt.id_tipo_tarjeta,
      label: `${tt.id_tipo_tarjeta} - ${tt.label_tipo_tarjeta}`,
    }))
    const tarjetas = dataTarjetas.map(t=>({
      value: t.id_tarjeta,
      label: `${t.id_tarjeta} - ${t.label_tarjeta}`,
    }))
    const bancos = dataBancos.map(t=>({
      value: t.id_banco,
      label: `${t.id_banco}-${t.label_banco}`,
    }))
    useEffect(() => {
      const tipoTarjetas = dataFormaPagoActivo.find(f=>f.id_forma_pago===id_forma_pago)?.dataTipoTarjeta||[]
      setdataTipoTarjeta(tipoTarjetas)
    }, [id_forma_pago])
    
    useEffect(() => {    
      const tarjetas = dataTipoTarjeta.find(tt=>tt.id_tipo_tarjeta===id_tipo_tarjeta)?.dataTarjeta || [];
      setdataTarjetas(tarjetas)
    }, [id_forma_pago, id_tipo_tarjeta])
    

    useEffect(() => {
      const dataBancos = dataTarjetas.find(b=>b.id_tarjeta === id_tarjeta)?.dataBancos || [];
      setdataBancos(dataBancos)
    }, [id_forma_pago, id_tipo_tarjeta, id_tarjeta])
    console.log(dataFormaPagoActivo);
  return (
    <div className="card flex justify-content-center">
        <Sidebar visible={show} position='left' onHide={onHide} style={{width: '350px'}}>
            <h3 className='mb-4'>Registrar Pago</h3>
            <form onSubmit={submitFormaPago}>
                      <div className='mb-4'>
                        <label>N autorizacion*:</label>
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
                        <div className='mb-4'>
                          <InputSelect label={'Operador:'} nameInput={'id_operador'} onChange={onInputChange} options={dataOperadores} value={id_operador}/>
                        </div>
                        <div className='mb-4'>
                          <InputSelect label={'Forma de pago:'} nameInput={'id_forma_pago'} onChange={onInputChange} options={formaPago} value={id_forma_pago} />
                        </div>
                        <div className='mb-4'>
                          <InputSelect label={'Tipo de tarjetas:'} nameInput={'id_tipo_tarjeta'} onChange={onInputChange} options={tipoTarjeta} value={id_tipo_tarjeta} />
                        </div>
                        <div className='mb-4'>
                          <InputSelect label={'PROCENDENCIA:'} nameInput={'es_nacional'} onChange={onInputChange} options={[{value: 1, label: 'NACIONAL'}, {value: 0, label: 'INTERNACIONAL'}]} value={es_nacional} />
                        </div>
                        <div className='mb-4'>
                          <InputSelect label={'TARJETA:'} nameInput={'id_tarjeta'} onChange={onInputChange} options={tarjetas} value={id_tarjeta} />
                        </div>
                        <div className='mb-4'>
                          <InputSelect label={'BANCO:'} nameInput={'id_banco'} onChange={onInputChange} options={bancos} value={id_banco} />
                        </div>
                        <div className='mb-4'>
                          <InputNumber label={'CUOTAS'} nameInput={'n_cuotas'} onChange={onInputChange} value={n_cuotas} />
                        </div>
                        <div className='mb-4'>
                          <label>Monto de pago:</label>
                          <input 
                            className='form-control'
                            id='monto_pago'
                            name='monto_pago'
                            value={monto_pago}
                            onChange={e=>onInputChange(CurrencyMask(e))}
                            />
                        </div>
                        <Button className='mx-2' type='submit'>Registrar pago</Button>
                        <a onClick={cancelModal} className='mx-2' style={{cursor: 'pointer', color: 'red'}}>Cancelar</a>
            </form>
        </Sidebar>
    </div>
  )
}
