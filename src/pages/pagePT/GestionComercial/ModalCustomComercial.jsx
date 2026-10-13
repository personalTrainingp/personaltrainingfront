import { InputButton, InputDate, InputSelect, InputText } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import React, { useEffect, useMemo } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { useGestionComercialStore } from './useGestionComercialStore'
import Swal from 'sweetalert2'
const customComercial = {
  nombres: '',
  apellidos: '',
  celular: '',
  ubigeo_distrito_residencia: '',
  id_canal: 0,
  id_medio_comunicacion: 0,
  id_pgm: 0,
  id_estado: 0,
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
  { name: 'comentario_cliente', label: 'COMENTARIO DEL CLIENTE' },
  { name: 'nombres', label: 'NOMBRES' },
  { name: 'apellidos', label: 'APELLIDOS' },
  { name: 'id_empl', label: 'ASESOR QUE LA ATENDIO' },
  { name: 'id_canal', label: 'FUENTE' },
  { name: 'id_medio_comunicacion', label: 'MEDIO DE COMUNICACION' },
  { name: 'id_pgm', label: 'PROGRAMA' },
  { name: 'id_estado', label: 'ESTADO' },
  { name: 'observacion', label: 'OBSERVACION' },
]
export const ModalCustomComercial = ({show, onHide, isCopy, id, lead}) => {
  const isEdit = !!lead && !isCopy
  const initialForm = useMemo(() => {
    if (!lead) return customComercial
    return Object.keys(customComercial).reduce((acc, key) => ({...acc, [key]: lead[key] ?? customComercial[key]}), {})
  }, [lead])
  const { formState, onInputChange, onResetForm, fecha_ingreso, nombres, apellidos, celular, id_empl, ubigeo_distrito_residencia, id_canal, id_medio_comunicacion, id_pgm, id_estado, comentario_cliente, observacion, id_cli } = useForm(initialForm)
  const { dataEmpleados, obtenerEmpleadosVendedores, dataCanales, dataMedioComunicacion, obtenerCanales, obtenerMedioComunicacion, obtenerEstadosComerciales, dataEstadoComercial,postGestionComercial, putGestionComercial, obtenerDistritosDeLima, dataDistritos, obtenerClientes, dataClientes } = useGestionComercialStore()
  useEffect(() => {
    if(show){
      obtenerEmpleadosVendedores()
      obtenerCanales()
      obtenerMedioComunicacion()
      obtenerEstadosComerciales()
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
    if (isEdit) {
      await putGestionComercial(id, formState)
    } else {
      await postGestionComercial(formState)
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
                <InputText label={'COMENTARIO DEL CLIENTE'} nameInput={'comentario_cliente'} onChange={onInputChange} value={comentario_cliente} required/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='m-1'>
                <InputText label={'NOMBRES'} nameInput={'nombres'} value={nombres} onChange={onInputChange} required/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='m-1'>
                <InputText label={'APELLIDOS'} nameInput={'apellidos'} value={apellidos} onChange={onInputChange} required/>
              </div>
            </Col>
            <Col lg={12}>
              <div className='m-1'>
                <InputSelect label={'CLIENTE'} placeholder={'BUSCAR POR DNI O NOMBRE'} options={dataClientes} nameInput={'id_cli'} onChange={onInputChange} value={id_cli}/>
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
            <Col lg={6}>
              <div className='m-1'>
                <InputSelect label={'MEDIO DE COMUNICACION'} options={dataMedioComunicacion} nameInput={'id_medio_comunicacion'} onChange={onInputChange} value={id_medio_comunicacion} required/>
              </div>
            </Col>
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
