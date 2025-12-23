import { InputButton, InputDate, InputSelect, InputText, InputTextArea } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useGestionAportes } from './hook/useGestionAportes'
import { TerminosOnShow } from '@/hooks/usePropiedadesStore'
import { useSelector } from 'react-redux'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore'
import { arrayEmpresaFinan, arrayFinanzas, arrayMonedas } from '@/types/type'

const customAporte = {
  id_gasto: 0,
  n_comprabante: '',
  n_operacion: '',
  id_prov: 0,
  id_estado: 0,
  descripcion: '',
  monto: 0.00,
  id_tipo_comprobante: 0,
  fec_comprobante: '',
  fec_pago: '',
  id_forma_pago: 0,
  id_tipo_moneda: 0,
  id_banco: 0,
  id_tarjeta: 0
}
export const ModalCustomAporte = ({id, onHide, show, idEmpresa}) => {
  const { onPostGestionAporte, obtenerParametrosGastosFinanzas } = useGestionAportes()
  const { obtenerIngresoxID, dataIngreso, dataProveedores, obtenerParametrosProveedor } = useGestionAportes()
        const { dataProvCOMBO } = useSelector(e=>e.prov)
    const {dataParametrosGastos} = useSelector(e=>e.finanzas)
  const { dataBancos, dataFormaPago, dataTarjetas, dataConceptosAportes, dataTipoMoneda, dataComprobantesGastos, dataEmpresas } = TerminosOnShow(show)
  const { formState, onInputChange, onResetForm, onInputChangeFunction, id_tipoIngreso, id_empresa, grupo, id_gasto, n_comprabante, n_operacion, id_prov, id_estado, descripcion, id_tipo_moneda, monto, id_tipo_comprobante, fec_comprobante, fec_pago, id_forma_pago, id_banco, id_tarjeta } = useForm(id==0?customAporte:dataIngreso)
  const [grupoGasto, setgrupoGasto] = useState([])
  const [tipoIngreso, settipoIngreso] = useState([])
      // const [id_empresa, setid_empresa] = useState(0)
      const [gastoxGrupo, setgastoxGrupo] = useState([])
  const onSubmit = ()=>{
    if(id===0){
      onPostGestionAporte(formState, idEmpresa)
    }else{

    }
  }
  const onCancelCustomAporte = ()=>{
    onHide()
    onResetForm()
  }
  console.log({dataIngreso});
  
  useEffect(() => {
      if(show){
          obtenerParametrosGastosFinanzas()
                obtenerIngresoxID(id)
      }
  }, [show])
  useEffect(() => {
      onInputChangeFunction('id_empresa', idEmpresa)
  }, [idEmpresa])
  useEffect(() => {
    onInputChangeFunction("grupo", 0)
      obtenerParametrosProveedor(id_empresa)
  }, [id_empresa])
  useEffect(() => {
    if(!id){
        onInputChangeFunction("id_gasto", 0)
    }
  }, [grupo, id_empresa])
  console.log({dataProveedores});
  
          useEffect(() => {
              const grupos = dataParametrosGastos.find(e=>e.id_empresa==id_empresa)?.tipo_gasto.find(e=>e.id_tipoGasto===id_tipoIngreso)?.grupos||[]
              setgrupoGasto(grupos)
          }, [id_empresa, id_tipoIngreso])
          useEffect(() => {
              const conceptos = dataParametrosGastos.find(e=>e.id_empresa==id_empresa)?.tipo_gasto.find(e=>e.id_tipoGasto===id_tipoIngreso).grupos.find(g=>g.value==grupo)?.conceptos||[]
              setgastoxGrupo(conceptos)
          }, [grupo, idEmpresa])
  console.log({grupoGasto, dataParametrosGastos, grupo, gastoxGrupo, id_empresa});
  
  return (  
    <Dialog onHide={onCancelCustomAporte} visible={show} header={`${id===0?'AGREGAR INGRESOS':'ACTUALIZAR INGRESOS'}`} style={{width: '70rem'}} position='top'>
        <form>
          <Row>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Empresa'} value={id_empresa} nameInput={'id_empresa'} onChange={onInputChange} options={arrayEmpresaFinan}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Tipo de ingreso'} value={id_tipoIngreso} nameInput={'id_tipoIngreso'} onChange={onInputChange} options={arrayFinanzas}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Rubro'} value={grupo} nameInput={'grupo'} onChange={onInputChange} options={grupoGasto}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Concepto'} value={id_gasto} nameInput={'id_gasto'} onChange={onInputChange} options={gastoxGrupo}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Tipo de moneda'} value={id_tipo_moneda} nameInput={'id_tipo_moneda'} onChange={onInputChange} options={arrayMonedas}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputText label={'Monto'} nameInput={'monto'} onChange={onInputChange} value={monto}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Tipo de comprobante'} value={id_tipo_comprobante} nameInput={'id_tipo_comprobante'} onChange={onInputChange} options={dataComprobantesGastos}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputText label={'N° de comprobante'} nameInput={'n_comprabante'} onChange={onInputChange} value={n_comprabante}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputDate label={'Fecha comprobante'} nameInput={'fec_comprobante'} onChange={onInputChange} value={fec_comprobante}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputText label={'N° de operacion'} nameInput={'n_operacion'} onChange={onInputChange} value={n_operacion}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputDate label={'Fecha Pago'} nameInput={'fec_pago'} onChange={onInputChange} value={fec_pago}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Forma pago'} value={id_forma_pago} nameInput={'id_forma_pago'} onChange={onInputChange} options={dataFormaPago}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Banco'} value={id_banco} nameInput={'id_banco'} onChange={onInputChange} options={dataBancos}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Tarjeta'} value={id_tarjeta} nameInput={'id_tarjeta'} onChange={onInputChange} options={dataTarjetas}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Empresa/Persona'} value={id_prov} nameInput={'id_prov'} onChange={onInputChange} options={dataProveedores}/>
              </div>
            </Col>
            <Col lg={12}>
              <div className='mb-2'>
                <InputTextArea label={'descripcion'} nameInput={'descripcion'} onChange={onInputChange} value={descripcion}/>
              </div>
            </Col>
            <Col lg={12}>
              <div className='mb-2'>
                <InputButton label={'Agregar'} onClick={onSubmit}/>
                <InputButton label={'Cancelar'} variant={'link'} onClick={onCancelCustomAporte}/>
              </div>
            </Col>
          </Row>
        </form>
    </Dialog>
  )
}
