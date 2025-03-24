import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import { Col, Row } from 'react-bootstrap'
import AddEditEvent from '../Calendar/AddEditEvent'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { ScrollPanel } from 'primereact/scrollpanel'

import { useCitaStore } from '@/hooks/hookApi/useCitaStore';
import { SidePanelClientes } from '../Calendar/SidePanelClientes'

const localizer = momentLocalizer(moment)
const DnDCalendar = withDragAndDrop(Calendar)
const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      color: 'black',
      fontFamily: '"Poppins", sans-serif',
      fontWeight: '400',
      borderRadius: '0px',
      border: 'none',
      padding: '2px 4px',
      fontSize: '15px',
    };
    let className = ''
    if (event.status_cita==="500") {
      className = 'leyenda-confirmada'
    }
    if(event.status_cita=="501"){
      className = 'leyenda-asistio'
    }
    if(event.status_cita=="502"){
      className = 'leyenda-no-asistio'
    }
    if(event.status_cita=="503"){
      className = 'leyenda-cancelada'
    }
    return {
      style: style,
      className: className
    };
  };
const App = () => {
        const { obtenerParametrosClientes, DataClientes, obtenerEmpleadosPorDepartamentoNutricion, DataEmpleadosDepNutricion } = useTerminoStore()
  const [events, setEvents] = useState([])
    const { obtenerCitasxSERVICIO, loading, data, dataCitaxID, obtenerCitaxID, obtenerCitasxClientexServicio } = useCitaStore()
    useEffect(() => {
        obtenerCitasxSERVICIO('NUTRI') // id_servicio_nutricionista
    }, [])
    let newData=data.map(e=>{
      return {
        id: e.id,
        title: e.tb_cliente?.nombres_apellidos_cli,
        id_cli: e.id_cli,
        id_detallecita: e.id_detallecita,
        start: new Date(e.fecha_init),
        end: new Date(e.fecha_final),
        status_cita: e.status_cita,
        detalle_cita: ''
      }
    })
  const [dragFromOutsideItem, setDragFromOutsideItem] = useState(null)
  const [isModalAddEditEvent, setisModalAddEditEvent] = useState(false)
  const [selectDate, setselectDate] = useState({start: '', end: ''})
  const onCancelModalAddEditEvent = ()=>{
    setisModalAddEditEvent(false)
  }
  const onOpenModalAddEditEvent = ()=>{
    setisModalAddEditEvent(true)
  }

  // Función que se ejecuta al soltar un elemento externo sobre el calendario
  const handleDropFromOutside = ({ start, end, allDay }) => {
    
    if (dragFromOutsideItem) {
      const newEvent = {
        title: dragFromOutsideItem,
        start,
        end,
      }
      
      setselectDate(newEvent)
      onOpenModalAddEditEvent()
    //   setEvents([...events, newEvent])
      setDragFromOutsideItem(null)
    }
  }

  // Asigna el título del evento externo al iniciar el drag mediante onDragStart
  const handleDragStart = (e, eventTitle) => {
    setDragFromOutsideItem(eventTitle)
    // Opcional: puedes agregar datos al objeto dataTransfer si es necesario
    e.dataTransfer.setData('text/plain', eventTitle)
  }

  useEffect(() => {
    obtenerParametrosClientes()
  }, [])
  const clientes = DataClientes.map(c=>{
    return {
        uid: c.uid,
        label: c.label,
        value: c.value
    }
  })
  

  // Ejemplo de eventos externos a arrastrar
  const externalEvents = ["CARLOS", "ROSA", "JORGE", "LUNA"]
//   const externalEvents = [{id:1, eventTitle: 'CARLOS'}, {id:2, eventTitle: 'ROSA'}, {id:3, eventTitle: 'JORGE'}, {id:4, eventTitle: 'LUNA'}]

  return (
    <div className='p-2'>
        <Row>
            <Col lg={3} className='bg-dark p-1'>
                <SidePanelClientes dataCliente={clientes} handleDragStart={handleDragStart}/>
            </Col>
            <Col lg={9}>
      <DnDCalendar
        defaultDate={new Date()}
        defaultView="week"
        events={newData}
        localizer={localizer}
        onDropFromOutside={handleDropFromOutside}
        eventPropGetter={eventStyleGetter}
        // dragFromOutsideItem={dragFromOutsideItem}
        step={10}
        timeslots={1}
        messages={{
            next: "SEMANA Siguiente",
            today: "Hoy",
            previous: "SEMANA Anterior",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            showMore: total => `+ Ver más (${total})`
          }}
        selectable
        resizable
        style={{ height: '80vh' }}
      />
            </Col>
        </Row>
        <AddEditEvent onHide={onCancelModalAddEditEvent} selectDATE={selectDate}  show={isModalAddEditEvent} tipo_serv={'NUT'}/>
    </div>
  )
}

export default App
