import { InputButton, InputSelect, InputSwitch, InputText } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useTardanzasStore } from './useTardanzasStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
const customFeriados = {
  id_colaborador: 0,
  observacion: '',
  fechaDesde: '',
  minutos: 0,
  id_tipo: 0,
  conGoceSueldo: true
}
export const ModalCustomTardanzas = ({show, onHide, id, id_empresa}) => {
    const {postTardanzas, obtenerEmpleadosActivos, dataEmpleados } = useTardanzasStore()
    const { DataGeneral:dataTipoTardanzas, obtenerParametroPorEntidadyGrupo:obtenerTipoTardanzas } = useTerminoStore()
  const { formState, onInputChange, id_colaborador, observacion, minutos, conGoceSueldo, fechaDesde, id_tipo, onResetForm } = useForm(customFeriados)
  useEffect(() => {
    if(show){
        obtenerTipoTardanzas('rr.hh.', 'tipo-tardanza')
        obtenerEmpleadosActivos(id_empresa)
    }
  }, [show])
  
  const onClickCustomFeriados = ()=>{
    postTardanzas({...formState, fechaHasta: fechaDesde})
    onCancelCustomTardanzas()
  }
  const onCancelCustomTardanzas = ()=>{
    onResetForm()
    onHide()
  }
  return (
    <Dialog visible={show} onHide={onHide} header={`AGREGAR TARDANZAS`} style={{width: '40rem'}}>
      <form>
                <Row>
                    <Col lg={12}>
                        <div className='mb-3'>
                            <InputSelect label={'Seleccionar el colaborador'} options={dataEmpleados} nameInput={'id_colaborador'} onChange={onInputChange} value={id_colaborador} required />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className='mb-3'>
                            <InputSelect label={'Tipo'} nameInput={'id_tipo'} options={dataTipoTardanzas} onChange={onInputChange} value={id_tipo} required />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className='mb-3'>
                            <InputText label={'fecha'} nameInput={'fechaDesde'} onChange={onInputChange} value={fechaDesde} type={'date'} required />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className='mb-3'>
                            <InputText label={'minutos'} nameInput={'minutos'} onChange={onInputChange} value={minutos} required />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className='mb-3'>
                            <InputText label={'Observacion'} nameInput={'observacion'} onChange={onInputChange} value={observacion} required />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className='mb-3'>
                            <InputSwitch label={'Es con goce de sueldo'} nameInput={'conGoceSueldo'} onChange={onInputChange} value={conGoceSueldo} required />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <InputButton onClick={onClickCustomFeriados} label={id==0?'Guardar':'Actualizar'}/>
                        <InputButton onClick={onCancelCustomTardanzas} variant='link' label={'Cancelar'}/>
                    </Col>
                </Row>
            </form>
    </Dialog>
  )
}
