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
export const SideBarFormPago = ({show, onHide}) => {
    const dispatch = useDispatch()
    const {formState, fecha_pago, monto_pago, observacion_pago, id_forma_pago, n_operacion, id_tipo_tarjeta, id_tarjeta, id_banco, onInputChange, onInputChangeReact, onResetForm} = useForm(registerPago)
    const [formaPagoSelect, setFormaPagoSelect] = useState(0)
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
            monto_pago: parseFloat(monto_pago.replace(',', '')), 
            label_forma_pago: formaPago.find(e=>e.value===id_forma_pago).label,
            label_banco: dataBancos.find(b=>b.id_banco===id_banco)?.label_banco||0,
            label_tipo_tarjeta: dataTipoTarjeta.find(tt=>tt.id_tipo_tarjeta===id_tipo_tarjeta)?.label_tipo_tarjeta||'',
            label_tarjeta: dataTarjetas.find(t=>t.id_tarjeta===id_tarjeta)?.label,
            // label: `${formaPagoSelect.label}${BancoSelect.label?' / '.concat(BancoSelect.label):''}${TipoTarjetaSelect.label?' / '.concat(TipoTarjetaSelect.label):''}${TarjetaSelect.label?' / '.concat(TarjetaSelect.label):''}`, 
            value: `${formState.id_forma_pago}`}))
        cancelModal()
    }
    useEffect(() => {
        obtenerFormaDePagosActivos()
        obtenerTipoCambioPorFecha(new Date())
        obtenerFormasPagos()
    }, [])
    // console.log(dataFormaPagoActivo.find(f=>f.id_forma_pago));
    const formaPago = dataFormaPagoActivo.map(f=>({
      value: f.id_forma_pago,
      label: `${f.label_param}`,
    }))
    const tipoTarjeta = dataTipoTarjeta.map(tt=>({
      value: tt.id_tipo_tarjeta,
      label: `${tt.label_tipo_tarjeta}`,
    }))
    const tarjetas = dataTarjetas.map(t=>({
      value: t.id_tarjeta,
      label: `${t.label_tarjeta}`,
    }))
    const bancos = dataBancos.map(t=>({
      value: t.id_banco,
      label: `${t.label_banco}`,
    }))
    useEffect(() => {
      const tipoTarjetas = dataFormaPagoActivo.find(f=>f.id_forma_pago===id_forma_pago)?.dataTipoTarjeta||[]
      setdataTipoTarjeta(tipoTarjetas)
    }, [id_forma_pago])
    
    useEffect(() => {
      // if()          n         
      const tarjetas = dataTipoTarjeta.find(tt=>tt.id_tipo_tarjeta===id_tipo_tarjeta)?.dataTarjeta || [];
      setdataTarjetas(tarjetas)
    }, [id_forma_pago, id_tipo_tarjeta])
    

    useEffect(() => {
      const dataBancos = dataTarjetas.find(b=>b.id_tarjeta === id_tarjeta)?.dataBancos || [];
      setdataBancos(dataBancos)
    }, [id_forma_pago, id_tipo_tarjeta, id_tarjeta])
    console.log(dataFormaPagoActivo);
    
    // useEffect(() => {
    //   const bancos = dataFormaPagoActivo.find(f=>f.id_forma_pago===id_forma_pago)?.dataBancos||[]
    //   setdataBancos(bancos)
    // }, [id_forma_pago])
  //   useEffect(() => {
  //     const bancos = dataFormaPagoActivo.find(e=>e.id_empresa==id_enterprice)||[]
      
  //     // setgrupoGasto(grupos)
  // }, [id_tipoGasto])
  // useEffect(() => {
  //     const conceptos = dataParametrosGastos.find(e=>e.id_empresa==id_enterprice)?.tipo_gasto?.find(e=>e.id_tipoGasto===id_tipoGasto)?.grupos.find(g=>g.value==grupo)?.conceptos||[]
  //     console.log(conceptos);
      
  //     setgastoxGrupo(conceptos)
  // }, [grupo])
    
  return (
    <div className="card flex justify-content-center">
        <Sidebar visible={show} position='left' onHide={onHide} style={{width: '350px'}}>
            <h3 className='mb-4'>Registrar Pago</h3>
            <form onSubmit={submitFormaPago}>
                      <div className='mb-4'>
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
                      <div className='mb-4'>
                        <label>Forma de pago*:</label>
                            <Select
                            onChange={(e) => onInputChangeReact(e, 'id_forma_pago')}
                            name={'id_forma_pago'}
                            placeholder={'Seleccionar la forma de pago'}
                            className="react-select"
                            classNamePrefix="react-select"
                            options={formaPago}

                            value={formaPago.find(e=>e.value===id_forma_pago) || 0}
                            required
                            />
                      </div>
                       {(dataTipoTarjeta.length>0) &&
                        <>
                        <div className='mb-4'>
                            <label>*Tipo de tarjetas:</label>
                                <Select
                                onChange={(e) => onInputChangeReact(e, 'id_tipo_tarjeta')}
                                name={'id_tipo_tarjeta'}
                                placeholder={'Seleccionar el tipo de tarjeta'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={tipoTarjeta}
                                value={tipoTarjeta.find(e=>e.value===id_tipo_tarjeta) || 0}
                                required
                                />
                        </div>
                        </>
                      }
                      
                      {(dataTarjetas.length>0) &&
                        <>
                        <div className='mb-4'>
                            <label>Tarjetas:</label>
                                <Select
                                onChange={(e) => onInputChangeReact(e, 'id_tarjeta')}
                                name={'id_tarjeta'}
                                placeholder={'Seleccionar tarjeta'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={tarjetas}
                                value={tarjetas.find(e=>e.value===id_tarjeta) || 0}
                                required
                                />
                        </div>
                        </>
                        }
                        {(dataBancos.length>0) &&
                        <>
                        <div className='mb-4'>
                            <label>Banco:</label>
                                <Select
                                onChange={(e) => onInputChangeReact(e, 'id_banco')}
                                name={'id_banco'}
                                placeholder={'Seleccionar el banco'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={bancos}
                                value={bancos.find(e=>e.value===id_banco) || 0}
                                required
                                />
                        </div>
                        </>
                        }
                      <div className='mb-4'>
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
        </Sidebar>
    </div>
  )
}
