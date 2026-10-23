import { useForm } from '@/hooks/useForm'
import React, { useEffect } from 'react'
import { useContratoColaboradorStore } from './useContratoColaboradorStore'
import { Col, Modal, Row } from 'react-bootstrap'
import { InputButton, InputDate, InputSelect, InputText } from '@/components/InputText'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import CalendariosContrato from './CalendariosContrato'
import { TabPanel, TabView } from 'primereact/tabview'
import Swal from 'sweetalert2'
const customContrato = {
  fecha_inicio: null,
  fecha_fin: null,
  sueldo: 0.00,
  tipo_pago: '',
  tipo_jornada: '',
  fecha_pago: null,
  observacion: ''
}
const optionsTipoPago = [
  {value: 'MENSUAL', label: 'MENSUAL'},
  {value: 'QUINCENAL', label: 'QUINCENAL'},
  {value: 'SEMANAL', label: 'SEMANAL'},
  {value: 'DIARIO', label: 'POR DIA'},
]
const optionsTipoJornada = [
  {value: 'COMPLETA', label: 'COMPLETA'},
  {value: 'PART-TIME', label: 'PART-TIME'},
]
export const ModalCustomContrato = ({show, onHide, id_empleado}) => {
  const { formState, fecha_inicio, fecha_fin, sueldo, tipo_pago, tipo_jornada, fecha_pago, observacion, onInputChange, onResetForm } = useForm(customContrato)
  const { postContratoColaborador } = useContratoColaboradorStore()
  // useEffect(() => {
  //   obtenerNombreDias('dia', 'nombre')
  //   obtenerEstabilidadxDia('estabilidad-dia', 'empleado')
  //   obtenerConceptosJornada('concepto', 'jornada')
  // }, [show])
  
  const onCancelCustomContrato = ()=>{
    onHide()
    onResetForm()
  }
  const onClickCustomContrato = ()=>{
    if (!fecha_inicio || !(Number(sueldo) > 0) || !tipo_pago || !tipo_jornada || !fecha_pago) {
      Swal.fire({icon: 'warning', title: 'Completa los campos obligatorios'})
      return
    }
    postContratoColaborador(formState, id_empleado)
    onCancelCustomContrato()
  }
  return (
    <Modal show={show} onHide={onCancelCustomContrato} size='lg'>
      <Modal.Header>
        <Modal.Title>
          AGREGAR CONTRATO
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
            <div>
              <h4 className='underline'>Dato laboral</h4>
            </div>
            <div className='m-2'>
                <InputDate label={'FECHA DESDE'} nameInput={'fecha_inicio'} onChange={onInputChange} value={fecha_inicio} required/>
            </div>
            <div className='m-2'>
                <InputDate label={'FECHA FIN'} nameInput={'fecha_fin'} onChange={onInputChange} value={fecha_fin}/>
            </div>
            <div className='m-2'>
                <InputText label={'SUELDO'} nameInput={'sueldo'} onChange={onInputChange} value={sueldo} type='number' min='0' step='0.01' required/>
            </div>
            <div className='m-2'>
                <InputSelect label={'TIPO DE PAGO'} nameInput={'tipo_pago'} onChange={onInputChange} value={tipo_pago} options={optionsTipoPago} required/>
            </div>
            <div className='m-2'>
                <InputSelect label={'TIPO DE JORNADA'} nameInput={'tipo_jornada'} onChange={onInputChange} value={tipo_jornada} options={optionsTipoJornada} required/>
            </div>
            <div className='m-2'>
                <InputDate label={'FECHA DEL ULTIMO PAGO O PRIMER PAGO'} nameInput={'fecha_pago'} onChange={onInputChange} value={fecha_pago} required/>
            </div>
            <div>
              <InputButton label={'GUARDAR'} onClick={(e)=>onClickCustomContrato()}/>
            </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}




  // const estabilidades = [
  //   {id: 1, label: '2 dias si y un dia no', si: 2, no: 1},
  //   {id: 2, label: 'Fijo toda las veces', si: 0, no: 0},
  // ]
  // const dataJornadaPorSemana = [
  //   {dia: 'LUNES', id_estabilidad: 2, hora_inicio: '07:00:00', hora_fin: '18:00:00'},
  //   {dia: 'MARTES', id_estabilidad: 2, hora_inicio: '07:00:00', hora_fin: '18:00:00'},
  //   {dia: 'MIERCOLES', id_estabilidad: 2, hora_inicio: '07:00:00', hora_fin: '18:00:00'},
  //   {dia: 'JUEVES', id_estabilidad: 2, hora_inicio: '07:00:00', hora_fin: '18:00:00'},
  //   {dia: 'VIERNES', id_estabilidad: 2, hora_inicio: '07:00:00', hora_fin: '18:00:00'},
  //   {dia: 'SABADO', id_estabilidad: 1, hora_inicio: '07:00:00', hora_fin: '13:00:00'},
  // ]