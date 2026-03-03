import dayjs from 'dayjs'
import React from 'react'
import { Button, Card } from 'react-bootstrap'
const dataProv = {
  nombre_empleado: '',
  nombres_cliente: '',
  status_cita: '',
  fecha_final: '',
  fecha_init: '',
}

export const ItemDayEvent = ({data, getEstado}) => {
  const { nombre_empleado,
    nombres_cliente,
    status_cita,
    fecha_final,
    fecha_init } = data?data:dataProv;
  console.log({data});
  
  return (
          <Card className='rounded-5'>
              <div className="row row-striped">
              <div className={`${"col-2 text-right"} ${getEstado(status_cita)}`}>
                <h5>{dayjs(fecha_init).locale('es').format('dddd')}</h5>
                <h1 className="display-4"><span>{dayjs(fecha_init).locale('es').format('DD')}</span></h1>
                <h2>{dayjs(fecha_init).locale('es').format('MMM')}</h2>
              </div>
              <div className="col-10">
                <h3 className={`"text-uppercase text-success" ${getEstado(status_cita)}`}><strong>{nombres_cliente}</strong></h3>
                <ul className="list-inline">
                  <li className="list-inline-item"><i className="fa fa-clock-o" aria-hidden="true"></i><strong>Hora:</strong> {dayjs(fecha_init).locale('es').format('hh:mm A')} - {dayjs(fecha_final).locale('es').format('hh:mm A')}</li>
                            <br/>
                  <li className="list-inline-item"><i className="fa fa-location-arrow" aria-hidden="true"></i><strong>Nutricionista:</strong> {nombre_empleado}</li>
                  <li>
                    {/* <Button className='leyenda-asistio text-black shadow-none border-none m-1 rounded-5 font-12'>Asistió</Button> */}
                    {/* <Button className='leyenda-no-asistio text-black shadow-none border-none m-1 rounded-5 font-12'>No asistió</Button> */}
                  </li>
                </ul>
              </div>
            </div>
          </Card>
  )
}
