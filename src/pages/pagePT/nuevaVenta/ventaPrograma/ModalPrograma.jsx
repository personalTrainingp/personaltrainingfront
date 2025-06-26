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
import { onSetDetallePrograma } from '@/store/uiNuevaVenta/uiNuevaVenta';
import { useDispatch } from 'react-redux';
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
  id_st: 0,
  id_horarioPgm: 0,
  id_tt: 0,
  fechaInicio_programa: '',
}
export const ModalPrograma = ({show, hide}) => {
  const dispatch = useDispatch()
  const { obtenerParametrosLogosProgramas, obtenerSemanasPorPrograma, obtenerTarifasPorSemanas, obtenerHorariosPorPrograma, DataHorarioPGM, DataSemanaPGM, DataTarifaSM } = useTerminoStore()
  const { datapgmPT } = useSelector(e=>e.programaPT)
  const [dataSemana, setdataSemana] = useState(null)
  const [dataTarifa, setdataTarifa] = useState(null)
  const [dataHorario, setdataHorario] = useState(null)
  const [dataPrograma, setDataPrograma] = useState(null)
  const [ordenLogos, setordenLogos] = useState([])
  const { sumarSemanas } = helperFunctions()
  const { formState: formStateVentaPrograma, 
          id,
          id_pgm, 
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
    const fechaFinal = sumarSemanas(fechaInicio_programa, dataSemana?.semanas)
    const { value: id_st, semanas, nutric, cong, label:label_dataSemana } = dataSemana;
    const { value: id_tt, label:label_tarifa, tarifa } = dataTarifa;
    const { value: id_horarioPgm, label:label_dataHorario, aforo: aforo_h, horario: time_h } = dataHorario;
    const { id_pgm, name_pgm, tb_image } = dataPrograma;
    
    // const { } = dataHorario;
    dispatch(onSetDetallePrograma({
      id_st, semanas, nutric, cong, label_dataSemana,
      id_tt, tarifa, label_tarifa,
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
    hide()
  }
  const onChangeFunction = (o, e)=>{
    onInputChangeFunction("id_st", 0)
    onInputChangeFunction(o.target.name, e.id_pgm)
  }

  
  // console.log(fechaInicio_programa);
  return (
    <>
    <Modal size='xl' show={show} onHide={onModalClose} backdrop={'static'}>
        <Modal.Header closeButton>
            <Modal.Title>Agrega un programa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xxl={12}>
              <div>
                <div className='d-flex justify-content-center align-items-center'>
                  {
                    datapgmPT.map(e=>{
                      return(
                      <div className={`content-img`} style={{cursor: 'pointer'}} key={e.id_pgm}>
                        <label>
                        <img className={`hover-card-border ${id_pgm==e.id_pgm?'card-border':''}`} width={`${e.tb_image?.width-50}`} height={`100%`} src={`${config.API_IMG.LOGO}${e.tb_image?.name_image}`}/>
                          <input
                            value={id_pgm}
                            type="radio"
                            hidden={true}
                            name="id_pgm"
                            onChange={(o)=>onChangeFunction(o, e)}
                          />
                        </label>
                      </div>
                      )
                    })
                  }
                </div>
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
                      <div className='mb-2'>
                        <label>Sesiones:</label>
                        <Select
                          onChange={(e) => {
                            return onInputChangeReact(e, 'id_st')
                          }}
                          name={'id_st'}
                          placeholder={'Seleccionar el numero de semanas'}
                          className="react-select"
                          options={DataSemanaPGM}
                          value={DataSemanaPGM.find(e=>e.value===id_st) || 0}
                          classNamePrefix="react-select"
                          required
                        ></Select>
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
                        <Select
                          onChange={(e) => onInputChangeReact(e, 'id_tt')}
                          name={'id_tt'}
                          placeholder={'Seleccionar la tarifa'}
                          className="react-select"
                          classNamePrefix="react-select"
                          options={DataTarifaSM}
                          value={DataTarifaSM.find(e=>e.value===id_tt) || 0}
                          required
                        ></Select>
                      </div>
                    </Col>
                      <Button type='submit'>Registrar compra</Button>
                    </Row>
                  </form>
              </div>
            </Col>
            <Col lg={12}>
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
                    <Col lg={4}>
                      <span>Entrenador:</span>
                      {dataHorario.tb_empleado?.empl_trainer}
                    </Col>
                  </Row>
                )
                }
                {dataSemana && (
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
                }
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
                {fechaInicio_programa && dataSemana && (
                  <Row>
                    <Col lg={12}>
                      <span>Inicia: {FormatoDateMask(fechaInicio_programa, 'dddd D [de] MMMM [del] YYYY')}</span>
                    </Col>
                    <Col lg={12}>
                      <span>Finaliza: {FormatoDateMask(sumarSemanas(fechaInicio_programa, dataSemana.semanas), 'dddd D [de] MMMM [del] YYYY')}</span>
                    </Col>
                  </Row>
                )
                }
            </Col>
          </Row>
        </Modal.Body>
    </Modal>
    </>
  )
}