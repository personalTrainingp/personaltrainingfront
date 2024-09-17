
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { startOfWeek, getDay, format, parse } from 'date-fns';
import 'dayjs/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { es } from 'date-fns/locale';

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { useCitaStore } from '@/hooks/hookApi/useCitaStore';
import { FormatoTimeMask } from '@/components/CurrencyMask';
import { Card } from 'react-bootstrap';
import AddEditEvent from './AddEditEvent';
dayjs.locale('es')
const locales = {
  'es': es,
};
const DragAndDropCalendar = withDragAndDrop(Calendar)

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
  if(event.status_cita==501){
    className = 'leyenda-cancelada'
  }
  return {
    style: style,
    className: className
  };
};
// const timeSlotWrapper = (props) => (
//   <div
//     {...props}
//     className={props.className}
//     onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#000')}
//     onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
//   />
// );
// Componente personalizado para mostrar solo el título de los eventos
const CustomEvent = ({ event }) => {
  console.log(dayjs(event.start).format('DD.MM.YYYY'));
  
  return(
    <p className='m-0 p-1 text-overflow-ellipsis white-space-nowrap overflow-hidden'>{
      // FormatoTimeMask(new Date(event.start), 'hh:mm A')
      // `${new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
    }
    <FormatoTimeMask date={new Date(event.start).toISOString()} format={'hh:mm A'}/>
      <br/>
      {event.title}
    </p>
  )
};
const FullCalendarWidget = ({
  onDateClick,
  onEventClick,
  onDrop,
  onEventDrop,
  events,
  tipo_serv
}) => {
  const { obtenerCitasxSERVICIO, loading, data, dataCitaxID, obtenerCitaxID, obtenerCitasxClientexServicio } = useCitaStore()
  let newData=data.map(e=>{
    return {
      id: e.id,
      title: e.tb_cliente.nombres_apellidos_cli,
      id_cli: e.id_cli,
      id_detallecita: e.id_detallecita,
      start: new Date(e.fecha_init),
      end: new Date(e.fecha_final),
      status_cita: e.status_cita,
      detalle_cita: ''
    }
  })
  const localizer = dateFnsLocalizer({
    format: (date, formatStr, locale) => format(date, formatStr, { locale: locales['es'] }),
    parse: (dateString, formatString, locale) => parse(dateString, formatString, new Date(), { locale: locales['es'] }),
    startOfWeek: (date, locale) => startOfWeek(date, { locale: locales['es'] }),
    getDay: (date, locale) => {
      const day = getDay(date);
      // Ajusta el día para que comience desde el lunes (0 para domingo, 1 para lunes, ..., 6 para sábado)
      return day
    },
    locales,
    formats: {
      timeGutterFormat: (date, culture, localizer) =>
        localizer.format(date, 'h:mm A', culture), // Formato de hora con AM/PM
    },
    culture: 'es',
  });
  useEffect(() => {
    obtenerCitasxSERVICIO( tipo_serv )
  }, [tipo_serv])

  const { defaultDate, formats, views } = useMemo(
    () => ({
      defaultDate: new Date(2015, 3, 13),
      formats: {
        timeGutterFormat: (date, culture, localizer) =>
          localizer.format(date, 'hh:mm a', culture),
      },
    }),
    []
  )
    const [onModalAddEditEvent, setonModalAddEditEvent] = useState(false)
    const [idCita, setidCita] = useState(0)
    const [selectDATE, setselectDATE] = useState({start: '', end: ''})

    const onCloseModalAddEditEvent = ()=>{
      setonModalAddEditEvent(false)
    }

    const handleSelectSlot = ({ start, end }) => {
      setidCita(0)
      const dateSelect = {start: new Date(start), end: new Date(end)}
      setonModalAddEditEvent(true)
      setselectDATE({...dateSelect})
    };
    const onDoubleSelectEvent = (e)=>{
      const dateSelect = {start: new Date(e.start), end: new Date(e.end)}
      setidCita(e.id)
      setonModalAddEditEvent(true)
      setselectDATE({...dateSelect})
    }
    const moveEvent = useCallback(
      ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
        const { allDay } = event
        if (!allDay && droppedOnAllDaySlot) {
          event.allDay = true
        }
        if (allDay && !droppedOnAllDaySlot) {
            event.allDay = false;
        }
  
        // setMyEvents((prev) => {
        //   const existing = prev.find((ev) => ev.id === event.id) ?? {}
        //   const filtered = prev.filter((ev) => ev.id !== event.id)
        //   return [...filtered, { ...existing, start, end, allDay: event.allDay }]
        // })
      },
      [setMyEvents]
    )
  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      // setMyEvents((prev) => {
      //   const existing = prev.find((ev) => ev.id === event.id) ?? {}
      //   const filtered = prev.filter((ev) => ev.id !== event.id)
      //   return [...filtered, { ...existing, start, end }]
      // })
    },
    [setMyEvents]
  )
    useEffect(() => {
      if(idCita==0)return;
      obtenerCitaxID(idCita)
    }, [idCita])
    
  return (
    <>
      {/* full calendar control */}
      {!loading&&(
        <>
        <Card>
          <Card.Body>
            <div id="calendar">
              <DragAndDropCalendar
                localizer={localizer}
                onEventDrop={moveEvent}
                onEventResize={resizeEvent}
                events={newData}
                onDoubleClickEvent={onDoubleSelectEvent}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 700 }}
                views={['week']}
                eventPropGetter={eventStyleGetter}
                defaultView="week"
                components={{
                  event: CustomEvent,  // Utiliza el componente personalizado para mostrar solo el título del evento
                  // timeSlotWrapper 
                  timeSlotWrapper: TimeSlotWrapper,
                }}
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
                step={20}
                timeslots={1}
                min={new Date(2024, 0, 1, 6, 0, 0)} // Mostrar desde las 6:00 AM
                max={new Date(2024, 0, 1, 21, 50, 0)} // Hasta las 11:59 PM
                formats={formats}
                onSelectSlot={handleSelectSlot}
                
                selectable
              />
            </div>
            <AddEditEvent show={onModalAddEditEvent} tipo_serv={tipo_serv} onHide={onCloseModalAddEditEvent} dataCita={idCita==0?null:dataCitaxID} selectDATE={selectDATE}/>
          </Card.Body>
        </Card>
        </>
      )
      }
    </>
  );
};

export default FullCalendarWidget;
