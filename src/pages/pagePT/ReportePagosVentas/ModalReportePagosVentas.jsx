import { InputButton, InputDate, InputSelect, InputText } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useVentasPagosStore } from './useVentasPagosStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
const customCuotas = {
    id_venta: 0,
    id_operador: 0,
    n_cuotas: 0,
    es_nacional: 1,
    id_forma_pago: 0, id_tarjeta: 0, id_tipo_tarjeta: 0, id_banco: 0, parcial_monto: 0, n_operacion: 0, fecha_pago: null
}
export const ModalReportePagosVentas = ({onHide, show=false, id}) => {
    
        const [dataTipoTarjeta, setdataTipoTarjeta] = useState([])
        const [dataTarjetas1, setdataTarjetas] = useState([])
        const [dataBancos1, setdataBancos] = useState([])
    const { updatePagosVentas, postPagosVentas, obtenerPagosVentasxID, dataPagosxID } = useVentasPagosStore()
    const {
            obtenerFormaDePagosActivos,
            dataFormaPagoActivo
        } = useTerminoStore()
        const { DataGeneral:dataFormaPago, obtenerParametroPorEntidadyGrupo:obtenerFormasDePago } = useTerminoStore()
        const { DataGeneral:dataTarjetas, obtenerParametroPorEntidadyGrupo:obtenerTarjetas } = useTerminoStore()
        const { DataGeneral:dataBancos, obtenerParametroPorEntidadyGrupo:obtenerBancos } = useTerminoStore()
        const { DataGeneral:dataTipoTarjetas, obtenerParametroPorEntidadyGrupo:obtenerTipoTarjetas } = useTerminoStore()
        const { DataGeneral:dataOperador, obtenerParametroPorEntidadyGrupo:obtenerOperador } = useTerminoStore()
    useEffect(() => {
        if(show){
            obtenerPagosVentasxID(id)
          }
        }, [id])
        useEffect(() => {
          if(show){
              obtenerFormaDePagosActivos()
              obtenerFormasDePago('formapago', 'formapago')
              obtenerTarjetas('formapago', 'tarjeta')
              obtenerBancos('formapago', 'banco')
              obtenerTipoTarjetas('formapago', 'tarje')
              obtenerOperador('formapago', 'operador')
          }
    }, [show])
    
    const { formState, id_venta, id_operador, n_cuotas, es_nacional, id_forma_pago, id_tarjeta, id_tipo_tarjeta, id_banco, parcial_monto, fecha_pago, n_operacion, onInputChange, onResetForm } = useForm(id==0?customCuotas:dataPagosxID)
    const onClickSubmit = ()=>{
        if(id!==0){
          updatePagosVentas(id, formState)
          cancelSubmit()
        }else{
          postPagosVentas(formState)
          cancelSubmit()
        }
    }
    const cancelSubmit = ()=>{
        onHide()
        onResetForm()
    }
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
          const dataBancos = dataTarjetas1.find(b=>b.id_tarjeta === id_tarjeta)?.dataBancos || [];
          setdataBancos(dataBancos)
        }, [id_forma_pago, id_tipo_tarjeta, id_tarjeta, id])
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>AGREGAR PAGO</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='m-2'>
            <InputDate label={'FECHA DE PAGO'} nameInput={'fecha_pago'} onChange={onInputChange} value={fecha_pago} required/>
            <InputText label={'n operacion'} nameInput={'n_operacion'} onChange={onInputChange} value={n_operacion} required/>
            <InputText label={'id venta'} nameInput={'id_venta'} onChange={onInputChange} value={id_venta} required/>
            <InputSelect label={'OPERADOR'} nameInput={'id_operador'} onChange={onInputChange} value={id_operador} options={dataOperador} required/>
            <InputSelect label={'PROCEDENCIA'} nameInput={'es_nacional'} onChange={onInputChange} value={es_nacional} options={[{value: 0, label: 'INTERNACIONAL'}, {value: 1, label: 'NACIONAL'}]} required/>
            <InputSelect label={'FORMA DE PAGO'} nameInput={'id_forma_pago'} onChange={onInputChange} value={id_forma_pago} options={dataFormaPago} required/>
            <InputSelect label={'TIPO DE TARJETA'} nameInput={'id_tipo_tarjeta'} onChange={onInputChange} value={id_tipo_tarjeta} options={[{value: 37, label: 'TARJETA DE CREDITO'}, {value: 35, label: 'TARJETA DE DEBITO'}]} required/>
            <InputSelect label={'TARJETA'} nameInput={'id_tarjeta'} onChange={onInputChange} value={id_tarjeta} options={dataTarjetas} required/>
            <InputSelect label={'BANCO'} nameInput={'id_banco'} onChange={onInputChange} value={id_banco} options={dataBancos} required/>
            <InputText label={'N CUOTAS'} nameInput={'n_cuotas'} onChange={onInputChange} value={n_cuotas} required/>
            <InputText label={'MONTO'} nameInput={'parcial_monto'} onChange={onInputChange} value={parcial_monto} required/>
            <InputButton label={'ACTUALIZAR'} onClick={onClickSubmit}/>
            <InputButton label={'CANCELAR'} onClick={cancelSubmit} variant={'_link'}/>
        </div>
      </Modal.Body>
    </Modal>
  )
}
