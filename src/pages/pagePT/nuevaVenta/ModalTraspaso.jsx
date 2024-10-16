import { helperFunctions } from '@/common/helpers/helperFunctions'
import { useForm } from '@/hooks/useForm'
import { useEffect, useRef, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import 'flatpickr/dist/themes/light.css'; // Elige el tema de Flatpickr que desees
import Select from 'react-select';
import 'dayjs/locale/es'; // Importa el idioma español si no lo has hecho ya
import config from '@/config';
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { DateMask, DateMaskString, FormatoDateMask, FormatoTimeMask } from '@/components/CurrencyMask';
import { onSetDetallePrograma, onSetDetalleTraspaso } from '@/store/uiNuevaVenta/uiNuevaVenta';
import { useDispatch } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import dayjs from 'dayjs';
// Establecer el idioma local globalmente

function ordenarPorIdPgm(data) {
  const orden = [2, 4, 3];

  return data.sort((a, b) => {
    return orden.indexOf(a.id_pgm) - orden.indexOf(b.id_pgm);
  });
}
const registroVentaPgm = {
  id: 0,
  id_pgm: 0,
  sesiones: 0,
  id_st: 0,
  id_horarioPgm: 0,
  id_tt: 0,
  fechaInicio_programa: '',
}
export const ModalTraspaso = ({show, onHide}) => {
    const dispatch = useDispatch()
    const { obtenerParametrosLogosProgramas, obtenerSemanasPorPrograma, obtenerTarifasPorSemanas, obtenerHorariosPorPrograma, DataHorarioPGM, DataSemanaPGM, DataTarifaSM } = useTerminoStore()
    const { datapgmPT } = useSelector(e=>e.programaPT)
    const [dataSemana, setdataSemana] = useState(null)
    const [dataTarifa, setdataTarifa] = useState(null)
    const [dataHorario, setdataHorario] = useState(null)
    const [dataPrograma, setDataPrograma] = useState(null)
    const [ordenLogos, setordenLogos] = useState([])
    const { sumarSemanas, sumarDiasHabiles } = helperFunctions()
    const { formState: formStateVentaPrograma, 
            id,
            id_pgm, 
            sesiones,
            id_st, 
            id_horarioPgm, 
            id_tt,
            fechaInicio_programa, 
            onInputChangeReact, 
            onInputChange, 
            onInputChangeFlaticon, 
            onInputChangeFunction, 
            onResetForm } = useForm(registroVentaPgm)
      useEffect(() => {
        obtenerParametrosLogosProgramas()
        // setordenLogos(ordenarPorIdPgm(datapgmPT))
      }, [])
      
      useEffect(() => {
        onInputChangeFunction("id_pgm", 0)
        obtenerSemanasPorPrograma(id_pgm)
      }, [id_pgm])
      useEffect(() => {
        onInputChangeFunction("id_horarioPgm", 0)
        obtenerHorariosPorPrograma(id_pgm)
      }, [id_pgm])
      useEffect(() => {
        onInputChangeFunction("id_tt", 0)
        obtenerTarifasPorSemanas(id_st)
      }, [id_st])
  
      useEffect(() => {
        const semanaInfo = DataSemanaPGM.find(e=>e.value===id_st) || null
        setdataSemana(semanaInfo)
      }, [id_st, id_pgm])
      useEffect(() => {
        const tarifaInfo = DataTarifaSM.find(e=>e.value===id_tt) || null
        setdataTarifa(tarifaInfo)
      }, [id_tt, id_st])
      useEffect(() => {
        const horarioInfo = DataHorarioPGM.find(o => o.value === id_horarioPgm) || null
        setdataHorario(horarioInfo)
      }, [id_horarioPgm, id_pgm])
      useEffect(() => {
        const programa = datapgmPT.find(e=>e.id_pgm===id_pgm) || null
        setDataPrograma(programa)
      }, [id_pgm])
      
      
    const onSubmitRegisterPrograma = (e)=>{
      e.preventDefault()
      const fechaFinal = sumarDiasHabiles(fechaInicio_programa, sesiones)
      const { value: id_horarioPgm, label:label_dataHorario, aforo: aforo_h, horario: time_h } = dataHorario;
      const { id_pgm, name_pgm, tb_image } = dataPrograma;
      
      // const { } = dataHorario;
      dispatch(onSetDetalleTraspaso({
        tarifa: 0.00,
        sesiones: sesiones,
        id_horarioPgm, label_dataHorario, time_h,
        id_pgm, name_pgm,
        url_image: tb_image.name_image,
        fechaInicio_programa, 
        fechaFinal
      }))
      onModalClose()
    }
    
    const onModalClose=()=>{
      onResetForm()
      onHide()
    }
    const onChangeFunction = (o, e)=>{
      onInputChangeFunction("id_st", 0)
      onInputChangeFunction(o.target.name, e.id_pgm)
    }
  return (
    <Dialog position='top' style={{width: '80rem'}} header={'TRASPASO'} visible={show} onHide={onModalClose}>
        
        <Row>
            <Col xxl={7}>
              <div>
                <Row className='container-imgs d-flex justify-content-center'>
                  {
                    datapgmPT.map(e=>{
                      if(!e.estado_pgm){
                        return;
                      }
                      
                      return(
                      <Col className={`content-img`} style={{cursor: 'pointer'}} key={e.id_pgm}>
                        <label>
                        <img className={`hover-card-border ${id_pgm==e.id_pgm?'card-border':''}`} height={`${e.tb_image?.height-80}`} src={`${config.API_IMG.LOGO}${e.tb_image?.name_image}`}/>
                          <input
                            value={id_pgm}
                            type="radio"
                            hidden={true}
                            name="id_pgm"
                            onChange={(o)=>onChangeFunction(o, e)}
                          />
                        </label>
                      </Col>
                      )
                    })
                  }
                </Row>
              <form onSubmit={onSubmitRegisterPrograma} className='mt-3'>
                          <input 
                            type='text' 
                            className='form-control'
                            id='id'
                            name='id'
                            placeholder='id'
                            value={id}
                            hidden={true}
                            onChange={onInputChange}
                            disabled
                            required
                          />
                    <Row>
                    <Col xl={12}>
                    <div className="mb-3">
                    <label htmlFor="sesiones" className="form-label">
                        Sesiones*
                    </label>
                    <input
                        className="form-control"
                        placeholder="sesiones"
                        value={sesiones}
                        name="sesiones"
                        id="sesiones"
                        min={1}
                        type='number'
                        onChange={onInputChange}
                        required
                    />
                </div>
                    </Col>
                    <Col xl={12}>
                      <div className='mb-2'>
                        <label>Horario:</label>
                        <Select
                          onChange={(e) => onInputChangeReact(e, 'id_horarioPgm')}
                          name={'id_horarioPgm'}
                          placeholder={'Seleccionar el horario de entrenamiento'}
                          className="react-select"
                          classNamePrefix="react-select"
                          options={DataHorarioPGM}
                          value={DataHorarioPGM.find(o => o.value === id_horarioPgm)|| 0}
                          required
                        ></Select>
                      </div>
                    </Col>
                    <Col xl={12}>
                      <div className='mb-2'>
                        <label>Fecha inicio:</label>
                        <input 
                          type='date' 
                          className='form-control'
                          id='fechaInicio_programa'
                          name='fechaInicio_programa'
                          placeholder='Fecha de inicio de entrenamiento'
                          value={fechaInicio_programa}
                          onChange={onInputChange}
                          required
                          />
                      </div>
                    </Col>
                    <Col xl={12}>
                      <div className='mb-2'>
                        <label>Tarifa:</label>
                        S/.0.00
                      </div>
                    </Col>
                      <Button type='submit'>Registrar compra</Button>
                    </Row>
                  </form>
              </div>
            </Col>
            <Col lg={5}>
                {dataPrograma && (
                  <Row>
                    <Col>
                    <span>Programa: </span>
                    {dataPrograma.name_pgm}
                    </Col>
                  </Row>
                )
                }
                {dataHorario && (
                  <Row>
                    <Col lg={4}>
                      <span>Horario:</span>
                      {dataHorario.horario}
                    </Col>
                    <Col lg={4}>
                      <span>Aforo:</span>
                      {dataHorario.aforo}
                    </Col>
                    <Col lg={6}>
                      <span>Entrenador:</span>
                      {dataHorario.tb_empleado?.empl_trainer}
                    </Col>
                  </Row>
                )
                }
                {/* {dataSemana && (
                  <Row>
                    <Col lg={4}>
                      <span>Semanas: </span>
                      {dataSemana.semanas}
                    </Col>
                    <Col lg={4}>
                      <span>Congelamiento: </span>
                      {dataSemana.cong}
                    </Col>
                    <Col lg={4}>
                      <span>Nutricion: </span>
                      {dataSemana.nutric}
                    </Col>
                  </Row>
                )
                } */}
                {
                  dataTarifa && (
                    <Row>
                    <Col lg={6}>
                      <span>Nombre de la tarifa: </span>
                      {dataTarifa.nombre_tarifa}
                    </Col>
                    <Col lg={6}>
                      <span>tarifa: </span>
                      {dataTarifa.tarifa.toFixed(2)}
                    </Col>
                    </Row>
                  )
                }
                {fechaInicio_programa && (
                  <Row>
                    <Col lg={12}>
                      <span>Inicia: {FormatoDateMask(fechaInicio_programa, 'dddd D [de] MMMM [del] YYYY')}</span>
                    </Col>
                    <Col lg={12}>
                      <span>Finaliza: {FormatoDateMask(sumarDiasHabiles(fechaInicio_programa, sesiones), 'dddd D [de] MMMM [del] YYYY')}</span>
                    </Col>
                  </Row>
                )
                }
            </Col>
          </Row>
    </Dialog>
  )
}


/**
 * 
 * 
                <div className="mb-3">
                    <label htmlFor="sesiones" className="form-label">
                        Sesiones*
                    </label>
                    <input
                        className="form-control"
                        placeholder="sesiones"
                        value={sesiones}
                        name="sesiones"
                        id="sesiones"
                        min={1}
                        type='number'
                        onChange={onInputChange}
                        required
                    />
                </div>
 */