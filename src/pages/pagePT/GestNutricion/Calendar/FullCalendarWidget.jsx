
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { startOfWeek, getDay, format, parse } from 'date-fns';
import 'dayjs/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { es } from 'date-fns/locale';
import AddEditEvent from './AddEditEvent';
import { useCitaStore } from '@/hooks/hookApi/useCitaStore';
dayjs.locale('es')
const locales = {
  'es': es,
};
const eventStyleGetter = (event, start, end, isSelected) => {
  const style = {
    backgroundColor: '#3174ad',
    color: 'white',
    borderRadius: '5px',
    border: 'none',
    padding: '4px 8px',
    height: '10px', // Ajusta la altura según lo deseado
    width: '200px', // Ajusta el ancho según lo deseado
    fontSize: '14px',
  };
  return {
    style: style
  };
};
// Componente personalizado para mostrar solo el título de los eventos
const CustomEvent = ({ event }) => {
  return(
    <div>{new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} : {event.title}</div>
  )
};
const FullCalendarWidget = ({
  onDateClick,
  onEventClick,
  onDrop,
  onEventDrop,
  events,
}) => {
  const { obtenerCitasxSERVICIO, data } = useCitaStore()
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
    obtenerCitasxSERVICIO()
  }, [])

  
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
  let newData=data.map(e=>{
    return {
      title: "Sin nombre",
      start: new Date(e.fecha_init),
      end: new Date(e.fecha_final)
    }
  })
    console.log(newData);
    [
      {
        title: 'Reunión con el equipo',
        start: new Date(2024, 4, 30, 10, 0), // 30 de Mayo de 2024, 10:00 AM
        end: new Date(2024, 4, 30, 11, 0),   // 30 de Mayo de 2024, 12:00 PM
      },
      {
        title: 'Cita con el doctor',
        start: new Date(2024, 5, 1, 14, 0),  // 1 de Junio de 2024, 2:00 PM
        end: new Date(2024, 5, 1, 15, 0),    // 1 de Junio de 2024, 3:00 PM
      },
      {
        title: 'Almuerzo con amigos',
        start: new Date(2024, 5, 2, 12, 0),  // 2 de Junio de 2024, 12:00 PM
        end: new Date(2024, 5, 2, 13, 0),    // 2 de Junio de 2024, 1:00 PM
      },
    ]
    const [eve, setEvents] = useState(newData);
    const [onModalAddEditEvent, setonModalAddEditEvent] = useState(false)
    const [selectDATE, setselectDATE] = useState({start: '', end: ''})
    const onClickSubmitted = (e)=>{
      setonModalAddEditEvent(true)
      console.log({start: new Date(e.start), end: new Date(e.end)});
      // console.log(e.start, e.end);
      setselectDATE({start: new Date(e.start), end: new Date(e.end).setTime(new Date(e.end).getTime() + (15 * 60 * 1000))})
    }
    const onCloseModalAddEditEvent = ()=>{
      setonModalAddEditEvent(false)
    }
  return (
    <>
      {/* full calendar control */}
      <div id="calendar">
        <Calendar
          localizer={localizer}
          events={newData}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          views={['week']}
          eventPropGetter={eventStyleGetter}
          defaultView="week"
          components={{
            event: CustomEvent, // Utiliza el componente personalizado para mostrar solo el título del evento
          }}
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            showMore: total => `+ Ver más (${total})`
          }}
          step={15}
          formats={formats}
          onSelectSlot={onClickSubmitted}
          selectable
        />
      </div>
      <AddEditEvent show={onModalAddEditEvent} onHide={onCloseModalAddEditEvent} selectDATE={selectDATE}/>
    </>
  );
};

export default FullCalendarWidget;
