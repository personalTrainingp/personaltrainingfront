import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import { useCitaStore } from '@/hooks/hookApi/useCitaStore';
import { useSelector } from 'react-redux';
import AddEditEvent from '../Calendar/AddEditEvent';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

function MyCalendar({ initialEvents, onSelectSlot }) {
  const [events, setEvents] = useState(initialEvents);

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
   // Componente personalizado para las celdas de tiempo
 const TimeSlotWrapper = ({ children, value }) => {
  const day = value.getDay(); // Obtener el día de la semana (0 = domingo, 6 = sábado)
  const hour = value.getHours(); // Obtener la hora del día
  const minutes = value.getMinutes(); // Obtener los minutos

  // Deshabilitar filas en sábado de 1pm a 6:30pm
  if (
    day === 6 && // Sábado
    (
      (hour === 13) || // 1pm
      (hour > 13 && hour < 18) || // De 2pm a 5pm
      (hour === 18 && minutes === 0) // 6pm exacto
    )
  ) {
    return (
      <div style={{ backgroundColor: '#e0e0e0', pointerEvents: 'none', display: 'none' }}>
        {children}
      </div>
    );
  }

  return children;
};
  const handleEventDrop = ({ event, start, end, allDay }) => {
    // Determinar la semana del nuevo inicio (puedes ajustar esta lógica según tus necesidades)
    const startWeek = moment(start).week();

    // Contar eventos en la misma semana (excluyendo el que se está moviendo)
    const eventsInWeek = events.filter(
      e => moment(e.start).week() === startWeek && e.id !== event.id
    );

    if (eventsInWeek.length >= 2) {
      alert('No se pueden mezclar más de dos eventos en la misma celda de semana.');
      return; // Cancela el drop
    }

    // Si la validación pasa, actualiza el evento con las nuevas fechas
    const updatedEvent = { ...event, start, end, allDay };
    const nextEvents = events.map(e => (e.id === event.id ? updatedEvent : e));
    setEvents(nextEvents);
  };

  return (
    <div id='calendar'>
      <DragAndDropCalendar
        localizer={localizer}
        events={events}
        defaultView="week"
        onEventDrop={handleEventDrop}
        eventPropGetter={eventStyleGetter}
        draggableAccessor={() => true} // Asegúrate de que todos los eventos sean arrastrables
        style={{ height: 600 }}
        components={{
          // event: CustomEvent,  // Utiliza el componente personalizado para mostrar solo el título del evento
          // timeSlotWrapper 
          timeSlotWrapper: TimeSlotWrapper,
        }}
        step={10}
        timeslots={1}
        min={new Date(2024, 0, 1, 6, 0, 0)} // Mostrar desde las 6:00 AM
        max={new Date(2024, 0, 1, 21, 50, 0)} // Hasta las 11:59 PM
        // formats={formats}
        onSelectSlot={onSelectSlot}
        selectable="ignoreEvents"
      />
    </div>
  );
}

const App = ({  onDateClick,
  onEventClick,
  onDrop,
  onEventDrop,
  events,
  tipo_serv})=>{

  const { obtenerCitasxSERVICIO, loading, data, dataCitaxID, obtenerCitaxID, obtenerCitasxClientexServicio } = useCitaStore()
  
  useEffect(() => {
    obtenerCitasxSERVICIO( tipo_serv )
  }, [tipo_serv])
  
  const [onModalAddEditEvent, setonModalAddEditEvent] = useState(false)
  const [idCita, setidCita] = useState(0)
  const [selectDATE, setselectDATE] = useState({start: '', end: ''})
  const { minutosperCita } = useSelector(i=>i.ui)
  const [minPerCita, setminPerCita] = useState({})

  const onCloseModalAddEditEvent = ()=>{
    setonModalAddEditEvent(false)
  }
  useEffect(() => {
    if (idCita !== 0 && !selectDATE?.start) return; // Solo ejecutar si hay una cita seleccionada
    
    setselectDATE((prev) => ({
      ...prev,
      // end: dayjs(prev.start).add(minutosperCita.value, 'minute').toDate(),
      minD: minutosperCita.value
    }));
  }, [minutosperCita]);

  const handleSelectSlot = (slotInfo) => {
    setidCita(0)
    
    // const dateSelect = {start: new Date(start), end: new Date(end)}
    // Crear un nuevo evento con un único slot
    const newEvent = {
      start: slotInfo.start,
      // end: dayjs(slotInfo.start).add(minutosperCita.value, 'minute').toDate(), // Duración fija de 20 minutos usando dayjs
      minD: minutosperCita.value,
      title: 'Nuevo evento',
    };
    // console.log("hand", slotInfo);
    setonModalAddEditEvent(true)
    setselectDATE({...newEvent})
  };
  
  const onDoubleSelectEvent = (e)=>{
    const dateSelect = {start: new Date(e.start), end: new Date(e.end)}
    setidCita(e.id)
    setonModalAddEditEvent(true)
    setselectDATE({...dateSelect})
  }
  useEffect(() => {
    if(idCita==0)return;
    obtenerCitaxID(idCita)
  }, [idCita])
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
  
  return (
    <>
    <MyCalendar 
                onSelectSlot={handleSelectSlot} initialEvents={newData}/>
    <AddEditEvent show={onModalAddEditEvent} tipo_serv={tipo_serv} onHide={onCloseModalAddEditEvent} dataCita={idCita==0?null:dataCitaxID} selectDATE={selectDATE}/>
    </>
  )
}

export default App;