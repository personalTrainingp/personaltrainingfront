import { InputButton, InputSelect, InputText } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useVentasPagosStore } from './useVentasPagosStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
const customCuotas = {
    n_cuotas: 0,
    id_forma_pago: 0, id_tarjeta: 0, id_tipo_tarjeta: 0, id_banco: 0
}
export const ModalReportePagosVentas = ({onHide, show=false, id}) => {
    
        const [dataTipoTarjeta, setdataTipoTarjeta] = useState([])
        const [dataTarjetas, setdataTarjetas] = useState([])
        const [dataBancos, setdataBancos] = useState([])
    const { updatePagosVentas, obtenerPagosVentasxID, dataPagosxID } = useVentasPagosStore()
    const {
            obtenerFormaDePagosActivos,
            dataFormaPagoActivo
        } = useTerminoStore()
    useEffect(() => {
        if(show){
            obtenerPagosVentasxID(id)
            obtenerFormaDePagosActivos()
        }
    }, [id])
    const { formState, n_cuotas, id_forma_pago, id_tarjeta, id_tipo_tarjeta, id_banco, onInputChange, onResetForm } = useForm(id==0?customCuotas:dataPagosxID)
    const onClickSubmit = ()=>{
        updatePagosVentas(id, formState)
        cancelSubmit()
    }
    const cancelSubmit = ()=>{
        onHide()
        onResetForm()
    }
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
        }, [id_forma_pago, id])
        
        useEffect(() => {
          // if()          n         
          const tarjetas = dataTipoTarjeta.find(tt=>tt.id_tipo_tarjeta===id_tipo_tarjeta)?.dataTarjeta || [];
          setdataTarjetas(tarjetas)
        }, [id_forma_pago, id_tipo_tarjeta, id])
        
    
        useEffect(() => {
          const dataBancos = dataTarjetas.find(b=>b.id_tarjeta === id_tarjeta)?.dataBancos || [];
          setdataBancos(dataBancos)
        }, [id_forma_pago, id_tipo_tarjeta, id_tarjeta, id])
  return (
    <Modal show={show} onHide={onHide}>
        <div className='m-2'>
            <InputSelect label={'FORMA DE PAGO'} nameInput={'id_forma_pago'} onChange={onInputChange} value={id_forma_pago} options={formaPago} required/>
            <InputSelect label={'TIPO DE TARJETA'} nameInput={'id_tipo_tarjeta'} onChange={onInputChange} value={id_tipo_tarjeta} options={tipoTarjeta} required/>
            <InputSelect label={'TARJETA'} nameInput={'id_tarjeta'} onChange={onInputChange} value={id_tarjeta} options={tarjetas} required/>
            <InputSelect label={'BANCO'} nameInput={'id_banco'} onChange={onInputChange} value={id_banco} options={bancos} required/>
            <InputText label={'N CUOTAS'} nameInput={'n_cuotas'} onChange={onInputChange} value={n_cuotas} required/>
            <InputButton label={'ACTUALIZAR'} onClick={onClickSubmit}/>
            <InputButton label={'CANCELAR'} onClick={cancelSubmit} variant={'_link'}/>
        </div>
    </Modal>
  )
}
