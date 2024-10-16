import { getHorarioPgm } from '@/store/tableHorario/tablehorarioSlice'
import React, { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import { useSelector, useDispatch } from 'react-redux'
import Flatpickr from 'react-flatpickr';
import Select from 'react-select'
import { useForm } from '@/hooks/useForm'

const registerHorarioPgm={
    id_HorarioPgm: 0,
    time_HorarioPgm: '',
    aforo_HorarioPgm: '',
    trainer_HorarioPgm: '',
    estado_HorarioPgm: false
}
export const TableHorarios = ({columns, data, DataTrainerPrueba}) => {
    const dispatch = useDispatch()
    const {hrpgm} = useSelector(e=>e.hrpgm)
    const [isActive, setIsActive] = useState(false)
    const { 
        id_HorarioPgm,
        time_HorarioPgm,
        aforo_HorarioPgm,
        trainer_HorarioPgm,
        estado_HorarioPgm,
        onInputChange: onPostInputHorarioChange,
        onInputChangeButton,
        onInputChangeReact,
        onInputChangeFlaticon, formState: formStateHr, onResetForm: onResetFormHr } = useForm(hrpgm)
    const handleRowClick = (row)=>{
        console.log('Datos de la fila clickeada:', row);
        dispatch(getHorarioPgm(row))
    }
    console.log(hrpgm);
      // Renderiza el mensaje cuando no hay filas
  if (data.length === 0) {
    return <p className='text-center'>No hay horarios disponibles</p>;
  }
  
    //CRUD HORARIOS DE PROGRAMA
    const  onStartSubmitPost = (e)=>{
        e.preventDefault()
        console.log(formStateHr.id_HorarioPgm);
        if(formStateHr.id_HorarioPgm==0){
            console.log("esta registrando");
            onResetFormHr()
            return;
        }
        console.log("actualizando");
        onResetFormHr()
    }
    
    const onClickChangeisActive = (e)=>{
        setIsActive(!isActive)
        onInputChangeButton(e, isActive)
    }
  return (
        <>
        
        <form onSubmit={onStartSubmitPost}>
                        <Row>
                            <input
                                    className="form-control"
                                    value={id_HorarioPgm}
                                    onChange={onPostInputHorarioChange}
                                    // type='hidden'
                                    required
                                />
                            <Col xl={2}>
                                <div className='mb-2'>
                                    {/* <Flatpickr  options={{
                                            enableTime: true,
                                            noCalendar: true,
                                            dateFormat: "H:i",
                                            time_24hr: true,
                                        }} 
                                        placeholder='Horario'
                                        className='form-control'
                                        value={time_HorarioPgm}
                                        name='time_HorarioPgm'
                                        id='time_HorarioPgm'
                                        onChange={e=>onInputChangeFlaticon(e, 'time_HorarioPgm')}
                                        required
                                    /> */}
                                </div>
                            </Col>
                            <Col xl={2}>
                                <div className='mb-2'>
                                    <input
                                            className="form-control"
                                            placeholder="Aforo"
                                            type='number'
                                            value={aforo_HorarioPgm}
                                            name='aforo_HorarioPgm'
                                            id='aforo_HorarioPgm'
                                            onChange={onPostInputHorarioChange}
                                            required
                                    />
                                </div>
                            </Col>
                            <Col xl={4}>
                                <div className='mb-2'>
                                    <Select
                                            onChange={(e)=>onInputChangeReact(e, "trainer_HorarioPgm")}
                                            name={"trainer_HorarioPgm"}
                                            placeholder={'Seleccione el entrenador(a)'}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={DataTrainerPrueba}
                                            defaultValue={DataTrainerPrueba[trainer_HorarioPgm]}
                                            required
                                    ></Select>
                                </div>
                            </Col>
                            <Col xl={2} >
                                <div className='mb-2'>
                                    <input
                                        type='button'
                                        className={`form-control text-white p-1 
                                        ${isActive?'bg-success':'bg-danger'}
                                        `}
                                        value={isActive?'Activo':'Inactivo'}
                                        name='estado_HorarioPgm'
                                        onClick={onClickChangeisActive}
                                        id='estado_HorarioPgm'
                                    />
                                </div>
                            </Col>
                            <Col xl={2}>
                                <Button
                                type='submit'
                                >
                                    {id_HorarioPgm==0?'Agregar':'Actualizar'}</Button>
                            </Col>
                        </Row>
                    </form>
    <DataTable
        columns={columns}
        data={data}
        dense={true}
        onRowClicked={handleRowClick}
    />
    </>
  )
}




























import { useForm } from '@/hooks/useForm'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux';
const registro = {
  date_pgm: 0
}
export const ModalPrograma = ({show, hide}) => {
  // const { startObtenerTBProgramaPT } = useProgramaTrainingStore()
  // const { datapgmPT } = useSelector(e=>e.programaPT)
  // const { getProgramaFiltered } = helperFunctions()
  // useEffect(() => {
  //   startObtenerTBProgramaPT()
  // }, [datapgmPT])
  // const onClickProgramaTraining = (id)=>{
  //   console.log(id);
  //   console.log(datapgmPT);
  //   console.log(getProgramaFiltered(datapgmPT, id));
  // }
  const onSubmitRegisterPrograma = (e)=>{
    e.preventDefault()
    console.log("registrando");
  }
  const { formState, date_pgm, onInputChangeReact, onInputChange, onInputChangeFlaticon } = useForm(registro)
  return (
    <>
    
    <Flatpickr
															options={{
																enableTime: true,
																noCalendar: true,
																dateFormat: 'H:i',
																time_24hr: true,
															}}
															placeholder="Horario"
															className="form-control"
															value={date_pgm}
															name="date_pgm"
															id="date_pgm"
															onChange={(e) =>
																onInputChangeFlaticon(
																	e,
																	'date_pgm'
																)
															}
															required
														/>
    
    </>
  )
}
