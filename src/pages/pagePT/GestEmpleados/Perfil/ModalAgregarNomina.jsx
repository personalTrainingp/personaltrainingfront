import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useForm } from '@/hooks/useForm';
import { usePlanillaStore } from './usePlanillaStore';
import { InputSelect } from '@/components/InputText';
dayjs.extend(utc);
const registrarNomina = {
  fecha_desde: '',
  sueldo: '',
  tipo_pago: '',
  tipo_jornada: '',
  fecha_pago: '',
  observacion: '',
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
// id = 0 -> AGREGAR, id != 0 -> EDITAR
export const ModalAgregarNomina = ({show, onHide, uid_empl, id = 0, onSaved}) => {
    const { fecha_desde, sueldo, tipo_pago, tipo_jornada, fecha_pago, observacion, formState, onInputChange, onInputChangeFields, onResetForm } = useForm(registrarNomina)
    const { postPlanillaxEMPL, actualizarPlanillaxID, obtenerPlanillaxID, dataPlanilla } = usePlanillaStore()
    const [msgError, setmsgError] = useState('')
    const [isSaving, setisSaving] = useState(false)

    useEffect(() => {
      if(show && id!==0){
        obtenerPlanillaxID(id)
      }
    }, [show, id])
    useEffect(() => {
      // CARGAR LA PLANILLA EN EL FORMULARIO CUANDO SE EDITA
      if(show && id!==0 && dataPlanilla?.id===id){
        onInputChangeFields({
          fecha_desde: dataPlanilla.fecha_desde?dayjs.utc(dataPlanilla.fecha_desde).format('YYYY-MM-DD'):'',
          sueldo: dataPlanilla.sueldo ?? '',
          tipo_pago: dataPlanilla.tipo_pago || '',
          tipo_jornada: dataPlanilla.tipo_jornada || '',
          fecha_pago: dataPlanilla.fecha_pago?dayjs.utc(dataPlanilla.fecha_pago).format('YYYY-MM-DD'):'',
          observacion: dataPlanilla.observacion || '',
        })
      }
    }, [dataPlanilla, show, id])

    const onClickModalClose = ()=>{
      onHide()
      onResetForm()
      setmsgError('')
    }
    const onClickSubmitPlanilla = async()=>{
      if(!fecha_desde){
        return setmsgError('Ingresa la fecha desde')
      }
      if(!(Number(sueldo) > 0)){
        return setmsgError('Ingresa un sueldo valido')
      }
      if(!tipo_pago || !tipo_jornada){
        return setmsgError('Selecciona el tipo de pago y el tipo de jornada')
      }
      if(!fecha_pago){
        return setmsgError('Ingresa la fecha del ultimo pago o del primer pago')
      }
      setisSaving(true)
      const ok = id===0
        ? await postPlanillaxEMPL(formState, uid_empl)
        : await actualizarPlanillaxID(id, formState)
      setisSaving(false)
      if(ok){
        onSaved && onSaved()
        onClickModalClose()
      }
    }

    return (
      <Dialog
          visible={show}
          onHide={onClickModalClose}
          position='top'
          style={{width: '40rem'}}
          header={id===0?'AGREGAR PLANILLA':`EDITAR PLANILLA ${id}`}
          >
            <form>
              <Row>
                <Col xxl={6}>
                  <div className="mb-4">
                      <label htmlFor="fecha_desde" className="form-label">FECHA DESDE</label>
                      <input
                        type='date'
                        className='form-control'
                        id="fecha_desde"
                        name="fecha_desde"
                        value={fecha_desde}
                        onChange={onInputChange}
                      />
                  </div>
                </Col>
                <Col xxl={6}>
                  <div className="mb-4">
                      <label htmlFor="sueldo" className="form-label">SUELDO</label>
                      <input
                        type='number'
                        min='0'
                        step='0.01'
                        className='form-control'
                        id="sueldo"
                        name="sueldo"
                        value={sueldo}
                        onChange={onInputChange}
                      />
                  </div>
                </Col>
                <Col xxl={6}>
                  <div className="mb-4">
                      <label htmlFor="fecha_pago" className="form-label">FECHA DEL ULTIMO PAGO O PRIMER PAGO</label>
                      <input
                        type='date'
                        className='form-control'
                        id="fecha_pago"
                        name="fecha_pago"
                        value={fecha_pago}
                        onChange={onInputChange}
                      />
                  </div>
                </Col>
                <Col xxl={6}>
                  <div className="mb-4">
                    <InputSelect label={'TIPO DE PAGO'} nameInput={'tipo_pago'} onChange={onInputChange} value={tipo_pago} options={optionsTipoPago}/>
                  </div>
                </Col>
                <Col xxl={6}>
                  <div className="mb-4">
                    <InputSelect label={'TIPO DE JORNADA'} nameInput={'tipo_jornada'} onChange={onInputChange} value={tipo_jornada} options={optionsTipoJornada}/>
                  </div>
                </Col>
                <Col lg={12}>
                  <div className="mb-4">
                    <label htmlFor="observacion" className="form-label">OBSERVACION</label>
                    <textarea
                        className='form-control'
                        id="observacion"
                        name="observacion"
                        maxLength={280}
                        value={observacion}
                        onChange={onInputChange}
                      />
                  </div>
                </Col>
              </Row>
              {msgError && <p className='text-danger fw-bold'>{msgError}</p>}
              <Button type='button' label={id===0?'Agregar':'Guardar cambios'} className='p-button-primary' loading={isSaving} onClick={onClickSubmitPlanilla} />
              <Button type='button' label='Cancelar' className='p-button-text' onClick={onClickModalClose} />
            </form>
      </Dialog>
    )
}
