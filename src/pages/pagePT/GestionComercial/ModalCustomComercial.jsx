import { InputButton, InputDate, InputSelect, InputText } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import React, { useEffect, useMemo } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { useGestionComercialStore } from './useGestionComercialStore'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
// Normaliza el celular: solo dígitos y últimos 9 (ignora +51, espacios, guiones)
const normalizarCelular = (celular)=>String(celular ?? '').replace(/\D/g, '').slice(-9)
const customComercial = {
  nombres: '',
  apellidos: '',
  celular: '',
  ubigeo_distrito_residencia: '',
  id_canal: 0,
  id_medio_comunicacion: 0,
  id_pgm: 0,
  id_estado: 0,
  id_nivel_interes: 0,
  id_empl: 0,
  fecha_ingreso: '',
  comentario_cliente: '',
  observacion: '',
  id_cli: 0
}
// id_cli no esta aqui: "SIN CLIENTE" (0) es una opcion valida para un lead que aun no es cliente
const camposObligatorios = [
  { name: 'fecha_ingreso', label: 'FECHA DE INGRESO' },
  { name: 'celular', label: 'CELULAR' },
  { name: 'nombres', label: 'NOMBRES' },
  { name: 'apellidos', label: 'APELLIDOS' },
  { name: 'id_empl', label: 'ASESOR QUE LA ATENDIO' },
  { name: 'id_canal', label: 'FUENTE' },
  { name: 'id_pgm', label: 'PROGRAMA' },
  { name: 'id_estado', label: 'ESTADO' },
  { name: 'id_nivel_interes', label: 'NIVEL DE INTERES' },
  { name: 'observacion', label: 'OBSERVACION' },
]
export const ModalCustomComercial = ({show, onHide, isCopy, id, lead}) => {
  const isEdit = !!lead && !isCopy
  const initialForm = useMemo(() => {
    // lead nuevo: por defecto la fecha de hoy (hora local)
    if (!lead) return {...customComercial, fecha_ingreso: dayjs().format('YYYY-MM-DD')}
    const form = Object.keys(customComercial).reduce((acc, key) => ({...acc, [key]: lead[key] ?? customComercial[key]}), {})
    // el lead llega con fecha_registro (datetime); el input date necesita YYYY-MM-DD
    // en hora local, igual que la columna FECHA de la tabla
    return {...form, fecha_ingreso: lead.fecha_registro ? dayjs(lead.fecha_registro).format('YYYY-MM-DD') : ''}
  }, [lead])
  const { formState, onInputChange, onResetForm, fecha_ingreso, nombres, apellidos, celular, id_empl, ubigeo_distrito_residencia, id_canal, id_medio_comunicacion, id_pgm, id_estado, id_nivel_interes, observacion, id_cli } = useForm(initialForm)
  const { dataEmpleados, obtenerEmpleadosVendedores, dataCanales, dataMedioComunicacion, obtenerCanales, obtenerMedioComunicacion, obtenerEstadosComerciales, dataEstadoComercial, obtenerNivelesInteres, dataNivelInteres, postGestionComercial, putGestionComercial, obtenerDistritosDeLima, dataDistritos, obtenerClientes, dataClientes } = useGestionComercialStore()
  const {dataView} = useSelector(e=>e.COMERCIAL)
  // Leads ya registrados en la BD con el mismo celular (excluye el lead que se está editando)
  const leadsMismoCelular = useMemo(() => {
    const cel = normalizarCelular(celular)
    if (cel.length < 9) return []
    return (dataView ?? []).filter(e=>normalizarCelular(e.celular)===cel && !(isEdit && e.id===id))
  }, [dataView, celular, isEdit, id])
  useEffect(() => {
    if(show){
      obtenerEmpleadosVendedores()
      obtenerCanales()
      obtenerMedioComunicacion()
      obtenerEstadosComerciales()
      obtenerNivelesInteres()
      obtenerDistritosDeLima()
      obtenerClientes()
    }
  }, [show])
  const onSubmit = async()=>{
    const faltantes = camposObligatorios.filter(({name})=>{
      const valor = formState[name]
      return valor === null || valor === undefined || valor === 0 || String(valor).trim() === ''
    })
    if (faltantes.length) {
      Swal.fire({
        icon: 'warning',
        title: 'COMPLETA LOS CAMPOS OBLIGATORIOS',
        html: faltantes.map(f=>f.label).join('<br/>'),
      })
      return
    }
    // el backend guarda la fecha en fecha_registro; al editar solo se envia si cambio,
    // para no perder la hora original del registro
    const { fecha_ingreso: fecha, ...payload } = formState
    if (!isEdit || fecha !== initialForm.fecha_ingreso) {
      payload.fecha_registro = dayjs(fecha).toISOString()
    }
    if (isEdit) {
      await putGestionComercial(id, payload)
    } else {
      await postGestionComercial(payload)
    }
    onCancel()
  }
  const onCancel = ()=>{
    onHide()
    onResetForm()
  }
  return (
    <Modal show={show} onHide={onHide} size='lg'>
      <Modal.Header>
        <Modal.Title>
          {isEdit ? 'EDITAR' : 'AGREGAR'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <Row>
            <Col lg={12}>
              <div className='m-1'>
                <InputDate label={'FECHA DE INGRESO'} nameInput={'fecha_ingreso'} onChange={onInputChange} value={fecha_ingreso} required/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='m-1'>
                <InputText label={'CELULAR'} nameInput={'celular'} onChange={onInputChange} value={celular} required/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='m-1'>
                <InputText label={'NOMBRES'} nameInput={'nombres'} value={nombres} onChange={onInputChange} required/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='m-1'>
                <InputText label={'APELLIDOS'} nameInput={'apellidos'} value={apellidos} onChange={onInputChange}/>
              </div>
            </Col>
            {
              leadsMismoCelular.length > 0 &&
              <Col lg={12}>
                <div className='alert alert-warning m-1 py-2'>
                  <i className='mdi mdi-alert'></i> <strong>CELULAR YA REGISTRADO</strong> en {leadsMismoCelular.length} {leadsMismoCelular.length===1 ? 'lead' : 'leads'}:
                  <ul className='mb-0'>
                    {leadsMismoCelular.map(e=>(
                      <li key={e.id}>
                        {e.nombres} {e.apellidos} — {e.empleado?.nombres_apellidos_empl ?? 'SIN ASESOR'}
                        {e.fecha_registro && ` (${dayjs(e.fecha_registro).format('DD/MM/YYYY')})`}
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            }
            <Col lg={12}>
              <div className='m-1'>
                <InputSelect label={'SOCIO'} placeholder={'BUSCAR POR DNI O NOMBRE'} options={dataClientes} nameInput={'id_cli'} onChange={onInputChange} value={id_cli}/>
              </div>
            </Col>
            <Col lg={6}>
              <div className='m-1'>
                <InputSelect label={'ASESOR QUE LA ATENDIO'} options={dataEmpleados} nameInput={'id_empl'} onChange={onInputChange} value={id_empl} required/>
              </div>
            </Col>
            <Col lg={6}>
              <div className='m-1'>
                <InputSelect label={'FUENTE'} options={dataCanales} nameInput={'id_canal'} onChange={onInputChange} value={id_canal} required/>
              </div>
            </Col>
            {/* <Col lg={6}>
              <div className='m-1'>
                <InputSelect label={'MEDIO DE COMUNICACION'} options={dataMedioComunicacion} nameInput={'id_medio_comunicacion'} onChange={onInputChange} value={id_medio_comunicacion} required/>
              </div>
            </Col> */}
            {/*
            <Col lg={6}>
              <div className='m-1'>
                <InputSelect label={'UBIGEO'} options={dataDistritos} nameInput={'ubigeo_distrito_residencia'} onChange={onInputChange} value={ubigeo_distrito_residencia} required/>
              </div>
            </Col>
            */}
            <Col lg={6}>
              <div className='m-1'>
                <InputSelect label={'PROGRAMA'} options={[{label: 'CHANGE 45', value: 2}, {label: 'FS 45', value: 3}, {label: 'FISIO MUSCLE', value: 4}]} nameInput={'id_pgm'} onChange={onInputChange} value={id_pgm} required/>
              </div>
            </Col>
            <Col lg={6}>
              <div className='m-1'>
                <InputSelect label={'ESTADO'} options={dataEstadoComercial} nameInput={'id_estado'} onChange={onInputChange} value={id_estado} required/>
              </div>
            </Col>
            <Col lg={6}>
              <div className='m-1'>
                <InputSelect label={'NIVEL DE INTERES'} options={dataNivelInteres} nameInput={'id_nivel_interes'} onChange={onInputChange} value={id_nivel_interes} required/>
              </div>
            </Col>
            <Col lg={12}>
              <div className='m-1'>
                <label className="form-label text-change" htmlFor="observacion">OBSERVACION <span className='text-danger'>*</span></label>
                <textarea className="form-control" id="observacion" name="observacion" rows={3} maxLength={500} value={observacion} onChange={onInputChange} required/>
              </div>
            </Col>
            <Col lg={12}>
              <div className='m-1'>
                <InputButton label={isEdit ? 'GUARDAR' : 'AGREGAR'} onClick={onSubmit}/>
                <InputButton label={'CANCELAR'} variant={'_link'} onClick={onCancel}/>
              </div>
            </Col>
          </Row>
        </form>
      </Modal.Body>
    </Modal>
  )
}
