import { useJornadaStore } from '@/hooks/hookApi/useJornadaStore'
import dayjs from 'dayjs'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Swal from 'sweetalert2'

export const ModalJornada = ({show, onHide, data}) => {
    const [formData, setFormData] = useState({
        observacion: "",
      });
    const [dataJornada, setDataJornada] = useState([
        {
          semana: '01',
          days: [
            { day: 'LUNES', hora_entrada: '0:00', hora_salida: '0:00' },
            { day: 'MARTES', hora_entrada: '0:00', hora_salida: '0:00' },
            { day: 'MIERCOLES', hora_entrada: '0:00', hora_salida: '0:00' },
            { day: 'JUEVES', hora_entrada: '0:00', hora_salida: '0:00' },
            { day: 'VIERNES', hora_entrada: '0:00', hora_salida: '0:00' },
            { day: 'SABADO', hora_entrada: '0:00', hora_salida: '0:00' },
            { day: 'DOMINGO', hora_entrada: '0:00', hora_salida: '0:00' },
          ],
        },
        {
            semana: '02',
            days: [
                { day: 'LUNES', hora_entrada: '0:00', hora_salida: '0:00' },
                { day: 'MARTES', hora_entrada: '0:00', hora_salida: '0:00' },
                { day: 'MIERCOLES', hora_entrada: '0:00', hora_salida: '0:00' },
                { day: 'JUEVES', hora_entrada: '0:00', hora_salida: '0:00' },
                { day: 'VIERNES', hora_entrada: '0:00', hora_salida: '0:00' },
                { day: 'SABADO', hora_entrada: '0:00', hora_salida: '0:00' },
                { day: 'DOMINGO', hora_entrada: '0:00', hora_salida: '0:00' },
              ],
          },
          {
              semana: '03',
              days: [
                  { day: 'LUNES', hora_entrada: '0:00', hora_salida: '0:00' },
                  { day: 'MARTES', hora_entrada: '0:00', hora_salida: '0:00' },
                  { day: 'MIERCOLES', hora_entrada: '0:00', hora_salida: '0:00' },
                  { day: 'JUEVES', hora_entrada: '0:00', hora_salida: '0:00' },
                  { day: 'VIERNES', hora_entrada: '0:00', hora_salida: '0:00' },
                  { day: 'SABADO', hora_entrada: '0:00', hora_salida: '0:00' },
                  { day: 'DOMINGO', hora_entrada: '0:00', hora_salida: '0:00' },
                ],
            },
            {
                semana: '04',
                days: [
                    { day: 'LUNES', hora_entrada: '0:00', hora_salida: '0:00' },
                    { day: 'MARTES', hora_entrada: '0:00', hora_salida: '0:00' },
                    { day: 'MIERCOLES', hora_entrada: '0:00', hora_salida: '0:00' },
                    { day: 'JUEVES', hora_entrada: '0:00', hora_salida: '0:00' },
                    { day: 'VIERNES', hora_entrada: '0:00', hora_salida: '0:00' },
                    { day: 'SABADO', hora_entrada: '0:00', hora_salida: '0:00' },
                    { day: 'DOMINGO', hora_entrada: '0:00', hora_salida: '0:00' },
                  ],
              },
        // Agrega las semanas restantes aquí...
      ]);
      const { startRegisterJornada } = useJornadaStore()
    const calcularTotalHoras = (horaEntrada, horaSalida) => {
        const formatoFecha = '1970-01-01'; // Fecha ficticia
        const entrada = dayjs(`${formatoFecha}T${horaEntrada}`);
        const salida = dayjs(`${formatoFecha}T${horaSalida}`);
        const diferencia = salida.diff(entrada, 'minute'); // Diferencia en minutos
        return diferencia > 0 ? `${Math.floor(diferencia / 60)} horas y ${diferencia % 60} minutos` : '0 horas Y 0 minutos';
    };
    const calcularTotalMinutos = (horaEntrada, horaSalida) => {
        const formatoFecha = '1970-01-01'; // Fecha ficticia para trabajar solo con horas
        const entrada = dayjs(`${formatoFecha}T${horaEntrada}:00`);
        const salida = dayjs(`${formatoFecha}T${horaSalida}:00`);
    
        // Validación para asegurarnos de que las fechas sean válidas
        if (!entrada.isValid() || !salida.isValid()) {
            return 0;
        }
    
        // Diferencia en minutos
        const diferencia = salida.diff(entrada, 'minute');
        return Math.max(diferencia, 0); // Evita valores negativos
    };
    const calcularTotalHorasSemana = (dy) => {
        const totalMinutos = dy.reduce((acc, day) => {
            
            const minutos = calcularTotalMinutos(day.hora_entrada, day.hora_salida);
            return acc + minutos;
        }, 0);
        
        const horas = Math.floor(totalMinutos / 60);
        const minutosRestantes = totalMinutos % 60;
        return `${horas} horas y ${minutosRestantes} minutos`;
    };
    const handleInputChange = (semanaIndex, dayIndex, field, value) => {
        const updatedJornada = [...dataJornada];
        updatedJornada[semanaIndex].days[dayIndex][field] = value;
        setDataJornada(updatedJornada);
      };
      const handleInputChangeNombreJornada = (e)=>{
        const { name, value } = e.target;
        setFormData({
          [name]: value,
        });
      }
      const onSubmitAgregarSemanasDeJornada = ()=>{
        startRegisterJornada(dataJornada, 598, formData.observacion)
        console.log(dataJornada, formData);
      }
      const footerButtons = (
        <div className='d-flex justify-align-content-end justify-content-end'>
        <a className='border-bottom-2 m-3'>CANCELAR</a>
        <Button onClick={onSubmitAgregarSemanasDeJornada} className='m-1'>GUARDAR</Button>
        </div>
      )
      
  return (
    <Dialog
        visible={show}
        onHide={onHide}
        position='top'
        style={{width: '70rem'}}
        footer={footerButtons}
        header={'Agregar una jornada'}
    >
        <label htmlFor="nombreJornada" className="form-label">
            OBSERVACION
        </label>
        <textarea
            className="form-control"
            type="text"
            name="observacion"
            placeholder=""
            value={formData.observacion}
            onChange={handleInputChangeNombreJornada}
        />
        <br/>
        <Accordion activeIndex={0}>
            {
                dataJornada.map((s, semanaIndex)=>(
                    <AccordionTab header={<span className=''>SEMANA {s.semana}</span>}>
                    <span className=''>TOTAL DE HORAS EN LA SEMANA {s.semana}: {calcularTotalHorasSemana(s.days)}</span>
                    <Row>
                        {
                            s.days.map((d, dayIndex)=>(
                                    <Col lg={4}>
                                        <div className='card p-1 m-1'>
                                            <h3 className='text-primary'>{d.day}</h3>
                                            <form>
                                                <Row>
                                                    <Col xl={12}>
                                                        <div className="mb-2">
                                                            <label htmlFor="nombre_empl" className="form-label">
                                                                Hora de entrada*
                                                            </label>
                                                            <input
                                                                className="form-control"
                                                                type="time"
                                                                name="nombre_empl"
                                                                id="nombre_empl"
                                                                placeholder=""
                                                                value={d.hora_entrada}
                                                                onChange={(e) => handleInputChange(semanaIndex, dayIndex, 'hora_entrada', e.target.value)}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col xl={12}>
                                                        <div className="mb-2">
                                                            <label htmlFor="nombre_empl" className="form-label">
                                                                Hora de salida*
                                                            </label>
                                                            <input
                                                                className="form-control"
                                                                type="time"
                                                                name="nombre_empl"
                                                                id="nombre_empl"
                                                                placeholder=""
                                                                value={d.hora_salida}
                                                                onChange={(e) => handleInputChange(semanaIndex, dayIndex, 'hora_salida', e.target.value)}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <span className='fw-bold'>
                                                        total de horas: {calcularTotalHoras(d.hora_entrada, d.hora_salida)}
                                                    </span>
                                                </Row>
                                            </form>
                                        </div>
                                    </Col>
                            ))
                        }
                    </Row>
                    </AccordionTab>
                ))
            }
        </Accordion>

    </Dialog>
  )
}
